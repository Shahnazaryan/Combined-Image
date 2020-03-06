(function( $ ) {
    'use strict';

    function renderMediaUploader2($template) {
      
        /**
         * If we're this far, then an instance does not exist, so we need to
         * create our own.
         *
         * Here, use the wp.media library to define the settings of the Media
         * Uploader. We're opting to use the 'post' frame which is a template
         * defined in WordPress core and are initializing the file frame
         * with the 'insert' state.
         *
         * We're also not allowing the user to select more than one image.
         */
        var file_frame = wp.media.frames.file_frame = wp.media({
            frame:    'post',
            state:    'insert',
            multiple: false,
            library: {type: 'image'}
        });

        /**
         * Setup an event handler for what to do when an image has been
         * selected.
         *
         * Since we're using the 'view' state when initializing
         * the file_frame, we need to make sure that the handler is attached
         * to the insert event.
         */
        file_frame.on( 'insert', function() {

        	
        	var section = $('.combine-images2-section-' + $template),
        	c_section = $('.combine-images2-section-' + $template),
            selection = file_frame.state().get('selection').first().toJSON();
           
        	 // if( selection.width < 315 || selection.height < 420 ){
        		 // if( selection.height < 420  ){
             		// alert('The image is height is small than "420" please upload a new one');
             	// }else{
             		// alert('The image is width is small than "315" please upload a new one');
             	// }
             	// return;
             // }
        	
        	section.css({'background-image': 'url(' + selection.url + ')','background-size':selection.width+'px '+selection.height+'px'}).data({'width':selection.width,'height':selection.height});
        	$('.combine-images-section-' + $template).addClass('combined_hasbg2').addClass('combined_hasbg');
        	   
            c_section.find('input').val('0%');
            if($template == 1) {
                images.img1 = selection.url;
                size2.img1 =selection.width/half_f_width;
            }
            else if($template == 2) {
                images.img2 = selection.url;
                size2.img2 =selection.width/half_f_width;
            }
			initial_width['img' + $template] = 0;
			initial_height['img' + $template] = 0;



            c_section.backgroundDraggable({
            
                done: function() {
					if(initial_width['img' + $template] == 0 && initial_height['img' + $template] == 0) {
						var $size = section.css('background-size').split(' ');
						initial_width['img' + $template] = parseFloat($size[0]);
						initial_height['img' + $template] = parseFloat($size[1]);
					}

				

                	var current_size = c_section.css('background-size').split(' ');
                    var backgroundPosition = $('.combine-images2-section-' + $template).css('background-position');
                    
                    if(typeof(backgroundPosition) !== 'undefined') {
                        var bg_pos = backgroundPosition.split(' ');
                        //console.log(bg_pos);
                        var img_width = parseFloat(current_size[0]),
                            img_height = parseFloat(current_size[1]);

                        var img_x = bg_pos[0],
                            img_y= bg_pos[1];

                        var x_width = img_width - half_f_width;
                        var y_width = img_height - f_height;
						
						
						if(!combine_is_small_image($template)){						
							if( (x_width) < Math.abs(parseInt(img_x))){
								$('.combine-images2-section-' + $template).css('background-position-x', '-' + x_width.toString() + 'px');
							}
							if( parseInt(img_x) > 0) {
								$('.combine-images2-section-' + $template).css('background-position-x', '0');
							}

							if( (y_width) < Math.abs(parseInt(img_y)) ){
								$('.combine-images2-section-' + $template).css('background-position-y', '-' + y_width.toString() + 'px');
							}
							if( parseInt(img_y) > 0) {
								$('.combine-images2-section-' + $template).css('background-position-y', '0');
							}
						}
                        var backgroundPosition = $('.combine-images2-section-' + $template).css('background-position');
                         
                    }

                    if($template == 1) {
                        position2.img1 = backgroundPosition;
                       
                    }
                    else if($template == 2) {
                        position2.img2 = backgroundPosition;
                        
                    }
                   
                    //console.log(position);
                    //alert();
                }
            });

        });

        // Now display the actual file_frame
        file_frame.open();

    }
    $.QueryString = (function(a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i)
        {
            var p=a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'))

    $(function() {
        $('.submit-combine-images2-button').click(function() {
            var data = {
                'action': 'combine',
                'tocombine': 'something',
            };
            //jQuery.post(ajaxurl, data, function(response) {
            //	alert('Got this: ' + response);
            //});
            //console.log(data);
            $('.please-wait2').css({'display':'inline'});
            if( $('.combined_hasbg2').length  >= 2 ){
	            $.ajax({
	                type: 'POST',
	                url: ajaxurl,
	                data: {
	                    action: 'combine',
	                    post: $.QueryString.post,
	                    images: images,
	                    position: position2,
	                    size: size2,
	                    cols: 2,
	                    border: ($('#combine-add_border').attr("checked") == 'checked'),
						f_height: f_height,
						f_width : f_width,
             },
	                success: function(response) {
						response = jQuery.parseJSON(response);
                        //window.history.go(-1);
                        //window.location = window.location.protocol + "//" + window.location.host + '/wp-admin/post.php?post=' + $.QueryString.post + '&action=edit';
                        
						if(response.thumb_id == 0){
							location.reload();
						}else{
							jQuery('#set-post-thumbnail').html('<img src="'+response.src+'" class="attachment-post-thumbnail size-post-thumbnail">');
							jQuery('#_thumbnail_id').val(response.thumb_id);
							//tb_remove();
							jQuery('.please-wait2').hide();
						}
	                    //console.log(response);
	                },
	                error: function(errorThrown) {
	                    alert(errorThrown);
	                    $('.please-wait2').css({'display':'none'});
	                }
	            });
            }else{
            	alert('Please select all images');
            }

        });
        $( '.combine-images2-link').on( 'click', function( e ) {
            e.preventDefault();
            renderMediaUploader2(parseInt($(this).data('id')));
        });
        var INCREMENT=20;
        $('.combine-images2-section-size-up, .combine-images2-section-size-down').on('click', function( e ) {
            e.preventDefault();
            var $section = $(this).closest('.combine-images2-section'),
				inputParentIndex = $section.index() + 1,
                $size = $section.css('background-size').split(' ');
            
            if(initial_width['img' + inputParentIndex] == 0 && initial_height['img' + inputParentIndex] == 0) {
					initial_width['img' + inputParentIndex] = parseFloat($size[0]);
					initial_height['img' + inputParentIndex] = parseFloat($size[1]);
            }
			
			if(!$size){
				return;
			}
                
            var $width = parseFloat($size[0]),
                $height = parseFloat($size[1]),
                $is_landscape = $width>$height,
                $ratio = $is_landscape?parseFloat($height/$width):parseFloat($width/$height),
                $percent = 0;
                
                
                if($(this).hasClass('combine-images2-section-size-up')){
                    if($is_landscape){
                       $width+=INCREMENT; 
                    }
                    else{
                        $height+=INCREMENT;
                    }
                }
                else{
					if(!combine_is_small_image(inputParentIndex)){
						if( $height <= (f_height + 11) || $width <= (half_f_width + 11) ){
							return;
						}
					}
					if($is_landscape){
						$width-=INCREMENT; 
					}
					else{
						$height-=INCREMENT;
					}
					if($width<=0 || $height<=0){
						return;
					}
				}
                if($is_landscape){
                    $section.css('background-size', $width +'px '+Math.round($width*$ratio)+'px');
                    var $old_width = $section.data('width');
                    $percent = parseFloat((Math.abs($old_width-$width)*100)/$old_width);
                    if($old_width>$width){
                        $percent='-'+$percent;
                    }
                    
                }
                else{
                    $section.css('background-size' , Math.round($height*$ratio) +'px '+$height+'px');
                    var $old_height = $section.data('height');
                    $percent = parseFloat((Math.abs($old_height-$height)*100)/$old_height);
                    if($old_height>$height){
                        $percent='-'+$percent;
                    }
                }
                if( typeof $percent != "undefined" ){
                    $section.find('input').val(Math.round($percent)+'%');
                    
                    if( $section.find('input').attr('data-num') == 1) {
                        size2.img1 =$width/half_f_width;
                    }
                    else if($section.find('input').attr('data-num') == 2) {
                    	size2.img2 = $width/half_f_width;
                    }
                   
                }
				combine_check_postion($section, inputParentIndex);

        });

		
			$('.combine-images2-section input').change(function() {
			
            var inputParent = $(this).closest('.combine-images2-section'),
                inputParentIndex = inputParent.index() + 1,
                myInputParent = $('.combine-images2-section-' + inputParentIndex);

            if(initial_width['img' + inputParentIndex] == 0 && initial_height['img' + inputParentIndex] == 0) {
                var $size = myInputParent.css('background-size').split(' ');
                initial_width['img' + inputParentIndex] = parseFloat($size[0]);
                initial_height['img' + inputParentIndex] = parseFloat($size[1]);
            }

            var $initial_width = initial_width['img' + inputParentIndex],
                $initial_height = initial_height['img' + inputParentIndex];
            
            var $is_landscape = $initial_width>$initial_height,
                $ratio = $is_landscape?parseFloat($initial_height/$initial_width):parseFloat($initial_width/$initial_height),
                percent_val = $(this).val(),
                $new_width = $initial_width + ($initial_width * percent_val / 100),
                $new_height = $initial_height + ($initial_height * percent_val / 100),
                $allowed_percent_minus_landscape = parseInt(($initial_height - f_height - 2) / $initial_height * 100 * -1)+1,
                $allowed_percent_minus_portrait = parseInt(($initial_width - half_f_width - 2) / $initial_width * 100 * -1)+1 ;

			if(!combine_is_small_image(inputParentIndex)){
				if($new_height <= f_height) {
					alert('Too much zoom out. Height cannot be less than ' + $allowed_percent_minus_landscape + '%');
					return;
				}
				if($new_width <= half_f_width) {
					alert('Too much zoom out. Width cannot be less than ' + $allowed_percent_minus_portrait + '%');
					return;
				}
			}
            size2['img' + inputParentIndex] = $new_width / half_f_width;

            if($is_landscape){
                myInputParent.css('background-size', $new_width +'px '+Math.round($new_width*$ratio)+'px');
                var $old_width = myInputParent.data('width');
                var $percent = parseFloat((Math.abs($old_width-$initial_width)*100)/$old_width);
                if($old_width>$new_width){
                    $percent='-'+$percent;
                }
            }else{
                myInputParent.css('background-size' , Math.round($new_height*$ratio) +'px '+$new_height+'px');
                var $old_height = myInputParent.data('height');
                var $percent = parseFloat((Math.abs($old_height-$initial_height)*100)/$old_height);
                if($old_height>$new_height){
                    $percent='-'+$percent;
                }
            }
			combine_check_postion(inputParent, inputParentIndex);
        });
		
		
    });
	function combine_is_small_image($template){
		
		var height = initial_height['img' + $template];
		var width  = initial_width['img' + $template];
		if(f_height >= height || half_f_width >= width ){
			return true;
		}else{
			return false;
		}
	}
	function combine_check_postion(section, $template) {
		if(combine_is_small_image($template)){
			return true;
		}	
	
		var current_size = section.css('background-size').split(' ');
		var backgroundPosition = section.css('background-position');
		if(typeof(backgroundPosition) !== 'undefined') {
			var bg_pos = backgroundPosition.split(' ');
			//console.log(bg_pos);
			var img_width = parseFloat(current_size[0]),
				img_height = parseFloat(current_size[1]);

			var img_x = bg_pos[0],
				img_y= bg_pos[1];

			var x_width = img_width-half_f_width;
			var y_width = img_height-f_height;
	

			if( (x_width) < Math.abs(parseInt(img_x))){
				section.css('background-position-x', '-' + x_width.toString() + 'px');
			}
			if( parseInt(img_x) > 0) {
				section.css('background-position-x', '0');
			}

			if( (y_width) < Math.abs(parseInt(img_y))){
				section.css('background-position-y', '-' + y_width.toString() + 'px');
			}
			if( parseInt(img_y) > 0) {
				section.css('background-position-y', '0');
			}

			var backgroundPosition = section.css('background-position');

		}

		if($template == 1) {
			position2.img1 = backgroundPosition;
		}
		else if($template == 2) {
			position2.img2 = backgroundPosition;
		}
		else if($template == 3) {
			position2.img3 = backgroundPosition;
		}

		//console.log(position);
		//  console.log('x-'+img_x+' y-'+img_y);

		//alert();
	}
	
})( jQuery );
