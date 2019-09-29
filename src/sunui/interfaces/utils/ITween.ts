
module sunui {

    export interface ITween {

        to(props: any, duration: number, ease?: Function, handler?: suncom.IHandler): ITween;

        from(props: any, duration: number, ease?: Function, handler?: suncom.IHandler): ITween;
    }
}