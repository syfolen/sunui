
module sunui {
    /**
     * 逻辑执行器，用于维护GUI层的命令执行序列
     * export
     */
    export class GUILogicRunnable extends puremvc.Notifier {
        /**
         * 哈希ID
         */
        private $hashId: number = suncom.Common.createHashId();

        /**
         * 超时定时器
         */
        private $timerId: number = 0;

        /**
         * 命令序列
         */
        private $commands: GUILogicCommand[] = [];

        /**
         * 是否自动销毁
         */
        private $autoDestroy: boolean = false;

        /**
         * @autoDestroy: 是否自动销毁，默认为：true
         * export
         */
        constructor(autoDestroy: boolean = true) {
            super();
            this.$autoDestroy = autoDestroy;
            this.facade.registerObserver(NotifyKey.NEXT_LOGIC_COMMAND, this.$onNextLogicCommand, this);
            this.facade.registerObserver(NotifyKey.DESTROY_LOGIC_RUNNABLE, this.$onDestroyLogicRunnable, this);
            this.facade.registerObserver(NotifyKey.DESTROY_ALL_LOGIC_RUNNABLE, this.$onDestroyAllLogicRunnable, this);
        }

        destroy(): void {
            if (this.$destroyed === true) {
                return;
            }
            super.destroy();
            this.facade.removeObserver(NotifyKey.NEXT_LOGIC_COMMAND, this.$onNextLogicCommand, this);
            this.facade.removeObserver(NotifyKey.DESTROY_LOGIC_RUNNABLE, this.$onDestroyAllLogicRunnable, this);
            this.facade.removeObserver(NotifyKey.DESTROY_ALL_LOGIC_RUNNABLE, this.$onDestroyAllLogicRunnable, this);

            for (let i: number = 0; i < this.$commands.length; i++) {
                this.$commands[i].destroy();
            }
        }

        private $onDestroyAllLogicRunnable(): void {
            this.destroy();
        }

        private $onDestroyLogicRunnable(hashId: number): void {
            if (this.$autoDestroy === false && this.$hashId === hashId) {
                this.destroy();
            }
        }

        private $onNextLogicCommand(command: GUILogicCommand): void {
            let index: number = -1;
            for (let i: number = 0; i < this.$commands.length; i++) {
                if (this.$commands[i] === command) {
                    index = i;
                    break;
                }
            }
            if (index === -1) {
                return;
            }
            index++;
            this.facade.notifyCancel();

            if (index < this.$commands.length) {
                const command: GUILogicCommand = this.$commands[index];
                if (command.running === false) {
                    command.run();
                }
            }
            else if (this.$autoDestroy === true) {
                this.destroy();
            }
        }

        /**
         * 添加命令
         * @condition: 拦截条件，返回true时进行拦截
         * @dependencies：依赖列表
         * export
         */
        protected $addCommand(command: string, condition: suncom.IHandler, dependencies: GUILogicDependence[]): void {
            this.$commands.push(new GUILogicCommand(command, condition, dependencies));
            if (this.$commands[0].running === false) {
                this.$commands[0].run();
            }
        }

        /**
         * 获取Runnable的唯一ID（Runnable销毁时有用）
         * export
         */
        get hashId(): number {
            return this.$hashId;
        }
    }
}