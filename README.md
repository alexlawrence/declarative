#declarative

Mapper for custom user interface markup.

###Motivation

When writing web user interfaces without using JavaScript we are restricted to the set of native interface elements
defined in the HTML standard and thus implemented by the browser.

Every time we want to add custom elements to our interface we do this by implementing the desired functionality
in JavaScript and linking the behavior to one or more DOM elements and their events. We find the elements by querying
the DOM using some criteria such as IDs or classes.

We do this because we want to separate the behavior from the content and its structure. However in most cases
we are not only pulling out the behavior but also the interface configuration. Consider the following search form
with a character counter displaying how many characters are left to enter:

```html
<form action="/" method="POST">
    <input id="search" name="search" type="text" maxlength="50" />
    <span id="counter"></span>
    <input type="submit" />
</form>
```

```javascript
var countCharacters = function(input, counter) {
    input.addEventListener('keyup', function() {
        counter.innerHTML = (50 - this.value.length) + ' characters left';
    });
};

var search = document.getElementById('search');
var counter = document.getElementById('counter');
countCharacters(search, counter);
```

The HTML holds nothing but the content and its structure. The script however contains the following interface
configuration which should actually be placed in the markup:

- The maximum count of characters for a specific input element
- The displayed format text for a specific counter
- The linking between a counter and its corresponding input field

One better way to implement this would be the following:

```html
<form action="/" method="POST">
    <input id="search" name="search" type="text" maxlength="50" />
    <span id="counter" data-target="search" data-text="{0} characters left"></span>
    <input type="submit" />
</form>
```

```javascript
var countCharacters = function(input, counter, text) {
    var maxlength = input.getAttribute('maxlength');
    input.addEventListener('keyup', function() {
        counter.innerHTML = text.replace('{0}', maxlength - this.value.length);
    });
};

var counter = document.getElementById('counter');
var input = document.getElementById(counter.getAttribute('data-target'));
var text = counter.getAttribute('data-text');
countCharacters(input, counter, text);
```

The markup now also holds the configuration for custom interface elements but still does not contain any behavior
or implementation details. Note that we are using custom data attributes in order to have valid HTML markup.
The above example becomes even more obvious when you imagine the counter being a native HTML element:

```html
<form action="/" method="POST">
    <input id="search" name="search" type="text" maxlength="50" />
    <counter for="search">{0} characters left</counter>
    <input type="submit" />
</form>
```

###Features

declarative provides the possibility to declare custom interface elements in any markup and to easily map them to
arbitrary JavaScript code. Thus it prevents from writing similar querying and mapping code over and over again.

Let´s assume we want to implement the previously mentioned search interface using declarative. We start off with the HTML:

```html
<form action="/" method="POST">
    <input id="search" name="search" type="text" maxlength="50" />
    <span data-widget-counter="target: 'search', text: '{0} characters left'"></span>
    <input type="submit" />
</form>
```

When working with custom interface elements there are three important values to consider: the **DOM element** itself,
the **custom type** and its **options**. In the above form there is one span element having the custom type "counter"
and two options. One is the ID of the input element and the other one is the format text for displaying. Note the value
of the "data-counter" attribute. The syntax used by declarative is equivalent to the object syntax in JavaScript
without the most outer curly braces. The attribute value can also be omitted (interpreted as an empty options object).

The next step is to register the counter as a custom type and describe how it should be mapped to JavaScript code.
This is done by adding a mapping to declarative:

```javascript
declarative.mappings.add({
    id: 'counter',
    prefix: 'data-widget-',
    types: ['counter']
    callback: function(counter, type, options) {
        var input = document.getElementById(options.target);
        countCharacters(input, counter, options.text);
    }
});
```

The **id** of a mapping is used for later identification. The optional **prefix** defines the string that is put before
the type when used as an attribute of an HTML element. While any string is valid in most cases it should start with
"data-" to make use of HTML custom data attributes. The **types** array defines the types declarative searches for
when applying the mapping. The **callback** function is called for every match of the mapping when applied.
Parameters for the callback are the DOM element, the type without the prefix and the options as an object.

Applying the above mapping to the whole DOM is done by writing the following:

```javascript
declarative.apply('counter').to(document);
```

###API

####Creating mappings

```javascript
declarative.mappings.add({
    id: 'example mapping', // string identifier
    prefix: 'data-attribute-prefix-', // lowercase attribute prefix (optional)
    types: ['types', 'to', 'map'], // types that will be mapped when found
    callback: function(element, type, options) {
        // callback is called for every match in the current mapping when applied
    }
});
```

####Applying mappings

Mappings can be applied to any DOM element:

```javascript
declarative.apply('example mapping').to(document);
```

