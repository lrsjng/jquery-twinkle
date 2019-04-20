(() => {
    /* globals Objects */

    function Interpolator(values) {
        function equiDist(vals) {
            const dist = 1 / (vals.length - 1);
            const pts = [];

            for (let i = 0; i < vals.length; i += 1) {
                pts.push({x: dist * i, y: vals[i]});
            }
            return pts;
        }

        const points = equiDist(values);

        function interpolate(p1, p2, x) {
            const m = (p2.y - p1.y) / (p2.x - p1.x);
            const y = p1.y + m * (x - p1.x);

            return y;
        }

        function findSection(x) {
            for (let i = 1; i < points.length; i += 1) {
                const prev = points[i - 1];
                const current = points[i];
                if (x >= prev.x && x <= current.x) {
                    return [prev, current];
                }
            }

            return undefined;
        }

        this.get = x => {
            x = Math.max(0, Math.min(1, x));
            const secPts = findSection(x);
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
    Objects.Interpolator.scale = scaleit;
})();
