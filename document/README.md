# 📚 Documentation

This folder contains comprehensive documentation for the Expense Tracker project.

## 📄 Available Documents

### 1. Software Specification (Excel)
**File:** [Expense_Tracker_Specification.xlsx](Expense_Tracker_Specification.xlsx)

Comprehensive specification document with 7 sheets covering:
- Project overview and technology stack
- Functional requirements and user stories
- Complete database schema
- API routes and endpoints
- UI/UX specifications
- Installation and deployment guide
- Future improvements roadmap

**Best for:** Business stakeholders, project managers, and team members who prefer spreadsheet format.

### 2. Software Design Specification (Markdown + Mermaid)
**File:** [SDS.md](SDS.md)

Technical design document with interactive Mermaid diagrams:
- **System Architecture** - Visual representation of application layers
- **Database Design** - ER diagrams and schema details
- **Application Flow** - User journey flowcharts
- **Component Architecture** - Server structure and directory organization
- **Sequence Diagrams** - Detailed interaction flows for CRUD operations
- **Data Flow Diagrams** - Data processing and transformation flows
- **Deployment Architecture** - Development and production environments
- **Security Considerations** - Current measures and future enhancements
- **Performance Optimization** - Query optimization and caching strategies
- **Error Handling** - Comprehensive error flow diagrams

**Best for:** Developers, architects, and technical team members. Can be viewed in:
- VS Code with Markdown Preview Mermaid Support extension
- GitHub (automatic Mermaid rendering)
- Any Mermaid-compatible markdown viewer

## 🔄 Generating Documentation

### Generate Excel Specification
```bash
npm run docs:generate
```

This will create/update the Excel specification file with the latest project information.

### Viewing SDS with Mermaid Diagrams

#### In VS Code
1. Install the "Markdown Preview Mermaid Support" extension
2. Open [SDS.md](SDS.md)
3. Press `Ctrl+Shift+V` (Windows/Linux) or `Cmd+Shift+V` (Mac) to preview

#### On GitHub
Simply navigate to the file - GitHub automatically renders Mermaid diagrams.

#### Online Mermaid Editors
- https://mermaid.live/
- Copy diagram code blocks and paste to visualize

## 📊 Diagram Types Used

### In SDS.md:

1. **Graph/Flowchart** - System architecture, data flows
2. **Sequence Diagram** - User interactions and API calls
3. **Entity Relationship Diagram** - Database structure
4. **Class Diagram** - Database schema with methods
5. **Mind Map** - System requirements
6. **Gantt Chart** - Development roadmap

## 🔧 Document Maintenance

### When to Update:

**Excel Specification:**
- When adding new features
- When modifying database schema
- When changing API endpoints
- Before major releases

**SDS (Markdown):**
- When system architecture changes
- When adding new components
- When workflows are modified
- When deployment strategy changes

### Update Process:
1. Modify [create-spec-document.js](../create-spec-document.js) for Excel changes
2. Edit [SDS.md](SDS.md) directly for design documentation
3. Run `npm run docs:generate` to regenerate Excel
4. Review and commit changes

## 📖 Reading Guide

### For New Team Members
1. Start with **Excel Specification** → Overview sheet
2. Review **Functional Requirements** to understand features
3. Study **Database Schema** in Excel
4. Move to **SDS.md** for technical architecture
5. Follow **Sequence Diagrams** to understand flows

### For Developers
1. **SDS.md** → System Architecture
2. **SDS.md** → Component Architecture
3. **Excel** → API Routes
4. **SDS.md** → Sequence Diagrams for implementation details

### For Project Managers
1. **Excel** → Overview
2. **Excel** → Functional Requirements
3. **Excel** → Future Improvements
4. **SDS.md** → Gantt Chart (roadmap)

## 🤝 Contributing to Documentation

When contributing code changes that affect documentation:

1. Update relevant sections in both documents
2. Ensure Mermaid syntax is valid
3. Test diagrams render correctly
4. Keep both documents in sync
5. Add comments explaining complex diagrams

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-06 | Initial documentation creation |

---

**Maintained by:** Development Team  
**Last Updated:** February 6, 2026
