(() => {
    const JQ = window.jQuery; // eslint-disable-line no-undef, no-unused-vars
    const Objects = {}; // eslint-disable-line no-unused-vars

    // @include "canvas-run.js"

    const DROPS_DEFAULTS = {
        color: 'rgba(255,0,0,0.5)',
        radius: 300,
        duration: 1000,
        width: 2,
        count: 3,
        delay: 300
    };

    const trans = (x, scale, offset) => {
        scale = scale || 1;
        offset = offset || 0;
        x = (x - offset) / scale;
        return x >= 0 && x <= 1 ? x : undefined;
    };

    const drops = (tev, options, cb) => {
        const settings = {...DROPS_DEFAULTS, ...options};
        const size = settings.radius * 2;
        const alpha_ipl = Objects.interpolate([0.4, 1, 0]);
        const radius_ipl = Objects.interpolate([0, settings.radius]);
        const scale = (settings.duration - (settings.count - 1) * settings.delay) / settings.duration;
        const offset = settings.delay / settings.duration;

        const on_frame = (ctx, frac) => {
            ctx.clear();
            for (let i = 0; i < settings.count; i += 1) {
                const f = trans(frac, scale, offset * i);
                if (f !== undefined) {
                    ctx.opacity(alpha_ipl(f))
                        .path()
                        .circle(ctx.width * 0.5, ctx.height * 0.5, radius_ipl(f))
                        .stroke(settings.width, settings.color);
                }
            }
        };

        Objects.canvas_run(tev, size, on_frame, cb, settings.duration);
    };

    const drop = (tev, options, cb) => {
        drops(tev, {...options, count: 1}, cb);
    };

    const SPLASH_DEFAULTS = {
        color: 'rgba(255,0,0,0.5)',
        radius: 300,
        duration: 1000
    };

    const splash = (tev, options, cb) => {
        const settings = {...SPLASH_DEFAULTS, ...options};
        const size = settings.radius * 2;
        const alpha_ipl = Objects.interpolate([0.4, 1, 0]);
        const radius_ipl = Objects.interpolate([0, settings.radius]);

        const on_frame = (ctx, frac) => {
            const radius = radius_ipl(frac);
            const opacity = alpha_ipl(frac);

            ctx.clear()
                .opacity(opacity)
                .path()
                .circle(ctx.width * 0.5, ctx.height * 0.5, radius)
                .fill(settings.color);
        };

        Objects.canvas_run(tev, size, on_frame, cb, settings.duration);
    };

    const PULSE_DEFAULTS = {
        color: 'rgba(255,0,0,0.5)',
        radius: 100,
        duration: 3000
    };

    const pulse = (tev, options, cb) => {
        const settings = {...PULSE_DEFAULTS, ...options};
        const size = settings.radius * 2;
        const alpha_ipl = Objects.interpolate([0, 1, 0.6, 1, 0.6, 1, 0]);
        const radius_ipl = Objects.interpolate([0, settings.radius, settings.radius * 0.6, settings.radius, settings.radius * 0.6, settings.radius, 0]);

        const on_frame = (ctx, frac) => {
            const radius = radius_ipl(frac);
            const opacity = alpha_ipl(frac);

            ctx.clear()
                .opacity(opacity)
                .path()
                .circle(ctx.width * 0.5, ctx.height * 0.5, radius)
                .fill(settings.color);
        };

        Objects.canvas_run(tev, size, on_frame, cb, settings.duration);
    };

    const ORBIT_DEFAULTS = {
        color: 'rgba(255,0,0,0.5)',
        radius: 100,
        duration: 3000,
        satellites: 10,
        satellitesRadius: 10,
        circulations: 1.5
    };

    const orbit = (tev, options, cb) => {
        const settings = {...ORBIT_DEFAULTS, ...options};
        const size = settings.radius * 2;
        const alpha_ipl = Objects.interpolate([0.4, 1, 1, 0.4]);
        const r = settings.radius - settings.satellitesRadius;
        const radius_ipl = Objects.interpolate([0, r, r, 0]);

        const on_frame = (ctx, frac) => {
            const radius = radius_ipl(frac);
            const opacity = alpha_ipl(frac);
            let bog = Math.PI * 2 * settings.circulations * frac;

            ctx.clear()
                .opacity(opacity)
                .translate(ctx.width * 0.5, ctx.height * 0.5);

            const path = ctx.path();
            for (let i = 0; i < settings.satellites; i += 1) {
                bog += Math.PI * 2 / settings.satellites;
                const x = Math.cos(bog) * radius;
                const y = Math.sin(bog) * radius;
                ctx.move_to(x, y);
                path.circle(x, y, settings.satellitesRadius);
            }
            path.fill(settings.color);
        };

        Objects.canvas_run(tev, size, on_frame, cb, settings.duration);
    };

    JQ.twinkle('drops', drops);
    JQ.twinkle('drop', drop);
    JQ.twinkle('splash', splash);
    JQ.twinkle('pulse', pulse);
    JQ.twinkle('orbit', orbit);
})();
