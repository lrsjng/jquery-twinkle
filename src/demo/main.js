
$(function () {

	$.each(['splash', 'drop', 'drops', 'pulse', 'orbit', 'splash-css', 'drop-css', 'drops-css'], function (idx, effect) {

		var id = '' + (idx+1);

		$('<div />')
			.addClass('ex')
			.addClass('ex' + id)
			.text(id + ' - ' + effect)
			.click(function () {
				$(this).twinkle({
					effect: effect,
					effectOptions: {
						radius: 100
					}
				});
			})
			.appendTo('body');
	});
});
