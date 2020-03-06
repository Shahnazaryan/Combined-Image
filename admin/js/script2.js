(function($) {
    $(document).ready(function() {
        var template = $('.combine-images2-template');

        //Sections in this template
        var section21 = template.find('.combine-images2-section-1');
        var section22 = template.find('.combine-images2-section-2');

        //Form elements in this template
        var formItem21 = template.find('input.image1');
        var formItem22 = template.find('input.image2');

        //section1.click(function(){
        //	formItem1.trigger('click');
        //});
        //section2.click(function(){
        //	formItem2.trigger('click');
        //});
        //section3.click(function(){
        //	formItem3.trigger('click');
        //});

        $('.combine-images2-section').backgroundDraggable();

    });
}(jQuery));
