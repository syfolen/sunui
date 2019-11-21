
module sunui {

    /**
     * 注册所有场景
     * export
     */
    export class RegisterScenesCommand extends puremvc.SimpleCommand {

        /**
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