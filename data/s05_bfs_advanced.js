// data/s05_bfs_advanced.js
// 章节：S05.BFS下：进阶应用 · 多源BFS·0-1BFS

export const LESSON = {
  id:    'bfs_advanced',
  title: 'S05.BFS下：进阶应用',
  sub:   '多源BFS·0-1BFS',

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
          title:   '0-1 BFS：边权只有 0 和 1 时的快速最短路',
          body:
`普通 BFS 适用于所有边权相等的图。如果边权只有 0 和 1 两种，Dijkstra 是通用解法，但可以用更简单的 0-1 BFS。

题目：图中有些边免费（权重 0），有些边花费 1 元，求从 A 到 F 的最小费用。
  A --0-- B --1-- D
  |       |       |
  1       0       1
  |       |       |
  C --1-- E --0-- F

A→B→E→F 的费用：0+0+0 = 0（全走免费边！）
A→C→E→F 的费用：1+1+0 = 2

用普通 BFS 无法区分边权 0 和 1，需要用 0-1 BFS。`,
          concept:
`0-1 BFS 框架（用双端队列 deque 代替普通队列）：
deque<int> dq;
dist[起点] = 0;
dq.push_front(起点);

while (!dq.empty()) {
    int u = dq.front(); dq.pop_front();
    for (auto [v, w] : adj[u]) {   // w 是 0 或 1
        if (dist[u] + w < dist[v]) {
            dist[v] = dist[u] + w;
            if (w == 0) dq.push_front(v);  // 权重 0：插队列头
            else        dq.push_back(v);   // 权重 1：排队列尾
        }
    }
}

核心思路：权重 0 的边不增加代价，到达的节点"和当前层一样近"，插到队首优先处理；权重 1 的边到达的节点排队尾，后处理。`,
          tip: '0-1 BFS 的关键：权重 0 插队首 push_front，权重 1 插队尾 push_back，用 deque 实现，时间复杂度 O(V+E)。',
        },

        // Step 2: trace（graph mode，0-1 BFS 演示）
        {
          type:  'trace',
          lbl:   '看执行',
          title: '0-1 BFS：权重 0 插队首，权重 1 插队尾',
          body:  `看 deque 双端队列如何让"免费边"优先处理，自动找到最小费用路径。`,
          trace: {
            caption: '演示 5 节点图的 0-1 BFS，边权只有 0 和 1，求 A 到各节点最短距离',
            mode: 'graph',
            intro: '注意观察 deque 的变化：走免费边（权重0）到达的节点插到队首，走付费边（权重1）的插到队尾。',
            graph: {
              nodes: [
                { id:'A', label:'A', x:0, y:0 },
                { id:'B', label:'B', x:1, y:0 },
                { id:'C', label:'C', x:0, y:1 },
                { id:'D', label:'D', x:2, y:0 },
                { id:'E', label:'E', x:1, y:1 },
              ],
              edges: [
                { from:'A', to:'B' },
                { from:'A', to:'C' },
                { from:'B', to:'D' },
                { from:'B', to:'E' },
                { from:'C', to:'E' },
              ],
            },
            code:
`dist[A]=0; dq.push_front(A);
while dq不空:
    u=dq.front(); dq.pop_front();
    for (v,w) in adj[u]:
        if dist[u]+w < dist[v]:
            dist[v]=dist[u]+w;
            if w==0: dq.push_front(v);
            else:    dq.push_back(v);`,
            frames: [
              {
                id: 'z0', label: 'A 入 deque 队首',
                note: '初始化：dist[A]=0，A 插入 deque 队首。deque：[A]。',
                code_line: 1,
                node_states: { A:'active', B:'unvisited', C:'unvisited', D:'unvisited', E:'unvisited' },
                queue: ['A'],
                vars: { distA:0 },
              },
              {
                id: 'z1', label: 'A 出队，B 和 C 入队',
                note: 'A 出队。A→B 权重 0：B 插队首，dist[B]=0；A→C 权重 1：C 插队尾，dist[C]=1。',
                code_line: 7,
                node_states: { A:'visited', B:'active', C:'queued', D:'unvisited', E:'unvisited' },
                edge_states: { 'A->B':'used', 'A->C':'pending' },
                queue: ['B','C'],
                vars: { distA:0, distB:0, distC:1 },
              },
              {
                id: 'z2', label: 'B 出队（队首），扩展 D 和 E',
                note: 'B 从队首出队（因为是权重0入队的），B→D 权重1：D 插队尾，dist[D]=1；B→E 权重0：E 插队首，dist[E]=0。',
                code_line: 7,
                node_states: { A:'visited', B:'visited', C:'queued', D:'queued', E:'active' },
                edge_states: { 'A->B':'used', 'B->D':'pending', 'B->E':'used' },
                queue: ['E','C','D'],
                vars: { distB:0, distD:1, distE:0 },
              },
              {
                id: 'z3', label: 'E 出队（队首），C 已有更优路径',
                note: 'E 从队首出队，检查 C：dist[E]+1=1，不优于 dist[C]=1，跳过。',
                code_line: 5,
                node_states: { A:'visited', B:'visited', C:'queued', D:'queued', E:'visited' },
                queue: ['C','D'],
                vars: { distE:0, 检查C:'0+1=1，不优化' },
              },
              {
                id: 'z4', label: 'C 出队，D 已有路径',
                note: 'C 出队，检查 E：dist[C]+1=2 > dist[E]=0，不更新。deque 继续处理 D。',
                code_line: 5,
                node_states: { A:'visited', B:'visited', C:'visited', D:'active', E:'visited' },
                queue: ['D'],
                vars: { distC:1 },
              },
              {
                id: 'z5', label: 'D 出队，所有节点处理完毕',
                note: 'D 出队，无新邻居可更新，deque 清空。最终最短距离：A=0, B=0, C=1, D=1, E=0。',
                code_line: 3,
                node_states: { A:'visited', B:'visited', C:'visited', D:'visited', E:'visited' },
                queue: [],
                vars: { distA:0, distB:0, distC:1, distD:1, distE:0 },
              },
            ],
          },
        },

        // Step 3: choice 1
        {
          type:  'choice',
          lbl:   '判断',
          title: '0-1 BFS 中，走权重为 0 的边到达的节点为什么插到队首？',
          body:  `0-1 BFS 用双端队列，权重 0 插队首，权重 1 插队尾。权重 0 插队首的原因是什么？`,
          opts: [
            '权重 0 不增加代价，到达节点和当前节点"同层"，应优先处理',
            '权重 0 的边更短，所以路径更短，要先处理',
            '队首代表优先级最高，免费边当然优先级最高',
            '插队首只是为了让 deque 两端都有使用，否则只用一端和普通队列没区别',
          ],
          answer: 0,
          explain: '走权重 0 的边不增加路径代价，新节点的 dist 值与当前节点相同，等价于"同一层"的节点，插到队首保证在当前层内立即处理，不会落后到下一层，从而维持 BFS 按代价层次扩展的性质。',
        },

        // Step 4: choice 2
        {
          type:  'choice',
          lbl:   '推导',
          title: '0-1 BFS 和普通 Dijkstra 相比有什么优势？',
          body:  `边权只有 0 和 1 时，比较 0-1 BFS 和 Dijkstra 的时间复杂度：`,
          opts: [
            '0-1 BFS 是 O(V+E)，比 Dijkstra 的 O((V+E)logV) 更快',
            'Dijkstra 更快，因为用了优先队列',
            '两者时间复杂度完全相同',
            '0-1 BFS 只能处理无权图，Dijkstra 可以处理有权图',
          ],
          answer: 0,
          explain: '0-1 BFS 用双端队列，入队出队都是 O(1)，总时间 O(V+E)。Dijkstra 用优先队列（堆），每次操作 O(logV)，总时间 O((V+E)logV)。边权只有 0/1 时，0-1 BFS 更快。',
        },

        // Step 5: fill
        {
          type:  'fill',
          lbl:   '填代码',
          title: '完成 0-1 BFS 的入队逻辑',
          body:  `补全 0-1 BFS 根据边权决定插队首还是队尾的关键逻辑：`,
          code:
`if (dist[u] + w < dist[v]) {
    dist[v] = dist[u] + w;
    if (w == ___①___)
        dq.push____②___(v);   // 权重0：插队首
    else
        dq.push____③___(v);   // 权重1：插队尾
}`,
          blanks: ['①', '②', '③'],
          answer: ['0', 'front', 'back'],
          opts: ['0', '1', 'front', 'back', 'top', 'bottom'],
          explain: '①判断边权是否为 0；②权重 0 的节点用 push_front 插到双端队列头部，优先处理；③权重 1 的节点用 push_back 插到尾部，后处理。',
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
          title:   '0-1 BFS 的陷阱：节点可以被重复松弛',
          body:
`普通 BFS 每个节点只处理一次；0-1 BFS 中，同一节点可能被更新多次。

某同学加了 visited 数组防止重复处理：
deque<int> dq;
bool visited[N] = {false};
// ...
while (!dq.empty()) {
    int u = dq.front(); dq.pop_front();
    if (visited[u]) continue;   // 跳过已访问？
    visited[u] = true;
    // ...
}

这个写法会漏掉正确答案！
例：dist[B] 先被权重 1 的路径更新为 2，B 入队尾；
   后来发现权重 0 的路径可以把 dist[B] 更新为 1，B 再次入队首；
   若 B 在队首被处理后标记 visited，队尾的旧 B 出队时被跳过，这没问题。
   但若 B 在队尾先被处理（旧值 2）且标记 visited，后来队首的 B（新值 1）反而被跳过，答案错！`,
          concept:
`正确做法：不用 visited 数组，改用"只在真正松弛时入队"来控制重复：
while (!dq.empty()) {
    int u = dq.front(); dq.pop_front();
    // 不判断 visited，但入队条件严格：dist 真正变小才入队
    for (auto [v, w] : adj[u]) {
        if (dist[u] + w < dist[v]) {   // 只有真正更优才处理
            dist[v] = dist[u] + w;
            if (w==0) dq.push_front(v);
            else      dq.push_back(v);
        }
    }
}

0-1 BFS 能正确终止：每次处理节点 u 时，若 dist[u] 不是最优值，后续会被更优的版本覆盖，节点再次入队。最终每个节点的"最优入队"会扩散出正确结果。`,
          tip: '0-1 BFS 不要加 visited 数组，严格用 dist[u]+w < dist[v] 的松弛条件来控制是否入队，这和 Dijkstra 的逻辑相同。',
        },

        // Step 2: trace（graph，0-1 BFS 节点被二次松弛的过程）
        {
          type:  'trace',
          lbl:   '看执行',
          title: '0-1 BFS：节点被更优路径二次松弛',
          body:  `看清楚当一个节点先被次优路径入队，后被最优路径再次松弛更新时，0-1 BFS 如何正确处理。`,
          trace: {
            caption: '演示 4 节点图中 B 被二次松弛的过程，说明为何不能随意加 visited',
            mode: 'graph',
            intro: '注意 B 的 dist 值：先被设为 1（通过付费边），再被设为 0（通过免费边），第二次更新才是最优解。',
            graph: {
              nodes: [
                { id:'S', label:'S(起)', x:0, y:0 },
                { id:'A', label:'A', x:1, y:0 },
                { id:'B', label:'B', x:2, y:0 },
                { id:'C', label:'C', x:1, y:1 },
              ],
              edges: [
                { from:'S', to:'A' },
                { from:'S', to:'C' },
                { from:'A', to:'B' },
                { from:'C', to:'B' },
              ],
            },
            code:
`dist[S]=0; dq.push_front(S);
while dq不空:
    u=dq.front(); dq.pop_front();
    for (v,w) in adj[u]:
        if dist[u]+w < dist[v]:
            dist[v]=dist[u]+w;
            if w==0: push_front(v)
            else: push_back(v)`,
            frames: [
              {
                id: 'r0', label: 'S 出队，扩展 A 和 C',
                note: 'S→A 权重 1：dist[A]=1，A 插队尾；S→C 权重 0：dist[C]=0，C 插队首。deque: [C, A]。',
                code_line: 8,
                node_states: { S:'visited', A:'queued', B:'unvisited', C:'active' },
                edge_states: { 'S->A':'pending', 'S->C':'used' },
                queue: ['C','A'],
                vars: { distS:0, distA:1, distC:0 },
              },
              {
                id: 'r1', label: 'C 出队（队首），扩展 B',
                note: 'C→B 权重 0：dist[B]=0，B 插队首。deque: [B, A]。此时 dist[B] 已是最优值 0。',
                code_line: 7,
                node_states: { S:'visited', A:'queued', B:'active', C:'visited' },
                edge_states: { 'S->C':'used', 'C->B':'used' },
                queue: ['B','A'],
                vars: { distC:0, distB:0 },
              },
              {
                id: 'r2', label: 'B 出队（队首），dist[B]=0 已最优',
                note: 'B 从队首出队，dist[B]=0，处理完毕。A 还在队尾等待。',
                code_line: 3,
                node_states: { S:'visited', A:'queued', B:'visited', C:'visited' },
                queue: ['A'],
                vars: { distB:0, 状态:'B 已最优' },
              },
              {
                id: 'r3', label: 'A 出队，尝试更新 B',
                note: 'A 出队，A→B 权重 1：dist[A]+1=2 > dist[B]=0，不更新。B 的最优值得以保留。',
                code_line: 5,
                node_states: { S:'visited', A:'visited', B:'visited', C:'visited' },
                queue: [],
                vars: { distA:1, 检查B:'1+1=2 > 0，不更新', distB:0 },
              },
              {
                id: 'r4', label: '完成，最终 dist[B]=0',
                note: '所有节点处理完，dist = {S:0, C:0, B:0, A:1}。免费路径 S→C→B 正确找到。',
                code_line: 2,
                node_states: { S:'visited', A:'visited', B:'visited', C:'visited' },
                queue: [],
                vars: { distS:0, distA:1, distB:0, distC:0 },
              },
            ],
          },
        },

        // Step 3: choice 1
        {
          type:  'choice',
          lbl:   '找错',
          title: '0-1 BFS 中加了 visited 数组后出错的根本原因是什么？',
          body:
`加了 visited 数组后，若节点 B 先以 dist=2 入队尾，后以 dist=0 入队首：
  若队首的 B（dist=0）先被处理并标记 visited：队尾的旧 B（dist=2）出队时被跳过，正常。
  若队尾的 B（dist=2）先被处理并标记 visited：队首的 B（dist=0）出队时被跳过，dist[B] 留成 2，错误！`,
          opts: [
            'visited 标记会阻止以更优值再次处理同一节点，丢失最短路',
            'visited 数组会占用额外内存，导致程序崩溃',
            '0-1 BFS 的 deque 本身保证了最优性，加 visited 是多余的但不会出错',
            '只有在稀疏图上才会出错，稠密图没问题',
          ],
          answer: 0,
          explain: 'visited 标记会让"以更优 dist 值的节点"在被处理后也被跳过，丢失最优路径。0-1 BFS 正确的做法是靠"dist[u]+w < dist[v]"松弛条件来过滤，已经是最优的节点扩散时不会产生新入队，不用 visited。',
        },

        // Step 4: choice 2
        {
          type:  'choice',
          lbl:   '对比',
          title: '下面哪种图不适合用 0-1 BFS，必须用 Dijkstra？',
          body:  `0-1 BFS 的适用条件是边权只有 0 和 1。选出不满足该条件的场景：`,
          opts: [
            '地图中道路有 3 种通行费：0 元、1 元、2 元',
            '网格图中，穿过普通格花费 1 步，穿过传送门花费 0 步',
            '图中每条边的权重只有"免费"或"需要一把钥匙"两种状态',
            '迷宫中某些墙可以免费拆除（花费 0），某些需要花费 1 点爆破券',
          ],
          answer: 0,
          explain: '0-1 BFS 只适用于边权只有 0 和 1 的情况。三种通行费（0、1、2）包含了不止两种权值，0-1 BFS 无法处理，必须用 Dijkstra。另外三项都是 0/1 两种权值，适合 0-1 BFS。',
        },

        // Step 5: fill
        {
          type:  'fill',
          lbl:   '修正',
          title: '去掉错误的 visited 判断，改用松弛条件',
          body:  `将有 visited 陷阱的 0-1 BFS 改成正确版本：`,
          code:
`while (!dq.empty()) {
    int u = dq.front(); dq.pop_front();
    // 删除 visited 判断，改用松弛条件控制入队
    for (auto [v,w] : adj[u]) {
        if (dist[u]+w ___①___ dist[v]) {
            dist[v] = dist[u]+___②___;
            if (w==0) dq.push_front(v);
            else dq.push____③___(v);
        }
    }
}`,
          blanks: ['①', '②', '③'],
          answer: ['<', 'w', 'back'],
          opts: ['<', '<=', 'w', '1', 'back', 'front'],
          explain: '①松弛条件：只有新距离严格更小才更新和入队；②更新 dist[v]=dist[u]+w 用实际边权 w；③权重 1 的边插队尾 push_back，与队首的权重 0 区分开。',
        },

      ],
    },

    // ─────────────────────────────────────────
    // 英雄关：换角度巩固 · 5步（BFS 判断二分图）
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
          title:   '用 BFS 染色判断二分图',
          body:
