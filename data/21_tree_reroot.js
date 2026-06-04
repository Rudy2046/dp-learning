// data/21_tree_reroot.js
// 章节：21.换根DP · 父节点信息补偿

export const LESSON = {
  id:    'tree_reroot',
  title: '21.换根DP',
  sub:   '父节点信息补偿',

  battles: {

    new: {
      rank: '新兵',
      coins: 50,
      xp: 120,
      steps: [

        {
          type:  'concept',
          lbl:   '读题',
          title: '📖 换根DP——以每个节点为根时的最优值',
          body:
`典型题目：树上有 n 个节点，求"以每个节点为根时，根到所有叶节点距离之和"，输出所有节点中的最小值。

朴素做法：对每个节点分别做一次 DFS，O(n^2)，n 大时超时。

换根DP的思路：两次 DFS，O(n)
  第一次 DFS：以节点 1 为根，计算每个子树的"向下"信息（如子树大小、子树内距离和）
  第二次 DFS：从根往下，利用父节点的信息推导每个子节点作为根时的答案

关键：从父节点 u 推导子节点 v 作为根时的答案
  当 v 作为根时，它的子树变成了"整棵树"，
  与 v 作为 u 的子节点时的区别：
    · 原来 v 子树方向的贡献不变（向下走）
    · 原来 u 方向（u 及其他子树）变成了 v 的新的"子树"方向

具体推导（以"所有节点到根的距离之和"为例）：
  设 down[v] = 从 v 出发，v 子树内所有节点到 v 的距离之和
  设 f[v] = 以 v 为根时，所有节点到 v 的距离之和
  
  已知 f[u]，推导 f[v]（v 是 u 的子节点，边权为1）：
    · 以 v 为根：v 子树内的 sz[v] 个节点各近了1步，其他 n-sz[v] 个节点各远了1步
    · f[v] = f[u] - sz[v] + (n - sz[v]) = f[u] + n - 2*sz[v]`,
          concept:
`换根DP的通用框架：

第一次DFS（自底向上）：
  · 计算 sz[u]（子树大小）
  · 计算 down[u]（子树内部信息，如距离和）

第二次DFS（自顶向下）：
  · 根节点 f[root] 直接由 down[root] 得到
  · 对子节点 v：利用 f[u] 推导 f[v]（"父节点信息补偿"）

以"所有节点到根距离之和"为例：
  第一次DFS：sz[u] = 1 + sum(sz[v]); down[u] = sum(down[v] + sz[v])
  第二次DFS：f[root] = down[root]; f[v] = f[u] + n - 2*sz[v]

答案：min(f[1..n])

时间复杂度：两次DFS各O(n)，总O(n)。`,
          tip: '📌 换根DP的精髓在于"父节点信息补偿"：v 作为根时，f[u] 中 v 子树方向的贡献要减去，u 及其他子树方向的贡献要加上。推导公式因题而异，但框架固定：两次DFS，第二次利用父节点信息推子节点。',
        },

        {
          type:  'choice',
          lbl:   '推导',
          title: '❓ 选择：f[v] 由 f[u] 推导的正确公式',
          q:
`设 f[u] 为以 u 为根时所有节点到 u 的距离之和，n 为总节点数，sz[v] 为以 v 为子节点时 v 的子树大小，边权为 1。

当根从 u 换到 v（v 是 u 的子节点）时，f[v] = ?`,
          opts: [
            'f[v] = f[u] + sz[v] - (n - sz[v]) = f[u] + 2*sz[v] - n',
            'f[v] = f[u] - sz[v] + (n - sz[v]) = f[u] + n - 2*sz[v]',
            'f[v] = f[u] + n（所有节点距离都增加1）',
            'f[v] = down[v]（只用子树方向的距离）',
          ],
          ans:    1,
          fb_ok:  '✓ 正确。根从 u 换到 v 时：v 子树内 sz[v] 个节点（含v自身）到根距离各减少1（近了1步），共 -sz[v]；u 及其他子树共 n-sz[v] 个节点到根距离各增加1（远了1步），共 +(n-sz[v])。总变化：f[v] = f[u] - sz[v] + (n-sz[v]) = f[u] + n - 2*sz[v]。',
          fb_err: '✗ 选项A（+2*sz[v]-n）：把加减搞反了，v子树应该是减（近了1步），其他应该是加（远了1步）。选项C（+n）：这相当于所有节点都远了1步，只有v子树外的节点才远了，v子树内的近了。选项D（down[v]）：down[v]只是v子树内的距离，遗漏了v子树外的所有节点。',
          hint:   '换根时，v 子树内的节点"上楼"（离根更近），其他节点"下楼"（离根更远）。画图帮助理解：根从u移到v，u-v这条边的方向反转。',
        },

        {
          type:  'choice',
          lbl:   '顺序',
          title: '❓ 选择：两次DFS的职责划分',
          q:
`换根DP中两次DFS各有什么职责，正确的划分是？`,
          opts: [
            '第一次DFS求直径；第二次DFS求最短路径',
            '第一次DFS（自底向上）计算子树信息（sz、down等）；第二次DFS（自顶向下）利用父节点推导每个节点作为根的答案',
            '第一次DFS从根出发计算所有节点的f值；第二次DFS验证答案',
            '两次DFS完全相同，第二次是对第一次的补充',
          ],
          ans:    1,
          fb_ok:  '✓ 正确。第一次DFS是"自底向上"的信息收集（后序遍历），计算子树大小、子树内距离等；第二次DFS是"自顶向下"的信息下发（先序遍历），把根节点的 f 值往子节点传递，利用推导公式得到每个节点作为根的答案。',
          fb_err: '✗ 选项A：换根DP与直径求法无关。选项C：第一次DFS只能算以固定根（如1号节点）为根的子树信息，不能直接算出所有节点作为根的f值，那正是第二次DFS的任务。选项D：两次DFS方向相反、职责不同，不是相同的操作。',
          hint:   '换根DP = 一次"由下往上收集"（后序）+ 一次"由上往下分发"（先序）。两次遍历方向相反，互相补充。',
        },

        {
          type:    'fill',
          lbl:     '代码',
          title:   '✏️ 填空：换根DP求每个节点作为根的距离和',
          q:       '点击代码中的 [?] 方框选中，再点候选项填入：',
          code:
`#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
int n;
vector<int> adj[10005];
ll sz[10005], down[10005], f[10005];

// 第一次DFS：计算sz和down
void dfs1(int u, int par) {
    sz[u] = 1; down[u] = 0;
    for (int v : adj[u]) {
        if (v == par) continue;
        dfs1(v, u);
        sz[u] += sz[v];
        // [A] down[u]加上v子树的贡献
        down[u] += down[v] + sz[v]; // 子树内每个节点到u的距离=到v的距离+1
    }
}

// 第二次DFS：利用f[u]推导f[v]
void dfs2(int u, int par) {
    for (int v : adj[u]) {
        if (v == par) continue;
        // [B] 换根公式：f[v] = f[u] + n - 2*sz[v]
        f[v] = f[u] + n - 2 * sz[v];
        dfs2(v, u);
    }
}

int main() {
    cin >> n;
    for (int i = 0; i < n-1; i++) {
        int a, b; cin >> a >> b;
        adj[a].push_back(b); adj[b].push_back(a);
    }
    dfs1(1, 0);
    // [C] 根节点1的f值初始化
    f[1] = down[1];
    dfs2(1, 0);
    ll ans = *min_element(f+1, f+n+1);
    cout << ans << endl;
}`,
          blanks:  ['A', 'B', 'C'],
          opts: [
            'down[u] += down[v] + sz[v]',
            'down[u] += down[v]',
            'f[v] = f[u] + n - 2 * sz[v]',
            'f[v] = f[u] - sz[v] + sz[u]',
            'f[1] = down[1]',
            'f[1] = 0',
          ],
          answers: [
            'down[u] += down[v] + sz[v]',
            'f[v] = f[u] + n - 2 * sz[v]',
            'f[1] = down[1]',
          ],
          fb_ok:  '✓ A：v子树内每个节点到u的距离=到v的距离+1（u-v这条边），sz[v]个节点各+1，所以down[u]+=down[v]+sz[v]。B：换根公式，v子树内sz[v]个节点近1步，其余n-sz[v]个节点远1步。C：节点1作为根时，所有节点到1的距离和就是down[1]（子树=整棵树）。',
          fb_err: '✗ A若只写+=down[v]：遗漏了u-v这条边对sz[v]个节点各贡献的1，距离少算。B若写-sz[v]+sz[u]：公式错误，应是n-2*sz[v]（n=sz[v]+(n-sz[v])，一侧减sz[v]，另一侧加(n-sz[v])，净变化n-2*sz[v]）。C若f[1]=0：节点1到自身距离为0，但其他节点到1的距离之和是down[1]，f[1]应该等于down[1]。',
          hint:   'down[u]的含义：u子树内所有节点到u的距离之和（含u自身，距离0）。合并子树v时，v子树内每个节点到u比到v多1步，所以+=down[v]+sz[v]。',
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
          title: '📖 带子节点信息的换根：减去当前子节点的贡献',
          body:
`更复杂的换根场景：f[u] 包含了 u 的所有子节点的贡献，推导 f[v] 时需要先"减去 v 的贡献"。

例题：树上每个节点有权值，f[u] = 以 u 为根时所有节点权值之和，除以到 u 的距离（类似调和加权）。
这类题目中，f[u] 中包含了从 v 子树方向来的贡献 contrib(v→u)，
换根到 v 后，这部分贡献的"距离"全部发生变化，需要：
  1. 从 f[u] 中减去 v 子树的贡献 contrib(v→u)
  2. 把 u 方向（u 及其他子树）变成 v 的新子树，加上新的贡献 contrib(u→v)

更常见的版本（"最大深度之和"问题）：
  g[u] = 以 u 为根时，所有节点深度之和（即所有节点到根的距离之和）
  已知 g[u]，推导 g[v]（v是u子节点）：
    g[v] = g[u] - sz[v] + (n - sz[v])  ← 这就是上一关的公式

  "含子节点贡献的减法"在更复杂的题目中形式多样，
  但核心步骤始终是：先减去"v在u视角下的贡献"，再加上"u在v视角下的贡献"。`,
          concept:
`减去子节点贡献的通用模式：

  // 第二次DFS
  void dfs2(int u, int par) {
      for (int v : adj[u]) {
          if (v == par) continue;
          // 步骤1：从f[u]中减去v子树的贡献
          ll contrib_v = ...; // v子树对f[u]的贡献，由题意决定
          // 步骤2：加上u方向变成v子树后的贡献
          ll contrib_u = ...; // u方向对f[v]的贡献
          f[v] = f[u] - contrib_v + contrib_u;
          dfs2(v, u);
      }
  }

以"距离之和"为例：
  contrib_v = sz[v]（v子树内sz[v]个节点各减1步，净变化-sz[v]）
  contrib_u = n - sz[v]（u及其他子树n-sz[v]个节点各加1步，净变化+（n-sz[v]））
  f[v] = f[u] - sz[v] + (n - sz[v]) = f[u] + n - 2*sz[v] ← 与新兵关完全一致`,
          tip: '📌 "减去当前子节点贡献"是换根DP的高频操作。每道题的贡献计算方式不同，但框架固定：明确"v 子树在 u 视角下的贡献"和"u 方向在 v 视角下的贡献"，一减一加。',
        },

        {
          type:  'choice',
          lbl:   '推导',
          title: '❓ 选择：带权值的换根推导',
          q:
`树上每个节点有权值 a[i]，f[u] = 所有节点权值之和 / 到 u 的距离（距离=1时算作a[i]本身）。
换根从 u 到 v（v是u子节点）时，以下哪个描述是正确的？`,
          opts: [
            'f[v] = f[u] + a[v]（v 现在是根，贡献增加）',
            'v子树内的节点到根距离各减1，u方向节点到根距离各加1，但"权值/距离"的变化更复杂，不能用简单公式',
            'f[v] = f[u] + n - 2*sz[v]（与距离之和的公式完全相同）',
            '换根DP只适用于距离之和，不适用于带除法的权值计算',
          ],
          ans:    1,
          fb_ok:  '✓ 正确。当 f[u] 是"所有节点权值/距离"的形式时，换根后每个节点的距离变化（±1）导致每个节点的 a[i]/dist 发生非线性变化（1/(dist-1) 和 1/(dist+1) 都不等于 1/dist ± 常数），无法用简单的线性公式推导。这类题目通常需要单独维护每个子树的贡献函数，或者用不同的 DP 状态。',
          fb_err: '✗ 选项A：仅加 a[v] 过于简化，忽略了距离变化的影响。选项C：n-2*sz[v] 公式只适用于"所有节点到根的距离之和"（线性距离），除法形式不适用。选项D：换根DP适用范围很广，不限于距离之和，但具体公式因题而异，不是"不适用"。',
          hint:   '关键问题：换根后的 f[v] 能否用 f[u] 加减一个简单的量表达？对于线性距离（+1/-1），可以；对于除法（1/(d±1) 与 1/d 的差不是常数），一般不能。',
        },

        {
          type:  'choice',
          lbl:   '变形',
          title: '❓ 选择：换根DP求树上最远距离',
          q:
`f[u] = 树上所有节点到 u 的最大距离（即以 u 为根时的树高）。
换根从 u 到 v（v是u子节点，边权1）时，f[v] 如何由 f[u] 推导？`,
          opts: [
            'f[v] = f[u] + 1（离 u 近了但整体高度总是增加）',
            'f[v] = max(maxDep[v], f[u] - 某个值 + 1)（取v子树方向和u方向的较大值）',
            'f[v] = f[u] - 1（换根后树高减少1）',
            'f[v] = maxDep[v]（只看v自己子树的深度）',
          ],
          ans:    1,
          fb_ok:  '✓ 正确。以 v 为根时，最远节点要么在 v 的原子树中（深度 maxDep[v]），要么在 u 方向（f[u]-1再+1=f[u]，但如果f[u]本身是通过v方向算出来的，需减去v方向贡献）。精确公式：f[v] = max(maxDep[v], f[u] + 1)，但 f[u] 中可能包含了通过 v 方向的路径，此时 f[u] 应换成"f[u]中去掉v方向贡献后的值+1"。这比距离之和复杂，需要维护"次长链"。',
          fb_err: '✗ 选项A（总是+1）：若 v 子树的最深节点比 u 方向更深，f[v]可能小于f[u]+1。选项C（-1）：以v为根时，u变成了v的子节点，u方向的深度是f[u]-1+1=f[u]（加回v-u的边），不是简单-1。选项D（只看自己子树）：忽略了u方向的贡献，可能漏掉更长的路径。',
          hint:   '以v为根时，v的"子树"包括两部分：原来v的子树（最深maxDep[v]）和u方向（最深 = 以u为根时去掉v方向的最长链 + 1）。取这两部分的max。',
        },

        {
          type:    'fill',
          lbl:     '代码',
          title:   '✏️ 填空：换根DP求每节点的子树距离之和（带权值版）',
          q:       '点击代码中的 [?] 方框选中，再点候选项填入：',
          code:
`// 每条边权为1，求以每个节点为根时，所有节点到根的距离之和的最小值
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
int n; vector<int> adj[10005];
ll sz[10005], down[10005], f[10005];

void dfs1(int u, int par) {
    sz[u] = 1; down[u] = 0;
    for (int v : adj[u]) {
        if (v == par) continue;
        dfs1(v, u);
        sz[u] += sz[v];
        down[u] += down[v] + sz[v];
    }
}

void dfs2(int u, int par) {
    for (int v : adj[u]) {
        if (v == par) continue;
        // [A] 换根公式：v子树sz[v]个节点近1，其余n-sz[v]个节点远1
        f[v] = f[u] + (ll)(n - sz[v]) - (ll)sz[v];
        // 等价写法：f[v] = f[u] + n - 2*sz[v]
        dfs2(v, u);
    }
}

int main() {
    cin >> n;
    for (int i = 0; i < n-1; i++) {
        int a, b; cin >> a >> b;
        adj[a].push_back(b); adj[b].push_back(a);
    }
    // [B] 第一次DFS：以1为根计算sz和down
    dfs1(1, 0);
    // [C] 初始化根节点的f值
    f[1] = down[1];
    dfs2(1, 0);
    cout << *min_element(f+1, f+n+1) << endl;
}`,
          blanks:  ['A', 'B', 'C'],
          opts: [
            'f[v] = f[u] + (ll)(n - sz[v]) - (ll)sz[v]',
            'f[v] = f[u] + sz[v] - (ll)(n - sz[v])',
            'dfs1(1, 0)',
            'dfs1(n, 0)',
            'f[1] = down[1]',
            'f[1] = n - 1',
          ],
          answers: [
            'f[v] = f[u] + (ll)(n - sz[v]) - (ll)sz[v]',
            'dfs1(1, 0)',
            'f[1] = down[1]',
          ],
          fb_ok:  '✓ A：(n-sz[v])个节点各远1步，sz[v]个节点各近1步，净变化 +(n-sz[v])-sz[v]=n-2*sz[v]，等价写法。B：第一次DFS选任意根节点（这里选1）自底向上收集sz和down。C：f[1]=down[1]，以1为根时所有节点到1的距离之和正好是down[1]（整棵树是1的子树）。',
          fb_err: '✗ A若写+sz[v]-(n-sz[v])：方向反了，v子树应该是"减"（近），其他应该是"加"（远）。B若从n号节点开始：任意节点都可以作为第一次DFS的起点，选1或n都正确，但选1是惯例。C若f[1]=n-1：n-1是树的边数，不是距离之和，这只在链状树根节点在端点时等于距离之和。',
          hint:   'A的推导：根从u移到v，u-v这条边方向改变。v子树内sz[v]个节点"上移"1步（近）；u及其他n-sz[v]个节点"下移"1步（远）。f[v]=f[u]+(远的增量)-(近的减量)=f[u]+(n-sz[v])-sz[v]。',
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
          title: '📖 父节点补偿的推导：为什么要减去当前子节点的贡献',
          body:
`英雄关用一个稍复杂的例子——"每个节点的最大子树深度"——讲清楚"减去子节点贡献"的推导过程。

问题：对每个节点 u，求以 u 为根时整棵树的最大深度（即最远叶节点的距离）。

第一次DFS：
  maxDown[u] = 以 u 为根时子树内最深叶节点的距离（只看向下方向）
  同时维护最长子链（max1[u]）和次长子链（max2[u]，来自不同子节点）

第二次DFS（换根）：
  f[u] = 以 u 为根时整棵树最深节点的距离
  f[root] = maxDown[root]

  推导 f[v]（v是u的子节点）：
    以 v 为根时，最深节点要么在 v 原子树中（maxDown[v]），
    要么在 u 方向：先走 v→u（+1），再从 u 向上或向其他子节点走（f[u] 中去掉 v 贡献的部分）
  
  "去掉 v 贡献"：
    若 maxDown[v]+1 == max1[u]（v方向是u的最长子链）：用 max2[u] 代替 max1[u]
    否则：用 max1[u]（v方向不是最长，直接用最长）
  
  f[v] = max(maxDown[v], 去掉v贡献后的u方向深度 + 1)`,
          concept:
`完整推导：

  // 第一次DFS（后序）
  void dfs1(int u, int par) {
      maxDown[u] = 0;
      max1[u] = max2[u] = -1; // 最长和次长子链深度
      for (int v : adj[u]) {
          if (v == par) continue;
          dfs1(v, u);
          int dep = maxDown[v] + 1; // v方向的链长
          if (dep >= max1[u]) { max2[u]=max1[u]; max1[u]=dep; }
          else if (dep > max2[u]) max2[u] = dep;
          maxDown[u] = max1[u]; // 最长子链
      }
  }

  // 第二次DFS（先序）
  void dfs2(int u, int par) {
      for (int v : adj[u]) {
          if (v == par) continue;
          int up; // u方向去掉v贡献后的深度
          if (maxDown[v]+1 == max1[u]) up = (max2[u] == -1 ? 0 : max2[u]);
          else up = max1[u];
          f[v] = max(maxDown[v], up + 1); // 取v子树和u方向的较大值
          // 将f[v]对应的"向u方向最深"信息传入max1/max2体系...
          // （完整实现略）
          dfs2(v, u);
      }
  }`,
          tip: '📌 "减去子节点贡献"的核心：若 v 方向恰好是 u 的最优方向（f[u]依赖了v），换根后这个贡献不再可用，需要退而求其次（次优方向）。维护最长和次长两个值是处理这种情况的标准技巧，在树形DP中反复出现。',
        },

        {
          type:  'choice',
          lbl:   '推导',
          title: '❓ 选择：为什么要维护"次长子链"',
          q:
`换根DP求每个节点作为根时的树高（最远叶节点距离），第一次DFS需要同时维护每个节点的最长和次长子链（max1[u]和max2[u]）。为什么不只维护最长？`,
          opts: [
            '因为次长子链用来计算树的直径',
            '因为当换根到最长子链方向的子节点v时，无法再用max1[u]（那正是通过v的路径），需要次长子链作为备用',
            '因为某些节点的最长和次长子链长度相等，需要都记录',
            '次长子链用来检验最长子链是否计算正确',
          ],
          ans:    1,
          fb_ok:  '✓ 正确。若子节点 v 恰好贡献了 u 的最长子链（max1[u]），换根后以 v 为根时，u 向 v 之外的方向最深是 max2[u]+1（次长子链加上u-v边）。若只有 max1[u] 而没有 max2[u]，当最长子链方向恰好是当前子节点时，就无法正确计算 u 方向的贡献。',
          fb_err: '✗ 选项A：次长子链在树直径计算中用来辅助（一次DFS中两条最长子链组合），但这里的需求是"去掉v贡献后的最长"，与直径计算不同。选项C：长度相等时两者都记录是副效果，不是主要原因。选项D：次长子链不用于验证，是换根时的功能性备用值。',
          hint:   '想象u有3个子节点，通过它们的子链深度分别是5,3,2。最长是5，次长是3。如果换根到深度5对应的子节点，u方向只剩次长3可用。如果只记了最长5，就没有备用了。',
        },

        {
          type:  'choice',
          lbl:   '框架',
          title: '❓ 选择：换根DP的适用范围',
          q:
`以下哪类问题适合用换根DP解决？`,
          opts: [
            '只有树上路径最长问题，其他问题不适用',
            '所有需要对树上每个节点求解"以该节点为根时某全局量"的问题，且该量可由父节点信息推导',
            '只适用于节点权值相同的情况',
            '只适用于二叉树，一般树不能换根',
          ],
          ans:    1,
          fb_ok:  '✓ 正确。换根DP适用于：需要对每个节点求"以该节点为根时的全局量"，且这个量可以由父节点的对应值通过O(1)或O(子节点数)的计算推导。典型应用：距离之和、最大深度、最大权值路径等。',
          fb_err: '✗ 选项A：距离之和、子树大小、最大深度等都适用，不限于最长路径。选项C：节点权值可以不同，换根公式里可以包含权值项。选项D：换根DP对任意树（不限二叉树）都有效，只要父子关系清晰即可。',
          hint:   '换根的前提：从 u 的答案推导 v（u的子节点）的答案，这个推导操作的代价要足够低（O(1)或O(degree)），否则总复杂度超过O(n)就失去意义。',
        },

        {
          type:    'fill',
          lbl:     '代码',
          title:   '✏️ 填空：换根DP——每个节点作为根时的子树深度（含次长链）',
          q:       '点击代码中的 [?] 方框选中，再点候选项填入：',
          code:
`#include <bits/stdc++.h>
using namespace std;
int n; vector<int> adj[10005];
int maxDown[10005], max1[10005], max2[10005], f[10005];
// max1[u]=最长子链深度，max2[u]=次长子链深度（-1表示不存在）

void dfs1(int u, int par) {
    max1[u] = max2[u] = -1; maxDown[u] = 0;
    for (int v : adj[u]) {
        if (v == par) continue;
        dfs1(v, u);
        int dep = maxDown[v] + 1;
        // [A] 更新最长和次长子链
        if (dep >= max1[u]) { max2[u] = max1[u]; max1[u] = dep; }
        else if (dep > max2[u]) max2[u] = dep;
        maxDown[u] = max1[u];
    }
    if (max1[u] == -1) maxDown[u] = 0; // 叶节点
    else maxDown[u] = max1[u];
}

void dfs2(int u, int par) {
    for (int v : adj[u]) {
        if (v == par) continue;
        // up = u方向去掉v贡献后的深度
        int up;
        // [B] 判断v是否贡献了max1[u]
        if (maxDown[v] + 1 == max1[u])
            up = (max2[u] == -1 ? -1 : max2[u]);
        else
            up = max1[u];
        // [C] f[v] = max(v子树方向, u方向+1)（up==-1说明u方向无子链，只有u-v边）
        f[v] = max(maxDown[v], up + 1);
        dfs2(v, u);
    }
}

int main() {
    cin >> n;
    for (int i = 0; i < n-1; i++) {
        int a, b; cin >> a >> b;
        adj[a].push_back(b); adj[b].push_back(a);
    }
    dfs1(1, 0);
    f[1] = maxDown[1];
    dfs2(1, 0);
    for (int i = 1; i <= n; i++) cout << f[i] << "\n";
}`,
          blanks:  ['A', 'B', 'C'],
          opts: [
            'if (dep >= max1[u]) { max2[u] = max1[u]; max1[u] = dep; } else if (dep > max2[u]) max2[u] = dep',
            'if (dep > max1[u]) max1[u] = dep',
            'if (maxDown[v] + 1 == max1[u])',
            'if (maxDown[v] == max1[u])',
            'f[v] = max(maxDown[v], up + 1)',
            'f[v] = maxDown[v] + up + 1',
          ],
          answers: [
            'if (dep >= max1[u]) { max2[u] = max1[u]; max1[u] = dep; } else if (dep > max2[u]) max2[u] = dep',
            'if (maxDown[v] + 1 == max1[u])',
            'f[v] = max(maxDown[v], up + 1)',
          ],
          fb_ok:  '✓ A：更新最长/次长：dep>=max1时，原max1降为max2，dep成为新max1；否则若dep>max2，更新max2。用>=而非>是因为等长时也需要记录次长（可能来自不同子节点）。B：判断v的贡献是否等于max1[u]，用 maxDown[v]+1（v方向链长含u-v边）与max1[u]比较。C：f[v]取v子树深度和u方向深度的较大值（up+1，+1是v-u这条边）。',
          fb_err: '✗ A若只更新max1不维护max2：换根时无法处理"v恰好是max1方向"的情况。B若写maxDown[v]==max1[u]：少了+1（v方向链长应加上v-u这条边才等于max1[u]）。C若写相加：最大深度取max不是相加，相加是路径长度（直径）。',
          hint:   'A中用>=：当有两个子节点链深度相同时，保证max1和max2来自不同子节点（先来的进max1，后来的相等时也把max1降为max2）。这样换根到任一方向都有有效的备用。',
        },
      ]
    },
  }
};
