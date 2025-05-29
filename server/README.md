# Product Hunt Clone - Backend API Server

> 🚀 **A comprehensive RESTful API for a Product Hunt-like application built with Node.js, Express.js, and MongoDB. Features include user authentication, product management, upvoting system, and commenting functionality with advanced features like image uploads, real-time interactions, and comprehensive API documentation.**

## ✨ Core Features

### 🔐 Authentication & Authorization

- **JWT-based Authentication** with secure cookie handling
- **User Registration & Login** with email validation
- **Profile Management** with avatar upload support
- **Password Hashing** using bcryptjs
- **Protected Routes** with middleware validation

### 📦 Product Management

- **Complete CRUD Operations** for products
- **Multi-file Upload** support (logo + multiple images)
- **Category-based Organization** with predefined categories
- **Advanced Filtering & Sorting** capabilities
- **Product Status Management** (pending/approved/rejected)
- **Featured Products** system

### ⬆️ Upvoting System

- **Toggle Upvote/Downvote** functionality
- **Real-time Upvote Count** tracking
- **User-specific Upvote Status** tracking
- **Duplicate Prevention** system

### 💬 Comment System

- **Hierarchical Comments** with replies support
- **Nested Comment Structure** for better organization
- **Comment CRUD Operations**
- **User Attribution** for all comments

### 🖼️ File Upload & Storage

- **Cloudinary Integration** for cloud storage
- **Multiple File Format** support (JPEG, PNG, GIF, WebP)
- **Image Validation** and optimization
- **Secure File Handling** with proper error management

## 📁 Project Architecture

```
server/
├── src/
│   ├── controllers/         # Business logic handlers
│   │   ├── authController.js     # Authentication operations
│   │   ├── commentController.js  # Comment management
│   │   └── productController.js  # Product operations
│   ├── middleware/          # Custom middleware functions
│   │   ├── auth.js              # JWT authentication middleware
│   │   └── validation.js        # Input validation middleware
│   ├── models/              # MongoDB data models
│   │   ├── User.js              # User schema & methods
│   │   ├── Product.js           # Product schema & methods
│   │   └── Comment.js           # Comment schema & methods
│   ├── routes/              # API route definitions
│   │   ├── authRoutes.js        # Authentication endpoints
│   │   ├── productRoutes.js     # Product endpoints
│   │   └── commentRoutes.js     # Comment endpoints
│   ├── utils/               # Utility functions & helpers
│   │   ├── jwt.js               # JWT token utilities
│   │   ├── upload.js            # File upload configuration
│   │   ├── cookieHelper.js      # Cookie management
│   │   └── cloudinaryHelper.js  # Cloudinary operations
│   ├── db/
│   │   └── connectDB.js         # MongoDB connection setup
│   ├── app.js               # Express application setup
│   └── index.js             # Server entry point
├── public/                  # Static file serving directory
├── .env                     # Environment variables
├── package.json
└── README.md
```

## 🛠️ Quick Start Guide

### 📋 Prerequisites

