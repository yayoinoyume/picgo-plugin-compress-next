
[中文](./README.md) <-| [English](./README.en.md)


### picgo-plugin-compress-next

> **这是 fork 版本**
>
> 上游：[supine0703/picgo-plugin-compress-next](https://github.com/supine0703/picgo-plugin-compress-next)（npm 上的 `1.5.2`）
> 本仓库修复了上游在 **PicGo 3.x** 下会导致上传失败的若干问题，详见下方[修复记录](#-本-fork-修复记录)。

[![dm](https://img.shields.io/npm/dm/picgo-plugin-compress-next?color=brightgreen)](https://npmcharts.com/compare/picgo-plugin-compress-next?minimal=true) [![v](https://img.shields.io/npm/v/picgo-plugin-compress-next?color=brightgreen)](https://www.npmjs.com/package/picgo-plugin-compress-next) [![mit](https://img.shields.io/badge/license-mit-brightgreen.svg)](https://github.com/supine0703/picgo-plugin-compress-next/blob/master/LICENSE)


### 🍴 分支

这是 [picgo-plugin-compress-webp-lossless](https://github.com/mrgeneralgoo/picgo-plugin-compress-webp-lossless) 的一个分支，同时它又是 [picgo-plugin-compress](https://github.com/JuZiSang/picgo-plugin-compress) 的分支


### 🚀 部署使用

#### [PicGo-Gui](https://github.com/Molunerfinn/PicGo) 安装

本 fork **不在 npm 上**，需从 Git 仓库安装。安装目录是 PicGo 的数据目录，**不是程序安装目录**：

- Windows：`%APPDATA%\picgo`（即 `C:\Users\<用户名>\AppData\Roaming\picgo`）
- macOS / Linux：`~/.picgo`

```bash
cd ~/.picgo          # Windows PowerShell: cd $env:APPDATA\picgo
npm rm picgo-plugin-compress-next     # 若装过旧版，必须先卸载，否则会被跳过
npm i picgo-plugin-compress-next@git+https://github.com/yayoinoyume/picgo-plugin-compress-next.git#fix-picgo-compat
```

装完重启 PicGo，插件列表应显示版本 **1.5.3**。

> **重要：装完必须手动启用 transformer**
>
> 插件加载 ≠ 压缩生效。PicGo 的压缩流程读取的是 `picBed.transformer`，为空时**静默回退到 `path`（原图直传）**，不报错也不提示。
>
> 启用方式：插件设置 → 点 `compress-next` 进入详情 → 右上角**齿轮** → **`Enable transformer - compress-next`** → 点页面下方「重新加载」。
>
> 验证：`%APPDATA%\picgo\data.json` 中 `picBed.transformer` 的值应为 `compress-next`。

> **注意：配置在 Config 标签页，不在 Transformer 标签页**
>
> 本插件的 transformer handler 没有 `config` 方法，所以 GUI 的 Transformer 标签页永远是空的。参数请到 **Config** 标签页设置。

#### [PicGo-Core](https://github.com/PicGo/PicGo-Core) 安装

```bash
picgo add compress-next
git clone -b fix-picgo-compat https://github.com/yayoinoyume/picgo-plugin-compress-next.git
cd picgo-plugin-compress-next && npm i && npm run build
picgo add /path/to/picgo-plugin-compress-next   # 以本地路径安装
picgo use transformer        # 选择 compress-next
picgo config plugin compress-next
```

#### 离线安装

参考[这里](https://picgo.github.io/PicGo-Core-Doc/zh/dev-guide/deploy.html#gui%E6%8F%92%E4%BB%B6)。注意：**直接复制 git 仓库目录不可用**，仓库不含编译产物 `dist/`，需先 `npm i && npm run build`。


#### 参数配置
- Compress Type (过段时间会制作详细对比分析表):
  - [tinypng](https://tinypng.com/): 无损压缩，需要上传到 tinypng
  - [imagemin](https://github.com/imagemin/imagemin): 图片压缩不改变后缀名，支持 `jpeg` 和 `png`，使用 [mozjpeg](https://www.npmjs.com/package/imagemin-mozjpeg) 和 [upng](https://www.npmjs.com/package/imagemin-upng)
  - [imagemin-webp](https://www.npmjs.com/package/imagemin-webp): 本地压缩为 webp
    注意：有些图床（比如 sm.ms）不支持 webp 图片格式，会上传失败
  - [webp-converter](https://www.npmjs.com/package/webp-converter): 同上
- Gif Compress Type:
  - [webp-converter](https://www.npmjs.com/package/webp-converter): 本地有损将 gif 压缩为 webp
  - [imagemin-gif2webp](https://www.npmjs.com/package/imagemin-gif2webp): 
- Auto Refresh TinyPng Key Across Months:
  - yes: 检测到跨月（与上次使用时年月不同）则自动刷新 TinyPng API Key 的状态
  - no: 不检测，但是仍然记录年月
- TinyPng API Key:
  - 在 [developers](https://tinypng.com/developers) 中申请
  - 逗号`,`隔开，可使用多个 Key 叠加使用次数
  - 仅在 `Compress Type` 为 `tinypng` 时生效；GUI 下为密码框，CLI 下仅在选中 `tinypng` 时才会询问

##### 压缩参数配置

参考 [option.example.json](./docs/option.example.json)


# ⚗️ 背景

[picgo-plugin-compress](https://github.com/JuZiSang/picgo-plugin-compress) 已经许久没有更新了，关键是在 `PicGo` 底层上传库从 `request` 迁移至 `axios` ，参考 [PicGo/PicGo-Core#65](https://github.com/PicGo/PicGo-Core/issues/65) ，导致 [TinyPng](https://tinypng.com/) 不可用。似乎最后一个可用版本是[PicGo v2.3.0](https://github.com/Molunerfinn/PicGo/releases/tag/v2.3.0)。  

幸运的是我发现了 [picgo-plugin-compress-webp-lossless](https://github.com/mrgeneralgoo/picgo-plugin-compress-webp-lossless) ，但是其只上传了 [v1.0.1](https://www.npmjs.com/package/picgo-plugin-compress-webp-lossless) ，其实现仍然是 [picgo-plugin-compress](https://github.com/JuZiSang/picgo-plugin-compress) 的旧实现，但是其代码更新到了 `v1.1.0` ，可惜的是使用 `ES` 重构后无法兼容 `PicGo` ，并且仍旧存在些许问题。  

于是便有了 ***`picgo-plugin-compress-next`*** 的诞生 🎉

# 💥 对比

<table border=2 style="
  width: auto;
  display: table;
  margin-left: auto;
  margin-right: auto;"
>
  <tr>
    <th></th>
    <th colspan=2>compress-next</th>
    <th colspan=2>compress</th>
  </tr>
  <tr>
    <th rowspan=5>TinyPng</th>
    <td>✅</td>
    <td>version >= <b>2.3.1</b></td>
    <td>🟡</td>
    <td>最高 version <b>2.3.0</b></td>
  </tr>
  <tr>
    <td>✅</td>
    <td>
      多个 Key  叠加使用<br>
      使用逗号分隔，自动清除空白符
    </td>
    <td>✅</td>
    <td>
      多个 Key  叠加使用<br>
      严格使用逗号，不可有空白符
    </td>
  </tr>
  <tr>
    <td>✅</td>
    <td>
      TinyPngWeb 已弃用<br>
      抛出异常并提示配置 Key 
    </td>
    <td>❌</td>
    <td>
      TinyPngWeb 已不可用<br>
      抛出空白异常 只能查看日志<br>
      网页返回 <b>404</b> 或则 <b>413</b> 
    </td>
  </tr>
  <tr>
    <td>✅</td>
    <td>
      出现无效 Key，<b>自动跳过</b><br>
      标记并不再访问，除非手动刷新
      </td>
    <td>❌</td>
    <td>
      出现无效 Key，抛出空白异常<br>
      查看日志，网页返回 <b>404</b>
    </td>
  </tr>
  <tr>
    <td>✅</td>
    <td>
      支持手动刷新<b>有效</b> Key<br>
      支持手动刷新<b>所有</b> Key<br>
      可设置是否跨月份<b>自动</b>刷新 Key
    </td>
    <td>❌</td>
    <td>
      若有效 Key 达到使用次数，则不再访问<br>
      需要删除相应配置文件，才可重置
    </td>
  </tr>
  <tr>
    <th rowspan=4>imagemin</th>
    <td>✅</td>
    <td>
      <b>mozjpeg</b> & <b>upng</b>:<br>
      可以自行配置压缩参数
    </td>
    <td>🟡</td>
    <td>
      <b>mozjpeg</b> & <b>upng</b>:<br>
      支持本地有损压缩
    </td>
  </tr>
  <tr>
    <td>✅</td>
    <td>
      <b>imagemin-webp</b>:<br>
      可以自行配置压缩参数
    </td>
    <td>🟡</td>
    <td>
      <b>imagemin-webp</b>:<br>
      支持本地有损转换为 <b>webp</b>
    </td>
  </tr>
  <tr>
    <td>✅</td>
    <td>
      <b>imagemin-gif2webp</b>:<br>
      <b>gif</b> 转换为 <b>webp</b>，可自行配置参数
    </td>
    <td>❌</td>
    <td>不支持 gif 转 webp</td>
  </tr>
  <tr>
    <td>✅</td>
    <td>准备了多套压缩配置参数，可自行配置</td>
    <td>❌</td>
    <td>固定的提前设置好的参数</td>
  </tr>
  <tr>
    <th rowspan=2>webp-converter</th>
    <td>✅</td>
    <td>
      jpeg, png, webp 压缩为 <b>webp</b><br>
      可自行配置参数
    </td>
    <td rowspan=2>❌</td>
    <td rowspan=2>不支持使用 webp-converter</td>
  </tr>
  <tr>
    <td>✅</td>
    <td>gif 压缩为 <b>webp</b>，可自行配置参数</td>
  </tr>
  <!-- <tr>
    <td>✅</td>
    <td></td>
    <td>❌</td>
    <td></td>
  </tr> -->
</table>


# 🎉 功能

- [x] 支持多个 `Key` 叠加使用
- [x] 支持 `PicGo >= v2.3.1` 的 `TinyPng` 压缩
- [x] 禁用 `TinyPngWeb` 并抛出异常
- [x] 对错误的 `Key` 处理并跳过
- [x] 处理 `Key` 的刷新问题：
  - [x] 刷新有效 `Key`
  - [x] 刷新所有 `Key`
  - [x] 跨越份自动刷新有效 `Key`
- [x] 加入 `webp-converter`
- [x] 加入 `gift 2 webp` 的能力
  - [x] 使用 `webp-converter` 的 `gwebp` 
  - [x] `imagemin-gif2webp`
- [x] 可以根据自身需求配置压缩的具体参数
  - [x] `imagemin-upng`
  - [x] `imagemin-mozjpeg`
  - [x] `imagemin-webp`
  - [x] `imagemin-gif2webp`
  - [x] `webp-converter-cwebp`
  - [x] `webp-converter-gwebp`

# 🔧 本 fork 修复记录

上游 `1.5.2` 在 **PicGo 3.x** 下实测存在的缺陷（已在本 fork 修复，版本 `1.5.3`）：

| 问题 | 触发条件 | 上游表现 |
| --- | --- | --- |
| webp 输入必失败 | 压缩 `webp` 图片且选 `imagemin` | `TypeError: The image type can be only jpg/jpeg or png` |
| webp 输入必失败 | 压缩 `webp` 图片且选 `webp-converter` | `ENOENT: unlink .../xxx.webp`（临时文件与输出同名） |
| 远程 URL 必失败 | 输入是 `http(s)://` 链接 | `ENOENT: stat 'http://...'`（对 URL 调用 `fs.statSync`） |
| 带参数的 URL 被误判 | 链接含 `?query` 或 `#hash` | 扩展名变成 `.png?w=100`，被判为不支持的格式 |
| CLI 无法填 Key | `picgo config plugin compress-next` 选 `tinypng` | 不显示 API Key 输入项（`when` 用了错误的字段名） |
| 重复加载报错 | 同一插件被加载两次 | `transformer duplicate id: compress-next!`，随后插件被移出列表 |
| GUI 配置页异常 | PicGo 3.x 打开 Config 页 | 控制台 `initial schema sync failed`（`when` 函数无法通过 IPC 序列化） |

修复后行为：

- 不支持的输入格式（如 `bmp`）或压缩器不支持的格式（`imagemin` 遇到 `webp`）会**跳过压缩并保留原图**，不再中断上传
- 网络图片的压缩率改为按 `buffer` 计算，不再依赖本地文件
- GUI 下 `TinyPng API Key` 为密码框，两个 tinypng 专用字段带使用提示

## 已知限制

- **必须先启用 transformer**，否则 PicGo 静默使用 `path` 原图直传（这是 PicGo 的设计，不是本插件的问题）
- GUI 不支持字段条件显隐，`tinypng` 专用的两项始终显示，选其他压缩库时留空即可
- `imagemin-webp` 处理已是 `webp` 的输入会重编码一次（体积变大时自动跳过，结果无影响）
- 压缩参数文件 `option.json` 位于插件目录内，重装插件会重置为默认值

# 开发

```bash
npm ci --ignore-scripts   # 跳过 cwebp/mozjpeg 等二进制下载
npm run build             # tsc 编译到 dist/
npx jest tests/config.test.ts tests/utils.test.ts --coverage=false
```

> `tests/index.test.ts` 是历史遗留文件，mock 了已不存在的模块，不参与 CI。

# 压缩比较
> TODO ... ...


# 报告问题

本 fork 的问题请提到 [yayoinoyume/picgo-plugin-compress-next/issues](https://github.com/yayoinoyume/picgo-plugin-compress-next/issues)。

上游原版问题提到 [supine0703/picgo-plugin-compress-next/issues](https://github.com/supine0703/picgo-plugin-compress-next/issues/new)。

[你可以直接点击这里创建一个问题](https://github.com/supine0703/picgo-plugin-compress-next/issues/new)

