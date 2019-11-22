var sunui;
(function (sunui) {
    /**
     * export
     */
    var Tween = /** @class */ (function () {
        function Tween(item, mod) {
            /**
             * 缓动队列
             */
            this.$infos = [];
            /**
             * 缓动配置列表
             */
            this.$configs = [];
            this.$mod = mod;
            this.$item = item;
            suncore.System.addMessage(this.$mod, suncore.MessagePriorityEnum.PRIORITY_FRAME, this.$onEnterFrame, this);
            if (mod === suncore.ModuleEnum.CUSTOM) {
                puremvc.Facade.getInstance().registerObserver(suncore.NotifyKey.TIMESTAMP_STOPPED, this.clear, this);
            }
            else if (mod === suncore.ModuleEnum.TIMELINE) {
                puremvc.Facade.getInstance().registerObserver(suncore.NotifyKey.TIMELINE_STOPPED, this.clear, this);
            }
        }
        /**
         * export
         */
        Tween.get = function (item, mod) {
            if (mod === void 0) { mod = suncore.ModuleEnum.SYSTEM; }
            return new Tween(item, mod);
        };
        /**
         * export
         */
        Tween.prototype.clear = function () {
            suncore.System.removeMessage(this.$mod, suncore.MessagePriorityEnum.PRIORITY_FRAME, this.$onEnterFrame, this);
            if (this.$mod === suncore.ModuleEnum.CUSTOM) {
                puremvc.Facade.getInstance().removeObserver(suncore.NotifyKey.TIMESTAMP_STOPPED, this.clear, this);
            }
            else if (this.$mod === suncore.ModuleEnum.TIMELINE) {
                puremvc.Facade.getInstance().removeObserver(suncore.NotifyKey.TIMELINE_STOPPED, this.clear, this);
            }
        };
        /**
         * 默认的缓动函数
         */
        Tween.prototype.easeNone = function (t, b, c, d) {
            var a = t / d;
            if (a > 1) {
                a = 1;
            }
            return a * c + b;
        };
        /**
         * 执行缓动
         */
        Tween.prototype.$onEnterFrame = function () {
            // 若挂靠的模块停止工作了，则不执行缓动
            if (suncore.System.isModulePaused(this.$mod) == true) {
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
            var func = config.ease || this.easeNone;
            for (var i = 0; i < infos.length; i++) {
                var info = infos[i];
                if (done == true) {
                    this.$item[info.prop] = info.to;
                }
                else {
                    this.$item[info.prop] = func(duration, info.from, info.to - info.from, config.duration);
                }
            }
            // 缓动未完成
            if (done == false) {
                return;
            }
            // 缓动回调
            config.handler && config.handler.run();
            this.$infos.shift();
            this.$configs.shift();
            // 缓动己完成
            if (this.$configs.length == 0) {
                this.clear();
            }
            else {
                this.$configs[0].time = suncore.System.getModuleTimestamp(this.$mod);
            }
        };
        /**
         * export
         */
        Tween.prototype.to = function (props, duration, ease, handler) {
            if (ease === void 0) { ease = null; }
            if (handler === void 0) { handler = null; }
            var keys = Object.keys(props);
            var item = this.$target ? this.$target : this.$item;
            this.$beforeTween(keys, item, props, duration, ease, handler);
            return this;
        };
        /**
         * export
         */
        Tween.prototype.from = function (props, duration, ease, handler) {
            if (ease === void 0) { ease = null; }
            if (handler === void 0) { handler = null; }
            var keys = Object.keys(props);
            var item = this.$target ? this.$target : this.$item;
            this.$beforeTween(keys, props, item, duration, ease, handler);
            return this;
        };
        Tween.prototype.$beforeTween = function (keys, from, to, duration, ease, handler) {
            // 计算最终效果
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
                // 应用最终属性
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
})(sunui || (sunui = {}));
//# sourceMappingURL=Tween.js.map