(() => {
    /* globals JQ Objects */

    function CanvasEffect(twinkleEvent, width, height, frame, callback) {
        if (!(this instanceof Objects.CanvasEffect)) {
            return new Objects.CanvasEffect(twinkleEvent, width, height, frame, callback);
        }

        const element = twinkleEvent.element;
        const x = twinkleEvent.position.left;
        const y = twinkleEvent.position.top;
        const css = {
            position: 'absolute',
            zIndex: 1000,
            display: 'block',
            left: x - width * 0.5,
            top: y - height * 0.5,
            width,
            height
        };

        this.run = (duration, fps) => {
            const frame_count = duration / 1000 * fps;
            const delta = 1 / frame_count;
            let $canvas;
            let ctx;

            const set_frame_timer = fraction => {
                setTimeout(() => {
                    if (ctx) {
                        frame({
                            ctx,
                            frac: fraction,
                            millis: duration * fraction
                        });
                    }
                }, duration * fraction);
            };

            const clean_up = () => {
                $canvas.remove();
                $canvas = undefined;
                ctx = undefined;
                if (callback instanceof Function) {
                    callback();
                }
            };

            const block_ev = ev => {
                ev.stopImmediatePropagation();
                ev.preventDefault();
                return false;
            };

            $canvas = JQ('<canvas />').attr('width', width).attr('height', height).css(css);
            JQ(element).after($canvas);
            $canvas.bind('click dblclick mousedown mouseenter mouseover mousemove', block_ev);
            ctx = new Objects.Ctx($canvas.get(0).getContext('2d'));

            for (let i = 0; i <= frame_count; i += 1) {
                set_frame_timer(i * delta);
            }

            setTimeout(clean_up, duration);
        };
    }

    Objects.CanvasEffect = CanvasEffect;
})();
