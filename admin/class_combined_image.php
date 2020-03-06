<?php
/**
 * The dashboard-specific functionality of the plugin.
 */

/**
 * The dashboard-specific functionality of the plugin.
 *
 * Defines the plugin name, version, the meta box functionality
 * and the JavaScript for loading the Media Uploader.
 *
 * @package    Combined_Image
 * @subpackage Combined_Image/admin
 * @author     Gevorg
 */
if(!class_exists('Combinedimg_Combined_Image'))
{
    class Combinedimg_Combined_Image {

        /**
         * The ID of this plugin.
         *
         * @since    0.1.0
         * @access   private
         * @var      string    $name    The ID of this plugin.
         */
        private $name;

        /**
         * The current version of the plugin.
         *
         * @since    0.1.0
         * @access   private
         * @var      string    $version    The version of the plugin
         */
        private $version;

        /**
         * Initializes the plugin by defining the properties.
         *
         * @since 0.1.0
         */
        public function __construct() {

            $this->name = 'combined_image';
            $this->version = '1.2';
            add_action( 'init', array( &$this, 'run' ) );
        }

        /**
         * Defines the hooks that will register and enqueue the JavaScriot
         * and the meta box that will render the option.
         *
         * @since 0.1.0
         */
        public function run() {

            add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
            add_action( 'add_meta_boxes', array( $this, 'add_meta_box' ) );

        }



        /**
         * Renders the meta box on the post and pages.
         *
         * @since 0.1.0
         */
        public function add_meta_box() {

            $screens = array( 'job_seeker','post', 'page', 'combinedimg_page' );

            foreach ( $screens as $screen ) {

                add_meta_box(
                    $this->name,
                    'Combined Image',
                    array( &$this, 'display_combined_image' ),
                    $screen,
                    'side'
                );

            }

        }

        /**
         * Registers the JavaScript for handling the media uploader.
         *
         * @since 0.1.0
         */
        public function enqueue_scripts() {

            wp_enqueue_media();

            wp_enqueue_style('combinedimg_mystyle', plugins_url('/css/style.css', __FILE__));
            wp_enqueue_style('combinedimg_mystyle2', plugins_url('/css/style2.css', __FILE__));

            wp_enqueue_script(
                $this->name,
                plugin_dir_url( __FILE__ ) . 'js/admin.js',
                array( 'jquery' ),
                $this->version,
                'all'
            );
            wp_enqueue_script(
                'combinedimg_bb',
                plugin_dir_url( __FILE__ ) . 'js/admin2.js',
                array( 'jquery' ),
                $this->version,
                'all'
            );
            wp_enqueue_script(
                'combinedimg_d',
                plugin_dir_url( __FILE__ ) . 'js/draggable.js',
                array( 'jquery' ),
                $this->version,
                'all'
            );
            wp_enqueue_script(
                'combinedimg_c',
                plugin_dir_url( __FILE__ ) . 'js/script.js',
                array( 'jquery' ),
                $this->version,
                'all'
            );
            wp_enqueue_script(
                'combinedimg_d',
                plugin_dir_url( __FILE__ ) . 'js/script2.js',
                array( 'jquery' ),
                $this->version,
                'all'
            );



        }

        /**
         * Renders the view that displays the contents for the meta box that for triggering
         * the meta box.
         *
         * @param    WP_Post    $post    The post object
         * @since    0.1.0
         */
        public function display_combined_image( $post ) {
            include_once( dirname( __FILE__ ) . '/views/admin.php');
        }

    }
}