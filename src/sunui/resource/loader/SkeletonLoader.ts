
module sunui {
    /**
     * 龙骨加载器
     */
    export class SkeletonLoader extends AssetLoader {

        /**
         * 预加载龙骨资源
         */
        protected $doLoad(): void {
            this.$loadAssets([this.$url, suncom.Common.replacePathExtension(this.$url, "png")]);
        }

        /**
         * 所有资源均己加载成功
         */
        protected $onAssetsLoaded(ok: boolean): void {
            if (ok === true) {
                let templet: Laya.Templet = M.cacheMap[this.$url] || null;
                if (templet === null) {
                    templet = M.cacheMap[this.$url] = new Laya.Templet();
                    templet.loadAni(this.$url);
                }
                suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_0, this, this.$onTempletCreated);
                // 加锁防止Laya.Event.COMPLETE事件不被回调
                RES.lock(this.$url);
            }
            else {
                this.$onComplete(false);
            }
        }

        /**
         * 龙骨创建完成
         */
        private $onTempletCreated(): void {
            if (this.destroyed === false) {
                const templet: Laya.Templet = M.cacheMap[this.$url];
                this.$onComplete(true);
            }
            RES.unlock(this.$url);
        }
    }
}