(() => {
    const JQ = window.jQuery; // eslint-disable-line no-undef
    const is_fn = x => typeof x === 'function';

    const DEFAULTS = {
        widthRatio: 0.5,
        heightRatio: 0.5,
        delay: 0,
        gap: 0,
        effect: 'splash',
        effectOptions: undefined,
        callback: undefined
    };

    const effects = {};

    const add = (name, fn) => {
        effects[name] = fn;
    };

    const start = (tev, opts) => {
        const settings = {...DEFAULTS, ...opts};
        const fn = effects[settings.effect];

        if (is_fn(fn)) {
            tev.el = tev.el || 'body';
            fn(tev, settings.effectOptions, () => {
                if (is_fn(settings.callback)) {
                    settings.callback();
                }
            });
        }
    };

    const start_el = (el, opts) => {
        const settings = {...DEFAULTS, ...opts};
        const $el = JQ(el);
        const pos = $el.position();
        const width = $el.outerWidth(true);
        const height = $el.outerHeight(true);
        const left = pos.left + width * settings.widthRatio;
        const top = pos.top + height * settings.heightRatio;
        return start({el, left, top}, opts);
    };

    const start_els = (els, opts) => {
        const settings = {...DEFAULTS, ...opts};
        els = Array.from(els);
        const last = els.length - 1;
        let delay = settings.delay;

        els.forEach((el, idx) => {
            const opts_i = {...opts};
            if (idx !== last) {
                opts_i.callback = null;
            }
            setTimeout(() => start_el(el, opts_i), delay);
            delay += settings.gap;
        });
    };

    JQ.twinkle = add;

    JQ.fn.twinkle = function main(opts) {
        start_els(this, opts);
        return this;
    };
})();

// @include "inc/css-effects.js"
// @include "inc/canvas-effects.js"
