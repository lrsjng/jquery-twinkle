(() => {
    /* globals JQ Objects */

    function Path(ctx) {
        const self = this;
        const context = ctx.getContext();

        context.beginPath();

        self.fill = fillStyle => {
            context.fillStyle = fillStyle;
            context.fill();
            return ctx;
        };

        self.stroke = (lineWidth, strokeStyle) => {
            context.lineWidth = lineWidth;
            context.strokeStyle = strokeStyle;
            context.stroke();
            return ctx;
        };

        self.draw = (lineWidth, strokeStyle, fillStyle) => {
            self.fill(fillStyle);
            self.stroke(lineWidth, strokeStyle);
            return ctx;
        };

        self.circle = (x, y, radius) => {
            context.arc(x, y, radius, 0, 2 * Math.PI, false);
            return self;
        };
    }

    function Ctx(context) {
        if (!context || !context.canvas) {
            return undefined;
        }

        const self = this;
        const width = JQ(context.canvas).width();
        const height = JQ(context.canvas).height();

        self.getContext = () => {
            return context;
        };

        self.getWidth = () => {
            return width;
        };

        self.getHeight = () => {
            return height;
        };

        self.clear = () => {
            self.resetTransform();
            context.clearRect(0, 0, width, height);
            return self;
        };

        self.resetTransform = () => {
            context.setTransform(1, 0, 0, 1, 0, 0);
            return self;
        };

        self.translate = (x, y) => {
            context.translate(x, y);
            return self;
        };

        self.rotate = alpha => {
            context.rotate(Math.PI * alpha / 180);
            return self;
        };

        self.opacity = opacity => {
            context.globalAlpha = opacity;
            return self;
        };

        self.path = () => {
            return new Path(self);
        };
    }

    Objects.Ctx = Ctx;
})();
