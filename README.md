#declarative

Mapper for custom user interface markup.

**Note:** This library follows a similar concept like AngularJS directives or HTML5 Web Components. Personally I would probably go for a Web Components library like Polymer or such instead of using declarative. However, feel free to use it :-)

###Motivation

Native web user interfaces are restricted to the elements defined in the HTML and supported by browsers.
Additional custom behavior has to be implemented with JavaScript.
Most such implementations separate the behavior correctly from its content and its structure.
However the **configuration** of the behavior is often misplaced inside the JavaScript.
Consider the following example:

```html
<input id="text" type="text" maxlength="50" />
<span id="counter"></span>
```

```javascript
var countCharacters = function(input, counter) {
    input.addEventListener('keyup', function() {
        counter.innerHTML = (50 - this.value.length) + ' characters left';
    });
};
var text = document.getElementById('text');
var counter = document.getElementById('counter');
countCharacters(text, counter);
```

The JavaScript is cluttered with the following configuration:
the maximum count of characters, the format text and the linking between counter and input field.
These values should be configurable and should be defined for every counter in the markup independently:

```html
<input id="text" type="text" maxlength="50" />
<span id="counter" data-target="text" data-text="{0} characters left"></span>
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

This way the HTML holds the configuration but still remains free of behavior implementation details.
The above example becomes even more obvious when imagining the counter being a native HTML element:

```html
<input id="text" type="text" maxlength="50" />
<counter for="text">{0} characters left</counter>
```

###Features

declarative provides the possibility to declare custom interface elements and
to easily map them to arbitrary JavaScript code.
Thus it prevents from writing similar querying and mapping code over and over again.

The markup for a character counter mapped with declarative could look like this:

```html
<input id="text" type="text" maxlength="50" />
<span data-widget-counter="target: 'text', text: '{0} characters left'"></span>
```

When defining custom interface elements there are three important values to consider: the **DOM element**,
the **custom type** and its **options**. In the example there is one span element having the custom type "counter"
and two options (namely the ID of the input and the format text). Note the value of the "data-counter" attribute.
The syntax used by declarative is equivalent to the object syntax in JavaScript without the most outer curly braces.
The attribute value can also be omitted (which results in an empty options object).

The corresponding mapping for the counter can be registered by writing the following:

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

Applying the defined mapping to the whole DOM can easily be done with:

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

By default mappings are **distinct** meaning that a callback is called only once
for every matching element no matter how often the mapping is applied.
This default behavior can be changed by setting the **distinct** option to false.

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
Waiting for mappings to be finished before executing can be done by writing the following:

```javascript
declarative.applyAllMappings().to(document).then(function() {
    // do something after applying mappings
});
```

By default declarative pauses processing every 1000 ms (timeout) and waits for 20ms (waitTime).
These settings can always be adjusted:

```javascript
declarative.settings.mappingTimeoutMs = 1000;
declarative.settings.mappingWaitTimeMs = 20;
```

###Advanced examples

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

declarative.apply('jQuery.validate.form').to(document).then(function() {
    declarative.apply('jQuery.validate.input').to(document);
});
```

###Roll your own markup language

declarative can also map **elements** giving the possibility to use a custom markup language.
This is done by changing the mappingMode of a mapping to "element" ("attribute" is the default):

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
