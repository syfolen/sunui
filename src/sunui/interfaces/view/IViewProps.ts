
module sunui {

    /**
     * 弹出缓动信息接口，接口数据展示了执行弹出时支持的所有属性
     * export
     */
    export interface IViewProps {
        /**
         * 坐标
         * export
         */
        x?: number;

        /**
         * export
         */
        y?: number;

        /**
         * 缓动方法
         * export
         */
        ease?: Function;

        /**
         * 透明度
         */
        alpha?: number;

        /**
         * 显示层级
         * export
         */
        level?: UILevel;

        /**
         * 是否通透
         * export
         */
        trans?: boolean;

        /**
         * 是否允许取消
         * export
         */
        cancelAllowed?: boolean;

        /**
         * 弹框的左右自适应参数
         * export
         */
        left?: number;

        /**
         * export
         */
        right?: number;

        /**
         * 弹框的上下自适应参数
         * export
         */
        top?: number;

        /**
         * export
         */
        bottom?: number;

        /**
         * 弹框的居中自适应参数
         * export
         */
        centerX?: number;

        /**
         * export
         */
        centerY?: number;

        /**
         * 弹出的变形系数
         * export
         */
        scaleX?: number;

        /**
         * export
         */
        scaleY?: number;

        /**
         * 参数列表，此参数会通过IPopupView的$onOpen方法传入IPopupView，用于支持窗口之间的交互
         * export
         */
        args?: any;

        /**
         * 弹框关闭时是否保留节点，默认为false
         * export
         */
        keepNode?: boolean;

        /**
         * 弹框对象类型
         */
        viewClass?: new () => IView;
    }
}