
module sunui {
	/**
	 * Retryer接口
	 * export
	 */
    export interface IRetryer {

        /**
         * 执行接口
         * @delay: 重试延时
         * @maxRetries: 最大重试次数，默认为：2
         * @return: 返回true表示允许重试
         * export
         */
        run(delay: number, handler: suncom.IHandler, maxRetries?: number): void;

        /**
         * 取消重试
         * export
         */
        cancel(): void;

        /**
         * 当前重试次数
         * export
         */
        readonly currentRetries: number;
    }
}