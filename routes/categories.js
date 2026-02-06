const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/categories - Get all categories
router.get('/api/categories', (req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM categories ORDER BY name').all();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่' });
  }
});

// POST /api/categories - Create new category (optional feature)
router.post('/api/categories', (req, res) => {
  try {
    const { name, color, icon } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'กรุณาระบุชื่อหมวดหมู่' });
    }
    
    const stmt = db.prepare(
      'INSERT INTO categories (name, color, icon) VALUES (?, ?, ?)'
    );
    
    const result = stmt.run(
      name, 
      color || '#C7CEEA', 
      icon || '📌'
    );
    
    res.json({ 
      success: true, 
      id: result.lastInsertRowid,
      message: 'เพิ่มหมวดหมู่สำเร็จ'
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'มีหมวดหมู่นี้อยู่แล้ว' });
    }
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการสร้างหมวดหมู่' });
  }
});

module.exports = router;
