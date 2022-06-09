<?php
/**
 * Plugin Name:       Iceberg Editor
 * Description:       Iceberg is a beautiful, flexible markdown editor for writing within the WordPress block editor. Iceberg leverages the best of WordPress, and the best of the new block editor, while getting out of your way – allowing you to focus on publishing your next post.
 * Plugin URI:        https://useiceberg.com?utm_source=wp-plugins&utm_medium=iceberg-plugin&utm_campaign=plugin-uri
 * Requires at least: 5.7
 * Version:           1.4.0
 * Author:            Iceberg
 * Author URI:        https://useiceberg.com?utm_source=wp-plugins&utm_medium=iceberg-plugin&utm_campaign=author-uri
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       iceberg
 * Domain Path:       /languages/
 *
 * @package           Iceberg
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
