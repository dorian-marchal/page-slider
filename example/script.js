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

    var slideCurrentPage = function () {
        slider.slidePage(pages[location.hash]);
    };

    // Load the first page
    if (!location.hash) {
        location.hash = '#page-1';
    }
    else {
        slideCurrentPage();
    }

    // Load page when changing history
    $(window).on('hashchange', function() {
        slideCurrentPage();
    });

    // Back button
    $(document).on('click', '.back', function (event) {
        event.preventDefault();
        history.back();
    });
});
