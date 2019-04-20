(() => {
    const mod = (() => {
        const _defs = {};
        const _insts = {};

        return (id, fn) => {
            if (fn) {
                _defs[id] = fn;
            } else if (!_insts.hasOwnProperty(id)) {
                _insts[id] = _defs[id]();
            }
            return _insts[id];
        };
    })();

    // @include "inc/*.js"

    mod('plugin');
    mod('css-effects');
    mod('canvas-effects');
})();
