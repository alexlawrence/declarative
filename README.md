#declarative

Mapper for declarative user interfaces in HTML.

###API

```javascript
declarative.mappings.add({
    id: 'some mapping',
    prefix: 'data-attribute-prefix-',
    types: ['types', 'to', 'map'],
    callback: function(element, type, options) {
        // ...
    }
});

var anyDomElement = document.getElementsByTagName('*').item(1337);
declarative.apply('some mapping').to(anyDomElement);
```

###Explanation

If you are new to user interface development read the chapter "Basics" below.

Consider the following code for a character counter:

```javascript
var countCharacters = function(input, counter) {
    input.addEventListener('keyup', function() {
        counter.innerHTML = this.value.length;
    });
};
```

In order to use this function we would normally write some plain HTML in combination with bootstrapping code
picking up the right DOM elements and passing them to the "countCharacters" method.
Using declarative we can describe our user interface as follows:

```html
<label for="text">Enter your text:</label>
<input id="text" type="text" />
<span data-counter="target: '#text'">0</span> characters
```

There are three important values when describing custom user interface elements:
the DOM element itself, the custom type and its options.
In the above example we have one span element which uses the custom type "counter" and contains an "target" option
with the value of a CSS selector.
Note the value of the "data-counter" attribute. The syntax used by declarative is inspired by knockout.js.
It accepts a comma separated list of key-value pairs where string values must be surrounded by single quotes.
If no options should be passed the value can be omitted.

The next step is to register the counter as a custom type and describe how it should be mapped to JavaScript code.
This is done by adding a mapping to declarative:

```javascript
declarative.mappings.add({
    id: 'counter',
    prefix: 'data-widget-',
    types: ['counter']
    callback: function(counter, type, options) {
        var input = document.querySelector(options.target);
        countCharacters(input, counter);
    }
});
```

The **id** of a mapping is for looking it up in the registry for later use.
The **prefix** describes the string that is put before the type when used as an attribute of an HTML element.
While it accepts any string it should normally start with "data-" to make use of HTML5 valid data attributes.
The **types** array describes the types declarative searches for when applying the mapping.
The **callback** function is called for every match of the mapping when applied.
Parameters for the callback are the DOM element, the type without the prefix and the options as an object.

Applying the above mapping to the DOM is done by writing the following:

```javascript
declarative.apply('counter').to(document);
```

This causes declarative to parse the whole document for any matches of the mapping. The "apply" method takes
either a single mapping or a list of mappings. It can be applied to any DOM element. More examples:

```javascript
declarative.apply(['widgets', 'validation']).to(document.getElementById('#content'));
declarative.apply('counter').to($('#content').get(0)); // when using jQuery
```

###Examples

While mapping one single custom type as in the above example might not be too attractive have a look at the following examples:

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

#####Mapping jQuery.validate

```html
<form data-validate-form>
    <input type="text" name="required" data-validate-required="value: true, message: 'Required'" />
    <input type="text" name="minlength" data-validate-minlength="value: 3, message: 'Minimum of 3'" />
    <input type="text" name="maxlength" data-validate-maxlength="value: 6, message: 'Maximum of 6'" />
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
    }
});

declarative.mappings.add({
    id: 'jQuery.validate.input',
    prefix: 'data-validate-',
    types: ['required', 'minlength', 'maxlength'],
    callback: function(element, type, options) {
        var rule = {messages: {}};
        rule[type] = options.value;
        rule.messages[type] = options.message;
        $(element).rules('add', rule);
    }
});

declarative.apply('jQuery.validate.form').to(document);
declarative.apply('jQuery.validate.input').to(document);
```

###Performance

declarative is optimized for performance.
It uses query selectors where available and parses only the minimum set of HTML elements and attributes.
However it could lead to performance issues in IE7 when applying mappings to pages which contain more than 1500 DOM elements.


###Basics

This chapter is for anyone who is not yet familiar with some common patterns of custom user interface element development.
It describes how you should write your code with the example of a character counter and shows how declarative can help you.

Assume we want to build a website where users can enter text and see how many characters it has. We start off with the following HTML:

```html
<label for="text">Enter your text:</label>
<input id="text" type="text" />
<counter of="text"></counter> characters
```

When viewing the above snippet in a browser we can see that the input lets us enter text but the counting of characters does not work.
This is because "input" is a valid element described in the HTML standard while "counter" is not.
To overcome this we can replace the counter with a "span" element and write some custom JavaScript code:

```html
<label for="text">Enter your text:</label>
<input id="text" type="text" />
<span id="counter">0</span> characters
```

```javascript
document.getElementById('text').addEventListener('keyup', function() {
    document.getElementById('counter').innerHTML = this.value.length;
});
```

Although this code actually works it is not reusable because it is tightly coupled to specific elements.
This coupling can be eliminated by separating the different concerns as follows:

```javascript
var countCharacters = function(input, counter) {
    input.addEventListener('keyup', function() {
        counter.innerHTML = this.value.length;
    });
};

countCharacters(document.getElementById('text'), document.getElementById('counter'));
```

While this code is much cleaner, now the problem is that every time we want to use another character counter
we also have to write one line of initialization code.
The description and configuration of the counter element is scattered through HTML and JavaScript.
Some people will argue that this is correct as it follows the best practice of separating the content (HTML)
and the behaviour (JavaScript). This is not correct.
Looking at the one line of code we can see  it does contain behaviour and implementation details
but it also holds the description and configuration of our user interface.

By using HTML5 data attributes and parse them in our JavaScript we bring the configuration back to our HTML:

```html
<label for="text">Enter your text:</label>
<input id="text" type="text" />
<span data-counter-for="text">0</span> characters
```

```javascript
document.querySelectorAll('[data-counter-for]').forEach(function(counter) {
    var inputId = counter.getAttribute('data-counter-for');
    var input = document.getElementById(inputId);
    input.addEventListener('keyup', function() {
        counter.innerHTML = this.value.length;
    });
});
```

Using the above code we can easily put counters on other pages without having to write one liners for the initialization.
**But wait:** Now there is another big mistake in the implementation. Again, multiple concerns are mixed together.
One is the functionality of the character counter itself and
the other one is the mapping of the declaration and configuration to the actual behaviour.
The correct way to do implement this would be:

```html
<label for="text">Enter your text:</label>
<input id="text" type="text" />
<span data-counter-for="text">0</span> characters
```

```javascript
var countCharacters = function(input, counter) {
    input.addEventListener('keyup', function() {
        counter.innerHTML = this.value.length;
    });
};

document.querySelectorAll('[data-counter-for]').forEach(function(counter) {
    var inputId = counter.getAttribute('data-counter-for');
    var input = document.getElementById(inputId);
    countCharacters(input, counter);
});
```

This is how almost all user interface code should be written.
After writing some elements like this and the corresponding mapping from data attribues
you will soon notice that the mapping part of the code always follows the same pattern.
Then you can start using declarative :)