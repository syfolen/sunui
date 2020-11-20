
module sunui {
    /**
     * 重试机制
     * export
     */
    export class Retryer extends puremvc.Notifier {
        /**
         * 响应重试机制的模块
         */
        private $mod: suncore.ModuleEnum;

        /**
         * 提示类型
         */
        private $method: RetryMethodEnum | suncore.ModuleEnum;

        /**
         * 询问回调
         */
        private $confirmHandler: suncom.Handler;

        /**
         * 提示文本
         */
        private $prompt: string;

        /**
         * 提示选项
         */
        private $options: Array<ConfirmOptionValueEnum | string> = [];

        /**
         * 当前重试次数
         */
        private $currentRetries: number = 0;

        /**
         * 重试回调
         */
        private $retryHandler: suncom.Handler = null;

        /**
         * 重试定时器
         */
        private $retryTimerId: number = 0;

        /**
         * 是否正在询问
         */
        private $prompting: boolean = false;

        /**
         * @confirmHandler: 若重试超过最大次数，则会执行此回调
         * @options: [ConfirmOptionValueEnum, string, ...]
         * 说明：
         * 1. method允许值为 RetryMethodEnum 或 suncore.ModuleEnum 或同时输入这两种值
         * 2. 若未输入 RetryMethodEnum ，则默认值为 RetryMethodEnum.AUTO
         * 3. 若未输入 suncore.ModuleEnum ，则默认值为 suncore.ModuleEnum.SYSTEM
         * export 
         */
        constructor(modOrMethod: suncore.ModuleEnum | RetryMethodEnum, confirmHandler: suncom.Handler = null, prompt: string = null, ...options: Array<ConfirmOptionValueEnum | string>) {
            super(suncore.MsgQModEnum.MMI);

            if ((modOrMethod & RetryMethodEnum.CONFIRM) === RetryMethodEnum.CONFIRM) {
                this.$method = RetryMethodEnum.CONFIRM;
            }
            else if ((modOrMethod & RetryMethodEnum.TERMINATE) === RetryMethodEnum.TERMINATE) {
                this.$method = RetryMethodEnum.TERMINATE;
            }
            else {
                this.$method = RetryMethodEnum.AUTO;
            }

            const mode: suncore.ModuleEnum = modOrMethod &= 0xF;
            if (modOrMethod === suncore.ModuleEnum.CUSTOM || modOrMethod === suncore.ModuleEnum.TIMELINE) {
                this.$mod = modOrMethod;
            }
            else {
                this.$mod = suncore.ModuleEnum.SYSTEM;
            }

            this.$prompt = prompt;
            this.$options = options;
            this.$confirmHandler = confirmHandler;
        }

        /**
         * 执行接口
         * @delay: 重试延时
         * @maxRetries: 最大重试次数，默认为：2
         * @return: 返回true表示允许重试
         * export
         */
        run(delay: number, handler: suncom.Handler, maxRetries: number = 2): void {
            if (this.$method === RetryMethodEnum.AUTO || this.$currentRetries < maxRetries) {
                if (this.$retryTimerId === 0) {
                    this.$retryHandler = handler;
                    this.$retryTimerId = suncore.System.addTimer(suncore.ModuleEnum.SYSTEM, delay, this.$onRetryTimer, this);
                }
                else {
                    suncom.Logger.warn(suncom.DebugMode.ANY, `己忽略的重试请求 method:${suncom.Common.getMethodName(handler.method, handler.caller)}, caller:${suncom.Common.getQualifiedClassName(handler.caller)}`);
                }
            }
            else {
                if (this.$prompting === false) {
                    this.$prompting = true;
                    if (this.$method === RetryMethodEnum.TERMINATE) {
                        const handler: suncom.Handler = suncom.Handler.create(this, this.$onConfirmReplied, [ConfirmOptionValueEnum.NO]);
                        suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_0, handler);
                    }
                    else {
                        const handler: suncom.Handler = suncom.Handler.create(this, this.$onConfirmReplied);
                        this.facade.sendNotification(NotifyKey.RETRY_CONFIRM, [this.$mod, this.$prompt, this.$options, handler]);
                    }
                }
                else {
                    suncom.Logger.warn(suncom.DebugMode.ANY, `己忽略的重试的询问请求 prompt:${this.$prompt}`);
                }
            }
        }

        /**
         * 询问得到答复
         */
        private $onConfirmReplied(option: ConfirmOptionValueEnum): void {
            if (this.$prompting === true) {
                this.$prompting = false;
                if (this.$confirmHandler !== null) {
                    this.$confirmHandler.runWith(option);
                }
            }
        }

        /**
         * 重试定时器响应回调（执行重试的函数）
         */
        private $onRetryTimer(): void {
            this.$retryTimerId = 0;
            this.$currentRetries++;
            this.$retryHandler.run();
        }

        /**
         * 取消重试
         * export
         */
        cancel(): void {
            this.$prompting = false;
            this.$retryTimerId = suncore.System.removeTimer(this.$retryTimerId);
        }

        /**
         * 重置（仅会重置次数统计）
         * export
         */
        reset(): void {
            this.$currentRetries = 0;
        }

        /**
         * 当前重试次数
         * export
         */
        get currentRetries(): number {
            return this.$currentRetries;
        }
    }
}