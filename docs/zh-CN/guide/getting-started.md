# 快速开始

## 支持平台

目前 Vnite 只支持 Windows 平台，后续可能会支持 Android、iOS 等移动平台来远程串流 Windows 上的游戏，敬请期待。

## 下载并安装

Vnite 托管于 Github，所有的版本更新都以 release 形式发布，可在此处获取最新的安装包。

- https://github.com/ximu3/vnite/releases

## 添加游戏

Vnite 目前支持三种添加游戏的方式。

1. 使用刮削器 - 单个添加（要求：可被刮削器识别）
2. 使用刮削器 - 批量添加（要求：可被刮削器识别、本地存在游戏）
3. 不使用刮削器（要求：本地存在游戏）

### 单个添加

单个添加支持模糊搜索和精准刮削，模糊搜索语言支持和准确度由数据源决定。精准刮削需提供 `对应数据源` 的 `游戏 ID`。

![gameSingleAdder1](https://img.timero.xyz/i/2025/04/02/67ecf19c18a3c.webp)

![gameSingleAdder2](https://img.timero.xyz/i/2025/04/02/67ecf1b1b35d8.webp)

![gameSingleAdder3](https://img.timero.xyz/i/2025/04/02/67ecf1c222240.webp)

### 批量添加

选择一个库文件夹，Vnite 会读取所有一级子文件夹名作为游戏原名，用户可修改并附加 `对应数据源` 的 `游戏 ID` 来提高刮削准确性。每个游戏刮削进程独立，用户可对刮削失败的游戏进行调整和重试。

> [!TIP]
> 批量添加时用户无法选择背景图，默认使用第一张。

![gameBatchAdder](https://img.timero.xyz/i/2025/04/02/67ecf1ec53201.webp)

### 自定义添加

选择可执行文件路径即可完成添加，后续可自定义元数据或重新刮削。
