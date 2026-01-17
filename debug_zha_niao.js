// 调试扎鸟算分选项生成问题
function debugZhaNiaoOptions() {
  // 模拟用户截图中的情况：底分30，扎到2号（下家）和6号（下家）
  const baseScore = 30;
  const firstBird = '2';
  const secondBird = '6';
  
  const mapping = {
    '1': '自己', '2': '下家', '3': '对家', '4': '上家',
    '5': '自己', '6': '下家', '7': '对家', '8': '上家',
    '9': '自己'
  };
  
  const firstWho = mapping[firstBird];
  const secondWho = mapping[secondBird];
  
  let totalScore = 0;
  if (firstWho === '自己') {
    totalScore += baseScore * 3;
  } else {
    totalScore += baseScore * 1;
  }
  if (secondWho === '自己') {
    totalScore += baseScore * 3;
  } else {
    totalScore += baseScore * 1;
  }
  
  console.log('=== 调试信息 ===');
  console.log(`底分：${baseScore}`);
  console.log(`扎到：${firstBird}号（${firstWho}）和${secondBird}号（${secondWho}）`);
  console.log(`正确答案：${totalScore}`);
  
  // 问题所在：选项生成逻辑
  const options = [totalScore, baseScore * 2, baseScore * 4];
  console.log(`生成的选项：${options}`);
  console.log(`是否有重复：${new Set(options).size !== options.length}`);
  console.log(`正确答案是否在选项中：${options.includes(totalScore)}`);
  
  // 计算各种情况下的选项
  const testCases = [
    // 两个鸟都扎到自己
    {
      firstWho: '自己',
      secondWho: '自己',
      baseScore: 30
    },
    // 两个鸟都扎到不同的玩家
    {
      firstWho: '下家',
      secondWho: '对家',
      baseScore: 30
    },
    // 一个扎到自己，一个扎到其他玩家
    {
      firstWho: '自己',
      secondWho: '下家',
      baseScore: 30
    }
  ];
  
  console.log('\n=== 各种情况测试 ===');
  testCases.forEach((testCase, index) => {
    let testTotalScore = 0;
    if (testCase.firstWho === '自己') {
      testTotalScore += testCase.baseScore * 3;
    } else {
      testTotalScore += testCase.baseScore * 1;
    }
    if (testCase.secondWho === '自己') {
      testTotalScore += testCase.baseScore * 3;
    } else {
      testTotalScore += testCase.baseScore * 1;
    }
    
    const testOptions = [testTotalScore, testCase.baseScore * 2, testCase.baseScore * 4];
    console.log(`\n测试用例${index + 1}：`);
    console.log(`扎到：${testCase.firstWho} 和 ${testCase.secondWho}`);
    console.log(`底分：${testCase.baseScore}`);
    console.log(`正确答案：${testTotalScore}`);
    console.log(`生成的选项：${testOptions}`);
    console.log(`是否有重复：${new Set(testOptions).size !== testOptions.length}`);
  });
}

debugZhaNiaoOptions();