const Database = require('better-sqlite3');
const path = require('path');

// Database path
const dbPath = process.env.DB_PATH || path.join(__dirname, 'expenses.db');

// Create database connection
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
function initializeDatabase() {
  // Create categories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      color TEXT NOT NULL,
      icon TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create expenses table
  db.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL CHECK(amount > 0),
      category_id INTEGER NOT NULL,
      description TEXT,
      expense_date DATE NOT NULL,
      payment_method TEXT DEFAULT 'เงินสด',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
    )
  `);

  // Create indexes for better query performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_expense_date ON expenses(expense_date);
    CREATE INDEX IF NOT EXISTS idx_category_id ON expenses(category_id);
  `);

  // Insert predefined categories if table is empty
  const count = db.prepare('SELECT COUNT(*) as count FROM categories').get();
  
  if (count.count === 0) {
    const insertCategory = db.prepare(
      'INSERT INTO categories (name, color, icon) VALUES (?, ?, ?)'
    );

    const categories = [
      ['อาหาร', '#FF6B6B', '🍜'],
      ['เดินทาง', '#4ECDC4', '🚗'],
      ['ช้อปปิ้ง', '#FFD93D', '🛍️'],
      ['ความบันเทิง', '#95E1D3', '🎬'],
      ['สาธารณูปโภค', '#F38181', '💡'],
      ['สุขภาพ', '#AA96DA', '💊'],
      ['การศึกษา', '#6BCB77', '📚'],
      ['อื่นๆ', '#C7CEEA', '📌']
    ];

    const insertMany = db.transaction((cats) => {
      for (const cat of cats) {
        insertCategory.run(cat);
      }
    });

    insertMany(categories);
    console.log('✅ Predefined categories inserted');
  }

  console.log('✅ Database initialized successfully');
}

// Initialize database on first load
initializeDatabase();

// Export database instance
module.exports = db;
