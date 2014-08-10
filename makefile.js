/*jshint node: true */
'use strict';


module.exports = function (make) {

	var path = require('path'),

		pkg = require('./package.json'),

		root = path.resolve(__dirname),
		src = path.resolve(root, 'src'),
		dist = path.join(root, 'dist'),
		build = path.resolve(root, 'build'),

		Event = make.Event,
		$ = make.fQuery;


	make.version('>=0.10.0');
	make.defaults('release');


	make.target('clean', [], 'delete build folder').sync(function () {

		$.DELETE(build);
		$.DELETE(dist);
	});


	make.target('lint', [], 'lint all JavaScript files with JSHint').sync(function () {

		var jshint = {
				// Enforcing Options
				bitwise: true,
				curly: true,
				eqeqeq: true,
				forin: true,
				latedef: true,
				newcap: true,
				noempty: true,
				plusplus: true,
				trailing: true,
				undef: true,

				// Environments
				browser: true
			},
			global = {
				'jQuery': true,
				'$': true,
				'modplug': true,
				'Objects': true
			};

		$(src + ': **/*.js, ! lib/**, ! demo/**')
			.jshint(jshint, global);
	});


	make.target('build', ['clean', 'lint'], 'build all updated files').sync(function () {

		var env = {
				pkg: pkg
			};

		$(src + ': *.js')
			.includify()
			.handlebars(env)
			.WRITE($.map.p(src, dist))
			.WRITE($.map.p(src, build).s('.js', '-' + pkg.version + '.js'))
			.uglifyjs()
			.WRITE($.map.p(src, dist).s('.js', '.min.js'))
			.WRITE($.map.p(src, build).s('.js', '-' + pkg.version + '.min.js'));

		$(src + ': demo/**')
			.handlebars(env)
			.WRITE($.map.p(src, build));

		$(root + ': *.md')
			.handlebars(env)
			.WRITE($.map.p(root, build));
	});


	make.target('release', ['build'], 'create a zipball').async(function (done, fail) {

		$(build + ': **').shzip({
			target: path.join(build, pkg.name + '-' + pkg.version + '.zip'),
			dir: build,
			callback: done
		});
	});
};
