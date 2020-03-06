<?php
/**
 * @wordpress-plugin
 * Plugin Name: Combined Image
 * Plugin URI:  TODO
 * Description: Combine multiple images to get a single featured image for your post.
 * Version:     0.1.0
 * Author:      Gevorg
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    0.1.0 */

if(!class_exists('Combined_Image'))
{
    class Combined_Image{
        /**
		 * Construct the plugin object
		 */
		public function __construct()
		{            
            /**
             * Includes the core plugin class for executing the plugin.
             */
            require_once(sprintf("%s/admin/class_combined_image.php", dirname(__FILE__)));
            require_once(sprintf("%s/interface.php", dirname(__FILE__)));

            $plugin = new Combinedimg_Combined_Image();
            $interface = new Admin_Interface();
            add_action('wp_ajax_combine', array(&$this,'combine_images'));	
        }
        
        public function combinedimg_Generate_Featured_Image( $image_url, $post_id  )
        {
            $upload_dir = wp_upload_dir();
            $image_data = file_get_contents($image_url);
            $filename = basename($image_url);
            if(wp_mkdir_p($upload_dir['path']))     
                $file = $upload_dir['path'] . '/' . $filename;
            else                                    
                $file = $upload_dir['basedir'] . '/' . $filename;
            file_put_contents($file, $image_data);
        
            $wp_filetype = wp_check_filetype($filename, null );
            $attachment = array(
                'post_mime_type' => $wp_filetype['type'],
                'post_title' => sanitize_file_name($filename),
                'post_content' => '',
                'post_status' => 'inherit'
            );
            $attach_id = wp_insert_attachment( $attachment, $file, $post_id );
            require_once(ABSPATH . 'wp-admin/includes/image.php');
            $attach_data = wp_generate_attachment_metadata( $attach_id, $file );
            $res1= wp_update_attachment_metadata( $attach_id, $attach_data );
            $res2= set_post_thumbnail( $post_id, $attach_id );
            return $attach_id;
        }
        
        public function combinedimg_check_extention_create_image($url) 
        {
            $ext = pathinfo($url, PATHINFO_EXTENSION);
        
            if($ext == 'jpg' || $ext == 'jpeg'){
                return imagecreatefromjpeg($url);
            }else if($ext == 'png'){
                return imagecreatefrompng($url);
            }else if($ext == 'gif'){
                return imagecreatefromgif($url);
            }
        }
        public function combine_images() 
        {
            $post_data = $_POST;
            
            $f_width  = $post_data['f_width'];
            $f_height = $post_data['f_height'];
           
            if($post_data['cols'] == 3) {
                $positions = $this->combined_get_positions($post_data['position']);
                $sizes = $this->combined_get_sizes($post_data['size']);
        
              
                $percent1 = $sizes[0];
                $percent2 = $sizes[1];
                $percent3 = $sizes[2];
        
              
                //$img1_position = $positions['img1'];
                //$img1_position_array = explode(' ', str_replace('px', '', $img1_position));
                $img1_x = $positions[0][0];
                $img1_y = $positions[0][1];
                $img2_x = $positions[1][0];
                $img2_y = $positions[1][1];
                $img3_x = $positions[2][0];
                $img3_y = $positions[2][1];
        
        
                //Combine the images using GD library
                // Create image instances
                $src1 = $this->combinedimg_check_extention_create_image($post_data['images']['img1']);
                $src2 = $this->combinedimg_check_extention_create_image($post_data['images']['img2']);
                $src3 = $this->combinedimg_check_extention_create_image($post_data['images']['img3']);
        
                list($src1_width, $src1_height) = getimagesize($post_data['images']['img1']);
                list($src2_width, $src2_height) = getimagesize($post_data['images']['img2']);
                list($src3_width, $src3_height) = getimagesize($post_data['images']['img3']);
                
              
                $r1_width = ($f_width/3) * $percent1;
                $r2_width = ($f_width/3) * $percent2;
                $r3_width = ($f_width/3) * $percent3;
        
                $r1_height = ($src1_height * $r1_width) / $src1_width;//$src1_height * $percent1;
                $r2_height = ($src2_height * $r2_width) / $src2_width;//$src2_height * $percent2;
                $r3_height = ($src3_height * $r3_width) / $src3_width;//$src3_height * $percent3;
        
                $r1 = imagecreatetruecolor($r1_width, $r1_height);
                $r2 = imagecreatetruecolor($r2_width, $r2_height);
                $r3 = imagecreatetruecolor($r3_width, $r3_height);
        
                imagecopyresampled($r1, $src1, 0, 0, 0, 0, $r1_width, $r1_height, $src1_width, $src1_height);
                imagecopyresampled($r2, $src2, 0, 0, 0, 0, $r2_width, $r2_height, $src2_width, $src2_height);
                imagecopyresampled($r3, $src3, 0, 0, 0, 0, $r3_width, $r3_height, $src3_width, $src3_height);
        
                if($post_data['border'] == "true"){
                    $border = imagecreatetruecolor(3, $f_height);
                    $color = imagecolorallocate($border, 255, 255, 255);
                    imagefill($border, 0, 0, $color);
                    $dest = imagecreatetruecolor(($f_width + 6) , $f_height);
                
                    // Copy
                    imagecopy($dest, $r1, $img1_x, $img1_y, 0, 0, ($f_width/3) + ($img1_x * -1), ($f_width/1.5) + ($img1_y * -1));
                    imagecopy($dest, $border, ($f_width/3), 0, 0, 0, 3, $f_height);
                    imagecopy($dest, $r2, ($f_width/3 + 3), $img2_y, $img2_x * -1, 0, ($f_width/3 + 3), $f_height + ($img2_y * -1));
                    imagecopy( $dest, $border, ($f_width/1.5 + 3), 0, 0, 0, 3, $f_height);
                    imagecopy($dest, $r3, ($f_width/1.5 + 6), $img3_y, $img3_x * -1, 0, ($f_width/3), $f_height + ($img3_y * -1));
        
                }else{
                    $dest = imagecreatetruecolor($f_width, $f_height);
                
                    // Copy
                    imagecopy($dest, $r1, $img1_x, $img1_y, 0, 0, ($f_width/3) + ($img1_x * -1), $f_height + ($img1_y * -1));
                    imagecopy($dest, $r2, ($f_width/3), $img2_y, $img2_x * -1, 0, ($f_width/3), $f_height + ($img2_y * -1));
                    imagecopy($dest, $r3, ($f_width/1.5), $img3_y, $img3_x * -1, 0, ($f_width/3), $f_height + ($img3_y * -1));
                }
                // Output and free from memory
                //header('Content-Type: image/gif');
                $upload_dir = wp_upload_dir();
                $name = '_' . $src1_width . '_' . $src1_height.rand(0, 99999999999999) . microtime(true);
                imagejpeg($dest, $upload_dir['path'] . $name . '.jpg', 100);
        
                $thumb_id = $this->combinedimg_Generate_Featured_Image($upload_dir['path'] . $name . '.jpg', $post_data['post']);
                //imagedestroy($dest);
                imagedestroy($src1);
                imagedestroy($src2);
                imagedestroy($src3);
            }
            if($post_data['cols'] == 2) {
        
                $positions = $this->combined_get_positions($post_data['position']);
                $sizes = $this->combined_get_sizes($post_data['size']);
        
                $percent1 = $sizes[0];
                $percent2 = $sizes[1];
                //$percent3 = $sizes[2] / 100;
        
                //print_r($sizes); die;
        
                //$img1_position = $positions['img1'];
                //$img1_position_array = explode(' ', str_replace('px', '', $img1_position));
                $img1_x = $positions[0][0];
                $img1_y = $positions[0][1];
                $img2_x = $positions[1][0];
                $img2_y = $positions[1][1];
                //$img3_x = $positions[2][0];
                //$img3_y = $positions[2][1];
        
        
                //Combine the images using GD library
                // Create image instances
                $src1 = $this->combinedimg_check_extention_create_image($post_data['images']['img1']);
                $src2 = $this->combinedimg_check_extention_create_image($post_data['images']['img2']);
                //$src3 = $this->combinedimg_check_extention_create_image($post_data['images']['img3']);
        
                list($src1_width, $src1_height) = getimagesize($post_data['images']['img1']);
                list($src2_width, $src2_height) = getimagesize($post_data['images']['img2']);
                //list($src3_width, $src3_height) = getimagesize($post_data['images']['img3']);
        
                $r1_width = ($f_width/2) * $percent1;
                $r2_width = ($f_width/2) * $percent2;
                //$r3_width = 315 * $percent3;
        
                $r1_height = ($src1_height * $r1_width) / $src1_width;//$src1_height * $percent1;
                $r2_height = ($src2_height * $r2_width) / $src2_width;//$src2_height * $percent2;
                //$r3_height = ($src3_height * $r3_width) / $src3_width;//$src3_height * $percent3;
        
                $r1 = imagecreatetruecolor($r1_width, $r1_height);
                $r2 = imagecreatetruecolor($r2_width, $r2_height);
                //$r3 = imagecreatetruecolor($r3_width, $r3_height);
        
                imagecopyresampled($r1, $src1, 0, 0, 0, 0, $r1_width, $r1_height, $src1_width, $src1_height);
                imagecopyresampled($r2, $src2, 0, 0, 0, 0, $r2_width, $r2_height, $src2_width, $src2_height);
                //imagecopyresampled($r3, $src3, 0, 0, 0, 0, $r3_width, $r3_height, $src3_width, $src3_height);
        
                if($post_data['border'] == "true"){
                    $border = imagecreatetruecolor(3, $f_height);
                    $color = imagecolorallocate($border, 255, 255, 255);
                    imagefill($border, 0, 0, $color);
                    $dest = imagecreatetruecolor(($f_width + 6), $f_height);
                
                    // Copy
                    imagecopy($dest, $r1, $img1_x, $img1_y, 0, 0, ($f_width/2) + ($img1_x * -1), $f_height + ($img1_y * -1));
                    imagecopy($dest, $border, ($f_width/2), 0, 0, 0, 3, $f_height);
                    imagecopy($dest, $r2, ($f_width/2+3), $img2_y, $img2_x * -1, 0, ($f_width/2+3), $f_height + ($img2_y * -1));
        
                }else{
                    $dest = imagecreatetruecolor($f_width, $f_height);
        
                    // Copy
                    imagecopy($dest, $r1, $img1_x, $img1_y, 0, 0, ($f_width/2) + ($img1_x * -1), $f_height + ($img1_y * -1));
                    imagecopy($dest, $r2, ($f_width/2), $img2_y, $img2_x * -1, 0, ($f_width/2), $f_height + ($img2_y * -1));
                    //imagecopy($dest, $r3, 630, $img3_y, $img3_x * -1, 0, 200, 420 + ($img3_y * -1));
                }
                // Output and free from memory
                //header('Content-Type: image/gif');
                $upload_dir = wp_upload_dir();
                $name = '_' . $src1_width . '_' . $src1_height.rand(0, 99999999999999) . microtime(true);
                imagejpeg($dest, $upload_dir['path'] . $name . '.jpg', 100);
        
                $thumb_id = $this->combinedimg_Generate_Featured_Image($upload_dir['path'] . $name . '.jpg', $post_data['post']);
                
                
                
                
                //imagedestroy($dest);
                imagedestroy($src1);
                imagedestroy($src2);
                //imagedestroy($src3);
            }
            if(!isset($thumb_id)){
                $thumb_id = 0;
                $src = "";
            }else{
                $src = wp_get_attachment_image_src( $thumb_id, 'full' );
                if(isset($src[0])){
                    $src = $src[0];
                }else{
                    $thumb_id = 0;
                    $src = "";
                }
            }
            
            
            echo json_encode(array(
                    'thumb_id' => $thumb_id, 
                    'src' => $src ,
                    'data'=>$_POST
                ));
        
            wp_die();
        }
        
       public function combined_get_sizes($size)
        {
            $img1_size = $size['img1'];
            $img2_size = $size['img2'];
            $img3_size = $size['img3'];
            $sizes = array($img1_size, $img2_size, $img3_size);
            return $sizes;
        }
        
       public function combined_get_positions($position)
        {
            $img1_position = explode(' ', str_replace('px', '', $position['img1']));
            $img2_position = explode(' ', str_replace('px', '', $position['img2']));
            $img3_position = explode(' ', str_replace('px', '', $position['img3']));
            $img4_position = explode(' ', str_replace('px', '', $position['img4']));
            $img5_position = explode(' ', str_replace('px', '', $position['img5']));
            $positions = array($img1_position, $img2_position, $img3_position, $img4_position, $img5_position);
            return $positions;
        }
    }
}

if(class_exists('Combined_Image'))
{
    $Combined_Image = new Combined_Image();
}