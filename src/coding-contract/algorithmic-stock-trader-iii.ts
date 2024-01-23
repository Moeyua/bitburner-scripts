/**
 * @description Algorithmic Stock Trader III
 * 
 * You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.
 * 
 * You are given the following array of stock prices (which are numbers) where the i-th element represents the stock price on day i:
 * 
 * 197,102,76,114,186,97,13,178,178,85,71,10,93
 * 
 * Determine the maximum possible profit you can earn using at most two transactions. A transaction is defined as buying and then selling one share of the stock. Note that you cannot engage in multiple transactions at once. In other words, you must sell the stock before you buy it again.
 * 
 * If no profit can be made, then the answer should be 0
 * 
 * @param prices 
 * @returns 
 */

function main(prices: number[]): number {
  if (!prices.length) {
      return 0;
  }

  const n = prices.length;
  const max_k = 2;
  const dp: number[][][] = Array.from({length: n}, () => Array.from({length: max_k + 1}, () => Array(2).fill(0)));

  for (let i = 0; i < n; i++) {
      for (let k = max_k; k >= 1; k--) {
          if (i - 1 < 0) {
              /* 处理 base case */
              dp[i][k][0] = 0;
              dp[i][k][1] = -prices[i];
              continue;
          }
          dp[i][k][0] = Math.max(dp[i - 1][k][0], dp[i - 1][k][1] + prices[i]);
          dp[i][k][1] = Math.max(dp[i - 1][k][1], dp[i - 1][k - 1][0] - prices[i]);
      }
  }

  return dp[n - 1][max_k][0];
}

const prices = [197,102,76,114,186,97,13,178,178,85,71,10,93];
console.log(main(prices)); // 输出最大利润
