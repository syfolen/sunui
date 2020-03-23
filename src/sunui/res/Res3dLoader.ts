
module sunui {
    /**
     * 3D资源加载器
     */
    export class Res3dLoader extends UrlLoader {

        /**
         * 开始加载
         */
        load(): void {
            const url: string = Resource.getRes3dJsonUrl(this.$url);
            Laya.loader.load([url], Laya.Handler.create(this, this.$onUrlLoad));
        }

        /**
         * 结束加载
         */
        private $onUrlLoad(ok: boolean): void {
            if (this.$handler === null) {
                return;
            }
            Laya.loader.create([this.$url], Laya.Handler.create(this, this.$onLoad));
        }

        /**
         * 创建对象
         */
        create(): Laya.Sprite3D {
            if (suncom.Common.getFileExtension(this.$url) === "ls") {
                return Laya.loader.getRes(this.$url);
            }
            else {
                return Laya.Sprite3D.instantiate(Laya.loader.getRes(this.$url));
            }
        }
    }
}