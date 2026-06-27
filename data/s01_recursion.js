// data/s01_recursion.js
// 章节：S01.递归基础 · 函数调用自身的本质

export const LESSON = {
  id:    'recursion',
  title: 'S01.递归基础',
  sub:   '函数调用自身的本质',

  battles: {

    // ─────────────────────────────────────────
    // 新兵关：理解核心 · 5步（concept + trace + choice×2 + fill）
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
          title:   '递归是什么？',
          body:
`计算 3! = 3 × 2 × 1。
如果用函数 factorial(n) 表示 n 的阶乘，那么：
  factorial(3) = 3 × factorial(2)
  factorial(2) = 2 × factorial(1)
  factorial(1) = 1 × factorial(0)
  factorial(0) = 1   ← 这里不再继续调用，直接给出答案

每一层都把"更大的问题"拆成"更小的同类问题"，直到遇到终止条件为止。`,
          concept:
`递归函数的两个必要组成部分：
1. 终止条件（Base Case）：n == 0 时直接返回 1，不再调用自身。
2. 递归体（Recursive Case）：factorial(n) = n * factorial(n-1)。

写法：
int factorial(int n) {
    if (n == 0) return 1;        // 终止条件
    return n * factorial(n - 1); // 递归体
}`,
          tip: '一定要先写终止条件，否则递归会无限调用直到程序崩溃。',
        },

        // Step 2: trace（新兵关，call_stack，演示 factorial(3)）
        {
          type:  'trace',
          lbl:   '看执行',
          title: '递归调用栈：factorial(3) 全过程',
          body:  `看清楚每一次递归调用怎么压栈、触底后怎么一层层返回。`,
          trace: {
            caption: '演示 factorial(3) 的调用栈展开与回收，共 3 层递归',
            mode: 'call_stack',
            intro: '点"下一步"逐帧观看调用栈的变化，注意每次调用是怎么"记住"当前状态等待返回的。',
            code:
`int factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);
}`,
            frames: [
              {
                id: 'f0', label: '调用 f(3)',
                note: '主程序调用 factorial(3)，压入栈帧，n=3，开始执行。',
                code_line: 1,
                stack: [
                  { fn:'factorial', args:{ n:3 }, state:'active' },
                ],
                ret: null,
                vars: { n:3 },
              },
              {
                id: 'f1', label: '检查终止条件',
                note: 'n=3 不等于 0，不触发 return 1，继续执行第 3 行。',
                code_line: 2,
                stack: [
                  { fn:'factorial', args:{ n:3 }, state:'active' },
                ],
                ret: null,
                vars: { n:3 },
              },
              {
                id: 'f2', label: '调用 f(2)',
                note: '执行 n*factorial(n-1)，先去调用 factorial(2)，当前帧挂起等待。',
                code_line: 3,
                stack: [
                  { fn:'factorial', args:{ n:3 }, state:'waiting' },
                  { fn:'factorial', args:{ n:2 }, state:'active' },
                ],
                ret: null,
                vars: { n:2 },
              },
              {
                id: 'f3', label: '调用 f(1)',
                note: 'factorial(2) 同样不满足终止，继续调用 factorial(1)，再次挂起。',
                code_line: 3,
                stack: [
                  { fn:'factorial', args:{ n:3 }, state:'waiting' },
                  { fn:'factorial', args:{ n:2 }, state:'waiting' },
                  { fn:'factorial', args:{ n:1 }, state:'active' },
                ],
                ret: null,
                vars: { n:1 },
              },
              {
                id: 'f4', label: '调用 f(0)',
                note: 'factorial(1) 调用 factorial(0)，栈已有 4 层，即将触底。',
                code_line: 3,
                stack: [
                  { fn:'factorial', args:{ n:3 }, state:'waiting' },
                  { fn:'factorial', args:{ n:2 }, state:'waiting' },
                  { fn:'factorial', args:{ n:1 }, state:'waiting' },
                  { fn:'factorial', args:{ n:0 }, state:'active' },
                ],
                ret: null,
                vars: { n:0 },
              },
              {
                id: 'f5', label: 'f(0) 返回 1',
                note: 'n=0 满足终止条件，返回 1，栈帧标记为 returned。',
                code_line: 2,
                stack: [
                  { fn:'factorial', args:{ n:3 }, state:'waiting' },
                  { fn:'factorial', args:{ n:2 }, state:'waiting' },
                  { fn:'factorial', args:{ n:1 }, state:'waiting' },
                  { fn:'factorial', args:{ n:0 }, state:'returned' },
                ],
                ret: 1,
                vars: { n:0, result:1 },
              },
              {
                id: 'f6', label: 'f(1) 返回 1',
                note: '拿到 factorial(0)=1，计算 1×1=1，返回，f(0)、f(1) 帧弹出。',
                code_line: 3,
                stack: [
                  { fn:'factorial', args:{ n:3 }, state:'waiting' },
                  { fn:'factorial', args:{ n:2 }, state:'waiting' },
                  { fn:'factorial', args:{ n:1 }, state:'returned' },
                ],
                ret: 1,
                vars: { n:1, result:1 },
              },
              {
                id: 'f7', label: 'f(2) 返回 2',
                note: '拿到 factorial(1)=1，计算 2×1=2，返回，f(2) 弹出栈。',
                code_line: 3,
                stack: [
                  { fn:'factorial', args:{ n:3 }, state:'waiting' },
                  { fn:'factorial', args:{ n:2 }, state:'returned' },
                ],
                ret: 2,
                vars: { n:2, result:2 },
              },
              {
                id: 'f8', label: 'f(3) 返回 6',
                note: '拿到 factorial(2)=2，计算 3×2=6，最终答案 6，调用栈清空。',
                code_line: 3,
                stack: [
                  { fn:'factorial', args:{ n:3 }, state:'returned' },
                ],
                ret: 6,
                vars: { n:3, result:6 },
              },
            ],
          },
        },

        // Step 3: choice 1
        {
          type:  'choice',
          lbl:   '判断',
          title: '终止条件的作用是什么？',
          body:  `下面哪句话最准确地描述了递归终止条件的作用？`,
          opts: [
            '让函数在遇到最小子问题时直接返回结果，不再继续调用自身',
            '让函数在每次调用时打印当前参数值',
            '让函数只运行一次，避免重复计算',
            '让函数在调用栈满时自动清空',
          ],
          answer: 0,
          explain: '终止条件（Base Case）的作用就是：在问题规模缩小到最简单的情况时，直接给出答案而不再递归，从而让整条调用链能够逐层返回。',
        },

        // Step 4: choice 2
        {
          type:  'choice',
          lbl:   '推导',
          title: '手动推导 factorial(4) 的值',
          body:  `根据 factorial(n) = n * factorial(n-1)，factorial(0) = 1，请计算 factorial(4) 等于多少？`,
          opts: [
            '24',
            '12',
            '16',
            '10',
          ],
          answer: 0,
          explain: 'factorial(4) = 4 × factorial(3) = 4 × 3 × factorial(2) = 4 × 3 × 2 × factorial(1) = 4 × 3 × 2 × 1 × factorial(0) = 4×3×2×1×1 = 24。',
        },

        // Step 5: fill
        {
          type:  'fill',
          lbl:   '填代码',
          title: '完成阶乘函数',
          body:  `请补全下面的 C++ 递归函数，使其能正确计算 n 的阶乘。`,
          code:
`int factorial(int n) {
    if (n == ___①___) return ___②___;
    return n * factorial(___③___);
}`,
          blanks: ['①', '②', '③'],
          answer: ['0', '1', 'n - 1'],
          opts: ['0', '1', 'n - 1', 'n', 'n + 1', '-1'],
          explain: '①终止条件判断 n==0；②直接返回 1；③递归体传入 n-1，使问题规模逐步缩小。',
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
          title:   '这段递归代码有什么问题？',
          body:
`某同学写了这样一个"求 n 阶乘"的递归函数：

int factorial(int n) {
    return n * factorial(n - 1);  // 忘写终止条件
}

调用 factorial(3) 后，程序不停地压栈：
  factorial(3) → factorial(2) → factorial(1) → factorial(0) → factorial(-1) → ...
最终程序因栈溢出（Stack Overflow）而崩溃。`,
          concept:
`问题出在哪里？
1. 没有终止条件：函数永远不会停止调用自身，n 一路减到负无穷。
2. 调用栈是有限资源：每次函数调用都占用一块栈内存保存参数和返回地址，栈空间耗尽就会崩溃。

正确写法：先写终止条件，再写递归体。
int factorial(int n) {
    if (n == 0) return 1;        // 必须先判断
    return n * factorial(n - 1);
}

同类错误：把终止条件写反（n != 0 时 return），或终止值写错（return 0 而非 return 1），都会导致错误结果。`,
          tip: '遇到递归就先问自己：什么情况下不需要再递归了？把这个条件写成第一行。',
        },

        // Step 2: trace（锐士关选择不强制加，但此处为搜索章节统一加一个 trace 帮助分析错误）
        {
          type:  'trace',
          lbl:   '看崩溃',
          title: '无终止条件的递归：栈溢出过程',
          body:  `看看缺少终止条件时调用栈会发生什么——栈帧不停叠加直到耗尽。`,
          trace: {
            caption: '演示无终止条件的 factorial(3) 调用，栈帧持续增长直到溢出',
            mode: 'call_stack',
            intro: '注意观察：栈帧数量如何不受控地增长，最终超出系统限制。',
            code:
`int factorial(int n) {
    return n * factorial(n - 1);
}`,
            frames: [
              {
                id: 'e0', label: '调用 f(3)',
                note: '调用 factorial(3)，压入第 1 个栈帧，n=3。',
                code_line: 2,
                stack: [
                  { fn:'factorial', args:{ n:3 }, state:'active' },
                ],
                ret: null,
                vars: { n:3, 栈深:1 },
              },
              {
                id: 'e1', label: '调用 f(2)',
                note: '没有终止条件，直接调用 factorial(2)，压入第 2 个栈帧。',
                code_line: 2,
                stack: [
                  { fn:'factorial', args:{ n:3 }, state:'waiting' },
                  { fn:'factorial', args:{ n:2 }, state:'active' },
                ],
                ret: null,
                vars: { n:2, 栈深:2 },
              },
              {
                id: 'e2', label: '调用 f(1)',
                note: '继续调用 factorial(1)，第 3 个栈帧入栈，仍无法停止。',
                code_line: 2,
                stack: [
                  { fn:'factorial', args:{ n:3 }, state:'waiting' },
                  { fn:'factorial', args:{ n:2 }, state:'waiting' },
                  { fn:'factorial', args:{ n:1 }, state:'active' },
                ],
                ret: null,
                vars: { n:1, 栈深:3 },
              },
              {
                id: 'e3', label: '调用 f(0)',
                note: '调用 factorial(0)，n=0 也没有返回，继续往下调。',
                code_line: 2,
                stack: [
                  { fn:'factorial', args:{ n:3 }, state:'waiting' },
                  { fn:'factorial', args:{ n:2 }, state:'waiting' },
                  { fn:'factorial', args:{ n:1 }, state:'waiting' },
                  { fn:'factorial', args:{ n:0 }, state:'active' },
                ],
                ret: null,
                vars: { n:0, 栈深:4 },
              },
              {
                id: 'e4', label: '调用 f(-1)',
                note: '调用 factorial(-1)，n 已经是负数，仍然不停，栈继续增长。',
                code_line: 2,
                stack: [
                  { fn:'factorial', args:{ n:3 }, state:'waiting' },
                  { fn:'factorial', args:{ n:2 }, state:'waiting' },
                  { fn:'factorial', args:{ n:1 }, state:'waiting' },
                  { fn:'factorial', args:{ n:0 }, state:'waiting' },
                  { fn:'factorial', args:{ n:-1 }, state:'active' },
                ],
                ret: null,
                vars: { n:-1, 栈深:5 },
              },
              {
                id: 'e5', label: '栈溢出崩溃',
                note: '栈帧不断叠加，系统栈空间耗尽，程序报 Stack Overflow 并崩溃。',
                code_line: 2,
                stack: [
                  { fn:'factorial', args:{ n:3 }, state:'waiting' },
                  { fn:'factorial', args:{ n:2 }, state:'waiting' },
                  { fn:'factorial', args:{ n:1 }, state:'waiting' },
                  { fn:'factorial', args:{ n:0 }, state:'waiting' },
                  { fn:'factorial', args:{ n:-1 }, state:'waiting' },
                  { fn:'[Stack Overflow]', args:{}, state:'active' },
                ],
                ret: null,
                vars: { 栈深:'∞', 状态:'程序崩溃' },
              },
            ],
          },
        },

        // Step 3: choice 1
        {
          type:  'choice',
          lbl:   '找错',
          title: '下面哪个终止条件会导致 factorial 计算出错误的结果（不是崩溃，而是答案错）？',
          body:
`假设我们这样写终止条件：
int factorial(int n) {
    if (n == 0) return 0;   // 这里改了返回值
    return n * factorial(n - 1);
}`,
          opts: [
            '对任何 n 都返回 0，因为最终都会乘以 factorial(0)=0',
            '只有 n=0 时结果错，n>0 时仍然正确',
            '程序会崩溃，因为 0 不是合法的返回值',
            '只有奇数 n 才会出错',
          ],
          answer: 0,
          explain: 'factorial(n) 最终会乘以 factorial(0)，若 factorial(0) 返回 0，则整条乘法链结果都是 0，而不是正确的 n!。',
        },

        // Step 4: choice 2
        {
          type:  'choice',
          lbl:   '对比',
          title: '以下两种写法哪个正确？',
          body:
`写法A：
int f(int n) {
    if (n == 1) return 1;
    return n * f(n - 1);
}

写法B：
int f(int n) {
    if (n == 0) return 1;
    return n * f(n - 1);
}

对 n >= 1 的整数，两者结果相同吗？当 n=0 时各返回什么？`,
          opts: [
            '两者对 n>=1 结果相同；n=0 时写法A会无限递归崩溃，写法B返回 1',
            '两者完全等价，结果永远相同',
            '写法A更快，因为终止得早',
            'n=0 时写法B会崩溃，写法A返回正确结果',
          ],
          answer: 0,
          explain: '写法A在 n==1 时停止，n=0 时会继续调用 f(-1) 陷入无限递归。写法B在 n==0 时停止，更安全，也符合 0!=1 的数学定义。',
        },

        // Step 5: fill
        {
          type:  'fill',
          lbl:   '修正',
          title: '修正有问题的递归函数',
          body:
`下面这个求斐波那契数的递归函数，终止条件写错了，修正它：
fib(1)=1, fib(2)=1, fib(n)=fib(n-1)+fib(n-2)`,
          code:
`int fib(int n) {
    if (n ___①___ 2) return ___②___;
    return fib(n - 1) + fib(___③___);
}`,
          blanks: ['①', '②', '③'],
          answer: ['<=', '1', 'n - 2'],
          opts: ['<=', '==', '1', '0', 'n - 2', 'n - 1'],
          explain: '①用 <= 同时覆盖 n=1 和 n=2 两个基础情况；②两个基础情况均返回 1；③递归体第二个子问题为 fib(n-2)。',
        },

      ],
    },

    // ─────────────────────────────────────────
    // 英雄关：换角度巩固 · 侧重栈深限制与尾递归
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
          title:   '递归的天花板：栈深限制与尾递归',
          body:
