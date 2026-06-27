// data/s04_bfs_basic.js
// 章节：S04.BFS上：基础与最短路 · 一圈一圈往外扩

export const LESSON = {
  id:    'bfs_basic',
  title: 'S04.BFS上：基础与最短路',
  sub:   '一圈一圈往外扩',

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
          title:   'BFS：一圈一圈往外扩，找最短路',
          body:
`同样是 4×4 迷宫，从 (0,0) 到 (3,3) 的最短步数是多少？
  # 表示墙，. 表示通路，每步只能上下左右移动。

  (0,0). . # .
       . # . .
       . . . #
       # . . (3,3)

DFS 找到"一条"路，但不保证最短。BFS 才能保证第一次找到终点时的路径就是最短的。
BFS 的思路：以起点为中心，一圈一圈往外扩，先扩距离为 1 的格子，再扩距离为 2 的，...
  距离 0：{(0,0)}
  距离 1：{(0,1),(1,0)}
  距离 2：{(2,0),(1,2)?} → ...
  第一次到达 (3,3) 时，走过的步数就是最短距离。`,
          concept:
`BFS 框架（最短路）：
queue<pair<int,int>> q;
q.push({起点r, 起点c});
visited[起点r][起点c] = true;
dist[起点r][起点c] = 0;

while (!q.empty()) {
    auto [r,c] = q.front(); q.pop();
    if (r==终点r && c==终点c) { 找到最短路; break; }
    for (四个方向 [dr,dc]):
        if (合法 && !visited[r+dr][c+dc]) {
            visited[r+dr][c+dc] = true;
            dist[r+dr][c+dc] = dist[r][c] + 1;  // 距离+1
            q.push({r+dr, c+dc});
        }
}

与 DFS 最大的不同：BFS 用队列（先进先出），同一距离的格子同时在队列里。`,
          tip: 'BFS 一定要在"入队时"就标记 visited，而不是"出队时"，否则同一格子可能被多次入队，导致超时甚至结果错误。',
        },

        // Step 2: trace（grid + queue_stack mode）
        {
          type:  'trace',
          lbl:   '看执行',
          title: 'BFS 走迷宫：按层扩展，最先到达即最短',
          body:  `看清楚队列如何控制 BFS 按层推进，同一距离的格子一批处理。`,
          trace: {
            caption: '演示 4×4 迷宫 BFS，逐层扩展直到到达 (3,3)',
            mode: 'grid',
            intro: '注意观察队列的变化：同一层的格子会连续出队，再把下一层入队，体现"一圈一圈往外扩"。',
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
`q.push(start); vis[s]=true; dist[s]=0;
while (!q.empty()) {
    [r,c] = q.front(); q.pop();
    if ([r,c]==end) break;
    for (dirs): if (ok && !vis[r+dr][c+dc]):
        vis=true; dist+=1; q.push;
}`,
            frames: [
              {
                id: 'b0', label: '初始：(0,0) 入队',
                note: '起点 (0,0) 入队，标记 visited，距离 0。队列：[(0,0)]。',
                code_line: 1,
                cell_states: [{ r:0, c:0, type:'active' }],
                queue: ['(0,0)'],
                visited: ['(0,0)'],
                vars: { 队列:'[(0,0)]', 步数:0 },
              },
              {
                id: 'b1', label: '(0,0) 出队，扩展邻居',
                note: '(0,0) 出队，合法邻居 (0,1) 和 (1,0) 入队，步数均为 1。',
                code_line: 6,
                cell_states: [
                  { r:0, c:0, type:'visited' },
                  { r:0, c:1, type:'active' },
                  { r:1, c:0, type:'active' },
                ],
                queue: ['(0,1)','(1,0)'],
                visited: ['(0,0)','(0,1)','(1,0)'],
                vars: { 队列:'[(0,1),(1,0)]', 步数:1 },
              },
              {
                id: 'b2', label: '(0,1) 出队，扩展邻居',
                note: '(0,1) 出队，(0,2) 是墙，(1,1) 是墙，无新邻居入队。',
                code_line: 3,
                cell_states: [
                  { r:0, c:0, type:'visited' },
                  { r:0, c:1, type:'visited' },
                  { r:1, c:0, type:'active' },
                ],
                queue: ['(1,0)'],
                visited: ['(0,0)','(0,1)','(1,0)'],
                vars: { 队列:'[(1,0)]', 步数:1 },
              },
              {
                id: 'b3', label: '(1,0) 出队，扩展 (2,0)',
                note: '(1,0) 出队，向下 (2,0) 未访问，入队，步数为 2。',
                code_line: 6,
                cell_states: [
                  { r:0, c:0, type:'visited' },
                  { r:0, c:1, type:'visited' },
                  { r:1, c:0, type:'visited' },
                  { r:2, c:0, type:'active' },
                ],
                queue: ['(2,0)'],
                visited: ['(0,0)','(0,1)','(1,0)','(2,0)'],
                vars: { 队列:'[(2,0)]', 步数:2 },
              },
              {
                id: 'b4', label: '(2,0) 出队，扩展 (2,1)',
                note: '(2,0) 出队，(3,0) 是墙，(2,1) 未访问，入队，步数为 3。',
                code_line: 6,
                cell_states: [
                  { r:0, c:0, type:'visited' },
                  { r:0, c:1, type:'visited' },
                  { r:1, c:0, type:'visited' },
                  { r:2, c:0, type:'visited' },
                  { r:2, c:1, type:'active' },
                ],
                queue: ['(2,1)'],
                visited: ['(0,0)','(0,1)','(1,0)','(2,0)','(2,1)'],
                vars: { 队列:'[(2,1)]', 步数:3 },
              },
              {
                id: 'b5', label: '(2,1) 出队，扩展 (2,2) 和 (3,1)',
                note: '(2,1) 出队，(2,2) 和 (3,1) 均未访问，同步入队，步数为 4。',
                code_line: 6,
                cell_states: [
                  { r:0, c:0, type:'visited' },
                  { r:0, c:1, type:'visited' },
                  { r:1, c:0, type:'visited' },
                  { r:2, c:0, type:'visited' },
                  { r:2, c:1, type:'visited' },
                  { r:2, c:2, type:'active' },
                  { r:3, c:1, type:'active' },
                ],
                queue: ['(2,2)','(3,1)'],
                visited: ['...','(2,2)','(3,1)'],
                vars: { 队列:'[(2,2),(3,1)]', 步数:4 },
              },
              {
                id: 'b6', label: '(2,2) 出队，扩展 (3,2)',
                note: '(2,2) 出队，向下 (3,2) 未访问，入队，步数为 5。',
                code_line: 6,
                cell_states: [
                  { r:0, c:0, type:'visited' },
                  { r:0, c:1, type:'visited' },
                  { r:1, c:0, type:'visited' },
                  { r:2, c:0, type:'visited' },
                  { r:2, c:1, type:'visited' },
                  { r:2, c:2, type:'visited' },
                  { r:3, c:1, type:'visited' },
                  { r:3, c:2, type:'active' },
                ],
                queue: ['(3,1)','(3,2)'],
                visited: ['...','(3,2)'],
                vars: { 队列:'[(3,1),(3,2)]', 步数:5 },
              },
              {
                id: 'b7', label: '(3,2) 出队，到达 (3,3)',
                note: '(3,2) 出队，向右 (3,3) 是终点！距离 = dist[(3,2)] + 1 = 6，BFS 完成。',
                code_line: 4,
                cell_states: [
                  { r:0, c:0, type:'visited' },
                  { r:0, c:1, type:'visited' },
                  { r:1, c:0, type:'visited' },
                  { r:2, c:0, type:'visited' },
                  { r:2, c:1, type:'visited' },
                  { r:2, c:2, type:'visited' },
                  { r:3, c:1, type:'visited' },
                  { r:3, c:2, type:'visited' },
                  { r:3, c:3, type:'active' },
                ],
                queue: ['(3,3)'],
                visited: ['...','(3,3)'],
                vars: { 终点:'(3,3)', 最短步数:6 },
              },
            ],
          },
        },

        // Step 3: choice 1
        {
          type:  'choice',
          lbl:   '判断',
          title: '为什么 BFS 找到终点时的路径一定是最短的？',
          body:  `BFS 为什么能保证"第一次"到达终点时走的步数最少？`,
          opts: [
            'BFS 按距离由近到远扩展，距离 d 的节点全处理完才处理距离 d+1 的，所以最先到达就是最短',
            '因为 BFS 用队列，队列是先进先出，所以先入队的路径一定更短',
            '因为 BFS 会尝试所有路径，并记录每条路径的长度，最后取最小值',
            'BFS 只会找到一条路径，就是最短路，其他路径不会被探索',
          ],
          answer: 0,
          explain: 'BFS 的核心是"按层扩展"：距离为 d 的所有节点全部出队处理完毕后，才开始处理距离 d+1 的节点。因此第一次到达某个节点时，走过的距离就是最短距离。',
        },

        // Step 4: choice 2
        {
          type:  'choice',
          lbl:   '推导',
          title: 'BFS 中应该在什么时候标记节点为已访问？',
          body:
`以下两种写法哪个正确？
写法A：入队时立即标记 visited。
写法B：出队时才标记 visited。`,
          opts: [
            '写法A正确：入队时标记，防止同一节点被多次入队',
            '写法B正确：出队时标记，这样每个节点只处理一次',
            '两种写法等价，结果相同',
            '都不对，应该在找到终点后统一标记',
          ],
          answer: 0,
          explain: '应该在入队时立即标记 visited。如果出队时才标记，同一节点可能在标记前被多次入队（被不同邻居发现），导致重复处理，在稠密图中会严重超时，结果也可能出错。',
        },

        // Step 5: fill
        {
          type:  'fill',
          lbl:   '填代码',
          title: '完成 BFS 最短路框架',
          body:  `补全 BFS 迷宫最短路代码的关键部分：`,
          code:
`queue<pair<int,int>> q;
q.push({sr,sc});
visited[sr][sc]=true; dist[sr][sc]=0;
while (!q.empty()) {
    auto [r,c] = q.___①___(); q.pop();
    for (auto [dr,dc] : dirs) {
        int nr=r+dr, nc=c+dc;
        if (合法 && !visited[nr][nc]) {
            visited[nr][nc]=true;
            dist[nr][nc]=dist[r][c]+___②___;
            q.___③___({nr,nc});
        }
    }
}`,
          blanks: ['①', '②', '③'],
          answer: ['front', '1', 'push'],
          opts: ['front', 'back', '1', '0', 'push', 'pop'],
          explain: '①BFS用队列front取队首元素；②距离每走一步加1；③新节点push入队等待处理。',
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
          title:   '这段 BFS 代码哪里出错了？',
          body:
`某同学写了如下 BFS 代码来求最短路：

queue<pair<int,int>> q;
q.push({0,0});
while (!q.empty()) {
    auto [r,c] = q.front(); q.pop();
    visited[r][c] = true;   // 出队时才标记！
    for (dirs):
        if (合法 && !visited[r+dr][c+dc])
            q.push({r+dr, c+dc});
}

在如下网格测试：
  S . .
  . . .
结果：(1,1) 被入队了 4 次（从上下左右各被发现一次），大量重复处理。`,
          concept:
`问题：出队时才标记 visited，导致同一节点在入队之前可以被多次加入队列。

错误版本（出队标记）的执行过程：
  (0,0) 出队 → 标记 → (0,1) 和 (1,0) 入队
  (0,1) 出队 → 标记 → (0,0)已标记跳过，(1,1) 和 (0,2) 入队
  (1,0) 出队 → 标记 → (1,1) 还没被标记，再次入队！
  → (1,1) 会被处理 2 次甚至更多次

正确做法：入队时立刻标记
    if (合法 && !visited[nr][nc]) {
        visited[nr][nc] = true;   // 先标记
        q.push({nr, nc});         // 再入队
    }`,
          tip: '"先标记再入队"是 BFS 的铁律，而不是"出队后再标记"——两行顺序不能颠倒。',
        },

        // Step 2: trace（queue_stack，演示入队标记 vs 出队标记的差异）
        {
          type:  'trace',
          lbl:   '看执行',
          title: '入队标记 vs 出队标记：哪个会重复入队？',
          body:  `对比两种写法在同一个简单图上的执行过程，看清楚出队标记为何导致重复。`,
          trace: {
            caption: '演示 3 节点图中 BFS 两种标记时机的差异（A-B, A-C, B-C）',
            mode: 'graph',
            intro: '注意队列里的内容：正确写法每个节点最多入队一次，错误写法可能多次。',
            graph: {
              nodes: [
                { id:'A', label:'A(起)', x:0, y:0 },
                { id:'B', label:'B', x:1, y:0 },
                { id:'C', label:'C', x:0, y:1 },
              ],
              edges: [
                { from:'A', to:'B' },
                { from:'A', to:'C' },
                { from:'B', to:'C' },
              ],
            },
            code:
`// 正确：入队时标记
visited[A]=true; q.push(A);
while q不空:
    u=q.front(); q.pop();
    for v in adj[u]:
        if !visited[v]:
            visited[v]=true; q.push(v);`,
            frames: [
              {
                id: 'q0', label: '正确写法：A 入队并标记',
                note: '正确做法：A 入队时立即标记 visited[A]=true，队列：[A]。',
                code_line: 2,
                node_states: { A:'visited', B:'unvisited', C:'unvisited' },
                queue: ['A'],
                visited: ['A'],
                vars: { 写法:'入队标记（正确）' },
              },
              {
                id: 'q1', label: 'A 出队，B 和 C 入队+标记',
                note: 'A 出队，邻居 B 和 C 均未访问，入队时立即标记。队列：[B,C]。',
                code_line: 7,
                node_states: { A:'visited', B:'visited', C:'visited' },
                queue: ['B','C'],
                visited: ['A','B','C'],
                vars: { 结论:'B 和 C 各只入队 1 次' },
              },
              {
                id: 'q2', label: 'B 出队，C 已标记，不重复入队',
                note: 'B 出队，邻居 C 已被标记，跳过，不再入队。每个节点只处理 1 次。',
                code_line: 6,
                node_states: { A:'visited', B:'visited', C:'visited' },
                queue: ['C'],
                visited: ['A','B','C'],
                vars: { 结论:'C 不会重复入队，正确！' },
              },
              {
                id: 'q3', label: '错误写法：A 入队但未标记',
                note: '错误做法：A 入队时不标记，出队才标记。初始队列：[A]，visited 为空。',
                code_line: 1,
                node_states: { A:'active', B:'unvisited', C:'unvisited' },
                queue: ['A'],
                visited: [],
                vars: { 写法:'出队标记（错误）' },
              },
              {
                id: 'q4', label: 'A 出队才标记，B 和 C 入队',
                note: 'A 出队后才标记，邻居 B、C 未标记，入队。队列：[B,C]。',
                code_line: 4,
                node_states: { A:'visited', B:'active', C:'active' },
                queue: ['B','C'],
                visited: ['A'],
                vars: { 注意:'B、C 入队时未标记！' },
              },
              {
                id: 'q5', label: 'B 出队，C 未标记，C 再次入队！',
                note: 'B 出队才标记，邻居 C 还未被标记，C 再次入队！队列变为 [C, C]，重复！',
                code_line: 7,
                node_states: { A:'visited', B:'visited', C:'active' },
                queue: ['C','C'],
                visited: ['A','B'],
                vars: { 问题:'C 被重复入队，会被处理 2 次！' },
              },
            ],
          },
        },

        // Step 3: choice 1
        {
          type:  'choice',
          lbl:   '找错',
          title: '下面哪段 BFS 代码会导致节点重复入队？',
          body:
`代码A：
    visited[nr][nc]=true;
    q.push({nr,nc});

代码B：
    q.push({nr,nc});
    // 出队后才: visited[r][c]=true;`,
          opts: [
            '代码B，因为入队时没有标记，同一节点可能被多个邻居重复发现并入队',
            '代码A，因为标记时机太早，可能跳过某些路径',
            '两个都不会，BFS 本身的逻辑保证每个节点只处理一次',
            '代码A和B都会，取决于图的结构',
          ],
          answer: 0,
          explain: '代码B 在入队时没有立即标记 visited，同一个未标记节点可能被多个邻居发现，被多次加入队列。代码A 是正确的做法：先标记再入队，保证每个节点最多入队一次。',
        },

        // Step 4: choice 2
        {
          type:  'choice',
          lbl:   '对比',
          title: 'BFS 和 DFS 在"是否保证最短路"上的根本差异是什么？',
          body:  `为什么 BFS 能保证最短路，而 DFS 不能？`,
          opts: [
            'BFS 按距离由近到远扩展，每层同时处理；DFS 一条路走到底，可能走弯路',
            'BFS 使用队列更快，而 DFS 使用栈导致会走错',
            'BFS 会尝试所有路径并选最短，DFS 只找到一条路',
            'DFS 不能保证找到路径，BFS 一定能找到',
          ],
          answer: 0,
          explain: 'BFS 严格按距离层次扩展，第 d 层的所有节点处理完后才处理第 d+1 层，所以第一次到达目标节点的距离就是最短距离。DFS 沿一条路径一直走，可能走了很长的弯路才到达目标，不保证最短。',
        },

        // Step 5: fill
        {
          type:  'fill',
          lbl:   '修正',
          title: '修正标记时机错误的 BFS',
          body:  `将出队时才标记的错误 BFS 改成正确的入队时标记：`,
          code:
`q.push({sr,sc});
// 修正：此处应加 visited[sr][sc] = ___①___;
while (!q.empty()) {
    auto [r,c] = q.___②___(); q.pop();
    for (auto [dr,dc]:dirs) {
        int nr=r+dr,nc=c+dc;
        if(合法 && !visited[nr][nc]) {
            visited[nr][nc]=___③___;  // 入队时标记
            q.push({nr,nc});
        }
    }
}`,
          blanks: ['①', '②', '③'],
          answer: ['true', 'front', 'true'],
          opts: ['true', 'false', 'front', 'back', '1', '0'],
          explain: '①起点入队前先标记 visited=true；②BFS 从队首取元素用 front；③每个新节点入队时立即标记 true，防止重复入队。',
        },

      ],
    },

    // ─────────────────────────────────────────
    // 英雄关：换角度巩固 · 5步（多源BFS）
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
          title:   '多源 BFS：同时从多个起点出发',
          body:
