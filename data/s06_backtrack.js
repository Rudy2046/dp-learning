// data/s06_backtrack.js
// 章节：S06.回溯与剪枝 · 全排列·N皇后·剪枝策略

export const LESSON = {
  id:    'backtrack',
  title: 'S06.回溯与剪枝',
  sub:   '全排列·N皇后·剪枝策略',

  battles: {

    // ─────────────────────────────────────────
    // 新兵关：理解核心 · 5步
    // ─────────────────────────────────────────
    new: {
      rank: '新兵',
      coins: 50,
      xp: 120,
      steps: [

        // Step 1: concept
        {
          type:    'concept',
          lbl:     '读题',
          title:   '回溯法：枚举所有可能，走不通就退回',
          body:
`生成 [1, 2, 3] 的全部排列（共 6 种）。
暴力枚举很复杂，回溯法用"选择→递归→撤销"三步框架：

第1位可选 1、2、3：
  选 1 → 第2位选 2 或 3：
    选 2 → 第3位只剩 3 → 输出 [1,2,3]，回退
    选 3 → 第3位只剩 2 → 输出 [1,3,2]，回退
  回退，第1位改选 2：
    选 2 → 第2位选 1 或 3 → 输出 [2,1,3]、[2,3,1]
  回退，第1位改选 3 → 输出 [3,1,2]、[3,2,1]

"回退"就是回溯的核心：做了某个选择后，探索完该方向的所有分支，再撤销这个选择换下一个。`,
          concept:
`全排列回溯框架：
vector<int> path;   // 当前路径
bool used[N+1] = {false};

void backtrack(int depth) {
    if (depth == N) { 输出 path; return; }   // 终止：选了 N 个
    for (int i = 1; i <= N; i++) {
        if (used[i]) continue;               // 已选过，跳过
        used[i] = true;   path.push_back(i); // 选择
        backtrack(depth + 1);                // 递归
        used[i] = false;  path.pop_back();   // 撤销（回溯）
    }
}

三步固定模式：
  1. 做选择（标记 used，加入 path）
  2. 递归进入下一层
  3. 撤销选择（取消标记，弹出 path）`,
          tip: '撤销操作和选择操作必须严格对称：push 对应 pop，used=true 对应 used=false，缺一个就会影响后续搜索。',
        },

        // Step 2: trace（tree mode，全排列决策树）
        {
          type:  'trace',
          lbl:   '看执行',
          title: '回溯决策树：[1,2,3] 全排列生成过程',
          body:  `看清楚回溯法如何通过"选择→递归→撤销"三步，系统地遍历所有排列。`,
          trace: {
            caption: '演示 [1,2,3] 全排列的部分决策树，展示选择和回溯节点',
            mode: 'tree',
            intro: '每个节点表示当前已选的序列，绿色表示到达叶子节点（完整排列），灰色表示已回溯。',
            code:
`void bt(int dep) {
    if (dep==3) { print; return; }
    for i in [1,2,3]:
        if used[i]: continue;
        used[i]=true; path.push(i);
        bt(dep+1);
        used[i]=false; path.pop();
}`,
            frames: [
              {
                id: 'bt0', label: '根：depth=0，选第1位',
                note: '从空开始，第1位尝试选 1。',
                code_line: 3,
                nodes: [
                  { id:'r', label:'[]', state:'active' },
                ],
                vars: { path:'[]', depth:0 },
              },
              {
                id: 'bt1', label: '选 1，进入 depth=1',
                note: '选 1，path=[1]，used[1]=true，递归进入第2位。',
                code_line: 5,
                nodes: [
                  { id:'r', label:'[]', state:'done' },
                  { id:'n1', label:'[1]', state:'active', parent:'r' },
                ],
                vars: { path:'[1]', depth:1 },
              },
              {
                id: 'bt2', label: '选 2，进入 depth=2',
                note: '第2位选 2，path=[1,2]，递归进入第3位。',
                code_line: 5,
                nodes: [
                  { id:'r', label:'[]', state:'done' },
                  { id:'n1', label:'[1]', state:'done', parent:'r' },
                  { id:'n12', label:'[1,2]', state:'active', parent:'n1' },
                ],
                vars: { path:'[1,2]', depth:2 },
              },
              {
                id: 'bt3', label: '选 3，depth=3，输出 [1,2,3]',
                note: '第3位只剩 3，path=[1,2,3]，depth=3 触发终止条件，输出第一个排列。',
                code_line: 2,
                nodes: [
                  { id:'r', label:'[]', state:'done' },
                  { id:'n1', label:'[1]', state:'done', parent:'r' },
                  { id:'n12', label:'[1,2]', state:'done', parent:'n1' },
                  { id:'n123', label:'[1,2,3]✓', state:'active', parent:'n12' },
                ],
                vars: { path:'[1,2,3]', 输出:'[1,2,3]' },
              },
              {
                id: 'bt4', label: '回溯：撤销 3，再撤销 2',
                note: '输出后回溯：撤销 3（path=[1,2]），[1,2] 的 for 循环结束，再撤销 2（path=[1]）。',
                code_line: 7,
                nodes: [
                  { id:'r', label:'[]', state:'done' },
                  { id:'n1', label:'[1]', state:'active', parent:'r' },
                  { id:'n12', label:'[1,2]', state:'done', parent:'n1' },
                  { id:'n123', label:'[1,2,3]✓', state:'done', parent:'n12' },
                ],
                vars: { path:'[1]', 动作:'回溯，撤销 2' },
              },
              {
                id: 'bt5', label: '[1] 改选 3',
                note: '第2位 for 循环继续，改选 3，path=[1,3]，递归进入第3位。',
                code_line: 5,
                nodes: [
                  { id:'r', label:'[]', state:'done' },
                  { id:'n1', label:'[1]', state:'done', parent:'r' },
                  { id:'n12', label:'[1,2]', state:'done', parent:'n1' },
                  { id:'n123', label:'[1,2,3]✓', state:'done', parent:'n12' },
                  { id:'n13', label:'[1,3]', state:'active', parent:'n1' },
                ],
                vars: { path:'[1,3]', depth:2 },
              },
              {
                id: 'bt6', label: '输出 [1,3,2]，回溯到根',
                note: '第3位选 2，输出 [1,3,2]，逐层回溯直到根节点，继续选第1位的下一个值。',
                code_line: 7,
                nodes: [
                  { id:'r', label:'[]', state:'active', parent:null },
                  { id:'n1', label:'[1]', state:'done', parent:'r' },
                  { id:'n12', label:'[1,2]', state:'done', parent:'n1' },
                  { id:'n123', label:'[1,2,3]✓', state:'done', parent:'n12' },
                  { id:'n13', label:'[1,3]', state:'done', parent:'n1' },
                  { id:'n132', label:'[1,3,2]✓', state:'done', parent:'n13' },
                ],
                vars: { 已输出:'[1,2,3],[1,3,2]', 动作:'回溯到根，继续' },
              },
            ],
          },
        },

        // Step 3: choice 1
        {
          type:  'choice',
          lbl:   '判断',
          title: '回溯法中"撤销选择"的目的是什么？',
          body:  `在回溯框架的第三步 used[i]=false; path.pop_back(); 的目的是什么？`,
          opts: [
            '恢复到做此选择之前的状态，让其他分支也能做这个选择',
            '释放内存，避免 path 数组变得过大',
            '表示这个选择是错误的，标记为不可用',
            '让递归函数知道当前深度已经处理完毕',
          ],
          answer: 0,
          explain: '撤销选择的目的是"恢复现场"：探索完当前选择的所有子分支后，把状态还原到做选择前，这样后续循环中的其他选择可以在"干净的状态"下进行，确保每种可能都被枚举到。',
        },

        // Step 4: choice 2
        {
          type:  'choice',
          lbl:   '推导',
          title: '[1,2,3] 的全排列共有几种？回溯树共有几个叶子节点？',
          body:  `全排列问题：n 个不同元素的排列数等于 n!。当 n=3 时：`,
          opts: [
            '6 种，6 个叶子节点',
            '3 种，3 个叶子节点',
            '9 种，9 个叶子节点',
            '8 种，8 个叶子节点',
          ],
          answer: 0,
          explain: '3! = 3×2×1 = 6，共 6 种排列：[1,2,3][1,3,2][2,1,3][2,3,1][3,1,2][3,2,1]。每种排列对应决策树的一个叶子节点，共 6 个叶子节点。',
        },

        // Step 5: fill
        {
          type:  'fill',
          lbl:   '填代码',
          title: '完成全排列回溯框架',
          body:  `补全全排列的回溯函数，生成 [1..N] 的所有排列：`,
          code:
`void backtrack(int dep) {
    if (dep == N) { printPath(); return; }
    for (int i = 1; i <= N; i++) {
        if (___①___[i]) continue;
        used[i] = ___②___;
        path.push_back(i);
        backtrack(dep + 1);
        used[i] = false;
        path.___③___();
    }
}`,
          blanks: ['①', '②', '③'],
          answer: ['used', 'true', 'pop_back'],
          opts: ['used', 'path', 'true', 'false', 'pop_back', 'push_back'],
          explain: '①检查 used[i] 是否已选；②选中后标记 used[i]=true；③回溯时撤销选择 path.pop_back()，与进入时的 push_back 严格对称。',
        },

      ],
    },

    // ─────────────────────────────────────────
    // 锐士关：理解陷阱 · 5步（N皇后与剪枝）
    // ─────────────────────────────────────────
    pro: {
      rank: '锐士',
      coins: 80,
      xp: 200,
      steps: [

        // Step 1: concept
        {
          type:    'concept',
          lbl:     '找坑',
          title:   'N 皇后：漏掉斜线冲突检查',
          body:
`N 皇后问题：在 N×N 棋盘放 N 个皇后，使得任意两个皇后不在同一行、同一列、同一斜线。

某同学写了如下代码：
void queen(int row) {
    if (row == N) { count++; return; }
    for (int col = 0; col < N; col++) {
        if (colUsed[col]) continue;     // 只检查列冲突
        colUsed[col] = true;
        queen(row + 1);
        colUsed[col] = false;
    }
}

这段代码只检查了列冲突，完全忘记了斜线冲突！
比如皇后在 (0,0) 和 (1,1)，列不同（0列和1列），但在同一条斜线上，会互相攻击。`,
          concept:
`完整的 N 皇后检查（行+列+两条斜线）：
bool colUsed[N];
bool diag1[2*N];  // 主对角线：r-c 相同（加偏移 N 防负数）
bool diag2[2*N];  // 副对角线：r+c 相同

void queen(int row) {
    if (row == N) { count++; return; }
    for (int col = 0; col < N; col++) {
        if (colUsed[col]) continue;
        if (diag1[row-col+N]) continue;  // 主对角线冲突
        if (diag2[row+col])   continue;  // 副对角线冲突
        colUsed[col]=true; diag1[row-col+N]=true; diag2[row+col]=true;
        queen(row+1);
        colUsed[col]=false; diag1[row-col+N]=false; diag2[row+col]=false;
    }
}

关键：同一主对角线 r-c 相同，同一副对角线 r+c 相同。`,
          tip: '对角线判断：主对角线 r-c 为常数，副对角线 r+c 为常数，两个数组分别记录这两种值。',
        },

        // Step 2: trace（tree，4皇后决策树的部分剪枝过程）
        {
          type:  'trace',
          lbl:   '看执行',
          title: '4皇后：合法检查如何剪掉大量分支',
          body:  `看清楚 4 皇后的回溯中，检查列和斜线冲突后，有多少分支在早期就被剪掉。`,
          trace: {
            caption: '演示 4 皇后部分决策树（第0行选不同列），被冲突剪枝的分支标为灰色',
            mode: 'tree',
            intro: '注意被"剪枝"的节点：进入前发现冲突，直接跳过，不递归，减少大量无效搜索。',
            code:
`void queen(int row) {
    if (row==4) { count++; return; }
    for (col in 0..3):
        if (colUsed[col]||diag冲突) continue; // 剪枝
        放置; queen(row+1); 撤销;
}`,
            frames: [
              {
                id: 'q0', label: '第0行，选列0',
                note: '第0行在列0放置皇后，合法，进入第1行。',
                code_line: 5,
                nodes: [
                  { id:'r', label:'row0', state:'done' },
                  { id:'c00', label:'col0', state:'active', parent:'r' },
                ],
                vars: { row:0, col:0, 放置:'(0,0)' },
              },
              {
                id: 'q1', label: '第1行，col0 和 col1 被剪',
                note: '第1行：col0 列冲突剪掉；col1 副对角线 0+1=1=0+1 冲突剪掉；col2 合法，进入。',
                code_line: 4,
                nodes: [
                  { id:'r', label:'row0', state:'done' },
                  { id:'c00', label:'col0', state:'done', parent:'r' },
                  { id:'c10', label:'col0×', state:'pruned', parent:'c00' },
                  { id:'c11', label:'col1×', state:'pruned', parent:'c00' },
                  { id:'c12', label:'col2', state:'active', parent:'c00' },
                ],
                vars: { row:1, 已放:'(0,0)', 剪枝:'col0列冲突,col1斜线冲突' },
              },
              {
                id: 'q2', label: '第2行，col0-2 全被剪',
                note: '放置了 (0,0)(1,2) 后，第2行的 col0、col1、col2 因列或斜线冲突全被剪，col3 合法。',
                code_line: 4,
                nodes: [
                  { id:'r', label:'row0', state:'done' },
                  { id:'c00', label:'col0', state:'done', parent:'r' },
                  { id:'c10', label:'col0×', state:'pruned', parent:'c00' },
                  { id:'c11', label:'col1×', state:'pruned', parent:'c00' },
                  { id:'c12', label:'col2', state:'done', parent:'c00' },
                  { id:'c20', label:'col0×', state:'pruned', parent:'c12' },
                  { id:'c21', label:'col1×', state:'pruned', parent:'c12' },
                  { id:'c22', label:'col2×', state:'pruned', parent:'c12' },
                  { id:'c23', label:'col3', state:'active', parent:'c12' },
                ],
                vars: { row:2, 已放:'(0,0)(1,2)' },
              },
              {
                id: 'q3', label: '第3行，所有列都冲突，全剪',
                note: '放置了 (0,0)(1,2)(2,3) 后，第3行 col0~3 全部冲突，无法放置，回溯。',
                code_line: 4,
                nodes: [
                  { id:'r', label:'row0', state:'done' },
                  { id:'c00', label:'col0', state:'done', parent:'r' },
                  { id:'c12', label:'col2', state:'done', parent:'c00' },
                  { id:'c23', label:'col3', state:'done', parent:'c12' },
                  { id:'c30', label:'col0×', state:'pruned', parent:'c23' },
                  { id:'c31', label:'col1×', state:'pruned', parent:'c23' },
                  { id:'c32', label:'col2×', state:'pruned', parent:'c23' },
                  { id:'c33', label:'col3×', state:'pruned', parent:'c23' },
                ],
                vars: { row:3, 结果:'死局，回溯' },
              },
              {
                id: 'q4', label: '第0行改选列1，继续搜索',
                note: '回溯到第0行，改选列1，从 (0,1) 重新开始。4皇后最终有 2 个解。',
                code_line: 5,
                nodes: [
                  { id:'r', label:'row0', state:'active' },
                  { id:'c00', label:'col0', state:'done', parent:'r' },
                  { id:'c01', label:'col1', state:'active', parent:'r' },
                ],
                vars: { row:0, 下一步:'从列1重新搜索', 总解数:2 },
              },
            ],
          },
        },

        // Step 3: choice 1
        {
          type:  'choice',
          lbl:   '找错',
          title: '以下 N 皇后的合法性检查，哪个漏掉了必要条件？',
          body:
`代码A：只检查 colUsed[col]
代码B：检查 colUsed[col] && diag1[r-c+N] && diag2[r+c]
代码C：检查 colUsed[col] || diag1[r-c+N] || diag2[r+c]`,
          opts: [
            '代码A漏掉了斜线检查，代码B用 && 逻辑错误（三个都为 true 才剪，应该任一为 true 就剪）',
            '代码A和代码C都正确，代码B逻辑写反',
            '三种写法等价，只是风格不同',
            '代码C错误，代码A和B都正确',
          ],
          answer: 0,
          explain: '代码A只检查列冲突，漏掉两条斜线，会输出错误结果。代码B逻辑错误：三个条件都为 true 才跳过（必须同时列、主斜、副斜都有冲突？不对），应该用 ||（任一冲突就跳过）。代码C是正确写法：任一冲突就 continue。',
        },

        // Step 4: choice 2
        {
          type:  'choice',
          lbl:   '对比',
          title: '剪枝为什么能大幅减少回溯的搜索量？',
          body:  `N 皇后中，某个分支在第 2 行就发现无法继续，剪枝效果体现在：`,
          opts: [
            '跳过该分支后，第 3、4...N 行的所有子节点都不需要展开，可能省去指数级计算',
            '剪枝只能节省常数倍的时间，不影响渐近复杂度',
            '剪枝只在第一层有效，深层的分支无法提前终止',
            '剪枝使回溯变成 O(n) 时间，与 BFS 一样快',
          ],
          answer: 0,
          explain: '回溯树是指数级的，在第 k 层发现死局并剪枝，可以跳过该节点下方的所有子树（可能是大量节点）。越早剪枝越有效，能省去的工作量是指数级的。',
        },

        // Step 5: fill
        {
          type:  'fill',
          lbl:   '修正',
          title: '补全 N 皇后的斜线检查',
          body:  `在现有列检查基础上，补充主对角线和副对角线的冲突判断：`,
          code:
`for (int col = 0; col < N; col++) {
    if (colUsed[col]) continue;
    if (diag1[row-col+N]) continue;   // 主对角线冲突
    if (diag2[___①___]) continue;     // 副对角线冲突
    colUsed[col]=true;
    diag1[row-col+N]=true; diag2[row+col]=true;
    queen(row+1);
    colUsed[col]=false;
    diag1[row-col+N]=___②___; diag2[row+col]=___③___;
}`,
          blanks: ['①', '②', '③'],
          answer: ['row+col', 'false', 'false'],
          opts: ['row+col', 'row-col', 'false', 'true', 'row*col', 'col-row'],
          explain: '①副对角线的标志是 row+col 相同；②③回溯时将两条对角线标记都恢复 false，与放置时设 true 严格对称。',
        },

      ],
    },

    // ─────────────────────────────────────────
    // 英雄关：换角度巩固 · 5步（剪枝策略总结与可行性剪枝）
    // ─────────────────────────────────────────
    hero: {
      rank: '英雄',
      coins: 120,
      xp: 280,
      steps: [

        // Step 1: concept
        {
          type:    'concept',
          lbl:     '变形',
          title:   '两类剪枝策略：可行性剪枝 vs 最优性剪枝',
          body:
`回溯搜索的核心优化是剪枝，分两大类：

可行性剪枝（Feasibility Pruning）：
  当前状态已经不可能产生合法解 → 直接剪掉整个分支。
  例：N 皇后中，某格已与已放皇后冲突，不继续；全排列中，某数已使用，跳过。
  特点：剪掉的一定是"错误"的分支，不会丢失任何合法解。

最优性剪枝（Optimality Pruning / 上界剪枝）：
  当前分支即使最优化也无法超过已知最优解 → 剪掉。
  例：TSP 问题中，当前路径已比最短路长，不继续；
      01背包中，剩余物品全选也凑不够目标价值，不继续。
  特点：剪掉的是"不可能更优"的分支，保证不丢最优解。`,
          concept:
`实战中如何判断用哪类剪枝？

可行性剪枝的触发条件：
  当前选择违反约束（冲突、重复、越界等）→ continue/return

最优性剪枝的触发条件（找最大/最小值时）：
  当前累计值 + 剩余最优上界 < 已知最优值 → 剪掉
  写法：if (cur + upperBound() <= best) return;

两类剪枝可以同时使用，互不干扰。
越早触发剪枝，效果越好（高层剪枝比低层效果指数级更好）。`,
          tip: '加剪枝前先写出暴力回溯，确认答案正确，再逐步添加剪枝并验证结果不变。',
        },

        // Step 2: trace（tree，可行性剪枝+最优性剪枝联合演示）
        {
          type:  'trace',
          lbl:   '看执行',
          title: '两类剪枝：可行性剪枝和最优性剪枝的决策树对比',
          body:  `看清楚两种剪枝在决策树上各自剪掉哪些分支，以及触发条件的不同。`,
          trace: {
            caption: '演示从 [1,2,3,4] 选数凑和 = 5 的子集，同时使用两类剪枝',
            mode: 'tree',
            intro: '绿色：合法解；橙色：可行性剪枝（当前不合法）；红色：最优性剪枝（已超目标，不可能到达正确和）。',
            code:
`void bt(int idx, int cur) {
    if (cur==5) { found++; return; } // 找到解
    if (cur>5) return;               // 可行性剪枝
    if (idx==n) return;              // 越界
    // 选 idx，或不选 idx
    bt(idx+1, cur+nums[idx]);
    bt(idx+1, cur);
}`,
            frames: [
              {
                id: 'pr0', label: '根：cur=0，从 idx=0 开始',
                note: '开始搜索，当前和 cur=0，目标 5，从第0个数（值1）开始选或不选。',
                code_line: 1,
                nodes: [
                  { id:'r', label:'cur=0', state:'active' },
                ],
                vars: { cur:0, 目标:5 },
              },
              {
                id: 'pr1', label: '选 1，cur=1；不选 1，cur=0',
                note: '第0位：选 1 进入 cur=1，不选进入 cur=0，两个分支都合法继续。',
                code_line: 6,
                nodes: [
                  { id:'r', label:'cur=0', state:'done' },
                  { id:'s1', label:'选1/cur=1', state:'active', parent:'r' },
                  { id:'n1', label:'不选1/cur=0', state:'pending', parent:'r' },
                ],
                vars: { cur:1 },
              },
              {
                id: 'pr2', label: '选1→选2→选3，cur=6>5，可行性剪枝',
                note: '路径选1、选2、选3，cur=6 > 5，超过目标，触发可行性剪枝，return，不再继续。',
                code_line: 3,
                nodes: [
                  { id:'r', label:'cur=0', state:'done' },
                  { id:'s1', label:'选1/cur=1', state:'done', parent:'r' },
                  { id:'s12', label:'选2/cur=3', state:'done', parent:'s1' },
                  { id:'s123', label:'选3/cur=6', state:'pruned', parent:'s12' },
                ],
                vars: { cur:6, 剪枝:'cur>5，可行性剪枝' },
              },
              {
                id: 'pr3', label: '选1→选2→不选3→选4，cur=7>5，剪',
                note: '选1选2不选3选4，cur=7>5，再次可行性剪枝，回溯。',
                code_line: 3,
                nodes: [
                  { id:'r', label:'cur=0', state:'done' },
                  { id:'s1', label:'选1/cur=1', state:'done', parent:'r' },
                  { id:'s12', label:'选2/cur=3', state:'done', parent:'s1' },
                  { id:'s123', label:'选3×/cur=6', state:'pruned', parent:'s12' },
                  { id:'s124', label:'选4/cur=7', state:'pruned', parent:'s12' },
                ],
                vars: { cur:7, 剪枝:'cur>5，可行性剪枝' },
              },
              {
                id: 'pr4', label: '选1→不选2→选3→不选4，cur=4，没找到',
                note: '选1不选2选3不选4，cur=1+3=4≠5，越界（idx=4），没有解，回溯。',
                code_line: 4,
                nodes: [
                  { id:'r', label:'cur=0', state:'done' },
                  { id:'s1', label:'选1/cur=1', state:'done', parent:'r' },
                  { id:'s12', label:'选2/cur=3', state:'done', parent:'s1' },
                  { id:'ns1', label:'不选2/cur=1', state:'done', parent:'s1' },
                  { id:'ns13', label:'选3/cur=4', state:'done', parent:'ns1' },
                  { id:'ns13n4', label:'不选4/cur=4', state:'pending', parent:'ns13' },
                ],
                vars: { cur:4, 结果:'cur=4≠5，未找到' },
              },
              {
                id: 'pr5', label: '找到合法解：选1选4，cur=5',
                note: '选1不选2不选3选4，cur=1+4=5=目标，找到一个合法解！',
                code_line: 2,
                nodes: [
                  { id:'r', label:'cur=0', state:'done' },
                  { id:'s1', label:'选1/cur=1', state:'done', parent:'r' },
                  { id:'ns1', label:'不选2/cur=1', state:'done', parent:'s1' },
                  { id:'ns13n', label:'不选3/cur=1', state:'done', parent:'ns1' },
                  { id:'solution1', label:'选4/cur=5✓', state:'active', parent:'ns13n' },
                ],
                vars: { cur:5, 解:'[1,4]', 找到:1 },
              },
            ],
          },
        },

        // Step 3: choice 1
        {
          type:  'choice',
          lbl:   '判断',
          title: '以下哪个属于最优性剪枝（而非可行性剪枝）？',
          body:  `区分两类剪枝：可行性剪枝（当前已不合法）vs 最优性剪枝（当前分支不可能更优）：`,
          opts: [
            '0-1 背包中，当前已选物品重量超过容量上限，剪掉',
            '全排列中，某元素已被选过，跳过',
            'N 皇后中，某列已有皇后，跳过当前列',
            'N 皇后中，当前格与已放皇后在同一斜线，跳过',
          ],
          answer: 0,
          explain: '重量超过容量上限时当前方案已不合法，这是可行性剪枝，而非最优性剪枝。最优性剪枝是"当前和剩余最优也无法超过已知最优"，题目中如"剩余物品全选也达不到目标"。其余三项都是可行性剪枝（违反约束条件）。',
        },

        // Step 4: choice 2
        {
          type:  'choice',
          lbl:   '推广',
          title: '在哪一层加剪枝效果最好？',
          body:  `对于回溯搜索树，以下关于剪枝位置的描述哪个正确？`,
          opts: [
            '越靠近根节点的剪枝效果越好，能剪掉的子树规模更大',
            '越靠近叶子节点的剪枝更精确，效果更好',
            '所有层的剪枝效果相同，只是触发时机不同',
            '只有在叶子节点才能判断是否需要剪枝',
          ],
          answer: 0,
          explain: '回溯树呈指数增长，在第 k 层剪掉一个节点能避免展开它下方的所有子树，层数越低（越靠近根）子树越大，节省的搜索量越多。因此尽量在更早的层（高层）添加剪枝条件效果最显著。',
        },

        // Step 5: fill
        {
          type:  'fill',
          lbl:   '改写',
          title: '给回溯加上可行性剪枝和最优性剪枝',
          body:  `在选数凑目标和的回溯中，补全两类剪枝：`,
          code:
`void bt(int idx, int cur, int remain) {
    if (cur == target) { ans++; return; }
    if (cur ___①___ target) return;   // 可行性剪枝：超过目标
    if (cur + remain ___②___ target) return; // 最优性剪枝
    if (idx == n) return;
    bt(idx+1, cur+nums[idx], remain-nums[idx]);
    bt(idx+1, cur, ___③___-nums[idx]);
}`,
          blanks: ['①', '②', '③'],
          answer: ['>', '<', 'remain'],
          opts: ['>', '<', '>=', 'remain', 'cur', 'target'],
          explain: '①cur>target 时已超过目标，可行性剪枝直接 return；②cur+remain<target 时剩余全选也达不到目标，最优性剪枝 return；③不选当前数时 remain 减去当前数的值，表示剩余可选总量减少。',
        },

      ],
    },

  },
};

