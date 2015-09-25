/* global $ */
$(document).ready(function () {

    loadGallery(true, 'a.thumbnail');

    //This function disables buttons when needed
    function disableButtons(counterMax, counterCurrent) {
        $('#show-previous-image, #show-next-image').show();
        if (counterMax === counterCurrent) {
            $('#show-next-image').hide();
        } else if (counterCurrent === 1) {
            $('#show-previous-image').hide();
        }
    }

    /**
    *
    * @param setIDs        Sets IDs when DOM is loaded. If using a PHP counter, set to false.
    * @param setClickAttr  Sets the attribute for the click handler.
    */

    function loadGallery(setIDs, setClickAttr) {
        var currentImage,
            selector,
            counter = 0;

        $('#show-next-image, #show-previous-image').click(function () {
            if ($(this).attr('id') === 'show-previous-image') {
                currentImage--;
            } else {
                currentImage++;
            }

            selector = $('[data-image-id="' + currentImage + '"]');
            updateGallery(selector);
        });

        function updateGallery(selector) {
            var $sel = selector;
            currentImage = $sel.data('image-id');
            $('#image-gallery-caption').text($sel.data('caption'));
            $('#image-gallery-title').text($sel.data('title'));
            $('#image-gallery-image').attr('src', $sel.data('image'));
            disableButtons(counter, $sel.data('image-id'));
        }

        if (setIDs === true) {
            $('[data-image-id]').each(function () {
                counter++;
                $(this).attr('data-image-id', counter);
            });
        }
        $(setClickAttr).on('click', function () {
            updateGallery($(this));
        });
    }
});