- **Node.js** (v16.0.0 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local installation or MongoDB Atlas) - [Setup Guide](https://docs.mongodb.com/manual/installation/)
- **npm** or **yarn** package manager
- **Cloudinary Account** (for image uploads) - [Sign up](https://cloudinary.com/)

### ⚡ Installation Steps

1. **Clone & Navigate**

   ```bash
   git clone <repository-url>
   cd kulp-project/server
   ```

2. **Install Dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**

   Create a `.env` file in the server root directory:

   ```env
   # Database Configuration
   MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/kulp-product-hunt

   # JWT Configuration
   JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_characters
   JWT_EXPIRE=7d

   # Server Configuration
   NODE_ENV=development
   PORT=3000
   FRONTEND_URL=http://localhost:3000

   # Cloudinary Configuration (Required for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

   **🔐 Getting Cloudinary Credentials:**

   1. Create account at [Cloudinary](https://cloudinary.com/)
   2. Navigate to Dashboard
   3. Copy Cloud Name, API Key, and API Secret
   4. Add them to your `.env` file

4. **Database Setup**

   ```bash
   # For local MongoDB
   mongod --dbpath /path/to/your/data/directory

   # For MongoDB Atlas, ensure your connection string is correct in .env
   ```

5. **Start the Server**

   ```bash
   # Development mode (with auto-restart)
   npm run dev

   # Production mode
   npm start
   ```

   **✅ Success! Server running at:** `http://localhost:3000`

### 🔍 Verify Installation

Test the API with a simple GET request:

```bash
curl http://localhost:3000/
```

Expected response:

```json
{
  "success": true,
  "message": "Product Hunt API Server is running!",
  "endpoints": {
    "auth": "/api/auth",
    "products": "/api/products",
    "comments": "/api/comments"
  }
}
```

## 📚 Complete API Documentation

### 🌐 Base Configuration

**Base URL:** `http://localhost:3000/api`
**Content-Type:** `application/json` (except for file uploads)
**Authentication:** JWT Bearer Token (in cookies and/or Authorization header)

### 📋 Standard Response Format

All API endpoints return responses in this consistent format:

```json
{
  "success": boolean,
  "message": "Human-readable message",
  "data": {
    // Response payload (varies by endpoint)
  }
}
```

### ❌ Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (development only)"
}
```

---

## 🔐 Authentication API

### 🔥 Register New User

**Endpoint:** `POST /api/auth/register`  
**Content-Type:** `multipart/form-data`  
**Authentication:** Not required

**📤 Request Body (FormData):**

```javascript
{
  name: "John Doe",                    // Required: 1-50 characters
  email: "john@example.com",           // Required: Valid email format
  password: "securePassword123",       // Required: Minimum 6 characters
  bio: "Full-stack developer",         // Optional: Max 200 characters
  avatar: File                         // Required: Image file (JPEG/PNG/GIF/WebP, max 5MB)
}
```

**📥 Success Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://res.cloudinary.com/xxx/image/upload/xxx.jpg",
      "bio": "Full-stack developer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**📝 Example cURL:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "password=securePassword123" \
  -F "bio=Full-stack developer" \
  -F "avatar=@/path/to/avatar.jpg"
```

---

### 🔑 User Login

**Endpoint:** `POST /api/auth/login`  
**Content-Type:** `application/json`  
**Authentication:** Not required

**📤 Request Body:**

```json
{
  "email": "john@example.com", // Required: Valid email
  "password": "securePassword123" // Required: User's password
}
```

**📥 Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://res.cloudinary.com/xxx/image/upload/xxx.jpg",
      "bio": "Full-stack developer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**📝 Example cURL:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

---

### 👤 Get Current User Profile

**Endpoint:** `GET /api/auth/me`  
**Authentication:** Required (JWT Token)

**📤 Request Headers:**

```
Authorization: Bearer <jwt_token>
```

**📥 Success Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://res.cloudinary.com/xxx/image/upload/xxx.jpg",
      "bio": "Full-stack developer"
    }
  }
}
```

---

### ✏️ Update User Profile

**Endpoint:** `PUT /api/auth/profile`  
**Content-Type:** `application/json`  
**Authentication:** Required (JWT Token)

**📤 Request Body:**

```json
{
  "name": "John Updated", // Optional: 1-50 characters
  "bio": "Senior Full-stack Developer" // Optional: Max 200 characters
}
```

**📥 Success Response (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Updated",
      "email": "john@example.com",
      "avatar": "https://res.cloudinary.com/xxx/image/upload/xxx.jpg",
      "bio": "Senior Full-stack Developer"
    }
  }
}
```

---

### 🚪 User Logout

**Endpoint:** `POST /api/auth/logout`  
**Authentication:** Not required

**📥 Success Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 📦 Products API

### 📋 Get All Products (with Advanced Filtering)

**Endpoint:** `GET /api/products`  
**Authentication:** Not required

**📤 Query Parameters:**

```
category    (optional): AI | SaaS | Devtools | Productivity | Design | Marketing | Finance | Education | Health | Gaming | Other
sort        (optional): createdAt (default) | upvoteCount | name
page        (optional): Page number (default: 1)
limit       (optional): Items per page (default: 12)
search      (optional): Search in name, tagline, description
featured    (optional): true | false
```

**📝 Example Requests:**

```bash
# Get all products
GET /api/products

# Filter by category and sort by upvotes
GET /api/products?category=AI&sort=upvoteCount

# Search with pagination
GET /api/products?search=productivity&page=2&limit=10

# Get featured products only
GET /api/products?featured=true
```

