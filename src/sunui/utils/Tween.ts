
module sunui {

    /**
     * export
     */
    export class Tween implements ITween {
        /**
         * Alpha最大值
         */
        static readonly Alpha: { MAX, KEY } = { MAX: 1, KEY: "alpha" };

        /**
         * export
         */
        static get(item: any, mod: suncore.ModuleEnum = suncore.ModuleEnum.SYSTEM): ITween {
            return new Tween(item, mod);
        }

        private $mod: suncore.ModuleEnum;
        private $item: any;

        /**
         * 最终的属性集，在tween被多次初始化时，会用到此属性集
         */
        private $target: any;

        private $infos: Array<Array<ITweenInfo>> = [];
        private $configs: Array<ITweenConfig> = [];

        constructor(item: any, mod: suncore.ModuleEnum) {
            this.$mod = mod;
            this.$item = item;
            suncore.System.addMessage(mod, suncore.MessagePriorityEnum.PRIORITY_FRAME, this.$onEnterFrame, this);
            // 若时间轴停止，则终止缓动
            mod == suncore.ModuleEnum.CUSTOM && puremvc.Facade.getInstance().registerObserver(suncore.NotifyKey.TIMESTAMP_STOPPED, this.destroy, this);
            mod == suncore.ModuleEnum.TIMELINE && puremvc.Facade.getInstance().registerObserver(suncore.NotifyKey.TIMELINE_STOPPED, this.destroy, this);
        }

        /**
         * export
         */
        destroy(): void {
            suncore.System.removeMessage(this.$mod, suncore.MessagePriorityEnum.PRIORITY_FRAME, this.$onEnterFrame, this);
            this.$mod == suncore.ModuleEnum.CUSTOM && puremvc.Facade.getInstance().removeObserver(suncore.NotifyKey.TIMESTAMP_STOPPED, this.destroy, this);
            this.$mod == suncore.ModuleEnum.TIMELINE && puremvc.Facade.getInstance().removeObserver(suncore.NotifyKey.TIMELINE_STOPPED, this.destroy, this);
        }

        /**
         * 默认的缓动函数
         */
        private easeNone(t: number, b: number, c: number, d: number): number {
            let a: number = t / d;
            if (a > 1) {
                a = 1;
            }
            return a * c + b;
        }

        /**
         * 执行缓动
         */
        private $onEnterFrame(): void {
            // 若挂靠的模块停止工作了，则不执行缓动
            if (suncore.System.isModulePaused(this.$mod) == true) {
                return;
            }
            const time: number = suncore.System.getModuleTimestamp(this.$mod);
            const infos: Array<ITweenInfo> = this.$infos[0];
            const config: ITweenConfig = this.$configs[0];

            let done: boolean = false;
            let duration: number = time - config.time;

            if (duration > config.duration) {
                done = true;
                duration = config.duration;
            }

            const func: Function = config.ease || this.easeNone;

            for (let i: number = 0; i < infos.length; i++) {
                const info: ITweenInfo = infos[i];
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
                this.destroy();
            }
            else {
                this.$configs[0].time = suncore.System.getModuleTimestamp(this.$mod);
            }
        }

        /**
         * export
         */
        to(props: any, duration: number, ease: Function = null, handler: suncom.IHandler = null): ITween {
            const keys: Array<string> = Object.keys(props);
            const item: any = this.$target ? this.$target : this.$item;
            this.$beforeTween(keys, item, props, duration, ease, handler);
            return this;
        }

        /**
         * export
         */
        from(props: any, duration: number, ease: Function = null, handler: suncom.IHandler = null): ITween {
            const keys: Array<string> = Object.keys(props);
            const item: any = this.$target ? this.$target : this.$item;
            this.$beforeTween(keys, props, item, duration, ease, handler);
            return this;
        }

        private $beforeTween(keys: Array<string>, from: any, to: any, duration: number, ease: Function, handler: suncom.IHandler): void {
            // 计算最终效果
            this.$target = this.$target || {};

            // 修正Alpha的值
            for (let i: number = 0; i < keys.length; i++) {
                const key: string = keys[i];
                if (key == Tween.Alpha.KEY) {
                    if (Tween.Alpha.MAX > 1) {
                        to[key] = to[key] * Tween.Alpha.MAX;
                        from[key] = from[key] * Tween.Alpha.MAX;
                    }
                }
            }

            const infos: Array<ITweenInfo> = [];
            for (let i: number = 0; i < keys.length; i++) {
                const key: string = keys[i];
                const info: ITweenInfo = {
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

            const config: ITweenConfig = {
                time: suncore.System.getModuleTimestamp(this.$mod),
                ease: ease,
                handler: handler,
                duration: duration
            }
            this.$configs.push(config);
        }
    }
}