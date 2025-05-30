# Product Hunt Clone - Frontend 🎨

A modern, responsive frontend built with **Nuxt 3**, **Vue 3**, and **Tailwind CSS** for the Product Hunt clone application.

## 🌟 Features Completed

### ✅ Authentication System

- [x] **User Registration** with form validation and avatar upload
- [x] **User Login/Logout** with persistent sessions
- [x] **JWT Authentication** with HTTP-only cookie management
- [x] **Protected Routes** with authentication middleware
- [x] **Guest Routes** preventing authenticated users from accessing login/register
- [x] **Auth State Management** with reactive composables
- [x] **Profile Management** with bio and avatar updates

### ✅ Product Management

- [x] **Product Creation Form** with comprehensive validation
- [x] **Multi-file Upload** (logo + product images) with preview
- [x] **Category Selection** with predefined categories
- [x] **Form Validation** with real-time error feedback
- [x] **Product Cards** with responsive design
- [x] **Product Detail Pages** with full information display
- [x] **Image Gallery** with carousel component

### ✅ Home/Explore Features

- [x] **Product Listing** with responsive grid layout
- [x] **Search Functionality** across product name, tagline, and description
- [x] **Category Filtering** with dynamic counts
- [x] **Sorting Options** (Latest, Most Upvoted, Alphabetical)
- [x] **Real-time Filtering** with client-side optimization
- [x] **Loading States** with skeleton components
- [x] **Empty States** with meaningful messages

### ✅ Interactive Features

- [x] **Upvoting System** with toggle functionality
- [x] **Real-time Vote Counting** with optimistic updates
- [x] **Comment System** with nested replies
- [x] **Comment Forms** with validation and authentication
- [x] **User Profiles** with statistics and product listings
- [x] **Responsive Navigation** with user menu

### ✅ UI/UX Components

- [x] **Shadcn/ui Integration** with custom theming
- [x] **Responsive Design** mobile-first approach
- [x] **Dark/Light Theme** support with system preference detection
- [x] **Loading Spinners** and progress indicators
- [x] **Form Components** with validation states
- [x] **Carousel Components** for image galleries
- [x] **Dropdown Menus** with proper accessibility
- [x] **Tooltip Components** for enhanced UX
- [x] **Card Components** with consistent styling

## 🎯 Features in Development

- [ ] **Infinite Scroll** for product listings
- [ ] **Advanced Search** with filters
- [ ] **Email Notifications** UI
- [ ] **Analytics Dashboard** for users
- [ ] **Product Sharing** functionality
- [ ] **PWA Features** (offline support)

## 🛠️ Tech Stack

- **Framework:** Nuxt 3 (Vue 3 + Server-Side Rendering)
- **Styling:** Tailwind CSS + Shadcn/ui components
- **State Management:** Vue 3 Composition API + Composables
- **Authentication:** JWT with HTTP-only cookies
- **Forms:** Native Vue 3 with custom validation
- **Icons:** Nuxt Icon (Lucide icons)
- **Image Handling:** Nuxt Image with optimization
- **HTTP Client:** Built-in `$fetch` API
- **Notifications:** Vue Sonner (toast notifications)
- **Development:** ESLint + TypeScript support
- **Package Manager:** npm/yarn/pnpm/bun compatible

## 📁 Project Structure

