
module sunui {

    /**
     * 弹出缓动信息接口
     * export
     */
    export interface IViewProps {
        x?: number;
        y?: number;
        alpha?: number;

        level?: number;
        trans?: boolean;
        cancelAllowed?: boolean;

        left?: number;
        right?: number;

        top?: number;
        bottom?: number;

        scaleX?: number;
        scaleY?: number;

        centerX?: number;
        centerY?: number;

        args?: any;
        keepNode?: boolean;
        viewClass?: new () => IView;
    }
}