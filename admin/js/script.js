(function($) {
    $(document).ready(function() {
        var template = $('.combine-images-template');

        //Sections in this template
        var section1 = template.find('.combine-images-section-1');
        var section2 = template.find('.combine-images-section-2');
        var section3 = template.find('.combine-images-section-3');

        //Form elements in this template
        var formItem1 = template.find('input.image1');
        var formItem2 = template.find('input.image2');
        var formItem3 = template.find('input.image3');

        //section1.click(function(){
        //	formItem1.trigger('click');
        //});
        //section2.click(function(){
        //	formItem2.trigger('click');
        //});
        //section3.click(function(){
        //	formItem3.trigger('click');
        //});

        $('.combine-images-section').backgroundDraggable();

        $('#select-template').change(function() {
            var $optionvalue = $(this).val();
            $('#combined-images-template-wrapper').children().hide();
            $('#combined-images-template-wrapper').children('#' + $optionvalue).show();
            //if($optionvalue == '2columns') {
            //    $('.combine-images-template').hide();
            //    $('.combine-images2-template').show();
            //}else{
            //    $('.combine-images-template').show();
            //    $('.combine-images2-template').hide();
            //}
        });
        $('#combined-save-now').click(function() {
            $('#submitpost #save-post').trigger('click');
        });

    });
}(jQuery));
