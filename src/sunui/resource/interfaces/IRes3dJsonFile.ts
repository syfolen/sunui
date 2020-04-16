
module sunui {
    /**
     * 3d资源配置文件格式
     */
    export interface IRes3dJsonFile {
        /**
         * 资源包名
         */
        pack: string;

        /**
         * 签名
         */
        sign: string;

        /**
         * 文件列表
         */
        files: string[];

        /**
         * 资源列表
         */
        resources: string[];
    }
}