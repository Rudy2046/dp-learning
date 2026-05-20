# DP Quest · 章节数据文件生成提示词

> 使用方法：新开一个对话，把本文档全部内容粘贴进去，然后用文末的【提问模板】提问。
> Claude 会严格按格式生成 `data/xx_xxx.js`，你直接保存到项目 `data/` 文件夹即可。

---

## 你的任务

为 DP Quest 动态规划闯关平台生成一个章节数据文件。

**只输出 `data/文件名.js` 的文件内容，不需要任何解释。**

---

## 平台背景

面向初高中信息学竞赛学生（GESP六级）的动态规划闯关系统。
每章三关：**新兵 · 锐士 · 英雄**，每关固定4步：

```
Step 1：concept（概念讲解）
Step 2：choice（选择题）
Step 3：choice（选择题）
Step 4：fill（代码填空）
```

**英雄关难度 = 新兵/锐士同级，换角度，不出难题。**

---

## 文件结构

```javascript
// data/01_fib.js
// 章节：01.斐波那契与记忆化搜索 · 重叠子问题初体验

export const LESSON = {
  id:  'fib',           // 英文小写下划线，不含序号
  title: '01.斐波那契与记忆化搜索',
  sub:   '重叠子问题初体验',

  battles: {
    new:  { rank:'新兵', coins:50,  xp:120, steps:[ /*4个Step*/ ] },
    pro:  { rank:'锐士', coins:80,  xp:200, steps:[ /*4个Step*/ ] },
    hero: { rank:'英雄', coins:120, xp:280, steps:[ /*4个Step*/ ] },
  }
};
```

---

## 三种 Step 类型

### concept（第1步）

```javascript
{
  type:    'concept',
  lbl:     '读题',        // 2~4字
  title:   '📖 标题',
  body:    `题目背景正文，多行。`,
  concept: `状态定义、转移方程、核心思路，多行。`,
  table: [              // 可选
    ['表头1','表头2'],
    ['数据1','数据2'],
  ],
  tip: '📌 最容易踩的坑，一句话。',
}
```

### choice（第2、3步）

```javascript
{
  type:  'choice',
  lbl:   '概念',          // 2~4字
  title: '❓ 选择：标题',
  q:     `题目，可多行。`,
  opts:  [              // 恰好4个，不加ABCD前缀（系统自动加）
    '选项一',
    '选项二',           // 正确答案
    '选项三',
    '选项四',
  ],
  ans:    1,            // 正确答案下标（0开始）
  fb_ok:  '✓ 解释为什么对。',
  fb_err: '✗ 给出正确推导路径。',
  hint:   '比答案含蓄的引导。',
}
```

**迷惑项必须覆盖以下至少2种：**
- 概念混淆（把A误认为B）
- 方向错误（正序/逆序）
- 边界遗漏（漏掉等号）
- 语义混淆（选了近似但错误的概念）

### fill（第4步）

```javascript
{
  type:    'fill',
  lbl:     '代码',
  title:   '✏️ 填空：标题',
  q:       '点击代码中的 [?] 方框选中，再点候选项填入：',
  code:    `int func(int n) {
    // [A] 注释说明这行的语义
    // [B] 注释说明这行的语义
}`,
  blanks:  ['A','B'],   // 与code中顺序一致，2~3个
  opts:    [            // 正确答案 + 近似干扰项，数量 = blanks数×2
    '正确A', '干扰A',
    '正确B', '干扰B',
  ],
  answers: ['正确A','正确B'],
  fb_ok:   '✓ 逐空解释为什么对。',
  fb_err:  '✗ 逐空说明正确逻辑。',
  hint:    '含蓄提示。',
}
```

**代码要求：**
- 语言：C++，竞赛风格
- 每个占位符旁边必须有注释说明语义意图
- 干扰项必须是"看起来很像"的近似错误（如 `max` vs `min`，`W` vs `w[i]`）

---

## 三关定位

| 关卡 | 定位 | 概念 | 选择题1 | 选择题2 | 填空 |
|------|------|------|---------|---------|------|
| 新兵 | 理解核心 | 状态定义+dp表 | 状态含义 | 手动推导一步 | 基础代码 |
| 锐士 | 理解陷阱 | 常见错误/优化 | 边界/陷阱 | 两种写法对比 | 修正/优化版 |
| 英雄 | 换角度巩固 | 变形/应用 | 变形推导 | 从特殊到一般 | 变形代码 |

---

## 29章完整列表（理解前后关系用）

```
模块一：引入
  01. fib          斐波那契与记忆化搜索    → data/01_fib.js
  02. triangle     数字三角形              → data/02_triangle.js

模块二：坐标型与线性DP
  03. grid_dp      位置型网格DP            → data/03_grid_dp.js
  04. linear_dp    一维线性DP基础          → data/04_linear_dp.js
  05. maxsubarray  最大连续子段和          → data/05_maxsubarray.js
  06. lis          LIS专题                 → data/06_lis.js
  07. lcs          LCS专题                 → data/07_lcs.js
  08. edit_dist    编辑距离                → data/08_edit_dist.js

模块三：背包DP
  09. knapsack     0/1背包                 → data/09_knapsack.js
  10. complete_pack 完全背包               → data/10_complete_pack.js
  11. multi_pack   多重背包与二进制优化    → data/11_multi_pack.js
  12. group_pack   分组背包                → data/12_group_pack.js
  13. pack_var     背包模型变形            → data/13_pack_var.js

模块四：区间DP
  14. interval_basic    区间DP入门         → data/14_interval_basic.js
  15. interval_circle   环形区间DP         → data/15_interval_circle.js
  16. interval_palindrome 回文型区间DP     → data/16_interval_palindrome.js
  17. interval_score    区间DP得分变形     → data/17_interval_score.js

模块五：树形DP
  18. tree_basic    树形DP基础             → data/18_tree_basic.js
  19. tree_diameter 树的直径              → data/19_tree_diameter.js
  20. tree_pack     树上背包              → data/20_tree_pack.js
  21. tree_reroot   换根DP               → data/21_tree_reroot.js

模块六：状态压缩DP
  22. bit_intro     二进制位运算基础       → data/22_bit_intro.js
  23. statecomp_board 棋盘类状压DP        → data/23_statecomp_board.js
  24. statecomp_tsp 集合类状压·TSP       → data/24_statecomp_tsp.js
  25. statecomp_adv 状压DP综合            → data/25_statecomp_adv.js

模块七：数学与特殊DP
  26. digit_basic  数位DP基础             → data/26_digit_basic.js
  27. digit_adv    数位DP进阶             → data/27_digit_adv.js
  28. prob_dp      概率DP                 → data/28_prob_dp.js
  29. expect_dp    期望DP                 → data/29_expect_dp.js
```

---

## 提问模板

```
请按照以上规范，生成：

章节 ID：fib
文件名：01_fib.js
章节标题：01.斐波那契与记忆化搜索
副标题：重叠子问题初体验
英雄关侧重：记忆化搜索 vs 自底向上递推两种写法对比

只输出 data/01_fib.js 的完整文件内容。
```

---

## 注意事项

1. `id` 字段不含序号，用纯英文如 `'fib'`，不是 `'01_fib'`
2. 文件名含序号，如 `01_fib.js`
3. `title` 字段含序号，如 `'01.斐波那契与记忆化搜索'`
4. 所有多行字符串用反引号包裹
5. C++ 代码保留4空格缩进
6. `opts` 数组不加 A/B/C/D 前缀，系统会自动加


注意：不要在任何字段中使用 Markdown 语法（**加粗**、`行内代码`、```代码块```、|表格|），所有内容用纯文本。