
module sunui {
    /**
     * 弹出缓动信息接口，接口数据展示了执行弹出时支持的所有属性
     * export
     */
    export interface IViewProps {
        /**
         * 弹框的时间模块
         * export
         */
        mod?: suncore.ModuleEnum;

        /**
         * 参数列表，此参数会通过IPopupView的$onOpen方法传入IPopupView，用于支持窗口之间的交互
         * export
         */
        args?: any;

        /**
         * 显示层级
         * export
         */
        level?: UILevel;

        /**
         * 背景是否通透
         * export
         */
        trans?: boolean;

        /**
         * 是否允许取消
         * export
         */
        cancelAllowed?: boolean;

        /**
         * 弹框关闭时是否保留节点，默认为：false
         * export
         */
        keepNode?: boolean;
    }
}