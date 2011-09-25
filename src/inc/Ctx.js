/*globals $, Objects */

(function () {

    var Path = function (ctx) {

        var context = ctx.getContext();

        context.beginPath();

        this.fill = function (fillStyle) {

            context.fillStyle = fillStyle;
            context.fill();
            return ctx;
        };

        this.stroke = function (lineWidth, strokeStyle) {

            context.lineWidth = lineWidth;
            context.strokeStyle = strokeStyle;
            context.stroke();
            return ctx;
        };

        this.draw = function (lineWidth, strokeStyle, fillStyle) {

            this.fill(fillStyle);
            this.stroke(lineWidth, strokeStyle);
            return ctx;
        };

        this.circle = function (x, y, radius) {

            context.arc(x, y, radius, 0, 2 * Math.PI, false);
            return this;
        };
    };


    Objects.Ctx = function (context) {

        if (!context || !context.canvas) {
            return undefined;
        } else if (!(this instanceof Objects.Ctx)) {
            return new Objects.Ctx(context);
        }

        var width = $(context.canvas).width(),
            height = $(context.canvas).height();

        this.getContext = function () {

            return context;
        };

        this.getWidth = function () {

            return width;
        };

        this.getHeight = function () {

            return height;
        };

        this.clear = function () {

            this.resetTransform();
            context.clearRect(0, 0, width, height);
            return this;
        };

        this.resetTransform = function () {

            context.setTransform(1, 0, 0, 1, 0, 0);
            return this;
        };

        this.translate = function (x, y) {

            context.translate(x, y);
            return this;
        };

        this.rotate = function (alpha) {

            context.rotate(Math.PI * alpha / 180);
            return this;
        };

        this.opacity = function (opacity) {

            context.globalAlpha = opacity;
            return this;
        };

        this.path = function () {

            return new Path(this);
        };
    };

}());
