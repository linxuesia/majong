// 测试用户新的扎鸟算分规则
// 用户规则：底分30，扎到两个玩家，总分应该是120
function testNewRule() {
  const baseScore = 30;
  const players = ['自己', '下家', '对家', '上家'];
  
  // 测试用例1：用户新例子，底分30，扎到两个玩家，总分120
  const case1 = {
    baseScore: 30,
    firstBird: '下家',
    secondBird: '下家',
    expected: 120
  };
  
  // 测试用例2：用户之前的例子，底分20，扎到一个自己，一个对家，总分80
  const case2 = {
    baseScore: 20,
    firstBird: '自己',
    secondBird: '对家',
    expected: 80
  };
  
  console.log('=== 测试用户新的扎鸟算分规则 ===');
  
  // 计算测试用例1
  let totalScore1 = 0;
  // 新规则：不管扎到谁，每个玩家都需要给底分？
  // 底分30，4个玩家，总共30*4=120
  totalScore1 = baseScore * 4;
  console.log(`测试用例1：底分${case1.baseScore}，扎到${case1.firstBird}和${case1.secondBird}`);
  console.log(`计算得分：${totalScore1}`);
  console.log(`预期得分：${case1.expected}`);
  console.log(`结果：${totalScore1 === case1.expected ? '✅ 符合规则' : '❌ 不符合规则'}`);
  
  // 计算测试用例2
  let totalScore2 = 0;
  totalScore2 = case2.baseScore * 4;
  console.log(`\n测试用例2：底分${case2.baseScore}，扎到${case2.firstBird}和${case2.secondBird}`);
  console.log(`计算得分：${totalScore2}`);
  console.log(`预期得分：${case2.expected}`);
  console.log(`结果：${totalScore2 === case2.expected ? '✅ 符合规则' : '❌ 不符合规则'}`);
  
  // 另一种可能：扎鸟数量乘以底分乘以玩家数量
  console.log('\n=== 另一种可能：扎鸟数量 × 底分 × 玩家数量 ===');
  totalScore1 = 2 * case1.baseScore * 2; // 2只鸟 × 30底分 × 2个玩家 = 120
  console.log(`测试用例1：2 × 30 × 2 = ${totalScore1}`);
  console.log(`结果：${totalScore1 === case1.expected ? '✅ 符合规则' : '❌ 不符合规则'}`);
  
  totalScore2 = 2 * case2.baseScore * 2; // 2只鸟 × 20底分 × 2个玩家 = 80
  console.log(`测试用例2：2 × 20 × 2 = ${totalScore2}`);
  console.log(`结果：${totalScore2 === case2.expected ? '✅ 符合规则' : '❌ 不符合规则'}`);
}

testNewRule();