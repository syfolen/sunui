
module sunui {
    /**
     * 逻辑消息拦截器
     * export
     */
    export abstract class GUILogicInterceptor extends puremvc.Notifier {
        /**
         * 需要拦截的命令
         */
        protected $var_command: string;

        /**
         * 拦截条件（返回true时表示符合拦截条件）
         */
        protected $var_condition: suncom.Handler;

        /**
         * 是否解除拦截
         */
        protected $var_relieved: boolean = false;

        /**
         * @condition: 返回true时表示符合拦截条件
         * export
         */
        constructor(command: string, condition: suncom.Handler) {
            super();
            this.$var_command = command;
            this.$var_condition = condition;
            this.facade.registerObserver(command, this.$func_onCommandCallback, this, false, suncom.EventPriorityEnum.HIGHEST);
        }

        destroy(): void {
            if (this.$destroyed === true) {
                return;
            }
            super.destroy();
            this.facade.removeObserver(this.$var_command, this.$func_onCommandCallback, this);
        }

        protected abstract $func_onCommandCallback(): void;

        get var_command(): string {
            return this.$var_command;
        }

        get var_relieved(): boolean {
            return this.$var_relieved;
        }
    }
}