// Calculation functions for Commission Calculator

/**
 * Calculate total sales based on items sold
 * Formula: $45 * locks + $30 * stocks + $25 * barrels
 */
export const calculateSales = (locks: number, stocks: number, barrels: number): number => {
  return 45 * locks + 30 * stocks + 25 * barrels;
};

/**
 * Calculate commission with tiered rates:
 * - 10% on first $1,000
 * - 15% on next $800 ($1,001 to $1,800)
 * - 20% on everything above $1,800
 */
export const calculateCommission = (sales: number): number => {
  let commission = 0;
  
  if (sales <= 1000) {
    commission = sales * 0.10;
  } else if (sales <= 1800) {
    commission = 1000 * 0.10 + (sales - 1000) * 0.15;
  } else {
    commission = 1000 * 0.10 + 800 * 0.15 + (sales - 1800) * 0.20;
  }
  
  return commission;
};
