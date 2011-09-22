
(function (window, $, undefined) {

    var Twinkle = window.Twinkle = window.Twinkle || {};


    Twinkle.CanvasEffect = function (twinkleEvent, width, height, frame, callback) {

        if (!(this instanceof Twinkle.CanvasEffect)) {
            return new Twinkle.CanvasEffect(twinkleEvent, width, height, frame, callback);
        }

        var element = twinkleEvent.element,
            x = twinkleEvent.position.left,
            y = twinkleEvent.position.top,
            css = {
                position: "absolute",
                zIndex: 1000,
                display: "block",
                left: x - width * 0.5,
                top: y - height * 0.5,
                width: width,
                height: height
            };

        this.run = function (duration, fps) {

            var $canvas, ctx, i,
                frameCount = duration / 1000 * fps,
                delta = 1 / frameCount,
                setFrameTimer = function (fraction) {

                    setTimeout(function () {

                        if (ctx) {
                            frame({
                                ctx: ctx,
                                frac: fraction,
                                millis: duration * fraction
                            });
                        }
                    }, duration * fraction);
                },
                cleanUp = function () {

                    $canvas.remove();
                    $canvas = undefined;
                    ctx = undefined;
                    if (callback instanceof Function) {
                        callback();
                    }
                },
                blockEvents = function (event) {

                    event.stopImmediatePropagation();
                    event.preventDefault();
                    return false;
                };

            $canvas = $("<canvas />").attr("width", width).attr("height", height).css(css);
            $(element).after($canvas);
            $canvas.bind("click dblclick mousedown mouseenter mouseover mousemove", blockEvents);
            ctx = new Twinkle.Ctx($canvas.get(0).getContext("2d"));

            for (i = 0; i <= frameCount; i++) {
                setFrameTimer(i * delta);
            }

            setTimeout(cleanUp, duration);
        };
    };

}(window, jQuery));