```
client/
├── assets/css/                 # Global styles and Tailwind config
│   ├── main.css               # Main CSS entry point
│   └── tailwind.css           # Tailwind CSS imports
├── components/                 # Reusable Vue components
│   ├── ui/                    # Shadcn/ui component library
│   │   ├── button/            # Button components
│   │   ├── card/              # Card components
│   │   ├── carousel/          # Carousel/slider components
│   │   ├── dropdown-menu/     # Dropdown menu components
│   │   ├── input/             # Input field components
│   │   ├── label/             # Label components
│   │   ├── sonner/            # Toast notification components
│   │   ├── textarea/          # Textarea components
│   │   └── tooltip/           # Tooltip components
│   ├── AppLoader.vue          # Global loading component
│   ├── Comment.vue            # Individual comment display
│   ├── CommentForm.vue        # Comment creation form
│   ├── CommentsSection.vue    # Complete comment system
│   ├── Logo.vue               # Application logo
│   ├── Navbar.vue             # Main navigation
│   └── ProductCard.vue        # Product display card
├── composables/               # Vue 3 composables for state management
│   ├── useAuth.js            # Authentication state and methods
│   ├── useComments.js        # Comment management
│   ├── useCreateProduct.js   # Product creation workflow
│   ├── useProductDetail.js   # Single product state
│   ├── useProducts.js        # Product listing and filtering
│   ├── useRegisterForm.js    # Registration form logic
│   ├── useTheme.js           # Theme management
│   └── useUserProfile.js     # User profile management
├── layouts/                   # Application layouts
│   └── default.vue           # Main layout with navbar
├── lib/                       # Utility functions
│   └── utils.js              # Helper functions for UI
├── middleware/                # Route middleware
│   ├── auth.js               # Protect authenticated routes
│   └── guest.js              # Protect guest-only routes
├── pages/                     # File-based routing
│   ├── index.vue             # Home/explore page
│   ├── create.vue            # Product creation page
│   ├── login.vue             # User login page
│   ├── register.vue          # User registration page
│   ├── products/[id].vue     # Product detail page
│   └── profile/              # User profile pages
│       ├── index.vue         # Current user profile
│       └── [id].vue          # Other user profiles
├── plugins/                   # Nuxt plugins
│   └── auth.client.js        # Client-side auth initialization
└── public/                    # Static assets
    ├── favicon.ico           # Site icon
    └── robots.txt            # SEO robots file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Environment Configuration

Create a `.env` file in the client directory (optional for development):

```env
# Backend API Configuration (defaults to localhost:8080)
BACKEND_URL=http://localhost:8080

# Optional: Environment identifier
NUXT_PUBLIC_APP_ENV=development
```

**Note:** The app will default to `http://localhost:8080` for the backend if no environment variables are set.

## 🔧 Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Generate static site (if using SSG)
npm run generate

# Lint code with ESLint
npm run lint

# Fix linting issues automatically
npm run lint:fix
```

## 🎨 Component Usage Examples

### Using Product Cards

```vue
<template>
  <ProductCard
    :product="product"
    @upvote="handleUpvote"
    @click="navigateToProduct"
  />
</template>
```

### Authentication Check

```vue
<template>
  <div v-if="isAuthenticated">Welcome, {{ user.name }}!</div>
</template>

<script setup>
const { isAuthenticated, user } = useAuth();
</script>
```

### Product Filtering

```vue
<script setup>
const { products, filteredProducts, searchQuery, selectedCategory, sortBy } =
  useProducts();

// Real-time search
searchQuery.value = "AI tools";

// Filter by category
selectedCategory.value = "AI";

// Sort products
sortBy.value = "upvotes";
</script>
```

## 🌐 API Integration

The frontend communicates with the backend through:

- **Base URL:** Configurable via environment variables
- **Authentication:** JWT tokens in HTTP-only cookies
- **Error Handling:** Global error management with user feedback
- **Loading States:** Reactive loading indicators for all async operations

### Example API Calls

```javascript
// In composables - using the configured backend URL
const config = useRuntimeConfig();
const baseURL = config.public.backendUrl;

const { data: products } = await $fetch(`${baseURL}/api/products`);
const { data: user } = await $fetch(`${baseURL}/api/auth/me`);
await $fetch(`${baseURL}/api/products/${id}/upvote`, { method: "POST" });
```

## 🐛 Troubleshooting

### Common Issues

**Issue: "API calls failing"**

```bash
# Check if backend server is running on correct port (default: 8080)
# Verify BACKEND_URL in .env file or nuxt.config.js
# Check browser console for CORS errors
# Ensure backend FRONTEND_URL matches your frontend URL
```

**Issue: "Authentication not working"**

```bash
# Clear browser cookies and local storage
# Check if JWT token is being sent with requests
# Verify backend authentication endpoints
```

**Issue: "Images not loading"**

```bash
# Check Cloudinary configuration in backend
# Verify image URLs in API responses
# Check network tab for failed image requests
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile:** 320px - 767px
- **Tablet:** 768px - 1023px
- **Desktop:** 1024px and above

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables for Production

```env
# Backend API Configuration
BACKEND_URL=https://your-backend-domain.com

# Optional: Environment identifier
NUXT_PUBLIC_APP_ENV=production
```

## 🤝 Contributing

1. Follow Vue 3 Composition API patterns
2. Use TypeScript for new components when possible
3. Maintain responsive design principles
4. Add proper error handling for all async operations
5. Include loading states for better UX
6. Follow the existing component structure and naming conventions

## 📚 Documentation Links

- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Vue 3 Documentation](https://vuejs.org/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com/)

---

**Built with ❤️ using modern Vue.js ecosystem**
