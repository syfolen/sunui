
module sunui {
    /**
     * 场景信息
     * export
     */
    export interface ISceneInfo {
        /**
         * 场景名字
         * export
         */
        name: number;

        /**
         * 2D场景文件
         * export
         */
        scene2d: string;

        /**
         * 3D场景文件
         * export
         */
        scene3d?: string;

        /**
         * 初始化类
         * export
         */
        iniCls?: new (info: ISceneInfo, data?: any) => sunui.SceneIniClass;

        /**
         * 反初始化类
         * export
         */
        uniCls?: new (info: ISceneInfo) => sunui.SceneUniClass;
    }
}