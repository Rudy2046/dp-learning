// data/19_tree_diameter.js
// 章节：19.树的直径 · 经过某节点的最长路径

export const LESSON = {
  id:    'tree_diameter',
  title: '19.树的直径',
  sub:   '经过某节点的最长路径',

  battles: {

    new: {
      rank: '新兵',
      coins: 50,
      xp: 120,
      steps: [

        {
          type:  'concept',
          lbl:   '读题',
          title: '📖 树的直径——树上最长路径',
          body:
`定义：树的直径是树上任意两点间的最长路径的长度（边数或边权和）。

思路一：两次BFS/DFS（O(n)）
  1. 从任意节点 s 出发，BFS/DFS 找到距离 s 最远的节点 u。
  2. 再从 u 出发，BFS/DFS 找到距离 u 最远的节点 v。
  3. u 到 v 的距离就是树的直径。
  结论：第一步找到的 u 一定是直径的一个端点（可以严格证明）。

思路二：一次DFS（树形DP，O(n)）
  对每个节点 u，计算"经过 u 的最长路径"：
    · maxDep[u] = 从 u 出发往子树方向走的最长链（往最深子节点方向）
    · 经过 u 的最长路径 = u 子树中最长链 + 第二长链（来自两个不同子节点的两条链）
    · 用 DFS 计算，枚举每个子节点，维护最长和次长两条链
    · 直径 = 所有节点的"经过该节点最长路径"的最大值

本章重点：思路二（树形DP），理解"经过某节点的最长路径"的计算。`,
          concept:
`树形DP求直径：

对每个节点 u，DFS 时维护：
  ans：当前找到的最长路径（全局最大值）
  maxDep[u]：从 u 出发进入子树的最长链长度

当 DFS(u) 处理子节点 v 时：
  · 经过 u、连接子树 v 方向和之前已处理子树方向的路径长度：
    path = maxDep[u] + 1 + maxDep[v]
    （从u已有的最长链，经过u本身，延伸到v方向，1是u-v这条边）
  · 更新全局答案：ans = max(ans, path)
  · 更新 maxDep[u]：maxDep[u] = max(maxDep[u], maxDep[v] + 1)

注意顺序：先用旧的 maxDep[u] 更新 ans，再更新 maxDep[u]。
这样就隐式地保证了两条链来自不同子节点（当前v和之前处理过的子节点）。

边界：叶节点 maxDep[u] = 0（往子树走0步）。`,
          tip: '📌 关键顺序：先 path = maxDep[u] + 1 + maxDep[v]，再 maxDep[u] = max(maxDep[u], maxDep[v]+1)。若顺序颠倒，两条链可能来自同一个子节点，导致路径重复走一段，不是合法路径。',
        },

        {
          type:  'choice',
          lbl:   '原理',
          title: '❓ 选择：为什么"经过u的最长路径"要取两条最长子链',
          q:
`树形DP求直径时，对节点 u，"经过 u 的最长路径"的计算方式是取 u 子树中最长的两条链之和再加上什么？

（假设边权均为1）`,
          opts: [
            '加1，因为 u 自身算一个节点',
            '不需要加任何值，直接是两条最长子链之和',
            '两条子链各自深度之和，但注意两条链必须来自不同的子节点',
            '加2，因为需要经过 u 本身和 u 的父节点',
          ],
          ans:    2,
          fb_ok:  '✓ 正确。经过 u 的最长路径 = 从某子节点 v1 方向进入 u 的最长链（maxDep[v1]+1）+ 从另一子节点 v2 方向进入 u 的最长链（maxDep[v2]+1）。两条链必须来自不同子节点，否则路径会原路返回。总长 = maxDep[v1] + maxDep[v2] + 2 = maxDep[u当前最长] + maxDep[v] + 1 + 1... 在代码中表示为 maxDep[u] + 1 + maxDep[v]（其中+1是u到v的边）。',
          fb_err: '✗ 选项A（加1）：不够精确，路径是"链1 + u + 链2"，链1到u有一条边，u到链2有一条边，实际是两条边，在代码中体现为每条子链深度+1后再相加。选项B（不加）：两条子链深度不包含它们与u之间的边，需要各+1。选项D（加2）：父节点不应出现在这里，直径是子树内的路径，不经过父节点。',
          hint:   '画一条经过 u 的路径：左端 → ... → u → ... → 右端。左链深度+1（到u的边）+ 右链深度+1（到u的边）= 左链+右链+2。在代码中，maxDep[u]已经是之前最长链的深度，path = maxDep[u] + 1 + maxDep[v]（+1是u-v这条边）。',
        },

        {
          type:  'choice',
          lbl:   '顺序',
          title: '❓ 选择：更新顺序为什么重要',
          q:
`DFS(u) 处理子节点 v 时，以下两段代码的执行顺序，哪种是正确的？

代码A（先更新ans，再更新maxDep）：
  ans = max(ans, maxDep[u] + 1 + maxDep[v]);
  maxDep[u] = max(maxDep[u], maxDep[v] + 1);

代码B（先更新maxDep，再更新ans）：
  maxDep[u] = max(maxDep[u], maxDep[v] + 1);
  ans = max(ans, maxDep[u] + 1 + maxDep[v]);`,
          opts: [
            '代码A和代码B等价，顺序不影响结果',
            '代码A正确：先用旧maxDep[u]（来自之前子节点）更新ans，保证两条链来自不同子节点',
            '代码B正确：maxDep[u]更新后更大，ans会更准确',
            '两段代码都错，应该对所有子节点的maxDep排序后取最大两个',
          ],
          ans:    1,
          fb_ok:  '✓ 正确。代码A先用"处理 v 之前已有的最长链"（来自之前处理过的子节点）和"v 方向的链"组合，保证两条链方向不同。之后再把 v 方向的链更新进 maxDep[u]，供后续子节点使用。代码B先更新 maxDep[u]，则 ans 的计算变成 maxDep[u]（含v） + 1 + maxDep[v]，相当于 v 方向被算了两次，路径非法。',
          fb_err: '✗ 选项A（等价）：不等价，代码B会让 v 的链被重复计算。选项C（代码B更准确）：代码B中 maxDep[u] 已经包含了 v 的贡献，ans 中又加了 maxDep[v]，相当于 v 走了两次，是非法路径。选项D（排序取最大两个）：可以，但时间复杂度更高（O(n log n)），且代码A的"逐步更新"方式已经隐式取了最大两条，无需排序。',
          hint:   '想象 u 有三个子节点，依次处理 v1、v2、v3。处理 v2 时，maxDep[u] 保存的是 v1 方向的最长链（来自之前），这就是"来自不同子节点"的保证。如果先更新 maxDep[u] 再算 ans，则计算路径时用的是"v2 方向"加上"还是v2方向"，不合法。',
        },

        {
          type:    'fill',
          lbl:     '代码',
          title:   '✏️ 填空：一次DFS求树的直径',
          q:       '点击代码中的 [?] 方框选中，再点候选项填入：',
          code:
`#include <bits/stdc++.h>
using namespace std;
vector<int> adj[10005];
int maxDep[10005];
int ans = 0;

void dfs(int u, int parent) {
    maxDep[u] = 0; // 初始化：往子树走0步
    for (int v : adj[u]) {
        if (v == parent) continue; // 不走回头路
        dfs(v, u);
        // [A] 先用旧maxDep[u]更新全局最长路径
        ans = max(ans, maxDep[u] + 1 + maxDep[v]);
        // [B] 再更新maxDep[u]
        maxDep[u] = max(maxDep[u], maxDep[v] + 1);
    }
}

int main() {
    int n; cin >> n;
    for (int i = 0; i < n - 1; i++) {
        int a, b; cin >> a >> b;
        // [C] 无向树，双向建边
        adj[a].push_back(b);
        adj[b].push_back(a);
    }
    dfs(1, 0); // 0作为虚拟父节点
    cout << ans << endl;
}`,
          blanks:  ['A', 'B', 'C'],
          opts: [
            'ans = max(ans, maxDep[u] + 1 + maxDep[v])',
            'ans = max(ans, maxDep[u] + maxDep[v])',
            'maxDep[u] = max(maxDep[u], maxDep[v] + 1)',
            'maxDep[u] = max(maxDep[u], maxDep[v])',
            'adj[a].push_back(b); adj[b].push_back(a)',
            'adj[a].push_back(b)',
          ],
          answers: [
            'ans = max(ans, maxDep[u] + 1 + maxDep[v])',
            'maxDep[u] = max(maxDep[u], maxDep[v] + 1)',
            'adj[a].push_back(b); adj[b].push_back(a)',
          ],
          fb_ok:  '✓ A：路径长度 = maxDep[u]（已有最长链）+ 1（u到v的边）+ maxDep[v]（v子树最长链）。B：更新maxDep[u]时要+1（因为从u走到v还需要一条边）。C：树是无向的，每条边需要双向存储，否则DFS只能沿一个方向走。',
          fb_err: '✗ A 若不加1：漏掉了u到v之间的那条边，直径会少算1。B 若不加1：maxDep[u]表示从u出发能到达的最远距离，走到v的孩子需要先经过v，深度应是maxDep[v]+1（v的链长+u到v的边）。C 若只建单向：DFS从根往下走时无法回溯，或者某些子树根本访问不到。',
          hint:   'A 和 B 的+1分别是：A中+1是u到v这条边（中间的边）；B中+1是u到v这条边（让v的链在u的视角下多一步）。',
        },
      ]
    },

    pro: {
      rank: '锐士',
      coins: 80,
      xp: 200,
      steps: [

        {
          type:  'concept',
          lbl:   '读题',
          title: '📖 带边权的树的直径',
          body:
`前面讨论的是每条边权为1的情况。实际题目中边权可以不同（甚至可以为负，但此时两次BFS/DFS方法失效，只能用树形DP）。

带边权的修改：
  · maxDep[u] 的含义变为：从 u 出发进入子树的最长带权路径长度
  · 处理子节点 v（边权为 w）时：
    path = maxDep[u] + w + maxDep[v]  （w 替代了原来的1）
    maxDep[u] = max(maxDep[u], maxDep[v] + w)

两次DFS方法在负权边时的失效原因：
  负权边时，"距离最远的节点"可能不是直径端点（反例：一条很长的正权路径旁挂了一条极长的负权链），
  BFS/DFS找最远节点的贪心逻辑不再成立。
  树形DP枚举所有经过每个节点的路径，不受边权正负影响，是通用解法。`,
          concept:
`带边权树形DP求直径的完整框架：

  vector<pair<int,int>> adj[N]; // (邻居, 边权)
  long long maxDep[N], ans = 0;

  void dfs(int u, int par) {
      maxDep[u] = 0;
      for (auto [v, w] : adj[u]) {
          if (v == par) continue;
          dfs(v, u);
          ans = max(ans, maxDep[u] + w + maxDep[v]); // 先更新ans
          maxDep[u] = max(maxDep[u], maxDep[v] + w); // 再更新maxDep
      }
  }

与无权版本的唯一区别：1 → w（边权）。
结构和逻辑完全相同，这正是树形DP"局部计算，全局最优"的优雅之处。`,
          tip: '📌 两次BFS/DFS在无权或正权树上有效且代码简单，是竞赛中最常用的直径算法。但遇到"树上路径最大值"类问题或负权边时，要切换到树形DP（一次DFS）。',
        },

        {
          type:  'choice',
          lbl:   '边权',
          title: '❓ 选择：带边权版本的 maxDep 更新',
          q:
`带边权树形DP中，节点 u 处理子节点 v（边权为 w）后，maxDep[u] 的更新方式是？`,
          opts: [
            'maxDep[u] = max(maxDep[u], maxDep[v])',
            'maxDep[u] = max(maxDep[u], maxDep[v] + 1)',
            'maxDep[u] = max(maxDep[u], maxDep[v] + w)',
            'maxDep[u] = maxDep[v] + w（直接赋值不取max）',
          ],
          ans:    2,
          fb_ok:  '✓ 正确。从 u 出发走到 v，再走 v 的子树最长链，总距离 = maxDep[v] + w（v到u的边权）。取 max 是因为 u 可能有多个子节点，要保留最长的那条。',
          fb_err: '✗ 选项A（不加w）：从u出发必须经过u-v这条边才能到v的子树，忽略w会少算边权。选项B（+1）：无权版本用+1表示一条边，有权版本应用+w。选项D（直接赋值）：u可能有多个子节点，直接赋值会覆盖之前更长的链，应取max。',
          hint:   '与无权版的对比：无权版 maxDep[v]+1（+1是u到v的边）；带权版 maxDep[v]+w（+w是u到v的边权）。',
        },

        {
          type:  'choice',
          lbl:   '对比',
          title: '❓ 选择：两次DFS求直径的前提条件',
          q:
`"两次BFS/DFS求树的直径"的方法有一个重要前提，是什么？`,
          opts: [
            '树必须是有根树，不能是无根树',
            '树的节点数不超过10^5',
            '所有边权必须为正（或无权，即边权为1）',
            '树必须是完全二叉树',
          ],
          ans:    2,
          fb_ok:  '✓ 正确。两次BFS/DFS的正确性基于"距离某点最远的节点一定是直径的端点"这一性质，而这个性质只在非负权边时成立。若有负权边，最远点可能不是直径端点，两次BFS/DFS会给出错误答案。',
          fb_err: '✗ 选项A：两次BFS/DFS对有根树和无根树都有效，算法本身不要求树有根。选项B：节点数限制是运行时间的考量，不是算法正确性的前提。选项D：完全二叉树只是特殊情况，一般树同样适用。',
          hint:   '两次DFS的第一步：从任意点出发找最远点。如果有负权边，"最远"的判断可能被一条很长的负权链干扰，最终找到的不是真正的直径端点。',
        },

        {
          type:    'fill',
          lbl:     '代码',
          title:   '✏️ 填空：带边权树的直径（树形DP）',
          q:       '点击代码中的 [?] 方框选中，再点候选项填入：',
          code:
`#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
vector<pair<int,ll>> adj[10005]; // (邻居节点, 边权)
ll maxDep[10005], ans = 0;

void dfs(int u, int par) {
    maxDep[u] = 0;
    for (auto [v, w] : adj[u]) {
        if (v == par) continue;
        dfs(v, u);
        // [A] 先更新全局最长路径（用旧的maxDep[u]）
        ans = max(ans, maxDep[u] + w + maxDep[v]);
        // [B] 再更新maxDep[u]（加上边权w）
        maxDep[u] = max(maxDep[u], maxDep[v] + w);
    }
}

int main() {
    int n; cin >> n;
    for (int i = 0; i < n-1; i++) {
        int a, b; ll w; cin >> a >> b >> w;
        // [C] 双向建边，存边权
        adj[a].push_back({b, w});
        adj[b].push_back({a, w});
    }
    dfs(1, 0);
    cout << ans << endl;
}`,
          blanks:  ['A', 'B', 'C'],
          opts: [
            'ans = max(ans, maxDep[u] + w + maxDep[v])',
            'ans = max(ans, maxDep[u] + 1 + maxDep[v])',
            'maxDep[u] = max(maxDep[u], maxDep[v] + w)',
            'maxDep[u] = max(maxDep[u], maxDep[v] + 1)',
            'adj[a].push_back({b, w}); adj[b].push_back({a, w})',
            'adj[a].push_back({b, w})',
          ],
          answers: [
            'ans = max(ans, maxDep[u] + w + maxDep[v])',
            'maxDep[u] = max(maxDep[u], maxDep[v] + w)',
            'adj[a].push_back({b, w}); adj[b].push_back({a, w})',
          ],
          fb_ok:  '✓ A：路径长度中间那条边是 u-v，权重为 w。B：从 u 出发到 v 子树最远点的距离是 maxDep[v]+w。C：无向树每条边双向存储，且两个方向权重相同。',
          fb_err: '✗ A 若写+1：无权版写法，有权版应用实际边权w。B 若写+1：同上，边权用w不用1。C 若只建单向：某些子树访问不到。',
          hint:   '把无权版（+1）全部改成（+w）即可。这是树形DP求直径在带权树上的唯一修改点。',
        },
      ]
    },

    hero: {
      rank: '英雄',
      coins: 120,
      xp: 280,
      steps: [

        {
          type:  'concept',
          lbl:   '读题',
          title: '📖 两种求直径方法的深层对比',
          body:
`英雄关把两次DFS和树形DP求直径的思路做一个深层对比，理解各自的本质。

两次DFS的本质：
  · 第一次DFS找到直径端点 u（利用"最远点一定是直径端点"性质）
  · 第二次DFS从 u 出发找最远点 v，u-v 路径就是直径
  · 优点：代码简洁，O(n) 时间
  · 缺点：只对非负权边正确，且只能求直径长度

树形DP（一次DFS）的本质：
  · 枚举每个节点作为路径"拐弯点"（路径从左子树进，从右子树出，或以此节点为端点）
  · 对每个拐弯点，取两条最长子链相加
  · 优点：通用（任意边权），可扩展（能同时求直径路径上的节点、多条不重叠路径等）
  · 缺点：代码稍复杂

树的直径的一个重要性质：
  直径路径上，以任意路径节点为拐弯点，两侧的子链都是该子树内的最长链。
  这正是"经过某节点的最长路径 = 左最深 + 右最深 + 两条边"的几何直觉。`,
          concept:
`统一视角：两种方法都在找"路径最高点"

  任意一条树上路径，都有一个"最高点"（LCA，路径上深度最小的节点）。
  树形DP枚举每个节点作为最高点，对每个最高点找两条最长下行链。
  两次DFS利用直径端点的性质，绕过了显式枚举。

推广：树上路径计数问题
  如果不是求最长路径，而是求"长度恰好为k的路径数"，
  树形DP的思路可以扩展（换成计数而非求最大），而两次DFS无法直接推广。
  这体现了树形DP作为通用框架的优势。`,
          tip: '📌 面对树上路径类问题，优先想"以某节点为拐弯点，两侧各延伸一条链"这个框架。不论是求最长、最短、计数还是带约束的路径，都可以套此思路。',
        },

        {
          type:  'choice',
          lbl:   '对比',
          title: '❓ 选择：以下场景哪种方法更合适',
          q:
`以下四个场景，哪个应该用"树形DP（一次DFS）"而不是"两次DFS"来求树的直径或路径相关问题？`,
          opts: [
            '无权树，只需输出直径的边数',
            '正权树，需要输出直径的长度和路径上的所有节点',
            '边权可正可负，求树上最长路径',
            '正权树，n <= 10^6，需要最快的常数',
          ],
          ans:    2,
          fb_ok:  '✓ 正确。负权边时两次DFS方法不成立（"最远点一定是直径端点"的性质失效），必须用树形DP枚举每个拐弯点。选项A和D可用两次DFS；选项B也可用两次DFS（第二次DFS时记录路径）。',
          fb_err: '✗ 选项A：无权树两次DFS完全胜任。选项B：可以在两次DFS中额外记录前驱节点来还原路径，两次DFS也能处理。选项D：两次BFS/DFS常数更小（无递归栈开销），n=10^6 时BFS更优。只有负权边是两次DFS的硬性限制。',
          hint:   '两次DFS失效的唯一情况：负权边。其他情况（需要路径、大数据量等）两次DFS都可以处理，只是实现稍有变化。',
        },

        {
          type:  'choice',
          lbl:   '扩展',
          title: '❓ 选择：树上最长路径的"拐弯点"是哪个节点',
          q:
`在树上最长路径（直径）中，"拐弯点"（即路径 LCA，路径上深度最小的节点）具有什么性质？`,
          opts: [
            '拐弯点一定是树的根节点',
            '拐弯点一定是度数最大的节点（连接子节点最多的节点）',
            '拐弯点的两条下行子链（分别进入两个不同子树方向）之和最大，且这两条链是各自子树方向上的最长链',
            '拐弯点一定是树的中心（到所有叶节点距离最小的节点）',
          ],
          ans:    2,
          fb_ok:  '✓ 正确。直径路径的拐弯点（LCA）是路径上"方向转换"的地方：路径从某个子树方向到达此节点后转向另一个子树方向继续延伸。树形DP正是枚举每个节点作为拐弯点，对每个节点找两条方向不同的最长下行链，取所有节点中最大的组合作为直径。',
          fb_err: '✗ 选项A：根节点未必是直径的拐弯点，直径可能完全在某棵子树内（拐弯点是子树的根）。选项B：度数最大不等于拐弯点，一条链状树的直径拐弯点度数只有2。选项D：树的中心到各叶节点距离最均匀，与直径的拐弯点无直接关系。',
          hint:   '直径路径只有一个"最高点"（方向改变的地方）。树形DP的精髓就是：对每个节点分别考虑"如果它是最高点，能走多远"，取全局最优。',
        },

        {
          type:    'fill',
          lbl:     '代码',
          title:   '✏️ 填空：两次DFS求树的直径（对比参考）',
          q:       '点击代码中的 [?] 方框选中，再点候选项填入：',
          code:
`#include <bits/stdc++.h>
using namespace std;
vector<int> adj[10005];
int dist[10005], farthest;

// BFS求从src出发的最远节点
void bfs(int src, int n) {
    fill(dist+1, dist+n+1, -1);
    queue<int> q;
    q.push(src); dist[src] = 0;
    farthest = src;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : adj[u]) {
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1;
                q.push(v);
                // [A] 更新最远节点
                if (dist[v] > dist[farthest]) farthest = v;
            }
        }
    }
}

int main() {
    int n; cin >> n;
    for (int i = 0; i < n-1; i++) {
        int a, b; cin >> a >> b;
        adj[a].push_back(b);
        // [B] 双向建边
        adj[b].push_back(a);
    }
    // [C] 第一次BFS：从节点1出发找到直径一端u
    bfs(1, n);
    int u = farthest;
    // 第二次BFS：从u出发找到直径另一端v
    bfs(u, n);
    cout << dist[farthest] << endl; // 直径长度
}`,
          blanks:  ['A', 'B', 'C'],
          opts: [
            'if (dist[v] > dist[farthest]) farthest = v',
            'if (dist[v] < dist[farthest]) farthest = v',
            'adj[b].push_back(a)',
            'adj[a].push_back(b)',
            'bfs(1, n)',
            'bfs(n, n)',
          ],
          answers: [
            'if (dist[v] > dist[farthest]) farthest = v',
            'adj[b].push_back(a)',
            'bfs(1, n)',
          ],
          fb_ok:  '✓ A：dist[v]>dist[farthest] 时更新最远节点，BFS过程中持续维护当前发现的最远点。B：无向树双向建边，adj[b]也需要存a。C：第一次BFS从任意节点出发（这里选1），找到直径的一个端点，存入farthest。',
          fb_err: '✗ A 若写<：变成求最近节点而非最远节点，两次BFS求的就不是直径。B 若只加单向：无向树访问不完整，某些节点永远访问不到。C 若写bfs(n,n)：从节点n出发也可以，但题目习惯上用任意起点，节点1是最常见的写法，两者都对。',
          hint:   '两次BFS的关键：第一次找到直径端点 u，第二次从 u 出发找最远点 v，dist[v] 就是直径长度。维护 farthest 只需在发现更远节点时更新。',
        },
      ]
    },
  }
};
