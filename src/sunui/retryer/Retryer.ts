
module sunui {
    /**
     * 重试机制
     * export
     */
    export class Retryer extends puremvc.Notifier implements IRetryer {
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
        private $confirmHandler: suncom.IHandler;

        /**
         * 提示文本
         */
        private $prompt: string;

        /**
         * 提示选项
         */
        private $options: IRetryOption[] = [];

        /**
         * 当前重试次数
         */
        private $currentRetries: number = 0;

        /**
         * 重试回调
         */
        private $retryHandler: suncom.IHandler = null;

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
         * @options: [RetryOptionValueEnum, string, ...]
         * 说明：
         * 1. method允许值为 RetryMethodEnum 或 suncore.ModuleEnum 或同时输入这两种值
         * 2. 若未输入 RetryMethodEnum ，则默认值为 RetryMethodEnum.NONE
         * 3. 若未输入 suncore.ModuleEnum ，则默认值为 suncore.ModuleEnum.SYSTEM
         * export 
         */
        constructor(method: RetryMethodEnum | suncore.ModuleEnum, confirmHandler: suncom.IHandler = null, prompt: string = null, ...options: Array<string | RetryOptionValueEnum>) {
            super(suncore.MsgQModEnum.MMI);

            if ((method & RetryMethodEnum.CONFIRM) === RetryMethodEnum.CONFIRM) {
                this.$method = RetryMethodEnum.CONFIRM;
            }
            else {
                this.$method = RetryMethodEnum.NONE;
            }

            method &= 0xF;
            if (method === suncore.ModuleEnum.CUSTOM || method === suncore.ModuleEnum.TIMELINE) {
                this.$mod = method;
            }
            else {
                this.$mod = suncore.ModuleEnum.SYSTEM;
            }

            this.$prompt = prompt;
            this.$confirmHandler = confirmHandler;

            for (let i: number = 0; i < options.length; i += 2) {
                const text: string = options[i + 1] as string;
                const value: RetryOptionValueEnum = options[i] as RetryOptionValueEnum;

                const option: IRetryOption = {
                    text: text,
                    value: value
                }
                this.$options.push(option);
            }
        }

        /**
         * 执行接口
         * @delay: 重试延时
         * @maxRetries: 最大重试次数，默认为：2
         * @return: 返回true表示允许重试
         * export
         */
        run(delay: number, handler: suncom.IHandler, maxRetries: number = 2): void {
            if (this.$currentRetries < maxRetries) {
                if (this.$retryTimerId === 0) {
                    this.$retryHandler = handler;
                    this.$retryTimerId = suncore.System.addTimer(suncore.ModuleEnum.SYSTEM, delay, this.$onRetryTimer, this, 1);
                }
                else {
                    console.warn(`己忽略的重试请求 method:${suncom.Common.getMethodName(handler.method, handler.caller)}, caller:${suncom.Common.getQualifiedClassName(handler.caller)}`);
                }
            }
            else if (this.$method === RetryMethodEnum.NONE) {
                this.$confirmHandler.runWith(RetryOptionValueEnum.YES);
            }
            else {
                if (this.$prompting === false) {
                    this.$prompting = true;
                    const handler: suncom.IHandler = suncom.Handler.create(this, this.$onConfirmRely);
                    this.facade.sendNotification(NotifyKey.RETRY_CONFIRM, [this.$mod, this.$prompt, this.$options, handler]);
                }
                else {
                    console.warn(`己忽略的重试的询问请求 prompt:${this.$prompt}`);
                }
            }
        }

        /**
         * 询问答复回调
         */
        private $onConfirmRely(option: RetryOptionValueEnum): void {
            if (this.$prompting === true) {
                this.$prompting = false;
                this.$confirmHandler.runWith(option);
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
         * 当前重试次数
         * export
         */
        get currentRetries(): number {
            return this.$currentRetries;
        }
    }
}