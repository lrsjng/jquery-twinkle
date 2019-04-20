mod('canvas-run', () => { /* globals mod */
    const {jq, as_fn, block_evs} = mod('util');
    const FPS = 25;

    class Ctx {
        constructor(ctx2d) {
            if (!ctx2d || !ctx2d.canvas) {
                return undefined;
            }
            this.ctx2d = ctx2d;
            this.width = jq(ctx2d.canvas).width();
            this.height = jq(ctx2d.canvas).height();
        }

        clear() {
            this.ctx2d.setTransform(1, 0, 0, 1, 0, 0);
            this.ctx2d.clearRect(0, 0, this.width, this.height);
            return this;
        }

        move_to(x, y) {
            this.ctx2d.moveTo(x, y);
            return this;
        }

        translate(x, y) {
            this.ctx2d.translate(x, y);
            return this;
        }

        opacity(alpha) {
            this.ctx2d.globalAlpha = alpha;
            return this;
        }

        path() {
            this.ctx2d.beginPath();
            return this;
        }

        circle(x, y, radius) {
            this.ctx2d.arc(x, y, radius, 0, 2 * Math.PI, false);
            return this;
        }

        fill(style) {
            this.ctx2d.fillStyle = style;
            this.ctx2d.fill();
            return this;
        }

        stroke(width, style) {
            this.ctx2d.lineWidth = width;
            this.ctx2d.strokeStyle = style;
            this.ctx2d.stroke();
            return this;
        }
    }

    return (tev, size, on_frame, on_end, duration) => {
        const css = {
            position: 'absolute',
            zIndex: 1000,
            display: 'block',
            left: tev.left - size * 0.5,
            top: tev.top - size * 0.5,
            width: size,
            height: size
        };

        let $canvas = jq(`<canvas width=${size} height=${size} />`).css(css);
        block_evs($canvas);
        jq(tev.el).after($canvas);
        let ctx = new Ctx($canvas.get(0).getContext('2d'));

        const set_frame_timer = frac => {
            setTimeout(() => {
                if (ctx) {
                    on_frame(ctx, frac);
                }
            }, duration * frac);
        };

        const clean_up = () => {
            $canvas.remove();
            $canvas = undefined;
            ctx = undefined;
            as_fn(on_end)();
        };

        const frame_count = duration / 1000 * FPS;
        for (let i = 0; i <= frame_count; i += 1) {
            set_frame_timer(i / frame_count);
        }

        setTimeout(clean_up, duration);
    };
});
