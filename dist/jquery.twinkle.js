/*! jquery-twinkle v0.9.0 - https://larsjung.de/jquery-twinkle/ */
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function () {
  var JQ = window.jQuery; // eslint-disable-line no-undef

  var is_fn = function is_fn(x) {
    return typeof x === 'function';
  };

  var DEFAULTS = {
    widthRatio: 0.5,
    heightRatio: 0.5,
    delay: 0,
    gap: 0,
    effect: 'splash',
    effectOptions: undefined,
    callback: undefined
  };
  var effects = {};

  var add = function add(name, fn) {
    effects[name] = fn;
  };

  var start = function start(tev, opts) {
    var settings = _objectSpread({}, DEFAULTS, opts);

    var fn = effects[settings.effect];

    if (is_fn(fn)) {
      tev.el = tev.el || 'body';
      fn(tev, settings.effectOptions, function () {
        if (is_fn(settings.callback)) {
          settings.callback();
        }
      });
    }
  };

  var start_el = function start_el(el, opts) {
    var settings = _objectSpread({}, DEFAULTS, opts);

    var $el = JQ(el);
    var pos = $el.position();
    var width = $el.outerWidth(true);
    var height = $el.outerHeight(true);
    var left = pos.left + width * settings.widthRatio;
    var top = pos.top + height * settings.heightRatio;
    return start({
      el: el,
      left: left,
      top: top
    }, opts);
  };

  var start_els = function start_els(els, opts) {
    var settings = _objectSpread({}, DEFAULTS, opts);

    els = Array.from(els);
    var last = els.length - 1;
    var delay = settings.delay;
    els.forEach(function (el, idx) {
      var opts_i = _objectSpread({}, opts);

      if (idx !== last) {
        opts_i.callback = null;
      }

      setTimeout(function () {
        return start_el(el, opts_i);
      }, delay);
      delay += settings.gap;
    });
  };

  JQ.twinkle = add;

  JQ.fn.twinkle = function main(opts) {
    start_els(this, opts);
    return this;
  };
})();

(function () {
  var JQ = window.jQuery; // eslint-disable-line no-undef

  var block_ev = function block_ev(ev) {
    ev.stopImmediatePropagation();
    ev.preventDefault();
    return false;
  };

  var css_run = function css_run(css, tev, settings, on_end) {
    var $dot;

    var clean_up = function clean_up() {
      $dot.remove();

      if (typeof on_end === 'function') {
        on_end();
      }
    };

    var fade_out = function fade_out() {
      $dot.animate({
        left: tev.left - settings.radius,
        top: tev.top - settings.radius,
        width: settings.radius * 2,
        height: settings.radius * 2,
        opacity: 0
      }, settings.duration * 0.5, 'linear', clean_up);
    };

    var fade_in = function fade_in() {
      $dot = JQ('<div />').css(css).bind('click mousedown mouseenter mouseover mousemove', block_ev);
      JQ(tev.el).after($dot);
      $dot.animate({
        left: tev.left - settings.radius * 0.5,
        top: tev.top - settings.radius * 0.5,
        width: settings.radius,
        height: settings.radius,
        opacity: 1
      }, settings.duration * 0.5, 'linear', fade_out);
    };

    fade_in();
  };

  var SPLASH_DEFAULTS = {
    color: 'rgba(255,0,0,0.5)',
    radius: 300,
    duration: 1000
  };

  var splash_css = function splash_css(tev, options, cb) {
    var settings = _objectSpread({}, SPLASH_DEFAULTS, options);

    var css = {
      position: 'absolute',
      zIndex: 1000,
      display: 'block',
      borderRadius: settings.radius,
      backgroundColor: settings.color,
      boxShadow: '0 0 30px ' + settings.color,
      left: tev.left,
      top: tev.top,
      width: 0,
      height: 0,
      opacity: 0.4
    };
    css_run(css, tev, settings, cb);
  };

  var DROPS_DEFAULTS = {
    color: 'rgba(255,0,0,0.5)',
    radius: 300,
    duration: 1000,
    width: 2,
    count: 3,
    delay: 300
  };

  var drops_css = function drops_css(tev, options, cb) {
    var settings = _objectSpread({}, DROPS_DEFAULTS, options);

    var css = {
      position: 'absolute',
      zIndex: 1000,
      display: 'block',
      borderRadius: settings.radius,
      border: settings.width + 'px solid ' + settings.color,
      left: tev.left,
      top: tev.top,
      width: 0,
      height: 0,
      opacity: 0.4
    };

    var set_timer = function set_timer(delay, cb1) {
      setTimeout(function () {
        return css_run(css, tev, settings, cb1);
      }, delay);
    };

    for (var i = 0, delay = 0; i < settings.count; i += 1) {
      set_timer(delay, i === settings.count - 1 ? cb : undefined);
      delay += settings.delay;
    }
  };

  var drop_css = function drop_css(tev, options, cb) {
    drops_css(tev, _objectSpread({}, options, {
      count: 1
    }), cb);
  };

  JQ.twinkle('splash-css', splash_css);
  JQ.twinkle('drops-css', drops_css);
  JQ.twinkle('drop-css', drop_css);
})();

