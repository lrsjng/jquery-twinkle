
(function (window, $, undefined) {
    "use strict";

    var Twinkle = window.Twinkle = window.Twinkle || {};


    Twinkle.Interpolator = function (values) {

        var points,
            equiDist = function (values) {

                var dist = 1 / (values.length - 1),
                    points = [],
                    i;

                for (i = 0; i < values.length; i++) {
                    points.push({ x: dist * i , y: values[i] });
                }
                return points;
            },
            interpolate = function (p1, p2, x) {

                var m = (p2.y - p1.y) / (p2.x - p1.x),
                    y = p1.y + m * (x - p1.x);

                return y;
            },
            findSection = function (x) {

                for (var i = 0; i < points.length; i++) {

                    if (i === 0) {
                        continue;
                    }

                    var prev = points[i-1];
                    var current = points[i];
                    if (x >= prev.x && x <= current.x) {
                        return [ prev, current ];
                    }
                }
                return undefined;
            };

        points = equiDist(values);

        this.get = function (x) {

            var secPts;

            x = Math.max(0, Math.min(1, x));
            secPts = findSection(x);
            return interpolate(secPts[0], secPts[1], x);
        };

    };

    Twinkle.Interpolator.scale = function (x, scale, offset) {

        scale = scale || 1;
        offset = offset || 0;
        x = (x - offset) / scale;
        return x >= 0 && x <= 1 ? x : undefined;
    };

}(window, jQuery));
