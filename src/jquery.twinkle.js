(() => {
    const WIN = window; // eslint-disable-line no-undef
    const JQ = WIN.jQuery;
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

    function TwinkleEvent(offX, offY, el, posX, posY) {
        this.offset = {left: offX, top: offY};
        this.element = el;
        this.position = {left: posX, top: posY};
    }

    class Twinkler {
        constructor() {
            this.effects = {};
        }

        add(effect) {
            if (!this.effects[effect.id]) {
                this.effects[effect.id] = effect;
            }
        }

        start(ev, options) {
            const settings = {...DEFAULTS, ...options};
            const effect = this.effects[settings.effect];

            if (effect) {
                ev.element = ev.element || 'body';
                effect.run(ev, settings.effectOptions, () => {
                    if (is_fn(settings.callback)) {
                        settings.callback();
                    }
                });
            }
        }

        start_el(el, options) {
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

            return this.start(new TwinkleEvent(offX, offY, el, posX, posY), options);
        }

        start_els(els, options) {
            const settings = {...DEFAULTS, ...options};
            let delay = settings.delay;
            els = Array.from(els);
            const last = els.length - 1;

            els.forEach((el, idx) => {
                const opts = {...options};
                if (idx !== last) {
                    opts.callback = null;
                }
                setTimeout(() => this.start_el(el, opts), delay);
                delay += settings.gap;
            });
        }
    }


    const twinkler = new Twinkler();

    JQ.twinkle = (el, left, top, opts) => twinkler.start(new TwinkleEvent(0, 0, el, left, top), opts);
    JQ.twinkle.add = effect => twinkler.add(effect);

    JQ.fn.twinkle = function main(options) {
        twinkler.start_els(this, options);
        return this;
    };
})();

// @include "inc/css-effects.js"
// @include "inc/canvas-effects.js"
