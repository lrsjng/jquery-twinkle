/*
 * jQuery.twinkle %BUILD_VERSION%
 * Canvas Effects
 * http://larsjung.de/twinkle
 *
 * provided under the terms of the MIT License
 */

// @include "Ctx.js"
// @include "CanvasEffect.js"
// @include "Interpolator.js"

(function (window, $, undefined) {
    "use strict";

    var Twinkle = window.Twinkle = window.Twinkle || {},
        SplashEffect = function () {

            var defaults = {
                    color: "rgba(255,0,0,0.5)",
                    radius: 300,
                    duration: 1000
                };

            this.id = "splash";

            this.run = function (twinkleEvent, options, callback) {

                var settings = $.extend({}, defaults, options),
                    size = settings.radius * 2,
                    opacityIpl = new Twinkle.Interpolator([ 0.4, 1, 0 ]),
                    radiusIpl = new Twinkle.Interpolator([ 0, settings.radius ]),
                    frame = function (frameEvent) {

                        var radius = radiusIpl.get(frameEvent.frac),
                            opacity = opacityIpl.get(frameEvent.frac),
                            ctx = frameEvent.ctx;

                        ctx
                            .clear()
                            .opacity(opacity)
                            .path()
                            .circle(ctx.getWidth() * 0.5, ctx.getHeight() * 0.5, radius)
                            .fill(settings.color);
                    };

                new Twinkle.CanvasEffect(twinkleEvent, size, size, frame, callback).run(settings.duration, 25);
            };
        },
        DropEffect = function () {

            var defaults = {
                    color: "rgba(255,0,0,0.5)",
                    radius: 300,
                    duration: 1000,
                    width: 2
                };

            this.id = "drop";

            this.run = function (twinkleEvent, options, callback) {

                var settings = $.extend({}, defaults, options),
                    size = settings.radius * 2,
                    opacityIpl = new Twinkle.Interpolator([ 0.4, 1, 0 ]),
                    radiusIpl = new Twinkle.Interpolator([ 0, settings.radius ]),
                    frame = function (frameEvent) {

                        var radius = radiusIpl.get(frameEvent.frac),
                            opacity = opacityIpl.get(frameEvent.frac),
                            ctx = frameEvent.ctx;

                        ctx
                            .clear()
                            .opacity(opacity)
                            .path()
                            .circle(ctx.getWidth() * 0.5, ctx.getHeight() * 0.5, radius)
                            .stroke(settings.width, settings.color);
                    };

                new Twinkle.CanvasEffect(twinkleEvent, size, size, frame, callback).run(settings.duration, 25);
            };
        },
        DropsEffect = function () {

            var defaults = {
                    color: "rgba(255,0,0,0.5)",
                    radius: 300,
                    duration: 1000,
                    width: 2,
                    count: 3,
                    delay: 100
                };

            this.id = "drops";

            this.run = function (twinkleEvent, options, callback) {

                var settings = $.extend({}, defaults, options),
                    size = settings.radius * 2,
                    opacityIpl = new Twinkle.Interpolator([ 0.4, 1, 0 ]),
                    radiusIpl = new Twinkle.Interpolator([ 0, settings.radius ]),
                    scale = (settings.duration - (settings.count - 1) * settings.delay) / settings.duration,
                    offset = settings.delay / settings.duration,
                    frame = function (frameEvent) {

                        var i, frac, radius, opacity,
                            ctx = frameEvent.ctx,
                            width = ctx.getWidth(),
                            height = ctx.getHeight();

                        ctx.clear();
                        for (i = 0; i < settings.count; i++) {
                            frac = Twinkle.Interpolator.scale(frameEvent.frac, scale, offset * i);

                            if (frac !== undefined) {
                                radius = radiusIpl.get(frac);
                                opacity = opacityIpl.get(frac);
                                ctx
                                    .opacity(opacity)
                                    .path()
                                    .circle(width * 0.5, height * 0.5, radius)
                                    .stroke(settings.width, settings.color);
                            }
                        }
                    };

                new Twinkle.CanvasEffect(twinkleEvent, size, size, frame, callback).run(settings.duration, 25);
            };
        },
        PulseEffect = function () {

            var defaults = {
                    color: "rgba(255,0,0,0.5)",
                    radius: 100,
                    duration: 3000
                };

            this.id = "pulse";

            this.run = function (twinkleEvent, options, callback) {

                var settings = $.extend({}, defaults, options),
                    size = settings.radius * 2,
                    opacityIpl = new Twinkle.Interpolator([ 0, 1, 0.6, 1, 0.6, 1, 0 ]),
                    radiusIpl = new Twinkle.Interpolator([ 0, settings.radius, settings.radius * 0.6, settings.radius, settings.radius * 0.6, settings.radius, 0 ]),
                    frame = function (frameEvent) {

                        var radius = radiusIpl.get(frameEvent.frac),
                            opacity = opacityIpl.get(frameEvent.frac),
                            ctx = frameEvent.ctx;

                        ctx
                            .clear()
                            .opacity(opacity)
                            .path()
                            .circle(ctx.getWidth() * 0.5, ctx.getHeight() * 0.5, radius)
                            .fill(settings.color);
                    };

                new Twinkle.CanvasEffect(twinkleEvent, size, size, frame, callback).run(settings.duration, 25);
            };
        },
        OrbitEffect = function () {

            var defaults = {
                    color: "rgba(255,0,0,0.5)",
                    radius: 100,
                    duration: 3000,
                    satellites: 10,
                    satellitesRadius: 10,
                    circulations: 1.5
                };

            this.id = "orbit";

            this.run = function (twinkleEvent, options, callback) {

                var settings = $.extend({}, defaults, options),
                    size = settings.radius * 2,
                    opacityIpl = new Twinkle.Interpolator([ 0.4, 1, 1, 0.4 ]),
                    r = settings.radius - settings.satellitesRadius,
                    radiusIpl = new Twinkle.Interpolator([ 0, r, r, 0 ]),
                    frame = function (frameEvent) {

                        var radius = radiusIpl.get(frameEvent.frac),
                            opacity = opacityIpl.get(frameEvent.frac),
                            bog = Math.PI * 2 * settings.circulations * frameEvent.frac,
                            ctx = frameEvent.ctx,
                            path, i, x, y;

                        ctx
                            .clear()
                            .opacity(opacity)
                            .translate(ctx.getWidth() * 0.5, ctx.getHeight() * 0.5);

                        path = ctx.path();
                        for (i = 0; i < settings.satellites; i++) {

                            bog += Math.PI * 2 / settings.satellites;
                            x = Math.cos(bog) * radius;
                            y = Math.sin(bog) * radius;
                            path.circle(x, y, settings.satellitesRadius);
                        }
                        path.fill(settings.color);
                    };

                new Twinkle.CanvasEffect(twinkleEvent, size, size, frame, callback).run(settings.duration, 25);
            };
        };


    $.twinkle.add(new SplashEffect());
    $.twinkle.add(new DropEffect());
    $.twinkle.add(new DropsEffect());
    $.twinkle.add(new PulseEffect());
    $.twinkle.add(new OrbitEffect());

}(window, jQuery));
