(function () {
'use strict';
/* CSS Effects */

var $ = jQuery;

function blockEvents(event) {

    event.stopImmediatePropagation();
    event.preventDefault();
    return false;
}

function animation(css, event, settings, callback) {

    var $dot;

    function cleanUp() {

        $dot.remove();
        if (callback instanceof Function) {
            callback();
        }
    }

    function fadeOut() {

        $dot.animate(
            {
                left: event.position.left - settings.radius,
                top: event.position.top - settings.radius,
                width: settings.radius * 2,
                height: settings.radius * 2,
                opacity: 0
            },
            settings.duration * 0.5,
            'linear',
            cleanUp
        );
    }

    function fadeIn() {

        $dot = $('<div />')
                .css(css)
                .bind('click dblclick mousedown mouseenter mouseover mousemove', blockEvents);
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
            'linear',
            fadeOut
        );
    }

    function stop() {}

    fadeIn();

    return {
        stop: stop
    };
}


var splashDefaults = {
        color: 'rgba(255,0,0,0.5)',
        radius: 300,
        duration: 1000
    };

function SplashEffect() {

    this.id = 'splash-css';

    this.run = function (event, options, callback) {

        var settings = $.extend({}, splashDefaults, options);
        var css = {
                position: 'absolute',
                zIndex: 1000,
                display: 'block',
                borderRadius: settings.radius,
                backgroundColor: settings.color,
                boxShadow: '0 0 30px ' + settings.color,
                left: event.position.left,
                top: event.position.top,
                width: 0,
                height: 0,
                opacity: 0.4
            };

        animation(css, event, settings, callback);
    };
}


var dropsDefaults = {
        color: 'rgba(255,0,0,0.5)',
        radius: 300,
        duration: 1000,
        width: 2,
        count: 3,
        delay: 300
    };

function DropsEffect() {

    this.id = 'drops-css';

    this.run = function (event, options, callback) {

        var settings = $.extend({}, dropsDefaults, options);
        var css = {
                position: 'absolute',
                zIndex: 1000,
                display: 'block',
                borderRadius: settings.radius,
                border: settings.width + 'px solid ' + settings.color,
                left: event.position.left,
                top: event.position.top,
                width: 0,
                height: 0,
                opacity: 0.4
            };

        function setTimer(delay, callback) {
            setTimeout(function () {
                animation(css, event, settings, callback);
            }, delay);
        }

        var delay = 0;
        var i;

        for (i = 0; i < settings.count; i += 1) {
            setTimer(delay, i === settings.count - 1 ? callback : undefined);
            delay += settings.delay;
        }
    };
}

function DropEffect() {

    var drops = new DropsEffect();

    this.id = 'drop-css';

    this.run = function (event, options, callback) {

        drops.run(event, $.extend(options, { count: 1 }), callback);
    };
}


$.twinkle.add(new SplashEffect()).add(new DropEffect()).add(new DropsEffect());

}());
