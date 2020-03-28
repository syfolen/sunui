
module sunui {
    /**
     * 龙骨加载器
     */
    export class SkeletonLoader extends AssetLoader {
        /**
         * 龙骨动画模式
         */
        private $aniMode: number = 0;

        constructor(url: string, handler: suncom.IHandler, aniMode: number = 0) {
            super(url, handler);
            this.$aniMode = aniMode;
        }

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
                    templet.on(Laya.Event.COMPLETE, this, this.$onTempletCreated);
                    templet.loadAni(this.$url);
                }
                else if (templet.isParserComplete === false) {
                    templet.on(Laya.Event.COMPLETE, this, this.$onTempletCreated);
                }
                else {
                    const handler: suncom.IHandler = suncom.Handler.create(this, this.$onTempletCreated);
                    suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_0, handler);
                }
                // 加锁防止Laya.Event.COMPLETE事件不被回调
                Resource.lock(this.$url);
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
                this.$onComplete(true, templet.buildArmature(this.$aniMode));
            }
            Resource.unlock(this.$url);
        }
    }
}