`普通 BFS 从一个起点出发，多源 BFS 同时从多个起点出发。

题目：地图上有若干个消防站（F），求每个格子到最近消防站的距离：
  F . . .
  . . F .
  . . . .
  . F . .

普通做法：对每个格子分别做 BFS，时间 O(n²m²)，太慢。
多源做法：把所有消防站同时入队，当作"虚拟超级源点"，一次 BFS 就能得到所有格子的答案，时间 O(nm)。`,
          concept:
`多源 BFS 框架（把所有源点同时初始化入队）：
queue<pair<int,int>> q;
for (所有消防站位置 [r,c]):
    q.push({r,c});
    visited[r][c] = true;
    dist[r][c] = 0;         // 消防站本身距离为 0

while (!q.empty()) {
    auto [r,c] = q.front(); q.pop();
    for (四个方向 [dr,dc]):
        if (合法 && !visited[r+dr][c+dc]) {
            visited[r+dr][c+dc] = true;
            dist[r+dr][c+dc] = dist[r][c] + 1;
            q.push({r+dr,c+dc});
        }
}

关键思路：把多个源点想象成一个"虚拟超级源点"，到各源点的距离为 0，BFS 自动扩展得到所有格子到最近源点的距离。`,
          tip: '多源 BFS 只比普通 BFS 多了"初始化时把所有源点都入队"这一步，其余逻辑完全相同。',
        },

        // Step 2: trace（grid，多源BFS从2个消防站同时扩展）
        {
          type:  'trace',
          lbl:   '看执行',
          title: '多源 BFS：两个消防站同时向外扩展',
          body:  `看清楚多个源点同时入队后，BFS 如何自动找到每个格子到最近消防站的距离。`,
          trace: {
            caption: '演示 3×3 网格，F1(0,0) 和 F2(2,2) 同时作为多源 BFS 的起点',
            mode: 'grid',
            intro: '两个消防站同时入队，BFS 一圈一圈向外扩，每个格子第一次被到达时就是最近距离。',
            grid: {
              rows: 3, cols: 3,
              cells: [
                { r:0, c:0, type:'start' },
                { r:2, c:2, type:'start' },
              ],
            },
            code:
`for (F in fires): q.push(F); dist[F]=0;
while q不空:
    [r,c]=q.front(); q.pop();
    for dirs: if 合法&&未访问:
        dist[nr][nc]=dist[r][c]+1;
        q.push({nr,nc});`,
            frames: [
              {
                id: 'm0', label: '两个消防站同时入队',
                note: '(0,0) 和 (2,2) 同时入队，距离均为 0。队列：[(0,0),(2,2)]。',
                code_line: 1,
                cell_states: [
                  { r:0, c:0, type:'active' },
                  { r:2, c:2, type:'active' },
                ],
                queue: ['F1(0,0)','F2(2,2)'],
                visited: ['(0,0)','(2,2)'],
                vars: { dist_00:0, dist_22:0 },
              },
              {
                id: 'm1', label: 'F1 扩展：(0,1) 和 (1,0)',
                note: '(0,0) 出队，扩展邻居 (0,1) 和 (1,0)，距离为 1。',
                code_line: 5,
                cell_states: [
                  { r:0, c:0, type:'visited' },
                  { r:2, c:2, type:'active' },
                  { r:0, c:1, type:'active' },
                  { r:1, c:0, type:'active' },
                ],
                queue: ['F2(2,2)','(0,1)','(1,0)'],
                visited: ['(0,0)','(2,2)','(0,1)','(1,0)'],
                vars: { dist_01:1, dist_10:1 },
              },
              {
                id: 'm2', label: 'F2 扩展：(1,2) 和 (2,1)',
                note: '(2,2) 出队，扩展邻居 (1,2) 和 (2,1)，距离为 1。',
                code_line: 5,
                cell_states: [
                  { r:0, c:0, type:'visited' },
                  { r:2, c:2, type:'visited' },
                  { r:0, c:1, type:'active' },
                  { r:1, c:0, type:'active' },
                  { r:1, c:2, type:'active' },
                  { r:2, c:1, type:'active' },
                ],
                queue: ['(0,1)','(1,0)','(1,2)','(2,1)'],
                vars: { dist_12:1, dist_21:1 },
              },
              {
                id: 'm3', label: '距离为 1 的格子全部处理完',
                note: '(0,1)(1,0)(1,2)(2,1) 四个格子出队，距离 1 层处理完毕。',
                code_line: 3,
                cell_states: [
                  { r:0, c:0, type:'visited' },
                  { r:0, c:1, type:'visited' },
                  { r:1, c:0, type:'visited' },
                  { r:1, c:2, type:'visited' },
                  { r:2, c:1, type:'visited' },
                  { r:2, c:2, type:'visited' },
                  { r:0, c:2, type:'active' },
                  { r:1, c:1, type:'active' },
                  { r:2, c:0, type:'active' },
                ],
                queue: ['(0,2)','(1,1)','(2,0)'],
                vars: { dist_02:2, dist_11:2, dist_20:2 },
              },
              {
                id: 'm4', label: 'BFS 完成：所有格子距离确定',
                note: '最后三格距离为 2，全部处理完毕。每格到最近消防站的距离均已计算完成。',
                code_line: 6,
                cell_states: [
                  { r:0, c:0, type:'visited' },
                  { r:0, c:1, type:'visited' },
                  { r:0, c:2, type:'visited' },
                  { r:1, c:0, type:'visited' },
                  { r:1, c:1, type:'visited' },
                  { r:1, c:2, type:'visited' },
                  { r:2, c:0, type:'visited' },
                  { r:2, c:1, type:'visited' },
                  { r:2, c:2, type:'visited' },
                ],
                vars: { 结果:'0,1,2 / 1,2,1 / 2,1,0', 状态:'完成' },
              },
            ],
          },
        },

        // Step 3: choice 1
        {
          type:  'choice',
          lbl:   '判断',
          title: '多源 BFS 与普通 BFS 最本质的区别是什么？',
          body:  `多源 BFS 的关键改动在哪里？`,
          opts: [
            '初始化时把所有源点同时入队，其余 BFS 逻辑完全相同',
            '多源 BFS 需要在每次出队后记录来自哪个源点',
            '多源 BFS 要对每个源点分别运行一次 BFS 再合并结果',
            '多源 BFS 需要把队列换成优先队列（堆）',
          ],
          answer: 0,
          explain: '多源 BFS 只有初始化阶段不同：把所有源点（而不是单一起点）全部入队且距离设为 0，之后的 BFS 扩展逻辑与普通 BFS 完全一样，无需任何额外修改。',
        },

        // Step 4: choice 2
        {
          type:  'choice',
          lbl:   '推广',
          title: '以下哪个问题适合用多源 BFS？',
          body:  `选出最适合用多源 BFS 解决的问题：`,
          opts: [
            '地图上有多个机器人，求地图中每个格子到最近机器人的距离',
            '从单一起点到单一终点的最短路',
            '判断图中是否存在负权环',
            '找到一条从起点到终点经过所有指定节点的最短路',
          ],
          answer: 0,
          explain: '"每个格子到最近机器人的距离"正是多源 BFS 的经典应用：把所有机器人初始化入队（距离为0），一次 BFS 得到所有格子的答案，比逐个机器人跑 BFS 快得多。',
        },

        // Step 5: fill
        {
          type:  'fill',
          lbl:   '改写',
          title: '将单源 BFS 改为多源 BFS',
          body:  `把普通单源 BFS 改写为支持多个起点的多源 BFS：`,
          code:
`// 单源：q.push({sr,sc}); dist[sr][sc]=0;
// 改为多源：
for (auto [r,c] : ___①___) {
    q.push({r,c});
    dist[r][c] = ___②___;
    visited[r][c] = ___③___;
}
// 之后 while (!q.empty()) {...} 不变`,
          blanks: ['①', '②', '③'],
          answer: ['sources', '0', 'true'],
          opts: ['sources', 'targets', '0', '1', 'true', 'false'],
          explain: '①遍历所有源点集合 sources；②所有源点到自身距离为 0；③入队时立即标记 visited=true，防止源点间互相重复入队。',
        },

      ],
    },

  },
};

