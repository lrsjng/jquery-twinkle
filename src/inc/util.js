mod('util', () => { /* globals mod */
    const jq = window.jQuery; // eslint-disable-line no-undef
    const is_fn = x => typeof x === 'function';
    const as_fn = x => is_fn(x) ? x : () => null;

    const block_evs = el => {
        jq(el).bind('click mousedown mouseenter mouseover mousemove', ev => {
            ev.stopImmediatePropagation();
            ev.preventDefault();
            return false;
        });
    };

    return {jq, is_fn, as_fn, block_evs};
});
