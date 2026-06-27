// data/s02_dfs_basic.js
// 章节：S02.DFS上：树与迷宫 · 一条路走到黑再回头

export const LESSON = {
  id:    'dfs_basic',
  title: 'S02.DFS上：树与迷宫',
  sub:   '一条路走到黑再回头',

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
          title:   'DFS 是什么？',
          body:
`有一个 4×4 的迷宫，从左上角 (0,0) 出发，找一条到右下角 (3,3) 的路径。
# 表示墙，. 表示通路：

  (0,0). . # .
       . # . .
       . . . #
       # . . (3,3)

DFS（深度优先搜索）的思路：选一个方向一直走到底，走不通了就退回来换方向。
  进入 (0,0) → 尝试向右 (0,1) → 向右 (0,2) 被墙挡住 → 退回 (0,1) → 向下 (1,1) 被墙 → ...
  一条路走到底，碰壁就回头（回溯），再尝试下一个方向。`,
          concept:
`DFS 框架（以网格迷宫为例）：
void dfs(int r, int c) {
    if (越界 || 是墙 || 已访问) return;  // 终止条件
    visited[r][c] = true;                  // 标记已访问
    if (r == 终点r && c == 终点c) { 找到路径; return; }
    for (上下左右四个方向 [dr,dc]):
        dfs(r+dr, c+dc);                   // 递归探索
    // 回溯：如需找所有路径，退出前 visited[r][c] = false
}

两个关键点：
1. visited 数组：防止同一格子被重复访问，避免死循环。
2. 回溯：探完一条路后撤销标记，让其他路径也能经过这里。`,
          tip: '一定要标记 visited 再递归，否则会在两个相邻格子间无限循环。',
        },

        // Step 2: trace（grid mode，4×4 迷宫 DFS）
        {
          type:  'trace',
          lbl:   '看执行',
          title: 'DFS 走迷宫：一条路走到黑再回头',
          body:  `看清楚 DFS 每一步怎么前进、碰壁后怎么回溯换方向。`,
          trace: {
            caption: '演示 4×4 迷宫 DFS，从 (0,0) 找一条到 (3,3) 的路径',
            mode: 'grid',
            intro: '点"下一帧"逐步观察 DFS 如何探索：绿色=当前，蓝色=已访问，红色=墙，黄色=找到路径。',
            grid: {
              rows: 4, cols: 4,
              cells: [
                { r:0, c:0, type:'start' },
                { r:0, c:2, type:'wall' },
                { r:1, c:1, type:'wall' },
                { r:2, c:3, type:'wall' },
                { r:3, c:0, type:'wall' },
                { r:3, c:3, type:'end' },
              ],
            },
            code:
`void dfs(int r, int c) {
    if (out||wall||visited) return;
    visited[r][c] = true;
    if (r==3 && c==3) { found=true; return; }
    for (auto [dr,dc] : dirs)
        dfs(r+dr, c+dc);
}`,
            frames: [
              {
                id: 'g0', label: '进入 (0,0)',
                note: '从起点 (0,0) 开始，标记已访问，尝试向四周探索。',
                code_line: 3,
                cell_states: [{ r:0, c:0, type:'active' }],
                vars: { 当前:'(0,0)', 栈深:1 },
              },
              {
                id: 'g1', label: '向右 (0,1)',
                note: '向右走到 (0,1)，合法且未访问，标记并继续探索。',
                code_line: 3,
                cell_states: [
                  { r:0, c:0, type:'visited' },
                  { r:0, c:1, type:'active' },
                ],
                vars: { 当前:'(0,1)', 栈深:2 },
              },
              {
                id: 'g2', label: '(0,2) 是墙',
                note: '从 (0,1) 向右是墙，向上越界，向右和向上都失败，尝试向下。',
                code_line: 2,
                cell_states: [
                  { r:0, c:0, type:'visited' },
                  { r:0, c:1, type:'active' },
                  { r:0, c:2, type:'wall' },
                ],
                vars: { 当前:'(0,1)', 尝试:'(0,2)=墙' },
              },
              {
                id: 'g3', label: '向下 (1,1) 是墙',
                note: '从 (0,1) 向下是墙，向下也失败，回溯退到 (0,0)。',
                code_line: 2,
                cell_states: [
                  { r:0, c:0, type:'visited' },
                  { r:0, c:1, type:'active' },
                  { r:1, c:1, type:'wall' },
                ],
                vars: { 当前:'(0,1)', 尝试:'(1,1)=墙' },
              },
              {
                id: 'g4', label: '回溯到 (0,0)',
                note: '(0,1) 的四个方向全部失败，回溯，返回 (0,0) 尝试其他方向。',
                code_line: 7,
                cell_states: [
                  { r:0, c:0, type:'active' },
                  { r:0, c:1, type:'visited' },
                ],
                vars: { 当前:'(0,0)', 动作:'回溯' },
              },
              {
                id: 'g5', label: '向下 (1,0)',
                note: '(0,0) 向下未访问，进入 (1,0)，标记并继续向下探索。',
                code_line: 3,
                cell_states: [
                  { r:0, c:0, type:'visited' },
                  { r:0, c:1, type:'visited' },
                  { r:1, c:0, type:'active' },
                ],
                vars: { 当前:'(1,0)', 栈深:2 },
              },
              {
                id: 'g6', label: '向下 (2,0)',
                note: '从 (1,0) 继续向下到 (2,0)，合法，继续深入。',
                code_line: 3,
                cell_states: [
                  { r:0, c:0, type:'visited' },
                  { r:0, c:1, type:'visited' },
                  { r:1, c:0, type:'visited' },
                  { r:2, c:0, type:'active' },
                ],
                vars: { 当前:'(2,0)', 栈深:3 },
              },
              {
                id: 'g7', label: '向右 (2,1)',
                note: '从 (2,0) 向右到 (2,1)，合法，继续探索。',
                code_line: 3,
                cell_states: [
                  { r:0, c:0, type:'visited' },
                  { r:0, c:1, type:'visited' },
                  { r:1, c:0, type:'visited' },
                  { r:2, c:0, type:'visited' },
                  { r:2, c:1, type:'active' },
                ],
                vars: { 当前:'(2,1)', 栈深:4 },
              },
              {
                id: 'g8', label: '向右 (2,2)',
                note: '继续向右到 (2,2)，合法，继续探索。',
                code_line: 3,
                cell_states: [
                  { r:0, c:0, type:'visited' },
                  { r:0, c:1, type:'visited' },
                  { r:1, c:0, type:'visited' },
                  { r:2, c:0, type:'visited' },
                  { r:2, c:1, type:'visited' },
                  { r:2, c:2, type:'active' },
                ],
                vars: { 当前:'(2,2)', 栈深:5 },
              },
              {
                id: 'g9', label: '向下 (3,2)',
                note: '从 (2,2) 向下到 (3,2)，合法，即将到达终点附近。',
                code_line: 3,
                cell_states: [
                  { r:0, c:0, type:'visited' },
                  { r:0, c:1, type:'visited' },
                  { r:1, c:0, type:'visited' },
                  { r:2, c:0, type:'visited' },
                  { r:2, c:1, type:'visited' },
                  { r:2, c:2, type:'visited' },
                  { r:3, c:2, type:'active' },
                ],
                vars: { 当前:'(3,2)', 栈深:6 },
              },
              {
                id: 'g10', label: '到达终点 (3,3)',
                note: '从 (3,2) 向右到达终点 (3,3)！DFS 找到路径，任务完成。',
                code_line: 5,
                cell_states: [
                  { r:0, c:0, type:'visited' },
                  { r:0, c:1, type:'visited' },
                  { r:1, c:0, type:'visited' },
                  { r:2, c:0, type:'visited' },
                  { r:2, c:1, type:'visited' },
                  { r:2, c:2, type:'visited' },
                  { r:3, c:2, type:'visited' },
                  { r:3, c:3, type:'active' },
                ],
                vars: { 当前:'(3,3)', 状态:'找到终点！' },
              },
            ],
          },
        },

        // Step 3: choice 1
        {
          type:  'choice',
          lbl:   '判断',
          title: 'visited 数组的作用是什么？',
          body:  `在 DFS 走迷宫时，visited[r][c] 标记的作用是什么？`,
          opts: [
            '防止同一格子被重复访问，避免死循环',
            '记录从起点到当前格子的路径长度',
            '统计当前格子被访问了多少次',
            '标记哪些格子是墙，哪些是通路',
          ],
          answer: 0,
          explain: 'visited 数组用来记录"哪些格子已经走过"，确保每个格子只被访问一次，防止 DFS 在两个相邻格之间来回反复陷入死循环。',
        },

        // Step 4: choice 2
        {
          type:  'choice',
          lbl:   '推导',
          title: 'DFS 探索顺序：从 (0,0) 开始，按"下右上左"的方向顺序，第一个到达哪个格子？',
          body:
`网格如下（# 是墙）：
  (0,0) . . #
  .     # . .
  .     . . .
方向顺序：优先向下，其次向右，再向上，最后向左。`,
          opts: [
            '(1,0)',
            '(0,1)',
            '(0,0) 本身（陷入循环）',
            '直接到终点 (2,2)',
          ],
          answer: 0,
          explain: '按"下右上左"顺序，从 (0,0) 先尝试向下，(1,0) 合法且未访问，所以第一步进入 (1,0)。',
        },

        // Step 5: fill
        {
          type:  'fill',
          lbl:   '填代码',
          title: '完成 DFS 迷宫框架',
          body:  `补全 DFS 函数的关键部分，使其能正确搜索迷宫路径。`,
          code:
`void dfs(int r, int c) {
    if (r<0||r>=N||c<0||c>=N) ___①___;
    if (grid[r][c]=='#'||visited[r][c]) ___②___;
    visited[r][c] = ___③___;
    if (r==er && c==ec) { found=true; return; }
    for (auto [dr,dc] : dirs) dfs(r+dr, c+dc);
}`,
          blanks: ['①', '②', '③'],
          answer: ['return', 'return', 'true'],
          opts: ['return', 'break', 'true', 'false', 'continue', '1'],
          explain: '①②越界和不可走时直接 return 返回；③标记当前格为已访问 true，防止重复进入。',
        },

      ],
    },

    // ─────────────────────────────────────────
    // 锐士关：理解陷阱 · 5步
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
          title:   '这段 DFS 代码有什么问题？',
          body:
