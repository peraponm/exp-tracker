# # 💰 Expense Tracker

เว็บแอปพลิเคชันสำหรับบันทึกรายจ่ายประจำวัน พัฒนาด้วย Node.js, Express, และ SQLite

## ✨ Features (ฟีเจอร์)

- ✅ บันทึก/แก้ไข/ลบรายจ่าย (CRUD Operations)
- 📂 จัดการหมวดหมู่รายจ่าย (8 หมวดหมู่ที่กำหนดไว้ล่วงหน้า)
- 🔍 กรองรายจ่ายตามวันที่และหมวดหมู่
- 📊 สรุปรายจ่ายตามช่วงเวลา
- 💳 รองรับหลายวิธีการชำระเงิน (เงินสด, บัตรเครดิต, QR Code, ฯลฯ)
- 📱 Responsive Design - ใช้งานได้บนมือถือและคอมพิวเตอร์
- 🎨 UI สวยงามและใช้งานง่าย

## 🛠️ Tech Stack (เทคโนโลยี)

- **Backend:** Node.js + Express.js
- **Frontend:** EJS Templates + Vanilla JavaScript
- **Database:** SQLite (better-sqlite3)
- **Styling:** Custom CSS

## 📋 Prerequisites (สิ่งที่ต้องมี)

- Node.js (version 18.x หรือสูงกว่า)
- npm หรือ yarn

## 🚀 Installation (การติดตั้ง)

1. **Clone repository:**
   ```bash
   git clone https://github.com/peraponm/exp-tracker.git
   cd exp-tracker
   ```

2. **ติดตั้ง dependencies:**
   ```bash
   npm install
   ```

3. **ตั้งค่า environment variables:**
   
   ไฟล์ `.env` ถูกสร้างไว้แล้ว สามารถแก้ไขได้ตามต้องการ:
   ```
   PORT=3000
   DB_PATH=./database/expenses.db
   NODE_ENV=development
   ```

4. **เริ่มใช้งาน:**
   
   **Development mode (พร้อม auto-reload):**
   ```bash
   npm run dev
   ```
   
   **Production mode:**
   ```bash
   npm start
   ```
   
   **Generate documentation:**
   ```bash
   npm run docs:generate
   ```

5. **เปิดเบราว์เซอร์:**
   
   ไปที่ `http://localhost:3000`

## 📁 Project Structure (โครงสร้างโปรเจกต์)

```
exp-tracker/
├── server.js                 # Entry point
├── package.json              # Dependencies และ scripts
├── .env                      # Environment variables
├── .gitignore               # Git ignore rules
├── document/
│   └── Expense_Tracker_Specification.xlsx  # เอกสาร Specification แบบ Excel
├── database/
│   ├── db.js                # Database connection & initialization
│   └── expenses.db          # SQLite database (auto-generated)
├── routes/
│   ├── expenses.js          # Expense CRUD routes
│   └── categories.js        # Category routes
├── views/
│   ├── index.ejs            # Homepage - expense list
│   ├── add-expense.ejs      # Add expense form
│   ├── edit-expense.ejs     # Edit expense form
│   └── summary.ejs          # Summary reports page
├── public/
│   ├── css/
│   │   └── style.css        # Main stylesheet
│   └── js/
│       └── main.js          # Client-side JavaScript
└── utils/
    └── helpers.js           # Utility functions
```

## 📊 Database Schema (โครงสร้างฐานข้อมูล)

### Categories Table
| Column     | Type    | Description           |
|------------|---------|----------------------|
| id         | INTEGER | Primary key          |
| name       | TEXT    | Category name        |
| color      | TEXT    | Display color        |
| icon       | TEXT    | Emoji icon           |
| created_at | DATETIME| Creation timestamp   |

### Expenses Table
| Column         | Type    | Description              |
|----------------|---------|--------------------------|
| id             | INTEGER | Primary key              |
| amount         | REAL    | Expense amount           |
| category_id    | INTEGER | Foreign key to categories|
| description    | TEXT    | Expense description      |
| expense_date   | DATE    | Date of expense          |
| payment_method | TEXT    | Payment method           |
| created_at     | DATETIME| Creation timestamp       |
| updated_at     | DATETIME| Last update timestamp    |

## 🎯 Usage (การใช้งาน)

### เพิ่มรายจ่าย
1. คลิกปุ่ม "เพิ่มรายจ่าย"
2. กรอกข้อมูล: วันที่, จำนวนเงิน, หมวดหมู่, รายละเอียด, วิธีชำระเงิน
3. คลิก "บันทึก"

### ดูรายจ่าย
- หน้าแรกแสดงรายจ่ายทั้งหมดเรียงตามวันที่ล่าสุด
- ใช้ฟิลเตอร์เพื่อค้นหาตามหมวดหมู่และช่วงวันที่

### แก้ไข/ลบรายจ่าย
- คลิกปุ่ม "แก้ไข" เพื่อแก้ไขข้อมูล
- คลิกปุ่ม "ลบ" เพื่อลบรายการ (จะมีการยืนยันก่อนลบ)

### ดูสรุปรายจ่าย
1. คลิกเมนู "สรุปรายจ่าย"
2. เลือกช่วงเวลาที่ต้องการดู
3. ระบบจะแสดง:
   - ยอดรวมทั้งหมด
   - จำนวนรายการ
   - ค่าเฉลี่ยต่อวัน
   - สรุปตามหมวดหมู่พร้อมเปอร์เซ็นต์

## 🔧 Configuration (การตั้งค่า)

### เพิ่มหมวดหมู่ใหม่

แก้ไขในไฟล์ `database/db.js` บรรทัดที่มี array `categories`:

```javascript
const categories = [
  ['ชื่อหมวดหมู่', '#สีในรูปแบบ HEX', 'Emoji'],
  // เพิ่มหมวดหมู่ใหม่ที่นี่
];
```

### เปลี่ยนพอร์ต

แก้ไขในไฟล์ `.env`:
```
PORT=8080
```

## 🤝 Contributing (การมีส่วนร่วม)

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## � Documentation

### Software Specification Document (Excel)
เอกสาร Software Specification ฉบับเต็มอยู่ที่: [document/Expense_Tracker_Specification.xlsx](document/Expense_Tracker_Specification.xlsx)

เอกสารประกอบด้วย:
- Overview & Tech Stack
- Functional Requirements
- Database Schema
- API Routes
- UI Specification
- Installation & Deployment Guide
- Future Improvements & Roadmap

### Software Design Specification (SDS with Mermaid Diagrams)
เอกสาร Technical Design พร้อม Diagrams อยู่ที่: [document/SDS.md](document/SDS.md)

เอกสารประกอบด้วย:
- **System Architecture** - High-level architecture และ Technology stack
- **Database Design** - ER Diagram และ Schema details
- **Application Flow** - User journey diagrams
- **Component Architecture** - Server components และ Directory structure
- **Sequence Diagrams** - Create, Update, Delete, View Summary flows
- **Data Flow Diagrams** - Data processing flows
- **Deployment Architecture** - Development และ Production deployment
- **Security & Performance** - Security measures และ Optimization strategies
- **Error Handling** - Error flow diagrams

## �📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**peraponm** - [GitHub Profile](https://github.com/peraponm)

## 🙏 Acknowledgments

- Icons: Emoji
- Inspired by personal expense tracking needs
- Built with ❤️ using Node.js

---

**Happy Tracking! 💰✨**