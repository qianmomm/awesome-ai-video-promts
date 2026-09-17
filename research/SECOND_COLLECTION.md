# 第二批采集与审核

核对日期：2026-09-17。

本批新增 12 个独立作品：9 个附作者公开的完整视频指令，3 个公开制作过程但未找到逐字 Prompt。总目录从 10 增至 22 个案例，有 Prompt 资料的案例从 7 增至 16 个；完整文本共 13 个。没有把同帖内的多个版本或中间结果拆成多条凑数。

新增视频模型分类 MiniMax、LTX、Wan、HunyuanVideo、Hailuo。全库共 10 类视频模型；图像、插帧、放大与剪辑工具按各自职责记录。

## 新增案例

| 案例 | 模型 | Prompt | 原作 |
|---|---|---|---|
| [90 年代动画风：滑板少女的五镜头序列](../docs/cases/minimax-anime-skateboard.md) | MiniMax H3 | 完整文本 | [Time-Ad-7720](https://www.reddit.com/r/StableDiffusion/comments/1vxi7uv/minimax_h3_multishot_anime_sequence_workflow/) |
| [复古动画海报：人物入场与界面元素逐层出现](../docs/cases/minimax-retro-motion-poster.md) | MiniMax H3 | 完整文本 | [Time-Ad-7720](https://www.reddit.com/r/StableDiffusion/comments/1vvhz0f/minimax_h3_motion_graphic_style_animation_test/) |
| [屋顶冷幽默：按时间码编排双人对话](../docs/cases/ltx-rooftop-multishot-dialogue.md) | LTX 2.5 | 完整文本 | [Interesting_Room2820](https://www.reddit.com/r/StableDiffusion/comments/1vnl45f/whats_your_multishot_prompt_structure_i2v_ltx25/) |
| [让分镜板直接驱动一段视频](../docs/cases/minimax-storyboard-reference.md) | MiniMax H3 | 完整文本 | [Kandoo85](https://www.reddit.com/r/StableDiffusion/comments/1vecz21/minimax_h3_can_use_a_storyboard_as_a_visual/) |
| [城市追逐：人物、运镜与环境声的完整约束](../docs/cases/ltx-city-foot-chase.md) | LTX 2.5 | 完整文本 | [call-lee-free](https://www.reddit.com/r/StableDiffusion/comments/1vo6bic/ltx_25_foot_chase_prompt_i_used_is_below_not_too/) |
| [飞船维修独白：LTX 2.3 与 2.5 对照](../docs/cases/ltx-spaceship-dialogue-comparison.md) | LTX 2.3 / LTX 2.5 | 完整文本 | [call-lee-free](https://www.reddit.com/r/StableDiffusion/comments/1vo55s5/ltx_23_and_25_comparison_dialogue_prompt_below/) |
| [清晨告别：人物准备出门与白猫的三个镜头](../docs/cases/seedance-morning-cat-farewell.md) | Seedance 2.0 | 完整文本 | [DataGirlTraining](https://www.reddit.com/r/seedance2pro/comments/1uzj41r/how_to_create_a_soft_japanese_drama_scene_with/) |
| [海边手机日记：用跳切节奏保留随手拍质感](../docs/cases/seedance-beach-phone-montage.md) | Seedance 2.0 | 完整文本 | [RealJamesOfficial](https://www.reddit.com/r/Seedance_AI/comments/1v2e89a/the_jumpcut_rhythm_not_keywords_is_what_sells/) |
| [摇滚手势：Wan 与 HunyuanVideo 同题对照](../docs/cases/wan-hunyuan-rock-band-comparison.md) | Wan 2.2 / HunyuanVideo 1.5 | 完整文本 | [CutLongjumping8](https://www.reddit.com/r/StableDiffusion/comments/1p4s2rn/updated_i2v_wan_22_vs_hunyuanvideo_15_with/) |
| [用深度图扩展视频画面](../docs/cases/wan-depth-video-outpainting.md) | Wan 2.2 Fun Control | 未找到 | [GdaTyler](https://www.reddit.com/r/StableDiffusion/comments/1v6ns0v/expanding_video_with_wan_22_fun_control/) |
| [从短序列取帧：探索跨镜头角色一致性](../docs/cases/wan-multishot-character-consistency.md) | Wan 2.2 | 未找到 | [jordek](https://www.reddit.com/r/StableDiffusion/comments/1oloosp/wan_22_multishot_scene_character_consistency_test/) |
| [洗手动作：混元文生视频与 Hailuo 图生视频](../docs/cases/hunyuan-hailuo-hand-washing.md) | HunyuanVideo / Hailuo | 未找到 | [Extension-Fee-8480](https://www.reddit.com/r/StableDiffusion/comments/1knyj2u/a_comparison_between_hunyuan_vs_hailuo_ai_with/) |

## 核验范围

- 本批 12 条最终入库来源均为 Reddit 作者原帖；本轮也检索了其他平台，但未把无法取得同等证据的线索算作案例。全库来源仍包括 Reddit、X 与作者博客，不宣称已经覆盖所有社媒。
- 核对原帖标题、作者、正文和相关本人评论；发布日期取帖子公开 DOM 的创建时间，避免把“几天前”的相对显示当作准确日期。
- 每条封面取自该帖主视频播放器的 poster 属性；README 和详情页使用相同封面及原帖地址。多视频帖子选最前面的最终结果，其他中间片段不单独计数。
- Reddit 原始 Prompt 以引用中的代码块展示，并链接作者原文。只去掉帖子外围的“Prompt”标题、引号和阅读更多按钮；不把整理者补写的文字混入原文。
- 分镜和海报参考图保留作者公开的外链。未获取的原图、种子、参数、参考视频仍明确标为缺失。
- LTX 屋顶案例的角色服装上写有 MiniMax H3，但实际生成模型按作者正文记录为 LTX 2.5。
- 洗手案例中两种生成路径和提示词不同；摇滚及对白案例也不是控制全部变量的基准测试，不做通用性能排名。
- 本次没有调用视频模型，没有完整播放逐帧核对各视频。封面展示、作者说明、媒体播放与模型复现分别记录。

## 验证

运行 `npm run build` 与 `npm run verify`：22 条正式记录、5 条原有候选记录通过校验；11 项既有测试通过，45 个生成文件保持同步。现有候选没有仅凭二手整理来源被提升为正式案例。

