
module sunui {
    /**
     * 重试机制
     * export
     */
    export class Retryer extends puremvc.Notifier implements IRetryer {
        /**
         * 提示类型
         */
        private $var_method: RetryMethodEnum = RetryMethodEnum.AUTO;

        /**
         * 询问回调
         */
        private $var_confirmHandler: suncom.IHandler = null;

        /**
         * 提示文本
         */
        private $var_prompt: string = null;

        /**
         * 提示选项
         */
        private $var_options: Array<ConfirmOptionValueEnum | string> = [];

        /**
         * 当前重试次数
         */
        private $var_currentRetries: number = 0;

        /**
         * 重试回调
         */
        private $var_retryHandler: suncom.IHandler = null;

        /**
         * 重试定时器
         */
        private $var_retryTimerId: number = 0;

        /**
         * 是否正在询问
         */
        private $var_prompting: boolean = false;

        /**
         * @confirmHandler: 若重试超过最大次数，则会执行此回调，默认为: null
         * @options: [ConfirmOptionValueEnum, string, ...]，默认为: null
         * export 
         */
        constructor(method: RetryMethodEnum, confirmHandler: suncom.IHandler = null, prompt: string = null, ...options: Array<ConfirmOptionValueEnum | string>) {
            super(suncore.MsgQModEnum.MMI);
            this.$var_method = method;
            this.$var_confirmHandler = confirmHandler;
            this.$var_prompt = prompt;
            this.$var_options = options;
        }

        /**
         * 执行接口
         * @delay: 重试延时，单位为毫秒
         * @maxRetries: 最大重试次数，默认为：2
         * @return: 返回true表示允许重试
         * export
         */
        run(delay: number, handler: suncom.IHandler, maxRetries: number = 2): void {
            if (this.$var_method === RetryMethodEnum.AUTO || this.$var_currentRetries < maxRetries) {
                if (this.$var_retryTimerId === 0) {
                    this.$var_retryHandler = handler;
                    this.$var_retryTimerId = suncore.System.addTimer(suncore.ModuleEnum.SYSTEM, delay, this.$func_onRetryTimer, this);
                }
                else {
                    suncom.Logger.warn(suncom.DebugMode.ANY, `己忽略的重试请求 method:${suncom.Common.getMethodName(handler.method, handler.caller)}, caller:${suncom.Common.getQualifiedClassName(handler.caller)}`);
                }
            }
            else {
                if (this.$var_prompting === false) {
                    this.$var_prompting = true;
                    if (this.$var_method === RetryMethodEnum.TERMINATE) {
                        suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_0, this, this.$func_onConfirmReplied, [ConfirmOptionValueEnum.NO]);
                    }
                    else {
                        const handler: suncom.IHandler = suncom.Handler.create(this, this.$func_onConfirmReplied);
                        this.facade.sendNotification(NotifyKey.RETRY_CONFIRM, [this.$var_prompt, this.$var_options, handler]);
                    }
                }
                else {
                    suncom.Logger.warn(suncom.DebugMode.ANY, `己忽略的重试的询问请求 prompt:${this.$var_prompt}`);
                }
            }
        }

        /**
         * 询问得到答复
         */
        private $func_onConfirmReplied(option: ConfirmOptionValueEnum): void {
            if (this.$var_prompting === true) {
                this.$var_prompting = false;
                if (this.$var_confirmHandler !== null) {
                    this.$var_confirmHandler.runWith(option);
                }
            }
        }

        /**
         * 重试定时器响应回调（执行重试的函数）
         */
        private $func_onRetryTimer(): void {
            this.$var_retryTimerId = 0;
            this.$var_currentRetries++;
            this.$var_retryHandler.run();
        }

        /**
         * 取消重试
         * export
         */
        cancel(): void {
            this.$var_prompting = false;
            this.$var_retryTimerId = suncore.System.removeTimer(this.$var_retryTimerId);
        }

        /**
         * 重置（仅会重置次数统计）
         * export
         */
        reset(): void {
            this.$var_currentRetries = 0;
        }

        /**
         * 当前重试次数
         * export
         */
        get currentRetries(): number {
            return this.$var_currentRetries;
        }
    }
}