`如果要计算 factorial(100000)，普通递归会压入 100000 层栈帧，C++ 默认栈大小约 1~8 MB，大概只能支撑几千到几万层，必然栈溢出。

一种改写思路——尾递归（Tail Recursion）：
把"中间结果"作为参数传递，让递归体的最后一个操作恰好是递归调用本身，这样编译器（开启优化时）可以复用当前栈帧，不额外压栈。

尾递归写法：
int factorial_tail(int n, int acc) {
    if (n == 0) return acc;
    return factorial_tail(n - 1, acc * n); // 最后一步只是递归调用
}
// 调用方式：factorial_tail(5, 1)

普通写法最后一步是 n * factorial(n-1)（先递归再乘），编译器必须保留当前帧等结果返回后才能做乘法，所以无法优化。`,
          concept:
`尾递归的两个判断标准：
1. 递归调用是函数体的最后一个操作。
2. 递归调用的返回值直接被返回，外层没有额外计算。

满足以上条件，支持尾调用优化（TCO）的编译器可将栈深 O(n) 压缩到 O(1)。
C++ 需开启 -O2 优化，且不保证所有情况都触发 TCO；函数式语言（Haskell、Scala）通常内置保证。

实际竞赛中，若递归深度超出限制，通常改写为迭代（循环）更稳妥。`,
          tip: '判断是否是尾递归：看最后一行是不是"直接 return 递归调用(…)"，没有任何加减乘除包裹它。',
        },

        // Step 2: trace（英雄关：演示尾递归的栈帧复用概念）
        {
          type:  'trace',
          lbl:   '看优化',
          title: '尾递归：栈帧不再叠加',
          body:  `对比普通递归，尾递归在开启优化时只用一个栈帧来完成所有计算。`,
          trace: {
            caption: '演示 factorial_tail(3, 1) 的尾递归执行，栈帧复用不叠加',
            mode: 'call_stack',
            intro: '注意：尾递归优化后，每次递归调用不会新增一层栈帧，而是更新当前帧的参数继续执行。',
            code:
`int factorial_tail(int n, int acc) {
    if (n == 0) return acc;
    return factorial_tail(n - 1, acc * n);
}`,
            frames: [
              {
                id: 't0', label: '调用 f(3,1)',
                note: '调用 factorial_tail(3, 1)，acc=1 是累积器初始值。',
                code_line: 1,
                stack: [
                  { fn:'factorial_tail', args:{ n:3, acc:1 }, state:'active' },
                ],
                ret: null,
                vars: { n:3, acc:1 },
              },
              {
                id: 't1', label: '复用 → f(2,3)',
                note: 'n!=0，计算新 acc=1×3=3，尾调用优化：复用当前帧，参数更新为 n=2, acc=3。',
                code_line: 3,
                stack: [
                  { fn:'factorial_tail', args:{ n:2, acc:3 }, state:'active' },
                ],
                ret: null,
                vars: { n:2, acc:3 },
              },
              {
                id: 't2', label: '复用 → f(1,6)',
                note: 'n!=0，计算新 acc=3×2=6，再次复用帧，参数更新为 n=1, acc=6。',
                code_line: 3,
                stack: [
                  { fn:'factorial_tail', args:{ n:1, acc:6 }, state:'active' },
                ],
                ret: null,
                vars: { n:1, acc:6 },
              },
              {
                id: 't3', label: '复用 → f(0,6)',
                note: 'n!=0，计算新 acc=6×1=6，复用帧，参数更新为 n=0, acc=6。',
                code_line: 3,
                stack: [
                  { fn:'factorial_tail', args:{ n:0, acc:6 }, state:'active' },
                ],
                ret: null,
                vars: { n:0, acc:6 },
              },
              {
                id: 't4', label: 'n==0，返回 6',
                note: 'n=0 触发终止条件，直接返回 acc=6，整个过程只用了一个栈帧。',
                code_line: 2,
                stack: [
                  { fn:'factorial_tail', args:{ n:0, acc:6 }, state:'returned' },
                ],
                ret: 6,
                vars: { n:0, acc:6, result:6 },
              },
            ],
          },
        },

        // Step 3: choice 1
        {
          type:  'choice',
          lbl:   '判断',
          title: '下面哪个函数是尾递归形式？',
          body:
`函数A：
int sum(int n) {
    if (n == 0) return 0;
    return n + sum(n - 1);
}

函数B：
int sum_tail(int n, int acc) {
    if (n == 0) return acc;
    return sum_tail(n - 1, acc + n);
}`,
          opts: [
            '只有函数B是尾递归，因为递归调用是最后一步且返回值直接被返回',
            '两个都是尾递归',
            '只有函数A是尾递归',
            '两个都不是尾递归',
          ],
          answer: 0,
          explain: '函数A最后一步是 n + sum(n-1)，需要等递归结果返回后再做加法，编译器必须保留当前帧，不是尾递归。函数B最后一步直接 return 递归调用，是尾递归。',
        },

        // Step 4: choice 2
        {
          type:  'choice',
          lbl:   '推广',
          title: '当递归深度极大时，最稳妥的做法是什么？',
          body:
`需要计算 sum(1 + 2 + ... + 1000000)，如果用普通递归，在大多数系统上会栈溢出。下面哪种改法最稳妥、最通用？`,
          opts: [
            '改写为等价的循环迭代，不依赖调用栈',
            '用尾递归，因为所有编译器都保证对尾递归进行优化',
            '直接提高系统栈大小设置，保持递归不变',
            '减小每次递归的参数使调用更快',
          ],
          answer: 0,
          explain: '迭代（循环）不使用调用栈，不存在栈溢出问题，是处理大深度递归的最稳妥方案。尾递归优化依赖编译器支持，C++ 不作保证；修改栈大小治标不治本且不可移植。',
        },

        // Step 5: fill
        {
          type:  'fill',
          lbl:   '改写',
          title: '将普通递归改写为尾递归',
          body:
`下面是普通递归求前 n 项和，请填空完成其尾递归版本。
// 普通版：int sum(int n) { return n==0 ? 0 : n + sum(n-1); }
// 尾递归版：`,
          code:
`int sum_tail(int n, int ___①___) {
    if (n == 0) return ___②___;
    return sum_tail(___③___, acc + n);
}`,
          blanks: ['①', '②', '③'],
          answer: ['acc', 'acc', 'n - 1'],
          opts: ['acc', 'n', '0', 'n - 1', 'n + 1', 'acc + n'],
          explain: '①累积器参数命名为 acc；②终止时返回累积器 acc（已包含所有求和结果）；③递归调用将 n 减 1 继续向下走。',
        },

      ],
    },

  },
};