`二分图：所有节点可以分成两组，使得每条边的两个端点分别属于不同组（图中没有奇数环）。

判断方法：BFS 染色法
  给起点染色 0，所有邻居染色 1，邻居的邻居染色 0，...
  如果过程中发现某条边的两个端点颜色相同 → 不是二分图。
  如果所有节点染色完毕无矛盾 → 是二分图。

例：路径图 1-2-3-4（偶数环，是二分图）：
  1染色0 → 2染色1 → 3染色0 → 4染色1，无矛盾。
例：三角形 1-2-3-1（奇数环，不是二分图）：
  1染色0 → 2染色1，3从1染色0；但 3-1 的边两端都是 0，矛盾！`,
          concept:
`BFS 染色判断二分图：
int color[N];
fill(color, color+N, -1);   // -1 表示未染色

bool isBipartite = true;
for (每个未染色节点 s):
    color[s] = 0;
    queue<int> q; q.push(s);
    while (!q.empty() && isBipartite) {
        int u = q.front(); q.pop();
        for (int v : adj[u]) {
            if (color[v] == -1) {
                color[v] = 1 - color[u];  // 染对立色
                q.push(v);
            } else if (color[v] == color[u]) {
                isBipartite = false;       // 同色相邻，不是二分图
            }
        }
    }`,
          tip: '1 - color[u] 是颜色翻转的简洁写法：0 变 1，1 变 0，不需要 if-else 判断。',
        },

        // Step 2: trace（graph，BFS 染色过程）
        {
          type:  'trace',
          lbl:   '看执行',
          title: 'BFS 染色：判断图是否为二分图',
          body:  `看 BFS 如何用两种颜色交替染色，一旦遇到同色邻居就判定不是二分图。`,
          trace: {
            caption: '演示 4 节点偶数环（1-2-3-4-1）的 BFS 染色，结果是二分图',
            mode: 'graph',
            intro: '注意颜色交替变化：0→1→0→1，最终相邻节点颜色都不同，是二分图。',
            graph: {
              nodes: [
                { id:'1', label:'1', x:0, y:0 },
                { id:'2', label:'2', x:1, y:0 },
                { id:'3', label:'3', x:1, y:1 },
                { id:'4', label:'4', x:0, y:1 },
              ],
              edges: [
                { from:'1', to:'2' },
                { from:'2', to:'3' },
                { from:'3', to:'4' },
                { from:'4', to:'1' },
              ],
            },
            code:
`color[1]=0; q.push(1);
while q不空:
    u=q.front(); q.pop();
    for v in adj[u]:
        if color[v]==-1:
            color[v]=1-color[u]; q.push(v);
        elif color[v]==color[u]:
            return false; // 不是二分图`,
            frames: [
              {
                id: 'bi0', label: '节点 1 染色 0',
                note: '节点 1 染色 0，入队，BFS 开始。',
                code_line: 1,
                node_states: { '1':'active', '2':'unvisited', '3':'unvisited', '4':'unvisited' },
                vars: { color1:0, 队列:'[1]' },
              },
              {
                id: 'bi1', label: '1 出队，2 染色 1',
                note: '1 出队，邻居 2 未染色，染成 1-0=1，入队。',
                code_line: 6,
                node_states: { '1':'visited', '2':'active', '3':'unvisited', '4':'unvisited' },
                edge_states: { '1->2':'used' },
                vars: { color1:0, color2:1 },
              },
              {
                id: 'bi2', label: '1 出队，4 染色 1',
                note: '1 还有邻居 4 未染色，染成 1，入队。队列：[2,4]。',
                code_line: 6,
                node_states: { '1':'visited', '2':'active', '3':'unvisited', '4':'active' },
                edge_states: { '1->2':'used', '4->1':'used' },
                vars: { color4:1, 队列:'[2,4]' },
              },
              {
                id: 'bi3', label: '2 出队，3 染色 0',
                note: '2 出队，邻居 3 未染色，染成 1-1=0，入队。',
                code_line: 6,
                node_states: { '1':'visited', '2':'visited', '3':'active', '4':'active' },
                edge_states: { '1->2':'used', '2->3':'used', '4->1':'used' },
                vars: { color3:0, 队列:'[4,3]' },
              },
              {
                id: 'bi4', label: '4 出队，3 已染色且颜色不同',
                note: '4 出队，邻居 3 已染色 0，4 是 1，颜色不同，正常，不是矛盾。',
                code_line: 5,
                node_states: { '1':'visited', '2':'visited', '3':'active', '4':'visited' },
                vars: { color3:0, color4:1, 检查:'0 != 1，无矛盾' },
              },
              {
                id: 'bi5', label: 'BFS 完成，是二分图',
                note: '所有节点染色完毕（0,1,0,1），每条边两端颜色不同，是二分图！',
                code_line: 2,
                node_states: { '1':'visited', '2':'visited', '3':'visited', '4':'visited' },
                vars: { 颜色:'1→0, 2→1, 3→0, 4→1', 结论:'是二分图' },
              },
            ],
          },
        },

        // Step 3: choice 1
        {
          type:  'choice',
          lbl:   '判断',
          title: '什么情况下 BFS 染色会判定"不是二分图"？',
          body:  `BFS 染色过程中，何时判定图不是二分图？`,
          opts: [
            '处理节点 u 时，发现邻居 v 已染色且与 u 颜色相同',
            '发现图中有节点没有邻居（孤立节点）',
            'BFS 队列中同时存在两种颜色的节点',
            '图中节点数和边数相等时',
          ],
          answer: 0,
          explain: '二分图要求每条边两端颜色不同。BFS 染色过程中若某邻居 v 已被染色，且与当前节点 u 颜色相同（color[v]==color[u]），说明存在奇数环，图不是二分图。',
        },

        // Step 4: choice 2
        {
          type:  'choice',
          lbl:   '推广',
          title: '以下哪种图一定不是二分图？',
          body:  `根据二分图的定义（无奇数环），选出一定不是二分图的图：`,
          opts: [
            '包含三角形（3 个节点两两相连）的图',
            '包含 4 个节点的环（正方形）的图',
            '树（无环图）',
            '所有节点度数为 2 的图',
          ],
          answer: 0,
          explain: '三角形是一个奇数环（3 个节点的环），二分图不能含奇数环，因此包含三角形的图一定不是二分图。4 节点的环是偶数环可以是二分图，树是无环图一定是二分图，度数为 2 无法确定。',
        },

        // Step 5: fill
        {
          type:  'fill',
          lbl:   '改写',
          title: '完成 BFS 染色判断二分图',
          body:  `补全 BFS 染色的核心逻辑：`,
          code:
`for (int v : adj[u]) {
    if (color[v] == ___①___) {
        color[v] = ___②___ - color[u];
        q.push(v);
    } else if (color[v] == ___③___) {
        return false; // 同色相邻，不是二分图
    }
}`,
          blanks: ['①', '②', '③'],
          answer: ['-1', '1', 'color[u]'],
          opts: ['-1', '0', '1', 'color[u]', 'color[v]', '2'],
          explain: '①-1 表示未染色，只对未染色节点进行染色；②用 1-color[u] 切换颜色（0↔1）；③若邻居颜色等于当前节点颜色 color[u]，说明存在矛盾，返回 false。',
        },

      ],
    },

  },
};

