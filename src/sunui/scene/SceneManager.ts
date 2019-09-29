
module sunui {

    /**
     * 场景配置信息
     */
    export abstract class SceneManager {

        private static $infos: Array<ISceneInfo> = [];

        /**
         * 注册场景
         */
        static regScene(info: ISceneInfo): void {
            for (let i: number = 0; i < SceneManager.$infos.length; i++) {
                if (SceneManager.$infos[i].name === info.name) {
                    throw Error("重复注册场景");
                }
            }
            SceneManager.$infos.push(info);
        }

        /**
         * 获取场景配置
         */
        static getConfigByName(name: number): ISceneInfo {
            for (let i: number = 0; i < SceneManager.$infos.length; i++) {
                const info: ISceneInfo = SceneManager.$infos[i];
                if (info.name === name) {
                    return info;
                }
            }
            throw Error("场景配置不存在");
        }
    }
}