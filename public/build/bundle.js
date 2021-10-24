
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop$1;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
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
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
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
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop$1;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop$1;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
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
        return text(' ');
    }
    function empty() {
        return text('');
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
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_options(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            option.selected = ~value.indexOf(option.__value);
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
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
        flushing = false;
        seen_callbacks.clear();
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
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
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
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
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
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
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
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
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop$1,
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
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop$1;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
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
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop$1) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
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
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop$1) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop$1;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop$1;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop$1;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const LOCATION = {};
    const ROUTER = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    function getLocation(source) {
      return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
      };
    }

    function createHistory(source, options) {
      const listeners = [];
      let location = getLocation(source);

      return {
        get location() {
          return location;
        },

        listen(listener) {
          listeners.push(listener);

          const popstateListener = () => {
            location = getLocation(source);
            listener({ location, action: "POP" });
          };

          source.addEventListener("popstate", popstateListener);

          return () => {
            source.removeEventListener("popstate", popstateListener);

            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
          };
        },

        navigate(to, { state, replace = false } = {}) {
          state = { ...state, key: Date.now() + "" };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            if (replace) {
              source.history.replaceState(state, null, to);
            } else {
              source.history.pushState(state, null, to);
            }
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }

          location = getLocation(source);
          listeners.forEach(listener => listener({ location, action: "PUSH" }));
        }
      };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
      let index = 0;
      const stack = [{ pathname: initialPathname, search: "" }];
      const states = [];

      return {
        get location() {
          return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
          get entries() {
            return stack;
          },
          get index() {
            return index;
          },
          get state() {
            return states[index];
          },
          pushState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            index++;
            stack.push({ pathname, search });
            states.push(state);
          },
          replaceState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            stack[index] = { pathname, search };
            states[index] = state;
          }
        }
      };
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = Boolean(
      typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
    );
    const globalHistory = createHistory(canUseDOM ? window : createMemorySource());
    const { navigate } = globalHistory;

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    const paramRe = /^:(.+)/;

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    function startsWith(string, search) {
      return string.substr(0, search.length) === search;
    }

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    function isRootSegment(segment) {
      return segment === "";
    }

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    function isDynamic(segment) {
      return paramRe.test(segment);
    }

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    function isSplat(segment) {
      return segment[0] === "*";
    }

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri) {
      return (
        uri
          // Strip starting/ending `/`
          .replace(/(^\/+|\/+$)/g, "")
          .split("/")
      );
    }

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    function stripSlashes(str) {
      return str.replace(/(^\/+|\/+$)/g, "");
    }

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
      const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
            score += SEGMENT_POINTS;

            if (isRootSegment(segment)) {
              score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
              score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
              score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
              score += STATIC_POINTS;
            }

            return score;
          }, 0);

      return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
      return (
        routes
          .map(rankRoute)
          // If two routes have the exact same score, we go by index instead
          .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
          )
      );
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
      let match;
      let default_;

      const [uriPathname] = uri.split("?");
      const uriSegments = segmentize(uriPathname);
      const isRootUri = uriSegments[0] === "";
      const ranked = rankRoutes(routes);

      for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
          default_ = {
            route,
            params: {},
            uri
          };
          continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
          const routeSegment = routeSegments[index];
          const uriSegment = uriSegments[index];

          if (routeSegment !== undefined && isSplat(routeSegment)) {
            // Hit a splat, just grab the rest, and return a match
            // uri:   /files/documents/work
            // route: /files/* or /files/*splatname
            const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

            params[splatName] = uriSegments
              .slice(index)
              .map(decodeURIComponent)
              .join("/");
            break;
          }

          if (uriSegment === undefined) {
            // URI is shorter than the route, no match
            // uri:   /users
            // route: /users/:userId
            missed = true;
            break;
          }

          let dynamicMatch = paramRe.exec(routeSegment);

          if (dynamicMatch && !isRootUri) {
            const value = decodeURIComponent(uriSegment);
            params[dynamicMatch[1]] = value;
          } else if (routeSegment !== uriSegment) {
            // Current segments don't match, not dynamic, not splat, so no match
            // uri:   /users/123/settings
            // route: /users/:id/profile
            missed = true;
            break;
          }
        }

        if (!missed) {
          match = {
            route,
            params,
            uri: "/" + uriSegments.slice(0, index).join("/")
          };
          break;
        }
      }

      return match || default_ || null;
    }

    /**
     * Check if the `path` matches the `uri`.
     * @param {string} path
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
      return pick([route], uri);
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    function addQuery(pathname, query) {
      return pathname + (query ? `?${query}` : "");
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
      // /foo/bar, /baz/qux => /foo/bar
      if (startsWith(to, "/")) {
        return to;
      }

      const [toPathname, toQuery] = to.split("?");
      const [basePathname] = base.split("?");
      const toSegments = segmentize(toPathname);
      const baseSegments = segmentize(basePathname);

      // ?a=b, /users?b=c => /users?a=b
      if (toSegments[0] === "") {
        return addQuery(basePathname, toQuery);
      }

      // profile, /users/789 => /users/789/profile
      if (!startsWith(toSegments[0], ".")) {
        const pathname = baseSegments.concat(toSegments).join("/");

        return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
      }

      // ./       , /users/123 => /users/123
      // ../      , /users/123 => /users
      // ../..    , /users/123 => /
      // ../../one, /a/b/c/d   => /a/b/one
      // .././one , /a/b/c/d   => /a/b/c/one
      const allSegments = baseSegments.concat(toSegments);
      const segments = [];

      allSegments.forEach(segment => {
        if (segment === "..") {
          segments.pop();
        } else if (segment !== ".") {
          segments.push(segment);
        }
      });

      return addQuery("/" + segments.join("/"), toQuery);
    }

    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    function combinePaths(basepath, path) {
      return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
    }

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
      return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      );
    }

    /* node_modules\svelte-routing\src\Router.svelte generated by Svelte v3.44.0 */

    function create_fragment$x(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	let $location;
    	let $routes;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(6, $routes = value));
    	const activeRoute = writable(null);
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(5, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(7, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (activeRoute === null) {
    			return base;
    		}

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	function registerRoute(route) {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => {
    				rs.push(route);
    				return rs;
    			});
    		}
    	}

    	function unregisterRoute(route) {
    		routes.update(rs => {
    			const index = rs.indexOf(route);
    			rs.splice(index, 1);
    			return rs;
    		});
    	}

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = globalHistory.listen(history => {
    				location.set(history.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ['basepath', 'url'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		derived,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		pick,
    		match,
    		stripSlashes,
    		combinePaths,
    		basepath,
    		url,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$routes,
    		$base
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 128) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			{
    				const { path: basepath } = $base;

    				routes.update(rs => {
    					rs.forEach(r => r.path = combinePaths(basepath, r._path));
    					return rs;
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 96) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [
    		routes,
    		location,
    		base,
    		basepath,
    		url,
    		$location,
    		$routes,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, { basepath: 3, url: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$x.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-routing\src\Route.svelte generated by Svelte v3.44.0 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*routeParams*/ 4,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context = ctx => ({
    	params: /*routeParams*/ ctx[2],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block$5(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$4, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(40:0) {#if $activeRoute !== null && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block$4(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, routeParams, $location*/ 532)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if component !== null}
    function create_if_block_1$4(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[4] },
    		/*routeParams*/ ctx[2],
    		/*routeProps*/ ctx[3]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, routeParams, routeProps*/ 28)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
    					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
    					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(41:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$w(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(4, $location = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	let routeParams = {};
    	let routeProps = {};
    	registerRoute(route);

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway.
    	if (typeof window !== "undefined") {
    		onDestroy(() => {
    			unregisterRoute(route);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('path' in $$new_props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		ROUTER,
    		LOCATION,
    		path,
    		component,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		location,
    		route,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('routeParams' in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
    		if ('routeProps' in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeRoute*/ 2) {
    			if ($activeRoute && $activeRoute.route === route) {
    				$$invalidate(2, routeParams = $activeRoute.params);
    			}
    		}

    		{
    			const { path, component, ...rest } = $$props;
    			$$invalidate(3, routeProps = rest);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		$activeRoute,
    		routeParams,
    		routeProps,
    		$location,
    		activeRoute,
    		location,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, { path: 8, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$w.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-routing\src\Link.svelte generated by Svelte v3.44.0 */
    const file$u = "node_modules\\svelte-routing\\src\\Link.svelte";

    function create_fragment$v(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{ "aria-current": /*ariaCurrent*/ ctx[2] },
    		/*props*/ ctx[1],
    		/*$$restProps*/ ctx[6]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$u, 40, 0, 1249);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*ariaCurrent*/ 4) && { "aria-current": /*ariaCurrent*/ ctx[2] },
    				dirty & /*props*/ 2 && /*props*/ ctx[1],
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let ariaCurrent;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { to = "#" } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = () => ({}) } = $$props;
    	const { base } = getContext(ROUTER);
    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(14, $base = value));
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(13, $location = value));
    	const dispatch = createEventDispatcher();
    	let href, isPartiallyCurrent, isCurrent, props;

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = $location.pathname === href || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('to' in $$new_props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$new_props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$new_props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$new_props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('$$scope' in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		createEventDispatcher,
    		ROUTER,
    		LOCATION,
    		navigate,
    		startsWith,
    		resolve,
    		shouldNavigate,
    		to,
    		replace,
    		state,
    		getProps,
    		base,
    		location,
    		dispatch,
    		href,
    		isPartiallyCurrent,
    		isCurrent,
    		props,
    		onClick,
    		ariaCurrent,
    		$location,
    		$base
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('to' in $$props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('isPartiallyCurrent' in $$props) $$invalidate(11, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ('isCurrent' in $$props) $$invalidate(12, isCurrent = $$new_props.isCurrent);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $base*/ 16512) {
    			$$invalidate(0, href = to === "/" ? $base.uri : resolve(to, $base.uri));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 8193) {
    			$$invalidate(11, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 8193) {
    			$$invalidate(12, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 4096) {
    			$$invalidate(2, ariaCurrent = isCurrent ? "page" : undefined);
    		}

    		if ($$self.$$.dirty & /*getProps, $location, href, isPartiallyCurrent, isCurrent*/ 15361) {
    			$$invalidate(1, props = getProps({
    				location: $location,
    				href,
    				isPartiallyCurrent,
    				isCurrent
    			}));
    		}
    	};

    	return [
    		href,
    		props,
    		ariaCurrent,
    		base,
    		location,
    		onClick,
    		$$restProps,
    		to,
    		replace,
    		state,
    		getProps,
    		isPartiallyCurrent,
    		isCurrent,
    		$location,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {
    			to: 7,
    			replace: 8,
    			state: 9,
    			getProps: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$v.name
    		});
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    function getOriginalBodyPadding() {
      const style = window ? window.getComputedStyle(document.body, null) : {};

      return parseInt((style && style.getPropertyValue('padding-right')) || 0, 10);
    }

    function getScrollbarWidth() {
      let scrollDiv = document.createElement('div');
      // .modal-scrollbar-measure styles // https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.4/scss/_modal.scss#L106-L113
      scrollDiv.style.position = 'absolute';
      scrollDiv.style.top = '-9999px';
      scrollDiv.style.width = '50px';
      scrollDiv.style.height = '50px';
      scrollDiv.style.overflow = 'scroll';
      document.body.appendChild(scrollDiv);
      const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
      return scrollbarWidth;
    }

    function setScrollbarWidth(padding) {
      document.body.style.paddingRight = padding > 0 ? `${padding}px` : null;
    }

    function isBodyOverflowing() {
      return window ? document.body.clientWidth < window.innerWidth : false;
    }

    function isObject(value) {
      const type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    function conditionallyUpdateScrollbar() {
      const scrollbarWidth = getScrollbarWidth();
      // https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.6/js/src/modal.js#L433
      const fixedContent = document.querySelectorAll(
        '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top'
      )[0];
      const bodyPadding = fixedContent
        ? parseInt(fixedContent.style.paddingRight || 0, 10)
        : 0;

      if (isBodyOverflowing()) {
        setScrollbarWidth(bodyPadding + scrollbarWidth);
      }
    }

    function getColumnSizeClass(isXs, colWidth, colSize) {
      if (colSize === true || colSize === '') {
        return isXs ? 'col' : `col-${colWidth}`;
      } else if (colSize === 'auto') {
        return isXs ? 'col-auto' : `col-${colWidth}-auto`;
      }

      return isXs ? `col-${colSize}` : `col-${colWidth}-${colSize}`;
    }

    function browserEvent(target, ...args) {
      target.addEventListener(...args);

      return () => target.removeEventListener(...args);
    }

    function toClassName(value) {
      let result = '';

      if (typeof value === 'string' || typeof value === 'number') {
        result += value;
      } else if (typeof value === 'object') {
        if (Array.isArray(value)) {
          result = value.map(toClassName).filter(Boolean).join(' ');
        } else {
          for (let key in value) {
            if (value[key]) {
              result && (result += ' ');
              result += key;
            }
          }
        }
      }

      return result;
    }

    function classnames(...args) {
      return args.map(toClassName).filter(Boolean).join(' ');
    }

    /* node_modules\sveltestrap\src\Button.svelte generated by Svelte v3.44.0 */
    const file$t = "node_modules\\sveltestrap\\src\\Button.svelte";

    // (48:0) {:else}
    function create_else_block_1(ctx) {
    	let button;
    	let button_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);
    	const default_slot_or_fallback = default_slot || fallback_block$1(ctx);

    	let button_levels = [
    		/*$$restProps*/ ctx[9],
    		{ class: /*classes*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ value: /*value*/ ctx[5] },
    		{
    			"aria-label": button_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6]
    		},
    		{ style: /*style*/ ctx[4] }
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			button = element("button");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(button, button_data);
    			add_location(button, file$t, 48, 2, 985);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[19], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 65536)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[16],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[16])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[16], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*close, children, $$scope*/ 65539)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
    				(!current || dirty & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] },
    				(!current || dirty & /*value*/ 32) && { value: /*value*/ ctx[5] },
    				(!current || dirty & /*ariaLabel, defaultAriaLabel*/ 320 && button_aria_label_value !== (button_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6])) && { "aria-label": button_aria_label_value },
    				(!current || dirty & /*style*/ 16) && { style: /*style*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(48:0) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (33:0) {#if href}
    function create_if_block$4(ctx) {
    	let a;
    	let current_block_type_index;
    	let if_block;
    	let a_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1$3, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*children*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let a_levels = [
    		/*$$restProps*/ ctx[9],
    		{ class: /*classes*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ href: /*href*/ ctx[3] },
    		{
    			"aria-label": a_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6]
    		},
    		{ style: /*style*/ ctx[4] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			a = element("a");
    			if_block.c();
    			set_attributes(a, a_data);
    			add_location(a, file$t, 33, 2, 752);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			if_blocks[current_block_type_index].m(a, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[18], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(a, null);
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
    				(!current || dirty & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] },
    				(!current || dirty & /*href*/ 8) && { href: /*href*/ ctx[3] },
    				(!current || dirty & /*ariaLabel, defaultAriaLabel*/ 320 && a_aria_label_value !== (a_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6])) && { "aria-label": a_aria_label_value },
    				(!current || dirty & /*style*/ 16) && { style: /*style*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(33:0) {#if href}",
    		ctx
    	});

    	return block_1;
    }

    // (62:6) {:else}
    function create_else_block_2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);

    	const block_1 = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 65536)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[16],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[16])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[16], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(62:6) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (60:25) 
    function create_if_block_3$1(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*children*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 1) set_data_dev(t, /*children*/ ctx[0]);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(60:25) ",
    		ctx
    	});

    	return block_1;
    }

    // (58:6) {#if close}
    function create_if_block_2$2(ctx) {
    	let span;

    	const block_1 = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "×";
    			attr_dev(span, "aria-hidden", "true");
    			add_location(span, file$t, 58, 8, 1171);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(58:6) {#if close}",
    		ctx
    	});

    	return block_1;
    }

    // (57:10)        
    function fallback_block$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$2, create_if_block_3$1, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*close*/ ctx[1]) return 0;
    		if (/*children*/ ctx[0]) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(57:10)        ",
    		ctx
    	});

    	return block_1;
    }

    // (44:4) {:else}
    function create_else_block$3(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);

    	const block_1 = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 65536)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[16],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[16])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[16], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(44:4) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (42:4) {#if children}
    function create_if_block_1$3(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*children*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 1) set_data_dev(t, /*children*/ ctx[0]);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(42:4) {#if children}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$u(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$4, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let classes;
    	let defaultAriaLabel;

    	const omit_props_names = [
    		"class","active","block","children","close","color","disabled","href","outline","size","style","value"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { active = false } = $$props;
    	let { block = false } = $$props;
    	let { children = undefined } = $$props;
    	let { close = false } = $$props;
    	let { color = 'secondary' } = $$props;
    	let { disabled = false } = $$props;
    	let { href = '' } = $$props;
    	let { outline = false } = $$props;
    	let { size = null } = $$props;
    	let { style = '' } = $$props;
    	let { value = '' } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(20, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(10, className = $$new_props.class);
    		if ('active' in $$new_props) $$invalidate(11, active = $$new_props.active);
    		if ('block' in $$new_props) $$invalidate(12, block = $$new_props.block);
    		if ('children' in $$new_props) $$invalidate(0, children = $$new_props.children);
    		if ('close' in $$new_props) $$invalidate(1, close = $$new_props.close);
    		if ('color' in $$new_props) $$invalidate(13, color = $$new_props.color);
    		if ('disabled' in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('href' in $$new_props) $$invalidate(3, href = $$new_props.href);
    		if ('outline' in $$new_props) $$invalidate(14, outline = $$new_props.outline);
    		if ('size' in $$new_props) $$invalidate(15, size = $$new_props.size);
    		if ('style' in $$new_props) $$invalidate(4, style = $$new_props.style);
    		if ('value' in $$new_props) $$invalidate(5, value = $$new_props.value);
    		if ('$$scope' in $$new_props) $$invalidate(16, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		active,
    		block,
    		children,
    		close,
    		color,
    		disabled,
    		href,
    		outline,
    		size,
    		style,
    		value,
    		defaultAriaLabel,
    		classes,
    		ariaLabel
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(20, $$props = assign(assign({}, $$props), $$new_props));
    		if ('className' in $$props) $$invalidate(10, className = $$new_props.className);
    		if ('active' in $$props) $$invalidate(11, active = $$new_props.active);
    		if ('block' in $$props) $$invalidate(12, block = $$new_props.block);
    		if ('children' in $$props) $$invalidate(0, children = $$new_props.children);
    		if ('close' in $$props) $$invalidate(1, close = $$new_props.close);
    		if ('color' in $$props) $$invalidate(13, color = $$new_props.color);
    		if ('disabled' in $$props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('href' in $$props) $$invalidate(3, href = $$new_props.href);
    		if ('outline' in $$props) $$invalidate(14, outline = $$new_props.outline);
    		if ('size' in $$props) $$invalidate(15, size = $$new_props.size);
    		if ('style' in $$props) $$invalidate(4, style = $$new_props.style);
    		if ('value' in $$props) $$invalidate(5, value = $$new_props.value);
    		if ('defaultAriaLabel' in $$props) $$invalidate(6, defaultAriaLabel = $$new_props.defaultAriaLabel);
    		if ('classes' in $$props) $$invalidate(7, classes = $$new_props.classes);
    		if ('ariaLabel' in $$props) $$invalidate(8, ariaLabel = $$new_props.ariaLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(8, ariaLabel = $$props['aria-label']);

    		if ($$self.$$.dirty & /*className, close, outline, color, size, block, active*/ 64514) {
    			$$invalidate(7, classes = classnames(className, { close }, close || 'btn', close || `btn${outline ? '-outline' : ''}-${color}`, size ? `btn-${size}` : false, block ? 'btn-block' : false, { active }));
    		}

    		if ($$self.$$.dirty & /*close*/ 2) {
    			$$invalidate(6, defaultAriaLabel = close ? 'Close' : null);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		children,
    		close,
    		disabled,
    		href,
    		style,
    		value,
    		defaultAriaLabel,
    		classes,
    		ariaLabel,
    		$$restProps,
    		className,
    		active,
    		block,
    		color,
    		outline,
    		size,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {
    			class: 10,
    			active: 11,
    			block: 12,
    			children: 0,
    			close: 1,
    			color: 13,
    			disabled: 2,
    			href: 3,
    			outline: 14,
    			size: 15,
    			style: 4,
    			value: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$u.name
    		});
    	}

    	get class() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get block() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get close() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set close(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outline() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outline(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Col.svelte generated by Svelte v3.44.0 */
    const file$s = "node_modules\\sveltestrap\\src\\Col.svelte";

    function create_fragment$t(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let div_levels = [
    		/*$$restProps*/ ctx[1],
    		{
    			class: div_class_value = /*colClasses*/ ctx[0].join(' ')
    		}
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$s, 58, 0, 1388);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				{ class: div_class_value }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	const omit_props_names = ["class","xs","sm","md","lg","xl"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Col', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { xs = undefined } = $$props;
    	let { sm = undefined } = $$props;
    	let { md = undefined } = $$props;
    	let { lg = undefined } = $$props;
    	let { xl = undefined } = $$props;
    	const colClasses = [];
    	const lookup = { xs, sm, md, lg, xl };

    	Object.keys(lookup).forEach(colWidth => {
    		const columnProp = lookup[colWidth];

    		if (!columnProp && columnProp !== '') {
    			return; //no value for this width
    		}

    		const isXs = colWidth === 'xs';

    		if (isObject(columnProp)) {
    			const colSizeInterfix = isXs ? '-' : `-${colWidth}-`;
    			const colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);

    			if (columnProp.size || columnProp.size === '') {
    				colClasses.push(colClass);
    			}

    			if (columnProp.push) {
    				colClasses.push(`push${colSizeInterfix}${columnProp.push}`);
    			}

    			if (columnProp.pull) {
    				colClasses.push(`pull${colSizeInterfix}${columnProp.pull}`);
    			}

    			if (columnProp.offset) {
    				colClasses.push(`offset${colSizeInterfix}${columnProp.offset}`);
    			}
    		} else {
    			colClasses.push(getColumnSizeClass(isXs, colWidth, columnProp));
    		}
    	});

    	if (!colClasses.length) {
    		colClasses.push('col');
    	}

    	if (className) {
    		colClasses.push(className);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('xs' in $$new_props) $$invalidate(3, xs = $$new_props.xs);
    		if ('sm' in $$new_props) $$invalidate(4, sm = $$new_props.sm);
    		if ('md' in $$new_props) $$invalidate(5, md = $$new_props.md);
    		if ('lg' in $$new_props) $$invalidate(6, lg = $$new_props.lg);
    		if ('xl' in $$new_props) $$invalidate(7, xl = $$new_props.xl);
    		if ('$$scope' in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getColumnSizeClass,
    		isObject,
    		className,
    		xs,
    		sm,
    		md,
    		lg,
    		xl,
    		colClasses,
    		lookup
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('xs' in $$props) $$invalidate(3, xs = $$new_props.xs);
    		if ('sm' in $$props) $$invalidate(4, sm = $$new_props.sm);
    		if ('md' in $$props) $$invalidate(5, md = $$new_props.md);
    		if ('lg' in $$props) $$invalidate(6, lg = $$new_props.lg);
    		if ('xl' in $$props) $$invalidate(7, xl = $$new_props.xl);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [colClasses, $$restProps, className, xs, sm, md, lg, xl, $$scope, slots];
    }

    class Col extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {
    			class: 2,
    			xs: 3,
    			sm: 4,
    			md: 5,
    			lg: 6,
    			xl: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Col",
    			options,
    			id: create_fragment$t.name
    		});
    	}

    	get class() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xs() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xs(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sm() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sm(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get md() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set md(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lg() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lg(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xl() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xl(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Container.svelte generated by Svelte v3.44.0 */
    const file$r = "node_modules\\sveltestrap\\src\\Container.svelte";

    function create_fragment$s(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$r, 10, 0, 220);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","fluid"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Container', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { fluid = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('fluid' in $$new_props) $$invalidate(3, fluid = $$new_props.fluid);
    		if ('$$scope' in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, fluid, classes });

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('fluid' in $$props) $$invalidate(3, fluid = $$new_props.fluid);
    		if ('classes' in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, fluid*/ 12) {
    			$$invalidate(0, classes = classnames(className, fluid ? 'container-fluid' : 'container'));
    		}
    	};

    	return [classes, $$restProps, className, fluid, $$scope, slots];
    }

    class Container extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, { class: 2, fluid: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Container",
    			options,
    			id: create_fragment$s.name
    		});
    	}

    	get class() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fluid() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fluid(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\FormGroup.svelte generated by Svelte v3.44.0 */
    const file$q = "node_modules\\sveltestrap\\src\\FormGroup.svelte";

    // (25:0) {:else}
    function create_else_block$2(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);
    	let div_levels = [/*$$restProps*/ ctx[2], { class: /*classes*/ ctx[1] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$q, 25, 2, 574);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(25:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (21:0) {#if tag === 'fieldset'}
    function create_if_block$3(ctx) {
    	let fieldset;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);
    	let fieldset_levels = [/*$$restProps*/ ctx[2], { class: /*classes*/ ctx[1] }];
    	let fieldset_data = {};

    	for (let i = 0; i < fieldset_levels.length; i += 1) {
    		fieldset_data = assign(fieldset_data, fieldset_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			fieldset = element("fieldset");
    			if (default_slot) default_slot.c();
    			set_attributes(fieldset, fieldset_data);
    			add_location(fieldset, file$q, 21, 2, 493);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, fieldset, anchor);

    			if (default_slot) {
    				default_slot.m(fieldset, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(fieldset, fieldset_data = get_spread_update(fieldset_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(fieldset);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(21:0) {#if tag === 'fieldset'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*tag*/ ctx[0] === 'fieldset') return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","row","check","inline","disabled","tag"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FormGroup', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { row = false } = $$props;
    	let { check = false } = $$props;
    	let { inline = false } = $$props;
    	let { disabled = false } = $$props;
    	let { tag = null } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ('row' in $$new_props) $$invalidate(4, row = $$new_props.row);
    		if ('check' in $$new_props) $$invalidate(5, check = $$new_props.check);
    		if ('inline' in $$new_props) $$invalidate(6, inline = $$new_props.inline);
    		if ('disabled' in $$new_props) $$invalidate(7, disabled = $$new_props.disabled);
    		if ('tag' in $$new_props) $$invalidate(0, tag = $$new_props.tag);
    		if ('$$scope' in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		row,
    		check,
    		inline,
    		disabled,
    		tag,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(3, className = $$new_props.className);
    		if ('row' in $$props) $$invalidate(4, row = $$new_props.row);
    		if ('check' in $$props) $$invalidate(5, check = $$new_props.check);
    		if ('inline' in $$props) $$invalidate(6, inline = $$new_props.inline);
    		if ('disabled' in $$props) $$invalidate(7, disabled = $$new_props.disabled);
    		if ('tag' in $$props) $$invalidate(0, tag = $$new_props.tag);
    		if ('classes' in $$props) $$invalidate(1, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, row, check, inline, disabled*/ 248) {
    			$$invalidate(1, classes = classnames(className, row ? 'row' : false, check ? 'form-check' : 'form-group', check && inline ? 'form-check-inline' : false, check && disabled ? 'disabled' : false));
    		}
    	};

    	return [
    		tag,
    		classes,
    		$$restProps,
    		className,
    		row,
    		check,
    		inline,
    		disabled,
    		$$scope,
    		slots
    	];
    }

    class FormGroup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {
    			class: 3,
    			row: 4,
    			check: 5,
    			inline: 6,
    			disabled: 7,
    			tag: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FormGroup",
    			options,
    			id: create_fragment$r.name
    		});
    	}

    	get class() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get row() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set row(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get check() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set check(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inline() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inline(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tag() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tag(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Input.svelte generated by Svelte v3.44.0 */
    const file$p = "node_modules\\sveltestrap\\src\\Input.svelte";

    // (356:40) 
    function create_if_block_16(ctx) {
    	let select;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[22].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[21], null);

    	let select_levels = [
    		/*$$restProps*/ ctx[12],
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ readonly: /*readonly*/ ctx[4] }
    	];

    	let select_data = {};

    	for (let i = 0; i < select_levels.length; i += 1) {
    		select_data = assign(select_data, select_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			select = element("select");
    			if (default_slot) default_slot.c();
    			set_attributes(select, select_data);
    			if (/*value*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[152].call(select));
    			add_location(select, file$p, 356, 2, 7097);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);

    			if (default_slot) {
    				default_slot.m(select, null);
    			}

    			(select_data.multiple ? select_options : select_option)(select, select_data.value);
    			if (select.autofocus) select.focus();
    			select_option(select, /*value*/ ctx[1]);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "blur", /*blur_handler_16*/ ctx[133], false, false, false),
    					listen_dev(select, "focus", /*focus_handler_16*/ ctx[134], false, false, false),
    					listen_dev(select, "change", /*change_handler_15*/ ctx[135], false, false, false),
    					listen_dev(select, "input", /*input_handler_15*/ ctx[136], false, false, false),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[152])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 2097152)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[21],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[21])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[21], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(select, select_data = get_spread_update(select_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				(!current || dirty[0] & /*classes*/ 512) && { class: /*classes*/ ctx[9] },
    				(!current || dirty[0] & /*name*/ 64) && { name: /*name*/ ctx[6] },
    				(!current || dirty[0] & /*disabled*/ 256) && { disabled: /*disabled*/ ctx[8] },
    				(!current || dirty[0] & /*readonly*/ 16) && { readonly: /*readonly*/ ctx[4] }
    			]));

    			if (dirty[0] & /*$$restProps, classes, name, disabled, readonly*/ 4944 && 'value' in select_data) (select_data.multiple ? select_options : select_option)(select, select_data.value);
    			

    			if (dirty[0] & /*value*/ 2) {
    				select_option(select, /*value*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_16.name,
    		type: "if",
    		source: "(356:40) ",
    		ctx
    	});

    	return block;
    }

    // (340:29) 
    function create_if_block_15(ctx) {
    	let textarea;
    	let mounted;
    	let dispose;

    	let textarea_levels = [
    		/*$$restProps*/ ctx[12],
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] },
    		{ readOnly: /*readonly*/ ctx[4] }
    	];

    	let textarea_data = {};

    	for (let i = 0; i < textarea_levels.length; i += 1) {
    		textarea_data = assign(textarea_data, textarea_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			set_attributes(textarea, textarea_data);
    			add_location(textarea, file$p, 340, 2, 6830);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    			if (textarea.autofocus) textarea.focus();
    			set_input_value(textarea, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea, "blur", /*blur_handler_15*/ ctx[126], false, false, false),
    					listen_dev(textarea, "focus", /*focus_handler_15*/ ctx[127], false, false, false),
    					listen_dev(textarea, "keydown", /*keydown_handler_15*/ ctx[128], false, false, false),
    					listen_dev(textarea, "keypress", /*keypress_handler_15*/ ctx[129], false, false, false),
    					listen_dev(textarea, "keyup", /*keyup_handler_15*/ ctx[130], false, false, false),
    					listen_dev(textarea, "change", /*change_handler_14*/ ctx[131], false, false, false),
    					listen_dev(textarea, "input", /*input_handler_14*/ ctx[132], false, false, false),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[151])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(textarea, textarea_data = get_spread_update(textarea_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(textarea, /*value*/ ctx[1]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15.name,
    		type: "if",
    		source: "(340:29) ",
    		ctx
    	});

    	return block;
    }

    // (82:0) {#if tag === 'input'}
    function create_if_block$2(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*type*/ ctx[3] === 'text') return create_if_block_1$2;
    		if (/*type*/ ctx[3] === 'password') return create_if_block_2$1;
    		if (/*type*/ ctx[3] === 'email') return create_if_block_3;
    		if (/*type*/ ctx[3] === 'file') return create_if_block_4;
    		if (/*type*/ ctx[3] === 'checkbox') return create_if_block_5;
    		if (/*type*/ ctx[3] === 'radio') return create_if_block_6;
    		if (/*type*/ ctx[3] === 'url') return create_if_block_7;
    		if (/*type*/ ctx[3] === 'number') return create_if_block_8;
    		if (/*type*/ ctx[3] === 'date') return create_if_block_9;
    		if (/*type*/ ctx[3] === 'time') return create_if_block_10;
    		if (/*type*/ ctx[3] === 'datetime') return create_if_block_11;
    		if (/*type*/ ctx[3] === 'color') return create_if_block_12;
    		if (/*type*/ ctx[3] === 'range') return create_if_block_13;
    		if (/*type*/ ctx[3] === 'search') return create_if_block_14;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(82:0) {#if tag === 'input'}",
    		ctx
    	});

    	return block;
    }

    // (322:2) {:else}
    function create_else_block$1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: /*type*/ ctx[3] },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] },
    		{ value: /*value*/ ctx[1] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$p, 322, 4, 6503);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			input.value = input_data.value;
    			if (input.autofocus) input.focus();

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_14*/ ctx[121], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_14*/ ctx[122], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_14*/ ctx[123], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_14*/ ctx[124], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_14*/ ctx[125], false, false, false),
    					listen_dev(input, "input", /*handleInput*/ ctx[11], false, false, false),
    					listen_dev(input, "change", /*handleInput*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				dirty[0] & /*type*/ 8 && { type: /*type*/ ctx[3] },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] },
    				dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1] && { value: /*value*/ ctx[1] }
    			]));

    			if ('value' in input_data) {
    				input.value = input_data.value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(322:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (305:30) 
    function create_if_block_14(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "search" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$p, 305, 4, 6220);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_13*/ ctx[114], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_13*/ ctx[115], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_13*/ ctx[116], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_13*/ ctx[117], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_13*/ ctx[118], false, false, false),
    					listen_dev(input, "change", /*change_handler_13*/ ctx[119], false, false, false),
    					listen_dev(input, "input", /*input_handler_13*/ ctx[120], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_9*/ ctx[150])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "search" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(305:30) ",
    		ctx
    	});

    	return block;
    }

    // (288:29) 
    function create_if_block_13(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "range" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$p, 288, 4, 5917);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_12*/ ctx[107], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_12*/ ctx[108], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_12*/ ctx[109], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_12*/ ctx[110], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_12*/ ctx[111], false, false, false),
    					listen_dev(input, "change", /*change_handler_12*/ ctx[112], false, false, false),
    					listen_dev(input, "input", /*input_handler_12*/ ctx[113], false, false, false),
    					listen_dev(input, "change", /*input_change_input_handler*/ ctx[149]),
    					listen_dev(input, "input", /*input_change_input_handler*/ ctx[149])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "range" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(288:29) ",
    		ctx
    	});

    	return block;
    }

    // (271:29) 
    function create_if_block_12(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "color" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$p, 271, 4, 5615);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_11*/ ctx[100], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_11*/ ctx[101], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_11*/ ctx[102], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_11*/ ctx[103], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_11*/ ctx[104], false, false, false),
    					listen_dev(input, "change", /*change_handler_11*/ ctx[105], false, false, false),
    					listen_dev(input, "input", /*input_handler_11*/ ctx[106], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_8*/ ctx[148])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "color" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(271:29) ",
    		ctx
    	});

    	return block;
    }

    // (254:32) 
    function create_if_block_11(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "datetime" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$p, 254, 4, 5310);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_10*/ ctx[93], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_10*/ ctx[94], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_10*/ ctx[95], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_10*/ ctx[96], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_10*/ ctx[97], false, false, false),
    					listen_dev(input, "change", /*change_handler_10*/ ctx[98], false, false, false),
    					listen_dev(input, "input", /*input_handler_10*/ ctx[99], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_7*/ ctx[147])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "datetime" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(254:32) ",
    		ctx
    	});

    	return block;
    }

    // (237:28) 
    function create_if_block_10(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "time" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$p, 237, 4, 5006);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_9*/ ctx[86], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_9*/ ctx[87], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_9*/ ctx[88], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_9*/ ctx[89], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_9*/ ctx[90], false, false, false),
    					listen_dev(input, "change", /*change_handler_9*/ ctx[91], false, false, false),
    					listen_dev(input, "input", /*input_handler_9*/ ctx[92], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_6*/ ctx[146])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "time" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(237:28) ",
    		ctx
    	});

    	return block;
    }

    // (220:28) 
    function create_if_block_9(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "date" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$p, 220, 4, 4706);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_8*/ ctx[79], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_8*/ ctx[80], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_8*/ ctx[81], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_8*/ ctx[82], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_8*/ ctx[83], false, false, false),
    					listen_dev(input, "change", /*change_handler_8*/ ctx[84], false, false, false),
    					listen_dev(input, "input", /*input_handler_8*/ ctx[85], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_5*/ ctx[145])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "date" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(220:28) ",
    		ctx
    	});

    	return block;
    }

    // (203:30) 
    function create_if_block_8(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "number" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$p, 203, 4, 4404);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_7*/ ctx[72], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_7*/ ctx[73], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_7*/ ctx[74], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_7*/ ctx[75], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_7*/ ctx[76], false, false, false),
    					listen_dev(input, "change", /*change_handler_7*/ ctx[77], false, false, false),
    					listen_dev(input, "input", /*input_handler_7*/ ctx[78], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_4*/ ctx[144])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "number" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2 && to_number(input.value) !== /*value*/ ctx[1]) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(203:30) ",
    		ctx
    	});

    	return block;
    }

    // (186:27) 
    function create_if_block_7(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "url" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$p, 186, 4, 4103);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_6*/ ctx[65], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_6*/ ctx[66], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_6*/ ctx[67], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_6*/ ctx[68], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_6*/ ctx[69], false, false, false),
    					listen_dev(input, "change", /*change_handler_6*/ ctx[70], false, false, false),
    					listen_dev(input, "input", /*input_handler_6*/ ctx[71], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_3*/ ctx[143])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "url" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(186:27) ",
    		ctx
    	});

    	return block;
    }

    // (169:29) 
    function create_if_block_6(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "radio" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$p, 169, 4, 3803);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_5*/ ctx[58], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_5*/ ctx[59], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_5*/ ctx[60], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_5*/ ctx[61], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_5*/ ctx[62], false, false, false),
    					listen_dev(input, "change", /*change_handler_5*/ ctx[63], false, false, false),
    					listen_dev(input, "input", /*input_handler_5*/ ctx[64], false, false, false),
    					listen_dev(input, "change", /*input_change_handler_2*/ ctx[142])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "radio" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(169:29) ",
    		ctx
    	});

    	return block;
    }

    // (151:32) 
    function create_if_block_5(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "checkbox" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$p, 151, 4, 3479);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			input.checked = /*checked*/ ctx[0];
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_4*/ ctx[51], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_4*/ ctx[52], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_4*/ ctx[53], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_4*/ ctx[54], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_4*/ ctx[55], false, false, false),
    					listen_dev(input, "change", /*change_handler_4*/ ctx[56], false, false, false),
    					listen_dev(input, "input", /*input_handler_4*/ ctx[57], false, false, false),
    					listen_dev(input, "change", /*input_change_handler_1*/ ctx[141])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "checkbox" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*checked*/ 1) {
    				input.checked = /*checked*/ ctx[0];
    			}

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(151:32) ",
    		ctx
    	});

    	return block;
    }

    // (134:28) 
    function create_if_block_4(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "file" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$p, 134, 4, 3175);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_3*/ ctx[44], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_3*/ ctx[45], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_3*/ ctx[46], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_3*/ ctx[47], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_3*/ ctx[48], false, false, false),
    					listen_dev(input, "change", /*change_handler_3*/ ctx[49], false, false, false),
    					listen_dev(input, "input", /*input_handler_3*/ ctx[50], false, false, false),
    					listen_dev(input, "change", /*input_change_handler*/ ctx[140])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "file" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(134:28) ",
    		ctx
    	});

    	return block;
    }

    // (117:29) 
    function create_if_block_3(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "email" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$p, 117, 4, 2874);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_2*/ ctx[37], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_2*/ ctx[38], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_2*/ ctx[39], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_2*/ ctx[40], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_2*/ ctx[41], false, false, false),
    					listen_dev(input, "change", /*change_handler_2*/ ctx[42], false, false, false),
    					listen_dev(input, "input", /*input_handler_2*/ ctx[43], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_2*/ ctx[139])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "email" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1]) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(117:29) ",
    		ctx
    	});

    	return block;
    }

    // (100:32) 
    function create_if_block_2$1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "password" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$p, 100, 4, 2569);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_1*/ ctx[30], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_1*/ ctx[31], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_1*/ ctx[32], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_1*/ ctx[33], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_1*/ ctx[34], false, false, false),
    					listen_dev(input, "change", /*change_handler_1*/ ctx[35], false, false, false),
    					listen_dev(input, "input", /*input_handler_1*/ ctx[36], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_1*/ ctx[138])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "password" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1]) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(100:32) ",
    		ctx
    	});

    	return block;
    }

    // (83:2) {#if type === 'text'}
    function create_if_block_1$2(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "text" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$p, 83, 4, 2265);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler*/ ctx[23], false, false, false),
    					listen_dev(input, "focus", /*focus_handler*/ ctx[24], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler*/ ctx[25], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler*/ ctx[26], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler*/ ctx[27], false, false, false),
    					listen_dev(input, "change", /*change_handler*/ ctx[28], false, false, false),
    					listen_dev(input, "input", /*input_handler*/ ctx[29], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[137])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "text" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1]) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(83:2) {#if type === 'text'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$q(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_if_block_15, create_if_block_16];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*tag*/ ctx[10] === 'input') return 0;
    		if (/*tag*/ ctx[10] === 'textarea') return 1;
    		if (/*tag*/ ctx[10] === 'select' && !/*multiple*/ ctx[5]) return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"class","type","size","bsSize","color","checked","valid","invalid","plaintext","addon","value","files","readonly","multiple","name","placeholder","disabled"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Input', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { type = 'text' } = $$props;
    	let { size = undefined } = $$props;
    	let { bsSize = undefined } = $$props;
    	let { color = undefined } = $$props;
    	let { checked = false } = $$props;
    	let { valid = false } = $$props;
    	let { invalid = false } = $$props;
    	let { plaintext = false } = $$props;
    	let { addon = false } = $$props;
    	let { value = '' } = $$props;
    	let { files = '' } = $$props;
    	let { readonly = undefined } = $$props;
    	let { multiple = undefined } = $$props;
    	let { name = '' } = $$props;
    	let { placeholder = '' } = $$props;
    	let { disabled = undefined } = $$props;
    	let classes;
    	let tag;

    	const handleInput = event => {
    		$$invalidate(1, value = event.target.value);
    	};

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_4(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_4(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_4(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_4(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_4(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_4(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_4(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_5(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_5(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_5(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_5(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_5(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_5(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_5(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_6(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_6(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_6(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_6(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_6(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_6(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_6(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_7(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_7(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_7(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_7(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_7(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_7(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_7(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_8(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_8(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_8(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_8(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_8(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_8(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_8(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_9(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_9(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_9(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_9(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_9(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_9(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_9(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_10(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_10(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_10(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_10(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_10(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_10(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_10(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_11(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_11(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_11(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_11(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_11(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_11(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_11(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_12(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_12(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_12(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_12(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_12(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_12(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_12(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_13(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_13(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_13(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_13(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_13(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_13(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_13(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_14(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_14(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_14(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_14(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_14(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_15(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_15(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_15(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_15(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_15(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_14(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_14(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_16(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_16(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_15(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_15(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_1() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_2() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_change_handler() {
    		files = this.files;
    		$$invalidate(2, files);
    	}

    	function input_change_handler_1() {
    		checked = this.checked;
    		value = this.value;
    		$$invalidate(0, checked);
    		$$invalidate(1, value);
    	}

    	function input_change_handler_2() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_3() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_4() {
    		value = to_number(this.value);
    		$$invalidate(1, value);
    	}

    	function input_input_handler_5() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_6() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_7() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_8() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_change_input_handler() {
    		value = to_number(this.value);
    		$$invalidate(1, value);
    	}

    	function input_input_handler_9() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function textarea_input_handler() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function select_change_handler() {
    		value = select_value(this);
    		$$invalidate(1, value);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(12, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(15, className = $$new_props.class);
    		if ('type' in $$new_props) $$invalidate(3, type = $$new_props.type);
    		if ('size' in $$new_props) $$invalidate(13, size = $$new_props.size);
    		if ('bsSize' in $$new_props) $$invalidate(14, bsSize = $$new_props.bsSize);
    		if ('color' in $$new_props) $$invalidate(16, color = $$new_props.color);
    		if ('checked' in $$new_props) $$invalidate(0, checked = $$new_props.checked);
    		if ('valid' in $$new_props) $$invalidate(17, valid = $$new_props.valid);
    		if ('invalid' in $$new_props) $$invalidate(18, invalid = $$new_props.invalid);
    		if ('plaintext' in $$new_props) $$invalidate(19, plaintext = $$new_props.plaintext);
    		if ('addon' in $$new_props) $$invalidate(20, addon = $$new_props.addon);
    		if ('value' in $$new_props) $$invalidate(1, value = $$new_props.value);
    		if ('files' in $$new_props) $$invalidate(2, files = $$new_props.files);
    		if ('readonly' in $$new_props) $$invalidate(4, readonly = $$new_props.readonly);
    		if ('multiple' in $$new_props) $$invalidate(5, multiple = $$new_props.multiple);
    		if ('name' in $$new_props) $$invalidate(6, name = $$new_props.name);
    		if ('placeholder' in $$new_props) $$invalidate(7, placeholder = $$new_props.placeholder);
    		if ('disabled' in $$new_props) $$invalidate(8, disabled = $$new_props.disabled);
    		if ('$$scope' in $$new_props) $$invalidate(21, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		type,
    		size,
    		bsSize,
    		color,
    		checked,
    		valid,
    		invalid,
    		plaintext,
    		addon,
    		value,
    		files,
    		readonly,
    		multiple,
    		name,
    		placeholder,
    		disabled,
    		classes,
    		tag,
    		handleInput
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(15, className = $$new_props.className);
    		if ('type' in $$props) $$invalidate(3, type = $$new_props.type);
    		if ('size' in $$props) $$invalidate(13, size = $$new_props.size);
    		if ('bsSize' in $$props) $$invalidate(14, bsSize = $$new_props.bsSize);
    		if ('color' in $$props) $$invalidate(16, color = $$new_props.color);
    		if ('checked' in $$props) $$invalidate(0, checked = $$new_props.checked);
    		if ('valid' in $$props) $$invalidate(17, valid = $$new_props.valid);
    		if ('invalid' in $$props) $$invalidate(18, invalid = $$new_props.invalid);
    		if ('plaintext' in $$props) $$invalidate(19, plaintext = $$new_props.plaintext);
    		if ('addon' in $$props) $$invalidate(20, addon = $$new_props.addon);
    		if ('value' in $$props) $$invalidate(1, value = $$new_props.value);
    		if ('files' in $$props) $$invalidate(2, files = $$new_props.files);
    		if ('readonly' in $$props) $$invalidate(4, readonly = $$new_props.readonly);
    		if ('multiple' in $$props) $$invalidate(5, multiple = $$new_props.multiple);
    		if ('name' in $$props) $$invalidate(6, name = $$new_props.name);
    		if ('placeholder' in $$props) $$invalidate(7, placeholder = $$new_props.placeholder);
    		if ('disabled' in $$props) $$invalidate(8, disabled = $$new_props.disabled);
    		if ('classes' in $$props) $$invalidate(9, classes = $$new_props.classes);
    		if ('tag' in $$props) $$invalidate(10, tag = $$new_props.tag);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*type, plaintext, addon, color, size, className, invalid, valid, bsSize*/ 2088968) {
    			{
    				const checkInput = ['radio', 'checkbox'].indexOf(type) > -1;
    				const isNotaNumber = new RegExp('\\D', 'g');
    				const fileInput = type === 'file';
    				const textareaInput = type === 'textarea';
    				const rangeInput = type === 'range';
    				const selectInput = type === 'select';
    				const buttonInput = type === 'button' || type === 'reset' || type === 'submit';
    				const unsupportedInput = type === 'hidden' || type === 'image';
    				$$invalidate(10, tag = selectInput || textareaInput ? type : 'input');
    				let formControlClass = 'form-control';

    				if (plaintext) {
    					formControlClass = `${formControlClass}-plaintext`;
    					$$invalidate(10, tag = 'input');
    				} else if (fileInput) {
    					formControlClass = `${formControlClass}-file`;
    				} else if (checkInput) {
    					if (addon) {
    						formControlClass = null;
    					} else {
    						formControlClass = 'form-check-input';
    					}
    				} else if (buttonInput) {
    					formControlClass = `btn btn-${color || 'secondary'}`;
    				} else if (rangeInput) {
    					formControlClass = 'form-control-range';
    				} else if (unsupportedInput) {
    					formControlClass = '';
    				}

    				if (size && isNotaNumber.test(size)) {
    					console.warn('Please use the prop "bsSize" instead of the "size" to bootstrap\'s input sizing.');
    					$$invalidate(14, bsSize = size);
    					$$invalidate(13, size = undefined);
    				}

    				$$invalidate(9, classes = classnames(className, invalid && 'is-invalid', valid && 'is-valid', bsSize ? `form-control-${bsSize}` : false, formControlClass));
    			}
    		}
    	};

    	return [
    		checked,
    		value,
    		files,
    		type,
    		readonly,
    		multiple,
    		name,
    		placeholder,
    		disabled,
    		classes,
    		tag,
    		handleInput,
    		$$restProps,
    		size,
    		bsSize,
    		className,
    		color,
    		valid,
    		invalid,
    		plaintext,
    		addon,
    		$$scope,
    		slots,
    		blur_handler,
    		focus_handler,
    		keydown_handler,
    		keypress_handler,
    		keyup_handler,
    		change_handler,
    		input_handler,
    		blur_handler_1,
    		focus_handler_1,
    		keydown_handler_1,
    		keypress_handler_1,
    		keyup_handler_1,
    		change_handler_1,
    		input_handler_1,
    		blur_handler_2,
    		focus_handler_2,
    		keydown_handler_2,
    		keypress_handler_2,
    		keyup_handler_2,
    		change_handler_2,
    		input_handler_2,
    		blur_handler_3,
    		focus_handler_3,
    		keydown_handler_3,
    		keypress_handler_3,
    		keyup_handler_3,
    		change_handler_3,
    		input_handler_3,
    		blur_handler_4,
    		focus_handler_4,
    		keydown_handler_4,
    		keypress_handler_4,
    		keyup_handler_4,
    		change_handler_4,
    		input_handler_4,
    		blur_handler_5,
    		focus_handler_5,
    		keydown_handler_5,
    		keypress_handler_5,
    		keyup_handler_5,
    		change_handler_5,
    		input_handler_5,
    		blur_handler_6,
    		focus_handler_6,
    		keydown_handler_6,
    		keypress_handler_6,
    		keyup_handler_6,
    		change_handler_6,
    		input_handler_6,
    		blur_handler_7,
    		focus_handler_7,
    		keydown_handler_7,
    		keypress_handler_7,
    		keyup_handler_7,
    		change_handler_7,
    		input_handler_7,
    		blur_handler_8,
    		focus_handler_8,
    		keydown_handler_8,
    		keypress_handler_8,
    		keyup_handler_8,
    		change_handler_8,
    		input_handler_8,
    		blur_handler_9,
    		focus_handler_9,
    		keydown_handler_9,
    		keypress_handler_9,
    		keyup_handler_9,
    		change_handler_9,
    		input_handler_9,
    		blur_handler_10,
    		focus_handler_10,
    		keydown_handler_10,
    		keypress_handler_10,
    		keyup_handler_10,
    		change_handler_10,
    		input_handler_10,
    		blur_handler_11,
    		focus_handler_11,
    		keydown_handler_11,
    		keypress_handler_11,
    		keyup_handler_11,
    		change_handler_11,
    		input_handler_11,
    		blur_handler_12,
    		focus_handler_12,
    		keydown_handler_12,
    		keypress_handler_12,
    		keyup_handler_12,
    		change_handler_12,
    		input_handler_12,
    		blur_handler_13,
    		focus_handler_13,
    		keydown_handler_13,
    		keypress_handler_13,
    		keyup_handler_13,
    		change_handler_13,
    		input_handler_13,
    		blur_handler_14,
    		focus_handler_14,
    		keydown_handler_14,
    		keypress_handler_14,
    		keyup_handler_14,
    		blur_handler_15,
    		focus_handler_15,
    		keydown_handler_15,
    		keypress_handler_15,
    		keyup_handler_15,
    		change_handler_14,
    		input_handler_14,
    		blur_handler_16,
    		focus_handler_16,
    		change_handler_15,
    		input_handler_15,
    		input_input_handler,
    		input_input_handler_1,
    		input_input_handler_2,
    		input_change_handler,
    		input_change_handler_1,
    		input_change_handler_2,
    		input_input_handler_3,
    		input_input_handler_4,
    		input_input_handler_5,
    		input_input_handler_6,
    		input_input_handler_7,
    		input_input_handler_8,
    		input_change_input_handler,
    		input_input_handler_9,
    		textarea_input_handler,
    		select_change_handler
    	];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$q,
    			create_fragment$q,
    			safe_not_equal,
    			{
    				class: 15,
    				type: 3,
    				size: 13,
    				bsSize: 14,
    				color: 16,
    				checked: 0,
    				valid: 17,
    				invalid: 18,
    				plaintext: 19,
    				addon: 20,
    				value: 1,
    				files: 2,
    				readonly: 4,
    				multiple: 5,
    				name: 6,
    				placeholder: 7,
    				disabled: 8
    			},
    			null,
    			[-1, -1, -1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$q.name
    		});
    	}

    	get class() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bsSize() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bsSize(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get checked() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valid() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valid(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get plaintext() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set plaintext(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get addon() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set addon(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get files() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set files(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get readonly() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set readonly(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multiple() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multiple(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Modal.svelte generated by Svelte v3.44.0 */

    const file$o = "node_modules\\sveltestrap\\src\\Modal.svelte";
    const get_external_slot_changes = dirty => ({});
    const get_external_slot_context = ctx => ({});

    // (217:0) {#if _isMounted}
    function create_if_block$1(ctx) {
    	let div;
    	let current;
    	let if_block = /*isOpen*/ ctx[1] && create_if_block_1$1(ctx);

    	let div_levels = [
    		{ class: /*wrapClassName*/ ctx[4] },
    		{ tabindex: "-1" },
    		/*$$restProps*/ ctx[18]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			set_attributes(div, div_data);
    			add_location(div, file$o, 217, 2, 4706);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*isOpen*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*isOpen*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty[0] & /*wrapClassName*/ 16) && { class: /*wrapClassName*/ ctx[4] },
    				{ tabindex: "-1" },
    				dirty[0] & /*$$restProps*/ 262144 && /*$$restProps*/ ctx[18]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(217:0) {#if _isMounted}",
    		ctx
    	});

    	return block;
    }

    // (222:4) {#if isOpen}
    function create_if_block_1$1(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let t0;
    	let div0_class_value;
    	let div2_class_value;
    	let div2_transition;
    	let t1;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	const external_slot_template = /*#slots*/ ctx[33].external;
    	const external_slot = create_slot(external_slot_template, ctx, /*$$scope*/ ctx[32], get_external_slot_context);
    	const default_slot_template = /*#slots*/ ctx[33].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[32], null);
    	let if_block = /*backdrop*/ ctx[3] && !/*staticModal*/ ctx[0] && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if (external_slot) external_slot.c();
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div0, "class", div0_class_value = classnames('modal-content', /*contentClassName*/ ctx[7]));
    			add_location(div0, file$o, 237, 10, 5340);
    			attr_dev(div1, "class", /*classes*/ ctx[13]);
    			attr_dev(div1, "role", "document");
    			add_location(div1, file$o, 236, 8, 5272);
    			attr_dev(div2, "arialabelledby", /*labelledBy*/ ctx[2]);

    			attr_dev(div2, "class", div2_class_value = classnames('modal', /*modalClassName*/ ctx[5], {
    				show: /*isOpen*/ ctx[1],
    				'd-block': /*isOpen*/ ctx[1],
    				'd-none': !/*isOpen*/ ctx[1],
    				'position-static': /*staticModal*/ ctx[0]
    			}));

    			attr_dev(div2, "role", "dialog");
    			add_location(div2, file$o, 222, 6, 4800);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);

    			if (external_slot) {
    				external_slot.m(div0, null);
    			}

    			append_dev(div0, t0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			/*div1_binding*/ ctx[34](div1);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div2, "introend", /*onModalOpened*/ ctx[15], false, false, false),
    					listen_dev(div2, "outroend", /*onModalClosed*/ ctx[16], false, false, false),
    					listen_dev(div2, "click", /*handleBackdropClick*/ ctx[14], false, false, false),
    					listen_dev(div2, "mousedown", /*handleBackdropMouseDown*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (external_slot) {
    				if (external_slot.p && (!current || dirty[1] & /*$$scope*/ 2)) {
    					update_slot_base(
    						external_slot,
    						external_slot_template,
    						ctx,
    						/*$$scope*/ ctx[32],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[32])
    						: get_slot_changes(external_slot_template, /*$$scope*/ ctx[32], dirty, get_external_slot_changes),
    						get_external_slot_context
    					);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[32],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[32])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[32], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty[0] & /*contentClassName*/ 128 && div0_class_value !== (div0_class_value = classnames('modal-content', /*contentClassName*/ ctx[7]))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (!current || dirty[0] & /*classes*/ 8192) {
    				attr_dev(div1, "class", /*classes*/ ctx[13]);
    			}

    			if (!current || dirty[0] & /*labelledBy*/ 4) {
    				attr_dev(div2, "arialabelledby", /*labelledBy*/ ctx[2]);
    			}

    			if (!current || dirty[0] & /*modalClassName, isOpen, staticModal*/ 35 && div2_class_value !== (div2_class_value = classnames('modal', /*modalClassName*/ ctx[5], {
    				show: /*isOpen*/ ctx[1],
    				'd-block': /*isOpen*/ ctx[1],
    				'd-none': !/*isOpen*/ ctx[1],
    				'position-static': /*staticModal*/ ctx[0]
    			}))) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (/*backdrop*/ ctx[3] && !/*staticModal*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*backdrop, staticModal*/ 9) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(external_slot, local);
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (!div2_transition) div2_transition = create_bidirectional_transition(div2, /*transitionType*/ ctx[9], /*transitionOptions*/ ctx[10], true);
    				div2_transition.run(1);
    			});

    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(external_slot, local);
    			transition_out(default_slot, local);
    			if (!div2_transition) div2_transition = create_bidirectional_transition(div2, /*transitionType*/ ctx[9], /*transitionOptions*/ ctx[10], false);
    			div2_transition.run(0);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (external_slot) external_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			/*div1_binding*/ ctx[34](null);
    			if (detaching && div2_transition) div2_transition.end();
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(222:4) {#if isOpen}",
    		ctx
    	});

    	return block;
    }

    // (244:6) {#if backdrop && !staticModal}
    function create_if_block_2(ctx) {
    	let div;
    	let div_class_value;
    	let div_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", div_class_value = classnames('modal-backdrop', 'show', /*backdropClassName*/ ctx[6]));
    			add_location(div, file$o, 244, 8, 5548);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty[0] & /*backdropClassName*/ 64 && div_class_value !== (div_class_value = classnames('modal-backdrop', 'show', /*backdropClassName*/ ctx[6]))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: /*backdropDuration*/ ctx[8] }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: /*backdropDuration*/ ctx[8] }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(244:6) {#if backdrop && !staticModal}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*_isMounted*/ ctx[11] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*_isMounted*/ ctx[11]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*_isMounted*/ 2048) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    let openCount = 0;
    const dialogBaseClass = 'modal-dialog';

    function noop() {
    	
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let classes;

    	const omit_props_names = [
    		"class","static","isOpen","autoFocus","centered","scrollable","size","toggle","labelledBy","backdrop","onEnter","onExit","onOpened","onClosed","wrapClassName","modalClassName","backdropClassName","contentClassName","fade","backdropDuration","unmountOnClose","returnFocusAfterClose","transitionType","transitionOptions"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['external','default']);
    	let { class: className = '' } = $$props;
    	let { static: staticModal = false } = $$props;
    	let { isOpen = false } = $$props;
    	let { autoFocus = true } = $$props;
    	let { centered = false } = $$props;
    	let { scrollable = false } = $$props;
    	let { size = '' } = $$props;
    	let { toggle = undefined } = $$props;
    	let { labelledBy = '' } = $$props;
    	let { backdrop = true } = $$props;
    	let { onEnter = undefined } = $$props;
    	let { onExit = undefined } = $$props;
    	let { onOpened = noop } = $$props;
    	let { onClosed = noop } = $$props;
    	let { wrapClassName = '' } = $$props;
    	let { modalClassName = '' } = $$props;
    	let { backdropClassName = '' } = $$props;
    	let { contentClassName = '' } = $$props;
    	let { fade: fade$1 = true } = $$props;
    	let { backdropDuration = fade$1 ? 150 : 0 } = $$props;
    	let { unmountOnClose = true } = $$props;
    	let { returnFocusAfterClose = true } = $$props;
    	let { transitionType = fade } = $$props;
    	let { transitionOptions = { duration: fade$1 ? 300 : 0 } } = $$props;
    	let hasOpened = false;
    	let _isMounted = false;
    	let _triggeringElement;
    	let _originalBodyPadding;
    	let _lastIsOpen = isOpen;
    	let _lastHasOpened = hasOpened;
    	let _dialog;
    	let _mouseDownElement;
    	let _removeEscListener;

    	onMount(() => {
    		if (isOpen) {
    			init();
    			hasOpened = true;
    		}

    		if (typeof onEnter === 'function') {
    			onEnter();
    		}

    		if (hasOpened && autoFocus) {
    			setFocus();
    		}
    	});

    	onDestroy(() => {
    		if (typeof onExit === 'function') {
    			onExit();
    		}

    		destroy();

    		if (hasOpened) {
    			close();
    		}
    	});

    	afterUpdate(() => {
    		if (isOpen && !_lastIsOpen) {
    			init();
    			hasOpened = true;
    		}

    		if (autoFocus && hasOpened && !_lastHasOpened) {
    			setFocus();
    		}

    		_lastIsOpen = isOpen;
    		_lastHasOpened = hasOpened;
    	});

    	function setFocus() {
    		if (_dialog && _dialog.parentNode && typeof _dialog.parentNode.focus === 'function') {
    			_dialog.parentNode.focus();
    		}
    	}

    	function init() {
    		try {
    			_triggeringElement = document.activeElement;
    		} catch(err) {
    			_triggeringElement = null;
    		}

    		if (!staticModal) {
    			_originalBodyPadding = getOriginalBodyPadding();
    			conditionallyUpdateScrollbar();

    			if (openCount === 0) {
    				document.body.className = classnames(document.body.className, 'modal-open');
    			}

    			++openCount;
    		}

    		$$invalidate(11, _isMounted = true);
    	}

    	function manageFocusAfterClose() {
    		if (_triggeringElement) {
    			if (typeof _triggeringElement.focus === 'function' && returnFocusAfterClose) {
    				_triggeringElement.focus();
    			}

    			_triggeringElement = null;
    		}
    	}

    	function destroy() {
    		manageFocusAfterClose();
    	}

    	function close() {
    		if (openCount <= 1) {
    			const modalOpenClassName = 'modal-open';
    			const modalOpenClassNameRegex = new RegExp(`(^| )${modalOpenClassName}( |$)`);
    			document.body.className = document.body.className.replace(modalOpenClassNameRegex, ' ').trim();
    		}

    		manageFocusAfterClose();
    		openCount = Math.max(0, openCount - 1);
    		setScrollbarWidth(_originalBodyPadding);
    	}

    	function handleBackdropClick(e) {
    		if (e.target === _mouseDownElement) {
    			e.stopPropagation();

    			if (!isOpen || !backdrop) {
    				return;
    			}

    			const backdropElem = _dialog ? _dialog.parentNode : null;

    			if (backdropElem && e.target === backdropElem && toggle) {
    				toggle(e);
    			}
    		}
    	}

    	function onModalOpened() {
    		_removeEscListener = browserEvent(document, 'keydown', event => {
    			if (event.key && event.key === 'Escape') {
    				toggle(event);
    			}
    		});

    		onOpened();
    	}

    	function onModalClosed() {
    		onClosed();

    		if (_removeEscListener) {
    			_removeEscListener();
    		}

    		if (unmountOnClose) {
    			destroy();
    		}

    		close();

    		if (_isMounted) {
    			hasOpened = false;
    		}

    		$$invalidate(11, _isMounted = false);
    	}

    	function handleBackdropMouseDown(e) {
    		_mouseDownElement = e.target;
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			_dialog = $$value;
    			$$invalidate(12, _dialog);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(18, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(19, className = $$new_props.class);
    		if ('static' in $$new_props) $$invalidate(0, staticModal = $$new_props.static);
    		if ('isOpen' in $$new_props) $$invalidate(1, isOpen = $$new_props.isOpen);
    		if ('autoFocus' in $$new_props) $$invalidate(20, autoFocus = $$new_props.autoFocus);
    		if ('centered' in $$new_props) $$invalidate(21, centered = $$new_props.centered);
    		if ('scrollable' in $$new_props) $$invalidate(22, scrollable = $$new_props.scrollable);
    		if ('size' in $$new_props) $$invalidate(23, size = $$new_props.size);
    		if ('toggle' in $$new_props) $$invalidate(24, toggle = $$new_props.toggle);
    		if ('labelledBy' in $$new_props) $$invalidate(2, labelledBy = $$new_props.labelledBy);
    		if ('backdrop' in $$new_props) $$invalidate(3, backdrop = $$new_props.backdrop);
    		if ('onEnter' in $$new_props) $$invalidate(25, onEnter = $$new_props.onEnter);
    		if ('onExit' in $$new_props) $$invalidate(26, onExit = $$new_props.onExit);
    		if ('onOpened' in $$new_props) $$invalidate(27, onOpened = $$new_props.onOpened);
    		if ('onClosed' in $$new_props) $$invalidate(28, onClosed = $$new_props.onClosed);
    		if ('wrapClassName' in $$new_props) $$invalidate(4, wrapClassName = $$new_props.wrapClassName);
    		if ('modalClassName' in $$new_props) $$invalidate(5, modalClassName = $$new_props.modalClassName);
    		if ('backdropClassName' in $$new_props) $$invalidate(6, backdropClassName = $$new_props.backdropClassName);
    		if ('contentClassName' in $$new_props) $$invalidate(7, contentClassName = $$new_props.contentClassName);
    		if ('fade' in $$new_props) $$invalidate(29, fade$1 = $$new_props.fade);
    		if ('backdropDuration' in $$new_props) $$invalidate(8, backdropDuration = $$new_props.backdropDuration);
    		if ('unmountOnClose' in $$new_props) $$invalidate(30, unmountOnClose = $$new_props.unmountOnClose);
    		if ('returnFocusAfterClose' in $$new_props) $$invalidate(31, returnFocusAfterClose = $$new_props.returnFocusAfterClose);
    		if ('transitionType' in $$new_props) $$invalidate(9, transitionType = $$new_props.transitionType);
    		if ('transitionOptions' in $$new_props) $$invalidate(10, transitionOptions = $$new_props.transitionOptions);
    		if ('$$scope' in $$new_props) $$invalidate(32, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		openCount,
    		classnames,
    		browserEvent,
    		onDestroy,
    		onMount,
    		afterUpdate,
    		fadeTransition: fade,
    		conditionallyUpdateScrollbar,
    		getOriginalBodyPadding,
    		setScrollbarWidth,
    		noop,
    		className,
    		staticModal,
    		isOpen,
    		autoFocus,
    		centered,
    		scrollable,
    		size,
    		toggle,
    		labelledBy,
    		backdrop,
    		onEnter,
    		onExit,
    		onOpened,
    		onClosed,
    		wrapClassName,
    		modalClassName,
    		backdropClassName,
    		contentClassName,
    		fade: fade$1,
    		backdropDuration,
    		unmountOnClose,
    		returnFocusAfterClose,
    		transitionType,
    		transitionOptions,
    		hasOpened,
    		_isMounted,
    		_triggeringElement,
    		_originalBodyPadding,
    		_lastIsOpen,
    		_lastHasOpened,
    		_dialog,
    		_mouseDownElement,
    		_removeEscListener,
    		setFocus,
    		init,
    		manageFocusAfterClose,
    		destroy,
    		close,
    		handleBackdropClick,
    		onModalOpened,
    		onModalClosed,
    		handleBackdropMouseDown,
    		dialogBaseClass,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(19, className = $$new_props.className);
    		if ('staticModal' in $$props) $$invalidate(0, staticModal = $$new_props.staticModal);
    		if ('isOpen' in $$props) $$invalidate(1, isOpen = $$new_props.isOpen);
    		if ('autoFocus' in $$props) $$invalidate(20, autoFocus = $$new_props.autoFocus);
    		if ('centered' in $$props) $$invalidate(21, centered = $$new_props.centered);
    		if ('scrollable' in $$props) $$invalidate(22, scrollable = $$new_props.scrollable);
    		if ('size' in $$props) $$invalidate(23, size = $$new_props.size);
    		if ('toggle' in $$props) $$invalidate(24, toggle = $$new_props.toggle);
    		if ('labelledBy' in $$props) $$invalidate(2, labelledBy = $$new_props.labelledBy);
    		if ('backdrop' in $$props) $$invalidate(3, backdrop = $$new_props.backdrop);
    		if ('onEnter' in $$props) $$invalidate(25, onEnter = $$new_props.onEnter);
    		if ('onExit' in $$props) $$invalidate(26, onExit = $$new_props.onExit);
    		if ('onOpened' in $$props) $$invalidate(27, onOpened = $$new_props.onOpened);
    		if ('onClosed' in $$props) $$invalidate(28, onClosed = $$new_props.onClosed);
    		if ('wrapClassName' in $$props) $$invalidate(4, wrapClassName = $$new_props.wrapClassName);
    		if ('modalClassName' in $$props) $$invalidate(5, modalClassName = $$new_props.modalClassName);
    		if ('backdropClassName' in $$props) $$invalidate(6, backdropClassName = $$new_props.backdropClassName);
    		if ('contentClassName' in $$props) $$invalidate(7, contentClassName = $$new_props.contentClassName);
    		if ('fade' in $$props) $$invalidate(29, fade$1 = $$new_props.fade);
    		if ('backdropDuration' in $$props) $$invalidate(8, backdropDuration = $$new_props.backdropDuration);
    		if ('unmountOnClose' in $$props) $$invalidate(30, unmountOnClose = $$new_props.unmountOnClose);
    		if ('returnFocusAfterClose' in $$props) $$invalidate(31, returnFocusAfterClose = $$new_props.returnFocusAfterClose);
    		if ('transitionType' in $$props) $$invalidate(9, transitionType = $$new_props.transitionType);
    		if ('transitionOptions' in $$props) $$invalidate(10, transitionOptions = $$new_props.transitionOptions);
    		if ('hasOpened' in $$props) hasOpened = $$new_props.hasOpened;
    		if ('_isMounted' in $$props) $$invalidate(11, _isMounted = $$new_props._isMounted);
    		if ('_triggeringElement' in $$props) _triggeringElement = $$new_props._triggeringElement;
    		if ('_originalBodyPadding' in $$props) _originalBodyPadding = $$new_props._originalBodyPadding;
    		if ('_lastIsOpen' in $$props) _lastIsOpen = $$new_props._lastIsOpen;
    		if ('_lastHasOpened' in $$props) _lastHasOpened = $$new_props._lastHasOpened;
    		if ('_dialog' in $$props) $$invalidate(12, _dialog = $$new_props._dialog);
    		if ('_mouseDownElement' in $$props) _mouseDownElement = $$new_props._mouseDownElement;
    		if ('_removeEscListener' in $$props) _removeEscListener = $$new_props._removeEscListener;
    		if ('classes' in $$props) $$invalidate(13, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*className, size, centered, scrollable*/ 15204352) {
    			$$invalidate(13, classes = classnames(dialogBaseClass, className, {
    				[`modal-${size}`]: size,
    				[`${dialogBaseClass}-centered`]: centered,
    				[`${dialogBaseClass}-scrollable`]: scrollable
    			}));
    		}
    	};

    	return [
    		staticModal,
    		isOpen,
    		labelledBy,
    		backdrop,
    		wrapClassName,
    		modalClassName,
    		backdropClassName,
    		contentClassName,
    		backdropDuration,
    		transitionType,
    		transitionOptions,
    		_isMounted,
    		_dialog,
    		classes,
    		handleBackdropClick,
    		onModalOpened,
    		onModalClosed,
    		handleBackdropMouseDown,
    		$$restProps,
    		className,
    		autoFocus,
    		centered,
    		scrollable,
    		size,
    		toggle,
    		onEnter,
    		onExit,
    		onOpened,
    		onClosed,
    		fade$1,
    		unmountOnClose,
    		returnFocusAfterClose,
    		$$scope,
    		slots,
    		div1_binding
    	];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$p,
    			create_fragment$p,
    			safe_not_equal,
    			{
    				class: 19,
    				static: 0,
    				isOpen: 1,
    				autoFocus: 20,
    				centered: 21,
    				scrollable: 22,
    				size: 23,
    				toggle: 24,
    				labelledBy: 2,
    				backdrop: 3,
    				onEnter: 25,
    				onExit: 26,
    				onOpened: 27,
    				onClosed: 28,
    				wrapClassName: 4,
    				modalClassName: 5,
    				backdropClassName: 6,
    				contentClassName: 7,
    				fade: 29,
    				backdropDuration: 8,
    				unmountOnClose: 30,
    				returnFocusAfterClose: 31,
    				transitionType: 9,
    				transitionOptions: 10
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get class() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get static() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set static(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autoFocus() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autoFocus(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get centered() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set centered(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollable() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrollable(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggle() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggle(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelledBy() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelledBy(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backdrop() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backdrop(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onEnter() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onEnter(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onExit() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onExit(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onOpened() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onOpened(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClosed() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClosed(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get wrapClassName() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set wrapClassName(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get modalClassName() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modalClassName(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backdropClassName() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backdropClassName(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get contentClassName() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set contentClassName(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fade() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fade(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backdropDuration() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backdropDuration(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unmountOnClose() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unmountOnClose(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get returnFocusAfterClose() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set returnFocusAfterClose(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionType() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionType(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionOptions() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionOptions(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\ModalBody.svelte generated by Svelte v3.44.0 */
    const file$n = "node_modules\\sveltestrap\\src\\ModalBody.svelte";

    function create_fragment$o(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$n, 9, 0, 165);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ModalBody', slots, ['default']);
    	let { class: className = '' } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('$$scope' in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, classes });

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('classes' in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 4) {
    			$$invalidate(0, classes = classnames(className, 'modal-body'));
    		}
    	};

    	return [classes, $$restProps, className, $$scope, slots];
    }

    class ModalBody extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, { class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ModalBody",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get class() {
    		throw new Error("<ModalBody>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ModalBody>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\ModalHeader.svelte generated by Svelte v3.44.0 */
    const file$m = "node_modules\\sveltestrap\\src\\ModalHeader.svelte";
    const get_close_slot_changes = dirty => ({});
    const get_close_slot_context = ctx => ({});

    // (21:4) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(21:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (19:4) {#if children}
    function create_if_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*children*/ ctx[2]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 4) set_data_dev(t, /*children*/ ctx[2]);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(19:4) {#if children}",
    		ctx
    	});

    	return block;
    }

    // (26:4) {#if typeof toggle === 'function'}
    function create_if_block(ctx) {
    	let button;
    	let span;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			span = element("span");
    			t = text(/*closeIcon*/ ctx[4]);
    			attr_dev(span, "aria-hidden", "true");
    			add_location(span, file$m, 31, 8, 735);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "close");
    			attr_dev(button, "aria-label", /*closeAriaLabel*/ ctx[1]);
    			add_location(button, file$m, 26, 6, 612);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, span);
    			append_dev(span, t);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*toggle*/ ctx[0])) /*toggle*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*closeIcon*/ 16) set_data_dev(t, /*closeIcon*/ ctx[4]);

    			if (dirty & /*closeAriaLabel*/ 2) {
    				attr_dev(button, "aria-label", /*closeAriaLabel*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(26:4) {#if typeof toggle === 'function'}",
    		ctx
    	});

    	return block;
    }

    // (25:21)      
    function fallback_block(ctx) {
    	let if_block_anchor;
    	let if_block = typeof /*toggle*/ ctx[0] === 'function' && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (typeof /*toggle*/ ctx[0] === 'function') {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(25:21)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let div;
    	let h5;
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*children*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	const close_slot_template = /*#slots*/ ctx[9].close;
    	const close_slot = create_slot(close_slot_template, ctx, /*$$scope*/ ctx[8], get_close_slot_context);
    	const close_slot_or_fallback = close_slot || fallback_block(ctx);
    	let div_levels = [/*$$restProps*/ ctx[5], { class: /*classes*/ ctx[3] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h5 = element("h5");
    			if_block.c();
    			t = space();
    			if (close_slot_or_fallback) close_slot_or_fallback.c();
    			attr_dev(h5, "class", "modal-title");
    			add_location(h5, file$m, 17, 2, 439);
    			set_attributes(div, div_data);
    			add_location(div, file$m, 16, 0, 398);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h5);
    			if_blocks[current_block_type_index].m(h5, null);
    			append_dev(div, t);

    			if (close_slot_or_fallback) {
    				close_slot_or_fallback.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(h5, null);
    			}

    			if (close_slot) {
    				if (close_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						close_slot,
    						close_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(close_slot_template, /*$$scope*/ ctx[8], dirty, get_close_slot_changes),
    						get_close_slot_context
    					);
    				}
    			} else {
    				if (close_slot_or_fallback && close_slot_or_fallback.p && (!current || dirty & /*closeAriaLabel, toggle, closeIcon*/ 19)) {
    					close_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 32 && /*$$restProps*/ ctx[5],
    				(!current || dirty & /*classes*/ 8) && { class: /*classes*/ ctx[3] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(close_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(close_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			if (close_slot_or_fallback) close_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let closeIcon;
    	let classes;
    	const omit_props_names = ["class","toggle","closeAriaLabel","charCode","children"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ModalHeader', slots, ['default','close']);
    	let { class: className = '' } = $$props;
    	let { toggle = undefined } = $$props;
    	let { closeAriaLabel = 'Close' } = $$props;
    	let { charCode = 215 } = $$props;
    	let { children = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(6, className = $$new_props.class);
    		if ('toggle' in $$new_props) $$invalidate(0, toggle = $$new_props.toggle);
    		if ('closeAriaLabel' in $$new_props) $$invalidate(1, closeAriaLabel = $$new_props.closeAriaLabel);
    		if ('charCode' in $$new_props) $$invalidate(7, charCode = $$new_props.charCode);
    		if ('children' in $$new_props) $$invalidate(2, children = $$new_props.children);
    		if ('$$scope' in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		toggle,
    		closeAriaLabel,
    		charCode,
    		children,
    		classes,
    		closeIcon
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(6, className = $$new_props.className);
    		if ('toggle' in $$props) $$invalidate(0, toggle = $$new_props.toggle);
    		if ('closeAriaLabel' in $$props) $$invalidate(1, closeAriaLabel = $$new_props.closeAriaLabel);
    		if ('charCode' in $$props) $$invalidate(7, charCode = $$new_props.charCode);
    		if ('children' in $$props) $$invalidate(2, children = $$new_props.children);
    		if ('classes' in $$props) $$invalidate(3, classes = $$new_props.classes);
    		if ('closeIcon' in $$props) $$invalidate(4, closeIcon = $$new_props.closeIcon);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*charCode*/ 128) {
    			$$invalidate(4, closeIcon = typeof charCode === 'number'
    			? String.fromCharCode(charCode)
    			: charCode);
    		}

    		if ($$self.$$.dirty & /*className*/ 64) {
    			$$invalidate(3, classes = classnames(className, 'modal-header'));
    		}
    	};

    	return [
    		toggle,
    		closeAriaLabel,
    		children,
    		classes,
    		closeIcon,
    		$$restProps,
    		className,
    		charCode,
    		$$scope,
    		slots
    	];
    }

    class ModalHeader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {
    			class: 6,
    			toggle: 0,
    			closeAriaLabel: 1,
    			charCode: 7,
    			children: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ModalHeader",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get class() {
    		throw new Error("<ModalHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ModalHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggle() {
    		throw new Error("<ModalHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggle(value) {
    		throw new Error("<ModalHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeAriaLabel() {
    		throw new Error("<ModalHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeAriaLabel(value) {
    		throw new Error("<ModalHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get charCode() {
    		throw new Error("<ModalHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set charCode(value) {
    		throw new Error("<ModalHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error("<ModalHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error("<ModalHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Row.svelte generated by Svelte v3.44.0 */
    const file$l = "node_modules\\sveltestrap\\src\\Row.svelte";

    function create_fragment$m(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$l, 38, 0, 957);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getCols(cols) {
    	const colsValue = parseInt(cols);

    	if (!isNaN(colsValue)) {
    		if (colsValue > 0) {
    			return [`row-cols-${colsValue}`];
    		}
    	} else if (typeof cols === 'object') {
    		return ['xs', 'sm', 'md', 'lg', 'xl'].map(colWidth => {
    			const isXs = colWidth === 'xs';
    			const colSizeInterfix = isXs ? '-' : `-${colWidth}-`;
    			const value = cols[colWidth];

    			if (typeof value === 'number' && value > 0) {
    				return `row-cols${colSizeInterfix}${value}`;
    			}

    			return null;
    		}).filter(value => !!value);
    	}

    	return [];
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","noGutters","form","cols"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Row', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { noGutters = false } = $$props;
    	let { form = false } = $$props;
    	let { cols = 0 } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('noGutters' in $$new_props) $$invalidate(3, noGutters = $$new_props.noGutters);
    		if ('form' in $$new_props) $$invalidate(4, form = $$new_props.form);
    		if ('cols' in $$new_props) $$invalidate(5, cols = $$new_props.cols);
    		if ('$$scope' in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		noGutters,
    		form,
    		cols,
    		getCols,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('noGutters' in $$props) $$invalidate(3, noGutters = $$new_props.noGutters);
    		if ('form' in $$props) $$invalidate(4, form = $$new_props.form);
    		if ('cols' in $$props) $$invalidate(5, cols = $$new_props.cols);
    		if ('classes' in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, noGutters, form, cols*/ 60) {
    			$$invalidate(0, classes = classnames(className, noGutters ? 'no-gutters' : null, form ? 'form-row' : 'row', ...getCols(cols)));
    		}
    	};

    	return [classes, $$restProps, className, noGutters, form, cols, $$scope, slots];
    }

    class Row extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { class: 2, noGutters: 3, form: 4, cols: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Row",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get class() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutters() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutters(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get form() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set form(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cols() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cols(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var _ = {
      $(selector) {
        if (typeof selector === "string") {
          return document.querySelector(selector);
        }
        return selector;
      },
      extend(...args) {
        return Object.assign(...args);
      },
      cumulativeOffset(element) {
        let top = 0;
        let left = 0;

        do {
          top += element.offsetTop || 0;
          left += element.offsetLeft || 0;
          element = element.offsetParent;
        } while (element);

        return {
          top: top,
          left: left
        };
      },
      directScroll(element) {
        return element && element !== document && element !== document.body;
      },
      scrollTop(element, value) {
        let inSetter = value !== undefined;
        if (this.directScroll(element)) {
          return inSetter ? (element.scrollTop = value) : element.scrollTop;
        } else {
          return inSetter
            ? (document.documentElement.scrollTop = document.body.scrollTop = value)
            : window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                0;
        }
      },
      scrollLeft(element, value) {
        let inSetter = value !== undefined;
        if (this.directScroll(element)) {
          return inSetter ? (element.scrollLeft = value) : element.scrollLeft;
        } else {
          return inSetter
            ? (document.documentElement.scrollLeft = document.body.scrollLeft = value)
            : window.pageXOffset ||
                document.documentElement.scrollLeft ||
                document.body.scrollLeft ||
                0;
        }
      }
    };

    const defaultOptions = {
      container: "body",
      duration: 500,
      delay: 0,
      offset: 0,
      easing: cubicInOut,
      onStart: noop$1,
      onDone: noop$1,
      onAborting: noop$1,
      scrollX: false,
      scrollY: true
    };

    const _scrollTo = options => {
      let {
        offset,
        duration,
        delay,
        easing,
        x=0,
        y=0,
        scrollX,
        scrollY,
        onStart,
        onDone,
        container,
        onAborting,
        element
      } = options;

      if (typeof offset === "function") {
        offset = offset();
      }

      var cumulativeOffsetContainer = _.cumulativeOffset(container);
      var cumulativeOffsetTarget = element
        ? _.cumulativeOffset(element)
        : { top: y, left: x };

      var initialX = _.scrollLeft(container);
      var initialY = _.scrollTop(container);

      var targetX =
        cumulativeOffsetTarget.left - cumulativeOffsetContainer.left + offset;
      var targetY =
        cumulativeOffsetTarget.top - cumulativeOffsetContainer.top + offset;

      var diffX = targetX - initialX;
    	var diffY = targetY - initialY;

      let scrolling = true;
      let started = false;
      let start_time = now() + delay;
      let end_time = start_time + duration;

      function scrollToTopLeft(element, top, left) {
        if (scrollX) _.scrollLeft(element, left);
        if (scrollY) _.scrollTop(element, top);
      }

      function start(delayStart) {
        if (!delayStart) {
          started = true;
          onStart(element, {x, y});
        }
      }

      function tick(progress) {
        scrollToTopLeft(
          container,
          initialY + diffY * progress,
          initialX + diffX * progress
        );
      }

      function stop() {
        scrolling = false;
      }

      loop(now => {
        if (!started && now >= start_time) {
          start(false);
        }

        if (started && now >= end_time) {
          tick(1);
          stop();
          onDone(element, {x, y});
        }

        if (!scrolling) {
          onAborting(element, {x, y});
          return false;
        }
        if (started) {
          const p = now - start_time;
          const t = 0 + 1 * easing(p / duration);
          tick(t);
        }

        return true;
      });

      start(delay);

      tick(0);

      return stop;
    };

    const proceedOptions = options => {
    	let opts = _.extend({}, defaultOptions, options);
      opts.container = _.$(opts.container);
      opts.element = _.$(opts.element);
      return opts;
    };

    const scrollTo = options => {
      return _scrollTo(proceedOptions(options));
    };

    const makeScrollToAction = scrollToFunc => {
      return (node, options) => {
        let current = options;
        const handle = e => {
          e.preventDefault();
          scrollToFunc(
            typeof current === "string" ? { element: current } : current
          );
        };
        node.addEventListener("click", handle);
        node.addEventListener("touchstart", handle);
        return {
          update(options) {
            current = options;
          },
          destroy() {
            node.removeEventListener("click", handle);
            node.removeEventListener("touchstart", handle);
          }
        };
      };
    };

    const scrollto = makeScrollToAction(scrollTo);

    /* src\Components\Navbar.svelte generated by Svelte v3.44.0 */
    const file$k = "src\\Components\\Navbar.svelte";

    // (69:6) <Link class="navbar-brand logo text-uppercase" to="/">
    function create_default_slot_1$f(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "/images/logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Logo");
    			attr_dev(img, "height", "100px;");
    			add_location(img, file$k, 68, 61, 1680);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$f.name,
    		type: "slot",
    		source: "(69:6) <Link class=\\\"navbar-brand logo text-uppercase\\\" to=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (70:6) <Button class="navbar-toggler" on:click={toggleMenu}>
    function create_default_slot$f(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "mdi mdi-menu");
    			add_location(i, file$k, 70, 8, 1812);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$f.name,
    		type: "slot",
    		source: "(70:6) <Button class=\\\"navbar-toggler\\\" on:click={toggleMenu}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let div2;
    	let nav;
    	let div1;
    	let link;
    	let t0;
    	let button;
    	let t1;
    	let div0;
    	let ul;
    	let li0;
    	let a0;
    	let t3;
    	let li1;
    	let a1;
    	let t5;
    	let li2;
    	let a2;
    	let t7;
    	let li3;
    	let a3;
    	let t9;
    	let li4;
    	let a4;
    	let t11;
    	let li5;
    	let a5;
    	let current;
    	let mounted;
    	let dispose;

    	link = new Link({
    			props: {
    				class: "navbar-brand logo text-uppercase",
    				to: "/",
    				$$slots: { default: [create_default_slot_1$f] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button = new Button({
    			props: {
    				class: "navbar-toggler",
    				$$slots: { default: [create_default_slot$f] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*toggleMenu*/ ctx[0]);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			nav = element("nav");
    			div1 = element("div");
    			create_component(link.$$.fragment);
    			t0 = space();
    			create_component(button.$$.fragment);
    			t1 = space();
    			div0 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Home";
    			t3 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "About";
    			t5 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Tokenomics";
    			t7 = space();
    			li3 = element("li");
    			a3 = element("a");
    			a3.textContent = "Trade";
    			t9 = space();
    			li4 = element("li");
    			a4 = element("a");
    			a4.textContent = "Link";
    			t11 = space();
    			li5 = element("li");
    			a5 = element("a");
    			a5.textContent = "Link";
    			attr_dev(a0, "href", "#home");
    			attr_dev(a0, "class", "nav-link active");
    			add_location(a0, file$k, 75, 12, 2030);
    			attr_dev(li0, "class", "nav-item");
    			add_location(li0, file$k, 74, 10, 1996);
    			attr_dev(a1, "href", "#services");
    			attr_dev(a1, "class", "nav-link");
    			add_location(a1, file$k, 80, 12, 2192);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file$k, 79, 10, 2158);
    			attr_dev(a2, "href", "#features");
    			attr_dev(a2, "class", "nav-link");
    			add_location(a2, file$k, 85, 12, 2356);
    			attr_dev(li2, "class", "nav-item");
    			add_location(li2, file$k, 84, 10, 2322);
    			attr_dev(a3, "href", "#trade");
    			attr_dev(a3, "class", "nav-link");
    			add_location(a3, file$k, 90, 12, 2525);
    			attr_dev(li3, "class", "nav-item");
    			add_location(li3, file$k, 89, 10, 2491);
    			attr_dev(a4, "href", "#features");
    			attr_dev(a4, "class", "nav-link");
    			add_location(a4, file$k, 96, 12, 2694);
    			attr_dev(li4, "class", "nav-item");
    			add_location(li4, file$k, 95, 10, 2660);
    			attr_dev(a5, "href", "#features");
    			attr_dev(a5, "class", "nav-link");
    			add_location(a5, file$k, 101, 12, 2857);
    			attr_dev(li5, "class", "nav-item");
    			add_location(li5, file$k, 100, 10, 2823);
    			attr_dev(ul, "class", "navbar-nav navbar-center");
    			attr_dev(ul, "id", "navbar-navlist");
    			add_location(ul, file$k, 73, 8, 1928);
    			attr_dev(div0, "class", "collapse navbar-collapse");
    			attr_dev(div0, "id", "navbarCollapse");
    			add_location(div0, file$k, 72, 6, 1861);
    			attr_dev(div1, "class", "container");
    			add_location(div1, file$k, 66, 4, 1575);
    			attr_dev(nav, "class", "navbar navbar-expand-lg fixed-top navbar-custom sticky sticky-dark");
    			attr_dev(nav, "id", "navbar");
    			add_location(nav, file$k, 62, 2, 1467);
    			attr_dev(div2, "id", "navbar");
    			add_location(div2, file$k, 61, 0, 1447);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, nav);
    			append_dev(nav, div1);
    			mount_component(link, div1, null);
    			append_dev(div1, t0);
    			mount_component(button, div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t3);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(ul, t5);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(ul, t7);
    			append_dev(ul, li3);
    			append_dev(li3, a3);
    			append_dev(ul, t9);
    			append_dev(ul, li4);
    			append_dev(li4, a4);
    			append_dev(ul, t11);
    			append_dev(ul, li5);
    			append_dev(li5, a5);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(scrollto.call(null, a0, "#home")),
    					action_destroyer(scrollto.call(null, a1, "#services")),
    					action_destroyer(scrollto.call(null, a2, "#features")),
    					action_destroyer(scrollto.call(null, a3, "#trade")),
    					action_destroyer(scrollto.call(null, a4, "#features")),
    					action_destroyer(scrollto.call(null, a5, "#features"))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(link);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, []);

    	const toggleMenu = () => {
    		document.getElementById("navbarCollapse").classList.toggle("show");
    	};

    	/**
     * Component mount
     */
    	onMount(() => {
    		var section = document.querySelectorAll(".common-section");
    		var sections = {};
    		var i = 0;

    		Array.prototype.forEach.call(section, function (e) {
    			sections[e.id] = e.offsetTop;
    		});

    		window.onscroll = function () {
    			var scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

    			for (i in sections) {
    				if (sections[i] <= scrollPosition) {
    					document.querySelector(".active").setAttribute("class", " ");
    					document.querySelector("a[href*=" + i + "]").setAttribute("class", "active");
    				}
    			}
    		};
    	});

    	/**
     * Scroll method
     */
    	const handleScroll = () => {
    		var navbar = document.getElementById("navbar");

    		if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    			navbar.classList.add("is-sticky");
    		} else {
    			navbar.classList.remove("is-sticky");
    		}
    	};

    	window.addEventListener("scroll", handleScroll, { passive: false });
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Link,
    		scrollto,
    		onMount,
    		Button,
    		toggleMenu,
    		handleScroll
    	});

    	return [toggleMenu];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* src\Components\Services.svelte generated by Svelte v3.44.0 */
    const file$j = "src\\Components\\Services.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (13:6) <Col lg={{ size: 8, offset: 2 }}>
    function create_default_slot_4$8(ctx) {
    	let h1;
    	let t1;
    	let div;
    	let t2;
    	let p;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = `${/*heading*/ ctx[0]}`;
    			t1 = space();
    			div = element("div");
    			t2 = space();
    			p = element("p");
    			p.textContent = `${/*description*/ ctx[1]}`;
    			attr_dev(h1, "class", "section-title text-center");
    			add_location(h1, file$j, 13, 8, 350);
    			attr_dev(div, "class", "section-title-border mt-3");
    			add_location(div, file$j, 14, 8, 411);
    			attr_dev(p, "class", "section-subtitle text-muted text-center pt-4 font-secondary");
    			add_location(p, file$j, 15, 8, 461);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$8.name,
    		type: "slot",
    		source: "(13:6) <Col lg={{ size: 8, offset: 2 }}>",
    		ctx
    	});

    	return block;
    }

    // (12:4) <Row>
    function create_default_slot_3$8(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: { size: 8, offset: 2 },
    				$$slots: { default: [create_default_slot_4$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$8.name,
    		type: "slot",
    		source: "(12:4) <Row>",
    		ctx
    	});

    	return block;
    }

    // (23:8) <Col lg="4" class="mt-3">
    function create_default_slot_2$a(ctx) {
    	let div;
    	let i;
    	let t0;
    	let h4;
    	let t1_value = /*list*/ ctx[4].label + "";
    	let t1;
    	let t2;
    	let p;
    	let t3_value = /*list*/ ctx[4].text + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			t0 = space();
    			h4 = element("h4");
    			t1 = text(t1_value);
    			t2 = space();
    			p = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			attr_dev(i, "class", "" + (/*list*/ ctx[4].icon + " text-primary"));
    			add_location(i, file$j, 24, 12, 761);
    			attr_dev(h4, "class", "pt-3");
    			add_location(h4, file$j, 25, 12, 812);
    			attr_dev(p, "class", "pt-3 text-muted");
    			add_location(p, file$j, 26, 12, 859);
    			attr_dev(div, "class", "services-box text-center hover-effect");
    			add_location(div, file$j, 23, 10, 697);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    			append_dev(div, t0);
    			append_dev(div, h4);
    			append_dev(h4, t1);
    			append_dev(div, t2);
    			append_dev(div, p);
    			append_dev(p, t3);
    			insert_dev(target, t4, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$a.name,
    		type: "slot",
    		source: "(23:8) <Col lg=\\\"4\\\" class=\\\"mt-3\\\">",
    		ctx
    	});

    	return block;
    }

    // (22:6) {#each services_list as list}
    function create_each_block$5(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: "4",
    				class: "mt-3",
    				$$slots: { default: [create_default_slot_2$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(22:6) {#each services_list as list}",
    		ctx
    	});

    	return block;
    }

    // (21:4) <Row class="mt-4">
    function create_default_slot_1$e(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*services_list*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*services_list*/ 4) {
    				each_value = /*services_list*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
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
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$e.name,
    		type: "slot",
    		source: "(21:4) <Row class=\\\"mt-4\\\">",
    		ctx
    	});

    	return block;
    }

    // (11:2) <Container>
    function create_default_slot$e(ctx) {
    	let row0;
    	let t;
    	let row1;
    	let current;

    	row0 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_3$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	row1 = new Row({
    			props: {
    				class: "mt-4",
    				$$slots: { default: [create_default_slot_1$e] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row0.$$.fragment);
    			t = space();
    			create_component(row1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(row1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row0_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				row0_changes.$$scope = { dirty, ctx };
    			}

    			row0.$set(row0_changes);
    			const row1_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				row1_changes.$$scope = { dirty, ctx };
    			}

    			row1.$set(row1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row0.$$.fragment, local);
    			transition_in(row1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row0.$$.fragment, local);
    			transition_out(row1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(row1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$e.name,
    		type: "slot",
    		source: "(11:2) <Container>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let section;
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$e] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(container.$$.fragment);
    			attr_dev(section, "class", "section pt-5 common-section");
    			attr_dev(section, "id", "services");
    			add_location(section, file$j, 9, 0, 218);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(container, section, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(container);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Services', slots, []);
    	let { serviceData = {} } = $$props;
    	const { heading, description, services_list } = serviceData;
    	const writable_props = ['serviceData'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Services> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('serviceData' in $$props) $$invalidate(3, serviceData = $$props.serviceData);
    	};

    	$$self.$capture_state = () => ({
    		Col,
    		Row,
    		Container,
    		serviceData,
    		heading,
    		description,
    		services_list
    	});

    	$$self.$inject_state = $$props => {
    		if ('serviceData' in $$props) $$invalidate(3, serviceData = $$props.serviceData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [heading, description, services_list, serviceData];
    }

    class Services extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { serviceData: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Services",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get serviceData() {
    		throw new Error("<Services>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set serviceData(value) {
    		throw new Error("<Services>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\Features.svelte generated by Svelte v3.44.0 */
    const file$i = "src\\Components\\Features.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (22:12) {#each feature_list as list}
    function create_each_block$4(ctx) {
    	let li;
    	let t_value = /*list*/ ctx[4] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "");
    			add_location(li, file$i, 22, 14, 626);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(22:12) {#each feature_list as list}",
    		ctx
    	});

    	return block;
    }

    // (13:6) <Col lg="5">
    function create_default_slot_6$5(ctx) {
    	let div;
    	let h3;
    	let t1;
    	let p;
    	let t3;
    	let ul;
    	let t4;
    	let a;
    	let t5;
    	let i;
    	let each_value = /*feature_list*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = `${/*title*/ ctx[0]}`;
    			t1 = space();
    			p = element("p");
    			p.textContent = `${/*text*/ ctx[1]}`;
    			t3 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			a = element("a");
    			t5 = text("Learn More ");
    			i = element("i");
    			add_location(h3, file$i, 14, 10, 382);
    			attr_dev(p, "class", "text-muted web-desc");
    			add_location(p, file$i, 17, 10, 433);
    			attr_dev(ul, "class", "text-muted list-unstyled mt-4 features-item-list");
    			add_location(ul, file$i, 20, 10, 509);
    			attr_dev(i, "class", "mdi mdi-arrow-right");
    			add_location(i, file$i, 26, 24, 791);
    			attr_dev(a, "href", '#');
    			attr_dev(a, "class", "btn btn-primary mt-4 waves-effect waves-light");
    			add_location(a, file$i, 25, 10, 697);
    			attr_dev(div, "class", "features-box");
    			add_location(div, file$i, 13, 8, 345);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(div, t3);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(div, t4);
    			append_dev(div, a);
    			append_dev(a, t5);
    			append_dev(a, i);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*feature_list*/ 4) {
    				each_value = /*feature_list*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$5.name,
    		type: "slot",
    		source: "(13:6) <Col lg=\\\"5\\\">",
    		ctx
    	});

    	return block;
    }

    // (31:6) <Col lg="7">
    function create_default_slot_5$5(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "images/online-world.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "macbook");
    			attr_dev(img, "class", "img-fluid");
    			add_location(img, file$i, 32, 10, 956);
    			attr_dev(div, "class", "features-img features-right text-end");
    			add_location(div, file$i, 31, 8, 895);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$5.name,
    		type: "slot",
    		source: "(31:6) <Col lg=\\\"7\\\">",
    		ctx
    	});

    	return block;
    }

    // (12:4) <Row class="vertical-content">
    function create_default_slot_4$7(ctx) {
    	let col0;
    	let t;
    	let col1;
    	let current;

    	col0 = new Col({
    			props: {
    				lg: "5",
    				$$slots: { default: [create_default_slot_6$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col1 = new Col({
    			props: {
    				lg: "7",
    				$$slots: { default: [create_default_slot_5$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t = space();
    			create_component(col1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(col1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(col1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$7.name,
    		type: "slot",
    		source: "(12:4) <Row class=\\\"vertical-content\\\">",
    		ctx
    	});

    	return block;
    }

    // (11:2) <Container>
    function create_default_slot_3$7(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				class: "vertical-content",
    				$$slots: { default: [create_default_slot_4$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$7.name,
    		type: "slot",
    		source: "(11:2) <Container>",
    		ctx
    	});

    	return block;
    }

    // (50:6) <Col lg="12" class="text-center">
    function create_default_slot_2$9(ctx) {
    	let h2;
    	let t1;
    	let p;
    	let t3;
    	let a;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Buy MysteryDAO";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Buy MysteryDAO token";
    			t3 = space();
    			a = element("a");
    			a.textContent = "Trade now!";
    			attr_dev(h2, "class", "text-white");
    			attr_dev(h2, "id", "trade");
    			add_location(h2, file$i, 50, 8, 1341);
    			attr_dev(p, "class", "pt-3 home-desc");
    			add_location(p, file$i, 51, 8, 1403);
    			attr_dev(a, "href", '#');
    			attr_dev(a, "class", "btn btn-white mt-4 waves-effect waves-light mb-5");
    			add_location(a, file$i, 54, 8, 1482);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$9.name,
    		type: "slot",
    		source: "(50:6) <Col lg=\\\"12\\\" class=\\\"text-center\\\">",
    		ctx
    	});

    	return block;
    }

    // (49:4) <Row>
    function create_default_slot_1$d(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: "12",
    				class: "text-center",
    				$$slots: { default: [create_default_slot_2$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$d.name,
    		type: "slot",
    		source: "(49:4) <Row>",
    		ctx
    	});

    	return block;
    }

    // (48:2) <Container>
    function create_default_slot$d(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_1$d] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$d.name,
    		type: "slot",
    		source: "(48:2) <Container>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let section0;
    	let container0;
    	let t0;
    	let section1;
    	let div0;
    	let t1;
    	let container1;
    	let t2;
    	let div1;
    	let img;
    	let img_src_value;
    	let current;

    	container0 = new Container({
    			props: {
    				$$slots: { default: [create_default_slot_3$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	container1 = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$d] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section0 = element("section");
    			create_component(container0.$$.fragment);
    			t0 = space();
    			section1 = element("section");
    			div0 = element("div");
    			t1 = space();
    			create_component(container1.$$.fragment);
    			t2 = space();
    			div1 = element("div");
    			img = element("img");
    			attr_dev(section0, "class", "section bg-light common-section");
    			attr_dev(section0, "id", "features");
    			add_location(section0, file$i, 9, 0, 205);
    			attr_dev(div0, "class", "bg-overlay");
    			add_location(div0, file$i, 46, 2, 1242);
    			if (!src_url_equal(img.src, img_src_value = "images/bg-pattern.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$i, 61, 4, 1667);
    			attr_dev(div1, "class", "bg-pattern-effect");
    			add_location(div1, file$i, 60, 2, 1631);
    			attr_dev(section1, "class", "section section-lg bg-web-desc");
    			add_location(section1, file$i, 45, 0, 1191);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section0, anchor);
    			mount_component(container0, section0, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, section1, anchor);
    			append_dev(section1, div0);
    			append_dev(section1, t1);
    			mount_component(container1, section1, null);
    			append_dev(section1, t2);
    			append_dev(section1, div1);
    			append_dev(div1, img);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const container0_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				container0_changes.$$scope = { dirty, ctx };
    			}

    			container0.$set(container0_changes);
    			const container1_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				container1_changes.$$scope = { dirty, ctx };
    			}

    			container1.$set(container1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container0.$$.fragment, local);
    			transition_in(container1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container0.$$.fragment, local);
    			transition_out(container1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section0);
    			destroy_component(container0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(section1);
    			destroy_component(container1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Features', slots, []);
    	let { featureData = {} } = $$props;
    	const { title, text, feature_list } = featureData;
    	const writable_props = ['featureData'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Features> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('featureData' in $$props) $$invalidate(3, featureData = $$props.featureData);
    	};

    	$$self.$capture_state = () => ({
    		Col,
    		Row,
    		Container,
    		featureData,
    		title,
    		text,
    		feature_list
    	});

    	$$self.$inject_state = $$props => {
    		if ('featureData' in $$props) $$invalidate(3, featureData = $$props.featureData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, text, feature_list, featureData];
    }

    class Features extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { featureData: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Features",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get featureData() {
    		throw new Error("<Features>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set featureData(value) {
    		throw new Error("<Features>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\Pricing.svelte generated by Svelte v3.44.0 */
    const file$h = "src\\Components\\Pricing.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (13:6) <Col lg={{ size: 8, offset: 2 }}>
    function create_default_slot_4$6(ctx) {
    	let h1;
    	let t1;
    	let div;
    	let t2;
    	let p;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = `${/*title*/ ctx[0]}`;
    			t1 = space();
    			div = element("div");
    			t2 = space();
    			p = element("p");
    			p.textContent = `${/*description*/ ctx[1]}`;
    			attr_dev(h1, "class", "section-title text-center");
    			add_location(h1, file$h, 13, 8, 344);
    			attr_dev(div, "class", "section-title-border mt-3");
    			add_location(div, file$h, 14, 8, 403);
    			attr_dev(p, "class", "section-subtitle font-secondary text-muted text-center pt-4");
    			add_location(p, file$h, 15, 8, 453);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$6.name,
    		type: "slot",
    		source: "(13:6) <Col lg={{ size: 8, offset: 2 }}>",
    		ctx
    	});

    	return block;
    }

    // (12:4) <Row>
    function create_default_slot_3$6(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: { size: 8, offset: 2 },
    				$$slots: { default: [create_default_slot_4$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$6.name,
    		type: "slot",
    		source: "(12:4) <Row>",
    		ctx
    	});

    	return block;
    }

    // (23:8) <Col lg="4">
    function create_default_slot_2$8(ctx) {
    	let div2;
    	let h4;
    	let t0_value = /*list*/ ctx[4].title + "";
    	let t0;
    	let t1;
    	let h1;
    	let t2_value = /*list*/ ctx[4].price + "";
    	let t2;
    	let t3;
    	let h6;
    	let t5;
    	let div0;
    	let t6;
    	let div1;
    	let p0;
    	let t7;
    	let b0;
    	let t8_value = /*list*/ ctx[4].bandwidth + "";
    	let t8;
    	let t9;
    	let p1;
    	let t10;
    	let b1;
    	let t11_value = /*list*/ ctx[4].space + "";
    	let t11;
    	let t12;
    	let p2;
    	let t13;
    	let b2;
    	let t14_value = /*list*/ ctx[4].support + "";
    	let t14;
    	let t15;
    	let p3;
    	let b3;
    	let t17;
    	let t18;
    	let p4;
    	let b4;
    	let t20;
    	let t21;
    	let a;
    	let t23;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			h4 = element("h4");
    			t0 = text(t0_value);
    			t1 = space();
    			h1 = element("h1");
    			t2 = text(t2_value);
    			t3 = space();
    			h6 = element("h6");
    			h6.textContent = "Billing Per Month";
    			t5 = space();
    			div0 = element("div");
    			t6 = space();
    			div1 = element("div");
    			p0 = element("p");
    			t7 = text("Bandwidth: ");
    			b0 = element("b");
    			t8 = text(t8_value);
    			t9 = space();
    			p1 = element("p");
    			t10 = text("Onlinespace: ");
    			b1 = element("b");
    			t11 = text(t11_value);
    			t12 = space();
    			p2 = element("p");
    			t13 = text("Support: ");
    			b2 = element("b");
    			t14 = text(t14_value);
    			t15 = space();
    			p3 = element("p");
    			b3 = element("b");
    			b3.textContent = "1";
    			t17 = text(" Domain");
    			t18 = space();
    			p4 = element("p");
    			b4 = element("b");
    			b4.textContent = "No";
    			t20 = text(" Hidden Fees");
    			t21 = space();
    			a = element("a");
    			a.textContent = "Join Now";
    			t23 = space();
    			attr_dev(h4, "class", "text-uppercase");
    			add_location(h4, file$h, 24, 12, 738);
    			add_location(h1, file$h, 25, 12, 795);
    			attr_dev(h6, "class", "text-uppercase text-muted");
    			add_location(h6, file$h, 26, 12, 829);
    			attr_dev(div0, "class", "pricing-border");
    			add_location(div0, file$h, 27, 12, 902);
    			attr_dev(b0, "class", "text-primary");
    			add_location(b0, file$h, 29, 28, 1006);
    			add_location(p0, file$h, 29, 14, 992);
    			attr_dev(b1, "class", "text-primary");
    			add_location(b1, file$h, 30, 30, 1085);
    			add_location(p1, file$h, 30, 14, 1069);
    			attr_dev(b2, "class", "text-primary");
    			add_location(b2, file$h, 31, 26, 1156);
    			add_location(p2, file$h, 31, 14, 1144);
    			attr_dev(b3, "class", "text-primary");
    			add_location(b3, file$h, 32, 17, 1220);
    			add_location(p3, file$h, 32, 14, 1217);
    			attr_dev(b4, "class", "text-primary");
    			add_location(b4, file$h, 33, 17, 1278);
    			add_location(p4, file$h, 33, 14, 1275);
    			attr_dev(div1, "class", "plan-features mt-4");
    			add_location(div1, file$h, 28, 12, 945);
    			attr_dev(a, "href", "#");
    			attr_dev(a, "class", "btn btn-primary waves-effect waves-light mt-4");
    			add_location(a, file$h, 35, 12, 1356);
    			attr_dev(div2, "class", "text-center pricing-box hover-effect");
    			add_location(div2, file$h, 23, 10, 675);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h4);
    			append_dev(h4, t0);
    			append_dev(div2, t1);
    			append_dev(div2, h1);
    			append_dev(h1, t2);
    			append_dev(div2, t3);
    			append_dev(div2, h6);
    			append_dev(div2, t5);
    			append_dev(div2, div0);
    			append_dev(div2, t6);
    			append_dev(div2, div1);
    			append_dev(div1, p0);
    			append_dev(p0, t7);
    			append_dev(p0, b0);
    			append_dev(b0, t8);
    			append_dev(div1, t9);
    			append_dev(div1, p1);
    			append_dev(p1, t10);
    			append_dev(p1, b1);
    			append_dev(b1, t11);
    			append_dev(div1, t12);
    			append_dev(div1, p2);
    			append_dev(p2, t13);
    			append_dev(p2, b2);
    			append_dev(b2, t14);
    			append_dev(div1, t15);
    			append_dev(div1, p3);
    			append_dev(p3, b3);
    			append_dev(p3, t17);
    			append_dev(div1, t18);
    			append_dev(div1, p4);
    			append_dev(p4, b4);
    			append_dev(p4, t20);
    			append_dev(div2, t21);
    			append_dev(div2, a);
    			insert_dev(target, t23, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t23);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$8.name,
    		type: "slot",
    		source: "(23:8) <Col lg=\\\"4\\\">",
    		ctx
    	});

    	return block;
    }

    // (22:6) {#each pricing_list as list}
    function create_each_block$3(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: "4",
    				$$slots: { default: [create_default_slot_2$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(22:6) {#each pricing_list as list}",
    		ctx
    	});

    	return block;
    }

    // (21:4) <Row class="mt-5">
    function create_default_slot_1$c(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*pricing_list*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*pricing_list*/ 4) {
    				each_value = /*pricing_list*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
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
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$c.name,
    		type: "slot",
    		source: "(21:4) <Row class=\\\"mt-5\\\">",
    		ctx
    	});

    	return block;
    }

    // (11:2) <Container>
    function create_default_slot$c(ctx) {
    	let row0;
    	let t;
    	let row1;
    	let current;

    	row0 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_3$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	row1 = new Row({
    			props: {
    				class: "mt-5",
    				$$slots: { default: [create_default_slot_1$c] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row0.$$.fragment);
    			t = space();
    			create_component(row1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(row1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row0_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				row0_changes.$$scope = { dirty, ctx };
    			}

    			row0.$set(row0_changes);
    			const row1_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				row1_changes.$$scope = { dirty, ctx };
    			}

    			row1.$set(row1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row0.$$.fragment, local);
    			transition_in(row1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row0.$$.fragment, local);
    			transition_out(row1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(row1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$c.name,
    		type: "slot",
    		source: "(11:2) <Container>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let section;
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$c] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(container.$$.fragment);
    			attr_dev(section, "class", "section pt-5 common-section");
    			attr_dev(section, "id", "pricing");
    			add_location(section, file$h, 9, 0, 213);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(container, section, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(container);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Pricing', slots, []);
    	let { pricingData = {} } = $$props;
    	const { title, description, pricing_list } = pricingData;
    	const writable_props = ['pricingData'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Pricing> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('pricingData' in $$props) $$invalidate(3, pricingData = $$props.pricingData);
    	};

    	$$self.$capture_state = () => ({
    		Col,
    		Row,
    		Container,
    		pricingData,
    		title,
    		description,
    		pricing_list
    	});

    	$$self.$inject_state = $$props => {
    		if ('pricingData' in $$props) $$invalidate(3, pricingData = $$props.pricingData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, description, pricing_list, pricingData];
    }

    class Pricing extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { pricingData: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pricing",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get pricingData() {
    		throw new Error("<Pricing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pricingData(value) {
    		throw new Error("<Pricing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\Team.svelte generated by Svelte v3.44.0 */
    const file$g = "src\\Components\\Team.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (13:6) <Col lg={{ size: 8, offset: 2 }}>
    function create_default_slot_14$1(ctx) {
    	let h1;
    	let t1;
    	let div;
    	let t2;
    	let p;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = `${/*title*/ ctx[0]}`;
    			t1 = space();
    			div = element("div");
    			t2 = space();
    			p = element("p");
    			p.textContent = `${/*description*/ ctx[1]}`;
    			attr_dev(h1, "class", "section-title text-center");
    			add_location(h1, file$g, 13, 8, 326);
    			attr_dev(div, "class", "section-title-border mt-3");
    			add_location(div, file$g, 14, 8, 385);
    			attr_dev(p, "class", "section-subtitle text-muted text-center font-secondary pt-4");
    			add_location(p, file$g, 15, 8, 435);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14$1.name,
    		type: "slot",
    		source: "(13:6) <Col lg={{ size: 8, offset: 2 }}>",
    		ctx
    	});

    	return block;
    }

    // (12:4) <Row>
    function create_default_slot_13$1(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: { size: 8, offset: 2 },
    				$$slots: { default: [create_default_slot_14$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13$1.name,
    		type: "slot",
    		source: "(12:4) <Row>",
    		ctx
    	});

    	return block;
    }

    // (23:8) <Col lg="3" sm="6">
    function create_default_slot_12$1(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let h4;
    	let t1_value = /*list*/ ctx[4].name + "";
    	let t1;
    	let t2;
    	let p;
    	let t3_value = /*list*/ ctx[4].designation + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			h4 = element("h4");
    			t1 = text(t1_value);
    			t2 = space();
    			p = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			attr_dev(img, "alt", "");
    			if (!src_url_equal(img.src, img_src_value = /*list*/ ctx[4].profile)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "img-fluid rounded");
    			add_location(img, file$g, 26, 16, 804);
    			attr_dev(div0, "class", "team-member");
    			add_location(div0, file$g, 25, 14, 762);
    			attr_dev(div1, "class", "team-wrapper");
    			add_location(div1, file$g, 24, 12, 721);
    			attr_dev(h4, "class", "team-name");
    			add_location(h4, file$g, 29, 12, 916);
    			attr_dev(p, "class", "text-uppercase team-designation");
    			add_location(p, file$g, 30, 12, 967);
    			attr_dev(div2, "class", "team-box text-center hover-effect");
    			add_location(div2, file$g, 23, 10, 661);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div2, t0);
    			append_dev(div2, h4);
    			append_dev(h4, t1);
    			append_dev(div2, t2);
    			append_dev(div2, p);
    			append_dev(p, t3);
    			insert_dev(target, t4, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12$1.name,
    		type: "slot",
    		source: "(23:8) <Col lg=\\\"3\\\" sm=\\\"6\\\">",
    		ctx
    	});

    	return block;
    }

    // (22:6) {#each team_list as list}
    function create_each_block$2(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: "3",
    				sm: "6",
    				$$slots: { default: [create_default_slot_12$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(22:6) {#each team_list as list}",
    		ctx
    	});

    	return block;
    }

    // (21:4) <Row class="mt-5">
    function create_default_slot_11$2(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*team_list*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*team_list*/ 4) {
    				each_value = /*team_list*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
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
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11$2.name,
    		type: "slot",
    		source: "(21:4) <Row class=\\\"mt-5\\\">",
    		ctx
    	});

    	return block;
    }

    // (11:2) <Container>
    function create_default_slot_10$2(ctx) {
    	let row0;
    	let t;
    	let row1;
    	let current;

    	row0 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_13$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	row1 = new Row({
    			props: {
    				class: "mt-5",
    				$$slots: { default: [create_default_slot_11$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row0.$$.fragment);
    			t = space();
    			create_component(row1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(row1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row0_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				row0_changes.$$scope = { dirty, ctx };
    			}

    			row0.$set(row0_changes);
    			const row1_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				row1_changes.$$scope = { dirty, ctx };
    			}

    			row1.$set(row1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row0.$$.fragment, local);
    			transition_in(row1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row0.$$.fragment, local);
    			transition_out(row1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(row1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$2.name,
    		type: "slot",
    		source: "(11:2) <Container>",
    		ctx
    	});

    	return block;
    }

    // (44:6) <Col lg={{ size: 8, offset: 2 }}>
    function create_default_slot_9$2(ctx) {
    	let h1;
    	let t1;
    	let div;
    	let t2;
    	let p;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Work Process";
    			t1 = space();
    			div = element("div");
    			t2 = space();
    			p = element("p");
    			p.textContent = "In an ideal world this website wouldn’t exist, a client would\n          acknowledge the importance of having web copy before the Proin vitae\n          ipsum vel ex finibus semper design starts.";
    			attr_dev(h1, "class", "section-title text-center");
    			add_location(h1, file$g, 44, 8, 1261);
    			attr_dev(div, "class", "section-title-border mt-3");
    			add_location(div, file$g, 45, 8, 1325);
    			attr_dev(p, "class", "section-subtitle text-muted text-center font-secondary pt-4");
    			add_location(p, file$g, 46, 8, 1375);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$2.name,
    		type: "slot",
    		source: "(44:6) <Col lg={{ size: 8, offset: 2 }}>",
    		ctx
    	});

    	return block;
    }

    // (43:4) <Row>
    function create_default_slot_8$3(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: { size: 8, offset: 2 },
    				$$slots: { default: [create_default_slot_9$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$3.name,
    		type: "slot",
    		source: "(43:4) <Row>",
    		ctx
    	});

    	return block;
    }

    // (55:6) <Col lg="6" class="text-center process-left-icon-1">
    function create_default_slot_7$4(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "pe-7s-angle-right");
    			add_location(i, file$g, 55, 8, 1765);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$4.name,
    		type: "slot",
    		source: "(55:6) <Col lg=\\\"6\\\" class=\\\"text-center process-left-icon-1\\\">",
    		ctx
    	});

    	return block;
    }

    // (58:6) <Col lg="6" class="text-center process-left-icon-2">
    function create_default_slot_6$4(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "pe-7s-angle-right");
    			add_location(i, file$g, 58, 8, 1877);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$4.name,
    		type: "slot",
    		source: "(58:6) <Col lg=\\\"6\\\" class=\\\"text-center process-left-icon-2\\\">",
    		ctx
    	});

    	return block;
    }

    // (54:4) <Row>
    function create_default_slot_5$4(ctx) {
    	let col0;
    	let t;
    	let col1;
    	let current;

    	col0 = new Col({
    			props: {
    				lg: "6",
    				class: "text-center process-left-icon-1",
    				$$slots: { default: [create_default_slot_7$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col1 = new Col({
    			props: {
    				lg: "6",
    				class: "text-center process-left-icon-2",
    				$$slots: { default: [create_default_slot_6$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t = space();
    			create_component(col1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(col1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(col1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$4.name,
    		type: "slot",
    		source: "(54:4) <Row>",
    		ctx
    	});

    	return block;
    }

    // (63:6) <Col lg="4" class="plan-line">
    function create_default_slot_4$5(ctx) {
    	let div;
    	let i;
    	let t0;
    	let h4;
    	let t2;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			t0 = space();
    			h4 = element("h4");
    			h4.textContent = "Tell us what you need";
    			t2 = space();
    			p = element("p");
    			p.textContent = "The Big Oxmox advised her not to do so.";
    			attr_dev(i, "class", "pe-7s-pen text-primary");
    			add_location(i, file$g, 64, 10, 2049);
    			attr_dev(h4, "class", "pt-3");
    			add_location(h4, file$g, 65, 10, 2096);
    			attr_dev(p, "class", "text-muted");
    			add_location(p, file$g, 66, 10, 2150);
    			attr_dev(div, "class", "text-center process-box");
    			add_location(div, file$g, 63, 8, 2001);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    			append_dev(div, t0);
    			append_dev(div, h4);
    			append_dev(div, t2);
    			append_dev(div, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$5.name,
    		type: "slot",
    		source: "(63:6) <Col lg=\\\"4\\\" class=\\\"plan-line\\\">",
    		ctx
    	});

    	return block;
    }

    // (70:6) <Col lg="4" class="plan-line">
    function create_default_slot_3$5(ctx) {
    	let div;
    	let i;
    	let t0;
    	let h4;
    	let t2;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			t0 = space();
    			h4 = element("h4");
    			h4.textContent = "Get free quotes";
    			t2 = space();
    			p = element("p");
    			p.textContent = "Little Blind Text didn’t listen.";
    			attr_dev(i, "class", "pe-7s-id text-primary");
    			add_location(i, file$g, 71, 10, 2337);
    			attr_dev(h4, "class", "pt-3");
    			add_location(h4, file$g, 72, 10, 2383);
    			attr_dev(p, "class", "text-muted");
    			add_location(p, file$g, 73, 10, 2431);
    			attr_dev(div, "class", "text-center process-box");
    			add_location(div, file$g, 70, 8, 2289);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    			append_dev(div, t0);
    			append_dev(div, h4);
    			append_dev(div, t2);
    			append_dev(div, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$5.name,
    		type: "slot",
    		source: "(70:6) <Col lg=\\\"4\\\" class=\\\"plan-line\\\">",
    		ctx
    	});

    	return block;
    }

    // (77:6) <Col lg="4">
    function create_default_slot_2$7(ctx) {
    	let div;
    	let i;
    	let t0;
    	let h4;
    	let t2;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			t0 = space();
    			h4 = element("h4");
    			h4.textContent = "Deliver high quality product";
    			t2 = space();
    			p = element("p");
    			p.textContent = "When she reached the first hills.";
    			attr_dev(i, "class", "pe-7s-target text-primary");
    			add_location(i, file$g, 78, 10, 2593);
    			attr_dev(h4, "class", "pt-3");
    			add_location(h4, file$g, 79, 10, 2643);
    			attr_dev(p, "class", "text-muted");
    			add_location(p, file$g, 80, 10, 2704);
    			attr_dev(div, "class", "text-center process-box");
    			add_location(div, file$g, 77, 8, 2545);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    			append_dev(div, t0);
    			append_dev(div, h4);
    			append_dev(div, t2);
    			append_dev(div, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$7.name,
    		type: "slot",
    		source: "(77:6) <Col lg=\\\"4\\\">",
    		ctx
    	});

    	return block;
    }

    // (62:4) <Row class="mt-5">
    function create_default_slot_1$b(ctx) {
    	let col0;
    	let t0;
    	let col1;
    	let t1;
    	let col2;
    	let t2;
    	let div;
    	let a;
    	let t3;
    	let i;
    	let current;

    	col0 = new Col({
    			props: {
    				lg: "4",
    				class: "plan-line",
    				$$slots: { default: [create_default_slot_4$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col1 = new Col({
    			props: {
    				lg: "4",
    				class: "plan-line",
    				$$slots: { default: [create_default_slot_3$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col2 = new Col({
    			props: {
    				lg: "4",
    				$$slots: { default: [create_default_slot_2$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t0 = space();
    			create_component(col1.$$.fragment);
    			t1 = space();
    			create_component(col2.$$.fragment);
    			t2 = space();
    			div = element("div");
    			a = element("a");
    			t3 = text("Get Started ");
    			i = element("i");
    			attr_dev(i, "class", "mdi mdi-arrow-right");
    			add_location(i, file$g, 85, 23, 2931);
    			attr_dev(a, "href", "#");
    			attr_dev(a, "class", "btn btn-primary waves-light waves-effect mt-5");
    			add_location(a, file$g, 84, 8, 2840);
    			attr_dev(div, "class", "text-center mx-auto");
    			add_location(div, file$g, 83, 6, 2798);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(col1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(col2, target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, t3);
    			append_dev(a, i);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    			const col2_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col2_changes.$$scope = { dirty, ctx };
    			}

    			col2.$set(col2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			transition_in(col2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			transition_out(col2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(col1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(col2, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$b.name,
    		type: "slot",
    		source: "(62:4) <Row class=\\\"mt-5\\\">",
    		ctx
    	});

    	return block;
    }

    // (42:2) <Container>
    function create_default_slot$b(ctx) {
    	let row0;
    	let t0;
    	let row1;
    	let t1;
    	let row2;
    	let current;

    	row0 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_8$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	row1 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_5$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	row2 = new Row({
    			props: {
    				class: "mt-5",
    				$$slots: { default: [create_default_slot_1$b] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row0.$$.fragment);
    			t0 = space();
    			create_component(row1.$$.fragment);
    			t1 = space();
    			create_component(row2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(row1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(row2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row0_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				row0_changes.$$scope = { dirty, ctx };
    			}

    			row0.$set(row0_changes);
    			const row1_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				row1_changes.$$scope = { dirty, ctx };
    			}

    			row1.$set(row1_changes);
    			const row2_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				row2_changes.$$scope = { dirty, ctx };
    			}

    			row2.$set(row2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row0.$$.fragment, local);
    			transition_in(row1.$$.fragment, local);
    			transition_in(row2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row0.$$.fragment, local);
    			transition_out(row1.$$.fragment, local);
    			transition_out(row2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(row1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(row2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$b.name,
    		type: "slot",
    		source: "(42:2) <Container>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let section0;
    	let container0;
    	let t;
    	let section1;
    	let container1;
    	let current;

    	container0 = new Container({
    			props: {
    				$$slots: { default: [create_default_slot_10$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	container1 = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$b] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section0 = element("section");
    			create_component(container0.$$.fragment);
    			t = space();
    			section1 = element("section");
    			create_component(container1.$$.fragment);
    			attr_dev(section0, "class", "section pt-4 common-section");
    			attr_dev(section0, "id", "team");
    			add_location(section0, file$g, 9, 0, 198);
    			attr_dev(section1, "class", "section bg-light");
    			add_location(section1, file$g, 40, 0, 1154);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section0, anchor);
    			mount_component(container0, section0, null);
    			insert_dev(target, t, anchor);
    			insert_dev(target, section1, anchor);
    			mount_component(container1, section1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const container0_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				container0_changes.$$scope = { dirty, ctx };
    			}

    			container0.$set(container0_changes);
    			const container1_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				container1_changes.$$scope = { dirty, ctx };
    			}

    			container1.$set(container1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container0.$$.fragment, local);
    			transition_in(container1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container0.$$.fragment, local);
    			transition_out(container1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section0);
    			destroy_component(container0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(section1);
    			destroy_component(container1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Team', slots, []);
    	let { teamData = {} } = $$props;
    	const { title, description, team_list } = teamData;
    	const writable_props = ['teamData'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Team> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('teamData' in $$props) $$invalidate(3, teamData = $$props.teamData);
    	};

    	$$self.$capture_state = () => ({
    		Col,
    		Row,
    		Container,
    		teamData,
    		title,
    		description,
    		team_list
    	});

    	$$self.$inject_state = $$props => {
    		if ('teamData' in $$props) $$invalidate(3, teamData = $$props.teamData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, description, team_list, teamData];
    }

    class Team extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { teamData: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Team",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get teamData() {
    		throw new Error("<Team>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set teamData(value) {
    		throw new Error("<Team>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\Testimonial.svelte generated by Svelte v3.44.0 */
    const file$f = "src\\Components\\Testimonial.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (13:6) <Col lg={{size:8, offset: 2}}>
    function create_default_slot_7$3(ctx) {
    	let h1;
    	let t1;
    	let div;
    	let t2;
    	let p;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = `${/*title*/ ctx[0]}`;
    			t1 = space();
    			div = element("div");
    			t2 = space();
    			p = element("p");
    			p.textContent = `${/*description*/ ctx[1]}`;
    			attr_dev(h1, "class", "section-title text-center");
    			add_location(h1, file$f, 13, 8, 339);
    			attr_dev(div, "class", "section-title-border mt-3");
    			add_location(div, file$f, 14, 8, 398);
    			attr_dev(p, "class", "section-subtitle text-muted text-center font-secondary pt-4");
    			add_location(p, file$f, 15, 8, 448);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$3.name,
    		type: "slot",
    		source: "(13:6) <Col lg={{size:8, offset: 2}}>",
    		ctx
    	});

    	return block;
    }

    // (12:4) <Row>
    function create_default_slot_6$3(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: { size: 8, offset: 2 },
    				$$slots: { default: [create_default_slot_7$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$3.name,
    		type: "slot",
    		source: "(12:4) <Row>",
    		ctx
    	});

    	return block;
    }

    // (23:8) <Col lg="4">
    function create_default_slot_5$3(ctx) {
    	let div1;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let p;
    	let t1;
    	let t2_value = /*list*/ ctx[4].description + "";
    	let t2;
    	let t3;
    	let t4;
    	let h5;
    	let t5_value = /*list*/ ctx[4].name + "";
    	let t5;
    	let span;
    	let t6_value = /*list*/ ctx[4].text + "";
    	let t6;
    	let t7;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			p = element("p");
    			t1 = text("“");
    			t2 = text(t2_value);
    			t3 = text("”");
    			t4 = space();
    			h5 = element("h5");
    			t5 = text(t5_value);
    			span = element("span");
    			t6 = text(t6_value);
    			t7 = space();
    			if (!src_url_equal(img.src, img_src_value = /*list*/ ctx[4].profile)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "img-fluid d-block img-thumbnail rounded-circle");
    			add_location(img, file$f, 24, 12, 734);
    			attr_dev(p, "class", "text-muted text-center mb-0");
    			add_location(p, file$f, 30, 14, 934);
    			attr_dev(div0, "class", "testimonial-decs");
    			add_location(div0, file$f, 29, 12, 889);
    			attr_dev(span, "class", "text-muted text-capitalize");
    			add_location(span, file$f, 33, 25, 1099);
    			attr_dev(h5, "class", "text-center text-uppercase pt-3");
    			add_location(h5, file$f, 32, 12, 1029);
    			attr_dev(div1, "class", "testimonial-box hover-effect mt-4");
    			add_location(div1, file$f, 23, 10, 674);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, p);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(div1, t4);
    			append_dev(div1, h5);
    			append_dev(h5, t5);
    			append_dev(h5, span);
    			append_dev(span, t6);
    			insert_dev(target, t7, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t7);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$3.name,
    		type: "slot",
    		source: "(23:8) <Col lg=\\\"4\\\">",
    		ctx
    	});

    	return block;
    }

    // (22:6) {#each testimonial_list as list}
    function create_each_block$1(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: "4",
    				$$slots: { default: [create_default_slot_5$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(22:6) {#each testimonial_list as list}",
    		ctx
    	});

    	return block;
    }

    // (21:4) <Row class="mt-5">
    function create_default_slot_4$4(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*testimonial_list*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*testimonial_list*/ 4) {
    				each_value = /*testimonial_list*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
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
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$4.name,
    		type: "slot",
    		source: "(21:4) <Row class=\\\"mt-5\\\">",
    		ctx
    	});

    	return block;
    }

    // (11:2) <Container>
    function create_default_slot_3$4(ctx) {
    	let row0;
    	let t;
    	let row1;
    	let current;

    	row0 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_6$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	row1 = new Row({
    			props: {
    				class: "mt-5",
    				$$slots: { default: [create_default_slot_4$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row0.$$.fragment);
    			t = space();
    			create_component(row1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(row1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row0_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				row0_changes.$$scope = { dirty, ctx };
    			}

    			row0.$set(row0_changes);
    			const row1_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				row1_changes.$$scope = { dirty, ctx };
    			}

    			row1.$set(row1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row0.$$.fragment, local);
    			transition_in(row1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row0.$$.fragment, local);
    			transition_out(row1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(row1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$4.name,
    		type: "slot",
    		source: "(11:2) <Container>",
    		ctx
    	});

    	return block;
    }

    // (51:6) <Col lg={{size:8, offset: 2}} class="text-center">
    function create_default_slot_2$6(ctx) {
    	let h1;
    	let t1;
    	let div;
    	let t2;
    	let p;
    	let t4;
    	let a;
    	let t5;
    	let i;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Let's Get Started";
    			t1 = space();
    			div = element("div");
    			t2 = space();
    			p = element("p");
    			p.textContent = "Far far away, behind the word mountains, far from the countries\n          Vokalia and Consonantia, there live the blind texts.";
    			t4 = space();
    			a = element("a");
    			t5 = text("Get Started ");
    			i = element("i");
    			attr_dev(h1, "class", "get-started-title text-white");
    			add_location(h1, file$f, 51, 8, 1509);
    			attr_dev(div, "class", "section-title-border mt-4 bg-white");
    			add_location(div, file$f, 52, 8, 1581);
    			attr_dev(p, "class", "section-subtitle font-secondary text-white text-center pt-4");
    			add_location(p, file$f, 53, 8, 1640);
    			attr_dev(i, "class", "mdi mdi-arrow-right");
    			add_location(i, file$f, 58, 23, 1954);
    			attr_dev(a, "href", '#');
    			attr_dev(a, "class", "btn btn-white waves-effect mt-3 mb-4");
    			add_location(a, file$f, 57, 8, 1870);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, a, anchor);
    			append_dev(a, t5);
    			append_dev(a, i);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$6.name,
    		type: "slot",
    		source: "(51:6) <Col lg={{size:8, offset: 2}} class=\\\"text-center\\\">",
    		ctx
    	});

    	return block;
    }

    // (50:4) <Row>
    function create_default_slot_1$a(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: { size: 8, offset: 2 },
    				class: "text-center",
    				$$slots: { default: [create_default_slot_2$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$a.name,
    		type: "slot",
    		source: "(50:4) <Row>",
    		ctx
    	});

    	return block;
    }

    // (49:2) <Container>
    function create_default_slot$a(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_1$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(49:2) <Container>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let section0;
    	let container0;
    	let t0;
    	let section1;
    	let div0;
    	let t1;
    	let container1;
    	let t2;
    	let div1;
    	let img;
    	let img_src_value;
    	let current;

    	container0 = new Container({
    			props: {
    				$$slots: { default: [create_default_slot_3$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	container1 = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section0 = element("section");
    			create_component(container0.$$.fragment);
    			t0 = space();
    			section1 = element("section");
    			div0 = element("div");
    			t1 = space();
    			create_component(container1.$$.fragment);
    			t2 = space();
    			div1 = element("div");
    			img = element("img");
    			attr_dev(section0, "class", "section");
    			attr_dev(section0, "id", "testi");
    			add_location(section0, file$f, 9, 0, 233);
    			attr_dev(div0, "class", "bg-overlay");
    			add_location(div0, file$f, 47, 2, 1393);
    			if (!src_url_equal(img.src, img_src_value = "images/bg-pattern-light.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$f, 64, 4, 2078);
    			attr_dev(div1, "class", "bg-pattern-effect");
    			add_location(div1, file$f, 63, 2, 2042);
    			attr_dev(section1, "class", "section section-lg bg-get-start");
    			add_location(section1, file$f, 46, 0, 1341);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section0, anchor);
    			mount_component(container0, section0, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, section1, anchor);
    			append_dev(section1, div0);
    			append_dev(section1, t1);
    			mount_component(container1, section1, null);
    			append_dev(section1, t2);
    			append_dev(section1, div1);
    			append_dev(div1, img);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const container0_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				container0_changes.$$scope = { dirty, ctx };
    			}

    			container0.$set(container0_changes);
    			const container1_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				container1_changes.$$scope = { dirty, ctx };
    			}

    			container1.$set(container1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container0.$$.fragment, local);
    			transition_in(container1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container0.$$.fragment, local);
    			transition_out(container1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section0);
    			destroy_component(container0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(section1);
    			destroy_component(container1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Testimonial', slots, []);
    	let { testimonialData = {} } = $$props;
    	const { title, description, testimonial_list } = testimonialData;
    	const writable_props = ['testimonialData'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Testimonial> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('testimonialData' in $$props) $$invalidate(3, testimonialData = $$props.testimonialData);
    	};

    	$$self.$capture_state = () => ({
    		Col,
    		Row,
    		Container,
    		testimonialData,
    		title,
    		description,
    		testimonial_list
    	});

    	$$self.$inject_state = $$props => {
    		if ('testimonialData' in $$props) $$invalidate(3, testimonialData = $$props.testimonialData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, description, testimonial_list, testimonialData];
    }

    class Testimonial extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { testimonialData: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Testimonial",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get testimonialData() {
    		throw new Error("<Testimonial>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set testimonialData(value) {
    		throw new Error("<Testimonial>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\Blog.svelte generated by Svelte v3.44.0 */
    const file$e = "src\\Components\\Blog.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (13:6) <Col lg={{ size: 8, offset: 2 }}>
    function create_default_slot_4$3(ctx) {
    	let h1;
    	let t1;
    	let div;
    	let t2;
    	let p;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = `${/*title*/ ctx[0]}`;
    			t1 = space();
    			div = element("div");
    			t2 = space();
    			p = element("p");
    			p.textContent = `${/*description*/ ctx[1]}`;
    			attr_dev(h1, "class", "section-title text-center");
    			add_location(h1, file$e, 13, 8, 337);
    			attr_dev(div, "class", "section-title-border mt-3");
    			add_location(div, file$e, 14, 8, 396);
    			attr_dev(p, "class", "section-subtitle text-muted text-center font-secondary pt-4");
    			add_location(p, file$e, 15, 8, 446);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$3.name,
    		type: "slot",
    		source: "(13:6) <Col lg={{ size: 8, offset: 2 }}>",
    		ctx
    	});

    	return block;
    }

    // (12:4) <Row>
    function create_default_slot_3$3(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: { size: 8, offset: 2 },
    				$$slots: { default: [create_default_slot_4$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$3.name,
    		type: "slot",
    		source: "(12:4) <Row>",
    		ctx
    	});

    	return block;
    }

    // (24:8) <Col lg="4">
    function create_default_slot_2$5(ctx) {
    	let div2;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let h5;
    	let t1_value = /*list*/ ctx[4].text + "";
    	let t1;
    	let t2;
    	let h4;
    	let a0;
    	let t3_value = /*list*/ ctx[4].title + "";
    	let t3;
    	let t4;
    	let p;
    	let t5_value = /*list*/ ctx[4].subtext + "";
    	let t5;
    	let t6;
    	let div0;
    	let a1;
    	let t7;
    	let i;
    	let t8;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			h5 = element("h5");
    			t1 = text(t1_value);
    			t2 = space();
    			h4 = element("h4");
    			a0 = element("a");
    			t3 = text(t3_value);
    			t4 = space();
    			p = element("p");
    			t5 = text(t5_value);
    			t6 = space();
    			div0 = element("div");
    			a1 = element("a");
    			t7 = text("Read More ");
    			i = element("i");
    			t8 = space();
    			if (!src_url_equal(img.src, img_src_value = /*list*/ ctx[4].image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "img-fluid");
    			attr_dev(img, "alt", "");
    			add_location(img, file$e, 25, 12, 719);
    			attr_dev(h5, "class", "mt-4 text-muted");
    			add_location(h5, file$e, 27, 14, 801);
    			attr_dev(a0, "href", "#");
    			attr_dev(a0, "class", "blog-title");
    			add_location(a0, file$e, 29, 16, 894);
    			attr_dev(h4, "class", "mt-3");
    			add_location(h4, file$e, 28, 14, 860);
    			attr_dev(p, "class", "text-muted");
    			add_location(p, file$e, 31, 14, 980);
    			attr_dev(i, "class", "mdi mdi-arrow-right");
    			add_location(i, file$e, 34, 29, 1130);
    			attr_dev(a1, "href", "#");
    			attr_dev(a1, "class", "read-btn");
    			add_location(a1, file$e, 33, 16, 1070);
    			attr_dev(div0, "class", "mt-3");
    			add_location(div0, file$e, 32, 14, 1035);
    			add_location(div1, file$e, 26, 12, 781);
    			attr_dev(div2, "class", "blog-box mt-4 hover-effect");
    			add_location(div2, file$e, 24, 10, 666);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, h5);
    			append_dev(h5, t1);
    			append_dev(div1, t2);
    			append_dev(div1, h4);
    			append_dev(h4, a0);
    			append_dev(a0, t3);
    			append_dev(div1, t4);
    			append_dev(div1, p);
    			append_dev(p, t5);
    			append_dev(div1, t6);
    			append_dev(div1, div0);
    			append_dev(div0, a1);
    			append_dev(a1, t7);
    			append_dev(a1, i);
    			insert_dev(target, t8, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t8);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$5.name,
    		type: "slot",
    		source: "(24:8) <Col lg=\\\"4\\\">",
    		ctx
    	});

    	return block;
    }

    // (23:6) {#each blog_list as list}
    function create_each_block(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: "4",
    				$$slots: { default: [create_default_slot_2$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(23:6) {#each blog_list as list}",
    		ctx
    	});

    	return block;
    }

    // (22:4) <Row class="mt-4">
    function create_default_slot_1$9(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*blog_list*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*blog_list*/ 4) {
    				each_value = /*blog_list*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
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
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$9.name,
    		type: "slot",
    		source: "(22:4) <Row class=\\\"mt-4\\\">",
    		ctx
    	});

    	return block;
    }

    // (11:2) <Container>
    function create_default_slot$9(ctx) {
    	let row0;
    	let t;
    	let row1;
    	let current;

    	row0 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_3$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	row1 = new Row({
    			props: {
    				class: "mt-4",
    				$$slots: { default: [create_default_slot_1$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row0.$$.fragment);
    			t = space();
    			create_component(row1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(row1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row0_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				row0_changes.$$scope = { dirty, ctx };
    			}

    			row0.$set(row0_changes);
    			const row1_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				row1_changes.$$scope = { dirty, ctx };
    			}

    			row1.$set(row1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row0.$$.fragment, local);
    			transition_in(row1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row0.$$.fragment, local);
    			transition_out(row1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(row1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(11:2) <Container>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let section;
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(container.$$.fragment);
    			attr_dev(section, "class", "section bg-light pt-5 common-section");
    			attr_dev(section, "id", "blog");
    			add_location(section, file$e, 9, 0, 200);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(container, section, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(container);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Blog', slots, []);
    	let { blogData = {} } = $$props;
    	const { title, description, blog_list } = blogData;
    	const writable_props = ['blogData'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Blog> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('blogData' in $$props) $$invalidate(3, blogData = $$props.blogData);
    	};

    	$$self.$capture_state = () => ({
    		Col,
    		Row,
    		Container,
    		blogData,
    		title,
    		description,
    		blog_list
    	});

    	$$self.$inject_state = $$props => {
    		if ('blogData' in $$props) $$invalidate(3, blogData = $$props.blogData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, description, blog_list, blogData];
    }

    class Blog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { blogData: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Blog",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get blogData() {
    		throw new Error("<Blog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set blogData(value) {
    		throw new Error("<Blog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\Contact.svelte generated by Svelte v3.44.0 */
    const file$d = "src\\Components\\Contact.svelte";

    // (10:6) <Col lg={{ size: 8, offset: 2 }}>
    function create_default_slot_23(ctx) {
    	let h1;
    	let t1;
    	let div;
    	let t2;
    	let p;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Get In Touch";
    			t1 = space();
    			div = element("div");
    			t2 = space();
    			p = element("p");
    			p.textContent = "We thrive when coming up with innovative ideas but also understand\n          that a smart concept should be supported with faucibus sapien odio\n          measurable results.";
    			attr_dev(h1, "class", "section-title text-center");
    			add_location(h1, file$d, 10, 8, 271);
    			attr_dev(div, "class", "section-title-border mt-3");
    			add_location(div, file$d, 11, 8, 335);
    			attr_dev(p, "class", "section-subtitle text-muted text-center font-secondary pt-4");
    			add_location(p, file$d, 12, 8, 385);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_23.name,
    		type: "slot",
    		source: "(10:6) <Col lg={{ size: 8, offset: 2 }}>",
    		ctx
    	});

    	return block;
    }

    // (9:4) <Row>
    function create_default_slot_22(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: { size: 8, offset: 2 },
    				$$slots: { default: [create_default_slot_23] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_22.name,
    		type: "slot",
    		source: "(9:4) <Row>",
    		ctx
    	});

    	return block;
    }

    // (21:6) <Col lg="4">
    function create_default_slot_21(ctx) {
    	let div;
    	let p0;
    	let span0;
    	let br0;
    	let t1;
    	let span1;
    	let t3;
    	let p1;
    	let span2;
    	let br1;
    	let t5;
    	let span3;
    	let t6;
    	let br2;
    	let t7;
    	let t8;
    	let p2;
    	let span4;
    	let br3;
    	let t10;
    	let span5;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			span0 = element("span");
    			span0.textContent = "Office Address 1:";
    			br0 = element("br");
    			t1 = space();
    			span1 = element("span");
    			span1.textContent = "4461 Cedar Street Moro, AR 72368";
    			t3 = space();
    			p1 = element("p");
    			span2 = element("span");
    			span2.textContent = "Office Address 2:";
    			br1 = element("br");
    			t5 = space();
    			span3 = element("span");
    			t6 = text("2467 Swick Hill Street ");
    			br2 = element("br");
    			t7 = text("New Orleans, LA 70171");
    			t8 = space();
    			p2 = element("p");
    			span4 = element("span");
    			span4.textContent = "Working Hours:";
    			br3 = element("br");
    			t10 = space();
    			span5 = element("span");
    			span5.textContent = "9:00AM To 6:00PM";
    			attr_dev(span0, "class", "h5");
    			add_location(span0, file$d, 23, 12, 778);
    			add_location(br0, file$d, 23, 53, 819);
    			attr_dev(span1, "class", "text-muted d-block mt-2");
    			add_location(span1, file$d, 24, 12, 838);
    			attr_dev(p0, "class", "mt-4");
    			add_location(p0, file$d, 22, 10, 749);
    			attr_dev(span2, "class", "h5");
    			add_location(span2, file$d, 29, 12, 998);
    			add_location(br1, file$d, 29, 53, 1039);
    			add_location(br2, file$d, 31, 38, 1134);
    			attr_dev(span3, "class", "text-muted d-block mt-2");
    			add_location(span3, file$d, 30, 12, 1058);
    			attr_dev(p1, "class", "mt-4");
    			add_location(p1, file$d, 28, 10, 969);
    			attr_dev(span4, "class", "h5");
    			add_location(span4, file$d, 35, 12, 1236);
    			add_location(br3, file$d, 35, 50, 1274);
    			attr_dev(span5, "class", "text-muted d-block mt-2");
    			add_location(span5, file$d, 36, 12, 1293);
    			attr_dev(p2, "class", "mt-4");
    			add_location(p2, file$d, 34, 10, 1207);
    			attr_dev(div, "class", "mt-4 pt-4");
    			add_location(div, file$d, 21, 8, 715);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(p0, span0);
    			append_dev(p0, br0);
    			append_dev(p0, t1);
    			append_dev(p0, span1);
    			append_dev(div, t3);
    			append_dev(div, p1);
    			append_dev(p1, span2);
    			append_dev(p1, br1);
    			append_dev(p1, t5);
    			append_dev(p1, span3);
    			append_dev(span3, t6);
    			append_dev(span3, br2);
    			append_dev(span3, t7);
    			append_dev(div, t8);
    			append_dev(div, p2);
    			append_dev(p2, span4);
    			append_dev(p2, br3);
    			append_dev(p2, t10);
    			append_dev(p2, span5);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_21.name,
    		type: "slot",
    		source: "(21:6) <Col lg=\\\"4\\\">",
    		ctx
    	});

    	return block;
    }

    // (48:16) <FormGroup class="mt-2">
    function create_default_slot_20(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				name: "name",
    				id: "name",
    				type: "text",
    				class: "form-control",
    				placeholder: "Your name*"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(input.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(input, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_20.name,
    		type: "slot",
    		source: "(48:16) <FormGroup class=\\\"mt-2\\\">",
    		ctx
    	});

    	return block;
    }

    // (47:14) <Col lg="6">
    function create_default_slot_19(ctx) {
    	let formgroup;
    	let current;

    	formgroup = new FormGroup({
    			props: {
    				class: "mt-2",
    				$$slots: { default: [create_default_slot_20] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(formgroup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(formgroup, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const formgroup_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				formgroup_changes.$$scope = { dirty, ctx };
    			}

    			formgroup.$set(formgroup_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formgroup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formgroup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(formgroup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19.name,
    		type: "slot",
    		source: "(47:14) <Col lg=\\\"6\\\">",
    		ctx
    	});

    	return block;
    }

    // (59:16) <FormGroup class="mt-2">
    function create_default_slot_18(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				name: "email",
    				id: "email",
    				type: "email",
    				class: "form-control",
    				placeholder: "Your email*"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(input.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(input, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_18.name,
    		type: "slot",
    		source: "(59:16) <FormGroup class=\\\"mt-2\\\">",
    		ctx
    	});

    	return block;
    }

    // (58:14) <Col lg="6">
    function create_default_slot_17(ctx) {
    	let formgroup;
    	let current;

    	formgroup = new FormGroup({
    			props: {
    				class: "mt-2",
    				$$slots: { default: [create_default_slot_18] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(formgroup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(formgroup, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const formgroup_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				formgroup_changes.$$scope = { dirty, ctx };
    			}

    			formgroup.$set(formgroup_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formgroup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formgroup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(formgroup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17.name,
    		type: "slot",
    		source: "(58:14) <Col lg=\\\"6\\\">",
    		ctx
    	});

    	return block;
    }

    // (46:12) <Row>
    function create_default_slot_16(ctx) {
    	let col0;
    	let t;
    	let col1;
    	let current;

    	col0 = new Col({
    			props: {
    				lg: "6",
    				$$slots: { default: [create_default_slot_19] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col1 = new Col({
    			props: {
    				lg: "6",
    				$$slots: { default: [create_default_slot_17] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t = space();
    			create_component(col1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(col1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(col1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16.name,
    		type: "slot",
    		source: "(46:12) <Row>",
    		ctx
    	});

    	return block;
    }

    // (72:16) <FormGroup class="mt-2">
    function create_default_slot_15(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				type: "text",
    				class: "form-control",
    				id: "subject",
    				name: "subject",
    				placeholder: "Your Subject.."
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(input.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(input, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15.name,
    		type: "slot",
    		source: "(72:16) <FormGroup class=\\\"mt-2\\\">",
    		ctx
    	});

    	return block;
    }

    // (71:14) <Col lg="12">
    function create_default_slot_14(ctx) {
    	let formgroup;
    	let current;

    	formgroup = new FormGroup({
    			props: {
    				class: "mt-2",
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(formgroup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(formgroup, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const formgroup_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				formgroup_changes.$$scope = { dirty, ctx };
    			}

    			formgroup.$set(formgroup_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formgroup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formgroup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(formgroup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(71:14) <Col lg=\\\"12\\\">",
    		ctx
    	});

    	return block;
    }

    // (70:12) <Row>
    function create_default_slot_13(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: "12",
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(70:12) <Row>",
    		ctx
    	});

    	return block;
    }

    // (85:16) <FormGroup class="mt-2">
    function create_default_slot_12(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				type: "textarea",
    				name: "comments",
    				id: "comments",
    				rows: "4",
    				class: "form-control",
    				placeholder: "Your message..."
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(input.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(input, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(85:16) <FormGroup class=\\\"mt-2\\\">",
    		ctx
    	});

    	return block;
    }

    // (84:14) <Col lg="12">
    function create_default_slot_11$1(ctx) {
    	let formgroup;
    	let current;

    	formgroup = new FormGroup({
    			props: {
    				class: "mt-2",
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(formgroup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(formgroup, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const formgroup_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				formgroup_changes.$$scope = { dirty, ctx };
    			}

    			formgroup.$set(formgroup_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formgroup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formgroup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(formgroup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11$1.name,
    		type: "slot",
    		source: "(84:14) <Col lg=\\\"12\\\">",
    		ctx
    	});

    	return block;
    }

    // (83:12) <Row>
    function create_default_slot_10$1(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: "12",
    				$$slots: { default: [create_default_slot_11$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$1.name,
    		type: "slot",
    		source: "(83:12) <Row>",
    		ctx
    	});

    	return block;
    }

    // (98:14) <Col lg="12" class="text-end">
    function create_default_slot_9$1(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				type: "submit",
    				id: "submit",
    				name: "send",
    				class: "submitBnt btn btn-primary",
    				value: "Send Message"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(input.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(input, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$1.name,
    		type: "slot",
    		source: "(98:14) <Col lg=\\\"12\\\" class=\\\"text-end\\\">",
    		ctx
    	});

    	return block;
    }

    // (97:12) <Row>
    function create_default_slot_8$2(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: "12",
    				class: "text-end",
    				$$slots: { default: [create_default_slot_9$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$2.name,
    		type: "slot",
    		source: "(97:12) <Row>",
    		ctx
    	});

    	return block;
    }

    // (41:6) <Col lg="8">
    function create_default_slot_7$2(ctx) {
    	let div1;
    	let form;
    	let p;
    	let t0;
    	let div0;
    	let t1;
    	let row0;
    	let t2;
    	let row1;
    	let t3;
    	let row2;
    	let t4;
    	let row3;
    	let current;

    	row0 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_16] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	row1 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	row2 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_10$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	row3 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_8$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			form = element("form");
    			p = element("p");
    			t0 = space();
    			div0 = element("div");
    			t1 = space();
    			create_component(row0.$$.fragment);
    			t2 = space();
    			create_component(row1.$$.fragment);
    			t3 = space();
    			create_component(row2.$$.fragment);
    			t4 = space();
    			create_component(row3.$$.fragment);
    			attr_dev(p, "id", "error-msg");
    			add_location(p, file$d, 43, 12, 1551);
    			attr_dev(div0, "id", "simple-msg");
    			add_location(div0, file$d, 44, 12, 1584);
    			attr_dev(form, "method", "post");
    			attr_dev(form, "name", "myForm");
    			attr_dev(form, "onsubmit", "return validateForm()");
    			add_location(form, file$d, 42, 10, 1471);
    			attr_dev(div1, "class", "custom-form mt-4 pt-4");
    			add_location(div1, file$d, 41, 8, 1425);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, form);
    			append_dev(form, p);
    			append_dev(form, t0);
    			append_dev(form, div0);
    			append_dev(form, t1);
    			mount_component(row0, form, null);
    			append_dev(form, t2);
    			mount_component(row1, form, null);
    			append_dev(form, t3);
    			mount_component(row2, form, null);
    			append_dev(form, t4);
    			mount_component(row3, form, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row0_changes.$$scope = { dirty, ctx };
    			}

    			row0.$set(row0_changes);
    			const row1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row1_changes.$$scope = { dirty, ctx };
    			}

    			row1.$set(row1_changes);
    			const row2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row2_changes.$$scope = { dirty, ctx };
    			}

    			row2.$set(row2_changes);
    			const row3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row3_changes.$$scope = { dirty, ctx };
    			}

    			row3.$set(row3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row0.$$.fragment, local);
    			transition_in(row1.$$.fragment, local);
    			transition_in(row2.$$.fragment, local);
    			transition_in(row3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row0.$$.fragment, local);
    			transition_out(row1.$$.fragment, local);
    			transition_out(row2.$$.fragment, local);
    			transition_out(row3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(row0);
    			destroy_component(row1);
    			destroy_component(row2);
    			destroy_component(row3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$2.name,
    		type: "slot",
    		source: "(41:6) <Col lg=\\\"8\\\">",
    		ctx
    	});

    	return block;
    }

    // (20:4) <Row>
    function create_default_slot_6$2(ctx) {
    	let col0;
    	let t;
    	let col1;
    	let current;

    	col0 = new Col({
    			props: {
    				lg: "4",
    				$$slots: { default: [create_default_slot_21] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col1 = new Col({
    			props: {
    				lg: "8",
    				$$slots: { default: [create_default_slot_7$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t = space();
    			create_component(col1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(col1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(col1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$2.name,
    		type: "slot",
    		source: "(20:4) <Row>",
    		ctx
    	});

    	return block;
    }

    // (8:2) <Container>
    function create_default_slot_5$2(ctx) {
    	let row0;
    	let t;
    	let row1;
    	let current;

    	row0 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_22] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	row1 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_6$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row0.$$.fragment);
    			t = space();
    			create_component(row1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(row1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row0_changes.$$scope = { dirty, ctx };
    			}

    			row0.$set(row0_changes);
    			const row1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row1_changes.$$scope = { dirty, ctx };
    			}

    			row1.$set(row1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row0.$$.fragment, local);
    			transition_in(row1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row0.$$.fragment, local);
    			transition_out(row1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(row1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$2.name,
    		type: "slot",
    		source: "(8:2) <Container>",
    		ctx
    	});

    	return block;
    }

    // (120:6) <Col lg="6">
    function create_default_slot_4$2(ctx) {
    	let ul;
    	let li0;
    	let a0;
    	let i0;
    	let t0;
    	let li1;
    	let a1;
    	let i1;
    	let t1;
    	let li2;
    	let a2;
    	let i2;
    	let t2;
    	let li3;
    	let a3;
    	let i3;
    	let t3;
    	let li4;
    	let a4;
    	let i4;

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			i0 = element("i");
    			t0 = space();
    			li1 = element("li");
    			a1 = element("a");
    			i1 = element("i");
    			t1 = space();
    			li2 = element("li");
    			a2 = element("a");
    			i2 = element("i");
    			t2 = space();
    			li3 = element("li");
    			a3 = element("a");
    			i3 = element("i");
    			t3 = space();
    			li4 = element("li");
    			a4 = element("a");
    			i4 = element("i");
    			attr_dev(i0, "class", "mdi mdi-facebook");
    			add_location(i0, file$d, 122, 46, 3857);
    			attr_dev(a0, "href", "#");
    			attr_dev(a0, "class", "social-icon");
    			add_location(a0, file$d, 122, 12, 3823);
    			attr_dev(li0, "class", "list-inline-item");
    			add_location(li0, file$d, 121, 10, 3781);
    			attr_dev(i1, "class", "mdi mdi-twitter");
    			add_location(i1, file$d, 125, 46, 3994);
    			attr_dev(a1, "href", "#");
    			attr_dev(a1, "class", "social-icon");
    			add_location(a1, file$d, 125, 12, 3960);
    			attr_dev(li1, "class", "list-inline-item");
    			add_location(li1, file$d, 124, 10, 3918);
    			attr_dev(i2, "class", "mdi mdi-linkedin");
    			add_location(i2, file$d, 128, 46, 4130);
    			attr_dev(a2, "href", "#");
    			attr_dev(a2, "class", "social-icon");
    			add_location(a2, file$d, 128, 12, 4096);
    			attr_dev(li2, "class", "list-inline-item");
    			add_location(li2, file$d, 127, 10, 4054);
    			attr_dev(i3, "class", "mdi mdi-google-plus");
    			add_location(i3, file$d, 132, 15, 4282);
    			attr_dev(a3, "href", "#");
    			attr_dev(a3, "class", "social-icon");
    			add_location(a3, file$d, 131, 12, 4233);
    			attr_dev(li3, "class", "list-inline-item");
    			add_location(li3, file$d, 130, 10, 4191);
    			attr_dev(i4, "class", "mdi mdi-dribbble");
    			add_location(i4, file$d, 136, 46, 4435);
    			attr_dev(a4, "href", "#");
    			attr_dev(a4, "class", "social-icon");
    			add_location(a4, file$d, 136, 12, 4401);
    			attr_dev(li4, "class", "list-inline-item");
    			add_location(li4, file$d, 135, 10, 4359);
    			attr_dev(ul, "class", "list-inline social mt-4");
    			add_location(ul, file$d, 120, 8, 3734);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(a0, i0);
    			append_dev(ul, t0);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(a1, i1);
    			append_dev(ul, t1);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(a2, i2);
    			append_dev(ul, t2);
    			append_dev(ul, li3);
    			append_dev(li3, a3);
    			append_dev(a3, i3);
    			append_dev(ul, t3);
    			append_dev(ul, li4);
    			append_dev(li4, a4);
    			append_dev(a4, i4);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$2.name,
    		type: "slot",
    		source: "(120:6) <Col lg=\\\"6\\\">",
    		ctx
    	});

    	return block;
    }

    // (141:6) <Col lg="3" class="mt-4">
    function create_default_slot_3$2(ctx) {
    	let p;
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			i = element("i");
    			t = text("  +91 123 4556 789");
    			attr_dev(i, "class", "pe-7s-call");
    			add_location(i, file$d, 142, 10, 4589);
    			attr_dev(p, "class", "contact-title");
    			add_location(p, file$d, 141, 8, 4553);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, i);
    			append_dev(p, t);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(141:6) <Col lg=\\\"3\\\" class=\\\"mt-4\\\">",
    		ctx
    	});

    	return block;
    }

    // (146:6) <Col lg="3" class="mt-4 text-end">
    function create_default_slot_2$4(ctx) {
    	let p;
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			i = element("i");
    			t = text("  Support@info.com");
    			attr_dev(i, "class", "pe-7s-mail-open");
    			add_location(i, file$d, 147, 10, 4748);
    			attr_dev(p, "class", "contact-title");
    			add_location(p, file$d, 146, 8, 4712);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, i);
    			append_dev(p, t);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$4.name,
    		type: "slot",
    		source: "(146:6) <Col lg=\\\"3\\\" class=\\\"mt-4 text-end\\\">",
    		ctx
    	});

    	return block;
    }

    // (119:4) <Row class="align-items-center">
    function create_default_slot_1$8(ctx) {
    	let col0;
    	let t0;
    	let col1;
    	let t1;
    	let col2;
    	let current;

    	col0 = new Col({
    			props: {
    				lg: "6",
    				$$slots: { default: [create_default_slot_4$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col1 = new Col({
    			props: {
    				lg: "3",
    				class: "mt-4",
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col2 = new Col({
    			props: {
    				lg: "3",
    				class: "mt-4 text-end",
    				$$slots: { default: [create_default_slot_2$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t0 = space();
    			create_component(col1.$$.fragment);
    			t1 = space();
    			create_component(col2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(col1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(col2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    			const col2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col2_changes.$$scope = { dirty, ctx };
    			}

    			col2.$set(col2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			transition_in(col2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			transition_out(col2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(col1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(col2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$8.name,
    		type: "slot",
    		source: "(119:4) <Row class=\\\"align-items-center\\\">",
    		ctx
    	});

    	return block;
    }

    // (118:2) <Container>
    function create_default_slot$8(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				class: "align-items-center",
    				$$slots: { default: [create_default_slot_1$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(118:2) <Container>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let section0;
    	let container0;
    	let t;
    	let section1;
    	let container1;
    	let current;

    	container0 = new Container({
    			props: {
    				$$slots: { default: [create_default_slot_5$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	container1 = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section0 = element("section");
    			create_component(container0.$$.fragment);
    			t = space();
    			section1 = element("section");
    			create_component(container1.$$.fragment);
    			attr_dev(section0, "class", "section common-section");
    			attr_dev(section0, "id", "contact");
    			add_location(section0, file$d, 6, 0, 145);
    			attr_dev(section1, "class", "contact-social bg-light");
    			add_location(section1, file$d, 116, 0, 3614);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section0, anchor);
    			mount_component(container0, section0, null);
    			insert_dev(target, t, anchor);
    			insert_dev(target, section1, anchor);
    			mount_component(container1, section1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const container0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container0_changes.$$scope = { dirty, ctx };
    			}

    			container0.$set(container0_changes);
    			const container1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container1_changes.$$scope = { dirty, ctx };
    			}

    			container1.$set(container1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container0.$$.fragment, local);
    			transition_in(container1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container0.$$.fragment, local);
    			transition_out(container1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section0);
    			destroy_component(container0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(section1);
    			destroy_component(container1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contact', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Col, Row, Container, FormGroup, Input });
    	return [];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src\Components\Footer.svelte generated by Svelte v3.44.0 */
    const file$c = "src\\Components\\Footer.svelte";

    // (10:6) <Col lg="3" class="mt-4">
    function create_default_slot_8$1(ctx) {
    	let h4;
    	let t1;
    	let div;
    	let ul;
    	let li0;
    	let a0;
    	let t3;
    	let li1;
    	let a1;
    	let t5;
    	let li2;
    	let a2;
    	let t7;
    	let li3;
    	let a3;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			h4.textContent = "MYSTERYDAO";
    			t1 = space();
    			div = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Home";
    			t3 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "About";
    			t5 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Tokenomics";
    			t7 = space();
    			li3 = element("li");
    			a3 = element("a");
    			a3.textContent = "Trade";
    			add_location(h4, file$c, 10, 8, 207);
    			attr_dev(a0, "href", "#");
    			add_location(a0, file$c, 13, 16, 330);
    			add_location(li0, file$c, 13, 12, 326);
    			attr_dev(a1, "href", "#");
    			add_location(a1, file$c, 14, 16, 374);
    			add_location(li1, file$c, 14, 12, 370);
    			attr_dev(a2, "href", "#");
    			add_location(a2, file$c, 15, 16, 419);
    			add_location(li2, file$c, 15, 12, 415);
    			attr_dev(a3, "href", "#");
    			add_location(a3, file$c, 16, 16, 469);
    			add_location(li3, file$c, 16, 12, 465);
    			attr_dev(ul, "class", "list-unstyled footer-list");
    			add_location(ul, file$c, 12, 10, 275);
    			attr_dev(div, "class", "text-muted mt-4");
    			add_location(div, file$c, 11, 8, 235);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t3);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(ul, t5);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(ul, t7);
    			append_dev(ul, li3);
    			append_dev(li3, a3);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$1.name,
    		type: "slot",
    		source: "(10:6) <Col lg=\\\"3\\\" class=\\\"mt-4\\\">",
    		ctx
    	});

    	return block;
    }

    // (21:6) <Col lg="3" class="mt-4">
    function create_default_slot_7$1(ctx) {
    	let h4;
    	let t1;
    	let div;
    	let ul;
    	let li0;
    	let a0;
    	let t3;
    	let li1;
    	let a1;
    	let t5;
    	let li2;
    	let a2;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			h4.textContent = "Socials";
    			t1 = space();
    			div = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Twitter";
    			t3 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Telegram";
    			t5 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Discord";
    			add_location(h4, file$c, 21, 8, 582);
    			attr_dev(a0, "href", "#");
    			add_location(a0, file$c, 24, 16, 702);
    			add_location(li0, file$c, 24, 12, 698);
    			attr_dev(a1, "href", "#");
    			add_location(a1, file$c, 25, 16, 749);
    			add_location(li1, file$c, 25, 12, 745);
    			attr_dev(a2, "href", "#");
    			add_location(a2, file$c, 26, 16, 797);
    			add_location(li2, file$c, 26, 12, 793);
    			attr_dev(ul, "class", "list-unstyled footer-list");
    			add_location(ul, file$c, 23, 10, 647);
    			attr_dev(div, "class", "text-muted mt-4");
    			add_location(div, file$c, 22, 8, 607);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t3);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(ul, t5);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$1.name,
    		type: "slot",
    		source: "(21:6) <Col lg=\\\"3\\\" class=\\\"mt-4\\\">",
    		ctx
    	});

    	return block;
    }

    // (31:6) <Col lg="3" class="mt-4">
    function create_default_slot_6$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "text-muted mt-4");
    			add_location(div, file$c, 31, 8, 912);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(31:6) <Col lg=\\\"3\\\" class=\\\"mt-4\\\">",
    		ctx
    	});

    	return block;
    }

    // (45:6) <Col lg="3" class="mt-4">
    function create_default_slot_5$1(ctx) {
    	let h4;
    	let t1;
    	let div;
    	let t2;
    	let form;
    	let input;
    	let t3;
    	let a;
    	let i;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			h4.textContent = "Subscribe";
    			t1 = space();
    			div = element("div");
    			t2 = space();
    			form = element("form");
    			input = element("input");
    			t3 = space();
    			a = element("a");
    			i = element("i");
    			add_location(h4, file$c, 45, 8, 1350);
    			attr_dev(div, "class", "text-muted mt-4");
    			add_location(div, file$c, 46, 8, 1377);
    			attr_dev(input, "placeholder", "Email");
    			attr_dev(input, "class", "form-control");
    			input.required = true;
    			add_location(input, file$c, 49, 10, 1470);
    			attr_dev(i, "class", "pe-7s-paper-plane");
    			add_location(i, file$c, 50, 39, 1569);
    			attr_dev(a, "href", "#");
    			attr_dev(a, "class", "submit");
    			add_location(a, file$c, 50, 10, 1540);
    			attr_dev(form, "class", "form subscribe");
    			add_location(form, file$c, 48, 8, 1430);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, form, anchor);
    			append_dev(form, input);
    			append_dev(form, t3);
    			append_dev(form, a);
    			append_dev(a, i);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(form);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(45:6) <Col lg=\\\"3\\\" class=\\\"mt-4\\\">",
    		ctx
    	});

    	return block;
    }

    // (9:4) <Row>
    function create_default_slot_4$1(ctx) {
    	let col0;
    	let t0;
    	let col1;
    	let t1;
    	let col2;
    	let t2;
    	let col3;
    	let current;

    	col0 = new Col({
    			props: {
    				lg: "3",
    				class: "mt-4",
    				$$slots: { default: [create_default_slot_8$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col1 = new Col({
    			props: {
    				lg: "3",
    				class: "mt-4",
    				$$slots: { default: [create_default_slot_7$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col2 = new Col({
    			props: {
    				lg: "3",
    				class: "mt-4",
    				$$slots: { default: [create_default_slot_6$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col3 = new Col({
    			props: {
    				lg: "3",
    				class: "mt-4",
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t0 = space();
    			create_component(col1.$$.fragment);
    			t1 = space();
    			create_component(col2.$$.fragment);
    			t2 = space();
    			create_component(col3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(col1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(col2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(col3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    			const col2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col2_changes.$$scope = { dirty, ctx };
    			}

    			col2.$set(col2_changes);
    			const col3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col3_changes.$$scope = { dirty, ctx };
    			}

    			col3.$set(col3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			transition_in(col2.$$.fragment, local);
    			transition_in(col3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			transition_out(col2.$$.fragment, local);
    			transition_out(col3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(col1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(col2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(col3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(9:4) <Row>",
    		ctx
    	});

    	return block;
    }

    // (8:2) <Container>
    function create_default_slot_3$1(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(8:2) <Container>",
    		ctx
    	});

    	return block;
    }

    // (63:6) <Col lg="12">
    function create_default_slot_2$3(ctx) {
    	let div0;
    	let p;
    	let t2;
    	let div1;
    	let t3;
    	let div2;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			p = element("p");

    			p.textContent = `${new Date().getFullYear()}
            © MysterDAO - Only on Lamden`;

    			t2 = space();
    			div1 = element("div");
    			t3 = space();
    			div2 = element("div");
    			attr_dev(p, "class", "copy-rights text-muted");
    			add_location(p, file$c, 64, 10, 1839);
    			attr_dev(div0, "class", "float-start pull-none ");
    			add_location(div0, file$c, 63, 8, 1792);
    			attr_dev(div1, "class", "float-end pull-none ");
    			add_location(div1, file$c, 69, 8, 1992);
    			attr_dev(div2, "class", "clearfix");
    			add_location(div2, file$c, 71, 8, 2050);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, p);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div2, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(63:6) <Col lg=\\\"12\\\">",
    		ctx
    	});

    	return block;
    }

    // (62:4) <Row>
    function create_default_slot_1$7(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: "12",
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$7.name,
    		type: "slot",
    		source: "(62:4) <Row>",
    		ctx
    	});

    	return block;
    }

    // (61:2) <Container>
    function create_default_slot$7(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_1$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(61:2) <Container>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let footer;
    	let container0;
    	let t;
    	let div;
    	let container1;
    	let current;

    	container0 = new Container({
    			props: {
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	container1 = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			create_component(container0.$$.fragment);
    			t = space();
    			div = element("div");
    			create_component(container1.$$.fragment);
    			attr_dev(footer, "class", "footer");
    			add_location(footer, file$c, 6, 0, 119);
    			attr_dev(div, "class", "footer-alt");
    			add_location(div, file$c, 59, 0, 1715);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			mount_component(container0, footer, null);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(container1, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const container0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container0_changes.$$scope = { dirty, ctx };
    			}

    			container0.$set(container0_changes);
    			const container1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container1_changes.$$scope = { dirty, ctx };
    			}

    			container1.$set(container1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container0.$$.fragment, local);
    			transition_in(container1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container0.$$.fragment, local);
    			transition_out(container1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			destroy_component(container0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    			destroy_component(container1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Col, Row, Container });
    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src\Components\Switcher.svelte generated by Svelte v3.44.0 */

    function create_fragment$c(ctx) {
    	const block = {
    		c: noop$1,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop$1,
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: noop$1
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Switcher', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Switcher> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Switcher extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Switcher",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    const SERVICE_DATA = {
        heading: "MysteryDAO",
        description: "MysteryDAO description",
        services_list: [{
                label: "Title",
                text: "Description",
                icon: "pe-7s-diamond"
            },
            {
                label: "Title",
                text: "Description",
                icon: "pe-7s-display2"
            },
            {
                label: "Title",
                text: "Description",
                icon: "pe-7s-piggy"
            },
            {
                label: "Title",
                text: "Description",
                icon: "pe-7s-science"
            },
            {
                label: "Title",
                text: "Description",
                icon: "pe-7s-news-paper"
            },
            {
                label: "Title",
                text: "Description",
                icon: "pe-7s-plane"
            }
        ]
    };

    const FEATURES_DATA = {
        title: 'MysteryDAO tokenomics here?',
        text: 'A description here.',
        feature_list: [
            'Item 1',
            'Item 2',
            'Item 3',
            'Item 4'
        ]
    };

    const PRICING_DATA = {
        title: 'Our Pricing',
        description: 'Call to action pricing table is really crucial to your for your business website. Make your bids stand-out with amazing options.',
        pricing_list: [
            {
                title: 'Economy',
                price: '$9.90',
                bandwidth: '1GB',
                space: '50MB',
                support: 'No',
                domain: 1
            },
            {
                title: 'Delux',
                price: '$19.90',
                bandwidth: '10GB',
                space: '500MB',
                support: 'Yes',
                domain: 10
            },
            {
                title: 'Unlimate',
                price: '$29.90',
                bandwidth: '100GB',
                space: '2 GB',
                support: 'Yes',
                domain: 'Unlimited'
            }
        ]
    };

    const TEAM_DATA = {
            title: 'Behind The People',
            description: 'It is a long established fact that create category leading brand experiences a reader will be distracted by the readable content of a page when looking at its layout.',
            team_list: [
                {
                    profile: '/images/team/img-1.jpg',
                    name: 'Frank Johnson',
                    designation: 'CEO'
                },
                {
                    profile: '/images/team/img-2.jpg',
                    name: 'Elaine Stclair',
                    designation: 'Designer'
                },
                {
                    profile: '/images/team/img-3.jpg',
                    name: 'Wanda Arthur',
                    designation: 'Developer'
                },
                {
                    profile: '/images/team/img-4.jpg',
                    name: 'Joshua Stemple',
                    designation: 'Manager'
                }
            ]
    };

    const TESATIMONIAL_DATA = {
        title :"What they've said",
        description: "The Big Oxmox advised her not to do so, because there were thousands of bad Commas, wild Question Marks and devious pulvinar metus molestie sed Semikoli.",
        testimonial_list: [
            {
                profile: 'images/testimonials/user-2.jpg',
                description: "I feel confident imposing change on myself. It's a lot more fun progressing than looking back. That's why scelerisque pretium dolor, sit amet vehicula erat pelleque need throw curve balls.",
                name: 'Ruben Reed - ',
                text: 'Charleston'
            },
            {
                profile: 'images/testimonials/user-1.jpg',
                description: "Our task must be to free ourselves by widening our circle of compassion to embrace all living creatures Integer varius lacus non magna tempor congue natuasre the whole its beauty.",
                name: 'Michael P. Howlett - ',
                text: 'Worcester'
            },
            {
                profile: 'images/testimonials/user-3.jpg',
                description: "I've learned that people will forget what you said, people will forget what you did, but people will never aliquam in nunc quis tincidunt forget how you vestibulum egestas them feel.",
                name: 'Theresa D. Sinclair - ',
                text: 'Lynchburg'
            }
        ]
    };

    const BLOG_DATA = {
        title :'Blog',
        description: 'Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean class at a euismod mus ipsum vel ex finibus semper luctus quam.',
        blog_list:[
            {
                image: 'images/blog/img-1.jpg',
                text: 'UI & UX Design',
                title: 'Doing a cross country road trip',
                subtext: 'She packed her seven versalia, put her initial into the belt and made herself on the way..'
            },
            {
                image: 'images/blog/img-2.jpg',
                text: 'Digital Marketing',
                title: 'New exhibition at our Museum',
                subtext: 'Pityful a rethoric question ran over her cheek, then she continued her way.'
            },
            {
                image: 'images/blog/img-3.jpg',
                text: 'Travelling',
                title: 'Why are so many people..',
                subtext: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia.'
            }
        ]
    };

    const MOCK_DATA = {
        SERVICE_DATA,
        FEATURES_DATA,
        PRICING_DATA,
        TEAM_DATA,
        TESATIMONIAL_DATA,
        BLOG_DATA
    };

    /* src\routes\Index.svelte generated by Svelte v3.44.0 */
    const file$b = "src\\routes\\Index.svelte";

    function create_fragment$b(ctx) {
    	let navbar;
    	let t0;
    	let section;
    	let div0;
    	let t1;
    	let div7;
    	let div6;
    	let div5;
    	let div4;
    	let div3;
    	let div2;
    	let div1;
    	let iframe;
    	let iframe_src_value;
    	let t2;
    	let div8;
    	let img;
    	let img_src_value;
    	let t3;
    	let services;
    	let t4;
    	let features;
    	let t5;
    	let footer;
    	let t6;
    	let switcher;
    	let current;
    	navbar = new Navbar({ $$inline: true });

    	services = new Services({
    			props: { serviceData: MOCK_DATA.SERVICE_DATA },
    			$$inline: true
    		});

    	features = new Features({
    			props: { featureData: MOCK_DATA.FEATURES_DATA },
    			$$inline: true
    		});

    	footer = new Footer({ $$inline: true });
    	switcher = new Switcher({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			section = element("section");
    			div0 = element("div");
    			t1 = space();
    			div7 = element("div");
    			div6 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			iframe = element("iframe");
    			t2 = space();
    			div8 = element("div");
    			img = element("img");
    			t3 = space();
    			create_component(services.$$.fragment);
    			t4 = space();
    			create_component(features.$$.fragment);
    			t5 = space();
    			create_component(footer.$$.fragment);
    			t6 = space();
    			create_component(switcher.$$.fragment);
    			attr_dev(div0, "class", "bg-overlay");
    			add_location(div0, file$b, 37, 2, 978);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://streamable.com/e/5nu1sd?nocontrols=1")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "frameborder", "0");
    			attr_dev(iframe, "width", "100%");
    			attr_dev(iframe, "height", "80%");
    			iframe.allowFullscreen = true;
    			set_style(iframe, "width", "100%");
    			set_style(iframe, "height", "100%");
    			set_style(iframe, "position", "absolute");
    			set_style(iframe, "left", "0px");
    			set_style(iframe, "top", "0px");
    			set_style(iframe, "overflow", "hidden");
    			attr_dev(iframe, "title", "video");
    			add_location(iframe, file$b, 45, 16, 1346);
    			set_style(div1, "width", "100%");
    			set_style(div1, "height", "0px");
    			set_style(div1, "position", "relative");
    			set_style(div1, "padding-bottom", "56.250%");
    			add_location(div1, file$b, 44, 14, 1252);
    			attr_dev(div2, "class", "mt-4");
    			add_location(div2, file$b, 43, 12, 1219);
    			attr_dev(div3, "class", "col-lg-8 text-white text-center");
    			add_location(div3, file$b, 42, 10, 1161);
    			attr_dev(div4, "class", "row justify-content-center");
    			add_location(div4, file$b, 41, 8, 1110);
    			attr_dev(div5, "class", "container");
    			add_location(div5, file$b, 40, 6, 1078);
    			attr_dev(div6, "class", "display-table-cell");
    			add_location(div6, file$b, 39, 4, 1039);
    			attr_dev(div7, "class", "display-table");
    			add_location(div7, file$b, 38, 2, 1007);
    			if (!src_url_equal(img.src, img_src_value = "images/bg-pattern.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$b, 53, 4, 1698);
    			attr_dev(div8, "class", "bg-pattern-effect");
    			add_location(div8, file$b, 52, 2, 1662);
    			attr_dev(section, "class", "section bg-home home-half active common-section");
    			attr_dev(section, "id", "home");
    			attr_dev(section, "data-image-src", "images/bg-home.png");
    			add_location(section, file$b, 32, 0, 857);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			append_dev(section, t1);
    			append_dev(section, div7);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, iframe);
    			append_dev(section, t2);
    			append_dev(section, div8);
    			append_dev(div8, img);
    			insert_dev(target, t3, anchor);
    			mount_component(services, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(features, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(footer, target, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(switcher, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(services.$$.fragment, local);
    			transition_in(features.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			transition_in(switcher.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(services.$$.fragment, local);
    			transition_out(features.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			transition_out(switcher.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navbar, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(section);
    			if (detaching) detach_dev(t3);
    			destroy_component(services, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(features, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(footer, detaching);
    			if (detaching) detach_dev(t6);
    			destroy_component(switcher, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Index', slots, []);
    	let open = false;

    	/**
     * Toggle modal
     */
    	const toggle = () => {
    		open = !open;
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Index> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Modal,
    		ModalBody,
    		ModalHeader,
    		Navbar,
    		Services,
    		Features,
    		Pricing,
    		Team,
    		Testimonial,
    		Blog,
    		Contact,
    		Footer,
    		Switcher,
    		data: MOCK_DATA,
    		open,
    		toggle
    	});

    	$$self.$inject_state = $$props => {
    		if ('open' in $$props) open = $$props.open;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class Index extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Index",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\routes\Index2.svelte generated by Svelte v3.44.0 */
    const file$a = "src\\routes\\Index2.svelte";

    // (53:14) <ModalBody>
    function create_default_slot_1$6(ctx) {
    	let video;
    	let track;
    	let video_src_value;

    	const block = {
    		c: function create() {
    			video = element("video");
    			track = element("track");
    			track.default = true;
    			attr_dev(track, "kind", "captions");
    			attr_dev(track, "type", "video/mp4");
    			add_location(track, file$a, 59, 18, 1924);
    			attr_dev(video, "id", "VisaChipCardVideo");
    			attr_dev(video, "class", "video-box");
    			if (!src_url_equal(video.src, video_src_value = "https://www.w3schools.com/html/mov_bbb.mp4")) attr_dev(video, "src", video_src_value);
    			video.controls = true;
    			add_location(video, file$a, 53, 16, 1710);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, video, anchor);
    			append_dev(video, track);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(video);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$6.name,
    		type: "slot",
    		source: "(53:14) <ModalBody>",
    		ctx
    	});

    	return block;
    }

    // (51:12) <Modal isOpen={open} {toggle} size="lg">
    function create_default_slot$6(ctx) {
    	let modalheader;
    	let t;
    	let modalbody;
    	let current;

    	modalheader = new ModalHeader({
    			props: { toggle: /*toggle*/ ctx[1] },
    			$$inline: true
    		});

    	modalbody = new ModalBody({
    			props: {
    				$$slots: { default: [create_default_slot_1$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modalheader.$$.fragment);
    			t = space();
    			create_component(modalbody.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modalheader, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(modalbody, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modalbody_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				modalbody_changes.$$scope = { dirty, ctx };
    			}

    			modalbody.$set(modalbody_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modalheader.$$.fragment, local);
    			transition_in(modalbody.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modalheader.$$.fragment, local);
    			transition_out(modalbody.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modalheader, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(modalbody, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(51:12) <Modal isOpen={open} {toggle} size=\\\"lg\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let navbar;
    	let t0;
    	let section;
    	let div0;
    	let t1;
    	let div5;
    	let div4;
    	let div3;
    	let div2;
    	let div1;
    	let h1;
    	let t3;
    	let p0;
    	let t5;
    	let p1;
    	let a;
    	let i;
    	let t6;
    	let modal;
    	let t7;
    	let div12;
    	let div7;
    	let div6;
    	let t8;
    	let div9;
    	let div8;
    	let t9;
    	let div11;
    	let div10;
    	let t10;
    	let services;
    	let t11;
    	let features;
    	let t12;
    	let pricing;
    	let t13;
    	let team;
    	let t14;
    	let testimonial;
    	let t15;
    	let blog;
    	let t16;
    	let contact;
    	let t17;
    	let footer;
    	let t18;
    	let switcher;
    	let current;
    	let mounted;
    	let dispose;
    	navbar = new Navbar({ $$inline: true });

    	modal = new Modal({
    			props: {
    				isOpen: /*open*/ ctx[0],
    				toggle: /*toggle*/ ctx[1],
    				size: "lg",
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	services = new Services({
    			props: { serviceData: MOCK_DATA.SERVICE_DATA },
    			$$inline: true
    		});

    	features = new Features({
    			props: { featureData: MOCK_DATA.FEATURES_DATA },
    			$$inline: true
    		});

    	pricing = new Pricing({
    			props: { pricingData: MOCK_DATA.PRICING_DATA },
    			$$inline: true
    		});

    	team = new Team({
    			props: { teamData: MOCK_DATA.TEAM_DATA },
    			$$inline: true
    		});

    	testimonial = new Testimonial({
    			props: { testimonialData: MOCK_DATA.TESATIMONIAL_DATA },
    			$$inline: true
    		});

    	blog = new Blog({
    			props: { blogData: MOCK_DATA.BLOG_DATA },
    			$$inline: true
    		});

    	contact = new Contact({ $$inline: true });
    	footer = new Footer({ $$inline: true });
    	switcher = new Switcher({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			section = element("section");
    			div0 = element("div");
    			t1 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "We help startups launch their products";
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "Etiam sed.Interdum consequat proin vestibulum class at.";
    			t5 = space();
    			p1 = element("p");
    			a = element("a");
    			i = element("i");
    			t6 = space();
    			create_component(modal.$$.fragment);
    			t7 = space();
    			div12 = element("div");
    			div7 = element("div");
    			div6 = element("div");
    			t8 = space();
    			div9 = element("div");
    			div8 = element("div");
    			t9 = space();
    			div11 = element("div");
    			div10 = element("div");
    			t10 = space();
    			create_component(services.$$.fragment);
    			t11 = space();
    			create_component(features.$$.fragment);
    			t12 = space();
    			create_component(pricing.$$.fragment);
    			t13 = space();
    			create_component(team.$$.fragment);
    			t14 = space();
    			create_component(testimonial.$$.fragment);
    			t15 = space();
    			create_component(blog.$$.fragment);
    			t16 = space();
    			create_component(contact.$$.fragment);
    			t17 = space();
    			create_component(footer.$$.fragment);
    			t18 = space();
    			create_component(switcher.$$.fragment);
    			attr_dev(div0, "class", "bg-overlay");
    			add_location(div0, file$a, 35, 2, 930);
    			attr_dev(h1, "class", "home-title");
    			add_location(h1, file$a, 41, 12, 1171);
    			attr_dev(p0, "class", "pt-3 home-desc");
    			add_location(p0, file$a, 42, 12, 1250);
    			attr_dev(i, "class", "mdi mdi-play text-center");
    			add_location(i, file$a, 47, 17, 1501);
    			attr_dev(a, "href", "#");
    			attr_dev(a, "class", "play-btn video-play-icon");
    			add_location(a, file$a, 46, 14, 1437);
    			attr_dev(p1, "class", "play-shadow mt-4");
    			add_location(p1, file$a, 45, 12, 1376);
    			attr_dev(div1, "class", "col-lg-8 text-white text-center");
    			add_location(div1, file$a, 40, 10, 1113);
    			attr_dev(div2, "class", "row justify-content-center");
    			add_location(div2, file$a, 39, 8, 1062);
    			attr_dev(div3, "class", "container");
    			add_location(div3, file$a, 38, 6, 1030);
    			attr_dev(div4, "class", "display-table-cell");
    			add_location(div4, file$a, 37, 4, 991);
    			attr_dev(div5, "class", "display-table");
    			add_location(div5, file$a, 36, 2, 959);
    			attr_dev(div6, "class", "wave wave-one");
    			set_style(div6, "background-image", "url('images/wave-shape/wave1.png')");
    			add_location(div6, file$a, 71, 6, 2224);
    			attr_dev(div7, "class", "waves-shape shape-one");
    			add_location(div7, file$a, 70, 4, 2182);
    			attr_dev(div8, "class", "wave wave-two");
    			set_style(div8, "background-image", "url('images/wave-shape/wave2.png')");
    			add_location(div8, file$a, 77, 6, 2394);
    			attr_dev(div9, "class", "waves-shape shape-two");
    			add_location(div9, file$a, 76, 4, 2352);
    			attr_dev(div10, "class", "wave wave-three");
    			set_style(div10, "background-image", "url('images/wave-shape/wave3.png')");
    			add_location(div10, file$a, 83, 6, 2566);
    			attr_dev(div11, "class", "waves-shape shape-three");
    			add_location(div11, file$a, 82, 4, 2522);
    			attr_dev(div12, "class", "wave-effect wave-anim");
    			add_location(div12, file$a, 69, 2, 2142);
    			attr_dev(section, "class", "section bg-home home-half active common-section");
    			attr_dev(section, "id", "home");
    			attr_dev(section, "data-image-src", "images/bg-home.png");
    			add_location(section, file$a, 30, 0, 809);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			append_dev(section, t1);
    			append_dev(section, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, h1);
    			append_dev(div1, t3);
    			append_dev(div1, p0);
    			append_dev(div1, t5);
    			append_dev(div1, p1);
    			append_dev(p1, a);
    			append_dev(a, i);
    			append_dev(div1, t6);
    			mount_component(modal, div1, null);
    			append_dev(section, t7);
    			append_dev(section, div12);
    			append_dev(div12, div7);
    			append_dev(div7, div6);
    			append_dev(div12, t8);
    			append_dev(div12, div9);
    			append_dev(div9, div8);
    			append_dev(div12, t9);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			insert_dev(target, t10, anchor);
    			mount_component(services, target, anchor);
    			insert_dev(target, t11, anchor);
    			mount_component(features, target, anchor);
    			insert_dev(target, t12, anchor);
    			mount_component(pricing, target, anchor);
    			insert_dev(target, t13, anchor);
    			mount_component(team, target, anchor);
    			insert_dev(target, t14, anchor);
    			mount_component(testimonial, target, anchor);
    			insert_dev(target, t15, anchor);
    			mount_component(blog, target, anchor);
    			insert_dev(target, t16, anchor);
    			mount_component(contact, target, anchor);
    			insert_dev(target, t17, anchor);
    			mount_component(footer, target, anchor);
    			insert_dev(target, t18, anchor);
    			mount_component(switcher, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(p1, "click", /*toggle*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};
    			if (dirty & /*open*/ 1) modal_changes.isOpen = /*open*/ ctx[0];

    			if (dirty & /*$$scope*/ 4) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(modal.$$.fragment, local);
    			transition_in(services.$$.fragment, local);
    			transition_in(features.$$.fragment, local);
    			transition_in(pricing.$$.fragment, local);
    			transition_in(team.$$.fragment, local);
    			transition_in(testimonial.$$.fragment, local);
    			transition_in(blog.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			transition_in(switcher.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(modal.$$.fragment, local);
    			transition_out(services.$$.fragment, local);
    			transition_out(features.$$.fragment, local);
    			transition_out(pricing.$$.fragment, local);
    			transition_out(team.$$.fragment, local);
    			transition_out(testimonial.$$.fragment, local);
    			transition_out(blog.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			transition_out(switcher.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navbar, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(section);
    			destroy_component(modal);
    			if (detaching) detach_dev(t10);
    			destroy_component(services, detaching);
    			if (detaching) detach_dev(t11);
    			destroy_component(features, detaching);
    			if (detaching) detach_dev(t12);
    			destroy_component(pricing, detaching);
    			if (detaching) detach_dev(t13);
    			destroy_component(team, detaching);
    			if (detaching) detach_dev(t14);
    			destroy_component(testimonial, detaching);
    			if (detaching) detach_dev(t15);
    			destroy_component(blog, detaching);
    			if (detaching) detach_dev(t16);
    			destroy_component(contact, detaching);
    			if (detaching) detach_dev(t17);
    			destroy_component(footer, detaching);
    			if (detaching) detach_dev(t18);
    			destroy_component(switcher, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Index2', slots, []);
    	let open = false;

    	const toggle = () => {
    		$$invalidate(0, open = !open);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Index2> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Modal,
    		ModalBody,
    		ModalHeader,
    		Navbar,
    		Services,
    		Features,
    		Pricing,
    		Team,
    		Testimonial,
    		Blog,
    		Contact,
    		Footer,
    		Switcher,
    		data: MOCK_DATA,
    		open,
    		toggle
    	});

    	$$self.$inject_state = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [open, toggle];
    }

    class Index2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Index2",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\routes\Index3.svelte generated by Svelte v3.44.0 */
    const file$9 = "src\\routes\\Index3.svelte";

    // (54:14) <ModalBody>
    function create_default_slot_1$5(ctx) {
    	let video;
    	let track;
    	let video_src_value;

    	const block = {
    		c: function create() {
    			video = element("video");
    			track = element("track");
    			track.default = true;
    			attr_dev(track, "kind", "captions");
    			attr_dev(track, "type", "video/mp4");
    			add_location(track, file$9, 60, 18, 2060);
    			attr_dev(video, "id", "VisaChipCardVideo");
    			attr_dev(video, "class", "video-box");
    			if (!src_url_equal(video.src, video_src_value = "https://www.w3schools.com/html/mov_bbb.mp4")) attr_dev(video, "src", video_src_value);
    			video.controls = true;
    			add_location(video, file$9, 54, 16, 1846);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, video, anchor);
    			append_dev(video, track);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(video);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(54:14) <ModalBody>",
    		ctx
    	});

    	return block;
    }

    // (52:12) <Modal isOpen={open} {toggle} size = "lg">
    function create_default_slot$5(ctx) {
    	let modalheader;
    	let t;
    	let modalbody;
    	let current;

    	modalheader = new ModalHeader({
    			props: { toggle: /*toggle*/ ctx[1] },
    			$$inline: true
    		});

    	modalbody = new ModalBody({
    			props: {
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modalheader.$$.fragment);
    			t = space();
    			create_component(modalbody.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modalheader, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(modalbody, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modalbody_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				modalbody_changes.$$scope = { dirty, ctx };
    			}

    			modalbody.$set(modalbody_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modalheader.$$.fragment, local);
    			transition_in(modalbody.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modalheader.$$.fragment, local);
    			transition_out(modalbody.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modalheader, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(modalbody, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(52:12) <Modal isOpen={open} {toggle} size = \\\"lg\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let navbar;
    	let t0;
    	let section;
    	let div0;
    	let t1;
    	let div5;
    	let div4;
    	let div3;
    	let div2;
    	let div1;
    	let h1;
    	let t3;
    	let p0;
    	let t5;
    	let p1;
    	let a;
    	let i;
    	let t6;
    	let modal;
    	let t7;
    	let div6;
    	let img;
    	let img_src_value;
    	let t8;
    	let services;
    	let t9;
    	let features;
    	let t10;
    	let pricing;
    	let t11;
    	let team;
    	let t12;
    	let testimonial;
    	let t13;
    	let blog;
    	let t14;
    	let contact;
    	let t15;
    	let footer;
    	let t16;
    	let switcher;
    	let current;
    	let mounted;
    	let dispose;
    	navbar = new Navbar({ $$inline: true });

    	modal = new Modal({
    			props: {
    				isOpen: /*open*/ ctx[0],
    				toggle: /*toggle*/ ctx[1],
    				size: "lg",
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	services = new Services({
    			props: { serviceData: MOCK_DATA.SERVICE_DATA },
    			$$inline: true
    		});

    	features = new Features({
    			props: { featureData: MOCK_DATA.FEATURES_DATA },
    			$$inline: true
    		});

    	pricing = new Pricing({
    			props: { pricingData: MOCK_DATA.PRICING_DATA },
    			$$inline: true
    		});

    	team = new Team({
    			props: { teamData: MOCK_DATA.TEAM_DATA },
    			$$inline: true
    		});

    	testimonial = new Testimonial({
    			props: { testimonialData: MOCK_DATA.TESATIMONIAL_DATA },
    			$$inline: true
    		});

    	blog = new Blog({
    			props: { blogData: MOCK_DATA.BLOG_DATA },
    			$$inline: true
    		});

    	contact = new Contact({ $$inline: true });
    	footer = new Footer({ $$inline: true });
    	switcher = new Switcher({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			section = element("section");
    			div0 = element("div");
    			t1 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "We help startups launch their products";
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "Etiam sed.Interdum consequat proin vestibulum class at a euismod\n              mus luctus quam.Lorem ipsum dolor sit amet, consectetur\n              adipisicing eli.";
    			t5 = space();
    			p1 = element("p");
    			a = element("a");
    			i = element("i");
    			t6 = space();
    			create_component(modal.$$.fragment);
    			t7 = space();
    			div6 = element("div");
    			img = element("img");
    			t8 = space();
    			create_component(services.$$.fragment);
    			t9 = space();
    			create_component(features.$$.fragment);
    			t10 = space();
    			create_component(pricing.$$.fragment);
    			t11 = space();
    			create_component(team.$$.fragment);
    			t12 = space();
    			create_component(testimonial.$$.fragment);
    			t13 = space();
    			create_component(blog.$$.fragment);
    			t14 = space();
    			create_component(contact.$$.fragment);
    			t15 = space();
    			create_component(footer.$$.fragment);
    			t16 = space();
    			create_component(switcher.$$.fragment);
    			attr_dev(div0, "class", "bg-overlay");
    			add_location(div0, file$9, 34, 2, 954);
    			attr_dev(h1, "class", "home-title");
    			add_location(h1, file$9, 40, 12, 1195);
    			attr_dev(p0, "class", "pt-3 home-desc");
    			add_location(p0, file$9, 41, 12, 1274);
    			attr_dev(i, "class", "mdi mdi-play text-center");
    			add_location(i, file$9, 48, 17, 1635);
    			attr_dev(a, "href", "#");
    			attr_dev(a, "class", "play-btn video-play-icon");
    			add_location(a, file$9, 47, 14, 1571);
    			attr_dev(p1, "class", "play-shadow mt-4");
    			add_location(p1, file$9, 46, 12, 1510);
    			attr_dev(div1, "class", "col-lg-8 text-white text-center");
    			add_location(div1, file$9, 39, 10, 1137);
    			attr_dev(div2, "class", "row justify-content-center");
    			add_location(div2, file$9, 38, 8, 1086);
    			attr_dev(div3, "class", "container");
    			add_location(div3, file$9, 37, 6, 1054);
    			attr_dev(div4, "class", "display-table-cell");
    			add_location(div4, file$9, 36, 4, 1015);
    			attr_dev(div5, "class", "display-table");
    			add_location(div5, file$9, 35, 2, 983);
    			if (!src_url_equal(img.src, img_src_value = "images/bg-pattern.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$9, 71, 4, 2314);
    			attr_dev(div6, "class", "bg-pattern-effect");
    			add_location(div6, file$9, 70, 2, 2278);
    			attr_dev(section, "class", "section bg-home vh-100 common-section");
    			attr_dev(section, "id", "home");
    			attr_dev(section, "data-image-src", "images/bg-home.png");
    			add_location(section, file$9, 29, 0, 843);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			append_dev(section, t1);
    			append_dev(section, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, h1);
    			append_dev(div1, t3);
    			append_dev(div1, p0);
    			append_dev(div1, t5);
    			append_dev(div1, p1);
    			append_dev(p1, a);
    			append_dev(a, i);
    			append_dev(div1, t6);
    			mount_component(modal, div1, null);
    			append_dev(section, t7);
    			append_dev(section, div6);
    			append_dev(div6, img);
    			insert_dev(target, t8, anchor);
    			mount_component(services, target, anchor);
    			insert_dev(target, t9, anchor);
    			mount_component(features, target, anchor);
    			insert_dev(target, t10, anchor);
    			mount_component(pricing, target, anchor);
    			insert_dev(target, t11, anchor);
    			mount_component(team, target, anchor);
    			insert_dev(target, t12, anchor);
    			mount_component(testimonial, target, anchor);
    			insert_dev(target, t13, anchor);
    			mount_component(blog, target, anchor);
    			insert_dev(target, t14, anchor);
    			mount_component(contact, target, anchor);
    			insert_dev(target, t15, anchor);
    			mount_component(footer, target, anchor);
    			insert_dev(target, t16, anchor);
    			mount_component(switcher, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(p1, "click", /*toggle*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};
    			if (dirty & /*open*/ 1) modal_changes.isOpen = /*open*/ ctx[0];

    			if (dirty & /*$$scope*/ 4) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(modal.$$.fragment, local);
    			transition_in(services.$$.fragment, local);
    			transition_in(features.$$.fragment, local);
    			transition_in(pricing.$$.fragment, local);
    			transition_in(team.$$.fragment, local);
    			transition_in(testimonial.$$.fragment, local);
    			transition_in(blog.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			transition_in(switcher.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(modal.$$.fragment, local);
    			transition_out(services.$$.fragment, local);
    			transition_out(features.$$.fragment, local);
    			transition_out(pricing.$$.fragment, local);
    			transition_out(team.$$.fragment, local);
    			transition_out(testimonial.$$.fragment, local);
    			transition_out(blog.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			transition_out(switcher.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navbar, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(section);
    			destroy_component(modal);
    			if (detaching) detach_dev(t8);
    			destroy_component(services, detaching);
    			if (detaching) detach_dev(t9);
    			destroy_component(features, detaching);
    			if (detaching) detach_dev(t10);
    			destroy_component(pricing, detaching);
    			if (detaching) detach_dev(t11);
    			destroy_component(team, detaching);
    			if (detaching) detach_dev(t12);
    			destroy_component(testimonial, detaching);
    			if (detaching) detach_dev(t13);
    			destroy_component(blog, detaching);
    			if (detaching) detach_dev(t14);
    			destroy_component(contact, detaching);
    			if (detaching) detach_dev(t15);
    			destroy_component(footer, detaching);
    			if (detaching) detach_dev(t16);
    			destroy_component(switcher, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Index3', slots, []);
    	let open = false;

    	const toggle = () => {
    		size = "lg";
    		$$invalidate(0, open = !open);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Index3> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Modal,
    		ModalBody,
    		ModalHeader,
    		Navbar,
    		Services,
    		Features,
    		Pricing,
    		Team,
    		Testimonial,
    		Blog,
    		Contact,
    		Footer,
    		Switcher,
    		data: MOCK_DATA,
    		open,
    		toggle
    	});

    	$$self.$inject_state = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [open, toggle];
    }

    class Index3 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Index3",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\routes\Index4.svelte generated by Svelte v3.44.0 */
    const file$8 = "src\\routes\\Index4.svelte";

    function create_fragment$8(ctx) {
    	let navbar;
    	let t0;
    	let section;
    	let div0;
    	let t1;
    	let div7;
    	let div6;
    	let div5;
    	let div4;
    	let div1;
    	let h1;
    	let t3;
    	let p;
    	let t5;
    	let a;
    	let t6;
    	let i;
    	let t7;
    	let div3;
    	let div2;
    	let h4;
    	let t9;
    	let form;
    	let input0;
    	let t10;
    	let input1;
    	let t11;
    	let textarea;
    	let t12;
    	let button;
    	let t14;
    	let services;
    	let t15;
    	let features;
    	let t16;
    	let pricing;
    	let t17;
    	let team;
    	let t18;
    	let testimonial;
    	let t19;
    	let blog;
    	let t20;
    	let contact;
    	let t21;
    	let footer;
    	let t22;
    	let switcher;
    	let current;
    	navbar = new Navbar({ $$inline: true });

    	services = new Services({
    			props: { serviceData: MOCK_DATA.SERVICE_DATA },
    			$$inline: true
    		});

    	features = new Features({
    			props: { featureData: MOCK_DATA.FEATURES_DATA },
    			$$inline: true
    		});

    	pricing = new Pricing({
    			props: { pricingData: MOCK_DATA.PRICING_DATA },
    			$$inline: true
    		});

    	team = new Team({
    			props: { teamData: MOCK_DATA.TEAM_DATA },
    			$$inline: true
    		});

    	testimonial = new Testimonial({
    			props: { testimonialData: MOCK_DATA.TESATIMONIAL_DATA },
    			$$inline: true
    		});

    	blog = new Blog({
    			props: { blogData: MOCK_DATA.BLOG_DATA },
    			$$inline: true
    		});

    	contact = new Contact({ $$inline: true });
    	footer = new Footer({ $$inline: true });
    	switcher = new Switcher({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			section = element("section");
    			div0 = element("div");
    			t1 = space();
    			div7 = element("div");
    			div6 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "We help startups launch their products";
    			t3 = space();
    			p = element("p");
    			p.textContent = "Etiam sed.Interdum consequat proin vestibulum class at a euismod\n              mus luctus quam.Lorem ipsum dolor sit amet, consectetur\n              adipisicing eli.";
    			t5 = space();
    			a = element("a");
    			t6 = text("Get Started ");
    			i = element("i");
    			t7 = space();
    			div3 = element("div");
    			div2 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Get 30 day FREE Trial";
    			t9 = space();
    			form = element("form");
    			input0 = element("input");
    			t10 = space();
    			input1 = element("input");
    			t11 = space();
    			textarea = element("textarea");
    			t12 = space();
    			button = element("button");
    			button.textContent = "Send Detail";
    			t14 = space();
    			create_component(services.$$.fragment);
    			t15 = space();
    			create_component(features.$$.fragment);
    			t16 = space();
    			create_component(pricing.$$.fragment);
    			t17 = space();
    			create_component(team.$$.fragment);
    			t18 = space();
    			create_component(testimonial.$$.fragment);
    			t19 = space();
    			create_component(blog.$$.fragment);
    			t20 = space();
    			create_component(contact.$$.fragment);
    			t21 = space();
    			create_component(footer.$$.fragment);
    			t22 = space();
    			create_component(switcher.$$.fragment);
    			attr_dev(div0, "class", "bg-overlay");
    			add_location(div0, file$8, 26, 2, 825);
    			attr_dev(h1, "class", "home-title");
    			add_location(h1, file$8, 32, 12, 1064);
    			attr_dev(p, "class", "pt-3 home-desc home-subtitle-width-100");
    			add_location(p, file$8, 33, 12, 1143);
    			attr_dev(i, "class", "mdi mdi-arrow-right");
    			add_location(i, file$8, 39, 27, 1498);
    			attr_dev(a, "href", "#");
    			attr_dev(a, "class", "btn btn-primary mt-4 waves-effect waves-light");
    			add_location(a, file$8, 38, 12, 1403);
    			attr_dev(div1, "class", "col-lg-7 text-white text-start mt-4");
    			add_location(div1, file$8, 31, 10, 1002);
    			attr_dev(h4, "class", "form-heading text-center mt-2");
    			add_location(h4, file$8, 44, 14, 1688);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "exampleInputName1");
    			attr_dev(input0, "class", "form-control registration-input-box");
    			attr_dev(input0, "placeholder", "Name");
    			add_location(input0, file$8, 48, 16, 1875);
    			attr_dev(input1, "type", "email");
    			attr_dev(input1, "id", "exampleInputEmail1");
    			attr_dev(input1, "class", "form-control registration-input-box");
    			attr_dev(input1, "placeholder", "Email");
    			add_location(input1, file$8, 54, 16, 2087);
    			attr_dev(textarea, "class", "form-control registration-textarea-box");
    			attr_dev(textarea, "rows", "4");
    			attr_dev(textarea, "placeholder", "Message");
    			add_location(textarea, file$8, 60, 16, 2302);
    			attr_dev(button, "class", "btn btn-primary w-100 waves-effect waves-light");
    			add_location(button, file$8, 65, 16, 2479);
    			attr_dev(form, "class", "registration-form");
    			attr_dev(form, "id", "registration-form");
    			add_location(form, file$8, 47, 14, 1803);
    			attr_dev(div2, "class", "home-registration-form bg-white");
    			add_location(div2, file$8, 43, 12, 1628);
    			attr_dev(div3, "class", "col-lg-4 offset-lg-1 mt-4");
    			add_location(div3, file$8, 42, 10, 1576);
    			attr_dev(div4, "class", "row vertical-content");
    			add_location(div4, file$8, 30, 8, 957);
    			attr_dev(div5, "class", "container");
    			add_location(div5, file$8, 29, 6, 925);
    			attr_dev(div6, "class", "display-table-cell");
    			add_location(div6, file$8, 28, 4, 886);
    			attr_dev(div7, "class", "display-table");
    			add_location(div7, file$8, 27, 2, 854);
    			attr_dev(section, "class", "section bg-home home-half home-registration common-section");
    			attr_dev(section, "id", "home");
    			attr_dev(section, "data-image-src", "images/bg-home.png");
    			add_location(section, file$8, 21, 0, 693);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			append_dev(section, t1);
    			append_dev(section, div7);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div1, h1);
    			append_dev(div1, t3);
    			append_dev(div1, p);
    			append_dev(div1, t5);
    			append_dev(div1, a);
    			append_dev(a, t6);
    			append_dev(a, i);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, h4);
    			append_dev(div2, t9);
    			append_dev(div2, form);
    			append_dev(form, input0);
    			append_dev(form, t10);
    			append_dev(form, input1);
    			append_dev(form, t11);
    			append_dev(form, textarea);
    			append_dev(form, t12);
    			append_dev(form, button);
    			insert_dev(target, t14, anchor);
    			mount_component(services, target, anchor);
    			insert_dev(target, t15, anchor);
    			mount_component(features, target, anchor);
    			insert_dev(target, t16, anchor);
    			mount_component(pricing, target, anchor);
    			insert_dev(target, t17, anchor);
    			mount_component(team, target, anchor);
    			insert_dev(target, t18, anchor);
    			mount_component(testimonial, target, anchor);
    			insert_dev(target, t19, anchor);
    			mount_component(blog, target, anchor);
    			insert_dev(target, t20, anchor);
    			mount_component(contact, target, anchor);
    			insert_dev(target, t21, anchor);
    			mount_component(footer, target, anchor);
    			insert_dev(target, t22, anchor);
    			mount_component(switcher, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(services.$$.fragment, local);
    			transition_in(features.$$.fragment, local);
    			transition_in(pricing.$$.fragment, local);
    			transition_in(team.$$.fragment, local);
    			transition_in(testimonial.$$.fragment, local);
    			transition_in(blog.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			transition_in(switcher.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(services.$$.fragment, local);
    			transition_out(features.$$.fragment, local);
    			transition_out(pricing.$$.fragment, local);
    			transition_out(team.$$.fragment, local);
    			transition_out(testimonial.$$.fragment, local);
    			transition_out(blog.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			transition_out(switcher.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navbar, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(section);
    			if (detaching) detach_dev(t14);
    			destroy_component(services, detaching);
    			if (detaching) detach_dev(t15);
    			destroy_component(features, detaching);
    			if (detaching) detach_dev(t16);
    			destroy_component(pricing, detaching);
    			if (detaching) detach_dev(t17);
    			destroy_component(team, detaching);
    			if (detaching) detach_dev(t18);
    			destroy_component(testimonial, detaching);
    			if (detaching) detach_dev(t19);
    			destroy_component(blog, detaching);
    			if (detaching) detach_dev(t20);
    			destroy_component(contact, detaching);
    			if (detaching) detach_dev(t21);
    			destroy_component(footer, detaching);
    			if (detaching) detach_dev(t22);
    			destroy_component(switcher, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Index4', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Index4> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Navbar,
    		Services,
    		Features,
    		Pricing,
    		Team,
    		Testimonial,
    		Blog,
    		Contact,
    		Footer,
    		Switcher,
    		data: MOCK_DATA
    	});

    	return [];
    }

    class Index4 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Index4",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\routes\Index5.svelte generated by Svelte v3.44.0 */
    const file$7 = "src\\routes\\Index5.svelte";

    function create_fragment$7(ctx) {
    	let navbar;
    	let t0;
    	let section;
    	let div0;
    	let t1;
    	let div5;
    	let div4;
    	let div3;
    	let div2;
    	let div1;
    	let h1;
    	let t3;
    	let p;
    	let t5;
    	let a;
    	let t7;
    	let img;
    	let img_src_value;
    	let t8;
    	let services;
    	let t9;
    	let features;
    	let t10;
    	let pricing;
    	let t11;
    	let team;
    	let t12;
    	let testimonial;
    	let t13;
    	let blog;
    	let t14;
    	let contact;
    	let t15;
    	let footer;
    	let t16;
    	let switcher;
    	let current;
    	navbar = new Navbar({ $$inline: true });

    	services = new Services({
    			props: { serviceData: MOCK_DATA.SERVICE_DATA },
    			$$inline: true
    		});

    	features = new Features({
    			props: { featureData: MOCK_DATA.FEATURES_DATA },
    			$$inline: true
    		});

    	pricing = new Pricing({
    			props: { pricingData: MOCK_DATA.PRICING_DATA },
    			$$inline: true
    		});

    	team = new Team({
    			props: { teamData: MOCK_DATA.TEAM_DATA },
    			$$inline: true
    		});

    	testimonial = new Testimonial({
    			props: { testimonialData: MOCK_DATA.TESATIMONIAL_DATA },
    			$$inline: true
    		});

    	blog = new Blog({
    			props: { blogData: MOCK_DATA.BLOG_DATA },
    			$$inline: true
    		});

    	contact = new Contact({ $$inline: true });
    	footer = new Footer({ $$inline: true });
    	switcher = new Switcher({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			section = element("section");
    			div0 = element("div");
    			t1 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "We help startups launch their products";
    			t3 = space();
    			p = element("p");
    			p.textContent = "Etiam sed.Interdum consequat proin vestibulum class at a euismod\n              mus luctus quam.Lorem ipsum dolor sit amet, consectetur\n              adipisicing eli.";
    			t5 = space();
    			a = element("a");
    			a.textContent = "Get Started";
    			t7 = space();
    			img = element("img");
    			t8 = space();
    			create_component(services.$$.fragment);
    			t9 = space();
    			create_component(features.$$.fragment);
    			t10 = space();
    			create_component(pricing.$$.fragment);
    			t11 = space();
    			create_component(team.$$.fragment);
    			t12 = space();
    			create_component(testimonial.$$.fragment);
    			t13 = space();
    			create_component(blog.$$.fragment);
    			t14 = space();
    			create_component(contact.$$.fragment);
    			t15 = space();
    			create_component(footer.$$.fragment);
    			t16 = space();
    			create_component(switcher.$$.fragment);
    			attr_dev(div0, "class", "bg-overlay");
    			add_location(div0, file$7, 27, 2, 887);
    			attr_dev(h1, "class", "home-title");
    			add_location(h1, file$7, 33, 12, 1126);
    			attr_dev(p, "class", "pt-3 home-desc");
    			add_location(p, file$7, 34, 12, 1205);
    			attr_dev(a, "href", "#");
    			attr_dev(a, "class", "btn btn-primary mt-4");
    			add_location(a, file$7, 39, 12, 1441);
    			if (!src_url_equal(img.src, img_src_value = "images/home-dashboard.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "img-fluid center-block mt-4");
    			add_location(img, file$7, 40, 12, 1512);
    			attr_dev(div1, "class", "col-lg-8 text-white text-center");
    			add_location(div1, file$7, 32, 10, 1068);
    			attr_dev(div2, "class", "row justify-content-center");
    			add_location(div2, file$7, 31, 8, 1017);
    			attr_dev(div3, "class", "container");
    			add_location(div3, file$7, 30, 6, 985);
    			attr_dev(div4, "class", "home-cell-bottom");
    			add_location(div4, file$7, 29, 4, 948);
    			attr_dev(div5, "class", "display-table");
    			add_location(div5, file$7, 28, 2, 916);
    			attr_dev(section, "class", "home-padding-t-150 position-relative common-section");
    			attr_dev(section, "id", "home");
    			set_style(section, "background-image", "url('images/img-2.jpg')");
    			set_style(section, "background-size", "cover");
    			set_style(section, "background-position", "center");
    			add_location(section, file$7, 22, 0, 694);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			append_dev(section, t1);
    			append_dev(section, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, h1);
    			append_dev(div1, t3);
    			append_dev(div1, p);
    			append_dev(div1, t5);
    			append_dev(div1, a);
    			append_dev(div1, t7);
    			append_dev(div1, img);
    			insert_dev(target, t8, anchor);
    			mount_component(services, target, anchor);
    			insert_dev(target, t9, anchor);
    			mount_component(features, target, anchor);
    			insert_dev(target, t10, anchor);
    			mount_component(pricing, target, anchor);
    			insert_dev(target, t11, anchor);
    			mount_component(team, target, anchor);
    			insert_dev(target, t12, anchor);
    			mount_component(testimonial, target, anchor);
    			insert_dev(target, t13, anchor);
    			mount_component(blog, target, anchor);
    			insert_dev(target, t14, anchor);
    			mount_component(contact, target, anchor);
    			insert_dev(target, t15, anchor);
    			mount_component(footer, target, anchor);
    			insert_dev(target, t16, anchor);
    			mount_component(switcher, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(services.$$.fragment, local);
    			transition_in(features.$$.fragment, local);
    			transition_in(pricing.$$.fragment, local);
    			transition_in(team.$$.fragment, local);
    			transition_in(testimonial.$$.fragment, local);
    			transition_in(blog.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			transition_in(switcher.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(services.$$.fragment, local);
    			transition_out(features.$$.fragment, local);
    			transition_out(pricing.$$.fragment, local);
    			transition_out(team.$$.fragment, local);
    			transition_out(testimonial.$$.fragment, local);
    			transition_out(blog.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			transition_out(switcher.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navbar, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(section);
    			if (detaching) detach_dev(t8);
    			destroy_component(services, detaching);
    			if (detaching) detach_dev(t9);
    			destroy_component(features, detaching);
    			if (detaching) detach_dev(t10);
    			destroy_component(pricing, detaching);
    			if (detaching) detach_dev(t11);
    			destroy_component(team, detaching);
    			if (detaching) detach_dev(t12);
    			destroy_component(testimonial, detaching);
    			if (detaching) detach_dev(t13);
    			destroy_component(blog, detaching);
    			if (detaching) detach_dev(t14);
    			destroy_component(contact, detaching);
    			if (detaching) detach_dev(t15);
    			destroy_component(footer, detaching);
    			if (detaching) detach_dev(t16);
    			destroy_component(switcher, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Index5', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Index5> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Navbar,
    		Services,
    		Features,
    		Pricing,
    		Team,
    		Testimonial,
    		Blog,
    		Contact,
    		Footer,
    		Switcher,
    		data: MOCK_DATA
    	});

    	return [];
    }

    class Index5 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Index5",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\routes\Index6.svelte generated by Svelte v3.44.0 */
    const file$6 = "src\\routes\\Index6.svelte";

    function create_fragment$6(ctx) {
    	let navbar;
    	let t0;
    	let section;
    	let div0;
    	let t1;
    	let div6;
    	let div5;
    	let div4;
    	let div3;
    	let div2;
    	let h1;
    	let t3;
    	let p;
    	let t5;
    	let div1;
    	let form;
    	let input;
    	let t6;
    	let button;
    	let t8;
    	let services;
    	let t9;
    	let features;
    	let t10;
    	let pricing;
    	let t11;
    	let team;
    	let t12;
    	let testimonial;
    	let t13;
    	let blog;
    	let t14;
    	let contact;
    	let t15;
    	let footer;
    	let t16;
    	let switcher;
    	let current;
    	navbar = new Navbar({ $$inline: true });

    	services = new Services({
    			props: { serviceData: MOCK_DATA.SERVICE_DATA },
    			$$inline: true
    		});

    	features = new Features({
    			props: { featureData: MOCK_DATA.FEATURES_DATA },
    			$$inline: true
    		});

    	pricing = new Pricing({
    			props: { pricingData: MOCK_DATA.PRICING_DATA },
    			$$inline: true
    		});

    	team = new Team({
    			props: { teamData: MOCK_DATA.TEAM_DATA },
    			$$inline: true
    		});

    	testimonial = new Testimonial({
    			props: { testimonialData: MOCK_DATA.TESATIMONIAL_DATA },
    			$$inline: true
    		});

    	blog = new Blog({
    			props: { blogData: MOCK_DATA.BLOG_DATA },
    			$$inline: true
    		});

    	contact = new Contact({ $$inline: true });
    	footer = new Footer({ $$inline: true });
    	switcher = new Switcher({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			section = element("section");
    			div0 = element("div");
    			t1 = space();
    			div6 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			h1 = element("h1");
    			h1.textContent = "We help startups launch their products";
    			t3 = space();
    			p = element("p");
    			p.textContent = "Etiam sed.Interdum consequat proin vestibulum class at a euismod\n              mus luctus quam.Lorem ipsum dolor sit amet, consectetur\n              adipisicing eli.";
    			t5 = space();
    			div1 = element("div");
    			form = element("form");
    			input = element("input");
    			t6 = space();
    			button = element("button");
    			button.textContent = "Subscribe";
    			t8 = space();
    			create_component(services.$$.fragment);
    			t9 = space();
    			create_component(features.$$.fragment);
    			t10 = space();
    			create_component(pricing.$$.fragment);
    			t11 = space();
    			create_component(team.$$.fragment);
    			t12 = space();
    			create_component(testimonial.$$.fragment);
    			t13 = space();
    			create_component(blog.$$.fragment);
    			t14 = space();
    			create_component(contact.$$.fragment);
    			t15 = space();
    			create_component(footer.$$.fragment);
    			t16 = space();
    			create_component(switcher.$$.fragment);
    			attr_dev(div0, "class", "bg-overlay");
    			add_location(div0, file$6, 21, 2, 763);
    			attr_dev(h1, "class", "home-title");
    			add_location(h1, file$6, 27, 12, 1002);
    			attr_dev(p, "class", "pt-3 home-desc");
    			add_location(p, file$6, 28, 12, 1081);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Email");
    			add_location(input, file$6, 35, 16, 1411);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "btn btn-primary");
    			add_location(button, file$6, 36, 16, 1469);
    			attr_dev(form, "action", "#");
    			add_location(form, file$6, 34, 14, 1377);
    			attr_dev(div1, "class", "text-center subscribe-form mt-5");
    			add_location(div1, file$6, 33, 12, 1317);
    			attr_dev(div2, "class", "col-lg-8 text-white text-center");
    			add_location(div2, file$6, 26, 10, 944);
    			attr_dev(div3, "class", "row justify-content-center");
    			add_location(div3, file$6, 25, 8, 893);
    			attr_dev(div4, "class", "container");
    			add_location(div4, file$6, 24, 6, 861);
    			attr_dev(div5, "class", "home-cell-bottom");
    			add_location(div5, file$6, 23, 4, 824);
    			attr_dev(div6, "class", "display-table");
    			add_location(div6, file$6, 22, 2, 792);
    			attr_dev(section, "class", "section bg-home home-half common-section");
    			attr_dev(section, "id", "home");
    			add_location(section, file$6, 20, 0, 692);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			append_dev(section, t1);
    			append_dev(section, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, h1);
    			append_dev(div2, t3);
    			append_dev(div2, p);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			append_dev(div1, form);
    			append_dev(form, input);
    			append_dev(form, t6);
    			append_dev(form, button);
    			insert_dev(target, t8, anchor);
    			mount_component(services, target, anchor);
    			insert_dev(target, t9, anchor);
    			mount_component(features, target, anchor);
    			insert_dev(target, t10, anchor);
    			mount_component(pricing, target, anchor);
    			insert_dev(target, t11, anchor);
    			mount_component(team, target, anchor);
    			insert_dev(target, t12, anchor);
    			mount_component(testimonial, target, anchor);
    			insert_dev(target, t13, anchor);
    			mount_component(blog, target, anchor);
    			insert_dev(target, t14, anchor);
    			mount_component(contact, target, anchor);
    			insert_dev(target, t15, anchor);
    			mount_component(footer, target, anchor);
    			insert_dev(target, t16, anchor);
    			mount_component(switcher, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(services.$$.fragment, local);
    			transition_in(features.$$.fragment, local);
    			transition_in(pricing.$$.fragment, local);
    			transition_in(team.$$.fragment, local);
    			transition_in(testimonial.$$.fragment, local);
    			transition_in(blog.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			transition_in(switcher.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(services.$$.fragment, local);
    			transition_out(features.$$.fragment, local);
    			transition_out(pricing.$$.fragment, local);
    			transition_out(team.$$.fragment, local);
    			transition_out(testimonial.$$.fragment, local);
    			transition_out(blog.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			transition_out(switcher.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navbar, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(section);
    			if (detaching) detach_dev(t8);
    			destroy_component(services, detaching);
    			if (detaching) detach_dev(t9);
    			destroy_component(features, detaching);
    			if (detaching) detach_dev(t10);
    			destroy_component(pricing, detaching);
    			if (detaching) detach_dev(t11);
    			destroy_component(team, detaching);
    			if (detaching) detach_dev(t12);
    			destroy_component(testimonial, detaching);
    			if (detaching) detach_dev(t13);
    			destroy_component(blog, detaching);
    			if (detaching) detach_dev(t14);
    			destroy_component(contact, detaching);
    			if (detaching) detach_dev(t15);
    			destroy_component(footer, detaching);
    			if (detaching) detach_dev(t16);
    			destroy_component(switcher, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Index6', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Index6> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Navbar,
    		Services,
    		Features,
    		Pricing,
    		Team,
    		Testimonial,
    		Blog,
    		Contact,
    		Footer,
    		Switcher,
    		data: MOCK_DATA
    	});

    	return [];
    }

    class Index6 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Index6",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\routes\Index7.svelte generated by Svelte v3.44.0 */

    const { console: console_1 } = globals;
    const file$5 = "src\\routes\\Index7.svelte";

    // (79:14) <ModalBody>
    function create_default_slot_1$4(ctx) {
    	let video;
    	let track;
    	let video_src_value;

    	const block = {
    		c: function create() {
    			video = element("video");
    			track = element("track");
    			track.default = true;
    			attr_dev(track, "kind", "captions");
    			attr_dev(track, "type", "video/mp4");
    			add_location(track, file$5, 85, 18, 2702);
    			attr_dev(video, "id", "VisaChipCardVideo");
    			attr_dev(video, "class", "video-box");
    			if (!src_url_equal(video.src, video_src_value = "https://www.w3schools.com/html/mov_bbb.mp4")) attr_dev(video, "src", video_src_value);
    			video.controls = true;
    			add_location(video, file$5, 79, 16, 2488);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, video, anchor);
    			append_dev(video, track);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(video);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(79:14) <ModalBody>",
    		ctx
    	});

    	return block;
    }

    // (77:12) <Modal isOpen={open} {toggle} size="lg">
    function create_default_slot$4(ctx) {
    	let modalheader;
    	let t;
    	let modalbody;
    	let current;

    	modalheader = new ModalHeader({
    			props: { toggle: /*toggle*/ ctx[1] },
    			$$inline: true
    		});

    	modalbody = new ModalBody({
    			props: {
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modalheader.$$.fragment);
    			t = space();
    			create_component(modalbody.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modalheader, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(modalbody, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modalbody_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				modalbody_changes.$$scope = { dirty, ctx };
    			}

    			modalbody.$set(modalbody_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modalheader.$$.fragment, local);
    			transition_in(modalbody.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modalheader.$$.fragment, local);
    			transition_out(modalbody.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modalheader, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(modalbody, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(77:12) <Modal isOpen={open} {toggle} size=\\\"lg\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let navbar;
    	let t0;
    	let section;
    	let div0;
    	let t1;
    	let div6;
    	let div5;
    	let div4;
    	let div3;
    	let div2;
    	let h1;
    	let div1;
    	let span;
    	let t3;
    	let p0;
    	let t5;
    	let p1;
    	let a;
    	let i;
    	let t6;
    	let modal;
    	let t7;
    	let services;
    	let t8;
    	let features;
    	let t9;
    	let pricing;
    	let t10;
    	let team;
    	let t11;
    	let testimonial;
    	let t12;
    	let blog;
    	let t13;
    	let contact;
    	let t14;
    	let footer;
    	let t15;
    	let switcher;
    	let current;
    	let mounted;
    	let dispose;
    	navbar = new Navbar({ $$inline: true });

    	modal = new Modal({
    			props: {
    				isOpen: /*open*/ ctx[0],
    				toggle: /*toggle*/ ctx[1],
    				size: "lg",
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	services = new Services({
    			props: { serviceData: MOCK_DATA.SERVICE_DATA },
    			$$inline: true
    		});

    	features = new Features({
    			props: { featureData: MOCK_DATA.FEATURES_DATA },
    			$$inline: true
    		});

    	pricing = new Pricing({
    			props: { pricingData: MOCK_DATA.PRICING_DATA },
    			$$inline: true
    		});

    	team = new Team({
    			props: { teamData: MOCK_DATA.TEAM_DATA },
    			$$inline: true
    		});

    	testimonial = new Testimonial({
    			props: { testimonialData: MOCK_DATA.TESATIMONIAL_DATA },
    			$$inline: true
    		});

    	blog = new Blog({
    			props: { blogData: MOCK_DATA.BLOG_DATA },
    			$$inline: true
    		});

    	contact = new Contact({ $$inline: true });
    	footer = new Footer({ $$inline: true });
    	switcher = new Switcher({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			section = element("section");
    			div0 = element("div");
    			t1 = space();
    			div6 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			h1 = element("h1");
    			div1 = element("div");
    			span = element("span");
    			span.textContent = "transitions!";
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "Etiam sed.Interdum consequat proin vestibulum class at a euismod\n              mus luctus quam.Lorem ipsum dolor sit amet, consectetur\n              adipisicing eli.";
    			t5 = space();
    			p1 = element("p");
    			a = element("a");
    			i = element("i");
    			t6 = space();
    			create_component(modal.$$.fragment);
    			t7 = space();
    			create_component(services.$$.fragment);
    			t8 = space();
    			create_component(features.$$.fragment);
    			t9 = space();
    			create_component(pricing.$$.fragment);
    			t10 = space();
    			create_component(team.$$.fragment);
    			t11 = space();
    			create_component(testimonial.$$.fragment);
    			t12 = space();
    			create_component(blog.$$.fragment);
    			t13 = space();
    			create_component(contact.$$.fragment);
    			t14 = space();
    			create_component(footer.$$.fragment);
    			t15 = space();
    			create_component(switcher.$$.fragment);
    			attr_dev(div0, "class", "bg-overlay");
    			add_location(div0, file$5, 55, 2, 1511);
    			attr_dev(span, "id", "target");
    			add_location(span, file$5, 63, 16, 1829);
    			attr_dev(div1, "class", "centered");
    			add_location(div1, file$5, 62, 14, 1790);
    			attr_dev(h1, "class", "home-title");
    			add_location(h1, file$5, 61, 12, 1752);
    			attr_dev(p0, "class", "pt-3 home-desc");
    			add_location(p0, file$5, 66, 12, 1918);
    			attr_dev(i, "class", "mdi mdi-play text-center");
    			add_location(i, file$5, 73, 17, 2279);
    			attr_dev(a, "href", "#");
    			attr_dev(a, "class", "play-btn video-play-icon");
    			add_location(a, file$5, 72, 14, 2215);
    			attr_dev(p1, "class", "play-shadow mt-4");
    			add_location(p1, file$5, 71, 12, 2154);
    			attr_dev(div2, "class", "col-lg-8 text-white text-center");
    			add_location(div2, file$5, 60, 10, 1694);
    			attr_dev(div3, "class", "row justify-content-center");
    			add_location(div3, file$5, 59, 8, 1643);
    			attr_dev(div4, "class", "container");
    			add_location(div4, file$5, 58, 6, 1611);
    			attr_dev(div5, "class", "display-table-cell");
    			add_location(div5, file$5, 57, 4, 1572);
    			attr_dev(div6, "class", "display-table");
    			add_location(div6, file$5, 56, 2, 1540);
    			attr_dev(section, "class", "section section-lg vh-100 common-section");
    			attr_dev(section, "id", "home");
    			set_style(section, "background-image", "url('images/img-1.jpg')");
    			set_style(section, "background-size", "cover");
    			set_style(section, "background-position", "center");
    			add_location(section, file$5, 50, 0, 1329);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			append_dev(section, t1);
    			append_dev(section, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, h1);
    			append_dev(h1, div1);
    			append_dev(div1, span);
    			append_dev(div2, t3);
    			append_dev(div2, p0);
    			append_dev(div2, t5);
    			append_dev(div2, p1);
    			append_dev(p1, a);
    			append_dev(a, i);
    			append_dev(div2, t6);
    			mount_component(modal, div2, null);
    			insert_dev(target, t7, anchor);
    			mount_component(services, target, anchor);
    			insert_dev(target, t8, anchor);
    			mount_component(features, target, anchor);
    			insert_dev(target, t9, anchor);
    			mount_component(pricing, target, anchor);
    			insert_dev(target, t10, anchor);
    			mount_component(team, target, anchor);
    			insert_dev(target, t11, anchor);
    			mount_component(testimonial, target, anchor);
    			insert_dev(target, t12, anchor);
    			mount_component(blog, target, anchor);
    			insert_dev(target, t13, anchor);
    			mount_component(contact, target, anchor);
    			insert_dev(target, t14, anchor);
    			mount_component(footer, target, anchor);
    			insert_dev(target, t15, anchor);
    			mount_component(switcher, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(p1, "click", /*toggle*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};
    			if (dirty & /*open*/ 1) modal_changes.isOpen = /*open*/ ctx[0];

    			if (dirty & /*$$scope*/ 8) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(modal.$$.fragment, local);
    			transition_in(services.$$.fragment, local);
    			transition_in(features.$$.fragment, local);
    			transition_in(pricing.$$.fragment, local);
    			transition_in(team.$$.fragment, local);
    			transition_in(testimonial.$$.fragment, local);
    			transition_in(blog.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			transition_in(switcher.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(modal.$$.fragment, local);
    			transition_out(services.$$.fragment, local);
    			transition_out(features.$$.fragment, local);
    			transition_out(pricing.$$.fragment, local);
    			transition_out(team.$$.fragment, local);
    			transition_out(testimonial.$$.fragment, local);
    			transition_out(blog.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			transition_out(switcher.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navbar, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(section);
    			destroy_component(modal);
    			if (detaching) detach_dev(t7);
    			destroy_component(services, detaching);
    			if (detaching) detach_dev(t8);
    			destroy_component(features, detaching);
    			if (detaching) detach_dev(t9);
    			destroy_component(pricing, detaching);
    			if (detaching) detach_dev(t10);
    			destroy_component(team, detaching);
    			if (detaching) detach_dev(t11);
    			destroy_component(testimonial, detaching);
    			if (detaching) detach_dev(t12);
    			destroy_component(blog, detaching);
    			if (detaching) detach_dev(t13);
    			destroy_component(contact, detaching);
    			if (detaching) detach_dev(t14);
    			destroy_component(footer, detaching);
    			if (detaching) detach_dev(t15);
    			destroy_component(switcher, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Index7', slots, []);
    	const text_rotate = new Array("Professional Landing Page Template", "We help startups launch their products", "Perfect solution for small businesses");

    	onMount(() => {
    		let i = 0;

    		function changeText() {
    			document.getElementById("target").innerHTML = text_rotate[i];
    			i = i < text_rotate.length - 1 ? i + 1 : 0;
    			console.log(i);

    			setTimeout(
    				() => {
    					changeText();
    				},
    				3000
    			);
    		}

    		changeText();
    	});

    	let open = false;

    	const toggle = () => {
    		$$invalidate(0, open = !open);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Index7> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Modal,
    		ModalBody,
    		ModalHeader,
    		Navbar,
    		Services,
    		Features,
    		Pricing,
    		Team,
    		Testimonial,
    		Blog,
    		Contact,
    		Footer,
    		Switcher,
    		data: MOCK_DATA,
    		text_rotate,
    		open,
    		toggle
    	});

    	$$self.$inject_state = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [open, toggle];
    }

    class Index7 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Index7",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\routes\Index8.svelte generated by Svelte v3.44.0 */
    const file$4 = "src\\routes\\Index8.svelte";

    function create_fragment$4(ctx) {
    	let navbar;
    	let t0;
    	let section;
    	let div0;
    	let t1;
    	let div6;
    	let div5;
    	let div4;
    	let div3;
    	let div2;
    	let h1;
    	let t3;
    	let p;
    	let t5;
    	let div1;
    	let iframe;
    	let iframe_src_value;
    	let t6;
    	let services;
    	let t7;
    	let features;
    	let t8;
    	let pricing;
    	let t9;
    	let team;
    	let t10;
    	let testimonial;
    	let t11;
    	let blog;
    	let t12;
    	let contact;
    	let t13;
    	let footer;
    	let t14;
    	let switcher;
    	let current;
    	navbar = new Navbar({ $$inline: true });

    	services = new Services({
    			props: { serviceData: MOCK_DATA.SERVICE_DATA },
    			$$inline: true
    		});

    	features = new Features({
    			props: { featureData: MOCK_DATA.FEATURES_DATA },
    			$$inline: true
    		});

    	pricing = new Pricing({
    			props: { pricingData: MOCK_DATA.PRICING_DATA },
    			$$inline: true
    		});

    	team = new Team({
    			props: { teamData: MOCK_DATA.TEAM_DATA },
    			$$inline: true
    		});

    	testimonial = new Testimonial({
    			props: { testimonialData: MOCK_DATA.TESATIMONIAL_DATA },
    			$$inline: true
    		});

    	blog = new Blog({
    			props: { blogData: MOCK_DATA.BLOG_DATA },
    			$$inline: true
    		});

    	contact = new Contact({ $$inline: true });
    	footer = new Footer({ $$inline: true });
    	switcher = new Switcher({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			section = element("section");
    			div0 = element("div");
    			t1 = space();
    			div6 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			h1 = element("h1");
    			h1.textContent = "We help startups launch their products";
    			t3 = space();
    			p = element("p");
    			p.textContent = "Etiam sed.Interdum consequat proin vestibulum class at a euismod\n              mus luctus quam.Lorem ipsum dolor sit amet, consectetur\n              adipisicing eli.";
    			t5 = space();
    			div1 = element("div");
    			iframe = element("iframe");
    			t6 = space();
    			create_component(services.$$.fragment);
    			t7 = space();
    			create_component(features.$$.fragment);
    			t8 = space();
    			create_component(pricing.$$.fragment);
    			t9 = space();
    			create_component(team.$$.fragment);
    			t10 = space();
    			create_component(testimonial.$$.fragment);
    			t11 = space();
    			create_component(blog.$$.fragment);
    			t12 = space();
    			create_component(contact.$$.fragment);
    			t13 = space();
    			create_component(footer.$$.fragment);
    			t14 = space();
    			create_component(switcher.$$.fragment);
    			attr_dev(div0, "class", "bg-overlay");
    			add_location(div0, file$4, 27, 2, 860);
    			attr_dev(h1, "class", "home-title");
    			add_location(h1, file$4, 33, 12, 1099);
    			attr_dev(p, "class", "pt-3 home-desc");
    			add_location(p, file$4, 34, 12, 1178);
    			attr_dev(iframe, "title", "frame-video");
    			if (!src_url_equal(iframe.src, iframe_src_value = "http://player.vimeo.com/video/69988283?color=f15b72&title=0&byline=0&portrait=0")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "width", "555");
    			attr_dev(iframe, "height", "321");
    			attr_dev(iframe, "class", "frame-border");
    			add_location(iframe, file$4, 40, 14, 1447);
    			attr_dev(div1, "class", "mt-4");
    			add_location(div1, file$4, 39, 12, 1414);
    			attr_dev(div2, "class", "col-lg-8 text-white text-center");
    			add_location(div2, file$4, 32, 10, 1041);
    			attr_dev(div3, "class", "row justify-content-center");
    			add_location(div3, file$4, 31, 8, 990);
    			attr_dev(div4, "class", "container");
    			add_location(div4, file$4, 30, 6, 958);
    			attr_dev(div5, "class", "home-cell-bottom");
    			add_location(div5, file$4, 29, 4, 921);
    			attr_dev(div6, "class", "display-table");
    			add_location(div6, file$4, 28, 2, 889);
    			attr_dev(section, "class", "section section-lg home-half common-section");
    			attr_dev(section, "id", "home");
    			set_style(section, "background-image", "url('images/img-2.jpg')");
    			set_style(section, "background-size", "cover");
    			set_style(section, "background-position", "center");
    			add_location(section, file$4, 22, 0, 675);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			append_dev(section, t1);
    			append_dev(section, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, h1);
    			append_dev(div2, t3);
    			append_dev(div2, p);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			append_dev(div1, iframe);
    			insert_dev(target, t6, anchor);
    			mount_component(services, target, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(features, target, anchor);
    			insert_dev(target, t8, anchor);
    			mount_component(pricing, target, anchor);
    			insert_dev(target, t9, anchor);
    			mount_component(team, target, anchor);
    			insert_dev(target, t10, anchor);
    			mount_component(testimonial, target, anchor);
    			insert_dev(target, t11, anchor);
    			mount_component(blog, target, anchor);
    			insert_dev(target, t12, anchor);
    			mount_component(contact, target, anchor);
    			insert_dev(target, t13, anchor);
    			mount_component(footer, target, anchor);
    			insert_dev(target, t14, anchor);
    			mount_component(switcher, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(services.$$.fragment, local);
    			transition_in(features.$$.fragment, local);
    			transition_in(pricing.$$.fragment, local);
    			transition_in(team.$$.fragment, local);
    			transition_in(testimonial.$$.fragment, local);
    			transition_in(blog.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			transition_in(switcher.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(services.$$.fragment, local);
    			transition_out(features.$$.fragment, local);
    			transition_out(pricing.$$.fragment, local);
    			transition_out(team.$$.fragment, local);
    			transition_out(testimonial.$$.fragment, local);
    			transition_out(blog.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			transition_out(switcher.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navbar, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(section);
    			if (detaching) detach_dev(t6);
    			destroy_component(services, detaching);
    			if (detaching) detach_dev(t7);
    			destroy_component(features, detaching);
    			if (detaching) detach_dev(t8);
    			destroy_component(pricing, detaching);
    			if (detaching) detach_dev(t9);
    			destroy_component(team, detaching);
    			if (detaching) detach_dev(t10);
    			destroy_component(testimonial, detaching);
    			if (detaching) detach_dev(t11);
    			destroy_component(blog, detaching);
    			if (detaching) detach_dev(t12);
    			destroy_component(contact, detaching);
    			if (detaching) detach_dev(t13);
    			destroy_component(footer, detaching);
    			if (detaching) detach_dev(t14);
    			destroy_component(switcher, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Index8', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Index8> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Navbar,
    		Services,
    		Features,
    		Pricing,
    		Team,
    		Testimonial,
    		Blog,
    		Contact,
    		Footer,
    		Switcher,
    		data: MOCK_DATA
    	});

    	return [];
    }

    class Index8 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Index8",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\routes\login.svelte generated by Svelte v3.44.0 */
    const file$3 = "src\\routes\\login.svelte";

    // (7:2) <Link to="/" class="text-white">
    function create_default_slot_2$2(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "mdi mdi-home h1");
    			add_location(i, file$3, 6, 34, 169);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(7:2) <Link to=\\\"/\\\" class=\\\"text-white\\\">",
    		ctx
    	});

    	return block;
    }

    // (20:20) <Link                       to="/"                       class="text-dark text-uppercase account-pages-logo"                       >
    function create_default_slot_1$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Dorsin");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(20:20) <Link                       to=\\\"/\\\"                       class=\\\"text-dark text-uppercase account-pages-logo\\\"                       >",
    		ctx
    	});

    	return block;
    }

    // (69:22) <Link to="/password_forget" class="text-dark"                         >
    function create_default_slot$3(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Forgot your password?");
    			attr_dev(i, "class", "mdi mdi-lock");
    			add_location(i, file$3, 69, 25, 2498);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(69:22) <Link to=\\\"/password_forget\\\" class=\\\"text-dark\\\"                         >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div0;
    	let link0;
    	let t0;
    	let section;
    	let div14;
    	let div13;
    	let div12;
    	let div11;
    	let div10;
    	let div9;
    	let div8;
    	let div1;
    	let h3;
    	let link1;
    	let t1;
    	let p;
    	let t3;
    	let div7;
    	let form;
    	let div2;
    	let label0;
    	let t5;
    	let input0;
    	let t6;
    	let div3;
    	let label1;
    	let t8;
    	let input1;
    	let t9;
    	let div4;
    	let input2;
    	let t10;
    	let label2;
    	let t12;
    	let div5;
    	let button;
    	let t14;
    	let div6;
    	let link2;
    	let current;

    	link0 = new Link({
    			props: {
    				to: "/",
    				class: "text-white",
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link({
    			props: {
    				to: "/",
    				class: "text-dark text-uppercase account-pages-logo",
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link({
    			props: {
    				to: "/password_forget",
    				class: "text-dark",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(link0.$$.fragment);
    			t0 = space();
    			section = element("section");
    			div14 = element("div");
    			div13 = element("div");
    			div12 = element("div");
    			div11 = element("div");
    			div10 = element("div");
    			div9 = element("div");
    			div8 = element("div");
    			div1 = element("div");
    			h3 = element("h3");
    			create_component(link1.$$.fragment);
    			t1 = space();
    			p = element("p");
    			p.textContent = "Sign in to continue to Dorsin.";
    			t3 = space();
    			div7 = element("div");
    			form = element("form");
    			div2 = element("div");
    			label0 = element("label");
    			label0.textContent = "Username";
    			t5 = space();
    			input0 = element("input");
    			t6 = space();
    			div3 = element("div");
    			label1 = element("label");
    			label1.textContent = "Password";
    			t8 = space();
    			input1 = element("input");
    			t9 = space();
    			div4 = element("div");
    			input2 = element("input");
    			t10 = space();
    			label2 = element("label");
    			label2.textContent = "Remember me";
    			t12 = space();
    			div5 = element("div");
    			button = element("button");
    			button.textContent = "Log In";
    			t14 = space();
    			div6 = element("div");
    			create_component(link2.$$.fragment);
    			attr_dev(div0, "class", "account-home-btn d-none d-sm-block");
    			add_location(div0, file$3, 5, 0, 86);
    			attr_dev(h3, "class", "fw-bold");
    			add_location(h3, file$3, 18, 18, 582);
    			attr_dev(p, "class", "text-muted");
    			add_location(p, file$3, 25, 18, 832);
    			attr_dev(div1, "class", "text-center mt-3");
    			add_location(div1, file$3, 17, 16, 533);
    			attr_dev(label0, "for", "username");
    			add_location(label0, file$3, 30, 22, 1038);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "id", "username");
    			attr_dev(input0, "placeholder", "Enter username");
    			add_location(input0, file$3, 31, 22, 1099);
    			attr_dev(div2, "class", "form-group");
    			add_location(div2, file$3, 29, 20, 991);
    			attr_dev(label1, "for", "userpassword");
    			add_location(label1, file$3, 40, 22, 1398);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "userpassword");
    			attr_dev(input1, "placeholder", "Enter password");
    			add_location(input1, file$3, 41, 22, 1463);
    			attr_dev(div3, "class", "form-group");
    			add_location(div3, file$3, 39, 20, 1351);
    			attr_dev(input2, "class", "form-check-input");
    			attr_dev(input2, "type", "checkbox");
    			input2.value = "";
    			attr_dev(input2, "id", "flexCheckDefault");
    			add_location(input2, file$3, 50, 22, 1770);
    			attr_dev(label2, "class", "form-check-label");
    			attr_dev(label2, "for", "flexCheckDefault");
    			add_location(label2, file$3, 56, 22, 1992);
    			attr_dev(div4, "class", "form-check");
    			add_location(div4, file$3, 49, 20, 1723);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "btn btn-primary");
    			add_location(button, file$3, 62, 22, 2211);
    			attr_dev(div5, "class", "d-grid mt-3");
    			add_location(div5, file$3, 61, 20, 2163);
    			attr_dev(div6, "class", "mt-4 mb-0 text-center");
    			add_location(div6, file$3, 67, 20, 2369);
    			add_location(form, file$3, 28, 18, 964);
    			attr_dev(div7, "class", "p-3");
    			add_location(div7, file$3, 27, 16, 928);
    			attr_dev(div8, "class", "card-body");
    			add_location(div8, file$3, 16, 14, 493);
    			attr_dev(div9, "class", "card account-card");
    			add_location(div9, file$3, 15, 12, 447);
    			attr_dev(div10, "class", "col-lg-5");
    			add_location(div10, file$3, 14, 10, 412);
    			attr_dev(div11, "class", "row justify-content-center");
    			add_location(div11, file$3, 13, 8, 361);
    			attr_dev(div12, "class", "container");
    			add_location(div12, file$3, 12, 6, 329);
    			attr_dev(div13, "class", "display-table-cell");
    			add_location(div13, file$3, 11, 4, 290);
    			attr_dev(div14, "class", "display-table");
    			add_location(div14, file$3, 10, 2, 258);
    			attr_dev(section, "class", "bg-account-pages vh-100");
    			add_location(section, file$3, 9, 0, 214);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(link0, div0, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, section, anchor);
    			append_dev(section, div14);
    			append_dev(div14, div13);
    			append_dev(div13, div12);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			append_dev(div8, div1);
    			append_dev(div1, h3);
    			mount_component(link1, h3, null);
    			append_dev(div1, t1);
    			append_dev(div1, p);
    			append_dev(div8, t3);
    			append_dev(div8, div7);
    			append_dev(div7, form);
    			append_dev(form, div2);
    			append_dev(div2, label0);
    			append_dev(div2, t5);
    			append_dev(div2, input0);
    			append_dev(form, t6);
    			append_dev(form, div3);
    			append_dev(div3, label1);
    			append_dev(div3, t8);
    			append_dev(div3, input1);
    			append_dev(form, t9);
    			append_dev(form, div4);
    			append_dev(div4, input2);
    			append_dev(div4, t10);
    			append_dev(div4, label2);
    			append_dev(form, t12);
    			append_dev(form, div5);
    			append_dev(div5, button);
    			append_dev(form, t14);
    			append_dev(form, div6);
    			mount_component(link2, div6, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(link0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(section);
    			destroy_component(link1);
    			destroy_component(link2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link });
    	return [];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\routes\signup.svelte generated by Svelte v3.44.0 */
    const file$2 = "src\\routes\\signup.svelte";

    // (7:2) <Link to="/" class="text-white">
    function create_default_slot_2$1(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "mdi mdi-home h1");
    			add_location(i, file$2, 6, 34, 170);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(7:2) <Link to=\\\"/\\\" class=\\\"text-white\\\">",
    		ctx
    	});

    	return block;
    }

    // (20:20) <Link                       to="/"                       class="text-dark text-uppercase account-pages-logo"                       >
    function create_default_slot_1$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Dorsin");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(20:20) <Link                       to=\\\"/\\\"                       class=\\\"text-dark text-uppercase account-pages-logo\\\"                       >",
    		ctx
    	});

    	return block;
    }

    // (80:48) <Link                           to="/login"                           class="text-danger">
    function create_default_slot$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Sign in");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(80:48) <Link                           to=\\\"/login\\\"                           class=\\\"text-danger\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div0;
    	let link0;
    	let t0;
    	let section;
    	let div15;
    	let div14;
    	let div13;
    	let div12;
    	let div11;
    	let div10;
    	let div9;
    	let div1;
    	let h3;
    	let link1;
    	let t1;
    	let p0;
    	let t3;
    	let div8;
    	let form;
    	let div2;
    	let label0;
    	let t5;
    	let input0;
    	let t6;
    	let div3;
    	let label1;
    	let t8;
    	let input1;
    	let t9;
    	let div4;
    	let label2;
    	let t11;
    	let input2;
    	let t12;
    	let div5;
    	let input3;
    	let t13;
    	let label3;
    	let t15;
    	let div6;
    	let button;
    	let t17;
    	let div7;
    	let p1;
    	let t18;
    	let link2;
    	let current;

    	link0 = new Link({
    			props: {
    				to: "/",
    				class: "text-white",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link({
    			props: {
    				to: "/",
    				class: "text-dark text-uppercase account-pages-logo",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link({
    			props: {
    				to: "/login",
    				class: "text-danger",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(link0.$$.fragment);
    			t0 = space();
    			section = element("section");
    			div15 = element("div");
    			div14 = element("div");
    			div13 = element("div");
    			div12 = element("div");
    			div11 = element("div");
    			div10 = element("div");
    			div9 = element("div");
    			div1 = element("div");
    			h3 = element("h3");
    			create_component(link1.$$.fragment);
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Sign up for a new Account";
    			t3 = space();
    			div8 = element("div");
    			form = element("form");
    			div2 = element("div");
    			label0 = element("label");
    			label0.textContent = "First Name";
    			t5 = space();
    			input0 = element("input");
    			t6 = space();
    			div3 = element("div");
    			label1 = element("label");
    			label1.textContent = "Email";
    			t8 = space();
    			input1 = element("input");
    			t9 = space();
    			div4 = element("div");
    			label2 = element("label");
    			label2.textContent = "Password";
    			t11 = space();
    			input2 = element("input");
    			t12 = space();
    			div5 = element("div");
    			input3 = element("input");
    			t13 = space();
    			label3 = element("label");
    			label3.textContent = "Remember me";
    			t15 = space();
    			div6 = element("div");
    			button = element("button");
    			button.textContent = "Sign in";
    			t17 = space();
    			div7 = element("div");
    			p1 = element("p");
    			t18 = text("Don't have an account ? ");
    			create_component(link2.$$.fragment);
    			attr_dev(div0, "class", "account-home-btn d-none d-sm-block");
    			add_location(div0, file$2, 5, 0, 87);
    			attr_dev(h3, "class", "fw-bold");
    			add_location(h3, file$2, 18, 18, 583);
    			attr_dev(p0, "class", "text-muted");
    			add_location(p0, file$2, 25, 18, 833);
    			attr_dev(div1, "class", "text-center mt-3");
    			add_location(div1, file$2, 17, 16, 534);
    			attr_dev(label0, "for", "firstname");
    			add_location(label0, file$2, 30, 22, 1034);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "id", "firstname");
    			attr_dev(input0, "placeholder", "First Name");
    			add_location(input0, file$2, 31, 22, 1098);
    			attr_dev(div2, "class", "form-group");
    			add_location(div2, file$2, 29, 20, 987);
    			attr_dev(label1, "for", "email");
    			add_location(label1, file$2, 40, 22, 1394);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "email");
    			attr_dev(input1, "placeholder", "Enter Email");
    			add_location(input1, file$2, 41, 22, 1449);
    			attr_dev(div3, "class", "form-group");
    			add_location(div3, file$2, 39, 20, 1347);
    			attr_dev(label2, "for", "userpassword");
    			add_location(label2, file$2, 50, 22, 1746);
    			attr_dev(input2, "type", "password");
    			attr_dev(input2, "class", "form-control");
    			attr_dev(input2, "id", "userpassword");
    			attr_dev(input2, "placeholder", "Enter password");
    			add_location(input2, file$2, 51, 22, 1811);
    			attr_dev(div4, "class", "form-group");
    			add_location(div4, file$2, 49, 20, 1699);
    			attr_dev(input3, "class", "form-check-input");
    			attr_dev(input3, "type", "checkbox");
    			input3.value = "";
    			attr_dev(input3, "id", "flexCheckDefault");
    			add_location(input3, file$2, 60, 22, 2118);
    			attr_dev(label3, "class", "form-check-label");
    			attr_dev(label3, "for", "flexCheckDefault");
    			add_location(label3, file$2, 66, 22, 2340);
    			attr_dev(div5, "class", "form-check");
    			add_location(div5, file$2, 59, 20, 2071);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "btn btn-primary");
    			add_location(button, file$2, 72, 22, 2559);
    			attr_dev(div6, "class", "d-grid mt-3");
    			add_location(div6, file$2, 71, 20, 2511);
    			attr_dev(p1, "class", "mb-0");
    			add_location(p1, file$2, 78, 22, 2776);
    			attr_dev(div7, "class", "mt-4 mb-0 text-center");
    			add_location(div7, file$2, 77, 20, 2718);
    			add_location(form, file$2, 28, 18, 960);
    			attr_dev(div8, "class", "p-3");
    			add_location(div8, file$2, 27, 16, 924);
    			attr_dev(div9, "class", "card-body");
    			add_location(div9, file$2, 16, 14, 494);
    			attr_dev(div10, "class", "card account-card");
    			add_location(div10, file$2, 15, 12, 448);
    			attr_dev(div11, "class", "col-lg-5");
    			add_location(div11, file$2, 14, 10, 413);
    			attr_dev(div12, "class", "row justify-content-center");
    			add_location(div12, file$2, 13, 8, 362);
    			attr_dev(div13, "class", "container");
    			add_location(div13, file$2, 12, 6, 330);
    			attr_dev(div14, "class", "display-table-cell");
    			add_location(div14, file$2, 11, 4, 291);
    			attr_dev(div15, "class", "display-table");
    			add_location(div15, file$2, 10, 2, 259);
    			attr_dev(section, "class", "bg-account-pages vh-100");
    			add_location(section, file$2, 9, 0, 215);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(link0, div0, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, section, anchor);
    			append_dev(section, div15);
    			append_dev(div15, div14);
    			append_dev(div14, div13);
    			append_dev(div13, div12);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div9, div1);
    			append_dev(div1, h3);
    			mount_component(link1, h3, null);
    			append_dev(div1, t1);
    			append_dev(div1, p0);
    			append_dev(div9, t3);
    			append_dev(div9, div8);
    			append_dev(div8, form);
    			append_dev(form, div2);
    			append_dev(div2, label0);
    			append_dev(div2, t5);
    			append_dev(div2, input0);
    			append_dev(form, t6);
    			append_dev(form, div3);
    			append_dev(div3, label1);
    			append_dev(div3, t8);
    			append_dev(div3, input1);
    			append_dev(form, t9);
    			append_dev(form, div4);
    			append_dev(div4, label2);
    			append_dev(div4, t11);
    			append_dev(div4, input2);
    			append_dev(form, t12);
    			append_dev(form, div5);
    			append_dev(div5, input3);
    			append_dev(div5, t13);
    			append_dev(div5, label3);
    			append_dev(form, t15);
    			append_dev(form, div6);
    			append_dev(div6, button);
    			append_dev(form, t17);
    			append_dev(form, div7);
    			append_dev(div7, p1);
    			append_dev(p1, t18);
    			mount_component(link2, p1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(link0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(section);
    			destroy_component(link1);
    			destroy_component(link2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Signup', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Signup> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link });
    	return [];
    }

    class Signup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Signup",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\routes\password_forget.svelte generated by Svelte v3.44.0 */
    const file$1 = "src\\routes\\password_forget.svelte";

    // (7:2) <Link to="/" class="text-white">
    function create_default_slot_1$1(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "mdi mdi-home h1");
    			add_location(i, file$1, 6, 34, 179);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(7:2) <Link to=\\\"/\\\" class=\\\"text-white\\\">",
    		ctx
    	});

    	return block;
    }

    // (20:20) <Link                       to="/"                       class="text-dark text-uppercase account-pages-logo"                       >
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Dorsin");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(20:20) <Link                       to=\\\"/\\\"                       class=\\\"text-dark text-uppercase account-pages-logo\\\"                       >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div0;
    	let link0;
    	let t0;
    	let section;
    	let div12;
    	let div11;
    	let div10;
    	let div9;
    	let div8;
    	let div7;
    	let div6;
    	let div1;
    	let h3;
    	let link1;
    	let t1;
    	let p;
    	let t3;
    	let div5;
    	let div2;
    	let t5;
    	let form;
    	let div3;
    	let label;
    	let t7;
    	let input;
    	let t8;
    	let div4;
    	let button;
    	let current;

    	link0 = new Link({
    			props: {
    				to: "/",
    				class: "text-white",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link({
    			props: {
    				to: "/",
    				class: "text-dark text-uppercase account-pages-logo",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(link0.$$.fragment);
    			t0 = space();
    			section = element("section");
    			div12 = element("div");
    			div11 = element("div");
    			div10 = element("div");
    			div9 = element("div");
    			div8 = element("div");
    			div7 = element("div");
    			div6 = element("div");
    			div1 = element("div");
    			h3 = element("h3");
    			create_component(link1.$$.fragment);
    			t1 = space();
    			p = element("p");
    			p.textContent = "Reset Password";
    			t3 = space();
    			div5 = element("div");
    			div2 = element("div");
    			div2.textContent = "Enter your email address and we'll send you an email with\n                    instructions to reset your password.";
    			t5 = space();
    			form = element("form");
    			div3 = element("div");
    			label = element("label");
    			label.textContent = "Email";
    			t7 = space();
    			input = element("input");
    			t8 = space();
    			div4 = element("div");
    			button = element("button");
    			button.textContent = "Reset your Password";
    			attr_dev(div0, "class", "account-home-btn d-none d-sm-block");
    			add_location(div0, file$1, 5, 0, 96);
    			attr_dev(h3, "class", "fw-bold");
    			add_location(h3, file$1, 18, 18, 592);
    			attr_dev(p, "class", "text-muted");
    			add_location(p, file$1, 25, 18, 842);
    			attr_dev(div1, "class", "text-center mt-3");
    			add_location(div1, file$1, 17, 16, 543);
    			attr_dev(div2, "class", "alert alert-warning text-center");
    			attr_dev(div2, "role", "alert");
    			add_location(div2, file$1, 28, 18, 958);
    			attr_dev(label, "for", "email");
    			add_location(label, file$1, 34, 22, 1270);
    			attr_dev(input, "type", "password");
    			attr_dev(input, "class", "form-control");
    			attr_dev(input, "id", "email");
    			attr_dev(input, "placeholder", "Enter Email");
    			add_location(input, file$1, 35, 22, 1325);
    			attr_dev(div3, "class", "form-group");
    			add_location(div3, file$1, 33, 20, 1223);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "btn btn-primary");
    			add_location(button, file$1, 44, 22, 1623);
    			attr_dev(div4, "class", "d-grid mt-3");
    			add_location(div4, file$1, 43, 20, 1575);
    			add_location(form, file$1, 32, 18, 1196);
    			attr_dev(div5, "class", "p-3");
    			add_location(div5, file$1, 27, 16, 922);
    			attr_dev(div6, "class", "card-body");
    			add_location(div6, file$1, 16, 14, 503);
    			attr_dev(div7, "class", "card account-card");
    			add_location(div7, file$1, 15, 12, 457);
    			attr_dev(div8, "class", "col-lg-5");
    			add_location(div8, file$1, 14, 10, 422);
    			attr_dev(div9, "class", "row justify-content-center");
    			add_location(div9, file$1, 13, 8, 371);
    			attr_dev(div10, "class", "container");
    			add_location(div10, file$1, 12, 6, 339);
    			attr_dev(div11, "class", "display-table-cell");
    			add_location(div11, file$1, 11, 4, 300);
    			attr_dev(div12, "class", "display-table");
    			add_location(div12, file$1, 10, 2, 268);
    			attr_dev(section, "class", "bg-account-pages vh-100");
    			add_location(section, file$1, 9, 0, 224);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(link0, div0, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, section, anchor);
    			append_dev(section, div12);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div6, div1);
    			append_dev(div1, h3);
    			mount_component(link1, h3, null);
    			append_dev(div1, t1);
    			append_dev(div1, p);
    			append_dev(div6, t3);
    			append_dev(div6, div5);
    			append_dev(div5, div2);
    			append_dev(div5, t5);
    			append_dev(div5, form);
    			append_dev(form, div3);
    			append_dev(div3, label);
    			append_dev(div3, t7);
    			append_dev(div3, input);
    			append_dev(form, t8);
    			append_dev(form, div4);
    			append_dev(div4, button);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(link0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(section);
    			destroy_component(link1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Password_forget', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Password_forget> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link });
    	return [];
    }

    class Password_forget extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Password_forget",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.44.0 */
    const file = "src\\App.svelte";

    // (21:4) <Route path="/">
    function create_default_slot_11(ctx) {
    	let index1;
    	let current;
    	index1 = new Index({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(index1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(index1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(index1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(index1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(index1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(21:4) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (22:4) <Route path="/index-2">
    function create_default_slot_10(ctx) {
    	let index2;
    	let current;
    	index2 = new Index2({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(index2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(index2, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(index2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(index2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(index2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(22:4) <Route path=\\\"/index-2\\\">",
    		ctx
    	});

    	return block;
    }

    // (23:4) <Route path="/index-3">
    function create_default_slot_9(ctx) {
    	let index3;
    	let current;
    	index3 = new Index3({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(index3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(index3, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(index3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(index3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(index3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(23:4) <Route path=\\\"/index-3\\\">",
    		ctx
    	});

    	return block;
    }

    // (24:4) <Route path="/index-4">
    function create_default_slot_8(ctx) {
    	let index4;
    	let current;
    	index4 = new Index4({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(index4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(index4, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(index4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(index4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(index4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(24:4) <Route path=\\\"/index-4\\\">",
    		ctx
    	});

    	return block;
    }

    // (25:4) <Route path="/index-5">
    function create_default_slot_7(ctx) {
    	let index5;
    	let current;
    	index5 = new Index5({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(index5.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(index5, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(index5.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(index5.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(index5, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(25:4) <Route path=\\\"/index-5\\\">",
    		ctx
    	});

    	return block;
    }

    // (26:4) <Route path="/index-6">
    function create_default_slot_6(ctx) {
    	let index6;
    	let current;
    	index6 = new Index6({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(index6.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(index6, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(index6.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(index6.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(index6, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(26:4) <Route path=\\\"/index-6\\\">",
    		ctx
    	});

    	return block;
    }

    // (27:4) <Route path="/index-7">
    function create_default_slot_5(ctx) {
    	let index7;
    	let current;
    	index7 = new Index7({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(index7.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(index7, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(index7.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(index7.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(index7, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(27:4) <Route path=\\\"/index-7\\\">",
    		ctx
    	});

    	return block;
    }

    // (28:4) <Route path="/index-8">
    function create_default_slot_4(ctx) {
    	let index8;
    	let current;
    	index8 = new Index8({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(index8.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(index8, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(index8.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(index8.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(index8, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(28:4) <Route path=\\\"/index-8\\\">",
    		ctx
    	});

    	return block;
    }

    // (29:4) <Route path="/login">
    function create_default_slot_3(ctx) {
    	let login;
    	let current;
    	login = new Login({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(login.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(login, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(login.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(login.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(login, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(29:4) <Route path=\\\"/login\\\">",
    		ctx
    	});

    	return block;
    }

    // (30:4) <Route path="/signup">
    function create_default_slot_2(ctx) {
    	let signup;
    	let current;
    	signup = new Signup({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(signup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(signup, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(signup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(signup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(signup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(30:4) <Route path=\\\"/signup\\\">",
    		ctx
    	});

    	return block;
    }

    // (31:4) <Route path="/password_forget">
    function create_default_slot_1(ctx) {
    	let password_forget;
    	let current;
    	password_forget = new Password_forget({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(password_forget.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(password_forget, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(password_forget.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(password_forget.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(password_forget, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(31:4) <Route path=\\\"/password_forget\\\">",
    		ctx
    	});

    	return block;
    }

    // (19:0) <Router {url}>
    function create_default_slot(ctx) {
    	let div;
    	let route0;
    	let t0;
    	let route1;
    	let t1;
    	let route2;
    	let t2;
    	let route3;
    	let t3;
    	let route4;
    	let t4;
    	let route5;
    	let t5;
    	let route6;
    	let t6;
    	let route7;
    	let t7;
    	let route8;
    	let t8;
    	let route9;
    	let t9;
    	let route10;
    	let current;

    	route0 = new Route({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route({
    			props: {
    				path: "/index-2",
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route({
    			props: {
    				path: "/index-3",
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route3 = new Route({
    			props: {
    				path: "/index-4",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route4 = new Route({
    			props: {
    				path: "/index-5",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route5 = new Route({
    			props: {
    				path: "/index-6",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route6 = new Route({
    			props: {
    				path: "/index-7",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route7 = new Route({
    			props: {
    				path: "/index-8",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route8 = new Route({
    			props: {
    				path: "/login",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route9 = new Route({
    			props: {
    				path: "/signup",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route10 = new Route({
    			props: {
    				path: "/password_forget",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(route0.$$.fragment);
    			t0 = space();
    			create_component(route1.$$.fragment);
    			t1 = space();
    			create_component(route2.$$.fragment);
    			t2 = space();
    			create_component(route3.$$.fragment);
    			t3 = space();
    			create_component(route4.$$.fragment);
    			t4 = space();
    			create_component(route5.$$.fragment);
    			t5 = space();
    			create_component(route6.$$.fragment);
    			t6 = space();
    			create_component(route7.$$.fragment);
    			t7 = space();
    			create_component(route8.$$.fragment);
    			t8 = space();
    			create_component(route9.$$.fragment);
    			t9 = space();
    			create_component(route10.$$.fragment);
    			add_location(div, file, 19, 2, 644);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(route0, div, null);
    			append_dev(div, t0);
    			mount_component(route1, div, null);
    			append_dev(div, t1);
    			mount_component(route2, div, null);
    			append_dev(div, t2);
    			mount_component(route3, div, null);
    			append_dev(div, t3);
    			mount_component(route4, div, null);
    			append_dev(div, t4);
    			mount_component(route5, div, null);
    			append_dev(div, t5);
    			mount_component(route6, div, null);
    			append_dev(div, t6);
    			mount_component(route7, div, null);
    			append_dev(div, t7);
    			mount_component(route8, div, null);
    			append_dev(div, t8);
    			mount_component(route9, div, null);
    			append_dev(div, t9);
    			mount_component(route10, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    			const route3_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    			const route4_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route4_changes.$$scope = { dirty, ctx };
    			}

    			route4.$set(route4_changes);
    			const route5_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route5_changes.$$scope = { dirty, ctx };
    			}

    			route5.$set(route5_changes);
    			const route6_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route6_changes.$$scope = { dirty, ctx };
    			}

    			route6.$set(route6_changes);
    			const route7_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route7_changes.$$scope = { dirty, ctx };
    			}

    			route7.$set(route7_changes);
    			const route8_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route8_changes.$$scope = { dirty, ctx };
    			}

    			route8.$set(route8_changes);
    			const route9_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route9_changes.$$scope = { dirty, ctx };
    			}

    			route9.$set(route9_changes);
    			const route10_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route10_changes.$$scope = { dirty, ctx };
    			}

    			route10.$set(route10_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			transition_in(route4.$$.fragment, local);
    			transition_in(route5.$$.fragment, local);
    			transition_in(route6.$$.fragment, local);
    			transition_in(route7.$$.fragment, local);
    			transition_in(route8.$$.fragment, local);
    			transition_in(route9.$$.fragment, local);
    			transition_in(route10.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			transition_out(route4.$$.fragment, local);
    			transition_out(route5.$$.fragment, local);
    			transition_out(route6.$$.fragment, local);
    			transition_out(route7.$$.fragment, local);
    			transition_out(route8.$$.fragment, local);
    			transition_out(route9.$$.fragment, local);
    			transition_out(route10.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			destroy_component(route3);
    			destroy_component(route4);
    			destroy_component(route5);
    			destroy_component(route6);
    			destroy_component(route7);
    			destroy_component(route8);
    			destroy_component(route9);
    			destroy_component(route10);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(19:0) <Router {url}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				url: /*url*/ ctx[0],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};
    			if (dirty & /*url*/ 1) router_changes.url = /*url*/ ctx[0];

    			if (dirty & /*$$scope*/ 2) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { url = "" } = $$props;
    	const writable_props = ['url'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('url' in $$props) $$invalidate(0, url = $$props.url);
    	};

    	$$self.$capture_state = () => ({
    		Router,
    		Route,
    		Index1: Index,
    		Index2,
    		Index3,
    		Index4,
    		Index5,
    		Index6,
    		Index7,
    		Index8,
    		Login,
    		Signup,
    		Password_forget,
    		url
    	});

    	$$self.$inject_state = $$props => {
    		if ('url' in $$props) $$invalidate(0, url = $$props.url);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [url];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { url: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get url() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
