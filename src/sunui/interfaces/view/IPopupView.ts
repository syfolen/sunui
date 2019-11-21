
module sunui {
    /**
     * export
     */
    export interface IPopupView {

        $onOpen?(): void;

        $onEnable?(): void;

        $onDisable?(): void;

        $onRemove?(): void;
    }
}