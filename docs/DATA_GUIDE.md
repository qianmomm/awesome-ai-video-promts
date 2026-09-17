# 数据与核验规则

## 唯一内容来源

一条记录一个 JSON 文件，文件名必须等于 `id`。编辑 `data/cases/` 或 `data/candidates/`；不要手改生成的详情页、分类页和 `data/catalog.json`。README 中标记区域由脚本生成，标记以外的介绍保留。

每条记录都有 Schema 中列出的字段。可空字段填 `null`，列表无内容填 `[]`，不要用“未知”冒充真实模型名。模型名和平台名没有固定枚举；确认是 AI 视频但无法知道模型时 `models: []`。

## 关键字段

| 字段 | 含义 |
|---|---|
| `source.url` | 作品发布页面，优先原帖 |
| `source.item_key` | 同页多个独立示例的稳定区分键，普通帖子填 `main` |
| `source.locator` | 如何在页面找到对应视频 |
| `source.access` | `accessible` 已读取；`inaccessible` 本次无法读取；`unknown` 未检查 |
| `author` | 创作者的公开名称与主页；不是搬运者 |
| `models` | 开放名称、已知版本、负责环节和证据链接 |
| `prompt.original` | 逐字保留作者公开文本，不纠正拼写或偷偷补全 |
| `prompt.scope` | 整段、某个镜头、续写段或节选的具体范围 |
| `prompt.source_url` / `locator` | Prompt 实际出现的页面与定位，可不同于原作页面 |
| `prompt.translation_zh` | 整理者译文，与原文分开 |
| `prompt.recreated` | 整理者另拟版本，必须单独标注，不能改变作者原文状态 |
| `references` | 首帧、尾帧、参考图、视频、音频的链接与缺口 |
| `verification` | 已检查的来源、日期、AI 创作证据及限制 |
| `video.playback` | 播放实测状态，不能从 HTTP 成功推断 |
| `review` | 是否进入正式目录，与播放/复现不是同一状态 |
| `reproduction` | 是否亲自调用模型复现及输出证据 |

`models[].role` 推荐使用 `video_generation`、`image_generation`、`audio_generation`、`editing` 等。分类索引只统计 `video_generation`，不会把关键帧模型或剪辑软件算作视频模型。新角色可以记录，只有 `video_generation` 进入该索引；未知版本填 `null`。

## Prompt 状态

| 状态 | 展示与约束 |
|---|---|
| `full` | 作者披露的该段文本完整收录；不等于整片可复现 |
| `partial` | 作者仅公开部分镜头或部分流程，必须说明范围 |
| `excerpt` | 原作者公开较长文本，本仓库仅引用其中一部分 |
| `link_only` | 已检查原始 Prompt 所在页面，只提供完整文本入口 |
| `not_found` | 本次未找到，不能声称作者从未公开 |
| `not_public` | 有依据确认作者未公开，在 notes 中给出依据 |

前四种进入 Prompt 区；后两种进入灵感区。`full`、`partial`、`excerpt` 必须有原文和来源；`link_only` 不保存正文，但必须有来源；没有原文时不能放译文。不要用标题、创作说明或视频反推替代作者 Prompt。

## 来源等级

- `primary`：读取作者原帖或作者回复，并找到对应 AI 创作依据。
- `primary_republication`：读取作者自己再次发表的相同作品与说明，例如原帖无法读取，但作者博客复述了该示例；明确写出哪个页面可读。
- `secondary`：仅能读取整理库、转述或搬运，保留候选，不进入正式目录。
- `none`：仅发现链接，尚未核验。

正式目录只允许前两类并要求作者和日期。`approved` 表示记录的来源和披露范围已经核对，**不表示视觉质量评级、视频已成功播放、权利已转让或已经复现**。

## 视频展示

可选的 `video.display` 用于首页和详情页的同一份展示素材：

- `embed_url`：已确认对应原作的稳定 GitHub 视频附件地址；没有则为 `null`。当前 Markdown 渲染器支持此类页内播放器，不把网页地址或 HLS 播放列表冒充视频附件。
- `poster_url`：原帖视频的公开封面地址；没有则为 `null`。没有附件时，封面链接到 `video.page_url`，明确显示“点击封面观看原视频”。
- `evidence_url`、`checked_at`、`notes`：记录视频或封面与原作的对应关系、检查日期及限制。临时签名地址不写入仓库。

两种媒体地址至少提供一种；未填写展示字段的旧条目仍可读取，并明确显示缺少预览。支持的展示格式不构成模型或来源平台白名单。添加附件不自动改变 `playback`、`verification`、`rights` 或 `reproduction`。

## 去重与一致性

按归一化原帖 URL 加 `item_key` 检查重复。不同平台的转载无法仅靠 URL 确认是同一作品，需要审核者人工合并。共享同一来源页面的不同示例可以分条，但不得用随意改 `item_key` 逃避去重。

生成过程排序稳定，不写入当前运行时间。删除或撤回案例后重新 `build`，旧的受管理页面会被移除；仅移除 `.generated-files.json` 记录的生成文件。CI 的 `check` 验证内容和清单。

## Schema 校验器

`schema/case.schema.json` 使用 JSON Schema 2020-12 的有限子集。内置校验器只支持文件使用的 `type`、`properties`、`required`、`additionalProperties`、`items`、`minItems`、`uniqueItems`、`minLength`、`maxLength`、`pattern`、`enum`、`format` 与描述关键字；未知关键字会报错，不会静默略过。它不是通用 JSON Schema 实现。

`uri` 进一步限定为不含凭据的 HTTP(S) 地址；日期校验实际日历日期。审批、Prompt 状态、复现证据等跨字段要求在 `scripts/catalog.mjs` 实施。
