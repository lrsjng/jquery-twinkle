(() => {
    /* globals JQ Objects */

    const DROP_DEFAULTS = {
        color: 'rgba(255,0,0,0.5)',
        radius: 300,
        duration: 1000,
        width: 2
    };

    const drop = (tev, options, callback) => {
        const settings = {...DROP_DEFAULTS, ...options};
        const size = settings.radius * 2;
        const opa_ipl = Objects.interpolate([0.4, 1, 0]);
        const radius_ipl = Objects.interpolate([0, settings.radius]);

        const frame = ev => {
            const radius = radius_ipl(ev.frac);
            const opacity = opa_ipl(ev.frac);
            const ctx = ev.ctx;

            ctx
                .clear()
                .opacity(opacity)
                .path()
                .circle(ctx.width() * 0.5, ctx.height() * 0.5, radius)
                .stroke(settings.width, settings.color);
        };

        Objects.canvas_run(tev, size, size, frame, callback, settings.duration, 25);
    };

    const DROPS_DEFAULTS = {
        color: 'rgba(255,0,0,0.5)',
        radius: 300,
        duration: 1000,
        width: 2,
        count: 3,
        delay: 100
    };

    const scale_it = (x, scale, offset) => {
        scale = scale || 1;
        offset = offset || 0;
        x = (x - offset) / scale;
        return x >= 0 && x <= 1 ? x : undefined;
    };

    const drops = (tev, options, callback) => {
        const settings = {...DROPS_DEFAULTS, ...options};
        const size = settings.radius * 2;
        const opa_ipl = Objects.interpolate([0.4, 1, 0]);
        const radius_ipl = Objects.interpolate([0, settings.radius]);
        const scale = (settings.duration - (settings.count - 1) * settings.delay) / settings.duration;
        const offset = settings.delay / settings.duration;

        const frame = ev => {
            let i;
            let frac;
            let radius;
            let opacity;
            const ctx = ev.ctx;
            const width = ctx.width();
            const height = ctx.height();

            ctx.clear();
            for (i = 0; i < settings.count; i += 1) {
                frac = scale_it(ev.frac, scale, offset * i);

                if (frac !== undefined) {
                    radius = radius_ipl(frac);
                    opacity = opa_ipl(frac);
                    ctx
                        .opacity(opacity)
                        .path()
                        .circle(width * 0.5, height * 0.5, radius)
                        .stroke(settings.width, settings.color);
                }
            }
        };

        Objects.canvas_run(tev, size, size, frame, callback, settings.duration, 25);
    };

    JQ.twinkle.add('drop', drop);
    JQ.twinkle.add('drops', drops);
})();
