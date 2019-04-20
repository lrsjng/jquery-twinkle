mod('plugin', () => { /* globals mod */
    const {jq, is_fn, as_fn} = mod('util');

    const DEFAULTS = {
        widthRatio: 0.5,
        heightRatio: 0.5,
        effect: 'splash',
        effectOptions: undefined,
        callback: undefined
    };

    const effects = {};

    const add = (name, fn) => {
        effects[name] = fn;
    };

    const start_el = (el, opts) => {
        const settings = {...DEFAULTS, ...opts};
        const fn = effects[settings.effect];
        if (!is_fn(fn)) {
            as_fn(settings.callback)();
            return;
        }
        const $el = jq(el);
        const pos = $el.position();
        const width = $el.outerWidth(true);
        const height = $el.outerHeight(true);
        const left = pos.left + width * settings.widthRatio;
        const top = pos.top + height * settings.heightRatio;
        fn({el, left, top}, settings.effectOptions, as_fn(settings.callback));
    };

    const start_els = (els, opts) => {
        els = Array.from(els);
        let running = els.length;
        const cb = () => {
            running -= 1;
            if (!running) {
                as_fn(opts.callback)();
            }
        };
        els.forEach(el => start_el(el, {...opts, callback: cb}));
    };

    jq.fn.twinkle = function main(opts) {
        start_els(this, opts);
        return this;
    };

    return add;
});
