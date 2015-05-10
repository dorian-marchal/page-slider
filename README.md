# Page Slider

A little library to add CSS transitions between pages in a mobile web app.
Based on [ccoenraets' PageSlider](https://github.com/ccoenraets/PageSlider).

![Example](https://cloud.githubusercontent.com/assets/6225979/7555355/c244a356-f749-11e4-94ef-766b663bfe7e.gif)

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

## Methods

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

### setTransitionDuration(durationMs)

Set the transition duration in ms (default: 300)

### disableTransitions() / enableTransitions()

Disable or enable CSS transitions. Can be useful on older devices.

### slidePageFrom($newPage, from, options)

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

### slidePage($newPage, options)

Same methods as `slidePageFrom` but determine automatically the slide origin based on the history.

- First page slided : no transition (`from === null`)
- Next hash and previous hash are the same : back (`from === 'left'`)
- Other cases : forward (`from === 'right'`)


### getNextSlideOrigin()

It is possible to call this function just before calling `slidePage` to know which behaviour the newt transition will have.
This function is based on the current hash and return `'left'`, `'right'` or `null` (see `slidePage` for more infos).