**📥 Success Response (200):**

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "AI Writing Assistant",
        "tagline": "Write better content with AI",
        "description": "An AI-powered writing tool that helps you create engaging content faster than ever before.",
        "websiteUrl": "https://aiwritingassistant.com",
        "logo": "https://res.cloudinary.com/xxx/image/upload/logo.jpg",
        "images": [
          "https://res.cloudinary.com/xxx/image/upload/img1.jpg",
          "https://res.cloudinary.com/xxx/image/upload/img2.jpg"
        ],
        "category": "AI",
        "submittedBy": {
          "_id": "507f1f77bcf86cd799439012",
          "name": "Jane Smith",
          "email": "jane@example.com",
          "avatar": "https://res.cloudinary.com/xxx/image/upload/avatar.jpg"
        },
        "upvotes": [
          {
            "user": "507f1f77bcf86cd799439013",
            "createdAt": "2024-01-15T10:30:00.000Z"
          }
        ],
        "upvoteCount": 1,
        "featured": false,
        "status": "approved",
        "createdAt": "2024-01-15T09:00:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "totalProducts": 1
  }
}
```

---

### 🔍 Get Single Product

**Endpoint:** `GET /api/products/:id`  
**Authentication:** Not required

**📝 Example Request:**

```bash
GET /api/products/507f1f77bcf86cd799439011
```

**📥 Success Response (200):**

```json
{
  "success": true,
  "data": {
    "product": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "AI Writing Assistant",
      "tagline": "Write better content with AI",
      "description": "An AI-powered writing tool that helps you create engaging content faster than ever before.",
      "websiteUrl": "https://aiwritingassistant.com",
      "logo": "https://res.cloudinary.com/xxx/image/upload/logo.jpg",
      "images": [
        "https://res.cloudinary.com/xxx/image/upload/img1.jpg",
        "https://res.cloudinary.com/xxx/image/upload/img2.jpg"
      ],
      "category": "AI",
      "submittedBy": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "avatar": "https://res.cloudinary.com/xxx/image/upload/avatar.jpg",
        "bio": "AI enthusiast and entrepreneur"
      },
      "upvotes": [
        {
          "user": {
            "_id": "507f1f77bcf86cd799439013",
            "name": "John Doe",
            "avatar": "https://res.cloudinary.com/xxx/image/upload/john.jpg"
          },
          "createdAt": "2024-01-15T10:30:00.000Z"
        }
      ],
      "upvoteCount": 1,
      "featured": false,
      "status": "approved",
      "createdAt": "2024-01-15T09:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

### ➕ Create New Product

**Endpoint:** `POST /api/products`  
**Content-Type:** `multipart/form-data`  
**Authentication:** Required (JWT Token)

**📤 Request Body (FormData):**

```javascript
{
  name: "AI Writing Assistant",            // Required: 1-100 characters
  tagline: "Write better content with AI", // Required: 1-200 characters
  description: "Full description...",      // Required: 1-1000 characters
  websiteUrl: "https://example.com",       // Required: Valid URL format
  category: "AI",                          // Required: Valid category enum
  logo: File,                              // Required: Image file (max 5MB)
  images: [File, File, ...]                // Required: 1-5 image files (max 5MB each)
}
```

**📝 Example cURL:**

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "name=AI Writing Assistant" \
  -F "tagline=Write better content with AI" \
  -F "description=An AI-powered writing tool that helps you create engaging content faster than ever before." \
  -F "websiteUrl=https://aiwritingassistant.com" \
  -F "category=AI" \
  -F "logo=@/path/to/logo.jpg" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

**📥 Success Response (201):**

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "product": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "AI Writing Assistant",
      "tagline": "Write better content with AI",
      "description": "An AI-powered writing tool that helps you create engaging content faster than ever before.",
      "websiteUrl": "https://aiwritingassistant.com",
      "logo": "https://res.cloudinary.com/xxx/image/upload/logo.jpg",
      "images": [
        "https://res.cloudinary.com/xxx/image/upload/img1.jpg",
        "https://res.cloudinary.com/xxx/image/upload/img2.jpg"
      ],
      "category": "AI",
      "submittedBy": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "avatar": "https://res.cloudinary.com/xxx/image/upload/avatar.jpg"
      },
      "upvotes": [],
      "upvoteCount": 0,
      "featured": false,
      "status": "approved",
      "createdAt": "2024-01-15T09:00:00.000Z",
      "updatedAt": "2024-01-15T09:00:00.000Z"
    }
  }
}
```

---

### 🗑️ Delete Product

**Endpoint:** `DELETE /api/products/:id`  
**Authentication:** Required (JWT Token - Must be product owner)

**📝 Example Request:**

```bash
curl -X DELETE http://localhost:3000/api/products/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**📥 Success Response (200):**

