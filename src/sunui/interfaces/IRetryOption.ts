
module sunui {
	/**
	 * 重试选项接口
	 * export
	 */
	export interface IRetryOption {
		/**
		 * 选项文本
		 * export
		 */
		text: string;

		/**
		 * 选项值
		 * export
		 */
		value: RetryOptionValueEnum;
	}
}