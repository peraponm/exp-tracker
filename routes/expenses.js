const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { formatDateInput, getCategoryBreakdown, getCurrentMonthRange, calculateSummary, formatDate, formatCurrency } = require('../utils/helpers');

// GET /analytics - Atomic Design Analytics
router.get('/analytics', (req, res) => {
  try {
    const { start, end } = getCurrentMonthRange();
    
    // Fetch expenses for current month
    const expenses = db.prepare(`
      SELECT e.*, c.name as category_name, c.color, c.icon
      FROM expenses e
      JOIN categories c ON e.category_id = c.id
      WHERE e.expense_date >= ? AND e.expense_date <= ?
      ORDER BY e.expense_date ASC
    `).all(start, end); // Ordered by date ASC for chart
    
    // 1. Daily Trend Data
    const dailySummary = calculateSummary(expenses, 'daily');
    const dailyLabels = Object.keys(dailySummary).map(date => {
        const d = new Date(date);
        return d.getDate(); // Just day number
    });
    const dailyData = Object.values(dailySummary);

    // 2. Category Breakdown
    const { breakdown: breakdownObj, total } = getCategoryBreakdown(expenses);
    const catLabels = Object.keys(breakdownObj);
    const catData = Object.values(breakdownObj).map(b => b.amount);
    const catColors = Object.values(breakdownObj).map(b => b.color);

    // 3. Stats
    const daysCount = dailyLabels.length || 1;
    const dailyAvg = total / daysCount;

    // Max Expense Day
    let maxDay = { date: '', amount: 0 };
    Object.entries(dailySummary).forEach(([date, amount]) => {
      if (amount > maxDay.amount) {
        maxDay = { date, amount };
      }
    });

    // Top Category
    let topCat = { name: 'ไม่มีข้อมูล', amount: 0 };
    Object.entries(breakdownObj).forEach(([name, data]) => {
        if (data.amount > topCat.amount) {
            topCat = { name, amount: data.amount };
        }
    });

    res.render('analytics-atomic', {
      path: '/analytics',
      formatDate,
      formatCurrency,
      dailyAvg,
      daysCount,
      maxExpenseDay: maxDay,
      topCategory: topCat,
      dailyLabels,
      dailyData,
      catLabels,
      catData,
      catColors
    });

  } catch (error) {
    console.error('Error loading analytics:', error);
    res.status(500).send('เกิดข้อผิดพลาดในการโหลดหน้า Analytics');
  }
});

// GET /dashboard - Atomic Design Dashboard
router.get('/dashboard', (req, res) => {
  try {
    const { start, end } = getCurrentMonthRange();
    
    const expenses = db.prepare(`
      SELECT e.*, c.name as category_name, c.color, c.icon
      FROM expenses e
      JOIN categories c ON e.category_id = c.id
      WHERE e.expense_date >= ? AND e.expense_date <= ?
      ORDER BY e.expense_date DESC
    `).all(start, end);
    
    const { breakdown: breakdownObj, total } = getCategoryBreakdown(expenses);
    
    // Convert breakdown object to array for chart
    const breakdown = Object.entries(breakdownObj).map(([name, data]) => ({
      name,
      total: data.amount,
      color: data.color
    }));
    
    res.render('dashboard-atomic', {
      expenses,
      total,
      breakdown,
      path: '/dashboard'
    });
  } catch (error) {
    console.error('Error loading dashboard:', error);
    res.status(500).send('เกิดข้อผิดพลาดในการโหลด Dashboard');
  }
});

