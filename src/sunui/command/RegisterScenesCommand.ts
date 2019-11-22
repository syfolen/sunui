
module sunui {
    /**
     * 注册场景信息
     * export
     */
    export class RegisterScenesCommand extends puremvc.SimpleCommand {

        /**
         * @infos: 场景信息配置列表
         * export
         */
        execute(infos: Array<ISceneInfo>): void {
            for (let i: number = 0; i < infos.length; i++) {
                const info: ISceneInfo = infos[i];
                SceneManager.regScene(info);
            }
        }
    }
}