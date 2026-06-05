// data/26_digit_basic.js
// 章节：26.数位DP基础 · 逐位决策框架

export const LESSON = {
  id:    'digit_basic',
  title: '26.数位DP基础',
  sub:   '逐位决策框架',

  battles: {
    new: {
      rank: '新兵', coins: 50, xp: 120,
      steps: [
        {
          type:  'concept',
          lbl:   '读题',
          title: '📖 数位DP是什么',
          body:
`问题类型：统计 [1, n] 范围内满足某种"数字性质"的整数个数。
例如：统计 [1, 2025] 中各位数字之和等于 10 的数有多少个。

暴力做法是逐一枚举每个数并检验，时间复杂度 O(n·位数)，当 n 很大（如 10^18）时完全不可行。

数位DP 的思路：按位从高到低逐位决策，用记忆化搜索记录"已决策的位数+当前状态"，
避免重复计算，时间复杂度降到 O(位数 × 状态数)。`,
          concept:
`核心框架：dfs(pos, state, is_limit, is_zero)

参数含义：
  pos：当前决策第几位（从高位到低位，pos 从 0 开始）
  state：已决策的位数形成的"有用状态"（如数位和、某个数字出现次数等）
  is_limit：当前位是否受上界约束
    true：前面所有位都贴着上界，当前位最多填 limit[pos]
    false：前面某位已经小于上界，当前位可以填 0~9
  is_zero：当前数是否还全是前导零
    true：还没有填过任何非零数字（"007"的前两个 0 是前导零）
    false：已经填了至少一个非零数字

记忆化：
  只有当 is_limit=false 且 is_zero=false 时，状态才稳定可复用；
  is_limit=true 或 is_zero=true 的状态不入 memo，直接递归。

转移：
  枚举当前位填入的数字 d（0 到上界）：
    新 is_limit = (is_limit && d == limit[pos])
    新 is_zero  = (is_zero && d == 0)
    递归处理下一位，累加结果。`,
          tip: '📌 is_limit 和 is_zero 是数位DP框架的灵魂，只要搞清楚这两个标志位的含义，框架就通了。',
        },
        {
          type:  'choice',
          lbl:   'is_limit',
          title: '❓ 选择：is_limit 的作用',
          q:
`统计 [1, 3572] 中满足条件的数。
从高位开始决策：第 0 位（千位）填 2，此时 is_limit 变为 false。
接下来第 1 位（百位）可以填哪些数字？`,
          opts: [
            '0~9，因为已经比上界小，后面各位不受限制',
            '0~5，因为上界百位是 5，不能超过',
            '只能填 0，因为已经确定了高位',
            '2~9，因为不能比已填的千位 2 更小',
          ],
          ans:     0,
          fb_ok:  '✓ 千位填了 2（小于上界千位 3），is_limit 变为 false，后续所有位都可以自由填 0~9，不再受上界约束。',
          fb_err: '✗ is_limit=false 意味着"前面某位已经严格小于上界对应位"，从此往后的所有位都可以自由填 0~9。',
          hint:   '千位填 2，上界千位是 3，2 < 3，所以后面的位已经不可能超过上界了，is_limit 变为什么？',
        },
        {
          type:  'choice',
          lbl:   'is_zero',
          title: '❓ 选择：is_zero 的作用',
          q:
`统计数字中"各位不含 0"的正整数个数。
is_zero 标志位的主要作用是什么？`,
          opts: [
            '区分"前导零"和"真实的零"，避免把 007 中前两个 0 误判为数字 0',
            '记录当前数是否等于 0',
            '限制当前位只能填非零数字',
            '标记已经填过的数字种类',
          ],
          ans:     0,
          fb_ok:  '✓ 整数 7 写成 4 位时是 0007，前三个 0 是前导零，不是"数字 0"。is_zero=true 时填 0 表示"还没开始填有效数字"，不应被计入"数字中有 0"的情况。',
          fb_err: '✗ is_zero 专门用于区分前导零：当 is_zero=true 时，填 0 表示"数字还没开始"，不应触发"含有数字 0"的计数逻辑；当 is_zero=false 后，0 才是真正的数字 0。',
          hint:   '思考：整数 5 和 05 表示同一个数，但如果不处理前导零，计数时会出什么问题？',
        },
        {
          type:  'fill',
          lbl:   '代码',
          title: '✏️ 填空：数位DP框架骨架',
          q:     '点击代码中的 [?] 方框选中，再点候选项填入：',
          code:
`// 统计 [1, n] 中满足条件的数的个数
// 以"各位数字之和 <= S"为例
string num;
int memo[20][200]; // memo[pos][sum]，仅 !is_limit && !is_zero 时使用

int dfs(int pos, int sum, bool is_limit, bool is_zero) {
    if (pos == (int)num.size()) {
        // [A] 递归终止：已填完所有位，is_zero=true 说明这个数是 0，不计入
        return is_zero ? 0 : 1;
    }
    // [B] 只有不贴上界、不是前导零时，才能查/存 memo
    if (!is_limit && !is_zero && memo[pos][sum] != -1)
        return memo[pos][sum];

    int up = is_limit ? (num[pos] - '0') : 9; // 当前位的上界
    int res = 0;
    for (int d = 0; d <= up; d++) {
        // [C] 更新 is_limit：只有贴着上界且填了上界值，下一位才继续贴上界
        bool nxt_limit = is_limit && (d == up);
        bool nxt_zero  = is_zero && (d == 0);
        int  nxt_sum   = is_zero && d == 0 ? 0 : sum + d; // 前导零不计入数位和
        if (nxt_sum > S_MAX) continue; // 剪枝：超出限制跳过
        res += dfs(pos + 1, nxt_sum, nxt_limit, nxt_zero);
    }
    if (!is_limit && !is_zero) memo[pos][sum] = res;
    return res;
}`,
          blanks:  ['A', 'B', 'C'],
          opts: [
            'return is_zero ? 0 : 1;',
            'return is_zero ? 1 : 0;',
            'if (!is_limit && !is_zero && memo[pos][sum] != -1) return memo[pos][sum];',
            'if (memo[pos][sum] != -1) return memo[pos][sum];',
            'bool nxt_limit = is_limit && (d == up);',
            'bool nxt_limit = is_limit || (d == up);',
          ],
          answers: [
            'return is_zero ? 0 : 1;',
            'if (!is_limit && !is_zero && memo[pos][sum] != -1) return memo[pos][sum];',
            'bool nxt_limit = is_limit && (d == up);',
          ],
          fb_ok:  '✓ A：终止时 is_zero=true 表示整个数是 0，正整数不包含 0，返回 0；否则是合法数返回 1。B：is_limit 或 is_zero 为 true 时状态不可复用，必须双重 false 才查 memo。C：AND 运算：前一位贴上界 AND 当前位等于上界，才算继续贴上界。',
          fb_err: '✗ A：返回值含义反了，is_zero=true 才是无效的 0，应返回 0；B：直接查 memo 会把受限状态误用为自由状态；C：OR 运算会使 is_limit 一旦为 true 就永远为 true，即使填了比上界小的数字也继续限制。',
          hint:   'is_limit 用 AND：两个条件都满足才继续贴上界；memo 只在完全自由（两个 false）时才有效。',
        },
      ],
    },

    pro: {
      rank: '锐士', coins: 80, xp: 200,
      steps: [
        {
          type:  'concept',
          lbl:   '读题',
          title: '📖 数位DP的常见陷阱',
          body:
`数位DP框架不难，但写的时候有几个细节很容易出错。
本关专门整理这些陷阱，帮你在比赛中少踩坑。`,
          concept:
`陷阱1：memo 的使用条件搞反
  错误：对所有状态都存 memo，包括 is_limit=true 的情况。
  原因：is_limit=true 时，当前位的上界取决于上界数本身，
        不同路径来到同一 (pos, sum) 时上界可能不同，不能共用。
  正确：只在 !is_limit && !is_zero 时存/取 memo。

陷阱2：前导零处理不当
  错误：is_zero=true 时填 0，就把这个 0 计入"数字 0 出现过"。
  原因：003 的前两个 0 是前导零，整数 3 里没有数字 0。
  正确：is_zero && d==0 时，保持 is_zero=true，不计入任何状态更新。

陷阱3：答案统计范围
  数位DP 通常计算 [0, n] 的个数，然后根据题意处理：
  若求 [1, n]：结果减去 0 的贡献（通常结果本身就不含 0，因为 is_zero 处理了）。
  若求 [L, R]：用 f(R) - f(L-1) 容斥。

陷阱4：num 必须是字符串
  把上界 n 转成字符串 num，按字符逐位访问，每位的上界是 num[pos]-'0'。
  直接用整数操作（取模、整除）也可以但容易出错，字符串更清晰。`,
          tip: '📌 记忆化的条件：!is_limit && !is_zero，缺一不可。这是数位DP最容易写错的地方。',
        },
        {
          type:  'choice',
          lbl:   '陷阱',
          title: '❓ 选择：memo 存储条件',
          q:
`以下四种情况，哪种情况下可以把 dfs(pos, sum, ...) 的结果存入 memo 并在下次直接返回？`,
          opts: [
            'is_limit=false 且 is_zero=false',
            'is_limit=false（不管 is_zero）',
            'is_zero=false（不管 is_limit）',
            '任何情况都可以存 memo，反正 pos 和 sum 相同结果就相同',
          ],
          ans:     0,
          fb_ok:  '✓ 两个条件都必须为 false：is_limit=false 保证当前位可以自由填 0~9（不受上界约束）；is_zero=false 保证有效数字已经开始（前导零状态也不可复用）。',
          fb_err: '✗ is_limit=true 时上界随路径不同而不同，不能复用；is_zero=true 时某些状态更新逻辑（如数位和不计前导零）还没稳定，也不能复用。两个条件缺一不可。',
          hint:   '想一想：两条路径都到达 (pos=2, sum=5)，但一条受上界限制（上界数字是 3），一条不受限制（可以填 0~9），它们的答案一样吗？',
        },
        {
          type:  'choice',
          lbl:   '容斥',
          title: '❓ 选择：求区间 [L, R] 的数位DP',
          q:
`要统计 [L, R] 中满足条件的数的个数（L、R 都是正整数）。
数位DP 函数 f(n) 返回 [0, n] 中满足条件的数的个数。
正确的答案表达式是什么？`,
          opts: [
            'f(R) - f(L - 1)',
            'f(R) - f(L)',
            'f(R - 1) - f(L - 1)',
            'f(R) - f(L) + 1',
          ],
          ans:     0,
          fb_ok:  '✓ f(R) 统计 [0, R]，f(L-1) 统计 [0, L-1]，相减得到 [L, R]，两端点都包含。',
          fb_err: '✗ f(R)-f(L) 会漏掉 L 本身；f(R-1)-f(L-1) 会漏掉 R；+1 是错误的常数修正。正确做法是 f(R) - f(L-1)，类比前缀和的区间查询。',
          hint:   '和前缀和区间查询 sum[R] - sum[L-1] 完全类比，f 相当于前缀和。',
        },
        {
          type:  'fill',
          lbl:   '代码',
          title: '✏️ 填空：统计不含数字 4 的数',
          q:     '点击代码中的 [?] 方框选中，再点候选项填入：',
          code:
`// 统计 [1, n] 中各位数字均不含 4 的正整数个数
string num;
int memo[20];  // 只有 pos 这一维（自由状态下后续结果只取决于剩余位数）

int dfs(int pos, bool is_limit, bool is_zero) {
    if (pos == (int)num.size()) {
        // [A] 全部填完，is_zero=true 说明是整数 0，不计入
        return is_zero ? 0 : 1;
    }
    // 自由且非前导零才查 memo
    if (!is_limit && !is_zero && memo[pos] != -1)
        return memo[pos];

    int up = is_limit ? (num[pos] - '0') : 9;
    int res = 0;
    for (int d = 0; d <= up; d++) {
        // [B] 数字 4 不合法，跳过
        if (d == 4) continue;
        bool nxt_limit = is_limit && (d == num[pos] - '0');
        bool nxt_zero  = is_zero && (d == 0);
        res += dfs(pos + 1, nxt_limit, nxt_zero);
    }
    // [C] 只在自由且非前导零时存 memo
    if (!is_limit && !is_zero) memo[pos] = res;
    return res;
}`,
          blanks:  ['A', 'B', 'C'],
          opts: [
            'return is_zero ? 0 : 1;',
            'return is_zero ? 1 : 0;',
            'if (d == 4) continue;',
            'if (d != 4) continue;',
            'if (!is_limit && !is_zero) memo[pos] = res;',
            'memo[pos] = res;',
          ],
          answers: [
            'return is_zero ? 0 : 1;',
            'if (d == 4) continue;',
            'if (!is_limit && !is_zero) memo[pos] = res;',
          ],
          fb_ok:  '✓ A：is_zero=true 对应整数 0，题目要正整数，返回 0。B：枚举每一位时跳过数字 4，满足"不含 4"的条件。C：只在完全自由且非前导零时存 memo，否则会污染受限状态的结果。',
          fb_err: '✗ A：返回值颠倒，is_zero=true 是无效的 0 应返回 0；B：continue 的条件取反，会变成"只保留 4"；C：无条件存 memo 会把受 is_limit 约束的结果误用于自由状态。',
          hint:   '这道题约束很简单（不含 4），memo 只有 pos 一维。注意三处细节：终止条件、跳过 4、存 memo 的条件。',
        },
      ],
    },

    hero: {
      rank: '英雄', coins: 120, xp: 280,
      steps: [
        {
          type:  'concept',
          lbl:   '读题',
          title: '📖 深入理解两个标志位',
          body:
`is_limit 和 is_zero 是数位DP框架的两个核心开关。
英雄关从"为什么这样设计"的角度彻底理解它们，
看清楚如果去掉其中一个会出什么错。`,
          concept:
`is_limit 的本质——上界约束的传播：
  上界数 n = 3572，逐位决策时：
  第 0 位（千位）只有填 3 时，后续位才受限（上界分别为 5、7、2）。
  第 0 位填 1 或 2 时，后续完全自由。
  is_limit 就是在记录"当前路径是否一直贴着上界走"。
  它是一条路径属性，不能被 memo 覆盖，所以贴上界时不入 memo。

is_zero 的本质——有效数字的起点：
  整数 5 在 4 位框架里表示为 0005，前三位是前导零。
  如果不区分前导零，填 0 就会触发"数字 0 出现了"的逻辑，导致 5 被误判为含有 0。
  is_zero=true 时，填 0 意味着"还没开始"，状态保持原样；
  填非零数字时，is_zero 变为 false，有效数字正式开始。
  此外，is_zero 贯穿全程为 true 的路径对应整数 0，计数时返回 0。

两个标志位的关系：
  is_limit 控制"当前位能填多大"；
  is_zero 控制"当前位填 0 是否算真正的 0"。
  二者独立，一个关乎上界，一个关乎前导零，互不干扰。`,
          tip: '📌 把 is_limit 和 is_zero 想成两个独立的"开关"：is_limit 开关控制上界，is_zero 开关控制前导零，每次转移各自独立更新。',
        },
        {
          type:  'choice',
          lbl:   '去掉',
          title: '❓ 选择：如果不使用 is_zero',
          q:
`统计 [1, 100] 中各位数字之和等于 5 的正整数。
如果不使用 is_zero 标志位，直接把前导零的 0 也计入数位和，会出什么问题？`,
          opts: [
            '整数 5 会被当成 005，数位和算成 0+0+5=5，但 05 和 005 也会被分别计入，导致重复计数',
            '整数 5 的数位和会被算成 0，导致漏计',
            '不会有任何问题，前导零不影响数位和',
            '会导致 is_limit 的判断出错',
          ],
          ans:     0,
          fb_ok:  '✓ 不处理前导零时，5、05、005 在三位框架里数位和都等于 5，但它们代表同一个整数 5，会被计数三次。is_zero 的作用就是确保同一个整数只被计数一次。',
          fb_err: '✗ 整数 5 的数位和（1+0+0+5=5 中有效部分）是对的，问题出在"同一个数被多路径计数"而非漏计。不使用 is_zero 会导致重复计数而不是漏计。',
          hint:   '想想整数 5 在 3 位框架里可以走哪几条路径：5、05、005，每条都满足数位和=5，会被计几次？',
        },
        {
          type:  'choice',
          lbl:   '变形',
          title: '❓ 选择：is_limit 和 is_zero 在转移时如何更新',
          q:
`当前位填入数字 d，已知当前 is_limit=true，num[pos]='7'（上界当前位是 7）。
填 d=5 之后，下一位的 is_limit 和 is_zero 分别怎么变？（假设当前 is_zero=false）`,
          opts: [
            'is_limit 变为 false（5 < 7，不再贴上界），is_zero 保持 false（已有非零数字）',
            'is_limit 保持 true，is_zero 保持 false',
            'is_limit 变为 false，is_zero 变为 true',
            'is_limit 变为 true，is_zero 变为 false',
          ],
          ans:     0,
          fb_ok:  '✓ d=5 小于上界 7，所以当前位没有贴紧上界，is_limit 变为 false；is_zero 已经为 false 且 d=5 不是 0，is_zero 继续保持 false。',
          fb_err: '✗ is_limit 的更新规则是 is_limit && (d == up_digit)：5 ≠ 7，结果为 false；is_zero 的更新规则是 is_zero && (d == 0)：is_zero 已经是 false，AND false 结果还是 false。',
          hint:   'is_limit 更新：当前贴着上界 AND 当前填了上界数字，才继续贴。is_zero 更新：之前是前导零 AND 当前填了 0，才继续是前导零。',
        },
        {
          type:  'fill',
          lbl:   '代码',
          title: '✏️ 填空：两个标志位的完整更新',
          q:     '点击代码中的 [?] 方框选中，再点候选项填入：',
          code:
`// 数位DP 框架中，枚举当前位填入 d 时，更新两个标志位
int up = is_limit ? (num[pos] - '0') : 9;

for (int d = 0; d <= up; d++) {
    // [A] is_limit 更新：当前贴上界 AND 填了上界数字，下一位才继续贴
    bool nxt_limit = is_limit && (d == num[pos] - '0');

    // [B] is_zero 更新：之前是前导零 AND 当前填了 0，才继续是前导零
    bool nxt_zero = is_zero && (d == 0);

    // [C] 数位和更新：前导零期间填 0 不计入数位和
    int nxt_sum = (is_zero && d == 0) ? sum : sum + d;

    res += dfs(pos + 1, nxt_sum, nxt_limit, nxt_zero);
}`,
          blanks:  ['A', 'B', 'C'],
          opts: [
            'bool nxt_limit = is_limit && (d == num[pos] - \'0\');',
            'bool nxt_limit = is_limit || (d == num[pos] - \'0\');',
            'bool nxt_zero = is_zero && (d == 0);',
            'bool nxt_zero = is_zero || (d == 0);',
            'int nxt_sum = (is_zero && d == 0) ? sum : sum + d;',
            'int nxt_sum = sum + d;',
          ],
          answers: [
            'bool nxt_limit = is_limit && (d == num[pos] - \'0\');',
            'bool nxt_zero = is_zero && (d == 0);',
            'int nxt_sum = (is_zero && d == 0) ? sum : sum + d;',
          ],
          fb_ok:  '✓ A：AND 运算，两个条件都满足才继续贴上界；OR 会让"之前不贴上界"的路径也误判为贴上界。B：AND 运算，两个条件都满足才继续是前导零；OR 会把"填了 0 但已有有效数字"的情况误判为前导零。C：is_zero && d==0 才是真正的前导零，不计入数位和；否则 0 是真实的数字 0，要加入 sum。',
          fb_err: '✗ A：OR 逻辑错误，会把"当前填了上界数字"的情况都当成贴上界，即使前面已经小于上界；B：OR 逻辑错误，填 0 但前面已有有效数字时不应该重置成前导零；C：直接 sum+d 会把前导零的 0 也计入数位和，导致数如 005 的数位和被算成 5 而不是 5。',
          hint:   '两个标志位都用 AND 更新："继续贴上界"要求之前贴且现在也贴；"继续是前导零"要求之前是前导零且现在填的也是 0。',
        },
      ],
    },
  },
};
