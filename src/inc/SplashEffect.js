/*globals $, Objects */

(function () {

    var defaults = {
            color: "rgba(255,0,0,0.5)",
            radius: 300,
            duration: 1000
        },
        SplashEffect = function () {

            this.id = "splash";

            this.run = function (twinkleEvent, options, callback) {

                var settings = $.extend({}, defaults, options),
                    size = settings.radius * 2,
                    opacityIpl = new Objects.Interpolator([ 0.4, 1, 0 ]),
                    radiusIpl = new Objects.Interpolator([ 0, settings.radius ]),
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

                new Objects.CanvasEffect(twinkleEvent, size, size, frame, callback).run(settings.duration, 25);
            };
        };

    $.twinkle.add(new SplashEffect());

}());
