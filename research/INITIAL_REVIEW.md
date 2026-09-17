# 首批试采记录

核对日期：2026-09-17。目标是验证“找到真实作品 → 对应作者 Prompt → 记录缺口 → 生成目录”的流程。不是按热度排名，也不代表已覆盖所有平台或当前模型版本。

## 实际结果

- 10 条进入目录：9 条读取作者原帖或作者博客；1 条原帖在 X，但通过作者共同署名的博客核验。
- 视频生成模型共 5 类：Veo、Seedance、Kling、Runway、Pika。其他图像、声音和剪辑工具记录在各自环节。
- 发布来源：6 条 Reddit、1 条 X（作者博客再次发表）、3 条作者 Blog。博客作为补充资料单独标注；不算作第三个社交平台。
- 7 条有 Prompt 资料：4 条完整短文本、2 条局部镜头/延长文本、1 条长文本节选并链接全文。
- 3 条是有 AI 创作依据的灵感或工作流案例，未找到实际 Prompt，不计作可复制 Prompt 案例。
- 5 条保留候选：4 条 X 原帖本次无法读取，1 条页面内模型版本说明存在矛盾。
- 没有逐条直接播放视频，没有调用模型复现；10 条不等于 10 条已实测可复现的视频。

## 原始来源

| 案例 | 来源与本次确认范围 |
|---|---|
| 脱口秀 | [fofr 共同署名的博客](https://replicate.com/blog/veo-3)保留该 X 作品及短 Prompt；[X 原帖](https://x.com/fofrAI/status/1924924738494669011)本次无法直接读取 |
| 多图变形、越野车辆、油画动画 | [作者 Seedance 2.0 博客](https://replicate.com/blog/seedance-2)，同页三个独立示例；输入图片未收齐 |
| 壁炉读书 | [原帖及作者回复](https://www.reddit.com/r/runwayml/comments/1fva7rd/sometimes_im_not_sure_if_runway_is_taking_my/)明确更正模型为 Kling，公开最后延长片段的文本；本次网页显示媒体加载失败 |
| 广告开场 | [作者原帖](https://www.reddit.com/r/ChatGPT/comments/1ksljfs/i_used_to_make_500k_pharmaceutical_commercial_ads/)只披露首个镜头，不当作整片完整 Prompt |
| 双车追逐 | [作者原帖](https://www.reddit.com/r/KlingAI_Videos/comments/1w38ocs/have_a_bit_of_fun_with_twisted_metal_full_prompt/)给出长时间线，本库只引用开头并指向全文 |
| 实拍改写 | [原帖及作者回复](https://www.reddit.com/r/aivideo/comments/1fzuo8c/amazed_with_runwayml_video_to_video_original/)确认 video-to-video，未找到具体 Prompt |
| 输入方式实验 | [作者原帖与回复](https://www.reddit.com/r/aivideo/comments/18wldce/my_notes_from_my_quick_runway_experiments/)说明四类输入实验，未找到各次精确 Prompt |
| Electric Fury | [作者原帖](https://www.reddit.com/r/aivideo/comments/18u83o6/my_first_ai_video_electric_fury_yes_its_about/)披露视频、图像、音乐、剪辑工具的职责，未找到逐镜头 Prompt |

## 候选与未采纳信息

X 候选由 [jax-explorer/awesome-veo3-videos](https://github.com/jax-explorer/awesome-veo3-videos) 和 [ZeroLu/awesome-seedance](https://github.com/ZeroLu/awesome-seedance) 发现；原始链接和二手证据记录在候选 JSON 中。没有把整理库的可读状态算作 X 原帖已核验。

[母女对白帖子](https://www.reddit.com/r/Seedance_AI/comments/1vrjlk3/seedance_25_acting_prompt_tutorial_how_i_built_a/)的作者说明与同页自动置顶版本说明有冲突，且只有教程概述与例句。暂未把该版本或“完整 Prompt”当作确定事实。

来源仅显示相对发布时间或发布时间不确定的条目，保留 `published_at: null`。核对日期独立记录，不替代原作时间。

## 从试采得到的实施选择

原始 Prompt 往往只覆盖作品的一部分；图生视频还常缺少输入图片。由此将文本完整度、参考素材、页面读取、播放和复现设为独立字段。

首批已验证跨模型目录与投稿流程。跨社媒自动搜索、登录态读取、定时采集尚未配置；下一步可根据实际平台权限接入获准接口，输出同一 JSONL 草稿格式。作者原帖不可读、模型信息有冲突或 Prompt 未找到时，不自动补齐。
