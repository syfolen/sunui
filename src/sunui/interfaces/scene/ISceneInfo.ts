
module sunui {

    /**
     * 场景信息
     */
    export interface ISceneInfo {
        /**
         * 场景名字
         */
        name: number;

        /**
         * 初始化类
         */
        iniCls?: new (args?: any) => suncore.ITask;

        /**
         * 反初始化类
         */
        uniCls?: new () => any;
    }
}