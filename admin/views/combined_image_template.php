<div class="wrap" id="combined-images-template-wrapper">
    <select id="select-template">
        <option value="3columns">Three Columns</option>
        <option value="2columns">Two Columns</option> 
        <?php do_action('combined_image_option_hook'); ?>
    </select> 
    <div class="combine-add_border_parent">
        <label for="#combine-add_border">Add Border?</label>
        <input id="combine-add_border" type="checkbox" value="1"/>
    </div> 
            
    <div class="combine-add_border_parent">
        <label for="combine-f_size1">1200x630</label>
        <input class="combine-f_size" id="combine-f_size1" data-width="1200" data-height="630" name="combine-f_size" type="radio" value="1" checked/>
        <label for="combine-f_size2">760x400</label>
        <input class="combine-f_size" id="combine-f_size2" data-width="762" data-height="400" name="combine-f_size"  type="radio" value="0"/>
    </div>
    <div class="clear"></div> 
    <div class="ctpl combine-images-template" id="3columns">
        <div class="csection combine-images-section combine-images-section-1">
            <a class="combine-images-section-size-up">+</a>
            <a class="combine-images-section-size-down">-</a>
            <input data-num="1"  type="text" value="0%"  />
        </div>
        <div class="csection combine-images-section combine-images-section-2">
            <a class="combine-images-section-size-up">+</a>
            <a class="combine-images-section-size-down">-</a>
            <input data-num="2"  type="text" value="0%"  />
        </div>
        <div class="csection combine-images-section combine-images-section-3">
            <a class="combine-images-section-size-up">+</a>
            <a class="combine-images-section-size-down">-</a>
            <input data-num="3"  type="text" value="0%" />
        </div>
        <button data-id="1" class="combine-images-link">Upload</button>
        <button data-id="2" class="combine-images-link">Upload</button>
        <button data-id="3" class="combine-images-link">Upload</button>
        <div class="submit-combine-images">
            <span class="please-wait" style="line-height:28px;display:none;">Please wait....</span>
            <a class="button submit-combine-images-button">Submit</a>
        </div>
    </div> 
    <div class="ctpl combine-images2-template" id="2columns" style="display: none">
        <div class="csection combine-images2-section combine-images2-section-1">
            <a class="combine-images2-section-size-up">+</a>
            <a class="combine-images2-section-size-down">-</a>
            <input data-num="1"  type="text" value="0%" />
        </div>
        <div class="csection combine-images2-section combine-images2-section-2">
            <a class="combine-images2-section-size-up">+</a>
            <a class="combine-images2-section-size-down">-</a>
            <input data-num="2" type="text" value="0%" />
        </div>
        <button data-id="1"  class="combine-images2-link combine-images2-link-1">Upload</button>
        <button data-id="2"  class="combine-images2-link combine-images2-link-2">Upload</button>
        <div class="submit-combine-images2">
            <span class="please-wait2" style="line-height:28px;display:none;">Please wait....</span>
            <a class="button submit-combine-images2-button">Submit</a>
        </div>
    </div>
                 
    <?php do_action('combined_image_templates_hook'); ?>
</div> 