```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### ⬆️ Toggle Product Upvote

**Endpoint:** `POST /api/products/:id/upvote`  
**Authentication:** Required (JWT Token)

**📝 Example Request:**

```bash
curl -X POST http://localhost:3000/api/products/507f1f77bcf86cd799439011/upvote \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**📥 Success Response (200):**

```json
{
  "success": true,
  "message": "Product upvoted successfully", // or "Upvote removed successfully"
  "data": {
    "product": {
      // Updated product object with new upvote status
    },
    "isUpvoted": true // false if upvote was removed
  }
}
```

---

### 👤 Get User's Products

**Endpoint:** `GET /api/products/user/:userId`  
**Authentication:** Not required

**📝 Example Request:**

```bash
GET /api/products/user/507f1f77bcf86cd799439012
```

**📥 Success Response (200):**

```json
{
  "success": true,
  "data": {
    "products": [
      // Array of user's products
    ],
    "user": {
      "id": "507f1f77bcf86cd799439012",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "avatar": "https://res.cloudinary.com/xxx/image/upload/avatar.jpg",
      "bio": "AI enthusiast and entrepreneur"
    },
    "totalProducts": 5
  }
}
```

---

### 📂 Get Product Categories

**Endpoint:** `GET /api/products/categories`  
**Authentication:** Not required

**📥 Success Response (200):**

```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "name": "AI",
        "count": 15
      },
      {
        "name": "SaaS",
        "count": 23
      },
      {
        "name": "Devtools",
        "count": 8
      },
      {
        "name": "Productivity",
        "count": 12
      },
      {
        "name": "Design",
        "count": 7
      },
      {
        "name": "Marketing",
        "count": 5
      },
      {
        "name": "Finance",
        "count": 3
      },
      {
        "name": "Education",
        "count": 4
      },
      {
        "name": "Health",
        "count": 2
      },
      {
        "name": "Gaming",
        "count": 6
      },
      {
        "name": "Other",
        "count": 1
      }
    ]
  }
}
```

---

## 💬 Comments API

### 📋 Get Product Comments

**Endpoint:** `GET /api/comments/product/:productId`  
**Authentication:** Not required

**📝 Example Request:**

```bash
GET /api/comments/product/507f1f77bcf86cd799439011
```

**📥 Success Response (200):**

```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "_id": "507f1f77bcf86cd799439020",
        "content": "This is an amazing product! Really helps with my writing.",
        "author": {
          "_id": "507f1f77bcf86cd799439013",
          "name": "John Doe",
          "email": "john@example.com",
          "avatar": "https://res.cloudinary.com/xxx/image/upload/john.jpg"
        },
        "product": "507f1f77bcf86cd799439011",
        "parentComment": null,
        "replies": [
          {
            "_id": "507f1f77bcf86cd799439021",
            "content": "Thanks for the feedback! Glad you're enjoying it.",
            "author": {
              "_id": "507f1f77bcf86cd799439012",
              "name": "Jane Smith",
              "email": "jane@example.com",
              "avatar": "https://res.cloudinary.com/xxx/image/upload/jane.jpg"
            }
          }
        ],
        "createdAt": "2024-01-15T11:00:00.000Z",
        "updatedAt": "2024-01-15T11:00:00.000Z"
      }
    ]
  }
}
```

---

### ➕ Create Comment or Reply

**Endpoint:** `POST /api/comments`  
**Content-Type:** `application/json`  
**Authentication:** Required (JWT Token)

**📤 Request Body:**

```json
{
  "content": "This is an amazing product!", // Required: 1-500 characters
  "productId": "507f1f77bcf86cd799439011", // Required: Valid product ID
  "parentCommentId": "507f1f77bcf86cd799439020" // Optional: For replies only
}
```

**📝 Example cURL (New Comment):**

```bash
curl -X POST http://localhost:3000/api/comments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is an amazing product! Really helps with my writing.",
    "productId": "507f1f77bcf86cd799439011"
  }'
```

