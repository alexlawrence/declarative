#declarative

Mapper for declarative user interfaces in HTML.

###Introduction

Let´s assume we want to build a website where users can enter any sentence and see how many characters it has.
We start off with the HTML:

````html
    <label for="text">Enter your text:</label>
    <input id="text" type="text />
    <counter of="text"></counter> characters
````

When we open this page in a browser we will see that the input lets us enter text but the counting of characters does not work. This is because <input> is a valid UI element described in the HTML standard while <counter> is not. To overcome this we can replace the counter with a <span> element and write some custom JavaScript code:

````html
    <label for="text">Enter your text:</label>
    <input id="text" type="text />
    <span id="counter">0</span> characters
````

````javascript
    document.getElementById('text').addEventListener('keyup', function() {
        document.getElementBy('counter').innerHTML = this.value.length;
    });
````

Although this code actually works it is not reusable because it is tightly coupled to specific elements (= configuration).
This coupling can be eliminated by separating the different concerns as followed:

````javascript
    var countCharacters = function(input, counter) {
        input.addEventListener('keyup', function() {
            counter.innerHTML = this.value.length;
        });
    };

    countCharacters(document.getElementById('text'), document.getElementById('counter'));
````

Now we have a reusable method and a one liner to intialize our counter instance on our website.
The problem is however that every time we want to use another character counter on another page we also have to write one line of initialization code. The description of the counter UI element is scattered through HTML and JavaScript. Some people will argue that this is fine as it follows the best practice of separating the content (HTML) and the behaviour (JavaScript). This is not correct. Looking at the one line of code we can see it does contain behaviour and implementation deatils but the description and configuration of our UI. We can bring the configuration part back to the view by using HTML5 data attributes and parse them in our JavaScript:

````html
    <label for="text">Enter your text:</label>
    <input id="text" type="text />
    <span data-counter-for="text">0</span> characters
````

````javascript
    document.querySelectorAll('[data-counter-for]').forEach(function(counter) {
        var inputId = counter.getAttribute('[data-counter-for]');
        var input document.getElementById(inputId);
        input.addEventListener('keyup', function() {
            counter.innerHTML = this.value.length;
        });
    });
````

With the above code we can easily put counters on other pages without having to write one liners for the initialization. However there is one big mistake in the above sample implementation. Different concerns are mixed again. One is the functionality of the character counter and the other one is the mapping of the configuration to the initialization. So the correct way to do this would be: 

````html
    <label for="text">Enter your text:</label>
    <input id="text" type="text />
    <span data-counter-for="text">0</span> characters
````

````javascript

    var countCharacters = function(input, counter) {
        input.addEventListener('keyup', function() {
            counter.innerHTML = this.value.length;
        });
    };

    document.querySelectorAll('[data-counter-for]').forEach(function(counter) {
        var inputId = counter.getAttribute('[data-counter-for]');
        var input document.getElementById(inputId);
        countCharacters(input, counter);
    });
````

This is how all UI code should be written. Clear separation of concerns and declarative configuration of views. However after writing some UI elements and the corresponding mapping from data attribues one will soon notice that the mapping is almost the same for every element.

###Features

declarative provides a simple way to map user interface description and configuration to arbitrary JavaScript code. 
Using the example of the character from the introduction above we start off with the HTML:

````html
    <label for="text">Enter your text:</label>
    <input id="text" type="text />
    <span data-counter="target: '#text', ">0</span> characters
````

The are three values declarative considers for each UI element: the dom element, the type and the options.
In this example we have one <span> element which is augmented with counter type and
contains a target option value of of an CSS selector. Note the syntax of the data attribute value.
declarative accepts a comma separated list of key-value pairs where (only) the value must be surrounded by single quotes.

We already have implemented our actual character counting code:

````javascript
    var countCharacters = function(input, counter) {
        input.addEventListener('keyup', function() {
            counter.innerHTML = this.value.length;
        });
    };
````

Now we can add a mapping to the mapping registry of declarative:

```javascript
declarative.mappings.add({
    id: 'counter',
    prefix: 'data-widget-',
    types: ['counter']
    callback: function(element, type, options) {
        // ...
    }
});
````

The id of a mapping identifies it for later use. Any string is valid.
The prefix describes the string that is put before type description in an HTML element.
Normally it should start with 'data-' to make use of HTML5 data attributes.
The types array describes the valid types declarative should consider when applying this mapping.
The callback function is called for every match of the mapping when applied.
The parameters are the dom element, the type without the prefix and the options as an object.

To apply the mapping to the above HTML call the following:

```javascript
declarative.apply('widgets').to(document);
````