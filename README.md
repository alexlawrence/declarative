#declarative

declarative provides a convention based mapping from HTML (data) attributes to JavaScript methods and options.

###Why

We all know that we should separate our HTML (content/structure) and our JavaScript (behavior).
Therefore everything that improves our quite simple HTML interface should reside in some (external) JavaScript.
However for web applications in most cases we are trying to describe an advanced UI which HTML doesn´t provide natively.
Using the above mentioned our (declarative) description of an UI is scattered through HTML and JavaScript.

declarative is built on the assumption that the declarative parts of our UI (~configuration) should reside in the HTML.
Only the code mapping declarative configuration into any method calls or object initialization should be in JavaScript.

###Features

declarative provides a mapping registry.

Example mapping:

```javascript
declarative.mappings.add({
    id: 'widgets', // any string is valid
    prefix: 'data-widget-',
    types: ['calendar', 'counter', 'specialType']
    callback: function(element, type, options) {
        // ...
    }
});
````

Example HTML:

````html
<body>
    <div data-widget-calendar></div>
    <div data-widget-counter="target: '#text'"></div>
    <div data-widget-special-type="option: 'value', anotherOption: 'anotherValue'"></div>
</body>
````

To apply the mapping to the above HTML call the following:

```javascript
declarative.apply('widgets').to(document);
````