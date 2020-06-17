<?php
/**
 * Iceberg utility functions for editorial calendar
 * /wp-json/wp/v2/posts?orderby=date&order=desc&after=2020-05-01T00:00:00&before=2020-07-01T00:00:00&iceberg_per_page=1000
 *
 * @package Iceberg
 */

defined( 'ABSPATH' ) || exit;

/**
 * Iceberg_Editorial_Calendar class.
 */
class Iceberg_Editorial_Calendar {

	/**
	 * Hook in methods.
	 */
	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'add_post_menu' ) );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'styles' ) );
		add_action( 'rest_api_init', array( __CLASS__, 'rest_api_init' ) );
		add_filter( 'rest_post_query', array( __CLASS__, 'change_post_per_page' ), 10, 2 );
	}

	/**
	 * Add `Calendar` submenu page under a custom post type parent.
	 */
	public static function add_post_menu() {
		$post_types = apply_filters( 'iceberg_editorial_calendar_post_types', array( 'post', 'page' ) );
		$parent     = 'edit.php';

		foreach ( $post_types as $post_type ) {
			$slug = ( $post_type !== 'post' ) ? '?post_type=' . $post_type : '';
			add_submenu_page(
				$parent . $slug,
				__( 'Editorial Calendar', 'iceberg' ),
				__( 'Calendar', 'iceberg' ),
				'manage_options',
				'iceberg-editorial-' . $post_type . '-calendar',
				array( __CLASS__, 'render_editorial_calendar' )
			);
		}
	}

	/**
	 * Display callback for the submenu page.
	 */
	public static function render_editorial_calendar() {
		$post_type = isset( $_GET['post_type'] ) ? sanitize_text_field( $_GET['post_type'] ) : 'post';
		?>
		<div class="wrap">
			<div id="iceberg-render-editorial-calendar" type="<?php echo $post_type; ?>"></div>
		</div>
		<?php
	}

	/**
	 * Get styles  and scripts.
	 */
	public static function styles() {
		global $pagenow;

		if ( in_array( $pagenow, array( 'edit.php' ) ) && isset( $_GET['page'] ) && strpos( $_GET['page'], 'iceberg-editorial' ) !== false ) {
			wp_enqueue_style(
				'iceberg-calendar-admin-style',
				self::asset_url() . '/build/iceberg-calendar.css',
				array(),
				self::asset_file( 'iceberg-calendar', 'version' )
			);

			wp_enqueue_script(
				'iceberg-calendar-admin-script',
				self::asset_url() . '/build/calendar.js',
				array_merge( self::asset_file( 'calendar', 'dependencies' ), array( 'wp-api', 'wp-compose', 'wp-element', 'wp-data', 'wp-block-editor', 'wp-editor' ) ),
				self::asset_file( 'calendar', 'version' ),
				true
			);
		}
	}

	/**
	 * Get asset URL.
	 */
	public static function asset_url() {
		return untrailingslashit( plugins_url( '/', dirname( __FILE__ ) ) );
	}

	/**
	 * Get asset file.
	 *
	 * @param string $handle Ass handle to reference.
	 * @param string $key What do we want to return: version or dependencies.
	 */
	public static function asset_file( $handle, $key ) {
		$default_asset_file = array(
			'dependencies' => array(),
			'version'      => ICEBERG_VERSION,
		);

		$asset_filepath = ICEBERG_PLUGIN_DIR . "/build/{$handle}.asset.php";
		$asset_file     = file_exists( $asset_filepath ) ? include $asset_filepath : $default_asset_file;

		if ( 'version' === $key ) {
			return $asset_file['version'];
		}

		if ( 'dependencies' === $key ) {
			return $asset_file['dependencies'];
		}
	}

	public static function change_post_per_page( $args, $request ) {
		$max                    = max( (int) $request->get_param( 'iceberg_per_page' ), 200 );
		$args['posts_per_page'] = $max;
		return $args;
	}

	public static function rest_api_init() {
		register_rest_route(
			'iceberg/v1',
			'/posts/',
			array(
				'methods'      => 'GET',
				'callback'     => array( __CLASS__, 'rest_api_callback' ),
				'show_in_rest' => true,
			)
		);
	}

	public static function rest_api_callback( WP_REST_Request $request ) {
		global $wpdb;
		$parameters = $request->get_params();

		$posts = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT ID, post_title AS title, post_status, post_date AS start FROM $wpdb->posts
			WHERE post_type = '%s' 
			AND post_status IN ( 'publish', 'draft', 'pending', 'future' ) 
			AND post_date BETWEEN '%s' AND '%s'",
				$parameters['post_type'],
				$parameters['after'],
				$parameters['before'],
				$parameters['numberposts']
			)
		);

		return new WP_REST_Response( $posts, 200 );
	}
}

Iceberg_Editorial_Calendar::init();
