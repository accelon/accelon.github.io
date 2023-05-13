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
  function get_current_component() {
    if (!current_component)
      throw new Error("Function called outside component initialization");
    return current_component;
  }
  function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
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
  function init(component, options, instance7, create_fragment9, not_equal, props, append_styles, dirty2 = [-1]) {
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
    $$.ctx = instance7 ? instance7(component, options.props || {}, (i, ret, ...rest) => {
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
    $$.fragment = create_fragment9 ? create_fragment9($$.ctx) : false;
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
  var verticalstrip = writable(5);
  var horizontalstrip = writable(17);
  var defaultframe;
  var setTemplate = (name) => {
    if (name == "shandong") {
      defaultframe = function(idx) {
        return [1030 * (2 - idx) + 186, 139, 950, 2180];
      };
      pageframe.set(3);
    } else if (name == "qindinglongcang") {
      pageframe.set(2);
      defaultframe = function(idx) {
        return [385 * (1 - idx) + 18, 148, 364, 810];
      };
    }
  };
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
  var genjson = () => {
    const imgs = get_store_value(images);
    const out = [];
    for (let i = 0; i < imgs.length; i++) {
      const frames2 = [];
      for (let j = 0; j < imgs[i].frames?.length || 0; j++) {
        const [x, y, w, h] = imgs[i].frames[j];
        frames2.push([Math.round(x), Math.round(y), Math.round(w), Math.round(h)]);
      }
      out.push('{"name":"' + imgs[i].name + '","frames":' + JSON.stringify(frames2) + "}");
    }
    return "[" + out.join(",\n") + "]";
  };

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
  function create_fragment(ctx) {
    let button0;
    let t0;
    let t1;
    let button1;
    let t2;
    let button1_disabled_value;
    let t3;
    let button2;
    let t5;
    let mounted;
    let dispose;
    return {
      c() {
        button0 = element("button");
        t0 = text("\u{1F4C1}");
        t1 = space();
        button1 = element("button");
        t2 = text("\u{1F4BE}");
        t3 = space();
        button2 = element("button");
        button2.textContent = "\u2796";
        t5 = text(
          /*$totalframe*/
          ctx[1]
        );
        attr(button0, "title", "Alt O, Open Image Zip/PDF");
        button0.disabled = /*$dirty*/
        ctx[0];
        attr(button1, "title", "Alt S, Save");
        button1.disabled = button1_disabled_value = !/*$dirty*/
        ctx[0];
        attr(button2, "title", "Alt F, Remove Frame");
      },
      m(target, anchor) {
        insert(target, button0, anchor);
        append(button0, t0);
        insert(target, t1, anchor);
        insert(target, button1, anchor);
        append(button1, t2);
        insert(target, t3, anchor);
        insert(target, button2, anchor);
        insert(target, t5, anchor);
        if (!mounted) {
          dispose = [
            listen(
              window_1,
              "keydown",
              /*handleKeydown*/
              ctx[3]
            ),
            listen(
              button0,
              "click",
              /*openImageFiles*/
              ctx[2]
            ),
            listen(
              button1,
              "click",
              /*save*/
              ctx[4]
            ),
            listen(
              button2,
              "click",
              /*deleteframe*/
              ctx[5]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, [dirty2]) {
        if (dirty2 & /*$dirty*/
        1) {
          button0.disabled = /*$dirty*/
          ctx2[0];
        }
        if (dirty2 & /*$dirty*/
        1 && button1_disabled_value !== (button1_disabled_value = !/*$dirty*/
        ctx2[0])) {
          button1.disabled = button1_disabled_value;
        }
        if (dirty2 & /*$totalframe*/
        2)
          set_data(
            t5,
            /*$totalframe*/
            ctx2[1]
          );
      },
      i: noop,
      o: noop,
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
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function instance($$self, $$props, $$invalidate) {
    let $frames;
    let $pageframe;
    let $ratio;
    let $fileprefix;
    let $images;
    let $dirty;
    let $selectedframe;
    let $nimage;
    let $totalframe;
    component_subscribe($$self, frames, ($$value) => $$invalidate(8, $frames = $$value));
    component_subscribe($$self, pageframe, ($$value) => $$invalidate(9, $pageframe = $$value));
    component_subscribe($$self, ratio, ($$value) => $$invalidate(10, $ratio = $$value));
    component_subscribe($$self, fileprefix, ($$value) => $$invalidate(11, $fileprefix = $$value));
    component_subscribe($$self, images, ($$value) => $$invalidate(12, $images = $$value));
    component_subscribe($$self, dirty, ($$value) => $$invalidate(0, $dirty = $$value));
    component_subscribe($$self, selectedframe, ($$value) => $$invalidate(13, $selectedframe = $$value));
    component_subscribe($$self, nimage, ($$value) => $$invalidate(14, $nimage = $$value));
    component_subscribe($$self, totalframe, ($$value) => $$invalidate(1, $totalframe = $$value));
    const { ZipReader, BlobReader } = zip;
    const previmage = () => {
      let n = $nimage;
      n--;
      if (n < 0)
        n = 0;
      selectimage(n);
    };
    const zipOpts = {
      types: [
        {
          description: "Images Zip/PDF",
          accept: { "zip/*": [".zip", ".pdf"] }
        }
      ],
      excludeAcceptAllOption: true,
      multiple: false
    };
    const jsonOpts = {
      types: [
        {
          description: "json",
          accept: { "json/*": [".json"] }
        }
      ],
      excludeAcceptAllOption: true,
      multiple: false
    };
    const sortfilename = (a, b) => {
      if (parseInt(a) && parseInt(b)) {
        return parseInt(a) - parseInt(b);
      } else {
        return a.name > b.name ? 1 : -1;
      }
    };
    async function getFolder() {
      const dirHandle = await window.showDirectoryPicker();
      const out = [];
      setTemplate("shandong");
      for await (const entry of dirHandle.values()) {
        if (entry.kind == "file" && (entry.name.endsWith(".png") || entry.name.endsWith(".jpg"))) {
          out.push({
            entry,
            name: entry.name,
            frames: out.length ? null : []
          });
        }
      }
      out.sort(sortfilename);
      if (out.length > 2)
        out[out.length - 1].frames = [];
      nimage.set(0);
      images.set(out);
      fileprefix.set(dirHandle.name);
    }
    async function openZip(file) {
      const zip2 = new ZipReader(new BlobReader(file));
      const entries = await zip2.getEntries();
      const out = [];
      setTemplate("shandong");
      entries.forEach((entry) => {
        if (entry.filename.endsWith(".jpg")) {
          let at = entry.filename.lastIndexOf("/");
          if (at == -1)
            at = entry.filename.lastIndexOf("\\");
          out.push({
            name: entry.filename.slice(at + 1),
            entry,
            zip: zip2,
            frames: out.length ? null : []
          });
        }
      });
      out.sort(sortfilename);
      if (out.length > 2)
        out[out.length - 1].frames = [];
      return out;
    }
    let pdf;
    async function openPDF(file) {
      setTemplate("qindinglongcang");
      const arraybuffer = await file.arrayBuffer();
      const typedarray = new Uint8Array(arraybuffer);
      pdf = await pdfjsLib.getDocument(typedarray).promise;
      const out = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        out.push({
          name: i,
          pdf,
          page: i,
          frames: out.length ? null : []
        });
      }
      if (out.length > 2)
        out[out.length - 1].frames = [];
      return out;
    }
    let filename = "";
    async function openImageFiles() {
      const filehandles = await window.showOpenFilePicker(zipOpts);
      const file = await filehandles[0].getFile();
      filename = file.name.toLowerCase();
      let out = [];
      if (filename.endsWith(".zip"))
        out = await openZip(file);
      else if (filename.endsWith(".pdf"))
        out = await openPDF(file);
      else
        return;
      nimage.set(0);
      images.set(out);
      fileprefix.set(filename.replace(/\.[a-z]+$/, ""));
    }
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
      let dy = 0, dx = 0;
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
      } else if (ctrl) {
        dx *= 5;
        dy *= 5;
      } else {
        dx *= 2.5;
        dy *= 2.5;
      }
      const frms = $frames;
      const sel = $selectedframe;
      for (let i = 0; i < frms.length; i++) {
        let [x, y, w, h] = frms[i];
        x += dx;
        y += dy;
        if (1 << i & sel || !sel) {
          frms[i] = [x, y, w, h];
        }
      }
      frames.set(frms);
    }
    function handleKeydown(evt) {
      const key = evt.key.toLowerCase();
      const alt = evt.altKey;
      if (key == "f5") {
        evt.preventDefault();
        return;
      }
      if (alt && key == "n" || key == "enter") {
        nextimage();
        ;
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
      }
      if (evt.srcElement.nodeName == "INPUT" || evt.srcElement.nodeName == "TEXTAREA" || evt.srcElement.nodeName == "BUTTON")
        return;
      if (key == "arrowdown" || key == "arrowup" || key == "arrowright" || key == "arrowleft") {
        handleFrameMove(evt);
        evt.preventDefault();
      }
    }
    const load = async () => {
      if (!$images.length) {
        alert("need images");
        return;
      }
      const filehandles = await window.showOpenFilePicker(jsonOpts);
      const file = await filehandles[0].getFile();
      const json = JSON.parse(await file.text());
      const imgs = $images;
      if (json.length !== imgs.length) {
        alert("zip json missmatch");
        return;
      }
      for (let i = 0; i < imgs.length; i++) {
        imgs[i].frames = json[i].frames;
      }
      images.set(imgs);
    };
    const save = () => {
      selectimage(0);
      const data = genjson();
      dirty.set(false);
      const outfn = $fileprefix + ".json";
      createBrowserDownload(outfn, data);
    };
    const reset = () => {
      const frms = [];
      const r = $ratio;
      for (let i = 0; i < $pageframe; i++) {
        frms.push(defaultframe(i));
      }
      frames.set(frms.map((f) => resizeframe(f, r)));
    };
    const deleteframe = () => {
      const frms = $frames;
      frms.shift();
      frames.set(frms);
      selectedframe.set(0);
    };
    return [$dirty, $totalframe, openImageFiles, handleKeydown, save, deleteframe];
  }
  var Toolbar = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance, create_fragment, safe_not_equal, {});
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
        ctx[15]) % 2) + " svelte-6svlme");
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
        ctx2[15]) % 2) + " svelte-6svlme")) {
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
        attr(line, "class", "hstrip svelte-6svlme");
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
  function create_fragment2(ctx) {
    let g;
    let text0;
    let t0;
    let text0_y_value;
    let text1;
    let t1_value = Math.floor(
      /*x*/
      ctx[1] / /*r*/
      ctx[5]
    ) + "";
    let t1;
    let t2;
    let t3_value = Math.floor(
      /*y*/
      ctx[2] / /*r*/
      ctx[5]
    ) + "";
    let t3;
    let t4;
    let t5_value = Math.floor(
      /*w*/
      ctx[3] / /*r*/
      ctx[5]
    ) + "";
    let t5;
    let t6;
    let t7_value = Math.floor(
      /*h*/
      ctx[4] / /*r*/
      ctx[5]
    ) + "";
    let t7;
    let text1_x_value;
    let text1_y_value;
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
        t2 = text(",");
        t3 = text(t3_value);
        t4 = text(":");
        t5 = text(t5_value);
        t6 = text(",");
        t7 = text(t7_value);
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
        attr(text0, "class", "caption svelte-6svlme");
        toggle_class(
          text0,
          "selected",
          /*selected*/
          ctx[12]
        );
        attr(text1, "x", text1_x_value = /*x*/
        ctx[1] + 30);
        attr(text1, "y", text1_y_value = /*y*/
        ctx[2] - 5);
        attr(text1, "class", "pointerpos svelte-6svlme");
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
        attr(rect0, "class", "step svelte-6svlme");
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
        attr(rect1, "class", "grip svelte-6svlme");
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
        attr(rect2, "class", "gripx svelte-6svlme");
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
        attr(rect3, "class", "grip svelte-6svlme");
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
        attr(rect4, "class", "gripy svelte-6svlme");
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
        append(text1, t2);
        append(text1, t3);
        append(text1, t4);
        append(text1, t5);
        append(text1, t6);
        append(text1, t7);
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
        if (dirty2 & /*x, r*/
        34 && t1_value !== (t1_value = Math.floor(
          /*x*/
          ctx[1] / /*r*/
          ctx[5]
        ) + ""))
          set_data(t1, t1_value);
        if (dirty2 & /*y, r*/
        36 && t3_value !== (t3_value = Math.floor(
          /*y*/
          ctx[2] / /*r*/
          ctx[5]
        ) + ""))
          set_data(t3, t3_value);
        if (dirty2 & /*w, r*/
        40 && t5_value !== (t5_value = Math.floor(
          /*w*/
          ctx[3] / /*r*/
          ctx[5]
        ) + ""))
          set_data(t5, t5_value);
        if (dirty2 & /*h, r*/
        48 && t7_value !== (t7_value = Math.floor(
          /*h*/
          ctx[4] / /*r*/
          ctx[5]
        ) + ""))
          set_data(t7, t7_value);
        if (dirty2 & /*x*/
        2 && text1_x_value !== (text1_x_value = /*x*/
        ctx[1] + 30)) {
          attr(text1, "x", text1_x_value);
        }
        if (dirty2 & /*y*/
        4 && text1_y_value !== (text1_y_value = /*y*/
        ctx[2] - 5)) {
          attr(text1, "y", text1_y_value);
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
  function instance2($$self, $$props, $$invalidate) {
    let { expanding } = $$props;
    let { x = 0 } = $$props;
    let { y = 0 } = $$props;
    let { w = 50 } = $$props;
    let { h = 50 } = $$props;
    let { r } = $$props;
    let { caption = "" } = $$props;
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
        $$invalidate(5, r = $$props2.r);
      if ("caption" in $$props2)
        $$invalidate(6, caption = $$props2.caption);
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
      r,
      caption,
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
      init(this, options, instance2, create_fragment2, safe_not_equal, {
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
  function create_fragment3(ctx) {
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
  function instance3($$self, $$props, $$invalidate) {
    let theframes;
    let $selectedframe;
    let $frames;
    let $verticalstrip;
    let $horizontalstrip;
    component_subscribe($$self, selectedframe, ($$value) => $$invalidate(7, $selectedframe = $$value));
    component_subscribe($$self, frames, ($$value) => $$invalidate(13, $frames = $$value));
    component_subscribe($$self, verticalstrip, ($$value) => $$invalidate(8, $verticalstrip = $$value));
    component_subscribe($$self, horizontalstrip, ($$value) => $$invalidate(9, $horizontalstrip = $$value));
    let { height = 400 } = $$props;
    let { width = 400 } = $$props;
    let { start = "" } = $$props;
    let { r = 1 } = $$props;
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
        $$invalidate(0, height = $$props2.height);
      if ("width" in $$props2)
        $$invalidate(1, width = $$props2.width);
      if ("start" in $$props2)
        $$invalidate(2, start = $$props2.start);
      if ("r" in $$props2)
        $$invalidate(3, r = $$props2.r);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*$frames*/
      8192) {
        $:
          $$invalidate(6, theframes = $frames || []);
      }
    };
    return [
      height,
      width,
      start,
      r,
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
      init(this, options, instance3, create_fragment3, safe_not_equal, { height: 0, width: 1, start: 2, r: 3 });
    }
  };
  var croppers_default = Croppers;

  // src/help.svelte
  function create_fragment4(ctx) {
    let pre;
    return {
      c() {
        pre = element("pre");
        pre.innerHTML = `<span class="title svelte-1tue53g">Folio Crop \u5716\u6846\u88C1\u5207\u5C0D\u9F4A</span> 2023.5.13 <a href="https://www.youtube.com/watch?v=UvtJITtLz1c" target="_new" class="svelte-1tue53g">\u64CD\u4F5C\u793A\u7BC4\u5F71\u7247</a>
\u{1F4C1}\u958B\u555FZip\u6216PDF(Alt-O)  \u{1F4BE}\u5132\u5B58\u5EA7\u6A19\u6A94(Alt-S)  \u2796\u522A\u9664\u5716\u6846(Alt-D)  \u6578\u5B57\uFF1A\u76EE\u524D\u5716\u6846\u6578
\u91CD\u7F6E\u5716\u6846(Alt-R)   \u8F09\u5165\u5EA7\u6A19\u6A94(Alt-L)   \u4E0B\u4E00\u62CD(Alt-N, Enter)   \u4E0A\u4E00\u62CD(Alt-P)
\u9EDE \u7E2E\u5716 \u4E0A\u4E0B\u5C0D\u8ABF\u3002

\u9EDE\u4EFB\u4F55\u4E00\u500B\u5716\u6846\uFF0C\u5E8F\u865F\u8B8A\u7D05\u8272\u6642\uFF0C\u8868\u793A\u9078\u53D6\uFF0C\u518D\u9EDE\u4E00\u4E0B\u53D6\u6D88\u9078\u53D6\u3002
\u4E0A\u4E0B\u5DE6\u53F3\u9375\u79FB\u52D5\u5716\u6846\uFF08\u9078\u53D6\u4E2D\u6216\u5168\u90E8\uFF09\uFF0C\u540C\u6642\u6309Alt\u5FAE\u8ABF\uFF0C\u6309Ctrl\u901F\u8ABF\u3002
\u6309\u5716\u6846\u5DE6\u908A\u6C34\u5E73\u65B9\u5411\u79FB\u52D5\uFF0C\u6309\u9802\u908A\u5782\u771F\u65B9\u5411\u79FB\u52D5\u3002
\u53F3\u908A\u548C\u5E95\u908A\u8ABF\u6574\u5716\u6846\u5927\u5C0F\uFF08\u975E\u5FC5\u8981\u52FF\u8ABF\u6574\u5927\u5C0F\uFF09\u3002
\u8B93\u5716\u6846\u7B2C\u4E00\u884C\u548C\u6700\u5F8C\u4E00\u884C\u6587\u5B57\u90FD\u5728\u7E2E\u5716\u5167\uFF0C\u4E26\u76E1\u91CF\u5C45\u4E2D\u5C0D\u9F4A\u3002
\u5373\u4F7F\u6846\u5167\u5C11\u65BC\u4E94\u884C\u6587\u5B57\uFF0C\u4E5F\u4E0D\u8981\u6539\u8B8A\u5716\u6846\u5927\u5C0F\uFF0C\u5377\u672B\u6821\u6CE8\u53EF\u4EE5\u5927\u81F4\u5C0D\u9F4A\u5373\u53EF\uFF08\u5B57\u9AD4\u8F03\u5C0F\u6545\uFF09\u3002
\u6C92\u6709\u5167\u6587\u6216\u6CE8\u91CB\u7684\u5716\u62CD\uFF0C\u5982\u5C01\u9762\u88E1\uFF0C\u9808\u522A\u6389\u5716\u6846\u3002\u4E00\u5377\u5167\u7B2C\u4E00\u62CD\u548C\u6700\u5F8C\u4E00\u62CD\u9810\u8A2D\u7121\u5716\u6846\u3002

\u5EFA\u8B70\u4E00\u958B\u59CB\u6309F11\u9032\u5165\u5168\u87A2\u5E55\u6A21\u5F0F\u3002
\u6309 Ctrl + - \u8ABF\u6574\u597D\u700F\u89BD\u5668\u7684\u89E3\u6790\u5EA6\uFF0C\u7121\u9808\u7D93\u5E38\u6539\u52D5\u3002
\u8ABF\u6574\u8996\u7A97\u5927\u5C0F\u53CA\u89E3\u6790\u5EA6\uFF0C\u6846\u53EF\u80FD\u6703\u5C0D\u4E0D\u6E96\uFF0C\u6B64\u6642\u4E0D\u5FC5\u8ABF\u6574\uFF0C\u53EA\u8981\u9EDE\u5176\u4ED6\u62CD\uFF0C\u518D\u9EDE\u56DE\u4F86\u5373\u6B63\u5E38\u3002

\u5B58\u6A94\u5728\u700F\u89BD\u5668\u7684\u300C\u4E0B\u8F09\u300D(CTRL+J)\uFF0C\u540C\u4E00\u5377\u5B58\u6A94\u8D85\u904E\u4E00\u6B21\uFF0C\u700F\u89BD\u5668\u6703\u4F9D\u5E8F\u7522\u751F xxx(1).json , xxx(2).json \u3002
\u53EA\u9808\u4E0A\u50B3\u6700\u65B0\u7684\u5B58\u6A94\uFF0C\u5B58\u6A94\u7684\u6A94\u540D\u5FC5\u9808\u548Czip/pdf\u4E00\u81F4\uFF0C\u53730001-001\u592901.zip \u7684\u5B58\u6A94\u70BA 0001-001\u592901.json
\u4F8B\u5982\u540C\u4E00\u5377\u6309\u4E864\u6B21\u5B58\u6A94\uFF0C\u9808\u5C07 0001-001\u592901(3).json \u66F4\u540D\u70BA 0001-001\u592901.json \u4E26\u4E0A\u50B3\u3002

\u5EFA\u8B70\u5C07\u6578\u500B\u5DE5\u4F5C\u6A94\u6848\u8907\u88FD\u5230\u300C\u6587\u4EF6\u300D\uFF0C\u958B\u555F\u5C31\u4E0D\u5FC5\u6BCF\u6B21\u9078\u6587\u4EF6\u593E\u3002
`;
        attr(pre, "class", "svelte-1tue53g");
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
      init(this, options, null, create_fragment4, safe_not_equal, {});
    }
  };
  var help_default = Help;

  // src/imageviewer.svelte
  function create_else_block(ctx) {
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
  function create_if_block(ctx) {
    let span;
    let t0;
    let t1;
    let div;
    let croppers;
    let t2;
    let img;
    let img_src_value;
    let current;
    croppers = new croppers_default({
      props: {
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
        span = element("span");
        t0 = text(
          /*$fileprefix*/
          ctx[4]
        );
        t1 = space();
        div = element("div");
        create_component(croppers.$$.fragment);
        t2 = space();
        img = element("img");
        attr(span, "class", "fileprefix svelte-163afnm");
        attr(div, "class", "croppers svelte-163afnm");
        attr(img, "id", "image1");
        if (!src_url_equal(img.src, img_src_value = /*imageurl*/
        ctx[0]))
          attr(img, "src", img_src_value);
        attr(img, "class", "image svelte-163afnm");
        attr(img, "alt", "noimage");
      },
      m(target, anchor) {
        insert(target, span, anchor);
        append(span, t0);
        insert(target, t1, anchor);
        insert(target, div, anchor);
        mount_component(croppers, div, null);
        insert(target, t2, anchor);
        insert(target, img, anchor);
        current = true;
      },
      p(ctx2, dirty2) {
        if (!current || dirty2 & /*$fileprefix*/
        16)
          set_data(
            t0,
            /*$fileprefix*/
            ctx2[4]
          );
        const croppers_changes = {};
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
          detach(span);
        if (detaching)
          detach(t1);
        if (detaching)
          detach(div);
        destroy_component(croppers);
        if (detaching)
          detach(t2);
        if (detaching)
          detach(img);
      }
    };
  }
  function create_fragment5(ctx) {
    let current_block_type_index;
    let if_block;
    let if_block_anchor;
    let current;
    const if_block_creators = [create_if_block, create_else_block];
    const if_blocks = [];
    function select_block_type(ctx2, dirty2) {
      if (
        /*imageurl*/
        ctx2[0]
      )
        return 0;
      return 1;
    }
    current_block_type_index = select_block_type(ctx, -1);
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    return {
      c() {
        if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
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
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if_blocks[current_block_type_index].d(detaching);
        if (detaching)
          detach(if_block_anchor);
      }
    };
  }
  function instance4($$self, $$props, $$invalidate) {
    let $nimage;
    let $images;
    let $fileprefix;
    component_subscribe($$self, nimage, ($$value) => $$invalidate(5, $nimage = $$value));
    component_subscribe($$self, images, ($$value) => $$invalidate(6, $images = $$value));
    component_subscribe($$self, fileprefix, ($$value) => $$invalidate(4, $fileprefix = $$value));
    let imageurl = "", r = 1, height = 100, width = 100;
    async function getImageURL() {
      if (!$images?.length)
        return;
      const item = $images[$nimage];
      if (item.zip) {
        $$invalidate(0, imageurl = URL.createObjectURL(await item.entry.getData(new zip.BlobWriter())));
      } else if (item.pdf) {
        await item.pdf.getPage(item.page).then(async function(page) {
          const viewport = page.getViewport({ scale: 1 });
          const canvas = document.createElement("canvas");
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({
            canvasContext: canvas.getContext("2d"),
            viewport
          }).promise;
          $$invalidate(0, imageurl = canvas.toDataURL("image/png"));
        });
      } else {
        const imagefile = await item.entry.getFile();
        $$invalidate(0, imageurl = URL.createObjectURL(imagefile));
      }
      setTimeout(
        () => {
          const naturalWidth = document.getElementById("image1").naturalWidth;
          $$invalidate(2, height = document.getElementById("image1").height);
          $$invalidate(3, width = document.getElementById("image1").width);
          $$invalidate(1, r = width / naturalWidth);
          ratio.set(r);
          const frms = ($images[$nimage].frames || [defaultframe(0), defaultframe(1), defaultframe(2)]).map((f) => resizeframe(f, r));
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
    return [imageurl, r, height, width, $fileprefix, $nimage, $images];
  }
  var Imageviewer = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance4, create_fragment5, safe_not_equal, {});
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
        attr(span0, "class", "svelte-12vaa8r");
        toggle_class(
          span0,
          "done",
          /*image*/
          ctx[3].frames
        );
        attr(span1, "class", "framecount svelte-12vaa8r");
        attr(div, "class", "svelte-12vaa8r");
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
        attr(div, "class", "filelist svelte-12vaa8r");
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
  function instance5($$self, $$props, $$invalidate) {
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
      init(this, options, instance5, create_fragment6, safe_not_equal, {});
    }
  };
  var filelist_default = Filelist;

  // src/thumbnail.svelte
  function create_fragment7(ctx) {
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
        attr(canvas0, "class", "svelte-v4ijpf");
        attr(canvas1_1, "class", "svelte-v4ijpf");
        attr(div, "class", "thumbnails svelte-v4ijpf");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, canvas0);
        ctx[5](canvas0);
        append(div, br);
        append(div, canvas1_1);
        ctx[6](canvas1_1);
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
        ctx[5](null);
        ctx[6](null);
        mounted = false;
        dispose();
      }
    };
  }
  function instance6($$self, $$props, $$invalidate) {
    let $frames;
    let $verticalstrip;
    let $ratio;
    let $selectedframe;
    component_subscribe($$self, frames, ($$value) => $$invalidate(4, $frames = $$value));
    component_subscribe($$self, verticalstrip, ($$value) => $$invalidate(7, $verticalstrip = $$value));
    component_subscribe($$self, ratio, ($$value) => $$invalidate(8, $ratio = $$value));
    component_subscribe($$self, selectedframe, ($$value) => $$invalidate(9, $selectedframe = $$value));
    let canvas1, canvas2;
    const updateThumbnail = () => {
      const img1 = document.getElementById("image1");
      let nframe = -1;
      if ($selectedframe)
        nframe = Math.log2($selectedframe);
      const frms = $frames;
      let c1 = canvas1, c2 = canvas2;
      if (swap) {
        c2 = canvas1;
        c1 = canvas2;
      }
      if (!c1 || !c2)
        return;
      let ctx1 = c1.getContext("2d");
      let ctx2 = c2.getContext("2d");
      ctx1.clearRect(0, 0, canvas1.width, c1.height);
      ctx2.clearRect(0, 0, canvas2.width, c2.height);
      if (!~nframe || !img1)
        return;
      const r = $ratio;
      const frame = frms[nframe];
      if (!frame)
        return;
      const vert = $verticalstrip;
      let x = frame[0], y = frame[1], w = frame[2] / vert, h = frame[3];
      c1.width = w;
      c1.height = h;
      ctx1.drawImage(img1, x / r, y / r, w / r, h / r, 0, 0, w, h);
      x = frame[0] + w * (vert - 1);
      c2.width = w;
      c2.height = h;
      ctx2.drawImage(img1, x / r, y / r, w / r, h / r, 0, 0, w, h);
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
      if ($$self.$$.dirty & /*$frames, swap*/
      24) {
        $:
          updateThumbnail($frames, swap);
      }
    };
    return [
      canvas1,
      canvas2,
      swapthumbnail,
      swap,
      $frames,
      canvas0_binding,
      canvas1_1_binding
    ];
  }
  var Thumbnail = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance6, create_fragment7, safe_not_equal, {});
    }
  };
  var thumbnail_default = Thumbnail;

  // src/app.svelte
  function create_fragment8(ctx) {
    let table;
    let tr;
    let td0;
    let toolbar;
    let filelist;
    let t0;
    let td1;
    let thumbnail;
    let t1;
    let td2;
    let imageviewer;
    let current;
    toolbar = new toolbar_default({});
    filelist = new filelist_default({});
    thumbnail = new thumbnail_default({});
    imageviewer = new imageviewer_default({});
    return {
      c() {
        table = element("table");
        tr = element("tr");
        td0 = element("td");
        create_component(toolbar.$$.fragment);
        create_component(filelist.$$.fragment);
        t0 = space();
        td1 = element("td");
        create_component(thumbnail.$$.fragment);
        t1 = space();
        td2 = element("td");
        create_component(imageviewer.$$.fragment);
        attr(td0, "class", "FileList svelte-1czj0lb");
        attr(td1, "class", "Thumbnail svelte-1czj0lb");
        attr(td2, "class", "ImageViewer svelte-1czj0lb");
      },
      m(target, anchor) {
        insert(target, table, anchor);
        append(table, tr);
        append(tr, td0);
        mount_component(toolbar, td0, null);
        mount_component(filelist, td0, null);
        append(tr, t0);
        append(tr, td1);
        mount_component(thumbnail, td1, null);
        append(tr, t1);
        append(tr, td2);
        mount_component(imageviewer, td2, null);
        current = true;
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(toolbar.$$.fragment, local);
        transition_in(filelist.$$.fragment, local);
        transition_in(thumbnail.$$.fragment, local);
        transition_in(imageviewer.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(toolbar.$$.fragment, local);
        transition_out(filelist.$$.fragment, local);
        transition_out(thumbnail.$$.fragment, local);
        transition_out(imageviewer.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(table);
        destroy_component(toolbar);
        destroy_component(filelist);
        destroy_component(thumbnail);
        destroy_component(imageviewer);
      }
    };
  }
  var App = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, null, create_fragment8, safe_not_equal, {});
    }
  };
  var app_default = App;

  // src/index.ts
  var app = new app_default({ target: document.body });
  document.querySelector("#bootmessage").innerHTML = "";
  var src_default = app;
})();
