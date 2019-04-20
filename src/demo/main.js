const JQ = window.jQuery; // eslint-disable-line no-undef

[
    'splash', 'drop', 'drops', 'pulse', 'orbit',
    'splash-css', 'drop-css', 'drops-css'
].forEach(effect => {
    JQ(`<div class="effect">${effect}</div>`)
        .click(ev => {
            JQ(ev.target).twinkle({
                effect,
                effectOptions: {
                    radius: 100
                }
            });
        })
        .appendTo('body');
});
