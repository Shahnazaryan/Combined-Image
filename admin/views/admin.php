<p class="hide-if-no-js">
<?php
add_thickbox();
if(isset($_GET['post']) && is_numeric($_GET['post'])) {
    $post = $_GET['post'];
?>
<script type="text/javascript">

jQuery(document).ready(function($){

	$('#set-combined-image').click(function(e){
		e.preventDefault();
		tb_show('Set Combined Image', '#TB_inline?height=750&width=1200&inlineId=eic_popup');
			var tick_width = 1250;
			if( $('#combine-f_size2').is(':checked') ){
				var tick_width = 850;
			}

		jQuery("#TB_window").css({marginLeft: '-' + parseInt((tick_width / 2),10) + 'px', width: tick_width + 'px'});
		jQuery("#TB_window").css({'width': 'auto', 'overflow':'auto'});
		
		});
	
$('.combine-f_size').on('change', function(){
var tick_width = 1250;
if($(this).attr('id')== 'combine-f_size2' ){
var tick_width = 850;
}

jQuery("#TB_window").css({marginLeft: '-' + parseInt((tick_width / 2),10) + 'px', width: tick_width + 'px'});
})

	
});


</script>
    <a title="Set Combined Image"  href="#" id="set-combined-image">Set combined featured image</a>
<?php
    } else {
?>
    You have to save this post as draft before you will be able to set a combined featured image. <br />
    <a href="#" id="combined-save-now">Save Now</a>
<?php
    }
?>
</p>


<div id="eic_popup" style="display:none">
    <?php Admin_Interface::combined_image_templates();?>
</div>