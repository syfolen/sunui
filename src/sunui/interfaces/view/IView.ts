
module sunui {

    export interface IView extends IPopupView {
        name: string;

        alpha?: number;
        level?: UILevel;

        x?: number;
        y?: number;

        width: number;
        height: number;

        left?: number;
        right?: number;

        top?: number;
        bottom?: number;

        scaleX: number;
        scaleY: number;

        centerX?: number;
        centerY?: number;
    }
}