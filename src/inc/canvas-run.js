(() => {
    /* globals JQ Objects */

    const FPS = 25;

    class Ctx {
        constructor(ctx2d) {
            if (!ctx2d || !ctx2d.canvas) {
                return undefined;
            }
            this.ctx2d = ctx2d;
            this.width = JQ(ctx2d.canvas).width();
            this.height = JQ(ctx2d.canvas).height();
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

    const canvas_run = (tev, size, on_frame, on_end, duration) => {
        const css = {
            position: 'absolute',
            zIndex: 1000,
            display: 'block',
            left: tev.left - size * 0.5,
            top: tev.top - size * 0.5,
            width: size,
            height: size
        };

        const block_ev = ev => {
            ev.stopImmediatePropagation();
            ev.preventDefault();
            return false;
        };

        let $canvas = JQ(`<canvas width=${size} height=${size} />`)
            .css(css)
            .bind('click mousedown mouseenter mouseover mousemove', block_ev);
        JQ(tev.el).after($canvas);
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
            if (typeof on_end === 'function') {
                on_end();
            }
        };

        const frame_count = duration / 1000 * FPS;
        for (let i = 0; i <= frame_count; i += 1) {
            set_frame_timer(i / frame_count);
        }

        setTimeout(clean_up, duration);
    };

    const interpolate = vals => {
        const pts = vals.map((y, i) => ({x: i / (vals.length - 1), y}));

        const find_section = x => {
            for (let i = 1; i < pts.length; i += 1) {
                const prev = pts[i - 1];
                const current = pts[i];
                if (x >= prev.x && x <= current.x) {
                    return [prev, current];
                }
            }
            return undefined;
        };

        const linear = (p1, p2, x) => {
            const m = (p2.y - p1.y) / (p2.x - p1.x);
            return p1.y + m * (x - p1.x);
        };

        return x => {
            x = x < 0 ? 0 : x > 1 ? 1 : x;
            const section = find_section(x);
            return linear(section[0], section[1], x);
        };
    };

    Objects.interpolate = interpolate;
    Objects.canvas_run = canvas_run;
})();
