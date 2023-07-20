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
  function get_slot_changes(definition, $$scope, dirty2, fn) {
    if (definition[2] && fn) {
      const lets = definition[2](fn(dirty2));
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
      const dirty2 = [];
      const length = $$scope.ctx.length / 32;
      for (let i = 0; i < length; i++) {
        dirty2[i] = -1;
      }
      return dirty2;
    }
    return -1;
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
  function element(name2) {
    return document.createElement(name2);
  }
  function svg_element(name2) {
    return document.createElementNS("http://www.w3.org/2000/svg", name2);
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
  function toggle_class(element2, name2, toggle) {
    element2.classList[toggle ? "add" : "remove"](name2);
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
      const dirty2 = $$.dirty;
      $$.dirty = [-1];
      $$.fragment && $$.fragment.p($$.ctx, dirty2);
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
  function bind(component, name2, callback) {
    const index = component.$$.props[name2];
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
  function init(component, options, instance16, create_fragment16, not_equal, props, append_styles, dirty2 = [-1]) {
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
    $$.ctx = instance16 ? instance16(component, options.props || {}, (i, ret, ...rest) => {
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
    $$.fragment = create_fragment16 ? create_fragment16($$.ctx) : false;
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
  var ratio = writable(1);
  var totalframe = writable(0);
  var dirty = writable(false);
  var pageframe = writable(3);
  var selectedframe = writable(0);
  var fileprefix = writable("");
  var framefile = writable(null);
  var verticalstrip = writable(5);
  var horizontalstrip = writable(17);
  var nanzang = writable(true);
  var showpreview = writable(false);
  var activeimageurl = writable("");
  var swiper = writable(null);
  var rotateangle = writable(0);
  var defaultframe;
  var setTemplate = (name2) => {
    if (name2 == "beizang") {
      defaultframe = function(idx2) {
        return [1030 * (2 - idx2) + 186, 139, 964, 2120];
      };
      pageframe.set(3);
      verticalstrip.set(5);
    } else if (name2 == "longzang") {
      verticalstrip.set(5);
      pageframe.set(2);
      defaultframe = function(idx2) {
        return [385 * (1 - idx2) + 18, 148, 364, 810];
      };
    } else if (name2 == "nanzang") {
      verticalstrip.set(6);
      pageframe.set(3);
      defaultframe = function(idx2) {
        return [880 * (2 - idx2) + 220, 170, 790, 1822];
      };
    }
  };
  setTemplate("beizang");
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
    const r3 = get_store_value(ratio);
    if (imgs?.length && imgs[nimg]) {
      imgs[nimg].frames = frms.map((f) => resizeframe(f, 1 / r3));
      imgs[nimg].rotate = get_store_value(rotateangle);
      dirty.set(true);
    }
    totalframe.set(caltotalframe());
    nimage.set(n);
    rotateangle.set(imgs[n]?.rotate || 0);
    if (get_store_value(totalframe))
      selectedframe.set(0);
  };
  var genjson = () => {
    const imgs = get_store_value(images);
    const out = [];
    for (let i = 0; i < imgs.length; i++) {
      const frames2 = [];
      const rotate = imgs[i].rotate || 0;
      const mark = imgs[i].mark || 0;
      for (let j2 = 0; j2 < imgs[i].frames?.length || 0; j2++) {
        const [x, y, w, h] = imgs[i].frames[j2];
        frames2.push([Math.round(x), Math.round(y), Math.round(w), Math.round(h)]);
      }
      out.push('{"name":"' + imgs[i].name + '","frames":' + JSON.stringify(frames2) + (rotate ? ',"rotate":' + rotate : "") + (mark ? ',"mark":' + mark : "") + "}");
    }
    return "[" + out.join(",\n") + "]";
  };
  async function getImageURL(images2, nimg, store) {
    if (!images2?.length)
      return;
    const item = images2[nimg];
    if (!item)
      return;
    if (item.zip) {
      imageurl = URL.createObjectURL(await item.entry.getData(new zip.BlobWriter()));
    } else if (item.pdf) {
      await item.pdf.getPage(item.page).then(async function(page) {
        const viewport = page.getViewport({ scale: 1 });
        const canvas = document.createElement("canvas");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
        imageurl = canvas.toDataURL("image/png");
      });
    } else {
      const imagefile = await item.entry.getFile();
      imageurl = URL.createObjectURL(imagefile);
    }
    if (store) {
      store.set(imageurl);
      setTimeout(() => {
        const naturalWidth = document.getElementById("image1").naturalWidth;
        height = document.getElementById("image1").height;
        width = document.getElementById("image1").width;
        r = width / naturalWidth;
        ratio.set(r);
        let newframe = [defaultframe(0), defaultframe(1), defaultframe(2)];
        if (nimg > 0 && images2[nimg - 1].frames?.length == 3) {
          newframe = [].concat(images2[nimg - 1].frames);
        }
        const frms = (images2[nimg].frames || newframe).map((f) => resizeframe(f, r));
        frames.set(frms);
      }, 100);
    }
    return imageurl;
  }
  var togglemark = (idx2) => {
    const arr = [...get_store_value(images)];
    arr[idx2].mark = 1 - (arr[idx2].mark || 0);
    images.set(arr);
  };

  // ../ptk/platform/chromefs.ts
  var m = typeof navigator !== "undefined" && navigator.userAgent.match(/Chrome\/(\d+)/);
  var supprtedBrowser = m && parseInt(m[1]) >= 86;
  var createBrowserDownload = (filename2, buf) => {
    let file = new Blob([buf], { type: "application/octet-binary" });
    let a = document.createElement("a"), url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename2;
    document.body.appendChild(a);
    a.click();
  };
  async function verifyPermission(fileHandle, readWrite = false) {
    const options = {};
    if (readWrite) {
      options.mode = "readwrite";
    }
    if (await fileHandle.queryPermission(options) === "granted") {
      return true;
    }
    if (await fileHandle.requestPermission(options) === "granted") {
      return true;
    }
    return false;
  }

  // src/working.js
  var { ZipReader, BlobReader } = zip;
  var zipOpts = {
    types: [{ description: "Images Zip/PDF", accept: { "zip/*": [".zip", ".pdf"] } }],
    excludeAcceptAllOption: true,
    multiple: false
  };
  var jsonOpts = {
    types: [{ description: "json", accept: { "json/*": [".json"] } }],
    excludeAcceptAllOption: true,
    multiple: false
  };
  var getFolder = async () => {
    const dirHandle = await window.showDirectoryPicker();
    const out = [];
    setTemplate("shandong");
    for await (const entry of dirHandle.values()) {
      if (entry.kind == "file" && (entry.name.endsWith(".png") || entry.name.endsWith(".jpg"))) {
        out.push({ entry, name: entry.name, frames: out.length ? null : [] });
      }
    }
    out.sort(sortfilename);
    if (out.length > 2)
      out[out.length - 1].frames = [];
    nimage.set(0);
    images.set(out);
    fileprefix.set(dirHandle.name);
  };
  var sortfilename = (a, b) => {
    if (parseInt(a) && parseInt(b)) {
      return parseInt(a) - parseInt(b);
    } else {
      return a.name > b.name ? 1 : -1;
    }
  };
  async function openZip(file) {
    const zip2 = new ZipReader(new BlobReader(file));
    const entries = await zip2.getEntries();
    const out = [];
    framefile.set(null);
    setTemplate("shandong");
    entries.forEach((entry) => {
      if (entry.filename.endsWith(".jpg")) {
        let at = entry.filename.lastIndexOf("/");
        if (at == -1)
          at = entry.filename.lastIndexOf("\\");
        out.push({ name: entry.filename.slice(at + 1), entry, zip: zip2, frames: out.length ? null : [] });
      }
    });
    out.sort(sortfilename);
    if (out.length > 2)
      out[out.length - 1].frames = [];
    return out;
  }
  var pdf;
  async function openPDF(file) {
    setTemplate("qindinglongcang");
    const arraybuffer = await file.arrayBuffer();
    const typedarray = new Uint8Array(arraybuffer);
    pdf = await pdfjsLib.getDocument(typedarray).promise;
    const out = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      out.push({ name: i, pdf, page: i, frames: out.length ? null : [] });
    }
    if (out.length > 2)
      out[out.length - 1].frames = [];
    return out;
  }
  var openWorkingFile = async (file) => {
    let out = [];
    const filename2 = file.name.toLowerCase();
    if (filename2.endsWith(".zip"))
      out = await openZip(file);
    else if (filename2.endsWith(".pdf"))
      out = await openPDF(file);
    else
      return "";
    nimage.set(0);
    images.set(out);
    fileprefix.set(filename2.replace(/\.[a-z]+$/, ""));
    return filename2;
  };
  var filename = "";
  var openImageFiles = async () => {
    const filehandles = await window.showOpenFilePicker(zipOpts);
    const file = await filehandles[0].getFile();
    filename = openWorkingFile(file);
  };
  var loadfile = async (file) => {
    const imgs = get_store_value(images);
    const json = JSON.parse(await file.text());
    for (let i = 0; i < imgs.length; i++) {
      imgs[i].frames = json[i].frames;
      imgs[i].rotate = json[i].rotate || 0;
      imgs[i].mark = json[i].mark || 0;
    }
    images.set(imgs);
    totalframe.set(caltotalframe());
    return json;
  };
  var load = async () => {
    const imgs = get_store_value(images);
    if (!imgs.length) {
      alert("need images");
      return;
    }
    const filehandles = await window.showOpenFilePicker({ ...jsonOpts });
    const file = await filehandles[0].getFile();
    framefile.set(filehandles[0]);
    const json = await loadfile(file);
    if (json.length !== imgs.length || filehandles.length > 1 && filehandles[0].name.replace(".json", "") !== get_store_value(fileprefix)) {
      json.length = 0;
      alert("zip json filename mismatch");
      return;
    }
  };
  var save = async () => {
    selectimage(0);
    const data = genjson();
    const file = get_store_value(framefile);
    if (file) {
      const ok = await verifyPermission(file, true);
      if (ok) {
        const writable2 = await file.createWritable();
        await writable2.write(data);
        await writable2.close();
        dirty.set(false);
      }
    } else {
      dirty.set(false);
      const outfn = get_store_value(fileprefix) + ".json";
      createBrowserDownload(outfn, data);
    }
  };

  // src/3rd/slider.js
  function handle(node) {
    const onDown = getOnDown(node);
    node.addEventListener("touchstart", onDown);
    node.addEventListener("mousedown", onDown);
    return {
      destroy() {
        node.removeEventListener("touchstart", onDown);
        node.removeEventListener("mousedown", onDown);
      }
    };
  }
  function getOnDown(node) {
    const onMove = getOnMove(node);
    return function(e) {
      e.preventDefault();
      node.dispatchEvent(new CustomEvent("dragstart"));
      const moveevent = "touches" in e ? "touchmove" : "mousemove";
      const upevent = "touches" in e ? "touchend" : "mouseup";
      document.addEventListener(moveevent, onMove);
      document.addEventListener(upevent, onUp);
      function onUp(e2) {
        e2.stopPropagation();
        document.removeEventListener(moveevent, onMove);
        document.removeEventListener(upevent, onUp);
        node.dispatchEvent(new CustomEvent("dragend"));
      }
      ;
    };
  }
  function getOnMove(node) {
    const track = node.parentNode;
    return function(e) {
      const { left, width: width3 } = track.getBoundingClientRect();
      const clickOffset = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clickPos = Math.min(Math.max((clickOffset - left) / width3, 0), 1) || 0;
      node.dispatchEvent(new CustomEvent("drag", { detail: clickPos }));
    };
  }

  // src/3rd/thumb.svelte
  function create_fragment(ctx) {
    let div1;
    let div0;
    let div1_style_value;
    let handle_action;
    let current;
    let mounted;
    let dispose;
    const default_slot_template = (
      /*#slots*/
      ctx[4].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[3],
      null
    );
    return {
      c() {
        div1 = element("div");
        div0 = element("div");
        if (default_slot)
          default_slot.c();
        attr(div0, "class", "thumb-content svelte-8w8x88");
        toggle_class(
          div0,
          "active",
          /*active*/
          ctx[1]
        );
        attr(div1, "class", "thumb svelte-8w8x88");
        attr(div1, "style", div1_style_value = `left: ${/*pos*/
        ctx[0] * 100}%;`);
      },
      m(target, anchor) {
        insert(target, div1, anchor);
        append(div1, div0);
        if (default_slot) {
          default_slot.m(div0, null);
        }
        current = true;
        if (!mounted) {
          dispose = [
            action_destroyer(handle_action = handle.call(null, div1)),
            listen(
              div1,
              "dragstart",
              /*dragstart_handler*/
              ctx[5]
            ),
            listen(
              div1,
              "drag",
              /*drag_handler*/
              ctx[6]
            ),
            listen(
              div1,
              "dragend",
              /*dragend_handler*/
              ctx[7]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, [dirty2]) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty2 & /*$$scope*/
          8)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[3],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[3]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[3],
                dirty2,
                null
              ),
              null
            );
          }
        }
        if (!current || dirty2 & /*active*/
        2) {
          toggle_class(
            div0,
            "active",
            /*active*/
            ctx2[1]
          );
        }
        if (!current || dirty2 & /*pos*/
        1 && div1_style_value !== (div1_style_value = `left: ${/*pos*/
        ctx2[0] * 100}%;`)) {
          attr(div1, "style", div1_style_value);
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
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function instance($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    const dispatch = createEventDispatcher();
    let active;
    let { pos } = $$props;
    const dragstart_handler = () => ($$invalidate(1, active = true), dispatch("active", true));
    const drag_handler = ({ detail: v }) => $$invalidate(0, pos = v);
    const dragend_handler = () => ($$invalidate(1, active = false), dispatch("active", false));
    $$self.$$set = ($$props2) => {
      if ("pos" in $$props2)
        $$invalidate(0, pos = $$props2.pos);
      if ("$$scope" in $$props2)
        $$invalidate(3, $$scope = $$props2.$$scope);
    };
    return [
      pos,
      active,
      dispatch,
      $$scope,
      slots,
      dragstart_handler,
      drag_handler,
      dragend_handler
    ];
  }
  var Thumb = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance, create_fragment, safe_not_equal, { pos: 0 });
    }
  };
  var thumb_default = Thumb;

  // src/3rd/rangeslider.svelte
  var get_left_slot_changes = (dirty2) => ({});
  var get_left_slot_context = (ctx) => ({});
  function fallback_block_1(ctx) {
    let div;
    return {
      c() {
        div = element("div");
        attr(div, "class", "thumb");
      },
      m(target, anchor) {
        insert(target, div, anchor);
      },
      p: noop,
      d(detaching) {
        if (detaching)
          detach(div);
      }
    };
  }
  function fallback_block(ctx) {
    let current;
    const default_slot_template = (
      /*#slots*/
      ctx[10].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[13],
      null
    );
    const default_slot_or_fallback = default_slot || fallback_block_1(ctx);
    return {
      c() {
        if (default_slot_or_fallback)
          default_slot_or_fallback.c();
      },
      m(target, anchor) {
        if (default_slot_or_fallback) {
          default_slot_or_fallback.m(target, anchor);
        }
        current = true;
      },
      p(ctx2, dirty2) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty2 & /*$$scope*/
          8192)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[13],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[13]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[13],
                dirty2,
                null
              ),
              null
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot_or_fallback, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot_or_fallback, local);
        current = false;
      },
      d(detaching) {
        if (default_slot_or_fallback)
          default_slot_or_fallback.d(detaching);
      }
    };
  }
  function create_default_slot(ctx) {
    let current;
    const left_slot_template = (
      /*#slots*/
      ctx[10].left
    );
    const left_slot = create_slot(
      left_slot_template,
      ctx,
      /*$$scope*/
      ctx[13],
      get_left_slot_context
    );
    const left_slot_or_fallback = left_slot || fallback_block(ctx);
    return {
      c() {
        if (left_slot_or_fallback)
          left_slot_or_fallback.c();
      },
      m(target, anchor) {
        if (left_slot_or_fallback) {
          left_slot_or_fallback.m(target, anchor);
        }
        current = true;
      },
      p(ctx2, dirty2) {
        if (left_slot) {
          if (left_slot.p && (!current || dirty2 & /*$$scope*/
          8192)) {
            update_slot_base(
              left_slot,
              left_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[13],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[13]
              ) : get_slot_changes(
                left_slot_template,
                /*$$scope*/
                ctx2[13],
                dirty2,
                get_left_slot_changes
              ),
              get_left_slot_context
            );
          }
        } else {
          if (left_slot_or_fallback && left_slot_or_fallback.p && (!current || dirty2 & /*$$scope*/
          8192)) {
            left_slot_or_fallback.p(ctx2, !current ? -1 : dirty2);
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(left_slot_or_fallback, local);
        current = true;
      },
      o(local) {
        transition_out(left_slot_or_fallback, local);
        current = false;
      },
      d(detaching) {
        if (left_slot_or_fallback)
          left_slot_or_fallback.d(detaching);
      }
    };
  }
  function create_fragment2(ctx) {
    let input;
    let input_value_value;
    let input_name_value;
    let t0;
    let div1;
    let div0;
    let t1;
    let thumb;
    let updating_pos;
    let current;
    function thumb_pos_binding(value) {
      ctx[11](value);
    }
    let thumb_props = {
      $$slots: { default: [create_default_slot] },
      $$scope: { ctx }
    };
    if (
      /*pos*/
      ctx[2][0] !== void 0
    ) {
      thumb_props.pos = /*pos*/
      ctx[2][0];
    }
    thumb = new thumb_default({ props: thumb_props });
    binding_callbacks.push(() => bind(thumb, "pos", thumb_pos_binding));
    thumb.$on(
      "active",
      /*active_handler*/
      ctx[12]
    );
    return {
      c() {
        input = element("input");
        t0 = space();
        div1 = element("div");
        div0 = element("div");
        t1 = space();
        create_component(thumb.$$.fragment);
        attr(input, "type", "number");
        input.value = input_value_value = /*value*/
        ctx[0][0];
        attr(input, "name", input_name_value = /*name*/
        ctx[1][0]);
        attr(input, "class", "svelte-1nnnvg0");
        attr(div0, "class", "progress");
        attr(
          div0,
          "style",
          /*progress*/
          ctx[4]
        );
        attr(div1, "class", "track");
      },
      m(target, anchor) {
        insert(target, input, anchor);
        insert(target, t0, anchor);
        insert(target, div1, anchor);
        append(div1, div0);
        append(div1, t1);
        mount_component(thumb, div1, null);
        current = true;
      },
      p(ctx2, [dirty2]) {
        if (!current || dirty2 & /*value*/
        1 && input_value_value !== (input_value_value = /*value*/
        ctx2[0][0]) && input.value !== input_value_value) {
          input.value = input_value_value;
        }
        if (!current || dirty2 & /*name*/
        2 && input_name_value !== (input_name_value = /*name*/
        ctx2[1][0])) {
          attr(input, "name", input_name_value);
        }
        if (!current || dirty2 & /*progress*/
        16) {
          attr(
            div0,
            "style",
            /*progress*/
            ctx2[4]
          );
        }
        const thumb_changes = {};
        if (dirty2 & /*$$scope*/
        8192) {
          thumb_changes.$$scope = { dirty: dirty2, ctx: ctx2 };
        }
        if (!updating_pos && dirty2 & /*pos*/
        4) {
          updating_pos = true;
          thumb_changes.pos = /*pos*/
          ctx2[2][0];
          add_flush_callback(() => updating_pos = false);
        }
        thumb.$set(thumb_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(thumb.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(thumb.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(input);
        if (detaching)
          detach(t0);
        if (detaching)
          detach(div1);
        destroy_component(thumb);
      }
    };
  }
  function checkPos(pos) {
    return [Math.min(...pos), Math.max(...pos)];
  }
  function instance2($$self, $$props, $$invalidate) {
    let progress;
    let { $$slots: slots = {}, $$scope } = $$props;
    const dispatch = createEventDispatcher();
    let { name: name2 = [] } = $$props;
    let { range = false } = $$props;
    let { min = 0 } = $$props;
    let { max = 100 } = $$props;
    let { step = 1 } = $$props;
    let { value = [min, max] } = $$props;
    let pos;
    let active = false;
    let { order = false } = $$props;
    function setValue(pos2) {
      const offset = min % step;
      const width3 = max - min;
      $$invalidate(0, value = pos2.map((v) => min + v * width3).map((v) => Math.round((v - offset) / step) * step + offset));
      dispatch("input", value);
    }
    function setPos(value2) {
      $$invalidate(2, pos = value2.map((v) => Math.min(Math.max(v, min), max)).map((v) => (v - min) / (max - min)));
    }
    function clamp() {
      setPos(value);
      setValue(pos);
    }
    function thumb_pos_binding(value2) {
      if ($$self.$$.not_equal(pos[0], value2)) {
        pos[0] = value2;
        $$invalidate(2, pos), $$invalidate(5, range), $$invalidate(9, order), $$invalidate(3, active);
      }
    }
    const active_handler = ({ detail: v }) => $$invalidate(3, active = v);
    $$self.$$set = ($$props2) => {
      if ("name" in $$props2)
        $$invalidate(1, name2 = $$props2.name);
      if ("range" in $$props2)
        $$invalidate(5, range = $$props2.range);
      if ("min" in $$props2)
        $$invalidate(6, min = $$props2.min);
      if ("max" in $$props2)
        $$invalidate(7, max = $$props2.max);
      if ("step" in $$props2)
        $$invalidate(8, step = $$props2.step);
      if ("value" in $$props2)
        $$invalidate(0, value = $$props2.value);
      if ("order" in $$props2)
        $$invalidate(9, order = $$props2.order);
      if ("$$scope" in $$props2)
        $$invalidate(13, $$scope = $$props2.$$scope);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*range, order, active, pos*/
      556) {
        $:
          if (range && order && active)
            $$invalidate(2, pos = checkPos(pos));
      }
      if ($$self.$$.dirty & /*active, pos*/
      12) {
        $:
          if (active)
            setValue(pos);
      }
      if ($$self.$$.dirty & /*active, value*/
      9) {
        $:
          if (!active)
            setPos(value);
      }
      if ($$self.$$.dirty & /*min, max*/
      192) {
        $:
          min, max, clamp();
      }
      if ($$self.$$.dirty & /*range, pos*/
      36) {
        $:
          $$invalidate(4, progress = `
    left: ${range ? Math.min(pos[0], pos[1]) * 100 : 0}%;
    right: ${100 - Math.max(pos[0], range ? pos[1] : pos[0]) * 100}%;
  `);
      }
    };
    return [
      value,
      name2,
      pos,
      active,
      progress,
      range,
      min,
      max,
      step,
      order,
      slots,
      thumb_pos_binding,
      active_handler,
      $$scope
    ];
  }
  var Rangeslider = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance2, create_fragment2, safe_not_equal, {
        name: 1,
        range: 5,
        min: 6,
        max: 7,
        step: 8,
        value: 0,
        order: 9
      });
    }
  };
  var rangeslider_default = Rangeslider;

  // src/toolbar.svelte
  function create_if_block(ctx) {
    let t0_value = (
      /*value*/
      (ctx[0][0] / 60).toFixed(2) + ""
    );
    let t0;
    let t1;
    return {
      c() {
        t0 = text(t0_value);
        t1 = text("\xB0");
      },
      m(target, anchor) {
        insert(target, t0, anchor);
        insert(target, t1, anchor);
      },
      p(ctx2, dirty2) {
        if (dirty2 & /*value*/
        1 && t0_value !== (t0_value = /*value*/
        (ctx2[0][0] / 60).toFixed(2) + ""))
          set_data(t0, t0_value);
      },
      d(detaching) {
        if (detaching)
          detach(t0);
        if (detaching)
          detach(t1);
      }
    };
  }
  function create_fragment3(ctx) {
    let button0;
    let t0;
    let button0_disabled_value;
    let t1;
    let button1;
    let t3;
    let button2;
    let t5;
    let button3;
    let t6;
    let t7;
    let br;
    let t8;
    let button4;
    let t10;
    let t11;
    let button5;
    let t12_value = (
      /*$verticalstrip*/
      ctx[1] == 6 ? "\u5357\u85CF" : "\u5317\u85CF"
    );
    let t12;
    let t13;
    let t14;
    let slider;
    let updating_value;
    let current;
    let mounted;
    let dispose;
    let if_block = (
      /*value*/
      ctx[0][0] && create_if_block(ctx)
    );
    function slider_value_binding(value) {
      ctx[11](value);
    }
    let slider_props = { min: -240, max: 240 };
    if (
      /*value*/
      ctx[0] !== void 0
    ) {
      slider_props.value = /*value*/
      ctx[0];
    }
    slider = new rangeslider_default({ props: slider_props });
    binding_callbacks.push(() => bind(slider, "value", slider_value_binding));
    return {
      c() {
        button0 = element("button");
        t0 = text("\u{1F4BE}");
        t1 = space();
        button1 = element("button");
        button1.textContent = "\u2796";
        t3 = space();
        button2 = element("button");
        button2.textContent = "\u267B\uFE0F";
        t5 = space();
        button3 = element("button");
        t6 = text("\u{1F4D0}");
        t7 = space();
        br = element("br");
        t8 = space();
        button4 = element("button");
        button4.textContent = "\u{1F441}";
        t10 = text(
          /*$totalframe*/
          ctx[3]
        );
        t11 = text("\u6298\n");
        button5 = element("button");
        t12 = text(t12_value);
        t13 = space();
        if (if_block)
          if_block.c();
        t14 = space();
        create_component(slider.$$.fragment);
        attr(button0, "title", "Alt S, Save");
        button0.disabled = button0_disabled_value = !/*$dirty*/
        ctx[2];
        attr(button1, "title", "Alt F, Remove Frame");
        attr(button2, "title", "Alt R, Reset Frame");
        attr(button3, "title", "Alt L, Load Frame Setting");
        button3.disabled = /*$dirty*/
        ctx[2];
        attr(button4, "title", "Alt V, \u9810\u89BD");
        attr(button5, "title", "\u6C38\u6A02\u5357\u5317\u85CF\u5207\u63DB");
      },
      m(target, anchor) {
        insert(target, button0, anchor);
        append(button0, t0);
        insert(target, t1, anchor);
        insert(target, button1, anchor);
        insert(target, t3, anchor);
        insert(target, button2, anchor);
        insert(target, t5, anchor);
        insert(target, button3, anchor);
        append(button3, t6);
        insert(target, t7, anchor);
        insert(target, br, anchor);
        insert(target, t8, anchor);
        insert(target, button4, anchor);
        insert(target, t10, anchor);
        insert(target, t11, anchor);
        insert(target, button5, anchor);
        append(button5, t12);
        insert(target, t13, anchor);
        if (if_block)
          if_block.m(target, anchor);
        insert(target, t14, anchor);
        mount_component(slider, target, anchor);
        current = true;
        if (!mounted) {
          dispose = [
            listen(
              window,
              "keydown",
              /*handleKeydown*/
              ctx[4]
            ),
            listen(button0, "click", save),
            listen(
              button1,
              "click",
              /*deleteframe*/
              ctx[6]
            ),
            listen(
              button2,
              "click",
              /*reset*/
              ctx[5]
            ),
            listen(button3, "click", load),
            listen(
              button4,
              "click",
              /*togglepreview*/
              ctx[8]
            ),
            listen(
              button5,
              "click",
              /*toggleNanzang*/
              ctx[7]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, [dirty2]) {
        if (!current || dirty2 & /*$dirty*/
        4 && button0_disabled_value !== (button0_disabled_value = !/*$dirty*/
        ctx2[2])) {
          button0.disabled = button0_disabled_value;
        }
        if (!current || dirty2 & /*$dirty*/
        4) {
          button3.disabled = /*$dirty*/
          ctx2[2];
        }
        if (!current || dirty2 & /*$totalframe*/
        8)
          set_data(
            t10,
            /*$totalframe*/
            ctx2[3]
          );
        if ((!current || dirty2 & /*$verticalstrip*/
        2) && t12_value !== (t12_value = /*$verticalstrip*/
        ctx2[1] == 6 ? "\u5357\u85CF" : "\u5317\u85CF"))
          set_data(t12, t12_value);
        if (
          /*value*/
          ctx2[0][0]
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty2);
          } else {
            if_block = create_if_block(ctx2);
            if_block.c();
            if_block.m(t14.parentNode, t14);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
        const slider_changes = {};
        if (!updating_value && dirty2 & /*value*/
        1) {
          updating_value = true;
          slider_changes.value = /*value*/
          ctx2[0];
          add_flush_callback(() => updating_value = false);
        }
        slider.$set(slider_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(slider.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(slider.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(button0);
        if (detaching)
          detach(t1);
        if (detaching)
          detach(button1);
        if (detaching)
          detach(t3);
        if (detaching)
          detach(button2);
        if (detaching)
          detach(t5);
        if (detaching)
          detach(button3);
        if (detaching)
          detach(t7);
        if (detaching)
          detach(br);
        if (detaching)
          detach(t8);
        if (detaching)
          detach(button4);
        if (detaching)
          detach(t10);
        if (detaching)
          detach(t11);
        if (detaching)
          detach(button5);
        if (detaching)
          detach(t13);
        if (if_block)
          if_block.d(detaching);
        if (detaching)
          detach(t14);
        destroy_component(slider, detaching);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function instance3($$self, $$props, $$invalidate) {
    let $activeimageurl;
    let $rotateangle;
    let $showpreview;
    let $verticalstrip;
    let $frames;
    let $pageframe;
    let $ratio;
    let $dirty;
    let $selectedframe;
    let $images;
    let $nimage;
    let $totalframe;
    component_subscribe($$self, activeimageurl, ($$value) => $$invalidate(9, $activeimageurl = $$value));
    component_subscribe($$self, rotateangle, ($$value) => $$invalidate(10, $rotateangle = $$value));
    component_subscribe($$self, showpreview, ($$value) => $$invalidate(12, $showpreview = $$value));
    component_subscribe($$self, verticalstrip, ($$value) => $$invalidate(1, $verticalstrip = $$value));
    component_subscribe($$self, frames, ($$value) => $$invalidate(13, $frames = $$value));
    component_subscribe($$self, pageframe, ($$value) => $$invalidate(14, $pageframe = $$value));
    component_subscribe($$self, ratio, ($$value) => $$invalidate(15, $ratio = $$value));
    component_subscribe($$self, dirty, ($$value) => $$invalidate(2, $dirty = $$value));
    component_subscribe($$self, selectedframe, ($$value) => $$invalidate(16, $selectedframe = $$value));
    component_subscribe($$self, images, ($$value) => $$invalidate(17, $images = $$value));
    component_subscribe($$self, nimage, ($$value) => $$invalidate(18, $nimage = $$value));
    component_subscribe($$self, totalframe, ($$value) => $$invalidate(3, $totalframe = $$value));
    let value = [get_store_value(rotateangle), 0];
    const previmage = () => {
      let n = $nimage;
      n--;
      if (n < 0)
        n = 0;
      selectimage(n);
    };
    const nextimage = () => {
      let n = $nimage;
      n++;
      if (n >= $images?.length)
        n = $images?.length - 1;
      selectimage(n);
    };
    function handleFrameMove(evt) {
      const key = evt.key.toLowerCase();
      const alt = evt.altKey;
      const ctrl = evt.ctrlKey;
      let dy = 0, dx = 0, xinc = 0, yinc = 0;
      if (key == "arrowup")
        dy = -1;
      if (key == "arrowdown")
        dy = 1;
      if (key == "arrowleft")
        dx = -1;
      if (key == "arrowright")
        dx = 1;
      if (alt) {
        dx *= 1;
        dy *= 1;
      } else {
        dx *= 2;
        dy *= 2;
      }
      if (ctrl) {
        xinc += dx;
        yinc += dy;
        dx = 0, dy = 0;
      }
      const frms = $frames;
      const sel = $selectedframe;
      for (let i = 0; i < frms.length; i++) {
        let [x, y, w, h] = frms[i];
        x += dx;
        y += dy;
        if (1 << i & sel || !sel) {
          frms[i] = [x, y, w + xinc, h + yinc];
        }
      }
      frames.set(frms);
    }
    function handlePreviewKeydown(evt) {
      const key = evt.key.toLowerCase();
      if (key == "arrowdown" || key == "arrowup" || key == "arrowright" || key == "arrowleft") {
        if (key == "arrowright") {
          get_store_value(swiper).nextItem();
        } else if (key == "arrowleft") {
          get_store_value(swiper).prevItem();
        } else if (key == "arrowup") {
          get_store_value(swiper).goLast();
        } else {
          get_store_value(swiper).goTo(0);
        }
        evt.preventDefault();
      }
    }
    function handleKeydown(evt) {
      const key = evt.key.toLowerCase();
      const alt = evt.altKey;
      if (key == "f5") {
        evt.preventDefault();
        return;
      } else if (get_store_value(swiper)) {
        return handlePreviewKeydown(evt);
      } else if (key == "0" || key == "1" || key == "2" || key == "3") {
        let f = parseInt(key);
        if (f == 3)
          f = 4;
        selectedframe.set(f);
        evt.preventDefault();
      } else if (alt && key == "n" || key == "enter") {
        nextimage();
        evt.preventDefault();
      } else if (alt && key == "p") {
        previmage();
        ;
        evt.preventDefault();
      } else if (alt && key == "o") {
        openImageFiles();
        evt.preventDefault();
      } else if (alt && key == "f" && !$dirty) {
        getFolder();
        ;
        evt.preventDefault();
      } else if (alt && key == "r") {
        reset();
        ;
        evt.preventDefault();
      } else if (alt && key == "s" && $dirty) {
        save();
        ;
        evt.preventDefault();
      } else if (alt && key == "l" && !$dirty) {
        load();
        ;
        evt.preventDefault();
      } else if (alt && key == "d") {
        deleteframe();
        evt.preventDefault();
      } else if (alt && key == "v") {
        togglepreview();
        evt.preventDefault();
      }
      if (evt.srcElement.nodeName == "INPUT" || evt.srcElement.nodeName == "TEXTAREA" || evt.srcElement.nodeName == "BUTTON")
        return;
      if (key == "arrowdown" || key == "arrowup" || key == "arrowright" || key == "arrowleft") {
        handleFrameMove(evt);
        evt.preventDefault();
      }
    }
    const reset = () => {
      const frms = [];
      const r3 = $ratio;
      for (let i = 0; i < $pageframe; i++) {
        frms.push(defaultframe(i));
      }
      frames.set(frms.map((f) => resizeframe(f, r3)));
    };
    const deleteframe = () => {
      const frms = $frames;
      frms.shift();
      frames.set(frms);
      selectedframe.set(0);
    };
    const toggleNanzang = () => {
      if ($verticalstrip == 6) {
        setTemplate("beizang");
      } else {
        setTemplate("nanzang");
      }
    };
    const togglepreview = () => {
      selectimage(0);
      showpreview.set(!$showpreview);
    };
    function slider_value_binding(value$1) {
      value = value$1;
      $$invalidate(0, value), $$invalidate(10, $rotateangle), $$invalidate(9, $activeimageurl);
    }
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*$rotateangle, $activeimageurl*/
      1536) {
        $:
          $$invalidate(0, value[0] = $rotateangle, value), $activeimageurl;
      }
      if ($$self.$$.dirty & /*value*/
      1) {
        $:
          rotateangle.set(value[0]);
      }
    };
    return [
      value,
      $verticalstrip,
      $dirty,
      $totalframe,
      handleKeydown,
      reset,
      deleteframe,
      toggleNanzang,
      togglepreview,
      $activeimageurl,
      $rotateangle,
      slider_value_binding
    ];
  }
  var Toolbar = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance3, create_fragment3, safe_not_equal, {});
    }
  };
  var toolbar_default = Toolbar;

  // src/cropper.svelte
  function get_each_context(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[13] = list[i];
    child_ctx[15] = i;
    return child_ctx;
  }
  function get_each_context_1(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[13] = list[i];
    child_ctx[15] = i;
    return child_ctx;
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
        ctx[15] * /*w*/
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
        attr(rect, "class", rect_class_value = null_to_empty("vstrip" + /*frameidx*/
        (ctx[11] * /*verticalstrip*/
        ctx[7] + /*idx*/
        ctx[15]) % 2) + " svelte-3np62r");
      },
      m(target, anchor) {
        insert(target, rect, anchor);
      },
      p(ctx2, dirty2) {
        if (dirty2 & /*x, w, verticalstrip*/
        138 && rect_x_value !== (rect_x_value = /*x*/
        ctx2[1] + /*idx*/
        ctx2[15] * /*w*/
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
        if (dirty2 & /*frameidx, verticalstrip*/
        2176 && rect_class_value !== (rect_class_value = null_to_empty("vstrip" + /*frameidx*/
        (ctx2[11] * /*verticalstrip*/
        ctx2[7] + /*idx*/
        ctx2[15]) % 2) + " svelte-3np62r")) {
          attr(rect, "class", rect_class_value);
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
        (ctx[15] + 1) * /*h*/
        (ctx[4] / /*horizontalstrip*/
        ctx[8]));
        attr(line, "x2", line_x__value = /*x*/
        ctx[1] + /*w*/
        ctx[3]);
        attr(line, "y2", line_y__value_1 = /*y*/
        ctx[2] + /*idx*/
        (ctx[15] + 1) * /*h*/
        (ctx[4] / /*horizontalstrip*/
        ctx[8]));
        attr(line, "class", "hstrip svelte-3np62r");
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
        (ctx2[15] + 1) * /*h*/
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
        (ctx2[15] + 1) * /*h*/
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
  function create_fragment4(ctx) {
    let g;
    let text0;
    let t0;
    let text0_y_value;
    let text1;
    let t1_value = (
      /*h*/
      (ctx[4] / /*w*/
      ctx[3]).toFixed(2) + ""
    );
    let t1;
    let text1_x_value;
    let text1_y_value;
    let text2;
    let t2_value = Math.floor(
      /*x*/
      ctx[1] / /*r*/
      ctx[5]
    ) + "";
    let t2;
    let t3;
    let t4_value = Math.floor(
      /*y*/
      ctx[2] / /*r*/
      ctx[5]
    ) + "";
    let t4;
    let t5;
    let t6_value = Math.floor(
      /*w*/
      ctx[3] / /*r*/
      ctx[5]
    ) + "";
    let t6;
    let t7;
    let t8_value = Math.floor(
      /*h*/
      ctx[4] / /*r*/
      ctx[5]
    ) + "";
    let t8;
    let text2_x_value;
    let text2_y_value;
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
        text0 = svg_element("text");
        t0 = text(
          /*caption*/
          ctx[6]
        );
        text1 = svg_element("text");
        t1 = text(t1_value);
        text2 = svg_element("text");
        t2 = text(t2_value);
        t3 = text(",");
        t4 = text(t4_value);
        t5 = text(":");
        t6 = text(t6_value);
        t7 = text(",");
        t8 = text(t8_value);
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
          text0,
          "x",
          /*x*/
          ctx[1]
        );
        attr(text0, "y", text0_y_value = /*y*/
        ctx[2] - 5);
        attr(text0, "class", "caption svelte-3np62r");
        toggle_class(
          text0,
          "selected",
          /*selected*/
          ctx[12]
        );
        attr(text1, "x", text1_x_value = /*x*/
        ctx[1] + 20);
        attr(text1, "y", text1_y_value = /*y*/
        ctx[2] - 5);
        attr(text1, "class", "ratio svelte-3np62r");
        toggle_class(
          text1,
          "selected",
          /*selected*/
          ctx[12]
        );
        attr(text2, "x", text2_x_value = /*x*/
        ctx[1] + 80);
        attr(text2, "y", text2_y_value = /*y*/
        ctx[2] - 5);
        attr(text2, "class", "pointerpos svelte-3np62r");
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
        attr(rect0, "class", "step svelte-3np62r");
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
        attr(rect1, "class", "grip svelte-3np62r");
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
        attr(rect2, "class", "gripx svelte-3np62r");
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
        attr(rect3, "class", "grip svelte-3np62r");
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
        attr(rect4, "class", "gripy svelte-3np62r");
        toggle_class(
          rect4,
          "active",
          /*expanding*/
          ctx[0] == "bottom"
        );
      },
      m(target, anchor) {
        insert(target, g, anchor);
        append(g, text0);
        append(text0, t0);
        append(g, text1);
        append(text1, t1);
        append(g, text2);
        append(text2, t2);
        append(text2, t3);
        append(text2, t4);
        append(text2, t5);
        append(text2, t6);
        append(text2, t7);
        append(text2, t8);
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
            t0,
            /*caption*/
            ctx[6]
          );
        if (dirty2 & /*x*/
        2) {
          attr(
            text0,
            "x",
            /*x*/
            ctx[1]
          );
        }
        if (dirty2 & /*y*/
        4 && text0_y_value !== (text0_y_value = /*y*/
        ctx[2] - 5)) {
          attr(text0, "y", text0_y_value);
        }
        if (dirty2 & /*selected*/
        4096) {
          toggle_class(
            text0,
            "selected",
            /*selected*/
            ctx[12]
          );
        }
        if (dirty2 & /*h, w*/
        24 && t1_value !== (t1_value = /*h*/
        (ctx[4] / /*w*/
        ctx[3]).toFixed(2) + ""))
          set_data(t1, t1_value);
        if (dirty2 & /*x*/
        2 && text1_x_value !== (text1_x_value = /*x*/
        ctx[1] + 20)) {
          attr(text1, "x", text1_x_value);
        }
        if (dirty2 & /*y*/
        4 && text1_y_value !== (text1_y_value = /*y*/
        ctx[2] - 5)) {
          attr(text1, "y", text1_y_value);
        }
        if (dirty2 & /*selected*/
        4096) {
          toggle_class(
            text1,
            "selected",
            /*selected*/
            ctx[12]
          );
        }
        if (dirty2 & /*x, r*/
        34 && t2_value !== (t2_value = Math.floor(
          /*x*/
          ctx[1] / /*r*/
          ctx[5]
        ) + ""))
          set_data(t2, t2_value);
        if (dirty2 & /*y, r*/
        36 && t4_value !== (t4_value = Math.floor(
          /*y*/
          ctx[2] / /*r*/
          ctx[5]
        ) + ""))
          set_data(t4, t4_value);
        if (dirty2 & /*w, r*/
        40 && t6_value !== (t6_value = Math.floor(
          /*w*/
          ctx[3] / /*r*/
          ctx[5]
        ) + ""))
          set_data(t6, t6_value);
        if (dirty2 & /*h, r*/
        48 && t8_value !== (t8_value = Math.floor(
          /*h*/
          ctx[4] / /*r*/
          ctx[5]
        ) + ""))
          set_data(t8, t8_value);
        if (dirty2 & /*x*/
        2 && text2_x_value !== (text2_x_value = /*x*/
        ctx[1] + 80)) {
          attr(text2, "x", text2_x_value);
        }
        if (dirty2 & /*y*/
        4 && text2_y_value !== (text2_y_value = /*y*/
        ctx[2] - 5)) {
          attr(text2, "y", text2_y_value);
        }
        if (dirty2 & /*x, w, verticalstrip, y, h, frameidx*/
        2206) {
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
        destroy_each(each_blocks_1, detaching);
        destroy_each(each_blocks, detaching);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  var grabberWidth = 8;
  var grabberHeight = 8;
  function instance4($$self, $$props, $$invalidate) {
    let { expanding } = $$props;
    let { x = 0 } = $$props;
    let { y = 0 } = $$props;
    let { w = 50 } = $$props;
    let { h = 50 } = $$props;
    let { r: r3 } = $$props;
    let { caption: caption2 = "" } = $$props;
    let { verticalstrip: verticalstrip2 = 5 } = $$props;
    let { horizontalstrip: horizontalstrip2 = 17 } = $$props;
    let { nframe = 0 } = $$props;
    let { startExpand } = $$props;
    let { frameidx = 0 } = $$props;
    let { selected = false } = $$props;
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
        $$invalidate(5, r3 = $$props2.r);
      if ("caption" in $$props2)
        $$invalidate(6, caption2 = $$props2.caption);
      if ("verticalstrip" in $$props2)
        $$invalidate(7, verticalstrip2 = $$props2.verticalstrip);
      if ("horizontalstrip" in $$props2)
        $$invalidate(8, horizontalstrip2 = $$props2.horizontalstrip);
      if ("nframe" in $$props2)
        $$invalidate(9, nframe = $$props2.nframe);
      if ("startExpand" in $$props2)
        $$invalidate(10, startExpand = $$props2.startExpand);
      if ("frameidx" in $$props2)
        $$invalidate(11, frameidx = $$props2.frameidx);
      if ("selected" in $$props2)
        $$invalidate(12, selected = $$props2.selected);
    };
    return [
      expanding,
      x,
      y,
      w,
      h,
      r3,
      caption2,
      verticalstrip2,
      horizontalstrip2,
      nframe,
      startExpand,
      frameidx,
      selected
    ];
  }
  var Cropper = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance4, create_fragment4, safe_not_equal, {
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
        startExpand: 10,
        frameidx: 11,
        selected: 12
      });
    }
  };
  var cropper_default = Cropper;

  // src/croppers.svelte
  function get_each_context2(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[21] = list[i];
    child_ctx[23] = i;
    return child_ctx;
  }
  function create_each_block2(ctx) {
    let cropper;
    let updating_expanding;
    let current;
    function cropper_expanding_binding(value) {
      ctx[14](value);
    }
    let cropper_props = {
      x: (
        /*frame*/
        ctx[21][0]
      ),
      y: (
        /*frame*/
        ctx[21][1]
      ),
      w: (
        /*frame*/
        ctx[21][2]
      ),
      h: (
        /*frame*/
        ctx[21][3]
      ),
      selected: (
        /*$selectedframe*/
        ctx[7] & 1 << /*idx*/
        ctx[23]
      ),
      verticalstrip: (
        /*$verticalstrip*/
        ctx[8]
      ),
      horizontalstrip: (
        /*$horizontalstrip*/
        ctx[9]
      ),
      r: (
        /*r*/
        ctx[3]
      ),
      nframe: (
        /*idx*/
        ctx[23]
      ),
      startExpand: (
        /*startExpand*/
        ctx[10]
      ),
      caption: (
        /*start*/
        ctx[2] + /*idx*/
        ctx[23]
      ),
      frameidx: (
        /*idx*/
        ctx[23]
      )
    };
    if (
      /*expanding*/
      ctx[4] !== void 0
    ) {
      cropper_props.expanding = /*expanding*/
      ctx[4];
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
        if (dirty2 & /*theframes*/
        64)
          cropper_changes.x = /*frame*/
          ctx2[21][0];
        if (dirty2 & /*theframes*/
        64)
          cropper_changes.y = /*frame*/
          ctx2[21][1];
        if (dirty2 & /*theframes*/
        64)
          cropper_changes.w = /*frame*/
          ctx2[21][2];
        if (dirty2 & /*theframes*/
        64)
          cropper_changes.h = /*frame*/
          ctx2[21][3];
        if (dirty2 & /*$selectedframe*/
        128)
          cropper_changes.selected = /*$selectedframe*/
          ctx2[7] & 1 << /*idx*/
          ctx2[23];
        if (dirty2 & /*$verticalstrip*/
        256)
          cropper_changes.verticalstrip = /*$verticalstrip*/
          ctx2[8];
        if (dirty2 & /*$horizontalstrip*/
        512)
          cropper_changes.horizontalstrip = /*$horizontalstrip*/
          ctx2[9];
        if (dirty2 & /*r*/
        8)
          cropper_changes.r = /*r*/
          ctx2[3];
        if (dirty2 & /*start*/
        4)
          cropper_changes.caption = /*start*/
          ctx2[2] + /*idx*/
          ctx2[23];
        if (!updating_expanding && dirty2 & /*expanding*/
        16) {
          updating_expanding = true;
          cropper_changes.expanding = /*expanding*/
          ctx2[4];
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
      /*theframes*/
      ctx[6]
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
        ctx[1] + " " + /*height*/
        ctx[0]);
        attr(
          svg,
          "height",
          /*height*/
          ctx[0]
        );
        attr(
          svg,
          "width",
          /*width*/
          ctx[1]
        );
        attr(svg, "class", "svelte-4qb2td");
        toggle_class(
          svg,
          "expanding",
          /*expanding*/
          ctx[4]
        );
      },
      m(target, anchor) {
        insert(target, svg, anchor);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(svg, null);
          }
        }
        ctx[15](svg);
        current = true;
        if (!mounted) {
          dispose = listen(
            svg,
            "mousemove",
            /*expand*/
            ctx[12]
          );
          mounted = true;
        }
      },
      p(ctx2, dirty2) {
        if (dirty2 & /*theframes, $selectedframe, $verticalstrip, $horizontalstrip, r, startExpand, start, expanding*/
        2012) {
          each_value = /*theframes*/
          ctx2[6];
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
        3 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*width*/
        ctx2[1] + " " + /*height*/
        ctx2[0])) {
          attr(svg, "viewBox", svg_viewBox_value);
        }
        if (!current || dirty2 & /*height*/
        1) {
          attr(
            svg,
            "height",
            /*height*/
            ctx2[0]
          );
        }
        if (!current || dirty2 & /*width*/
        2) {
          attr(
            svg,
            "width",
            /*width*/
            ctx2[1]
          );
        }
        if (!current || dirty2 & /*expanding*/
        16) {
          toggle_class(
            svg,
            "expanding",
            /*expanding*/
            ctx2[4]
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
        ctx[15](null);
        mounted = false;
        dispose();
      }
    };
  }
  function create_fragment5(ctx) {
    let div;
    let previous_key = (
      /*theframes*/
      ctx[6]
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
        set_style(div, "z-index", "199");
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
            ctx[11]
          );
          mounted = true;
        }
      },
      p(ctx2, [dirty2]) {
        if (dirty2 & /*theframes*/
        64 && safe_not_equal(previous_key, previous_key = /*theframes*/
        ctx2[6])) {
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
  function instance5($$self, $$props, $$invalidate) {
    let theframes;
    let $selectedframe;
    let $frames;
    let $verticalstrip;
    let $horizontalstrip;
    component_subscribe($$self, selectedframe, ($$value) => $$invalidate(7, $selectedframe = $$value));
    component_subscribe($$self, frames, ($$value) => $$invalidate(13, $frames = $$value));
    component_subscribe($$self, verticalstrip, ($$value) => $$invalidate(8, $verticalstrip = $$value));
    component_subscribe($$self, horizontalstrip, ($$value) => $$invalidate(9, $horizontalstrip = $$value));
    let { height: height3 = 2e3 } = $$props;
    let { width: width3 = 2e3 } = $$props;
    let { start = "" } = $$props;
    let { r: r3 = 1 } = $$props;
    let expanding = null;
    let startx, starty, initial = {}, nframe = 0;
    function startExpand(type, _nframe, event) {
      nframe = _nframe;
      $$invalidate(4, expanding = type);
      startx = event.pageX;
      starty = event.pageY;
      const [x, y, w, h] = theframes[nframe];
      initial = { x, y, w, h };
    }
    let svg1;
    const insideSvg = (ele) => {
      if (!svg1)
        return;
      while (ele) {
        if (ele == document.body || ele == svg1)
          break;
        ele = ele.parentElement;
      }
      return ele == svg1;
    };
    function stopExpand(evt) {
      $$invalidate(4, expanding = null);
      const sel = $selectedframe;
      if (!insideSvg(evt.srcElement))
        return;
      const deltax = evt.pageX - startx;
      const deltay = evt.pageY - starty;
      const mask = 1 << nframe;
      if (Math.abs(deltax) + Math.abs(deltay) < 5 && sel & mask) {
        selectedframe.set(0);
      } else {
        selectedframe.set(mask);
      }
      frames.set(theframes);
      startx = 0, starty = 0;
    }
    function expand(event) {
      if (!expanding)
        return;
      let [x, y, w, h] = theframes[nframe];
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
      $$invalidate(6, theframes[nframe] = [x, y, w, h], theframes);
    }
    function cropper_expanding_binding(value) {
      expanding = value;
      $$invalidate(4, expanding);
    }
    function svg_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        svg1 = $$value;
        $$invalidate(5, svg1);
      });
    }
    $$self.$$set = ($$props2) => {
      if ("height" in $$props2)
        $$invalidate(0, height3 = $$props2.height);
      if ("width" in $$props2)
        $$invalidate(1, width3 = $$props2.width);
      if ("start" in $$props2)
        $$invalidate(2, start = $$props2.start);
      if ("r" in $$props2)
        $$invalidate(3, r3 = $$props2.r);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*$frames*/
      8192) {
        $:
          $$invalidate(6, theframes = $frames || []);
      }
    };
    return [
      height3,
      width3,
      start,
      r3,
      expanding,
      svg1,
      theframes,
      $selectedframe,
      $verticalstrip,
      $horizontalstrip,
      startExpand,
      stopExpand,
      expand,
      $frames,
      cropper_expanding_binding,
      svg_binding
    ];
  }
  var Croppers = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance5, create_fragment5, safe_not_equal, { height: 0, width: 1, start: 2, r: 3 });
    }
  };
  var croppers_default = Croppers;

  // src/help.svelte
  function create_fragment6(ctx) {
    let pre;
    return {
      c() {
        pre = element("pre");
        pre.innerHTML = `<span class="title svelte-1vigaic">FolioCrop\u5716\u6846\u88C1\u5207</span> 2023.7.16<a href="https://youtu.be/YxdzYUatZvI" target="_new" class="svelte-1vigaic">\u64CD\u4F5C\u793A\u7BC4</a> <a href="https://drive.google.com/file/d/1b_0Qzd4mtDsOQlov0GvDQdI7uzM7UWfR/view?usp=sharing" target="_new" class="svelte-1vigaic">\u6E2C\u8A66\u6587\u4EF6</a>
\u{1F4BE}\u5132\u5B58\u5EA7\u6A19\u6A94(Alt-S) \u2796\u522A\u9664\u5716\u6846(Alt-D) \u267B\uFE0F\u91CD\u7F6E\u5716\u6846(Alt-R)  \u{1F4D0}\u8F09\u5165\u5EA7\u6A19\u6A94(Alt-L)
\u{1F441}\u9810\u89BD\u8ABF\u6574\u6548\u679C\u3000\u5DF2\u5B8C\u6210\u6298\u6578  \u5317\u85CF/\u5357\u85CF\u3000\u5207\u63DB  \u62C9\u689D\u6539\u8B8A\u89D2\u5EA6\u3002\u4E0B\u4E00\u62CD(Enter)
\u4E00\u958B\u59CB\u6309F11\u9032\u5165\u5168\u87A2\u5E55\u6A21\u5F0F\u3002\u6309 Ctrl + - \u8ABF\u6574\u597D\u700F\u89BD\u5668\u7684\u89E3\u6790\u5EA6\uFF0C\u7121\u9808\u7D93\u5E38\u6539\u52D5\u3002
\u62D6\u653E\u6216\u9EDE\u64CA\u4EE5\u958B\u555F\u5716\u6A94\uFF0C\u9EDE\u4E00\u4E0B\u5716\u6A94\u540D\u5DE6\u908A\u7684\u25CB\u53EF\u6A19\u6CE8\u6709\u554F\u984C\u7684\u9801\u9762\u3002
\u4FDD\u7559\u6A94\u6848\u7E3D\u7BA1\u5728\u5DE5\u4F5C\u76EE\u9304\uFF0C\u7BC0\u7701\u6BCF\u6B21\u9EDE\u64CA\u958B\u59CB\u5C0D\u8A71\u76D2\u9078\u6A94\u6642\u9593\u3002
\u9EDE\u4EFB\u4F55\u4E00\u500B\u5716\u6846\uFF0C\u5E8F\u865F\u8B8A\u7D05\u8272\u6642\uFF0C\u8868\u793A\u9078\u53D6\uFF0C\u518D\u9EDE\u4E00\u4E0B\u53D6\u6D88\u9078\u53D6\u3002\u6309 1, 2 ,3 \u9078\u6846\u30020\u5168\u9078\u3002
\u4E0A\u4E0B\u5DE6\u53F3\u9375\u79FB\u52D5\u5716\u6846\uFF08\u9078\u53D6\u4E2D\u6216\u5168\u90E8\uFF09\uFF0C\u6309Ctrl\u8ABF\u6574\u5927\u5C0F\uFF0C\u540C\u6642\u6309Alt\u5FAE\u8ABF\u3002
\u6309\u5716\u6846\u5DE6\u908A\u6C34\u5E73\u65B9\u5411\u79FB\u52D5\uFF0C\u6309\u9802\u908A\u5782\u76F4\u65B9\u5411\u79FB\u52D5\u3002
\u8B93\u5716\u6846\u7B2C\u4E00\u884C\u548C\u6700\u5F8C\u4E00\u884C\u6587\u5B57\u90FD\u5728\u7E2E\u5716\u5167\uFF0C\u4E26\u76E1\u91CF\u5C45\u4E2D\u5C0D\u9F4A\u3002
\u9EDE \u5716\u62CD\u6E05\u55AE\u53F3\u908A\u7684\u300C\u5169\u884C\u7E2E\u5716\u300D\u53EF\u4E0A\u4E0B\u5C0D\u8ABF\u986F\u793A\u3002
\u53F3\u908A\u548C\u5E95\u908A\u8ABF\u6574\u5716\u6846\u5927\u5C0F\uFF0C\u8B93\u6BCF\u500B\u5B57\u5728\u5C0F\u683C\u5B50\u5167\uFF0C\u76E1\u91CF\u8B93\u6C34\u5E73\u7DDA\u5728\u5B57\u8207\u5B57\u4E4B\u9593\u3002
\u5373\u4F7F\u6846\u5167\u5C11\u65BC\u4E94\u884C\u6587\u5B57\uFF0C\u4E5F\u8981\u5C0D\u9F4A\uFF0C\u5377\u672B\u6821\u6CE8\u548C\u593E\u6CE8\u53EF\u4EE5\u5927\u81F4\u5C0D\u9F4A\u5373\u53EF\uFF08\u5B57\u9AD4\u8F03\u5C0F\u6545\uFF09\u3002
\u6C92\u6709\u5167\u6587\u6216\u6CE8\u91CB\u7684\u5716\u62CD\uFF0C\u5982\u5C01\u9762\u88E1\uFF0C\u9808\u522A\u6389\u5716\u6846\u3002\u4E00\u5377\u5167\u7B2C\u4E00\u62CD\u548C\u6700\u5F8C\u4E00\u62CD\u9810\u8A2D\u7121\u5716\u6846\u3002
\u8ABF\u6574\u700F\u89BD\u8996\u7A97\u5927\u5C0F\u53CA\u6539\u8B8A\u7E2E\u653E\u6BD4\u4F8B\uFF0C\u6846\u7684\u4F4D\u7F6E\u53EF\u80FD\u6703\u8DD1\u6389\uFF0C\u6B64\u6642\u4E0D\u5FC5\u8ABF\u6574\uFF0C\u53EA\u8981\u9EDE\u5176\u4ED6\u62CD\uFF0C\u518D\u9EDE\u56DE\u4F86\u5373\u6B63\u5E38\u3002
\u65B0\u589E\u5EA7\u6A19\u6A94\uFF1A
\u5B58\u6A94\u5728\u700F\u89BD\u5668\u7684\u300C\u4E0B\u8F09\u300D(CTRL+J)\uFF0C\u540C\u4E00\u5377\u5B58\u6A94\u8D85\u904E\u4E00\u6B21\uFF0C\u700F\u89BD\u5668\u6703\u4F9D\u5E8F\u7522\u751F<span class="filename svelte-1vigaic"> xxx(1).json , xxx(2).json </span>\u3002
\u53EA\u9808\u4E0A\u50B3\u6700\u65B0\u7684\u5B58\u6A94\uFF0C\u5B58\u6A94\u7684\u6A94\u540D\u5FC5\u9808\u548Czip/pdf\u4E00\u81F4\uFF0C\u5373<span class="filename svelte-1vigaic">0001-001\u592901.zip</span>\u7684\u5EA7\u6A19\u6A94\u540D\u70BA<span class="filename svelte-1vigaic">0001-001\u592901.json</span>
\u4F8B\u5982\u540C\u4E00\u5377\u6309\u4E864\u6B21\u5B58\u6A94\uFF0C\u9808\u5C07<span class="filename svelte-1vigaic">0001-001\u592901(3).json</span>\u66F4\u540D\u70BA<span class="filename svelte-1vigaic">0001-001\u592901.json</span>\u518D\u4E0A\u50B3\u3002
\u6AA2\u67E5\u5EA7\u6A19\u6A94\uFF1A
\u8F09\u5165\u5716\u6A94\u5F8C\uFF0C\u63A5\u8457\u8F09\u5165\u5EA7\u6A19\u6A94\uFF0C\u5B58\u6A94\uFF08\u7B2C\u4E00\u6B21\u6309\u5B58\u6A94\u6703\u8981\u6C42\u5BEB\u5165\u7684\u6B0A\u9650\uFF09
\u5F8C\u5C31\u4E0D\u662F\u653E\u5728\u700F\u89BD\u5668\u300C\u4E0B\u8F09\u300D\u6A94\u6848\u593E\uFF0C\u800C\u662F\u8986\u84CB\u9078\u64C7\u7684\u5EA7\u6A19\u6A94\u6240\u5728\u4F4D\u7F6E\u3002
\u5982\u679C\u7528\u65BD\u653E\u7684\u65B9\u5F0F\u540C\u6642\u8F09\u5165\u5716\u6A94\u53CA\u5EA7\u6A19\u6A94\uFF0C\u5247\u6309\u5132\u5B58\u4E00\u6A23\u6703\u653E\u5728\u300C\u4E0B\u8F09\u300D\u6587\u4EF6\u593E\uFF0C\u4E0D\u6703\u7834\u58DE\u539F\u4F86\u7684\u6A94\u6848\u3002
\u6309\u{1F441}\uFF0C\u9010\u9801\u6AA2\u67E5\uFF08\u7522\u751F\u9810\u89BD\u9700\u6578\u79D2\uFF09\uFF0C\u6709\u554F\u984C\u5148\u6309\u25CB\u6A19\u6CE8\uFF0C\u518D\u4E00\u8D77\u4FEE\u6539\uFF0C\u6700\u5F8C\u7528\u9810\u89BD\u518D\u6AA2\u67E5\u4E00\u6B21\u3002
`;
        attr(pre, "class", "svelte-1vigaic");
      },
      m(target, anchor) {
        insert(target, pre, anchor);
      },
      p: noop,
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(pre);
      }
    };
  }
  var Help = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, null, create_fragment6, safe_not_equal, {});
    }
  };
  var help_default = Help;

  // src/3rd/dropfilefallbacksvg.svelte
  function create_else_block_1(ctx) {
    let path;
    let polyline;
    return {
      c() {
        path = svg_element("path");
        polyline = svg_element("polyline");
        attr(path, "d", "M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z");
        attr(polyline, "points", "13 2 13 9 20 9");
      },
      m(target, anchor) {
        insert(target, path, anchor);
        insert(target, polyline, anchor);
      },
      d(detaching) {
        if (detaching)
          detach(path);
        if (detaching)
          detach(polyline);
      }
    };
  }
  function create_if_block_1(ctx) {
    let path;
    let polyline;
    let line;
    return {
      c() {
        path = svg_element("path");
        polyline = svg_element("polyline");
        line = svg_element("line");
        attr(path, "d", "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4");
        attr(polyline, "points", "7 10 12 15 17 10");
        attr(line, "x1", "12");
        attr(line, "y1", "15");
        attr(line, "x2", "12");
        attr(line, "y2", "3");
      },
      m(target, anchor) {
        insert(target, path, anchor);
        insert(target, polyline, anchor);
        insert(target, line, anchor);
      },
      d(detaching) {
        if (detaching)
          detach(path);
        if (detaching)
          detach(polyline);
        if (detaching)
          detach(line);
      }
    };
  }
  function create_else_block(ctx) {
    let text_1;
    let t;
    return {
      c() {
        text_1 = svg_element("text");
        t = text("\u62D6\u653E/\u9EDE\u64CA");
      },
      m(target, anchor) {
        insert(target, text_1, anchor);
        append(text_1, t);
      },
      d(detaching) {
        if (detaching)
          detach(text_1);
      }
    };
  }
  function create_if_block2(ctx) {
    let text_1;
    let t;
    return {
      c() {
        text_1 = svg_element("text");
        t = text("Drop it!");
        attr(text_1, "transform", "translate(0, 5)");
      },
      m(target, anchor) {
        insert(target, text_1, anchor);
        append(text_1, t);
      },
      d(detaching) {
        if (detaching)
          detach(text_1);
      }
    };
  }
  function create_fragment7(ctx) {
    let svg;
    let title;
    let t;
    let g0;
    let g1;
    function select_block_type(ctx2, dirty2) {
      if (
        /*over*/
        ctx2[0]
      )
        return create_if_block_1;
      return create_else_block_1;
    }
    let current_block_type = select_block_type(ctx, -1);
    let if_block0 = current_block_type(ctx);
    function select_block_type_1(ctx2, dirty2) {
      if (
        /*over*/
        ctx2[0]
      )
        return create_if_block2;
      return create_else_block;
    }
    let current_block_type_1 = select_block_type_1(ctx, -1);
    let if_block1 = current_block_type_1(ctx);
    return {
      c() {
        svg = svg_element("svg");
        title = svg_element("title");
        t = text("\u62D6\u653E\u6216\u9EDE\u64CA");
        g0 = svg_element("g");
        if_block0.c();
        g1 = svg_element("g");
        if_block1.c();
        attr(g0, "transform", "translate(28, 15)");
        attr(g0, "fill", "none");
        attr(g0, "stroke", "currentColor");
        attr(g0, "stroke-width", "1");
        attr(g0, "stroke-linecap", "round");
        attr(g0, "stroke-linejoin", "round");
        attr(g1, "transform", "translate(40, 55)");
        attr(g1, "text-anchor", "middle");
        attr(svg, "viewBox", "0 0 80 80");
      },
      m(target, anchor) {
        insert(target, svg, anchor);
        append(svg, title);
        append(title, t);
        append(svg, g0);
        if_block0.m(g0, null);
        append(svg, g1);
        if_block1.m(g1, null);
      },
      p(ctx2, [dirty2]) {
        if (current_block_type !== (current_block_type = select_block_type(ctx2, dirty2))) {
          if_block0.d(1);
          if_block0 = current_block_type(ctx2);
          if (if_block0) {
            if_block0.c();
            if_block0.m(g0, null);
          }
        }
        if (current_block_type_1 !== (current_block_type_1 = select_block_type_1(ctx2, dirty2))) {
          if_block1.d(1);
          if_block1 = current_block_type_1(ctx2);
          if (if_block1) {
            if_block1.c();
            if_block1.m(g1, null);
          }
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(svg);
        if_block0.d();
        if_block1.d();
      }
    };
  }
  function instance6($$self, $$props, $$invalidate) {
    let { over = false } = $$props;
    $$self.$$set = ($$props2) => {
      if ("over" in $$props2)
        $$invalidate(0, over = $$props2.over);
    };
    return [over];
  }
  var Dropfilefallbacksvg = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance6, create_fragment7, safe_not_equal, { over: 0 });
    }
  };
  var dropfilefallbacksvg_default = Dropfilefallbacksvg;

  // src/3rd/dropfile.svelte
  function fallback_block2(ctx) {
    let div;
    let fallbacksvg;
    let current;
    fallbacksvg = new dropfilefallbacksvg_default({ props: { over: (
      /*isOver*/
      ctx[2]
    ) } });
    return {
      c() {
        div = element("div");
        create_component(fallbacksvg.$$.fragment);
        attr(div, "id", "fallback");
        attr(div, "class", "svelte-1v4pc3g");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        mount_component(fallbacksvg, div, null);
        current = true;
      },
      p(ctx2, dirty2) {
        const fallbacksvg_changes = {};
        if (dirty2 & /*isOver*/
        4)
          fallbacksvg_changes.over = /*isOver*/
          ctx2[2];
        fallbacksvg.$set(fallbacksvg_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(fallbacksvg.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(fallbacksvg.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div);
        destroy_component(fallbacksvg);
      }
    };
  }
  function create_fragment8(ctx) {
    let div;
    let div_tabindex_value;
    let t;
    let input_1;
    let current;
    let mounted;
    let dispose;
    const default_slot_template = (
      /*#slots*/
      ctx[15].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[14],
      null
    );
    const default_slot_or_fallback = default_slot || fallback_block2(ctx);
    return {
      c() {
        div = element("div");
        if (default_slot_or_fallback)
          default_slot_or_fallback.c();
        t = space();
        input_1 = element("input");
        attr(div, "id", "zone");
        attr(div, "tabindex", div_tabindex_value = 0);
        attr(div, "class", "svelte-1v4pc3g");
        attr(input_1, "id", "hidden-input");
        attr(input_1, "type", "file");
        input_1.multiple = /*multiple*/
        ctx[0];
        input_1.disabled = /*disabled*/
        ctx[1];
        attr(input_1, "class", "svelte-1v4pc3g");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if (default_slot_or_fallback) {
          default_slot_or_fallback.m(div, null);
        }
        insert(target, t, anchor);
        insert(target, input_1, anchor);
        ctx[16](input_1);
        current = true;
        if (!mounted) {
          dispose = [
            listen(
              div,
              "drop",
              /*handleDrop*/
              ctx[6]
            ),
            listen(
              div,
              "dragover",
              /*handleDragOver*/
              ctx[7]
            ),
            listen(
              div,
              "dragenter",
              /*handleEnter*/
              ctx[4]
            ),
            listen(
              div,
              "dragleave",
              /*handleLeave*/
              ctx[5]
            ),
            listen(
              div,
              "click",
              /*onClick*/
              ctx[9]
            ),
            listen(
              div,
              "keydown",
              /*onKeyDown*/
              ctx[10]
            ),
            listen(
              input_1,
              "change",
              /*handleChange*/
              ctx[8]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, [dirty2]) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty2 & /*$$scope*/
          16384)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[14],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[14]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[14],
                dirty2,
                null
              ),
              null
            );
          }
        } else {
          if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty2 & /*isOver*/
          4)) {
            default_slot_or_fallback.p(ctx2, !current ? -1 : dirty2);
          }
        }
        if (!current || dirty2 & /*multiple*/
        1) {
          input_1.multiple = /*multiple*/
          ctx2[0];
        }
        if (!current || dirty2 & /*disabled*/
        2) {
          input_1.disabled = /*disabled*/
          ctx2[1];
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot_or_fallback, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot_or_fallback, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div);
        if (default_slot_or_fallback)
          default_slot_or_fallback.d(detaching);
        if (detaching)
          detach(t);
        if (detaching)
          detach(input_1);
        ctx[16](null);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function instance7($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    let { multiple = false } = $$props;
    let { disabled = false } = $$props;
    let { onDrop } = $$props;
    let { onEnter } = $$props;
    let { onLeave } = $$props;
    let isOver = false;
    let input;
    const handleEnter = () => {
      $$invalidate(2, isOver = true);
      if (onEnter) {
        onEnter();
      }
    };
    const handleLeave = () => {
      $$invalidate(2, isOver = false);
      if (onLeave) {
        onLeave();
      }
    };
    const handleDrop = (e) => {
      e.preventDefault();
      if (!e?.dataTransfer?.items || disabled) {
        return;
      }
      const items = Array.from(e.dataTransfer.files);
      onDrop(items);
      $$invalidate(2, isOver = false);
    };
    const handleDragOver = (e) => {
      e.preventDefault();
    };
    const handleChange = (e) => {
      e.preventDefault();
      const files = e.target.files;
      onDrop(Array.from(files));
    };
    const onClick = () => {
      input.click();
    };
    const onKeyDown = (e) => {
      if (e.key === "Enter") {
        input.click();
      }
    };
    function input_1_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        input = $$value;
        $$invalidate(3, input);
      });
    }
    $$self.$$set = ($$props2) => {
      if ("multiple" in $$props2)
        $$invalidate(0, multiple = $$props2.multiple);
      if ("disabled" in $$props2)
        $$invalidate(1, disabled = $$props2.disabled);
      if ("onDrop" in $$props2)
        $$invalidate(11, onDrop = $$props2.onDrop);
      if ("onEnter" in $$props2)
        $$invalidate(12, onEnter = $$props2.onEnter);
      if ("onLeave" in $$props2)
        $$invalidate(13, onLeave = $$props2.onLeave);
      if ("$$scope" in $$props2)
        $$invalidate(14, $$scope = $$props2.$$scope);
    };
    return [
      multiple,
      disabled,
      isOver,
      input,
      handleEnter,
      handleLeave,
      handleDrop,
      handleDragOver,
      handleChange,
      onClick,
      onKeyDown,
      onDrop,
      onEnter,
      onLeave,
      $$scope,
      slots,
      input_1_binding
    ];
  }
  var Dropfile = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance7, create_fragment8, safe_not_equal, {
        multiple: 0,
        disabled: 1,
        onDrop: 11,
        onEnter: 12,
        onLeave: 13
      });
    }
  };
  var dropfile_default = Dropfile;

  // src/imageviewer.svelte
  function create_else_block2(ctx) {
    let help;
    let current;
    help = new help_default({});
    return {
      c() {
        create_component(help.$$.fragment);
      },
      m(target, anchor) {
        mount_component(help, target, anchor);
        current = true;
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(help.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(help.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(help, detaching);
      }
    };
  }
  function create_if_block3(ctx) {
    let previous_key = (
      /*$activeimageurl*/
      (ctx[0], /*$rotateangle*/
      ctx[1])
    );
    let key_block_anchor;
    let current;
    let key_block = create_key_block2(ctx);
    return {
      c() {
        key_block.c();
        key_block_anchor = empty();
      },
      m(target, anchor) {
        key_block.m(target, anchor);
        insert(target, key_block_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty2) {
        if (dirty2 & /*$activeimageurl, $rotateangle*/
        3 && safe_not_equal(previous_key, previous_key = /*$activeimageurl*/
        (ctx2[0], /*$rotateangle*/
        ctx2[1]))) {
          group_outros();
          transition_out(key_block, 1, 1, noop);
          check_outros();
          key_block = create_key_block2(ctx2);
          key_block.c();
          transition_in(key_block, 1);
          key_block.m(key_block_anchor.parentNode, key_block_anchor);
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
          detach(key_block_anchor);
        key_block.d(detaching);
      }
    };
  }
  function create_if_block_12(ctx) {
    let div;
    let croppers;
    let current;
    croppers = new croppers_default({ props: { height: height2, width: width2, r: r2, start: 1 } });
    return {
      c() {
        div = element("div");
        create_component(croppers.$$.fragment);
        attr(div, "class", "croppers svelte-q92n05");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        mount_component(croppers, div, null);
        current = true;
      },
      p: noop,
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
      }
    };
  }
  function create_key_block2(ctx) {
    let span;
    let t0;
    let t1;
    let t2;
    let img;
    let img_src_value;
    let img_style_value;
    let current;
    let if_block = !/*$showpreview*/
    ctx[3] && create_if_block_12(ctx);
    return {
      c() {
        span = element("span");
        t0 = text(
          /*$fileprefix*/
          ctx[2]
        );
        t1 = space();
        if (if_block)
          if_block.c();
        t2 = space();
        img = element("img");
        attr(span, "class", "fileprefix svelte-q92n05");
        attr(img, "id", "image1");
        if (!src_url_equal(img.src, img_src_value = /*$activeimageurl*/
        ctx[0]))
          attr(img, "src", img_src_value);
        attr(img, "class", "image svelte-q92n05");
        attr(img, "alt", "noimage");
        attr(img, "style", img_style_value = "transform: rotate(" + /*$rotateangle*/
        ctx[1] / 60 + "deg);");
      },
      m(target, anchor) {
        insert(target, span, anchor);
        append(span, t0);
        insert(target, t1, anchor);
        if (if_block)
          if_block.m(target, anchor);
        insert(target, t2, anchor);
        insert(target, img, anchor);
        current = true;
      },
      p(ctx2, dirty2) {
        if (!current || dirty2 & /*$fileprefix*/
        4)
          set_data(
            t0,
            /*$fileprefix*/
            ctx2[2]
          );
        if (!/*$showpreview*/
        ctx2[3]) {
          if (if_block) {
            if_block.p(ctx2, dirty2);
            if (dirty2 & /*$showpreview*/
            8) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block_12(ctx2);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(t2.parentNode, t2);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
        if (!current || dirty2 & /*$activeimageurl*/
        1 && !src_url_equal(img.src, img_src_value = /*$activeimageurl*/
        ctx2[0])) {
          attr(img, "src", img_src_value);
        }
        if (!current || dirty2 & /*$rotateangle*/
        2 && img_style_value !== (img_style_value = "transform: rotate(" + /*$rotateangle*/
        ctx2[1] / 60 + "deg);")) {
          attr(img, "style", img_style_value);
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
          detach(span);
        if (detaching)
          detach(t1);
        if (if_block)
          if_block.d(detaching);
        if (detaching)
          detach(t2);
        if (detaching)
          detach(img);
      }
    };
  }
  function create_fragment9(ctx) {
    let span;
    let dropfile;
    let t;
    let current_block_type_index;
    let if_block;
    let if_block_anchor;
    let current;
    dropfile = new dropfile_default({ props: { onDrop: (
      /*onDrop*/
      ctx[4]
    ) } });
    const if_block_creators = [create_if_block3, create_else_block2];
    const if_blocks = [];
    function select_block_type(ctx2, dirty2) {
      if (
        /*$activeimageurl*/
        ctx2[0]
      )
        return 0;
      return 1;
    }
    current_block_type_index = select_block_type(ctx, -1);
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    return {
      c() {
        span = element("span");
        create_component(dropfile.$$.fragment);
        t = space();
        if_block.c();
        if_block_anchor = empty();
        attr(span, "class", "dropzone svelte-q92n05");
      },
      m(target, anchor) {
        insert(target, span, anchor);
        mount_component(dropfile, span, null);
        insert(target, t, anchor);
        if_blocks[current_block_type_index].m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
      },
      p(ctx2, [dirty2]) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2, dirty2);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty2);
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
            if_block.p(ctx2, dirty2);
          }
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(dropfile.$$.fragment, local);
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(dropfile.$$.fragment, local);
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(span);
        destroy_component(dropfile);
        if (detaching)
          detach(t);
        if_blocks[current_block_type_index].d(detaching);
        if (detaching)
          detach(if_block_anchor);
      }
    };
  }
  var r2 = 1;
  var height2 = 2e3;
  var width2 = 3e3;
  function instance8($$self, $$props, $$invalidate) {
    let $nimage;
    let $images;
    let $activeimageurl;
    let $rotateangle;
    let $fileprefix;
    let $showpreview;
    component_subscribe($$self, nimage, ($$value) => $$invalidate(5, $nimage = $$value));
    component_subscribe($$self, images, ($$value) => $$invalidate(6, $images = $$value));
    component_subscribe($$self, activeimageurl, ($$value) => $$invalidate(0, $activeimageurl = $$value));
    component_subscribe($$self, rotateangle, ($$value) => $$invalidate(1, $rotateangle = $$value));
    component_subscribe($$self, fileprefix, ($$value) => $$invalidate(2, $fileprefix = $$value));
    component_subscribe($$self, showpreview, ($$value) => $$invalidate(3, $showpreview = $$value));
    const onDrop = async (files) => {
      let jsonname = false, prefix = "", inputfiles = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.name.endsWith(".zip") || file.name.endsWith(".pdf") || file.name.endsWith("json")) {
          inputfiles.push(file);
        }
      }
      inputfiles.sort((a, b) => a.name == b.name ? 0 : a.name > a.name ? -1 : 1);
      for (let i = 0; i < inputfiles.length; i++) {
        const file = inputfiles[i];
        if (file.name.endsWith(".zip") || file.name.endsWith(".pdf")) {
          await openWorkingFile(file);
          prefix = file.name.replace(/\.[a-z]+$/, "");
        }
        if (file.name.endsWith(".json")) {
          jsonname = file.name.replace(".json", "");
          if (prefix && jsonname && jsonname !== prefix)
            alert("filename mismatch");
          else
            await loadfile(file);
        }
        if (prefix && jsonname)
          break;
      }
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*$images, $nimage*/
      96) {
        $:
          getImageURL($images, $nimage, activeimageurl);
      }
    };
    return [
      $activeimageurl,
      $rotateangle,
      $fileprefix,
      $showpreview,
      onDrop,
      $nimage,
      $images
    ];
  }
  var Imageviewer = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance8, create_fragment9, safe_not_equal, {});
    }
  };
  var imageviewer_default = Imageviewer;

  // src/filelist.svelte
  function get_each_context3(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[4] = list[i];
    child_ctx[6] = i;
    return child_ctx;
  }
  function create_each_block3(ctx) {
    let div;
    let span0;
    let t0_value = (
      /*image*/
      ctx[4].name + ""
    );
    let t0;
    let t1;
    let span1;
    let t2_value = (
      /*image*/
      ctx[4].mark ? "\u25CF" : "\u25CB"
    );
    let t2;
    let t3;
    let span2;
    let t4_value = (
      /*image*/
      (ctx[4].frames?.length || "") + ""
    );
    let t4;
    let t5;
    let mounted;
    let dispose;
    function click_handler() {
      return (
        /*click_handler*/
        ctx[2](
          /*idx*/
          ctx[6]
        )
      );
    }
    function click_handler_1() {
      return (
        /*click_handler_1*/
        ctx[3](
          /*idx*/
          ctx[6]
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
        t3 = space();
        span2 = element("span");
        t4 = text(t4_value);
        t5 = space();
        attr(span0, "class", "svelte-arxl4l");
        toggle_class(
          span0,
          "done",
          /*image*/
          ctx[4].frames
        );
        attr(span1, "class", "mark");
        toggle_class(
          span1,
          "markon",
          /*image*/
          ctx[4].mark
        );
        attr(span2, "class", "framecount svelte-arxl4l");
        attr(div, "class", "svelte-arxl4l");
        toggle_class(
          div,
          "selected",
          /*idx*/
          ctx[6] == /*$nimage*/
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
        append(div, t3);
        append(div, span2);
        append(span2, t4);
        append(div, t5);
        if (!mounted) {
          dispose = [
            listen(span1, "click", click_handler),
            listen(div, "click", click_handler_1)
          ];
          mounted = true;
        }
      },
      p(new_ctx, dirty2) {
        ctx = new_ctx;
        if (dirty2 & /*$images*/
        2 && t0_value !== (t0_value = /*image*/
        ctx[4].name + ""))
          set_data(t0, t0_value);
        if (dirty2 & /*$images*/
        2) {
          toggle_class(
            span0,
            "done",
            /*image*/
            ctx[4].frames
          );
        }
        if (dirty2 & /*$images*/
        2 && t2_value !== (t2_value = /*image*/
        ctx[4].mark ? "\u25CF" : "\u25CB"))
          set_data(t2, t2_value);
        if (dirty2 & /*$images*/
        2) {
          toggle_class(
            span1,
            "markon",
            /*image*/
            ctx[4].mark
          );
        }
        if (dirty2 & /*$images*/
        2 && t4_value !== (t4_value = /*image*/
        (ctx[4].frames?.length || "") + ""))
          set_data(t4, t4_value);
        if (dirty2 & /*$nimage*/
        1) {
          toggle_class(
            div,
            "selected",
            /*idx*/
            ctx[6] == /*$nimage*/
            ctx[0]
          );
        }
      },
      d(detaching) {
        if (detaching)
          detach(div);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_key_block3(ctx) {
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
        if (dirty2 & /*$nimage, selectimage, $images, togglemark*/
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
  function create_fragment10(ctx) {
    let div;
    let previous_key = (
      /*$nimage*/
      ctx[0]
    );
    let key_block = create_key_block3(ctx);
    return {
      c() {
        div = element("div");
        key_block.c();
        attr(div, "class", "filelist svelte-arxl4l");
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
          key_block = create_key_block3(ctx2);
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
  function instance9($$self, $$props, $$invalidate) {
    let $nimage;
    let $images;
    component_subscribe($$self, nimage, ($$value) => $$invalidate(0, $nimage = $$value));
    component_subscribe($$self, images, ($$value) => $$invalidate(1, $images = $$value));
    const click_handler = (idx2) => togglemark(idx2);
    const click_handler_1 = (idx2) => selectimage(idx2);
    return [$nimage, $images, click_handler, click_handler_1];
  }
  var Filelist = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance9, create_fragment10, safe_not_equal, {});
    }
  };
  var filelist_default = Filelist;

  // src/thumbnail.svelte
  function create_fragment11(ctx) {
    let div;
    let canvas0;
    let br;
    let canvas1_1;
    let mounted;
    let dispose;
    return {
      c() {
        div = element("div");
        canvas0 = element("canvas");
        br = element("br");
        canvas1_1 = element("canvas");
        attr(canvas0, "class", "svelte-o0r9bs");
        attr(canvas1_1, "class", "svelte-o0r9bs");
        attr(div, "class", "thumbnails svelte-o0r9bs");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, canvas0);
        ctx[7](canvas0);
        append(div, br);
        append(div, canvas1_1);
        ctx[8](canvas1_1);
        if (!mounted) {
          dispose = listen(
            canvas0,
            "click",
            /*swapthumbnail*/
            ctx[2]
          );
          mounted = true;
        }
      },
      p: noop,
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(div);
        ctx[7](null);
        ctx[8](null);
        mounted = false;
        dispose();
      }
    };
  }
  function instance10($$self, $$props, $$invalidate) {
    let $rotateangle;
    let $selectedframe;
    let $frames;
    let $verticalstrip;
    let $ratio;
    component_subscribe($$self, rotateangle, ($$value) => $$invalidate(4, $rotateangle = $$value));
    component_subscribe($$self, selectedframe, ($$value) => $$invalidate(5, $selectedframe = $$value));
    component_subscribe($$self, frames, ($$value) => $$invalidate(6, $frames = $$value));
    component_subscribe($$self, verticalstrip, ($$value) => $$invalidate(10, $verticalstrip = $$value));
    component_subscribe($$self, ratio, ($$value) => $$invalidate(11, $ratio = $$value));
    let canvas1, canvas2, timer;
    const updateThumbnail = () => {
      const img1 = document.getElementById("image1");
      if (!img1)
        return;
      let c1 = canvas1, c2 = canvas2;
      if (swap) {
        c2 = canvas1;
        c1 = canvas2;
      }
      if (!c1 || !c2)
        return;
      let nframe = -1;
      if ($selectedframe)
        nframe = Math.log2($selectedframe);
      const frms = $frames;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      ;
      canvas.width = img1.naturalWidth;
      canvas.height = img1.naturalHeight;
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(get_store_value(rotateangle) * Math.PI / (180 * 60));
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
      ctx.drawImage(img1, 0, 0);
      ctx.restore();
      let ctx1 = c1.getContext("2d");
      let ctx2 = c2.getContext("2d");
      clearTimeout(timer);
      timer = setTimeout(
        () => {
          ctx1.clearRect(0, 0, canvas1.width, c1.height);
          ctx2.clearRect(0, 0, canvas2.width, c2.height);
          if (!~nframe)
            return;
          setTimeout(() => {
            const r3 = $ratio;
            const frame = frms[nframe];
            if (!frame)
              return;
            const vert = $verticalstrip;
            let x = frame[0], y = frame[1], w = frame[2] / vert, h = frame[3];
            c1.width = w;
            c1.height = h;
            ctx1.drawImage(canvas, x / r3, y / r3, w / r3, h / r3, 0, 0, w, h);
            x = frame[0] + w * (vert - 1);
            c2.width = w;
            c2.height = h;
            ctx2.drawImage(canvas, x / r3, y / r3, w / r3, h / r3, 0, 0, w, h);
          });
        },
        100
      );
    };
    onMount(() => updateThumbnail());
    let swap = 0;
    const swapthumbnail = () => {
      $$invalidate(3, swap = 1 - swap);
    };
    function canvas0_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        canvas2 = $$value;
        $$invalidate(1, canvas2);
      });
    }
    function canvas1_1_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        canvas1 = $$value;
        $$invalidate(0, canvas1);
      });
    }
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*$frames, $selectedframe, swap, $rotateangle*/
      120) {
        $:
          updateThumbnail($frames, $selectedframe, swap, $rotateangle);
      }
    };
    return [
      canvas1,
      canvas2,
      swapthumbnail,
      swap,
      $rotateangle,
      $selectedframe,
      $frames,
      canvas0_binding,
      canvas1_1_binding
    ];
  }
  var Thumbnail = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance10, create_fragment11, safe_not_equal, {});
    }
  };
  var thumbnail_default = Thumbnail;

  // src/3rd/swipe.svelte
  function get_each_context4(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[49] = list[i];
    child_ctx[51] = i;
    return child_ctx;
  }
  function create_if_block4(ctx) {
    let div;
    let each_value = (
      /*indicators*/
      ctx[2]
    );
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block4(get_each_context4(ctx, each_value, i));
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
      p(ctx2, dirty2) {
        if (dirty2[0] & /*activeIndicator, changeItem, indicators*/
        38) {
          each_value = /*indicators*/
          ctx2[2];
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context4(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty2);
            } else {
              each_blocks[i] = create_each_block4(child_ctx);
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
  function create_each_block4(ctx) {
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
      p(new_ctx, dirty2) {
        ctx = new_ctx;
        if (dirty2[0] & /*activeIndicator*/
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
  function create_fragment12(ctx) {
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
      ctx[0] && create_if_block4(ctx)
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
      p(ctx2, dirty2) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty2[0] & /*$$scope*/
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
                dirty2,
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
            if_block.p(ctx2, dirty2);
          } else {
            if_block = create_if_block4(ctx2);
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
  function instance11($$self, $$props, $$invalidate) {
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
        let idx2 = has_infinite_loop ? i - 1 : i;
        if (init3) {
          element2.style.transform = generateTranslateValue(availableSpace2 * idx2);
        }
        if (moving) {
          element2.style.cssText = generateTouchPosCss(availableSpace2 * idx2 - distance);
        }
        if (end) {
          element2.style.cssText = generateTouchPosCss(availableSpace2 * idx2 - pos_axis2, true);
        }
        if (reset) {
          element2.style.cssText = generateTouchPosCss(availableSpace2 * idx2 - pos_axis2);
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
    const mod = (n, m4) => (n % m4 + m4) % m4;
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
        instance11,
        create_fragment12,
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

  // src/3rd/swipeitem.svelte
  function create_fragment13(ctx) {
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
      p(ctx2, [dirty2]) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty2 & /*$$scope*/
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
                dirty2,
                null
              ),
              null
            );
          }
        }
        if (!current || dirty2 & /*classes, active*/
        3 && div1_class_value !== (div1_class_value = "swipeable-item " + /*classes*/
        ctx2[1] + " " + /*active*/
        (ctx2[0] ? "is-active" : "") + " svelte-13ik1fy")) {
          attr(div1, "class", div1_class_value);
        }
        if (!current || dirty2 & /*style*/
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
  function instance12($$self, $$props, $$invalidate) {
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
      init(this, options, instance12, create_fragment13, safe_not_equal, {
        active: 0,
        classes: 1,
        style: 2,
        allow_dynamic_height: 5
      });
    }
  };
  var swipeitem_default = Swipeitem;

  // ../ptk/utils/unpackintarray.ts
  var maxlen2 = 113 * 113;
  var maxlen3 = 113 * 113 * 113;
  var BYTE_MAX = 113;
  var BYTE1_MAX = 45;
  var BYTE2_MAX = 44 * BYTE_MAX + BYTE1_MAX;
  var BYTE3_MAX = 16 * BYTE_MAX * BYTE_MAX + BYTE2_MAX;
  var BYTE4_MAX = 6 * BYTE_MAX * BYTE_MAX * BYTE_MAX + BYTE3_MAX;
  var BYTE5_MAX = 2 * BYTE_MAX * BYTE_MAX * BYTE_MAX * BYTE_MAX + BYTE4_MAX;

  // ../ptk/utils/packstr.ts
  var CodeStart2 = 14;
  var CodeEnd = 31;
  var MaxShared = CodeEnd - CodeStart2;
  var SEP = String.fromCharCode(CodeStart2);

  // ../ptk/utils/bopomofo.ts
  var consonants = "b,p,m,f,d,t,n,l,g,k,h,j,q,x,zh,ch,sh,r,z,c,s".split(",");
  var vowels = "a,o,e,e,ai,ei,ao,ou,an,en,ang,eng,er,i,u,v".split(",");

  // ../ptk/utils/helper.ts
  var sleep = (time) => new Promise((r3) => {
    setTimeout(() => r3(), time);
  });

  // ../lossless-simplified-chinese/sc-tc-map.js
  var sc2tc = `\u3454\u346F
\u3447\u3473
\u3439\u3476
\u523E\u34E8
\u360E\u361A
\u36AF\u3704
\u36E3\u370F
\u37C6\u380F
\u3918\u396E
\u3A2B\u3A5C
\u39D0\u3A73
\u64DC\u3A75
\u3EEA\u3EFD
\u4025\u407B
\u9FCE\u40EE
\u4336\u42B7
\u433A\u42D9
\u433B\u42DA
\u433F\u42F9
\u433E\u42FB
\u43AC\u43B1
\u464C\u4661
\u4727\u4700
\u478D\u477C
\u4982\u4947
\u9FCF\u4951
\u497E\u4971
\u49B6\u499B
\u49B7\u499F
\u4BC5\u4BC0
\u9C83\u4C3E
\u4CA3\u4C77
\u4C9D\u4C7D
\u9CDA\u4C81
\u9CE4\u4C98
\u9E6E\u4D09
\u4E22\u4E1F
\u5E76<\u4F75\u4E26
\u5E72<\u5E79>\u4E7E
\u4E71\u4E82
\u4E9A\u4E9E
\u4F2B\u4F47
\u6765\u4F86
\u4ED1\u4F96
\u4FA3\u4FB6
\u4FE3\u4FC1
\u7CFB<\u7E6B\u4FC2
\u4F23\u4FD4
\u4FA0\u4FE0
\u4F21\u4FE5
\u4F25\u5000
\u4FE9\u5006
\u4FEB\u5008
\u4ED3\u5009
\u4E2A\u500B
\u4EEC\u5011
\u4F26\u502B
\u3448\u5032
\u4F1F\u5049
\u343D\u5051
\u4FA7\u5074
\u4FA6\u5075
\u4F2A\u50DE\u507D
\u3437\u508C
\u6770<\u5091
\u4F27\u5096
\u4F1E\u5098
\u5907\u5099
\u4F63<\u50AD
\u506C\u50AF
\u4F20\u50B3
\u4F1B\u50B4
\u503A\u50B5
\u4F24\u50B7
\u503E\u50BE
\u507B\u50C2
\u4EC5\u50C5
\u4F65\u50C9
\u4FA8\u50D1
\u4EC6<\u50D5
\u4FA5\u50E5
\u507E\u50E8
\u4EF7<\u50F9
\u4EEA\u5100
\u347A\u5101
\u4FAC\u5102
\u4EBF\u5104
\u4FA9\u5108
\u4FED\u5109
\u50A7\u5110
\u4FE6\u5114
\u4FAA\u5115
\u5C3D\u76E1\u5118
\u507F\u511F
\u4F18<\u512A
\u50A8\u5132
\u4FEA\u5137
\u3469\u5138
\u50A9\u513A
\u50A5\u513B
\u4FE8\u513C
\u5151\u514C
\u513F<\u5152
\u5156\u5157
\u5185\u5167
\u4E24\u5169
\u518C\u518A
\u5E42\u51AA
\u51C0\u51C8
\u51BB\u51CD
\u51DB\u51DC
\u51EF\u51F1
\u522B\u5225
\u5220\u522A
\u522D\u5244
\u5219\u5247
\u514B<\u524B
\u5239\u524E
\u522C\u5257
\u521A\u525B
\u5265\u525D
\u5250\u526E
\u5240\u5274
\u521B\u5275
\u5212<\u5283
\u5267\u5287
\u5218\u5289
\u523D\u528A
\u523F\u528C
\u5251\u528D
\u34E5\u528F
\u5242\u5291
\u3509\u529A
\u52B2\u52C1
\u52A8\u52D5
\u52A1\u52D9
\u52CB\u52DB
\u80DC<\u52DD
\u52B3\u52DE
\u52BF\u52E2
\u52DA\u52E9
\u52A2\u52F1
\u52B1\u52F5
\u529D\u52F8
\u5300\u52FB
\u5326\u532D
\u6C47\u5F59\u532F
\u532E\u5331
\u533A\u5340
\u534F\u5354
\u5374\u537B
\u538D\u5399
\u538C\u53AD
\u5389\u53B2
\u53A3\u53B4
\u53C2\u53C3
\u53C1\u53C4
\u4E1B\u53E2
\u54A4>\u5412
\u5434\u5433
\u5450\u5436
\u5415\u5442
\u5459\u54BC
\u5458\u54E1
\u5457\u5504
\u5423\u551A
\u95EE\u554F
\u54D1\u555E
\u542F\u555F
\u5521\u5562
\u359E\u558E
\u5524\u559A
\u4E27\u55AA
\u4E54\u55AC
\u5355\u55AE
\u54DF\u55B2
\u545B\u55C6
\u556C\u55C7
\u551D\u55CA
\u5417\u55CE
\u545C\u55DA
\u5522\u55E9
\u54D4\u55F6
\u53F9\u5606
\u55BD\u560D
\u556F\u5613
\u5455\u5614
\u5567\u5616
\u5C1D\u5617
\u551B\u561C
\u54D7\u5629
\u5520\u562E
\u5578\u562F
\u53FD\u5630
\u54D3\u5635
\u5452\u5638
\u5574\u563D
\u5618\u5653
\u358A\u565A
\u549D\u565D
\u54D2\u5660
\u54DD\u5665
\u54D5\u5666
\u55F3\u566F
\u54D9\u5672
\u55B7\u5674
\u5428<\u5678
\u5F53\u7576\u5679
\u549B\u5680
\u5413\u5687
\u54DC\u568C
\u565C\u5695
\u556E\u5699
\u5456\u56A6
\u5499\u56A8
\u4EB8\u56B2
\u55BE\u56B3
\u4E25\u56B4
\u5624\u56B6
\u556D\u56C0
\u55EB\u56C1
\u56A3\u56C2
\u5181\u56C5
\u5453\u56C8
\u5570\u56C9
\u5631\u56D1
\u56F1\u56EA
\u56F5\u5707
\u56FD\u570B
\u56F4\u570D
\u56ED\u5712
\u5706\u5713
\u56FE\u5716
\u56E2\u5718
\u57EF\u57B5
\u57AD\u57E1
\u91C7<\u63A1\u57F0
\u6267\u57F7
\u575A\u5805
\u57A9\u580A
\u57B4\u5816
\u57DA\u581D
\u5C27\u582F
\u62A5\u5831
\u573A\u5834
\u5757\u584A
\u8314\u584B
\u57B2\u584F
\u57D8\u5852
\u6D82<\u5857
\u575E\u5862
\u57D9\u5864
\u5C18\u5875
\u5811\u5879
\u57AB\u588A
\u5760\u589C
\u5815\u58AE
\u575F\u58B3
\u57AF\u58B6
\u57A6\u58BE
\u575B\u7F48\u58C7
\u57B1\u58CB
\u538B\u58D3
\u5792\u58D8
\u5739\u58D9
\u5786\u58DA
\u574F<\u58DE
\u5784\u58DF
\u5785\u58E0
\u575C\u58E2
\u575D\u58E9
\u5846\u58EA
\u58EE\u58EF
\u58F6\u58FA
\u58F8\u58FC
\u5BFF\u58FD
\u591F\u5920
\u68A6\u5922
\u5939\u593E
\u5942\u5950
\u5965\u5967
\u5941\u5969
\u593A\u596A
\u5968\u596C
\u594B\u596E
\u59F9\u597C
\u5986\u599D
\u59D7\u59CD
\u5978<\u59E6
\u5A31\u5A1B
\u5A04\u5A41
\u5987\u5A66
\u5A05\u5A6D
\u5A32\u5AA7
\u59AB\u5AAF
\u36C0\u5AB0
\u5AAA\u5ABC
\u5988\u5ABD
\u59AA\u5AD7
\u59A9\u5AF5
\u5A34\u5AFB
\u5A73\u5AFF
\u5AAD\u5B03
\u5A06\u5B08
\u5A75\u5B0B
\u5A07\u5B0C
\u5AF1\u5B19
\u5AD2\u5B21
\u5B37\u5B24
\u5AD4\u5B2A
\u5A74\u5B30
\u5A76\u5B38
\u36E4\u5B4B
\u5A08\u5B4C
\u5B59\u5B6B
\u5B66\u5B78
\u5B6A\u5B7F
\u5BAB\u5BAE
\u5BDD\u5BE2
\u5B9E\u5BE6
\u5B81<\u5BE7
\u5BA1\u5BE9
\u5199\u5BEB
\u5BBD\u5BEC
\u3766\u5BEF
\u5BA0\u5BF5
\u5B9D\u5BF6
\u5C06\u5C07
\u4E13\u5C08
\u5BFB\u5C0B
\u5BF9\u5C0D
\u5BFC\u5C0E
\u5C34\u5C37
\u5C4A\u5C46
\u5C38<\u5C4D
\u5C43\u5C53
\u5C49\u5C5C
\u5C61\u5C62
\u5C42\u5C64
\u5C66\u5C68
\u5C5E\u5C6C
\u5188\u5CA1
\u5C98\u5CF4
\u5C9B\u5CF6
\u5CE1\u5CFD
\u5D03\u5D0D
\u5C97\u5D17
\u5CE5\u5D22
\u5CBD\u5D2C
\u5C9A\u5D50
\u37E5\u5D7E
\u5D5D\u5D81
\u5D2D\u5D84
\u5C96\u5D87
\u5D5A\u5D94
\u5D02\u5D97
\u5CE4\u5DA0
\u5CE3\u5DA2
\u5CC4\u5DA7
\u5D04\u5DAE
\u5C99\u5DB4
\u5D58\u5DB8
\u5CAD<\u5DBA
\u5C7F\u5DBC
\u5CBF\u5DCB
\u5CE6\u5DD2
\u5DC5\u5DD4
\u5DEF\u5DF0
\u5E05\u5E25
\u5E08\u5E2B
\u5E10\u5E33
\u5E26\u5E36
\u5E27\u5E40
\u5E0F\u5E43
\u384E\u5E53
\u5E3C\u5E57
\u5E3B\u5E58
\u5E1C\u5E5F
\u5E01\u5E63
\u5E2E\u5E6B
\u5E31\u5E6C
\u4E48<\u9EBC>\u5E7A>\u9EBD
\u51E0<\u5E7E
\u5E93\u5EAB
\u5395\u5EC1
\u53A2\u5EC2
\u53A9\u5EC4
\u53A6\u5EC8
\u53A8\u5EDA
\u53AE\u5EDD
\u5E99\u5EDF
\u5382<\u5EE0
\u5E91\u5EE1
\u5E9F\u5EE2
\u5E7F\u5EE3
\u5EEA\u5EE9
\u5E90\u5EEC
\u5385\u5EF3
\u5F11\u5F12
\u5F2A\u5F33
\u5F20\u5F35
\u5F3A\u5F37
\u5F39\u5F48
\u5F25\u5F4C
\u5F2F\u5F4E
\u5F5D<\u5F5E
\u5F5F\u5F60
\u5F66\u5F65
\u5F68\u5F72
\u540E<>\u5F8C
\u5F84\u5F91
\u4ECE\u5F9E
\u5F95\u5FA0
\u590D<\u8907\u5FA9>\u8986
\u5F81<>\u5FB5
\u5F7B\u5FB9
\u6052\u6046
\u803B\u6065
\u60A6\u6085
\u60AE\u609E
\u6005\u60B5
\u95F7\u60B6
\u6076\u60E1
\u607C\u60F1
\u607D\u60F2
\u607B\u60FB
\u7231\u611B
\u60EC\u611C
\u60AB\u6128
\u6006\u6134
\u607A\u6137
\u5FFE\u613E
\u6817<\u6144
\u6001\u614B
\u6120\u614D
\u60E8\u6158
\u60ED\u615A
\u6078\u615F
\u60EF\u6163
\u6004\u616A
\u6002\u616B
\u8651\u616E
\u60AD\u6173
\u5E86\u6176
\u396A\u617A
\u5FE7\u6182
\u60EB\u618A
\u392D\u618D
\u601C<\u6190
\u51ED\u6191
\u6126\u6192
\u616D\u6196
\u60EE\u619A
\u6124\u61A4
\u60AF\u61AB
\u6003\u61AE
\u5BAA\u61B2
\u5FC6\u61B6
\u6073\u61C7
\u5E94\u61C9
\u603F\u61CC
\u61D4\u61CD
\u603C\u61DF
\u61D1\u61E3
\u393D\u61E4
\u3916\u61E7
\u6079\u61E8
\u60E9\u61F2
\u61D2\u61F6
\u6000<\u61F7
\u60AC\u61F8
\u5FCF<\u61FA
\u60E7\u61FC
\u6151\u61FE
\u604B\u6200
\u6206\u6207
\u620B\u6214
\u6217\u6227
\u622C\u6229
\u6218\u6230
\u622F\u6231
\u620F\u6232
\u6237\u6236
\u629B\u62CB
\u635D\u6329
\u631F\u633E
\u820D<\u6368
\u626A\u636B
\u626B\u6383
\u62A1\u6384
\u39CF\u6386
\u631C\u6397
\u6323\u6399
\u6302<\u639B
\u62E3\u63C0
\u626C\u63DA
\u6362\u63DB
\u6325\u63EE
\u635F\u640D
\u6447\u6416
\u6363\u6417
\u63FE\u6435
\u62A2\u6436
\u63B4\u6451
\u63BC\u645C
\u6402\u645F
\u631A\u646F
\u62A0\u6473
\u629F\u6476
\u63BA\u647B
\u635E\u6488
\u6326\u648F
\u6491\u6490
\u6320\u6493
\u39D1\u649D
\u6322\u649F
\u63B8\u64A3
\u62E8\u64A5
\u629A\u64AB
\u6251<\u64B2
\u63FF\u64B3
\u631E\u64BB
\u631D\u64BE
\u6361\u64BF
\u62E5\u64C1
\u63B3\u64C4
\u62E9\u64C7
\u51FB\u64CA
\u6321\u64CB
\u39DF\u64D3
\u62C5\u64D4
\u636E<\u64DA
\u6324\u64E0
\u39DB\u64E5
\u62DF\u64EC
\u6448\u64EF
\u62E7\u64F0
\u6401\u64F1
\u63B7\u64F2
\u6269\u64F4
\u64B7\u64F7
\u6446\u64FA
\u64DE\u64FB
\u64B8\u64FC
\u39F0\u64FD
\u6270<\u64FE
\u6445\u6504
\u64B5\u6506
\u62E2\u650F
\u62E6\u6514
\u6484\u6516
\u6400\u6519
\u64BA\u651B
\u643A\u651C
\u6444\u651D
\u6512\u6522
\u631B\u6523
\u644A\u6524
\u6405\u652A
\u63FD\u652C
\u8D25\u6557
\u53D9\u6558
\u654C\u6575
\u6570\u6578
\u655B\u6582
\u6BD9\u6583
\u6569\u6586
\u6593\u6595
\u65A9\u65AC
\u65AD\u65B7
\u4E8E<>\u65BC
\u65F6\u6642
\u664B\u6649
\u663C\u665D
\u6655\u6688
\u6656\u6689
\u65F8\u6698
\u7545\u66A2
\u6682\u66AB
\u6654\u66C4
\u5386\u6B77\u66C6
\u6619\u66C7
\u6653\u66C9
\u5411<\u66CF
\u66A7\u66D6
\u65F7\u66E0
\u663D\u66E8
\u6652<\u66EC
\u4E66\u66F8
\u4F1A\u6703
\u80E7\u6727
\u4E1C\u6771
\u6805\u67F5
\u6746<\u687F
\u6800\u6894
\u67A7\u6898
\u6761\u689D
\u67AD\u689F
\u68C1\u68B2
\u5F03\u68C4
\u67A8\u68D6
\u67A3\u68D7
\u680B\u68DF
\u3B4E\u68E1
\u6808\u68E7
\u6816<\u68F2
\u68BE\u68F6
\u6860\u690F
\u3B4F\u6932
\u6768\u694A
\u67AB\u6953
\u6862\u6968
\u4E1A\u696D
\u6781<\u6975
\u6769\u69AA
\u8363\u69AE
\u6985\u69B2
\u6864\u69BF
\u6784<\u69CB
\u67AA\u69CD
\u68BF\u69E4
\u6920\u69E7
\u6901\u69E8
\u692E\u69EE
\u6868\u69F3
\u6922\u69F6
\u691D\u69FC
\u6869\u6A01
\u4E50\u6A02
\u679E\u6A05
\u697C\u6A13
\u6807\u6A19
\u67A2\u6A1E
\u3B64\u6A22
\u6837\u6A23
\u3B74\u6A2B
\u686A\u6A33
\u6734<\u6A38
\u6811\u6A39
\u6866\u6A3A
\u692B\u6A3F
\u6861\u6A48
\u6865\u6A4B
\u673A<\u6A5F
\u692D\u6A62
\u6A2A\u6A6B
\u6AA9\u6A81
\u67FD\u6A89
\u6863\u6A94
\u6867\u6A9C
\u69DA\u6A9F
\u68C0\u6AA2
\u6A2F\u6AA3
\u68BC\u6AAE
\u53F0<\u98B1\u81FA\u6AAF
\u69DF\u6AB3
\u67E0\u6AB8
\u69DB\u6ABB
\u67DC<\u6AC3
\u6A79\u6AD3
\u6988\u6ADA
\u6809\u6ADB
\u691F\u6ADD
\u6A7C\u6ADE
\u680E\u6ADF
\u6A71\u6AE5
\u69E0\u6AE7
\u680C\u6AE8
\u67A5\u6AEA
\u6A65\u6AEB
\u6987\u6AEC
\u8616\u6AF1
\u680A\u6AF3
\u6989\u6AF8
\u6A31\u6AFB
\u680F\u6B04
\u6743\u6B0A
\u6924\u6B0F
\u683E\u6B12
\u6984\u6B16
\u68C2\u6B1E
\u94A6\u6B3D
\u6B27\u6B50
\u6B24\u6B5F
\u6B22\u6B61
\u5C81\u6B72
\u5F52\u6B78
\u6B81\u6B7F
\u6B8B\u6B98
\u6B92\u6B9E
\u6B87\u6BA4
\u3C6E\u6BA8
\u6B9A\u6BAB
\u6B93\u6BAE
\u6BA1\u6BAF
\u3C69\u6BB0
\u6B7C\u6BB2
\u6740\u6BBA
\u58F3\u6BBC
\u6BC1\u6BC0
\u6BB4\u6BC6
\u6BF5\u6BFF
\u7266\u6C02
\u6BE1\u6C08
\u6C07\u6C0C
\u6C14<\u6C23
\u6C22\u6C2B
\u6C29\u6C2C
\u6C32\u6C33
\u51B3\u6C7A
\u6CA1\u6C92
\u51B2\u885D\u6C96
\u51B5\u6CC1
\u6C79\u6D36
\u6D43\u6D79
\u6CFE\u6D87
\u51C9\u6DBC
\u6CEA\u6DDA
\u6E0C\u6DE5
\u6CA6\u6DEA
\u6E0A\u6DF5
\u6D9E\u6DF6
\u6D45\u6DFA
\u6DA3\u6E19
\u51CF\u6E1B
\u6CA8\u6E22
\u6DA1\u6E26
\u6D4B\u6E2C
\u6D51\u6E3E
\u51D1\u6E4A
\u6D48\u6E5E
\u6C64\u6E6F
\u6CA9\u6E88
\u51C6<\u6E96
\u6C9F\u6E9D
\u6E29\u6EAB
\u6D49\u6EAE
\u6DA2\u6EB3
\u6CA7\u6EC4
\u706D\u6EC5
\u6DA4\u6ECC
\u8365\u6ECE
\u6CAA\u6EEC
\u6EDE\u6EEF
\u6E17\u6EF2
\u6D52\u6EF8
\u6D50\u6EFB
\u6EDA\u6EFE
\u6EE1\u6EFF
\u6E14\u6F01
\u6E87\u6F0A
\u6CA4\u6F1A
\u6C49\u6F22
\u6D9F\u6F23
\u6E0D\u6F2C
\u6DA8\u6F32
\u6E86\u6F35
\u6E10\u6F38
\u6D46\u6F3F
\u988D\u6F41
\u6CFC\u6F51
\u6D01<\u6F54
\u3D0B\u6F5A
\u6F5C\u6F5B
\u6DA6\u6F64
\u6D54\u6F6F
\u6E83\u6F70
\u6ED7\u6F77
\u6DA0\u6F7F
\u6DA9\u6F80
\u6D47\u6F86
\u6D9D\u6F87
\u6DA7\u6F97
\u6E11\u6FA0
\u6CFD\u6FA4
\u6EEA\u6FA6
\u6CF6\u6FA9
\u6D4D\u6FAE
\u6DC0<\u6FB1
\u3CE0\u6FBE
\u6D4A\u6FC1
\u6D53\u6FC3
\u3CE1\u6FC4
\u6E7F\u6FD5
\u6CDE<\u6FD8
\u6E81\u6FDA
\u6D55\u6FDC
\u6D4E\u6FDF
\u6D9B\u6FE4
\u3CD4\u6FE7
\u6EE5\u6FEB
\u6F4D\u6FF0
\u6EE8\u6FF1
\u6E85\u6FFA
\u6CFA\u6FFC
\u6EE4\u6FFE
\u6F9B\u7002
\u6EE2\u7005
\u6E0E\u7006
\u3CBF\u7007
\u6CFB\u7009
\u6C88<\u700B
\u6D4F\u700F
\u6FD2\u7015
\u6CF8\u7018
\u6CA5\u701D
\u6F47\u701F
\u6F46\u7020
\u6F74\u7026
\u6CF7\u7027
\u6FD1\u7028
\u3CFD\u7030
\u6F4B\u7032
\u6F9C\u703E
\u6CA3\u7043
\u6EE0\u7044
\u6D12<\u7051
\u6F13<\u7055
\u6EE9\u7058
\u704F\u705D
\u6F24\u7060
\u3CD5\u7061
\u6E7E\u7063
\u6EE6\u7064
\u6EDF\u7067
\u707E\u707D
\u4E3A\u70BA
\u4E4C\u70CF
\u70C3\u70F4
\u65E0\u7121
\u70BC\u7149
\u709C\u7152
\u70DF\u7159
\u8315\u7162
\u7115\u7165
\u70E6\u7169
\u7080\u716C
\u3DBD\u7171
\u7174\u7185
\u8367\u7192
\u709D\u7197
\u70ED\u71B1
\u988E\u71B2
\u70BD\u71BE
\u70E8\u71C1
\u706F\u71C8
\u70E7\u71D2
\u70EB\u71D9
\u7116\u71DC
\u8425\u71DF
\u707F\u71E6
\u70DB\u71ED
\u70E9\u71F4
\u3DB6\u71F6
\u70EC\u71FC
\u7118\u71FE
\u70C1\u720D
\u7089\u7210
\u70C2\u721B
\u4E89\u722D
\u7237\u723A
\u5C14\u723E
\u5899\u7246
\u724D\u7258
\u7275\u727D
\u8366\u7296
\u728A\u72A2
\u727A\u72A7
\u72B6\u72C0
\u72ED\u72F9
\u72C8\u72FD
\u72F0\u7319
\u72B9\u7336
\u72F2\u733B
\u72B8\u7341
\u72F1\u7344
\u72EE\u7345
\u5956\u734E
\u72EC\u7368
\u72EF\u736A
\u7303\u736B
\u72DD\u736E
\u72DE\u7370
\u3E8D\u7371
\u83B7\u7A6B\u7372
\u730E\u7375
\u72B7\u7377
\u517D\u7378
\u736D\u737A
\u732E\u737B
\u7315\u737C
\u7321\u7380
\u73B0\u73FE
\u73D0\u743A
\u73F2\u743F
\u73AE\u744B
\u739A\u7452
\u7410\u7463
\u7476\u7464
\u83B9\u7469
\u739B\u746A
\u73B1\u7472
\u740F\u7489
\u740E\u74A1
\u7391\u74A3
\u7477\u74A6
\u73F0\u74AB
\u3EC5\u74AF
\u73AF\u74B0
\u7399\u74B5
\u7478\u74B8
\u73BA\u74BD
\u743C\u74CA
\u73D1\u74CF
\u748E\u74D4
\u74D2\u74DA
\u74EF\u750C
\u4EA7\u7522
\u4EA9\u755D
\u6BD5\u7562
\u753B\u756B
\u5F02<\u7570
\u7574\u7587
\u53E0\u758A
\u75C9\u75D9
\u75B4\u75FE
\u75D6\u7602
\u75AF\u760B
\u75A1\u760D
\u75EA\u7613
\u7617\u761E
\u75AE\u7621
\u759F\u7627
\u7606\u762E
\u75AD\u7632
\u7618\u763A
\u7597\u7642
\u75E8\u7646
\u75EB\u7647
\u7605\u7649
\u75A0\u7658
\u762A\u765F
\u75D2<\u7662
\u7596\u7664
\u75C7<\u7665
\u75AC\u7667
\u765E\u7669
\u7663\u766C
\u763F\u766D
\u763E\u766E
\u75C8\u7670
\u762B\u7671
\u766B\u7672
\u53D1\u9AEE\u767C
\u7691\u769A
\u75B1\u76B0
\u76B2\u76B8
\u76B1\u76BA
\u76D7\u76DC
\u76CF\u76DE
\u76D1\u76E3
\u76D8\u76E4
\u5362\u76E7
\u8361\u8569\u76EA
\u7726\u7725
\u4F17\u773E
\u56F0<\u774F
\u7741\u775C
\u7750\u775E
\u770D\u7798
\u4056\u779C
\u7792\u779E
\u7786\u77B6
\u7751\u77BC
\u772C\u77D3
\u77A9\u77DA
\u77EB\u77EF
\u7841\u785C
\u7856\u7864
\u7817\u7868
\u781A\u786F
\u7855\u78A9
\u7800\u78AD
\u781C\u78B8
\u786E<\u78BA
\u7801\u78BC
\u40B5\u78BD
\u7859\u78D1
\u7816\u78DA
\u7875\u78E0
\u789C\u78E3
\u789B\u78E7
\u77F6\u78EF
\u7857\u78FD
\u40C5\u78FE
\u785A\u7904
\u7877\u9E7C\u7906
\u7840\u790E
\u788D\u7919
\u77FF\u7926
\u783A\u792A
\u783E\u792B
\u77FE\u792C
\u783B\u7931
\u7984\u797F
\u7978\u798D
\u796F\u798E
\u794E\u7995
\u7943\u79A1
\u5FA1<\u79A6
\u7985\u79AA
\u793C\u79AE
\u7962\u79B0
\u7977\u79B1
\u79C3\u79BF
\u7C7C\u79C8
\u7A0E\u7A05
\u79C6\u7A08
\u4149\u7A0F
\u7980\u7A1F
\u79CD<\u7A2E
\u79F0\u7A31
\u8C37<\u7A40
\u415F\u7A47
\u7A23\u7A4C
\u79EF\u7A4D
\u9896\u7A4E
\u79FE\u7A60
\u7A51\u7A61
\u79FD\u7A62
\u7A33\u7A69
\u7A06\u7A6D
\u7A9D\u7AA9
\u6D3C<\u7AAA
\u7A77\u7AAE
\u7A91\u7AAF
\u7A8E\u7AB5
\u7AAD\u7AB6
\u7AA5\u7ABA
\u7A9C\u7AC4
\u7A8D\u7AC5
\u7AA6\u7AC7
\u7A83\u7ACA
\u7ADE\u7AF6
\u7B14\u7B46
\u7B0B\u7B4D
\u7B15\u7B67
\u41F2\u7B74
\u7B3A\u7B8B
\u7B5D\u7B8F
\u8282\u7BC0
\u8303<\u7BC4
\u7B51<\u7BC9
\u7BA7\u7BCB
\u7B7C\u7BD4
\u7B03\u7BE4
\u7B5B\u7BE9
\u7B5A\u7BF3
\u7BA6\u7C00
\u7BD3\u7C0D
\u7BAA\u7C1E
\u7B80\u7C21
\u7BD1\u7C23
\u7BAB\u7C2B
\u7B5C\u7C39
\u7B7E\u7C3D
\u5E18<\u7C3E
\u7BEE\u7C43
\u7B79\u7C4C
\u4264\u7C54
\u7B93\u7C59
\u7BEF\u7C5B
\u7BA8\u7C5C
\u7C41\u7C5F
\u7B3C\u7C60
\u7B3E\u7C69
\u7C16\u7C6A
\u7BF1<\u7C6C
\u7BA9\u7C6E
\u7CA4\u7CB5
\u7CC1\u7CDD
\u7CAA\u7CDE
\u7CAE\u7CE7
\u7C9D\u7CF2
\u7C74\u7CF4
\u7C9C\u7CF6
\u7E9F\u7CF9
\u7EA0\u7CFE
\u7EAA\u7D00
\u7EA3\u7D02
\u7EA6\u7D04
\u7EA2\u7D05
\u7EA1\u7D06
\u7EA5\u7D07
\u7EA8\u7D08
\u7EAB\u7D09
\u7EB9\u7D0B
\u7EB3\u7D0D
\u7EBD\u7D10
\u7EBE\u7D13
\u7EAF\u7D14
\u7EB0\u7D15
\u7EBC\u7D16
\u7EB1\u7D17
\u7EAE\u7D18
\u7EB8\u7D19
\u7EA7\u7D1A
\u7EB7\u7D1B
\u7EAD\u7D1C
\u7EB4\u7D1D
\u7EBA\u7D21
\u4337\u7D2C
\u7EC6\u7D30
\u7EC2\u7D31
\u7EC1\u7D32
\u7EC5\u7D33
\u7EBB\u7D35
\u7ECD\u7D39
\u7EC0\u7D3A
\u7ECB\u7D3C
\u7ED0\u7D3F
\u7ECC\u7D40
\u7EC8\u7D42
\u7EC4\u7D44
\u4339\u7D45
\u7ECA\u7D46
\u7ED7\u7D4E
\u7ED3\u7D50
\u7EDD\u7D55
\u7EE6\u7E27\u7D5B
\u7ED4\u7D5D
\u7EDE\u7D5E
\u7EDC\u7D61
\u7EDA\u7D62
\u7ED9\u7D66
\u7ED2\u7D68
\u7ED6\u7D70
\u7EDF\u7D71
\u4E1D\u7D72
\u7EDB\u7D73
\u7EE2\u7D79
\u7ED1\u7D81
\u7EE1\u7D83
\u7EE0\u7D86
\u7EE8\u7D88
\u7EE4\u7D8C
\u7EE5\u7D8F
\u433C\u7D90
\u7ECF\u7D93
\u7EFC\u7D9C
\u7F0D\u7D9E
\u7EFF\u7DA0
\u7EF8\u7DA2
\u7EFB\u7DA3
\u7EF6\u7DAC
\u7EF4\u7DAD
\u7EF9\u7DAF
\u7EFE\u7DB0
\u7EB2\u7DB1
\u7F51<\u7DB2
\u7F00\u7DB4
\u433D\u7DB5
\u7EB6\u7DB8
\u7EFA\u7DB9
\u7EEE\u7DBA
\u7EFD\u7DBB
\u7EF0\u7DBD
\u7EEB\u7DBE
\u7EF5\u7DBF
\u7EF2\u7DC4
\u7F01\u7DC7
\u7D27\u7DCA
\u7EEF\u7DCB
\u7EEA\u7DD2
\u7EEC\u7DD3
\u7EF1\u979D\u7DD4
\u7F03\u7DD7
\u7F04\u7DD8
\u7F02\u7DD9
\u7EBF\u7DDA
\u7F09\u7DDD
\u7F0E\u7DDE
\u7F14\u7DE0
\u7F17\u7DE1
\u7F18\u7DE3
\u7F0C\u7DE6
\u7F16\u7DE8
\u7F13\u7DE9
\u7F05\u7DEC
\u7EAC\u7DEF
\u7F11\u7DF1
\u7F08\u7DF2
\u7EC3\u7DF4
\u7F0F\u7DF6
\u7F07\u7DF9
\u81F4<\u7DFB
\u8426\u7E08
\u7F19\u7E09
\u7F22\u7E0A
\u7F12\u7E0B
\u7EC9\u7E10
\u7F23\u7E11
\u7F0A\u7E15
\u7F1E\u7E17
\u7F1A\u7E1B
\u7F1C\u7E1D
\u7F1F\u7E1E
\u7F1B\u7E1F
\u53BF\u7E23
\u7F1D\u7E2B
\u7F21\u7E2D
\u7F29\u7E2E
\u7EB5\u7E31
\u7F27\u7E32
\u4338\u7E33
\u7F26\u7E35
\u7D77\u7E36
\u7F15\u7E37
\u7F25\u7E39
\u603B\u7E3D
\u7EE9\u7E3E
\u7EF7\u7E43
\u7F2B\u7E45
\u7F2A\u7E46
\u7F2F\u7E52
\u7EC7\u7E54
\u7F2E\u7E55
\u7F2D\u7E5A
\u7ED5\u7E5E
\u7EE3\u7E61
\u7F0B\u7E62
\u7EF3\u7E69
\u7ED8\u7E6A
\u8327<\u7E6D
\u7F30\u97C1\u7E6E
\u7F33\u7E6F
\u7F32\u7E70
\u7F34\u7E73
\u4341\u7E78
\u7ECE\u7E79
\u7EE7\u7E7C
\u7F24\u7E7D
\u7F31\u7E7E
\u4340\u7E7F
\u98A3\u7E87
\u7F2C\u7E88
\u7EA9\u7E8A
\u7EED\u7E8C
\u7D2F<\u7E8D
\u7F20\u7E8F
\u7F28\u7E93
\u7EA4\u7E96
\u7F35\u7E98
\u7F06\u7E9C
\u94B5\u7F3D
\u7F42\u7F4C
\u7F5A\u7F70
\u9A82\u7F75
\u7F62\u7F77
\u7F57\u7F85
\u7F74\u7F86
\u7F81\u7F88
\u8288\u7F8B
\u7F9F\u7FA5
\u4E49\u7FA9
\u4E60\u7FD2
\u7FDA\u7FEC
\u7FD8\u7FF9
\u7FD9\u7FFD
\u8027\u802C
\u8022\u802E
\u5723<\u8056
\u95FB\u805E
\u8054\u806F
\u806A\u8070
\u58F0\u8072
\u8038\u8073
\u8069\u8075
\u8042\u8076
\u804C\u8077
\u804D\u8079
\u542C<\u807D
\u804B\u807E
\u8083\u8085
\u80C1\u8105
\u8109\u8108
\u80EB\u811B
\u8131\u812B
\u80C0\u8139
\u80BE\u814E
\u80E8\u8156
\u8136\u8161
\u8111\u8166
\u80BF\u816B
\u811A\u8173
\u80A0\u8178
\u817D\u8183
\u8158\u8195
\u80A4\u819A
\u43DD\u819E
\u80F6\u81A0
\u817B\u81A9
\u80C6\u81BD
\u810D\u81BE
\u8113\u81BF
\u442A\u81C7
\u8138\u81C9
\u8110\u81CD
\u8191\u81CF
\u814A<\u81D8
\u80EA\u81DA
\u810F\u9AD2\u81DF
\u8114\u81E0
\u81DC\u81E2
\u4E34\u81E8
\u4E0E<\u8207
\u5174\u8208
\u4E3E\u8209
\u65E7\u820A
\u8231\u8259
\u8223\u8264
\u8230\u8266
\u823B\u826B
\u8270\u8271
\u8273\u8277
\u520D\u82BB
\u82CE\u82E7
\u5179\u8332
\u8346\u834A
\u5E84<\u838A
\u830E\u8396
\u835A\u83A2
\u82CB\u83A7
\u534E\u83EF
\u82CC\u8407
\u83B1\u840A
\u4E07<\u842C
\u835D\u8434
\u83B4\u8435
\u53F6\u8449
\u836D\u8452
\u7740>\u8457
\u836E\u8464
\u82C7\u8466
\u8364\u8477
\u83B3\u8494
\u8385\u849E
\u82CD\u84BC
\u836A\u84C0
\u76D6\u84CB
\u83B2\u84EE
\u82C1\u84EF
\u83BC\u84F4
\u835C\u84FD
\u848C\u851E
\u848B\u8523
\u8471\u8525
\u8311\u8526
\u836B\u852D
\u8368\u8541
\u8487\u8546
\u835E\u854E
\u836C\u8552
\u82B8<\u8553
\u83B8\u8555
\u835B\u8558
\u8489\u8562
\u829C\u856A
\u8427\u856D
\u84E3\u8577
\u8570\u8580
\u835F\u8588
\u84DF\u858A
\u8297\u858C
\u8537\u8594
\u8359\u8598
\u83B6\u859F
\u8350<\u85A6
\u8428\u85A9
\u44D5\u85B3
\u82E7<\u85B4
\u44D3\u85B5
\u8360\u85BA
\u84DD\u85CD
\u8369\u85CE
\u827A\u85DD
\u836F\u85E5
\u85AE\u85EA
\u82C8\u85F6
\u853C\u85F9
\u853A\u85FA
\u841A\u8600
\u8572\u8604
\u82A6\u8606
\u82CF\u8607
\u8574\u860A
\u82F9<\u860B
\u85D3\u861A
\u8539\u861E
\u830F\u8622
\u5170\u862D
\u84E0\u863A
\u841D\u863F
\u8502<\u8646
\u5904\u8655
\u865A\u865B
\u864F\u865C
\u53F7\u865F
\u4E8F\u8667
\u866C\u866F
\u86F1\u86FA
\u8715\u86FB
\u86AC\u8706
\u8680\u8755
\u732C\u875F
\u867E\u8766
\u8717\u8778
\u86F3\u8784
\u8682\u879E
\u8424\u87A2
\u45D6\u87AE
\u877C\u87BB
\u8780\u87BF
\u86F0\u87C4
\u8748\u87C8
\u87A8\u87CE
\u866E<\u87E3
\u8749\u87EC
\u86F2\u87EF
\u866B<\u87F2
\u86CF\u87F6
\u8681\u87FB
\u8683\u8801
\u8747\u8805
\u867F\u8806
\u86F4\u8810
\u877E\u8811
\u8721<\u881F
\u86CE\u8823
\u87CF\u8828
\u86CA\u8831
\u8695<\u8836
\u86EE\u883B
\u672F\u8853
\u540C<\u8855
\u80E1<\u9B0D\u885A
\u536B\u885B
\u886E\u889E
\u8885\u88CA
\u8865\u88DC
\u88C5\u88DD
\u91CC<\u88E1
\u5236<\u88FD
\u88C8\u890C
\u8886\u8918
\u88E4\u8932
\u88E2\u8933
\u891B\u8938
\u4EB5\u893B
\u88E5\u8947
\u891D\u894C
\u88AF\u894F
\u8884\u8956
\u88E3\u895D
\u88C6\u8960
\u8934\u8964
\u889C\u896A
\u4653\u896C
\u886C\u896F
\u88AD\u8972
\u8955\u8974
\u89C1\u898B
\u89C3\u898E
\u89C4\u898F
\u89C5\u8993
\u89C6\u8996
\u89C7\u8998
\u89CB\u89A1
\u89CD\u89A5
\u89CE\u89A6
\u4EB2\u89AA
\u89CA\u89AC
\u89CF\u89AF
\u89D0\u89B2
\u89D1\u89B7
\u89C9\u89BA
\u89C8\u89BD
\u89CC\u89BF
\u89C2\u89C0
\u89DE\u89F4
\u89EF\u89F6
\u89E6<\u89F8
\u8BA0\u8A01
\u8BA2\u8A02
\u8BA3\u8A03
\u8BA1\u8A08
\u8BAF\u8A0A
\u8BA7\u8A0C
\u8BA8\u8A0E
\u8BA6\u8A10
\u8BB1\u8A12
\u8BAD\u8A13
\u8BAA\u8A15
\u8BAB\u8A16
\u8BAC\u8A17
\u8BB0\u8A18
\u8BB9\u8A1B
\u8BB6\u8A1D
\u8BBC\u8A1F
\u4723\u8A22
\u8BC0\u8A23
\u8BB7\u8A25
\u8BBB\u8A29
\u8BBF\u8A2A
\u8BBE\u8A2D
\u8BB8\u8A31
\u8BC9\u8A34
\u8BC3\u8A36
\u8BCA\u8A3A
\u6CE8<\u8A3B
\u8BC2\u8A41
\u8BCB\u8A46
\u8BB5\u8A4E
\u8BC8\u8A50
\u8BD2\u8A52
\u8BCF\u8A54
\u8BC4\u8A55
\u8BD0\u8A56
\u8BC7\u8A57
\u8BCE\u8A58
\u8BC5\u8A5B
\u8BCD\u8A5E
\u548F\u8A60
\u8BE9\u8A61
\u8BE2\u8A62
\u8BE3\u8A63
\u8BD5\u8A66
\u8BD7\u8A69
\u8BE7\u8A6B
\u8BDF\u8A6C
\u8BE1\u8A6D
\u8BE0\u8A6E
\u8BD8\u8A70
\u8BDD\u8A71
\u8BE5\u8A72
\u8BE6\u8A73
\u8BDC\u8A75
\u8BD9\u8A7C
\u8BD6\u8A7F
\u8BD4\u8A84
\u8BDB\u8A85
\u8BD3\u8A86
\u5938<\u8A87
\u5FD7<\u8A8C
\u8BA4\u8A8D
\u8BF3\u8A91
\u8BF6\u8A92
\u8BDE\u8A95
\u8BF1\u8A98
\u8BEE\u8A9A
\u8BED\u8A9E
\u8BDA\u8AA0
\u8BEB\u8AA1
\u8BEC\u8AA3
\u8BEF\u8AA4
\u8BF0\u8AA5
\u8BF5\u8AA6
\u8BF2\u8AA8
\u8BF4\u8AAA
\u8C01\u8AB0
\u8BFE\u8AB2
\u8C07\u8AB6
\u8BFD\u8AB9
\u8C0A\u8ABC
\u8A1A\u8ABE
\u8C03\u8ABF
\u8C04\u8AC2
\u8C06\u8AC4
\u8C08\u8AC7
\u8BFF\u8AC9
\u8BF7\u8ACB
\u8BE4\u8ACD
\u8BF9\u8ACF
\u8BFC\u8AD1
\u8C05\u8AD2
\u8BBA\u8AD6
\u8C02\u8AD7
\u8C00\u8ADB
\u8C0D\u8ADC
\u8C1E\u8ADD
\u8C1D\u8ADE
\u8BE8\u8AE2
\u8C14\u8AE4
\u8C1B\u8AE6
\u8C10\u8AE7
\u8C0F\u8AEB
\u8C15\u8AED
\u8C18\u8AEE
\u8BB3\u8AF1
\u8C19\u8AF3
\u8C0C\u8AF6
\u8BBD\u8AF7
\u8BF8\u8AF8
\u8C1A\u8AFA
\u8C16\u8AFC
\u8BFA\u8AFE
\u8C0B\u8B00
\u8C12\u8B01
\u8C13\u8B02
\u8A8A\u8B04
\u8BCC\u8B05
\u8C0E\u8B0A
\u8C1C\u8B0E
\u8C27\u8B10
\u8C11\u8B14
\u8C21\u8B16
\u8C24\u8B17
\u8C26\u8B19
\u8C25\u8B1A
\u8BB2\u8B1B
\u8C22\u8B1D
\u8C23\u8B20
\u8C1F\u8B28
\u8C2A\u8B2B
\u8C2C\u8B2C
\u8C2B\u8B7E\u8B2D
\u8BB4\u8B33
\u8C28\u8B39
\u8C29\u8B3E
\u8BC1\u8B49
\u8C32\u8B4E
\u8BA5\u8B4F
\u8C2E\u8B56
\u8BC6\u8B58
\u8C2F\u8B59
\u8C2D\u8B5A
\u8C31\u8B5C
\u8C35\u8B6B
\u8BD1\u8B6F
\u8BAE\u8B70
\u8C34\u8B74
\u62A4\u8B77
\u8BEA\u8B78
\u46D3\u8B7C
\u8A89\u8B7D
\u8BFB\u8B80
\u8C09\u8B85
\u53D8\u8B8A
\u8A5F\u8B8B
\u4729\u8B8C
\u96E0\u8B8E
\u8C17\u8B92
\u8BA9\u8B93
\u8C30\u8B95
\u8C36\u8B96
\u8C20\u8B9C
\u8C33\u8B9E
\u5C82\u8C48
\u7AD6\u8C4E
\u4E30<\u8C50
\u732A\u8C6C
\u8C6E\u8C76
\u732B\u8C93
\u4759\u8C99
\u8D1D\u8C9D
\u8D1E\u8C9E
\u8D20\u8C9F
\u8D1F\u8CA0
\u8D22\u8CA1
\u8D21\u8CA2
\u8D2B\u8CA7
\u8D27\u8CA8
\u8D29\u8CA9
\u8D2A\u8CAA
\u8D2F\u8CAB
\u8D23\u8CAC
\u8D2E\u8CAF
\u8D33\u8CB0
\u8D40\u8CB2
\u8D30\u8CB3
\u8D35\u8CB4
\u8D2C\u8CB6
\u4E70\u8CB7
\u8D37\u8CB8
\u8D36\u8CBA
\u8D39\u8CBB
\u8D34\u8CBC
\u8D3B\u8CBD
\u8D38\u8CBF
\u8D3A\u8CC0
\u8D32\u8CC1
\u8D42\u8CC2
\u8D41\u8CC3
\u8D3F\u8CC4
\u8D45\u8CC5
\u8D44\u8CC7
\u8D3E\u8CC8
\u8D3C\u8CCA
\u8D48\u8CD1
\u8D4A\u8CD2
\u5BBE\u8CD3
\u8D47\u8CD5
\u8D52\u8CD9
\u8D49\u8CDA
\u8D50\u8CDC
\u8D4F\u8CDE
\u8D54\u8CE0
\u8D53\u8CE1
\u8D24\u8CE2
\u5356\u8CE3
\u8D31\u8CE4
\u8D4B\u8CE6
\u8D55\u8CE7
\u8D28\u8CEA
\u8D26\u8CEC
\u8D4C\u8CED
\u4790\u8CF0
\u8D56\u8CF4
\u8D57\u8CF5
\u8D5A\u8CFA
\u8D59\u8CFB
\u8D2D\u8CFC
\u8D5B\u8CFD
\u8D5C\u8CFE
\u8D3D\u8D04
\u8D58\u8D05
\u8D5F\u8D07
\u8D60\u8D08
\u8D5E\u8D0A
\u8D5D\u8D17\u8D0B
\u8D61\u8D0D
\u8D62\u8D0F
\u8D46\u8D10
\u8D43\u8D13
\u8D51\u8D14
\u8D4E\u8D16
\u8D63\u8D1B
\u8D6A\u8D6C
\u8D76<\u8D95
\u8D75\u8D99
\u8D8B\u8DA8
\u8DB1\u8DB2
\u8FF9\u8DE1
\u8DF5\u8E10
\u8E0A<\u8E34
\u8DC4\u8E4C
\u8DF8\u8E55
\u8E52\u8E63
\u8E2A\u8E64
\u8DF7\u8E7A
\u8DF6\u8E82
\u8DB8\u8E89
\u8E0C\u8E8A
\u8DFB\u8E8B
\u8DC3\u8E8D
\u47E2\u8E8E
\u8E2F\u8E91
\u8DDE\u8E92
\u8E2C\u8E93
\u8E70\u8E95
\u8DF9\u8E9A
\u8E51\u8EA1
\u8E7F\u8EA5
\u8E9C\u8EA6
\u8E8F\u8EAA
\u8EAF\u8EC0
\u8F66\u8ECA
\u8F67\u8ECB
\u8F68\u8ECC
\u519B\u8ECD
\u8F6A\u8ED1
\u8F69\u8ED2
\u8F6B\u8ED4
\u8F6D\u8EDB
\u8F6F\u8EDF
\u8F77\u8EE4
\u8F78\u8EEB
\u8F71\u8EF2
\u8F74\u8EF8
\u8F75\u8EF9
\u8F7A\u8EFA
\u8F72\u8EFB
\u8F76\u8EFC
\u8F7C\u8EFE
\u8F83\u8F03
\u8F82\u8F05
\u8F81\u8F07
\u8F80\u8F08
\u8F7D\u8F09
\u8F7E\u8F0A
\u8F84\u8F12
\u633D<\u8F13
\u8F85\u8F14
\u8F7B\u8F15
\u8F86\u8F1B
\u8F8E\u8F1C
\u8F89\u8F1D
\u8F8B\u8F1E
\u8F8D\u8F1F
\u8F8A\u8F25
\u8F87\u8F26
\u8F88\u8F29
\u8F6E\u8F2A
\u8F8C\u8F2C
\u8F91\u8F2F
\u8F8F\u8F33
\u8F93\u8F38
\u8F90\u8F3B
\u8F97\u8F3E
\u8206\u8F3F
\u8F92\u8F40
\u6BC2\u8F42
\u8F96\u8F44
\u8F95\u8F45
\u8F98\u8F46
\u8F6C\u8F49
\u8F99\u8F4D
\u8F7F\u8F4E
\u8F9A\u8F54
\u8F70\u8F5F
\u8F94\u8F61
\u8F79\u8F62
\u8F73\u8F64
\u529E\u8FA6
\u8F9E\u8FAD
\u8FAB\u8FAE
\u8FA9\u8FAF
\u519C\u8FB2
\u8FF3\u9015
\u8FD9\u9019
\u8FDE\u9023
\u8FDB\u9032
\u8FD0\u904B
\u8FC7\u904E
\u8FBE\u9054
\u8FDD\u9055
\u9065\u9059
\u900A\u905C
\u9012\u905E
\u8FDC\u9060
\u9002<\u9069
\u8FDF\u9072
\u8FC1\u9077
\u9009\u9078
\u9057\u907A
\u8FBD\u907C
\u8FC8\u9081
\u8FD8\u9084
\u8FE9\u9087
\u8FB9\u908A
\u903B\u908F
\u9026\u9090
\u90CF\u90DF
\u90AE\u90F5
\u90D3\u9106
\u4E61\u9109
\u90B9\u9112
\u90AC\u9114
\u90E7\u9116
\u9093\u9127
\u90D1\u912D
\u90BB\u9130
\u90F8\u9132
\u90BA\u9134
\u90D0\u9136
\u909D\u913A
\u9142\u9147
\u90E6\u9148
\u4E11<\u919C
\u915D\u919E
\u533B\u91AB
\u9171\u91AC
\u9166\u91B1
\u917F\u91C0
\u8845\u91C1
\u917E\u91C3
\u917D\u91C5
\u91CA\u91CB
\u5398<\u91D0
\u9485\u91D2
\u9486\u91D3
\u9487\u91D4
\u948C\u91D5
\u948A\u91D7
\u9489\u91D8
\u948B\u91D9
\u9488\u91DD
\u9493\u91E3
\u9490\u91E4
\u948F\u91E7
\u9492\u91E9
\u9497\u91F5
\u948D\u91F7
\u9495\u91F9
\u948E\u91FA
\u497A\u91FE
\u94AF\u9200
\u94AB\u9201
\u9498\u9203
\u94AD\u9204
\u949A\u9208
\u94A0\u9209
\u949D\u920D
\u94A9\u9264\u920E
\u94A4\u9210
\u94A3\u9211
\u9491\u9212
\u949E\u9214
\u94AE\u9215
\u94A7\u921E
\u9499\u9223
\u94AC\u9225
\u949B\u9226
\u94AA\u9227
\u94CC\u922E
\u94C8\u9230
\u94B6\u9233
\u94C3\u9234
\u94B4\u9237
\u94B9\u9238
\u94CD\u9239
\u94B0\u923A
\u94B8\u923D
\u94C0\u923E
\u94BF\u923F
\u94BE\u9240
\u949C\u9245
\u94CA\u9248
\u94C9\u9249
\u94C7\u924B
\u94CB\u924D
\u94C2\u9251
\u94B7\u9255
\u94B3\u9257
\u94C6\u925A
\u94C5\u925B
\u94BA\u925E
\u94B2\u9266
\u9FED\u9448\u9268
\u94BC\u926C
\u94BD\u926D
\u94CF\u9276
\u94F0\u9278
\u94D2\u927A
\u94EC\u927B
\u94EA\u927F
\u94F6\u9280
\u94F3\u9283
\u94DC\u9285
\u94DA\u928D
\u94E3\u9291
\u94E8\u9293
\u94E2\u9296
\u94ED\u9298
\u94EB\u929A
\u94E6\u929B
\u8854\u929C
\u94D1\u92A0
\u94F7\u92A3
\u94F1\u92A5
\u94DF\u92A6
\u94F5\u92A8
\u94E5\u92A9
\u94D5\u92AA
\u94EF\u92AB
\u94D0\u92AC
\u94DE\u92B1
\u9510\u92B3
\u9500\u92B7
\u9508\u93FD\u92B9
\u9511\u92BB
\u9509\u92BC
\u94DD\u92C1
\u9512\u92C3
\u950C\u92C5
\u94A1\u92C7
\u94E4\u92CC
\u94D7\u92CF
\u950B\u92D2
\u94FB\u92D9
\u950A\u92DD
\u9513\u92DF
\u94D8\u92E3
\u9504\u92E4
\u9503\u92E5
\u9514\u92E6
\u9507\u92E8
\u94D3\u92E9
\u94FA\u92EA
\u94D6\u92EE
\u9506\u92EF
\u9502\u92F0
\u94FD\u92F1
\u950D\u92F6
\u952F\u92F8
\u94A2\u92FC
\u951E\u9301
\u5F55\u9304
\u9516\u9306
\u952B\u9307
\u9529\u9308
\u94D4\u930F
\u9525\u9310
\u9515\u9312
\u951F\u9315
\u9524\u9318
\u9531\u9319
\u94EE\u931A
\u951B\u931B
\u952C\u931F
\u952D\u9320
\u951C\u9321
\u94B1\u9322
\u9526\u9326
\u951A\u9328
\u9520\u9329
\u9521\u932B
\u9522\u932E
\u9519\u932F
\u9530\u9333
\u8868<\u9336
\u94FC\u9338
\u951D\u9340
\u9528\u9341
\u952A\u9343
\u9494\u9346
\u9534\u9347
\u9533\u9348
\u9505\u934B
\u9540\u934D
\u9537\u9354
\u94E1\u9358
\u9496\u935A
\u953B\u935B
\u953D\u9360
\u9538\u9364
\u9532\u9365
\u9518\u9369
\u9539\u936C
\u953E\u9370
\u952E\u9375
\u9536\u9376
\u9517\u937A
\u949F\u9418\u937E
\u9541\u9382
\u953F\u9384
\u9545\u9387
\u9551\u938A
\u9555\u9394
\u9501\u9396
\u9549\u9398
\u9548\u939B
\u9543\u93A1
\u94A8\u93A2
\u84E5\u93A3
\u954F\u93A6
\u94E0\u93A7
\u94E9\u93A9
\u953C\u93AA
\u9550\u93AC
\u9547\u93AE
\u9552\u93B0
\u954B\u93B2
\u954D\u93B3
\u9553\u93B5
\u9FD4\u93B6
\u954E\u93BF
\u955E\u93C3
\u955F\u93C7
\u94FE\u93C8
\u9546\u93CC
\u9559\u93CD
\u9560\u93D0
\u955D\u93D1
\u94FF\u93D7
\u9535\u93D8
\u9557\u93DC
\u9558\u93DD
\u955B\u93DE
\u94F2\u93DF
\u955C\u93E1
\u9556\u93E2
\u9542\u93E4
\u933E\u93E8
\u955A\u93F0
\u94E7\u93F5
\u9564\u93F7
\u956A\u93F9
\u497D\u93FA
\u94D9\u9403
\u94F4\u940B
\u9563\u9410
\u94F9\u9412
\u9566\u9413
\u9561\u9414
\u956B\u9419
\u9562\u941D
\u9568\u9420
\u4985\u9425
\u950E\u9426
\u950F\u9427
\u9544\u9428
\u954C\u942B
\u9570\u942E
\u4983\u942F
\u956F\u9432
\u956D\u9433
\u94C1\u9435
\u956E\u9436
\u94CE\u9438
\u94DB\u943A
\u9571\u943F
\u94F8\u9444
\u956C\u944A
\u9554\u944C
\u9274\u9452
\u9572\u9454
\u9527\u9455
\u9574\u945E
\u94C4\u9460
\u9573\u9463
\u9565\u9465
\u9567\u946D
\u94A5\u9470
\u9575\u9471
\u9576\u9472
\u954A\u9477
\u9569\u9479
\u9523\u947C
\u94BB\u947D
\u92AE\u947E
\u51FF\u947F
\u4986\u9481
\u957F\u9577
\u95E8\u9580
\u95E9\u9582
\u95EA\u9583
\u95EB\u9586
\u95EC\u9588
\u95ED\u9589
\u5F00\u958B
\u95F6\u958C
\u95F3\u958E
\u95F0\u958F
\u95F2\u9592\u9591
\u95F4\u9593
\u95F5\u9594
\u95F8\u9598
\u9602\u95A1
\u9601\u95A3
\u9600\u95A5
\u95FA\u95A8
\u95FD\u95A9
\u9603\u95AB
\u9606\u95AC
\u95FE\u95AD
\u9605\u95B1
\u960A\u95B6
\u9609\u95B9
\u960E\u95BB
\u960F\u95BC
\u960D\u95BD
\u9608\u95BE
\u960C\u95BF
\u9612\u95C3
\u677F<\u95C6
\u95F1\u95C8
\u9614\u95CA
\u9615\u95CB
\u9611\u95CC
\u9607\u95CD
\u9617\u95D0
\u9618\u95D2
\u95FF\u95D3
\u9616\u95D4
\u9619\u95D5
\u95EF\u95D6
\u5173\u95DC
\u961A\u95DE
\u9613\u95E0
\u9610\u95E1
\u8F9F<\u95E2
\u961B\u95E4
\u95FC\u95E5
\u5742>\u962A
\u9649\u9658
\u9655\u965D
\u9635\u9663
\u9634\u9670
\u9648\u9673
\u9646\u9678
\u9633\u967D
\u9667\u9689
\u961F\u968A
\u9636\u968E
\u9668\u9695
\u9645\u969B
\u968F\u96A8
\u9669\u96AA
\u9666\u96AF
\u9690\u96B1
\u9647\u96B4
\u96B6\u96B8
\u53EA<\u96BB
\u96BD\u96CB
\u867D\u96D6
\u53CC\u96D9
\u96CF\u96DB
\u6742\u96DC
\u9E21\u96DE
\u79BB<\u96E2
\u96BE\u96E3
\u4E91<\u96F2
\u7535\u96FB
\u9721\u9722
\u96FE\u9727
\u9701\u973D
\u96F3\u9742
\u972D\u9744
\u53C7\u9746
\u7075\u9748
\u53C6\u9749
\u9753\u975A
\u9759\u975C
\u4A44\u9766
\u9765\u9768
\u9F17\u9780
\u5DE9\u978F
\u9792\u97BD
\u9791\u97C3
\u97AF\u97C9
\u97E6\u97CB
\u97E7\u97CC
\u97E8\u97CD
\u97E9\u97D3
\u97EA\u97D9
\u97EC\u97DC
\u97EB\u97DE
\u97F5\u97FB
\u54CD\u97FF
\u9875\u9801
\u9876\u9802
\u9877\u9803
\u9879\u9805
\u987A\u9806
\u9878\u9807
\u987B\u9B1A\u9808
\u987C\u980A
\u9882\u980C
\u9880\u980E
\u9883\u980F
\u9884\u9810
\u987D\u9811
\u9881\u9812
\u987F\u9813
\u9887\u9817
\u9886\u9818
\u988C\u981C
\u9889\u9821
\u9890\u9824
\u988F\u9826
\u5934\u982D
\u9892\u982E
\u988A\u9830
\u988B\u9832
\u9895\u9834
\u9894\u9837
\u9888\u9838
\u9893\u9839
\u9891\u983B
\u9897\u9846
\u9898\u984C
\u989D\u984D
\u989A\u984E
\u989C\u984F
\u9899\u9852
\u989B\u9853
\u613F<\u9858
\u98A1\u9859
\u98A0\u985B
\u7C7B\u985E
\u989F\u9862
\u98A2\u9865
\u987E\u9867
\u98A4\u986B
\u98A5\u986C
\u663E\u986F
\u98A6\u9870
\u9885\u9871
\u989E\u9873
\u98A7\u9874
\u98CE\u98A8
\u98D0\u98AD
\u98D1\u98AE
\u98D2\u98AF
\u522E<\u98B3
\u98D3\u98B6
\u98D4\u98B8
\u98CF\u98BA
\u98D6\u98BB
\u98D5\u98BC
\u98D7\u98C0
\u98D8\u98C4
\u98D9\u98C6
\u98DA\u98C8
\u98DE\u98DB
\u9963\u98E0
\u9965\u98E2
\u9964\u98E3
\u9966\u98E5
\u9968\u98E9
\u996A\u98EA
\u996B\u98EB
\u996C\u98ED
\u996D\u98EF
\u996E\u98F2
\u9974\u98F4
\u9972\u98FC
\u9971\u98FD
\u9970\u98FE
\u9973\u98FF
\u997A\u9903
\u9978\u9904
\u997C\u9905
\u9977\u9909
\u517B\u990A
\u9975\u990C
\u9979\u990E
\u997B\u990F
\u997D\u9911
\u9981\u9912
\u997F\u9913
\u9982\u9915
\u997E\u9916
\u4F59<\u9918
\u80B4<\u991A
\u9984\u991B
\u9983\u991C
\u996F\u991E
\u9985\u9921
\u9986\u9928
\u7CC7\u9931
\u9967\u9933
\u9989\u9936
\u9987\u9937
\u998E\u993A
\u9969\u993C
\u998F\u993E
\u998A\u993F
\u998C\u9941
\u998D\u9943
\u9992\u9945
\u9990\u9948
\u9991\u9949
\u9993\u994A
\u9988\u994B
\u9994\u994C
\u9976\u9952
\u98E8\u9957
\u990D\u995C
\u998B\u995E
\u9995\u9962
\u9A6C\u99AC
\u9A6D\u99AD
\u51AF\u99AE
\u9A6E\u99B1
\u9A70\u99B3
\u9A6F\u99B4
\u9A72\u99B9
\u9A73\u99C1
\u9A7B\u99D0
\u9A7D\u99D1
\u9A79\u99D2
\u9A75\u99D4
\u9A7E\u99D5
\u9A80\u99D8
\u9A78\u99D9
\u9A76\u99DB
\u9A7C\u99DD
\u9A77\u99DF
\u9A88\u99E2
\u9A87\u99ED
\u9A83\u99F0
\u9A86\u99F1
\u9A8E\u99F8
\u9A8F\u99FF
\u9A8B\u9A01
\u9A8D\u9A02
\u9A93\u9A05
\u9A94\u9A0C
\u9A92\u9A0D
\u9A91\u9A0E
\u9A90\u9A0F
\u9A9B\u9A16
\u9A97\u9A19
\u9A99\u9A24
\u4BC4\u9A27
\u9A9E\u9A2B
\u9A98\u9A2D
\u9A9D\u9A2E
\u817E\u9A30
\u9A7A\u9A36
\u9A9A\u9A37
\u9A9F\u9A38
\u9AA1\u9A3E
\u84E6\u9A40
\u9A9C\u9A41
\u9A96\u9A42
\u9AA0\u9A43
\u9AA2\u9A44
\u9A71\u9A45
\u9A85\u9A4A
\u9A95\u9A4C
\u9A81\u9A4D
\u9AA3\u9A4F
\u9A84\u9A55
\u9A8C\u9A57
\u60CA<\u9A5A
\u9A7F\u9A5B
\u9AA4\u9A5F
\u9A74\u9A62
\u9AA7\u9A64
\u9AA5\u9A65
\u9AA6\u9A66
\u9A8A\u9A6A
\u9A89\u9A6B
\u80AE<\u9AAF
\u9AC5\u9ACF
\u4F53<\u9AD4
\u9ACC\u9AD5
\u9ACB\u9AD6
\u677E<\u9B06
\u9B13\u9B22
\u6597<\u9B25
\u95F9\u9B27
\u960B\u9B29
\u9604\u9B2E
\u90C1<\u9B31
\u9B36\u9B39
\u9B49\u9B4E
\u9B47\u9B58
\u9C7C\u9B5A
\u9C7D\u9B5B
\u9C7E\u9B62
\u9C80\u9B68
\u9C81\u9B6F
\u9C82\u9B74
\u9C7F\u9B77
\u9C84\u9B7A
\u9C85\u9B81
\u9C86\u9B83
\u9C8C\u9B8A
\u9C89\u9B8B
\u9C8F\u9B8D
\u9C87\u9B8E
\u9C90\u9B90
\u9C8D\u9B91
\u9C8B\u9B92
\u9C8A\u9B93
\u9C92\u9B9A
\u9C98\u9B9C
\u9C95\u9B9E
\u4C9F\u9BA3
\u9C96\u9BA6
\u9C94\u9BAA
\u9C9B\u9BAB
\u9C91\u9BAD
\u9C9C\u9BAE
\u9C93\u9BB3
\u9CAA\u9BB6
\u9C9D\u9BBA
\u9CA7\u9BC0
\u9CA0\u9BC1
\u9CA9\u9BC7
\u9CA4\u9BC9
\u9CA8\u9BCA
\u9CAC\u9BD2
\u9CBB\u9BD4
\u9CAF\u9BD5
\u9CAD\u9BD6
\u9C9E\u9BD7
\u9CB7\u9BDB
\u9CB4\u9BDD
\u9CB1\u9BE1
\u9CB5\u9BE2
\u9CB2\u9BE4
\u9CB3\u9BE7
\u9CB8\u9BE8
\u9CAE\u9BEA
\u9CB0\u9BEB
\u9CB6\u9BF0
\u9CBA\u9BF4
\u9CC0\u9BF7
\u9CAB\u9BFD
\u9CCA\u9BFF
\u9CC8\u9C01
\u9C97\u9C02
\u9CC2\u9C03
\u4CA0\u9C06
\u9CBD\u9C08
\u9CC7\u9C09
\u4CA1\u9C0C
\u9CC5\u9C0D
\u9CBE\u9C0F
\u9CC4\u9C77\u9C10
\u9CC6\u9C12
\u9CC3\u9C13
\u9CD2\u9C1C
\u9CD1\u9C1F
\u9CCB\u9C20
\u9CA5\u9C23
\u9CCF\u9C25
\u4CA2\u9C27
\u9CCE\u9C28
\u9CD0\u9C29
\u9CCD\u9C2D
\u9CC1\u9C2E
\u9CA2\u9C31
\u9CCC\u9C32
\u9CD3\u9C33
\u9CD8\u9C35
\u9CA6\u9C37
\u9CA3\u9C39
\u9CB9\u9C3A
\u9CD7\u9C3B
\u9CDB\u9C3C
\u9CD4\u9C3E
\u9CC9\u9C42
\u9CD9\u9C45
\u9CD5\u9C48
\u9CD6\u9C49
\u9CDF\u9C52
\u9CDD\u9C54
\u9CDC\u9C56
\u9CDE\u9C57
\u9C9F\u9C58
\u9CBC\u9C5D
\u9C8E\u9C5F
\u9C99\u9C60
\u9CE3\u9C63
\u9CE1\u9C64
\u9CE2\u9C67
\u9CBF\u9C68
\u9C9A\u9C6D
\u9CE0\u9C6F
\u9C88\u9C78
\u9CA1\u9C7A
\u9E1F\u9CE5
\u51EB\u9CE7
\u9E20\u9CE9
\u9E24\u9CF2
\u51E4\u9CF3
\u9E23\u9CF4
\u9E22\u9CF6
\u4D13\u9CFE
\u9E29\u9D06
\u9E28\u9D07
\u9E26\u9D09
\u9E30\u9D12
\u9E35\u9D15
\u9E33\u9D1B
\u9E32\u9D1D
\u9E2E\u9D1E
\u9E31\u9D1F
\u9E2A\u9D23
\u9E2F\u9D26
\u9E2D\u9D28
\u9E38\u9D2F
\u9E39\u9D30
\u9E3B\u9D34
\u4D15\u9D37
\u9E3F\u9D3B
\u9E3D\u9D3F
\u4D14\u9D41
\u9E3A\u9D42
\u9E3C\u9D43
\u9E40\u9D50
\u9E43\u9D51
\u9E46\u9D52
\u9E41\u9D53
\u9E48\u9D5C
\u9E45\u9D5D
\u9E44\u9D60
\u9E49\u9D61
\u9E4C\u9D6A
\u9E4F\u9D6C
\u9E50\u9D6E
\u9E4E\u9D6F
\u9E4A\u9D72
\u9E53\u9D77
\u9E4D\u9D7E
\u4D16\u9D84
\u9E2B\u9D87
\u9E51\u9D89
\u9E52\u9D8A
\u9E4B\u9D93
\u9E59\u9D96
\u9E55\u9D98
\u9E57\u9D9A
\u9E56\u9DA1
\u9E5B\u9DA5
\u9E5C\u9DA9
\u4D17\u9DAA
\u9E27\u9DAC
\u83BA\u9DAF
\u9E5F\u9DB2
\u9E64\u9DB4
\u9E60\u9DB9
\u9E61\u9DBA
\u9E58\u9DBB
\u9E63\u9DBC
\u9E5A\u9DC0
\u9E62\u9DC1
\u9E5E\u9DC2
\u4D18\u9DC9\u9DC8
\u9E5D\u9DCA
\u9E67\u9DD3
\u9E65\u9DD6
\u9E25\u9DD7
\u9E37\u9DD9
\u9E68\u9DDA
\u9E36\u9DE5
\u9E6A\u9DE6
\u9E54\u9DEB
\u9E69\u9DEF
\u9E6B\u9DF2
\u9E47\u9DF3
\u9E6C\u9DF8
\u9E70\u9DF9
\u9E6D\u9DFA
\u9E34\u9DFD
\u4D19\u9E0A\u9DFF
\u3D89\u9E02
\u9E6F\u9E07
\u9E71\u9E0C
\u9E72\u9E0F
\u9E2C\u9E15
\u9E74\u9E18
\u9E66\u9E1A
\u9E73\u9E1B
\u9E42\u9E1D
\u9E3E\u9E1E
\u5364\u9E75
\u54B8<\u9E79
\u9E7E\u9E7A
\u76D0\u9E7D
\u4E3D\u9E97
\u9EA6\u9EA5
\u9EB8\u9EA9
\u66F2<\u9EAF
\u9EB9>\u9EB4
\u9762<\u9EB5
\u9EC4\u9EC3
\u9EC9\u9ECC
\u70B9\u9EDE
\u515A<\u9EE8
\u9EEA\u9EF2
\u9EE1\u9EF6
\u9EE9\u9EF7
\u9EFE\u9EFD
\u9F0B\u9EFF
\u9F0D\u9F09
\u9F39\u9F34
\u9F50\u9F4A
\u658B\u9F4B
\u8D4D\u9F4E
\u9F51\u9F4F
\u9F7F\u9F52
\u9F80\u9F54
\u9F81\u9F55
\u9F82\u9F57
\u9F85\u9F59
\u9F87\u9F5C
\u9F83\u9F5F
\u9F86\u9F60
\u9F84\u9F61
\u51FA<\u9F63
\u9F88\u9F66
\u9F8A\u9F6A
\u9F89\u9F6C
\u9F8B\u9F72
\u816D\u9F76
\u9F8C\u9F77
\u9F99\u9F8D
\u5390\u9F8E
\u5E9E\u9F90
\u4DAE\u9F91
\u9F9A\u9F94
\u9F9B\u9F95
\u9F9F\u9F9C
\u4724\u9FC1
\u4CA4\u9FD0
\u9FD3\u9FD2`;

  // ../lossless-simplified-chinese/index.js
  var mapping = sc2tc.split(/\r?\n/);
  mapping.push("\u201C\u300C");
  mapping.push("\u2018\u300E");
  mapping.push("\u201D\u300D");
  mapping.push("\u2019\u300F");
  var overwrite = {
    "\u83B7": "\u7372\u7A6B",
    "\u7F30": "\u7E6E\u97C1",
    "\u8D5D": "\u8D0B\u8D17",
    "\u4F2A": "\u50DE\u507D",
    "\u6C47": "\u532F\u5F59",
    "\u575B": "\u58C7\u7F48",
    "\u53F0": "\u81FA\u98B1\u6AAF",
    "\u51B2": "\u6C96\u885D",
    "\u7877": "\u7906\u9E7C",
    "\u7EF1": "\u7DD4\u979D",
    "\u810F": "\u81DF\u9AD2",
    "\u8C2B": "\u8B2D\u8B7E",
    "\u94A9": "\u920E\u9264",
    "\u9FED": "\u9268\u9448",
    "\u9508": "\u92B9\u93FD",
    "\u95F2": "\u9591\u9592",
    "\u987B": "\u9808\u9B1A",
    "\u9CC4": "\u9C10\u9C77"
  };
  var t2s = {};
  var t2s_unsafe1 = {};
  var s2t = {};
  mapping.forEach((line, idx2) => {
    const r3 = line.match(/(.)(<?)(.+)/u);
    if (!r3)
      throw "wrong data format " + idx2;
    let [m4, sc, op, tc] = r3;
    let oldtc = tc;
    if (overwrite[sc])
      tc = overwrite[sc];
    if (op == "") {
      if (tc.length == 1) {
        t2s[tc] = sc;
      } else {
        if (tc[0] == ">") {
          t2s_unsafe1[tc.substring(1)] = sc;
        } else {
          t2s[tc[0]] = sc;
          tc = tc.substring(1);
          for (let i = 0; i < tc.length; i++) {
            const cp = tc.codePointAt(i);
            if (!cp)
              break;
            t2s_unsafe1[String.fromCodePoint(cp)] = sc;
          }
        }
      }
    } else {
      if (tc.length == 1) {
        t2s_unsafe1[tc] = sc;
      } else {
        while (tc && tc[0] !== ">") {
          const ch = String.fromCodePoint(tc.codePointAt(0));
          t2s_unsafe1[ch] = sc;
          tc = tc.substring(ch.length);
        }
      }
    }
    tc = oldtc.replace(/\>/g, "");
    if (op == "<") {
      s2t[sc] = tc.replace(sc, "") + sc;
    } else
      s2t[sc] = tc;
  });

  // ../node_modules/diff/lib/index.mjs
  function Diff() {
  }
  Diff.prototype = {
    diff: function diff(oldString, newString) {
      var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      var callback = options.callback;
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      this.options = options;
      var self = this;
      function done(value) {
        if (callback) {
          setTimeout(function() {
            callback(void 0, value);
          }, 0);
          return true;
        } else {
          return value;
        }
      }
      oldString = this.castInput(oldString);
      newString = this.castInput(newString);
      oldString = this.removeEmpty(this.tokenize(oldString));
      newString = this.removeEmpty(this.tokenize(newString));
      var newLen = newString.length, oldLen = oldString.length;
      var editLength = 1;
      var maxEditLength = newLen + oldLen;
      if (options.maxEditLength) {
        maxEditLength = Math.min(maxEditLength, options.maxEditLength);
      }
      var bestPath = [{
        newPos: -1,
        components: []
      }];
      var oldPos = this.extractCommon(bestPath[0], newString, oldString, 0);
      if (bestPath[0].newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
        return done([{
          value: this.join(newString),
          count: newString.length
        }]);
      }
      function execEditLength() {
        for (var diagonalPath = -1 * editLength; diagonalPath <= editLength; diagonalPath += 2) {
          var basePath = void 0;
          var addPath = bestPath[diagonalPath - 1], removePath = bestPath[diagonalPath + 1], _oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;
          if (addPath) {
            bestPath[diagonalPath - 1] = void 0;
          }
          var canAdd = addPath && addPath.newPos + 1 < newLen, canRemove = removePath && 0 <= _oldPos && _oldPos < oldLen;
          if (!canAdd && !canRemove) {
            bestPath[diagonalPath] = void 0;
            continue;
          }
          if (!canAdd || canRemove && addPath.newPos < removePath.newPos) {
            basePath = clonePath(removePath);
            self.pushComponent(basePath.components, void 0, true);
          } else {
            basePath = addPath;
            basePath.newPos++;
            self.pushComponent(basePath.components, true, void 0);
          }
          _oldPos = self.extractCommon(basePath, newString, oldString, diagonalPath);
          if (basePath.newPos + 1 >= newLen && _oldPos + 1 >= oldLen) {
            return done(buildValues(self, basePath.components, newString, oldString, self.useLongestToken));
          } else {
            bestPath[diagonalPath] = basePath;
          }
        }
        editLength++;
      }
      if (callback) {
        (function exec() {
          setTimeout(function() {
            if (editLength > maxEditLength) {
              return callback();
            }
            if (!execEditLength()) {
              exec();
            }
          }, 0);
        })();
      } else {
        while (editLength <= maxEditLength) {
          var ret = execEditLength();
          if (ret) {
            return ret;
          }
        }
      }
    },
    pushComponent: function pushComponent(components, added, removed) {
      var last = components[components.length - 1];
      if (last && last.added === added && last.removed === removed) {
        components[components.length - 1] = {
          count: last.count + 1,
          added,
          removed
        };
      } else {
        components.push({
          count: 1,
          added,
          removed
        });
      }
    },
    extractCommon: function extractCommon(basePath, newString, oldString, diagonalPath) {
      var newLen = newString.length, oldLen = oldString.length, newPos = basePath.newPos, oldPos = newPos - diagonalPath, commonCount = 0;
      while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(newString[newPos + 1], oldString[oldPos + 1])) {
        newPos++;
        oldPos++;
        commonCount++;
      }
      if (commonCount) {
        basePath.components.push({
          count: commonCount
        });
      }
      basePath.newPos = newPos;
      return oldPos;
    },
    equals: function equals(left, right) {
      if (this.options.comparator) {
        return this.options.comparator(left, right);
      } else {
        return left === right || this.options.ignoreCase && left.toLowerCase() === right.toLowerCase();
      }
    },
    removeEmpty: function removeEmpty(array) {
      var ret = [];
      for (var i = 0; i < array.length; i++) {
        if (array[i]) {
          ret.push(array[i]);
        }
      }
      return ret;
    },
    castInput: function castInput(value) {
      return value;
    },
    tokenize: function tokenize2(value) {
      return value.split("");
    },
    join: function join(chars) {
      return chars.join("");
    }
  };
  function buildValues(diff2, components, newString, oldString, useLongestToken) {
    var componentPos = 0, componentLen = components.length, newPos = 0, oldPos = 0;
    for (; componentPos < componentLen; componentPos++) {
      var component = components[componentPos];
      if (!component.removed) {
        if (!component.added && useLongestToken) {
          var value = newString.slice(newPos, newPos + component.count);
          value = value.map(function(value2, i) {
            var oldValue = oldString[oldPos + i];
            return oldValue.length > value2.length ? oldValue : value2;
          });
          component.value = diff2.join(value);
        } else {
          component.value = diff2.join(newString.slice(newPos, newPos + component.count));
        }
        newPos += component.count;
        if (!component.added) {
          oldPos += component.count;
        }
      } else {
        component.value = diff2.join(oldString.slice(oldPos, oldPos + component.count));
        oldPos += component.count;
        if (componentPos && components[componentPos - 1].added) {
          var tmp = components[componentPos - 1];
          components[componentPos - 1] = components[componentPos];
          components[componentPos] = tmp;
        }
      }
    }
    var lastComponent = components[componentLen - 1];
    if (componentLen > 1 && typeof lastComponent.value === "string" && (lastComponent.added || lastComponent.removed) && diff2.equals("", lastComponent.value)) {
      components[componentLen - 2].value += lastComponent.value;
      components.pop();
    }
    return components;
  }
  function clonePath(path) {
    return {
      newPos: path.newPos,
      components: path.components.slice(0)
    };
  }
  var characterDiff = new Diff();
  var extendedWordChars = /^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/;
  var reWhitespace = /\S/;
  var wordDiff = new Diff();
  wordDiff.equals = function(left, right) {
    if (this.options.ignoreCase) {
      left = left.toLowerCase();
      right = right.toLowerCase();
    }
    return left === right || this.options.ignoreWhitespace && !reWhitespace.test(left) && !reWhitespace.test(right);
  };
  wordDiff.tokenize = function(value) {
    var tokens = value.split(/([^\S\r\n]+|[()[\]{}'"\r\n]|\b)/);
    for (var i = 0; i < tokens.length - 1; i++) {
      if (!tokens[i + 1] && tokens[i + 2] && extendedWordChars.test(tokens[i]) && extendedWordChars.test(tokens[i + 2])) {
        tokens[i] += tokens[i + 2];
        tokens.splice(i + 1, 2);
        i--;
      }
    }
    return tokens;
  };
  var lineDiff = new Diff();
  lineDiff.tokenize = function(value) {
    var retLines = [], linesAndNewlines = value.split(/(\n|\r\n)/);
    if (!linesAndNewlines[linesAndNewlines.length - 1]) {
      linesAndNewlines.pop();
    }
    for (var i = 0; i < linesAndNewlines.length; i++) {
      var line = linesAndNewlines[i];
      if (i % 2 && !this.options.newlineIsToken) {
        retLines[retLines.length - 1] += line;
      } else {
        if (this.options.ignoreWhitespace) {
          line = line.trim();
        }
        retLines.push(line);
      }
    }
    return retLines;
  };
  var sentenceDiff = new Diff();
  sentenceDiff.tokenize = function(value) {
    return value.split(/(\S.+?[.!?])(?=\s+|$)/);
  };
  var cssDiff = new Diff();
  cssDiff.tokenize = function(value) {
    return value.split(/([{}:;,]|\s+)/);
  };
  function _typeof(obj) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function(obj2) {
        return typeof obj2;
      };
    } else {
      _typeof = function(obj2) {
        return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
      };
    }
    return _typeof(obj);
  }
  var objectPrototypeToString = Object.prototype.toString;
  var jsonDiff = new Diff();
  jsonDiff.useLongestToken = true;
  jsonDiff.tokenize = lineDiff.tokenize;
  jsonDiff.castInput = function(value) {
    var _this$options = this.options, undefinedReplacement = _this$options.undefinedReplacement, _this$options$stringi = _this$options.stringifyReplacer, stringifyReplacer = _this$options$stringi === void 0 ? function(k, v) {
      return typeof v === "undefined" ? undefinedReplacement : v;
    } : _this$options$stringi;
    return typeof value === "string" ? value : JSON.stringify(canonicalize(value, null, null, stringifyReplacer), stringifyReplacer, "  ");
  };
  jsonDiff.equals = function(left, right) {
    return Diff.prototype.equals.call(jsonDiff, left.replace(/,([\r\n])/g, "$1"), right.replace(/,([\r\n])/g, "$1"));
  };
  function canonicalize(obj, stack, replacementStack, replacer, key) {
    stack = stack || [];
    replacementStack = replacementStack || [];
    if (replacer) {
      obj = replacer(key, obj);
    }
    var i;
    for (i = 0; i < stack.length; i += 1) {
      if (stack[i] === obj) {
        return replacementStack[i];
      }
    }
    var canonicalizedObj;
    if ("[object Array]" === objectPrototypeToString.call(obj)) {
      stack.push(obj);
      canonicalizedObj = new Array(obj.length);
      replacementStack.push(canonicalizedObj);
      for (i = 0; i < obj.length; i += 1) {
        canonicalizedObj[i] = canonicalize(obj[i], stack, replacementStack, replacer, key);
      }
      stack.pop();
      replacementStack.pop();
      return canonicalizedObj;
    }
    if (obj && obj.toJSON) {
      obj = obj.toJSON();
    }
    if (_typeof(obj) === "object" && obj !== null) {
      stack.push(obj);
      canonicalizedObj = {};
      replacementStack.push(canonicalizedObj);
      var sortedKeys = [], _key;
      for (_key in obj) {
        if (obj.hasOwnProperty(_key)) {
          sortedKeys.push(_key);
        }
      }
      sortedKeys.sort();
      for (i = 0; i < sortedKeys.length; i += 1) {
        _key = sortedKeys[i];
        canonicalizedObj[_key] = canonicalize(obj[_key], stack, replacementStack, replacer, _key);
      }
      stack.pop();
      replacementStack.pop();
    } else {
      canonicalizedObj = obj;
    }
    return canonicalizedObj;
  }
  var arrayDiff = new Diff();
  arrayDiff.tokenize = function(value) {
    return value.slice();
  };
  arrayDiff.join = arrayDiff.removeEmpty = function(value) {
    return value;
  };

  // ../ptk/compiler/error.ts
  var VError2 = /* @__PURE__ */ ((VError3) => {
    VError3["NoKeys"] = "NO_KEYS";
    VError3["NoKey"] = "NO_KEY";
    VError3["NotANumber"] = "NOT_NUMBER";
    VError3["Empty"] = "EMPTY_BUFFER";
    VError3["Pattern"] = "PATTERN_MISMATCH";
    VError3["NotUnique"] = "NOT_UNIQUE";
    VError3["Mandatory"] = "MANDANTORY";
    VError3["TypeRedef"] = "TYPE_REDEF";
    VError3["MissingTagName"] = "MISSING_TAGNAME";
    VError3["UnknownType"] = "UNKNOWN_TYPE";
    VError3["ExcessiveField"] = "EXCESSIVE_FIELD";
    VError3["PtkNamed"] = "PTK_NAMED";
    VError3["PtkNoName"] = "PTK_NONAME";
    VError3["RedefineChunkTag"] = "REDEFINE_CHUNK_CHUNK_TAG";
    VError3["InvalidLinkAddress"] = "INVALID_LINK_ADDRESS";
    return VError3;
  })(VError2 || {});
  var VErrorMessage = {
    ["NO_KEYS" /* NoKeys */]: "missing keys $1",
    ["NO_KEY" /* NoKey */]: "missing key $1 for string",
    ["NOT_NUMBER" /* NotANumber */]: "not a number",
    ["PATTERN_MISMATCH" /* Pattern */]: "pattern mismatch",
    ["NOT_UNIQUE" /* NotUnique */]: "not unique",
    ["MANDANTORY" /* Mandatory */]: "mandatory field",
    ["TYPE_REDEF" /* TypeRedef */]: "redefine type",
    [VError2.MissingTypedef]: "mssing typedef",
    ["EXCESSIVE_FIELD" /* ExcessiveField */]: "excessive field",
    ["UNKNOWN_TYPE" /* UnknownType */]: "unknown type",
    ["PTK_NAMED" /* PtkNamed */]: "ptk already named",
    ["PTK_NONAME" /* PtkNoName */]: "ptk not named",
    ["EMPTY_BUFFER" /* Empty */]: "Empty buffer"
  };

  // ../ptk/compiler/template.ts
  var nop = () => {
    return [];
  };
  var addTemplate = (name2, template) => {
    Templates[name2] = template;
    if (!template.getFilters)
      template.getFilters = nop;
    if (!template.runFilter)
      template.runFilter = nop;
    if (!template.getCorrespondence)
      template.getCorrespondence = nop;
  };
  var Templates = {};
  addTemplate("generic", {});

  // ../ptk/zip/utils.ts
  var makeUint8Array = (thing) => new Uint8Array(thing.buffer || thing);
  var wasm = "AGFzbQEAAAABCgJgAABgAn9/AXwDAwIAAQUDAQACBwkCAW0CAAFjAAEIAQAKlQECSQEDfwNAIAEhAEEAIQIDQCAAQQF2IABBAXFBoIbi7X5scyEAIAJBAWoiAkEIRw0ACyABQQJ0IAA2AgAgAUEBaiIBQYACRw0ACwtJAQF/IAFBf3MhAUGAgAQhAkGAgAQgAGohAANAIAFB/wFxIAItAABzQQJ0KAIAIAFBCHZzIQEgAkEBaiICIABJDQALIAFBf3O4Cw";
  var instance13 = new WebAssembly.Instance(
    new WebAssembly.Module(Uint8Array.from(atob(wasm), (c2) => c2.charCodeAt(0)))
  );
  var { c, m: m2 } = instance13.exports;
  var pageSize = 65536;
  var crcBuffer = makeUint8Array(m2).subarray(pageSize);

  // ../ptk/denote/tokenizers.ts
  var isIASTToken = (w) => w.match(/^[a-zA-Zḍṭṇñḷṃṁṣśṅṛāīūâîû]+\d*$/);
  var tokenizeIAST = (str, opts = {}) => {
    const pattern = opts.pattern || /([a-zA-Zḍṭṇñḷṃṁṣśṅṛāīūâîû]+\d*)/ig;
    let o = str.split(pattern).filter((it) => !!it);
    if (opts.removeBlank)
      o = o.filter(isIASTToken);
    if (opts.tokenOnly)
      return o;
    else
      return o.map((raw) => {
        return [raw, null];
      });
  };
  tokenizeIAST.splitPunc = (str) => str;
  tokenizeIAST.isToken = isIASTToken;
  var tokenizeIASTPunc = (str, opts = {}) => {
    opts.pattern = /([“‘]*[a-zA-Zḍṭṇñḷṃṁṣśṅṛāīūâîû]+\d*[’।॥\.,;?\!…”–]* *)/ig;
    return tokenizeIAST(str, opts);
  };
  tokenizeIASTPunc.splitPunc = (token) => {
    const mlead = token.match(/^([“‘]*)/);
    let lead, tail;
    if (mlead) {
      lead = mlead[1];
      token = token.slice(lead.length);
    }
    const mtail = token.match(/(\d*[’।॥\.,;?\!…”–]* *)$/);
    if (mtail) {
      tail = mtail[1];
      token = token.slice(0, token.length - tail.length);
    }
    return [lead, token, tail];
  };
  tokenizeIASTPunc.isToken = (w) => w.match(/^([“‘]*[a-zA-Zḍṭṇñḷṃṁṣśṅṛāīūâîû]+\d*[’।॥\.,;?\!…”–]* *)$/);

  // src/preview.svelte
  function get_each_context5(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[19] = list[i];
    child_ctx[21] = i;
    return child_ctx;
  }
  function create_else_block3(ctx) {
    let t0;
    let t1_value = Math.round(
      /*finished*/
      ctx[2] * 100 / /*jobs*/
      ctx[1]
    ) + "";
    let t1;
    let t2;
    return {
      c() {
        t0 = text("Creating Preview Images  ");
        t1 = text(t1_value);
        t2 = text("%");
      },
      m(target, anchor) {
        insert(target, t0, anchor);
        insert(target, t1, anchor);
        insert(target, t2, anchor);
      },
      p(ctx2, dirty2) {
        if (dirty2 & /*finished, jobs*/
        6 && t1_value !== (t1_value = Math.round(
          /*finished*/
          ctx2[2] * 100 / /*jobs*/
          ctx2[1]
        ) + ""))
          set_data(t1, t1_value);
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(t0);
        if (detaching)
          detach(t1);
        if (detaching)
          detach(t2);
      }
    };
  }
  function create_if_block5(ctx) {
    let div0;
    let span0;
    let t0_value = (
      /*$images*/
      ctx[7][
        /*items*/
        ctx[5][
          /*previewimages*/
          ctx[6].length - /*defaultIndex*/
          ctx[3] - 1
        ]
      ].mark ? "\u25CF" : "\u25CB"
    );
    let t0;
    let t1;
    let br0;
    let t2;
    let br1;
    let t3;
    let br2;
    let t4;
    let br3;
    let t5;
    let br4;
    let t6;
    let t7;
    let span1;
    let t9;
    let div1;
    let swipe;
    let current;
    let mounted;
    let dispose;
    const swipe_spread_levels = [
      /*swipeConfig*/
      ctx[8],
      { defaultIndex: (
        /*defaultIndex*/
        ctx[3]
      ) }
    ];
    let swipe_props = {
      $$slots: { default: [create_default_slot2] },
      $$scope: { ctx }
    };
    for (let i = 0; i < swipe_spread_levels.length; i += 1) {
      swipe_props = assign(swipe_props, swipe_spread_levels[i]);
    }
    swipe = new swipe_default({ props: swipe_props });
    ctx[13](swipe);
    swipe.$on(
      "change",
      /*swipeChanged*/
      ctx[11]
    );
    return {
      c() {
        div0 = element("div");
        span0 = element("span");
        t0 = text(t0_value);
        t1 = space();
        br0 = element("br");
        t2 = text("\u5DE6\uFF1A\u4E0B\u4E00\u6298");
        br1 = element("br");
        t3 = text("\u53F3\uFF1A\u4E0A\u4E00\u6298");
        br2 = element("br");
        t4 = text("\u4E0A\uFF1A\u7B2C\u4E00\u6298\uFF0C");
        br3 = element("br");
        t5 = text("\u4E0B\uFF1A\u6700\u672B\u6298");
        br4 = element("br");
        t6 = text("\u9F20\u8F2A\uFF1A\u7FFB\u9801");
        t7 = space();
        span1 = element("span");
        span1.textContent = "\u2716\uFE0F";
        t9 = space();
        div1 = element("div");
        create_component(swipe.$$.fragment);
        attr(span0, "class", "bigmark");
        toggle_class(
          span0,
          "markon",
          /*$images*/
          ctx[7][
            /*items*/
            ctx[5][
              /*previewimages*/
              ctx[6].length - /*defaultIndex*/
              ctx[3] - 1
            ]
          ].mark
        );
        attr(div0, "class", "message svelte-jhy9u0");
        attr(span1, "class", "closebtn svelte-jhy9u0");
        attr(div1, "class", "swipe-holder svelte-jhy9u0");
      },
      m(target, anchor) {
        insert(target, div0, anchor);
        append(div0, span0);
        append(span0, t0);
        append(div0, t1);
        append(div0, br0);
        append(div0, t2);
        append(div0, br1);
        append(div0, t3);
        append(div0, br2);
        append(div0, t4);
        append(div0, br3);
        append(div0, t5);
        append(div0, br4);
        append(div0, t6);
        insert(target, t7, anchor);
        insert(target, span1, anchor);
        insert(target, t9, anchor);
        insert(target, div1, anchor);
        mount_component(swipe, div1, null);
        current = true;
        if (!mounted) {
          dispose = [
            listen(
              span0,
              "click",
              /*click_handler*/
              ctx[12]
            ),
            listen(
              span1,
              "click",
              /*close*/
              ctx[10]
            ),
            listen(
              div1,
              "wheel",
              /*mousewheel*/
              ctx[9]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty2) {
        if ((!current || dirty2 & /*$images, items, previewimages, defaultIndex*/
        232) && t0_value !== (t0_value = /*$images*/
        ctx2[7][
          /*items*/
          ctx2[5][
            /*previewimages*/
            ctx2[6].length - /*defaultIndex*/
            ctx2[3] - 1
          ]
        ].mark ? "\u25CF" : "\u25CB"))
          set_data(t0, t0_value);
        if (!current || dirty2 & /*$images, items, previewimages, defaultIndex*/
        232) {
          toggle_class(
            span0,
            "markon",
            /*$images*/
            ctx2[7][
              /*items*/
              ctx2[5][
                /*previewimages*/
                ctx2[6].length - /*defaultIndex*/
                ctx2[3] - 1
              ]
            ].mark
          );
        }
        const swipe_changes = dirty2 & /*swipeConfig, defaultIndex*/
        264 ? get_spread_update(swipe_spread_levels, [
          dirty2 & /*swipeConfig*/
          256 && get_spread_object(
            /*swipeConfig*/
            ctx2[8]
          ),
          dirty2 & /*defaultIndex*/
          8 && { defaultIndex: (
            /*defaultIndex*/
            ctx2[3]
          ) }
        ]) : {};
        if (dirty2 & /*$$scope, previewimages*/
        4194368) {
          swipe_changes.$$scope = { dirty: dirty2, ctx: ctx2 };
        }
        swipe.$set(swipe_changes);
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
        if (detaching)
          detach(div0);
        if (detaching)
          detach(t7);
        if (detaching)
          detach(span1);
        if (detaching)
          detach(t9);
        if (detaching)
          detach(div1);
        ctx[13](null);
        destroy_component(swipe);
        mounted = false;
        run_all(dispose);
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
        attr(img, "class", "swipe svelte-jhy9u0");
        if (!src_url_equal(img.src, img_src_value = /*previewimages*/
        ctx[6][
          /*previewimages*/
          ctx[6].length - /*idx*/
          ctx[21] - 1
        ]))
          attr(img, "src", img_src_value);
      },
      m(target, anchor) {
        insert(target, img, anchor);
      },
      p(ctx2, dirty2) {
        if (dirty2 & /*previewimages*/
        64 && !src_url_equal(img.src, img_src_value = /*previewimages*/
        ctx2[6][
          /*previewimages*/
          ctx2[6].length - /*idx*/
          ctx2[21] - 1
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
  function create_each_block5(ctx) {
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
      p(ctx2, dirty2) {
        const swipeitem_changes = {};
        if (dirty2 & /*$$scope, previewimages*/
        4194368) {
          swipeitem_changes.$$scope = { dirty: dirty2, ctx: ctx2 };
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
  function create_default_slot2(ctx) {
    let each_1_anchor;
    let current;
    let each_value = (
      /*previewimages*/
      ctx[6]
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
      p(ctx2, dirty2) {
        if (dirty2 & /*previewimages*/
        64) {
          each_value = /*previewimages*/
          ctx2[6];
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context5(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty2);
              transition_in(each_blocks[i], 1);
            } else {
              each_blocks[i] = create_each_block5(child_ctx);
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
  function create_fragment14(ctx) {
    let div;
    let current_block_type_index;
    let if_block;
    let current;
    const if_block_creators = [create_if_block5, create_else_block3];
    const if_blocks = [];
    function select_block_type(ctx2, dirty2) {
      if (
        /*ready*/
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
        attr(div, "class", "popup");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if_blocks[current_block_type_index].m(div, null);
        current = true;
      },
      p(ctx2, [dirty2]) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2, dirty2);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty2);
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
            if_block.p(ctx2, dirty2);
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
      }
    };
  }
  function instance14($$self, $$props, $$invalidate) {
    let $verticalstrip;
    let $horizontalstrip;
    let $images;
    component_subscribe($$self, verticalstrip, ($$value) => $$invalidate(14, $verticalstrip = $$value));
    component_subscribe($$self, horizontalstrip, ($$value) => $$invalidate(15, $horizontalstrip = $$value));
    component_subscribe($$self, images, ($$value) => $$invalidate(7, $images = $$value));
    let defaultIndex = 0;
    let _swiper, ready = false;
    let items = [];
    const swipeConfig = {
      autoplay: false,
      delay: 0,
      showIndicators: true,
      transitionDuration: 250
    };
    onDestroy(() => {
      swiper.set(null);
    });
    let jobs = 0, finished = 0;
    let previewimages = [];
    const drawGrid = (ctx, w, h, vs, hs, name2, nth) => {
      ctx.lineWidth = 1;
      ctx.beginPath();
      const unitw = w / vs;
      const unith = h / hs;
      ctx.strokeStyle = "rgba(0,0,0,0.5)";
      for (let i = 0; i <= vs; i++) {
        ctx.moveTo(i * unitw, 0);
        ctx.lineTo(i * unitw, h);
      }
      ctx.strokeStyle = "rgba(255,0,0,0.5)";
      for (let i = 0; i <= hs; i++) {
        ctx.moveTo(0, i * unith);
        ctx.lineTo(w, i * unith);
      }
      ctx.stroke();
    };
    const genpreview = async () => {
      const imgs = get_store_value(images);
      $$invalidate(6, previewimages = []);
      $$invalidate(1, jobs = 0), $$invalidate(2, finished = 0);
      $$invalidate(5, items = []);
      for (let i = 0; i < imgs.length; i++) {
        $$invalidate(1, jobs += imgs[i].frames?.length || 0);
      }
      const hs = $horizontalstrip, vs = $verticalstrip;
      for (let i = 0; i < imgs.length; i++) {
        const frames2 = [];
        if (!imgs[i].frames?.length)
          continue;
        for (let j2 = 0; j2 < imgs[i].frames.length || 0; j2++) {
          const [x, y, w, h] = imgs[i].frames[j2];
          frames2.push([Math.round(x), Math.round(y), Math.round(w), Math.round(h)]);
        }
        const url = await getImageURL(imgs, i);
        const img = new Image();
        img.src = url;
        await sleep(100);
        const canvas = document.createElement("CANVAS");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const rotate = imgs[i].rotate || 0;
        let ctx = canvas.getContext("2d");
        if (rotate) {
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(rotate * Math.PI / (180 * 60));
          ctx.translate(-canvas.width / 2, -canvas.height / 2);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          ctx.restore();
        } else {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
        for (let j2 = 0; j2 < frames2.length; j2++) {
          const canvas1 = document.createElement("CANVAS");
          const ctx1 = canvas1.getContext("2d");
          const w = 250;
          const h = w * 2.2;
          canvas1.width = w;
          canvas1.height = h;
          items.push(i);
          ctx1.drawImage(canvas, frames2[j2][0], frames2[j2][1], frames2[j2][2], frames2[j2][3], 0, 0, canvas1.width, canvas1.height);
          drawGrid(ctx1, w, h, vs, hs, imgs[i].name, j2 + 1);
          canvas1.toBlob(function(b) {
            previewimages.push(URL.createObjectURL(b));
            $$invalidate(2, finished++, finished);
            $$invalidate(3, defaultIndex = previewimages.length - 1);
          });
        }
      }
    };
    const mousewheel = (e) => {
      if (e.ctrlKey)
        return;
      hidepunc = true;
      if (e.deltaY > 0) {
        _swiper.prevItem();
      } else {
        _swiper.nextItem();
      }
      e.preventDefault();
    };
    const setswiper = (ele) => {
      swiper.set(ele);
    };
    const close = () => {
      showpreview.set(false);
    };
    const swipeChanged = (obj) => {
      const { active_item } = obj.detail;
      $$invalidate(3, defaultIndex = active_item);
    };
    const click_handler = () => togglemark(items[previewimages.length - defaultIndex - 1]);
    function swipe_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        _swiper = $$value;
        $$invalidate(0, _swiper);
      });
    }
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*_swiper*/
      1) {
        $:
          setswiper(_swiper);
      }
      if ($$self.$$.dirty & /*jobs, finished*/
      6) {
        $:
          $$invalidate(4, ready = jobs == finished);
      }
    };
    $:
      genpreview();
    return [
      _swiper,
      jobs,
      finished,
      defaultIndex,
      ready,
      items,
      previewimages,
      $images,
      swipeConfig,
      mousewheel,
      close,
      swipeChanged,
      click_handler,
      swipe_binding
    ];
  }
  var Preview = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance14, create_fragment14, safe_not_equal, {});
    }
  };
  var preview_default = Preview;

  // src/app.svelte
  function create_if_block6(ctx) {
    let preview;
    let current;
    preview = new preview_default({});
    return {
      c() {
        create_component(preview.$$.fragment);
      },
      m(target, anchor) {
        mount_component(preview, target, anchor);
        current = true;
      },
      i(local) {
        if (current)
          return;
        transition_in(preview.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(preview.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(preview, detaching);
      }
    };
  }
  function create_fragment15(ctx) {
    let t0;
    let table;
    let tr;
    let td0;
    let toolbar;
    let filelist;
    let t1;
    let td1;
    let thumbnail;
    let t2;
    let td2;
    let imageviewer;
    let current;
    let if_block = (
      /*$showpreview*/
      ctx[0] && create_if_block6(ctx)
    );
    toolbar = new toolbar_default({});
    filelist = new filelist_default({});
    thumbnail = new thumbnail_default({});
    imageviewer = new imageviewer_default({});
    return {
      c() {
        if (if_block)
          if_block.c();
        t0 = space();
        table = element("table");
        tr = element("tr");
        td0 = element("td");
        create_component(toolbar.$$.fragment);
        create_component(filelist.$$.fragment);
        t1 = space();
        td1 = element("td");
        create_component(thumbnail.$$.fragment);
        t2 = space();
        td2 = element("td");
        create_component(imageviewer.$$.fragment);
        attr(td0, "class", "FileList svelte-6qxba4");
        attr(td1, "class", "Thumbnail svelte-6qxba4");
        attr(td2, "class", "ImageViewer svelte-6qxba4");
      },
      m(target, anchor) {
        if (if_block)
          if_block.m(target, anchor);
        insert(target, t0, anchor);
        insert(target, table, anchor);
        append(table, tr);
        append(tr, td0);
        mount_component(toolbar, td0, null);
        mount_component(filelist, td0, null);
        append(tr, t1);
        append(tr, td1);
        mount_component(thumbnail, td1, null);
        append(tr, t2);
        append(tr, td2);
        mount_component(imageviewer, td2, null);
        current = true;
      },
      p(ctx2, [dirty2]) {
        if (
          /*$showpreview*/
          ctx2[0]
        ) {
          if (if_block) {
            if (dirty2 & /*$showpreview*/
            1) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block6(ctx2);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(t0.parentNode, t0);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        transition_in(toolbar.$$.fragment, local);
        transition_in(filelist.$$.fragment, local);
        transition_in(thumbnail.$$.fragment, local);
        transition_in(imageviewer.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        transition_out(toolbar.$$.fragment, local);
        transition_out(filelist.$$.fragment, local);
        transition_out(thumbnail.$$.fragment, local);
        transition_out(imageviewer.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (if_block)
          if_block.d(detaching);
        if (detaching)
          detach(t0);
        if (detaching)
          detach(table);
        destroy_component(toolbar);
        destroy_component(filelist);
        destroy_component(thumbnail);
        destroy_component(imageviewer);
      }
    };
  }
  function instance15($$self, $$props, $$invalidate) {
    let $showpreview;
    component_subscribe($$self, showpreview, ($$value) => $$invalidate(0, $showpreview = $$value));
    return [$showpreview];
  }
  var App = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance15, create_fragment15, safe_not_equal, {});
    }
  };
  var app_default = App;

  // src/index.ts
  var app = new app_default({ target: document.body });
  document.querySelector("#bootmessage").innerHTML = "";
  var src_default = app;
})();