// [自检] trace frames 验证：
//   新兵 graph 6帧：S→A(权1队尾) S→C(权0队首) → C先出→B(权0队首) → B出→A出，dist={A:1,B:0,C:0,D:1} 正确 ✓
//   锐士 graph 5帧：S→{A队尾,C队首}→C→B(权0队首)→B出(dist=0)→A出(2>0不更新) 二次松弛演示正确 ✓
//   英雄 graph 6帧：4节点偶环 1→2→3→4 染色 0→1→0→1，最后检查无矛盾，结论"是二分图" ✓
// [自检] choice 迷惑项覆盖类型：
//   新兵Q1(正确同层/更短/优先级/使用两端) 新兵Q2(正确0-1BFS/Dijkstra/相同/0-1仅无权)
//   锐士Q1(正确丢失最短路/内存崩溃/多余不出错/仅稀疏) 锐士Q2(正确3种费/传送门/钥匙/爆破)
//   英雄Q1(正确同色邻居/孤立节点/队列两色/节点边数相等) 英雄Q2(正确三角形/正方形/树/度数2)
// [自检] 三关 concept 差异化：✓
//   新兵：具体0-1权重图例子 + deque push_front/back核心思路
//   锐士：visited数组导致丢失最优路径的错误案例 + 改用松弛条件控制的正确做法
//   英雄：BFS 染色判断二分图（新场景）+ 1-color[u] 翻转颜色的框架
// [自检] fill opts 无序池确认：✓
//   新兵 opts=['0','1','front','back','top','bottom']，6项覆盖3空
//   锐士 opts=['<','<=','w','1','back','front']，6项覆盖3空
//   英雄 opts=['-1','0','1','color[u]','color[v]','2']，6项覆盖3空
