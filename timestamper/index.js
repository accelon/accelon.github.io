(() => {
  // node_modules/svelte/internal/index.mjs
  function noop() {
  }
  function assign(tar, src) {
    for (const k in src)
      tar[k] = src[k];
    return tar;
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
  function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
      const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
      return definition[0](slot_ctx);
    }
  }
  function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
  }
  function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
      const lets = definition[2](fn(dirty));
      if ($$scope.dirty === void 0) {
        return lets;
      }
      if (typeof lets === "object") {
        const merged = [];
        const len = Math.max($$scope.dirty.length, lets.length);
        for (let i = 0; i < len; i += 1) {
          merged[i] = $$scope.dirty[i] | lets[i];
        }
        return merged;
      }
      return $$scope.dirty | lets;
    }
    return $$scope.dirty;
  }
  function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
    if (slot_changes) {
      const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
      slot.p(slot_context, slot_changes);
    }
  }
  function get_all_dirty_from_scope($$scope) {
    if ($$scope.ctx.length > 32) {
      const dirty = [];
      const length = $$scope.ctx.length / 32;
      for (let i = 0; i < length; i++) {
        dirty[i] = -1;
      }
      return dirty;
    }
    return -1;
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
  var crossorigin;
  function is_crossorigin() {
    if (crossorigin === void 0) {
      crossorigin = false;
      try {
        if (typeof window !== "undefined" && window.parent) {
          void window.parent.document;
        }
      } catch (error) {
        crossorigin = true;
      }
    }
    return crossorigin;
  }
  function add_iframe_resize_listener(node, fn) {
    const computed_style = getComputedStyle(node);
    if (computed_style.position === "static") {
      node.style.position = "relative";
    }
    const iframe = element("iframe");
    iframe.setAttribute("style", "display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;");
    iframe.setAttribute("aria-hidden", "true");
    iframe.tabIndex = -1;
    const crossorigin2 = is_crossorigin();
    let unsubscribe;
    if (crossorigin2) {
      iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}<\/script>";
      unsubscribe = listen(window, "message", (event) => {
        if (event.source === iframe.contentWindow)
          fn();
      });
    } else {
      iframe.src = "about:blank";
      iframe.onload = () => {
        unsubscribe = listen(iframe.contentWindow, "resize", fn);
        fn();
      };
    }
    append(node, iframe);
    return () => {
      if (crossorigin2) {
        unsubscribe();
      } else if (unsubscribe && iframe.contentWindow) {
        unsubscribe();
      }
      detach(iframe);
    };
  }
  function toggle_class(element2, name, toggle) {
    element2.classList[toggle ? "add" : "remove"](name);
  }
  function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
    const e = document.createEvent("CustomEvent");
    e.initCustomEvent(type, bubbles, cancelable, detail);
    return e;
  }
  var current_component;
  function set_current_component(component) {
    current_component = component;
  }
  function get_current_component() {
    if (!current_component)
      throw new Error("Function called outside component initialization");
    return current_component;
  }
  function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
  }
  function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
  }
  function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail, { cancelable = false } = {}) => {
      const callbacks = component.$$.callbacks[type];
      if (callbacks) {
        const event = custom_event(type, detail, { cancelable });
        callbacks.slice().forEach((fn) => {
          fn.call(component, event);
        });
        return !event.defaultPrevented;
      }
      return true;
    };
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
      const dirty = $$.dirty;
      $$.dirty = [-1];
      $$.fragment && $$.fragment.p($$.ctx, dirty);
      $$.after_update.forEach(add_render_callback);
    }
  }
  function flush_render_callbacks(fns) {
    const filtered = [];
    const targets = [];
    render_callbacks.forEach((c2) => fns.indexOf(c2) === -1 ? filtered.push(c2) : targets.push(c2));
    targets.forEach((c2) => c2());
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
  function get_spread_update(levels, updates) {
    const update2 = {};
    const to_null_out = {};
    const accounted_for = { $$scope: 1 };
    let i = levels.length;
    while (i--) {
      const o = levels[i];
      const n = updates[i];
      if (n) {
        for (const key in o) {
          if (!(key in n))
            to_null_out[key] = 1;
        }
        for (const key in n) {
          if (!accounted_for[key]) {
            update2[key] = n[key];
            accounted_for[key] = 1;
          }
        }
        levels[i] = n;
      } else {
        for (const key in o) {
          accounted_for[key] = 1;
        }
      }
    }
    for (const key in to_null_out) {
      if (!(key in update2))
        update2[key] = void 0;
    }
    return update2;
  }
  function get_spread_object(spread_props) {
    return typeof spread_props === "object" && spread_props !== null ? spread_props : {};
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
  function init(component, options, instance10, create_fragment10, not_equal, props, append_styles, dirty = [-1]) {
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
      dirty,
      skip_bound: false,
      root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance10 ? instance10(component, options.props || {}, (i, ret, ...rest) => {
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
    $$.fragment = create_fragment10 ? create_fragment10($$.ctx) : false;
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

  // src/savestore.js
  var loadSettings = () => {
    return {};
  };
  var settings = loadSettings();

  // node_modules/svelte/store/index.mjs
  var subscriber_queue = [];
  function readable(value, start) {
    return {
      subscribe: writable(value, start).subscribe
    };
  }
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
  function derived(stores, fn, initial_value) {
    const single = !Array.isArray(stores);
    const stores_array = single ? [stores] : stores;
    const auto = fn.length < 2;
    return readable(initial_value, (set) => {
      let started = false;
      const values = [];
      let pending = 0;
      let cleanup = noop;
      const sync = () => {
        if (pending) {
          return;
        }
        cleanup();
        const result = fn(single ? values[0] : values, set);
        if (auto) {
          set(result);
        } else {
          cleanup = is_function(result) ? result : noop;
        }
      };
      const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
        values[i] = value;
        pending &= ~(1 << i);
        if (started) {
          sync();
        }
      }, () => {
        pending |= 1 << i;
      }));
      started = true;
      sync();
      return function stop() {
        run_all(unsubscribers);
        cleanup();
        started = false;
      };
    });
  }

  // src/store.js
  var thezip = writable(null);
  var theaudio = writable(null);
  var playing = writable(false);
  var images = writable([]);
  var maxpage = writable(1);
  var activefolioid = writable("");
  var activejuan = writable(0);
  var timestampcursor = writable(-1);
  var stampdelay = writable(0.5);
  var activepb = writable(0);
  var maxjuan = writable(1);
  var maxline = writable(1);
  var timestamps = writable([]);
  var host = document.location.host;
  var localhost = ~host.indexOf("127.0.0.1") || ~host.indexOf("localhost");
  var foliopath = writable(localhost ? "folio/" : "https://dharmacloud.github.io/swipegallery/folio/");
  var audiopath = writable(localhost ? "baudio/" : "https://nissaya.cn/baudio/");
  var FolioChars = 17;
  var paneWidth = (leftside) => {
    let style = "100vw";
    const w = window.innerHeight * 0.45;
    let r = (w * 100 / window.innerWidth).toFixed(2);
    if (!leftside)
      r = 100 - r;
    style = r + "vw";
    return style;
  };
  var activesutra = writable(0);
  var sutras = [
    { bkid: "agmd", caption: "\u9577\u963F\u542B\u7D93", juancount: 22, nanzang: [1, 3] },
    { bkid: "agmm", caption: "\u4E2D\u963F\u542B\u7D93", juancount: 60, nanzang: [43, 45, 47, 55, 56] },
    { bkid: "agms", caption: "\u96DC\u963F\u542B\u7D93", juancount: 50, nanzang: [21, 32, 33, 41] },
    { bkid: "agmu", caption: "\u589E\u4E00\u963F\u542B\u7D93", juancount: 50, nanzang: [31, 33, 34, 35, 36, 37, 38, 39] }
  ];
  var sutra = derived(activesutra, (s) => sutras[s]);
  var folioLines = derived(activejuan, (j) => ~sutras[get_store_value(activesutra)]?.nanzang?.indexOf(j) ? 6 : 5);
  var createTimestamps = (pbcount) => {
    const linecount = get_store_value(folioLines);
    const arr = [];
    for (let i = 0; i < pbcount; i++) {
      arr.push(new Array(linecount));
    }
    timestamps.set(arr);
  };
  var setTimestamp = (ts) => {
    const arr = get_store_value(timestamps);
    const cursor = get_store_value(timestampcursor);
    const o = arr[get_store_value(activepb)];
    if (o && cursor < o.length) {
      o[cursor] = ts;
    }
    timestamps.set(arr);
  };
  var seektrack = (t) => {
    get_store_value(theaudio).currentTime += t;
  };
  var settrack = (t) => {
    get_store_value(theaudio).currentTime = t;
  };

  // src/3rdparty/swipe.svelte
  function get_each_context(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[49] = list[i];
    child_ctx[51] = i;
    return child_ctx;
  }
  function create_if_block(ctx) {
    let div;
    let each_value = (
      /*indicators*/
      ctx[2]
    );
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    }
    return {
      c() {
        div = element("div");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        attr(div, "class", "swipe-indicator swipe-indicator-inside svelte-17g4ceu");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(div, null);
          }
        }
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*activeIndicator, changeItem, indicators*/
        38) {
          each_value = /*indicators*/
          ctx2[2];
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(div, null);
            }
          }
          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }
          each_blocks.length = each_value.length;
        }
      },
      d(detaching) {
        if (detaching)
          detach(div);
        destroy_each(each_blocks, detaching);
      }
    };
  }
  function create_each_block(ctx) {
    let span;
    let span_class_value;
    let mounted;
    let dispose;
    function click_handler() {
      return (
        /*click_handler*/
        ctx[22](
          /*i*/
          ctx[51]
        )
      );
    }
    return {
      c() {
        span = element("span");
        attr(span, "class", span_class_value = "dot " + /*activeIndicator*/
        (ctx[1] == /*i*/
        ctx[51] ? "is-active" : "") + " svelte-17g4ceu");
      },
      m(target, anchor) {
        insert(target, span, anchor);
        if (!mounted) {
          dispose = listen(span, "click", click_handler);
          mounted = true;
        }
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        if (dirty[0] & /*activeIndicator*/
        2 && span_class_value !== (span_class_value = "dot " + /*activeIndicator*/
        (ctx[1] == /*i*/
        ctx[51] ? "is-active" : "") + " svelte-17g4ceu")) {
          attr(span, "class", span_class_value);
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
    let div4;
    let div2;
    let div1;
    let div0;
    let t0;
    let div3;
    let t1;
    let current;
    let mounted;
    let dispose;
    const default_slot_template = (
      /*#slots*/
      ctx[20].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[19],
      null
    );
    let if_block = (
      /*showIndicators*/
      ctx[0] && create_if_block(ctx)
    );
    return {
      c() {
        div4 = element("div");
        div2 = element("div");
        div1 = element("div");
        div0 = element("div");
        if (default_slot)
          default_slot.c();
        t0 = space();
        div3 = element("div");
        t1 = space();
        if (if_block)
          if_block.c();
        attr(div0, "class", "swipeable-slot-wrapper svelte-17g4ceu");
        attr(div1, "class", "swipeable-total_elements svelte-17g4ceu");
        attr(div2, "class", "swipe-item-wrapper svelte-17g4ceu");
        attr(div3, "class", "swipe-handler svelte-17g4ceu");
        attr(div4, "class", "swipe-panel svelte-17g4ceu");
      },
      m(target, anchor) {
        insert(target, div4, anchor);
        append(div4, div2);
        append(div2, div1);
        append(div1, div0);
        if (default_slot) {
          default_slot.m(div0, null);
        }
        ctx[21](div2);
        append(div4, t0);
        append(div4, div3);
        append(div4, t1);
        if (if_block)
          if_block.m(div4, null);
        current = true;
        if (!mounted) {
          dispose = [
            listen(
              div3,
              "touchstart",
              /*onMoveStart*/
              ctx[4]
            ),
            listen(
              div3,
              "mousedown",
              /*onMoveStart*/
              ctx[4]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty[0] & /*$$scope*/
          524288)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[19],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[19]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[19],
                dirty,
                null
              ),
              null
            );
          }
        }
        if (
          /*showIndicators*/
          ctx2[0]
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
          } else {
            if_block = create_if_block(ctx2);
            if_block.c();
            if_block.m(div4, null);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div4);
        if (default_slot)
          default_slot.d(detaching);
        ctx[21](null);
        if (if_block)
          if_block.d();
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function instance($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    let { transitionDuration = 200 } = $$props;
    let { showIndicators = false } = $$props;
    let { autoplay = false } = $$props;
    let { delay = 1e3 } = $$props;
    let { defaultIndex = 0 } = $$props;
    let { active_item = 0 } = $$props;
    let { is_vertical = false } = $$props;
    let { allow_infinite_swipe = false } = $$props;
    let activeIndicator = 0, indicators, total_elements = 0, availableSpace = 0, availableMeasure = 0, swipeElements, availableDistance = 0, swipeItemsWrapper, swipeWrapper, pos_axis = 0, page_axis = is_vertical ? "pageY" : "pageX", axis, longTouch, last_axis_pos;
    let played;
    let run_interval = false;
    let fire = createEventDispatcher();
    let movingcount = 0;
    function init2() {
      swipeItemsWrapper = swipeWrapper.querySelector(".swipeable-slot-wrapper");
      swipeElements = swipeItemsWrapper.querySelectorAll(".swipeable-item");
      $$invalidate(17, total_elements = swipeElements.length);
      if (allow_infinite_swipe) {
        swipeItemsWrapper.prepend(swipeElements[total_elements - 1].cloneNode(true));
        swipeItemsWrapper.append(swipeElements[0].cloneNode(true));
        swipeElements = swipeItemsWrapper.querySelectorAll(".swipeable-item");
      }
      update2();
    }
    function update2() {
      let { offsetWidth, offsetHeight } = swipeWrapper.querySelector(".swipeable-total_elements");
      availableSpace = is_vertical ? offsetHeight : offsetWidth;
      setElementsPosition({
        init: true,
        elems: [...swipeElements],
        availableSpace,
        has_infinite_loop: allow_infinite_swipe
      });
      availableDistance = 0;
      availableMeasure = availableSpace * (total_elements - 1);
      if (defaultIndex) {
        changeItem(defaultIndex);
      }
    }
    function setElementsPosition({ elems = [], availableSpace: availableSpace2 = 0, pos_axis: pos_axis2 = 0, has_infinite_loop = false, distance = 0, moving = false, init: init3 = false, end = false, reset = false }) {
      elems.forEach((element2, i) => {
        let idx = has_infinite_loop ? i - 1 : i;
        if (init3) {
          element2.style.transform = generateTranslateValue(availableSpace2 * idx);
        }
        if (moving) {
          element2.style.cssText = generateTouchPosCss(availableSpace2 * idx - distance);
        }
        if (end) {
          element2.style.cssText = generateTouchPosCss(availableSpace2 * idx - pos_axis2, true);
        }
        if (reset) {
          element2.style.cssText = generateTouchPosCss(availableSpace2 * idx - pos_axis2);
        }
      });
    }
    function eventDelegate(type) {
      let delegationTypes = {
        add: "addEventListener",
        remove: "removeEventListener"
      };
      if (typeof window !== "undefined") {
        window[delegationTypes[type]]("mousemove", onMove);
        window[delegationTypes[type]]("mouseup", onEnd);
        window[delegationTypes[type]]("touchmove", onMove, { passive: false });
        window[delegationTypes[type]]("touchend", onEnd, { passive: false });
      }
    }
    function generateTranslateValue(value) {
      return is_vertical ? `translate3d(0, ${value}px, 0)` : `translate3d(${value}px, 0, 0)`;
    }
    function generateTouchPosCss(value, touch_end = false) {
      let transformString = generateTranslateValue(value);
      let _css = `
-webkit-transition-duration: ${touch_end ? transitionDuration : "0"}ms;
transition-duration: ${touch_end ? transitionDuration : "0"}ms;
-webkit-transform: ${transformString};
-ms-transform: ${transformString};`;
      return _css;
    }
    onMount(() => {
      init2();
      if (typeof window !== "undefined") {
        window.addEventListener("resize", update2);
      }
    });
    onDestroy(() => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", update2);
      }
    });
    let touch_active = false;
    function onMove(e) {
      if (touch_active) {
        movingcount++;
        e.stopImmediatePropagation();
        e.stopPropagation();
        let _axis = e.touches ? e.touches[0][page_axis] : e[page_axis], distance = axis - _axis + pos_axis;
        if (!allow_infinite_swipe) {
          if (pos_axis == 0 && axis < _axis || pos_axis == availableMeasure && axis > _axis) {
            return;
          }
        }
        e.preventDefault();
        if (distance <= availableMeasure && distance >= 0) {
        }
        setElementsPosition({
          moving: true,
          elems: [...swipeElements],
          availableSpace,
          distance,
          has_infinite_loop: allow_infinite_swipe
        });
        availableDistance = distance;
        last_axis_pos = _axis;
      }
    }
    let startx, starty;
    function onMoveStart(e) {
      fire("start");
      movingcount = 0;
      e.stopImmediatePropagation();
      e.stopPropagation();
      touch_active = true;
      longTouch = false;
      setTimeout(
        function() {
          longTouch = true;
        },
        250
      );
      axis = e.touches ? e.touches[0][page_axis] : e[page_axis];
      if (e.touches) {
        startx = e.touches[0].pageX;
        starty = e.touches[0].pageY;
      } else {
        startx = e.clientX;
        starty = e.clientY;
      }
      eventDelegate("add");
    }
    function onEnd(e) {
      if (e && e.cancelable) {
        e.preventDefault();
      }
      e && e.stopImmediatePropagation();
      e && e.stopPropagation();
      let direction = axis < last_axis_pos;
      touch_active = false;
      let _as = availableSpace;
      let accidental_touch = Math.round(availableSpace / 50) > Math.abs(axis - last_axis_pos);
      if (longTouch || accidental_touch) {
        availableDistance = Math.round(availableDistance / _as) * _as;
      } else {
        availableDistance = direction ? Math.floor(availableDistance / _as) * _as : Math.ceil(availableDistance / _as) * _as;
      }
      axis = null;
      last_axis_pos = null;
      pos_axis = availableDistance;
      $$invalidate(1, activeIndicator = availableDistance / _as);
      $$invalidate(7, active_item = activeIndicator);
      $$invalidate(6, defaultIndex = active_item);
      setElementsPosition({
        end: true,
        elems: [...swipeElements],
        availableSpace: _as,
        pos_axis,
        has_infinite_loop: allow_infinite_swipe
      });
      if (allow_infinite_swipe) {
        if (active_item === -1) {
          pos_axis = _as * (total_elements - 1);
        }
        if (active_item === total_elements) {
          pos_axis = 0;
        }
        $$invalidate(1, activeIndicator = pos_axis / _as);
        $$invalidate(7, active_item = activeIndicator);
        $$invalidate(6, defaultIndex = active_item);
        setTimeout(
          () => {
            setElementsPosition({
              reset: true,
              elems: [...swipeElements],
              availableSpace: _as,
              pos_axis,
              has_infinite_loop: allow_infinite_swipe
            });
          },
          transitionDuration
        );
      }
      eventDelegate("remove");
      let swipe_direction = direction ? "right" : "left";
      let x, y;
      if (e?.changedTouches) {
        x = e.changedTouches[0].pageX;
        y = e.changedTouches[0].pageY;
      } else {
        x = e?.clientX;
        y = e?.clientY;
      }
      if (Math.abs(startx - x) < 3 && Math.abs(starty - y) < 3 && movingcount < 3) {
        fire("click", { x, y });
      } else {
        setTimeout(
          () => {
            fire("change", {
              active_item,
              swipe_direction,
              active_element: swipeElements[active_item]
            });
          },
          transitionDuration
        );
      }
    }
    function changeItem(item) {
      let max = availableSpace;
      availableDistance = max * item;
      $$invalidate(1, activeIndicator = item);
      onEnd();
    }
    function changeView() {
      changeItem(played);
      played = played < total_elements - 1 + allow_infinite_swipe ? ++played : 0;
    }
    const mod = (n, m2) => (n % m2 + m2) % m2;
    function goTo(step) {
      let item = allow_infinite_swipe ? step : Math.max(0, Math.min(step, indicators.length - 1));
      changeItem(item);
    }
    function goLast() {
      goTo(total_elements - 1);
    }
    function prevItem() {
      let step = activeIndicator - 1;
      goTo(step);
    }
    function nextItem() {
      let step = activeIndicator + 1;
      goTo(step);
    }
    function div2_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        swipeWrapper = $$value;
        $$invalidate(3, swipeWrapper);
      });
    }
    const click_handler = (i) => {
      changeItem(i);
    };
    $$self.$$set = ($$props2) => {
      if ("transitionDuration" in $$props2)
        $$invalidate(8, transitionDuration = $$props2.transitionDuration);
      if ("showIndicators" in $$props2)
        $$invalidate(0, showIndicators = $$props2.showIndicators);
      if ("autoplay" in $$props2)
        $$invalidate(9, autoplay = $$props2.autoplay);
      if ("delay" in $$props2)
        $$invalidate(10, delay = $$props2.delay);
      if ("defaultIndex" in $$props2)
        $$invalidate(6, defaultIndex = $$props2.defaultIndex);
      if ("active_item" in $$props2)
        $$invalidate(7, active_item = $$props2.active_item);
      if ("is_vertical" in $$props2)
        $$invalidate(11, is_vertical = $$props2.is_vertical);
      if ("allow_infinite_swipe" in $$props2)
        $$invalidate(12, allow_infinite_swipe = $$props2.allow_infinite_swipe);
      if ("$$scope" in $$props2)
        $$invalidate(19, $$scope = $$props2.$$scope);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty[0] & /*total_elements*/
      131072) {
        $:
          $$invalidate(2, indicators = Array(total_elements));
      }
      if ($$self.$$.dirty[0] & /*autoplay, run_interval, defaultIndex, active_item, delay*/
      263872) {
        $: {
          if (autoplay && !run_interval) {
            played = defaultIndex || active_item;
            $$invalidate(18, run_interval = setInterval(changeView, delay));
          }
          if (!autoplay && run_interval) {
            clearInterval(run_interval);
            $$invalidate(18, run_interval = false);
          }
        }
      }
    };
    return [
      showIndicators,
      activeIndicator,
      indicators,
      swipeWrapper,
      onMoveStart,
      changeItem,
      defaultIndex,
      active_item,
      transitionDuration,
      autoplay,
      delay,
      is_vertical,
      allow_infinite_swipe,
      goTo,
      goLast,
      prevItem,
      nextItem,
      total_elements,
      run_interval,
      $$scope,
      slots,
      div2_binding,
      click_handler
    ];
  }
  var Swipe = class extends SvelteComponent {
    constructor(options) {
      super();
      init(
        this,
        options,
        instance,
        create_fragment,
        safe_not_equal,
        {
          transitionDuration: 8,
          showIndicators: 0,
          autoplay: 9,
          delay: 10,
          defaultIndex: 6,
          active_item: 7,
          is_vertical: 11,
          allow_infinite_swipe: 12,
          goTo: 13,
          goLast: 14,
          prevItem: 15,
          nextItem: 16
        },
        null,
        [-1, -1]
      );
    }
    get goTo() {
      return this.$$.ctx[13];
    }
    get goLast() {
      return this.$$.ctx[14];
    }
    get prevItem() {
      return this.$$.ctx[15];
    }
    get nextItem() {
      return this.$$.ctx[16];
    }
  };
  var swipe_default = Swipe;

  // src/3rdparty/swipeitem.svelte
  function create_fragment2(ctx) {
    let div1;
    let div0;
    let div1_class_value;
    let div1_resize_listener;
    let current;
    const default_slot_template = (
      /*#slots*/
      ctx[7].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[6],
      null
    );
    return {
      c() {
        div1 = element("div");
        div0 = element("div");
        if (default_slot)
          default_slot.c();
        attr(div0, "class", "swipeable-item-inner");
        attr(div1, "class", div1_class_value = "swipeable-item " + /*classes*/
        ctx[1] + " " + /*active*/
        (ctx[0] ? "is-active" : "") + " svelte-13ik1fy");
        attr(
          div1,
          "style",
          /*style*/
          ctx[2]
        );
        add_render_callback(() => (
          /*div1_elementresize_handler*/
          ctx[9].call(div1)
        ));
      },
      m(target, anchor) {
        insert(target, div1, anchor);
        append(div1, div0);
        if (default_slot) {
          default_slot.m(div0, null);
        }
        ctx[8](div0);
        div1_resize_listener = add_iframe_resize_listener(
          div1,
          /*div1_elementresize_handler*/
          ctx[9].bind(div1)
        );
        current = true;
      },
      p(ctx2, [dirty]) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          64)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[6],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[6]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[6],
                dirty,
                null
              ),
              null
            );
          }
        }
        if (!current || dirty & /*classes, active*/
        3 && div1_class_value !== (div1_class_value = "swipeable-item " + /*classes*/
        ctx2[1] + " " + /*active*/
        (ctx2[0] ? "is-active" : "") + " svelte-13ik1fy")) {
          attr(div1, "class", div1_class_value);
        }
        if (!current || dirty & /*style*/
        4) {
          attr(
            div1,
            "style",
            /*style*/
            ctx2[2]
          );
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div1);
        if (default_slot)
          default_slot.d(detaching);
        ctx[8](null);
        div1_resize_listener();
      }
    };
  }
  function instance2($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    let { active = false } = $$props;
    let { classes = "" } = $$props;
    let { style = "" } = $$props;
    let { allow_dynamic_height = false } = $$props;
    let swipeItemInner = null;
    let _height = 0;
    const fire = createEventDispatcher();
    function firehHeightChange() {
      if (swipeItemInner) {
        let { scrollHeight, clientHeight } = swipeItemInner;
        fire("swipe_item_height_change", {
          height: Math.max(scrollHeight, clientHeight)
        });
      }
    }
    onMount(() => {
      setTimeout(
        () => {
          allow_dynamic_height && requestAnimationFrame(firehHeightChange);
        },
        100
      );
    });
    function div0_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        swipeItemInner = $$value;
        $$invalidate(4, swipeItemInner);
      });
    }
    function div1_elementresize_handler() {
      _height = this.clientHeight;
      $$invalidate(3, _height);
    }
    $$self.$$set = ($$props2) => {
      if ("active" in $$props2)
        $$invalidate(0, active = $$props2.active);
      if ("classes" in $$props2)
        $$invalidate(1, classes = $$props2.classes);
      if ("style" in $$props2)
        $$invalidate(2, style = $$props2.style);
      if ("allow_dynamic_height" in $$props2)
        $$invalidate(5, allow_dynamic_height = $$props2.allow_dynamic_height);
      if ("$$scope" in $$props2)
        $$invalidate(6, $$scope = $$props2.$$scope);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*active, allow_dynamic_height, _height*/
      41) {
        $:
          active, allow_dynamic_height && active && _height && requestAnimationFrame(firehHeightChange);
      }
    };
    return [
      active,
      classes,
      style,
      _height,
      swipeItemInner,
      allow_dynamic_height,
      $$scope,
      slots,
      div0_binding,
      div1_elementresize_handler
    ];
  }
  var Swipeitem = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance2, create_fragment2, safe_not_equal, {
        active: 0,
        classes: 1,
        style: 2,
        allow_dynamic_height: 5
      });
    }
  };
  var swipeitem_default = Swipeitem;

  // src/folioview.svelte
  function get_each_context2(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[20] = list[i];
    child_ctx[22] = i;
    return child_ctx;
  }
  function create_else_block(ctx) {
    let t;
    return {
      c() {
        t = text(
          /*message*/
          ctx[6]
        );
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      p: noop,
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(t);
      }
    };
  }
  function create_if_block2(ctx) {
    let swipe;
    let t0;
    let div;
    let div_style_value;
    let t1;
    let span;
    let t2_value = (
      /*totalpages*/
      ctx[3] - /*defaultIndex*/
      ctx[2] + ""
    );
    let t2;
    let current;
    const swipe_spread_levels = [
      /*swipeConfig*/
      ctx[7],
      { defaultIndex: (
        /*defaultIndex*/
        ctx[2]
      ) }
    ];
    let swipe_props = {
      $$slots: { default: [create_default_slot] },
      $$scope: { ctx }
    };
    for (let i = 0; i < swipe_spread_levels.length; i += 1) {
      swipe_props = assign(swipe_props, swipe_spread_levels[i]);
    }
    swipe = new swipe_default({ props: swipe_props });
    ctx[14](swipe);
    swipe.$on("click", onclick);
    swipe.$on(
      "change",
      /*swipeChanged*/
      ctx[9]
    );
    return {
      c() {
        create_component(swipe.$$.fragment);
        t0 = space();
        div = element("div");
        t1 = space();
        span = element("span");
        t2 = text(t2_value);
        attr(div, "class", "foliocursor");
        attr(div, "style", div_style_value = /*folioCursorStyle*/
        ctx[10](
          /*$timestampcursor*/
          ctx[5]
        ));
        attr(span, "class", "pagenumber");
      },
      m(target, anchor) {
        mount_component(swipe, target, anchor);
        insert(target, t0, anchor);
        insert(target, div, anchor);
        insert(target, t1, anchor);
        insert(target, span, anchor);
        append(span, t2);
        current = true;
      },
      p(ctx2, dirty) {
        const swipe_changes = dirty & /*swipeConfig, defaultIndex*/
        132 ? get_spread_update(swipe_spread_levels, [
          dirty & /*swipeConfig*/
          128 && get_spread_object(
            /*swipeConfig*/
            ctx2[7]
          ),
          dirty & /*defaultIndex*/
          4 && { defaultIndex: (
            /*defaultIndex*/
            ctx2[2]
          ) }
        ]) : {};
        if (dirty & /*$$scope, imgs*/
        8388610) {
          swipe_changes.$$scope = { dirty, ctx: ctx2 };
        }
        swipe.$set(swipe_changes);
        if (!current || dirty & /*$timestampcursor*/
        32 && div_style_value !== (div_style_value = /*folioCursorStyle*/
        ctx2[10](
          /*$timestampcursor*/
          ctx2[5]
        ))) {
          attr(div, "style", div_style_value);
        }
        if ((!current || dirty & /*totalpages, defaultIndex*/
        12) && t2_value !== (t2_value = /*totalpages*/
        ctx2[3] - /*defaultIndex*/
        ctx2[2] + ""))
          set_data(t2, t2_value);
      },
      i(local) {
        if (current)
          return;
        transition_in(swipe.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(swipe.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        ctx[14](null);
        destroy_component(swipe, detaching);
        if (detaching)
          detach(t0);
        if (detaching)
          detach(div);
        if (detaching)
          detach(t1);
        if (detaching)
          detach(span);
      }
    };
  }
  function create_default_slot_1(ctx) {
    let img;
    let img_src_value;
    return {
      c() {
        img = element("img");
        attr(img, "alt", "no");
        attr(img, "class", "swipe svelte-65ny8b");
        if (!src_url_equal(img.src, img_src_value = /*imgs*/
        ctx[1][
          /*imgs*/
          ctx[1].length - /*idx*/
          ctx[22] - 1
        ]))
          attr(img, "src", img_src_value);
      },
      m(target, anchor) {
        insert(target, img, anchor);
      },
      p(ctx2, dirty) {
        if (dirty & /*imgs*/
        2 && !src_url_equal(img.src, img_src_value = /*imgs*/
        ctx2[1][
          /*imgs*/
          ctx2[1].length - /*idx*/
          ctx2[22] - 1
        ])) {
          attr(img, "src", img_src_value);
        }
      },
      d(detaching) {
        if (detaching)
          detach(img);
      }
    };
  }
  function create_each_block2(ctx) {
    let swipeitem;
    let current;
    swipeitem = new swipeitem_default({
      props: {
        $$slots: { default: [create_default_slot_1] },
        $$scope: { ctx }
      }
    });
    return {
      c() {
        create_component(swipeitem.$$.fragment);
      },
      m(target, anchor) {
        mount_component(swipeitem, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const swipeitem_changes = {};
        if (dirty & /*$$scope, imgs*/
        8388610) {
          swipeitem_changes.$$scope = { dirty, ctx: ctx2 };
        }
        swipeitem.$set(swipeitem_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(swipeitem.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(swipeitem.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(swipeitem, detaching);
      }
    };
  }
  function create_default_slot(ctx) {
    let each_1_anchor;
    let current;
    let each_value = (
      /*imgs*/
      ctx[1]
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
        current = true;
      },
      p(ctx2, dirty) {
        if (dirty & /*imgs*/
        2) {
          each_value = /*imgs*/
          ctx2[1];
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context2(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
              transition_in(each_blocks[i], 1);
            } else {
              each_blocks[i] = create_each_block2(child_ctx);
              each_blocks[i].c();
              transition_in(each_blocks[i], 1);
              each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
            }
          }
          group_outros();
          for (i = each_value.length; i < each_blocks.length; i += 1) {
            out(i);
          }
          check_outros();
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
        destroy_each(each_blocks, detaching);
        if (detaching)
          detach(each_1_anchor);
      }
    };
  }
  function create_fragment3(ctx) {
    let div;
    let current_block_type_index;
    let if_block;
    let current;
    let mounted;
    let dispose;
    const if_block_creators = [create_if_block2, create_else_block];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      if (
        /*$activefolioid*/
        ctx2[4]
      )
        return 0;
      return 1;
    }
    current_block_type_index = select_block_type(ctx, -1);
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    return {
      c() {
        div = element("div");
        if_block.c();
        attr(div, "class", "swipe-holder svelte-65ny8b");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if_blocks[current_block_type_index].m(div, null);
        current = true;
        if (!mounted) {
          dispose = listen(
            div,
            "wheel",
            /*mousewheel*/
            ctx[8]
          );
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2, dirty);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(div, null);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div);
        if_blocks[current_block_type_index].d();
        mounted = false;
        dispose();
      }
    };
  }
  function instance3($$self, $$props, $$invalidate) {
    let defaultIndex;
    let totalpages;
    let imgs;
    let $activepb;
    let $images;
    let $folioLines;
    let $maxpage;
    let $activefolioid;
    let $timestampcursor;
    component_subscribe($$self, activepb, ($$value) => $$invalidate(11, $activepb = $$value));
    component_subscribe($$self, images, ($$value) => $$invalidate(12, $images = $$value));
    component_subscribe($$self, folioLines, ($$value) => $$invalidate(17, $folioLines = $$value));
    component_subscribe($$self, maxpage, ($$value) => $$invalidate(13, $maxpage = $$value));
    component_subscribe($$self, activefolioid, ($$value) => $$invalidate(4, $activefolioid = $$value));
    component_subscribe($$self, timestampcursor, ($$value) => $$invalidate(5, $timestampcursor = $$value));
    let swiper, swiping = false;
    let message2 = "loading", stableleft;
    const swipeConfig = {
      autoplay: false,
      delay: 0,
      showIndicators: false,
      transitionDuration: 250
    };
    const imageFrame = () => {
      const img = document.getElementsByClassName("swipe")[defaultIndex];
      if (!img || !img.clientHeight)
        return [0, 0, 0, 0];
      const r = img.clientHeight / img.naturalHeight;
      const rect = img.getBoundingClientRect();
      if (rect.left < 0) {
        rect.left = stableleft;
      } else {
        stableleft = rect.left;
      }
      const w = img.naturalWidth * r;
      const left = Math.floor((img.clientWidth - w) / 2) + rect.x;
      return {
        left,
        top: rect.y,
        width: w,
        height: img.clientHeight
      };
    };
    const mousewheel = (e) => {
      if (e.deltaY > 0) {
        swiper.prevItem();
      } else {
        swiper.nextItem();
      }
      e.preventDefault();
    };
    const swipeChanged = (obj) => {
      const { active_item } = obj.detail;
      $$invalidate(2, defaultIndex = active_item);
      let i = totalpages - defaultIndex - 1;
      const wrapper = document.getElementsByClassName("swipeable-slot-wrapper")[0];
      if (!wrapper)
        return;
      swiping = true;
      const newpb = totalpages - defaultIndex - 1;
      activepb.set(newpb);
      const ele = wrapper.childNodes[defaultIndex]?.firstChild?.firstChild;
      if (!ele || !ele.src)
        return;
      if (~ele.src.indexOf("blank")) {
        const blob = new Blob([get_store_value(thezip).files[i].content]);
        ele.src = $$invalidate(1, imgs[i] = URL.createObjectURL(blob), imgs);
      }
      if (i + 1 < totalpages) {
        i++;
        const ele2 = wrapper.childNodes[defaultIndex - 1]?.firstChild.firstChild;
        if (~ele2?.src.indexOf("blank")) {
          const blob = new Blob([get_store_value(thezip).files[i].content]);
          ele2.src = $$invalidate(1, imgs[i] = URL.createObjectURL(blob), imgs);
        }
      }
      setTimeout(
        () => {
          swiping = false;
        },
        100
      );
    };
    const gotoPb = (pb) => {
      if (swiping || !$maxpage || !swiper)
        return;
      const go = $maxpage - parseInt(pb) - 1;
      if (go !== defaultIndex) {
        swiper.goTo(go);
      }
    };
    const folioCursorStyle = (line, ch = 0) => {
      const frame = imageFrame();
      const unitw = frame.width / $folioLines || 0;
      const unith = frame.height / FolioChars || 0;
      const left = Math.floor(($folioLines - line - 1) * unitw);
      const top = Math.floor(unith * ch) - 6;
      const style = `left:${left}px;top:${top}px;width:${unitw}px;height:${unith}px`;
      return style;
    };
    function swipe_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        swiper = $$value;
        $$invalidate(0, swiper);
      });
    }
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*$maxpage*/
      8192) {
        $:
          $$invalidate(2, defaultIndex = $maxpage - 1);
      }
      if ($$self.$$.dirty & /*$maxpage*/
      8192) {
        $:
          $$invalidate(3, totalpages = $maxpage);
      }
      if ($$self.$$.dirty & /*$images*/
      4096) {
        $:
          $$invalidate(1, imgs = $images);
      }
      if ($$self.$$.dirty & /*$activepb*/
      2048) {
        $:
          gotoPb($activepb);
      }
    };
    return [
      swiper,
      imgs,
      defaultIndex,
      totalpages,
      $activefolioid,
      $timestampcursor,
      message2,
      swipeConfig,
      mousewheel,
      swipeChanged,
      folioCursorStyle,
      $activepb,
      $images,
      $maxpage,
      swipe_binding
    ];
  }
  var Folioview = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance3, create_fragment3, safe_not_equal, {});
    }
  };
  var folioview_default = Folioview;

  // src/comps/inputnumber.svelte
  function create_if_block_1(ctx) {
    let span;
    let mounted;
    let dispose;
    return {
      c() {
        span = element("span");
        span.textContent = "\u2190";
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
      p(ctx2, dirty) {
        if (dirty & /*value, min*/
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
  function create_if_block3(ctx) {
    let span;
    let mounted;
    let dispose;
    return {
      c() {
        span = element("span");
        span.textContent = "\u2192";
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
      p(ctx2, dirty) {
        if (dirty & /*value, max*/
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
  function create_fragment4(ctx) {
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
      ctx[1] && create_if_block3(ctx)
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
      p(ctx2, [dirty]) {
        if (
          /*stepper*/
          ctx2[1]
        ) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
          } else {
            if_block0 = create_if_block_1(ctx2);
            if_block0.c();
            if_block0.m(span, input);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (dirty & /*style*/
        4) {
          attr(
            input,
            "style",
            /*style*/
            ctx2[2]
          );
        }
        if (dirty & /*value*/
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
            if_block1.p(ctx2, dirty);
          } else {
            if_block1 = create_if_block3(ctx2);
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
  function instance4($$self, $$props, $$invalidate) {
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
      init(this, options, instance4, create_fragment4, safe_not_equal, {
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

  // ../ptk/zip/utils.ts
  var makeUint8Array = (thing) => new Uint8Array(thing.buffer || thing);
  var wasm = "AGFzbQEAAAABCgJgAABgAn9/AXwDAwIAAQUDAQACBwkCAW0CAAFjAAEIAQAKlQECSQEDfwNAIAEhAEEAIQIDQCAAQQF2IABBAXFBoIbi7X5scyEAIAJBAWoiAkEIRw0ACyABQQJ0IAA2AgAgAUEBaiIBQYACRw0ACwtJAQF/IAFBf3MhAUGAgAQhAkGAgAQgAGohAANAIAFB/wFxIAItAABzQQJ0KAIAIAFBCHZzIQEgAkEBaiICIABJDQALIAFBf3O4Cw";
  var instance5 = new WebAssembly.Instance(
    new WebAssembly.Module(Uint8Array.from(atob(wasm), (c2) => c2.charCodeAt(0)))
  );
  var { c, m } = instance5.exports;
  var pageSize = 65536;
  var crcBuffer = makeUint8Array(m).subarray(pageSize);

  // ../ptk/zip/zipstore.ts
  var ZipStore = class {
    //zipbuf should at least include the Central records.
    constructor(zipbuf) {
      if (zipbuf instanceof ArrayBuffer) {
        zipbuf = new Uint8Array(zipbuf);
      }
      this.zipbuf = zipbuf instanceof Uint8Array ? zipbuf : new Uint8Array(zipbuf.buffer);
      this.files = [];
      this.zipStart = 0;
      const { fileCount, centralSize, centralOffset } = this.loadEndRecord();
      if (!fileCount)
        return null;
      this.loadFiles(fileCount, centralSize, centralOffset);
    }
    loadFiles(fileCount, centralSize, centralOffset) {
      const coffset = this.zipbuf.length - 22 /* endLength */ - centralSize;
      const buf = new DataView(this.zipbuf.buffer);
      let p = coffset;
      for (let i = 0; i < fileCount; i++) {
        const signature = buf.getUint32(p);
        if (signature !== 1347092738 /* centralHeaderSignature */) {
          break;
        }
        const size = buf.getUint32(p + 20, true);
        const namelen = buf.getUint16(p + 28, true);
        const extra = buf.getUint16(p + 30, true);
        const commentlen = buf.getUint16(p + 32, true);
        let offset = buf.getUint32(p + 42, true);
        p += 46 /* centralHeaderLength */;
        const encodedName = this.zipbuf.subarray(p, p + namelen);
        const name = new TextDecoder().decode(encodedName);
        p += namelen;
        p += extra + commentlen;
        if (i === 0)
          this.zipStart = offset;
        offset += 30 /* fileHeaderLength */ + namelen;
        let content;
        const inbuf = centralOffset - coffset;
        if (offset - inbuf >= 0) {
          content = this.zipbuf.subarray(offset - inbuf, offset - inbuf + size);
        }
        this.files.push({ name, offset, size, content });
      }
    }
    loadEndRecord() {
      const endRecord = { signature: 0, fileCount: 0, centralSize: 0, centralOffset: 0 };
      const buf = new DataView(this.zipbuf.buffer);
      const endpos = this.zipbuf.length - 22 /* endLength */;
      endRecord.signature = buf.getUint32(endpos);
      if (endRecord.signature !== 1347093766 /* endSignature */) {
        console.log("endrecord signature", endRecord.signature, "zipbuf length", this.zipbuf.length);
        throw "wrong endRecord signature";
        return endRecord;
      }
      endRecord.fileCount = buf.getUint16(endpos + 8, true);
      endRecord.centralSize = buf.getUint32(endpos + 12, true);
      endRecord.centralOffset = buf.getUint32(endpos + 16, true);
      return endRecord;
    }
  };

  // src/folio.js
  var loadFolio = async (folio, cb) => {
    if (!folio)
      return;
    const imgs = [];
    const src = get_store_value(foliopath) + folio + ".zip";
    let res = null, buf = null, zip = null;
    activefolioid.set("");
    try {
      res = await fetch(src);
      buf = await res.arrayBuffer();
      zip = new ZipStore(buf);
    } catch (e) {
      message = "cannot load " + src;
      return;
    }
    thezip.set(zip);
    imgs.length = 0;
    for (let i = 0; i < zip.files.length; i++) {
      if (i == zip.files.length - 1) {
        const blob = new Blob([zip.files[i].content]);
        imgs.push(URL.createObjectURL(blob));
      } else {
        imgs.push("blank.png");
      }
    }
    images.set(imgs);
    maxpage.set(zip.files.length);
    setTimeout(() => {
      activefolioid.set(folio);
      activepb.set(0);
      timestampcursor.set(0);
      cb && cb();
    }, 100);
  };

  // src/player.svelte
  function create_if_block4(ctx) {
    let div;
    let audio_1;
    let source;
    let source_src_value;
    let audio_1_style_value;
    let mounted;
    let dispose;
    return {
      c() {
        div = element("div");
        audio_1 = element("audio");
        source = element("source");
        if (!src_url_equal(source.src, source_src_value = /*$audiopath*/
        ctx[2] + /*$activefolioid*/
        ctx[1] + ".mp3"))
          attr(source, "src", source_src_value);
        audio_1.controls = true;
        attr(audio_1, "style", audio_1_style_value = "height:1em;width:" + paneWidth());
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, audio_1);
        append(audio_1, source);
        ctx[6](audio_1);
        if (!mounted) {
          dispose = [
            listen(
              audio_1,
              "play",
              /*onplay*/
              ctx[4]
            ),
            listen(
              audio_1,
              "pause",
              /*onpause*/
              ctx[5]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty & /*$audiopath, $activefolioid*/
        6 && !src_url_equal(source.src, source_src_value = /*$audiopath*/
        ctx2[2] + /*$activefolioid*/
        ctx2[1] + ".mp3")) {
          attr(source, "src", source_src_value);
        }
      },
      d(detaching) {
        if (detaching)
          detach(div);
        ctx[6](null);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_fragment5(ctx) {
    let if_block_anchor;
    let mounted;
    let dispose;
    let if_block = (
      /*$activefolioid*/
      ctx[1] && create_if_block4(ctx)
    );
    return {
      c() {
        if (if_block)
          if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if (if_block)
          if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
        if (!mounted) {
          dispose = listen(
            window,
            "keydown",
            /*onKeyDown*/
            ctx[3]
          );
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (
          /*$activefolioid*/
          ctx2[1]
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
          } else {
            if_block = create_if_block4(ctx2);
            if_block.c();
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (if_block)
          if_block.d(detaching);
        if (detaching)
          detach(if_block_anchor);
        mounted = false;
        dispose();
      }
    };
  }
  function instance6($$self, $$props, $$invalidate) {
    let $activepb;
    let $timestamps;
    let $timestampcursor;
    let $folioLines;
    let $stampdelay;
    let $activefolioid;
    let $audiopath;
    component_subscribe($$self, activepb, ($$value) => $$invalidate(7, $activepb = $$value));
    component_subscribe($$self, timestamps, ($$value) => $$invalidate(8, $timestamps = $$value));
    component_subscribe($$self, timestampcursor, ($$value) => $$invalidate(9, $timestampcursor = $$value));
    component_subscribe($$self, folioLines, ($$value) => $$invalidate(10, $folioLines = $$value));
    component_subscribe($$self, stampdelay, ($$value) => $$invalidate(11, $stampdelay = $$value));
    component_subscribe($$self, activefolioid, ($$value) => $$invalidate(1, $activefolioid = $$value));
    component_subscribe($$self, audiopath, ($$value) => $$invalidate(2, $audiopath = $$value));
    let audio;
    const onKeyDown = (e) => {
      const num = parseInt(e.key);
      if (e.code == "Space") {
        if (e.target.nodeName == "AUDIO")
          return;
        audio.paused ? audio.play() : audio.pause();
        e.preventDefault();
      } else if (e.code == "Enter" || e.code == "NumpadEnter") {
        setTimestamp(audio.currentTime - $stampdelay);
        if ($timestampcursor + 1 < $folioLines)
          timestampcursor.set($timestampcursor + 1);
        e.preventDefault();
      } else if (e.key == "ArrowDown") {
        activepb.set($activepb + 1);
        timestampcursor.set(0);
        e.preventDefault();
      } else if (e.key == "ArrowUp") {
        activepb.set($activepb - 1);
        timestampcursor.set(0);
        e.preventDefault();
      } else if (e.key == "ArrowRight") {
        if (e.target.nodeName == "AUDIO")
          e.preventDefault();
        if ($timestampcursor + 1 < $folioLines) {
          timestampcursor.set($timestampcursor + 1);
          e.preventDefault();
        }
      } else if (e.key == "ArrowLeft") {
        if (e.target.nodeName == "AUDIO")
          e.preventDefault();
        if ($timestampcursor > 0) {
          timestampcursor.set($timestampcursor - 1);
          e.preventDefault();
        }
      } else if (e.key == "Backspace") {
        seektrack(-3);
      } else if (e.key == "Delete") {
        if ($timestampcursor > 0) {
          const cursor = $timestampcursor - 1;
          timestampcursor.set(cursor);
          const ts = $timestamps[$activepb][cursor];
          settrack(ts);
          e.preventDefault();
        }
      } else if (num && e.target.nodeName !== "INPUT") {
        seektrack(e.ctrlKey ? -num : num);
        e.preventDefault();
      }
      if (document.activeElement == audio)
        audio.blur();
    };
    const onplay = () => {
      playing.set(true);
    };
    const onpause = () => {
      playing.set(false);
    };
    function audio_1_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        audio = $$value;
        $$invalidate(0, audio);
      });
    }
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*audio*/
      1) {
        $:
          theaudio.set(audio);
      }
    };
    return [audio, $activefolioid, $audiopath, onKeyDown, onplay, onpause, audio_1_binding];
  }
  var Player = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance6, create_fragment5, safe_not_equal, {});
    }
  };
  var player_default = Player;

  // src/toolbar.svelte
  function get_each_context3(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[5] = list[i];
    child_ctx[7] = i;
    return child_ctx;
  }
  function create_each_block3(ctx) {
    let option;
    let t_value = (
      /*sutra*/
      ctx[5].caption + ""
    );
    let t;
    let option_value_value;
    return {
      c() {
        option = element("option");
        t = text(t_value);
        option.__value = option_value_value = /*sutra*/
        ctx[5].caption;
        option.value = option.__value;
      },
      m(target, anchor) {
        insert(target, option, anchor);
        append(option, t);
      },
      p: noop,
      d(detaching) {
        if (detaching)
          detach(option);
      }
    };
  }
  function create_fragment6(ctx) {
    let select;
    let t0;
    let inputnumber;
    let updating_value;
    let t1;
    let player;
    let current;
    let mounted;
    let dispose;
    let each_value = sutras;
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block3(get_each_context3(ctx, each_value, i));
    }
    function inputnumber_value_binding(value) {
      ctx[4](value);
    }
    let inputnumber_props = { max: (
      /*maxjuan*/
      ctx[1]
    ) };
    if (
      /*value*/
      ctx[0] !== void 0
    ) {
      inputnumber_props.value = /*value*/
      ctx[0];
    }
    inputnumber = new inputnumber_default({ props: inputnumber_props });
    binding_callbacks.push(() => bind(inputnumber, "value", inputnumber_value_binding));
    player = new player_default({});
    return {
      c() {
        select = element("select");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        t0 = text("\n\u5377");
        create_component(inputnumber.$$.fragment);
        t1 = space();
        create_component(player.$$.fragment);
      },
      m(target, anchor) {
        insert(target, select, anchor);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(select, null);
          }
        }
        insert(target, t0, anchor);
        mount_component(inputnumber, target, anchor);
        insert(target, t1, anchor);
        mount_component(player, target, anchor);
        current = true;
        if (!mounted) {
          dispose = listen(
            select,
            "change",
            /*selectsutra*/
            ctx[2]
          );
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (dirty & /*sutras*/
        0) {
          each_value = sutras;
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context3(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block3(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(select, null);
            }
          }
          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }
          each_blocks.length = each_value.length;
        }
        const inputnumber_changes = {};
        if (dirty & /*maxjuan*/
        2)
          inputnumber_changes.max = /*maxjuan*/
          ctx2[1];
        if (!updating_value && dirty & /*value*/
        1) {
          updating_value = true;
          inputnumber_changes.value = /*value*/
          ctx2[0];
          add_flush_callback(() => updating_value = false);
        }
        inputnumber.$set(inputnumber_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(inputnumber.$$.fragment, local);
        transition_in(player.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(inputnumber.$$.fragment, local);
        transition_out(player.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(select);
        destroy_each(each_blocks, detaching);
        if (detaching)
          detach(t0);
        destroy_component(inputnumber, detaching);
        if (detaching)
          detach(t1);
        destroy_component(player, detaching);
        mounted = false;
        dispose();
      }
    };
  }
  function instance7($$self, $$props, $$invalidate) {
    let maxjuan2;
    let $activesutra;
    component_subscribe($$self, activesutra, ($$value) => $$invalidate(3, $activesutra = $$value));
    let value = 1;
    const selectsutra = (e) => {
      activesutra.set(e.target.selectedIndex);
      $$invalidate(0, value = 1);
    };
    ;
    function inputnumber_value_binding(value$1) {
      value = value$1;
      $$invalidate(0, value);
    }
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*$activesutra*/
      8) {
        $:
          $$invalidate(1, maxjuan2 = sutras[$activesutra].juancount);
      }
      if ($$self.$$.dirty & /*$activesutra, value*/
      9) {
        $: {
          loadFolio(sutras[$activesutra].bkid + value, () => {
            createTimestamps(get_store_value(thezip).files.length);
          });
        }
      }
      if ($$self.$$.dirty & /*value*/
      1) {
        $:
          activejuan.set(value);
      }
    };
    return [value, maxjuan2, selectsutra, $activesutra, inputnumber_value_binding];
  }
  var Toolbar = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance7, create_fragment6, safe_not_equal, {});
    }
  };
  var toolbar_default = Toolbar;

  // src/pagetimestamp.svelte
  function get_each_context4(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[6] = list[i];
    child_ctx[8] = i;
    return child_ctx;
  }
  function create_each_block4(ctx) {
    let span;
    let t_value = (
      /*ts*/
      (ctx[6] ? (
        /*humantime*/
        ctx[2](
          /*ts*/
          ctx[6]
        )
      ) : "00:00") + " "
    );
    let t;
    let span_title_value;
    let mounted;
    let dispose;
    function click_handler() {
      return (
        /*click_handler*/
        ctx[5](
          /*idx*/
          ctx[8],
          /*ts*/
          ctx[6]
        )
      );
    }
    return {
      c() {
        span = element("span");
        t = text(t_value);
        attr(span, "class", "timestamp");
        attr(span, "title", span_title_value = /*humantime*/
        ctx[2](
          /*ts*/
          ctx[6],
          true
        ));
        toggle_class(
          span,
          "wrong",
          /*ts*/
          ctx[6] && /*idx*/
          ctx[8] > 0 && /*timestamp*/
          ctx[0][
            /*idx*/
            ctx[8] - 1
          ] > /*ts*/
          ctx[6]
        );
        toggle_class(
          span,
          "setted",
          /*ts*/
          ctx[6]
        );
        toggle_class(
          span,
          "selected",
          /*idx*/
          ctx[8] == /*cursor*/
          ctx[1]
        );
      },
      m(target, anchor) {
        insert(target, span, anchor);
        append(span, t);
        if (!mounted) {
          dispose = listen(span, "click", click_handler);
          mounted = true;
        }
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        if (dirty & /*timestamp*/
        1 && t_value !== (t_value = /*ts*/
        (ctx[6] ? (
          /*humantime*/
          ctx[2](
            /*ts*/
            ctx[6]
          )
        ) : "00:00") + " "))
          set_data(t, t_value);
        if (dirty & /*timestamp*/
        1 && span_title_value !== (span_title_value = /*humantime*/
        ctx[2](
          /*ts*/
          ctx[6],
          true
        ))) {
          attr(span, "title", span_title_value);
        }
        if (dirty & /*timestamp*/
        1) {
          toggle_class(
            span,
            "wrong",
            /*ts*/
            ctx[6] && /*idx*/
            ctx[8] > 0 && /*timestamp*/
            ctx[0][
              /*idx*/
              ctx[8] - 1
            ] > /*ts*/
            ctx[6]
          );
        }
        if (dirty & /*timestamp*/
        1) {
          toggle_class(
            span,
            "setted",
            /*ts*/
            ctx[6]
          );
        }
        if (dirty & /*cursor*/
        2) {
          toggle_class(
            span,
            "selected",
            /*idx*/
            ctx[8] == /*cursor*/
            ctx[1]
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
  function create_fragment7(ctx) {
    let each_1_anchor;
    let each_value = (
      /*timestamp*/
      ctx[0]
    );
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block4(get_each_context4(ctx, each_value, i));
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
      p(ctx2, [dirty]) {
        if (dirty & /*humantime, timestamp, cursor, gototimestamp*/
        15) {
          each_value = /*timestamp*/
          ctx2[0];
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context4(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block4(child_ctx);
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
      i: noop,
      o: noop,
      d(detaching) {
        destroy_each(each_blocks, detaching);
        if (detaching)
          detach(each_1_anchor);
      }
    };
  }
  function instance8($$self, $$props, $$invalidate) {
    let { timestamp = [] } = $$props;
    let { cursor } = $$props;
    let { pb } = $$props;
    const humantime = (ts, frag) => {
      const t = Math.round(ts);
      const h = Math.floor(t / 3600);
      const m2 = Math.floor((t - h * 3600) / 60).toString();
      let s = ts - h * 3600 - m2 * 60;
      return (h ? h + ":" : "") + m2.padStart(2, "0") + ":" + (frag ? s.toFixed(2) : Math.round(s).toString().padStart(2, "0"));
    };
    const gototimestamp = (idx, ts) => {
      timestampcursor.set(idx);
      activepb.set(pb);
      if (ts) {
        get_store_value(theaudio).currentTime = ts;
      }
    };
    const click_handler = (idx, ts) => gototimestamp(idx, ts);
    $$self.$$set = ($$props2) => {
      if ("timestamp" in $$props2)
        $$invalidate(0, timestamp = $$props2.timestamp);
      if ("cursor" in $$props2)
        $$invalidate(1, cursor = $$props2.cursor);
      if ("pb" in $$props2)
        $$invalidate(4, pb = $$props2.pb);
    };
    return [timestamp, cursor, humantime, gototimestamp, pb, click_handler];
  }
  var Pagetimestamp = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance8, create_fragment7, safe_not_equal, { timestamp: 0, cursor: 1, pb: 4 });
    }
  };
  var pagetimestamp_default = Pagetimestamp;

  // src/timestamps.svelte
  function get_each_context5(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[5] = list[i];
    child_ctx[7] = i;
    return child_ctx;
  }
  function create_each_block5(ctx) {
    let div;
    let span;
    let t0_value = (
      /*idx*/
      (ctx[7] + 1).toString().padStart(2, "0") + ""
    );
    let t0;
    let t1;
    let pagetimestamp;
    let current;
    let mounted;
    let dispose;
    function click_handler() {
      return (
        /*click_handler*/
        ctx[4](
          /*idx*/
          ctx[7]
        )
      );
    }
    pagetimestamp = new pagetimestamp_default({
      props: {
        timestamp: (
          /*timestamp*/
          ctx[5]
        ),
        pb: (
          /*idx*/
          ctx[7]
        ),
        cursor: (
          /*$activepb*/
          ctx[1] == /*idx*/
          ctx[7] ? (
            /*$timestampcursor*/
            ctx[2]
          ) : -1
        )
      }
    });
    return {
      c() {
        div = element("div");
        span = element("span");
        t0 = text(t0_value);
        t1 = space();
        create_component(pagetimestamp.$$.fragment);
        attr(span, "class", "pb");
        toggle_class(
          span,
          "selected",
          /*$activepb*/
          ctx[1] == /*idx*/
          ctx[7]
        );
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, span);
        append(span, t0);
        append(div, t1);
        mount_component(pagetimestamp, div, null);
        current = true;
        if (!mounted) {
          dispose = listen(span, "click", click_handler);
          mounted = true;
        }
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        if (!current || dirty & /*$activepb*/
        2) {
          toggle_class(
            span,
            "selected",
            /*$activepb*/
            ctx[1] == /*idx*/
            ctx[7]
          );
        }
        const pagetimestamp_changes = {};
        if (dirty & /*$timestamps*/
        1)
          pagetimestamp_changes.timestamp = /*timestamp*/
          ctx[5];
        if (dirty & /*$activepb, $timestampcursor*/
        6)
          pagetimestamp_changes.cursor = /*$activepb*/
          ctx[1] == /*idx*/
          ctx[7] ? (
            /*$timestampcursor*/
            ctx[2]
          ) : -1;
        pagetimestamp.$set(pagetimestamp_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(pagetimestamp.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(pagetimestamp.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div);
        destroy_component(pagetimestamp);
        mounted = false;
        dispose();
      }
    };
  }
  function create_fragment8(ctx) {
    let table;
    let tr;
    let td0;
    let div0;
    let t0;
    let td1;
    let current;
    let each_value = (
      /*$timestamps*/
      ctx[0]
    );
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block5(get_each_context5(ctx, each_value, i));
    }
    const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
      each_blocks[i] = null;
    });
    return {
      c() {
        table = element("table");
        tr = element("tr");
        td0 = element("td");
        div0 = element("div");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        t0 = space();
        td1 = element("td");
        td1.innerHTML = `<div class="help">\u8AA6\u7D93\u6642\u9593\u8EF8 2023.8.3
<br/>\u4E0A\u4E0B\u9375 \u4E0A\u4E0B\u6298
<br/>\u5DE6\u53F3\u9375 \u524D\u5F8C\u53E5
<br/>\u7A7A\u767D \u64AD\u653E/\u66AB\u505C
<br/>Enter \u8A2D\u5B9A\u6642\u9593\u6233
<br/>Backspace \u5F80\u56DE\u8DF3\u4E09\u79D2
<br/>Del \u4FEE\u6B63\u4E0A\u4E00\u53E5
<br/>\u6578\u5B57 \u5F80\u524D\u8DF3\u79D2\u6578 1~9, Ctrl-\u6578\u5B57 \u5F80\u56DE\u8DF3\u79D2\u6578 
<br/>\u9EDE\u7DA0\u8272\u6578\u5B57\u79FB\u5230\u97F3\u983B\u53CA\u5716\u6A94\u4F4D\u7F6E\u3002
<br/>\u7D05\u8272\u6578\u5B57\u8868\u793A\u932F\u8AA4\uFF0C\u4E0D\u5F97\u6BD4\u4E4B\u524D\u7684\u6578\u5B57\u5C0F\u3002</div>`;
        attr(div0, "class", "timestamps");
      },
      m(target, anchor) {
        insert(target, table, anchor);
        append(table, tr);
        append(tr, td0);
        append(td0, div0);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(div0, null);
          }
        }
        append(tr, t0);
        append(tr, td1);
        current = true;
      },
      p(ctx2, [dirty]) {
        if (dirty & /*$timestamps, $activepb, $timestampcursor, gopage*/
        15) {
          each_value = /*$timestamps*/
          ctx2[0];
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context5(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
              transition_in(each_blocks[i], 1);
            } else {
              each_blocks[i] = create_each_block5(child_ctx);
              each_blocks[i].c();
              transition_in(each_blocks[i], 1);
              each_blocks[i].m(div0, null);
            }
          }
          group_outros();
          for (i = each_value.length; i < each_blocks.length; i += 1) {
            out(i);
          }
          check_outros();
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
          detach(table);
        destroy_each(each_blocks, detaching);
      }
    };
  }
  function instance9($$self, $$props, $$invalidate) {
    let $timestamps;
    let $activepb;
    let $timestampcursor;
    component_subscribe($$self, timestamps, ($$value) => $$invalidate(0, $timestamps = $$value));
    component_subscribe($$self, activepb, ($$value) => $$invalidate(1, $activepb = $$value));
    component_subscribe($$self, timestampcursor, ($$value) => $$invalidate(2, $timestampcursor = $$value));
    const gopage = (pb) => {
      activepb.set(pb);
    };
    const click_handler = (idx) => gopage(idx);
    return [$timestamps, $activepb, $timestampcursor, gopage, click_handler];
  }
  var Timestamps = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance9, create_fragment8, safe_not_equal, {});
    }
  };
  var timestamps_default = Timestamps;

  // src/app.svelte
  function create_fragment9(ctx) {
    let div;
    let table;
    let tr;
    let td0;
    let folioview;
    let td0_style_value;
    let t0;
    let td1;
    let toolbar;
    let t1;
    let timestamps2;
    let current;
    folioview = new folioview_default({});
    toolbar = new toolbar_default({});
    timestamps2 = new timestamps_default({});
    return {
      c() {
        div = element("div");
        table = element("table");
        tr = element("tr");
        td0 = element("td");
        create_component(folioview.$$.fragment);
        t0 = space();
        td1 = element("td");
        create_component(toolbar.$$.fragment);
        t1 = space();
        create_component(timestamps2.$$.fragment);
        attr(td0, "style", td0_style_value = "width:" + paneWidth(true));
        attr(td1, "class", "pane");
        attr(div, "class", "app svelte-1ypjrgx");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, table);
        append(table, tr);
        append(tr, td0);
        mount_component(folioview, td0, null);
        append(tr, t0);
        append(tr, td1);
        mount_component(toolbar, td1, null);
        append(td1, t1);
        mount_component(timestamps2, td1, null);
        current = true;
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(folioview.$$.fragment, local);
        transition_in(toolbar.$$.fragment, local);
        transition_in(timestamps2.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(folioview.$$.fragment, local);
        transition_out(toolbar.$$.fragment, local);
        transition_out(timestamps2.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div);
        destroy_component(folioview);
        destroy_component(toolbar);
        destroy_component(timestamps2);
      }
    };
  }
  var App = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, null, create_fragment9, safe_not_equal, {});
    }
  };
  var app_default = App;

  // src/index.ts
  var app = new app_default({ target: document.body });
  document.querySelector("#bootmessage").innerHTML = "";
  var src_default = app;
})();
