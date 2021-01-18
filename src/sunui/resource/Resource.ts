
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
         * 资源预加载
         * @method: 预加载完成时，会执行此方法
         * @return: 返回资源组ID
         * 说明：
         * 1. 建议将业务逻辑的初始化代码放在资源加载完成之后，这样的话，在加载被取消时，也不需要对初始化进行撤销
         * export
         */
        export function prepare(urls: string[], method: (id: number, progress?: number) => void, caller: Object): number {
            let handler: suncom.IHandler = null;
            if (method === null) {
                handler = suncom.Handler.create(null, (id: number): void => { }, void 0, false);
            }
            else {
                handler = suncom.Handler.create(caller, method, void 0, false);
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
         * 立即创建 3d 对象
         * 说明：
         * 1. 同 createSync
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
         * 判断是否为fairygui资源
         */
        export function isFGuiUrl(url: string): boolean {
            return url.substr(0, 4) === "fgui";
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
         * 确认加载列表中的url正确性
         * export
         */
        export function checkLoadList(urls: string[]): string[] {
            Resource.removeUnnecessaryResources(urls, "sk", "png", "龙骨预加载无需指定PNG资源");
            Resource.removeUnnecessaryResources(urls, "fui", "png", "FGUI预加载无需指定PNG资源");
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