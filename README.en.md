
[中文](./README.md) |-> [English](./README.en.md)


### picgo-plugin-compress-next

> **This is a fork**
>
> Upstream: [supine0703/picgo-plugin-compress-next](https://github.com/supine0703/picgo-plugin-compress-next) (npm `1.5.2`)
> This fork fixes several issues that break uploads on **PicGo 3.x**, see [Fix log](#-fix-log-of-this-fork).

[![dm](https://img.shields.io/npm/dm/picgo-plugin-compress-next?color=brightgreen)](https://npmcharts.com/compare/picgo-plugin-compress-next?minimal=true) [![v](https://img.shields.io/npm/v/picgo-plugin-compress-next?color=brightgreen)](https://www.npmjs.com/package/picgo-plugin-compress-next) [![mit](https://img.shields.io/badge/license-mit-brightgreen.svg)](https://github.com/supine0703/picgo-plugin-compress-next/blob/master/LICENSE)


### 🍴 Fork

This is a fork of the  [picgo-plugin-compress-webp-lossless](https://github.com/mrgeneralgoo/picgo-plugin-compress-webp-lossless) repository, And it is a fork of the [picgo-plugin-compress](https://github.com/JuZiSang/picgo-plugin-compress) repository.


### 🚀 Deployment and Use

#### [PicGo-Gui](https://github.com/Molunerfinn/PicGo) Install

This fork is **not published on npm**, install it from the git repository. The target directory is the PicGo data directory, **not** the program install directory:

- Windows: `%APPDATA%\picgo` (`C:\Users\<user>\AppData\Roaming\picgo`)
- macOS / Linux: `~/.picgo`

```bash
cd ~/.picgo          # Windows PowerShell: cd $env:APPDATA\picgo
npm rm picgo-plugin-compress-next     # remove the old version first, otherwise the install is skipped
npm i picgo-plugin-compress-next@git+https://github.com/yayoinoyume/picgo-plugin-compress-next.git#fix-picgo-compat
```

Restart PicGo, the plugin list should show version **1.5.3**.

> **You must enable the transformer manually**
>
> Loading the plugin is not enough. PicGo reads `picBed.transformer` and, when it is empty, **silently falls back to `path`** (the original image) without any error or warning.
>
> Enable it: plugin settings → open `compress-next` → gear icon at the top right → **`Enable transformer - compress-next`** → click **Reload**.
>
> Verify: `picBed.transformer` in `%APPDATA%\picgo\data.json` must be `compress-next`.

> **The settings live on the Config tab, not the Transformer tab**
>
> This plugin's transformer handler has no `config` method, so the GUI Transformer tab is always empty. Configure everything on the **Config** tab.

#### [PicGo-Core](https://github.com/PicGo/PicGo-Core) Install

```bash
git clone -b fix-picgo-compat https://github.com/yayoinoyume/picgo-plugin-compress-next.git
cd picgo-plugin-compress-next && npm i && npm run build
picgo add /path/to/picgo-plugin-compress-next   # install from a local path
picgo use transformer        # choose compress-next
picgo config plugin compress-next
```

#### Offline installation

Reference [here](https://picgo.github.io/PicGo-Core-Doc/zh/dev-guide/deploy.html#gui%E6%8F%92%E4%BB%B6). Note that **copying the git repository directory does not work**, the repository has no `dist/`, run `npm i && npm run build` first.


#### Configuration
- Compress Type (A detailed comparative analysis table will be made later):
  - [tinypng](https://tinypng.com/): Damaged compression, need to upload to tinypng.
  - [imagemin](https://github.com/imagemin/imagemin): Image compression does not change the suffix, support `jpeg` and `png`. Use [mozjpeg](https://www.npmjs.com/package/imagemin-mozjpeg) and [upng](https://www.npmjs.com/package/imagemin-upng).
  - [imagemin-webp](https://www.npmjs.com/package/imagemin-webp): Local compression to webp.
  Note: Some beds (such as sm.ms) do not support webp image format and will fail to upload.
  - [webp-converter](https://www.npmjs.com/package/webp-converter): Same as the last one.
- Gif Compress Type:
  - [webp-converter](https://www.npmjs.com/package/webp-converter): Local lossy compresses gif to webp.
  - [imagemin-gif2webp](https://www.npmjs.com/package/imagemin-gif2webp): 
- Auto Refresh TinyPng Key Across Months:
  - yes: The TinyPng API Key status is automatically refreshed if it is detected to be across months (different from the last time it was used).
  - no: No detection, but still record the date.
- TinyPng API Key:
  - Apply in [developers](https://tinypng.com/developers).
  - Separated by comma(`,`), multiple keys can be used to superimpose the usage times.


##### Compression parameter configuration

Go to see [option.example.json](./docs/option.example.json)



# ⚗️ Background

The [picgo-plugin-compress](https://github.com/JuZiSang/picgo-plugin-compress) has been a long time not updated, The key is in ` PicGo ` underlying upload library from ` request ` migrated to ` axios `, reference [PicGo/PicGo-Core#65](https://github.com/PicGo/PicGo-Core/issues/65), led to [TinyPng](https://tinypng.com/) is unavailable. Seems to be the last available version is [PicGo v2.3.0](https://github.com/Molunerfinn/PicGo/releases/tag/v2.3.0).  

Fortunately I found the [picgo-plugin-compress-webp-lossless](https://github.com/mrgeneralgoo/picgo-plugin-compress-webp-lossless), But its only upload [v1.0.1](https://www.npmjs.com/package/picgo-plugin-compress-webp-lossless). Its implementation is still through older versions of the [picgo-plugin-compress](https://github.com/JuZiSang/picgo-plugin-compress). However, the code updates the ` v1.1.0 `, but after refactoring with 'ES' it is not compatible with 'PicGo', and there are still some problems.

So there is ***`picgo-plugin-compress-next`*** birth 🎉

# 💥 Comparison

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
    <td>Highest version <b>2.3.0</b></td>
  </tr>
  <tr>
    <td>✅</td>
    <td>
      Multiple keys are used in combination<br>
      Use commas to separate and automatically clear whitespace
    </td>
    <td>✅</td>
    <td>
      Multiple keys are used in combination<br>
      Strictly use commas, no whitespace
    </td>
  </tr>
  <tr>
    <td>✅</td>
    <td>
      TinyPngWeb is deprecated<br>
      Throws an exception and prompts you to configure the Key
    </td>
    <td>❌</td>
    <td>
      TinyPngWeb is unavailable<br>
      Throwing a blank exception can only view logs<br>
      Page returns <b>404</b> or <b>413</b>
    </td>
  </tr>
  <tr>
    <td>✅</td>
    <td>
      <b>automatically skips</b> when an invalid Key appears<br>
      Tags are no longer accessed unless manually refreshed
      </td>
    <td>❌</td>
    <td>
      An invalid Key occurs, throwing a blank exception<br>
      View log, page return <b>404</b>
    </td>
  </tr>
  <tr>
    <td>✅</td>
    <td>
      Supports manual refreshing of <b>Valid</b> Keys<br>
      Supports manual refreshing of <b>all</b> Keys<br>
      Can be set to <b>automatically</b> refresh Key if across months
    </td>
    <td>❌</td>
    <td>
      If the valid Key reaches the number of times, the access is stopped<br>
      The configuration file can be reset only after it is deleted
    </td>
  </tr>
  <tr>
    <th rowspan=4>imagemin</th>
    <td>✅</td>
    <td>
      <b>mozjpeg</b> & <b>upng</b>:<br>
      Can configure compression parameters
    </td>
    <td>🟡</td>
    <td>
      <b>mozjpeg</b> & <b>upng</b>:<br>
      Support for local lossy conversion
    </td>
  </tr>
  <tr>
    <td>✅</td>
    <td>
      <b>imagemin-webp</b>:<br>
      Can configure compression parameters
    </td>
    <td>🟡</td>
    <td>
      <b>imagemin-webp</b>:<br>
      Supports local lossy conversion to <b>webp</b>
    </td>
  </tr>
  <tr>
    <td>✅</td>
    <td>
      <b>imagemin-gif2webp</b>:<br>
      Supports <b>gif</b> local lossy conversion to <b>webp</b>
    </td>
    <td>❌</td>
    <td>Conversion from gif to webp is not supported</td>
  </tr>
  <tr>
    <td>✅</td>
    <td>Multiple sets of compression configuration parameters are prepared, and you can configure them yourself</td>
    <td>❌</td>
    <td>Fixed preset parameters</td>
  </tr>
  <tr>
    <th rowspan=2>webp-converter</th>
    <td>✅</td>
    <td>jpeg, png, webp compressed to webp</td>
    <td rowspan=2>❌</td>
    <td rowspan=2>Cannot use webp-converter</td>
  </tr>
  <tr>
    <td>✅</td>
    <td>Support gif compression to webp</td>
  </tr>
  <!-- <tr>
    <td>✅</td>
    <td></td>
    <td>❌</td>
    <td></td>
  </tr> -->
</table>


# 🎉 Function

- [x] Multiple keys can be used in combination
- [x] supports TinyPng compression for `PicGo >= v2.3.1`
- [x] disables `TinyPngWeb` and throws an exception
- [x] Handle error `Key` and skip
- [x] Handling refresh of `Key`
  - [x] Refreshing of `valid keys`
  - [x] Refreshing of `all keys`
  - [x] `Automatically` refresh `valid keys` if across months
- [x] add `webp-converter` (Smaller volume and Higher speed)
- [x] Add ability of `gift 2 webp`
  - [x] Use `webp-converter`'s `gwebp`
  - [x] `imagemin-gif2webp`
- [x] Can set compression parameters based on your requirements
  - [x] `imagemin-upng`
  - [x] `imagemin-mozjpeg`
  - [x] `imagemin-webp`
  - [x] `imagemin-gif2webp`
  - [x] `webp-converter-cwebp`
  - [x] `webp-converter-gwebp`

# 🔧 Fix log of this fork

Issues found in upstream `1.5.2` on **PicGo 3.x**, all fixed in this fork (version `1.5.3`):

| Issue | Trigger | Upstream behaviour |
| --- | --- | --- |
| webp input always fails | compress a `webp` with `imagemin` | `TypeError: The image type can be only jpg/jpeg or png` |
| webp input always fails | compress a `webp` with `webp-converter` | `ENOENT: unlink .../xxx.webp` (temp input and output share a name) |
| remote url always fails | input is a `http(s)://` link | `ENOENT: stat 'http://...'` (`fs.statSync` on a URL) |
| url with parameters misdetected | link contains `?query` or `#hash` | extension becomes `.png?w=100`, treated as an unsupported format |
| CLI can not set the key | `picgo config plugin compress-next` with `tinypng` | the API key prompt never shows (`when` uses the wrong field name) |
| duplicate load error | plugin loaded twice | `transformer duplicate id: compress-next!`, the plugin is then dropped from the list |
| GUI config page error | open the Config tab on PicGo 3.x | `initial schema sync failed` in the console (a `when` function can not cross IPC) |

After the fix:

- Unsupported inputs (`bmp`) and formats the compressor can not handle (`imagemin` with `webp`) **skip compression and keep the original image** instead of aborting the upload
- The compression ratio of a network image is computed from the buffer, no local file is required
- `TinyPng API Key` is a password field in the GUI, and the two tinypng only fields explain themselves through tips

## Known limits

- **The transformer must be enabled**, otherwise PicGo silently uses `path` (this is PicGo's design, not a plugin issue)
- The GUI can not hide fields conditionally, the two tinypng only fields are always visible, leave them empty when using another compressor
- `imagemin-webp` re-encodes an input that is already `webp` (it is skipped when the result gets bigger, so the outcome is unaffected)
- The compression parameters in `option.json` live inside the plugin directory and are reset when the plugin is reinstalled

# Development

```bash
npm ci --ignore-scripts   # skip the cwebp/mozjpeg binary downloads
npm run build             # tsc into dist/
npx jest tests/config.test.ts tests/utils.test.ts --coverage=false
```

> `tests/index.test.ts` is legacy, it mocks a module that no longer exists and is not part of CI.

# Reporting Issues  

Report fork issues at [yayoinoyume/picgo-plugin-compress-next/issues](https://github.com/yayoinoyume/picgo-plugin-compress-next/issues).

Upstream issues belong at [supine0703/picgo-plugin-compress-next/issues](https://github.com/supine0703/picgo-plugin-compress-next/issues/new).