`某同学写了如下 DFS 代码，想遍历下面的树（节点 1 为根，连接 2 和 3，2 连接 4）：

void dfs(int u) {
    for (int v : adj[u])
        dfs(v);           // 没有 visited 标记！
    cout << u << " ";
}

在无向图中，节点 1 连接节点 2，节点 2 也连接节点 1（双向边）。
调用 dfs(1)：进入 1 → 访问邻居 2 → 访问邻居 1（回头！）→ 访问邻居 2 → ... 无限循环。`,
          concept:
`问题根源：无向图中每条边都是双向的，没有 visited 标记会沿"已走路"反复横跳。

正确写法 1（树，父节点参数）：
void dfs(int u, int parent) {
    for (int v : adj[u])
        if (v != parent)   // 不回头走向父节点
            dfs(v, u);
}

正确写法 2（图，visited 数组）：
void dfs(int u) {
    visited[u] = true;
    for (int v : adj[u])
        if (!visited[v])
            dfs(v);
}

树用写法1即可；一般图必须用写法2，因为可能有多条路径通向同一节点。`,
          tip: '遍历树传父节点参数是简洁写法，但只能用于树；有环的图必须用 visited 数组。',
        },

        // Step 2: trace（树 DFS，前序遍历演示）
        {
          type:  'trace',
          lbl:   '看执行',
          title: '树的 DFS：前序遍历 1→2→4→3',
          body:  `看正确加了 visited 后，DFS 如何不重不漏地遍历树的所有节点。`,
          trace: {
            caption: '演示树（1-2-3，2-4）的 DFS 前序遍历，共 8 帧',
            mode: 'tree',
            intro: '点"下一帧"观察 DFS 如何沿树边深入，处理完子树后回溯。',
            code:
`void dfs(int u, int par) {
    cout << u;
    for (int v : adj[u])
        if (v != par)
            dfs(v, u);
}`,
            frames: [
              {
                id: 't0', label: '进入节点 1',
                note: '从根节点 1 出发，打印 1，准备遍历它的子节点 2 和 3。',
                code_line: 2,
                nodes: [
                  { id:'n1', label:'1', state:'active' },
                ],
                vars: { u:1, par:0 },
              },
              {
                id: 't1', label: '进入节点 2',
                note: '访问 1 的第一个邻居 2（不是父节点 0），打印 2，准备遍历 2 的子节点。',
                code_line: 2,
                nodes: [
                  { id:'n1', label:'1', state:'done' },
                  { id:'n2', label:'2', state:'active', parent:'n1' },
                ],
                vars: { u:2, par:1 },
              },
              {
                id: 't2', label: '进入节点 4',
                note: '访问 2 的邻居 4（跳过父节点 1），打印 4，4 无子节点。',
                code_line: 2,
                nodes: [
                  { id:'n1', label:'1', state:'done' },
                  { id:'n2', label:'2', state:'done' },
                  { id:'n4', label:'4', state:'active', parent:'n2' },
                ],
                vars: { u:4, par:2 },
              },
              {
                id: 't3', label: '4 遍历完成，回溯',
                note: '节点 4 没有未访问的子节点，dfs(4) 返回，回到节点 2。',
                code_line: 5,
                nodes: [
                  { id:'n1', label:'1', state:'done' },
                  { id:'n2', label:'2', state:'active' },
                  { id:'n4', label:'4', state:'done', parent:'n2' },
                ],
                vars: { u:2, 动作:'回溯自 4' },
              },
              {
                id: 't4', label: '2 遍历完成，回溯',
                note: '节点 2 的子树全部遍历完，dfs(2) 返回，回到节点 1。',
                code_line: 5,
                nodes: [
                  { id:'n1', label:'1', state:'active' },
                  { id:'n2', label:'2', state:'done', parent:'n1' },
                  { id:'n4', label:'4', state:'done', parent:'n2' },
                ],
                vars: { u:1, 动作:'回溯自 2' },
              },
              {
                id: 't5', label: '进入节点 3',
                note: '1 的另一个邻居 3 还未访问，进入节点 3，打印 3。',
                code_line: 2,
                nodes: [
                  { id:'n1', label:'1', state:'done' },
                  { id:'n2', label:'2', state:'done', parent:'n1' },
                  { id:'n4', label:'4', state:'done', parent:'n2' },
                  { id:'n3', label:'3', state:'active', parent:'n1' },
                ],
                vars: { u:3, par:1 },
              },
              {
                id: 't6', label: '3 遍历完成，回溯',
                note: '节点 3 无子节点，dfs(3) 返回，回到节点 1。',
                code_line: 5,
                nodes: [
                  { id:'n1', label:'1', state:'active' },
                  { id:'n2', label:'2', state:'done', parent:'n1' },
                  { id:'n4', label:'4', state:'done', parent:'n2' },
                  { id:'n3', label:'3', state:'done', parent:'n1' },
                ],
                vars: { u:1, 动作:'回溯自 3' },
              },
              {
                id: 't7', label: '遍历完成',
                note: '所有节点遍历完毕，输出顺序为 1 2 4 3，DFS 结束。',
                code_line: 5,
                nodes: [
                  { id:'n1', label:'1', state:'done' },
                  { id:'n2', label:'2', state:'done', parent:'n1' },
                  { id:'n4', label:'4', state:'done', parent:'n2' },
                  { id:'n3', label:'3', state:'done', parent:'n1' },
                ],
                vars: { 输出:'1 2 4 3', 状态:'完成' },
              },
            ],
          },
        },

        // Step 3: choice 1
        {
          type:  'choice',
          lbl:   '找错',
          title: '无向图 DFS 时，以下哪种做法会导致无限递归？',
          body:
`图有节点 1、2，双向边 1-2。选出会死循环的写法：`,
          opts: [
            '不标记 visited，直接对每个邻居递归调用 dfs',
            '进入节点前先检查 visited[u]，已访问就 return',
            '传入父节点参数 par，跳过 v==par 的邻居',
            '用 visited 数组且进入前设置 visited[u]=true',
          ],
          answer: 0,
          explain: '不标记 visited 的情况下，节点 1 会访问邻居 2，节点 2 又会访问邻居 1，如此反复直到栈溢出。其他三种都有防重复机制。',
        },

        // Step 4: choice 2
        {
          type:  'choice',
          lbl:   '对比',
          title: '树遍历传父节点参数 vs 图遍历用 visited 数组，哪句话描述正确？',
          body:  `对比两种防止重复访问的方法：`,
          opts: [
            '传父节点只适合树（无环），有环图必须用 visited 数组',
            '两种方法等价，在图和树上都能通用',
            '传父节点更快，应该优先用于所有情况',
            'visited 数组只适合无向图，有向图必须传父节点',
          ],
          answer: 0,
          explain: '树是无环的，任意两点间只有一条路，传父节点参数就能防止走回头路。但图可能有环，同一节点可从多条路径到达，必须用 visited 数组记录所有已访问节点。',
        },

        // Step 5: fill
        {
          type:  'fill',
          lbl:   '修正',
          title: '修正有问题的图 DFS',
          body:  `下面是有 bug 的无向图 DFS，补充 visited 标记使其正确工作：`,
          code:
`void dfs(int u) {
    visited[u] = ___①___;
    cout << u << " ";
    for (int v : adj[u])
        if (!___②___[v])
            dfs(___③___);
}`,
          blanks: ['①', '②', '③'],
          answer: ['true', 'visited', 'v'],
          opts: ['true', 'false', 'visited', 'path', 'v', 'u'],
          explain: '①进入节点立即标记 visited[u]=true；②判断邻居 v 是否未访问；③递归调用传入邻居 v。',
        },

      ],
    },

    // ─────────────────────────────────────────
    // 英雄关：换角度巩固 · 5步（树的前中后序三种遍历）
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
          title:   '同一 DFS 框架，三种遍历顺序',
          body:
`用同一棵树：根 1，左子节点 2，右子节点 3，2 的子节点 4。
三种遍历对应 DFS 打印节点的时机不同：
  前序（Pre）：进入节点时打印 → 1 2 4 3
  中序（In）：左子树完成后打印 → 4 2 1 3
  后序（Post）：左右子树都完成后打印 → 4 2 3 1

这不是三种不同算法，而是同一个 DFS 框架里"打印语句放哪行"的区别。`,
          concept:
`三种遍历的代码框架对比：
void dfs(int u, int par) {
    // ← 前序：在这里 cout << u
    for (int v : adj[u]) {
        if (v == par) continue;
        // 如果是二叉树，这里分左右子
        dfs(v, u);
        // ← 中序：左完成后在这里 cout（二叉树专用）
    }
    // ← 后序：在这里 cout << u
}

实际应用：
  前序：打印目录树结构
  中序（二叉搜索树）：得到有序序列
  后序：计算子树大小、统计子树信息（如树形DP）`,
          tip: '后序遍历是树形DP的基础：先处理完所有子节点，再用子节点的信息更新父节点。',
        },

        // Step 2: trace（后序遍历演示，为树形DP铺垫）
        {
          type:  'trace',
          lbl:   '看执行',
          title: '后序遍历：先完成子树，再处理自身',
          body:  `后序遍历是树形DP的核心操作顺序，看清楚"子节点先返回，父节点后处理"。`,
          trace: {
            caption: '演示树（1-2-3，2-4）的后序遍历，输出 4 2 3 1',
            mode: 'tree',
            intro: '注意：每个节点要等左右子树全部完成后才打印自己，这正是树形DP的执行顺序。',
            code:
`void dfs(int u, int par) {
    for (int v : adj[u])
        if (v != par)
            dfs(v, u);
    cout << u;  // 后序：子树完成后打印
}`,
            frames: [
              {
                id: 'p0', label: '进入节点 1',
                note: '进入根节点 1，不打印，先去遍历子树。',
                code_line: 1,
                nodes: [{ id:'n1', label:'1', state:'active' }],
                vars: { u:1, 状态:'等待子树' },
              },
              {
                id: 'p1', label: '进入节点 2',
                note: '进入节点 2，不打印，先去遍历 2 的子树。',
                code_line: 1,
                nodes: [
                  { id:'n1', label:'1', state:'waiting' },
                  { id:'n2', label:'2', state:'active', parent:'n1' },
                ],
                vars: { u:2, 状态:'等待子树' },
              },
              {
                id: 'p2', label: '进入节点 4',
                note: '进入叶子节点 4，无子节点，直接打印 4。',
                code_line: 5,
                nodes: [
                  { id:'n1', label:'1', state:'waiting' },
                  { id:'n2', label:'2', state:'waiting' },
                  { id:'n4', label:'4', state:'active', parent:'n2' },
                ],
                vars: { u:4, 输出:'4' },
              },
              {
                id: 'p3', label: '4 完成，打印 2',
                note: '节点 4 的子树（叶子）完成，回到 2，2 的所有子树完成，打印 2。',
                code_line: 5,
                nodes: [
                  { id:'n1', label:'1', state:'waiting' },
                  { id:'n2', label:'2', state:'active', parent:'n1' },
                  { id:'n4', label:'4', state:'done', parent:'n2' },
                ],
                vars: { u:2, 输出:'4 2' },
              },
              {
                id: 'p4', label: '进入节点 3',
                note: '回到根节点 1，继续访问另一个子节点 3，进入 3。',
                code_line: 1,
                nodes: [
                  { id:'n1', label:'1', state:'waiting' },
                  { id:'n2', label:'2', state:'done', parent:'n1' },
                  { id:'n4', label:'4', state:'done', parent:'n2' },
                  { id:'n3', label:'3', state:'active', parent:'n1' },
                ],
                vars: { u:3, 状态:'等待子树' },
              },
              {
                id: 'p5', label: '3 完成，打印 3',
                note: '节点 3 是叶子，无子节点，直接打印 3。',
                code_line: 5,
                nodes: [
                  { id:'n1', label:'1', state:'waiting' },
                  { id:'n2', label:'2', state:'done', parent:'n1' },
                  { id:'n4', label:'4', state:'done', parent:'n2' },
                  { id:'n3', label:'3', state:'active', parent:'n1' },
                ],
                vars: { u:3, 输出:'4 2 3' },
              },
              {
                id: 'p6', label: '全部子树完成，打印 1',
                note: '根节点 1 的所有子树（2 和 3）均已完成，最后打印 1。',
                code_line: 5,
                nodes: [
                  { id:'n1', label:'1', state:'active' },
                  { id:'n2', label:'2', state:'done', parent:'n1' },
                  { id:'n4', label:'4', state:'done', parent:'n2' },
                  { id:'n3', label:'3', state:'done', parent:'n1' },
                ],
                vars: { u:1, 输出:'4 2 3 1', 状态:'完成' },
              },
            ],
          },
        },

        // Step 3: choice 1
        {
          type:  'choice',
          lbl:   '判断',
          title: '树的后序遍历中，节点 u 的打印语句应该放在哪里？',
          body:  `下面哪个位置正确体现了后序遍历（先左右子树，再自身）？`,
          opts: [
            '遍历完所有子节点的循环之后',
            '进入节点 u 的第一行',
            '遍历左子节点之后、右子节点之前',
            '在每次调用 dfs(v,u) 之前',
          ],
          answer: 0,
          explain: '后序遍历的"后"意味着节点自身的处理（打印/更新）必须在其所有子节点的递归都返回之后才执行，因此打印语句放在循环之后。',
        },

        // Step 4: choice 2
        {
          type:  'choice',
          lbl:   '推广',
          title: '后序遍历最常用于以下哪种场景？',
          body:  `考虑"需要子节点信息才能更新父节点"的场景，后序遍历最适合哪种应用？`,
          opts: [
            '树形DP：先收集子树的状态，再用于计算父节点的最优值',
            '打印目录树结构：按层级从上到下输出',
            '二叉搜索树的有序输出：按从小到大排列',
            '层序遍历：按与根节点的距离分层输出',
          ],
          answer: 0,
          explain: '树形DP的核心是"自底向上"——先用 DFS 进入叶子节点，处理完子树后将子节点信息汇总给父节点，这正是后序遍历的执行顺序。',
        },

        // Step 5: fill
        {
          type:  'fill',
          lbl:   '改写',
          title: '将前序改为后序：统计子树大小',
          body:  `下面是前序 DFS，改写为后序以正确统计每个节点的子树大小 sz[u]。`,
          code:
`void dfs(int u, int par) {
    sz[u] = ___①___;
    for (int v : adj[u]) {
        if (v == par) continue;
        dfs(v, u);
        sz[u] ___②___ sz[v];
    }
}`,
          blanks: ['①', '②'],
          answer: ['1', '+= '],
          opts: ['1', '0', '+= ', '= ', '-= ', '*= '],
          explain: '①每个节点自身计 1；②遍历完子节点后，把子树大小 sz[v] 累加进 sz[u]，这是后序汇总子树信息的经典写法。',
        },

      ],
    },

  },
};