// GET / - Homepage: List all expenses
router.get('/', (req, res) => {
  try {
    const { category, start_date, end_date } = req.query;
    
    // Build query with filters
    let query = `
      SELECT e.*, c.name as category_name, c.color, c.icon
      FROM expenses e
      JOIN categories c ON e.category_id = c.id
      WHERE 1=1
    `;
    const params = [];
    
    if (category) {
      query += ' AND c.id = ?';
      params.push(category);
    }
    
    if (start_date) {
      query += ' AND e.expense_date >= ?';
      params.push(start_date);
    }
    
    if (end_date) {
      query += ' AND e.expense_date <= ?';
      params.push(end_date);
    }
    
    query += ' ORDER BY e.expense_date DESC, e.created_at DESC';
    
    const expenses = db.prepare(query).all(...params);
    const categories = db.prepare('SELECT * FROM categories ORDER BY name').all();
    
    // Calculate total
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    res.render('index', { 
      expenses, 
      categories,
      total,
      filters: { category, start_date, end_date }
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
  }
});

// GET /expenses/add - Show add expense form
router.get('/expenses/add', (req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM categories ORDER BY name').all();
    res.render('add-expense', { categories });
  } catch (error) {
    console.error('Error loading add form:', error);
    res.status(500).send('เกิดข้อผิดพลาดในการโหลดฟอร์ม');
  }
});

// POST /expenses - Create new expense
router.post('/expenses', (req, res) => {
  try {
    const { amount, category_id, description, expense_date, payment_method } = req.body;
    
    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).send('กรุณาระบุจำนวนเงินที่ถูกต้อง');
    }
    if (!category_id) {
      return res.status(400).send('กรุณาเลือกหมวดหมู่');
    }
    if (!expense_date) {
      return res.status(400).send('กรุณาระบุวันที่');
    }
    
    // Insert expense
    const stmt = db.prepare(`
      INSERT INTO expenses (amount, category_id, description, expense_date, payment_method)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run(amount, category_id, description || '', expense_date, payment_method || 'เงินสด');
    
    res.redirect('/?success=added');
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).send('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
  }
});

// GET /expenses/:id/edit - Show edit expense form
router.get('/expenses/:id/edit', (req, res) => {
  try {
    const { id } = req.params;
    
    const expense = db.prepare(`
      SELECT e.*, c.name as category_name
      FROM expenses e
      JOIN categories c ON e.category_id = c.id
      WHERE e.id = ?
    `).get(id);
    
    if (!expense) {
      return res.status(404).send('ไม่พบรายการนี้');
    }
    
    // Format date for input field
    expense.expense_date = formatDateInput(expense.expense_date);
    
    const categories = db.prepare('SELECT * FROM categories ORDER BY name').all();
    
    res.render('edit-expense', { expense, categories });
  } catch (error) {
    console.error('Error loading edit form:', error);
    res.status(500).send('เกิดข้อผิดพลาดในการโหลดฟอร์ม');
  }
});

// PUT /expenses/:id - Update expense
router.put('/expenses/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category_id, description, expense_date, payment_method } = req.body;
    
    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).send('กรุณาระบุจำนวนเงินที่ถูกต้อง');
    }
    if (!category_id) {
      return res.status(400).send('กรุณาเลือกหมวดหมู่');
    }
    if (!expense_date) {
      return res.status(400).send('กรุณาระบุวันที่');
    }
    
    // Update expense
    const stmt = db.prepare(`
      UPDATE expenses 
      SET amount = ?, category_id = ?, description = ?, expense_date = ?, 
          payment_method = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    const result = stmt.run(amount, category_id, description || '', expense_date, payment_method || 'เงินสด', id);
    
    if (result.changes === 0) {
      return res.status(404).send('ไม่พบรายการนี้');
    }
    
    res.redirect('/?success=updated');
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).send('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
  }
});

// DELETE /expenses/:id - Delete expense
router.delete('/expenses/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const stmt = db.prepare('DELETE FROM expenses WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
      return res.status(404).send('ไม่พบรายการนี้');
    }
    
    res.redirect('/?success=deleted');
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).send('เกิดข้อผิดพลาดในการลบข้อมูล');
  }
});

// GET /expenses/summary - Show summary page
router.get('/expenses/summary', (req, res) => {
  try {
    const { start_date, end_date, period } = req.query;
    const currentPeriod = period || 'monthly';
    
    // Get date range (default to current month)
    const monthRange = getCurrentMonthRange();
    const startDate = start_date || monthRange.start;
    const endDate = end_date || monthRange.end;
    
    // Fetch expenses in date range
    const expenses = db.prepare(`
      SELECT e.*, c.name as category_name, c.color, c.icon
      FROM expenses e
      JOIN categories c ON e.category_id = c.id
      WHERE e.expense_date BETWEEN ? AND ?
      ORDER BY e.expense_date DESC
    `).all(startDate, endDate);
    
    // Calculate category breakdown
    const { breakdown, total } = getCategoryBreakdown(expenses);
    
    // Sort breakdown by amount (descending)
    const sortedBreakdown = Object.entries(breakdown)
      .sort((a, b) => b[1].amount - a[1].amount)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
    
    res.render('summary', {
      expenses,
      breakdown: sortedBreakdown,
      total,
      period: currentPeriod,
      filters: { start_date: startDate, end_date: endDate }
    });
  } catch (error) {
    console.error('Error loading summary:', error);
    res.status(500).send('เกิดข้อผิดพลาดในการโหลดสรุป');
  }
});

module.exports = router;
