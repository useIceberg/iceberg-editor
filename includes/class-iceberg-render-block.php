<?php
/**
 * Manage block rendering
 *
 * @package Iceberg
 */

defined( 'ABSPATH' ) || exit;

/**
 * Manage block rendering
 */
class Iceberg_Render_Block {

	/**
	 * This plugin's instance.
	 *
	 * @var Iceberg_Render_Block
	 */
	private static $instance;

	/**
	 * Registers the plugin.
	 */
	public static function register() {
		if ( null === self::$instance ) {
			self::$instance = new Iceberg_Render_Block();
		}
	}

	/**
	 * The Constructor.
	 */
	private function __construct() {
		if ( ! is_admin() ) {
			add_action( 'render_block', array( $this, 'render_block' ), 5, 2 );
		}
	}

	/**
	 * Render block.
	 *
	 * @param mixed $block_content The block content.
	 * @param array $block The block data.
	 *
	 * @return mixed Returns the new block content.
	 */
	public function render_block( $block_content, $block ) {

		// Do not load when `iceberg-comment` is present.
		if ( isset( $block['attrs'] ) && isset( $block['attrs']['className'] ) && strpos( $block['attrs']['className'], 'iceberg-comment' ) !== false ) {
			return '';
		}

		return $block_content;
	}
}

Iceberg_Render_Block::register();
