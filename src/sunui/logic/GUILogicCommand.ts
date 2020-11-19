
module sunui {
    /**
     * 逻辑命令接口
     */
    export class GUILogicCommand extends GUILogicInterceptor {
        /**
         * 先决命令列表
         */
        private $dependencies: GUILogicDependence[];

        /**
         * 参数列表（允许存储多组参数）
         */
        private $dataList: any[] = [];

        /**
         * 是否正在运行
         */
        private $running: boolean = false;

        constructor(command: string, condition: suncom.Handler, dependencies: GUILogicDependence[]) {
            super(command, condition);
            this.$dependencies = dependencies;
            suncom.Test.expect(dependencies.length).toBeGreaterThan(0);
            this.facade.registerObserver(NotifyKey.ON_INTERCEPTOR_RELIEVED, this.$onInterceptorRelieved, this);
        }

        destroy(): void {
            if (this.$destroyed === true) {
                return;
            }
            super.destroy();
            this.facade.removeObserver(NotifyKey.ON_INTERCEPTOR_RELIEVED, this.$onInterceptorRelieved, this);
        }

        run(): void {
            suncom.Test.expect(this.$running).toBe(false);
            for (let i: number = 0; i < this.$dependencies.length; i++) {
                this.$dependencies[i].active = true;
            }
            this.$running = true;
        }

        private $onInterceptorRelieved(dependence: GUILogicDependence): void {
            if (this.$relieved === true) {
                return;
            }
            if (this.$dependencies.indexOf(dependence) < 0) {
                return;
            }
            this.facade.notifyCancel();

            let relieved: boolean = true;
            for (let i: number = 0; i < this.$dependencies.length; i++) {
                if (this.$dependencies[i].relieved === false) {
                    relieved = false;
                    break;
                }
            }
            if (relieved === true) {
                const handler: suncom.Handler = suncom.Handler.create(this, this.$onCommandRelieved);
                suncore.System.addMessage(suncore.ModuleEnum.TIMELINE, suncore.MessagePriorityEnum.PRIORITY_0, handler);
            }
        }

        private $onCommandRelieved(): void {
            if (this.$destroyed === false && this.$relieved === false) {
                this.$relieved = true;
                this.facade.sendNotification(NotifyKey.NEXT_LOGIC_COMMAND, this, true);
                for (let i: number = 0; i < this.$dataList.length; i++) {
                    this.facade.sendNotification(this.$command, this.$dataList[i]);
                }
            }
        }

        protected $onCommandCallback(): void {
            if (this.$relieved === true) {
                return;
            }

            const args: any[] = [];
            for (let i: number = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }

            if (this.$condition.runWith(args) === false) {
                return;
            }

            this.$relieved = true;
            for (let i: number = 0; i < this.$dependencies.length; i++) {
                if (this.$dependencies[i].relieved === false) {
                    this.$relieved = false;
                    break;
                }
            }

            if (this.$relieved === false) {
                this.$dataList.push(args);
                this.facade.notifyCancel();
            }
        }

        get running(): boolean {
            return this.$running;
        }
    }
}