Multiple mappings for the same DOM element should be passed in a single call:

```javascript
declarative.apply(['example mapping', 'another mapping']).to(document);
```

All available mappings can be applied at once:

```javascript
declarative.applyAllMappings().to(document);
```

DOM elements need to be unwrapped when using jQuery:

```javascript
declarative.applyAllMappings().to($('#someElement').get(0));
```

####Camel cased types

declarative automatically transforms hyphenated attribute names to camel case when matching against types.
This is the same behavior as building the dataset attribute from HTML data-* attributes defined
<a href="http://dev.w3.org/html5/spec/single-page.html#embedding-custom-non-visible-data-with-the-data-attributes">here</a>.

Example:

```html
<div data-widget-camel-counter="target: 'search', text: '{0} characters left'"></div>
```

```javascript
declarative.mappings.add({
    id: 'camel case',
    prefix: 'data-widget-',
    types: ['camelCounter']
    callback: function(counter, type, options) {
        // type will be 'camelCounter'
    }
});
```

####Distinct mappings

By default mappings are "distinct". This means that a mapping callback for a certain element is only called once
no matter how often the mapping is applied. This is especially useful when you encounter DOM changes but don´t want
to apply a mapping to a specific DOM element.

```javascript
declarative.mappings.add({
    id: 'example mapping',
    prefix: 'data-attribute-prefix-',
    types: ['types', 'to', 'map'],
    callback: function(element, type, options) {},
    distinct: false
});
```

####Asnychronous work

Applying mappings works asynchronously in order to not block the JavaScript execution thread for a too long time.
The return value of the apply() method is a [promise](http://wiki.commonjs.org/wiki/Promises/A).
Waiting for mappings to be finished before executing other code can be done by writing the following:

```javascript
declarative.applyAllMappings().to(document).then(function() {
    // do something after applying mappings
});
```
By default declarative pauses processing every 1000 ms (timeout) and waits for 20ms (waitTime).
These settings can easily be changed:

```javascript
declarative.settings.mappingTimeoutMs = 200;
declarative.settings.mappingWaitTimeMs = 10;
```

###Examples

While mapping one single custom type might not look too useful have a look at the following examples:

#####Mapping jQueryUI types

```html
<div data-ui-draggable></div>
<div data-ui-progressbar="value: '100'"></div>
<div data-ui-dialog="closeText: 'hide'"></div>
<input type="text" data-ui-datepicker="minDate: '2012/03/01'" />
```

```javascript
declarative.mappings.add({
    id: 'jQueryUI',
    prefix: 'data-ui-',
    types: ['draggable', 'progressbar', 'dialog', 'datepicker'],
    callback: function(element, type, options) {
        $(element)[type](options);
    }
});

declarative.apply('jQueryUI').to(document);
```

#####Simplified mapping of jQuery.validate

```html
<form data-validate-form>
    <input type="text" name="required" data-validate-required="is: true, withMessage: 'Required'" />
    <input type="text" name="minlength" data-validate-minlength="is: 3, withMessage: 'Minimum of 3'" />
    <input type="text" name="maxlength" data-validate-maxlength="is: 6, withMessage: 'Maximum of 6'" />
    <input type="submit" />
</form>
```

```javascript
declarative.mappings.add({
    id: 'jQuery.validate.form',
    prefix: 'data-validate-',
    types: ['form'],
    callback: function(element) {
        $(element).validate();
    },
});

declarative.mappings.add({
    id: 'jQuery.validate.input',
    prefix: 'data-validate-',
    types: ['required', 'minlength', 'maxlength'],
    callback: function(element, type, options) {
        var rule = {messages: {}};
        rule[type] = options.is;
        rule.messages[type] = options.withMessage;
        $(element).rules('add', rule);
    }
});

declarative.apply('jQuery.validate.form').to(document);
declarative.apply('jQuery.validate.input').to(document);
```

###Roll your own markup language

declarative can also map elements giving the possibility to use a custom markup language.
This is done by changing the mappingMode of a mapping explicitely to "element" (otherwise it is "attribute" by default).

```html
<form action="/" method="POST">
    <input id="search" name="search" type="text" maxlength="50" />
    <counter target="search" text="{0} characters left"></counter>
    <input type="submit">
</form>
```

```javascript
declarative.mappings.add({
    id: 'counter',
    types: ['counter'],
    callback: function(counter, type, options) {
        var input = document.querySelector(options.target);
        countCharacters(input, counter, options.text);
    },
    mappingMode: declarative.mappingModes.element
});
```

**Notes**:

- Using custom elements that are not part of the HTML standard might cause rendering problems and styling issues
- This element mapping feature is not tested across different browsers as it is not really a best practice
