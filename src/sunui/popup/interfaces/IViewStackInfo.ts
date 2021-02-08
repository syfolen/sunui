
module sunui {
    /**
     * 弹出框配置信息
     */
    export interface IViewStackInfo {
        /**
         * 视图节点
         */
        view: IView;

        /**
         * 遮罩对象
         */
        mask: Laya.Image | fairygui.GLoader;

        /**
         * 缓动信息
         */
        props: IViewProps;

        /**
         * 是否己关闭
         */
        closed: boolean;

        /**
         * 是否己显示
         */
        displayed: boolean;

        /**
         * 缓动时间
         */
        duration: number;

        /**
         * 是否保留节点
         */
        keepNode: boolean;

        /**
         * 是否自动销毁
         */
        autoDestroy: boolean;

        /**
         * 是否允许点击背景取消弹框
         */
        cancelAllowed: boolean;
    }
}