**📝 Example cURL (Reply to Comment):**

```bash
curl -X POST http://localhost:3000/api/comments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Thanks for the feedback! Glad you are enjoying it.",
    "productId": "507f1f77bcf86cd799439011",
    "parentCommentId": "507f1f77bcf86cd799439020"
  }'
```

**📥 Success Response (201):**

```json
{
  "success": true,
  "message": "Comment created successfully",
  "data": {
    "comment": {
      "_id": "507f1f77bcf86cd799439020",
      "content": "This is an amazing product! Really helps with my writing.",
      "author": {
        "_id": "507f1f77bcf86cd799439013",
        "name": "John Doe",
        "email": "john@example.com",
        "avatar": "https://res.cloudinary.com/xxx/image/upload/john.jpg"
      },
      "product": "507f1f77bcf86cd799439011",
      "parentComment": null,
      "replies": [],
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  }
}
```

---

### 👤 Get User's Comments

**Endpoint:** `GET /api/comments/user/:userId`  
**Authentication:** Not required

**📝 Example Request:**

```bash
GET /api/comments/user/507f1f77bcf86cd799439013
```

**📥 Success Response (200):**

```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "_id": "507f1f77bcf86cd799439020",
        "content": "This is an amazing product!",
        "author": {
          "_id": "507f1f77bcf86cd799439013",
          "name": "John Doe",
          "email": "john@example.com",
          "avatar": "https://res.cloudinary.com/xxx/image/upload/john.jpg"
        },
        "product": {
          "_id": "507f1f77bcf86cd799439011",
          "name": "AI Writing Assistant",
          "logo": "https://res.cloudinary.com/xxx/image/upload/logo.jpg"
        },
        "createdAt": "2024-01-15T11:00:00.000Z",
        "updatedAt": "2024-01-15T11:00:00.000Z"
      }
    ]
  }
}
```

---

## 🗄️ Database Schema Documentation

### 👤 User Model

```javascript
{
  _id: ObjectId,                          // Auto-generated MongoDB ID
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    // Hashed using bcryptjs before storage
  },
  avatar: {
    type: String,
    default: "",
    // Cloudinary URL for user profile picture
  },
  bio: {
    type: String,
    maxlength: 200,
    default: ""
  },
  createdAt: Date,                        // Auto-generated timestamp
  updatedAt: Date                         // Auto-updated timestamp
}
```

**Indexes:**

- `email`: Unique index for faster lookup and duplicate prevention

**Methods:**

- `comparePassword(plainPassword)`: Compare plain text password with hashed password
- `pre('save')`: Automatically hash password before saving to database

---

### 📦 Product Model

```javascript
{
  _id: ObjectId,                          // Auto-generated MongoDB ID
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  tagline: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  websiteUrl: {
    type: String,
    required: true,
    // Validated to be a proper URL format
  },
  logo: {
    type: String,
    required: true,
    // Cloudinary URL for product logo
  },
  images: [{
    type: String,
    required: true,
    // Array of Cloudinary URLs for product images
  }],
  category: {
    type: String,
    required: true,
    enum: [
      "AI", "SaaS", "Devtools", "Productivity", "Design",
      "Marketing", "Finance", "Education", "Health", "Gaming", "Other"
    ]
  },
  submittedBy: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  upvotes: [{
    user: {
      type: ObjectId,
      ref: "User"
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  upvoteCount: {
    type: Number,
    default: 0,
    // Automatically calculated from upvotes array length
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "approved"
  },
  createdAt: Date,                        // Auto-generated timestamp
  updatedAt: Date                         // Auto-updated timestamp
}
```

**Indexes:**

- `category`: Index for faster category filtering
- `upvoteCount`: Descending index for trending sort
- `createdAt`: Descending index for latest sort
- `upvotes.user`: Index for faster upvote lookup

**Validation:**

- `images`: Must have at least one image
- `websiteUrl`: Must be valid URL format
- `upvoteCount`: Automatically updated when upvotes array changes

---

### 💬 Comment Model

