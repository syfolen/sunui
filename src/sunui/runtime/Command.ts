
module sunui {
    /**
     * 逻辑命令接口
     */
    export class Command extends Runnable {
        /**
         * 参数列表（允许存储多组参数）
         */
        private $dataList: any[] = [];

        /**
         * 是否正在运行
         */
        private $running: boolean = false;

        /**
         * 监视器列表
         */
        private $monitors: Monitor[] = null;

        constructor(command: string, condition: suncom.IHandler, monitors: Monitor[]) {
            super(command, condition);
            this.$monitors = monitors;
            if (this.$monitors.length === 0) {
                throw Error("没有为需要拦截的命令指定监视器！");
            }
            this.facade.registerObserver(NotifyKey.RELEASE_MONITOR, this.$onMonitorReleased, this);
        }

        destroy(): void {
            if (this.$destroyed === true) {
                return;
            }
            super.destroy();
            this.facade.removeObserver(NotifyKey.RELEASE_MONITOR, this.$onMonitorReleased, this);
        }

        run(): void {
            if (this.$running === false) {
                this.$running = true;
                for (let i: number = 0; i < this.$monitors.length; i++) {
                    this.$monitors[i].var_active = true;
                }
            }
        }

        private $onMonitorReleased(monitor: Monitor): void {
            if (this.$var_released === true) {
                return;
            }
            if (this.$monitors.indexOf(monitor) === -1) {
                return;
            }
            this.facade.notifyCancel();

            let released: boolean = true;
            for (let i: number = 0; i < this.$monitors.length; i++) {
                if (this.$monitors[i].var_released === false) {
                    released = false;
                    break;
                }
            }
            if (released === true) {
                suncore.System.addMessage(suncore.ModuleEnum.TIMELINE, suncore.MessagePriorityEnum.PRIORITY_0, this, this.$releaseSelf);
            }
        }

        private $releaseSelf(): void {
            if (this.$destroyed === false && this.$var_released === false) {
                this.$var_released = true;
                this.facade.sendNotification(NotifyKey.NEXT_COMMAND, this, true);
                for (let i: number = 0; i < this.$dataList.length; i++) {
                    this.facade.sendNotification(this.$var_command, this.$dataList[i]);
                }
            }
        }

        protected $func_onCommandCallback(): void {
            if (this.$var_released === true) {
                return;
            }

            const args: any[] = [];
            for (let i: number = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }

            if (this.$var_condition.runWith(args) === false) {
                return;
            }

            this.$var_released = true;
            for (let i: number = 0; i < this.$monitors.length; i++) {
                if (this.$monitors[i].var_released === false) {
                    this.$var_released = false;
                    break;
                }
            }

            if (this.$var_released === false) {
                this.$dataList.push(args);
                this.facade.notifyCancel();
            }
        }

        get running(): boolean {
            return this.$running;
        }
    }
}