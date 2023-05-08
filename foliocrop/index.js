(() => {
  // node_modules/svelte/internal/index.mjs
  function noop() {
  }
  function run(fn) {
    return fn();
  }
  function blank_object() {
    return /* @__PURE__ */ Object.create(null);
  }
  function run_all(fns) {
    fns.forEach(run);
  }
  function is_function(thing) {
    return typeof thing === "function";
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
  }
  var src_url_equal_anchor;
  function src_url_equal(element_src, url) {
    if (!src_url_equal_anchor) {
      src_url_equal_anchor = document.createElement("a");
    }
    src_url_equal_anchor.href = url;
    return element_src === src_url_equal_anchor.href;
  }
  function is_empty(obj) {
    return Object.keys(obj).length === 0;
  }
  function subscribe(store, ...callbacks) {
    if (store == null) {
      return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
  }
  function get_store_value(store) {
    let value;
    subscribe(store, (_) => value = _)();
    return value;
  }
  function component_subscribe(component, store, callback) {
    component.$$.on_destroy.push(subscribe(store, callback));
  }
  function null_to_empty(value) {
    return value == null ? "" : value;
  }
  function action_destroyer(action_result) {
    return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
  }
  var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
  var ResizeObserverSingleton = class {
    constructor(options) {
      this.options = options;
      this._listeners = "WeakMap" in globals ? /* @__PURE__ */ new WeakMap() : void 0;
    }
    observe(element2, listener) {
      this._listeners.set(element2, listener);
      this._getObserver().observe(element2, this.options);
      return () => {
        this._listeners.delete(element2);
        this._observer.unobserve(element2);
      };
    }
    _getObserver() {
      var _a;
      return (_a = this._observer) !== null && _a !== void 0 ? _a : this._observer = new ResizeObserver((entries) => {
        var _a2;
        for (const entry of entries) {
          ResizeObserverSingleton.entries.set(entry.target, entry);
          (_a2 = this._listeners.get(entry.target)) === null || _a2 === void 0 ? void 0 : _a2(entry);
        }
      });
    }
  };
  ResizeObserverSingleton.entries = "WeakMap" in globals ? /* @__PURE__ */ new WeakMap() : void 0;
  var is_hydrating = false;
  function start_hydrating() {
    is_hydrating = true;
  }
  function end_hydrating() {
    is_hydrating = false;
  }
  function append(target, node) {
    target.appendChild(node);
  }
  function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
  }
  function detach(node) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }
  function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
      if (iterations[i])
        iterations[i].d(detaching);
    }
  }
  function element(name) {
    return document.createElement(name);
  }
  function svg_element(name) {
    return document.createElementNS("http://www.w3.org/2000/svg", name);
  }
  function text(data) {
    return document.createTextNode(data);
  }
  function space() {
    return text(" ");
  }
  function empty() {
    return text("");
  }
  function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
  }
  function attr(node, attribute, value) {
    if (value == null)
      node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
      node.setAttribute(attribute, value);
  }
  function children(element2) {
    return Array.from(element2.childNodes);
  }
  function set_data(text2, data) {
    data = "" + data;
    if (text2.data === data)
      return;
    text2.data = data;
  }
  function set_style(node, key, value, important) {
    if (value == null) {
      node.style.removeProperty(key);
    } else {
      node.style.setProperty(key, value, important ? "important" : "");
    }
  }
  function toggle_class(element2, name, toggle) {
    element2.classList[toggle ? "add" : "remove"](name);
  }
  var current_component;
  function set_current_component(component) {
    current_component = component;
  }
  var dirty_components = [];
  var binding_callbacks = [];
  var render_callbacks = [];
  var flush_callbacks = [];
  var resolved_promise = /* @__PURE__ */ Promise.resolve();
  var update_scheduled = false;
  function schedule_update() {
    if (!update_scheduled) {
      update_scheduled = true;
      resolved_promise.then(flush);
    }
  }
  function add_render_callback(fn) {
    render_callbacks.push(fn);
  }
  function add_flush_callback(fn) {
    flush_callbacks.push(fn);
  }
  var seen_callbacks = /* @__PURE__ */ new Set();
  var flushidx = 0;
  function flush() {
    if (flushidx !== 0) {
      return;
    }
    const saved_component = current_component;
    do {
      try {
        while (flushidx < dirty_components.length) {
          const component = dirty_components[flushidx];
          flushidx++;
          set_current_component(component);
          update(component.$$);
        }
      } catch (e) {
        dirty_components.length = 0;
        flushidx = 0;
        throw e;
      }
      set_current_component(null);
      dirty_components.length = 0;
      flushidx = 0;
      while (binding_callbacks.length)
        binding_callbacks.pop()();
      for (let i = 0; i < render_callbacks.length; i += 1) {
        const callback = render_callbacks[i];
        if (!seen_callbacks.has(callback)) {
          seen_callbacks.add(callback);
          callback();
        }
      }
      render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
      flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
  }
  function update($$) {
    if ($$.fragment !== null) {
      $$.update();
      run_all($$.before_update);
      const dirty2 = $$.dirty;
      $$.dirty = [-1];
      $$.fragment && $$.fragment.p($$.ctx, dirty2);
      $$.after_update.forEach(add_render_callback);
    }
  }
  function flush_render_callbacks(fns) {
    const filtered = [];
    const targets = [];
    render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
    targets.forEach((c) => c());
    render_callbacks = filtered;
  }
  var outroing = /* @__PURE__ */ new Set();
  var outros;
  function group_outros() {
    outros = {
      r: 0,
      c: [],
      p: outros
      // parent group
    };
  }
  function check_outros() {
    if (!outros.r) {
      run_all(outros.c);
    }
    outros = outros.p;
  }
  function transition_in(block, local) {
    if (block && block.i) {
      outroing.delete(block);
      block.i(local);
    }
  }
  function transition_out(block, local, detach2, callback) {
    if (block && block.o) {
      if (outroing.has(block))
        return;
      outroing.add(block);
      outros.c.push(() => {
        outroing.delete(block);
        if (callback) {
          if (detach2)
            block.d(1);
          callback();
        }
      });
      block.o(local);
    } else if (callback) {
      callback();
    }
  }
  var _boolean_attributes = [
    "allowfullscreen",
    "allowpaymentrequest",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "defer",
    "disabled",
    "formnovalidate",
    "hidden",
    "inert",
    "ismap",
    "loop",
    "multiple",
    "muted",
    "nomodule",
    "novalidate",
    "open",
    "playsinline",
    "readonly",
    "required",
    "reversed",
    "selected"
  ];
  var boolean_attributes = /* @__PURE__ */ new Set([..._boolean_attributes]);
  function bind(component, name, callback) {
    const index = component.$$.props[name];
    if (index !== void 0) {
      component.$$.bound[index] = callback;
      callback(component.$$.ctx[index]);
    }
  }
  function create_component(block) {
    block && block.c();
  }
  function mount_component(component, target, anchor, customElement) {
    const { fragment, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
      add_render_callback(() => {
        const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
        if (component.$$.on_destroy) {
          component.$$.on_destroy.push(...new_on_destroy);
        } else {
          run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
      });
    }
    after_update.forEach(add_render_callback);
  }
  function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
      flush_render_callbacks($$.after_update);
      run_all($$.on_destroy);
      $$.fragment && $$.fragment.d(detaching);
      $$.on_destroy = $$.fragment = null;
      $$.ctx = [];
    }
  }
  function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
      dirty_components.push(component);
      schedule_update();
      component.$$.dirty.fill(0);
    }
    component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
  }
  function init(component, options, instance8, create_fragment8, not_equal, props, append_styles, dirty2 = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
      fragment: null,
      ctx: [],
      // state
      props,
      update: noop,
      not_equal,
      bound: blank_object(),
      // lifecycle
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
      // everything else
      callbacks: blank_object(),
      dirty: dirty2,
      skip_bound: false,
      root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance8 ? instance8(component, options.props || {}, (i, ret, ...rest) => {
      const value = rest.length ? rest[0] : ret;
      if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
        if (!$$.skip_bound && $$.bound[i])
          $$.bound[i](value);
        if (ready)
          make_dirty(component, i);
      }
      return ret;
    }) : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    $$.fragment = create_fragment8 ? create_fragment8($$.ctx) : false;
    if (options.target) {
      if (options.hydrate) {
        start_hydrating();
        const nodes = children(options.target);
        $$.fragment && $$.fragment.l(nodes);
        nodes.forEach(detach);
      } else {
        $$.fragment && $$.fragment.c();
      }
      if (options.intro)
        transition_in(component.$$.fragment);
      mount_component(component, options.target, options.anchor, options.customElement);
      end_hydrating();
      flush();
    }
    set_current_component(parent_component);
  }
  var SvelteElement;
  if (typeof HTMLElement === "function") {
    SvelteElement = class extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
      }
      connectedCallback() {
        const { on_mount } = this.$$;
        this.$$.on_disconnect = on_mount.map(run).filter(is_function);
        for (const key in this.$$.slotted) {
          this.appendChild(this.$$.slotted[key]);
        }
      }
      attributeChangedCallback(attr2, _oldValue, newValue) {
        this[attr2] = newValue;
      }
      disconnectedCallback() {
        run_all(this.$$.on_disconnect);
      }
      $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
      }
      $on(type, callback) {
        if (!is_function(callback)) {
          return noop;
        }
        const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
        callbacks.push(callback);
        return () => {
          const index = callbacks.indexOf(callback);
          if (index !== -1)
            callbacks.splice(index, 1);
        };
      }
      $set($$props) {
        if (this.$$set && !is_empty($$props)) {
          this.$$.skip_bound = true;
          this.$$set($$props);
          this.$$.skip_bound = false;
        }
      }
    };
  }
  var SvelteComponent = class {
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    $on(type, callback) {
      if (!is_function(callback)) {
        return noop;
      }
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1)
          callbacks.splice(index, 1);
      };
    }
    $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    }
  };

  // node_modules/svelte/store/index.mjs
  var subscriber_queue = [];
  function writable(value, start = noop) {
    let stop;
    const subscribers = /* @__PURE__ */ new Set();
    function set(new_value) {
      if (safe_not_equal(value, new_value)) {
        value = new_value;
        if (stop) {
          const run_queue = !subscriber_queue.length;
          for (const subscriber of subscribers) {
            subscriber[1]();
            subscriber_queue.push(subscriber, value);
          }
          if (run_queue) {
            for (let i = 0; i < subscriber_queue.length; i += 2) {
              subscriber_queue[i][0](subscriber_queue[i + 1]);
            }
            subscriber_queue.length = 0;
          }
        }
      }
    }
    function update2(fn) {
      set(fn(value));
    }
    function subscribe2(run2, invalidate = noop) {
      const subscriber = [run2, invalidate];
      subscribers.add(subscriber);
      if (subscribers.size === 1) {
        stop = start(set) || noop;
      }
      run2(value);
      return () => {
        subscribers.delete(subscriber);
        if (subscribers.size === 0 && stop) {
          stop();
          stop = null;
        }
      };
    }
    return { set, update: update2, subscribe: subscribe2 };
  }

  // src/store.js
  var images = writable([]);
  var frames = writable([]);
  var nimage = writable(0);
  var pageframe = writable(3);
  var ratio = writable(1);
  var totalframe = writable(0);
  var dirty = writable(false);
  function defaultframe(idx = 0, r) {
    return [1e3 * (2 - idx) + 186, 139, 990, 2123];
  }
  var caltotalframe = () => {
    const imgs = get_store_value(images);
    let out = 0;
    for (let i = 0; i < imgs.length; i++) {
      out += imgs[i].frames?.length || 0;
    }
    return out;
  };
  var resizeframe = (frame, ratio2) => {
    const [x, y, w, h] = frame;
    return [x * ratio2, y * ratio2, w * ratio2, h * ratio2];
  };
  var selectimage = (n) => {
    const imgs = get_store_value(images);
    const nimg = get_store_value(nimage);
    const frms = get_store_value(frames);
    const r = get_store_value(ratio);
    if (imgs?.length && imgs[nimg]) {
      imgs[nimg].frames = frms.map((f) => resizeframe(f, 1 / r));
      dirty.set(true);
    }
    totalframe.set(caltotalframe());
    nimage.set(n);
  };
  var gentsv = () => {
    const imgs = get_store_value(images);
    const out = [];
    let seq = 1;
    for (let i = 0; i < imgs.length; i++) {
      for (let j = 0; j < imgs[i].frames?.length || 0; j++) {
        const [x, y, w, h] = imgs[i].frames[j];
        out.push(imgs[i].name + "	" + seq.toString().padStart(2, "0") + ".jpg	" + Math.round(x) + "	" + Math.round(y) + "	" + Math.round(w) + "	" + Math.round(h));
        seq++;
      }
    }
    return out.join("\n");
  };

  // src/inputnumber.svelte
  function create_if_block_1(ctx) {
    let span;
    let mounted;
    let dispose;
    return {
      c() {
        span = element("span");
        span.textContent = "\u23F4";
        attr(span, "title", "Ctrl \u2190 min");
        attr(span, "class", "stepper svelte-5fv0ws");
        toggle_class(
          span,
          "disabled",
          /*value*/
          ctx[0] == /*min*/
          ctx[3]
        );
      },
      m(target, anchor) {
        insert(target, span, anchor);
        if (!mounted) {
          dispose = listen(
            span,
            "mousedown",
            /*valdec*/
            ctx[7]
          );
          mounted = true;
        }
      },
      p(ctx2, dirty2) {
        if (dirty2 & /*value, min*/
        9) {
          toggle_class(
            span,
            "disabled",
            /*value*/
            ctx2[0] == /*min*/
            ctx2[3]
          );
        }
      },
      d(detaching) {
        if (detaching)
          detach(span);
        mounted = false;
        dispose();
      }
    };
  }
  function create_if_block(ctx) {
    let span;
    let mounted;
    let dispose;
    return {
      c() {
        span = element("span");
        span.textContent = "\u23F5";
        attr(span, "title", "Ctrl \u2192 max");
        attr(span, "class", "stepper svelte-5fv0ws");
        toggle_class(
          span,
          "disabled",
          /*value*/
          ctx[0] == /*max*/
          ctx[4]
        );
      },
      m(target, anchor) {
        insert(target, span, anchor);
        if (!mounted) {
          dispose = listen(
            span,
            "mousedown",
            /*valinc*/
            ctx[6]
          );
          mounted = true;
        }
      },
      p(ctx2, dirty2) {
        if (dirty2 & /*value, max*/
        17) {
          toggle_class(
            span,
            "disabled",
            /*value*/
            ctx2[0] == /*max*/
            ctx2[4]
          );
        }
      },
      d(detaching) {
        if (detaching)
          detach(span);
        mounted = false;
        dispose();
      }
    };
  }
  function create_fragment(ctx) {
    let span;
    let input;
    let setfocus_action;
    let mounted;
    let dispose;
    let if_block0 = (
      /*stepper*/
      ctx[1] && create_if_block_1(ctx)
    );
    let if_block1 = (
      /*stepper*/
      ctx[1] && create_if_block(ctx)
    );
    return {
      c() {
        span = element("span");
        if (if_block0)
          if_block0.c();
        input = element("input");
        if (if_block1)
          if_block1.c();
        attr(input, "title", "\u2191 \u2193 Ctrl-\u2191  Ctrl-\u2193");
        attr(
          input,
          "style",
          /*style*/
          ctx[2]
        );
        input.value = /*value*/
        ctx[0];
        attr(span, "class", "numinput svelte-5fv0ws");
      },
      m(target, anchor) {
        insert(target, span, anchor);
        if (if_block0)
          if_block0.m(span, null);
        append(span, input);
        if (if_block1)
          if_block1.m(span, null);
        if (!mounted) {
          dispose = [
            action_destroyer(setfocus_action = /*setfocus*/
            ctx[9].call(null, input)),
            listen(
              input,
              "keydown",
              /*keydown*/
              ctx[8]
            ),
            listen(
              input,
              "input",
              /*oninput*/
              ctx[5]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, [dirty2]) {
        if (
          /*stepper*/
          ctx2[1]
        ) {
          if (if_block0) {
            if_block0.p(ctx2, dirty2);
          } else {
            if_block0 = create_if_block_1(ctx2);
            if_block0.c();
            if_block0.m(span, input);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (dirty2 & /*style*/
        4) {
          attr(
            input,
            "style",
            /*style*/
            ctx2[2]
          );
        }
        if (dirty2 & /*value*/
        1 && input.value !== /*value*/
        ctx2[0]) {
          input.value = /*value*/
          ctx2[0];
        }
        if (
          /*stepper*/
          ctx2[1]
        ) {
          if (if_block1) {
            if_block1.p(ctx2, dirty2);
          } else {
            if_block1 = create_if_block(ctx2);
            if_block1.c();
            if_block1.m(span, null);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(span);
        if (if_block0)
          if_block0.d();
        if (if_block1)
          if_block1.d();
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function instance($$self, $$props, $$invalidate) {
    let { stepper = true } = $$props;
    let { style = "width:2rem" } = $$props;
    let { min = 1 } = $$props;
    let { value = min } = $$props;
    let { onChange } = $$props;
    let { autofocus = false } = $$props;
    let { max = max ? max : value > min ? value : Number.MAX_SAFE_INTEGER } = $$props;
    const clamp = (num, min2, max2) => num < min2 ? min2 : num > max2 ? max2 : num;
    const oninput = (evt) => {
      let val = parseInt(evt.target.value) || min;
      updateValue(val);
    };
    const updateValue = (val) => {
      val = parseInt(val);
      val = clamp(val, min, max) || min;
      if (value !== val) {
        if (onChange) {
          $$invalidate(0, value = onChange(val, value));
        } else {
          $$invalidate(0, value = val);
        }
      }
      return value;
    };
    const valinc = (evt) => {
      $$invalidate(0, value = value < max ? updateValue(evt.ctrlKey ? max : parseInt(value) + 1) : max);
    };
    const valdec = (evt) => $$invalidate(0, value = value > min ? updateValue(evt.ctrlKey ? min : parseInt(value) - 1) : min);
    const keydown = (evt) => {
      if (evt.key == "ArrowDown")
        valdec(evt);
      else if (evt.key == "ArrowUp")
        valinc(evt);
      else if (evt.key == "Enter")
        updateValue(value);
    };
    function setfocus(node) {
      if (autofocus)
        node.focus();
    }
    $$self.$$set = ($$props2) => {
      if ("stepper" in $$props2)
        $$invalidate(1, stepper = $$props2.stepper);
      if ("style" in $$props2)
        $$invalidate(2, style = $$props2.style);
      if ("min" in $$props2)
        $$invalidate(3, min = $$props2.min);
      if ("value" in $$props2)
        $$invalidate(0, value = $$props2.value);
      if ("onChange" in $$props2)
        $$invalidate(10, onChange = $$props2.onChange);
      if ("autofocus" in $$props2)
        $$invalidate(11, autofocus = $$props2.autofocus);
      if ("max" in $$props2)
        $$invalidate(4, max = $$props2.max);
    };
    return [
      value,
      stepper,
      style,
      min,
      max,
      oninput,
      valinc,
      valdec,
      keydown,
      setfocus,
      onChange,
      autofocus
    ];
  }
  var Inputnumber = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance, create_fragment, safe_not_equal, {
        stepper: 1,
        style: 2,
        min: 3,
        value: 0,
        onChange: 10,
        autofocus: 11,
        max: 4
      });
    }
  };
  var inputnumber_default = Inputnumber;

  // ../ptk/platform/chromefs.ts
  var m = typeof navigator !== "undefined" && navigator.userAgent.match(/Chrome\/(\d+)/);
  var supprtedBrowser = m && parseInt(m[1]) >= 86;
  var createBrowserDownload = (filename, buf) => {
    let file = new Blob([buf], { type: "application/octet-binary" });
    let a = document.createElement("a"), url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
  };

  // src/toolbar.svelte
  var { window: window_1 } = globals;
  function create_fragment2(ctx) {
    let button0;
    let t0;
    let t1;
    let inputnumber;
    let updating_value;
    let t2;
    let t3;
    let t4;
    let button1;
    let t5;
    let button1_disabled_value;
    let current;
    let mounted;
    let dispose;
    function inputnumber_value_binding(value) {
      ctx[7](value);
    }
    let inputnumber_props = {
      max: 3,
      min: 0,
      onChange: (
        /*onChange*/
        ctx[4]
      )
    };
    if (
      /*value*/
      ctx[0] !== void 0
    ) {
      inputnumber_props.value = /*value*/
      ctx[0];
    }
    inputnumber = new inputnumber_default({ props: inputnumber_props });
    binding_callbacks.push(() => bind(inputnumber, "value", inputnumber_value_binding));
    return {
      c() {
        button0 = element("button");
        t0 = text("\u6587\u4EF6\u593E");
        t1 = space();
        create_component(inputnumber.$$.fragment);
        t2 = space();
        t3 = text(
          /*$totalframe*/
          ctx[2]
        );
        t4 = space();
        button1 = element("button");
        t5 = text("\u5132\u5B58");
        attr(button0, "title", "Alt O");
        button0.disabled = /*$dirty*/
        ctx[1];
        attr(button1, "title", "Alt S");
        button1.disabled = button1_disabled_value = !/*$dirty*/
        ctx[1];
      },
      m(target, anchor) {
        insert(target, button0, anchor);
        append(button0, t0);
        insert(target, t1, anchor);
        mount_component(inputnumber, target, anchor);
        insert(target, t2, anchor);
        insert(target, t3, anchor);
        insert(target, t4, anchor);
        insert(target, button1, anchor);
        append(button1, t5);
        current = true;
        if (!mounted) {
          dispose = [
            listen(
              window_1,
              "keydown",
              /*handleKeydown*/
              ctx[5]
            ),
            listen(
              button0,
              "click",
              /*getDir*/
              ctx[3]
            ),
            listen(
              button1,
              "click",
              /*save*/
              ctx[6]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, [dirty2]) {
        if (!current || dirty2 & /*$dirty*/
        2) {
          button0.disabled = /*$dirty*/
          ctx2[1];
        }
        const inputnumber_changes = {};
        if (!updating_value && dirty2 & /*value*/
        1) {
          updating_value = true;
          inputnumber_changes.value = /*value*/
          ctx2[0];
          add_flush_callback(() => updating_value = false);
        }
        inputnumber.$set(inputnumber_changes);
        if (!current || dirty2 & /*$totalframe*/
        4)
          set_data(
            t3,
            /*$totalframe*/
            ctx2[2]
          );
        if (!current || dirty2 & /*$dirty*/
        2 && button1_disabled_value !== (button1_disabled_value = !/*$dirty*/
        ctx2[1])) {
          button1.disabled = button1_disabled_value;
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(inputnumber.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(inputnumber.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(button0);
        if (detaching)
          detach(t1);
        destroy_component(inputnumber, detaching);
        if (detaching)
          detach(t2);
        if (detaching)
          detach(t3);
        if (detaching)
          detach(t4);
        if (detaching)
          detach(button1);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function instance2($$self, $$props, $$invalidate) {
    let $pageframe;
    let $dirty;
    let $ratio;
    let $frames;
    let $images;
    let $nimage;
    let $totalframe;
    component_subscribe($$self, pageframe, ($$value) => $$invalidate(9, $pageframe = $$value));
    component_subscribe($$self, dirty, ($$value) => $$invalidate(1, $dirty = $$value));
    component_subscribe($$self, ratio, ($$value) => $$invalidate(10, $ratio = $$value));
    component_subscribe($$self, frames, ($$value) => $$invalidate(11, $frames = $$value));
    component_subscribe($$self, images, ($$value) => $$invalidate(12, $images = $$value));
    component_subscribe($$self, nimage, ($$value) => $$invalidate(13, $nimage = $$value));
    component_subscribe($$self, totalframe, ($$value) => $$invalidate(2, $totalframe = $$value));
    const previmage = () => {
      let n = $nimage;
      n--;
      if (n < 0)
        n = 0;
      selectimage(n);
    };
    let dirHandle;
    async function getDir() {
      dirHandle = await window.showDirectoryPicker();
      const out = [];
      for await (const entry of dirHandle.values()) {
        if (entry.kind == "file" && (entry.name.endsWith(".png") || entry.name.endsWith(".jpg"))) {
          out.push({
            entry,
            name: entry.name,
            frames: out.length ? null : []
          });
        }
      }
      nimage.set(0);
      images.set(out);
    }
    const nextimage = () => {
      let n = $nimage;
      n++;
      if (n >= $images?.length)
        n = $images?.length - 1;
      selectimage(n);
    };
    const onChange = (v, oldv) => {
      pageframe.set(v);
      const f = $frames;
      if (f.length > v) {
        f.length = v;
      } else if (v > f.length) {
        while (v > f.length) {
          f.push(defaultframe(f.length, $ratio));
        }
      }
      frames.set(f);
      return v;
    };
    function handleKeydown(event) {
      const key = event.key.toLowerCase();
      if (!event.altKey)
        return;
      if (key == "n")
        nextimage();
      if (key == "p")
        previmage();
      else if (key == "o" && !$dirty)
        getDir();
      else if (key == "s" && $dirty)
        save();
    }
    let value = $pageframe;
    const save = () => {
      const data = gentsv();
      dirty.set(false);
      const outfn = dirHandle.name + ".tsv";
      createBrowserDownload(outfn, data);
    };
    function inputnumber_value_binding(value$1) {
      value = value$1;
      $$invalidate(0, value);
    }
    return [
      value,
      $dirty,
      $totalframe,
      getDir,
      onChange,
      handleKeydown,
      save,
      inputnumber_value_binding
    ];
  }
  var Toolbar = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance2, create_fragment2, safe_not_equal, {});
    }
  };
  var toolbar_default = Toolbar;

  // src/cropper.svelte
  function get_each_context(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[14] = list[i];
    child_ctx[16] = i;
    return child_ctx;
  }
  function get_each_context_1(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[14] = list[i];
    child_ctx[16] = i;
    return child_ctx;
  }
  function create_if_block2(ctx) {
    let text_1;
    let t0_value = Math.floor(
      /*x*/
      ctx[1] / /*r*/
      ctx[5]
    ) + "";
    let t0;
    let t1;
    let t2_value = Math.floor(
      /*y*/
      ctx[2] / /*r*/
      ctx[5]
    ) + "";
    let t2;
    let t3;
    let t4_value = Math.floor(
      /*w*/
      ctx[3] / /*r*/
      ctx[5]
    ) + "";
    let t4;
    let t5;
    let t6_value = Math.floor(
      /*h*/
      ctx[4] / /*r*/
      ctx[5]
    ) + "";
    let t6;
    let text_1_x_value;
    let text_1_y_value;
    return {
      c() {
        text_1 = svg_element("text");
        t0 = text(t0_value);
        t1 = text(",");
        t2 = text(t2_value);
        t3 = text(" : ");
        t4 = text(t4_value);
        t5 = text(",");
        t6 = text(t6_value);
        attr(text_1, "x", text_1_x_value = /*x*/
        ctx[1] + 30);
        attr(text_1, "y", text_1_y_value = /*y*/
        ctx[2] - 10);
        attr(text_1, "class", "pointerpos svelte-6vgw58");
      },
      m(target, anchor) {
        insert(target, text_1, anchor);
        append(text_1, t0);
        append(text_1, t1);
        append(text_1, t2);
        append(text_1, t3);
        append(text_1, t4);
        append(text_1, t5);
        append(text_1, t6);
      },
      p(ctx2, dirty2) {
        if (dirty2 & /*x, r*/
        34 && t0_value !== (t0_value = Math.floor(
          /*x*/
          ctx2[1] / /*r*/
          ctx2[5]
        ) + ""))
          set_data(t0, t0_value);
        if (dirty2 & /*y, r*/
        36 && t2_value !== (t2_value = Math.floor(
          /*y*/
          ctx2[2] / /*r*/
          ctx2[5]
        ) + ""))
          set_data(t2, t2_value);
        if (dirty2 & /*w, r*/
        40 && t4_value !== (t4_value = Math.floor(
          /*w*/
          ctx2[3] / /*r*/
          ctx2[5]
        ) + ""))
          set_data(t4, t4_value);
        if (dirty2 & /*h, r*/
        48 && t6_value !== (t6_value = Math.floor(
          /*h*/
          ctx2[4] / /*r*/
          ctx2[5]
        ) + ""))
          set_data(t6, t6_value);
        if (dirty2 & /*x*/
        2 && text_1_x_value !== (text_1_x_value = /*x*/
        ctx2[1] + 30)) {
          attr(text_1, "x", text_1_x_value);
        }
        if (dirty2 & /*y*/
        4 && text_1_y_value !== (text_1_y_value = /*y*/
        ctx2[2] - 10)) {
          attr(text_1, "y", text_1_y_value);
        }
      },
      d(detaching) {
        if (detaching)
          detach(text_1);
      }
    };
  }
  function create_each_block_1(ctx) {
    let rect;
    let rect_x_value;
    let rect_width_value;
    let rect_class_value;
    return {
      c() {
        rect = svg_element("rect");
        attr(rect, "x", rect_x_value = /*x*/
        ctx[1] + /*idx*/
        ctx[16] * /*w*/
        (ctx[3] / /*verticalstrip*/
        ctx[7]));
        attr(
          rect,
          "y",
          /*y*/
          ctx[2]
        );
        attr(rect, "width", rect_width_value = /*w*/
        ctx[3] / /*verticalstrip*/
        ctx[7]);
        attr(
          rect,
          "height",
          /*h*/
          ctx[4]
        );
        attr(rect, "class", rect_class_value = null_to_empty("vstrip" + /*idx*/
        ctx[16] % 2) + " svelte-6vgw58");
      },
      m(target, anchor) {
        insert(target, rect, anchor);
      },
      p(ctx2, dirty2) {
        if (dirty2 & /*x, w, verticalstrip*/
        138 && rect_x_value !== (rect_x_value = /*x*/
        ctx2[1] + /*idx*/
        ctx2[16] * /*w*/
        (ctx2[3] / /*verticalstrip*/
        ctx2[7]))) {
          attr(rect, "x", rect_x_value);
        }
        if (dirty2 & /*y*/
        4) {
          attr(
            rect,
            "y",
            /*y*/
            ctx2[2]
          );
        }
        if (dirty2 & /*w, verticalstrip*/
        136 && rect_width_value !== (rect_width_value = /*w*/
        ctx2[3] / /*verticalstrip*/
        ctx2[7])) {
          attr(rect, "width", rect_width_value);
        }
        if (dirty2 & /*h*/
        16) {
          attr(
            rect,
            "height",
            /*h*/
            ctx2[4]
          );
        }
      },
      d(detaching) {
        if (detaching)
          detach(rect);
      }
    };
  }
  function create_each_block(ctx) {
    let line;
    let line_y__value;
    let line_x__value;
    let line_y__value_1;
    return {
      c() {
        line = svg_element("line");
        attr(
          line,
          "x1",
          /*x*/
          ctx[1]
        );
        attr(line, "y1", line_y__value = /*y*/
        ctx[2] + /*idx*/
        (ctx[16] + 1) * /*h*/
        (ctx[4] / /*horizontalstrip*/
        ctx[8]));
        attr(line, "x2", line_x__value = /*x*/
        ctx[1] + /*w*/
        ctx[3]);
        attr(line, "y2", line_y__value_1 = /*y*/
        ctx[2] + /*idx*/
        (ctx[16] + 1) * /*h*/
        (ctx[4] / /*horizontalstrip*/
        ctx[8]));
        attr(line, "class", "hstrip svelte-6vgw58");
      },
      m(target, anchor) {
        insert(target, line, anchor);
      },
      p(ctx2, dirty2) {
        if (dirty2 & /*x*/
        2) {
          attr(
            line,
            "x1",
            /*x*/
            ctx2[1]
          );
        }
        if (dirty2 & /*y, h, horizontalstrip*/
        276 && line_y__value !== (line_y__value = /*y*/
        ctx2[2] + /*idx*/
        (ctx2[16] + 1) * /*h*/
        (ctx2[4] / /*horizontalstrip*/
        ctx2[8]))) {
          attr(line, "y1", line_y__value);
        }
        if (dirty2 & /*x, w*/
        10 && line_x__value !== (line_x__value = /*x*/
        ctx2[1] + /*w*/
        ctx2[3])) {
          attr(line, "x2", line_x__value);
        }
        if (dirty2 & /*y, h, horizontalstrip*/
        276 && line_y__value_1 !== (line_y__value_1 = /*y*/
        ctx2[2] + /*idx*/
        (ctx2[16] + 1) * /*h*/
        (ctx2[4] / /*horizontalstrip*/
        ctx2[8]))) {
          attr(line, "y2", line_y__value_1);
        }
      },
      d(detaching) {
        if (detaching)
          detach(line);
      }
    };
  }
  function create_fragment3(ctx) {
    let g;
    let text_1;
    let t;
    let if_block_anchor;
    let each0_anchor;
    let rect0;
    let rect1;
    let rect2;
    let rect2_x_value;
    let rect3;
    let rect4;
    let rect4_y_value;
    let mounted;
    let dispose;
    let if_block = (
      /*expanding*/
      ctx[0] && create_if_block2(ctx)
    );
    let each_value_1 = new Array(
      /*verticalstrip*/
      ctx[7]
    );
    let each_blocks_1 = [];
    for (let i = 0; i < each_value_1.length; i += 1) {
      each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    }
    let each_value = new Array(
      /*horizontalstrip*/
      ctx[8] - 1
    );
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    }
    return {
      c() {
        g = svg_element("g");
        text_1 = svg_element("text");
        t = text(
          /*caption*/
          ctx[6]
        );
        if (if_block)
          if_block.c();
        if_block_anchor = empty();
        for (let i = 0; i < each_blocks_1.length; i += 1) {
          each_blocks_1[i].c();
        }
        each0_anchor = empty();
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        rect0 = svg_element("rect");
        rect1 = svg_element("rect");
        rect2 = svg_element("rect");
        rect3 = svg_element("rect");
        rect4 = svg_element("rect");
        attr(
          text_1,
          "x",
          /*x*/
          ctx[1]
        );
        attr(
          text_1,
          "y",
          /*y*/
          ctx[2]
        );
        attr(text_1, "class", "caption svelte-6vgw58");
        attr(
          rect0,
          "x",
          /*x*/
          ctx[1]
        );
        attr(
          rect0,
          "y",
          /*y*/
          ctx[2]
        );
        attr(
          rect0,
          "width",
          /*w*/
          ctx[3]
        );
        attr(
          rect0,
          "height",
          /*h*/
          ctx[4]
        );
        attr(rect0, "class", "step svelte-6vgw58");
        toggle_class(
          rect0,
          "active",
          /*expanding*/
          ctx[0] == "middle"
        );
        attr(
          rect1,
          "x",
          /*x*/
          ctx[1]
        );
        attr(
          rect1,
          "y",
          /*y*/
          ctx[2]
        );
        attr(rect1, "width", grabberWidth);
        attr(
          rect1,
          "height",
          /*h*/
          ctx[4]
        );
        attr(rect1, "class", "grip svelte-6vgw58");
        toggle_class(
          rect1,
          "active",
          /*expanding*/
          ctx[0] == "left"
        );
        attr(rect2, "x", rect2_x_value = /*x*/
        ctx[1] + /*w*/
        ctx[3] - grabberWidth);
        attr(
          rect2,
          "y",
          /*y*/
          ctx[2]
        );
        attr(rect2, "width", grabberWidth);
        attr(
          rect2,
          "height",
          /*h*/
          ctx[4]
        );
        attr(rect2, "class", "gripx svelte-6vgw58");
        toggle_class(
          rect2,
          "active",
          /*expanding*/
          ctx[0] == "right"
        );
        attr(
          rect3,
          "x",
          /*x*/
          ctx[1]
        );
        attr(
          rect3,
          "y",
          /*y*/
          ctx[2]
        );
        attr(
          rect3,
          "width",
          /*w*/
          ctx[3]
        );
        attr(rect3, "height", grabberHeight);
        attr(rect3, "class", "grip svelte-6vgw58");
        toggle_class(
          rect3,
          "active",
          /*expanding*/
          ctx[0] == "top"
        );
        attr(
          rect4,
          "x",
          /*x*/
          ctx[1]
        );
        attr(rect4, "y", rect4_y_value = /*y*/
        ctx[2] + /*h*/
        ctx[4] - grabberHeight);
        attr(
          rect4,
          "width",
          /*w*/
          ctx[3]
        );
        attr(rect4, "height", grabberHeight);
        attr(rect4, "class", "gripy svelte-6vgw58");
        toggle_class(
          rect4,
          "active",
          /*expanding*/
          ctx[0] == "bottom"
        );
      },
      m(target, anchor) {
        insert(target, g, anchor);
        append(g, text_1);
        append(text_1, t);
        if (if_block)
          if_block.m(g, null);
        append(g, if_block_anchor);
        for (let i = 0; i < each_blocks_1.length; i += 1) {
          if (each_blocks_1[i]) {
            each_blocks_1[i].m(g, null);
          }
        }
        append(g, each0_anchor);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(g, null);
          }
        }
        append(g, rect0);
        append(g, rect1);
        append(g, rect2);
        append(g, rect3);
        append(g, rect4);
        if (!mounted) {
          dispose = [
            listen(rect0, "mousedown", function() {
              if (is_function(
                /*startExpand*/
                ctx[10].bind(
                  this,
                  "middle",
                  /*nframe*/
                  ctx[9]
                )
              ))
                ctx[10].bind(
                  this,
                  "middle",
                  /*nframe*/
                  ctx[9]
                ).apply(this, arguments);
            }),
            listen(rect1, "mousedown", function() {
              if (is_function(
                /*startExpand*/
                ctx[10].bind(
                  this,
                  "left",
                  /*nframe*/
                  ctx[9]
                )
              ))
                ctx[10].bind(
                  this,
                  "left",
                  /*nframe*/
                  ctx[9]
                ).apply(this, arguments);
            }),
            listen(rect2, "mousedown", function() {
              if (is_function(
                /*startExpand*/
                ctx[10].bind(
                  this,
                  "right",
                  /*nframe*/
                  ctx[9]
                )
              ))
                ctx[10].bind(
                  this,
                  "right",
                  /*nframe*/
                  ctx[9]
                ).apply(this, arguments);
            }),
            listen(rect3, "mousedown", function() {
              if (is_function(
                /*startExpand*/
                ctx[10].bind(
                  this,
                  "top",
                  /*nframe*/
                  ctx[9]
                )
              ))
                ctx[10].bind(
                  this,
                  "top",
                  /*nframe*/
                  ctx[9]
                ).apply(this, arguments);
            }),
            listen(rect4, "mousedown", function() {
              if (is_function(
                /*startExpand*/
                ctx[10].bind(
                  this,
                  "bottom",
                  /*nframe*/
                  ctx[9]
                )
              ))
                ctx[10].bind(
                  this,
                  "bottom",
                  /*nframe*/
                  ctx[9]
                ).apply(this, arguments);
            })
          ];
          mounted = true;
        }
      },
      p(new_ctx, [dirty2]) {
        ctx = new_ctx;
        if (dirty2 & /*caption*/
        64)
          set_data(
            t,
            /*caption*/
            ctx[6]
          );
        if (dirty2 & /*x*/
        2) {
          attr(
            text_1,
            "x",
            /*x*/
            ctx[1]
          );
        }
        if (dirty2 & /*y*/
        4) {
          attr(
            text_1,
            "y",
            /*y*/
            ctx[2]
          );
        }
        if (
          /*expanding*/
          ctx[0]
        ) {
          if (if_block) {
            if_block.p(ctx, dirty2);
          } else {
            if_block = create_if_block2(ctx);
            if_block.c();
            if_block.m(g, if_block_anchor);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
        if (dirty2 & /*x, w, verticalstrip, y, h*/
        158) {
          each_value_1 = new Array(
            /*verticalstrip*/
            ctx[7]
          );
          let i;
          for (i = 0; i < each_value_1.length; i += 1) {
            const child_ctx = get_each_context_1(ctx, each_value_1, i);
            if (each_blocks_1[i]) {
              each_blocks_1[i].p(child_ctx, dirty2);
            } else {
              each_blocks_1[i] = create_each_block_1(child_ctx);
              each_blocks_1[i].c();
              each_blocks_1[i].m(g, each0_anchor);
            }
          }
          for (; i < each_blocks_1.length; i += 1) {
            each_blocks_1[i].d(1);
          }
          each_blocks_1.length = each_value_1.length;
        }
        if (dirty2 & /*x, y, h, horizontalstrip, w*/
        286) {
          each_value = new Array(
            /*horizontalstrip*/
            ctx[8] - 1
          );
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context(ctx, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty2);
            } else {
              each_blocks[i] = create_each_block(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(g, rect0);
            }
          }
          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }
          each_blocks.length = each_value.length;
        }
        if (dirty2 & /*x*/
        2) {
          attr(
            rect0,
            "x",
            /*x*/
            ctx[1]
          );
        }
        if (dirty2 & /*y*/
        4) {
          attr(
            rect0,
            "y",
            /*y*/
            ctx[2]
          );
        }
        if (dirty2 & /*w*/
        8) {
          attr(
            rect0,
            "width",
            /*w*/
            ctx[3]
          );
        }
        if (dirty2 & /*h*/
        16) {
          attr(
            rect0,
            "height",
            /*h*/
            ctx[4]
          );
        }
        if (dirty2 & /*expanding*/
        1) {
          toggle_class(
            rect0,
            "active",
            /*expanding*/
            ctx[0] == "middle"
          );
        }
        if (dirty2 & /*x*/
        2) {
          attr(
            rect1,
            "x",
            /*x*/
            ctx[1]
          );
        }
        if (dirty2 & /*y*/
        4) {
          attr(
            rect1,
            "y",
            /*y*/
            ctx[2]
          );
        }
        if (dirty2 & /*h*/
        16) {
          attr(
            rect1,
            "height",
            /*h*/
            ctx[4]
          );
        }
        if (dirty2 & /*expanding*/
        1) {
          toggle_class(
            rect1,
            "active",
            /*expanding*/
            ctx[0] == "left"
          );
        }
        if (dirty2 & /*x, w*/
        10 && rect2_x_value !== (rect2_x_value = /*x*/
        ctx[1] + /*w*/
        ctx[3] - grabberWidth)) {
          attr(rect2, "x", rect2_x_value);
        }
        if (dirty2 & /*y*/
        4) {
          attr(
            rect2,
            "y",
            /*y*/
            ctx[2]
          );
        }
        if (dirty2 & /*h*/
        16) {
          attr(
            rect2,
            "height",
            /*h*/
            ctx[4]
          );
        }
        if (dirty2 & /*expanding*/
        1) {
          toggle_class(
            rect2,
            "active",
            /*expanding*/
            ctx[0] == "right"
          );
        }
        if (dirty2 & /*x*/
        2) {
          attr(
            rect3,
            "x",
            /*x*/
            ctx[1]
          );
        }
        if (dirty2 & /*y*/
        4) {
          attr(
            rect3,
            "y",
            /*y*/
            ctx[2]
          );
        }
        if (dirty2 & /*w*/
        8) {
          attr(
            rect3,
            "width",
            /*w*/
            ctx[3]
          );
        }
        if (dirty2 & /*expanding*/
        1) {
          toggle_class(
            rect3,
            "active",
            /*expanding*/
            ctx[0] == "top"
          );
        }
        if (dirty2 & /*x*/
        2) {
          attr(
            rect4,
            "x",
            /*x*/
            ctx[1]
          );
        }
        if (dirty2 & /*y, h*/
        20 && rect4_y_value !== (rect4_y_value = /*y*/
        ctx[2] + /*h*/
        ctx[4] - grabberHeight)) {
          attr(rect4, "y", rect4_y_value);
        }
        if (dirty2 & /*w*/
        8) {
          attr(
            rect4,
            "width",
            /*w*/
            ctx[3]
          );
        }
        if (dirty2 & /*expanding*/
        1) {
          toggle_class(
            rect4,
            "active",
            /*expanding*/
            ctx[0] == "bottom"
          );
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(g);
        if (if_block)
          if_block.d();
        destroy_each(each_blocks_1, detaching);
        destroy_each(each_blocks, detaching);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  var grabberWidth = 8;
  var grabberHeight = 8;
  function instance3($$self, $$props, $$invalidate) {
    let { expanding } = $$props;
    let { x = 0 } = $$props;
    let { y = 0 } = $$props;
    let { w = 50 } = $$props;
    let { h = 50 } = $$props;
    let { r } = $$props;
    let { caption = "" } = $$props;
    let { verticalstrip = 5 } = $$props;
    let { horizontalstrip = 17 } = $$props;
    let { nframe = 0 } = $$props;
    let { startExpand } = $$props;
    let startx, starty, initial;
    $$self.$$set = ($$props2) => {
      if ("expanding" in $$props2)
        $$invalidate(0, expanding = $$props2.expanding);
      if ("x" in $$props2)
        $$invalidate(1, x = $$props2.x);
      if ("y" in $$props2)
        $$invalidate(2, y = $$props2.y);
      if ("w" in $$props2)
        $$invalidate(3, w = $$props2.w);
      if ("h" in $$props2)
        $$invalidate(4, h = $$props2.h);
      if ("r" in $$props2)
        $$invalidate(5, r = $$props2.r);
      if ("caption" in $$props2)
        $$invalidate(6, caption = $$props2.caption);
      if ("verticalstrip" in $$props2)
        $$invalidate(7, verticalstrip = $$props2.verticalstrip);
      if ("horizontalstrip" in $$props2)
        $$invalidate(8, horizontalstrip = $$props2.horizontalstrip);
      if ("nframe" in $$props2)
        $$invalidate(9, nframe = $$props2.nframe);
      if ("startExpand" in $$props2)
        $$invalidate(10, startExpand = $$props2.startExpand);
    };
    return [
      expanding,
      x,
      y,
      w,
      h,
      r,
      caption,
      verticalstrip,
      horizontalstrip,
      nframe,
      startExpand
    ];
  }
  var Cropper = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance3, create_fragment3, safe_not_equal, {
        expanding: 0,
        x: 1,
        y: 2,
        w: 3,
        h: 4,
        r: 5,
        caption: 6,
        verticalstrip: 7,
        horizontalstrip: 8,
        nframe: 9,
        startExpand: 10
      });
    }
  };
  var cropper_default = Cropper;

  // src/croppers.svelte
  function get_each_context2(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[16] = list[i];
    child_ctx[18] = i;
    return child_ctx;
  }
  function create_each_block2(ctx) {
    let cropper;
    let updating_expanding;
    let current;
    function cropper_expanding_binding(value) {
      ctx[11](value);
    }
    let cropper_props = {
      x: (
        /*frame*/
        ctx[16][0]
      ),
      y: (
        /*frame*/
        ctx[16][1]
      ),
      w: (
        /*frame*/
        ctx[16][2]
      ),
      h: (
        /*frame*/
        ctx[16][3]
      ),
      verticalstrip: (
        /*verticalstrip*/
        ctx[4]
      ),
      horizontalstrip: (
        /*horizontalstrip*/
        ctx[5]
      ),
      r: (
        /*r*/
        ctx[6]
      ),
      nframe: (
        /*idx*/
        ctx[18]
      ),
      startExpand: (
        /*startExpand*/
        ctx[8]
      ),
      caption: (
        /*start*/
        ctx[3] + /*idx*/
        ctx[18]
      )
    };
    if (
      /*expanding*/
      ctx[7] !== void 0
    ) {
      cropper_props.expanding = /*expanding*/
      ctx[7];
    }
    cropper = new cropper_default({ props: cropper_props });
    binding_callbacks.push(() => bind(cropper, "expanding", cropper_expanding_binding));
    return {
      c() {
        create_component(cropper.$$.fragment);
      },
      m(target, anchor) {
        mount_component(cropper, target, anchor);
        current = true;
      },
      p(ctx2, dirty2) {
        const cropper_changes = {};
        if (dirty2 & /*frames*/
        1)
          cropper_changes.x = /*frame*/
          ctx2[16][0];
        if (dirty2 & /*frames*/
        1)
          cropper_changes.y = /*frame*/
          ctx2[16][1];
        if (dirty2 & /*frames*/
        1)
          cropper_changes.w = /*frame*/
          ctx2[16][2];
        if (dirty2 & /*frames*/
        1)
          cropper_changes.h = /*frame*/
          ctx2[16][3];
        if (dirty2 & /*verticalstrip*/
        16)
          cropper_changes.verticalstrip = /*verticalstrip*/
          ctx2[4];
        if (dirty2 & /*horizontalstrip*/
        32)
          cropper_changes.horizontalstrip = /*horizontalstrip*/
          ctx2[5];
        if (dirty2 & /*r*/
        64)
          cropper_changes.r = /*r*/
          ctx2[6];
        if (dirty2 & /*start*/
        8)
          cropper_changes.caption = /*start*/
          ctx2[3] + /*idx*/
          ctx2[18];
        if (!updating_expanding && dirty2 & /*expanding*/
        128) {
          updating_expanding = true;
          cropper_changes.expanding = /*expanding*/
          ctx2[7];
          add_flush_callback(() => updating_expanding = false);
        }
        cropper.$set(cropper_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(cropper.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(cropper.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(cropper, detaching);
      }
    };
  }
  function create_key_block(ctx) {
    let svg;
    let svg_viewBox_value;
    let current;
    let mounted;
    let dispose;
    let each_value = (
      /*frames*/
      ctx[0]
    );
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block2(get_each_context2(ctx, each_value, i));
    }
    const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
      each_blocks[i] = null;
    });
    return {
      c() {
        svg = svg_element("svg");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        attr(svg, "viewBox", svg_viewBox_value = "0 0 " + /*width*/
        ctx[2] + " " + /*height*/
        ctx[1]);
        attr(
          svg,
          "height",
          /*height*/
          ctx[1]
        );
        attr(
          svg,
          "width",
          /*width*/
          ctx[2]
        );
        attr(svg, "class", "svelte-4qb2td");
        toggle_class(
          svg,
          "expanding",
          /*expanding*/
          ctx[7]
        );
      },
      m(target, anchor) {
        insert(target, svg, anchor);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(svg, null);
          }
        }
        current = true;
        if (!mounted) {
          dispose = listen(
            svg,
            "mousemove",
            /*expand*/
            ctx[10]
          );
          mounted = true;
        }
      },
      p(ctx2, dirty2) {
        if (dirty2 & /*frames, verticalstrip, horizontalstrip, r, startExpand, start, expanding*/
        505) {
          each_value = /*frames*/
          ctx2[0];
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context2(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty2);
              transition_in(each_blocks[i], 1);
            } else {
              each_blocks[i] = create_each_block2(child_ctx);
              each_blocks[i].c();
              transition_in(each_blocks[i], 1);
              each_blocks[i].m(svg, null);
            }
          }
          group_outros();
          for (i = each_value.length; i < each_blocks.length; i += 1) {
            out(i);
          }
          check_outros();
        }
        if (!current || dirty2 & /*width, height*/
        6 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*width*/
        ctx2[2] + " " + /*height*/
        ctx2[1])) {
          attr(svg, "viewBox", svg_viewBox_value);
        }
        if (!current || dirty2 & /*height*/
        2) {
          attr(
            svg,
            "height",
            /*height*/
            ctx2[1]
          );
        }
        if (!current || dirty2 & /*width*/
        4) {
          attr(
            svg,
            "width",
            /*width*/
            ctx2[2]
          );
        }
        if (!current || dirty2 & /*expanding*/
        128) {
          toggle_class(
            svg,
            "expanding",
            /*expanding*/
            ctx2[7]
          );
        }
      },
      i(local) {
        if (current)
          return;
        for (let i = 0; i < each_value.length; i += 1) {
          transition_in(each_blocks[i]);
        }
        current = true;
      },
      o(local) {
        each_blocks = each_blocks.filter(Boolean);
        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(svg);
        destroy_each(each_blocks, detaching);
        mounted = false;
        dispose();
      }
    };
  }
  function create_fragment4(ctx) {
    let div;
    let previous_key = (
      /*frames*/
      ctx[0]
    );
    let current;
    let mounted;
    let dispose;
    let key_block = create_key_block(ctx);
    return {
      c() {
        div = element("div");
        key_block.c();
        set_style(div, "position", "absolute");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        key_block.m(div, null);
        current = true;
        if (!mounted) {
          dispose = listen(
            window,
            "mouseup",
            /*stopExpand*/
            ctx[9]
          );
          mounted = true;
        }
      },
      p(ctx2, [dirty2]) {
        if (dirty2 & /*frames*/
        1 && safe_not_equal(previous_key, previous_key = /*frames*/
        ctx2[0])) {
          group_outros();
          transition_out(key_block, 1, 1, noop);
          check_outros();
          key_block = create_key_block(ctx2);
          key_block.c();
          transition_in(key_block, 1);
          key_block.m(div, null);
        } else {
          key_block.p(ctx2, dirty2);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(key_block);
        current = true;
      },
      o(local) {
        transition_out(key_block);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div);
        key_block.d(detaching);
        mounted = false;
        dispose();
      }
    };
  }
  function instance4($$self, $$props, $$invalidate) {
    let { frames: frames2 = [] } = $$props;
    let { height = 400 } = $$props;
    let { width = 400 } = $$props;
    let { start = "" } = $$props;
    let { verticalstrip = 5 } = $$props;
    let { horizontalstrip = 17 } = $$props;
    let { r = 1 } = $$props;
    let expanding = null;
    let startx, starty, initial = {}, nframe = 0;
    function startExpand(type, _nframe, event) {
      nframe = _nframe;
      $$invalidate(7, expanding = type);
      startx = event.pageX;
      starty = event.pageY;
      const [x, y, w, h] = frames2[nframe];
      initial = { x, y, w, h };
    }
    function stopExpand() {
      $$invalidate(7, expanding = null);
      startx = 0, starty = 0;
    }
    function expand(event) {
      if (!expanding)
        return;
      let [x, y, w, h] = frames2[nframe];
      if (expanding == "left") {
        const delta = startx - event.pageX;
        x = initial.x - delta;
      } else if (expanding == "right") {
        const delta = event.pageX - startx;
        w = initial.w + delta;
      } else if (expanding == "top") {
        const delta = starty - event.pageY;
        y = initial.y - delta;
      } else if (expanding == "bottom") {
        const delta = event.pageY - starty;
        h = initial.h + delta;
      } else if (expanding == "middle") {
        const deltax = event.pageX - startx;
        const deltay = event.pageY - starty;
        x = initial.x + deltax;
        y = initial.y + deltay;
      }
      $$invalidate(0, frames2[nframe] = [x, y, w, h], frames2);
      $$invalidate(0, frames2);
    }
    function cropper_expanding_binding(value) {
      expanding = value;
      $$invalidate(7, expanding);
    }
    $$self.$$set = ($$props2) => {
      if ("frames" in $$props2)
        $$invalidate(0, frames2 = $$props2.frames);
      if ("height" in $$props2)
        $$invalidate(1, height = $$props2.height);
      if ("width" in $$props2)
        $$invalidate(2, width = $$props2.width);
      if ("start" in $$props2)
        $$invalidate(3, start = $$props2.start);
      if ("verticalstrip" in $$props2)
        $$invalidate(4, verticalstrip = $$props2.verticalstrip);
      if ("horizontalstrip" in $$props2)
        $$invalidate(5, horizontalstrip = $$props2.horizontalstrip);
      if ("r" in $$props2)
        $$invalidate(6, r = $$props2.r);
    };
    return [
      frames2,
      height,
      width,
      start,
      verticalstrip,
      horizontalstrip,
      r,
      expanding,
      startExpand,
      stopExpand,
      expand,
      cropper_expanding_binding
    ];
  }
  var Croppers = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance4, create_fragment4, safe_not_equal, {
        frames: 0,
        height: 1,
        width: 2,
        start: 3,
        verticalstrip: 4,
        horizontalstrip: 5,
        r: 6
      });
    }
  };
  var croppers_default = Croppers;

  // src/imageviewer.svelte
  function create_fragment5(ctx) {
    let div;
    let croppers;
    let t;
    let img;
    let img_src_value;
    let current;
    croppers = new croppers_default({
      props: {
        frames: (
          /*$frames*/
          ctx[4]
        ),
        height: (
          /*height*/
          ctx[2]
        ),
        width: (
          /*width*/
          ctx[3]
        ),
        r: (
          /*r*/
          ctx[1]
        ),
        start: 1
      }
    });
    return {
      c() {
        div = element("div");
        create_component(croppers.$$.fragment);
        t = space();
        img = element("img");
        attr(div, "class", "croppers svelte-12dqgwg");
        attr(img, "id", "image1");
        if (!src_url_equal(img.src, img_src_value = /*imageurl*/
        ctx[0]))
          attr(img, "src", img_src_value);
        attr(img, "class", "image svelte-12dqgwg");
        attr(img, "alt", "noimage");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        mount_component(croppers, div, null);
        insert(target, t, anchor);
        insert(target, img, anchor);
        current = true;
      },
      p(ctx2, [dirty2]) {
        const croppers_changes = {};
        if (dirty2 & /*$frames*/
        16)
          croppers_changes.frames = /*$frames*/
          ctx2[4];
        if (dirty2 & /*height*/
        4)
          croppers_changes.height = /*height*/
          ctx2[2];
        if (dirty2 & /*width*/
        8)
          croppers_changes.width = /*width*/
          ctx2[3];
        if (dirty2 & /*r*/
        2)
          croppers_changes.r = /*r*/
          ctx2[1];
        croppers.$set(croppers_changes);
        if (!current || dirty2 & /*imageurl*/
        1 && !src_url_equal(img.src, img_src_value = /*imageurl*/
        ctx2[0])) {
          attr(img, "src", img_src_value);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(croppers.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(croppers.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div);
        destroy_component(croppers);
        if (detaching)
          detach(t);
        if (detaching)
          detach(img);
      }
    };
  }
  function instance5($$self, $$props, $$invalidate) {
    let $nimage;
    let $images;
    let $frames;
    component_subscribe($$self, nimage, ($$value) => $$invalidate(5, $nimage = $$value));
    component_subscribe($$self, images, ($$value) => $$invalidate(6, $images = $$value));
    component_subscribe($$self, frames, ($$value) => $$invalidate(4, $frames = $$value));
    let target;
    let imageurl = "", r = 1, height = 100, width = 100;
    async function getImageURL() {
      if (!$images?.length)
        return;
      const imagefile = await $images[$nimage].entry.getFile();
      $$invalidate(0, imageurl = URL.createObjectURL(imagefile));
      setTimeout(
        () => {
          const naturalWidth = document.getElementById("image1").naturalWidth;
          $$invalidate(2, height = document.getElementById("image1").height);
          $$invalidate(3, width = document.getElementById("image1").width);
          $$invalidate(1, r = width / naturalWidth);
          ratio.set(r);
          const frms = ($images[$nimage].frames || [defaultframe(0), defaultframe(1), defaultframe(2)]).map((f) => resizeframe(f, r));
          console.log(frms);
          frames.set(frms);
        },
        50
      );
    }
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*$images, $nimage*/
      96) {
        $:
          getImageURL($images, $nimage);
      }
    };
    $:
      $$invalidate(2, height = document.getElementById("image1")?.height);
    $:
      $$invalidate(3, width = document.getElementById("image1")?.width);
    return [imageurl, r, height, width, $frames, $nimage, $images];
  }
  var Imageviewer = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance5, create_fragment5, safe_not_equal, {});
    }
  };
  var imageviewer_default = Imageviewer;

  // src/filelist.svelte
  function get_each_context3(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[3] = list[i];
    child_ctx[5] = i;
    return child_ctx;
  }
  function create_each_block3(ctx) {
    let div;
    let span0;
    let t0_value = (
      /*image*/
      ctx[3].name + ""
    );
    let t0;
    let t1;
    let span1;
    let t2_value = (
      /*image*/
      (ctx[3].frames?.length || "") + ""
    );
    let t2;
    let mounted;
    let dispose;
    function click_handler() {
      return (
        /*click_handler*/
        ctx[2](
          /*idx*/
          ctx[5]
        )
      );
    }
    return {
      c() {
        div = element("div");
        span0 = element("span");
        t0 = text(t0_value);
        t1 = space();
        span1 = element("span");
        t2 = text(t2_value);
        attr(span0, "class", "svelte-2pgw5y");
        toggle_class(
          span0,
          "done",
          /*image*/
          ctx[3].frames
        );
        attr(div, "class", "svelte-2pgw5y");
        toggle_class(
          div,
          "selected",
          /*idx*/
          ctx[5] == /*$nimage*/
          ctx[0]
        );
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, span0);
        append(span0, t0);
        append(div, t1);
        append(div, span1);
        append(span1, t2);
        if (!mounted) {
          dispose = listen(div, "click", click_handler);
          mounted = true;
        }
      },
      p(new_ctx, dirty2) {
        ctx = new_ctx;
        if (dirty2 & /*$images*/
        2 && t0_value !== (t0_value = /*image*/
        ctx[3].name + ""))
          set_data(t0, t0_value);
        if (dirty2 & /*$images*/
        2) {
          toggle_class(
            span0,
            "done",
            /*image*/
            ctx[3].frames
          );
        }
        if (dirty2 & /*$images*/
        2 && t2_value !== (t2_value = /*image*/
        (ctx[3].frames?.length || "") + ""))
          set_data(t2, t2_value);
        if (dirty2 & /*$nimage*/
        1) {
          toggle_class(
            div,
            "selected",
            /*idx*/
            ctx[5] == /*$nimage*/
            ctx[0]
          );
        }
      },
      d(detaching) {
        if (detaching)
          detach(div);
        mounted = false;
        dispose();
      }
    };
  }
  function create_key_block2(ctx) {
    let each_1_anchor;
    let each_value = (
      /*$images*/
      ctx[1]
    );
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block3(get_each_context3(ctx, each_value, i));
    }
    return {
      c() {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        each_1_anchor = empty();
      },
      m(target, anchor) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(target, anchor);
          }
        }
        insert(target, each_1_anchor, anchor);
      },
      p(ctx2, dirty2) {
        if (dirty2 & /*$nimage, selectimage, $images*/
        3) {
          each_value = /*$images*/
          ctx2[1];
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context3(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty2);
            } else {
              each_blocks[i] = create_each_block3(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
            }
          }
          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }
          each_blocks.length = each_value.length;
        }
      },
      d(detaching) {
        destroy_each(each_blocks, detaching);
        if (detaching)
          detach(each_1_anchor);
      }
    };
  }
  function create_fragment6(ctx) {
    let div;
    let previous_key = (
      /*$nimage*/
      ctx[0]
    );
    let key_block = create_key_block2(ctx);
    return {
      c() {
        div = element("div");
        key_block.c();
        attr(div, "class", "filelist svelte-2pgw5y");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        key_block.m(div, null);
      },
      p(ctx2, [dirty2]) {
        if (dirty2 & /*$nimage*/
        1 && safe_not_equal(previous_key, previous_key = /*$nimage*/
        ctx2[0])) {
          key_block.d(1);
          key_block = create_key_block2(ctx2);
          key_block.c();
          key_block.m(div, null);
        } else {
          key_block.p(ctx2, dirty2);
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(div);
        key_block.d(detaching);
      }
    };
  }
  function instance6($$self, $$props, $$invalidate) {
    let $nimage;
    let $images;
    component_subscribe($$self, nimage, ($$value) => $$invalidate(0, $nimage = $$value));
    component_subscribe($$self, images, ($$value) => $$invalidate(1, $images = $$value));
    const click_handler = (idx) => selectimage(idx);
    return [$nimage, $images, click_handler];
  }
  var Filelist = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance6, create_fragment6, safe_not_equal, {});
    }
  };
  var filelist_default = Filelist;

  // src/app.svelte
  function create_fragment7(ctx) {
    let table;
    let tr;
    let td0;
    let toolbar;
    let updating_imageurl;
    let t0;
    let filelist;
    let t1;
    let td1;
    let imageviewer;
    let current;
    function toolbar_imageurl_binding(value) {
      ctx[1](value);
    }
    let toolbar_props = {};
    if (
      /*imageurl*/
      ctx[0] !== void 0
    ) {
      toolbar_props.imageurl = /*imageurl*/
      ctx[0];
    }
    toolbar = new toolbar_default({ props: toolbar_props });
    binding_callbacks.push(() => bind(toolbar, "imageurl", toolbar_imageurl_binding));
    filelist = new filelist_default({});
    imageviewer = new imageviewer_default({ props: { imageurl: (
      /*imageurl*/
      ctx[0]
    ) } });
    return {
      c() {
        table = element("table");
        tr = element("tr");
        td0 = element("td");
        create_component(toolbar.$$.fragment);
        t0 = space();
        create_component(filelist.$$.fragment);
        t1 = space();
        td1 = element("td");
        create_component(imageviewer.$$.fragment);
        attr(td0, "class", "FileList svelte-1ssg1eu");
        attr(td1, "class", "ImageViewer svelte-1ssg1eu");
      },
      m(target, anchor) {
        insert(target, table, anchor);
        append(table, tr);
        append(tr, td0);
        mount_component(toolbar, td0, null);
        append(td0, t0);
        mount_component(filelist, td0, null);
        append(tr, t1);
        append(tr, td1);
        mount_component(imageviewer, td1, null);
        current = true;
      },
      p(ctx2, [dirty2]) {
        const toolbar_changes = {};
        if (!updating_imageurl && dirty2 & /*imageurl*/
        1) {
          updating_imageurl = true;
          toolbar_changes.imageurl = /*imageurl*/
          ctx2[0];
          add_flush_callback(() => updating_imageurl = false);
        }
        toolbar.$set(toolbar_changes);
        const imageviewer_changes = {};
        if (dirty2 & /*imageurl*/
        1)
          imageviewer_changes.imageurl = /*imageurl*/
          ctx2[0];
        imageviewer.$set(imageviewer_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(toolbar.$$.fragment, local);
        transition_in(filelist.$$.fragment, local);
        transition_in(imageviewer.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(toolbar.$$.fragment, local);
        transition_out(filelist.$$.fragment, local);
        transition_out(imageviewer.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(table);
        destroy_component(toolbar);
        destroy_component(filelist);
        destroy_component(imageviewer);
      }
    };
  }
  function instance7($$self, $$props, $$invalidate) {
    let imageurl = "";
    function toolbar_imageurl_binding(value) {
      imageurl = value;
      $$invalidate(0, imageurl);
    }
    return [imageurl, toolbar_imageurl_binding];
  }
  var App = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance7, create_fragment7, safe_not_equal, {});
    }
  };
  var app_default = App;

  // src/index.ts
  var app = new app_default({ target: document.body });
  document.querySelector("#bootmessage").innerHTML = "";
  var src_default = app;
})();