```javascript
{
  _id: ObjectId,                          // Auto-generated MongoDB ID
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  author: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  product: {
    type: ObjectId,
    ref: "Product",
    required: true
  },
  parentComment: {
    type: ObjectId,
    ref: "Comment",
    default: null,
    // null for top-level comments, ObjectId for replies
  },
  replies: [{
    type: ObjectId,
    ref: "Comment"
    // Array of reply comment IDs
  }],
  createdAt: Date,                        // Auto-generated timestamp
  updatedAt: Date                         // Auto-updated timestamp
}
```

**Indexes:**

- `product, createdAt`: Compound index for fetching product comments chronologically
- `author`: Index for fetching user's comments
- `parentComment`: Index for fetching comment replies

**Relationships:**

- Hierarchical structure: Top-level comments have `parentComment: null`
- Replies reference their parent via `parentComment` field
- Parent comments track their replies in `replies` array

---

## 🔐 Authentication & Security

### 🔑 JWT Token Management

**Token Generation:**

- **Algorithm:** HS256 (HMAC SHA-256)
- **Expiration:** 7 days (configurable via `JWT_EXPIRE`)
- **Payload:** User ID only (minimal data for security)
- **Secret:** Stored in environment variable `JWT_SECRET`

**Token Delivery:**

- **HTTP-Only Cookies:** Primary method (secure, prevents XSS)
- **Authorization Header:** Alternative method (`Bearer <token>`)
- **Cookie Options:**
  - `httpOnly: true` (prevents JavaScript access)
  - `secure: true` (HTTPS only in production)
  - `sameSite: 'strict'` (CSRF protection)

**Token Validation:**

- Middleware validates tokens on protected routes
- Automatic user object injection into `req.user`
- Graceful error handling for expired/invalid tokens

### 🛡️ Security Features

**Password Security:**

- Minimum 6 characters requirement
- bcryptjs hashing with salt rounds: 10
- Passwords never returned in API responses

**Input Validation:**

- Request body validation using custom middleware
- MongoDB injection prevention
- XSS protection through input sanitization
- File upload restrictions (type, size, quantity)

**CORS Configuration:**

- Configurable origin whitelist via `FRONTEND_URL`
- Credentials support for cookie-based auth
- Preflight request handling

**Error Handling:**

- Consistent error response format
- No sensitive information in error messages
- Development vs production error details

---

## 📁 File Upload System

### 🖼️ Cloudinary Integration

**Configuration:**

```javascript
// Required environment variables
CLOUDINARY_CLOUD_NAME = your_cloud_name;
CLOUDINARY_API_KEY = your_api_key;
CLOUDINARY_API_SECRET = your_api_secret;
```

**Upload Process:**

1. **Local Storage:** Files temporarily stored in `public/` directory
2. **Validation:** File type, size, and quantity validation
3. **Cloud Upload:** Files uploaded to Cloudinary via API
4. **URL Storage:** Cloudinary URLs stored in MongoDB
5. **Cleanup:** Local files deleted after successful upload

**File Restrictions:**

- **Allowed Types:** JPEG, JPG, PNG, GIF, WebP
- **Maximum Size:** 5MB per file
- **Product Logo:** 1 file required
- **Product Images:** 1-5 files required
- **User Avatar:** 1 file required

**Upload Endpoints:**

- `/api/auth/register` - Avatar upload (required)
- `/api/products` - Logo + images upload (required)

---

## 🚀 Deployment Guide

### 🌐 Production Environment Setup

**Environment Variables:**

```env
# Production Configuration
NODE_ENV=production
PORT=5000

# Database (Use MongoDB Atlas for production)
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/kulp-prod

# Security (Use strong, unique values)
JWT_SECRET=super_secure_64_character_random_string_for_production_use
JWT_EXPIRE=7d

# Frontend (Your actual domain)
FRONTEND_URL=https://your-domain.com

# Cloudinary (Production account recommended)
CLOUDINARY_CLOUD_NAME=prod_cloud_name
CLOUDINARY_API_KEY=prod_api_key
CLOUDINARY_API_SECRET=prod_api_secret
```

### 📋 Pre-Deployment Checklist

- [ ] **Security:** Strong JWT_SECRET (minimum 32 characters)
- [ ] **Database:** Production MongoDB setup (Atlas recommended)
- [ ] **Environment:** All environment variables configured
- [ ] **CORS:** FRONTEND_URL set to actual domain
- [ ] **Cloudinary:** Production account and credentials
- [ ] **SSL:** HTTPS certificate configured
- [ ] **Process Manager:** PM2 or similar for production
- [ ] **Reverse Proxy:** Nginx or Apache configuration
- [ ] **Monitoring:** Error tracking and logging setup
- [ ] **Backup:** Database backup strategy in place

