
module sunui {

    /**
     * 在对象或子对象中查找
     * export
     */
    export function find(path: string, parent: Laya.Node): any {
        const array: string[] = path.split("/");
        while (parent != null && array.length > 0) {
            const name: string = array.shift();
            parent = parent.getChildByName(name);
        }
        return parent;
    }
}