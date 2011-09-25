/*globals $, Objects */

(function () {

    var defaults = {
            color: "rgba(255,0,0,0.5)",
            radius: 300,
            duration: 1000,
            width: 2,
            count: 3,
            delay: 100
        },
        DropsEffect = function () {

            this.id = "drops";

            this.run = function (twinkleEvent, options, callback) {

                var settings = $.extend({}, defaults, options),
                    size = settings.radius * 2,
                    opacityIpl = new Objects.Interpolator([ 0.4, 1, 0 ]),
                    radiusIpl = new Objects.Interpolator([ 0, settings.radius ]),
                    scale = (settings.duration - (settings.count - 1) * settings.delay) / settings.duration,
                    offset = settings.delay / settings.duration,
                    frame = function (frameEvent) {

                        var i, frac, radius, opacity,
                            ctx = frameEvent.ctx,
                            width = ctx.getWidth(),
                            height = ctx.getHeight();

                        ctx.clear();
                        for (i = 0; i < settings.count; i += 1) {
                            frac = Objects.Interpolator.scale(frameEvent.frac, scale, offset * i);

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

                new Objects.CanvasEffect(twinkleEvent, size, size, frame, callback).run(settings.duration, 25);
            };
        };

    $.twinkle.add(new DropsEffect());

}());
