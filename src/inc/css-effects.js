mod('css-effects', () => { /* globals mod */
    const {jq, as_fn, block_evs} = mod('util');
    const add = mod('plugin');


    const css_run = (css, tev, settings, on_end) => {
        let $dot;

        const clean_up = () => {
            $dot.remove();
            as_fn(on_end)();
        };

        const fade_out = () => {
            $dot.animate(
                {
                    left: tev.left - settings.radius,
                    top: tev.top - settings.radius,
                    width: settings.radius * 2,
                    height: settings.radius * 2,
                    opacity: 0
                },
                settings.duration * 0.5,
                'linear',
                clean_up
            );
        };

        const fade_in = () => {
            $dot = jq('<div />').css(css);
            block_evs($dot);
            jq(tev.el).after($dot);
            $dot.animate(
                {
                    left: tev.left - settings.radius * 0.5,
                    top: tev.top - settings.radius * 0.5,
                    width: settings.radius,
                    height: settings.radius,
                    opacity: 1
                },
                settings.duration * 0.5,
                'linear',
                fade_out
            );
        };

        fade_in();
    };


    const SPLASH_DEFAULTS = {
        color: 'rgba(255,0,0,0.5)',
        radius: 300,
        duration: 1000
    };

    const splash_css = (tev, opts, cb) => {
        const settings = {...SPLASH_DEFAULTS, ...opts};
        const css = {
            position: 'absolute',
            zIndex: 1000,
            display: 'block',
            borderRadius: settings.radius,
            backgroundColor: settings.color,
            boxShadow: '0 0 30px ' + settings.color,
            left: tev.left,
            top: tev.top,
            width: 0,
            height: 0,
            opacity: 0.4
        };

        css_run(css, tev, settings, cb);
    };


    const DROPS_DEFAULTS = {
        color: 'rgba(255,0,0,0.5)',
        radius: 300,
        duration: 1000,
        width: 2,
        count: 3,
        delay: 300
    };

    const drops_css = (tev, opts, cb) => {
        const settings = {...DROPS_DEFAULTS, ...opts};
        const css = {
            position: 'absolute',
            zIndex: 1000,
            display: 'block',
            borderRadius: settings.radius,
            border: settings.width + 'px solid ' + settings.color,
            left: tev.left,
            top: tev.top,
            width: 0,
            height: 0,
            opacity: 0.4
        };

        const set_timer = (delay, cb1) => {
            setTimeout(() => css_run(css, tev, settings, cb1), delay);
        };

        for (let i = 0, delay = 0; i < settings.count; i += 1) {
            set_timer(delay, i === settings.count - 1 ? cb : undefined);
            delay += settings.delay;
        }
    };

    const drop_css = (tev, opts, cb) => {
        drops_css(tev, {...opts, count: 1}, cb);
    };


    add('splash-css', splash_css);
    add('drops-css', drops_css);
    add('drop-css', drop_css);
});
