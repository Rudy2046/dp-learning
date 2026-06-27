// data/s03_dfs_advanced.js
// 章节：S03.DFS下：图与连通性 · 连通块·岛屿·flood fill

export const LESSON = {
  id:    'dfs_advanced',
  title: 'S03.DFS下：图与连通性',
  sub:   '连通块·岛屿·flood fill',

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
          title:   '连通块计数：有多少个"岛屿"？',
          body:
`给一个 4×4 的网格地图，1 表示陆地，0 表示海洋：
  1 1 0 0
  1 0 0 1
  0 0 1 1
  0 1 0 0

上下左右相连的 1 构成一个"岛屿"（连通块）。
数一数共有几个岛屿？
  第1块：左上角 (0,0)(0,1)(1,0) 三格
  第2块：右侧   (1,3)(2,2)(2,3) 三格
  第3块：左下   (3,1) 一格
  答案：3 个岛屿。

做法：遍历所有格子，遇到未访问的 1 就启动一次 DFS，把整个连通块全部标记，计数 +1。`,
          concept:
`连通块计数框架：
int count = 0;
for (int r = 0; r < R; r++)
    for (int c = 0; c < C; c++)
        if (grid[r][c] == 1 && !visited[r][c]) {
            dfs(r, c);   // 把整个连通块标记完
            count++;     // 启动了一次 DFS = 一个连通块
        }

void dfs(int r, int c) {
    if (越界 || grid[r][c]==0 || visited[r][c]) return;
    visited[r][c] = true;
    for (四个方向) dfs(r+dr, c+dc);
}

关键思路：每次 DFS 会"染色"整个连通块，之后这块的所有格子都被标记，不会被重复计数。`,
          tip: '外层双重循环遍历每个格子，只对"未访问的陆地"启动 DFS，这样每个连通块恰好被发现一次。',
        },

        // Step 2: trace（graph mode，5节点图的连通块识别）
        {
          type:  'trace',
          lbl:   '看执行',
          title: 'DFS 识别连通块：逐个染色计数',
          body:  `看清楚 DFS 怎么把整个连通块一次性标记，然后继续找下一个连通块。`,
          trace: {
            caption: '演示 6 节点图的连通块识别，共发现 2 个连通块',
            mode: 'graph',
            intro: '点"下一帧"观察 DFS 如何一次性染完一整个连通块，再找下一个未访问节点。',
            graph: {
              nodes: [
                { id:'A', label:'A', x:0, y:0 },
                { id:'B', label:'B', x:1, y:0 },
                { id:'C', label:'C', x:0, y:1 },
                { id:'D', label:'D', x:3, y:0 },
                { id:'E', label:'E', x:3, y:1 },
                { id:'F', label:'F', x:4, y:0 },
              ],
              edges: [
                { from:'A', to:'B' },
                { from:'A', to:'C' },
                { from:'B', to:'C' },
                { from:'D', to:'E' },
                { from:'D', to:'F' },
              ],
            },
            code:
`for (each node u not visited):
    dfs(u); count++;

void dfs(int u) {
    visited[u] = true;
    for (v in adj[u])
        if (!visited[v]) dfs(v);
}`,
            frames: [
              {
                id: 'g0', label: '找到未访问节点 A',
                note: '外层循环找到第一个未访问节点 A，启动 DFS，计数 +1。',
                code_line: 1,
                node_states: { A:'active', B:'unvisited', C:'unvisited', D:'unvisited', E:'unvisited', F:'unvisited' },
                vars: { 当前:'A', 连通块数:1 },
              },
              {
                id: 'g1', label: 'DFS 进入 B',
                note: 'A 的邻居 B 未访问，DFS 进入 B，标记为已访问。',
                code_line: 5,
                node_states: { A:'visited', B:'active', C:'unvisited', D:'unvisited', E:'unvisited', F:'unvisited' },
                edge_states: { 'A->B':'used' },
                vars: { 当前:'B', 连通块数:1 },
              },
              {
                id: 'g2', label: 'DFS 进入 C',
                note: 'B 的邻居 C 未访问，DFS 进入 C，标记为已访问。',
                code_line: 5,
                node_states: { A:'visited', B:'visited', C:'active', D:'unvisited', E:'unvisited', F:'unvisited' },
                edge_states: { 'A->B':'used', 'B->C':'used' },
                vars: { 当前:'C', 连通块数:1 },
              },
              {
                id: 'g3', label: 'C 回溯，第1块完成',
                note: 'C 的邻居 A 和 B 都已访问，DFS 全部返回，连通块 {A,B,C} 标记完毕。',
                code_line: 7,
                node_states: { A:'visited', B:'visited', C:'visited', D:'unvisited', E:'unvisited', F:'unvisited' },
                edge_states: { 'A->B':'used', 'A->C':'used', 'B->C':'used' },
                vars: { 连通块1:'{A,B,C}', 连通块数:1 },
              },
              {
                id: 'g4', label: '找到未访问节点 D',
                note: '外层循环继续，找到第一个未访问节点 D，启动新 DFS，计数 +1。',
                code_line: 1,
                node_states: { A:'visited', B:'visited', C:'visited', D:'active', E:'unvisited', F:'unvisited' },
                vars: { 当前:'D', 连通块数:2 },
              },
              {
                id: 'g5', label: 'DFS 进入 E',
                note: 'D 的邻居 E 未访问，DFS 进入 E，标记为已访问。',
                code_line: 5,
                node_states: { A:'visited', B:'visited', C:'visited', D:'visited', E:'active', F:'unvisited' },
                edge_states: { 'A->B':'used', 'A->C':'used', 'B->C':'used', 'D->E':'used' },
                vars: { 当前:'E', 连通块数:2 },
              },
              {
                id: 'g6', label: 'DFS 进入 F',
                note: 'D 的另一邻居 F 未访问，DFS 进入 F，标记为已访问。',
                code_line: 5,
                node_states: { A:'visited', B:'visited', C:'visited', D:'visited', E:'visited', F:'active' },
                edge_states: { 'A->B':'used', 'A->C':'used', 'B->C':'used', 'D->E':'used', 'D->F':'used' },
                vars: { 当前:'F', 连通块数:2 },
              },
              {
                id: 'g7', label: '第2块完成，计数结束',
                note: 'F、E 无新邻居，DFS 全部返回，连通块 {D,E,F} 完成，最终共 2 个连通块。',
                code_line: 2,
                node_states: { A:'visited', B:'visited', C:'visited', D:'visited', E:'visited', F:'visited' },
                vars: { 连通块1:'{A,B,C}', 连通块2:'{D,E,F}', 总计:2 },
              },
            ],
          },
        },

        // Step 3: choice 1
        {
          type:  'choice',
          lbl:   '判断',
          title: '连通块计数时，每次启动 DFS 后为什么计数只加 1？',
          body:
`for (所有未访问节点 u):
    dfs(u);
    count++;    ← 为什么这里只加 1？`,
          opts: [
            '一次 DFS 会把整个连通块全部标记，后续循环不会再对这块的节点启动新 DFS',
            '因为 DFS 每次只访问一个节点，所以对应一个连通块',
            '计数应该在 DFS 内部根据节点数累加，外部加 1 是错误的',
            '只有第一个节点是连通块的代表，其他节点不算',
          ],
          answer: 0,
          explain: '一次 DFS 会递归到整个连通块的所有节点并标记 visited，所以这块内的其他节点在后续循环中不会满足"未访问"条件，不会再次启动 DFS，外层每启动一次 DFS 恰好对应一个完整连通块。',
        },

        // Step 4: choice 2
        {
          type:  'choice',
          lbl:   '推导',
          title: '下面的网格有几个连通块（四连通，上下左右）？',
          body:
`1 0 1 1
0 0 1 0
1 1 0 0
0 1 0 1`,
          opts: [
            '4',
            '3',
            '5',
            '2',
          ],
          answer: 0,
          explain: '连通块1：(0,0)单独；连通块2：(0,2)(0,3)(1,2) 三格；连通块3：(2,0)(2,1)(3,1) 三格；连通块4：(3,3) 单独。共 4 个。',
        },

        // Step 5: fill
        {
          type:  'fill',
          lbl:   '填代码',
          title: '完成岛屿计数的外层循环',
          body:  `补全连通块计数代码的关键部分：`,
          code:
`int count = 0;
for (int r=0; r<R; r++)
  for (int c=0; c<C; c++)
    if (grid[r][c]==___①___ && !visited[r][c]) {
        dfs(___②___, c);
        ___③___++;
    }`,
          blanks: ['①', '②', '③'],
          answer: ['1', 'r', 'count'],
          opts: ['1', '0', 'r', 'c', 'count', 'grid[r][c]'],
          explain: '①判断是陆地（值为 1）；②启动 DFS 传入当前行 r；③每启动一次 DFS 就发现一个新连通块，count 加一。',
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
          title:   '四连通 vs 八连通：不同的连通性定义',
          body:
`同一个网格，不同的连通性定义结果可能完全不同：
  1 0 1
  0 1 0
  1 0 1

四连通（只算上下左右）：
  中间的 1 与四角的 1 都不相邻，共 5 个连通块（每个 1 自成一块）。

八连通（上下左右+斜角共8方向）：
  中间的 1 通过斜角与四角全部相连，共 1 个连通块。

某同学忘记看题，把四连通的迷宫用八连通代码写了，导致答案偏少。`,
          concept:
`四连通的 dirs：
int dr[] = {-1,1,0,0};
int dc[] = {0,0,-1,1};   // 只有4个方向

八连通的 dirs（在四方向基础上加4个斜角）：
int dr[] = {-1,-1,-1,0,0,1,1,1};
int dc[] = {-1,0,1,-1,1,-1,0,1};  // 8个方向

常见规律：
  迷宫/最短路问题 → 四连通（只能直走）
  图像处理/flood fill → 看题目要求（洪水漫灌通常四连通）
  棋盘斜线移动（如国王）→ 八连通`,
          tip: '读题时先确认连通性定义，再决定 dirs 数组写几个方向，这是最容易漏看的条件。',
        },

        // Step 2: trace（graph，八连通 vs 四连通对比）
        {
          type:  'trace',
          lbl:   '看执行',
          title: '四连通 vs 八连通：同一图不同结果',
          body:  `看同一个网格在不同连通性定义下，DFS 的染色范围有多大差异。`,
          trace: {
            caption: '演示 3×3 对角网格，四连通得 5 个连通块，八连通得 1 个',
            mode: 'graph',
            intro: '注意观察：只改变方向数组，DFS 能染到的节点范围就完全不同。',
            graph: {
              nodes: [
                { id:'A', label:'(0,0)', x:0, y:0 },
                { id:'B', label:'(1,1)', x:1, y:1 },
                { id:'C', label:'(0,2)', x:2, y:0 },
                { id:'D', label:'(2,0)', x:0, y:2 },
                { id:'E', label:'(2,2)', x:2, y:2 },
              ],
              edges: [
                { from:'A', to:'B' },
                { from:'B', to:'C' },
                { from:'B', to:'D' },
                { from:'B', to:'E' },
              ],
            },
            code:
`// 四连通：4方向
// 八连通：8方向（含斜角）
void dfs(int r, int c) {
    visited[r][c] = true;
    for (auto [dr,dc] : dirs)
        if (valid && !visited[r+dr][c+dc])
            dfs(r+dr,c+dc);
}`,
            frames: [
              {
                id: 'h0', label: '四连通：从 (0,0) 出发',
                note: '四连通只走上下左右，(0,0) 的四邻格都是 0，无法扩展，自成一块。',
                code_line: 4,
                node_states: { A:'active', B:'unvisited', C:'unvisited', D:'unvisited', E:'unvisited' },
                vars: { 模式:'四连通', 当前块:'仅(0,0)' },
              },
              {
                id: 'h1', label: '四连通：5 个连通块',
                note: '四连通下五个节点两两不相邻（均被 0 隔开），各自独立，共 5 个连通块。',
                code_line: 1,
                node_states: { A:'visited', B:'visited', C:'visited', D:'visited', E:'visited' },
                vars: { 模式:'四连通', 连通块数:5 },
              },
              {
                id: 'h2', label: '八连通：从 (0,0) 出发',
                note: '八连通包含斜角，(0,0) 与 (1,1) 斜角相邻，DFS 从 (0,0) 进入 (1,1)。',
                code_line: 5,
                node_states: { A:'visited', B:'active', C:'unvisited', D:'unvisited', E:'unvisited' },
                edge_states: { 'A->B':'used' },
                vars: { 模式:'八连通', 当前:'(1,1)' },
              },
              {
                id: 'h3', label: '八连通：从 (1,1) 扩展到全图',
                note: '(1,1) 通过斜角与 (0,2)(2,0)(2,2) 都相邻，DFS 一次性染色全部节点，共 1 个连通块。',
                code_line: 7,
                node_states: { A:'visited', B:'visited', C:'visited', D:'visited', E:'visited' },
                edge_states: { 'A->B':'used', 'B->C':'used', 'B->D':'used', 'B->E':'used' },
                vars: { 模式:'八连通', 连通块数:1 },
              },
            ],
          },
        },

        // Step 3: choice 1
        {
          type:  'choice',
          lbl:   '找错',
          title: '以下哪个场景必须用八连通而不是四连通？',
          body:  `选出需要八连通（含斜角）的场景：`,
          opts: [
            '判断棋盘上国王能否从某格走到另一格（国王可走斜方向）',
            '迷宫中只能上下左右移动的最短路问题',
            '统计只连接上下左右的相同颜色区域数',
            '洪水漫灌：水只能沿上下左右扩散',
          ],
          answer: 0,
          explain: '国王在棋盘上可以斜向移动，判断国王的可达范围必须用八连通（8个方向）。其余三项均为只允许上下左右移动的场景，应用四连通。',
        },

        // Step 4: choice 2
        {
          type:  'choice',
          lbl:   '对比',
          title: '下面对四连通和八连通计数结果的描述，哪个正确？',
          body:
`对同一个网格的陆地连通块，分别用四连通和八连通计数，结果关系是：`,
          opts: [
            '八连通的连通块数 ≤ 四连通的连通块数（八连通更容易连成一块）',
            '四连通的连通块数 ≤ 八连通的连通块数',
            '两者结果一定相同',
            '无法确定大小关系，两者完全独立',
          ],
          answer: 0,
          explain: '八连通比四连通多四个斜角方向，更容易把原本四连通下分开的块合并。因此八连通找到的连通块数 ≤ 四连通找到的连通块数，从不会更多。',
        },

        // Step 5: fill
        {
          type:  'fill',
          lbl:   '修正',
          title: '将四连通改为八连通',
          body:  `在现有四连通代码基础上补充斜角方向，实现八连通：`,
          code:
`int dr[] = {-1,1,0,0, -1,-1,___①___,___②___};
int dc[] = {0,0,-1,1,  -1,___③___,-1,1};
// 前4个方向是四连通，后4个是斜角`,
          blanks: ['①', '②', '③'],
          answer: ['1', '1', '1'],
          opts: ['1', '-1', '0', '2'],
          explain: '斜角四个方向为 (-1,-1)(-1,1)(1,-1)(1,1)。前两个斜角(-1,-1)和(-1,1)已给出；第三个斜角 dr=1,dc=-1；第四个 dr=1,dc=1，所以三个空均填 1。',
        },

      ],
    },

    // ─────────────────────────────────────────
    // 英雄关：换角度巩固 · 5步（flood fill 染色变形）
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
          title:   'Flood Fill：把"岛屿"染成指定颜色',
          body:
