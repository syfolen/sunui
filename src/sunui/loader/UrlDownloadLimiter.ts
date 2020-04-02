
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

		constructor(url: string, handler: suncom.IHandler) {
			super();
			this.$url = url;
			this.$handler = handler;
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
			// 对于图集资源，大小视为altas和png的大小总和
			else if (suncom.Common.getFileExtension(this.$url) === "atlas") {
				const png: Laya.Texture2D = Laya.loader.getRes(suncom.Common.replacePathExtension(this.$url, "png")) || null;
				const size: number = (png === null ? 0 : png["gpuMemory"]) || 1;
				this.$totalSize = size + this.$getStringSize(Laya.loader.getRes(this.$url) || null);
			}
			else if (suncom.Common.getFileExtension(this.$url) === "png" || suncom.Common.getFileExtension(this.$url) === "jpg") {
				const png: Laya.Texture = Laya.loader.getRes(suncom.Common.replacePathExtension(this.$url, "png")) || null;
				this.$totalSize = (png === null ? 0 : png.bitmap["gpuMemory"]) || 1;
			}
			else if (suncom.Common.getFileExtension(this.$url) === "json") {
				this.$totalSize = this.$getStringSize(Laya.loader.getRes(this.$url) || null);
			}
			else if (suncom.Common.getFileExtension(this.$url) === "sk") {
				const sk: ArrayBuffer = res as ArrayBuffer;
				this.$totalSize = sk.byteLength;
			}
			else if (suncom.Common.getFileExtension(this.$url) === "lh") {
				const json: IRes3dJsonFile = Laya.loader.getRes(suncom.Common.replacePathExtension(this.$url, "json"));
				const urls: string[] = Resource.getAssetUrlsByRes3dJson(json);
				for (let i: number = 0; i < urls.length; i++) {
					const url: string = urls[i];
					const data: any = Laya.loader.getRes(url) || null;
					if (data["gpuMemory"] > 0) {
						this.$totalSize += data["gpuMemory"];
					}
					else {
						try {
							this.$totalSize += this.$getStringSize(data);
						}
						catch (error) {
							this.$totalSize += 1;
						}
					}
				}
			}
			else {
				this.$totalSize = 1;
				// 未知类型的预加载对象
				debugger;
			}
			this.$data = res;
			this.facade.registerObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
		}

		/**
		 * 每帧更新己下载的大小
		 */
		private $onEnterFrame(): void {
			this.$currentSize += this.$getDowloadSpeed();
			if (this.$totalSize > 0 && this.$currentSize > this.$totalSize) {
				if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
					suncom.Logger.log(`[100%] ${this.$url}:{${this.$currentSize}:${this.$totalSize}}`);
				}
				this.$handler.runWith(this.$data);
				this.destroy();
			}
			else if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
				if (this.$totalSize > 0) {
					suncom.Logger.log(`[${Math.floor(this.$currentSize / this.$totalSize * 100)}%] ${this.$url}:{${this.$currentSize}:${this.$totalSize}}`);
				}
				else {
					suncom.Logger.log(`[0%] ${this.$url}:{${this.$currentSize}:${this.$totalSize}}`);
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