// [自检] trace frames 验证：
//   新兵 tree 7帧：[1,2,3]全排列决策树，选1→选2→选3输出[1,2,3]→回溯撤销→改选3→输出[1,3,2]→回溯到根，路径和输出顺序正确 ✓
//   锐士 tree 5帧：4皇后 (0,0)放置后，第1行col0列冲突+col1斜线冲突，第2行三列冲突只剩col3，第3行全死，回溯；剪枝逻辑与真实N皇后搜索对应 ✓
//   英雄 tree 6帧：从[1,2,3,4]选数凑5，选1+选2+选3=6>5可行剪枝，选1+4=5找到解，两类剪枝均有演示 ✓
// [自检] choice 迷惑项覆盖类型：
//   新兵Q1(正确恢复状态/释放内存/标记错误/告知深度) 新兵Q2(正确6/3/9/8)
//   锐士Q1(正确A漏B逻辑错/AC正确/等价/C错AB对) 锐士Q2(正确指数级/常数倍/只第一层/变O(n))
//   英雄Q1(正确背包超重/全排已选/N皇后列冲突/N皇后斜冲突) 英雄Q2(正确高层效果好/低层精确/相同/只叶子)
// [自检] 三关 concept 差异化：✓
//   新兵：[1,2,3]全排列具体示例 + 选择/递归/撤销三步框架
//   锐士：N皇后漏掉斜线检查的错误代码 + 主副对角线标志 r-c 和 r+c 的修正方法
//   英雄：可行性剪枝 vs 最优性剪枝的定义对比 + 触发条件和适用场景总结
// [自检] fill opts 无序池确认：✓
//   新兵 opts=['used','path','true','false','pop_back','push_back']，6项覆盖3空
//   锐士 opts=['row+col','row-col','false','true','row*col','col-row']，6项覆盖3空
//   英雄 opts=['>','<','>=','remain','cur','target']，6项覆盖3空
