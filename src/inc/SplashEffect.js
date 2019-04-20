(() => {
    /* globals JQ Objects */

    const DEFAULTS = {
        color: 'rgba(255,0,0,0.5)',
        radius: 300,
        duration: 1000
    };

    function SplashEffect() {
        this.id = 'splash';

        this.run = (twinkleEvent, options, callback) => {
            const settings = {...DEFAULTS, ...options};
            const size = settings.radius * 2;
            const opacityIpl = new Objects.Interpolator([0.4, 1, 0]);
            const radiusIpl = new Objects.Interpolator([0, settings.radius]);

            const frame = ev => {
                const radius = radiusIpl.get(ev.frac);
                const opacity = opacityIpl.get(ev.frac);
                const ctx = ev.ctx;

                ctx
                    .clear()
                    .opacity(opacity)
                    .path()
                    .circle(ctx.getWidth() * 0.5, ctx.getHeight() * 0.5, radius)
                    .fill(settings.color);
            };

            new Objects.CanvasEffect(twinkleEvent, size, size, frame, callback).run(settings.duration, 25);
        };
    }

    JQ.twinkle.add(new SplashEffect());
})();
