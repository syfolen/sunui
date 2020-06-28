
module sunui {
    /**
     * 3D资源加载器
     */
    export class Res3dLoader extends AssetLoader {

        /**
         * 加载3D资源配置文件
         */
        protected $doLoad(): void {
            const url: string = Resource.getRes3dJsonUrl(this.$url);
            const loaded: boolean = Laya.loader.getRes(this.$url) === void 0 ? false : true;
            if (suncom.Common.getFileExtension(this.$url) === "ls" || loaded === true) {
                this.$loadAssets([url]);
            }
            else {
                this.$loaders.push(new UrlSafetyLoader(url, suncom.Handler.create(this, this.$onUrlLoaded)));
            }
        }

        /**
         * 3D资源json配置文件加载回调
         */
        private $onUrlLoaded(ok: boolean, url: string): void {
            if (ok === true) {
                const res: any = M.cacheMap[this.$url] || null;
                if (res === null) {
                    this.$loadAssets([this.$url]);
                }
                else {
                    this.$onAssetsLoaded(true);
                }
            }
            else {
                this.$onComplete(false);
            }
        }

        /**
         * 3D对象创建成功
         */
        protected $onAssetsLoaded(ok: boolean): void {
            if (suncom.Common.getFileExtension(this.$url) === "ls") {
                this.$onComplete(ok);
            }
            else {
                let res: any = M.cacheMap[this.$url] || null;
                if (res === null) {
                    res = M.cacheMap[this.$url] = Laya.loader.getRes(this.$url);
                }
                this.$onComplete(ok);
            }
        }
    }
}