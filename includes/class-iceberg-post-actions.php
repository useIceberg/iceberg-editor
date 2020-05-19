<?php
/**
 * Iceberg register post type actions
 *
 * @package Iceberg
 */

defined( 'ABSPATH' ) || exit;

/**
 * Iceberg_Post_Actions class.
 */
class Iceberg_Post_Actions {

	/**
	 * Hook in methods.
	 */
	public static function init() {
		add_filter( 'post_row_actions', array( __CLASS__, 'add_edit_links' ), 15, 2 );
		add_filter( 'page_row_actions', array( __CLASS__, 'add_edit_links' ), 15, 2 );
	}

	/**
	 * Add `Edit with Iceberg`
	 *
	 * @param array  $actions An array of row action links.
	 * @param object $post The post object.
	 *
	 * @return mixed Returns the array of row action links.
	 */
	public static function add_edit_links( $actions, $post ) {
		$is_default = get_option( 'iceberg_is_default_editor' );
		$posttypes  = get_post_types(
			array(
				'public'       => true,
				'show_in_rest' => true,
			),
			'names',
			'and'
		);

		$url    = admin_url( 'post.php?post=' . $post->ID );
		$params = array(
			'action'     => 'edit',
			'is_iceberg' => true,
		);
		if ( class_exists( 'Classic_Editor' ) ) {
			$params['classic-editor__forget'] = 'forget';
		}

		$edit_link = add_query_arg(
			$params,
			$url
		);

		$edit_actions = array(
			'edit_with_iceberg' => sprintf(
				'<a href="%1$s">%2$s</a>',
				esc_url( $edit_link ),
				__( 'Edit (Iceberg)', 'iceberg' )
			),
		);

		if ( in_array( $post->post_type, $posttypes, true ) && ! $is_default ) {
			$actions = array_slice( $actions, 0, 1, true ) + $edit_actions + array_slice( $actions, 1, count( $actions ) - 1, true );
		}

		return $actions;
	}
}

Iceberg_Post_Actions::init();
