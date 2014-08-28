(function () {
'use strict';

var $ = jQuery;

var defaults = {
        widthRatio: 0.5,
        heightRatio: 0.5,
        delay: 0,
        gap: 0,
        effect: 'splash',
        effectOptions: undefined,
        callback: undefined
    };

var stopDefaults = {
        id: undefined,
        effectOptions: undefined,
        callback: undefined
    };


function TwinkleEvent(offX, offY, element, posX, posY) {

    this.offset = {left: offX, top: offY};
    this.element = element;
    this.position = {left: posX, top: posY};
}


function StopEvent(element) {

    this.element = element;
}


function Twinkler() {

    var effects = {};
    var running = {}; // element => {id: handle}

    function effectStarted(element, id, handle) {}
    function effectStopped(element, id) {}

    this.add = function (effect) {

        if (!effects[effect.id]) {
            effects[effect.id] = effect;
        }
        return this;
    };

    this.remove = function (effect) {

        if (effects[effect]) {
            delete effects[effect];
        } else if (effect.id && effects[effect.id]) {
            delete effects[effect.id];
        }
        return this;
    };

    this.twinkle = function (event, options) {

        var settings = $.extend({}, defaults, options);
        var effect = effects[settings.effect];

        if (effect) {
            event.element = event.element || 'body';
            effect.run(event, settings.effectOptions, function () {

                if ($.isFunction(settings.callback)) {
                    settings.callback();
                }
            });
        }
        return this;
    };

    this.stop = function (event, options) {

        var settings = $.extend({}, stopDefaults, options);
        var effect = effects[settings.effect];

        if (effect) {
            event.element = event.element || 'body';
            effect.stop(event, settings.effectOptions, settings.callback);
        }
        return this;
    };

    this.twinkleAtElement = function (htmlElement, options) {

        var settings = $.extend({}, defaults, options);
        var $htmlElement = $(htmlElement);
        var offset = $htmlElement.offset();
        var position = $htmlElement.position();
        var width = $htmlElement.outerWidth(true);
        var height = $htmlElement.outerHeight(true);
        var offX = offset.left + width * settings.widthRatio;
        var offY = offset.top + height * settings.heightRatio;
        var posX = position.left + width * settings.widthRatio;
        var posY = position.top + height * settings.heightRatio;

        return this.twinkle(new TwinkleEvent(offX, offY, htmlElement, posX, posY), options);
    };

    this.twinkleAtElements = function (htmlElements, options) {

        var self = this;
        var settings = $.extend({}, defaults, options);
        var delay = settings.delay;
        var $htmlElements = $(htmlElements);
        var size = $htmlElements.size();

        $htmlElements.each(function (idx) {

            var htmlElement = this;
            var opts = $.extend({}, options);

            if (idx !== size - 1) {
                delete opts.callback;
            }

            setTimeout(function () {
                self.twinkleAtElement(htmlElement, opts);
            }, delay);

            delay += settings.gap;
        });
        return this;
    };

    this.stopAtElement = function (htmlElement, options) {

        var settings = $.extend({}, defaults, options);
        var $htmlElement = $(htmlElement);
        var offset = $htmlElement.offset();
        var position = $htmlElement.position();
        var width = $htmlElement.outerWidth(true);
        var height = $htmlElement.outerHeight(true);
        var offX = offset.left + width * settings.widthRatio;
        var offY = offset.top + height * settings.heightRatio;
        var posX = position.left + width * settings.widthRatio;
        var posY = position.top + height * settings.heightRatio;

        return this.twinkle(new TwinkleEvent(offX, offY, htmlElement, posX, posY), options);
    };

    this.stopAtElements = function (htmlElements, options) {

        var self = this;
        var settings = $.extend({}, stopDefaults, options);
        var delay = settings.delay;
        var $htmlElements = $(htmlElements);
        var size = $htmlElements.size();

        $htmlElements.each(function (idx) {

            var htmlElement = this,
                opts = $.extend({}, options);

            if (idx !== size - 1) {
                delete opts.callback;
            }

            self.stopAtElement(htmlElement, opts);
        });
        return this;
    };
}



// @include "lib/modplug-1.0.js"

var twinkler = new Twinkler();
modplug('twinkle', {
    statics: {
        twinkle: function (element, left, top, options) {

            twinkler.twinkle(new TwinkleEvent(0, 0, element, left, top), options);
            return this;
        },
        add: function (effect) {

            twinkler.add(effect);
            return this;
        },
        remove: function (effect) {

            twinkler.remove(effect);
            return this;
        }
    },
    methods: {
        twinkle: function (options) {

            twinkler.twinkleAtElements(this, options);
            return this;
        },
        stop: function (options) {

            twinkler.stopAtElements(this, options);
            return this;
        }
    },
    defaultStatic: 'twinkle',
    defaultMethod: 'twinkle'
});

}());

// @include "inc/css-effects.js"
// @include "inc/canvas-effects.js"
