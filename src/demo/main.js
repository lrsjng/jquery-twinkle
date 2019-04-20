(() => {
    const jq = window.jQuery; // eslint-disable-line no-undef

    [
        'splash', 'drop', 'drops', 'pulse', 'orbit',
        'splash-css', 'drop-css', 'drops-css'
    ].forEach(effect => {
        jq(`<div class="effect">${effect}</div>`)
            .click(ev => {
                jq(ev.target).twinkle({
                    effect,
                    effectOptions: {
                        radius: 100
                    }
                });
            })
            .appendTo('body');
    });
})();
