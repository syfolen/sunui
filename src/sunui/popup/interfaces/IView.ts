module sunui {
    /**
     * 弹出对象属性接口，接口数据展示了弹出对象自身支持的所有属性
     */
    export interface IView {
        /**
         * 弹框名字
         */
        name: string;

        /**
         * 是否为大分辨率
         */
        is1920x1080?: boolean;

        /**
         * 弹框大小
         */
        winSize?: PopupWinSizeEnum;

        /**
         * 父级对象
         */
        parent?: Laya.Node;

        /**
         * 透明度
         */
        alpha?: number;

        /**
         * 弹框显示层级
         */
        zOrder?: UILevel;

        /**
         * 是否自动销毁
         */
        autoDestroy?: boolean;

        /**
         * 弹框坐标
         */
        x?: number;
        y?: number;

        /**
         * 弹框宽高
         */
        width: number;
        height: number;

        /**
         * 弹框的左右自适应参数
         */
        left?: number;
        right?: number;

        /**
         * 弹框的上下自适应参数
         */
        top?: number;
        bottom?: number;

        /**
         * 弹框的居中自适应参数
         */
        centerX?: number;
        centerY?: number;

        /**
         * 弹框的变形参数
         */
        scaleX: number;
        scaleY: number;
    }
}