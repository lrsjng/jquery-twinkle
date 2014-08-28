(function () {

var $ = jQuery;

var defaults = {
        color: 'rgba(255,0,0,0.5)',
        radius: 300,
        duration: 1000,
        width: 2,
        count: 3,
        delay: 100
    };

function DropsEffect() {

    this.id = 'drops';

    this.run = function (twinkleEvent, options, callback) {

        var settings = $.extend({}, defaults, options);
        var size = settings.radius * 2;
        var opacityIpl = new Objects.Interpolator([ 0.4, 1, 0 ]);
        var radiusIpl = new Objects.Interpolator([ 0, settings.radius ]);
        var scale = (settings.duration - (settings.count - 1) * settings.delay) / settings.duration;
        var offset = settings.delay / settings.duration;

        function frame(frameEvent) {

            var i, frac, radius, opacity;
            var ctx = frameEvent.ctx;
            var width = ctx.getWidth();
            var height = ctx.getHeight();

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
        }

        new Objects.CanvasEffect(twinkleEvent, size, size, frame, callback).run(settings.duration, 25);
    };
}

$.twinkle.add(new DropsEffect());

}());
