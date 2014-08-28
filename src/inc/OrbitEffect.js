(function () {

var $ = jQuery;

var defaults = {
        color: 'rgba(255,0,0,0.5)',
        radius: 100,
        duration: 3000,
        satellites: 10,
        satellitesRadius: 10,
        circulations: 1.5
    };

function OrbitEffect() {

    this.id = 'orbit';

    this.run = function (twinkleEvent, options, callback) {

        var settings = $.extend({}, defaults, options);
        var size = settings.radius * 2;
        var opacityIpl = new Objects.Interpolator([ 0.4, 1, 1, 0.4 ]);
        var r = settings.radius - settings.satellitesRadius;
        var radiusIpl = new Objects.Interpolator([ 0, r, r, 0 ]);

        function frame(frameEvent) {

            var radius = radiusIpl.get(frameEvent.frac);
            var opacity = opacityIpl.get(frameEvent.frac);
            var bog = Math.PI * 2 * settings.circulations * frameEvent.frac;
            var ctx = frameEvent.ctx;
            var path, i, x, y;

            ctx
                .clear()
                .opacity(opacity)
                .translate(ctx.getWidth() * 0.5, ctx.getHeight() * 0.5);

            path = ctx.path();
            for (i = 0; i < settings.satellites; i += 1) {
                bog += Math.PI * 2 / settings.satellites;
                x = Math.cos(bog) * radius;
                y = Math.sin(bog) * radius;
                ctx.getContext().moveTo(x, y);
                path.circle(x, y, settings.satellitesRadius);
            }
            path.fill(settings.color);
        }

        new Objects.CanvasEffect(twinkleEvent, size, size, frame, callback).run(settings.duration, 25);
    };
}

$.twinkle.add(new OrbitEffect());

}());
