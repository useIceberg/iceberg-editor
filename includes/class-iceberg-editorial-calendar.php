<?php
/**
 * Iceberg utility functions for editorial calendar
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
}

Iceberg_Editorial_Calendar::init();
