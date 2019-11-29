
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
         * 初始化类
         * export
         */
        iniCls?: new (data?: any) => suncore.ITask;

        /**
         * 反初始化类
         * export
         */
        uniCls?: new () => suncore.ITask;
    }
}