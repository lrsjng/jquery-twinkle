(() => {
    /* globals JQ Objects */

    function Ctx(ctx2d) {
        if (!ctx2d || !ctx2d.canvas) {
            return undefined;
        }

        const width = JQ(ctx2d.canvas).width();
        const height = JQ(ctx2d.canvas).height();

        this.width = () => width;
        this.height = () => height;

        this.clear = () => {
            ctx2d.setTransform(1, 0, 0, 1, 0, 0);
            ctx2d.clearRect(0, 0, width, height);
            return this;
        };

        this.move_to = (x, y) => {
            ctx2d.moveTo(x, y);
            return this;
        };

        this.translate = (x, y) => {
            ctx2d.translate(x, y);
            return this;
        };

        this.opacity = opacity => {
            ctx2d.globalAlpha = opacity;
            return this;
        };

        this.path = () => {
            ctx2d.beginPath();
            return this;
        };

        this.fill = fillStyle => {
            ctx2d.fillStyle = fillStyle;
            ctx2d.fill();
            return this;
        };

        this.stroke = (lineWidth, strokeStyle) => {
            ctx2d.lineWidth = lineWidth;
            ctx2d.strokeStyle = strokeStyle;
            ctx2d.stroke();
            return this;
        };

        this.circle = (x, y, radius) => {
            ctx2d.arc(x, y, radius, 0, 2 * Math.PI, false);
            return this;
        };
    }

    const canvas_run = (tev, width, height, frame, callback, duration, fps) => {
        const css = {
            position: 'absolute',
            zIndex: 1000,
            display: 'block',
            left: tev.position.left - width * 0.5,
            top: tev.position.top - height * 0.5,
            width,
            height
        };

        const block_ev = ev => {
            ev.stopImmediatePropagation();
            ev.preventDefault();
            return false;
        };

        let $canvas = JQ('<canvas />').attr('width', width).attr('height', height).css(css);
        JQ(tev.element).after($canvas);
        $canvas.bind('click dblclick mousedown mouseenter mouseover mousemove', block_ev);
        let ctx = new Ctx($canvas.get(0).getContext('2d'));

        const set_frame_timer = frac => {
            setTimeout(() => {
                if (ctx) {
                    frame({ctx, frac, millis: duration * frac});
                }
            }, duration * frac);
        };

        const clean_up = () => {
            $canvas.remove();
            $canvas = undefined;
            ctx = undefined;
            if (typeof callback === 'function') {
                callback();
            }
        };

        const frame_count = duration / 1000 * fps;
        for (let i = 0; i <= frame_count; i += 1) {
            set_frame_timer(i / frame_count);
        }

        setTimeout(clean_up, duration);
    };

    Objects.canvas_run = canvas_run;
})();
