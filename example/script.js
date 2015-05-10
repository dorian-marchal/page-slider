$(function () {

    // Load the page templates. In real life, you'd want to
    // lazy load those.
    var pages = {
        '#page-1': $($('#page-template-1').html()),
        '#page-2': $($('#page-template-2').html()),
        '#page-3': $($('#page-template-3').html()),
    };

    // Create a PageSlider ('body' is the container)
    var slider = new PageSlider($('body'));

    // Slide in the page associated to the current hash
    var slideCurrentPage = function () {
        slider.slidePage(pages[location.hash], {
            // Fix for the fixed elements (see the README for more informations)
            beforeTransition: function () {
                $('[data-fixed]').attr('data-fixed', 'absolute');
            },
            afterTransition: function () {
                $('[data-fixed]').attr('data-fixed', 'fixed');
            },
        });
    };

    // When hash change, we load the related page
    $(window).on('hashchange', function() {
        slideCurrentPage();
    });

    // Back button event binding
    $(document).on('click', '.back', function (event) {
        event.preventDefault();
        history.back();
    });

    // Load the first page
    if (!location.hash) {
        location.hash = '#page-1';
    }
    else {
        slideCurrentPage();
    }
});
