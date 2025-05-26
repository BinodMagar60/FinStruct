
module.exports = function weightedLinearRegression(data, key) {
  if (data.length < 2) return null;

  const n = data.length;
  const weights = data.map((_, i) => i + 1); 
  let sumW = 0,
    sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0;

  for (let i = 0; i < n; i++) {
    const x = i + 1;
    const y = data[i][key];
    const w = weights[i];

    sumW += w;
    sumX += w * x;
    sumY += w * y;
    sumXY += w * x * y;
    sumX2 += w * x * x;
  }

  const denominator = sumW * sumX2 - sumX * sumX;
  if (denominator === 0) return null;

  const slope = (sumW * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / sumW;

  const nextX = n + 1;
  const predicted = slope * nextX + intercept;

  return Math.round(predicted);
}


