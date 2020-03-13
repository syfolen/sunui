# sunui

## UI库，封装了场景，弹框，缓动，资源加载等功能

***

## 常用特性列举

#### Resource 封装了资源动态加载和释放的接口

* 支持资源和资源组的动态加载和释放

* 允许对在外部加载的资源的动态释放管理

* 更多请参考 Resource 和 Loader 的接口

#### Retryer 重试机制

* 如果有一个业务的执行结果并不是百分百成功的，此时你可以使用重试机制

* Retryer 在你所指定的所有次数全部重试失败后，会有三种策略，详见 RetryMethodEnum

* 更多请参考 Retryer 的实现

* 应用范例：1. sunnet 的网络重连；2. Resource 的资源重加载

#### SceneLayer 中的场景跳转和历史机制

* SceneLayer 提供了进入新场景，替换当前场景和返回上一个场景这三种接口

* 场景数据应当通过 NotifyKey.REGISTER_SCENES 来注册，每个场景都支持为其指定初始化接口 IniClass 和 反初始化接口 UniClass 

* 更多请参考 SceneLayer 和 SceneHeap 和 UIManager

#### Tween 缓动

* 为了更方便缓动的清理，故缓动的实现主要依赖于 suncore 的时间轴

* 当正在执动的显示对象被销毁时，不要担心，因为缓动也会自动失效

* 缓动类提供了 from, to, by, wait, cancel 五个接口

* 更多请参考 Tween 类

#### ViewLayer 弹框机制

* 一般情况下，建议使用 ViewFacade 类来视图窗口的弹出和关闭

* 弹框的层级在 UILevel 中被指定，其中 LOADING 层级为系统弹框与场景弹框的分水岭

* 更多请参考 ViewLayer 和 ViewFacade 和 ShowPopupCommand 和 ClosePopupCommand
