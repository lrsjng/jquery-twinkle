(() => {
    /* globals JQ Objects */

    const DEFAULTS = {
        color: 'rgba(255,0,0,0.5)',
        radius: 300,
        duration: 1000,
        width: 2
    };

    function DropEffect() {
        this.id = 'drop';

        this.run = (twinkleEvent, options, callback) => {
            const settings = {...DEFAULTS, ...options};
            const size = settings.radius * 2;
            const opa_ipl = new Objects.Interpolator([0.4, 1, 0]);
            const radius_ipl = new Objects.Interpolator([0, settings.radius]);

            const frame = ev => {
                const radius = radius_ipl.get(ev.frac);
                const opacity = opa_ipl.get(ev.frac);
                const ctx = ev.ctx;

                ctx
                    .clear()
                    .opacity(opacity)
                    .path()
                    .circle(ctx.getWidth() * 0.5, ctx.getHeight() * 0.5, radius)
                    .stroke(settings.width, settings.color);
            };

            new Objects.CanvasEffect(twinkleEvent, size, size, frame, callback).run(settings.duration, 25);
        };
    }

    JQ.twinkle.add(new DropEffect());
})();
