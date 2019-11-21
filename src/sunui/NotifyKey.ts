
module sunui {

    /**
     * 命令枚举
     * export
     */
    export abstract class NotifyKey {
        /**
         * export
         */
        static readonly LOAD_SCENE: string = "sunui.NotifyKey.LOAD_SCENE";
        /**
         * export
         */
        static readonly UNLOAD_SCENE: string = "sunui.NotifyKey.UNLOAD_SCENE";

        /**
         * export
         */
        static readonly REGISTER_SCENES: string = "sunui.NotifyKey.REGISTER_SCENES";

        /**
         * export
         */
        static readonly EXIT_SCENE: string = "sunui.NotifyKey.EXIT_SCENE";
        /**
         * export
         */
        static readonly ENTER_SCENE: string = "sunui.NotifyKey.ENTER_SCENE";

        /**
         * export
         */
        static readonly SHOW_POPUP: string = "sunui.NotifyKey.SHOW_POPUP";
        /**
         * export
         */
        static readonly CLOSE_POPUP: string = "sunui.NotifyKey.CLOSE_POPUP";
    }
}