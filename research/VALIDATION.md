# 第一版首次本地验证记录

验证日期：2026-09-17。运行环境：Node.js v24.19.0；项目要求 Node.js >=22，GitHub Actions 配置使用 22，远端 CI 尚未执行。

- `npm run validate`：10 条正式记录、5 条待审核记录通过结构和跨字段校验。
- `npm test`：10 项测试全部通过，包含模型扩展、审核隔离、来源别名去重、Prompt 状态、转义、导入失败处理和确定性生成。
- `npm run check`：28 个生成文件与源数据一致。
- `npm run search -- Kling`：返回 2 条正式案例，不返回候选记录。
- 已检查仓库 Markdown 文件的本地路径链接，无缺失目标。

本轮验证没有调用任何视频模型，没有逐条播放源视频，没有验证各平台 API 抓取，也没有执行远端 GitHub 发布。来源核验记录见 `research/INITIAL_REVIEW.md`。
