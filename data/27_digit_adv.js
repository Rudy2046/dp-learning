// data/27_digit_adv.js
// 章节：27.数位DP进阶 · 带约束的数位计数

export const LESSON = {
  id:    'digit_adv',
  title: '27.数位DP进阶',
  sub:   '带约束的数位计数',

  battles: {
    new: {
      rank: '新兵', coins: 50, xp: 120,
      steps: [
        {
          type:  'concept',
          lbl:   '读题',
          title: '📖 给框架加一个状态维度',
          body:
`第 26 章的基础框架只有两个标志位 is_limit 和 is_zero，
状态参数只有 pos。

进阶做法是在 dfs 中再加一个（或多个）"有用状态"参数，
表示目前已决策的位数所满足的某种属性，从而处理更复杂的约束。

本章以两类经典额外状态为例：
  1. 数位和（sum）：各位数字加起来是否满足某个条件
  2. 相邻数字差（last）：记录上一位的数字，判断相邻两位差的约束`,
          concept:
`加"数位和"状态：
  dfs(pos, sum, is_limit, is_zero)
  sum：已决策各位的数字之和（前导零期间不计入）
  转移：nxt_sum = (is_zero && d==0) ? 0 : sum + d
  终止：pos == len 时，判断 sum 是否满足条件（如 sum == target）
  memo 维度：memo[pos][sum]

加"相邻数字差"状态：
  dfs(pos, last, is_limit, is_zero)
  last：上一位填入的数字（is_zero=true 时 last 无意义，通常设为 -1 或 10）
  约束示例：相邻两位数字之差的绝对值等于 k
  转移：枚举当前位 d，若 !is_zero，检查 abs(d - last) == k；
        若 is_zero（前导零），不检查约束，直接递归
  memo 维度：memo[pos][last]

同时加两个状态：
  dfs(pos, sum, last, is_limit, is_zero)
  memo 维度：memo[pos][sum][last]
  注意 memo 数组大小要提前估算，防止爆内存。`,
          tip: '📌 每加一个状态维度，memo 就多一维。状态维度不要加太多，否则内存和时间都会爆。',
        },
        {
          type:  'choice',
          lbl:   '数位和',
          title: '❓ 选择：数位和的前导零处理',
          q:
`统计各位数字之和恰好等于 10 的正整数（范围 [1, n]）。
在 dfs 中，前导零期间（is_zero=true）填入数字 0 时，数位和 sum 应该怎么更新？`,
          opts: [
            '保持 sum 不变，前导零的 0 不计入数位和',
            'sum + 0 = sum，效果一样，可以不特殊处理',
            '把 sum 重置为 0',
            '填前导零时直接 return 0，不再递归',
          ],
          ans:     0,
          fb_ok:  '✓ 虽然 sum+0=sum 数值上没变，但语义上要明确"前导零不算作数字 0"。若题目约束是"各位数字之积为 0"（含真正的 0），前导零就不能触发这个逻辑，必须靠 is_zero 来区分。养成习惯：前导零期间不更新任何与数字内容相关的状态。',
          fb_err: '✗ "sum+0=sum 效果一样"在数位和题目中碰巧成立，但在其他约束下（如数字乘积、数字种类计数）就会出错。正确习惯是前导零期间不更新与数字内容相关的状态。',
          hint:   '对数位和来说 sum+0=sum 确实相等，但想想如果约束是"各位数字的乘积"，前导零的 0 乘进去会怎样？',
        },
        {
          type:  'choice',
          lbl:   '相邻差',
          title: '❓ 选择：相邻数字差约束的处理',
          q:
`统计各相邻两位数字差的绝对值都等于 2 的正整数。
当 is_zero=true（当前还在前导零阶段）时，枚举当前位填入 d，应该如何处理"相邻差"约束？`,
          opts: [
            '跳过约束检查，因为前导零没有"真正的上一位数字"，直接递归，传入 last=d',
            '检查 abs(d - last) == 2，last 初始为 0',
            '要求 d == 0，否则跳过',
            '强制 d 从 2 开始，因为相邻差为 2 时最小有效首位是 2',
          ],
          ans:     0,
          fb_ok:  '✓ 前导零期间没有"真正的上一位"，last 的值没有意义，不能用它来检查约束。应跳过约束检查，把当前填入的 d 作为新的 last 传入下一层（此时 is_zero 若变为 false，d 就是第一个有效数字）。',
          fb_err: '✗ 若 last 初始为 0，前导零期间填入 d=2 会被误判为"相邻差=2，合法"，但实际上 2 是第一个有效数字，根本没有上一位与它相邻。必须靠 is_zero 跳过这个检查。',
          hint:   '前导零阶段 last 没有意义，只有当 is_zero 变为 false 后，last 才是真正的"上一位有效数字"。',
        },
        {
          type:  'fill',
          lbl:   '代码',
          title: '✏️ 填空：统计各相邻位差绝对值等于 k 的数',
          q:     '点击代码中的 [?] 方框选中，再点候选项填入：',
          code:
`// 统计 [1, n] 中各相邻两位数字差绝对值都等于 k 的正整数个数
string num;
int K;
int memo[20][10]; // memo[pos][last]，last 为上一位数字，0~9

int dfs(int pos, int last, bool is_limit, bool is_zero) {
    if (pos == (int)num.size())
        return is_zero ? 0 : 1;
    if (!is_limit && !is_zero && memo[pos][last] != -1)
        return memo[pos][last];

    int up = is_limit ? (num[pos] - '0') : 9;
    int res = 0;
    for (int d = 0; d <= up; d++) {
        // [A] 非前导零时，检查相邻差约束
        if (!is_zero && abs(d - last) != K) continue;

        bool nxt_limit = is_limit && (d == num[pos] - '0');
        bool nxt_zero  = is_zero && (d == 0);
        // [B] 前导零时 last 无意义，传入 d（作为下一位的"上一位"）
        int  nxt_last  = nxt_zero ? last : d;
        res += dfs(pos + 1, nxt_last, nxt_limit, nxt_zero);
    }
    // [C] 自由且非前导零时存 memo
    if (!is_limit && !is_zero) memo[pos][last] = res;
    return res;
}`,
          blanks:  ['A', 'B', 'C'],
          opts: [
            'if (!is_zero && abs(d - last) != K) continue;',
            'if (abs(d - last) != K) continue;',
            'int nxt_last = nxt_zero ? last : d;',
            'int nxt_last = d;',
            'if (!is_limit && !is_zero) memo[pos][last] = res;',
            'memo[pos][last] = res;',
          ],
          answers: [
            'if (!is_zero && abs(d - last) != K) continue;',
            'int nxt_last = nxt_zero ? last : d;',
            'if (!is_limit && !is_zero) memo[pos][last] = res;',
          ],
          fb_ok:  '✓ A：只有非前导零时才检查相邻差约束，前导零阶段没有真正的上一位，跳过检查。B：若下一位仍是前导零（nxt_zero=true），last 保持不变；否则把当前 d 作为新的 last 传下去。C：存 memo 的条件不变，仍需双重 false。',
          fb_err: '✗ A：去掉 !is_zero 判断，前导零阶段也会检查约束，导致第一个有效数字被误拒；B：直接传 d 会在前导零阶段把无意义的 d 作为 last，污染后续状态；C：无条件存 memo 会把受限状态误用于自由状态。',
          hint:   '前导零期间跳过约束（!is_zero 保护）；前导零结束才更新 last（nxt_zero 判断）；存 memo 的条件始终是双重 false。',
        },
      ],
    },

    pro: {
      rank: '锐士', coins: 80, xp: 200,
      steps: [
        {
          type:  'concept',
          lbl:   '读题',
          title: '📖 多维状态的数位DP',
          body:
`有些题目需要同时追踪多个属性，比如：
"各位数字之和能被 3 整除，且不含相邻两位相同的数字"

这时 dfs 的参数里就会同时带上 sum（或 sum%3）和 last。
状态维度增加，但框架逻辑完全一样，只是 memo 数组变成多维。`,
          concept:
`多维状态设计原则：

1. 只记"有用的"状态，而非原始数值
   例如约束是"数位和被 3 整除"，只需记 sum%3（3 种取值），
   不需要记完整的 sum（最多 9*18=162），可以大幅压缩 memo。

2. 无效状态不入 memo
   is_limit=true 或 is_zero=true 时，状态不稳定，仍不入 memo。

3. 估算 memo 大小
   pos 最多 18~20 位（10^18 有 19 位）；
   sum%3 有 3 种；last 有 10 种；
   二维数字种类最多 10 种...
   总大小 = 20 * 3 * 10 = 600，完全可行。

4. 初始化
   memset(memo, -1, sizeof(memo)) 在 solve 函数里调用，
   不要放在 dfs 里（每次递归都初始化会清掉之前的结果）。

常见题型汇总：
  数位和整除：state = sum % mod
  相邻不同：state = last（上一位数字）
  不含某数字：约束在枚举 d 时直接 continue，不需要额外状态
  数字 1 出现次数 <= k：state = cnt1（1 的个数）
  上升/下降子序列：state = last（判断 d 与 last 的大小关系）`,
          tip: '📌 memo 维度能压缩就压缩：数位和取模、数字种类用 bitmask、次数限制直接记次数。避免 memo 超出内存限制。',
        },
        {
          type:  'choice',
          lbl:   '压缩',
          title: '❓ 选择：状态压缩的时机',
          q:
`统计 [1, n] 中各位数字之和能被 7 整除的正整数（n 最多 18 位）。
dfs 中的 state 参数（记录数位和相关信息）最好设计成什么？`,
          opts: [
            'sum % 7，只需 0~6 共 7 种取值，memo 大小 = 20 * 7',
            '完整的 sum，最大为 9*18=162，memo 大小 = 20 * 163',
            '只需要 bool 类型，记录当前 sum 是否已经被 7 整除',
            'sum / 7，记录已经整除了几次',
          ],
          ans:     0,
          fb_ok:  '✓ 约束是"最终 sum 能被 7 整除"，只有余数有意义，记 sum%7 即可。20 * 7 = 140，极小；而记完整 sum 的 20 * 163 = 3260 虽然也可行，但没必要。',
          fb_err: '✗ 只记 bool 会丢失余数信息，无法计算后续位加入后能否整除；sum/7 记录整除次数没有意义，因为中间状态的"整除次数"无法决定最终结果。',
          hint:   '"能被 7 整除"只需要知道除以 7 的余数，余数只有 0~6 七种，完全不需要存完整的 sum。',
        },
        {
          type:  'choice',
          lbl:   '陷阱',
          title: '❓ 选择：多维 memo 的初始化位置',
          q:
`数位DP 中使用二维 memo[pos][last]，memset(memo, -1, sizeof(memo)) 应该放在哪里？`,
          opts: [
            '在主函数或 solve 函数里，调用 dfs 之前执行一次',
            '在 dfs 函数的开头，每次进入就初始化',
            '在 dfs 函数的结尾，每次退出就清空',
            '不需要初始化，memo 未被赋值时自动为 -1',
          ],
          ans:     0,
          fb_ok:  '✓ memset 只需在整次查询开始前执行一次。放在 dfs 开头会在每次递归时清空，之前存的结果全部失效，记忆化失去意义。',
          fb_err: '✗ 放在 dfs 开头是常见错误：每次递归进入都 memset，会把上一次递归存好的 memo 清掉，记忆化完全失效，退化成暴力。全局数组默认初始化为 0，不是 -1。',
          hint:   '思考：dfs 是递归函数，每次调用都执行开头的代码，若开头有 memset 会发生什么？',
        },
        {
          type:  'fill',
          lbl:   '代码',
          title: '✏️ 填空：数位和被 3 整除 + 相邻不同',
          q:     '点击代码中的 [?] 方框选中，再点候选项填入：',
          code:
`// 统计 [1, n] 中：各位数字之和被 3 整除 且 相邻两位不同 的正整数
string num;
int memo[20][3][10]; // [pos][sum%3][last]

int dfs(int pos, int sm3, int last, bool is_limit, bool is_zero) {
    if (pos == (int)num.size())
        return (!is_zero && sm3 == 0) ? 1 : 0;
    if (!is_limit && !is_zero && memo[pos][sm3][last] != -1)
        return memo[pos][sm3][last];

    int up = is_limit ? (num[pos] - '0') : 9;
    int res = 0;
    for (int d = 0; d <= up; d++) {
        // [A] 非前导零时，检查相邻不同约束
        if (!is_zero && d == last) continue;

        bool nxt_limit = is_limit && (d == num[pos] - '0');
        bool nxt_zero  = is_zero && (d == 0);
        // [B] 数位和取模更新（前导零不计入）
        int  nxt_sm3   = (is_zero && d == 0) ? sm3 : (sm3 + d) % 3;
        int  nxt_last  = nxt_zero ? last : d;
        res += dfs(pos + 1, nxt_sm3, nxt_last, nxt_limit, nxt_zero);
    }
    // [C] 存 memo
    if (!is_limit && !is_zero) memo[pos][sm3][last] = res;
    return res;
}`,
          blanks:  ['A', 'B', 'C'],
          opts: [
            'if (!is_zero && d == last) continue;',
            'if (d == last) continue;',
            'int nxt_sm3 = (is_zero && d == 0) ? sm3 : (sm3 + d) % 3;',
            'int nxt_sm3 = (sm3 + d) % 3;',
            'if (!is_limit && !is_zero) memo[pos][sm3][last] = res;',
            'memo[pos][sm3][last] = res;',
          ],
          answers: [
            'if (!is_zero && d == last) continue;',
            'int nxt_sm3 = (is_zero && d == 0) ? sm3 : (sm3 + d) % 3;',
            'if (!is_limit && !is_zero) memo[pos][sm3][last] = res;',
          ],
          fb_ok:  '✓ A：相邻不同约束只在非前导零时检查，is_zero=true 时 last 无意义不能用来判断。B：前导零期间 d=0 不计入数位和（sm3 不变），否则取模更新。C：双重 false 才存 memo。',
          fb_err: '✗ A：去掉 !is_zero 保护，前导零阶段会把第一个有效数字和无意义的初始 last 比较，可能误拒合法数字。B：直接 (sm3+d)%3 会把前导零的 0 计入数位和（虽然 0 不影响模 3，但遇到其他模数或非 0 前导情况就会出错）。C：无条件存 memo 会污染受限状态。',
          hint:   '两个约束都需要 is_zero 保护：相邻不同检查和数位和更新，前导零阶段都要跳过或特殊处理。',
        },
      ],
    },

    hero: {
      rank: '英雄', coins: 120, xp: 280,
      steps: [
        {
          type:  'concept',
          lbl:   '读题',
          title: '📖 额外状态维度的本质',
          body:
`英雄关从更高层次来看数位DP的额外状态：
什么样的约束需要额外状态？什么样的约束不需要？
理解这个，就能在新题面前快速判断 dfs 应该有哪些参数。`,
          concept:
`不需要额外状态的约束（直接在枚举时 continue 剪枝）：
  "不含数字 x"：枚举到 d==x 时直接 continue，不需要记住"有没有出现过 x"。
  "首位不为 0"：靠 is_zero 天然处理，不需要额外状态。
  "不超过某个值"：靠 is_limit 天然处理。

需要额外状态的约束（依赖"已决策的历史信息"）：
  "数位和等于 k"：需要记录已填位的数字之和（或模某数的余数）。
  "相邻位差等于 k"：需要记录上一位数字 last。
  "数字 1 出现不超过 2 次"：需要记录 1 已出现几次（cnt1，取值 0/1/2/3+）。
  "各位数字单调不降"：需要记录上一位数字 last（判断 d >= last）。
  "数字种类不超过 3 种"：需要记录已出现的数字集合（10 位 bitmask）。

判断方法：
  问自己：决策当前位时，我需要知道前面已填位的什么信息？
  如果需要，就把那个信息作为额外状态参数加入 dfs。
  如果不需要（只看当前位就能判断），就直接在循环里 continue。`,
          tip: '📌 额外状态 = "前面已填位的有用历史信息"。如果判断当前位合不合法只需要看当前位本身，就不需要额外状态。',
        },
        {
          type:  'choice',
          lbl:   '判断',
          title: '❓ 选择：哪个约束需要额外状态',
          q:
`以下四种约束，哪种在数位DP中需要加入额外状态参数？`,
          opts: [
            '各位数字单调不降（如 1124 合法，1342 不合法）',
            '不含数字 7（各位数字均不等于 7）',
            '是 5 的倍数（末位是 0 或 5）',
            '各位数字都是奇数',
          ],
          ans:     0,
          fb_ok:  '✓ "单调不降"需要知道上一位填了什么数字，才能判断当前位 d >= last 是否成立，必须把 last 作为额外状态参数。其余三个约束只看当前位就能判断，不需要历史信息。',
          fb_err: '✗ 不含 7：枚举到 d==7 时直接 continue，不需要记历史；是 5 的倍数：只看末位，不需要历史；各位奇数：枚举到偶数 d 时 continue，不需要历史。只有"单调不降"需要知道上一位。',
          hint:   '判断当前位 d 是否合法时，需要用到"前面填过的哪些信息"？如果需要用，那就是额外状态。',
        },
        {
          type:  'choice',
          lbl:   '设计',
          title: '❓ 选择：约束"数字 1 出现不超过 2 次"的状态设计',
          q:
`约束："各位数字中，数字 1 出现的次数不超过 2 次"。
dfs 的额外状态参数应该设计成什么？`,
          opts: [
            'cnt1，记录已出现的 1 的次数，取值 0、1、2、3（3 代表已超限，后续全剪枝）',
            'bool has_one，只记录是否出现过 1',
            '无需额外状态，枚举到 d==1 时直接 continue',
            'sum，记录所有数字之和（间接推算 1 的出现次数）',
          ],
          ans:     0,
          fb_ok:  '✓ 需要知道 1 出现了几次才能判断是否超限，所以记 cnt1，取值 0/1/2/3（3 表示已超出 2 次，可以直接返回 0）。只记 bool 无法区分"出现了 1 次"和"出现了 2 次"这两种仍然合法的情况。',
          fb_err: '✗ bool 无法区分 cnt1=1 和 cnt1=2（都合法但后续允许填 1 的次数不同）；不能直接 continue，因为 1 可以出现但不超过 2 次；sum 无法唯一确定 1 的个数（如 sum=2 可以是两个 1 也可以是一个 2）。',
          hint:   '上限是 2 次，需要区分 0、1、2、超过 2 这四种情况，bool 不够用，需要整数计数。',
        },
        {
          type:  'fill',
          lbl:   '代码',
          title: '✏️ 填空：各位单调不降的数的个数',
          q:     '点击代码中的 [?] 方框选中，再点候选项填入：',
          code:
`// 统计 [1, n] 中各位数字单调不降（从高到低非递减）的正整数个数
// 例：1124、2279 合法；1342、531 不合法
string num;
int memo[20][10]; // [pos][last]

int dfs(int pos, int last, bool is_limit, bool is_zero) {
    if (pos == (int)num.size())
        return is_zero ? 0 : 1;
    if (!is_limit && !is_zero && memo[pos][last] != -1)
        return memo[pos][last];

    int up = is_limit ? (num[pos] - '0') : 9;
    int res = 0;
    for (int d = 0; d <= up; d++) {
        // [A] 非前导零时，当前位不能比上一位小
        if (!is_zero && d < last) continue;

        bool nxt_limit = is_limit && (d == num[pos] - '0');
        bool nxt_zero  = is_zero && (d == 0);
        // [B] 更新 last：前导零结束前 last 保持不变，结束后更新为 d
        int  nxt_last  = nxt_zero ? last : d;
        res += dfs(pos + 1, nxt_last, nxt_limit, nxt_zero);
    }
    // [C] 存 memo
    if (!is_limit && !is_zero) memo[pos][last] = res;
    return res;
}

long long solve(long long n) {
    num = to_string(n);
    memset(memo, -1, sizeof(memo));
    // 初始 last=0：前导零阶段，第一个有效数字从 0 开始都合法
    return dfs(0, 0, true, true);
}`,
          blanks:  ['A', 'B', 'C'],
          opts: [
            'if (!is_zero && d < last) continue;',
            'if (d < last) continue;',
            'int nxt_last = nxt_zero ? last : d;',
            'int nxt_last = d;',
            'if (!is_limit && !is_zero) memo[pos][last] = res;',
            'memo[pos][last] = res;',
          ],
          answers: [
            'if (!is_zero && d < last) continue;',
            'int nxt_last = nxt_zero ? last : d;',
            'if (!is_limit && !is_zero) memo[pos][last] = res;',
          ],
          fb_ok:  '✓ A：单调不降约束用 !is_zero 保护，前导零阶段 last=0（初始值）不代表真实的上一位数字，不能用来约束当前位。B：前导零结束前 last 保持不变（初始值 0 继续传），结束后把 d 作为新的 last。C：双重 false 条件存 memo，不变。',
          fb_err: '✗ A：去掉 !is_zero 后，前导零阶段 last=0，枚举 d=0~9 时 d<0 不成立（0<=0<0 为假），看起来没错，但如果 last 初始值设为其他数就会出错；且养成加 is_zero 保护的好习惯更安全。B：直接传 d 会在前导零阶段把无意义的 d 作为 last，若后续第一个有效数字小于这个 d 就会被误拒。C：无条件存 memo 会污染受限状态。',
          hint:   '单调不降：当前位 d >= last 才合法，用 d < last 剪枝；last 初始值为 0，前导零期间保持不变，第一个有效数字起才开始更新。',
        },
      ],
    },
  },
};