`Flood Fill（洪水漫灌）是连通块 DFS 的一个直接变形：
不只是"计数"，而是把从某点出发能到达的所有同色区域全部改成新颜色。

例：把下面网格里与 (0,0) 相连的所有 1 改成 2：
  初始：           结果：
  1 1 0 1          2 2 0 1
  1 0 0 0    →     2 0 0 0
  0 0 1 1          0 0 1 1

应用场景：
  PS 的魔术橡皮擦（点一下消除同色区域）
  扫雷游戏（点开空格自动扩散）
  围棋气数判断`,
          concept:
`Flood Fill 框架与连通块 DFS 几乎相同，多一步"修改值"：
void fill(int r, int c, int oldVal, int newVal) {
    if (越界 || grid[r][c] != oldVal) return;  // 不是目标颜色就停
    grid[r][c] = newVal;                          // 直接改值，代替 visited
    for (四个方向) fill(r+dr, c+dc, oldVal, newVal);
}

两个注意点：
1. 用"改值"代替 visited 数组：改成 newVal 后，后续递归遇到 != oldVal 自然不会再进入。
2. oldVal 不能等于 newVal，否则会无限递归（改了又满足条件，反复进入）。`,
          tip: '调用前先检查 oldVal != newVal，否则程序会死循环。这是 Flood Fill 最常见的 bug。',
        },

        // Step 2: trace（graph，flood fill 染色过程）
        {
          type:  'trace',
          lbl:   '看执行',
          title: 'Flood Fill：从 (0,0) 把同色区域改为新值',
          body:  `看 Flood Fill 如何用"改值"代替 visited 数组，自然地限制扩散范围。`,
          trace: {
            caption: '演示 Flood Fill 将 (0,0) 起始的同色连通块从 1 全部改为 2',
            mode: 'graph',
            intro: '注意：DFS 进入一格就立即修改值，之后再遇到这格时 grid != oldVal 自动跳过，不需要 visited 数组。',
            graph: {
              nodes: [
                { id:'A', label:'(0,0)=1', x:0, y:0 },
                { id:'B', label:'(0,1)=1', x:1, y:0 },
                { id:'C', label:'(1,0)=1', x:0, y:1 },
                { id:'D', label:'(0,2)=0', x:2, y:0 },
                { id:'E', label:'(1,1)=0', x:1, y:1 },
              ],
              edges: [
                { from:'A', to:'B' },
                { from:'A', to:'C' },
              ],
            },
            code:
`void fill(int r, int c, int old, int nw) {
    if (out || grid[r][c] != old) return;
    grid[r][c] = nw;
    for (dirs) fill(r+dr, c+dc, old, nw);
}`,
            frames: [
              {
                id: 'f0', label: '进入 (0,0)',
                note: '(0,0) 的值是 1 == oldVal，满足条件，立即改为 2。',
                code_line: 3,
                node_states: { A:'active', B:'unvisited', C:'unvisited', D:'unvisited', E:'unvisited' },
                vars: { '(0,0)':'1→2', oldVal:1, newVal:2 },
              },
              {
                id: 'f1', label: '进入 (0,1)',
                note: '向右 (0,1) 值为 1 == oldVal，改为 2，继续扩散。',
                code_line: 3,
                node_states: { A:'visited', B:'active', C:'unvisited', D:'unvisited', E:'unvisited' },
                edge_states: { 'A->B':'used' },
                vars: { '(0,0)':'2', '(0,1)':'1→2' },
              },
              {
                id: 'f2', label: '(0,2) 是 0，停止',
                note: '(0,1) 向右是 (0,2)，值为 0 != oldVal(1)，return，不扩散。',
                code_line: 2,
                node_states: { A:'visited', B:'visited', C:'unvisited', D:'pruned', E:'unvisited' },
                vars: { '(0,2)':'0 != 1，跳过' },
              },
              {
                id: 'f3', label: '进入 (1,0)',
                note: '回到 (0,0)，向下到 (1,0) 值为 1 == oldVal，改为 2。',
                code_line: 3,
                node_states: { A:'visited', B:'visited', C:'active', D:'pruned', E:'unvisited' },
                edge_states: { 'A->B':'used', 'A->C':'used' },
                vars: { '(1,0)':'1→2' },
              },
              {
                id: 'f4', label: '(1,1) 是 0，停止',
                note: '(1,0) 向右是 (1,1)，值为 0 != oldVal，return，扩散结束。',
                code_line: 2,
                node_states: { A:'visited', B:'visited', C:'visited', D:'pruned', E:'pruned' },
                vars: { 完成:'所有值为 1 的连通格已改为 2' },
              },
              {
                id: 'f5', label: 'Flood Fill 完成',
                note: '(0,0)(0,1)(1,0) 三格全部改为 2，其他 0 的格子自然阻断，填色完成。',
                code_line: 4,
                node_states: { A:'visited', B:'visited', C:'visited', D:'pruned', E:'pruned' },
                vars: { 结果:'(0,0)(0,1)(1,0) 均改为 2' },
              },
            ],
          },
        },

        // Step 3: choice 1
        {
          type:  'choice',
          lbl:   '判断',
          title: 'Flood Fill 中，为什么可以用"改值"代替 visited 数组？',
          body:  `fill(r, c, oldVal, newVal) 中，进入一格就把它从 oldVal 改成 newVal，这样做为什么能防止重复访问？`,
          opts: [
            '改过值后再次进入该格时，grid[r][c] != oldVal，终止条件直接拦截，不会递归',
            '因为 grid 数组本身可以充当 visited 数组，两者等价',
            '改值会让格子消失，所以不会被再次访问',
            '只要方向是单向的就不会重复，与改值无关',
          ],
          answer: 0,
          explain: '进入格子后立即将值改为 newVal，当同一格子再次被邻格递归进入时，检查 grid[r][c] != oldVal，条件不满足直接 return，自然跳过，无需额外的 visited 数组。',
        },

        // Step 4: choice 2
        {
          type:  'choice',
          lbl:   '推广',
          title: 'Flood Fill 调用时，oldVal == newVal 会发生什么？',
          body:
`如果这样调用：fill(0, 0, 1, 1)（把 1 改成 1，颜色不变），会发生什么？`,
          opts: [
            '无限递归，因为改值后条件 grid[r][c] != oldVal 永远不满足，终止条件失效',
            '程序正常结束，因为值没变，等同于没做操作',
            '只访问起点然后停止，因为邻格也是 1 所以不会扩散',
            '程序报错，编译器会检测到这个问题',
          ],
          answer: 0,
          explain: '当 oldVal==newVal 时，进入格子后把值从 1 改成 1（没变），下次再进入该格子时依然满足 grid[r][c]==oldVal，终止条件失效，导致无限递归直到栈溢出。',
        },

        // Step 5: fill
        {
          type:  'fill',
          lbl:   '改写',
          title: '完成 Flood Fill 函数',
          body:  `补全 Flood Fill 的核心逻辑：`,
          code:
`void fill(int r, int c, int oldV, int newV) {
    if (r<0||r>=R||c<0||c>=C) return;
    if (grid[r][c] != ___①___) return;
    grid[r][c] = ___②___;
    for (auto [dr,dc] : dirs)
        fill(r+dr, c+dc, ___③___, newV);
}`,
          blanks: ['①', '②', '③'],
          answer: ['oldV', 'newV', 'oldV'],
          opts: ['oldV', 'newV', '0', '1'],
          explain: '①判断当前格是目标颜色 oldV 才继续；②立即改成新颜色 newV（既是改色也防重复）；③递归时继续传入 oldV，保证只扩散相同颜色的连通区域。',
        },

      ],
    },

  },
};

