<?php
/**
 * Iceberg setup
 *
 * @package Iceberg
 */

defined( 'ABSPATH' ) || exit;

/**
 * Main Iceberg class.
 */
final class Iceberg {

	/**
	 * The single instance of the class.
	 *
	 * @var self|null
	 */
	protected static $instance = null;

	/**
	 * Main Iceberg Instance.
	 *
	 * Ensures only one instance of Iceberg is loaded or can be loaded.
	 *
	 * @static
	 * @see Iceberg()
	 * @return self Main instance.
	 */
	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Cloning is forbidden.
	 */
	public function __clone() {
		_doing_it_wrong( __FUNCTION__, __( 'Cloning is forbidden.', 'iceberg' ), ICEBERG_VERSION );
	}

	/**
	 * Unserializing instances of this class is forbidden.
	 */
	public function __wakeup() {
		_doing_it_wrong( __FUNCTION__, __( 'Unserializing instances of this class is forbidden.', 'iceberg' ), ICEBERG_VERSION );
	}

	/**
	 * Iceberg Constructor.
	 */
	public function __construct() {
		$this->define_constants();
		$this->includes();
		$this->init_hooks();
	}

	/**
	 * Init Iceberg when WordPress Initialises.
	 */
	public function init() {
		$this->load_plugin_textdomain();
	}

	/**
	 * Hook into actions and filters.
	 */
	private function init_hooks() {
		add_action( 'init', array( $this, 'init' ), 0 );

		// Filters.
		add_filter( 'write_your_story', array( $this, 'write_your_story' ), 10, 2 );
		add_filter( 'enter_title_here', array( $this, 'enter_title_here' ), 10, 2 );
	}

	/**
	 * Define constant if not already set.
	 *
	 * @param string      $name  Constant name.
	 * @param string|bool $value Constant value.
	 */
	private function define( $name, $value ) {
		if ( ! defined( $name ) ) {
			define( $name, $value );
		}
	}

	/**
	 * Define Iceberg Constants.
	 */
	private function define_constants() {
		$this->define( 'ICEBERG_ABSPATH', dirname( ICEBERG_PLUGIN_FILE ) . '/' );
		$this->define( 'ICEBERG_PLUGIN_BASE', plugin_basename( __FILE__ ) );
		$this->define( 'ICEBERG_PLUGIN_BASENAME', plugin_basename( ICEBERG_PLUGIN_FILE ) );
		$this->define( 'ICEBERG_PLUGIN_DIR', plugin_dir_path( ICEBERG_PLUGIN_FILE ) );
		$this->define( 'ICEBERG_PLUGIN_FILE', __FILE__ );
		$this->define( 'ICEBERG_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
		$this->define( 'ICEBERG_VERSION', '1.0.0' );
	}

	/**
	 * Include required core files used in admin and on the frontend.
	 */
	public function includes() {
		include_once ICEBERG_ABSPATH . 'includes/class-iceberg-scripts.php';
		include_once ICEBERG_ABSPATH . 'includes/class-iceberg-settings.php';
		include_once ICEBERG_ABSPATH . 'includes/class-iceberg-render-block.php';
		include_once ICEBERG_ABSPATH . 'includes/class-iceberg-license-handler.php';
		include_once ICEBERG_ABSPATH . 'includes/class-iceberg-post-actions.php';
	}

	/**
	 * Filters the title field placeholder text.
	 *
	 * @link https://developer.wordpress.org/reference/hooks/enter_title_here/
	 */
	public function enter_title_here( $text, $post ) {
		return __( 'Title', 'iceberg' );
	}

	/**
	 * Filters the default body placeholder text.
	 *
	 * @link https://developer.wordpress.org/reference/hooks/write_your_story/
	 */
	public function write_your_story( $text, $post ) {
		return __( 'Tell your story...', 'iceberg' );
	}

	/**
	 * Load localisation data.
	 */
	public function load_plugin_textdomain() {
		load_plugin_textdomain( 'iceberg', false, dirname( ICEBERG_PLUGIN_BASENAME ) . '/languages/' );
	}

	/**
	 * Enqueue JavaScript localization data.
	 */
	public function load_block_localization() {
		if ( function_exists( 'wp_set_script_translations' ) ) {
			wp_set_script_translations( 'iceberg-editor', 'iceberg', ICEBERG_PLUGIN_DIR . '/languages' );
		}
	}
}
