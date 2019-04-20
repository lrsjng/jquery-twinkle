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

    const twinkle_ev = (offX, offY, el, posX, posY) => {
        return {
            offset: {left: offX, top: offY},
            element: el,
            position: {left: posX, top: posY}
        };
    };

    const effects = {};

    const add = (name, fn) => {
        effects[name] = fn;
    };

    const start = (ev, options) => {
        const settings = {...DEFAULTS, ...options};
        const fn = effects[settings.effect];

        if (is_fn(fn)) {
            ev.element = ev.element || 'body';
            fn(ev, settings.effectOptions, () => {
                if (is_fn(settings.callback)) {
                    settings.callback();
                }
            });
        }
    };

    const start_el = (el, options) => {
        const settings = {...DEFAULTS, ...options};
        const $el = JQ(el);
        const offset = $el.offset();
        const position = $el.position();
        const width = $el.outerWidth(true);
        const height = $el.outerHeight(true);
        const offX = offset.left + width * settings.widthRatio;
        const offY = offset.top + height * settings.heightRatio;
        const posX = position.left + width * settings.widthRatio;
        const posY = position.top + height * settings.heightRatio;

        return start(twinkle_ev(offX, offY, el, posX, posY), options);
    };

    const start_els = (els, options) => {
        const settings = {...DEFAULTS, ...options};
        let delay = settings.delay;
        els = Array.from(els);
        const last = els.length - 1;

        els.forEach((el, idx) => {
            const opts = {...options};
            if (idx !== last) {
                opts.callback = null;
            }
            setTimeout(() => start_el(el, opts), delay);
            delay += settings.gap;
        });
    };

    JQ.twinkle = (el, left, top, opts) => start(twinkle_ev(0, 0, el, left, top), opts);
    JQ.twinkle.add = add;

    JQ.fn.twinkle = function main(options) {
        start_els(this, options);
        return this;
    };
})();

// @include "inc/css-effects.js"
// @include "inc/canvas-effects.js"
