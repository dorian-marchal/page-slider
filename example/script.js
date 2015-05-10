$(function () {

    var pages = {
        '#page-1': $($('#page-template-1').html()),
        '#page-2': $($('#page-template-2').html()),
        '#page-3': $($('#page-template-3').html()),
    };

    // Load the first page
    $('body').html(pages['#page-1']);

    $(document).on('click', 'a', function () {

        $('body').html(pages[$(this).attr('href')]);
    });

    // slider = new PageSlider($('body'));
});
