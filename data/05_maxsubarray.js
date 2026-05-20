// data/maxsubarray.js
// 章节：最大连续子段和 · Kadane
// 规范：SKILL_v0.1_Data_Separation.md

export const LESSON = {
  id:           'maxsubarray',
  title:        '最大连续子段和',
  sub:          'Kadane',
  battles: {
  new:{rank:'新兵',mbCls:'mb-n',coins:50,xp:120,steps:[
    {type:'concept',lbl:'读题',title:'📖 理解问题：最大连续子段和',
      body:`给定一个整数数组（含负数），找出一个连续子数组，使其元素之和最大，返回该最大值。

示例：arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
答案 = 6，对应子数组 [4, -1, 2, 1]`,
      concept:`核心：Kadane 算法

定义 dp[i] = "以 arr[i] 结尾的子数组的最大和"

转移规则：
  若 dp[i-1] > 0 → 带上前面，dp[i] = dp[i-1] + arr[i]
  若 dp[i-1] ≤ 0 → 重新开始，dp[i] = arr[i]

合并写法：dp[i] = max(dp[i-1] + arr[i], arr[i])

最终答案 = max(所有 dp[i])`,
      table:[
        ['下标 i','0','1','2','3','4','5','6','7','8'],
        ['arr[i]','-2','1','-3','4','-1','2','1','-5','4'],
        ['dp[i]','-2','1','-2','4','3','5','6','1','5'],
      ],
      tip:'📌 重点：dp[3]=4，不是 dp[2]+arr[3]=-2+4=2。因为 dp[2]=-2<0，前面是累赘，从 arr[3]=4 重新开始！'
    },
    {type:'choice',lbl:'核心',title:'❓ 选择：何时重新开始？',
      q:`计算 dp[i] 时，什么情况下应该"丢弃前面，从 arr[i] 重新开始"？`,
      opts:[
        'arr[i] < 0 时（当前元素是负数）',
        'dp[i-1] ≤ 0 时（前面的累计和是负担）',
        'i 是偶数时（规律性重置）',
        'arr[i] < arr[i-1] 时（当前比前一个元素小）'
      ],
      ans:1,
      fb_ok:'✓ 正确！当 dp[i-1] ≤ 0 时，前面的累计和只会拖累我们，不如从 arr[i] 单独重新开始！',
      fb_err:'✗ 不是判断 arr[i] 本身，而是判断 dp[i-1]（前面积累的结果）。负的累计和带上只会越来越小。',
      hint:'举例：dp[i-1]=-3，arr[i]=4。带上前面：-3+4=1，不带：4。当然选 4，所以重新开始！'
    },
    {type:'choice',lbl:'推导',title:'❓ 选择：手动推导 dp 值',
      q:`arr = [1, -2, 3, 10, -4, 7, 2, -5]
dp[0]=1，dp[1]=max(1-2,-2)=-1，dp[2]=max(-1+3,3)=3
请问 dp[3] 等于多少？`,
      opts:['11','12','13','10'],
      ans:2,
      fb_ok:'✓ 漂亮！dp[3] = max(dp[2]+arr[3], arr[3]) = max(3+10, 10) = max(13, 10) = 13！',
      fb_err:'✗ dp[3] = max(dp[2]+arr[3], arr[3]) = max(3+10, 10) = 13，带上前面的 3 更划算。',
      hint:'dp[2]=3>0，所以带上前面：dp[3] = dp[2] + arr[3] = 3 + 10 = 13。'
    },
    {type:'fill',lbl:'代码',title:'✏️ 填空：Kadane 算法 C++ 代码',
      q:'点击代码中的 [?] 方框选中（出现黄色高亮），再点下方候选项填入：',
      code:`int maxSubArray(vector<int>& a) {
    int dp = a[0];        // 以a[i]结尾的最大子数组和
    int ans = a[0];       // 全局最大值
    for (int i = 1; i < (int)a.size(); i++) {
        dp = [A];         // 核心转移：带上 or 重新开始
        ans = [B];        // 用当前dp更新全局最大
    }
    return ans;
}`,
      blanks:['A','B'],
      opts:['max(dp + a[i], a[i])','max(dp, a[i])','dp + a[i]','max(ans, dp)','min(ans, dp)','ans + dp'],
      answers:['max(dp + a[i], a[i])','max(ans, dp)'],
      fb_ok:'✓ 满分！dp=max(dp+a[i],a[i]) 是核心转移，ans=max(ans,dp) 记录全局最大，简洁又高效！',
      fb_err:'✗ A 填 max(dp+a[i],a[i])（决定带上还是重新开始），B 填 max(ans,dp)（用每次的dp更新全局最大）。',
      hint:'A：两种方案取较大值。B：每一步都用当前 dp 和历史最大 ans 比较，保留较大的那个。'
    }
  ]},

  pro:{rank:'锐士',mbCls:'mb-p',coins:80,xp:200,steps:[
    {type:'concept',lbl:'陷阱',title:'📖 进阶：全负数与初始值陷阱',
      body:`锐士关重点：当数组全部是负数时，Kadane 算法能正确处理吗？
答案是能——但初始值写错就会出现 Bug！`,
      concept:`全负数示例：arr = [-3, -1, -4, -2]
正确答案：最大子段和 = -1（绝对不能返回 0！）

常见 Bug ——把 ans 初始化为 0：
  全负数时，每个 dp[i] 都是负数
  max(0, 所有负数) 会错误地返回 0
  但题目要求子数组至少含一个元素，空数组不合法！

正确做法：
  ans = a[0]（从第一个元素开始，不能用 0）
  dp  = a[0]（同样从 a[0] 开始）
  循环从 i = 1 开始`,
      table:[
        ['i','0','1','2','3'],
        ['arr[i]','-3','-1','-4','-2'],
        ['dp[i]','-3','-1','-5','-3'],
        ['ans更新','-3','-1','-1','-1'],
      ],
      tip:'📌 全负数时 dp 始终为负，ans 追踪所有 dp[i] 中最大的那个（即"最小的负数"）。结果是 -1，不是 0。'
    },
    {type:'choice',lbl:'陷阱',title:'❓ 选择：找出有 Bug 的写法',
      q:`arr = [-5, -1, -3]，最大子段和应为 -1。
哪种初始化方式存在 Bug？`,
      opts:[
        'int ans = a[0];  // 从首元素开始，正确',
        'int ans = 0;  // Bug！全负数时会错误返回 0',
        'int ans = a[0]; 循环从 i=1 开始  // 正确',
        'int dp = a[0], ans = a[0];  // 正确'
      ],
      ans:1,
      fb_ok:'✓ 正确！ans=0 是经典 Bug。题目要求"至少选一个元素"，全负数答案是 -1 而不是 0！',
      fb_err:'✗ 注意 B：ans=0 时，全负数情况下所有 dp[i] 都是负数，max(0, 负数) 返回 0，但空子数组不合法。',
      hint:'题目说连续子数组必须至少含一个元素。所以即使全负数，也要从中选最大的负数，答案不会是 0。'
    },
    {type:'choice',lbl:'对比',title:'❓ 选择：两种写法哪个正确？',
      q:`写法 A：int dp=0, ans=0; for(i=0..n-1): dp=max(dp+a[i],a[i]); ans=max(ans,dp);
写法 B：int dp=a[0], ans=a[0]; for(i=1..n-1): dp=max(dp+a[i],a[i]); ans=max(ans,dp);

全负数数组 [-2,-3,-1] 时，哪种写法能返回正确结果 -1？`,
      opts:[
        '只有写法 A 正确',
        '只有写法 B 正确',
        '两种写法都正确',
        '两种写法都有问题'
      ],
      ans:1,
      fb_ok:'✓ 正确！写法 B 初始化为 a[0]，能正确处理全负数，返回 -1。写法 A 初始 ans=0，会错误返回 0。',
      fb_err:'✗ 写法 A 的 bug：ans=0。全负数时所有 dp 都是负数，max(0,负数) 返回 0，是错误的。写法 B 正确。',
      hint:'关键区别：A 从 0 开始，B 从 a[0] 开始。全负数时，谁会错误地保留那个 0？'
    },
    {type:'fill',lbl:'代码',title:'✏️ 填空：正确处理全负数的完整版',
      q:'补全能正确处理全负数数组的 Kadane 完整版代码：',
      code:`int maxSubArray(vector<int>& a) {
    int dp = [A];         // 不能是 0，从第一个元素开始
    int ans = [B];        // 同样不能是 0
    for (int i = 1; i < (int)a.size(); i++) {
        dp = max(dp + a[i], a[i]);
        ans = [C];        // 只跟自己的历史最大比，不跟 0 比
    }
    return ans;
}`,
      blanks:['A','B','C'],
      opts:['a[0]','0','INT_MIN','max(ans, dp)','max(ans, 0)','dp'],
      answers:['a[0]','a[0]','max(ans, dp)'],
      fb_ok:'✓ 完美！A 和 B 都填 a[0]（绝不是 0），C 填 max(ans,dp)（只跟历史最大比），全负数也能正确处理！',
      fb_err:'✗ A 和 B 都填 a[0]，不能是 0。C 填 max(ans,dp)，绝对不能写 max(ans,0)，那样全负数时会出错。',
      hint:'A 和 B 都填 a[0]，让循环从第二个元素开始处理。C 写 max(ans,dp)，不要和 0 比较。'
    }
  ]},

  hero:{rank:'英雄',mbCls:'mb-h',coins:120,xp:280,steps:[
    {type:'concept',lbl:'综合',title:'📖 英雄：综合练习——记录子数组位置',
      body:`英雄关加强题：不只要返回最大和的值，还要记录最大子数组的起始和结束下标。

示例：arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
最大和 = 6，起始下标 = 3，结束下标 = 6（子数组 [4,-1,2,1]）`,
      concept:`在 Kadane 基础上，额外维护三个变量：

  start     → 当前子数组的起始下标（临时）
  best_l    → 全局最大子数组的左端点
  best_r    → 全局最大子数组的右端点

更新规则：
  当 dp[i-1] ≤ 0 时（重新开始）→ start = i
  当 dp[i] > ans 时（找到新最大）→ best_l = start，best_r = i，ans = dp[i]`,
      table:[
        ['i','0','1','2','3','4','5','6','7','8'],
        ['arr[i]','-2','1','-3','4','-1','2','1','-5','4'],
        ['dp[i]','-2','1','-2','4','3','5','6','1','5'],
        ['start','0','1','2','3','3','3','3','7','8'],
        ['best_l','0','1','1','3','3','3','3','3','3'],
        ['best_r','0','1','1','3','3','5','6','6','6'],
      ],
      tip:'📌 当 dp 重置时 start 更新，当 dp > ans 时才更新 best_l 和 best_r。最终 best_r=6，best_l=3。'
    },
    {type:'choice',lbl:'位置',title:'❓ 选择：什么时候更新 best_l 和 best_r？',
      q:`在记录子数组位置的版本中，best_l 和 best_r 应该在什么时候更新？`,
      opts:[
        '每次进入循环都更新',
        '只有找到新的全局最大值时（dp > ans）才更新',
        '每次 start 发生变化时就更新',
        '循环结束后统一计算'
      ],
      ans:1,
      fb_ok:'✓ 正确！只有当前 dp[i] 超过历史最大 ans 时，才说明找到了新的最优子数组，此时更新 best_l = start, best_r = i。',
      fb_err:'✗ 每次循环都更新会导致 best_r 始终指向最后一个元素。只有 dp > ans 时，才真正找到了新的最大子数组。',
      hint:'best_l 和 best_r 记录"目前为止最优子数组"的边界，只有找到更优结果时才需要更新。'
    },
    {type:'choice',lbl:'重置',title:'❓ 选择：start 什么时候重置？',
      q:`以下代码片段中，start 的更新逻辑哪个是正确的？
（start 表示当前子数组的候选起始位置）`,
      opts:[
        'if (dp < 0) start = i;  // dp变负时重置',
        'if (dp <= 0) start = i + 1;  // dp非正时，下一个才是新起点',
        'if (a[i] < 0) start = i;  // 元素为负时重置',
        'start = i;  // 每次都重置'
      ],
      ans:1,
      fb_ok:'✓ 精准！当 dp[i] ≤ 0 时，当前子数组已经是累赘，下一步 i+1 才是新子数组的起始位置，所以 start = i+1。',
      fb_err:'✗ 选 B。当 dp[i]≤0 时，下一个元素 i+1 才是新子数组的候选起点（不是 i 本身，因为 i 已经被丢弃了）。',
      hint:'重新开始是在"处理完 i"之后——dp[i] 被丢弃，所以新的候选起点是 i+1，在下一轮循环生效。'
    },
    {type:'fill',lbl:'代码',title:'✏️ 填空：记录起止位置的 Kadane',
      q:'在基础 Kadane 上新增位置追踪，补全关键逻辑：',
      code:`int maxSubArray(vector<int>& a, int& L, int& R) {
    int dp = a[0], ans = a[0];
    int start = 0;
    L = 0; R = 0;
    for (int i = 1; i < (int)a.size(); i++) {
        if (dp <= 0) {
            dp = a[i];
            start = [A];   // 重新开始，候选起点更新
        } else {
            dp = dp + a[i];
        }
        if (dp > ans) {
            ans = dp;
            L = [B];       // 记录当前最优子数组左端点
            R = [C];       // 记录当前最优子数组右端点
        }
    }
    return ans;
}`,
      blanks:['A','B','C'],
      opts:['i','i-1','start','i+1','L','R'],
      answers:['i','start','i'],
      fb_ok:'✓ 英雄满分！A=i（新起点就是当前位置），B=start（记录候选起点），C=i（当前位置即右端点），三个位置变量配合完美！',
      fb_err:'✗ A 填 i（dp 重置后新起点就是当前 i），B 填 start（找到更大值时，左端点 = 当前候选起点），C 填 i（右端点 = 当前位置）。',
      hint:'A：重新开始，当前 i 就是新的候选起点。B：找到新最大时，左端 = start（已记录的候选起点）。C：右端 = 当前 i。'
    }
  ]}
}
};
