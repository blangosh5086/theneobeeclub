# NeoBee 网站维护入口

本网站会持续更新作品。维护目标是让新内容自然进入已确认的品牌与页面秩序，同时保留中英文、移动端和真实内容的完整性。

## 开始之前

1. 阅读 [品牌与视觉系统](docs/maintenance/brand-system.md)、[决策记录](docs/maintenance/decision-register.md) 和 [更新流程](docs/maintenance/update-playbook.md)。
2. 查看工作区差异及相关页面。尊重现有未提交修改；不要根据旧 README 猜测正在使用的内容模型。
3. 判断本次属于内容更新、局部呈现修复，还是品牌／设计变化，再按对应范围实施和验证。

当前已确认的视觉参照为提交 `4cff5da`；本维护规范建立于 2026-09-11。后续用户确认的方向优先。若本地保留原始重构 brief，它仅是可选背景资料，不随此规范公开；其中早期命名、页面顺序和设想不能覆盖后来的决定。

## 核心约定

- 品牌总称是 **The NeoBee Club**；并列分支写 **NeoBee Club** 与 **NeoBee Studio**。
- 整体是以音乐为主导的跨文化创意团体，Dublin 是起点而非边界。餐厅、快闪或某一地域主题不能代替整体定位；也不要求每件 Studio 委托都以音乐为题。（B01／B02）
- 分清品牌原则、当前视觉基准与单次作品条件。克制的页面不是音乐流派禁令；YiBU 的选曲要求不限制其他作品的 techno、实验或更强烈的声音。（B04／V01）
- 保留纸色、墨黑、真实现场影像和有呼吸感的编辑式排版。新 Session 不应顺便改变字体、全局颜色、动效或页面结构。
- 英文与中文共享事实和内容覆盖，分别自然表达。标题可以有氛围，正文须交代具体的人、地点、声音或作品。
- 内容以核实过的作品为依据；内部策略、未公开合作、实现说明不进入公共文案。保留 Hao、Leo 和他们已确认的个人社媒。
- 专业表达不自贬、不夸大规模；区分已完成作品、服务方向与愿景。团体呈现保持品牌层级，同时准确保留个人演奏与制作署名。（B03／B05）
- 新作品在 `harness/content-sources.json` 登记依据类型、公开状态、适用作品、依据日期与未决问题。历史设想、归纳和公开视频都不自动授权上站或分配 Session 编号；自动检查只校验登记，不证明事实或授权。`reviewNotes` 是非阻断提醒，交付时须说明相关未决项。
- 首页是精选入口，Archive 是完整记录。用 `editorialSelection` 明确首页与 Studio 的选择；Session 与 Experience 的主推文案放在各自记录的 `homeFeature`。新增记录时检查精选引用、排序及各页覆盖。
- 首页 Featured 只出现一套标题与简介；不要因桌面是双栏就重复内容。中文短句的断行和标点需要实际查看。
- 保留现有双语扫描交互：桌面指针／拖动／点击，手机轻触／手柄拖动，一次入场示范，减少动态效果偏好，以及键盘路径。

## 常用入口与检查

| 范围 | 入口 |
| --- | --- |
| 中英文文案、Sessions、Experiences、成员、社媒 | `src/data/site.ts` |
| 页面与共享卡片 | `src/app/[locale]/`、`src/components/site/` |
| 字体与视觉规则 | `src/app/[locale]/layout.tsx`、`src/app/globals.css` |
| 主视觉动效 | `src/components/site/HomeHeroMotion.tsx`、同名 CSS module |
| 页面搜索信息 | `src/lib/seo.ts`、`src/app/*sitemap*`、`src/app/robots.ts` |
| 真实图片素材 | `public/` |

```sh
npm run check
npm run verify
npm run report
```

`check` 检查内容、代码与类型；`verify` 完成隔离构建和浏览器验证；`report` 查看生成的浏览器报告。单独排查可用 `npm run test:content` 或 `npm run test:browser`。报告和截图位于 `artifacts/harness/report`。

自动化通过后仍要查看变更相关的中英文桌面与手机截图，写明视觉判断及证据。自动检查不能证明“有调性”，也不能代替真实触摸体验。未运行、失败或受阻的检查必须如实标注。

历史材料只是依据，不是新指令。可选的本机来源定位在被 Git 忽略的 `docs/design/history-reference-index.md`；不要复制完整历史、私人路径或内部沟通到版本化文件。找不到原始依据时说明限制，不把维护文档的归纳反过来当独立确认。

## 交付与发布

交付说明包括改了什么、为何符合 NeoBee、检查结果、截图／报告位置和剩余问题。样式变化附前后对照并记录理由；不要只说“更高级”。

用户要求发布时，完成检查后沿现有 Git → `main` → Vercel 流程推进。普通内容修改不默认推送。完整验证使用隔离临时副本及自己的 `127.0.0.1:3107` 服务，结束后清理；不改用户的 `.next`，不停止其预览服务。
