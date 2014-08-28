(function () {

function Interpolator(values) {

    var points;

    function equiDist(values) {

        var dist = 1 / (values.length - 1);
        var points = [];
        var i;

        for (i = 0; i < values.length; i += 1) {
            points.push({ x: dist * i , y: values[i] });
        }
        return points;
    }

    function interpolate(p1, p2, x) {

        var m = (p2.y - p1.y) / (p2.x - p1.x);
        var y = p1.y + m * (x - p1.x);

        return y;
    }

    function findSection(x) {

        var i, prev, current;

        for (i = 1; i < points.length; i += 1) {
            prev = points[i-1];
            current = points[i];
            if (x >= prev.x && x <= current.x) {
                return [ prev, current ];
            }
        }

        return undefined;
    }

    points = equiDist(values);

    this.get = function (x) {

        var secPts;

        x = Math.max(0, Math.min(1, x));
        secPts = findSection(x);
        return interpolate(secPts[0], secPts[1], x);
    };
}


function scaleit(x, scale, offset) {

    scale = scale || 1;
    offset = offset || 0;
    x = (x - offset) / scale;
    return x >= 0 && x <= 1 ? x : undefined;
}


Objects.Interpolator = Interpolator;
Objects.Interpolator.scale =  scaleit;

}());
