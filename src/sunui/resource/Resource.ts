
module sunui {
    /**
     * 资源管理器（主要用于资源的动态创建和销毁）
     * export
     */
    export namespace Resource {
        /**
         * 3D资源目录
         * export
         */
        export let res3dRoot: string = null;

        /**
         * 设置资源的加载速度
         * export
         */
        export function setDownloadSpeed(speed: ResourceDownloadSpeedEnum): void {
            M.downloadSpeed = speed;
        }

        /**
         * 锁定资源
         * 说明：
         * 1. 每次请求锁定资源，则资源的引用次数会-1
         * 2. 若为3d资源，则应当同时锁定资源包的配置文件
         * export
         */
        export function lock(url: string): void {
            // 禁止单独锁定3d资源配置文件
            if (suncom.Global.debugMode & suncom.DebugMode.ENGINE) {
                if (Resource.isRes3dUrl(url) === true && Resource.getRes3dJsonUrl(url) === url) {
                    return;
                }
            }
            const ext: string = suncom.Common.getFileExtension(url);
            const str: string = url.substr(0, url.length - ext.length);

            const urls: string[] = [url];
            // 图集和龙骨需要同时锁定PNG图片
            if (ext === "sk" || ext === "atlas") {
                urls.push(str + "png");
            }
            // 3d资源需要同时锁定json配置文件
            else if (Resource.isRes3dUrl(url) === true) {
                urls.push(str + "json");
            }

            for (let i: number = 0; i < urls.length; i++) {
                UrlLocker.lock(urls[i]);
            }
        }

        /**
         * 解锁资源
         * 说明：
         * 1. 每次请求解锁资源时，资源的引用次数会+1
         * 2. 若为3d资源，则应当同时解锁资源包的配置文件
         * 3. 当2d资源的引用次数为0时，资源会自动释放，当前的加载亦会取消
         * 4. 3d资源只有在资源包的配置文件的引用次数为0时才会释放
         * export
         */
        export function unlock(url: string): void {
            // 禁止单独解锁3D资源配置文件
            if (suncom.Global.debugMode & suncom.DebugMode.ENGINE) {
                if (Resource.isRes3dUrl(url) === true && Resource.getRes3dJsonUrl(url) === url) {
                    return;
                }
            }
            const ext: string = suncom.Common.getFileExtension(url);
            const str: string = url.substr(0, url.length - ext.length);

            const urls: string[] = [url];
            // 图集和龙骨需要同时解锁PNG图片
            if (ext === "sk" || ext === "atlas") {
                urls.push(str + "png");
            }
            // 3d资源只需要解锁json配置文件
            else if (Resource.isRes3dUrl(url) === true) {
                urls.push(str + "json");
            }

            for (let i: number = 0; i < urls.length; i++) {
                UrlLocker.unlock(urls[i]);
            }
        }

        /**
         * 资源预加载
         * @method: 预加载完成时，会执行此方法
         * @return: 返回资源组ID
         * 说明：
         * 1. 建议将业务逻辑的初始化代码放在资源加载完成之后，这样的话，在加载被取消时，也不需要对初始化进行撤销
         * export
         */
        export function prepare(urls: string[], method: (id: number) => void, caller: Object): number {
            let handler: suncom.Handler = null;
            if (method === null) {
                handler = suncom.Handler.create(null, (id: number): void => { });
            }
            else {
                handler = suncom.Handler.create(caller, method);
            }

            const id: number = suncom.Common.createHashId();
            M.templets[id] = new Templet(id, urls, handler);
            return id;
        }

        /**
         * 释放资源组
         * @id: 资源组ID
         * @return: 始终返回0
         * export
         */
        export function release(id: number): number {
            const templet: Templet = M.templets[id] || null;
            if (templet !== null) {
                delete M.templets[id];
                templet.destroy();
            }
            return 0;
        }

        /**
         * 立即创建对象
         * 说明：
         * 1. 通过此方法创建对象并不会产生引用计数，且只需要在外部销毁即可
         * export
         */
        export function createSync(url: string, data?: any): any {
            let res: any = M.cacheMap[url] || null;
            if (suncom.Common.getFileExtension(url) === "sk") {
                return res.buildArmature(data);
            }
            else if (Resource.isRes3dUrl(url) === true) {
                if (res === null) {
                    res = M.cacheMap[url] = Laya.loader.getRes(url);
                }
                return Laya.Sprite3D.instantiate(res);
            }
            else {
                return Laya.loader.getRes(url);
            }
        }

