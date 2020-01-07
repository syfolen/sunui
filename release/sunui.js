var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var sunui;
(function (sunui) {
    var UILevel;
    (function (UILevel) {
        UILevel[UILevel["NONE"] = 0] = "NONE";
        UILevel[UILevel["BACKGROUND"] = 1] = "BACKGROUND";
        UILevel[UILevel["SCENE"] = 2] = "SCENE";
        UILevel[UILevel["PANEL"] = 3] = "PANEL";
        UILevel[UILevel["FLOAT"] = 4] = "FLOAT";
        UILevel[UILevel["GOLD_TIPS"] = 5] = "GOLD_TIPS";
        UILevel[UILevel["HIGH_GOLD_TIPS"] = 6] = "HIGH_GOLD_TIPS";
        UILevel[UILevel["NOTICE"] = 7] = "NOTICE";
        UILevel[UILevel["BIGWINNER"] = 8] = "BIGWINNER";
        UILevel[UILevel["MINI_GAME"] = 9] = "MINI_GAME";
        UILevel[UILevel["POPUP"] = 10] = "POPUP";
        UILevel[UILevel["WAITINGBOX"] = 11] = "WAITINGBOX";
        UILevel[UILevel["LOADING"] = 12] = "LOADING";
        UILevel[UILevel["TIPS"] = 13] = "TIPS";
        UILevel[UILevel["TOP"] = 14] = "TOP";
        UILevel[UILevel["DEBUG"] = 15] = "DEBUG";
    })(UILevel = sunui.UILevel || (sunui.UILevel = {}));
    var AbstractPopupCommand = (function (_super) {
        __extends(AbstractPopupCommand, _super);
        function AbstractPopupCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AbstractPopupCommand.prototype.$makeProps = function (props) {
            if (props.x === void 0 && props.left === void 0 && props.right === void 0) {
                props.centerX = 0;
            }
            if (props.y === void 0 && props.top === void 0 && props.bottom === void 0) {
                props.centerY = 0;
            }
            return props;
        };
        AbstractPopupCommand.prototype.$applyShowProps = function (view, props, duration) {
            if (props.x !== void 0) {
                view.x = props.x;
            }
            if (props.y !== void 0) {
                view.y = props.y;
            }
            if (props.centerX !== void 0) {
                view.centerX = props.centerX;
            }
            if (props.centerY !== void 0) {
                view.centerY = props.centerY;
            }
            if (duration == 0) {
                if (props.left !== void 0) {
                    view.left = props.left;
                }
                if (props.right !== void 0) {
                    view.right = props.right;
                }
                if (props.top !== void 0) {
                    view.top = props.top;
                }
                if (props.bottom !== void 0) {
                    view.bottom = props.bottom;
                }
            }
            else {
                if (props.left !== void 0) {
                    view.left = -view.width;
                }
                if (props.right !== void 0) {
                    view.right = -view.width;
                }
                if (props.top !== void 0) {
                    view.top = -view.height;
                }
                if (props.bottom !== void 0) {
                    view.bottom = -view.height;
                }
                if (props.left === void 0 && props.right === void 0 && props.top === void 0 && props.bottom === void 0) {
                    view.alpha = 0;
                    view.scaleX = 0;
                    view.scaleY = 0;
                    props.alpha = 1;
                    props.scaleX = 1;
                    props.scaleY = 1;
                }
                Tween.get(view, suncore.ModuleEnum.CUSTOM).to(props, duration, props.ease);
            }
        };
        AbstractPopupCommand.prototype.$applyCloseProps = function (view, props, duration) {
            if (duration > 0) {
                if (props.left !== void 0) {
                    props.left = -view.width;
                }
                if (props.right !== void 0) {
                    props.right = -view.width;
                }
                if (props.top !== void 0) {
                    props.top = -view.height;
                }
                if (props.bottom !== void 0) {
                    props.bottom = -view.height;
                }
                if (props.left === void 0 && props.right === void 0 && props.top === void 0 && props.bottom === void 0) {
                    props.alpha = 0;
                    props.scaleX = 0;
                    props.scaleY = 0;
                }
                Tween.get(view, suncore.ModuleEnum.CUSTOM).to(props, duration);
            }
        };
        return AbstractPopupCommand;
    }(puremvc.SimpleCommand));
    sunui.AbstractPopupCommand = AbstractPopupCommand;
    var AbstractSceneIniClass = (function (_super) {
        __extends(AbstractSceneIniClass, _super);
        function AbstractSceneIniClass() {
            var _this = _super.call(this) || this;
            _this.facade.registerObserver(NotifyKey.ENTER_SCENE, _this.$onEnterScene, _this, true);
            return _this;
        }
        AbstractSceneIniClass.prototype.run = function () {
            return true;
        };
        AbstractSceneIniClass.prototype.$onEnterScene = function () {
        };
        return AbstractSceneIniClass;
    }(suncore.AbstractTask));
    sunui.AbstractSceneIniClass = AbstractSceneIniClass;
    var ClosePopupCommand = (function (_super) {
        __extends(ClosePopupCommand, _super);
        function ClosePopupCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ClosePopupCommand.prototype.execute = function (view, duration, destroy) {
            var info = M.viewLayer.getInfoByView(view);
            if (info === null) {
                console.error(view + "[" + view.name + "]'s infomation is not exist.");
                return;
            }
            if (info.closed == true) {
                return;
            }
            if (destroy !== void 0) {
                info.keepNode = !destroy;
            }
            info.closed = true;
            if (suncore.System.isModulePaused(suncore.ModuleEnum.CUSTOM) === false) {
                this.$applyCloseProps(view, info.props, duration);
            }
            M.viewLayer.onViewClose(view);
            this.facade.sendNotification(NotifyKey.ON_POPUP_CLOSED, view);
            if (suncore.System.isModulePaused(suncore.ModuleEnum.CUSTOM) === false) {
                var handler = suncom.Handler.create(this, this.$onCloseFinish, [view]);
                Tween.get(info.mask, suncore.ModuleEnum.CUSTOM).to({ alpha: 200 }, duration, null, handler);
            }
        };
        ClosePopupCommand.prototype.$onCloseFinish = function (view) {
            M.viewLayer.removeStackByView(view);
        };
        return ClosePopupCommand;
    }(AbstractPopupCommand));
    sunui.ClosePopupCommand = ClosePopupCommand;
    var Loader = (function () {
        function Loader() {
            this.$templet = null;
            this.$url = null;
            this.$handler = null;
            this.$loading = false;
            this.$retryTimerId = 0;
        }
        Loader.prototype.load = function (url, handler) {
            if (this.$loading === false) {
                this.$loading = true;
                this.$url = url;
                this.$handler = handler;
                Laya.loader.load(this.$getLoadList(url), Laya.Handler.create(this, this.$onLoad));
            }
        };
        Loader.prototype.$onLoad = function (ok) {
            if (ok === false) {
                if (this.$templet === null) {
                    console.log("\u8D44\u6E90\u52A0\u8F7D\u5931\u8D25\uFF1Aurl:" + this.$url + "\uFF0C1\u79D2\u540E\u91CD\u65B0\u5C1D\u8BD5...");
                }
                else {
                    console.log("\u52A8\u753B\u521D\u59CB\u5316\u5931\u8D25\uFF1Aurl:" + this.$url + "\uFF0C1\u79D2\u540E\u91CD\u65B0\u5C1D\u8BD5...");
                }
                this.$retryTimerId = suncore.System.addTimer(suncore.ModuleEnum.SYSTEM, 1000, this.$reload, this);
                return;
            }
            if (this.getResExtByUrl(this.$url) === "sk") {
                if (this.$templet === null) {
                    this.$templet = new Laya.Templet();
                    this.$templet.on(Laya.Event.ERROR, this, this.$onLoad, [false]);
                    this.$templet.on(Laya.Event.COMPLETE, this, this.$onLoad, [true]);
                    this.$templet.loadAni(this.$url);
                    return;
                }
            }
            this.$handler.run();
        };
        Loader.prototype.$reload = function () {
            if (this.$templet === null) {
                Laya.loader.load(this.$getLoadList(this.$url), Laya.Handler.create(this, this.$onLoad));
            }
            else {
                this.$templet.loadAni(this.$url);
            }
            this.$retryTimerId = 0;
        };
        Loader.prototype.destroy = function () {
            this.$handler = null;
            this.$loading = false;
            if (this.$templet !== null) {
                this.$templet.off(Laya.Event.ERROR, this, this.$onLoad);
                this.$templet.off(Laya.Event.COMPLETE, this, this.$onLoad);
                this.$templet.destroy();
                this.$templet = null;
            }
            var loadList = this.$getLoadList(this.$url);
            for (var i = 0; i < loadList.length; i++) {
                var url = loadList[i];
                Laya.loader.clearRes(url);
            }
            Laya.loader.cancelLoadByUrls(this.$getLoadList(this.$url));
            this.$retryTimerId = suncore.System.removeTimer(this.$retryTimerId);
        };
        Loader.prototype.$getLoadList = function (url) {
            var index = url.lastIndexOf(".");
            var str = url.substr(0, index);
            var ext = url.substr(index + 1);
            if (ext === "sk") {
                return [
                    str + ".sk",
                    str + ".png"
                ];
            }
            else {
                return [url];
            }
        };
        Loader.prototype.getResExtByUrl = function (url) {
            return url.substr(url.lastIndexOf(".") + 1);
        };
        Loader.prototype.create = function () {
            var res = null;
            if (this.$templet === null) {
                res = Laya.loader.getRes(this.$url) || null;
            }
            else {
                res = this.$templet.buildArmature(2) || null;
            }
            if (res === null) {
                throw Error("\u8D44\u6E90\u9884\u52A0\u8F7D\u51FA\u9519 url:" + this.$url);
            }
            return res;
        };
        Object.defineProperty(Loader.prototype, "loading", {
            get: function () {
                return this.$loading;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Loader.prototype, "url", {
            get: function () {
                return this.$url;
            },
            enumerable: true,
            configurable: true
        });
        return Loader;
    }());
    sunui.Loader = Loader;
    var RegisterScenesCommand = (function (_super) {
        __extends(RegisterScenesCommand, _super);
        function RegisterScenesCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RegisterScenesCommand.prototype.execute = function (infos) {
            for (var i = 0; i < infos.length; i++) {
                var info = infos[i];
                SceneManager.regScene(info);
            }
        };
        return RegisterScenesCommand;
    }(puremvc.SimpleCommand));
    sunui.RegisterScenesCommand = RegisterScenesCommand;
    var SceneLayer = (function (_super) {
        __extends(SceneLayer, _super);
        function SceneLayer() {
            var _this = _super.call(this) || this;
            _this.$ready = true;
            _this.$sceneName = 0;
            _this.$uiScene = null;
            _this.$d3Scene = null;
            _this.facade.registerObserver(NotifyKey.ENTER_SCENE, _this.$onEnterScene, _this, false, 5);
            return _this;
        }
        SceneLayer.prototype.$enterScene = function (name, data) {
            var str = null;
            if (typeof data === "object") {
                try {
                    str = JSON.stringify(data);
                }
                catch (error) {
                    str = data;
                    suncom.Logger.warn("\u53C2\u6570\u65E0\u6CD5\u8F6C\u5316\u4E3AJSON");
                }
            }
            else {
                str = data;
            }
            var info = SceneManager.getConfigByName(name);
            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, this.$beforeLoadScene, [info, data]));
            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, this.$loadScene, [info, data]));
        };
        SceneLayer.prototype.$beforeLoadScene = function (info, data) {
            this.$sceneName = info.name;
            var task = data === void 0 ? new info.iniCls() : new info.iniCls(data);
            suncore.System.addTask(suncore.ModuleEnum.SYSTEM, task);
        };
        SceneLayer.prototype.$loadScene = function (info, data) {
            if (data === void 0) {
                this.facade.sendNotification(NotifyKey.LOAD_SCENE, info);
            }
            else {
                this.facade.sendNotification(NotifyKey.LOAD_SCENE, [info, data]);
            }
        };
        SceneLayer.prototype.$onEnterScene = function (uiScene, d3Scene) {
            this.$ready = true;
            this.$uiScene = uiScene;
            this.$d3Scene = d3Scene;
            this.facade.sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.CUSTOM, false]);
        };
        SceneLayer.prototype.$exitScene = function () {
            var info = SceneManager.getConfigByName(this.$sceneName);
            this.facade.sendNotification(NotifyKey.EXIT_SCENE, this.$sceneName);
            this.facade.sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.CUSTOM, true]);
            info.uniCls && suncore.System.addTask(suncore.ModuleEnum.SYSTEM, new info.uniCls());
            suncore.System.addTask(suncore.ModuleEnum.SYSTEM, new suncore.SimpleTask(suncom.Handler.create(this, this.$onExitScene)));
        };
        SceneLayer.prototype.$onExitScene = function () {
            var info = SceneManager.getConfigByName(this.$sceneName);
            this.facade.sendNotification(NotifyKey.UNLOAD_SCENE, info);
            this.$sceneName = 0;
        };
        SceneLayer.prototype.enterScene = function (name, data) {
            if (this.$ready == false) {
                return false;
            }
            this.$ready = false;
            this.$sceneName != 0 && this.$exitScene();
            this.$enterScene(name, data);
            SceneHeap.addHistory(name, data);
            return true;
        };
        SceneLayer.prototype.exitScene = function () {
            if (this.$ready == false) {
                return;
            }
            this.$ready = false;
            this.$sceneName != 0 && this.$exitScene();
            SceneHeap.removeHistory(this.$sceneName);
            var info = SceneHeap.pop();
            info !== null && this.$enterScene(info.name, info.data);
        };
        SceneLayer.prototype.replaceScene = function (name, data) {
            var info = SceneHeap.pop();
            if (this.enterScene(name, data) == false) {
                return;
            }
            info !== null && SceneHeap.removeHistory(info.name);
        };
        Object.defineProperty(SceneLayer.prototype, "uiScene", {
            get: function () {
                return this.$uiScene;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneLayer.prototype, "d3Scene", {
            get: function () {
                return this.$d3Scene;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneLayer.prototype, "sceneName", {
            get: function () {
                return this.$sceneName;
            },
            enumerable: true,
            configurable: true
        });
        return SceneLayer;
    }(puremvc.Notifier));
    sunui.SceneLayer = SceneLayer;
    var ShowPopupCommand = (function (_super) {
        __extends(ShowPopupCommand, _super);
        function ShowPopupCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ShowPopupCommand.prototype.execute = function (view, duration, props) {
            if (M.viewLayer.getInfoByView(view) !== null) {
                console.error(view + "[" + view.name + "] is already popup.");
                return;
            }
            if (props.ease === void 0) {
                props.ease = Laya.Ease.backOut;
            }
            if (props.trans === void 0) {
                props.trans = 0.6;
            }
            if (props.keepNode === void 0) {
                props.keepNode = false;
            }
            var args = props.args;
            var trans = props.trans;
            var level = props.level || view.zOrder || UILevel.POPUP;
            var keepNode = props.keepNode;
            var viewClass = props.viewClass;
            delete props.args;
            delete props.trans;
            delete props.level;
            delete props.keepNode;
            delete props.viewClass;
            props = this.$makeProps(props);
            var mask = M.viewLayer.createMask(view);
            mask.name = "Mask$" + view.name;
            mask.alpha = trans;
            mask.zOrder = view.zOrder = level;
            var info = {
                view: view,
                viewClass: viewClass,
                mask: mask,
                level: level,
                props: props,
                closed: false,
                keepNode: keepNode,
                displayed: false,
                duration: duration,
                cancelAllowed: false
            };
            M.viewLayer.addStack(info);
            M.viewLayer.addChild(mask);
            M.viewLayer.addChild(view);
            this.$applyShowProps(view, props, duration);
            if (suncore.System.isModulePaused(suncore.ModuleEnum.CUSTOM) === false) {
                M.viewLayer.onViewCreate(view, args);
                if (args === void 0) {
                    this.facade.sendNotification(NotifyKey.ON_POPUP_CREATED, view);
                }
                else if (args instanceof Array) {
                    this.facade.sendNotification(NotifyKey.ON_POPUP_CREATED, [view].concat(args));
                }
                else {
                    this.facade.sendNotification(NotifyKey.ON_POPUP_CREATED, [view, args]);
                }
            }
            if (suncore.System.isModulePaused(suncore.ModuleEnum.CUSTOM) === false) {
                var handler = suncom.Handler.create(this, this.$onPopupFinish, [view]);
                Tween.get(mask, suncore.ModuleEnum.CUSTOM).from({ alpha: 0 }, 200);
                suncore.System.addTrigger(suncore.ModuleEnum.CUSTOM, duration, handler);
            }
        };
        ShowPopupCommand.prototype.$onPopupFinish = function (view) {
            var info = M.viewLayer.getInfoByView(view);
            if (info !== null) {
                info.displayed = true;
                M.viewLayer.onViewOpen(view);
                this.facade.sendNotification(NotifyKey.ON_POPUP_OPENED, view);
            }
        };
        return ShowPopupCommand;
    }(AbstractPopupCommand));
    sunui.ShowPopupCommand = ShowPopupCommand;
    var Templet = (function () {
        function Templet() {
            this.$loader = new Loader();
            this.$referenceCount = 0;
            this.$handlers = [];
        }
        Templet.prototype.create = function (url, method, caller) {
            this.$referenceCount++;
            if (method !== null) {
                this.$handlers.push(suncom.Handler.create(caller, method));
            }
            this.$loader.loading === false && this.$loader.load(url, suncom.Handler.create(this, this.$doCreate));
        };
        Templet.prototype.$doCreate = function () {
            var handlers = this.$handlers.slice(0);
            this.$handlers = [];
            while (handlers.length > 0) {
                var handler = handlers.shift();
                handler.runWith([this.$loader.create(), this.$loader.url]);
            }
        };
        Templet.prototype.destroy = function (url, method, caller) {
            for (var i = 0; i < this.$handlers.length; i++) {
                var handler = this.$handlers[i];
                if (handler.method === method && handler.caller === caller) {
                    this.$handlers.splice(i, 1);
                    break;
                }
            }
            this.$referenceCount--;
            if (this.$referenceCount > 0) {
                return;
            }
            else if (this.$referenceCount < 0) {
                throw Error("\u8D44\u6E90\u8BA1\u6570\u4E0D\u5E94\u5F53\u5C0F\u4E8E0 url:" + url + ", references:" + this.$referenceCount);
            }
            if (this.$referenceCount === 0) {
                this.$loader.destroy();
            }
        };
        Object.defineProperty(Templet.prototype, "referenceCount", {
            get: function () {
                return this.$referenceCount;
            },
            enumerable: true,
            configurable: true
        });
        return Templet;
    }());
    sunui.Templet = Templet;
    var TempletGroup = (function () {
        function TempletGroup(id, urls, handler) {
            this.$id = 0;
            this.$urls = null;
            this.$handler = null;
            this.$doneList = [];
            this.$id = id;
            this.$urls = urls;
            this.$handler = handler;
            for (var i = 0; i < this.$urls.length; i++) {
                var url = this.$urls[i];
                Resource.create(url, this.$onResourceCreated, this);
            }
        }
        TempletGroup.prototype.$onResourceCreated = function (res, url) {
            if (res instanceof Laya.Skeleton) {
                res.destroy();
            }
            this.$doneList.push(url);
            if (this.$doneList.length < this.$urls.length) {
                return;
            }
            this.$handler.runWith([this.$id]);
        };
        TempletGroup.prototype.release = function () {
            for (var i = 0; i < this.$urls.length; i++) {
                var url = this.$urls[i];
                Resource.destroy(url, this.$onResourceCreated, this);
            }
        };
        return TempletGroup;
    }());
    sunui.TempletGroup = TempletGroup;
    var Tween = (function () {
        function Tween(item, mod) {
            this.$infos = [];
            this.$configs = [];
            this.$mod = mod;
            this.$item = item;
            if (suncore.System.isModuleStopped(mod) === false) {
                puremvc.Facade.getInstance().registerObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
                puremvc.Facade.getInstance().registerObserver(suncore.NotifyKey.PAUSE_TIMELINE, this.$onTimelinePause, this);
            }
        }
        Tween.get = function (item, mod) {
            if (mod === void 0) { mod = suncore.ModuleEnum.CUSTOM; }
            return new Tween(item, mod);
        };
        Tween.prototype.$onTimelinePause = function (mod, stop) {
            if (this.$mod === mod && stop === true) {
                this.clear();
            }
        };
        Tween.prototype.clear = function () {
            this.$item = null;
            puremvc.Facade.getInstance().removeObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
            puremvc.Facade.getInstance().removeObserver(suncore.NotifyKey.PAUSE_TIMELINE, this.$onTimelinePause, this);
        };
        Tween.easeNone = function (t, b, c, d) {
            var a = t / d;
            if (a > 1) {
                a = 1;
            }
            return a * c + b;
        };
        Tween.prototype.$onEnterFrame = function () {
            if (suncore.System.isModuleStopped(this.$mod) === true) {
                this.clear();
                return;
            }
            if (suncore.System.isModulePaused(this.$mod) === true) {
                return;
            }
            var time = suncore.System.getModuleTimestamp(this.$mod);
            var infos = this.$infos[0];
            var config = this.$configs[0];
            var done = false;
            var duration = time - config.time;
            if (duration > config.duration) {
                done = true;
                duration = config.duration;
            }
            var func = config.ease || Tween.easeNone;
            for (var i = 0; i < infos.length; i++) {
                var info = infos[i];
                if (done == true) {
                    this.$item[info.prop] = info.to;
                }
                else {
                    this.$item[info.prop] = func(duration, info.from, info.to - info.from, config.duration);
                }
            }
            if (done == false) {
                return;
            }
            config.handler && config.handler.run();
            this.$infos.shift();
            this.$configs.shift();
            if (this.$configs.length == 0) {
                this.clear();
            }
            else {
                this.$configs[0].time = suncore.System.getModuleTimestamp(this.$mod);
            }
        };
        Tween.prototype.to = function (props, duration, ease, handler) {
            if (ease === void 0) { ease = null; }
            if (handler === void 0) { handler = null; }
            if (suncore.System.isModuleStopped(this.$mod) === true) {
                return this;
            }
            var keys = Object.keys(props);
            var item = this.$target ? this.$target : this.$item;
            this.$beforeTween(keys, item, props, duration, ease, handler);
            return this;
        };
        Tween.prototype.from = function (props, duration, ease, handler) {
            if (ease === void 0) { ease = null; }
            if (handler === void 0) { handler = null; }
            if (suncore.System.isModuleStopped(this.$mod) === true) {
                return this;
            }
            var keys = Object.keys(props);
            var item = this.$target ? this.$target : this.$item;
            this.$beforeTween(keys, props, item, duration, ease, handler);
            return this;
        };
        Tween.prototype.$beforeTween = function (keys, from, to, duration, ease, handler) {
            this.$target = this.$target || {};
            var infos = [];
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var info = {
                    prop: key,
                    from: from[key],
                    to: to[key]
                };
                if (info.from === void 0) {
                    info.from = this.$item[key];
                }
                infos.push(info);
                this.$target[key] = to[key];
            }
            this.$infos.push(infos);
            var config = {
                time: suncore.System.getModuleTimestamp(this.$mod),
                ease: ease,
                handler: handler,
                duration: duration
            };
            this.$configs.push(config);
        };
        return Tween;
    }());
    sunui.Tween = Tween;
    var UIManager = (function (_super) {
        __extends(UIManager, _super);
        function UIManager() {
            var _this = _super.call(this) || this;
            M.viewLayer = new ViewLayerLaya3D();
            M.sceneLayer = new SceneLayer();
            _this.facade.registerCommand(NotifyKey.SHOW_POPUP, ShowPopupCommand);
            _this.facade.registerCommand(NotifyKey.CLOSE_POPUP, ClosePopupCommand);
            return _this;
        }
        UIManager.getInstance = function () {
            if (UIManager.$inst == null) {
                UIManager.$inst = new UIManager();
            }
            return UIManager.$inst;
        };
        UIManager.prototype.enterScene = function (name, data) {
            M.sceneLayer.enterScene(name, data);
        };
        UIManager.prototype.exitScene = function () {
            M.sceneLayer.exitScene();
        };
        UIManager.prototype.replaceScene = function (name, data) {
            M.sceneLayer.replaceScene(name, data);
        };
        UIManager.prototype.hasView = function (viewClass) {
            return M.viewLayer.hasView(viewClass);
        };
        UIManager.prototype.showView = function (viewClass, args, props) {
            if (props === void 0) { props = {}; }
            props.level = UILevel.POPUP;
            M.viewLayer.showView(viewClass, args, props);
        };
        UIManager.prototype.closeView = function (view) {
            M.viewLayer.closeView(view);
        };
        UIManager.prototype.removeView = function (view) {
            M.viewLayer.removeStackByView(view);
        };
        UIManager.prototype.removeViewByClass = function (viewClass) {
            M.viewLayer.removeStackByViewClass(viewClass);
        };
        Object.defineProperty(UIManager.prototype, "uiScene", {
            get: function () {
                return M.sceneLayer.uiScene;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIManager.prototype, "d3Scene", {
            get: function () {
                return M.sceneLayer.d3Scene;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIManager.prototype, "sceneName", {
            get: function () {
                return M.sceneLayer.sceneName;
            },
            enumerable: true,
            configurable: true
        });
        UIManager.$inst = null;
        return UIManager;
    }(puremvc.Notifier));
    sunui.UIManager = UIManager;
    var ViewContact = (function (_super) {
        __extends(ViewContact, _super);
        function ViewContact(caller, popup) {
            var _this = _super.call(this) || this;
            _this.$popup = null;
            _this.$caller = null;
            _this.$closedHandler = null;
            _this.$removedHandler = null;
            _this.$popup = popup;
            _this.$caller = caller;
            _this.facade.registerObserver(sunui.NotifyKey.EXIT_SCENE, _this.$onCallerDestroy, _this);
            var info = M.viewLayer.getInfoByView(caller);
            if (info !== null) {
                _this.facade.registerObserver(sunui.NotifyKey.ON_POPUP_REMOVED, _this.$onCallerDestroy, _this);
            }
            else {
                _this.facade.registerObserver(sunui.NotifyKey.ON_CALLER_DESTROYED, _this.$onCallerDestroy, _this);
            }
            if (M.viewLayer.getInfoByView(popup) === null) {
                throw Error("\u627E\u4E0D\u5230" + popup.name + "\u7684\u5F39\u51FA\u4FE1\u606F\uFF0C\u8BF7\u786E\u8BA4\u5176\u4E3A\u5F39\u51FA\u5BF9\u8C61");
            }
            _this.facade.registerObserver(sunui.NotifyKey.ON_POPUP_CLOSED, _this.$onPopupClosed, _this);
            _this.facade.registerObserver(sunui.NotifyKey.ON_POPUP_REMOVED, _this.$onPopupRemoved, _this);
            return _this;
        }
        ViewContact.prototype.$onExitScene = function () {
            this.$onCallerDestroy(this.$caller);
        };
        ViewContact.prototype.$onCallerDestroy = function (view) {
            if (view === this.$caller) {
                this.facade.removeObserver(sunui.NotifyKey.EXIT_SCENE, this.$onCallerDestroy, this);
                this.facade.removeObserver(sunui.NotifyKey.ON_POPUP_REMOVED, this.$onCallerDestroy, this);
                this.facade.removeObserver(sunui.NotifyKey.ON_CALLER_DESTROYED, this.$onCallerDestroy, this);
                this.facade.removeObserver(sunui.NotifyKey.ON_POPUP_CLOSED, this.$onPopupClosed, this);
                this.facade.removeObserver(sunui.NotifyKey.ON_POPUP_REMOVED, this.$onPopupRemoved, this);
            }
        };
        ViewContact.prototype.$onPopupClosed = function (popup, method, caller) {
            if (this.$closedHandler !== null) {
                this.$closedHandler.run();
                this.$closedHandler = null;
            }
            if (this.$removedHandler === null) {
                this.$onCallerDestroy(this.$caller);
            }
        };
        ViewContact.prototype.$onPopupRemoved = function (popup) {
            if (this.$removedHandler !== null) {
                this.$removedHandler.run();
                this.$removedHandler = null;
            }
            this.$onCallerDestroy(this.$caller);
        };
        ViewContact.prototype.onPopupClosed = function (method, caller, args) {
            if (this.$caller !== caller) {
                throw Error("caller\u4E0E\u6267\u884C\u8005\u4E0D\u4E00\u81F4");
            }
            if (this.$closedHandler === null) {
                this.$closedHandler = suncom.Handler.create(caller, method, args);
            }
            else {
                throw Error("\u91CD\u590D\u76D1\u542C\u5F39\u51FA\u5BF9\u8C61\u7684\u5173\u95ED\u4E8B\u4EF6");
            }
            return this;
        };
        ViewContact.prototype.onPopupRemoved = function (method, caller, args) {
            if (this.$caller !== caller) {
                throw Error("caller\u4E0E\u6267\u884C\u8005\u4E0D\u4E00\u81F4");
            }
            if (this.$removedHandler === null) {
                this.$removedHandler = suncom.Handler.create(caller, method, args);
            }
            else {
                throw Error("\u91CD\u590D\u76D1\u542C\u5F39\u51FA\u5BF9\u8C61\u7684\u79FB\u9664\u4E8B\u4EF6");
            }
            return this;
        };
        return ViewContact;
    }(puremvc.Notifier));
    sunui.ViewContact = ViewContact;
    var ViewFacade = (function (_super) {
        __extends(ViewFacade, _super);
        function ViewFacade(view, duration) {
            var _this = _super.call(this) || this;
            _this.$info = null;
            _this.$view = view;
            if (_this.info) {
                _this.$duration = _this.info.duration;
            }
            else if (duration === void 0) {
                _this.$duration = 200;
            }
            else {
                _this.$duration = duration;
            }
            return _this;
        }
        ViewFacade.prototype.popup = function (props) {
            if (props === void 0) { props = {}; }
            if (this.facade.hasCommand(NotifyKey.SHOW_POPUP) == true) {
                this.facade.sendNotification(NotifyKey.SHOW_POPUP, [this.$view, this.$duration, props]);
            }
            return this;
        };
        ViewFacade.prototype.close = function (destroy) {
            if (this.facade.hasCommand(NotifyKey.CLOSE_POPUP) == true) {
                this.facade.sendNotification(NotifyKey.CLOSE_POPUP, [this.$view, this.$duration, destroy]);
            }
        };
        Object.defineProperty(ViewFacade.prototype, "cancelAllowed", {
            get: function () {
                return this.info.cancelAllowed;
            },
            set: function (yes) {
                this.info.cancelAllowed = yes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewFacade.prototype, "info", {
            get: function () {
                if (this.$info == null) {
                    this.$info = M.viewLayer.getInfoByView(this.$view);
                }
                return this.$info;
            },
            enumerable: true,
            configurable: true
        });
        return ViewFacade;
    }(puremvc.Notifier));
    sunui.ViewFacade = ViewFacade;
    var ViewLayer = (function (_super) {
        __extends(ViewLayer, _super);
        function ViewLayer() {
            var _this = _super.call(this) || this;
            _this.$infos = [];
            _this.facade.registerObserver(NotifyKey.UNLOAD_SCENE, _this.$onUnloadScene, _this, false, 0);
            return _this;
        }
        ViewLayer.prototype.$onUnloadScene = function () {
            var array = this.$infos.concat();
            while (array.length > 0) {
                this.removeStackByInfo(array.pop());
            }
        };
        ViewLayer.prototype.removeStackByInfo = function (info) {
            var index = this.$infos.indexOf(info);
            if (index < 0) {
                return;
            }
            this.$infos.splice(index, 1);
            this.onViewRemove(info.view);
            this.removeChild(info.view);
            this.removeChild(info.mask);
            if (info.keepNode == false) {
                this.facade.sendNotification(NotifyKey.BEFORE_POPUP_REMOVED, info.view);
                this.destroyMask(info.mask);
                this.destroyView(info.view);
            }
            this.facade.sendNotification(NotifyKey.ON_POPUP_REMOVED, info.view);
        };
        ViewLayer.prototype.isViewExistInLevel = function (level) {
            for (var i = 0; i < this.$infos.length; i++) {
                var info = this.$infos[i];
                if (info.closed === false && info.level === level) {
                    return true;
                }
            }
            return false;
        };
        ViewLayer.prototype.getActiveViewInfo = function () {
            for (var i = this.$infos.length - 1; i > -1; i--) {
                var info = this.$infos[i];
                if (info.closed == false) {
                    return info;
                }
            }
            return null;
        };
        ViewLayer.prototype.getInfoByView = function (view) {
            for (var i = this.$infos.length - 1; i > -1; i--) {
                var info = this.$infos[i];
                if (info.view === view) {
                    return info;
                }
            }
            return null;
        };
        ViewLayer.prototype.addStack = function (newInfo) {
            var index = -1;
            for (var i = 0; i < this.$infos.length; i++) {
                var info = this.$infos[i];
                if (index == -1 && info.level > newInfo.level) {
                    index = i;
                    break;
                }
            }
            if (index == -1) {
                this.$infos.push(newInfo);
            }
            else {
                this.$infos.splice(index, 0, newInfo);
            }
        };
        ViewLayer.prototype.removeStackByView = function (view) {
            for (var i = this.$infos.length - 1; i > -1; i--) {
                var info = this.$infos[i];
                if (info.view == view) {
                    this.removeStackByInfo(info);
                    break;
                }
            }
        };
        ViewLayer.prototype.removeStackByViewClass = function (viewClass) {
            var array = [];
            for (var i = 0; i < this.$infos.length; i++) {
                var info = this.$infos[i];
                if (info.viewClass == viewClass) {
                    array.push(info);
                }
            }
            while (array.length > 0) {
                this.removeStackByInfo(array.pop());
            }
        };
        ViewLayer.prototype.hasView = function (viewClass) {
            for (var i = 0; i < this.$infos.length; i++) {
                var info = this.$infos[i];
                if (info.closed == true) {
                    continue;
                }
                if (info.viewClass === viewClass) {
                    return true;
                }
            }
            return false;
        };
        ViewLayer.prototype.showView = function (viewClass, args, props) {
            if (props === void 0) { props = {}; }
            if (props.cancelAllowed === void 0) {
                props.cancelAllowed = true;
            }
            var cancelAllowed = props.cancelAllowed;
            delete props.cancelAllowed;
            var view = this.createViewByClass(viewClass);
            props.args = args;
            props.keepNode = false;
            props.viewClass = viewClass;
            new ViewFacade(view).popup(props).cancelAllowed = cancelAllowed;
            return view;
        };
        ViewLayer.prototype.closeView = function (view) {
            new ViewFacade(view).close();
        };
        Object.defineProperty(ViewLayer.prototype, "isCurrentViewCancelAllowed", {
            get: function () {
                var info = this.getActiveViewInfo();
                if (info != null && info.cancelAllowed === true) {
                    return true;
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        return ViewLayer;
    }(puremvc.Notifier));
    sunui.ViewLayer = ViewLayer;
    var ViewLayerLaya3D = (function (_super) {
        __extends(ViewLayerLaya3D, _super);
        function ViewLayerLaya3D() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ViewLayerLaya3D.prototype.addChild = function (view) {
            M.sceneLayer.uiScene.addChild(view);
        };
        ViewLayerLaya3D.prototype.addChildAt = function (view, index) {
            M.sceneLayer.uiScene.addChildAt(view, index);
        };
        ViewLayerLaya3D.prototype.removeChild = function (view) {
            M.sceneLayer.uiScene.removeChild(view);
        };
        ViewLayerLaya3D.prototype.removeChildAt = function (index) {
            M.sceneLayer.uiScene.removeChildAt(index);
        };
        ViewLayerLaya3D.prototype.createMask = function (view) {
            var mask = new Laya.Image("common/mask.png");
            mask.left = mask.right = mask.top = mask.bottom = 0;
            mask.sizeGrid = "1,1,1,1";
            mask.alpha = 0.5;
            mask.mouseEnabled = true;
            mask.mouseThrough = false;
            return mask;
        };
        ViewLayerLaya3D.prototype.onViewCreate = function (view, args) {
            var node = view;
            var components = node.getComponents(Laya.Component) || [];
            for (var _i = 0, components_1 = components; _i < components_1.length; _i++) {
                var component = components_1[_i];
                if (component.$onCreate) {
                    if (args instanceof Array) {
                        component.$onCreate.apply(component, args);
                    }
                    else {
                        component.$onCreate.call(component, args);
                    }
                }
            }
        };
        ViewLayerLaya3D.prototype.onViewOpen = function (view) {
            var node = view;
            var components = node.getComponents(Laya.Component) || [];
            for (var _i = 0, components_2 = components; _i < components_2.length; _i++) {
                var component = components_2[_i];
                if (component.$onOpen) {
                    component.$onOpen.call(component);
                }
            }
        };
        ViewLayerLaya3D.prototype.onViewClose = function (view) {
            var node = view;
            var components = node.getComponents(Laya.Component) || [];
            for (var _i = 0, components_3 = components; _i < components_3.length; _i++) {
                var component = components_3[_i];
                if (component.$onClose) {
                    component.$onClose.call(component);
                }
            }
        };
        ViewLayerLaya3D.prototype.onViewRemove = function (view) {
            var node = view;
            var components = node.getComponents(Laya.Component) || [];
            for (var _i = 0, components_4 = components; _i < components_4.length; _i++) {
                var component = components_4[_i];
                if (component.$onRemove) {
                    component.$onRemove.call(component);
                }
            }
        };
        ViewLayerLaya3D.prototype.destroyMask = function (view) {
            var mask = view;
            mask.destroy();
        };
        ViewLayerLaya3D.prototype.createViewByClass = function (cls) {
            if (typeof cls === "string") {
                var prefab = new Laya.Prefab();
                prefab.json = Laya.Loader.getRes(cls);
                return prefab.create();
            }
            else {
                return new cls();
            }
        };
        ViewLayerLaya3D.prototype.destroyView = function (view) {
            var node = view;
            node.destroy();
        };
        return ViewLayerLaya3D;
    }(ViewLayer));
    sunui.ViewLayerLaya3D = ViewLayerLaya3D;
    var M;
    (function (M) {
        M.templets = {};
    })(M = sunui.M || (sunui.M = {}));
    var NotifyKey;
    (function (NotifyKey) {
        NotifyKey.LOAD_SCENE = "sunui.NotifyKey.LOAD_SCENE";
        NotifyKey.UNLOAD_SCENE = "sunui.NotifyKey.UNLOAD_SCENE";
        NotifyKey.REGISTER_SCENES = "sunui.NotifyKey.REGISTER_SCENES";
        NotifyKey.ENTER_SCENE = "sunui.NotifyKey.ENTER_SCENE";
        NotifyKey.EXIT_SCENE = "sunui.NotifyKey.EXIT_SCENE";
        NotifyKey.SHOW_POPUP = "sunui.NotifyKey.SHOW_POPUP";
        NotifyKey.CLOSE_POPUP = "sunui.NotifyKey.CLOSE_POPUP";
        NotifyKey.ON_POPUP_CREATED = "sunui.NotifyKey.ON_POPUP_CREATED";
        NotifyKey.ON_POPUP_OPENED = "sunui.NotifyKey.ON_POPUP_OPENED";
        NotifyKey.ON_POPUP_CLOSED = "sunui.NotifyKey.ON_POPUP_CLOSED";
        NotifyKey.BEFORE_POPUP_REMOVED = "sunui.NotifyKey.BEFORE_POPUP_REMOVED";
        NotifyKey.ON_POPUP_REMOVED = "sunui.NotifyKey.ON_POPUP_REMOVED";
        NotifyKey.ON_CALLER_DESTROYED = "sunui.NotifyKey.ON_CALLER_DESTROYED";
    })(NotifyKey = sunui.NotifyKey || (sunui.NotifyKey = {}));
    var Resource;
    (function (Resource) {
        var $seedId = 0;
        var $groups = {};
        var $templets = {};
        function createGroupId() {
            $seedId++;
            return $seedId;
        }
        function create(url, method, caller, flag) {
            if (method === void 0) { method = null; }
            if (caller === void 0) { caller = null; }
            if (flag === void 0) { flag = 0; }
            var templet = $templets[url] || null;
            if (templet === null) {
                templet = $templets[url] = new Templet();
            }
            templet.create(url, method, caller);
            if ((suncom.Global.debugMode & suncom.DebugMode.DEBUG) === suncom.DebugMode.DEBUG) {
                console.log("================== resouce debug ==================");
                var keys = Object.keys($templets);
                for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                    var key = keys_1[_i];
                    var templet_1 = $templets[key];
                    console.log("url:" + key + ", references:" + templet_1.referenceCount);
                }
                console.log("================== resouce debug ==================");
            }
        }
        Resource.create = create;
        function destroy(url, method, caller) {
            if (method === void 0) { method = null; }
            if (caller === void 0) { caller = null; }
            var templet = $templets[url] || null;
            if (templet !== null) {
                templet.destroy(url, method, caller);
                if (templet.referenceCount === 0) {
                    delete $templets[url];
                }
            }
            if ((suncom.Global.debugMode & suncom.DebugMode.DEBUG) === suncom.DebugMode.DEBUG) {
                console.log("================== resouce debug ==================");
                var keys = Object.keys($templets);
                for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
                    var key = keys_2[_i];
                    var templet_2 = $templets[key];
                    console.log("url:" + key + ", references:" + templet_2.referenceCount);
                }
                console.log("================== resouce debug ==================");
            }
        }
        Resource.destroy = destroy;
        function prepare(urls, method, caller) {
            var handler = null;
            if (method === null) {
                handler = suncom.Handler.create(null, function (id) { });
            }
            else {
                handler = suncom.Handler.create(caller, method);
            }
            var id = createGroupId();
            $groups[id] = new TempletGroup(id, urls, handler);
            return id;
        }
        Resource.prepare = prepare;
        function release(id, node) {
            if (node === void 0) { node = null; }
            if (id > 0) {
                if (node !== null) {
                    new ViewContact(null, node).onPopupRemoved(release, null, [id]);
                }
                else {
                    suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_0, suncom.Handler.create(null, releaseTempletGroup, [id]));
                }
            }
            return 0;
        }
        Resource.release = release;
        function releaseTempletGroup(id) {
            var group = $groups[id] || null;
            if (group !== null) {
                delete $groups[id];
                group.release();
            }
        }
    })(Resource = sunui.Resource || (sunui.Resource = {}));
    var SceneHeap;
    (function (SceneHeap) {
        var $infos = [];
        function findHeapIndexByName(name) {
            for (var i = $infos.length - 1; i > -1; i--) {
                if ($infos[i].name === name) {
                    return i;
                }
            }
            return -1;
        }
        function addHistory(name, data) {
            var info = {
                name: name,
                data: data
            };
            $infos.push(info);
        }
        SceneHeap.addHistory = addHistory;
        function removeHistory(name) {
            var index = findHeapIndexByName(name);
            if (index > -1) {
                $infos.splice(index, 1);
            }
            return index > -1;
        }
        SceneHeap.removeHistory = removeHistory;
        function hasHistory(name) {
            return findHeapIndexByName(name) > -1;
        }
        SceneHeap.hasHistory = hasHistory;
        function pop() {
            if ($infos.length > 0) {
                return $infos[$infos.length - 1];
            }
            return null;
        }
        SceneHeap.pop = pop;
        function popByName(name) {
            var index = findHeapIndexByName(name);
            if (index > -1) {
                return $infos[index];
            }
            return null;
        }
        SceneHeap.popByName = popByName;
    })(SceneHeap = sunui.SceneHeap || (sunui.SceneHeap = {}));
    var SceneManager;
    (function (SceneManager) {
        var $infos = [];
        function regScene(info) {
            for (var i = 0; i < $infos.length; i++) {
                if ($infos[i].name === info.name) {
                    throw Error("重复注册场景");
                }
            }
            $infos.push(info);
        }
        SceneManager.regScene = regScene;
        function getConfigByName(name) {
            for (var i = 0; i < $infos.length; i++) {
                var info = $infos[i];
                if (info.name === name) {
                    return info;
                }
            }
            throw Error("场景配置不存在");
        }
        SceneManager.getConfigByName = getConfigByName;
    })(SceneManager = sunui.SceneManager || (sunui.SceneManager = {}));
    function find(path, parent) {
        var array = path.split("/");
        while (parent != null && array.length > 0) {
            var name_1 = array.shift();
            parent = parent.getChildByName(name_1);
        }
        return parent;
    }
    sunui.find = find;
})(sunui || (sunui = {}));
