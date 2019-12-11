
module sunui {

    export class TempletGroup {

        private $urls: string[] = null;

        private $handler: Laya.Handler = null;

        private $doneList: string[] = [];

        private $undoList: string[] = [];

        private $retryTimes: number = 0;

        private $prepared: boolean = false;

        private $released: boolean = false;

        constructor(urls: string[], handler: Laya.Handler) {
            this.$handler = handler;
            this.$doPrepare(urls);
        }

        private $doPrepare(urls: string[]): void {
            this.$urls = urls;
            for (let i: number = 0; i < this.$urls.length; i++) {
                const url: string = this.$urls[i];
                Resource.create(url, this.$onResourceCreated, this);
            }
        }

        private $onResourceCreated(res: any, url: string): void {
            if (res instanceof Laya.Skeleton) {
                res.destroy();
            }
            if (res === null) {
                this.$undoList.push(url);
            }
            else {
                this.$doneList.push(url);
            }
            if (this.$doneList.length + this.$undoList.length === this.$urls.length) {
                this.$checkList();
            }
        }

        private $checkList(): void {
            if (this.$released === true) {
                this.$releaseResources(this.$doneList, this.$onResourceCreated, this);
            }
            else if (this.$undoList.length === 0) {
                Resource.prepare(this.$doneList, null, null);
                this.$releaseResources(this.$doneList, this.$onResourceCreated, this);
                this.$prepared = true;
                this.$handler.runWith(true);
            }
            else if (this.$retryTimes === 0) {
                const urls: string[] = this.$undoList.slice(0);
                this.$undoList.length = 0;
                this.$retryTimes = 1;
                this.$doPrepare(urls);
            }
            else {
                this.$releaseResources(this.$doneList, this.$onResourceCreated, this);
                this.$handler.runWith(false);
            }
        }

        private $releaseResources(urls: string[], method: Function, caller: Object): void {
            for (let i: number = 0; i < urls.length; i++) {
                const url: string = urls[i];
                Resource.destroy(url, this.$onResourceCreated, this);
            }
        }

        release(): void {
            this.$released = true;
            if (this.$prepared === true) {
                this.$checkList();
            }
        }
    }
}