        /**
         * 立即创建3d对象
         * 说明：
         * 1. 同createSync
         * export
         */
        export function createRes3dSync(name: string): any {
            return Resource.createSync(Resource.getRes3dUrlByName(name));
        }

        /**
         * 创建预置体
         * export
         */
        export function createPrefab(url: string): Laya.View {
            const prefab: Laya.Prefab = new Laya.Prefab();
            prefab.json = Laya.loader.getRes(url);
            return prefab.create();
        }

        /**
         * 根据Url清理资源
         */
        export function clearResByUrl(url: string): void {
            UrlLocker.clearResByUrl(url);
        }

        /**
         * 获取3D资源目录下的资源包路径
         */
        export function getRes3dPackRoot(pack: string): string {
            if (Resource.res3dRoot === null) {
                throw Error(`请先指定3D资源目录：sunui.Resource.res3dRoot=`);
            }
            return `${Resource.res3dRoot}/LayaScene_${pack}/Conventional/`;
        }

        /**
         * 判断是否为3D资源
         */
        export function isRes3dUrl(url: string): boolean {
            return url.indexOf(Resource.res3dRoot) === 0;
        }

        /**
         * 获取3D资源的配置文件地址
         * export
         */
        export function getRes3dJsonUrl(url: string): string {
            return suncom.Common.replacePathExtension(url, "json");
        }

        /**
         * 获取3D资源地址
         * @name: 如xxx或xxx.lh，若未指定扩展名，则认为是.lh
         * 说明：
         * 1. 所有3d资源都必须放在${Resource.res3dRoot}目录下
         * 2. 完整的3D资源目录必须为 ${Resource.res3dRoot}/LayaScene_${pack}/Conventional/ 否则将不能正确解析
         * export
         */
        export function getRes3dUrlByName(name: string): string {
            if (suncom.Common.getFileExtension(name) === null) {
                name += ".lh";
            }
            return Resource.getRes3dPackRoot(suncom.Common.getFileName(name)) + name;
        }

        /**
         * 根据JSON配置获取所有3D资源列表
         */
        export function getAssetUrlsByRes3dJson(json: IRes3dJsonFile): string[] {
            const urls: string[] = [];
            const root: string = Resource.getRes3dPackRoot(json.pack);

            for (let i: number = 0; i < json.files.length; i++) {
                urls.push(root + json.files[i]);
            }
            for (let i: number = 0; i < json.resources.length; i++) {
                urls.push(root + json.resources[i]);
            }

            return urls;
        }

        /**
         * 确认加载列表中的url正确性
         * export
         */
        export function checkLoadList(urls: string[]): string[] {
            Resource.removeUnnecessaryResources(urls, "sk", "png", "龙骨预加载无需指定PNG资源");
            Resource.removeUnnecessaryResources(urls, "atlas", "png", "图集预加载无需指定PNG资源");
            return Resource.removeDuplicateResources(urls);
        }

        /**
         * 移除重复的资源
         */
        export function removeDuplicateResources(urls: string[]): string[] {
            if (suncom.Global.debugMode & suncom.DebugMode.ENGINE) {
                const array: string[] = [];
                for (let i: number = 0; i < urls.length; i++) {
                    const url: string = urls[i];
                    if (array.indexOf(url) === -1) {
                        array.push(url);
                    }
                    else {
                        suncom.Logger.error(suncom.DebugMode.ANY, `重复的预加载资源文件 ${url}`);
                    }
                }
                return array;
            }
            return urls;
        }

        /**
         * 根据扩展名移除无需指定的资源文件
         */
        export function removeUnnecessaryResources(urls: string[], match: string, remove: string, msg: string): void {
            if (suncom.Global.debugMode & suncom.DebugMode.ENGINE) {
                const array: string[] = [];

                for (let i: number = 0; i < urls.length; i++) {
                    const url: string = urls[i];
                    if (suncom.Common.getFileExtension(url) === match) {
                        array.push(url);
                    }
                }

                for (let i: number = 0; i < array.length; i++) {
                    const url: string = array[i];
                    const png: string = url.substring(0, url.length - match.length) + remove;
                    do {
                        const index: number = urls.indexOf(png);
                        if (index === -1) {
                            break;
                        }
                        urls.splice(index, 1);
                        suncom.Logger.error(suncom.DebugMode.ANY, `${msg} ${url}`);
                    } while (true);
                }
            }
        }
    }
}