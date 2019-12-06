
module sunui {
    /**
     * export
     */
    export class Tween implements ITween {
        /**
         * @mod: 缓动挂靠的模块，默认为SYSTEM
         * export
         */
        static get(item: any, mod: suncore.ModuleEnum = suncore.ModuleEnum.SYSTEM): ITween {
            return new Tween(item, mod);
        }

        /**
         * 缓动所挂靠的模块
         */
        private $mod: suncore.ModuleEnum;

        /**
         * 缓动对象
         */
        private $item: any;

        /**
         * 最终的属性集，在tween被多次初始化时，会用到此属性集
         */
        private $target: any;

        /**
         * 缓动队列
         */
        private $infos: Array<Array<ITweenInfo>> = [];

        /**
         * 缓动配置列表
         */
        private $configs: Array<ITweenConfig> = [];

        constructor(item: any, mod: suncore.ModuleEnum) {
            this.$mod = mod;
            this.$item = item;
            if (suncore.System.isModuleStopped(mod) === false) {
                puremvc.Facade.getInstance().registerObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
                puremvc.Facade.getInstance().registerObserver(suncore.NotifyKey.PAUSE_TIMELINE, this.$onTimelinePause, this);
            }
        }

        private $onTimelinePause(mod: suncore.ModuleEnum, stop: boolean): void {
            if (this.$mod === mod && stop === true) {
                this.clear();
            }
        }

        /**
         * export
         */
        clear(): void {
            this.$item = null;
            puremvc.Facade.getInstance().removeObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
            puremvc.Facade.getInstance().removeObserver(suncore.NotifyKey.PAUSE_TIMELINE, this.$onTimelinePause, this);
        }

        /**
         * 默认的缓动函数
         */
        static easeNone(t: number, b: number, c: number, d: number): number {
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
            if (suncore.System.isModuleStopped(this.$mod) === true) {
                this.clear();
                return;
            }
            // 若挂靠的模块停止工作了，则不执行缓动
            if (suncore.System.isModulePaused(this.$mod) === true) {
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

            const func: Function = config.ease || Tween.easeNone;

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
                this.clear();
            }
            else {
                this.$configs[0].time = suncore.System.getModuleTimestamp(this.$mod);
            }
        }

        /**
         * export
         */
        to(props: any, duration: number, ease: Function = null, handler: suncom.IHandler = null): ITween {
            if (suncore.System.isModuleStopped(this.$mod) === true) {
                return this;
            }
            const keys: Array<string> = Object.keys(props);
            const item: any = this.$target ? this.$target : this.$item;
            this.$beforeTween(keys, item, props, duration, ease, handler);
            return this;
        }

        /**
         * export
         */
        from(props: any, duration: number, ease: Function = null, handler: suncom.IHandler = null): ITween {
            if (suncore.System.isModuleStopped(this.$mod) === true) {
                return this;
            }
            const keys: Array<string> = Object.keys(props);
            const item: any = this.$target ? this.$target : this.$item;
            this.$beforeTween(keys, props, item, duration, ease, handler);
            return this;
        }

        private $beforeTween(keys: Array<string>, from: any, to: any, duration: number, ease: Function, handler: suncom.IHandler): void {
            // 计算最终效果
            this.$target = this.$target || {};

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