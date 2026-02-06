# Project Guidelines

## Code Style

**Language**: Thai-first application - all UI text, error messages, and comments should be in Thai. English is acceptable for technical variable/function names.

**Module System**: CommonJS (`require`/`module.exports`) - not ES modules. See [server.js](../server.js#L1-L3).

**Database**: Synchronous API only - better-sqlite3 uses blocking calls throughout. No async/await or Promises. See [database/db.js](../database/db.js#L7-L8).

**Formatting**:
- 2-space indentation
- No semicolons required but used consistently
- Thai strings with emoji prefixes for labels: `'💰 Expense Tracker'`, `'🍜 อาหาร'`
- Date format: DD/MM/YYYY for display, YYYY-MM-DD for inputs ([utils/helpers.js](../utils/helpers.js#L3-L22))
- Currency format: Thai locale with "บาท" suffix ([utils/helpers.js](../utils/helpers.js#L27-L33))

**Client-side**: Vanilla JavaScript only - no frameworks, libraries, or jQuery. See [public/js/main.js](../public/js/main.js).

## Architecture

**Structure**: MVC-like without Models layer
- **Routes** ([routes/](../routes/)): Handle both controller logic AND direct database queries - no separation
- **Views** ([views/](../views/)): EJS templates with server-side rendering only
- **Database** ([database/db.js](../database/db.js)): Single shared connection, self-initializes on require

**Data Flow**:
1. Request → Route handler
2. Route queries database directly using prepared statements
3. Route renders EJS view with data OR redirects with query string flag
4. View accesses helper functions via `app.locals` ([server.js](../server.js#L26-L29))

**Key Pattern**: No abstraction layers between routes and database. Query inline where needed.

## Build and Test

**Installation**:
```bash
npm install
```

**Development** (with auto-reload via nodemon):
```bash
npm run dev
```

**Production**:
```bash
npm start
```

**Generate Documentation**:
```bash
npm run docs:generate
```

**Access**: Open `http://localhost:3000` after starting server.

**Database**: Auto-created at `./database/expenses.db` on first run - no manual setup needed.

## Project Conventions

### Error Handling

**Pattern**: Inline try-catch in every route - no centralized middleware except catch-all at bottom.
```javascript
router.get('/', (req, res) => {
  try {
    // Route logic here
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
  }
});
```

**Error messages**: Always Thai, sent as plain strings with status codes. See [routes/expenses.js](../routes/expenses.js#L71-L81).

### Validation

**Approach**: Minimal inline validation - no validation libraries.
- HTML5 form attributes (`required`, `min`, `step`) in views
- Basic server-side checks in route handlers
- Database constraints (`CHECK`, `FOREIGN KEY`) for data integrity

Example: [routes/expenses.js](../routes/expenses.js#L71-L81)

### Database Queries

**Use prepared statements** for all queries:
```javascript
const stmt = db.prepare('SELECT * FROM expenses WHERE id = ?');
const expense = stmt.get(id);
```

**Dynamic filters** use "WHERE 1=1" pattern:
```javascript
let query = 'SELECT ... WHERE 1=1';
const params = [];
if (category) {
  query += ' AND category_id = ?';
  params.push(category);
}
db.prepare(query).all(...params);
```

**Transactions** for bulk operations only: [database/db.js](../database/db.js#L59-L67)

### View Rendering

**Helper functions**: Available globally in all EJS templates via `app.locals`. Call directly without prefix:
```html
<%= formatCurrency(expense.amount) %>
<%= formatDate(expense.expense_date) %>
<%= getThaiMonthName(month) %>
```

**Success messages**: Pass via query string after redirects:
```javascript
res.redirect('/?success=added'); // In route
```
```html
<% if (success === 'added') { %>  <!-- In view -->
  <div class="alert alert-success">✅ เพิ่มรายจ่ายสำเร็จ</div>
<% } %>
```

**Dynamic styling**: Use inline styles for category colors ([views/index.ejs](../views/index.ejs#L112-L114)).

### Routing

**Pattern**: RESTful-like but not pure REST
- `GET /` - List view (homepage)
- `GET /expenses/add` - Form view
- `POST /expenses` - Create
- `GET /expenses/:id/edit` - Edit form
- `PUT /expenses/:id` - Update (via method-override)
- `DELETE /expenses/:id` - Delete (via method-override)

**Method override**: Required for PUT/DELETE - use `?_method=PUT` in forms ([server.js](../server.js#L33)).

**Filters**: Pass as query params: `?category=1&start_date=2026-01-01&end_date=2026-01-31`

### Hardcoded Business Data

**Categories**: Seeded once on first run - 8 predefined categories in [database/db.js](../database/db.js#L50-L57). Users can add more via API.

**Payment methods**: Hardcoded in form views - not database-backed ([views/add-expense.ejs](../views/add-expense.ejs#L59-L65)):
- เงินสด (Cash - default)
- บัตรเครดิต (Credit Card)
- โอนเงิน (Bank Transfer)
- QR Code
- อื่นๆ (Other)

To add payment methods, edit the `<select>` options in both add-expense.ejs and edit-expense.ejs.

## Integration Points

### Database Schema

**Tables**:
- `categories`: Predefined expense categories (seeded automatically)
- `expenses`: Individual expense records with foreign key to categories

**Key constraints**:
- Foreign keys enabled: `ON DELETE RESTRICT` prevents deleting used categories
- Amount check: `amount > 0`
- Indexes on `expense_date` and `category_id`

See full schema: [database/db.js](../database/db.js#L13-L39)

### Environment Variables

Configure in `.env` file:
```
PORT=3000
DB_PATH=./database/expenses.db
NODE_ENV=development
```

Accessed directly with `process.env.PORT` - no config abstraction.

### View Data Flow

Routes pass data objects to EJS:
```javascript
res.render('index', { 
  expenses,      // Array of expense records
  categories,    // Array of all categories
  total,         // Calculated sum
  filters        // Current filter values for form pre-population
});
```

EJS templates expect these specific variable names.

## Security

**No authentication** - single-user application. Any visitor can view/modify all data.

**SQL injection protection**: All database queries use prepared statements with parameter binding.

**XSS protection**: EJS auto-escapes output by default. Use `<%-` only for trusted content.

**Form validation**: Minimal - relies mainly on HTML5 client-side validation. Server validation is basic presence/type checking.

**Sensitive data**: None - application tracks expense data only, no passwords or personal information.

---

**New to this project?** Start by running `npm install && npm run dev`, then view the running app at http://localhost:3000 to understand the UI flow before modifying code.
