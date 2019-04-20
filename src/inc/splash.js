(() => {
    /* globals JQ Objects */

    const SPLASH_DEFAULTS = {
        color: 'rgba(255,0,0,0.5)',
        radius: 300,
        duration: 1000
    };

    const splash = (tev, options, callback) => {
        const settings = {...SPLASH_DEFAULTS, ...options};
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
                .fill(settings.color);
        };

        Objects.canvas_run(tev, size, size, frame, callback, settings.duration, 25);
    };

    const PULSE_DEFAULTS = {
        color: 'rgba(255,0,0,0.5)',
        radius: 100,
        duration: 3000
    };

    const pulse = (tev, options, callback) => {
        const settings = {...PULSE_DEFAULTS, ...options};
        const size = settings.radius * 2;
        const opa_ipl = Objects.interpolate([0, 1, 0.6, 1, 0.6, 1, 0]);
        const radius_ipl = Objects.interpolate([0, settings.radius, settings.radius * 0.6, settings.radius, settings.radius * 0.6, settings.radius, 0]);

        const frame = ev => {
            const radius = radius_ipl(ev.frac);
            const opacity = opa_ipl(ev.frac);
            const ctx = ev.ctx;

            ctx
                .clear()
                .opacity(opacity)
                .path()
                .circle(ctx.width() * 0.5, ctx.height() * 0.5, radius)
                .fill(settings.color);
        };

        Objects.canvas_run(tev, size, size, frame, callback, settings.duration, 25);
    };

    const ORBIT_DEFAULTS = {
        color: 'rgba(255,0,0,0.5)',
        radius: 100,
        duration: 3000,
        satellites: 10,
        satellitesRadius: 10,
        circulations: 1.5
    };

    const orbit = (tev, options, callback) => {
        const settings = {...ORBIT_DEFAULTS, ...options};
        const size = settings.radius * 2;
        const opa_ipl = Objects.interpolate([0.4, 1, 1, 0.4]);
        const r = settings.radius - settings.satellitesRadius;
        const radius_ipl = Objects.interpolate([0, r, r, 0]);

        const frame = ev => {
            const radius = radius_ipl(ev.frac);
            const opacity = opa_ipl(ev.frac);
            let bog = Math.PI * 2 * settings.circulations * ev.frac;
            const ctx = ev.ctx;
            let i;
            let x;
            let y;

            ctx
                .clear()
                .opacity(opacity)
                .translate(ctx.width() * 0.5, ctx.height() * 0.5);

            const path = ctx.path();
            for (i = 0; i < settings.satellites; i += 1) {
                bog += Math.PI * 2 / settings.satellites;
                x = Math.cos(bog) * radius;
                y = Math.sin(bog) * radius;
                ctx.move_to(x, y);
                path.circle(x, y, settings.satellitesRadius);
            }
            path.fill(settings.color);
        };

        Objects.canvas_run(tev, size, size, frame, callback, settings.duration, 25);
    };

    JQ.twinkle.add('splash', splash);
    JQ.twinkle.add('pulse', pulse);
    JQ.twinkle.add('orbit', orbit);
})();
