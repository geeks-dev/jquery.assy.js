/* jquery assy - v1.0.0 - 2014-02-04
* https://github.com/geeks-dev/jquery.assy.js
* Copyright (c) 2014 kaz; Licensed MIT */

(function(assy) {

    "use strict";
    assy(window.jQuery, window, document);

}

// Locally passes in `jQuery`, the `window` object, the `document` object, and an `undefined` variable.  The `jQuery`, `window` and `document` objects are passed in locally, to improve performance, since javascript first searches for a variable match within the local variables set before searching the global variables set.  All of the global variables are also passed in locally to be minifier friendly. `undefined` can be passed in locally, because it is not a reserved word in JavaScript.
(function($, window, document, undefined) {

    "use strict";

    var assClassName = "assy",
        assClass = "." + assClassName,
        insertTagClass = "assy-insert",
        headerClassName = "assy-header",
        headerClass = "." + headerClassName,
        subheaderClassName = "assy-subheader",
        subheaderClass = "." + subheaderClassName,
        itemClassName = "assy-item",
        itemClass = "." + itemClassName,
        extendPageClassName = "assy-extend-page",
        extendPageClass = "." + extendPageClassName;

    // Calling the jQueryUI Widget Factory Method
    $.widget("ass.assy", {

        //Plugin version
        version: "1.9.0",

        // These options will be used as defaults
        options: {

            // **context**: Accepts String: Any jQuery selector
            // The container element that holds all of the elements used to generate the table of contents
            context: "body",

            // **ignoreSelector**: Accepts String: Any jQuery selector
            // A selector to any element that would be matched by selectors that you wish to be ignored
            ignoreSelector: null,

            // **selectors**: Accepts an Array of Strings: Any jQuery selectors
            // The element's used to generate the table of contents.  The order is very important since it will determine the table of content's nesting structure
            selectors: "h1, h2, h3",

            // **showAndHide**: Accepts a boolean: true or false
            // Used to determine if elements should be shown and hidden
            showAndHide: true,

            navClass:'',

            // **scrollTo**: Accepts Number (pixels)
            // The amount of space between the top of page and the selected table of contents item after the page has been scrolled
            scrollTo: 0,

            // **extendPage**: Accepts a boolean: true or false
            // If a user scrolls to the bottom of the page and the page is not tall enough to scroll to the last table of contents item, then the page height is increased
            extendPage: true,

            // **extendPageOffset**: Accepts a number: pixels
            // How close to the bottom of the page a user must scroll before the page is extended
            extendPageOffset: 100,

            // **history**: Accepts a boolean: true or false
            // Adds a hash to the page url to maintain history
            history: true,

            // **scrollHistory**: Accepts a boolean: true or false
            // Adds a hash to the page url, to maintain history, when scrolling to a ASS item
            scrollHistory: false,

            // **hashGenerator**: How the hash value (the anchor segment of the URL, following the
            // # character) will be generated.
            //
            // "compact" (default) - #CompressesEverythingTogether
            // "pretty" - #looks-like-a-nice-url-and-is-easily-readable
            // function(text, element){} - Your own hash generation function that accepts the text as an
            // argument, and returns the hash value.
            hashGenerator: "compact",

            // **highlightDefault**: Accepts a boolean: true or false
            // Set's the first ASS item as active if no other ASS item is active.
            highlightDefault: true

        },

        // _Create
        // -------
        //      Constructs the plugin.  Only called once.
        _create: function() {

            var self = this;

            self.extendPageScroll = true;

            // Internal array that keeps track of all ASS items (Helps to recognize if there are duplicate ASS item strings)
            self.items = [];

            // Generates the HTML for the dynamic table of contents
            self._generateAss();

            // Adds CSS classes to the newly generated table of contents HTML

            self.webkit = (function() {

                for(var prop in window) {

                    if(prop) {

                        if(prop.toLowerCase().indexOf("webkit") !== -1) {

                            return true;

                        }

                    }

                }

                return false;

            }());

            // Adds jQuery event handlers to the newly generated table of contents

            // Binding to the Window load event to make sure the correct scrollTop is calculated
            $(window).load(function() {

                // Sets the active ASS item
                self._setActiveElement(true);

            });

        },

        // _generateAss
        // ------------
        //      Generates the HTML for the dynamic table of contents
        _generateAss: function() {

            // _Local variables_

            // Stores the plugin context in the self variable
            var self = this,

                // All of the HTML tags found within the context provided (i.e. body) that match the top level jQuery selector above
                firstElem,

                // Instantiated variable that will store the top level newly created unordered list DOM element
                ul,
                ignoreSelector = self.options.ignoreSelector;

             // If the selectors option has a comma within the string
             if(this.options.selectors.indexOf(",") !== -1) {

                 // Grabs the first selector from the string
                 firstElem = $(this.options.context).find(this.options.selectors.replace(/ /g,"").substr(0, this.options.selectors.indexOf(",")));

             }

             // If the selectors option does not have a comman within the string
             else {

                 // Grabs the first selector from the string and makes sure there are no spaces
                 firstElem = $(this.options.context).find(this.options.selectors.replace(/ /g,""));

             }


            self.element.addClass(assClassName);

            ul = $("<ul/>", {
                    "class": headerClassName+' nav '+this.options.navClass
                });

            self.element.append(ul);
            // Loops through each top level selector
            firstElem.each(function(index) {

                //If the element matches the ignoreSelector then we skip it
                if($(this).is(ignoreSelector)) {
                    return;
                }

                // Add the created unordered list element to the HTML element calling the plugin
                ul.append(self._nestElements($(this), index));
                // Finds all of the HTML tags between the header and subheader elements
                $(this).nextUntil(this.nodeName.toLowerCase()).each(function() {

                    // If there are no nested subheader elemements
                    if($(this).find(self.options.selectors).length === 0) {

                        // Loops through all of the subheader elements
                        $(this).filter(self.options.selectors).each(function() {

                            //If the element matches the ignoreSelector then we skip it
                            if($(this).is(ignoreSelector)) {
                                return;
                            }

                            self._appendSubheaders.call(this, self, ul);

                        });

                    }

                    // If there are nested subheader elements
                    else {

                        // Loops through all of the subheader elements
                        $(this).find(self.options.selectors).each(function() {

                            //If the element matches the ignoreSelector then we skip it
                            if($(this).is(ignoreSelector)) {
                                return;
                            }

                            self._appendSubheaders.call(this, self, ul);

                        });

                    }

                });

            });

        },

        _setActiveElement: function(pageload) {

            var self = this;

           
                self.element.find(itemClass).first().addClass("active");

            return self;

        },

        // _nestElements
        // -------------
        //      Helps create the table of contents list by appending nested list items
        _nestElements: function(self, index) {

            var arr, item, hashValue;

            arr = $.grep(this.items, function (item) {

                return item === self.text();

            });

            // If there is already a duplicate ASS item
            if(arr.length) {

                // Adds the current ASS item text and index (for slight randomization) to the internal array
                this.items.push(self.text() + index);

            }

            // If there not a duplicate ASS item
            else {

                // Adds the current ASS item text to the internal array
                this.items.push(self.text());

            }

            hashValue = this._generateHashValue(arr, self, index);

            // Appends a list item HTML element to the last unordered list HTML element found within the HTML element calling the plugin
            item = $("<li/>", {

                // Sets a common class name to the list item
                "class": itemClassName,

                "data-unique": hashValue

            }).append($("<a/>", {
                "href":'#'+hashValue,
                "text": self.text()

            }));
            // Adds an HTML anchor tag before the currently traversed HTML element
            self.before($("<div/>", {

                // Sets a name attribute on the anchor tag to the text of the currently traversed HTML element (also making sure that all whitespace is replaced with an underscore)
                "name": hashValue,
                "id": hashValue,
                "data-unique": hashValue,
                "class":insertTagClass,
                "style":"margin-top: -"+this.options.scrollTo+"px;padding-top:"+this.options.scrollTo+"px"
            }));

            return item;

        },

        // _generateHashValue
        // ------------------
        //      Generates the hash value that will be used to refer to each item.
        _generateHashValue: function(arr, self, index) {

            var hashValue = "",
                hashGeneratorOption = this.options.hashGenerator;

            if (hashGeneratorOption === "pretty") {

                // prettify the text
                hashValue = self.text().toLowerCase().replace(/\s/g, "-");

                // fix double hyphens
                while (hashValue.indexOf("--") > -1) {
                    hashValue = hashValue.replace(/--/g, "-");
                }

                // fix colon-space instances
                while (hashValue.indexOf(":-") > -1) {
                    hashValue = hashValue.replace(/:-/g, "-");
                }

            } else if (typeof hashGeneratorOption === "function") {

                // call the function
                hashValue = hashGeneratorOption(self.text(), self);

            } else {

                // compact - the default
                hashValue = self.text().replace(/\s/g, "");

            }

            // add the index if we need to
            if (arr.length) { hashValue += ""+index; }

            // return the value
            return hashValue;

        },

        // _appendElements
        // ---------------
        //      Helps create the table of contents list by appending subheader elements

        _appendSubheaders: function(self, ul) {

            // The current element index
            var index = $(this).index(self.options.selectors),

                // Finds the previous header DOM element
                previousHeader = $(self.options.selectors).eq(index - 1),

                currentTagName = +$(this).prop("tagName").charAt(1),

                previousTagName = +previousHeader.prop("tagName").charAt(1),

                lastSubheader;

            // If the current header DOM element is smaller than the previous header DOM element or the first subheader
            if(currentTagName < previousTagName) {

                // Selects the last unordered list HTML found within the HTML element calling the plugin
                self.element.find(subheaderClass + "[data-tag=" + currentTagName + "]").last().append(self._nestElements($(this), index));

            }

            // If the current header DOM element is the same type of header(eg. h4) as the previous header DOM element
            else if(currentTagName === previousTagName) {

                ul.find(itemClass).last().after(self._nestElements($(this), index));

            }

            else {
                // Selects the last unordered list HTML found within the HTML element calling the plugin
                ul.find(itemClass).last().
                
                // Appends an unorderedList HTML element to the dynamic `unorderedList` variable and sets a common class name
                append($("<ul/>", {
                    "class": subheaderClassName+' nav',
                    "data-tag": currentTagName,
                    html:self._nestElements($(this), index)
                }));
                
            }

        },

        // setOption
        // ---------
        //      Sets a single assy option after the plugin is invoked
        setOption: function() {

            // Calls the jQueryUI Widget Factory setOption method
            $.Widget.prototype._setOption.apply(this, arguments);

        },

        // setOptions
        // ----------
        //      Sets a single or multiple assy options after the plugin is invoked
        setOptions: function() {

            // Calls the jQueryUI Widget Factory setOptions method
            $.Widget.prototype._setOptions.apply(this, arguments);

        },

    });

})); //end of plugin
