<?php
/**
 * Manage EDD licenses
 *
 * @package Iceberg
 */
// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * Manage EDD licenses
 *
 * @since 1.0
 */
class Iceberg_License_Handler {
	/**
	 * This plugin's instance.
	 *
	 * @var Iceberg_License_Handler
	 */

	private static $instance;

	private $file;
	private $license;
	private $item_shortname;
	private $author;
	private $item_name = 'Iceberg';
	private $item_id   = 11;
	private $version   = ICEBERG_VERSION;
	private $api_url   = 'https://useiceberg.com/edd-sl-api/';
	/**
	 * Registers the plugin.
	 */
	public static function register() {
		if ( null === self::$instance ) {
			self::$instance = new Iceberg_License_Handler();
			self::$instance->includes();
		}
	}
	/**
	 * The Constructor.
	 */
	public function __construct() {
		$this->item_shortname = 'iceberg';
		$license_data = get_option( $this->item_shortname . '_license_active' );

		if( $license_data && isset( $license_data->key ) ){
			$this->license = $license_data->key;
		}

		add_action(
			'rest_api_init',
			function () {
				register_rest_route(
					'iceberg/v1',
					'/license/(?P<action>[a-zA-Z0-9-]+)/(?P<license>[a-zA-Z0-9-]+)',
					array(
						'methods'              => 'POST',
						'permissions_callback' => array( $this, 'permissions' ),
						'args'                 => array(
							'action'  => array(
								'required'          => true,
								'validate_callback' => array( $this, 'validate_action' ),
							),
							'license' => array(
								'required'          => true,
								'sanitize_callback' => 'sanitize_text_field',
							),
						),
						'callback'             => array( $this, 'handle_license' ),
					)
				);
			}
		);

		if ( is_admin() ) {
			add_action( 'admin_init', array( $this, 'auto_updater' ), 0 );

			// For testing license notices, uncomment this line to force checks on every page load
			// add_action( 'admin_init', array( $this, 'weekly_license_check' ) );

			add_action( 'edd_weekly_scheduled_events', array( $this, 'weekly_license_check' ) );
		}
	}

	/**
	 * Include the updater class
	 *
	 * @access  private
	 * @return  void
	 */
	private function includes() {
		if ( ! class_exists( 'EDD_SL_Plugin_Updater' ) && is_admin() ) {
			require_once ICEBERG_PLUGIN_DIR . 'includes/edd/EDD_SL_Plugin_Updater.php';
		}
	}

	/**
	 * Handle license activation
	 *
	 * @access  public
	 * @return  object|null
	 */
	public function handle_license( WP_REST_Request $request ) {
		$action  = $request->get_param( 'action' );
		$license = $request->get_param( 'license' );

		$api_params = array(
			'edd_action' => $action . '_license',
			'license'    => $license,
			'item_name'  => urlencode( $this->item_name ),
			'url'        => home_url(),
		);

		// Call the API
		$response = wp_remote_post(
			$this->api_url,
			array(
				'timeout'   => 15,
				'sslverify' => false,
				'body'      => $api_params,
			)
		);

		// Make sure there are no errors
		if ( is_wp_error( $response ) ) {
			return null;
		}

		// Tell WordPress to look for updates
		set_site_transient( 'update_plugins', null );

		// Decode license data
		$license_data = json_decode( wp_remote_retrieve_body( $response ) );

		if ( $license_data && is_object( $license_data ) && 'valid' === $license_data->license ) {
			$license_data->key = $license;
		}

		update_option( $this->item_shortname . '_license_active', $license_data );

		return $license_data;
	}

	/**
	 * Permissions callback for requests
	 *
	 * Checks if user is logged in.
	 *
	 * @since 0.1.0
	 *
	 * @return bool
	 */
	public function permissions() {
		return is_user_logged_in();
	}

	/**
	 * Validate update action
	 *
	 * @since 1.0
	 *
	 * @param $value
	 *
	 * @return bool
	 */
	public function validate_action( $value ) {
		return in_array( $value, array( 'activate', 'deactivate' ) );
	}

	/**
	 * Check if license key is valid once per week
	 *
	 * @access  public
	 * @since   1.0
	 * @return  void
	 */
	public function weekly_license_check() {
		if ( empty( $this->license ) ) {
			return;
		}

		// data to send in our API request
		$api_params = array(
			'edd_action' => 'check_license',
			'license'    => $this->license,
			'item_name'  => urlencode( $this->item_name ),
			'url'        => home_url(),
		);

		// Call the API
		$response = wp_remote_post(
			$this->api_url,
			array(
				'timeout'   => 15,
				'sslverify' => false,
				'body'      => $api_params,
			)
		);

		// make sure the response came back okay
		if ( is_wp_error( $response ) ) {
			return;
		}

		$license_data = json_decode( wp_remote_retrieve_body( $response ) );

		if ( $license_data ) {
			$license_data->key = $this->license;
		}

		update_option( $this->item_shortname . '_license_active', $license_data );
	}

	/**
	 * Auto updater
	 *
	 * @access  private
	 * @return  void
	 */
	public function auto_updater() {
		$args = array(
			'version' => $this->version,
			'license' => $this->license,
		);

		if ( ! empty( $this->item_id ) ) {
			$args['item_id'] = $this->item_id;
		} else {
			$args['item_name'] = $this->item_name;
		}

		// Setup the updater
		$edd_updater = new EDD_SL_Plugin_Updater(
			$this->api_url,
			ICEBERG_PLUGIN_FILE,
			$args
		);
	}
}
Iceberg_License_Handler::register();
