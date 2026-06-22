# Admin API Reference

This document describes the admin API endpoints available in `routes/admin.js` and the associated controller behavior in `controllers/adminController.js`.

## Base Path
`https://nobilmove.server.intelakah.com/api/admin`

## Authentication

### POST https://nobilmove.server.intelakah.com/api/admin/login
- Description: Authenticate as an admin and receive a JWT token.
- Body:
  - `email` (string, required)
  - `password` (string, required)
- Response: `{ message, token, admin: { id, name, email } }`

### POST https://nobilmove.server.intelakah.com/api/admin/forget-password
- Description: Request a password reset OTP for admin email.
- Body:
  - `email` (string, required)
- Response: `{ message }`

### POST https://nobilmove.server.intelakah.com/api/admin/reset-password
- Description: Reset admin password using OTP.
- Body:
  - `email` (string, required)
  - `otp` (string, required)
  - `newPassword` (string, required)
  - `confirmPassword` (string, required)
- Response: `{ message }`

## Customer / Provider Registration

### POST https://nobilmove.server.intelakah.com/api/auth/register/customer
- Description: Create a new customer account.
- Body:
  - `imageProfile` (string, required)
  - `name` (string, required)
  - `userName` (string, required)
  - `phoneNumber` (string, required)
- Response: `{ message, customerId }`

### POST https://nobilmove.server.intelakah.com/api/auth/register/provider
- Description: Create a new service provider account.
- Body:
  - `imageProfile` (string, required)
  - `name` (string, required)
  - `phoneNumber` (string, required)
  - `city` (string, required)
  - `serviceType` (string, required)
  - `nationalId` (file, required)
  - `commercialRegister` (file, required)
  - `vehiclePhotos` (file[], optional)
  - `certificates` (file[], optional)
- Response: `{ message, providerId }`

> All routes below require `authenticate` and `requireRole('Admin')` middleware.

## Admin Profile

### GET https://nobilmove.server.intelakah.com/api/admin/profile
- Description: Get current admin profile.
- Response: Admin object excluding password.

### PUT https://nobilmove.server.intelakah.com/api/admin/profile
- Description: Update admin name and/or email.
- Body:
  - `name` (string, optional)
  - `email` (string, optional)
- Response: `{ message, admin: { id, name, email } }`

### PUT https://nobilmove.server.intelakah.com/api/admin/change-password
- Description: Change current admin password.
- Body:
  - `currentPassword` (string, required)
  - `newPassword` (string, required)
- Response: `{ message }`

### GET https://nobilmove.server.intelakah.com/api/admin/getAllAdmins
- Description: List all admin users.
- Response: Array of admin objects excluding passwords.

### POST https://nobilmove.server.intelakah.com/api/admin/registerAdmin
- Description: Register a new admin user.
- Body:
  - `name` (string, required)
  - `email` (string, required)
  - `password` (string, required)
- Response: `{ message, adminId }`

## Dashboard

### GET https://nobilmove.server.intelakah.com/api/admin/dashboard/stats
- Description: Retrieve dashboard summary metrics.
- Response:
  - `totalOrders`
  - `todayOrders`
  - `totalProviders`
  - `totalCustomers`
  - `totalRevenue`
  - `profit`

### GET https://nobilmove.server.intelakah.com/api/admin/dashboard/orders-by-status
- Description: Retrieve counts and percentages by order status.
- Response: `{ total, data: [{ status, count, percentage }] }`

### GET https://nobilmove.server.intelakah.com/api/admin/dashboard/activities
- Description: Retrieve the 10 most recent activity records.
- Response: Array of `Activity` objects.

## Orders

### GET https://nobilmove.server.intelakah.com/api/admin/orders
- Description: List orders with optional filtering and pagination.
- Query:
  - `status` (string, optional)
  - `search` (string, optional)
  - `page` (number, default `1`)
  - `limit` (number, default `10`)
