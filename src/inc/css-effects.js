(() => {
    /* CSS Effects */

    const JQ = window.jQuery; // eslint-disable-line no-undef

    const drop_ev = event => {
        event.stopImmediatePropagation();
        event.preventDefault();
        return false;
    };

    const animation = (css, event, settings, callback) => {
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
                    left: event.position.left - settings.radius,
                    top: event.position.top - settings.radius,
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
                .bind('click dblclick mousedown mouseenter mouseover mousemove', drop_ev);
            JQ(event.element).after($dot);
            $dot.animate(
                {
                    left: event.position.left - settings.radius * 0.5,
                    top: event.position.top - settings.radius * 0.5,
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

    function SplashEffect() {
        this.id = 'splash-css';

        this.run = function run(event, options, callback) {
            const settings = {...SPLASH_DEFAULTS, ...options};
            const css = {
                position: 'absolute',
                zIndex: 1000,
                display: 'block',
                borderRadius: settings.radius,
                backgroundColor: settings.color,
                boxShadow: '0 0 30px ' + settings.color,
                left: event.position.left,
                top: event.position.top,
                width: 0,
                height: 0,
                opacity: 0.4
            };

            animation(css, event, settings, callback);
        };
    }


    const DROPS_DEFAULTS = {
        color: 'rgba(255,0,0,0.5)',
        radius: 300,
        duration: 1000,
        width: 2,
        count: 3,
        delay: 300
    };

    function DropsEffect() {
        this.id = 'drops-css';

        this.run = function run(event, options, callback) {
            const settings = {...DROPS_DEFAULTS, ...options};
            const css = {
                position: 'absolute',
                zIndex: 1000,
                display: 'block',
                borderRadius: settings.radius,
                border: settings.width + 'px solid ' + settings.color,
                left: event.position.left,
                top: event.position.top,
                width: 0,
                height: 0,
                opacity: 0.4
            };

            const set_timer = (delay, cb) => {
                setTimeout(() => animation(css, event, settings, cb), delay);
            };

            for (let i = 0, delay = 0; i < settings.count; i += 1) {
                set_timer(delay, i === settings.count - 1 ? callback : undefined);
                delay += settings.delay;
            }
        };
    }

    function DropEffect() {
        const drops = new DropsEffect();
        this.id = 'drop-css';

        this.run = (event, options, callback) => {
            drops.run(event, {...options, count: 1}, callback);
        };
    }

    JQ.twinkle.add(new SplashEffect());
    JQ.twinkle.add(new DropEffect());
    JQ.twinkle.add(new DropsEffect());
})();
