#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/codegen/code.js
var require_code = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/codegen/code.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.regexpCode = exports.getEsmExportName = exports.getProperty = exports.safeStringify = exports.stringify = exports.strConcat = exports.addCodeArg = exports.str = exports._ = exports.nil = exports._Code = exports.Name = exports.IDENTIFIER = exports._CodeOrName = void 0;
    var _CodeOrName = class {
    };
    exports._CodeOrName = _CodeOrName;
    exports.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    var Name = class extends _CodeOrName {
      constructor(s) {
        super();
        if (!exports.IDENTIFIER.test(s))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = s;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return false;
      }
      get names() {
        return { [this.str]: 1 };
      }
    };
    exports.Name = Name;
    var _Code = class extends _CodeOrName {
      constructor(code) {
        super();
        this._items = typeof code === "string" ? [code] : code;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return false;
        const item = this._items[0];
        return item === "" || item === '""';
      }
      get str() {
        var _a;
        return (_a = this._str) !== null && _a !== void 0 ? _a : this._str = this._items.reduce((s, c) => `${s}${c}`, "");
      }
      get names() {
        var _a;
        return (_a = this._names) !== null && _a !== void 0 ? _a : this._names = this._items.reduce((names, c) => {
          if (c instanceof Name)
            names[c.str] = (names[c.str] || 0) + 1;
          return names;
        }, {});
      }
    };
    exports._Code = _Code;
    exports.nil = new _Code("");
    function _(strs, ...args) {
      const code = [strs[0]];
      let i = 0;
      while (i < args.length) {
        addCodeArg(code, args[i]);
        code.push(strs[++i]);
      }
      return new _Code(code);
    }
    exports._ = _;
    var plus = new _Code("+");
    function str(strs, ...args) {
      const expr = [safeStringify(strs[0])];
      let i = 0;
      while (i < args.length) {
        expr.push(plus);
        addCodeArg(expr, args[i]);
        expr.push(plus, safeStringify(strs[++i]));
      }
      optimize(expr);
      return new _Code(expr);
    }
    exports.str = str;
    function addCodeArg(code, arg) {
      if (arg instanceof _Code)
        code.push(...arg._items);
      else if (arg instanceof Name)
        code.push(arg);
      else
        code.push(interpolate(arg));
    }
    exports.addCodeArg = addCodeArg;
    function optimize(expr) {
      let i = 1;
      while (i < expr.length - 1) {
        if (expr[i] === plus) {
          const res = mergeExprItems(expr[i - 1], expr[i + 1]);
          if (res !== void 0) {
            expr.splice(i - 1, 3, res);
            continue;
          }
          expr[i++] = "+";
        }
        i++;
      }
    }
    function mergeExprItems(a, b) {
      if (b === '""')
        return a;
      if (a === '""')
        return b;
      if (typeof a == "string") {
        if (b instanceof Name || a[a.length - 1] !== '"')
          return;
        if (typeof b != "string")
          return `${a.slice(0, -1)}${b}"`;
        if (b[0] === '"')
          return a.slice(0, -1) + b.slice(1);
        return;
      }
      if (typeof b == "string" && b[0] === '"' && !(a instanceof Name))
        return `"${a}${b.slice(1)}`;
      return;
    }
    function strConcat(c1, c2) {
      return c2.emptyStr() ? c1 : c1.emptyStr() ? c2 : str`${c1}${c2}`;
    }
    exports.strConcat = strConcat;
    function interpolate(x) {
      return typeof x == "number" || typeof x == "boolean" || x === null ? x : safeStringify(Array.isArray(x) ? x.join(",") : x);
    }
    function stringify(x) {
      return new _Code(safeStringify(x));
    }
    exports.stringify = stringify;
    function safeStringify(x) {
      return JSON.stringify(x).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    exports.safeStringify = safeStringify;
    function getProperty(key) {
      return typeof key == "string" && exports.IDENTIFIER.test(key) ? new _Code(`.${key}`) : _`[${key}]`;
    }
    exports.getProperty = getProperty;
    function getEsmExportName(key) {
      if (typeof key == "string" && exports.IDENTIFIER.test(key)) {
        return new _Code(`${key}`);
      }
      throw new Error(`CodeGen: invalid export name: ${key}, use explicit $id name mapping`);
    }
    exports.getEsmExportName = getEsmExportName;
    function regexpCode(rx) {
      return new _Code(rx.toString());
    }
    exports.regexpCode = regexpCode;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/codegen/scope.js
var require_scope = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/codegen/scope.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ValueScope = exports.ValueScopeName = exports.Scope = exports.varKinds = exports.UsedValueState = void 0;
    var code_1 = require_code();
    var ValueError = class extends Error {
      constructor(name) {
        super(`CodeGen: "code" for ${name} not defined`);
        this.value = name.value;
      }
    };
    var UsedValueState;
    (function(UsedValueState2) {
      UsedValueState2[UsedValueState2["Started"] = 0] = "Started";
      UsedValueState2[UsedValueState2["Completed"] = 1] = "Completed";
    })(UsedValueState || (exports.UsedValueState = UsedValueState = {}));
    exports.varKinds = {
      const: new code_1.Name("const"),
      let: new code_1.Name("let"),
      var: new code_1.Name("var")
    };
    var Scope = class {
      constructor({ prefixes, parent } = {}) {
        this._names = {};
        this._prefixes = prefixes;
        this._parent = parent;
      }
      toName(nameOrPrefix) {
        return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
      }
      name(prefix) {
        return new code_1.Name(this._newName(prefix));
      }
      _newName(prefix) {
        const ng = this._names[prefix] || this._nameGroup(prefix);
        return `${prefix}${ng.index++}`;
      }
      _nameGroup(prefix) {
        var _a, _b;
        if (((_b = (_a = this._parent) === null || _a === void 0 ? void 0 : _a._prefixes) === null || _b === void 0 ? void 0 : _b.has(prefix)) || this._prefixes && !this._prefixes.has(prefix)) {
          throw new Error(`CodeGen: prefix "${prefix}" is not allowed in this scope`);
        }
        return this._names[prefix] = { prefix, index: 0 };
      }
    };
    exports.Scope = Scope;
    var ValueScopeName = class extends code_1.Name {
      constructor(prefix, nameStr) {
        super(nameStr);
        this.prefix = prefix;
      }
      setValue(value, { property, itemIndex }) {
        this.value = value;
        this.scopePath = (0, code_1._)`.${new code_1.Name(property)}[${itemIndex}]`;
      }
    };
    exports.ValueScopeName = ValueScopeName;
    var line = (0, code_1._)`\n`;
    var ValueScope = class extends Scope {
      constructor(opts) {
        super(opts);
        this._values = {};
        this._scope = opts.scope;
        this.opts = { ...opts, _n: opts.lines ? line : code_1.nil };
      }
      get() {
        return this._scope;
      }
      name(prefix) {
        return new ValueScopeName(prefix, this._newName(prefix));
      }
      value(nameOrPrefix, value) {
        var _a;
        if (value.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const name = this.toName(nameOrPrefix);
        const { prefix } = name;
        const valueKey = (_a = value.key) !== null && _a !== void 0 ? _a : value.ref;
        let vs = this._values[prefix];
        if (vs) {
          const _name = vs.get(valueKey);
          if (_name)
            return _name;
        } else {
          vs = this._values[prefix] = /* @__PURE__ */ new Map();
        }
        vs.set(valueKey, name);
        const s = this._scope[prefix] || (this._scope[prefix] = []);
        const itemIndex = s.length;
        s[itemIndex] = value.ref;
        name.setValue(value, { property: prefix, itemIndex });
        return name;
      }
      getValue(prefix, keyOrRef) {
        const vs = this._values[prefix];
        if (!vs)
          return;
        return vs.get(keyOrRef);
      }
      scopeRefs(scopeName, values = this._values) {
        return this._reduceValues(values, (name) => {
          if (name.scopePath === void 0)
            throw new Error(`CodeGen: name "${name}" has no value`);
          return (0, code_1._)`${scopeName}${name.scopePath}`;
        });
      }
      scopeCode(values = this._values, usedValues, getCode) {
        return this._reduceValues(values, (name) => {
          if (name.value === void 0)
            throw new Error(`CodeGen: name "${name}" has no value`);
          return name.value.code;
        }, usedValues, getCode);
      }
      _reduceValues(values, valueCode, usedValues = {}, getCode) {
        let code = code_1.nil;
        for (const prefix in values) {
          const vs = values[prefix];
          if (!vs)
            continue;
          const nameSet = usedValues[prefix] = usedValues[prefix] || /* @__PURE__ */ new Map();
          vs.forEach((name) => {
            if (nameSet.has(name))
              return;
            nameSet.set(name, UsedValueState.Started);
            let c = valueCode(name);
            if (c) {
              const def = this.opts.es5 ? exports.varKinds.var : exports.varKinds.const;
              code = (0, code_1._)`${code}${def} ${name} = ${c};${this.opts._n}`;
            } else if (c = getCode === null || getCode === void 0 ? void 0 : getCode(name)) {
              code = (0, code_1._)`${code}${c}${this.opts._n}`;
            } else {
              throw new ValueError(name);
            }
            nameSet.set(name, UsedValueState.Completed);
          });
        }
        return code;
      }
    };
    exports.ValueScope = ValueScope;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/codegen/index.js
var require_codegen = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/codegen/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.or = exports.and = exports.not = exports.CodeGen = exports.operators = exports.varKinds = exports.ValueScopeName = exports.ValueScope = exports.Scope = exports.Name = exports.regexpCode = exports.stringify = exports.getProperty = exports.nil = exports.strConcat = exports.str = exports._ = void 0;
    var code_1 = require_code();
    var scope_1 = require_scope();
    var code_2 = require_code();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return code_2._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return code_2.str;
    } });
    Object.defineProperty(exports, "strConcat", { enumerable: true, get: function() {
      return code_2.strConcat;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return code_2.nil;
    } });
    Object.defineProperty(exports, "getProperty", { enumerable: true, get: function() {
      return code_2.getProperty;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return code_2.stringify;
    } });
    Object.defineProperty(exports, "regexpCode", { enumerable: true, get: function() {
      return code_2.regexpCode;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return code_2.Name;
    } });
    var scope_2 = require_scope();
    Object.defineProperty(exports, "Scope", { enumerable: true, get: function() {
      return scope_2.Scope;
    } });
    Object.defineProperty(exports, "ValueScope", { enumerable: true, get: function() {
      return scope_2.ValueScope;
    } });
    Object.defineProperty(exports, "ValueScopeName", { enumerable: true, get: function() {
      return scope_2.ValueScopeName;
    } });
    Object.defineProperty(exports, "varKinds", { enumerable: true, get: function() {
      return scope_2.varKinds;
    } });
    exports.operators = {
      GT: new code_1._Code(">"),
      GTE: new code_1._Code(">="),
      LT: new code_1._Code("<"),
      LTE: new code_1._Code("<="),
      EQ: new code_1._Code("==="),
      NEQ: new code_1._Code("!=="),
      NOT: new code_1._Code("!"),
      OR: new code_1._Code("||"),
      AND: new code_1._Code("&&"),
      ADD: new code_1._Code("+")
    };
    var Node = class {
      optimizeNodes() {
        return this;
      }
      optimizeNames(_names, _constants) {
        return this;
      }
    };
    var Def = class extends Node {
      constructor(varKind, name, rhs) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.rhs = rhs;
      }
      render({ es5, _n }) {
        const varKind = es5 ? scope_1.varKinds.var : this.varKind;
        const rhs = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${varKind} ${this.name}${rhs};` + _n;
      }
      optimizeNames(names, constants) {
        if (!names[this.name.str])
          return;
        if (this.rhs)
          this.rhs = optimizeExpr(this.rhs, names, constants);
        return this;
      }
      get names() {
        return this.rhs instanceof code_1._CodeOrName ? this.rhs.names : {};
      }
    };
    var Assign = class extends Node {
      constructor(lhs, rhs, sideEffects) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
        this.sideEffects = sideEffects;
      }
      render({ _n }) {
        return `${this.lhs} = ${this.rhs};` + _n;
      }
      optimizeNames(names, constants) {
        if (this.lhs instanceof code_1.Name && !names[this.lhs.str] && !this.sideEffects)
          return;
        this.rhs = optimizeExpr(this.rhs, names, constants);
        return this;
      }
      get names() {
        const names = this.lhs instanceof code_1.Name ? {} : { ...this.lhs.names };
        return addExprNames(names, this.rhs);
      }
    };
    var AssignOp = class extends Assign {
      constructor(lhs, op, rhs, sideEffects) {
        super(lhs, rhs, sideEffects);
        this.op = op;
      }
      render({ _n }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + _n;
      }
    };
    var Label = class extends Node {
      constructor(label) {
        super();
        this.label = label;
        this.names = {};
      }
      render({ _n }) {
        return `${this.label}:` + _n;
      }
    };
    var Break = class extends Node {
      constructor(label) {
        super();
        this.label = label;
        this.names = {};
      }
      render({ _n }) {
        const label = this.label ? ` ${this.label}` : "";
        return `break${label};` + _n;
      }
    };
    var Throw = class extends Node {
      constructor(error4) {
        super();
        this.error = error4;
      }
      render({ _n }) {
        return `throw ${this.error};` + _n;
      }
      get names() {
        return this.error.names;
      }
    };
    var AnyCode = class extends Node {
      constructor(code) {
        super();
        this.code = code;
      }
      render({ _n }) {
        return `${this.code};` + _n;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(names, constants) {
        this.code = optimizeExpr(this.code, names, constants);
        return this;
      }
      get names() {
        return this.code instanceof code_1._CodeOrName ? this.code.names : {};
      }
    };
    var ParentNode = class extends Node {
      constructor(nodes = []) {
        super();
        this.nodes = nodes;
      }
      render(opts) {
        return this.nodes.reduce((code, n) => code + n.render(opts), "");
      }
      optimizeNodes() {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
          const n = nodes[i].optimizeNodes();
          if (Array.isArray(n))
            nodes.splice(i, 1, ...n);
          else if (n)
            nodes[i] = n;
          else
            nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : void 0;
      }
      optimizeNames(names, constants) {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
          const n = nodes[i];
          if (n.optimizeNames(names, constants))
            continue;
          subtractNames(names, n.names);
          nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((names, n) => addNames(names, n.names), {});
      }
    };
    var BlockNode = class extends ParentNode {
      render(opts) {
        return "{" + opts._n + super.render(opts) + "}" + opts._n;
      }
    };
    var Root = class extends ParentNode {
    };
    var Else = class extends BlockNode {
    };
    Else.kind = "else";
    var If = class _If extends BlockNode {
      constructor(condition, nodes) {
        super(nodes);
        this.condition = condition;
      }
      render(opts) {
        let code = `if(${this.condition})` + super.render(opts);
        if (this.else)
          code += "else " + this.else.render(opts);
        return code;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const cond = this.condition;
        if (cond === true)
          return this.nodes;
        let e = this.else;
        if (e) {
          const ns = e.optimizeNodes();
          e = this.else = Array.isArray(ns) ? new Else(ns) : ns;
        }
        if (e) {
          if (cond === false)
            return e instanceof _If ? e : e.nodes;
          if (this.nodes.length)
            return this;
          return new _If(not(cond), e instanceof _If ? [e] : e.nodes);
        }
        if (cond === false || !this.nodes.length)
          return void 0;
        return this;
      }
      optimizeNames(names, constants) {
        var _a;
        this.else = (_a = this.else) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants);
        if (!(super.optimizeNames(names, constants) || this.else))
          return;
        this.condition = optimizeExpr(this.condition, names, constants);
        return this;
      }
      get names() {
        const names = super.names;
        addExprNames(names, this.condition);
        if (this.else)
          addNames(names, this.else.names);
        return names;
      }
    };
    If.kind = "if";
    var For = class extends BlockNode {
    };
    For.kind = "for";
    var ForLoop = class extends For {
      constructor(iteration) {
        super();
        this.iteration = iteration;
      }
      render(opts) {
        return `for(${this.iteration})` + super.render(opts);
      }
      optimizeNames(names, constants) {
        if (!super.optimizeNames(names, constants))
          return;
        this.iteration = optimizeExpr(this.iteration, names, constants);
        return this;
      }
      get names() {
        return addNames(super.names, this.iteration.names);
      }
    };
    var ForRange = class extends For {
      constructor(varKind, name, from, to) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.from = from;
        this.to = to;
      }
      render(opts) {
        const varKind = opts.es5 ? scope_1.varKinds.var : this.varKind;
        const { name, from, to } = this;
        return `for(${varKind} ${name}=${from}; ${name}<${to}; ${name}++)` + super.render(opts);
      }
      get names() {
        const names = addExprNames(super.names, this.from);
        return addExprNames(names, this.to);
      }
    };
    var ForIter = class extends For {
      constructor(loop, varKind, name, iterable) {
        super();
        this.loop = loop;
        this.varKind = varKind;
        this.name = name;
        this.iterable = iterable;
      }
      render(opts) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(opts);
      }
      optimizeNames(names, constants) {
        if (!super.optimizeNames(names, constants))
          return;
        this.iterable = optimizeExpr(this.iterable, names, constants);
        return this;
      }
      get names() {
        return addNames(super.names, this.iterable.names);
      }
    };
    var Func = class extends BlockNode {
      constructor(name, args, async) {
        super();
        this.name = name;
        this.args = args;
        this.async = async;
      }
      render(opts) {
        const _async = this.async ? "async " : "";
        return `${_async}function ${this.name}(${this.args})` + super.render(opts);
      }
    };
    Func.kind = "func";
    var Return = class extends ParentNode {
      render(opts) {
        return "return " + super.render(opts);
      }
    };
    Return.kind = "return";
    var Try = class extends BlockNode {
      render(opts) {
        let code = "try" + super.render(opts);
        if (this.catch)
          code += this.catch.render(opts);
        if (this.finally)
          code += this.finally.render(opts);
        return code;
      }
      optimizeNodes() {
        var _a, _b;
        super.optimizeNodes();
        (_a = this.catch) === null || _a === void 0 ? void 0 : _a.optimizeNodes();
        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNodes();
        return this;
      }
      optimizeNames(names, constants) {
        var _a, _b;
        super.optimizeNames(names, constants);
        (_a = this.catch) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants);
        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNames(names, constants);
        return this;
      }
      get names() {
        const names = super.names;
        if (this.catch)
          addNames(names, this.catch.names);
        if (this.finally)
          addNames(names, this.finally.names);
        return names;
      }
    };
    var Catch = class extends BlockNode {
      constructor(error4) {
        super();
        this.error = error4;
      }
      render(opts) {
        return `catch(${this.error})` + super.render(opts);
      }
    };
    Catch.kind = "catch";
    var Finally = class extends BlockNode {
      render(opts) {
        return "finally" + super.render(opts);
      }
    };
    Finally.kind = "finally";
    var CodeGen = class {
      constructor(extScope, opts = {}) {
        this._values = {};
        this._blockStarts = [];
        this._constants = {};
        this.opts = { ...opts, _n: opts.lines ? "\n" : "" };
        this._extScope = extScope;
        this._scope = new scope_1.Scope({ parent: extScope });
        this._nodes = [new Root()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(prefix) {
        return this._scope.name(prefix);
      }
      // reserves unique name in the external scope
      scopeName(prefix) {
        return this._extScope.name(prefix);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(prefixOrName, value) {
        const name = this._extScope.value(prefixOrName, value);
        const vs = this._values[name.prefix] || (this._values[name.prefix] = /* @__PURE__ */ new Set());
        vs.add(name);
        return name;
      }
      getScopeValue(prefix, keyOrRef) {
        return this._extScope.getValue(prefix, keyOrRef);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(scopeName) {
        return this._extScope.scopeRefs(scopeName, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(varKind, nameOrPrefix, rhs, constant) {
        const name = this._scope.toName(nameOrPrefix);
        if (rhs !== void 0 && constant)
          this._constants[name.str] = rhs;
        this._leafNode(new Def(varKind, name, rhs));
        return name;
      }
      // `const` declaration (`var` in es5 mode)
      const(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.const, nameOrPrefix, rhs, _constant);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.let, nameOrPrefix, rhs, _constant);
      }
      // `var` declaration with optional assignment
      var(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.var, nameOrPrefix, rhs, _constant);
      }
      // assignment code
      assign(lhs, rhs, sideEffects) {
        return this._leafNode(new Assign(lhs, rhs, sideEffects));
      }
      // `+=` code
      add(lhs, rhs) {
        return this._leafNode(new AssignOp(lhs, exports.operators.ADD, rhs));
      }
      // appends passed SafeExpr to code or executes Block
      code(c) {
        if (typeof c == "function")
          c();
        else if (c !== code_1.nil)
          this._leafNode(new AnyCode(c));
        return this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...keyValues) {
        const code = ["{"];
        for (const [key, value] of keyValues) {
          if (code.length > 1)
            code.push(",");
          code.push(key);
          if (key !== value || this.opts.es5) {
            code.push(":");
            (0, code_1.addCodeArg)(code, value);
          }
        }
        code.push("}");
        return new code_1._Code(code);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(condition, thenBody, elseBody) {
        this._blockNode(new If(condition));
        if (thenBody && elseBody) {
          this.code(thenBody).else().code(elseBody).endIf();
        } else if (thenBody) {
          this.code(thenBody).endIf();
        } else if (elseBody) {
          throw new Error('CodeGen: "else" body without "then" body');
        }
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(condition) {
        return this._elseNode(new If(condition));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new Else());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(If, Else);
      }
      _for(node, forBody) {
        this._blockNode(node);
        if (forBody)
          this.code(forBody).endFor();
        return this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(iteration, forBody) {
        return this._for(new ForLoop(iteration), forBody);
      }
      // `for` statement for a range of values
      forRange(nameOrPrefix, from, to, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.let) {
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForRange(varKind, name, from, to), () => forBody(name));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(nameOrPrefix, iterable, forBody, varKind = scope_1.varKinds.const) {
        const name = this._scope.toName(nameOrPrefix);
        if (this.opts.es5) {
          const arr = iterable instanceof code_1.Name ? iterable : this.var("_arr", iterable);
          return this.forRange("_i", 0, (0, code_1._)`${arr}.length`, (i) => {
            this.var(name, (0, code_1._)`${arr}[${i}]`);
            forBody(name);
          });
        }
        return this._for(new ForIter("of", varKind, name, iterable), () => forBody(name));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(nameOrPrefix, obj, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.const) {
        if (this.opts.ownProperties) {
          return this.forOf(nameOrPrefix, (0, code_1._)`Object.keys(${obj})`, forBody);
        }
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForIter("in", varKind, name, obj), () => forBody(name));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(For);
      }
      // `label` statement
      label(label) {
        return this._leafNode(new Label(label));
      }
      // `break` statement
      break(label) {
        return this._leafNode(new Break(label));
      }
      // `return` statement
      return(value) {
        const node = new Return();
        this._blockNode(node);
        this.code(value);
        if (node.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(Return);
      }
      // `try` statement
      try(tryBody, catchCode, finallyCode) {
        if (!catchCode && !finallyCode)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const node = new Try();
        this._blockNode(node);
        this.code(tryBody);
        if (catchCode) {
          const error4 = this.name("e");
          this._currNode = node.catch = new Catch(error4);
          catchCode(error4);
        }
        if (finallyCode) {
          this._currNode = node.finally = new Finally();
          this.code(finallyCode);
        }
        return this._endBlockNode(Catch, Finally);
      }
      // `throw` statement
      throw(error4) {
        return this._leafNode(new Throw(error4));
      }
      // start self-balancing block
      block(body, nodeCount) {
        this._blockStarts.push(this._nodes.length);
        if (body)
          this.code(body).endBlock(nodeCount);
        return this;
      }
      // end the current self-balancing block
      endBlock(nodeCount) {
        const len = this._blockStarts.pop();
        if (len === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const toClose = this._nodes.length - len;
        if (toClose < 0 || nodeCount !== void 0 && toClose !== nodeCount) {
          throw new Error(`CodeGen: wrong number of nodes: ${toClose} vs ${nodeCount} expected`);
        }
        this._nodes.length = len;
        return this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(name, args = code_1.nil, async, funcBody) {
        this._blockNode(new Func(name, args, async));
        if (funcBody)
          this.code(funcBody).endFunc();
        return this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(Func);
      }
      optimize(n = 1) {
        while (n-- > 0) {
          this._root.optimizeNodes();
          this._root.optimizeNames(this._root.names, this._constants);
        }
      }
      _leafNode(node) {
        this._currNode.nodes.push(node);
        return this;
      }
      _blockNode(node) {
        this._currNode.nodes.push(node);
        this._nodes.push(node);
      }
      _endBlockNode(N1, N2) {
        const n = this._currNode;
        if (n instanceof N1 || N2 && n instanceof N2) {
          this._nodes.pop();
          return this;
        }
        throw new Error(`CodeGen: not in block "${N2 ? `${N1.kind}/${N2.kind}` : N1.kind}"`);
      }
      _elseNode(node) {
        const n = this._currNode;
        if (!(n instanceof If)) {
          throw new Error('CodeGen: "else" without "if"');
        }
        this._currNode = n.else = node;
        return this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const ns = this._nodes;
        return ns[ns.length - 1];
      }
      set _currNode(node) {
        const ns = this._nodes;
        ns[ns.length - 1] = node;
      }
    };
    exports.CodeGen = CodeGen;
    function addNames(names, from) {
      for (const n in from)
        names[n] = (names[n] || 0) + (from[n] || 0);
      return names;
    }
    function addExprNames(names, from) {
      return from instanceof code_1._CodeOrName ? addNames(names, from.names) : names;
    }
    function optimizeExpr(expr, names, constants) {
      if (expr instanceof code_1.Name)
        return replaceName(expr);
      if (!canOptimize(expr))
        return expr;
      return new code_1._Code(expr._items.reduce((items, c) => {
        if (c instanceof code_1.Name)
          c = replaceName(c);
        if (c instanceof code_1._Code)
          items.push(...c._items);
        else
          items.push(c);
        return items;
      }, []));
      function replaceName(n) {
        const c = constants[n.str];
        if (c === void 0 || names[n.str] !== 1)
          return n;
        delete names[n.str];
        return c;
      }
      function canOptimize(e) {
        return e instanceof code_1._Code && e._items.some((c) => c instanceof code_1.Name && names[c.str] === 1 && constants[c.str] !== void 0);
      }
    }
    function subtractNames(names, from) {
      for (const n in from)
        names[n] = (names[n] || 0) - (from[n] || 0);
    }
    function not(x) {
      return typeof x == "boolean" || typeof x == "number" || x === null ? !x : (0, code_1._)`!${par(x)}`;
    }
    exports.not = not;
    var andCode = mappend(exports.operators.AND);
    function and(...args) {
      return args.reduce(andCode);
    }
    exports.and = and;
    var orCode = mappend(exports.operators.OR);
    function or(...args) {
      return args.reduce(orCode);
    }
    exports.or = or;
    function mappend(op) {
      return (x, y) => x === code_1.nil ? y : y === code_1.nil ? x : (0, code_1._)`${par(x)} ${op} ${par(y)}`;
    }
    function par(x) {
      return x instanceof code_1.Name ? x : (0, code_1._)`(${x})`;
    }
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/util.js
var require_util = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/util.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.checkStrictMode = exports.getErrorPath = exports.Type = exports.useFunc = exports.setEvaluated = exports.evaluatedPropsToName = exports.mergeEvaluated = exports.eachItem = exports.unescapeJsonPointer = exports.escapeJsonPointer = exports.escapeFragment = exports.unescapeFragment = exports.schemaRefOrVal = exports.schemaHasRulesButRef = exports.schemaHasRules = exports.checkUnknownRules = exports.alwaysValidSchema = exports.toHash = void 0;
    var codegen_1 = require_codegen();
    var code_1 = require_code();
    function toHash(arr) {
      const hash = {};
      for (const item of arr)
        hash[item] = true;
      return hash;
    }
    exports.toHash = toHash;
    function alwaysValidSchema(it, schema) {
      if (typeof schema == "boolean")
        return schema;
      if (Object.keys(schema).length === 0)
        return true;
      checkUnknownRules(it, schema);
      return !schemaHasRules(schema, it.self.RULES.all);
    }
    exports.alwaysValidSchema = alwaysValidSchema;
    function checkUnknownRules(it, schema = it.schema) {
      const { opts, self } = it;
      if (!opts.strictSchema)
        return;
      if (typeof schema === "boolean")
        return;
      const rules = self.RULES.keywords;
      for (const key in schema) {
        if (!rules[key])
          checkStrictMode(it, `unknown keyword: "${key}"`);
      }
    }
    exports.checkUnknownRules = checkUnknownRules;
    function schemaHasRules(schema, rules) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (rules[key])
          return true;
      return false;
    }
    exports.schemaHasRules = schemaHasRules;
    function schemaHasRulesButRef(schema, RULES) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (key !== "$ref" && RULES.all[key])
          return true;
      return false;
    }
    exports.schemaHasRulesButRef = schemaHasRulesButRef;
    function schemaRefOrVal({ topSchemaRef, schemaPath }, schema, keyword, $data) {
      if (!$data) {
        if (typeof schema == "number" || typeof schema == "boolean")
          return schema;
        if (typeof schema == "string")
          return (0, codegen_1._)`${schema}`;
      }
      return (0, codegen_1._)`${topSchemaRef}${schemaPath}${(0, codegen_1.getProperty)(keyword)}`;
    }
    exports.schemaRefOrVal = schemaRefOrVal;
    function unescapeFragment(str) {
      return unescapeJsonPointer(decodeURIComponent(str));
    }
    exports.unescapeFragment = unescapeFragment;
    function escapeFragment(str) {
      return encodeURIComponent(escapeJsonPointer(str));
    }
    exports.escapeFragment = escapeFragment;
    function escapeJsonPointer(str) {
      if (typeof str == "number")
        return `${str}`;
      return str.replace(/~/g, "~0").replace(/\//g, "~1");
    }
    exports.escapeJsonPointer = escapeJsonPointer;
    function unescapeJsonPointer(str) {
      return str.replace(/~1/g, "/").replace(/~0/g, "~");
    }
    exports.unescapeJsonPointer = unescapeJsonPointer;
    function eachItem(xs, f) {
      if (Array.isArray(xs)) {
        for (const x of xs)
          f(x);
      } else {
        f(xs);
      }
    }
    exports.eachItem = eachItem;
    function makeMergeEvaluated({ mergeNames, mergeToName, mergeValues, resultToName }) {
      return (gen, from, to, toName) => {
        const res = to === void 0 ? from : to instanceof codegen_1.Name ? (from instanceof codegen_1.Name ? mergeNames(gen, from, to) : mergeToName(gen, from, to), to) : from instanceof codegen_1.Name ? (mergeToName(gen, to, from), from) : mergeValues(from, to);
        return toName === codegen_1.Name && !(res instanceof codegen_1.Name) ? resultToName(gen, res) : res;
      };
    }
    exports.mergeEvaluated = {
      props: makeMergeEvaluated({
        mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => {
          gen.if((0, codegen_1._)`${from} === true`, () => gen.assign(to, true), () => gen.assign(to, (0, codegen_1._)`${to} || {}`).code((0, codegen_1._)`Object.assign(${to}, ${from})`));
        }),
        mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => {
          if (from === true) {
            gen.assign(to, true);
          } else {
            gen.assign(to, (0, codegen_1._)`${to} || {}`);
            setEvaluated(gen, to, from);
          }
        }),
        mergeValues: (from, to) => from === true ? true : { ...from, ...to },
        resultToName: evaluatedPropsToName
      }),
      items: makeMergeEvaluated({
        mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => gen.assign(to, (0, codegen_1._)`${from} === true ? true : ${to} > ${from} ? ${to} : ${from}`)),
        mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => gen.assign(to, from === true ? true : (0, codegen_1._)`${to} > ${from} ? ${to} : ${from}`)),
        mergeValues: (from, to) => from === true ? true : Math.max(from, to),
        resultToName: (gen, items) => gen.var("items", items)
      })
    };
    function evaluatedPropsToName(gen, ps) {
      if (ps === true)
        return gen.var("props", true);
      const props = gen.var("props", (0, codegen_1._)`{}`);
      if (ps !== void 0)
        setEvaluated(gen, props, ps);
      return props;
    }
    exports.evaluatedPropsToName = evaluatedPropsToName;
    function setEvaluated(gen, props, ps) {
      Object.keys(ps).forEach((p) => gen.assign((0, codegen_1._)`${props}${(0, codegen_1.getProperty)(p)}`, true));
    }
    exports.setEvaluated = setEvaluated;
    var snippets = {};
    function useFunc(gen, f) {
      return gen.scopeValue("func", {
        ref: f,
        code: snippets[f.code] || (snippets[f.code] = new code_1._Code(f.code))
      });
    }
    exports.useFunc = useFunc;
    var Type;
    (function(Type2) {
      Type2[Type2["Num"] = 0] = "Num";
      Type2[Type2["Str"] = 1] = "Str";
    })(Type || (exports.Type = Type = {}));
    function getErrorPath(dataProp, dataPropType, jsPropertySyntax) {
      if (dataProp instanceof codegen_1.Name) {
        const isNumber = dataPropType === Type.Num;
        return jsPropertySyntax ? isNumber ? (0, codegen_1._)`"[" + ${dataProp} + "]"` : (0, codegen_1._)`"['" + ${dataProp} + "']"` : isNumber ? (0, codegen_1._)`"/" + ${dataProp}` : (0, codegen_1._)`"/" + ${dataProp}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
      }
      return jsPropertySyntax ? (0, codegen_1.getProperty)(dataProp).toString() : "/" + escapeJsonPointer(dataProp);
    }
    exports.getErrorPath = getErrorPath;
    function checkStrictMode(it, msg, mode = it.opts.strictSchema) {
      if (!mode)
        return;
      msg = `strict mode: ${msg}`;
      if (mode === true)
        throw new Error(msg);
      it.self.logger.warn(msg);
    }
    exports.checkStrictMode = checkStrictMode;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/names.js
var require_names = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/names.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var names = {
      // validation function arguments
      data: new codegen_1.Name("data"),
      // data passed to validation function
      // args passed from referencing schema
      valCxt: new codegen_1.Name("valCxt"),
      // validation/data context - should not be used directly, it is destructured to the names below
      instancePath: new codegen_1.Name("instancePath"),
      parentData: new codegen_1.Name("parentData"),
      parentDataProperty: new codegen_1.Name("parentDataProperty"),
      rootData: new codegen_1.Name("rootData"),
      // root data - same as the data passed to the first/top validation function
      dynamicAnchors: new codegen_1.Name("dynamicAnchors"),
      // used to support recursiveRef and dynamicRef
      // function scoped variables
      vErrors: new codegen_1.Name("vErrors"),
      // null or array of validation errors
      errors: new codegen_1.Name("errors"),
      // counter of validation errors
      this: new codegen_1.Name("this"),
      // "globals"
      self: new codegen_1.Name("self"),
      scope: new codegen_1.Name("scope"),
      // JTD serialize/parse name for JSON string and position
      json: new codegen_1.Name("json"),
      jsonPos: new codegen_1.Name("jsonPos"),
      jsonLen: new codegen_1.Name("jsonLen"),
      jsonPart: new codegen_1.Name("jsonPart")
    };
    exports.default = names;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/errors.js
var require_errors = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extendErrors = exports.resetErrorsCount = exports.reportExtraError = exports.reportError = exports.keyword$DataError = exports.keywordError = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var names_1 = require_names();
    exports.keywordError = {
      message: ({ keyword }) => (0, codegen_1.str)`must pass "${keyword}" keyword validation`
    };
    exports.keyword$DataError = {
      message: ({ keyword, schemaType }) => schemaType ? (0, codegen_1.str)`"${keyword}" keyword must be ${schemaType} ($data)` : (0, codegen_1.str)`"${keyword}" keyword is invalid ($data)`
    };
    function reportError(cxt, error4 = exports.keywordError, errorPaths, overrideAllErrors) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error4, errorPaths);
      if (overrideAllErrors !== null && overrideAllErrors !== void 0 ? overrideAllErrors : compositeRule || allErrors) {
        addError(gen, errObj);
      } else {
        returnErrors(it, (0, codegen_1._)`[${errObj}]`);
      }
    }
    exports.reportError = reportError;
    function reportExtraError(cxt, error4 = exports.keywordError, errorPaths) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error4, errorPaths);
      addError(gen, errObj);
      if (!(compositeRule || allErrors)) {
        returnErrors(it, names_1.default.vErrors);
      }
    }
    exports.reportExtraError = reportExtraError;
    function resetErrorsCount(gen, errsCount) {
      gen.assign(names_1.default.errors, errsCount);
      gen.if((0, codegen_1._)`${names_1.default.vErrors} !== null`, () => gen.if(errsCount, () => gen.assign((0, codegen_1._)`${names_1.default.vErrors}.length`, errsCount), () => gen.assign(names_1.default.vErrors, null)));
    }
    exports.resetErrorsCount = resetErrorsCount;
    function extendErrors({ gen, keyword, schemaValue, data, errsCount, it }) {
      if (errsCount === void 0)
        throw new Error("ajv implementation error");
      const err = gen.name("err");
      gen.forRange("i", errsCount, names_1.default.errors, (i) => {
        gen.const(err, (0, codegen_1._)`${names_1.default.vErrors}[${i}]`);
        gen.if((0, codegen_1._)`${err}.instancePath === undefined`, () => gen.assign((0, codegen_1._)`${err}.instancePath`, (0, codegen_1.strConcat)(names_1.default.instancePath, it.errorPath)));
        gen.assign((0, codegen_1._)`${err}.schemaPath`, (0, codegen_1.str)`${it.errSchemaPath}/${keyword}`);
        if (it.opts.verbose) {
          gen.assign((0, codegen_1._)`${err}.schema`, schemaValue);
          gen.assign((0, codegen_1._)`${err}.data`, data);
        }
      });
    }
    exports.extendErrors = extendErrors;
    function addError(gen, errObj) {
      const err = gen.const("err", errObj);
      gen.if((0, codegen_1._)`${names_1.default.vErrors} === null`, () => gen.assign(names_1.default.vErrors, (0, codegen_1._)`[${err}]`), (0, codegen_1._)`${names_1.default.vErrors}.push(${err})`);
      gen.code((0, codegen_1._)`${names_1.default.errors}++`);
    }
    function returnErrors(it, errs) {
      const { gen, validateName, schemaEnv } = it;
      if (schemaEnv.$async) {
        gen.throw((0, codegen_1._)`new ${it.ValidationError}(${errs})`);
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, errs);
        gen.return(false);
      }
    }
    var E = {
      keyword: new codegen_1.Name("keyword"),
      schemaPath: new codegen_1.Name("schemaPath"),
      // also used in JTD errors
      params: new codegen_1.Name("params"),
      propertyName: new codegen_1.Name("propertyName"),
      message: new codegen_1.Name("message"),
      schema: new codegen_1.Name("schema"),
      parentSchema: new codegen_1.Name("parentSchema")
    };
    function errorObjectCode(cxt, error4, errorPaths) {
      const { createErrors } = cxt.it;
      if (createErrors === false)
        return (0, codegen_1._)`{}`;
      return errorObject(cxt, error4, errorPaths);
    }
    function errorObject(cxt, error4, errorPaths = {}) {
      const { gen, it } = cxt;
      const keyValues = [
        errorInstancePath(it, errorPaths),
        errorSchemaPath(cxt, errorPaths)
      ];
      extraErrorProps(cxt, error4, keyValues);
      return gen.object(...keyValues);
    }
    function errorInstancePath({ errorPath }, { instancePath }) {
      const instPath = instancePath ? (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(instancePath, util_1.Type.Str)}` : errorPath;
      return [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, instPath)];
    }
    function errorSchemaPath({ keyword, it: { errSchemaPath } }, { schemaPath, parentSchema }) {
      let schPath = parentSchema ? errSchemaPath : (0, codegen_1.str)`${errSchemaPath}/${keyword}`;
      if (schemaPath) {
        schPath = (0, codegen_1.str)`${schPath}${(0, util_1.getErrorPath)(schemaPath, util_1.Type.Str)}`;
      }
      return [E.schemaPath, schPath];
    }
    function extraErrorProps(cxt, { params, message }, keyValues) {
      const { keyword, data, schemaValue, it } = cxt;
      const { opts, propertyName, topSchemaRef, schemaPath } = it;
      keyValues.push([E.keyword, keyword], [E.params, typeof params == "function" ? params(cxt) : params || (0, codegen_1._)`{}`]);
      if (opts.messages) {
        keyValues.push([E.message, typeof message == "function" ? message(cxt) : message]);
      }
      if (opts.verbose) {
        keyValues.push([E.schema, schemaValue], [E.parentSchema, (0, codegen_1._)`${topSchemaRef}${schemaPath}`], [names_1.default.data, data]);
      }
      if (propertyName)
        keyValues.push([E.propertyName, propertyName]);
    }
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/boolSchema.js
var require_boolSchema = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/boolSchema.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.boolOrEmptySchema = exports.topBoolOrEmptySchema = void 0;
    var errors_1 = require_errors();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var boolError = {
      message: "boolean schema is false"
    };
    function topBoolOrEmptySchema(it) {
      const { gen, schema, validateName } = it;
      if (schema === false) {
        falseSchemaError(it, false);
      } else if (typeof schema == "object" && schema.$async === true) {
        gen.return(names_1.default.data);
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, null);
        gen.return(true);
      }
    }
    exports.topBoolOrEmptySchema = topBoolOrEmptySchema;
    function boolOrEmptySchema(it, valid) {
      const { gen, schema } = it;
      if (schema === false) {
        gen.var(valid, false);
        falseSchemaError(it);
      } else {
        gen.var(valid, true);
      }
    }
    exports.boolOrEmptySchema = boolOrEmptySchema;
    function falseSchemaError(it, overrideAllErrors) {
      const { gen, data } = it;
      const cxt = {
        gen,
        keyword: "false schema",
        data,
        schema: false,
        schemaCode: false,
        schemaValue: false,
        params: {},
        it
      };
      (0, errors_1.reportError)(cxt, boolError, void 0, overrideAllErrors);
    }
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/rules.js
var require_rules = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/rules.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRules = exports.isJSONType = void 0;
    var _jsonTypes = ["string", "number", "integer", "boolean", "null", "object", "array"];
    var jsonTypes = new Set(_jsonTypes);
    function isJSONType(x) {
      return typeof x == "string" && jsonTypes.has(x);
    }
    exports.isJSONType = isJSONType;
    function getRules() {
      const groups = {
        number: { type: "number", rules: [] },
        string: { type: "string", rules: [] },
        array: { type: "array", rules: [] },
        object: { type: "object", rules: [] }
      };
      return {
        types: { ...groups, integer: true, boolean: true, null: true },
        rules: [{ rules: [] }, groups.number, groups.string, groups.array, groups.object],
        post: { rules: [] },
        all: {},
        keywords: {}
      };
    }
    exports.getRules = getRules;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/applicability.js
var require_applicability = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/applicability.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.shouldUseRule = exports.shouldUseGroup = exports.schemaHasRulesForType = void 0;
    function schemaHasRulesForType({ schema, self }, type) {
      const group = self.RULES.types[type];
      return group && group !== true && shouldUseGroup(schema, group);
    }
    exports.schemaHasRulesForType = schemaHasRulesForType;
    function shouldUseGroup(schema, group) {
      return group.rules.some((rule) => shouldUseRule(schema, rule));
    }
    exports.shouldUseGroup = shouldUseGroup;
    function shouldUseRule(schema, rule) {
      var _a;
      return schema[rule.keyword] !== void 0 || ((_a = rule.definition.implements) === null || _a === void 0 ? void 0 : _a.some((kwd) => schema[kwd] !== void 0));
    }
    exports.shouldUseRule = shouldUseRule;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/dataType.js
var require_dataType = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/dataType.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
    var rules_1 = require_rules();
    var applicability_1 = require_applicability();
    var errors_1 = require_errors();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var DataType;
    (function(DataType2) {
      DataType2[DataType2["Correct"] = 0] = "Correct";
      DataType2[DataType2["Wrong"] = 1] = "Wrong";
    })(DataType || (exports.DataType = DataType = {}));
    function getSchemaTypes(schema) {
      const types = getJSONTypes(schema.type);
      const hasNull = types.includes("null");
      if (hasNull) {
        if (schema.nullable === false)
          throw new Error("type: null contradicts nullable: false");
      } else {
        if (!types.length && schema.nullable !== void 0) {
          throw new Error('"nullable" cannot be used without "type"');
        }
        if (schema.nullable === true)
          types.push("null");
      }
      return types;
    }
    exports.getSchemaTypes = getSchemaTypes;
    function getJSONTypes(ts) {
      const types = Array.isArray(ts) ? ts : ts ? [ts] : [];
      if (types.every(rules_1.isJSONType))
        return types;
      throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
    }
    exports.getJSONTypes = getJSONTypes;
    function coerceAndCheckDataType(it, types) {
      const { gen, data, opts } = it;
      const coerceTo = coerceToTypes(types, opts.coerceTypes);
      const checkTypes = types.length > 0 && !(coerceTo.length === 0 && types.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types[0]));
      if (checkTypes) {
        const wrongType = checkDataTypes(types, data, opts.strictNumbers, DataType.Wrong);
        gen.if(wrongType, () => {
          if (coerceTo.length)
            coerceData(it, types, coerceTo);
          else
            reportTypeError(it);
        });
      }
      return checkTypes;
    }
    exports.coerceAndCheckDataType = coerceAndCheckDataType;
    var COERCIBLE = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
    function coerceToTypes(types, coerceTypes) {
      return coerceTypes ? types.filter((t) => COERCIBLE.has(t) || coerceTypes === "array" && t === "array") : [];
    }
    function coerceData(it, types, coerceTo) {
      const { gen, data, opts } = it;
      const dataType = gen.let("dataType", (0, codegen_1._)`typeof ${data}`);
      const coerced = gen.let("coerced", (0, codegen_1._)`undefined`);
      if (opts.coerceTypes === "array") {
        gen.if((0, codegen_1._)`${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen.assign(data, (0, codegen_1._)`${data}[0]`).assign(dataType, (0, codegen_1._)`typeof ${data}`).if(checkDataTypes(types, data, opts.strictNumbers), () => gen.assign(coerced, data)));
      }
      gen.if((0, codegen_1._)`${coerced} !== undefined`);
      for (const t of coerceTo) {
        if (COERCIBLE.has(t) || t === "array" && opts.coerceTypes === "array") {
          coerceSpecificType(t);
        }
      }
      gen.else();
      reportTypeError(it);
      gen.endIf();
      gen.if((0, codegen_1._)`${coerced} !== undefined`, () => {
        gen.assign(data, coerced);
        assignParentData(it, coerced);
      });
      function coerceSpecificType(t) {
        switch (t) {
          case "string":
            gen.elseIf((0, codegen_1._)`${dataType} == "number" || ${dataType} == "boolean"`).assign(coerced, (0, codegen_1._)`"" + ${data}`).elseIf((0, codegen_1._)`${data} === null`).assign(coerced, (0, codegen_1._)`""`);
            return;
          case "number":
            gen.elseIf((0, codegen_1._)`${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`).assign(coerced, (0, codegen_1._)`+${data}`);
            return;
          case "integer":
            gen.elseIf((0, codegen_1._)`${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`).assign(coerced, (0, codegen_1._)`+${data}`);
            return;
          case "boolean":
            gen.elseIf((0, codegen_1._)`${data} === "false" || ${data} === 0 || ${data} === null`).assign(coerced, false).elseIf((0, codegen_1._)`${data} === "true" || ${data} === 1`).assign(coerced, true);
            return;
          case "null":
            gen.elseIf((0, codegen_1._)`${data} === "" || ${data} === 0 || ${data} === false`);
            gen.assign(coerced, null);
            return;
          case "array":
            gen.elseIf((0, codegen_1._)`${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`).assign(coerced, (0, codegen_1._)`[${data}]`);
        }
      }
    }
    function assignParentData({ gen, parentData, parentDataProperty }, expr) {
      gen.if((0, codegen_1._)`${parentData} !== undefined`, () => gen.assign((0, codegen_1._)`${parentData}[${parentDataProperty}]`, expr));
    }
    function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
      const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
      let cond;
      switch (dataType) {
        case "null":
          return (0, codegen_1._)`${data} ${EQ} null`;
        case "array":
          cond = (0, codegen_1._)`Array.isArray(${data})`;
          break;
        case "object":
          cond = (0, codegen_1._)`${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
          break;
        case "integer":
          cond = numCond((0, codegen_1._)`!(${data} % 1) && !isNaN(${data})`);
          break;
        case "number":
          cond = numCond();
          break;
        default:
          return (0, codegen_1._)`typeof ${data} ${EQ} ${dataType}`;
      }
      return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
      function numCond(_cond = codegen_1.nil) {
        return (0, codegen_1.and)((0, codegen_1._)`typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._)`isFinite(${data})` : codegen_1.nil);
      }
    }
    exports.checkDataType = checkDataType;
    function checkDataTypes(dataTypes, data, strictNums, correct) {
      if (dataTypes.length === 1) {
        return checkDataType(dataTypes[0], data, strictNums, correct);
      }
      let cond;
      const types = (0, util_1.toHash)(dataTypes);
      if (types.array && types.object) {
        const notObj = (0, codegen_1._)`typeof ${data} != "object"`;
        cond = types.null ? notObj : (0, codegen_1._)`!${data} || ${notObj}`;
        delete types.null;
        delete types.array;
        delete types.object;
      } else {
        cond = codegen_1.nil;
      }
      if (types.number)
        delete types.integer;
      for (const t in types)
        cond = (0, codegen_1.and)(cond, checkDataType(t, data, strictNums, correct));
      return cond;
    }
    exports.checkDataTypes = checkDataTypes;
    var typeError = {
      message: ({ schema }) => `must be ${schema}`,
      params: ({ schema, schemaValue }) => typeof schema == "string" ? (0, codegen_1._)`{type: ${schema}}` : (0, codegen_1._)`{type: ${schemaValue}}`
    };
    function reportTypeError(it) {
      const cxt = getTypeErrorContext(it);
      (0, errors_1.reportError)(cxt, typeError);
    }
    exports.reportTypeError = reportTypeError;
    function getTypeErrorContext(it) {
      const { gen, data, schema } = it;
      const schemaCode = (0, util_1.schemaRefOrVal)(it, schema, "type");
      return {
        gen,
        keyword: "type",
        data,
        schema: schema.type,
        schemaCode,
        schemaValue: schemaCode,
        parentSchema: schema,
        params: {},
        it
      };
    }
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/defaults.js
var require_defaults = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/defaults.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assignDefaults = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    function assignDefaults(it, ty) {
      const { properties, items } = it.schema;
      if (ty === "object" && properties) {
        for (const key in properties) {
          assignDefault(it, key, properties[key].default);
        }
      } else if (ty === "array" && Array.isArray(items)) {
        items.forEach((sch, i) => assignDefault(it, i, sch.default));
      }
    }
    exports.assignDefaults = assignDefaults;
    function assignDefault(it, prop, defaultValue) {
      const { gen, compositeRule, data, opts } = it;
      if (defaultValue === void 0)
        return;
      const childData = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(prop)}`;
      if (compositeRule) {
        (0, util_1.checkStrictMode)(it, `default is ignored for: ${childData}`);
        return;
      }
      let condition = (0, codegen_1._)`${childData} === undefined`;
      if (opts.useDefaults === "empty") {
        condition = (0, codegen_1._)`${condition} || ${childData} === null || ${childData} === ""`;
      }
      gen.if(condition, (0, codegen_1._)`${childData} = ${(0, codegen_1.stringify)(defaultValue)}`);
    }
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/code.js
var require_code2 = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/code.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateUnion = exports.validateArray = exports.usePattern = exports.callValidateCode = exports.schemaProperties = exports.allSchemaProperties = exports.noPropertyInData = exports.propertyInData = exports.isOwnProperty = exports.hasPropFunc = exports.reportMissingProp = exports.checkMissingProp = exports.checkReportMissingProp = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var names_1 = require_names();
    var util_2 = require_util();
    function checkReportMissingProp(cxt, prop) {
      const { gen, data, it } = cxt;
      gen.if(noPropertyInData(gen, data, prop, it.opts.ownProperties), () => {
        cxt.setParams({ missingProperty: (0, codegen_1._)`${prop}` }, true);
        cxt.error();
      });
    }
    exports.checkReportMissingProp = checkReportMissingProp;
    function checkMissingProp({ gen, data, it: { opts } }, properties, missing) {
      return (0, codegen_1.or)(...properties.map((prop) => (0, codegen_1.and)(noPropertyInData(gen, data, prop, opts.ownProperties), (0, codegen_1._)`${missing} = ${prop}`)));
    }
    exports.checkMissingProp = checkMissingProp;
    function reportMissingProp(cxt, missing) {
      cxt.setParams({ missingProperty: missing }, true);
      cxt.error();
    }
    exports.reportMissingProp = reportMissingProp;
    function hasPropFunc(gen) {
      return gen.scopeValue("func", {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        ref: Object.prototype.hasOwnProperty,
        code: (0, codegen_1._)`Object.prototype.hasOwnProperty`
      });
    }
    exports.hasPropFunc = hasPropFunc;
    function isOwnProperty(gen, data, property) {
      return (0, codegen_1._)`${hasPropFunc(gen)}.call(${data}, ${property})`;
    }
    exports.isOwnProperty = isOwnProperty;
    function propertyInData(gen, data, property, ownProperties) {
      const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} !== undefined`;
      return ownProperties ? (0, codegen_1._)`${cond} && ${isOwnProperty(gen, data, property)}` : cond;
    }
    exports.propertyInData = propertyInData;
    function noPropertyInData(gen, data, property, ownProperties) {
      const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} === undefined`;
      return ownProperties ? (0, codegen_1.or)(cond, (0, codegen_1.not)(isOwnProperty(gen, data, property))) : cond;
    }
    exports.noPropertyInData = noPropertyInData;
    function allSchemaProperties(schemaMap) {
      return schemaMap ? Object.keys(schemaMap).filter((p) => p !== "__proto__") : [];
    }
    exports.allSchemaProperties = allSchemaProperties;
    function schemaProperties(it, schemaMap) {
      return allSchemaProperties(schemaMap).filter((p) => !(0, util_1.alwaysValidSchema)(it, schemaMap[p]));
    }
    exports.schemaProperties = schemaProperties;
    function callValidateCode({ schemaCode, data, it: { gen, topSchemaRef, schemaPath, errorPath }, it }, func, context, passSchema) {
      const dataAndSchema = passSchema ? (0, codegen_1._)`${schemaCode}, ${data}, ${topSchemaRef}${schemaPath}` : data;
      const valCxt = [
        [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, errorPath)],
        [names_1.default.parentData, it.parentData],
        [names_1.default.parentDataProperty, it.parentDataProperty],
        [names_1.default.rootData, names_1.default.rootData]
      ];
      if (it.opts.dynamicRef)
        valCxt.push([names_1.default.dynamicAnchors, names_1.default.dynamicAnchors]);
      const args = (0, codegen_1._)`${dataAndSchema}, ${gen.object(...valCxt)}`;
      return context !== codegen_1.nil ? (0, codegen_1._)`${func}.call(${context}, ${args})` : (0, codegen_1._)`${func}(${args})`;
    }
    exports.callValidateCode = callValidateCode;
    var newRegExp = (0, codegen_1._)`new RegExp`;
    function usePattern({ gen, it: { opts } }, pattern) {
      const u = opts.unicodeRegExp ? "u" : "";
      const { regExp } = opts.code;
      const rx = regExp(pattern, u);
      return gen.scopeValue("pattern", {
        key: rx.toString(),
        ref: rx,
        code: (0, codegen_1._)`${regExp.code === "new RegExp" ? newRegExp : (0, util_2.useFunc)(gen, regExp)}(${pattern}, ${u})`
      });
    }
    exports.usePattern = usePattern;
    function validateArray(cxt) {
      const { gen, data, keyword, it } = cxt;
      const valid = gen.name("valid");
      if (it.allErrors) {
        const validArr = gen.let("valid", true);
        validateItems(() => gen.assign(validArr, false));
        return validArr;
      }
      gen.var(valid, true);
      validateItems(() => gen.break());
      return valid;
      function validateItems(notValid) {
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        gen.forRange("i", 0, len, (i) => {
          cxt.subschema({
            keyword,
            dataProp: i,
            dataPropType: util_1.Type.Num
          }, valid);
          gen.if((0, codegen_1.not)(valid), notValid);
        });
      }
    }
    exports.validateArray = validateArray;
    function validateUnion(cxt) {
      const { gen, schema, keyword, it } = cxt;
      if (!Array.isArray(schema))
        throw new Error("ajv implementation error");
      const alwaysValid = schema.some((sch) => (0, util_1.alwaysValidSchema)(it, sch));
      if (alwaysValid && !it.opts.unevaluated)
        return;
      const valid = gen.let("valid", false);
      const schValid = gen.name("_valid");
      gen.block(() => schema.forEach((_sch, i) => {
        const schCxt = cxt.subschema({
          keyword,
          schemaProp: i,
          compositeRule: true
        }, schValid);
        gen.assign(valid, (0, codegen_1._)`${valid} || ${schValid}`);
        const merged = cxt.mergeValidEvaluated(schCxt, schValid);
        if (!merged)
          gen.if((0, codegen_1.not)(valid));
      }));
      cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
    }
    exports.validateUnion = validateUnion;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/keyword.js
var require_keyword = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/keyword.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateKeywordUsage = exports.validSchemaType = exports.funcKeywordCode = exports.macroKeywordCode = void 0;
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var code_1 = require_code2();
    var errors_1 = require_errors();
    function macroKeywordCode(cxt, def) {
      const { gen, keyword, schema, parentSchema, it } = cxt;
      const macroSchema = def.macro.call(it.self, schema, parentSchema, it);
      const schemaRef = useKeyword(gen, keyword, macroSchema);
      if (it.opts.validateSchema !== false)
        it.self.validateSchema(macroSchema, true);
      const valid = gen.name("valid");
      cxt.subschema({
        schema: macroSchema,
        schemaPath: codegen_1.nil,
        errSchemaPath: `${it.errSchemaPath}/${keyword}`,
        topSchemaRef: schemaRef,
        compositeRule: true
      }, valid);
      cxt.pass(valid, () => cxt.error(true));
    }
    exports.macroKeywordCode = macroKeywordCode;
    function funcKeywordCode(cxt, def) {
      var _a;
      const { gen, keyword, schema, parentSchema, $data, it } = cxt;
      checkAsyncKeyword(it, def);
      const validate2 = !$data && def.compile ? def.compile.call(it.self, schema, parentSchema, it) : def.validate;
      const validateRef = useKeyword(gen, keyword, validate2);
      const valid = gen.let("valid");
      cxt.block$data(valid, validateKeyword);
      cxt.ok((_a = def.valid) !== null && _a !== void 0 ? _a : valid);
      function validateKeyword() {
        if (def.errors === false) {
          assignValid();
          if (def.modifying)
            modifyData(cxt);
          reportErrs(() => cxt.error());
        } else {
          const ruleErrs = def.async ? validateAsync() : validateSync();
          if (def.modifying)
            modifyData(cxt);
          reportErrs(() => addErrs(cxt, ruleErrs));
        }
      }
      function validateAsync() {
        const ruleErrs = gen.let("ruleErrs", null);
        gen.try(() => assignValid((0, codegen_1._)`await `), (e) => gen.assign(valid, false).if((0, codegen_1._)`${e} instanceof ${it.ValidationError}`, () => gen.assign(ruleErrs, (0, codegen_1._)`${e}.errors`), () => gen.throw(e)));
        return ruleErrs;
      }
      function validateSync() {
        const validateErrs = (0, codegen_1._)`${validateRef}.errors`;
        gen.assign(validateErrs, null);
        assignValid(codegen_1.nil);
        return validateErrs;
      }
      function assignValid(_await = def.async ? (0, codegen_1._)`await ` : codegen_1.nil) {
        const passCxt = it.opts.passContext ? names_1.default.this : names_1.default.self;
        const passSchema = !("compile" in def && !$data || def.schema === false);
        gen.assign(valid, (0, codegen_1._)`${_await}${(0, code_1.callValidateCode)(cxt, validateRef, passCxt, passSchema)}`, def.modifying);
      }
      function reportErrs(errors) {
        var _a2;
        gen.if((0, codegen_1.not)((_a2 = def.valid) !== null && _a2 !== void 0 ? _a2 : valid), errors);
      }
    }
    exports.funcKeywordCode = funcKeywordCode;
    function modifyData(cxt) {
      const { gen, data, it } = cxt;
      gen.if(it.parentData, () => gen.assign(data, (0, codegen_1._)`${it.parentData}[${it.parentDataProperty}]`));
    }
    function addErrs(cxt, errs) {
      const { gen } = cxt;
      gen.if((0, codegen_1._)`Array.isArray(${errs})`, () => {
        gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`).assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
        (0, errors_1.extendErrors)(cxt);
      }, () => cxt.error());
    }
    function checkAsyncKeyword({ schemaEnv }, def) {
      if (def.async && !schemaEnv.$async)
        throw new Error("async keyword in sync schema");
    }
    function useKeyword(gen, keyword, result) {
      if (result === void 0)
        throw new Error(`keyword "${keyword}" failed to compile`);
      return gen.scopeValue("keyword", typeof result == "function" ? { ref: result } : { ref: result, code: (0, codegen_1.stringify)(result) });
    }
    function validSchemaType(schema, schemaType, allowUndefined = false) {
      return !schemaType.length || schemaType.some((st) => st === "array" ? Array.isArray(schema) : st === "object" ? schema && typeof schema == "object" && !Array.isArray(schema) : typeof schema == st || allowUndefined && typeof schema == "undefined");
    }
    exports.validSchemaType = validSchemaType;
    function validateKeywordUsage({ schema, opts, self, errSchemaPath }, def, keyword) {
      if (Array.isArray(def.keyword) ? !def.keyword.includes(keyword) : def.keyword !== keyword) {
        throw new Error("ajv implementation error");
      }
      const deps = def.dependencies;
      if (deps === null || deps === void 0 ? void 0 : deps.some((kwd) => !Object.prototype.hasOwnProperty.call(schema, kwd))) {
        throw new Error(`parent schema must have dependencies of ${keyword}: ${deps.join(",")}`);
      }
      if (def.validateSchema) {
        const valid = def.validateSchema(schema[keyword]);
        if (!valid) {
          const msg = `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` + self.errorsText(def.validateSchema.errors);
          if (opts.validateSchema === "log")
            self.logger.error(msg);
          else
            throw new Error(msg);
        }
      }
    }
    exports.validateKeywordUsage = validateKeywordUsage;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/subschema.js
var require_subschema = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/subschema.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extendSubschemaMode = exports.extendSubschemaData = exports.getSubschema = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    function getSubschema(it, { keyword, schemaProp, schema, schemaPath, errSchemaPath, topSchemaRef }) {
      if (keyword !== void 0 && schema !== void 0) {
        throw new Error('both "keyword" and "schema" passed, only one allowed');
      }
      if (keyword !== void 0) {
        const sch = it.schema[keyword];
        return schemaProp === void 0 ? {
          schema: sch,
          schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}`,
          errSchemaPath: `${it.errSchemaPath}/${keyword}`
        } : {
          schema: sch[schemaProp],
          schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}${(0, codegen_1.getProperty)(schemaProp)}`,
          errSchemaPath: `${it.errSchemaPath}/${keyword}/${(0, util_1.escapeFragment)(schemaProp)}`
        };
      }
      if (schema !== void 0) {
        if (schemaPath === void 0 || errSchemaPath === void 0 || topSchemaRef === void 0) {
          throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
        }
        return {
          schema,
          schemaPath,
          topSchemaRef,
          errSchemaPath
        };
      }
      throw new Error('either "keyword" or "schema" must be passed');
    }
    exports.getSubschema = getSubschema;
    function extendSubschemaData(subschema, it, { dataProp, dataPropType: dpType, data, dataTypes, propertyName }) {
      if (data !== void 0 && dataProp !== void 0) {
        throw new Error('both "data" and "dataProp" passed, only one allowed');
      }
      const { gen } = it;
      if (dataProp !== void 0) {
        const { errorPath, dataPathArr, opts } = it;
        const nextData = gen.let("data", (0, codegen_1._)`${it.data}${(0, codegen_1.getProperty)(dataProp)}`, true);
        dataContextProps(nextData);
        subschema.errorPath = (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(dataProp, dpType, opts.jsPropertySyntax)}`;
        subschema.parentDataProperty = (0, codegen_1._)`${dataProp}`;
        subschema.dataPathArr = [...dataPathArr, subschema.parentDataProperty];
      }
      if (data !== void 0) {
        const nextData = data instanceof codegen_1.Name ? data : gen.let("data", data, true);
        dataContextProps(nextData);
        if (propertyName !== void 0)
          subschema.propertyName = propertyName;
      }
      if (dataTypes)
        subschema.dataTypes = dataTypes;
      function dataContextProps(_nextData) {
        subschema.data = _nextData;
        subschema.dataLevel = it.dataLevel + 1;
        subschema.dataTypes = [];
        it.definedProperties = /* @__PURE__ */ new Set();
        subschema.parentData = it.data;
        subschema.dataNames = [...it.dataNames, _nextData];
      }
    }
    exports.extendSubschemaData = extendSubschemaData;
    function extendSubschemaMode(subschema, { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }) {
      if (compositeRule !== void 0)
        subschema.compositeRule = compositeRule;
      if (createErrors !== void 0)
        subschema.createErrors = createErrors;
      if (allErrors !== void 0)
        subschema.allErrors = allErrors;
      subschema.jtdDiscriminator = jtdDiscriminator;
      subschema.jtdMetadata = jtdMetadata;
    }
    exports.extendSubschemaMode = extendSubschemaMode;
  }
});

// ../../node_modules/.pnpm/fast-deep-equal@3.1.3/node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = __commonJS({
  "../../node_modules/.pnpm/fast-deep-equal@3.1.3/node_modules/fast-deep-equal/index.js"(exports, module) {
    "use strict";
    module.exports = function equal(a, b) {
      if (a === b) return true;
      if (a && b && typeof a == "object" && typeof b == "object") {
        if (a.constructor !== b.constructor) return false;
        var length, i, keys;
        if (Array.isArray(a)) {
          length = a.length;
          if (length != b.length) return false;
          for (i = length; i-- !== 0; )
            if (!equal(a[i], b[i])) return false;
          return true;
        }
        if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) return false;
        for (i = length; i-- !== 0; )
          if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
        for (i = length; i-- !== 0; ) {
          var key = keys[i];
          if (!equal(a[key], b[key])) return false;
        }
        return true;
      }
      return a !== a && b !== b;
    };
  }
});

// ../../node_modules/.pnpm/json-schema-traverse@1.0.0/node_modules/json-schema-traverse/index.js
var require_json_schema_traverse = __commonJS({
  "../../node_modules/.pnpm/json-schema-traverse@1.0.0/node_modules/json-schema-traverse/index.js"(exports, module) {
    "use strict";
    var traverse = module.exports = function(schema, opts, cb) {
      if (typeof opts == "function") {
        cb = opts;
        opts = {};
      }
      cb = opts.cb || cb;
      var pre = typeof cb == "function" ? cb : cb.pre || function() {
      };
      var post = cb.post || function() {
      };
      _traverse(opts, pre, post, schema, "", schema);
    };
    traverse.keywords = {
      additionalItems: true,
      items: true,
      contains: true,
      additionalProperties: true,
      propertyNames: true,
      not: true,
      if: true,
      then: true,
      else: true
    };
    traverse.arrayKeywords = {
      items: true,
      allOf: true,
      anyOf: true,
      oneOf: true
    };
    traverse.propsKeywords = {
      $defs: true,
      definitions: true,
      properties: true,
      patternProperties: true,
      dependencies: true
    };
    traverse.skipKeywords = {
      default: true,
      enum: true,
      const: true,
      required: true,
      maximum: true,
      minimum: true,
      exclusiveMaximum: true,
      exclusiveMinimum: true,
      multipleOf: true,
      maxLength: true,
      minLength: true,
      pattern: true,
      format: true,
      maxItems: true,
      minItems: true,
      uniqueItems: true,
      maxProperties: true,
      minProperties: true
    };
    function _traverse(opts, pre, post, schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
      if (schema && typeof schema == "object" && !Array.isArray(schema)) {
        pre(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
        for (var key in schema) {
          var sch = schema[key];
          if (Array.isArray(sch)) {
            if (key in traverse.arrayKeywords) {
              for (var i = 0; i < sch.length; i++)
                _traverse(opts, pre, post, sch[i], jsonPtr + "/" + key + "/" + i, rootSchema, jsonPtr, key, schema, i);
            }
          } else if (key in traverse.propsKeywords) {
            if (sch && typeof sch == "object") {
              for (var prop in sch)
                _traverse(opts, pre, post, sch[prop], jsonPtr + "/" + key + "/" + escapeJsonPtr(prop), rootSchema, jsonPtr, key, schema, prop);
            }
          } else if (key in traverse.keywords || opts.allKeys && !(key in traverse.skipKeywords)) {
            _traverse(opts, pre, post, sch, jsonPtr + "/" + key, rootSchema, jsonPtr, key, schema);
          }
        }
        post(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
      }
    }
    function escapeJsonPtr(str) {
      return str.replace(/~/g, "~0").replace(/\//g, "~1");
    }
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/resolve.js
var require_resolve = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/resolve.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSchemaRefs = exports.resolveUrl = exports.normalizeId = exports._getFullPath = exports.getFullPath = exports.inlineRef = void 0;
    var util_1 = require_util();
    var equal = require_fast_deep_equal();
    var traverse = require_json_schema_traverse();
    var SIMPLE_INLINED = /* @__PURE__ */ new Set([
      "type",
      "format",
      "pattern",
      "maxLength",
      "minLength",
      "maxProperties",
      "minProperties",
      "maxItems",
      "minItems",
      "maximum",
      "minimum",
      "uniqueItems",
      "multipleOf",
      "required",
      "enum",
      "const"
    ]);
    function inlineRef(schema, limit = true) {
      if (typeof schema == "boolean")
        return true;
      if (limit === true)
        return !hasRef(schema);
      if (!limit)
        return false;
      return countKeys(schema) <= limit;
    }
    exports.inlineRef = inlineRef;
    var REF_KEYWORDS = /* @__PURE__ */ new Set([
      "$ref",
      "$recursiveRef",
      "$recursiveAnchor",
      "$dynamicRef",
      "$dynamicAnchor"
    ]);
    function hasRef(schema) {
      for (const key in schema) {
        if (REF_KEYWORDS.has(key))
          return true;
        const sch = schema[key];
        if (Array.isArray(sch) && sch.some(hasRef))
          return true;
        if (typeof sch == "object" && hasRef(sch))
          return true;
      }
      return false;
    }
    function countKeys(schema) {
      let count = 0;
      for (const key in schema) {
        if (key === "$ref")
          return Infinity;
        count++;
        if (SIMPLE_INLINED.has(key))
          continue;
        if (typeof schema[key] == "object") {
          (0, util_1.eachItem)(schema[key], (sch) => count += countKeys(sch));
        }
        if (count === Infinity)
          return Infinity;
      }
      return count;
    }
    function getFullPath(resolver, id = "", normalize) {
      if (normalize !== false)
        id = normalizeId(id);
      const p = resolver.parse(id);
      return _getFullPath(resolver, p);
    }
    exports.getFullPath = getFullPath;
    function _getFullPath(resolver, p) {
      const serialized = resolver.serialize(p);
      return serialized.split("#")[0] + "#";
    }
    exports._getFullPath = _getFullPath;
    var TRAILING_SLASH_HASH = /#\/?$/;
    function normalizeId(id) {
      return id ? id.replace(TRAILING_SLASH_HASH, "") : "";
    }
    exports.normalizeId = normalizeId;
    function resolveUrl(resolver, baseId, id) {
      id = normalizeId(id);
      return resolver.resolve(baseId, id);
    }
    exports.resolveUrl = resolveUrl;
    var ANCHOR = /^[a-z_][-a-z0-9._]*$/i;
    function getSchemaRefs(schema, baseId) {
      if (typeof schema == "boolean")
        return {};
      const { schemaId, uriResolver } = this.opts;
      const schId = normalizeId(schema[schemaId] || baseId);
      const baseIds = { "": schId };
      const pathPrefix = getFullPath(uriResolver, schId, false);
      const localRefs = {};
      const schemaRefs = /* @__PURE__ */ new Set();
      traverse(schema, { allKeys: true }, (sch, jsonPtr, _, parentJsonPtr) => {
        if (parentJsonPtr === void 0)
          return;
        const fullPath = pathPrefix + jsonPtr;
        let innerBaseId = baseIds[parentJsonPtr];
        if (typeof sch[schemaId] == "string")
          innerBaseId = addRef.call(this, sch[schemaId]);
        addAnchor.call(this, sch.$anchor);
        addAnchor.call(this, sch.$dynamicAnchor);
        baseIds[jsonPtr] = innerBaseId;
        function addRef(ref) {
          const _resolve = this.opts.uriResolver.resolve;
          ref = normalizeId(innerBaseId ? _resolve(innerBaseId, ref) : ref);
          if (schemaRefs.has(ref))
            throw ambiguos(ref);
          schemaRefs.add(ref);
          let schOrRef = this.refs[ref];
          if (typeof schOrRef == "string")
            schOrRef = this.refs[schOrRef];
          if (typeof schOrRef == "object") {
            checkAmbiguosRef(sch, schOrRef.schema, ref);
          } else if (ref !== normalizeId(fullPath)) {
            if (ref[0] === "#") {
              checkAmbiguosRef(sch, localRefs[ref], ref);
              localRefs[ref] = sch;
            } else {
              this.refs[ref] = fullPath;
            }
          }
          return ref;
        }
        function addAnchor(anchor) {
          if (typeof anchor == "string") {
            if (!ANCHOR.test(anchor))
              throw new Error(`invalid anchor "${anchor}"`);
            addRef.call(this, `#${anchor}`);
          }
        }
      });
      return localRefs;
      function checkAmbiguosRef(sch1, sch2, ref) {
        if (sch2 !== void 0 && !equal(sch1, sch2))
          throw ambiguos(ref);
      }
      function ambiguos(ref) {
        return new Error(`reference "${ref}" resolves to more than one schema`);
      }
    }
    exports.getSchemaRefs = getSchemaRefs;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/index.js
var require_validate = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getData = exports.KeywordCxt = exports.validateFunctionCode = void 0;
    var boolSchema_1 = require_boolSchema();
    var dataType_1 = require_dataType();
    var applicability_1 = require_applicability();
    var dataType_2 = require_dataType();
    var defaults_1 = require_defaults();
    var keyword_1 = require_keyword();
    var subschema_1 = require_subschema();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var resolve_1 = require_resolve();
    var util_1 = require_util();
    var errors_1 = require_errors();
    function validateFunctionCode(it) {
      if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
          topSchemaObjCode(it);
          return;
        }
      }
      validateFunction(it, () => (0, boolSchema_1.topBoolOrEmptySchema)(it));
    }
    exports.validateFunctionCode = validateFunctionCode;
    function validateFunction({ gen, validateName, schema, schemaEnv, opts }, body) {
      if (opts.code.es5) {
        gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${names_1.default.valCxt}`, schemaEnv.$async, () => {
          gen.code((0, codegen_1._)`"use strict"; ${funcSourceUrl(schema, opts)}`);
          destructureValCxtES5(gen, opts);
          gen.code(body);
        });
      } else {
        gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${destructureValCxt(opts)}`, schemaEnv.$async, () => gen.code(funcSourceUrl(schema, opts)).code(body));
      }
    }
    function destructureValCxt(opts) {
      return (0, codegen_1._)`{${names_1.default.instancePath}="", ${names_1.default.parentData}, ${names_1.default.parentDataProperty}, ${names_1.default.rootData}=${names_1.default.data}${opts.dynamicRef ? (0, codegen_1._)`, ${names_1.default.dynamicAnchors}={}` : codegen_1.nil}}={}`;
    }
    function destructureValCxtES5(gen, opts) {
      gen.if(names_1.default.valCxt, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.instancePath}`);
        gen.var(names_1.default.parentData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentData}`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentDataProperty}`);
        gen.var(names_1.default.rootData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.rootData}`);
        if (opts.dynamicRef)
          gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.dynamicAnchors}`);
      }, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._)`""`);
        gen.var(names_1.default.parentData, (0, codegen_1._)`undefined`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`undefined`);
        gen.var(names_1.default.rootData, names_1.default.data);
        if (opts.dynamicRef)
          gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`{}`);
      });
    }
    function topSchemaObjCode(it) {
      const { schema, opts, gen } = it;
      validateFunction(it, () => {
        if (opts.$comment && schema.$comment)
          commentKeyword(it);
        checkNoDefault(it);
        gen.let(names_1.default.vErrors, null);
        gen.let(names_1.default.errors, 0);
        if (opts.unevaluated)
          resetEvaluated(it);
        typeAndKeywords(it);
        returnResults(it);
      });
      return;
    }
    function resetEvaluated(it) {
      const { gen, validateName } = it;
      it.evaluated = gen.const("evaluated", (0, codegen_1._)`${validateName}.evaluated`);
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicProps`, () => gen.assign((0, codegen_1._)`${it.evaluated}.props`, (0, codegen_1._)`undefined`));
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicItems`, () => gen.assign((0, codegen_1._)`${it.evaluated}.items`, (0, codegen_1._)`undefined`));
    }
    function funcSourceUrl(schema, opts) {
      const schId = typeof schema == "object" && schema[opts.schemaId];
      return schId && (opts.code.source || opts.code.process) ? (0, codegen_1._)`/*# sourceURL=${schId} */` : codegen_1.nil;
    }
    function subschemaCode(it, valid) {
      if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
          subSchemaObjCode(it, valid);
          return;
        }
      }
      (0, boolSchema_1.boolOrEmptySchema)(it, valid);
    }
    function schemaCxtHasRules({ schema, self }) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (self.RULES.all[key])
          return true;
      return false;
    }
    function isSchemaObj(it) {
      return typeof it.schema != "boolean";
    }
    function subSchemaObjCode(it, valid) {
      const { schema, gen, opts } = it;
      if (opts.$comment && schema.$comment)
        commentKeyword(it);
      updateContext(it);
      checkAsyncSchema(it);
      const errsCount = gen.const("_errs", names_1.default.errors);
      typeAndKeywords(it, errsCount);
      gen.var(valid, (0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
    }
    function checkKeywords(it) {
      (0, util_1.checkUnknownRules)(it);
      checkRefsAndKeywords(it);
    }
    function typeAndKeywords(it, errsCount) {
      if (it.opts.jtd)
        return schemaKeywords(it, [], false, errsCount);
      const types = (0, dataType_1.getSchemaTypes)(it.schema);
      const checkedTypes = (0, dataType_1.coerceAndCheckDataType)(it, types);
      schemaKeywords(it, types, !checkedTypes, errsCount);
    }
    function checkRefsAndKeywords(it) {
      const { schema, errSchemaPath, opts, self } = it;
      if (schema.$ref && opts.ignoreKeywordsWithRef && (0, util_1.schemaHasRulesButRef)(schema, self.RULES)) {
        self.logger.warn(`$ref: keywords ignored in schema at path "${errSchemaPath}"`);
      }
    }
    function checkNoDefault(it) {
      const { schema, opts } = it;
      if (schema.default !== void 0 && opts.useDefaults && opts.strictSchema) {
        (0, util_1.checkStrictMode)(it, "default is ignored in the schema root");
      }
    }
    function updateContext(it) {
      const schId = it.schema[it.opts.schemaId];
      if (schId)
        it.baseId = (0, resolve_1.resolveUrl)(it.opts.uriResolver, it.baseId, schId);
    }
    function checkAsyncSchema(it) {
      if (it.schema.$async && !it.schemaEnv.$async)
        throw new Error("async schema in sync schema");
    }
    function commentKeyword({ gen, schemaEnv, schema, errSchemaPath, opts }) {
      const msg = schema.$comment;
      if (opts.$comment === true) {
        gen.code((0, codegen_1._)`${names_1.default.self}.logger.log(${msg})`);
      } else if (typeof opts.$comment == "function") {
        const schemaPath = (0, codegen_1.str)`${errSchemaPath}/$comment`;
        const rootName = gen.scopeValue("root", { ref: schemaEnv.root });
        gen.code((0, codegen_1._)`${names_1.default.self}.opts.$comment(${msg}, ${schemaPath}, ${rootName}.schema)`);
      }
    }
    function returnResults(it) {
      const { gen, schemaEnv, validateName, ValidationError, opts } = it;
      if (schemaEnv.$async) {
        gen.if((0, codegen_1._)`${names_1.default.errors} === 0`, () => gen.return(names_1.default.data), () => gen.throw((0, codegen_1._)`new ${ValidationError}(${names_1.default.vErrors})`));
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, names_1.default.vErrors);
        if (opts.unevaluated)
          assignEvaluated(it);
        gen.return((0, codegen_1._)`${names_1.default.errors} === 0`);
      }
    }
    function assignEvaluated({ gen, evaluated, props, items }) {
      if (props instanceof codegen_1.Name)
        gen.assign((0, codegen_1._)`${evaluated}.props`, props);
      if (items instanceof codegen_1.Name)
        gen.assign((0, codegen_1._)`${evaluated}.items`, items);
    }
    function schemaKeywords(it, types, typeErrors, errsCount) {
      const { gen, schema, data, allErrors, opts, self } = it;
      const { RULES } = self;
      if (schema.$ref && (opts.ignoreKeywordsWithRef || !(0, util_1.schemaHasRulesButRef)(schema, RULES))) {
        gen.block(() => keywordCode(it, "$ref", RULES.all.$ref.definition));
        return;
      }
      if (!opts.jtd)
        checkStrictTypes(it, types);
      gen.block(() => {
        for (const group of RULES.rules)
          groupKeywords(group);
        groupKeywords(RULES.post);
      });
      function groupKeywords(group) {
        if (!(0, applicability_1.shouldUseGroup)(schema, group))
          return;
        if (group.type) {
          gen.if((0, dataType_2.checkDataType)(group.type, data, opts.strictNumbers));
          iterateKeywords(it, group);
          if (types.length === 1 && types[0] === group.type && typeErrors) {
            gen.else();
            (0, dataType_2.reportTypeError)(it);
          }
          gen.endIf();
        } else {
          iterateKeywords(it, group);
        }
        if (!allErrors)
          gen.if((0, codegen_1._)`${names_1.default.errors} === ${errsCount || 0}`);
      }
    }
    function iterateKeywords(it, group) {
      const { gen, schema, opts: { useDefaults } } = it;
      if (useDefaults)
        (0, defaults_1.assignDefaults)(it, group.type);
      gen.block(() => {
        for (const rule of group.rules) {
          if ((0, applicability_1.shouldUseRule)(schema, rule)) {
            keywordCode(it, rule.keyword, rule.definition, group.type);
          }
        }
      });
    }
    function checkStrictTypes(it, types) {
      if (it.schemaEnv.meta || !it.opts.strictTypes)
        return;
      checkContextTypes(it, types);
      if (!it.opts.allowUnionTypes)
        checkMultipleTypes(it, types);
      checkKeywordTypes(it, it.dataTypes);
    }
    function checkContextTypes(it, types) {
      if (!types.length)
        return;
      if (!it.dataTypes.length) {
        it.dataTypes = types;
        return;
      }
      types.forEach((t) => {
        if (!includesType(it.dataTypes, t)) {
          strictTypesError(it, `type "${t}" not allowed by context "${it.dataTypes.join(",")}"`);
        }
      });
      narrowSchemaTypes(it, types);
    }
    function checkMultipleTypes(it, ts) {
      if (ts.length > 1 && !(ts.length === 2 && ts.includes("null"))) {
        strictTypesError(it, "use allowUnionTypes to allow union type keyword");
      }
    }
    function checkKeywordTypes(it, ts) {
      const rules = it.self.RULES.all;
      for (const keyword in rules) {
        const rule = rules[keyword];
        if (typeof rule == "object" && (0, applicability_1.shouldUseRule)(it.schema, rule)) {
          const { type } = rule.definition;
          if (type.length && !type.some((t) => hasApplicableType(ts, t))) {
            strictTypesError(it, `missing type "${type.join(",")}" for keyword "${keyword}"`);
          }
        }
      }
    }
    function hasApplicableType(schTs, kwdT) {
      return schTs.includes(kwdT) || kwdT === "number" && schTs.includes("integer");
    }
    function includesType(ts, t) {
      return ts.includes(t) || t === "integer" && ts.includes("number");
    }
    function narrowSchemaTypes(it, withTypes) {
      const ts = [];
      for (const t of it.dataTypes) {
        if (includesType(withTypes, t))
          ts.push(t);
        else if (withTypes.includes("integer") && t === "number")
          ts.push("integer");
      }
      it.dataTypes = ts;
    }
    function strictTypesError(it, msg) {
      const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
      msg += ` at "${schemaPath}" (strictTypes)`;
      (0, util_1.checkStrictMode)(it, msg, it.opts.strictTypes);
    }
    var KeywordCxt = class {
      constructor(it, def, keyword) {
        (0, keyword_1.validateKeywordUsage)(it, def, keyword);
        this.gen = it.gen;
        this.allErrors = it.allErrors;
        this.keyword = keyword;
        this.data = it.data;
        this.schema = it.schema[keyword];
        this.$data = def.$data && it.opts.$data && this.schema && this.schema.$data;
        this.schemaValue = (0, util_1.schemaRefOrVal)(it, this.schema, keyword, this.$data);
        this.schemaType = def.schemaType;
        this.parentSchema = it.schema;
        this.params = {};
        this.it = it;
        this.def = def;
        if (this.$data) {
          this.schemaCode = it.gen.const("vSchema", getData(this.$data, it));
        } else {
          this.schemaCode = this.schemaValue;
          if (!(0, keyword_1.validSchemaType)(this.schema, def.schemaType, def.allowUndefined)) {
            throw new Error(`${keyword} value must be ${JSON.stringify(def.schemaType)}`);
          }
        }
        if ("code" in def ? def.trackErrors : def.errors !== false) {
          this.errsCount = it.gen.const("_errs", names_1.default.errors);
        }
      }
      result(condition, successAction, failAction) {
        this.failResult((0, codegen_1.not)(condition), successAction, failAction);
      }
      failResult(condition, successAction, failAction) {
        this.gen.if(condition);
        if (failAction)
          failAction();
        else
          this.error();
        if (successAction) {
          this.gen.else();
          successAction();
          if (this.allErrors)
            this.gen.endIf();
        } else {
          if (this.allErrors)
            this.gen.endIf();
          else
            this.gen.else();
        }
      }
      pass(condition, failAction) {
        this.failResult((0, codegen_1.not)(condition), void 0, failAction);
      }
      fail(condition) {
        if (condition === void 0) {
          this.error();
          if (!this.allErrors)
            this.gen.if(false);
          return;
        }
        this.gen.if(condition);
        this.error();
        if (this.allErrors)
          this.gen.endIf();
        else
          this.gen.else();
      }
      fail$data(condition) {
        if (!this.$data)
          return this.fail(condition);
        const { schemaCode } = this;
        this.fail((0, codegen_1._)`${schemaCode} !== undefined && (${(0, codegen_1.or)(this.invalid$data(), condition)})`);
      }
      error(append, errorParams, errorPaths) {
        if (errorParams) {
          this.setParams(errorParams);
          this._error(append, errorPaths);
          this.setParams({});
          return;
        }
        this._error(append, errorPaths);
      }
      _error(append, errorPaths) {
        ;
        (append ? errors_1.reportExtraError : errors_1.reportError)(this, this.def.error, errorPaths);
      }
      $dataError() {
        (0, errors_1.reportError)(this, this.def.$dataError || errors_1.keyword$DataError);
      }
      reset() {
        if (this.errsCount === void 0)
          throw new Error('add "trackErrors" to keyword definition');
        (0, errors_1.resetErrorsCount)(this.gen, this.errsCount);
      }
      ok(cond) {
        if (!this.allErrors)
          this.gen.if(cond);
      }
      setParams(obj, assign) {
        if (assign)
          Object.assign(this.params, obj);
        else
          this.params = obj;
      }
      block$data(valid, codeBlock, $dataValid = codegen_1.nil) {
        this.gen.block(() => {
          this.check$data(valid, $dataValid);
          codeBlock();
        });
      }
      check$data(valid = codegen_1.nil, $dataValid = codegen_1.nil) {
        if (!this.$data)
          return;
        const { gen, schemaCode, schemaType, def } = this;
        gen.if((0, codegen_1.or)((0, codegen_1._)`${schemaCode} === undefined`, $dataValid));
        if (valid !== codegen_1.nil)
          gen.assign(valid, true);
        if (schemaType.length || def.validateSchema) {
          gen.elseIf(this.invalid$data());
          this.$dataError();
          if (valid !== codegen_1.nil)
            gen.assign(valid, false);
        }
        gen.else();
      }
      invalid$data() {
        const { gen, schemaCode, schemaType, def, it } = this;
        return (0, codegen_1.or)(wrong$DataType(), invalid$DataSchema());
        function wrong$DataType() {
          if (schemaType.length) {
            if (!(schemaCode instanceof codegen_1.Name))
              throw new Error("ajv implementation error");
            const st = Array.isArray(schemaType) ? schemaType : [schemaType];
            return (0, codegen_1._)`${(0, dataType_2.checkDataTypes)(st, schemaCode, it.opts.strictNumbers, dataType_2.DataType.Wrong)}`;
          }
          return codegen_1.nil;
        }
        function invalid$DataSchema() {
          if (def.validateSchema) {
            const validateSchemaRef = gen.scopeValue("validate$data", { ref: def.validateSchema });
            return (0, codegen_1._)`!${validateSchemaRef}(${schemaCode})`;
          }
          return codegen_1.nil;
        }
      }
      subschema(appl, valid) {
        const subschema = (0, subschema_1.getSubschema)(this.it, appl);
        (0, subschema_1.extendSubschemaData)(subschema, this.it, appl);
        (0, subschema_1.extendSubschemaMode)(subschema, appl);
        const nextContext = { ...this.it, ...subschema, items: void 0, props: void 0 };
        subschemaCode(nextContext, valid);
        return nextContext;
      }
      mergeEvaluated(schemaCxt, toName) {
        const { it, gen } = this;
        if (!it.opts.unevaluated)
          return;
        if (it.props !== true && schemaCxt.props !== void 0) {
          it.props = util_1.mergeEvaluated.props(gen, schemaCxt.props, it.props, toName);
        }
        if (it.items !== true && schemaCxt.items !== void 0) {
          it.items = util_1.mergeEvaluated.items(gen, schemaCxt.items, it.items, toName);
        }
      }
      mergeValidEvaluated(schemaCxt, valid) {
        const { it, gen } = this;
        if (it.opts.unevaluated && (it.props !== true || it.items !== true)) {
          gen.if(valid, () => this.mergeEvaluated(schemaCxt, codegen_1.Name));
          return true;
        }
      }
    };
    exports.KeywordCxt = KeywordCxt;
    function keywordCode(it, keyword, def, ruleType) {
      const cxt = new KeywordCxt(it, def, keyword);
      if ("code" in def) {
        def.code(cxt, ruleType);
      } else if (cxt.$data && def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
      } else if ("macro" in def) {
        (0, keyword_1.macroKeywordCode)(cxt, def);
      } else if (def.compile || def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
      }
    }
    var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
    var RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
    function getData($data, { dataLevel, dataNames, dataPathArr }) {
      let jsonPointer;
      let data;
      if ($data === "")
        return names_1.default.rootData;
      if ($data[0] === "/") {
        if (!JSON_POINTER.test($data))
          throw new Error(`Invalid JSON-pointer: ${$data}`);
        jsonPointer = $data;
        data = names_1.default.rootData;
      } else {
        const matches = RELATIVE_JSON_POINTER.exec($data);
        if (!matches)
          throw new Error(`Invalid JSON-pointer: ${$data}`);
        const up = +matches[1];
        jsonPointer = matches[2];
        if (jsonPointer === "#") {
          if (up >= dataLevel)
            throw new Error(errorMsg("property/index", up));
          return dataPathArr[dataLevel - up];
        }
        if (up > dataLevel)
          throw new Error(errorMsg("data", up));
        data = dataNames[dataLevel - up];
        if (!jsonPointer)
          return data;
      }
      let expr = data;
      const segments = jsonPointer.split("/");
      for (const segment of segments) {
        if (segment) {
          data = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)((0, util_1.unescapeJsonPointer)(segment))}`;
          expr = (0, codegen_1._)`${expr} && ${data}`;
        }
      }
      return expr;
      function errorMsg(pointerType, up) {
        return `Cannot access ${pointerType} ${up} levels up, current level is ${dataLevel}`;
      }
    }
    exports.getData = getData;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/runtime/validation_error.js
var require_validation_error = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/runtime/validation_error.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ValidationError = class extends Error {
      constructor(errors) {
        super("validation failed");
        this.errors = errors;
        this.ajv = this.validation = true;
      }
    };
    exports.default = ValidationError;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/ref_error.js
var require_ref_error = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/ref_error.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var resolve_1 = require_resolve();
    var MissingRefError = class extends Error {
      constructor(resolver, baseId, ref, msg) {
        super(msg || `can't resolve reference ${ref} from id ${baseId}`);
        this.missingRef = (0, resolve_1.resolveUrl)(resolver, baseId, ref);
        this.missingSchema = (0, resolve_1.normalizeId)((0, resolve_1.getFullPath)(resolver, this.missingRef));
      }
    };
    exports.default = MissingRefError;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/index.js
var require_compile = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveSchema = exports.getCompilingSchema = exports.resolveRef = exports.compileSchema = exports.SchemaEnv = void 0;
    var codegen_1 = require_codegen();
    var validation_error_1 = require_validation_error();
    var names_1 = require_names();
    var resolve_1 = require_resolve();
    var util_1 = require_util();
    var validate_1 = require_validate();
    var SchemaEnv = class {
      constructor(env) {
        var _a;
        this.refs = {};
        this.dynamicAnchors = {};
        let schema;
        if (typeof env.schema == "object")
          schema = env.schema;
        this.schema = env.schema;
        this.schemaId = env.schemaId;
        this.root = env.root || this;
        this.baseId = (_a = env.baseId) !== null && _a !== void 0 ? _a : (0, resolve_1.normalizeId)(schema === null || schema === void 0 ? void 0 : schema[env.schemaId || "$id"]);
        this.schemaPath = env.schemaPath;
        this.localRefs = env.localRefs;
        this.meta = env.meta;
        this.$async = schema === null || schema === void 0 ? void 0 : schema.$async;
        this.refs = {};
      }
    };
    exports.SchemaEnv = SchemaEnv;
    function compileSchema(sch) {
      const _sch = getCompilingSchema.call(this, sch);
      if (_sch)
        return _sch;
      const rootId = (0, resolve_1.getFullPath)(this.opts.uriResolver, sch.root.baseId);
      const { es5, lines } = this.opts.code;
      const { ownProperties } = this.opts;
      const gen = new codegen_1.CodeGen(this.scope, { es5, lines, ownProperties });
      let _ValidationError;
      if (sch.$async) {
        _ValidationError = gen.scopeValue("Error", {
          ref: validation_error_1.default,
          code: (0, codegen_1._)`require("ajv/dist/runtime/validation_error").default`
        });
      }
      const validateName = gen.scopeName("validate");
      sch.validateName = validateName;
      const schemaCxt = {
        gen,
        allErrors: this.opts.allErrors,
        data: names_1.default.data,
        parentData: names_1.default.parentData,
        parentDataProperty: names_1.default.parentDataProperty,
        dataNames: [names_1.default.data],
        dataPathArr: [codegen_1.nil],
        // TODO can its length be used as dataLevel if nil is removed?
        dataLevel: 0,
        dataTypes: [],
        definedProperties: /* @__PURE__ */ new Set(),
        topSchemaRef: gen.scopeValue("schema", this.opts.code.source === true ? { ref: sch.schema, code: (0, codegen_1.stringify)(sch.schema) } : { ref: sch.schema }),
        validateName,
        ValidationError: _ValidationError,
        schema: sch.schema,
        schemaEnv: sch,
        rootId,
        baseId: sch.baseId || rootId,
        schemaPath: codegen_1.nil,
        errSchemaPath: sch.schemaPath || (this.opts.jtd ? "" : "#"),
        errorPath: (0, codegen_1._)`""`,
        opts: this.opts,
        self: this
      };
      let sourceCode;
      try {
        this._compilations.add(sch);
        (0, validate_1.validateFunctionCode)(schemaCxt);
        gen.optimize(this.opts.code.optimize);
        const validateCode = gen.toString();
        sourceCode = `${gen.scopeRefs(names_1.default.scope)}return ${validateCode}`;
        if (this.opts.code.process)
          sourceCode = this.opts.code.process(sourceCode, sch);
        const makeValidate = new Function(`${names_1.default.self}`, `${names_1.default.scope}`, sourceCode);
        const validate2 = makeValidate(this, this.scope.get());
        this.scope.value(validateName, { ref: validate2 });
        validate2.errors = null;
        validate2.schema = sch.schema;
        validate2.schemaEnv = sch;
        if (sch.$async)
          validate2.$async = true;
        if (this.opts.code.source === true) {
          validate2.source = { validateName, validateCode, scopeValues: gen._values };
        }
        if (this.opts.unevaluated) {
          const { props, items } = schemaCxt;
          validate2.evaluated = {
            props: props instanceof codegen_1.Name ? void 0 : props,
            items: items instanceof codegen_1.Name ? void 0 : items,
            dynamicProps: props instanceof codegen_1.Name,
            dynamicItems: items instanceof codegen_1.Name
          };
          if (validate2.source)
            validate2.source.evaluated = (0, codegen_1.stringify)(validate2.evaluated);
        }
        sch.validate = validate2;
        return sch;
      } catch (e) {
        delete sch.validate;
        delete sch.validateName;
        if (sourceCode)
          this.logger.error("Error compiling schema, function code:", sourceCode);
        throw e;
      } finally {
        this._compilations.delete(sch);
      }
    }
    exports.compileSchema = compileSchema;
    function resolveRef(root, baseId, ref) {
      var _a;
      ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, ref);
      const schOrFunc = root.refs[ref];
      if (schOrFunc)
        return schOrFunc;
      let _sch = resolve.call(this, root, ref);
      if (_sch === void 0) {
        const schema = (_a = root.localRefs) === null || _a === void 0 ? void 0 : _a[ref];
        const { schemaId } = this.opts;
        if (schema)
          _sch = new SchemaEnv({ schema, schemaId, root, baseId });
      }
      if (_sch === void 0)
        return;
      return root.refs[ref] = inlineOrCompile.call(this, _sch);
    }
    exports.resolveRef = resolveRef;
    function inlineOrCompile(sch) {
      if ((0, resolve_1.inlineRef)(sch.schema, this.opts.inlineRefs))
        return sch.schema;
      return sch.validate ? sch : compileSchema.call(this, sch);
    }
    function getCompilingSchema(schEnv) {
      for (const sch of this._compilations) {
        if (sameSchemaEnv(sch, schEnv))
          return sch;
      }
    }
    exports.getCompilingSchema = getCompilingSchema;
    function sameSchemaEnv(s1, s2) {
      return s1.schema === s2.schema && s1.root === s2.root && s1.baseId === s2.baseId;
    }
    function resolve(root, ref) {
      let sch;
      while (typeof (sch = this.refs[ref]) == "string")
        ref = sch;
      return sch || this.schemas[ref] || resolveSchema2.call(this, root, ref);
    }
    function resolveSchema2(root, ref) {
      const p = this.opts.uriResolver.parse(ref);
      const refPath = (0, resolve_1._getFullPath)(this.opts.uriResolver, p);
      let baseId = (0, resolve_1.getFullPath)(this.opts.uriResolver, root.baseId, void 0);
      if (Object.keys(root.schema).length > 0 && refPath === baseId) {
        return getJsonPointer.call(this, p, root);
      }
      const id = (0, resolve_1.normalizeId)(refPath);
      const schOrRef = this.refs[id] || this.schemas[id];
      if (typeof schOrRef == "string") {
        const sch = resolveSchema2.call(this, root, schOrRef);
        if (typeof (sch === null || sch === void 0 ? void 0 : sch.schema) !== "object")
          return;
        return getJsonPointer.call(this, p, sch);
      }
      if (typeof (schOrRef === null || schOrRef === void 0 ? void 0 : schOrRef.schema) !== "object")
        return;
      if (!schOrRef.validate)
        compileSchema.call(this, schOrRef);
      if (id === (0, resolve_1.normalizeId)(ref)) {
        const { schema } = schOrRef;
        const { schemaId } = this.opts;
        const schId = schema[schemaId];
        if (schId)
          baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
        return new SchemaEnv({ schema, schemaId, root, baseId });
      }
      return getJsonPointer.call(this, p, schOrRef);
    }
    exports.resolveSchema = resolveSchema2;
    var PREVENT_SCOPE_CHANGE = /* @__PURE__ */ new Set([
      "properties",
      "patternProperties",
      "enum",
      "dependencies",
      "definitions"
    ]);
    function getJsonPointer(parsedRef, { baseId, schema, root }) {
      var _a;
      if (((_a = parsedRef.fragment) === null || _a === void 0 ? void 0 : _a[0]) !== "/")
        return;
      for (const part of parsedRef.fragment.slice(1).split("/")) {
        if (typeof schema === "boolean")
          return;
        const partSchema = schema[(0, util_1.unescapeFragment)(part)];
        if (partSchema === void 0)
          return;
        schema = partSchema;
        const schId = typeof schema === "object" && schema[this.opts.schemaId];
        if (!PREVENT_SCOPE_CHANGE.has(part) && schId) {
          baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
        }
      }
      let env;
      if (typeof schema != "boolean" && schema.$ref && !(0, util_1.schemaHasRulesButRef)(schema, this.RULES)) {
        const $ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schema.$ref);
        env = resolveSchema2.call(this, root, $ref);
      }
      const { schemaId } = this.opts;
      env = env || new SchemaEnv({ schema, schemaId, root, baseId });
      if (env.schema !== env.root.schema)
        return env;
      return void 0;
    }
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/refs/data.json
var require_data = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/refs/data.json"(exports, module) {
    module.exports = {
      $id: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
      description: "Meta-schema for $data reference (JSON AnySchema extension proposal)",
      type: "object",
      required: ["$data"],
      properties: {
        $data: {
          type: "string",
          anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }]
        }
      },
      additionalProperties: false
    };
  }
});

// ../../node_modules/.pnpm/fast-uri@3.1.7/node_modules/fast-uri/lib/utils.js
var require_utils = __commonJS({
  "../../node_modules/.pnpm/fast-uri@3.1.7/node_modules/fast-uri/lib/utils.js"(exports, module) {
    "use strict";
    var isUUID = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu);
    var isIPv4 = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
    var isPort = RegExp.prototype.test.bind(/^\d*$/u);
    var isHexPair = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu);
    var isUnreserved = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu);
    var isPathCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/]$/u);
    var isQueryFragmentCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/?]$/u);
    var isUserinfoCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:]$/u);
    var BYTE_HEX = new Array(256);
    {
      const HEX_DIGITS = "0123456789ABCDEF";
      for (let i = 0; i < 256; i++) {
        BYTE_HEX[i] = "%" + HEX_DIGITS[i >> 4] + HEX_DIGITS[i & 15];
      }
    }
    function percentEncodeNonAscii(cp) {
      if (cp < 2048) {
        return BYTE_HEX[192 | cp >> 6] + BYTE_HEX[128 | cp & 63];
      }
      if (cp < 65536) {
        return BYTE_HEX[224 | cp >> 12] + BYTE_HEX[128 | cp >> 6 & 63] + BYTE_HEX[128 | cp & 63];
      }
      return BYTE_HEX[240 | cp >> 18] + BYTE_HEX[128 | cp >> 12 & 63] + BYTE_HEX[128 | cp >> 6 & 63] + BYTE_HEX[128 | cp & 63];
    }
    function stringArrayToHexStripped(input) {
      let acc = "";
      let code = 0;
      let i = 0;
      for (i = 0; i < input.length; i++) {
        code = input[i].charCodeAt(0);
        if (code === 48) {
          continue;
        }
        if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) {
          return "";
        }
        acc += input[i];
        break;
      }
      for (i += 1; i < input.length; i++) {
        code = input[i].charCodeAt(0);
        if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) {
          return "";
        }
        acc += input[i];
      }
      return acc;
    }
    var isHextet = RegExp.prototype.test.bind(/^[\dA-Fa-f]{1,4}$/);
    var isIPvFuture = RegExp.prototype.test.bind(/^[vV][\dA-Fa-f]+\.[A-Za-z\d\-._~!$&'()*+,;=:]+$/);
    var isZoneCharacter = RegExp.prototype.test.bind(/^[A-Za-z\d\-._~]$/);
    var nonSimpleDomain = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
    function isZoneIdentifier(zone) {
      if (zone.length === 0) return false;
      for (let i = 0; i < zone.length; i++) {
        if (isZoneCharacter(zone[i])) continue;
        if (zone[i] === "%" && i + 2 < zone.length && isHexPair(zone.slice(i + 1, i + 3))) {
          i += 2;
          continue;
        }
        return false;
      }
      return true;
    }
    function compressIPv6ZeroRun(hextets) {
      let bestStart = -1;
      let bestLength = 0;
      let runStart = -1;
      let runLength = 0;
      for (let i = 0; i < hextets.length; i++) {
        if (hextets[i] === "0") {
          if (runStart === -1) runStart = i;
          runLength++;
          if (runLength > bestLength) {
            bestLength = runLength;
            bestStart = runStart;
          }
        } else {
          runStart = -1;
          runLength = 0;
        }
      }
      if (bestLength < 2) return hextets.join(":");
      const head = hextets.slice(0, bestStart).join(":");
      const tail = hextets.slice(bestStart + bestLength).join(":");
      return head + "::" + tail;
    }
    function normalizeIPv6Address(input) {
      const compression = input.indexOf("::");
      if (compression !== -1 && input.indexOf("::", compression + 1) !== -1) return void 0;
      const left = compression === -1 ? input.split(":") : input.slice(0, compression).split(":");
      const right = compression === -1 ? [] : input.slice(compression + 2).split(":");
      if (compression !== -1) {
        if (left.length === 1 && left[0] === "") left.length = 0;
        if (right.length === 1 && right[0] === "") right.length = 0;
      }
      const parts = left.concat(right);
      let hextetCount = 0;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part === "") return void 0;
        if (part.indexOf(".") !== -1) {
          if (i !== parts.length - 1 || compression !== -1 && right.length === 0 || !isIPv4(part)) return void 0;
          hextetCount += 2;
          continue;
        }
        if (!isHextet(part)) return void 0;
        parts[i] = parseInt(part, 16).toString(16);
        hextetCount++;
      }
      if (compression === -1) {
        if (hextetCount !== 8) return void 0;
        return compressIPv6ZeroRun(parts);
      }
      if (hextetCount >= 8) return void 0;
      const expanded = parts.slice(0, left.length);
      for (let i = hextetCount; i < 8; i++) expanded.push("0");
      for (let i = left.length; i < parts.length; i++) expanded.push(parts[i]);
      return compressIPv6ZeroRun(expanded);
    }
    function normalizeIPv6(host) {
      const bracketed = host[0] === "[" && host[host.length - 1] === "]";
      const hasBracket = host[0] === "[" || host[host.length - 1] === "]";
      if (hasBracket && !bracketed) return { host, isIPV6: false, error: true };
      let input = bracketed ? host.slice(1, -1) : host;
      if (bracketed && isIPvFuture(input)) {
        input = input.toLowerCase();
        return { host: `[${input}]`, escapedHost: input, isIPV6: false, isIPVFuture: true };
      }
      if (findToken(input, ":") < 2) {
        return { host, isIPV6: false, error: bracketed };
      }
      let zoneIdentifier = "";
      const zoneSeparator = input.indexOf("%");
      if (zoneSeparator !== -1) {
        const separatorLength = input.slice(zoneSeparator, zoneSeparator + 3).toLowerCase() === "%25" ? 3 : 1;
        zoneIdentifier = input.slice(zoneSeparator + separatorLength);
        if (!isZoneIdentifier(zoneIdentifier)) return { host, isIPV6: false, error: true };
        input = input.slice(0, zoneSeparator);
      }
      const address = normalizeIPv6Address(input);
      if (address === void 0) return { host, isIPV6: false, error: true };
      return {
        host: address + (zoneIdentifier ? "%" + zoneIdentifier : ""),
        escapedHost: address + (zoneIdentifier ? "%25" + zoneIdentifier : ""),
        isIPV6: true
      };
    }
    function findToken(str, token) {
      let ind = 0;
      for (let i = 0; i < str.length; i++) {
        if (str[i] === token) ind++;
      }
      return ind;
    }
    function removeDotSegments(path) {
      let input = path;
      const output = [];
      let nextSlash = -1;
      let len = 0;
      while (len = input.length) {
        if (len === 1) {
          if (input === ".") {
            break;
          } else if (input === "/") {
            output.push("/");
            break;
          } else {
            output.push(input);
            break;
          }
        } else if (len === 2) {
          if (input[0] === ".") {
            if (input[1] === ".") {
              break;
            } else if (input[1] === "/") {
              input = input.slice(2);
              continue;
            }
          } else if (input[0] === "/") {
            if (input[1] === "." || input[1] === "/") {
              output.push("/");
              break;
            }
          }
        } else if (len === 3) {
          if (input === "/..") {
            if (output.length !== 0) {
              output.pop();
            }
            output.push("/");
            break;
          }
        }
        if (input[0] === ".") {
          if (input[1] === ".") {
            if (input[2] === "/") {
              input = input.slice(3);
              continue;
            }
          } else if (input[1] === "/") {
            input = input.slice(2);
            continue;
          }
        } else if (input[0] === "/") {
          if (input[1] === ".") {
            if (input[2] === "/") {
              input = input.slice(2);
              continue;
            } else if (input[2] === ".") {
              if (input[3] === "/") {
                input = input.slice(3);
                if (output.length !== 0) {
                  output.pop();
                }
                continue;
              }
            }
          }
        }
        if ((nextSlash = input.indexOf("/", 1)) === -1) {
          output.push(input);
          break;
        } else {
          output.push(input.slice(0, nextSlash));
          input = input.slice(nextSlash);
        }
      }
      return output.join("");
    }
    var HOST_DELIMS = { "@": "%40", "/": "%2F", "?": "%3F", "#": "%23", ":": "%3A" };
    var HOST_DELIM_RE = /[@/?#:]/g;
    var HOST_DELIM_NO_COLON_RE = /[@/?#]/g;
    function reescapeHostDelimiters(host, isIP) {
      const re = isIP ? HOST_DELIM_NO_COLON_RE : HOST_DELIM_RE;
      re.lastIndex = 0;
      return host.replace(re, (ch) => HOST_DELIMS[ch]);
    }
    function normalizePercentEncoding(input, decodeUnreserved = false) {
      if (input.indexOf("%") === -1) {
        return input;
      }
      let output = "";
      for (let i = 0; i < input.length; i++) {
        if (input[i] === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            const normalizedHex = hex.toUpperCase();
            const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
            if (decodeUnreserved && isUnreserved(decoded)) {
              output += decoded;
            } else {
              output += "%" + normalizedHex;
            }
            i += 2;
            continue;
          }
        }
        output += input[i];
      }
      return output;
    }
    function normalizePathEncoding(input) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            const normalizedHex = hex.toUpperCase();
            const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
            if (decoded !== "." && isUnreserved(decoded)) {
              output += decoded;
            } else {
              output += "%" + normalizedHex;
            }
            i += 2;
            continue;
          }
        }
        if (isPathCharacter(ch)) {
          output += ch;
        } else {
          const code = input.charCodeAt(i);
          if (code < 128) {
            output += isEscapeSafe(code) ? ch : BYTE_HEX[code];
          } else if (code < 55296 || code > 57343) {
            output += percentEncodeNonAscii(code);
          } else if (code <= 56319 && i + 1 < input.length) {
            const low = input.charCodeAt(i + 1);
            if (low >= 56320 && low <= 57343) {
              output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
              i++;
            } else {
              output += percentEncodeNonAscii(65533);
            }
          } else {
            output += percentEncodeNonAscii(65533);
          }
        }
      }
      return output;
    }
    function serializePathEncoding(input, pathNoScheme = false) {
      let output = "";
      let firstSegment = pathNoScheme && input[0] !== "/";
      for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            output += "%" + hex.toUpperCase();
            i += 2;
            continue;
          }
        }
        if (ch === "/") {
          firstSegment = false;
        }
        if (isPathCharacter(ch) && (ch !== ":" || !firstSegment)) {
          output += ch;
        } else {
          const code = input.charCodeAt(i);
          if (code < 128) {
            output += BYTE_HEX[code];
          } else if (code < 55296 || code > 57343) {
            output += percentEncodeNonAscii(code);
          } else if (code <= 56319 && i + 1 < input.length) {
            const low = input.charCodeAt(i + 1);
            if (low >= 56320 && low <= 57343) {
              output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
              i++;
            } else {
              output += percentEncodeNonAscii(65533);
            }
          } else {
            output += percentEncodeNonAscii(65533);
          }
        }
      }
      return output;
    }
    function encodeComponent(input, isAllowed) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            output += "%" + hex.toUpperCase();
            i += 2;
            continue;
          }
        }
        if (isAllowed(ch)) {
          output += ch;
        } else {
          const code = input.charCodeAt(i);
          if (code < 128) {
            output += BYTE_HEX[code];
          } else if (code < 55296 || code > 57343) {
            output += percentEncodeNonAscii(code);
          } else if (code <= 56319 && i + 1 < input.length) {
            const low = input.charCodeAt(i + 1);
            if (low >= 56320 && low <= 57343) {
              output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
              i++;
            } else {
              output += percentEncodeNonAscii(65533);
            }
          } else {
            output += percentEncodeNonAscii(65533);
          }
        }
      }
      return output;
    }
    function encodeUserinfo(input) {
      return encodeComponent(input, isUserinfoCharacter);
    }
    function encodeQuery(input) {
      return encodeComponent(input, isQueryFragmentCharacter);
    }
    function encodeFragment(input) {
      return encodeComponent(input, isQueryFragmentCharacter);
    }
    function isEscapeSafe(cp) {
      return cp >= 48 && cp <= 57 || cp >= 65 && cp <= 90 || cp >= 97 && cp <= 122 || cp === 42 || cp === 43 || cp === 45 || cp === 46 || cp === 47 || cp === 64 || cp === 95;
    }
    function normalizeQueryFragmentEncoding(input) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            const normalizedHex = hex.toUpperCase();
            const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
            if (isUnreserved(decoded)) {
              output += decoded;
            } else {
              output += "%" + normalizedHex;
            }
            i += 2;
            continue;
          }
        }
        if (isQueryFragmentCharacter(ch)) {
          output += ch;
        } else {
          const code = input.charCodeAt(i);
          if (code < 128) {
            output += isEscapeSafe(code) ? ch : BYTE_HEX[code];
          } else if (code < 55296 || code > 57343) {
            output += percentEncodeNonAscii(code);
          } else if (code <= 56319 && i + 1 < input.length) {
            const low = input.charCodeAt(i + 1);
            if (low >= 56320 && low <= 57343) {
              output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
              i++;
            } else {
              output += percentEncodeNonAscii(65533);
            }
          } else {
            output += percentEncodeNonAscii(65533);
          }
        }
      }
      return output;
    }
    function escapePreservingEscapes(input) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        if (input[i] === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            output += "%" + hex.toUpperCase();
            i += 2;
            continue;
          }
        }
        output += escape(input[i]);
      }
      return output;
    }
    function recomposeAuthority(component) {
      const uriTokens = [];
      if (component.userinfo !== void 0) {
        uriTokens.push(encodeUserinfo(component.userinfo));
        uriTokens.push("@");
      }
      if (component.host !== void 0) {
        let host = component.host;
        if (!isIPv4(host)) {
          let ipV6res = normalizeIPv6(host);
          if (ipV6res.isIPV6 !== true && ipV6res.isIPVFuture !== true) {
            host = normalizePercentEncoding(host, true);
            ipV6res = normalizeIPv6(host);
          }
          if (ipV6res.isIPV6 === true || ipV6res.isIPVFuture === true) {
            host = `[${ipV6res.escapedHost}]`;
          } else {
            host = reescapeHostDelimiters(host, false);
          }
        }
        uriTokens.push(host);
      }
      if (typeof component.port === "number" || typeof component.port === "string") {
        const port = String(component.port);
        if (!isPort(port)) {
          throw new TypeError("URI port is malformed.");
        }
        uriTokens.push(":");
        uriTokens.push(port);
      }
      return uriTokens.length ? uriTokens.join("") : void 0;
    }
    module.exports = {
      nonSimpleDomain,
      recomposeAuthority,
      reescapeHostDelimiters,
      normalizePercentEncoding,
      normalizePathEncoding,
      serializePathEncoding,
      normalizeQueryFragmentEncoding,
      encodeUserinfo,
      encodeQuery,
      encodeFragment,
      escapePreservingEscapes,
      removeDotSegments,
      isIPv4,
      isUUID,
      normalizeIPv6,
      stringArrayToHexStripped
    };
  }
});

// ../../node_modules/.pnpm/fast-uri@3.1.7/node_modules/fast-uri/lib/schemes.js
var require_schemes = __commonJS({
  "../../node_modules/.pnpm/fast-uri@3.1.7/node_modules/fast-uri/lib/schemes.js"(exports, module) {
    "use strict";
    var { isUUID } = require_utils();
    var URN_REG = /^([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-./:;=@]|%[\da-f]{2})+)$/iu;
    var supportedSchemeNames = (
      /** @type {const} */
      [
        "http",
        "https",
        "ws",
        "wss",
        "urn",
        "urn:uuid"
      ]
    );
    function isValidSchemeName(name) {
      return supportedSchemeNames.indexOf(
        /** @type {*} */
        name
      ) !== -1;
    }
    function wsIsSecure(wsComponent) {
      if (wsComponent.secure === true) {
        return true;
      } else if (wsComponent.secure === false) {
        return false;
      } else if (wsComponent.scheme) {
        return wsComponent.scheme.length === 3 && (wsComponent.scheme[0] === "w" || wsComponent.scheme[0] === "W") && (wsComponent.scheme[1] === "s" || wsComponent.scheme[1] === "S") && (wsComponent.scheme[2] === "s" || wsComponent.scheme[2] === "S");
      } else {
        return false;
      }
    }
    function httpParse(component) {
      if (!component.host) {
        component.error = component.error || "HTTP URIs must have a host.";
      }
      return component;
    }
    function httpSerialize(component) {
      const secure = String(component.scheme).toLowerCase() === "https";
      if (component.port === (secure ? 443 : 80) || component.port === "") {
        component.port = void 0;
      }
      if (!component.path) {
        component.path = "/";
      }
      return component;
    }
    function wsParse(wsComponent) {
      wsComponent.secure = wsIsSecure(wsComponent);
      wsComponent.resourceName = (wsComponent.path || "/") + (wsComponent.query ? "?" + wsComponent.query : "");
      wsComponent.path = void 0;
      wsComponent.query = void 0;
      return wsComponent;
    }
    function wsSerialize(wsComponent) {
      if (wsComponent.port === (wsIsSecure(wsComponent) ? 443 : 80) || wsComponent.port === "") {
        wsComponent.port = void 0;
      }
      if (typeof wsComponent.secure === "boolean") {
        wsComponent.scheme = wsComponent.secure ? "wss" : "ws";
        wsComponent.secure = void 0;
      }
      if (wsComponent.resourceName) {
        const queryIndex = wsComponent.resourceName.indexOf("?");
        const path = queryIndex === -1 ? wsComponent.resourceName : wsComponent.resourceName.slice(0, queryIndex);
        wsComponent.path = path && path !== "/" ? path : void 0;
        wsComponent.query = queryIndex === -1 ? void 0 : wsComponent.resourceName.slice(queryIndex + 1);
        wsComponent.resourceName = void 0;
      }
      wsComponent.fragment = void 0;
      return wsComponent;
    }
    function urnParse(urnComponent, options) {
      if (!urnComponent.path) {
        urnComponent.error = "URN can not be parsed";
        return urnComponent;
      }
      const matches = urnComponent.path.match(URN_REG);
      if (matches && matches[0] === urnComponent.path) {
        const scheme = options.scheme || urnComponent.scheme || "urn";
        urnComponent.nid = matches[1].toLowerCase();
        urnComponent.nss = matches[2];
        const urnScheme = `${scheme}:${options.nid || urnComponent.nid}`;
        const schemeHandler = getSchemeHandler(urnScheme);
        urnComponent.path = void 0;
        if (schemeHandler) {
          urnComponent = schemeHandler.parse(urnComponent, options);
        }
      } else {
        urnComponent.error = urnComponent.error || "URN can not be parsed.";
      }
      return urnComponent;
    }
    function urnSerialize(urnComponent, options) {
      if (urnComponent.nid === void 0) {
        throw new Error("URN without nid cannot be serialized");
      }
      const scheme = options.scheme || urnComponent.scheme || "urn";
      const nid = urnComponent.nid.toLowerCase();
      const urnScheme = `${scheme}:${options.nid || nid}`;
      const schemeHandler = getSchemeHandler(urnScheme);
      if (schemeHandler) {
        urnComponent = schemeHandler.serialize(urnComponent, options);
      }
      const uriComponent = urnComponent;
      const nss = urnComponent.nss;
      uriComponent.path = `${nid || options.nid}:${nss}`;
      options.skipEscape = true;
      return uriComponent;
    }
    function urnuuidParse(urnComponent, options) {
      const uuidComponent = urnComponent;
      uuidComponent.uuid = uuidComponent.nss;
      uuidComponent.nss = void 0;
      if (!options.tolerant && (!uuidComponent.uuid || !isUUID(uuidComponent.uuid))) {
        uuidComponent.error = uuidComponent.error || "UUID is not valid.";
      }
      return uuidComponent;
    }
    function urnuuidSerialize(uuidComponent) {
      const urnComponent = uuidComponent;
      urnComponent.nss = (uuidComponent.uuid || "").toLowerCase();
      return urnComponent;
    }
    var http = (
      /** @type {SchemeHandler} */
      {
        scheme: "http",
        domainHost: true,
        parse: httpParse,
        serialize: httpSerialize
      }
    );
    var https = (
      /** @type {SchemeHandler} */
      {
        scheme: "https",
        domainHost: http.domainHost,
        parse: httpParse,
        serialize: httpSerialize
      }
    );
    var ws = (
      /** @type {SchemeHandler} */
      {
        scheme: "ws",
        domainHost: true,
        parse: wsParse,
        serialize: wsSerialize
      }
    );
    var wss = (
      /** @type {SchemeHandler} */
      {
        scheme: "wss",
        domainHost: ws.domainHost,
        parse: ws.parse,
        serialize: ws.serialize
      }
    );
    var urn = (
      /** @type {SchemeHandler} */
      {
        scheme: "urn",
        parse: urnParse,
        serialize: urnSerialize,
        skipNormalize: true
      }
    );
    var urnuuid = (
      /** @type {SchemeHandler} */
      {
        scheme: "urn:uuid",
        parse: urnuuidParse,
        serialize: urnuuidSerialize,
        skipNormalize: true
      }
    );
    var SCHEMES = (
      /** @type {Record<SchemeName, SchemeHandler>} */
      {
        http,
        https,
        ws,
        wss,
        urn,
        "urn:uuid": urnuuid
      }
    );
    Object.setPrototypeOf(SCHEMES, null);
    function getSchemeHandler(scheme) {
      return scheme && (SCHEMES[
        /** @type {SchemeName} */
        scheme
      ] || SCHEMES[
        /** @type {SchemeName} */
        scheme.toLowerCase()
      ]) || void 0;
    }
    module.exports = {
      wsIsSecure,
      SCHEMES,
      isValidSchemeName,
      getSchemeHandler
    };
  }
});

// ../../node_modules/.pnpm/fast-uri@3.1.7/node_modules/fast-uri/index.js
var require_fast_uri = __commonJS({
  "../../node_modules/.pnpm/fast-uri@3.1.7/node_modules/fast-uri/index.js"(exports, module) {
    "use strict";
    var { normalizeIPv6, removeDotSegments, recomposeAuthority, normalizePercentEncoding, normalizePathEncoding, serializePathEncoding, normalizeQueryFragmentEncoding, encodeQuery, encodeFragment, reescapeHostDelimiters, isIPv4, nonSimpleDomain } = require_utils();
    var { SCHEMES, getSchemeHandler } = require_schemes();
    var VALID_SCHEME = /^[A-Za-z][A-Za-z0-9+.-]*$/u;
    var MALFORMED_SCHEME_ERROR = "URI scheme is malformed.";
    function decodeValidScheme(scheme) {
      const decodedScheme = unescape(String(scheme));
      if (!VALID_SCHEME.test(decodedScheme)) {
        throw new TypeError(MALFORMED_SCHEME_ERROR);
      }
      return decodedScheme;
    }
    function normalize(uri, options) {
      if (typeof uri === "string") {
        uri = /** @type {T} */
        normalizeString(uri, options);
      } else if (typeof uri === "object") {
        uri = /** @type {T} */
        parse(serialize(uri, options), options);
      }
      return uri;
    }
    function resolve(baseURI, relativeURI, options) {
      const schemelessOptions = options ? Object.assign({ scheme: "null" }, options) : { scheme: "null" };
      const {
        parsed: baseParsed,
        malformedAuthorityOrPort: baseMalformed,
        malformedPercentEncoding: baseMalformedPercentEncoding,
        malformedSchemeSpecific: baseMalformedSchemeSpecific,
        malformedHost: baseMalformedHost,
        malformedScheme: baseMalformedScheme
      } = parseWithStatus(baseURI, schemelessOptions);
      const {
        parsed: relativeParsed,
        malformedAuthorityOrPort: relativeMalformed,
        malformedPercentEncoding: relativeMalformedPercentEncoding,
        malformedSchemeSpecific: relativeMalformedSchemeSpecific,
        malformedHost: relativeMalformedHost,
        malformedScheme: relativeMalformedScheme
      } = parseWithStatus(relativeURI, schemelessOptions);
      if (baseMalformed || relativeMalformed || baseMalformedPercentEncoding || relativeMalformedPercentEncoding || baseMalformedSchemeSpecific || relativeMalformedSchemeSpecific || baseMalformedHost || relativeMalformedHost || baseMalformedScheme || relativeMalformedScheme) {
        throw new Error(baseParsed.error || relativeParsed.error || "URI is malformed.");
      }
      const resolved = resolveComponent(baseParsed, relativeParsed, schemelessOptions, true);
      const resolvedSchemeHandler = getSchemeHandler(options && options.scheme || resolved.scheme);
      const resolvedHost = resolved.host;
      const resolvedHostIsIP = resolvedHost !== void 0 && resolvedHost !== "" && (isIPv4(resolvedHost) || normalizeIPv6(resolvedHost).isIPV6);
      canonicalizeHost(resolved, options || {}, resolvedSchemeHandler, resolvedHostIsIP);
      const encodedASCIIHost = resolvedHost && resolvedHost.indexOf("%") !== -1 && !new RegExp("\\P{ASCII}", "u").test(resolvedHost);
      if (resolved.error && !encodedASCIIHost) {
        throw new Error(resolved.error);
      }
      schemelessOptions.skipEscape = true;
      return serialize(resolved, schemelessOptions);
    }
    function resolveComponent(base, relative, options, skipNormalization) {
      const target = {};
      if (!skipNormalization) {
        base = parse(serialize(base, options), options);
        relative = parse(serialize(relative, options), options);
      }
      options = options || {};
      if (!options.tolerant && relative.scheme) {
        target.scheme = relative.scheme;
        target.userinfo = relative.userinfo;
        target.host = relative.host;
        target.port = relative.port;
        target.path = removeDotSegments(relative.path || "");
        target.query = relative.query;
      } else {
        if (relative.userinfo !== void 0 || relative.host !== void 0 || relative.port !== void 0) {
          target.userinfo = relative.userinfo;
          target.host = relative.host;
          target.port = relative.port;
          target.path = removeDotSegments(relative.path || "");
          target.query = relative.query;
        } else {
          if (!relative.path) {
            target.path = base.path;
            if (relative.query !== void 0) {
              target.query = relative.query;
            } else {
              target.query = base.query;
            }
          } else {
            if (relative.path[0] === "/") {
              target.path = removeDotSegments(relative.path);
            } else {
              if ((base.userinfo !== void 0 || base.host !== void 0 || base.port !== void 0) && !base.path) {
                target.path = "/" + relative.path;
              } else if (!base.path) {
                target.path = relative.path;
              } else {
                target.path = base.path.slice(0, base.path.lastIndexOf("/") + 1) + relative.path;
              }
              target.path = removeDotSegments(target.path);
            }
            target.query = relative.query;
          }
          target.userinfo = base.userinfo;
          target.host = base.host;
          target.port = base.port;
        }
        target.scheme = base.scheme;
      }
      target.fragment = relative.fragment;
      return target;
    }
    function equal(uriA, uriB, options) {
      const normalizedA = normalizeComparableURI(uriA, options);
      const normalizedB = normalizeComparableURI(uriB, options);
      return normalizedA !== void 0 && normalizedB !== void 0 && normalizedA === normalizedB;
    }
    function serialize(cmpts, opts) {
      const component = {
        host: cmpts.host,
        scheme: cmpts.scheme,
        userinfo: cmpts.userinfo,
        port: cmpts.port,
        path: cmpts.path,
        query: cmpts.query,
        nid: cmpts.nid,
        nss: cmpts.nss,
        uuid: cmpts.uuid,
        fragment: cmpts.fragment,
        reference: cmpts.reference,
        resourceName: cmpts.resourceName,
        secure: cmpts.secure,
        error: ""
      };
      const options = Object.assign({}, opts);
      const uriTokens = [];
      if (component.scheme) {
        component.scheme = decodeValidScheme(component.scheme);
      }
      const schemeHandler = getSchemeHandler(options.scheme || component.scheme);
      if (schemeHandler && schemeHandler.serialize) schemeHandler.serialize(component, options);
      const hasAuthority = component.userinfo !== void 0 || component.host !== void 0 || component.port !== void 0;
      const pathNoScheme = !options.skipEscape && component.scheme === void 0 && !hasAuthority;
      if (component.path !== void 0) {
        if (!options.skipEscape) {
          component.path = serializePathEncoding(component.path, pathNoScheme);
        } else {
          component.path = normalizePercentEncoding(component.path);
        }
      }
      if (options.reference !== "suffix" && component.scheme) {
        component.scheme = decodeValidScheme(component.scheme);
        uriTokens.push(component.scheme, ":");
      }
      const authority = recomposeAuthority(component);
      if (authority !== void 0) {
        if (options.reference !== "suffix") {
          uriTokens.push("//");
        }
        uriTokens.push(authority);
        if (component.path && component.path[0] !== "/") {
          uriTokens.push("/");
        }
      }
      if (component.path !== void 0) {
        let s = component.path;
        if (!options.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) {
          s = removeDotSegments(s);
        }
        if (pathNoScheme) {
          s = serializePathEncoding(s, true);
        }
        if (authority === void 0 && s[0] === "/" && s[1] === "/") {
          s = "/%2F" + s.slice(2);
        }
        uriTokens.push(s);
      }
      if (component.query !== void 0) {
        uriTokens.push("?", encodeQuery(component.query));
      }
      if (component.fragment !== void 0) {
        uriTokens.push("#", encodeFragment(component.fragment));
      }
      return uriTokens.join("");
    }
    var URI_PARSE = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
    var AUTHORITY_PREFIX = /^(?:[^#/:?]+:)?\/\/([^/?#]*)/;
    var AUTHORITY_INTRODUCER_REGION = /^(?:[^#/:?]+:)?([/\\\t\n\r]*)/;
    function getParseError(parsed, matches) {
      if (matches[2] !== void 0 && parsed.path && parsed.path[0] !== "/") {
        return 'URI path must start with "/" when authority is present.';
      }
      if (typeof parsed.port === "number" && (parsed.port < 0 || parsed.port > 65535)) {
        return "URI port is malformed.";
      }
      return void 0;
    }
    function hasMalformedPercentEncoding(component) {
      if (component === void 0) return false;
      let percent = component.indexOf("%");
      while (percent !== -1) {
        if (percent + 2 >= component.length || !/^[\da-f]{2}$/iu.test(component.slice(percent + 1, percent + 3))) {
          return true;
        }
        percent = component.indexOf("%", percent + 3);
      }
      return false;
    }
    function isIPLiteral(host) {
      return host[0] === "[" && host[host.length - 1] === "]";
    }
    function hasMalformedComponentPercentEncoding(matches) {
      const host = matches[4];
      return hasMalformedPercentEncoding(matches[3]) || host !== void 0 && !isIPLiteral(host) && hasMalformedPercentEncoding(host) || hasMalformedPercentEncoding(matches[6]) || hasMalformedPercentEncoding(matches[7]) || hasMalformedPercentEncoding(matches[8]);
    }
    function canonicalizeHost(parsed, options, schemeHandler, isIP) {
      if (!options.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport) && parsed.host && !isIPLiteral(parsed.host) && (options.domainHost || schemeHandler && schemeHandler.domainHost) && isIP === false && nonSimpleDomain(parsed.host)) {
        try {
          parsed.host = new URL("http://" + parsed.host).hostname;
        } catch (e) {
          parsed.error = parsed.error || "Host's domain name can not be converted to ASCII: " + e;
          return true;
        }
      }
      return false;
    }
    function parseWithStatus(uri, opts) {
      const options = Object.assign({}, opts);
      const parsed = {
        scheme: void 0,
        userinfo: void 0,
        host: "",
        port: void 0,
        path: "",
        query: void 0,
        fragment: void 0
      };
      let malformedAuthorityOrPort = false;
      let malformedPercentEncoding = false;
      let malformedSchemeSpecific = false;
      let malformedHost = false;
      let malformedIPLiteral = false;
      let malformedScheme = false;
      let isIP = false;
      if (options.reference === "suffix") {
        if (options.scheme) {
          uri = options.scheme + ":" + uri;
        } else {
          uri = "//" + uri;
        }
      }
      const authorityMatch = uri.match(AUTHORITY_PREFIX);
      if (authorityMatch !== null && authorityMatch[1].indexOf("\\") !== -1) {
        parsed.error = "URI authority must not contain a literal backslash.";
        malformedAuthorityOrPort = true;
      }
      const introducerMatch = uri.match(AUTHORITY_INTRODUCER_REGION);
      if (introducerMatch !== null) {
        const region = introducerMatch[1];
        const normalizedRegion = region.replace(/[\t\n\r]/g, "");
        if (normalizedRegion.length >= 2) {
          if (normalizedRegion.slice(0, 2) !== "//") {
            parsed.error = parsed.error || "URI authority must not contain a literal backslash.";
            malformedAuthorityOrPort = true;
          } else if (region.length !== normalizedRegion.length) {
            parsed.error = parsed.error || "URI authority introducer must not contain whitespace.";
            malformedAuthorityOrPort = true;
          }
        }
      }
      const matches = uri.match(URI_PARSE);
      if (matches) {
        parsed.scheme = matches[1];
        parsed.userinfo = matches[3];
        parsed.host = matches[4];
        parsed.port = parseInt(matches[5], 10);
        parsed.path = matches[6] || "";
        parsed.query = matches[7];
        parsed.fragment = matches[8];
        if (parsed.scheme !== void 0) {
          const decodedScheme = unescape(parsed.scheme);
          if (VALID_SCHEME.test(decodedScheme)) {
            parsed.scheme = decodedScheme.toLowerCase();
          } else {
            parsed.error = parsed.error || MALFORMED_SCHEME_ERROR;
            malformedScheme = true;
          }
        }
        malformedPercentEncoding = hasMalformedComponentPercentEncoding(matches);
        if (malformedPercentEncoding) {
          parsed.error = parsed.error || "URI contains malformed percent-encoding.";
        }
        if (isNaN(parsed.port)) {
          parsed.port = matches[5];
        }
        const parseError = getParseError(parsed, matches);
        if (parseError !== void 0) {
          parsed.error = parsed.error || parseError;
          malformedAuthorityOrPort = true;
        }
        if (parsed.host) {
          const ipv4result = isIPv4(parsed.host);
          if (ipv4result === false) {
            const bracketedIPLiteral = isIPLiteral(parsed.host);
            const hasIPLiteralBracket = parsed.host.indexOf("[") !== -1 || parsed.host.indexOf("]") !== -1;
            const ipv6result = normalizeIPv6(parsed.host);
            isIP = ipv6result.isIPV6 || ipv6result.isIPVFuture === true;
            malformedIPLiteral = hasIPLiteralBracket && (!bracketedIPLiteral || ipv6result.error === true);
            parsed.host = isIP ? ipv6result.host : ipv6result.host.toLowerCase();
            if (malformedIPLiteral) {
              parsed.error = parsed.error || "URI host is malformed.";
              malformedAuthorityOrPort = true;
            }
          } else {
            isIP = true;
          }
        }
        if (parsed.scheme === void 0 && parsed.userinfo === void 0 && parsed.host === void 0 && parsed.port === void 0 && parsed.query === void 0 && !parsed.path) {
          parsed.reference = "same-document";
        } else if (parsed.scheme === void 0) {
          parsed.reference = "relative";
        } else if (parsed.fragment === void 0) {
          parsed.reference = "absolute";
        } else {
          parsed.reference = "uri";
        }
        if (options.reference && options.reference !== "suffix" && options.reference !== parsed.reference) {
          parsed.error = parsed.error || "URI is not a " + options.reference + " reference.";
        }
        const schemeHandler = getSchemeHandler(options.scheme || parsed.scheme);
        if (!malformedIPLiteral) {
          malformedHost = canonicalizeHost(parsed, options, schemeHandler, isIP);
        }
        if (!schemeHandler || schemeHandler && !schemeHandler.skipNormalize) {
          if (uri.indexOf("%") !== -1) {
            if (parsed.host !== void 0 && !malformedIPLiteral) {
              const host = isIP ? parsed.host : normalizePercentEncoding(parsed.host, true);
              parsed.host = reescapeHostDelimiters(host, isIP);
            }
          }
          if (parsed.path) {
            parsed.path = normalizePathEncoding(parsed.path);
          }
          if (parsed.query) {
            parsed.query = normalizeQueryFragmentEncoding(parsed.query);
          }
          if (parsed.fragment) {
            parsed.fragment = normalizeQueryFragmentEncoding(parsed.fragment);
          }
        }
        if (schemeHandler && schemeHandler.parse) {
          schemeHandler.parse(parsed, options);
          if (schemeHandler === SCHEMES.urn && parsed.nid === void 0) {
            malformedSchemeSpecific = true;
          }
        }
      } else {
        parsed.error = parsed.error || "URI can not be parsed.";
      }
      return { parsed, malformedAuthorityOrPort, malformedPercentEncoding, malformedSchemeSpecific, malformedHost, malformedScheme };
    }
    function parse(uri, opts) {
      return parseWithStatus(uri, opts).parsed;
    }
    function normalizeString(uri, opts) {
      return normalizeStringWithStatus(uri, opts).normalized;
    }
    function normalizeStringWithStatus(uri, opts) {
      const { parsed, malformedAuthorityOrPort, malformedPercentEncoding, malformedSchemeSpecific, malformedHost, malformedScheme } = parseWithStatus(uri, opts);
      return {
        normalized: malformedAuthorityOrPort || malformedPercentEncoding || malformedSchemeSpecific || malformedHost || malformedScheme ? uri : serialize(parsed, opts),
        malformedAuthorityOrPort,
        malformedPercentEncoding,
        malformedSchemeSpecific,
        malformedHost,
        malformedScheme
      };
    }
    function normalizeComparableURI(uri, opts) {
      if (typeof uri !== "string" && typeof uri !== "object") {
        return void 0;
      }
      let value;
      try {
        value = typeof uri === "string" ? uri : serialize(uri, opts);
      } catch {
        return void 0;
      }
      const { normalized, malformedAuthorityOrPort, malformedPercentEncoding, malformedSchemeSpecific, malformedHost, malformedScheme } = normalizeStringWithStatus(value, opts);
      return malformedAuthorityOrPort || malformedPercentEncoding || malformedSchemeSpecific || malformedHost || malformedScheme ? void 0 : normalized;
    }
    var fastUri = {
      SCHEMES,
      normalize,
      resolve,
      resolveComponent,
      equal,
      serialize,
      parse
    };
    module.exports = fastUri;
    module.exports.default = fastUri;
    module.exports.fastUri = fastUri;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/runtime/uri.js
var require_uri = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/runtime/uri.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var uri = require_fast_uri();
    uri.code = 'require("ajv/dist/runtime/uri").default';
    exports.default = uri;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/core.js
var require_core = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/core.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
    var validate_1 = require_validate();
    Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
      return validate_1.KeywordCxt;
    } });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return codegen_1._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return codegen_1.str;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return codegen_1.stringify;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return codegen_1.nil;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return codegen_1.Name;
    } });
    Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
      return codegen_1.CodeGen;
    } });
    var validation_error_1 = require_validation_error();
    var ref_error_1 = require_ref_error();
    var rules_1 = require_rules();
    var compile_1 = require_compile();
    var codegen_2 = require_codegen();
    var resolve_1 = require_resolve();
    var dataType_1 = require_dataType();
    var util_1 = require_util();
    var $dataRefSchema = require_data();
    var uri_1 = require_uri();
    var defaultRegExp = (str, flags) => new RegExp(str, flags);
    defaultRegExp.code = "new RegExp";
    var META_IGNORE_OPTIONS = ["removeAdditional", "useDefaults", "coerceTypes"];
    var EXT_SCOPE_NAMES = /* @__PURE__ */ new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error"
    ]);
    var removedOptions = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    };
    var deprecatedOptions = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    };
    var MAX_EXPRESSION = 200;
    function requiredOptions(o) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
      const s = o.strict;
      const _optz = (_a = o.code) === null || _a === void 0 ? void 0 : _a.optimize;
      const optimize = _optz === true || _optz === void 0 ? 1 : _optz || 0;
      const regExp = (_c = (_b = o.code) === null || _b === void 0 ? void 0 : _b.regExp) !== null && _c !== void 0 ? _c : defaultRegExp;
      const uriResolver = (_d = o.uriResolver) !== null && _d !== void 0 ? _d : uri_1.default;
      return {
        strictSchema: (_f = (_e = o.strictSchema) !== null && _e !== void 0 ? _e : s) !== null && _f !== void 0 ? _f : true,
        strictNumbers: (_h = (_g = o.strictNumbers) !== null && _g !== void 0 ? _g : s) !== null && _h !== void 0 ? _h : true,
        strictTypes: (_k = (_j = o.strictTypes) !== null && _j !== void 0 ? _j : s) !== null && _k !== void 0 ? _k : "log",
        strictTuples: (_m = (_l = o.strictTuples) !== null && _l !== void 0 ? _l : s) !== null && _m !== void 0 ? _m : "log",
        strictRequired: (_p = (_o = o.strictRequired) !== null && _o !== void 0 ? _o : s) !== null && _p !== void 0 ? _p : false,
        code: o.code ? { ...o.code, optimize, regExp } : { optimize, regExp },
        loopRequired: (_q = o.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
        loopEnum: (_r = o.loopEnum) !== null && _r !== void 0 ? _r : MAX_EXPRESSION,
        meta: (_s = o.meta) !== null && _s !== void 0 ? _s : true,
        messages: (_t = o.messages) !== null && _t !== void 0 ? _t : true,
        inlineRefs: (_u = o.inlineRefs) !== null && _u !== void 0 ? _u : true,
        schemaId: (_v = o.schemaId) !== null && _v !== void 0 ? _v : "$id",
        addUsedSchema: (_w = o.addUsedSchema) !== null && _w !== void 0 ? _w : true,
        validateSchema: (_x = o.validateSchema) !== null && _x !== void 0 ? _x : true,
        validateFormats: (_y = o.validateFormats) !== null && _y !== void 0 ? _y : true,
        unicodeRegExp: (_z = o.unicodeRegExp) !== null && _z !== void 0 ? _z : true,
        int32range: (_0 = o.int32range) !== null && _0 !== void 0 ? _0 : true,
        uriResolver
      };
    }
    var Ajv = class {
      constructor(opts = {}) {
        this.schemas = {};
        this.refs = {};
        this.formats = /* @__PURE__ */ Object.create(null);
        this._compilations = /* @__PURE__ */ new Set();
        this._loading = {};
        this._cache = /* @__PURE__ */ new Map();
        opts = this.opts = { ...opts, ...requiredOptions(opts) };
        const { es5, lines } = this.opts.code;
        this.scope = new codegen_2.ValueScope({ scope: {}, prefixes: EXT_SCOPE_NAMES, es5, lines });
        this.logger = getLogger(opts.logger);
        const formatOpt = opts.validateFormats;
        opts.validateFormats = false;
        this.RULES = (0, rules_1.getRules)();
        checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
        checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
        this._metaOpts = getMetaSchemaOptions.call(this);
        if (opts.formats)
          addInitialFormats.call(this);
        this._addVocabularies();
        this._addDefaultMetaSchema();
        if (opts.keywords)
          addInitialKeywords.call(this, opts.keywords);
        if (typeof opts.meta == "object")
          this.addMetaSchema(opts.meta);
        addInitialSchemas.call(this);
        opts.validateFormats = formatOpt;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data, meta, schemaId } = this.opts;
        let _dataRefSchema = $dataRefSchema;
        if (schemaId === "id") {
          _dataRefSchema = { ...$dataRefSchema };
          _dataRefSchema.id = _dataRefSchema.$id;
          delete _dataRefSchema.$id;
        }
        if (meta && $data)
          this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
      }
      defaultMeta() {
        const { meta, schemaId } = this.opts;
        return this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : void 0;
      }
      validate(schemaKeyRef, data) {
        let v;
        if (typeof schemaKeyRef == "string") {
          v = this.getSchema(schemaKeyRef);
          if (!v)
            throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
        } else {
          v = this.compile(schemaKeyRef);
        }
        const valid = v(data);
        if (!("$async" in v))
          this.errors = v.errors;
        return valid;
      }
      compile(schema, _meta) {
        const sch = this._addSchema(schema, _meta);
        return sch.validate || this._compileSchemaEnv(sch);
      }
      compileAsync(schema, meta) {
        if (typeof this.opts.loadSchema != "function") {
          throw new Error("options.loadSchema should be a function");
        }
        const { loadSchema } = this.opts;
        return runCompileAsync.call(this, schema, meta);
        async function runCompileAsync(_schema, _meta) {
          await loadMetaSchema.call(this, _schema.$schema);
          const sch = this._addSchema(_schema, _meta);
          return sch.validate || _compileAsync.call(this, sch);
        }
        async function loadMetaSchema($ref) {
          if ($ref && !this.getSchema($ref)) {
            await runCompileAsync.call(this, { $ref }, true);
          }
        }
        async function _compileAsync(sch) {
          try {
            return this._compileSchemaEnv(sch);
          } catch (e) {
            if (!(e instanceof ref_error_1.default))
              throw e;
            checkLoaded.call(this, e);
            await loadMissingSchema.call(this, e.missingSchema);
            return _compileAsync.call(this, sch);
          }
        }
        function checkLoaded({ missingSchema: ref, missingRef }) {
          if (this.refs[ref]) {
            throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
          }
        }
        async function loadMissingSchema(ref) {
          const _schema = await _loadSchema.call(this, ref);
          if (!this.refs[ref])
            await loadMetaSchema.call(this, _schema.$schema);
          if (!this.refs[ref])
            this.addSchema(_schema, ref, meta);
        }
        async function _loadSchema(ref) {
          const p = this._loading[ref];
          if (p)
            return p;
          try {
            return await (this._loading[ref] = loadSchema(ref));
          } finally {
            delete this._loading[ref];
          }
        }
      }
      // Adds schema to the instance
      addSchema(schema, key, _meta, _validateSchema = this.opts.validateSchema) {
        if (Array.isArray(schema)) {
          for (const sch of schema)
            this.addSchema(sch, void 0, _meta, _validateSchema);
          return this;
        }
        let id;
        if (typeof schema === "object") {
          const { schemaId } = this.opts;
          id = schema[schemaId];
          if (id !== void 0 && typeof id != "string") {
            throw new Error(`schema ${schemaId} must be string`);
          }
        }
        key = (0, resolve_1.normalizeId)(key || id);
        this._checkUnique(key);
        this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true);
        return this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(schema, key, _validateSchema = this.opts.validateSchema) {
        this.addSchema(schema, key, true, _validateSchema);
        return this;
      }
      //  Validate schema against its meta-schema
      validateSchema(schema, throwOrLogError) {
        if (typeof schema == "boolean")
          return true;
        let $schema;
        $schema = schema.$schema;
        if ($schema !== void 0 && typeof $schema != "string") {
          throw new Error("$schema must be a string");
        }
        $schema = $schema || this.opts.defaultMeta || this.defaultMeta();
        if (!$schema) {
          this.logger.warn("meta-schema not available");
          this.errors = null;
          return true;
        }
        const valid = this.validate($schema, schema);
        if (!valid && throwOrLogError) {
          const message = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(message);
          else
            throw new Error(message);
        }
        return valid;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(keyRef) {
        let sch;
        while (typeof (sch = getSchEnv.call(this, keyRef)) == "string")
          keyRef = sch;
        if (sch === void 0) {
          const { schemaId } = this.opts;
          const root = new compile_1.SchemaEnv({ schema: {}, schemaId });
          sch = compile_1.resolveSchema.call(this, root, keyRef);
          if (!sch)
            return;
          this.refs[keyRef] = sch;
        }
        return sch.validate || this._compileSchemaEnv(sch);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(schemaKeyRef) {
        if (schemaKeyRef instanceof RegExp) {
          this._removeAllSchemas(this.schemas, schemaKeyRef);
          this._removeAllSchemas(this.refs, schemaKeyRef);
          return this;
        }
        switch (typeof schemaKeyRef) {
          case "undefined":
            this._removeAllSchemas(this.schemas);
            this._removeAllSchemas(this.refs);
            this._cache.clear();
            return this;
          case "string": {
            const sch = getSchEnv.call(this, schemaKeyRef);
            if (typeof sch == "object")
              this._cache.delete(sch.schema);
            delete this.schemas[schemaKeyRef];
            delete this.refs[schemaKeyRef];
            return this;
          }
          case "object": {
            const cacheKey = schemaKeyRef;
            this._cache.delete(cacheKey);
            let id = schemaKeyRef[this.opts.schemaId];
            if (id) {
              id = (0, resolve_1.normalizeId)(id);
              delete this.schemas[id];
              delete this.refs[id];
            }
            return this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(definitions) {
        for (const def of definitions)
          this.addKeyword(def);
        return this;
      }
      addKeyword(kwdOrDef, def) {
        let keyword;
        if (typeof kwdOrDef == "string") {
          keyword = kwdOrDef;
          if (typeof def == "object") {
            this.logger.warn("these parameters are deprecated, see docs for addKeyword");
            def.keyword = keyword;
          }
        } else if (typeof kwdOrDef == "object" && def === void 0) {
          def = kwdOrDef;
          keyword = def.keyword;
          if (Array.isArray(keyword) && !keyword.length) {
            throw new Error("addKeywords: keyword must be string or non-empty array");
          }
        } else {
          throw new Error("invalid addKeywords parameters");
        }
        checkKeyword.call(this, keyword, def);
        if (!def) {
          (0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
          return this;
        }
        keywordMetaschema.call(this, def);
        const definition = {
          ...def,
          type: (0, dataType_1.getJSONTypes)(def.type),
          schemaType: (0, dataType_1.getJSONTypes)(def.schemaType)
        };
        (0, util_1.eachItem)(keyword, definition.type.length === 0 ? (k) => addRule.call(this, k, definition) : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
        return this;
      }
      getKeyword(keyword) {
        const rule = this.RULES.all[keyword];
        return typeof rule == "object" ? rule.definition : !!rule;
      }
      // Remove keyword
      removeKeyword(keyword) {
        const { RULES } = this;
        delete RULES.keywords[keyword];
        delete RULES.all[keyword];
        for (const group of RULES.rules) {
          const i = group.rules.findIndex((rule) => rule.keyword === keyword);
          if (i >= 0)
            group.rules.splice(i, 1);
        }
        return this;
      }
      // Add format
      addFormat(name, format) {
        if (typeof format == "string")
          format = new RegExp(format);
        this.formats[name] = format;
        return this;
      }
      errorsText(errors = this.errors, { separator = ", ", dataVar = "data" } = {}) {
        if (!errors || errors.length === 0)
          return "No errors";
        return errors.map((e) => `${dataVar}${e.instancePath} ${e.message}`).reduce((text, msg) => text + separator + msg);
      }
      $dataMetaSchema(metaSchema, keywordsJsonPointers) {
        const rules = this.RULES.all;
        metaSchema = JSON.parse(JSON.stringify(metaSchema));
        for (const jsonPointer of keywordsJsonPointers) {
          const segments = jsonPointer.split("/").slice(1);
          let keywords = metaSchema;
          for (const seg of segments)
            keywords = keywords[seg];
          for (const key in rules) {
            const rule = rules[key];
            if (typeof rule != "object")
              continue;
            const { $data } = rule.definition;
            const schema = keywords[key];
            if ($data && schema)
              keywords[key] = schemaOrData(schema);
          }
        }
        return metaSchema;
      }
      _removeAllSchemas(schemas, regex) {
        for (const keyRef in schemas) {
          const sch = schemas[keyRef];
          if (!regex || regex.test(keyRef)) {
            if (typeof sch == "string") {
              delete schemas[keyRef];
            } else if (sch && !sch.meta) {
              this._cache.delete(sch.schema);
              delete schemas[keyRef];
            }
          }
        }
      }
      _addSchema(schema, meta, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
        let id;
        const { schemaId } = this.opts;
        if (typeof schema == "object") {
          id = schema[schemaId];
        } else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          else if (typeof schema != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let sch = this._cache.get(schema);
        if (sch !== void 0)
          return sch;
        baseId = (0, resolve_1.normalizeId)(id || baseId);
        const localRefs = resolve_1.getSchemaRefs.call(this, schema, baseId);
        sch = new compile_1.SchemaEnv({ schema, schemaId, meta, baseId, localRefs });
        this._cache.set(sch.schema, sch);
        if (addSchema && !baseId.startsWith("#")) {
          if (baseId)
            this._checkUnique(baseId);
          this.refs[baseId] = sch;
        }
        if (validateSchema)
          this.validateSchema(schema, true);
        return sch;
      }
      _checkUnique(id) {
        if (this.schemas[id] || this.refs[id]) {
          throw new Error(`schema with key or id "${id}" already exists`);
        }
      }
      _compileSchemaEnv(sch) {
        if (sch.meta)
          this._compileMetaSchema(sch);
        else
          compile_1.compileSchema.call(this, sch);
        if (!sch.validate)
          throw new Error("ajv implementation error");
        return sch.validate;
      }
      _compileMetaSchema(sch) {
        const currentOpts = this.opts;
        this.opts = this._metaOpts;
        try {
          compile_1.compileSchema.call(this, sch);
        } finally {
          this.opts = currentOpts;
        }
      }
    };
    Ajv.ValidationError = validation_error_1.default;
    Ajv.MissingRefError = ref_error_1.default;
    exports.default = Ajv;
    function checkOptions(checkOpts, options, msg, log = "error") {
      for (const key in checkOpts) {
        const opt = key;
        if (opt in options)
          this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`);
      }
    }
    function getSchEnv(keyRef) {
      keyRef = (0, resolve_1.normalizeId)(keyRef);
      return this.schemas[keyRef] || this.refs[keyRef];
    }
    function addInitialSchemas() {
      const optsSchemas = this.opts.schemas;
      if (!optsSchemas)
        return;
      if (Array.isArray(optsSchemas))
        this.addSchema(optsSchemas);
      else
        for (const key in optsSchemas)
          this.addSchema(optsSchemas[key], key);
    }
    function addInitialFormats() {
      for (const name in this.opts.formats) {
        const format = this.opts.formats[name];
        if (format)
          this.addFormat(name, format);
      }
    }
    function addInitialKeywords(defs) {
      if (Array.isArray(defs)) {
        this.addVocabulary(defs);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const keyword in defs) {
        const def = defs[keyword];
        if (!def.keyword)
          def.keyword = keyword;
        this.addKeyword(def);
      }
    }
    function getMetaSchemaOptions() {
      const metaOpts = { ...this.opts };
      for (const opt of META_IGNORE_OPTIONS)
        delete metaOpts[opt];
      return metaOpts;
    }
    var noLogs = { log() {
    }, warn() {
    }, error() {
    } };
    function getLogger(logger) {
      if (logger === false)
        return noLogs;
      if (logger === void 0)
        return console;
      if (logger.log && logger.warn && logger.error)
        return logger;
      throw new Error("logger must implement log, warn and error methods");
    }
    var KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
    function checkKeyword(keyword, def) {
      const { RULES } = this;
      (0, util_1.eachItem)(keyword, (kwd) => {
        if (RULES.keywords[kwd])
          throw new Error(`Keyword ${kwd} is already defined`);
        if (!KEYWORD_NAME.test(kwd))
          throw new Error(`Keyword ${kwd} has invalid name`);
      });
      if (!def)
        return;
      if (def.$data && !("code" in def || "validate" in def)) {
        throw new Error('$data keyword must have "code" or "validate" function');
      }
    }
    function addRule(keyword, definition, dataType) {
      var _a;
      const post = definition === null || definition === void 0 ? void 0 : definition.post;
      if (dataType && post)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES } = this;
      let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t }) => t === dataType);
      if (!ruleGroup) {
        ruleGroup = { type: dataType, rules: [] };
        RULES.rules.push(ruleGroup);
      }
      RULES.keywords[keyword] = true;
      if (!definition)
        return;
      const rule = {
        keyword,
        definition: {
          ...definition,
          type: (0, dataType_1.getJSONTypes)(definition.type),
          schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType)
        }
      };
      if (definition.before)
        addBeforeRule.call(this, ruleGroup, rule, definition.before);
      else
        ruleGroup.rules.push(rule);
      RULES.all[keyword] = rule;
      (_a = definition.implements) === null || _a === void 0 ? void 0 : _a.forEach((kwd) => this.addKeyword(kwd));
    }
    function addBeforeRule(ruleGroup, rule, before) {
      const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
      if (i >= 0) {
        ruleGroup.rules.splice(i, 0, rule);
      } else {
        ruleGroup.rules.push(rule);
        this.logger.warn(`rule ${before} is not defined`);
      }
    }
    function keywordMetaschema(def) {
      let { metaSchema } = def;
      if (metaSchema === void 0)
        return;
      if (def.$data && this.opts.$data)
        metaSchema = schemaOrData(metaSchema);
      def.validateSchema = this.compile(metaSchema, true);
    }
    var $dataRef = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function schemaOrData(schema) {
      return { anyOf: [schema, $dataRef] };
    }
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/core/id.js
var require_id = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/core/id.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var def = {
      keyword: "id",
      code() {
        throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
      }
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/core/ref.js
var require_ref = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/core/ref.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.callRef = exports.getValidate = void 0;
    var ref_error_1 = require_ref_error();
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var compile_1 = require_compile();
    var util_1 = require_util();
    var def = {
      keyword: "$ref",
      schemaType: "string",
      code(cxt) {
        const { gen, schema: $ref, it } = cxt;
        const { baseId, schemaEnv: env, validateName, opts, self } = it;
        const { root } = env;
        if (($ref === "#" || $ref === "#/") && baseId === root.baseId)
          return callRootRef();
        const schOrEnv = compile_1.resolveRef.call(self, root, baseId, $ref);
        if (schOrEnv === void 0)
          throw new ref_error_1.default(it.opts.uriResolver, baseId, $ref);
        if (schOrEnv instanceof compile_1.SchemaEnv)
          return callValidate(schOrEnv);
        return inlineRefSchema(schOrEnv);
        function callRootRef() {
          if (env === root)
            return callRef(cxt, validateName, env, env.$async);
          const rootName = gen.scopeValue("root", { ref: root });
          return callRef(cxt, (0, codegen_1._)`${rootName}.validate`, root, root.$async);
        }
        function callValidate(sch) {
          const v = getValidate(cxt, sch);
          callRef(cxt, v, sch, sch.$async);
        }
        function inlineRefSchema(sch) {
          const schName = gen.scopeValue("schema", opts.code.source === true ? { ref: sch, code: (0, codegen_1.stringify)(sch) } : { ref: sch });
          const valid = gen.name("valid");
          const schCxt = cxt.subschema({
            schema: sch,
            dataTypes: [],
            schemaPath: codegen_1.nil,
            topSchemaRef: schName,
            errSchemaPath: $ref
          }, valid);
          cxt.mergeEvaluated(schCxt);
          cxt.ok(valid);
        }
      }
    };
    function getValidate(cxt, sch) {
      const { gen } = cxt;
      return sch.validate ? gen.scopeValue("validate", { ref: sch.validate }) : (0, codegen_1._)`${gen.scopeValue("wrapper", { ref: sch })}.validate`;
    }
    exports.getValidate = getValidate;
    function callRef(cxt, v, sch, $async) {
      const { gen, it } = cxt;
      const { allErrors, schemaEnv: env, opts } = it;
      const passCxt = opts.passContext ? names_1.default.this : codegen_1.nil;
      if ($async)
        callAsyncRef();
      else
        callSyncRef();
      function callAsyncRef() {
        if (!env.$async)
          throw new Error("async schema referenced by sync schema");
        const valid = gen.let("valid");
        gen.try(() => {
          gen.code((0, codegen_1._)`await ${(0, code_1.callValidateCode)(cxt, v, passCxt)}`);
          addEvaluatedFrom(v);
          if (!allErrors)
            gen.assign(valid, true);
        }, (e) => {
          gen.if((0, codegen_1._)`!(${e} instanceof ${it.ValidationError})`, () => gen.throw(e));
          addErrorsFrom(e);
          if (!allErrors)
            gen.assign(valid, false);
        });
        cxt.ok(valid);
      }
      function callSyncRef() {
        cxt.result((0, code_1.callValidateCode)(cxt, v, passCxt), () => addEvaluatedFrom(v), () => addErrorsFrom(v));
      }
      function addErrorsFrom(source) {
        const errs = (0, codegen_1._)`${source}.errors`;
        gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`);
        gen.assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
      }
      function addEvaluatedFrom(source) {
        var _a;
        if (!it.opts.unevaluated)
          return;
        const schEvaluated = (_a = sch === null || sch === void 0 ? void 0 : sch.validate) === null || _a === void 0 ? void 0 : _a.evaluated;
        if (it.props !== true) {
          if (schEvaluated && !schEvaluated.dynamicProps) {
            if (schEvaluated.props !== void 0) {
              it.props = util_1.mergeEvaluated.props(gen, schEvaluated.props, it.props);
            }
          } else {
            const props = gen.var("props", (0, codegen_1._)`${source}.evaluated.props`);
            it.props = util_1.mergeEvaluated.props(gen, props, it.props, codegen_1.Name);
          }
        }
        if (it.items !== true) {
          if (schEvaluated && !schEvaluated.dynamicItems) {
            if (schEvaluated.items !== void 0) {
              it.items = util_1.mergeEvaluated.items(gen, schEvaluated.items, it.items);
            }
          } else {
            const items = gen.var("items", (0, codegen_1._)`${source}.evaluated.items`);
            it.items = util_1.mergeEvaluated.items(gen, items, it.items, codegen_1.Name);
          }
        }
      }
    }
    exports.callRef = callRef;
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/core/index.js
var require_core2 = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/core/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var id_1 = require_id();
    var ref_1 = require_ref();
    var core = [
      "$schema",
      "$id",
      "$defs",
      "$vocabulary",
      { keyword: "$comment" },
      "definitions",
      id_1.default,
      ref_1.default
    ];
    exports.default = core;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/limitNumber.js
var require_limitNumber = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/limitNumber.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var ops = codegen_1.operators;
    var KWDs = {
      maximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
      minimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
      exclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
      exclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE }
    };
    var error4 = {
      message: ({ keyword, schemaCode }) => (0, codegen_1.str)`must be ${KWDs[keyword].okStr} ${schemaCode}`,
      params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
    };
    var def = {
      keyword: Object.keys(KWDs),
      type: "number",
      schemaType: "number",
      $data: true,
      error: error4,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        cxt.fail$data((0, codegen_1._)`${data} ${KWDs[keyword].fail} ${schemaCode} || isNaN(${data})`);
      }
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/multipleOf.js
var require_multipleOf = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/multipleOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error4 = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must be multiple of ${schemaCode}`,
      params: ({ schemaCode }) => (0, codegen_1._)`{multipleOf: ${schemaCode}}`
    };
    var def = {
      keyword: "multipleOf",
      type: "number",
      schemaType: "number",
      $data: true,
      error: error4,
      code(cxt) {
        const { gen, data, schemaCode, it } = cxt;
        const prec = it.opts.multipleOfPrecision;
        const res = gen.let("res");
        const invalid = prec ? (0, codegen_1._)`Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}` : (0, codegen_1._)`${res} !== parseInt(${res})`;
        cxt.fail$data((0, codegen_1._)`(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`);
      }
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/runtime/ucs2length.js
var require_ucs2length = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/runtime/ucs2length.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function ucs2length(str) {
      const len = str.length;
      let length = 0;
      let pos = 0;
      let value;
      while (pos < len) {
        length++;
        value = str.charCodeAt(pos++);
        if (value >= 55296 && value <= 56319 && pos < len) {
          value = str.charCodeAt(pos);
          if ((value & 64512) === 56320)
            pos++;
        }
      }
      return length;
    }
    exports.default = ucs2length;
    ucs2length.code = 'require("ajv/dist/runtime/ucs2length").default';
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/limitLength.js
var require_limitLength = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/limitLength.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var ucs2length_1 = require_ucs2length();
    var error4 = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxLength" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} characters`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxLength", "minLength"],
      type: "string",
      schemaType: "number",
      $data: true,
      error: error4,
      code(cxt) {
        const { keyword, data, schemaCode, it } = cxt;
        const op = keyword === "maxLength" ? codegen_1.operators.GT : codegen_1.operators.LT;
        const len = it.opts.unicode === false ? (0, codegen_1._)`${data}.length` : (0, codegen_1._)`${(0, util_1.useFunc)(cxt.gen, ucs2length_1.default)}(${data})`;
        cxt.fail$data((0, codegen_1._)`${len} ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/pattern.js
var require_pattern = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/pattern.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var util_1 = require_util();
    var codegen_1 = require_codegen();
    var error4 = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must match pattern "${schemaCode}"`,
      params: ({ schemaCode }) => (0, codegen_1._)`{pattern: ${schemaCode}}`
    };
    var def = {
      keyword: "pattern",
      type: "string",
      schemaType: "string",
      $data: true,
      error: error4,
      code(cxt) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        const u = it.opts.unicodeRegExp ? "u" : "";
        if ($data) {
          const { regExp } = it.opts.code;
          const regExpCode = regExp.code === "new RegExp" ? (0, codegen_1._)`new RegExp` : (0, util_1.useFunc)(gen, regExp);
          const valid = gen.let("valid");
          gen.try(() => gen.assign(valid, (0, codegen_1._)`${regExpCode}(${schemaCode}, ${u}).test(${data})`), () => gen.assign(valid, false));
          cxt.fail$data((0, codegen_1._)`!${valid}`);
        } else {
          const regExp = (0, code_1.usePattern)(cxt, schema);
          cxt.fail$data((0, codegen_1._)`!${regExp}.test(${data})`);
        }
      }
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/limitProperties.js
var require_limitProperties = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/limitProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error4 = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxProperties" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} properties`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxProperties", "minProperties"],
      type: "object",
      schemaType: "number",
      $data: true,
      error: error4,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        const op = keyword === "maxProperties" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._)`Object.keys(${data}).length ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/required.js
var require_required = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/required.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error4 = {
      message: ({ params: { missingProperty } }) => (0, codegen_1.str)`must have required property '${missingProperty}'`,
      params: ({ params: { missingProperty } }) => (0, codegen_1._)`{missingProperty: ${missingProperty}}`
    };
    var def = {
      keyword: "required",
      type: "object",
      schemaType: "array",
      $data: true,
      error: error4,
      code(cxt) {
        const { gen, schema, schemaCode, data, $data, it } = cxt;
        const { opts } = it;
        if (!$data && schema.length === 0)
          return;
        const useLoop = schema.length >= opts.loopRequired;
        if (it.allErrors)
          allErrorsMode();
        else
          exitOnErrorMode();
        if (opts.strictRequired) {
          const props = cxt.parentSchema.properties;
          const { definedProperties } = cxt.it;
          for (const requiredKey of schema) {
            if ((props === null || props === void 0 ? void 0 : props[requiredKey]) === void 0 && !definedProperties.has(requiredKey)) {
              const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
              const msg = `required property "${requiredKey}" is not defined at "${schemaPath}" (strictRequired)`;
              (0, util_1.checkStrictMode)(it, msg, it.opts.strictRequired);
            }
          }
        }
        function allErrorsMode() {
          if (useLoop || $data) {
            cxt.block$data(codegen_1.nil, loopAllRequired);
          } else {
            for (const prop of schema) {
              (0, code_1.checkReportMissingProp)(cxt, prop);
            }
          }
        }
        function exitOnErrorMode() {
          const missing = gen.let("missing");
          if (useLoop || $data) {
            const valid = gen.let("valid", true);
            cxt.block$data(valid, () => loopUntilMissing(missing, valid));
            cxt.ok(valid);
          } else {
            gen.if((0, code_1.checkMissingProp)(cxt, schema, missing));
            (0, code_1.reportMissingProp)(cxt, missing);
            gen.else();
          }
        }
        function loopAllRequired() {
          gen.forOf("prop", schemaCode, (prop) => {
            cxt.setParams({ missingProperty: prop });
            gen.if((0, code_1.noPropertyInData)(gen, data, prop, opts.ownProperties), () => cxt.error());
          });
        }
        function loopUntilMissing(missing, valid) {
          cxt.setParams({ missingProperty: missing });
          gen.forOf(missing, schemaCode, () => {
            gen.assign(valid, (0, code_1.propertyInData)(gen, data, missing, opts.ownProperties));
            gen.if((0, codegen_1.not)(valid), () => {
              cxt.error();
              gen.break();
            });
          }, codegen_1.nil);
        }
      }
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/limitItems.js
var require_limitItems = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/limitItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error4 = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxItems" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} items`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxItems", "minItems"],
      type: "array",
      schemaType: "number",
      $data: true,
      error: error4,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        const op = keyword === "maxItems" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._)`${data}.length ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/runtime/equal.js
var require_equal = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/runtime/equal.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var equal = require_fast_deep_equal();
    equal.code = 'require("ajv/dist/runtime/equal").default';
    exports.default = equal;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/uniqueItems.js
var require_uniqueItems = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/uniqueItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dataType_1 = require_dataType();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error4 = {
      message: ({ params: { i, j } }) => (0, codegen_1.str)`must NOT have duplicate items (items ## ${j} and ${i} are identical)`,
      params: ({ params: { i, j } }) => (0, codegen_1._)`{i: ${i}, j: ${j}}`
    };
    var def = {
      keyword: "uniqueItems",
      type: "array",
      schemaType: "boolean",
      $data: true,
      error: error4,
      code(cxt) {
        const { gen, data, $data, schema, parentSchema, schemaCode, it } = cxt;
        if (!$data && !schema)
          return;
        const valid = gen.let("valid");
        const itemTypes = parentSchema.items ? (0, dataType_1.getSchemaTypes)(parentSchema.items) : [];
        cxt.block$data(valid, validateUniqueItems, (0, codegen_1._)`${schemaCode} === false`);
        cxt.ok(valid);
        function validateUniqueItems() {
          const i = gen.let("i", (0, codegen_1._)`${data}.length`);
          const j = gen.let("j");
          cxt.setParams({ i, j });
          gen.assign(valid, true);
          gen.if((0, codegen_1._)`${i} > 1`, () => (canOptimize() ? loopN : loopN2)(i, j));
        }
        function canOptimize() {
          return itemTypes.length > 0 && !itemTypes.some((t) => t === "object" || t === "array");
        }
        function loopN(i, j) {
          const item = gen.name("item");
          const wrongType = (0, dataType_1.checkDataTypes)(itemTypes, item, it.opts.strictNumbers, dataType_1.DataType.Wrong);
          const indices = gen.const("indices", (0, codegen_1._)`{}`);
          gen.for((0, codegen_1._)`;${i}--;`, () => {
            gen.let(item, (0, codegen_1._)`${data}[${i}]`);
            gen.if(wrongType, (0, codegen_1._)`continue`);
            if (itemTypes.length > 1)
              gen.if((0, codegen_1._)`typeof ${item} == "string"`, (0, codegen_1._)`${item} += "_"`);
            gen.if((0, codegen_1._)`typeof ${indices}[${item}] == "number"`, () => {
              gen.assign(j, (0, codegen_1._)`${indices}[${item}]`);
              cxt.error();
              gen.assign(valid, false).break();
            }).code((0, codegen_1._)`${indices}[${item}] = ${i}`);
          });
        }
        function loopN2(i, j) {
          const eql = (0, util_1.useFunc)(gen, equal_1.default);
          const outer = gen.name("outer");
          gen.label(outer).for((0, codegen_1._)`;${i}--;`, () => gen.for((0, codegen_1._)`${j} = ${i}; ${j}--;`, () => gen.if((0, codegen_1._)`${eql}(${data}[${i}], ${data}[${j}])`, () => {
            cxt.error();
            gen.assign(valid, false).break(outer);
          })));
        }
      }
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/const.js
var require_const = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/const.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error4 = {
      message: "must be equal to constant",
      params: ({ schemaCode }) => (0, codegen_1._)`{allowedValue: ${schemaCode}}`
    };
    var def = {
      keyword: "const",
      $data: true,
      error: error4,
      code(cxt) {
        const { gen, data, $data, schemaCode, schema } = cxt;
        if ($data || schema && typeof schema == "object") {
          cxt.fail$data((0, codegen_1._)`!${(0, util_1.useFunc)(gen, equal_1.default)}(${data}, ${schemaCode})`);
        } else {
          cxt.fail((0, codegen_1._)`${schema} !== ${data}`);
        }
      }
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/enum.js
var require_enum = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/enum.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error4 = {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode }) => (0, codegen_1._)`{allowedValues: ${schemaCode}}`
    };
    var def = {
      keyword: "enum",
      schemaType: "array",
      $data: true,
      error: error4,
      code(cxt) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        if (!$data && schema.length === 0)
          throw new Error("enum must have non-empty array");
        const useLoop = schema.length >= it.opts.loopEnum;
        let eql;
        const getEql = () => eql !== null && eql !== void 0 ? eql : eql = (0, util_1.useFunc)(gen, equal_1.default);
        let valid;
        if (useLoop || $data) {
          valid = gen.let("valid");
          cxt.block$data(valid, loopEnum);
        } else {
          if (!Array.isArray(schema))
            throw new Error("ajv implementation error");
          const vSchema = gen.const("vSchema", schemaCode);
          valid = (0, codegen_1.or)(...schema.map((_x, i) => equalCode(vSchema, i)));
        }
        cxt.pass(valid);
        function loopEnum() {
          gen.assign(valid, false);
          gen.forOf("v", schemaCode, (v) => gen.if((0, codegen_1._)`${getEql()}(${data}, ${v})`, () => gen.assign(valid, true).break()));
        }
        function equalCode(vSchema, i) {
          const sch = schema[i];
          return typeof sch === "object" && sch !== null ? (0, codegen_1._)`${getEql()}(${data}, ${vSchema}[${i}])` : (0, codegen_1._)`${data} === ${sch}`;
        }
      }
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/index.js
var require_validation = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var limitNumber_1 = require_limitNumber();
    var multipleOf_1 = require_multipleOf();
    var limitLength_1 = require_limitLength();
    var pattern_1 = require_pattern();
    var limitProperties_1 = require_limitProperties();
    var required_1 = require_required();
    var limitItems_1 = require_limitItems();
    var uniqueItems_1 = require_uniqueItems();
    var const_1 = require_const();
    var enum_1 = require_enum();
    var validation = [
      // number
      limitNumber_1.default,
      multipleOf_1.default,
      // string
      limitLength_1.default,
      pattern_1.default,
      // object
      limitProperties_1.default,
      required_1.default,
      // array
      limitItems_1.default,
      uniqueItems_1.default,
      // any
      { keyword: "type", schemaType: ["string", "array"] },
      { keyword: "nullable", schemaType: "boolean" },
      const_1.default,
      enum_1.default
    ];
    exports.default = validation;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/additionalItems.js
var require_additionalItems = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/additionalItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateAdditionalItems = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error4 = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "additionalItems",
      type: "array",
      schemaType: ["boolean", "object"],
      before: "uniqueItems",
      error: error4,
      code(cxt) {
        const { parentSchema, it } = cxt;
        const { items } = parentSchema;
        if (!Array.isArray(items)) {
          (0, util_1.checkStrictMode)(it, '"additionalItems" is ignored when "items" is not an array of schemas');
          return;
        }
        validateAdditionalItems(cxt, items);
      }
    };
    function validateAdditionalItems(cxt, items) {
      const { gen, schema, data, keyword, it } = cxt;
      it.items = true;
      const len = gen.const("len", (0, codegen_1._)`${data}.length`);
      if (schema === false) {
        cxt.setParams({ len: items.length });
        cxt.pass((0, codegen_1._)`${len} <= ${items.length}`);
      } else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
        const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items.length}`);
        gen.if((0, codegen_1.not)(valid), () => validateItems(valid));
        cxt.ok(valid);
      }
      function validateItems(valid) {
        gen.forRange("i", items.length, len, (i) => {
          cxt.subschema({ keyword, dataProp: i, dataPropType: util_1.Type.Num }, valid);
          if (!it.allErrors)
            gen.if((0, codegen_1.not)(valid), () => gen.break());
        });
      }
    }
    exports.validateAdditionalItems = validateAdditionalItems;
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/items.js
var require_items = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/items.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateTuple = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    var def = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "array", "boolean"],
      before: "uniqueItems",
      code(cxt) {
        const { schema, it } = cxt;
        if (Array.isArray(schema))
          return validateTuple(cxt, "additionalItems", schema);
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        cxt.ok((0, code_1.validateArray)(cxt));
      }
    };
    function validateTuple(cxt, extraItems, schArr = cxt.schema) {
      const { gen, parentSchema, data, keyword, it } = cxt;
      checkStrictTuple(parentSchema);
      if (it.opts.unevaluated && schArr.length && it.items !== true) {
        it.items = util_1.mergeEvaluated.items(gen, schArr.length, it.items);
      }
      const valid = gen.name("valid");
      const len = gen.const("len", (0, codegen_1._)`${data}.length`);
      schArr.forEach((sch, i) => {
        if ((0, util_1.alwaysValidSchema)(it, sch))
          return;
        gen.if((0, codegen_1._)`${len} > ${i}`, () => cxt.subschema({
          keyword,
          schemaProp: i,
          dataProp: i
        }, valid));
        cxt.ok(valid);
      });
      function checkStrictTuple(sch) {
        const { opts, errSchemaPath } = it;
        const l = schArr.length;
        const fullTuple = l === sch.minItems && (l === sch.maxItems || sch[extraItems] === false);
        if (opts.strictTuples && !fullTuple) {
          const msg = `"${keyword}" is ${l}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`;
          (0, util_1.checkStrictMode)(it, msg, opts.strictTuples);
        }
      }
    }
    exports.validateTuple = validateTuple;
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/prefixItems.js
var require_prefixItems = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/prefixItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var items_1 = require_items();
    var def = {
      keyword: "prefixItems",
      type: "array",
      schemaType: ["array"],
      before: "uniqueItems",
      code: (cxt) => (0, items_1.validateTuple)(cxt, "items")
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/items2020.js
var require_items2020 = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/items2020.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    var additionalItems_1 = require_additionalItems();
    var error4 = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      error: error4,
      code(cxt) {
        const { schema, parentSchema, it } = cxt;
        const { prefixItems } = parentSchema;
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        if (prefixItems)
          (0, additionalItems_1.validateAdditionalItems)(cxt, prefixItems);
        else
          cxt.ok((0, code_1.validateArray)(cxt));
      }
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/contains.js
var require_contains = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/contains.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error4 = {
      message: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1.str)`must contain at least ${min} valid item(s)` : (0, codegen_1.str)`must contain at least ${min} and no more than ${max} valid item(s)`,
      params: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1._)`{minContains: ${min}}` : (0, codegen_1._)`{minContains: ${min}, maxContains: ${max}}`
    };
    var def = {
      keyword: "contains",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      trackErrors: true,
      error: error4,
      code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt;
        let min;
        let max;
        const { minContains, maxContains } = parentSchema;
        if (it.opts.next) {
          min = minContains === void 0 ? 1 : minContains;
          max = maxContains;
        } else {
          min = 1;
        }
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        cxt.setParams({ min, max });
        if (max === void 0 && min === 0) {
          (0, util_1.checkStrictMode)(it, `"minContains" == 0 without "maxContains": "contains" keyword ignored`);
          return;
        }
        if (max !== void 0 && min > max) {
          (0, util_1.checkStrictMode)(it, `"minContains" > "maxContains" is always invalid`);
          cxt.fail();
          return;
        }
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
          let cond = (0, codegen_1._)`${len} >= ${min}`;
          if (max !== void 0)
            cond = (0, codegen_1._)`${cond} && ${len} <= ${max}`;
          cxt.pass(cond);
          return;
        }
        it.items = true;
        const valid = gen.name("valid");
        if (max === void 0 && min === 1) {
          validateItems(valid, () => gen.if(valid, () => gen.break()));
        } else if (min === 0) {
          gen.let(valid, true);
          if (max !== void 0)
            gen.if((0, codegen_1._)`${data}.length > 0`, validateItemsWithCount);
        } else {
          gen.let(valid, false);
          validateItemsWithCount();
        }
        cxt.result(valid, () => cxt.reset());
        function validateItemsWithCount() {
          const schValid = gen.name("_valid");
          const count = gen.let("count", 0);
          validateItems(schValid, () => gen.if(schValid, () => checkLimits(count)));
        }
        function validateItems(_valid, block) {
          gen.forRange("i", 0, len, (i) => {
            cxt.subschema({
              keyword: "contains",
              dataProp: i,
              dataPropType: util_1.Type.Num,
              compositeRule: true
            }, _valid);
            block();
          });
        }
        function checkLimits(count) {
          gen.code((0, codegen_1._)`${count}++`);
          if (max === void 0) {
            gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true).break());
          } else {
            gen.if((0, codegen_1._)`${count} > ${max}`, () => gen.assign(valid, false).break());
            if (min === 1)
              gen.assign(valid, true);
            else
              gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true));
          }
        }
      }
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/dependencies.js
var require_dependencies = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/dependencies.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateSchemaDeps = exports.validatePropertyDeps = exports.error = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    exports.error = {
      message: ({ params: { property, depsCount, deps } }) => {
        const property_ies = depsCount === 1 ? "property" : "properties";
        return (0, codegen_1.str)`must have ${property_ies} ${deps} when property ${property} is present`;
      },
      params: ({ params: { property, depsCount, deps, missingProperty } }) => (0, codegen_1._)`{property: ${property},
    missingProperty: ${missingProperty},
    depsCount: ${depsCount},
    deps: ${deps}}`
      // TODO change to reference
    };
    var def = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: exports.error,
      code(cxt) {
        const [propDeps, schDeps] = splitDependencies(cxt);
        validatePropertyDeps(cxt, propDeps);
        validateSchemaDeps(cxt, schDeps);
      }
    };
    function splitDependencies({ schema }) {
      const propertyDeps = {};
      const schemaDeps = {};
      for (const key in schema) {
        if (key === "__proto__")
          continue;
        const deps = Array.isArray(schema[key]) ? propertyDeps : schemaDeps;
        deps[key] = schema[key];
      }
      return [propertyDeps, schemaDeps];
    }
    function validatePropertyDeps(cxt, propertyDeps = cxt.schema) {
      const { gen, data, it } = cxt;
      if (Object.keys(propertyDeps).length === 0)
        return;
      const missing = gen.let("missing");
      for (const prop in propertyDeps) {
        const deps = propertyDeps[prop];
        if (deps.length === 0)
          continue;
        const hasProperty = (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties);
        cxt.setParams({
          property: prop,
          depsCount: deps.length,
          deps: deps.join(", ")
        });
        if (it.allErrors) {
          gen.if(hasProperty, () => {
            for (const depProp of deps) {
              (0, code_1.checkReportMissingProp)(cxt, depProp);
            }
          });
        } else {
          gen.if((0, codegen_1._)`${hasProperty} && (${(0, code_1.checkMissingProp)(cxt, deps, missing)})`);
          (0, code_1.reportMissingProp)(cxt, missing);
          gen.else();
        }
      }
    }
    exports.validatePropertyDeps = validatePropertyDeps;
    function validateSchemaDeps(cxt, schemaDeps = cxt.schema) {
      const { gen, data, keyword, it } = cxt;
      const valid = gen.name("valid");
      for (const prop in schemaDeps) {
        if ((0, util_1.alwaysValidSchema)(it, schemaDeps[prop]))
          continue;
        gen.if(
          (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties),
          () => {
            const schCxt = cxt.subschema({ keyword, schemaProp: prop }, valid);
            cxt.mergeValidEvaluated(schCxt, valid);
          },
          () => gen.var(valid, true)
          // TODO var
        );
        cxt.ok(valid);
      }
    }
    exports.validateSchemaDeps = validateSchemaDeps;
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/propertyNames.js
var require_propertyNames = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/propertyNames.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error4 = {
      message: "property name must be valid",
      params: ({ params }) => (0, codegen_1._)`{propertyName: ${params.propertyName}}`
    };
    var def = {
      keyword: "propertyNames",
      type: "object",
      schemaType: ["object", "boolean"],
      error: error4,
      code(cxt) {
        const { gen, schema, data, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        const valid = gen.name("valid");
        gen.forIn("key", data, (key) => {
          cxt.setParams({ propertyName: key });
          cxt.subschema({
            keyword: "propertyNames",
            data: key,
            dataTypes: ["string"],
            propertyName: key,
            compositeRule: true
          }, valid);
          gen.if((0, codegen_1.not)(valid), () => {
            cxt.error(true);
            if (!it.allErrors)
              gen.break();
          });
        });
        cxt.ok(valid);
      }
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js
var require_additionalProperties = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var util_1 = require_util();
    var error4 = {
      message: "must NOT have additional properties",
      params: ({ params }) => (0, codegen_1._)`{additionalProperty: ${params.additionalProperty}}`
    };
    var def = {
      keyword: "additionalProperties",
      type: ["object"],
      schemaType: ["boolean", "object"],
      allowUndefined: true,
      trackErrors: true,
      error: error4,
      code(cxt) {
        const { gen, schema, parentSchema, data, errsCount, it } = cxt;
        if (!errsCount)
          throw new Error("ajv implementation error");
        const { allErrors, opts } = it;
        it.props = true;
        if (opts.removeAdditional !== "all" && (0, util_1.alwaysValidSchema)(it, schema))
          return;
        const props = (0, code_1.allSchemaProperties)(parentSchema.properties);
        const patProps = (0, code_1.allSchemaProperties)(parentSchema.patternProperties);
        checkAdditionalProperties();
        cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
        function checkAdditionalProperties() {
          gen.forIn("key", data, (key) => {
            if (!props.length && !patProps.length)
              additionalPropertyCode(key);
            else
              gen.if(isAdditional(key), () => additionalPropertyCode(key));
          });
        }
        function isAdditional(key) {
          let definedProp;
          if (props.length > 8) {
            const propsSchema = (0, util_1.schemaRefOrVal)(it, parentSchema.properties, "properties");
            definedProp = (0, code_1.isOwnProperty)(gen, propsSchema, key);
          } else if (props.length) {
            definedProp = (0, codegen_1.or)(...props.map((p) => (0, codegen_1._)`${key} === ${p}`));
          } else {
            definedProp = codegen_1.nil;
          }
          if (patProps.length) {
            definedProp = (0, codegen_1.or)(definedProp, ...patProps.map((p) => (0, codegen_1._)`${(0, code_1.usePattern)(cxt, p)}.test(${key})`));
          }
          return (0, codegen_1.not)(definedProp);
        }
        function deleteAdditional(key) {
          gen.code((0, codegen_1._)`delete ${data}[${key}]`);
        }
        function additionalPropertyCode(key) {
          if (opts.removeAdditional === "all" || opts.removeAdditional && schema === false) {
            deleteAdditional(key);
            return;
          }
          if (schema === false) {
            cxt.setParams({ additionalProperty: key });
            cxt.error();
            if (!allErrors)
              gen.break();
            return;
          }
          if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
            const valid = gen.name("valid");
            if (opts.removeAdditional === "failing") {
              applyAdditionalSchema(key, valid, false);
              gen.if((0, codegen_1.not)(valid), () => {
                cxt.reset();
                deleteAdditional(key);
              });
            } else {
              applyAdditionalSchema(key, valid);
              if (!allErrors)
                gen.if((0, codegen_1.not)(valid), () => gen.break());
            }
          }
        }
        function applyAdditionalSchema(key, valid, errors) {
          const subschema = {
            keyword: "additionalProperties",
            dataProp: key,
            dataPropType: util_1.Type.Str
          };
          if (errors === false) {
            Object.assign(subschema, {
              compositeRule: true,
              createErrors: false,
              allErrors: false
            });
          }
          cxt.subschema(subschema, valid);
        }
      }
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/properties.js
var require_properties = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/properties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var validate_1 = require_validate();
    var code_1 = require_code2();
    var util_1 = require_util();
    var additionalProperties_1 = require_additionalProperties();
    var def = {
      keyword: "properties",
      type: "object",
      schemaType: "object",
      code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt;
        if (it.opts.removeAdditional === "all" && parentSchema.additionalProperties === void 0) {
          additionalProperties_1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1.default, "additionalProperties"));
        }
        const allProps = (0, code_1.allSchemaProperties)(schema);
        for (const prop of allProps) {
          it.definedProperties.add(prop);
        }
        if (it.opts.unevaluated && allProps.length && it.props !== true) {
          it.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it.props);
        }
        const properties = allProps.filter((p) => !(0, util_1.alwaysValidSchema)(it, schema[p]));
        if (properties.length === 0)
          return;
        const valid = gen.name("valid");
        for (const prop of properties) {
          if (hasDefault(prop)) {
            applyPropertySchema(prop);
          } else {
            gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties));
            applyPropertySchema(prop);
            if (!it.allErrors)
              gen.else().var(valid, true);
            gen.endIf();
          }
          cxt.it.definedProperties.add(prop);
          cxt.ok(valid);
        }
        function hasDefault(prop) {
          return it.opts.useDefaults && !it.compositeRule && schema[prop].default !== void 0;
        }
        function applyPropertySchema(prop) {
          cxt.subschema({
            keyword: "properties",
            schemaProp: prop,
            dataProp: prop
          }, valid);
        }
      }
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/patternProperties.js
var require_patternProperties = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/patternProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var util_2 = require_util();
    var def = {
      keyword: "patternProperties",
      type: "object",
      schemaType: "object",
      code(cxt) {
        const { gen, schema, data, parentSchema, it } = cxt;
        const { opts } = it;
        const patterns = (0, code_1.allSchemaProperties)(schema);
        const alwaysValidPatterns = patterns.filter((p) => (0, util_1.alwaysValidSchema)(it, schema[p]));
        if (patterns.length === 0 || alwaysValidPatterns.length === patterns.length && (!it.opts.unevaluated || it.props === true)) {
          return;
        }
        const checkProperties = opts.strictSchema && !opts.allowMatchingProperties && parentSchema.properties;
        const valid = gen.name("valid");
        if (it.props !== true && !(it.props instanceof codegen_1.Name)) {
          it.props = (0, util_2.evaluatedPropsToName)(gen, it.props);
        }
        const { props } = it;
        validatePatternProperties();
        function validatePatternProperties() {
          for (const pat of patterns) {
            if (checkProperties)
              checkMatchingProperties(pat);
            if (it.allErrors) {
              validateProperties(pat);
            } else {
              gen.var(valid, true);
              validateProperties(pat);
              gen.if(valid);
            }
          }
        }
        function checkMatchingProperties(pat) {
          for (const prop in checkProperties) {
            if (new RegExp(pat).test(prop)) {
              (0, util_1.checkStrictMode)(it, `property ${prop} matches pattern ${pat} (use allowMatchingProperties)`);
            }
          }
        }
        function validateProperties(pat) {
          gen.forIn("key", data, (key) => {
            gen.if((0, codegen_1._)`${(0, code_1.usePattern)(cxt, pat)}.test(${key})`, () => {
              const alwaysValid = alwaysValidPatterns.includes(pat);
              if (!alwaysValid) {
                cxt.subschema({
                  keyword: "patternProperties",
                  schemaProp: pat,
                  dataProp: key,
                  dataPropType: util_2.Type.Str
                }, valid);
              }
              if (it.opts.unevaluated && props !== true) {
                gen.assign((0, codegen_1._)`${props}[${key}]`, true);
              } else if (!alwaysValid && !it.allErrors) {
                gen.if((0, codegen_1.not)(valid), () => gen.break());
              }
            });
          });
        }
      }
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/not.js
var require_not = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/not.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: "not",
      schemaType: ["object", "boolean"],
      trackErrors: true,
      code(cxt) {
        const { gen, schema, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
          cxt.fail();
          return;
        }
        const valid = gen.name("valid");
        cxt.subschema({
          keyword: "not",
          compositeRule: true,
          createErrors: false,
          allErrors: false
        }, valid);
        cxt.failResult(valid, () => cxt.reset(), () => cxt.error());
      },
      error: { message: "must NOT be valid" }
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/anyOf.js
var require_anyOf = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/anyOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var def = {
      keyword: "anyOf",
      schemaType: "array",
      trackErrors: true,
      code: code_1.validateUnion,
      error: { message: "must match a schema in anyOf" }
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/oneOf.js
var require_oneOf = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/oneOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error4 = {
      message: "must match exactly one schema in oneOf",
      params: ({ params }) => (0, codegen_1._)`{passingSchemas: ${params.passing}}`
    };
    var def = {
      keyword: "oneOf",
      schemaType: "array",
      trackErrors: true,
      error: error4,
      code(cxt) {
        const { gen, schema, parentSchema, it } = cxt;
        if (!Array.isArray(schema))
          throw new Error("ajv implementation error");
        if (it.opts.discriminator && parentSchema.discriminator)
          return;
        const schArr = schema;
        const valid = gen.let("valid", false);
        const passing = gen.let("passing", null);
        const schValid = gen.name("_valid");
        cxt.setParams({ passing });
        gen.block(validateOneOf);
        cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
        function validateOneOf() {
          schArr.forEach((sch, i) => {
            let schCxt;
            if ((0, util_1.alwaysValidSchema)(it, sch)) {
              gen.var(schValid, true);
            } else {
              schCxt = cxt.subschema({
                keyword: "oneOf",
                schemaProp: i,
                compositeRule: true
              }, schValid);
            }
            if (i > 0) {
              gen.if((0, codegen_1._)`${schValid} && ${valid}`).assign(valid, false).assign(passing, (0, codegen_1._)`[${passing}, ${i}]`).else();
            }
            gen.if(schValid, () => {
              gen.assign(valid, true);
              gen.assign(passing, i);
              if (schCxt)
                cxt.mergeEvaluated(schCxt, codegen_1.Name);
            });
          });
        }
      }
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/allOf.js
var require_allOf = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/allOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: "allOf",
      schemaType: "array",
      code(cxt) {
        const { gen, schema, it } = cxt;
        if (!Array.isArray(schema))
          throw new Error("ajv implementation error");
        const valid = gen.name("valid");
        schema.forEach((sch, i) => {
          if ((0, util_1.alwaysValidSchema)(it, sch))
            return;
          const schCxt = cxt.subschema({ keyword: "allOf", schemaProp: i }, valid);
          cxt.ok(valid);
          cxt.mergeEvaluated(schCxt);
        });
      }
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/if.js
var require_if = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/if.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error4 = {
      message: ({ params }) => (0, codegen_1.str)`must match "${params.ifClause}" schema`,
      params: ({ params }) => (0, codegen_1._)`{failingKeyword: ${params.ifClause}}`
    };
    var def = {
      keyword: "if",
      schemaType: ["object", "boolean"],
      trackErrors: true,
      error: error4,
      code(cxt) {
        const { gen, parentSchema, it } = cxt;
        if (parentSchema.then === void 0 && parentSchema.else === void 0) {
          (0, util_1.checkStrictMode)(it, '"if" without "then" and "else" is ignored');
        }
        const hasThen = hasSchema(it, "then");
        const hasElse = hasSchema(it, "else");
        if (!hasThen && !hasElse)
          return;
        const valid = gen.let("valid", true);
        const schValid = gen.name("_valid");
        validateIf();
        cxt.reset();
        if (hasThen && hasElse) {
          const ifClause = gen.let("ifClause");
          cxt.setParams({ ifClause });
          gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
        } else if (hasThen) {
          gen.if(schValid, validateClause("then"));
        } else {
          gen.if((0, codegen_1.not)(schValid), validateClause("else"));
        }
        cxt.pass(valid, () => cxt.error(true));
        function validateIf() {
          const schCxt = cxt.subschema({
            keyword: "if",
            compositeRule: true,
            createErrors: false,
            allErrors: false
          }, schValid);
          cxt.mergeEvaluated(schCxt);
        }
        function validateClause(keyword, ifClause) {
          return () => {
            const schCxt = cxt.subschema({ keyword }, schValid);
            gen.assign(valid, schValid);
            cxt.mergeValidEvaluated(schCxt, valid);
            if (ifClause)
              gen.assign(ifClause, (0, codegen_1._)`${keyword}`);
            else
              cxt.setParams({ ifClause: keyword });
          };
        }
      }
    };
    function hasSchema(it, keyword) {
      const schema = it.schema[keyword];
      return schema !== void 0 && !(0, util_1.alwaysValidSchema)(it, schema);
    }
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/thenElse.js
var require_thenElse = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/thenElse.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: ["then", "else"],
      schemaType: ["object", "boolean"],
      code({ keyword, parentSchema, it }) {
        if (parentSchema.if === void 0)
          (0, util_1.checkStrictMode)(it, `"${keyword}" without "if" is ignored`);
      }
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/index.js
var require_applicator = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var additionalItems_1 = require_additionalItems();
    var prefixItems_1 = require_prefixItems();
    var items_1 = require_items();
    var items2020_1 = require_items2020();
    var contains_1 = require_contains();
    var dependencies_1 = require_dependencies();
    var propertyNames_1 = require_propertyNames();
    var additionalProperties_1 = require_additionalProperties();
    var properties_1 = require_properties();
    var patternProperties_1 = require_patternProperties();
    var not_1 = require_not();
    var anyOf_1 = require_anyOf();
    var oneOf_1 = require_oneOf();
    var allOf_1 = require_allOf();
    var if_1 = require_if();
    var thenElse_1 = require_thenElse();
    function getApplicator(draft2020 = false) {
      const applicator = [
        // any
        not_1.default,
        anyOf_1.default,
        oneOf_1.default,
        allOf_1.default,
        if_1.default,
        thenElse_1.default,
        // object
        propertyNames_1.default,
        additionalProperties_1.default,
        dependencies_1.default,
        properties_1.default,
        patternProperties_1.default
      ];
      if (draft2020)
        applicator.push(prefixItems_1.default, items2020_1.default);
      else
        applicator.push(additionalItems_1.default, items_1.default);
      applicator.push(contains_1.default);
      return applicator;
    }
    exports.default = getApplicator;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/dynamic/dynamicAnchor.js
var require_dynamicAnchor = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/dynamic/dynamicAnchor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dynamicAnchor = void 0;
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var compile_1 = require_compile();
    var ref_1 = require_ref();
    var def = {
      keyword: "$dynamicAnchor",
      schemaType: "string",
      code: (cxt) => dynamicAnchor(cxt, cxt.schema)
    };
    function dynamicAnchor(cxt, anchor) {
      const { gen, it } = cxt;
      it.schemaEnv.root.dynamicAnchors[anchor] = true;
      const v = (0, codegen_1._)`${names_1.default.dynamicAnchors}${(0, codegen_1.getProperty)(anchor)}`;
      const validate2 = it.errSchemaPath === "#" ? it.validateName : _getValidate(cxt);
      gen.if((0, codegen_1._)`!${v}`, () => gen.assign(v, validate2));
    }
    exports.dynamicAnchor = dynamicAnchor;
    function _getValidate(cxt) {
      const { schemaEnv, schema, self } = cxt.it;
      const { root, baseId, localRefs, meta } = schemaEnv.root;
      const { schemaId } = self.opts;
      const sch = new compile_1.SchemaEnv({ schema, schemaId, root, baseId, localRefs, meta });
      compile_1.compileSchema.call(self, sch);
      return (0, ref_1.getValidate)(cxt, sch);
    }
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/dynamic/dynamicRef.js
var require_dynamicRef = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/dynamic/dynamicRef.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dynamicRef = void 0;
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var ref_1 = require_ref();
    var def = {
      keyword: "$dynamicRef",
      schemaType: "string",
      code: (cxt) => dynamicRef(cxt, cxt.schema)
    };
    function dynamicRef(cxt, ref) {
      const { gen, keyword, it } = cxt;
      if (ref[0] !== "#")
        throw new Error(`"${keyword}" only supports hash fragment reference`);
      const anchor = ref.slice(1);
      if (it.allErrors) {
        _dynamicRef();
      } else {
        const valid = gen.let("valid", false);
        _dynamicRef(valid);
        cxt.ok(valid);
      }
      function _dynamicRef(valid) {
        if (it.schemaEnv.root.dynamicAnchors[anchor]) {
          const v = gen.let("_v", (0, codegen_1._)`${names_1.default.dynamicAnchors}${(0, codegen_1.getProperty)(anchor)}`);
          gen.if(v, _callRef(v, valid), _callRef(it.validateName, valid));
        } else {
          _callRef(it.validateName, valid)();
        }
      }
      function _callRef(validate2, valid) {
        return valid ? () => gen.block(() => {
          (0, ref_1.callRef)(cxt, validate2);
          gen.let(valid, true);
        }) : () => (0, ref_1.callRef)(cxt, validate2);
      }
    }
    exports.dynamicRef = dynamicRef;
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/dynamic/recursiveAnchor.js
var require_recursiveAnchor = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/dynamic/recursiveAnchor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dynamicAnchor_1 = require_dynamicAnchor();
    var util_1 = require_util();
    var def = {
      keyword: "$recursiveAnchor",
      schemaType: "boolean",
      code(cxt) {
        if (cxt.schema)
          (0, dynamicAnchor_1.dynamicAnchor)(cxt, "");
        else
          (0, util_1.checkStrictMode)(cxt.it, "$recursiveAnchor: false is ignored");
      }
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/dynamic/recursiveRef.js
var require_recursiveRef = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/dynamic/recursiveRef.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dynamicRef_1 = require_dynamicRef();
    var def = {
      keyword: "$recursiveRef",
      schemaType: "string",
      code: (cxt) => (0, dynamicRef_1.dynamicRef)(cxt, cxt.schema)
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/dynamic/index.js
var require_dynamic = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/dynamic/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dynamicAnchor_1 = require_dynamicAnchor();
    var dynamicRef_1 = require_dynamicRef();
    var recursiveAnchor_1 = require_recursiveAnchor();
    var recursiveRef_1 = require_recursiveRef();
    var dynamic = [dynamicAnchor_1.default, dynamicRef_1.default, recursiveAnchor_1.default, recursiveRef_1.default];
    exports.default = dynamic;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/dependentRequired.js
var require_dependentRequired = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/dependentRequired.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dependencies_1 = require_dependencies();
    var def = {
      keyword: "dependentRequired",
      type: "object",
      schemaType: "object",
      error: dependencies_1.error,
      code: (cxt) => (0, dependencies_1.validatePropertyDeps)(cxt)
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/dependentSchemas.js
var require_dependentSchemas = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/dependentSchemas.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dependencies_1 = require_dependencies();
    var def = {
      keyword: "dependentSchemas",
      type: "object",
      schemaType: "object",
      code: (cxt) => (0, dependencies_1.validateSchemaDeps)(cxt)
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/limitContains.js
var require_limitContains = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/limitContains.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: ["maxContains", "minContains"],
      type: "array",
      schemaType: "number",
      code({ keyword, parentSchema, it }) {
        if (parentSchema.contains === void 0) {
          (0, util_1.checkStrictMode)(it, `"${keyword}" without "contains" is ignored`);
        }
      }
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/next.js
var require_next = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/next.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dependentRequired_1 = require_dependentRequired();
    var dependentSchemas_1 = require_dependentSchemas();
    var limitContains_1 = require_limitContains();
    var next = [dependentRequired_1.default, dependentSchemas_1.default, limitContains_1.default];
    exports.default = next;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedProperties.js
var require_unevaluatedProperties = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var names_1 = require_names();
    var error4 = {
      message: "must NOT have unevaluated properties",
      params: ({ params }) => (0, codegen_1._)`{unevaluatedProperty: ${params.unevaluatedProperty}}`
    };
    var def = {
      keyword: "unevaluatedProperties",
      type: "object",
      schemaType: ["boolean", "object"],
      trackErrors: true,
      error: error4,
      code(cxt) {
        const { gen, schema, data, errsCount, it } = cxt;
        if (!errsCount)
          throw new Error("ajv implementation error");
        const { allErrors, props } = it;
        if (props instanceof codegen_1.Name) {
          gen.if((0, codegen_1._)`${props} !== true`, () => gen.forIn("key", data, (key) => gen.if(unevaluatedDynamic(props, key), () => unevaluatedPropCode(key))));
        } else if (props !== true) {
          gen.forIn("key", data, (key) => props === void 0 ? unevaluatedPropCode(key) : gen.if(unevaluatedStatic(props, key), () => unevaluatedPropCode(key)));
        }
        it.props = true;
        cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
        function unevaluatedPropCode(key) {
          if (schema === false) {
            cxt.setParams({ unevaluatedProperty: key });
            cxt.error();
            if (!allErrors)
              gen.break();
            return;
          }
          if (!(0, util_1.alwaysValidSchema)(it, schema)) {
            const valid = gen.name("valid");
            cxt.subschema({
              keyword: "unevaluatedProperties",
              dataProp: key,
              dataPropType: util_1.Type.Str
            }, valid);
            if (!allErrors)
              gen.if((0, codegen_1.not)(valid), () => gen.break());
          }
        }
        function unevaluatedDynamic(evaluatedProps, key) {
          return (0, codegen_1._)`!${evaluatedProps} || !${evaluatedProps}[${key}]`;
        }
        function unevaluatedStatic(evaluatedProps, key) {
          const ps = [];
          for (const p in evaluatedProps) {
            if (evaluatedProps[p] === true)
              ps.push((0, codegen_1._)`${key} !== ${p}`);
          }
          return (0, codegen_1.and)(...ps);
        }
      }
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedItems.js
var require_unevaluatedItems = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error4 = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "unevaluatedItems",
      type: "array",
      schemaType: ["boolean", "object"],
      error: error4,
      code(cxt) {
        const { gen, schema, data, it } = cxt;
        const items = it.items || 0;
        if (items === true)
          return;
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        if (schema === false) {
          cxt.setParams({ len: items });
          cxt.fail((0, codegen_1._)`${len} > ${items}`);
        } else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
          const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items}`);
          gen.if((0, codegen_1.not)(valid), () => validateItems(valid, items));
          cxt.ok(valid);
        }
        it.items = true;
        function validateItems(valid, from) {
          gen.forRange("i", from, len, (i) => {
            cxt.subschema({ keyword: "unevaluatedItems", dataProp: i, dataPropType: util_1.Type.Num }, valid);
            if (!it.allErrors)
              gen.if((0, codegen_1.not)(valid), () => gen.break());
          });
        }
      }
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/unevaluated/index.js
var require_unevaluated = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/unevaluated/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var unevaluatedProperties_1 = require_unevaluatedProperties();
    var unevaluatedItems_1 = require_unevaluatedItems();
    var unevaluated = [unevaluatedProperties_1.default, unevaluatedItems_1.default];
    exports.default = unevaluated;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/format/format.js
var require_format = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/format/format.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error4 = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must match format "${schemaCode}"`,
      params: ({ schemaCode }) => (0, codegen_1._)`{format: ${schemaCode}}`
    };
    var def = {
      keyword: "format",
      type: ["number", "string"],
      schemaType: "string",
      $data: true,
      error: error4,
      code(cxt, ruleType) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        const { opts, errSchemaPath, schemaEnv, self } = it;
        if (!opts.validateFormats)
          return;
        if ($data)
          validate$DataFormat();
        else
          validateFormat();
        function validate$DataFormat() {
          const fmts = gen.scopeValue("formats", {
            ref: self.formats,
            code: opts.code.formats
          });
          const fDef = gen.const("fDef", (0, codegen_1._)`${fmts}[${schemaCode}]`);
          const fType = gen.let("fType");
          const format = gen.let("format");
          gen.if((0, codegen_1._)`typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`, () => gen.assign(fType, (0, codegen_1._)`${fDef}.type || "string"`).assign(format, (0, codegen_1._)`${fDef}.validate`), () => gen.assign(fType, (0, codegen_1._)`"string"`).assign(format, fDef));
          cxt.fail$data((0, codegen_1.or)(unknownFmt(), invalidFmt()));
          function unknownFmt() {
            if (opts.strictSchema === false)
              return codegen_1.nil;
            return (0, codegen_1._)`${schemaCode} && !${format}`;
          }
          function invalidFmt() {
            const callFormat = schemaEnv.$async ? (0, codegen_1._)`(${fDef}.async ? await ${format}(${data}) : ${format}(${data}))` : (0, codegen_1._)`${format}(${data})`;
            const validData = (0, codegen_1._)`(typeof ${format} == "function" ? ${callFormat} : ${format}.test(${data}))`;
            return (0, codegen_1._)`${format} && ${format} !== true && ${fType} === ${ruleType} && !${validData}`;
          }
        }
        function validateFormat() {
          const formatDef = self.formats[schema];
          if (!formatDef) {
            unknownFormat();
            return;
          }
          if (formatDef === true)
            return;
          const [fmtType, format, fmtRef] = getFormat(formatDef);
          if (fmtType === ruleType)
            cxt.pass(validCondition());
          function unknownFormat() {
            if (opts.strictSchema === false) {
              self.logger.warn(unknownMsg());
              return;
            }
            throw new Error(unknownMsg());
            function unknownMsg() {
              return `unknown format "${schema}" ignored in schema at path "${errSchemaPath}"`;
            }
          }
          function getFormat(fmtDef) {
            const code = fmtDef instanceof RegExp ? (0, codegen_1.regexpCode)(fmtDef) : opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(schema)}` : void 0;
            const fmt = gen.scopeValue("formats", { key: schema, ref: fmtDef, code });
            if (typeof fmtDef == "object" && !(fmtDef instanceof RegExp)) {
              return [fmtDef.type || "string", fmtDef.validate, (0, codegen_1._)`${fmt}.validate`];
            }
            return ["string", fmtDef, fmt];
          }
          function validCondition() {
            if (typeof formatDef == "object" && !(formatDef instanceof RegExp) && formatDef.async) {
              if (!schemaEnv.$async)
                throw new Error("async format in sync schema");
              return (0, codegen_1._)`await ${fmtRef}(${data})`;
            }
            return typeof format == "function" ? (0, codegen_1._)`${fmtRef}(${data})` : (0, codegen_1._)`${fmtRef}.test(${data})`;
          }
        }
      }
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/format/index.js
var require_format2 = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/format/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var format_1 = require_format();
    var format = [format_1.default];
    exports.default = format;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/metadata.js
var require_metadata = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/metadata.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.contentVocabulary = exports.metadataVocabulary = void 0;
    exports.metadataVocabulary = [
      "title",
      "description",
      "default",
      "deprecated",
      "readOnly",
      "writeOnly",
      "examples"
    ];
    exports.contentVocabulary = [
      "contentMediaType",
      "contentEncoding",
      "contentSchema"
    ];
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/draft2020.js
var require_draft2020 = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/draft2020.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require_core2();
    var validation_1 = require_validation();
    var applicator_1 = require_applicator();
    var dynamic_1 = require_dynamic();
    var next_1 = require_next();
    var unevaluated_1 = require_unevaluated();
    var format_1 = require_format2();
    var metadata_1 = require_metadata();
    var draft2020Vocabularies = [
      dynamic_1.default,
      core_1.default,
      validation_1.default,
      (0, applicator_1.default)(true),
      format_1.default,
      metadata_1.metadataVocabulary,
      metadata_1.contentVocabulary,
      next_1.default,
      unevaluated_1.default
    ];
    exports.default = draft2020Vocabularies;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/discriminator/types.js
var require_types = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/discriminator/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DiscrError = void 0;
    var DiscrError;
    (function(DiscrError2) {
      DiscrError2["Tag"] = "tag";
      DiscrError2["Mapping"] = "mapping";
    })(DiscrError || (exports.DiscrError = DiscrError = {}));
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/discriminator/index.js
var require_discriminator = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/discriminator/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var types_1 = require_types();
    var compile_1 = require_compile();
    var ref_error_1 = require_ref_error();
    var util_1 = require_util();
    var error4 = {
      message: ({ params: { discrError, tagName } }) => discrError === types_1.DiscrError.Tag ? `tag "${tagName}" must be string` : `value of tag "${tagName}" must be in oneOf`,
      params: ({ params: { discrError, tag, tagName } }) => (0, codegen_1._)`{error: ${discrError}, tag: ${tagName}, tagValue: ${tag}}`
    };
    var def = {
      keyword: "discriminator",
      type: "object",
      schemaType: "object",
      error: error4,
      code(cxt) {
        const { gen, data, schema, parentSchema, it } = cxt;
        const { oneOf } = parentSchema;
        if (!it.opts.discriminator) {
          throw new Error("discriminator: requires discriminator option");
        }
        const tagName = schema.propertyName;
        if (typeof tagName != "string")
          throw new Error("discriminator: requires propertyName");
        if (schema.mapping)
          throw new Error("discriminator: mapping is not supported");
        if (!oneOf)
          throw new Error("discriminator: requires oneOf keyword");
        const valid = gen.let("valid", false);
        const tag = gen.const("tag", (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(tagName)}`);
        gen.if((0, codegen_1._)`typeof ${tag} == "string"`, () => validateMapping(), () => cxt.error(false, { discrError: types_1.DiscrError.Tag, tag, tagName }));
        cxt.ok(valid);
        function validateMapping() {
          const mapping = getMapping();
          gen.if(false);
          for (const tagValue in mapping) {
            gen.elseIf((0, codegen_1._)`${tag} === ${tagValue}`);
            gen.assign(valid, applyTagSchema(mapping[tagValue]));
          }
          gen.else();
          cxt.error(false, { discrError: types_1.DiscrError.Mapping, tag, tagName });
          gen.endIf();
        }
        function applyTagSchema(schemaProp) {
          const _valid = gen.name("valid");
          const schCxt = cxt.subschema({ keyword: "oneOf", schemaProp }, _valid);
          cxt.mergeEvaluated(schCxt, codegen_1.Name);
          return _valid;
        }
        function getMapping() {
          var _a;
          const oneOfMapping = {};
          const topRequired = hasRequired(parentSchema);
          let tagRequired = true;
          for (let i = 0; i < oneOf.length; i++) {
            let sch = oneOf[i];
            if ((sch === null || sch === void 0 ? void 0 : sch.$ref) && !(0, util_1.schemaHasRulesButRef)(sch, it.self.RULES)) {
              const ref = sch.$ref;
              sch = compile_1.resolveRef.call(it.self, it.schemaEnv.root, it.baseId, ref);
              if (sch instanceof compile_1.SchemaEnv)
                sch = sch.schema;
              if (sch === void 0)
                throw new ref_error_1.default(it.opts.uriResolver, it.baseId, ref);
            }
            const propSch = (_a = sch === null || sch === void 0 ? void 0 : sch.properties) === null || _a === void 0 ? void 0 : _a[tagName];
            if (typeof propSch != "object") {
              throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${tagName}"`);
            }
            tagRequired = tagRequired && (topRequired || hasRequired(sch));
            addMappings(propSch, i);
          }
          if (!tagRequired)
            throw new Error(`discriminator: "${tagName}" must be required`);
          return oneOfMapping;
          function hasRequired({ required }) {
            return Array.isArray(required) && required.includes(tagName);
          }
          function addMappings(sch, i) {
            if (sch.const) {
              addMapping(sch.const, i);
            } else if (sch.enum) {
              for (const tagValue of sch.enum) {
                addMapping(tagValue, i);
              }
            } else {
              throw new Error(`discriminator: "properties/${tagName}" must have "const" or "enum"`);
            }
          }
          function addMapping(tagValue, i) {
            if (typeof tagValue != "string" || tagValue in oneOfMapping) {
              throw new Error(`discriminator: "${tagName}" values must be unique strings`);
            }
            oneOfMapping[tagValue] = i;
          }
        }
      }
    };
    exports.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/refs/json-schema-2020-12/schema.json
var require_schema = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/refs/json-schema-2020-12/schema.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/schema",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/core": true,
        "https://json-schema.org/draft/2020-12/vocab/applicator": true,
        "https://json-schema.org/draft/2020-12/vocab/unevaluated": true,
        "https://json-schema.org/draft/2020-12/vocab/validation": true,
        "https://json-schema.org/draft/2020-12/vocab/meta-data": true,
        "https://json-schema.org/draft/2020-12/vocab/format-annotation": true,
        "https://json-schema.org/draft/2020-12/vocab/content": true
      },
      $dynamicAnchor: "meta",
      title: "Core and Validation specifications meta-schema",
      allOf: [
        { $ref: "meta/core" },
        { $ref: "meta/applicator" },
        { $ref: "meta/unevaluated" },
        { $ref: "meta/validation" },
        { $ref: "meta/meta-data" },
        { $ref: "meta/format-annotation" },
        { $ref: "meta/content" }
      ],
      type: ["object", "boolean"],
      $comment: "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.",
      properties: {
        definitions: {
          $comment: '"definitions" has been replaced by "$defs".',
          type: "object",
          additionalProperties: { $dynamicRef: "#meta" },
          deprecated: true,
          default: {}
        },
        dependencies: {
          $comment: '"dependencies" has been split and replaced by "dependentSchemas" and "dependentRequired" in order to serve their differing semantics.',
          type: "object",
          additionalProperties: {
            anyOf: [{ $dynamicRef: "#meta" }, { $ref: "meta/validation#/$defs/stringArray" }]
          },
          deprecated: true,
          default: {}
        },
        $recursiveAnchor: {
          $comment: '"$recursiveAnchor" has been replaced by "$dynamicAnchor".',
          $ref: "meta/core#/$defs/anchorString",
          deprecated: true
        },
        $recursiveRef: {
          $comment: '"$recursiveRef" has been replaced by "$dynamicRef".',
          $ref: "meta/core#/$defs/uriReferenceString",
          deprecated: true
        }
      }
    };
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/refs/json-schema-2020-12/meta/applicator.json
var require_applicator2 = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/refs/json-schema-2020-12/meta/applicator.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/applicator",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/applicator": true
      },
      $dynamicAnchor: "meta",
      title: "Applicator vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        prefixItems: { $ref: "#/$defs/schemaArray" },
        items: { $dynamicRef: "#meta" },
        contains: { $dynamicRef: "#meta" },
        additionalProperties: { $dynamicRef: "#meta" },
        properties: {
          type: "object",
          additionalProperties: { $dynamicRef: "#meta" },
          default: {}
        },
        patternProperties: {
          type: "object",
          additionalProperties: { $dynamicRef: "#meta" },
          propertyNames: { format: "regex" },
          default: {}
        },
        dependentSchemas: {
          type: "object",
          additionalProperties: { $dynamicRef: "#meta" },
          default: {}
        },
        propertyNames: { $dynamicRef: "#meta" },
        if: { $dynamicRef: "#meta" },
        then: { $dynamicRef: "#meta" },
        else: { $dynamicRef: "#meta" },
        allOf: { $ref: "#/$defs/schemaArray" },
        anyOf: { $ref: "#/$defs/schemaArray" },
        oneOf: { $ref: "#/$defs/schemaArray" },
        not: { $dynamicRef: "#meta" }
      },
      $defs: {
        schemaArray: {
          type: "array",
          minItems: 1,
          items: { $dynamicRef: "#meta" }
        }
      }
    };
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/refs/json-schema-2020-12/meta/unevaluated.json
var require_unevaluated2 = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/refs/json-schema-2020-12/meta/unevaluated.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/unevaluated",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/unevaluated": true
      },
      $dynamicAnchor: "meta",
      title: "Unevaluated applicator vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        unevaluatedItems: { $dynamicRef: "#meta" },
        unevaluatedProperties: { $dynamicRef: "#meta" }
      }
    };
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/refs/json-schema-2020-12/meta/content.json
var require_content = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/refs/json-schema-2020-12/meta/content.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/content",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/content": true
      },
      $dynamicAnchor: "meta",
      title: "Content vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        contentEncoding: { type: "string" },
        contentMediaType: { type: "string" },
        contentSchema: { $dynamicRef: "#meta" }
      }
    };
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/refs/json-schema-2020-12/meta/core.json
var require_core3 = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/refs/json-schema-2020-12/meta/core.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/core",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/core": true
      },
      $dynamicAnchor: "meta",
      title: "Core vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        $id: {
          $ref: "#/$defs/uriReferenceString",
          $comment: "Non-empty fragments not allowed.",
          pattern: "^[^#]*#?$"
        },
        $schema: { $ref: "#/$defs/uriString" },
        $ref: { $ref: "#/$defs/uriReferenceString" },
        $anchor: { $ref: "#/$defs/anchorString" },
        $dynamicRef: { $ref: "#/$defs/uriReferenceString" },
        $dynamicAnchor: { $ref: "#/$defs/anchorString" },
        $vocabulary: {
          type: "object",
          propertyNames: { $ref: "#/$defs/uriString" },
          additionalProperties: {
            type: "boolean"
          }
        },
        $comment: {
          type: "string"
        },
        $defs: {
          type: "object",
          additionalProperties: { $dynamicRef: "#meta" }
        }
      },
      $defs: {
        anchorString: {
          type: "string",
          pattern: "^[A-Za-z_][-A-Za-z0-9._]*$"
        },
        uriString: {
          type: "string",
          format: "uri"
        },
        uriReferenceString: {
          type: "string",
          format: "uri-reference"
        }
      }
    };
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/refs/json-schema-2020-12/meta/format-annotation.json
var require_format_annotation = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/refs/json-schema-2020-12/meta/format-annotation.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/format-annotation",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/format-annotation": true
      },
      $dynamicAnchor: "meta",
      title: "Format vocabulary meta-schema for annotation results",
      type: ["object", "boolean"],
      properties: {
        format: { type: "string" }
      }
    };
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/refs/json-schema-2020-12/meta/meta-data.json
var require_meta_data = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/refs/json-schema-2020-12/meta/meta-data.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/meta-data",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/meta-data": true
      },
      $dynamicAnchor: "meta",
      title: "Meta-data vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        title: {
          type: "string"
        },
        description: {
          type: "string"
        },
        default: true,
        deprecated: {
          type: "boolean",
          default: false
        },
        readOnly: {
          type: "boolean",
          default: false
        },
        writeOnly: {
          type: "boolean",
          default: false
        },
        examples: {
          type: "array",
          items: true
        }
      }
    };
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/refs/json-schema-2020-12/meta/validation.json
var require_validation2 = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/refs/json-schema-2020-12/meta/validation.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/validation",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/validation": true
      },
      $dynamicAnchor: "meta",
      title: "Validation vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        type: {
          anyOf: [
            { $ref: "#/$defs/simpleTypes" },
            {
              type: "array",
              items: { $ref: "#/$defs/simpleTypes" },
              minItems: 1,
              uniqueItems: true
            }
          ]
        },
        const: true,
        enum: {
          type: "array",
          items: true
        },
        multipleOf: {
          type: "number",
          exclusiveMinimum: 0
        },
        maximum: {
          type: "number"
        },
        exclusiveMaximum: {
          type: "number"
        },
        minimum: {
          type: "number"
        },
        exclusiveMinimum: {
          type: "number"
        },
        maxLength: { $ref: "#/$defs/nonNegativeInteger" },
        minLength: { $ref: "#/$defs/nonNegativeIntegerDefault0" },
        pattern: {
          type: "string",
          format: "regex"
        },
        maxItems: { $ref: "#/$defs/nonNegativeInteger" },
        minItems: { $ref: "#/$defs/nonNegativeIntegerDefault0" },
        uniqueItems: {
          type: "boolean",
          default: false
        },
        maxContains: { $ref: "#/$defs/nonNegativeInteger" },
        minContains: {
          $ref: "#/$defs/nonNegativeInteger",
          default: 1
        },
        maxProperties: { $ref: "#/$defs/nonNegativeInteger" },
        minProperties: { $ref: "#/$defs/nonNegativeIntegerDefault0" },
        required: { $ref: "#/$defs/stringArray" },
        dependentRequired: {
          type: "object",
          additionalProperties: {
            $ref: "#/$defs/stringArray"
          }
        }
      },
      $defs: {
        nonNegativeInteger: {
          type: "integer",
          minimum: 0
        },
        nonNegativeIntegerDefault0: {
          $ref: "#/$defs/nonNegativeInteger",
          default: 0
        },
        simpleTypes: {
          enum: ["array", "boolean", "integer", "null", "number", "object", "string"]
        },
        stringArray: {
          type: "array",
          items: { type: "string" },
          uniqueItems: true,
          default: []
        }
      }
    };
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/refs/json-schema-2020-12/index.js
var require_json_schema_2020_12 = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/refs/json-schema-2020-12/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var metaSchema = require_schema();
    var applicator = require_applicator2();
    var unevaluated = require_unevaluated2();
    var content = require_content();
    var core = require_core3();
    var format = require_format_annotation();
    var metadata = require_meta_data();
    var validation = require_validation2();
    var META_SUPPORT_DATA = ["/properties"];
    function addMetaSchema2020($data) {
      ;
      [
        metaSchema,
        applicator,
        unevaluated,
        content,
        core,
        with$data(this, format),
        metadata,
        with$data(this, validation)
      ].forEach((sch) => this.addMetaSchema(sch, void 0, false));
      return this;
      function with$data(ajv2, sch) {
        return $data ? ajv2.$dataMetaSchema(sch, META_SUPPORT_DATA) : sch;
      }
    }
    exports.default = addMetaSchema2020;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/2020.js
var require__ = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/2020.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MissingRefError = exports.ValidationError = exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = exports.Ajv2020 = void 0;
    var core_1 = require_core();
    var draft2020_1 = require_draft2020();
    var discriminator_1 = require_discriminator();
    var json_schema_2020_12_1 = require_json_schema_2020_12();
    var META_SCHEMA_ID = "https://json-schema.org/draft/2020-12/schema";
    var Ajv2020 = class extends core_1.default {
      constructor(opts = {}) {
        super({
          ...opts,
          dynamicRef: true,
          next: true,
          unevaluated: true
        });
      }
      _addVocabularies() {
        super._addVocabularies();
        draft2020_1.default.forEach((v) => this.addVocabulary(v));
        if (this.opts.discriminator)
          this.addKeyword(discriminator_1.default);
      }
      _addDefaultMetaSchema() {
        super._addDefaultMetaSchema();
        const { $data, meta } = this.opts;
        if (!meta)
          return;
        json_schema_2020_12_1.default.call(this, $data);
        this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0);
      }
    };
    exports.Ajv2020 = Ajv2020;
    module.exports = exports = Ajv2020;
    module.exports.Ajv2020 = Ajv2020;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Ajv2020;
    var validate_1 = require_validate();
    Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
      return validate_1.KeywordCxt;
    } });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return codegen_1._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return codegen_1.str;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return codegen_1.stringify;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return codegen_1.nil;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return codegen_1.Name;
    } });
    Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
      return codegen_1.CodeGen;
    } });
    var validation_error_1 = require_validation_error();
    Object.defineProperty(exports, "ValidationError", { enumerable: true, get: function() {
      return validation_error_1.default;
    } });
    var ref_error_1 = require_ref_error();
    Object.defineProperty(exports, "MissingRefError", { enumerable: true, get: function() {
      return ref_error_1.default;
    } });
  }
});

// ../../node_modules/.pnpm/ajv-formats@3.0.1_ajv@8.20.0/node_modules/ajv-formats/dist/formats.js
var require_formats = __commonJS({
  "../../node_modules/.pnpm/ajv-formats@3.0.1_ajv@8.20.0/node_modules/ajv-formats/dist/formats.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatNames = exports.fastFormats = exports.fullFormats = void 0;
    function fmtDef(validate2, compare) {
      return { validate: validate2, compare };
    }
    exports.fullFormats = {
      // date: http://tools.ietf.org/html/rfc3339#section-5.6
      date: fmtDef(date, compareDate),
      // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
      time: fmtDef(getTime(true), compareTime),
      "date-time": fmtDef(getDateTime(true), compareDateTime),
      "iso-time": fmtDef(getTime(), compareIsoTime),
      "iso-date-time": fmtDef(getDateTime(), compareIsoDateTime),
      // duration: https://tools.ietf.org/html/rfc3339#appendix-A
      duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
      uri,
      "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
      // uri-template: https://tools.ietf.org/html/rfc6570
      "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
      // For the source: https://gist.github.com/dperini/729294
      // For test cases: https://mathiasbynens.be/demo/url-regex
      url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
      email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
      hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
      // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
      ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
      ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
      regex,
      // uuid: http://tools.ietf.org/html/rfc4122
      uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
      // JSON-pointer: https://tools.ietf.org/html/rfc6901
      // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
      "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
      "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
      // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
      "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
      // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
      // byte: https://github.com/miguelmota/is-base64
      byte,
      // signed 32 bit integer
      int32: { type: "number", validate: validateInt32 },
      // signed 64 bit integer
      int64: { type: "number", validate: validateInt64 },
      // C-type float
      float: { type: "number", validate: validateNumber },
      // C-type double
      double: { type: "number", validate: validateNumber },
      // hint to the UI to hide input strings
      password: true,
      // unchecked string payload
      binary: true
    };
    exports.fastFormats = {
      ...exports.fullFormats,
      date: fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, compareDate),
      time: fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareTime),
      "date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareDateTime),
      "iso-time": fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareIsoTime),
      "iso-date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareIsoDateTime),
      // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
      uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
      "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
      // email (sources from jsen validator):
      // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
      // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
      email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
    };
    exports.formatNames = Object.keys(exports.fullFormats);
    function isLeapYear(year) {
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }
    var DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
    var DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function date(str) {
      const matches = DATE.exec(str);
      if (!matches)
        return false;
      const year = +matches[1];
      const month = +matches[2];
      const day = +matches[3];
      return month >= 1 && month <= 12 && day >= 1 && day <= (month === 2 && isLeapYear(year) ? 29 : DAYS[month]);
    }
    function compareDate(d1, d2) {
      if (!(d1 && d2))
        return void 0;
      if (d1 > d2)
        return 1;
      if (d1 < d2)
        return -1;
      return 0;
    }
    var TIME = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
    function getTime(strictTimeZone) {
      return function time(str) {
        const matches = TIME.exec(str);
        if (!matches)
          return false;
        const hr = +matches[1];
        const min = +matches[2];
        const sec = +matches[3];
        const tz = matches[4];
        const tzSign = matches[5] === "-" ? -1 : 1;
        const tzH = +(matches[6] || 0);
        const tzM = +(matches[7] || 0);
        if (tzH > 23 || tzM > 59 || strictTimeZone && !tz)
          return false;
        if (hr <= 23 && min <= 59 && sec < 60)
          return true;
        const utcMin = min - tzM * tzSign;
        const utcHr = hr - tzH * tzSign - (utcMin < 0 ? 1 : 0);
        return (utcHr === 23 || utcHr === -1) && (utcMin === 59 || utcMin === -1) && sec < 61;
      };
    }
    function compareTime(s1, s2) {
      if (!(s1 && s2))
        return void 0;
      const t1 = (/* @__PURE__ */ new Date("2020-01-01T" + s1)).valueOf();
      const t2 = (/* @__PURE__ */ new Date("2020-01-01T" + s2)).valueOf();
      if (!(t1 && t2))
        return void 0;
      return t1 - t2;
    }
    function compareIsoTime(t1, t2) {
      if (!(t1 && t2))
        return void 0;
      const a1 = TIME.exec(t1);
      const a2 = TIME.exec(t2);
      if (!(a1 && a2))
        return void 0;
      t1 = a1[1] + a1[2] + a1[3];
      t2 = a2[1] + a2[2] + a2[3];
      if (t1 > t2)
        return 1;
      if (t1 < t2)
        return -1;
      return 0;
    }
    var DATE_TIME_SEPARATOR = /t|\s/i;
    function getDateTime(strictTimeZone) {
      const time = getTime(strictTimeZone);
      return function date_time(str) {
        const dateTime = str.split(DATE_TIME_SEPARATOR);
        return dateTime.length === 2 && date(dateTime[0]) && time(dateTime[1]);
      };
    }
    function compareDateTime(dt1, dt2) {
      if (!(dt1 && dt2))
        return void 0;
      const d1 = new Date(dt1).valueOf();
      const d2 = new Date(dt2).valueOf();
      if (!(d1 && d2))
        return void 0;
      return d1 - d2;
    }
    function compareIsoDateTime(dt1, dt2) {
      if (!(dt1 && dt2))
        return void 0;
      const [d1, t1] = dt1.split(DATE_TIME_SEPARATOR);
      const [d2, t2] = dt2.split(DATE_TIME_SEPARATOR);
      const res = compareDate(d1, d2);
      if (res === void 0)
        return void 0;
      return res || compareTime(t1, t2);
    }
    var NOT_URI_FRAGMENT = /\/|:/;
    var URI = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
    function uri(str) {
      return NOT_URI_FRAGMENT.test(str) && URI.test(str);
    }
    var BYTE = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
    function byte(str) {
      BYTE.lastIndex = 0;
      return BYTE.test(str);
    }
    var MIN_INT32 = -(2 ** 31);
    var MAX_INT32 = 2 ** 31 - 1;
    function validateInt32(value) {
      return Number.isInteger(value) && value <= MAX_INT32 && value >= MIN_INT32;
    }
    function validateInt64(value) {
      return Number.isInteger(value);
    }
    function validateNumber() {
      return true;
    }
    var Z_ANCHOR = /[^\\]\\Z/;
    function regex(str) {
      if (Z_ANCHOR.test(str))
        return false;
      try {
        new RegExp(str);
        return true;
      } catch (e) {
        return false;
      }
    }
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/draft7.js
var require_draft7 = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/draft7.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require_core2();
    var validation_1 = require_validation();
    var applicator_1 = require_applicator();
    var format_1 = require_format2();
    var metadata_1 = require_metadata();
    var draft7Vocabularies = [
      core_1.default,
      validation_1.default,
      (0, applicator_1.default)(),
      format_1.default,
      metadata_1.metadataVocabulary,
      metadata_1.contentVocabulary
    ];
    exports.default = draft7Vocabularies;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/refs/json-schema-draft-07.json
var require_json_schema_draft_07 = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/refs/json-schema-draft-07.json"(exports, module) {
    module.exports = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "http://json-schema.org/draft-07/schema#",
      title: "Core schema meta-schema",
      definitions: {
        schemaArray: {
          type: "array",
          minItems: 1,
          items: { $ref: "#" }
        },
        nonNegativeInteger: {
          type: "integer",
          minimum: 0
        },
        nonNegativeIntegerDefault0: {
          allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }]
        },
        simpleTypes: {
          enum: ["array", "boolean", "integer", "null", "number", "object", "string"]
        },
        stringArray: {
          type: "array",
          items: { type: "string" },
          uniqueItems: true,
          default: []
        }
      },
      type: ["object", "boolean"],
      properties: {
        $id: {
          type: "string",
          format: "uri-reference"
        },
        $schema: {
          type: "string",
          format: "uri"
        },
        $ref: {
          type: "string",
          format: "uri-reference"
        },
        $comment: {
          type: "string"
        },
        title: {
          type: "string"
        },
        description: {
          type: "string"
        },
        default: true,
        readOnly: {
          type: "boolean",
          default: false
        },
        examples: {
          type: "array",
          items: true
        },
        multipleOf: {
          type: "number",
          exclusiveMinimum: 0
        },
        maximum: {
          type: "number"
        },
        exclusiveMaximum: {
          type: "number"
        },
        minimum: {
          type: "number"
        },
        exclusiveMinimum: {
          type: "number"
        },
        maxLength: { $ref: "#/definitions/nonNegativeInteger" },
        minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        pattern: {
          type: "string",
          format: "regex"
        },
        additionalItems: { $ref: "#" },
        items: {
          anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }],
          default: true
        },
        maxItems: { $ref: "#/definitions/nonNegativeInteger" },
        minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        uniqueItems: {
          type: "boolean",
          default: false
        },
        contains: { $ref: "#" },
        maxProperties: { $ref: "#/definitions/nonNegativeInteger" },
        minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        required: { $ref: "#/definitions/stringArray" },
        additionalProperties: { $ref: "#" },
        definitions: {
          type: "object",
          additionalProperties: { $ref: "#" },
          default: {}
        },
        properties: {
          type: "object",
          additionalProperties: { $ref: "#" },
          default: {}
        },
        patternProperties: {
          type: "object",
          additionalProperties: { $ref: "#" },
          propertyNames: { format: "regex" },
          default: {}
        },
        dependencies: {
          type: "object",
          additionalProperties: {
            anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }]
          }
        },
        propertyNames: { $ref: "#" },
        const: true,
        enum: {
          type: "array",
          items: true,
          minItems: 1,
          uniqueItems: true
        },
        type: {
          anyOf: [
            { $ref: "#/definitions/simpleTypes" },
            {
              type: "array",
              items: { $ref: "#/definitions/simpleTypes" },
              minItems: 1,
              uniqueItems: true
            }
          ]
        },
        format: { type: "string" },
        contentMediaType: { type: "string" },
        contentEncoding: { type: "string" },
        if: { $ref: "#" },
        then: { $ref: "#" },
        else: { $ref: "#" },
        allOf: { $ref: "#/definitions/schemaArray" },
        anyOf: { $ref: "#/definitions/schemaArray" },
        oneOf: { $ref: "#/definitions/schemaArray" },
        not: { $ref: "#" }
      },
      default: true
    };
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/ajv.js
var require_ajv = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/ajv.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MissingRefError = exports.ValidationError = exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = exports.Ajv = void 0;
    var core_1 = require_core();
    var draft7_1 = require_draft7();
    var discriminator_1 = require_discriminator();
    var draft7MetaSchema = require_json_schema_draft_07();
    var META_SUPPORT_DATA = ["/properties"];
    var META_SCHEMA_ID = "http://json-schema.org/draft-07/schema";
    var Ajv = class extends core_1.default {
      _addVocabularies() {
        super._addVocabularies();
        draft7_1.default.forEach((v) => this.addVocabulary(v));
        if (this.opts.discriminator)
          this.addKeyword(discriminator_1.default);
      }
      _addDefaultMetaSchema() {
        super._addDefaultMetaSchema();
        if (!this.opts.meta)
          return;
        const metaSchema = this.opts.$data ? this.$dataMetaSchema(draft7MetaSchema, META_SUPPORT_DATA) : draft7MetaSchema;
        this.addMetaSchema(metaSchema, META_SCHEMA_ID, false);
        this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0);
      }
    };
    exports.Ajv = Ajv;
    module.exports = exports = Ajv;
    module.exports.Ajv = Ajv;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Ajv;
    var validate_1 = require_validate();
    Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
      return validate_1.KeywordCxt;
    } });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return codegen_1._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return codegen_1.str;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return codegen_1.stringify;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return codegen_1.nil;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return codegen_1.Name;
    } });
    Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
      return codegen_1.CodeGen;
    } });
    var validation_error_1 = require_validation_error();
    Object.defineProperty(exports, "ValidationError", { enumerable: true, get: function() {
      return validation_error_1.default;
    } });
    var ref_error_1 = require_ref_error();
    Object.defineProperty(exports, "MissingRefError", { enumerable: true, get: function() {
      return ref_error_1.default;
    } });
  }
});

// ../../node_modules/.pnpm/ajv-formats@3.0.1_ajv@8.20.0/node_modules/ajv-formats/dist/limit.js
var require_limit = __commonJS({
  "../../node_modules/.pnpm/ajv-formats@3.0.1_ajv@8.20.0/node_modules/ajv-formats/dist/limit.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatLimitDefinition = void 0;
    var ajv_1 = require_ajv();
    var codegen_1 = require_codegen();
    var ops = codegen_1.operators;
    var KWDs = {
      formatMaximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
      formatMinimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
      formatExclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
      formatExclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE }
    };
    var error4 = {
      message: ({ keyword, schemaCode }) => (0, codegen_1.str)`should be ${KWDs[keyword].okStr} ${schemaCode}`,
      params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
    };
    exports.formatLimitDefinition = {
      keyword: Object.keys(KWDs),
      type: "string",
      schemaType: "string",
      $data: true,
      error: error4,
      code(cxt) {
        const { gen, data, schemaCode, keyword, it } = cxt;
        const { opts, self } = it;
        if (!opts.validateFormats)
          return;
        const fCxt = new ajv_1.KeywordCxt(it, self.RULES.all.format.definition, "format");
        if (fCxt.$data)
          validate$DataFormat();
        else
          validateFormat();
        function validate$DataFormat() {
          const fmts = gen.scopeValue("formats", {
            ref: self.formats,
            code: opts.code.formats
          });
          const fmt = gen.const("fmt", (0, codegen_1._)`${fmts}[${fCxt.schemaCode}]`);
          cxt.fail$data((0, codegen_1.or)((0, codegen_1._)`typeof ${fmt} != "object"`, (0, codegen_1._)`${fmt} instanceof RegExp`, (0, codegen_1._)`typeof ${fmt}.compare != "function"`, compareCode(fmt)));
        }
        function validateFormat() {
          const format = fCxt.schema;
          const fmtDef = self.formats[format];
          if (!fmtDef || fmtDef === true)
            return;
          if (typeof fmtDef != "object" || fmtDef instanceof RegExp || typeof fmtDef.compare != "function") {
            throw new Error(`"${keyword}": format "${format}" does not define "compare" function`);
          }
          const fmt = gen.scopeValue("formats", {
            key: format,
            ref: fmtDef,
            code: opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(format)}` : void 0
          });
          cxt.fail$data(compareCode(fmt));
        }
        function compareCode(fmt) {
          return (0, codegen_1._)`${fmt}.compare(${data}, ${schemaCode}) ${KWDs[keyword].fail} 0`;
        }
      },
      dependencies: ["format"]
    };
    var formatLimitPlugin = (ajv2) => {
      ajv2.addKeyword(exports.formatLimitDefinition);
      return ajv2;
    };
    exports.default = formatLimitPlugin;
  }
});

// ../../node_modules/.pnpm/ajv-formats@3.0.1_ajv@8.20.0/node_modules/ajv-formats/dist/index.js
var require_dist = __commonJS({
  "../../node_modules/.pnpm/ajv-formats@3.0.1_ajv@8.20.0/node_modules/ajv-formats/dist/index.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var formats_1 = require_formats();
    var limit_1 = require_limit();
    var codegen_1 = require_codegen();
    var fullName = new codegen_1.Name("fullFormats");
    var fastName = new codegen_1.Name("fastFormats");
    var formatsPlugin = (ajv2, opts = { keywords: true }) => {
      if (Array.isArray(opts)) {
        addFormats(ajv2, opts, formats_1.fullFormats, fullName);
        return ajv2;
      }
      const [formats, exportName] = opts.mode === "fast" ? [formats_1.fastFormats, fastName] : [formats_1.fullFormats, fullName];
      const list = opts.formats || formats_1.formatNames;
      addFormats(ajv2, list, formats, exportName);
      if (opts.keywords)
        (0, limit_1.default)(ajv2);
      return ajv2;
    };
    formatsPlugin.get = (name, mode = "full") => {
      const formats = mode === "fast" ? formats_1.fastFormats : formats_1.fullFormats;
      const f = formats[name];
      if (!f)
        throw new Error(`Unknown format "${name}"`);
      return f;
    };
    function addFormats(ajv2, list, fs, exportName) {
      var _a;
      var _b;
      (_a = (_b = ajv2.opts.code).formats) !== null && _a !== void 0 ? _a : _b.formats = (0, codegen_1._)`require("ajv-formats/dist/formats").${exportName}`;
      for (const f of list)
        ajv2.addFormat(f, fs[f]);
    }
    module.exports = exports = formatsPlugin;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = formatsPlugin;
  }
});

// src/stdio.ts
import { serveStdio } from "@modelcontextprotocol/server/stdio";

// src/mcp.ts
import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod/v4";

// src/validation.ts
function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value) && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
}
function assertClosedObject(value, allowed, required, label) {
  if (!isPlainObject(value)) throw new Error(`${label}_MUST_BE_OBJECT`);
  const keys = Object.keys(value);
  for (const key of keys) {
    if (!allowed.includes(key))
      throw new Error(`${label}_UNKNOWN_FIELD_${key}`);
  }
  for (const key of required) {
    if (!Object.hasOwn(value, key)) throw new Error(`${label}_MISSING_${key}`);
  }
  return value;
}
function stringValue(value, label) {
  if (typeof value !== "string" || value.length === 0 || value.length > 256) {
    throw new Error(`${label}_INVALID_STRING`);
  }
  return value;
}
function nullableStringValue(value, label) {
  if (value === null) return null;
  return stringValue(value, label);
}
function timeValue(value, label) {
  const time = stringValue(value, label);
  if (Number.isNaN(Date.parse(time))) throw new Error(`${label}_INVALID_TIME`);
  return time;
}
function parseResolveInput(value) {
  const object = assertClosedObject(
    value,
    [
      "agentId",
      "action",
      "resourceId",
      "requestId",
      "parametersDigest",
      "evaluationTime"
    ],
    ["agentId", "action", "resourceId"],
    "VAGP_MCP_RESOLVE_INPUT"
  );
  return Object.freeze({
    agentId: stringValue(object["agentId"], "agentId"),
    action: stringValue(object["action"], "action"),
    resourceId: stringValue(object["resourceId"], "resourceId"),
    ...object["requestId"] === void 0 ? {} : { requestId: stringValue(object["requestId"], "requestId") },
    ...object["parametersDigest"] === void 0 ? {} : {
      parametersDigest: nullableStringValue(
        object["parametersDigest"],
        "parametersDigest"
      )
    },
    ...object["evaluationTime"] === void 0 ? {} : {
      evaluationTime: timeValue(object["evaluationTime"], "evaluationTime")
    }
  });
}
function parseExplainInput(value) {
  const object = assertClosedObject(
    value,
    ["decision", "permit"],
    [],
    "VAGP_MCP_EXPLAIN_INPUT"
  );
  return Object.freeze({
    ...object["decision"] === void 0 ? {} : { decision: object["decision"] },
    ...object["permit"] === void 0 ? {} : { permit: object["permit"] }
  });
}
function parseGetAuthorityInput(value) {
  const object = assertClosedObject(
    value,
    ["agentId", "action", "resourceId", "evaluationTime"],
    ["agentId"],
    "VAGP_MCP_GET_AUTHORITY_INPUT"
  );
  return Object.freeze({
    agentId: stringValue(object["agentId"], "agentId"),
    ...object["action"] === void 0 ? {} : { action: stringValue(object["action"], "action") },
    ...object["resourceId"] === void 0 ? {} : { resourceId: stringValue(object["resourceId"], "resourceId") },
    ...object["evaluationTime"] === void 0 ? {} : {
      evaluationTime: timeValue(object["evaluationTime"], "evaluationTime")
    }
  });
}
function parseGetMandateInput(value) {
  const object = assertClosedObject(
    value,
    ["mandateId", "agentId"],
    [],
    "VAGP_MCP_GET_MANDATE_INPUT"
  );
  return Object.freeze({
    ...object["mandateId"] === void 0 ? {} : { mandateId: stringValue(object["mandateId"], "mandateId") },
    ...object["agentId"] === void 0 ? {} : { agentId: stringValue(object["agentId"], "agentId") }
  });
}
function parseGetAgentDnaInput(value) {
  const object = assertClosedObject(
    value,
    ["agentId"],
    ["agentId"],
    "VAGP_MCP_GET_AGENT_DNA_INPUT"
  );
  return Object.freeze({ agentId: stringValue(object["agentId"], "agentId") });
}
function parseVerifyPermitInput(value) {
  const object = assertClosedObject(
    value,
    ["permit", "evaluationTime", "idempotencyKey"],
    ["permit"],
    "VAGP_MCP_VERIFY_PERMIT_INPUT"
  );
  if (!isPlainObject(object["permit"]))
    throw new Error("permit_MUST_BE_OBJECT");
  return Object.freeze({
    permit: object["permit"],
    ...object["evaluationTime"] === void 0 ? {} : {
      evaluationTime: timeValue(object["evaluationTime"], "evaluationTime")
    },
    ...object["idempotencyKey"] === void 0 ? {} : {
      idempotencyKey: stringValue(
        object["idempotencyKey"],
        "idempotencyKey"
      )
    }
  });
}

// src/mcp.ts
var SERVER_INFO = Object.freeze({
  name: "verimand-mcp-authority-server",
  version: "0.1.0"
});
var MCP_AUTHORITY_INSTRUCTIONS = "MCP exposes capability. VAGP governs authority. This server resolves and explains authority but never executes protected business actions.";
var shortString = z.string().min(1).max(256);
var optionalDateTime = z.iso.datetime().optional();
var nullableString = z.union([shortString, z.null()]).optional();
var openJsonObject = z.record(z.string(), z.unknown());
var resolveSchema = z.object({
  agentId: shortString,
  action: shortString,
  resourceId: shortString,
  requestId: shortString.optional(),
  parametersDigest: nullableString,
  evaluationTime: optionalDateTime
}).strict();
var explainSchema = z.object({
  decision: openJsonObject.optional(),
  permit: openJsonObject.optional()
}).strict();
var getAuthoritySchema = z.object({
  agentId: shortString,
  action: shortString.optional(),
  resourceId: shortString.optional(),
  evaluationTime: optionalDateTime
}).strict();
var getMandateSchema = z.object({
  mandateId: shortString.optional(),
  agentId: shortString.optional()
}).strict();
var getAgentDnaSchema = z.object({ agentId: shortString }).strict();
var verifyPermitSchema = z.object({
  permit: openJsonObject,
  evaluationTime: optionalDateTime,
  idempotencyKey: shortString.optional()
}).strict();
function toolResult(structuredContent) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(structuredContent, null, 2)
      }
    ],
    structuredContent
  };
}
function toolError(error4) {
  const reason = error4 instanceof Error ? error4.message : "VAGP_MCP_INPUT_REJECTED";
  const structuredContent = { ok: false, reason };
  return {
    isError: true,
    content: [{ type: "text", text: reason }],
    structuredContent
  };
}
function guarded(handler) {
  try {
    return toolResult(handler());
  } catch (error4) {
    return toolError(error4);
  }
}
function createMcpServer(service2) {
  const server = new McpServer(
    SERVER_INFO,
    Object.freeze({
      capabilities: Object.freeze({ tools: Object.freeze({}) }),
      instructions: MCP_AUTHORITY_INSTRUCTIONS
    })
  );
  server.registerTool(
    "verimand.resolve",
    Object.freeze({
      title: "Resolve VAGP authority",
      description: "Determine whether a trusted registered agent is currently authorized for a specific action. Calling this tool does not execute the protected action.",
      inputSchema: resolveSchema,
      annotations: Object.freeze({
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: false
      })
    }),
    (input) => guarded(() => service2.resolve(parseResolveInput(input)))
  );
  server.registerTool(
    "verimand.explain",
    Object.freeze({
      title: "Explain VAGP decision",
      description: "Explain a deterministic VAGP authority decision or permit. Informational only; it cannot create or modify authority.",
      inputSchema: explainSchema,
      annotations: Object.freeze({
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false
      })
    }),
    (input) => guarded(() => service2.explain(parseExplainInput(input)))
  );
  server.registerTool(
    "verimand.get_authority",
    Object.freeze({
      title: "Get bounded authority",
      description: "Return current bounded authority relevant to a trusted registered agent/action. Read-only.",
      inputSchema: getAuthoritySchema,
      annotations: Object.freeze({
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false
      })
    }),
    (input) => guarded(() => service2.getAuthority(parseGetAuthorityInput(input)))
  );
  server.registerTool(
    "verimand.get_mandate",
    Object.freeze({
      title: "Get mandate",
      description: "Retrieve server-side trusted mandate information. Read-only.",
      inputSchema: getMandateSchema,
      annotations: Object.freeze({
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false
      })
    }),
    (input) => guarded(() => service2.getMandate(parseGetMandateInput(input)))
  );
  server.registerTool(
    "verimand.get_agent_dna",
    Object.freeze({
      title: "Get trusted Agent DNA",
      description: "Return trusted Agent DNA state and fingerprint information from server-side trusted state. Read-only.",
      inputSchema: getAgentDnaSchema,
      annotations: Object.freeze({
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false
      })
    }),
    (input) => guarded(() => service2.getAgentDna(parseGetAgentDnaInput(input)))
  );
  server.registerTool(
    "verimand.verify_permit",
    Object.freeze({
      title: "Verify VAGP execution permit",
      description: "Verify an existing VAGP execution permit against current authority evidence. Does not execute protected actions.",
      inputSchema: verifyPermitSchema,
      annotations: Object.freeze({
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: false
      })
    }),
    (input) => guarded(() => service2.verifyPermit(parseVerifyPermitInput(input)))
  );
  return server;
}

// src/service.ts
import { randomUUID } from "node:crypto";

// ../../packages/protocol/dist/index.js
var VAGP_MAX_DELEGATION_DEPTH = 32;

// ../../packages/mandates/dist/timestamp.js
var CANONICAL_TIMESTAMP = /^([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])\.([0-9]{3})Z$/;
function parseCanonicalTimestamp(value) {
  if (typeof value !== "string") {
    return { valid: false, message: "Timestamp must be a string" };
  }
  const match = CANONICAL_TIMESTAMP.exec(value);
  if (match === null) {
    return {
      valid: false,
      message: "Timestamp must use YYYY-MM-DDTHH:mm:ss.SSSZ in UTC"
    };
  }
  const components2 = match.slice(1).map(Number);
  const [year, month, day, hour, minute, second, millisecond] = components2;
  if (year === void 0 || month === void 0 || day === void 0 || hour === void 0 || minute === void 0 || second === void 0 || millisecond === void 0) {
    return { valid: false, message: "Timestamp components are incomplete" };
  }
  const date = /* @__PURE__ */ new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(hour, minute, second, millisecond);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day || date.getUTCHours() !== hour || date.getUTCMinutes() !== minute || date.getUTCSeconds() !== second || date.getUTCMilliseconds() !== millisecond) {
    return {
      valid: false,
      message: "Timestamp contains an invalid calendar date or time"
    };
  }
  return { valid: true, epochMilliseconds: date.getTime() };
}

// ../../packages/mandates/dist/index.js
var MANDATE_V03_SIGNATURE_DOMAIN_SEPARATOR = "VAGP/0.3/MANDATE/1";
var admittedMandatesV03 = /* @__PURE__ */ new WeakSet();
function canonicalProofJson(value, seen, depth) {
  if (value === null)
    return "null";
  if (typeof value === "string" || typeof value === "boolean") {
    return JSON.stringify(value);
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value))
      throw new Error("unsafe number");
    return JSON.stringify(Object.is(value, -0) ? 0 : value);
  }
  if (typeof value !== "object" || seen.has(value) || depth > 32) {
    throw new Error("unsafe mandate value");
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null && !Array.isArray(value)) {
    throw new Error("unsafe mandate prototype");
  }
  seen.add(value);
  try {
    if (Array.isArray(value)) {
      const keys2 = Reflect.ownKeys(value);
      if (keys2.some((key) => key !== "length" && (typeof key !== "string" || !/^(0|[1-9][0-9]*)$/u.test(key))) || keys2.filter((key) => key !== "length").length !== value.length) {
        throw new Error("unsafe mandate array");
      }
      return `[${value.map((entry) => canonicalProofJson(entry, seen, depth + 1)).join(",")}]`;
    }
    const entries = [];
    const keys = Reflect.ownKeys(value);
    if (keys.some((key) => typeof key !== "string")) {
      throw new Error("unsafe mandate key");
    }
    for (const key of keys.toSorted()) {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (descriptor === void 0 || !descriptor.enumerable || !Object.hasOwn(descriptor, "value") || descriptor.value === void 0) {
        throw new Error("unsafe mandate property");
      }
      entries.push(`${JSON.stringify(key)}:${canonicalProofJson(descriptor.value, seen, depth + 1)}`);
    }
    return `{${entries.join(",")}}`;
  } finally {
    seen.delete(value);
  }
}
function deepFreezeClone(value) {
  const clone = structuredClone(value);
  const freeze = (candidate) => {
    if (candidate === null || typeof candidate !== "object")
      return;
    for (const child of Object.values(candidate))
      freeze(child);
    Object.freeze(candidate);
  };
  freeze(clone);
  return clone;
}
function canonicalizeMandateV03ForProof(mandate2) {
  if (mandate2.vagp !== "0.3") {
    throw new Error("VAGP_MANDATE_VERSION_UNSUPPORTED");
  }
  const descriptor = Object.getOwnPropertyDescriptor(mandate2, "proof");
  if (descriptor === void 0 || !descriptor.enumerable || !Object.hasOwn(descriptor, "value")) {
    throw new Error("VAGP_MANDATE_PROOF_INVALID");
  }
  const unsigned = {};
  for (const key of Reflect.ownKeys(mandate2)) {
    if (typeof key !== "string")
      throw new Error("VAGP_MANDATE_PROOF_INVALID");
    const property = Object.getOwnPropertyDescriptor(mandate2, key);
    if (property === void 0 || !property.enumerable || !Object.hasOwn(property, "value") || property.value === void 0) {
      throw new Error("VAGP_MANDATE_PROOF_INVALID");
    }
    if (key !== "proof")
      unsigned[key] = property.value;
  }
  return new TextEncoder().encode(canonicalProofJson([MANDATE_V03_SIGNATURE_DOMAIN_SEPARATOR, unsigned], /* @__PURE__ */ new WeakSet(), 0));
}
async function admitMandateV03(mandate2, verifier) {
  try {
    if (mandate2.vagp !== "0.3" || mandate2.proof.length !== 1) {
      return Object.freeze({
        ok: false,
        error: Object.freeze({
          code: "VAGP_MANDATE_PROOF_INVALID",
          message: "VAGP 0.3 mandate admission requires exactly one proof"
        })
      });
    }
    const semantics = validateMandateSemantics(mandate2);
    if (!semantics.valid) {
      return Object.freeze({
        ok: false,
        error: Object.freeze({
          code: "VAGP_MANDATE_SEMANTICS_INVALID",
          message: "VAGP 0.3 mandate semantics are invalid"
        })
      });
    }
    const frozen = deepFreezeClone(mandate2);
    const verified2 = await verifier.verify(frozen, canonicalizeMandateV03ForProof(frozen));
    if (!verified2) {
      return Object.freeze({
        ok: false,
        error: Object.freeze({
          code: "VAGP_MANDATE_PROOF_INVALID",
          message: "VAGP 0.3 mandate proof is not valid under trust policy"
        })
      });
    }
    admittedMandatesV03.add(frozen);
    return Object.freeze({ ok: true, value: frozen });
  } catch {
    return Object.freeze({
      ok: false,
      error: Object.freeze({
        code: "VAGP_MANDATE_PROOF_INVALID",
        message: "VAGP 0.3 mandate could not be admitted safely"
      })
    });
  }
}
function isAdmittedMandateV03(value) {
  return value !== null && typeof value === "object" && admittedMandatesV03.has(value);
}
function validateAuthoritySemantics(authority, validity) {
  const errors = [];
  const notBefore = parseCanonicalTimestamp(validity.notBefore);
  const notAfter = parseCanonicalTimestamp(validity.notAfter);
  if (!notBefore.valid) {
    errors.push({
      code: "VAGP_SEMANTIC_INVALID_TIMESTAMP",
      path: "/validity/notBefore",
      message: notBefore.message
    });
  }
  if (!notAfter.valid) {
    errors.push({
      code: "VAGP_SEMANTIC_INVALID_TIMESTAMP",
      path: "/validity/notAfter",
      message: notAfter.message
    });
  }
  if (notBefore.valid && notAfter.valid && notBefore.epochMilliseconds > notAfter.epochMilliseconds) {
    errors.push({
      code: "VAGP_SEMANTIC_VALIDITY_ORDER",
      path: "/validity",
      message: "notBefore must not be later than notAfter"
    });
  }
  for (const [name, constraint] of Object.entries(authority.constraints)) {
    if (constraint.type === "numericRange" && constraint.min !== null && constraint.max !== null && constraint.min > constraint.max) {
      errors.push({
        code: "VAGP_SEMANTIC_NUMERIC_RANGE_ORDER",
        path: `/authority/constraints/${name}`,
        message: "A numeric range minimum must not exceed its maximum"
      });
    }
  }
  if (!Number.isSafeInteger(authority.delegation.remainingDepth) || Object.is(authority.delegation.remainingDepth, -0) || authority.delegation.remainingDepth < 0 || authority.delegation.remainingDepth > VAGP_MAX_DELEGATION_DEPTH) {
    errors.push({
      code: "VAGP_SEMANTIC_DELEGATION_DEPTH_INVALID",
      path: "/authority/delegation/remainingDepth",
      message: `remainingDepth must be an integer from 0 through ${String(VAGP_MAX_DELEGATION_DEPTH)}`
    });
  }
  if ("revocation" in authority) {
    const revocation = authority.revocation;
    const staleness = revocation !== null && typeof revocation === "object" && !Array.isArray(revocation) ? revocation["maxStatusStalenessMs"] : void 0;
    if (typeof staleness !== "number" || !Number.isSafeInteger(staleness) || Object.is(staleness, -0) || staleness < 0) {
      errors.push({
        code: "VAGP_SEMANTIC_REVOCATION_REQUIREMENT_INVALID",
        path: "/authority/revocation/maxStatusStalenessMs",
        message: "v0.2 revocation maxStatusStalenessMs must be a finite non-negative safe integer"
      });
    }
  }
  if ("financialApplicability" in authority) {
    const applicability = authority.financialApplicability;
    const requiredActions = applicability !== null && typeof applicability === "object" && !Array.isArray(applicability) ? applicability["requiredActions"] : void 0;
    if (!Array.isArray(requiredActions) || !requiredActions.every((pattern) => typeof pattern === "string")) {
      errors.push({
        code: "VAGP_SEMANTIC_FINANCIAL_APPLICABILITY_INVALID",
        path: "/authority/financialApplicability/requiredActions",
        message: "v0.2 financialApplicability.requiredActions must be an array of action patterns"
      });
    }
  }
  return { valid: errors.length === 0, errors };
}
function validateMandateSemantics(mandate2) {
  const result = validateAuthoritySemantics(mandate2.authority, mandate2.validity);
  if (mandate2.vagp !== "0.2" && mandate2.vagp !== "0.3") {
    return result;
  }
  const errors = [...result.errors];
  if (mandate2.statusRef === null || mandate2.statusRef.length === 0) {
    errors.push({
      code: "VAGP_SEMANTIC_STATUS_REF_REQUIRED",
      path: "/statusRef",
      message: "v0.2 and v0.3 Mandates require a non-null status channel reference"
    });
  }
  if (!("revocation" in mandate2.authority)) {
    errors.push({
      code: "VAGP_SEMANTIC_REVOCATION_REQUIREMENT_INVALID",
      path: "/authority/revocation",
      message: "v0.2 and v0.3 Mandates require issuer-declared revocation freshness semantics"
    });
  }
  if (!("financialApplicability" in mandate2.authority)) {
    errors.push({
      code: "VAGP_SEMANTIC_FINANCIAL_APPLICABILITY_INVALID",
      path: "/authority/financialApplicability",
      message: "v0.2 and v0.3 Mandates require issuer-declared financial applicability semantics"
    });
  }
  if (mandate2.vagp === "0.3") {
    if (!("agentState" in mandate2.authority)) {
      errors.push({
        code: "VAGP_SEMANTIC_AGENT_STATE_BINDING_INVALID",
        path: "/authority/agentState",
        message: "v0.3 Mandates require an explicit subject Agent DNA binding"
      });
    } else {
      const binding = mandate2.authority.agentState;
      if (binding.fingerprint.algorithm.length === 0 || binding.fingerprint.value.length === 0 || !Number.isSafeInteger(binding.stateRevision) || binding.stateRevision < 1 || !Number.isSafeInteger(binding.maxStateStalenessMs) || Object.is(binding.maxStateStalenessMs, -0) || binding.maxStateStalenessMs < 0) {
        errors.push({
          code: "VAGP_SEMANTIC_AGENT_STATE_BINDING_INVALID",
          path: "/authority/agentState",
          message: "v0.3 Agent state binding requires a supported fingerprint, positive revision and finite non-negative freshness ceiling"
        });
      }
    }
    if (!("capabilities" in mandate2.authority)) {
      errors.push({
        code: "VAGP_SEMANTIC_CAPABILITY_AUTHORITY_INVALID",
        path: "/authority/capabilities",
        message: "v0.3 Mandates require explicit capability authority"
      });
    } else {
      const keys = mandate2.authority.capabilities.map((capability) => JSON.stringify([capability.id, capability.version]));
      if (mandate2.authority.capabilities.some((capability) => capability.id.length === 0 || capability.version.length === 0) || new Set(keys).size !== keys.length) {
        errors.push({
          code: "VAGP_SEMANTIC_CAPABILITY_AUTHORITY_INVALID",
          path: "/authority/capabilities",
          message: "v0.3 capability authority must contain unique exact ID and version pairs"
        });
      }
    }
  }
  return { valid: errors.length === 0, errors };
}

// ../../packages/schemas/dist/index.js
var import__ = __toESM(require__(), 1);
var import_ajv_formats = __toESM(require_dist(), 1);

// ../../packages/schemas/dist/v0.1/action-request.schema.json
var action_request_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.verimand.com/vagp/0.1/action-request.schema.json",
  title: "VAGP 0.1 Action Request",
  type: "object",
  additionalProperties: false,
  required: [
    "vagp",
    "type",
    "id",
    "agent",
    "principalHint",
    "action",
    "resource",
    "parametersDigest",
    "requestedAt",
    "nonce"
  ],
  properties: {
    vagp: { const: "0.1" },
    type: { const: "action-request" },
    id: {
      $ref: "https://schemas.verimand.com/vagp/0.1/common.schema.json#/$defs/nonEmptyString"
    },
    agent: {
      $ref: "https://schemas.verimand.com/vagp/0.1/common.schema.json#/$defs/agentReference"
    },
    principalHint: {
      anyOf: [
        {
          $ref: "https://schemas.verimand.com/vagp/0.1/common.schema.json#/$defs/principalReference"
        },
        { type: "null" }
      ]
    },
    action: {
      $ref: "https://schemas.verimand.com/vagp/0.1/common.schema.json#/$defs/actionIdentifier"
    },
    resource: {
      $ref: "https://schemas.verimand.com/vagp/0.1/common.schema.json#/$defs/resourceReference"
    },
    parametersDigest: {
      anyOf: [
        {
          $ref: "https://schemas.verimand.com/vagp/0.1/common.schema.json#/$defs/nonEmptyString"
        },
        { type: "null" }
      ]
    },
    requestedAt: {
      $ref: "https://schemas.verimand.com/vagp/0.1/common.schema.json#/$defs/canonicalTimestamp"
    },
    nonce: {
      $ref: "https://schemas.verimand.com/vagp/0.1/common.schema.json#/$defs/nonEmptyString"
    }
  }
};

// ../../packages/schemas/dist/v0.1/authority-scope.schema.json
var authority_scope_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.verimand.com/vagp/0.1/authority-scope.schema.json",
  title: "VAGP 0.1 Authority Scope",
  type: "object",
  additionalProperties: false,
  required: ["authority", "validity"],
  properties: {
    authority: {
      $ref: "https://schemas.verimand.com/vagp/0.1/common.schema.json#/$defs/mandateAuthority"
    },
    validity: {
      $ref: "https://schemas.verimand.com/vagp/0.1/common.schema.json#/$defs/validity"
    }
  }
};

// ../../packages/schemas/dist/v0.1/common.schema.json
var common_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.verimand.com/vagp/0.1/common.schema.json",
  title: "VAGP 0.1 common definitions",
  $defs: {
    nonEmptyString: {
      type: "string",
      minLength: 1
    },
    canonicalTimestamp: {
      type: "string",
      format: "date-time",
      pattern: "^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]\\.[0-9]{3}Z$"
    },
    actionIdentifier: {
      type: "string",
      pattern: "^[a-z][a-z0-9-]*(\\.[a-z][a-z0-9-]*)*$"
    },
    actionPattern: {
      type: "string",
      pattern: "^[a-z][a-z0-9-]*(\\.[a-z][a-z0-9-]*)*(\\.\\*)?$"
    },
    principalReference: {
      type: "object",
      additionalProperties: false,
      required: ["id"],
      properties: {
        id: { $ref: "#/$defs/nonEmptyString" }
      }
    },
    agentReference: {
      type: "object",
      additionalProperties: false,
      required: ["id"],
      properties: {
        id: { $ref: "#/$defs/nonEmptyString" }
      }
    },
    resourceReference: {
      type: "object",
      additionalProperties: false,
      required: ["id"],
      properties: {
        id: { $ref: "#/$defs/nonEmptyString" }
      }
    },
    issuerReference: {
      anyOf: [
        { $ref: "#/$defs/principalReference" },
        { $ref: "#/$defs/agentReference" }
      ]
    },
    proof: {
      type: "object",
      additionalProperties: false,
      required: ["type", "alg", "kid", "created", "value"],
      properties: {
        type: { $ref: "#/$defs/nonEmptyString" },
        alg: { $ref: "#/$defs/nonEmptyString" },
        kid: { $ref: "#/$defs/nonEmptyString" },
        created: { $ref: "#/$defs/canonicalTimestamp" },
        value: { $ref: "#/$defs/nonEmptyString" }
      }
    },
    proofs: {
      type: "array",
      minItems: 1,
      items: { $ref: "#/$defs/proof" }
    },
    validity: {
      type: "object",
      additionalProperties: false,
      required: ["notBefore", "notAfter"],
      properties: {
        notBefore: { $ref: "#/$defs/canonicalTimestamp" },
        notAfter: { $ref: "#/$defs/canonicalTimestamp" }
      }
    },
    mandateResource: {
      type: "object",
      additionalProperties: false,
      required: ["match", "value"],
      properties: {
        match: {
          enum: ["exact", "prefix"]
        },
        value: { $ref: "#/$defs/nonEmptyString" }
      },
      allOf: [
        {
          if: {
            properties: { match: { const: "prefix" } },
            required: ["match"]
          },
          then: {
            properties: { value: { type: "string", pattern: ":$" } }
          }
        }
      ]
    },
    exactConstraint: {
      type: "object",
      additionalProperties: false,
      required: ["type", "value"],
      properties: {
        type: { const: "exact" },
        value: {
          type: ["string", "number", "boolean"]
        }
      }
    },
    enumConstraint: {
      type: "object",
      additionalProperties: false,
      required: ["type", "allowed"],
      properties: {
        type: { const: "enum" },
        allowed: {
          type: "array",
          minItems: 1,
          uniqueItems: true,
          items: {
            type: "string"
          }
        }
      }
    },
    numericRangeConstraint: {
      type: "object",
      additionalProperties: false,
      required: ["type", "min", "max"],
      properties: {
        type: { const: "numericRange" },
        min: {
          type: ["number", "null"]
        },
        max: {
          type: ["number", "null"]
        }
      },
      anyOf: [
        {
          properties: {
            min: { type: "number" }
          }
        },
        {
          properties: {
            max: { type: "number" }
          }
        }
      ]
    },
    mandateConstraint: {
      oneOf: [
        { $ref: "#/$defs/exactConstraint" },
        { $ref: "#/$defs/enumConstraint" },
        { $ref: "#/$defs/numericRangeConstraint" }
      ]
    },
    namedConstraints: {
      type: "object",
      propertyNames: {
        allOf: [
          { pattern: "^[a-z][a-z0-9-]{0,63}$" },
          { not: { enum: ["constructor", "prototype"] } }
        ]
      },
      additionalProperties: {
        $ref: "#/$defs/mandateConstraint"
      }
    },
    financialLimits: {
      type: "object",
      additionalProperties: false,
      required: ["currency", "maxTransaction", "maxAggregate"],
      properties: {
        currency: {
          type: "string",
          pattern: "^[A-Z]{3}$"
        },
        maxTransaction: {
          type: ["number", "null"],
          minimum: 0
        },
        maxAggregate: {
          type: ["number", "null"],
          minimum: 0
        }
      },
      anyOf: [
        {
          properties: {
            maxTransaction: { type: "number" }
          }
        },
        {
          properties: {
            maxAggregate: { type: "number" }
          }
        }
      ]
    },
    autonomyRequirement: {
      type: "object",
      additionalProperties: false,
      required: ["mode"],
      properties: {
        mode: {
          enum: [
            "PROHIBITED",
            "HUMAN_CONTROLLED",
            "BOUNDED_AUTONOMOUS",
            "AUTONOMOUS"
          ]
        }
      }
    },
    assuranceRequirement: {
      type: "object",
      additionalProperties: false,
      required: ["minimum"],
      properties: {
        minimum: {
          enum: ["A1", "A2", "A3", "A4", "A5"]
        }
      }
    },
    delegationLimits: {
      type: "object",
      additionalProperties: false,
      required: ["allowed", "remainingDepth"],
      properties: {
        allowed: { type: "boolean" },
        remainingDepth: {
          type: "integer",
          minimum: 0,
          maximum: 32
        }
      }
    },
    mandateAuthority: {
      type: "object",
      additionalProperties: false,
      required: [
        "actions",
        "resources",
        "constraints",
        "financial",
        "autonomy",
        "assurance",
        "delegation"
      ],
      properties: {
        actions: {
          type: "array",
          minItems: 1,
          uniqueItems: true,
          items: { $ref: "#/$defs/actionPattern" }
        },
        resources: {
          type: "array",
          minItems: 1,
          uniqueItems: true,
          items: { $ref: "#/$defs/mandateResource" }
        },
        constraints: { $ref: "#/$defs/namedConstraints" },
        financial: {
          anyOf: [{ $ref: "#/$defs/financialLimits" }, { type: "null" }]
        },
        autonomy: { $ref: "#/$defs/autonomyRequirement" },
        assurance: { $ref: "#/$defs/assuranceRequirement" },
        delegation: { $ref: "#/$defs/delegationLimits" }
      }
    },
    mandateLifecycleState: {
      enum: ["ACTIVE", "SUSPENDED", "REVOKED"]
    }
  }
};

// ../../packages/schemas/dist/v0.1/mandate.schema.json
var mandate_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.verimand.com/vagp/0.1/mandate.schema.json",
  title: "VAGP 0.1 Mandate",
  type: "object",
  additionalProperties: false,
  required: [
    "vagp",
    "type",
    "id",
    "issuer",
    "subject",
    "parentMandate",
    "authority",
    "validity",
    "statusRef",
    "proof"
  ],
  properties: {
    vagp: { const: "0.1" },
    type: { const: "mandate" },
    id: {
      $ref: "https://schemas.verimand.com/vagp/0.1/common.schema.json#/$defs/nonEmptyString"
    },
    issuer: {
      $ref: "https://schemas.verimand.com/vagp/0.1/common.schema.json#/$defs/issuerReference"
    },
    subject: {
      $ref: "https://schemas.verimand.com/vagp/0.1/common.schema.json#/$defs/agentReference"
    },
    parentMandate: {
      anyOf: [
        {
          $ref: "https://schemas.verimand.com/vagp/0.1/common.schema.json#/$defs/nonEmptyString"
        },
        { type: "null" }
      ]
    },
    authority: {
      $ref: "https://schemas.verimand.com/vagp/0.1/common.schema.json#/$defs/mandateAuthority"
    },
    validity: {
      $ref: "https://schemas.verimand.com/vagp/0.1/common.schema.json#/$defs/validity"
    },
    statusRef: {
      anyOf: [
        {
          $ref: "https://schemas.verimand.com/vagp/0.1/common.schema.json#/$defs/nonEmptyString"
        },
        { type: "null" }
      ]
    },
    proof: {
      $ref: "https://schemas.verimand.com/vagp/0.1/common.schema.json#/$defs/proofs"
    }
  }
};

// ../../packages/schemas/dist/v0.1/revocation-event.schema.json
var revocation_event_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.verimand.com/vagp/0.1/revocation-event.schema.json",
  title: "VAGP 0.1 Revocation Event",
  type: "object",
  additionalProperties: false,
  required: [
    "vagp",
    "type",
    "id",
    "target",
    "transition",
    "effectiveAt",
    "sequence",
    "reasonCode",
    "issuer",
    "proof"
  ],
  properties: {
    vagp: { const: "0.1" },
    type: { const: "revocation-event" },
    id: {
      $ref: "https://schemas.verimand.com/vagp/0.1/common.schema.json#/$defs/nonEmptyString"
    },
    target: {
      type: "object",
      additionalProperties: false,
      required: ["mandate"],
      properties: {
        mandate: {
          $ref: "https://schemas.verimand.com/vagp/0.1/common.schema.json#/$defs/nonEmptyString"
        }
      }
    },
    transition: {
      type: "object",
      additionalProperties: false,
      required: ["from", "to"],
      properties: {
        from: {
          $ref: "https://schemas.verimand.com/vagp/0.1/common.schema.json#/$defs/mandateLifecycleState"
        },
        to: {
          $ref: "https://schemas.verimand.com/vagp/0.1/common.schema.json#/$defs/mandateLifecycleState"
        }
      }
    },
    effectiveAt: {
      $ref: "https://schemas.verimand.com/vagp/0.1/common.schema.json#/$defs/canonicalTimestamp"
    },
    sequence: {
      type: "integer",
      minimum: 0
    },
    reasonCode: {
      anyOf: [
        {
          $ref: "https://schemas.verimand.com/vagp/0.1/common.schema.json#/$defs/nonEmptyString"
        },
        { type: "null" }
      ]
    },
    issuer: {
      $ref: "https://schemas.verimand.com/vagp/0.1/common.schema.json#/$defs/issuerReference"
    },
    proof: {
      $ref: "https://schemas.verimand.com/vagp/0.1/common.schema.json#/$defs/proofs"
    }
  }
};

// ../../packages/schemas/dist/v0.2/action-request.schema.json
var action_request_schema_default2 = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.verimand.com/vagp/0.2/action-request.schema.json",
  title: "VAGP 0.2 Action Request",
  type: "object",
  additionalProperties: false,
  required: [
    "vagp",
    "type",
    "id",
    "agent",
    "principalHint",
    "action",
    "resource",
    "parametersDigest",
    "requestedAt",
    "nonce"
  ],
  properties: {
    vagp: { const: "0.2" },
    type: { const: "action-request" },
    id: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/nonEmptyString"
    },
    agent: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/agentReference"
    },
    principalHint: {
      anyOf: [
        {
          $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/principalReference"
        },
        { type: "null" }
      ]
    },
    action: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/actionPattern"
    },
    resource: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/resourceReference"
    },
    parametersDigest: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/parametersDigest"
    },
    requestedAt: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/canonicalTimestamp"
    },
    nonce: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/nonEmptyString"
    }
  }
};

// ../../packages/schemas/dist/v0.2/authority-witness.schema.json
var authority_witness_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.verimand.com/vagp/0.2/authority-witness.schema.json",
  title: "VAGP 0.2 Authority Witness",
  oneOf: [
    { $ref: "#/$defs/internalAuthorityWitness" },
    { $ref: "#/$defs/reducedAuthorityWitness" }
  ],
  $defs: {
    nonEmptyString: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/nonEmptyString"
    },
    canonicalTimestamp: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/canonicalTimestamp"
    },
    constraintScalar: {
      type: ["string", "number", "boolean"]
    },
    requestIdentity: {
      type: "object",
      additionalProperties: false,
      required: ["agentId", "requestId"],
      properties: {
        agentId: { $ref: "#/$defs/nonEmptyString" },
        requestId: { $ref: "#/$defs/nonEmptyString" }
      }
    },
    trustedExecutionContext: {
      type: "object",
      additionalProperties: false,
      required: ["autonomy", "assurance", "relevantAttributes"],
      properties: {
        autonomy: {
          enum: [
            "PROHIBITED",
            "HUMAN_CONTROLLED",
            "BOUNDED_AUTONOMOUS",
            "AUTONOMOUS"
          ]
        },
        assurance: { enum: ["A1", "A2", "A3", "A4", "A5"] },
        relevantAttributes: {
          type: "object",
          propertyNames: {
            allOf: [
              { pattern: "^[a-z][a-z0-9-]{0,63}$" },
              { not: { enum: ["constructor", "prototype"] } }
            ]
          },
          additionalProperties: { $ref: "#/$defs/constraintScalar" }
        }
      }
    },
    requestProjection: {
      type: "object",
      additionalProperties: false,
      required: ["action", "resourceId", "parametersDigest"],
      properties: {
        action: { type: ["string", "null"] },
        resourceId: { type: ["string", "null"] },
        parametersDigest: { type: ["string", "null"] }
      }
    },
    dimensionEvidence: {
      type: "object",
      additionalProperties: false,
      required: [
        "dimension",
        "evaluated",
        "satisfied",
        "sourceMandateIds",
        "effectiveValue",
        "authoritativeInput",
        "reasonCodes"
      ],
      properties: {
        dimension: {
          enum: [
            "SUBJECT",
            "ACTION",
            "RESOURCE",
            "CONSTRAINTS",
            "AUTONOMY",
            "ASSURANCE",
            "ATTRIBUTES",
            "FINANCIAL",
            "DELEGATION",
            "VALIDITY",
            "LIFECYCLE",
            "FRESHNESS",
            "RESERVATION"
          ]
        },
        evaluated: { type: "boolean" },
        satisfied: { type: "boolean" },
        sourceMandateIds: {
          type: "array",
          items: { $ref: "#/$defs/nonEmptyString" }
        },
        effectiveValue: {
          anyOf: [
            { $ref: "#/$defs/constraintScalar" },
            {
              type: "array",
              items: { $ref: "#/$defs/nonEmptyString" }
            },
            { type: "null" }
          ]
        },
        authoritativeInput: {
          anyOf: [
            { $ref: "#/$defs/constraintScalar" },
            {
              type: "array",
              items: { $ref: "#/$defs/nonEmptyString" }
            },
            { type: "null" }
          ]
        },
        reasonCodes: {
          type: "array",
          items: { $ref: "#/$defs/nonEmptyString" }
        }
      }
    },
    constraintEvidence: {
      type: "object",
      additionalProperties: false,
      required: [
        "mandateId",
        "name",
        "constraintType",
        "requiredValue",
        "actualValue",
        "satisfied",
        "reasonCodes"
      ],
      properties: {
        mandateId: { $ref: "#/$defs/nonEmptyString" },
        name: { $ref: "#/$defs/nonEmptyString" },
        constraintType: { enum: ["exact", "enum", "numericRange"] },
        requiredValue: {
          anyOf: [
            { $ref: "#/$defs/constraintScalar" },
            {
              type: "array",
              items: { $ref: "#/$defs/nonEmptyString" }
            },
            {
              type: "object",
              additionalProperties: false,
              required: ["min", "max"],
              properties: {
                min: { type: ["number", "null"] },
                max: { type: ["number", "null"] }
              }
            }
          ]
        },
        actualValue: {
          anyOf: [{ $ref: "#/$defs/constraintScalar" }, { type: "null" }]
        },
        satisfied: { type: "boolean" },
        reasonCodes: {
          type: "array",
          items: { $ref: "#/$defs/nonEmptyString" }
        }
      }
    },
    stageOutcome: {
      type: "object",
      additionalProperties: false,
      required: ["outcome", "reasonCodes"],
      properties: {
        outcome: { enum: ["NOT_REACHED", "FAILED", "SUCCEEDED"] },
        reasonCodes: {
          type: "array",
          items: { $ref: "#/$defs/nonEmptyString" }
        }
      }
    },
    verification: {
      type: "object",
      additionalProperties: false,
      required: ["verificationId", "outcome", "reasonCodes", "verifiedAt"],
      properties: {
        verificationId: { type: ["string", "null"] },
        outcome: { enum: ["NOT_REACHED", "REJECTED", "VERIFIED"] },
        reasonCodes: {
          type: "array",
          items: { $ref: "#/$defs/nonEmptyString" }
        },
        verifiedAt: {
          anyOf: [
            { $ref: "#/$defs/canonicalTimestamp" },
            { type: "null" }
          ]
        }
      }
    },
    execution: {
      type: "object",
      additionalProperties: false,
      required: ["correlationId", "outcome", "providerEvidenceRefs"],
      properties: {
        correlationId: { $ref: "#/$defs/nonEmptyString" },
        outcome: {
          enum: [
            "EXECUTION_NOT_SUBMITTED",
            "EXECUTION_SUBMITTED",
            "SUCCEEDED",
            "FAILED",
            "OUTCOME_UNKNOWN"
          ]
        },
        providerEvidenceRefs: {
          type: "array",
          items: { $ref: "#/$defs/nonEmptyString" }
        }
      }
    },
    internalAuthorityWitness: {
      type: "object",
      additionalProperties: false,
      required: [
        "vagp",
        "type",
        "artifactMode",
        "witnessForm",
        "witnessId",
        "requestIdentity",
        "requestCorrelationId",
        "authenticatedAgentRef",
        "originatingPrincipalId",
        "subjectAgentId",
        "request",
        "selectedPath",
        "trustedContext",
        "dimensionEvidence",
        "constraintEvidence",
        "currentAuthority",
        "financial",
        "canonicalPathSelection",
        "bind",
        "derive",
        "verification",
        "execution"
      ],
      properties: {
        vagp: { const: "0.2" },
        type: { const: "authority-witness" },
        artifactMode: { const: "UNSIGNED_REFERENCE" },
        witnessForm: { const: "INTERNAL" },
        witnessId: { $ref: "#/$defs/nonEmptyString" },
        requestIdentity: { $ref: "#/$defs/requestIdentity" },
        requestCorrelationId: { $ref: "#/$defs/nonEmptyString" },
        authenticatedAgentRef: { $ref: "#/$defs/nonEmptyString" },
        originatingPrincipalId: { $ref: "#/$defs/nonEmptyString" },
        subjectAgentId: { $ref: "#/$defs/nonEmptyString" },
        request: { $ref: "#/$defs/requestProjection" },
        selectedPath: { type: "object" },
        trustedContext: { $ref: "#/$defs/trustedExecutionContext" },
        dimensionEvidence: {
          type: "array",
          items: { $ref: "#/$defs/dimensionEvidence" }
        },
        constraintEvidence: {
          type: "array",
          items: { $ref: "#/$defs/constraintEvidence" }
        },
        currentAuthority: { type: "object" },
        financial: { type: "object" },
        canonicalPathSelection: { type: "object" },
        bind: { $ref: "#/$defs/stageOutcome" },
        derive: { $ref: "#/$defs/stageOutcome" },
        verification: { $ref: "#/$defs/verification" },
        execution: { $ref: "#/$defs/execution" }
      }
    },
    reducedAuthorityWitness: {
      type: "object",
      additionalProperties: false,
      required: [
        "vagp",
        "type",
        "artifactMode",
        "witnessForm",
        "witnessId",
        "requestIdentity",
        "requestCorrelationId",
        "authenticatedAgentRef",
        "request",
        "resolution",
        "pathFailures",
        "dimensionEvidence",
        "bind",
        "derive",
        "verification",
        "execution"
      ],
      properties: {
        vagp: { const: "0.2" },
        type: { const: "authority-witness" },
        artifactMode: { const: "UNSIGNED_REFERENCE" },
        witnessForm: { const: "REDUCED" },
        witnessId: { $ref: "#/$defs/nonEmptyString" },
        requestIdentity: {
          anyOf: [{ $ref: "#/$defs/requestIdentity" }, { type: "null" }]
        },
        requestCorrelationId: { $ref: "#/$defs/nonEmptyString" },
        authenticatedAgentRef: { type: ["string", "null"] },
        request: { $ref: "#/$defs/requestProjection" },
        resolution: { type: "object" },
        pathFailures: { type: "array" },
        dimensionEvidence: {
          type: "array",
          items: { $ref: "#/$defs/dimensionEvidence" }
        },
        bind: { $ref: "#/$defs/stageOutcome" },
        derive: { $ref: "#/$defs/stageOutcome" },
        verification: { $ref: "#/$defs/verification" },
        execution: { $ref: "#/$defs/execution" }
      }
    }
  }
};

// ../../packages/schemas/dist/v0.2/authority-scope.schema.json
var authority_scope_schema_default2 = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.verimand.com/vagp/0.2/authority-scope.schema.json",
  title: "VAGP 0.2 Authority Scope",
  type: "object",
  additionalProperties: false,
  required: ["authority", "validity"],
  properties: {
    authority: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/mandateAuthority"
    },
    validity: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/validity"
    }
  }
};

// ../../packages/schemas/dist/v0.2/common.schema.json
var common_schema_default2 = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.verimand.com/vagp/0.2/common.schema.json",
  title: "VAGP 0.2 common definitions",
  $defs: {
    nonEmptyString: {
      type: "string",
      minLength: 1
    },
    canonicalTimestamp: {
      type: "string",
      format: "date-time",
      pattern: "^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]\\.[0-9]{3}Z$"
    },
    actionPattern: {
      type: "string",
      pattern: "^[a-z][a-z0-9-]*(\\.[a-z][a-z0-9-]*)*(\\.\\*)?$"
    },
    principalReference: {
      type: "object",
      additionalProperties: false,
      required: ["id"],
      properties: {
        id: { $ref: "#/$defs/nonEmptyString" }
      }
    },
    agentReference: {
      type: "object",
      additionalProperties: false,
      required: ["id"],
      properties: {
        id: { $ref: "#/$defs/nonEmptyString" }
      }
    },
    resourceReference: {
      type: "object",
      additionalProperties: false,
      required: ["id"],
      properties: {
        id: { $ref: "#/$defs/nonEmptyString" }
      }
    },
    issuerReference: {
      anyOf: [
        { $ref: "#/$defs/principalReference" },
        { $ref: "#/$defs/agentReference" }
      ]
    },
    proof: {
      type: "object",
      additionalProperties: false,
      required: ["type", "alg", "kid", "created", "value"],
      properties: {
        type: { $ref: "#/$defs/nonEmptyString" },
        alg: { $ref: "#/$defs/nonEmptyString" },
        kid: { $ref: "#/$defs/nonEmptyString" },
        created: { $ref: "#/$defs/canonicalTimestamp" },
        value: { $ref: "#/$defs/nonEmptyString" }
      }
    },
    proofs: {
      type: "array",
      minItems: 1,
      items: { $ref: "#/$defs/proof" }
    },
    validity: {
      type: "object",
      additionalProperties: false,
      required: ["notBefore", "notAfter"],
      properties: {
        notBefore: { $ref: "#/$defs/canonicalTimestamp" },
        notAfter: { $ref: "#/$defs/canonicalTimestamp" }
      }
    },
    mandateResource: {
      type: "object",
      additionalProperties: false,
      required: ["match", "value"],
      properties: {
        match: {
          enum: ["exact", "prefix"]
        },
        value: { $ref: "#/$defs/nonEmptyString" }
      },
      allOf: [
        {
          if: {
            properties: { match: { const: "prefix" } },
            required: ["match"]
          },
          then: {
            properties: { value: { type: "string", pattern: ":$" } }
          }
        }
      ]
    },
    exactConstraint: {
      type: "object",
      additionalProperties: false,
      required: ["type", "value"],
      properties: {
        type: { const: "exact" },
        value: {
          type: ["string", "number", "boolean"]
        }
      }
    },
    enumConstraint: {
      type: "object",
      additionalProperties: false,
      required: ["type", "allowed"],
      properties: {
        type: { const: "enum" },
        allowed: {
          type: "array",
          minItems: 1,
          uniqueItems: true,
          items: {
            type: "string"
          }
        }
      }
    },
    numericRangeConstraint: {
      type: "object",
      additionalProperties: false,
      required: ["type", "min", "max"],
      properties: {
        type: { const: "numericRange" },
        min: {
          type: ["number", "null"]
        },
        max: {
          type: ["number", "null"]
        }
      },
      anyOf: [
        {
          properties: {
            min: { type: "number" }
          }
        },
        {
          properties: {
            max: { type: "number" }
          }
        }
      ]
    },
    mandateConstraint: {
      oneOf: [
        { $ref: "#/$defs/exactConstraint" },
        { $ref: "#/$defs/enumConstraint" },
        { $ref: "#/$defs/numericRangeConstraint" }
      ]
    },
    namedConstraints: {
      type: "object",
      propertyNames: {
        allOf: [
          { pattern: "^[a-z][a-z0-9-]{0,63}$" },
          { not: { enum: ["constructor", "prototype"] } }
        ]
      },
      additionalProperties: {
        $ref: "#/$defs/mandateConstraint"
      }
    },
    financialLimits: {
      type: "object",
      additionalProperties: false,
      required: ["currency", "maxTransaction", "maxAggregate"],
      properties: {
        currency: {
          type: "string",
          pattern: "^[A-Z]{3}$"
        },
        maxTransaction: {
          type: ["number", "null"],
          minimum: 0
        },
        maxAggregate: {
          type: ["number", "null"],
          minimum: 0
        }
      },
      anyOf: [
        {
          properties: {
            maxTransaction: { type: "number" }
          }
        },
        {
          properties: {
            maxAggregate: { type: "number" }
          }
        }
      ]
    },
    autonomyRequirement: {
      type: "object",
      additionalProperties: false,
      required: ["mode"],
      properties: {
        mode: {
          enum: [
            "PROHIBITED",
            "HUMAN_CONTROLLED",
            "BOUNDED_AUTONOMOUS",
            "AUTONOMOUS"
          ]
        }
      }
    },
    assuranceRequirement: {
      type: "object",
      additionalProperties: false,
      required: ["minimum"],
      properties: {
        minimum: {
          enum: ["A1", "A2", "A3", "A4", "A5"]
        }
      }
    },
    delegationLimits: {
      type: "object",
      additionalProperties: false,
      required: ["allowed", "remainingDepth"],
      properties: {
        allowed: { type: "boolean" },
        remainingDepth: {
          type: "integer",
          minimum: 0,
          maximum: 32
        }
      }
    },
    revocationRequirement: {
      type: "object",
      additionalProperties: false,
      required: ["maxStatusStalenessMs"],
      properties: {
        maxStatusStalenessMs: {
          type: "integer",
          minimum: 0,
          maximum: 9007199254740991
        }
      }
    },
    financialApplicabilityRequirement: {
      type: "object",
      additionalProperties: false,
      required: ["requiredActions"],
      properties: {
        requiredActions: {
          type: "array",
          uniqueItems: true,
          items: { $ref: "#/$defs/actionPattern" }
        }
      }
    },
    mandateAuthority: {
      type: "object",
      additionalProperties: false,
      required: [
        "actions",
        "resources",
        "constraints",
        "financial",
        "autonomy",
        "assurance",
        "delegation",
        "revocation",
        "financialApplicability"
      ],
      properties: {
        actions: {
          type: "array",
          minItems: 1,
          uniqueItems: true,
          items: { $ref: "#/$defs/actionPattern" }
        },
        resources: {
          type: "array",
          minItems: 1,
          uniqueItems: true,
          items: { $ref: "#/$defs/mandateResource" }
        },
        constraints: { $ref: "#/$defs/namedConstraints" },
        financial: {
          anyOf: [{ $ref: "#/$defs/financialLimits" }, { type: "null" }]
        },
        autonomy: { $ref: "#/$defs/autonomyRequirement" },
        assurance: { $ref: "#/$defs/assuranceRequirement" },
        delegation: { $ref: "#/$defs/delegationLimits" },
        revocation: { $ref: "#/$defs/revocationRequirement" },
        financialApplicability: {
          $ref: "#/$defs/financialApplicabilityRequirement"
        }
      }
    },
    mandateLifecycleState: {
      enum: ["ACTIVE", "SUSPENDED", "REVOKED"]
    },
    requestIdentity: {
      type: "object",
      additionalProperties: false,
      required: ["agentId", "requestId"],
      properties: {
        agentId: { $ref: "#/$defs/nonEmptyString" },
        requestId: { $ref: "#/$defs/nonEmptyString" }
      }
    },
    parametersDigest: {
      type: ["string", "null"],
      minLength: 1
    },
    constraintScalar: {
      type: ["string", "number", "boolean"]
    },
    trustedExecutionContext: {
      type: "object",
      additionalProperties: false,
      required: ["autonomy", "assurance", "relevantAttributes"],
      properties: {
        autonomy: {
          enum: [
            "PROHIBITED",
            "HUMAN_CONTROLLED",
            "BOUNDED_AUTONOMOUS",
            "AUTONOMOUS"
          ]
        },
        assurance: {
          enum: ["A1", "A2", "A3", "A4", "A5"]
        },
        relevantAttributes: {
          type: "object",
          propertyNames: {
            allOf: [
              { pattern: "^[a-z][a-z0-9-]{0,63}$" },
              { not: { enum: ["constructor", "prototype"] } }
            ]
          },
          additionalProperties: { $ref: "#/$defs/constraintScalar" }
        }
      }
    },
    executionGrant: {
      type: "object",
      additionalProperties: false,
      required: [
        "vagp",
        "type",
        "artifactMode",
        "grantId",
        "requestIdentity",
        "parametersDigest",
        "subjectAgentId",
        "action",
        "resourceId",
        "trustedContext"
      ],
      properties: {
        vagp: { const: "0.2" },
        type: { const: "execution-grant" },
        artifactMode: { const: "UNSIGNED_REFERENCE" },
        grantId: { $ref: "#/$defs/nonEmptyString" },
        requestIdentity: { $ref: "#/$defs/requestIdentity" },
        parametersDigest: { $ref: "#/$defs/parametersDigest" },
        subjectAgentId: { $ref: "#/$defs/nonEmptyString" },
        action: { $ref: "#/$defs/actionPattern" },
        resourceId: { $ref: "#/$defs/nonEmptyString" },
        trustedContext: {
          $ref: "#/$defs/trustedExecutionContext"
        }
      }
    },
    executionAttempt: {
      type: "object",
      additionalProperties: false,
      required: [
        "vagp",
        "requestIdentity",
        "parametersDigest",
        "subjectAgentId",
        "action",
        "resourceId",
        "financial",
        "trustedContext"
      ],
      properties: {
        vagp: { const: "0.2" },
        requestIdentity: { $ref: "#/$defs/requestIdentity" },
        parametersDigest: { $ref: "#/$defs/parametersDigest" },
        subjectAgentId: { $ref: "#/$defs/nonEmptyString" },
        action: { $ref: "#/$defs/actionPattern" },
        resourceId: { $ref: "#/$defs/nonEmptyString" },
        financial: {
          anyOf: [
            {
              type: "object",
              additionalProperties: false,
              required: ["amount", "currency"],
              properties: {
                amount: { type: "number", exclusiveMinimum: 0 },
                currency: { type: "string", pattern: "^[A-Z]{3}$" }
              }
            },
            { type: "null" }
          ]
        },
        trustedContext: {
          $ref: "#/$defs/trustedExecutionContext"
        }
      }
    }
  }
};

// ../../packages/schemas/dist/v0.2/mandate.schema.json
var mandate_schema_default2 = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.verimand.com/vagp/0.2/mandate.schema.json",
  title: "VAGP 0.2 Mandate",
  type: "object",
  additionalProperties: false,
  required: [
    "vagp",
    "type",
    "id",
    "issuer",
    "subject",
    "parentMandate",
    "authority",
    "validity",
    "statusRef",
    "proof"
  ],
  properties: {
    vagp: { const: "0.2" },
    type: { const: "mandate" },
    id: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/nonEmptyString"
    },
    issuer: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/issuerReference"
    },
    subject: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/agentReference"
    },
    parentMandate: {
      anyOf: [
        {
          $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/nonEmptyString"
        },
        { type: "null" }
      ]
    },
    authority: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/mandateAuthority"
    },
    validity: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/validity"
    },
    statusRef: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/nonEmptyString"
    },
    proof: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/proofs"
    }
  }
};

// ../../packages/schemas/dist/v0.3/action-request.schema.json
var action_request_schema_default3 = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.verimand.com/vagp/0.3/action-request.schema.json",
  title: "VAGP 0.3 Action Request",
  type: "object",
  additionalProperties: false,
  required: [
    "vagp",
    "type",
    "id",
    "agent",
    "principalHint",
    "action",
    "resource",
    "parametersDigest",
    "requestedAt",
    "nonce"
  ],
  properties: {
    vagp: { const: "0.3" },
    type: { const: "action-request" },
    id: {
      $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/nonEmptyString"
    },
    agent: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/agentReference"
    },
    principalHint: {
      anyOf: [
        {
          $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/principalReference"
        },
        { type: "null" }
      ]
    },
    action: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/actionPattern"
    },
    resource: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/resourceReference"
    },
    parametersDigest: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/parametersDigest"
    },
    requestedAt: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/canonicalTimestamp"
    },
    nonce: {
      $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/nonEmptyString"
    }
  }
};

// ../../packages/schemas/dist/v0.3/agent-dna.schema.json
var agent_dna_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.verimand.com/vagp/0.3/agent-dna.schema.json",
  title: "VAGP 0.3 Agent DNA",
  type: "object",
  additionalProperties: false,
  required: [
    "vagp",
    "type",
    "schemaVersion",
    "agentId",
    "components",
    "fingerprint"
  ],
  properties: {
    vagp: { const: "0.3" },
    type: { const: "agent-dna" },
    schemaVersion: { const: "1" },
    agentId: {
      $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/nonEmptyString"
    },
    components: {
      type: "object",
      additionalProperties: false,
      required: [
        "implementation",
        "runtime",
        "instructionsDigest",
        "policyDigest",
        "capabilities",
        "tools",
        "environmentId",
        "securityConfigurationDigest",
        "runtimeConstraintsDigest",
        "protocolConfigurationDigest"
      ],
      properties: {
        implementation: {
          $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/componentReference"
        },
        runtime: {
          type: "object",
          additionalProperties: false,
          required: ["id", "version", "model"],
          properties: {
            id: {
              $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/nonEmptyString"
            },
            version: {
              $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/nonEmptyString"
            },
            model: {
              anyOf: [
                {
                  $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/componentReference"
                },
                { type: "null" }
              ]
            }
          }
        },
        instructionsDigest: {
          $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/digest"
        },
        policyDigest: {
          $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/digest"
        },
        capabilities: {
          $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/componentSet"
        },
        tools: {
          $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/componentSet"
        },
        environmentId: {
          $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/nonEmptyString"
        },
        securityConfigurationDigest: {
          $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/digest"
        },
        runtimeConstraintsDigest: {
          $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/digest"
        },
        protocolConfigurationDigest: {
          $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/digest"
        }
      }
    },
    fingerprint: {
      $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/fingerprint"
    }
  }
};

// ../../packages/schemas/dist/v0.3/agent-lineage.schema.json
var agent_lineage_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.verimand.com/vagp/0.3/agent-lineage.schema.json",
  title: "VAGP 0.3 Agent Lineage",
  type: "object",
  additionalProperties: false,
  required: [
    "vagp",
    "type",
    "schemaVersion",
    "id",
    "authorityDomainId",
    "subject",
    "relation",
    "parents",
    "recordedAt",
    "evidenceRef"
  ],
  properties: {
    vagp: { const: "0.3" },
    type: { const: "agent-lineage" },
    schemaVersion: { const: "1" },
    id: {
      $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/nonEmptyString"
    },
    authorityDomainId: {
      $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/nonEmptyString"
    },
    subject: {
      $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/agentStateReference"
    },
    relation: {
      enum: [
        "created-by",
        "spawned-by",
        "cloned-from",
        "composed-from",
        "delegated-by",
        "derived-from"
      ]
    },
    parents: {
      type: "array",
      maxItems: 32,
      uniqueItems: true,
      items: {
        $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/agentStateReference"
      }
    },
    recordedAt: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/canonicalTimestamp"
    },
    evidenceRef: {
      $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/nonEmptyString"
    }
  }
};

// ../../packages/schemas/dist/v0.3/authority-witness.schema.json
var authority_witness_schema_default2 = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.verimand.com/vagp/0.3/authority-witness.schema.json",
  title: "VAGP 0.3 Authority Witness",
  oneOf: [{ $ref: "#/$defs/internal" }, { $ref: "#/$defs/reduced" }],
  $defs: {
    nonEmptyString: {
      $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/nonEmptyString"
    },
    requestIdentity: {
      type: "object",
      additionalProperties: false,
      required: ["agentId", "requestId"],
      properties: {
        agentId: { $ref: "#/$defs/nonEmptyString" },
        requestId: { $ref: "#/$defs/nonEmptyString" }
      }
    },
    request: {
      type: "object",
      additionalProperties: false,
      required: ["action", "resourceId", "parametersDigest"],
      properties: {
        action: { type: ["string", "null"] },
        resourceId: { type: ["string", "null"] },
        parametersDigest: { type: ["string", "null"] }
      }
    },
    agentState: {
      type: "object",
      additionalProperties: false,
      required: [
        "mandateId",
        "subject",
        "attestationId",
        "attestationIssuerId",
        "observedAt",
        "expiresAt"
      ],
      properties: {
        mandateId: { $ref: "#/$defs/nonEmptyString" },
        subject: {
          $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/agentStateReference"
        },
        attestationId: { $ref: "#/$defs/nonEmptyString" },
        attestationIssuerId: { $ref: "#/$defs/nonEmptyString" },
        observedAt: {
          $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/canonicalTimestamp"
        },
        expiresAt: {
          $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/canonicalTimestamp"
        }
      }
    },
    internal: {
      type: "object",
      additionalProperties: false,
      required: [
        "vagp",
        "type",
        "artifactMode",
        "witnessForm",
        "witnessId",
        "requestIdentity",
        "requestCorrelationId",
        "authenticatedAgentRef",
        "originatingPrincipalId",
        "subjectAgentId",
        "request",
        "selectedPath",
        "trustedContext",
        "requiredCapabilities",
        "agentStates",
        "dimensionEvidence",
        "constraintEvidence",
        "currentAuthority",
        "financial",
        "canonicalPathSelection",
        "bind",
        "derive",
        "verification",
        "execution"
      ],
      properties: {
        vagp: { const: "0.3" },
        type: { const: "authority-witness" },
        artifactMode: { const: "UNSIGNED_REFERENCE" },
        witnessForm: { const: "INTERNAL" },
        witnessId: { $ref: "#/$defs/nonEmptyString" },
        requestIdentity: { $ref: "#/$defs/requestIdentity" },
        requestCorrelationId: { $ref: "#/$defs/nonEmptyString" },
        authenticatedAgentRef: { $ref: "#/$defs/nonEmptyString" },
        originatingPrincipalId: { $ref: "#/$defs/nonEmptyString" },
        subjectAgentId: { $ref: "#/$defs/nonEmptyString" },
        request: { $ref: "#/$defs/request" },
        selectedPath: { type: "object" },
        trustedContext: { type: "object" },
        requiredCapabilities: {
          $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/componentSet"
        },
        agentStates: {
          type: "array",
          minItems: 1,
          items: { $ref: "#/$defs/agentState" }
        },
        dimensionEvidence: { type: "array" },
        constraintEvidence: { type: "array" },
        currentAuthority: { type: "object" },
        financial: { type: "object" },
        canonicalPathSelection: { type: "object" },
        bind: { type: "object" },
        derive: { type: "object" },
        verification: { type: "object" },
        execution: { type: "object" }
      }
    },
    reduced: {
      type: "object",
      additionalProperties: false,
      required: [
        "vagp",
        "type",
        "artifactMode",
        "witnessForm",
        "witnessId",
        "requestIdentity",
        "requestCorrelationId",
        "authenticatedAgentRef",
        "request",
        "resolution",
        "pathFailures",
        "dimensionEvidence",
        "bind",
        "derive",
        "verification",
        "execution"
      ],
      properties: {
        vagp: { const: "0.3" },
        type: { const: "authority-witness" },
        artifactMode: { const: "UNSIGNED_REFERENCE" },
        witnessForm: { const: "REDUCED" },
        witnessId: { $ref: "#/$defs/nonEmptyString" },
        requestIdentity: {
          anyOf: [{ $ref: "#/$defs/requestIdentity" }, { type: "null" }]
        },
        requestCorrelationId: { $ref: "#/$defs/nonEmptyString" },
        authenticatedAgentRef: { type: ["string", "null"] },
        request: { $ref: "#/$defs/request" },
        resolution: { type: "object" },
        pathFailures: { type: "array" },
        dimensionEvidence: { type: "array" },
        bind: { type: "object" },
        derive: { type: "object" },
        verification: { type: "object" },
        execution: { type: "object" }
      }
    }
  }
};

// ../../packages/schemas/dist/v0.3/authority-scope.schema.json
var authority_scope_schema_default3 = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.verimand.com/vagp/0.3/authority-scope.schema.json",
  title: "VAGP 0.3 Authority Scope",
  type: "object",
  additionalProperties: false,
  required: ["authority", "validity"],
  properties: {
    authority: {
      $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/mandateAuthority"
    },
    validity: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/validity"
    }
  }
};

// ../../packages/schemas/dist/v0.3/capability-attestation.schema.json
var capability_attestation_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.verimand.com/vagp/0.3/capability-attestation.schema.json",
  title: "VAGP 0.3 Capability Attestation",
  type: "object",
  additionalProperties: false,
  required: [
    "vagp",
    "type",
    "schemaVersion",
    "id",
    "authorityDomainId",
    "issuerId",
    "subject",
    "issuedAt",
    "expiresAt",
    "statusRef",
    "proof"
  ],
  properties: {
    vagp: { const: "0.3" },
    type: { const: "capability-attestation" },
    schemaVersion: { const: "1" },
    id: {
      $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/nonEmptyString"
    },
    authorityDomainId: {
      $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/nonEmptyString"
    },
    issuerId: {
      $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/nonEmptyString"
    },
    subject: {
      $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/agentStateReference"
    },
    issuedAt: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/canonicalTimestamp"
    },
    expiresAt: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/canonicalTimestamp"
    },
    statusRef: {
      $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/nonEmptyString"
    },
    proof: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/proofs"
    }
  }
};

// ../../packages/schemas/dist/v0.3/common.schema.json
var common_schema_default3 = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.verimand.com/vagp/0.3/common.schema.json",
  title: "VAGP 0.3 common definitions",
  $defs: {
    nonEmptyString: {
      type: "string",
      minLength: 1,
      maxLength: 2048,
      pattern: "^[^\\uD800-\\uDFFF]+$"
    },
    algorithmIdentifier: {
      type: "string",
      minLength: 1,
      maxLength: 64,
      pattern: "^[A-Za-z0-9][A-Za-z0-9._-]*$"
    },
    digest: {
      type: "object",
      additionalProperties: false,
      required: ["algorithm", "value"],
      properties: {
        algorithm: { $ref: "#/$defs/algorithmIdentifier" },
        value: { $ref: "#/$defs/nonEmptyString" }
      }
    },
    componentReference: {
      type: "object",
      additionalProperties: false,
      required: ["id", "version"],
      properties: {
        id: { $ref: "#/$defs/nonEmptyString" },
        version: { $ref: "#/$defs/nonEmptyString" }
      }
    },
    componentSet: {
      type: "array",
      maxItems: 256,
      uniqueItems: true,
      items: { $ref: "#/$defs/componentReference" }
    },
    fingerprint: {
      type: "object",
      additionalProperties: false,
      required: ["canonicalization", "algorithm", "value"],
      properties: {
        canonicalization: { const: "vagp-agent-dna-tuple-v1" },
        algorithm: { $ref: "#/$defs/algorithmIdentifier" },
        value: { $ref: "#/$defs/nonEmptyString" }
      }
    },
    agentStateReference: {
      type: "object",
      additionalProperties: false,
      required: ["agentId", "fingerprint", "stateRevision"],
      properties: {
        agentId: { $ref: "#/$defs/nonEmptyString" },
        fingerprint: { $ref: "#/$defs/fingerprint" },
        stateRevision: { type: "integer", minimum: 1 }
      }
    },
    agentStateAuthorityBinding: {
      type: "object",
      additionalProperties: false,
      required: ["fingerprint", "stateRevision", "maxStateStalenessMs"],
      properties: {
        fingerprint: { $ref: "#/$defs/fingerprint" },
        stateRevision: { type: "integer", minimum: 1 },
        maxStateStalenessMs: { type: "integer", minimum: 0 }
      }
    },
    mandateAuthority: {
      type: "object",
      additionalProperties: false,
      required: [
        "actions",
        "resources",
        "constraints",
        "financial",
        "autonomy",
        "assurance",
        "delegation",
        "revocation",
        "financialApplicability",
        "agentState",
        "capabilities"
      ],
      properties: {
        actions: {
          type: "array",
          minItems: 1,
          uniqueItems: true,
          items: {
            $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/actionPattern"
          }
        },
        resources: {
          type: "array",
          minItems: 1,
          uniqueItems: true,
          items: {
            $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/mandateResource"
          }
        },
        constraints: {
          type: "object",
          propertyNames: { minLength: 1 },
          additionalProperties: {
            $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/mandateConstraint"
          }
        },
        financial: {
          anyOf: [
            {
              $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/financialLimits"
            },
            { type: "null" }
          ]
        },
        autonomy: {
          $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/autonomyRequirement"
        },
        assurance: {
          $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/assuranceRequirement"
        },
        delegation: {
          $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/delegationLimits"
        },
        revocation: {
          $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/revocationRequirement"
        },
        financialApplicability: {
          $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/financialApplicabilityRequirement"
        },
        agentState: { $ref: "#/$defs/agentStateAuthorityBinding" },
        capabilities: { $ref: "#/$defs/componentSet" }
      }
    }
  }
};

// ../../packages/schemas/dist/v0.3/mandate.schema.json
var mandate_schema_default3 = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.verimand.com/vagp/0.3/mandate.schema.json",
  title: "VAGP 0.3 Mandate",
  type: "object",
  additionalProperties: false,
  required: [
    "vagp",
    "type",
    "id",
    "issuer",
    "subject",
    "parentMandate",
    "authority",
    "validity",
    "statusRef",
    "proof"
  ],
  properties: {
    vagp: { const: "0.3" },
    type: { const: "mandate" },
    id: {
      $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/nonEmptyString"
    },
    issuer: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/issuerReference"
    },
    subject: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/agentReference"
    },
    parentMandate: {
      anyOf: [
        {
          $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/nonEmptyString"
        },
        { type: "null" }
      ]
    },
    authority: {
      $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/mandateAuthority"
    },
    validity: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/validity"
    },
    statusRef: {
      $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/nonEmptyString"
    },
    proof: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/proofs"
    }
  }
};

// ../../packages/schemas/dist/v0.3/signed-authority-witness.schema.json
var signed_authority_witness_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.verimand.com/vagp/0.3/signed-authority-witness.schema.json",
  title: "VAGP 0.3 Signed Authority Witness",
  type: "object",
  additionalProperties: false,
  required: [
    "vagp",
    "type",
    "schemaVersion",
    "evidencePhase",
    "previousWitnessDigest",
    "witness",
    "witnessDigest",
    "proof"
  ],
  properties: {
    vagp: { const: "0.3" },
    type: { const: "signed-authority-witness" },
    schemaVersion: { const: "1" },
    evidencePhase: { enum: ["INTENT", "OUTCOME"] },
    previousWitnessDigest: {
      anyOf: [
        {
          $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/digest"
        },
        { type: "null" }
      ]
    },
    witness: {
      $ref: "https://schemas.verimand.com/vagp/0.3/authority-witness.schema.json"
    },
    witnessDigest: {
      $ref: "https://schemas.verimand.com/vagp/0.3/common.schema.json#/$defs/digest"
    },
    proof: {
      $ref: "https://schemas.verimand.com/vagp/0.2/common.schema.json#/$defs/proof"
    }
  },
  allOf: [
    {
      if: {
        properties: { evidencePhase: { const: "INTENT" } },
        required: ["evidencePhase"]
      },
      then: { properties: { previousWitnessDigest: { type: "null" } } }
    }
  ]
};

// ../../packages/schemas/dist/index.js
var ajv = new import__.default.default({
  allErrors: true,
  allowUnionTypes: true,
  ownProperties: true,
  strict: true
});
import_ajv_formats.default.default(ajv);
ajv.addSchema(common_schema_default);
ajv.addSchema(common_schema_default2);
ajv.addSchema(common_schema_default3);
ajv.addSchema(authority_witness_schema_default2);
var mandateValidator = ajv.compile(mandate_schema_default);
var mandateV02Validator = ajv.compile(mandate_schema_default2);
var mandateV03Validator = ajv.compile(mandate_schema_default3);
var authorityWitnessV02Validator = ajv.compile(authority_witness_schema_default);
var authorityWitnessV03Validator = ajv.getSchema("https://schemas.verimand.com/vagp/0.3/authority-witness.schema.json") ?? (() => {
  throw new Error("VAGP_SCHEMA_AUTHORITY_WITNESS_V03_NOT_REGISTERED");
})();
var signedAuthorityWitnessV03Validator = ajv.compile(signed_authority_witness_schema_default);
var actionRequestValidator = ajv.compile(action_request_schema_default);
var actionRequestV02Validator = ajv.compile(action_request_schema_default2);
var actionRequestV03Validator = ajv.compile(action_request_schema_default3);
var authorityScopeValidator = ajv.compile(authority_scope_schema_default);
var authorityScopeV02Validator = ajv.compile(authority_scope_schema_default2);
var authorityScopeV03Validator = ajv.compile(authority_scope_schema_default3);
var agentDnaV03Validator = ajv.compile(agent_dna_schema_default);
var capabilityAttestationV03Validator = ajv.compile(capability_attestation_schema_default);
var agentLineageV03Validator = ajv.compile(agent_lineage_schema_default);
var revocationEventValidator = ajv.compile(revocation_event_schema_default);
function normalizeError(error4) {
  let path = error4.instancePath === "" ? "$" : error4.instancePath;
  const property = error4.keyword === "required" ? error4.params["missingProperty"] : error4.keyword === "additionalProperties" ? error4.params["additionalProperty"] : void 0;
  if (typeof property === "string") {
    const escapedProperty = property.replaceAll("~", "~0").replaceAll("/", "~1");
    path = `${path === "$" ? "" : path}/${escapedProperty}`;
  }
  return {
    path: path === "" ? "$" : path,
    code: error4.keyword,
    message: error4.message ?? "Validation failed"
  };
}
function validate(validator, value) {
  if (validator(value)) {
    return { valid: true, errors: [] };
  }
  return {
    valid: false,
    errors: (validator.errors ?? []).map(normalizeError)
  };
}
function validateAny(validators, value) {
  const results = validators.map((validator) => validate(validator, value));
  if (results.some((result) => result.valid)) {
    return { valid: true, errors: [] };
  }
  return {
    valid: false,
    errors: results.flatMap((result) => result.errors)
  };
}
function validateMandate(value) {
  return validateAny([mandateValidator, mandateV02Validator, mandateV03Validator], value);
}
function validateActionRequest(value) {
  return validateAny([
    actionRequestValidator,
    actionRequestV02Validator,
    actionRequestV03Validator
  ], value);
}
function validateAuthorityScope(value) {
  return validateAny([
    authorityScopeValidator,
    authorityScopeV02Validator,
    authorityScopeV03Validator
  ], value);
}

// ../../packages/agent-state/dist/index.js
var AGENT_DNA_CANONICALIZATION = "vagp-agent-dna-tuple-v1";
var trustedAgentStateEvidence = /* @__PURE__ */ new WeakSet();
function isInertData(value, seen = /* @__PURE__ */ new WeakSet(), depth = 0) {
  if (value === null || typeof value === "string" || typeof value === "boolean") {
    return true;
  }
  if (typeof value === "number")
    return Number.isFinite(value);
  if (typeof value !== "object" || depth > 32 || seen.has(value))
    return false;
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null && !Array.isArray(value)) {
    return false;
  }
  seen.add(value);
  try {
    const keys = Reflect.ownKeys(value);
    if (keys.some((key) => typeof key !== "string"))
      return false;
    if (Array.isArray(value) && keys.some((key) => key !== "length" && (typeof key !== "string" || !/^(0|[1-9][0-9]*)$/u.test(key)))) {
      return false;
    }
    if (Array.isArray(value) && keys.filter((key) => key !== "length").length !== value.length) {
      return false;
    }
    for (const key of keys) {
      if (key === "length" && Array.isArray(value))
        continue;
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (descriptor === void 0 || !descriptor.enumerable || !Object.hasOwn(descriptor, "value") || descriptor.value === void 0 || !isInertData(descriptor.value, seen, depth + 1)) {
        return false;
      }
    }
    return true;
  } finally {
    seen.delete(value);
  }
}
function deepFreezeClone2(value) {
  const clone = structuredClone(value);
  const freeze = (candidate) => {
    if (candidate === null || typeof candidate !== "object")
      return;
    for (const child of Object.values(candidate))
      freeze(child);
    Object.freeze(candidate);
  };
  freeze(clone);
  return clone;
}
function isTrustedAgentStateEvidence(value) {
  return value !== null && typeof value === "object" && trustedAgentStateEvidence.has(value);
}
function isAgentStateReference(value) {
  if (!isRecord(value))
    return false;
  const fingerprint2 = value["fingerprint"];
  return typeof value["agentId"] === "string" && value["agentId"].length > 0 && Number.isSafeInteger(value["stateRevision"]) && value["stateRevision"] >= 1 && isRecord(fingerprint2) && fingerprint2["canonicalization"] === AGENT_DNA_CANONICALIZATION && typeof fingerprint2["algorithm"] === "string" && typeof fingerprint2["value"] === "string" && fingerprint2["value"].length > 0;
}
function isVersionedComponentReference(value) {
  return isRecord(value) && typeof value["id"] === "string" && value["id"].length > 0 && typeof value["version"] === "string" && value["version"].length > 0;
}
function isTrustedAgentStateEvidenceShape(value) {
  return isRecord(value) && typeof value["authorityDomainId"] === "string" && value["authorityDomainId"].length > 0 && isAgentStateReference(value["subject"]) && typeof value["attestationId"] === "string" && value["attestationId"].length > 0 && typeof value["attestationIssuerId"] === "string" && value["attestationIssuerId"].length > 0 && typeof value["observedAt"] === "string" && parseCanonicalTimestamp(value["observedAt"]).valid && typeof value["expiresAt"] === "string" && parseCanonicalTimestamp(value["expiresAt"]).valid && typeof value["statusRef"] === "string" && value["statusRef"].length > 0 && Array.isArray(value["capabilities"]) && value["capabilities"].every(isVersionedComponentReference);
}
async function admitTrustedAgentStateEvidence(evidence, policy) {
  try {
    if (!isInertData(evidence) || !isTrustedAgentStateEvidenceShape(evidence)) {
      return fail("VAGP_AGENT_STATE_UNAVAILABLE", "/evidence", "Trusted Agent State Evidence must match the closed VAGP 0.3 evidence profile");
    }
    const observed = parseCanonicalTimestamp(evidence.observedAt);
    const expires = parseCanonicalTimestamp(evidence.expiresAt);
    if (!observed.valid || !expires.valid || observed.epochMilliseconds > expires.epochMilliseconds) {
      return fail("VAGP_AGENT_STATE_STALE", "/evidence/expiresAt", "Trusted Agent State Evidence observation must not outlive its attestation");
    }
    const admitted = deepFreezeClone2(evidence);
    if (!await policy.authorize(admitted)) {
      return fail("VAGP_AGENT_ATTESTATION_INVALID", "/evidence", "Trusted Agent State Evidence is not authorized by the configured trust policy");
    }
    trustedAgentStateEvidence.add(admitted);
    return success(admitted);
  } catch {
    return fail("VAGP_AGENT_STATE_UNAVAILABLE", "/evidence", "Trusted Agent State Evidence could not be admitted safely");
  }
}
function error(code, path, message) {
  return Object.freeze({ code, path, message });
}
function fail(code, path, message) {
  return Object.freeze({
    ok: false,
    errors: Object.freeze([error(code, path, message)])
  });
}
function success(value) {
  return Object.freeze({ ok: true, value });
}
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// ../../packages/attenuation/dist/types.js
function succeed(value) {
  return { ok: true, value };
}
function fail2(code, path, message) {
  return { ok: false, errors: [{ code, path, message }] };
}
function failWith(errors) {
  return { ok: false, errors };
}

// ../../packages/attenuation/dist/boundary.js
function inspectOwnData(value, path, seen) {
  if (typeof value === "function" || typeof value === "symbol") {
    return {
      code: "VAGP_INPUT_MATERIALIZATION_FAILED",
      path,
      message: "Functions and symbols are not valid authority data"
    };
  }
  if (value === null || typeof value !== "object") {
    return null;
  }
  if (seen.has(value)) {
    return {
      code: "VAGP_INPUT_MATERIALIZATION_FAILED",
      path,
      message: "Cyclic authority data is not supported"
    };
  }
  seen.add(value);
  try {
    const array = Array.isArray(value);
    const prototype = Object.getPrototypeOf(value);
    const expectedPrototype = array ? Array.prototype : Object.prototype;
    if (prototype !== expectedPrototype && prototype !== null) {
      return {
        code: "VAGP_INPUT_MATERIALIZATION_FAILED",
        path,
        message: "Authority data must use a plain or null prototype"
      };
    }
    const keys = Reflect.ownKeys(value);
    const lengthDescriptor = array ? Reflect.getOwnPropertyDescriptor(value, "length") : void 0;
    const arrayLength = lengthDescriptor?.value;
    for (const key of keys) {
      if (array && key === "length") {
        continue;
      }
      if (typeof key === "symbol") {
        return {
          code: "VAGP_INPUT_MATERIALIZATION_FAILED",
          path,
          message: "Symbol authority properties are not permitted"
        };
      }
      if (array && (typeof arrayLength !== "number" || !/^(0|[1-9][0-9]*)$/.test(key) || Number(key) >= arrayLength)) {
        return {
          code: "VAGP_UNKNOWN_PROPERTY",
          path: `${path}/${key}`,
          message: "Unknown array properties are not permitted"
        };
      }
      const descriptor = Reflect.getOwnPropertyDescriptor(value, key);
      if (descriptor === void 0 || !descriptor.enumerable) {
        return {
          code: "VAGP_INPUT_MATERIALIZATION_FAILED",
          path: `${path}/${key}`,
          message: "Hidden authority properties are not permitted"
        };
      }
      if (!Object.hasOwn(descriptor, "value")) {
        return {
          code: "VAGP_INPUT_MATERIALIZATION_FAILED",
          path: `${path}/${key}`,
          message: "Accessor authority properties are not permitted"
        };
      }
      const nested = inspectOwnData(descriptor.value, `${path}/${key}`, seen);
      if (nested !== null) {
        return nested;
      }
    }
  } catch {
    return {
      code: "VAGP_INPUT_MATERIALIZATION_FAILED",
      path,
      message: "Authority input could not be inspected safely"
    };
  } finally {
    seen.delete(value);
  }
  return null;
}
function materializeInput(value, path) {
  const inspectionError = inspectOwnData(value, path, /* @__PURE__ */ new WeakSet());
  if (inspectionError !== null) {
    return failWith([inspectionError]);
  }
  try {
    return succeed(structuredClone(value));
  } catch {
    return fail2("VAGP_INPUT_MATERIALIZATION_FAILED", path, "Authority input could not be materialized safely");
  }
}
function errorCodeForPath(path, schemaCode) {
  if (schemaCode === "additionalProperties") {
    return "VAGP_UNKNOWN_PROPERTY";
  }
  if (path.includes("/autonomy")) {
    return "VAGP_INVALID_AUTONOMY_MODE";
  }
  if (path.includes("/assurance")) {
    return "VAGP_INVALID_ASSURANCE_LEVEL";
  }
  if (path.includes("/resources")) {
    return "VAGP_INVALID_RESOURCE_SELECTOR";
  }
  if (path.includes("/constraints")) {
    return "VAGP_UNKNOWN_CONSTRAINT_TYPE";
  }
  if (path.includes("/delegation/remainingDepth")) {
    return "VAGP_INVALID_DELEGATION_DEPTH";
  }
  if (path.includes("/delegation")) {
    return "VAGP_INVALID_DELEGATION";
  }
  if (path.includes("/revocation")) {
    return "VAGP_INVALID_REVOCATION_REQUIREMENT";
  }
  if (path.includes("/actions")) {
    return "VAGP_INVALID_ACTION_PATTERN";
  }
  if (path.includes("/financial/currency")) {
    return "VAGP_INVALID_CURRENCY";
  }
  if (path.includes("/financialApplicability")) {
    return "VAGP_INVALID_FINANCIAL_APPLICABILITY";
  }
  if (path.includes("/validity")) {
    return "VAGP_INVALID_TIMESTAMP";
  }
  return "VAGP_INVALID_AUTHORITY_SCOPE";
}
function canonicalConstraint(name, constraint) {
  switch (constraint.type) {
    case "exact":
      return succeed(Object.freeze({
        type: "exact",
        value: typeof constraint.value === "number" && Object.is(constraint.value, -0) ? 0 : constraint.value
      }));
    case "enum": {
      const sorted = [...constraint.allowed].sort();
      const [first, ...rest] = sorted;
      const allowed = Object.freeze([
        first,
        ...rest
      ]);
      return succeed(Object.freeze({
        type: "enum",
        allowed
      }));
    }
    case "numericRange":
      return succeed(constraint.min === null ? Object.freeze({
        type: "numericRange",
        min: null,
        max: Object.is(constraint.max, -0) ? 0 : constraint.max
      }) : Object.freeze({
        type: "numericRange",
        min: Object.is(constraint.min, -0) ? 0 : constraint.min,
        max: constraint.max !== null && Object.is(constraint.max, -0) ? 0 : constraint.max
      }));
    default:
      return fail2("VAGP_UNKNOWN_CONSTRAINT_TYPE", `/authority/constraints/${name}/type`, "Constraint type cannot be canonicalized");
  }
}
function canonicalConstraints(constraints) {
  const result = /* @__PURE__ */ Object.create(null);
  for (const [name, constraint] of Object.entries(constraints).sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)) {
    const canonical = canonicalConstraint(name, constraint);
    if (!canonical.ok) {
      return canonical;
    }
    result[name] = canonical.value;
  }
  return succeed(Object.freeze(result));
}
function canonicalFinancial(financial) {
  if (financial === null) {
    return null;
  }
  return financial.maxTransaction === null ? Object.freeze({
    currency: financial.currency,
    maxTransaction: null,
    maxAggregate: Object.is(financial.maxAggregate, -0) ? 0 : financial.maxAggregate
  }) : Object.freeze({
    currency: financial.currency,
    maxTransaction: Object.is(financial.maxTransaction, -0) ? 0 : financial.maxTransaction,
    maxAggregate: financial.maxAggregate !== null && Object.is(financial.maxAggregate, -0) ? 0 : financial.maxAggregate
  });
}
function canonicalCapabilities(capabilities) {
  return Object.freeze(capabilities.map((entry) => Object.freeze({ id: entry.id, version: entry.version })).toSorted((left, right) => {
    const leftKey = `${left.id}\0${left.version}`;
    const rightKey = `${right.id}\0${right.version}`;
    return leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0;
  }));
}
function actionContains(parent, candidate) {
  if (!parent.endsWith(".*")) {
    return parent === candidate;
  }
  return candidate.startsWith(parent.slice(0, -1));
}
function canonicalActions(actions) {
  const sorted = [...actions].sort();
  const minimal = sorted.filter((candidate, candidateIndex) => !sorted.some((parent, parentIndex) => parentIndex !== candidateIndex && actionContains(parent, candidate)));
  return Object.freeze(minimal);
}
function resourceContains(parent, candidate) {
  return parent.match === "exact" ? candidate.match === "exact" && parent.value === candidate.value : candidate.value.startsWith(parent.value);
}
function canonicalResources(resources) {
  const sorted = resources.map((resource) => Object.freeze({ match: resource.match, value: resource.value })).sort((left, right) => {
    const leftKey = `${left.match}\0${left.value}`;
    const rightKey = `${right.match}\0${right.value}`;
    return leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0;
  });
  const minimal = sorted.filter((candidate, candidateIndex) => !sorted.some((parent, parentIndex) => parentIndex !== candidateIndex && resourceContains(parent, candidate)));
  return Object.freeze(minimal);
}
function canonicalFinancialApplicability(value, actions, financial) {
  if (value === void 0) {
    return succeed(void 0);
  }
  if (value === null || typeof value !== "object" || Array.isArray(value) || !Object.hasOwn(value, "requiredActions") || Object.keys(value).length !== 1) {
    return fail2("VAGP_INVALID_FINANCIAL_APPLICABILITY", "/authority/financialApplicability", "Financial applicability must contain only requiredActions");
  }
  const requiredActions = value["requiredActions"];
  if (!Array.isArray(requiredActions)) {
    return fail2("VAGP_INVALID_FINANCIAL_APPLICABILITY", "/authority/financialApplicability/requiredActions", "Required financial actions must be an array");
  }
  const authorityPatterns = actions.map((pattern) => parseActionPatternSnapshot(pattern, "/authority/actions"));
  const parsedRequired = [];
  const errors = [];
  for (const [index, pattern] of requiredActions.entries()) {
    const parsed = parseActionPatternSnapshot(pattern, `/authority/financialApplicability/requiredActions/${String(index)}`);
    if (!parsed.ok) {
      errors.push(...parsed.errors);
      continue;
    }
    if (typeof pattern !== "string") {
      errors.push({
        code: "VAGP_INVALID_FINANCIAL_APPLICABILITY",
        path: `/authority/financialApplicability/requiredActions/${String(index)}`,
        message: "Required financial action patterns must be strings"
      });
      continue;
    }
    const coveredByActionAuthority = authorityPatterns.some((authorityPattern) => authorityPattern.ok && parsedActionPatternContains(authorityPattern.value, parsed.value));
    if (!coveredByActionAuthority) {
      errors.push({
        code: "VAGP_INVALID_FINANCIAL_APPLICABILITY",
        path: `/authority/financialApplicability/requiredActions/${String(index)}`,
        message: "A required financial action pattern must be covered by the Mandate action authority"
      });
      continue;
    }
    parsedRequired.push({ value: pattern, parsed: parsed.value });
  }
  if (errors.length > 0)
    return failWith(errors);
  if (financial === null && parsedRequired.length > 0) {
    return fail2("VAGP_INVALID_FINANCIAL_APPLICABILITY", "/authority/financialApplicability/requiredActions", "A Mandate with required financial actions must express financial authority");
  }
  const sorted = parsedRequired.toSorted((left, right) => left.value < right.value ? -1 : left.value > right.value ? 1 : 0);
  const canonical = sorted.filter((candidate, candidateIndex) => !sorted.some((parent, parentIndex) => parentIndex !== candidateIndex && parsedActionPatternContains(parent.parsed, candidate.parsed))).map((entry) => entry.value);
  return succeed(Object.freeze({
    requiredActions: Object.freeze(canonical)
  }));
}
function canonicalAuthorityScope(value) {
  const actions = canonicalActions(value.authority.actions);
  const resources = canonicalResources(value.authority.resources);
  const constraints = canonicalConstraints(value.authority.constraints);
  if (!constraints.ok) {
    return constraints;
  }
  const financial = canonicalFinancial(value.authority.financial);
  const financialApplicability = canonicalFinancialApplicability("financialApplicability" in value.authority ? value.authority.financialApplicability : void 0, actions, financial);
  if (!financialApplicability.ok) {
    return financialApplicability;
  }
  const authority = Object.freeze({
    actions,
    resources,
    constraints: constraints.value,
    financial,
    autonomy: Object.freeze({ mode: value.authority.autonomy.mode }),
    assurance: Object.freeze({ minimum: value.authority.assurance.minimum }),
    delegation: Object.freeze({
      allowed: value.authority.delegation.allowed,
      remainingDepth: value.authority.delegation.allowed ? value.authority.delegation.remainingDepth : 0
    }),
    ..."revocation" in value.authority ? {
      revocation: Object.freeze({
        maxStatusStalenessMs: value.authority.revocation.maxStatusStalenessMs
      })
    } : {},
    ...financialApplicability.value === void 0 ? {} : { financialApplicability: financialApplicability.value },
    ..."agentState" in value.authority ? {
      agentState: Object.freeze(structuredClone(value.authority.agentState)),
      capabilities: canonicalCapabilities(value.authority.capabilities)
    } : {}
  });
  return succeed(Object.freeze({
    authority,
    validity: Object.freeze({
      notBefore: value.validity.notBefore,
      notAfter: value.validity.notAfter
    })
  }));
}
function validateAuthorityScope2(value) {
  const materialized = materializeInput(value, "/");
  if (!materialized.ok) {
    return materialized;
  }
  const structural = validateAuthorityScope(materialized.value);
  if (!structural.valid) {
    return failWith(structural.errors.map((error4) => ({
      code: errorCodeForPath(error4.path, error4.code),
      path: error4.path,
      message: error4.message
    })));
  }
  const canonical = canonicalAuthorityScope(materialized.value);
  if (!canonical.ok) {
    return canonical;
  }
  const semantic = validateAuthoritySemantics(canonical.value.authority, canonical.value.validity);
  if (!semantic.valid) {
    return failWith(semantic.errors.map((error4) => ({
      code: error4.code === "VAGP_SEMANTIC_DELEGATION_DEPTH_INVALID" ? "VAGP_INVALID_DELEGATION_DEPTH" : error4.code === "VAGP_SEMANTIC_INVALID_TIMESTAMP" ? "VAGP_INVALID_TIMESTAMP" : error4.code === "VAGP_SEMANTIC_REVOCATION_REQUIREMENT_INVALID" ? "VAGP_INVALID_REVOCATION_REQUIREMENT" : error4.code === "VAGP_SEMANTIC_FINANCIAL_APPLICABILITY_INVALID" ? "VAGP_INVALID_FINANCIAL_APPLICABILITY" : "VAGP_INVALID_AUTHORITY_SCOPE",
      path: error4.path,
      message: error4.message
    })));
  }
  return canonical;
}

// ../../packages/attenuation/dist/action-pattern.js
function isLowercaseLetter(code) {
  return code >= 97 && code <= 122;
}
function isDigit(code) {
  return code >= 48 && code <= 57;
}
function isCanonicalSegment(segment) {
  if (segment.length === 0 || !isLowercaseLetter(segment.charCodeAt(0))) {
    return false;
  }
  for (let index = 1; index < segment.length; index += 1) {
    const code = segment.charCodeAt(index);
    if (!isLowercaseLetter(code) && !isDigit(code) && code !== 45) {
      return false;
    }
  }
  return true;
}
function parseActionPatternSnapshot(value, path) {
  if (typeof value !== "string") {
    return fail2("VAGP_INVALID_ACTION_PATTERN", path, "An action pattern must be a string");
  }
  const parts = value.split(".");
  const terminalWildcard = parts.at(-1) === "*";
  const concreteParts = terminalWildcard ? parts.slice(0, -1) : parts;
  if (concreteParts.length === 0 || concreteParts.some((segment) => !isCanonicalSegment(segment)) || !terminalWildcard && parts.some((segment) => segment.includes("*"))) {
    return fail2("VAGP_INVALID_ACTION_PATTERN", path, "Action patterns must use lowercase ASCII segments and an optional terminal wildcard");
  }
  const [first, ...rest] = concreteParts;
  if (first === void 0) {
    return fail2("VAGP_INVALID_ACTION_PATTERN", path, "An action pattern requires a concrete segment");
  }
  return succeed({
    segments: Object.freeze([first, ...rest]),
    terminalWildcard
  });
}
function segmentsStartWith(value, prefix) {
  return value.length >= prefix.length && prefix.every((segment, index) => value[index] === segment);
}
function parsedActionPatternContains(parent, child) {
  if (!parent.terminalWildcard) {
    return !child.terminalWildcard && parent.segments.length === child.segments.length && segmentsStartWith(child.segments, parent.segments);
  }
  if (!segmentsStartWith(child.segments, parent.segments)) {
    return false;
  }
  return child.terminalWildcard ? child.segments.length === parent.segments.length : child.segments.length === parent.segments.length + 1;
}
function actionPatternContains(parent, child) {
  const materializedParent = materializeInput(parent, "/parentAction");
  if (!materializedParent.ok) {
    return materializedParent;
  }
  const materializedChild = materializeInput(child, "/childAction");
  if (!materializedChild.ok) {
    return materializedChild;
  }
  const parsedParent = parseActionPatternSnapshot(materializedParent.value, "/parentAction");
  if (!parsedParent.ok) {
    return parsedParent;
  }
  const parsedChild = parseActionPatternSnapshot(materializedChild.value, "/childAction");
  if (!parsedChild.ok) {
    return parsedChild;
  }
  return succeed(parsedActionPatternContains(parsedParent.value, parsedChild.value));
}

// ../../packages/attenuation/dist/restrictions.js
function isRecord2(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function hasOnlyKeys(value, keys) {
  const actual = Object.keys(value);
  return actual.length === keys.length && actual.every((key) => keys.includes(key));
}
function materializeTwo(parent, child, parentPath, childPath) {
  const materializedParent = materializeInput(parent, parentPath);
  if (!materializedParent.ok) {
    return materializedParent;
  }
  const materializedChild = materializeInput(child, childPath);
  if (!materializedChild.ok) {
    return materializedChild;
  }
  return succeed([materializedParent.value, materializedChild.value]);
}
function duplicateIndexes(values, key) {
  const seen = /* @__PURE__ */ new Set();
  const duplicates = [];
  values.forEach((value, index) => {
    const itemKey = key(value);
    if (seen.has(itemKey)) {
      duplicates.push(index);
    } else {
      seen.add(itemKey);
    }
  });
  return duplicates;
}
function parseActions(value, path, emptyCode) {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    return fail2("VAGP_INVALID_ACTION_PATTERN", path, "Actions must be an array of strings");
  }
  if (value.length === 0) {
    return fail2(emptyCode, path, "Actions must not be empty");
  }
  const duplicates = duplicateIndexes(value, (action) => action);
  if (duplicates.length > 0) {
    return fail2(path.startsWith("/authority") ? "VAGP_INVALID_PARENT_AUTHORITY" : "VAGP_ATTENUATION_ACTION_DUPLICATE", `${path}/${String(duplicates[0])}`, "Actions must be unique");
  }
  const parsed = [];
  const errors = [];
  value.forEach((action, index) => {
    const result = parseActionPatternSnapshot(action, `${path}/${String(index)}`);
    if (result.ok) {
      parsed.push(result.value);
    } else {
      errors.push(...result.errors);
    }
  });
  if (errors.length > 0) {
    return failWith(errors);
  }
  const [first, ...rest] = value;
  if (first === void 0) {
    return fail2(emptyCode, path, "Actions must not be empty");
  }
  return succeed({ values: Object.freeze([first, ...rest]), parsed });
}
function restrictActionsSnapshot(parent, child) {
  const parsedParent = parseActions(parent, "/authority/actions", "VAGP_INVALID_PARENT_AUTHORITY");
  if (!parsedParent.ok) {
    return parsedParent;
  }
  const parsedChild = parseActions(child, "/restrictions/actions", "VAGP_ATTENUATION_ACTION_EMPTY");
  if (!parsedChild.ok) {
    return parsedChild;
  }
  const errors = [];
  parsedChild.value.parsed.forEach((candidate, index) => {
    if (!parsedParent.value.parsed.some((parentPattern) => parsedActionPatternContains(parentPattern, candidate))) {
      errors.push({
        code: "VAGP_ATTENUATION_ACTION_EXPANDED",
        path: `/restrictions/actions/${String(index)}`,
        message: "Requested action is not contained by the parent authority"
      });
    }
  });
  return errors.length === 0 ? succeed(parsedChild.value.values) : failWith(errors);
}
function restrictActions(parent, requestedChild) {
  const values = materializeTwo(parent, requestedChild, "/authority/actions", "/restrictions/actions");
  return values.ok ? restrictActionsSnapshot(values.value[0], values.value[1]) : values;
}
function parseResourceSelector(value, path) {
  if (!isRecord2(value) || !hasOnlyKeys(value, ["match", "value"])) {
    return fail2("VAGP_INVALID_RESOURCE_SELECTOR", path, "A resource selector must contain only match and value");
  }
  const match = value["match"];
  const resourceValue = value["value"];
  if (match !== "exact" && match !== "prefix") {
    return fail2("VAGP_INVALID_RESOURCE_SELECTOR", `${path}/match`, "Resource match must be exact or prefix");
  }
  if (typeof resourceValue !== "string" || resourceValue.length === 0 || match === "prefix" && !resourceValue.endsWith(":")) {
    return fail2("VAGP_INVALID_RESOURCE_SELECTOR", `${path}/value`, "Resource values must be non-empty and prefixes must end with a colon");
  }
  return succeed(Object.freeze({ match, value: resourceValue }));
}
function resourceContains2(parent, child) {
  return parent.match === "exact" ? child.match === "exact" && child.value === parent.value : child.value.startsWith(parent.value);
}
function resourceSelectorContains(parent, child) {
  const values = materializeTwo(parent, child, "/parentResource", "/childResource");
  if (!values.ok) {
    return values;
  }
  const parsedParent = parseResourceSelector(values.value[0], "/parentResource");
  if (!parsedParent.ok) {
    return parsedParent;
  }
  const parsedChild = parseResourceSelector(values.value[1], "/childResource");
  return parsedChild.ok ? succeed(resourceContains2(parsedParent.value, parsedChild.value)) : parsedChild;
}
function parseResources(value, path, emptyCode) {
  if (!Array.isArray(value) || value.length === 0) {
    return fail2(emptyCode, path, "Resource selectors must be a non-empty array");
  }
  const parsed = [];
  const errors = [];
  value.forEach((selector, index) => {
    const result = parseResourceSelector(selector, `${path}/${String(index)}`);
    if (result.ok) {
      parsed.push(result.value);
    } else {
      errors.push(...result.errors);
    }
  });
  if (errors.length > 0) {
    return failWith(errors);
  }
  const duplicates = duplicateIndexes(parsed, (selector) => JSON.stringify([selector.match, selector.value]));
  if (duplicates.length > 0) {
    return fail2(path.startsWith("/authority") ? "VAGP_INVALID_PARENT_AUTHORITY" : "VAGP_ATTENUATION_RESOURCE_DUPLICATE", `${path}/${String(duplicates[0])}`, "Resource selectors must be unique");
  }
  const [first, ...rest] = parsed;
  return first === void 0 ? fail2(emptyCode, path, "Resource selectors must not be empty") : succeed(Object.freeze([first, ...rest]));
}
function restrictResourcesSnapshot(parent, child) {
  const parsedParent = parseResources(parent, "/authority/resources", "VAGP_INVALID_PARENT_AUTHORITY");
  if (!parsedParent.ok) {
    return parsedParent;
  }
  const parsedChild = parseResources(child, "/restrictions/resources", "VAGP_ATTENUATION_RESOURCE_EMPTY");
  if (!parsedChild.ok) {
    return parsedChild;
  }
  const errors = [];
  parsedChild.value.forEach((candidate, index) => {
    if (!parsedParent.value.some((parentSelector) => resourceContains2(parentSelector, candidate))) {
      errors.push({
        code: "VAGP_ATTENUATION_RESOURCE_EXPANDED",
        path: `/restrictions/resources/${String(index)}`,
        message: "Requested resource is not contained by the parent authority"
      });
    }
  });
  return errors.length === 0 ? succeed(parsedChild.value) : failWith(errors);
}
function restrictResources(parent, requestedChild) {
  const values = materializeTwo(parent, requestedChild, "/authority/resources", "/restrictions/resources");
  return values.ok ? restrictResourcesSnapshot(values.value[0], values.value[1]) : values;
}
function parseRevocationRequirement(value, path) {
  if (!isRecord2(value) || !hasOnlyKeys(value, ["maxStatusStalenessMs"])) {
    return fail2("VAGP_INVALID_REVOCATION_REQUIREMENT", path, "Revocation requirement must contain only maxStatusStalenessMs");
  }
  const staleness = value["maxStatusStalenessMs"];
  if (typeof staleness !== "number" || !Number.isSafeInteger(staleness) || Object.is(staleness, -0) || staleness < 0) {
    return fail2("VAGP_INVALID_REVOCATION_REQUIREMENT", `${path}/maxStatusStalenessMs`, "Revocation freshness must be a finite non-negative safe integer");
  }
  return succeed(Object.freeze({ maxStatusStalenessMs: staleness }));
}
function restrictRevocation(parent, requestedChild) {
  const values = materializeTwo(parent, requestedChild, "/authority/revocation", "/restrictions/revocation");
  if (!values.ok) {
    return values;
  }
  const [parentValue, childValue] = values.value;
  if (parentValue === void 0 && childValue === void 0) {
    return succeed(void 0);
  }
  if (parentValue === void 0) {
    return fail2("VAGP_ATTENUATION_REVOCABILITY_ADDED", "/restrictions/revocation", "v0.1 and v0.2 revocation semantics must not be mixed in one delegation hop");
  }
  if (childValue === void 0) {
    return fail2("VAGP_ATTENUATION_REVOCABILITY_REMOVED", "/restrictions/revocation", "A child authority cannot remove a parent revocation requirement");
  }
  const parentRevocation = parseRevocationRequirement(parentValue, "/authority/revocation");
  if (!parentRevocation.ok) {
    return parentRevocation;
  }
  const childRevocation = parseRevocationRequirement(childValue, "/restrictions/revocation");
  if (!childRevocation.ok) {
    return childRevocation;
  }
  if (childRevocation.value.maxStatusStalenessMs > parentRevocation.value.maxStatusStalenessMs) {
    return fail2("VAGP_ATTENUATION_REVOCATION_LATENCY_WIDENED", "/restrictions/revocation/maxStatusStalenessMs", "A child authority cannot widen the parent maximum status staleness");
  }
  return succeed(childRevocation.value);
}
function canonicalConstraintName(value) {
  return value !== "constructor" && value !== "prototype" && /^[a-z][a-z0-9-]{0,63}$/.test(value);
}
function parseConstraint(value, path) {
  if (!isRecord2(value) || typeof value["type"] !== "string") {
    return fail2("VAGP_UNKNOWN_CONSTRAINT_TYPE", `${path}/type`, "Constraint type is required");
  }
  switch (value["type"]) {
    case "exact": {
      if (!hasOnlyKeys(value, ["type", "value"])) {
        return fail2("VAGP_UNKNOWN_PROPERTY", path, "Exact constraint has unknown properties");
      }
      const exactValue = value["value"];
      if (typeof exactValue !== "string" && typeof exactValue !== "number" && typeof exactValue !== "boolean") {
        return fail2("VAGP_UNKNOWN_CONSTRAINT_TYPE", `${path}/value`, "Exact value must be scalar");
      }
      if (typeof exactValue === "number" && !Number.isFinite(exactValue)) {
        return fail2("VAGP_UNKNOWN_CONSTRAINT_TYPE", `${path}/value`, "Exact numeric values must be finite");
      }
      return succeed(Object.freeze({
        type: "exact",
        value: typeof exactValue === "number" && Object.is(exactValue, -0) ? 0 : exactValue
      }));
    }
    case "enum": {
      if (!hasOnlyKeys(value, ["type", "allowed"])) {
        return fail2("VAGP_UNKNOWN_PROPERTY", path, "Enum constraint has unknown properties");
      }
      const allowed = value["allowed"];
      if (!Array.isArray(allowed) || allowed.length === 0 || !allowed.every((item) => typeof item === "string")) {
        return fail2("VAGP_UNKNOWN_CONSTRAINT_TYPE", `${path}/allowed`, "Enum allowed must be non-empty strings");
      }
      const first = allowed[0];
      if (typeof first !== "string") {
        return fail2("VAGP_UNKNOWN_CONSTRAINT_TYPE", `${path}/allowed`, "Enum allowed must not be empty");
      }
      if (new Set(allowed).size !== allowed.length) {
        return fail2("VAGP_UNKNOWN_CONSTRAINT_TYPE", `${path}/allowed`, "Enum allowed values must be unique");
      }
      const sorted = [...allowed].sort();
      const sortedFirst = sorted[0];
      if (sortedFirst === void 0) {
        return fail2("VAGP_UNKNOWN_CONSTRAINT_TYPE", `${path}/allowed`, "Enum allowed values must not be empty");
      }
      const canonicalAllowed = Object.freeze([
        sortedFirst,
        ...sorted.slice(1)
      ]);
      return succeed(Object.freeze({
        type: "enum",
        allowed: canonicalAllowed
      }));
    }
    case "numericRange": {
      if (!hasOnlyKeys(value, ["type", "min", "max"])) {
        return fail2("VAGP_UNKNOWN_PROPERTY", path, "Numeric range has unknown properties");
      }
      const minimum = value["min"];
      const maximum = value["max"];
      if (minimum !== null && (typeof minimum !== "number" || !Number.isFinite(minimum)) || maximum !== null && (typeof maximum !== "number" || !Number.isFinite(maximum)) || minimum === null && maximum === null || typeof minimum === "number" && typeof maximum === "number" && minimum > maximum) {
        return fail2("VAGP_UNKNOWN_CONSTRAINT_TYPE", path, "Numeric range bounds are invalid");
      }
      if (typeof minimum === "number") {
        return succeed(Object.freeze({
          type: "numericRange",
          min: Object.is(minimum, -0) ? 0 : minimum,
          max: typeof maximum === "number" && Object.is(maximum, -0) ? 0 : maximum
        }));
      }
      if (typeof maximum === "number") {
        return succeed(Object.freeze({
          type: "numericRange",
          min: null,
          max: Object.is(maximum, -0) ? 0 : maximum
        }));
      }
      return fail2("VAGP_UNKNOWN_CONSTRAINT_TYPE", path, "Numeric range requires a finite bound");
    }
    default:
      return fail2("VAGP_UNKNOWN_CONSTRAINT_TYPE", `${path}/type`, "Unknown constraint type");
  }
}
function parseConstraintMap(value, path) {
  if (!isRecord2(value)) {
    return fail2("VAGP_UNKNOWN_CONSTRAINT_TYPE", path, "Constraints must be an object");
  }
  const result = /* @__PURE__ */ Object.create(null);
  const errors = [];
  for (const name of Object.keys(value)) {
    if (!canonicalConstraintName(name)) {
      errors.push({
        code: "VAGP_UNKNOWN_CONSTRAINT_TYPE",
        path: `${path}/${name}`,
        message: "Constraint name is not canonical"
      });
      continue;
    }
    const parsed = parseConstraint(value[name], `${path}/${name}`);
    if (parsed.ok) {
      result[name] = parsed.value;
    } else {
      errors.push(...parsed.errors);
    }
  }
  return errors.length === 0 ? succeed(Object.freeze(result)) : failWith(errors);
}
function constraintContained(parent, child) {
  if (parent.type !== child.type) {
    return false;
  }
  switch (parent.type) {
    case "exact":
      return child.type === "exact" && child.value === parent.value;
    case "enum":
      return child.type === "enum" && child.allowed.every((item) => parent.allowed.includes(item));
    case "numericRange":
      return child.type === "numericRange" && (parent.min === null || child.min !== null && child.min >= parent.min) && (parent.max === null || child.max !== null && child.max <= parent.max);
  }
}
function compareConstraintMaps(parent, child) {
  const values = materializeTwo(parent, child, "/parent/constraints", "/candidate/constraints");
  if (!values.ok)
    return values;
  const parentMap = parseConstraintMap(values.value[0], "/parent/constraints");
  if (!parentMap.ok)
    return parentMap;
  const childMap = parseConstraintMap(values.value[1], "/candidate/constraints");
  if (!childMap.ok)
    return childMap;
  const errors = [];
  for (const [name, parentConstraint] of Object.entries(parentMap.value)) {
    if (!Object.hasOwn(childMap.value, name)) {
      errors.push({
        code: "VAGP_ATTENUATION_CONSTRAINT_REMOVED",
        path: `/candidate/constraints/${name}`,
        message: "Candidate must retain every parent constraint"
      });
      continue;
    }
    const candidate = childMap.value[name];
    if (candidate === void 0 || !constraintContained(parentConstraint, candidate)) {
      errors.push({
        code: "VAGP_ATTENUATION_CONSTRAINT_EXPANDED",
        path: `/candidate/constraints/${name}`,
        message: "Candidate constraint expands parent authority"
      });
    }
  }
  return errors.length === 0 ? succeed(true) : failWith(errors);
}
function parseFinancial(value, path) {
  if (value === null)
    return succeed(null);
  if (!isRecord2(value) || !hasOnlyKeys(value, ["currency", "maxTransaction", "maxAggregate"])) {
    return fail2("VAGP_ATTENUATION_FINANCIAL_INVALID", path, "Financial authority has an invalid shape");
  }
  const currency = value["currency"];
  const transaction = value["maxTransaction"];
  const aggregate = value["maxAggregate"];
  if (typeof currency !== "string" || !/^[A-Z]{3}$/.test(currency)) {
    return fail2("VAGP_INVALID_CURRENCY", `${path}/currency`, "Currency must be three uppercase ASCII letters");
  }
  const validLimit = (limit) => limit === null || typeof limit === "number" && Number.isFinite(limit) && limit >= 0;
  if (!validLimit(transaction) || !validLimit(aggregate) || transaction === null && aggregate === null) {
    return fail2("VAGP_ATTENUATION_FINANCIAL_INVALID", path, "Financial limits must be non-negative and at least one must be finite");
  }
  return transaction !== null ? succeed(Object.freeze({
    currency,
    maxTransaction: Object.is(transaction, -0) ? 0 : transaction,
    maxAggregate: aggregate !== null && Object.is(aggregate, -0) ? 0 : aggregate
  })) : succeed(Object.freeze({
    currency,
    maxTransaction: null,
    maxAggregate: Object.is(aggregate, -0) ? 0 : aggregate
  }));
}
function boundContained(parent, child) {
  return parent === null || child !== null && child <= parent;
}
function restrictFinancial(parent, requestedChild) {
  const values = materializeTwo(parent, requestedChild, "/authority/financial", "/restrictions/financial");
  if (!values.ok)
    return values;
  const parsedParent = parseFinancial(values.value[0], "/authority/financial");
  if (!parsedParent.ok)
    return parsedParent;
  const parsedChild = parseFinancial(values.value[1], "/restrictions/financial");
  if (!parsedChild.ok)
    return parsedChild;
  if (parsedChild.value === null)
    return parsedChild;
  if (parsedParent.value === null || parsedParent.value.currency !== parsedChild.value.currency || !boundContained(parsedParent.value.maxTransaction, parsedChild.value.maxTransaction) || !boundContained(parsedParent.value.maxAggregate, parsedChild.value.maxAggregate)) {
    return fail2("VAGP_ATTENUATION_FINANCIAL_EXPANDED", "/restrictions/financial", "Requested financial authority expands the parent");
  }
  return parsedChild;
}
function parseFinancialApplicability(value, path) {
  if (!isRecord2(value) || !hasOnlyKeys(value, ["requiredActions"])) {
    return fail2("VAGP_INVALID_FINANCIAL_APPLICABILITY", path, "Financial applicability must contain only requiredActions");
  }
  const requiredActions = value["requiredActions"];
  if (!Array.isArray(requiredActions)) {
    return fail2("VAGP_INVALID_FINANCIAL_APPLICABILITY", `${path}/requiredActions`, "Required financial actions must be an array");
  }
  const duplicates = duplicateIndexes(requiredActions, (action) => typeof action === "string" ? action : JSON.stringify(action));
  if (duplicates.length > 0) {
    return fail2("VAGP_INVALID_FINANCIAL_APPLICABILITY", `${path}/requiredActions/${String(duplicates[0])}`, "Required financial actions must be unique");
  }
  const parsed = [];
  const errors = [];
  requiredActions.forEach((pattern, index) => {
    const result = parseActionPatternSnapshot(pattern, `${path}/requiredActions/${String(index)}`);
    if (result.ok && typeof pattern === "string") {
      parsed.push({ value: pattern, parsed: result.value });
    } else if (!result.ok) {
      errors.push(...result.errors);
    }
  });
  if (errors.length > 0) {
    return failWith(errors);
  }
  const sorted = parsed.toSorted((left, right) => left.value < right.value ? -1 : left.value > right.value ? 1 : 0);
  const canonical = sorted.filter((candidate, candidateIndex) => !sorted.some((parent, parentIndex) => parentIndex !== candidateIndex && parsedActionPatternContains(parent.parsed, candidate.parsed))).map((entry) => entry.value);
  return succeed(Object.freeze({
    requiredActions: Object.freeze(canonical)
  }));
}
function restrictFinancialApplicability(parent, requestedChild) {
  const values = materializeTwo(parent, requestedChild, "/authority/financialApplicability", "/restrictions/financialApplicability");
  if (!values.ok)
    return values;
  const [parentValue, childValue] = values.value;
  if (parentValue === void 0 && childValue === void 0) {
    return succeed(void 0);
  }
  if (parentValue === void 0) {
    return fail2("VAGP_ATTENUATION_FINANCIAL_APPLICABILITY_ADDED", "/restrictions/financialApplicability", "v0.1 and v0.2 financial-applicability semantics must not be mixed in one delegation hop");
  }
  if (childValue === void 0) {
    return fail2("VAGP_ATTENUATION_FINANCIAL_APPLICABILITY_REMOVED", "/restrictions/financialApplicability", "A child authority cannot remove a parent financial-applicability requirement");
  }
  const parentApplicability = parseFinancialApplicability(parentValue, "/authority/financialApplicability");
  if (!parentApplicability.ok)
    return parentApplicability;
  const childApplicability = parseFinancialApplicability(childValue, "/restrictions/financialApplicability");
  if (!childApplicability.ok)
    return childApplicability;
  const parentPatterns = parentApplicability.value.requiredActions.map((pattern) => {
    const parsed = parseActionPatternSnapshot(pattern, "/authority/financialApplicability/requiredActions");
    if (!parsed.ok)
      throw new Error("canonical parent pattern invalid");
    return { value: pattern, parsed: parsed.value };
  });
  const childPatterns = childApplicability.value.requiredActions.map((pattern) => {
    const parsed = parseActionPatternSnapshot(pattern, "/restrictions/financialApplicability/requiredActions");
    if (!parsed.ok)
      throw new Error("canonical child pattern invalid");
    return { value: pattern, parsed: parsed.value };
  });
  const weakened = parentPatterns.find((parentPattern) => !childPatterns.some((childPattern) => parsedActionPatternContains(childPattern.parsed, parentPattern.parsed)));
  if (weakened !== void 0) {
    return fail2("VAGP_ATTENUATION_FINANCIAL_APPLICABILITY_WEAKENED", "/restrictions/financialApplicability/requiredActions", "A child authority cannot weaken a parent financial-required action classification");
  }
  return childApplicability;
}
function parseValidity(value, path) {
  if (!isRecord2(value) || !hasOnlyKeys(value, ["notBefore", "notAfter"])) {
    return fail2("VAGP_INVALID_TIMESTAMP", path, "Validity must contain notBefore and notAfter");
  }
  const notBefore = parseCanonicalTimestamp(value["notBefore"]);
  const notAfter = parseCanonicalTimestamp(value["notAfter"]);
  if (!notBefore.valid || !notAfter.valid || notBefore.epochMilliseconds > notAfter.epochMilliseconds) {
    return fail2("VAGP_INVALID_TIMESTAMP", path, "Validity timestamps must be canonical and ordered");
  }
  return succeed(Object.freeze({
    notBefore: value["notBefore"],
    notAfter: value["notAfter"]
  }));
}
function restrictValidity(parent, requestedChild) {
  const values = materializeTwo(parent, requestedChild, "/authority/validity", "/restrictions/validity");
  if (!values.ok)
    return values;
  const parsedParent = parseValidity(values.value[0], "/authority/validity");
  if (!parsedParent.ok)
    return parsedParent;
  const parsedChild = parseValidity(values.value[1], "/restrictions/validity");
  if (!parsedChild.ok)
    return parsedChild;
  const parentStart = parseCanonicalTimestamp(parsedParent.value.notBefore);
  const parentEnd = parseCanonicalTimestamp(parsedParent.value.notAfter);
  const childStart = parseCanonicalTimestamp(parsedChild.value.notBefore);
  const childEnd = parseCanonicalTimestamp(parsedChild.value.notAfter);
  if (!parentStart.valid || !parentEnd.valid || !childStart.valid || !childEnd.valid) {
    return fail2("VAGP_INVALID_TIMESTAMP", "/restrictions/validity", "Validity timestamps are invalid");
  }
  return childStart.epochMilliseconds >= parentStart.epochMilliseconds && childEnd.epochMilliseconds <= parentEnd.epochMilliseconds ? parsedChild : fail2("VAGP_ATTENUATION_VALIDITY_EXPANDED", "/restrictions/validity", "Requested validity expands the parent");
}
var autonomyRank = Object.freeze({
  PROHIBITED: 0,
  HUMAN_CONTROLLED: 1,
  BOUNDED_AUTONOMOUS: 2,
  AUTONOMOUS: 3
});
function parseAutonomy(value, path) {
  if (!isRecord2(value) || !hasOnlyKeys(value, ["mode"])) {
    return fail2("VAGP_INVALID_AUTONOMY_MODE", path, "Autonomy must contain only mode");
  }
  const mode = value["mode"];
  if (typeof mode !== "string" || !Object.hasOwn(autonomyRank, mode)) {
    return fail2("VAGP_INVALID_AUTONOMY_MODE", `${path}/mode`, "Unknown autonomy mode");
  }
  return succeed(Object.freeze({ mode }));
}
function restrictAutonomy(parent, requestedChild) {
  const values = materializeTwo(parent, requestedChild, "/authority/autonomy", "/restrictions/autonomy");
  if (!values.ok)
    return values;
  const parsedParent = parseAutonomy(values.value[0], "/authority/autonomy");
  if (!parsedParent.ok)
    return parsedParent;
  const parsedChild = parseAutonomy(values.value[1], "/restrictions/autonomy");
  if (!parsedChild.ok)
    return parsedChild;
  return autonomyRank[parsedChild.value.mode] <= autonomyRank[parsedParent.value.mode] ? parsedChild : fail2("VAGP_ATTENUATION_AUTONOMY_EXPANDED", "/restrictions/autonomy/mode", "Requested autonomy expands the parent");
}
var assuranceRank = Object.freeze({
  A1: 1,
  A2: 2,
  A3: 3,
  A4: 4,
  A5: 5
});
function parseAssurance(value, path) {
  if (!isRecord2(value) || !hasOnlyKeys(value, ["minimum"])) {
    return fail2("VAGP_INVALID_ASSURANCE_LEVEL", path, "Assurance must contain only minimum");
  }
  const minimum = value["minimum"];
  if (typeof minimum !== "string" || !Object.hasOwn(assuranceRank, minimum)) {
    return fail2("VAGP_INVALID_ASSURANCE_LEVEL", `${path}/minimum`, "Unknown assurance level");
  }
  return succeed(Object.freeze({ minimum }));
}
function increaseAssurance(parent, requestedChild) {
  const values = materializeTwo(parent, requestedChild, "/authority/assurance", "/restrictions/assurance");
  if (!values.ok)
    return values;
  const parsedParent = parseAssurance(values.value[0], "/authority/assurance");
  if (!parsedParent.ok)
    return parsedParent;
  const parsedChild = parseAssurance(values.value[1], "/restrictions/assurance");
  if (!parsedChild.ok)
    return parsedChild;
  return assuranceRank[parsedChild.value.minimum] >= assuranceRank[parsedParent.value.minimum] ? parsedChild : fail2("VAGP_ATTENUATION_ASSURANCE_REDUCED", "/restrictions/assurance/minimum", "Requested assurance is lower than the parent");
}
function parseDelegation(value, path) {
  if (!isRecord2(value) || !hasOnlyKeys(value, ["allowed", "remainingDepth"])) {
    return fail2("VAGP_INVALID_DELEGATION", path, "Delegation must contain allowed and remainingDepth");
  }
  if (typeof value["allowed"] !== "boolean") {
    return fail2("VAGP_INVALID_DELEGATION", `${path}/allowed`, "Delegation allowed must be boolean");
  }
  const depth = value["remainingDepth"];
  if (typeof depth !== "number" || !Number.isSafeInteger(depth) || Object.is(depth, -0) || depth < 0 || depth > VAGP_MAX_DELEGATION_DEPTH) {
    return fail2("VAGP_INVALID_DELEGATION_DEPTH", `${path}/remainingDepth`, "Delegation depth must be an integer from 0 through 32");
  }
  return succeed(Object.freeze({ allowed: value["allowed"], remainingDepth: depth }));
}
function delegationIsNarrowerOrEqual(parent, candidate) {
  const values = materializeTwo(parent, candidate, "/parent/delegation", "/candidate/delegation");
  if (!values.ok)
    return values;
  const parsedParent = parseDelegation(values.value[0], "/parent/delegation");
  if (!parsedParent.ok)
    return parsedParent;
  const parsedCandidate = parseDelegation(values.value[1], "/candidate/delegation");
  if (!parsedCandidate.ok)
    return parsedCandidate;
  if (!parsedParent.value.allowed && parsedCandidate.value.allowed || parsedCandidate.value.remainingDepth > parsedParent.value.remainingDepth) {
    return fail2("VAGP_DELEGATION_DEPTH_EXCEEDED", "/candidate/delegation", "Candidate delegation expands the parent");
  }
  return parsedCandidate;
}

// ../../packages/attenuation/dist/comparison.js
function compareAgentStateAndCapabilities(parent, candidate) {
  const parentV03 = "agentState" in parent.authority;
  const childV03 = "agentState" in candidate.authority;
  if (parentV03 !== childV03) {
    return fail2("VAGP_INVALID_AGENT_STATE_BINDING", "/candidate/agentState", "VAGP 0.3 Agent state semantics cannot be added or removed across a delegation edge");
  }
  if (!parentV03 || !childV03)
    return succeed(true);
  if (candidate.authority.agentState.maxStateStalenessMs > parent.authority.agentState.maxStateStalenessMs) {
    return fail2("VAGP_ATTENUATION_AGENT_STATE_FRESHNESS_WIDENED", "/candidate/agentState/maxStateStalenessMs", "A child authority cannot widen parent Agent state freshness");
  }
  const parentCapabilities = new Set(parent.authority.capabilities.map((value) => JSON.stringify([value.id, value.version])));
  const expandedIndex = candidate.authority.capabilities.findIndex((value) => !parentCapabilities.has(JSON.stringify([value.id, value.version])));
  return expandedIndex < 0 ? succeed(true) : fail2("VAGP_ATTENUATION_CAPABILITY_EXPANDED", `/candidate/capabilities/${String(expandedIndex)}`, "A child authority cannot add a capability absent from its parent");
}
function collectFailure(result, errors) {
  if (!result.ok) {
    errors.push(...result.errors);
  }
}
function compareSnapshots(parent, candidate) {
  const errors = [];
  collectFailure(restrictActions(parent.authority.actions, candidate.authority.actions), errors);
  collectFailure(compareAgentStateAndCapabilities(parent, candidate), errors);
  collectFailure(restrictResources(parent.authority.resources, candidate.authority.resources), errors);
  collectFailure(compareConstraintMaps(parent.authority.constraints, candidate.authority.constraints), errors);
  collectFailure(restrictFinancial(parent.authority.financial, candidate.authority.financial), errors);
  collectFailure(restrictFinancialApplicability("financialApplicability" in parent.authority ? parent.authority.financialApplicability : void 0, "financialApplicability" in candidate.authority ? candidate.authority.financialApplicability : void 0), errors);
  collectFailure(restrictValidity(parent.validity, candidate.validity), errors);
  collectFailure(restrictAutonomy(parent.authority.autonomy, candidate.authority.autonomy), errors);
  collectFailure(increaseAssurance(parent.authority.assurance, candidate.authority.assurance), errors);
  collectFailure(delegationIsNarrowerOrEqual(parent.authority.delegation, candidate.authority.delegation), errors);
  collectFailure(restrictRevocation("revocation" in parent.authority ? parent.authority.revocation : void 0, "revocation" in candidate.authority ? candidate.authority.revocation : void 0), errors);
  return errors.length === 0 ? succeed(true) : failWith(errors);
}
function isValidSingleHopDerivation(parent, child) {
  const parentResult = validateAuthorityScope2(parent);
  if (!parentResult.ok) {
    return parentResult;
  }
  const childResult = validateAuthorityScope2(child);
  if (!childResult.ok) {
    return childResult;
  }
  const comparison = compareSnapshots(parentResult.value, childResult.value);
  if (!comparison.ok) {
    return comparison;
  }
  const parentDelegation = parentResult.value.authority.delegation;
  const childDelegation = childResult.value.authority.delegation;
  if (!parentDelegation.allowed) {
    return fail2("VAGP_DELEGATION_NOT_ALLOWED", "/authority/delegation/allowed", "Parent authority does not permit a delegation edge");
  }
  if (parentDelegation.remainingDepth === 0) {
    return fail2("VAGP_DELEGATION_DEPTH_EXCEEDED", "/authority/delegation/remainingDepth", "Parent authority has no remaining delegation depth");
  }
  if (childDelegation.remainingDepth > parentDelegation.remainingDepth - 1) {
    return fail2("VAGP_DELEGATION_DEPTH_EXCEEDED", "/candidate/delegation/remainingDepth", "A single-hop child must strictly reduce remaining delegation depth");
  }
  return succeed(true);
}

// ../../packages/authority-graph/dist/graph.js
var EMPTY_MANDATES = Object.freeze([]);
var constructedGraphs = /* @__PURE__ */ new WeakSet();
var SHA256_INITIAL_STATE = Object.freeze([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
var SHA256_ROUND_CONSTANTS = Object.freeze([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
function lexicographic(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}
function freezeIndex(entries) {
  const result = /* @__PURE__ */ new Map();
  for (const [id, mandates] of entries) {
    result.set(id, Object.freeze([...mandates].sort((left, right) => lexicographic(left.id, right.id))));
  }
  return result;
}
var ImmutableAuthorityGraph = class {
  authorityDomainId;
  principals;
  agents;
  mandates;
  #principalById;
  #agentById;
  #mandateById;
  #parentByMandateId;
  #childrenByMandateId;
  #mandatesForAgent;
  #mandatesIssuedByAgent;
  #rootMandates;
  #canonicalValue;
  constructor(principals, agents, mandates) {
    this.principals = principals;
    this.agents = agents;
    this.mandates = mandates;
    this.#principalById = new Map(principals.map((principal) => [principal.id, principal]));
    this.#agentById = new Map(agents.map((agent) => [agent.id, agent]));
    this.#mandateById = new Map(mandates.map((mandate2) => [mandate2.id, mandate2]));
    const parents = /* @__PURE__ */ new Map();
    const children = /* @__PURE__ */ new Map();
    const forAgent = /* @__PURE__ */ new Map();
    const issuedByAgent = /* @__PURE__ */ new Map();
    const roots = [];
    for (const mandate2 of mandates) {
      const received = forAgent.get(mandate2.subject.id) ?? [];
      received.push(mandate2);
      forAgent.set(mandate2.subject.id, received);
      if (mandate2.parentMandate === null) {
        roots.push(mandate2);
        continue;
      }
      const parent = this.#mandateById.get(mandate2.parentMandate);
      if (parent !== void 0) {
        parents.set(mandate2.id, parent);
        const descendants = children.get(parent.id) ?? [];
        descendants.push(mandate2);
        children.set(parent.id, descendants);
      }
      const issued = issuedByAgent.get(mandate2.issuer.id) ?? [];
      issued.push(mandate2);
      issuedByAgent.set(mandate2.issuer.id, issued);
    }
    this.#parentByMandateId = parents;
    this.#childrenByMandateId = freezeIndex(children);
    this.#mandatesForAgent = freezeIndex(forAgent);
    this.#mandatesIssuedByAgent = freezeIndex(issuedByAgent);
    this.#rootMandates = Object.freeze(roots);
    this.#canonicalValue = Object.freeze({
      principals: this.principals,
      agents: this.agents,
      mandates: this.mandates
    });
    this.authorityDomainId = authorityDomainId(this.#canonicalValue);
    constructedGraphs.add(this);
    Object.freeze(this);
  }
  getPrincipal(id) {
    return this.#principalById.get(id);
  }
  getAgent(id) {
    return this.#agentById.get(id);
  }
  getMandate(id) {
    return this.#mandateById.get(id);
  }
  getParentMandate(mandateId) {
    return this.#parentByMandateId.get(mandateId);
  }
  getChildMandates(mandateId) {
    return this.#childrenByMandateId.get(mandateId) ?? EMPTY_MANDATES;
  }
  getMandatesForAgent(agentId) {
    return this.#mandatesForAgent.get(agentId) ?? EMPTY_MANDATES;
  }
  getMandatesIssuedByAgent(agentId) {
    return this.#mandatesIssuedByAgent.get(agentId) ?? EMPTY_MANDATES;
  }
  getRootMandates() {
    return this.#rootMandates;
  }
  toCanonicalValue() {
    return this.#canonicalValue;
  }
  toJSON() {
    return this.#canonicalValue;
  }
};
Object.freeze(ImmutableAuthorityGraph.prototype);
function createAuthorityGraph(principals, agents, mandates) {
  return new ImmutableAuthorityGraph(principals, agents, mandates);
}
function canonicalJson(value) {
  if (value === null)
    return "null";
  if (typeof value === "string")
    return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((entry) => canonicalJson(entry)).join(",")}]`;
  }
  if (typeof value === "object") {
    const record = value;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`).join(",")}}`;
  }
  return JSON.stringify(null);
}
function canonicalAuthorityDomainJson(value) {
  return canonicalJson({
    agents: canonicalEntries(value.agents),
    mandates: canonicalEntries(value.mandates),
    principals: canonicalEntries(value.principals)
  });
}
function canonicalEntries(entries) {
  return Object.freeze([...entries].sort((left, right) => lexicographic(canonicalJson(left), canonicalJson(right))));
}
function utf8Bytes(value) {
  const bytes = [];
  for (const symbol of value) {
    const codePoint = symbol.codePointAt(0) ?? 0;
    if (codePoint <= 127) {
      bytes.push(codePoint);
    } else if (codePoint <= 2047) {
      bytes.push(192 | codePoint >>> 6, 128 | codePoint & 63);
    } else if (codePoint <= 65535) {
      bytes.push(224 | codePoint >>> 12, 128 | codePoint >>> 6 & 63, 128 | codePoint & 63);
    } else {
      bytes.push(240 | codePoint >>> 18, 128 | codePoint >>> 12 & 63, 128 | codePoint >>> 6 & 63, 128 | codePoint & 63);
    }
  }
  return bytes;
}
function rotateRight(value, bits) {
  return value >>> bits | value << 32 - bits;
}
function sha256Hex(value) {
  const bytes = utf8Bytes(value);
  const bitLength = bytes.length * 8;
  bytes.push(128);
  while (bytes.length % 64 !== 56) {
    bytes.push(0);
  }
  const high = Math.floor(bitLength / 4294967296);
  const low = bitLength >>> 0;
  for (let shift = 24; shift >= 0; shift -= 8) {
    bytes.push(high >>> shift & 255);
  }
  for (let shift = 24; shift >= 0; shift -= 8) {
    bytes.push(low >>> shift & 255);
  }
  const state = [...SHA256_INITIAL_STATE];
  const words = new Array(64).fill(0);
  for (let chunk = 0; chunk < bytes.length; chunk += 64) {
    for (let index = 0; index < 16; index += 1) {
      const offset = chunk + index * 4;
      words[index] = ((bytes[offset] ?? 0) << 24 | (bytes[offset + 1] ?? 0) << 16 | (bytes[offset + 2] ?? 0) << 8 | (bytes[offset + 3] ?? 0)) >>> 0;
    }
    for (let index = 16; index < 64; index += 1) {
      const word2 = words[index - 2] ?? 0;
      const word15 = words[index - 15] ?? 0;
      const sigma0 = rotateRight(word15, 7) ^ rotateRight(word15, 18) ^ word15 >>> 3;
      const sigma1 = rotateRight(word2, 17) ^ rotateRight(word2, 19) ^ word2 >>> 10;
      words[index] = (words[index - 16] ?? 0) + sigma0 + (words[index - 7] ?? 0) + sigma1 >>> 0;
    }
    let a = state[0] ?? 0;
    let b = state[1] ?? 0;
    let c = state[2] ?? 0;
    let d = state[3] ?? 0;
    let e = state[4] ?? 0;
    let f = state[5] ?? 0;
    let g = state[6] ?? 0;
    let h = state[7] ?? 0;
    for (let index = 0; index < 64; index += 1) {
      const sigma1 = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
      const choose = e & f ^ ~e & g;
      const temp1 = h + sigma1 + choose + (SHA256_ROUND_CONSTANTS[index] ?? 0) + (words[index] ?? 0) >>> 0;
      const sigma0 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
      const majority = a & b ^ a & c ^ b & c;
      const temp2 = sigma0 + majority >>> 0;
      h = g;
      g = f;
      f = e;
      e = d + temp1 >>> 0;
      d = c;
      c = b;
      b = a;
      a = temp1 + temp2 >>> 0;
    }
    state[0] = (state[0] ?? 0) + a >>> 0;
    state[1] = (state[1] ?? 0) + b >>> 0;
    state[2] = (state[2] ?? 0) + c >>> 0;
    state[3] = (state[3] ?? 0) + d >>> 0;
    state[4] = (state[4] ?? 0) + e >>> 0;
    state[5] = (state[5] ?? 0) + f >>> 0;
    state[6] = (state[6] ?? 0) + g >>> 0;
    state[7] = (state[7] ?? 0) + h >>> 0;
  }
  return state.map((word) => word.toString(16).padStart(8, "0")).join("");
}
function authorityDomainId(value) {
  const digest2 = sha256Hex(canonicalAuthorityDomainJson(value));
  return `vagp-authority-domain:sha256:${digest2}`;
}
function isAuthorityGraph(value) {
  return value !== null && typeof value === "object" && constructedGraphs.has(value);
}

// ../../packages/authority-graph/dist/types.js
var DEFAULT_AUTHORITY_GRAPH_LIMITS = Object.freeze({
  maxPrincipals: 1e3,
  maxAgents: 1e4,
  maxMandates: 5e4
});
var DEFAULT_CANDIDATE_PATH_SEARCH_LIMITS = Object.freeze({
  maxPathDepth: 33,
  maxPaths: 1e3,
  maxVisitedMandates: 5e4
});
var MAX_CANDIDATE_PATH_SEARCH_LIMITS = Object.freeze({
  maxPathDepth: 1024,
  maxPaths: 1e4,
  maxVisitedMandates: 1e5
});
var MAX_MANDATE_STATUS_RECORDS = 5e4;

// ../../packages/authority-graph/dist/build.js
var INPUT_KEYS = /* @__PURE__ */ new Set(["principals", "agents", "mandates"]);
var LIMIT_KEYS = /* @__PURE__ */ new Set(["maxPrincipals", "maxAgents", "maxMandates"]);
function lexicographic2(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}
function freezeCause(cause2) {
  return Object.freeze({
    code: cause2.code,
    path: cause2.path,
    message: cause2.message
  });
}
function freezeError(error4) {
  const frozen = { code: error4.code, message: error4.message };
  if (error4.path !== void 0)
    frozen.path = error4.path;
  if (error4.mandateId !== void 0)
    frozen.mandateId = error4.mandateId;
  if (error4.parentMandateId !== void 0) {
    frozen.parentMandateId = error4.parentMandateId;
  }
  if (error4.agentId !== void 0)
    frozen.agentId = error4.agentId;
  if (error4.principalId !== void 0)
    frozen.principalId = error4.principalId;
  if (error4.cause !== void 0) {
    frozen.cause = Object.freeze(error4.cause.map(freezeCause));
  }
  return Object.freeze(frozen);
}
function fail3(errors) {
  return Object.freeze({
    ok: false,
    errors: Object.freeze(errors.map(freezeError))
  });
}
function oneError(code, message, path) {
  return fail3([{ code, message, ...path === void 0 ? {} : { path } }]);
}
function inspectOwnData2(value, path, seen) {
  if (typeof value === "function" || typeof value === "symbol") {
    return {
      code: "VAGP_GRAPH_INPUT_MATERIALIZATION_FAILED",
      path,
      message: "Functions and symbols are not valid graph data"
    };
  }
  if (value === null || typeof value !== "object")
    return null;
  if (seen.has(value)) {
    return {
      code: "VAGP_GRAPH_INPUT_MATERIALIZATION_FAILED",
      path,
      message: "Cyclic input objects are not supported"
    };
  }
  seen.add(value);
  try {
    const array = Array.isArray(value);
    const prototype = Object.getPrototypeOf(value);
    const expectedPrototype = array ? Array.prototype : Object.prototype;
    if (prototype !== expectedPrototype && prototype !== null) {
      return {
        code: "VAGP_GRAPH_INPUT_MATERIALIZATION_FAILED",
        path,
        message: "Graph data must use a plain or null prototype"
      };
    }
    const keys = Reflect.ownKeys(value);
    const lengthDescriptor = array ? Reflect.getOwnPropertyDescriptor(value, "length") : void 0;
    const arrayLength = lengthDescriptor?.value;
    for (const key of keys) {
      if (array && key === "length")
        continue;
      if (typeof key === "symbol") {
        return {
          code: "VAGP_GRAPH_INPUT_MATERIALIZATION_FAILED",
          path,
          message: "Symbol graph properties are not permitted"
        };
      }
      if (array && (typeof arrayLength !== "number" || !/^(0|[1-9][0-9]*)$/.test(key) || Number(key) >= arrayLength)) {
        return {
          code: "VAGP_GRAPH_INVALID_INPUT",
          path: `${path}/${key}`,
          message: "Unknown array properties are not permitted"
        };
      }
      const descriptor = Reflect.getOwnPropertyDescriptor(value, key);
      if (descriptor === void 0 || !descriptor.enumerable) {
        return {
          code: "VAGP_GRAPH_INPUT_MATERIALIZATION_FAILED",
          path: `${path}/${key}`,
          message: "Hidden graph properties are not permitted"
        };
      }
      if (!Object.hasOwn(descriptor, "value")) {
        return {
          code: "VAGP_GRAPH_INPUT_MATERIALIZATION_FAILED",
          path: `${path}/${key}`,
          message: "Accessor graph properties are not permitted"
        };
      }
      const nested = inspectOwnData2(descriptor.value, `${path}/${key}`, seen);
      if (nested !== null)
        return nested;
    }
  } catch {
    return {
      code: "VAGP_GRAPH_INPUT_MATERIALIZATION_FAILED",
      path,
      message: "Graph input could not be inspected safely"
    };
  } finally {
    seen.delete(value);
  }
  return null;
}
function materialize(value, path) {
  const inspectionError = inspectOwnData2(value, path, /* @__PURE__ */ new WeakSet());
  if (inspectionError !== null)
    return fail3([inspectionError]);
  try {
    return Object.freeze({ ok: true, value: structuredClone(value) });
  } catch {
    return oneError("VAGP_GRAPH_INPUT_MATERIALIZATION_FAILED", "Graph input could not be materialized safely", path);
  }
}
function isFailure(value) {
  return value !== null && typeof value === "object" && Object.hasOwn(value, "ok") && value.ok === false;
}
function parseLimits(value) {
  if (value === void 0)
    return DEFAULT_AUTHORITY_GRAPH_LIMITS;
  const materialized = materialize(value, "/limits");
  if (!materialized.ok)
    return materialized;
  if (materialized.value === null || typeof materialized.value !== "object" || Array.isArray(materialized.value)) {
    return oneError("VAGP_GRAPH_INVALID_LIMITS", "Graph limits must be a plain object", "/limits");
  }
  const record = materialized.value;
  const unknown = Object.keys(record).filter((key) => !LIMIT_KEYS.has(key));
  if (unknown.length > 0) {
    return oneError("VAGP_GRAPH_INVALID_LIMITS", `Unknown graph limit: ${unknown[0] ?? ""}`, `/limits/${unknown[0] ?? ""}`);
  }
  const limits = {
    maxPrincipals: record["maxPrincipals"] ?? DEFAULT_AUTHORITY_GRAPH_LIMITS.maxPrincipals,
    maxAgents: record["maxAgents"] ?? DEFAULT_AUTHORITY_GRAPH_LIMITS.maxAgents,
    maxMandates: record["maxMandates"] ?? DEFAULT_AUTHORITY_GRAPH_LIMITS.maxMandates
  };
  for (const [name, limit] of Object.entries(limits)) {
    if (!Number.isSafeInteger(limit) || limit < 0) {
      return oneError("VAGP_GRAPH_INVALID_LIMITS", "Graph limits must be non-negative safe integers", `/limits/${name}`);
    }
  }
  return Object.freeze(limits);
}
function preflightInput(value, limits) {
  try {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      return oneError("VAGP_GRAPH_INVALID_INPUT", "Authority graph input must be an object", "/");
    }
    const keys = Reflect.ownKeys(value);
    if (keys.some((key) => typeof key !== "string" || !INPUT_KEYS.has(key)) || [...INPUT_KEYS].some((key) => !keys.includes(key))) {
      return oneError("VAGP_GRAPH_INVALID_INPUT", "Authority graph input must contain only principals, agents, and mandates", "/");
    }
    for (const [key, limit] of [
      ["principals", limits.maxPrincipals],
      ["agents", limits.maxAgents],
      ["mandates", limits.maxMandates]
    ]) {
      const descriptor = Reflect.getOwnPropertyDescriptor(value, key);
      if (descriptor === void 0 || !descriptor.enumerable || !Object.hasOwn(descriptor, "value") || !Array.isArray(descriptor.value)) {
        return oneError("VAGP_GRAPH_INVALID_INPUT", `${key} must be an own enumerable array`, `/${key}`);
      }
      const lengthDescriptor = Reflect.getOwnPropertyDescriptor(descriptor.value, "length");
      const length = lengthDescriptor?.value;
      if (typeof length !== "number" || !Number.isSafeInteger(length)) {
        return oneError("VAGP_GRAPH_INVALID_INPUT", `${key} must have a valid array length`, `/${key}`);
      }
      if (length > limit) {
        return oneError("VAGP_GRAPH_RESOURCE_LIMIT_EXCEEDED", `${key} exceeds the configured limit of ${String(limit)}`, `/${key}`);
      }
    }
  } catch {
    return oneError("VAGP_GRAPH_INPUT_MATERIALIZATION_FAILED", "Graph input could not be inspected safely", "/");
  }
  return null;
}
function unauthenticatedV03MandateError(input) {
  const mandatesDescriptor = Reflect.getOwnPropertyDescriptor(input, "mandates");
  if (mandatesDescriptor === void 0 || !Object.hasOwn(mandatesDescriptor, "value") || !Array.isArray(mandatesDescriptor.value)) {
    return null;
  }
  for (let index = 0; index < mandatesDescriptor.value.length; index += 1) {
    const entryDescriptor = Reflect.getOwnPropertyDescriptor(mandatesDescriptor.value, String(index));
    const entry = entryDescriptor?.value;
    if (entry === null || typeof entry !== "object" || Array.isArray(entry)) {
      continue;
    }
    const version = Reflect.getOwnPropertyDescriptor(entry, "vagp");
    if (version !== void 0 && Object.hasOwn(version, "value") && version.value === "0.3" && !isAdmittedMandateV03(entry)) {
      return oneError("VAGP_GRAPH_INVALID_MANDATE", "VAGP 0.3 mandates require authenticated proof admission before graph construction", `/mandates/${String(index)}/proof`);
    }
  }
  return null;
}
function isReference(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const record = value;
  return Object.keys(record).length === 1 && Object.hasOwn(record, "id") && typeof record["id"] === "string" && record["id"].length > 0;
}
function referenceErrors(values, kind) {
  const errors = [];
  for (const [index, value] of values.entries()) {
    if (!isReference(value)) {
      errors.push({
        code: kind === "principal" ? "VAGP_GRAPH_INVALID_PRINCIPAL" : "VAGP_GRAPH_INVALID_AGENT",
        path: `/${kind === "principal" ? "principals" : "agents"}/${String(index)}`,
        message: `${kind === "principal" ? "Principal" : "Agent"} references must contain only a non-empty id`
      });
    }
  }
  return errors;
}
function possibleMandateId(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return void 0;
  }
  const id = value["id"];
  return typeof id === "string" ? id : void 0;
}
function canonicalMandate(value) {
  const semantic = validateMandateSemantics(value);
  if (!semantic.valid) {
    return fail3([
      {
        code: "VAGP_GRAPH_INVALID_MANDATE",
        message: "Mandate semantic validation failed",
        mandateId: value.id,
        cause: semantic.errors
      }
    ]);
  }
  const scope = validateAuthorityScope2({
    authority: value.authority,
    validity: value.validity
  });
  if (!scope.ok) {
    return fail3([
      {
        code: "VAGP_GRAPH_INVALID_MANDATE",
        message: "Mandate authority validation failed",
        mandateId: value.id,
        cause: scope.errors
      }
    ]);
  }
  const proof = Object.freeze(value.proof.map((entry) => Object.freeze({
    type: entry.type,
    alg: entry.alg,
    kid: entry.kid,
    created: entry.created,
    value: entry.value
  })));
  return Object.freeze({
    vagp: value.vagp,
    type: value.type,
    id: value.id,
    issuer: Object.freeze({ id: value.issuer.id }),
    subject: Object.freeze({ id: value.subject.id }),
    parentMandate: value.parentMandate,
    authority: scope.value.authority,
    validity: scope.value.validity,
    statusRef: value.statusRef,
    proof
  });
}
function validateMandates(values) {
  const mandates = [];
  const errors = [];
  for (const value of values) {
    const structural = validateMandate(value);
    if (!structural.valid) {
      const mandateId = possibleMandateId(value);
      errors.push({
        code: "VAGP_GRAPH_INVALID_MANDATE",
        message: "Mandate structural validation failed",
        ...mandateId === void 0 ? {} : { mandateId },
        cause: structural.errors
      });
      continue;
    }
    const canonical = canonicalMandate(value);
    if (isFailure(canonical))
      errors.push(...canonical.errors);
    else
      mandates.push(canonical);
  }
  return errors.length > 0 ? fail3(errors) : mandates;
}
function duplicateErrors(principals, agents, mandates) {
  const errors = [];
  const seenPrincipals = /* @__PURE__ */ new Set();
  for (const principal of principals) {
    if (seenPrincipals.has(principal.id)) {
      errors.push({
        code: "VAGP_GRAPH_DUPLICATE_PRINCIPAL",
        message: "Principal IDs must be unique",
        principalId: principal.id
      });
    }
    seenPrincipals.add(principal.id);
  }
  const seenAgents = /* @__PURE__ */ new Set();
  for (const agent of agents) {
    if (seenAgents.has(agent.id)) {
      errors.push({
        code: "VAGP_GRAPH_DUPLICATE_AGENT",
        message: "Agent IDs must be unique",
        agentId: agent.id
      });
    }
    seenAgents.add(agent.id);
  }
  for (const id of [...seenPrincipals].sort(lexicographic2)) {
    if (seenAgents.has(id)) {
      errors.push({
        code: "VAGP_GRAPH_IDENTITY_ROLE_COLLISION",
        message: "An identifier cannot be declared as both Principal and Agent",
        principalId: id,
        agentId: id
      });
    }
  }
  const seenMandates = /* @__PURE__ */ new Set();
  for (const mandate2 of mandates) {
    if (seenMandates.has(mandate2.id)) {
      errors.push({
        code: "VAGP_GRAPH_DUPLICATE_MANDATE",
        message: "Mandate IDs must be unique",
        mandateId: mandate2.id
      });
    }
    seenMandates.add(mandate2.id);
  }
  return errors;
}
function relationshipErrors(principals, agents, mandates) {
  const errors = [];
  for (const mandate2 of [...mandates.values()].sort((left, right) => lexicographic2(left.id, right.id))) {
    if (!agents.has(mandate2.subject.id)) {
      errors.push({
        code: "VAGP_GRAPH_UNKNOWN_SUBJECT",
        message: "Mandate subject must be a declared Agent",
        mandateId: mandate2.id,
        agentId: mandate2.subject.id
      });
    }
    if (mandate2.parentMandate === null) {
      if (!principals.has(mandate2.issuer.id)) {
        errors.push({
          code: "VAGP_GRAPH_UNKNOWN_ISSUER",
          message: "Root Mandate issuer must be a declared Principal",
          mandateId: mandate2.id,
          principalId: mandate2.issuer.id
        });
      }
      continue;
    }
    if (mandate2.parentMandate === mandate2.id) {
      errors.push({
        code: "VAGP_GRAPH_SELF_PARENT",
        message: "A Mandate cannot name itself as parent",
        mandateId: mandate2.id,
        parentMandateId: mandate2.parentMandate
      });
      continue;
    }
    const parent = mandates.get(mandate2.parentMandate);
    if (parent === void 0) {
      errors.push({
        code: "VAGP_GRAPH_PARENT_NOT_FOUND",
        message: "Delegated Mandate parent does not exist",
        mandateId: mandate2.id,
        parentMandateId: mandate2.parentMandate
      });
      continue;
    }
    if (!agents.has(mandate2.issuer.id)) {
      errors.push({
        code: "VAGP_GRAPH_UNKNOWN_ISSUER",
        message: "Delegated Mandate issuer must be a declared Agent",
        mandateId: mandate2.id,
        agentId: mandate2.issuer.id
      });
      continue;
    }
    if (parent.subject.id !== mandate2.issuer.id) {
      errors.push({
        code: "VAGP_GRAPH_ISSUER_CONTINUITY_FAILED",
        message: "Delegated Mandate issuer must equal its parent subject",
        mandateId: mandate2.id,
        parentMandateId: parent.id,
        agentId: mandate2.issuer.id
      });
    }
  }
  return errors;
}
function cycleErrors(mandates) {
  const completed = /* @__PURE__ */ new Set();
  const errors = [];
  const ids = [...mandates.keys()].sort(lexicographic2);
  for (const start of ids) {
    if (completed.has(start))
      continue;
    const trail = [];
    const trailPositions = /* @__PURE__ */ new Map();
    let current = start;
    while (current !== null && !completed.has(current)) {
      const position = trailPositions.get(current);
      if (position !== void 0) {
        const cycle = trail.slice(position);
        const first = cycle[0];
        if (first !== void 0) {
          const parentMandateId = mandates.get(first)?.parentMandate;
          errors.push({
            code: "VAGP_GRAPH_CYCLE",
            message: `Mandate ancestry contains a cycle: ${cycle.join(" -> ")} -> ${first}`,
            mandateId: first,
            ...parentMandateId === null || parentMandateId === void 0 ? {} : { parentMandateId }
          });
        }
        break;
      }
      trailPositions.set(current, trail.length);
      trail.push(current);
      current = mandates.get(current)?.parentMandate ?? null;
    }
    for (const id of trail)
      completed.add(id);
  }
  return errors;
}
function edgeErrors(mandates) {
  const errors = [];
  for (const child of [...mandates.values()].sort((left, right) => lexicographic2(left.id, right.id))) {
    if (child.parentMandate === null)
      continue;
    const parent = mandates.get(child.parentMandate);
    if (parent === void 0)
      continue;
    const edge = isValidSingleHopDerivation({ authority: parent.authority, validity: parent.validity }, { authority: child.authority, validity: child.validity });
    if (!edge.ok) {
      errors.push({
        code: "VAGP_GRAPH_DELEGATION_INVALID",
        message: "Delegated Mandate is not a valid single-hop derivation",
        mandateId: child.id,
        parentMandateId: parent.id,
        cause: edge.errors
      });
    }
  }
  return errors;
}
function build(input, limitsInput) {
  const limits = parseLimits(limitsInput);
  if (isFailure(limits))
    return limits;
  const preflight2 = preflightInput(input, limits);
  if (preflight2 !== null)
    return preflight2;
  const admission = unauthenticatedV03MandateError(input);
  if (admission !== null)
    return admission;
  const materialized = materialize(input, "/");
  if (!materialized.ok)
    return materialized;
  const snapshot = materialized.value;
  const references = [
    ...referenceErrors(snapshot.principals, "principal"),
    ...referenceErrors(snapshot.agents, "agent")
  ];
  if (references.length > 0)
    return fail3(references);
  const principals = snapshot.principals;
  const agents = snapshot.agents;
  const mandateResult = validateMandates(snapshot.mandates);
  if (isFailure(mandateResult))
    return mandateResult;
  const duplicates = duplicateErrors(principals, agents, mandateResult);
  if (duplicates.length > 0)
    return fail3(duplicates);
  const principalMap = new Map(principals.map((value) => [value.id, value]));
  const agentMap = new Map(agents.map((value) => [value.id, value]));
  const mandateMap = new Map(mandateResult.map((value) => [value.id, value]));
  const relationships = relationshipErrors(principalMap, agentMap, mandateMap);
  if (relationships.length > 0)
    return fail3(relationships);
  const cycles = cycleErrors(mandateMap);
  if (cycles.length > 0)
    return fail3(cycles);
  const edges = edgeErrors(mandateMap);
  if (edges.length > 0)
    return fail3(edges);
  const canonicalPrincipals = Object.freeze([...principals].sort((left, right) => lexicographic2(left.id, right.id)).map((value) => Object.freeze({ id: value.id })));
  const canonicalAgents = Object.freeze([...agents].sort((left, right) => lexicographic2(left.id, right.id)).map((value) => Object.freeze({ id: value.id })));
  const canonicalMandates = Object.freeze([...mandateResult].sort((left, right) => lexicographic2(left.id, right.id)));
  return Object.freeze({
    ok: true,
    value: createAuthorityGraph(canonicalPrincipals, canonicalAgents, canonicalMandates)
  });
}
function buildAuthorityGraph(input, limits) {
  try {
    return build(input, limits);
  } catch {
    return oneError("VAGP_GRAPH_INPUT_MATERIALIZATION_FAILED", "Graph input could not be processed safely", "/");
  }
}

// ../../packages/authority-graph/dist/paths.js
var OPTION_KEYS = /* @__PURE__ */ new Set(["maxPathDepth", "maxPaths", "maxVisitedMandates"]);
function lexicographic3(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}
function freezeError2(error4) {
  const frozen = { code: error4.code, message: error4.message };
  if (error4.path !== void 0)
    frozen.path = error4.path;
  if (error4.mandateId !== void 0)
    frozen.mandateId = error4.mandateId;
  if (error4.parentMandateId !== void 0) {
    frozen.parentMandateId = error4.parentMandateId;
  }
  if (error4.agentId !== void 0)
    frozen.agentId = error4.agentId;
  if (error4.principalId !== void 0)
    frozen.principalId = error4.principalId;
  return Object.freeze(frozen);
}
function fail4(error4) {
  return Object.freeze({
    ok: false,
    errors: Object.freeze([freezeError2(error4)])
  });
}
function succeed2(paths) {
  return Object.freeze({ ok: true, value: Object.freeze([...paths]) });
}
function invalidPath(message, context = {}) {
  return Object.freeze({
    valid: false,
    errors: Object.freeze([
      freezeError2({ code: "VAGP_GRAPH_PATH_INVALID", message, ...context })
    ])
  });
}
function parseOptions(value) {
  if (value === void 0)
    return DEFAULT_CANDIDATE_PATH_SEARCH_LIMITS;
  try {
    const prototype = value !== null && typeof value === "object" ? Object.getPrototypeOf(value) : void 0;
    if (value === null || typeof value !== "object" || Array.isArray(value) || prototype !== Object.prototype && prototype !== null) {
      return fail4({
        code: "VAGP_GRAPH_QUERY_INVALID_OPTIONS",
        path: "/options",
        message: "Candidate path options must be a plain object"
      });
    }
    const keys = Reflect.ownKeys(value);
    if (keys.some((key) => typeof key !== "string" || !OPTION_KEYS.has(key))) {
      return fail4({
        code: "VAGP_GRAPH_QUERY_INVALID_OPTIONS",
        path: "/options",
        message: "Candidate path options contain an unknown property"
      });
    }
    const supplied = /* @__PURE__ */ new Map();
    for (const key of keys) {
      if (typeof key !== "string")
        continue;
      const descriptor = Reflect.getOwnPropertyDescriptor(value, key);
      if (descriptor === void 0 || !descriptor.enumerable || !Object.hasOwn(descriptor, "value")) {
        return fail4({
          code: "VAGP_GRAPH_QUERY_INVALID_OPTIONS",
          path: `/options/${key}`,
          message: "Candidate path options must use own enumerable data properties"
        });
      }
      supplied.set(key, descriptor.value);
    }
    const limits = Object.freeze({
      maxPathDepth: supplied.has("maxPathDepth") ? supplied.get("maxPathDepth") : DEFAULT_CANDIDATE_PATH_SEARCH_LIMITS.maxPathDepth,
      maxPaths: supplied.has("maxPaths") ? supplied.get("maxPaths") : DEFAULT_CANDIDATE_PATH_SEARCH_LIMITS.maxPaths,
      maxVisitedMandates: supplied.has("maxVisitedMandates") ? supplied.get("maxVisitedMandates") : DEFAULT_CANDIDATE_PATH_SEARCH_LIMITS.maxVisitedMandates
    });
    for (const key of OPTION_KEYS) {
      const limit = limits[key];
      const maximum = MAX_CANDIDATE_PATH_SEARCH_LIMITS[key];
      if (!Number.isSafeInteger(limit) || limit < 0 || limit > maximum) {
        return fail4({
          code: "VAGP_GRAPH_QUERY_INVALID_OPTIONS",
          path: `/options/${key}`,
          message: `${key} must be a non-negative safe integer no greater than ${String(maximum)}`
        });
      }
    }
    return limits;
  } catch {
    return fail4({
      code: "VAGP_GRAPH_QUERY_INVALID_OPTIONS",
      path: "/options",
      message: "Candidate path options could not be inspected safely"
    });
  }
}
function isFailure2(value) {
  return Object.hasOwn(value, "ok");
}
function pathKey(principalId, mandateIds, agentId) {
  return JSON.stringify({
    principal: principalId,
    mandates: mandateIds,
    agent: agentId
  });
}
function comparePaths(left, right) {
  const principalOrder = lexicographic3(left.principal.id, right.principal.id);
  if (principalOrder !== 0)
    return principalOrder;
  if (left.mandates.length !== right.mandates.length) {
    return left.mandates.length - right.mandates.length;
  }
  for (let index = 0; index < left.mandates.length; index += 1) {
    const leftId = left.mandates[index]?.id ?? "";
    const rightId = right.mandates[index]?.id ?? "";
    const mandateOrder = lexicographic3(leftId, rightId);
    if (mandateOrder !== 0)
      return mandateOrder;
  }
  return lexicographic3(left.key, right.key);
}
function createPath(graph, agentId, reversedMandates) {
  const mandates = Object.freeze([...reversedMandates].reverse());
  const root = mandates[0];
  const agent = graph.getAgent(agentId);
  if (root === void 0 || agent === void 0)
    return null;
  const principal = graph.getPrincipal(root.issuer.id);
  if (principal === void 0)
    return null;
  return Object.freeze({
    principal,
    agent,
    mandates,
    key: pathKey(principal.id, mandates.map((mandate2) => mandate2.id), agent.id)
  });
}
function discover(graphValue, principalIdValue, agentIdValue, optionsValue) {
  if (!isAuthorityGraph(graphValue)) {
    return fail4({
      code: "VAGP_GRAPH_QUERY_INVALID_GRAPH",
      message: "Candidate paths can only be discovered in a constructed AuthorityGraph"
    });
  }
  if (typeof agentIdValue !== "string" || agentIdValue.length === 0) {
    return fail4({
      code: "VAGP_GRAPH_QUERY_INVALID_ID",
      path: "/agentId",
      message: "Agent ID must be a non-empty string"
    });
  }
  const agent = graphValue.getAgent(agentIdValue);
  if (agent === void 0) {
    return fail4({
      code: "VAGP_GRAPH_QUERY_AGENT_NOT_FOUND",
      message: "Candidate path target must be a declared Agent",
      agentId: agentIdValue
    });
  }
  let principalId;
  if (principalIdValue !== void 0) {
    if (typeof principalIdValue !== "string" || principalIdValue.length === 0) {
      return fail4({
        code: "VAGP_GRAPH_QUERY_INVALID_ID",
        path: "/principalId",
        message: "Principal ID must be a non-empty string"
      });
    }
    if (graphValue.getPrincipal(principalIdValue) === void 0) {
      return fail4({
        code: "VAGP_GRAPH_QUERY_PRINCIPAL_NOT_FOUND",
        message: "Candidate path root filter must be a declared Principal",
        principalId: principalIdValue
      });
    }
    principalId = principalIdValue;
  }
  const limits = parseOptions(optionsValue);
  if (isFailure2(limits))
    return limits;
  const paths = [];
  const pathKeys = /* @__PURE__ */ new Set();
  let visitedMandates = 0;
  for (const leaf of graphValue.getMandatesForAgent(agent.id)) {
    const reversed = [];
    const ancestry = /* @__PURE__ */ new Set();
    let current = leaf;
    for (; ; ) {
      if (visitedMandates >= limits.maxVisitedMandates) {
        return fail4({
          code: "VAGP_GRAPH_PATH_VISIT_LIMIT",
          message: `Candidate path search exceeded maxVisitedMandates=${String(limits.maxVisitedMandates)}`,
          agentId: agent.id,
          mandateId: current.id
        });
      }
      visitedMandates += 1;
      if (reversed.length >= limits.maxPathDepth) {
        return fail4({
          code: "VAGP_GRAPH_PATH_DEPTH_LIMIT",
          message: `Candidate path search exceeded maxPathDepth=${String(limits.maxPathDepth)}`,
          agentId: agent.id,
          mandateId: current.id
        });
      }
      if (ancestry.has(current.id)) {
        return fail4({
          code: "VAGP_GRAPH_PATH_INVALID",
          message: "AuthorityGraph ancestry unexpectedly repeated a Mandate",
          agentId: agent.id,
          mandateId: current.id
        });
      }
      ancestry.add(current.id);
      reversed.push(current);
      if (current.parentMandate === null) {
        const path = createPath(graphValue, agent.id, reversed);
        if (path === null) {
          return fail4({
            code: "VAGP_GRAPH_PATH_INVALID",
            message: "AuthorityGraph root ancestry is internally inconsistent",
            agentId: agent.id,
            mandateId: current.id
          });
        }
        if (principalId === void 0 || path.principal.id === principalId) {
          if (pathKeys.has(path.key)) {
            return fail4({
              code: "VAGP_GRAPH_PATH_INVALID",
              message: "AuthorityGraph traversal produced a duplicate candidate path",
              agentId: agent.id,
              mandateId: leaf.id
            });
          }
          if (paths.length >= limits.maxPaths) {
            return fail4({
              code: "VAGP_GRAPH_PATH_COUNT_LIMIT",
              message: `Candidate path search exceeded maxPaths=${String(limits.maxPaths)}`,
              agentId: agent.id
            });
          }
          pathKeys.add(path.key);
          paths.push(path);
        }
        break;
      }
      const parent = graphValue.getParentMandate(current.id);
      if (parent === void 0 || parent.id !== current.parentMandate || parent.subject.id !== current.issuer.id) {
        return fail4({
          code: "VAGP_GRAPH_PATH_INVALID",
          message: "AuthorityGraph parent ancestry is internally inconsistent",
          agentId: agent.id,
          mandateId: current.id,
          parentMandateId: current.parentMandate
        });
      }
      current = parent;
    }
  }
  paths.sort(comparePaths);
  return succeed2(paths);
}
function findCandidatePathsToAgent(graph, agentId, options) {
  try {
    return discover(graph, void 0, agentId, options);
  } catch {
    return fail4({
      code: "VAGP_GRAPH_PATH_INVALID",
      message: "Candidate path query could not be processed safely"
    });
  }
}
function ownDataValue(value, key) {
  const descriptor = Reflect.getOwnPropertyDescriptor(value, key);
  return descriptor !== void 0 && descriptor.enumerable && Object.hasOwn(descriptor, "value") ? { ok: true, value: descriptor.value } : { ok: false };
}
function canonicalizeCandidatePath(graph, path) {
  try {
    if (!isAuthorityGraph(graph)) {
      return invalidPath("Path validation requires a constructed AuthorityGraph");
    }
    if (path === null || typeof path !== "object" || Array.isArray(path) || Object.getPrototypeOf(path) !== Object.prototype) {
      return invalidPath("Candidate path must be a plain object");
    }
    const keys = Reflect.ownKeys(path);
    const expected = /* @__PURE__ */ new Set(["principal", "agent", "mandates", "key"]);
    if (keys.length !== expected.size || keys.some((key) => typeof key !== "string" || !expected.has(key))) {
      return invalidPath("Candidate path has missing or unknown properties");
    }
    const principalValue = ownDataValue(path, "principal");
    const agentValue = ownDataValue(path, "agent");
    const mandatesValue = ownDataValue(path, "mandates");
    const keyValue = ownDataValue(path, "key");
    if (!principalValue.ok || !agentValue.ok || !mandatesValue.ok || !keyValue.ok || typeof keyValue.value !== "string" || !Array.isArray(mandatesValue.value)) {
      return invalidPath("Candidate path properties are malformed");
    }
    const lengthDescriptor = Reflect.getOwnPropertyDescriptor(mandatesValue.value, "length");
    const mandateCount = lengthDescriptor?.value;
    if (typeof mandateCount !== "number" || !Number.isSafeInteger(mandateCount) || mandateCount === 0 || mandateCount > MAX_CANDIDATE_PATH_SEARCH_LIMITS.maxPathDepth) {
      return invalidPath("Candidate path Mandate count is invalid");
    }
    const mandateArrayKeys = Reflect.ownKeys(mandatesValue.value);
    if (mandateArrayKeys.some((key) => key !== "length" && (typeof key !== "string" || !/^(0|[1-9][0-9]*)$/.test(key) || Number(key) >= mandateCount)) || mandateArrayKeys.length !== mandateCount + 1) {
      return invalidPath("Candidate path Mandate array is malformed");
    }
    const mandates = [];
    for (let index = 0; index < mandateCount; index += 1) {
      const entry = ownDataValue(mandatesValue.value, String(index));
      if (!entry.ok || entry.value === null || typeof entry.value !== "object") {
        return invalidPath("Candidate path contains a malformed Mandate entry");
      }
      const id = ownDataValue(entry.value, "id");
      if (!id.ok || typeof id.value !== "string") {
        return invalidPath("Candidate path Mandate entry has no valid ID");
      }
      const graphMandate = graph.getMandate(id.value);
      if (graphMandate === void 0 || graphMandate !== entry.value) {
        return invalidPath("Candidate path Mandates must be canonical members of the AuthorityGraph", { mandateId: id.value });
      }
      mandates.push(graphMandate);
    }
    if (principalValue.value === null || typeof principalValue.value !== "object" || agentValue.value === null || typeof agentValue.value !== "object") {
      return invalidPath("Candidate path identities are malformed");
    }
    const principalId = ownDataValue(principalValue.value, "id");
    const agentId = ownDataValue(agentValue.value, "id");
    if (!principalId.ok || typeof principalId.value !== "string" || !agentId.ok || typeof agentId.value !== "string") {
      return invalidPath("Candidate path identities must belong to the AuthorityGraph");
    }
    const principal = graph.getPrincipal(principalId.value);
    const agent = graph.getAgent(agentId.value);
    if (principal === void 0 || agent === void 0 || principal !== principalValue.value || agent !== agentValue.value) {
      return invalidPath("Candidate path identities must belong to the AuthorityGraph");
    }
    const root = mandates[0];
    const leaf = mandates[mandates.length - 1];
    if (root === void 0 || leaf === void 0 || root.parentMandate !== null || root.issuer.id !== principalId.value || leaf.subject.id !== agentId.value) {
      return invalidPath("Candidate path endpoints are inconsistent");
    }
    const seen = /* @__PURE__ */ new Set();
    for (let index = 0; index < mandates.length; index += 1) {
      const mandate2 = mandates[index];
      if (mandate2 === void 0 || seen.has(mandate2.id)) {
        return invalidPath("Candidate path repeats a Mandate");
      }
      seen.add(mandate2.id);
      if (index === 0)
        continue;
      const parent = mandates[index - 1];
      if (parent === void 0 || mandate2.parentMandate !== parent.id || parent.subject.id !== mandate2.issuer.id || graph.getParentMandate(mandate2.id) !== parent) {
        return invalidPath("Candidate path parent linkage is inconsistent", {
          mandateId: mandate2.id,
          ...parent === void 0 ? {} : { parentMandateId: parent.id }
        });
      }
    }
    if (keyValue.value !== pathKey(principalId.value, mandates.map((mandate2) => mandate2.id), agentId.value)) {
      return invalidPath("Candidate path key is inconsistent");
    }
    return Object.freeze({
      valid: true,
      value: Object.freeze({
        principal,
        agent,
        mandates: Object.freeze([...mandates]),
        key: keyValue.value
      })
    });
  } catch {
    return invalidPath("Candidate path could not be inspected safely");
  }
}

// ../../packages/authority-graph/dist/status.js
var SNAPSHOT_KEYS = /* @__PURE__ */ new Set(["observedAt", "records"]);
var RECORD_KEYS = /* @__PURE__ */ new Set([
  "statusRef",
  "mandateId",
  "state",
  "sequence",
  "effectiveAt"
]);
var LIFECYCLE_STATES = /* @__PURE__ */ new Set([
  "ACTIVE",
  "SUSPENDED",
  "REVOKED"
]);
var constructedSnapshots = /* @__PURE__ */ new WeakSet();
var snapshotHistories = /* @__PURE__ */ new WeakMap();
function identityKey(statusRef, mandateId) {
  return JSON.stringify([statusRef, mandateId]);
}
function lexicographic4(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}
function error2(code, path, message, context = {}) {
  return Object.freeze({ code, path, message, ...context });
}
function fail5(errors) {
  return Object.freeze({
    ok: false,
    errors: Object.freeze([...errors])
  });
}
function inspectOwnData3(value, path, seen) {
  if (typeof value === "function" || typeof value === "symbol") {
    return error2("VAGP_PATH_STATUS_INVALID", path, "Functions and symbols are not valid status evidence");
  }
  if (value === null || typeof value !== "object")
    return null;
  if (seen.has(value)) {
    return error2("VAGP_PATH_STATUS_INVALID", path, "Cyclic status evidence is not supported");
  }
  seen.add(value);
  try {
    const array = Array.isArray(value);
    const prototype = Object.getPrototypeOf(value);
    const expected = array ? Array.prototype : Object.prototype;
    if (prototype !== expected && prototype !== null) {
      return error2("VAGP_PATH_STATUS_INVALID", path, "Status evidence must use a plain or null prototype");
    }
    const keys = Reflect.ownKeys(value);
    const lengthDescriptor = array ? Reflect.getOwnPropertyDescriptor(value, "length") : void 0;
    const length = lengthDescriptor?.value;
    for (const key of keys) {
      if (array && key === "length")
        continue;
      if (typeof key === "symbol") {
        return error2("VAGP_PATH_STATUS_INVALID", path, "Symbol status properties are not permitted");
      }
      if (array && (typeof length !== "number" || !/^(0|[1-9][0-9]*)$/.test(key) || Number(key) >= length)) {
        return error2("VAGP_PATH_STATUS_INVALID", `${path}/${key}`, "Unknown status array properties are not permitted");
      }
      const descriptor = Reflect.getOwnPropertyDescriptor(value, key);
      if (descriptor === void 0 || !descriptor.enumerable || !Object.hasOwn(descriptor, "value")) {
        return error2("VAGP_PATH_STATUS_INVALID", `${path}/${key}`, "Status evidence must use own enumerable data properties");
      }
      const nested = inspectOwnData3(descriptor.value, `${path}/${key}`, seen);
      if (nested !== null)
        return nested;
    }
  } catch {
    return error2("VAGP_PATH_STATUS_INVALID", path, "Status evidence could not be inspected safely");
  } finally {
    seen.delete(value);
  }
  return null;
}
function preflight(value) {
  try {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      return fail5([
        error2("VAGP_PATH_STATUS_INVALID", "/statuses", "Status snapshot must be an object")
      ]);
    }
    const keys = Reflect.ownKeys(value);
    if (keys.length !== SNAPSHOT_KEYS.size || keys.some((key) => typeof key !== "string" || !SNAPSHOT_KEYS.has(key))) {
      return fail5([
        error2("VAGP_PATH_STATUS_INVALID", "/statuses", "Status snapshot must contain only observedAt and records")
      ]);
    }
    const recordsDescriptor = Reflect.getOwnPropertyDescriptor(value, "records");
    if (recordsDescriptor === void 0 || !recordsDescriptor.enumerable || !Object.hasOwn(recordsDescriptor, "value") || !Array.isArray(recordsDescriptor.value)) {
      return fail5([
        error2("VAGP_PATH_STATUS_INVALID", "/statuses/records", "Status snapshot records must be an own enumerable array")
      ]);
    }
    const lengthDescriptor = Reflect.getOwnPropertyDescriptor(recordsDescriptor.value, "length");
    const length = lengthDescriptor?.value;
    if (typeof length !== "number" || !Number.isSafeInteger(length)) {
      return fail5([
        error2("VAGP_PATH_STATUS_INVALID", "/statuses/records", "Status snapshot records have an invalid array length")
      ]);
    }
    if (length > MAX_MANDATE_STATUS_RECORDS) {
      return fail5([
        error2("VAGP_PATH_STATUS_INVALID", "/statuses/records", `Status snapshot exceeds the implementation limit of ${String(MAX_MANDATE_STATUS_RECORDS)} records`)
      ]);
    }
    const recordKeys = Reflect.ownKeys(recordsDescriptor.value);
    if (recordKeys.length !== length + 1 || recordKeys.some((key) => key !== "length" && (typeof key !== "string" || !/^(0|[1-9][0-9]*)$/.test(key) || Number(key) >= length))) {
      return fail5([
        error2("VAGP_PATH_STATUS_INVALID", "/statuses/records", "Status snapshot records must be a dense array without extra properties")
      ]);
    }
  } catch {
    return fail5([
      error2("VAGP_PATH_STATUS_INVALID", "/statuses", "Status snapshot could not be inspected safely")
    ]);
  }
  return null;
}
function isRecordShape(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function recordErrors(value, index) {
  const path = `/statuses/records/${String(index)}`;
  if (!isRecordShape(value)) {
    return [
      error2("VAGP_PATH_STATUS_INVALID", path, "Status record must be an object")
    ];
  }
  const keys = Object.keys(value);
  if (keys.length !== RECORD_KEYS.size || keys.some((key) => !RECORD_KEYS.has(key))) {
    return [
      error2("VAGP_PATH_STATUS_INVALID", path, "Status record has missing or unknown properties")
    ];
  }
  const errors = [];
  if (typeof value["statusRef"] !== "string" || value["statusRef"].length === 0) {
    errors.push(error2("VAGP_PATH_STATUS_INVALID", `${path}/statusRef`, "statusRef must be a non-empty string"));
  }
  if (typeof value["mandateId"] !== "string" || value["mandateId"].length === 0) {
    errors.push(error2("VAGP_PATH_STATUS_INVALID", `${path}/mandateId`, "mandateId must be a non-empty string"));
  }
  if (typeof value["state"] !== "string" || !LIFECYCLE_STATES.has(value["state"])) {
    errors.push(error2("VAGP_PATH_STATUS_INVALID", `${path}/state`, "Lifecycle state must be ACTIVE, SUSPENDED, or REVOKED"));
  }
  if (typeof value["sequence"] !== "number" || !Number.isSafeInteger(value["sequence"]) || value["sequence"] < 0) {
    errors.push(error2("VAGP_PATH_STATUS_SEQUENCE_INVALID", `${path}/sequence`, "Status sequence must be a non-negative safe integer"));
  }
  const timestamp = parseCanonicalTimestamp(value["effectiveAt"]);
  if (!timestamp.valid) {
    errors.push(error2("VAGP_PATH_STATUS_INVALID", `${path}/effectiveAt`, timestamp.message));
  }
  return errors;
}
function transitionAllowed(parent, child) {
  return parent === "ACTIVE" && (child === "SUSPENDED" || child === "REVOKED") || parent === "SUSPENDED" && (child === "ACTIVE" || child === "REVOKED");
}
var ImmutableMandateStatusSnapshot = class {
  observedAt;
  records;
  constructor(observedAt, records, histories) {
    this.observedAt = observedAt;
    this.records = records;
    snapshotHistories.set(this, histories);
    constructedSnapshots.add(this);
    Object.freeze(this);
  }
};
Object.freeze(ImmutableMandateStatusSnapshot.prototype);
function constructSnapshot(input) {
  const observed = parseCanonicalTimestamp(input.observedAt);
  if (!observed.valid) {
    return fail5([
      error2("VAGP_PATH_STATUS_INVALID", "/statuses/observedAt", observed.message)
    ]);
  }
  const structuralErrors = input.records.flatMap((record, index) => recordErrors(record, index));
  if (structuralErrors.length > 0)
    return fail5(structuralErrors);
  const grouped = /* @__PURE__ */ new Map();
  for (const record of input.records) {
    const parsed = parseCanonicalTimestamp(record.effectiveAt);
    if (!parsed.valid) {
      return fail5([
        error2("VAGP_PATH_STATUS_INVALID", "/statuses/records/effectiveAt", parsed.message)
      ]);
    }
    if (parsed.epochMilliseconds > observed.epochMilliseconds) {
      return fail5([
        error2("VAGP_PATH_STATUS_INVALID", "/statuses/records/effectiveAt", "Status record effectiveAt must not be later than snapshot observedAt", { mandateId: record.mandateId, statusRef: record.statusRef })
      ]);
    }
    const canonical = Object.freeze({
      statusRef: record.statusRef,
      mandateId: record.mandateId,
      state: record.state,
      sequence: record.sequence,
      effectiveAt: record.effectiveAt
    });
    const key = identityKey(canonical.statusRef, canonical.mandateId);
    const history = grouped.get(key) ?? [];
    history.push({
      record: canonical,
      epochMilliseconds: parsed.epochMilliseconds
    });
    grouped.set(key, history);
  }
  const histories = /* @__PURE__ */ new Map();
  const canonicalRecords = [];
  for (const [key, records2] of [...grouped.entries()].sort(([left], [right]) => lexicographic4(left, right))) {
    records2.sort((left, right) => left.record.sequence - right.record.sequence || left.epochMilliseconds - right.epochMilliseconds || lexicographic4(left.record.state, right.record.state));
    const unique = [];
    for (const current of records2) {
      const previousAtSequence = unique.find((candidate) => candidate.record.sequence === current.record.sequence);
      if (previousAtSequence !== void 0) {
        if (previousAtSequence.record.state !== current.record.state || previousAtSequence.record.effectiveAt !== current.record.effectiveAt) {
          return fail5([
            error2("VAGP_PATH_STATUS_AMBIGUOUS", "/statuses/records", "Status history contains contradictory records at one sequence", {
              mandateId: current.record.mandateId,
              statusRef: current.record.statusRef
            })
          ]);
        }
        continue;
      }
      unique.push(current);
    }
    for (let index = 1; index < unique.length; index += 1) {
      const previous = unique[index - 1];
      const current = unique[index];
      if (previous === void 0 || current === void 0)
        continue;
      if (current.epochMilliseconds < previous.epochMilliseconds) {
        return fail5([
          error2("VAGP_PATH_STATUS_SEQUENCE_INVALID", "/statuses/records", "Higher status sequences must not move effectiveAt backwards", {
            mandateId: current.record.mandateId,
            statusRef: current.record.statusRef
          })
        ]);
      }
      if (previous.record.state === "REVOKED") {
        return fail5([
          error2("VAGP_PATH_STATUS_INVALID", "/statuses/records", "REVOKED is terminal within a status history", {
            mandateId: current.record.mandateId,
            statusRef: current.record.statusRef
          })
        ]);
      }
      if (current.record.sequence === previous.record.sequence + 1 && !transitionAllowed(previous.record.state, current.record.state)) {
        return fail5([
          error2("VAGP_PATH_STATUS_INVALID", "/statuses/records", "Status history contains an invalid lifecycle transition", {
            mandateId: current.record.mandateId,
            statusRef: current.record.statusRef
          })
        ]);
      }
    }
    const frozen = Object.freeze([...unique]);
    histories.set(key, frozen);
    canonicalRecords.push(...unique.map((entry) => entry.record));
  }
  const records = Object.freeze(canonicalRecords);
  const snapshot = new ImmutableMandateStatusSnapshot(input.observedAt, records, histories);
  return Object.freeze({ ok: true, value: snapshot });
}
function buildMandateStatusSnapshot(value) {
  try {
    const preflightResult = preflight(value);
    if (preflightResult !== null)
      return preflightResult;
    const inspection = inspectOwnData3(value, "/statuses", /* @__PURE__ */ new WeakSet());
    if (inspection !== null)
      return fail5([inspection]);
    let snapshot;
    try {
      snapshot = structuredClone(value);
    } catch {
      return fail5([
        error2("VAGP_PATH_STATUS_INVALID", "/statuses", "Status snapshot could not be materialized safely")
      ]);
    }
    return constructSnapshot(snapshot);
  } catch {
    return fail5([
      error2("VAGP_PATH_STATUS_INVALID", "/statuses", "Status snapshot could not be processed safely")
    ]);
  }
}
function isMandateStatusSnapshot(value) {
  return value !== null && typeof value === "object" && constructedSnapshots.has(value);
}
function getStatusHistory(snapshot, statusRef, mandateId) {
  return snapshotHistories.get(snapshot)?.get(identityKey(statusRef, mandateId)) ?? [];
}

// ../../packages/authority-graph/dist/path-validation.js
var CONTEXT_KEYS = /* @__PURE__ */ new Set([
  "evaluatedAt",
  "statuses",
  "profileMaxStatusStalenessMs",
  "agentStates"
]);
var REQUIRED_CONTEXT_KEYS = /* @__PURE__ */ new Set(["evaluatedAt", "statuses"]);
var REASON_ORDER = Object.freeze([
  "VAGP_PATH_ROOT_INVALID",
  "VAGP_PATH_STRUCTURE_INVALID",
  "VAGP_PATH_EDGE_INVALID",
  "VAGP_PATH_NOT_YET_VALID",
  "VAGP_PATH_MANDATE_EXPIRED",
  "VAGP_PATH_MANDATE_SUSPENDED",
  "VAGP_PATH_MANDATE_REVOKED",
  "VAGP_PATH_STATUS_UNAVAILABLE",
  "VAGP_PATH_STATUS_FRESHNESS_PROFILE_EXCEEDED"
]);
function validationError(code, path, message) {
  return Object.freeze({ code, path, message });
}
function failure(errors) {
  return Object.freeze({ ok: false, errors: Object.freeze([...errors]) });
}
function ownDataValue2(value, key) {
  const descriptor = Reflect.getOwnPropertyDescriptor(value, key);
  return descriptor !== void 0 && descriptor.enumerable && Object.hasOwn(descriptor, "value") ? { ok: true, value: descriptor.value } : { ok: false };
}
function parseContext(value) {
  try {
    if (value === null || typeof value !== "object" || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) {
      return failure([
        validationError("VAGP_PATH_EVALUATION_TIME_INVALID", "/context", "Path validation context must be a plain object")
      ]);
    }
    const keys = Reflect.ownKeys(value);
    if (keys.some((key) => typeof key !== "string" || !CONTEXT_KEYS.has(key)) || [...REQUIRED_CONTEXT_KEYS].some((key) => !keys.includes(key))) {
      return failure([
        validationError("VAGP_PATH_EVALUATION_TIME_INVALID", "/context", "Path validation context contains missing or unsupported properties")
      ]);
    }
    const evaluatedAtValue = ownDataValue2(value, "evaluatedAt");
    const statusesValue = ownDataValue2(value, "statuses");
    const profileValue = ownDataValue2(value, "profileMaxStatusStalenessMs");
    if (!evaluatedAtValue.ok || !statusesValue.ok) {
      return failure([
        validationError("VAGP_PATH_EVALUATION_TIME_INVALID", "/context", "Path validation context must use own enumerable data properties")
      ]);
    }
    const evaluation = parseCanonicalTimestamp(evaluatedAtValue.value);
    if (!evaluation.valid) {
      return failure([
        validationError("VAGP_PATH_EVALUATION_TIME_INVALID", "/context/evaluatedAt", evaluation.message)
      ]);
    }
    if (typeof evaluatedAtValue.value !== "string") {
      return failure([
        validationError("VAGP_PATH_EVALUATION_TIME_INVALID", "/context/evaluatedAt", "Evaluation time must be a canonical timestamp string")
      ]);
    }
    const statuses = isMandateStatusSnapshot(statusesValue.value) ? { ok: true, value: statusesValue.value } : buildMandateStatusSnapshot(statusesValue.value);
    if (!statuses.ok)
      return failure(statuses.errors);
    const profileCandidate = profileValue.ok ? profileValue.value : void 0;
    if (profileCandidate !== void 0 && profileCandidate !== null && (typeof profileCandidate !== "number" || !Number.isSafeInteger(profileCandidate) || Object.is(profileCandidate, -0) || profileCandidate < 0)) {
      return failure([
        validationError("VAGP_PATH_STATUS_FRESHNESS_PROFILE_EXCEEDED", "/context/profileMaxStatusStalenessMs", "Profile freshness ceiling must be null or a non-negative safe integer")
      ]);
    }
    const profileMaxStatusStalenessMs = typeof profileCandidate === "number" ? profileCandidate : null;
    return Object.freeze({
      ok: true,
      value: Object.freeze({
        evaluatedAt: evaluatedAtValue.value,
        evaluationEpochMilliseconds: evaluation.epochMilliseconds,
        statuses: statuses.value,
        profileMaxStatusStalenessMs
      })
    });
  } catch {
    return failure([
      validationError("VAGP_PATH_EVALUATION_TIME_INVALID", "/context", "Path validation context could not be inspected safely")
    ]);
  }
}
function lifecycleAt(mandate2, statuses, evaluationEpochMilliseconds) {
  if (mandate2.statusRef === null)
    return "ACTIVE";
  const history = getStatusHistory(statuses, mandate2.statusRef, mandate2.id);
  let low = 0;
  let high = history.length - 1;
  let selected = null;
  while (low <= high) {
    const middle = low + Math.floor((high - low) / 2);
    const candidate = history[middle];
    if (candidate === void 0)
      break;
    if (candidate.epochMilliseconds <= evaluationEpochMilliseconds) {
      selected = candidate.record.state;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }
  return selected;
}
function orderedReasons(values) {
  return Object.freeze(REASON_ORDER.filter((reason) => values.has(reason)));
}
function evaluateMandate(mandate2, structurallyValid, context) {
  const notBefore = parseCanonicalTimestamp(mandate2.validity.notBefore);
  const notAfter = parseCanonicalTimestamp(mandate2.validity.notAfter);
  const reasons = /* @__PURE__ */ new Set();
  if (!structurallyValid)
    reasons.add("VAGP_PATH_EDGE_INVALID");
  let temporallyValid = false;
  let temporalState = null;
  if (notBefore.valid && notAfter.valid) {
    if (context.evaluationEpochMilliseconds < notBefore.epochMilliseconds) {
      temporalState = "NOT_YET_VALID";
      reasons.add("VAGP_PATH_NOT_YET_VALID");
    } else if (context.evaluationEpochMilliseconds > notAfter.epochMilliseconds) {
      temporalState = "EXPIRED";
      reasons.add("VAGP_PATH_MANDATE_EXPIRED");
    } else {
      temporallyValid = true;
    }
  } else {
    reasons.add("VAGP_PATH_STRUCTURE_INVALID");
  }
  const storedLifecycle = lifecycleAt(mandate2, context.statuses, context.evaluationEpochMilliseconds);
  if (mandate2.statusRef !== null && storedLifecycle === null) {
    reasons.add("VAGP_PATH_STATUS_UNAVAILABLE");
  } else if (storedLifecycle === "SUSPENDED") {
    reasons.add("VAGP_PATH_MANDATE_SUSPENDED");
  } else if (storedLifecycle === "REVOKED") {
    reasons.add("VAGP_PATH_MANDATE_REVOKED");
  }
  if (mandate2.vagp === "0.2" && "revocation" in mandate2.authority && context.profileMaxStatusStalenessMs !== null && mandate2.authority.revocation.maxStatusStalenessMs > context.profileMaxStatusStalenessMs) {
    reasons.add("VAGP_PATH_STATUS_FRESHNESS_PROFILE_EXCEEDED");
  }
  const lifecycleState = storedLifecycle === "SUSPENDED" || storedLifecycle === "REVOKED" ? storedLifecycle : temporalState ?? storedLifecycle;
  const usable = structurallyValid && temporallyValid && storedLifecycle === "ACTIVE" && !reasons.has("VAGP_PATH_STATUS_FRESHNESS_PROFILE_EXCEEDED");
  const reasonCodes = usable ? Object.freeze(["VAGP_PATH_VALID"]) : orderedReasons(reasons);
  return Object.freeze({
    mandateId: mandate2.id,
    structurallyValid,
    temporallyValid,
    lifecycleState,
    usable,
    reasonCodes
  });
}
function replayStructure(graph, path) {
  const structuralResults = [];
  for (let index = 0; index < path.mandates.length; index += 1) {
    const mandate2 = path.mandates[index];
    if (mandate2 === void 0)
      continue;
    if (index === 0) {
      structuralResults.push(mandate2.parentMandate === null && mandate2.issuer.id === path.principal.id && graph.getPrincipal(path.principal.id) === path.principal);
      continue;
    }
    const parent = path.mandates[index - 1];
    if (parent === void 0) {
      structuralResults.push(false);
      continue;
    }
    const edge = isValidSingleHopDerivation({ authority: parent.authority, validity: parent.validity }, { authority: mandate2.authority, validity: mandate2.validity });
    structuralResults.push(edge.ok && mandate2.parentMandate === parent.id && parent.subject.id === mandate2.issuer.id && graph.getParentMandate(mandate2.id) === parent);
  }
  return Object.freeze(structuralResults);
}
function validateAuthorityPathAt(graph, candidatePath, context) {
  try {
    if (!isAuthorityGraph(graph)) {
      return failure([
        validationError("VAGP_PATH_STRUCTURE_INVALID", "/graph", "Path validation requires a constructed AuthorityGraph")
      ]);
    }
    const parsedContext = parseContext(context);
    if (!parsedContext.ok)
      return parsedContext;
    const canonicalPath = canonicalizeCandidatePath(graph, candidatePath);
    if (!canonicalPath.valid) {
      return failure([
        validationError("VAGP_PATH_STRUCTURE_INVALID", "/candidatePath", canonicalPath.errors[0]?.message ?? "Candidate path is invalid")
      ]);
    }
    const structuralResults = replayStructure(graph, canonicalPath.value);
    const mandateResults = Object.freeze(canonicalPath.value.mandates.map((mandate2, index) => evaluateMandate(mandate2, structuralResults[index] === true, parsedContext.value)));
    const valid = mandateResults.every((mandate2) => mandate2.usable);
    const reasons = /* @__PURE__ */ new Set();
    if (valid) {
      reasons.add("VAGP_PATH_VALID");
    } else {
      for (const result of mandateResults) {
        for (const reason of result.reasonCodes) {
          if (reason !== "VAGP_PATH_VALID")
            reasons.add(reason);
        }
      }
      if (structuralResults[0] === false)
        reasons.add("VAGP_PATH_ROOT_INVALID");
    }
    const reasonCodes = valid ? Object.freeze(["VAGP_PATH_VALID"]) : orderedReasons(reasons);
    return Object.freeze({
      ok: true,
      value: Object.freeze({
        path: canonicalPath.value,
        evaluatedAt: parsedContext.value.evaluatedAt,
        profileMaxStatusStalenessMs: parsedContext.value.profileMaxStatusStalenessMs,
        valid,
        mandateResults,
        reasonCodes
      })
    });
  } catch {
    return failure([
      validationError("VAGP_PATH_STRUCTURE_INVALID", "/candidatePath", "Authority path validation could not be processed safely")
    ]);
  }
}

// ../../packages/context/dist/index.js
var MAX_RESOLVED_CONTEXT_ATTRIBUTES = 256;
var CONTEXT_KEYS2 = /* @__PURE__ */ new Set([
  "resource",
  "attributes",
  "autonomy",
  "assurance",
  "financial"
]);
var CONTEXT_V03_KEYS = /* @__PURE__ */ new Set([...CONTEXT_KEYS2, "requiredCapabilities"]);
var AUTONOMY_MODES = /* @__PURE__ */ new Set([
  "PROHIBITED",
  "HUMAN_CONTROLLED",
  "BOUNDED_AUTONOMOUS",
  "AUTONOMOUS"
]);
var ASSURANCE_LEVELS = /* @__PURE__ */ new Set([
  "A1",
  "A2",
  "A3",
  "A4",
  "A5"
]);
var constructedContexts = /* @__PURE__ */ new WeakSet();
function contextError(code, path, message) {
  return Object.freeze({ code, path, message });
}
function fail6(error4) {
  return Object.freeze({ ok: false, errors: Object.freeze([error4]) });
}
function isPlainObject2(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
function ownDataEntries(value, path) {
  const entries = /* @__PURE__ */ new Map();
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key !== "string") {
      return {
        ok: false,
        error: contextError("VAGP_CONTEXT_INVALID", path, "Symbol properties are not permitted in resolved context")
      };
    }
    const descriptor = Reflect.getOwnPropertyDescriptor(value, key);
    if (descriptor === void 0 || !descriptor.enumerable || !Object.hasOwn(descriptor, "value")) {
      return {
        ok: false,
        error: contextError("VAGP_CONTEXT_INVALID", `${path}/${key}`, "Resolved context must use own enumerable data properties")
      };
    }
    entries.set(key, descriptor.value);
  }
  return { ok: true, value: entries };
}
function hasExactKeys(entries, expected) {
  return entries.size === expected.size && [...entries.keys()].every((key) => expected.has(key));
}
function scalar(value) {
  return typeof value === "string" || typeof value === "boolean" || typeof value === "number" && Number.isFinite(value);
}
function canonicalAttributeName(value) {
  return value !== "constructor" && value !== "prototype" && /^[a-z][a-z0-9-]{0,63}$/.test(value);
}
var ImmutableResolvedActionContext = class {
  resource;
  attributes;
  autonomy;
  assurance;
  financial;
  requiredCapabilities;
  constructor(value) {
    this.resource = value.resource;
    this.attributes = value.attributes;
    this.autonomy = value.autonomy;
    this.assurance = value.assurance;
    this.financial = value.financial;
    if (value.requiredCapabilities !== void 0) {
      this.requiredCapabilities = value.requiredCapabilities;
    }
    constructedContexts.add(this);
    Object.freeze(this);
  }
};
Object.freeze(ImmutableResolvedActionContext.prototype);
function build2(value) {
  if (!isPlainObject2(value)) {
    return fail6(contextError("VAGP_CONTEXT_INVALID", "/context", "Resolved action context must be a plain object"));
  }
  const contextEntries = ownDataEntries(value, "/context");
  if (!contextEntries.ok)
    return fail6(contextEntries.error);
  const hasV03Context = hasExactKeys(contextEntries.value, CONTEXT_V03_KEYS);
  if (!hasExactKeys(contextEntries.value, CONTEXT_KEYS2) && !hasV03Context) {
    return fail6(contextError("VAGP_CONTEXT_INVALID", "/context", "Resolved action context has missing or unknown properties"));
  }
  const resourceValue = contextEntries.value.get("resource");
  if (!isPlainObject2(resourceValue)) {
    return fail6(contextError("VAGP_CONTEXT_INVALID", "/context/resource", "Resolved resource must be a plain object"));
  }
  const resourceEntries = ownDataEntries(resourceValue, "/context/resource");
  if (!resourceEntries.ok)
    return fail6(resourceEntries.error);
  if (!hasExactKeys(resourceEntries.value, /* @__PURE__ */ new Set(["id"])) || typeof resourceEntries.value.get("id") !== "string" || resourceEntries.value.get("id") === "") {
    return fail6(contextError("VAGP_CONTEXT_INVALID", "/context/resource", "Resolved resource must contain only a non-empty id"));
  }
  const resourceId = resourceEntries.value.get("id");
  if (typeof resourceId !== "string") {
    return fail6(contextError("VAGP_CONTEXT_INVALID", "/context/resource/id", "Resolved resource id must be a string"));
  }
  const attributesValue = contextEntries.value.get("attributes");
  if (!isPlainObject2(attributesValue)) {
    return fail6(contextError("VAGP_CONTEXT_INVALID", "/context/attributes", "Resolved attributes must be a plain or null-prototype object"));
  }
  const attributeEntries = ownDataEntries(attributesValue, "/context/attributes");
  if (!attributeEntries.ok)
    return fail6(attributeEntries.error);
  if (attributeEntries.value.size > MAX_RESOLVED_CONTEXT_ATTRIBUTES) {
    return fail6(contextError("VAGP_CONTEXT_RESOURCE_LIMIT_EXCEEDED", "/context/attributes", `Resolved context exceeds ${String(MAX_RESOLVED_CONTEXT_ATTRIBUTES)} attributes`));
  }
  const attributes = /* @__PURE__ */ Object.create(null);
  for (const [name, attributeValue] of attributeEntries.value) {
    if (!canonicalAttributeName(name)) {
      return fail6(contextError("VAGP_CONTEXT_INVALID", `/context/attributes/${name}`, "Resolved attribute name is not canonical"));
    }
    if (!scalar(attributeValue)) {
      return fail6(contextError("VAGP_CONTEXT_INVALID", `/context/attributes/${name}`, "Resolved attribute values must be finite scalar values"));
    }
    attributes[name] = typeof attributeValue === "number" && Object.is(attributeValue, -0) ? 0 : attributeValue;
  }
  Object.freeze(attributes);
  const autonomy = contextEntries.value.get("autonomy");
  if (typeof autonomy !== "string" || !AUTONOMY_MODES.has(autonomy)) {
    return fail6(contextError("VAGP_CONTEXT_INVALID", "/context/autonomy", "Resolved autonomy must be a canonical VAGP autonomy mode"));
  }
  const assurance = contextEntries.value.get("assurance");
  if (typeof assurance !== "string" || !ASSURANCE_LEVELS.has(assurance)) {
    return fail6(contextError("VAGP_CONTEXT_INVALID", "/context/assurance", "Resolved assurance must be a canonical VAGP assurance level"));
  }
  const financialValue = contextEntries.value.get("financial");
  let financial = null;
  if (financialValue !== null) {
    if (!isPlainObject2(financialValue)) {
      return fail6(contextError("VAGP_CONTEXT_INVALID", "/context/financial", "Resolved financial context must be null or a plain object"));
    }
    const financialEntries = ownDataEntries(financialValue, "/context/financial");
    if (!financialEntries.ok)
      return fail6(financialEntries.error);
    if (!hasExactKeys(financialEntries.value, /* @__PURE__ */ new Set(["currency", "amount"]))) {
      return fail6(contextError("VAGP_CONTEXT_INVALID", "/context/financial", "Resolved financial context must contain only currency and amount"));
    }
    const currency = financialEntries.value.get("currency");
    const amount = financialEntries.value.get("amount");
    if (typeof currency !== "string" || !/^[A-Z]{3}$/.test(currency)) {
      return fail6(contextError("VAGP_CONTEXT_INVALID", "/context/financial/currency", "Resolved financial currency must use three uppercase ASCII letters"));
    }
    if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 0) {
      return fail6(contextError("VAGP_CONTEXT_INVALID", "/context/financial/amount", "Resolved financial amount must be a finite non-negative number"));
    }
    financial = Object.freeze({
      currency,
      amount: Object.is(amount, -0) ? 0 : amount
    });
  }
  let requiredCapabilities;
  if (hasV03Context) {
    const value2 = contextEntries.value.get("requiredCapabilities");
    if (!Array.isArray(value2) || value2.length > 256) {
      return fail6(contextError("VAGP_CONTEXT_INVALID", "/context/requiredCapabilities", "Required capabilities must be an array of at most 256 exact references"));
    }
    const parsed = [];
    const keys = /* @__PURE__ */ new Set();
    for (const [index, entry] of value2.entries()) {
      if (!isPlainObject2(entry)) {
        return fail6(contextError("VAGP_CONTEXT_INVALID", `/context/requiredCapabilities/${String(index)}`, "Capability reference must be a plain object"));
      }
      const entries = ownDataEntries(entry, `/context/requiredCapabilities/${String(index)}`);
      if (!entries.ok || !hasExactKeys(entries.value, /* @__PURE__ */ new Set(["id", "version"])) || typeof entries.value.get("id") !== "string" || entries.value.get("id") === "" || typeof entries.value.get("version") !== "string" || entries.value.get("version") === "") {
        return fail6(contextError("VAGP_CONTEXT_INVALID", `/context/requiredCapabilities/${String(index)}`, "Capability requires only non-empty id and version fields"));
      }
      const id = entries.value.get("id");
      const version = entries.value.get("version");
      const key = JSON.stringify([id, version]);
      if (keys.has(key)) {
        return fail6(contextError("VAGP_CONTEXT_INVALID", `/context/requiredCapabilities/${String(index)}`, "Required capabilities must be unique"));
      }
      keys.add(key);
      parsed.push(Object.freeze({ id, version }));
    }
    requiredCapabilities = Object.freeze(parsed.toSorted((left, right) => {
      const leftKey = `${left.id}\0${left.version}`;
      const rightKey = `${right.id}\0${right.version}`;
      return leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0;
    }));
  }
  const context = new ImmutableResolvedActionContext({
    resource: Object.freeze({ id: resourceId }),
    attributes: Object.freeze(attributes),
    autonomy,
    assurance,
    financial,
    ...requiredCapabilities === void 0 ? {} : { requiredCapabilities }
  });
  return Object.freeze({ ok: true, value: context });
}
function buildResolvedActionContext(value) {
  try {
    if (value !== null && typeof value === "object" && constructedContexts.has(value)) {
      return Object.freeze({ ok: true, value });
    }
    return build2(value);
  } catch {
    return fail6(contextError("VAGP_CONTEXT_INVALID", "/context", "Resolved action context could not be inspected safely"));
  }
}

// ../../packages/authority-graph/dist/resolve.js
var resolutionProvenance = /* @__PURE__ */ new WeakMap();
var REQUEST_KEYS = /* @__PURE__ */ new Set([
  "vagp",
  "type",
  "id",
  "agent",
  "principalHint",
  "action",
  "resource",
  "parametersDigest",
  "requestedAt",
  "nonce"
]);
var VALIDATION_CONTEXT_KEYS = /* @__PURE__ */ new Set([
  "evaluatedAt",
  "statuses",
  "profileMaxStatusStalenessMs",
  "agentStates"
]);
var REQUIRED_VALIDATION_CONTEXT_KEYS = /* @__PURE__ */ new Set(["evaluatedAt", "statuses"]);
var RESOLUTION_REASON_ORDER = Object.freeze([
  "VAGP_RESOLVE_AUTHORITY_CONFIRMED",
  "VAGP_RESOLVE_ADDITIONAL_STATE_REQUIRED",
  "VAGP_RESOLVE_NO_AUTHORITY",
  "VAGP_RESOLVE_NO_CANDIDATE_PATH",
  "VAGP_RESOLVE_NO_CURRENT_PATH",
  "VAGP_RESOLVE_ACTION_NOT_AUTHORIZED",
  "VAGP_RESOLVE_RESOURCE_NOT_AUTHORIZED",
  "VAGP_RESOLVE_CONTEXT_ATTRIBUTE_MISSING",
  "VAGP_RESOLVE_CONSTRAINT_NOT_SATISFIED",
  "VAGP_RESOLVE_AUTONOMY_PROHIBITED",
  "VAGP_RESOLVE_AUTONOMY_NOT_AUTHORIZED",
  "VAGP_RESOLVE_ASSURANCE_INSUFFICIENT",
  "VAGP_RESOLVE_FINANCIAL_CONTEXT_REQUIRED",
  "VAGP_RESOLVE_FINANCIAL_NOT_AUTHORIZED",
  "VAGP_RESOLVE_FINANCIAL_CURRENCY_MISMATCH",
  "VAGP_RESOLVE_TRANSACTION_LIMIT_EXCEEDED",
  "VAGP_RESOLVE_STATEFUL_AUTHORITY_REQUIRED",
  "VAGP_RESOLVE_AGENT_STATE_UNAVAILABLE",
  "VAGP_RESOLVE_AGENT_DNA_MISMATCH",
  "VAGP_RESOLVE_AGENT_STATE_REVISION_MISMATCH",
  "VAGP_RESOLVE_AGENT_STATE_STALE",
  "VAGP_RESOLVE_CAPABILITY_NOT_ATTESTED",
  "VAGP_RESOLVE_CAPABILITY_NOT_AUTHORIZED"
]);
function cause(code, path, message) {
  return Object.freeze({ code, path, message });
}
function resolutionError(code, path, message, causes) {
  return Object.freeze({
    code,
    path,
    message,
    ...causes === void 0 ? {} : { cause: Object.freeze([...causes]) }
  });
}
function fail7(error4) {
  return Object.freeze({ ok: false, errors: Object.freeze([error4]) });
}
function isPlainObject3(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
function ownDataEntries2(value) {
  const entries = /* @__PURE__ */ new Map();
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key !== "string")
      return null;
    const descriptor = Reflect.getOwnPropertyDescriptor(value, key);
    if (descriptor === void 0 || !descriptor.enumerable || !Object.hasOwn(descriptor, "value")) {
      return null;
    }
    entries.set(key, descriptor.value);
  }
  return entries;
}
function exactKeys(entries, expected) {
  return entries.size === expected.size && [...entries.keys()].every((key) => expected.has(key));
}
function reference(value) {
  if (!isPlainObject3(value))
    return null;
  const entries = ownDataEntries2(value);
  const id = entries?.get("id");
  return entries !== null && exactKeys(entries, /* @__PURE__ */ new Set(["id"])) && typeof id === "string" && id.length > 0 ? { ok: true, value: Object.freeze({ id }) } : null;
}
function canonicalRequest(value) {
  try {
    if (!isPlainObject3(value)) {
      return fail7(resolutionError("VAGP_RESOLVE_REQUEST_INVALID", "/request", "ActionRequest must be a plain object"));
    }
    const entries = ownDataEntries2(value);
    if (entries === null || !exactKeys(entries, REQUEST_KEYS)) {
      return fail7(resolutionError("VAGP_RESOLVE_REQUEST_INVALID", "/request", "ActionRequest has missing, unknown, or unsafe properties"));
    }
    const agent = reference(entries.get("agent"));
    const resource = reference(entries.get("resource"));
    const principalValue = entries.get("principalHint");
    const principal = principalValue === null ? null : reference(principalValue);
    if (agent === null || resource === null || principalValue !== null && principal === null) {
      return fail7(resolutionError("VAGP_RESOLVE_REQUEST_INVALID", "/request", "ActionRequest contains an invalid identity or resource reference"));
    }
    const snapshot = {
      vagp: entries.get("vagp"),
      type: entries.get("type"),
      id: entries.get("id"),
      agent: agent.value,
      principalHint: principalValue === null ? null : principal?.value,
      action: entries.get("action"),
      resource: resource.value,
      parametersDigest: entries.get("parametersDigest"),
      requestedAt: entries.get("requestedAt"),
      nonce: entries.get("nonce")
    };
    const validated = validateActionRequest(snapshot);
    const timestamp = parseCanonicalTimestamp(snapshot.requestedAt);
    if (!validated.valid || !timestamp.valid) {
      const causes = validated.errors.map((error4) => cause(error4.code, error4.path, error4.message));
      if (!timestamp.valid) {
        causes.push(cause("VAGP_SEMANTIC_INVALID_TIMESTAMP", "/requestedAt", timestamp.message));
      }
      return fail7(resolutionError("VAGP_RESOLVE_REQUEST_INVALID", "/request", "ActionRequest failed structural or semantic validation", causes));
    }
    return Object.freeze({
      ok: true,
      value: Object.freeze({
        ...snapshot,
        agent: Object.freeze(snapshot.agent),
        principalHint: snapshot.principalHint === null ? null : Object.freeze(snapshot.principalHint),
        resource: Object.freeze(snapshot.resource)
      })
    });
  } catch {
    return fail7(resolutionError("VAGP_RESOLVE_REQUEST_INVALID", "/request", "ActionRequest could not be inspected safely"));
  }
}
function canonicalValidationContext(value) {
  try {
    if (!isPlainObject3(value)) {
      return fail7(resolutionError("VAGP_RESOLVE_CONTEXT_INVALID", "/validationContext", "Validation context must be a plain object"));
    }
    const entries = ownDataEntries2(value);
    if (entries === null || [...entries.keys()].some((key) => !VALIDATION_CONTEXT_KEYS.has(key)) || [...REQUIRED_VALIDATION_CONTEXT_KEYS].some((key) => !entries.has(key))) {
      return fail7(resolutionError("VAGP_RESOLVE_CONTEXT_INVALID", "/validationContext", "Validation context has missing, unknown, or unsafe properties"));
    }
    const evaluatedAt = entries.get("evaluatedAt");
    const timestamp = parseCanonicalTimestamp(evaluatedAt);
    if (typeof evaluatedAt !== "string" || !timestamp.valid) {
      return fail7(resolutionError("VAGP_RESOLVE_CONTEXT_INVALID", "/validationContext/evaluatedAt", timestamp.valid ? "Evaluation time must be a canonical timestamp string" : timestamp.message));
    }
    const statusValue = entries.get("statuses");
    const statuses = isMandateStatusSnapshot(statusValue) ? { ok: true, value: statusValue } : buildMandateStatusSnapshot(statusValue);
    if (!statuses.ok) {
      return fail7(resolutionError("VAGP_RESOLVE_CONTEXT_INVALID", "/validationContext/statuses", "Lifecycle status snapshot is invalid", statuses.errors.map((error4) => cause(error4.code, error4.path, error4.message))));
    }
    const profileValue = entries.get("profileMaxStatusStalenessMs");
    if (profileValue !== void 0 && profileValue !== null && (typeof profileValue !== "number" || !Number.isSafeInteger(profileValue) || Object.is(profileValue, -0) || profileValue < 0)) {
      return fail7(resolutionError("VAGP_RESOLVE_PATH_VALIDATION_FAILED", "/validationContext/profileMaxStatusStalenessMs", "Profile freshness ceiling must be null or a non-negative safe integer"));
    }
    const agentStatesValue = entries.get("agentStates");
    if (agentStatesValue !== void 0 && (!Array.isArray(agentStatesValue) || agentStatesValue.length > 1e4 || agentStatesValue.some((state) => !isTrustedAgentStateEvidence(state)) || new Set(agentStatesValue.map((state) => state.subject.agentId)).size !== agentStatesValue.length)) {
      return fail7(resolutionError("VAGP_RESOLVE_CONTEXT_INVALID", "/validationContext/agentStates", "Agent state evidence must be unique, bounded and originate from a trusted state provider"));
    }
    return Object.freeze({
      ok: true,
      value: Object.freeze({
        evaluatedAt,
        statuses: statuses.value,
        ...profileValue === void 0 ? {} : { profileMaxStatusStalenessMs: profileValue },
        ...agentStatesValue === void 0 ? {} : {
          agentStates: Object.freeze([
            ...agentStatesValue
          ])
        }
      })
    });
  } catch {
    return fail7(resolutionError("VAGP_RESOLVE_CONTEXT_INVALID", "/validationContext", "Validation context could not be inspected safely"));
  }
}
function orderedReasons2(reasons) {
  return Object.freeze(RESOLUTION_REASON_ORDER.filter((reason) => reasons.has(reason)));
}
function legacyActionPatternContains(pattern, action) {
  if (!pattern.endsWith(".*"))
    return pattern === action;
  const base = pattern.slice(0, -2);
  return action.startsWith(`${base}.`);
}
function mandateActionPatternMatches(mandate2, pattern, action) {
  if (mandate2.vagp !== "0.3")
    return legacyActionPatternContains(pattern, action);
  const result = actionPatternContains(pattern, action);
  return result.ok && result.value;
}
function constraintResult(name, constraint, attributes) {
  if (!Object.hasOwn(attributes, name)) {
    return Object.freeze({
      name,
      satisfied: false,
      reasonCodes: Object.freeze([
        "VAGP_RESOLVE_CONTEXT_ATTRIBUTE_MISSING"
      ])
    });
  }
  const actual = attributes[name];
  let satisfied = false;
  switch (constraint.type) {
    case "exact":
      satisfied = actual === constraint.value;
      break;
    case "enum":
      satisfied = typeof actual === "string" && constraint.allowed.includes(actual);
      break;
    case "numericRange":
      satisfied = typeof actual === "number" && (constraint.min === null || actual >= constraint.min) && (constraint.max === null || actual <= constraint.max);
      break;
  }
  return Object.freeze({
    name,
    satisfied,
    reasonCodes: satisfied ? Object.freeze([]) : Object.freeze([
      "VAGP_RESOLVE_CONSTRAINT_NOT_SATISFIED"
    ])
  });
}
function evaluateMandateAuthority(mandate2, request, context, validation) {
  const actionSatisfied = mandate2.authority.actions.some((pattern) => mandateActionPatternMatches(mandate2, pattern, request.action));
  const resourceSatisfied = mandate2.authority.resources.some((selector) => {
    const result = resourceSelectorContains(selector, {
      match: "exact",
      value: request.resource.id
    });
    return result.ok && result.value;
  });
  const constraintResults = Object.freeze(Object.keys(mandate2.authority.constraints).sort().map((name) => {
    const constraint = mandate2.authority.constraints[name];
    if (constraint === void 0) {
      return Object.freeze({
        name,
        satisfied: false,
        reasonCodes: Object.freeze([
          "VAGP_RESOLVE_CONSTRAINT_NOT_SATISFIED"
        ])
      });
    }
    return constraintResult(name, constraint, context.attributes);
  }));
  const constraintsSatisfied = constraintResults.every((result) => result.satisfied);
  const autonomy = restrictAutonomy(mandate2.authority.autonomy, {
    mode: context.autonomy
  });
  const autonomyProhibited = mandate2.authority.autonomy.mode === "PROHIBITED";
  const autonomySatisfied = !autonomyProhibited && autonomy.ok;
  const assurance = increaseAssurance(mandate2.authority.assurance, {
    minimum: context.assurance
  });
  const assuranceSatisfied = assurance.ok;
  const financialContextRequired = mandateRequiresFinancialContext(mandate2, request);
  let agentStateSatisfied = true;
  let capabilitiesSatisfied = true;
  let additionalStateRequired = false;
  const stateReasons = /* @__PURE__ */ new Set();
  if (mandate2.vagp === "0.3") {
    if (!("agentState" in mandate2.authority) || context.requiredCapabilities === void 0) {
      agentStateSatisfied = false;
      capabilitiesSatisfied = false;
      stateReasons.add("VAGP_RESOLVE_AGENT_STATE_UNAVAILABLE");
    } else {
      const evidence = validation.agentStates?.find((state) => state.subject.agentId === mandate2.subject.id);
      if (evidence === void 0) {
        agentStateSatisfied = false;
        capabilitiesSatisfied = false;
        stateReasons.add("VAGP_RESOLVE_AGENT_STATE_UNAVAILABLE");
      } else {
        const binding = mandate2.authority.agentState;
        if (evidence.subject.fingerprint.algorithm !== binding.fingerprint.algorithm || evidence.subject.fingerprint.value !== binding.fingerprint.value) {
          agentStateSatisfied = false;
          stateReasons.add("VAGP_RESOLVE_AGENT_DNA_MISMATCH");
        }
        if (evidence.subject.stateRevision !== binding.stateRevision) {
          agentStateSatisfied = false;
          stateReasons.add("VAGP_RESOLVE_AGENT_STATE_REVISION_MISMATCH");
        }
        const evaluated = parseCanonicalTimestamp(validation.evaluatedAt);
        const observed = parseCanonicalTimestamp(evidence.observedAt);
        if (!evaluated.valid || !observed.valid || observed.epochMilliseconds > evaluated.epochMilliseconds || evaluated.epochMilliseconds - observed.epochMilliseconds > binding.maxStateStalenessMs) {
          agentStateSatisfied = false;
          additionalStateRequired = true;
          stateReasons.add("VAGP_RESOLVE_AGENT_STATE_STALE");
        }
        const authorized = new Set(mandate2.authority.capabilities.map((entry) => JSON.stringify([entry.id, entry.version])));
        const attested = new Set(evidence.capabilities.map((entry) => JSON.stringify([entry.id, entry.version])));
        if (context.requiredCapabilities.some((entry) => !authorized.has(JSON.stringify([entry.id, entry.version])))) {
          capabilitiesSatisfied = false;
          stateReasons.add("VAGP_RESOLVE_CAPABILITY_NOT_AUTHORIZED");
        }
        if (mandate2.subject.id === request.agent.id && context.requiredCapabilities.some((entry) => !attested.has(JSON.stringify([entry.id, entry.version])))) {
          capabilitiesSatisfied = false;
          stateReasons.add("VAGP_RESOLVE_CAPABILITY_NOT_ATTESTED");
        }
      }
    }
  }
  let financialSatisfied = true;
  let financialReason = null;
  if (financialContextRequired && context.financial === null) {
    financialSatisfied = false;
    financialReason = "VAGP_RESOLVE_FINANCIAL_CONTEXT_REQUIRED";
  } else if (context.financial !== null) {
    const authority = mandate2.authority.financial;
    if (authority === null) {
      financialSatisfied = false;
      financialReason = "VAGP_RESOLVE_FINANCIAL_NOT_AUTHORIZED";
    } else if (authority.currency !== context.financial.currency) {
      financialSatisfied = false;
      financialReason = "VAGP_RESOLVE_FINANCIAL_CURRENCY_MISMATCH";
    } else if (authority.maxTransaction !== null && context.financial.amount > authority.maxTransaction) {
      financialSatisfied = false;
      financialReason = "VAGP_RESOLVE_TRANSACTION_LIMIT_EXCEEDED";
    } else if (authority.maxAggregate !== null) {
      additionalStateRequired = true;
    }
  }
  const authoritySatisfied = actionSatisfied && resourceSatisfied && constraintsSatisfied && autonomySatisfied && assuranceSatisfied && financialSatisfied;
  const agentStateUnresolved = stateReasons.has("VAGP_RESOLVE_AGENT_STATE_UNAVAILABLE") || stateReasons.has("VAGP_RESOLVE_AGENT_STATE_STALE");
  if (agentStateUnresolved) {
    additionalStateRequired = true;
  }
  const stateAndCapabilitiesSatisfied = agentStateUnresolved || agentStateSatisfied && capabilitiesSatisfied;
  const fullySatisfied = authoritySatisfied && stateAndCapabilitiesSatisfied;
  const reasons = /* @__PURE__ */ new Set();
  if (!actionSatisfied)
    reasons.add("VAGP_RESOLVE_ACTION_NOT_AUTHORIZED");
  if (!resourceSatisfied)
    reasons.add("VAGP_RESOLVE_RESOURCE_NOT_AUTHORIZED");
  for (const result of constraintResults) {
    for (const reason of result.reasonCodes)
      reasons.add(reason);
  }
  if (autonomyProhibited) {
    reasons.add("VAGP_RESOLVE_AUTONOMY_PROHIBITED");
  } else if (!autonomySatisfied) {
    reasons.add("VAGP_RESOLVE_AUTONOMY_NOT_AUTHORIZED");
  }
  if (!assuranceSatisfied)
    reasons.add("VAGP_RESOLVE_ASSURANCE_INSUFFICIENT");
  if (financialReason !== null)
    reasons.add(financialReason);
  for (const reason of stateReasons)
    reasons.add(reason);
  if (additionalStateRequired) {
    reasons.add("VAGP_RESOLVE_STATEFUL_AUTHORITY_REQUIRED");
  }
  if (fullySatisfied && !additionalStateRequired) {
    reasons.add("VAGP_RESOLVE_AUTHORITY_CONFIRMED");
  }
  return Object.freeze({
    mandateId: mandate2.id,
    actionSatisfied,
    resourceSatisfied,
    constraintsSatisfied,
    autonomySatisfied,
    assuranceSatisfied,
    financialSatisfied,
    agentStateSatisfied,
    capabilitiesSatisfied,
    additionalStateRequired,
    authoritySatisfied: fullySatisfied,
    constraintResults,
    reasonCodes: orderedReasons2(reasons)
  });
}
function outcomeCode(outcome) {
  switch (outcome) {
    case "AUTHORITY_CONFIRMED":
      return "VAGP_RESOLVE_AUTHORITY_CONFIRMED";
    case "ADDITIONAL_STATE_REQUIRED":
      return "VAGP_RESOLVE_ADDITIONAL_STATE_REQUIRED";
    case "NO_AUTHORITY":
      return "VAGP_RESOLVE_NO_AUTHORITY";
  }
}
function sameCanonicalRequest(left, right) {
  const sameSemanticRequest = left.vagp === right.vagp && left.id === right.id && left.agent.id === right.agent.id && left.principalHint?.id === right.principalHint?.id && left.action === right.action && left.resource.id === right.resource.id && left.parametersDigest === right.parametersDigest;
  if (!sameSemanticRequest)
    return false;
  return left.vagp === "0.3" ? left.requestedAt === right.requestedAt && left.nonce === right.nonce : true;
}
function mandateRequiresFinancialContext(mandate2, request) {
  return "financialApplicability" in mandate2.authority && mandate2.authority.financialApplicability.requiredActions.some((pattern) => mandateActionPatternMatches(mandate2, pattern, request.action));
}
function forceFinancialContextRequired(path) {
  const reasons = new Set(path.reasonCodes);
  reasons.delete("VAGP_RESOLVE_AUTHORITY_CONFIRMED");
  reasons.delete("VAGP_RESOLVE_ADDITIONAL_STATE_REQUIRED");
  reasons.add("VAGP_RESOLVE_FINANCIAL_CONTEXT_REQUIRED");
  return Object.freeze({
    ...path,
    authoritySatisfied: false,
    additionalStateRequired: false,
    qualifies: false,
    reasonCodes: orderedReasons2(reasons)
  });
}
function sameCanonicalContext(left, right) {
  const leftKeys = Object.keys(left.attributes).sort();
  const rightKeys = Object.keys(right.attributes).sort();
  const leftCapabilities = left.requiredCapabilities ?? [];
  const rightCapabilities = right.requiredCapabilities ?? [];
  return left.resource.id === right.resource.id && left.autonomy === right.autonomy && left.assurance === right.assurance && leftKeys.length === rightKeys.length && leftKeys.every((key, index) => key === rightKeys[index] && Object.is(left.attributes[key], right.attributes[key])) && (left.financial === null && right.financial === null || left.financial !== null && right.financial !== null && left.financial.currency === right.financial.currency && Object.is(left.financial.amount, right.financial.amount)) && leftCapabilities.length === rightCapabilities.length && leftCapabilities.every((capability, index) => {
    const counterpart = rightCapabilities[index];
    return counterpart !== void 0 && capability.id === counterpart.id && capability.version === counterpart.version;
  });
}
function getAuthorityResolutionProvenance(value) {
  if (value === null || typeof value !== "object")
    return void 0;
  return resolutionProvenance.get(value);
}
function matchesAuthorityResolutionGraph(result, graph) {
  return result !== null && typeof result === "object" && resolutionProvenance.get(result)?.graph === graph;
}
function matchesAuthorityResolutionRequest(result, request) {
  try {
    if (result === null || typeof result !== "object")
      return false;
    const provenance = resolutionProvenance.get(result);
    if (provenance === void 0 || provenance.sourceRequest !== request) {
      return false;
    }
    const currentRequest = canonicalRequest(request);
    return currentRequest.ok && sameCanonicalRequest(currentRequest.value, provenance.request);
  } catch {
    return false;
  }
}
function matchesAuthorityResolutionContext(result, context) {
  try {
    if (result === null || typeof result !== "object")
      return false;
    const provenance = resolutionProvenance.get(result);
    if (provenance === void 0 || provenance.sourceContext !== context) {
      return false;
    }
    const currentContext = buildResolvedActionContext(context);
    return currentContext.ok && sameCanonicalContext(currentContext.value, provenance.context);
  } catch {
    return false;
  }
}
function resolveAuthority(graph, actionRequest, resolvedContext, validationContext, searchOptions) {
  try {
    if (!isAuthorityGraph(graph)) {
      return fail7(resolutionError("VAGP_RESOLVE_GRAPH_INVALID", "/graph", "RESOLVE requires a constructed AuthorityGraph"));
    }
    const request = canonicalRequest(actionRequest);
    if (!request.ok)
      return request;
    const context = buildResolvedActionContext(resolvedContext);
    if (!context.ok) {
      return fail7(resolutionError("VAGP_RESOLVE_CONTEXT_INVALID", "/context", "Resolved action context is invalid", context.errors.map((error4) => cause(error4.code, error4.path, error4.message))));
    }
    const validation = canonicalValidationContext(validationContext);
    if (!validation.ok)
      return validation;
    if (validation.value.agentStates?.some((state) => state.authorityDomainId !== graph.authorityDomainId) === true) {
      return fail7(resolutionError("VAGP_RESOLVE_CONTEXT_INVALID", "/validationContext/agentStates", "Agent state evidence must belong to the resolved Authority Domain"));
    }
    if (context.value.resource.id !== request.value.resource.id) {
      return fail7(resolutionError("VAGP_RESOLVE_RESOURCE_CONTEXT_MISMATCH", "/context/resource/id", "Resolved context resource must exactly match the requested resource"));
    }
    if (graph.getAgent(request.value.agent.id) === void 0) {
      return fail7(resolutionError("VAGP_RESOLVE_AGENT_NOT_FOUND", "/request/agent/id", "ActionRequest Agent is not declared in the AuthorityGraph"));
    }
    const discovered = findCandidatePathsToAgent(graph, request.value.agent.id, searchOptions);
    if (!discovered.ok) {
      return fail7(resolutionError("VAGP_RESOLVE_PATH_DISCOVERY_FAILED", "/searchOptions", "Candidate path discovery failed closed", discovered.errors.map((error4) => cause(error4.code, error4.path ?? "/graph", error4.message))));
    }
    const pathResults = [];
    let reachableFinancialContextRequired = false;
    for (const path of discovered.value) {
      const current = validateAuthorityPathAt(graph, path, validation.value);
      if (!current.ok) {
        return fail7(resolutionError("VAGP_RESOLVE_PATH_VALIDATION_FAILED", "/path", "Discovered candidate path failed defensive validation", current.errors.map((error4) => cause(error4.code, error4.path, error4.message))));
      }
      const mandateResults = Object.freeze(current.value.path.mandates.map((mandate2) => evaluateMandateAuthority(mandate2, request.value, context.value, validation.value)));
      if (context.value.financial === null && current.value.path.mandates.some((mandate2) => mandateRequiresFinancialContext(mandate2, request.value))) {
        reachableFinancialContextRequired = true;
      }
      const authoritySatisfied = mandateResults.every((mandate2) => mandate2.authoritySatisfied);
      const unresolved = mandateResults.some((mandate2) => mandate2.additionalStateRequired);
      const additionalStateRequired = current.value.valid && authoritySatisfied && unresolved;
      const qualifies = current.value.valid && authoritySatisfied && !unresolved;
      const reasons = /* @__PURE__ */ new Set();
      if (!current.value.valid)
        reasons.add("VAGP_RESOLVE_NO_CURRENT_PATH");
      for (const mandate2 of mandateResults) {
        for (const reason of mandate2.reasonCodes) {
          if (reason !== "VAGP_RESOLVE_AUTHORITY_CONFIRMED") {
            reasons.add(reason);
          }
        }
      }
      if (qualifies)
        reasons.add("VAGP_RESOLVE_AUTHORITY_CONFIRMED");
      if (additionalStateRequired) {
        reasons.add("VAGP_RESOLVE_ADDITIONAL_STATE_REQUIRED");
      }
      pathResults.push(Object.freeze({
        path,
        currentlyValid: current.value.valid,
        authoritySatisfied,
        additionalStateRequired,
        qualifies,
        currentPathValidation: current.value,
        mandateResults,
        reasonCodes: orderedReasons2(reasons)
      }));
    }
    const frozenPathResults = Object.freeze(reachableFinancialContextRequired ? pathResults.map((path) => forceFinancialContextRequired(path)) : pathResults);
    const candidatePathCount = frozenPathResults.length;
    const currentlyValidPathCount = frozenPathResults.filter((path) => path.currentlyValid).length;
    const qualifyingPathCount = frozenPathResults.filter((path) => path.qualifies).length;
    const outcome = qualifyingPathCount > 0 ? "AUTHORITY_CONFIRMED" : frozenPathResults.some((path) => path.additionalStateRequired) ? "ADDITIONAL_STATE_REQUIRED" : "NO_AUTHORITY";
    const resultReasons = /* @__PURE__ */ new Set([
      outcomeCode(outcome)
    ]);
    for (const path of frozenPathResults) {
      for (const reason of path.reasonCodes) {
        if (reason !== "VAGP_RESOLVE_AUTHORITY_CONFIRMED") {
          resultReasons.add(reason);
        }
      }
    }
    if (frozenPathResults.some((path) => path.reasonCodes.includes("VAGP_RESOLVE_FINANCIAL_CONTEXT_REQUIRED"))) {
      resultReasons.add("VAGP_RESOLVE_FINANCIAL_CONTEXT_REQUIRED");
    }
    if (candidatePathCount === 0) {
      resultReasons.add("VAGP_RESOLVE_NO_CANDIDATE_PATH");
    } else if (currentlyValidPathCount === 0) {
      resultReasons.add("VAGP_RESOLVE_NO_CURRENT_PATH");
    }
    const result = Object.freeze({
      request: request.value,
      evaluatedAt: validation.value.evaluatedAt,
      outcome,
      candidatePathCount,
      currentlyValidPathCount,
      qualifyingPathCount,
      pathResults: frozenPathResults,
      reasonCodes: orderedReasons2(resultReasons)
    });
    resolutionProvenance.set(result, Object.freeze({
      graph,
      request: request.value,
      context: context.value,
      validation: validation.value,
      sourceRequest: actionRequest,
      sourceContext: resolvedContext
    }));
    return Object.freeze({ ok: true, value: result });
  } catch {
    return fail7(resolutionError("VAGP_RESOLVE_REQUEST_INVALID", "/resolve", "Authority resolution could not be processed safely"));
  }
}

// ../../packages/reservations/dist/exact-number.js
var floatBuffer = new ArrayBuffer(8);
var floatView = new DataView(floatBuffer);
var FRACTION_MASK = (1n << 52n) - 1n;
var IMPLICIT_BIT = 1n << 52n;
function finiteNumberToUnits(value) {
  floatView.setFloat64(0, value, false);
  const bits = floatView.getBigUint64(0, false);
  const exponent = Number(bits >> 52n & 0x7ffn);
  const fraction = bits & FRACTION_MASK;
  if (exponent === 0)
    return fraction;
  return (IMPLICIT_BIT | fraction) << BigInt(exponent - 1);
}
function unitsToFiniteNumber(units) {
  if (units === 0n)
    return 0;
  const bitLength = units.toString(2).length;
  const shift = Math.max(0, bitLength - 53);
  const leading = Number(units >> BigInt(shift));
  return leading * 2 ** (shift - 1074);
}

// ../../packages/reservations/dist/types.js
var FINANCIAL_AGGREGATE_DIMENSION = "FINANCIAL_AGGREGATE";
var DEFAULT_RESERVATION_STORE_LIMITS = Object.freeze({
  maxAuthorityBuckets: 1e4,
  maxReservations: 5e4,
  maxReservationsPerAuthority: 1e4,
  maxChargedBucketsPerReservation: 33
});
var MAX_RESERVATION_STORE_LIMITS = Object.freeze({
  maxAuthorityBuckets: 5e4,
  maxReservations: 25e4,
  maxReservationsPerAuthority: 5e4,
  maxChargedBucketsPerReservation: 33
});

// ../../packages/reservations/dist/store.js
var MAX_PATH_MANDATES = VAGP_MAX_DELEGATION_DEPTH + 1;
var KEY_KEYS = /* @__PURE__ */ new Set(["mandateId", "dimension", "currency"]);
var REQUEST_KEYS2 = /* @__PURE__ */ new Set([
  "reservationId",
  "authorityKey",
  "amount",
  "requestedAt",
  "expiresAt",
  "idempotencyKey"
]);
var EVIDENCE_KEYS = /* @__PURE__ */ new Set([
  "path",
  "validationContext",
  "maxStatusStalenessMs"
]);
var VALIDATION_CONTEXT_KEYS2 = /* @__PURE__ */ new Set(["evaluatedAt", "statuses"]);
var REVALIDATION_CONTEXT_KEYS = /* @__PURE__ */ new Set([
  "evaluatedAt",
  "statuses",
  "maxStatusStalenessMs"
]);
var constructedReservations = /* @__PURE__ */ new WeakSet();
var reservationStoreGraphs = /* @__PURE__ */ new WeakMap();
function freezeError3(error4) {
  return Object.freeze({ ...error4 });
}
function failure2(error4) {
  return Object.freeze({
    ok: false,
    errors: Object.freeze([freezeError3(error4)])
  });
}
function fail8(code, path, message, details = {}) {
  return failure2({ code, path, message, ...details });
}
function success2(value) {
  return Object.freeze({ ok: true, value });
}
function closedObject(value, allowedKeys, requiredKeys, path, code) {
  try {
    if (value === null || typeof value !== "object" || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) {
      return {
        ok: false,
        result: fail8(code, path, "Value must be a plain object")
      };
    }
    const keys = Reflect.ownKeys(value);
    if (keys.some((key) => typeof key !== "string" || !allowedKeys.has(key)) || [...requiredKeys].some((key) => !keys.includes(key))) {
      return {
        ok: false,
        result: fail8(code, path, "Value contains missing, unknown, hidden, or symbol properties")
      };
    }
    const output = /* @__PURE__ */ Object.create(null);
    for (const key of keys) {
      if (typeof key !== "string")
        continue;
      const descriptor = Reflect.getOwnPropertyDescriptor(value, key);
      if (descriptor === void 0 || !descriptor.enumerable || !Object.hasOwn(descriptor, "value")) {
        return {
          ok: false,
          result: fail8(code, `${path}/${key}`, "Properties must be own enumerable data properties")
        };
      }
      output[key] = descriptor.value;
    }
    return { ok: true, value: output };
  } catch {
    return {
      ok: false,
      result: fail8(code, path, "Value could not be inspected safely")
    };
  }
}
function parseTime(value, path) {
  const parsed = parseCanonicalTimestamp(value);
  if (!parsed.valid || typeof value !== "string") {
    return fail8("VAGP_RESERVATION_INVALID_REQUEST", path, parsed.valid ? "Timestamp must be a string" : parsed.message);
  }
  return success2(Object.freeze({
    value,
    epochMilliseconds: parsed.epochMilliseconds
  }));
}
function parseIdentifier(value, path) {
  if (typeof value !== "string" || value.length === 0) {
    return fail8("VAGP_RESERVATION_INVALID_REQUEST", path, "Identifier must be a non-empty string");
  }
  return success2(value);
}
function parseAuthorityKey(value) {
  const object = closedObject(value, KEY_KEYS, KEY_KEYS, "/authorityKey", "VAGP_RESERVATION_INVALID_REQUEST");
  if (!object.ok)
    return object.result;
  const mandateId = parseIdentifier(object.value["mandateId"], "/authorityKey/mandateId");
  if (!mandateId.ok)
    return mandateId;
  if (object.value["dimension"] !== FINANCIAL_AGGREGATE_DIMENSION) {
    return fail8("VAGP_RESERVATION_INVALID_REQUEST", "/authorityKey/dimension", "Only FINANCIAL_AGGREGATE is supported");
  }
  const currency = parseIdentifier(object.value["currency"], "/authorityKey/currency");
  if (!currency.ok)
    return currency;
  return success2(Object.freeze({
    mandateId: mandateId.value,
    dimension: FINANCIAL_AGGREGATE_DIMENSION,
    currency: currency.value
  }));
}
function parseRequest(value) {
  const object = closedObject(value, REQUEST_KEYS2, REQUEST_KEYS2, "/request", "VAGP_RESERVATION_INVALID_REQUEST");
  if (!object.ok)
    return object.result;
  const reservationId = parseIdentifier(object.value["reservationId"], "/request/reservationId");
  if (!reservationId.ok)
    return reservationId;
  const authorityKey = parseAuthorityKey(object.value["authorityKey"]);
  if (!authorityKey.ok)
    return authorityKey;
  const amount = object.value["amount"];
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    return fail8("VAGP_RESERVATION_INVALID_REQUEST", "/request/amount", "Reservation amount must be a finite number greater than zero", { reservationId: reservationId.value });
  }
  const requestedAt = parseTime(object.value["requestedAt"], "/request/requestedAt");
  if (!requestedAt.ok)
    return requestedAt;
  const expiresAt = parseTime(object.value["expiresAt"], "/request/expiresAt");
  if (!expiresAt.ok)
    return expiresAt;
  if (expiresAt.value.epochMilliseconds <= requestedAt.value.epochMilliseconds) {
    return fail8("VAGP_RESERVATION_INVALID_REQUEST", "/request/expiresAt", "Reservation expiry must be later than requestedAt", { reservationId: reservationId.value });
  }
  const idempotencyKey = parseIdentifier(object.value["idempotencyKey"], "/request/idempotencyKey");
  if (!idempotencyKey.ok)
    return idempotencyKey;
  const request = Object.freeze({
    reservationId: reservationId.value,
    authorityKey: authorityKey.value,
    amount,
    requestedAt: requestedAt.value.value,
    expiresAt: expiresAt.value.value,
    idempotencyKey: idempotencyKey.value
  });
  return success2(Object.freeze({
    request,
    requestedEpochMilliseconds: requestedAt.value.epochMilliseconds,
    expiresEpochMilliseconds: expiresAt.value.epochMilliseconds
  }));
}
function parseEvidence(value) {
  const object = closedObject(value, EVIDENCE_KEYS, EVIDENCE_KEYS, "/evidence", "VAGP_RESERVATION_INVALID_REQUEST");
  if (!object.ok)
    return object.result;
  const statusContext = parseStatusContext(object.value["validationContext"], object.value["maxStatusStalenessMs"], "/evidence");
  if (!statusContext.ok)
    return statusContext;
  return success2(Object.freeze({
    path: object.value["path"],
    validationContext: statusContext.value.context,
    maxStatusStalenessMs: statusContext.value.maxStatusStalenessMs
  }));
}
function parseFreshnessBound(value, path) {
  if (value === null)
    return success2(null);
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    return fail8("VAGP_RESERVATION_INVALID_REQUEST", path, "Status freshness bound must be null or a non-negative safe integer in milliseconds");
  }
  return success2(value);
}
function parseStatusContext(contextValue, freshnessValue, basePath) {
  const context = closedObject(contextValue, VALIDATION_CONTEXT_KEYS2, VALIDATION_CONTEXT_KEYS2, `${basePath}/validationContext`, "VAGP_RESERVATION_INVALID_REQUEST");
  if (!context.ok)
    return context.result;
  const evaluatedAt = parseTime(context.value["evaluatedAt"], `${basePath}/validationContext/evaluatedAt`);
  if (!evaluatedAt.ok)
    return evaluatedAt;
  const suppliedStatuses = context.value["statuses"];
  const statuses = isMandateStatusSnapshot(suppliedStatuses) ? success2(suppliedStatuses) : buildMandateStatusSnapshot(suppliedStatuses);
  if (!statuses.ok) {
    return fail8("VAGP_RESERVATION_PATH_INVALID", `${basePath}/validationContext/statuses`, statuses.errors[0]?.message ?? "Status evidence is invalid");
  }
  const observedAt = parseTime(statuses.value.observedAt, `${basePath}/validationContext/statuses/observedAt`);
  if (!observedAt.ok)
    return observedAt;
  if (observedAt.value.epochMilliseconds > evaluatedAt.value.epochMilliseconds) {
    return fail8("VAGP_STATUS_EVIDENCE_FUTURE", `${basePath}/validationContext/statuses/observedAt`, "Status evidence observedAt must not be later than evaluatedAt");
  }
  const freshness = parseFreshnessBound(freshnessValue, `${basePath}/maxStatusStalenessMs`);
  if (!freshness.ok)
    return freshness;
  return success2(Object.freeze({
    context: Object.freeze({
      evaluatedAt: evaluatedAt.value.value,
      statuses: statuses.value
    }),
    evaluatedAt: evaluatedAt.value,
    statuses: statuses.value,
    maxStatusStalenessMs: freshness.value
  }));
}
function parseRevalidationContext(value) {
  if (typeof value === "string") {
    return parseStatusContext({
      evaluatedAt: value,
      statuses: { observedAt: value, records: [] }
    }, 0, "/context");
  }
  const object = closedObject(value, REVALIDATION_CONTEXT_KEYS, REVALIDATION_CONTEXT_KEYS, "/context", "VAGP_RESERVATION_INVALID_REQUEST");
  if (!object.ok)
    return object.result;
  return parseStatusContext({
    evaluatedAt: object.value["evaluatedAt"],
    statuses: object.value["statuses"]
  }, object.value["maxStatusStalenessMs"], "/context");
}
function keyIdentity(key) {
  return JSON.stringify([key.mandateId, key.dimension, key.currency]);
}
function lineageIdentity(lineage) {
  return JSON.stringify({
    pathKey: lineage.pathKey,
    fundedByMandateId: lineage.fundedByMandateId,
    currency: lineage.currency,
    buckets: lineage.buckets.map(keyIdentity)
  });
}
function sameKey(left, right) {
  return left.mandateId === right.mandateId && left.currency === right.currency;
}
function sameRequest(left, right) {
  return left.reservationId === right.reservationId && sameKey(left.authorityKey, right.authorityKey) && Object.is(left.amount, right.amount) && left.requestedAt === right.requestedAt && left.expiresAt === right.expiresAt && left.idempotencyKey === right.idempotencyKey;
}
function compareExpiry(left, right) {
  const epochOrder = left.epochMilliseconds - right.epochMilliseconds;
  if (epochOrder !== 0)
    return epochOrder;
  return left.reservationId < right.reservationId ? -1 : left.reservationId > right.reservationId ? 1 : 0;
}
function heapPush(heap, entry) {
  heap.push(entry);
  let index = heap.length - 1;
  while (index > 0) {
    const parent = Math.floor((index - 1) / 2);
    const parentValue = heap[parent];
    const currentValue = heap[index];
    if (parentValue === void 0 || currentValue === void 0 || compareExpiry(parentValue, currentValue) <= 0) {
      break;
    }
    heap[parent] = currentValue;
    heap[index] = parentValue;
    index = parent;
  }
}
function heapPop(heap) {
  const first = heap[0];
  const last = heap.pop();
  if (first === void 0 || last === void 0 || heap.length === 0) {
    return first;
  }
  heap[0] = last;
  let index = 0;
  while (index < heap.length) {
    const left = index * 2 + 1;
    const right = left + 1;
    let smallest = index;
    const smallestValue = heap[smallest];
    const leftValue = heap[left];
    if (smallestValue !== void 0 && leftValue !== void 0 && compareExpiry(leftValue, smallestValue) < 0) {
      smallest = left;
    }
    const selectedValue = heap[smallest];
    const rightValue = heap[right];
    if (selectedValue !== void 0 && rightValue !== void 0 && compareExpiry(rightValue, selectedValue) < 0) {
      smallest = right;
    }
    if (smallest === index)
      break;
    const currentValue = heap[index];
    const nextValue = heap[smallest];
    if (currentValue === void 0 || nextValue === void 0)
      break;
    heap[index] = nextValue;
    heap[smallest] = currentValue;
    index = smallest;
  }
  return first;
}
function freezeLineage(lineage) {
  return Object.freeze({
    pathKey: lineage.pathKey,
    fundedByMandateId: lineage.fundedByMandateId,
    currency: lineage.currency,
    buckets: Object.freeze([...lineage.buckets])
  });
}
function freezeCharges(charges) {
  return Object.freeze(charges.map((charge) => Object.freeze({
    authorityKey: charge.authorityKey,
    amount: charge.amount
  })));
}
function freezeStatusRecord(record) {
  return Object.freeze({
    statusRef: record.statusRef,
    mandateId: record.mandateId,
    state: record.state,
    sequence: record.sequence,
    effectiveAt: record.effectiveAt
  });
}
function freezeStatusEvidence(evidence) {
  return Object.freeze({
    evaluatedAt: evidence.evaluatedAt,
    observedAt: evidence.observedAt,
    maxStatusStalenessMs: evidence.maxStatusStalenessMs,
    pathValid: evidence.pathValid,
    mandates: Object.freeze(evidence.mandates.map((mandate2) => Object.freeze({
      mandateId: mandate2.mandateId,
      statusRef: mandate2.statusRef,
      effectiveState: mandate2.effectiveState,
      effectiveRecord: mandate2.effectiveRecord === null ? null : freezeStatusRecord(mandate2.effectiveRecord)
    })))
  });
}
function effectiveStatusRecord(mandate2, statuses, evaluatedEpochMilliseconds) {
  if (mandate2.statusRef === null)
    return null;
  let selected = null;
  for (const record of statuses.records) {
    if (record.mandateId !== mandate2.id || record.statusRef !== mandate2.statusRef) {
      continue;
    }
    const effectiveAt = parseCanonicalTimestamp(record.effectiveAt);
    if (!effectiveAt.valid || effectiveAt.epochMilliseconds > evaluatedEpochMilliseconds) {
      continue;
    }
    if (selected === null || record.sequence > selected.sequence) {
      selected = record;
    }
  }
  return selected === null ? null : freezeStatusRecord(selected);
}
function materializeStatusEvidence(validation, context) {
  const mandates = validation.path.mandates.map((mandate2, index) => {
    const result = validation.mandateResults[index];
    return Object.freeze({
      mandateId: mandate2.id,
      statusRef: mandate2.statusRef,
      effectiveState: result?.lifecycleState ?? null,
      effectiveRecord: effectiveStatusRecord(mandate2, context.statuses, context.evaluatedAt.epochMilliseconds)
    });
  });
  return freezeStatusEvidence({
    evaluatedAt: validation.evaluatedAt,
    observedAt: context.statuses.observedAt,
    maxStatusStalenessMs: context.maxStatusStalenessMs,
    pathValid: validation.valid,
    mandates: Object.freeze(mandates)
  });
}
function checkFreshness(path, context) {
  if (context.maxStatusStalenessMs === null || !path.mandates.some((mandate2) => mandate2.statusRef !== null)) {
    return success2(true);
  }
  const observedAt = parseCanonicalTimestamp(context.statuses.observedAt);
  if (!observedAt.valid) {
    return fail8("VAGP_RESERVATION_PATH_INVALID", "/context/statuses/observedAt", "Canonical status evidence has an invalid observedAt");
  }
  const age = context.evaluatedAt.epochMilliseconds - observedAt.epochMilliseconds;
  if (age > context.maxStatusStalenessMs) {
    return fail8("VAGP_STATUS_EVIDENCE_STALE", "/context/statuses/observedAt", "Status evidence exceeds maxStatusStalenessMs");
  }
  return success2(true);
}
function freezeInvalidationEvidence(evidence) {
  return Object.freeze({
    invalidatedAt: evidence.invalidatedAt,
    observedAt: evidence.observedAt,
    reason: evidence.reason,
    affectedMandates: Object.freeze(evidence.affectedMandates.map((affected) => Object.freeze({ ...affected }))),
    statusEvidence: freezeStatusEvidence(evidence.statusEvidence)
  });
}
function freezeConsumption(record) {
  return Object.freeze({
    reservationId: record.reservationId,
    authorityKey: record.authorityKey,
    amount: record.amount,
    committedAt: record.committedAt,
    charges: freezeCharges(record.charges),
    statusEvidence: freezeStatusEvidence(record.statusEvidence)
  });
}
function freezeReservation(reservation) {
  const budgetLineage = freezeLineage(reservation.budgetLineage);
  const charges = freezeCharges(reservation.charges);
  const frozen = Object.freeze({
    reservationId: reservation.reservationId,
    authorityKey: reservation.authorityKey,
    fundedByMandateId: reservation.fundedByMandateId,
    authorityPathKey: reservation.authorityPathKey,
    budgetLineage,
    charges,
    amount: reservation.amount,
    requestedAt: reservation.requestedAt,
    expiresAt: reservation.expiresAt,
    idempotencyKey: reservation.idempotencyKey,
    creationStatusEvidence: freezeStatusEvidence(reservation.creationStatusEvidence),
    state: reservation.state,
    terminalAt: reservation.terminalAt,
    consumption: reservation.consumption === null ? null : freezeConsumption(reservation.consumption),
    invalidation: reservation.invalidation === null ? null : freezeInvalidationEvidence(reservation.invalidation)
  });
  constructedReservations.add(frozen);
  return frozen;
}
function compareReservations(left, right) {
  const leftKey = keyIdentity(left.authorityKey);
  const rightKey = keyIdentity(right.authorityKey);
  if (leftKey !== rightKey)
    return leftKey < rightKey ? -1 : 1;
  if (left.requestedAt !== right.requestedAt) {
    return left.requestedAt < right.requestedAt ? -1 : 1;
  }
  return left.reservationId < right.reservationId ? -1 : left.reservationId > right.reservationId ? 1 : 0;
}
var InMemoryReservationStore = class {
  #graph;
  #limits;
  #buckets = /* @__PURE__ */ new Map();
  #reservations = /* @__PURE__ */ new Map();
  #identitiesByIdempotency = /* @__PURE__ */ new Map();
  #reservationIdByIdempotency = /* @__PURE__ */ new Map();
  #pathsByReservation = /* @__PURE__ */ new Map();
  #expiryHeap = [];
  #lastMutationEpochMilliseconds = null;
  constructor(graph, limits) {
    this.#graph = graph;
    this.#limits = limits;
    Object.freeze(this);
  }
  registerStatefulAuthority(mandateIdValue) {
    try {
      const mandateId = parseIdentifier(mandateIdValue, "/mandateId");
      if (!mandateId.ok)
        return mandateId;
      const mandate2 = this.#graph.getMandate(mandateId.value);
      if (mandate2 === void 0) {
        return fail8("VAGP_RESERVATION_MANDATE_INVALID", "/mandateId", "Mandate does not exist in the canonical Authority Graph", { mandateId: mandateId.value });
      }
      const ancestry = this.#deriveCanonicalAncestry(mandate2);
      if (!ancestry.ok)
        return ancestry;
      const keys = this.#deriveFiniteKeys(ancestry.value, mandate2.id);
      if (!keys.ok)
        return keys;
      const newKeys = keys.value.filter((key) => !this.#buckets.has(keyIdentity(key)));
      if (this.#buckets.size + newKeys.length > this.#limits.maxAuthorityBuckets) {
        return fail8("VAGP_RESERVATION_LIMIT_EXCEEDED", "/mandateId", "Authority bucket limit reached", { mandateId: mandate2.id });
      }
      for (const key of newKeys) {
        const bucketMandate = this.#graph.getMandate(key.mandateId);
        const aggregate = bucketMandate?.authority.financial?.maxAggregate;
        if (bucketMandate === void 0 || aggregate === void 0 || aggregate === null) {
          return fail8("VAGP_BUDGET_LINEAGE_GRAPH_MISMATCH", "/mandateId", "Canonical finite bucket Mandate is unavailable", { mandateId: key.mandateId });
        }
      }
      for (const key of newKeys) {
        const bucketMandate = this.#graph.getMandate(key.mandateId);
        const aggregate = bucketMandate?.authority.financial?.maxAggregate;
        if (bucketMandate === void 0 || aggregate === null || aggregate === void 0) {
          continue;
        }
        this.#buckets.set(keyIdentity(key), {
          key,
          mandate: bucketMandate,
          granted: aggregate,
          grantedUnits: finiteNumberToUnits(aggregate),
          reservationIds: /* @__PURE__ */ new Set(),
          activeUnits: 0n,
          committedUnits: 0n
        });
      }
      const fundedKey = keys.value.at(-1);
      return fundedKey === void 0 ? fail8("VAGP_BUDGET_LINEAGE_EMPTY", "/mandateId", "Funding Mandate has no finite aggregate ceiling", { mandateId: mandate2.id }) : success2(fundedKey);
    } catch {
      return fail8("VAGP_RESERVATION_INVALID_REQUEST", "/mandateId", "Mandate identifier could not be processed safely");
    }
  }
  reserveAuthority(requestValue, evidenceValue) {
    try {
      const parsed = parseRequest(requestValue);
      if (!parsed.ok)
        return parsed;
      const request = parsed.value.request;
      const priorIdentity = this.#identitiesByIdempotency.get(request.idempotencyKey);
      if (priorIdentity !== void 0 && !sameRequest(priorIdentity.request, request)) {
        return this.#idempotencyConflict(request.reservationId);
      }
      if (priorIdentity === void 0 && this.#reservations.has(request.reservationId)) {
        return fail8("VAGP_RESERVATION_ID_CONFLICT", "/request/reservationId", "Reservation ID already exists under another idempotency key", { reservationId: request.reservationId });
      }
      const selectedBucket = this.#findBucket(request.authorityKey);
      if (!selectedBucket.ok)
        return selectedBucket;
      const evidence = parseEvidence(evidenceValue);
      if (!evidence.ok)
        return evidence;
      const derived = this.#deriveLineage(request, evidence.value);
      if (!derived.ok)
        return derived;
      const derivedIdentity = lineageIdentity(derived.value.lineage);
      if (priorIdentity !== void 0) {
        if (priorIdentity.pathKey !== derived.value.lineage.pathKey || priorIdentity.lineageIdentity !== derivedIdentity) {
          return this.#idempotencyConflict(request.reservationId);
        }
        const priorId = this.#reservationIdByIdempotency.get(request.idempotencyKey);
        const prior = priorId === void 0 ? void 0 : this.#reservations.get(priorId);
        return prior === void 0 ? fail8("VAGP_RESERVATION_INVALID_STORE", "/request/idempotencyKey", "Stored idempotency evidence is inconsistent") : success2(prior);
      }
      if (this.#reservations.size >= this.#limits.maxReservations) {
        return fail8("VAGP_RESERVATION_LIMIT_EXCEEDED", "/request", "Reservation retention limit reached", { reservationId: request.reservationId });
      }
      if (derived.value.buckets.some((bucket) => bucket.reservationIds.size >= this.#limits.maxReservationsPerAuthority)) {
        return fail8("VAGP_RESERVATION_LIMIT_EXCEEDED", "/request", "Per-authority reservation retention limit reached", { reservationId: request.reservationId });
      }
      const amountUnits = finiteNumberToUnits(request.amount);
      let limiting = derived.value.buckets[0];
      let leastAvailable = limiting === void 0 ? 0n : this.#availableUnitsAt(limiting, parsed.value.requestedEpochMilliseconds);
      for (const bucket of derived.value.buckets.slice(1)) {
        const available = this.#availableUnitsAt(bucket, parsed.value.requestedEpochMilliseconds);
        if (available < leastAvailable) {
          limiting = bucket;
          leastAvailable = available;
        }
      }
      if (limiting === void 0) {
        return fail8("VAGP_BUDGET_LINEAGE_EMPTY", "/evidence/path", "A reservation requires at least one finite aggregate ceiling");
      }
      if (amountUnits > leastAvailable) {
        const isAncestor = limiting.key.mandateId !== request.authorityKey.mandateId;
        return fail8(isAncestor ? "VAGP_RESERVATION_INSUFFICIENT_ANCESTRAL_AUTHORITY" : "VAGP_RESERVATION_INSUFFICIENT_AUTHORITY", "/request/amount", isAncestor ? "An ancestral aggregate ceiling has insufficient capacity" : "The funding Mandate aggregate ceiling has insufficient capacity", {
          reservationId: request.reservationId,
          mandateId: request.authorityKey.mandateId,
          limitingMandateId: limiting.key.mandateId,
          requestedAmount: request.amount,
          availableAmount: unitsToFiniteNumber(leastAvailable)
        });
      }
      const charges = freezeCharges(derived.value.buckets.map((bucket) => ({
        authorityKey: bucket.key,
        amount: request.amount
      })));
      const reservation = freezeReservation({
        ...request,
        fundedByMandateId: request.authorityKey.mandateId,
        authorityPathKey: derived.value.lineage.pathKey,
        budgetLineage: derived.value.lineage,
        charges,
        creationStatusEvidence: derived.value.creationStatusEvidence,
        state: "RESERVED",
        terminalAt: null,
        consumption: null,
        invalidation: null
      });
      const mutationTime = this.#acceptMutationTime(parsed.value.requestedEpochMilliseconds);
      if (!mutationTime.ok)
        return mutationTime;
      this.#expireAllAt(parsed.value.requestedEpochMilliseconds, request.requestedAt);
      for (const bucket of derived.value.buckets) {
        bucket.activeUnits += amountUnits;
        bucket.reservationIds.add(reservation.reservationId);
      }
      heapPush(this.#expiryHeap, {
        epochMilliseconds: parsed.value.expiresEpochMilliseconds,
        reservationId: reservation.reservationId
      });
      this.#reservations.set(reservation.reservationId, reservation);
      this.#pathsByReservation.set(reservation.reservationId, derived.value.path);
      this.#identitiesByIdempotency.set(request.idempotencyKey, Object.freeze({
        request,
        pathKey: derived.value.lineage.pathKey,
        lineageIdentity: derivedIdentity
      }));
      this.#reservationIdByIdempotency.set(request.idempotencyKey, reservation.reservationId);
      return success2(reservation);
    } catch {
      return fail8("VAGP_RESERVATION_INVALID_REQUEST", "/request", "Reservation request could not be processed safely");
    }
  }
  commitReservation(reservationIdValue, contextValue) {
    try {
      const reservationId = parseIdentifier(reservationIdValue, "/reservationId");
      if (!reservationId.ok)
        return reservationId;
      const context = parseRevalidationContext(contextValue);
      if (!context.ok)
        return context;
      const reservation = this.#reservations.get(reservationId.value);
      if (reservation === void 0) {
        return fail8("VAGP_RESERVATION_NOT_FOUND", "/reservationId", "Reservation does not exist", { reservationId: reservationId.value });
      }
      if (reservation.state === "COMMITTED")
        return success2(reservation);
      if (reservation.state === "EXPIRED") {
        return fail8("VAGP_RESERVATION_EXPIRED", "/reservationId", "Expired reservations cannot transition", { reservationId: reservation.reservationId });
      }
      if (reservation.state === "INVALIDATED") {
        return fail8("VAGP_RESERVATION_INVALIDATED", "/reservationId", "Invalidated reservations cannot commit", { reservationId: reservation.reservationId });
      }
      if (reservation.state !== "RESERVED") {
        return fail8("VAGP_RESERVATION_ALREADY_TERMINAL", "/reservationId", `Reservation is already terminal in state ${reservation.state}`, { reservationId: reservation.reservationId });
      }
      const buckets = this.#bucketsForReservation(reservation);
      if (!buckets.ok)
        return buckets;
      const path = this.#pathsByReservation.get(reservation.reservationId);
      if (path === void 0 || path.key !== reservation.authorityPathKey || path.mandates.at(-1)?.id !== reservation.fundedByMandateId) {
        return fail8("VAGP_RESERVATION_INVALID_STORE", "/reservation/authorityPathKey", "Stored exact funding path is unavailable or inconsistent", { reservationId: reservation.reservationId });
      }
      const expiresAt = parseCanonicalTimestamp(reservation.expiresAt);
      if (!expiresAt.valid) {
        return fail8("VAGP_RESERVATION_INVALID_STORE", "/reservation/expiresAt", "Stored reservation expiry is not canonical", { reservationId: reservation.reservationId });
      }
      if (expiresAt.epochMilliseconds < context.value.evaluatedAt.epochMilliseconds) {
        const mutationTime2 = this.#acceptMutationTime(context.value.evaluatedAt.epochMilliseconds);
        if (!mutationTime2.ok)
          return mutationTime2;
        this.#expireReservation(reservation, buckets.value, context.value.evaluatedAt.value);
        return fail8("VAGP_RESERVATION_EXPIRED", "/reservationId", "Expired reservations cannot transition", { reservationId: reservation.reservationId });
      }
      const freshness = checkFreshness(path, context.value);
      if (!freshness.ok)
        return freshness;
      const validation = validateAuthorityPathAt(this.#graph, path, context.value.context);
      if (!validation.ok) {
        return fail8("VAGP_RESERVATION_AUTHORITY_UNAVAILABLE", "/context/statuses", validation.errors[0]?.message ?? "Funding path could not be revalidated", { reservationId: reservation.reservationId });
      }
      const statusEvidence = materializeStatusEvidence(validation.value, context.value);
      if (!validation.value.valid) {
        const permanent = this.#permanentInvalidationEvidence(statusEvidence, context.value.evaluatedAt.value);
        if (permanent !== null) {
          const mutationTime2 = this.#acceptMutationTime(context.value.evaluatedAt.epochMilliseconds);
          if (!mutationTime2.ok)
            return mutationTime2;
          const invalidated = this.#invalidateReservation(reservation, permanent);
          if (!invalidated.ok)
            return invalidated;
          return fail8("VAGP_RESERVATION_INVALIDATED", "/reservationId", "Funding path is permanently unusable; reservation was invalidated", { reservationId: reservation.reservationId });
        }
        if (validation.value.reasonCodes.includes("VAGP_PATH_MANDATE_SUSPENDED")) {
          return fail8("VAGP_RESERVATION_AUTHORITY_SUSPENDED", "/context/statuses", "Funding path is suspended at commit time", { reservationId: reservation.reservationId });
        }
        return fail8("VAGP_RESERVATION_AUTHORITY_UNAVAILABLE", "/context/statuses", "Funding path is not currently usable at commit time", { reservationId: reservation.reservationId });
      }
      const mutationTime = this.#acceptMutationTime(context.value.evaluatedAt.epochMilliseconds);
      if (!mutationTime.ok)
        return mutationTime;
      this.#expireAllAt(context.value.evaluatedAt.epochMilliseconds, context.value.evaluatedAt.value);
      const amountUnits = finiteNumberToUnits(reservation.amount);
      for (const bucket of buckets.value) {
        bucket.activeUnits -= amountUnits;
        bucket.committedUnits += amountUnits;
      }
      const consumption = freezeConsumption({
        reservationId: reservation.reservationId,
        authorityKey: reservation.authorityKey,
        amount: reservation.amount,
        committedAt: context.value.evaluatedAt.value,
        charges: reservation.charges,
        statusEvidence
      });
      const committed = freezeReservation({
        ...reservation,
        state: "COMMITTED",
        terminalAt: context.value.evaluatedAt.value,
        consumption,
        invalidation: null
      });
      this.#reservations.set(committed.reservationId, committed);
      return success2(committed);
    } catch {
      return fail8("VAGP_RESERVATION_INVALID_REQUEST", "/reservationId", "Commit command could not be processed safely");
    }
  }
  releaseReservation(reservationIdValue, evaluatedAtValue) {
    try {
      return this.#transition("RELEASED", reservationIdValue, evaluatedAtValue);
    } catch {
      return fail8("VAGP_RESERVATION_INVALID_REQUEST", "/reservationId", "Release command could not be processed safely");
    }
  }
  expireReservationsAt(evaluatedAtValue) {
    try {
      const evaluatedAt = parseTime(evaluatedAtValue, "/evaluatedAt");
      if (!evaluatedAt.ok)
        return evaluatedAt;
      const mutationTime = this.#acceptMutationTime(evaluatedAt.value.epochMilliseconds);
      if (!mutationTime.ok)
        return mutationTime;
      const expired = this.#expireAllAt(evaluatedAt.value.epochMilliseconds, evaluatedAt.value.value).sort(compareReservations);
      return success2(Object.freeze({
        evaluatedAt: evaluatedAt.value.value,
        reservations: Object.freeze(expired)
      }));
    } catch {
      return fail8("VAGP_RESERVATION_INVALID_REQUEST", "/evaluatedAt", "Expiry command could not be processed safely");
    }
  }
  invalidateReservationsAt(contextValue) {
    try {
      const context = parseRevalidationContext(contextValue);
      if (!context.ok)
        return context;
      const planned = [];
      for (const reservation of [...this.#reservations.values()].sort(compareReservations)) {
        if (reservation.state !== "RESERVED")
          continue;
        const path = this.#pathsByReservation.get(reservation.reservationId);
        if (path === void 0) {
          return fail8("VAGP_RESERVATION_INVALID_STORE", "/reservation/authorityPathKey", "Stored exact funding path is unavailable", { reservationId: reservation.reservationId });
        }
        const freshness = checkFreshness(path, context.value);
        if (!freshness.ok)
          return freshness;
        const validation = validateAuthorityPathAt(this.#graph, path, context.value.context);
        if (!validation.ok) {
          return fail8("VAGP_RESERVATION_AUTHORITY_UNAVAILABLE", "/context/statuses", validation.errors[0]?.message ?? "Funding path could not be revalidated", { reservationId: reservation.reservationId });
        }
        if (validation.value.reasonCodes.includes("VAGP_PATH_STATUS_UNAVAILABLE")) {
          return fail8("VAGP_RESERVATION_AUTHORITY_UNAVAILABLE", "/context/statuses", "Funding path status evidence is unavailable", { reservationId: reservation.reservationId });
        }
        const statusEvidence = materializeStatusEvidence(validation.value, context.value);
        const permanent = this.#permanentInvalidationEvidence(statusEvidence, context.value.evaluatedAt.value);
        if (permanent !== null) {
          const buckets = this.#bucketsForReservation(reservation);
          if (!buckets.ok)
            return buckets;
        }
        planned.push({ reservation, invalidation: permanent });
      }
      const mutationTime = this.#acceptMutationTime(context.value.evaluatedAt.epochMilliseconds);
      if (!mutationTime.ok)
        return mutationTime;
      this.#expireAllAt(context.value.evaluatedAt.epochMilliseconds, context.value.evaluatedAt.value);
      const invalidated = [];
      for (const item of planned) {
        if (item.invalidation === null)
          continue;
        const current = this.#reservations.get(item.reservation.reservationId);
        if (current?.state !== "RESERVED")
          continue;
        const transition = this.#invalidateReservation(current, item.invalidation);
        if (!transition.ok)
          return transition;
        invalidated.push(transition.value);
      }
      return success2(Object.freeze({
        evaluatedAt: context.value.evaluatedAt.value,
        reservations: Object.freeze(invalidated)
      }));
    } catch {
      return fail8("VAGP_RESERVATION_INVALID_REQUEST", "/context", "Invalidation command could not be processed safely");
    }
  }
  getAuthorityUsage(authorityKeyValue, evaluatedAtValue) {
    try {
      const key = parseAuthorityKey(authorityKeyValue);
      if (!key.ok)
        return key;
      const bucketResult = this.#findBucket(key.value);
      if (!bucketResult.ok)
        return bucketResult;
      const evaluatedAt = parseTime(evaluatedAtValue, "/evaluatedAt");
      if (!evaluatedAt.ok)
        return evaluatedAt;
      const bucket = bucketResult.value;
      const activeReservations = [...bucket.reservationIds].map((id) => this.#reservations.get(id)).filter((reservation) => reservation?.state === "RESERVED").sort(compareReservations);
      return success2(Object.freeze({
        authorityKey: bucket.key,
        granted: bucket.granted,
        committed: unitsToFiniteNumber(bucket.committedUnits),
        reserved: unitsToFiniteNumber(bucket.activeUnits),
        available: unitsToFiniteNumber(bucket.grantedUnits - bucket.committedUnits - bucket.activeUnits),
        activeReservations: Object.freeze(activeReservations),
        evaluatedAt: evaluatedAt.value.value
      }));
    } catch {
      return fail8("VAGP_RESERVATION_INVALID_REQUEST", "/authorityKey", "Usage query could not be processed safely");
    }
  }
  getReservation(reservationIdValue, evaluatedAtValue) {
    try {
      const reservationId = parseIdentifier(reservationIdValue, "/reservationId");
      if (!reservationId.ok)
        return reservationId;
      const evaluatedAt = parseTime(evaluatedAtValue, "/evaluatedAt");
      if (!evaluatedAt.ok)
        return evaluatedAt;
      const current = this.#reservations.get(reservationId.value);
      return current === void 0 ? fail8("VAGP_RESERVATION_NOT_FOUND", "/reservationId", "Reservation does not exist", { reservationId: reservationId.value }) : success2(current);
    } catch {
      return fail8("VAGP_RESERVATION_INVALID_REQUEST", "/reservationId", "Reservation query could not be processed safely");
    }
  }
  listReservations(evaluatedAtValue) {
    try {
      const evaluatedAt = parseTime(evaluatedAtValue, "/evaluatedAt");
      if (!evaluatedAt.ok)
        return evaluatedAt;
      return success2(Object.freeze([...this.#reservations.values()].sort(compareReservations)));
    } catch {
      return fail8("VAGP_RESERVATION_INVALID_REQUEST", "/evaluatedAt", "Reservation listing could not be processed safely");
    }
  }
  #deriveCanonicalAncestry(leaf) {
    const reversed = [];
    const seen = /* @__PURE__ */ new Set();
    let current = leaf;
    for (let depth = 0; depth < MAX_PATH_MANDATES; depth += 1) {
      if (seen.has(current.id)) {
        return fail8("VAGP_BUDGET_LINEAGE_INVALID", "/mandateId", "Mandate ancestry is cyclic", { mandateId: leaf.id });
      }
      seen.add(current.id);
      reversed.push(current);
      if (current.parentMandate === null) {
        return success2(Object.freeze(reversed.reverse()));
      }
      const parent = this.#graph.getParentMandate(current.id);
      if (parent === void 0 || parent.id !== current.parentMandate) {
        return fail8("VAGP_BUDGET_LINEAGE_GRAPH_MISMATCH", "/mandateId", "Mandate ancestry does not match the canonical Authority Graph", { mandateId: current.id });
      }
      current = parent;
    }
    return fail8("VAGP_BUDGET_LINEAGE_INVALID", "/mandateId", "Mandate ancestry exceeds the VAGP delegation bound", { mandateId: leaf.id });
  }
  #deriveFiniteKeys(mandates, fundedByMandateId) {
    const funded = mandates.at(-1);
    const fundedFinancial = funded?.authority.financial;
    if (funded === void 0 || funded.id !== fundedByMandateId || fundedFinancial === null || fundedFinancial === void 0 || fundedFinancial.maxAggregate === null || mandates.some((mandate2) => mandate2.authority.autonomy.mode === "PROHIBITED")) {
      return fail8("VAGP_RESERVATION_MANDATE_INVALID", "/mandateId", "Funding path must be execution-capable and end in finite aggregate financial authority", { mandateId: fundedByMandateId });
    }
    const keys = [];
    for (const mandate2 of mandates) {
      const financial = mandate2.authority.financial;
      if (financial === null) {
        return fail8("VAGP_BUDGET_LINEAGE_INVALID", "/mandateId", "Financial authority is absent within the funding lineage", { mandateId: mandate2.id });
      }
      if (financial.currency !== fundedFinancial.currency) {
        return fail8("VAGP_BUDGET_LINEAGE_CURRENCY_MISMATCH", "/mandateId", "Financial lineage contains incompatible currencies", { mandateId: mandate2.id });
      }
      if (financial.maxAggregate !== null) {
        keys.push(Object.freeze({
          mandateId: mandate2.id,
          dimension: FINANCIAL_AGGREGATE_DIMENSION,
          currency: financial.currency
        }));
      }
    }
    if (keys.length === 0 || keys.length > this.#limits.maxChargedBucketsPerReservation) {
      return fail8(keys.length === 0 ? "VAGP_BUDGET_LINEAGE_EMPTY" : "VAGP_RESERVATION_LIMIT_EXCEEDED", "/mandateId", keys.length === 0 ? "Funding lineage has no finite aggregate ceiling" : "Funding lineage exceeds the charged-bucket limit", { mandateId: fundedByMandateId });
    }
    const identities = new Set(keys.map(keyIdentity));
    if (identities.size !== keys.length) {
      return fail8("VAGP_BUDGET_LINEAGE_INVALID", "/mandateId", "Funding lineage contains a duplicate finite ceiling", { mandateId: fundedByMandateId });
    }
    return success2(Object.freeze(keys));
  }
  #deriveLineage(request, evidence) {
    const statusContext = parseStatusContext(evidence.validationContext, evidence.maxStatusStalenessMs, "/evidence");
    if (!statusContext.ok)
      return statusContext;
    const freshness = checkFreshness(evidence.path, statusContext.value);
    if (!freshness.ok)
      return freshness;
    const validation = validateAuthorityPathAt(this.#graph, evidence.path, statusContext.value.context);
    if (!validation.ok || !validation.value.valid) {
      return fail8("VAGP_RESERVATION_PATH_INVALID", "/evidence/path", "Reservation requires a currently valid canonical authority path", { mandateId: request.authorityKey.mandateId });
    }
    if (validation.value.evaluatedAt !== request.requestedAt) {
      return fail8("VAGP_RESERVATION_PATH_INVALID", "/evidence/validationContext/evaluatedAt", "Path evaluation time must exactly equal reservation requestedAt", { mandateId: request.authorityKey.mandateId });
    }
    const mandates = validation.value.path.mandates;
    const funded = mandates.at(-1);
    if (funded?.id !== request.authorityKey.mandateId) {
      return fail8("VAGP_RESERVATION_PATH_INVALID", "/evidence/path", "Path does not end at the exact funding Mandate", { mandateId: request.authorityKey.mandateId });
    }
    const keys = this.#deriveFiniteKeys(mandates, request.authorityKey.mandateId);
    if (!keys.ok)
      return keys;
    const fundedKey = keys.value.at(-1);
    if (fundedKey === void 0 || !sameKey(fundedKey, request.authorityKey)) {
      return fail8(fundedKey !== void 0 && fundedKey.currency !== request.authorityKey.currency ? "VAGP_BUDGET_LINEAGE_CURRENCY_MISMATCH" : "VAGP_BUDGET_LINEAGE_GRAPH_MISMATCH", "/request/authorityKey", "Requested authority key does not match the canonical funding Mandate ceiling", { mandateId: request.authorityKey.mandateId });
    }
    let earliestNotAfter = Number.POSITIVE_INFINITY;
    for (const mandate2 of mandates) {
      const financial = mandate2.authority.financial;
      if (financial === null || financial.currency !== request.authorityKey.currency) {
        return fail8("VAGP_BUDGET_LINEAGE_CURRENCY_MISMATCH", "/evidence/path", "Every Mandate in the path must preserve the selected currency", { mandateId: mandate2.id });
      }
      if (financial.maxTransaction !== null && request.amount > financial.maxTransaction) {
        return fail8("VAGP_RESERVATION_INSUFFICIENT_AUTHORITY", "/request/amount", "Reservation amount exceeds a Mandate transaction limit", {
          reservationId: request.reservationId,
          mandateId: mandate2.id,
          limitingMandateId: mandate2.id,
          requestedAmount: request.amount,
          availableAmount: financial.maxTransaction
        });
      }
      const notAfter = parseCanonicalTimestamp(mandate2.validity.notAfter);
      if (!notAfter.valid) {
        return fail8("VAGP_BUDGET_LINEAGE_INVALID", "/evidence/path", "Path contains a non-canonical validity bound", { mandateId: mandate2.id });
      }
      earliestNotAfter = Math.min(earliestNotAfter, notAfter.epochMilliseconds);
    }
    const expiresAt = parseCanonicalTimestamp(request.expiresAt);
    if (!expiresAt.valid || expiresAt.epochMilliseconds > earliestNotAfter) {
      return fail8("VAGP_RESERVATION_VALIDITY_EXCEEDED", "/request/expiresAt", "Reservation expiry must not exceed any Mandate validity in the complete path", {
        reservationId: request.reservationId,
        mandateId: request.authorityKey.mandateId
      });
    }
    const buckets = [];
    for (const key of keys.value) {
      const bucket = this.#buckets.get(keyIdentity(key));
      if (bucket === void 0) {
        return fail8("VAGP_STATEFUL_AUTHORITY_NOT_FOUND", "/request/authorityKey", "Every finite authority bucket in the canonical lineage must be registered", { mandateId: key.mandateId });
      }
      buckets.push(bucket);
    }
    const lineage = freezeLineage({
      pathKey: validation.value.path.key,
      fundedByMandateId: request.authorityKey.mandateId,
      currency: request.authorityKey.currency,
      buckets: keys.value
    });
    return success2(Object.freeze({
      lineage,
      buckets: Object.freeze(buckets),
      path: validation.value.path,
      creationStatusEvidence: materializeStatusEvidence(validation.value, statusContext.value)
    }));
  }
  #findBucket(key) {
    const exact = this.#buckets.get(keyIdentity(key));
    if (exact !== void 0)
      return success2(exact);
    const mandate2 = this.#graph.getMandate(key.mandateId);
    if (mandate2?.authority.financial !== null && mandate2?.authority.financial !== void 0 && mandate2.authority.financial.currency !== key.currency) {
      return fail8("VAGP_RESERVATION_CURRENCY_MISMATCH", "/authorityKey/currency", "Currency does not match the canonical Mandate authority bucket", { mandateId: key.mandateId });
    }
    return fail8("VAGP_STATEFUL_AUTHORITY_NOT_FOUND", "/authorityKey", "Stateful authority has not been registered", { mandateId: key.mandateId });
  }
  #idempotencyConflict(reservationId) {
    return fail8("VAGP_RESERVATION_IDEMPOTENCY_CONFLICT", "/request/idempotencyKey", "Idempotency key was already used with different security-relevant parameters or budget lineage", { reservationId });
  }
  #transition(target, reservationIdValue, evaluatedAtValue) {
    const reservationId = parseIdentifier(reservationIdValue, "/reservationId");
    if (!reservationId.ok)
      return reservationId;
    const evaluatedAt = parseTime(evaluatedAtValue, "/evaluatedAt");
    if (!evaluatedAt.ok)
      return evaluatedAt;
    const reservation = this.#reservations.get(reservationId.value);
    if (reservation === void 0) {
      return fail8("VAGP_RESERVATION_NOT_FOUND", "/reservationId", "Reservation does not exist", { reservationId: reservationId.value });
    }
    if (reservation.state === target)
      return success2(reservation);
    if (reservation.state === "EXPIRED") {
      return fail8("VAGP_RESERVATION_EXPIRED", "/reservationId", "Expired reservations cannot transition", { reservationId: reservation.reservationId });
    }
    if (reservation.state === "INVALIDATED") {
      return fail8("VAGP_RESERVATION_INVALIDATED", "/reservationId", "Invalidated reservations cannot transition", { reservationId: reservation.reservationId });
    }
    if (reservation.state !== "RESERVED") {
      return fail8("VAGP_RESERVATION_ALREADY_TERMINAL", "/reservationId", `Reservation is already terminal in state ${reservation.state}`, { reservationId: reservation.reservationId });
    }
    const buckets = this.#bucketsForReservation(reservation);
    if (!buckets.ok)
      return buckets;
    const requestedAt = parseCanonicalTimestamp(reservation.requestedAt);
    if (!requestedAt.valid || evaluatedAt.value.epochMilliseconds < requestedAt.epochMilliseconds) {
      return fail8("VAGP_RESERVATION_INVALID_REQUEST", "/evaluatedAt", "A reservation cannot transition before its requestedAt time", { reservationId: reservation.reservationId });
    }
    const expiresAt = parseCanonicalTimestamp(reservation.expiresAt);
    if (!expiresAt.valid) {
      return fail8("VAGP_RESERVATION_INVALID_STORE", "/reservation/expiresAt", "Stored reservation expiry is not canonical", { reservationId: reservation.reservationId });
    }
    if (expiresAt.epochMilliseconds < evaluatedAt.value.epochMilliseconds) {
      const mutationTime2 = this.#acceptMutationTime(evaluatedAt.value.epochMilliseconds);
      if (!mutationTime2.ok)
        return mutationTime2;
      this.#expireReservation(reservation, buckets.value, evaluatedAt.value.value);
      return fail8("VAGP_RESERVATION_EXPIRED", "/reservationId", "Expired reservations cannot transition", { reservationId: reservation.reservationId });
    }
    const mutationTime = this.#acceptMutationTime(evaluatedAt.value.epochMilliseconds);
    if (!mutationTime.ok)
      return mutationTime;
    this.#expireAllAt(evaluatedAt.value.epochMilliseconds, evaluatedAt.value.value);
    const amountUnits = finiteNumberToUnits(reservation.amount);
    for (const bucket of buckets.value) {
      bucket.activeUnits -= amountUnits;
    }
    const transitioned = freezeReservation({
      ...reservation,
      state: target,
      terminalAt: evaluatedAt.value.value,
      consumption: null,
      invalidation: null
    });
    this.#reservations.set(transitioned.reservationId, transitioned);
    return success2(transitioned);
  }
  #acceptMutationTime(epochMilliseconds) {
    if (this.#lastMutationEpochMilliseconds !== null && epochMilliseconds < this.#lastMutationEpochMilliseconds) {
      return fail8("VAGP_TIME_NON_MONOTONIC", "/evaluatedAt", "Mutating reservation commands must not move security time backwards");
    }
    this.#lastMutationEpochMilliseconds = epochMilliseconds;
    return success2(true);
  }
  #availableUnitsAt(bucket, evaluatedEpochMilliseconds) {
    let projectedActiveUnits = bucket.activeUnits;
    for (const reservationId of bucket.reservationIds) {
      const reservation = this.#reservations.get(reservationId);
      if (reservation === void 0 || reservation.state !== "RESERVED") {
        continue;
      }
      const expiresAt = parseCanonicalTimestamp(reservation.expiresAt);
      if (!expiresAt.valid) {
        throw new Error("Invariant violation: reservation expiry is invalid");
      }
      if (expiresAt.epochMilliseconds < evaluatedEpochMilliseconds) {
        projectedActiveUnits -= finiteNumberToUnits(reservation.amount);
      }
    }
    return bucket.grantedUnits - bucket.committedUnits - projectedActiveUnits;
  }
  #expireReservation(reservation, buckets, evaluatedAt) {
    const amountUnits = finiteNumberToUnits(reservation.amount);
    for (const bucket of buckets) {
      bucket.activeUnits -= amountUnits;
    }
    const transitioned = freezeReservation({
      ...reservation,
      state: "EXPIRED",
      terminalAt: evaluatedAt,
      consumption: null
    });
    this.#reservations.set(transitioned.reservationId, transitioned);
    return transitioned;
  }
  #permanentInvalidationEvidence(statusEvidence, invalidatedAt) {
    const affected = [];
    for (const mandate2 of statusEvidence.mandates) {
      if (mandate2.effectiveState === "REVOKED" || mandate2.effectiveState === "EXPIRED") {
        affected.push(Object.freeze({
          mandateId: mandate2.mandateId,
          effectiveState: mandate2.effectiveState
        }));
      }
    }
    if (affected.length === 0)
      return null;
    return freezeInvalidationEvidence({
      invalidatedAt,
      observedAt: statusEvidence.observedAt,
      reason: affected.some((mandate2) => mandate2.effectiveState === "REVOKED") ? "MANDATE_REVOKED" : "MANDATE_EXPIRED",
      affectedMandates: Object.freeze(affected),
      statusEvidence
    });
  }
  #invalidateReservation(reservation, invalidation) {
    if (reservation.state === "INVALIDATED")
      return success2(reservation);
    if (reservation.state !== "RESERVED") {
      return fail8("VAGP_RESERVATION_ALREADY_TERMINAL", "/reservationId", `Reservation is already terminal in state ${reservation.state}`, { reservationId: reservation.reservationId });
    }
    const buckets = this.#bucketsForReservation(reservation);
    if (!buckets.ok)
      return buckets;
    const amountUnits = finiteNumberToUnits(reservation.amount);
    for (const bucket of buckets.value) {
      bucket.activeUnits -= amountUnits;
    }
    const invalidated = freezeReservation({
      ...reservation,
      state: "INVALIDATED",
      terminalAt: invalidation.invalidatedAt,
      consumption: null,
      invalidation
    });
    this.#reservations.set(invalidated.reservationId, invalidated);
    return success2(invalidated);
  }
  #bucketsForReservation(reservation) {
    const buckets = [];
    for (const charge of reservation.charges) {
      const bucket = this.#buckets.get(keyIdentity(charge.authorityKey));
      if (bucket === void 0) {
        return fail8("VAGP_RESERVATION_INVALID_STORE", "/reservation/charges", "Reservation charge bucket is missing", { reservationId: reservation.reservationId });
      }
      buckets.push(bucket);
    }
    return success2(Object.freeze(buckets));
  }
  #expireAllAt(evaluatedEpochMilliseconds, evaluatedAt) {
    const expired = [];
    while (this.#expiryHeap.length > 0) {
      const next = this.#expiryHeap[0];
      if (next === void 0 || next.epochMilliseconds >= evaluatedEpochMilliseconds) {
        break;
      }
      const entry = heapPop(this.#expiryHeap);
      if (entry === void 0)
        break;
      const reservation = this.#reservations.get(entry.reservationId);
      if (reservation === void 0 || reservation.state !== "RESERVED") {
        continue;
      }
      const buckets = this.#bucketsForReservation(reservation);
      if (!buckets.ok) {
        throw new Error("Invariant violation: reservation charge bucket missing");
      }
      expired.push(this.#expireReservation(reservation, buckets.value, evaluatedAt));
    }
    return expired;
  }
};
Object.freeze(InMemoryReservationStore.prototype);
function isReservationStoreForGraph(value, graph) {
  return value !== null && typeof value === "object" && reservationStoreGraphs.has(value) && reservationStoreGraphs.get(value) === graph;
}
function isCurrentAuthorityReservation(storeValue, reservationValue) {
  try {
    if (storeValue === null || typeof storeValue !== "object" || !reservationStoreGraphs.has(storeValue) || reservationValue === null || typeof reservationValue !== "object" || !constructedReservations.has(reservationValue)) {
      return false;
    }
    const store = storeValue;
    const reservation = reservationValue;
    const current = store.getReservation(reservation.reservationId, reservation.requestedAt);
    return current.ok && current.value === reservationValue;
  } catch {
    return false;
  }
}

// ../../packages/decisions/dist/bind.js
var decisionProvenance = /* @__PURE__ */ new WeakMap();
var INPUT_KEYS2 = /* @__PURE__ */ new Set([
  "graph",
  "request",
  "context",
  "resolution",
  "qualifyingPathKey",
  "reservationStore",
  "reservation",
  "evaluatedAt"
]);
function error3(code, path, message) {
  const detail = Object.freeze({ code, path, message });
  return Object.freeze({ ok: false, errors: Object.freeze([detail]) });
}
function success3(value) {
  return Object.freeze({ ok: true, value });
}
function materializeInput2(value) {
  try {
    if (value === null || typeof value !== "object" || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) {
      return null;
    }
    const keys = Reflect.ownKeys(value);
    if (keys.length !== INPUT_KEYS2.size || keys.some((key) => typeof key !== "string" || !INPUT_KEYS2.has(key))) {
      return null;
    }
    const snapshot = /* @__PURE__ */ Object.create(null);
    for (const key of keys) {
      if (typeof key !== "string")
        return null;
      const descriptor = Reflect.getOwnPropertyDescriptor(value, key);
      if (descriptor === void 0 || !descriptor.enumerable || !Object.hasOwn(descriptor, "value")) {
        return null;
      }
      snapshot[key] = descriptor.value;
    }
    return Object.freeze({ ok: true, value: Object.freeze(snapshot) });
  } catch {
    return null;
  }
}
function freezeRequest(request) {
  return Object.freeze({
    vagp: request.vagp,
    type: request.type,
    id: request.id,
    agent: Object.freeze({ id: request.agent.id }),
    principalHint: request.principalHint === null ? null : Object.freeze({ id: request.principalHint.id }),
    action: request.action,
    resource: Object.freeze({ id: request.resource.id }),
    parametersDigest: request.parametersDigest,
    requestedAt: request.requestedAt,
    nonce: request.nonce
  });
}
function requestIdentity(request) {
  return Object.freeze({
    agentId: request.agent.id,
    requestId: request.id
  });
}
function freezeContext(context) {
  const attributes = /* @__PURE__ */ Object.create(null);
  for (const key of Object.keys(context.attributes).sort()) {
    const value = context.attributes[key];
    if (value !== void 0)
      attributes[key] = value;
  }
  return Object.freeze({
    resource: Object.freeze({ id: context.resource.id }),
    attributes: Object.freeze(attributes),
    autonomy: context.autonomy,
    assurance: context.assurance,
    financial: context.financial === null ? null : Object.freeze({
      currency: context.financial.currency,
      amount: context.financial.amount
    }),
    ...context.requiredCapabilities === void 0 ? {} : {
      requiredCapabilities: Object.freeze(context.requiredCapabilities.map((entry) => Object.freeze({ id: entry.id, version: entry.version })))
    }
  });
}
function bindAgentStates(selected, available) {
  const result = [];
  for (const mandate2 of selected.path.mandates) {
    if (mandate2.vagp !== "0.3")
      continue;
    const state = available.find((candidate) => candidate.subject.agentId === mandate2.subject.id);
    if (state === void 0)
      return null;
    result.push(Object.freeze({
      mandateId: mandate2.id,
      authorityDomainId: state.authorityDomainId,
      subject: Object.freeze(structuredClone(state.subject)),
      attestationId: state.attestationId,
      attestationIssuerId: state.attestationIssuerId,
      observedAt: state.observedAt,
      expiresAt: state.expiresAt,
      statusRef: state.statusRef,
      capabilities: Object.freeze(state.capabilities.map((entry) => Object.freeze({ ...entry })))
    }));
  }
  return Object.freeze(result);
}
function trustedContextProjection(selected, context) {
  const relevantNames = /* @__PURE__ */ new Set();
  for (const mandate2 of selected.path.mandates) {
    for (const name of Object.keys(mandate2.authority.constraints)) {
      relevantNames.add(name);
    }
  }
  const relevantAttributes = /* @__PURE__ */ Object.create(null);
  for (const name of [...relevantNames].sort()) {
    const value = context.attributes[name];
    if (value !== void 0) {
      relevantAttributes[name] = value;
    }
  }
  return Object.freeze({
    autonomy: context.autonomy,
    assurance: context.assurance,
    relevantAttributes: Object.freeze(relevantAttributes)
  });
}
function freezeAuthorityKey(key) {
  return Object.freeze({
    mandateId: key.mandateId,
    dimension: key.dimension,
    currency: key.currency
  });
}
function freezeStatusEvidence2(evidence) {
  return Object.freeze({
    evaluatedAt: evidence.evaluatedAt,
    observedAt: evidence.observedAt,
    maxStatusStalenessMs: evidence.maxStatusStalenessMs,
    pathValid: evidence.pathValid,
    mandates: Object.freeze(evidence.mandates.map((mandate2) => Object.freeze({
      mandateId: mandate2.mandateId,
      statusRef: mandate2.statusRef,
      effectiveState: mandate2.effectiveState,
      effectiveRecord: mandate2.effectiveRecord === null ? null : Object.freeze({ ...mandate2.effectiveRecord })
    })))
  });
}
function boundPath(selected) {
  const validation = selected.currentPathValidation;
  return Object.freeze({
    pathKey: selected.path.key,
    principalId: selected.path.principal.id,
    agentId: selected.path.agent.id,
    mandateIds: Object.freeze(selected.path.mandates.map((mandate2) => mandate2.id)),
    currentlyValid: selected.currentlyValid,
    authoritySatisfied: selected.authoritySatisfied,
    disposition: selected.additionalStateRequired ? "STATEFUL_REQUIREMENT_SATISFIED" : "QUALIFIED_STATELESS",
    validity: Object.freeze({
      evaluatedAt: validation.evaluatedAt,
      valid: validation.valid,
      mandateResults: Object.freeze(validation.mandateResults.map((mandate2) => Object.freeze({
        mandateId: mandate2.mandateId,
        structurallyValid: mandate2.structurallyValid,
        temporallyValid: mandate2.temporallyValid,
        lifecycleState: mandate2.lifecycleState,
        usable: mandate2.usable,
        reasonCodes: Object.freeze([...mandate2.reasonCodes])
      }))),
      reasonCodes: Object.freeze([...validation.reasonCodes])
    }),
    resolutionReasonCodes: Object.freeze([...selected.reasonCodes])
  });
}
function boundReservation(reservation) {
  return Object.freeze({
    reservationId: reservation.reservationId,
    authorityKey: freezeAuthorityKey(reservation.authorityKey),
    authorityPathKey: reservation.authorityPathKey,
    fundedByMandateId: reservation.fundedByMandateId,
    amount: reservation.amount,
    currency: reservation.authorityKey.currency,
    requestedAt: reservation.requestedAt,
    expiresAt: reservation.expiresAt,
    state: "RESERVED",
    creationStatusEvidence: freezeStatusEvidence2(reservation.creationStatusEvidence)
  });
}
function decisionKey(request, trustedContext, financial) {
  return JSON.stringify([
    "vagp-bound-authority-decision",
    request.vagp,
    {
      agentId: request.agent.id,
      requestId: request.id,
      principalHintId: request.principalHint?.id ?? null,
      action: request.action,
      resourceId: request.resource.id,
      parametersDigest: request.parametersDigest,
      financial,
      trustedContext
    }
  ]);
}
function selectedPath(resolution, key) {
  const matches = resolution.pathResults.filter((result) => result.path.key === key);
  return matches.length === 1 ? matches[0] ?? null : null;
}
function compareStrings(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}
function comparePathResults(left, right) {
  const principalOrder = compareStrings(left.path.principal.id, right.path.principal.id);
  if (principalOrder !== 0)
    return principalOrder;
  if (left.path.mandates.length !== right.path.mandates.length) {
    return left.path.mandates.length - right.path.mandates.length;
  }
  for (let index = 0; index < left.path.mandates.length; index += 1) {
    const leftId = left.path.mandates[index]?.id ?? "";
    const rightId = right.path.mandates[index]?.id ?? "";
    const mandateOrder = compareStrings(leftId, rightId);
    if (mandateOrder !== 0)
      return mandateOrder;
  }
  return compareStrings(left.path.key, right.path.key);
}
function canonicalSelectedPath(resolution) {
  const eligible = resolution.outcome === "AUTHORITY_CONFIRMED" ? resolution.pathResults.filter((result) => result.qualifies) : resolution.outcome === "ADDITIONAL_STATE_REQUIRED" ? resolution.pathResults.filter((result) => result.additionalStateRequired) : [];
  const selected = eligible.toSorted(comparePathResults)[0];
  return selected ?? null;
}
function effectiveFreshness(values) {
  const concrete = values.filter((value) => value !== null);
  return concrete.length === 0 ? null : Math.min(...concrete);
}
function issuerPathMaxStatusStalenessMs(selected) {
  const ceilings = [];
  for (const mandate2 of selected.path.mandates) {
    if ("revocation" in mandate2.authority) {
      ceilings.push(mandate2.authority.revocation.maxStatusStalenessMs);
    } else if (mandate2.vagp === "0.2") {
      return void 0;
    }
  }
  if (ceilings.length === 0) {
    return null;
  }
  if (ceilings.length !== selected.path.mandates.length) {
    return void 0;
  }
  return Math.min(...ceilings);
}
function selectedPathVersion(selected) {
  const first = selected.path.mandates[0]?.vagp;
  if (first === void 0)
    return void 0;
  return selected.path.mandates.every((mandate2) => mandate2.vagp === first) ? first : void 0;
}
function bindAuthorityDecision(inputValue) {
  try {
    const input = materializeInput2(inputValue);
    if (input === null) {
      return error3("VAGP_BINDING_INVALID_INPUT", "/input", "Binding input must be a closed plain object with safe data properties");
    }
    const graph = input.value["graph"];
    const request = input.value["request"];
    const context = input.value["context"];
    const resolutionValue = input.value["resolution"];
    const provenance = getAuthorityResolutionProvenance(resolutionValue);
    if (provenance === void 0) {
      return error3("VAGP_BINDING_RESOLUTION_INVALID", "/resolution", "Resolution must be an authentic local resolveAuthority result");
    }
    if (!matchesAuthorityResolutionGraph(resolutionValue, graph)) {
      return error3("VAGP_BINDING_GRAPH_MISMATCH", "/graph", "Resolution was produced from a different Authority Graph instance");
    }
    if (!matchesAuthorityResolutionRequest(resolutionValue, request)) {
      return error3("VAGP_BINDING_REQUEST_MISMATCH", "/request", "Request is not the same semantic source evaluated by RESOLVE");
    }
    if (!matchesAuthorityResolutionContext(resolutionValue, context)) {
      return error3("VAGP_BINDING_CONTEXT_MISMATCH", "/context", "Context is not the exact unchanged trusted source evaluated by RESOLVE");
    }
    const resolution = resolutionValue;
    if (resolution.outcome === "NO_AUTHORITY") {
      return error3("VAGP_BINDING_RESOLUTION_INVALID", "/resolution/outcome", "NO_AUTHORITY cannot produce a positive Bound Authority Decision");
    }
    const pathKey2 = input.value["qualifyingPathKey"];
    if (typeof pathKey2 !== "string" || pathKey2.length === 0) {
      return error3("VAGP_BINDING_PATH_MISMATCH", "/qualifyingPathKey", "One canonical path key must be selected explicitly");
    }
    const selected = selectedPath(resolution, pathKey2);
    if (selected === null) {
      return error3("VAGP_BINDING_PATH_MISMATCH", "/qualifyingPathKey", "Selected path is not an exact path witness in this resolution");
    }
    if (!selected.qualifies && !selected.additionalStateRequired) {
      return error3("VAGP_BINDING_PATH_NOT_QUALIFYING", "/qualifyingPathKey", "Selected path did not qualify for the resolved request and context");
    }
    const canonical = canonicalSelectedPath(resolution);
    if (canonical === null || canonical.path.key !== selected.path.key) {
      return error3("VAGP_BINDING_PATH_SELECTION_MISMATCH", "/qualifyingPathKey", "Selected path must equal the canonical VAGP-selected path for this Request Identity");
    }
    const evaluatedAt = input.value["evaluatedAt"];
    const timestamp = parseCanonicalTimestamp(evaluatedAt);
    if (typeof evaluatedAt !== "string" || !timestamp.valid || evaluatedAt !== resolution.evaluatedAt) {
      return error3("VAGP_BINDING_EVALUATION_TIME_MISMATCH", "/evaluatedAt", "Binding evaluation time must exactly equal RESOLVE evaluatedAt");
    }
    let reservationEvidence = null;
    const reservationStore = input.value["reservationStore"];
    const reservationValue = input.value["reservation"];
    if (selected.additionalStateRequired) {
      if (reservationStore === null || reservationValue === null) {
        return error3("VAGP_BINDING_RESERVATION_REQUIRED", "/reservation", "This selected path requires an exact live reservation");
      }
      if (!isReservationStoreForGraph(reservationStore, graph)) {
        return error3("VAGP_BINDING_RESERVATION_INVALID", "/reservationStore", "Reservation store is not authoritative for the selected graph instance");
      }
      if (!isCurrentAuthorityReservation(reservationStore, reservationValue)) {
        return error3("VAGP_BINDING_RESERVATION_INVALID", "/reservation", "Reservation is forged, stale, or belongs to another store");
      }
      const reservation = reservationValue;
      if (reservation.state !== "RESERVED" || !reservation.creationStatusEvidence.pathValid || reservation.requestedAt !== evaluatedAt) {
        return error3("VAGP_BINDING_RESERVATION_INVALID", "/reservation/state", "A new positive decision requires a current RESERVED reservation created for this evaluation");
      }
      if (reservation.authorityPathKey !== selected.path.key || reservation.fundedByMandateId !== selected.path.mandates.at(-1)?.id) {
        return error3("VAGP_BINDING_RESERVATION_PATH_MISMATCH", "/reservation/authorityPathKey", "Reservation was not funded through the exact selected path");
      }
      if (provenance.context.financial === null || !Object.is(reservation.amount, provenance.context.financial.amount) || reservation.authorityKey.currency !== provenance.context.financial.currency) {
        return error3("VAGP_BINDING_FINANCIAL_MISMATCH", "/reservation/amount", "Reservation amount and currency must exactly match resolved financial context");
      }
      reservationEvidence = boundReservation(reservation);
    } else if (reservationStore !== null || reservationValue !== null) {
      return error3("VAGP_BINDING_RESERVATION_INVALID", "/reservation", "A stateless selected path must not acquire unrelated reservation evidence");
    }
    const requestEvidence = freezeRequest(provenance.request);
    const contextEvidence = freezeContext(provenance.context);
    if (requestEvidence.resource.id !== contextEvidence.resource.id) {
      return error3("VAGP_BINDING_CONTEXT_MISMATCH", "/context/resource/id", "Resolved request and context resources are not identical");
    }
    const pathEvidence = boundPath(selected);
    const resolutionEvidence = Object.freeze({
      outcome: resolution.outcome,
      evaluatedAt: resolution.evaluatedAt,
      reasonCodes: Object.freeze([...resolution.reasonCodes])
    });
    const version = selectedPathVersion(selected);
    if (version === void 0 || version !== requestEvidence.vagp) {
      return error3("VAGP_BINDING_RESOLUTION_INVALID", "/authorityPath/mandates", "Bound decisions require a homogeneous authority path matching the request VAGP version");
    }
    const issuerFreshness = issuerPathMaxStatusStalenessMs(selected);
    if (issuerFreshness === void 0) {
      return error3("VAGP_BINDING_RESOLUTION_INVALID", "/authorityPath/mandates", "v0.2 revocation freshness semantics must be present on every mandate in the selected path");
    }
    const profileFreshness = selected.currentPathValidation.profileMaxStatusStalenessMs;
    const runtimeFreshness = reservationEvidence?.creationStatusEvidence.maxStatusStalenessMs ?? null;
    const currentAuthority = Object.freeze({
      issuerMaxStatusStalenessMs: issuerFreshness,
      profileMaxStatusStalenessMs: profileFreshness,
      maxStatusStalenessMs: effectiveFreshness([
        issuerFreshness,
        profileFreshness,
        runtimeFreshness
      ])
    });
    const trustedContextEvidence = trustedContextProjection(selected, contextEvidence);
    const agentStates = bindAgentStates(selected, provenance.validation.agentStates ?? []);
    if (agentStates === null) {
      return error3("VAGP_BINDING_RESOLUTION_INVALID", "/agentStates", "VAGP 0.3 binding requires trusted state evidence for every selected-path subject");
    }
    const key = decisionKey(requestEvidence, trustedContextEvidence, contextEvidence.financial);
    const decision = Object.freeze({
      version,
      decisionKey: key,
      requestIdentity: requestIdentity(requestEvidence),
      request: requestEvidence,
      context: contextEvidence,
      trustedContext: trustedContextEvidence,
      resolution: resolutionEvidence,
      authorityPath: pathEvidence,
      currentAuthority,
      agentStates,
      statefulAuthority: reservationEvidence,
      evaluatedAt
    });
    decisionProvenance.set(decision, Object.freeze({
      graph: provenance.graph,
      path: selected.path,
      reservationStore: reservationEvidence === null ? null : reservationStore,
      reservation: reservationEvidence === null ? null : reservationValue
    }));
    return success3(decision);
  } catch {
    return error3("VAGP_BINDING_INVALID_INPUT", "/input", "Binding input could not be processed safely");
  }
}
function getBoundAuthorityDecisionProvenance(value) {
  if (value === null || typeof value !== "object")
    return void 0;
  return decisionProvenance.get(value);
}

// ../../packages/grants/dist/derive.js
var INPUT_KEYS3 = /* @__PURE__ */ new Set([
  "decision",
  "grantId",
  "idempotencyKey",
  "derivedAt",
  "requestedValidUntil",
  "validationContext"
]);
var VALIDATION_KEYS = /* @__PURE__ */ new Set([
  "evaluatedAt",
  "statuses",
  "profileMaxStatusStalenessMs",
  "agentStates"
]);
var REQUIRED_VALIDATION_KEYS = /* @__PURE__ */ new Set(["evaluatedAt", "statuses"]);
var IDENTIFIER = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
var InMemoryExecutionGrantRegistry = class {
  implementation = "IN_MEMORY_REFERENCE";
};
Object.freeze(InMemoryExecutionGrantRegistry.prototype);
var registryStates = /* @__PURE__ */ new WeakMap();
var authorityDomainStates = /* @__PURE__ */ new Map();
var legacyGraphDomainStates = /* @__PURE__ */ new WeakMap();
var authenticGrants = /* @__PURE__ */ new WeakSet();
var grantProvenance = /* @__PURE__ */ new WeakMap();
function failure3(code, path, message, causeCode) {
  const detail = Object.freeze({
    code,
    path,
    message,
    ...causeCode === void 0 ? {} : { causeCode }
  });
  return Object.freeze({ ok: false, errors: Object.freeze([detail]) });
}
function success4(value) {
  return Object.freeze({ ok: true, value });
}
function closedObject2(value, keys, requiredKeys = keys) {
  try {
    if (value === null || typeof value !== "object" || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) {
      return null;
    }
    const ownKeys = Reflect.ownKeys(value);
    if (ownKeys.some((key) => typeof key !== "string" || !keys.has(key)) || [...requiredKeys].some((key) => !ownKeys.includes(key))) {
      return null;
    }
    const result = /* @__PURE__ */ Object.create(null);
    for (const key of ownKeys) {
      if (typeof key !== "string")
        return null;
      const descriptor = Reflect.getOwnPropertyDescriptor(value, key);
      if (descriptor === void 0 || !descriptor.enumerable || !Object.hasOwn(descriptor, "value")) {
        return null;
      }
      result[key] = descriptor.value;
    }
    return Object.freeze(result);
  } catch {
    return null;
  }
}
function parsedTime(value) {
  const parsed = parseCanonicalTimestamp(value);
  return typeof value === "string" && parsed.valid ? Object.freeze({
    value,
    epochMilliseconds: parsed.epochMilliseconds
  }) : null;
}
function identifier(value) {
  return typeof value === "string" && IDENTIFIER.test(value);
}
function parseInput(value) {
  const input = closedObject2(value, INPUT_KEYS3);
  if (input === null) {
    return failure3("VAGP_DERIVE_INVALID_INPUT", "/input", "DERIVE input must be a closed plain object with safe data properties");
  }
  const decisionValue = input["decision"];
  const provenance = getBoundAuthorityDecisionProvenance(decisionValue);
  if (provenance === void 0) {
    return failure3("VAGP_DERIVE_DECISION_INVALID", "/decision", "DERIVE requires an authentic local Bound Authority Decision");
  }
  const grantId = input["grantId"];
  const idempotencyKey = input["idempotencyKey"];
  if (!identifier(grantId) || !identifier(idempotencyKey)) {
    return failure3("VAGP_DERIVE_INVALID_INPUT", !identifier(grantId) ? "/grantId" : "/idempotencyKey", "Grant and idempotency identifiers must use 1-128 safe ASCII characters");
  }
  const derivedAt = parsedTime(input["derivedAt"]);
  const requestedValidUntil = parsedTime(input["requestedValidUntil"]);
  if (derivedAt === null || requestedValidUntil === null) {
    return failure3("VAGP_DERIVE_VALIDITY_INVALID", derivedAt === null ? "/derivedAt" : "/requestedValidUntil", "DERIVE times must be canonical UTC millisecond timestamps");
  }
  const decision = decisionValue;
  const decisionTime = parsedTime(decision.evaluatedAt);
  if (decisionTime === null || derivedAt.epochMilliseconds < decisionTime.epochMilliseconds || requestedValidUntil.epochMilliseconds < derivedAt.epochMilliseconds) {
    return failure3("VAGP_DERIVE_VALIDITY_INVALID", "/requestedValidUntil", "DERIVE cannot predate binding and requested validity cannot end before derivation");
  }
  const validationValue = closedObject2(input["validationContext"], VALIDATION_KEYS, REQUIRED_VALIDATION_KEYS);
  if (validationValue === null) {
    return failure3("VAGP_DERIVE_INVALID_INPUT", "/validationContext", "Current validation context must be a closed safe object");
  }
  if (validationValue["evaluatedAt"] !== derivedAt.value) {
    return failure3("VAGP_DERIVE_VALIDITY_INVALID", "/validationContext/evaluatedAt", "Current validation time must exactly equal derivedAt");
  }
  const suppliedStatuses = validationValue["statuses"];
  const statuses = isMandateStatusSnapshot(suppliedStatuses) ? { ok: true, value: suppliedStatuses } : buildMandateStatusSnapshot(suppliedStatuses);
  if (!statuses.ok) {
    return failure3("VAGP_DERIVE_PATH_NOT_CURRENT", "/validationContext/statuses", statuses.errors[0]?.message ?? "Current status evidence is invalid", statuses.errors[0]?.code);
  }
  const observedAt = parsedTime(statuses.value.observedAt);
  if (observedAt === null) {
    return failure3("VAGP_DERIVE_PATH_NOT_CURRENT", "/validationContext/statuses/observedAt", "Status observation time is invalid");
  }
  if (observedAt.epochMilliseconds > derivedAt.epochMilliseconds) {
    return failure3("VAGP_DERIVE_STATUS_FUTURE", "/validationContext/statuses/observedAt", "Status evidence cannot be observed after derivedAt");
  }
  const freshness = decision.currentAuthority.maxStatusStalenessMs;
  if (freshness !== null && provenance.path.mandates.some((mandate2) => mandate2.statusRef !== null) && derivedAt.epochMilliseconds - observedAt.epochMilliseconds > freshness) {
    return failure3("VAGP_DERIVE_STATUS_STALE", "/validationContext/statuses/observedAt", "Current status evidence exceeds the freshness requirement bound into the decision");
  }
  const profileValue = validationValue["profileMaxStatusStalenessMs"];
  if (profileValue !== void 0 && profileValue !== null && (typeof profileValue !== "number" || !Number.isSafeInteger(profileValue) || Object.is(profileValue, -0) || profileValue < 0)) {
    return failure3("VAGP_DERIVE_INVALID_INPUT", "/validationContext/profileMaxStatusStalenessMs", "Profile freshness ceiling must be null or a non-negative safe integer");
  }
  const statesValue = validationValue["agentStates"];
  let agentStates;
  if (statesValue !== void 0) {
    if (!Array.isArray(statesValue) || statesValue.some((state) => !isTrustedAgentStateEvidence(state)) || new Set(statesValue.map((state) => state.subject.agentId)).size !== statesValue.length) {
      return failure3("VAGP_DERIVE_AGENT_STATE_INVALID", "/validationContext/agentStates", "Agent state evidence must originate from a trusted state provider");
    }
    agentStates = Object.freeze(statesValue);
  }
  if (decision.version === "0.3") {
    if (agentStates === void 0) {
      return failure3("VAGP_DERIVE_AGENT_STATE_INVALID", "/validationContext/agentStates", "VAGP 0.3 DERIVE requires current trusted Agent state evidence");
    }
    const current = agentStates;
    for (const bound of decision.agentStates) {
      const state = current.find((candidate) => candidate.subject.agentId === bound.subject.agentId);
      if (state === void 0 || state.authorityDomainId !== bound.authorityDomainId || state.attestationId !== bound.attestationId || state.subject.stateRevision !== bound.subject.stateRevision || state.subject.fingerprint.algorithm !== bound.subject.fingerprint.algorithm || state.subject.fingerprint.value !== bound.subject.fingerprint.value) {
        return failure3("VAGP_DERIVE_AGENT_STATE_INVALID", "/validationContext/agentStates", "Current Agent state no longer matches the bound authority decision");
      }
      const observed = parsedTime(state.observedAt);
      const expires = parsedTime(state.expiresAt);
      const mandate2 = provenance.path.mandates.find((candidate) => candidate.id === bound.mandateId);
      const maxStaleness2 = mandate2 !== void 0 && "agentState" in mandate2.authority ? mandate2.authority.agentState.maxStateStalenessMs : null;
      if (observed === null || expires === null || maxStaleness2 === null || observed.epochMilliseconds > derivedAt.epochMilliseconds || derivedAt.epochMilliseconds > expires.epochMilliseconds || derivedAt.epochMilliseconds - observed.epochMilliseconds > maxStaleness2) {
        return failure3("VAGP_DERIVE_AGENT_STATE_STALE", "/validationContext/agentStates", "Current Agent state evidence is expired, future-dated or stale");
      }
    }
  }
  const validationContext = Object.freeze({
    evaluatedAt: derivedAt.value,
    statuses: statuses.value,
    ...profileValue === void 0 ? {} : { profileMaxStatusStalenessMs: profileValue },
    ...agentStates === void 0 ? {} : { agentStates }
  });
  return Object.freeze({
    decision,
    provenance,
    grantId,
    idempotencyKey,
    derivedAt,
    requestedValidUntil,
    validationContext,
    statuses: statuses.value,
    validationIdentity: JSON.stringify(validationContext)
  });
}
function isFailure3(value) {
  return value !== null && typeof value === "object" && Object.hasOwn(value, "ok");
}
function sameIdentity(left, right) {
  return left.decision === right.decision && left.grantId === right.grantId && left.derivedAt === right.derivedAt && left.requestedValidUntil === right.requestedValidUntil && left.validationIdentity === right.validationIdentity;
}
function identity(parsed) {
  return Object.freeze({
    decision: parsed.decision,
    grantId: parsed.grantId,
    derivedAt: parsed.derivedAt.value,
    requestedValidUntil: parsed.requestedValidUntil.value,
    validationIdentity: parsed.validationIdentity
  });
}
function reservationIndex(state, store) {
  const existing = state.byReservationStore.get(store);
  if (existing !== void 0)
    return existing;
  const created = /* @__PURE__ */ new Map();
  state.byReservationStore.set(store, created);
  return created;
}
function authorityDomainState(graph) {
  if (!graph.mandates.every((mandate2) => mandate2.vagp === "0.2")) {
    const existing2 = legacyGraphDomainStates.get(graph);
    if (existing2 !== void 0)
      return existing2;
    const created2 = Object.freeze({
      byDecision: /* @__PURE__ */ new WeakMap(),
      byDecisionKey: /* @__PURE__ */ new Map(),
      byRequestIdentity: /* @__PURE__ */ new Map(),
      byReservationStore: /* @__PURE__ */ new WeakMap(),
      byGrantId: /* @__PURE__ */ new Map()
    });
    legacyGraphDomainStates.set(graph, created2);
    return created2;
  }
  const existing = authorityDomainStates.get(graph.authorityDomainId);
  if (existing !== void 0)
    return existing;
  const created = Object.freeze({
    byDecision: /* @__PURE__ */ new WeakMap(),
    byDecisionKey: /* @__PURE__ */ new Map(),
    byRequestIdentity: /* @__PURE__ */ new Map(),
    byReservationStore: /* @__PURE__ */ new WeakMap(),
    byGrantId: /* @__PURE__ */ new Map()
  });
  authorityDomainStates.set(graph.authorityDomainId, created);
  return created;
}
function requestIdentityKey(decision) {
  return JSON.stringify([
    decision.requestIdentity.agentId,
    decision.requestIdentity.requestId
  ]);
}
function existingGrantMatchesDecision(grant, decision) {
  const provenance = grantProvenance.get(grant);
  return provenance !== void 0 && provenance.decision.decisionKey === decision.decisionKey && provenance.decision.requestIdentity.agentId === decision.requestIdentity.agentId && provenance.decision.requestIdentity.requestId === decision.requestIdentity.requestId;
}
function pathValidityCeiling(path) {
  let earliest = null;
  for (const mandate2 of path.mandates) {
    const bound = parsedTime(mandate2.validity.notAfter);
    if (bound === null)
      return null;
    if (earliest === null || bound.epochMilliseconds < earliest.epochMilliseconds) {
      earliest = bound;
    }
  }
  return earliest;
}
function currentReservation(parsed) {
  const bound = parsed.decision.statefulAuthority;
  if (bound === null)
    return null;
  const store = parsed.provenance.reservationStore;
  if (store === null || !isReservationStoreForGraph(store, parsed.provenance.graph)) {
    return failure3("VAGP_DERIVE_RESERVATION_INVALID", "/decision/statefulAuthority", "Bound reservation store provenance is unavailable or inconsistent");
  }
  const lookup = store.getReservation(bound.reservationId, parsed.derivedAt.value);
  if (!lookup.ok) {
    return failure3("VAGP_DERIVE_RESERVATION_INVALID", "/decision/statefulAuthority/reservationId", "Authoritative reservation lookup failed", lookup.errors[0]?.code);
  }
  if (lookup.value.state !== "RESERVED" || !isCurrentAuthorityReservation(store, lookup.value)) {
    return failure3("VAGP_DERIVE_RESERVATION_NOT_RESERVED", "/decision/statefulAuthority/state", "The exact bound reservation is no longer current and RESERVED");
  }
  if (lookup.value.authorityPathKey !== parsed.decision.authorityPath.pathKey || lookup.value.reservationId !== bound.reservationId) {
    return failure3("VAGP_DERIVE_RESERVATION_INVALID", "/decision/statefulAuthority/authorityPathKey", "Current reservation does not fund the exact bound authority path");
  }
  const financial = parsed.decision.context.financial;
  if (financial === null || !Object.is(lookup.value.amount, financial.amount) || lookup.value.authorityKey.currency !== financial.currency || !Object.is(bound.amount, financial.amount) || bound.currency !== financial.currency) {
    return failure3("VAGP_DERIVE_FINANCIAL_MISMATCH", "/decision/statefulAuthority/amount", "Current reservation and decision financial evidence must match exactly");
  }
  return Object.freeze({ store, value: lookup.value });
}
function buildGrant(parsed, validUntil) {
  const financial = parsed.decision.context.financial;
  const reservation = parsed.decision.statefulAuthority;
  return Object.freeze({
    vagp: parsed.decision.version,
    type: "execution-grant",
    artifactMode: "UNSIGNED_REFERENCE",
    grantId: parsed.grantId,
    requestIdentity: Object.freeze({
      agentId: parsed.decision.requestIdentity.agentId,
      requestId: parsed.decision.requestIdentity.requestId
    }),
    parametersDigest: parsed.decision.request.parametersDigest,
    subjectAgentId: parsed.decision.request.agent.id,
    action: parsed.decision.request.action,
    resourceId: parsed.decision.request.resource.id,
    trustedContext: freezeTrustedContext(parsed.decision.trustedContext),
    requiredCapabilities: Object.freeze((parsed.decision.context.requiredCapabilities ?? []).map((entry) => Object.freeze({ id: entry.id, version: entry.version }))),
    agentStates: Object.freeze(parsed.decision.agentStates.map((state) => Object.freeze(structuredClone(state)))),
    authorityPathKey: parsed.decision.authorityPath.pathKey,
    derivedAt: parsed.derivedAt.value,
    validFrom: parsed.derivedAt.value,
    validUntil,
    financial: financial === null ? null : Object.freeze({
      currency: financial.currency,
      amount: financial.amount
    }),
    reservationId: reservation?.reservationId ?? null,
    consumption: reservation === null ? null : Object.freeze({
      reservationId: reservation.reservationId,
      committedAt: parsed.derivedAt.value
    }),
    verificationMode: "CURRENT_AUTHORITY_REQUIRED"
  });
}
function freezeTrustedContext(context) {
  const relevantAttributes = /* @__PURE__ */ Object.create(null);
  for (const name of Object.keys(context.relevantAttributes).sort()) {
    const value = context.relevantAttributes[name];
    if (value !== void 0)
      relevantAttributes[name] = value;
  }
  return Object.freeze({
    autonomy: context.autonomy,
    assurance: context.assurance,
    relevantAttributes: Object.freeze(relevantAttributes)
  });
}
function validateCurrentPath(graph, path, context) {
  const result = validateAuthorityPathAt(graph, path, context);
  if (!result.ok || !result.value.valid) {
    return failure3("VAGP_DERIVE_PATH_NOT_CURRENT", "/validationContext", result.ok ? "The exact bound authority path is not currently usable" : result.errors[0]?.message ?? "The exact bound authority path could not be validated", result.ok ? result.value.reasonCodes[0] : result.errors[0]?.code);
  }
  return null;
}
function commitContext(parsed) {
  return Object.freeze({
    evaluatedAt: parsed.derivedAt.value,
    statuses: parsed.statuses,
    maxStatusStalenessMs: parsed.decision.currentAuthority.maxStatusStalenessMs
  });
}
function createInMemoryExecutionGrantRegistry() {
  const registry = Object.freeze(new InMemoryExecutionGrantRegistry());
  registryStates.set(registry, {
    byIdempotency: /* @__PURE__ */ new Map(),
    byDecision: /* @__PURE__ */ new WeakMap(),
    byDecisionKey: /* @__PURE__ */ new Map(),
    byRequestIdentity: /* @__PURE__ */ new Map(),
    byReservationStore: /* @__PURE__ */ new WeakMap(),
    byGrantId: /* @__PURE__ */ new Map()
  });
  return registry;
}
function deriveExecutionGrant(registryValue, inputValue) {
  try {
    if (registryValue === null || typeof registryValue !== "object") {
      return failure3("VAGP_DERIVE_REGISTRY_INVALID", "/registry", "DERIVE requires an authentic local grant registry");
    }
    const state = registryStates.get(registryValue);
    if (state === void 0) {
      return failure3("VAGP_DERIVE_REGISTRY_INVALID", "/registry", "DERIVE requires an authentic local grant registry");
    }
    const parsed = parseInput(inputValue);
    if (isFailure3(parsed))
      return parsed;
    const domain = authorityDomainState(parsed.provenance.graph);
    const derivationIdentity = identity(parsed);
    const retry = state.byIdempotency.get(parsed.idempotencyKey);
    if (retry !== void 0) {
      return sameIdentity(retry.identity, derivationIdentity) ? success4(retry.grant) : failure3("VAGP_DERIVE_IDEMPOTENCY_CONFLICT", "/idempotencyKey", "Idempotency key is already bound to different derivation semantics");
    }
    const existingForRequest = state.byRequestIdentity.get(requestIdentityKey(parsed.decision)) ?? domain.byRequestIdentity.get(requestIdentityKey(parsed.decision));
    if (existingForRequest !== void 0) {
      return existingGrantMatchesDecision(existingForRequest, parsed.decision) ? success4(existingForRequest) : failure3("VAGP_DERIVE_REQUEST_ALREADY_USED", "/decision/requestIdentity", "Request Identity is already bound to a different semantic grant in this authority domain");
    }
    const existingForDecisionKey = state.byDecisionKey.get(parsed.decision.decisionKey) ?? domain.byDecisionKey.get(parsed.decision.decisionKey);
    if (existingForDecisionKey !== void 0) {
      return success4(existingForDecisionKey);
    }
    const boundReservation2 = parsed.decision.statefulAuthority;
    const boundStore = parsed.provenance.reservationStore;
    if (boundReservation2 !== null && boundStore !== null && reservationIndex(state, boundStore).has(boundReservation2.reservationId)) {
      return failure3("VAGP_DERIVE_RESERVATION_ALREADY_USED", "/decision/statefulAuthority/reservationId", "One stateful reservation may fund only one semantic grant");
    }
    if (boundReservation2 !== null && boundStore !== null && reservationIndex(domain, boundStore).has(boundReservation2.reservationId)) {
      return failure3("VAGP_DERIVE_RESERVATION_ALREADY_USED", "/decision/statefulAuthority/reservationId", "One stateful reservation may fund only one semantic grant in this authority domain");
    }
    const existingForDecision = state.byDecision.get(parsed.decision) ?? domain.byDecision.get(parsed.decision);
    if (existingForDecision !== void 0)
      return success4(existingForDecision);
    if (state.byGrantId.has(parsed.grantId) || domain.byGrantId.has(parsed.grantId)) {
      return failure3("VAGP_DERIVE_GRANT_ID_CONFLICT", "/grantId", "Grant ID is already bound to another semantic grant");
    }
    const reservation = currentReservation(parsed);
    if (reservation !== null && isFailure3(reservation))
      return reservation;
    if (reservation !== null) {
      const index = reservationIndex(state, reservation.store);
      if (index.has(reservation.value.reservationId)) {
        return failure3("VAGP_DERIVE_RESERVATION_ALREADY_USED", "/decision/statefulAuthority/reservationId", "One stateful reservation may fund only one semantic grant");
      }
    }
    const pathFailure = validateCurrentPath(parsed.provenance.graph, parsed.provenance.path, parsed.validationContext);
    if (pathFailure !== null)
      return pathFailure;
    const pathCeiling = pathValidityCeiling(parsed.provenance.path);
    if (pathCeiling === null) {
      return failure3("VAGP_DERIVE_VALIDITY_INVALID", "/decision/authorityPath", "Bound path contains an invalid validity ceiling");
    }
    let validUntil = parsed.requestedValidUntil.epochMilliseconds <= pathCeiling.epochMilliseconds ? parsed.requestedValidUntil : pathCeiling;
    for (const state2 of parsed.decision.agentStates) {
      const expiry = parsedTime(state2.expiresAt);
      if (expiry === null) {
        return failure3("VAGP_DERIVE_AGENT_STATE_INVALID", "/decision/agentStates/expiresAt", "Bound Agent state attestation expiry is invalid");
      }
      if (expiry.epochMilliseconds < validUntil.epochMilliseconds) {
        validUntil = expiry;
      }
    }
    if (reservation !== null) {
      const expiry = parsedTime(reservation.value.expiresAt);
      if (expiry === null) {
        return failure3("VAGP_DERIVE_RESERVATION_INVALID", "/decision/statefulAuthority/expiresAt", "Bound reservation expiry is invalid");
      }
      if (expiry.epochMilliseconds < parsed.derivedAt.epochMilliseconds) {
        return failure3("VAGP_DERIVE_RESERVATION_NOT_RESERVED", "/decision/statefulAuthority/expiresAt", "Bound reservation has expired before derivation");
      }
      if (expiry.epochMilliseconds < validUntil.epochMilliseconds) {
        validUntil = expiry;
      }
    }
    if (validUntil.epochMilliseconds < parsed.derivedAt.epochMilliseconds) {
      return failure3("VAGP_DERIVE_VALIDITY_INVALID", "/requestedValidUntil", "No non-backdated validity interval remains within authority ceilings");
    }
    const grant = buildGrant(parsed, validUntil.value);
    if (reservation !== null) {
      const committed = reservation.store.commitReservation(reservation.value.reservationId, commitContext(parsed));
      if (!committed.ok || committed.value.state !== "COMMITTED") {
        return failure3("VAGP_DERIVE_RESERVATION_NOT_RESERVED", "/decision/statefulAuthority", "Reservation could not be atomically consumed for this grant", committed.ok ? committed.value.state : committed.errors[0]?.code);
      }
    }
    authenticGrants.add(grant);
    grantProvenance.set(grant, Object.freeze({
      decision: parsed.decision,
      decisionProvenance: parsed.provenance
    }));
    state.byIdempotency.set(parsed.idempotencyKey, Object.freeze({ identity: derivationIdentity, grant }));
    state.byDecision.set(parsed.decision, grant);
    state.byDecisionKey.set(parsed.decision.decisionKey, grant);
    state.byRequestIdentity.set(requestIdentityKey(parsed.decision), grant);
    state.byGrantId.set(parsed.grantId, grant);
    domain.byDecision.set(parsed.decision, grant);
    domain.byDecisionKey.set(parsed.decision.decisionKey, grant);
    domain.byRequestIdentity.set(requestIdentityKey(parsed.decision), grant);
    domain.byGrantId.set(parsed.grantId, grant);
    if (reservation !== null) {
      reservationIndex(state, reservation.store).set(reservation.value.reservationId, grant);
      reservationIndex(domain, reservation.store).set(reservation.value.reservationId, grant);
    }
    return success4(grant);
  } catch {
    return failure3("VAGP_DERIVE_INVALID_INPUT", "/input", "DERIVE input could not be processed safely");
  }
}
function isAuthenticExecutionGrant(value) {
  return value !== null && typeof value === "object" && authenticGrants.has(value);
}
function getExecutionGrantProvenance(value) {
  return value !== null && typeof value === "object" ? grantProvenance.get(value) : void 0;
}

// ../../packages/verifier/dist/verify.js
var INPUT_KEYS4 = /* @__PURE__ */ new Set([
  "grant",
  "attempt",
  "evaluatedAt",
  "currentStatusEvidence",
  "resourceMaxStatusStalenessMs",
  "verificationId",
  "idempotencyKey"
]);
var ATTEMPT_KEYS = /* @__PURE__ */ new Set([
  "vagp",
  "requestIdentity",
  "parametersDigest",
  "subjectAgentId",
  "action",
  "resourceId",
  "financial",
  "trustedContext"
]);
var ATTEMPT_V03_KEYS = /* @__PURE__ */ new Set([
  ...ATTEMPT_KEYS,
  "requiredCapabilities",
  "agentStates"
]);
var REQUEST_IDENTITY_KEYS = /* @__PURE__ */ new Set(["agentId", "requestId"]);
var TRUSTED_CONTEXT_KEYS = /* @__PURE__ */ new Set([
  "autonomy",
  "assurance",
  "relevantAttributes"
]);
var FINANCIAL_KEYS = /* @__PURE__ */ new Set(["amount", "currency"]);
var IDENTIFIER2 = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
var CURRENCY = /^[A-Z]{3}$/;
var InMemoryVerificationRegistry = class {
  implementation = "IN_MEMORY_REFERENCE";
};
Object.freeze(InMemoryVerificationRegistry.prototype);
var registryStates2 = /* @__PURE__ */ new WeakMap();
var processConsumedGrants = /* @__PURE__ */ new WeakMap();
var verificationProvenance = /* @__PURE__ */ new WeakMap();
function rejected(code, path, message, causeCode) {
  const detail = Object.freeze({
    code,
    path,
    message,
    ...causeCode === void 0 ? {} : { causeCode }
  });
  return Object.freeze({
    ok: false,
    outcome: "REJECTED",
    errors: Object.freeze([detail])
  });
}
function verified(evidence) {
  return Object.freeze({ ok: true, outcome: "VERIFIED", evidence });
}
function provenanceFromParsed(parsed) {
  return Object.freeze({
    grant: parsed.grant,
    attempt: parsed.attempt,
    evaluatedAt: parsed.evaluatedAt.value,
    currentStatusEvidence: parsed.statuses,
    resourceMaxStatusStalenessMs: parsed.resourceMaxStatusStalenessMs
  });
}
function closedObject3(value, keys) {
  try {
    if (value === null || typeof value !== "object" || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) {
      return null;
    }
    const ownKeys = Reflect.ownKeys(value);
    if (ownKeys.length !== keys.size || ownKeys.some((key) => typeof key !== "string" || !keys.has(key))) {
      return null;
    }
    const copy = /* @__PURE__ */ Object.create(null);
    for (const key of ownKeys) {
      if (typeof key !== "string")
        return null;
      const descriptor = Reflect.getOwnPropertyDescriptor(value, key);
      if (descriptor === void 0 || !descriptor.enumerable || !Object.hasOwn(descriptor, "value")) {
        return null;
      }
      copy[key] = descriptor.value;
    }
    return Object.freeze(copy);
  } catch {
    return null;
  }
}
function parseTime2(value) {
  const parsed = parseCanonicalTimestamp(value);
  return typeof value === "string" && parsed.valid ? Object.freeze({ value, epochMilliseconds: parsed.epochMilliseconds }) : null;
}
function parseAttempt(value) {
  const baseKeys = value !== null && typeof value === "object" && Reflect.ownKeys(value).some((key) => key === "vagp") ? ATTEMPT_KEYS : new Set([...ATTEMPT_KEYS].filter((key) => key !== "vagp"));
  const hasV03Fields = value !== null && typeof value === "object" && (Object.hasOwn(value, "requiredCapabilities") || Object.hasOwn(value, "agentStates"));
  const allowedKeys = hasV03Fields ? ATTEMPT_V03_KEYS : baseKeys;
  const attempt = closedObject3(value, allowedKeys);
  if (attempt === null)
    return null;
  const vagp = attempt["vagp"];
  const requestIdentity2 = parseRequestIdentity(attempt["requestIdentity"]);
  const parametersDigest = parseParametersDigest(attempt["parametersDigest"]);
  const subjectAgentId = attempt["subjectAgentId"];
  const action = attempt["action"];
  const resourceId = attempt["resourceId"];
  const trustedContext = parseTrustedContext(attempt["trustedContext"]);
  if (requestIdentity2 === null || parametersDigest === void 0 || vagp !== void 0 && vagp !== "0.1" && vagp !== "0.2" && vagp !== "0.3" || typeof subjectAgentId !== "string" || subjectAgentId.length === 0 || typeof action !== "string" || action.length === 0 || typeof resourceId !== "string" || resourceId.length === 0 || trustedContext === null) {
    return null;
  }
  let requiredCapabilities;
  let agentStates;
  if (hasV03Fields) {
    const capabilitiesValue = attempt["requiredCapabilities"];
    const statesValue = attempt["agentStates"];
    if (!Array.isArray(capabilitiesValue) || !Array.isArray(statesValue) || statesValue.some((state) => !isTrustedAgentStateEvidence(state)) || new Set(statesValue.map((state) => state.subject.agentId)).size !== statesValue.length) {
      return null;
    }
    const capabilities = [];
    for (const value2 of capabilitiesValue) {
      const item = closedObject3(value2, /* @__PURE__ */ new Set(["id", "version"]));
      if (item === null || typeof item["id"] !== "string" || item["id"].length === 0 || typeof item["version"] !== "string" || item["version"].length === 0) {
        return null;
      }
      capabilities.push(Object.freeze({ id: item["id"], version: item["version"] }));
    }
    requiredCapabilities = Object.freeze(capabilities);
    agentStates = Object.freeze(statesValue);
  }
  const financialValue = attempt["financial"];
  let financial = null;
  if (financialValue !== null) {
    const parsed = closedObject3(financialValue, FINANCIAL_KEYS);
    if (parsed === null)
      return null;
    const amount = parsed["amount"];
    const currency = parsed["currency"];
    if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0 || typeof currency !== "string" || !CURRENCY.test(currency)) {
      return null;
    }
    financial = Object.freeze({ amount, currency });
  }
  const parsedVersion = vagp === "0.1" || vagp === "0.2" || vagp === "0.3" ? vagp : void 0;
  const parsedAttempt = {
    requestIdentity: requestIdentity2,
    parametersDigest,
    subjectAgentId,
    action,
    resourceId,
    financial,
    trustedContext,
    ...requiredCapabilities === void 0 ? {} : { requiredCapabilities },
    ...agentStates === void 0 ? {} : { agentStates }
  };
  return Object.freeze(parsedVersion === void 0 ? parsedAttempt : { ...parsedAttempt, vagp: parsedVersion });
}
function parseRequestIdentity(value) {
  const identity2 = closedObject3(value, REQUEST_IDENTITY_KEYS);
  if (identity2 === null)
    return null;
  const agentId = identity2["agentId"];
  const requestId = identity2["requestId"];
  return typeof agentId === "string" && agentId.length > 0 && typeof requestId === "string" && requestId.length > 0 ? Object.freeze({ agentId, requestId }) : null;
}
function parseParametersDigest(value) {
  return value === null || typeof value === "string" && value.length > 0 ? value : void 0;
}
function parseTrustedContext(value) {
  const context = closedObject3(value, TRUSTED_CONTEXT_KEYS);
  if (context === null)
    return null;
  const autonomy = context["autonomy"];
  const assurance = context["assurance"];
  const attributes = context["relevantAttributes"];
  if (!isAutonomy(autonomy) || !isAssurance(assurance))
    return null;
  const relevantAttributes = parseRelevantAttributes(attributes);
  return relevantAttributes === null ? null : Object.freeze({
    autonomy,
    assurance,
    relevantAttributes
  });
}
function parseRelevantAttributes(value) {
  const attributes = closedObject3(value, new Set(value !== null && typeof value === "object" ? Reflect.ownKeys(value).filter((key) => typeof key === "string") : []));
  if (attributes === null)
    return null;
  const result = /* @__PURE__ */ Object.create(null);
  for (const name of Object.keys(attributes).sort()) {
    const candidate = attributes[name];
    if (!isConstraintScalar(candidate))
      return null;
    result[name] = candidate;
  }
  return Object.freeze(result);
}
function isConstraintScalar(value) {
  return typeof value === "string" || typeof value === "boolean" || typeof value === "number" && Number.isFinite(value);
}
function isAutonomy(value) {
  return value === "PROHIBITED" || value === "HUMAN_CONTROLLED" || value === "BOUNDED_AUTONOMOUS" || value === "AUTONOMOUS";
}
function isAssurance(value) {
  return value === "A1" || value === "A2" || value === "A3" || value === "A4" || value === "A5";
}
function maxStaleness(value) {
  return value === null || typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : void 0;
}
function parseInput2(value) {
  const input = closedObject3(value, INPUT_KEYS4);
  if (input === null) {
    return rejected("VAGP_VERIFY_INVALID_INPUT", "/input", "VERIFY input must be a closed plain object with safe data properties");
  }
  const grantValue = input["grant"];
  if (!isAuthenticExecutionGrant(grantValue)) {
    return rejected("VAGP_VERIFY_GRANT_NOT_AUTHENTIC", "/grant", "VERIFY requires the original authentic Execution Grant from local DERIVE");
  }
  if (getExecutionGrantProvenance(grantValue) === void 0) {
    return rejected("VAGP_VERIFY_GRANT_INVALID", "/grant", "Authentic grant provenance is unavailable");
  }
  const verificationId = input["verificationId"];
  const idempotencyKey = input["idempotencyKey"];
  if (typeof verificationId !== "string" || !IDENTIFIER2.test(verificationId) || typeof idempotencyKey !== "string" || !IDENTIFIER2.test(idempotencyKey)) {
    return rejected("VAGP_VERIFY_INVALID_INPUT", typeof verificationId !== "string" || !IDENTIFIER2.test(verificationId) ? "/verificationId" : "/idempotencyKey", "Verification identifiers must use 1-128 safe ASCII characters");
  }
  const attempt = parseAttempt(input["attempt"]);
  const evaluatedAt = parseTime2(input["evaluatedAt"]);
  const resourceFreshness = maxStaleness(input["resourceMaxStatusStalenessMs"]);
  if (attempt === null || evaluatedAt === null || resourceFreshness === void 0) {
    return rejected("VAGP_VERIFY_INVALID_INPUT", attempt === null ? "/attempt" : evaluatedAt === null ? "/evaluatedAt" : "/resourceMaxStatusStalenessMs", "Execution attempt, time, or resource freshness requirement is invalid");
  }
  const grantVersion = grantValue.vagp;
  const attemptVersion = attempt.vagp;
  if (grantVersion === "0.2" && attemptVersion !== "0.2" || attemptVersion === "0.2" && grantVersion !== "0.2" || grantVersion === "0.3" && attemptVersion !== "0.3" || attemptVersion === "0.3" && grantVersion !== "0.3") {
    return rejected("VAGP_VERIFY_VERSION_MISMATCH", "/attempt/vagp", "Execution Attempt VAGP version must match the authentic Execution Grant version");
  }
  const statusValue = input["currentStatusEvidence"];
  const statuses = isMandateStatusSnapshot(statusValue) ? { ok: true, value: statusValue } : buildMandateStatusSnapshot(statusValue);
  if (!statuses.ok) {
    return rejected("VAGP_VERIFY_CURRENT_AUTHORITY_INVALID", "/currentStatusEvidence", statuses.errors[0]?.message ?? "Current status evidence is invalid", statuses.errors[0]?.code);
  }
  const identity2 = JSON.stringify([
    grantValue.grantId,
    verificationId,
    evaluatedAt.value,
    attempt,
    statuses.value,
    resourceFreshness
  ]);
  return Object.freeze({
    grant: grantValue,
    attempt,
    evaluatedAt,
    statuses: statuses.value,
    resourceMaxStatusStalenessMs: resourceFreshness,
    verificationId,
    idempotencyKey,
    identity: identity2
  });
}
function isResult(value) {
  return value !== null && typeof value === "object" && Object.hasOwn(value, "ok");
}
function recordFailure(state, parsed, result) {
  verificationProvenance.set(result, provenanceFromParsed(parsed));
  state.byIdempotency.set(parsed.idempotencyKey, Object.freeze({ grant: parsed.grant, identity: parsed.identity, result }));
  return result;
}
function exactFinancial(grant, attempt) {
  return grant.financial === null ? attempt.financial === null : attempt.financial !== null && Object.is(grant.financial.amount, attempt.financial.amount) && grant.financial.currency === attempt.financial.currency;
}
function exactRequestIdentity(left, right) {
  return left.agentId === right.agentId && left.requestId === right.requestId;
}
function exactTrustedContext(left, right) {
  const leftKeys = Object.keys(left.relevantAttributes).sort();
  const rightKeys = Object.keys(right.relevantAttributes).sort();
  return left.autonomy === right.autonomy && left.assurance === right.assurance && leftKeys.length === rightKeys.length && leftKeys.every((key, index) => key === rightKeys[index] && Object.is(left.relevantAttributes[key], right.relevantAttributes[key]));
}
function exactCapabilities(left, right) {
  return left.length === right.length && left.every((entry, index) => {
    const counterpart = right[index];
    return counterpart !== void 0 && entry.id === counterpart.id && entry.version === counterpart.version;
  });
}
function effectiveFreshness2(bound, resource) {
  if (bound === null)
    return resource;
  if (resource === null)
    return bound;
  return Math.min(bound, resource);
}
function requestIdentityKey2(grant) {
  return JSON.stringify([
    grant.requestIdentity.agentId,
    grant.requestIdentity.requestId
  ]);
}
function grantMatchesProvenance(grant) {
  const provenance = getExecutionGrantProvenance(grant);
  if (provenance === void 0)
    return false;
  const decision = provenance.decision;
  const financial = decision.context.financial;
  const reservation = decision.statefulAuthority;
  return grant.subjectAgentId === decision.request.agent.id && grant.requestIdentity.agentId === decision.requestIdentity.agentId && grant.requestIdentity.requestId === decision.requestIdentity.requestId && grant.parametersDigest === decision.request.parametersDigest && grant.action === decision.request.action && grant.resourceId === decision.request.resource.id && exactTrustedContext(grant.trustedContext, decision.trustedContext) && exactCapabilities(grant.requiredCapabilities, decision.context.requiredCapabilities ?? []) && grant.agentStates.length === decision.agentStates.length && grant.agentStates.every((state, index) => {
    const bound = decision.agentStates[index];
    return bound !== void 0 && state.mandateId === bound.mandateId && state.attestationId === bound.attestationId && state.subject.agentId === bound.subject.agentId && state.subject.stateRevision === bound.subject.stateRevision && state.subject.fingerprint.algorithm === bound.subject.fingerprint.algorithm && state.subject.fingerprint.value === bound.subject.fingerprint.value;
  }) && grant.authorityPathKey === decision.authorityPath.pathKey && (financial === null ? grant.financial === null : grant.financial !== null && Object.is(grant.financial.amount, financial.amount) && grant.financial.currency === financial.currency) && (reservation === null ? grant.reservationId === null && grant.consumption === null : grant.reservationId === reservation.reservationId && grant.consumption?.reservationId === reservation.reservationId && grant.consumption.committedAt === grant.derivedAt);
}
function createInMemoryVerificationRegistry() {
  const registry = Object.freeze(new InMemoryVerificationRegistry());
  registryStates2.set(registry, {
    byIdempotency: /* @__PURE__ */ new Map(),
    consumedGrants: processConsumedGrants,
    verifiedRequestIdentities: /* @__PURE__ */ new Map()
  });
  return registry;
}
function verifyExecutionGrant(registryValue, inputValue) {
  try {
    if (registryValue === null || typeof registryValue !== "object") {
      return rejected("VAGP_VERIFY_REGISTRY_INVALID", "/registry", "VERIFY requires an authentic local verification registry");
    }
    const state = registryStates2.get(registryValue);
    if (state === void 0) {
      return rejected("VAGP_VERIFY_REGISTRY_INVALID", "/registry", "VERIFY requires an authentic local verification registry");
    }
    const parsed = parseInput2(inputValue);
    if (isResult(parsed))
      return parsed;
    const prior = state.byIdempotency.get(parsed.idempotencyKey);
    if (prior !== void 0) {
      return prior.grant === parsed.grant && prior.identity === parsed.identity ? prior.result : rejected("VAGP_VERIFY_IDEMPOTENCY_CONFLICT", "/idempotencyKey", "Idempotency key is already bound to different verification semantics");
    }
    if (state.consumedGrants.has(parsed.grant)) {
      return recordFailure(state, parsed, rejected("VAGP_VERIFY_GRANT_ALREADY_USED", "/grant/grantId", "One Execution Grant may authorize only one independent execution"));
    }
    if (!grantMatchesProvenance(parsed.grant)) {
      return recordFailure(state, parsed, rejected("VAGP_VERIFY_GRANT_INVALID", "/grant", "Grant fields are inconsistent with retained authoritative provenance"));
    }
    if (state.verifiedRequestIdentities.has(requestIdentityKey2(parsed.grant))) {
      return recordFailure(state, parsed, rejected("VAGP_VERIFY_REQUEST_ALREADY_USED", "/grant/requestIdentity", "One Request Identity may produce only one successful VERIFY in this registry scope"));
    }
    const validFrom = parseTime2(parsed.grant.validFrom);
    const validUntil = parseTime2(parsed.grant.validUntil);
    if (validFrom === null || validUntil === null) {
      return recordFailure(state, parsed, rejected("VAGP_VERIFY_GRANT_INVALID", "/grant", "Grant validity is invalid"));
    }
    if (parsed.evaluatedAt.epochMilliseconds < validFrom.epochMilliseconds) {
      return recordFailure(state, parsed, rejected("VAGP_VERIFY_GRANT_NOT_YET_VALID", "/evaluatedAt", "Grant is not yet valid at the explicit verification time"));
    }
    if (parsed.evaluatedAt.epochMilliseconds > validUntil.epochMilliseconds) {
      return recordFailure(state, parsed, rejected("VAGP_VERIFY_GRANT_EXPIRED", "/evaluatedAt", "Grant has expired at the explicit verification time"));
    }
    const comparisons = [
      [
        exactRequestIdentity(parsed.attempt.requestIdentity, parsed.grant.requestIdentity),
        "VAGP_VERIFY_REQUEST_IDENTITY_MISMATCH",
        "/attempt/requestIdentity",
        "Attempt Request Identity does not exactly match the grant"
      ],
      [
        parsed.attempt.subjectAgentId === parsed.grant.subjectAgentId,
        "VAGP_VERIFY_SUBJECT_MISMATCH",
        "/attempt/subjectAgentId",
        "Attempt subject does not exactly match the grant"
      ],
      [
        parsed.attempt.action === parsed.grant.action,
        "VAGP_VERIFY_ACTION_MISMATCH",
        "/attempt/action",
        "Attempt action does not exactly match the grant"
      ],
      [
        parsed.attempt.resourceId === parsed.grant.resourceId,
        "VAGP_VERIFY_RESOURCE_MISMATCH",
        "/attempt/resourceId",
        "Attempt resource does not exactly match the grant"
      ],
      [
        exactFinancial(parsed.grant, parsed.attempt),
        "VAGP_VERIFY_FINANCIAL_MISMATCH",
        "/attempt/financial",
        "Attempt financial semantics do not exactly match the grant"
      ],
      [
        parsed.attempt.parametersDigest === parsed.grant.parametersDigest,
        "VAGP_VERIFY_PARAMETERS_DIGEST_MISMATCH",
        "/attempt/parametersDigest",
        "Attempt parameters digest does not exactly match the grant"
      ],
      [
        exactTrustedContext(parsed.attempt.trustedContext, parsed.grant.trustedContext),
        "VAGP_VERIFY_TRUSTED_CONTEXT_MISMATCH",
        "/attempt/trustedContext",
        "Attempt trusted execution context does not exactly match the grant"
      ]
    ];
    for (const [matches, code, path, message] of comparisons) {
      if (!matches)
        return recordFailure(state, parsed, rejected(code, path, message));
    }
    const provenance = getExecutionGrantProvenance(parsed.grant);
    if (provenance === void 0) {
      return recordFailure(state, parsed, rejected("VAGP_VERIFY_GRANT_INVALID", "/grant", "Grant provenance is unavailable"));
    }
    if (parsed.grant.vagp === "0.3") {
      const liveStates = parsed.attempt.agentStates;
      const actualCapabilities = parsed.attempt.requiredCapabilities;
      if (liveStates === void 0 || actualCapabilities === void 0) {
        return recordFailure(state, parsed, rejected("VAGP_VERIFY_AGENT_STATE_INVALID", "/attempt/agentStates", "VAGP 0.3 execution requires current trusted Agent state evidence"));
      }
      if (!exactCapabilities(actualCapabilities, parsed.grant.requiredCapabilities)) {
        return recordFailure(state, parsed, rejected("VAGP_VERIFY_CAPABILITY_MISMATCH", "/attempt/requiredCapabilities", "Actual execution capabilities do not match the grant"));
      }
      for (const bound of parsed.grant.agentStates) {
        const live = liveStates.find((candidate) => candidate.subject.agentId === bound.subject.agentId);
        if (live === void 0 || live.authorityDomainId !== bound.authorityDomainId || live.attestationId !== bound.attestationId || live.subject.stateRevision !== bound.subject.stateRevision || live.subject.fingerprint.algorithm !== bound.subject.fingerprint.algorithm || live.subject.fingerprint.value !== bound.subject.fingerprint.value) {
          return recordFailure(state, parsed, rejected("VAGP_VERIFY_AGENT_STATE_INVALID", "/attempt/agentStates", "Current Agent state does not match the state bound into the grant"));
        }
        const observed = parseTime2(live.observedAt);
        const expires = parseTime2(live.expiresAt);
        const mandate2 = provenance.decisionProvenance.path.mandates.find((candidate) => candidate.id === bound.mandateId);
        const maxStaleness2 = mandate2 !== void 0 && "agentState" in mandate2.authority ? mandate2.authority.agentState.maxStateStalenessMs : null;
        if (observed === null || expires === null || maxStaleness2 === null || observed.epochMilliseconds > parsed.evaluatedAt.epochMilliseconds || parsed.evaluatedAt.epochMilliseconds > expires.epochMilliseconds || parsed.evaluatedAt.epochMilliseconds - observed.epochMilliseconds > maxStaleness2) {
          return recordFailure(state, parsed, rejected("VAGP_VERIFY_AGENT_STATE_STALE", "/attempt/agentStates", "Current Agent state evidence is expired, future-dated or stale"));
        }
      }
      const leafState = liveStates.find((candidate) => candidate.subject.agentId === parsed.grant.subjectAgentId);
      const attested = new Set((leafState?.capabilities ?? []).map((entry) => JSON.stringify([entry.id, entry.version])));
      if (parsed.grant.requiredCapabilities.some((entry) => !attested.has(JSON.stringify([entry.id, entry.version])))) {
        return recordFailure(state, parsed, rejected("VAGP_VERIFY_CAPABILITY_MISMATCH", "/attempt/agentStates", "Executing Agent no longer attests every required capability"));
      }
    }
    const observedAt = parseTime2(parsed.statuses.observedAt);
    if (observedAt === null) {
      return recordFailure(state, parsed, rejected("VAGP_VERIFY_CURRENT_AUTHORITY_INVALID", "/currentStatusEvidence/observedAt", "Status observation time is invalid"));
    }
    if (observedAt.epochMilliseconds > parsed.evaluatedAt.epochMilliseconds) {
      return recordFailure(state, parsed, rejected("VAGP_VERIFY_STATUS_FUTURE", "/currentStatusEvidence/observedAt", "Status evidence cannot be observed after evaluatedAt"));
    }
    const boundFreshness = provenance.decision.currentAuthority.maxStatusStalenessMs;
    const freshness = effectiveFreshness2(boundFreshness, parsed.resourceMaxStatusStalenessMs);
    if (freshness !== null && provenance.decisionProvenance.path.mandates.some((mandate2) => mandate2.statusRef !== null) && parsed.evaluatedAt.epochMilliseconds - observedAt.epochMilliseconds > freshness) {
      return recordFailure(state, parsed, rejected("VAGP_VERIFY_STATUS_STALE", "/currentStatusEvidence/observedAt", "Status evidence exceeds the effective freshness ceiling"));
    }
    const pathValidation = validateAuthorityPathAt(provenance.decisionProvenance.graph, provenance.decisionProvenance.path, Object.freeze({
      evaluatedAt: parsed.evaluatedAt.value,
      statuses: parsed.statuses
    }));
    if (!pathValidation.ok || !pathValidation.value.valid) {
      return recordFailure(state, parsed, rejected("VAGP_VERIFY_CURRENT_AUTHORITY_INVALID", "/currentStatusEvidence", "The exact authority path retained by the grant is not currently usable", pathValidation.ok ? pathValidation.value.reasonCodes[0] : pathValidation.errors[0]?.code));
    }
    const currentAuthority = Object.freeze({
      evaluatedAt: parsed.evaluatedAt.value,
      statusObservedAt: parsed.statuses.observedAt,
      grantBoundMaxStatusStalenessMs: boundFreshness,
      resourceMaxStatusStalenessMs: parsed.resourceMaxStatusStalenessMs,
      effectiveMaxStatusStalenessMs: freshness,
      exactPathValid: true,
      mandates: Object.freeze(pathValidation.value.mandateResults.map((mandate2) => Object.freeze({
        mandateId: mandate2.mandateId,
        lifecycleState: mandate2.lifecycleState,
        usable: mandate2.usable,
        reasonCodes: Object.freeze([...mandate2.reasonCodes])
      })))
    });
    const evidence = Object.freeze({
      verificationId: parsed.verificationId,
      grantId: parsed.grant.grantId,
      requestIdentity: Object.freeze({
        agentId: parsed.grant.requestIdentity.agentId,
        requestId: parsed.grant.requestIdentity.requestId
      }),
      parametersDigest: parsed.grant.parametersDigest,
      subjectAgentId: parsed.grant.subjectAgentId,
      action: parsed.grant.action,
      resourceId: parsed.grant.resourceId,
      financial: parsed.grant.financial === null ? null : Object.freeze({ ...parsed.grant.financial }),
      trustedContext: Object.freeze({
        autonomy: parsed.grant.trustedContext.autonomy,
        assurance: parsed.grant.trustedContext.assurance,
        relevantAttributes: Object.freeze({
          ...parsed.grant.trustedContext.relevantAttributes
        })
      }),
      requiredCapabilities: Object.freeze(parsed.grant.requiredCapabilities.map((entry) => Object.freeze({ ...entry }))),
      agentStates: Object.freeze((parsed.attempt.agentStates ?? []).map((entry) => entry)),
      verifiedAt: parsed.evaluatedAt.value,
      authorityPathKey: parsed.grant.authorityPathKey,
      currentAuthority
    });
    const result = verified(evidence);
    verificationProvenance.set(result, provenanceFromParsed(parsed));
    if (state.consumedGrants.has(parsed.grant)) {
      return recordFailure(state, parsed, rejected("VAGP_VERIFY_GRANT_ALREADY_USED", "/grant/grantId", "Execution Grant was consumed concurrently"));
    }
    state.consumedGrants.set(parsed.grant, evidence);
    state.verifiedRequestIdentities.set(requestIdentityKey2(parsed.grant), evidence);
    state.byIdempotency.set(parsed.idempotencyKey, Object.freeze({ grant: parsed.grant, identity: parsed.identity, result }));
    return result;
  } catch {
    return rejected("VAGP_VERIFY_INVALID_INPUT", "/input", "VERIFY input could not be processed safely");
  }
}

// src/service.ts
var GRANT_VALIDITY_MS = 5 * 60 * 1e3;
function firstReason(reasons) {
  return reasons[0] ?? "VAGP_REASON_UNAVAILABLE";
}
function decisionFromOutcome(outcome) {
  if (outcome === "AUTHORITY_CONFIRMED") return "PERMIT";
  if (outcome === "ADDITIONAL_STATE_REQUIRED")
    return "ADDITIONAL_STATE_REQUIRED";
  return "DENY";
}
function selectedPath2(result) {
  return result.pathResults.find((path) => path.qualifies)?.path.key ?? null;
}
function relevantMandates(result) {
  const qualifying = result.pathResults.find((path2) => path2.qualifies);
  const path = qualifying ?? result.pathResults[0];
  return Object.freeze(path?.path.mandates.map((mandate2) => mandate2.id) ?? []);
}
function additionalStateRequirement(result) {
  if (result.outcome !== "ADDITIONAL_STATE_REQUIRED") return null;
  if (result.reasonCodes.includes("VAGP_RESOLVE_AGENT_STATE_STALE")) {
    return "CURRENT_TRUSTED_AGENT_STATE_REQUIRED";
  }
  if (result.reasonCodes.includes("VAGP_RESOLVE_AGENT_STATE_UNAVAILABLE")) {
    return "TRUSTED_AGENT_STATE_REQUIRED";
  }
  if (result.reasonCodes.includes("VAGP_RESOLVE_FINANCIAL_CONTEXT_REQUIRED")) {
    return "TRUSTED_FINANCIAL_CONTEXT_REQUIRED";
  }
  return "ADDITIONAL_TRUSTED_STATE_REQUIRED";
}
function projectDecision(result) {
  return Object.freeze({
    decision: decisionFromOutcome(result.outcome),
    outcome: result.outcome,
    reasonCodes: result.reasonCodes,
    evaluatedAt: result.evaluatedAt,
    agentId: result.request.agent.id,
    action: result.request.action,
    resourceId: result.request.resource.id,
    selectedAuthorityPath: selectedPath2(result),
    relevantMandates: relevantMandates(result),
    candidatePathCount: result.candidatePathCount,
    qualifyingPathCount: result.qualifyingPathCount,
    additionalStateRequirement: additionalStateRequirement(result)
  });
}
function errorDecision(reason, evaluatedAt, agentId, action, resourceId) {
  return Object.freeze({
    decision: "ERROR",
    outcome: "ERROR",
    reasonCodes: Object.freeze([reason]),
    evaluatedAt,
    agentId,
    action,
    resourceId,
    selectedAuthorityPath: null,
    relevantMandates: Object.freeze([]),
    candidatePathCount: 0,
    qualifyingPathCount: 0,
    additionalStateRequirement: null
  });
}
function buildStatusSnapshot(store, evaluatedAt) {
  const result = buildMandateStatusSnapshot({
    observedAt: evaluatedAt,
    records: store.mandates.map((record) => ({
      statusRef: record.mandate.statusRef ?? `status:${record.mandate.id}`,
      mandateId: record.mandate.id,
      state: record.lifecycleState,
      sequence: 1,
      effectiveAt: record.statusEffectiveAt
    }))
  });
  if (!result.ok) {
    throw new Error(result.errors[0]?.code ?? "VAGP_MCP_STATUS_INVALID");
  }
  return result.value;
}
async function graphAgentStates(graph, store) {
  const admittedStates = [];
  for (const record of store.agentStates) {
    const admitted = await admitTrustedAgentStateEvidence(
      Object.freeze({
        ...record.state,
        authorityDomainId: graph.authorityDomainId
      }),
      { authorize: () => true }
    );
    if (!admitted.ok)
      throw new Error(
        admitted.errors[0]?.code ?? "VAGP_AGENT_STATE_UNAVAILABLE"
      );
    admittedStates.push(admitted.value);
  }
  return Object.freeze(admittedStates);
}
async function createMcpAuthorityService(store) {
  const admittedMandates = [];
  for (const record of store.mandates) {
    const admitted = await admitMandateV03(record.mandate, {
      verify: (mandate2) => mandate2.proof[0].value === "SERVER_SIDE_TRUSTED_MANDATE"
    });
    if (!admitted.ok) throw new Error(admitted.error.code);
    admittedMandates.push(admitted.value);
  }
  const graphResult = buildAuthorityGraph({
    principals: store.principals,
    agents: store.agents,
    mandates: admittedMandates
  });
  if (!graphResult.ok) {
    throw new Error(graphResult.errors[0]?.code ?? "VAGP_MCP_GRAPH_INVALID");
  }
  const graph = graphResult.value;
  const grantRegistry = createInMemoryExecutionGrantRegistry();
  const verificationRegistry = createInMemoryVerificationRegistry();
  const trustedAgentStates = await graphAgentStates(graph, store);
  function resolve(input) {
    const evaluatedAt = input.evaluationTime ?? store.defaultEvaluationTime;
    const agentRecord = store.agentStates.find(
      (record) => record.agentId === input.agentId
    );
    const request = Object.freeze({
      vagp: "0.3",
      type: "action-request",
      id: input.requestId ?? `mcp-${randomUUID()}`,
      agent: Object.freeze({ id: input.agentId }),
      principalHint: null,
      action: input.action,
      resource: Object.freeze({ id: input.resourceId }),
      parametersDigest: input.parametersDigest ?? null,
      requestedAt: evaluatedAt,
      nonce: randomUUID()
    });
    const context = store.getTrustedContext(input);
    const statuses = buildStatusSnapshot(store, evaluatedAt);
    const resolved = resolveAuthority(graph, request, context, {
      evaluatedAt,
      statuses,
      agentStates: trustedAgentStates
    });
    if (!resolved.ok) {
      return Object.freeze({
        decision: errorDecision(
          resolved.errors[0]?.code ?? "VAGP_MCP_RESOLVE_REJECTED",
          evaluatedAt,
          input.agentId,
          input.action,
          input.resourceId
        ),
        authorityDomainId: graph.authorityDomainId,
        mandateRef: null,
        permit: null,
        evidence: Object.freeze({
          source: "VAGP_0_3_AUTHORITY_SERVICES",
          request,
          trustedAgentFingerprint: agentRecord?.dna.fingerprint ?? null
        })
      });
    }
    const decision = projectDecision(resolved.value);
    let permit = null;
    const qualifyingPathKey = selectedPath2(resolved.value);
    if (resolved.value.outcome === "AUTHORITY_CONFIRMED" && qualifyingPathKey !== null) {
      const bound = bindAuthorityDecision({
        graph,
        request,
        context,
        resolution: resolved.value,
        qualifyingPathKey,
        reservationStore: null,
        reservation: null,
        evaluatedAt
      });
      if (bound.ok) {
        const derived = deriveExecutionGrant(grantRegistry, {
          decision: bound.value,
          grantId: `grant-${request.id}`,
          idempotencyKey: `derive-${request.id}`,
          derivedAt: evaluatedAt,
          requestedValidUntil: new Date(
            Date.parse(evaluatedAt) + GRANT_VALIDITY_MS
          ).toISOString(),
          validationContext: {
            evaluatedAt,
            statuses,
            agentStates: trustedAgentStates
          }
        });
        if (derived.ok) permit = derived.value;
      }
    }
    return Object.freeze({
      decision,
      authorityDomainId: graph.authorityDomainId,
      mandateRef: decision.relevantMandates[0] ?? null,
      permit,
      evidence: Object.freeze({
        source: "VAGP_0_3_AUTHORITY_SERVICES",
        request,
        trustedAgentFingerprint: agentRecord?.dna.fingerprint ?? null
      })
    });
  }
  function explain(input) {
    const decision = input.decision;
    if (decision !== void 0) {
      const reason = firstReason(decision.reasonCodes);
      const subject = decision.agentId ?? "the agent";
      const action = decision.action ?? "the requested action";
      const base = `${decision.decision}: ${reason}.`;
      const explanation = decision.decision === "PERMIT" ? `${base} VAGP confirmed a current qualifying authority path for ${subject} to perform ${action}.` : decision.reasonCodes.includes(
        "VAGP_RESOLVE_CAPABILITY_NOT_AUTHORIZED"
      ) ? `${base} The capability is attested in trusted Agent state, but the applicable mandate does not authorize it.` : decision.reasonCodes.includes(
        "VAGP_RESOLVE_CAPABILITY_NOT_ATTESTED"
      ) ? `${base} The applicable mandate may authorize the capability, but trusted Agent state does not attest it.` : decision.reasonCodes.includes("VAGP_RESOLVE_AGENT_DNA_MISMATCH") ? `${base} The trusted Agent DNA fingerprint does not match the mandate-bound state.` : decision.reasonCodes.includes(
        "VAGP_RESOLVE_NO_CANDIDATE_PATH"
      ) ? `${base} No trusted mandate path reaches the requested agent.` : `${base} VAGP did not confirm current authority for ${subject} to perform ${action}.`;
      return Object.freeze({
        explanation,
        source: "DETERMINISTIC_VAGP_DECISION_DATA"
      });
    }
    if (input.permit !== void 0) {
      return Object.freeze({
        explanation: `PERMIT: ${input.permit.grantId}. This explanation is derived from an existing VAGP execution permit and does not create or modify authority.`,
        source: "DETERMINISTIC_VAGP_PERMIT_DATA"
      });
    }
    return Object.freeze({
      explanation: "No decision or permit was supplied to explain.",
      source: "NO_AUTHORITY_EFFECT"
    });
  }
  return Object.freeze({
    resolve,
    explain,
    getAuthority(input) {
      const resolved = resolve({
        agentId: input.agentId,
        action: input.action ?? "ticket.read",
        resourceId: input.resourceId ?? "ticket:example",
        ...input.evaluationTime === void 0 ? {} : { evaluationTime: input.evaluationTime }
      });
      return Object.freeze({
        agentId: input.agentId,
        decision: resolved.decision,
        boundedAuthority: store.mandates.filter((record) => record.mandate.subject.id === input.agentId).map((record) => ({
          mandateId: record.mandate.id,
          lifecycleState: record.lifecycleState,
          actions: record.mandate.authority.actions,
          resources: record.mandate.authority.resources,
          capabilities: "capabilities" in record.mandate.authority ? record.mandate.authority.capabilities : []
        }))
      });
    },
    getMandate(input) {
      return Object.freeze({
        mandates: store.mandates.filter(
          (record) => (input.mandateId === void 0 || record.mandate.id === input.mandateId) && (input.agentId === void 0 || record.mandate.subject.id === input.agentId)
        ).map((record) => ({
          id: record.mandate.id,
          subject: record.mandate.subject.id,
          issuer: record.mandate.issuer.id,
          parentMandate: record.mandate.parentMandate,
          lifecycleState: record.lifecycleState,
          statusRef: record.mandate.statusRef,
          authority: {
            actions: record.mandate.authority.actions,
            resources: record.mandate.authority.resources,
            delegation: record.mandate.authority.delegation,
            capabilities: "capabilities" in record.mandate.authority ? record.mandate.authority.capabilities : []
          }
        }))
      });
    },
    getAgentDna(input) {
      const record = store.agentStates.find(
        (entry) => entry.agentId === input.agentId
      );
      return record === void 0 ? Object.freeze({ found: false, reason: "VAGP_MCP_AGENT_NOT_FOUND" }) : Object.freeze({
        found: true,
        agentId: record.agentId,
        fingerprint: record.dna.fingerprint,
        stateRevision: record.state.subject.stateRevision,
        attestationId: record.state.attestationId,
        observedAt: record.state.observedAt,
        expiresAt: record.state.expiresAt,
        capabilities: record.state.capabilities
      });
    },
    verifyPermit(input) {
      const evaluatedAt = input.evaluationTime ?? store.defaultEvaluationTime;
      const statuses = buildStatusSnapshot(store, evaluatedAt);
      const result = verifyExecutionGrant(verificationRegistry, {
        grant: input.permit,
        attempt: {
          vagp: input.permit.vagp,
          requestIdentity: input.permit.requestIdentity,
          parametersDigest: input.permit.parametersDigest,
          subjectAgentId: input.permit.subjectAgentId,
          action: input.permit.action,
          resourceId: input.permit.resourceId,
          financial: input.permit.financial,
          trustedContext: input.permit.trustedContext,
          requiredCapabilities: input.permit.requiredCapabilities,
          agentStates: trustedAgentStates
        },
        evaluatedAt,
        currentStatusEvidence: statuses,
        resourceMaxStatusStalenessMs: null,
        verificationId: `verify-${randomUUID()}`,
        idempotencyKey: input.idempotencyKey ?? `verify-${randomUUID()}`
      });
      return result.ok ? Object.freeze({
        valid: true,
        outcome: result.outcome,
        reasonCodes: Object.freeze(["VAGP_VERIFY_VERIFIED"]),
        evidence: result.evidence
      }) : Object.freeze({
        valid: false,
        outcome: result.outcome,
        reasonCodes: result.errors.map((error4) => error4.code),
        evidence: result.errors
      });
    }
  });
}

// src/trusted-store.ts
var EVALUATION_TIME = "2026-09-19T12:00:00.000Z";
var NOT_AFTER = "2026-12-31T23:59:59.000Z";
var STATUS_REF = "status:mandate:mcp-demo-support-read";
var AGENT_STATUS_REF = "status:agent:demo-support";
var DEFAULT_CAPABILITY = Object.freeze({
  id: "ticket.read",
  version: "1.0.0"
});
var UNAUTHORIZED_BUT_ATTESTED_CAPABILITY = Object.freeze({
  id: "ticket.refund",
  version: "1.0.0"
});
function digest(value) {
  return Object.freeze({ algorithm: "sha-256", value });
}
var components = Object.freeze({
  implementation: Object.freeze({
    id: "verimand-demo-agent",
    version: "1.0.0"
  }),
  runtime: Object.freeze({
    id: "node-runtime",
    version: "22.0.0",
    model: null
  }),
  instructionsDigest: digest("demo-instructions"),
  policyDigest: digest("demo-policy"),
  capabilities: Object.freeze([
    DEFAULT_CAPABILITY,
    UNAUTHORIZED_BUT_ATTESTED_CAPABILITY
  ]),
  tools: Object.freeze([{ id: "ticket-api", version: "1.0.0" }]),
  environmentId: "local-mcp-dev",
  securityConfigurationDigest: digest("demo-security"),
  runtimeConstraintsDigest: digest("demo-runtime-constraints"),
  protocolConfigurationDigest: digest("vagp-0.3-core")
});
var fingerprint = Object.freeze({
  algorithm: "sha-256",
  value: "mcp-demo-agent-fingerprint-v1",
  canonicalization: "vagp-agent-dna-tuple-v1"
});
var dna = Object.freeze({
  vagp: "0.3",
  type: "agent-dna",
  schemaVersion: "1",
  agentId: "agent:demo-support",
  components,
  fingerprint
});
var mandate = Object.freeze({
  vagp: "0.3",
  type: "mandate",
  id: "mandate:mcp-demo-support-read",
  issuer: Object.freeze({ id: "principal:verimand-demo-admin" }),
  subject: Object.freeze({ id: "agent:demo-support" }),
  parentMandate: null,
  authority: Object.freeze({
    actions: ["ticket.read"],
    resources: [Object.freeze({ match: "prefix", value: "ticket:" })],
    constraints: Object.freeze({}),
    financial: null,
    autonomy: Object.freeze({ mode: "BOUNDED_AUTONOMOUS" }),
    assurance: Object.freeze({ minimum: "A2" }),
    delegation: Object.freeze({ allowed: false, remainingDepth: 0 }),
    revocation: Object.freeze({ maxStatusStalenessMs: 864e5 }),
    financialApplicability: Object.freeze({
      requiredActions: Object.freeze([])
    }),
    agentState: Object.freeze({
      fingerprint,
      stateRevision: 7,
      maxStateStalenessMs: 864e5
    }),
    capabilities: Object.freeze([DEFAULT_CAPABILITY])
  }),
  validity: Object.freeze({
    notBefore: "2026-01-01T00:00:00.000Z",
    notAfter: NOT_AFTER
  }),
  statusRef: STATUS_REF,
  proof: Object.freeze([
    Object.freeze({
      type: "fixture-admission",
      alg: "TEST-ONLY",
      kid: "mcp-demo-trusted-store",
      created: "2026-01-01T00:00:00.000Z",
      value: "SERVER_SIDE_TRUSTED_MANDATE"
    })
  ])
});
var trustedState = Object.freeze({
  authorityDomainId: "",
  subject: Object.freeze({
    agentId: dna.agentId,
    fingerprint,
    stateRevision: 7
  }),
  attestationId: "capability-attestation:mcp-demo-support-v1",
  attestationIssuerId: "principal:verimand-demo-admin",
  observedAt: EVALUATION_TIME,
  expiresAt: NOT_AFTER,
  statusRef: AGENT_STATUS_REF,
  capabilities: components.capabilities
});
function createDefaultTrustedAuthorityStore() {
  return Object.freeze({
    principals: Object.freeze([
      Object.freeze({ id: "principal:verimand-demo-admin" })
    ]),
    agents: Object.freeze([Object.freeze({ id: "agent:demo-support" })]),
    mandates: Object.freeze([
      Object.freeze({
        mandate,
        lifecycleState: "ACTIVE",
        statusEffectiveAt: EVALUATION_TIME
      })
    ]),
    agentStates: Object.freeze([
      Object.freeze({
        agentId: dna.agentId,
        dna,
        state: trustedState
      })
    ]),
    defaultEvaluationTime: EVALUATION_TIME,
    getTrustedContext(input) {
      return Object.freeze({
        resource: Object.freeze({ id: input.resourceId }),
        attributes: Object.freeze({}),
        autonomy: "BOUNDED_AUTONOMOUS",
        assurance: "A2",
        financial: null,
        requiredCapabilities: Object.freeze(
          input.action === "ticket.refund" ? [UNAUTHORIZED_BUT_ATTESTED_CAPABILITY] : [DEFAULT_CAPABILITY]
        )
      });
    }
  });
}

// src/stdio.ts
var service = await createMcpAuthorityService(
  createDefaultTrustedAuthorityStore()
);
console.error("verimand MCP authority server running on stdio");
serveStdio(() => createMcpServer(service), {
  onerror(error4) {
    console.error(`verimand MCP authority server error: ${error4.message}`);
  }
});
