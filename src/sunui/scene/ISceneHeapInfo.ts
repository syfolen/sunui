
module sunui {
    /**
     * 场景历史信息
     */
    export interface ISceneHeapInfo {
        /**
         * 场景枚举值
         */
        name: number;

        /**
         * 参数对象，场景历史会暂时地持有场景数据，直到场景从历史中被移除
         */
        data: any;
    }
}