// [自检] trace frames 验证：
//   新兵关 call_stack：f0~f8 共 9 帧，严格对应 factorial(3) 真实执行顺序：
//     f0调用f(3) → f1检查终止 → f2压f(2) → f3压f(1) → f4压f(0) → f5 f(0)返回1 → f6 f(1)返回1 → f7 f(2)返回2 → f8 f(3)返回6
//     每帧 stack 深度与递归深度完全对应；returned 帧在弹出前一帧标记，下一帧移除，规则3 ✓
//   锐士关 call_stack（崩溃演示）：e0~e5 共 6 帧，展示无终止条件 n 从 3 降到 -1 再到崩溃，帧数合理 ✓
//   英雄关 call_stack（尾递归）：t0~t4 共 5 帧，每帧只有 1 个 active 帧体现"复用"概念，acc 计算 1→3→6→6→返回6 ✓
// [自检] choice 迷惑项覆盖类型：
//   新兵Q1(混淆作用/打印/只运行一次/自动清空) 新兵Q2(正确答案24/乘法错误12/幂16/求和10)
//   锐士Q1(连乘归零/只错一个/崩溃/奇数错) 锐士Q2(正确分析/完全等价/A更快/B崩溃)
//   英雄Q1(正确/两个都是/只有A/都不是) 英雄Q2(迭代/尾递归万能/改栈大小/减参数)
// [自检] 三关 concept 差异化：✓
//   新兵：factorial(3) 具体小例子 + 终止条件/递归体定义
//   锐士：给出缺少终止条件的错误代码段 + 分析为什么崩溃及同类错误
//   英雄：引入"100000 层栈溢出"新场景 + 尾递归概念与判断标准
// [自检] fill opts 无序池确认：✓
//   新兵 opts=['0','1','n - 1','n','n + 1','-1']，6项覆盖3个空各1正1干扰
//   锐士 opts=['<=','==','1','0','n - 2','n - 1']，6项覆盖3个空各1正1干扰
//   英雄 opts=['acc','n','0','n - 1','n + 1','acc + n']，6项覆盖3个空各1正1干扰