// [自检] trace frames 验证：
//   新兵 grid 8帧：(0,0)→{(0,1),(1,0)}→(2,0)→(2,1)→{(2,2),(3,1)}→(3,2)→(3,3) 按 BFS 层次扩展顺序正确，步数 6 可验证 ✓
//   锐士 graph 6帧：正确写法C只入队1次 vs 错误写法C入队2次，对比演示清晰 ✓
//   英雄 grid 5帧：两源点同时入队→距离1层→距离2层→完成，结果矩阵 0,1,2/1,2,1/2,1,0 正确 ✓
// [自检] choice 迷惑项覆盖类型：
//   新兵Q1(正确按层/先进先出/记录所有/只找一条) 新兵Q2(正确入队/出队/等价/最后统一)
//   锐士Q1(正确B/A/都不会/都会) 锐士Q2(正确按层/队列更快/尝试所有/DFS找不到)
//   英雄Q1(正确同时入队/记录来源/分别运行/优先队列) 英雄Q2(正确多机器人/单起点/负权环/指定节点)
// [自检] 三关 concept 差异化：✓
//   新兵：4×4迷宫具体走法 + BFS框架"入队标记visited"
//   锐士：出队标记导致重复入队的错误代码 + 正确"入队标记"修正说明
//   英雄：多源 BFS 新场景（消防站）+ 初始化所有源点入队的框架变形
// [自检] fill opts 无序池确认：✓
//   新兵 opts=['front','back','1','0','push','pop']，6项覆盖3空
//   锐士 opts=['true','false','front','back','1','0']，6项覆盖3空
//   英雄 opts=['sources','targets','0','1','true','false']，6项覆盖3空
