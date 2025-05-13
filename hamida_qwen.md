Certainly! Based on the **Software Requirements Document (SRD)** you've provided for **Tuuziane**, I'll now extract and formalize the **Functional Requirements** and create a clear **Logic Flow** that describes how the system will operate.

---

## 📌 FUNCTIONAL REQUIREMENTS

Here are the core functional requirements derived from the document:

### 1. USER MANAGEMENT
- Users can register and log in via mobile app or web portal.
- User roles include:
  - Customer (Buyer)
  - Shopkeeper
  - Driver (for delivery, if integrated)
  - Admin (.AI Company Management)

### 2. PRODUCT MANAGEMENT (Shopkeeper Role)
- Shopkeepers can upload products with:
  - Name, Description, Price, Category, Images
  - Mandatory fields: Warranty, Size (if applicable), Product details
- Unlimited product posts under a monthly subscription
- Edit/Delete/Update product listings

### 3. SHOP MANAGEMENT
- Shopkeepers can manage their shop profile:
  - Business name, Location, Contact info
  - Manage inventory and availability
- View sales reports and transaction history

### 4. SHOPPING EXPERIENCE (Customer Role)
- Customers can:
  - Browse/search products by category/name/shop
  - View detailed product info including warranty and size
  - Compare prices across multiple shops
  - Add items to cart and proceed to checkout
  - Apply filters (price range, ratings, location, etc.)

### 5. AI-BASED RECOMMENDATION ENGINE
- Rule-based machine learning model for associative analysis
- Recommends products based on:
  - Previous purchases
  - Products commonly bought together
- Requires at least 100 transactions before activation
- Model accuracy is tested using various rule algorithms; best performing one is selected

### 6. PAYMENT SYSTEM
- Subscription payments:
  - Shopkeepers: Tsh30,000/month
  - Subscriptions deducted automatically from wallet
- Wallet System:
  - Top-up via mobile money integration
  - Auto-deactivation if insufficient balance
- Secure payment gateway for customer purchases
- Money is only transferred to shopkeeper after customer confirmation of satisfaction

### 7. REVIEW & RATING SYSTEM
- Customers can rate and review:
  - Products
  - Shops
- Reviews help build trust and influence purchase decisions
- Shopkeepers can view and respond to reviews

### 8. ORDER & DELIVERY MANAGEMENT
- Orders are processed once payment is confirmed
- Delivery status tracking (if driver module is included)
- Returns/refunds handled through system support team

### 9. NOTIFICATIONS & ALERTS
- Push notifications for:
  - Order status updates
  - Payment reminders
  - Promotions, discounts (future feature)
  - New product alerts

### 10. ADMIN MODULE
- Monitor system usage and performance
- Handle disputes between customers and shopkeepers
- Analyze user reviews for potential improvements
- Manage subscriptions and wallets
- Oversee server storage and scalability needs

---

## 🔁 LOGIC FLOW OF TUUZIANE SYSTEM

This section outlines how the system works from user registration to product delivery.

---

### 🔄 1. USER REGISTRATION & LOGIN
- User opens the app/web portal
- Selects role (customer, shopkeeper, admin)
- Registers using phone/email + password
- Verification via SMS or Email
- Login using credentials

---

### 🔄 2. SHOPKEEPER ACTIVITIES
- After login, shopkeeper uploads products with full description
- Sets price, stock, and other necessary attributes
- Can list unlimited products under paid monthly subscription
- Received payments go to wallet (after customer confirmation)
- If wallet has sufficient balance, subscription is maintained
- Else, account is suspended until top-up

---

### 🔄 3. CUSTOMER SHOPPING FLOW
1. Customer browses products
2. Uses search/filter options to find desired items
3. Views item details, including descriptions and shop reviews
4. Adds items to cart
5. Proceeds to checkout
6. Selects preferred shop (based on rating, price, etc.)
7. Confirms order and pays securely
8. Receives order confirmation notification
9. Once order fulfilled and received, confirms satisfaction
10. Shopkeeper receives payment upon confirmation

---

### 🔄 4. AI RECOMMENDATION FLOW
1. System collects transaction data
2. When >100 transactions available, model is trained
3. Multiple rule-based ML models are tested
4. Best performer is deployed
5. Model analyzes buying patterns
6. Suggests related products during browsing and checkout

---

### 🔄 5. REVIEWS AND RATINGS
1. After receiving product, customer rates experience
2. Review is published on shop and product page
3. Other users see reviews before purchasing
4. Shopkeeper can view feedback and improve services

---

### 🔄 6. SUBSCRIPTIONS & WALLET MANAGEMENT
1. Shopkeeper's wallet auto-debited monthly
2. If balance is sufficient → active subscription
3. If not → account deactivated until recharge
4. Recharged via mobile money (integration with local providers)
5. Admin monitors transactions and manages disputes

---

### 🔄 7. SERVER SCALING & BACKUPS
1. Daily backup of all data
2. Server storage monitored daily
3. Upgrade server as needed based on traffic and transactions
4. System undergoes periodic testing (performance, security, functionality)

---

## ✅ Version 1.0 Scope Summary

| Feature | Status |
|--------|--------|
| Mobile App (iOS & Android) | ✅ Included |
| Web Portal | ✅ Included |
| Product Listing & Upload | ✅ Included |
| Shopping Cart & Checkout | ✅ Included |
| AI-Based Recommendation | ✅ Conditional (after 100+ transactions) |
| Chat Support (Future) | ❌ Not in V1 |
| Live Delivery Tracking | ❌ Optional, depends on drivers’ module |
| Discounts & Promotions | ❌ Not included in V1 |
| Advanced Analytics Dashboard | ❌ Future upgrade |

---

## 📄 Final Notes for PDF Inclusion

You should structure your final SRD PDF like this:

1. **Title Page**
2. **Overview**
3. **Problem Statement**
4. **Project Scope**
5. **Feasibility Study**
   - Technical
   - Financial
   - Operational
6. **Functional Requirements**
7. **System Logic Flow**
8. **Appendices (Optional)**
   - Use Case Diagrams
   - UI Mockups
   - Technology Stack

---
