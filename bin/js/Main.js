//程序入口
Laya.init(600, 400, Laya.WebGL);
//激活资源版本控制
Laya.ResourceVersion.enable("version.json", Laya.Handler.create(null, beginLoad), Laya.ResourceVersion.FILENAME_VERSION);
function beginLoad() {
    Laya.loader.load("res/atlas/comp.atlas", Laya.Handler.create(null, onLoaded));
}
function onLoaded() {
    //实例UI界面
    var testUI = new ui.test.TestPageUI();
    Laya.stage.addChild(testUI);
}
//# sourceMappingURL=Main.js.map