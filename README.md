# 🛍️ TechMart - Modern E-Commerce Platform

A sophisticated e-commerce platform built with Go (Gin) backend and React frontend, featuring advanced user authentication, product management, intelligent cart operations, and seamless order processing.

## 📖 Overview

TechMart delivers a premium shopping experience with cutting-edge features:
- **Advanced Authentication**: Secure JWT-based login/signup with session management
- **Smart Product Management**: Intelligent product browsing with advanced filtering
- **Dynamic Cart Operations**: Real-time cart updates with quantity management
- **Order Processing**: Streamlined checkout with order history tracking
- **Live Updates**: Real-time cart count and status synchronization
- **Responsive Design**: Modern, accessible UI with Tailwind CSS and shadcn/ui

## 🔧 Tech Stack

### Backend
- **Go** - High-performance programming language
- **Gin** - Lightning-fast HTTP web framework
- **GORM** - Powerful ORM for database operations
- **SQLite** - Reliable database (in-memory for tests, file-based for production)
- **JWT** - Secure JSON Web Tokens for authentication
- **bcrypt** - Military-grade password hashing
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **React 18** - Modern UI framework with hooks
- **TypeScript** - Type-safe development
- **Vite** - Ultra-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **React Router DOM** - Declarative routing
- **React Query** - Intelligent data fetching and caching
- **Axios** - Promise-based HTTP client
- **Lucide React** - Beautiful icon library

### Testing
- **Go Testing** - Comprehensive testing framework
- **testify/assert** - Powerful assertion library
- **httptest** - HTTP testing utilities
- **SQLite in-memory** - Isolated test database

## 🚀 Quick Start

### Prerequisites
- Go 1.21+ installed
- Node.js 18+ installed
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Go dependencies:**
   ```bash
   go mod tidy
   ```

3. **Build the application:**
   ```bash
   go build -o techmart.exe
   ```

4. **Run the server:**
   ```bash
   ./techmart.exe
   ```
   The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:3000`

### Running Both Services

1. **Terminal 1 - Backend:**
   ```bash
   cd backend
   go run main.go
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

## 🔑 Authentication

### JWT Token Flow

1. **Signup**: Create a new user account
   ```bash
   POST /users
   {
     "username": "your_username",
     "password": "your_password"
   }
   ```

2. **Login**: Get JWT token
   ```bash
   POST /users/login
   {
     "username": "your_username",
     "password": "your_password"
   }
   ```
   Response includes the JWT token.

3. **Use Token**: Include in Authorization header
   ```bash
   Authorization: Bearer <your_jwt_token>
   ```

### Single Session Policy
- Each user can only be logged in from one device at a time
- New login invalidates previous tokens
- Tokens are stored in the database for validation

## 🧪 Testing

### Backend Tests

The application includes comprehensive test coverage using Go's standard testing framework:

**Run all tests:**
```bash
cd backend
go test ./tests/... -v
```

**Run specific test categories:**
```bash
# User API tests
go test -run TestUserSignup -v
go test -run TestUserLogin -v

# Cart API tests
go test -run TestCartAPI -v
go test -run TestGetCart -v

# Order API tests
go test -run TestCreateOrder -v
go test -run TestListOrders -v
```

**Test Coverage:**
- ✅ **User API**: Signup, login, list users (6 tests)
- ✅ **Cart API**: Add/remove items, get cart (6 tests)
- ✅ **Order API**: Create orders, list orders, data integrity (7 tests)

**Test Features:**
- In-memory SQLite database for isolated testing
- HTTP client calls against Gin router for integration testing
- Proper cleanup before each test
- Realistic test scenarios with password hashing
- Comprehensive error handling tests

### Frontend Testing

The frontend includes:
- TypeScript for type safety
- React Query for data management
- Error boundaries for graceful error handling
- Loading states and user feedback

## 📂 Project Structure

```
techmart-platform/
├── backend/
│   ├── controllers/     # HTTP request handlers
│   ├── models/         # Database models (User, Item, Cart, Order)
│   ├── routes/         # API route definitions
│   ├── middlewares/    # Authentication middleware
│   ├── utils/          # Database connection, JWT utilities
│   ├── tests/          # Test files
│   └── main.go         # Application entry point
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API service functions
│   │   ├── hooks/      # Custom React hooks
│   │   └── lib/        # Utility functions
│   ├── public/         # Static assets
│   └── package.json    # Frontend dependencies
└── README.md           # This file
```

## 📬 API Documentation

### Base URL
```
http://localhost:8080
```

### Authentication Endpoints

#### POST /users
**Create a new user account**
```bash
POST /users
Content-Type: application/json

{
  "username": "john_doe",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### POST /users/login
**Login and get JWT token**
```bash
POST /users/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET /users
**List all users (requires authentication)**
```bash
GET /users
Authorization: Bearer <jwt_token>
```

### Product Endpoints

#### GET /items
**List all available products**
```bash
GET /items
```

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "name": "Gaming Laptop",
      "description": "High-performance gaming laptop",
      "price": 1299.99,
      "category": "Electronics",
      "rating": 4.5,
      "reviews": 10,
      "image": "https://example.com/laptop.jpg",
      "in_stock": true
    }
  ]
}
```

#### POST /items
**Create a new product (requires authentication)**
```bash
POST /items
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "New Product",
  "description": "Product description",
  "price": 29.99,
  "category": "Electronics"
}
```

#### DELETE /items/:id
**Delete a product (requires authentication)**
```bash
DELETE /items/1
Authorization: Bearer <jwt_token>
```

### Cart Endpoints

#### POST /carts
**Add item to cart (requires authentication)**
```bash
POST /carts
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "item_id": 1,
  "quantity": 2
}
```

**Response:**
```json
{
  "message": "Item added to cart successfully",
  "cart": {
    "id": 1,
    "user_id": 1,
    "items": [
      {
        "id": 1,
        "item_id": 1,
        "quantity": 2,
        "price": 1299.99,
        "item": {
          "name": "Gaming Laptop",
          "price": 1299.99
        }
      }
    ]
  }
}
```

#### GET /carts
**Get user's cart (requires authentication)**
```bash
GET /carts
Authorization: Bearer <jwt_token>
```

#### DELETE /carts
**Remove item from cart (requires authentication)**
```bash
DELETE /carts
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "item_id": 1
}
```

### Order Endpoints

#### POST /orders
**Create order from cart (requires authentication)**
```bash
POST /orders
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "Order created successfully",
  "order": {
    "id": 1,
    "user_id": 1,
    "cart_id": 1,
    "total": 2599.98,
    "created_at": "2024-01-01T00:00:00Z",
    "cart": {
      "items": [
        {
          "item": {
            "name": "Gaming Laptop",
            "price": 1299.99
          },
          "quantity": 2,
          "price": 1299.99
        }
      ]
    }
  }
}
```

#### GET /orders
**List user's orders (requires authentication)**
```bash
GET /orders
Authorization: Bearer <jwt_token>
```

### Error Responses

All endpoints return appropriate HTTP status codes:

- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource
- `500 Internal Server Error` - Server error

**Error Response Format:**
```json
{
  "error": "Error message description"
}
```

## 🎯 Features

### ✅ Implemented Features
- User registration and authentication
- JWT token-based security
- Product browsing and management
- Shopping cart functionality
- Order creation and history
- Real-time cart updates
- Responsive design
- Comprehensive test coverage
- Error handling and validation

### 🔄 Real-time Features
- Live cart count in navigation
- Automatic cart updates
- Order status tracking
- User session management

** Built with ❤️ by Alex Chen  🛍️✨**
