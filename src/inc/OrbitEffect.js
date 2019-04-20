(() => {
    /* globals JQ Objects */

    const DEFAULTS = {
        color: 'rgba(255,0,0,0.5)',
        radius: 100,
        duration: 3000,
        satellites: 10,
        satellitesRadius: 10,
        circulations: 1.5
    };

    function OrbitEffect() {
        this.id = 'orbit';

        this.run = (twinkleEvent, options, callback) => {
            const settings = {...DEFAULTS, ...options};
            const size = settings.radius * 2;
            const opa_ipl = new Objects.Interpolator([0.4, 1, 1, 0.4]);
            const r = settings.radius - settings.satellitesRadius;
            const radius_ipl = new Objects.Interpolator([0, r, r, 0]);

            function frame(frameEvent) {
                const radius = radius_ipl.get(frameEvent.frac);
                const opacity = opa_ipl.get(frameEvent.frac);
                let bog = Math.PI * 2 * settings.circulations * frameEvent.frac;
                const ctx = frameEvent.ctx;
                let i;
                let x;
                let y;

                ctx
                    .clear()
                    .opacity(opacity)
                    .translate(ctx.getWidth() * 0.5, ctx.getHeight() * 0.5);

                const path = ctx.path();
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

    JQ.twinkle.add(new OrbitEffect());
})();
