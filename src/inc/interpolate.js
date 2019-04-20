mod('interpolate', () => { /* globals mod */
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

    return interpolate;
});
