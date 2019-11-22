
module sunui {

    /**
     * 弹出框配置信息
     */
    export interface IViewStackInfo {
        /**
         * 视图对象
         */
        view: IView;

        /**
         * 视图对象类型
         */
        viewClass: new () => IView;

        /**
         * 遮罩对象
         */
        mask?: IView;

        /**
         * 缓动信息
         */
        props: IViewProps;

        /**
         * 视图层级
         */
        level: UILevel;

        /**
         * 是否己关闭
         */
        closed?: boolean;

        /**
         * 是否己显示
         */
        displayed?: boolean;

        /**
         * 缓动时间
         */
        duration?: number;

        /**
         * 是否保留节点
         */
        keepNode?: boolean;

        /**
         * 是否允许点击背景取消弹框
         */
        cancelAllowed?: boolean;
    }
}