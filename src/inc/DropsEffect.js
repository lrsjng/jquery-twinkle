(() => {
    /* globals JQ Objects */

    const DEFAULTS = {
        color: 'rgba(255,0,0,0.5)',
        radius: 300,
        duration: 1000,
        width: 2,
        count: 3,
        delay: 100
    };

    function DropsEffect() {
        this.id = 'drops';

        this.run = (twinkleEvent, options, callback) => {
            const settings = {...DEFAULTS, ...options};
            const size = settings.radius * 2;
            const opa_ipl = new Objects.Interpolator([0.4, 1, 0]);
            const radius_ipl = new Objects.Interpolator([0, settings.radius]);
            const scale = (settings.duration - (settings.count - 1) * settings.delay) / settings.duration;
            const offset = settings.delay / settings.duration;

            const frame = ev => {
                let i;
                let frac;
                let radius;
                let opacity;
                const ctx = ev.ctx;
                const width = ctx.getWidth();
                const height = ctx.getHeight();

                ctx.clear();
                for (i = 0; i < settings.count; i += 1) {
                    frac = Objects.Interpolator.scale(ev.frac, scale, offset * i);

                    if (frac !== undefined) {
                        radius = radius_ipl.get(frac);
                        opacity = opa_ipl.get(frac);
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
    }

    JQ.twinkle.add(new DropsEffect());
})();
