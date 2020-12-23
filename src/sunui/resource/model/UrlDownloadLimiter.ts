
module sunui {
	/**
	 * 下载限制器
	 * 说明：
	 * 1. 用于模拟下载网速限制
	 */
	export class UrlDownloadLimiter extends puremvc.Notifier {
		/**
		 * 下载网址
		 */
		private $url: string = null;

		/**
		 * 数据对象
		 */
		private $data: any = null;

		/**
		 * 完成下载回调
		 * 说明：
		 * 1. 在模拟的网速限制下，完成下载后会执行此回调器
		 */
		private $handler: suncom.IHandler = null;

		/**
		 * 总大小，若为-1，则视为己存在
		 */
		private $totalSize: number = 0;

		/**
		 * 当前大小
		 */
		private $currentSize: number = 0;

		/**
		 * 优先级（0-5），为0时下载最快
		 */
		private $priority: number = 0;

		constructor(url: string, handler: suncom.IHandler) {
			super();
			this.$url = url;
			this.$handler = handler;
			this.$priority = suncom.Mathf.random(0, 6);
			// 资源己存在
			if (Laya.loader.getRes(url) !== void 0) {
				this.$totalSize = -1;
			}
			M.downloadLimiters.push(this);
		}

		/**
		 * 销毁限制器
		 */
		destroy(): void {
			if (this.$destroyed === true) {
				return;
			}
			super.destroy();

			const index: number = M.downloadLimiters.indexOf(this);
			if (index < 0) {
				throw Error(`加载限制器不存在：index:${index}`);
			}
			M.downloadLimiters.splice(index, 1);
			this.facade.removeObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
		}

		/**
		 * 更新需要下载的大小
		 */
		updateDownloadSize(res: any): void {
			// 对于加载失败，或缓存的资源，大小视为1
			if (res === null || this.$totalSize === -1) {
				this.$totalSize = 1;
			}
			// 对于图集资源，大小视为 2M
			else if (suncom.Common.getFileExtension(this.$url) === "atlas") {
				this.$totalSize = 2 * 1024 * 1024;
			}
			// 对于图片资源，大小视为 64K
			else if (suncom.Common.getFileExtension(this.$url) === "png" || suncom.Common.getFileExtension(this.$url) === "jpg") {
				this.$totalSize = 64 * 1024;
			}
			// 对于JSON资源，大小视为 1K
			else if (suncom.Common.getFileExtension(this.$url) === "json") {
				this.$totalSize = 1024;
			}
			// 对于龙骨资源，大小视为 1M
			else if (suncom.Common.getFileExtension(this.$url) === "sk") {
				this.$totalSize = 1024 * 1024;
			}
			// 对于3D资源，大小视为 256K
			else if (suncom.Common.getFileExtension(this.$url) === "lh") {
				this.$totalSize = 256 * 1024;
			}
			else {
				// 未知类型的预加载对象
				this.$totalSize = 1;
			}
			this.$data = res;
			this.facade.registerObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
		}

		/**
		 * 每帧更新己下载的大小
		 */
		private $onEnterFrame(): void {
			this.$currentSize += this.$getDowloadSpeed() * (10 - this.$priority) / 10;
			if (this.$totalSize > 0 && this.$currentSize > this.$totalSize) {
				suncom.Logger.log(suncom.DebugMode.DEBUG, `[100%] ${this.$url}:{${this.$currentSize}:${this.$totalSize}}`);
				this.$handler.runWith(this.$data);
				this.destroy();
			}
			else {
				if (this.$totalSize > 0) {
					suncom.Logger.log(suncom.DebugMode.DEBUG, `[${Math.floor(this.$currentSize / this.$totalSize * 100)}%] ${this.$url}:{${this.$currentSize}:${this.$totalSize}}`);
				}
				else {
					suncom.Logger.log(suncom.DebugMode.DEBUG, `[0%] ${this.$url}:{${this.$currentSize}:${this.$totalSize}}`);
				}
			}
		}

		/**
		 * 计算下载速度
		 */
		private $getDowloadSpeed(): number {
			if (M.downloadLimiters.length <= 1) {
				return M.downloadSpeed;
			}
			else {
				return M.downloadSpeed / M.downloadLimiters.length;
			}
		}

		/**
		 * 获取文本文件的大小
		 */
		private $getStringSize(data: any): number {
			let str: string = null;
			let size: number = 0;

			if (data === null) {
				return 1;
			}

			if (typeof data === "number" || typeof data === "string") {
				str = data.toString();
			}
			else {
				str = JSON.stringify(data);
			}

			for (let i: number = 0; i < str.length; i++) {
				if (str.charCodeAt(i) <= 255) {
					size++;
				}
				else {
					size += 2;
				}
			}
			return size;
		}
	}
}