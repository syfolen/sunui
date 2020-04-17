
module sunui {
    /**
     * 场景配置信息
     */
    export namespace SceneManager {
        /**
         * 场景配置信息列表
         */
        const $infos: ISceneInfo[] = [];

        /**
         * 注册场景
         */
        export function regScene(info: ISceneInfo): void {
            for (let i: number = 0; i < $infos.length; i++) {
                if ($infos[i].name === info.name) {
                    throw Error("重复注册场景");
                }
            }
            $infos.push(info);
        }

        /**
         * 根据名字获取配置
         */
        export function getConfigByName(name: number): ISceneInfo {
            for (let i: number = 0; i < $infos.length; i++) {
                const info: ISceneInfo = $infos[i];
                if (info.name === name) {
                    return info;
                }
            }
            throw Error("场景配置不存在");
        }
    }
}