// [自检] trace frames 验证：
//   新兵 graph 8帧：A→B→C(一块)→D→E→F(第二块) 连通块识别顺序与外层循环真实扫描对应 ✓
//   锐士 graph 4帧：四连通5块→八连通1块，通过对角连接 (1,1) 扩展到全图，演示正确 ✓
//   英雄 graph 6帧：fill(0,0,1,2) 染色 A→B(0被拦)→C(0被拦)完成，改值即防重逻辑清晰 ✓
// [自检] choice 迷惑项覆盖类型：
//   新兵Q1(正确/路径长度/访问次数/每次一个) 新兵Q2(正确4/3/5/2)
//   锐士Q1(正确国王/迷宫/同色/洪水) 锐士Q2(正确八≤四/四≤八/相同/无法确定)
//   英雄Q1(正确/等价/格子消失/方向单向) 英雄Q2(正确死循环/正常/只起点/报错)
// [自检] 三关 concept 差异化：✓
//   新兵：4×4岛屿具体数数 + 外层双循环+DFS染色框架
//   锐士：给出对角全1网格四vs八连通不同结果的具体例子 + dirs数组差异说明
//   英雄：Flood Fill变形（改值代替计数）+ 两个注意点（代替visited/oldVal!=newVal）
// [自检] fill opts 无序池确认：✓
//   新兵 opts=['1','0','r','c','count','grid[r][c]']，6项覆盖3空
//   锐士 opts=['1','-1','0','2']，4项覆盖3空（含重复1）
//   英雄 opts=['oldV','newV','0','1']，4项覆盖3空
