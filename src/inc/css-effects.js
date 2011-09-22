/*
 * jQuery.twinkle %BUILD_VERSION%
 * CSS Effects
 * http://larsjung.de/twinkle
 *
 * provided under the terms of the MIT License
 */

(function ($, undefined) {
    "use strict";

    var blockEvents = function (event) {

            event.stopImmediatePropagation();
            event.preventDefault();
            return false;
        },
        animation = function (css, event, settings, callback) {

            var $dot,
                cleanUp = function () {
                    $dot.remove();
                    if (callback instanceof Function) {
                        callback();
                    }
                },
                fadeOut = function () {
                    $dot.animate(
                        {
                            left: event.position.left - settings.radius,
                            top: event.position.top - settings.radius,
                            width: settings.radius * 2,
                            height: settings.radius * 2,
                            opacity: 0
                        },
                        settings.duration * 0.5,
                        "linear",
                        cleanUp
                    );
                },
                fadeIn = function () {
                    $dot = $("<div />")
                            .css(css)
                            .bind("click dblclick mousedown mouseenter mouseover mousemove", blockEvents);
                    $(event.element).after($dot);
                    $dot.animate(
                        {
                            left: event.position.left - settings.radius * 0.5,
                            top: event.position.top - settings.radius * 0.5,
                            width: settings.radius,
                            height: settings.radius,
                            opacity: 1
                        },
                        settings.duration * 0.5,
                        "linear",
                        fadeOut
                    );
                };

            fadeIn();
        },
        splashDefaults = {
            color: "rgba(255,0,0,0.5)",
            radius: 300,
            duration: 1000
        },
        SplashEffect = function () {

            this.id = "splash-css";

            this.run = function (event, options, callback) {

                var settings = $.extend({}, splashDefaults, options),
                    css = {
                        position: "absolute",
                        zIndex: 1000,
                        display: "block",
                        borderRadius: settings.radius,
                        backgroundColor: settings.color,
                        boxShadow: "0 0 30px " + settings.color,
                        left: event.position.left,
                        top: event.position.top,
                        width: 0,
                        height: 0,
                        opacity: 0.4
                    };

                animation(css, event, settings, callback);
            };
        },
        dropsDefaults = {
            color: "rgba(255,0,0,0.5)",
            radius: 300,
            duration: 1000,
            width: 2,
            count: 3,
            delay: 300
        },
        DropsEffect = function () {

            this.id = "drops-css";

            this.run = function (event, options, callback) {

                var settings = $.extend({}, dropsDefaults, options),
                    css = {
                        position: "absolute",
                        zIndex: 1000,
                        display: "block",
                        borderRadius: settings.radius,
                        border: "" + settings.width + "px solid " + settings.color,
                        left: event.position.left,
                        top: event.position.top,
                        width: 0,
                        height: 0,
                        opacity: 0.4
                    },
                    setTimer = function (delay, callback) {
                        setTimeout(function () {
                            animation(css, event, settings, callback);
                        }, delay);
                    },
                    delay = 0,
                    i;

                for (i = 0; i < settings.count; i++) {
                    setTimer(delay, i === settings.count - 1 ? callback : undefined);
                    delay += settings.delay;
                }
            };
        },
        DropEffect = function () {

            var drops = new DropsEffect();

            this.id = "drop-css";

            this.run = function (event, options, callback) {

                drops.run(event, $.extend(options, { count: 1 }), callback);
            };
        };


    $.twinkle.add(new SplashEffect());
    $.twinkle.add(new DropEffect());
    $.twinkle.add(new DropsEffect());

}(jQuery));

