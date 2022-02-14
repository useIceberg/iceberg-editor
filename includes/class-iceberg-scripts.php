<?php
/**
 * Iceberg scripts.
 *
 * @package Iceberg
 */

defined( 'ABSPATH' ) || exit;

/**
 * Iceberg_Scripts class.
 */
class Iceberg_Scripts {

	/**
	 * Hook in methods.
	 */
	public static function init() {

		// Add support for the demo.
		add_action(
			'init',
			function() {
				if ( ! is_admin() && apply_filters( 'iceberg_is_demo', __return_false() ) ) {
					add_action( 'enqueue_block_assets', array( __CLASS__, 'scripts' ) );
					add_action( 'enqueue_block_assets', array( __CLASS__, 'styles' ) );
				}
			}
		);

		// Only enqueue block assets if this is a block editor page.
		if ( ! self::is_edit_or_new_admin_page() ) {
			return;
		}

		add_action( 'enqueue_block_assets', array( __CLASS__, 'scripts' ) );
		add_action( 'enqueue_block_assets', array( __CLASS__, 'styles' ) );
	}

	/**
	 * Get scripts.
	 */
	public static function scripts() {
		list( $iceberg_theme, ) = (array) get_theme_support( 'iceberg-editor' );

		wp_enqueue_script(
			'iceberg',
			self::asset_url() . '/build/index.js',
			array_merge( self::asset_file( 'index', 'dependencies' ), array( 'wp-api', 'wp-compose' ) ),
			self::asset_file( 'iceberg', 'version' ),
			true
		);

		wp_localize_script(
			'iceberg',
			'icebergSettings',
			array(
				'siteurl'              => wp_parse_url( get_bloginfo( 'url' ) ),
				'icebergSettingsNonce' => wp_create_nonce( 'wp_rest' ),
				'isDefaultEditor'      => get_option( 'iceberg_is_default_editor' ),
				'customThemes'         => ( false !== $iceberg_theme ) ? $iceberg_theme : '',
				'license'              => get_option( 'iceberg_license_active' ),
				'isGutenberg'          => defined( 'GUTENBERG_VERSION' ) || ( function_exists( 'is_plugin_active' ) && is_plugin_active( 'gutenberg/gutenberg.php' ) ) ? true : false,
				'isEditIceberg'        => isset( $_GET['is_iceberg'] ) ? sanitize_text_field( $_GET['is_iceberg'] ) : false // phpcs:ignore
			)
		);
	}

	/**
	 * Get styles.
	 */
	public static function styles() {
		wp_enqueue_style(
			'iceberg-style',
			self::asset_url() . '/build/style-index.css',
			array(),
			self::asset_file( 'style-index', 'version' )
		);

		// Add inline style for the editor themes to hook into.
		wp_add_inline_style( 'iceberg-style', ':root{}' );
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

	/**
	 * Checks if admin page is the 'edit' or 'new-post' screen.
	 *
	 * @return bool true or false
	 */
	public static function is_edit_or_new_admin_page() {
		global $pagenow;
		return ( is_admin() && ( $pagenow === 'post.php' || $pagenow === 'post-new.php' ) ); // phpcs:ignore
	}
}

Iceberg_Scripts::init();
