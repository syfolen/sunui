
module sunui {
    /**
     * 弹出缓动信息接口，接口数据展示了执行弹出时支持的所有属性
     * export
     */
    export interface IViewProps {
        /**
         * 弹框的时间模块，默认为：suncore.ModuleEnum.CUSTOM
         * 说明：
         * 1. 若当前mod为CUSTOM，但该模块处于停止状态，则此值自动变更为SYSTEM
         * export
         */
        mod?: suncore.ModuleEnum;

        /**
         * 坐标
         * export
         */
        x?: number;

        /**
         * depends
         */
        y?: number;

        /**
         * 通透值
         */
        alpha?: number;

        /**
         * 缓动方法
         * export
         */
        ease?: Function;

        /**
         * 背景是否通透，默认为：false
         * 说明：
         * 1. 此属性己弃用，将在未来的某个版本移除，请知悉
         * 2. 优先级次于PopupFlagEnum.TRANSPARENT标记
         * export
         */
        trans?: boolean;

        /**
         * 标记集合（多个标记允许并存）
         * export
         */
        flags?: PopupFlagEnum;

        /**
         * 显示层级
         * export
         */
        level?: UILevel;

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
         * depends
         */
        right?: number;

        /**
         * 弹框的上下自适应参数
         * export
         */
        top?: number;

        /**
         * depends
         */
        bottom?: number;

        /**
         * 弹框的居中自适应参数
         * export
         */
        centerX?: number;

        /**
         * depends
         */
        centerY?: number;

        /**
         * 弹出的变形系数
         * export
         */
        scaleX?: number;

        /**
         * depends
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
    }
}