(() => {
    const WIN = window; // eslint-disable-line
    const jq = WIN.jQuery;
    const is_fn = jq.isFunction;

    const test = WIN.scar.test;
    const assert = WIN.scar.assert;

    test('Plugin access', () => {
        assert.ok(is_fn(jq().twinkle), 'jq().twinkle is function');
    });

    test.cli();
})();
