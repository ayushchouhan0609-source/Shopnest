# ShopNest

A full-stack e-commerce prototype built with a React frontend and Node/Express backend.

## Project Structure

- `Backend/` - Express server, MongoDB models, controllers, routes, and authentication
- `frontend/` - React app with Redux state management and routing

## Features

- Product listing and product details
- User authentication and role-based access
- Shopping cart state management
- Backend API with MongoDB and Cloudinary image support
- Payment integration with Razorpay

## Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB URI
- Cloudinary account
- Razorpay credentials

## Setup

1. Clone the repository

```bash
git clone <your-repo-url>
cd Shopnest
```

2. Install dependencies for backend and frontend

```bash
npm run install
```

3. Create a `.env` file in the `Backend/` folder with the following variables:

```bash
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
RAZORPAY_KEY_ID=<your-razorpay-key-id>
RAZORPAY_KEY_SECRET=<your-razorpay-key-secret>
EMAIL_USER=<your-email-address>
EMAIL_PASS=<your-email-password>
```

4. Seed initial data (optional but useful for testing)

```bash
cd Backend
npm run seed
```

## Running the App

From the root project folder:

```bash
npm run dev
```

This will start:

- backend server on `http://localhost:5000`
- frontend app on `http://localhost:3000` (or another available port)

### Individual services

- Start backend only:

```bash
cd Backend
npm run dev
```

- Start frontend only:

```bash
cd frontend
npm start
```

## Available Scripts

From the root:

- `npm run install` - Install backend and frontend dependencies
- `npm run dev:server` - Start backend server
- `npm run dev:client` - Start frontend app
- `npm run dev` - Start both backend and frontend concurrently
- `npm run build` - Build backend project (if configured)

From `Backend/`:

- `npm run start` - Run backend server
- `npm run dev` - Run backend server with nodemon
- `npm run seed` - Load sample users/products into the database

## Notes

- The frontend uses a proxy to forward API requests to `http://localhost:5000`
- Ensure your backend `.env` is configured before running
- If the frontend starts on a different port, use the port shown in the terminal

## License

This project is released under the ISC License.
