# Load Async

A lightweight an easy-to-use JavaScript library for loading JavaScript and CSS files asynchronously. It provides functions to dynamically load scripts and stylesheets, either synchronously or asynchronously, with error handling capabilities.

## Installation

### CDN

```html
<script src='https://cdn.jsdelivr.net/gh/lullaby6/load-async/load-async.js'></script>
```

### Download

<a href="https://cdn.jsdelivr.net/gh/lullaby6/load-async/load-async.js" target="_blank" download>Click to download load-async.js</a>

## Examples

### Load

```js
loadCSS('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');

loadJS('https://cdn.jsdelivr.net/npm/toastify-js', () => {
    Toastify({
        text: "This is a toast",
        duration: 3000
    }).showToast();
});
```

### Load Async

```js
try {
    await loadAsyncCSS('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
    await loadAsyncJS('https://cdn.jsdelivr.net/npm/toastify-js');

    Toastify({
        text: "This is a toast",
        duration: 3000
    }).showToast();
} catch (error) {
    console.error("Error loading Toastify");
}
```

### Load Async With Error

```js
const [link, cssError] = await loadAsyncCSSWithError('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');

if (cssError) {
    console.error("Error loading Toastify CSS");
    return;
}

let [script, jsError] = await loadAsyncJSWithError('https://cdn.jsdelivr.net/npm/toastify-js');

if (jsError) {
    console.error("Error loading Toastify JS");
    return;
}

Toastify({
    text: "This is a toast",
    duration: 3000
}).showToast();

```