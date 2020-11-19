
module sunui {
    /**
     * 逻辑消息拦截器
     * export
     */
    export abstract class GUILogicInterceptor extends puremvc.Notifier {
        /**
         * 需要拦截的命令
         */
        protected $command: string;

        /**
         * 拦截条件（返回true时表示符合拦截条件）
         */
        protected $condition: suncom.Handler;

        /**
         * 是否解除拦截
         */
        protected $relieved: boolean = false;

        /**
         * @condition: 返回true时表示符合拦截条件
         * export
         */
        constructor(command: string, condition: suncom.Handler) {
            super();
            this.$command = command;
            this.$condition = condition;
            this.facade.registerObserver(command, this.$onCommandCallback, this, false, suncom.EventPriorityEnum.HIGHEST);
        }

        destroy(): void {
            if (this.$destroyed === true) {
                return;
            }
            super.destroy();
            this.facade.removeObserver(this.$command, this.$onCommandCallback, this);
        }

        protected abstract $onCommandCallback(): void;

        get command(): string {
            return this.$command;
        }

        get relieved(): boolean {
            return this.$relieved;
        }
    }
}