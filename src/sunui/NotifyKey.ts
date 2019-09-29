
module sunui {

    /**
     * 命令枚举
     */
    export abstract class NotifyKey {
        // 场景相关
        static readonly LOAD_SCENE: string = "sunui.NotifyKey.LOAD_SCENE";
        static readonly UNLOAD_SCENE: string = "sunui.NotifyKey.UNLOAD_SCENE";
        static readonly REGISTER_SCENES: string = "sunui.NotifyKey.REGISTER_SCENES";

        static readonly EXIT_SCENE: string = "sunui.NotifyKey.EXIT_SCENE";
        static readonly ENTER_SCENE: string = "sunui.NotifyKey.ENTER_SCENE";

        // 弹框相关
        static readonly SHOW_POPUP: string = "sunui.NotifyKey.SHOW_POPUP";
        static readonly CLOSE_POPUP: string = "sunui.NotifyKey.CLOSE_POPUP";
    }
}