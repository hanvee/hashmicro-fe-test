# HashMicro Product Management System

A simple product management application built with Vue 3, TypeScript, and Vite. This system provides comprehensive CRUD (Create, Read, Update, Delete) operations for managing products with filtering, sorting, and search capabilities.

## 📋 Table of Contents

- [Project Introduction](#project-introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Application Flow](#application-flow)
- [Installation](#installation)
- [Development](#development)
- [Key Components](#key-components)
- [State Management](#state-management)
- [Styling](#styling--design-system)

## 🎯 Project Introduction

HashMicro Product Management System is a single-page application (SPA) designed for efficient product catalog management. The application demonstrates modern frontend development practices including:

- **Type-safe development** with TypeScript
- **Component-based architecture** with Vue 3 Composition API
- **State management** using Pinia
- **Responsive design** with native CSS
- **Client-side routing** with Vue Router
- **Advanced data table** with client-side filtering, sorting, and pagination

## ✨ Features

### Product Management
- ✅ **Create Products** - Add new products with comprehensive details
- ✅ **View Products** - Display products in a data table
- ✅ **Edit Products** - Update existing product information
- ✅ **Delete Products** - Remove products with confirmation dialog

### Data Table Features
- 🔍 **Global Search** - Search across product names and SKU codes
- 🎯 **Advanced Filtering** - Filter by status and category
- 📊 **Multi-column Sorting** - Sort by any column (asc/desc)
- 📄 **Pagination** - Configurable rows per page (5, 10, 20, 50, 100)
- 🧹 **Clear Filters** - Reset all active filters with one click

### Form Features
- 🔤 **Auto-formatting SKU** - Automatically converts to uppercase
- 💰 **Currency Formatting** - Indonesian Rupiah format with thousand separators
- 🖼️ **Image Upload** - Drag & drop or browse for product images
- ✅ **Form Validation** - Simple validation with error alerts

## 🛠️ Tech Stack

### Core Framework
- **Vue 3.5.26** - Progressive JavaScript framework using Composition API
- **TypeScript 5.9.3** - Static type checking
- **Vite 7.3.0** - Next-generation frontend build tool

### State Management & Routing
- **Pinia 3.0.4** - Intuitive Vue store with TypeScript support
- **Vue Router 4.6.4** - Official router for Vue.js

### Development Tools
- **Vite Plugin Vue DevTools 8.0.5** - Enhanced debugging experience
- **Vue TSC 3.2.2** - TypeScript support for Vue SFC
- **Prettier 3.7.4** - Code formatting

### Build & Type Support
- **@vitejs/plugin-vue 6.0.3** - Official Vite plugin for Vue
- **@tsconfig/node24** - TypeScript configuration for Node.js 24

## 📁 Project Structure

```
hashmicro-fe-test/
├── public/                          # Static assets
├── src/
│   ├── assets/                      # Stylesheets and assets
│   │   └── main.css                 # Global styles and CSS variables
│   │
│   ├── components/                  # Vue components
│   │   ├── icons/                   # SVG icon components
│   │   │
│   │   ├── layouts/                 # Layout components
│   │   │   ├── AppHeader.vue        # Application header
│   │   │   ├── AppLayout.vue        # Main layout wrapper
│   │   │   └── index.ts
│   │   │
│   │   ├── products/                # Product-specific components
│   │   │   ├── ProductForm.vue      # Create/Edit product form
│   │   │   ├── ProductTable.vue     # Product data table
│   │   │   └── index.ts
│   │   │
│   │   └── ui/                      # Reusable UI components
│   │       ├── Alert.vue            # Alert/notification component
│   │       ├── Badge.vue            # Status badge
│   │       ├── BaseTable.vue        # Advanced data table
│   │       ├── Breadcrumb.vue       # Navigation breadcrumb
│   │       ├── Button.vue           # Button component
│   │       └── index.ts
│   │
│   ├── data/                        # Mock data
│   │   └── productData.json         # Sample product data
│   │
│   ├── router/                      # Vue Router configuration
│   │   └── index.ts                 # Route definitions
│   │
│   ├── stores/                      # Pinia stores
│   │   └── useProducts.ts           # Product store (state & actions)
│   │
│   ├── types/                       # TypeScript definitions
│   │   ├── enums/
│   │   │   ├── index.ts
│   │   │   └── productEnums.ts      # Product enums
│   │   └── models/
│   │       ├── index.ts
│   │       └── productModels.ts     # Product interfaces
│   │
│   ├── utils/                       # Utility functions
│   │   └── textFormatters.ts        # Text formatting helpers
│   │
│   ├── views/                       # Page components
│   │   ├── ProductCreate.vue        # Create product page
│   │   ├── ProductEdit.vue          # Edit product page
│   │   └── ProductList.vue          # Product list page
│   │
│   ├── App.vue                      # Root component
│   ├── main.ts                      # Application entry point
│   └── env.d.ts                     # Environment type definitions
│
├── index.html                       # HTML entry point
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── tsconfig.app.json                # App-specific TS config
├── tsconfig.node.json               # Node-specific TS config
├── vite.config.ts                   # Vite configuration
└── README.md                        # This file
```

## 🔄 Application Flow

### 1. Application Bootstrap
```
index.html → main.ts → App.vue → AppLayout → RouterView
```

### 2. Product List Flow
```
ProductList.vue
  ├─ Fetches products on mount (useProductsStore.fetchProducts)
  ├─ Renders ProductTable component
  │   └─ BaseTable with filtering, sorting, pagination
  └─ Handles delete action → ConfirmationDialog
```

### 3. Create Product Flow
```
ProductCreate.vue
  └─ Renders ProductForm
      ├─ User fills form (with auto-formatting)
      ├─ Validation on submit
      ├─ Alert shown if validation fails
      ├─ Calls useProductsStore.addProduct
      └─ Redirects to /products on success
```

### 4. Edit Product Flow
```
ProductEdit.vue
  ├─ Extracts ID from route params
  ├─ Loads product from store
  └─ Renders ProductForm with initialData
      ├─ User modifies form
      ├─ Calls useProductsStore.updateProduct
      └─ Redirects to /products on success
```

### 5. State Management Flow
```
Component Action
  ↓
Pinia Store Action (useProductsStore)
  ↓
Simulated API Call (setTimeout)
  ↓
State Update (reactive)
  ↓
UI Re-render (computed properties)
```

## 🚀 Installation

### Prerequisites
- **Node.js**: v20.19.0 or v22.12.0+
- **npm**: v9+ (comes with Node.js)

### Step-by-Step Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd hashmicro-fe-test
```

2. **Install dependencies**
```bash
npm install
```

3. **Verify installation**
```bash
npm run type-check
```

## 💻 Development

### Start Development Server
```bash
npm run dev
```
- Opens at `http://localhost:5173`
- Hot Module Replacement (HMR) enabled
- TypeScript type checking in watch mode

### Build for Production
```bash
npm run build
```
- Type-checks TypeScript
- Builds optimized production bundle
- Output in `dist/` directory

### Preview Production Build
```bash
npm run preview
```
- Serves production build locally
- Test production optimizations

### Type Checking
```bash
npm run type-check
```
- Runs TypeScript compiler
- Validates all type definitions

### Code Formatting
```bash
npm run format
```
- Formats code with Prettier
- Applies to all `.vue`, `.ts`, `.js` files

## 🧩 Key Components

### BaseTable
Advanced data table component with:
- Multi-column sorting
- Global search
- Column-specific filters
- Pagination controls
- Customizable slots for cell rendering

**Props:**
- `headers`: Column definitions
- `items`: Data rows
- `loading`: Loading state
- `totalItems`, `itemsPerPage`, `currentPage`: Pagination
- `sortBy`, `sortOrder`: Sorting state
- `filters`, `activeFilters`: Filter configuration

**Events:**
- `update:searchQuery`
- `update:itemsPerPage`
- `update:currentPage`
- `update:sort`
- `update:filter`
- `clear-filters`

### ProductForm
Reusable form for create/edit operations with:
- Auto-formatting (SKU uppercase, currency)
- Image upload with preview
- Error alerts

**Props:**
- `initialData?`: Pre-populate form for editing
- `isEdit?`: Edit mode flag
- `isLoading?`: Submit loading state

**Events:**
- `submit`: Form submission with validated data
- `cancel`: Cancel action

### Alert
Notification component with variants:
- `success`, `error`, `warning`, `info`
- Closeable option
- Native CSS (no Tailwind)

### Button
Flexible button component with:
- Multiple variants (primary, accent, outline, ghost, danger)
- Sizes (sm, md, lg)
- Loading state with spinner
- Type safety (`button`, `submit`, `reset`)

## 📦 State Management

### useProductsStore (Pinia)

**State:**
- `products`: Array of all products
- `searchQuery`: Global search term
- `currentPage`, `itemsPerPage`: Pagination state
- `sortBy`, `sortOrder`: Sort configuration
- `activeFilters`: Active filter values
- Loading states: `isLoading`, `isCreating`, `isUpdating`, `isDeleting`

**Computed:**
- `filteredProducts`: Products after search and filters
- `paginatedProducts`: Current page items
- `totalItems`, `totalPages`: Pagination metadata

**Actions:**
- `fetchProducts()`: Load initial data
- `addProduct(product)`: Create new product
- `updateProduct(product)`: Update existing product
- `deleteProduct(id)`: Remove product
- `setPage(page)`, `setSearch(query)`, `setSort(field)`, `setFilter(key, value)`: UI state updates
- `clearFilter()`: Reset all filters

## 🎨 Styling

### CSS Variables (Design Tokens)
```css
/* Colors */
--color-primary: #002060      /* HashMicro Navy Blue */
--color-accent: #F27E00       /* HashMicro Orange */
--color-secondary: #D42E12    /* HashMicro Red */

/* Shadows */
--shadow-sm, --shadow-md, --shadow-lg, --shadow-xl

/* Border Radius */
--radius-sm: 4px
--radius-md: 8px
```