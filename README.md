# screenshot-to-code Skill

把截图 / 设计稿 / 原型图转换成**可运行的单文件 HTML 页面**的 AI Agent Skill。

与"一次性生成"的工具不同，本 skill 固化了一个被 [abi/screenshot-to-code](https://github.com/abi/screenshot-to-code) 验证过的核心方法论：**生成 → 渲染 → 自看 → 对照修正** 的闭环。Agent 写完代码后必须真正渲染出来、亲眼看效果、和原图逐项对比，再修正——最多 3 轮，直到视觉还原。

An AI agent skill that turns screenshots or design mockups into runnable single-file HTML pages, using a generate → render → self-review → fix loop. See [English](#english) below.

## 特性

- **零服务依赖**：不需要任何后端服务、API key 或 Docker——只要 AI 工具本身支持 Agent Skills 规范（SKILL.md）且具备视觉能力
- **渲染自检闭环**：内置无依赖渲染脚本（自动查找本机 Chrome/Edge），Agent 真正"看到"自己的产出再修正
- **多技术栈**：默认 HTML+Tailwind CDN，另附 React / Vue / Bootstrap / 纯 CSS 的经过踩坑验证的 CDN 引入配方（含 Babel 版本 pin 等关键坑位）
- **忠实还原优先**：逐字复制文字与数字、CSS 画图表、禁止把原图嵌入页面、中文页字体栈等硬规则

## 工作原理

```
读原图 → 盘点(布局/文字/数字/配色/图标/图表)
   ↓
生成单文件 index.html（默认 HTML + Tailwind CDN）
   ↓
scripts/render.mjs 无头渲染 → PNG
   ↓
读渲染图 ↔ 对照原图逐项检查（结构/对齐/文字/数字/间距/配色/图标/图表/溢出）
   ↓ 有差异
一批 targeted edits 修正 → 重新渲染（最多 3 轮）
   ↓
交付 HTML + 最终渲染图 + 还原度说明
```

## 安装

> 前置依赖：安装 [Node.js](https://nodejs.org)（渲染脚本用）和 Chrome 或 Edge 浏览器（Windows/macOS/Linux 均可，脚本自动查找）。

### Trae

克隆本仓库，把 `screenshot-to-code/` 文件夹复制到全局技能目录：

```bash
git clone https://github.com/<your-github-username>/screenshot-to-code-skill.git
mkdir -p ~/.trae-cn/skills
cp -r screenshot-to-code-skill/screenshot-to-code ~/.trae-cn/skills/
```

Windows 用户复制到 `C:\Users\<你>\.trae-cn\skills\screenshot-to-code\`。

### Claude Code

```bash
git clone https://github.com/<your-github-username>/screenshot-to-code-skill.git
mkdir -p ~/.claude/skills
cp -r screenshot-to-code-skill/screenshot-to-code ~/.claude/skills/
```

### 其他支持 Agent Skills 规范的工具

任何遵循 [SKILL.md / Agent Skills](https://agentskills.io) 约定的工具（Claude Desktop、部分 IDE Agent 等）：把 `screenshot-to-code/` 整个文件夹放进该工具的个人技能（skills）目录即可。技能是自包含的——`SKILL.md` 之外只有脚本和参考文档，无其他配置。

### 项目级安装

把 `screenshot-to-code/` 复制到项目内的 `.trae/skills/`（Trae）或 `.claude/skills/`（Claude Code）下，仅对该项目生效，也可随项目仓库分发给团队。

## 使用

技能安装后，在对话里直接说：

- 「把这张截图转成 HTML」
- 「还原这个设计稿页面」
- 「screenshot to code」（触发词：截图转代码、图片转代码、设计稿转HTML、还原页面）

也可以显式调用 `/screenshot-to-code` 并附上图片。

## 文件结构

```
screenshot-to-code/
├── SKILL.md               # 技能主流程：读图→盘点→生成→渲染→对比→修正→交付
├── scripts/
│   └── render.mjs         # 无依赖渲染脚本（Node，自动查找 Chrome/Edge，等待 CDN JIT）
└── references/
    └── stacks.md          # React/Vue/Bootstrap 等技术栈的 CDN 引入配方与版本坑位
```

## 已知局限

- 还原效果取决于所用 AI 模型的视觉能力；复杂页面第一轮还原度有限，依赖 3 轮修正逼近
- 页面中的照片/插画会用 CSS 色块按比例占位（skill 原则是"写出来的页面"，不嵌入原图）
- 渲染依赖本机 Chrome/Edge；若都没有，Agent 需自行寻找替代截图方案

## 来源

方法论提炼自开源项目 [abi/screenshot-to-code](https://github.com/abi/screenshot-to-code) 的生产级实现（提示词工程 + Playwright 截图自检闭环），简化为无服务、跨工具的通用技能。

## License

[MIT](LICENSE)

---

## English

An AI agent skill that converts a screenshot or design mockup into a runnable
single-file HTML page. Unlike one-shot generators, it enforces the loop proven
by [abi/screenshot-to-code](https://github.com/abi/screenshot-to-code):
**generate → render headlessly → visually self-review against the original →
fix**, up to 3 rounds.

**Install** (requires Node.js and Chrome/Edge for rendering): clone this repo
and copy the `screenshot-to-code/` folder into your tool's skills directory —
`~/.trae-cn/skills/` (Trae CN), `~/.claude/skills/` (Claude Code), or the
equivalent for any tool that follows the [Agent Skills](https://agentskills.io)
convention. No API keys, no backend, no Docker.

**Use**: just ask the agent to "convert this screenshot to HTML/code" or
"replicate this page from a picture".
