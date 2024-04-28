// node_modules/@firebase/util/dist/index.esm2017.js
var getGlobal = function() {
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw new Error("Unable to locate global object.");
};
var getUA = function() {
  if (typeof navigator !== "undefined" && typeof navigator["userAgent"] === "string") {
    return navigator["userAgent"];
  } else {
    return "";
  }
};
var isNode = function() {
  var _a;
  const forceEnvironment = (_a = getDefaults()) === null || _a === undefined ? undefined : _a.forceEnvironment;
  if (forceEnvironment === "node") {
    return true;
  } else if (forceEnvironment === "browser") {
    return false;
  }
  try {
    return Object.prototype.toString.call(global.process) === "[object process]";
  } catch (e) {
    return false;
  }
};
var isSafari = function() {
  return !isNode() && !!navigator.userAgent && navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome");
};
var isIndexedDBAvailable = function() {
  try {
    return typeof indexedDB === "object";
  } catch (e) {
    return false;
  }
};
var validateIndexedDBOpenable = function() {
  return new Promise((resolve, reject) => {
    try {
      let preExist = true;
      const DB_CHECK_NAME = "validate-browser-context-for-indexeddb-analytics-module";
      const request = self.indexedDB.open(DB_CHECK_NAME);
      request.onsuccess = () => {
        request.result.close();
        if (!preExist) {
          self.indexedDB.deleteDatabase(DB_CHECK_NAME);
        }
        resolve(true);
      };
      request.onupgradeneeded = () => {
        preExist = false;
      };
      request.onerror = () => {
        var _a;
        reject(((_a = request.error) === null || _a === undefined ? undefined : _a.message) || "");
      };
    } catch (error) {
      reject(error);
    }
  });
};
var replaceTemplate = function(template, data) {
  return template.replace(PATTERN, (_, key) => {
    const value = data[key];
    return value != null ? String(value) : `<${key}?>`;
  });
};
var deepEqual = function(a, b) {
  if (a === b) {
    return true;
  }
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  for (const k of aKeys) {
    if (!bKeys.includes(k)) {
      return false;
    }
    const aProp = a[k];
    const bProp = b[k];
    if (isObject(aProp) && isObject(bProp)) {
      if (!deepEqual(aProp, bProp)) {
        return false;
      }
    } else if (aProp !== bProp) {
      return false;
    }
  }
  for (const k of bKeys) {
    if (!aKeys.includes(k)) {
      return false;
    }
  }
  return true;
};
var isObject = function(thing) {
  return thing !== null && typeof thing === "object";
};
var getModularInstance = function(service) {
  if (service && service._delegate) {
    return service._delegate;
  } else {
    return service;
  }
};
var stringToByteArray$1 = function(str) {
  const out = [];
  let p = 0;
  for (let i = 0;i < str.length; i++) {
    let c = str.charCodeAt(i);
    if (c < 128) {
      out[p++] = c;
    } else if (c < 2048) {
      out[p++] = c >> 6 | 192;
      out[p++] = c & 63 | 128;
    } else if ((c & 64512) === 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === 56320) {
      c = 65536 + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
      out[p++] = c >> 18 | 240;
      out[p++] = c >> 12 & 63 | 128;
      out[p++] = c >> 6 & 63 | 128;
      out[p++] = c & 63 | 128;
    } else {
      out[p++] = c >> 12 | 224;
      out[p++] = c >> 6 & 63 | 128;
      out[p++] = c & 63 | 128;
    }
  }
  return out;
};
var byteArrayToString = function(bytes) {
  const out = [];
  let pos = 0, c = 0;
  while (pos < bytes.length) {
    const c1 = bytes[pos++];
    if (c1 < 128) {
      out[c++] = String.fromCharCode(c1);
    } else if (c1 > 191 && c1 < 224) {
      const c2 = bytes[pos++];
      out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
    } else if (c1 > 239 && c1 < 365) {
      const c2 = bytes[pos++];
      const c3 = bytes[pos++];
      const c4 = bytes[pos++];
      const u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 65536;
      out[c++] = String.fromCharCode(55296 + (u >> 10));
      out[c++] = String.fromCharCode(56320 + (u & 1023));
    } else {
      const c2 = bytes[pos++];
      const c3 = bytes[pos++];
      out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
    }
  }
  return out.join("");
};
var base64 = {
  byteToCharMap_: null,
  charToByteMap_: null,
  byteToCharMapWebSafe_: null,
  charToByteMapWebSafe_: null,
  ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  get ENCODED_VALS() {
    return this.ENCODED_VALS_BASE + "+/=";
  },
  get ENCODED_VALS_WEBSAFE() {
    return this.ENCODED_VALS_BASE + "-_.";
  },
  HAS_NATIVE_SUPPORT: typeof atob === "function",
  encodeByteArray(input, webSafe) {
    if (!Array.isArray(input)) {
      throw Error("encodeByteArray takes an array as a parameter");
    }
    this.init_();
    const byteToCharMap = webSafe ? this.byteToCharMapWebSafe_ : this.byteToCharMap_;
    const output = [];
    for (let i = 0;i < input.length; i += 3) {
      const byte1 = input[i];
      const haveByte2 = i + 1 < input.length;
      const byte2 = haveByte2 ? input[i + 1] : 0;
      const haveByte3 = i + 2 < input.length;
      const byte3 = haveByte3 ? input[i + 2] : 0;
      const outByte1 = byte1 >> 2;
      const outByte2 = (byte1 & 3) << 4 | byte2 >> 4;
      let outByte3 = (byte2 & 15) << 2 | byte3 >> 6;
      let outByte4 = byte3 & 63;
      if (!haveByte3) {
        outByte4 = 64;
        if (!haveByte2) {
          outByte3 = 64;
        }
      }
      output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
    }
    return output.join("");
  },
  encodeString(input, webSafe) {
    if (this.HAS_NATIVE_SUPPORT && !webSafe) {
      return btoa(input);
    }
    return this.encodeByteArray(stringToByteArray$1(input), webSafe);
  },
  decodeString(input, webSafe) {
    if (this.HAS_NATIVE_SUPPORT && !webSafe) {
      return atob(input);
    }
    return byteArrayToString(this.decodeStringToByteArray(input, webSafe));
  },
  decodeStringToByteArray(input, webSafe) {
    this.init_();
    const charToByteMap = webSafe ? this.charToByteMapWebSafe_ : this.charToByteMap_;
    const output = [];
    for (let i = 0;i < input.length; ) {
      const byte1 = charToByteMap[input.charAt(i++)];
      const haveByte2 = i < input.length;
      const byte2 = haveByte2 ? charToByteMap[input.charAt(i)] : 0;
      ++i;
      const haveByte3 = i < input.length;
      const byte3 = haveByte3 ? charToByteMap[input.charAt(i)] : 64;
      ++i;
      const haveByte4 = i < input.length;
      const byte4 = haveByte4 ? charToByteMap[input.charAt(i)] : 64;
      ++i;
      if (byte1 == null || byte2 == null || byte3 == null || byte4 == null) {
        throw new DecodeBase64StringError;
      }
      const outByte1 = byte1 << 2 | byte2 >> 4;
      output.push(outByte1);
      if (byte3 !== 64) {
        const outByte2 = byte2 << 4 & 240 | byte3 >> 2;
        output.push(outByte2);
        if (byte4 !== 64) {
          const outByte3 = byte3 << 6 & 192 | byte4;
          output.push(outByte3);
        }
      }
    }
    return output;
  },
  init_() {
    if (!this.byteToCharMap_) {
      this.byteToCharMap_ = {};
      this.charToByteMap_ = {};
      this.byteToCharMapWebSafe_ = {};
      this.charToByteMapWebSafe_ = {};
      for (let i = 0;i < this.ENCODED_VALS.length; i++) {
        this.byteToCharMap_[i] = this.ENCODED_VALS.charAt(i);
        this.charToByteMap_[this.byteToCharMap_[i]] = i;
        this.byteToCharMapWebSafe_[i] = this.ENCODED_VALS_WEBSAFE.charAt(i);
        this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]] = i;
        if (i >= this.ENCODED_VALS_BASE.length) {
          this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
          this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)] = i;
        }
      }
    }
  }
};

class DecodeBase64StringError extends Error {
  constructor() {
    super(...arguments);
    this.name = "DecodeBase64StringError";
  }
}
var base64Encode = function(str) {
  const utf8Bytes = stringToByteArray$1(str);
  return base64.encodeByteArray(utf8Bytes, true);
};
var base64urlEncodeWithoutPadding = function(str) {
  return base64Encode(str).replace(/\./g, "");
};
var base64Decode = function(str) {
  try {
    return base64.decodeString(str, true);
  } catch (e) {
    console.error("base64Decode failed: ", e);
  }
  return null;
};
var getDefaultsFromGlobal = () => getGlobal().__FIREBASE_DEFAULTS__;
var getDefaultsFromEnvVariable = () => {
  if (typeof process === "undefined" || typeof process.env === "undefined") {
    return;
  }
  const defaultsJsonString = process.env.__FIREBASE_DEFAULTS__;
  if (defaultsJsonString) {
    return JSON.parse(defaultsJsonString);
  }
};
var getDefaultsFromCookie = () => {
  if (typeof document === "undefined") {
    return;
  }
  let match;
  try {
    match = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
  } catch (e) {
    return;
  }
  const decoded = match && base64Decode(match[1]);
  return decoded && JSON.parse(decoded);
};
var getDefaults = () => {
  try {
    return getDefaultsFromGlobal() || getDefaultsFromEnvVariable() || getDefaultsFromCookie();
  } catch (e) {
    console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);
    return;
  }
};
var getDefaultAppConfig = () => {
  var _a;
  return (_a = getDefaults()) === null || _a === undefined ? undefined : _a.config;
};
class Deferred {
  constructor() {
    this.reject = () => {
    };
    this.resolve = () => {
    };
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
  wrapCallback(callback) {
    return (error, value) => {
      if (error) {
        this.reject(error);
      } else {
        this.resolve(value);
      }
      if (typeof callback === "function") {
        this.promise.catch(() => {
        });
        if (callback.length === 1) {
          callback(error);
        } else {
          callback(error, value);
        }
      }
    };
  }
}
var ERROR_NAME = "FirebaseError";

class FirebaseError extends Error {
  constructor(code, message, customData) {
    super(message);
    this.code = code;
    this.customData = customData;
    this.name = ERROR_NAME;
    Object.setPrototypeOf(this, FirebaseError.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorFactory.prototype.create);
    }
  }
}

class ErrorFactory {
  constructor(service, serviceName, errors) {
    this.service = service;
    this.serviceName = serviceName;
    this.errors = errors;
  }
  create(code, ...data) {
    const customData = data[0] || {};
    const fullCode = `${this.service}/${code}`;
    const template = this.errors[code];
    const message = template ? replaceTemplate(template, customData) : "Error";
    const fullMessage = `${this.serviceName}: ${message} (${fullCode}).`;
    const error = new FirebaseError(fullCode, fullMessage, customData);
    return error;
  }
}
var PATTERN = /\{\$([^}]+)}/g;
var MAX_VALUE_MILLIS = 4 * 60 * 60 * 1000;

// node_modules/@firebase/component/dist/esm/index.esm2017.js
var normalizeIdentifierForFactory = function(identifier) {
  return identifier === DEFAULT_ENTRY_NAME ? undefined : identifier;
};
var isComponentEager = function(component) {
  return component.instantiationMode === "EAGER";
};

class Component {
  constructor(name, instanceFactory, type) {
    this.name = name;
    this.instanceFactory = instanceFactory;
    this.type = type;
    this.multipleInstances = false;
    this.serviceProps = {};
    this.instantiationMode = "LAZY";
    this.onInstanceCreated = null;
  }
  setInstantiationMode(mode) {
    this.instantiationMode = mode;
    return this;
  }
  setMultipleInstances(multipleInstances) {
    this.multipleInstances = multipleInstances;
    return this;
  }
  setServiceProps(props) {
    this.serviceProps = props;
    return this;
  }
  setInstanceCreatedCallback(callback) {
    this.onInstanceCreated = callback;
    return this;
  }
}
var DEFAULT_ENTRY_NAME = "[DEFAULT]";

class Provider {
  constructor(name, container) {
    this.name = name;
    this.container = container;
    this.component = null;
    this.instances = new Map;
    this.instancesDeferred = new Map;
    this.instancesOptions = new Map;
    this.onInitCallbacks = new Map;
  }
  get(identifier) {
    const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
    if (!this.instancesDeferred.has(normalizedIdentifier)) {
      const deferred = new Deferred;
      this.instancesDeferred.set(normalizedIdentifier, deferred);
      if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
        try {
          const instance = this.getOrInitializeService({
            instanceIdentifier: normalizedIdentifier
          });
          if (instance) {
            deferred.resolve(instance);
          }
        } catch (e) {
        }
      }
    }
    return this.instancesDeferred.get(normalizedIdentifier).promise;
  }
  getImmediate(options) {
    var _a;
    const normalizedIdentifier = this.normalizeInstanceIdentifier(options === null || options === undefined ? undefined : options.identifier);
    const optional = (_a = options === null || options === undefined ? undefined : options.optional) !== null && _a !== undefined ? _a : false;
    if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
      try {
        return this.getOrInitializeService({
          instanceIdentifier: normalizedIdentifier
        });
      } catch (e) {
        if (optional) {
          return null;
        } else {
          throw e;
        }
      }
    } else {
      if (optional) {
        return null;
      } else {
        throw Error(`Service ${this.name} is not available`);
      }
    }
  }
  getComponent() {
    return this.component;
  }
  setComponent(component) {
    if (component.name !== this.name) {
      throw Error(`Mismatching Component ${component.name} for Provider ${this.name}.`);
    }
    if (this.component) {
      throw Error(`Component for ${this.name} has already been provided`);
    }
    this.component = component;
    if (!this.shouldAutoInitialize()) {
      return;
    }
    if (isComponentEager(component)) {
      try {
        this.getOrInitializeService({ instanceIdentifier: DEFAULT_ENTRY_NAME });
      } catch (e) {
      }
    }
    for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
      const normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
      try {
        const instance = this.getOrInitializeService({
          instanceIdentifier: normalizedIdentifier
        });
        instanceDeferred.resolve(instance);
      } catch (e) {
      }
    }
  }
  clearInstance(identifier = DEFAULT_ENTRY_NAME) {
    this.instancesDeferred.delete(identifier);
    this.instancesOptions.delete(identifier);
    this.instances.delete(identifier);
  }
  async delete() {
    const services = Array.from(this.instances.values());
    await Promise.all([
      ...services.filter((service) => ("INTERNAL" in service)).map((service) => service.INTERNAL.delete()),
      ...services.filter((service) => ("_delete" in service)).map((service) => service._delete())
    ]);
  }
  isComponentSet() {
    return this.component != null;
  }
  isInitialized(identifier = DEFAULT_ENTRY_NAME) {
    return this.instances.has(identifier);
  }
  getOptions(identifier = DEFAULT_ENTRY_NAME) {
    return this.instancesOptions.get(identifier) || {};
  }
  initialize(opts = {}) {
    const { options = {} } = opts;
    const normalizedIdentifier = this.normalizeInstanceIdentifier(opts.instanceIdentifier);
    if (this.isInitialized(normalizedIdentifier)) {
      throw Error(`${this.name}(${normalizedIdentifier}) has already been initialized`);
    }
    if (!this.isComponentSet()) {
      throw Error(`Component ${this.name} has not been registered yet`);
    }
    const instance = this.getOrInitializeService({
      instanceIdentifier: normalizedIdentifier,
      options
    });
    for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
      const normalizedDeferredIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
      if (normalizedIdentifier === normalizedDeferredIdentifier) {
        instanceDeferred.resolve(instance);
      }
    }
    return instance;
  }
  onInit(callback, identifier) {
    var _a;
    const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
    const existingCallbacks = (_a = this.onInitCallbacks.get(normalizedIdentifier)) !== null && _a !== undefined ? _a : new Set;
    existingCallbacks.add(callback);
    this.onInitCallbacks.set(normalizedIdentifier, existingCallbacks);
    const existingInstance = this.instances.get(normalizedIdentifier);
    if (existingInstance) {
      callback(existingInstance, normalizedIdentifier);
    }
    return () => {
      existingCallbacks.delete(callback);
    };
  }
  invokeOnInitCallbacks(instance, identifier) {
    const callbacks = this.onInitCallbacks.get(identifier);
    if (!callbacks) {
      return;
    }
    for (const callback of callbacks) {
      try {
        callback(instance, identifier);
      } catch (_a) {
      }
    }
  }
  getOrInitializeService({ instanceIdentifier, options = {} }) {
    let instance = this.instances.get(instanceIdentifier);
    if (!instance && this.component) {
      instance = this.component.instanceFactory(this.container, {
        instanceIdentifier: normalizeIdentifierForFactory(instanceIdentifier),
        options
      });
      this.instances.set(instanceIdentifier, instance);
      this.instancesOptions.set(instanceIdentifier, options);
      this.invokeOnInitCallbacks(instance, instanceIdentifier);
      if (this.component.onInstanceCreated) {
        try {
          this.component.onInstanceCreated(this.container, instanceIdentifier, instance);
        } catch (_a) {
        }
      }
    }
    return instance || null;
  }
  normalizeInstanceIdentifier(identifier = DEFAULT_ENTRY_NAME) {
    if (this.component) {
      return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME;
    } else {
      return identifier;
    }
  }
  shouldAutoInitialize() {
    return !!this.component && this.component.instantiationMode !== "EXPLICIT";
  }
}

class ComponentContainer {
  constructor(name) {
    this.name = name;
    this.providers = new Map;
  }
  addComponent(component) {
    const provider = this.getProvider(component.name);
    if (provider.isComponentSet()) {
      throw new Error(`Component ${component.name} has already been registered with ${this.name}`);
    }
    provider.setComponent(component);
  }
  addOrOverwriteComponent(component) {
    const provider = this.getProvider(component.name);
    if (provider.isComponentSet()) {
      this.providers.delete(component.name);
    }
    this.addComponent(component);
  }
  getProvider(name) {
    if (this.providers.has(name)) {
      return this.providers.get(name);
    }
    const provider = new Provider(name, this);
    this.providers.set(name, provider);
    return provider;
  }
  getProviders() {
    return Array.from(this.providers.values());
  }
}

// node_modules/@firebase/logger/dist/esm/index.esm2017.js
var instances = [];
var LogLevel;
(function(LogLevel2) {
  LogLevel2[LogLevel2["DEBUG"] = 0] = "DEBUG";
  LogLevel2[LogLevel2["VERBOSE"] = 1] = "VERBOSE";
  LogLevel2[LogLevel2["INFO"] = 2] = "INFO";
  LogLevel2[LogLevel2["WARN"] = 3] = "WARN";
  LogLevel2[LogLevel2["ERROR"] = 4] = "ERROR";
  LogLevel2[LogLevel2["SILENT"] = 5] = "SILENT";
})(LogLevel || (LogLevel = {}));
var levelStringToEnum = {
  debug: LogLevel.DEBUG,
  verbose: LogLevel.VERBOSE,
  info: LogLevel.INFO,
  warn: LogLevel.WARN,
  error: LogLevel.ERROR,
  silent: LogLevel.SILENT
};
var defaultLogLevel = LogLevel.INFO;
var ConsoleMethod = {
  [LogLevel.DEBUG]: "log",
  [LogLevel.VERBOSE]: "log",
  [LogLevel.INFO]: "info",
  [LogLevel.WARN]: "warn",
  [LogLevel.ERROR]: "error"
};
var defaultLogHandler = (instance, logType, ...args) => {
  if (logType < instance.logLevel) {
    return;
  }
  const now = new Date().toISOString();
  const method = ConsoleMethod[logType];
  if (method) {
    console[method](`[${now}]  ${instance.name}:`, ...args);
  } else {
    throw new Error(`Attempted to log a message with an invalid logType (value: ${logType})`);
  }
};

class Logger {
  constructor(name) {
    this.name = name;
    this._logLevel = defaultLogLevel;
    this._logHandler = defaultLogHandler;
    this._userLogHandler = null;
    instances.push(this);
  }
  get logLevel() {
    return this._logLevel;
  }
  set logLevel(val) {
    if (!(val in LogLevel)) {
      throw new TypeError(`Invalid value "${val}" assigned to \`logLevel\``);
    }
    this._logLevel = val;
  }
  setLogLevel(val) {
    this._logLevel = typeof val === "string" ? levelStringToEnum[val] : val;
  }
  get logHandler() {
    return this._logHandler;
  }
  set logHandler(val) {
    if (typeof val !== "function") {
      throw new TypeError("Value assigned to `logHandler` must be a function");
    }
    this._logHandler = val;
  }
  get userLogHandler() {
    return this._userLogHandler;
  }
  set userLogHandler(val) {
    this._userLogHandler = val;
  }
  debug(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.DEBUG, ...args);
    this._logHandler(this, LogLevel.DEBUG, ...args);
  }
  log(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.VERBOSE, ...args);
    this._logHandler(this, LogLevel.VERBOSE, ...args);
  }
  info(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.INFO, ...args);
    this._logHandler(this, LogLevel.INFO, ...args);
  }
  warn(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.WARN, ...args);
    this._logHandler(this, LogLevel.WARN, ...args);
  }
  error(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.ERROR, ...args);
    this._logHandler(this, LogLevel.ERROR, ...args);
  }
}
// node_modules/idb/build/wrap-idb-value.js
var getIdbProxyableTypes = function() {
  return idbProxyableTypes || (idbProxyableTypes = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
};
var getCursorAdvanceMethods = function() {
  return cursorAdvanceMethods || (cursorAdvanceMethods = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
};
var promisifyRequest = function(request) {
  const promise = new Promise((resolve, reject) => {
    const unlisten = () => {
      request.removeEventListener("success", success);
      request.removeEventListener("error", error);
    };
    const success = () => {
      resolve(wrap(request.result));
      unlisten();
    };
    const error = () => {
      reject(request.error);
      unlisten();
    };
    request.addEventListener("success", success);
    request.addEventListener("error", error);
  });
  promise.then((value) => {
    if (value instanceof IDBCursor) {
      cursorRequestMap.set(value, request);
    }
  }).catch(() => {
  });
  reverseTransformCache.set(promise, request);
  return promise;
};
var cacheDonePromiseForTransaction = function(tx) {
  if (transactionDoneMap.has(tx))
    return;
  const done = new Promise((resolve, reject) => {
    const unlisten = () => {
      tx.removeEventListener("complete", complete);
      tx.removeEventListener("error", error);
      tx.removeEventListener("abort", error);
    };
    const complete = () => {
      resolve();
      unlisten();
    };
    const error = () => {
      reject(tx.error || new DOMException("AbortError", "AbortError"));
      unlisten();
    };
    tx.addEventListener("complete", complete);
    tx.addEventListener("error", error);
    tx.addEventListener("abort", error);
  });
  transactionDoneMap.set(tx, done);
};
var replaceTraps = function(callback) {
  idbProxyTraps = callback(idbProxyTraps);
};
var wrapFunction = function(func) {
  if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) {
    return function(storeNames, ...args) {
      const tx = func.call(unwrap(this), storeNames, ...args);
      transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
      return wrap(tx);
    };
  }
  if (getCursorAdvanceMethods().includes(func)) {
    return function(...args) {
      func.apply(unwrap(this), args);
      return wrap(cursorRequestMap.get(this));
    };
  }
  return function(...args) {
    return wrap(func.apply(unwrap(this), args));
  };
};
var transformCachableValue = function(value) {
  if (typeof value === "function")
    return wrapFunction(value);
  if (value instanceof IDBTransaction)
    cacheDonePromiseForTransaction(value);
  if (instanceOfAny(value, getIdbProxyableTypes()))
    return new Proxy(value, idbProxyTraps);
  return value;
};
var wrap = function(value) {
  if (value instanceof IDBRequest)
    return promisifyRequest(value);
  if (transformCache.has(value))
    return transformCache.get(value);
  const newValue = transformCachableValue(value);
  if (newValue !== value) {
    transformCache.set(value, newValue);
    reverseTransformCache.set(newValue, value);
  }
  return newValue;
};
var instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
var idbProxyableTypes;
var cursorAdvanceMethods;
var cursorRequestMap = new WeakMap;
var transactionDoneMap = new WeakMap;
var transactionStoreNamesMap = new WeakMap;
var transformCache = new WeakMap;
var reverseTransformCache = new WeakMap;
var idbProxyTraps = {
  get(target, prop, receiver) {
    if (target instanceof IDBTransaction) {
      if (prop === "done")
        return transactionDoneMap.get(target);
      if (prop === "objectStoreNames") {
        return target.objectStoreNames || transactionStoreNamesMap.get(target);
      }
      if (prop === "store") {
        return receiver.objectStoreNames[1] ? undefined : receiver.objectStore(receiver.objectStoreNames[0]);
      }
    }
    return wrap(target[prop]);
  },
  set(target, prop, value) {
    target[prop] = value;
    return true;
  },
  has(target, prop) {
    if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
      return true;
    }
    return prop in target;
  }
};
var unwrap = (value) => reverseTransformCache.get(value);

// node_modules/idb/build/index.js
var openDB = function(name, version, { blocked, upgrade, blocking, terminated } = {}) {
  const request = indexedDB.open(name, version);
  const openPromise = wrap(request);
  if (upgrade) {
    request.addEventListener("upgradeneeded", (event) => {
      upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
    });
  }
  if (blocked) {
    request.addEventListener("blocked", (event) => blocked(event.oldVersion, event.newVersion, event));
  }
  openPromise.then((db2) => {
    if (terminated)
      db2.addEventListener("close", () => terminated());
    if (blocking) {
      db2.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
    }
  }).catch(() => {
  });
  return openPromise;
};
var getMethod = function(target, prop) {
  if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
    return;
  }
  if (cachedMethods.get(prop))
    return cachedMethods.get(prop);
  const targetFuncName = prop.replace(/FromIndex$/, "");
  const useIndex = prop !== targetFuncName;
  const isWrite = writeMethods.includes(targetFuncName);
  if (!(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))) {
    return;
  }
  const method = async function(storeName, ...args) {
    const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
    let target2 = tx.store;
    if (useIndex)
      target2 = target2.index(args.shift());
    return (await Promise.all([
      target2[targetFuncName](...args),
      isWrite && tx.done
    ]))[0];
  };
  cachedMethods.set(prop, method);
  return method;
};
var readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
var writeMethods = ["put", "add", "delete", "clear"];
var cachedMethods = new Map;
replaceTraps((oldTraps) => ({
  ...oldTraps,
  get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
  has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
}));

// node_modules/@firebase/app/dist/esm/index.esm2017.js
var isVersionServiceProvider = function(provider) {
  const component2 = provider.getComponent();
  return (component2 === null || component2 === undefined ? undefined : component2.type) === "VERSION";
};
var _addComponent = function(app, component2) {
  try {
    app.container.addComponent(component2);
  } catch (e) {
    logger2.debug(`Component ${component2.name} failed to register with FirebaseApp ${app.name}`, e);
  }
};
var _registerComponent = function(component2) {
  const componentName = component2.name;
  if (_components.has(componentName)) {
    logger2.debug(`There were multiple attempts to register component ${componentName}.`);
    return false;
  }
  _components.set(componentName, component2);
  for (const app of _apps.values()) {
    _addComponent(app, component2);
  }
  for (const serverApp of _serverApps.values()) {
    _addComponent(serverApp, component2);
  }
  return true;
};
var _getProvider = function(app, name) {
  const heartbeatController = app.container.getProvider("heartbeat").getImmediate({ optional: true });
  if (heartbeatController) {
    heartbeatController.triggerHeartbeat();
  }
  return app.container.getProvider(name);
};
var initializeApp = function(_options, rawConfig = {}) {
  let options = _options;
  if (typeof rawConfig !== "object") {
    const name2 = rawConfig;
    rawConfig = { name: name2 };
  }
  const config = Object.assign({ name: DEFAULT_ENTRY_NAME2, automaticDataCollectionEnabled: false }, rawConfig);
  const name = config.name;
  if (typeof name !== "string" || !name) {
    throw ERROR_FACTORY.create("bad-app-name", {
      appName: String(name)
    });
  }
  options || (options = getDefaultAppConfig());
  if (!options) {
    throw ERROR_FACTORY.create("no-options");
  }
  const existingApp = _apps.get(name);
  if (existingApp) {
    if (deepEqual(options, existingApp.options) && deepEqual(config, existingApp.config)) {
      return existingApp;
    } else {
      throw ERROR_FACTORY.create("duplicate-app", { appName: name });
    }
  }
  const container = new ComponentContainer(name);
  for (const component2 of _components.values()) {
    container.addComponent(component2);
  }
  const newApp = new FirebaseAppImpl(options, config, container);
  _apps.set(name, newApp);
  return newApp;
};
var registerVersion = function(libraryKeyOrName, version, variant) {
  var _a;
  let library = (_a = PLATFORM_LOG_STRING[libraryKeyOrName]) !== null && _a !== undefined ? _a : libraryKeyOrName;
  if (variant) {
    library += `-${variant}`;
  }
  const libraryMismatch = library.match(/\s|\//);
  const versionMismatch = version.match(/\s|\//);
  if (libraryMismatch || versionMismatch) {
    const warning = [
      `Unable to register library "${library}" with version "${version}":`
    ];
    if (libraryMismatch) {
      warning.push(`library name "${library}" contains illegal characters (whitespace or "/")`);
    }
    if (libraryMismatch && versionMismatch) {
      warning.push("and");
    }
    if (versionMismatch) {
      warning.push(`version name "${version}" contains illegal characters (whitespace or "/")`);
    }
    logger2.warn(warning.join(" "));
    return;
  }
  _registerComponent(new Component(`${library}-version`, () => ({ library, version }), "VERSION"));
};
var getDbPromise = function() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade: (db2, oldVersion) => {
        switch (oldVersion) {
          case 0:
            try {
              db2.createObjectStore(STORE_NAME);
            } catch (e) {
              console.warn(e);
            }
        }
      }
    }).catch((e) => {
      throw ERROR_FACTORY.create("idb-open", {
        originalErrorMessage: e.message
      });
    });
  }
  return dbPromise;
};
async function readHeartbeatsFromIndexedDB(app) {
  try {
    const db2 = await getDbPromise();
    const tx = db2.transaction(STORE_NAME);
    const result = await tx.objectStore(STORE_NAME).get(computeKey(app));
    await tx.done;
    return result;
  } catch (e) {
    if (e instanceof FirebaseError) {
      logger2.warn(e.message);
    } else {
      const idbGetError = ERROR_FACTORY.create("idb-get", {
        originalErrorMessage: e === null || e === undefined ? undefined : e.message
      });
      logger2.warn(idbGetError.message);
    }
  }
}
async function writeHeartbeatsToIndexedDB(app, heartbeatObject) {
  try {
    const db2 = await getDbPromise();
    const tx = db2.transaction(STORE_NAME, "readwrite");
    const objectStore = tx.objectStore(STORE_NAME);
    await objectStore.put(heartbeatObject, computeKey(app));
    await tx.done;
  } catch (e) {
    if (e instanceof FirebaseError) {
      logger2.warn(e.message);
    } else {
      const idbGetError = ERROR_FACTORY.create("idb-set", {
        originalErrorMessage: e === null || e === undefined ? undefined : e.message
      });
      logger2.warn(idbGetError.message);
    }
  }
}
var computeKey = function(app) {
  return `${app.name}!${app.options.appId}`;
};
var getUTCDateString = function() {
  const today = new Date;
  return today.toISOString().substring(0, 10);
};
var extractHeartbeatsForHeader = function(heartbeatsCache, maxSize = MAX_HEADER_BYTES) {
  const heartbeatsToSend = [];
  let unsentEntries = heartbeatsCache.slice();
  for (const singleDateHeartbeat of heartbeatsCache) {
    const heartbeatEntry = heartbeatsToSend.find((hb) => hb.agent === singleDateHeartbeat.agent);
    if (!heartbeatEntry) {
      heartbeatsToSend.push({
        agent: singleDateHeartbeat.agent,
        dates: [singleDateHeartbeat.date]
      });
      if (countBytes(heartbeatsToSend) > maxSize) {
        heartbeatsToSend.pop();
        break;
      }
    } else {
      heartbeatEntry.dates.push(singleDateHeartbeat.date);
      if (countBytes(heartbeatsToSend) > maxSize) {
        heartbeatEntry.dates.pop();
        break;
      }
    }
    unsentEntries = unsentEntries.slice(1);
  }
  return {
    heartbeatsToSend,
    unsentEntries
  };
};
var countBytes = function(heartbeatsCache) {
  return base64urlEncodeWithoutPadding(JSON.stringify({ version: 2, heartbeats: heartbeatsCache })).length;
};
var registerCoreComponents = function(variant) {
  _registerComponent(new Component("platform-logger", (container) => new PlatformLoggerServiceImpl(container), "PRIVATE"));
  _registerComponent(new Component("heartbeat", (container) => new HeartbeatServiceImpl(container), "PRIVATE"));
  registerVersion(name$o, version$1, variant);
  registerVersion(name$o, version$1, "esm2017");
  registerVersion("fire-js", "");
};

class PlatformLoggerServiceImpl {
  constructor(container) {
    this.container = container;
  }
  getPlatformInfoString() {
    const providers = this.container.getProviders();
    return providers.map((provider) => {
      if (isVersionServiceProvider(provider)) {
        const service = provider.getImmediate();
        return `${service.library}/${service.version}`;
      } else {
        return null;
      }
    }).filter((logString) => logString).join(" ");
  }
}
var name$o = "@firebase/app";
var version$1 = "0.10.2";
var logger2 = new Logger("@firebase/app");
var name$n = "@firebase/app-compat";
var name$m = "@firebase/analytics-compat";
var name$l = "@firebase/analytics";
var name$k = "@firebase/app-check-compat";
var name$j = "@firebase/app-check";
var name$i = "@firebase/auth";
var name$h = "@firebase/auth-compat";
var name$g = "@firebase/database";
var name$f = "@firebase/database-compat";
var name$e = "@firebase/functions";
var name$d = "@firebase/functions-compat";
var name$c = "@firebase/installations";
var name$b = "@firebase/installations-compat";
var name$a = "@firebase/messaging";
var name$9 = "@firebase/messaging-compat";
var name$8 = "@firebase/performance";
var name$7 = "@firebase/performance-compat";
var name$6 = "@firebase/remote-config";
var name$5 = "@firebase/remote-config-compat";
var name$4 = "@firebase/storage";
var name$3 = "@firebase/storage-compat";
var name$2 = "@firebase/firestore";
var name$1 = "@firebase/firestore-compat";
var name = "firebase";
var version = "10.11.1";
var DEFAULT_ENTRY_NAME2 = "[DEFAULT]";
var PLATFORM_LOG_STRING = {
  [name$o]: "fire-core",
  [name$n]: "fire-core-compat",
  [name$l]: "fire-analytics",
  [name$m]: "fire-analytics-compat",
  [name$j]: "fire-app-check",
  [name$k]: "fire-app-check-compat",
  [name$i]: "fire-auth",
  [name$h]: "fire-auth-compat",
  [name$g]: "fire-rtdb",
  [name$f]: "fire-rtdb-compat",
  [name$e]: "fire-fn",
  [name$d]: "fire-fn-compat",
  [name$c]: "fire-iid",
  [name$b]: "fire-iid-compat",
  [name$a]: "fire-fcm",
  [name$9]: "fire-fcm-compat",
  [name$8]: "fire-perf",
  [name$7]: "fire-perf-compat",
  [name$6]: "fire-rc",
  [name$5]: "fire-rc-compat",
  [name$4]: "fire-gcs",
  [name$3]: "fire-gcs-compat",
  [name$2]: "fire-fst",
  [name$1]: "fire-fst-compat",
  "fire-js": "fire-js",
  [name]: "fire-js-all"
};
var _apps = new Map;
var _serverApps = new Map;
var _components = new Map;
var ERRORS = {
  ["no-app"]: "No Firebase App '{$appName}' has been created - call initializeApp() first",
  ["bad-app-name"]: "Illegal App name: '{$appName}'",
  ["duplicate-app"]: "Firebase App named '{$appName}' already exists with different options or config",
  ["app-deleted"]: "Firebase App named '{$appName}' already deleted",
  ["server-app-deleted"]: "Firebase Server App has been deleted",
  ["no-options"]: "Need to provide options, when not being deployed to hosting via source.",
  ["invalid-app-argument"]: "firebase.{$appName}() takes either no argument or a Firebase App instance.",
  ["invalid-log-argument"]: "First argument to `onLog` must be null or a function.",
  ["idb-open"]: "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
  ["idb-get"]: "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
  ["idb-set"]: "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
  ["idb-delete"]: "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",
  ["finalization-registry-not-supported"]: "FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.",
  ["invalid-server-app-environment"]: "FirebaseServerApp is not for use in browser environments."
};
var ERROR_FACTORY = new ErrorFactory("app", "Firebase", ERRORS);

class FirebaseAppImpl {
  constructor(options, config, container) {
    this._isDeleted = false;
    this._options = Object.assign({}, options);
    this._config = Object.assign({}, config);
    this._name = config.name;
    this._automaticDataCollectionEnabled = config.automaticDataCollectionEnabled;
    this._container = container;
    this.container.addComponent(new Component("app", () => this, "PUBLIC"));
  }
  get automaticDataCollectionEnabled() {
    this.checkDestroyed();
    return this._automaticDataCollectionEnabled;
  }
  set automaticDataCollectionEnabled(val) {
    this.checkDestroyed();
    this._automaticDataCollectionEnabled = val;
  }
  get name() {
    this.checkDestroyed();
    return this._name;
  }
  get options() {
    this.checkDestroyed();
    return this._options;
  }
  get config() {
    this.checkDestroyed();
    return this._config;
  }
  get container() {
    return this._container;
  }
  get isDeleted() {
    return this._isDeleted;
  }
  set isDeleted(val) {
    this._isDeleted = val;
  }
  checkDestroyed() {
    if (this.isDeleted) {
      throw ERROR_FACTORY.create("app-deleted", { appName: this._name });
    }
  }
}
var SDK_VERSION = version;
var DB_NAME = "firebase-heartbeat-database";
var DB_VERSION = 1;
var STORE_NAME = "firebase-heartbeat-store";
var dbPromise = null;
var MAX_HEADER_BYTES = 1024;
var STORED_HEARTBEAT_RETENTION_MAX_MILLIS = 30 * 24 * 60 * 60 * 1000;

class HeartbeatServiceImpl {
  constructor(container) {
    this.container = container;
    this._heartbeatsCache = null;
    const app = this.container.getProvider("app").getImmediate();
    this._storage = new HeartbeatStorageImpl(app);
    this._heartbeatsCachePromise = this._storage.read().then((result) => {
      this._heartbeatsCache = result;
      return result;
    });
  }
  async triggerHeartbeat() {
    var _a, _b;
    const platformLogger = this.container.getProvider("platform-logger").getImmediate();
    const agent = platformLogger.getPlatformInfoString();
    const date = getUTCDateString();
    if (((_a = this._heartbeatsCache) === null || _a === undefined ? undefined : _a.heartbeats) == null) {
      this._heartbeatsCache = await this._heartbeatsCachePromise;
      if (((_b = this._heartbeatsCache) === null || _b === undefined ? undefined : _b.heartbeats) == null) {
        return;
      }
    }
    if (this._heartbeatsCache.lastSentHeartbeatDate === date || this._heartbeatsCache.heartbeats.some((singleDateHeartbeat) => singleDateHeartbeat.date === date)) {
      return;
    } else {
      this._heartbeatsCache.heartbeats.push({ date, agent });
    }
    this._heartbeatsCache.heartbeats = this._heartbeatsCache.heartbeats.filter((singleDateHeartbeat) => {
      const hbTimestamp = new Date(singleDateHeartbeat.date).valueOf();
      const now = Date.now();
      return now - hbTimestamp <= STORED_HEARTBEAT_RETENTION_MAX_MILLIS;
    });
    return this._storage.overwrite(this._heartbeatsCache);
  }
  async getHeartbeatsHeader() {
    var _a;
    if (this._heartbeatsCache === null) {
      await this._heartbeatsCachePromise;
    }
    if (((_a = this._heartbeatsCache) === null || _a === undefined ? undefined : _a.heartbeats) == null || this._heartbeatsCache.heartbeats.length === 0) {
      return "";
    }
    const date = getUTCDateString();
    const { heartbeatsToSend, unsentEntries } = extractHeartbeatsForHeader(this._heartbeatsCache.heartbeats);
    const headerString = base64urlEncodeWithoutPadding(JSON.stringify({ version: 2, heartbeats: heartbeatsToSend }));
    this._heartbeatsCache.lastSentHeartbeatDate = date;
    if (unsentEntries.length > 0) {
      this._heartbeatsCache.heartbeats = unsentEntries;
      await this._storage.overwrite(this._heartbeatsCache);
    } else {
      this._heartbeatsCache.heartbeats = [];
      this._storage.overwrite(this._heartbeatsCache);
    }
    return headerString;
  }
}

class HeartbeatStorageImpl {
  constructor(app) {
    this.app = app;
    this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
  }
  async runIndexedDBEnvironmentCheck() {
    if (!isIndexedDBAvailable()) {
      return false;
    } else {
      return validateIndexedDBOpenable().then(() => true).catch(() => false);
    }
  }
  async read() {
    const canUseIndexedDB = await this._canUseIndexedDBPromise;
    if (!canUseIndexedDB) {
      return { heartbeats: [] };
    } else {
      const idbHeartbeatObject = await readHeartbeatsFromIndexedDB(this.app);
      if (idbHeartbeatObject === null || idbHeartbeatObject === undefined ? undefined : idbHeartbeatObject.heartbeats) {
        return idbHeartbeatObject;
      } else {
        return { heartbeats: [] };
      }
    }
  }
  async overwrite(heartbeatsObject) {
    var _a;
    const canUseIndexedDB = await this._canUseIndexedDBPromise;
    if (!canUseIndexedDB) {
      return;
    } else {
      const existingHeartbeatsObject = await this.read();
      return writeHeartbeatsToIndexedDB(this.app, {
        lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== undefined ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
        heartbeats: heartbeatsObject.heartbeats
      });
    }
  }
  async add(heartbeatsObject) {
    var _a;
    const canUseIndexedDB = await this._canUseIndexedDBPromise;
    if (!canUseIndexedDB) {
      return;
    } else {
      const existingHeartbeatsObject = await this.read();
      return writeHeartbeatsToIndexedDB(this.app, {
        lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== undefined ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
        heartbeats: [
          ...existingHeartbeatsObject.heartbeats,
          ...heartbeatsObject.heartbeats
        ]
      });
    }
  }
}
registerCoreComponents("");

// node_modules/firebase/app/dist/esm/index.esm.js
var name2 = "firebase";
var version2 = "10.11.1";
registerVersion(name2, version2, "app");

// node_modules/@firebase/webchannel-wrapper/dist/esm/index.esm2017.js
var aa = function(a) {
  var b = typeof a;
  b = b != "object" ? b : a ? Array.isArray(a) ? "array" : b : "null";
  return b == "array" || b == "object" && typeof a.length == "number";
};
var p = function(a) {
  var b = typeof a;
  return b == "object" && a != null || b == "function";
};
var ba = function(a) {
  return Object.prototype.hasOwnProperty.call(a, ca) && a[ca] || (a[ca] = ++da);
};
var ea = function(a, b, c) {
  return a.call.apply(a.bind, arguments);
};
var fa = function(a, b, c) {
  if (!a)
    throw Error();
  if (2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var e = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(e, d);
      return a.apply(b, e);
    };
  }
  return function() {
    return a.apply(b, arguments);
  };
};
var q = function(a, b, c) {
  Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? q = ea : q = fa;
  return q.apply(null, arguments);
};
var ha = function(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var d = c.slice();
    d.push.apply(d, arguments);
    return a.apply(this, d);
  };
};
var r = function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.$ = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a;
  a.ac = function(d, e, f) {
    for (var h = Array(arguments.length - 2), n = 2;n < arguments.length; n++)
      h[n - 2] = arguments[n];
    return b.prototype[e].apply(d, h);
  };
};
var v = function() {
  this.s = this.s;
  this.o = this.o;
};
var ma = function(a) {
  const b = a.length;
  if (0 < b) {
    const c = Array(b);
    for (let d = 0;d < b; d++)
      c[d] = a[d];
    return c;
  }
  return [];
};
var na = function(a, b) {
  for (let c = 1;c < arguments.length; c++) {
    const d = arguments[c];
    if (aa(d)) {
      const e = a.length || 0, f = d.length || 0;
      a.length = e + f;
      for (let h = 0;h < f; h++)
        a[e + h] = d[h];
    } else
      a.push(d);
  }
};
var w = function(a, b) {
  this.type = a;
  this.g = this.target = b;
  this.defaultPrevented = false;
};
var x = function(a) {
  return /^[\s\xa0]*$/.test(a);
};
var pa = function() {
  var a = l.navigator;
  return a && (a = a.userAgent) ? a : "";
};
var y = function(a) {
  return pa().indexOf(a) != -1;
};
var qa = function(a) {
  qa[" "](a);
  return a;
};
var ra = function(a, b) {
  var c = sa;
  return Object.prototype.hasOwnProperty.call(c, a) ? c[a] : c[a] = b(a);
};
var ya = function() {
  var a = l.document;
  return a ? a.documentMode : undefined;
};
var A = function(a, b) {
  w.call(this, a ? a.type : "");
  this.relatedTarget = this.g = this.target = null;
  this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0;
  this.key = "";
  this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = false;
  this.state = null;
  this.pointerId = 0;
  this.pointerType = "";
  this.i = null;
  if (a) {
    var c = this.type = a.type, d = a.changedTouches && a.changedTouches.length ? a.changedTouches[0] : null;
    this.target = a.target || a.srcElement;
    this.g = b;
    if (b = a.relatedTarget) {
      if (wa) {
        a: {
          try {
            qa(b.nodeName);
            var e = true;
            break a;
          } catch (f) {
          }
          e = false;
        }
        e || (b = null);
      }
    } else
      c == "mouseover" ? b = a.fromElement : c == "mouseout" && (b = a.toElement);
    this.relatedTarget = b;
    d ? (this.clientX = d.clientX !== undefined ? d.clientX : d.pageX, this.clientY = d.clientY !== undefined ? d.clientY : d.pageY, this.screenX = d.screenX || 0, this.screenY = d.screenY || 0) : (this.clientX = a.clientX !== undefined ? a.clientX : a.pageX, this.clientY = a.clientY !== undefined ? a.clientY : a.pageY, this.screenX = a.screenX || 0, this.screenY = a.screenY || 0);
    this.button = a.button;
    this.key = a.key || "";
    this.ctrlKey = a.ctrlKey;
    this.altKey = a.altKey;
    this.shiftKey = a.shiftKey;
    this.metaKey = a.metaKey;
    this.pointerId = a.pointerId || 0;
    this.pointerType = typeof a.pointerType === "string" ? a.pointerType : Ga[a.pointerType] || "";
    this.state = a.state;
    this.i = a;
    a.defaultPrevented && A.$.h.call(this);
  }
};
var Ja = function(a, b, c, d, e) {
  this.listener = a;
  this.proxy = null;
  this.src = b;
  this.type = c;
  this.capture = !!d;
  this.la = e;
  this.key = ++Ia;
  this.fa = this.ia = false;
};
var Ma = function(a) {
  a.fa = true;
  a.listener = null;
  a.proxy = null;
  a.src = null;
  a.la = null;
};
var Na = function(a, b, c) {
  for (const d in a)
    b.call(c, a[d], d, a);
};
var Oa = function(a, b) {
  for (const c in a)
    b.call(undefined, a[c], c, a);
};
var Pa = function(a) {
  const b = {};
  for (const c in a)
    b[c] = a[c];
  return b;
};
var Ra = function(a, b) {
  let c, d;
  for (let e = 1;e < arguments.length; e++) {
    d = arguments[e];
    for (c in d)
      a[c] = d[c];
    for (let f = 0;f < Qa.length; f++)
      c = Qa[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
  }
};
var Sa = function(a) {
  this.src = a;
  this.g = {};
  this.h = 0;
};
var Ua = function(a, b) {
  var c = b.type;
  if (c in a.g) {
    var d = a.g[c], e = ka(d, b), f;
    (f = 0 <= e) && Array.prototype.splice.call(d, e, 1);
    f && (Ma(b), a.g[c].length == 0 && (delete a.g[c], a.h--));
  }
};
var Ta = function(a, b, c, d) {
  for (var e = 0;e < a.length; ++e) {
    var f = a[e];
    if (!f.fa && f.listener == b && f.capture == !!c && f.la == d)
      return e;
  }
  return -1;
};
var Ya = function(a, b, c, d, e) {
  if (d && d.once)
    return Za(a, b, c, d, e);
  if (Array.isArray(b)) {
    for (var f = 0;f < b.length; f++)
      Ya(a, b[f], c, d, e);
    return null;
  }
  c = $a(c);
  return a && a[Ha] ? a.O(b, c, p(d) ? !!d.capture : !!d, e) : ab(a, b, c, false, d, e);
};
var ab = function(a, b, c, d, e, f) {
  if (!b)
    throw Error("Invalid event type");
  var h = p(e) ? !!e.capture : !!e, n = bb(a);
  n || (a[Va] = n = new Sa(a));
  c = n.add(b, c, d, h, f);
  if (c.proxy)
    return c;
  d = cb();
  c.proxy = d;
  d.src = a;
  d.listener = c;
  if (a.addEventListener)
    oa || (e = h), e === undefined && (e = false), a.addEventListener(b.toString(), d, e);
  else if (a.attachEvent)
    a.attachEvent(db2(b.toString()), d);
  else if (a.addListener && a.removeListener)
    a.addListener(d);
  else
    throw Error("addEventListener and attachEvent are unavailable.");
  return c;
};
var cb = function() {
  function a(c) {
    return b.call(a.src, a.listener, c);
  }
  const b = eb;
  return a;
};
var Za = function(a, b, c, d, e) {
  if (Array.isArray(b)) {
    for (var f = 0;f < b.length; f++)
      Za(a, b[f], c, d, e);
    return null;
  }
  c = $a(c);
  return a && a[Ha] ? a.P(b, c, p(d) ? !!d.capture : !!d, e) : ab(a, b, c, true, d, e);
};
var fb = function(a, b, c, d, e) {
  if (Array.isArray(b))
    for (var f = 0;f < b.length; f++)
      fb(a, b[f], c, d, e);
  else
    (d = p(d) ? !!d.capture : !!d, c = $a(c), a && a[Ha]) ? (a = a.i, b = String(b).toString(), (b in a.g) && (f = a.g[b], c = Ta(f, c, d, e), -1 < c && (Ma(f[c]), Array.prototype.splice.call(f, c, 1), f.length == 0 && (delete a.g[b], a.h--)))) : a && (a = bb(a)) && (b = a.g[b.toString()], a = -1, b && (a = Ta(b, c, d, e)), (c = -1 < a ? b[a] : null) && gb(c));
};
var gb = function(a) {
  if (typeof a !== "number" && a && !a.fa) {
    var b = a.src;
    if (b && b[Ha])
      Ua(b.i, a);
    else {
      var { type: c, proxy: d } = a;
      b.removeEventListener ? b.removeEventListener(c, d, a.capture) : b.detachEvent ? b.detachEvent(db2(c), d) : b.addListener && b.removeListener && b.removeListener(d);
      (c = bb(b)) ? (Ua(c, a), c.h == 0 && (c.src = null, b[Va] = null)) : Ma(a);
    }
  }
};
var db2 = function(a) {
  return a in Wa ? Wa[a] : Wa[a] = "on" + a;
};
var eb = function(a, b) {
  if (a.fa)
    a = true;
  else {
    b = new A(b, this);
    var c = a.listener, d = a.la || a.src;
    a.ia && gb(a);
    a = c.call(d, b);
  }
  return a;
};
var bb = function(a) {
  a = a[Va];
  return a instanceof Sa ? a : null;
};
var $a = function(a) {
  if (typeof a === "function")
    return a;
  a[hb] || (a[hb] = function(b) {
    return a.handleEvent(b);
  });
  return a[hb];
};
var B = function() {
  v.call(this);
  this.i = new Sa(this);
  this.S = this;
  this.J = null;
};
var C = function(a, b) {
  var c, d = a.J;
  if (d)
    for (c = [];d; d = d.J)
      c.push(d);
  a = a.S;
  d = b.type || b;
  if (typeof b === "string")
    b = new w(b, a);
  else if (b instanceof w)
    b.target = b.target || a;
  else {
    var e = b;
    b = new w(d, a);
    Ra(b, e);
  }
  e = true;
  if (c)
    for (var f = c.length - 1;0 <= f; f--) {
      var h = b.g = c[f];
      e = ib(h, d, true, b) && e;
    }
  h = b.g = a;
  e = ib(h, d, true, b) && e;
  e = ib(h, d, false, b) && e;
  if (c)
    for (f = 0;f < c.length; f++)
      h = b.g = c[f], e = ib(h, d, false, b) && e;
};
var ib = function(a, b, c, d) {
  b = a.i.g[String(b)];
  if (!b)
    return true;
  b = b.concat();
  for (var e = true, f = 0;f < b.length; ++f) {
    var h = b[f];
    if (h && !h.fa && h.capture == c) {
      var n = h.listener, t = h.la || h.src;
      h.ia && Ua(a.i, h);
      e = n.call(t, d) !== false && e;
    }
  }
  return e && !d.defaultPrevented;
};
var lb = function() {
  var a = mb;
  let b = null;
  a.g && (b = a.g, a.g = a.g.next, a.g || (a.h = null), b.next = null);
  return b;
};
var qb = function(a) {
  var b = 1;
  a = a.split(":");
  const c = [];
  for (;0 < b && a.length; )
    c.push(a.shift()), b--;
  a.length && c.push(a.join(":"));
  return c;
};
var rb = function(a) {
  l.setTimeout(() => {
    throw a;
  }, 0);
};
var wb = function(a, b) {
  B.call(this);
  this.h = a || 1;
  this.g = b || l;
  this.j = q(this.qb, this);
  this.l = Date.now();
};
var xb = function(a) {
  a.ga = false;
  a.T && (a.g.clearTimeout(a.T), a.T = null);
};
var yb = function(a, b, c) {
  if (typeof a === "function")
    c && (a = q(a, c));
  else if (a && typeof a.handleEvent == "function")
    a = q(a.handleEvent, a);
  else
    throw Error("Invalid listener argument");
  return 2147483647 < Number(b) ? -1 : l.setTimeout(a, b || 0);
};
var zb = function(a) {
  a.g = yb(() => {
    a.g = null;
    a.i && (a.i = false, zb(a));
  }, a.j);
  const b = a.h;
  a.h = null;
  a.m.apply(null, b);
};
var Bb = function(a) {
  v.call(this);
  this.h = a;
  this.g = {};
};
var Eb = function(a, b, c, d) {
  Array.isArray(c) || (c && (Cb[0] = c.toString()), c = Cb);
  for (var e = 0;e < c.length; e++) {
    var f = Ya(b, c[e], d || a.handleEvent, false, a.h || a);
    if (!f)
      break;
    a.g[f.key] = f;
  }
};
var Fb = function(a) {
  Na(a.g, function(b, c) {
    this.g.hasOwnProperty(c) && gb(b);
  }, a);
  a.g = {};
};
var Gb = function() {
  this.g = true;
};
var Hb = function(a, b, c, d, e, f) {
  a.info(function() {
    if (a.g)
      if (f) {
        var h = "";
        for (var n = f.split("&"), t = 0;t < n.length; t++) {
          var m = n[t].split("=");
          if (1 < m.length) {
            var u = m[0];
            m = m[1];
            var L = u.split("_");
            h = 2 <= L.length && L[1] == "type" ? h + (u + "=" + m + "&") : h + (u + "=redacted&");
          }
        }
      } else
        h = null;
    else
      h = f;
    return "XMLHTTP REQ (" + d + ") [attempt " + e + "]: " + b + "\n" + c + "\n" + h;
  });
};
var Ib = function(a, b, c, d, e, f, h) {
  a.info(function() {
    return "XMLHTTP RESP (" + d + ") [ attempt " + e + "]: " + b + "\n" + c + "\n" + f + " " + h;
  });
};
var D = function(a, b, c, d) {
  a.info(function() {
    return "XMLHTTP TEXT (" + b + "): " + Jb(a, c) + (d ? " " + d : "");
  });
};
var Kb = function(a, b) {
  a.info(function() {
    return "TIMEOUT: " + b;
  });
};
var Jb = function(a, b) {
  if (!a.g)
    return b;
  if (!b)
    return null;
  try {
    var c = JSON.parse(b);
    if (c) {
      for (a = 0;a < c.length; a++)
        if (Array.isArray(c[a])) {
          var d = c[a];
          if (!(2 > d.length)) {
            var e = d[1];
            if (Array.isArray(e) && !(1 > e.length)) {
              var f = e[0];
              if (f != "noop" && f != "stop" && f != "close")
                for (var h = 1;h < e.length; h++)
                  e[h] = "";
            }
          }
        }
    }
    return jb(c);
  } catch (n) {
    return b;
  }
};
var Mb = function() {
  return Lb = Lb || new B;
};
var Nb = function(a) {
  w.call(this, E.Ta, a);
};
var Ob = function(a) {
  const b = Mb();
  C(b, new Nb(b));
};
var Pb = function(a, b) {
  w.call(this, E.STAT_EVENT, a);
  this.stat = b;
};
var F = function(a) {
  const b = Mb();
  C(b, new Pb(b, a));
};
var Qb = function(a, b) {
  w.call(this, E.Ua, a);
  this.size = b;
};
var Rb = function(a, b) {
  if (typeof a !== "function")
    throw Error("Fn must not be null and must be a function");
  return l.setTimeout(function() {
    a();
  }, b);
};
var Ub = function() {
};
var Vb = function(a) {
  return a.h || (a.h = a.i());
};
var Wb = function() {
};
var Yb = function() {
  w.call(this, "d");
};
var Zb = function() {
  w.call(this, "c");
};
var ac = function() {
};
var bc = function(a, b, c, d) {
  this.l = a;
  this.j = b;
  this.m = c;
  this.W = d || 1;
  this.U = new Bb(this);
  this.P = cc;
  a = va ? 125 : undefined;
  this.V = new wb(a);
  this.I = null;
  this.i = false;
  this.u = this.B = this.A = this.L = this.G = this.Y = this.C = null;
  this.F = [];
  this.g = null;
  this.o = 0;
  this.s = this.v = null;
  this.ca = -1;
  this.J = false;
  this.O = 0;
  this.M = null;
  this.ba = this.K = this.aa = this.S = false;
  this.h = new dc;
};
var dc = function() {
  this.i = null;
  this.g = "";
  this.h = false;
};
var gc = function(a, b, c) {
  a.L = 1;
  a.A = hc(G(b));
  a.u = c;
  a.S = true;
  ic(a, null);
};
var ic = function(a, b) {
  a.G = Date.now();
  jc(a);
  a.B = G(a.A);
  var { B: c, W: d } = a;
  Array.isArray(d) || (d = [String(d)]);
  kc(c.i, "t", d);
  a.o = 0;
  c = a.l.J;
  a.h = new dc;
  a.g = lc(a.l, c ? b : null, !a.u);
  0 < a.O && (a.M = new Ab(q(a.Pa, a, a.g), a.O));
  Eb(a.U, a.g, "readystatechange", a.nb);
  b = a.I ? Pa(a.I) : {};
  a.u ? (a.v || (a.v = "POST"), b["Content-Type"] = "application/x-www-form-urlencoded", a.g.ha(a.B, a.v, a.u, b)) : (a.v = "GET", a.g.ha(a.B, a.v, null, b));
  Ob();
  Hb(a.j, a.v, a.B, a.m, a.W, a.u);
};
var oc = function(a) {
  return a.g ? a.v == "GET" && a.L != 2 && a.l.Ha : false;
};
var rc = function(a, b, c) {
  let d = true, e;
  for (;!a.J && a.o < c.length; )
    if (e = uc(a, c), e == fc) {
      b == 4 && (a.s = 4, F(14), d = false);
      D(a.j, a.m, null, "[Incomplete Response]");
      break;
    } else if (e == ec) {
      a.s = 4;
      F(15);
      D(a.j, a.m, c, "[Invalid Chunk]");
      d = false;
      break;
    } else
      D(a.j, a.m, e, null), qc(a, e);
  oc(a) && a.o != 0 && (a.h.g = a.h.g.slice(a.o), a.o = 0);
  b != 4 || c.length != 0 || a.h.h || (a.s = 1, F(16), d = false);
  a.i = a.i && d;
  d ? 0 < c.length && !a.ba && (a.ba = true, b = a.l, b.g == a && b.ca && !b.M && (b.l.info("Great, no buffering proxy detected. Bytes received: " + c.length), vc(b), b.M = true, F(11))) : (D(a.j, a.m, c, "[Invalid Chunked Response]"), I(a), pc(a));
};
var uc = function(a, b) {
  var c = a.o, d = b.indexOf("\n", c);
  if (d == -1)
    return fc;
  c = Number(b.substring(c, d));
  if (isNaN(c))
    return ec;
  d += 1;
  if (d + c > b.length)
    return fc;
  b = b.slice(d, d + c);
  a.o = d + c;
  return b;
};
var jc = function(a) {
  a.Y = Date.now() + a.P;
  wc(a, a.P);
};
var wc = function(a, b) {
  if (a.C != null)
    throw Error("WatchDog timer not null");
  a.C = Rb(q(a.lb, a), b);
};
var nc = function(a) {
  a.C && (l.clearTimeout(a.C), a.C = null);
};
var pc = function(a) {
  a.l.H == 0 || a.J || sc(a.l, a);
};
var I = function(a) {
  nc(a);
  var b = a.M;
  b && typeof b.sa == "function" && b.sa();
  a.M = null;
  xb(a.V);
  Fb(a.U);
  a.g && (b = a.g, a.g = null, b.abort(), b.sa());
};
var qc = function(a, b) {
  try {
    var c = a.l;
    if (c.H != 0 && (c.g == a || xc(c.i, a))) {
      if (!a.K && xc(c.i, a) && c.H == 3) {
        try {
          var d = c.Ja.g.parse(b);
        } catch (m) {
          d = null;
        }
        if (Array.isArray(d) && d.length == 3) {
          var e = d;
          if (e[0] == 0)
            a: {
              if (!c.u) {
                if (c.g)
                  if (c.g.G + 3000 < a.G)
                    yc(c), zc(c);
                  else
                    break a;
                Ac(c);
                F(18);
              }
            }
          else
            c.Fa = e[1], 0 < c.Fa - c.V && 37500 > e[2] && c.G && c.A == 0 && !c.v && (c.v = Rb(q(c.ib, c), 6000));
          if (1 >= Bc(c.i) && c.oa) {
            try {
              c.oa();
            } catch (m) {
            }
            c.oa = undefined;
          }
        } else
          J(c, 11);
      } else if ((a.K || c.g == a) && yc(c), !x(b))
        for (e = c.Ja.g.parse(b), b = 0;b < e.length; b++) {
          let m = e[b];
          c.V = m[0];
          m = m[1];
          if (c.H == 2)
            if (m[0] == "c") {
              c.K = m[1];
              c.pa = m[2];
              const u = m[3];
              u != null && (c.ra = u, c.l.info("VER=" + c.ra));
              const L = m[4];
              L != null && (c.Ga = L, c.l.info("SVER=" + c.Ga));
              const Ka = m[5];
              Ka != null && typeof Ka === "number" && 0 < Ka && (d = 1.5 * Ka, c.L = d, c.l.info("backChannelRequestTimeoutMs_=" + d));
              d = c;
              const la = a.g;
              if (la) {
                const La = la.g ? la.g.getResponseHeader("X-Client-Wire-Protocol") : null;
                if (La) {
                  var f = d.i;
                  f.g || La.indexOf("spdy") == -1 && La.indexOf("quic") == -1 && La.indexOf("h2") == -1 || (f.j = f.l, f.g = new Set, f.h && (Cc(f, f.h), f.h = null));
                }
                if (d.F) {
                  const Db = la.g ? la.g.getResponseHeader("X-HTTP-Session-Id") : null;
                  Db && (d.Da = Db, K(d.I, d.F, Db));
                }
              }
              c.H = 3;
              c.h && c.h.Ba();
              c.ca && (c.S = Date.now() - a.G, c.l.info("Handshake RTT: " + c.S + "ms"));
              d = c;
              var h = a;
              d.wa = Dc(d, d.J ? d.pa : null, d.Y);
              if (h.K) {
                Ec(d.i, h);
                var n = h, t = d.L;
                t && n.setTimeout(t);
                n.C && (nc(n), jc(n));
                d.g = h;
              } else
                Fc(d);
              0 < c.j.length && Gc(c);
            } else
              m[0] != "stop" && m[0] != "close" || J(c, 7);
          else
            c.H == 3 && (m[0] == "stop" || m[0] == "close" ? m[0] == "stop" ? J(c, 7) : Hc(c) : m[0] != "noop" && c.h && c.h.Aa(m), c.A = 0);
        }
    }
    Ob(4);
  } catch (m) {
  }
};
var Ic = function(a) {
  if (a.Z && typeof a.Z == "function")
    return a.Z();
  if (typeof Map !== "undefined" && a instanceof Map || typeof Set !== "undefined" && a instanceof Set)
    return Array.from(a.values());
  if (typeof a === "string")
    return a.split("");
  if (aa(a)) {
    for (var b = [], c = a.length, d = 0;d < c; d++)
      b.push(a[d]);
    return b;
  }
  b = [];
  c = 0;
  for (d in a)
    b[c++] = a[d];
  return b;
};
var Jc = function(a) {
  if (a.ta && typeof a.ta == "function")
    return a.ta();
  if (!a.Z || typeof a.Z != "function") {
    if (typeof Map !== "undefined" && a instanceof Map)
      return Array.from(a.keys());
    if (!(typeof Set !== "undefined" && a instanceof Set)) {
      if (aa(a) || typeof a === "string") {
        var b = [];
        a = a.length;
        for (var c = 0;c < a; c++)
          b.push(c);
        return b;
      }
      b = [];
      c = 0;
      for (const d in a)
        b[c++] = d;
      return b;
    }
  }
};
var Kc = function(a, b) {
  if (a.forEach && typeof a.forEach == "function")
    a.forEach(b, undefined);
  else if (aa(a) || typeof a === "string")
    Array.prototype.forEach.call(a, b, undefined);
  else
    for (var c = Jc(a), d = Ic(a), e = d.length, f = 0;f < e; f++)
      b.call(undefined, d[f], c && c[f], a);
};
var Mc = function(a, b) {
  if (a) {
    a = a.split("&");
    for (var c = 0;c < a.length; c++) {
      var d = a[c].indexOf("="), e = null;
      if (0 <= d) {
        var f = a[c].substring(0, d);
        e = a[c].substring(d + 1);
      } else
        f = a[c];
      b(f, e ? decodeURIComponent(e.replace(/\+/g, " ")) : "");
    }
  }
};
var M = function(a) {
  this.g = this.s = this.j = "";
  this.m = null;
  this.o = this.l = "";
  this.h = false;
  if (a instanceof M) {
    this.h = a.h;
    Nc(this, a.j);
    this.s = a.s;
    this.g = a.g;
    Oc(this, a.m);
    this.l = a.l;
    var b = a.i;
    var c = new Pc;
    c.i = b.i;
    b.g && (c.g = new Map(b.g), c.h = b.h);
    Qc(this, c);
    this.o = a.o;
  } else
    a && (b = String(a).match(Lc)) ? (this.h = false, Nc(this, b[1] || "", true), this.s = Rc(b[2] || ""), this.g = Rc(b[3] || "", true), Oc(this, b[4]), this.l = Rc(b[5] || "", true), Qc(this, b[6] || "", true), this.o = Rc(b[7] || "")) : (this.h = false, this.i = new Pc(null, this.h));
};
var G = function(a) {
  return new M(a);
};
var Nc = function(a, b, c) {
  a.j = c ? Rc(b, true) : b;
  a.j && (a.j = a.j.replace(/:$/, ""));
};
var Oc = function(a, b) {
  if (b) {
    b = Number(b);
    if (isNaN(b) || 0 > b)
      throw Error("Bad port number " + b);
    a.m = b;
  } else
    a.m = null;
};
var Qc = function(a, b, c) {
  b instanceof Pc ? (a.i = b, Xc(a.i, a.h)) : (c || (b = Sc(b, Yc)), a.i = new Pc(b, a.h));
};
var K = function(a, b, c) {
  a.i.set(b, c);
};
var hc = function(a) {
  K(a, "zx", Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ Date.now()).toString(36));
  return a;
};
var Rc = function(a, b) {
  return a ? b ? decodeURI(a.replace(/%25/g, "%2525")) : decodeURIComponent(a) : "";
};
var Sc = function(a, b, c) {
  return typeof a === "string" ? (a = encodeURI(a).replace(b, Zc), c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), a) : null;
};
var Zc = function(a) {
  a = a.charCodeAt(0);
  return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16);
};
var Pc = function(a, b) {
  this.h = this.g = null;
  this.i = a || null;
  this.j = !!b;
};
var N = function(a) {
  a.g || (a.g = new Map, a.h = 0, a.i && Mc(a.i, function(b, c) {
    a.add(decodeURIComponent(b.replace(/\+/g, " ")), c);
  }));
};
var $c = function(a, b) {
  N(a);
  b = O(a, b);
  a.g.has(b) && (a.i = null, a.h -= a.g.get(b).length, a.g.delete(b));
};
var ad = function(a, b) {
  N(a);
  b = O(a, b);
  return a.g.has(b);
};
var kc = function(a, b, c) {
  $c(a, b);
  0 < c.length && (a.i = null, a.g.set(O(a, b), ma(c)), a.h += c.length);
};
var O = function(a, b) {
  b = String(b);
  a.j && (b = b.toLowerCase());
  return b;
};
var Xc = function(a, b) {
  b && !a.j && (N(a), a.i = null, a.g.forEach(function(c, d) {
    var e = d.toLowerCase();
    d != e && ($c(this, d), kc(this, e, c));
  }, a));
  a.j = b;
};
var cd = function(a) {
  this.l = a || dd;
  l.PerformanceNavigationTiming ? (a = l.performance.getEntriesByType("navigation"), a = 0 < a.length && (a[0].nextHopProtocol == "hq" || a[0].nextHopProtocol == "h2")) : a = !!(l.g && l.g.Ka && l.g.Ka() && l.g.Ka().dc);
  this.j = a ? this.l : 1;
  this.g = null;
  1 < this.j && (this.g = new Set);
  this.h = null;
  this.i = [];
};
var ed = function(a) {
  return a.h ? true : a.g ? a.g.size >= a.j : false;
};
var Bc = function(a) {
  return a.h ? 1 : a.g ? a.g.size : 0;
};
var xc = function(a, b) {
  return a.h ? a.h == b : a.g ? a.g.has(b) : false;
};
var Cc = function(a, b) {
  a.g ? a.g.add(b) : a.h = b;
};
var Ec = function(a, b) {
  a.h && a.h == b ? a.h = null : a.g && a.g.has(b) && a.g.delete(b);
};
var fd = function(a) {
  if (a.h != null)
    return a.i.concat(a.h.F);
  if (a.g != null && a.g.size !== 0) {
    let b = a.i;
    for (const c of a.g.values())
      b = b.concat(c.F);
    return b;
  }
  return ma(a.i);
};
var hd = function() {
  this.g = new gd;
};
var id = function(a, b, c) {
  const d = c || "";
  try {
    Kc(a, function(e, f) {
      let h = e;
      p(e) && (h = jb(e));
      b.push(d + f + "=" + encodeURIComponent(h));
    });
  } catch (e) {
    throw b.push(d + "type=" + encodeURIComponent("_badmap")), e;
  }
};
var jd = function(a, b) {
  const c = new Gb;
  if (l.Image) {
    const d = new Image;
    d.onload = ha(kd, c, d, "TestLoadImage: loaded", true, b);
    d.onerror = ha(kd, c, d, "TestLoadImage: error", false, b);
    d.onabort = ha(kd, c, d, "TestLoadImage: abort", false, b);
    d.ontimeout = ha(kd, c, d, "TestLoadImage: timeout", false, b);
    l.setTimeout(function() {
      if (d.ontimeout)
        d.ontimeout();
    }, 1e4);
    d.src = a;
  } else
    b(false);
};
var kd = function(a, b, c, d, e) {
  try {
    b.onload = null, b.onerror = null, b.onabort = null, b.ontimeout = null, e(d);
  } catch (f) {
  }
};
var ld = function(a) {
  this.l = a.ec || null;
  this.j = a.ob || false;
};
var md = function(a, b) {
  B.call(this);
  this.F = a;
  this.u = b;
  this.m = undefined;
  this.readyState = nd;
  this.status = 0;
  this.responseType = this.responseText = this.response = this.statusText = "";
  this.onreadystatechange = null;
  this.v = new Headers;
  this.h = null;
  this.C = "GET";
  this.B = "";
  this.g = false;
  this.A = this.j = this.l = null;
};
var qd = function(a) {
  a.j.read().then(a.Xa.bind(a)).catch(a.ka.bind(a));
};
var pd = function(a) {
  a.readyState = 4;
  a.l = null;
  a.j = null;
  a.A = null;
  od(a);
};
var od = function(a) {
  a.onreadystatechange && a.onreadystatechange.call(a);
};
var P = function(a) {
  B.call(this);
  this.headers = new Map;
  this.u = a || null;
  this.h = false;
  this.C = this.g = null;
  this.I = "";
  this.m = 0;
  this.j = "";
  this.l = this.G = this.v = this.F = false;
  this.B = 0;
  this.A = null;
  this.K = sd;
  this.L = this.M = false;
};
var xd = function(a) {
  return z && typeof a.timeout === "number" && a.ontimeout !== undefined;
};
var vd = function(a, b) {
  a.h = false;
  a.g && (a.l = true, a.g.abort(), a.l = false);
  a.j = b;
  a.m = 5;
  yd(a);
  zd(a);
};
var yd = function(a) {
  a.F || (a.F = true, C(a, "complete"), C(a, "error"));
};
var Ad = function(a) {
  if (a.h && typeof goog != "undefined" && (!a.C[1] || H(a) != 4 || a.da() != 2)) {
    if (a.v && H(a) == 4)
      yb(a.La, 0, a);
    else if (C(a, "readystatechange"), H(a) == 4) {
      a.h = false;
      try {
        const h = a.da();
        a:
          switch (h) {
            case 200:
            case 201:
            case 202:
            case 204:
            case 206:
            case 304:
            case 1223:
              var b = true;
              break a;
            default:
              b = false;
          }
        var c;
        if (!(c = b)) {
          var d;
          if (d = h === 0) {
            var e = String(a.I).match(Lc)[1] || null;
            !e && l.self && l.self.location && (e = l.self.location.protocol.slice(0, -1));
            d = !td.test(e ? e.toLowerCase() : "");
          }
          c = d;
        }
        if (c)
          C(a, "complete"), C(a, "success");
        else {
          a.m = 6;
          try {
            var f = 2 < H(a) ? a.g.statusText : "";
          } catch (n) {
            f = "";
          }
          a.j = f + " [" + a.da() + "]";
          yd(a);
        }
      } finally {
        zd(a);
      }
    }
  }
};
var zd = function(a, b) {
  if (a.g) {
    wd(a);
    const c = a.g, d = a.C[0] ? () => {
    } : null;
    a.g = null;
    a.C = null;
    b || C(a, "ready");
    try {
      c.onreadystatechange = d;
    } catch (e) {
    }
  }
};
var wd = function(a) {
  a.g && a.L && (a.g.ontimeout = null);
  a.A && (l.clearTimeout(a.A), a.A = null);
};
var H = function(a) {
  return a.g ? a.g.readyState : 0;
};
var mc = function(a) {
  try {
    if (!a.g)
      return null;
    if ("response" in a.g)
      return a.g.response;
    switch (a.K) {
      case sd:
      case "text":
        return a.g.responseText;
      case "arraybuffer":
        if ("mozResponseArrayBuffer" in a.g)
          return a.g.mozResponseArrayBuffer;
    }
    return null;
  } catch (b) {
    return null;
  }
};
var tc = function(a) {
  const b = {};
  a = (a.g && 2 <= H(a) ? a.g.getAllResponseHeaders() || "" : "").split("\r\n");
  for (let d = 0;d < a.length; d++) {
    if (x(a[d]))
      continue;
    var c = qb(a[d]);
    const e = c[0];
    c = c[1];
    if (typeof c !== "string")
      continue;
    c = c.trim();
    const f = b[e] || [];
    b[e] = f;
    f.push(c);
  }
  Oa(b, function(d) {
    return d.join(", ");
  });
};
var Bd = function(a) {
  let b = "";
  Na(a, function(c, d) {
    b += d;
    b += ":";
    b += c;
    b += "\r\n";
  });
  return b;
};
var Cd = function(a, b, c) {
  a: {
    for (d in c) {
      var d = false;
      break a;
    }
    d = true;
  }
  d || (c = Bd(c), typeof a === "string" ? c != null && encodeURIComponent(String(c)) : K(a, b, c));
};
var Dd = function(a, b, c) {
  return c && c.internalChannelParams ? c.internalChannelParams[a] || b : b;
};
var Ed = function(a) {
  this.Ga = 0;
  this.j = [];
  this.l = new Gb;
  this.pa = this.wa = this.I = this.Y = this.g = this.Da = this.F = this.na = this.o = this.U = this.s = null;
  this.fb = this.W = 0;
  this.cb = Dd("failFast", false, a);
  this.G = this.v = this.u = this.m = this.h = null;
  this.aa = true;
  this.Fa = this.V = -1;
  this.ba = this.A = this.C = 0;
  this.ab = Dd("baseRetryDelayMs", 5000, a);
  this.hb = Dd("retryDelaySeedMs", 1e4, a);
  this.eb = Dd("forwardChannelMaxRetries", 2, a);
  this.xa = Dd("forwardChannelRequestTimeoutMs", 20000, a);
  this.va = a && a.xmlHttpFactory || undefined;
  this.Ha = a && a.useFetchStreams || false;
  this.L = undefined;
  this.J = a && a.supportsCrossDomainXhr || false;
  this.K = "";
  this.i = new cd(a && a.concurrentRequestLimit);
  this.Ja = new hd;
  this.P = a && a.fastHandshake || false;
  this.O = a && a.encodeInitMessageHeaders || false;
  this.P && this.O && (this.O = false);
  this.bb = a && a.bc || false;
  a && a.Ea && this.l.Ea();
  a && a.forceLongPolling && (this.aa = false);
  this.ca = !this.P && this.aa && a && a.detectBufferingProxy || false;
  this.qa = undefined;
  a && a.longPollingTimeout && 0 < a.longPollingTimeout && (this.qa = a.longPollingTimeout);
  this.oa = undefined;
  this.S = 0;
  this.M = false;
  this.ma = this.B = null;
};
var Hc = function(a) {
  Fd(a);
  if (a.H == 3) {
    var b = a.W++, c = G(a.I);
    K(c, "SID", a.K);
    K(c, "RID", b);
    K(c, "TYPE", "terminate");
    Gd(a, c);
    b = new bc(a, a.l, b);
    b.L = 2;
    b.A = hc(G(c));
    c = false;
    if (l.navigator && l.navigator.sendBeacon)
      try {
        c = l.navigator.sendBeacon(b.A.toString(), "");
      } catch (d) {
      }
    !c && l.Image && (new Image().src = b.A, c = true);
    c || (b.g = lc(b.l, null), b.g.ha(b.A));
    b.G = Date.now();
    jc(b);
  }
  Hd(a);
};
var zc = function(a) {
  a.g && (vc(a), a.g.cancel(), a.g = null);
};
var Fd = function(a) {
  zc(a);
  a.u && (l.clearTimeout(a.u), a.u = null);
  yc(a);
  a.i.cancel();
  a.m && (typeof a.m === "number" && l.clearTimeout(a.m), a.m = null);
};
var Gc = function(a) {
  if (!ed(a.i) && !a.m) {
    a.m = true;
    var b = a.Na;
    sb || vb();
    tb || (sb(), tb = true);
    mb.add(b, a);
    a.C = 0;
  }
};
var Id = function(a, b) {
  if (Bc(a.i) >= a.i.j - (a.m ? 1 : 0))
    return false;
  if (a.m)
    return a.j = b.F.concat(a.j), true;
  if (a.H == 1 || a.H == 2 || a.C >= (a.cb ? 0 : a.eb))
    return false;
  a.m = Rb(q(a.Na, a, b), Jd(a, a.C));
  a.C++;
  return true;
};
var Ld = function(a, b) {
  var c;
  b ? c = b.m : c = a.W++;
  const d = G(a.I);
  K(d, "SID", a.K);
  K(d, "RID", c);
  K(d, "AID", a.V);
  Gd(a, d);
  a.o && a.s && Cd(d, a.o, a.s);
  c = new bc(a, a.l, c, a.C + 1);
  a.o === null && (c.I = a.s);
  b && (a.j = b.F.concat(a.j));
  b = Kd(a, c, 1000);
  c.setTimeout(Math.round(0.5 * a.xa) + Math.round(0.5 * a.xa * Math.random()));
  Cc(a.i, c);
  gc(c, d, b);
};
var Gd = function(a, b) {
  a.na && Na(a.na, function(c, d) {
    K(b, d, c);
  });
  a.h && Kc({}, function(c, d) {
    K(b, d, c);
  });
};
var Kd = function(a, b, c) {
  c = Math.min(a.j.length, c);
  var d = a.h ? q(a.h.Va, a.h, a) : null;
  a: {
    var e = a.j;
    let f = -1;
    for (;; ) {
      const h = ["count=" + c];
      f == -1 ? 0 < c ? (f = e[0].g, h.push("ofs=" + f)) : f = 0 : h.push("ofs=" + f);
      let n = true;
      for (let t = 0;t < c; t++) {
        let m = e[t].g;
        const u = e[t].map;
        m -= f;
        if (0 > m)
          f = Math.max(0, e[t].g - 100), n = false;
        else
          try {
            id(u, h, "req" + m + "_");
          } catch (L) {
            d && d(u);
          }
      }
      if (n) {
        d = h.join("&");
        break a;
      }
    }
  }
  a = a.j.splice(0, c);
  b.F = a;
  return d;
};
var Fc = function(a) {
  if (!a.g && !a.u) {
    a.ba = 1;
    var b = a.Ma;
    sb || vb();
    tb || (sb(), tb = true);
    mb.add(b, a);
    a.A = 0;
  }
};
var Ac = function(a) {
  if (a.g || a.u || 3 <= a.A)
    return false;
  a.ba++;
  a.u = Rb(q(a.Ma, a), Jd(a, a.A));
  a.A++;
  return true;
};
var vc = function(a) {
  a.B != null && (l.clearTimeout(a.B), a.B = null);
};
var Md = function(a) {
  a.g = new bc(a, a.l, "rpc", a.ba);
  a.o === null && (a.g.I = a.s);
  a.g.O = 0;
  var b = G(a.wa);
  K(b, "RID", "rpc");
  K(b, "SID", a.K);
  K(b, "AID", a.V);
  K(b, "CI", a.G ? "0" : "1");
  !a.G && a.qa && K(b, "TO", a.qa);
  K(b, "TYPE", "xmlhttp");
  Gd(a, b);
  a.o && a.s && Cd(b, a.o, a.s);
  a.L && a.g.setTimeout(a.L);
  var c = a.g;
  a = a.pa;
  c.L = 1;
  c.A = hc(G(b));
  c.u = null;
  c.S = true;
  ic(c, a);
};
var yc = function(a) {
  a.v != null && (l.clearTimeout(a.v), a.v = null);
};
var sc = function(a, b) {
  var c = null;
  if (a.g == b) {
    yc(a);
    vc(a);
    a.g = null;
    var d = 2;
  } else if (xc(a.i, b))
    c = b.F, Ec(a.i, b), d = 1;
  else
    return;
  if (a.H != 0) {
    if (b.i)
      if (d == 1) {
        c = b.u ? b.u.length : 0;
        b = Date.now() - b.G;
        var e = a.C;
        d = Mb();
        C(d, new Qb(d, c));
        Gc(a);
      } else
        Fc(a);
    else if (e = b.s, e == 3 || e == 0 && 0 < b.ca || !(d == 1 && Id(a, b) || d == 2 && Ac(a)))
      switch (c && 0 < c.length && (b = a.i, b.i = b.i.concat(c)), e) {
        case 1:
          J(a, 5);
          break;
        case 4:
          J(a, 10);
          break;
        case 3:
          J(a, 6);
          break;
        default:
          J(a, 2);
      }
  }
};
var Jd = function(a, b) {
  let c = a.ab + Math.floor(Math.random() * a.hb);
  a.isActive() || (c *= 2);
  return c * b;
};
var J = function(a, b) {
  a.l.info("Error code " + b);
  if (b == 2) {
    var c = null;
    a.h && (c = null);
    var d = q(a.pb, a);
    c || (c = new M("//www.google.com/images/cleardot.gif"), l.location && l.location.protocol == "http" || Nc(c, "https"), hc(c));
    jd(c.toString(), d);
  } else
    F(2);
  a.H = 0;
  a.h && a.h.za(b);
  Hd(a);
  Fd(a);
};
var Hd = function(a) {
  a.H = 0;
  a.ma = [];
  if (a.h) {
    const b = fd(a.i);
    if (b.length != 0 || a.j.length != 0)
      na(a.ma, b), na(a.ma, a.j), a.i.i.length = 0, ma(a.j), a.j.length = 0;
    a.h.ya();
  }
};
var Dc = function(a, b, c) {
  var d = c instanceof M ? G(c) : new M(c);
  if (d.g != "")
    b && (d.g = b + "." + d.g), Oc(d, d.m);
  else {
    var e = l.location;
    d = e.protocol;
    b = b ? b + "." + e.hostname : e.hostname;
    e = +e.port;
    var f = new M(null);
    d && Nc(f, d);
    b && (f.g = b);
    e && Oc(f, e);
    c && (f.l = c);
    d = f;
  }
  c = a.F;
  b = a.Da;
  c && b && K(d, c, b);
  K(d, "VER", a.ra);
  Gd(a, d);
  return d;
};
var lc = function(a, b, c) {
  if (b && !a.J)
    throw Error("Can't create secondary domain capable XhrIo object.");
  b = a.Ha && !a.va ? new P(new ld({ ob: c })) : new P(a.va);
  b.Oa(a.J);
  return b;
};
var Nd = function() {
};
var Od = function() {
  if (z && !(10 <= Number(Fa)))
    throw Error("Environmental error: no available transport.");
};
var Q = function(a, b) {
  B.call(this);
  this.g = new Ed(b);
  this.l = a;
  this.h = b && b.messageUrlParams || null;
  a = b && b.messageHeaders || null;
  b && b.clientProtocolHeaderRequired && (a ? a["X-Client-Protocol"] = "webchannel" : a = { "X-Client-Protocol": "webchannel" });
  this.g.s = a;
  a = b && b.initMessageHeaders || null;
  b && b.messageContentType && (a ? a["X-WebChannel-Content-Type"] = b.messageContentType : a = { "X-WebChannel-Content-Type": b.messageContentType });
  b && b.Ca && (a ? a["X-WebChannel-Client-Profile"] = b.Ca : a = { "X-WebChannel-Client-Profile": b.Ca });
  this.g.U = a;
  (a = b && b.cc) && !x(a) && (this.g.o = a);
  this.A = b && b.supportsCrossDomainXhr || false;
  this.v = b && b.sendRawJson || false;
  (b = b && b.httpSessionIdParam) && !x(b) && (this.g.F = b, a = this.h, a !== null && (b in a) && (a = this.h, (b in a) && delete a[b]));
  this.j = new R(this);
};
var Pd = function(a) {
  Yb.call(this);
  a.__headers__ && (this.headers = a.__headers__, this.statusCode = a.__status__, delete a.__headers__, delete a.__status__);
  var b = a.__sm__;
  if (b) {
    a: {
      for (const c in b) {
        a = c;
        break a;
      }
      a = undefined;
    }
    if (this.i = a)
      a = this.i, b = b !== null && a in b ? b[a] : undefined;
    this.data = b;
  } else
    this.data = a;
};
var Qd = function() {
  Zb.call(this);
  this.status = 1;
};
var R = function(a) {
  this.g = a;
};
var Rd = function() {
  this.blockSize = -1;
};
var S = function() {
  this.blockSize = -1;
  this.blockSize = 64;
  this.g = Array(4);
  this.m = Array(this.blockSize);
  this.i = this.h = 0;
  this.reset();
};
var Sd = function(a, b, c) {
  c || (c = 0);
  var d = Array(16);
  if (typeof b === "string")
    for (var e = 0;16 > e; ++e)
      d[e] = b.charCodeAt(c++) | b.charCodeAt(c++) << 8 | b.charCodeAt(c++) << 16 | b.charCodeAt(c++) << 24;
  else
    for (e = 0;16 > e; ++e)
      d[e] = b[c++] | b[c++] << 8 | b[c++] << 16 | b[c++] << 24;
  b = a.g[0];
  c = a.g[1];
  e = a.g[2];
  var f = a.g[3];
  var h = b + (f ^ c & (e ^ f)) + d[0] + 3614090360 & 4294967295;
  b = c + (h << 7 & 4294967295 | h >>> 25);
  h = f + (e ^ b & (c ^ e)) + d[1] + 3905402710 & 4294967295;
  f = b + (h << 12 & 4294967295 | h >>> 20);
  h = e + (c ^ f & (b ^ c)) + d[2] + 606105819 & 4294967295;
  e = f + (h << 17 & 4294967295 | h >>> 15);
  h = c + (b ^ e & (f ^ b)) + d[3] + 3250441966 & 4294967295;
  c = e + (h << 22 & 4294967295 | h >>> 10);
  h = b + (f ^ c & (e ^ f)) + d[4] + 4118548399 & 4294967295;
  b = c + (h << 7 & 4294967295 | h >>> 25);
  h = f + (e ^ b & (c ^ e)) + d[5] + 1200080426 & 4294967295;
  f = b + (h << 12 & 4294967295 | h >>> 20);
  h = e + (c ^ f & (b ^ c)) + d[6] + 2821735955 & 4294967295;
  e = f + (h << 17 & 4294967295 | h >>> 15);
  h = c + (b ^ e & (f ^ b)) + d[7] + 4249261313 & 4294967295;
  c = e + (h << 22 & 4294967295 | h >>> 10);
  h = b + (f ^ c & (e ^ f)) + d[8] + 1770035416 & 4294967295;
  b = c + (h << 7 & 4294967295 | h >>> 25);
  h = f + (e ^ b & (c ^ e)) + d[9] + 2336552879 & 4294967295;
  f = b + (h << 12 & 4294967295 | h >>> 20);
  h = e + (c ^ f & (b ^ c)) + d[10] + 4294925233 & 4294967295;
  e = f + (h << 17 & 4294967295 | h >>> 15);
  h = c + (b ^ e & (f ^ b)) + d[11] + 2304563134 & 4294967295;
  c = e + (h << 22 & 4294967295 | h >>> 10);
  h = b + (f ^ c & (e ^ f)) + d[12] + 1804603682 & 4294967295;
  b = c + (h << 7 & 4294967295 | h >>> 25);
  h = f + (e ^ b & (c ^ e)) + d[13] + 4254626195 & 4294967295;
  f = b + (h << 12 & 4294967295 | h >>> 20);
  h = e + (c ^ f & (b ^ c)) + d[14] + 2792965006 & 4294967295;
  e = f + (h << 17 & 4294967295 | h >>> 15);
  h = c + (b ^ e & (f ^ b)) + d[15] + 1236535329 & 4294967295;
  c = e + (h << 22 & 4294967295 | h >>> 10);
  h = b + (e ^ f & (c ^ e)) + d[1] + 4129170786 & 4294967295;
  b = c + (h << 5 & 4294967295 | h >>> 27);
  h = f + (c ^ e & (b ^ c)) + d[6] + 3225465664 & 4294967295;
  f = b + (h << 9 & 4294967295 | h >>> 23);
  h = e + (b ^ c & (f ^ b)) + d[11] + 643717713 & 4294967295;
  e = f + (h << 14 & 4294967295 | h >>> 18);
  h = c + (f ^ b & (e ^ f)) + d[0] + 3921069994 & 4294967295;
  c = e + (h << 20 & 4294967295 | h >>> 12);
  h = b + (e ^ f & (c ^ e)) + d[5] + 3593408605 & 4294967295;
  b = c + (h << 5 & 4294967295 | h >>> 27);
  h = f + (c ^ e & (b ^ c)) + d[10] + 38016083 & 4294967295;
  f = b + (h << 9 & 4294967295 | h >>> 23);
  h = e + (b ^ c & (f ^ b)) + d[15] + 3634488961 & 4294967295;
  e = f + (h << 14 & 4294967295 | h >>> 18);
  h = c + (f ^ b & (e ^ f)) + d[4] + 3889429448 & 4294967295;
  c = e + (h << 20 & 4294967295 | h >>> 12);
  h = b + (e ^ f & (c ^ e)) + d[9] + 568446438 & 4294967295;
  b = c + (h << 5 & 4294967295 | h >>> 27);
  h = f + (c ^ e & (b ^ c)) + d[14] + 3275163606 & 4294967295;
  f = b + (h << 9 & 4294967295 | h >>> 23);
  h = e + (b ^ c & (f ^ b)) + d[3] + 4107603335 & 4294967295;
  e = f + (h << 14 & 4294967295 | h >>> 18);
  h = c + (f ^ b & (e ^ f)) + d[8] + 1163531501 & 4294967295;
  c = e + (h << 20 & 4294967295 | h >>> 12);
  h = b + (e ^ f & (c ^ e)) + d[13] + 2850285829 & 4294967295;
  b = c + (h << 5 & 4294967295 | h >>> 27);
  h = f + (c ^ e & (b ^ c)) + d[2] + 4243563512 & 4294967295;
  f = b + (h << 9 & 4294967295 | h >>> 23);
  h = e + (b ^ c & (f ^ b)) + d[7] + 1735328473 & 4294967295;
  e = f + (h << 14 & 4294967295 | h >>> 18);
  h = c + (f ^ b & (e ^ f)) + d[12] + 2368359562 & 4294967295;
  c = e + (h << 20 & 4294967295 | h >>> 12);
  h = b + (c ^ e ^ f) + d[5] + 4294588738 & 4294967295;
  b = c + (h << 4 & 4294967295 | h >>> 28);
  h = f + (b ^ c ^ e) + d[8] + 2272392833 & 4294967295;
  f = b + (h << 11 & 4294967295 | h >>> 21);
  h = e + (f ^ b ^ c) + d[11] + 1839030562 & 4294967295;
  e = f + (h << 16 & 4294967295 | h >>> 16);
  h = c + (e ^ f ^ b) + d[14] + 4259657740 & 4294967295;
  c = e + (h << 23 & 4294967295 | h >>> 9);
  h = b + (c ^ e ^ f) + d[1] + 2763975236 & 4294967295;
  b = c + (h << 4 & 4294967295 | h >>> 28);
  h = f + (b ^ c ^ e) + d[4] + 1272893353 & 4294967295;
  f = b + (h << 11 & 4294967295 | h >>> 21);
  h = e + (f ^ b ^ c) + d[7] + 4139469664 & 4294967295;
  e = f + (h << 16 & 4294967295 | h >>> 16);
  h = c + (e ^ f ^ b) + d[10] + 3200236656 & 4294967295;
  c = e + (h << 23 & 4294967295 | h >>> 9);
  h = b + (c ^ e ^ f) + d[13] + 681279174 & 4294967295;
  b = c + (h << 4 & 4294967295 | h >>> 28);
  h = f + (b ^ c ^ e) + d[0] + 3936430074 & 4294967295;
  f = b + (h << 11 & 4294967295 | h >>> 21);
  h = e + (f ^ b ^ c) + d[3] + 3572445317 & 4294967295;
  e = f + (h << 16 & 4294967295 | h >>> 16);
  h = c + (e ^ f ^ b) + d[6] + 76029189 & 4294967295;
  c = e + (h << 23 & 4294967295 | h >>> 9);
  h = b + (c ^ e ^ f) + d[9] + 3654602809 & 4294967295;
  b = c + (h << 4 & 4294967295 | h >>> 28);
  h = f + (b ^ c ^ e) + d[12] + 3873151461 & 4294967295;
  f = b + (h << 11 & 4294967295 | h >>> 21);
  h = e + (f ^ b ^ c) + d[15] + 530742520 & 4294967295;
  e = f + (h << 16 & 4294967295 | h >>> 16);
  h = c + (e ^ f ^ b) + d[2] + 3299628645 & 4294967295;
  c = e + (h << 23 & 4294967295 | h >>> 9);
  h = b + (e ^ (c | ~f)) + d[0] + 4096336452 & 4294967295;
  b = c + (h << 6 & 4294967295 | h >>> 26);
  h = f + (c ^ (b | ~e)) + d[7] + 1126891415 & 4294967295;
  f = b + (h << 10 & 4294967295 | h >>> 22);
  h = e + (b ^ (f | ~c)) + d[14] + 2878612391 & 4294967295;
  e = f + (h << 15 & 4294967295 | h >>> 17);
  h = c + (f ^ (e | ~b)) + d[5] + 4237533241 & 4294967295;
  c = e + (h << 21 & 4294967295 | h >>> 11);
  h = b + (e ^ (c | ~f)) + d[12] + 1700485571 & 4294967295;
  b = c + (h << 6 & 4294967295 | h >>> 26);
  h = f + (c ^ (b | ~e)) + d[3] + 2399980690 & 4294967295;
  f = b + (h << 10 & 4294967295 | h >>> 22);
  h = e + (b ^ (f | ~c)) + d[10] + 4293915773 & 4294967295;
  e = f + (h << 15 & 4294967295 | h >>> 17);
  h = c + (f ^ (e | ~b)) + d[1] + 2240044497 & 4294967295;
  c = e + (h << 21 & 4294967295 | h >>> 11);
  h = b + (e ^ (c | ~f)) + d[8] + 1873313359 & 4294967295;
  b = c + (h << 6 & 4294967295 | h >>> 26);
  h = f + (c ^ (b | ~e)) + d[15] + 4264355552 & 4294967295;
  f = b + (h << 10 & 4294967295 | h >>> 22);
  h = e + (b ^ (f | ~c)) + d[6] + 2734768916 & 4294967295;
  e = f + (h << 15 & 4294967295 | h >>> 17);
  h = c + (f ^ (e | ~b)) + d[13] + 1309151649 & 4294967295;
  c = e + (h << 21 & 4294967295 | h >>> 11);
  h = b + (e ^ (c | ~f)) + d[4] + 4149444226 & 4294967295;
  b = c + (h << 6 & 4294967295 | h >>> 26);
  h = f + (c ^ (b | ~e)) + d[11] + 3174756917 & 4294967295;
  f = b + (h << 10 & 4294967295 | h >>> 22);
  h = e + (b ^ (f | ~c)) + d[2] + 718787259 & 4294967295;
  e = f + (h << 15 & 4294967295 | h >>> 17);
  h = c + (f ^ (e | ~b)) + d[9] + 3951481745 & 4294967295;
  a.g[0] = a.g[0] + b & 4294967295;
  a.g[1] = a.g[1] + (e + (h << 21 & 4294967295 | h >>> 11)) & 4294967295;
  a.g[2] = a.g[2] + e & 4294967295;
  a.g[3] = a.g[3] + f & 4294967295;
};
var T = function(a, b) {
  this.h = b;
  for (var c = [], d = true, e = a.length - 1;0 <= e; e--) {
    var f = a[e] | 0;
    d && f == b || (c[e] = f, d = false);
  }
  this.g = c;
};
var Td = function(a) {
  return -128 <= a && 128 > a ? ra(a, function(b) {
    return new T([b | 0], 0 > b ? -1 : 0);
  }) : new T([a | 0], 0 > a ? -1 : 0);
};
var U = function(a) {
  if (isNaN(a) || !isFinite(a))
    return V;
  if (0 > a)
    return W(U(-a));
  for (var b = [], c = 1, d = 0;a >= c; d++)
    b[d] = a / c | 0, c *= Ud;
  return new T(b, 0);
};
var Vd = function(a, b) {
  if (a.length == 0)
    throw Error("number format error: empty string");
  b = b || 10;
  if (2 > b || 36 < b)
    throw Error("radix out of range: " + b);
  if (a.charAt(0) == "-")
    return W(Vd(a.substring(1), b));
  if (0 <= a.indexOf("-"))
    throw Error('number format error: interior "-" character');
  for (var c = U(Math.pow(b, 8)), d = V, e = 0;e < a.length; e += 8) {
    var f = Math.min(8, a.length - e), h = parseInt(a.substring(e, e + f), b);
    8 > f ? (f = U(Math.pow(b, f)), d = d.R(f).add(U(h))) : (d = d.R(c), d = d.add(U(h)));
  }
  return d;
};
var Y = function(a) {
  if (a.h != 0)
    return false;
  for (var b = 0;b < a.g.length; b++)
    if (a.g[b] != 0)
      return false;
  return true;
};
var X = function(a) {
  return a.h == -1;
};
var W = function(a) {
  for (var b = a.g.length, c = [], d = 0;d < b; d++)
    c[d] = ~a.g[d];
  return new T(c, ~a.h).add(Wd);
};
var Zd = function(a, b) {
  return a.add(W(b));
};
var $d = function(a, b) {
  for (;(a[b] & 65535) != a[b]; )
    a[b + 1] += a[b] >>> 16, a[b] &= 65535, b++;
};
var ae = function(a, b) {
  this.g = a;
  this.h = b;
};
var Yd = function(a, b) {
  if (Y(b))
    throw Error("division by zero");
  if (Y(a))
    return new ae(V, V);
  if (X(a))
    return b = Yd(W(a), b), new ae(W(b.g), W(b.h));
  if (X(b))
    return b = Yd(a, W(b)), new ae(W(b.g), b.h);
  if (30 < a.g.length) {
    if (X(a) || X(b))
      throw Error("slowDivide_ only works with positive integers.");
    for (var c = Wd, d = b;0 >= d.X(a); )
      c = be(c), d = be(d);
    var e = Z(c, 1), f = Z(d, 1);
    d = Z(d, 2);
    for (c = Z(c, 2);!Y(d); ) {
      var h = f.add(d);
      0 >= h.X(a) && (e = e.add(c), f = h);
      d = Z(d, 1);
      c = Z(c, 1);
    }
    b = Zd(a, e.R(b));
    return new ae(e, b);
  }
  for (e = V;0 <= a.X(b); ) {
    c = Math.max(1, Math.floor(a.ea() / b.ea()));
    d = Math.ceil(Math.log(c) / Math.LN2);
    d = 48 >= d ? 1 : Math.pow(2, d - 48);
    f = U(c);
    for (h = f.R(b);X(h) || 0 < h.X(a); )
      c -= d, f = U(c), h = f.R(b);
    Y(f) && (f = Wd);
    e = e.add(f);
    a = Zd(a, h);
  }
  return new ae(e, a);
};
var be = function(a) {
  for (var b = a.g.length + 1, c = [], d = 0;d < b; d++)
    c[d] = a.D(d) << 1 | a.D(d - 1) >>> 31;
  return new T(c, a.h);
};
var Z = function(a, b) {
  var c = b >> 5;
  b %= 32;
  for (var d = a.g.length - c, e = [], f = 0;f < d; f++)
    e[f] = 0 < b ? a.D(f + c) >>> b | a.D(f + c + 1) << 32 - b : a.D(f + c);
  return new T(e, a.h);
};
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var esm = {};
var k;
var goog = goog || {};
var l = commonjsGlobal || self;
var ca = "closure_uid_" + (1e9 * Math.random() >>> 0);
var da = 0;
var ia = 0;
v.prototype.s = false;
v.prototype.sa = function() {
  if (!this.s && (this.s = true, this.N(), ia != 0)) {
    ba(this);
  }
};
v.prototype.N = function() {
  if (this.o)
    for (;this.o.length; )
      this.o.shift()();
};
var ka = Array.prototype.indexOf ? function(a, b) {
  return Array.prototype.indexOf.call(a, b, undefined);
} : function(a, b) {
  if (typeof a === "string")
    return typeof b !== "string" || b.length != 1 ? -1 : a.indexOf(b, 0);
  for (let c = 0;c < a.length; c++)
    if (c in a && a[c] === b)
      return c;
  return -1;
};
w.prototype.h = function() {
  this.defaultPrevented = true;
};
var oa = function() {
  if (!l.addEventListener || !Object.defineProperty)
    return false;
  var a = false, b = Object.defineProperty({}, "passive", { get: function() {
    a = true;
  } });
  try {
    const c = () => {
    };
    l.addEventListener("test", c, b);
    l.removeEventListener("test", c, b);
  } catch (c) {
  }
  return a;
}();
qa[" "] = function() {
};
var ta = y("Opera");
var z = y("Trident") || y("MSIE");
var ua = y("Edge");
var va = ua || z;
var wa = y("Gecko") && !(pa().toLowerCase().indexOf("webkit") != -1 && !y("Edge")) && !(y("Trident") || y("MSIE")) && !y("Edge");
var xa = pa().toLowerCase().indexOf("webkit") != -1 && !y("Edge");
var za;
a: {
  Aa = "", Ba = function() {
    var a = pa();
    if (wa)
      return /rv:([^\);]+)(\)|;)/.exec(a);
    if (ua)
      return /Edge\/([\d\.]+)/.exec(a);
    if (z)
      return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);
    if (xa)
      return /WebKit\/(\S+)/.exec(a);
    if (ta)
      return /(?:Version)[ \/]?(\S+)/.exec(a);
  }();
  Ba && (Aa = Ba ? Ba[1] : "");
  if (z) {
    Ca = ya();
    if (Ca != null && Ca > parseFloat(Aa)) {
      za = String(Ca);
      break a;
    }
  }
  za = Aa;
}
var Aa;
var Ba;
var Ca;
var Da;
if (l.document && z) {
  Ea = ya();
  Da = Ea ? Ea : parseInt(za, 10) || undefined;
} else
  Da = undefined;
var Ea;
var Fa = Da;
r(A, w);
var Ga = { 2: "touch", 3: "pen", 4: "mouse" };
A.prototype.h = function() {
  A.$.h.call(this);
  var a = this.i;
  a.preventDefault ? a.preventDefault() : a.returnValue = false;
};
var Ha = "closure_listenable_" + (1e6 * Math.random() | 0);
var Ia = 0;
var Qa = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
Sa.prototype.add = function(a, b, c, d, e) {
  var f = a.toString();
  a = this.g[f];
  a || (a = this.g[f] = [], this.h++);
  var h = Ta(a, b, d, e);
  -1 < h ? (b = a[h], c || (b.ia = false)) : (b = new Ja(b, this.src, f, !!d, e), b.ia = c, a.push(b));
  return b;
};
var Va = "closure_lm_" + (1e6 * Math.random() | 0);
var Wa = {};
var hb = "__closure_events_fn_" + (1e9 * Math.random() >>> 0);
r(B, v);
B.prototype[Ha] = true;
B.prototype.removeEventListener = function(a, b, c, d) {
  fb(this, a, b, c, d);
};
B.prototype.N = function() {
  B.$.N.call(this);
  if (this.i) {
    var a = this.i, c;
    for (c in a.g) {
      for (var d = a.g[c], e = 0;e < d.length; e++)
        Ma(d[e]);
      delete a.g[c];
      a.h--;
    }
  }
  this.J = null;
};
B.prototype.O = function(a, b, c, d) {
  return this.i.add(String(a), b, false, c, d);
};
B.prototype.P = function(a, b, c, d) {
  return this.i.add(String(a), b, true, c, d);
};
var jb = l.JSON.stringify;

class kb {
  constructor(a, b) {
    this.i = a;
    this.j = b;
    this.h = 0;
    this.g = null;
  }
  get() {
    let a;
    0 < this.h ? (this.h--, a = this.g, this.g = a.next, a.next = null) : a = this.i();
    return a;
  }
}

class nb {
  constructor() {
    this.h = this.g = null;
  }
  add(a, b) {
    const c = ob.get();
    c.set(a, b);
    this.h ? this.h.next = c : this.g = c;
    this.h = c;
  }
}
var ob = new kb(() => new pb, (a) => a.reset());

class pb {
  constructor() {
    this.next = this.g = this.h = null;
  }
  set(a, b) {
    this.h = a;
    this.g = b;
    this.next = null;
  }
  reset() {
    this.next = this.g = this.h = null;
  }
}
var sb;
var tb = false;
var mb = new nb;
var vb = () => {
  const a = l.Promise.resolve(undefined);
  sb = () => {
    a.then(ub);
  };
};
var ub = () => {
  for (var a;a = lb(); ) {
    try {
      a.h.call(a.g);
    } catch (c) {
      rb(c);
    }
    var b = ob;
    b.j(a);
    100 > b.h && (b.h++, a.next = b.g, b.g = a);
  }
  tb = false;
};
r(wb, B);
k = wb.prototype;
k.ga = false;
k.T = null;
k.qb = function() {
  if (this.ga) {
    var a = Date.now() - this.l;
    0 < a && a < 0.8 * this.h ? this.T = this.g.setTimeout(this.j, this.h - a) : (this.T && (this.g.clearTimeout(this.T), this.T = null), C(this, "tick"), this.ga && (xb(this), this.start()));
  }
};
k.start = function() {
  this.ga = true;
  this.T || (this.T = this.g.setTimeout(this.j, this.h), this.l = Date.now());
};
k.N = function() {
  wb.$.N.call(this);
  xb(this);
  delete this.g;
};

class Ab extends v {
  constructor(a, b) {
    super();
    this.m = a;
    this.j = b;
    this.h = null;
    this.i = false;
    this.g = null;
  }
  l(a) {
    this.h = arguments;
    this.g ? this.i = true : zb(this);
  }
  N() {
    super.N();
    this.g && (l.clearTimeout(this.g), this.g = null, this.i = false, this.h = null);
  }
}
r(Bb, v);
var Cb = [];
Bb.prototype.N = function() {
  Bb.$.N.call(this);
  Fb(this);
};
Bb.prototype.handleEvent = function() {
  throw Error("EventHandler.handleEvent not implemented");
};
Gb.prototype.Ea = function() {
  this.g = false;
};
Gb.prototype.info = function() {
};
var E = {};
var Lb = null;
E.Ta = "serverreachability";
r(Nb, w);
E.STAT_EVENT = "statevent";
r(Pb, w);
E.Ua = "timingevent";
r(Qb, w);
var Sb = { NO_ERROR: 0, rb: 1, Eb: 2, Db: 3, yb: 4, Cb: 5, Fb: 6, Qa: 7, TIMEOUT: 8, Ib: 9 };
var Tb = { wb: "complete", Sb: "success", Ra: "error", Qa: "abort", Kb: "ready", Lb: "readystatechange", TIMEOUT: "timeout", Gb: "incrementaldata", Jb: "progress", zb: "downloadprogress", $b: "uploadprogress" };
Ub.prototype.h = null;
var Xb = { OPEN: "a", vb: "b", Ra: "c", Hb: "d" };
r(Yb, w);
r(Zb, w);
var $b;
r(ac, Ub);
ac.prototype.g = function() {
  return new XMLHttpRequest;
};
ac.prototype.i = function() {
  return {};
};
$b = new ac;
var cc = 45000;
var ec = {};
var fc = {};
k = bc.prototype;
k.setTimeout = function(a) {
  this.P = a;
};
k.nb = function(a) {
  a = a.target;
  const b = this.M;
  b && H(a) == 3 ? b.l() : this.Pa(a);
};
k.Pa = function(a) {
  try {
    if (a == this.g)
      a: {
        const u = H(this.g);
        var b = this.g.Ia();
        const L = this.g.da();
        if (!(3 > u) && (u != 3 || va || this.g && (this.h.h || this.g.ja() || mc(this.g)))) {
          this.J || u != 4 || b == 7 || (b == 8 || 0 >= L ? Ob(3) : Ob(2));
          nc(this);
          var c = this.g.da();
          this.ca = c;
          b:
            if (oc(this)) {
              var d = mc(this.g);
              a = "";
              var e = d.length, f = H(this.g) == 4;
              if (!this.h.i) {
                if (typeof TextDecoder === "undefined") {
                  I(this);
                  pc(this);
                  var h = "";
                  break b;
                }
                this.h.i = new l.TextDecoder;
              }
              for (b = 0;b < e; b++)
                this.h.h = true, a += this.h.i.decode(d[b], { stream: f && b == e - 1 });
              d.length = 0;
              this.h.g += a;
              this.o = 0;
              h = this.h.g;
            } else
              h = this.g.ja();
          this.i = c == 200;
          Ib(this.j, this.v, this.B, this.m, this.W, u, c);
          if (this.i) {
            if (this.aa && !this.K) {
              b: {
                if (this.g) {
                  var n, t = this.g;
                  if ((n = t.g ? t.g.getResponseHeader("X-HTTP-Initial-Response") : null) && !x(n)) {
                    var m = n;
                    break b;
                  }
                }
                m = null;
              }
              if (c = m)
                D(this.j, this.m, c, "Initial handshake response via X-HTTP-Initial-Response"), this.K = true, qc(this, c);
              else {
                this.i = false;
                this.s = 3;
                F(12);
                I(this);
                pc(this);
                break a;
              }
            }
            this.S ? (rc(this, u, h), va && this.i && u == 3 && (Eb(this.U, this.V, "tick", this.mb), this.V.start())) : (D(this.j, this.m, h, null), qc(this, h));
            u == 4 && I(this);
            this.i && !this.J && (u == 4 ? sc(this.l, this) : (this.i = false, jc(this)));
          } else
            tc(this.g), c == 400 && 0 < h.indexOf("Unknown SID") ? (this.s = 3, F(12)) : (this.s = 0, F(13)), I(this), pc(this);
        }
      }
  } catch (u) {
  } finally {
  }
};
k.mb = function() {
  if (this.g) {
    var a = H(this.g), b = this.g.ja();
    this.o < b.length && (nc(this), rc(this, a, b), this.i && a != 4 && jc(this));
  }
};
k.cancel = function() {
  this.J = true;
  I(this);
};
k.lb = function() {
  this.C = null;
  const a = Date.now();
  0 <= a - this.Y ? (Kb(this.j, this.B), this.L != 2 && (Ob(), F(17)), I(this), this.s = 2, pc(this)) : wc(this, this.Y - a);
};
var Lc = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");
M.prototype.toString = function() {
  var a = [], b = this.j;
  b && a.push(Sc(b, Tc, true), ":");
  var c = this.g;
  if (c || b == "file")
    a.push("//"), (b = this.s) && a.push(Sc(b, Tc, true), "@"), a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")), c = this.m, c != null && a.push(":", String(c));
  if (c = this.l)
    this.g && c.charAt(0) != "/" && a.push("/"), a.push(Sc(c, c.charAt(0) == "/" ? Uc : Vc, true));
  (c = this.i.toString()) && a.push("?", c);
  (c = this.o) && a.push("#", Sc(c, Wc));
  return a.join("");
};
var Tc = /[#\/\?@]/g;
var Vc = /[#\?:]/g;
var Uc = /[#\?]/g;
var Yc = /[#\?@]/g;
var Wc = /#/g;
k = Pc.prototype;
k.add = function(a, b) {
  N(this);
  this.i = null;
  a = O(this, a);
  var c = this.g.get(a);
  c || this.g.set(a, c = []);
  c.push(b);
  this.h += 1;
  return this;
};
k.forEach = function(a, b) {
  N(this);
  this.g.forEach(function(c, d) {
    c.forEach(function(e) {
      a.call(b, e, d, this);
    }, this);
  }, this);
};
k.ta = function() {
  N(this);
  const a = Array.from(this.g.values()), b = Array.from(this.g.keys()), c = [];
  for (let d = 0;d < b.length; d++) {
    const e = a[d];
    for (let f = 0;f < e.length; f++)
      c.push(b[d]);
  }
  return c;
};
k.Z = function(a) {
  N(this);
  let b = [];
  if (typeof a === "string")
    ad(this, a) && (b = b.concat(this.g.get(O(this, a))));
  else {
    a = Array.from(this.g.values());
    for (let c = 0;c < a.length; c++)
      b = b.concat(a[c]);
  }
  return b;
};
k.set = function(a, b) {
  N(this);
  this.i = null;
  a = O(this, a);
  ad(this, a) && (this.h -= this.g.get(a).length);
  this.g.set(a, [b]);
  this.h += 1;
  return this;
};
k.get = function(a, b) {
  if (!a)
    return b;
  a = this.Z(a);
  return 0 < a.length ? String(a[0]) : b;
};
k.toString = function() {
  if (this.i)
    return this.i;
  if (!this.g)
    return "";
  const a = [], b = Array.from(this.g.keys());
  for (var c = 0;c < b.length; c++) {
    var d = b[c];
    const f = encodeURIComponent(String(d)), h = this.Z(d);
    for (d = 0;d < h.length; d++) {
      var e = f;
      h[d] !== "" && (e += "=" + encodeURIComponent(String(h[d])));
      a.push(e);
    }
  }
  return this.i = a.join("&");
};
var bd = class {
  constructor(a, b) {
    this.g = a;
    this.map = b;
  }
};
var dd = 10;
cd.prototype.cancel = function() {
  this.i = fd(this);
  if (this.h)
    this.h.cancel(), this.h = null;
  else if (this.g && this.g.size !== 0) {
    for (const a of this.g.values())
      a.cancel();
    this.g.clear();
  }
};
var gd = class {
  stringify(a) {
    return l.JSON.stringify(a, undefined);
  }
  parse(a) {
    return l.JSON.parse(a, undefined);
  }
};
r(ld, Ub);
ld.prototype.g = function() {
  return new md(this.l, this.j);
};
ld.prototype.i = function(a) {
  return function() {
    return a;
  };
}({});
r(md, B);
var nd = 0;
k = md.prototype;
k.open = function(a, b) {
  if (this.readyState != nd)
    throw this.abort(), Error("Error reopening a connection");
  this.C = a;
  this.B = b;
  this.readyState = 1;
  od(this);
};
k.send = function(a) {
  if (this.readyState != 1)
    throw this.abort(), Error("need to call open() first. ");
  this.g = true;
  const b = { headers: this.v, method: this.C, credentials: this.m, cache: undefined };
  a && (b.body = a);
  (this.F || l).fetch(new Request(this.B, b)).then(this.$a.bind(this), this.ka.bind(this));
};
k.abort = function() {
  this.response = this.responseText = "";
  this.v = new Headers;
  this.status = 0;
  this.j && this.j.cancel("Request was aborted.").catch(() => {
  });
  1 <= this.readyState && this.g && this.readyState != 4 && (this.g = false, pd(this));
  this.readyState = nd;
};
k.$a = function(a) {
  if (this.g && (this.l = a, this.h || (this.status = this.l.status, this.statusText = this.l.statusText, this.h = a.headers, this.readyState = 2, od(this)), this.g && (this.readyState = 3, od(this), this.g)))
    if (this.responseType === "arraybuffer")
      a.arrayBuffer().then(this.Ya.bind(this), this.ka.bind(this));
    else if (typeof l.ReadableStream !== "undefined" && "body" in a) {
      this.j = a.body.getReader();
      if (this.u) {
        if (this.responseType)
          throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');
        this.response = [];
      } else
        this.response = this.responseText = "", this.A = new TextDecoder;
      qd(this);
    } else
      a.text().then(this.Za.bind(this), this.ka.bind(this));
};
k.Xa = function(a) {
  if (this.g) {
    if (this.u && a.value)
      this.response.push(a.value);
    else if (!this.u) {
      var b = a.value ? a.value : new Uint8Array(0);
      if (b = this.A.decode(b, { stream: !a.done }))
        this.response = this.responseText += b;
    }
    a.done ? pd(this) : od(this);
    this.readyState == 3 && qd(this);
  }
};
k.Za = function(a) {
  this.g && (this.response = this.responseText = a, pd(this));
};
k.Ya = function(a) {
  this.g && (this.response = a, pd(this));
};
k.ka = function() {
  this.g && pd(this);
};
k.setRequestHeader = function(a, b) {
  this.v.append(a, b);
};
k.getResponseHeader = function(a) {
  return this.h ? this.h.get(a.toLowerCase()) || "" : "";
};
k.getAllResponseHeaders = function() {
  if (!this.h)
    return "";
  const a = [], b = this.h.entries();
  for (var c = b.next();!c.done; )
    c = c.value, a.push(c[0] + ": " + c[1]), c = b.next();
  return a.join("\r\n");
};
Object.defineProperty(md.prototype, "withCredentials", { get: function() {
  return this.m === "include";
}, set: function(a) {
  this.m = a ? "include" : "same-origin";
} });
var rd = l.JSON.parse;
r(P, B);
var sd = "";
var td = /^https?$/i;
var ud = ["POST", "PUT"];
k = P.prototype;
k.Oa = function(a) {
  this.M = a;
};
k.ha = function(a, b, c, d) {
  if (this.g)
    throw Error("[goog.net.XhrIo] Object is active with another request=" + this.I + "; newUri=" + a);
  b = b ? b.toUpperCase() : "GET";
  this.I = a;
  this.j = "";
  this.m = 0;
  this.F = false;
  this.h = true;
  this.g = this.u ? this.u.g() : $b.g();
  this.C = this.u ? Vb(this.u) : Vb($b);
  this.g.onreadystatechange = q(this.La, this);
  try {
    this.G = true, this.g.open(b, String(a), true), this.G = false;
  } catch (f) {
    vd(this, f);
    return;
  }
  a = c || "";
  c = new Map(this.headers);
  if (d)
    if (Object.getPrototypeOf(d) === Object.prototype)
      for (var e in d)
        c.set(e, d[e]);
    else if (typeof d.keys === "function" && typeof d.get === "function")
      for (const f of d.keys())
        c.set(f, d.get(f));
    else
      throw Error("Unknown input type for opt_headers: " + String(d));
  d = Array.from(c.keys()).find((f) => f.toLowerCase() == "content-type");
  e = l.FormData && a instanceof l.FormData;
  !(0 <= ka(ud, b)) || d || e || c.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
  for (const [f, h] of c)
    this.g.setRequestHeader(f, h);
  this.K && (this.g.responseType = this.K);
  "withCredentials" in this.g && this.g.withCredentials !== this.M && (this.g.withCredentials = this.M);
  try {
    wd(this), 0 < this.B && ((this.L = xd(this.g)) ? (this.g.timeout = this.B, this.g.ontimeout = q(this.ua, this)) : this.A = yb(this.ua, this.B, this)), this.v = true, this.g.send(a), this.v = false;
  } catch (f) {
    vd(this, f);
  }
};
k.ua = function() {
  typeof goog != "undefined" && this.g && (this.j = "Timed out after " + this.B + "ms, aborting", this.m = 8, C(this, "timeout"), this.abort(8));
};
k.abort = function(a) {
  this.g && this.h && (this.h = false, this.l = true, this.g.abort(), this.l = false, this.m = a || 7, C(this, "complete"), C(this, "abort"), zd(this));
};
k.N = function() {
  this.g && (this.h && (this.h = false, this.l = true, this.g.abort(), this.l = false), zd(this, true));
  P.$.N.call(this);
};
k.La = function() {
  this.s || (this.G || this.v || this.l ? Ad(this) : this.kb());
};
k.kb = function() {
  Ad(this);
};
k.isActive = function() {
  return !!this.g;
};
k.da = function() {
  try {
    return 2 < H(this) ? this.g.status : -1;
  } catch (a) {
    return -1;
  }
};
k.ja = function() {
  try {
    return this.g ? this.g.responseText : "";
  } catch (a) {
    return "";
  }
};
k.Wa = function(a) {
  if (this.g) {
    var b = this.g.responseText;
    a && b.indexOf(a) == 0 && (b = b.substring(a.length));
    return rd(b);
  }
};
k.Ia = function() {
  return this.m;
};
k.Sa = function() {
  return typeof this.j === "string" ? this.j : String(this.j);
};
k = Ed.prototype;
k.ra = 8;
k.H = 1;
k.Na = function(a) {
  if (this.m)
    if (this.m = null, this.H == 1) {
      if (!a) {
        this.W = Math.floor(1e5 * Math.random());
        a = this.W++;
        const e = new bc(this, this.l, a);
        let f = this.s;
        this.U && (f ? (f = Pa(f), Ra(f, this.U)) : f = this.U);
        this.o !== null || this.O || (e.I = f, f = null);
        if (this.P)
          a: {
            var b = 0;
            for (var c = 0;c < this.j.length; c++) {
              b: {
                var d = this.j[c];
                if ("__data__" in d.map && (d = d.map.__data__, typeof d === "string")) {
                  d = d.length;
                  break b;
                }
                d = undefined;
              }
              if (d === undefined)
                break;
              b += d;
              if (4096 < b) {
                b = c;
                break a;
              }
              if (b === 4096 || c === this.j.length - 1) {
                b = c + 1;
                break a;
              }
            }
            b = 1000;
          }
        else
          b = 1000;
        b = Kd(this, e, b);
        c = G(this.I);
        K(c, "RID", a);
        K(c, "CVER", 22);
        this.F && K(c, "X-HTTP-Session-Id", this.F);
        Gd(this, c);
        f && (this.O ? b = "headers=" + encodeURIComponent(String(Bd(f))) + "&" + b : this.o && Cd(c, this.o, f));
        Cc(this.i, e);
        this.bb && K(c, "TYPE", "init");
        this.P ? (K(c, "$req", b), K(c, "SID", "null"), e.aa = true, gc(e, c, null)) : gc(e, c, b);
        this.H = 2;
      }
    } else
      this.H == 3 && (a ? Ld(this, a) : this.j.length == 0 || ed(this.i) || Ld(this));
};
k.Ma = function() {
  this.u = null;
  Md(this);
  if (this.ca && !(this.M || this.g == null || 0 >= this.S)) {
    var a = 2 * this.S;
    this.l.info("BP detection timer enabled: " + a);
    this.B = Rb(q(this.jb, this), a);
  }
};
k.jb = function() {
  this.B && (this.B = null, this.l.info("BP detection timeout reached."), this.l.info("Buffering proxy detected and switch to long-polling!"), this.G = false, this.M = true, F(10), zc(this), Md(this));
};
k.ib = function() {
  this.v != null && (this.v = null, zc(this), Ac(this), F(19));
};
k.pb = function(a) {
  a ? (this.l.info("Successfully pinged google.com"), F(2)) : (this.l.info("Failed to ping google.com"), F(1));
};
k.isActive = function() {
  return !!this.h && this.h.isActive(this);
};
k = Nd.prototype;
k.Ba = function() {
};
k.Aa = function() {
};
k.za = function() {
};
k.ya = function() {
};
k.isActive = function() {
  return true;
};
k.Va = function() {
};
Od.prototype.g = function(a, b) {
  return new Q(a, b);
};
r(Q, B);
Q.prototype.m = function() {
  this.g.h = this.j;
  this.A && (this.g.J = true);
  var a = this.g, b = this.l, c = this.h || undefined;
  F(0);
  a.Y = b;
  a.na = c || {};
  a.G = a.aa;
  a.I = Dc(a, null, a.Y);
  Gc(a);
};
Q.prototype.close = function() {
  Hc(this.g);
};
Q.prototype.u = function(a) {
  var b = this.g;
  if (typeof a === "string") {
    var c = {};
    c.__data__ = a;
    a = c;
  } else
    this.v && (c = {}, c.__data__ = jb(a), a = c);
  b.j.push(new bd(b.fb++, a));
  b.H == 3 && Gc(b);
};
Q.prototype.N = function() {
  this.g.h = null;
  delete this.j;
  Hc(this.g);
  delete this.g;
  Q.$.N.call(this);
};
r(Pd, Yb);
r(Qd, Zb);
r(R, Nd);
R.prototype.Ba = function() {
  C(this.g, "a");
};
R.prototype.Aa = function(a) {
  C(this.g, new Pd(a));
};
R.prototype.za = function(a) {
  C(this.g, new Qd);
};
R.prototype.ya = function() {
  C(this.g, "b");
};
r(S, Rd);
S.prototype.reset = function() {
  this.g[0] = 1732584193;
  this.g[1] = 4023233417;
  this.g[2] = 2562383102;
  this.g[3] = 271733878;
  this.i = this.h = 0;
};
S.prototype.j = function(a, b) {
  b === undefined && (b = a.length);
  for (var c = b - this.blockSize, d = this.m, e = this.h, f = 0;f < b; ) {
    if (e == 0)
      for (;f <= c; )
        Sd(this, a, f), f += this.blockSize;
    if (typeof a === "string")
      for (;f < b; ) {
        if (d[e++] = a.charCodeAt(f++), e == this.blockSize) {
          Sd(this, d);
          e = 0;
          break;
        }
      }
    else
      for (;f < b; )
        if (d[e++] = a[f++], e == this.blockSize) {
          Sd(this, d);
          e = 0;
          break;
        }
  }
  this.h = e;
  this.i += b;
};
S.prototype.l = function() {
  var a = Array((56 > this.h ? this.blockSize : 2 * this.blockSize) - this.h);
  a[0] = 128;
  for (var b = 1;b < a.length - 8; ++b)
    a[b] = 0;
  var c = 8 * this.i;
  for (b = a.length - 8;b < a.length; ++b)
    a[b] = c & 255, c /= 256;
  this.j(a);
  a = Array(16);
  for (b = c = 0;4 > b; ++b)
    for (var d = 0;32 > d; d += 8)
      a[c++] = this.g[b] >>> d & 255;
  return a;
};
var sa = {};
var Ud = 4294967296;
var V = Td(0);
var Wd = Td(1);
var Xd = Td(16777216);
k = T.prototype;
k.ea = function() {
  if (X(this))
    return -W(this).ea();
  for (var a = 0, b = 1, c = 0;c < this.g.length; c++) {
    var d = this.D(c);
    a += (0 <= d ? d : Ud + d) * b;
    b *= Ud;
  }
  return a;
};
k.toString = function(a) {
  a = a || 10;
  if (2 > a || 36 < a)
    throw Error("radix out of range: " + a);
  if (Y(this))
    return "0";
  if (X(this))
    return "-" + W(this).toString(a);
  for (var b = U(Math.pow(a, 6)), c = this, d = "";; ) {
    var e = Yd(c, b).g;
    c = Zd(c, e.R(b));
    var f = ((0 < c.g.length ? c.g[0] : c.h) >>> 0).toString(a);
    c = e;
    if (Y(c))
      return f + d;
    for (;6 > f.length; )
      f = "0" + f;
    d = f + d;
  }
};
k.D = function(a) {
  return 0 > a ? 0 : a < this.g.length ? this.g[a] : this.h;
};
k.X = function(a) {
  a = Zd(this, a);
  return X(a) ? -1 : Y(a) ? 0 : 1;
};
k.abs = function() {
  return X(this) ? W(this) : this;
};
k.add = function(a) {
  for (var b = Math.max(this.g.length, a.g.length), c = [], d = 0, e = 0;e <= b; e++) {
    var f = d + (this.D(e) & 65535) + (a.D(e) & 65535), h = (f >>> 16) + (this.D(e) >>> 16) + (a.D(e) >>> 16);
    d = h >>> 16;
    f &= 65535;
    h &= 65535;
    c[e] = h << 16 | f;
  }
  return new T(c, c[c.length - 1] & -2147483648 ? -1 : 0);
};
k.R = function(a) {
  if (Y(this) || Y(a))
    return V;
  if (X(this))
    return X(a) ? W(this).R(W(a)) : W(W(this).R(a));
  if (X(a))
    return W(this.R(W(a)));
  if (0 > this.X(Xd) && 0 > a.X(Xd))
    return U(this.ea() * a.ea());
  for (var b = this.g.length + a.g.length, c = [], d = 0;d < 2 * b; d++)
    c[d] = 0;
  for (d = 0;d < this.g.length; d++)
    for (var e = 0;e < a.g.length; e++) {
      var f = this.D(d) >>> 16, h = this.D(d) & 65535, n = a.D(e) >>> 16, t = a.D(e) & 65535;
      c[2 * d + 2 * e] += h * t;
      $d(c, 2 * d + 2 * e);
      c[2 * d + 2 * e + 1] += f * t;
      $d(c, 2 * d + 2 * e + 1);
      c[2 * d + 2 * e + 1] += h * n;
      $d(c, 2 * d + 2 * e + 1);
      c[2 * d + 2 * e + 2] += f * n;
      $d(c, 2 * d + 2 * e + 2);
    }
  for (d = 0;d < b; d++)
    c[d] = c[2 * d + 1] << 16 | c[2 * d];
  for (d = b;d < 2 * b; d++)
    c[d] = 0;
  return new T(c, 0);
};
k.gb = function(a) {
  return Yd(this, a).h;
};
k.and = function(a) {
  for (var b = Math.max(this.g.length, a.g.length), c = [], d = 0;d < b; d++)
    c[d] = this.D(d) & a.D(d);
  return new T(c, this.h & a.h);
};
k.or = function(a) {
  for (var b = Math.max(this.g.length, a.g.length), c = [], d = 0;d < b; d++)
    c[d] = this.D(d) | a.D(d);
  return new T(c, this.h | a.h);
};
k.xor = function(a) {
  for (var b = Math.max(this.g.length, a.g.length), c = [], d = 0;d < b; d++)
    c[d] = this.D(d) ^ a.D(d);
  return new T(c, this.h ^ a.h);
};
Od.prototype.createWebChannel = Od.prototype.g;
Q.prototype.send = Q.prototype.u;
Q.prototype.open = Q.prototype.m;
Q.prototype.close = Q.prototype.close;
Sb.NO_ERROR = 0;
Sb.TIMEOUT = 8;
Sb.HTTP_ERROR = 6;
Tb.COMPLETE = "complete";
Wb.EventType = Xb;
Xb.OPEN = "a";
Xb.CLOSE = "b";
Xb.ERROR = "c";
Xb.MESSAGE = "d";
B.prototype.listen = B.prototype.O;
P.prototype.listenOnce = P.prototype.P;
P.prototype.getLastError = P.prototype.Sa;
P.prototype.getLastErrorCode = P.prototype.Ia;
P.prototype.getStatus = P.prototype.da;
P.prototype.getResponseJson = P.prototype.Wa;
P.prototype.getResponseText = P.prototype.ja;
P.prototype.send = P.prototype.ha;
P.prototype.setWithCredentials = P.prototype.Oa;
S.prototype.digest = S.prototype.l;
S.prototype.reset = S.prototype.reset;
S.prototype.update = S.prototype.j;
T.prototype.add = T.prototype.add;
T.prototype.multiply = T.prototype.R;
T.prototype.modulo = T.prototype.gb;
T.prototype.compare = T.prototype.X;
T.prototype.toNumber = T.prototype.ea;
T.prototype.toString = T.prototype.toString;
T.prototype.getBits = T.prototype.D;
T.fromNumber = U;
T.fromString = Vd;
var createWebChannelTransport = esm.createWebChannelTransport = function() {
  return new Od;
};
var getStatEventTarget = esm.getStatEventTarget = function() {
  return Mb();
};
var ErrorCode = esm.ErrorCode = Sb;
var EventType = esm.EventType = Tb;
var Event = esm.Event = E;
var Stat = esm.Stat = { xb: 0, Ab: 1, Bb: 2, Ub: 3, Zb: 4, Wb: 5, Xb: 6, Vb: 7, Tb: 8, Yb: 9, PROXY: 10, NOPROXY: 11, Rb: 12, Nb: 13, Ob: 14, Mb: 15, Pb: 16, Qb: 17, tb: 18, sb: 19, ub: 20 };
var FetchXmlHttpFactory = esm.FetchXmlHttpFactory = ld;
var WebChannel = esm.WebChannel = Wb;
var XhrIo = esm.XhrIo = P;
var Md5 = esm.Md5 = S;
var Integer = esm.Integer = T;

// node_modules/@firebase/firestore/dist/index.esm2017.js
var __PRIVATE_getLogLevel = function() {
  return D2.logLevel;
};
var __PRIVATE_logDebug = function(e, ...t) {
  if (D2.logLevel <= LogLevel.DEBUG) {
    const n = t.map(__PRIVATE_argToString);
    D2.debug(`Firestore (${b}): ${e}`, ...n);
  }
};
var __PRIVATE_logError = function(e, ...t) {
  if (D2.logLevel <= LogLevel.ERROR) {
    const n = t.map(__PRIVATE_argToString);
    D2.error(`Firestore (${b}): ${e}`, ...n);
  }
};
var __PRIVATE_logWarn = function(e, ...t) {
  if (D2.logLevel <= LogLevel.WARN) {
    const n = t.map(__PRIVATE_argToString);
    D2.warn(`Firestore (${b}): ${e}`, ...n);
  }
};
var __PRIVATE_argToString = function(e) {
  if (typeof e == "string")
    return e;
  try {
    return function __PRIVATE_formatJSON(e2) {
      return JSON.stringify(e2);
    }(e);
  } catch (t) {
    return e;
  }
};
var fail = function(e = "Unexpected state") {
  const t = `FIRESTORE (${b}) INTERNAL ASSERTION FAILED: ` + e;
  throw __PRIVATE_logError(t), new Error(t);
};
var __PRIVATE_hardAssert = function(e, t) {
  e || fail();
};
var __PRIVATE_debugCast = function(e, t) {
  return e;
};
var __PRIVATE_randomBytes = function(e) {
  const t = typeof self != "undefined" && (self.crypto || self.msCrypto), n = new Uint8Array(e);
  if (t && typeof t.getRandomValues == "function")
    t.getRandomValues(n);
  else
    for (let t2 = 0;t2 < e; t2++)
      n[t2] = Math.floor(256 * Math.random());
  return n;
};
var __PRIVATE_primitiveComparator = function(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
};
var __PRIVATE_arrayEquals = function(e, t, n) {
  return e.length === t.length && e.every((e2, r2) => n(e2, t[r2]));
};
var __PRIVATE_immediateSuccessor = function(e) {
  return e + "\0";
};
var __PRIVATE_fieldIndexGetArraySegment = function(e) {
  return e.fields.find((e2) => e2.kind === 2);
};
var __PRIVATE_fieldIndexGetDirectionalSegments = function(e) {
  return e.fields.filter((e2) => e2.kind !== 2);
};
var __PRIVATE_newIndexOffsetSuccessorFromReadTime = function(e, t) {
  const n = e.toTimestamp().seconds, r2 = e.toTimestamp().nanoseconds + 1, i = SnapshotVersion.fromTimestamp(r2 === 1e9 ? new Timestamp(n + 1, 0) : new Timestamp(n, r2));
  return new IndexOffset(i, DocumentKey.empty(), t);
};
var __PRIVATE_newIndexOffsetFromDocument = function(e) {
  return new IndexOffset(e.readTime, e.key, -1);
};
var __PRIVATE_indexOffsetComparator = function(e, t) {
  let n = e.readTime.compareTo(t.readTime);
  return n !== 0 ? n : (n = DocumentKey.comparator(e.documentKey, t.documentKey), n !== 0 ? n : __PRIVATE_primitiveComparator(e.largestBatchId, t.largestBatchId));
};
async function __PRIVATE_ignoreIfPrimaryLeaseLoss(e) {
  if (e.code !== C2.FAILED_PRECONDITION || e.message !== F2)
    throw e;
  __PRIVATE_logDebug("LocalStore", "Unexpectedly lost primary lease");
}
var __PRIVATE_getAndroidVersion = function(e) {
  const t = e.match(/Android ([\d.]+)/i), n = t ? t[1].split(".").slice(0, 2).join(".") : "-1";
  return Number(n);
};
var __PRIVATE_isIndexedDbTransactionError = function(e) {
  return e.name === "IndexedDbTransactionError";
};
var __PRIVATE_wrapRequest = function(e) {
  return new PersistencePromise((t, n) => {
    e.onsuccess = (e2) => {
      const n2 = e2.target.result;
      t(n2);
    }, e.onerror = (e2) => {
      const t2 = __PRIVATE_checkForAndReportiOSError(e2.target.error);
      n(t2);
    };
  });
};
var __PRIVATE_checkForAndReportiOSError = function(e) {
  const t = __PRIVATE_SimpleDb.S(getUA());
  if (t >= 12.2 && t < 13) {
    const t2 = "An internal error was encountered in the Indexed Database server";
    if (e.message.indexOf(t2) >= 0) {
      const e2 = new FirestoreError("internal", `IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t2}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);
      return M2 || (M2 = true, setTimeout(() => {
        throw e2;
      }, 0)), e2;
    }
  }
  return e;
};
var __PRIVATE_isNullOrUndefined = function(e) {
  return e == null;
};
var __PRIVATE_isNegativeZero = function(e) {
  return e === 0 && 1 / e == -1 / 0;
};
var isSafeInteger = function(e) {
  return typeof e == "number" && Number.isInteger(e) && !__PRIVATE_isNegativeZero(e) && e <= Number.MAX_SAFE_INTEGER && e >= Number.MIN_SAFE_INTEGER;
};
var __PRIVATE_encodeResourcePath = function(e) {
  let t = "";
  for (let n = 0;n < e.length; n++)
    t.length > 0 && (t = __PRIVATE_encodeSeparator(t)), t = __PRIVATE_encodeSegment(e.get(n), t);
  return __PRIVATE_encodeSeparator(t);
};
var __PRIVATE_encodeSegment = function(e, t) {
  let n = t;
  const r2 = e.length;
  for (let t2 = 0;t2 < r2; t2++) {
    const r3 = e.charAt(t2);
    switch (r3) {
      case "\0":
        n += "";
        break;
      case "":
        n += "";
        break;
      default:
        n += r3;
    }
  }
  return n;
};
var __PRIVATE_encodeSeparator = function(e) {
  return e + "";
};
var __PRIVATE_decodeResourcePath = function(e) {
  const t = e.length;
  if (__PRIVATE_hardAssert(t >= 2), t === 2)
    return __PRIVATE_hardAssert(e.charAt(0) === "" && e.charAt(1) === ""), ResourcePath.emptyPath();
  const __PRIVATE_lastReasonableEscapeIndex = t - 2, n = [];
  let r2 = "";
  for (let i = 0;i < t; ) {
    const t2 = e.indexOf("", i);
    (t2 < 0 || t2 > __PRIVATE_lastReasonableEscapeIndex) && fail();
    switch (e.charAt(t2 + 1)) {
      case "":
        const s = e.substring(i, t2);
        let o;
        r2.length === 0 ? o = s : (r2 += s, o = r2, r2 = ""), n.push(o);
        break;
      case "":
        r2 += e.substring(i, t2), r2 += "\0";
        break;
      case "":
        r2 += e.substring(i, t2 + 1);
        break;
      default:
        fail();
    }
    i = t2 + 2;
  }
  return new ResourcePath(n);
};
var __PRIVATE_newDbDocumentMutationPrefixForPath = function(e, t) {
  return [e, __PRIVATE_encodeResourcePath(t)];
};
var __PRIVATE_newDbDocumentMutationKey = function(e, t, n) {
  return [e, __PRIVATE_encodeResourcePath(t), n];
};
var __PRIVATE_getStore = function(e, t) {
  const n = __PRIVATE_debugCast(e);
  return __PRIVATE_SimpleDb.F(n._e, t);
};
var __PRIVATE_objectSize = function(e) {
  let t = 0;
  for (const n in e)
    Object.prototype.hasOwnProperty.call(e, n) && t++;
  return t;
};
var forEach = function(e, t) {
  for (const n in e)
    Object.prototype.hasOwnProperty.call(e, n) && t(n, e[n]);
};
var isEmpty = function(e) {
  for (const t in e)
    if (Object.prototype.hasOwnProperty.call(e, t))
      return false;
  return true;
};
var __PRIVATE_advanceIterator = function(e) {
  return e.hasNext() ? e.getNext() : undefined;
};
var __PRIVATE_normalizeTimestamp = function(e) {
  if (__PRIVATE_hardAssert(!!e), typeof e == "string") {
    let t = 0;
    const n = ne.exec(e);
    if (__PRIVATE_hardAssert(!!n), n[1]) {
      let e2 = n[1];
      e2 = (e2 + "000000000").substr(0, 9), t = Number(e2);
    }
    const r2 = new Date(e);
    return {
      seconds: Math.floor(r2.getTime() / 1000),
      nanos: t
    };
  }
  return {
    seconds: __PRIVATE_normalizeNumber(e.seconds),
    nanos: __PRIVATE_normalizeNumber(e.nanos)
  };
};
var __PRIVATE_normalizeNumber = function(e) {
  return typeof e == "number" ? e : typeof e == "string" ? Number(e) : 0;
};
var __PRIVATE_normalizeByteString = function(e) {
  return typeof e == "string" ? ByteString.fromBase64String(e) : ByteString.fromUint8Array(e);
};
var __PRIVATE_isServerTimestamp = function(e) {
  var t, n;
  return ((n = (((t = e == null ? undefined : e.mapValue) === null || t === undefined ? undefined : t.fields) || {}).__type__) === null || n === undefined ? undefined : n.stringValue) === "server_timestamp";
};
var __PRIVATE_getPreviousValue = function(e) {
  const t = e.mapValue.fields.__previous_value__;
  return __PRIVATE_isServerTimestamp(t) ? __PRIVATE_getPreviousValue(t) : t;
};
var __PRIVATE_getLocalWriteTime = function(e) {
  const t = __PRIVATE_normalizeTimestamp(e.mapValue.fields.__local_write_time__.timestampValue);
  return new Timestamp(t.seconds, t.nanos);
};
var __PRIVATE_typeOrder = function(e) {
  return "nullValue" in e ? 0 : ("booleanValue" in e) ? 1 : ("integerValue" in e) || ("doubleValue" in e) ? 2 : ("timestampValue" in e) ? 3 : ("stringValue" in e) ? 5 : ("bytesValue" in e) ? 6 : ("referenceValue" in e) ? 7 : ("geoPointValue" in e) ? 8 : ("arrayValue" in e) ? 9 : ("mapValue" in e) ? __PRIVATE_isServerTimestamp(e) ? 4 : __PRIVATE_isMaxValue(e) ? 9007199254740991 : 10 : fail();
};
var __PRIVATE_valueEquals = function(e, t) {
  if (e === t)
    return true;
  const n = __PRIVATE_typeOrder(e);
  if (n !== __PRIVATE_typeOrder(t))
    return false;
  switch (n) {
    case 0:
    case 9007199254740991:
      return true;
    case 1:
      return e.booleanValue === t.booleanValue;
    case 4:
      return __PRIVATE_getLocalWriteTime(e).isEqual(__PRIVATE_getLocalWriteTime(t));
    case 3:
      return function __PRIVATE_timestampEquals(e2, t2) {
        if (typeof e2.timestampValue == "string" && typeof t2.timestampValue == "string" && e2.timestampValue.length === t2.timestampValue.length)
          return e2.timestampValue === t2.timestampValue;
        const n2 = __PRIVATE_normalizeTimestamp(e2.timestampValue), r2 = __PRIVATE_normalizeTimestamp(t2.timestampValue);
        return n2.seconds === r2.seconds && n2.nanos === r2.nanos;
      }(e, t);
    case 5:
      return e.stringValue === t.stringValue;
    case 6:
      return function __PRIVATE_blobEquals(e2, t2) {
        return __PRIVATE_normalizeByteString(e2.bytesValue).isEqual(__PRIVATE_normalizeByteString(t2.bytesValue));
      }(e, t);
    case 7:
      return e.referenceValue === t.referenceValue;
    case 8:
      return function __PRIVATE_geoPointEquals(e2, t2) {
        return __PRIVATE_normalizeNumber(e2.geoPointValue.latitude) === __PRIVATE_normalizeNumber(t2.geoPointValue.latitude) && __PRIVATE_normalizeNumber(e2.geoPointValue.longitude) === __PRIVATE_normalizeNumber(t2.geoPointValue.longitude);
      }(e, t);
    case 2:
      return function __PRIVATE_numberEquals(e2, t2) {
        if ("integerValue" in e2 && "integerValue" in t2)
          return __PRIVATE_normalizeNumber(e2.integerValue) === __PRIVATE_normalizeNumber(t2.integerValue);
        if ("doubleValue" in e2 && "doubleValue" in t2) {
          const n2 = __PRIVATE_normalizeNumber(e2.doubleValue), r2 = __PRIVATE_normalizeNumber(t2.doubleValue);
          return n2 === r2 ? __PRIVATE_isNegativeZero(n2) === __PRIVATE_isNegativeZero(r2) : isNaN(n2) && isNaN(r2);
        }
        return false;
      }(e, t);
    case 9:
      return __PRIVATE_arrayEquals(e.arrayValue.values || [], t.arrayValue.values || [], __PRIVATE_valueEquals);
    case 10:
      return function __PRIVATE_objectEquals(e2, t2) {
        const n2 = e2.mapValue.fields || {}, r2 = t2.mapValue.fields || {};
        if (__PRIVATE_objectSize(n2) !== __PRIVATE_objectSize(r2))
          return false;
        for (const e3 in n2)
          if (n2.hasOwnProperty(e3) && (r2[e3] === undefined || !__PRIVATE_valueEquals(n2[e3], r2[e3])))
            return false;
        return true;
      }(e, t);
    default:
      return fail();
  }
};
var __PRIVATE_arrayValueContains = function(e, t) {
  return (e.values || []).find((e2) => __PRIVATE_valueEquals(e2, t)) !== undefined;
};
var __PRIVATE_valueCompare = function(e, t) {
  if (e === t)
    return 0;
  const n = __PRIVATE_typeOrder(e), r2 = __PRIVATE_typeOrder(t);
  if (n !== r2)
    return __PRIVATE_primitiveComparator(n, r2);
  switch (n) {
    case 0:
    case 9007199254740991:
      return 0;
    case 1:
      return __PRIVATE_primitiveComparator(e.booleanValue, t.booleanValue);
    case 2:
      return function __PRIVATE_compareNumbers(e2, t2) {
        const n2 = __PRIVATE_normalizeNumber(e2.integerValue || e2.doubleValue), r3 = __PRIVATE_normalizeNumber(t2.integerValue || t2.doubleValue);
        return n2 < r3 ? -1 : n2 > r3 ? 1 : n2 === r3 ? 0 : isNaN(n2) ? isNaN(r3) ? 0 : -1 : 1;
      }(e, t);
    case 3:
      return __PRIVATE_compareTimestamps(e.timestampValue, t.timestampValue);
    case 4:
      return __PRIVATE_compareTimestamps(__PRIVATE_getLocalWriteTime(e), __PRIVATE_getLocalWriteTime(t));
    case 5:
      return __PRIVATE_primitiveComparator(e.stringValue, t.stringValue);
    case 6:
      return function __PRIVATE_compareBlobs(e2, t2) {
        const n2 = __PRIVATE_normalizeByteString(e2), r3 = __PRIVATE_normalizeByteString(t2);
        return n2.compareTo(r3);
      }(e.bytesValue, t.bytesValue);
    case 7:
      return function __PRIVATE_compareReferences(e2, t2) {
        const n2 = e2.split("/"), r3 = t2.split("/");
        for (let e3 = 0;e3 < n2.length && e3 < r3.length; e3++) {
          const t3 = __PRIVATE_primitiveComparator(n2[e3], r3[e3]);
          if (t3 !== 0)
            return t3;
        }
        return __PRIVATE_primitiveComparator(n2.length, r3.length);
      }(e.referenceValue, t.referenceValue);
    case 8:
      return function __PRIVATE_compareGeoPoints(e2, t2) {
        const n2 = __PRIVATE_primitiveComparator(__PRIVATE_normalizeNumber(e2.latitude), __PRIVATE_normalizeNumber(t2.latitude));
        if (n2 !== 0)
          return n2;
        return __PRIVATE_primitiveComparator(__PRIVATE_normalizeNumber(e2.longitude), __PRIVATE_normalizeNumber(t2.longitude));
      }(e.geoPointValue, t.geoPointValue);
    case 9:
      return function __PRIVATE_compareArrays(e2, t2) {
        const n2 = e2.values || [], r3 = t2.values || [];
        for (let e3 = 0;e3 < n2.length && e3 < r3.length; ++e3) {
          const t3 = __PRIVATE_valueCompare(n2[e3], r3[e3]);
          if (t3)
            return t3;
        }
        return __PRIVATE_primitiveComparator(n2.length, r3.length);
      }(e.arrayValue, t.arrayValue);
    case 10:
      return function __PRIVATE_compareMaps(e2, t2) {
        if (e2 === re.mapValue && t2 === re.mapValue)
          return 0;
        if (e2 === re.mapValue)
          return 1;
        if (t2 === re.mapValue)
          return -1;
        const n2 = e2.fields || {}, r3 = Object.keys(n2), i = t2.fields || {}, s = Object.keys(i);
        r3.sort(), s.sort();
        for (let e3 = 0;e3 < r3.length && e3 < s.length; ++e3) {
          const t3 = __PRIVATE_primitiveComparator(r3[e3], s[e3]);
          if (t3 !== 0)
            return t3;
          const o = __PRIVATE_valueCompare(n2[r3[e3]], i[s[e3]]);
          if (o !== 0)
            return o;
        }
        return __PRIVATE_primitiveComparator(r3.length, s.length);
      }(e.mapValue, t.mapValue);
    default:
      throw fail();
  }
};
var __PRIVATE_compareTimestamps = function(e, t) {
  if (typeof e == "string" && typeof t == "string" && e.length === t.length)
    return __PRIVATE_primitiveComparator(e, t);
  const n = __PRIVATE_normalizeTimestamp(e), r2 = __PRIVATE_normalizeTimestamp(t), i = __PRIVATE_primitiveComparator(n.seconds, r2.seconds);
  return i !== 0 ? i : __PRIVATE_primitiveComparator(n.nanos, r2.nanos);
};
var canonicalId = function(e) {
  return __PRIVATE_canonifyValue(e);
};
var __PRIVATE_canonifyValue = function(e) {
  return "nullValue" in e ? "null" : ("booleanValue" in e) ? "" + e.booleanValue : ("integerValue" in e) ? "" + e.integerValue : ("doubleValue" in e) ? "" + e.doubleValue : ("timestampValue" in e) ? function __PRIVATE_canonifyTimestamp(e2) {
    const t = __PRIVATE_normalizeTimestamp(e2);
    return `time(${t.seconds},${t.nanos})`;
  }(e.timestampValue) : ("stringValue" in e) ? e.stringValue : ("bytesValue" in e) ? function __PRIVATE_canonifyByteString(e2) {
    return __PRIVATE_normalizeByteString(e2).toBase64();
  }(e.bytesValue) : ("referenceValue" in e) ? function __PRIVATE_canonifyReference(e2) {
    return DocumentKey.fromName(e2).toString();
  }(e.referenceValue) : ("geoPointValue" in e) ? function __PRIVATE_canonifyGeoPoint(e2) {
    return `geo(${e2.latitude},${e2.longitude})`;
  }(e.geoPointValue) : ("arrayValue" in e) ? function __PRIVATE_canonifyArray(e2) {
    let t = "[", n = true;
    for (const r2 of e2.values || [])
      n ? n = false : t += ",", t += __PRIVATE_canonifyValue(r2);
    return t + "]";
  }(e.arrayValue) : ("mapValue" in e) ? function __PRIVATE_canonifyMap(e2) {
    const t = Object.keys(e2.fields || {}).sort();
    let n = "{", r2 = true;
    for (const i of t)
      r2 ? r2 = false : n += ",", n += `${i}:${__PRIVATE_canonifyValue(e2.fields[i])}`;
    return n + "}";
  }(e.mapValue) : fail();
};
var __PRIVATE_refValue = function(e, t) {
  return {
    referenceValue: `projects/${e.projectId}/databases/${e.database}/documents/${t.path.canonicalString()}`
  };
};
var isInteger = function(e) {
  return !!e && "integerValue" in e;
};
var isArray = function(e) {
  return !!e && "arrayValue" in e;
};
var __PRIVATE_isNullValue = function(e) {
  return !!e && "nullValue" in e;
};
var __PRIVATE_isNanValue = function(e) {
  return !!e && "doubleValue" in e && isNaN(Number(e.doubleValue));
};
var __PRIVATE_isMapValue = function(e) {
  return !!e && "mapValue" in e;
};
var __PRIVATE_deepClone = function(e) {
  if (e.geoPointValue)
    return {
      geoPointValue: Object.assign({}, e.geoPointValue)
    };
  if (e.timestampValue && typeof e.timestampValue == "object")
    return {
      timestampValue: Object.assign({}, e.timestampValue)
    };
  if (e.mapValue) {
    const t = {
      mapValue: {
        fields: {}
      }
    };
    return forEach(e.mapValue.fields, (e2, n) => t.mapValue.fields[e2] = __PRIVATE_deepClone(n)), t;
  }
  if (e.arrayValue) {
    const t = {
      arrayValue: {
        values: []
      }
    };
    for (let n = 0;n < (e.arrayValue.values || []).length; ++n)
      t.arrayValue.values[n] = __PRIVATE_deepClone(e.arrayValue.values[n]);
    return t;
  }
  return Object.assign({}, e);
};
var __PRIVATE_isMaxValue = function(e) {
  return (((e.mapValue || {}).fields || {}).__type__ || {}).stringValue === "__max__";
};
var __PRIVATE_valuesGetLowerBound = function(e) {
  return "nullValue" in e ? ie : ("booleanValue" in e) ? {
    booleanValue: false
  } : ("integerValue" in e) || ("doubleValue" in e) ? {
    doubleValue: NaN
  } : ("timestampValue" in e) ? {
    timestampValue: {
      seconds: Number.MIN_SAFE_INTEGER
    }
  } : ("stringValue" in e) ? {
    stringValue: ""
  } : ("bytesValue" in e) ? {
    bytesValue: ""
  } : ("referenceValue" in e) ? __PRIVATE_refValue(DatabaseId.empty(), DocumentKey.empty()) : ("geoPointValue" in e) ? {
    geoPointValue: {
      latitude: -90,
      longitude: -180
    }
  } : ("arrayValue" in e) ? {
    arrayValue: {}
  } : ("mapValue" in e) ? {
    mapValue: {}
  } : fail();
};
var __PRIVATE_valuesGetUpperBound = function(e) {
  return "nullValue" in e ? {
    booleanValue: false
  } : ("booleanValue" in e) ? {
    doubleValue: NaN
  } : ("integerValue" in e) || ("doubleValue" in e) ? {
    timestampValue: {
      seconds: Number.MIN_SAFE_INTEGER
    }
  } : ("timestampValue" in e) ? {
    stringValue: ""
  } : ("stringValue" in e) ? {
    bytesValue: ""
  } : ("bytesValue" in e) ? __PRIVATE_refValue(DatabaseId.empty(), DocumentKey.empty()) : ("referenceValue" in e) ? {
    geoPointValue: {
      latitude: -90,
      longitude: -180
    }
  } : ("geoPointValue" in e) ? {
    arrayValue: {}
  } : ("arrayValue" in e) ? {
    mapValue: {}
  } : ("mapValue" in e) ? re : fail();
};
var __PRIVATE_lowerBoundCompare = function(e, t) {
  const n = __PRIVATE_valueCompare(e.value, t.value);
  return n !== 0 ? n : e.inclusive && !t.inclusive ? -1 : !e.inclusive && t.inclusive ? 1 : 0;
};
var __PRIVATE_upperBoundCompare = function(e, t) {
  const n = __PRIVATE_valueCompare(e.value, t.value);
  return n !== 0 ? n : e.inclusive && !t.inclusive ? 1 : !e.inclusive && t.inclusive ? -1 : 0;
};
var __PRIVATE_boundCompareToDocument = function(e, t, n) {
  let r2 = 0;
  for (let i = 0;i < e.position.length; i++) {
    const s = t[i], o = e.position[i];
    if (s.field.isKeyField())
      r2 = DocumentKey.comparator(DocumentKey.fromName(o.referenceValue), n.key);
    else {
      r2 = __PRIVATE_valueCompare(o, n.data.field(s.field));
    }
    if (s.dir === "desc" && (r2 *= -1), r2 !== 0)
      break;
  }
  return r2;
};
var __PRIVATE_boundEquals = function(e, t) {
  if (e === null)
    return t === null;
  if (t === null)
    return false;
  if (e.inclusive !== t.inclusive || e.position.length !== t.position.length)
    return false;
  for (let n = 0;n < e.position.length; n++) {
    if (!__PRIVATE_valueEquals(e.position[n], t.position[n]))
      return false;
  }
  return true;
};
var __PRIVATE_orderByEquals = function(e, t) {
  return e.dir === t.dir && e.field.isEqual(t.field);
};
var __PRIVATE_compositeFilterIsConjunction = function(e) {
  return e.op === "and";
};
var __PRIVATE_compositeFilterIsDisjunction = function(e) {
  return e.op === "or";
};
var __PRIVATE_compositeFilterIsFlatConjunction = function(e) {
  return __PRIVATE_compositeFilterIsFlat(e) && __PRIVATE_compositeFilterIsConjunction(e);
};
var __PRIVATE_compositeFilterIsFlat = function(e) {
  for (const t of e.filters)
    if (t instanceof CompositeFilter)
      return false;
  return true;
};
var __PRIVATE_canonifyFilter = function(e) {
  if (e instanceof FieldFilter)
    return e.field.canonicalString() + e.op.toString() + canonicalId(e.value);
  if (__PRIVATE_compositeFilterIsFlatConjunction(e))
    return e.filters.map((e2) => __PRIVATE_canonifyFilter(e2)).join(",");
  {
    const t = e.filters.map((e2) => __PRIVATE_canonifyFilter(e2)).join(",");
    return `${e.op}(${t})`;
  }
};
var __PRIVATE_filterEquals = function(e, t) {
  return e instanceof FieldFilter ? function __PRIVATE_fieldFilterEquals(e2, t2) {
    return t2 instanceof FieldFilter && e2.op === t2.op && e2.field.isEqual(t2.field) && __PRIVATE_valueEquals(e2.value, t2.value);
  }(e, t) : e instanceof CompositeFilter ? function __PRIVATE_compositeFilterEquals(e2, t2) {
    if (t2 instanceof CompositeFilter && e2.op === t2.op && e2.filters.length === t2.filters.length) {
      return e2.filters.reduce((e3, n, r2) => e3 && __PRIVATE_filterEquals(n, t2.filters[r2]), true);
    }
    return false;
  }(e, t) : void fail();
};
var __PRIVATE_compositeFilterWithAddedFilters = function(e, t) {
  const n = e.filters.concat(t);
  return CompositeFilter.create(n, e.op);
};
var __PRIVATE_stringifyFilter = function(e) {
  return e instanceof FieldFilter ? function __PRIVATE_stringifyFieldFilter(e2) {
    return `${e2.field.canonicalString()} ${e2.op} ${canonicalId(e2.value)}`;
  }(e) : e instanceof CompositeFilter ? function __PRIVATE_stringifyCompositeFilter(e2) {
    return e2.op.toString() + " {" + e2.getFilters().map(__PRIVATE_stringifyFilter).join(" ,") + "}";
  }(e) : "Filter";
};
var __PRIVATE_extractDocumentKeysFromArrayValue = function(e, t) {
  var n;
  return (((n = t.arrayValue) === null || n === undefined ? undefined : n.values) || []).map((e2) => DocumentKey.fromName(e2.referenceValue));
};
var __PRIVATE_newTarget = function(e, t = null, n = [], r2 = [], i = null, s = null, o = null) {
  return new __PRIVATE_TargetImpl(e, t, n, r2, i, s, o);
};
var __PRIVATE_canonifyTarget = function(e) {
  const t = __PRIVATE_debugCast(e);
  if (t.ue === null) {
    let e2 = t.path.canonicalString();
    t.collectionGroup !== null && (e2 += "|cg:" + t.collectionGroup), e2 += "|f:", e2 += t.filters.map((e3) => __PRIVATE_canonifyFilter(e3)).join(","), e2 += "|ob:", e2 += t.orderBy.map((e3) => function __PRIVATE_canonifyOrderBy(e4) {
      return e4.field.canonicalString() + e4.dir;
    }(e3)).join(","), __PRIVATE_isNullOrUndefined(t.limit) || (e2 += "|l:", e2 += t.limit), t.startAt && (e2 += "|lb:", e2 += t.startAt.inclusive ? "b:" : "a:", e2 += t.startAt.position.map((e3) => canonicalId(e3)).join(",")), t.endAt && (e2 += "|ub:", e2 += t.endAt.inclusive ? "a:" : "b:", e2 += t.endAt.position.map((e3) => canonicalId(e3)).join(",")), t.ue = e2;
  }
  return t.ue;
};
var __PRIVATE_targetEquals = function(e, t) {
  if (e.limit !== t.limit)
    return false;
  if (e.orderBy.length !== t.orderBy.length)
    return false;
  for (let n = 0;n < e.orderBy.length; n++)
    if (!__PRIVATE_orderByEquals(e.orderBy[n], t.orderBy[n]))
      return false;
  if (e.filters.length !== t.filters.length)
    return false;
  for (let n = 0;n < e.filters.length; n++)
    if (!__PRIVATE_filterEquals(e.filters[n], t.filters[n]))
      return false;
  return e.collectionGroup === t.collectionGroup && (!!e.path.isEqual(t.path) && (!!__PRIVATE_boundEquals(e.startAt, t.startAt) && __PRIVATE_boundEquals(e.endAt, t.endAt)));
};
var __PRIVATE_targetIsDocumentTarget = function(e) {
  return DocumentKey.isDocumentKey(e.path) && e.collectionGroup === null && e.filters.length === 0;
};
var __PRIVATE_targetGetFieldFiltersForPath = function(e, t) {
  return e.filters.filter((e2) => e2 instanceof FieldFilter && e2.field.isEqual(t));
};
var __PRIVATE_targetGetAscendingBound = function(e, t, n) {
  let r2 = ie, i = true;
  for (const n2 of __PRIVATE_targetGetFieldFiltersForPath(e, t)) {
    let e2 = ie, t2 = true;
    switch (n2.op) {
      case "<":
      case "<=":
        e2 = __PRIVATE_valuesGetLowerBound(n2.value);
        break;
      case "==":
      case "in":
      case ">=":
        e2 = n2.value;
        break;
      case ">":
        e2 = n2.value, t2 = false;
        break;
      case "!=":
      case "not-in":
        e2 = ie;
    }
    __PRIVATE_lowerBoundCompare({
      value: r2,
      inclusive: i
    }, {
      value: e2,
      inclusive: t2
    }) < 0 && (r2 = e2, i = t2);
  }
  if (n !== null)
    for (let s = 0;s < e.orderBy.length; ++s) {
      if (e.orderBy[s].field.isEqual(t)) {
        const e2 = n.position[s];
        __PRIVATE_lowerBoundCompare({
          value: r2,
          inclusive: i
        }, {
          value: e2,
          inclusive: n.inclusive
        }) < 0 && (r2 = e2, i = n.inclusive);
        break;
      }
    }
  return {
    value: r2,
    inclusive: i
  };
};
var __PRIVATE_targetGetDescendingBound = function(e, t, n) {
  let r2 = re, i = true;
  for (const n2 of __PRIVATE_targetGetFieldFiltersForPath(e, t)) {
    let e2 = re, t2 = true;
    switch (n2.op) {
      case ">=":
      case ">":
        e2 = __PRIVATE_valuesGetUpperBound(n2.value), t2 = false;
        break;
      case "==":
      case "in":
      case "<=":
        e2 = n2.value;
        break;
      case "<":
        e2 = n2.value, t2 = false;
        break;
      case "!=":
      case "not-in":
        e2 = re;
    }
    __PRIVATE_upperBoundCompare({
      value: r2,
      inclusive: i
    }, {
      value: e2,
      inclusive: t2
    }) > 0 && (r2 = e2, i = t2);
  }
  if (n !== null)
    for (let s = 0;s < e.orderBy.length; ++s) {
      if (e.orderBy[s].field.isEqual(t)) {
        const e2 = n.position[s];
        __PRIVATE_upperBoundCompare({
          value: r2,
          inclusive: i
        }, {
          value: e2,
          inclusive: n.inclusive
        }) > 0 && (r2 = e2, i = n.inclusive);
        break;
      }
    }
  return {
    value: r2,
    inclusive: i
  };
};
var __PRIVATE_newQuery = function(e, t, n, r2, i, s, o, _) {
  return new __PRIVATE_QueryImpl(e, t, n, r2, i, s, o, _);
};
var __PRIVATE_newQueryForPath = function(e) {
  return new __PRIVATE_QueryImpl(e);
};
var __PRIVATE_queryMatchesAllDocuments = function(e) {
  return e.filters.length === 0 && e.limit === null && e.startAt == null && e.endAt == null && (e.explicitOrderBy.length === 0 || e.explicitOrderBy.length === 1 && e.explicitOrderBy[0].field.isKeyField());
};
var __PRIVATE_isCollectionGroupQuery = function(e) {
  return e.collectionGroup !== null;
};
var __PRIVATE_queryNormalizedOrderBy = function(e) {
  const t = __PRIVATE_debugCast(e);
  if (t.ce === null) {
    t.ce = [];
    const e2 = new Set;
    for (const n2 of t.explicitOrderBy)
      t.ce.push(n2), e2.add(n2.field.canonicalString());
    const n = t.explicitOrderBy.length > 0 ? t.explicitOrderBy[t.explicitOrderBy.length - 1].dir : "asc", r2 = function __PRIVATE_getInequalityFilterFields(e3) {
      let t2 = new SortedSet(FieldPath$1.comparator);
      return e3.filters.forEach((e4) => {
        e4.getFlattenedFilters().forEach((e5) => {
          e5.isInequality() && (t2 = t2.add(e5.field));
        });
      }), t2;
    }(t);
    r2.forEach((r3) => {
      e2.has(r3.canonicalString()) || r3.isKeyField() || t.ce.push(new OrderBy(r3, n));
    }), e2.has(FieldPath$1.keyField().canonicalString()) || t.ce.push(new OrderBy(FieldPath$1.keyField(), n));
  }
  return t.ce;
};
var __PRIVATE_queryToTarget = function(e) {
  const t = __PRIVATE_debugCast(e);
  return t.le || (t.le = __PRIVATE__queryToTarget(t, __PRIVATE_queryNormalizedOrderBy(e))), t.le;
};
var __PRIVATE__queryToTarget = function(e, t) {
  if (e.limitType === "F")
    return __PRIVATE_newTarget(e.path, e.collectionGroup, t, e.filters, e.limit, e.startAt, e.endAt);
  {
    t = t.map((e2) => {
      const t2 = e2.dir === "desc" ? "asc" : "desc";
      return new OrderBy(e2.field, t2);
    });
    const n = e.endAt ? new Bound(e.endAt.position, e.endAt.inclusive) : null, r2 = e.startAt ? new Bound(e.startAt.position, e.startAt.inclusive) : null;
    return __PRIVATE_newTarget(e.path, e.collectionGroup, t, e.filters, e.limit, n, r2);
  }
};
var __PRIVATE_queryWithLimit = function(e, t, n) {
  return new __PRIVATE_QueryImpl(e.path, e.collectionGroup, e.explicitOrderBy.slice(), e.filters.slice(), t, n, e.startAt, e.endAt);
};
var __PRIVATE_queryEquals = function(e, t) {
  return __PRIVATE_targetEquals(__PRIVATE_queryToTarget(e), __PRIVATE_queryToTarget(t)) && e.limitType === t.limitType;
};
var __PRIVATE_canonifyQuery = function(e) {
  return `${__PRIVATE_canonifyTarget(__PRIVATE_queryToTarget(e))}|lt:${e.limitType}`;
};
var __PRIVATE_stringifyQuery = function(e) {
  return `Query(target=${function __PRIVATE_stringifyTarget(e2) {
    let t = e2.path.canonicalString();
    return e2.collectionGroup !== null && (t += " collectionGroup=" + e2.collectionGroup), e2.filters.length > 0 && (t += `, filters: [${e2.filters.map((e3) => __PRIVATE_stringifyFilter(e3)).join(", ")}]`), __PRIVATE_isNullOrUndefined(e2.limit) || (t += ", limit: " + e2.limit), e2.orderBy.length > 0 && (t += `, orderBy: [${e2.orderBy.map((e3) => function __PRIVATE_stringifyOrderBy(e4) {
      return `${e4.field.canonicalString()} (${e4.dir})`;
    }(e3)).join(", ")}]`), e2.startAt && (t += ", startAt: ", t += e2.startAt.inclusive ? "b:" : "a:", t += e2.startAt.position.map((e3) => canonicalId(e3)).join(",")), e2.endAt && (t += ", endAt: ", t += e2.endAt.inclusive ? "a:" : "b:", t += e2.endAt.position.map((e3) => canonicalId(e3)).join(",")), `Target(${t})`;
  }(__PRIVATE_queryToTarget(e))}; limitType=${e.limitType})`;
};
var __PRIVATE_queryMatches = function(e, t) {
  return t.isFoundDocument() && function __PRIVATE_queryMatchesPathAndCollectionGroup(e2, t2) {
    const n = t2.key.path;
    return e2.collectionGroup !== null ? t2.key.hasCollectionId(e2.collectionGroup) && e2.path.isPrefixOf(n) : DocumentKey.isDocumentKey(e2.path) ? e2.path.isEqual(n) : e2.path.isImmediateParentOf(n);
  }(e, t) && function __PRIVATE_queryMatchesOrderBy(e2, t2) {
    for (const n of __PRIVATE_queryNormalizedOrderBy(e2))
      if (!n.field.isKeyField() && t2.data.field(n.field) === null)
        return false;
    return true;
  }(e, t) && function __PRIVATE_queryMatchesFilters(e2, t2) {
    for (const n of e2.filters)
      if (!n.matches(t2))
        return false;
    return true;
  }(e, t) && function __PRIVATE_queryMatchesBounds(e2, t2) {
    if (e2.startAt && !function __PRIVATE_boundSortsBeforeDocument(e3, t3, n) {
      const r2 = __PRIVATE_boundCompareToDocument(e3, t3, n);
      return e3.inclusive ? r2 <= 0 : r2 < 0;
    }(e2.startAt, __PRIVATE_queryNormalizedOrderBy(e2), t2))
      return false;
    if (e2.endAt && !function __PRIVATE_boundSortsAfterDocument(e3, t3, n) {
      const r2 = __PRIVATE_boundCompareToDocument(e3, t3, n);
      return e3.inclusive ? r2 >= 0 : r2 > 0;
    }(e2.endAt, __PRIVATE_queryNormalizedOrderBy(e2), t2))
      return false;
    return true;
  }(e, t);
};
var __PRIVATE_queryCollectionGroup = function(e) {
  return e.collectionGroup || (e.path.length % 2 == 1 ? e.path.lastSegment() : e.path.get(e.path.length - 2));
};
var __PRIVATE_newQueryComparator = function(e) {
  return (t, n) => {
    let r2 = false;
    for (const i of __PRIVATE_queryNormalizedOrderBy(e)) {
      const e2 = __PRIVATE_compareDocs(i, t, n);
      if (e2 !== 0)
        return e2;
      r2 = r2 || i.field.isKeyField();
    }
    return 0;
  };
};
var __PRIVATE_compareDocs = function(e, t, n) {
  const r2 = e.field.isKeyField() ? DocumentKey.comparator(t.key, n.key) : function __PRIVATE_compareDocumentsByField(e2, t2, n2) {
    const r3 = t2.data.field(e2), i = n2.data.field(e2);
    return r3 !== null && i !== null ? __PRIVATE_valueCompare(r3, i) : fail();
  }(e.field, t, n);
  switch (e.dir) {
    case "asc":
      return r2;
    case "desc":
      return -1 * r2;
    default:
      return fail();
  }
};
var __PRIVATE_mutableDocumentMap = function() {
  return se;
};
var documentMap = function(...e) {
  let t = oe;
  for (const n of e)
    t = t.insert(n.key, n);
  return t;
};
var __PRIVATE_convertOverlayedDocumentMapToDocumentMap = function(e) {
  let t = oe;
  return e.forEach((e2, n) => t = t.insert(e2, n.overlayedDocument)), t;
};
var __PRIVATE_newOverlayMap = function() {
  return __PRIVATE_newDocumentKeyMap();
};
var __PRIVATE_newMutationMap = function() {
  return __PRIVATE_newDocumentKeyMap();
};
var __PRIVATE_newDocumentKeyMap = function() {
  return new ObjectMap((e) => e.toString(), (e, t) => e.isEqual(t));
};
var __PRIVATE_documentKeySet = function(...e) {
  let t = ae2;
  for (const n of e)
    t = t.add(n);
  return t;
};
var __PRIVATE_targetIdSet = function() {
  return ue;
};
var __PRIVATE_toDouble = function(e, t) {
  if (e.useProto3Json) {
    if (isNaN(t))
      return {
        doubleValue: "NaN"
      };
    if (t === 1 / 0)
      return {
        doubleValue: "Infinity"
      };
    if (t === -1 / 0)
      return {
        doubleValue: "-Infinity"
      };
  }
  return {
    doubleValue: __PRIVATE_isNegativeZero(t) ? "-0" : t
  };
};
var __PRIVATE_toInteger = function(e) {
  return {
    integerValue: "" + e
  };
};
var __PRIVATE_applyTransformOperationToLocalView = function(e, t, n) {
  return e instanceof __PRIVATE_ServerTimestampTransform ? function serverTimestamp$1(e2, t2) {
    const n2 = {
      fields: {
        __type__: {
          stringValue: "server_timestamp"
        },
        __local_write_time__: {
          timestampValue: {
            seconds: e2.seconds,
            nanos: e2.nanoseconds
          }
        }
      }
    };
    return t2 && __PRIVATE_isServerTimestamp(t2) && (t2 = __PRIVATE_getPreviousValue(t2)), t2 && (n2.fields.__previous_value__ = t2), {
      mapValue: n2
    };
  }(n, t) : e instanceof __PRIVATE_ArrayUnionTransformOperation ? __PRIVATE_applyArrayUnionTransformOperation(e, t) : e instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_applyArrayRemoveTransformOperation(e, t) : function __PRIVATE_applyNumericIncrementTransformOperationToLocalView(e2, t2) {
    const n2 = __PRIVATE_computeTransformOperationBaseValue(e2, t2), r2 = asNumber(n2) + asNumber(e2.Pe);
    return isInteger(n2) && isInteger(e2.Pe) ? __PRIVATE_toInteger(r2) : __PRIVATE_toDouble(e2.serializer, r2);
  }(e, t);
};
var __PRIVATE_applyTransformOperationToRemoteDocument = function(e, t, n) {
  return e instanceof __PRIVATE_ArrayUnionTransformOperation ? __PRIVATE_applyArrayUnionTransformOperation(e, t) : e instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_applyArrayRemoveTransformOperation(e, t) : n;
};
var __PRIVATE_computeTransformOperationBaseValue = function(e, t) {
  return e instanceof __PRIVATE_NumericIncrementTransformOperation ? function __PRIVATE_isNumber(e2) {
    return isInteger(e2) || function __PRIVATE_isDouble(e3) {
      return !!e3 && "doubleValue" in e3;
    }(e2);
  }(t) ? t : {
    integerValue: 0
  } : null;
};
var __PRIVATE_applyArrayUnionTransformOperation = function(e, t) {
  const n = __PRIVATE_coercedFieldValuesArray(t);
  for (const t2 of e.elements)
    n.some((e2) => __PRIVATE_valueEquals(e2, t2)) || n.push(t2);
  return {
    arrayValue: {
      values: n
    }
  };
};
var __PRIVATE_applyArrayRemoveTransformOperation = function(e, t) {
  let n = __PRIVATE_coercedFieldValuesArray(t);
  for (const t2 of e.elements)
    n = n.filter((e2) => !__PRIVATE_valueEquals(e2, t2));
  return {
    arrayValue: {
      values: n
    }
  };
};
var asNumber = function(e) {
  return __PRIVATE_normalizeNumber(e.integerValue || e.doubleValue);
};
var __PRIVATE_coercedFieldValuesArray = function(e) {
  return isArray(e) && e.arrayValue.values ? e.arrayValue.values.slice() : [];
};
var __PRIVATE_fieldTransformEquals = function(e, t) {
  return e.field.isEqual(t.field) && function __PRIVATE_transformOperationEquals(e2, t2) {
    return e2 instanceof __PRIVATE_ArrayUnionTransformOperation && t2 instanceof __PRIVATE_ArrayUnionTransformOperation || e2 instanceof __PRIVATE_ArrayRemoveTransformOperation && t2 instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_arrayEquals(e2.elements, t2.elements, __PRIVATE_valueEquals) : e2 instanceof __PRIVATE_NumericIncrementTransformOperation && t2 instanceof __PRIVATE_NumericIncrementTransformOperation ? __PRIVATE_valueEquals(e2.Pe, t2.Pe) : e2 instanceof __PRIVATE_ServerTimestampTransform && t2 instanceof __PRIVATE_ServerTimestampTransform;
  }(e.transform, t.transform);
};
var __PRIVATE_preconditionIsValidForDocument = function(e, t) {
  return e.updateTime !== undefined ? t.isFoundDocument() && t.version.isEqual(e.updateTime) : e.exists === undefined || e.exists === t.isFoundDocument();
};
var __PRIVATE_calculateOverlayMutation = function(e, t) {
  if (!e.hasLocalMutations || t && t.fields.length === 0)
    return null;
  if (t === null)
    return e.isNoDocument() ? new __PRIVATE_DeleteMutation(e.key, Precondition.none()) : new __PRIVATE_SetMutation(e.key, e.data, Precondition.none());
  {
    const n = e.data, r2 = ObjectValue.empty();
    let i = new SortedSet(FieldPath$1.comparator);
    for (let e2 of t.fields)
      if (!i.has(e2)) {
        let t2 = n.field(e2);
        t2 === null && e2.length > 1 && (e2 = e2.popLast(), t2 = n.field(e2)), t2 === null ? r2.delete(e2) : r2.set(e2, t2), i = i.add(e2);
      }
    return new __PRIVATE_PatchMutation(e.key, r2, new FieldMask(i.toArray()), Precondition.none());
  }
};
var __PRIVATE_mutationApplyToRemoteDocument = function(e, t, n) {
  e instanceof __PRIVATE_SetMutation ? function __PRIVATE_setMutationApplyToRemoteDocument(e2, t2, n2) {
    const r2 = e2.value.clone(), i = __PRIVATE_serverTransformResults(e2.fieldTransforms, t2, n2.transformResults);
    r2.setAll(i), t2.convertToFoundDocument(n2.version, r2).setHasCommittedMutations();
  }(e, t, n) : e instanceof __PRIVATE_PatchMutation ? function __PRIVATE_patchMutationApplyToRemoteDocument(e2, t2, n2) {
    if (!__PRIVATE_preconditionIsValidForDocument(e2.precondition, t2))
      return void t2.convertToUnknownDocument(n2.version);
    const r2 = __PRIVATE_serverTransformResults(e2.fieldTransforms, t2, n2.transformResults), i = t2.data;
    i.setAll(__PRIVATE_getPatch(e2)), i.setAll(r2), t2.convertToFoundDocument(n2.version, i).setHasCommittedMutations();
  }(e, t, n) : function __PRIVATE_deleteMutationApplyToRemoteDocument(e2, t2, n2) {
    t2.convertToNoDocument(n2.version).setHasCommittedMutations();
  }(0, t, n);
};
var __PRIVATE_mutationApplyToLocalView = function(e, t, n, r2) {
  return e instanceof __PRIVATE_SetMutation ? function __PRIVATE_setMutationApplyToLocalView(e2, t2, n2, r3) {
    if (!__PRIVATE_preconditionIsValidForDocument(e2.precondition, t2))
      return n2;
    const i = e2.value.clone(), s = __PRIVATE_localTransformResults(e2.fieldTransforms, r3, t2);
    return i.setAll(s), t2.convertToFoundDocument(t2.version, i).setHasLocalMutations(), null;
  }(e, t, n, r2) : e instanceof __PRIVATE_PatchMutation ? function __PRIVATE_patchMutationApplyToLocalView(e2, t2, n2, r3) {
    if (!__PRIVATE_preconditionIsValidForDocument(e2.precondition, t2))
      return n2;
    const i = __PRIVATE_localTransformResults(e2.fieldTransforms, r3, t2), s = t2.data;
    if (s.setAll(__PRIVATE_getPatch(e2)), s.setAll(i), t2.convertToFoundDocument(t2.version, s).setHasLocalMutations(), n2 === null)
      return null;
    return n2.unionWith(e2.fieldMask.fields).unionWith(e2.fieldTransforms.map((e3) => e3.field));
  }(e, t, n, r2) : function __PRIVATE_deleteMutationApplyToLocalView(e2, t2, n2) {
    if (__PRIVATE_preconditionIsValidForDocument(e2.precondition, t2))
      return t2.convertToNoDocument(t2.version).setHasLocalMutations(), null;
    return n2;
  }(e, t, n);
};
var __PRIVATE_mutationEquals = function(e, t) {
  return e.type === t.type && (!!e.key.isEqual(t.key) && (!!e.precondition.isEqual(t.precondition) && (!!function __PRIVATE_fieldTransformsAreEqual(e2, t2) {
    return e2 === undefined && t2 === undefined || !(!e2 || !t2) && __PRIVATE_arrayEquals(e2, t2, (e3, t3) => __PRIVATE_fieldTransformEquals(e3, t3));
  }(e.fieldTransforms, t.fieldTransforms) && (e.type === 0 ? e.value.isEqual(t.value) : e.type !== 1 || e.data.isEqual(t.data) && e.fieldMask.isEqual(t.fieldMask)))));
};
var __PRIVATE_getPatch = function(e) {
  const t = new Map;
  return e.fieldMask.fields.forEach((n) => {
    if (!n.isEmpty()) {
      const r2 = e.data.field(n);
      t.set(n, r2);
    }
  }), t;
};
var __PRIVATE_serverTransformResults = function(e, t, n) {
  const r2 = new Map;
  __PRIVATE_hardAssert(e.length === n.length);
  for (let i = 0;i < n.length; i++) {
    const s = e[i], o = s.transform, _ = t.data.field(s.field);
    r2.set(s.field, __PRIVATE_applyTransformOperationToRemoteDocument(o, _, n[i]));
  }
  return r2;
};
var __PRIVATE_localTransformResults = function(e, t, n) {
  const r2 = new Map;
  for (const i of e) {
    const e2 = i.transform, s = n.data.field(i.field);
    r2.set(i.field, __PRIVATE_applyTransformOperationToLocalView(e2, s, t));
  }
  return r2;
};
var __PRIVATE_isPermanentError = function(e) {
  switch (e) {
    default:
      return fail();
    case C2.CANCELLED:
    case C2.UNKNOWN:
    case C2.DEADLINE_EXCEEDED:
    case C2.RESOURCE_EXHAUSTED:
    case C2.INTERNAL:
    case C2.UNAVAILABLE:
    case C2.UNAUTHENTICATED:
      return false;
    case C2.INVALID_ARGUMENT:
    case C2.NOT_FOUND:
    case C2.ALREADY_EXISTS:
    case C2.PERMISSION_DENIED:
    case C2.FAILED_PRECONDITION:
    case C2.ABORTED:
    case C2.OUT_OF_RANGE:
    case C2.UNIMPLEMENTED:
    case C2.DATA_LOSS:
      return true;
  }
};
var __PRIVATE_mapCodeFromRpcCode = function(e) {
  if (e === undefined)
    return __PRIVATE_logError("GRPC error has no .code"), C2.UNKNOWN;
  switch (e) {
    case ce.OK:
      return C2.OK;
    case ce.CANCELLED:
      return C2.CANCELLED;
    case ce.UNKNOWN:
      return C2.UNKNOWN;
    case ce.DEADLINE_EXCEEDED:
      return C2.DEADLINE_EXCEEDED;
    case ce.RESOURCE_EXHAUSTED:
      return C2.RESOURCE_EXHAUSTED;
    case ce.INTERNAL:
      return C2.INTERNAL;
    case ce.UNAVAILABLE:
      return C2.UNAVAILABLE;
    case ce.UNAUTHENTICATED:
      return C2.UNAUTHENTICATED;
    case ce.INVALID_ARGUMENT:
      return C2.INVALID_ARGUMENT;
    case ce.NOT_FOUND:
      return C2.NOT_FOUND;
    case ce.ALREADY_EXISTS:
      return C2.ALREADY_EXISTS;
    case ce.PERMISSION_DENIED:
      return C2.PERMISSION_DENIED;
    case ce.FAILED_PRECONDITION:
      return C2.FAILED_PRECONDITION;
    case ce.ABORTED:
      return C2.ABORTED;
    case ce.OUT_OF_RANGE:
      return C2.OUT_OF_RANGE;
    case ce.UNIMPLEMENTED:
      return C2.UNIMPLEMENTED;
    case ce.DATA_LOSS:
      return C2.DATA_LOSS;
    default:
      return fail();
  }
};
var __PRIVATE_newTextEncoder = function() {
  return new TextEncoder;
};
var __PRIVATE_getMd5HashValue = function(e) {
  const t = __PRIVATE_newTextEncoder().encode(e), n = new Md5;
  return n.update(t), new Uint8Array(n.digest());
};
var __PRIVATE_get64BitUints = function(e) {
  const t = new DataView(e.buffer), n = t.getUint32(0, true), r2 = t.getUint32(4, true), i = t.getUint32(8, true), s = t.getUint32(12, true);
  return [new Integer([n, r2], 0), new Integer([i, s], 0)];
};
var __PRIVATE_documentTargetMap = function() {
  return new SortedMap(DocumentKey.comparator);
};
var __PRIVATE_snapshotChangesMap = function() {
  return new SortedMap(DocumentKey.comparator);
};
var __PRIVATE_toInt32Proto = function(e, t) {
  return e.useProto3Json || __PRIVATE_isNullOrUndefined(t) ? t : {
    value: t
  };
};
var toTimestamp = function(e, t) {
  if (e.useProto3Json) {
    return `${new Date(1000 * t.seconds).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + t.nanoseconds).slice(-9)}Z`;
  }
  return {
    seconds: "" + t.seconds,
    nanos: t.nanoseconds
  };
};
var __PRIVATE_toBytes = function(e, t) {
  return e.useProto3Json ? t.toBase64() : t.toUint8Array();
};
var __PRIVATE_toVersion = function(e, t) {
  return toTimestamp(e, t.toTimestamp());
};
var __PRIVATE_fromVersion = function(e) {
  return __PRIVATE_hardAssert(!!e), SnapshotVersion.fromTimestamp(function fromTimestamp(e2) {
    const t = __PRIVATE_normalizeTimestamp(e2);
    return new Timestamp(t.seconds, t.nanos);
  }(e));
};
var __PRIVATE_toResourceName = function(e, t) {
  return __PRIVATE_toResourcePath(e, t).canonicalString();
};
var __PRIVATE_toResourcePath = function(e, t) {
  const n = function __PRIVATE_fullyQualifiedPrefixPath(e2) {
    return new ResourcePath(["projects", e2.projectId, "databases", e2.database]);
  }(e).child("documents");
  return t === undefined ? n : n.child(t);
};
var __PRIVATE_fromResourceName = function(e) {
  const t = ResourcePath.fromString(e);
  return __PRIVATE_hardAssert(__PRIVATE_isValidResourceName(t)), t;
};
var __PRIVATE_toName = function(e, t) {
  return __PRIVATE_toResourceName(e.databaseId, t.path);
};
var fromName = function(e, t) {
  const n = __PRIVATE_fromResourceName(t);
  if (n.get(1) !== e.databaseId.projectId)
    throw new FirestoreError(C2.INVALID_ARGUMENT, "Tried to deserialize key from different project: " + n.get(1) + " vs " + e.databaseId.projectId);
  if (n.get(3) !== e.databaseId.database)
    throw new FirestoreError(C2.INVALID_ARGUMENT, "Tried to deserialize key from different database: " + n.get(3) + " vs " + e.databaseId.database);
  return new DocumentKey(__PRIVATE_extractLocalPathFromResourceName(n));
};
var __PRIVATE_toQueryPath = function(e, t) {
  return __PRIVATE_toResourceName(e.databaseId, t);
};
var __PRIVATE_fromQueryPath = function(e) {
  const t = __PRIVATE_fromResourceName(e);
  return t.length === 4 ? ResourcePath.emptyPath() : __PRIVATE_extractLocalPathFromResourceName(t);
};
var __PRIVATE_getEncodedDatabaseId = function(e) {
  return new ResourcePath(["projects", e.databaseId.projectId, "databases", e.databaseId.database]).canonicalString();
};
var __PRIVATE_extractLocalPathFromResourceName = function(e) {
  return __PRIVATE_hardAssert(e.length > 4 && e.get(4) === "documents"), e.popFirst(5);
};
var __PRIVATE_toMutationDocument = function(e, t, n) {
  return {
    name: __PRIVATE_toName(e, t),
    fields: n.value.mapValue.fields
  };
};
var __PRIVATE_fromDocument = function(e, t, n) {
  const r2 = fromName(e, t.name), i = __PRIVATE_fromVersion(t.updateTime), s = t.createTime ? __PRIVATE_fromVersion(t.createTime) : SnapshotVersion.min(), o = new ObjectValue({
    mapValue: {
      fields: t.fields
    }
  }), _ = MutableDocument.newFoundDocument(r2, i, s, o);
  return n && _.setHasCommittedMutations(), n ? _.setHasCommittedMutations() : _;
};
var __PRIVATE_fromWatchChange = function(e, t) {
  let n;
  if ("targetChange" in t) {
    t.targetChange;
    const r2 = function __PRIVATE_fromWatchTargetChangeState(e2) {
      return e2 === "NO_CHANGE" ? 0 : e2 === "ADD" ? 1 : e2 === "REMOVE" ? 2 : e2 === "CURRENT" ? 3 : e2 === "RESET" ? 4 : fail();
    }(t.targetChange.targetChangeType || "NO_CHANGE"), i = t.targetChange.targetIds || [], s = function __PRIVATE_fromBytes(e2, t2) {
      return e2.useProto3Json ? (__PRIVATE_hardAssert(t2 === undefined || typeof t2 == "string"), ByteString.fromBase64String(t2 || "")) : (__PRIVATE_hardAssert(t2 === undefined || t2 instanceof Buffer || t2 instanceof Uint8Array), ByteString.fromUint8Array(t2 || new Uint8Array));
    }(e, t.targetChange.resumeToken), o = t.targetChange.cause, _ = o && function __PRIVATE_fromRpcStatus(e2) {
      const t2 = e2.code === undefined ? C2.UNKNOWN : __PRIVATE_mapCodeFromRpcCode(e2.code);
      return new FirestoreError(t2, e2.message || "");
    }(o);
    n = new __PRIVATE_WatchTargetChange(r2, i, s, _ || null);
  } else if ("documentChange" in t) {
    t.documentChange;
    const r2 = t.documentChange;
    r2.document, r2.document.name, r2.document.updateTime;
    const i = fromName(e, r2.document.name), s = __PRIVATE_fromVersion(r2.document.updateTime), o = r2.document.createTime ? __PRIVATE_fromVersion(r2.document.createTime) : SnapshotVersion.min(), _ = new ObjectValue({
      mapValue: {
        fields: r2.document.fields
      }
    }), a = MutableDocument.newFoundDocument(i, s, o, _), u = r2.targetIds || [], c = r2.removedTargetIds || [];
    n = new __PRIVATE_DocumentWatchChange(u, c, a.key, a);
  } else if ("documentDelete" in t) {
    t.documentDelete;
    const r2 = t.documentDelete;
    r2.document;
    const i = fromName(e, r2.document), s = r2.readTime ? __PRIVATE_fromVersion(r2.readTime) : SnapshotVersion.min(), o = MutableDocument.newNoDocument(i, s), _ = r2.removedTargetIds || [];
    n = new __PRIVATE_DocumentWatchChange([], _, o.key, o);
  } else if ("documentRemove" in t) {
    t.documentRemove;
    const r2 = t.documentRemove;
    r2.document;
    const i = fromName(e, r2.document), s = r2.removedTargetIds || [];
    n = new __PRIVATE_DocumentWatchChange([], s, i, null);
  } else {
    if (!("filter" in t))
      return fail();
    {
      t.filter;
      const e2 = t.filter;
      e2.targetId;
      const { count: r2 = 0, unchangedNames: i } = e2, s = new ExistenceFilter(r2, i), o = e2.targetId;
      n = new __PRIVATE_ExistenceFilterChange(o, s);
    }
  }
  return n;
};
var toMutation = function(e, t) {
  let n;
  if (t instanceof __PRIVATE_SetMutation)
    n = {
      update: __PRIVATE_toMutationDocument(e, t.key, t.value)
    };
  else if (t instanceof __PRIVATE_DeleteMutation)
    n = {
      delete: __PRIVATE_toName(e, t.key)
    };
  else if (t instanceof __PRIVATE_PatchMutation)
    n = {
      update: __PRIVATE_toMutationDocument(e, t.key, t.data),
      updateMask: __PRIVATE_toDocumentMask(t.fieldMask)
    };
  else {
    if (!(t instanceof __PRIVATE_VerifyMutation))
      return fail();
    n = {
      verify: __PRIVATE_toName(e, t.key)
    };
  }
  return t.fieldTransforms.length > 0 && (n.updateTransforms = t.fieldTransforms.map((e2) => function __PRIVATE_toFieldTransform(e3, t2) {
    const n2 = t2.transform;
    if (n2 instanceof __PRIVATE_ServerTimestampTransform)
      return {
        fieldPath: t2.field.canonicalString(),
        setToServerValue: "REQUEST_TIME"
      };
    if (n2 instanceof __PRIVATE_ArrayUnionTransformOperation)
      return {
        fieldPath: t2.field.canonicalString(),
        appendMissingElements: {
          values: n2.elements
        }
      };
    if (n2 instanceof __PRIVATE_ArrayRemoveTransformOperation)
      return {
        fieldPath: t2.field.canonicalString(),
        removeAllFromArray: {
          values: n2.elements
        }
      };
    if (n2 instanceof __PRIVATE_NumericIncrementTransformOperation)
      return {
        fieldPath: t2.field.canonicalString(),
        increment: n2.Pe
      };
    throw fail();
  }(0, e2))), t.precondition.isNone || (n.currentDocument = function __PRIVATE_toPrecondition(e2, t2) {
    return t2.updateTime !== undefined ? {
      updateTime: __PRIVATE_toVersion(e2, t2.updateTime)
    } : t2.exists !== undefined ? {
      exists: t2.exists
    } : fail();
  }(e, t.precondition)), n;
};
var __PRIVATE_fromMutation = function(e, t) {
  const n = t.currentDocument ? function __PRIVATE_fromPrecondition(e2) {
    return e2.updateTime !== undefined ? Precondition.updateTime(__PRIVATE_fromVersion(e2.updateTime)) : e2.exists !== undefined ? Precondition.exists(e2.exists) : Precondition.none();
  }(t.currentDocument) : Precondition.none(), r2 = t.updateTransforms ? t.updateTransforms.map((t2) => function __PRIVATE_fromFieldTransform(e2, t3) {
    let n2 = null;
    if ("setToServerValue" in t3)
      __PRIVATE_hardAssert(t3.setToServerValue === "REQUEST_TIME"), n2 = new __PRIVATE_ServerTimestampTransform;
    else if ("appendMissingElements" in t3) {
      const e3 = t3.appendMissingElements.values || [];
      n2 = new __PRIVATE_ArrayUnionTransformOperation(e3);
    } else if ("removeAllFromArray" in t3) {
      const e3 = t3.removeAllFromArray.values || [];
      n2 = new __PRIVATE_ArrayRemoveTransformOperation(e3);
    } else
      "increment" in t3 ? n2 = new __PRIVATE_NumericIncrementTransformOperation(e2, t3.increment) : fail();
    const r3 = FieldPath$1.fromServerFormat(t3.fieldPath);
    return new FieldTransform(r3, n2);
  }(e, t2)) : [];
  if (t.update) {
    t.update.name;
    const i = fromName(e, t.update.name), s = new ObjectValue({
      mapValue: {
        fields: t.update.fields
      }
    });
    if (t.updateMask) {
      const e2 = function __PRIVATE_fromDocumentMask(e3) {
        const t2 = e3.fieldPaths || [];
        return new FieldMask(t2.map((e4) => FieldPath$1.fromServerFormat(e4)));
      }(t.updateMask);
      return new __PRIVATE_PatchMutation(i, s, e2, n, r2);
    }
    return new __PRIVATE_SetMutation(i, s, n, r2);
  }
  if (t.delete) {
    const r3 = fromName(e, t.delete);
    return new __PRIVATE_DeleteMutation(r3, n);
  }
  if (t.verify) {
    const r3 = fromName(e, t.verify);
    return new __PRIVATE_VerifyMutation(r3, n);
  }
  return fail();
};
var __PRIVATE_fromWriteResults = function(e, t) {
  return e && e.length > 0 ? (__PRIVATE_hardAssert(t !== undefined), e.map((e2) => function __PRIVATE_fromWriteResult(e3, t2) {
    let n = e3.updateTime ? __PRIVATE_fromVersion(e3.updateTime) : __PRIVATE_fromVersion(t2);
    return n.isEqual(SnapshotVersion.min()) && (n = __PRIVATE_fromVersion(t2)), new MutationResult(n, e3.transformResults || []);
  }(e2, t))) : [];
};
var __PRIVATE_toDocumentsTarget = function(e, t) {
  return {
    documents: [__PRIVATE_toQueryPath(e, t.path)]
  };
};
var __PRIVATE_toQueryTarget = function(e, t) {
  const n = {
    structuredQuery: {}
  }, r2 = t.path;
  let i;
  t.collectionGroup !== null ? (i = r2, n.structuredQuery.from = [{
    collectionId: t.collectionGroup,
    allDescendants: true
  }]) : (i = r2.popLast(), n.structuredQuery.from = [{
    collectionId: r2.lastSegment()
  }]), n.parent = __PRIVATE_toQueryPath(e, i);
  const s = function __PRIVATE_toFilters(e2) {
    if (e2.length === 0)
      return;
    return __PRIVATE_toFilter(CompositeFilter.create(e2, "and"));
  }(t.filters);
  s && (n.structuredQuery.where = s);
  const o = function __PRIVATE_toOrder(e2) {
    if (e2.length === 0)
      return;
    return e2.map((e3) => function __PRIVATE_toPropertyOrder(e4) {
      return {
        field: __PRIVATE_toFieldPathReference(e4.field),
        direction: __PRIVATE_toDirection(e4.dir)
      };
    }(e3));
  }(t.orderBy);
  o && (n.structuredQuery.orderBy = o);
  const _ = __PRIVATE_toInt32Proto(e, t.limit);
  return _ !== null && (n.structuredQuery.limit = _), t.startAt && (n.structuredQuery.startAt = function __PRIVATE_toStartAtCursor(e2) {
    return {
      before: e2.inclusive,
      values: e2.position
    };
  }(t.startAt)), t.endAt && (n.structuredQuery.endAt = function __PRIVATE_toEndAtCursor(e2) {
    return {
      before: !e2.inclusive,
      values: e2.position
    };
  }(t.endAt)), {
    _t: n,
    parent: i
  };
};
var __PRIVATE_convertQueryTargetToQuery = function(e) {
  let t = __PRIVATE_fromQueryPath(e.parent);
  const n = e.structuredQuery, r2 = n.from ? n.from.length : 0;
  let i = null;
  if (r2 > 0) {
    __PRIVATE_hardAssert(r2 === 1);
    const e2 = n.from[0];
    e2.allDescendants ? i = e2.collectionId : t = t.child(e2.collectionId);
  }
  let s = [];
  n.where && (s = function __PRIVATE_fromFilters(e2) {
    const t2 = __PRIVATE_fromFilter(e2);
    if (t2 instanceof CompositeFilter && __PRIVATE_compositeFilterIsFlatConjunction(t2))
      return t2.getFilters();
    return [t2];
  }(n.where));
  let o = [];
  n.orderBy && (o = function __PRIVATE_fromOrder(e2) {
    return e2.map((e3) => function __PRIVATE_fromPropertyOrder(e4) {
      return new OrderBy(__PRIVATE_fromFieldPathReference(e4.field), function __PRIVATE_fromDirection(e5) {
        switch (e5) {
          case "ASCENDING":
            return "asc";
          case "DESCENDING":
            return "desc";
          default:
            return;
        }
      }(e4.direction));
    }(e3));
  }(n.orderBy));
  let _ = null;
  n.limit && (_ = function __PRIVATE_fromInt32Proto(e2) {
    let t2;
    return t2 = typeof e2 == "object" ? e2.value : e2, __PRIVATE_isNullOrUndefined(t2) ? null : t2;
  }(n.limit));
  let a = null;
  n.startAt && (a = function __PRIVATE_fromStartAtCursor(e2) {
    const t2 = !!e2.before, n2 = e2.values || [];
    return new Bound(n2, t2);
  }(n.startAt));
  let u = null;
  return n.endAt && (u = function __PRIVATE_fromEndAtCursor(e2) {
    const t2 = !e2.before, n2 = e2.values || [];
    return new Bound(n2, t2);
  }(n.endAt)), __PRIVATE_newQuery(t, i, o, s, _, "F", a, u);
};
var __PRIVATE_toListenRequestLabels = function(e, t) {
  const n = function __PRIVATE_toLabel(e2) {
    switch (e2) {
      case "TargetPurposeListen":
        return null;
      case "TargetPurposeExistenceFilterMismatch":
        return "existence-filter-mismatch";
      case "TargetPurposeExistenceFilterMismatchBloom":
        return "existence-filter-mismatch-bloom";
      case "TargetPurposeLimboResolution":
        return "limbo-document";
      default:
        return fail();
    }
  }(t.purpose);
  return n == null ? null : {
    "goog-listen-tags": n
  };
};
var __PRIVATE_fromFilter = function(e) {
  return e.unaryFilter !== undefined ? function __PRIVATE_fromUnaryFilter(e2) {
    switch (e2.unaryFilter.op) {
      case "IS_NAN":
        const t = __PRIVATE_fromFieldPathReference(e2.unaryFilter.field);
        return FieldFilter.create(t, "==", {
          doubleValue: NaN
        });
      case "IS_NULL":
        const n = __PRIVATE_fromFieldPathReference(e2.unaryFilter.field);
        return FieldFilter.create(n, "==", {
          nullValue: "NULL_VALUE"
        });
      case "IS_NOT_NAN":
        const r2 = __PRIVATE_fromFieldPathReference(e2.unaryFilter.field);
        return FieldFilter.create(r2, "!=", {
          doubleValue: NaN
        });
      case "IS_NOT_NULL":
        const i = __PRIVATE_fromFieldPathReference(e2.unaryFilter.field);
        return FieldFilter.create(i, "!=", {
          nullValue: "NULL_VALUE"
        });
      default:
        return fail();
    }
  }(e) : e.fieldFilter !== undefined ? function __PRIVATE_fromFieldFilter(e2) {
    return FieldFilter.create(__PRIVATE_fromFieldPathReference(e2.fieldFilter.field), function __PRIVATE_fromOperatorName(e3) {
      switch (e3) {
        case "EQUAL":
          return "==";
        case "NOT_EQUAL":
          return "!=";
        case "GREATER_THAN":
          return ">";
        case "GREATER_THAN_OR_EQUAL":
          return ">=";
        case "LESS_THAN":
          return "<";
        case "LESS_THAN_OR_EQUAL":
          return "<=";
        case "ARRAY_CONTAINS":
          return "array-contains";
        case "IN":
          return "in";
        case "NOT_IN":
          return "not-in";
        case "ARRAY_CONTAINS_ANY":
          return "array-contains-any";
        default:
          return fail();
      }
    }(e2.fieldFilter.op), e2.fieldFilter.value);
  }(e) : e.compositeFilter !== undefined ? function __PRIVATE_fromCompositeFilter(e2) {
    return CompositeFilter.create(e2.compositeFilter.filters.map((e3) => __PRIVATE_fromFilter(e3)), function __PRIVATE_fromCompositeOperatorName(e3) {
      switch (e3) {
        case "AND":
          return "and";
        case "OR":
          return "or";
        default:
          return fail();
      }
    }(e2.compositeFilter.op));
  }(e) : fail();
};
var __PRIVATE_toDirection = function(e) {
  return Ie[e];
};
var __PRIVATE_toOperatorName = function(e) {
  return Te[e];
};
var __PRIVATE_toCompositeOperatorName = function(e) {
  return Ee[e];
};
var __PRIVATE_toFieldPathReference = function(e) {
  return {
    fieldPath: e.canonicalString()
  };
};
var __PRIVATE_fromFieldPathReference = function(e) {
  return FieldPath$1.fromServerFormat(e.fieldPath);
};
var __PRIVATE_toFilter = function(e) {
  return e instanceof FieldFilter ? function __PRIVATE_toUnaryOrFieldFilter(e2) {
    if (e2.op === "==") {
      if (__PRIVATE_isNanValue(e2.value))
        return {
          unaryFilter: {
            field: __PRIVATE_toFieldPathReference(e2.field),
            op: "IS_NAN"
          }
        };
      if (__PRIVATE_isNullValue(e2.value))
        return {
          unaryFilter: {
            field: __PRIVATE_toFieldPathReference(e2.field),
            op: "IS_NULL"
          }
        };
    } else if (e2.op === "!=") {
      if (__PRIVATE_isNanValue(e2.value))
        return {
          unaryFilter: {
            field: __PRIVATE_toFieldPathReference(e2.field),
            op: "IS_NOT_NAN"
          }
        };
      if (__PRIVATE_isNullValue(e2.value))
        return {
          unaryFilter: {
            field: __PRIVATE_toFieldPathReference(e2.field),
            op: "IS_NOT_NULL"
          }
        };
    }
    return {
      fieldFilter: {
        field: __PRIVATE_toFieldPathReference(e2.field),
        op: __PRIVATE_toOperatorName(e2.op),
        value: e2.value
      }
    };
  }(e) : e instanceof CompositeFilter ? function __PRIVATE_toCompositeFilter(e2) {
    const t = e2.getFilters().map((e3) => __PRIVATE_toFilter(e3));
    if (t.length === 1)
      return t[0];
    return {
      compositeFilter: {
        op: __PRIVATE_toCompositeOperatorName(e2.op),
        filters: t
      }
    };
  }(e) : fail();
};
var __PRIVATE_toDocumentMask = function(e) {
  const t = [];
  return e.fields.forEach((e2) => t.push(e2.canonicalString())), {
    fieldPaths: t
  };
};
var __PRIVATE_isValidResourceName = function(e) {
  return e.length >= 4 && e.get(0) === "projects" && e.get(2) === "databases";
};
var __PRIVATE_fromDbRemoteDocument = function(e, t) {
  let n;
  if (t.document)
    n = __PRIVATE_fromDocument(e.ut, t.document, !!t.hasCommittedMutations);
  else if (t.noDocument) {
    const e2 = DocumentKey.fromSegments(t.noDocument.path), r2 = __PRIVATE_fromDbTimestamp(t.noDocument.readTime);
    n = MutableDocument.newNoDocument(e2, r2), t.hasCommittedMutations && n.setHasCommittedMutations();
  } else {
    if (!t.unknownDocument)
      return fail();
    {
      const e2 = DocumentKey.fromSegments(t.unknownDocument.path), r2 = __PRIVATE_fromDbTimestamp(t.unknownDocument.version);
      n = MutableDocument.newUnknownDocument(e2, r2);
    }
  }
  return t.readTime && n.setReadTime(function __PRIVATE_fromDbTimestampKey(e2) {
    const t2 = new Timestamp(e2[0], e2[1]);
    return SnapshotVersion.fromTimestamp(t2);
  }(t.readTime)), n;
};
var __PRIVATE_toDbRemoteDocument = function(e, t) {
  const n = t.key, r2 = {
    prefixPath: n.getCollectionPath().popLast().toArray(),
    collectionGroup: n.collectionGroup,
    documentId: n.path.lastSegment(),
    readTime: __PRIVATE_toDbTimestampKey(t.readTime),
    hasCommittedMutations: t.hasCommittedMutations
  };
  if (t.isFoundDocument())
    r2.document = function __PRIVATE_toDocument(e2, t2) {
      return {
        name: __PRIVATE_toName(e2, t2.key),
        fields: t2.data.value.mapValue.fields,
        updateTime: toTimestamp(e2, t2.version.toTimestamp()),
        createTime: toTimestamp(e2, t2.createTime.toTimestamp())
      };
    }(e.ut, t);
  else if (t.isNoDocument())
    r2.noDocument = {
      path: n.path.toArray(),
      readTime: __PRIVATE_toDbTimestamp(t.version)
    };
  else {
    if (!t.isUnknownDocument())
      return fail();
    r2.unknownDocument = {
      path: n.path.toArray(),
      version: __PRIVATE_toDbTimestamp(t.version)
    };
  }
  return r2;
};
var __PRIVATE_toDbTimestampKey = function(e) {
  const t = e.toTimestamp();
  return [t.seconds, t.nanoseconds];
};
var __PRIVATE_toDbTimestamp = function(e) {
  const t = e.toTimestamp();
  return {
    seconds: t.seconds,
    nanoseconds: t.nanoseconds
  };
};
var __PRIVATE_fromDbTimestamp = function(e) {
  const t = new Timestamp(e.seconds, e.nanoseconds);
  return SnapshotVersion.fromTimestamp(t);
};
var __PRIVATE_fromDbMutationBatch = function(e, t) {
  const n = (t.baseMutations || []).map((t2) => __PRIVATE_fromMutation(e.ut, t2));
  for (let e2 = 0;e2 < t.mutations.length - 1; ++e2) {
    const n2 = t.mutations[e2];
    if (e2 + 1 < t.mutations.length && t.mutations[e2 + 1].transform !== undefined) {
      const r3 = t.mutations[e2 + 1];
      n2.updateTransforms = r3.transform.fieldTransforms, t.mutations.splice(e2 + 1, 1), ++e2;
    }
  }
  const r2 = t.mutations.map((t2) => __PRIVATE_fromMutation(e.ut, t2)), i = Timestamp.fromMillis(t.localWriteTimeMs);
  return new MutationBatch(t.batchId, i, n, r2);
};
var __PRIVATE_fromDbTarget = function(e) {
  const t = __PRIVATE_fromDbTimestamp(e.readTime), n = e.lastLimboFreeSnapshotVersion !== undefined ? __PRIVATE_fromDbTimestamp(e.lastLimboFreeSnapshotVersion) : SnapshotVersion.min();
  let r2;
  return r2 = function __PRIVATE_isDocumentQuery(e2) {
    return e2.documents !== undefined;
  }(e.query) ? function __PRIVATE_fromDocumentsTarget(e2) {
    return __PRIVATE_hardAssert(e2.documents.length === 1), __PRIVATE_queryToTarget(__PRIVATE_newQueryForPath(__PRIVATE_fromQueryPath(e2.documents[0])));
  }(e.query) : function __PRIVATE_fromQueryTarget(e2) {
    return __PRIVATE_queryToTarget(__PRIVATE_convertQueryTargetToQuery(e2));
  }(e.query), new TargetData(r2, e.targetId, "TargetPurposeListen", e.lastListenSequenceNumber, t, n, ByteString.fromBase64String(e.resumeToken));
};
var __PRIVATE_toDbTarget = function(e, t) {
  const n = __PRIVATE_toDbTimestamp(t.snapshotVersion), r2 = __PRIVATE_toDbTimestamp(t.lastLimboFreeSnapshotVersion);
  let i;
  i = __PRIVATE_targetIsDocumentTarget(t.target) ? __PRIVATE_toDocumentsTarget(e.ut, t.target) : __PRIVATE_toQueryTarget(e.ut, t.target)._t;
  const s = t.resumeToken.toBase64();
  return {
    targetId: t.targetId,
    canonicalId: __PRIVATE_canonifyTarget(t.target),
    readTime: n,
    resumeToken: s,
    lastListenSequenceNumber: t.sequenceNumber,
    lastLimboFreeSnapshotVersion: r2,
    query: i
  };
};
var __PRIVATE_fromBundledQuery = function(e) {
  const t = __PRIVATE_convertQueryTargetToQuery({
    parent: e.parent,
    structuredQuery: e.structuredQuery
  });
  return e.limitType === "LAST" ? __PRIVATE_queryWithLimit(t, t.limit, "L") : t;
};
var __PRIVATE_fromDbDocumentOverlay = function(e, t) {
  return new Overlay(t.largestBatchId, __PRIVATE_fromMutation(e.ut, t.overlayMutation));
};
var __PRIVATE_toDbDocumentOverlayKey = function(e, t) {
  const n = t.path.lastSegment();
  return [e, __PRIVATE_encodeResourcePath(t.path.popLast()), n];
};
var __PRIVATE_toDbIndexState = function(e, t, n, r2) {
  return {
    indexId: e,
    uid: t,
    sequenceNumber: n,
    readTime: __PRIVATE_toDbTimestamp(r2.readTime),
    documentKey: __PRIVATE_encodeResourcePath(r2.documentKey.path),
    largestBatchId: r2.largestBatchId
  };
};
var __PRIVATE_bundlesStore = function(e) {
  return __PRIVATE_getStore(e, "bundles");
};
var __PRIVATE_namedQueriesStore = function(e) {
  return __PRIVATE_getStore(e, "namedQueries");
};
var __PRIVATE_documentOverlayStore = function(e) {
  return __PRIVATE_getStore(e, "documentOverlays");
};
var __PRIVATE_numberOfLeadingZerosInByte = function(e) {
  if (e === 0)
    return 8;
  let t = 0;
  return e >> 4 == 0 && (t += 4, e <<= 4), e >> 6 == 0 && (t += 2, e <<= 2), e >> 7 == 0 && (t += 1), t;
};
var __PRIVATE_unsignedNumLength = function(e) {
  const t = 64 - function __PRIVATE_numberOfLeadingZeros(e2) {
    let t2 = 0;
    for (let n = 0;n < 8; ++n) {
      const r2 = __PRIVATE_numberOfLeadingZerosInByte(255 & e2[n]);
      if (t2 += r2, r2 !== 8)
        break;
    }
    return t2;
  }(e);
  return Math.ceil(t / 8);
};
var __PRIVATE_indexEntryComparator = function(e, t) {
  let n = e.indexId - t.indexId;
  return n !== 0 ? n : (n = __PRIVATE_compareByteArrays(e.arrayValue, t.arrayValue), n !== 0 ? n : (n = __PRIVATE_compareByteArrays(e.directionalValue, t.directionalValue), n !== 0 ? n : DocumentKey.comparator(e.documentKey, t.documentKey)));
};
var __PRIVATE_compareByteArrays = function(e, t) {
  for (let n = 0;n < e.length && n < t.length; ++n) {
    const r2 = e[n] - t[n];
    if (r2 !== 0)
      return r2;
  }
  return e.length - t.length;
};
var __PRIVATE_computeInExpansion = function(e) {
  var t, n;
  if (__PRIVATE_hardAssert(e instanceof FieldFilter || e instanceof CompositeFilter), e instanceof FieldFilter) {
    if (e instanceof __PRIVATE_InFilter) {
      const r3 = ((n = (t = e.value.arrayValue) === null || t === undefined ? undefined : t.values) === null || n === undefined ? undefined : n.map((t2) => FieldFilter.create(e.field, "==", t2))) || [];
      return CompositeFilter.create(r3, "or");
    }
    return e;
  }
  const r2 = e.filters.map((e2) => __PRIVATE_computeInExpansion(e2));
  return CompositeFilter.create(r2, e.op);
};
var __PRIVATE_getDnfTerms = function(e) {
  if (e.getFilters().length === 0)
    return [];
  const t = __PRIVATE_computeDistributedNormalForm(__PRIVATE_computeInExpansion(e));
  return __PRIVATE_hardAssert(__PRIVATE_isDisjunctiveNormalForm(t)), __PRIVATE_isSingleFieldFilter(t) || __PRIVATE_isFlatConjunction(t) ? [t] : t.getFilters();
};
var __PRIVATE_isSingleFieldFilter = function(e) {
  return e instanceof FieldFilter;
};
var __PRIVATE_isFlatConjunction = function(e) {
  return e instanceof CompositeFilter && __PRIVATE_compositeFilterIsFlatConjunction(e);
};
var __PRIVATE_isDisjunctiveNormalForm = function(e) {
  return __PRIVATE_isSingleFieldFilter(e) || __PRIVATE_isFlatConjunction(e) || function __PRIVATE_isDisjunctionOfFieldFiltersAndFlatConjunctions(e2) {
    if (e2 instanceof CompositeFilter && __PRIVATE_compositeFilterIsDisjunction(e2)) {
      for (const t of e2.getFilters())
        if (!__PRIVATE_isSingleFieldFilter(t) && !__PRIVATE_isFlatConjunction(t))
          return false;
      return true;
    }
    return false;
  }(e);
};
var __PRIVATE_computeDistributedNormalForm = function(e) {
  if (__PRIVATE_hardAssert(e instanceof FieldFilter || e instanceof CompositeFilter), e instanceof FieldFilter)
    return e;
  if (e.filters.length === 1)
    return __PRIVATE_computeDistributedNormalForm(e.filters[0]);
  const t = e.filters.map((e2) => __PRIVATE_computeDistributedNormalForm(e2));
  let n = CompositeFilter.create(t, e.op);
  return n = __PRIVATE_applyAssociation(n), __PRIVATE_isDisjunctiveNormalForm(n) ? n : (__PRIVATE_hardAssert(n instanceof CompositeFilter), __PRIVATE_hardAssert(__PRIVATE_compositeFilterIsConjunction(n)), __PRIVATE_hardAssert(n.filters.length > 1), n.filters.reduce((e2, t2) => __PRIVATE_applyDistribution(e2, t2)));
};
var __PRIVATE_applyDistribution = function(e, t) {
  let n;
  return __PRIVATE_hardAssert(e instanceof FieldFilter || e instanceof CompositeFilter), __PRIVATE_hardAssert(t instanceof FieldFilter || t instanceof CompositeFilter), n = e instanceof FieldFilter ? t instanceof FieldFilter ? function __PRIVATE_applyDistributionFieldFilters(e2, t2) {
    return CompositeFilter.create([e2, t2], "and");
  }(e, t) : __PRIVATE_applyDistributionFieldAndCompositeFilters(e, t) : t instanceof FieldFilter ? __PRIVATE_applyDistributionFieldAndCompositeFilters(t, e) : function __PRIVATE_applyDistributionCompositeFilters(e2, t2) {
    if (__PRIVATE_hardAssert(e2.filters.length > 0 && t2.filters.length > 0), __PRIVATE_compositeFilterIsConjunction(e2) && __PRIVATE_compositeFilterIsConjunction(t2))
      return __PRIVATE_compositeFilterWithAddedFilters(e2, t2.getFilters());
    const n2 = __PRIVATE_compositeFilterIsDisjunction(e2) ? e2 : t2, r2 = __PRIVATE_compositeFilterIsDisjunction(e2) ? t2 : e2, i = n2.filters.map((e3) => __PRIVATE_applyDistribution(e3, r2));
    return CompositeFilter.create(i, "or");
  }(e, t), __PRIVATE_applyAssociation(n);
};
var __PRIVATE_applyDistributionFieldAndCompositeFilters = function(e, t) {
  if (__PRIVATE_compositeFilterIsConjunction(t))
    return __PRIVATE_compositeFilterWithAddedFilters(t, e.getFilters());
  {
    const n = t.filters.map((t2) => __PRIVATE_applyDistribution(e, t2));
    return CompositeFilter.create(n, "or");
  }
};
var __PRIVATE_applyAssociation = function(e) {
  if (__PRIVATE_hardAssert(e instanceof FieldFilter || e instanceof CompositeFilter), e instanceof FieldFilter)
    return e;
  const t = e.getFilters();
  if (t.length === 1)
    return __PRIVATE_applyAssociation(t[0]);
  if (__PRIVATE_compositeFilterIsFlat(e))
    return e;
  const n = t.map((e2) => __PRIVATE_applyAssociation(e2)), r2 = [];
  return n.forEach((t2) => {
    t2 instanceof FieldFilter ? r2.push(t2) : t2 instanceof CompositeFilter && (t2.op === e.op ? r2.push(...t2.filters) : r2.push(t2));
  }), r2.length === 1 ? r2[0] : CompositeFilter.create(r2, e.op);
};
var __PRIVATE_collectionParentsStore = function(e) {
  return __PRIVATE_getStore(e, "collectionParents");
};
var __PRIVATE_indexEntriesStore = function(e) {
  return __PRIVATE_getStore(e, "indexEntries");
};
var __PRIVATE_indexConfigurationStore = function(e) {
  return __PRIVATE_getStore(e, "indexConfiguration");
};
var __PRIVATE_indexStateStore = function(e) {
  return __PRIVATE_getStore(e, "indexState");
};
var __PRIVATE_getMinOffsetFromFieldIndexes = function(e) {
  __PRIVATE_hardAssert(e.length !== 0);
  let t = e[0].indexState.offset, n = t.largestBatchId;
  for (let r2 = 1;r2 < e.length; r2++) {
    const i = e[r2].indexState.offset;
    __PRIVATE_indexOffsetComparator(i, t) < 0 && (t = i), n < i.largestBatchId && (n = i.largestBatchId);
  }
  return new IndexOffset(t.readTime, t.documentKey, n);
};
var removeMutationBatch = function(e, t, n) {
  const r2 = e.store("mutations"), i = e.store("documentMutations"), s = [], o = IDBKeyRange.only(n.batchId);
  let _ = 0;
  const a = r2.J({
    range: o
  }, (e2, t2, n2) => (_++, n2.delete()));
  s.push(a.next(() => {
    __PRIVATE_hardAssert(_ === 1);
  }));
  const u = [];
  for (const e2 of n.mutations) {
    const r3 = __PRIVATE_newDbDocumentMutationKey(t, e2.key.path, n.batchId);
    s.push(i.delete(r3)), u.push(e2.key);
  }
  return PersistencePromise.waitFor(s).next(() => u);
};
var __PRIVATE_dbDocumentSize = function(e) {
  if (!e)
    return 0;
  let t;
  if (e.document)
    t = e.document;
  else if (e.unknownDocument)
    t = e.unknownDocument;
  else {
    if (!e.noDocument)
      throw fail();
    t = e.noDocument;
  }
  return JSON.stringify(t).length;
};
var __PRIVATE_mutationQueueContainsKey = function(e, t, n) {
  const r2 = __PRIVATE_newDbDocumentMutationPrefixForPath(t, n.path), i = r2[1], s = IDBKeyRange.lowerBound(r2);
  let o = false;
  return __PRIVATE_documentMutationsStore(e).J({
    range: s,
    H: true
  }, (e2, n2, r3) => {
    const [s2, _, a] = e2;
    s2 === t && _ === i && (o = true), r3.done();
  }).next(() => o);
};
var __PRIVATE_mutationsStore = function(e) {
  return __PRIVATE_getStore(e, "mutations");
};
var __PRIVATE_documentMutationsStore = function(e) {
  return __PRIVATE_getStore(e, "documentMutations");
};
var __PRIVATE_mutationQueuesStore = function(e) {
  return __PRIVATE_getStore(e, "mutationQueues");
};
var __PRIVATE_targetsStore = function(e) {
  return __PRIVATE_getStore(e, "targets");
};
var __PRIVATE_globalTargetStore = function(e) {
  return __PRIVATE_getStore(e, "targetGlobal");
};
var __PRIVATE_documentTargetStore = function(e) {
  return __PRIVATE_getStore(e, "targetDocuments");
};
var __PRIVATE_bufferEntryComparator = function([e, t], [n, r2]) {
  const i = __PRIVATE_primitiveComparator(e, n);
  return i === 0 ? __PRIVATE_primitiveComparator(t, r2) : i;
};
var __PRIVATE_newLruGarbageCollector = function(e, t) {
  return new __PRIVATE_LruGarbageCollectorImpl(e, t);
};
var __PRIVATE_writeSentinelKey = function(e, t) {
  return __PRIVATE_documentTargetStore(e).put(function __PRIVATE_sentinelRow(e2, t2) {
    return {
      targetId: 0,
      path: __PRIVATE_encodeResourcePath(e2.path),
      sequenceNumber: t2
    };
  }(t, e.currentSequenceNumber));
};
var __PRIVATE_newIndexedDbRemoteDocumentCache = function(e) {
  return new __PRIVATE_IndexedDbRemoteDocumentCacheImpl(e);
};
var __PRIVATE_documentGlobalStore = function(e) {
  return __PRIVATE_getStore(e, "remoteDocumentGlobal");
};
var __PRIVATE_remoteDocumentsStore = function(e) {
  return __PRIVATE_getStore(e, "remoteDocumentsV14");
};
var __PRIVATE_dbKey = function(e) {
  const t = e.path.toArray();
  return [
    t.slice(0, t.length - 2),
    t[t.length - 2],
    t[t.length - 1]
  ];
};
var __PRIVATE_dbCollectionGroupKey = function(e, t) {
  const n = t.documentKey.path.toArray();
  return [
    e,
    __PRIVATE_toDbTimestampKey(t.readTime),
    n.slice(0, n.length - 2),
    n.length > 0 ? n[n.length - 1] : ""
  ];
};
var __PRIVATE_dbKeyComparator = function(e, t) {
  const n = e.path.toArray(), r2 = t.path.toArray();
  let i = 0;
  for (let e2 = 0;e2 < n.length - 2 && e2 < r2.length - 2; ++e2)
    if (i = __PRIVATE_primitiveComparator(n[e2], r2[e2]), i)
      return i;
  return i = __PRIVATE_primitiveComparator(n.length, r2.length), i || (i = __PRIVATE_primitiveComparator(n[n.length - 2], r2[r2.length - 2]), i || __PRIVATE_primitiveComparator(n[n.length - 1], r2[r2.length - 1]));
};
var __PRIVATE_createQueryCache = function(e) {
  e.createObjectStore("targetDocuments", {
    keyPath: q2
  }).createIndex("documentTargetsIndex", Q2, {
    unique: true
  });
  e.createObjectStore("targets", {
    keyPath: "targetId"
  }).createIndex("queryTargetsIndex", k2, {
    unique: true
  }), e.createObjectStore("targetGlobal");
};
var __PRIVATE_primaryClientStore = function(e) {
  return __PRIVATE_getStore(e, "owner");
};
var __PRIVATE_clientMetadataStore = function(e) {
  return __PRIVATE_getStore(e, "clientMetadata");
};
var __PRIVATE_indexedDbStoragePrefix = function(e, t) {
  let n = e.projectId;
  return e.isDefaultDatabase || (n += "." + e.database), "firestore/" + t + "/" + n + "/";
};
var __PRIVATE_newLocalStore = function(e, t, n, r2) {
  return new __PRIVATE_LocalStoreImpl(e, t, n, r2);
};
async function __PRIVATE_localStoreHandleUserChange(e, t) {
  const n = __PRIVATE_debugCast(e);
  return await n.persistence.runTransaction("Handle user change", "readonly", (e2) => {
    let r2;
    return n.mutationQueue.getAllMutationBatches(e2).next((i) => (r2 = i, n.os(t), n.mutationQueue.getAllMutationBatches(e2))).next((t2) => {
      const i = [], s = [];
      let o = __PRIVATE_documentKeySet();
      for (const e3 of r2) {
        i.push(e3.batchId);
        for (const t3 of e3.mutations)
          o = o.add(t3.key);
      }
      for (const e3 of t2) {
        s.push(e3.batchId);
        for (const t3 of e3.mutations)
          o = o.add(t3.key);
      }
      return n.localDocuments.getDocuments(e2, o).next((e3) => ({
        _s: e3,
        removedBatchIds: i,
        addedBatchIds: s
      }));
    });
  });
}
var __PRIVATE_localStoreAcknowledgeBatch = function(e, t) {
  const n = __PRIVATE_debugCast(e);
  return n.persistence.runTransaction("Acknowledge batch", "readwrite-primary", (e2) => {
    const r2 = t.batch.keys(), i = n.ss.newChangeBuffer({
      trackRemovals: true
    });
    return function __PRIVATE_applyWriteToRemoteDocuments(e3, t2, n2, r3) {
      const i2 = n2.batch, s = i2.keys();
      let o = PersistencePromise.resolve();
      return s.forEach((e4) => {
        o = o.next(() => r3.getEntry(t2, e4)).next((t3) => {
          const s2 = n2.docVersions.get(e4);
          __PRIVATE_hardAssert(s2 !== null), t3.version.compareTo(s2) < 0 && (i2.applyToRemoteDocument(t3, n2), t3.isValidDocument() && (t3.setReadTime(n2.commitVersion), r3.addEntry(t3)));
        });
      }), o.next(() => e3.mutationQueue.removeMutationBatch(t2, i2));
    }(n, e2, t, i).next(() => i.apply(e2)).next(() => n.mutationQueue.performConsistencyCheck(e2)).next(() => n.documentOverlayCache.removeOverlaysForBatchId(e2, r2, t.batch.batchId)).next(() => n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e2, function __PRIVATE_getKeysWithTransformResults(e3) {
      let t2 = __PRIVATE_documentKeySet();
      for (let n2 = 0;n2 < e3.mutationResults.length; ++n2) {
        e3.mutationResults[n2].transformResults.length > 0 && (t2 = t2.add(e3.batch.mutations[n2].key));
      }
      return t2;
    }(t))).next(() => n.localDocuments.getDocuments(e2, r2));
  });
};
var __PRIVATE_localStoreGetLastRemoteSnapshotVersion = function(e) {
  const t = __PRIVATE_debugCast(e);
  return t.persistence.runTransaction("Get last remote snapshot version", "readonly", (e2) => t.qr.getLastRemoteSnapshotVersion(e2));
};
var __PRIVATE_localStoreApplyRemoteEventToLocalCache = function(e, t) {
  const n = __PRIVATE_debugCast(e), r2 = t.snapshotVersion;
  let i = n.ts;
  return n.persistence.runTransaction("Apply remote event", "readwrite-primary", (e2) => {
    const s = n.ss.newChangeBuffer({
      trackRemovals: true
    });
    i = n.ts;
    const o = [];
    t.targetChanges.forEach((s2, _2) => {
      const a2 = i.get(_2);
      if (!a2)
        return;
      o.push(n.qr.removeMatchingKeys(e2, s2.removedDocuments, _2).next(() => n.qr.addMatchingKeys(e2, s2.addedDocuments, _2)));
      let u = a2.withSequenceNumber(e2.currentSequenceNumber);
      t.targetMismatches.get(_2) !== null ? u = u.withResumeToken(ByteString.EMPTY_BYTE_STRING, SnapshotVersion.min()).withLastLimboFreeSnapshotVersion(SnapshotVersion.min()) : s2.resumeToken.approximateByteSize() > 0 && (u = u.withResumeToken(s2.resumeToken, r2)), i = i.insert(_2, u), function __PRIVATE_shouldPersistTargetData(e3, t2, n2) {
        if (e3.resumeToken.approximateByteSize() === 0)
          return true;
        if (t2.snapshotVersion.toMicroseconds() - e3.snapshotVersion.toMicroseconds() >= 300000000)
          return true;
        return n2.addedDocuments.size + n2.modifiedDocuments.size + n2.removedDocuments.size > 0;
      }(a2, u, s2) && o.push(n.qr.updateTargetData(e2, u));
    });
    let _ = __PRIVATE_mutableDocumentMap(), a = __PRIVATE_documentKeySet();
    if (t.documentUpdates.forEach((r3) => {
      t.resolvedLimboDocuments.has(r3) && o.push(n.persistence.referenceDelegate.updateLimboDocument(e2, r3));
    }), o.push(__PRIVATE_populateDocumentChangeBuffer(e2, s, t.documentUpdates).next((e3) => {
      _ = e3.us, a = e3.cs;
    })), !r2.isEqual(SnapshotVersion.min())) {
      const t2 = n.qr.getLastRemoteSnapshotVersion(e2).next((t3) => n.qr.setTargetsMetadata(e2, e2.currentSequenceNumber, r2));
      o.push(t2);
    }
    return PersistencePromise.waitFor(o).next(() => s.apply(e2)).next(() => n.localDocuments.getLocalViewOfDocuments(e2, _, a)).next(() => _);
  }).then((e2) => (n.ts = i, e2));
};
var __PRIVATE_populateDocumentChangeBuffer = function(e, t, n) {
  let r2 = __PRIVATE_documentKeySet(), i = __PRIVATE_documentKeySet();
  return n.forEach((e2) => r2 = r2.add(e2)), t.getEntries(e, r2).next((e2) => {
    let r3 = __PRIVATE_mutableDocumentMap();
    return n.forEach((n2, s) => {
      const o = e2.get(n2);
      s.isFoundDocument() !== o.isFoundDocument() && (i = i.add(n2)), s.isNoDocument() && s.version.isEqual(SnapshotVersion.min()) ? (t.removeEntry(n2, s.readTime), r3 = r3.insert(n2, s)) : !o.isValidDocument() || s.version.compareTo(o.version) > 0 || s.version.compareTo(o.version) === 0 && o.hasPendingWrites ? (t.addEntry(s), r3 = r3.insert(n2, s)) : __PRIVATE_logDebug("LocalStore", "Ignoring outdated watch update for ", n2, ". Current version:", o.version, " Watch version:", s.version);
    }), {
      us: r3,
      cs: i
    };
  });
};
var __PRIVATE_localStoreGetNextMutationBatch = function(e, t) {
  const n = __PRIVATE_debugCast(e);
  return n.persistence.runTransaction("Get next mutation batch", "readonly", (e2) => (t === undefined && (t = -1), n.mutationQueue.getNextMutationBatchAfterBatchId(e2, t)));
};
var __PRIVATE_localStoreAllocateTarget = function(e, t) {
  const n = __PRIVATE_debugCast(e);
  return n.persistence.runTransaction("Allocate target", "readwrite", (e2) => {
    let r2;
    return n.qr.getTargetData(e2, t).next((i) => i ? (r2 = i, PersistencePromise.resolve(r2)) : n.qr.allocateTargetId(e2).next((i2) => (r2 = new TargetData(t, i2, "TargetPurposeListen", e2.currentSequenceNumber), n.qr.addTargetData(e2, r2).next(() => r2))));
  }).then((e2) => {
    const r2 = n.ts.get(e2.targetId);
    return (r2 === null || e2.snapshotVersion.compareTo(r2.snapshotVersion) > 0) && (n.ts = n.ts.insert(e2.targetId, e2), n.ns.set(t, e2.targetId)), e2;
  });
};
async function __PRIVATE_localStoreReleaseTarget(e, t, n) {
  const r2 = __PRIVATE_debugCast(e), i = r2.ts.get(t), s = n ? "readwrite" : "readwrite-primary";
  try {
    n || await r2.persistence.runTransaction("Release target", s, (e2) => r2.persistence.referenceDelegate.removeTarget(e2, i));
  } catch (e2) {
    if (!__PRIVATE_isIndexedDbTransactionError(e2))
      throw e2;
    __PRIVATE_logDebug("LocalStore", `Failed to update sequence numbers for target ${t}: ${e2}`);
  }
  r2.ts = r2.ts.remove(t), r2.ns.delete(i.target);
}
var __PRIVATE_localStoreExecuteQuery = function(e, t, n) {
  const r2 = __PRIVATE_debugCast(e);
  let i = SnapshotVersion.min(), s = __PRIVATE_documentKeySet();
  return r2.persistence.runTransaction("Execute query", "readwrite", (e2) => function __PRIVATE_localStoreGetTargetData(e3, t2, n2) {
    const r3 = __PRIVATE_debugCast(e3), i2 = r3.ns.get(n2);
    return i2 !== undefined ? PersistencePromise.resolve(r3.ts.get(i2)) : r3.qr.getTargetData(t2, n2);
  }(r2, e2, __PRIVATE_queryToTarget(t)).next((t2) => {
    if (t2)
      return i = t2.lastLimboFreeSnapshotVersion, r2.qr.getMatchingKeysForTargetId(e2, t2.targetId).next((e3) => {
        s = e3;
      });
  }).next(() => r2.es.getDocumentsMatchingQuery(e2, t, n ? i : SnapshotVersion.min(), n ? s : __PRIVATE_documentKeySet())).next((e3) => (__PRIVATE_setMaxReadTime(r2, __PRIVATE_queryCollectionGroup(t), e3), {
    documents: e3,
    ls: s
  })));
};
var __PRIVATE_localStoreGetCachedTarget = function(e, t) {
  const n = __PRIVATE_debugCast(e), r2 = __PRIVATE_debugCast(n.qr), i = n.ts.get(t);
  return i ? Promise.resolve(i.target) : n.persistence.runTransaction("Get target data", "readonly", (e2) => r2.ot(e2, t).next((e3) => e3 ? e3.target : null));
};
var __PRIVATE_localStoreGetNewDocumentChanges = function(e, t) {
  const n = __PRIVATE_debugCast(e), r2 = n.rs.get(t) || SnapshotVersion.min();
  return n.persistence.runTransaction("Get new document changes", "readonly", (e2) => n.ss.getAllFromCollectionGroup(e2, t, __PRIVATE_newIndexOffsetSuccessorFromReadTime(r2, -1), Number.MAX_SAFE_INTEGER)).then((e2) => (__PRIVATE_setMaxReadTime(n, t, e2), e2));
};
var __PRIVATE_setMaxReadTime = function(e, t, n) {
  let r2 = e.rs.get(t) || SnapshotVersion.min();
  n.forEach((e2, t2) => {
    t2.readTime.compareTo(r2) > 0 && (r2 = t2.readTime);
  }), e.rs.set(t, r2);
};
var createWebStorageClientStateKey = function(e, t) {
  return `firestore_clients_${e}_${t}`;
};
var createWebStorageMutationBatchKey = function(e, t, n) {
  let r2 = `firestore_mutations_${e}_${n}`;
  return t.isAuthenticated() && (r2 += `_${t.uid}`), r2;
};
var createWebStorageQueryTargetMetadataKey = function(e, t) {
  return `firestore_targets_${e}_${t}`;
};
var __PRIVATE_generateUniqueDebugId = function() {
  return Ve === null ? Ve = function __PRIVATE_generateInitialUniqueDebugId() {
    return 268435456 + Math.round(2147483648 * Math.random());
  }() : Ve++, "0x" + Ve.toString(16);
};
var __PRIVATE_getWindow = function() {
  return typeof window != "undefined" ? window : null;
};
var getDocument = function() {
  return typeof document != "undefined" ? document : null;
};
var __PRIVATE_newSerializer = function(e) {
  return new JsonProtoSerializer(e, true);
};
async function __PRIVATE_enableNetworkInternal(e) {
  if (__PRIVATE_canUseNetwork(e))
    for (const t of e.x_)
      await t(true);
}
async function __PRIVATE_disableNetworkInternal(e) {
  for (const t of e.x_)
    await t(false);
}
var __PRIVATE_remoteStoreListen = function(e, t) {
  const n = __PRIVATE_debugCast(e);
  n.F_.has(t.targetId) || (n.F_.set(t.targetId, t), __PRIVATE_shouldStartWatchStream(n) ? __PRIVATE_startWatchStream(n) : __PRIVATE_ensureWatchStream(n).Zo() && __PRIVATE_sendWatchRequest(n, t));
};
var __PRIVATE_remoteStoreUnlisten = function(e, t) {
  const n = __PRIVATE_debugCast(e), r2 = __PRIVATE_ensureWatchStream(n);
  n.F_.delete(t), r2.Zo() && __PRIVATE_sendUnwatchRequest(n, t), n.F_.size === 0 && (r2.Zo() ? r2.t_() : __PRIVATE_canUseNetwork(n) && n.N_.set("Unknown"));
};
var __PRIVATE_sendWatchRequest = function(e, t) {
  if (e.L_.xe(t.targetId), t.resumeToken.approximateByteSize() > 0 || t.snapshotVersion.compareTo(SnapshotVersion.min()) > 0) {
    const n = e.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;
    t = t.withExpectedCount(n);
  }
  __PRIVATE_ensureWatchStream(e).h_(t);
};
var __PRIVATE_sendUnwatchRequest = function(e, t) {
  e.L_.xe(t), __PRIVATE_ensureWatchStream(e).P_(t);
};
var __PRIVATE_startWatchStream = function(e) {
  e.L_ = new __PRIVATE_WatchChangeAggregator({
    getRemoteKeysForTarget: (t) => e.remoteSyncer.getRemoteKeysForTarget(t),
    ot: (t) => e.F_.get(t) || null,
    tt: () => e.datastore.serializer.databaseId
  }), __PRIVATE_ensureWatchStream(e).start(), e.N_.w_();
};
var __PRIVATE_shouldStartWatchStream = function(e) {
  return __PRIVATE_canUseNetwork(e) && !__PRIVATE_ensureWatchStream(e).Yo() && e.F_.size > 0;
};
var __PRIVATE_canUseNetwork = function(e) {
  return __PRIVATE_debugCast(e).M_.size === 0;
};
var __PRIVATE_cleanUpWatchStreamState = function(e) {
  e.L_ = undefined;
};
async function __PRIVATE_onWatchStreamConnected(e) {
  e.N_.set("Online");
}
async function __PRIVATE_onWatchStreamOpen(e) {
  e.F_.forEach((t, n) => {
    __PRIVATE_sendWatchRequest(e, t);
  });
}
async function __PRIVATE_onWatchStreamClose(e, t) {
  __PRIVATE_cleanUpWatchStreamState(e), __PRIVATE_shouldStartWatchStream(e) ? (e.N_.D_(t), __PRIVATE_startWatchStream(e)) : e.N_.set("Unknown");
}
async function __PRIVATE_onWatchStreamChange(e, t, n) {
  if (e.N_.set("Online"), t instanceof __PRIVATE_WatchTargetChange && t.state === 2 && t.cause)
    try {
      await async function __PRIVATE_handleTargetError(e2, t2) {
        const n2 = t2.cause;
        for (const r2 of t2.targetIds)
          e2.F_.has(r2) && (await e2.remoteSyncer.rejectListen(r2, n2), e2.F_.delete(r2), e2.L_.removeTarget(r2));
      }(e, t);
    } catch (n2) {
      __PRIVATE_logDebug("RemoteStore", "Failed to remove targets %s: %s ", t.targetIds.join(","), n2), await __PRIVATE_disableNetworkUntilRecovery(e, n2);
    }
  else if (t instanceof __PRIVATE_DocumentWatchChange ? e.L_.Ke(t) : t instanceof __PRIVATE_ExistenceFilterChange ? e.L_.He(t) : e.L_.We(t), !n.isEqual(SnapshotVersion.min()))
    try {
      const t2 = await __PRIVATE_localStoreGetLastRemoteSnapshotVersion(e.localStore);
      n.compareTo(t2) >= 0 && await function __PRIVATE_raiseWatchSnapshot(e2, t3) {
        const n2 = e2.L_.rt(t3);
        return n2.targetChanges.forEach((n3, r2) => {
          if (n3.resumeToken.approximateByteSize() > 0) {
            const i = e2.F_.get(r2);
            i && e2.F_.set(r2, i.withResumeToken(n3.resumeToken, t3));
          }
        }), n2.targetMismatches.forEach((t4, n3) => {
          const r2 = e2.F_.get(t4);
          if (!r2)
            return;
          e2.F_.set(t4, r2.withResumeToken(ByteString.EMPTY_BYTE_STRING, r2.snapshotVersion)), __PRIVATE_sendUnwatchRequest(e2, t4);
          const i = new TargetData(r2.target, t4, n3, r2.sequenceNumber);
          __PRIVATE_sendWatchRequest(e2, i);
        }), e2.remoteSyncer.applyRemoteEvent(n2);
      }(e, n);
    } catch (t2) {
      __PRIVATE_logDebug("RemoteStore", "Failed to raise snapshot:", t2), await __PRIVATE_disableNetworkUntilRecovery(e, t2);
    }
}
async function __PRIVATE_disableNetworkUntilRecovery(e, t, n) {
  if (!__PRIVATE_isIndexedDbTransactionError(t))
    throw t;
  e.M_.add(1), await __PRIVATE_disableNetworkInternal(e), e.N_.set("Offline"), n || (n = () => __PRIVATE_localStoreGetLastRemoteSnapshotVersion(e.localStore)), e.asyncQueue.enqueueRetryable(async () => {
    __PRIVATE_logDebug("RemoteStore", "Retrying IndexedDB access"), await n(), e.M_.delete(1), await __PRIVATE_enableNetworkInternal(e);
  });
}
var __PRIVATE_executeWithRecovery = function(e, t) {
  return t().catch((n) => __PRIVATE_disableNetworkUntilRecovery(e, n, t));
};
async function __PRIVATE_fillWritePipeline(e) {
  const t = __PRIVATE_debugCast(e), n = __PRIVATE_ensureWriteStream(t);
  let r2 = t.v_.length > 0 ? t.v_[t.v_.length - 1].batchId : -1;
  for (;__PRIVATE_canAddToWritePipeline(t); )
    try {
      const e2 = await __PRIVATE_localStoreGetNextMutationBatch(t.localStore, r2);
      if (e2 === null) {
        t.v_.length === 0 && n.t_();
        break;
      }
      r2 = e2.batchId, __PRIVATE_addToWritePipeline(t, e2);
    } catch (e2) {
      await __PRIVATE_disableNetworkUntilRecovery(t, e2);
    }
  __PRIVATE_shouldStartWriteStream(t) && __PRIVATE_startWriteStream(t);
}
var __PRIVATE_canAddToWritePipeline = function(e) {
  return __PRIVATE_canUseNetwork(e) && e.v_.length < 10;
};
var __PRIVATE_addToWritePipeline = function(e, t) {
  e.v_.push(t);
  const n = __PRIVATE_ensureWriteStream(e);
  n.Zo() && n.T_ && n.E_(t.mutations);
};
var __PRIVATE_shouldStartWriteStream = function(e) {
  return __PRIVATE_canUseNetwork(e) && !__PRIVATE_ensureWriteStream(e).Yo() && e.v_.length > 0;
};
var __PRIVATE_startWriteStream = function(e) {
  __PRIVATE_ensureWriteStream(e).start();
};
async function __PRIVATE_onWriteStreamOpen(e) {
  __PRIVATE_ensureWriteStream(e).R_();
}
async function __PRIVATE_onWriteHandshakeComplete(e) {
  const t = __PRIVATE_ensureWriteStream(e);
  for (const n of e.v_)
    t.E_(n.mutations);
}
async function __PRIVATE_onMutationResult(e, t, n) {
  const r2 = e.v_.shift(), i = MutationBatchResult.from(r2, t, n);
  await __PRIVATE_executeWithRecovery(e, () => e.remoteSyncer.applySuccessfulWrite(i)), await __PRIVATE_fillWritePipeline(e);
}
async function __PRIVATE_onWriteStreamClose(e, t) {
  t && __PRIVATE_ensureWriteStream(e).T_ && await async function __PRIVATE_handleWriteError(e2, t2) {
    if (function __PRIVATE_isPermanentWriteError(e3) {
      return __PRIVATE_isPermanentError(e3) && e3 !== C2.ABORTED;
    }(t2.code)) {
      const n = e2.v_.shift();
      __PRIVATE_ensureWriteStream(e2).e_(), await __PRIVATE_executeWithRecovery(e2, () => e2.remoteSyncer.rejectFailedWrite(n.batchId, t2)), await __PRIVATE_fillWritePipeline(e2);
    }
  }(e, t), __PRIVATE_shouldStartWriteStream(e) && __PRIVATE_startWriteStream(e);
}
async function __PRIVATE_remoteStoreHandleCredentialChange(e, t) {
  const n = __PRIVATE_debugCast(e);
  n.asyncQueue.verifyOperationInProgress(), __PRIVATE_logDebug("RemoteStore", "RemoteStore received new credentials");
  const r2 = __PRIVATE_canUseNetwork(n);
  n.M_.add(3), await __PRIVATE_disableNetworkInternal(n), r2 && n.N_.set("Unknown"), await n.remoteSyncer.handleCredentialChange(t), n.M_.delete(3), await __PRIVATE_enableNetworkInternal(n);
}
async function __PRIVATE_remoteStoreApplyPrimaryState(e, t) {
  const n = __PRIVATE_debugCast(e);
  t ? (n.M_.delete(2), await __PRIVATE_enableNetworkInternal(n)) : t || (n.M_.add(2), await __PRIVATE_disableNetworkInternal(n), n.N_.set("Unknown"));
}
var __PRIVATE_ensureWatchStream = function(e) {
  return e.B_ || (e.B_ = function __PRIVATE_newPersistentWatchStream(e2, t, n) {
    const r2 = __PRIVATE_debugCast(e2);
    return r2.m_(), new __PRIVATE_PersistentListenStream(t, r2.connection, r2.authCredentials, r2.appCheckCredentials, r2.serializer, n);
  }(e.datastore, e.asyncQueue, {
    ho: __PRIVATE_onWatchStreamConnected.bind(null, e),
    Io: __PRIVATE_onWatchStreamOpen.bind(null, e),
    Eo: __PRIVATE_onWatchStreamClose.bind(null, e),
    l_: __PRIVATE_onWatchStreamChange.bind(null, e)
  }), e.x_.push(async (t) => {
    t ? (e.B_.e_(), __PRIVATE_shouldStartWatchStream(e) ? __PRIVATE_startWatchStream(e) : e.N_.set("Unknown")) : (await e.B_.stop(), __PRIVATE_cleanUpWatchStreamState(e));
  })), e.B_;
};
var __PRIVATE_ensureWriteStream = function(e) {
  return e.k_ || (e.k_ = function __PRIVATE_newPersistentWriteStream(e2, t, n) {
    const r2 = __PRIVATE_debugCast(e2);
    return r2.m_(), new __PRIVATE_PersistentWriteStream(t, r2.connection, r2.authCredentials, r2.appCheckCredentials, r2.serializer, n);
  }(e.datastore, e.asyncQueue, {
    ho: () => Promise.resolve(),
    Io: __PRIVATE_onWriteStreamOpen.bind(null, e),
    Eo: __PRIVATE_onWriteStreamClose.bind(null, e),
    A_: __PRIVATE_onWriteHandshakeComplete.bind(null, e),
    d_: __PRIVATE_onMutationResult.bind(null, e)
  }), e.x_.push(async (t) => {
    t ? (e.k_.e_(), await __PRIVATE_fillWritePipeline(e)) : (await e.k_.stop(), e.v_.length > 0 && (__PRIVATE_logDebug("RemoteStore", `Stopping write stream with ${e.v_.length} pending writes`), e.v_ = []));
  })), e.k_;
};
var __PRIVATE_wrapInUserErrorIfRecoverable = function(e, t) {
  if (__PRIVATE_logError("AsyncQueue", `${t}: ${e}`), __PRIVATE_isIndexedDbTransactionError(e))
    return new FirestoreError(C2.UNAVAILABLE, `${t}: ${e}`);
  throw e;
};
async function __PRIVATE_eventManagerListen(e, t) {
  const n = __PRIVATE_debugCast(e);
  let r2 = 3;
  const i = t.query;
  let s = n.queries.get(i);
  s ? !s.W_() && t.G_() && (r2 = 2) : (s = new __PRIVATE_QueryListenersInfo, r2 = t.G_() ? 0 : 1);
  try {
    switch (r2) {
      case 0:
        s.K_ = await n.onListen(i, true);
        break;
      case 1:
        s.K_ = await n.onListen(i, false);
        break;
      case 2:
        await n.onFirstRemoteStoreListen(i);
    }
  } catch (e2) {
    const n2 = __PRIVATE_wrapInUserErrorIfRecoverable(e2, `Initialization of query '${__PRIVATE_stringifyQuery(t.query)}' failed`);
    return void t.onError(n2);
  }
  if (n.queries.set(i, s), s.U_.push(t), t.j_(n.onlineState), s.K_) {
    t.H_(s.K_) && __PRIVATE_raiseSnapshotsInSyncEvent(n);
  }
}
async function __PRIVATE_eventManagerUnlisten(e, t) {
  const n = __PRIVATE_debugCast(e), r2 = t.query;
  let i = 3;
  const s = n.queries.get(r2);
  if (s) {
    const e2 = s.U_.indexOf(t);
    e2 >= 0 && (s.U_.splice(e2, 1), s.U_.length === 0 ? i = t.G_() ? 0 : 1 : !s.W_() && t.G_() && (i = 2));
  }
  switch (i) {
    case 0:
      return n.queries.delete(r2), n.onUnlisten(r2, true);
    case 1:
      return n.queries.delete(r2), n.onUnlisten(r2, false);
    case 2:
      return n.onLastRemoteStoreUnlisten(r2);
    default:
      return;
  }
}
var __PRIVATE_eventManagerOnWatchChange = function(e, t) {
  const n = __PRIVATE_debugCast(e);
  let r2 = false;
  for (const e2 of t) {
    const t2 = e2.query, i = n.queries.get(t2);
    if (i) {
      for (const t3 of i.U_)
        t3.H_(e2) && (r2 = true);
      i.K_ = e2;
    }
  }
  r2 && __PRIVATE_raiseSnapshotsInSyncEvent(n);
};
var __PRIVATE_eventManagerOnWatchError = function(e, t, n) {
  const r2 = __PRIVATE_debugCast(e), i = r2.queries.get(t);
  if (i)
    for (const e2 of i.U_)
      e2.onError(n);
  r2.queries.delete(t);
};
var __PRIVATE_raiseSnapshotsInSyncEvent = function(e) {
  e.z_.forEach((e2) => {
    e2.next();
  });
};
async function __PRIVATE_syncEngineListen(e, t, n = true) {
  const r2 = __PRIVATE_ensureWatchCallbacks(e);
  let i;
  const s = r2.ba.get(t);
  return s ? (r2.sharedClientState.addLocalQueryTarget(s.targetId), i = s.view.ya()) : i = await __PRIVATE_allocateTargetAndMaybeListen(r2, t, n, true), i;
}
async function __PRIVATE_triggerRemoteStoreListen(e, t) {
  const n = __PRIVATE_ensureWatchCallbacks(e);
  await __PRIVATE_allocateTargetAndMaybeListen(n, t, true, false);
}
async function __PRIVATE_allocateTargetAndMaybeListen(e, t, n, r2) {
  const i = await __PRIVATE_localStoreAllocateTarget(e.localStore, __PRIVATE_queryToTarget(t)), s = i.targetId, o = n ? e.sharedClientState.addLocalQueryTarget(s) : "not-current";
  let _;
  return r2 && (_ = await __PRIVATE_initializeViewAndComputeSnapshot(e, t, s, o === "current", i.resumeToken)), e.isPrimaryClient && n && __PRIVATE_remoteStoreListen(e.remoteStore, i), _;
}
async function __PRIVATE_initializeViewAndComputeSnapshot(e, t, n, r2, i) {
  e.Ba = (t2, n2, r3) => async function __PRIVATE_applyDocChanges(e2, t3, n3, r4) {
    let i2 = t3.view.da(n3);
    i2.Zi && (i2 = await __PRIVATE_localStoreExecuteQuery(e2.localStore, t3.query, false).then(({ documents: e3 }) => t3.view.da(e3, i2)));
    const s2 = r4 && r4.targetChanges.get(t3.targetId), o2 = r4 && r4.targetMismatches.get(t3.targetId) != null, _2 = t3.view.applyChanges(i2, e2.isPrimaryClient, s2, o2);
    return __PRIVATE_updateTrackedLimbos(e2, t3.targetId, _2.fa), _2.snapshot;
  }(e, t2, n2, r3);
  const s = await __PRIVATE_localStoreExecuteQuery(e.localStore, t, true), o = new __PRIVATE_View(t, s.ls), _ = o.da(s.documents), a = TargetChange.createSynthesizedTargetChangeForCurrentChange(n, r2 && e.onlineState !== "Offline", i), u = o.applyChanges(_, e.isPrimaryClient, a);
  __PRIVATE_updateTrackedLimbos(e, n, u.fa);
  const c = new __PRIVATE_QueryView(t, n, o);
  return e.ba.set(t, c), e.Da.has(n) ? e.Da.get(n).push(t) : e.Da.set(n, [t]), u.snapshot;
}
async function __PRIVATE_syncEngineUnlisten(e, t, n) {
  const r2 = __PRIVATE_debugCast(e), i = r2.ba.get(t), s = r2.Da.get(i.targetId);
  if (s.length > 1)
    return r2.Da.set(i.targetId, s.filter((e2) => !__PRIVATE_queryEquals(e2, t))), void r2.ba.delete(t);
  if (r2.isPrimaryClient) {
    r2.sharedClientState.removeLocalQueryTarget(i.targetId);
    r2.sharedClientState.isActiveQueryTarget(i.targetId) || await __PRIVATE_localStoreReleaseTarget(r2.localStore, i.targetId, false).then(() => {
      r2.sharedClientState.clearQueryState(i.targetId), n && __PRIVATE_remoteStoreUnlisten(r2.remoteStore, i.targetId), __PRIVATE_removeAndCleanupTarget(r2, i.targetId);
    }).catch(__PRIVATE_ignoreIfPrimaryLeaseLoss);
  } else
    __PRIVATE_removeAndCleanupTarget(r2, i.targetId), await __PRIVATE_localStoreReleaseTarget(r2.localStore, i.targetId, true);
}
async function __PRIVATE_triggerRemoteStoreUnlisten(e, t) {
  const n = __PRIVATE_debugCast(e), r2 = n.ba.get(t), i = n.Da.get(r2.targetId);
  n.isPrimaryClient && i.length === 1 && (n.sharedClientState.removeLocalQueryTarget(r2.targetId), __PRIVATE_remoteStoreUnlisten(n.remoteStore, r2.targetId));
}
async function __PRIVATE_syncEngineApplyRemoteEvent(e, t) {
  const n = __PRIVATE_debugCast(e);
  try {
    const e2 = await __PRIVATE_localStoreApplyRemoteEventToLocalCache(n.localStore, t);
    t.targetChanges.forEach((e3, t2) => {
      const r2 = n.Fa.get(t2);
      r2 && (__PRIVATE_hardAssert(e3.addedDocuments.size + e3.modifiedDocuments.size + e3.removedDocuments.size <= 1), e3.addedDocuments.size > 0 ? r2.wa = true : e3.modifiedDocuments.size > 0 ? __PRIVATE_hardAssert(r2.wa) : e3.removedDocuments.size > 0 && (__PRIVATE_hardAssert(r2.wa), r2.wa = false));
    }), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n, e2, t);
  } catch (e2) {
    await __PRIVATE_ignoreIfPrimaryLeaseLoss(e2);
  }
}
var __PRIVATE_syncEngineApplyOnlineStateChange = function(e, t, n) {
  const r2 = __PRIVATE_debugCast(e);
  if (r2.isPrimaryClient && n === 0 || !r2.isPrimaryClient && n === 1) {
    const e2 = [];
    r2.ba.forEach((n2, r3) => {
      const i = r3.view.j_(t);
      i.snapshot && e2.push(i.snapshot);
    }), function __PRIVATE_eventManagerOnOnlineStateChange(e3, t2) {
      const n2 = __PRIVATE_debugCast(e3);
      n2.onlineState = t2;
      let r3 = false;
      n2.queries.forEach((e4, n3) => {
        for (const e5 of n3.U_)
          e5.j_(t2) && (r3 = true);
      }), r3 && __PRIVATE_raiseSnapshotsInSyncEvent(n2);
    }(r2.eventManager, t), e2.length && r2.Sa.l_(e2), r2.onlineState = t, r2.isPrimaryClient && r2.sharedClientState.setOnlineState(t);
  }
};
async function __PRIVATE_syncEngineRejectListen(e, t, n) {
  const r2 = __PRIVATE_debugCast(e);
  r2.sharedClientState.updateQueryState(t, "rejected", n);
  const i = r2.Fa.get(t), s = i && i.key;
  if (s) {
    let e2 = new SortedMap(DocumentKey.comparator);
    e2 = e2.insert(s, MutableDocument.newNoDocument(s, SnapshotVersion.min()));
    const n2 = __PRIVATE_documentKeySet().add(s), i2 = new RemoteEvent(SnapshotVersion.min(), new Map, new SortedMap(__PRIVATE_primitiveComparator), e2, n2);
    await __PRIVATE_syncEngineApplyRemoteEvent(r2, i2), r2.va = r2.va.remove(s), r2.Fa.delete(t), __PRIVATE_pumpEnqueuedLimboResolutions(r2);
  } else
    await __PRIVATE_localStoreReleaseTarget(r2.localStore, t, false).then(() => __PRIVATE_removeAndCleanupTarget(r2, t, n)).catch(__PRIVATE_ignoreIfPrimaryLeaseLoss);
}
async function __PRIVATE_syncEngineApplySuccessfulWrite(e, t) {
  const n = __PRIVATE_debugCast(e), r2 = t.batch.batchId;
  try {
    const e2 = await __PRIVATE_localStoreAcknowledgeBatch(n.localStore, t);
    __PRIVATE_processUserCallback(n, r2, null), __PRIVATE_triggerPendingWritesCallbacks(n, r2), n.sharedClientState.updateMutationState(r2, "acknowledged"), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n, e2);
  } catch (e2) {
    await __PRIVATE_ignoreIfPrimaryLeaseLoss(e2);
  }
}
async function __PRIVATE_syncEngineRejectFailedWrite(e, t, n) {
  const r2 = __PRIVATE_debugCast(e);
  try {
    const e2 = await function __PRIVATE_localStoreRejectBatch(e3, t2) {
      const n2 = __PRIVATE_debugCast(e3);
      return n2.persistence.runTransaction("Reject batch", "readwrite-primary", (e4) => {
        let r3;
        return n2.mutationQueue.lookupMutationBatch(e4, t2).next((t3) => (__PRIVATE_hardAssert(t3 !== null), r3 = t3.keys(), n2.mutationQueue.removeMutationBatch(e4, t3))).next(() => n2.mutationQueue.performConsistencyCheck(e4)).next(() => n2.documentOverlayCache.removeOverlaysForBatchId(e4, r3, t2)).next(() => n2.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e4, r3)).next(() => n2.localDocuments.getDocuments(e4, r3));
      });
    }(r2.localStore, t);
    __PRIVATE_processUserCallback(r2, t, n), __PRIVATE_triggerPendingWritesCallbacks(r2, t), r2.sharedClientState.updateMutationState(t, "rejected", n), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(r2, e2);
  } catch (n2) {
    await __PRIVATE_ignoreIfPrimaryLeaseLoss(n2);
  }
}
var __PRIVATE_triggerPendingWritesCallbacks = function(e, t) {
  (e.Oa.get(t) || []).forEach((e2) => {
    e2.resolve();
  }), e.Oa.delete(t);
};
var __PRIVATE_processUserCallback = function(e, t, n) {
  const r2 = __PRIVATE_debugCast(e);
  let i = r2.xa[r2.currentUser.toKey()];
  if (i) {
    const e2 = i.get(t);
    e2 && (n ? e2.reject(n) : e2.resolve(), i = i.remove(t)), r2.xa[r2.currentUser.toKey()] = i;
  }
};
var __PRIVATE_removeAndCleanupTarget = function(e, t, n = null) {
  e.sharedClientState.removeLocalQueryTarget(t);
  for (const r2 of e.Da.get(t))
    e.ba.delete(r2), n && e.Sa.ka(r2, n);
  if (e.Da.delete(t), e.isPrimaryClient) {
    e.Ma.Rr(t).forEach((t2) => {
      e.Ma.containsKey(t2) || __PRIVATE_removeLimboTarget(e, t2);
    });
  }
};
var __PRIVATE_removeLimboTarget = function(e, t) {
  e.Ca.delete(t.path.canonicalString());
  const n = e.va.get(t);
  n !== null && (__PRIVATE_remoteStoreUnlisten(e.remoteStore, n), e.va = e.va.remove(t), e.Fa.delete(n), __PRIVATE_pumpEnqueuedLimboResolutions(e));
};
var __PRIVATE_updateTrackedLimbos = function(e, t, n) {
  for (const r2 of n)
    if (r2 instanceof __PRIVATE_AddedLimboDocument)
      e.Ma.addReference(r2.key, t), __PRIVATE_trackLimboChange(e, r2);
    else if (r2 instanceof __PRIVATE_RemovedLimboDocument) {
      __PRIVATE_logDebug("SyncEngine", "Document no longer in limbo: " + r2.key), e.Ma.removeReference(r2.key, t);
      e.Ma.containsKey(r2.key) || __PRIVATE_removeLimboTarget(e, r2.key);
    } else
      fail();
};
var __PRIVATE_trackLimboChange = function(e, t) {
  const n = t.key, r2 = n.path.canonicalString();
  e.va.get(n) || e.Ca.has(r2) || (__PRIVATE_logDebug("SyncEngine", "New document in limbo: " + n), e.Ca.add(r2), __PRIVATE_pumpEnqueuedLimboResolutions(e));
};
var __PRIVATE_pumpEnqueuedLimboResolutions = function(e) {
  for (;e.Ca.size > 0 && e.va.size < e.maxConcurrentLimboResolutions; ) {
    const t = e.Ca.values().next().value;
    e.Ca.delete(t);
    const n = new DocumentKey(ResourcePath.fromString(t)), r2 = e.Na.next();
    e.Fa.set(r2, new LimboResolution(n)), e.va = e.va.insert(n, r2), __PRIVATE_remoteStoreListen(e.remoteStore, new TargetData(__PRIVATE_queryToTarget(__PRIVATE_newQueryForPath(n.path)), r2, "TargetPurposeLimboResolution", __PRIVATE_ListenSequence.oe));
  }
};
async function __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(e, t, n) {
  const r2 = __PRIVATE_debugCast(e), i = [], s = [], o = [];
  r2.ba.isEmpty() || (r2.ba.forEach((e2, _) => {
    o.push(r2.Ba(_, t, n).then((e3) => {
      if ((e3 || n) && r2.isPrimaryClient && r2.sharedClientState.updateQueryState(_.targetId, (e3 == null ? undefined : e3.fromCache) ? "not-current" : "current"), e3) {
        i.push(e3);
        const t2 = __PRIVATE_LocalViewChanges.Qi(_.targetId, e3);
        s.push(t2);
      }
    }));
  }), await Promise.all(o), r2.Sa.l_(i), await async function __PRIVATE_localStoreNotifyLocalViewChanges(e2, t2) {
    const n2 = __PRIVATE_debugCast(e2);
    try {
      await n2.persistence.runTransaction("notifyLocalViewChanges", "readwrite", (e3) => PersistencePromise.forEach(t2, (t3) => PersistencePromise.forEach(t3.ki, (r3) => n2.persistence.referenceDelegate.addReference(e3, t3.targetId, r3)).next(() => PersistencePromise.forEach(t3.qi, (r3) => n2.persistence.referenceDelegate.removeReference(e3, t3.targetId, r3)))));
    } catch (e3) {
      if (!__PRIVATE_isIndexedDbTransactionError(e3))
        throw e3;
      __PRIVATE_logDebug("LocalStore", "Failed to update sequence numbers: " + e3);
    }
    for (const e3 of t2) {
      const t3 = e3.targetId;
      if (!e3.fromCache) {
        const e4 = n2.ts.get(t3), r3 = e4.snapshotVersion, i2 = e4.withLastLimboFreeSnapshotVersion(r3);
        n2.ts = n2.ts.insert(t3, i2);
      }
    }
  }(r2.localStore, s));
}
async function __PRIVATE_syncEngineHandleCredentialChange(e, t) {
  const n = __PRIVATE_debugCast(e);
  if (!n.currentUser.isEqual(t)) {
    __PRIVATE_logDebug("SyncEngine", "User change. New user:", t.toKey());
    const e2 = await __PRIVATE_localStoreHandleUserChange(n.localStore, t);
    n.currentUser = t, function __PRIVATE_rejectOutstandingPendingWritesCallbacks(e3, t2) {
      e3.Oa.forEach((e4) => {
        e4.forEach((e5) => {
          e5.reject(new FirestoreError(C2.CANCELLED, t2));
        });
      }), e3.Oa.clear();
    }(n, "'waitForPendingWrites' promise is rejected due to a user change."), n.sharedClientState.handleUserChange(t, e2.removedBatchIds, e2.addedBatchIds), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n, e2._s);
  }
}
var __PRIVATE_syncEngineGetRemoteKeysForTarget = function(e, t) {
  const n = __PRIVATE_debugCast(e), r2 = n.Fa.get(t);
  if (r2 && r2.wa)
    return __PRIVATE_documentKeySet().add(r2.key);
  {
    let e2 = __PRIVATE_documentKeySet();
    const r3 = n.Da.get(t);
    if (!r3)
      return e2;
    for (const t2 of r3) {
      const r4 = n.ba.get(t2);
      e2 = e2.unionWith(r4.view.Ea);
    }
    return e2;
  }
};
async function __PRIVATE_synchronizeViewAndComputeSnapshot(e, t) {
  const n = __PRIVATE_debugCast(e), r2 = await __PRIVATE_localStoreExecuteQuery(n.localStore, t.query, true), i = t.view.pa(r2);
  return n.isPrimaryClient && __PRIVATE_updateTrackedLimbos(n, t.targetId, i.fa), i;
}
async function __PRIVATE_syncEngineSynchronizeWithChangedDocuments(e, t) {
  const n = __PRIVATE_debugCast(e);
  return __PRIVATE_localStoreGetNewDocumentChanges(n.localStore, t).then((e2) => __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n, e2));
}
async function __PRIVATE_syncEngineApplyBatchState(e, t, n, r2) {
  const i = __PRIVATE_debugCast(e), s = await function __PRIVATE_localStoreLookupMutationDocuments(e2, t2) {
    const n2 = __PRIVATE_debugCast(e2), r3 = __PRIVATE_debugCast(n2.mutationQueue);
    return n2.persistence.runTransaction("Lookup mutation documents", "readonly", (e3) => r3.Cn(e3, t2).next((t3) => t3 ? n2.localDocuments.getDocuments(e3, t3) : PersistencePromise.resolve(null)));
  }(i.localStore, t);
  s !== null ? (n === "pending" ? await __PRIVATE_fillWritePipeline(i.remoteStore) : n === "acknowledged" || n === "rejected" ? (__PRIVATE_processUserCallback(i, t, r2 || null), __PRIVATE_triggerPendingWritesCallbacks(i, t), function __PRIVATE_localStoreRemoveCachedMutationBatchMetadata(e2, t2) {
    __PRIVATE_debugCast(__PRIVATE_debugCast(e2).mutationQueue).Fn(t2);
  }(i.localStore, t)) : fail(), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(i, s)) : __PRIVATE_logDebug("SyncEngine", "Cannot apply mutation batch with id: " + t);
}
async function __PRIVATE_syncEngineApplyPrimaryState(e, t) {
  const n = __PRIVATE_debugCast(e);
  if (__PRIVATE_ensureWatchCallbacks(n), __PRIVATE_syncEngineEnsureWriteCallbacks(n), t === true && n.La !== true) {
    const e2 = n.sharedClientState.getAllActiveQueryTargets(), t2 = await __PRIVATE_synchronizeQueryViewsAndRaiseSnapshots(n, e2.toArray());
    n.La = true, await __PRIVATE_remoteStoreApplyPrimaryState(n.remoteStore, true);
    for (const e3 of t2)
      __PRIVATE_remoteStoreListen(n.remoteStore, e3);
  } else if (t === false && n.La !== false) {
    const e2 = [];
    let t2 = Promise.resolve();
    n.Da.forEach((r2, i) => {
      n.sharedClientState.isLocalQueryTarget(i) ? e2.push(i) : t2 = t2.then(() => (__PRIVATE_removeAndCleanupTarget(n, i), __PRIVATE_localStoreReleaseTarget(n.localStore, i, true))), __PRIVATE_remoteStoreUnlisten(n.remoteStore, i);
    }), await t2, await __PRIVATE_synchronizeQueryViewsAndRaiseSnapshots(n, e2), function __PRIVATE_resetLimboDocuments(e3) {
      const t3 = __PRIVATE_debugCast(e3);
      t3.Fa.forEach((e4, n2) => {
        __PRIVATE_remoteStoreUnlisten(t3.remoteStore, n2);
      }), t3.Ma.Vr(), t3.Fa = new Map, t3.va = new SortedMap(DocumentKey.comparator);
    }(n), n.La = false, await __PRIVATE_remoteStoreApplyPrimaryState(n.remoteStore, false);
  }
}
async function __PRIVATE_synchronizeQueryViewsAndRaiseSnapshots(e, t, n) {
  const r2 = __PRIVATE_debugCast(e), i = [], s = [];
  for (const e2 of t) {
    let t2;
    const n2 = r2.Da.get(e2);
    if (n2 && n2.length !== 0) {
      t2 = await __PRIVATE_localStoreAllocateTarget(r2.localStore, __PRIVATE_queryToTarget(n2[0]));
      for (const e3 of n2) {
        const t3 = r2.ba.get(e3), n3 = await __PRIVATE_synchronizeViewAndComputeSnapshot(r2, t3);
        n3.snapshot && s.push(n3.snapshot);
      }
    } else {
      const n3 = await __PRIVATE_localStoreGetCachedTarget(r2.localStore, e2);
      t2 = await __PRIVATE_localStoreAllocateTarget(r2.localStore, n3), await __PRIVATE_initializeViewAndComputeSnapshot(r2, __PRIVATE_synthesizeTargetToQuery(n3), e2, false, t2.resumeToken);
    }
    i.push(t2);
  }
  return r2.Sa.l_(s), i;
}
var __PRIVATE_synthesizeTargetToQuery = function(e) {
  return __PRIVATE_newQuery(e.path, e.collectionGroup, e.orderBy, e.filters, e.limit, "F", e.startAt, e.endAt);
};
var __PRIVATE_syncEngineGetActiveClients = function(e) {
  return function __PRIVATE_localStoreGetActiveClients(e2) {
    return __PRIVATE_debugCast(__PRIVATE_debugCast(e2).persistence).Li();
  }(__PRIVATE_debugCast(e).localStore);
};
async function __PRIVATE_syncEngineApplyTargetState(e, t, n, r2) {
  const i = __PRIVATE_debugCast(e);
  if (i.La)
    return void __PRIVATE_logDebug("SyncEngine", "Ignoring unexpected query state notification.");
  const s = i.Da.get(t);
  if (s && s.length > 0)
    switch (n) {
      case "current":
      case "not-current": {
        const e2 = await __PRIVATE_localStoreGetNewDocumentChanges(i.localStore, __PRIVATE_queryCollectionGroup(s[0])), r3 = RemoteEvent.createSynthesizedRemoteEventForCurrentChange(t, n === "current", ByteString.EMPTY_BYTE_STRING);
        await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(i, e2, r3);
        break;
      }
      case "rejected":
        await __PRIVATE_localStoreReleaseTarget(i.localStore, t, true), __PRIVATE_removeAndCleanupTarget(i, t, r2);
        break;
      default:
        fail();
    }
}
async function __PRIVATE_syncEngineApplyActiveTargetsChange(e, t, n) {
  const r2 = __PRIVATE_ensureWatchCallbacks(e);
  if (r2.La) {
    for (const e2 of t) {
      if (r2.Da.has(e2) && r2.sharedClientState.isActiveQueryTarget(e2)) {
        __PRIVATE_logDebug("SyncEngine", "Adding an already active target " + e2);
        continue;
      }
      const t2 = await __PRIVATE_localStoreGetCachedTarget(r2.localStore, e2), n2 = await __PRIVATE_localStoreAllocateTarget(r2.localStore, t2);
      await __PRIVATE_initializeViewAndComputeSnapshot(r2, __PRIVATE_synthesizeTargetToQuery(t2), n2.targetId, false, n2.resumeToken), __PRIVATE_remoteStoreListen(r2.remoteStore, n2);
    }
    for (const e2 of n)
      r2.Da.has(e2) && await __PRIVATE_localStoreReleaseTarget(r2.localStore, e2, false).then(() => {
        __PRIVATE_remoteStoreUnlisten(r2.remoteStore, e2), __PRIVATE_removeAndCleanupTarget(r2, e2);
      }).catch(__PRIVATE_ignoreIfPrimaryLeaseLoss);
  }
}
var __PRIVATE_ensureWatchCallbacks = function(e) {
  const t = __PRIVATE_debugCast(e);
  return t.remoteStore.remoteSyncer.applyRemoteEvent = __PRIVATE_syncEngineApplyRemoteEvent.bind(null, t), t.remoteStore.remoteSyncer.getRemoteKeysForTarget = __PRIVATE_syncEngineGetRemoteKeysForTarget.bind(null, t), t.remoteStore.remoteSyncer.rejectListen = __PRIVATE_syncEngineRejectListen.bind(null, t), t.Sa.l_ = __PRIVATE_eventManagerOnWatchChange.bind(null, t.eventManager), t.Sa.ka = __PRIVATE_eventManagerOnWatchError.bind(null, t.eventManager), t;
};
var __PRIVATE_syncEngineEnsureWriteCallbacks = function(e) {
  const t = __PRIVATE_debugCast(e);
  return t.remoteStore.remoteSyncer.applySuccessfulWrite = __PRIVATE_syncEngineApplySuccessfulWrite.bind(null, t), t.remoteStore.remoteSyncer.rejectFailedWrite = __PRIVATE_syncEngineRejectFailedWrite.bind(null, t), t;
};
async function __PRIVATE_setOfflineComponentProvider(e, t) {
  e.asyncQueue.verifyOperationInProgress(), __PRIVATE_logDebug("FirestoreClient", "Initializing OfflineComponentProvider");
  const n = e.configuration;
  await t.initialize(n);
  let r2 = n.initialUser;
  e.setCredentialChangeListener(async (e2) => {
    r2.isEqual(e2) || (await __PRIVATE_localStoreHandleUserChange(t.localStore, e2), r2 = e2);
  }), t.persistence.setDatabaseDeletedListener(() => e.terminate()), e._offlineComponents = t;
}
async function __PRIVATE_setOnlineComponentProvider(e, t) {
  e.asyncQueue.verifyOperationInProgress();
  const n = await __PRIVATE_ensureOfflineComponents(e);
  __PRIVATE_logDebug("FirestoreClient", "Initializing OnlineComponentProvider"), await t.initialize(n, e.configuration), e.setCredentialChangeListener((e2) => __PRIVATE_remoteStoreHandleCredentialChange(t.remoteStore, e2)), e.setAppCheckTokenChangeListener((e2, n2) => __PRIVATE_remoteStoreHandleCredentialChange(t.remoteStore, n2)), e._onlineComponents = t;
}
var __PRIVATE_canFallbackFromIndexedDbError = function(e) {
  return e.name === "FirebaseError" ? e.code === C2.FAILED_PRECONDITION || e.code === C2.UNIMPLEMENTED : !(typeof DOMException != "undefined" && e instanceof DOMException) || (e.code === 22 || e.code === 20 || e.code === 11);
};
async function __PRIVATE_ensureOfflineComponents(e) {
  if (!e._offlineComponents)
    if (e._uninitializedComponentsProvider) {
      __PRIVATE_logDebug("FirestoreClient", "Using user provided OfflineComponentProvider");
      try {
        await __PRIVATE_setOfflineComponentProvider(e, e._uninitializedComponentsProvider._offline);
      } catch (t) {
        const n = t;
        if (!__PRIVATE_canFallbackFromIndexedDbError(n))
          throw n;
        __PRIVATE_logWarn("Error using user provided cache. Falling back to memory cache: " + n), await __PRIVATE_setOfflineComponentProvider(e, new MemoryOfflineComponentProvider);
      }
    } else
      __PRIVATE_logDebug("FirestoreClient", "Using default OfflineComponentProvider"), await __PRIVATE_setOfflineComponentProvider(e, new MemoryOfflineComponentProvider);
  return e._offlineComponents;
}
async function __PRIVATE_ensureOnlineComponents(e) {
  return e._onlineComponents || (e._uninitializedComponentsProvider ? (__PRIVATE_logDebug("FirestoreClient", "Using user provided OnlineComponentProvider"), await __PRIVATE_setOnlineComponentProvider(e, e._uninitializedComponentsProvider._online)) : (__PRIVATE_logDebug("FirestoreClient", "Using default OnlineComponentProvider"), await __PRIVATE_setOnlineComponentProvider(e, new OnlineComponentProvider))), e._onlineComponents;
}
var __PRIVATE_getLocalStore = function(e) {
  return __PRIVATE_ensureOfflineComponents(e).then((e2) => e2.localStore);
};
async function __PRIVATE_getEventManager(e) {
  const t = await __PRIVATE_ensureOnlineComponents(e), n = t.eventManager;
  return n.onListen = __PRIVATE_syncEngineListen.bind(null, t.syncEngine), n.onUnlisten = __PRIVATE_syncEngineUnlisten.bind(null, t.syncEngine), n.onFirstRemoteStoreListen = __PRIVATE_triggerRemoteStoreListen.bind(null, t.syncEngine), n.onLastRemoteStoreUnlisten = __PRIVATE_triggerRemoteStoreUnlisten.bind(null, t.syncEngine), n;
}
var __PRIVATE_firestoreClientGetDocumentFromLocalCache = function(e, t) {
  const n = new __PRIVATE_Deferred;
  return e.asyncQueue.enqueueAndForget(async () => async function __PRIVATE_readDocumentFromCache(e2, t2, n2) {
    try {
      const r2 = await function __PRIVATE_localStoreReadDocument(e3, t3) {
        const n3 = __PRIVATE_debugCast(e3);
        return n3.persistence.runTransaction("read document", "readonly", (e4) => n3.localDocuments.getDocument(e4, t3));
      }(e2, t2);
      r2.isFoundDocument() ? n2.resolve(r2) : r2.isNoDocument() ? n2.resolve(null) : n2.reject(new FirestoreError(C2.UNAVAILABLE, "Failed to get document from cache. (However, this document may exist on the server. Run again without setting 'source' in the GetOptions to attempt to retrieve the document from the server.)"));
    } catch (e3) {
      const r2 = __PRIVATE_wrapInUserErrorIfRecoverable(e3, `Failed to get document '${t2} from cache`);
      n2.reject(r2);
    }
  }(await __PRIVATE_getLocalStore(e), t, n)), n.promise;
};
var __PRIVATE_firestoreClientGetDocumentViaSnapshotListener = function(e, t, n = {}) {
  const r2 = new __PRIVATE_Deferred;
  return e.asyncQueue.enqueueAndForget(async () => function __PRIVATE_readDocumentViaSnapshotListener(e2, t2, n2, r3, i) {
    const s = new __PRIVATE_AsyncObserver({
      next: (s2) => {
        t2.enqueueAndForget(() => __PRIVATE_eventManagerUnlisten(e2, o));
        const _ = s2.docs.has(n2);
        !_ && s2.fromCache ? i.reject(new FirestoreError(C2.UNAVAILABLE, "Failed to get document because the client is offline.")) : _ && s2.fromCache && r3 && r3.source === "server" ? i.reject(new FirestoreError(C2.UNAVAILABLE, 'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')) : i.resolve(s2);
      },
      error: (e3) => i.reject(e3)
    }), o = new __PRIVATE_QueryListener(__PRIVATE_newQueryForPath(n2.path), s, {
      includeMetadataChanges: true,
      ra: true
    });
    return __PRIVATE_eventManagerListen(e2, o);
  }(await __PRIVATE_getEventManager(e), e.asyncQueue, t, n, r2)), r2.promise;
};
var __PRIVATE_cloneLongPollingOptions = function(e) {
  const t = {};
  return e.timeoutSeconds !== undefined && (t.timeoutSeconds = e.timeoutSeconds), t;
};
var __PRIVATE_validateNonEmptyArgument = function(e, t, n) {
  if (!n)
    throw new FirestoreError(C2.INVALID_ARGUMENT, `Function ${e}() cannot be called with an empty ${t}.`);
};
var __PRIVATE_validateIsNotUsedTogether = function(e, t, n, r2) {
  if (t === true && r2 === true)
    throw new FirestoreError(C2.INVALID_ARGUMENT, `${e} and ${n} cannot be used together.`);
};
var __PRIVATE_validateDocumentPath = function(e) {
  if (!DocumentKey.isDocumentKey(e))
    throw new FirestoreError(C2.INVALID_ARGUMENT, `Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`);
};
var __PRIVATE_valueDescription = function(e) {
  if (e === undefined)
    return "undefined";
  if (e === null)
    return "null";
  if (typeof e == "string")
    return e.length > 20 && (e = `${e.substring(0, 20)}...`), JSON.stringify(e);
  if (typeof e == "number" || typeof e == "boolean")
    return "" + e;
  if (typeof e == "object") {
    if (e instanceof Array)
      return "an array";
    {
      const t = function __PRIVATE_tryGetCustomObjectType(e2) {
        if (e2.constructor)
          return e2.constructor.name;
        return null;
      }(e);
      return t ? `a custom ${t} object` : "an object";
    }
  }
  return typeof e == "function" ? "a function" : fail();
};
var __PRIVATE_cast = function(e, t) {
  if ("_delegate" in e && (e = e._delegate), !(e instanceof t)) {
    if (t.name === e.constructor.name)
      throw new FirestoreError(C2.INVALID_ARGUMENT, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
    {
      const n = __PRIVATE_valueDescription(e);
      throw new FirestoreError(C2.INVALID_ARGUMENT, `Expected type '${t.name}', but it was: ${n}`);
    }
  }
  return e;
};
var doc = function(e, t, ...n) {
  if (e = getModularInstance(e), arguments.length === 1 && (t = __PRIVATE_AutoId.newId()), __PRIVATE_validateNonEmptyArgument("doc", "path", t), e instanceof Firestore$1) {
    const r2 = ResourcePath.fromString(t, ...n);
    return __PRIVATE_validateDocumentPath(r2), new DocumentReference(e, null, new DocumentKey(r2));
  }
  {
    if (!(e instanceof DocumentReference || e instanceof CollectionReference))
      throw new FirestoreError(C2.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
    const r2 = e._path.child(ResourcePath.fromString(t, ...n));
    return __PRIVATE_validateDocumentPath(r2), new DocumentReference(e.firestore, e instanceof CollectionReference ? e.converter : null, new DocumentKey(r2));
  }
};
var initializeFirestore = function(e, t, n) {
  n || (n = "(default)");
  const r2 = _getProvider(e, "firestore");
  if (r2.isInitialized(n)) {
    const e2 = r2.getImmediate({
      identifier: n
    }), i = r2.getOptions(n);
    if (deepEqual(i, t))
      return e2;
    throw new FirestoreError(C2.FAILED_PRECONDITION, "initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.");
  }
  if (t.cacheSizeBytes !== undefined && t.localCache !== undefined)
    throw new FirestoreError(C2.INVALID_ARGUMENT, "cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");
  if (t.cacheSizeBytes !== undefined && t.cacheSizeBytes !== -1 && t.cacheSizeBytes < 1048576)
    throw new FirestoreError(C2.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
  return r2.initialize({
    options: t,
    instanceIdentifier: n
  });
};
var ensureFirestoreConfigured = function(e) {
  return e._firestoreClient || __PRIVATE_configureFirestore(e), e._firestoreClient.verifyNotTerminated(), e._firestoreClient;
};
var __PRIVATE_configureFirestore = function(e) {
  var t, n, r2;
  const i = e._freezeSettings(), s = function __PRIVATE_makeDatabaseInfo(e2, t2, n2, r3) {
    return new DatabaseInfo(e2, t2, n2, r3.host, r3.ssl, r3.experimentalForceLongPolling, r3.experimentalAutoDetectLongPolling, __PRIVATE_cloneLongPollingOptions(r3.experimentalLongPollingOptions), r3.useFetchStreams);
  }(e._databaseId, ((t = e._app) === null || t === undefined ? undefined : t.options.appId) || "", e._persistenceKey, i);
  e._firestoreClient = new FirestoreClient(e._authCredentials, e._appCheckCredentials, e._queue, s), ((n = i.localCache) === null || n === undefined ? undefined : n._offlineComponentProvider) && ((r2 = i.localCache) === null || r2 === undefined ? undefined : r2._onlineComponentProvider) && (e._firestoreClient._uninitializedComponentsProvider = {
    _offlineKind: i.localCache.kind,
    _offline: i.localCache._offlineComponentProvider,
    _online: i.localCache._onlineComponentProvider
  });
};
var __PRIVATE_fieldPathFromDotSeparatedString = function(e, t, n) {
  if (t.search(be2) >= 0)
    throw __PRIVATE_createError(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`, e, false, undefined, n);
  try {
    return new FieldPath(...t.split("."))._internalPath;
  } catch (r2) {
    throw __PRIVATE_createError(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`, e, false, undefined, n);
  }
};
var __PRIVATE_createError = function(e, t, n, r2, i) {
  const s = r2 && !r2.isEmpty(), o = i !== undefined;
  let _ = `Function ${t}() called with invalid data`;
  n && (_ += " (via `toFirestore()`)"), _ += ". ";
  let a = "";
  return (s || o) && (a += " (found", s && (a += ` in field ${r2}`), o && (a += ` in document ${i}`), a += ")"), new FirestoreError(C2.INVALID_ARGUMENT, _ + e + a);
};
var __PRIVATE_fieldPathFromArgument = function(e, t) {
  return typeof t == "string" ? __PRIVATE_fieldPathFromDotSeparatedString(e, t) : t instanceof FieldPath ? t._internalPath : t._delegate._internalPath;
};
var getDoc = function(e) {
  e = __PRIVATE_cast(e, DocumentReference);
  const t = __PRIVATE_cast(e.firestore, Firestore);
  return __PRIVATE_firestoreClientGetDocumentViaSnapshotListener(ensureFirestoreConfigured(t), e._key).then((n) => __PRIVATE_convertToDocSnapshot(t, e, n));
};
var getDocFromCache = function(e) {
  e = __PRIVATE_cast(e, DocumentReference);
  const t = __PRIVATE_cast(e.firestore, Firestore), n = ensureFirestoreConfigured(t), r2 = new __PRIVATE_ExpUserDataWriter(t);
  return __PRIVATE_firestoreClientGetDocumentFromLocalCache(n, e._key).then((n2) => new DocumentSnapshot(t, r2, e._key, n2, new SnapshotMetadata(n2 !== null && n2.hasLocalMutations, true), e.converter));
};
var __PRIVATE_convertToDocSnapshot = function(e, t, n) {
  const r2 = n.docs.get(t._key), i = new __PRIVATE_ExpUserDataWriter(e);
  return new DocumentSnapshot(e, i, t._key, r2, new SnapshotMetadata(n.hasPendingWrites, n.fromCache), t.converter);
};
var persistentLocalCache = function(e) {
  return new __PRIVATE_PersistentLocalCacheImpl(e);
};
var persistentSingleTabManager = function(e) {
  return new __PRIVATE_SingleTabManagerImpl(e == null ? undefined : e.forceOwnership);
};
var persistentMultipleTabManager = function() {
  return new __PRIVATE_MultiTabManagerImpl;
};
var S2 = "@firebase/firestore";

class User {
  constructor(e) {
    this.uid = e;
  }
  isAuthenticated() {
    return this.uid != null;
  }
  toKey() {
    return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
  }
  isEqual(e) {
    return e.uid === this.uid;
  }
}
User.UNAUTHENTICATED = new User(null), User.GOOGLE_CREDENTIALS = new User("google-credentials-uid"), User.FIRST_PARTY = new User("first-party-uid"), User.MOCK_USER = new User("mock-user");
var b = "10.11.1";
var D2 = new Logger("@firebase/firestore");
var C2 = {
  OK: "ok",
  CANCELLED: "cancelled",
  UNKNOWN: "unknown",
  INVALID_ARGUMENT: "invalid-argument",
  DEADLINE_EXCEEDED: "deadline-exceeded",
  NOT_FOUND: "not-found",
  ALREADY_EXISTS: "already-exists",
  PERMISSION_DENIED: "permission-denied",
  UNAUTHENTICATED: "unauthenticated",
  RESOURCE_EXHAUSTED: "resource-exhausted",
  FAILED_PRECONDITION: "failed-precondition",
  ABORTED: "aborted",
  OUT_OF_RANGE: "out-of-range",
  UNIMPLEMENTED: "unimplemented",
  INTERNAL: "internal",
  UNAVAILABLE: "unavailable",
  DATA_LOSS: "data-loss"
};

class FirestoreError extends FirebaseError {
  constructor(e, t) {
    super(e, t), this.code = e, this.message = t, this.toString = () => `${this.name}: [code=${this.code}]: ${this.message}`;
  }
}

class __PRIVATE_Deferred {
  constructor() {
    this.promise = new Promise((e, t) => {
      this.resolve = e, this.reject = t;
    });
  }
}

class __PRIVATE_OAuthToken {
  constructor(e, t) {
    this.user = t, this.type = "OAuth", this.headers = new Map, this.headers.set("Authorization", `Bearer ${e}`);
  }
}

class __PRIVATE_EmptyAuthCredentialsProvider {
  getToken() {
    return Promise.resolve(null);
  }
  invalidateToken() {
  }
  start(e, t) {
    e.enqueueRetryable(() => t(User.UNAUTHENTICATED));
  }
  shutdown() {
  }
}
class __PRIVATE_FirebaseAuthCredentialsProvider {
  constructor(e) {
    this.t = e, this.currentUser = User.UNAUTHENTICATED, this.i = 0, this.forceRefresh = false, this.auth = null;
  }
  start(e, t) {
    let n = this.i;
    const __PRIVATE_guardedChangeListener = (e2) => this.i !== n ? (n = this.i, t(e2)) : Promise.resolve();
    let r2 = new __PRIVATE_Deferred;
    this.o = () => {
      this.i++, this.currentUser = this.u(), r2.resolve(), r2 = new __PRIVATE_Deferred, e.enqueueRetryable(() => __PRIVATE_guardedChangeListener(this.currentUser));
    };
    const __PRIVATE_awaitNextToken = () => {
      const t2 = r2;
      e.enqueueRetryable(async () => {
        await t2.promise, await __PRIVATE_guardedChangeListener(this.currentUser);
      });
    }, __PRIVATE_registerAuth = (e2) => {
      __PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "Auth detected"), this.auth = e2, this.auth.addAuthTokenListener(this.o), __PRIVATE_awaitNextToken();
    };
    this.t.onInit((e2) => __PRIVATE_registerAuth(e2)), setTimeout(() => {
      if (!this.auth) {
        const e2 = this.t.getImmediate({
          optional: true
        });
        e2 ? __PRIVATE_registerAuth(e2) : (__PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "Auth not yet detected"), r2.resolve(), r2 = new __PRIVATE_Deferred);
      }
    }, 0), __PRIVATE_awaitNextToken();
  }
  getToken() {
    const e = this.i, t = this.forceRefresh;
    return this.forceRefresh = false, this.auth ? this.auth.getToken(t).then((t2) => this.i !== e ? (__PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "getToken aborted due to token change."), this.getToken()) : t2 ? (__PRIVATE_hardAssert(typeof t2.accessToken == "string"), new __PRIVATE_OAuthToken(t2.accessToken, this.currentUser)) : null) : Promise.resolve(null);
  }
  invalidateToken() {
    this.forceRefresh = true;
  }
  shutdown() {
    this.auth && this.auth.removeAuthTokenListener(this.o);
  }
  u() {
    const e = this.auth && this.auth.getUid();
    return __PRIVATE_hardAssert(e === null || typeof e == "string"), new User(e);
  }
}

class __PRIVATE_FirstPartyToken {
  constructor(e, t, n) {
    this.l = e, this.h = t, this.P = n, this.type = "FirstParty", this.user = User.FIRST_PARTY, this.I = new Map;
  }
  T() {
    return this.P ? this.P() : null;
  }
  get headers() {
    this.I.set("X-Goog-AuthUser", this.l);
    const e = this.T();
    return e && this.I.set("Authorization", e), this.h && this.I.set("X-Goog-Iam-Authorization-Token", this.h), this.I;
  }
}

class __PRIVATE_FirstPartyAuthCredentialsProvider {
  constructor(e, t, n) {
    this.l = e, this.h = t, this.P = n;
  }
  getToken() {
    return Promise.resolve(new __PRIVATE_FirstPartyToken(this.l, this.h, this.P));
  }
  start(e, t) {
    e.enqueueRetryable(() => t(User.FIRST_PARTY));
  }
  shutdown() {
  }
  invalidateToken() {
  }
}

class AppCheckToken {
  constructor(e) {
    this.value = e, this.type = "AppCheck", this.headers = new Map, e && e.length > 0 && this.headers.set("x-firebase-appcheck", this.value);
  }
}

class __PRIVATE_FirebaseAppCheckTokenProvider {
  constructor(e) {
    this.A = e, this.forceRefresh = false, this.appCheck = null, this.R = null;
  }
  start(e, t) {
    const onTokenChanged = (e2) => {
      e2.error != null && __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", `Error getting App Check token; using placeholder token instead. Error: ${e2.error.message}`);
      const n = e2.token !== this.R;
      return this.R = e2.token, __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", `Received ${n ? "new" : "existing"} token.`), n ? t(e2.token) : Promise.resolve();
    };
    this.o = (t2) => {
      e.enqueueRetryable(() => onTokenChanged(t2));
    };
    const __PRIVATE_registerAppCheck = (e2) => {
      __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", "AppCheck detected"), this.appCheck = e2, this.appCheck.addTokenListener(this.o);
    };
    this.A.onInit((e2) => __PRIVATE_registerAppCheck(e2)), setTimeout(() => {
      if (!this.appCheck) {
        const e2 = this.A.getImmediate({
          optional: true
        });
        e2 ? __PRIVATE_registerAppCheck(e2) : __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", "AppCheck not yet detected");
      }
    }, 0);
  }
  getToken() {
    const e = this.forceRefresh;
    return this.forceRefresh = false, this.appCheck ? this.appCheck.getToken(e).then((e2) => e2 ? (__PRIVATE_hardAssert(typeof e2.token == "string"), this.R = e2.token, new AppCheckToken(e2.token)) : null) : Promise.resolve(null);
  }
  invalidateToken() {
    this.forceRefresh = true;
  }
  shutdown() {
    this.appCheck && this.appCheck.removeTokenListener(this.o);
  }
}
class __PRIVATE_AutoId {
  static newId() {
    const e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", t = Math.floor(256 / e.length) * e.length;
    let n = "";
    for (;n.length < 20; ) {
      const r2 = __PRIVATE_randomBytes(40);
      for (let i = 0;i < r2.length; ++i)
        n.length < 20 && r2[i] < t && (n += e.charAt(r2[i] % e.length));
    }
    return n;
  }
}

class Timestamp {
  constructor(e, t) {
    if (this.seconds = e, this.nanoseconds = t, t < 0)
      throw new FirestoreError(C2.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t);
    if (t >= 1e9)
      throw new FirestoreError(C2.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t);
    if (e < -62135596800)
      throw new FirestoreError(C2.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e);
    if (e >= 253402300800)
      throw new FirestoreError(C2.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e);
  }
  static now() {
    return Timestamp.fromMillis(Date.now());
  }
  static fromDate(e) {
    return Timestamp.fromMillis(e.getTime());
  }
  static fromMillis(e) {
    const t = Math.floor(e / 1000), n = Math.floor(1e6 * (e - 1000 * t));
    return new Timestamp(t, n);
  }
  toDate() {
    return new Date(this.toMillis());
  }
  toMillis() {
    return 1000 * this.seconds + this.nanoseconds / 1e6;
  }
  _compareTo(e) {
    return this.seconds === e.seconds ? __PRIVATE_primitiveComparator(this.nanoseconds, e.nanoseconds) : __PRIVATE_primitiveComparator(this.seconds, e.seconds);
  }
  isEqual(e) {
    return e.seconds === this.seconds && e.nanoseconds === this.nanoseconds;
  }
  toString() {
    return "Timestamp(seconds=" + this.seconds + ", nanoseconds=" + this.nanoseconds + ")";
  }
  toJSON() {
    return {
      seconds: this.seconds,
      nanoseconds: this.nanoseconds
    };
  }
  valueOf() {
    const e = this.seconds - -62135596800;
    return String(e).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0");
  }
}

class SnapshotVersion {
  constructor(e) {
    this.timestamp = e;
  }
  static fromTimestamp(e) {
    return new SnapshotVersion(e);
  }
  static min() {
    return new SnapshotVersion(new Timestamp(0, 0));
  }
  static max() {
    return new SnapshotVersion(new Timestamp(253402300799, 999999999));
  }
  compareTo(e) {
    return this.timestamp._compareTo(e.timestamp);
  }
  isEqual(e) {
    return this.timestamp.isEqual(e.timestamp);
  }
  toMicroseconds() {
    return 1e6 * this.timestamp.seconds + this.timestamp.nanoseconds / 1000;
  }
  toString() {
    return "SnapshotVersion(" + this.timestamp.toString() + ")";
  }
  toTimestamp() {
    return this.timestamp;
  }
}

class BasePath {
  constructor(e, t, n) {
    t === undefined ? t = 0 : t > e.length && fail(), n === undefined ? n = e.length - t : n > e.length - t && fail(), this.segments = e, this.offset = t, this.len = n;
  }
  get length() {
    return this.len;
  }
  isEqual(e) {
    return BasePath.comparator(this, e) === 0;
  }
  child(e) {
    const t = this.segments.slice(this.offset, this.limit());
    return e instanceof BasePath ? e.forEach((e2) => {
      t.push(e2);
    }) : t.push(e), this.construct(t);
  }
  limit() {
    return this.offset + this.length;
  }
  popFirst(e) {
    return e = e === undefined ? 1 : e, this.construct(this.segments, this.offset + e, this.length - e);
  }
  popLast() {
    return this.construct(this.segments, this.offset, this.length - 1);
  }
  firstSegment() {
    return this.segments[this.offset];
  }
  lastSegment() {
    return this.get(this.length - 1);
  }
  get(e) {
    return this.segments[this.offset + e];
  }
  isEmpty() {
    return this.length === 0;
  }
  isPrefixOf(e) {
    if (e.length < this.length)
      return false;
    for (let t = 0;t < this.length; t++)
      if (this.get(t) !== e.get(t))
        return false;
    return true;
  }
  isImmediateParentOf(e) {
    if (this.length + 1 !== e.length)
      return false;
    for (let t = 0;t < this.length; t++)
      if (this.get(t) !== e.get(t))
        return false;
    return true;
  }
  forEach(e) {
    for (let t = this.offset, n = this.limit();t < n; t++)
      e(this.segments[t]);
  }
  toArray() {
    return this.segments.slice(this.offset, this.limit());
  }
  static comparator(e, t) {
    const n = Math.min(e.length, t.length);
    for (let r2 = 0;r2 < n; r2++) {
      const n2 = e.get(r2), i = t.get(r2);
      if (n2 < i)
        return -1;
      if (n2 > i)
        return 1;
    }
    return e.length < t.length ? -1 : e.length > t.length ? 1 : 0;
  }
}

class ResourcePath extends BasePath {
  construct(e, t, n) {
    return new ResourcePath(e, t, n);
  }
  canonicalString() {
    return this.toArray().join("/");
  }
  toString() {
    return this.canonicalString();
  }
  toUriEncodedString() {
    return this.toArray().map(encodeURIComponent).join("/");
  }
  static fromString(...e) {
    const t = [];
    for (const n of e) {
      if (n.indexOf("//") >= 0)
        throw new FirestoreError(C2.INVALID_ARGUMENT, `Invalid segment (${n}). Paths must not contain // in them.`);
      t.push(...n.split("/").filter((e2) => e2.length > 0));
    }
    return new ResourcePath(t);
  }
  static emptyPath() {
    return new ResourcePath([]);
  }
}
var v2 = /^[_a-zA-Z][_a-zA-Z0-9]*$/;

class FieldPath$1 extends BasePath {
  construct(e, t, n) {
    return new FieldPath$1(e, t, n);
  }
  static isValidIdentifier(e) {
    return v2.test(e);
  }
  canonicalString() {
    return this.toArray().map((e) => (e = e.replace(/\\/g, "\\\\").replace(/`/g, "\\`"), FieldPath$1.isValidIdentifier(e) || (e = "`" + e + "`"), e)).join(".");
  }
  toString() {
    return this.canonicalString();
  }
  isKeyField() {
    return this.length === 1 && this.get(0) === "__name__";
  }
  static keyField() {
    return new FieldPath$1(["__name__"]);
  }
  static fromServerFormat(e) {
    const t = [];
    let n = "", r2 = 0;
    const __PRIVATE_addCurrentSegment = () => {
      if (n.length === 0)
        throw new FirestoreError(C2.INVALID_ARGUMENT, `Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
      t.push(n), n = "";
    };
    let i = false;
    for (;r2 < e.length; ) {
      const t2 = e[r2];
      if (t2 === "\\") {
        if (r2 + 1 === e.length)
          throw new FirestoreError(C2.INVALID_ARGUMENT, "Path has trailing escape character: " + e);
        const t3 = e[r2 + 1];
        if (t3 !== "\\" && t3 !== "." && t3 !== "`")
          throw new FirestoreError(C2.INVALID_ARGUMENT, "Path has invalid escape sequence: " + e);
        n += t3, r2 += 2;
      } else
        t2 === "`" ? (i = !i, r2++) : t2 !== "." || i ? (n += t2, r2++) : (__PRIVATE_addCurrentSegment(), r2++);
    }
    if (__PRIVATE_addCurrentSegment(), i)
      throw new FirestoreError(C2.INVALID_ARGUMENT, "Unterminated ` in path: " + e);
    return new FieldPath$1(t);
  }
  static emptyPath() {
    return new FieldPath$1([]);
  }
}

class DocumentKey {
  constructor(e) {
    this.path = e;
  }
  static fromPath(e) {
    return new DocumentKey(ResourcePath.fromString(e));
  }
  static fromName(e) {
    return new DocumentKey(ResourcePath.fromString(e).popFirst(5));
  }
  static empty() {
    return new DocumentKey(ResourcePath.emptyPath());
  }
  get collectionGroup() {
    return this.path.popLast().lastSegment();
  }
  hasCollectionId(e) {
    return this.path.length >= 2 && this.path.get(this.path.length - 2) === e;
  }
  getCollectionGroup() {
    return this.path.get(this.path.length - 2);
  }
  getCollectionPath() {
    return this.path.popLast();
  }
  isEqual(e) {
    return e !== null && ResourcePath.comparator(this.path, e.path) === 0;
  }
  toString() {
    return this.path.toString();
  }
  static comparator(e, t) {
    return ResourcePath.comparator(e.path, t.path);
  }
  static isDocumentKey(e) {
    return e.length % 2 == 0;
  }
  static fromSegments(e) {
    return new DocumentKey(new ResourcePath(e.slice()));
  }
}

class FieldIndex {
  constructor(e, t, n, r2) {
    this.indexId = e, this.collectionGroup = t, this.fields = n, this.indexState = r2;
  }
}
FieldIndex.UNKNOWN_ID = -1;

class IndexSegment {
  constructor(e, t) {
    this.fieldPath = e, this.kind = t;
  }
}

class IndexState {
  constructor(e, t) {
    this.sequenceNumber = e, this.offset = t;
  }
  static empty() {
    return new IndexState(0, IndexOffset.min());
  }
}

class IndexOffset {
  constructor(e, t, n) {
    this.readTime = e, this.documentKey = t, this.largestBatchId = n;
  }
  static min() {
    return new IndexOffset(SnapshotVersion.min(), DocumentKey.empty(), -1);
  }
  static max() {
    return new IndexOffset(SnapshotVersion.max(), DocumentKey.empty(), -1);
  }
}
var F2 = "The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";

class PersistenceTransaction {
  constructor() {
    this.onCommittedListeners = [];
  }
  addOnCommittedListener(e) {
    this.onCommittedListeners.push(e);
  }
  raiseOnCommittedEvent() {
    this.onCommittedListeners.forEach((e) => e());
  }
}

class PersistencePromise {
  constructor(e) {
    this.nextCallback = null, this.catchCallback = null, this.result = undefined, this.error = undefined, this.isDone = false, this.callbackAttached = false, e((e2) => {
      this.isDone = true, this.result = e2, this.nextCallback && this.nextCallback(e2);
    }, (e2) => {
      this.isDone = true, this.error = e2, this.catchCallback && this.catchCallback(e2);
    });
  }
  catch(e) {
    return this.next(undefined, e);
  }
  next(e, t) {
    return this.callbackAttached && fail(), this.callbackAttached = true, this.isDone ? this.error ? this.wrapFailure(t, this.error) : this.wrapSuccess(e, this.result) : new PersistencePromise((n, r2) => {
      this.nextCallback = (t2) => {
        this.wrapSuccess(e, t2).next(n, r2);
      }, this.catchCallback = (e2) => {
        this.wrapFailure(t, e2).next(n, r2);
      };
    });
  }
  toPromise() {
    return new Promise((e, t) => {
      this.next(e, t);
    });
  }
  wrapUserFunction(e) {
    try {
      const t = e();
      return t instanceof PersistencePromise ? t : PersistencePromise.resolve(t);
    } catch (e2) {
      return PersistencePromise.reject(e2);
    }
  }
  wrapSuccess(e, t) {
    return e ? this.wrapUserFunction(() => e(t)) : PersistencePromise.resolve(t);
  }
  wrapFailure(e, t) {
    return e ? this.wrapUserFunction(() => e(t)) : PersistencePromise.reject(t);
  }
  static resolve(e) {
    return new PersistencePromise((t, n) => {
      t(e);
    });
  }
  static reject(e) {
    return new PersistencePromise((t, n) => {
      n(e);
    });
  }
  static waitFor(e) {
    return new PersistencePromise((t, n) => {
      let r2 = 0, i = 0, s = false;
      e.forEach((e2) => {
        ++r2, e2.next(() => {
          ++i, s && i === r2 && t();
        }, (e3) => n(e3));
      }), s = true, i === r2 && t();
    });
  }
  static or(e) {
    let t = PersistencePromise.resolve(false);
    for (const n of e)
      t = t.next((e2) => e2 ? PersistencePromise.resolve(e2) : n());
    return t;
  }
  static forEach(e, t) {
    const n = [];
    return e.forEach((e2, r2) => {
      n.push(t.call(this, e2, r2));
    }), this.waitFor(n);
  }
  static mapArray(e, t) {
    return new PersistencePromise((n, r2) => {
      const i = e.length, s = new Array(i);
      let o = 0;
      for (let _ = 0;_ < i; _++) {
        const a = _;
        t(e[a]).next((e2) => {
          s[a] = e2, ++o, o === i && n(s);
        }, (e2) => r2(e2));
      }
    });
  }
  static doWhile(e, t) {
    return new PersistencePromise((n, r2) => {
      const process2 = () => {
        e() === true ? t().next(() => {
          process2();
        }, r2) : n();
      };
      process2();
    });
  }
}

class __PRIVATE_SimpleDbTransaction {
  constructor(e, t) {
    this.action = e, this.transaction = t, this.aborted = false, this.V = new __PRIVATE_Deferred, this.transaction.oncomplete = () => {
      this.V.resolve();
    }, this.transaction.onabort = () => {
      t.error ? this.V.reject(new __PRIVATE_IndexedDbTransactionError(e, t.error)) : this.V.resolve();
    }, this.transaction.onerror = (t2) => {
      const n = __PRIVATE_checkForAndReportiOSError(t2.target.error);
      this.V.reject(new __PRIVATE_IndexedDbTransactionError(e, n));
    };
  }
  static open(e, t, n, r2) {
    try {
      return new __PRIVATE_SimpleDbTransaction(t, e.transaction(r2, n));
    } catch (e2) {
      throw new __PRIVATE_IndexedDbTransactionError(t, e2);
    }
  }
  get m() {
    return this.V.promise;
  }
  abort(e) {
    e && this.V.reject(e), this.aborted || (__PRIVATE_logDebug("SimpleDb", "Aborting transaction:", e ? e.message : "Client-initiated abort"), this.aborted = true, this.transaction.abort());
  }
  g() {
    const e = this.transaction;
    this.aborted || typeof e.commit != "function" || e.commit();
  }
  store(e) {
    const t = this.transaction.objectStore(e);
    return new __PRIVATE_SimpleDbStore(t);
  }
}

class __PRIVATE_SimpleDb {
  constructor(e, t, n) {
    this.name = e, this.version = t, this.p = n;
    __PRIVATE_SimpleDb.S(getUA()) === 12.2 && __PRIVATE_logError("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.");
  }
  static delete(e) {
    return __PRIVATE_logDebug("SimpleDb", "Removing database:", e), __PRIVATE_wrapRequest(window.indexedDB.deleteDatabase(e)).toPromise();
  }
  static D() {
    if (!isIndexedDBAvailable())
      return false;
    if (__PRIVATE_SimpleDb.C())
      return true;
    const e = getUA(), t = __PRIVATE_SimpleDb.S(e), n = 0 < t && t < 10, r2 = __PRIVATE_getAndroidVersion(e), i = 0 < r2 && r2 < 4.5;
    return !(e.indexOf("MSIE ") > 0 || e.indexOf("Trident/") > 0 || e.indexOf("Edge/") > 0 || n || i);
  }
  static C() {
    var e;
    return typeof process != "undefined" && ((e = process.__PRIVATE_env) === null || e === undefined ? undefined : e.v) === "YES";
  }
  static F(e, t) {
    return e.store(t);
  }
  static S(e) {
    const t = e.match(/i(?:phone|pad|pod) os ([\d_]+)/i), n = t ? t[1].split("_").slice(0, 2).join(".") : "-1";
    return Number(n);
  }
  async M(e) {
    return this.db || (__PRIVATE_logDebug("SimpleDb", "Opening database:", this.name), this.db = await new Promise((t, n) => {
      const r2 = indexedDB.open(this.name, this.version);
      r2.onsuccess = (e2) => {
        const n2 = e2.target.result;
        t(n2);
      }, r2.onblocked = () => {
        n(new __PRIVATE_IndexedDbTransactionError(e, "Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."));
      }, r2.onerror = (t2) => {
        const r3 = t2.target.error;
        r3.name === "VersionError" ? n(new FirestoreError(C2.FAILED_PRECONDITION, "A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")) : r3.name === "InvalidStateError" ? n(new FirestoreError(C2.FAILED_PRECONDITION, "Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: " + r3)) : n(new __PRIVATE_IndexedDbTransactionError(e, r3));
      }, r2.onupgradeneeded = (e2) => {
        __PRIVATE_logDebug("SimpleDb", 'Database "' + this.name + '" requires upgrade from version:', e2.oldVersion);
        const t2 = e2.target.result;
        this.p.O(t2, r2.transaction, e2.oldVersion, this.version).next(() => {
          __PRIVATE_logDebug("SimpleDb", "Database upgrade to version " + this.version + " complete");
        });
      };
    })), this.N && (this.db.onversionchange = (e2) => this.N(e2)), this.db;
  }
  L(e) {
    this.N = e, this.db && (this.db.onversionchange = (t) => e(t));
  }
  async runTransaction(e, t, n, r2) {
    const i = t === "readonly";
    let s = 0;
    for (;; ) {
      ++s;
      try {
        this.db = await this.M(e);
        const t2 = __PRIVATE_SimpleDbTransaction.open(this.db, e, i ? "readonly" : "readwrite", n), s2 = r2(t2).next((e2) => (t2.g(), e2)).catch((e2) => (t2.abort(e2), PersistencePromise.reject(e2))).toPromise();
        return s2.catch(() => {
        }), await t2.m, s2;
      } catch (e2) {
        const t2 = e2, n2 = t2.name !== "FirebaseError" && s < 3;
        if (__PRIVATE_logDebug("SimpleDb", "Transaction failed with error:", t2.message, "Retrying:", n2), this.close(), !n2)
          return Promise.reject(t2);
      }
    }
  }
  close() {
    this.db && this.db.close(), this.db = undefined;
  }
}

class __PRIVATE_IterationController {
  constructor(e) {
    this.B = e, this.k = false, this.q = null;
  }
  get isDone() {
    return this.k;
  }
  get K() {
    return this.q;
  }
  set cursor(e) {
    this.B = e;
  }
  done() {
    this.k = true;
  }
  $(e) {
    this.q = e;
  }
  delete() {
    return __PRIVATE_wrapRequest(this.B.delete());
  }
}

class __PRIVATE_IndexedDbTransactionError extends FirestoreError {
  constructor(e, t) {
    super(C2.UNAVAILABLE, `IndexedDB transaction '${e}' failed: ${t}`), this.name = "IndexedDbTransactionError";
  }
}

class __PRIVATE_SimpleDbStore {
  constructor(e) {
    this.store = e;
  }
  put(e, t) {
    let n;
    return t !== undefined ? (__PRIVATE_logDebug("SimpleDb", "PUT", this.store.name, e, t), n = this.store.put(t, e)) : (__PRIVATE_logDebug("SimpleDb", "PUT", this.store.name, "<auto-key>", e), n = this.store.put(e)), __PRIVATE_wrapRequest(n);
  }
  add(e) {
    __PRIVATE_logDebug("SimpleDb", "ADD", this.store.name, e, e);
    return __PRIVATE_wrapRequest(this.store.add(e));
  }
  get(e) {
    return __PRIVATE_wrapRequest(this.store.get(e)).next((t) => (t === undefined && (t = null), __PRIVATE_logDebug("SimpleDb", "GET", this.store.name, e, t), t));
  }
  delete(e) {
    __PRIVATE_logDebug("SimpleDb", "DELETE", this.store.name, e);
    return __PRIVATE_wrapRequest(this.store.delete(e));
  }
  count() {
    __PRIVATE_logDebug("SimpleDb", "COUNT", this.store.name);
    return __PRIVATE_wrapRequest(this.store.count());
  }
  U(e, t) {
    const n = this.options(e, t), r2 = n.index ? this.store.index(n.index) : this.store;
    if (typeof r2.getAll == "function") {
      const e2 = r2.getAll(n.range);
      return new PersistencePromise((t2, n2) => {
        e2.onerror = (e3) => {
          n2(e3.target.error);
        }, e2.onsuccess = (e3) => {
          t2(e3.target.result);
        };
      });
    }
    {
      const e2 = this.cursor(n), t2 = [];
      return this.W(e2, (e3, n2) => {
        t2.push(n2);
      }).next(() => t2);
    }
  }
  G(e, t) {
    const n = this.store.getAll(e, t === null ? undefined : t);
    return new PersistencePromise((e2, t2) => {
      n.onerror = (e3) => {
        t2(e3.target.error);
      }, n.onsuccess = (t3) => {
        e2(t3.target.result);
      };
    });
  }
  j(e, t) {
    __PRIVATE_logDebug("SimpleDb", "DELETE ALL", this.store.name);
    const n = this.options(e, t);
    n.H = false;
    const r2 = this.cursor(n);
    return this.W(r2, (e2, t2, n2) => n2.delete());
  }
  J(e, t) {
    let n;
    t ? n = e : (n = {}, t = e);
    const r2 = this.cursor(n);
    return this.W(r2, t);
  }
  Y(e) {
    const t = this.cursor({});
    return new PersistencePromise((n, r2) => {
      t.onerror = (e2) => {
        const t2 = __PRIVATE_checkForAndReportiOSError(e2.target.error);
        r2(t2);
      }, t.onsuccess = (t2) => {
        const r3 = t2.target.result;
        r3 ? e(r3.primaryKey, r3.value).next((e2) => {
          e2 ? r3.continue() : n();
        }) : n();
      };
    });
  }
  W(e, t) {
    const n = [];
    return new PersistencePromise((r2, i) => {
      e.onerror = (e2) => {
        i(e2.target.error);
      }, e.onsuccess = (e2) => {
        const i2 = e2.target.result;
        if (!i2)
          return void r2();
        const s = new __PRIVATE_IterationController(i2), o = t(i2.primaryKey, i2.value, s);
        if (o instanceof PersistencePromise) {
          const e3 = o.catch((e4) => (s.done(), PersistencePromise.reject(e4)));
          n.push(e3);
        }
        s.isDone ? r2() : s.K === null ? i2.continue() : i2.continue(s.K);
      };
    }).next(() => PersistencePromise.waitFor(n));
  }
  options(e, t) {
    let n;
    return e !== undefined && (typeof e == "string" ? n = e : t = e), {
      index: n,
      range: t
    };
  }
  cursor(e) {
    let t = "next";
    if (e.reverse && (t = "prev"), e.index) {
      const n = this.store.index(e.index);
      return e.H ? n.openKeyCursor(e.range, t) : n.openCursor(e.range, t);
    }
    return this.store.openCursor(e.range, t);
  }
}
var M2 = false;

class __PRIVATE_IndexBackfillerScheduler {
  constructor(e, t) {
    this.asyncQueue = e, this.Z = t, this.task = null;
  }
  start() {
    this.X(15000);
  }
  stop() {
    this.task && (this.task.cancel(), this.task = null);
  }
  get started() {
    return this.task !== null;
  }
  X(e) {
    __PRIVATE_logDebug("IndexBackfiller", `Scheduled in ${e}ms`), this.task = this.asyncQueue.enqueueAfterDelay("index_backfill", e, async () => {
      this.task = null;
      try {
        __PRIVATE_logDebug("IndexBackfiller", `Documents written: ${await this.Z.ee()}`);
      } catch (e2) {
        __PRIVATE_isIndexedDbTransactionError(e2) ? __PRIVATE_logDebug("IndexBackfiller", "Ignoring IndexedDB error during index backfill: ", e2) : await __PRIVATE_ignoreIfPrimaryLeaseLoss(e2);
      }
      await this.X(60000);
    });
  }
}

class __PRIVATE_IndexBackfiller {
  constructor(e, t) {
    this.localStore = e, this.persistence = t;
  }
  async ee(e = 50) {
    return this.persistence.runTransaction("Backfill Indexes", "readwrite-primary", (t) => this.te(t, e));
  }
  te(e, t) {
    const n = new Set;
    let r2 = t, i = true;
    return PersistencePromise.doWhile(() => i === true && r2 > 0, () => this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next((t2) => {
      if (t2 !== null && !n.has(t2))
        return __PRIVATE_logDebug("IndexBackfiller", `Processing collection: ${t2}`), this.ne(e, t2, r2).next((e2) => {
          r2 -= e2, n.add(t2);
        });
      i = false;
    })).next(() => t - r2);
  }
  ne(e, t, n) {
    return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e, t).next((r2) => this.localStore.localDocuments.getNextDocuments(e, t, r2, n).next((n2) => {
      const i = n2.changes;
      return this.localStore.indexManager.updateIndexEntries(e, i).next(() => this.re(r2, n2)).next((n3) => (__PRIVATE_logDebug("IndexBackfiller", `Updating offset: ${n3}`), this.localStore.indexManager.updateCollectionGroup(e, t, n3))).next(() => i.size);
    }));
  }
  re(e, t) {
    let n = e;
    return t.changes.forEach((e2, t2) => {
      const r2 = __PRIVATE_newIndexOffsetFromDocument(t2);
      __PRIVATE_indexOffsetComparator(r2, n) > 0 && (n = r2);
    }), new IndexOffset(n.readTime, n.documentKey, Math.max(t.batchId, e.largestBatchId));
  }
}

class __PRIVATE_ListenSequence {
  constructor(e, t) {
    this.previousValue = e, t && (t.sequenceNumberHandler = (e2) => this.ie(e2), this.se = (e2) => t.writeSequenceNumber(e2));
  }
  ie(e) {
    return this.previousValue = Math.max(e, this.previousValue), this.previousValue;
  }
  next() {
    const e = ++this.previousValue;
    return this.se && this.se(e), e;
  }
}
__PRIVATE_ListenSequence.oe = -1;
var x2 = ["userId", "batchId"];
var O2 = {};
var N2 = ["prefixPath", "collectionGroup", "readTime", "documentId"];
var L = ["prefixPath", "collectionGroup", "documentId"];
var B2 = ["collectionGroup", "readTime", "prefixPath", "documentId"];
var k2 = ["canonicalId", "targetId"];
var q2 = ["targetId", "path"];
var Q2 = ["path", "targetId"];
var K2 = ["collectionId", "parent"];
var $ = ["indexId", "uid"];
var U2 = ["uid", "sequenceNumber"];
var W2 = ["indexId", "uid", "arrayValue", "directionalValue", "orderedDocumentKey", "documentKey"];
var G2 = ["indexId", "uid", "orderedDocumentKey"];
var z2 = ["userId", "collectionPath", "documentId"];
var j = ["userId", "collectionPath", "largestBatchId"];
var H2 = ["userId", "collectionGroup", "largestBatchId"];
var J2 = [...[...[...[...["mutationQueues", "mutations", "documentMutations", "remoteDocuments", "targets", "owner", "targetGlobal", "targetDocuments"], "clientMetadata"], "remoteDocumentGlobal"], "collectionParents"], "bundles", "namedQueries"];
var Y2 = [...J2, "documentOverlays"];
var Z2 = ["mutationQueues", "mutations", "documentMutations", "remoteDocumentsV14", "targets", "owner", "targetGlobal", "targetDocuments", "clientMetadata", "remoteDocumentGlobal", "collectionParents", "bundles", "namedQueries", "documentOverlays"];
var X2 = Z2;
var ee = [...X2, "indexConfiguration", "indexState", "indexEntries"];
var te = ee;

class __PRIVATE_IndexedDbTransaction extends PersistenceTransaction {
  constructor(e, t) {
    super(), this._e = e, this.currentSequenceNumber = t;
  }
}

class SortedMap {
  constructor(e, t) {
    this.comparator = e, this.root = t || LLRBNode.EMPTY;
  }
  insert(e, t) {
    return new SortedMap(this.comparator, this.root.insert(e, t, this.comparator).copy(null, null, LLRBNode.BLACK, null, null));
  }
  remove(e) {
    return new SortedMap(this.comparator, this.root.remove(e, this.comparator).copy(null, null, LLRBNode.BLACK, null, null));
  }
  get(e) {
    let t = this.root;
    for (;!t.isEmpty(); ) {
      const n = this.comparator(e, t.key);
      if (n === 0)
        return t.value;
      n < 0 ? t = t.left : n > 0 && (t = t.right);
    }
    return null;
  }
  indexOf(e) {
    let t = 0, n = this.root;
    for (;!n.isEmpty(); ) {
      const r2 = this.comparator(e, n.key);
      if (r2 === 0)
        return t + n.left.size;
      r2 < 0 ? n = n.left : (t += n.left.size + 1, n = n.right);
    }
    return -1;
  }
  isEmpty() {
    return this.root.isEmpty();
  }
  get size() {
    return this.root.size;
  }
  minKey() {
    return this.root.minKey();
  }
  maxKey() {
    return this.root.maxKey();
  }
  inorderTraversal(e) {
    return this.root.inorderTraversal(e);
  }
  forEach(e) {
    this.inorderTraversal((t, n) => (e(t, n), false));
  }
  toString() {
    const e = [];
    return this.inorderTraversal((t, n) => (e.push(`${t}:${n}`), false)), `{${e.join(", ")}}`;
  }
  reverseTraversal(e) {
    return this.root.reverseTraversal(e);
  }
  getIterator() {
    return new SortedMapIterator(this.root, null, this.comparator, false);
  }
  getIteratorFrom(e) {
    return new SortedMapIterator(this.root, e, this.comparator, false);
  }
  getReverseIterator() {
    return new SortedMapIterator(this.root, null, this.comparator, true);
  }
  getReverseIteratorFrom(e) {
    return new SortedMapIterator(this.root, e, this.comparator, true);
  }
}

class SortedMapIterator {
  constructor(e, t, n, r2) {
    this.isReverse = r2, this.nodeStack = [];
    let i = 1;
    for (;!e.isEmpty(); )
      if (i = t ? n(e.key, t) : 1, t && r2 && (i *= -1), i < 0)
        e = this.isReverse ? e.left : e.right;
      else {
        if (i === 0) {
          this.nodeStack.push(e);
          break;
        }
        this.nodeStack.push(e), e = this.isReverse ? e.right : e.left;
      }
  }
  getNext() {
    let e = this.nodeStack.pop();
    const t = {
      key: e.key,
      value: e.value
    };
    if (this.isReverse)
      for (e = e.left;!e.isEmpty(); )
        this.nodeStack.push(e), e = e.right;
    else
      for (e = e.right;!e.isEmpty(); )
        this.nodeStack.push(e), e = e.left;
    return t;
  }
  hasNext() {
    return this.nodeStack.length > 0;
  }
  peek() {
    if (this.nodeStack.length === 0)
      return null;
    const e = this.nodeStack[this.nodeStack.length - 1];
    return {
      key: e.key,
      value: e.value
    };
  }
}

class LLRBNode {
  constructor(e, t, n, r2, i) {
    this.key = e, this.value = t, this.color = n != null ? n : LLRBNode.RED, this.left = r2 != null ? r2 : LLRBNode.EMPTY, this.right = i != null ? i : LLRBNode.EMPTY, this.size = this.left.size + 1 + this.right.size;
  }
  copy(e, t, n, r2, i) {
    return new LLRBNode(e != null ? e : this.key, t != null ? t : this.value, n != null ? n : this.color, r2 != null ? r2 : this.left, i != null ? i : this.right);
  }
  isEmpty() {
    return false;
  }
  inorderTraversal(e) {
    return this.left.inorderTraversal(e) || e(this.key, this.value) || this.right.inorderTraversal(e);
  }
  reverseTraversal(e) {
    return this.right.reverseTraversal(e) || e(this.key, this.value) || this.left.reverseTraversal(e);
  }
  min() {
    return this.left.isEmpty() ? this : this.left.min();
  }
  minKey() {
    return this.min().key;
  }
  maxKey() {
    return this.right.isEmpty() ? this.key : this.right.maxKey();
  }
  insert(e, t, n) {
    let r2 = this;
    const i = n(e, r2.key);
    return r2 = i < 0 ? r2.copy(null, null, null, r2.left.insert(e, t, n), null) : i === 0 ? r2.copy(null, t, null, null, null) : r2.copy(null, null, null, null, r2.right.insert(e, t, n)), r2.fixUp();
  }
  removeMin() {
    if (this.left.isEmpty())
      return LLRBNode.EMPTY;
    let e = this;
    return e.left.isRed() || e.left.left.isRed() || (e = e.moveRedLeft()), e = e.copy(null, null, null, e.left.removeMin(), null), e.fixUp();
  }
  remove(e, t) {
    let n, r2 = this;
    if (t(e, r2.key) < 0)
      r2.left.isEmpty() || r2.left.isRed() || r2.left.left.isRed() || (r2 = r2.moveRedLeft()), r2 = r2.copy(null, null, null, r2.left.remove(e, t), null);
    else {
      if (r2.left.isRed() && (r2 = r2.rotateRight()), r2.right.isEmpty() || r2.right.isRed() || r2.right.left.isRed() || (r2 = r2.moveRedRight()), t(e, r2.key) === 0) {
        if (r2.right.isEmpty())
          return LLRBNode.EMPTY;
        n = r2.right.min(), r2 = r2.copy(n.key, n.value, null, null, r2.right.removeMin());
      }
      r2 = r2.copy(null, null, null, null, r2.right.remove(e, t));
    }
    return r2.fixUp();
  }
  isRed() {
    return this.color;
  }
  fixUp() {
    let e = this;
    return e.right.isRed() && !e.left.isRed() && (e = e.rotateLeft()), e.left.isRed() && e.left.left.isRed() && (e = e.rotateRight()), e.left.isRed() && e.right.isRed() && (e = e.colorFlip()), e;
  }
  moveRedLeft() {
    let e = this.colorFlip();
    return e.right.left.isRed() && (e = e.copy(null, null, null, null, e.right.rotateRight()), e = e.rotateLeft(), e = e.colorFlip()), e;
  }
  moveRedRight() {
    let e = this.colorFlip();
    return e.left.left.isRed() && (e = e.rotateRight(), e = e.colorFlip()), e;
  }
  rotateLeft() {
    const e = this.copy(null, null, LLRBNode.RED, null, this.right.left);
    return this.right.copy(null, null, this.color, e, null);
  }
  rotateRight() {
    const e = this.copy(null, null, LLRBNode.RED, this.left.right, null);
    return this.left.copy(null, null, this.color, null, e);
  }
  colorFlip() {
    const e = this.left.copy(null, null, !this.left.color, null, null), t = this.right.copy(null, null, !this.right.color, null, null);
    return this.copy(null, null, !this.color, e, t);
  }
  checkMaxDepth() {
    const e = this.check();
    return Math.pow(2, e) <= this.size + 1;
  }
  check() {
    if (this.isRed() && this.left.isRed())
      throw fail();
    if (this.right.isRed())
      throw fail();
    const e = this.left.check();
    if (e !== this.right.check())
      throw fail();
    return e + (this.isRed() ? 0 : 1);
  }
}
LLRBNode.EMPTY = null, LLRBNode.RED = true, LLRBNode.BLACK = false;
LLRBNode.EMPTY = new class LLRBEmptyNode {
  constructor() {
    this.size = 0;
  }
  get key() {
    throw fail();
  }
  get value() {
    throw fail();
  }
  get color() {
    throw fail();
  }
  get left() {
    throw fail();
  }
  get right() {
    throw fail();
  }
  copy(e, t, n, r2, i) {
    return this;
  }
  insert(e, t, n) {
    return new LLRBNode(e, t);
  }
  remove(e, t) {
    return this;
  }
  isEmpty() {
    return true;
  }
  inorderTraversal(e) {
    return false;
  }
  reverseTraversal(e) {
    return false;
  }
  minKey() {
    return null;
  }
  maxKey() {
    return null;
  }
  isRed() {
    return false;
  }
  checkMaxDepth() {
    return true;
  }
  check() {
    return 0;
  }
};

class SortedSet {
  constructor(e) {
    this.comparator = e, this.data = new SortedMap(this.comparator);
  }
  has(e) {
    return this.data.get(e) !== null;
  }
  first() {
    return this.data.minKey();
  }
  last() {
    return this.data.maxKey();
  }
  get size() {
    return this.data.size;
  }
  indexOf(e) {
    return this.data.indexOf(e);
  }
  forEach(e) {
    this.data.inorderTraversal((t, n) => (e(t), false));
  }
  forEachInRange(e, t) {
    const n = this.data.getIteratorFrom(e[0]);
    for (;n.hasNext(); ) {
      const r2 = n.getNext();
      if (this.comparator(r2.key, e[1]) >= 0)
        return;
      t(r2.key);
    }
  }
  forEachWhile(e, t) {
    let n;
    for (n = t !== undefined ? this.data.getIteratorFrom(t) : this.data.getIterator();n.hasNext(); ) {
      if (!e(n.getNext().key))
        return;
    }
  }
  firstAfterOrEqual(e) {
    const t = this.data.getIteratorFrom(e);
    return t.hasNext() ? t.getNext().key : null;
  }
  getIterator() {
    return new SortedSetIterator(this.data.getIterator());
  }
  getIteratorFrom(e) {
    return new SortedSetIterator(this.data.getIteratorFrom(e));
  }
  add(e) {
    return this.copy(this.data.remove(e).insert(e, true));
  }
  delete(e) {
    return this.has(e) ? this.copy(this.data.remove(e)) : this;
  }
  isEmpty() {
    return this.data.isEmpty();
  }
  unionWith(e) {
    let t = this;
    return t.size < e.size && (t = e, e = this), e.forEach((e2) => {
      t = t.add(e2);
    }), t;
  }
  isEqual(e) {
    if (!(e instanceof SortedSet))
      return false;
    if (this.size !== e.size)
      return false;
    const t = this.data.getIterator(), n = e.data.getIterator();
    for (;t.hasNext(); ) {
      const e2 = t.getNext().key, r2 = n.getNext().key;
      if (this.comparator(e2, r2) !== 0)
        return false;
    }
    return true;
  }
  toArray() {
    const e = [];
    return this.forEach((t) => {
      e.push(t);
    }), e;
  }
  toString() {
    const e = [];
    return this.forEach((t) => e.push(t)), "SortedSet(" + e.toString() + ")";
  }
  copy(e) {
    const t = new SortedSet(this.comparator);
    return t.data = e, t;
  }
}

class SortedSetIterator {
  constructor(e) {
    this.iter = e;
  }
  getNext() {
    return this.iter.getNext().key;
  }
  hasNext() {
    return this.iter.hasNext();
  }
}

class FieldMask {
  constructor(e) {
    this.fields = e, e.sort(FieldPath$1.comparator);
  }
  static empty() {
    return new FieldMask([]);
  }
  unionWith(e) {
    let t = new SortedSet(FieldPath$1.comparator);
    for (const e2 of this.fields)
      t = t.add(e2);
    for (const n of e)
      t = t.add(n);
    return new FieldMask(t.toArray());
  }
  covers(e) {
    for (const t of this.fields)
      if (t.isPrefixOf(e))
        return true;
    return false;
  }
  isEqual(e) {
    return __PRIVATE_arrayEquals(this.fields, e.fields, (e2, t) => e2.isEqual(t));
  }
}

class __PRIVATE_Base64DecodeError extends Error {
  constructor() {
    super(...arguments), this.name = "Base64DecodeError";
  }
}

class ByteString {
  constructor(e) {
    this.binaryString = e;
  }
  static fromBase64String(e) {
    const t = function __PRIVATE_decodeBase64(e2) {
      try {
        return atob(e2);
      } catch (e3) {
        throw typeof DOMException != "undefined" && e3 instanceof DOMException ? new __PRIVATE_Base64DecodeError("Invalid base64 string: " + e3) : e3;
      }
    }(e);
    return new ByteString(t);
  }
  static fromUint8Array(e) {
    const t = function __PRIVATE_binaryStringFromUint8Array(e2) {
      let t2 = "";
      for (let n = 0;n < e2.length; ++n)
        t2 += String.fromCharCode(e2[n]);
      return t2;
    }(e);
    return new ByteString(t);
  }
  [Symbol.iterator]() {
    let e = 0;
    return {
      next: () => e < this.binaryString.length ? {
        value: this.binaryString.charCodeAt(e++),
        done: false
      } : {
        value: undefined,
        done: true
      }
    };
  }
  toBase64() {
    return function __PRIVATE_encodeBase64(e) {
      return btoa(e);
    }(this.binaryString);
  }
  toUint8Array() {
    return function __PRIVATE_uint8ArrayFromBinaryString(e) {
      const t = new Uint8Array(e.length);
      for (let n = 0;n < e.length; n++)
        t[n] = e.charCodeAt(n);
      return t;
    }(this.binaryString);
  }
  approximateByteSize() {
    return 2 * this.binaryString.length;
  }
  compareTo(e) {
    return __PRIVATE_primitiveComparator(this.binaryString, e.binaryString);
  }
  isEqual(e) {
    return this.binaryString === e.binaryString;
  }
}
ByteString.EMPTY_BYTE_STRING = new ByteString("");
var ne = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);

class DatabaseInfo {
  constructor(e, t, n, r2, i, s, o, _, a) {
    this.databaseId = e, this.appId = t, this.persistenceKey = n, this.host = r2, this.ssl = i, this.forceLongPolling = s, this.autoDetectLongPolling = o, this.longPollingOptions = _, this.useFetchStreams = a;
  }
}

class DatabaseId {
  constructor(e, t) {
    this.projectId = e, this.database = t || "(default)";
  }
  static empty() {
    return new DatabaseId("", "");
  }
  get isDefaultDatabase() {
    return this.database === "(default)";
  }
  isEqual(e) {
    return e instanceof DatabaseId && e.projectId === this.projectId && e.database === this.database;
  }
}
var re = {
  mapValue: {
    fields: {
      __type__: {
        stringValue: "__max__"
      }
    }
  }
};
var ie = {
  nullValue: "NULL_VALUE"
};

class ObjectValue {
  constructor(e) {
    this.value = e;
  }
  static empty() {
    return new ObjectValue({
      mapValue: {}
    });
  }
  field(e) {
    if (e.isEmpty())
      return this.value;
    {
      let t = this.value;
      for (let n = 0;n < e.length - 1; ++n)
        if (t = (t.mapValue.fields || {})[e.get(n)], !__PRIVATE_isMapValue(t))
          return null;
      return t = (t.mapValue.fields || {})[e.lastSegment()], t || null;
    }
  }
  set(e, t) {
    this.getFieldsMap(e.popLast())[e.lastSegment()] = __PRIVATE_deepClone(t);
  }
  setAll(e) {
    let t = FieldPath$1.emptyPath(), n = {}, r2 = [];
    e.forEach((e2, i2) => {
      if (!t.isImmediateParentOf(i2)) {
        const e3 = this.getFieldsMap(t);
        this.applyChanges(e3, n, r2), n = {}, r2 = [], t = i2.popLast();
      }
      e2 ? n[i2.lastSegment()] = __PRIVATE_deepClone(e2) : r2.push(i2.lastSegment());
    });
    const i = this.getFieldsMap(t);
    this.applyChanges(i, n, r2);
  }
  delete(e) {
    const t = this.field(e.popLast());
    __PRIVATE_isMapValue(t) && t.mapValue.fields && delete t.mapValue.fields[e.lastSegment()];
  }
  isEqual(e) {
    return __PRIVATE_valueEquals(this.value, e.value);
  }
  getFieldsMap(e) {
    let t = this.value;
    t.mapValue.fields || (t.mapValue = {
      fields: {}
    });
    for (let n = 0;n < e.length; ++n) {
      let r2 = t.mapValue.fields[e.get(n)];
      __PRIVATE_isMapValue(r2) && r2.mapValue.fields || (r2 = {
        mapValue: {
          fields: {}
        }
      }, t.mapValue.fields[e.get(n)] = r2), t = r2;
    }
    return t.mapValue.fields;
  }
  applyChanges(e, t, n) {
    forEach(t, (t2, n2) => e[t2] = n2);
    for (const t2 of n)
      delete e[t2];
  }
  clone() {
    return new ObjectValue(__PRIVATE_deepClone(this.value));
  }
}

class MutableDocument {
  constructor(e, t, n, r2, i, s, o) {
    this.key = e, this.documentType = t, this.version = n, this.readTime = r2, this.createTime = i, this.data = s, this.documentState = o;
  }
  static newInvalidDocument(e) {
    return new MutableDocument(e, 0, SnapshotVersion.min(), SnapshotVersion.min(), SnapshotVersion.min(), ObjectValue.empty(), 0);
  }
  static newFoundDocument(e, t, n, r2) {
    return new MutableDocument(e, 1, t, SnapshotVersion.min(), n, r2, 0);
  }
  static newNoDocument(e, t) {
    return new MutableDocument(e, 2, t, SnapshotVersion.min(), SnapshotVersion.min(), ObjectValue.empty(), 0);
  }
  static newUnknownDocument(e, t) {
    return new MutableDocument(e, 3, t, SnapshotVersion.min(), SnapshotVersion.min(), ObjectValue.empty(), 2);
  }
  convertToFoundDocument(e, t) {
    return !this.createTime.isEqual(SnapshotVersion.min()) || this.documentType !== 2 && this.documentType !== 0 || (this.createTime = e), this.version = e, this.documentType = 1, this.data = t, this.documentState = 0, this;
  }
  convertToNoDocument(e) {
    return this.version = e, this.documentType = 2, this.data = ObjectValue.empty(), this.documentState = 0, this;
  }
  convertToUnknownDocument(e) {
    return this.version = e, this.documentType = 3, this.data = ObjectValue.empty(), this.documentState = 2, this;
  }
  setHasCommittedMutations() {
    return this.documentState = 2, this;
  }
  setHasLocalMutations() {
    return this.documentState = 1, this.version = SnapshotVersion.min(), this;
  }
  setReadTime(e) {
    return this.readTime = e, this;
  }
  get hasLocalMutations() {
    return this.documentState === 1;
  }
  get hasCommittedMutations() {
    return this.documentState === 2;
  }
  get hasPendingWrites() {
    return this.hasLocalMutations || this.hasCommittedMutations;
  }
  isValidDocument() {
    return this.documentType !== 0;
  }
  isFoundDocument() {
    return this.documentType === 1;
  }
  isNoDocument() {
    return this.documentType === 2;
  }
  isUnknownDocument() {
    return this.documentType === 3;
  }
  isEqual(e) {
    return e instanceof MutableDocument && this.key.isEqual(e.key) && this.version.isEqual(e.version) && this.documentType === e.documentType && this.documentState === e.documentState && this.data.isEqual(e.data);
  }
  mutableCopy() {
    return new MutableDocument(this.key, this.documentType, this.version, this.readTime, this.createTime, this.data.clone(), this.documentState);
  }
  toString() {
    return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`;
  }
}

class Bound {
  constructor(e, t) {
    this.position = e, this.inclusive = t;
  }
}

class OrderBy {
  constructor(e, t = "asc") {
    this.field = e, this.dir = t;
  }
}

class Filter {
}

class FieldFilter extends Filter {
  constructor(e, t, n) {
    super(), this.field = e, this.op = t, this.value = n;
  }
  static create(e, t, n) {
    return e.isKeyField() ? t === "in" || t === "not-in" ? this.createKeyFieldInFilter(e, t, n) : new __PRIVATE_KeyFieldFilter(e, t, n) : t === "array-contains" ? new __PRIVATE_ArrayContainsFilter(e, n) : t === "in" ? new __PRIVATE_InFilter(e, n) : t === "not-in" ? new __PRIVATE_NotInFilter(e, n) : t === "array-contains-any" ? new __PRIVATE_ArrayContainsAnyFilter(e, n) : new FieldFilter(e, t, n);
  }
  static createKeyFieldInFilter(e, t, n) {
    return t === "in" ? new __PRIVATE_KeyFieldInFilter(e, n) : new __PRIVATE_KeyFieldNotInFilter(e, n);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return this.op === "!=" ? t !== null && this.matchesComparison(__PRIVATE_valueCompare(t, this.value)) : t !== null && __PRIVATE_typeOrder(this.value) === __PRIVATE_typeOrder(t) && this.matchesComparison(__PRIVATE_valueCompare(t, this.value));
  }
  matchesComparison(e) {
    switch (this.op) {
      case "<":
        return e < 0;
      case "<=":
        return e <= 0;
      case "==":
        return e === 0;
      case "!=":
        return e !== 0;
      case ">":
        return e > 0;
      case ">=":
        return e >= 0;
      default:
        return fail();
    }
  }
  isInequality() {
    return ["<", "<=", ">", ">=", "!=", "not-in"].indexOf(this.op) >= 0;
  }
  getFlattenedFilters() {
    return [this];
  }
  getFilters() {
    return [this];
  }
}

class CompositeFilter extends Filter {
  constructor(e, t) {
    super(), this.filters = e, this.op = t, this.ae = null;
  }
  static create(e, t) {
    return new CompositeFilter(e, t);
  }
  matches(e) {
    return __PRIVATE_compositeFilterIsConjunction(this) ? this.filters.find((t) => !t.matches(e)) === undefined : this.filters.find((t) => t.matches(e)) !== undefined;
  }
  getFlattenedFilters() {
    return this.ae !== null || (this.ae = this.filters.reduce((e, t) => e.concat(t.getFlattenedFilters()), [])), this.ae;
  }
  getFilters() {
    return Object.assign([], this.filters);
  }
}

class __PRIVATE_KeyFieldFilter extends FieldFilter {
  constructor(e, t, n) {
    super(e, t, n), this.key = DocumentKey.fromName(n.referenceValue);
  }
  matches(e) {
    const t = DocumentKey.comparator(e.key, this.key);
    return this.matchesComparison(t);
  }
}

class __PRIVATE_KeyFieldInFilter extends FieldFilter {
  constructor(e, t) {
    super(e, "in", t), this.keys = __PRIVATE_extractDocumentKeysFromArrayValue("in", t);
  }
  matches(e) {
    return this.keys.some((t) => t.isEqual(e.key));
  }
}

class __PRIVATE_KeyFieldNotInFilter extends FieldFilter {
  constructor(e, t) {
    super(e, "not-in", t), this.keys = __PRIVATE_extractDocumentKeysFromArrayValue("not-in", t);
  }
  matches(e) {
    return !this.keys.some((t) => t.isEqual(e.key));
  }
}

class __PRIVATE_ArrayContainsFilter extends FieldFilter {
  constructor(e, t) {
    super(e, "array-contains", t);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return isArray(t) && __PRIVATE_arrayValueContains(t.arrayValue, this.value);
  }
}

class __PRIVATE_InFilter extends FieldFilter {
  constructor(e, t) {
    super(e, "in", t);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return t !== null && __PRIVATE_arrayValueContains(this.value.arrayValue, t);
  }
}

class __PRIVATE_NotInFilter extends FieldFilter {
  constructor(e, t) {
    super(e, "not-in", t);
  }
  matches(e) {
    if (__PRIVATE_arrayValueContains(this.value.arrayValue, {
      nullValue: "NULL_VALUE"
    }))
      return false;
    const t = e.data.field(this.field);
    return t !== null && !__PRIVATE_arrayValueContains(this.value.arrayValue, t);
  }
}

class __PRIVATE_ArrayContainsAnyFilter extends FieldFilter {
  constructor(e, t) {
    super(e, "array-contains-any", t);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return !(!isArray(t) || !t.arrayValue.values) && t.arrayValue.values.some((e2) => __PRIVATE_arrayValueContains(this.value.arrayValue, e2));
  }
}

class __PRIVATE_TargetImpl {
  constructor(e, t = null, n = [], r2 = [], i = null, s = null, o = null) {
    this.path = e, this.collectionGroup = t, this.orderBy = n, this.filters = r2, this.limit = i, this.startAt = s, this.endAt = o, this.ue = null;
  }
}

class __PRIVATE_QueryImpl {
  constructor(e, t = null, n = [], r2 = [], i = null, s = "F", o = null, _ = null) {
    this.path = e, this.collectionGroup = t, this.explicitOrderBy = n, this.filters = r2, this.limit = i, this.limitType = s, this.startAt = o, this.endAt = _, this.ce = null, this.le = null, this.he = null, this.startAt, this.endAt;
  }
}

class ObjectMap {
  constructor(e, t) {
    this.mapKeyFn = e, this.equalsFn = t, this.inner = {}, this.innerSize = 0;
  }
  get(e) {
    const t = this.mapKeyFn(e), n = this.inner[t];
    if (n !== undefined) {
      for (const [t2, r2] of n)
        if (this.equalsFn(t2, e))
          return r2;
    }
  }
  has(e) {
    return this.get(e) !== undefined;
  }
  set(e, t) {
    const n = this.mapKeyFn(e), r2 = this.inner[n];
    if (r2 === undefined)
      return this.inner[n] = [[e, t]], void this.innerSize++;
    for (let n2 = 0;n2 < r2.length; n2++)
      if (this.equalsFn(r2[n2][0], e))
        return void (r2[n2] = [e, t]);
    r2.push([e, t]), this.innerSize++;
  }
  delete(e) {
    const t = this.mapKeyFn(e), n = this.inner[t];
    if (n === undefined)
      return false;
    for (let r2 = 0;r2 < n.length; r2++)
      if (this.equalsFn(n[r2][0], e))
        return n.length === 1 ? delete this.inner[t] : n.splice(r2, 1), this.innerSize--, true;
    return false;
  }
  forEach(e) {
    forEach(this.inner, (t, n) => {
      for (const [t2, r2] of n)
        e(t2, r2);
    });
  }
  isEmpty() {
    return isEmpty(this.inner);
  }
  size() {
    return this.innerSize;
  }
}
var se = new SortedMap(DocumentKey.comparator);
var oe = new SortedMap(DocumentKey.comparator);
var _e = new SortedMap(DocumentKey.comparator);
var ae2 = new SortedSet(DocumentKey.comparator);
var ue = new SortedSet(__PRIVATE_primitiveComparator);

class TransformOperation {
  constructor() {
    this._ = undefined;
  }
}

class __PRIVATE_ServerTimestampTransform extends TransformOperation {
}

class __PRIVATE_ArrayUnionTransformOperation extends TransformOperation {
  constructor(e) {
    super(), this.elements = e;
  }
}

class __PRIVATE_ArrayRemoveTransformOperation extends TransformOperation {
  constructor(e) {
    super(), this.elements = e;
  }
}

class __PRIVATE_NumericIncrementTransformOperation extends TransformOperation {
  constructor(e, t) {
    super(), this.serializer = e, this.Pe = t;
  }
}

class FieldTransform {
  constructor(e, t) {
    this.field = e, this.transform = t;
  }
}

class MutationResult {
  constructor(e, t) {
    this.version = e, this.transformResults = t;
  }
}

class Precondition {
  constructor(e, t) {
    this.updateTime = e, this.exists = t;
  }
  static none() {
    return new Precondition;
  }
  static exists(e) {
    return new Precondition(undefined, e);
  }
  static updateTime(e) {
    return new Precondition(e);
  }
  get isNone() {
    return this.updateTime === undefined && this.exists === undefined;
  }
  isEqual(e) {
    return this.exists === e.exists && (this.updateTime ? !!e.updateTime && this.updateTime.isEqual(e.updateTime) : !e.updateTime);
  }
}

class Mutation {
}

class __PRIVATE_SetMutation extends Mutation {
  constructor(e, t, n, r2 = []) {
    super(), this.key = e, this.value = t, this.precondition = n, this.fieldTransforms = r2, this.type = 0;
  }
  getFieldMask() {
    return null;
  }
}

class __PRIVATE_PatchMutation extends Mutation {
  constructor(e, t, n, r2, i = []) {
    super(), this.key = e, this.data = t, this.fieldMask = n, this.precondition = r2, this.fieldTransforms = i, this.type = 1;
  }
  getFieldMask() {
    return this.fieldMask;
  }
}

class __PRIVATE_DeleteMutation extends Mutation {
  constructor(e, t) {
    super(), this.key = e, this.precondition = t, this.type = 2, this.fieldTransforms = [];
  }
  getFieldMask() {
    return null;
  }
}

class __PRIVATE_VerifyMutation extends Mutation {
  constructor(e, t) {
    super(), this.key = e, this.precondition = t, this.type = 3, this.fieldTransforms = [];
  }
  getFieldMask() {
    return null;
  }
}

class MutationBatch {
  constructor(e, t, n, r2) {
    this.batchId = e, this.localWriteTime = t, this.baseMutations = n, this.mutations = r2;
  }
  applyToRemoteDocument(e, t) {
    const n = t.mutationResults;
    for (let t2 = 0;t2 < this.mutations.length; t2++) {
      const r2 = this.mutations[t2];
      if (r2.key.isEqual(e.key)) {
        __PRIVATE_mutationApplyToRemoteDocument(r2, e, n[t2]);
      }
    }
  }
  applyToLocalView(e, t) {
    for (const n of this.baseMutations)
      n.key.isEqual(e.key) && (t = __PRIVATE_mutationApplyToLocalView(n, e, t, this.localWriteTime));
    for (const n of this.mutations)
      n.key.isEqual(e.key) && (t = __PRIVATE_mutationApplyToLocalView(n, e, t, this.localWriteTime));
    return t;
  }
  applyToLocalDocumentSet(e, t) {
    const n = __PRIVATE_newMutationMap();
    return this.mutations.forEach((r2) => {
      const i = e.get(r2.key), s = i.overlayedDocument;
      let o = this.applyToLocalView(s, i.mutatedFields);
      o = t.has(r2.key) ? null : o;
      const _ = __PRIVATE_calculateOverlayMutation(s, o);
      _ !== null && n.set(r2.key, _), s.isValidDocument() || s.convertToNoDocument(SnapshotVersion.min());
    }), n;
  }
  keys() {
    return this.mutations.reduce((e, t) => e.add(t.key), __PRIVATE_documentKeySet());
  }
  isEqual(e) {
    return this.batchId === e.batchId && __PRIVATE_arrayEquals(this.mutations, e.mutations, (e2, t) => __PRIVATE_mutationEquals(e2, t)) && __PRIVATE_arrayEquals(this.baseMutations, e.baseMutations, (e2, t) => __PRIVATE_mutationEquals(e2, t));
  }
}

class MutationBatchResult {
  constructor(e, t, n, r2) {
    this.batch = e, this.commitVersion = t, this.mutationResults = n, this.docVersions = r2;
  }
  static from(e, t, n) {
    __PRIVATE_hardAssert(e.mutations.length === n.length);
    let r2 = function __PRIVATE_documentVersionMap() {
      return _e;
    }();
    const i = e.mutations;
    for (let e2 = 0;e2 < i.length; e2++)
      r2 = r2.insert(i[e2].key, n[e2].version);
    return new MutationBatchResult(e, t, n, r2);
  }
}

class Overlay {
  constructor(e, t) {
    this.largestBatchId = e, this.mutation = t;
  }
  getKey() {
    return this.mutation.key;
  }
  isEqual(e) {
    return e !== null && this.mutation === e.mutation;
  }
  toString() {
    return `Overlay{\n      largestBatchId: ${this.largestBatchId},\n      mutation: ${this.mutation.toString()}\n    }`;
  }
}
class ExistenceFilter {
  constructor(e, t) {
    this.count = e, this.unchangedNames = t;
  }
}
var ce;
var le;
(le = ce || (ce = {}))[le.OK = 0] = "OK", le[le.CANCELLED = 1] = "CANCELLED", le[le.UNKNOWN = 2] = "UNKNOWN", le[le.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", le[le.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", le[le.NOT_FOUND = 5] = "NOT_FOUND", le[le.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", le[le.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", le[le.UNAUTHENTICATED = 16] = "UNAUTHENTICATED", le[le.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", le[le.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", le[le.ABORTED = 10] = "ABORTED", le[le.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", le[le.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", le[le.INTERNAL = 13] = "INTERNAL", le[le.UNAVAILABLE = 14] = "UNAVAILABLE", le[le.DATA_LOSS = 15] = "DATA_LOSS";
var he = null;
var Pe = new Integer([4294967295, 4294967295], 0);

class BloomFilter {
  constructor(e, t, n) {
    if (this.bitmap = e, this.padding = t, this.hashCount = n, t < 0 || t >= 8)
      throw new __PRIVATE_BloomFilterError(`Invalid padding: ${t}`);
    if (n < 0)
      throw new __PRIVATE_BloomFilterError(`Invalid hash count: ${n}`);
    if (e.length > 0 && this.hashCount === 0)
      throw new __PRIVATE_BloomFilterError(`Invalid hash count: ${n}`);
    if (e.length === 0 && t !== 0)
      throw new __PRIVATE_BloomFilterError(`Invalid padding when bitmap length is 0: ${t}`);
    this.Ie = 8 * e.length - t, this.Te = Integer.fromNumber(this.Ie);
  }
  Ee(e, t, n) {
    let r2 = e.add(t.multiply(Integer.fromNumber(n)));
    return r2.compare(Pe) === 1 && (r2 = new Integer([r2.getBits(0), r2.getBits(1)], 0)), r2.modulo(this.Te).toNumber();
  }
  de(e) {
    return (this.bitmap[Math.floor(e / 8)] & 1 << e % 8) != 0;
  }
  mightContain(e) {
    if (this.Ie === 0)
      return false;
    const t = __PRIVATE_getMd5HashValue(e), [n, r2] = __PRIVATE_get64BitUints(t);
    for (let e2 = 0;e2 < this.hashCount; e2++) {
      const t2 = this.Ee(n, r2, e2);
      if (!this.de(t2))
        return false;
    }
    return true;
  }
  static create(e, t, n) {
    const r2 = e % 8 == 0 ? 0 : 8 - e % 8, i = new Uint8Array(Math.ceil(e / 8)), s = new BloomFilter(i, r2, t);
    return n.forEach((e2) => s.insert(e2)), s;
  }
  insert(e) {
    if (this.Ie === 0)
      return;
    const t = __PRIVATE_getMd5HashValue(e), [n, r2] = __PRIVATE_get64BitUints(t);
    for (let e2 = 0;e2 < this.hashCount; e2++) {
      const t2 = this.Ee(n, r2, e2);
      this.Ae(t2);
    }
  }
  Ae(e) {
    const t = Math.floor(e / 8), n = e % 8;
    this.bitmap[t] |= 1 << n;
  }
}

class __PRIVATE_BloomFilterError extends Error {
  constructor() {
    super(...arguments), this.name = "BloomFilterError";
  }
}

class RemoteEvent {
  constructor(e, t, n, r2, i) {
    this.snapshotVersion = e, this.targetChanges = t, this.targetMismatches = n, this.documentUpdates = r2, this.resolvedLimboDocuments = i;
  }
  static createSynthesizedRemoteEventForCurrentChange(e, t, n) {
    const r2 = new Map;
    return r2.set(e, TargetChange.createSynthesizedTargetChangeForCurrentChange(e, t, n)), new RemoteEvent(SnapshotVersion.min(), r2, new SortedMap(__PRIVATE_primitiveComparator), __PRIVATE_mutableDocumentMap(), __PRIVATE_documentKeySet());
  }
}

class TargetChange {
  constructor(e, t, n, r2, i) {
    this.resumeToken = e, this.current = t, this.addedDocuments = n, this.modifiedDocuments = r2, this.removedDocuments = i;
  }
  static createSynthesizedTargetChangeForCurrentChange(e, t, n) {
    return new TargetChange(n, t, __PRIVATE_documentKeySet(), __PRIVATE_documentKeySet(), __PRIVATE_documentKeySet());
  }
}

class __PRIVATE_DocumentWatchChange {
  constructor(e, t, n, r2) {
    this.Re = e, this.removedTargetIds = t, this.key = n, this.Ve = r2;
  }
}

class __PRIVATE_ExistenceFilterChange {
  constructor(e, t) {
    this.targetId = e, this.me = t;
  }
}

class __PRIVATE_WatchTargetChange {
  constructor(e, t, n = ByteString.EMPTY_BYTE_STRING, r2 = null) {
    this.state = e, this.targetIds = t, this.resumeToken = n, this.cause = r2;
  }
}

class __PRIVATE_TargetState {
  constructor() {
    this.fe = 0, this.ge = __PRIVATE_snapshotChangesMap(), this.pe = ByteString.EMPTY_BYTE_STRING, this.ye = false, this.we = true;
  }
  get current() {
    return this.ye;
  }
  get resumeToken() {
    return this.pe;
  }
  get Se() {
    return this.fe !== 0;
  }
  get be() {
    return this.we;
  }
  De(e) {
    e.approximateByteSize() > 0 && (this.we = true, this.pe = e);
  }
  Ce() {
    let e = __PRIVATE_documentKeySet(), t = __PRIVATE_documentKeySet(), n = __PRIVATE_documentKeySet();
    return this.ge.forEach((r2, i) => {
      switch (i) {
        case 0:
          e = e.add(r2);
          break;
        case 2:
          t = t.add(r2);
          break;
        case 1:
          n = n.add(r2);
          break;
        default:
          fail();
      }
    }), new TargetChange(this.pe, this.ye, e, t, n);
  }
  ve() {
    this.we = false, this.ge = __PRIVATE_snapshotChangesMap();
  }
  Fe(e, t) {
    this.we = true, this.ge = this.ge.insert(e, t);
  }
  Me(e) {
    this.we = true, this.ge = this.ge.remove(e);
  }
  xe() {
    this.fe += 1;
  }
  Oe() {
    this.fe -= 1, __PRIVATE_hardAssert(this.fe >= 0);
  }
  Ne() {
    this.we = true, this.ye = true;
  }
}

class __PRIVATE_WatchChangeAggregator {
  constructor(e) {
    this.Le = e, this.Be = new Map, this.ke = __PRIVATE_mutableDocumentMap(), this.qe = __PRIVATE_documentTargetMap(), this.Qe = new SortedMap(__PRIVATE_primitiveComparator);
  }
  Ke(e) {
    for (const t of e.Re)
      e.Ve && e.Ve.isFoundDocument() ? this.$e(t, e.Ve) : this.Ue(t, e.key, e.Ve);
    for (const t of e.removedTargetIds)
      this.Ue(t, e.key, e.Ve);
  }
  We(e) {
    this.forEachTarget(e, (t) => {
      const n = this.Ge(t);
      switch (e.state) {
        case 0:
          this.ze(t) && n.De(e.resumeToken);
          break;
        case 1:
          n.Oe(), n.Se || n.ve(), n.De(e.resumeToken);
          break;
        case 2:
          n.Oe(), n.Se || this.removeTarget(t);
          break;
        case 3:
          this.ze(t) && (n.Ne(), n.De(e.resumeToken));
          break;
        case 4:
          this.ze(t) && (this.je(t), n.De(e.resumeToken));
          break;
        default:
          fail();
      }
    });
  }
  forEachTarget(e, t) {
    e.targetIds.length > 0 ? e.targetIds.forEach(t) : this.Be.forEach((e2, n) => {
      this.ze(n) && t(n);
    });
  }
  He(e) {
    const t = e.targetId, n = e.me.count, r2 = this.Je(t);
    if (r2) {
      const i = r2.target;
      if (__PRIVATE_targetIsDocumentTarget(i))
        if (n === 0) {
          const e2 = new DocumentKey(i.path);
          this.Ue(t, e2, MutableDocument.newNoDocument(e2, SnapshotVersion.min()));
        } else
          __PRIVATE_hardAssert(n === 1);
      else {
        const r3 = this.Ye(t);
        if (r3 !== n) {
          const n2 = this.Ze(e), i2 = n2 ? this.Xe(n2, e, r3) : 1;
          if (i2 !== 0) {
            this.je(t);
            const e2 = i2 === 2 ? "TargetPurposeExistenceFilterMismatchBloom" : "TargetPurposeExistenceFilterMismatch";
            this.Qe = this.Qe.insert(t, e2);
          }
          he == null || he.et(function __PRIVATE_createExistenceFilterMismatchInfoForTestingHooks(e2, t2, n3, r4, i3) {
            var s, o, _, a, u, c;
            const l2 = {
              localCacheCount: e2,
              existenceFilterCount: t2.count,
              databaseId: n3.database,
              projectId: n3.projectId
            }, h = t2.unchangedNames;
            h && (l2.bloomFilter = {
              applied: i3 === 0,
              hashCount: (s = h == null ? undefined : h.hashCount) !== null && s !== undefined ? s : 0,
              bitmapLength: (a = (_ = (o = h == null ? undefined : h.bits) === null || o === undefined ? undefined : o.bitmap) === null || _ === undefined ? undefined : _.length) !== null && a !== undefined ? a : 0,
              padding: (c = (u = h == null ? undefined : h.bits) === null || u === undefined ? undefined : u.padding) !== null && c !== undefined ? c : 0,
              mightContain: (e3) => {
                var t3;
                return (t3 = r4 == null ? undefined : r4.mightContain(e3)) !== null && t3 !== undefined && t3;
              }
            });
            return l2;
          }(r3, e.me, this.Le.tt(), n2, i2));
        }
      }
    }
  }
  Ze(e) {
    const t = e.me.unchangedNames;
    if (!t || !t.bits)
      return null;
    const { bits: { bitmap: n = "", padding: r2 = 0 }, hashCount: i = 0 } = t;
    let s, o;
    try {
      s = __PRIVATE_normalizeByteString(n).toUint8Array();
    } catch (e2) {
      if (e2 instanceof __PRIVATE_Base64DecodeError)
        return __PRIVATE_logWarn("Decoding the base64 bloom filter in existence filter failed (" + e2.message + "); ignoring the bloom filter and falling back to full re-query."), null;
      throw e2;
    }
    try {
      o = new BloomFilter(s, r2, i);
    } catch (e2) {
      return __PRIVATE_logWarn(e2 instanceof __PRIVATE_BloomFilterError ? "BloomFilter error: " : "Applying bloom filter failed: ", e2), null;
    }
    return o.Ie === 0 ? null : o;
  }
  Xe(e, t, n) {
    return t.me.count === n - this.nt(e, t.targetId) ? 0 : 2;
  }
  nt(e, t) {
    const n = this.Le.getRemoteKeysForTarget(t);
    let r2 = 0;
    return n.forEach((n2) => {
      const i = this.Le.tt(), s = `projects/${i.projectId}/databases/${i.database}/documents/${n2.path.canonicalString()}`;
      e.mightContain(s) || (this.Ue(t, n2, null), r2++);
    }), r2;
  }
  rt(e) {
    const t = new Map;
    this.Be.forEach((n2, r3) => {
      const i = this.Je(r3);
      if (i) {
        if (n2.current && __PRIVATE_targetIsDocumentTarget(i.target)) {
          const t2 = new DocumentKey(i.target.path);
          this.ke.get(t2) !== null || this.it(r3, t2) || this.Ue(r3, t2, MutableDocument.newNoDocument(t2, e));
        }
        n2.be && (t.set(r3, n2.Ce()), n2.ve());
      }
    });
    let n = __PRIVATE_documentKeySet();
    this.qe.forEach((e2, t2) => {
      let r3 = true;
      t2.forEachWhile((e3) => {
        const t3 = this.Je(e3);
        return !t3 || t3.purpose === "TargetPurposeLimboResolution" || (r3 = false, false);
      }), r3 && (n = n.add(e2));
    }), this.ke.forEach((t2, n2) => n2.setReadTime(e));
    const r2 = new RemoteEvent(e, t, this.Qe, this.ke, n);
    return this.ke = __PRIVATE_mutableDocumentMap(), this.qe = __PRIVATE_documentTargetMap(), this.Qe = new SortedMap(__PRIVATE_primitiveComparator), r2;
  }
  $e(e, t) {
    if (!this.ze(e))
      return;
    const n = this.it(e, t.key) ? 2 : 0;
    this.Ge(e).Fe(t.key, n), this.ke = this.ke.insert(t.key, t), this.qe = this.qe.insert(t.key, this.st(t.key).add(e));
  }
  Ue(e, t, n) {
    if (!this.ze(e))
      return;
    const r2 = this.Ge(e);
    this.it(e, t) ? r2.Fe(t, 1) : r2.Me(t), this.qe = this.qe.insert(t, this.st(t).delete(e)), n && (this.ke = this.ke.insert(t, n));
  }
  removeTarget(e) {
    this.Be.delete(e);
  }
  Ye(e) {
    const t = this.Ge(e).Ce();
    return this.Le.getRemoteKeysForTarget(e).size + t.addedDocuments.size - t.removedDocuments.size;
  }
  xe(e) {
    this.Ge(e).xe();
  }
  Ge(e) {
    let t = this.Be.get(e);
    return t || (t = new __PRIVATE_TargetState, this.Be.set(e, t)), t;
  }
  st(e) {
    let t = this.qe.get(e);
    return t || (t = new SortedSet(__PRIVATE_primitiveComparator), this.qe = this.qe.insert(e, t)), t;
  }
  ze(e) {
    const t = this.Je(e) !== null;
    return t || __PRIVATE_logDebug("WatchChangeAggregator", "Detected inactive target", e), t;
  }
  Je(e) {
    const t = this.Be.get(e);
    return t && t.Se ? null : this.Le.ot(e);
  }
  je(e) {
    this.Be.set(e, new __PRIVATE_TargetState);
    this.Le.getRemoteKeysForTarget(e).forEach((t) => {
      this.Ue(e, t, null);
    });
  }
  it(e, t) {
    return this.Le.getRemoteKeysForTarget(e).has(t);
  }
}
var Ie = (() => {
  const e = {
    asc: "ASCENDING",
    desc: "DESCENDING"
  };
  return e;
})();
var Te = (() => {
  const e = {
    "<": "LESS_THAN",
    "<=": "LESS_THAN_OR_EQUAL",
    ">": "GREATER_THAN",
    ">=": "GREATER_THAN_OR_EQUAL",
    "==": "EQUAL",
    "!=": "NOT_EQUAL",
    "array-contains": "ARRAY_CONTAINS",
    in: "IN",
    "not-in": "NOT_IN",
    "array-contains-any": "ARRAY_CONTAINS_ANY"
  };
  return e;
})();
var Ee = (() => {
  const e = {
    and: "AND",
    or: "OR"
  };
  return e;
})();

class JsonProtoSerializer {
  constructor(e, t) {
    this.databaseId = e, this.useProto3Json = t;
  }
}

class TargetData {
  constructor(e, t, n, r2, i = SnapshotVersion.min(), s = SnapshotVersion.min(), o = ByteString.EMPTY_BYTE_STRING, _ = null) {
    this.target = e, this.targetId = t, this.purpose = n, this.sequenceNumber = r2, this.snapshotVersion = i, this.lastLimboFreeSnapshotVersion = s, this.resumeToken = o, this.expectedCount = _;
  }
  withSequenceNumber(e) {
    return new TargetData(this.target, this.targetId, this.purpose, e, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken, this.expectedCount);
  }
  withResumeToken(e, t) {
    return new TargetData(this.target, this.targetId, this.purpose, this.sequenceNumber, t, this.lastLimboFreeSnapshotVersion, e, null);
  }
  withExpectedCount(e) {
    return new TargetData(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken, e);
  }
  withLastLimboFreeSnapshotVersion(e) {
    return new TargetData(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, e, this.resumeToken, this.expectedCount);
  }
}

class __PRIVATE_LocalSerializer {
  constructor(e) {
    this.ut = e;
  }
}

class __PRIVATE_IndexedDbBundleCache {
  getBundleMetadata(e, t) {
    return __PRIVATE_bundlesStore(e).get(t).next((e2) => {
      if (e2)
        return function __PRIVATE_fromDbBundle(e3) {
          return {
            id: e3.bundleId,
            createTime: __PRIVATE_fromDbTimestamp(e3.createTime),
            version: e3.version
          };
        }(e2);
    });
  }
  saveBundleMetadata(e, t) {
    return __PRIVATE_bundlesStore(e).put(function __PRIVATE_toDbBundle(e2) {
      return {
        bundleId: e2.id,
        createTime: __PRIVATE_toDbTimestamp(__PRIVATE_fromVersion(e2.createTime)),
        version: e2.version
      };
    }(t));
  }
  getNamedQuery(e, t) {
    return __PRIVATE_namedQueriesStore(e).get(t).next((e2) => {
      if (e2)
        return function __PRIVATE_fromDbNamedQuery(e3) {
          return {
            name: e3.name,
            query: __PRIVATE_fromBundledQuery(e3.bundledQuery),
            readTime: __PRIVATE_fromDbTimestamp(e3.readTime)
          };
        }(e2);
    });
  }
  saveNamedQuery(e, t) {
    return __PRIVATE_namedQueriesStore(e).put(function __PRIVATE_toDbNamedQuery(e2) {
      return {
        name: e2.name,
        readTime: __PRIVATE_toDbTimestamp(__PRIVATE_fromVersion(e2.readTime)),
        bundledQuery: e2.bundledQuery
      };
    }(t));
  }
}

class __PRIVATE_IndexedDbDocumentOverlayCache {
  constructor(e, t) {
    this.serializer = e, this.userId = t;
  }
  static ct(e, t) {
    const n = t.uid || "";
    return new __PRIVATE_IndexedDbDocumentOverlayCache(e, n);
  }
  getOverlay(e, t) {
    return __PRIVATE_documentOverlayStore(e).get(__PRIVATE_toDbDocumentOverlayKey(this.userId, t)).next((e2) => e2 ? __PRIVATE_fromDbDocumentOverlay(this.serializer, e2) : null);
  }
  getOverlays(e, t) {
    const n = __PRIVATE_newOverlayMap();
    return PersistencePromise.forEach(t, (t2) => this.getOverlay(e, t2).next((e2) => {
      e2 !== null && n.set(t2, e2);
    })).next(() => n);
  }
  saveOverlays(e, t, n) {
    const r2 = [];
    return n.forEach((n2, i) => {
      const s = new Overlay(t, i);
      r2.push(this.lt(e, s));
    }), PersistencePromise.waitFor(r2);
  }
  removeOverlaysForBatchId(e, t, n) {
    const r2 = new Set;
    t.forEach((e2) => r2.add(__PRIVATE_encodeResourcePath(e2.getCollectionPath())));
    const i = [];
    return r2.forEach((t2) => {
      const r3 = IDBKeyRange.bound([this.userId, t2, n], [this.userId, t2, n + 1], false, true);
      i.push(__PRIVATE_documentOverlayStore(e).j("collectionPathOverlayIndex", r3));
    }), PersistencePromise.waitFor(i);
  }
  getOverlaysForCollection(e, t, n) {
    const r2 = __PRIVATE_newOverlayMap(), i = __PRIVATE_encodeResourcePath(t), s = IDBKeyRange.bound([this.userId, i, n], [this.userId, i, Number.POSITIVE_INFINITY], true);
    return __PRIVATE_documentOverlayStore(e).U("collectionPathOverlayIndex", s).next((e2) => {
      for (const t2 of e2) {
        const e3 = __PRIVATE_fromDbDocumentOverlay(this.serializer, t2);
        r2.set(e3.getKey(), e3);
      }
      return r2;
    });
  }
  getOverlaysForCollectionGroup(e, t, n, r2) {
    const i = __PRIVATE_newOverlayMap();
    let s;
    const o = IDBKeyRange.bound([this.userId, t, n], [this.userId, t, Number.POSITIVE_INFINITY], true);
    return __PRIVATE_documentOverlayStore(e).J({
      index: "collectionGroupOverlayIndex",
      range: o
    }, (e2, t2, n2) => {
      const o2 = __PRIVATE_fromDbDocumentOverlay(this.serializer, t2);
      i.size() < r2 || o2.largestBatchId === s ? (i.set(o2.getKey(), o2), s = o2.largestBatchId) : n2.done();
    }).next(() => i);
  }
  lt(e, t) {
    return __PRIVATE_documentOverlayStore(e).put(function __PRIVATE_toDbDocumentOverlay(e2, t2, n) {
      const [r2, i, s] = __PRIVATE_toDbDocumentOverlayKey(t2, n.mutation.key);
      return {
        userId: t2,
        collectionPath: i,
        documentId: s,
        collectionGroup: n.mutation.key.getCollectionGroup(),
        largestBatchId: n.largestBatchId,
        overlayMutation: toMutation(e2.ut, n.mutation)
      };
    }(this.serializer, this.userId, t));
  }
}

class __PRIVATE_FirestoreIndexValueWriter {
  constructor() {
  }
  ht(e, t) {
    this.Pt(e, t), t.It();
  }
  Pt(e, t) {
    if ("nullValue" in e)
      this.Tt(t, 5);
    else if ("booleanValue" in e)
      this.Tt(t, 10), t.Et(e.booleanValue ? 1 : 0);
    else if ("integerValue" in e)
      this.Tt(t, 15), t.Et(__PRIVATE_normalizeNumber(e.integerValue));
    else if ("doubleValue" in e) {
      const n = __PRIVATE_normalizeNumber(e.doubleValue);
      isNaN(n) ? this.Tt(t, 13) : (this.Tt(t, 15), __PRIVATE_isNegativeZero(n) ? t.Et(0) : t.Et(n));
    } else if ("timestampValue" in e) {
      let n = e.timestampValue;
      this.Tt(t, 20), typeof n == "string" && (n = __PRIVATE_normalizeTimestamp(n)), t.dt(`${n.seconds || ""}`), t.Et(n.nanos || 0);
    } else if ("stringValue" in e)
      this.At(e.stringValue, t), this.Rt(t);
    else if ("bytesValue" in e)
      this.Tt(t, 30), t.Vt(__PRIVATE_normalizeByteString(e.bytesValue)), this.Rt(t);
    else if ("referenceValue" in e)
      this.ft(e.referenceValue, t);
    else if ("geoPointValue" in e) {
      const n = e.geoPointValue;
      this.Tt(t, 45), t.Et(n.latitude || 0), t.Et(n.longitude || 0);
    } else
      "mapValue" in e ? __PRIVATE_isMaxValue(e) ? this.Tt(t, Number.MAX_SAFE_INTEGER) : (this.gt(e.mapValue, t), this.Rt(t)) : ("arrayValue" in e) ? (this.yt(e.arrayValue, t), this.Rt(t)) : fail();
  }
  At(e, t) {
    this.Tt(t, 25), this.wt(e, t);
  }
  wt(e, t) {
    t.dt(e);
  }
  gt(e, t) {
    const n = e.fields || {};
    this.Tt(t, 55);
    for (const e2 of Object.keys(n))
      this.At(e2, t), this.Pt(n[e2], t);
  }
  yt(e, t) {
    const n = e.values || [];
    this.Tt(t, 50);
    for (const e2 of n)
      this.Pt(e2, t);
  }
  ft(e, t) {
    this.Tt(t, 37);
    DocumentKey.fromName(e).path.forEach((e2) => {
      this.Tt(t, 60), this.wt(e2, t);
    });
  }
  Tt(e, t) {
    e.Et(t);
  }
  Rt(e) {
    e.Et(2);
  }
}
__PRIVATE_FirestoreIndexValueWriter.St = new __PRIVATE_FirestoreIndexValueWriter;

class __PRIVATE_OrderedCodeWriter {
  constructor() {
    this.buffer = new Uint8Array(1024), this.position = 0;
  }
  bt(e) {
    const t = e[Symbol.iterator]();
    let n = t.next();
    for (;!n.done; )
      this.Dt(n.value), n = t.next();
    this.Ct();
  }
  vt(e) {
    const t = e[Symbol.iterator]();
    let n = t.next();
    for (;!n.done; )
      this.Ft(n.value), n = t.next();
    this.Mt();
  }
  xt(e) {
    for (const t of e) {
      const e2 = t.charCodeAt(0);
      if (e2 < 128)
        this.Dt(e2);
      else if (e2 < 2048)
        this.Dt(960 | e2 >>> 6), this.Dt(128 | 63 & e2);
      else if (t < "\uD800" || "\uDBFF" < t)
        this.Dt(480 | e2 >>> 12), this.Dt(128 | 63 & e2 >>> 6), this.Dt(128 | 63 & e2);
      else {
        const e3 = t.codePointAt(0);
        this.Dt(240 | e3 >>> 18), this.Dt(128 | 63 & e3 >>> 12), this.Dt(128 | 63 & e3 >>> 6), this.Dt(128 | 63 & e3);
      }
    }
    this.Ct();
  }
  Ot(e) {
    for (const t of e) {
      const e2 = t.charCodeAt(0);
      if (e2 < 128)
        this.Ft(e2);
      else if (e2 < 2048)
        this.Ft(960 | e2 >>> 6), this.Ft(128 | 63 & e2);
      else if (t < "\uD800" || "\uDBFF" < t)
        this.Ft(480 | e2 >>> 12), this.Ft(128 | 63 & e2 >>> 6), this.Ft(128 | 63 & e2);
      else {
        const e3 = t.codePointAt(0);
        this.Ft(240 | e3 >>> 18), this.Ft(128 | 63 & e3 >>> 12), this.Ft(128 | 63 & e3 >>> 6), this.Ft(128 | 63 & e3);
      }
    }
    this.Mt();
  }
  Nt(e) {
    const t = this.Lt(e), n = __PRIVATE_unsignedNumLength(t);
    this.Bt(1 + n), this.buffer[this.position++] = 255 & n;
    for (let e2 = t.length - n;e2 < t.length; ++e2)
      this.buffer[this.position++] = 255 & t[e2];
  }
  kt(e) {
    const t = this.Lt(e), n = __PRIVATE_unsignedNumLength(t);
    this.Bt(1 + n), this.buffer[this.position++] = ~(255 & n);
    for (let e2 = t.length - n;e2 < t.length; ++e2)
      this.buffer[this.position++] = ~(255 & t[e2]);
  }
  qt() {
    this.Qt(255), this.Qt(255);
  }
  Kt() {
    this.$t(255), this.$t(255);
  }
  reset() {
    this.position = 0;
  }
  seed(e) {
    this.Bt(e.length), this.buffer.set(e, this.position), this.position += e.length;
  }
  Ut() {
    return this.buffer.slice(0, this.position);
  }
  Lt(e) {
    const t = function __PRIVATE_doubleToLongBits(e2) {
      const t2 = new DataView(new ArrayBuffer(8));
      return t2.setFloat64(0, e2, false), new Uint8Array(t2.buffer);
    }(e), n = (128 & t[0]) != 0;
    t[0] ^= n ? 255 : 128;
    for (let e2 = 1;e2 < t.length; ++e2)
      t[e2] ^= n ? 255 : 0;
    return t;
  }
  Dt(e) {
    const t = 255 & e;
    t === 0 ? (this.Qt(0), this.Qt(255)) : t === 255 ? (this.Qt(255), this.Qt(0)) : this.Qt(t);
  }
  Ft(e) {
    const t = 255 & e;
    t === 0 ? (this.$t(0), this.$t(255)) : t === 255 ? (this.$t(255), this.$t(0)) : this.$t(e);
  }
  Ct() {
    this.Qt(0), this.Qt(1);
  }
  Mt() {
    this.$t(0), this.$t(1);
  }
  Qt(e) {
    this.Bt(1), this.buffer[this.position++] = e;
  }
  $t(e) {
    this.Bt(1), this.buffer[this.position++] = ~e;
  }
  Bt(e) {
    const t = e + this.position;
    if (t <= this.buffer.length)
      return;
    let n = 2 * this.buffer.length;
    n < t && (n = t);
    const r2 = new Uint8Array(n);
    r2.set(this.buffer), this.buffer = r2;
  }
}

class __PRIVATE_AscendingIndexByteEncoder {
  constructor(e) {
    this.Wt = e;
  }
  Vt(e) {
    this.Wt.bt(e);
  }
  dt(e) {
    this.Wt.xt(e);
  }
  Et(e) {
    this.Wt.Nt(e);
  }
  It() {
    this.Wt.qt();
  }
}

class __PRIVATE_DescendingIndexByteEncoder {
  constructor(e) {
    this.Wt = e;
  }
  Vt(e) {
    this.Wt.vt(e);
  }
  dt(e) {
    this.Wt.Ot(e);
  }
  Et(e) {
    this.Wt.kt(e);
  }
  It() {
    this.Wt.Kt();
  }
}

class __PRIVATE_IndexByteEncoder {
  constructor() {
    this.Wt = new __PRIVATE_OrderedCodeWriter, this.Gt = new __PRIVATE_AscendingIndexByteEncoder(this.Wt), this.zt = new __PRIVATE_DescendingIndexByteEncoder(this.Wt);
  }
  seed(e) {
    this.Wt.seed(e);
  }
  jt(e) {
    return e === 0 ? this.Gt : this.zt;
  }
  Ut() {
    return this.Wt.Ut();
  }
  reset() {
    this.Wt.reset();
  }
}

class __PRIVATE_IndexEntry {
  constructor(e, t, n, r2) {
    this.indexId = e, this.documentKey = t, this.arrayValue = n, this.directionalValue = r2;
  }
  Ht() {
    const e = this.directionalValue.length, t = e === 0 || this.directionalValue[e - 1] === 255 ? e + 1 : e, n = new Uint8Array(t);
    return n.set(this.directionalValue, 0), t !== e ? n.set([0], this.directionalValue.length) : ++n[n.length - 1], new __PRIVATE_IndexEntry(this.indexId, this.documentKey, this.arrayValue, n);
  }
}

class __PRIVATE_TargetIndexMatcher {
  constructor(e) {
    this.Jt = new SortedSet((e2, t) => FieldPath$1.comparator(e2.field, t.field)), this.collectionId = e.collectionGroup != null ? e.collectionGroup : e.path.lastSegment(), this.Yt = e.orderBy, this.Zt = [];
    for (const t of e.filters) {
      const e2 = t;
      e2.isInequality() ? this.Jt = this.Jt.add(e2) : this.Zt.push(e2);
    }
  }
  get Xt() {
    return this.Jt.size > 1;
  }
  en(e) {
    if (__PRIVATE_hardAssert(e.collectionGroup === this.collectionId), this.Xt)
      return false;
    const t = __PRIVATE_fieldIndexGetArraySegment(e);
    if (t !== undefined && !this.tn(t))
      return false;
    const n = __PRIVATE_fieldIndexGetDirectionalSegments(e);
    let r2 = new Set, i = 0, s = 0;
    for (;i < n.length && this.tn(n[i]); ++i)
      r2 = r2.add(n[i].fieldPath.canonicalString());
    if (i === n.length)
      return true;
    if (this.Jt.size > 0) {
      const e2 = this.Jt.getIterator().getNext();
      if (!r2.has(e2.field.canonicalString())) {
        const t2 = n[i];
        if (!this.nn(e2, t2) || !this.rn(this.Yt[s++], t2))
          return false;
      }
      ++i;
    }
    for (;i < n.length; ++i) {
      const e2 = n[i];
      if (s >= this.Yt.length || !this.rn(this.Yt[s++], e2))
        return false;
    }
    return true;
  }
  sn() {
    if (this.Xt)
      return null;
    let e = new SortedSet(FieldPath$1.comparator);
    const t = [];
    for (const n of this.Zt) {
      if (n.field.isKeyField())
        continue;
      if (n.op === "array-contains" || n.op === "array-contains-any")
        t.push(new IndexSegment(n.field, 2));
      else {
        if (e.has(n.field))
          continue;
        e = e.add(n.field), t.push(new IndexSegment(n.field, 0));
      }
    }
    for (const n of this.Yt)
      n.field.isKeyField() || e.has(n.field) || (e = e.add(n.field), t.push(new IndexSegment(n.field, n.dir === "asc" ? 0 : 1)));
    return new FieldIndex(FieldIndex.UNKNOWN_ID, this.collectionId, t, IndexState.empty());
  }
  tn(e) {
    for (const t of this.Zt)
      if (this.nn(t, e))
        return true;
    return false;
  }
  nn(e, t) {
    if (e === undefined || !e.field.isEqual(t.fieldPath))
      return false;
    const n = e.op === "array-contains" || e.op === "array-contains-any";
    return t.kind === 2 === n;
  }
  rn(e, t) {
    return !!e.field.isEqual(t.fieldPath) && (t.kind === 0 && e.dir === "asc" || t.kind === 1 && e.dir === "desc");
  }
}

class __PRIVATE_MemoryIndexManager {
  constructor() {
    this.on = new __PRIVATE_MemoryCollectionParentIndex;
  }
  addToCollectionParentIndex(e, t) {
    return this.on.add(t), PersistencePromise.resolve();
  }
  getCollectionParents(e, t) {
    return PersistencePromise.resolve(this.on.getEntries(t));
  }
  addFieldIndex(e, t) {
    return PersistencePromise.resolve();
  }
  deleteFieldIndex(e, t) {
    return PersistencePromise.resolve();
  }
  deleteAllFieldIndexes(e) {
    return PersistencePromise.resolve();
  }
  createTargetIndexes(e, t) {
    return PersistencePromise.resolve();
  }
  getDocumentsMatchingTarget(e, t) {
    return PersistencePromise.resolve(null);
  }
  getIndexType(e, t) {
    return PersistencePromise.resolve(0);
  }
  getFieldIndexes(e, t) {
    return PersistencePromise.resolve([]);
  }
  getNextCollectionGroupToUpdate(e) {
    return PersistencePromise.resolve(null);
  }
  getMinOffset(e, t) {
    return PersistencePromise.resolve(IndexOffset.min());
  }
  getMinOffsetFromCollectionGroup(e, t) {
    return PersistencePromise.resolve(IndexOffset.min());
  }
  updateCollectionGroup(e, t, n) {
    return PersistencePromise.resolve();
  }
  updateIndexEntries(e, t) {
    return PersistencePromise.resolve();
  }
}

class __PRIVATE_MemoryCollectionParentIndex {
  constructor() {
    this.index = {};
  }
  add(e) {
    const t = e.lastSegment(), n = e.popLast(), r2 = this.index[t] || new SortedSet(ResourcePath.comparator), i = !r2.has(n);
    return this.index[t] = r2.add(n), i;
  }
  has(e) {
    const t = e.lastSegment(), n = e.popLast(), r2 = this.index[t];
    return r2 && r2.has(n);
  }
  getEntries(e) {
    return (this.index[e] || new SortedSet(ResourcePath.comparator)).toArray();
  }
}
var de = new Uint8Array(0);

class __PRIVATE_IndexedDbIndexManager {
  constructor(e, t) {
    this.databaseId = t, this._n = new __PRIVATE_MemoryCollectionParentIndex, this.an = new ObjectMap((e2) => __PRIVATE_canonifyTarget(e2), (e2, t2) => __PRIVATE_targetEquals(e2, t2)), this.uid = e.uid || "";
  }
  addToCollectionParentIndex(e, t) {
    if (!this._n.has(t)) {
      const n = t.lastSegment(), r2 = t.popLast();
      e.addOnCommittedListener(() => {
        this._n.add(t);
      });
      const i = {
        collectionId: n,
        parent: __PRIVATE_encodeResourcePath(r2)
      };
      return __PRIVATE_collectionParentsStore(e).put(i);
    }
    return PersistencePromise.resolve();
  }
  getCollectionParents(e, t) {
    const n = [], r2 = IDBKeyRange.bound([t, ""], [__PRIVATE_immediateSuccessor(t), ""], false, true);
    return __PRIVATE_collectionParentsStore(e).U(r2).next((e2) => {
      for (const r3 of e2) {
        if (r3.collectionId !== t)
          break;
        n.push(__PRIVATE_decodeResourcePath(r3.parent));
      }
      return n;
    });
  }
  addFieldIndex(e, t) {
    const n = __PRIVATE_indexConfigurationStore(e), r2 = function __PRIVATE_toDbIndexConfiguration(e2) {
      return {
        indexId: e2.indexId,
        collectionGroup: e2.collectionGroup,
        fields: e2.fields.map((e3) => [e3.fieldPath.canonicalString(), e3.kind])
      };
    }(t);
    delete r2.indexId;
    const i = n.add(r2);
    if (t.indexState) {
      const n2 = __PRIVATE_indexStateStore(e);
      return i.next((e2) => {
        n2.put(__PRIVATE_toDbIndexState(e2, this.uid, t.indexState.sequenceNumber, t.indexState.offset));
      });
    }
    return i.next();
  }
  deleteFieldIndex(e, t) {
    const n = __PRIVATE_indexConfigurationStore(e), r2 = __PRIVATE_indexStateStore(e), i = __PRIVATE_indexEntriesStore(e);
    return n.delete(t.indexId).next(() => r2.delete(IDBKeyRange.bound([t.indexId], [t.indexId + 1], false, true))).next(() => i.delete(IDBKeyRange.bound([t.indexId], [t.indexId + 1], false, true)));
  }
  deleteAllFieldIndexes(e) {
    const t = __PRIVATE_indexConfigurationStore(e), n = __PRIVATE_indexEntriesStore(e), r2 = __PRIVATE_indexStateStore(e);
    return t.j().next(() => n.j()).next(() => r2.j());
  }
  createTargetIndexes(e, t) {
    return PersistencePromise.forEach(this.un(t), (t2) => this.getIndexType(e, t2).next((n) => {
      if (n === 0 || n === 1) {
        const n2 = new __PRIVATE_TargetIndexMatcher(t2).sn();
        if (n2 != null)
          return this.addFieldIndex(e, n2);
      }
    }));
  }
  getDocumentsMatchingTarget(e, t) {
    const n = __PRIVATE_indexEntriesStore(e);
    let r2 = true;
    const i = new Map;
    return PersistencePromise.forEach(this.un(t), (t2) => this.cn(e, t2).next((e2) => {
      r2 && (r2 = !!e2), i.set(t2, e2);
    })).next(() => {
      if (r2) {
        let e2 = __PRIVATE_documentKeySet();
        const r3 = [];
        return PersistencePromise.forEach(i, (i2, s) => {
          __PRIVATE_logDebug("IndexedDbIndexManager", `Using index ${function __PRIVATE_fieldIndexToString(e3) {
            return `id=${e3.indexId}|cg=${e3.collectionGroup}|f=${e3.fields.map((e4) => `${e4.fieldPath}:${e4.kind}`).join(",")}`;
          }(i2)} to execute ${__PRIVATE_canonifyTarget(t)}`);
          const o = function __PRIVATE_targetGetArrayValues(e3, t2) {
            const n2 = __PRIVATE_fieldIndexGetArraySegment(t2);
            if (n2 === undefined)
              return null;
            for (const t3 of __PRIVATE_targetGetFieldFiltersForPath(e3, n2.fieldPath))
              switch (t3.op) {
                case "array-contains-any":
                  return t3.value.arrayValue.values || [];
                case "array-contains":
                  return [t3.value];
              }
            return null;
          }(s, i2), _ = function __PRIVATE_targetGetNotInValues(e3, t2) {
            const n2 = new Map;
            for (const r4 of __PRIVATE_fieldIndexGetDirectionalSegments(t2))
              for (const t3 of __PRIVATE_targetGetFieldFiltersForPath(e3, r4.fieldPath))
                switch (t3.op) {
                  case "==":
                  case "in":
                    n2.set(r4.fieldPath.canonicalString(), t3.value);
                    break;
                  case "not-in":
                  case "!=":
                    return n2.set(r4.fieldPath.canonicalString(), t3.value), Array.from(n2.values());
                }
            return null;
          }(s, i2), a = function __PRIVATE_targetGetLowerBound(e3, t2) {
            const n2 = [];
            let r4 = true;
            for (const i3 of __PRIVATE_fieldIndexGetDirectionalSegments(t2)) {
              const t3 = i3.kind === 0 ? __PRIVATE_targetGetAscendingBound(e3, i3.fieldPath, e3.startAt) : __PRIVATE_targetGetDescendingBound(e3, i3.fieldPath, e3.startAt);
              n2.push(t3.value), r4 && (r4 = t3.inclusive);
            }
            return new Bound(n2, r4);
          }(s, i2), u = function __PRIVATE_targetGetUpperBound(e3, t2) {
            const n2 = [];
            let r4 = true;
            for (const i3 of __PRIVATE_fieldIndexGetDirectionalSegments(t2)) {
              const t3 = i3.kind === 0 ? __PRIVATE_targetGetDescendingBound(e3, i3.fieldPath, e3.endAt) : __PRIVATE_targetGetAscendingBound(e3, i3.fieldPath, e3.endAt);
              n2.push(t3.value), r4 && (r4 = t3.inclusive);
            }
            return new Bound(n2, r4);
          }(s, i2), c = this.ln(i2, s, a), l2 = this.ln(i2, s, u), h = this.hn(i2, s, _), P2 = this.Pn(i2.indexId, o, c, a.inclusive, l2, u.inclusive, h);
          return PersistencePromise.forEach(P2, (i3) => n.G(i3, t.limit).next((t2) => {
            t2.forEach((t3) => {
              const n2 = DocumentKey.fromSegments(t3.documentKey);
              e2.has(n2) || (e2 = e2.add(n2), r3.push(n2));
            });
          }));
        }).next(() => r3);
      }
      return PersistencePromise.resolve(null);
    });
  }
  un(e) {
    let t = this.an.get(e);
    if (t)
      return t;
    if (e.filters.length === 0)
      t = [e];
    else {
      t = __PRIVATE_getDnfTerms(CompositeFilter.create(e.filters, "and")).map((t2) => __PRIVATE_newTarget(e.path, e.collectionGroup, e.orderBy, t2.getFilters(), e.limit, e.startAt, e.endAt));
    }
    return this.an.set(e, t), t;
  }
  Pn(e, t, n, r2, i, s, o) {
    const _ = (t != null ? t.length : 1) * Math.max(n.length, i.length), a = _ / (t != null ? t.length : 1), u = [];
    for (let c = 0;c < _; ++c) {
      const _2 = t ? this.In(t[c / a]) : de, l2 = this.Tn(e, _2, n[c % a], r2), h = this.En(e, _2, i[c % a], s), P2 = o.map((t2) => this.Tn(e, _2, t2, true));
      u.push(...this.createRange(l2, h, P2));
    }
    return u;
  }
  Tn(e, t, n, r2) {
    const i = new __PRIVATE_IndexEntry(e, DocumentKey.empty(), t, n);
    return r2 ? i : i.Ht();
  }
  En(e, t, n, r2) {
    const i = new __PRIVATE_IndexEntry(e, DocumentKey.empty(), t, n);
    return r2 ? i.Ht() : i;
  }
  cn(e, t) {
    const n = new __PRIVATE_TargetIndexMatcher(t), r2 = t.collectionGroup != null ? t.collectionGroup : t.path.lastSegment();
    return this.getFieldIndexes(e, r2).next((e2) => {
      let t2 = null;
      for (const r3 of e2) {
        n.en(r3) && (!t2 || r3.fields.length > t2.fields.length) && (t2 = r3);
      }
      return t2;
    });
  }
  getIndexType(e, t) {
    let n = 2;
    const r2 = this.un(t);
    return PersistencePromise.forEach(r2, (t2) => this.cn(e, t2).next((e2) => {
      e2 ? n !== 0 && e2.fields.length < function __PRIVATE_targetGetSegmentCount(e3) {
        let t3 = new SortedSet(FieldPath$1.comparator), n2 = false;
        for (const r3 of e3.filters)
          for (const e4 of r3.getFlattenedFilters())
            e4.field.isKeyField() || (e4.op === "array-contains" || e4.op === "array-contains-any" ? n2 = true : t3 = t3.add(e4.field));
        for (const n3 of e3.orderBy)
          n3.field.isKeyField() || (t3 = t3.add(n3.field));
        return t3.size + (n2 ? 1 : 0);
      }(t2) && (n = 1) : n = 0;
    })).next(() => function __PRIVATE_targetHasLimit(e2) {
      return e2.limit !== null;
    }(t) && r2.length > 1 && n === 2 ? 1 : n);
  }
  dn(e, t) {
    const n = new __PRIVATE_IndexByteEncoder;
    for (const r2 of __PRIVATE_fieldIndexGetDirectionalSegments(e)) {
      const e2 = t.data.field(r2.fieldPath);
      if (e2 == null)
        return null;
      const i = n.jt(r2.kind);
      __PRIVATE_FirestoreIndexValueWriter.St.ht(e2, i);
    }
    return n.Ut();
  }
  In(e) {
    const t = new __PRIVATE_IndexByteEncoder;
    return __PRIVATE_FirestoreIndexValueWriter.St.ht(e, t.jt(0)), t.Ut();
  }
  An(e, t) {
    const n = new __PRIVATE_IndexByteEncoder;
    return __PRIVATE_FirestoreIndexValueWriter.St.ht(__PRIVATE_refValue(this.databaseId, t), n.jt(function __PRIVATE_fieldIndexGetKeyOrder(e2) {
      const t2 = __PRIVATE_fieldIndexGetDirectionalSegments(e2);
      return t2.length === 0 ? 0 : t2[t2.length - 1].kind;
    }(e))), n.Ut();
  }
  hn(e, t, n) {
    if (n === null)
      return [];
    let r2 = [];
    r2.push(new __PRIVATE_IndexByteEncoder);
    let i = 0;
    for (const s of __PRIVATE_fieldIndexGetDirectionalSegments(e)) {
      const e2 = n[i++];
      for (const n2 of r2)
        if (this.Rn(t, s.fieldPath) && isArray(e2))
          r2 = this.Vn(r2, s, e2);
        else {
          const t2 = n2.jt(s.kind);
          __PRIVATE_FirestoreIndexValueWriter.St.ht(e2, t2);
        }
    }
    return this.mn(r2);
  }
  ln(e, t, n) {
    return this.hn(e, t, n.position);
  }
  mn(e) {
    const t = [];
    for (let n = 0;n < e.length; ++n)
      t[n] = e[n].Ut();
    return t;
  }
  Vn(e, t, n) {
    const r2 = [...e], i = [];
    for (const e2 of n.arrayValue.values || [])
      for (const n2 of r2) {
        const r3 = new __PRIVATE_IndexByteEncoder;
        r3.seed(n2.Ut()), __PRIVATE_FirestoreIndexValueWriter.St.ht(e2, r3.jt(t.kind)), i.push(r3);
      }
    return i;
  }
  Rn(e, t) {
    return !!e.filters.find((e2) => e2 instanceof FieldFilter && e2.field.isEqual(t) && (e2.op === "in" || e2.op === "not-in"));
  }
  getFieldIndexes(e, t) {
    const n = __PRIVATE_indexConfigurationStore(e), r2 = __PRIVATE_indexStateStore(e);
    return (t ? n.U("collectionGroupIndex", IDBKeyRange.bound(t, t)) : n.U()).next((e2) => {
      const t2 = [];
      return PersistencePromise.forEach(e2, (e3) => r2.get([e3.indexId, this.uid]).next((n2) => {
        t2.push(function __PRIVATE_fromDbIndexConfiguration(e4, t3) {
          const n3 = t3 ? new IndexState(t3.sequenceNumber, new IndexOffset(__PRIVATE_fromDbTimestamp(t3.readTime), new DocumentKey(__PRIVATE_decodeResourcePath(t3.documentKey)), t3.largestBatchId)) : IndexState.empty(), r3 = e4.fields.map(([e5, t4]) => new IndexSegment(FieldPath$1.fromServerFormat(e5), t4));
          return new FieldIndex(e4.indexId, e4.collectionGroup, r3, n3);
        }(e3, n2));
      })).next(() => t2);
    });
  }
  getNextCollectionGroupToUpdate(e) {
    return this.getFieldIndexes(e).next((e2) => e2.length === 0 ? null : (e2.sort((e3, t) => {
      const n = e3.indexState.sequenceNumber - t.indexState.sequenceNumber;
      return n !== 0 ? n : __PRIVATE_primitiveComparator(e3.collectionGroup, t.collectionGroup);
    }), e2[0].collectionGroup));
  }
  updateCollectionGroup(e, t, n) {
    const r2 = __PRIVATE_indexConfigurationStore(e), i = __PRIVATE_indexStateStore(e);
    return this.fn(e).next((e2) => r2.U("collectionGroupIndex", IDBKeyRange.bound(t, t)).next((t2) => PersistencePromise.forEach(t2, (t3) => i.put(__PRIVATE_toDbIndexState(t3.indexId, this.uid, e2, n)))));
  }
  updateIndexEntries(e, t) {
    const n = new Map;
    return PersistencePromise.forEach(t, (t2, r2) => {
      const i = n.get(t2.collectionGroup);
      return (i ? PersistencePromise.resolve(i) : this.getFieldIndexes(e, t2.collectionGroup)).next((i2) => (n.set(t2.collectionGroup, i2), PersistencePromise.forEach(i2, (n2) => this.gn(e, t2, n2).next((t3) => {
        const i3 = this.pn(r2, n2);
        return t3.isEqual(i3) ? PersistencePromise.resolve() : this.yn(e, r2, n2, t3, i3);
      }))));
    });
  }
  wn(e, t, n, r2) {
    return __PRIVATE_indexEntriesStore(e).put({
      indexId: r2.indexId,
      uid: this.uid,
      arrayValue: r2.arrayValue,
      directionalValue: r2.directionalValue,
      orderedDocumentKey: this.An(n, t.key),
      documentKey: t.key.path.toArray()
    });
  }
  Sn(e, t, n, r2) {
    return __PRIVATE_indexEntriesStore(e).delete([r2.indexId, this.uid, r2.arrayValue, r2.directionalValue, this.An(n, t.key), t.key.path.toArray()]);
  }
  gn(e, t, n) {
    const r2 = __PRIVATE_indexEntriesStore(e);
    let i = new SortedSet(__PRIVATE_indexEntryComparator);
    return r2.J({
      index: "documentKeyIndex",
      range: IDBKeyRange.only([n.indexId, this.uid, this.An(n, t)])
    }, (e2, r3) => {
      i = i.add(new __PRIVATE_IndexEntry(n.indexId, t, r3.arrayValue, r3.directionalValue));
    }).next(() => i);
  }
  pn(e, t) {
    let n = new SortedSet(__PRIVATE_indexEntryComparator);
    const r2 = this.dn(t, e);
    if (r2 == null)
      return n;
    const i = __PRIVATE_fieldIndexGetArraySegment(t);
    if (i != null) {
      const s = e.data.field(i.fieldPath);
      if (isArray(s))
        for (const i2 of s.arrayValue.values || [])
          n = n.add(new __PRIVATE_IndexEntry(t.indexId, e.key, this.In(i2), r2));
    } else
      n = n.add(new __PRIVATE_IndexEntry(t.indexId, e.key, de, r2));
    return n;
  }
  yn(e, t, n, r2, i) {
    __PRIVATE_logDebug("IndexedDbIndexManager", "Updating index entries for document '%s'", t.key);
    const s = [];
    return function __PRIVATE_diffSortedSets(e2, t2, n2, r3, i2) {
      const s2 = e2.getIterator(), o = t2.getIterator();
      let _ = __PRIVATE_advanceIterator(s2), a = __PRIVATE_advanceIterator(o);
      for (;_ || a; ) {
        let e3 = false, t3 = false;
        if (_ && a) {
          const r4 = n2(_, a);
          r4 < 0 ? t3 = true : r4 > 0 && (e3 = true);
        } else
          _ != null ? t3 = true : e3 = true;
        e3 ? (r3(a), a = __PRIVATE_advanceIterator(o)) : t3 ? (i2(_), _ = __PRIVATE_advanceIterator(s2)) : (_ = __PRIVATE_advanceIterator(s2), a = __PRIVATE_advanceIterator(o));
      }
    }(r2, i, __PRIVATE_indexEntryComparator, (r3) => {
      s.push(this.wn(e, t, n, r3));
    }, (r3) => {
      s.push(this.Sn(e, t, n, r3));
    }), PersistencePromise.waitFor(s);
  }
  fn(e) {
    let t = 1;
    return __PRIVATE_indexStateStore(e).J({
      index: "sequenceNumberIndex",
      reverse: true,
      range: IDBKeyRange.upperBound([this.uid, Number.MAX_SAFE_INTEGER])
    }, (e2, n, r2) => {
      r2.done(), t = n.sequenceNumber + 1;
    }).next(() => t);
  }
  createRange(e, t, n) {
    n = n.sort((e2, t2) => __PRIVATE_indexEntryComparator(e2, t2)).filter((e2, t2, n2) => !t2 || __PRIVATE_indexEntryComparator(e2, n2[t2 - 1]) !== 0);
    const r2 = [];
    r2.push(e);
    for (const i2 of n) {
      const n2 = __PRIVATE_indexEntryComparator(i2, e), s = __PRIVATE_indexEntryComparator(i2, t);
      if (n2 === 0)
        r2[0] = e.Ht();
      else if (n2 > 0 && s < 0)
        r2.push(i2), r2.push(i2.Ht());
      else if (s > 0)
        break;
    }
    r2.push(t);
    const i = [];
    for (let e2 = 0;e2 < r2.length; e2 += 2) {
      if (this.bn(r2[e2], r2[e2 + 1]))
        return [];
      const t2 = [r2[e2].indexId, this.uid, r2[e2].arrayValue, r2[e2].directionalValue, de, []], n2 = [r2[e2 + 1].indexId, this.uid, r2[e2 + 1].arrayValue, r2[e2 + 1].directionalValue, de, []];
      i.push(IDBKeyRange.bound(t2, n2));
    }
    return i;
  }
  bn(e, t) {
    return __PRIVATE_indexEntryComparator(e, t) > 0;
  }
  getMinOffsetFromCollectionGroup(e, t) {
    return this.getFieldIndexes(e, t).next(__PRIVATE_getMinOffsetFromFieldIndexes);
  }
  getMinOffset(e, t) {
    return PersistencePromise.mapArray(this.un(t), (t2) => this.cn(e, t2).next((e2) => e2 || fail())).next(__PRIVATE_getMinOffsetFromFieldIndexes);
  }
}
var Ae = {
  didRun: false,
  sequenceNumbersCollected: 0,
  targetsRemoved: 0,
  documentsRemoved: 0
};

class LruParams {
  constructor(e, t, n) {
    this.cacheSizeCollectionThreshold = e, this.percentileToCollect = t, this.maximumSequenceNumbersToCollect = n;
  }
  static withCacheSize(e) {
    return new LruParams(e, LruParams.DEFAULT_COLLECTION_PERCENTILE, LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT);
  }
}
LruParams.DEFAULT_COLLECTION_PERCENTILE = 10, LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1000, LruParams.DEFAULT = new LruParams(41943040, LruParams.DEFAULT_COLLECTION_PERCENTILE, LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT), LruParams.DISABLED = new LruParams(-1, 0, 0);

class __PRIVATE_IndexedDbMutationQueue {
  constructor(e, t, n, r2) {
    this.userId = e, this.serializer = t, this.indexManager = n, this.referenceDelegate = r2, this.Dn = {};
  }
  static ct(e, t, n, r2) {
    __PRIVATE_hardAssert(e.uid !== "");
    const i = e.isAuthenticated() ? e.uid : "";
    return new __PRIVATE_IndexedDbMutationQueue(i, t, n, r2);
  }
  checkEmpty(e) {
    let t = true;
    const n = IDBKeyRange.bound([this.userId, Number.NEGATIVE_INFINITY], [this.userId, Number.POSITIVE_INFINITY]);
    return __PRIVATE_mutationsStore(e).J({
      index: "userMutationsIndex",
      range: n
    }, (e2, n2, r2) => {
      t = false, r2.done();
    }).next(() => t);
  }
  addMutationBatch(e, t, n, r2) {
    const i = __PRIVATE_documentMutationsStore(e), s = __PRIVATE_mutationsStore(e);
    return s.add({}).next((o) => {
      __PRIVATE_hardAssert(typeof o == "number");
      const _ = new MutationBatch(o, t, n, r2), a = function __PRIVATE_toDbMutationBatch(e2, t2, n2) {
        const r3 = n2.baseMutations.map((t3) => toMutation(e2.ut, t3)), i2 = n2.mutations.map((t3) => toMutation(e2.ut, t3));
        return {
          userId: t2,
          batchId: n2.batchId,
          localWriteTimeMs: n2.localWriteTime.toMillis(),
          baseMutations: r3,
          mutations: i2
        };
      }(this.serializer, this.userId, _), u = [];
      let c = new SortedSet((e2, t2) => __PRIVATE_primitiveComparator(e2.canonicalString(), t2.canonicalString()));
      for (const e2 of r2) {
        const t2 = __PRIVATE_newDbDocumentMutationKey(this.userId, e2.key.path, o);
        c = c.add(e2.key.path.popLast()), u.push(s.put(a)), u.push(i.put(t2, O2));
      }
      return c.forEach((t2) => {
        u.push(this.indexManager.addToCollectionParentIndex(e, t2));
      }), e.addOnCommittedListener(() => {
        this.Dn[o] = _.keys();
      }), PersistencePromise.waitFor(u).next(() => _);
    });
  }
  lookupMutationBatch(e, t) {
    return __PRIVATE_mutationsStore(e).get(t).next((e2) => e2 ? (__PRIVATE_hardAssert(e2.userId === this.userId), __PRIVATE_fromDbMutationBatch(this.serializer, e2)) : null);
  }
  Cn(e, t) {
    return this.Dn[t] ? PersistencePromise.resolve(this.Dn[t]) : this.lookupMutationBatch(e, t).next((e2) => {
      if (e2) {
        const n = e2.keys();
        return this.Dn[t] = n, n;
      }
      return null;
    });
  }
  getNextMutationBatchAfterBatchId(e, t) {
    const n = t + 1, r2 = IDBKeyRange.lowerBound([this.userId, n]);
    let i = null;
    return __PRIVATE_mutationsStore(e).J({
      index: "userMutationsIndex",
      range: r2
    }, (e2, t2, r3) => {
      t2.userId === this.userId && (__PRIVATE_hardAssert(t2.batchId >= n), i = __PRIVATE_fromDbMutationBatch(this.serializer, t2)), r3.done();
    }).next(() => i);
  }
  getHighestUnacknowledgedBatchId(e) {
    const t = IDBKeyRange.upperBound([this.userId, Number.POSITIVE_INFINITY]);
    let n = -1;
    return __PRIVATE_mutationsStore(e).J({
      index: "userMutationsIndex",
      range: t,
      reverse: true
    }, (e2, t2, r2) => {
      n = t2.batchId, r2.done();
    }).next(() => n);
  }
  getAllMutationBatches(e) {
    const t = IDBKeyRange.bound([this.userId, -1], [this.userId, Number.POSITIVE_INFINITY]);
    return __PRIVATE_mutationsStore(e).U("userMutationsIndex", t).next((e2) => e2.map((e3) => __PRIVATE_fromDbMutationBatch(this.serializer, e3)));
  }
  getAllMutationBatchesAffectingDocumentKey(e, t) {
    const n = __PRIVATE_newDbDocumentMutationPrefixForPath(this.userId, t.path), r2 = IDBKeyRange.lowerBound(n), i = [];
    return __PRIVATE_documentMutationsStore(e).J({
      range: r2
    }, (n2, r3, s) => {
      const [o, _, a] = n2, u = __PRIVATE_decodeResourcePath(_);
      if (o === this.userId && t.path.isEqual(u))
        return __PRIVATE_mutationsStore(e).get(a).next((e2) => {
          if (!e2)
            throw fail();
          __PRIVATE_hardAssert(e2.userId === this.userId), i.push(__PRIVATE_fromDbMutationBatch(this.serializer, e2));
        });
      s.done();
    }).next(() => i);
  }
  getAllMutationBatchesAffectingDocumentKeys(e, t) {
    let n = new SortedSet(__PRIVATE_primitiveComparator);
    const r2 = [];
    return t.forEach((t2) => {
      const i = __PRIVATE_newDbDocumentMutationPrefixForPath(this.userId, t2.path), s = IDBKeyRange.lowerBound(i), o = __PRIVATE_documentMutationsStore(e).J({
        range: s
      }, (e2, r3, i2) => {
        const [s2, o2, _] = e2, a = __PRIVATE_decodeResourcePath(o2);
        s2 === this.userId && t2.path.isEqual(a) ? n = n.add(_) : i2.done();
      });
      r2.push(o);
    }), PersistencePromise.waitFor(r2).next(() => this.vn(e, n));
  }
  getAllMutationBatchesAffectingQuery(e, t) {
    const n = t.path, r2 = n.length + 1, i = __PRIVATE_newDbDocumentMutationPrefixForPath(this.userId, n), s = IDBKeyRange.lowerBound(i);
    let o = new SortedSet(__PRIVATE_primitiveComparator);
    return __PRIVATE_documentMutationsStore(e).J({
      range: s
    }, (e2, t2, i2) => {
      const [s2, _, a] = e2, u = __PRIVATE_decodeResourcePath(_);
      s2 === this.userId && n.isPrefixOf(u) ? u.length === r2 && (o = o.add(a)) : i2.done();
    }).next(() => this.vn(e, o));
  }
  vn(e, t) {
    const n = [], r2 = [];
    return t.forEach((t2) => {
      r2.push(__PRIVATE_mutationsStore(e).get(t2).next((e2) => {
        if (e2 === null)
          throw fail();
        __PRIVATE_hardAssert(e2.userId === this.userId), n.push(__PRIVATE_fromDbMutationBatch(this.serializer, e2));
      }));
    }), PersistencePromise.waitFor(r2).next(() => n);
  }
  removeMutationBatch(e, t) {
    return removeMutationBatch(e._e, this.userId, t).next((n) => (e.addOnCommittedListener(() => {
      this.Fn(t.batchId);
    }), PersistencePromise.forEach(n, (t2) => this.referenceDelegate.markPotentiallyOrphaned(e, t2))));
  }
  Fn(e) {
    delete this.Dn[e];
  }
  performConsistencyCheck(e) {
    return this.checkEmpty(e).next((t) => {
      if (!t)
        return PersistencePromise.resolve();
      const n = IDBKeyRange.lowerBound(function __PRIVATE_newDbDocumentMutationPrefixForUser(e2) {
        return [e2];
      }(this.userId)), r2 = [];
      return __PRIVATE_documentMutationsStore(e).J({
        range: n
      }, (e2, t2, n2) => {
        if (e2[0] === this.userId) {
          const t3 = __PRIVATE_decodeResourcePath(e2[1]);
          r2.push(t3);
        } else
          n2.done();
      }).next(() => {
        __PRIVATE_hardAssert(r2.length === 0);
      });
    });
  }
  containsKey(e, t) {
    return __PRIVATE_mutationQueueContainsKey(e, this.userId, t);
  }
  Mn(e) {
    return __PRIVATE_mutationQueuesStore(e).get(this.userId).next((e2) => e2 || {
      userId: this.userId,
      lastAcknowledgedBatchId: -1,
      lastStreamToken: ""
    });
  }
}

class __PRIVATE_TargetIdGenerator {
  constructor(e) {
    this.xn = e;
  }
  next() {
    return this.xn += 2, this.xn;
  }
  static On() {
    return new __PRIVATE_TargetIdGenerator(0);
  }
  static Nn() {
    return new __PRIVATE_TargetIdGenerator(-1);
  }
}

class __PRIVATE_IndexedDbTargetCache {
  constructor(e, t) {
    this.referenceDelegate = e, this.serializer = t;
  }
  allocateTargetId(e) {
    return this.Ln(e).next((t) => {
      const n = new __PRIVATE_TargetIdGenerator(t.highestTargetId);
      return t.highestTargetId = n.next(), this.Bn(e, t).next(() => t.highestTargetId);
    });
  }
  getLastRemoteSnapshotVersion(e) {
    return this.Ln(e).next((e2) => SnapshotVersion.fromTimestamp(new Timestamp(e2.lastRemoteSnapshotVersion.seconds, e2.lastRemoteSnapshotVersion.nanoseconds)));
  }
  getHighestSequenceNumber(e) {
    return this.Ln(e).next((e2) => e2.highestListenSequenceNumber);
  }
  setTargetsMetadata(e, t, n) {
    return this.Ln(e).next((r2) => (r2.highestListenSequenceNumber = t, n && (r2.lastRemoteSnapshotVersion = n.toTimestamp()), t > r2.highestListenSequenceNumber && (r2.highestListenSequenceNumber = t), this.Bn(e, r2)));
  }
  addTargetData(e, t) {
    return this.kn(e, t).next(() => this.Ln(e).next((n) => (n.targetCount += 1, this.qn(t, n), this.Bn(e, n))));
  }
  updateTargetData(e, t) {
    return this.kn(e, t);
  }
  removeTargetData(e, t) {
    return this.removeMatchingKeysForTargetId(e, t.targetId).next(() => __PRIVATE_targetsStore(e).delete(t.targetId)).next(() => this.Ln(e)).next((t2) => (__PRIVATE_hardAssert(t2.targetCount > 0), t2.targetCount -= 1, this.Bn(e, t2)));
  }
  removeTargets(e, t, n) {
    let r2 = 0;
    const i = [];
    return __PRIVATE_targetsStore(e).J((s, o) => {
      const _ = __PRIVATE_fromDbTarget(o);
      _.sequenceNumber <= t && n.get(_.targetId) === null && (r2++, i.push(this.removeTargetData(e, _)));
    }).next(() => PersistencePromise.waitFor(i)).next(() => r2);
  }
  forEachTarget(e, t) {
    return __PRIVATE_targetsStore(e).J((e2, n) => {
      const r2 = __PRIVATE_fromDbTarget(n);
      t(r2);
    });
  }
  Ln(e) {
    return __PRIVATE_globalTargetStore(e).get("targetGlobalKey").next((e2) => (__PRIVATE_hardAssert(e2 !== null), e2));
  }
  Bn(e, t) {
    return __PRIVATE_globalTargetStore(e).put("targetGlobalKey", t);
  }
  kn(e, t) {
    return __PRIVATE_targetsStore(e).put(__PRIVATE_toDbTarget(this.serializer, t));
  }
  qn(e, t) {
    let n = false;
    return e.targetId > t.highestTargetId && (t.highestTargetId = e.targetId, n = true), e.sequenceNumber > t.highestListenSequenceNumber && (t.highestListenSequenceNumber = e.sequenceNumber, n = true), n;
  }
  getTargetCount(e) {
    return this.Ln(e).next((e2) => e2.targetCount);
  }
  getTargetData(e, t) {
    const n = __PRIVATE_canonifyTarget(t), r2 = IDBKeyRange.bound([n, Number.NEGATIVE_INFINITY], [n, Number.POSITIVE_INFINITY]);
    let i = null;
    return __PRIVATE_targetsStore(e).J({
      range: r2,
      index: "queryTargetsIndex"
    }, (e2, n2, r3) => {
      const s = __PRIVATE_fromDbTarget(n2);
      __PRIVATE_targetEquals(t, s.target) && (i = s, r3.done());
    }).next(() => i);
  }
  addMatchingKeys(e, t, n) {
    const r2 = [], i = __PRIVATE_documentTargetStore(e);
    return t.forEach((t2) => {
      const s = __PRIVATE_encodeResourcePath(t2.path);
      r2.push(i.put({
        targetId: n,
        path: s
      })), r2.push(this.referenceDelegate.addReference(e, n, t2));
    }), PersistencePromise.waitFor(r2);
  }
  removeMatchingKeys(e, t, n) {
    const r2 = __PRIVATE_documentTargetStore(e);
    return PersistencePromise.forEach(t, (t2) => {
      const i = __PRIVATE_encodeResourcePath(t2.path);
      return PersistencePromise.waitFor([r2.delete([n, i]), this.referenceDelegate.removeReference(e, n, t2)]);
    });
  }
  removeMatchingKeysForTargetId(e, t) {
    const n = __PRIVATE_documentTargetStore(e), r2 = IDBKeyRange.bound([t], [t + 1], false, true);
    return n.delete(r2);
  }
  getMatchingKeysForTargetId(e, t) {
    const n = IDBKeyRange.bound([t], [t + 1], false, true), r2 = __PRIVATE_documentTargetStore(e);
    let i = __PRIVATE_documentKeySet();
    return r2.J({
      range: n,
      H: true
    }, (e2, t2, n2) => {
      const r3 = __PRIVATE_decodeResourcePath(e2[1]), s = new DocumentKey(r3);
      i = i.add(s);
    }).next(() => i);
  }
  containsKey(e, t) {
    const n = __PRIVATE_encodeResourcePath(t.path), r2 = IDBKeyRange.bound([n], [__PRIVATE_immediateSuccessor(n)], false, true);
    let i = 0;
    return __PRIVATE_documentTargetStore(e).J({
      index: "documentTargetsIndex",
      H: true,
      range: r2
    }, ([e2, t2], n2, r3) => {
      e2 !== 0 && (i++, r3.done());
    }).next(() => i > 0);
  }
  ot(e, t) {
    return __PRIVATE_targetsStore(e).get(t).next((e2) => e2 ? __PRIVATE_fromDbTarget(e2) : null);
  }
}

class __PRIVATE_RollingSequenceNumberBuffer {
  constructor(e) {
    this.Qn = e, this.buffer = new SortedSet(__PRIVATE_bufferEntryComparator), this.Kn = 0;
  }
  $n() {
    return ++this.Kn;
  }
  Un(e) {
    const t = [e, this.$n()];
    if (this.buffer.size < this.Qn)
      this.buffer = this.buffer.add(t);
    else {
      const e2 = this.buffer.last();
      __PRIVATE_bufferEntryComparator(t, e2) < 0 && (this.buffer = this.buffer.delete(e2).add(t));
    }
  }
  get maxValue() {
    return this.buffer.last()[0];
  }
}

class __PRIVATE_LruScheduler {
  constructor(e, t, n) {
    this.garbageCollector = e, this.asyncQueue = t, this.localStore = n, this.Wn = null;
  }
  start() {
    this.garbageCollector.params.cacheSizeCollectionThreshold !== -1 && this.Gn(60000);
  }
  stop() {
    this.Wn && (this.Wn.cancel(), this.Wn = null);
  }
  get started() {
    return this.Wn !== null;
  }
  Gn(e) {
    __PRIVATE_logDebug("LruGarbageCollector", `Garbage collection scheduled in ${e}ms`), this.Wn = this.asyncQueue.enqueueAfterDelay("lru_garbage_collection", e, async () => {
      this.Wn = null;
      try {
        await this.localStore.collectGarbage(this.garbageCollector);
      } catch (e2) {
        __PRIVATE_isIndexedDbTransactionError(e2) ? __PRIVATE_logDebug("LruGarbageCollector", "Ignoring IndexedDB error during garbage collection: ", e2) : await __PRIVATE_ignoreIfPrimaryLeaseLoss(e2);
      }
      await this.Gn(300000);
    });
  }
}

class __PRIVATE_LruGarbageCollectorImpl {
  constructor(e, t) {
    this.zn = e, this.params = t;
  }
  calculateTargetCount(e, t) {
    return this.zn.jn(e).next((e2) => Math.floor(t / 100 * e2));
  }
  nthSequenceNumber(e, t) {
    if (t === 0)
      return PersistencePromise.resolve(__PRIVATE_ListenSequence.oe);
    const n = new __PRIVATE_RollingSequenceNumberBuffer(t);
    return this.zn.forEachTarget(e, (e2) => n.Un(e2.sequenceNumber)).next(() => this.zn.Hn(e, (e2) => n.Un(e2))).next(() => n.maxValue);
  }
  removeTargets(e, t, n) {
    return this.zn.removeTargets(e, t, n);
  }
  removeOrphanedDocuments(e, t) {
    return this.zn.removeOrphanedDocuments(e, t);
  }
  collect(e, t) {
    return this.params.cacheSizeCollectionThreshold === -1 ? (__PRIVATE_logDebug("LruGarbageCollector", "Garbage collection skipped; disabled"), PersistencePromise.resolve(Ae)) : this.getCacheSize(e).next((n) => n < this.params.cacheSizeCollectionThreshold ? (__PRIVATE_logDebug("LruGarbageCollector", `Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`), Ae) : this.Jn(e, t));
  }
  getCacheSize(e) {
    return this.zn.getCacheSize(e);
  }
  Jn(e, t) {
    let n, r2, i, s, o, a, u;
    const c = Date.now();
    return this.calculateTargetCount(e, this.params.percentileToCollect).next((t2) => (t2 > this.params.maximumSequenceNumbersToCollect ? (__PRIVATE_logDebug("LruGarbageCollector", `Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${t2}`), r2 = this.params.maximumSequenceNumbersToCollect) : r2 = t2, s = Date.now(), this.nthSequenceNumber(e, r2))).next((r3) => (n = r3, o = Date.now(), this.removeTargets(e, n, t))).next((t2) => (i = t2, a = Date.now(), this.removeOrphanedDocuments(e, n))).next((e2) => {
      if (u = Date.now(), __PRIVATE_getLogLevel() <= LogLevel.DEBUG) {
        __PRIVATE_logDebug("LruGarbageCollector", `LRU Garbage Collection\n\tCounted targets in ${s - c}ms\n\tDetermined least recently used ${r2} in ` + (o - s) + "ms\n" + `\tRemoved ${i} targets in ` + (a - o) + "ms\n" + `\tRemoved ${e2} documents in ` + (u - a) + "ms\n" + `Total Duration: ${u - c}ms`);
      }
      return PersistencePromise.resolve({
        didRun: true,
        sequenceNumbersCollected: r2,
        targetsRemoved: i,
        documentsRemoved: e2
      });
    });
  }
}

class __PRIVATE_IndexedDbLruDelegateImpl {
  constructor(e, t) {
    this.db = e, this.garbageCollector = __PRIVATE_newLruGarbageCollector(this, t);
  }
  jn(e) {
    const t = this.Yn(e);
    return this.db.getTargetCache().getTargetCount(e).next((e2) => t.next((t2) => e2 + t2));
  }
  Yn(e) {
    let t = 0;
    return this.Hn(e, (e2) => {
      t++;
    }).next(() => t);
  }
  forEachTarget(e, t) {
    return this.db.getTargetCache().forEachTarget(e, t);
  }
  Hn(e, t) {
    return this.Zn(e, (e2, n) => t(n));
  }
  addReference(e, t, n) {
    return __PRIVATE_writeSentinelKey(e, n);
  }
  removeReference(e, t, n) {
    return __PRIVATE_writeSentinelKey(e, n);
  }
  removeTargets(e, t, n) {
    return this.db.getTargetCache().removeTargets(e, t, n);
  }
  markPotentiallyOrphaned(e, t) {
    return __PRIVATE_writeSentinelKey(e, t);
  }
  Xn(e, t) {
    return function __PRIVATE_mutationQueuesContainKey(e2, t2) {
      let n = false;
      return __PRIVATE_mutationQueuesStore(e2).Y((r2) => __PRIVATE_mutationQueueContainsKey(e2, r2, t2).next((e3) => (e3 && (n = true), PersistencePromise.resolve(!e3)))).next(() => n);
    }(e, t);
  }
  removeOrphanedDocuments(e, t) {
    const n = this.db.getRemoteDocumentCache().newChangeBuffer(), r2 = [];
    let i = 0;
    return this.Zn(e, (s, o) => {
      if (o <= t) {
        const t2 = this.Xn(e, s).next((t3) => {
          if (!t3)
            return i++, n.getEntry(e, s).next(() => (n.removeEntry(s, SnapshotVersion.min()), __PRIVATE_documentTargetStore(e).delete(function __PRIVATE_sentinelKey$1(e2) {
              return [0, __PRIVATE_encodeResourcePath(e2.path)];
            }(s))));
        });
        r2.push(t2);
      }
    }).next(() => PersistencePromise.waitFor(r2)).next(() => n.apply(e)).next(() => i);
  }
  removeTarget(e, t) {
    const n = t.withSequenceNumber(e.currentSequenceNumber);
    return this.db.getTargetCache().updateTargetData(e, n);
  }
  updateLimboDocument(e, t) {
    return __PRIVATE_writeSentinelKey(e, t);
  }
  Zn(e, t) {
    const n = __PRIVATE_documentTargetStore(e);
    let r2, i = __PRIVATE_ListenSequence.oe;
    return n.J({
      index: "documentTargetsIndex"
    }, ([e2, n2], { path: s, sequenceNumber: o }) => {
      e2 === 0 ? (i !== __PRIVATE_ListenSequence.oe && t(new DocumentKey(__PRIVATE_decodeResourcePath(r2)), i), i = o, r2 = s) : i = __PRIVATE_ListenSequence.oe;
    }).next(() => {
      i !== __PRIVATE_ListenSequence.oe && t(new DocumentKey(__PRIVATE_decodeResourcePath(r2)), i);
    });
  }
  getCacheSize(e) {
    return this.db.getRemoteDocumentCache().getSize(e);
  }
}

class RemoteDocumentChangeBuffer {
  constructor() {
    this.changes = new ObjectMap((e) => e.toString(), (e, t) => e.isEqual(t)), this.changesApplied = false;
  }
  addEntry(e) {
    this.assertNotApplied(), this.changes.set(e.key, e);
  }
  removeEntry(e, t) {
    this.assertNotApplied(), this.changes.set(e, MutableDocument.newInvalidDocument(e).setReadTime(t));
  }
  getEntry(e, t) {
    this.assertNotApplied();
    const n = this.changes.get(t);
    return n !== undefined ? PersistencePromise.resolve(n) : this.getFromCache(e, t);
  }
  getEntries(e, t) {
    return this.getAllFromCache(e, t);
  }
  apply(e) {
    return this.assertNotApplied(), this.changesApplied = true, this.applyChanges(e);
  }
  assertNotApplied() {
  }
}

class __PRIVATE_IndexedDbRemoteDocumentCacheImpl {
  constructor(e) {
    this.serializer = e;
  }
  setIndexManager(e) {
    this.indexManager = e;
  }
  addEntry(e, t, n) {
    return __PRIVATE_remoteDocumentsStore(e).put(n);
  }
  removeEntry(e, t, n) {
    return __PRIVATE_remoteDocumentsStore(e).delete(function __PRIVATE_dbReadTimeKey(e2, t2) {
      const n2 = e2.path.toArray();
      return [
        n2.slice(0, n2.length - 2),
        n2[n2.length - 2],
        __PRIVATE_toDbTimestampKey(t2),
        n2[n2.length - 1]
      ];
    }(t, n));
  }
  updateMetadata(e, t) {
    return this.getMetadata(e).next((n) => (n.byteSize += t, this.er(e, n)));
  }
  getEntry(e, t) {
    let n = MutableDocument.newInvalidDocument(t);
    return __PRIVATE_remoteDocumentsStore(e).J({
      index: "documentKeyIndex",
      range: IDBKeyRange.only(__PRIVATE_dbKey(t))
    }, (e2, r2) => {
      n = this.tr(t, r2);
    }).next(() => n);
  }
  nr(e, t) {
    let n = {
      size: 0,
      document: MutableDocument.newInvalidDocument(t)
    };
    return __PRIVATE_remoteDocumentsStore(e).J({
      index: "documentKeyIndex",
      range: IDBKeyRange.only(__PRIVATE_dbKey(t))
    }, (e2, r2) => {
      n = {
        document: this.tr(t, r2),
        size: __PRIVATE_dbDocumentSize(r2)
      };
    }).next(() => n);
  }
  getEntries(e, t) {
    let n = __PRIVATE_mutableDocumentMap();
    return this.rr(e, t, (e2, t2) => {
      const r2 = this.tr(e2, t2);
      n = n.insert(e2, r2);
    }).next(() => n);
  }
  ir(e, t) {
    let n = __PRIVATE_mutableDocumentMap(), r2 = new SortedMap(DocumentKey.comparator);
    return this.rr(e, t, (e2, t2) => {
      const i = this.tr(e2, t2);
      n = n.insert(e2, i), r2 = r2.insert(e2, __PRIVATE_dbDocumentSize(t2));
    }).next(() => ({
      documents: n,
      sr: r2
    }));
  }
  rr(e, t, n) {
    if (t.isEmpty())
      return PersistencePromise.resolve();
    let r2 = new SortedSet(__PRIVATE_dbKeyComparator);
    t.forEach((e2) => r2 = r2.add(e2));
    const i = IDBKeyRange.bound(__PRIVATE_dbKey(r2.first()), __PRIVATE_dbKey(r2.last())), s = r2.getIterator();
    let o = s.getNext();
    return __PRIVATE_remoteDocumentsStore(e).J({
      index: "documentKeyIndex",
      range: i
    }, (e2, t2, r3) => {
      const i2 = DocumentKey.fromSegments([...t2.prefixPath, t2.collectionGroup, t2.documentId]);
      for (;o && __PRIVATE_dbKeyComparator(o, i2) < 0; )
        n(o, null), o = s.getNext();
      o && o.isEqual(i2) && (n(o, t2), o = s.hasNext() ? s.getNext() : null), o ? r3.$(__PRIVATE_dbKey(o)) : r3.done();
    }).next(() => {
      for (;o; )
        n(o, null), o = s.hasNext() ? s.getNext() : null;
    });
  }
  getDocumentsMatchingQuery(e, t, n, r2, i) {
    const s = t.path, o = [s.popLast().toArray(), s.lastSegment(), __PRIVATE_toDbTimestampKey(n.readTime), n.documentKey.path.isEmpty() ? "" : n.documentKey.path.lastSegment()], _ = [s.popLast().toArray(), s.lastSegment(), [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER], ""];
    return __PRIVATE_remoteDocumentsStore(e).U(IDBKeyRange.bound(o, _, true)).next((e2) => {
      i == null || i.incrementDocumentReadCount(e2.length);
      let n2 = __PRIVATE_mutableDocumentMap();
      for (const i2 of e2) {
        const e3 = this.tr(DocumentKey.fromSegments(i2.prefixPath.concat(i2.collectionGroup, i2.documentId)), i2);
        e3.isFoundDocument() && (__PRIVATE_queryMatches(t, e3) || r2.has(e3.key)) && (n2 = n2.insert(e3.key, e3));
      }
      return n2;
    });
  }
  getAllFromCollectionGroup(e, t, n, r2) {
    let i = __PRIVATE_mutableDocumentMap();
    const s = __PRIVATE_dbCollectionGroupKey(t, n), o = __PRIVATE_dbCollectionGroupKey(t, IndexOffset.max());
    return __PRIVATE_remoteDocumentsStore(e).J({
      index: "collectionGroupIndex",
      range: IDBKeyRange.bound(s, o, true)
    }, (e2, t2, n2) => {
      const s2 = this.tr(DocumentKey.fromSegments(t2.prefixPath.concat(t2.collectionGroup, t2.documentId)), t2);
      i = i.insert(s2.key, s2), i.size === r2 && n2.done();
    }).next(() => i);
  }
  newChangeBuffer(e) {
    return new __PRIVATE_IndexedDbRemoteDocumentChangeBuffer(this, !!e && e.trackRemovals);
  }
  getSize(e) {
    return this.getMetadata(e).next((e2) => e2.byteSize);
  }
  getMetadata(e) {
    return __PRIVATE_documentGlobalStore(e).get("remoteDocumentGlobalKey").next((e2) => (__PRIVATE_hardAssert(!!e2), e2));
  }
  er(e, t) {
    return __PRIVATE_documentGlobalStore(e).put("remoteDocumentGlobalKey", t);
  }
  tr(e, t) {
    if (t) {
      const e2 = __PRIVATE_fromDbRemoteDocument(this.serializer, t);
      if (!(e2.isNoDocument() && e2.version.isEqual(SnapshotVersion.min())))
        return e2;
    }
    return MutableDocument.newInvalidDocument(e);
  }
}

class __PRIVATE_IndexedDbRemoteDocumentChangeBuffer extends RemoteDocumentChangeBuffer {
  constructor(e, t) {
    super(), this._r = e, this.trackRemovals = t, this.ar = new ObjectMap((e2) => e2.toString(), (e2, t2) => e2.isEqual(t2));
  }
  applyChanges(e) {
    const t = [];
    let n = 0, r2 = new SortedSet((e2, t2) => __PRIVATE_primitiveComparator(e2.canonicalString(), t2.canonicalString()));
    return this.changes.forEach((i, s) => {
      const o = this.ar.get(i);
      if (t.push(this._r.removeEntry(e, i, o.readTime)), s.isValidDocument()) {
        const _ = __PRIVATE_toDbRemoteDocument(this._r.serializer, s);
        r2 = r2.add(i.path.popLast());
        const a = __PRIVATE_dbDocumentSize(_);
        n += a - o.size, t.push(this._r.addEntry(e, i, _));
      } else if (n -= o.size, this.trackRemovals) {
        const n2 = __PRIVATE_toDbRemoteDocument(this._r.serializer, s.convertToNoDocument(SnapshotVersion.min()));
        t.push(this._r.addEntry(e, i, n2));
      }
    }), r2.forEach((n2) => {
      t.push(this._r.indexManager.addToCollectionParentIndex(e, n2));
    }), t.push(this._r.updateMetadata(e, n)), PersistencePromise.waitFor(t);
  }
  getFromCache(e, t) {
    return this._r.nr(e, t).next((e2) => (this.ar.set(t, {
      size: e2.size,
      readTime: e2.document.readTime
    }), e2.document));
  }
  getAllFromCache(e, t) {
    return this._r.ir(e, t).next(({ documents: e2, sr: t2 }) => (t2.forEach((t3, n) => {
      this.ar.set(t3, {
        size: n,
        readTime: e2.get(t3).readTime
      });
    }), e2));
  }
}

class OverlayedDocument {
  constructor(e, t) {
    this.overlayedDocument = e, this.mutatedFields = t;
  }
}

class LocalDocumentsView {
  constructor(e, t, n, r2) {
    this.remoteDocumentCache = e, this.mutationQueue = t, this.documentOverlayCache = n, this.indexManager = r2;
  }
  getDocument(e, t) {
    let n = null;
    return this.documentOverlayCache.getOverlay(e, t).next((r2) => (n = r2, this.remoteDocumentCache.getEntry(e, t))).next((e2) => (n !== null && __PRIVATE_mutationApplyToLocalView(n.mutation, e2, FieldMask.empty(), Timestamp.now()), e2));
  }
  getDocuments(e, t) {
    return this.remoteDocumentCache.getEntries(e, t).next((t2) => this.getLocalViewOfDocuments(e, t2, __PRIVATE_documentKeySet()).next(() => t2));
  }
  getLocalViewOfDocuments(e, t, n = __PRIVATE_documentKeySet()) {
    const r2 = __PRIVATE_newOverlayMap();
    return this.populateOverlays(e, r2, t).next(() => this.computeViews(e, t, r2, n).next((e2) => {
      let t2 = documentMap();
      return e2.forEach((e3, n2) => {
        t2 = t2.insert(e3, n2.overlayedDocument);
      }), t2;
    }));
  }
  getOverlayedDocuments(e, t) {
    const n = __PRIVATE_newOverlayMap();
    return this.populateOverlays(e, n, t).next(() => this.computeViews(e, t, n, __PRIVATE_documentKeySet()));
  }
  populateOverlays(e, t, n) {
    const r2 = [];
    return n.forEach((e2) => {
      t.has(e2) || r2.push(e2);
    }), this.documentOverlayCache.getOverlays(e, r2).next((e2) => {
      e2.forEach((e3, n2) => {
        t.set(e3, n2);
      });
    });
  }
  computeViews(e, t, n, r2) {
    let i = __PRIVATE_mutableDocumentMap();
    const s = __PRIVATE_newDocumentKeyMap(), o = function __PRIVATE_newOverlayedDocumentMap() {
      return __PRIVATE_newDocumentKeyMap();
    }();
    return t.forEach((e2, t2) => {
      const o2 = n.get(t2.key);
      r2.has(t2.key) && (o2 === undefined || o2.mutation instanceof __PRIVATE_PatchMutation) ? i = i.insert(t2.key, t2) : o2 !== undefined ? (s.set(t2.key, o2.mutation.getFieldMask()), __PRIVATE_mutationApplyToLocalView(o2.mutation, t2, o2.mutation.getFieldMask(), Timestamp.now())) : s.set(t2.key, FieldMask.empty());
    }), this.recalculateAndSaveOverlays(e, i).next((e2) => (e2.forEach((e3, t2) => s.set(e3, t2)), t.forEach((e3, t2) => {
      var n2;
      return o.set(e3, new OverlayedDocument(t2, (n2 = s.get(e3)) !== null && n2 !== undefined ? n2 : null));
    }), o));
  }
  recalculateAndSaveOverlays(e, t) {
    const n = __PRIVATE_newDocumentKeyMap();
    let r2 = new SortedMap((e2, t2) => e2 - t2), i = __PRIVATE_documentKeySet();
    return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e, t).next((e2) => {
      for (const i2 of e2)
        i2.keys().forEach((e3) => {
          const s = t.get(e3);
          if (s === null)
            return;
          let o = n.get(e3) || FieldMask.empty();
          o = i2.applyToLocalView(s, o), n.set(e3, o);
          const _ = (r2.get(i2.batchId) || __PRIVATE_documentKeySet()).add(e3);
          r2 = r2.insert(i2.batchId, _);
        });
    }).next(() => {
      const s = [], o = r2.getReverseIterator();
      for (;o.hasNext(); ) {
        const r3 = o.getNext(), _ = r3.key, a = r3.value, u = __PRIVATE_newMutationMap();
        a.forEach((e2) => {
          if (!i.has(e2)) {
            const r4 = __PRIVATE_calculateOverlayMutation(t.get(e2), n.get(e2));
            r4 !== null && u.set(e2, r4), i = i.add(e2);
          }
        }), s.push(this.documentOverlayCache.saveOverlays(e, _, u));
      }
      return PersistencePromise.waitFor(s);
    }).next(() => n);
  }
  recalculateAndSaveOverlaysForDocumentKeys(e, t) {
    return this.remoteDocumentCache.getEntries(e, t).next((t2) => this.recalculateAndSaveOverlays(e, t2));
  }
  getDocumentsMatchingQuery(e, t, n, r2) {
    return function __PRIVATE_isDocumentQuery$1(e2) {
      return DocumentKey.isDocumentKey(e2.path) && e2.collectionGroup === null && e2.filters.length === 0;
    }(t) ? this.getDocumentsMatchingDocumentQuery(e, t.path) : __PRIVATE_isCollectionGroupQuery(t) ? this.getDocumentsMatchingCollectionGroupQuery(e, t, n, r2) : this.getDocumentsMatchingCollectionQuery(e, t, n, r2);
  }
  getNextDocuments(e, t, n, r2) {
    return this.remoteDocumentCache.getAllFromCollectionGroup(e, t, n, r2).next((i) => {
      const s = r2 - i.size > 0 ? this.documentOverlayCache.getOverlaysForCollectionGroup(e, t, n.largestBatchId, r2 - i.size) : PersistencePromise.resolve(__PRIVATE_newOverlayMap());
      let o = -1, _ = i;
      return s.next((t2) => PersistencePromise.forEach(t2, (t3, n2) => (o < n2.largestBatchId && (o = n2.largestBatchId), i.get(t3) ? PersistencePromise.resolve() : this.remoteDocumentCache.getEntry(e, t3).next((e2) => {
        _ = _.insert(t3, e2);
      }))).next(() => this.populateOverlays(e, t2, i)).next(() => this.computeViews(e, _, t2, __PRIVATE_documentKeySet())).next((e2) => ({
        batchId: o,
        changes: __PRIVATE_convertOverlayedDocumentMapToDocumentMap(e2)
      })));
    });
  }
  getDocumentsMatchingDocumentQuery(e, t) {
    return this.getDocument(e, new DocumentKey(t)).next((e2) => {
      let t2 = documentMap();
      return e2.isFoundDocument() && (t2 = t2.insert(e2.key, e2)), t2;
    });
  }
  getDocumentsMatchingCollectionGroupQuery(e, t, n, r2) {
    const i = t.collectionGroup;
    let s = documentMap();
    return this.indexManager.getCollectionParents(e, i).next((o) => PersistencePromise.forEach(o, (o2) => {
      const _ = function __PRIVATE_asCollectionQueryAtPath(e2, t2) {
        return new __PRIVATE_QueryImpl(t2, null, e2.explicitOrderBy.slice(), e2.filters.slice(), e2.limit, e2.limitType, e2.startAt, e2.endAt);
      }(t, o2.child(i));
      return this.getDocumentsMatchingCollectionQuery(e, _, n, r2).next((e2) => {
        e2.forEach((e3, t2) => {
          s = s.insert(e3, t2);
        });
      });
    }).next(() => s));
  }
  getDocumentsMatchingCollectionQuery(e, t, n, r2) {
    let i;
    return this.documentOverlayCache.getOverlaysForCollection(e, t.path, n.largestBatchId).next((s) => (i = s, this.remoteDocumentCache.getDocumentsMatchingQuery(e, t, n, i, r2))).next((e2) => {
      i.forEach((t2, n3) => {
        const r3 = n3.getKey();
        e2.get(r3) === null && (e2 = e2.insert(r3, MutableDocument.newInvalidDocument(r3)));
      });
      let n2 = documentMap();
      return e2.forEach((e3, r3) => {
        const s = i.get(e3);
        s !== undefined && __PRIVATE_mutationApplyToLocalView(s.mutation, r3, FieldMask.empty(), Timestamp.now()), __PRIVATE_queryMatches(t, r3) && (n2 = n2.insert(e3, r3));
      }), n2;
    });
  }
}

class __PRIVATE_MemoryBundleCache {
  constructor(e) {
    this.serializer = e, this.ur = new Map, this.cr = new Map;
  }
  getBundleMetadata(e, t) {
    return PersistencePromise.resolve(this.ur.get(t));
  }
  saveBundleMetadata(e, t) {
    return this.ur.set(t.id, function __PRIVATE_fromBundleMetadata(e2) {
      return {
        id: e2.id,
        version: e2.version,
        createTime: __PRIVATE_fromVersion(e2.createTime)
      };
    }(t)), PersistencePromise.resolve();
  }
  getNamedQuery(e, t) {
    return PersistencePromise.resolve(this.cr.get(t));
  }
  saveNamedQuery(e, t) {
    return this.cr.set(t.name, function __PRIVATE_fromProtoNamedQuery(e2) {
      return {
        name: e2.name,
        query: __PRIVATE_fromBundledQuery(e2.bundledQuery),
        readTime: __PRIVATE_fromVersion(e2.readTime)
      };
    }(t)), PersistencePromise.resolve();
  }
}

class __PRIVATE_MemoryDocumentOverlayCache {
  constructor() {
    this.overlays = new SortedMap(DocumentKey.comparator), this.lr = new Map;
  }
  getOverlay(e, t) {
    return PersistencePromise.resolve(this.overlays.get(t));
  }
  getOverlays(e, t) {
    const n = __PRIVATE_newOverlayMap();
    return PersistencePromise.forEach(t, (t2) => this.getOverlay(e, t2).next((e2) => {
      e2 !== null && n.set(t2, e2);
    })).next(() => n);
  }
  saveOverlays(e, t, n) {
    return n.forEach((n2, r2) => {
      this.lt(e, t, r2);
    }), PersistencePromise.resolve();
  }
  removeOverlaysForBatchId(e, t, n) {
    const r2 = this.lr.get(n);
    return r2 !== undefined && (r2.forEach((e2) => this.overlays = this.overlays.remove(e2)), this.lr.delete(n)), PersistencePromise.resolve();
  }
  getOverlaysForCollection(e, t, n) {
    const r2 = __PRIVATE_newOverlayMap(), i = t.length + 1, s = new DocumentKey(t.child("")), o = this.overlays.getIteratorFrom(s);
    for (;o.hasNext(); ) {
      const e2 = o.getNext().value, s2 = e2.getKey();
      if (!t.isPrefixOf(s2.path))
        break;
      s2.path.length === i && (e2.largestBatchId > n && r2.set(e2.getKey(), e2));
    }
    return PersistencePromise.resolve(r2);
  }
  getOverlaysForCollectionGroup(e, t, n, r2) {
    let i = new SortedMap((e2, t2) => e2 - t2);
    const s = this.overlays.getIterator();
    for (;s.hasNext(); ) {
      const e2 = s.getNext().value;
      if (e2.getKey().getCollectionGroup() === t && e2.largestBatchId > n) {
        let t2 = i.get(e2.largestBatchId);
        t2 === null && (t2 = __PRIVATE_newOverlayMap(), i = i.insert(e2.largestBatchId, t2)), t2.set(e2.getKey(), e2);
      }
    }
    const o = __PRIVATE_newOverlayMap(), _ = i.getIterator();
    for (;_.hasNext(); ) {
      if (_.getNext().value.forEach((e2, t2) => o.set(e2, t2)), o.size() >= r2)
        break;
    }
    return PersistencePromise.resolve(o);
  }
  lt(e, t, n) {
    const r2 = this.overlays.get(n.key);
    if (r2 !== null) {
      const e2 = this.lr.get(r2.largestBatchId).delete(n.key);
      this.lr.set(r2.largestBatchId, e2);
    }
    this.overlays = this.overlays.insert(n.key, new Overlay(t, n));
    let i = this.lr.get(t);
    i === undefined && (i = __PRIVATE_documentKeySet(), this.lr.set(t, i)), this.lr.set(t, i.add(n.key));
  }
}

class __PRIVATE_ReferenceSet {
  constructor() {
    this.hr = new SortedSet(__PRIVATE_DocReference.Pr), this.Ir = new SortedSet(__PRIVATE_DocReference.Tr);
  }
  isEmpty() {
    return this.hr.isEmpty();
  }
  addReference(e, t) {
    const n = new __PRIVATE_DocReference(e, t);
    this.hr = this.hr.add(n), this.Ir = this.Ir.add(n);
  }
  Er(e, t) {
    e.forEach((e2) => this.addReference(e2, t));
  }
  removeReference(e, t) {
    this.dr(new __PRIVATE_DocReference(e, t));
  }
  Ar(e, t) {
    e.forEach((e2) => this.removeReference(e2, t));
  }
  Rr(e) {
    const t = new DocumentKey(new ResourcePath([])), n = new __PRIVATE_DocReference(t, e), r2 = new __PRIVATE_DocReference(t, e + 1), i = [];
    return this.Ir.forEachInRange([n, r2], (e2) => {
      this.dr(e2), i.push(e2.key);
    }), i;
  }
  Vr() {
    this.hr.forEach((e) => this.dr(e));
  }
  dr(e) {
    this.hr = this.hr.delete(e), this.Ir = this.Ir.delete(e);
  }
  mr(e) {
    const t = new DocumentKey(new ResourcePath([])), n = new __PRIVATE_DocReference(t, e), r2 = new __PRIVATE_DocReference(t, e + 1);
    let i = __PRIVATE_documentKeySet();
    return this.Ir.forEachInRange([n, r2], (e2) => {
      i = i.add(e2.key);
    }), i;
  }
  containsKey(e) {
    const t = new __PRIVATE_DocReference(e, 0), n = this.hr.firstAfterOrEqual(t);
    return n !== null && e.isEqual(n.key);
  }
}

class __PRIVATE_DocReference {
  constructor(e, t) {
    this.key = e, this.gr = t;
  }
  static Pr(e, t) {
    return DocumentKey.comparator(e.key, t.key) || __PRIVATE_primitiveComparator(e.gr, t.gr);
  }
  static Tr(e, t) {
    return __PRIVATE_primitiveComparator(e.gr, t.gr) || DocumentKey.comparator(e.key, t.key);
  }
}

class __PRIVATE_MemoryMutationQueue {
  constructor(e, t) {
    this.indexManager = e, this.referenceDelegate = t, this.mutationQueue = [], this.pr = 1, this.yr = new SortedSet(__PRIVATE_DocReference.Pr);
  }
  checkEmpty(e) {
    return PersistencePromise.resolve(this.mutationQueue.length === 0);
  }
  addMutationBatch(e, t, n, r2) {
    const i = this.pr;
    this.pr++, this.mutationQueue.length > 0 && this.mutationQueue[this.mutationQueue.length - 1];
    const s = new MutationBatch(i, t, n, r2);
    this.mutationQueue.push(s);
    for (const t2 of r2)
      this.yr = this.yr.add(new __PRIVATE_DocReference(t2.key, i)), this.indexManager.addToCollectionParentIndex(e, t2.key.path.popLast());
    return PersistencePromise.resolve(s);
  }
  lookupMutationBatch(e, t) {
    return PersistencePromise.resolve(this.wr(t));
  }
  getNextMutationBatchAfterBatchId(e, t) {
    const n = t + 1, r2 = this.Sr(n), i = r2 < 0 ? 0 : r2;
    return PersistencePromise.resolve(this.mutationQueue.length > i ? this.mutationQueue[i] : null);
  }
  getHighestUnacknowledgedBatchId() {
    return PersistencePromise.resolve(this.mutationQueue.length === 0 ? -1 : this.pr - 1);
  }
  getAllMutationBatches(e) {
    return PersistencePromise.resolve(this.mutationQueue.slice());
  }
  getAllMutationBatchesAffectingDocumentKey(e, t) {
    const n = new __PRIVATE_DocReference(t, 0), r2 = new __PRIVATE_DocReference(t, Number.POSITIVE_INFINITY), i = [];
    return this.yr.forEachInRange([n, r2], (e2) => {
      const t2 = this.wr(e2.gr);
      i.push(t2);
    }), PersistencePromise.resolve(i);
  }
  getAllMutationBatchesAffectingDocumentKeys(e, t) {
    let n = new SortedSet(__PRIVATE_primitiveComparator);
    return t.forEach((e2) => {
      const t2 = new __PRIVATE_DocReference(e2, 0), r2 = new __PRIVATE_DocReference(e2, Number.POSITIVE_INFINITY);
      this.yr.forEachInRange([t2, r2], (e3) => {
        n = n.add(e3.gr);
      });
    }), PersistencePromise.resolve(this.br(n));
  }
  getAllMutationBatchesAffectingQuery(e, t) {
    const n = t.path, r2 = n.length + 1;
    let i = n;
    DocumentKey.isDocumentKey(i) || (i = i.child(""));
    const s = new __PRIVATE_DocReference(new DocumentKey(i), 0);
    let o = new SortedSet(__PRIVATE_primitiveComparator);
    return this.yr.forEachWhile((e2) => {
      const t2 = e2.key.path;
      return !!n.isPrefixOf(t2) && (t2.length === r2 && (o = o.add(e2.gr)), true);
    }, s), PersistencePromise.resolve(this.br(o));
  }
  br(e) {
    const t = [];
    return e.forEach((e2) => {
      const n = this.wr(e2);
      n !== null && t.push(n);
    }), t;
  }
  removeMutationBatch(e, t) {
    __PRIVATE_hardAssert(this.Dr(t.batchId, "removed") === 0), this.mutationQueue.shift();
    let n = this.yr;
    return PersistencePromise.forEach(t.mutations, (r2) => {
      const i = new __PRIVATE_DocReference(r2.key, t.batchId);
      return n = n.delete(i), this.referenceDelegate.markPotentiallyOrphaned(e, r2.key);
    }).next(() => {
      this.yr = n;
    });
  }
  Fn(e) {
  }
  containsKey(e, t) {
    const n = new __PRIVATE_DocReference(t, 0), r2 = this.yr.firstAfterOrEqual(n);
    return PersistencePromise.resolve(t.isEqual(r2 && r2.key));
  }
  performConsistencyCheck(e) {
    return this.mutationQueue.length, PersistencePromise.resolve();
  }
  Dr(e, t) {
    return this.Sr(e);
  }
  Sr(e) {
    if (this.mutationQueue.length === 0)
      return 0;
    return e - this.mutationQueue[0].batchId;
  }
  wr(e) {
    const t = this.Sr(e);
    if (t < 0 || t >= this.mutationQueue.length)
      return null;
    return this.mutationQueue[t];
  }
}

class __PRIVATE_MemoryRemoteDocumentCacheImpl {
  constructor(e) {
    this.Cr = e, this.docs = function __PRIVATE_documentEntryMap() {
      return new SortedMap(DocumentKey.comparator);
    }(), this.size = 0;
  }
  setIndexManager(e) {
    this.indexManager = e;
  }
  addEntry(e, t) {
    const n = t.key, r2 = this.docs.get(n), i = r2 ? r2.size : 0, s = this.Cr(t);
    return this.docs = this.docs.insert(n, {
      document: t.mutableCopy(),
      size: s
    }), this.size += s - i, this.indexManager.addToCollectionParentIndex(e, n.path.popLast());
  }
  removeEntry(e) {
    const t = this.docs.get(e);
    t && (this.docs = this.docs.remove(e), this.size -= t.size);
  }
  getEntry(e, t) {
    const n = this.docs.get(t);
    return PersistencePromise.resolve(n ? n.document.mutableCopy() : MutableDocument.newInvalidDocument(t));
  }
  getEntries(e, t) {
    let n = __PRIVATE_mutableDocumentMap();
    return t.forEach((e2) => {
      const t2 = this.docs.get(e2);
      n = n.insert(e2, t2 ? t2.document.mutableCopy() : MutableDocument.newInvalidDocument(e2));
    }), PersistencePromise.resolve(n);
  }
  getDocumentsMatchingQuery(e, t, n, r2) {
    let i = __PRIVATE_mutableDocumentMap();
    const s = t.path, o = new DocumentKey(s.child("")), _ = this.docs.getIteratorFrom(o);
    for (;_.hasNext(); ) {
      const { key: e2, value: { document: o2 } } = _.getNext();
      if (!s.isPrefixOf(e2.path))
        break;
      e2.path.length > s.length + 1 || (__PRIVATE_indexOffsetComparator(__PRIVATE_newIndexOffsetFromDocument(o2), n) <= 0 || (r2.has(o2.key) || __PRIVATE_queryMatches(t, o2)) && (i = i.insert(o2.key, o2.mutableCopy())));
    }
    return PersistencePromise.resolve(i);
  }
  getAllFromCollectionGroup(e, t, n, r2) {
    fail();
  }
  vr(e, t) {
    return PersistencePromise.forEach(this.docs, (e2) => t(e2));
  }
  newChangeBuffer(e) {
    return new __PRIVATE_MemoryRemoteDocumentChangeBuffer(this);
  }
  getSize(e) {
    return PersistencePromise.resolve(this.size);
  }
}

class __PRIVATE_MemoryRemoteDocumentChangeBuffer extends RemoteDocumentChangeBuffer {
  constructor(e) {
    super(), this._r = e;
  }
  applyChanges(e) {
    const t = [];
    return this.changes.forEach((n, r2) => {
      r2.isValidDocument() ? t.push(this._r.addEntry(e, r2)) : this._r.removeEntry(n);
    }), PersistencePromise.waitFor(t);
  }
  getFromCache(e, t) {
    return this._r.getEntry(e, t);
  }
  getAllFromCache(e, t) {
    return this._r.getEntries(e, t);
  }
}

class __PRIVATE_MemoryTargetCache {
  constructor(e) {
    this.persistence = e, this.Fr = new ObjectMap((e2) => __PRIVATE_canonifyTarget(e2), __PRIVATE_targetEquals), this.lastRemoteSnapshotVersion = SnapshotVersion.min(), this.highestTargetId = 0, this.Mr = 0, this.Or = new __PRIVATE_ReferenceSet, this.targetCount = 0, this.Nr = __PRIVATE_TargetIdGenerator.On();
  }
  forEachTarget(e, t) {
    return this.Fr.forEach((e2, n) => t(n)), PersistencePromise.resolve();
  }
  getLastRemoteSnapshotVersion(e) {
    return PersistencePromise.resolve(this.lastRemoteSnapshotVersion);
  }
  getHighestSequenceNumber(e) {
    return PersistencePromise.resolve(this.Mr);
  }
  allocateTargetId(e) {
    return this.highestTargetId = this.Nr.next(), PersistencePromise.resolve(this.highestTargetId);
  }
  setTargetsMetadata(e, t, n) {
    return n && (this.lastRemoteSnapshotVersion = n), t > this.Mr && (this.Mr = t), PersistencePromise.resolve();
  }
  kn(e) {
    this.Fr.set(e.target, e);
    const t = e.targetId;
    t > this.highestTargetId && (this.Nr = new __PRIVATE_TargetIdGenerator(t), this.highestTargetId = t), e.sequenceNumber > this.Mr && (this.Mr = e.sequenceNumber);
  }
  addTargetData(e, t) {
    return this.kn(t), this.targetCount += 1, PersistencePromise.resolve();
  }
  updateTargetData(e, t) {
    return this.kn(t), PersistencePromise.resolve();
  }
  removeTargetData(e, t) {
    return this.Fr.delete(t.target), this.Or.Rr(t.targetId), this.targetCount -= 1, PersistencePromise.resolve();
  }
  removeTargets(e, t, n) {
    let r2 = 0;
    const i = [];
    return this.Fr.forEach((s, o) => {
      o.sequenceNumber <= t && n.get(o.targetId) === null && (this.Fr.delete(s), i.push(this.removeMatchingKeysForTargetId(e, o.targetId)), r2++);
    }), PersistencePromise.waitFor(i).next(() => r2);
  }
  getTargetCount(e) {
    return PersistencePromise.resolve(this.targetCount);
  }
  getTargetData(e, t) {
    const n = this.Fr.get(t) || null;
    return PersistencePromise.resolve(n);
  }
  addMatchingKeys(e, t, n) {
    return this.Or.Er(t, n), PersistencePromise.resolve();
  }
  removeMatchingKeys(e, t, n) {
    this.Or.Ar(t, n);
    const r2 = this.persistence.referenceDelegate, i = [];
    return r2 && t.forEach((t2) => {
      i.push(r2.markPotentiallyOrphaned(e, t2));
    }), PersistencePromise.waitFor(i);
  }
  removeMatchingKeysForTargetId(e, t) {
    return this.Or.Rr(t), PersistencePromise.resolve();
  }
  getMatchingKeysForTargetId(e, t) {
    const n = this.Or.mr(t);
    return PersistencePromise.resolve(n);
  }
  containsKey(e, t) {
    return PersistencePromise.resolve(this.Or.containsKey(t));
  }
}

class __PRIVATE_MemoryPersistence {
  constructor(e, t) {
    this.Lr = {}, this.overlays = {}, this.Br = new __PRIVATE_ListenSequence(0), this.kr = false, this.kr = true, this.referenceDelegate = e(this), this.qr = new __PRIVATE_MemoryTargetCache(this);
    this.indexManager = new __PRIVATE_MemoryIndexManager, this.remoteDocumentCache = function __PRIVATE_newMemoryRemoteDocumentCache(e2) {
      return new __PRIVATE_MemoryRemoteDocumentCacheImpl(e2);
    }((e2) => this.referenceDelegate.Qr(e2)), this.serializer = new __PRIVATE_LocalSerializer(t), this.Kr = new __PRIVATE_MemoryBundleCache(this.serializer);
  }
  start() {
    return Promise.resolve();
  }
  shutdown() {
    return this.kr = false, Promise.resolve();
  }
  get started() {
    return this.kr;
  }
  setDatabaseDeletedListener() {
  }
  setNetworkEnabled() {
  }
  getIndexManager(e) {
    return this.indexManager;
  }
  getDocumentOverlayCache(e) {
    let t = this.overlays[e.toKey()];
    return t || (t = new __PRIVATE_MemoryDocumentOverlayCache, this.overlays[e.toKey()] = t), t;
  }
  getMutationQueue(e, t) {
    let n = this.Lr[e.toKey()];
    return n || (n = new __PRIVATE_MemoryMutationQueue(t, this.referenceDelegate), this.Lr[e.toKey()] = n), n;
  }
  getTargetCache() {
    return this.qr;
  }
  getRemoteDocumentCache() {
    return this.remoteDocumentCache;
  }
  getBundleCache() {
    return this.Kr;
  }
  runTransaction(e, t, n) {
    __PRIVATE_logDebug("MemoryPersistence", "Starting transaction:", e);
    const r2 = new __PRIVATE_MemoryTransaction(this.Br.next());
    return this.referenceDelegate.$r(), n(r2).next((e2) => this.referenceDelegate.Ur(r2).next(() => e2)).toPromise().then((e2) => (r2.raiseOnCommittedEvent(), e2));
  }
  Wr(e, t) {
    return PersistencePromise.or(Object.values(this.Lr).map((n) => () => n.containsKey(e, t)));
  }
}

class __PRIVATE_MemoryTransaction extends PersistenceTransaction {
  constructor(e) {
    super(), this.currentSequenceNumber = e;
  }
}

class __PRIVATE_MemoryEagerDelegate {
  constructor(e) {
    this.persistence = e, this.Gr = new __PRIVATE_ReferenceSet, this.zr = null;
  }
  static jr(e) {
    return new __PRIVATE_MemoryEagerDelegate(e);
  }
  get Hr() {
    if (this.zr)
      return this.zr;
    throw fail();
  }
  addReference(e, t, n) {
    return this.Gr.addReference(n, t), this.Hr.delete(n.toString()), PersistencePromise.resolve();
  }
  removeReference(e, t, n) {
    return this.Gr.removeReference(n, t), this.Hr.add(n.toString()), PersistencePromise.resolve();
  }
  markPotentiallyOrphaned(e, t) {
    return this.Hr.add(t.toString()), PersistencePromise.resolve();
  }
  removeTarget(e, t) {
    this.Gr.Rr(t.targetId).forEach((e2) => this.Hr.add(e2.toString()));
    const n = this.persistence.getTargetCache();
    return n.getMatchingKeysForTargetId(e, t.targetId).next((e2) => {
      e2.forEach((e3) => this.Hr.add(e3.toString()));
    }).next(() => n.removeTargetData(e, t));
  }
  $r() {
    this.zr = new Set;
  }
  Ur(e) {
    const t = this.persistence.getRemoteDocumentCache().newChangeBuffer();
    return PersistencePromise.forEach(this.Hr, (n) => {
      const r2 = DocumentKey.fromPath(n);
      return this.Jr(e, r2).next((e2) => {
        e2 || t.removeEntry(r2, SnapshotVersion.min());
      });
    }).next(() => (this.zr = null, t.apply(e)));
  }
  updateLimboDocument(e, t) {
    return this.Jr(e, t).next((e2) => {
      e2 ? this.Hr.delete(t.toString()) : this.Hr.add(t.toString());
    });
  }
  Qr(e) {
    return 0;
  }
  Jr(e, t) {
    return PersistencePromise.or([() => PersistencePromise.resolve(this.Gr.containsKey(t)), () => this.persistence.getTargetCache().containsKey(e, t), () => this.persistence.Wr(e, t)]);
  }
}
class __PRIVATE_SchemaConverter {
  constructor(e) {
    this.serializer = e;
  }
  O(e, t, n, r2) {
    const i = new __PRIVATE_SimpleDbTransaction("createOrUpgrade", t);
    n < 1 && r2 >= 1 && (function __PRIVATE_createPrimaryClientStore(e2) {
      e2.createObjectStore("owner");
    }(e), function __PRIVATE_createMutationQueue(e2) {
      e2.createObjectStore("mutationQueues", {
        keyPath: "userId"
      });
      e2.createObjectStore("mutations", {
        keyPath: "batchId",
        autoIncrement: true
      }).createIndex("userMutationsIndex", x2, {
        unique: true
      }), e2.createObjectStore("documentMutations");
    }(e), __PRIVATE_createQueryCache(e), function __PRIVATE_createLegacyRemoteDocumentCache(e2) {
      e2.createObjectStore("remoteDocuments");
    }(e));
    let s = PersistencePromise.resolve();
    return n < 3 && r2 >= 3 && (n !== 0 && (!function __PRIVATE_dropQueryCache(e2) {
      e2.deleteObjectStore("targetDocuments"), e2.deleteObjectStore("targets"), e2.deleteObjectStore("targetGlobal");
    }(e), __PRIVATE_createQueryCache(e)), s = s.next(() => function __PRIVATE_writeEmptyTargetGlobalEntry(e2) {
      const t2 = e2.store("targetGlobal"), n2 = {
        highestTargetId: 0,
        highestListenSequenceNumber: 0,
        lastRemoteSnapshotVersion: SnapshotVersion.min().toTimestamp(),
        targetCount: 0
      };
      return t2.put("targetGlobalKey", n2);
    }(i))), n < 4 && r2 >= 4 && (n !== 0 && (s = s.next(() => function __PRIVATE_upgradeMutationBatchSchemaAndMigrateData(e2, t2) {
      return t2.store("mutations").U().next((n2) => {
        e2.deleteObjectStore("mutations");
        e2.createObjectStore("mutations", {
          keyPath: "batchId",
          autoIncrement: true
        }).createIndex("userMutationsIndex", x2, {
          unique: true
        });
        const r3 = t2.store("mutations"), i2 = n2.map((e3) => r3.put(e3));
        return PersistencePromise.waitFor(i2);
      });
    }(e, i))), s = s.next(() => {
      (function __PRIVATE_createClientMetadataStore(e2) {
        e2.createObjectStore("clientMetadata", {
          keyPath: "clientId"
        });
      })(e);
    })), n < 5 && r2 >= 5 && (s = s.next(() => this.Zr(i))), n < 6 && r2 >= 6 && (s = s.next(() => (function __PRIVATE_createDocumentGlobalStore(e2) {
      e2.createObjectStore("remoteDocumentGlobal");
    }(e), this.Xr(i)))), n < 7 && r2 >= 7 && (s = s.next(() => this.ei(i))), n < 8 && r2 >= 8 && (s = s.next(() => this.ti(e, i))), n < 9 && r2 >= 9 && (s = s.next(() => {
      (function __PRIVATE_dropRemoteDocumentChangesStore(e2) {
        e2.objectStoreNames.contains("remoteDocumentChanges") && e2.deleteObjectStore("remoteDocumentChanges");
      })(e);
    })), n < 10 && r2 >= 10 && (s = s.next(() => this.ni(i))), n < 11 && r2 >= 11 && (s = s.next(() => {
      (function __PRIVATE_createBundlesStore(e2) {
        e2.createObjectStore("bundles", {
          keyPath: "bundleId"
        });
      })(e), function __PRIVATE_createNamedQueriesStore(e2) {
        e2.createObjectStore("namedQueries", {
          keyPath: "name"
        });
      }(e);
    })), n < 12 && r2 >= 12 && (s = s.next(() => {
      (function __PRIVATE_createDocumentOverlayStore(e2) {
        const t2 = e2.createObjectStore("documentOverlays", {
          keyPath: z2
        });
        t2.createIndex("collectionPathOverlayIndex", j, {
          unique: false
        }), t2.createIndex("collectionGroupOverlayIndex", H2, {
          unique: false
        });
      })(e);
    })), n < 13 && r2 >= 13 && (s = s.next(() => function __PRIVATE_createRemoteDocumentCache(e2) {
      const t2 = e2.createObjectStore("remoteDocumentsV14", {
        keyPath: N2
      });
      t2.createIndex("documentKeyIndex", L), t2.createIndex("collectionGroupIndex", B2);
    }(e)).next(() => this.ri(e, i)).next(() => e.deleteObjectStore("remoteDocuments"))), n < 14 && r2 >= 14 && (s = s.next(() => this.ii(e, i))), n < 15 && r2 >= 15 && (s = s.next(() => function __PRIVATE_createFieldIndex(e2) {
      e2.createObjectStore("indexConfiguration", {
        keyPath: "indexId",
        autoIncrement: true
      }).createIndex("collectionGroupIndex", "collectionGroup", {
        unique: false
      });
      e2.createObjectStore("indexState", {
        keyPath: $
      }).createIndex("sequenceNumberIndex", U2, {
        unique: false
      });
      e2.createObjectStore("indexEntries", {
        keyPath: W2
      }).createIndex("documentKeyIndex", G2, {
        unique: false
      });
    }(e))), n < 16 && r2 >= 16 && (s = s.next(() => {
      t.objectStore("indexState").clear();
    }).next(() => {
      t.objectStore("indexEntries").clear();
    })), s;
  }
  Xr(e) {
    let t = 0;
    return e.store("remoteDocuments").J((e2, n) => {
      t += __PRIVATE_dbDocumentSize(n);
    }).next(() => {
      const n = {
        byteSize: t
      };
      return e.store("remoteDocumentGlobal").put("remoteDocumentGlobalKey", n);
    });
  }
  Zr(e) {
    const t = e.store("mutationQueues"), n = e.store("mutations");
    return t.U().next((t2) => PersistencePromise.forEach(t2, (t3) => {
      const r2 = IDBKeyRange.bound([t3.userId, -1], [t3.userId, t3.lastAcknowledgedBatchId]);
      return n.U("userMutationsIndex", r2).next((n2) => PersistencePromise.forEach(n2, (n3) => {
        __PRIVATE_hardAssert(n3.userId === t3.userId);
        const r3 = __PRIVATE_fromDbMutationBatch(this.serializer, n3);
        return removeMutationBatch(e, t3.userId, r3).next(() => {
        });
      }));
    }));
  }
  ei(e) {
    const t = e.store("targetDocuments"), n = e.store("remoteDocuments");
    return e.store("targetGlobal").get("targetGlobalKey").next((e2) => {
      const r2 = [];
      return n.J((n2, i) => {
        const s = new ResourcePath(n2), o = function __PRIVATE_sentinelKey(e3) {
          return [0, __PRIVATE_encodeResourcePath(e3)];
        }(s);
        r2.push(t.get(o).next((n3) => n3 ? PersistencePromise.resolve() : ((n4) => t.put({
          targetId: 0,
          path: __PRIVATE_encodeResourcePath(n4),
          sequenceNumber: e2.highestListenSequenceNumber
        }))(s)));
      }).next(() => PersistencePromise.waitFor(r2));
    });
  }
  ti(e, t) {
    e.createObjectStore("collectionParents", {
      keyPath: K2
    });
    const n = t.store("collectionParents"), r2 = new __PRIVATE_MemoryCollectionParentIndex, addEntry = (e2) => {
      if (r2.add(e2)) {
        const t2 = e2.lastSegment(), r3 = e2.popLast();
        return n.put({
          collectionId: t2,
          parent: __PRIVATE_encodeResourcePath(r3)
        });
      }
    };
    return t.store("remoteDocuments").J({
      H: true
    }, (e2, t2) => {
      const n2 = new ResourcePath(e2);
      return addEntry(n2.popLast());
    }).next(() => t.store("documentMutations").J({
      H: true
    }, ([e2, t2, n2], r3) => {
      const i = __PRIVATE_decodeResourcePath(t2);
      return addEntry(i.popLast());
    }));
  }
  ni(e) {
    const t = e.store("targets");
    return t.J((e2, n) => {
      const r2 = __PRIVATE_fromDbTarget(n), i = __PRIVATE_toDbTarget(this.serializer, r2);
      return t.put(i);
    });
  }
  ri(e, t) {
    const n = t.store("remoteDocuments"), r2 = [];
    return n.J((e2, n2) => {
      const i = t.store("remoteDocumentsV14"), s = function __PRIVATE_extractKey(e3) {
        return e3.document ? new DocumentKey(ResourcePath.fromString(e3.document.name).popFirst(5)) : e3.noDocument ? DocumentKey.fromSegments(e3.noDocument.path) : e3.unknownDocument ? DocumentKey.fromSegments(e3.unknownDocument.path) : fail();
      }(n2).path.toArray(), o = {
        prefixPath: s.slice(0, s.length - 2),
        collectionGroup: s[s.length - 2],
        documentId: s[s.length - 1],
        readTime: n2.readTime || [0, 0],
        unknownDocument: n2.unknownDocument,
        noDocument: n2.noDocument,
        document: n2.document,
        hasCommittedMutations: !!n2.hasCommittedMutations
      };
      r2.push(i.put(o));
    }).next(() => PersistencePromise.waitFor(r2));
  }
  ii(e, t) {
    const n = t.store("mutations"), r2 = __PRIVATE_newIndexedDbRemoteDocumentCache(this.serializer), i = new __PRIVATE_MemoryPersistence(__PRIVATE_MemoryEagerDelegate.jr, this.serializer.ut);
    return n.U().next((e2) => {
      const n2 = new Map;
      return e2.forEach((e3) => {
        var t2;
        let r3 = (t2 = n2.get(e3.userId)) !== null && t2 !== undefined ? t2 : __PRIVATE_documentKeySet();
        __PRIVATE_fromDbMutationBatch(this.serializer, e3).keys().forEach((e4) => r3 = r3.add(e4)), n2.set(e3.userId, r3);
      }), PersistencePromise.forEach(n2, (e3, n3) => {
        const s = new User(n3), o = __PRIVATE_IndexedDbDocumentOverlayCache.ct(this.serializer, s), _ = i.getIndexManager(s), a = __PRIVATE_IndexedDbMutationQueue.ct(s, this.serializer, _, i.referenceDelegate);
        return new LocalDocumentsView(r2, a, o, _).recalculateAndSaveOverlaysForDocumentKeys(new __PRIVATE_IndexedDbTransaction(t, __PRIVATE_ListenSequence.oe), e3).next();
      });
    });
  }
}
var Re = "Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.";

class __PRIVATE_IndexedDbPersistence {
  constructor(e, t, n, r2, i, s, o, _, a, u, c = 16) {
    if (this.allowTabSynchronization = e, this.persistenceKey = t, this.clientId = n, this.si = i, this.window = s, this.document = o, this.oi = a, this._i = u, this.ai = c, this.Br = null, this.kr = false, this.isPrimary = false, this.networkEnabled = true, this.ui = null, this.inForeground = false, this.ci = null, this.li = null, this.hi = Number.NEGATIVE_INFINITY, this.Pi = (e2) => Promise.resolve(), !__PRIVATE_IndexedDbPersistence.D())
      throw new FirestoreError(C2.UNIMPLEMENTED, "This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");
    this.referenceDelegate = new __PRIVATE_IndexedDbLruDelegateImpl(this, r2), this.Ii = t + "main", this.serializer = new __PRIVATE_LocalSerializer(_), this.Ti = new __PRIVATE_SimpleDb(this.Ii, this.ai, new __PRIVATE_SchemaConverter(this.serializer)), this.qr = new __PRIVATE_IndexedDbTargetCache(this.referenceDelegate, this.serializer), this.remoteDocumentCache = __PRIVATE_newIndexedDbRemoteDocumentCache(this.serializer), this.Kr = new __PRIVATE_IndexedDbBundleCache, this.window && this.window.localStorage ? this.Ei = this.window.localStorage : (this.Ei = null, u === false && __PRIVATE_logError("IndexedDbPersistence", "LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."));
  }
  start() {
    return this.di().then(() => {
      if (!this.isPrimary && !this.allowTabSynchronization)
        throw new FirestoreError(C2.FAILED_PRECONDITION, Re);
      return this.Ai(), this.Ri(), this.Vi(), this.runTransaction("getHighestListenSequenceNumber", "readonly", (e) => this.qr.getHighestSequenceNumber(e));
    }).then((e) => {
      this.Br = new __PRIVATE_ListenSequence(e, this.oi);
    }).then(() => {
      this.kr = true;
    }).catch((e) => (this.Ti && this.Ti.close(), Promise.reject(e)));
  }
  mi(e) {
    return this.Pi = async (t) => {
      if (this.started)
        return e(t);
    }, e(this.isPrimary);
  }
  setDatabaseDeletedListener(e) {
    this.Ti.L(async (t) => {
      t.newVersion === null && await e();
    });
  }
  setNetworkEnabled(e) {
    this.networkEnabled !== e && (this.networkEnabled = e, this.si.enqueueAndForget(async () => {
      this.started && await this.di();
    }));
  }
  di() {
    return this.runTransaction("updateClientMetadataAndTryBecomePrimary", "readwrite", (e) => __PRIVATE_clientMetadataStore(e).put({
      clientId: this.clientId,
      updateTimeMs: Date.now(),
      networkEnabled: this.networkEnabled,
      inForeground: this.inForeground
    }).next(() => {
      if (this.isPrimary)
        return this.fi(e).next((e2) => {
          e2 || (this.isPrimary = false, this.si.enqueueRetryable(() => this.Pi(false)));
        });
    }).next(() => this.gi(e)).next((t) => this.isPrimary && !t ? this.pi(e).next(() => false) : !!t && this.yi(e).next(() => true))).catch((e) => {
      if (__PRIVATE_isIndexedDbTransactionError(e))
        return __PRIVATE_logDebug("IndexedDbPersistence", "Failed to extend owner lease: ", e), this.isPrimary;
      if (!this.allowTabSynchronization)
        throw e;
      return __PRIVATE_logDebug("IndexedDbPersistence", "Releasing owner lease after error during lease refresh", e), false;
    }).then((e) => {
      this.isPrimary !== e && this.si.enqueueRetryable(() => this.Pi(e)), this.isPrimary = e;
    });
  }
  fi(e) {
    return __PRIVATE_primaryClientStore(e).get("owner").next((e2) => PersistencePromise.resolve(this.wi(e2)));
  }
  Si(e) {
    return __PRIVATE_clientMetadataStore(e).delete(this.clientId);
  }
  async bi() {
    if (this.isPrimary && !this.Di(this.hi, 1800000)) {
      this.hi = Date.now();
      const e = await this.runTransaction("maybeGarbageCollectMultiClientState", "readwrite-primary", (e2) => {
        const t = __PRIVATE_getStore(e2, "clientMetadata");
        return t.U().next((e3) => {
          const n = this.Ci(e3, 1800000), r2 = e3.filter((e4) => n.indexOf(e4) === -1);
          return PersistencePromise.forEach(r2, (e4) => t.delete(e4.clientId)).next(() => r2);
        });
      }).catch(() => []);
      if (this.Ei)
        for (const t of e)
          this.Ei.removeItem(this.vi(t.clientId));
    }
  }
  Vi() {
    this.li = this.si.enqueueAfterDelay("client_metadata_refresh", 4000, () => this.di().then(() => this.bi()).then(() => this.Vi()));
  }
  wi(e) {
    return !!e && e.ownerId === this.clientId;
  }
  gi(e) {
    if (this._i)
      return PersistencePromise.resolve(true);
    return __PRIVATE_primaryClientStore(e).get("owner").next((t) => {
      if (t !== null && this.Di(t.leaseTimestampMs, 5000) && !this.Fi(t.ownerId)) {
        if (this.wi(t) && this.networkEnabled)
          return true;
        if (!this.wi(t)) {
          if (!t.allowTabSynchronization)
            throw new FirestoreError(C2.FAILED_PRECONDITION, Re);
          return false;
        }
      }
      return !(!this.networkEnabled || !this.inForeground) || __PRIVATE_clientMetadataStore(e).U().next((e2) => this.Ci(e2, 5000).find((e3) => {
        if (this.clientId !== e3.clientId) {
          const t2 = !this.networkEnabled && e3.networkEnabled, n = !this.inForeground && e3.inForeground, r2 = this.networkEnabled === e3.networkEnabled;
          if (t2 || n && r2)
            return true;
        }
        return false;
      }) === undefined);
    }).next((e2) => (this.isPrimary !== e2 && __PRIVATE_logDebug("IndexedDbPersistence", `Client ${e2 ? "is" : "is not"} eligible for a primary lease.`), e2));
  }
  async shutdown() {
    this.kr = false, this.Mi(), this.li && (this.li.cancel(), this.li = null), this.xi(), this.Oi(), await this.Ti.runTransaction("shutdown", "readwrite", ["owner", "clientMetadata"], (e) => {
      const t = new __PRIVATE_IndexedDbTransaction(e, __PRIVATE_ListenSequence.oe);
      return this.pi(t).next(() => this.Si(t));
    }), this.Ti.close(), this.Ni();
  }
  Ci(e, t) {
    return e.filter((e2) => this.Di(e2.updateTimeMs, t) && !this.Fi(e2.clientId));
  }
  Li() {
    return this.runTransaction("getActiveClients", "readonly", (e) => __PRIVATE_clientMetadataStore(e).U().next((e2) => this.Ci(e2, 1800000).map((e3) => e3.clientId)));
  }
  get started() {
    return this.kr;
  }
  getMutationQueue(e, t) {
    return __PRIVATE_IndexedDbMutationQueue.ct(e, this.serializer, t, this.referenceDelegate);
  }
  getTargetCache() {
    return this.qr;
  }
  getRemoteDocumentCache() {
    return this.remoteDocumentCache;
  }
  getIndexManager(e) {
    return new __PRIVATE_IndexedDbIndexManager(e, this.serializer.ut.databaseId);
  }
  getDocumentOverlayCache(e) {
    return __PRIVATE_IndexedDbDocumentOverlayCache.ct(this.serializer, e);
  }
  getBundleCache() {
    return this.Kr;
  }
  runTransaction(e, t, n) {
    __PRIVATE_logDebug("IndexedDbPersistence", "Starting transaction:", e);
    const r2 = t === "readonly" ? "readonly" : "readwrite", i = function __PRIVATE_getObjectStores(e2) {
      return e2 === 16 ? te : e2 === 15 ? ee : e2 === 14 ? X2 : e2 === 13 ? Z2 : e2 === 12 ? Y2 : e2 === 11 ? J2 : void fail();
    }(this.ai);
    let s;
    return this.Ti.runTransaction(e, r2, i, (r3) => (s = new __PRIVATE_IndexedDbTransaction(r3, this.Br ? this.Br.next() : __PRIVATE_ListenSequence.oe), t === "readwrite-primary" ? this.fi(s).next((e2) => !!e2 || this.gi(s)).next((t2) => {
      if (!t2)
        throw __PRIVATE_logError(`Failed to obtain primary lease for action '${e}'.`), this.isPrimary = false, this.si.enqueueRetryable(() => this.Pi(false)), new FirestoreError(C2.FAILED_PRECONDITION, F2);
      return n(s);
    }).next((e2) => this.yi(s).next(() => e2)) : this.Bi(s).next(() => n(s)))).then((e2) => (s.raiseOnCommittedEvent(), e2));
  }
  Bi(e) {
    return __PRIVATE_primaryClientStore(e).get("owner").next((e2) => {
      if (e2 !== null && this.Di(e2.leaseTimestampMs, 5000) && !this.Fi(e2.ownerId) && !this.wi(e2) && !(this._i || this.allowTabSynchronization && e2.allowTabSynchronization))
        throw new FirestoreError(C2.FAILED_PRECONDITION, Re);
    });
  }
  yi(e) {
    const t = {
      ownerId: this.clientId,
      allowTabSynchronization: this.allowTabSynchronization,
      leaseTimestampMs: Date.now()
    };
    return __PRIVATE_primaryClientStore(e).put("owner", t);
  }
  static D() {
    return __PRIVATE_SimpleDb.D();
  }
  pi(e) {
    const t = __PRIVATE_primaryClientStore(e);
    return t.get("owner").next((e2) => this.wi(e2) ? (__PRIVATE_logDebug("IndexedDbPersistence", "Releasing primary lease."), t.delete("owner")) : PersistencePromise.resolve());
  }
  Di(e, t) {
    const n = Date.now();
    return !(e < n - t) && (!(e > n) || (__PRIVATE_logError(`Detected an update time that is in the future: ${e} > ${n}`), false));
  }
  Ai() {
    this.document !== null && typeof this.document.addEventListener == "function" && (this.ci = () => {
      this.si.enqueueAndForget(() => (this.inForeground = this.document.visibilityState === "visible", this.di()));
    }, this.document.addEventListener("visibilitychange", this.ci), this.inForeground = this.document.visibilityState === "visible");
  }
  xi() {
    this.ci && (this.document.removeEventListener("visibilitychange", this.ci), this.ci = null);
  }
  Ri() {
    var e;
    typeof ((e = this.window) === null || e === undefined ? undefined : e.addEventListener) == "function" && (this.ui = () => {
      this.Mi();
      const e2 = /(?:Version|Mobile)\/1[456]/;
      isSafari() && (navigator.appVersion.match(e2) || navigator.userAgent.match(e2)) && this.si.enterRestrictedMode(true), this.si.enqueueAndForget(() => this.shutdown());
    }, this.window.addEventListener("pagehide", this.ui));
  }
  Oi() {
    this.ui && (this.window.removeEventListener("pagehide", this.ui), this.ui = null);
  }
  Fi(e) {
    var t;
    try {
      const n = ((t = this.Ei) === null || t === undefined ? undefined : t.getItem(this.vi(e))) !== null;
      return __PRIVATE_logDebug("IndexedDbPersistence", `Client '${e}' ${n ? "is" : "is not"} zombied in LocalStorage`), n;
    } catch (e2) {
      return __PRIVATE_logError("IndexedDbPersistence", "Failed to get zombied client id.", e2), false;
    }
  }
  Mi() {
    if (this.Ei)
      try {
        this.Ei.setItem(this.vi(this.clientId), String(Date.now()));
      } catch (e) {
        __PRIVATE_logError("Failed to set zombie client id.", e);
      }
  }
  Ni() {
    if (this.Ei)
      try {
        this.Ei.removeItem(this.vi(this.clientId));
      } catch (e) {
      }
  }
  vi(e) {
    return `firestore_zombie_${this.persistenceKey}_${e}`;
  }
}

class __PRIVATE_LocalViewChanges {
  constructor(e, t, n, r2) {
    this.targetId = e, this.fromCache = t, this.ki = n, this.qi = r2;
  }
  static Qi(e, t) {
    let n = __PRIVATE_documentKeySet(), r2 = __PRIVATE_documentKeySet();
    for (const e2 of t.docChanges)
      switch (e2.type) {
        case 0:
          n = n.add(e2.doc.key);
          break;
        case 1:
          r2 = r2.add(e2.doc.key);
      }
    return new __PRIVATE_LocalViewChanges(e, t.fromCache, n, r2);
  }
}

class QueryContext {
  constructor() {
    this._documentReadCount = 0;
  }
  get documentReadCount() {
    return this._documentReadCount;
  }
  incrementDocumentReadCount(e) {
    this._documentReadCount += e;
  }
}

class __PRIVATE_QueryEngine {
  constructor() {
    this.Ki = false, this.$i = false, this.Ui = 100, this.Wi = function __PRIVATE_getDefaultRelativeIndexReadCostPerDocument() {
      return isSafari() ? 8 : __PRIVATE_getAndroidVersion(getUA()) > 0 ? 6 : 4;
    }();
  }
  initialize(e, t) {
    this.Gi = e, this.indexManager = t, this.Ki = true;
  }
  getDocumentsMatchingQuery(e, t, n, r2) {
    const i = {
      result: null
    };
    return this.zi(e, t).next((e2) => {
      i.result = e2;
    }).next(() => {
      if (!i.result)
        return this.ji(e, t, r2, n).next((e2) => {
          i.result = e2;
        });
    }).next(() => {
      if (i.result)
        return;
      const n2 = new QueryContext;
      return this.Hi(e, t, n2).next((r3) => {
        if (i.result = r3, this.$i)
          return this.Ji(e, t, n2, r3.size);
      });
    }).next(() => i.result);
  }
  Ji(e, t, n, r2) {
    return n.documentReadCount < this.Ui ? (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "SDK will not create cache indexes for query:", __PRIVATE_stringifyQuery(t), "since it only creates cache indexes for collection contains", "more than or equal to", this.Ui, "documents"), PersistencePromise.resolve()) : (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "Query:", __PRIVATE_stringifyQuery(t), "scans", n.documentReadCount, "local documents and returns", r2, "documents as results."), n.documentReadCount > this.Wi * r2 ? (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "The SDK decides to create cache indexes for query:", __PRIVATE_stringifyQuery(t), "as using cache indexes may help improve performance."), this.indexManager.createTargetIndexes(e, __PRIVATE_queryToTarget(t))) : PersistencePromise.resolve());
  }
  zi(e, t) {
    if (__PRIVATE_queryMatchesAllDocuments(t))
      return PersistencePromise.resolve(null);
    let n = __PRIVATE_queryToTarget(t);
    return this.indexManager.getIndexType(e, n).next((r2) => r2 === 0 ? null : (t.limit !== null && r2 === 1 && (t = __PRIVATE_queryWithLimit(t, null, "F"), n = __PRIVATE_queryToTarget(t)), this.indexManager.getDocumentsMatchingTarget(e, n).next((r3) => {
      const i = __PRIVATE_documentKeySet(...r3);
      return this.Gi.getDocuments(e, i).next((r4) => this.indexManager.getMinOffset(e, n).next((n2) => {
        const s = this.Yi(t, r4);
        return this.Zi(t, s, i, n2.readTime) ? this.zi(e, __PRIVATE_queryWithLimit(t, null, "F")) : this.Xi(e, s, t, n2);
      }));
    })));
  }
  ji(e, t, n, r2) {
    return __PRIVATE_queryMatchesAllDocuments(t) || r2.isEqual(SnapshotVersion.min()) ? PersistencePromise.resolve(null) : this.Gi.getDocuments(e, n).next((i) => {
      const s = this.Yi(t, i);
      return this.Zi(t, s, n, r2) ? PersistencePromise.resolve(null) : (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "Re-using previous result from %s to execute query: %s", r2.toString(), __PRIVATE_stringifyQuery(t)), this.Xi(e, s, t, __PRIVATE_newIndexOffsetSuccessorFromReadTime(r2, -1)).next((e2) => e2));
    });
  }
  Yi(e, t) {
    let n = new SortedSet(__PRIVATE_newQueryComparator(e));
    return t.forEach((t2, r2) => {
      __PRIVATE_queryMatches(e, r2) && (n = n.add(r2));
    }), n;
  }
  Zi(e, t, n, r2) {
    if (e.limit === null)
      return false;
    if (n.size !== t.size)
      return true;
    const i = e.limitType === "F" ? t.last() : t.first();
    return !!i && (i.hasPendingWrites || i.version.compareTo(r2) > 0);
  }
  Hi(e, t, n) {
    return __PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "Using full collection scan to execute query:", __PRIVATE_stringifyQuery(t)), this.Gi.getDocumentsMatchingQuery(e, t, IndexOffset.min(), n);
  }
  Xi(e, t, n, r2) {
    return this.Gi.getDocumentsMatchingQuery(e, n, r2).next((e2) => (t.forEach((t2) => {
      e2 = e2.insert(t2.key, t2);
    }), e2));
  }
}

class __PRIVATE_LocalStoreImpl {
  constructor(e, t, n, r2) {
    this.persistence = e, this.es = t, this.serializer = r2, this.ts = new SortedMap(__PRIVATE_primitiveComparator), this.ns = new ObjectMap((e2) => __PRIVATE_canonifyTarget(e2), __PRIVATE_targetEquals), this.rs = new Map, this.ss = e.getRemoteDocumentCache(), this.qr = e.getTargetCache(), this.Kr = e.getBundleCache(), this.os(n);
  }
  os(e) {
    this.documentOverlayCache = this.persistence.getDocumentOverlayCache(e), this.indexManager = this.persistence.getIndexManager(e), this.mutationQueue = this.persistence.getMutationQueue(e, this.indexManager), this.localDocuments = new LocalDocumentsView(this.ss, this.mutationQueue, this.documentOverlayCache, this.indexManager), this.ss.setIndexManager(this.indexManager), this.es.initialize(this.localDocuments, this.indexManager);
  }
  collectGarbage(e) {
    return this.persistence.runTransaction("Collect garbage", "readwrite-primary", (t) => e.collect(t, this.ts));
  }
}

class __PRIVATE_MutationMetadata {
  constructor(e, t, n, r2) {
    this.user = e, this.batchId = t, this.state = n, this.error = r2;
  }
  static Ts(e, t, n) {
    const r2 = JSON.parse(n);
    let i, s = typeof r2 == "object" && ["pending", "acknowledged", "rejected"].indexOf(r2.state) !== -1 && (r2.error === undefined || typeof r2.error == "object");
    return s && r2.error && (s = typeof r2.error.message == "string" && typeof r2.error.code == "string", s && (i = new FirestoreError(r2.error.code, r2.error.message))), s ? new __PRIVATE_MutationMetadata(e, t, r2.state, i) : (__PRIVATE_logError("SharedClientState", `Failed to parse mutation state for ID '${t}': ${n}`), null);
  }
  Es() {
    const e = {
      state: this.state,
      updateTimeMs: Date.now()
    };
    return this.error && (e.error = {
      code: this.error.code,
      message: this.error.message
    }), JSON.stringify(e);
  }
}

class __PRIVATE_QueryTargetMetadata {
  constructor(e, t, n) {
    this.targetId = e, this.state = t, this.error = n;
  }
  static Ts(e, t) {
    const n = JSON.parse(t);
    let r2, i = typeof n == "object" && ["not-current", "current", "rejected"].indexOf(n.state) !== -1 && (n.error === undefined || typeof n.error == "object");
    return i && n.error && (i = typeof n.error.message == "string" && typeof n.error.code == "string", i && (r2 = new FirestoreError(n.error.code, n.error.message))), i ? new __PRIVATE_QueryTargetMetadata(e, n.state, r2) : (__PRIVATE_logError("SharedClientState", `Failed to parse target state for ID '${e}': ${t}`), null);
  }
  Es() {
    const e = {
      state: this.state,
      updateTimeMs: Date.now()
    };
    return this.error && (e.error = {
      code: this.error.code,
      message: this.error.message
    }), JSON.stringify(e);
  }
}

class __PRIVATE_RemoteClientState {
  constructor(e, t) {
    this.clientId = e, this.activeTargetIds = t;
  }
  static Ts(e, t) {
    const n = JSON.parse(t);
    let r2 = typeof n == "object" && n.activeTargetIds instanceof Array, i = __PRIVATE_targetIdSet();
    for (let e2 = 0;r2 && e2 < n.activeTargetIds.length; ++e2)
      r2 = isSafeInteger(n.activeTargetIds[e2]), i = i.add(n.activeTargetIds[e2]);
    return r2 ? new __PRIVATE_RemoteClientState(e, i) : (__PRIVATE_logError("SharedClientState", `Failed to parse client data for instance '${e}': ${t}`), null);
  }
}

class __PRIVATE_SharedOnlineState {
  constructor(e, t) {
    this.clientId = e, this.onlineState = t;
  }
  static Ts(e) {
    const t = JSON.parse(e);
    return typeof t == "object" && ["Unknown", "Online", "Offline"].indexOf(t.onlineState) !== -1 && typeof t.clientId == "string" ? new __PRIVATE_SharedOnlineState(t.clientId, t.onlineState) : (__PRIVATE_logError("SharedClientState", `Failed to parse online state: ${e}`), null);
  }
}

class __PRIVATE_LocalClientState {
  constructor() {
    this.activeTargetIds = __PRIVATE_targetIdSet();
  }
  ds(e) {
    this.activeTargetIds = this.activeTargetIds.add(e);
  }
  As(e) {
    this.activeTargetIds = this.activeTargetIds.delete(e);
  }
  Es() {
    const e = {
      activeTargetIds: this.activeTargetIds.toArray(),
      updateTimeMs: Date.now()
    };
    return JSON.stringify(e);
  }
}

class __PRIVATE_WebStorageSharedClientState {
  constructor(e, t, n, r2, i) {
    this.window = e, this.si = t, this.persistenceKey = n, this.Rs = r2, this.syncEngine = null, this.onlineStateHandler = null, this.sequenceNumberHandler = null, this.Vs = this.fs.bind(this), this.gs = new SortedMap(__PRIVATE_primitiveComparator), this.started = false, this.ps = [];
    const s = n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    this.storage = this.window.localStorage, this.currentUser = i, this.ys = createWebStorageClientStateKey(this.persistenceKey, this.Rs), this.ws = function createWebStorageSequenceNumberKey(e2) {
      return `firestore_sequence_number_${e2}`;
    }(this.persistenceKey), this.gs = this.gs.insert(this.Rs, new __PRIVATE_LocalClientState), this.Ss = new RegExp(`^firestore_clients_${s}_([^_]*)\$`), this.bs = new RegExp(`^firestore_mutations_${s}_(\\d+)(?:_(.*))?\$`), this.Ds = new RegExp(`^firestore_targets_${s}_(\\d+)\$`), this.Cs = function createWebStorageOnlineStateKey(e2) {
      return `firestore_online_state_${e2}`;
    }(this.persistenceKey), this.vs = function createBundleLoadedKey(e2) {
      return `firestore_bundle_loaded_v2_${e2}`;
    }(this.persistenceKey), this.window.addEventListener("storage", this.Vs);
  }
  static D(e) {
    return !(!e || !e.localStorage);
  }
  async start() {
    const e = await this.syncEngine.Li();
    for (const t2 of e) {
      if (t2 === this.Rs)
        continue;
      const e2 = this.getItem(createWebStorageClientStateKey(this.persistenceKey, t2));
      if (e2) {
        const n = __PRIVATE_RemoteClientState.Ts(t2, e2);
        n && (this.gs = this.gs.insert(n.clientId, n));
      }
    }
    this.Fs();
    const t = this.storage.getItem(this.Cs);
    if (t) {
      const e2 = this.Ms(t);
      e2 && this.xs(e2);
    }
    for (const e2 of this.ps)
      this.fs(e2);
    this.ps = [], this.window.addEventListener("pagehide", () => this.shutdown()), this.started = true;
  }
  writeSequenceNumber(e) {
    this.setItem(this.ws, JSON.stringify(e));
  }
  getAllActiveQueryTargets() {
    return this.Os(this.gs);
  }
  isActiveQueryTarget(e) {
    let t = false;
    return this.gs.forEach((n, r2) => {
      r2.activeTargetIds.has(e) && (t = true);
    }), t;
  }
  addPendingMutation(e) {
    this.Ns(e, "pending");
  }
  updateMutationState(e, t, n) {
    this.Ns(e, t, n), this.Ls(e);
  }
  addLocalQueryTarget(e) {
    let t = "not-current";
    if (this.isActiveQueryTarget(e)) {
      const n = this.storage.getItem(createWebStorageQueryTargetMetadataKey(this.persistenceKey, e));
      if (n) {
        const r2 = __PRIVATE_QueryTargetMetadata.Ts(e, n);
        r2 && (t = r2.state);
      }
    }
    return this.Bs.ds(e), this.Fs(), t;
  }
  removeLocalQueryTarget(e) {
    this.Bs.As(e), this.Fs();
  }
  isLocalQueryTarget(e) {
    return this.Bs.activeTargetIds.has(e);
  }
  clearQueryState(e) {
    this.removeItem(createWebStorageQueryTargetMetadataKey(this.persistenceKey, e));
  }
  updateQueryState(e, t, n) {
    this.ks(e, t, n);
  }
  handleUserChange(e, t, n) {
    t.forEach((e2) => {
      this.Ls(e2);
    }), this.currentUser = e, n.forEach((e2) => {
      this.addPendingMutation(e2);
    });
  }
  setOnlineState(e) {
    this.qs(e);
  }
  notifyBundleLoaded(e) {
    this.Qs(e);
  }
  shutdown() {
    this.started && (this.window.removeEventListener("storage", this.Vs), this.removeItem(this.ys), this.started = false);
  }
  getItem(e) {
    const t = this.storage.getItem(e);
    return __PRIVATE_logDebug("SharedClientState", "READ", e, t), t;
  }
  setItem(e, t) {
    __PRIVATE_logDebug("SharedClientState", "SET", e, t), this.storage.setItem(e, t);
  }
  removeItem(e) {
    __PRIVATE_logDebug("SharedClientState", "REMOVE", e), this.storage.removeItem(e);
  }
  fs(e) {
    const t = e;
    if (t.storageArea === this.storage) {
      if (__PRIVATE_logDebug("SharedClientState", "EVENT", t.key, t.newValue), t.key === this.ys)
        return void __PRIVATE_logError("Received WebStorage notification for local change. Another client might have garbage-collected our state");
      this.si.enqueueRetryable(async () => {
        if (this.started) {
          if (t.key !== null) {
            if (this.Ss.test(t.key)) {
              if (t.newValue == null) {
                const e2 = this.Ks(t.key);
                return this.$s(e2, null);
              }
              {
                const e2 = this.Us(t.key, t.newValue);
                if (e2)
                  return this.$s(e2.clientId, e2);
              }
            } else if (this.bs.test(t.key)) {
              if (t.newValue !== null) {
                const e2 = this.Ws(t.key, t.newValue);
                if (e2)
                  return this.Gs(e2);
              }
            } else if (this.Ds.test(t.key)) {
              if (t.newValue !== null) {
                const e2 = this.zs(t.key, t.newValue);
                if (e2)
                  return this.js(e2);
              }
            } else if (t.key === this.Cs) {
              if (t.newValue !== null) {
                const e2 = this.Ms(t.newValue);
                if (e2)
                  return this.xs(e2);
              }
            } else if (t.key === this.ws) {
              const e2 = function __PRIVATE_fromWebStorageSequenceNumber(e3) {
                let t2 = __PRIVATE_ListenSequence.oe;
                if (e3 != null)
                  try {
                    const n = JSON.parse(e3);
                    __PRIVATE_hardAssert(typeof n == "number"), t2 = n;
                  } catch (e4) {
                    __PRIVATE_logError("SharedClientState", "Failed to read sequence number from WebStorage", e4);
                  }
                return t2;
              }(t.newValue);
              e2 !== __PRIVATE_ListenSequence.oe && this.sequenceNumberHandler(e2);
            } else if (t.key === this.vs) {
              const e2 = this.Hs(t.newValue);
              await Promise.all(e2.map((e3) => this.syncEngine.Js(e3)));
            }
          }
        } else
          this.ps.push(t);
      });
    }
  }
  get Bs() {
    return this.gs.get(this.Rs);
  }
  Fs() {
    this.setItem(this.ys, this.Bs.Es());
  }
  Ns(e, t, n) {
    const r2 = new __PRIVATE_MutationMetadata(this.currentUser, e, t, n), i = createWebStorageMutationBatchKey(this.persistenceKey, this.currentUser, e);
    this.setItem(i, r2.Es());
  }
  Ls(e) {
    const t = createWebStorageMutationBatchKey(this.persistenceKey, this.currentUser, e);
    this.removeItem(t);
  }
  qs(e) {
    const t = {
      clientId: this.Rs,
      onlineState: e
    };
    this.storage.setItem(this.Cs, JSON.stringify(t));
  }
  ks(e, t, n) {
    const r2 = createWebStorageQueryTargetMetadataKey(this.persistenceKey, e), i = new __PRIVATE_QueryTargetMetadata(e, t, n);
    this.setItem(r2, i.Es());
  }
  Qs(e) {
    const t = JSON.stringify(Array.from(e));
    this.setItem(this.vs, t);
  }
  Ks(e) {
    const t = this.Ss.exec(e);
    return t ? t[1] : null;
  }
  Us(e, t) {
    const n = this.Ks(e);
    return __PRIVATE_RemoteClientState.Ts(n, t);
  }
  Ws(e, t) {
    const n = this.bs.exec(e), r2 = Number(n[1]), i = n[2] !== undefined ? n[2] : null;
    return __PRIVATE_MutationMetadata.Ts(new User(i), r2, t);
  }
  zs(e, t) {
    const n = this.Ds.exec(e), r2 = Number(n[1]);
    return __PRIVATE_QueryTargetMetadata.Ts(r2, t);
  }
  Ms(e) {
    return __PRIVATE_SharedOnlineState.Ts(e);
  }
  Hs(e) {
    return JSON.parse(e);
  }
  async Gs(e) {
    if (e.user.uid === this.currentUser.uid)
      return this.syncEngine.Ys(e.batchId, e.state, e.error);
    __PRIVATE_logDebug("SharedClientState", `Ignoring mutation for non-active user ${e.user.uid}`);
  }
  js(e) {
    return this.syncEngine.Zs(e.targetId, e.state, e.error);
  }
  $s(e, t) {
    const n = t ? this.gs.insert(e, t) : this.gs.remove(e), r2 = this.Os(this.gs), i = this.Os(n), s = [], o = [];
    return i.forEach((e2) => {
      r2.has(e2) || s.push(e2);
    }), r2.forEach((e2) => {
      i.has(e2) || o.push(e2);
    }), this.syncEngine.Xs(s, o).then(() => {
      this.gs = n;
    });
  }
  xs(e) {
    this.gs.get(e.clientId) && this.onlineStateHandler(e.onlineState);
  }
  Os(e) {
    let t = __PRIVATE_targetIdSet();
    return e.forEach((e2, n) => {
      t = t.unionWith(n.activeTargetIds);
    }), t;
  }
}

class __PRIVATE_MemorySharedClientState {
  constructor() {
    this.eo = new __PRIVATE_LocalClientState, this.no = {}, this.onlineStateHandler = null, this.sequenceNumberHandler = null;
  }
  addPendingMutation(e) {
  }
  updateMutationState(e, t, n) {
  }
  addLocalQueryTarget(e) {
    return this.eo.ds(e), this.no[e] || "not-current";
  }
  updateQueryState(e, t, n) {
    this.no[e] = t;
  }
  removeLocalQueryTarget(e) {
    this.eo.As(e);
  }
  isLocalQueryTarget(e) {
    return this.eo.activeTargetIds.has(e);
  }
  clearQueryState(e) {
    delete this.no[e];
  }
  getAllActiveQueryTargets() {
    return this.eo.activeTargetIds;
  }
  isActiveQueryTarget(e) {
    return this.eo.activeTargetIds.has(e);
  }
  start() {
    return this.eo = new __PRIVATE_LocalClientState, Promise.resolve();
  }
  handleUserChange(e, t, n) {
  }
  setOnlineState(e) {
  }
  shutdown() {
  }
  writeSequenceNumber(e) {
  }
  notifyBundleLoaded(e) {
  }
}

class __PRIVATE_NoopConnectivityMonitor {
  ro(e) {
  }
  shutdown() {
  }
}

class __PRIVATE_BrowserConnectivityMonitor {
  constructor() {
    this.io = () => this.so(), this.oo = () => this._o(), this.ao = [], this.uo();
  }
  ro(e) {
    this.ao.push(e);
  }
  shutdown() {
    window.removeEventListener("online", this.io), window.removeEventListener("offline", this.oo);
  }
  uo() {
    window.addEventListener("online", this.io), window.addEventListener("offline", this.oo);
  }
  so() {
    __PRIVATE_logDebug("ConnectivityMonitor", "Network connectivity changed: AVAILABLE");
    for (const e of this.ao)
      e(0);
  }
  _o() {
    __PRIVATE_logDebug("ConnectivityMonitor", "Network connectivity changed: UNAVAILABLE");
    for (const e of this.ao)
      e(1);
  }
  static D() {
    return typeof window != "undefined" && window.addEventListener !== undefined && window.removeEventListener !== undefined;
  }
}
var Ve = null;
var me = {
  BatchGetDocuments: "batchGet",
  Commit: "commit",
  RunQuery: "runQuery",
  RunAggregationQuery: "runAggregationQuery"
};

class __PRIVATE_StreamBridge {
  constructor(e) {
    this.co = e.co, this.lo = e.lo;
  }
  ho(e) {
    this.Po = e;
  }
  Io(e) {
    this.To = e;
  }
  Eo(e) {
    this.Ao = e;
  }
  onMessage(e) {
    this.Ro = e;
  }
  close() {
    this.lo();
  }
  send(e) {
    this.co(e);
  }
  Vo() {
    this.Po();
  }
  mo() {
    this.To();
  }
  fo(e) {
    this.Ao(e);
  }
  po(e) {
    this.Ro(e);
  }
}
var fe = "WebChannelConnection";

class __PRIVATE_WebChannelConnection extends class __PRIVATE_RestConnection {
  constructor(e) {
    this.databaseInfo = e, this.databaseId = e.databaseId;
    const t = e.ssl ? "https" : "http", n = encodeURIComponent(this.databaseId.projectId), r2 = encodeURIComponent(this.databaseId.database);
    this.yo = t + "://" + e.host, this.wo = `projects/${n}/databases/${r2}`, this.So = this.databaseId.database === "(default)" ? `project_id=${n}` : `project_id=${n}&database_id=${r2}`;
  }
  get bo() {
    return false;
  }
  Do(e, t, n, r2, i) {
    const s = __PRIVATE_generateUniqueDebugId(), o = this.Co(e, t.toUriEncodedString());
    __PRIVATE_logDebug("RestConnection", `Sending RPC '${e}' ${s}:`, o, n);
    const _ = {
      "google-cloud-resource-prefix": this.wo,
      "x-goog-request-params": this.So
    };
    return this.vo(_, r2, i), this.Fo(e, o, _, n).then((t2) => (__PRIVATE_logDebug("RestConnection", `Received RPC '${e}' ${s}: `, t2), t2), (t2) => {
      throw __PRIVATE_logWarn("RestConnection", `RPC '${e}' ${s} failed with error: `, t2, "url: ", o, "request:", n), t2;
    });
  }
  Mo(e, t, n, r2, i, s) {
    return this.Do(e, t, n, r2, i);
  }
  vo(e, t, n) {
    e["X-Goog-Api-Client"] = function __PRIVATE_getGoogApiClientValue() {
      return "gl-js/ fire/" + b;
    }(), e["Content-Type"] = "text/plain", this.databaseInfo.appId && (e["X-Firebase-GMPID"] = this.databaseInfo.appId), t && t.headers.forEach((t2, n2) => e[n2] = t2), n && n.headers.forEach((t2, n2) => e[n2] = t2);
  }
  Co(e, t) {
    const n = me[e];
    return `${this.yo}/v1/${t}:${n}`;
  }
  terminate() {
  }
} {
  constructor(e) {
    super(e), this.forceLongPolling = e.forceLongPolling, this.autoDetectLongPolling = e.autoDetectLongPolling, this.useFetchStreams = e.useFetchStreams, this.longPollingOptions = e.longPollingOptions;
  }
  Fo(e, t, n, r2) {
    const i = __PRIVATE_generateUniqueDebugId();
    return new Promise((s, o) => {
      const _ = new XhrIo;
      _.setWithCredentials(true), _.listenOnce(EventType.COMPLETE, () => {
        try {
          switch (_.getLastErrorCode()) {
            case ErrorCode.NO_ERROR:
              const t2 = _.getResponseJson();
              __PRIVATE_logDebug(fe, `XHR for RPC '${e}' ${i} received:`, JSON.stringify(t2)), s(t2);
              break;
            case ErrorCode.TIMEOUT:
              __PRIVATE_logDebug(fe, `RPC '${e}' ${i} timed out`), o(new FirestoreError(C2.DEADLINE_EXCEEDED, "Request time out"));
              break;
            case ErrorCode.HTTP_ERROR:
              const n2 = _.getStatus();
              if (__PRIVATE_logDebug(fe, `RPC '${e}' ${i} failed with status:`, n2, "response text:", _.getResponseText()), n2 > 0) {
                let e2 = _.getResponseJson();
                Array.isArray(e2) && (e2 = e2[0]);
                const t3 = e2 == null ? undefined : e2.error;
                if (t3 && t3.status && t3.message) {
                  const e3 = function __PRIVATE_mapCodeFromHttpResponseErrorStatus(e4) {
                    const t4 = e4.toLowerCase().replace(/_/g, "-");
                    return Object.values(C2).indexOf(t4) >= 0 ? t4 : C2.UNKNOWN;
                  }(t3.status);
                  o(new FirestoreError(e3, t3.message));
                } else
                  o(new FirestoreError(C2.UNKNOWN, "Server responded with status " + _.getStatus()));
              } else
                o(new FirestoreError(C2.UNAVAILABLE, "Connection failed."));
              break;
            default:
              fail();
          }
        } finally {
          __PRIVATE_logDebug(fe, `RPC '${e}' ${i} completed.`);
        }
      });
      const a = JSON.stringify(r2);
      __PRIVATE_logDebug(fe, `RPC '${e}' ${i} sending request:`, r2), _.send(t, "POST", a, n, 15);
    });
  }
  xo(e, t, n) {
    const r2 = __PRIVATE_generateUniqueDebugId(), i = [this.yo, "/", "google.firestore.v1.Firestore", "/", e, "/channel"], s = createWebChannelTransport(), o = getStatEventTarget(), _ = {
      httpSessionIdParam: "gsessionid",
      initMessageHeaders: {},
      messageUrlParams: {
        database: `projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`
      },
      sendRawJson: true,
      supportsCrossDomainXhr: true,
      internalChannelParams: {
        forwardChannelRequestTimeoutMs: 600000
      },
      forceLongPolling: this.forceLongPolling,
      detectBufferingProxy: this.autoDetectLongPolling
    }, a = this.longPollingOptions.timeoutSeconds;
    a !== undefined && (_.longPollingTimeout = Math.round(1000 * a)), this.useFetchStreams && (_.xmlHttpFactory = new FetchXmlHttpFactory({})), this.vo(_.initMessageHeaders, t, n), _.encodeInitMessageHeaders = true;
    const u = i.join("");
    __PRIVATE_logDebug(fe, `Creating RPC '${e}' stream ${r2}: ${u}`, _);
    const c = s.createWebChannel(u, _);
    let l2 = false, h = false;
    const P2 = new __PRIVATE_StreamBridge({
      co: (t2) => {
        h ? __PRIVATE_logDebug(fe, `Not sending because RPC '${e}' stream ${r2} is closed:`, t2) : (l2 || (__PRIVATE_logDebug(fe, `Opening RPC '${e}' stream ${r2} transport.`), c.open(), l2 = true), __PRIVATE_logDebug(fe, `RPC '${e}' stream ${r2} sending:`, t2), c.send(t2));
      },
      lo: () => c.close()
    }), __PRIVATE_unguardedEventListen = (e2, t2, n2) => {
      e2.listen(t2, (e3) => {
        try {
          n2(e3);
        } catch (e4) {
          setTimeout(() => {
            throw e4;
          }, 0);
        }
      });
    };
    return __PRIVATE_unguardedEventListen(c, WebChannel.EventType.OPEN, () => {
      h || (__PRIVATE_logDebug(fe, `RPC '${e}' stream ${r2} transport opened.`), P2.Vo());
    }), __PRIVATE_unguardedEventListen(c, WebChannel.EventType.CLOSE, () => {
      h || (h = true, __PRIVATE_logDebug(fe, `RPC '${e}' stream ${r2} transport closed`), P2.fo());
    }), __PRIVATE_unguardedEventListen(c, WebChannel.EventType.ERROR, (t2) => {
      h || (h = true, __PRIVATE_logWarn(fe, `RPC '${e}' stream ${r2} transport errored:`, t2), P2.fo(new FirestoreError(C2.UNAVAILABLE, "The operation could not be completed")));
    }), __PRIVATE_unguardedEventListen(c, WebChannel.EventType.MESSAGE, (t2) => {
      var n2;
      if (!h) {
        const i2 = t2.data[0];
        __PRIVATE_hardAssert(!!i2);
        const s2 = i2, o2 = s2.error || ((n2 = s2[0]) === null || n2 === undefined ? undefined : n2.error);
        if (o2) {
          __PRIVATE_logDebug(fe, `RPC '${e}' stream ${r2} received error:`, o2);
          const t3 = o2.status;
          let n3 = function __PRIVATE_mapCodeFromRpcStatus(e2) {
            const t4 = ce[e2];
            if (t4 !== undefined)
              return __PRIVATE_mapCodeFromRpcCode(t4);
          }(t3), i3 = o2.message;
          n3 === undefined && (n3 = C2.INTERNAL, i3 = "Unknown error status: " + t3 + " with message " + o2.message), h = true, P2.fo(new FirestoreError(n3, i3)), c.close();
        } else
          __PRIVATE_logDebug(fe, `RPC '${e}' stream ${r2} received:`, i2), P2.po(i2);
      }
    }), __PRIVATE_unguardedEventListen(o, Event.STAT_EVENT, (t2) => {
      t2.stat === Stat.PROXY ? __PRIVATE_logDebug(fe, `RPC '${e}' stream ${r2} detected buffering proxy`) : t2.stat === Stat.NOPROXY && __PRIVATE_logDebug(fe, `RPC '${e}' stream ${r2} detected no buffering proxy`);
    }), setTimeout(() => {
      P2.mo();
    }, 0), P2;
  }
}

class __PRIVATE_ExponentialBackoff {
  constructor(e, t, n = 1000, r2 = 1.5, i = 60000) {
    this.si = e, this.timerId = t, this.Oo = n, this.No = r2, this.Lo = i, this.Bo = 0, this.ko = null, this.qo = Date.now(), this.reset();
  }
  reset() {
    this.Bo = 0;
  }
  Qo() {
    this.Bo = this.Lo;
  }
  Ko(e) {
    this.cancel();
    const t = Math.floor(this.Bo + this.$o()), n = Math.max(0, Date.now() - this.qo), r2 = Math.max(0, t - n);
    r2 > 0 && __PRIVATE_logDebug("ExponentialBackoff", `Backing off for ${r2} ms (base delay: ${this.Bo} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`), this.ko = this.si.enqueueAfterDelay(this.timerId, r2, () => (this.qo = Date.now(), e())), this.Bo *= this.No, this.Bo < this.Oo && (this.Bo = this.Oo), this.Bo > this.Lo && (this.Bo = this.Lo);
  }
  Uo() {
    this.ko !== null && (this.ko.skipDelay(), this.ko = null);
  }
  cancel() {
    this.ko !== null && (this.ko.cancel(), this.ko = null);
  }
  $o() {
    return (Math.random() - 0.5) * this.Bo;
  }
}

class __PRIVATE_PersistentStream {
  constructor(e, t, n, r2, i, s, o, _) {
    this.si = e, this.Wo = n, this.Go = r2, this.connection = i, this.authCredentialsProvider = s, this.appCheckCredentialsProvider = o, this.listener = _, this.state = 0, this.zo = 0, this.jo = null, this.Ho = null, this.stream = null, this.Jo = new __PRIVATE_ExponentialBackoff(e, t);
  }
  Yo() {
    return this.state === 1 || this.state === 5 || this.Zo();
  }
  Zo() {
    return this.state === 2 || this.state === 3;
  }
  start() {
    this.state !== 4 ? this.auth() : this.Xo();
  }
  async stop() {
    this.Yo() && await this.close(0);
  }
  e_() {
    this.state = 0, this.Jo.reset();
  }
  t_() {
    this.Zo() && this.jo === null && (this.jo = this.si.enqueueAfterDelay(this.Wo, 60000, () => this.n_()));
  }
  r_(e) {
    this.i_(), this.stream.send(e);
  }
  async n_() {
    if (this.Zo())
      return this.close(0);
  }
  i_() {
    this.jo && (this.jo.cancel(), this.jo = null);
  }
  s_() {
    this.Ho && (this.Ho.cancel(), this.Ho = null);
  }
  async close(e, t) {
    this.i_(), this.s_(), this.Jo.cancel(), this.zo++, e !== 4 ? this.Jo.reset() : t && t.code === C2.RESOURCE_EXHAUSTED ? (__PRIVATE_logError(t.toString()), __PRIVATE_logError("Using maximum backoff delay to prevent overloading the backend."), this.Jo.Qo()) : t && t.code === C2.UNAUTHENTICATED && this.state !== 3 && (this.authCredentialsProvider.invalidateToken(), this.appCheckCredentialsProvider.invalidateToken()), this.stream !== null && (this.o_(), this.stream.close(), this.stream = null), this.state = e, await this.listener.Eo(t);
  }
  o_() {
  }
  auth() {
    this.state = 1;
    const e = this.__(this.zo), t = this.zo;
    Promise.all([this.authCredentialsProvider.getToken(), this.appCheckCredentialsProvider.getToken()]).then(([e2, n]) => {
      this.zo === t && this.a_(e2, n);
    }, (t2) => {
      e(() => {
        const e2 = new FirestoreError(C2.UNKNOWN, "Fetching auth token failed: " + t2.message);
        return this.u_(e2);
      });
    });
  }
  a_(e, t) {
    const n = this.__(this.zo);
    this.stream = this.c_(e, t), this.stream.ho(() => {
      n(() => this.listener.ho());
    }), this.stream.Io(() => {
      n(() => (this.state = 2, this.Ho = this.si.enqueueAfterDelay(this.Go, 1e4, () => (this.Zo() && (this.state = 3), Promise.resolve())), this.listener.Io()));
    }), this.stream.Eo((e2) => {
      n(() => this.u_(e2));
    }), this.stream.onMessage((e2) => {
      n(() => this.onMessage(e2));
    });
  }
  Xo() {
    this.state = 5, this.Jo.Ko(async () => {
      this.state = 0, this.start();
    });
  }
  u_(e) {
    return __PRIVATE_logDebug("PersistentStream", `close with error: ${e}`), this.stream = null, this.close(4, e);
  }
  __(e) {
    return (t) => {
      this.si.enqueueAndForget(() => this.zo === e ? t() : (__PRIVATE_logDebug("PersistentStream", "stream callback skipped by getCloseGuardedDispatcher."), Promise.resolve()));
    };
  }
}

class __PRIVATE_PersistentListenStream extends __PRIVATE_PersistentStream {
  constructor(e, t, n, r2, i, s) {
    super(e, "listen_stream_connection_backoff", "listen_stream_idle", "health_check_timeout", t, n, r2, s), this.serializer = i;
  }
  c_(e, t) {
    return this.connection.xo("Listen", e, t);
  }
  onMessage(e) {
    this.Jo.reset();
    const t = __PRIVATE_fromWatchChange(this.serializer, e), n = function __PRIVATE_versionFromListenResponse(e2) {
      if (!("targetChange" in e2))
        return SnapshotVersion.min();
      const t2 = e2.targetChange;
      return t2.targetIds && t2.targetIds.length ? SnapshotVersion.min() : t2.readTime ? __PRIVATE_fromVersion(t2.readTime) : SnapshotVersion.min();
    }(e);
    return this.listener.l_(t, n);
  }
  h_(e) {
    const t = {};
    t.database = __PRIVATE_getEncodedDatabaseId(this.serializer), t.addTarget = function __PRIVATE_toTarget(e2, t2) {
      let n2;
      const r2 = t2.target;
      if (n2 = __PRIVATE_targetIsDocumentTarget(r2) ? {
        documents: __PRIVATE_toDocumentsTarget(e2, r2)
      } : {
        query: __PRIVATE_toQueryTarget(e2, r2)._t
      }, n2.targetId = t2.targetId, t2.resumeToken.approximateByteSize() > 0) {
        n2.resumeToken = __PRIVATE_toBytes(e2, t2.resumeToken);
        const r3 = __PRIVATE_toInt32Proto(e2, t2.expectedCount);
        r3 !== null && (n2.expectedCount = r3);
      } else if (t2.snapshotVersion.compareTo(SnapshotVersion.min()) > 0) {
        n2.readTime = toTimestamp(e2, t2.snapshotVersion.toTimestamp());
        const r3 = __PRIVATE_toInt32Proto(e2, t2.expectedCount);
        r3 !== null && (n2.expectedCount = r3);
      }
      return n2;
    }(this.serializer, e);
    const n = __PRIVATE_toListenRequestLabels(this.serializer, e);
    n && (t.labels = n), this.r_(t);
  }
  P_(e) {
    const t = {};
    t.database = __PRIVATE_getEncodedDatabaseId(this.serializer), t.removeTarget = e, this.r_(t);
  }
}

class __PRIVATE_PersistentWriteStream extends __PRIVATE_PersistentStream {
  constructor(e, t, n, r2, i, s) {
    super(e, "write_stream_connection_backoff", "write_stream_idle", "health_check_timeout", t, n, r2, s), this.serializer = i, this.I_ = false;
  }
  get T_() {
    return this.I_;
  }
  start() {
    this.I_ = false, this.lastStreamToken = undefined, super.start();
  }
  o_() {
    this.I_ && this.E_([]);
  }
  c_(e, t) {
    return this.connection.xo("Write", e, t);
  }
  onMessage(e) {
    if (__PRIVATE_hardAssert(!!e.streamToken), this.lastStreamToken = e.streamToken, this.I_) {
      this.Jo.reset();
      const t = __PRIVATE_fromWriteResults(e.writeResults, e.commitTime), n = __PRIVATE_fromVersion(e.commitTime);
      return this.listener.d_(n, t);
    }
    return __PRIVATE_hardAssert(!e.writeResults || e.writeResults.length === 0), this.I_ = true, this.listener.A_();
  }
  R_() {
    const e = {};
    e.database = __PRIVATE_getEncodedDatabaseId(this.serializer), this.r_(e);
  }
  E_(e) {
    const t = {
      streamToken: this.lastStreamToken,
      writes: e.map((e2) => toMutation(this.serializer, e2))
    };
    this.r_(t);
  }
}

class __PRIVATE_DatastoreImpl extends class Datastore {
} {
  constructor(e, t, n, r2) {
    super(), this.authCredentials = e, this.appCheckCredentials = t, this.connection = n, this.serializer = r2, this.V_ = false;
  }
  m_() {
    if (this.V_)
      throw new FirestoreError(C2.FAILED_PRECONDITION, "The client has already been terminated.");
  }
  Do(e, t, n, r2) {
    return this.m_(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then(([i, s]) => this.connection.Do(e, __PRIVATE_toResourcePath(t, n), r2, i, s)).catch((e2) => {
      throw e2.name === "FirebaseError" ? (e2.code === C2.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), e2) : new FirestoreError(C2.UNKNOWN, e2.toString());
    });
  }
  Mo(e, t, n, r2, i) {
    return this.m_(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then(([s, o]) => this.connection.Mo(e, __PRIVATE_toResourcePath(t, n), r2, s, o, i)).catch((e2) => {
      throw e2.name === "FirebaseError" ? (e2.code === C2.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), e2) : new FirestoreError(C2.UNKNOWN, e2.toString());
    });
  }
  terminate() {
    this.V_ = true, this.connection.terminate();
  }
}

class __PRIVATE_OnlineStateTracker {
  constructor(e, t) {
    this.asyncQueue = e, this.onlineStateHandler = t, this.state = "Unknown", this.g_ = 0, this.p_ = null, this.y_ = true;
  }
  w_() {
    this.g_ === 0 && (this.S_("Unknown"), this.p_ = this.asyncQueue.enqueueAfterDelay("online_state_timeout", 1e4, () => (this.p_ = null, this.b_("Backend didn't respond within 10 seconds."), this.S_("Offline"), Promise.resolve())));
  }
  D_(e) {
    this.state === "Online" ? this.S_("Unknown") : (this.g_++, this.g_ >= 1 && (this.C_(), this.b_(`Connection failed 1 times. Most recent error: ${e.toString()}`), this.S_("Offline")));
  }
  set(e) {
    this.C_(), this.g_ = 0, e === "Online" && (this.y_ = false), this.S_(e);
  }
  S_(e) {
    e !== this.state && (this.state = e, this.onlineStateHandler(e));
  }
  b_(e) {
    const t = `Could not reach Cloud Firestore backend. ${e}\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;
    this.y_ ? (__PRIVATE_logError(t), this.y_ = false) : __PRIVATE_logDebug("OnlineStateTracker", t);
  }
  C_() {
    this.p_ !== null && (this.p_.cancel(), this.p_ = null);
  }
}

class __PRIVATE_RemoteStoreImpl {
  constructor(e, t, n, r2, i) {
    this.localStore = e, this.datastore = t, this.asyncQueue = n, this.remoteSyncer = {}, this.v_ = [], this.F_ = new Map, this.M_ = new Set, this.x_ = [], this.O_ = i, this.O_.ro((e2) => {
      n.enqueueAndForget(async () => {
        __PRIVATE_canUseNetwork(this) && (__PRIVATE_logDebug("RemoteStore", "Restarting streams for network reachability change."), await async function __PRIVATE_restartNetwork(e3) {
          const t2 = __PRIVATE_debugCast(e3);
          t2.M_.add(4), await __PRIVATE_disableNetworkInternal(t2), t2.N_.set("Unknown"), t2.M_.delete(4), await __PRIVATE_enableNetworkInternal(t2);
        }(this));
      });
    }), this.N_ = new __PRIVATE_OnlineStateTracker(n, r2);
  }
}

class DelayedOperation {
  constructor(e, t, n, r2, i) {
    this.asyncQueue = e, this.timerId = t, this.targetTimeMs = n, this.op = r2, this.removalCallback = i, this.deferred = new __PRIVATE_Deferred, this.then = this.deferred.promise.then.bind(this.deferred.promise), this.deferred.promise.catch((e2) => {
    });
  }
  get promise() {
    return this.deferred.promise;
  }
  static createAndSchedule(e, t, n, r2, i) {
    const s = Date.now() + n, o = new DelayedOperation(e, t, s, r2, i);
    return o.start(n), o;
  }
  start(e) {
    this.timerHandle = setTimeout(() => this.handleDelayElapsed(), e);
  }
  skipDelay() {
    return this.handleDelayElapsed();
  }
  cancel(e) {
    this.timerHandle !== null && (this.clearTimeout(), this.deferred.reject(new FirestoreError(C2.CANCELLED, "Operation cancelled" + (e ? ": " + e : ""))));
  }
  handleDelayElapsed() {
    this.asyncQueue.enqueueAndForget(() => this.timerHandle !== null ? (this.clearTimeout(), this.op().then((e) => this.deferred.resolve(e))) : Promise.resolve());
  }
  clearTimeout() {
    this.timerHandle !== null && (this.removalCallback(this), clearTimeout(this.timerHandle), this.timerHandle = null);
  }
}

class DocumentSet {
  constructor(e) {
    this.comparator = e ? (t, n) => e(t, n) || DocumentKey.comparator(t.key, n.key) : (e2, t) => DocumentKey.comparator(e2.key, t.key), this.keyedMap = documentMap(), this.sortedSet = new SortedMap(this.comparator);
  }
  static emptySet(e) {
    return new DocumentSet(e.comparator);
  }
  has(e) {
    return this.keyedMap.get(e) != null;
  }
  get(e) {
    return this.keyedMap.get(e);
  }
  first() {
    return this.sortedSet.minKey();
  }
  last() {
    return this.sortedSet.maxKey();
  }
  isEmpty() {
    return this.sortedSet.isEmpty();
  }
  indexOf(e) {
    const t = this.keyedMap.get(e);
    return t ? this.sortedSet.indexOf(t) : -1;
  }
  get size() {
    return this.sortedSet.size;
  }
  forEach(e) {
    this.sortedSet.inorderTraversal((t, n) => (e(t), false));
  }
  add(e) {
    const t = this.delete(e.key);
    return t.copy(t.keyedMap.insert(e.key, e), t.sortedSet.insert(e, null));
  }
  delete(e) {
    const t = this.get(e);
    return t ? this.copy(this.keyedMap.remove(e), this.sortedSet.remove(t)) : this;
  }
  isEqual(e) {
    if (!(e instanceof DocumentSet))
      return false;
    if (this.size !== e.size)
      return false;
    const t = this.sortedSet.getIterator(), n = e.sortedSet.getIterator();
    for (;t.hasNext(); ) {
      const e2 = t.getNext().key, r2 = n.getNext().key;
      if (!e2.isEqual(r2))
        return false;
    }
    return true;
  }
  toString() {
    const e = [];
    return this.forEach((t) => {
      e.push(t.toString());
    }), e.length === 0 ? "DocumentSet ()" : "DocumentSet (\n  " + e.join("  \n") + "\n)";
  }
  copy(e, t) {
    const n = new DocumentSet;
    return n.comparator = this.comparator, n.keyedMap = e, n.sortedSet = t, n;
  }
}

class __PRIVATE_DocumentChangeSet {
  constructor() {
    this.q_ = new SortedMap(DocumentKey.comparator);
  }
  track(e) {
    const t = e.doc.key, n = this.q_.get(t);
    n ? e.type !== 0 && n.type === 3 ? this.q_ = this.q_.insert(t, e) : e.type === 3 && n.type !== 1 ? this.q_ = this.q_.insert(t, {
      type: n.type,
      doc: e.doc
    }) : e.type === 2 && n.type === 2 ? this.q_ = this.q_.insert(t, {
      type: 2,
      doc: e.doc
    }) : e.type === 2 && n.type === 0 ? this.q_ = this.q_.insert(t, {
      type: 0,
      doc: e.doc
    }) : e.type === 1 && n.type === 0 ? this.q_ = this.q_.remove(t) : e.type === 1 && n.type === 2 ? this.q_ = this.q_.insert(t, {
      type: 1,
      doc: n.doc
    }) : e.type === 0 && n.type === 1 ? this.q_ = this.q_.insert(t, {
      type: 2,
      doc: e.doc
    }) : fail() : this.q_ = this.q_.insert(t, e);
  }
  Q_() {
    const e = [];
    return this.q_.inorderTraversal((t, n) => {
      e.push(n);
    }), e;
  }
}

class ViewSnapshot {
  constructor(e, t, n, r2, i, s, o, _, a) {
    this.query = e, this.docs = t, this.oldDocs = n, this.docChanges = r2, this.mutatedKeys = i, this.fromCache = s, this.syncStateChanged = o, this.excludesMetadataChanges = _, this.hasCachedResults = a;
  }
  static fromInitialDocuments(e, t, n, r2, i) {
    const s = [];
    return t.forEach((e2) => {
      s.push({
        type: 0,
        doc: e2
      });
    }), new ViewSnapshot(e, t, DocumentSet.emptySet(t), s, n, r2, true, false, i);
  }
  get hasPendingWrites() {
    return !this.mutatedKeys.isEmpty();
  }
  isEqual(e) {
    if (!(this.fromCache === e.fromCache && this.hasCachedResults === e.hasCachedResults && this.syncStateChanged === e.syncStateChanged && this.mutatedKeys.isEqual(e.mutatedKeys) && __PRIVATE_queryEquals(this.query, e.query) && this.docs.isEqual(e.docs) && this.oldDocs.isEqual(e.oldDocs)))
      return false;
    const t = this.docChanges, n = e.docChanges;
    if (t.length !== n.length)
      return false;
    for (let e2 = 0;e2 < t.length; e2++)
      if (t[e2].type !== n[e2].type || !t[e2].doc.isEqual(n[e2].doc))
        return false;
    return true;
  }
}

class __PRIVATE_QueryListenersInfo {
  constructor() {
    this.K_ = undefined, this.U_ = [];
  }
  W_() {
    return this.U_.some((e) => e.G_());
  }
}

class __PRIVATE_EventManagerImpl {
  constructor() {
    this.queries = new ObjectMap((e) => __PRIVATE_canonifyQuery(e), __PRIVATE_queryEquals), this.onlineState = "Unknown", this.z_ = new Set;
  }
}
var ge;
var pe;
(pe = ge || (ge = {})).J_ = "default", pe.Cache = "cache";

class __PRIVATE_QueryListener {
  constructor(e, t, n) {
    this.query = e, this.Y_ = t, this.Z_ = false, this.X_ = null, this.onlineState = "Unknown", this.options = n || {};
  }
  H_(e) {
    if (!this.options.includeMetadataChanges) {
      const t2 = [];
      for (const n of e.docChanges)
        n.type !== 3 && t2.push(n);
      e = new ViewSnapshot(e.query, e.docs, e.oldDocs, t2, e.mutatedKeys, e.fromCache, e.syncStateChanged, true, e.hasCachedResults);
    }
    let t = false;
    return this.Z_ ? this.ea(e) && (this.Y_.next(e), t = true) : this.ta(e, this.onlineState) && (this.na(e), t = true), this.X_ = e, t;
  }
  onError(e) {
    this.Y_.error(e);
  }
  j_(e) {
    this.onlineState = e;
    let t = false;
    return this.X_ && !this.Z_ && this.ta(this.X_, e) && (this.na(this.X_), t = true), t;
  }
  ta(e, t) {
    if (!e.fromCache)
      return true;
    if (!this.G_())
      return true;
    const n = t !== "Offline";
    return (!this.options.ra || !n) && (!e.docs.isEmpty() || e.hasCachedResults || t === "Offline");
  }
  ea(e) {
    if (e.docChanges.length > 0)
      return true;
    const t = this.X_ && this.X_.hasPendingWrites !== e.hasPendingWrites;
    return !(!e.syncStateChanged && !t) && this.options.includeMetadataChanges === true;
  }
  na(e) {
    e = ViewSnapshot.fromInitialDocuments(e.query, e.docs, e.mutatedKeys, e.fromCache, e.hasCachedResults), this.Z_ = true, this.Y_.next(e);
  }
  G_() {
    return this.options.source !== ge.Cache;
  }
}
class __PRIVATE_AddedLimboDocument {
  constructor(e) {
    this.key = e;
  }
}

class __PRIVATE_RemovedLimboDocument {
  constructor(e) {
    this.key = e;
  }
}

class __PRIVATE_View {
  constructor(e, t) {
    this.query = e, this.la = t, this.ha = null, this.hasCachedResults = false, this.current = false, this.Pa = __PRIVATE_documentKeySet(), this.mutatedKeys = __PRIVATE_documentKeySet(), this.Ia = __PRIVATE_newQueryComparator(e), this.Ta = new DocumentSet(this.Ia);
  }
  get Ea() {
    return this.la;
  }
  da(e, t) {
    const n = t ? t.Aa : new __PRIVATE_DocumentChangeSet, r2 = t ? t.Ta : this.Ta;
    let i = t ? t.mutatedKeys : this.mutatedKeys, s = r2, o = false;
    const _ = this.query.limitType === "F" && r2.size === this.query.limit ? r2.last() : null, a = this.query.limitType === "L" && r2.size === this.query.limit ? r2.first() : null;
    if (e.inorderTraversal((e2, t2) => {
      const u = r2.get(e2), c = __PRIVATE_queryMatches(this.query, t2) ? t2 : null, l2 = !!u && this.mutatedKeys.has(u.key), h = !!c && (c.hasLocalMutations || this.mutatedKeys.has(c.key) && c.hasCommittedMutations);
      let P2 = false;
      if (u && c) {
        u.data.isEqual(c.data) ? l2 !== h && (n.track({
          type: 3,
          doc: c
        }), P2 = true) : this.Ra(u, c) || (n.track({
          type: 2,
          doc: c
        }), P2 = true, (_ && this.Ia(c, _) > 0 || a && this.Ia(c, a) < 0) && (o = true));
      } else
        !u && c ? (n.track({
          type: 0,
          doc: c
        }), P2 = true) : u && !c && (n.track({
          type: 1,
          doc: u
        }), P2 = true, (_ || a) && (o = true));
      P2 && (c ? (s = s.add(c), i = h ? i.add(e2) : i.delete(e2)) : (s = s.delete(e2), i = i.delete(e2)));
    }), this.query.limit !== null)
      for (;s.size > this.query.limit; ) {
        const e2 = this.query.limitType === "F" ? s.last() : s.first();
        s = s.delete(e2.key), i = i.delete(e2.key), n.track({
          type: 1,
          doc: e2
        });
      }
    return {
      Ta: s,
      Aa: n,
      Zi: o,
      mutatedKeys: i
    };
  }
  Ra(e, t) {
    return e.hasLocalMutations && t.hasCommittedMutations && !t.hasLocalMutations;
  }
  applyChanges(e, t, n, r2) {
    const i = this.Ta;
    this.Ta = e.Ta, this.mutatedKeys = e.mutatedKeys;
    const s = e.Aa.Q_();
    s.sort((e2, t2) => function __PRIVATE_compareChangeType(e3, t3) {
      const order = (e4) => {
        switch (e4) {
          case 0:
            return 1;
          case 2:
          case 3:
            return 2;
          case 1:
            return 0;
          default:
            return fail();
        }
      };
      return order(e3) - order(t3);
    }(e2.type, t2.type) || this.Ia(e2.doc, t2.doc)), this.Va(n), r2 = r2 != null && r2;
    const o = t && !r2 ? this.ma() : [], _ = this.Pa.size === 0 && this.current && !r2 ? 1 : 0, a = _ !== this.ha;
    if (this.ha = _, s.length !== 0 || a) {
      return {
        snapshot: new ViewSnapshot(this.query, e.Ta, i, s, e.mutatedKeys, _ === 0, a, false, !!n && n.resumeToken.approximateByteSize() > 0),
        fa: o
      };
    }
    return {
      fa: o
    };
  }
  j_(e) {
    return this.current && e === "Offline" ? (this.current = false, this.applyChanges({
      Ta: this.Ta,
      Aa: new __PRIVATE_DocumentChangeSet,
      mutatedKeys: this.mutatedKeys,
      Zi: false
    }, false)) : {
      fa: []
    };
  }
  ga(e) {
    return !this.la.has(e) && (!!this.Ta.has(e) && !this.Ta.get(e).hasLocalMutations);
  }
  Va(e) {
    e && (e.addedDocuments.forEach((e2) => this.la = this.la.add(e2)), e.modifiedDocuments.forEach((e2) => {
    }), e.removedDocuments.forEach((e2) => this.la = this.la.delete(e2)), this.current = e.current);
  }
  ma() {
    if (!this.current)
      return [];
    const e = this.Pa;
    this.Pa = __PRIVATE_documentKeySet(), this.Ta.forEach((e2) => {
      this.ga(e2.key) && (this.Pa = this.Pa.add(e2.key));
    });
    const t = [];
    return e.forEach((e2) => {
      this.Pa.has(e2) || t.push(new __PRIVATE_RemovedLimboDocument(e2));
    }), this.Pa.forEach((n) => {
      e.has(n) || t.push(new __PRIVATE_AddedLimboDocument(n));
    }), t;
  }
  pa(e) {
    this.la = e.ls, this.Pa = __PRIVATE_documentKeySet();
    const t = this.da(e.documents);
    return this.applyChanges(t, true);
  }
  ya() {
    return ViewSnapshot.fromInitialDocuments(this.query, this.Ta, this.mutatedKeys, this.ha === 0, this.hasCachedResults);
  }
}

class __PRIVATE_QueryView {
  constructor(e, t, n) {
    this.query = e, this.targetId = t, this.view = n;
  }
}

class LimboResolution {
  constructor(e) {
    this.key = e, this.wa = false;
  }
}

class __PRIVATE_SyncEngineImpl {
  constructor(e, t, n, r2, i, s) {
    this.localStore = e, this.remoteStore = t, this.eventManager = n, this.sharedClientState = r2, this.currentUser = i, this.maxConcurrentLimboResolutions = s, this.Sa = {}, this.ba = new ObjectMap((e2) => __PRIVATE_canonifyQuery(e2), __PRIVATE_queryEquals), this.Da = new Map, this.Ca = new Set, this.va = new SortedMap(DocumentKey.comparator), this.Fa = new Map, this.Ma = new __PRIVATE_ReferenceSet, this.xa = {}, this.Oa = new Map, this.Na = __PRIVATE_TargetIdGenerator.Nn(), this.onlineState = "Unknown", this.La = undefined;
  }
  get isPrimaryClient() {
    return this.La === true;
  }
}

class MemoryOfflineComponentProvider {
  constructor() {
    this.synchronizeTabs = false;
  }
  async initialize(e) {
    this.serializer = __PRIVATE_newSerializer(e.databaseInfo.databaseId), this.sharedClientState = this.createSharedClientState(e), this.persistence = this.createPersistence(e), await this.persistence.start(), this.localStore = this.createLocalStore(e), this.gcScheduler = this.createGarbageCollectionScheduler(e, this.localStore), this.indexBackfillerScheduler = this.createIndexBackfillerScheduler(e, this.localStore);
  }
  createGarbageCollectionScheduler(e, t) {
    return null;
  }
  createIndexBackfillerScheduler(e, t) {
    return null;
  }
  createLocalStore(e) {
    return __PRIVATE_newLocalStore(this.persistence, new __PRIVATE_QueryEngine, e.initialUser, this.serializer);
  }
  createPersistence(e) {
    return new __PRIVATE_MemoryPersistence(__PRIVATE_MemoryEagerDelegate.jr, this.serializer);
  }
  createSharedClientState(e) {
    return new __PRIVATE_MemorySharedClientState;
  }
  async terminate() {
    var e, t;
    (e = this.gcScheduler) === null || e === undefined || e.stop(), (t = this.indexBackfillerScheduler) === null || t === undefined || t.stop(), this.sharedClientState.shutdown(), await this.persistence.shutdown();
  }
}
class __PRIVATE_IndexedDbOfflineComponentProvider extends MemoryOfflineComponentProvider {
  constructor(e, t, n) {
    super(), this.Qa = e, this.cacheSizeBytes = t, this.forceOwnership = n, this.synchronizeTabs = false;
  }
  async initialize(e) {
    await super.initialize(e), await this.Qa.initialize(this, e), await __PRIVATE_syncEngineEnsureWriteCallbacks(this.Qa.syncEngine), await __PRIVATE_fillWritePipeline(this.Qa.remoteStore), await this.persistence.mi(() => (this.gcScheduler && !this.gcScheduler.started && this.gcScheduler.start(), this.indexBackfillerScheduler && !this.indexBackfillerScheduler.started && this.indexBackfillerScheduler.start(), Promise.resolve()));
  }
  createLocalStore(e) {
    return __PRIVATE_newLocalStore(this.persistence, new __PRIVATE_QueryEngine, e.initialUser, this.serializer);
  }
  createGarbageCollectionScheduler(e, t) {
    const n = this.persistence.referenceDelegate.garbageCollector;
    return new __PRIVATE_LruScheduler(n, e.asyncQueue, t);
  }
  createIndexBackfillerScheduler(e, t) {
    const n = new __PRIVATE_IndexBackfiller(t, this.persistence);
    return new __PRIVATE_IndexBackfillerScheduler(e.asyncQueue, n);
  }
  createPersistence(e) {
    const t = __PRIVATE_indexedDbStoragePrefix(e.databaseInfo.databaseId, e.databaseInfo.persistenceKey), n = this.cacheSizeBytes !== undefined ? LruParams.withCacheSize(this.cacheSizeBytes) : LruParams.DEFAULT;
    return new __PRIVATE_IndexedDbPersistence(this.synchronizeTabs, t, e.clientId, n, e.asyncQueue, __PRIVATE_getWindow(), getDocument(), this.serializer, this.sharedClientState, !!this.forceOwnership);
  }
  createSharedClientState(e) {
    return new __PRIVATE_MemorySharedClientState;
  }
}

class __PRIVATE_MultiTabOfflineComponentProvider extends __PRIVATE_IndexedDbOfflineComponentProvider {
  constructor(e, t) {
    super(e, t, false), this.Qa = e, this.cacheSizeBytes = t, this.synchronizeTabs = true;
  }
  async initialize(e) {
    await super.initialize(e);
    const t = this.Qa.syncEngine;
    this.sharedClientState instanceof __PRIVATE_WebStorageSharedClientState && (this.sharedClientState.syncEngine = {
      Ys: __PRIVATE_syncEngineApplyBatchState.bind(null, t),
      Zs: __PRIVATE_syncEngineApplyTargetState.bind(null, t),
      Xs: __PRIVATE_syncEngineApplyActiveTargetsChange.bind(null, t),
      Li: __PRIVATE_syncEngineGetActiveClients.bind(null, t),
      Js: __PRIVATE_syncEngineSynchronizeWithChangedDocuments.bind(null, t)
    }, await this.sharedClientState.start()), await this.persistence.mi(async (e2) => {
      await __PRIVATE_syncEngineApplyPrimaryState(this.Qa.syncEngine, e2), this.gcScheduler && (e2 && !this.gcScheduler.started ? this.gcScheduler.start() : e2 || this.gcScheduler.stop()), this.indexBackfillerScheduler && (e2 && !this.indexBackfillerScheduler.started ? this.indexBackfillerScheduler.start() : e2 || this.indexBackfillerScheduler.stop());
    });
  }
  createSharedClientState(e) {
    const t = __PRIVATE_getWindow();
    if (!__PRIVATE_WebStorageSharedClientState.D(t))
      throw new FirestoreError(C2.UNIMPLEMENTED, "IndexedDB persistence is only available on platforms that support LocalStorage.");
    const n = __PRIVATE_indexedDbStoragePrefix(e.databaseInfo.databaseId, e.databaseInfo.persistenceKey);
    return new __PRIVATE_WebStorageSharedClientState(t, e.asyncQueue, n, e.clientId, e.initialUser);
  }
}

class OnlineComponentProvider {
  async initialize(e, t) {
    this.localStore || (this.localStore = e.localStore, this.sharedClientState = e.sharedClientState, this.datastore = this.createDatastore(t), this.remoteStore = this.createRemoteStore(t), this.eventManager = this.createEventManager(t), this.syncEngine = this.createSyncEngine(t, !e.synchronizeTabs), this.sharedClientState.onlineStateHandler = (e2) => __PRIVATE_syncEngineApplyOnlineStateChange(this.syncEngine, e2, 1), this.remoteStore.remoteSyncer.handleCredentialChange = __PRIVATE_syncEngineHandleCredentialChange.bind(null, this.syncEngine), await __PRIVATE_remoteStoreApplyPrimaryState(this.remoteStore, this.syncEngine.isPrimaryClient));
  }
  createEventManager(e) {
    return function __PRIVATE_newEventManager() {
      return new __PRIVATE_EventManagerImpl;
    }();
  }
  createDatastore(e) {
    const t = __PRIVATE_newSerializer(e.databaseInfo.databaseId), n = function __PRIVATE_newConnection(e2) {
      return new __PRIVATE_WebChannelConnection(e2);
    }(e.databaseInfo);
    return function __PRIVATE_newDatastore(e2, t2, n2, r2) {
      return new __PRIVATE_DatastoreImpl(e2, t2, n2, r2);
    }(e.authCredentials, e.appCheckCredentials, n, t);
  }
  createRemoteStore(e) {
    return function __PRIVATE_newRemoteStore(e2, t, n, r2, i) {
      return new __PRIVATE_RemoteStoreImpl(e2, t, n, r2, i);
    }(this.localStore, this.datastore, e.asyncQueue, (e2) => __PRIVATE_syncEngineApplyOnlineStateChange(this.syncEngine, e2, 0), function __PRIVATE_newConnectivityMonitor() {
      return __PRIVATE_BrowserConnectivityMonitor.D() ? new __PRIVATE_BrowserConnectivityMonitor : new __PRIVATE_NoopConnectivityMonitor;
    }());
  }
  createSyncEngine(e, t) {
    return function __PRIVATE_newSyncEngine(e2, t2, n, r2, i, s, o) {
      const _ = new __PRIVATE_SyncEngineImpl(e2, t2, n, r2, i, s);
      return o && (_.La = true), _;
    }(this.localStore, this.remoteStore, this.eventManager, this.sharedClientState, e.initialUser, e.maxConcurrentLimboResolutions, t);
  }
  async terminate() {
    var e;
    await async function __PRIVATE_remoteStoreShutdown(e2) {
      const t = __PRIVATE_debugCast(e2);
      __PRIVATE_logDebug("RemoteStore", "RemoteStore shutting down."), t.M_.add(5), await __PRIVATE_disableNetworkInternal(t), t.O_.shutdown(), t.N_.set("Unknown");
    }(this.remoteStore), (e = this.datastore) === null || e === undefined || e.terminate();
  }
}

class __PRIVATE_AsyncObserver {
  constructor(e) {
    this.observer = e, this.muted = false;
  }
  next(e) {
    this.observer.next && this.Ka(this.observer.next, e);
  }
  error(e) {
    this.observer.error ? this.Ka(this.observer.error, e) : __PRIVATE_logError("Uncaught Error in snapshot listener:", e.toString());
  }
  $a() {
    this.muted = true;
  }
  Ka(e, t) {
    this.muted || setTimeout(() => {
      this.muted || e(t);
    }, 0);
  }
}
class FirestoreClient {
  constructor(e, t, n, r2) {
    this.authCredentials = e, this.appCheckCredentials = t, this.asyncQueue = n, this.databaseInfo = r2, this.user = User.UNAUTHENTICATED, this.clientId = __PRIVATE_AutoId.newId(), this.authCredentialListener = () => Promise.resolve(), this.appCheckCredentialListener = () => Promise.resolve(), this.authCredentials.start(n, async (e2) => {
      __PRIVATE_logDebug("FirestoreClient", "Received user=", e2.uid), await this.authCredentialListener(e2), this.user = e2;
    }), this.appCheckCredentials.start(n, (e2) => (__PRIVATE_logDebug("FirestoreClient", "Received new app check token=", e2), this.appCheckCredentialListener(e2, this.user)));
  }
  get configuration() {
    return {
      asyncQueue: this.asyncQueue,
      databaseInfo: this.databaseInfo,
      clientId: this.clientId,
      authCredentials: this.authCredentials,
      appCheckCredentials: this.appCheckCredentials,
      initialUser: this.user,
      maxConcurrentLimboResolutions: 100
    };
  }
  setCredentialChangeListener(e) {
    this.authCredentialListener = e;
  }
  setAppCheckTokenChangeListener(e) {
    this.appCheckCredentialListener = e;
  }
  verifyNotTerminated() {
    if (this.asyncQueue.isShuttingDown)
      throw new FirestoreError(C2.FAILED_PRECONDITION, "The client has already been terminated.");
  }
  terminate() {
    this.asyncQueue.enterRestrictedMode();
    const e = new __PRIVATE_Deferred;
    return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async () => {
      try {
        this._onlineComponents && await this._onlineComponents.terminate(), this._offlineComponents && await this._offlineComponents.terminate(), this.authCredentials.shutdown(), this.appCheckCredentials.shutdown(), e.resolve();
      } catch (t) {
        const n = __PRIVATE_wrapInUserErrorIfRecoverable(t, "Failed to shutdown persistence");
        e.reject(n);
      }
    }), e.promise;
  }
}
var ye = new Map;

class FirestoreSettingsImpl {
  constructor(e) {
    var t, n;
    if (e.host === undefined) {
      if (e.ssl !== undefined)
        throw new FirestoreError(C2.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
      this.host = "firestore.googleapis.com", this.ssl = true;
    } else
      this.host = e.host, this.ssl = (t = e.ssl) === null || t === undefined || t;
    if (this.credentials = e.credentials, this.ignoreUndefinedProperties = !!e.ignoreUndefinedProperties, this.localCache = e.localCache, e.cacheSizeBytes === undefined)
      this.cacheSizeBytes = 41943040;
    else {
      if (e.cacheSizeBytes !== -1 && e.cacheSizeBytes < 1048576)
        throw new FirestoreError(C2.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
      this.cacheSizeBytes = e.cacheSizeBytes;
    }
    __PRIVATE_validateIsNotUsedTogether("experimentalForceLongPolling", e.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", e.experimentalAutoDetectLongPolling), this.experimentalForceLongPolling = !!e.experimentalForceLongPolling, this.experimentalForceLongPolling ? this.experimentalAutoDetectLongPolling = false : e.experimentalAutoDetectLongPolling === undefined ? this.experimentalAutoDetectLongPolling = true : this.experimentalAutoDetectLongPolling = !!e.experimentalAutoDetectLongPolling, this.experimentalLongPollingOptions = __PRIVATE_cloneLongPollingOptions((n = e.experimentalLongPollingOptions) !== null && n !== undefined ? n : {}), function __PRIVATE_validateLongPollingOptions(e2) {
      if (e2.timeoutSeconds !== undefined) {
        if (isNaN(e2.timeoutSeconds))
          throw new FirestoreError(C2.INVALID_ARGUMENT, `invalid long polling timeout: ${e2.timeoutSeconds} (must not be NaN)`);
        if (e2.timeoutSeconds < 5)
          throw new FirestoreError(C2.INVALID_ARGUMENT, `invalid long polling timeout: ${e2.timeoutSeconds} (minimum allowed value is 5)`);
        if (e2.timeoutSeconds > 30)
          throw new FirestoreError(C2.INVALID_ARGUMENT, `invalid long polling timeout: ${e2.timeoutSeconds} (maximum allowed value is 30)`);
      }
    }(this.experimentalLongPollingOptions), this.useFetchStreams = !!e.useFetchStreams;
  }
  isEqual(e) {
    return this.host === e.host && this.ssl === e.ssl && this.credentials === e.credentials && this.cacheSizeBytes === e.cacheSizeBytes && this.experimentalForceLongPolling === e.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === e.experimentalAutoDetectLongPolling && function __PRIVATE_longPollingOptionsEqual(e2, t) {
      return e2.timeoutSeconds === t.timeoutSeconds;
    }(this.experimentalLongPollingOptions, e.experimentalLongPollingOptions) && this.ignoreUndefinedProperties === e.ignoreUndefinedProperties && this.useFetchStreams === e.useFetchStreams;
  }
}

class Firestore$1 {
  constructor(e, t, n, r2) {
    this._authCredentials = e, this._appCheckCredentials = t, this._databaseId = n, this._app = r2, this.type = "firestore-lite", this._persistenceKey = "(lite)", this._settings = new FirestoreSettingsImpl({}), this._settingsFrozen = false;
  }
  get app() {
    if (!this._app)
      throw new FirestoreError(C2.FAILED_PRECONDITION, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
    return this._app;
  }
  get _initialized() {
    return this._settingsFrozen;
  }
  get _terminated() {
    return this._terminateTask !== undefined;
  }
  _setSettings(e) {
    if (this._settingsFrozen)
      throw new FirestoreError(C2.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
    this._settings = new FirestoreSettingsImpl(e), e.credentials !== undefined && (this._authCredentials = function __PRIVATE_makeAuthCredentialsProvider(e2) {
      if (!e2)
        return new __PRIVATE_EmptyAuthCredentialsProvider;
      switch (e2.type) {
        case "firstParty":
          return new __PRIVATE_FirstPartyAuthCredentialsProvider(e2.sessionIndex || "0", e2.iamToken || null, e2.authTokenFactory || null);
        case "provider":
          return e2.client;
        default:
          throw new FirestoreError(C2.INVALID_ARGUMENT, "makeAuthCredentialsProvider failed due to invalid credential type");
      }
    }(e.credentials));
  }
  _getSettings() {
    return this._settings;
  }
  _freezeSettings() {
    return this._settingsFrozen = true, this._settings;
  }
  _delete() {
    return this._terminateTask || (this._terminateTask = this._terminate()), this._terminateTask;
  }
  toJSON() {
    return {
      app: this._app,
      databaseId: this._databaseId,
      settings: this._settings
    };
  }
  _terminate() {
    return function __PRIVATE_removeComponents(e) {
      const t = ye.get(e);
      t && (__PRIVATE_logDebug("ComponentProvider", "Removing Datastore"), ye.delete(e), t.terminate());
    }(this), Promise.resolve();
  }
}

class Query {
  constructor(e, t, n) {
    this.converter = t, this._query = n, this.type = "query", this.firestore = e;
  }
  withConverter(e) {
    return new Query(this.firestore, e, this._query);
  }
}

class DocumentReference {
  constructor(e, t, n) {
    this.converter = t, this._key = n, this.type = "document", this.firestore = e;
  }
  get _path() {
    return this._key.path;
  }
  get id() {
    return this._key.path.lastSegment();
  }
  get path() {
    return this._key.path.canonicalString();
  }
  get parent() {
    return new CollectionReference(this.firestore, this.converter, this._key.path.popLast());
  }
  withConverter(e) {
    return new DocumentReference(this.firestore, e, this._key);
  }
}

class CollectionReference extends Query {
  constructor(e, t, n) {
    super(e, t, __PRIVATE_newQueryForPath(n)), this._path = n, this.type = "collection";
  }
  get id() {
    return this._query.path.lastSegment();
  }
  get path() {
    return this._query.path.canonicalString();
  }
  get parent() {
    const e = this._path.popLast();
    return e.isEmpty() ? null : new DocumentReference(this.firestore, null, new DocumentKey(e));
  }
  withConverter(e) {
    return new CollectionReference(this.firestore, e, this._path);
  }
}

class __PRIVATE_AsyncQueueImpl {
  constructor() {
    this.iu = Promise.resolve(), this.su = [], this.ou = false, this._u = [], this.au = null, this.uu = false, this.cu = false, this.lu = [], this.Jo = new __PRIVATE_ExponentialBackoff(this, "async_queue_retry"), this.hu = () => {
      const e2 = getDocument();
      e2 && __PRIVATE_logDebug("AsyncQueue", "Visibility state changed to " + e2.visibilityState), this.Jo.Uo();
    };
    const e = getDocument();
    e && typeof e.addEventListener == "function" && e.addEventListener("visibilitychange", this.hu);
  }
  get isShuttingDown() {
    return this.ou;
  }
  enqueueAndForget(e) {
    this.enqueue(e);
  }
  enqueueAndForgetEvenWhileRestricted(e) {
    this.Pu(), this.Iu(e);
  }
  enterRestrictedMode(e) {
    if (!this.ou) {
      this.ou = true, this.cu = e || false;
      const t = getDocument();
      t && typeof t.removeEventListener == "function" && t.removeEventListener("visibilitychange", this.hu);
    }
  }
  enqueue(e) {
    if (this.Pu(), this.ou)
      return new Promise(() => {
      });
    const t = new __PRIVATE_Deferred;
    return this.Iu(() => this.ou && this.cu ? Promise.resolve() : (e().then(t.resolve, t.reject), t.promise)).then(() => t.promise);
  }
  enqueueRetryable(e) {
    this.enqueueAndForget(() => (this.su.push(e), this.Tu()));
  }
  async Tu() {
    if (this.su.length !== 0) {
      try {
        await this.su[0](), this.su.shift(), this.Jo.reset();
      } catch (e) {
        if (!__PRIVATE_isIndexedDbTransactionError(e))
          throw e;
        __PRIVATE_logDebug("AsyncQueue", "Operation failed with retryable error: " + e);
      }
      this.su.length > 0 && this.Jo.Ko(() => this.Tu());
    }
  }
  Iu(e) {
    const t = this.iu.then(() => (this.uu = true, e().catch((e2) => {
      this.au = e2, this.uu = false;
      const t2 = function __PRIVATE_getMessageOrStack(e3) {
        let t3 = e3.message || "";
        e3.stack && (t3 = e3.stack.includes(e3.message) ? e3.stack : e3.message + "\n" + e3.stack);
        return t3;
      }(e2);
      throw __PRIVATE_logError("INTERNAL UNHANDLED ERROR: ", t2), e2;
    }).then((e2) => (this.uu = false, e2))));
    return this.iu = t, t;
  }
  enqueueAfterDelay(e, t, n) {
    this.Pu(), this.lu.indexOf(e) > -1 && (t = 0);
    const r2 = DelayedOperation.createAndSchedule(this, e, t, n, (e2) => this.Eu(e2));
    return this._u.push(r2), r2;
  }
  Pu() {
    this.au && fail();
  }
  verifyOperationInProgress() {
  }
  async du() {
    let e;
    do {
      e = this.iu, await e;
    } while (e !== this.iu);
  }
  Au(e) {
    for (const t of this._u)
      if (t.timerId === e)
        return true;
    return false;
  }
  Ru(e) {
    return this.du().then(() => {
      this._u.sort((e2, t) => e2.targetTimeMs - t.targetTimeMs);
      for (const t of this._u)
        if (t.skipDelay(), e !== "all" && t.timerId === e)
          break;
      return this.du();
    });
  }
  Vu(e) {
    this.lu.push(e);
  }
  Eu(e) {
    const t = this._u.indexOf(e);
    this._u.splice(t, 1);
  }
}
class Firestore extends Firestore$1 {
  constructor(e, t, n, r2) {
    super(e, t, n, r2), this.type = "firestore", this._queue = function __PRIVATE_newAsyncQueue() {
      return new __PRIVATE_AsyncQueueImpl;
    }(), this._persistenceKey = (r2 == null ? undefined : r2.name) || "[DEFAULT]";
  }
  _terminate() {
    return this._firestoreClient || __PRIVATE_configureFirestore(this), this._firestoreClient.terminate();
  }
}
class Bytes {
  constructor(e) {
    this._byteString = e;
  }
  static fromBase64String(e) {
    try {
      return new Bytes(ByteString.fromBase64String(e));
    } catch (e2) {
      throw new FirestoreError(C2.INVALID_ARGUMENT, "Failed to construct data from Base64 string: " + e2);
    }
  }
  static fromUint8Array(e) {
    return new Bytes(ByteString.fromUint8Array(e));
  }
  toBase64() {
    return this._byteString.toBase64();
  }
  toUint8Array() {
    return this._byteString.toUint8Array();
  }
  toString() {
    return "Bytes(base64: " + this.toBase64() + ")";
  }
  isEqual(e) {
    return this._byteString.isEqual(e._byteString);
  }
}

class FieldPath {
  constructor(...e) {
    for (let t = 0;t < e.length; ++t)
      if (e[t].length === 0)
        throw new FirestoreError(C2.INVALID_ARGUMENT, "Invalid field name at argument $(i + 1). Field names must not be empty.");
    this._internalPath = new FieldPath$1(e);
  }
  isEqual(e) {
    return this._internalPath.isEqual(e._internalPath);
  }
}
class GeoPoint {
  constructor(e, t) {
    if (!isFinite(e) || e < -90 || e > 90)
      throw new FirestoreError(C2.INVALID_ARGUMENT, "Latitude must be a number between -90 and 90, but was: " + e);
    if (!isFinite(t) || t < -180 || t > 180)
      throw new FirestoreError(C2.INVALID_ARGUMENT, "Longitude must be a number between -180 and 180, but was: " + t);
    this._lat = e, this._long = t;
  }
  get latitude() {
    return this._lat;
  }
  get longitude() {
    return this._long;
  }
  isEqual(e) {
    return this._lat === e._lat && this._long === e._long;
  }
  toJSON() {
    return {
      latitude: this._lat,
      longitude: this._long
    };
  }
  _compareTo(e) {
    return __PRIVATE_primitiveComparator(this._lat, e._lat) || __PRIVATE_primitiveComparator(this._long, e._long);
  }
}
var be2 = new RegExp("[~\\*/\\[\\]]");

class DocumentSnapshot$1 {
  constructor(e, t, n, r2, i) {
    this._firestore = e, this._userDataWriter = t, this._key = n, this._document = r2, this._converter = i;
  }
  get id() {
    return this._key.path.lastSegment();
  }
  get ref() {
    return new DocumentReference(this._firestore, this._converter, this._key);
  }
  exists() {
    return this._document !== null;
  }
  data() {
    if (this._document) {
      if (this._converter) {
        const e = new QueryDocumentSnapshot$1(this._firestore, this._userDataWriter, this._key, this._document, null);
        return this._converter.fromFirestore(e);
      }
      return this._userDataWriter.convertValue(this._document.data.value);
    }
  }
  get(e) {
    if (this._document) {
      const t = this._document.data.field(__PRIVATE_fieldPathFromArgument("DocumentSnapshot.get", e));
      if (t !== null)
        return this._userDataWriter.convertValue(t);
    }
  }
}

class QueryDocumentSnapshot$1 extends DocumentSnapshot$1 {
  data() {
    return super.data();
  }
}
class AbstractUserDataWriter {
  convertValue(e, t = "none") {
    switch (__PRIVATE_typeOrder(e)) {
      case 0:
        return null;
      case 1:
        return e.booleanValue;
      case 2:
        return __PRIVATE_normalizeNumber(e.integerValue || e.doubleValue);
      case 3:
        return this.convertTimestamp(e.timestampValue);
      case 4:
        return this.convertServerTimestamp(e, t);
      case 5:
        return e.stringValue;
      case 6:
        return this.convertBytes(__PRIVATE_normalizeByteString(e.bytesValue));
      case 7:
        return this.convertReference(e.referenceValue);
      case 8:
        return this.convertGeoPoint(e.geoPointValue);
      case 9:
        return this.convertArray(e.arrayValue, t);
      case 10:
        return this.convertObject(e.mapValue, t);
      default:
        throw fail();
    }
  }
  convertObject(e, t) {
    return this.convertObjectMap(e.fields, t);
  }
  convertObjectMap(e, t = "none") {
    const n = {};
    return forEach(e, (e2, r2) => {
      n[e2] = this.convertValue(r2, t);
    }), n;
  }
  convertGeoPoint(e) {
    return new GeoPoint(__PRIVATE_normalizeNumber(e.latitude), __PRIVATE_normalizeNumber(e.longitude));
  }
  convertArray(e, t) {
    return (e.values || []).map((e2) => this.convertValue(e2, t));
  }
  convertServerTimestamp(e, t) {
    switch (t) {
      case "previous":
        const n = __PRIVATE_getPreviousValue(e);
        return n == null ? null : this.convertValue(n, t);
      case "estimate":
        return this.convertTimestamp(__PRIVATE_getLocalWriteTime(e));
      default:
        return null;
    }
  }
  convertTimestamp(e) {
    const t = __PRIVATE_normalizeTimestamp(e);
    return new Timestamp(t.seconds, t.nanos);
  }
  convertDocumentKey(e, t) {
    const n = ResourcePath.fromString(e);
    __PRIVATE_hardAssert(__PRIVATE_isValidResourceName(n));
    const r2 = new DatabaseId(n.get(1), n.get(3)), i = new DocumentKey(n.popFirst(5));
    return r2.isEqual(t) || __PRIVATE_logError(`Document ${i} contains a document reference within a different database (${r2.projectId}/${r2.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`), i;
  }
}
class SnapshotMetadata {
  constructor(e, t) {
    this.hasPendingWrites = e, this.fromCache = t;
  }
  isEqual(e) {
    return this.hasPendingWrites === e.hasPendingWrites && this.fromCache === e.fromCache;
  }
}

class DocumentSnapshot extends DocumentSnapshot$1 {
  constructor(e, t, n, r2, i, s) {
    super(e, t, n, r2, s), this._firestore = e, this._firestoreImpl = e, this.metadata = i;
  }
  exists() {
    return super.exists();
  }
  data(e = {}) {
    if (this._document) {
      if (this._converter) {
        const t = new QueryDocumentSnapshot(this._firestore, this._userDataWriter, this._key, this._document, this.metadata, null);
        return this._converter.fromFirestore(t, e);
      }
      return this._userDataWriter.convertValue(this._document.data.value, e.serverTimestamps);
    }
  }
  get(e, t = {}) {
    if (this._document) {
      const n = this._document.data.field(__PRIVATE_fieldPathFromArgument("DocumentSnapshot.get", e));
      if (n !== null)
        return this._userDataWriter.convertValue(n, t.serverTimestamps);
    }
  }
}

class QueryDocumentSnapshot extends DocumentSnapshot {
  data(e = {}) {
    return super.data(e);
  }
}
class __PRIVATE_ExpUserDataWriter extends AbstractUserDataWriter {
  constructor(e) {
    super(), this.firestore = e;
  }
  convertBytes(e) {
    return new Bytes(e);
  }
  convertReference(e) {
    const t = this.convertDocumentKey(e, this.firestore._databaseId);
    return new DocumentReference(this.firestore, null, t);
  }
}
class __PRIVATE_PersistentLocalCacheImpl {
  constructor(e) {
    let t;
    this.kind = "persistent", (e == null ? undefined : e.tabManager) ? (e.tabManager._initialize(e), t = e.tabManager) : (t = persistentSingleTabManager(undefined), t._initialize(e)), this._onlineComponentProvider = t._onlineComponentProvider, this._offlineComponentProvider = t._offlineComponentProvider;
  }
  toJSON() {
    return {
      kind: this.kind
    };
  }
}
class __PRIVATE_SingleTabManagerImpl {
  constructor(e) {
    this.forceOwnership = e, this.kind = "persistentSingleTab";
  }
  toJSON() {
    return {
      kind: this.kind
    };
  }
  _initialize(e) {
    this._onlineComponentProvider = new OnlineComponentProvider, this._offlineComponentProvider = new __PRIVATE_IndexedDbOfflineComponentProvider(this._onlineComponentProvider, e == null ? undefined : e.cacheSizeBytes, this.forceOwnership);
  }
}

class __PRIVATE_MultiTabManagerImpl {
  constructor() {
    this.kind = "PersistentMultipleTab";
  }
  toJSON() {
    return {
      kind: this.kind
    };
  }
  _initialize(e) {
    this._onlineComponentProvider = new OnlineComponentProvider, this._offlineComponentProvider = new __PRIVATE_MultiTabOfflineComponentProvider(this._onlineComponentProvider, e == null ? undefined : e.cacheSizeBytes);
  }
}
var Ce = new WeakMap;
(function __PRIVATE_registerFirestore(e, t = true) {
  (function __PRIVATE_setSDKVersion(e2) {
    b = e2;
  })(SDK_VERSION), _registerComponent(new Component("firestore", (e2, { instanceIdentifier: n, options: r2 }) => {
    const i = e2.getProvider("app").getImmediate(), s = new Firestore(new __PRIVATE_FirebaseAuthCredentialsProvider(e2.getProvider("auth-internal")), new __PRIVATE_FirebaseAppCheckTokenProvider(e2.getProvider("app-check-internal")), function __PRIVATE_databaseIdFromApp(e3, t2) {
      if (!Object.prototype.hasOwnProperty.apply(e3.options, ["projectId"]))
        throw new FirestoreError(C2.INVALID_ARGUMENT, '"projectId" not provided in firebase.initializeApp.');
      return new DatabaseId(e3.options.projectId, t2);
    }(i, n), i);
    return r2 = Object.assign({
      useFetchStreams: t
    }, r2), s._setSettings(r2), s;
  }, "PUBLIC").setMultipleInstances(true)), registerVersion(S2, "4.6.1", e), registerVersion(S2, "4.6.1", "esm2017");
})();
// src/db_interaction.ts
async function getSensorData(dataset, fromCache) {
  const docRef = doc(db, test_name, dataset);
  let docSnap;
  if (fromCache) {
    try {
      docSnap = await getDocFromCache(docRef);
    } catch (e) {
      console.log("cache miss:", e);
      docSnap = await getDoc(docRef);
    }
  } else {
    docSnap = await getDoc(docRef);
  }
  const docData = docSnap.data();
  const time = docData["time"];
  const data = docData["data"];
  const scale = docData["unit"];
  activeDatasets.cached.push(dataset);
  console.log(activeDatasets);
  return [time, data, scale];
}
async function getTestInfo() {
  const docRef = doc(db, test_name, "general");
  let docSnap;
  try {
    docSnap = await getDocFromCache(docRef);
  } catch (e) {
    console.log("cache miss:", e);
    docSnap = await getDoc(docRef);
  }
  const docData = docSnap.data();
  const datasets = docData["datasets"];
  const name3 = docData["name"];
  const test_article = docData["test_article"];
  return [datasets, name3, test_article];
}

// node_modules/uplot/dist/uPlot.esm.js
var setPxRatio = function() {
  let _pxRatio = devicePixelRatio;
  if (pxRatio != _pxRatio) {
    pxRatio = _pxRatio;
    query && off(change, query, setPxRatio);
    query = matchMedia(`(min-resolution: ${pxRatio - 0.001}dppx) and (max-resolution: ${pxRatio + 0.001}dppx)`);
    on(change, query, setPxRatio);
    win.dispatchEvent(new CustomEvent(dppxchange));
  }
};
var addClass = function(el, c) {
  if (c != null) {
    let cl = el.classList;
    !cl.contains(c) && cl.add(c);
  }
};
var remClass = function(el, c) {
  let cl = el.classList;
  cl.contains(c) && cl.remove(c);
};
var setStylePx = function(el, name3, value) {
  el.style[name3] = value + "px";
};
var placeTag = function(tag, cls, targ, refEl) {
  let el = doc2.createElement(tag);
  if (cls != null)
    addClass(el, cls);
  if (targ != null)
    targ.insertBefore(el, refEl);
  return el;
};
var placeDiv = function(cls, targ) {
  return placeTag("div", cls, targ);
};
var elTrans = function(el, xPos, yPos, xMax, yMax) {
  let xform = "translate(" + xPos + "px," + yPos + "px)";
  let xformOld = xformCache.get(el);
  if (xform != xformOld) {
    el.style.transform = xform;
    xformCache.set(el, xform);
    if (xPos < 0 || yPos < 0 || xPos > xMax || yPos > yMax)
      addClass(el, OFF);
    else
      remClass(el, OFF);
  }
};
var elColor = function(el, background, borderColor) {
  let newColor = background + borderColor;
  let oldColor = colorCache.get(el);
  if (newColor != oldColor) {
    colorCache.set(el, newColor);
    el.style.background = background;
    el.style.borderColor = borderColor;
  }
};
var elSize = function(el, newWid, newHgt, centered) {
  let newSize = newWid + "" + newHgt;
  let oldSize = sizeCache.get(el);
  if (newSize != oldSize) {
    sizeCache.set(el, newSize);
    el.style.height = newHgt + "px";
    el.style.width = newWid + "px";
    el.style.marginLeft = centered ? -newWid / 2 + "px" : 0;
    el.style.marginTop = centered ? -newHgt / 2 + "px" : 0;
  }
};
var on = function(ev, el, cb2, capt) {
  el.addEventListener(ev, cb2, capt ? evOpts2 : evOpts);
};
var off = function(ev, el, cb2, capt) {
  el.removeEventListener(ev, cb2, capt ? evOpts2 : evOpts);
};
var closestIdx = function(num, arr, lo, hi) {
  let mid;
  lo = lo || 0;
  hi = hi || arr.length - 1;
  let bitwise = hi <= 2147483647;
  while (hi - lo > 1) {
    mid = bitwise ? lo + hi >> 1 : floor((lo + hi) / 2);
    if (arr[mid] < num)
      lo = mid;
    else
      hi = mid;
  }
  if (num - arr[lo] <= arr[hi] - num)
    return lo;
  return hi;
};
var nonNullIdx = function(data, _i0, _i1, dir) {
  for (let i = dir == 1 ? _i0 : _i1;i >= _i0 && i <= _i1; i += dir) {
    if (data[i] != null)
      return i;
  }
  return -1;
};
var getMinMax = function(data, _i0, _i1, sorted) {
  let _min = inf;
  let _max = -inf;
  if (sorted == 1) {
    _min = data[_i0];
    _max = data[_i1];
  } else if (sorted == -1) {
    _min = data[_i1];
    _max = data[_i0];
  } else {
    for (let i = _i0;i <= _i1; i++) {
      let v3 = data[i];
      if (v3 != null) {
        if (v3 < _min)
          _min = v3;
        if (v3 > _max)
          _max = v3;
      }
    }
  }
  return [_min, _max];
};
var getMinMaxLog = function(data, _i0, _i1) {
  let _min = inf;
  let _max = -inf;
  for (let i = _i0;i <= _i1; i++) {
    let v3 = data[i];
    if (v3 != null && v3 > 0) {
      if (v3 < _min)
        _min = v3;
      if (v3 > _max)
        _max = v3;
    }
  }
  return [_min, _max];
};
var rangeLog = function(min, max, base, fullMags) {
  let minSign = sign(min);
  let maxSign = sign(max);
  if (min == max) {
    if (minSign == -1) {
      min *= base;
      max /= base;
    } else {
      min /= base;
      max *= base;
    }
  }
  let logFn = base == 10 ? log10 : log2;
  let growMinAbs = minSign == 1 ? floor : ceil;
  let growMaxAbs = maxSign == 1 ? ceil : floor;
  let minExp = growMinAbs(logFn(abs(min)));
  let maxExp = growMaxAbs(logFn(abs(max)));
  let minIncr = pow(base, minExp);
  let maxIncr = pow(base, maxExp);
  if (base == 10) {
    if (minExp < 0)
      minIncr = roundDec(minIncr, -minExp);
    if (maxExp < 0)
      maxIncr = roundDec(maxIncr, -maxExp);
  }
  if (fullMags || base == 2) {
    min = minIncr * minSign;
    max = maxIncr * maxSign;
  } else {
    min = incrRoundDn(min, minIncr);
    max = incrRoundUp(max, maxIncr);
  }
  return [min, max];
};
var rangeAsinh = function(min, max, base, fullMags) {
  let minMax = rangeLog(min, max, base, fullMags);
  if (min == 0)
    minMax[0] = 0;
  if (max == 0)
    minMax[1] = 0;
  return minMax;
};
var rangeNum = function(_min, _max, mult, extra) {
  if (isObj(mult))
    return _rangeNum(_min, _max, mult);
  _eqRangePart.pad = mult;
  _eqRangePart.soft = extra ? 0 : null;
  _eqRangePart.mode = extra ? 3 : 0;
  return _rangeNum(_min, _max, _eqRange);
};
var ifNull = function(lh, rh) {
  return lh == null ? rh : lh;
};
var hasData = function(data, idx0, idx1) {
  idx0 = ifNull(idx0, 0);
  idx1 = ifNull(idx1, data.length - 1);
  while (idx0 <= idx1) {
    if (data[idx0] != null)
      return true;
    idx0++;
  }
  return false;
};
var _rangeNum = function(_min, _max, cfg) {
  let cmin = cfg.min;
  let cmax = cfg.max;
  let padMin = ifNull(cmin.pad, 0);
  let padMax = ifNull(cmax.pad, 0);
  let hardMin = ifNull(cmin.hard, -inf);
  let hardMax = ifNull(cmax.hard, inf);
  let softMin = ifNull(cmin.soft, inf);
  let softMax = ifNull(cmax.soft, -inf);
  let softMinMode = ifNull(cmin.mode, 0);
  let softMaxMode = ifNull(cmax.mode, 0);
  let delta = _max - _min;
  let deltaMag = log10(delta);
  let scalarMax = max(abs(_min), abs(_max));
  let scalarMag = log10(scalarMax);
  let scalarMagDelta = abs(scalarMag - deltaMag);
  if (delta < 0.000000001 || scalarMagDelta > 10) {
    delta = 0;
    if (_min == 0 || _max == 0) {
      delta = 0.000000001;
      if (softMinMode == 2 && softMin != inf)
        padMin = 0;
      if (softMaxMode == 2 && softMax != -inf)
        padMax = 0;
    }
  }
  let nonZeroDelta = delta || scalarMax || 1000;
  let mag = log10(nonZeroDelta);
  let base = pow(10, floor(mag));
  let _padMin = nonZeroDelta * (delta == 0 ? _min == 0 ? 0.1 : 1 : padMin);
  let _newMin = roundDec(incrRoundDn(_min - _padMin, base / 10), 9);
  let _softMin = _min >= softMin && (softMinMode == 1 || softMinMode == 3 && _newMin <= softMin || softMinMode == 2 && _newMin >= softMin) ? softMin : inf;
  let minLim = max(hardMin, _newMin < _softMin && _min >= _softMin ? _softMin : min(_softMin, _newMin));
  let _padMax = nonZeroDelta * (delta == 0 ? _max == 0 ? 0.1 : 1 : padMax);
  let _newMax = roundDec(incrRoundUp(_max + _padMax, base / 10), 9);
  let _softMax = _max <= softMax && (softMaxMode == 1 || softMaxMode == 3 && _newMax >= softMax || softMaxMode == 2 && _newMax <= softMax) ? softMax : -inf;
  let maxLim = min(hardMax, _newMax > _softMax && _max <= _softMax ? _softMax : max(_softMax, _newMax));
  if (minLim == maxLim && minLim == 0)
    maxLim = 100;
  return [minLim, maxLim];
};
var numIntDigits = function(x3) {
  return (log10((x3 ^ x3 >> 31) - (x3 >> 31)) | 0) + 1;
};
var clamp = function(num, _min, _max) {
  return min(max(num, _min), _max);
};
var fnOrSelf = function(v3) {
  return typeof v3 == "function" ? v3 : () => v3;
};
var incrRound = function(num, incr) {
  return fixFloat(roundDec(fixFloat(num / incr)) * incr);
};
var incrRoundUp = function(num, incr) {
  return fixFloat(ceil(fixFloat(num / incr)) * incr);
};
var incrRoundDn = function(num, incr) {
  return fixFloat(floor(fixFloat(num / incr)) * incr);
};
var roundDec = function(val, dec = 0) {
  if (isInt(val))
    return val;
  let p2 = 10 ** dec;
  let n = val * p2 * (1 + Number.EPSILON);
  return round(n) / p2;
};
var guessDec = function(num) {
  return (("" + num).split(".")[1] || "").length;
};
var genIncrs = function(base, minExp, maxExp, mults) {
  let incrs = [];
  let multDec = mults.map(guessDec);
  for (let exp = minExp;exp < maxExp; exp++) {
    let expa = abs(exp);
    let mag = roundDec(pow(base, exp), expa);
    for (let i = 0;i < mults.length; i++) {
      let _incr = mults[i] * mag;
      let dec = (_incr >= 0 && exp >= 0 ? 0 : expa) + (exp >= multDec[i] ? 0 : multDec[i]);
      let incr = roundDec(_incr, dec);
      incrs.push(incr);
      fixedDec.set(incr, dec);
    }
  }
  return incrs;
};
var isStr = function(v3) {
  return typeof v3 == "string";
};
var isObj = function(v3) {
  let is = false;
  if (v3 != null) {
    let c = v3.constructor;
    is = c == null || c == Object;
  }
  return is;
};
var fastIsObj = function(v3) {
  return v3 != null && typeof v3 == "object";
};
var copy = function(o, _isObj = isObj) {
  let out;
  if (isArr(o)) {
    let val = o.find((v3) => v3 != null);
    if (isArr(val) || _isObj(val)) {
      out = Array(o.length);
      for (let i = 0;i < o.length; i++)
        out[i] = copy(o[i], _isObj);
    } else
      out = o.slice();
  } else if (o instanceof TypedArray)
    out = o.slice();
  else if (_isObj(o)) {
    out = {};
    for (let k3 in o)
      out[k3] = copy(o[k3], _isObj);
  } else
    out = o;
  return out;
};
var assign = function(targ) {
  let args = arguments;
  for (let i = 1;i < args.length; i++) {
    let src = args[i];
    for (let key in src) {
      if (isObj(targ[key]))
        assign(targ[key], copy(src[key]));
      else
        targ[key] = copy(src[key]);
    }
  }
  return targ;
};
var nullExpand = function(yVals, nullIdxs, alignedLen) {
  for (let i = 0, xi, lastNullIdx = -1;i < nullIdxs.length; i++) {
    let nullIdx = nullIdxs[i];
    if (nullIdx > lastNullIdx) {
      xi = nullIdx - 1;
      while (xi >= 0 && yVals[xi] == null)
        yVals[xi--] = null;
      xi = nullIdx + 1;
      while (xi < alignedLen && yVals[xi] == null)
        yVals[lastNullIdx = xi++] = null;
    }
  }
};
var join = function(tables, nullModes) {
  if (allHeadersSame(tables)) {
    let table = tables[0].slice();
    for (let i = 1;i < tables.length; i++)
      table.push(...tables[i].slice(1));
    if (!isAsc(table[0]))
      table = sortCols(table);
    return table;
  }
  let xVals = new Set;
  for (let ti = 0;ti < tables.length; ti++) {
    let t = tables[ti];
    let xs = t[0];
    let len = xs.length;
    for (let i = 0;i < len; i++)
      xVals.add(xs[i]);
  }
  let data = [Array.from(xVals).sort((a, b2) => a - b2)];
  let alignedLen = data[0].length;
  let xIdxs = new Map;
  for (let i = 0;i < alignedLen; i++)
    xIdxs.set(data[0][i], i);
  for (let ti = 0;ti < tables.length; ti++) {
    let t = tables[ti];
    let xs = t[0];
    for (let si = 1;si < t.length; si++) {
      let ys = t[si];
      let yVals = Array(alignedLen).fill(undefined);
      let nullMode = nullModes ? nullModes[ti][si] : NULL_RETAIN;
      let nullIdxs = [];
      for (let i = 0;i < ys.length; i++) {
        let yVal = ys[i];
        let alignedIdx = xIdxs.get(xs[i]);
        if (yVal === null) {
          if (nullMode != NULL_REMOVE) {
            yVals[alignedIdx] = yVal;
            if (nullMode == NULL_EXPAND)
              nullIdxs.push(alignedIdx);
          }
        } else
          yVals[alignedIdx] = yVal;
      }
      nullExpand(yVals, nullIdxs, alignedLen);
      data.push(yVals);
    }
  }
  return data;
};
var sortCols = function(table) {
  let head = table[0];
  let rlen = head.length;
  let idxs = Array(rlen);
  for (let i = 0;i < idxs.length; i++)
    idxs[i] = i;
  idxs.sort((i0, i1) => head[i0] - head[i1]);
  let table2 = [];
  for (let i = 0;i < table.length; i++) {
    let row = table[i];
    let row2 = Array(rlen);
    for (let j2 = 0;j2 < rlen; j2++)
      row2[j2] = row[idxs[j2]];
    table2.push(row2);
  }
  return table2;
};
var allHeadersSame = function(tables) {
  let vals0 = tables[0][0];
  let len0 = vals0.length;
  for (let i = 1;i < tables.length; i++) {
    let vals1 = tables[i][0];
    if (vals1.length != len0)
      return false;
    if (vals1 != vals0) {
      for (let j2 = 0;j2 < len0; j2++) {
        if (vals1[j2] != vals0[j2])
          return false;
      }
    }
  }
  return true;
};
var isAsc = function(vals, samples = 100) {
  const len = vals.length;
  if (len <= 1)
    return true;
  let firstIdx = 0;
  let lastIdx = len - 1;
  while (firstIdx <= lastIdx && vals[firstIdx] == null)
    firstIdx++;
  while (lastIdx >= firstIdx && vals[lastIdx] == null)
    lastIdx--;
  if (lastIdx <= firstIdx)
    return true;
  const stride = max(1, floor((lastIdx - firstIdx + 1) / samples));
  for (let prevVal = vals[firstIdx], i = firstIdx + stride;i <= lastIdx; i += stride) {
    const v3 = vals[i];
    if (v3 != null) {
      if (v3 <= prevVal)
        return false;
      prevVal = v3;
    }
  }
  return true;
};
var slice3 = function(str) {
  return str.slice(0, 3);
};
var zeroPad2 = function(int) {
  return (int < 10 ? "0" : "") + int;
};
var zeroPad3 = function(int) {
  return (int < 10 ? "00" : int < 100 ? "0" : "") + int;
};
var fmtDate = function(tpl, names) {
  names = names || engNames;
  let parts = [];
  let R2 = /\{([a-z]+)\}|[^{]+/gi, m;
  while (m = R2.exec(tpl))
    parts.push(m[0][0] == "{" ? subs[m[1]] : m[0]);
  return (d) => {
    let out = "";
    for (let i = 0;i < parts.length; i++)
      out += typeof parts[i] == "string" ? parts[i] : parts[i](d, names);
    return out;
  };
};
var tzDate = function(date, tz) {
  let date2;
  if (tz == "UTC" || tz == "Etc/UTC")
    date2 = new Date(+date + date.getTimezoneOffset() * 60000);
  else if (tz == localTz)
    date2 = date;
  else {
    date2 = new Date(date.toLocaleString("en-US", { timeZone: tz }));
    date2.setMilliseconds(date.getMilliseconds());
  }
  return date2;
};
var genTimeStuffs = function(ms) {
  let s = ms * 1000, m = s * 60, h = m * 60, d = h * 24, mo = d * 30, y2 = d * 365;
  let subSecIncrs = ms == 1 ? genIncrs(10, 0, 3, allMults).filter(onlyWhole) : genIncrs(10, -3, 0, allMults);
  let timeIncrs = subSecIncrs.concat([
    s,
    s * 5,
    s * 10,
    s * 15,
    s * 30,
    m,
    m * 5,
    m * 10,
    m * 15,
    m * 30,
    h,
    h * 2,
    h * 3,
    h * 4,
    h * 6,
    h * 8,
    h * 12,
    d,
    d * 2,
    d * 3,
    d * 4,
    d * 5,
    d * 6,
    d * 7,
    d * 8,
    d * 9,
    d * 10,
    d * 15,
    mo,
    mo * 2,
    mo * 3,
    mo * 4,
    mo * 6,
    y2,
    y2 * 2,
    y2 * 5,
    y2 * 10,
    y2 * 25,
    y2 * 50,
    y2 * 100
  ]);
  const _timeAxisStamps = [
    [y2, yyyy, _, _, _, _, _, _, 1],
    [d * 28, "{MMM}", NLyyyy, _, _, _, _, _, 1],
    [d, md2, NLyyyy, _, _, _, _, _, 1],
    [h, "{h}" + aa2, NLmdyy, _, NLmd, _, _, _, 1],
    [m, hmmaa, NLmdyy, _, NLmd, _, _, _, 1],
    [s, ss, NLmdyy + " " + hmmaa, _, NLmd + " " + hmmaa, _, NLhmmaa, _, 1],
    [ms, ss + ".{fff}", NLmdyy + " " + hmmaa, _, NLmd + " " + hmmaa, _, NLhmmaa, _, 1]
  ];
  function timeAxisSplits(tzDate2) {
    return (self2, axisIdx, scaleMin, scaleMax, foundIncr, foundSpace) => {
      let splits = [];
      let isYr = foundIncr >= y2;
      let isMo = foundIncr >= mo && foundIncr < y2;
      let minDate = tzDate2(scaleMin);
      let minDateTs = roundDec(minDate * ms, 3);
      let minMin = mkDate(minDate.getFullYear(), isYr ? 0 : minDate.getMonth(), isMo || isYr ? 1 : minDate.getDate());
      let minMinTs = roundDec(minMin * ms, 3);
      if (isMo || isYr) {
        let moIncr = isMo ? foundIncr / mo : 0;
        let yrIncr = isYr ? foundIncr / y2 : 0;
        let split = minDateTs == minMinTs ? minDateTs : roundDec(mkDate(minMin.getFullYear() + yrIncr, minMin.getMonth() + moIncr, 1) * ms, 3);
        let splitDate = new Date(round(split / ms));
        let baseYear = splitDate.getFullYear();
        let baseMonth = splitDate.getMonth();
        for (let i = 0;split <= scaleMax; i++) {
          let next = mkDate(baseYear + yrIncr * i, baseMonth + moIncr * i, 1);
          let offs = next - tzDate2(roundDec(next * ms, 3));
          split = roundDec((+next + offs) * ms, 3);
          if (split <= scaleMax)
            splits.push(split);
        }
      } else {
        let incr0 = foundIncr >= d ? d : foundIncr;
        let tzOffset = floor(scaleMin) - floor(minDateTs);
        let split = minMinTs + tzOffset + incrRoundUp(minDateTs - minMinTs, incr0);
        splits.push(split);
        let date0 = tzDate2(split);
        let prevHour = date0.getHours() + date0.getMinutes() / m + date0.getSeconds() / h;
        let incrHours = foundIncr / h;
        let minSpace = self2.axes[axisIdx]._space;
        let pctSpace = foundSpace / minSpace;
        while (true) {
          split = roundDec(split + foundIncr, ms == 1 ? 0 : 3);
          if (split > scaleMax)
            break;
          if (incrHours > 1) {
            let expectedHour = floor(roundDec(prevHour + incrHours, 6)) % 24;
            let splitDate = tzDate2(split);
            let actualHour = splitDate.getHours();
            let dstShift = actualHour - expectedHour;
            if (dstShift > 1)
              dstShift = -1;
            split -= dstShift * h;
            prevHour = (prevHour + incrHours) % 24;
            let prevSplit = splits[splits.length - 1];
            let pctIncr = roundDec((split - prevSplit) / foundIncr, 3);
            if (pctIncr * pctSpace >= 0.7)
              splits.push(split);
          } else
            splits.push(split);
        }
      }
      return splits;
    };
  }
  return [
    timeIncrs,
    _timeAxisStamps,
    timeAxisSplits
  ];
};
var timeAxisStamps = function(stampCfg, fmtDate2) {
  return stampCfg.map((s) => s.map((v3, i) => i == 0 || i == 8 || v3 == null ? v3 : fmtDate2(i == 1 || s[8] == 0 ? v3 : s[1] + v3)));
};
var timeAxisVals = function(tzDate2, stamps) {
  return (self2, splits, axisIdx, foundSpace, foundIncr) => {
    let s = stamps.find((s2) => foundIncr >= s2[0]) || stamps[stamps.length - 1];
    let prevYear;
    let prevMnth;
    let prevDate;
    let prevHour;
    let prevMins;
    let prevSecs;
    return splits.map((split) => {
      let date = tzDate2(split);
      let newYear = date.getFullYear();
      let newMnth = date.getMonth();
      let newDate = date.getDate();
      let newHour = date.getHours();
      let newMins = date.getMinutes();
      let newSecs = date.getSeconds();
      let stamp = newYear != prevYear && s[2] || newMnth != prevMnth && s[3] || newDate != prevDate && s[4] || newHour != prevHour && s[5] || newMins != prevMins && s[6] || newSecs != prevSecs && s[7] || s[1];
      prevYear = newYear;
      prevMnth = newMnth;
      prevDate = newDate;
      prevHour = newHour;
      prevMins = newMins;
      prevSecs = newSecs;
      return stamp(date);
    });
  };
};
var timeAxisVal = function(tzDate2, dateTpl) {
  let stamp = fmtDate(dateTpl);
  return (self2, splits, axisIdx, foundSpace, foundIncr) => splits.map((split) => stamp(tzDate2(split)));
};
var mkDate = function(y2, m, d) {
  return new Date(y2, m, d);
};
var timeSeriesStamp = function(stampCfg, fmtDate2) {
  return fmtDate2(stampCfg);
};
var timeSeriesVal = function(tzDate2, stamp) {
  return (self2, val, seriesIdx, dataIdx) => dataIdx == null ? LEGEND_DISP : stamp(tzDate2(val));
};
var legendStroke = function(self2, seriesIdx) {
  let s = self2.series[seriesIdx];
  return s.width ? s.stroke(self2, seriesIdx) : s.points.width ? s.points.stroke(self2, seriesIdx) : null;
};
var legendFill = function(self2, seriesIdx) {
  return self2.series[seriesIdx].fill(self2, seriesIdx);
};
var cursorPointShow = function(self2, si) {
  let o = self2.cursor.points;
  let pt = placeDiv();
  let size = o.size(self2, si);
  setStylePx(pt, WIDTH, size);
  setStylePx(pt, HEIGHT, size);
  let mar = size / -2;
  setStylePx(pt, "marginLeft", mar);
  setStylePx(pt, "marginTop", mar);
  let width = o.width(self2, si, size);
  width && setStylePx(pt, "borderWidth", width);
  return pt;
};
var cursorPointFill = function(self2, si) {
  let sp = self2.series[si].points;
  return sp._fill || sp._stroke;
};
var cursorPointStroke = function(self2, si) {
  let sp = self2.series[si].points;
  return sp._stroke || sp._fill;
};
var cursorPointSize = function(self2, si) {
  let sp = self2.series[si].points;
  return sp.size;
};
var cursorMove = function(self2, mouseLeft1, mouseTop1) {
  moveTuple[0] = mouseLeft1;
  moveTuple[1] = mouseTop1;
  return moveTuple;
};
var filtBtn0 = function(self2, targ, handle, onlyTarg = true) {
  return (e) => {
    e.button == 0 && (!onlyTarg || e.target == targ) && handle(e);
  };
};
var filtTarg = function(self2, targ, handle, onlyTarg = true) {
  return (e) => {
    (!onlyTarg || e.target == targ) && handle(e);
  };
};
var numAxisVals = function(self2, splits, axisIdx, foundSpace, foundIncr) {
  return splits.map((v3) => v3 == null ? "" : fmtNum(v3));
};
var numAxisSplits = function(self2, axisIdx, scaleMin, scaleMax, foundIncr, foundSpace, forceMin) {
  let splits = [];
  let numDec = fixedDec.get(foundIncr) || 0;
  scaleMin = forceMin ? scaleMin : roundDec(incrRoundUp(scaleMin, foundIncr), numDec);
  for (let val = scaleMin;val <= scaleMax; val = roundDec(val + foundIncr, numDec))
    splits.push(Object.is(val, -0) ? 0 : val);
  return splits;
};
var logAxisSplits = function(self2, axisIdx, scaleMin, scaleMax, foundIncr, foundSpace, forceMin) {
  const splits = [];
  const logBase = self2.scales[self2.axes[axisIdx].scale].log;
  const logFn = logBase == 10 ? log10 : log2;
  const exp = floor(logFn(scaleMin));
  foundIncr = pow(logBase, exp);
  if (logBase == 10 && exp < 0)
    foundIncr = roundDec(foundIncr, -exp);
  let split = scaleMin;
  do {
    splits.push(split);
    split = split + foundIncr;
    if (logBase == 10)
      split = roundDec(split, fixedDec.get(foundIncr));
    if (split >= foundIncr * logBase)
      foundIncr = split;
  } while (split <= scaleMax);
  return splits;
};
var asinhAxisSplits = function(self2, axisIdx, scaleMin, scaleMax, foundIncr, foundSpace, forceMin) {
  let sc2 = self2.scales[self2.axes[axisIdx].scale];
  let linthresh = sc2.asinh;
  let posSplits = scaleMax > linthresh ? logAxisSplits(self2, axisIdx, max(linthresh, scaleMin), scaleMax, foundIncr) : [linthresh];
  let zero = scaleMax >= 0 && scaleMin <= 0 ? [0] : [];
  let negSplits = scaleMin < -linthresh ? logAxisSplits(self2, axisIdx, max(linthresh, -scaleMax), -scaleMin, foundIncr) : [linthresh];
  return negSplits.reverse().map((v3) => -v3).concat(zero, posSplits);
};
var log10AxisValsFilt = function(self2, splits, axisIdx, foundSpace, foundIncr) {
  let axis = self2.axes[axisIdx];
  let scaleKey = axis.scale;
  let sc2 = self2.scales[scaleKey];
  let valToPos = self2.valToPos;
  let minSpace = axis._space;
  let _10 = valToPos(10, scaleKey);
  let re2 = valToPos(9, scaleKey) - _10 >= minSpace ? RE_ALL : valToPos(7, scaleKey) - _10 >= minSpace ? RE_12357 : valToPos(5, scaleKey) - _10 >= minSpace ? RE_125 : RE_1;
  if (re2 == RE_1) {
    let magSpace = abs(valToPos(1, scaleKey) - _10);
    if (magSpace < minSpace)
      return _filt(splits.slice().reverse(), sc2.distr, re2, ceil(minSpace / magSpace)).reverse();
  }
  return _filt(splits, sc2.distr, re2, 1);
};
var log2AxisValsFilt = function(self2, splits, axisIdx, foundSpace, foundIncr) {
  let axis = self2.axes[axisIdx];
  let scaleKey = axis.scale;
  let minSpace = axis._space;
  let valToPos = self2.valToPos;
  let magSpace = abs(valToPos(1, scaleKey) - valToPos(2, scaleKey));
  if (magSpace < minSpace)
    return _filt(splits.slice().reverse(), 3, RE_ALL, ceil(minSpace / magSpace)).reverse();
  return splits;
};
var numSeriesVal = function(self2, val, seriesIdx, dataIdx) {
  return dataIdx == null ? LEGEND_DISP : val == null ? "" : fmtNum(val);
};
var ptDia = function(width, mult) {
  let dia = 3 + (width || 1) * 2;
  return roundDec(dia * mult, 3);
};
var seriesPointsShow = function(self2, si) {
  let { scale, idxs } = self2.series[0];
  let xData = self2._data[0];
  let p0 = self2.valToPos(xData[idxs[0]], scale, true);
  let p1 = self2.valToPos(xData[idxs[1]], scale, true);
  let dim = abs(p1 - p0);
  let s = self2.series[si];
  let maxPts = dim / (s.points.space * pxRatio);
  return idxs[1] - idxs[0] <= maxPts;
};
var clampScale = function(self2, val, scaleMin, scaleMax, scaleKey) {
  return scaleMin / 10;
};
var _sync = function(key, opts) {
  let s = syncs[key];
  if (!s) {
    s = {
      key,
      plots: [],
      sub(plot) {
        s.plots.push(plot);
      },
      unsub(plot) {
        s.plots = s.plots.filter((c) => c != plot);
      },
      pub(type, self2, x3, y2, w2, h, i) {
        for (let j2 = 0;j2 < s.plots.length; j2++)
          s.plots[j2] != self2 && s.plots[j2].pub(type, self2, x3, y2, w2, h, i);
      }
    };
    if (key != null)
      syncs[key] = s;
  }
  return s;
};
var orient = function(u, seriesIdx, cb2) {
  const mode = u.mode;
  const series = u.series[seriesIdx];
  const data = mode == 2 ? u._data[seriesIdx] : u._data;
  const scales = u.scales;
  const bbox = u.bbox;
  let dx = data[0], dy = mode == 2 ? data[1] : data[seriesIdx], sx = mode == 2 ? scales[series.facets[0].scale] : scales[u.series[0].scale], sy = mode == 2 ? scales[series.facets[1].scale] : scales[series.scale], l2 = bbox.left, t = bbox.top, w2 = bbox.width, h = bbox.height, H3 = u.valToPosH, V2 = u.valToPosV;
  return sx.ori == 0 ? cb2(series, dx, dy, sx, sy, H3, V2, l2, t, w2, h, moveToH, lineToH, rectH, arcH, bezierCurveToH) : cb2(series, dx, dy, sx, sy, V2, H3, t, l2, h, w2, moveToV, lineToV, rectV, arcV, bezierCurveToV);
};
var bandFillClipDirs = function(self2, seriesIdx) {
  let fillDir = 0;
  let clipDirs = 0;
  let bands = ifNull(self2.bands, EMPTY_ARR);
  for (let i = 0;i < bands.length; i++) {
    let b2 = bands[i];
    if (b2.series[0] == seriesIdx)
      fillDir = b2.dir;
    else if (b2.series[1] == seriesIdx) {
      if (b2.dir == 1)
        clipDirs |= 1;
      else
        clipDirs |= 2;
    }
  }
  return [
    fillDir,
    clipDirs == 1 ? -1 : clipDirs == 2 ? 1 : clipDirs == 3 ? 2 : 0
  ];
};
var seriesFillTo = function(self2, seriesIdx, dataMin, dataMax, bandFillDir) {
  let mode = self2.mode;
  let series = self2.series[seriesIdx];
  let scaleKey = mode == 2 ? series.facets[1].scale : series.scale;
  let scale = self2.scales[scaleKey];
  return bandFillDir == -1 ? scale.min : bandFillDir == 1 ? scale.max : scale.distr == 3 ? scale.dir == 1 ? scale.min : scale.max : 0;
};
var clipBandLine = function(self2, seriesIdx, idx0, idx1, strokePath, clipDir) {
  return orient(self2, seriesIdx, (series, dataX, dataY, scaleX, scaleY, valToPosX, valToPosY, xOff, yOff, xDim, yDim) => {
    let pxRound = series.pxRound;
    const dir = scaleX.dir * (scaleX.ori == 0 ? 1 : -1);
    const lineTo = scaleX.ori == 0 ? lineToH : lineToV;
    let frIdx, toIdx;
    if (dir == 1) {
      frIdx = idx0;
      toIdx = idx1;
    } else {
      frIdx = idx1;
      toIdx = idx0;
    }
    let x0 = pxRound(valToPosX(dataX[frIdx], scaleX, xDim, xOff));
    let y0 = pxRound(valToPosY(dataY[frIdx], scaleY, yDim, yOff));
    let x1 = pxRound(valToPosX(dataX[toIdx], scaleX, xDim, xOff));
    let yLimit = pxRound(valToPosY(clipDir == 1 ? scaleY.max : scaleY.min, scaleY, yDim, yOff));
    let clip = new Path2D(strokePath);
    lineTo(clip, x1, yLimit);
    lineTo(clip, x0, yLimit);
    lineTo(clip, x0, y0);
    return clip;
  });
};
var clipGaps = function(gaps, ori, plotLft, plotTop, plotWid, plotHgt) {
  let clip = null;
  if (gaps.length > 0) {
    clip = new Path2D;
    const rect = ori == 0 ? rectH : rectV;
    let prevGapEnd = plotLft;
    for (let i = 0;i < gaps.length; i++) {
      let g = gaps[i];
      if (g[1] > g[0]) {
        let w3 = g[0] - prevGapEnd;
        w3 > 0 && rect(clip, prevGapEnd, plotTop, w3, plotTop + plotHgt);
        prevGapEnd = g[1];
      }
    }
    let w2 = plotLft + plotWid - prevGapEnd;
    let maxStrokeWidth = 10;
    w2 > 0 && rect(clip, prevGapEnd, plotTop - maxStrokeWidth / 2, w2, plotTop + plotHgt + maxStrokeWidth);
  }
  return clip;
};
var addGap = function(gaps, fromX, toX) {
  let prevGap = gaps[gaps.length - 1];
  if (prevGap && prevGap[0] == fromX)
    prevGap[1] = toX;
  else
    gaps.push([fromX, toX]);
};
var findGaps = function(xs, ys, idx0, idx1, dir, pixelForX, align) {
  let gaps = [];
  let len = xs.length;
  for (let i = dir == 1 ? idx0 : idx1;i >= idx0 && i <= idx1; i += dir) {
    let yVal = ys[i];
    if (yVal === null) {
      let fr = i, to = i;
      if (dir == 1) {
        while (++i <= idx1 && ys[i] === null)
          to = i;
      } else {
        while (--i >= idx0 && ys[i] === null)
          to = i;
      }
      let frPx = pixelForX(xs[fr]);
      let toPx = to == fr ? frPx : pixelForX(xs[to]);
      let fri2 = fr - dir;
      let frPx2 = align <= 0 && fri2 >= 0 && fri2 < len ? pixelForX(xs[fri2]) : frPx;
      frPx = frPx2;
      let toi2 = to + dir;
      let toPx2 = align >= 0 && toi2 >= 0 && toi2 < len ? pixelForX(xs[toi2]) : toPx;
      toPx = toPx2;
      if (toPx >= frPx)
        gaps.push([frPx, toPx]);
    }
  }
  return gaps;
};
var pxRoundGen = function(pxAlign) {
  return pxAlign == 0 ? retArg0 : pxAlign == 1 ? round : (v3) => incrRound(v3, pxAlign);
};
var rect = function(ori) {
  let moveTo = ori == 0 ? moveToH : moveToV;
  let arcTo = ori == 0 ? (p2, x1, y1, x22, y2, r2) => {
    p2.arcTo(x1, y1, x22, y2, r2);
  } : (p2, y1, x1, y2, x22, r2) => {
    p2.arcTo(x1, y1, x22, y2, r2);
  };
  let rect2 = ori == 0 ? (p2, x3, y2, w2, h) => {
    p2.rect(x3, y2, w2, h);
  } : (p2, y2, x3, h, w2) => {
    p2.rect(x3, y2, w2, h);
  };
  return (p2, x3, y2, w2, h, endRad = 0, baseRad = 0) => {
    if (endRad == 0 && baseRad == 0)
      rect2(p2, x3, y2, w2, h);
    else {
      endRad = min(endRad, w2 / 2, h / 2);
      baseRad = min(baseRad, w2 / 2, h / 2);
      moveTo(p2, x3 + endRad, y2);
      arcTo(p2, x3 + w2, y2, x3 + w2, y2 + h, endRad);
      arcTo(p2, x3 + w2, y2 + h, x3, y2 + h, baseRad);
      arcTo(p2, x3, y2 + h, x3, y2, baseRad);
      arcTo(p2, x3, y2, x3 + w2, y2, endRad);
      p2.closePath();
    }
  };
};
var points = function(opts) {
  return (u, seriesIdx, idx0, idx1, filtIdxs) => {
    return orient(u, seriesIdx, (series, dataX, dataY, scaleX, scaleY, valToPosX, valToPosY, xOff, yOff, xDim, yDim) => {
      let { pxRound, points: points2 } = series;
      let moveTo, arc;
      if (scaleX.ori == 0) {
        moveTo = moveToH;
        arc = arcH;
      } else {
        moveTo = moveToV;
        arc = arcV;
      }
      const width = roundDec(points2.width * pxRatio, 3);
      let rad = (points2.size - points2.width) / 2 * pxRatio;
      let dia = roundDec(rad * 2, 3);
      let fill = new Path2D;
      let clip = new Path2D;
      let { left: lft, top, width: wid, height: hgt } = u.bbox;
      rectH(clip, lft - dia, top - dia, wid + dia * 2, hgt + dia * 2);
      const drawPoint = (pi) => {
        if (dataY[pi] != null) {
          let x3 = pxRound(valToPosX(dataX[pi], scaleX, xDim, xOff));
          let y2 = pxRound(valToPosY(dataY[pi], scaleY, yDim, yOff));
          moveTo(fill, x3 + rad, y2);
          arc(fill, x3, y2, rad, 0, PI * 2);
        }
      };
      if (filtIdxs)
        filtIdxs.forEach(drawPoint);
      else {
        for (let pi = idx0;pi <= idx1; pi++)
          drawPoint(pi);
      }
      return {
        stroke: width > 0 ? fill : null,
        fill,
        clip,
        flags: BAND_CLIP_FILL | BAND_CLIP_STROKE
      };
    });
  };
};
var _drawAcc = function(lineTo) {
  return (stroke, accX, minY, maxY, inY, outY) => {
    if (minY != maxY) {
      if (inY != minY && outY != minY)
        lineTo(stroke, accX, minY);
      if (inY != maxY && outY != maxY)
        lineTo(stroke, accX, maxY);
      lineTo(stroke, accX, outY);
    }
  };
};
var linear = function(opts) {
  const alignGaps = ifNull(opts?.alignGaps, 0);
  return (u, seriesIdx, idx0, idx1) => {
    return orient(u, seriesIdx, (series, dataX, dataY, scaleX, scaleY, valToPosX, valToPosY, xOff, yOff, xDim, yDim) => {
      let pxRound = series.pxRound;
      let pixelForX = (val) => pxRound(valToPosX(val, scaleX, xDim, xOff));
      let pixelForY = (val) => pxRound(valToPosY(val, scaleY, yDim, yOff));
      let lineTo, drawAcc;
      if (scaleX.ori == 0) {
        lineTo = lineToH;
        drawAcc = drawAccH;
      } else {
        lineTo = lineToV;
        drawAcc = drawAccV;
      }
      const dir = scaleX.dir * (scaleX.ori == 0 ? 1 : -1);
      const _paths = { stroke: new Path2D, fill: null, clip: null, band: null, gaps: null, flags: BAND_CLIP_FILL };
      const stroke = _paths.stroke;
      let minY = inf, maxY = -inf, inY, outY, drawnAtX;
      let accX = pixelForX(dataX[dir == 1 ? idx0 : idx1]);
      let lftIdx = nonNullIdx(dataY, idx0, idx1, 1 * dir);
      let rgtIdx = nonNullIdx(dataY, idx0, idx1, -1 * dir);
      let lftX = pixelForX(dataX[lftIdx]);
      let rgtX = pixelForX(dataX[rgtIdx]);
      let hasGap = false;
      for (let i = dir == 1 ? idx0 : idx1;i >= idx0 && i <= idx1; i += dir) {
        let x3 = pixelForX(dataX[i]);
        let yVal = dataY[i];
        if (x3 == accX) {
          if (yVal != null) {
            outY = pixelForY(yVal);
            if (minY == inf) {
              lineTo(stroke, x3, outY);
              inY = outY;
            }
            minY = min(outY, minY);
            maxY = max(outY, maxY);
          } else {
            if (yVal === null)
              hasGap = true;
          }
        } else {
          if (minY != inf) {
            drawAcc(stroke, accX, minY, maxY, inY, outY);
            drawnAtX = accX;
          }
          if (yVal != null) {
            outY = pixelForY(yVal);
            lineTo(stroke, x3, outY);
            minY = maxY = inY = outY;
          } else {
            minY = inf;
            maxY = -inf;
            if (yVal === null)
              hasGap = true;
          }
          accX = x3;
        }
      }
      if (minY != inf && minY != maxY && drawnAtX != accX)
        drawAcc(stroke, accX, minY, maxY, inY, outY);
      let [bandFillDir, bandClipDir] = bandFillClipDirs(u, seriesIdx);
      if (series.fill != null || bandFillDir != 0) {
        let fill = _paths.fill = new Path2D(stroke);
        let fillToVal = series.fillTo(u, seriesIdx, series.min, series.max, bandFillDir);
        let fillToY = pixelForY(fillToVal);
        lineTo(fill, rgtX, fillToY);
        lineTo(fill, lftX, fillToY);
      }
      if (!series.spanGaps) {
        let gaps = [];
        hasGap && gaps.push(...findGaps(dataX, dataY, idx0, idx1, dir, pixelForX, alignGaps));
        _paths.gaps = gaps = series.gaps(u, seriesIdx, idx0, idx1, gaps);
        _paths.clip = clipGaps(gaps, scaleX.ori, xOff, yOff, xDim, yDim);
      }
      if (bandClipDir != 0) {
        _paths.band = bandClipDir == 2 ? [
          clipBandLine(u, seriesIdx, idx0, idx1, stroke, -1),
          clipBandLine(u, seriesIdx, idx0, idx1, stroke, 1)
        ] : clipBandLine(u, seriesIdx, idx0, idx1, stroke, bandClipDir);
      }
      return _paths;
    });
  };
};
var stepped = function(opts) {
  const align = ifNull(opts.align, 1);
  const ascDesc = ifNull(opts.ascDesc, false);
  const alignGaps = ifNull(opts.alignGaps, 0);
  const extend = ifNull(opts.extend, false);
  return (u, seriesIdx, idx0, idx1) => {
    return orient(u, seriesIdx, (series, dataX, dataY, scaleX, scaleY, valToPosX, valToPosY, xOff, yOff, xDim, yDim) => {
      let pxRound = series.pxRound;
      let { left, width } = u.bbox;
      let pixelForX = (val) => pxRound(valToPosX(val, scaleX, xDim, xOff));
      let pixelForY = (val) => pxRound(valToPosY(val, scaleY, yDim, yOff));
      let lineTo = scaleX.ori == 0 ? lineToH : lineToV;
      const _paths = { stroke: new Path2D, fill: null, clip: null, band: null, gaps: null, flags: BAND_CLIP_FILL };
      const stroke = _paths.stroke;
      const dir = scaleX.dir * (scaleX.ori == 0 ? 1 : -1);
      idx0 = nonNullIdx(dataY, idx0, idx1, 1);
      idx1 = nonNullIdx(dataY, idx0, idx1, -1);
      let prevYPos = pixelForY(dataY[dir == 1 ? idx0 : idx1]);
      let firstXPos = pixelForX(dataX[dir == 1 ? idx0 : idx1]);
      let prevXPos = firstXPos;
      let firstXPosExt = firstXPos;
      if (extend && align == -1) {
        firstXPosExt = left;
        lineTo(stroke, firstXPosExt, prevYPos);
      }
      lineTo(stroke, firstXPos, prevYPos);
      for (let i = dir == 1 ? idx0 : idx1;i >= idx0 && i <= idx1; i += dir) {
        let yVal1 = dataY[i];
        if (yVal1 == null)
          continue;
        let x1 = pixelForX(dataX[i]);
        let y1 = pixelForY(yVal1);
        if (align == 1)
          lineTo(stroke, x1, prevYPos);
        else
          lineTo(stroke, prevXPos, y1);
        lineTo(stroke, x1, y1);
        prevYPos = y1;
        prevXPos = x1;
      }
      let prevXPosExt = prevXPos;
      if (extend && align == 1) {
        prevXPosExt = left + width;
        lineTo(stroke, prevXPosExt, prevYPos);
      }
      let [bandFillDir, bandClipDir] = bandFillClipDirs(u, seriesIdx);
      if (series.fill != null || bandFillDir != 0) {
        let fill = _paths.fill = new Path2D(stroke);
        let fillTo = series.fillTo(u, seriesIdx, series.min, series.max, bandFillDir);
        let fillToY = pixelForY(fillTo);
        lineTo(fill, prevXPosExt, fillToY);
        lineTo(fill, firstXPosExt, fillToY);
      }
      if (!series.spanGaps) {
        let gaps = [];
        gaps.push(...findGaps(dataX, dataY, idx0, idx1, dir, pixelForX, alignGaps));
        let halfStroke = series.width * pxRatio / 2;
        let startsOffset = ascDesc || align == 1 ? halfStroke : -halfStroke;
        let endsOffset = ascDesc || align == -1 ? -halfStroke : halfStroke;
        gaps.forEach((g) => {
          g[0] += startsOffset;
          g[1] += endsOffset;
        });
        _paths.gaps = gaps = series.gaps(u, seriesIdx, idx0, idx1, gaps);
        _paths.clip = clipGaps(gaps, scaleX.ori, xOff, yOff, xDim, yDim);
      }
      if (bandClipDir != 0) {
        _paths.band = bandClipDir == 2 ? [
          clipBandLine(u, seriesIdx, idx0, idx1, stroke, -1),
          clipBandLine(u, seriesIdx, idx0, idx1, stroke, 1)
        ] : clipBandLine(u, seriesIdx, idx0, idx1, stroke, bandClipDir);
      }
      return _paths;
    });
  };
};
var findColWidth = function(dataX, dataY, valToPosX, scaleX, xDim, xOff, colWid = inf) {
  if (dataX.length > 1) {
    let prevIdx = null;
    for (let i = 0, minDelta = Infinity;i < dataX.length; i++) {
      if (dataY[i] !== undefined) {
        if (prevIdx != null) {
          let delta = abs(dataX[i] - dataX[prevIdx]);
          if (delta < minDelta) {
            minDelta = delta;
            colWid = abs(valToPosX(dataX[i], scaleX, xDim, xOff) - valToPosX(dataX[prevIdx], scaleX, xDim, xOff));
          }
        }
        prevIdx = i;
      }
    }
  }
  return colWid;
};
var bars = function(opts) {
  opts = opts || EMPTY_OBJ;
  const size = ifNull(opts.size, [0.6, inf, 1]);
  const align = opts.align || 0;
  const _extraGap = opts.gap || 0;
  let ro = opts.radius;
  ro = ro == null ? [0, 0] : typeof ro == "number" ? [ro, 0] : ro;
  const radiusFn = fnOrSelf(ro);
  const gapFactor = 1 - size[0];
  const _maxWidth = ifNull(size[1], inf);
  const _minWidth = ifNull(size[2], 1);
  const disp = ifNull(opts.disp, EMPTY_OBJ);
  const _each = ifNull(opts.each, (_) => {
  });
  const { fill: dispFills, stroke: dispStrokes } = disp;
  return (u, seriesIdx, idx0, idx1) => {
    return orient(u, seriesIdx, (series, dataX, dataY, scaleX, scaleY, valToPosX, valToPosY, xOff, yOff, xDim, yDim) => {
      let pxRound = series.pxRound;
      let _align = align;
      let extraGap = _extraGap * pxRatio;
      let maxWidth = _maxWidth * pxRatio;
      let minWidth = _minWidth * pxRatio;
      let valRadius, baseRadius;
      if (scaleX.ori == 0)
        [valRadius, baseRadius] = radiusFn(u, seriesIdx);
      else
        [baseRadius, valRadius] = radiusFn(u, seriesIdx);
      const _dirX = scaleX.dir * (scaleX.ori == 0 ? 1 : -1);
      let rect2 = scaleX.ori == 0 ? rectH : rectV;
      let each = scaleX.ori == 0 ? _each : (u2, seriesIdx2, i, top, lft, hgt, wid) => {
        _each(u2, seriesIdx2, i, lft, top, wid, hgt);
      };
      let band = ifNull(u.bands, EMPTY_ARR).find((b2) => b2.series[0] == seriesIdx);
      let fillDir = band != null ? band.dir : 0;
      let fillTo = series.fillTo(u, seriesIdx, series.min, series.max, fillDir);
      let fillToY = pxRound(valToPosY(fillTo, scaleY, yDim, yOff));
      let xShift, barWid, fullGap, colWid = xDim;
      let strokeWidth = pxRound(series.width * pxRatio);
      let multiPath = false;
      let fillColors = null;
      let fillPaths = null;
      let strokeColors = null;
      let strokePaths = null;
      if (dispFills != null && (strokeWidth == 0 || dispStrokes != null)) {
        multiPath = true;
        fillColors = dispFills.values(u, seriesIdx, idx0, idx1);
        fillPaths = new Map;
        new Set(fillColors).forEach((color) => {
          if (color != null)
            fillPaths.set(color, new Path2D);
        });
        if (strokeWidth > 0) {
          strokeColors = dispStrokes.values(u, seriesIdx, idx0, idx1);
          strokePaths = new Map;
          new Set(strokeColors).forEach((color) => {
            if (color != null)
              strokePaths.set(color, new Path2D);
          });
        }
      }
      let { x0, size: size2 } = disp;
      if (x0 != null && size2 != null) {
        _align = 1;
        dataX = x0.values(u, seriesIdx, idx0, idx1);
        if (x0.unit == 2)
          dataX = dataX.map((pct) => u.posToVal(xOff + pct * xDim, scaleX.key, true));
        let sizes = size2.values(u, seriesIdx, idx0, idx1);
        if (size2.unit == 2)
          barWid = sizes[0] * xDim;
        else
          barWid = valToPosX(sizes[0], scaleX, xDim, xOff) - valToPosX(0, scaleX, xDim, xOff);
        colWid = findColWidth(dataX, dataY, valToPosX, scaleX, xDim, xOff, colWid);
        let gapWid = colWid - barWid;
        fullGap = gapWid + extraGap;
      } else {
        colWid = findColWidth(dataX, dataY, valToPosX, scaleX, xDim, xOff, colWid);
        let gapWid = colWid * gapFactor;
        fullGap = gapWid + extraGap;
        barWid = colWid - fullGap;
      }
      if (fullGap < 1)
        fullGap = 0;
      if (strokeWidth >= barWid / 2)
        strokeWidth = 0;
      if (fullGap < 5)
        pxRound = retArg0;
      let insetStroke = fullGap > 0;
      let rawBarWid = colWid - fullGap - (insetStroke ? strokeWidth : 0);
      barWid = pxRound(clamp(rawBarWid, minWidth, maxWidth));
      xShift = (_align == 0 ? barWid / 2 : _align == _dirX ? 0 : barWid) - _align * _dirX * ((_align == 0 ? extraGap / 2 : 0) + (insetStroke ? strokeWidth / 2 : 0));
      const _paths = { stroke: null, fill: null, clip: null, band: null, gaps: null, flags: 0 };
      const stroke = multiPath ? null : new Path2D;
      let dataY0 = null;
      if (band != null)
        dataY0 = u.data[band.series[1]];
      else {
        let { y0, y1 } = disp;
        if (y0 != null && y1 != null) {
          dataY = y1.values(u, seriesIdx, idx0, idx1);
          dataY0 = y0.values(u, seriesIdx, idx0, idx1);
        }
      }
      let radVal = valRadius * barWid;
      let radBase = baseRadius * barWid;
      for (let i = _dirX == 1 ? idx0 : idx1;i >= idx0 && i <= idx1; i += _dirX) {
        let yVal = dataY[i];
        if (yVal == null)
          continue;
        if (dataY0 != null) {
          let yVal0 = dataY0[i] ?? 0;
          if (yVal - yVal0 == 0)
            continue;
          fillToY = valToPosY(yVal0, scaleY, yDim, yOff);
        }
        let xVal = scaleX.distr != 2 || disp != null ? dataX[i] : i;
        let xPos = valToPosX(xVal, scaleX, xDim, xOff);
        let yPos = valToPosY(ifNull(yVal, fillTo), scaleY, yDim, yOff);
        let lft = pxRound(xPos - xShift);
        let btm = pxRound(max(yPos, fillToY));
        let top = pxRound(min(yPos, fillToY));
        let barHgt = btm - top;
        if (yVal != null) {
          let rv = yVal < 0 ? radBase : radVal;
          let rb2 = yVal < 0 ? radVal : radBase;
          if (multiPath) {
            if (strokeWidth > 0 && strokeColors[i] != null)
              rect2(strokePaths.get(strokeColors[i]), lft, top + floor(strokeWidth / 2), barWid, max(0, barHgt - strokeWidth), rv, rb2);
            if (fillColors[i] != null)
              rect2(fillPaths.get(fillColors[i]), lft, top + floor(strokeWidth / 2), barWid, max(0, barHgt - strokeWidth), rv, rb2);
          } else
            rect2(stroke, lft, top + floor(strokeWidth / 2), barWid, max(0, barHgt - strokeWidth), rv, rb2);
          each(u, seriesIdx, i, lft - strokeWidth / 2, top, barWid + strokeWidth, barHgt);
        }
      }
      if (strokeWidth > 0)
        _paths.stroke = multiPath ? strokePaths : stroke;
      else if (!multiPath) {
        _paths._fill = series.width == 0 ? series._fill : series._stroke ?? series._fill;
        _paths.width = 0;
      }
      _paths.fill = multiPath ? fillPaths : stroke;
      return _paths;
    });
  };
};
var splineInterp = function(interp, opts) {
  const alignGaps = ifNull(opts?.alignGaps, 0);
  return (u, seriesIdx, idx0, idx1) => {
    return orient(u, seriesIdx, (series, dataX, dataY, scaleX, scaleY, valToPosX, valToPosY, xOff, yOff, xDim, yDim) => {
      let pxRound = series.pxRound;
      let pixelForX = (val) => pxRound(valToPosX(val, scaleX, xDim, xOff));
      let pixelForY = (val) => pxRound(valToPosY(val, scaleY, yDim, yOff));
      let moveTo, bezierCurveTo, lineTo;
      if (scaleX.ori == 0) {
        moveTo = moveToH;
        lineTo = lineToH;
        bezierCurveTo = bezierCurveToH;
      } else {
        moveTo = moveToV;
        lineTo = lineToV;
        bezierCurveTo = bezierCurveToV;
      }
      const dir = scaleX.dir * (scaleX.ori == 0 ? 1 : -1);
      idx0 = nonNullIdx(dataY, idx0, idx1, 1);
      idx1 = nonNullIdx(dataY, idx0, idx1, -1);
      let firstXPos = pixelForX(dataX[dir == 1 ? idx0 : idx1]);
      let prevXPos = firstXPos;
      let xCoords = [];
      let yCoords = [];
      for (let i = dir == 1 ? idx0 : idx1;i >= idx0 && i <= idx1; i += dir) {
        let yVal = dataY[i];
        if (yVal != null) {
          let xVal = dataX[i];
          let xPos = pixelForX(xVal);
          xCoords.push(prevXPos = xPos);
          yCoords.push(pixelForY(dataY[i]));
        }
      }
      const _paths = { stroke: interp(xCoords, yCoords, moveTo, lineTo, bezierCurveTo, pxRound), fill: null, clip: null, band: null, gaps: null, flags: BAND_CLIP_FILL };
      const stroke = _paths.stroke;
      let [bandFillDir, bandClipDir] = bandFillClipDirs(u, seriesIdx);
      if (series.fill != null || bandFillDir != 0) {
        let fill = _paths.fill = new Path2D(stroke);
        let fillTo = series.fillTo(u, seriesIdx, series.min, series.max, bandFillDir);
        let fillToY = pixelForY(fillTo);
        lineTo(fill, prevXPos, fillToY);
        lineTo(fill, firstXPos, fillToY);
      }
      if (!series.spanGaps) {
        let gaps = [];
        gaps.push(...findGaps(dataX, dataY, idx0, idx1, dir, pixelForX, alignGaps));
        _paths.gaps = gaps = series.gaps(u, seriesIdx, idx0, idx1, gaps);
        _paths.clip = clipGaps(gaps, scaleX.ori, xOff, yOff, xDim, yDim);
      }
      if (bandClipDir != 0) {
        _paths.band = bandClipDir == 2 ? [
          clipBandLine(u, seriesIdx, idx0, idx1, stroke, -1),
          clipBandLine(u, seriesIdx, idx0, idx1, stroke, 1)
        ] : clipBandLine(u, seriesIdx, idx0, idx1, stroke, bandClipDir);
      }
      return _paths;
    });
  };
};
var monotoneCubic = function(opts) {
  return splineInterp(_monotoneCubic, opts);
};
var _monotoneCubic = function(xs, ys, moveTo, lineTo, bezierCurveTo, pxRound) {
  const n = xs.length;
  if (n < 2)
    return null;
  const path = new Path2D;
  moveTo(path, xs[0], ys[0]);
  if (n == 2)
    lineTo(path, xs[1], ys[1]);
  else {
    let ms = Array(n), ds = Array(n - 1), dys = Array(n - 1), dxs = Array(n - 1);
    for (let i = 0;i < n - 1; i++) {
      dys[i] = ys[i + 1] - ys[i];
      dxs[i] = xs[i + 1] - xs[i];
      ds[i] = dys[i] / dxs[i];
    }
    ms[0] = ds[0];
    for (let i = 1;i < n - 1; i++) {
      if (ds[i] === 0 || ds[i - 1] === 0 || ds[i - 1] > 0 !== ds[i] > 0)
        ms[i] = 0;
      else {
        ms[i] = 3 * (dxs[i - 1] + dxs[i]) / ((2 * dxs[i] + dxs[i - 1]) / ds[i - 1] + (dxs[i] + 2 * dxs[i - 1]) / ds[i]);
        if (!isFinite(ms[i]))
          ms[i] = 0;
      }
    }
    ms[n - 1] = ds[n - 2];
    for (let i = 0;i < n - 1; i++) {
      bezierCurveTo(path, xs[i] + dxs[i] / 3, ys[i] + ms[i] * dxs[i] / 3, xs[i + 1] - dxs[i] / 3, ys[i + 1] - ms[i + 1] * dxs[i] / 3, xs[i + 1], ys[i + 1]);
    }
  }
  return path;
};
var invalidateRects = function() {
  for (let u of cursorPlots)
    u.syncRect(true);
};
var setDefaults = function(d, xo, yo, initY) {
  let d2 = initY ? [d[0], d[1]].concat(d.slice(2)) : [d[0]].concat(d.slice(1));
  return d2.map((o, i) => setDefault(o, i, xo, yo));
};
var setDefaults2 = function(d, xyo) {
  return d.map((o, i) => i == 0 ? null : assign({}, xyo, o));
};
var setDefault = function(o, i, xo, yo) {
  return assign({}, i == 0 ? xo : yo, o);
};
var snapNumX = function(self2, dataMin, dataMax) {
  return dataMin == null ? nullNullTuple : [dataMin, dataMax];
};
var snapNumY = function(self2, dataMin, dataMax) {
  return dataMin == null ? nullNullTuple : rangeNum(dataMin, dataMax, rangePad, true);
};
var snapLogY = function(self2, dataMin, dataMax, scale) {
  return dataMin == null ? nullNullTuple : rangeLog(dataMin, dataMax, self2.scales[scale].log, false);
};
var snapAsinhY = function(self2, dataMin, dataMax, scale) {
  return dataMin == null ? nullNullTuple : rangeAsinh(dataMin, dataMax, self2.scales[scale].log, false);
};
var findIncr = function(minVal, maxVal, incrs, dim, minSpace) {
  let intDigits = max(numIntDigits(minVal), numIntDigits(maxVal));
  let delta = maxVal - minVal;
  let incrIdx = closestIdx(minSpace / dim * delta, incrs);
  do {
    let foundIncr = incrs[incrIdx];
    let foundSpace = dim * foundIncr / delta;
    if (foundSpace >= minSpace && intDigits + (foundIncr < 5 ? fixedDec.get(foundIncr) : 0) <= 17)
      return [foundIncr, foundSpace];
  } while (++incrIdx < incrs.length);
  return [0, 0];
};
var pxRatioFont = function(font) {
  let fontSize, fontSizeCss;
  font = font.replace(/(\d+)px/, (m, p1) => (fontSize = round((fontSizeCss = +p1) * pxRatio)) + "px");
  return [font, fontSize, fontSizeCss];
};
var syncFontSize = function(axis) {
  if (axis.show) {
    [axis.font, axis.labelFont].forEach((f) => {
      let size = roundDec(f[2] * pxRatio, 1);
      f[0] = f[0].replace(/[0-9.]+px/, size + "px");
      f[1] = size;
    });
  }
};
var uPlot = function(opts, data, then) {
  const self2 = {
    mode: ifNull(opts.mode, 1)
  };
  const mode = self2.mode;
  function getValPct(val, scale) {
    let _val = scale.distr == 3 ? log10(val > 0 ? val : scale.clamp(self2, val, scale.min, scale.max, scale.key)) : scale.distr == 4 ? asinh(val, scale.asinh) : val;
    return (_val - scale._min) / (scale._max - scale._min);
  }
  function getHPos(val, scale, dim, off2) {
    let pct = getValPct(val, scale);
    return off2 + dim * (scale.dir == -1 ? 1 - pct : pct);
  }
  function getVPos(val, scale, dim, off2) {
    let pct = getValPct(val, scale);
    return off2 + dim * (scale.dir == -1 ? pct : 1 - pct);
  }
  function getPos(val, scale, dim, off2) {
    return scale.ori == 0 ? getHPos(val, scale, dim, off2) : getVPos(val, scale, dim, off2);
  }
  self2.valToPosH = getHPos;
  self2.valToPosV = getVPos;
  let ready = false;
  self2.status = 0;
  const root = self2.root = placeDiv(UPLOT);
  if (opts.id != null)
    root.id = opts.id;
  addClass(root, opts.class);
  if (opts.title) {
    let title = placeDiv(TITLE, root);
    title.textContent = opts.title;
  }
  const can = placeTag("canvas");
  const ctx = self2.ctx = can.getContext("2d");
  const wrap2 = placeDiv(WRAP, root);
  on("click", wrap2, (e) => {
    if (e.target === over) {
      let didDrag = mouseLeft1 != mouseLeft0 || mouseTop1 != mouseTop0;
      didDrag && drag.click(self2, e);
    }
  }, true);
  const under = self2.under = placeDiv(UNDER, wrap2);
  wrap2.appendChild(can);
  const over = self2.over = placeDiv(OVER, wrap2);
  opts = copy(opts);
  const pxAlign = +ifNull(opts.pxAlign, 1);
  const pxRound = pxRoundGen(pxAlign);
  (opts.plugins || []).forEach((p2) => {
    if (p2.opts)
      opts = p2.opts(self2, opts) || opts;
  });
  const ms = opts.ms || 0.001;
  const series = self2.series = mode == 1 ? setDefaults(opts.series || [], xSeriesOpts, ySeriesOpts, false) : setDefaults2(opts.series || [null], xySeriesOpts);
  const axes = self2.axes = setDefaults(opts.axes || [], xAxisOpts, yAxisOpts, true);
  const scales = self2.scales = {};
  const bands = self2.bands = opts.bands || [];
  bands.forEach((b2) => {
    b2.fill = fnOrSelf(b2.fill || null);
    b2.dir = ifNull(b2.dir, -1);
  });
  const xScaleKey = mode == 2 ? series[1].facets[0].scale : series[0].scale;
  const drawOrderMap = {
    axes: drawAxesGrid,
    series: drawSeries
  };
  const drawOrder = (opts.drawOrder || ["axes", "series"]).map((key2) => drawOrderMap[key2]);
  function initScale(scaleKey) {
    let sc2 = scales[scaleKey];
    if (sc2 == null) {
      let scaleOpts = (opts.scales || EMPTY_OBJ)[scaleKey] || EMPTY_OBJ;
      if (scaleOpts.from != null) {
        initScale(scaleOpts.from);
        scales[scaleKey] = assign({}, scales[scaleOpts.from], scaleOpts, { key: scaleKey });
      } else {
        sc2 = scales[scaleKey] = assign({}, scaleKey == xScaleKey ? xScaleOpts : yScaleOpts, scaleOpts);
        sc2.key = scaleKey;
        let isTime = sc2.time;
        let rn = sc2.range;
        let rangeIsArr = isArr(rn);
        if (scaleKey != xScaleKey || mode == 2 && !isTime) {
          if (rangeIsArr && (rn[0] == null || rn[1] == null)) {
            rn = {
              min: rn[0] == null ? autoRangePart : {
                mode: 1,
                hard: rn[0],
                soft: rn[0]
              },
              max: rn[1] == null ? autoRangePart : {
                mode: 1,
                hard: rn[1],
                soft: rn[1]
              }
            };
            rangeIsArr = false;
          }
          if (!rangeIsArr && isObj(rn)) {
            let cfg = rn;
            rn = (self3, dataMin, dataMax) => dataMin == null ? nullNullTuple : rangeNum(dataMin, dataMax, cfg);
          }
        }
        sc2.range = fnOrSelf(rn || (isTime ? snapTimeX : scaleKey == xScaleKey ? sc2.distr == 3 ? snapLogX : sc2.distr == 4 ? snapAsinhX : snapNumX : sc2.distr == 3 ? snapLogY : sc2.distr == 4 ? snapAsinhY : snapNumY));
        sc2.auto = fnOrSelf(rangeIsArr ? false : sc2.auto);
        sc2.clamp = fnOrSelf(sc2.clamp || clampScale);
        sc2._min = sc2._max = null;
      }
    }
  }
  initScale("x");
  initScale("y");
  if (mode == 1) {
    series.forEach((s) => {
      initScale(s.scale);
    });
  }
  axes.forEach((a) => {
    initScale(a.scale);
  });
  for (let k3 in opts.scales)
    initScale(k3);
  const scaleX = scales[xScaleKey];
  const xScaleDistr = scaleX.distr;
  let valToPosX, valToPosY;
  if (scaleX.ori == 0) {
    addClass(root, ORI_HZ);
    valToPosX = getHPos;
    valToPosY = getVPos;
  } else {
    addClass(root, ORI_VT);
    valToPosX = getVPos;
    valToPosY = getHPos;
  }
  const pendScales = {};
  for (let k3 in scales) {
    let sc2 = scales[k3];
    if (sc2.min != null || sc2.max != null) {
      pendScales[k3] = { min: sc2.min, max: sc2.max };
      sc2.min = sc2.max = null;
    }
  }
  const _tzDate = opts.tzDate || ((ts) => new Date(round(ts / ms)));
  const _fmtDate = opts.fmtDate || fmtDate;
  const _timeAxisSplits = ms == 1 ? timeAxisSplitsMs(_tzDate) : timeAxisSplitsS(_tzDate);
  const _timeAxisVals = timeAxisVals(_tzDate, timeAxisStamps(ms == 1 ? _timeAxisStampsMs : _timeAxisStampsS, _fmtDate));
  const _timeSeriesVal = timeSeriesVal(_tzDate, timeSeriesStamp(_timeSeriesStamp, _fmtDate));
  const activeIdxs = [];
  const legend = self2.legend = assign({}, legendOpts, opts.legend);
  const showLegend = legend.show;
  const markers = legend.markers;
  {
    legend.idxs = activeIdxs;
    markers.width = fnOrSelf(markers.width);
    markers.dash = fnOrSelf(markers.dash);
    markers.stroke = fnOrSelf(markers.stroke);
    markers.fill = fnOrSelf(markers.fill);
  }
  let legendTable;
  let legendHead;
  let legendBody;
  let legendRows = [];
  let legendCells = [];
  let legendCols;
  let multiValLegend = false;
  let NULL_LEGEND_VALUES = {};
  if (legend.live) {
    const getMultiVals = series[1] ? series[1].values : null;
    multiValLegend = getMultiVals != null;
    legendCols = multiValLegend ? getMultiVals(self2, 1, 0) : { _: 0 };
    for (let k3 in legendCols)
      NULL_LEGEND_VALUES[k3] = LEGEND_DISP;
  }
  if (showLegend) {
    legendTable = placeTag("table", LEGEND, root);
    legendBody = placeTag("tbody", null, legendTable);
    legend.mount(self2, legendTable);
    if (multiValLegend) {
      legendHead = placeTag("thead", null, legendTable, legendBody);
      let head = placeTag("tr", null, legendHead);
      placeTag("th", null, head);
      for (var key in legendCols)
        placeTag("th", LEGEND_LABEL, head).textContent = key;
    } else {
      addClass(legendTable, LEGEND_INLINE);
      legend.live && addClass(legendTable, LEGEND_LIVE);
    }
  }
  const son = { show: true };
  const soff = { show: false };
  function initLegendRow(s, i) {
    if (i == 0 && (multiValLegend || !legend.live || mode == 2))
      return nullNullTuple;
    let cells = [];
    let row = placeTag("tr", LEGEND_SERIES, legendBody, legendBody.childNodes[i]);
    addClass(row, s.class);
    if (!s.show)
      addClass(row, OFF);
    let label = placeTag("th", null, row);
    if (markers.show) {
      let indic = placeDiv(LEGEND_MARKER, label);
      if (i > 0) {
        let width = markers.width(self2, i);
        if (width)
          indic.style.border = width + "px " + markers.dash(self2, i) + " " + markers.stroke(self2, i);
        indic.style.background = markers.fill(self2, i);
      }
    }
    let text = placeDiv(LEGEND_LABEL, label);
    text.textContent = s.label;
    if (i > 0) {
      if (!markers.show)
        text.style.color = s.width > 0 ? markers.stroke(self2, i) : markers.fill(self2, i);
      onMouse("click", label, (e) => {
        if (cursor._lock)
          return;
        setCursorEvent(e);
        let seriesIdx = series.indexOf(s);
        if ((e.ctrlKey || e.metaKey) != legend.isolate) {
          let isolate = series.some((s2, i2) => i2 > 0 && i2 != seriesIdx && s2.show);
          series.forEach((s2, i2) => {
            i2 > 0 && setSeries(i2, isolate ? i2 == seriesIdx ? son : soff : son, true, syncOpts.setSeries);
          });
        } else
          setSeries(seriesIdx, { show: !s.show }, true, syncOpts.setSeries);
      }, false);
      if (cursorFocus) {
        onMouse(mouseenter, label, (e) => {
          if (cursor._lock)
            return;
          setCursorEvent(e);
          setSeries(series.indexOf(s), FOCUS_TRUE, true, syncOpts.setSeries);
        }, false);
      }
    }
    for (var key2 in legendCols) {
      let v3 = placeTag("td", LEGEND_VALUE, row);
      v3.textContent = "--";
      cells.push(v3);
    }
    return [row, cells];
  }
  const mouseListeners = new Map;
  function onMouse(ev, targ, fn, onlyTarg = true) {
    const targListeners = mouseListeners.get(targ) || {};
    const listener = cursor.bind[ev](self2, targ, fn, onlyTarg);
    if (listener) {
      on(ev, targ, targListeners[ev] = listener);
      mouseListeners.set(targ, targListeners);
    }
  }
  function offMouse(ev, targ, fn) {
    const targListeners = mouseListeners.get(targ) || {};
    for (let k3 in targListeners) {
      if (ev == null || k3 == ev) {
        off(k3, targ, targListeners[k3]);
        delete targListeners[k3];
      }
    }
    if (ev == null)
      mouseListeners.delete(targ);
  }
  let fullWidCss = 0;
  let fullHgtCss = 0;
  let plotWidCss = 0;
  let plotHgtCss = 0;
  let plotLftCss = 0;
  let plotTopCss = 0;
  let _plotLftCss = plotLftCss;
  let _plotTopCss = plotTopCss;
  let _plotWidCss = plotWidCss;
  let _plotHgtCss = plotHgtCss;
  let plotLft = 0;
  let plotTop = 0;
  let plotWid = 0;
  let plotHgt = 0;
  self2.bbox = {};
  let shouldSetScales = false;
  let shouldSetSize = false;
  let shouldConvergeSize = false;
  let shouldSetCursor = false;
  let shouldSetSelect = false;
  let shouldSetLegend = false;
  function _setSize(width, height, force) {
    if (force || (width != self2.width || height != self2.height))
      calcSize(width, height);
    resetYSeries(false);
    shouldConvergeSize = true;
    shouldSetSize = true;
    commit();
  }
  function calcSize(width, height) {
    self2.width = fullWidCss = plotWidCss = width;
    self2.height = fullHgtCss = plotHgtCss = height;
    plotLftCss = plotTopCss = 0;
    calcPlotRect();
    calcAxesRects();
    let bb2 = self2.bbox;
    plotLft = bb2.left = incrRound(plotLftCss * pxRatio, 0.5);
    plotTop = bb2.top = incrRound(plotTopCss * pxRatio, 0.5);
    plotWid = bb2.width = incrRound(plotWidCss * pxRatio, 0.5);
    plotHgt = bb2.height = incrRound(plotHgtCss * pxRatio, 0.5);
  }
  const CYCLE_LIMIT = 3;
  function convergeSize() {
    let converged = false;
    let cycleNum = 0;
    while (!converged) {
      cycleNum++;
      let axesConverged = axesCalc(cycleNum);
      let paddingConverged = paddingCalc(cycleNum);
      converged = cycleNum == CYCLE_LIMIT || axesConverged && paddingConverged;
      if (!converged) {
        calcSize(self2.width, self2.height);
        shouldSetSize = true;
      }
    }
  }
  function setSize({ width, height }) {
    _setSize(width, height);
  }
  self2.setSize = setSize;
  function calcPlotRect() {
    let hasTopAxis = false;
    let hasBtmAxis = false;
    let hasRgtAxis = false;
    let hasLftAxis = false;
    axes.forEach((axis, i) => {
      if (axis.show && axis._show) {
        let { side, _size } = axis;
        let isVt = side % 2;
        let labelSize = axis.label != null ? axis.labelSize : 0;
        let fullSize = _size + labelSize;
        if (fullSize > 0) {
          if (isVt) {
            plotWidCss -= fullSize;
            if (side == 3) {
              plotLftCss += fullSize;
              hasLftAxis = true;
            } else
              hasRgtAxis = true;
          } else {
            plotHgtCss -= fullSize;
            if (side == 0) {
              plotTopCss += fullSize;
              hasTopAxis = true;
            } else
              hasBtmAxis = true;
          }
        }
      }
    });
    sidesWithAxes[0] = hasTopAxis;
    sidesWithAxes[1] = hasRgtAxis;
    sidesWithAxes[2] = hasBtmAxis;
    sidesWithAxes[3] = hasLftAxis;
    plotWidCss -= _padding[1] + _padding[3];
    plotLftCss += _padding[3];
    plotHgtCss -= _padding[2] + _padding[0];
    plotTopCss += _padding[0];
  }
  function calcAxesRects() {
    let off1 = plotLftCss + plotWidCss;
    let off2 = plotTopCss + plotHgtCss;
    let off3 = plotLftCss;
    let off0 = plotTopCss;
    function incrOffset(side, size) {
      switch (side) {
        case 1:
          off1 += size;
          return off1 - size;
        case 2:
          off2 += size;
          return off2 - size;
        case 3:
          off3 -= size;
          return off3 + size;
        case 0:
          off0 -= size;
          return off0 + size;
      }
    }
    axes.forEach((axis, i) => {
      if (axis.show && axis._show) {
        let side = axis.side;
        axis._pos = incrOffset(side, axis._size);
        if (axis.label != null)
          axis._lpos = incrOffset(side, axis.labelSize);
      }
    });
  }
  const cursor = self2.cursor = assign({}, cursorOpts, { drag: { y: mode == 2 } }, opts.cursor);
  if (cursor.dataIdx == null) {
    let hov = cursor.hover;
    let skip = hov.skip = new Set(hov.skip ?? []);
    skip.add(undefined);
    let prox = hov.prox = fnOrSelf(hov.prox);
    let bias = hov.bias ??= 0;
    cursor.dataIdx = (self3, seriesIdx, cursorIdx, valAtPosX) => {
      if (seriesIdx == 0)
        return cursorIdx;
      let idx2 = cursorIdx;
      let _prox = prox(self3, seriesIdx, cursorIdx, valAtPosX) ?? inf;
      let withProx = _prox >= 0 && _prox < inf;
      let xDim = scaleX.ori == 0 ? plotWidCss : plotHgtCss;
      let cursorLft = cursor.left;
      let xValues = data[0];
      let yValues = data[seriesIdx];
      if (skip.has(yValues[cursorIdx])) {
        idx2 = null;
        let nonNullLft = null, nonNullRgt = null, j2;
        if (bias == 0 || bias == -1) {
          j2 = cursorIdx;
          while (nonNullLft == null && j2-- > 0) {
            if (!skip.has(yValues[j2]))
              nonNullLft = j2;
          }
        }
        if (bias == 0 || bias == 1) {
          j2 = cursorIdx;
          while (nonNullRgt == null && j2++ < yValues.length) {
            if (!skip.has(yValues[j2]))
              nonNullRgt = j2;
          }
        }
        if (nonNullLft != null || nonNullRgt != null) {
          if (withProx) {
            let lftPos = nonNullLft == null ? (-Infinity) : valToPosX(xValues[nonNullLft], scaleX, xDim, 0);
            let rgtPos = nonNullRgt == null ? Infinity : valToPosX(xValues[nonNullRgt], scaleX, xDim, 0);
            let lftDelta = cursorLft - lftPos;
            let rgtDelta = rgtPos - cursorLft;
            if (lftDelta <= rgtDelta) {
              if (lftDelta <= _prox)
                idx2 = nonNullLft;
            } else {
              if (rgtDelta <= _prox)
                idx2 = nonNullRgt;
            }
          } else {
            idx2 = nonNullRgt == null ? nonNullLft : nonNullLft == null ? nonNullRgt : cursorIdx - nonNullLft <= nonNullRgt - cursorIdx ? nonNullLft : nonNullRgt;
          }
        }
      } else if (withProx) {
        let dist = abs(cursorLft - valToPosX(xValues[cursorIdx], scaleX, xDim, 0));
        if (dist > _prox)
          idx2 = null;
      }
      return idx2;
    };
  }
  const setCursorEvent = (e) => {
    cursor.event = e;
  };
  cursor.idxs = activeIdxs;
  cursor._lock = false;
  let points2 = cursor.points;
  points2.show = fnOrSelf(points2.show);
  points2.size = fnOrSelf(points2.size);
  points2.stroke = fnOrSelf(points2.stroke);
  points2.width = fnOrSelf(points2.width);
  points2.fill = fnOrSelf(points2.fill);
  const focus = self2.focus = assign({}, opts.focus || { alpha: 0.3 }, cursor.focus);
  const cursorFocus = focus.prox >= 0;
  let cursorPts = [null];
  let cursorPtsLft = [null];
  let cursorPtsTop = [null];
  function initCursorPt(s, si) {
    if (si > 0) {
      let pt = cursor.points.show(self2, si);
      if (pt) {
        addClass(pt, CURSOR_PT);
        addClass(pt, s.class);
        elTrans(pt, -10, -10, plotWidCss, plotHgtCss);
        over.insertBefore(pt, cursorPts[si]);
        return pt;
      }
    }
  }
  function initSeries(s, i) {
    if (mode == 1 || i > 0) {
      let isTime = mode == 1 && scales[s.scale].time;
      let sv = s.value;
      s.value = isTime ? isStr(sv) ? timeSeriesVal(_tzDate, timeSeriesStamp(sv, _fmtDate)) : sv || _timeSeriesVal : sv || numSeriesVal;
      s.label = s.label || (isTime ? timeSeriesLabel : numSeriesLabel);
    }
    if (i > 0) {
      s.width = s.width == null ? 1 : s.width;
      s.paths = s.paths || linearPath || retNull;
      s.fillTo = fnOrSelf(s.fillTo || seriesFillTo);
      s.pxAlign = +ifNull(s.pxAlign, pxAlign);
      s.pxRound = pxRoundGen(s.pxAlign);
      s.stroke = fnOrSelf(s.stroke || null);
      s.fill = fnOrSelf(s.fill || null);
      s._stroke = s._fill = s._paths = s._focus = null;
      let _ptDia = ptDia(max(1, s.width), 1);
      let points3 = s.points = assign({}, {
        size: _ptDia,
        width: max(1, _ptDia * 0.2),
        stroke: s.stroke,
        space: _ptDia * 2,
        paths: pointsPath,
        _stroke: null,
        _fill: null
      }, s.points);
      points3.show = fnOrSelf(points3.show);
      points3.filter = fnOrSelf(points3.filter);
      points3.fill = fnOrSelf(points3.fill);
      points3.stroke = fnOrSelf(points3.stroke);
      points3.paths = fnOrSelf(points3.paths);
      points3.pxAlign = s.pxAlign;
    }
    if (showLegend) {
      let rowCells = initLegendRow(s, i);
      legendRows.splice(i, 0, rowCells[0]);
      legendCells.splice(i, 0, rowCells[1]);
      legend.values.push(null);
    }
    if (cursor.show) {
      activeIdxs.splice(i, 0, null);
      let pt = initCursorPt(s, i);
      if (pt != null) {
        cursorPts.splice(i, 0, pt);
        cursorPtsLft.splice(i, 0, 0);
        cursorPtsTop.splice(i, 0, 0);
      }
    }
    fire("addSeries", i);
  }
  function addSeries(opts2, si) {
    si = si == null ? series.length : si;
    opts2 = mode == 1 ? setDefault(opts2, si, xSeriesOpts, ySeriesOpts) : setDefault(opts2, si, null, xySeriesOpts);
    series.splice(si, 0, opts2);
    initSeries(series[si], si);
  }
  self2.addSeries = addSeries;
  function delSeries(i) {
    series.splice(i, 1);
    if (showLegend) {
      legend.values.splice(i, 1);
      legendCells.splice(i, 1);
      let tr = legendRows.splice(i, 1)[0];
      offMouse(null, tr.firstChild);
      tr.remove();
    }
    if (cursor.show) {
      activeIdxs.splice(i, 1);
      if (cursorPts.length > 1) {
        cursorPts.splice(i, 1)[0].remove();
        cursorPtsLft.splice(i, 1);
        cursorPtsTop.splice(i, 1);
      }
    }
    fire("delSeries", i);
  }
  self2.delSeries = delSeries;
  const sidesWithAxes = [false, false, false, false];
  function initAxis(axis, i) {
    axis._show = axis.show;
    if (axis.show) {
      let isVt = axis.side % 2;
      let sc2 = scales[axis.scale];
      if (sc2 == null) {
        axis.scale = isVt ? series[1].scale : xScaleKey;
        sc2 = scales[axis.scale];
      }
      let isTime = sc2.time;
      axis.size = fnOrSelf(axis.size);
      axis.space = fnOrSelf(axis.space);
      axis.rotate = fnOrSelf(axis.rotate);
      if (isArr(axis.incrs)) {
        axis.incrs.forEach((incr) => {
          !fixedDec.has(incr) && fixedDec.set(incr, guessDec(incr));
        });
      }
      axis.incrs = fnOrSelf(axis.incrs || (sc2.distr == 2 ? wholeIncrs : isTime ? ms == 1 ? timeIncrsMs : timeIncrsS : numIncrs));
      axis.splits = fnOrSelf(axis.splits || (isTime && sc2.distr == 1 ? _timeAxisSplits : sc2.distr == 3 ? logAxisSplits : sc2.distr == 4 ? asinhAxisSplits : numAxisSplits));
      axis.stroke = fnOrSelf(axis.stroke);
      axis.grid.stroke = fnOrSelf(axis.grid.stroke);
      axis.ticks.stroke = fnOrSelf(axis.ticks.stroke);
      axis.border.stroke = fnOrSelf(axis.border.stroke);
      let av = axis.values;
      axis.values = isArr(av) && !isArr(av[0]) ? fnOrSelf(av) : isTime ? isArr(av) ? timeAxisVals(_tzDate, timeAxisStamps(av, _fmtDate)) : isStr(av) ? timeAxisVal(_tzDate, av) : av || _timeAxisVals : av || numAxisVals;
      axis.filter = fnOrSelf(axis.filter || (sc2.distr >= 3 && sc2.log == 10 ? log10AxisValsFilt : sc2.distr == 3 && sc2.log == 2 ? log2AxisValsFilt : retArg1));
      axis.font = pxRatioFont(axis.font);
      axis.labelFont = pxRatioFont(axis.labelFont);
      axis._size = axis.size(self2, null, i, 0);
      axis._space = axis._rotate = axis._incrs = axis._found = axis._splits = axis._values = null;
      if (axis._size > 0) {
        sidesWithAxes[i] = true;
        axis._el = placeDiv(AXIS, wrap2);
      }
    }
  }
  function autoPadSide(self3, side, sidesWithAxes2, cycleNum) {
    let [hasTopAxis, hasRgtAxis, hasBtmAxis, hasLftAxis] = sidesWithAxes2;
    let ori = side % 2;
    let size = 0;
    if (ori == 0 && (hasLftAxis || hasRgtAxis))
      size = side == 0 && !hasTopAxis || side == 2 && !hasBtmAxis ? round(xAxisOpts.size / 3) : 0;
    if (ori == 1 && (hasTopAxis || hasBtmAxis))
      size = side == 1 && !hasRgtAxis || side == 3 && !hasLftAxis ? round(yAxisOpts.size / 2) : 0;
    return size;
  }
  const padding = self2.padding = (opts.padding || [autoPadSide, autoPadSide, autoPadSide, autoPadSide]).map((p2) => fnOrSelf(ifNull(p2, autoPadSide)));
  const _padding = self2._padding = padding.map((p2, i) => p2(self2, i, sidesWithAxes, 0));
  let dataLen;
  let i0 = null;
  let i1 = null;
  const idxs = mode == 1 ? series[0].idxs : null;
  let data0 = null;
  let viaAutoScaleX = false;
  function setData(_data, _resetScales) {
    data = _data == null ? [] : _data;
    self2.data = self2._data = data;
    if (mode == 2) {
      dataLen = 0;
      for (let i = 1;i < series.length; i++)
        dataLen += data[i][0].length;
    } else {
      if (data.length == 0)
        self2.data = self2._data = data = [[]];
      data0 = data[0];
      dataLen = data0.length;
      let scaleData = data;
      if (xScaleDistr == 2) {
        scaleData = data.slice();
        let _data0 = scaleData[0] = Array(dataLen);
        for (let i = 0;i < dataLen; i++)
          _data0[i] = i;
      }
      self2._data = data = scaleData;
    }
    resetYSeries(true);
    fire("setData");
    if (xScaleDistr == 2) {
      shouldConvergeSize = true;
    }
    if (_resetScales !== false) {
      let xsc = scaleX;
      if (xsc.auto(self2, viaAutoScaleX))
        autoScaleX();
      else
        _setScale(xScaleKey, xsc.min, xsc.max);
      shouldSetCursor = shouldSetCursor || cursor.left >= 0;
      shouldSetLegend = true;
      commit();
    }
  }
  self2.setData = setData;
  function autoScaleX() {
    viaAutoScaleX = true;
    let _min, _max;
    if (mode == 1) {
      if (dataLen > 0) {
        i0 = idxs[0] = 0;
        i1 = idxs[1] = dataLen - 1;
        _min = data[0][i0];
        _max = data[0][i1];
        if (xScaleDistr == 2) {
          _min = i0;
          _max = i1;
        } else if (_min == _max) {
          if (xScaleDistr == 3)
            [_min, _max] = rangeLog(_min, _min, scaleX.log, false);
          else if (xScaleDistr == 4)
            [_min, _max] = rangeAsinh(_min, _min, scaleX.log, false);
          else if (scaleX.time)
            _max = _min + round(86400 / ms);
          else
            [_min, _max] = rangeNum(_min, _max, rangePad, true);
        }
      } else {
        i0 = idxs[0] = _min = null;
        i1 = idxs[1] = _max = null;
      }
    }
    _setScale(xScaleKey, _min, _max);
  }
  let ctxStroke, ctxFill, ctxWidth, ctxDash, ctxJoin, ctxCap, ctxFont, ctxAlign, ctxBaseline;
  let ctxAlpha;
  function setCtxStyle(stroke, width, dash, cap, fill, join2) {
    stroke ??= transparent;
    dash ??= EMPTY_ARR;
    cap ??= "butt";
    fill ??= transparent;
    join2 ??= "round";
    if (stroke != ctxStroke)
      ctx.strokeStyle = ctxStroke = stroke;
    if (fill != ctxFill)
      ctx.fillStyle = ctxFill = fill;
    if (width != ctxWidth)
      ctx.lineWidth = ctxWidth = width;
    if (join2 != ctxJoin)
      ctx.lineJoin = ctxJoin = join2;
    if (cap != ctxCap)
      ctx.lineCap = ctxCap = cap;
    if (dash != ctxDash)
      ctx.setLineDash(ctxDash = dash);
  }
  function setFontStyle(font, fill, align, baseline) {
    if (fill != ctxFill)
      ctx.fillStyle = ctxFill = fill;
    if (font != ctxFont)
      ctx.font = ctxFont = font;
    if (align != ctxAlign)
      ctx.textAlign = ctxAlign = align;
    if (baseline != ctxBaseline)
      ctx.textBaseline = ctxBaseline = baseline;
  }
  function accScale(wsc, psc, facet, data2, sorted = 0) {
    if (data2.length > 0 && wsc.auto(self2, viaAutoScaleX) && (psc == null || psc.min == null)) {
      let _i0 = ifNull(i0, 0);
      let _i1 = ifNull(i1, data2.length - 1);
      let minMax = facet.min == null ? wsc.distr == 3 ? getMinMaxLog(data2, _i0, _i1) : getMinMax(data2, _i0, _i1, sorted) : [facet.min, facet.max];
      wsc.min = min(wsc.min, facet.min = minMax[0]);
      wsc.max = max(wsc.max, facet.max = minMax[1]);
    }
  }
  const AUTOSCALE = { min: null, max: null };
  function setScales() {
    for (let k3 in scales) {
      let sc2 = scales[k3];
      if (pendScales[k3] == null && (sc2.min == null || pendScales[xScaleKey] != null && sc2.auto(self2, viaAutoScaleX))) {
        pendScales[k3] = AUTOSCALE;
      }
    }
    for (let k3 in scales) {
      let sc2 = scales[k3];
      if (pendScales[k3] == null && sc2.from != null && pendScales[sc2.from] != null)
        pendScales[k3] = AUTOSCALE;
    }
    if (pendScales[xScaleKey] != null)
      resetYSeries(true);
    let wipScales = {};
    for (let k3 in pendScales) {
      let psc = pendScales[k3];
      if (psc != null) {
        let wsc = wipScales[k3] = copy(scales[k3], fastIsObj);
        if (psc.min != null)
          assign(wsc, psc);
        else if (k3 != xScaleKey || mode == 2) {
          if (dataLen == 0 && wsc.from == null) {
            let minMax = wsc.range(self2, null, null, k3);
            wsc.min = minMax[0];
            wsc.max = minMax[1];
          } else {
            wsc.min = inf;
            wsc.max = -inf;
          }
        }
      }
    }
    if (dataLen > 0) {
      series.forEach((s, i) => {
        if (mode == 1) {
          let k3 = s.scale;
          let psc = pendScales[k3];
          if (psc == null)
            return;
          let wsc = wipScales[k3];
          if (i == 0) {
            let minMax = wsc.range(self2, wsc.min, wsc.max, k3);
            wsc.min = minMax[0];
            wsc.max = minMax[1];
            i0 = closestIdx(wsc.min, data[0]);
            i1 = closestIdx(wsc.max, data[0]);
            if (i1 - i0 > 1) {
              if (data[0][i0] < wsc.min)
                i0++;
              if (data[0][i1] > wsc.max)
                i1--;
            }
            s.min = data0[i0];
            s.max = data0[i1];
          } else if (s.show && s.auto)
            accScale(wsc, psc, s, data[i], s.sorted);
          s.idxs[0] = i0;
          s.idxs[1] = i1;
        } else {
          if (i > 0) {
            if (s.show && s.auto) {
              let [xFacet, yFacet] = s.facets;
              let xScaleKey2 = xFacet.scale;
              let yScaleKey = yFacet.scale;
              let [xData, yData] = data[i];
              let wscx = wipScales[xScaleKey2];
              let wscy = wipScales[yScaleKey];
              wscx != null && accScale(wscx, pendScales[xScaleKey2], xFacet, xData, xFacet.sorted);
              wscy != null && accScale(wscy, pendScales[yScaleKey], yFacet, yData, yFacet.sorted);
              s.min = yFacet.min;
              s.max = yFacet.max;
            }
          }
        }
      });
      for (let k3 in wipScales) {
        let wsc = wipScales[k3];
        let psc = pendScales[k3];
        if (wsc.from == null && (psc == null || psc.min == null)) {
          let minMax = wsc.range(self2, wsc.min == inf ? null : wsc.min, wsc.max == -inf ? null : wsc.max, k3);
          wsc.min = minMax[0];
          wsc.max = minMax[1];
        }
      }
    }
    for (let k3 in wipScales) {
      let wsc = wipScales[k3];
      if (wsc.from != null) {
        let base = wipScales[wsc.from];
        if (base.min == null)
          wsc.min = wsc.max = null;
        else {
          let minMax = wsc.range(self2, base.min, base.max, k3);
          wsc.min = minMax[0];
          wsc.max = minMax[1];
        }
      }
    }
    let changed = {};
    let anyChanged = false;
    for (let k3 in wipScales) {
      let wsc = wipScales[k3];
      let sc2 = scales[k3];
      if (sc2.min != wsc.min || sc2.max != wsc.max) {
        sc2.min = wsc.min;
        sc2.max = wsc.max;
        let distr = sc2.distr;
        sc2._min = distr == 3 ? log10(sc2.min) : distr == 4 ? asinh(sc2.min, sc2.asinh) : sc2.min;
        sc2._max = distr == 3 ? log10(sc2.max) : distr == 4 ? asinh(sc2.max, sc2.asinh) : sc2.max;
        changed[k3] = anyChanged = true;
      }
    }
    if (anyChanged) {
      series.forEach((s, i) => {
        if (mode == 2) {
          if (i > 0 && changed.y)
            s._paths = null;
        } else {
          if (changed[s.scale])
            s._paths = null;
        }
      });
      for (let k3 in changed) {
        shouldConvergeSize = true;
        fire("setScale", k3);
      }
      if (cursor.show && cursor.left >= 0)
        shouldSetCursor = shouldSetLegend = true;
    }
    for (let k3 in pendScales)
      pendScales[k3] = null;
  }
  function getOuterIdxs(ydata) {
    let _i0 = clamp(i0 - 1, 0, dataLen - 1);
    let _i1 = clamp(i1 + 1, 0, dataLen - 1);
    while (ydata[_i0] == null && _i0 > 0)
      _i0--;
    while (ydata[_i1] == null && _i1 < dataLen - 1)
      _i1++;
    return [_i0, _i1];
  }
  function drawSeries() {
    if (dataLen > 0) {
      series.forEach((s, i) => {
        if (i > 0 && s.show) {
          cacheStrokeFill(i, false);
          cacheStrokeFill(i, true);
          if (s._paths == null) {
            if (ctxAlpha != s.alpha)
              ctx.globalAlpha = ctxAlpha = s.alpha;
            let _idxs = mode == 2 ? [0, data[i][0].length - 1] : getOuterIdxs(data[i]);
            s._paths = s.paths(self2, i, _idxs[0], _idxs[1]);
            if (ctxAlpha != 1)
              ctx.globalAlpha = ctxAlpha = 1;
          }
        }
      });
      series.forEach((s, i) => {
        if (i > 0 && s.show) {
          if (ctxAlpha != s.alpha)
            ctx.globalAlpha = ctxAlpha = s.alpha;
          s._paths != null && drawPath(i, false);
          {
            let _gaps = s._paths != null ? s._paths.gaps : null;
            let show = s.points.show(self2, i, i0, i1, _gaps);
            let idxs2 = s.points.filter(self2, i, show, _gaps);
            if (show || idxs2) {
              s.points._paths = s.points.paths(self2, i, i0, i1, idxs2);
              drawPath(i, true);
            }
          }
          if (ctxAlpha != 1)
            ctx.globalAlpha = ctxAlpha = 1;
          fire("drawSeries", i);
        }
      });
    }
  }
  function cacheStrokeFill(si, _points) {
    let s = _points ? series[si].points : series[si];
    s._stroke = s.stroke(self2, si);
    s._fill = s.fill(self2, si);
  }
  function drawPath(si, _points) {
    let s = _points ? series[si].points : series[si];
    let {
      stroke,
      fill,
      clip: gapsClip,
      flags,
      _stroke: strokeStyle = s._stroke,
      _fill: fillStyle = s._fill,
      _width: width = s.width
    } = s._paths;
    width = roundDec(width * pxRatio, 3);
    let boundsClip = null;
    let offset = width % 2 / 2;
    if (_points && fillStyle == null)
      fillStyle = width > 0 ? "#fff" : strokeStyle;
    let _pxAlign = s.pxAlign == 1 && offset > 0;
    _pxAlign && ctx.translate(offset, offset);
    if (!_points) {
      let lft = plotLft - width / 2, top = plotTop - width / 2, wid = plotWid + width, hgt = plotHgt + width;
      boundsClip = new Path2D;
      boundsClip.rect(lft, top, wid, hgt);
    }
    if (_points)
      strokeFill(strokeStyle, width, s.dash, s.cap, fillStyle, stroke, fill, flags, gapsClip);
    else
      fillStroke(si, strokeStyle, width, s.dash, s.cap, fillStyle, stroke, fill, flags, boundsClip, gapsClip);
    _pxAlign && ctx.translate(-offset, -offset);
  }
  function fillStroke(si, strokeStyle, lineWidth, lineDash, lineCap, fillStyle, strokePath, fillPath, flags, boundsClip, gapsClip) {
    let didStrokeFill = false;
    flags != 0 && bands.forEach((b2, bi) => {
      if (b2.series[0] == si) {
        let lowerEdge = series[b2.series[1]];
        let lowerData = data[b2.series[1]];
        let bandClip = (lowerEdge._paths || EMPTY_OBJ).band;
        if (isArr(bandClip))
          bandClip = b2.dir == 1 ? bandClip[0] : bandClip[1];
        let gapsClip2;
        let _fillStyle = null;
        if (lowerEdge.show && bandClip && hasData(lowerData, i0, i1)) {
          _fillStyle = b2.fill(self2, bi) || fillStyle;
          gapsClip2 = lowerEdge._paths.clip;
        } else
          bandClip = null;
        strokeFill(strokeStyle, lineWidth, lineDash, lineCap, _fillStyle, strokePath, fillPath, flags, boundsClip, gapsClip, gapsClip2, bandClip);
        didStrokeFill = true;
      }
    });
    if (!didStrokeFill)
      strokeFill(strokeStyle, lineWidth, lineDash, lineCap, fillStyle, strokePath, fillPath, flags, boundsClip, gapsClip);
  }
  const CLIP_FILL_STROKE = BAND_CLIP_FILL | BAND_CLIP_STROKE;
  function strokeFill(strokeStyle, lineWidth, lineDash, lineCap, fillStyle, strokePath, fillPath, flags, boundsClip, gapsClip, gapsClip2, bandClip) {
    setCtxStyle(strokeStyle, lineWidth, lineDash, lineCap, fillStyle);
    if (boundsClip || gapsClip || bandClip) {
      ctx.save();
      boundsClip && ctx.clip(boundsClip);
      gapsClip && ctx.clip(gapsClip);
    }
    if (bandClip) {
      if ((flags & CLIP_FILL_STROKE) == CLIP_FILL_STROKE) {
        ctx.clip(bandClip);
        gapsClip2 && ctx.clip(gapsClip2);
        doFill(fillStyle, fillPath);
        doStroke(strokeStyle, strokePath, lineWidth);
      } else if (flags & BAND_CLIP_STROKE) {
        doFill(fillStyle, fillPath);
        ctx.clip(bandClip);
        doStroke(strokeStyle, strokePath, lineWidth);
      } else if (flags & BAND_CLIP_FILL) {
        ctx.save();
        ctx.clip(bandClip);
        gapsClip2 && ctx.clip(gapsClip2);
        doFill(fillStyle, fillPath);
        ctx.restore();
        doStroke(strokeStyle, strokePath, lineWidth);
      }
    } else {
      doFill(fillStyle, fillPath);
      doStroke(strokeStyle, strokePath, lineWidth);
    }
    if (boundsClip || gapsClip || bandClip)
      ctx.restore();
  }
  function doStroke(strokeStyle, strokePath, lineWidth) {
    if (lineWidth > 0) {
      if (strokePath instanceof Map) {
        strokePath.forEach((strokePath2, strokeStyle2) => {
          ctx.strokeStyle = ctxStroke = strokeStyle2;
          ctx.stroke(strokePath2);
        });
      } else
        strokePath != null && strokeStyle && ctx.stroke(strokePath);
    }
  }
  function doFill(fillStyle, fillPath) {
    if (fillPath instanceof Map) {
      fillPath.forEach((fillPath2, fillStyle2) => {
        ctx.fillStyle = ctxFill = fillStyle2;
        ctx.fill(fillPath2);
      });
    } else
      fillPath != null && fillStyle && ctx.fill(fillPath);
  }
  function getIncrSpace(axisIdx, min, max, fullDim) {
    let axis = axes[axisIdx];
    let incrSpace;
    if (fullDim <= 0)
      incrSpace = [0, 0];
    else {
      let minSpace = axis._space = axis.space(self2, axisIdx, min, max, fullDim);
      let incrs = axis._incrs = axis.incrs(self2, axisIdx, min, max, fullDim, minSpace);
      incrSpace = findIncr(min, max, incrs, fullDim, minSpace);
    }
    return axis._found = incrSpace;
  }
  function drawOrthoLines(offs, filts, ori, side, pos0, len, width, stroke, dash, cap) {
    let offset = width % 2 / 2;
    pxAlign == 1 && ctx.translate(offset, offset);
    setCtxStyle(stroke, width, dash, cap, stroke);
    ctx.beginPath();
    let x0, y0, x1, y1, pos1 = pos0 + (side == 0 || side == 3 ? -len : len);
    if (ori == 0) {
      y0 = pos0;
      y1 = pos1;
    } else {
      x0 = pos0;
      x1 = pos1;
    }
    for (let i = 0;i < offs.length; i++) {
      if (filts[i] != null) {
        if (ori == 0)
          x0 = x1 = offs[i];
        else
          y0 = y1 = offs[i];
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
      }
    }
    ctx.stroke();
    pxAlign == 1 && ctx.translate(-offset, -offset);
  }
  function axesCalc(cycleNum) {
    let converged = true;
    axes.forEach((axis, i) => {
      if (!axis.show)
        return;
      let scale = scales[axis.scale];
      if (scale.min == null) {
        if (axis._show) {
          converged = false;
          axis._show = false;
          resetYSeries(false);
        }
        return;
      } else {
        if (!axis._show) {
          converged = false;
          axis._show = true;
          resetYSeries(false);
        }
      }
      let side = axis.side;
      let ori = side % 2;
      let { min, max } = scale;
      let [_incr, _space] = getIncrSpace(i, min, max, ori == 0 ? plotWidCss : plotHgtCss);
      if (_space == 0)
        return;
      let forceMin = scale.distr == 2;
      let _splits = axis._splits = axis.splits(self2, i, min, max, _incr, _space, forceMin);
      let splits = scale.distr == 2 ? _splits.map((i2) => data0[i2]) : _splits;
      let incr = scale.distr == 2 ? data0[_splits[1]] - data0[_splits[0]] : _incr;
      let values = axis._values = axis.values(self2, axis.filter(self2, splits, i, _space, incr), i, _space, incr);
      axis._rotate = side == 2 ? axis.rotate(self2, values, i, _space) : 0;
      let oldSize = axis._size;
      axis._size = ceil(axis.size(self2, values, i, cycleNum));
      if (oldSize != null && axis._size != oldSize)
        converged = false;
    });
    return converged;
  }
  function paddingCalc(cycleNum) {
    let converged = true;
    padding.forEach((p2, i) => {
      let _p = p2(self2, i, sidesWithAxes, cycleNum);
      if (_p != _padding[i])
        converged = false;
      _padding[i] = _p;
    });
    return converged;
  }
  function drawAxesGrid() {
    for (let i = 0;i < axes.length; i++) {
      let axis = axes[i];
      if (!axis.show || !axis._show)
        continue;
      let side = axis.side;
      let ori = side % 2;
      let x3, y2;
      let fillStyle = axis.stroke(self2, i);
      let shiftDir = side == 0 || side == 3 ? -1 : 1;
      if (axis.label) {
        let shiftAmt2 = axis.labelGap * shiftDir;
        let baseLpos = round((axis._lpos + shiftAmt2) * pxRatio);
        setFontStyle(axis.labelFont[0], fillStyle, "center", side == 2 ? TOP : BOTTOM);
        ctx.save();
        if (ori == 1) {
          x3 = y2 = 0;
          ctx.translate(baseLpos, round(plotTop + plotHgt / 2));
          ctx.rotate((side == 3 ? -PI : PI) / 2);
        } else {
          x3 = round(plotLft + plotWid / 2);
          y2 = baseLpos;
        }
        ctx.fillText(axis.label, x3, y2);
        ctx.restore();
      }
      let [_incr, _space] = axis._found;
      if (_space == 0)
        continue;
      let scale = scales[axis.scale];
      let plotDim = ori == 0 ? plotWid : plotHgt;
      let plotOff = ori == 0 ? plotLft : plotTop;
      let axisGap = round(axis.gap * pxRatio);
      let _splits = axis._splits;
      let splits = scale.distr == 2 ? _splits.map((i2) => data0[i2]) : _splits;
      let incr = scale.distr == 2 ? data0[_splits[1]] - data0[_splits[0]] : _incr;
      let ticks = axis.ticks;
      let border = axis.border;
      let tickSize = ticks.show ? round(ticks.size * pxRatio) : 0;
      let angle = axis._rotate * -PI / 180;
      let basePos = pxRound(axis._pos * pxRatio);
      let shiftAmt = (tickSize + axisGap) * shiftDir;
      let finalPos = basePos + shiftAmt;
      y2 = ori == 0 ? finalPos : 0;
      x3 = ori == 1 ? finalPos : 0;
      let font = axis.font[0];
      let textAlign = axis.align == 1 ? LEFT : axis.align == 2 ? RIGHT : angle > 0 ? LEFT : angle < 0 ? RIGHT : ori == 0 ? "center" : side == 3 ? RIGHT : LEFT;
      let textBaseline = angle || ori == 1 ? "middle" : side == 2 ? TOP : BOTTOM;
      setFontStyle(font, fillStyle, textAlign, textBaseline);
      let lineHeight = axis.font[1] * axis.lineGap;
      let canOffs = _splits.map((val) => pxRound(getPos(val, scale, plotDim, plotOff)));
      let _values = axis._values;
      for (let i2 = 0;i2 < _values.length; i2++) {
        let val = _values[i2];
        if (val != null) {
          if (ori == 0)
            x3 = canOffs[i2];
          else
            y2 = canOffs[i2];
          val = "" + val;
          let _parts = val.indexOf("\n") == -1 ? [val] : val.split(/\n/gm);
          for (let j2 = 0;j2 < _parts.length; j2++) {
            let text = _parts[j2];
            if (angle) {
              ctx.save();
              ctx.translate(x3, y2 + j2 * lineHeight);
              ctx.rotate(angle);
              ctx.fillText(text, 0, 0);
              ctx.restore();
            } else
              ctx.fillText(text, x3, y2 + j2 * lineHeight);
          }
        }
      }
      if (ticks.show) {
        drawOrthoLines(canOffs, ticks.filter(self2, splits, i, _space, incr), ori, side, basePos, tickSize, roundDec(ticks.width * pxRatio, 3), ticks.stroke(self2, i), ticks.dash, ticks.cap);
      }
      let grid = axis.grid;
      if (grid.show) {
        drawOrthoLines(canOffs, grid.filter(self2, splits, i, _space, incr), ori, ori == 0 ? 2 : 1, ori == 0 ? plotTop : plotLft, ori == 0 ? plotHgt : plotWid, roundDec(grid.width * pxRatio, 3), grid.stroke(self2, i), grid.dash, grid.cap);
      }
      if (border.show) {
        drawOrthoLines([basePos], [1], ori == 0 ? 1 : 0, ori == 0 ? 1 : 2, ori == 1 ? plotTop : plotLft, ori == 1 ? plotHgt : plotWid, roundDec(border.width * pxRatio, 3), border.stroke(self2, i), border.dash, border.cap);
      }
    }
    fire("drawAxes");
  }
  function resetYSeries(minMax) {
    series.forEach((s, i) => {
      if (i > 0) {
        s._paths = null;
        if (minMax) {
          if (mode == 1) {
            s.min = null;
            s.max = null;
          } else {
            s.facets.forEach((f) => {
              f.min = null;
              f.max = null;
            });
          }
        }
      }
    });
  }
  let queuedCommit = false;
  let deferHooks = false;
  let hooksQueue = [];
  function flushHooks() {
    deferHooks = false;
    for (let i = 0;i < hooksQueue.length; i++)
      fire(...hooksQueue[i]);
    hooksQueue.length = 0;
  }
  function commit() {
    if (!queuedCommit) {
      microTask(_commit);
      queuedCommit = true;
    }
  }
  function batch(fn, _deferHooks = false) {
    queuedCommit = true;
    deferHooks = _deferHooks;
    fn(self2);
    _commit();
    if (_deferHooks && hooksQueue.length > 0)
      queueMicrotask(flushHooks);
  }
  self2.batch = batch;
  function _commit() {
    if (shouldSetScales) {
      setScales();
      shouldSetScales = false;
    }
    if (shouldConvergeSize) {
      convergeSize();
      shouldConvergeSize = false;
    }
    if (shouldSetSize) {
      setStylePx(under, LEFT, plotLftCss);
      setStylePx(under, TOP, plotTopCss);
      setStylePx(under, WIDTH, plotWidCss);
      setStylePx(under, HEIGHT, plotHgtCss);
      setStylePx(over, LEFT, plotLftCss);
      setStylePx(over, TOP, plotTopCss);
      setStylePx(over, WIDTH, plotWidCss);
      setStylePx(over, HEIGHT, plotHgtCss);
      setStylePx(wrap2, WIDTH, fullWidCss);
      setStylePx(wrap2, HEIGHT, fullHgtCss);
      can.width = round(fullWidCss * pxRatio);
      can.height = round(fullHgtCss * pxRatio);
      axes.forEach(({ _el, _show, _size, _pos, side }) => {
        if (_el != null) {
          if (_show) {
            let posOffset = side === 3 || side === 0 ? _size : 0;
            let isVt = side % 2 == 1;
            setStylePx(_el, isVt ? "left" : "top", _pos - posOffset);
            setStylePx(_el, isVt ? "width" : "height", _size);
            setStylePx(_el, isVt ? "top" : "left", isVt ? plotTopCss : plotLftCss);
            setStylePx(_el, isVt ? "height" : "width", isVt ? plotHgtCss : plotWidCss);
            remClass(_el, OFF);
          } else
            addClass(_el, OFF);
        }
      });
      ctxStroke = ctxFill = ctxWidth = ctxJoin = ctxCap = ctxFont = ctxAlign = ctxBaseline = ctxDash = null;
      ctxAlpha = 1;
      syncRect(true);
      if (plotLftCss != _plotLftCss || plotTopCss != _plotTopCss || plotWidCss != _plotWidCss || plotHgtCss != _plotHgtCss) {
        resetYSeries(false);
        let pctWid = plotWidCss / _plotWidCss;
        let pctHgt = plotHgtCss / _plotHgtCss;
        if (cursor.show && !shouldSetCursor && cursor.left >= 0) {
          cursor.left *= pctWid;
          cursor.top *= pctHgt;
          vCursor && elTrans(vCursor, round(cursor.left), 0, plotWidCss, plotHgtCss);
          hCursor && elTrans(hCursor, 0, round(cursor.top), plotWidCss, plotHgtCss);
          for (let i = 1;i < cursorPts.length; i++) {
            cursorPtsLft[i] *= pctWid;
            cursorPtsTop[i] *= pctHgt;
            elTrans(cursorPts[i], incrRoundUp(cursorPtsLft[i], 1), incrRoundUp(cursorPtsTop[i], 1), plotWidCss, plotHgtCss);
          }
        }
        if (select.show && !shouldSetSelect && select.left >= 0 && select.width > 0) {
          select.left *= pctWid;
          select.width *= pctWid;
          select.top *= pctHgt;
          select.height *= pctHgt;
          for (let prop in _hideProps)
            setStylePx(selectDiv, prop, select[prop]);
        }
        _plotLftCss = plotLftCss;
        _plotTopCss = plotTopCss;
        _plotWidCss = plotWidCss;
        _plotHgtCss = plotHgtCss;
      }
      fire("setSize");
      shouldSetSize = false;
    }
    if (fullWidCss > 0 && fullHgtCss > 0) {
      ctx.clearRect(0, 0, can.width, can.height);
      fire("drawClear");
      drawOrder.forEach((fn) => fn());
      fire("draw");
    }
    if (select.show && shouldSetSelect) {
      setSelect(select);
      shouldSetSelect = false;
    }
    if (cursor.show && shouldSetCursor) {
      updateCursor(null, true, false);
      shouldSetCursor = false;
    }
    if (legend.show && legend.live && shouldSetLegend) {
      setLegend();
      shouldSetLegend = false;
    }
    if (!ready) {
      ready = true;
      self2.status = 1;
      fire("ready");
    }
    viaAutoScaleX = false;
    queuedCommit = false;
  }
  self2.redraw = (rebuildPaths, recalcAxes) => {
    shouldConvergeSize = recalcAxes || false;
    if (rebuildPaths !== false)
      _setScale(xScaleKey, scaleX.min, scaleX.max);
    else
      commit();
  };
  function setScale(key2, opts2) {
    let sc2 = scales[key2];
    if (sc2.from == null) {
      if (dataLen == 0) {
        let minMax = sc2.range(self2, opts2.min, opts2.max, key2);
        opts2.min = minMax[0];
        opts2.max = minMax[1];
      }
      if (opts2.min > opts2.max) {
        let _min = opts2.min;
        opts2.min = opts2.max;
        opts2.max = _min;
      }
      if (dataLen > 1 && opts2.min != null && opts2.max != null && opts2.max - opts2.min < 0.0000000000000001)
        return;
      if (key2 == xScaleKey) {
        if (sc2.distr == 2 && dataLen > 0) {
          opts2.min = closestIdx(opts2.min, data[0]);
          opts2.max = closestIdx(opts2.max, data[0]);
          if (opts2.min == opts2.max)
            opts2.max++;
        }
      }
      pendScales[key2] = opts2;
      shouldSetScales = true;
      commit();
    }
  }
  self2.setScale = setScale;
  let xCursor;
  let yCursor;
  let vCursor;
  let hCursor;
  let rawMouseLeft0;
  let rawMouseTop0;
  let mouseLeft0;
  let mouseTop0;
  let rawMouseLeft1;
  let rawMouseTop1;
  let mouseLeft1;
  let mouseTop1;
  let dragging = false;
  const drag = cursor.drag;
  let dragX = drag.x;
  let dragY = drag.y;
  if (cursor.show) {
    if (cursor.x)
      xCursor = placeDiv(CURSOR_X, over);
    if (cursor.y)
      yCursor = placeDiv(CURSOR_Y, over);
    if (scaleX.ori == 0) {
      vCursor = xCursor;
      hCursor = yCursor;
    } else {
      vCursor = yCursor;
      hCursor = xCursor;
    }
    mouseLeft1 = cursor.left;
    mouseTop1 = cursor.top;
  }
  const select = self2.select = assign({
    show: true,
    over: true,
    left: 0,
    width: 0,
    top: 0,
    height: 0
  }, opts.select);
  const selectDiv = select.show ? placeDiv(SELECT, select.over ? over : under) : null;
  function setSelect(opts2, _fire) {
    if (select.show) {
      for (let prop in opts2) {
        select[prop] = opts2[prop];
        if (prop in _hideProps)
          setStylePx(selectDiv, prop, opts2[prop]);
      }
      _fire !== false && fire("setSelect");
    }
  }
  self2.setSelect = setSelect;
  function toggleDOM(i, onOff) {
    let s = series[i];
    let label = showLegend ? legendRows[i] : null;
    if (s.show)
      label && remClass(label, OFF);
    else {
      label && addClass(label, OFF);
      cursorPts.length > 1 && elTrans(cursorPts[i], -10, -10, plotWidCss, plotHgtCss);
    }
  }
  function _setScale(key2, min, max) {
    setScale(key2, { min, max });
  }
  function setSeries(i, opts2, _fire, _pub) {
    if (opts2.focus != null)
      setFocus(i);
    if (opts2.show != null) {
      series.forEach((s, si) => {
        if (si > 0 && (i == si || i == null)) {
          s.show = opts2.show;
          toggleDOM(si, opts2.show);
          if (mode == 2) {
            _setScale(s.facets[0].scale, null, null);
            _setScale(s.facets[1].scale, null, null);
          } else
            _setScale(s.scale, null, null);
          commit();
        }
      });
    }
    _fire !== false && fire("setSeries", i, opts2);
    _pub && pubSync("setSeries", self2, i, opts2);
  }
  self2.setSeries = setSeries;
  function setBand(bi, opts2) {
    assign(bands[bi], opts2);
  }
  function addBand(opts2, bi) {
    opts2.fill = fnOrSelf(opts2.fill || null);
    opts2.dir = ifNull(opts2.dir, -1);
    bi = bi == null ? bands.length : bi;
    bands.splice(bi, 0, opts2);
  }
  function delBand(bi) {
    if (bi == null)
      bands.length = 0;
    else
      bands.splice(bi, 1);
  }
  self2.addBand = addBand;
  self2.setBand = setBand;
  self2.delBand = delBand;
  function setAlpha(i, value) {
    series[i].alpha = value;
    if (cursor.show && cursorPts[i])
      cursorPts[i].style.opacity = value;
    if (showLegend && legendRows[i])
      legendRows[i].style.opacity = value;
  }
  let closestDist;
  let closestSeries;
  let focusedSeries;
  const FOCUS_TRUE = { focus: true };
  function setFocus(i) {
    if (i != focusedSeries) {
      let allFocused = i == null;
      let _setAlpha = focus.alpha != 1;
      series.forEach((s, i2) => {
        if (mode == 1 || i2 > 0) {
          let isFocused = allFocused || i2 == 0 || i2 == i;
          s._focus = allFocused ? null : isFocused;
          _setAlpha && setAlpha(i2, isFocused ? 1 : focus.alpha);
        }
      });
      focusedSeries = i;
      _setAlpha && commit();
    }
  }
  if (showLegend && cursorFocus) {
    onMouse(mouseleave, legendTable, (e) => {
      if (cursor._lock)
        return;
      setCursorEvent(e);
      if (focusedSeries != null)
        setSeries(null, FOCUS_TRUE, true, syncOpts.setSeries);
    });
  }
  function posToVal(pos, scale, can2) {
    let sc2 = scales[scale];
    if (can2)
      pos = pos / pxRatio - (sc2.ori == 1 ? plotTopCss : plotLftCss);
    let dim = plotWidCss;
    if (sc2.ori == 1) {
      dim = plotHgtCss;
      pos = dim - pos;
    }
    if (sc2.dir == -1)
      pos = dim - pos;
    let { _min, _max } = sc2, pct = pos / dim;
    let sv = _min + (_max - _min) * pct;
    let distr = sc2.distr;
    return distr == 3 ? pow(10, sv) : distr == 4 ? sinh(sv, sc2.asinh) : sv;
  }
  function closestIdxFromXpos(pos, can2) {
    let v3 = posToVal(pos, xScaleKey, can2);
    return closestIdx(v3, data[0], i0, i1);
  }
  self2.valToIdx = (val) => closestIdx(val, data[0]);
  self2.posToIdx = closestIdxFromXpos;
  self2.posToVal = posToVal;
  self2.valToPos = (val, scale, can2) => scales[scale].ori == 0 ? getHPos(val, scales[scale], can2 ? plotWid : plotWidCss, can2 ? plotLft : 0) : getVPos(val, scales[scale], can2 ? plotHgt : plotHgtCss, can2 ? plotTop : 0);
  self2.setCursor = (opts2, _fire, _pub) => {
    mouseLeft1 = opts2.left;
    mouseTop1 = opts2.top;
    updateCursor(null, _fire, _pub);
  };
  function setSelH(off2, dim) {
    setStylePx(selectDiv, LEFT, select.left = off2);
    setStylePx(selectDiv, WIDTH, select.width = dim);
  }
  function setSelV(off2, dim) {
    setStylePx(selectDiv, TOP, select.top = off2);
    setStylePx(selectDiv, HEIGHT, select.height = dim);
  }
  let setSelX = scaleX.ori == 0 ? setSelH : setSelV;
  let setSelY = scaleX.ori == 1 ? setSelH : setSelV;
  function syncLegend() {
    if (showLegend && legend.live) {
      for (let i = mode == 2 ? 1 : 0;i < series.length; i++) {
        if (i == 0 && multiValLegend)
          continue;
        let vals = legend.values[i];
        let j2 = 0;
        for (let k3 in vals)
          legendCells[i][j2++].firstChild.nodeValue = vals[k3];
      }
    }
  }
  function setLegend(opts2, _fire) {
    if (opts2 != null) {
      if (opts2.idxs) {
        opts2.idxs.forEach((didx, sidx) => {
          activeIdxs[sidx] = didx;
        });
      } else if (!isUndef(opts2.idx))
        activeIdxs.fill(opts2.idx);
      legend.idx = activeIdxs[0];
    }
    for (let sidx = 0;sidx < series.length; sidx++) {
      if (sidx > 0 || mode == 1 && !multiValLegend)
        setLegendValues(sidx, activeIdxs[sidx]);
    }
    if (showLegend && legend.live)
      syncLegend();
    shouldSetLegend = false;
    _fire !== false && fire("setLegend");
  }
  self2.setLegend = setLegend;
  function setLegendValues(sidx, idx) {
    let s = series[sidx];
    let src = sidx == 0 && xScaleDistr == 2 ? data0 : data[sidx];
    let val;
    if (multiValLegend)
      val = s.values(self2, sidx, idx) ?? NULL_LEGEND_VALUES;
    else {
      val = s.value(self2, idx == null ? null : src[idx], sidx, idx);
      val = val == null ? NULL_LEGEND_VALUES : { _: val };
    }
    legend.values[sidx] = val;
  }
  function updateCursor(src, _fire, _pub) {
    rawMouseLeft1 = mouseLeft1;
    rawMouseTop1 = mouseTop1;
    [mouseLeft1, mouseTop1] = cursor.move(self2, mouseLeft1, mouseTop1);
    cursor.left = mouseLeft1;
    cursor.top = mouseTop1;
    if (cursor.show) {
      vCursor && elTrans(vCursor, round(mouseLeft1), 0, plotWidCss, plotHgtCss);
      hCursor && elTrans(hCursor, 0, round(mouseTop1), plotWidCss, plotHgtCss);
    }
    let idx;
    let noDataInRange = i0 > i1;
    closestDist = inf;
    let xDim = scaleX.ori == 0 ? plotWidCss : plotHgtCss;
    let yDim = scaleX.ori == 1 ? plotWidCss : plotHgtCss;
    if (mouseLeft1 < 0 || dataLen == 0 || noDataInRange) {
      idx = cursor.idx = null;
      for (let i = 0;i < series.length; i++) {
        if (i > 0) {
          cursorPts.length > 1 && elTrans(cursorPts[i], -10, -10, plotWidCss, plotHgtCss);
        }
      }
      if (cursorFocus)
        setSeries(null, FOCUS_TRUE, true, src == null && syncOpts.setSeries);
      if (legend.live) {
        activeIdxs.fill(idx);
        shouldSetLegend = true;
      }
    } else {
      let mouseXPos, valAtPosX, xPos;
      if (mode == 1) {
        mouseXPos = scaleX.ori == 0 ? mouseLeft1 : mouseTop1;
        valAtPosX = posToVal(mouseXPos, xScaleKey);
        idx = cursor.idx = closestIdx(valAtPosX, data[0], i0, i1);
        xPos = valToPosX(data[0][idx], scaleX, xDim, 0);
      }
      for (let i = mode == 2 ? 1 : 0;i < series.length; i++) {
        let s = series[i];
        let idx1 = activeIdxs[i];
        let yVal1 = idx1 == null ? null : mode == 1 ? data[i][idx1] : data[i][1][idx1];
        let idx2 = cursor.dataIdx(self2, i, idx, valAtPosX);
        let yVal2 = idx2 == null ? null : mode == 1 ? data[i][idx2] : data[i][1][idx2];
        shouldSetLegend = shouldSetLegend || yVal2 != yVal1 || idx2 != idx1;
        activeIdxs[i] = idx2;
        let xPos2 = idx2 == idx ? xPos : valToPosX(mode == 1 ? data[0][idx2] : data[i][0][idx2], scaleX, xDim, 0);
        if (i > 0 && s.show) {
          let yPos = yVal2 == null ? -10 : valToPosY(yVal2, mode == 1 ? scales[s.scale] : scales[s.facets[1].scale], yDim, 0);
          if (cursorFocus && yVal2 != null) {
            let mouseYPos = scaleX.ori == 1 ? mouseLeft1 : mouseTop1;
            let dist = abs(focus.dist(self2, i, idx2, yPos, mouseYPos));
            if (dist < closestDist) {
              let bias = focus.bias;
              if (bias != 0) {
                let mouseYVal = posToVal(mouseYPos, s.scale);
                let seriesYValSign = yVal2 >= 0 ? 1 : -1;
                let mouseYValSign = mouseYVal >= 0 ? 1 : -1;
                if (mouseYValSign == seriesYValSign && (mouseYValSign == 1 ? bias == 1 ? yVal2 >= mouseYVal : yVal2 <= mouseYVal : bias == 1 ? yVal2 <= mouseYVal : yVal2 >= mouseYVal)) {
                  closestDist = dist;
                  closestSeries = i;
                }
              } else {
                closestDist = dist;
                closestSeries = i;
              }
            }
          }
          let hPos, vPos;
          if (scaleX.ori == 0) {
            hPos = xPos2;
            vPos = yPos;
          } else {
            hPos = yPos;
            vPos = xPos2;
          }
          if (shouldSetLegend && cursorPts.length > 1) {
            elColor(cursorPts[i], cursor.points.fill(self2, i), cursor.points.stroke(self2, i));
            let ptWid, ptHgt, ptLft, ptTop, centered = true, getBBox = cursor.points.bbox;
            if (getBBox != null) {
              centered = false;
              let bbox = getBBox(self2, i);
              ptLft = bbox.left;
              ptTop = bbox.top;
              ptWid = bbox.width;
              ptHgt = bbox.height;
            } else {
              ptLft = hPos;
              ptTop = vPos;
              ptWid = ptHgt = cursor.points.size(self2, i);
            }
            elSize(cursorPts[i], ptWid, ptHgt, centered);
            cursorPtsLft[i] = ptLft;
            cursorPtsTop[i] = ptTop;
            elTrans(cursorPts[i], incrRoundUp(ptLft, 1), incrRoundUp(ptTop, 1), plotWidCss, plotHgtCss);
          }
        }
      }
    }
    if (select.show && dragging) {
      if (src != null) {
        let [xKey, yKey] = syncOpts.scales;
        let [matchXKeys, matchYKeys] = syncOpts.match;
        let [xKeySrc, yKeySrc] = src.cursor.sync.scales;
        let sdrag = src.cursor.drag;
        dragX = sdrag._x;
        dragY = sdrag._y;
        if (dragX || dragY) {
          let { left, top, width, height } = src.select;
          let sori = src.scales[xKey].ori;
          let sPosToVal = src.posToVal;
          let sOff, sDim, sc2, a, b2;
          let matchingX = xKey != null && matchXKeys(xKey, xKeySrc);
          let matchingY = yKey != null && matchYKeys(yKey, yKeySrc);
          if (matchingX && dragX) {
            if (sori == 0) {
              sOff = left;
              sDim = width;
            } else {
              sOff = top;
              sDim = height;
            }
            sc2 = scales[xKey];
            a = valToPosX(sPosToVal(sOff, xKeySrc), sc2, xDim, 0);
            b2 = valToPosX(sPosToVal(sOff + sDim, xKeySrc), sc2, xDim, 0);
            setSelX(min(a, b2), abs(b2 - a));
          } else
            setSelX(0, xDim);
          if (matchingY && dragY) {
            if (sori == 1) {
              sOff = left;
              sDim = width;
            } else {
              sOff = top;
              sDim = height;
            }
            sc2 = scales[yKey];
            a = valToPosY(sPosToVal(sOff, yKeySrc), sc2, yDim, 0);
            b2 = valToPosY(sPosToVal(sOff + sDim, yKeySrc), sc2, yDim, 0);
            setSelY(min(a, b2), abs(b2 - a));
          } else
            setSelY(0, yDim);
        } else
          hideSelect();
      } else {
        let rawDX = abs(rawMouseLeft1 - rawMouseLeft0);
        let rawDY = abs(rawMouseTop1 - rawMouseTop0);
        if (scaleX.ori == 1) {
          let _rawDX = rawDX;
          rawDX = rawDY;
          rawDY = _rawDX;
        }
        dragX = drag.x && rawDX >= drag.dist;
        dragY = drag.y && rawDY >= drag.dist;
        let uni = drag.uni;
        if (uni != null) {
          if (dragX && dragY) {
            dragX = rawDX >= uni;
            dragY = rawDY >= uni;
            if (!dragX && !dragY) {
              if (rawDY > rawDX)
                dragY = true;
              else
                dragX = true;
            }
          }
        } else if (drag.x && drag.y && (dragX || dragY))
          dragX = dragY = true;
        let p0, p1;
        if (dragX) {
          if (scaleX.ori == 0) {
            p0 = mouseLeft0;
            p1 = mouseLeft1;
          } else {
            p0 = mouseTop0;
            p1 = mouseTop1;
          }
          setSelX(min(p0, p1), abs(p1 - p0));
          if (!dragY)
            setSelY(0, yDim);
        }
        if (dragY) {
          if (scaleX.ori == 1) {
            p0 = mouseLeft0;
            p1 = mouseLeft1;
          } else {
            p0 = mouseTop0;
            p1 = mouseTop1;
          }
          setSelY(min(p0, p1), abs(p1 - p0));
          if (!dragX)
            setSelX(0, xDim);
        }
        if (!dragX && !dragY) {
          setSelX(0, 0);
          setSelY(0, 0);
        }
      }
    }
    drag._x = dragX;
    drag._y = dragY;
    if (src == null) {
      if (_pub) {
        if (syncKey != null) {
          let [xSyncKey, ySyncKey] = syncOpts.scales;
          syncOpts.values[0] = xSyncKey != null ? posToVal(scaleX.ori == 0 ? mouseLeft1 : mouseTop1, xSyncKey) : null;
          syncOpts.values[1] = ySyncKey != null ? posToVal(scaleX.ori == 1 ? mouseLeft1 : mouseTop1, ySyncKey) : null;
        }
        pubSync(mousemove, self2, mouseLeft1, mouseTop1, plotWidCss, plotHgtCss, idx);
      }
      if (cursorFocus) {
        let shouldPub = _pub && syncOpts.setSeries;
        let p2 = focus.prox;
        if (focusedSeries == null) {
          if (closestDist <= p2)
            setSeries(closestSeries, FOCUS_TRUE, true, shouldPub);
        } else {
          if (closestDist > p2)
            setSeries(null, FOCUS_TRUE, true, shouldPub);
          else if (closestSeries != focusedSeries)
            setSeries(closestSeries, FOCUS_TRUE, true, shouldPub);
        }
      }
    }
    if (shouldSetLegend) {
      legend.idx = idx;
      setLegend();
    }
    _fire !== false && fire("setCursor");
  }
  let rect2 = null;
  Object.defineProperty(self2, "rect", {
    get() {
      if (rect2 == null)
        syncRect(false);
      return rect2;
    }
  });
  function syncRect(defer = false) {
    if (defer)
      rect2 = null;
    else {
      rect2 = over.getBoundingClientRect();
      fire("syncRect", rect2);
    }
  }
  function mouseMove(e, src, _l, _t, _w, _h, _i) {
    if (cursor._lock)
      return;
    if (dragging && e != null && e.movementX == 0 && e.movementY == 0)
      return;
    cacheMouse(e, src, _l, _t, _w, _h, _i, false, e != null);
    if (e != null)
      updateCursor(null, true, true);
    else
      updateCursor(src, true, false);
  }
  function cacheMouse(e, src, _l, _t, _w, _h, _i, initial, snap) {
    if (rect2 == null)
      syncRect(false);
    setCursorEvent(e);
    if (e != null) {
      _l = e.clientX - rect2.left;
      _t = e.clientY - rect2.top;
    } else {
      if (_l < 0 || _t < 0) {
        mouseLeft1 = -10;
        mouseTop1 = -10;
        return;
      }
      let [xKey, yKey] = syncOpts.scales;
      let syncOptsSrc = src.cursor.sync;
      let [xValSrc, yValSrc] = syncOptsSrc.values;
      let [xKeySrc, yKeySrc] = syncOptsSrc.scales;
      let [matchXKeys, matchYKeys] = syncOpts.match;
      let rotSrc = src.axes[0].side % 2 == 1;
      let xDim = scaleX.ori == 0 ? plotWidCss : plotHgtCss, yDim = scaleX.ori == 1 ? plotWidCss : plotHgtCss, _xDim = rotSrc ? _h : _w, _yDim = rotSrc ? _w : _h, _xPos = rotSrc ? _t : _l, _yPos = rotSrc ? _l : _t;
      if (xKeySrc != null)
        _l = matchXKeys(xKey, xKeySrc) ? getPos(xValSrc, scales[xKey], xDim, 0) : -10;
      else
        _l = xDim * (_xPos / _xDim);
      if (yKeySrc != null)
        _t = matchYKeys(yKey, yKeySrc) ? getPos(yValSrc, scales[yKey], yDim, 0) : -10;
      else
        _t = yDim * (_yPos / _yDim);
      if (scaleX.ori == 1) {
        let __l = _l;
        _l = _t;
        _t = __l;
      }
    }
    if (snap) {
      if (_l <= 1 || _l >= plotWidCss - 1)
        _l = incrRound(_l, plotWidCss);
      if (_t <= 1 || _t >= plotHgtCss - 1)
        _t = incrRound(_t, plotHgtCss);
    }
    if (initial) {
      rawMouseLeft0 = _l;
      rawMouseTop0 = _t;
      [mouseLeft0, mouseTop0] = cursor.move(self2, _l, _t);
    } else {
      mouseLeft1 = _l;
      mouseTop1 = _t;
    }
  }
  const _hideProps = {
    width: 0,
    height: 0,
    left: 0,
    top: 0
  };
  function hideSelect() {
    setSelect(_hideProps, false);
  }
  let downSelectLeft;
  let downSelectTop;
  let downSelectWidth;
  let downSelectHeight;
  function mouseDown(e, src, _l, _t, _w, _h, _i) {
    dragging = true;
    dragX = dragY = drag._x = drag._y = false;
    cacheMouse(e, src, _l, _t, _w, _h, _i, true, false);
    if (e != null) {
      onMouse(mouseup, doc2, mouseUp, false);
      pubSync(mousedown, self2, mouseLeft0, mouseTop0, plotWidCss, plotHgtCss, null);
    }
    let { left, top, width, height } = select;
    downSelectLeft = left;
    downSelectTop = top;
    downSelectWidth = width;
    downSelectHeight = height;
    hideSelect();
  }
  function mouseUp(e, src, _l, _t, _w, _h, _i) {
    dragging = drag._x = drag._y = false;
    cacheMouse(e, src, _l, _t, _w, _h, _i, false, true);
    let { left, top, width, height } = select;
    let hasSelect = width > 0 || height > 0;
    let chgSelect = downSelectLeft != left || downSelectTop != top || downSelectWidth != width || downSelectHeight != height;
    hasSelect && chgSelect && setSelect(select);
    if (drag.setScale && hasSelect && chgSelect) {
      let xOff = left, xDim = width, yOff = top, yDim = height;
      if (scaleX.ori == 1) {
        xOff = top, xDim = height, yOff = left, yDim = width;
      }
      if (dragX) {
        _setScale(xScaleKey, posToVal(xOff, xScaleKey), posToVal(xOff + xDim, xScaleKey));
      }
      if (dragY) {
        for (let k3 in scales) {
          let sc2 = scales[k3];
          if (k3 != xScaleKey && sc2.from == null && sc2.min != inf) {
            _setScale(k3, posToVal(yOff + yDim, k3), posToVal(yOff, k3));
          }
        }
      }
      hideSelect();
    } else if (cursor.lock) {
      cursor._lock = !cursor._lock;
      if (!cursor._lock)
        updateCursor(null, true, false);
    }
    if (e != null) {
      offMouse(mouseup, doc2);
      pubSync(mouseup, self2, mouseLeft1, mouseTop1, plotWidCss, plotHgtCss, null);
    }
  }
  function mouseLeave(e, src, _l, _t, _w, _h, _i) {
    if (cursor._lock)
      return;
    setCursorEvent(e);
    let _dragging = dragging;
    if (dragging) {
      let snapH = true;
      let snapV = true;
      let snapProx = 10;
      let dragH, dragV;
      if (scaleX.ori == 0) {
        dragH = dragX;
        dragV = dragY;
      } else {
        dragH = dragY;
        dragV = dragX;
      }
      if (dragH && dragV) {
        snapH = mouseLeft1 <= snapProx || mouseLeft1 >= plotWidCss - snapProx;
        snapV = mouseTop1 <= snapProx || mouseTop1 >= plotHgtCss - snapProx;
      }
      if (dragH && snapH)
        mouseLeft1 = mouseLeft1 < mouseLeft0 ? 0 : plotWidCss;
      if (dragV && snapV)
        mouseTop1 = mouseTop1 < mouseTop0 ? 0 : plotHgtCss;
      updateCursor(null, true, true);
      dragging = false;
    }
    mouseLeft1 = -10;
    mouseTop1 = -10;
    updateCursor(null, true, true);
    if (_dragging)
      dragging = _dragging;
  }
  function dblClick(e, src, _l, _t, _w, _h, _i) {
    if (cursor._lock)
      return;
    setCursorEvent(e);
    autoScaleX();
    hideSelect();
    if (e != null)
      pubSync(dblclick, self2, mouseLeft1, mouseTop1, plotWidCss, plotHgtCss, null);
  }
  function syncPxRatio() {
    axes.forEach(syncFontSize);
    _setSize(self2.width, self2.height, true);
  }
  on(dppxchange, win, syncPxRatio);
  const events = {};
  events.mousedown = mouseDown;
  events.mousemove = mouseMove;
  events.mouseup = mouseUp;
  events.dblclick = dblClick;
  events["setSeries"] = (e, src, idx, opts2) => {
    let seriesIdxMatcher2 = syncOpts.match[2];
    idx = seriesIdxMatcher2(self2, src, idx);
    idx != -1 && setSeries(idx, opts2, true, false);
  };
  if (cursor.show) {
    onMouse(mousedown, over, mouseDown);
    onMouse(mousemove, over, mouseMove);
    onMouse(mouseenter, over, (e) => {
      setCursorEvent(e);
      syncRect(false);
    });
    onMouse(mouseleave, over, mouseLeave);
    onMouse(dblclick, over, dblClick);
    cursorPlots.add(self2);
    self2.syncRect = syncRect;
  }
  const hooks = self2.hooks = opts.hooks || {};
  function fire(evName, a1, a2) {
    if (deferHooks)
      hooksQueue.push([evName, a1, a2]);
    else {
      if (evName in hooks) {
        hooks[evName].forEach((fn) => {
          fn.call(null, self2, a1, a2);
        });
      }
    }
  }
  (opts.plugins || []).forEach((p2) => {
    for (let evName in p2.hooks)
      hooks[evName] = (hooks[evName] || []).concat(p2.hooks[evName]);
  });
  const seriesIdxMatcher = (self3, src, srcSeriesIdx) => srcSeriesIdx;
  const syncOpts = assign({
    key: null,
    setSeries: false,
    filters: {
      pub: retTrue,
      sub: retTrue
    },
    scales: [xScaleKey, series[1] ? series[1].scale : null],
    match: [retEq, retEq, seriesIdxMatcher],
    values: [null, null]
  }, cursor.sync);
  if (syncOpts.match.length == 2)
    syncOpts.match.push(seriesIdxMatcher);
  cursor.sync = syncOpts;
  const syncKey = syncOpts.key;
  const sync = _sync(syncKey);
  function pubSync(type, src, x3, y2, w2, h, i) {
    if (syncOpts.filters.pub(type, src, x3, y2, w2, h, i))
      sync.pub(type, src, x3, y2, w2, h, i);
  }
  sync.sub(self2);
  function pub(type, src, x3, y2, w2, h, i) {
    if (syncOpts.filters.sub(type, src, x3, y2, w2, h, i))
      events[type](null, src, x3, y2, w2, h, i);
  }
  self2.pub = pub;
  function destroy() {
    sync.unsub(self2);
    cursorPlots.delete(self2);
    mouseListeners.clear();
    off(dppxchange, win, syncPxRatio);
    root.remove();
    legendTable?.remove();
    fire("destroy");
  }
  self2.destroy = destroy;
  function _init() {
    fire("init", opts, data);
    setData(data || opts.data, false);
    if (pendScales[xScaleKey])
      setScale(xScaleKey, pendScales[xScaleKey]);
    else
      autoScaleX();
    shouldSetSelect = select.show && (select.width > 0 || select.height > 0);
    shouldSetCursor = shouldSetLegend = true;
    _setSize(opts.width, opts.height);
  }
  series.forEach(initSeries);
  axes.forEach(initAxis);
  if (then) {
    if (then instanceof HTMLElement) {
      then.appendChild(root);
      _init();
    } else
      then(self2, _init);
  } else
    _init();
  return self2;
};
var FEAT_TIME = true;
var pre = "u-";
var UPLOT = "uplot";
var ORI_HZ = pre + "hz";
var ORI_VT = pre + "vt";
var TITLE = pre + "title";
var WRAP = pre + "wrap";
var UNDER = pre + "under";
var OVER = pre + "over";
var AXIS = pre + "axis";
var OFF = pre + "off";
var SELECT = pre + "select";
var CURSOR_X = pre + "cursor-x";
var CURSOR_Y = pre + "cursor-y";
var CURSOR_PT = pre + "cursor-pt";
var LEGEND = pre + "legend";
var LEGEND_LIVE = pre + "live";
var LEGEND_INLINE = pre + "inline";
var LEGEND_SERIES = pre + "series";
var LEGEND_MARKER = pre + "marker";
var LEGEND_LABEL = pre + "label";
var LEGEND_VALUE = pre + "value";
var WIDTH = "width";
var HEIGHT = "height";
var TOP = "top";
var BOTTOM = "bottom";
var LEFT = "left";
var RIGHT = "right";
var hexBlack = "#000";
var transparent = hexBlack + "0";
var mousemove = "mousemove";
var mousedown = "mousedown";
var mouseup = "mouseup";
var mouseenter = "mouseenter";
var mouseleave = "mouseleave";
var dblclick = "dblclick";
var resize = "resize";
var scroll = "scroll";
var change = "change";
var dppxchange = "dppxchange";
var LEGEND_DISP = "--";
var domEnv = typeof window != "undefined";
var doc2 = domEnv ? document : null;
var win = domEnv ? window : null;
var nav = domEnv ? navigator : null;
var pxRatio;
var query;
var xformCache = new WeakMap;
var colorCache = new WeakMap;
var sizeCache = new WeakMap;
var evOpts = { passive: true };
var evOpts2 = { ...evOpts, capture: true };
domEnv && setPxRatio();
var rangePad = 0.1;
var autoRangePart = {
  mode: 3,
  pad: rangePad
};
var _eqRangePart = {
  pad: 0,
  soft: null,
  mode: 0
};
var _eqRange = {
  min: _eqRangePart,
  max: _eqRangePart
};
var numFormatter = new Intl.NumberFormat(domEnv ? nav.language : "en-US");
var fmtNum = (val) => numFormatter.format(val);
var M3 = Math;
var PI = M3.PI;
var abs = M3.abs;
var floor = M3.floor;
var round = M3.round;
var ceil = M3.ceil;
var min = M3.min;
var max = M3.max;
var pow = M3.pow;
var sign = M3.sign;
var log10 = M3.log10;
var log2 = M3.log2;
var sinh = (v3, linthresh = 1) => M3.sinh(v3) * linthresh;
var asinh = (v3, linthresh = 1) => M3.asinh(v3 / linthresh);
var inf = Infinity;
var noop = () => {
};
var retArg0 = (_0) => _0;
var retArg1 = (_0, _1) => _1;
var retNull = (_) => null;
var retTrue = (_) => true;
var retEq = (a, b2) => a == b2;
var fixFloat = (v3) => roundDec(v3, 14);
var fixedDec = new Map;
var EMPTY_OBJ = {};
var EMPTY_ARR = [];
var nullNullTuple = [null, null];
var isArr = Array.isArray;
var isInt = Number.isInteger;
var isUndef = (v3) => v3 === undefined;
var TypedArray = Object.getPrototypeOf(Uint8Array);
var NULL_REMOVE = 0;
var NULL_RETAIN = 1;
var NULL_EXPAND = 2;
var microTask = typeof queueMicrotask == "undefined" ? (fn) => Promise.resolve().then(fn) : queueMicrotask;
var months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
var days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
var days3 = days.map(slice3);
var months3 = months.map(slice3);
var engNames = {
  MMMM: months,
  MMM: months3,
  WWWW: days,
  WWW: days3
};
var subs = {
  YYYY: (d) => d.getFullYear(),
  YY: (d) => (d.getFullYear() + "").slice(2),
  MMMM: (d, names) => names.MMMM[d.getMonth()],
  MMM: (d, names) => names.MMM[d.getMonth()],
  MM: (d) => zeroPad2(d.getMonth() + 1),
  M: (d) => d.getMonth() + 1,
  DD: (d) => zeroPad2(d.getDate()),
  D: (d) => d.getDate(),
  WWWW: (d, names) => names.WWWW[d.getDay()],
  WWW: (d, names) => names.WWW[d.getDay()],
  HH: (d) => zeroPad2(d.getHours()),
  H: (d) => d.getHours(),
  h: (d) => {
    let h = d.getHours();
    return h == 0 ? 12 : h > 12 ? h - 12 : h;
  },
  AA: (d) => d.getHours() >= 12 ? "PM" : "AM",
  aa: (d) => d.getHours() >= 12 ? "pm" : "am",
  a: (d) => d.getHours() >= 12 ? "p" : "a",
  mm: (d) => zeroPad2(d.getMinutes()),
  m: (d) => d.getMinutes(),
  ss: (d) => zeroPad2(d.getSeconds()),
  s: (d) => d.getSeconds(),
  fff: (d) => zeroPad3(d.getMilliseconds())
};
var localTz = new Intl.DateTimeFormat().resolvedOptions().timeZone;
var onlyWhole = (v3) => v3 % 1 == 0;
var allMults = [1, 2, 2.5, 5];
var decIncrs = genIncrs(10, -16, 0, allMults);
var oneIncrs = genIncrs(10, 0, 16, allMults);
var wholeIncrs = oneIncrs.filter(onlyWhole);
var numIncrs = decIncrs.concat(oneIncrs);
var NL = "\n";
var yyyy = "{YYYY}";
var NLyyyy = NL + yyyy;
var md2 = "{M}/{D}";
var NLmd = NL + md2;
var NLmdyy = NLmd + "/{YY}";
var aa2 = "{aa}";
var hmm = "{h}:{mm}";
var hmmaa = hmm + aa2;
var NLhmmaa = NL + hmmaa;
var ss = ":{ss}";
var _ = null;
var [timeIncrsMs, _timeAxisStampsMs, timeAxisSplitsMs] = genTimeStuffs(1);
var [timeIncrsS, _timeAxisStampsS, timeAxisSplitsS] = genTimeStuffs(0.001);
genIncrs(2, -53, 53, [1]);
var _timeSeriesStamp = "{YYYY}-{MM}-{DD} {h}:{mm}{aa}";
var legendOpts = {
  show: true,
  live: true,
  isolate: false,
  mount: noop,
  markers: {
    show: true,
    width: 2,
    stroke: legendStroke,
    fill: legendFill,
    dash: "solid"
  },
  idx: null,
  idxs: null,
  values: []
};
var moveTuple = [0, 0];
var cursorOpts = {
  show: true,
  x: true,
  y: true,
  lock: false,
  move: cursorMove,
  points: {
    show: cursorPointShow,
    size: cursorPointSize,
    width: 0,
    stroke: cursorPointStroke,
    fill: cursorPointFill
  },
  bind: {
    mousedown: filtBtn0,
    mouseup: filtBtn0,
    click: filtBtn0,
    dblclick: filtBtn0,
    mousemove: filtTarg,
    mouseleave: filtTarg,
    mouseenter: filtTarg
  },
  drag: {
    setScale: true,
    x: true,
    y: false,
    dist: 0,
    uni: null,
    click: (self2, e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
    },
    _x: false,
    _y: false
  },
  focus: {
    dist: (self2, seriesIdx, dataIdx, valPos, curPos) => valPos - curPos,
    prox: -1,
    bias: 0
  },
  hover: {
    skip: [undefined],
    prox: null,
    bias: 0
  },
  left: -10,
  top: -10,
  idx: null,
  dataIdx: null,
  idxs: null,
  event: null
};
var axisLines = {
  show: true,
  stroke: "rgba(0,0,0,0.07)",
  width: 2
};
var grid = assign({}, axisLines, {
  filter: retArg1
});
var ticks = assign({}, grid, {
  size: 10
});
var border = assign({}, axisLines, {
  show: false
});
var font = '12px system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
var labelFont = "bold " + font;
var lineGap = 1.5;
var xAxisOpts = {
  show: true,
  scale: "x",
  stroke: hexBlack,
  space: 50,
  gap: 5,
  size: 50,
  labelGap: 0,
  labelSize: 30,
  labelFont,
  side: 2,
  grid,
  ticks,
  border,
  font,
  lineGap,
  rotate: 0
};
var numSeriesLabel = "Value";
var timeSeriesLabel = "Time";
var xSeriesOpts = {
  show: true,
  scale: "x",
  auto: false,
  sorted: 1,
  min: inf,
  max: -inf,
  idxs: []
};
var RE_ALL = /./;
var RE_12357 = /[12357]/;
var RE_125 = /[125]/;
var RE_1 = /1/;
var _filt = (splits, distr, re2, keepMod) => splits.map((v3, i) => distr == 4 && v3 == 0 || i % keepMod == 0 && re2.test(v3.toExponential()[v3 < 0 ? 1 : 0]) ? v3 : null);
var yAxisOpts = {
  show: true,
  scale: "y",
  stroke: hexBlack,
  space: 30,
  gap: 5,
  size: 50,
  labelGap: 0,
  labelSize: 30,
  labelFont,
  side: 3,
  grid,
  ticks,
  border,
  font,
  lineGap,
  rotate: 0
};
var facet = {
  scale: null,
  auto: true,
  sorted: 0,
  min: inf,
  max: -inf
};
var gaps = (self2, seriesIdx, idx0, idx1, nullGaps) => nullGaps;
var xySeriesOpts = {
  show: true,
  auto: true,
  sorted: 0,
  gaps,
  alpha: 1,
  facets: [
    assign({}, facet, { scale: "x" }),
    assign({}, facet, { scale: "y" })
  ]
};
var ySeriesOpts = {
  scale: "y",
  auto: true,
  sorted: 0,
  show: true,
  spanGaps: false,
  gaps,
  alpha: 1,
  points: {
    show: seriesPointsShow,
    filter: null
  },
  values: null,
  min: inf,
  max: -inf,
  idxs: [],
  path: null,
  clip: null
};
var xScaleOpts = {
  time: FEAT_TIME,
  auto: true,
  distr: 1,
  log: 10,
  asinh: 1,
  min: null,
  max: null,
  dir: 1,
  ori: 0
};
var yScaleOpts = assign({}, xScaleOpts, {
  time: false,
  ori: 1
});
var syncs = {};
var BAND_CLIP_FILL = 1 << 0;
var BAND_CLIP_STROKE = 1 << 1;
var moveToH = (p2, x3, y2) => {
  p2.moveTo(x3, y2);
};
var moveToV = (p2, y2, x3) => {
  p2.moveTo(x3, y2);
};
var lineToH = (p2, x3, y2) => {
  p2.lineTo(x3, y2);
};
var lineToV = (p2, y2, x3) => {
  p2.lineTo(x3, y2);
};
var rectH = rect(0);
var rectV = rect(1);
var arcH = (p2, x3, y2, r2, startAngle, endAngle) => {
  p2.arc(x3, y2, r2, startAngle, endAngle);
};
var arcV = (p2, y2, x3, r2, startAngle, endAngle) => {
  p2.arc(x3, y2, r2, startAngle, endAngle);
};
var bezierCurveToH = (p2, bp1x, bp1y, bp2x, bp2y, p2x, p2y) => {
  p2.bezierCurveTo(bp1x, bp1y, bp2x, bp2y, p2x, p2y);
};
var bezierCurveToV = (p2, bp1y, bp1x, bp2y, bp2x, p2y, p2x) => {
  p2.bezierCurveTo(bp1x, bp1y, bp2x, bp2y, p2x, p2y);
};
var drawAccH = _drawAcc(lineToH);
var drawAccV = _drawAcc(lineToV);
var cursorPlots = new Set;
if (domEnv) {
  on(resize, win, invalidateRects);
  on(scroll, win, invalidateRects, true);
  on(dppxchange, win, () => {
    uPlot.pxRatio = pxRatio;
  });
}
var linearPath = linear();
var pointsPath = points();
var snapTimeX = snapNumX;
var snapLogX = snapLogY;
var snapAsinhX = snapAsinhY;
uPlot.assign = assign;
uPlot.fmtNum = fmtNum;
uPlot.rangeNum = rangeNum;
uPlot.rangeLog = rangeLog;
uPlot.rangeAsinh = rangeAsinh;
uPlot.orient = orient;
uPlot.pxRatio = pxRatio;
{
  uPlot.join = join;
}
{
  uPlot.fmtDate = fmtDate;
  uPlot.tzDate = tzDate;
}
uPlot.sync = _sync;
{
  uPlot.addGap = addGap;
  uPlot.clipGaps = clipGaps;
  let paths = uPlot.paths = {
    points
  };
  paths.linear = linear;
  paths.stepped = stepped;
  paths.bars = bars;
  paths.spline = monotoneCubic;
}

// src/plotting_helpers.ts
function legendRound(val, suffix, precision = 2) {
  if (val == null || val == undefined || val == "null") {
    return "no data";
  } else {
    return val.toFixed(precision) + suffix;
  }
}
function plot(toPlot, series) {
  let opts = {
    ...getSize(),
    series,
    axes: [
      {
        stroke: "#fff",
        grid: {
          stroke: "#ffffff20"
        },
        ticks: {
          show: true,
          stroke: "#80808080"
        }
      },
      {
        scale: "psi",
        values: (u, vals, space) => vals.map((v3) => +v3.toFixed(1) + "psi"),
        stroke: "#fff",
        grid: {
          stroke: "#ffffff20"
        },
        ticks: {
          show: true,
          stroke: "#80808080"
        }
      },
      {
        scale: "degrees",
        values: (u, vals, space) => vals.map((v3) => +v3.toFixed(1) + "degrees"),
        stroke: "#fff",
        grid: {
          stroke: "#ffffff20"
        },
        ticks: {
          show: true,
          stroke: "#80808080"
        }
      },
      {
        scale: "lbf",
        values: (u, vals, space) => vals.map((v3) => +v3.toFixed(1) + "lbf"),
        stroke: "#fff",
        grid: {
          stroke: "#ffffff20"
        },
        ticks: {
          show: true,
          stroke: "#80808080"
        }
      }
    ]
  };
  document.getElementById("plot").innerHTML = "";
  let uplot = new uPlot(opts, toPlot, document.getElementById("plot"));
  window.addEventListener("resize", (e) => {
    uplot.setSize(getSize());
  });
}
var getSize = function() {
  return {
    width: document.getElementById("plot").offsetWidth - 10,
    height: window.innerHeight - 90
  };
};

// src/theming.ts
var pspColors = {
  "night-sky": "#252526",
  rush: "#DAAA00",
  moondust: "#F2EFE9",
  "bm-gold": "#CFB991",
  aged: "#8E6F3E",
  field: "#DDB945",
  dust: "#EBD99F",
  steel: "#555960",
  "cool-gray": "#6F727B"
};
var datasetPlottingColors = [
  pspColors.field,
  pspColors["bm-gold"],
  pspColors.steel
];

// src/dataset_selector.ts
function writeSelectorList(datasets) {
  const selectorDiv = document.getElementById("dataset-selector");
  selectorDiv.innerHTML = "";
  for (let i = 0;i < datasets.length; i++) {
    const dataset = datasets[i];
    let buttonInnerHTML;
    if (activeDatasets.to_add.includes(dataset)) {
      buttonInnerHTML = "-";
    } else if (activeDatasets.loading.includes(dataset)) {
      buttonInnerHTML = "l";
    } else {
      buttonInnerHTML = "+";
    }
    const list_div = document.createElement("div");
    list_div.classList.add("datasetListDiv");
    let list_text = document.createElement("p");
    let list_button = document.createElement("button");
    list_text.innerHTML = dataset;
    list_button.innerHTML = buttonInnerHTML;
    list_div.appendChild(list_text);
    list_div.appendChild(list_button);
    selectorDiv.appendChild(list_div);
    list_button.addEventListener("click", async (e) => {
      await buttonClickHandler(dataset);
    });
  }
}
async function buttonClickHandler(dataset) {
  if (activeDatasets.to_add.includes(dataset)) {
    const index = activeDatasets.to_add.indexOf(dataset, 0);
    if (index > -1) {
      activeDatasets.to_add.splice(index, 1);
    }
  } else if (activeDatasets.loading.includes(dataset)) {
    console.log("data already loading!");
  } else {
    activeDatasets.to_add.push(dataset);
  }
  await update();
}

// src/plotting.ts
async function plotDatasets(datasets) {
  let series = [{}];
  let toPlot = [];
  for (let i = 0;i < datasets.length; i++) {
    const dataset = datasets[i];
    const fromCache = activeDatasets.cached.includes(dataset);
    const [time, data, scale] = await getSensorData(dataset, fromCache);
    toPlot[0] = time;
    toPlot.push(data);
    series.push({
      label: dataset,
      value: (self2, rawValue) => legendRound(rawValue, " " + scale),
      stroke: datasetPlottingColors[i],
      width: 2,
      scale,
      spanGaps: true
    });
  }
  console.log("done");
  plot(toPlot, series);
}
async function update() {
  await plotDatasets(activeDatasets.to_add);
  writeSelectorList(activeDatasets.all);
}

// src/browser_fxns.ts
var getQueryVariable = function(variable) {
  var query2 = window.location.search.substring(1);
  var vars = query2.split("&");
  for (var i = 0;i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
};
function getTestName() {
  let param = location.pathname;
  if (param == undefined || param == "/" || param.length <= 2) {
    param = "/short-duration-hotfire-1/";
  }
  return param.slice(1, -1);
}
function initAdded() {
  let param = getQueryVariable("b64");
  if (param == undefined || param == "") {
    activeDatasets.to_add = [];
  } else {
    const decodedList = decode(param);
    activeDatasets.to_add = decodedList.split(",");
  }
}
function getSharelink() {
  const bufferString = activeDatasets.to_add.join(",");
  let b64;
  if (bufferString == undefined || bufferString == "") {
    return location.origin + location.pathname;
  } else {
    b64 = encode(activeDatasets.to_add.join(","));
  }
  const sharelink_base = location.origin + location.pathname + "?b64=" + b64;
  return sharelink_base;
}
var fallbackCopyTextToClipboard = function(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying text command was " + msg);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }
  document.body.removeChild(textArea);
};
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(async function() {
    console.log("Async: Copying to clipboard was successful!");
    const modButton = document.getElementById("addBtn");
    modButton.innerHTML = "Copied!";
    await delay(1500);
    modButton.innerHTML = "Share";
  }, function(err) {
    console.error("Async: Could not copy text: ", err);
  });
}
var decode = (str) => atob(str);
var encode = (str) => btoa(str);
var delay = (ms) => new Promise((res) => setTimeout(res, ms));

// src/index.ts
async function main() {
  const [datasets, name3, test_article] = await getTestInfo();
  activeDatasets.all = datasets;
  const titleElement = document.getElementById("title");
  const modButton = document.getElementById("addBtn");
  const plotDiv = document.getElementById("plot");
  const selectorDiv = document.getElementById("dataset-selector");
  titleElement.innerHTML = "PSP Data Viewer::" + test_article + "::" + name3;
  modButton.style.display = "block";
  modButton.addEventListener("click", async (e) => {
    const sharelink = getSharelink();
    copyTextToClipboard(sharelink);
    console.log(sharelink);
  });
  update();
}
var firebaseConfig = {
  apiKey: "AIzaSyAmJytERQ1hnORHswd-j07WhpTYH7yu6fA",
  authDomain: "psp-portfolio-f1205.firebaseapp.com",
  projectId: "psp-portfolio-f1205",
  storageBucket: "psp-portfolio-f1205.appspot.com",
  messagingSenderId: "493859450932",
  appId: "1:493859450932:web:e4e3c67f0f46316c555a61"
};
var app5 = initializeApp(firebaseConfig);
db = initializeFirestore(app5, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});
activeDatasets = {
  to_add: [],
  loading: [],
  cached: [],
  all: []
};
test_name = getTestName();
initAdded();
main();