// [自检] trace frames 验证：
//   新兵 grid 11帧：(0,0)→(0,1)→碰墙→回溯→(1,0)→(2,0)→(2,1)→(2,2)→(3,2)→(3,3) 顺序与4×4迷宫真实DFS路径完全对应 ✓
//   锐士 tree 8帧：前序 1→2→4→回溯→回溯→3→回溯→完成，visited 防重复机制展示清晰 ✓
//   英雄 tree 7帧：后序 4→2→3→1，父节点等待子树完成再打印，正确体现后序语义 ✓
// [自检] choice 迷惑项覆盖类型：
//   新兵Q1(作用混淆/路径长度/访问次数/标记墙) 新兵Q2(正确/向右/死循环/直接到终点)
//   锐士Q1(正确/进入前检查/传父节点/visited) 锐士Q2(正确/等价/传父优先/有向图)
//   英雄Q1(正确/第一行/左右中间/调用前) 英雄Q2(正确/目录树/BST中序/层序)
// [自检] 三关 concept 差异化：✓
//   新兵：4×4迷宫具体走法 + DFS框架两个关键点
//   锐士：无向图无visited导致死循环的错误代码段 + 两种防重复写法对比
//   英雄：同一DFS框架三种遍历顺序 + 打印时机差异及实际应用
// [自检] fill opts 无序池确认：✓
//   新兵 opts=['return','break','true','false','continue','1']，覆盖3个空各正确+干扰
//   锐士 opts=['true','false','visited','path','v','u']，覆盖3个空各正确+干扰
//   英雄 opts=['1','0','+= ','= ','-= ','*= ']，覆盖2个空各正确+2个干扰
