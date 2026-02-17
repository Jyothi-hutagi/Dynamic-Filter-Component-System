# Dynamic Filter Component System

A production-ready React + TypeScript filtering system with real-time data processing, supporting multiple data types and operators. Built with Material UI and Vite.

## 🎯 Features

### ✨ Advanced Filtering

- **Multi-Type Support**: Text, Numbers, Dates, Amounts, Single/Multi-Select, Boolean
- **Dynamic Operators**: Context-aware operators based on field type
- **Real-Time Updates**: Table updates instantly as filters change
- **Type-Safe**: Full TypeScript support with strict typing
- **AND Logic**: Multiple conditions combined with AND logic between fields

### 🎨 UI/UX

- **Material UI Components**: Professional, polished interface
- **Responsive Design**: Works seamlessly on all devices
- **Visual Feedback**: Success/error alerts, status indicators
- **Pagination**: Configurable rows per page (5, 10, 25, 50)
- **Sortable Columns**: Click headers to sort ascending/descending

### ⚡ Performance

- **Efficient Algorithms**: Optimized client-side filtering
- **Memoization**: Prevents unnecessary re-renders
- **Large Datasets**: Handles 50+ records smoothly
- **Real-Time Processing**: Instant filtering feedback

## 🛠️ Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Material UI** - Component library
- **Lucide React** - Icon library
- **Day.js** - Date handling

## 📋 Supported Filter Types

| Type              | Operators                                                  | Input                        |
| ----------------- | ---------------------------------------------------------- | ---------------------------- |
| **Text**          | Equals, Contains, Starts With, Ends With, Does Not Contain | Text input                   |
| **Number**        | Equals, >, <, >=, <=                                       | Number input                 |
| **Date**          | Between                                                    | Date range picker            |
| **Amount**        | Between                                                    | Min/Max inputs               |
| **Single Select** | Is, Is Not                                                 | Dropdown                     |
| **Multi-Select**  | In, Not In                                                 | Multi-select with checkboxes |
| **Boolean**       | Is                                                         | Toggle switch                |

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Jyothi-hutagi/Dynamic-Filter-Component-System.git
cd Dynamic-Filter-Component-System

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5174/`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── FilterBuilder/
│   │   ├── FilterBuilder.tsx      # Main filter interface
│   │   ├── FilterRow.tsx          # Individual filter row
│   │   ├── FieldSelector.tsx      # Field dropdown
│   │   ├── OperatorSelector.tsx   # Operator dropdown
│   │   └── ValueInput.tsx         # Dynamic value input
│   ├── DataTable/
│   │   └── DataTable.tsx          # Results table with pagination
│   └── common/
│       └── Button.tsx             # Custom button component
├── types/
│   ├── data.types.ts              # Employee data types
│   ├── field.types.ts             # Field configuration types
│   └── filter.types.ts            # Filter operation types
├── utils/
│   ├── dataGenerator.ts           # 60 sample employee records
│   ├── fieldConfig.ts             # Field & operator mappings
│   └── filterEngine.ts            # Filtering algorithms
└── App.tsx                        # Main application
```

## 💡 Usage Examples

### Example 1: Filter by Department

1. Click "Add Filter"
2. Select "Department" → "Is" → "Engineering"
3. Click "Apply Filters"

### Example 2: Multiple Conditions

1. Add Filter: Department → Is → Engineering
2. Add Filter: Salary → Greater Than → 80000
3. Add Filter: Active Status → Is → True
4. Click "Apply Filters"

Results show active engineering employees earning >$80k

### Example 3: Date Range

1. Add Filter: Join Date → Between → [Select date range]
2. Click "Apply Filters"

### Example 4: Multi-Select Skills

1. Add Filter: Skills → In → [Select React, TypeScript, Node.js]
2. Click "Apply Filters"

Results show employees with any of the selected skills

## 🎯 Filter Logic

- **Between Conditions**: AND logic (all must match)
- **Within Same Field**: All conditions are required to match
- **Case-Sensitive**: Text matching is case-insensitive
- **Null Handling**: Empty values are handled gracefully

## ✅ Test Scenarios

### Scenario 1: No Filters

- View all 60 employee records
- Test table sorting and pagination

### Scenario 2: Text Filter

- Name contains "John"
- Email starts with "alice"

### Scenario 3: Numeric Range

- Salary between 75000 and 120000
- Performance rating > 4.0

### Scenario 4: Date Range

- Join date between specific dates

### Scenario 5: Multi-Select

- Skills in [React, TypeScript]

### Scenario 6: Boolean Filter

- Active status = True

### Scenario 7: Nested Objects

- City = "San Francisco"

## 🔍 Data Sample

The system includes 60 sample employee records with:

- ✅ Varied names, emails, departments, roles
- ✅ Salary range: $50,000 - $200,000
- ✅ Join dates across multiple years
- ✅ Multiple skills per employee
- ✅ Performance ratings 2.5 - 5.0
- ✅ Nested address information
- ✅ Mix of active/inactive statuses

## 📊 Component Highlights

### FilterBuilder

- Dynamic filter row management
- Real-time validation
- Clear visual feedback
- Error messaging

### DataTable

- Sortable columns
- Pagination support
- Currency formatting
- Status indicators
- Skill display with truncation

### FieldSelector

- Dynamic field loading
- Typed options
- Disabled state handling

### ValueInput

- Type-specific inputs
- Date picker integration
- Multi-select with checkboxes
- Currency input with formatting

## 🛡️ Type Safety

100% TypeScript coverage with:

- Strict mode enabled
- No implicit any types
- Complete type definitions
- Union types for operators

## 🎨 Styling

- **Material UI System**: `sx` prop for all styling
- **Theme Customization**: Centralized Material UI theme
- **Responsive**: Mobile-first approach
- **No Tailwind**: All styling via Material UI

## 🚀 Performance Tips

- Filters are applied client-side (no network requests)
- Memoization prevents unnecessary re-renders
- Efficient sort/pagination algorithms
- Handles 50+ records smoothly

## 📝 Code Quality

- ✅ Strong TypeScript types
- ✅ Clear separation of concerns
- ✅ Reusable components
- ✅ Comprehensive error handling
- ✅ Well-documented code

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

MIT License - feel free to use this project in your own applications.

## 📧 Support

For issues or questions, please open a GitHub issue.

---

**Built with ❤️ using React, TypeScript, and Material UI**