### 🖥️ Server Commands

```bash
# Production start
npm start

# Process management with PM2
npm install -g pm2
pm2 start src/index.js --name kulp-api
pm2 startup
pm2 save

# Check logs
pm2 logs kulp-api

# Restart application
pm2 restart kulp-api
```

---

## 🧪 Testing & Development

### 📋 Available Scripts

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Install dependencies
npm install
```

### 🔧 Development Tools

**Recommended VS Code Extensions:**

- REST Client (for API testing)
- MongoDB for VS Code
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter

**API Testing Tools:**

- **Postman:** Full-featured API testing suite
- **Thunder Client:** VS Code extension
- **curl:** Command-line testing
- **Insomnia:** Alternative to Postman

### 📝 Sample API Test Collection

**Postman Collection Import:**
Create a new collection with these requests for quick testing:

1. **Auth Flow:**

   - POST Register User
   - POST Login User
   - GET Current User Profile
   - PUT Update Profile
   - POST Logout

2. **Product Flow:**

   - GET All Products
   - GET Single Product
   - POST Create Product
   - POST Toggle Upvote
   - DELETE Product
   - GET User Products
   - GET Categories

3. **Comment Flow:**
   - GET Product Comments
   - POST Create Comment
   - POST Create Reply
   - GET User Comments

---

## ❌ Error Handling Reference

### 🚨 Common Error Responses

**400 Bad Request - Validation Errors:**

```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

**401 Unauthorized - Authentication Required:**

```json
{
  "success": false,
  "message": "Access denied. No token provided"
}
```

**403 Forbidden - Insufficient Permissions:**

```json
{
  "success": false,
  "message": "Not authorized to delete this product"
}
```

**404 Not Found - Resource Not Found:**

```json
{
  "success": false,
  "message": "Product not found"
}
```

**409 Conflict - Duplicate Resource:**

```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

**500 Internal Server Error:**

```json
{
  "success": false,
  "message": "Server error while creating product"
}
```

### 🛠️ Debugging Tips

**Common Issues & Solutions:**

1. **Token Issues:**

   - Check Authorization header format: `Bearer <token>`
   - Verify token hasn't expired (7 days default)
   - Ensure JWT_SECRET is consistent

2. **File Upload Issues:**

   - Verify Content-Type is `multipart/form-data`
   - Check file size limits (5MB max)
   - Ensure required files are included

3. **Database Connection:**

   - Verify MONGODB_URL format
   - Check network connectivity
   - Ensure database user has proper permissions

4. **Cloudinary Issues:**
   - Verify all three credentials are correct
   - Check Cloudinary dashboard for errors
   - Ensure account has sufficient storage/bandwidth

---

## 📞 Support & Contributing

### 🤝 Contributing Guidelines

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### 📋 Development Standards

- **Code Style:** Consistent formatting and naming conventions
- **Error Handling:** Comprehensive try-catch blocks
- **Validation:** Input validation on all endpoints
- **Documentation:** Update README for new features
- **Testing:** Test all endpoints before submission

### 🐛 Bug Reports

When reporting bugs, please include:

- **Environment:** Development/Production
- **Request Details:** Method, URL, headers, body
- **Expected Behavior:** What should happen
- **Actual Behavior:** What actually happens
- **Error Messages:** Complete error responses
- **Steps to Reproduce:** Detailed reproduction steps

### 💡 Feature Requests

For new features, please describe:

- **Use Case:** Why this feature is needed
- **Functionality:** Detailed feature description
- **API Design:** Proposed endpoint structure
- **Impact:** How it affects existing functionality

---

## 📄 License & Legal

This project is licensed under the **ISC License**.

### 📜 Third-Party Licenses

- **Express.js:** MIT License
- **MongoDB/Mongoose:** MIT License
- **bcryptjs:** MIT License
- **jsonwebtoken:** MIT License
- **Cloudinary:** Commercial License
- **CORS:** MIT License
- **Multer:** MIT License

---

**🎉 Happy coding! Build something amazing with this API! 🚀**

---

_For additional support, create an issue in the repository or contact the development team._
