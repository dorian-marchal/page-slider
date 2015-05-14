var jsdom = require('jsdom');
var connect = require('connect');


describe('PageSlider,', function () {
    var $;
    var staticServer;
    var slider;
    var location;

    beforeAll(function () {
        // Start a local server for lib files
        var serveStatic = require('serve-static');
        staticServer = connect().use(serveStatic(__dirname + '/..')).listen(4242);
    });

    beforeEach(function (done) {
        // Create the DOM env
        jsdom.env({
            html: '<html><body></body></html>',
            scripts: [
                'http://localhost:4242/node_modules/jquery/dist/jquery.min.js',
                'http://localhost:4242/lib/page-slider.min.js',
            ],
            done: function (err, window) {
                if (err) console.log(err);

                $ = window.jQuery;
                PageSlider = window.PageSlider;
                location = window.location;
                document = window.document;

                slider = new PageSlider($('body'));
                done();
            }
        });
    });

    describe('once instantiated,', function() {

        it('should add inline style to the container', function () {
            expect(slider.$container.css('height')).toEqual('100%');
            expect(slider.$container.css('width')).toEqual('100%');
            expect(slider.$container.css('overflow')).toEqual('hidden');
        });

        it('should have a default transition duration of 300ms', function () {
            expect(slider.transitionDurationMs).toEqual(300);
        });
    });

    describe('before the first page is slided in,', function () {
        it('should have a `null` next slide origin', function () {
            expect(slider.getNextSlideOrigin()).toBeNull();
        });
    });

    describe('when the first page is slided in,', function() {

        it('should call callbacks synchronously', function () {

            var beforeCalled = false;
            var afterCalled = false;

            slider.slidePageFrom($('<div>'), 'left', {
                beforeTransition: function () {
                    beforeCalled = true;
                },
                afterTransition: function () {
                    afterCalled = true;
                },
            });

            expect(beforeCalled && afterCalled).toBe(true);
        });
    });

    describe('on page slide (except the first one),', function () {

        beforeEach(function () {
            // Force the first page slide
            var defaultTransitionDuration = slider.transitionDurationMs;
            slider.setTransitionDurationMs(0);
            slider.slidePage($('<div>'));
            slider.setTransitionDurationMs(defaultTransitionDuration);
        });

        it('should call both callbacks', function (done) {

            var beforeCalled = false;
            // Reduce transition duration
            slider.setTransitionDurationMs(50);

            slider.slidePage($('<div>'), {
                beforeTransition: function () {
                    beforeCalled = true;
                },
                afterTransition: function () {
                    expect(beforeCalled).toBe(true);
                    done();
                },
            });
        });

        it('should replace the old page with the new one', function (done) {
            // Reduce transition duration
            slider.setTransitionDurationMs(50);
            var $firstPage = $('<div>', { id: 'first-page' });
            var $secondPage = $('<div>', { id: 'second-page' });

            var domContains = function ($el) {
                return $.contains(document.documentElement, $el.get(0));
            };

            slider.slidePage($firstPage, {
                afterTransition: function () {
                    expect( domContains($firstPage) ).toBe(true);
                    expect( domContains($secondPage) ).toBe(false);

                    slider.slidePage($secondPage, {
                        afterTransition: function () {
                            expect( domContains($firstPage) ).toBe(false);
                            expect( domContains($secondPage) ).toBe(true);
                            done();
                        },
                    });
                },
            });
        });

        describe('when the current location is the penultimate history,', function () {
            it('should have a next slide origin equals to "left"', function () {
                slider.stateHistory[0] = '#test'; // last page
                slider.stateHistory[1] = '#toast'; // current page
                location.hash = '#test';
                expect(slider.getNextSlideOrigin()).toEqual('left');
            });
        });

        describe('when the current location isn\'t the penultimate history (and the history length is > 0),', function () {
            it('should have a next slide origin equals to "right"', function () {
                slider.stateHistory[0] = '#test';
                location.hash = '#toast';
                expect(slider.getNextSlideOrigin()).toEqual('right');
            });
        });



        describe('when transition duration is modified,', function() {

            beforeEach(function () {
                slider.setTransitionDurationMs(50);
            });

            it('should have modified transition duration', function () {
                expect(slider.transitionDurationMs).toBe(50);
            });

            it('should have transitions that reflect their duration', function (done) {

                var time50ms;
                var time200ms;
                var startTime = (new Date()).getTime();

                slider.slidePageFrom($('<div>'), 'left', {
                    afterTransition: function () {

                        time100ms = (new Date()).getTime() - startTime;

                        slider.setTransitionDurationMs(200);

                        startTime = (new Date()).getTime();

                        slider.slidePageFrom($('<div>'), 'left', {
                            afterTransition: function () {
                                time300ms = (new Date()).getTime() - startTime;
                                expect(time300ms).toBeGreaterThan(time100ms);
                                done();
                            },
                        });
                    },
                });

            });
        });

        describe('when transitions are disabled,', function() {

            beforeEach(function () {
                slider.disableTransitions();
            });

            it('should have disabled transitions', function () {
                expect(slider.transitionsEnabled).toBe(false);
            });

            it('should call callbacks synchronously', function () {
                var beforeCalled = false;
                var afterCalled = false;

                // slide in a first page
                slider.slidePage($('<div>'));

                slider.slidePageFrom($('<div>'), 'left', {
                    beforeTransition: function () {
                        beforeCalled = true;
                    },
                    afterTransition: function () {
                        afterCalled = true;
                    },
                });

                expect(beforeCalled && afterCalled).toBe(true);
            });
        });

    });


    afterAll(function () {
        staticServer.close();
    });
});
