var images = {img1: null, img2: null, img3: null, img4: null, img5: null},
    position = {img1:"0px 0px", img2:"0px 0px", img3:"0px 0px", img4:  "0px 0px", img5: "0px 0px"},
    position2 = {img1:"0px 0px", img2:"0px 0px", img3:"0px 0px", img4:  "0px 0px", img5: "0px 0px"},
    size = {img1: "1", img2: "1", img3: "1", img4: "1", img5: "1"},
    size2 = {img1: "1", img2: "1", img3: "1", img4: "1", img5: "1"},
    initial_width = {img1: 0, img2: 0, img3: 0},
    initial_height = {img1: 0, img2: 0, img3: 0};
	
	var f_width  = 1200;
	var f_height = 630;
	
	
	var half_f_width  = f_width/2;
	var third_f_width = f_width/3;

(function( $ ) {




    'use strict';
    /*allback function for the 'click' event of the 'Set Footer Image'
     * anchor in its meta box.
     *
     * Displays the media uploader for selecting an image.
     *
     * @since 0.1.0
     */

    function renderMediaUploader($template) {

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


            var section = $('.combine-images-section-' + $template ),
                selection = file_frame.state().get('selection').first().toJSON();


            // if( selection.width < 210 || selection.height < 420 ){
                // if( selection.height < 420  ){
                    // alert('The image is height is small than "420" please upload a new one');
                // }else{
                    // alert('The image is width is small than "210" please upload a new one');
                // }

                // return;
            // }
		    section.css({'background-image': 'url(' + selection.url + ')','background-size':selection.width+'px '+selection.height+'px'}).data({'width':selection.width,'height':selection.height});
            $('.combine-images-section-' + $template).addClass('combined_hasbg');

            section.find('input').val('0%');
            if($template == 1) {
                images.img1 = selection.url;
                size.img1 =selection.width/third_f_width;
                $('.combine-images-section-' + $template).addClass('combined_hasbg2');
            }
            else if($template == 2) {
                images.img2 = selection.url;
                size.img2 =selection.width/third_f_width;
                $('.combine-images-section-' + $template).addClass('combined_hasbg2');
            }
            else if($template == 3) {
                images.img3 = selection.url;
                size.img3 =selection.width/third_f_width;
            }
			initial_width['img' + $template] = 0;
			initial_height['img' + $template] = 0;
            


            section.backgroundDraggable({

                done: function() {
 
					if(initial_width['img' + $template] == 0 && initial_height['img' + $template] == 0) {
						var $size = section.css('background-size').split(' ');
						initial_width['img' + $template] = parseFloat($size[0]);
						initial_height['img' + $template] = parseFloat($size[1]);
					}

                    var current_size = section.css('background-size').split(' ');
                    var backgroundPosition = $('.combine-images-section-' + $template).css('background-position');
					
					
                    if(typeof(backgroundPosition) !== 'undefined') {
                        var bg_pos = backgroundPosition.split(' ');
                        //console.log(bg_pos);
                        var img_width = parseFloat(current_size[0]),
                            img_height = parseFloat(current_size[1]);

                        var img_x = bg_pos[0],
                            img_y= bg_pos[1];

                        var x_width = img_width  - third_f_width;
                        var y_width = img_height - f_height;
						if(!combine_is_small_image($template)){
							if( (x_width) < Math.abs(parseInt(img_x))){
								$('.combine-images-section-' + $template).css('background-position-x', '-' + x_width.toString() + 'px');
							}
							if( parseInt(img_x) > 0) {
								$('.combine-images-section-' + $template).css('background-position-x', '0');
							}

							if( (y_width) < Math.abs(parseInt(img_y))){
								$('.combine-images-section-' + $template).css('background-position-y', '-' + y_width.toString() + 'px');
							}
							if( parseInt(img_y) > 0) {
								$('.combine-images-section-' + $template).css('background-position-y', '0');
							}
						}
                        var backgroundPosition = $('.combine-images-section-' + $template).css('background-position');

                    }

                    if($template == 1) {
                        position.img1 = backgroundPosition;
                    }
                    else if($template == 2) {
                        position.img2 = backgroundPosition;
                    }
                    else if($template == 3) {
                        position.img3 = backgroundPosition;
                    }

                    //console.log(position);
                    //  console.log('x-'+img_x+' y-'+img_y);

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
        $('.submit-combine-images-button').click(function() {
            console.log($.QueryString.post)
            var data = {
                'action': 'combine',
                'tocombine': 'something',
            };
            //jQuery.post(ajaxurl, data, function(response) {
            //	alert('Got this: ' + response);
            //});
            //console.log(data);

            if( $('.combined_hasbg').length >= 3 ){
                $('.please-wait').css({'display':'inline'});
                $.ajax({
                    type: 'POST',
                    url: ajaxurl,
                    data: {
                        action: 'combine',
                        post: $.QueryString.post,
                        images: images,
                        position: position,
                        size: size,
                        cols: 3,
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
                            wp.media.featuredImage.set(response.thumb_id);
                            if($('.editor-post-featured-image__toggle').length>0){
                                if(!$('.editor-post-featured-image').closest(".components-panel__body").hasClass('is-opened')){
                                    $('.editor-post-featured-image').closest(".components-panel__body").trigger('click')
                                }
                                $('.editor-post-featured-image__toggle').trigger('click');
                            }
                            else{
                                wp.media.featuredImage.frame().open()
                            }
							jQuery('#set-post-thumbnail').html('<img src="'+response.src+'" class="attachment-post-thumbnail size-post-thumbnail">');
							jQuery('#_thumbnail_id').val(response.thumb_id);
							tb_remove();
							jQuery('.please-wait').hide();
                        }
                        
                    },
                    error: function(errorThrown) {
                        alert(errorThrown);
                        $('.please-wait').css({'display':'none'});
                    }
                });
            }else{
                alert('Please select all images');
            }

        });
        $('#combine-add_border').change(function() {
            if($(this).attr('checked') == 'checked') {
                $('.ctpl .csection').css('border-right', 'solid 2px #fff');
            }else{
                $('.ctpl .csection').css('border', 'none');
            }
        });
        $( '.combine-images-link').on( 'click', function( e ) {
            e.preventDefault();
            renderMediaUploader(parseInt($(this).data('id')));
        });
        var INCREMENT=20;
        $('.combine-images-section-size-up, .combine-images-section-size-down').on('click', function( e ) {
            e.preventDefault();
            var $section = $(this).closest('.combine-images-section'),
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

            if($(this).hasClass('combine-images-section-size-up')){
                if($is_landscape){
                    $width+=INCREMENT;
                }
                else{
                    $height+=INCREMENT;
                }
            }
            else{
				if(!combine_is_small_image(inputParentIndex)){
					if( $height <= (f_height + 11) || $width <= (third_f_width + 11) ){
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
                    size.img1 =$width/third_f_width;
                }
                else if($section.find('input').attr('data-num') == 2) {
                    size.img2 = $width/third_f_width;
                }
                else if($section.find('input').attr('data-num') == 3) {
                    size.img3 = $width/third_f_width;
                }
            }
			combine_check_postion($section, inputParentIndex);

        });

        $('.combine-images-section input').change(function() {
            var inputParent = $(this).closest('.combine-images-section'),
                inputParentIndex = inputParent.index() + 1,
                myInputParent = $('.combine-images-section-' + inputParentIndex);

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
                $allowed_percent_minus_portrait = parseInt(($initial_width - third_f_width - 2) / $initial_width * 100 * -1)+1;

            //console.log($new_height);
			if(!combine_is_small_image(inputParentIndex)){
				if($new_height < f_height) {
					alert('Too much zoom out. Cannot be less than ' + $allowed_percent_minus_landscape + '%');
					return;
				}
				if($new_width < third_f_width) {
					alert('Too much zoom out. Cannot be less than ' + $allowed_percent_minus_portrait + '%');
					return;
				}
			}
            size['img' + inputParentIndex] = $new_width / third_f_width;

            if($is_landscape){
                myInputParent.css('background-size', $new_width +'px '+Math.round($new_width*$ratio)+'px');
                var $old_width = myInputParent.data('width');
                console.log($old_width);
                var $percent = parseFloat((Math.abs($old_width-$initial_width)*100)/$old_width);
                if($old_width>$new_width){
                    $percent='-'+$percent;
                }
            }
            else{
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

		if(f_height > height || third_f_width > width ){
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
			console.log(bg_pos);
			var img_width = parseFloat(current_size[0]),
				img_height = parseFloat(current_size[1]);

			var img_x = bg_pos[0],
				img_y= bg_pos[1];

			var x_width = img_width - third_f_width;
			var y_width = img_height - f_height;
		
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
			position.img1 = backgroundPosition;
		}
		else if($template == 2) {
			position.img2 = backgroundPosition;
		}
		else if($template == 3) {
			position.img3 = backgroundPosition;
		}

		//console.log(position);
		//  console.log('x-'+img_x+' y-'+img_y);

		//alert();
	}
	
	$('.combine-f_size').on('change', function(){
		f_width  = $('.combine-f_size:checked').data('width');
		f_height = $('.combine-f_size:checked').data('height');
		half_f_width  = f_width/2;
		third_f_width = f_width/3;
		$('.combine-images2-template, .combine-images-template').css({
			width: (f_width + 50) + 'px',
			height: (f_height + 120) + 'px',
		});
		$('.combine-images-section').css({
			width: third_f_width + 'px',
			height: f_height + 'px'
		});
		$('.combine-images2-section').css({
			width: half_f_width + 'px',
			height: f_height + 'px'
		});
		$('.combine-images-link').css({
			width: third_f_width +'px'
		});
		$('.combine-images2-link').css({
			width: half_f_width +'px'
		});
		var $w1 = $('.combine-images-section-1').css('background-size').split(' ');
		var $w2 = $('.combine-images-section-2').css('background-size').split(' ');
		var $w3 = $('.combine-images-section-3').css('background-size').split(' ');

		size.img1 = parseFloat($w1[0])/third_f_width;
		size.img2 = parseFloat($w2[0])/third_f_width;
		size.img3 = parseFloat($w3[0])/third_f_width;
		
		var $w1 = $('.combine-images2-section-1').css('background-size').split(' ');
		var $w2 = $('.combine-images2-section-2').css('background-size').split(' ');
		
		size2.img1 = parseFloat($w1[0])/half_f_width;
		size2.img2 = parseFloat($w2[0])/half_f_width;
		console.log(size);
		
	})
	
})( jQuery );
