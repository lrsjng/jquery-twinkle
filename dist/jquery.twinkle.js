/*! jquery-twinkle v0.9.0 - https://larsjung.de/jquery-twinkle/ */
"use strict";

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

  var twinkle_ev = function twinkle_ev(offX, offY, el, posX, posY) {
    return {
      offset: {
        left: offX,
        top: offY
      },
      element: el,
      position: {
        left: posX,
        top: posY
      }
    };
  };

  var effects = {};

  var add = function add(name, fn) {
    effects[name] = fn;
  };

  var start = function start(ev, options) {
    var settings = _objectSpread({}, DEFAULTS, options);

    var fn = effects[settings.effect];

    if (is_fn(fn)) {
      ev.element = ev.element || 'body';
      fn(ev, settings.effectOptions, function () {
        if (is_fn(settings.callback)) {
          settings.callback();
        }
      });
    }
  };

  var start_el = function start_el(el, options) {
    var settings = _objectSpread({}, DEFAULTS, options);

    var $el = JQ(el);
    var offset = $el.offset();
    var position = $el.position();
    var width = $el.outerWidth(true);
    var height = $el.outerHeight(true);
    var offX = offset.left + width * settings.widthRatio;
    var offY = offset.top + height * settings.heightRatio;
    var posX = position.left + width * settings.widthRatio;
    var posY = position.top + height * settings.heightRatio;
    return start(twinkle_ev(offX, offY, el, posX, posY), options);
  };

  var start_els = function start_els(els, options) {
    var settings = _objectSpread({}, DEFAULTS, options);

    var delay = settings.delay;
    els = Array.from(els);
    var last = els.length - 1;
    els.forEach(function (el, idx) {
      var opts = _objectSpread({}, options);

      if (idx !== last) {
        opts.callback = null;
      }

      setTimeout(function () {
        return start_el(el, opts);
      }, delay);
      delay += settings.gap;
    });
  };

  JQ.twinkle = function (el, left, top, opts) {
    return start(twinkle_ev(0, 0, el, left, top), opts);
  };

  JQ.twinkle.add = add;

  JQ.fn.twinkle = function main(options) {
    start_els(this, options);
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

  var animation = function animation(css, ev, settings, callback) {
    var $dot;

    var clean_up = function clean_up() {
      $dot.remove();

      if (callback instanceof Function) {
        callback();
      }
    };

    var fade_out = function fade_out() {
      $dot.animate({
        left: ev.position.left - settings.radius,
        top: ev.position.top - settings.radius,
        width: settings.radius * 2,
        height: settings.radius * 2,
        opacity: 0
      }, settings.duration * 0.5, 'linear', clean_up);
    };

    var fade_in = function fade_in() {
      $dot = JQ('<div />').css(css).bind('click dblclick mousedown mouseenter mouseover mousemove', block_ev);
      JQ(ev.element).after($dot);
      $dot.animate({
        left: ev.position.left - settings.radius * 0.5,
        top: ev.position.top - settings.radius * 0.5,
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

  var splash_css = function splash_css(ev, options, callback) {
    var settings = _objectSpread({}, SPLASH_DEFAULTS, options);

    var css = {
      position: 'absolute',
      zIndex: 1000,
      display: 'block',
      borderRadius: settings.radius,
      backgroundColor: settings.color,
      boxShadow: '0 0 30px ' + settings.color,
      left: ev.position.left,
      top: ev.position.top,
      width: 0,
      height: 0,
      opacity: 0.4
    };
    animation(css, ev, settings, callback);
  };

  var DROPS_DEFAULTS = {
    color: 'rgba(255,0,0,0.5)',
    radius: 300,
    duration: 1000,
    width: 2,
    count: 3,
    delay: 300
  };

  var drops_css = function drops_css(ev, options, callback) {
    var settings = _objectSpread({}, DROPS_DEFAULTS, options);

    var css = {
      position: 'absolute',
      zIndex: 1000,
      display: 'block',
      borderRadius: settings.radius,
      border: settings.width + 'px solid ' + settings.color,
      left: ev.position.left,
      top: ev.position.top,
      width: 0,
      height: 0,
      opacity: 0.4
    };

    var set_timer = function set_timer(delay, cb) {
      setTimeout(function () {
        return animation(css, ev, settings, cb);
      }, delay);
    };

    for (var i = 0, delay = 0; i < settings.count; i += 1) {
      set_timer(delay, i === settings.count - 1 ? callback : undefined);
      delay += settings.delay;
    }
  };

  var drop_css = function drop_css(ev, options, callback) {
    drops_css(ev, _objectSpread({}, options, {
      count: 1
    }), callback);
  };

  JQ.twinkle.add('splash-css', splash_css);
  JQ.twinkle.add('drops-css', drops_css);
  JQ.twinkle.add('drop-css', drop_css);
})();

(function () {
  var JQ = window.jQuery; // eslint-disable-line no-undef, no-unused-vars

  var Objects = {}; // eslint-disable-line no-unused-vars

  (function () {
    /* globals Objects */
    var interpolate = function interpolate(values) {
      var points = values.map(function (y, i) {
        return {
          x: i / (values.length - 1),
          y: values[i]
        };
      });

      var find_section = function find_section(x) {
        for (var i = 1; i < points.length; i += 1) {
          var prev = points[i - 1];
          var current = points[i];

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
  })();

  (function () {
    /* globals JQ Objects */
    function Ctx(ctx2d) {
      var _this = this;

      if (!ctx2d || !ctx2d.canvas) {
        return undefined;
      }

      var width = JQ(ctx2d.canvas).width();
      var height = JQ(ctx2d.canvas).height();

      this.width = function () {
        return width;
      };

      this.height = function () {
        return height;
      };

      this.clear = function () {
        ctx2d.setTransform(1, 0, 0, 1, 0, 0);
        ctx2d.clearRect(0, 0, width, height);
        return _this;
      };

      this.move_to = function (x, y) {
        ctx2d.moveTo(x, y);
        return _this;
      };

      this.translate = function (x, y) {
        ctx2d.translate(x, y);
        return _this;
      };

      this.opacity = function (opacity) {
        ctx2d.globalAlpha = opacity;
        return _this;
      };

      this.path = function () {
        ctx2d.beginPath();
        return _this;
      };

      this.fill = function (fillStyle) {
        ctx2d.fillStyle = fillStyle;
        ctx2d.fill();
        return _this;
      };

      this.stroke = function (lineWidth, strokeStyle) {
        ctx2d.lineWidth = lineWidth;
        ctx2d.strokeStyle = strokeStyle;
        ctx2d.stroke();
        return _this;
      };

      this.circle = function (x, y, radius) {
        ctx2d.arc(x, y, radius, 0, 2 * Math.PI, false);
        return _this;
      };
    }

    var canvas_run = function canvas_run(tev, width, height, frame, callback, duration, fps) {
      var css = {
        position: 'absolute',
        zIndex: 1000,
        display: 'block',
        left: tev.position.left - width * 0.5,
        top: tev.position.top - height * 0.5,
        width: width,
        height: height
      };

      var block_ev = function block_ev(ev) {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        return false;
      };

      var $canvas = JQ('<canvas />').attr('width', width).attr('height', height).css(css);
      JQ(tev.element).after($canvas);
      $canvas.bind('click dblclick mousedown mouseenter mouseover mousemove', block_ev);
      var ctx = new Ctx($canvas.get(0).getContext('2d'));

      var set_frame_timer = function set_frame_timer(frac) {
        setTimeout(function () {
          if (ctx) {
            frame({
              ctx: ctx,
              frac: frac,
              millis: duration * frac
            });
          }
        }, duration * frac);
      };

      var clean_up = function clean_up() {
        $canvas.remove();
        $canvas = undefined;
        ctx = undefined;

        if (typeof callback === 'function') {
          callback();
        }
      };

      var frame_count = duration / 1000 * fps;

      for (var i = 0; i <= frame_count; i += 1) {
        set_frame_timer(i / frame_count);
      }

      setTimeout(clean_up, duration);
    };

    Objects.canvas_run = canvas_run;
  })();

  (function () {
    /* globals JQ Objects */
    var SPLASH_DEFAULTS = {
      color: 'rgba(255,0,0,0.5)',
      radius: 300,
      duration: 1000
    };

    var splash = function splash(tev, options, callback) {
      var settings = _objectSpread({}, SPLASH_DEFAULTS, options);

      var size = settings.radius * 2;
      var opa_ipl = Objects.interpolate([0.4, 1, 0]);
      var radius_ipl = Objects.interpolate([0, settings.radius]);

      var frame = function frame(ev) {
        var radius = radius_ipl(ev.frac);
        var opacity = opa_ipl(ev.frac);
        var ctx = ev.ctx;
        ctx.clear().opacity(opacity).path().circle(ctx.width() * 0.5, ctx.height() * 0.5, radius).fill(settings.color);
      };

      Objects.canvas_run(tev, size, size, frame, callback, settings.duration, 25);
    };

    var PULSE_DEFAULTS = {
      color: 'rgba(255,0,0,0.5)',
      radius: 100,
      duration: 3000
    };

    var pulse = function pulse(tev, options, callback) {
      var settings = _objectSpread({}, PULSE_DEFAULTS, options);

      var size = settings.radius * 2;
      var opa_ipl = Objects.interpolate([0, 1, 0.6, 1, 0.6, 1, 0]);
      var radius_ipl = Objects.interpolate([0, settings.radius, settings.radius * 0.6, settings.radius, settings.radius * 0.6, settings.radius, 0]);

      var frame = function frame(ev) {
        var radius = radius_ipl(ev.frac);
        var opacity = opa_ipl(ev.frac);
        var ctx = ev.ctx;
        ctx.clear().opacity(opacity).path().circle(ctx.width() * 0.5, ctx.height() * 0.5, radius).fill(settings.color);
      };

      Objects.canvas_run(tev, size, size, frame, callback, settings.duration, 25);
    };

    var ORBIT_DEFAULTS = {
      color: 'rgba(255,0,0,0.5)',
      radius: 100,
      duration: 3000,
      satellites: 10,
      satellitesRadius: 10,
      circulations: 1.5
    };

    var orbit = function orbit(tev, options, callback) {
      var settings = _objectSpread({}, ORBIT_DEFAULTS, options);

      var size = settings.radius * 2;
      var opa_ipl = Objects.interpolate([0.4, 1, 1, 0.4]);
      var r = settings.radius - settings.satellitesRadius;
      var radius_ipl = Objects.interpolate([0, r, r, 0]);

      var frame = function frame(ev) {
        var radius = radius_ipl(ev.frac);
        var opacity = opa_ipl(ev.frac);
        var bog = Math.PI * 2 * settings.circulations * ev.frac;
        var ctx = ev.ctx;
        var i;
        var x;
        var y;
        ctx.clear().opacity(opacity).translate(ctx.width() * 0.5, ctx.height() * 0.5);
        var path = ctx.path();

        for (i = 0; i < settings.satellites; i += 1) {
          bog += Math.PI * 2 / settings.satellites;
          x = Math.cos(bog) * radius;
          y = Math.sin(bog) * radius;
          ctx.move_to(x, y);
          path.circle(x, y, settings.satellitesRadius);
        }

        path.fill(settings.color);
      };

      Objects.canvas_run(tev, size, size, frame, callback, settings.duration, 25);
    };

    JQ.twinkle.add('splash', splash);
    JQ.twinkle.add('pulse', pulse);
    JQ.twinkle.add('orbit', orbit);
  })();

  (function () {
    /* globals JQ Objects */
    var DROP_DEFAULTS = {
      color: 'rgba(255,0,0,0.5)',
      radius: 300,
      duration: 1000,
      width: 2
    };

    var drop = function drop(tev, options, callback) {
      var settings = _objectSpread({}, DROP_DEFAULTS, options);

      var size = settings.radius * 2;
      var opa_ipl = Objects.interpolate([0.4, 1, 0]);
      var radius_ipl = Objects.interpolate([0, settings.radius]);

      var frame = function frame(ev) {
        var radius = radius_ipl(ev.frac);
        var opacity = opa_ipl(ev.frac);
        var ctx = ev.ctx;
        ctx.clear().opacity(opacity).path().circle(ctx.width() * 0.5, ctx.height() * 0.5, radius).stroke(settings.width, settings.color);
      };

      Objects.canvas_run(tev, size, size, frame, callback, settings.duration, 25);
    };

    var DROPS_DEFAULTS = {
      color: 'rgba(255,0,0,0.5)',
      radius: 300,
      duration: 1000,
      width: 2,
      count: 3,
      delay: 100
    };

    var scale_it = function scale_it(x, scale, offset) {
      scale = scale || 1;
      offset = offset || 0;
      x = (x - offset) / scale;
      return x >= 0 && x <= 1 ? x : undefined;
    };

    var drops = function drops(tev, options, callback) {
      var settings = _objectSpread({}, DROPS_DEFAULTS, options);

      var size = settings.radius * 2;
      var opa_ipl = Objects.interpolate([0.4, 1, 0]);
      var radius_ipl = Objects.interpolate([0, settings.radius]);
      var scale = (settings.duration - (settings.count - 1) * settings.delay) / settings.duration;
      var offset = settings.delay / settings.duration;

      var frame = function frame(ev) {
        var i;
        var frac;
        var radius;
        var opacity;
        var ctx = ev.ctx;
        var width = ctx.width();
        var height = ctx.height();
        ctx.clear();

        for (i = 0; i < settings.count; i += 1) {
          frac = scale_it(ev.frac, scale, offset * i);

          if (frac !== undefined) {
            radius = radius_ipl(frac);
            opacity = opa_ipl(frac);
            ctx.opacity(opacity).path().circle(width * 0.5, height * 0.5, radius).stroke(settings.width, settings.color);
          }
        }
      };

      Objects.canvas_run(tev, size, size, frame, callback, settings.duration, 25);
    };

    JQ.twinkle.add('drop', drop);
    JQ.twinkle.add('drops', drops);
  })();
})();