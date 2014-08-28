(function () {

var $ = jQuery;

var defaults = {
        color: 'rgba(255,0,0,0.5)',
        radius: 300,
        duration: 1000,
        width: 2
    };

function DropEffect() {

    this.id = 'drop';

    this.run = function (twinkleEvent, options, callback) {

        var settings = $.extend({}, defaults, options);
        var size = settings.radius * 2;
        var opacityIpl = new Objects.Interpolator([ 0.4, 1, 0 ]);
        var radiusIpl = new Objects.Interpolator([ 0, settings.radius ]);

        function frame(frameEvent) {

            var radius = radiusIpl.get(frameEvent.frac);
            var opacity = opacityIpl.get(frameEvent.frac);
            var ctx = frameEvent.ctx;

            ctx
                .clear()
                .opacity(opacity)
                .path()
                .circle(ctx.getWidth() * 0.5, ctx.getHeight() * 0.5, radius)
                .stroke(settings.width, settings.color);
        }

        new Objects.CanvasEffect(twinkleEvent, size, size, frame, callback).run(settings.duration, 25);
    };
}

$.twinkle.add(new DropEffect());

}());
