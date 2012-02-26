#declarative

Mapper for declarative user interfaces in HTML.

###Features

declarative provides a simple way to map user interface description and configuration to arbitrary JavaScript code.
Consider the following snippet for a character counter we want to integrate on our website:

```javascript
var countCharacters = function(input, counter) {
    input.addEventListener('keyup', function() {
        counter.innerHTML = this.value.length;
    });
};
```

Normally we would write some plain and unrelated HTML stuffed with IDs in combination we some bootstrap code.
Using declarative we can describe our user interface as follows:

```html
<label for="text">Enter your text:</label>
<input id="text" type="text" />
<span data-counter="target: '#text', ">0</span> characters
```

declarative takes into account three values when parsing elements: the dom element, the custom type and the options.
In this example we have one *span* element which is enriched with our custom counter type and
contains an option *target* with the value of of an CSS selector. Note the syntax of the data attribute value.
declarative accepts a comma separated list of key-value pairs where (only) the value must be surrounded by single quotes.

The next step is to add a mapping:

```javascript
declarative.mappings.add({
    id: 'counter',
    prefix: 'data-widget-',
    types: ['counter']
    callback: function(element, type, options) {
        // ...
    }
});
```

The id of a mapping identifies it for later use. Any string is valid.
The prefix describes the string that is put before the type attribute of an element.
While it accepts any string, normally the prefix should start with 'data-' to make use of HTML5 data attributes.
The types array describes the valid custom types declarative should consider when applying a mapping.
The callback function is called for every match of the mapping when applied.
Parameters for the callback are the dom element, the custom type without the prefix and the options as an object.

To apply the above delcared mapping to the HTML all we have to do is to write the following:

```javascript
declarative.apply('counter').to(document);
```

This causes declarative to parse the whole document for any matches of the *counter* mapping.

###Why you should use it

Assume we want to build a website where users can enter text and see how many characters it has.
We start off with the HTML:

```html
<label for="text">Enter your text:</label>
<input id="text" type="text" />
<counter of="text"></counter> characters
```

When viewing this page we will see that the input lets us enter text but the counting of characters does not work.
This is because *input* is a valid element described in the HTML standard while *counter* is not.
To overcome this we can replace the counter with a *span* element and write some custom JavaScript code:

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

Although this code actually works it is not reusable because it is tightly coupled to specific elements (= configuration).
This coupling can be eliminated by separating the different concerns as followed:

```javascript
var countCharacters = function(input, counter) {
    input.addEventListener('keyup', function() {
        counter.innerHTML = this.value.length;
    });
};

countCharacters(document.getElementById('text'), document.getElementById('counter'));
```

Now there is a reusable method and a one liner to intialize our specific counter instance.

However the problem is that every time we want to use another character counter
we also have to write one line of initialization code.
The description and configuration of the counter element is scattered through HTML and JavaScript.

Some people will argue that this is fine as it follows the best practice of separating the content (HTML)
and the behaviour (JavaScript). This is not really correct.

Looking at the one line of code we can see while it does contain behaviour and implementation details
it also holds the description and configuration of our user interface.

By using HTML5 data attributes and parse them in our JavaScript we bring the configuration back to our view:

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
However there is one big mistake in the above sample implementation. Again multiple concerns are mixed together.
One is the functionality of the character counter and the other one is the mapping of the configuration to the initialization.
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

This is how user interface code should be written.
With clear separation of concerns and declarative configuration of views.
After writing some elements like this and the corresponding mapping from data attribues
one will soon notice that the mapping part of the code always follows the same pattern.