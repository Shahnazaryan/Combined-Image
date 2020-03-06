<?php
if(!class_exists('Admin_Interface'))
{
    class Admin_Interface{
        public function __construct()
		{
            add_action('init',array($this, 'init'));
            add_action('plugin_template_page', array(&$this,'combined_image_templates'));
        }
        public function init(){
            add_action('admin_menu',array($this, 'combinedimg_my_admin_menu'));
        }
        public function combinedimg_my_admin_menu() {
            add_media_page('Combined Image', 'Combined Image', 'manage_options',
                'combinedimg_page',array(&$this,'combinedimg_page'),  6);
        }
        public function combinedimg_page() {
            do_action('plugin_template_page');
        }
        public static function combined_image_templates() {
            include(sprintf("%s/admin/views/combined_image_template.php", dirname(__FILE__)));
        } 
        public function call_media() {
            wp_enqueue_media();
        }
    }
}
