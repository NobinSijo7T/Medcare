# User Authentication & Profile System - Setup Guide

## Overview
A complete user authentication and profile management system has been added to your Pharmacy Management Application with:
- Modern dark-themed Login page (matching the provided design)
- Sign Up page
- User Profile page with order history
- Protected routes
- JWT authentication
- Order tracking system

## What's Been Added

### Frontend Components

#### 1. **Login Screen** (`/login`)
- Modern dark theme design matching the screenshot
- Email and password authentication
- Social login buttons (Twitter, GitHub)
- SSO integration option
- Forgot password link
- Redirects after login

#### 2. **Sign Up Screen** (`/signup`)
- User registration with name, email, and password
- Password confirmation validation
- Social registration options
- Auto-login after registration

#### 3. **Profile Screen** (`/profile`)
- View user profile information
- Edit profile (name, email, password)
- Order history with status tracking
- Order status badges (Delivered, Shipped, Processing, Pending, Cancelled)
- View order details
- Protected route (requires login)

#### 4. **Updated Navbar**
- User profile dropdown menu
- Login/Logout functionality
- "My Orders" quick link
- Profile link
- Shows user name when logged in

### Backend Components

#### 1. **User Model** (`backend/models/User.js`)
- User schema with name, email, password, isAdmin
- Password hashing with bcryptjs
- Password comparison method

#### 2. **Order Model** (`backend/models/Order.js`)
- Order items, shipping address, payment info
- Order status (Pending, Processing, Shipped, Delivered, Cancelled)
- Total price calculation
- User reference

#### 3. **Authentication Middleware** (`backend/middleware/authMiddleware.js`)
- JWT token verification
- Protected route middleware

#### 4. **User Routes** (`backend/routes/userRoutes.js`)
- POST `/api/users/login` - Login
- POST `/api/users` - Register
- GET `/api/users/profile` - Get user profile (protected)
- PUT `/api/users/profile` - Update user profile (protected)
- GET `/api/users/:id` - Get user by ID (protected)

#### 5. **Order Routes** (`backend/routes/orderRoutes.js`)
- POST `/api/orders` - Create order (protected)
- GET `/api/orders/myorders` - Get user orders (protected)
- GET `/api/orders/:id` - Get order by ID (protected)
- PUT `/api/orders/:id/pay` - Update order to paid (protected)
- PUT `/api/orders/:id/status` - Update order status (protected)

### Redux State Management

- User authentication state
- Order state
- Profile update state
- Persistent login (localStorage)

## Installation Steps

1. **Install Backend Dependencies**
```bash
npm install
```

The following packages have been added:
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation and verification

2. **Environment Variables**
Add the following to your `.env` file:
```
JWT_SECRET=your_jwt_secret_key_here
```

3. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

4. **Start the Application**

Backend:
```bash
npm run start:dev
```

Frontend:
```bash
cd frontend
npm start
```

## Usage

### For Users

1. **Sign Up**:
   - Click "Login" in the navbar
   - Click "Create one" to go to sign up page
   - Fill in name, email, and password
   - Click "Create Account"

2. **Login**:
   - Click "Login" in the navbar
   - Enter email and password
   - Click "Sign in"

3. **View Profile**:
   - After login, click on your name in the navbar
   - Select "Profile" from dropdown
   - View your order history
   - Edit your profile information

4. **Place Orders**:
   - Add items to cart
   - Proceed to checkout
   - Orders will appear in your profile

### For Developers

#### Protected Routes
To protect a route, use the `protect` middleware:
```javascript
const { protect } = require("./backend/middleware/authMiddleware");
router.get("/protected", protect, yourController);
```

#### Access User Info in Backend
```javascript
const someController = async (req, res) => {
  const userId = req.user._id;
  const userEmail = req.user.email;
  // Use user info...
};
```

#### Access User Info in Frontend
```javascript
import { useSelector } from "react-redux";

const YourComponent = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  
  if (userInfo) {
    console.log(userInfo.name, userInfo.email);
  }
};
```

## Features

✅ Secure password hashing
✅ JWT token authentication
✅ Protected routes
✅ Persistent login sessions
✅ Order tracking with status updates
✅ Profile editing
✅ Responsive design
✅ Modern dark theme UI
✅ Social login integration ready
✅ Dropdown user menu

## API Endpoints

### Authentication
- `POST /api/users/login` - Login user
- `POST /api/users` - Register user

### User Profile
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id` - Get user by ID

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/myorders` - Get logged-in user's orders
- `GET /api/orders/:id` - Get specific order
- `PUT /api/orders/:id/pay` - Mark order as paid
- `PUT /api/orders/:id/status` - Update order status

## Order Status Flow

1. **Pending** - Order placed, awaiting processing
2. **Processing** - Order is being prepared
3. **Shipped** - Order has been dispatched
4. **Delivered** - Order successfully delivered
5. **Cancelled** - Order cancelled

## Security Features

- Passwords are hashed using bcryptjs
- JWT tokens expire after 30 days
- Protected routes require valid JWT token
- User passwords never exposed in API responses
- Token stored securely in localStorage

## Troubleshooting

### "Not authorized, no token"
- Ensure user is logged in
- Check if JWT_SECRET is set in .env
- Verify token is being sent in Authorization header

### "User already exists"
- Email is already registered
- Use different email or login instead

### Orders not showing
- Ensure user is logged in
- Create test orders from cart
- Check MongoDB connection

## Future Enhancements

- Email verification
- Password reset functionality
- OAuth integration (Google, Facebook)
- Admin panel for order management
- Email notifications for order status
- Order cancellation for users
- Invoice generation
- Wishlist functionality

## Support

For issues or questions, check:
1. Console for error messages
2. Network tab for API errors
3. Redux DevTools for state issues
4. MongoDB for data persistence

Enjoy your new authentication system! 🎉
