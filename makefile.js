/*jshint node: true */
'use strict';


module.exports = function (make) {

	var path = require('path'),

		pkg = require('./package.json'),

		root = path.resolve(__dirname),
		src = path.resolve(root, 'src'),
		build = path.resolve(root, 'build'),

		Event = make.Event,
		$ = make.fQuery;


	make.version('>=0.10.0');
	make.defaults('release');


	make.before(function () {

		var moment = make.moment();

		make.env = {
			pkg: pkg,
			stamp: moment.format('YYYY-MM-DD HH:mm:ss')
		};

		Event.info({ method: 'before', message: pkg.version + ' ' + make.env.stamp });
	});


	make.target('check-version', [], 'add git info to dev builds').async(function (done, fail) {

		if (!/\+$/.test(pkg.version)) {
			done();
			return;
		}

		$.git(root, function (err, result) {

			pkg.version += result.buildSuffix;
			Event.info({ method: 'check-version', message: 'version set to ' + pkg.version });
			done();
		});
	});


	make.target('clean', [], 'delete build folder').sync(function () {

		$.DELETE(build);
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
				browser: true,
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


	make.target('build', ['clean', 'check-version'], 'build all updated files').sync(function () {

		$(src + ': jquery.twinkle.js')
			.includify()
			.handlebars(make.env)
			.WRITE($.map.p(src, build).s('.js', '-' + pkg.version + '.js'))
			.uglifyjs()
			.WRITE($.map.p(src, build).s('.js', '-' + pkg.version + '.min.js'))

		$(src + ': demo/**')
			.handlebars(make.env)
			.WRITE($.map.p(src, build));

		$(root + ': README*, LICENSE*')
			.handlebars(make.env)
			.WRITE($.map.p(root, build));
	});


	make.target('release', ['clean', 'build'], 'create a zipball').async(function (done, fail) {

		$(build + ': **').shzip({
			target: path.join(build, pkg.name + '-' + pkg.version + '.zip'),
			dir: build,
			callback: done
		});
	});
};
