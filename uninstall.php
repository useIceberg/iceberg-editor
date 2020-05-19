<?php
/**
 * Iceberg uninstall
 *
 * @package Iceberg
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	die;
}

$iceberg_options = array(
	'iceberg_limited_blocks',
	'iceberg_theme_settings',
	'iceberg_heading_indicators',
	'iceberg_scaled_heading',
	'iceberg_text_indent',
	'iceberg_minimize_images',
	'iceberg_ui_themes',
	'iceberg_ui_toc',
	'iceberg_ui_shortcuts',
);

foreach ( $iceberg_options as $iceberg_option ) {

	delete_option( $iceberg_option );

}
