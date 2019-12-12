
module sunui {

    export class Templet {

        private $res: any = null;

        private $handlers: Laya.Handler[] = [];

        private $referenceCount: number = 0;

        private $loading: boolean = false;

        create(url: string, method: Function, caller: Object): void {
            this.$referenceCount++;
            if (method !== null) {
                this.$handlers.push(Laya.Handler.create(caller, method));
            }
            /**
             * 说明：
             * 1. 此处无论资源是否己得到缓存，都应当重新加载，因为如果不重新加载而直接回调，则回调的发生有可能在外部类的构造函数执行结束之前，这种情况就会引发一些错误
             */
            this.$load(url);
        }

        destroy(url: string, method: Function, caller: Object): void {
            for (let i: number = 0; i < this.$handlers.length; i++) {
                const handler: Laya.Handler = this.$handlers[i];
                if (handler.method === method && handler.caller === caller) {
                    this.$handlers.splice(i, 1);
                    break;
                }
            }
            this.$referenceCount--;
            if (this.$referenceCount > 0) {
                return;
            }
            else if (this.$referenceCount < 0) {
                throw Error(`资源计数不应当小于0 url:${url}, references:${this.$referenceCount}`);
            }
            if (this.$referenceCount === 0) {
                this.$cancel(url);
            }
            if (this.$res !== null) {
                if (this.$getResExt(url) === "sk") {
                    this.$res.off(Laya.Event.COMPLETE, this, this.$onLoad);
                    this.$res.off(Laya.Event.ERROR, this, this.$onLoad);
                    this.$res.destroy();
                }
                this.$res = null;
            }
            const loadList: string[] = this.$getLoadList(url);
            for (let i: number = 0; i < loadList.length; i++) {
                const str: string = loadList[i];
                Laya.loader.clearRes(str);
            }
        }

        private $load(url: string): void {
            if (this.$loading === false) {
                this.$loading = true;
                Laya.loader.load(this.$getLoadList(url), Laya.Handler.create(this, this.$onLoad, [url]));
            }
        }

        private $onLoad(url: string, ok: boolean): void {
            this.$loading = false;

            if (ok === false) {
                if (this.$res === null) {
                    console.error(`资源加载失败 url:${url}`);
                }
                else {
                    console.error(`龙骨载入失败 url:${url}`);
                }
                this.$doCreate(url, false);
                return;
            }

            if (this.$getResExt(url) === "sk") {
                if (this.$res === null) {
                    const templet: Laya.Templet = this.$res = new Laya.Templet();
                    templet.on(Laya.Event.COMPLETE, this, this.$onLoad, [url, true]);
                    templet.on(Laya.Event.ERROR, this, this.$onLoad, [url, false]);
                    templet.loadAni(url);
                    this.$loading = true;
                    return;
                }
            }
            else if (this.$res === null) {
                this.$res = Laya.loader.getRes(url);
            }

            if (this.$res !== null) {
                this.$doCreate(url, true);
            }
            else {
                console.error(`资源加载失败：url:`);
                this.$doCreate(url, false);
            }
        }

        private $doCreate(url: string, ok: boolean): void {
            const handlers: Laya.Handler[] = this.$handlers.slice(0);
            this.$handlers = [];

            if (ok === false) {
                this.$referenceCount = 1;
                this.destroy(url, null, null);
            }

            const ext: string = this.$getResExt(url);
            while (handlers.length > 0) {
                const handler: Laya.Handler = handlers.shift();
                if (ok === false) {
                    handler.runWith([null, url]);
                }
                else if (ext === "sk") {
                    const ske: Laya.Skeleton = this.$res.buildArmature(2);
                    handler.runWith([ske, url]);
                }
                else if (ext === "png" || ext === "jpg") {
                    handler.runWith([Laya.loader.getRes(url), url]);
                }
                else {
                    console.error(`暂时不支持这种资源类型的管理 url:${url}`);
                    handler.runWith([null, url]);
                }
            }
        }

        private $cancel(url: string): void {
            if (this.$loading === true) {
                this.$loading = false;
                Laya.loader.cancelLoadByUrl(url);
            }
        }

        private $getLoadList(url: string): string[] {
            const index: number = url.lastIndexOf(".");
            const str: string = url.substr(0, index);
            const ext: string = url.substr(index + 1);
            if (ext === "sk") {
                return [
                    str + ".sk",
                    str + ".png"
                ];
            }
            else {
                return [url];
            }
        }

        private $getResExt(url: string): string {
            const index: number = url.lastIndexOf(".");
            const exten: string = url.substr(index + 1);
            return exten;
        }

        get referenceCount(): number {
            return this.$referenceCount;
        }
    }
}