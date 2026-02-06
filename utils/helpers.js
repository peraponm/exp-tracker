/**
 * Format date to Thai format (DD/MM/YYYY)
 */
function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format date for input field (YYYY-MM-DD)
 */
function formatDateInput(date) {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format currency (Thai Baht)
 */
function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '0.00 บาท';
  return Number(amount).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + ' บาท';
}

/**
 * Calculate summary by period
 */
function calculateSummary(expenses, period = 'daily') {
  const summary = {};
  
  expenses.forEach(expense => {
    const date = new Date(expense.expense_date);
    let key;
    
    if (period === 'daily') {
      key = expense.expense_date;
    } else if (period === 'monthly') {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    } else if (period === 'yearly') {
      key = String(date.getFullYear());
    }
    
    if (!summary[key]) {
      summary[key] = 0;
    }
    summary[key] += expense.amount;
  });
  
  return summary;
}

/**
 * Calculate category breakdown
 */
function getCategoryBreakdown(expenses) {
  const breakdown = {};
  let total = 0;
  
  expenses.forEach(expense => {
    const categoryName = expense.category_name || 'อื่นๆ';
    
    if (!breakdown[categoryName]) {
      breakdown[categoryName] = {
        amount: 0,
        count: 0,
        color: expense.color || '#C7CEEA',
        icon: expense.icon || '📌'
      };
    }
    
    breakdown[categoryName].amount += expense.amount;
    breakdown[categoryName].count += 1;
    total += expense.amount;
  });
  
  // Calculate percentages
  Object.keys(breakdown).forEach(category => {
    breakdown[category].percentage = total > 0 
      ? ((breakdown[category].amount / total) * 100).toFixed(1)
      : 0;
  });
  
  return { breakdown, total };
}

/**
 * Get Thai month name
 */
function getThaiMonthName(monthNumber) {
  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  return months[monthNumber - 1] || '';
}

/**
 * Get current date in YYYY-MM-DD format
 */
function getCurrentDate() {
  const now = new Date();
  return formatDateInput(now);
}

/**
 * Get start and end of current month
 */
function getCurrentMonthRange() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
  
  return {
    start: `${year}-${month}-01`,
    end: `${year}-${month}-${lastDay}`
  };
}

module.exports = {
  formatDate,
  formatDateInput,
  formatCurrency,
  calculateSummary,
  getCategoryBreakdown,
  getThaiMonthName,
  getCurrentDate,
  getCurrentMonthRange
};
