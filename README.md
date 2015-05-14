# Page Slider

![Travis Badge](https://travis-ci.org/dorian-marchal/page-slider.svg?branch=master)

A little library to add CSS transitions between pages in a mobile web app.

Based on [ccoenraets' PageSlider](https://github.com/ccoenraets/PageSlider).

![Example](https://cloud.githubusercontent.com/assets/6225979/7555355/c244a356-f749-11e4-94ef-766b663bfe7e.gif)

## Installation

You can install PageSlider via bower :

```
bower install page-slider --save
```

Or via npm :

```
npm install page-slider --save
```

Then, you can link `lib/page-slider.min.js` and `lib/page-slider.css` on your page.

Note that PageSlider depends on jQuery, so you must load jQuery before PageSlider if you don't use any package manager.

If you want more details, you can look at the example.

## Usage

```js
// Create the slider instance
var slider = new PageSlider($('body'));

// Set the transition duration in ms (default: 300)
slider.setTransitionDurationMs(400);

// Disable slide transitions
slider.disableTransitions();

// Re-enable them
slider.enableTransitions();

// Slide in a new page
slider.slidePage($page);
```

## API

### PageSlider($container)

The constructor takes the container (a jQuery element) in parameter.
This container will receive specific styles:

```css
{
    height: 100%;
    width: 100%;
    overflow: hidden;
}
```

### .setTransitionDuration(durationMs)

Set the transition duration in ms (default: 300)

### .disableTransitions() / .enableTransitions()

Disable or enable CSS transitions. Can be useful on older devices.

### .slidePageFrom($newPage, from, options)

Slide in a new page from the given origin.

- `$newPage` (jQuery element): New page to slide in. Will receive the `page` class.
- `from` (String): Origin of the transition (`'left'`, `'right'` or `null` for no transition)
- `options` (optional, object) :
    + `beforeTransition` (function): Called before the transition, but after the page is added to the DOM
    + `afterTransition` (function): Called after the transition and after the old page has been removed from the DOM. Takes a boolean in parameter (`true` the first time a page is added, `false` every other times)

```js
// Example
slider.slidePageFrom($page, 'left', {
    beforeTransition: function () {
        console.log('before transition');
    },
    afterTransition: function (firstPage) {
        console.log('after transition');
        console.log('First slided page ? ' + firsPage);
    },
});
```

### .slidePage($newPage, options)

Same methods as `slidePageFrom` but determine automatically the slide origin based on the history.

- First page slided : no transition (`from === null`)
- Next hash and previous hash are the same : back (`from === 'left'`)
- Other cases : forward (`from === 'right'`)


### .getNextSlideOrigin()

It is possible to call this function just before calling `slidePage` to know which behaviour the newt transition will have.
This function is based on the current hash and return `'left'`, `'right'` or `null` (see `slidePage` for more infos).

## Some usual issues

### Scrollable pages

As stated above, PageSlider add some required style to your container (`height: 100%` and `overflow: hidden`).
This style ensures that your fixed elements look nice during slides, but also prevents your page from being scrollable.

To circumvent this issue, you can add this CSS to your page immediate child to restore their scrolling behaviour :

```css
{
    height: 100%;
    overflow-y: scroll;
}
```

You can look at a working example in the `example` folder.


### Fixed elements on some devices

In the native browser of some android devices, the fixed elements don't follow their parent during css transitions.
This can be a problem if you develop a mobile app based on webviews (a Phonegap based app, for example).

To avoid this problem, you may want to set your fixed elements to absolute positioning before the slide and revert them back to fixed positioning after the transition.

You can do that with the help of the transition hooks :

```css
[data-fixed="fixed"] {
    position: fixed !important;
}

[data-fixed="absolute"] {
    position: absolute !important;
}
```

```html
<!-- in your html, on a fixed element -->
<div data-fixed='absolute' class="my-fixed-div" ></div>

```

```js
// When you slide your pages
slider.slidePage($page, {
    beforeTransition: function () {
        $('[data-fixed]').attr('data-fixed', 'absolute');
    },
    afterTransition: function () {
        $('[data-fixed]').attr('data-fixed', 'fixed');
    },
});

```
You can look at a working example in the `example` folder.
