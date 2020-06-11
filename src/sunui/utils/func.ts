
module sunui {

    /**
     * 在对象或子对象中查找
     * export
     */
    export function find<T>(path: string, parent: Laya.Node): T {
        const array: string[] = path.split("/");
        while (parent != null && array.length > 0) {
            const name: string = array.shift();
            parent = parent.getChildByName(name);
        }
        return parent as any;
    }
}