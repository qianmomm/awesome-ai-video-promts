# awesome-ai-video-promts

**看 AI 视频作品，找到创作者公开的 Prompt 和制作过程。**

收集来自不同社交平台、使用各类 AI 视频模型制作的案例。每条记录保留作者、原帖、Prompt 来源、参考素材和已知工作流；完整文本、局部 Prompt 与未公开内容分别标注。

**所有 AI 视频模型均可收录。** 平台和模型是两个独立维度：X、Reddit、YouTube、B 站、小红书等表示作品发布在哪里；模型表示视频如何制作。新模型、模型未公开、多模型组合都能记录。

首批资料核对日期：**2026-09-17**。这是来源可追溯的起始目录，不是模型排名。视频均提供外部播放入口，尚未逐条实测播放，也未实际生成复现。博客案例作为作者补充来源，单独标注为 Blog。

[浏览案例](#案例目录) · [提交案例](CONTRIBUTING.md) · [收录与字段规则](docs/DATA_GUIDE.md) · [首次运行](docs/QUICKSTART.md) · [试采记录](research/INITIAL_REVIEW.md)

## 案例目录

<!-- CATALOG:START -->

**10 条已核对来源的案例** · 7 条有 Prompt 资料 · 3 条灵感案例

完整文本 4 · 局部 Prompt 2 · 原文节选 1 · 完整 Prompt 见来源 0

待审核线索：5 条，不计入案例数量。来源核验与播放、实际复现分别记录。

### 有 Prompt 的案例

| 案例 | 视频模型 | 平台 | Prompt |
|---|---|---|---|
| [双车追逐：按秒安排动作与声音](<docs/cases/kling-car-combat-timeline.md>) | Kling | Reddit | 原文节选 |
| [壁炉旁读书：续写片段的表情指令](<docs/cases/kling-flapper-extension.md>) | Kling | Reddit | 局部 Prompt |
| [多张照片之间的连续变形](<docs/cases/seedance-fluid-morphs.md>) | Seedance | Blog | 完整文本 |
| [越野车辆：一张图开始的运动](<docs/cases/seedance-offroad-image.md>) | Seedance | Blog | 完整文本 |
| [油画中的水流运动](<docs/cases/seedance-oil-painting.md>) | Seedance | Blog | 完整文本 |
| [广告式叙事：开场独白的镜头 Prompt](<docs/cases/veo-pharma-ad-opening.md>) | Veo | Reddit | 局部 Prompt |
| [小剧场脱口秀：把笑话交给模型](<docs/cases/veo-standup-fofr.md>) | Veo | X | 完整文本 |

### 灵感与工作流（未找到原始 Prompt）

| 案例 | 视频模型 | 平台 | Prompt |
|---|---|---|---|
| [Electric Fury：图像、视频与音乐的组合](<docs/cases/pika-electric-fury.md>) | Pika | Reddit | 未找到 Prompt |
| [同一静图的四种提示方式实验](<docs/cases/runway-image-prompt-comparison.md>) | Runway | Reddit | 未找到 Prompt |
| [实拍镜头的四种视频改写](<docs/cases/runway-video-restyling.md>) | Runway | Reddit | 未找到 Prompt |

### 浏览索引

**视频模型**：[Kling \(2\)](<docs/by-model/kling-f91b75d9.md>) · [Pika \(1\)](<docs/by-model/pika-8a45590e.md>) · [Runway \(2\)](<docs/by-model/runway-b735ff99.md>) · [Seedance \(3\)](<docs/by-model/seedance-17e8ed96.md>) · [Veo \(2\)](<docs/by-model/veo-4fd53fa8.md>)

**用途**：[动作与运镜 \(1\)](<docs/by-category/group-7c4fb988.md>) · [图像动画与转场 \(3\)](<docs/by-category/group-e5466cd9.md>) · [对白与表演 \(2\)](<docs/by-category/group-555a0094.md>) · [广告与短片 \(1\)](<docs/by-category/group-92101255.md>) · [提示方式实验 \(1\)](<docs/by-category/group-36dad3ec.md>) · [视频重绘 \(1\)](<docs/by-category/group-ebb48bac.md>) · [音乐与动画 \(1\)](<docs/by-category/group-62f2292c.md>)

**来源平台**：[Blog \(3\)](<docs/by-platform/blog-8c6bc099.md>) · [Reddit \(6\)](<docs/by-platform/reddit-eb0050f7.md>) · [X \(1\)](<docs/by-platform/x-4b68ab38.md>)

<!-- CATALOG:END -->

## 如何使用

点击案例名称，查看作者的 Prompt、对应镜头范围、参考素材缺口和来源。点击“观看原作”回到作者页面。`完整文本`仅表示收录了作者披露的该段文本，不保证参考图、种子、参数齐全或能够复现整片。

有原帖但暂时找不到 Prompt 的作品放在灵感区。整理者翻译和另拟 Prompt 放在独立字段，绝不作为作者原文展示。核验不足的线索保存在 `data/candidates/`，不进入生成目录；这些候选文件同样会随仓库公开，只能放公开资料。

## 本地维护

需要 Node.js 22 或以上；没有第三方运行依赖，无需 `npm install`。

```bash
npm run verify
npm run new -- 'https://www.youtube.com/watch?v=视频ID' YouTube '作品标题'
# 核对生成的 data/candidates/*.json，填写作者、模型和证据。
# 审核通过后移到 data/cases/，设置 review.status 和 review.reviewed_at。
npm run build
npm run verify
```

上面的地址是命令格式示例，请替换为真实作品链接。批量导入和搜索见 [快速开始](docs/QUICKSTART.md)。GitHub Actions 会校验数据、运行测试，并检查生成结果是否同步。

## 收录原则

- 优先作者原帖、作者回复和作者自己的制作说明。搬运和整理库仅用于发现线索。
- 支持所有模型；没有公开名称时留空，不凭画面、标签或所在社区猜测。
- 一个作品对应一条记录。一个页面包含多个独立示例时，用 `source.item_key` 区分，并写清定位。
- 优先保留作者页面链接。视频和参考图不随仓库备份，第三方作品的权利归原权利人。

## 当前能力

已提供链接新建、JSONL 批量导入、来源去重、结构和事实状态校验、分类索引、全文关键词搜索、投稿表单、纠错表单及 CI。待审核数据不会自动发布。

**第一版采用人工发现和来源核验，脚本负责整理。** 尚未接入各社媒 API 或定时抓取。之后可将获准接口返回的链接转换为 [导入格式](docs/COLLECTION.md)，复用同一条审核流程；模型范围不受接口或检索词表限制。

## 参与与许可

欢迎提交作品、补充原始 Prompt、修正模型信息或报告失效链接。请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

本项目原创代码采用 [MIT](LICENSE)；引用的 Prompt、视频、图片和商标不因收录而获得该许可，详见 [RIGHTS.md](RIGHTS.md)。

项目形式参考 [awesome-gpt-image-2](https://github.com/freestylefly/awesome-gpt-image-2)；发现线索时参考的整理库见 [试采记录](research/INITIAL_REVIEW.md)。
