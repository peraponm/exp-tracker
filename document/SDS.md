# Software Design Specification (SDS)
## Expense Tracker - Daily Expense Tracking Web Application

**Version:** 1.0.0  
**Date:** February 6, 2026  
**Repository:** https://github.com/peraponm/exp-tracker

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Database Design](#2-database-design)
3. [Application Flow](#3-application-flow)
4. [Component Architecture](#4-component-architecture)
5. [Sequence Diagrams](#5-sequence-diagrams)
6. [Data Flow Diagrams](#6-data-flow-diagrams)
7. [Deployment Architecture](#7-deployment-architecture)

---

## 1. System Architecture

### 1.1 High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
        Mobile[Mobile Browser]
    end
    
    subgraph "Application Server"
        Express[Express.js Server]
        Routes[Route Handlers]
        Views[EJS View Engine]
        Static[Static File Server]
    end
    
    subgraph "Business Logic"
        ExpenseLogic[Expense Logic]
        CategoryLogic[Category Logic]
        SummaryLogic[Summary Logic]
        Helpers[Helper Functions]
    end
    
    subgraph "Data Layer"
        SQLite[(SQLite Database)]
        DB[Database Connector<br/>better-sqlite3]
    end
    
    Browser -->|HTTP Request| Express
    Mobile -->|HTTP Request| Express
    Express --> Routes
    Routes --> ExpenseLogic
    Routes --> CategoryLogic
    Routes --> SummaryLogic
    ExpenseLogic --> Helpers
    SummaryLogic --> Helpers
    ExpenseLogic --> DB
    CategoryLogic --> DB
    SummaryLogic --> DB
    DB --> SQLite
    Routes --> Views
    Views -->|HTML Response| Browser
    Views -->|HTML Response| Mobile
    Express --> Static
    Static -->|CSS/JS| Browser
    Static -->|CSS/JS| Mobile
    
    style Express fill:#4F46E5,color:#fff
    style SQLite fill:#F59E0B,color:#fff
    style Browser fill:#10B981,color:#fff
    style Mobile fill:#10B981,color:#fff
```

### 1.2 Technology Stack

```mermaid
graph LR
    subgraph "Frontend"
        HTML[HTML5]
        CSS[CSS3<br/>Responsive]
        JS[Vanilla JavaScript]
        EJS[EJS Templates]
    end
    
    subgraph "Backend"
        Node[Node.js 18+]
        Express[Express.js 5.x]
        BetterSQLite[better-sqlite3]
    end
    
    subgraph "Middleware"
        BodyParser[body-parser]
        MethodOverride[method-override]
        DotEnv[dotenv]
    end
    
    HTML --> EJS
    CSS --> EJS
    JS --> EJS
    EJS --> Express
    Node --> Express
    Express --> BetterSQLite
    Express --> BodyParser
    Express --> MethodOverride
    Express --> DotEnv
    
    style Node fill:#68A063,color:#fff
    style Express fill:#000,color:#fff
    style BetterSQLite fill:#003B57,color:#fff
```

---

## 2. Database Design

### 2.1 Entity Relationship Diagram

```mermaid
erDiagram
    CATEGORIES ||--o{ EXPENSES : has
    
    CATEGORIES {
        integer id PK "Primary Key, Auto Increment"
        text name UK "Category name, Unique"
        text color "HEX color code"
        text icon "Emoji icon"
        datetime created_at "Creation timestamp"
    }
    
    EXPENSES {
        integer id PK "Primary Key, Auto Increment"
        real amount "Expense amount, > 0"
        integer category_id FK "Foreign Key to CATEGORIES"
        text description "Expense description"
        date expense_date "Date of expense"
        text payment_method "Payment method"
        datetime created_at "Creation timestamp"
        datetime updated_at "Last update timestamp"
    }
```

### 2.2 Database Schema Detail

```mermaid
classDiagram
    class Categories {
        +Integer id
        +String name
        +String color
        +String icon
        +DateTime created_at
        +getAll() List~Category~
        +getById(id) Category
        +create(data) Category
    }
    
    class Expenses {
        +Integer id
        +Real amount
        +Integer category_id
        +String description
        +Date expense_date
        +String payment_method
        +DateTime created_at
        +DateTime updated_at
        +getAll(filters) List~Expense~
        +getById(id) Expense
        +create(data) Expense
        +update(id, data) Boolean
        +delete(id) Boolean
        +getSummary(dateRange) Summary
    }
    
    Categories "1" -- "*" Expenses : has
```

### 2.3 Indexes

```mermaid
graph LR
    subgraph "Performance Optimization"
        IDX1[idx_expense_date<br/>ON expenses.expense_date]
        IDX2[idx_category_id<br/>ON expenses.category_id]
    end
    
    IDX1 -.->|Faster date queries| Query1[Date Range Queries]
    IDX2 -.->|Faster category filtering| Query2[Category Filtering]
    
    style IDX1 fill:#F59E0B,color:#fff
    style IDX2 fill:#F59E0B,color:#fff
```

---

## 3. Application Flow

### 3.1 User Journey - Adding Expense

```mermaid
graph TD
    Start([User opens app]) --> Home[View Expense List]
    Home --> ClickAdd{Click Add Button}
    ClickAdd --> AddForm[Show Add Expense Form]
    AddForm --> FillForm[Fill Form Data:<br/>Date, Amount, Category,<br/>Payment Method, Description]
    FillForm --> Validate{Validation}
    Validate -->|Invalid| ShowError[Show Error Message]
    ShowError --> AddForm
    Validate -->|Valid| SaveDB[Save to Database]
    SaveDB --> Success[Show Success Message]
    Success --> Redirect[Redirect to Home]
    Redirect --> Home
    
    style Start fill:#10B981,color:#fff
    style Success fill:#10B981,color:#fff
    style SaveDB fill:#4F46E5,color:#fff
    style ShowError fill:#EF4444,color:#fff
```

### 3.2 User Journey - Viewing Summary

```mermaid
graph TD
    Start([User clicks Summary]) --> SummaryPage[Load Summary Page]
    SummaryPage --> DefaultRange[Show Current Month Data]
    DefaultRange --> Display1[Display Summary Cards:<br/>Total, Count, Average, Categories]
    Display1 --> Display2[Display Category Breakdown<br/>with Percentages]
    Display2 --> Display3[Display Expense List<br/>in Date Range]
    
    Display3 --> ChangeRange{Change Date Range?}
    ChangeRange -->|Yes| SelectRange[Select New Date Range]
    SelectRange --> FetchData[Fetch Filtered Data]
    FetchData --> Calculate[Calculate Summary]
    Calculate --> Display1
    ChangeRange -->|No| End([Stay on Summary])
    
    style Start fill:#10B981,color:#fff
    style Calculate fill:#4F46E5,color:#fff
    style End fill:#64748B,color:#fff
```

---

## 4. Component Architecture

### 4.1 Server Components

```mermaid
graph TB
    subgraph "server.js - Main Application"
        App[Express Application]
        Config[Configuration<br/>.env, middleware]
        ErrorHandler[Error Handler]
    end
    
    subgraph "Routes Layer"
        ExpenseRoutes[expenses.js<br/>Expense Routes]
        CategoryRoutes[categories.js<br/>Category API]
    end
    
    subgraph "View Layer"
        IndexView[index.ejs<br/>Expense List]
        AddView[add-expense.ejs<br/>Add Form]
        EditView[edit-expense.ejs<br/>Edit Form]
        SummaryView[summary.ejs<br/>Summary Report]
    end
    
    subgraph "Database Layer"
        DBModule[db.js<br/>Database Connection]
        DBFile[(expenses.db<br/>SQLite File)]
    end
    
    subgraph "Utilities"
        Helpers[helpers.js<br/>Date, Currency,<br/>Summary Functions]
    end
    
    App --> Config
    App --> ExpenseRoutes
    App --> CategoryRoutes
    App --> ErrorHandler
    
    ExpenseRoutes --> IndexView
    ExpenseRoutes --> AddView
    ExpenseRoutes --> EditView
    ExpenseRoutes --> SummaryView
    ExpenseRoutes --> DBModule
    ExpenseRoutes --> Helpers
    
    CategoryRoutes --> DBModule
    
    DBModule --> DBFile
    
    style App fill:#4F46E5,color:#fff
    style DBFile fill:#F59E0B,color:#fff
    style Helpers fill:#8B5CF6,color:#fff
```

### 4.2 Directory Structure

```mermaid
graph TD
    Root[exp-tracker/] --> Server[server.js]
    Root --> Package[package.json]
    Root --> Env[.env]
    Root --> Database[database/]
    Root --> Routes[routes/]
    Root --> Views[views/]
    Root --> Public[public/]
    Root --> Utils[utils/]
    Root --> Doc[document/]
    
    Database --> DBJs[db.js]
    Database --> DBFile[(expenses.db)]
    
    Routes --> ExpRoutes[expenses.js]
    Routes --> CatRoutes[categories.js]
    
    Views --> IndexEJS[index.ejs]
    Views --> AddEJS[add-expense.ejs]
    Views --> EditEJS[edit-expense.ejs]
    Views --> SummaryEJS[summary.ejs]
    
    Public --> CSS[css/]
    Public --> JS[js/]
    CSS --> StyleCSS[style.css]
    JS --> MainJS[main.js]
    
    Utils --> Helpers[helpers.js]
    
    Doc --> ExcelSpec[Expense_Tracker_Specification.xlsx]
    Doc --> SDS[SDS.md]
    
    style Root fill:#4F46E5,color:#fff
    style Server fill:#10B981,color:#fff
    style DBFile fill:#F59E0B,color:#fff
```

---

## 5. Sequence Diagrams

### 5.1 Create Expense Flow

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant ExpressServer
    participant ExpenseRoutes
    participant Database
    participant Views
    
    User->>Browser: Click "เพิ่มรายจ่าย"
    Browser->>ExpressServer: GET /expenses/add
    ExpressServer->>ExpenseRoutes: Handle request
    ExpenseRoutes->>Database: Get categories
    Database-->>ExpenseRoutes: Return categories
    ExpenseRoutes->>Views: Render add-expense.ejs
    Views-->>Browser: HTML Form
    Browser-->>User: Display form
    
    User->>Browser: Fill form & submit
    Browser->>ExpressServer: POST /expenses
    ExpressServer->>ExpenseRoutes: Handle request
    ExpenseRoutes->>ExpenseRoutes: Validate data
    
    alt Validation Success
        ExpenseRoutes->>Database: INSERT expense
        Database-->>ExpenseRoutes: Success
        ExpenseRoutes-->>Browser: Redirect to /
        Browser->>ExpressServer: GET /
        ExpressServer->>ExpenseRoutes: Handle request
        ExpenseRoutes->>Database: SELECT expenses
        Database-->>ExpenseRoutes: Return expenses
        ExpenseRoutes->>Views: Render index.ejs
        Views-->>Browser: HTML with success message
        Browser-->>User: Show expense list
    else Validation Failed
        ExpenseRoutes-->>Browser: Error message
        Browser-->>User: Show error
    end
```

### 5.2 Update Expense Flow

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant ExpressServer
    participant ExpenseRoutes
    participant Database
    participant Views
    
    User->>Browser: Click "แก้ไข" on expense
    Browser->>ExpressServer: GET /expenses/:id/edit
    ExpressServer->>ExpenseRoutes: Handle request
    ExpenseRoutes->>Database: SELECT expense by id
    Database-->>ExpenseRoutes: Return expense
    ExpenseRoutes->>Database: Get categories
    Database-->>ExpenseRoutes: Return categories
    ExpenseRoutes->>Views: Render edit-expense.ejs
    Views-->>Browser: Pre-filled form
    Browser-->>User: Display form
    
    User->>Browser: Modify & submit
    Browser->>ExpressServer: PUT /expenses/:id
    ExpressServer->>ExpenseRoutes: Handle request
    ExpenseRoutes->>ExpenseRoutes: Validate data
    ExpenseRoutes->>Database: UPDATE expense
    Database-->>ExpenseRoutes: Success
    ExpenseRoutes-->>Browser: Redirect to /
    Browser-->>User: Show updated list
```

### 5.3 Delete Expense Flow

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant ExpressServer
    participant ExpenseRoutes
    participant Database
    
    User->>Browser: Click "ลบ" button
    Browser->>User: Show confirm dialog
    User->>Browser: Confirm deletion
    Browser->>ExpressServer: DELETE /expenses/:id
    ExpressServer->>ExpenseRoutes: Handle request
    ExpenseRoutes->>Database: DELETE expense WHERE id=:id
    
    alt Expense exists
        Database-->>ExpenseRoutes: 1 row deleted
        ExpenseRoutes-->>Browser: Redirect to / with success
        Browser-->>User: Show success message
    else Expense not found
        Database-->>ExpenseRoutes: 0 rows deleted
        ExpenseRoutes-->>Browser: 404 Error
        Browser-->>User: Show error message
    end
```

### 5.4 View Summary Flow

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant ExpressServer
    participant ExpenseRoutes
    participant Database
    participant Helpers
    participant Views
    
    User->>Browser: Click "สรุปรายจ่าย"
    Browser->>ExpressServer: GET /expenses/summary
    ExpressServer->>ExpenseRoutes: Handle request
    ExpenseRoutes->>ExpenseRoutes: Get current month range
    ExpenseRoutes->>Database: SELECT expenses in date range
    Database-->>ExpenseRoutes: Return expenses
    ExpenseRoutes->>Helpers: getCategoryBreakdown(expenses)
    Helpers-->>ExpenseRoutes: { breakdown, total }
    ExpenseRoutes->>Views: Render summary.ejs
    Views-->>Browser: HTML with summary
    Browser-->>User: Display summary
    
    opt User selects new date range
        User->>Browser: Select dates & submit
        Browser->>ExpressServer: GET /expenses/summary?start_date=...&end_date=...
        ExpressServer->>ExpenseRoutes: Handle request
        ExpenseRoutes->>Database: SELECT expenses in new range
        Database-->>ExpenseRoutes: Return filtered expenses
        ExpenseRoutes->>Helpers: getCategoryBreakdown(expenses)
        Helpers-->>ExpenseRoutes: { breakdown, total }
        ExpenseRoutes->>Views: Render summary.ejs
        Views-->>Browser: HTML with updated summary
        Browser-->>User: Display filtered summary
    end
```

---

## 6. Data Flow Diagrams

### 6.1 Expense Management Data Flow

```mermaid
flowchart LR
    subgraph "Input"
        UserInput[User Input:<br/>Amount, Category,<br/>Date, Description]
    end
    
    subgraph "Processing"
        Validate[Validation:<br/>Amount > 0<br/>Category exists<br/>Date valid]
        Transform[Data Transform:<br/>Format date<br/>Sanitize input]
        Business[Business Logic:<br/>Calculate totals<br/>Update timestamps]
    end
    
    subgraph "Storage"
        WriteDB[(Write to<br/>expenses table)]
        ReadDB[(Read from<br/>expenses table)]
    end
    
    subgraph "Output"
        Display[Display:<br/>Formatted list<br/>Success message]
    end
    
    UserInput --> Validate
    Validate -->|Valid| Transform
    Validate -->|Invalid| Error[Error Message]
    Transform --> Business
    Business --> WriteDB
    WriteDB --> ReadDB
    ReadDB --> Display
    Error --> Display
    
    style Validate fill:#F59E0B,color:#fff
    style WriteDB fill:#4F46E5,color:#fff
    style ReadDB fill:#4F46E5,color:#fff
    style Display fill:#10B981,color:#fff
    style Error fill:#EF4444,color:#fff
```

### 6.2 Summary Generation Data Flow

```mermaid
flowchart TD
    Start[User selects date range] --> FetchExpenses[Fetch expenses<br/>from database]
    FetchExpenses --> GroupByCategory[Group expenses<br/>by category]
    GroupByCategory --> CalculateTotal[Calculate total<br/>for each category]
    CalculateTotal --> CalculatePercentage[Calculate percentage<br/>for each category]
    CalculatePercentage --> CalculateAverage[Calculate<br/>average per day]
    CalculateAverage --> FormatData[Format data for display:<br/>Currency, Dates, Numbers]
    FormatData --> GenerateHTML[Generate HTML<br/>with EJS template]
    GenerateHTML --> SendResponse[Send response<br/>to browser]
    SendResponse --> Display[Display summary<br/>with charts]
    
    style FetchExpenses fill:#4F46E5,color:#fff
    style CalculateTotal fill:#F59E0B,color:#fff
    style Display fill:#10B981,color:#fff
```

---

## 7. Deployment Architecture

### 7.1 Development Environment

```mermaid
graph TB
    subgraph "Developer Machine"
        Code[Source Code<br/>VSCode]
        Git[Git Repository<br/>Local]
        NodeDev[Node.js<br/>Development Server<br/>nodemon]
        SQLiteDev[(SQLite DB<br/>Local File)]
    end
    
    subgraph "GitHub"
        Remote[GitHub Repository<br/>peraponm/exp-tracker]
    end
    
    Code --> Git
    Git -->|git push| Remote
    Remote -->|git pull| Git
    Code --> NodeDev
    NodeDev --> SQLiteDev
    
    style NodeDev fill:#68A063,color:#fff
    style Remote fill:#000,color:#fff
    style SQLiteDev fill:#003B57,color:#fff
```

### 7.2 Production Deployment Options

```mermaid
graph TB
    subgraph "Deployment Options"
        Option1[Option 1:<br/>VPS/Cloud Server]
        Option2[Option 2:<br/>Container<br/>Docker]
        Option3[Option 3:<br/>Platform as a Service<br/>Heroku/Railway]
    end
    
    subgraph "Option 1 - VPS"
        VPS[Ubuntu Server]
        PM2[PM2 Process Manager]
        Nginx[Nginx Reverse Proxy]
    end
    
    subgraph "Option 2 - Container"
        Docker[Docker Container]
        DockerImage[Node.js Image]
    end
    
    subgraph "Option 3 - PaaS"
        PaaS[PaaS Platform]
        AutoDeploy[Auto Deployment]
    end
    
    Option1 --> VPS
    VPS --> PM2
    VPS --> Nginx
    
    Option2 --> Docker
    Docker --> DockerImage
    
    Option3 --> PaaS
    PaaS --> AutoDeploy
    
    style VPS fill:#4F46E5,color:#fff
    style Docker fill:#2496ED,color:#fff
    style PaaS fill:#6B46C1,color:#fff
```

### 7.3 System Requirements

```mermaid
mindmap
  root((System<br/>Requirements))
    Hardware
      CPU: 1 core minimum
      RAM: 512MB minimum
      Storage: 100MB minimum
    Software
      Node.js 18.x or higher
      npm 9.x or higher
      SQLite 3.x support
    Network
      HTTP/HTTPS support
      Port 3000 or custom
      Internet connection optional
    Browser Support
      Chrome/Edge latest
      Firefox latest
      Safari latest
      Mobile browsers
```

---

## 8. Security Considerations

### 8.1 Current Security Measures

```mermaid
flowchart TD
    Input[User Input] --> Validation[Input Validation]
    Validation --> Sanitization[Data Sanitization]
    Sanitization --> PreparedStatements[SQL Prepared Statements]
    PreparedStatements --> Database[(Database)]
    
    Database --> Output[Output Encoding]
    Output --> CSRF[CSRF Protection<br/>method-override]
    CSRF --> Response[HTTP Response]
    
    style Validation fill:#10B981,color:#fff
    style PreparedStatements fill:#10B981,color:#fff
    style CSRF fill:#F59E0B,color:#fff
```

### 8.2 Future Security Enhancements

```mermaid
graph LR
    Current[Current State:<br/>No Authentication] --> Future1[Phase 1:<br/>User Authentication<br/>JWT/Session]
    Future1 --> Future2[Phase 2:<br/>HTTPS Only<br/>SSL/TLS]
    Future2 --> Future3[Phase 3:<br/>Rate Limiting<br/>API Protection]
    Future3 --> Future4[Phase 4:<br/>Data Encryption<br/>Sensitive Data]
    
    style Current fill:#EF4444,color:#fff
    style Future1 fill:#F59E0B,color:#fff
    style Future4 fill:#10B981,color:#fff
```

---

## 9. Performance Optimization

### 9.1 Database Query Optimization

```mermaid
graph TD
    Query[SQL Query] --> Index{Index Available?}
    Index -->|Yes| FastQuery[Use Index:<br/>idx_expense_date<br/>idx_category_id]
    Index -->|No| SlowQuery[Full Table Scan]
    FastQuery --> FastResult[Fast Response<br/>&lt; 10ms]
    SlowQuery --> SlowResult[Slower Response<br/>&gt; 100ms]
    
    style FastQuery fill:#10B981,color:#fff
    style SlowQuery fill:#EF4444,color:#fff
    style FastResult fill:#10B981,color:#fff
    style SlowResult fill:#F59E0B,color:#fff
```

### 9.2 Caching Strategy (Future)

```mermaid
graph LR
    Request[HTTP Request] --> Cache{Check Cache}
    Cache -->|Hit| ReturnCached[Return Cached Data]
    Cache -->|Miss| QueryDB[Query Database]
    QueryDB --> StoreCache[Store in Cache]
    StoreCache --> ReturnFresh[Return Fresh Data]
    
    ReturnCached --> Response[HTTP Response]
    ReturnFresh --> Response
    
    style Cache fill:#8B5CF6,color:#fff
    style ReturnCached fill:#10B981,color:#fff
    style QueryDB fill:#F59E0B,color:#fff
```

---

## 10. Error Handling

### 10.1 Error Flow

```mermaid
flowchart TD
    Operation[User Operation] --> TryCatch{Try-Catch Block}
    TryCatch -->|Success| Success[Success Response]
    TryCatch -->|Error| ErrorType{Error Type}
    
    ErrorType -->|Validation Error| ValidationHandler[400 Bad Request<br/>Show error message]
    ErrorType -->|Not Found| NotFoundHandler[404 Not Found<br/>Redirect or show error]
    ErrorType -->|Database Error| DBErrorHandler[500 Server Error<br/>Log error + Generic message]
    ErrorType -->|Unknown Error| GenericHandler[500 Server Error<br/>Log error + Fallback]
    
    Success --> User[User sees result]
    ValidationHandler --> User
    NotFoundHandler --> User
    DBErrorHandler --> User
    GenericHandler --> User
    
    DBErrorHandler --> Logger[Console/File Logger]
    GenericHandler --> Logger
    
    style Success fill:#10B981,color:#fff
    style ValidationHandler fill:#F59E0B,color:#fff
    style NotFoundHandler fill:#F59E0B,color:#fff
    style DBErrorHandler fill:#EF4444,color:#fff
    style GenericHandler fill:#EF4444,color:#fff
```

---

## Appendix

### Technology Decisions

| Decision | Rationale |
|----------|-----------|
| **Node.js + Express** | Simple, fast development, large ecosystem |
| **SQLite** | Zero configuration, file-based, perfect for single-user app |
| **EJS Templates** | Simple syntax, easy to learn, server-side rendering |
| **No Authentication** | MVP focus, single-user local application |
| **Custom CSS** | Full control, no framework overhead, learning opportunity |
| **better-sqlite3** | Synchronous API, better performance than async sqlite3 |

### Future Roadmap

```mermaid
gantt
    title Development Roadmap
    dateFormat YYYY-MM-DD
    section Phase 1 (Complete)
    MVP Development           :done, 2026-02-01, 2026-02-06
    Testing & Deployment      :done, 2026-02-06, 2026-02-06
    
    section Phase 2 (Next)
    User Authentication       :2026-02-15, 30d
    Custom Categories         :2026-02-20, 14d
    Export Features           :2026-03-01, 14d
    
    section Phase 3 (Future)
    Income Tracking          :2026-03-15, 21d
    Charts & Graphs          :2026-04-01, 21d
    Budget Management        :2026-04-20, 21d
    
    section Phase 4 (Long-term)
    Mobile App              :2026-05-15, 90d
    Multi-currency          :2026-06-01, 30d
```

---

**Document Version:** 1.0.0  
**Last Updated:** February 6, 2026  
**Maintained By:** Development Team
