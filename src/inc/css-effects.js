(() => {
    const JQ = window.jQuery; // eslint-disable-line no-undef

    const block_ev = ev => {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        return false;
    };

    const animation = (css, ev, settings, callback) => {
        let $dot;

        const clean_up = () => {
            $dot.remove();
            if (callback instanceof Function) {
                callback();
            }
        };

        const fade_out = () => {
            $dot.animate(
                {
                    left: ev.position.left - settings.radius,
                    top: ev.position.top - settings.radius,
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
            $dot = JQ('<div />')
                .css(css)
                .bind('click dblclick mousedown mouseenter mouseover mousemove', block_ev);
            JQ(ev.element).after($dot);
            $dot.animate(
                {
                    left: ev.position.left - settings.radius * 0.5,
                    top: ev.position.top - settings.radius * 0.5,
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

    const splash_css = (ev, options, callback) => {
        const settings = {...SPLASH_DEFAULTS, ...options};
        const css = {
            position: 'absolute',
            zIndex: 1000,
            display: 'block',
            borderRadius: settings.radius,
            backgroundColor: settings.color,
            boxShadow: '0 0 30px ' + settings.color,
            left: ev.position.left,
            top: ev.position.top,
            width: 0,
            height: 0,
            opacity: 0.4
        };

        animation(css, ev, settings, callback);
    };


    const DROPS_DEFAULTS = {
        color: 'rgba(255,0,0,0.5)',
        radius: 300,
        duration: 1000,
        width: 2,
        count: 3,
        delay: 300
    };

    const drops_css = (ev, options, callback) => {
        const settings = {...DROPS_DEFAULTS, ...options};
        const css = {
            position: 'absolute',
            zIndex: 1000,
            display: 'block',
            borderRadius: settings.radius,
            border: settings.width + 'px solid ' + settings.color,
            left: ev.position.left,
            top: ev.position.top,
            width: 0,
            height: 0,
            opacity: 0.4
        };

        const set_timer = (delay, cb) => {
            setTimeout(() => animation(css, ev, settings, cb), delay);
        };

        for (let i = 0, delay = 0; i < settings.count; i += 1) {
            set_timer(delay, i === settings.count - 1 ? callback : undefined);
            delay += settings.delay;
        }
    };

    const drop_css = (ev, options, callback) => {
        drops_css(ev, {...options, count: 1}, callback);
    };

    JQ.twinkle.add('splash-css', splash_css);
    JQ.twinkle.add('drops-css', drops_css);
    JQ.twinkle.add('drop-css', drop_css);
})();
