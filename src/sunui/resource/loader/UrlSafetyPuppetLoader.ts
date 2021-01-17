
module sunui {
    /**
     * URL加载器傀儡（安全）
     * 说明：
     * 1. 主要用于实现模拟下载限速
     */
    export class UrlSafetyPuppetLoader extends UrlSafetyLoader {
        /**
         * 被加载的数据对象
         */
        private $data: any = null;

		/**
		 * 总大小，若为-1，则视为己存在
		 */
        private $totalSize: number = 0;

		/**
		 * 当前大小
		 */
        private $currentSize: number = 0;

		/**
		 * 优先级（0-5），为 0 时下载最快
		 */
        private $priority: number = suncom.Mathf.random(0, 6);

        /**
         * 开始加载
         */
        load(): void {
            // 资源己存在
            if (Laya.loader.getRes(this.url) !== void 0) {
                this.$totalSize = -1;
            }
            super.load();
        }

        /**
         * 加载结束回调
         */
        protected $onComplete(data: any): void {
            if (M.downloadSpeed === ResourceDownloadSpeedEnum.NONE) {
                super.$onComplete(data);
            }
            else {
                this.$data = data;
                this.$setDownloadSize();
                this.facade.registerObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
            }
        }

        /**
         * 加载进度
         */
        protected $onProgress(value: number): void {
            if (M.downloadSpeed === ResourceDownloadSpeedEnum.NONE) {
                super.$onProgress(value);
            }
        }

		/**
		 * 每帧更新己下载的大小
		 */
        private $onEnterFrame(): void {
            this.$currentSize += this.$getDowloadSpeed() * (10 - this.$priority) / 10;
            if (this.$totalSize > 0 && this.$currentSize >= this.$totalSize) {
                if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                    suncom.Logger.log(suncom.DebugMode.ANY, `[100%] ${this.url}:{${this.$totalSize}:${this.$totalSize}}`);
                }
                this.facade.removeObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
                this.$progress = 1;
                super.$onComplete(this.$data);
            }
            else if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                this.$progress = this.$currentSize / this.$totalSize;
                suncom.Logger.log(suncom.DebugMode.ANY, `[${Math.floor(this.$progress * 100)}%] ${this.url}:{${this.$currentSize}:${this.$totalSize}}`);
            }
        }

		/**
		 * 计算下载速度
		 */
        private $getDowloadSpeed(): number {
            if (M.loaders.length <= 1) {
                return M.downloadSpeed;
            }
            else {
                return M.downloadSpeed / M.loaders.length;
            }
        }

		/**
		 * 设置需要下载的资源大小
		 */
        private $setDownloadSize(): void {
            // 对于加载失败，或缓存的资源，大小视为1
            if (this.$data === null || this.$totalSize === -1) {
                this.$totalSize = 1;
            }
            // 对于图集资源，大小视为 2M
            else if (suncom.Common.getFileExtension(this.url) === "atlas") {
                this.$totalSize = 2 * 1024 * 1024;
            }
            // 对于图片资源，大小视为 64K
            else if (suncom.Common.getFileExtension(this.url) === "png" || suncom.Common.getFileExtension(this.url) === "jpg") {
                this.$totalSize = 64 * 1024;
            }
            // 对于JSON资源，大小视为 1K
            else if (suncom.Common.getFileExtension(this.url) === "json") {
                this.$totalSize = 1024;
            }
            // 对于龙骨资源，大小视为 1M
            else if (suncom.Common.getFileExtension(this.url) === "sk") {
                this.$totalSize = 1024 * 1024;
            }
            // 对于3D资源，大小视为 512K
            else if (suncom.Common.getFileExtension(this.url) === "lh") {
                this.$totalSize = 256 * 1024;
            }
            // 其它未知类型一律视为 256K
            else {
                this.$totalSize = 128 * 1024;
            }
        }
    }
}