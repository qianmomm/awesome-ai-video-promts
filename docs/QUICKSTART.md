# 第一次运行

## 查看内容

直接打开根目录 `README.md`，或在 [GitHub 仓库](https://github.com/qianmomm/awesome-ai-video-promts)中浏览。案例数据在 `data/cases/`；脚本生成的详情页在 `docs/cases/`，公开数据导出在 `data/catalog.json`。

## 运行脚本

安装 Node.js 22 或以上，在项目根目录执行。没有 npm 依赖，不需要下载依赖或配置 API key。

```bash
npm run validate
npm test
npm run build
npm run check
npm run search -- Kling
```

`npm run verify` 合并执行数据校验、测试、生成一致性检查。`check` 不改文件；生成文件过期时执行 `build`。

## 添加一个链接

```bash
npm run new -- '真实作品页面URL' '平台名' '标题'
```

脚本在 `data/candidates/` 中创建编号稳定的 JSON 草稿，不会猜测模型、作者或 Prompt，也不会自动审核。重复链接会跳过；X 与 Twitter、YouTube 短链接与播放页、Reddit 同一帖子不同分享地址会做归一化去重。

审核时检查原帖和作者披露的信息，按 [字段指南](DATA_GUIDE.md) 补齐记录。通过后把文件移至 `data/cases/`，设置 `review.status` 为 `approved`，填入真实的审核日期，再执行 `npm run build` 与 `npm run verify`。

## 批量导入

新建 `inbox/links.jsonl`，每行一个 JSON 对象。下面是非真实格式示例：

```json
{"url":"https://example.com/video/your-id","platform":"自定义平台","title":"待核验作品"}
```

```bash
npm run import -- inbox/links.jsonl
npm run build
npm run verify
```

可选字段：`id`、`author_name`、`author_url`、`item_key`。仅导入公开链接与基础信息；提交者提供的审核标记、模型猜测和 Prompt 不会直接成为已核验事实。此导入接口会拒绝未声明字段，整批验证失败时不会写入任何草稿。

## 克隆与提交

```bash
git clone https://github.com/qianmomm/awesome-ai-video-promts.git
cd awesome-ai-video-promts
npm run verify
```

修改源数据后运行 `npm run build` 和 `npm run verify`，把数据和生成文件一并提交。投稿请通过 Pull Request；保留 `.github/` 中的校验流程和表单。项目不包含任何 API key 或账号凭据。
