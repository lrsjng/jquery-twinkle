/*
 * jQuery.twinkle %BUILD_VERSION%
 * http://larsjung.de/twinkle
 *
 * provided under the terms of the MIT License
 */

// @include "inc/modplug-0.4.js"


(function ($, undefined) {
    "use strict";

    var defaults = {
            widthRatio: 0.5,
            heightRatio: 0.5,
            delay: 0,
            gap: 0,
            effect: "splash",
            effectOptions: undefined,
            callback: undefined
        },
        Event = function (offX, offY, element, posX, posY) {

            this.offset = {left: offX, top: offY};
            this.element = element;
            this.position = {left: posX, top: posY};
        },
        Twinkler = function () {

            var effects = {};

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

                var settings = $.extend({}, defaults, options),
                    effect = effects[settings.effect];

                if (effect) {
                    event.element = event.element || "body";
                    effect.run(event, settings.effectOptions, settings.callback);
                }
                return this;
            };

            this.twinkleAtElement = function (htmlElement, options) {

                var settings = $.extend({}, defaults, options),
                    $htmlElement = $(htmlElement),
                    offset = $htmlElement.offset(),
                    position = $htmlElement.position(),
                    width = $htmlElement.outerWidth(true),
                    height = $htmlElement.outerHeight(true),
                    offX = offset.left + width * settings.widthRatio,
                    offY = offset.top + height * settings.heightRatio,
                    posX = position.left + width * settings.widthRatio,
                    posY = position.top + height * settings.heightRatio;

                return this.twinkle(new Event(offX, offY, htmlElement, posX, posY), options);
            };

            this.twinkleAtElements = function (htmlElements, options) {

                var self = this,
                    settings = $.extend({}, defaults, options),
                    delay = settings.delay,
                    $htmlElements = $(htmlElements),
                    size = $htmlElements.size();

                $htmlElements.each(function (idx) {

                    var htmlElement = this,
                        opts = $.extend({}, options);

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
        },
        twinkler = new Twinkler(),
        plugin = {
            statics: {
                twinkle: function (element, left, top, options) {

                    twinkler.twinkle(new Event(0, 0, element, left, top), options);
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
                }
            },
            defaultStatic: function () {

                return "twinkle";
            },
            defaultMethod: function () {

                return "twinkle";
            }
        };

    $.ModPlug.plugin("twinkle", plugin);

}(jQuery));

// @include "inc/css-effects.js"
// @include "inc/canvas-effects.js"