- Response: `{ total, page, limit, pages, data }`

### GET https://nobilmove.server.intelakah.com/api/admin/orders/:id
- Description: Get order details by ID.
- Response: Order object including customer, provider, and payment.

### PUT https://nobilmove.server.intelakah.com/api/admin/orders/:id/status
- Description: Update an order's status.
- Body:
  - `status` (string, required)
- Response: `{ success, message, data }`

### PUT https://nobilmove.server.intelakah.com/api/admin/orders/:id/assign-provider
- Description: Assign a provider to an order.
- Body:
  - `providerId` (string, required)
- Response: `{ success, message, data }`

### DELETE https://nobilmove.server.intelakah.com/api/admin/orders/:id
- Description: Delete an order.
- Response: `{ success, message }`

## Customers

### GET https://nobilmove.server.intelakah.com/api/admin/customers
- Description: List customers with optional filter and pagination.
- Query:
  - `search` (string, optional)
  - `status` (string, optional) — uses `suspended` to filter suspended customers
  - `page` (number, default `1`)
  - `limit` (number, default `10`)
- Response: `{ total, page, limit, pages, data }`

### GET https://nobilmove.server.intelakah.com/api/admin/customers/:id
- Description: Get customer details by ID.
- Response: Customer object including orders.

### PUT https://nobilmove.server.intelakah.com/api/admin/customers/:id/suspend
- Description: Suspend a customer.
- Response: `{ success, message }`

### DELETE https://nobilmove.server.intelakah.com/api/admin/customers/:id
- Description: Delete a customer.
- Response: `{ success, message }`

## Providers

### GET https://nobilmove.server.intelakah.com/api/admin/providers
- Description: List providers with optional filters and pagination.
- Query:
  - `serviceType` (string, optional)
  - `search` (string, optional)
  - `status` (string, optional)
  - `page` (number, default `1`)
  - `limit` (number, default `10`)
- Response: `{ total, page, limit, pages, data }`

### GET https://nobilmove.server.intelakah.com/api/admin/providers/:id
- Description: Get provider details by ID.
- Response: Provider object including orders.

### PUT https://nobilmove.server.intelakah.com/api/admin/providers/:id/status
- Description: Update a provider's status.
- Body:
  - `status` (string, required)
- Response: `{ success, message, data }`

### DELETE https://nobilmove.server.intelakah.com/api/admin/providers/:id
- Description: Delete a provider.
- Response: `{ success, message }`

## Financial Reports

### GET https://nobilmove.server.intelakah.com/api/admin/reports/transactions
- Description: List payment transactions with optional filter and pagination.
- Query:
  - `status` (string, optional)
  - `method` (string, optional)
  - `search` (string, optional)
  - `page` (number, default `1`)
  - `limit` (number, default `10`)
- Response: `{ total, page, limit, pages, data }`

### GET https://nobilmove.server.intelakah.com/api/admin/reports/revenue
- Description: Get revenue summary metrics.
- Response:
  - `totalRevenue`
  - `totalTransactions`
  - `vat`
  - `profit`
  - `pendingPayments`

### GET https://nobilmove.server.intelakah.com/api/admin/reports/financial-summary
- Description: Get financial summary metrics.
- Response:
  - `orders: { total, completed, cancelled, completionRate }`
  - `revenue: { total, profit, tax }`

## Settings

### GET https://nobilmove.server.intelakah.com/api/admin/settings/pricing
- Description: Get pricing configuration.
- Query:
  - `serviceType` (string, optional)
- Response: single pricing object if `serviceType` provided, otherwise array of pricing configurations.

### PUT https://nobilmove.server.intelakah.com/api/admin/settings/pricing
- Description: Create or update pricing settings.
- Body:
  - `serviceType` (string, optional)
  - `pricePerKilometer` (number)
  - `pricePerSquareMeter` (number)
  - `companyCommissionPercentage` (number)
- Response: `{ message, pricing }`
