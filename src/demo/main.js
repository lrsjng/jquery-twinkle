const JQ = window.jQuery; // eslint-disable-line no-undef

[
    'splash', 'drop', 'drops', 'pulse', 'orbit',
    'splash-css', 'drop-css', 'drops-css'
].forEach(effect => {
    JQ('<div/>')
        .addClass('effect')
        .text(effect)
        .click(function cb() {
            JQ(this).twinkle({
                effect,
                effectOptions: {
                    radius: 100
                }
            });
        })
        .appendTo('body');
});
