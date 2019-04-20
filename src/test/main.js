(() => {
    const WIN = window; // eslint-disable-line
    const jq = WIN.jQuery;
    const is_fn = jq.isFunction;

    const test = WIN.scar.test;
    const assert = WIN.scar.assert;

    test('Plugin access', () => {
        assert.ok(is_fn(jq.twinkle), 'jq.twinkle is function');
        assert.ok(is_fn(jq().twinkle), 'jq().twinkle is function');

        assert.equal(Object.keys(jq.twinkle).length, 0, 'jq.twinkle has right number of members');
    });

    test.cli();
})();
