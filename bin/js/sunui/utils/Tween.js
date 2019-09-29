var sunui;
(function (sunui) {
    var Tween = /** @class */ (function () {
        function Tween(item, mod) {
            this.$infos = [];
            this.$configs = [];
            this.$mod = mod;
            this.$item = item;
            puremvc.Facade.getInstance().registerObserver(suncore.NotifyKey.FRAME_ENTER, this.$onFrameEnter, this);
            // 若时间轴停止，则终止缓动
            mod == suncore.ModuleEnum.CUSTOM && puremvc.Facade.getInstance().registerObserver(suncore.NotifyKey.TIMESTAMP_STOPPED, this.destroy, this);
            mod == suncore.ModuleEnum.TIMELINE && puremvc.Facade.getInstance().registerObserver(suncore.NotifyKey.TIMELINE_STOPPED, this.destroy, this);
        }
        Tween.get = function (item, mod) {
            if (mod === void 0) { mod = suncore.ModuleEnum.SYSTEM; }
            return new Tween(item, mod);
        };
        Tween.prototype.destroy = function () {
            puremvc.Facade.getInstance().removeObserver(suncore.NotifyKey.FRAME_ENTER, this.$onFrameEnter, this);
            puremvc.Facade.getInstance().removeObserver(suncore.NotifyKey.FRAME_ENTER, this.$onFrameEnter, this);
        };
        /**
         * 默认的缓动函数
         */
        Tween.prototype.easeNone = function (time, from, to, duration) {
            var percent = time / duration;
            if (percent > 1) {
                percent = 1;
            }
            var value = to - from;
            return percent * value + from;
        };
        /**
         * 执行缓动
         */
        Tween.prototype.$onFrameEnter = function () {
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
                    this.$item[info.prop] = func(duration, info.from, info.to, config.duration);
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
                this.destroy();
            }
            else {
                this.$configs[0].time = suncore.System.getModuleTimestamp(this.$mod);
            }
        };
        Tween.prototype.to = function (props, duration, ease, handler) {
            if (ease === void 0) { ease = null; }
            if (handler === void 0) { handler = null; }
            var keys = Object.keys(props);
            var item = this.$target ? this.$target : this.$item;
            this.$beforeTween(keys, item, props, duration, ease, handler);
            return this;
        };
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
            // 修正Alpha的值
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (key == Tween.Alpha.KEY) {
                    if (Tween.Alpha.MAX > 1) {
                        to[key] = to[key] * Tween.Alpha.MAX;
                        from[key] = from[key] * Tween.Alpha.MAX;
                    }
                }
            }
            var infos = [];
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var info = {
                    prop: key,
                    from: from[key],
                    to: to[key]
                };
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
        /**
         * Alpha最大值
         */
        Tween.Alpha = { MAX: 1, KEY: "alpha" };
        return Tween;
    }());
    sunui.Tween = Tween;
})(sunui || (sunui = {}));
//# sourceMappingURL=Tween.js.map