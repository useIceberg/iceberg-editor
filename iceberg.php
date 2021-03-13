<?php
/**
 * Plugin Name: Iceberg Editor
 * Plugin URI: https://useiceberg.com/
 * Description: Iceberg is a beautiful, flexible markdown editor for writing within the WordPress block editor. Iceberg leverages the best of WordPress, and the best of the new block editor, while getting out of your way – allowing you to focus on publishing your next post.
 * Version: 1.1.0
 * Author: Iceberg
 * Author URI: https://useiceberg.com/
 * Text Domain: iceberg
 * Tested up to: 5.4.1
 * Domain Path: /languages/
 *
 * @package Iceberg
 */

defined( 'ABSPATH' ) || exit;

if ( ! defined( 'ICEBERG_PLUGIN_FILE' ) ) {
	define( 'ICEBERG_PLUGIN_FILE', __FILE__ );
}

// Include the main Iceberg class.
if ( ! class_exists( 'Iceberg' ) ) {
	include_once dirname( __FILE__ ) . '/includes/class-iceberg.php';
}

/**
 * Returns the main instance of Iceberg.
 *
 * @return Iceberg
 */
function Iceberg() { // phpcs:ignore WordPress.NamingConventions.ValidFunctionName.FunctionNameInvalid
	return Iceberg::instance();
}

// Global for backwards compatibility.
$GLOBALS['iceberg'] = Iceberg();