(function () {
  var JQ = window.jQuery; // eslint-disable-line no-undef, no-unused-vars

  var Objects = {}; // eslint-disable-line no-unused-vars

  (function () {
    /* globals JQ Objects */
    var FPS = 25;

    var Ctx =
    /*#__PURE__*/
    function () {
      function Ctx(ctx2d) {
        _classCallCheck(this, Ctx);

        if (!ctx2d || !ctx2d.canvas) {
          return undefined;
        }

        this.ctx2d = ctx2d;
        this.width = JQ(ctx2d.canvas).width();
        this.height = JQ(ctx2d.canvas).height();
      }

      _createClass(Ctx, [{
        key: "clear",
        value: function clear() {
          this.ctx2d.setTransform(1, 0, 0, 1, 0, 0);
          this.ctx2d.clearRect(0, 0, this.width, this.height);
          return this;
        }
      }, {
        key: "move_to",
        value: function move_to(x, y) {
          this.ctx2d.moveTo(x, y);
          return this;
        }
      }, {
        key: "translate",
        value: function translate(x, y) {
          this.ctx2d.translate(x, y);
          return this;
        }
      }, {
        key: "opacity",
        value: function opacity(alpha) {
          this.ctx2d.globalAlpha = alpha;
          return this;
        }
      }, {
        key: "path",
        value: function path() {
          this.ctx2d.beginPath();
          return this;
        }
      }, {
        key: "circle",
        value: function circle(x, y, radius) {
          this.ctx2d.arc(x, y, radius, 0, 2 * Math.PI, false);
          return this;
        }
      }, {
        key: "fill",
        value: function fill(style) {
          this.ctx2d.fillStyle = style;
          this.ctx2d.fill();
          return this;
        }
      }, {
        key: "stroke",
        value: function stroke(width, style) {
          this.ctx2d.lineWidth = width;
          this.ctx2d.strokeStyle = style;
          this.ctx2d.stroke();
          return this;
        }
      }]);

      return Ctx;
    }();

    var canvas_run = function canvas_run(tev, size, on_frame, on_end, duration) {
      var css = {
        position: 'absolute',
        zIndex: 1000,
        display: 'block',
        left: tev.left - size * 0.5,
        top: tev.top - size * 0.5,
        width: size,
        height: size
      };

      var block_ev = function block_ev(ev) {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        return false;
      };

      var $canvas = JQ("<canvas width=".concat(size, " height=").concat(size, " />")).css(css).bind('click mousedown mouseenter mouseover mousemove', block_ev);
      JQ(tev.el).after($canvas);
      var ctx = new Ctx($canvas.get(0).getContext('2d'));

      var set_frame_timer = function set_frame_timer(frac) {
        setTimeout(function () {
          if (ctx) {
            on_frame(ctx, frac);
          }
        }, duration * frac);
      };

      var clean_up = function clean_up() {
        $canvas.remove();
        $canvas = undefined;
        ctx = undefined;

        if (typeof on_end === 'function') {
          on_end();
        }
      };

      var frame_count = duration / 1000 * FPS;

      for (var i = 0; i <= frame_count; i += 1) {
        set_frame_timer(i / frame_count);
      }

      setTimeout(clean_up, duration);
    };

    var interpolate = function interpolate(vals) {
      var pts = vals.map(function (y, i) {
        return {
          x: i / (vals.length - 1),
          y: y
        };
      });

      var find_section = function find_section(x) {
        for (var i = 1; i < pts.length; i += 1) {
          var prev = pts[i - 1];
          var current = pts[i];

          if (x >= prev.x && x <= current.x) {
            return [prev, current];
          }
        }

        return undefined;
      };

      var linear = function linear(p1, p2, x) {
        var m = (p2.y - p1.y) / (p2.x - p1.x);
        return p1.y + m * (x - p1.x);
      };

      return function (x) {
        x = x < 0 ? 0 : x > 1 ? 1 : x;
        var section = find_section(x);
        return linear(section[0], section[1], x);
      };
    };

    Objects.interpolate = interpolate;
    Objects.canvas_run = canvas_run;
  })();

  var DROPS_DEFAULTS = {
    color: 'rgba(255,0,0,0.5)',
    radius: 300,
    duration: 1000,
    width: 2,
    count: 3,
    delay: 300
  };

  var trans = function trans(x, scale, offset) {
    scale = scale || 1;
    offset = offset || 0;
    x = (x - offset) / scale;
    return x >= 0 && x <= 1 ? x : undefined;
  };

  var drops = function drops(tev, options, cb) {
    var settings = _objectSpread({}, DROPS_DEFAULTS, options);

    var size = settings.radius * 2;
    var alpha_ipl = Objects.interpolate([0.4, 1, 0]);
    var radius_ipl = Objects.interpolate([0, settings.radius]);
    var scale = (settings.duration - (settings.count - 1) * settings.delay) / settings.duration;
    var offset = settings.delay / settings.duration;

    var on_frame = function on_frame(ctx, frac) {
      ctx.clear();

      for (var i = 0; i < settings.count; i += 1) {
        var f = trans(frac, scale, offset * i);

        if (f !== undefined) {
          ctx.opacity(alpha_ipl(f)).path().circle(ctx.width * 0.5, ctx.height * 0.5, radius_ipl(f)).stroke(settings.width, settings.color);
        }
      }
    };

    Objects.canvas_run(tev, size, on_frame, cb, settings.duration);
  };

  var drop = function drop(tev, options, cb) {
    drops(tev, _objectSpread({}, options, {
      count: 1
    }), cb);
  };

  var SPLASH_DEFAULTS = {
    color: 'rgba(255,0,0,0.5)',
    radius: 300,
    duration: 1000
  };

  var splash = function splash(tev, options, cb) {
    var settings = _objectSpread({}, SPLASH_DEFAULTS, options);

    var size = settings.radius * 2;
    var alpha_ipl = Objects.interpolate([0.4, 1, 0]);
    var radius_ipl = Objects.interpolate([0, settings.radius]);

    var on_frame = function on_frame(ctx, frac) {
      var radius = radius_ipl(frac);
      var opacity = alpha_ipl(frac);
      ctx.clear().opacity(opacity).path().circle(ctx.width * 0.5, ctx.height * 0.5, radius).fill(settings.color);
    };

    Objects.canvas_run(tev, size, on_frame, cb, settings.duration);
  };

  var PULSE_DEFAULTS = {
    color: 'rgba(255,0,0,0.5)',
    radius: 100,
    duration: 3000
  };

  var pulse = function pulse(tev, options, cb) {
    var settings = _objectSpread({}, PULSE_DEFAULTS, options);

    var size = settings.radius * 2;
    var alpha_ipl = Objects.interpolate([0, 1, 0.6, 1, 0.6, 1, 0]);
    var radius_ipl = Objects.interpolate([0, settings.radius, settings.radius * 0.6, settings.radius, settings.radius * 0.6, settings.radius, 0]);

    var on_frame = function on_frame(ctx, frac) {
      var radius = radius_ipl(frac);
      var opacity = alpha_ipl(frac);
      ctx.clear().opacity(opacity).path().circle(ctx.width * 0.5, ctx.height * 0.5, radius).fill(settings.color);
    };

    Objects.canvas_run(tev, size, on_frame, cb, settings.duration);
  };

  var ORBIT_DEFAULTS = {
    color: 'rgba(255,0,0,0.5)',
    radius: 100,
    duration: 3000,
    satellites: 10,
    satellitesRadius: 10,
    circulations: 1.5
  };

  var orbit = function orbit(tev, options, cb) {
    var settings = _objectSpread({}, ORBIT_DEFAULTS, options);

    var size = settings.radius * 2;
    var alpha_ipl = Objects.interpolate([0.4, 1, 1, 0.4]);
    var r = settings.radius - settings.satellitesRadius;
    var radius_ipl = Objects.interpolate([0, r, r, 0]);

    var on_frame = function on_frame(ctx, frac) {
      var radius = radius_ipl(frac);
      var opacity = alpha_ipl(frac);
      var bog = Math.PI * 2 * settings.circulations * frac;
      ctx.clear().opacity(opacity).translate(ctx.width * 0.5, ctx.height * 0.5);
      var path = ctx.path();

      for (var i = 0; i < settings.satellites; i += 1) {
        bog += Math.PI * 2 / settings.satellites;
        var x = Math.cos(bog) * radius;
        var y = Math.sin(bog) * radius;
        ctx.move_to(x, y);
        path.circle(x, y, settings.satellitesRadius);
      }

      path.fill(settings.color);
    };

    Objects.canvas_run(tev, size, on_frame, cb, settings.duration);
  };

  JQ.twinkle('drops', drops);
  JQ.twinkle('drop', drop);
  JQ.twinkle('splash', splash);
  JQ.twinkle('pulse', pulse);
  JQ.twinkle('orbit', orbit);
})();