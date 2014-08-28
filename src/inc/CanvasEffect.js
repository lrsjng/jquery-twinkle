(function () {

function CanvasEffect(twinkleEvent, width, height, frame, callback) {

    if (!(this instanceof Objects.CanvasEffect)) {
        return new Objects.CanvasEffect(twinkleEvent, width, height, frame, callback);
    }

    var element = twinkleEvent.element;
    var x = twinkleEvent.position.left;
    var y = twinkleEvent.position.top;
    var css = {
            position: 'absolute',
            zIndex: 1000,
            display: 'block',
            left: x - width * 0.5,
            top: y - height * 0.5,
            width: width,
            height: height
        };

    this.run = function (duration, fps) {

        var $canvas, ctx, i;
        var frameCount = duration / 1000 * fps;
        var delta = 1 / frameCount;

        function setFrameTimer(fraction) {

            setTimeout(function () {

                if (ctx) {
                    frame({
                        ctx: ctx,
                        frac: fraction,
                        millis: duration * fraction
                    });
                }
            }, duration * fraction);
        }

        function cleanUp() {

            $canvas.remove();
            $canvas = undefined;
            ctx = undefined;
            if (callback instanceof Function) {
                callback();
            }
        }

        function blockEvents(event) {

            event.stopImmediatePropagation();
            event.preventDefault();
            return false;
        }

        $canvas = jQuery('<canvas />').attr('width', width).attr('height', height).css(css);
        jQuery(element).after($canvas);
        $canvas.bind('click dblclick mousedown mouseenter mouseover mousemove', blockEvents);
        ctx = new Objects.Ctx($canvas.get(0).getContext('2d'));

        for (i = 0; i <= frameCount; i += 1) {
            setFrameTimer(i * delta);
        }

        setTimeout(cleanUp, duration);
    };
}


Objects.CanvasEffect = CanvasEffect;

}());
