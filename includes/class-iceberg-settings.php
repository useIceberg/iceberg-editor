<?php
/**
 * Iceberg registered settings.
 *
 * @package Iceberg
 */

defined( 'ABSPATH' ) || exit;

/**
 * Iceberg_Settings class.
 */
class Iceberg_Settings {

	/**
	 * Hook in methods.
	 */
	public static function init() {
		add_action( 'init', array( __CLASS__, 'register_settings' ) );
		add_action( 'rest_api_init', array( __CLASS__, 'send_email' ) );
	}

	/**
	 * Register settings.
	 */
	public static function register_settings() {
		global $wpdb;

		register_setting(
			'iceberg_limited_blocks',
			'iceberg_limited_blocks',
			array(
				'type'              => 'string',
				'description'       => __( 'Iceberg blocks', 'iceberg' ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
				'auth_callback'     => array( __CLASS__, 'auth_callback' ),
			)
		);

		register_setting(
			'iceberg_is_default_editor',
			'iceberg_is_default_editor',
			array(
				'type'              => 'boolean',
				'description'       => __( 'Iceberg interface setting to enable as default editor', 'iceberg' ),
				'sanitize_callback' => null,
				'show_in_rest'      => true,
				'default'           => false,
			)
		);

		// Store theme settings to user meta.
		register_meta(
			'user',
			$wpdb->get_blog_prefix() . 'iceberg_theme_settings',
			array(
				'type'         => 'object',
				'single'       => true,
				'show_in_rest' => array(
					'name'   => 'iceberg_theme_settings',
					'type'   => 'object',
					'schema' => array(
						'type'                 => 'object',
						'properties'           => array(),
						'additionalProperties' => true,
					),
				),
			)
		);

		register_meta(
			'post',
			'_iceberg_editor_remember',
			array(
				'show_in_rest'  => true,
				'single'        => true,
				'type'          => 'boolean',
				'auth_callback' => function() {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}

	/**
	 * Determine if the current user can edit posts.
	 *
	 * @return bool True when can edit posts, else false.
	 */
	private static function auth_callback() {
		return current_user_can( 'read' );
	}

	/**
	 * Process sending of emails for the feedback component.
	 */
	public static function send_email() {
		register_rest_route(
			'iceberg/v1',
			'/send',
			array(
				'methods'  => 'POST',
				'callback' => function( $data ) {
					$name = wp_strip_all_tags( trim( $data->get_param( 'name' ) ) );
					$message = wp_strip_all_tags( trim( $data->get_param( 'message' ) ) );
					$email = 'support@useiceberg.helpscoutapp.com';

					$subject = __( 'Iceberg Feedback', 'iceberg' );
					$headers = 'From: ' . $email . "\r\n" .
						'Reply-To: ' . $email . "\r\n";

					$sent = wp_mail( $email, $subject, wp_strip_all_tags( $message ), $headers );

					if ( $sent ) {
						echo wp_json_encode( array( 'email_sent' => true ) );
					} else {
						echo wp_json_encode( array( 'email_sent' => false ) );
					}

					die();
				},
			)
		);
	}
}

Iceberg_Settings::init();
