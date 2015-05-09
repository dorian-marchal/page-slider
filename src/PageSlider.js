/**
 * Helper to slide a new page in the app.
 * This helper only works well if the container is at 100% height.
 *
 * Based on : https://github.com/ccoenraets/directory-backbone-topcoat-require
 *
 */
define([
    'jquery',
], function ($) {

    'use strict';

    return function PageSlider($container) {

        this.transitionsEnabled = true;
        this.transitionDurationMs = 300;

        var $currentPage;
        var stateHistory = [];

        // The container need specific style
        $container.addClass('page-slider-container');

        /**
         * Set a page position via translate3d
         * @param {jquery} $page Page that we want to Position
         * @param {String} newLocation New position ('left', 'right' or 'center' (default))
         */
        var _setPagePosition = function ($page, newLocation) {

            var newPosition = '0px';

            switch (newLocation) {
                case 'left':
                    newPosition = '-100%';
                    break;
                case 'right':
                    newPosition = '100%';
                    break;
            }

            var transform = 'translate3d(' + newPosition + ', 0px , 0px)';

            $page.css({
                'webkitTransform': transform,
                'transform': transform,
            });
        };

        var _jQueryArrayToCollection = function (jqueryArray) {

            if (jqueryArray instanceof $) {
                return jqueryArray;
            }

            var $collection = $();

            jqueryArray.forEach(function ($el) {
                $collection = $collection.add($el);
            });

            return $collection;
        };

        /**
         * Enable css transition on the given page.
         */
        var _enableTransitionOnPages = function ($pages) {

            $pages = _jQueryArrayToCollection($pages);

            $pages.css({
                'webkitTransitionDuration': this.transitionDurationMs + 'ms',
                'transitionDuration': this.transitionDurationMs + 'ms',
            });
        };

        /**
         * Disable css transition on the given page.
         */
        var _disableTransitionOnPages = function ($pages) {

            $pages = _jQueryArrayToCollection($pages);

            $pages.css({
                'webkitTransform': 'none',
                'transform': 'none',
                'webkitTransitionDuration': '0s',
                'transitionDuration': '0s',
            });
        };

        /**
         * Disable css transition on page
         */
        this.disableTransitions = function () {
            this.transitionsEnabled = false;
        };

        /**
         * Enable css transition on page
         */
        this.enableTransitions = function () {
            this.transitionsEnabled = true;
        };

        /**
         * Return the type of slide ('first', 'forward' or 'back')
         */
        this.getNextSlideBehaviour = function () {
            var historyLength = stateHistory.length;

            if (historyLength === 0) {
                return 'first';
            }
            else if (location.hash === stateHistory[historyLength - 2]) {
                return 'back';
            }
            else {
                return 'forward';
            }
        };

        /**
         * Use this function if you want PageSlider to automatically determine
         * the sliding direction based on the state history.
         * afterTransition function is called when the transition ends
         */
        this.slidePage = function ($newPage, options) {

            var state = location.hash;

            var slideBehaviour = this.getNextSlideBehaviour();

            switch (slideBehaviour) {
                case 'first':
                    stateHistory.push(state);
                    this.slidePageFrom($newPage, null, options);
                    break;
                case 'back':
                    stateHistory.pop();
                    this.slidePageFrom($newPage, 'left', options);
                    break;
                case 'forward':
                    stateHistory.push(state);
                    this.slidePageFrom($newPage, 'right', options);
                    break;
            }
        };

        /**
         * Use this function directly if you want to control the sliding direction outside PageSlider
         * @param  {$} $newPage The new page to slide in
         * @param  {String} from Origin of the slide ('left', 'right', or null)
         * @param  {function} options
         *  beforeTransition: Called before the transition, after the page is added
         *                    to the DOM.
         *   afterTransition: Called when the slide end
         *                    or immediately if there is no transition.
         *                    A boolean is passed to the callback : true if we just slide
         *                    in the very first page.
         *
         */
        this.slidePageFrom = function ($newPage, from, options) {

            options.beforeTransition = options.beforeTransition || $.noop;
            options.afterTransition = options.afterTransition || $.noop;

            // Current page must be removed after the transition
            var $oldPage = $currentPage;
            var isFirstPageSlide = !$oldPage;

            $newPage.addClass('page');
            $container.append($newPage);

            options.beforeTransition();

            // First loaded page (no old page) or no transition
            if (isFirstPageSlide || !from || !this.transitionsEnabled) {

                // Disable transition
                _disableTransitionOnPages($newPage);

                // Remove old page if it exists
                if ($oldPage) {
                    $oldPage.remove();
                }

                $currentPage = $newPage;

                // We call the transition end callback anyway
                options.afterTransition(isFirstPageSlide);
                return;
            }

            // Position the page at the starting position of the animation
            _setPagePosition($newPage, from);

            // Shim transitionend if it's not fired
            var shimTransitionEnd = setTimeout(function() {
                onTransitionEnd();
            }, this.transitionDurationMs + 100);

            $currentPage.one('transitionend webkitTransitionEnd', function () {
                onTransitionEnd();
            });

            // Position the new page and the current page at the ending position of their animation
            // And enable their animation via transition

            _enableTransitionOnPages.call(this, [$newPage, $oldPage]);

            // Force reflow. More information here:
            // http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/
            /*jshint -W030*/
            $container[0].offsetWidth;

            setTimeout(function () {
                _setPagePosition($newPage, 'center');
                _setPagePosition($oldPage,  (from === 'left' ? 'right' : 'left'));
                $currentPage = $newPage;
            }, 0);

            var onTransitionEnd = function () {
                _disableTransitionOnPages($currentPage);

                $container.find('> .page:not(:last)').remove();

                clearTimeout(shimTransitionEnd);
                options.afterTransition(false);
            };

        };

    };

});
