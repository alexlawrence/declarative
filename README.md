#declarative

declarative provides a mapping of declarative custom HTML (data) attributes to arbitrary JavaScript methods/objects.

###Why

We all know that we should separate our HTML (content/structure) and our JavaScript (behavior).
Therefore everything that improves our quite simple HTML interface should reside in some JavaScript (file).
However for web applications in most cases we are only trying to describe an advanced UI which HTML doesn´t provide natively.
Using the above mentioned "best practice" our (declarative) description of an UI is scattered through HTML and JavaScript.

declarative.js is built on the assumption that the declarative parts of our UI (~configuration) should reside in the HTML.
Only the mapping code transforming declarative configuration into actual UI object initialization should be in JavaScript.

###Features

declarative.js provides a mapping registry to add mapping mechanisms.

Example mapping:

```javascript
declarative.mappings.add({
    id: 'widgets', // any string is valid
    attributePrefix: 'data-widget-',
    callback: function(element, type, options) {
        // ...
    }
});
````

Example HTML:

````html
<body>
    <div data-widget-calendar></div>
</body>
````

To apply the mapping to the above HTML call the following:

```javascript
declarative.apply('widgets').to(document);
````