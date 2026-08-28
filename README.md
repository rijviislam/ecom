# E-commerce Storefront

A modern, responsive customer-facing e-commerce storefront built as a frontend UI assessment for **Neo Nexor**.

The project focuses on creating a polished and realistic shopping experience using local mock data, reusable components, client-side persistence, responsive layouts, and complete e-commerce user flows.

## 🔗 Live Demo

**Live Website:**
https://ecom-mu-snowy.vercel.app

## 📦 GitHub Repository

**Repository:**
https://github.com/rijviislam/ecom
---

## ✨ Overview

This project is a frontend-only e-commerce storefront built with Next.js and local mock data.

The assessment was designed without a backend, so the application uses local JSON data to represent products and other store information. Browser `localStorage` is used to persist customer-side shopping data such as cart and wishlist items.

The main focus of the project was:

* Modern UI/UX
* Responsive design
* Reusable components
* E-commerce user flows
* Client-side state handling
* Persistent cart and wishlist
* Form validation
* Order management UI
* Order tracking
* Empty and success states

The provided API guideline and Postman collection were used as references for understanding realistic e-commerce data structures and order lifecycles.

---

## 🚀 Features

### 🏠 Storefront

* Hero section
* Product categories
* Best-selling products
* Product sections
* Promotional content
* FAQ section
* Newsletter section
* Responsive navigation
* Responsive footer

### 🛍️ Product Details

* Product image gallery
* Product information
* Regular and sale pricing
* Discount information
* Add to cart
* Add/remove from wishlist
* Product actions

### 🔎 Search & Filtering

* Search products by name
* Category filtering
* Price filtering
* Product sorting
* Empty search-result state

### 🛒 Cart

* Add products to cart
* Increase/decrease quantity
* Remove products
* Live subtotal calculation
* Order total calculation
* Persistent cart using `localStorage`
* Empty cart state

### ❤️ Wishlist

* Add/remove products
* Wishlist product listing
* Move products to cart
* Persistent wishlist using `localStorage`
* Empty wishlist state

### 💳 Checkout

* Customer information
* Shipping address
* Order summary
* Form validation
* Order placement flow
* Order confirmation
* Success state

### 📋 My Orders

* View customer orders
* Filter orders by status
* View order details
* Order summary and pricing information
* Different order states

### 🚚 Order Tracking

* Order status timeline
* Order progress visualization
* Order lifecycle states
* Individual order tracking

---

## 🧰 Tech Stack

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **Lucide React**
* **Local JSON**
* **LocalStorage**

---

## 📁 Project Structure

```text
app/
├── page.tsx
├── products/
├── cart/
├── wishlist/
├── checkout/
├── orders/
└── tracking/

components/
├── product/
├── cart/
├── checkout/
├── orders/
├── wishlist/
└── ui/

data/
└── products.json

lib/
├── data.ts
└── productAction.ts

hooks/
└── ...

types/
└── ...
```

---

## 📊 Data Architecture

This project does not use an external database or backend API.

Product and store data are managed through local JSON files.

```text
data/
└── products.json
```

The provided API guideline was used as a reference to understand realistic e-commerce data structures, product information, order statuses, pricing, and related concepts.

The frontend then consumes this local data to power the storefront and product-related experiences.

---

## 💾 State & Persistence

The project uses client-side state handling for interactive shopping features.

Customer-specific shopping data is persisted using browser `localStorage`.

### Persisted Data

* Cart items
* Cart quantities
* Wishlist items

This ensures that refreshing the page does not remove the customer's cart or wishlist data.

### Why LocalStorage?

The assessment was intentionally frontend-only and required local mock data instead of a production backend.

`localStorage` provides a lightweight way to persist client-side shopping state without requiring an external database or API.

In a production application, this data would typically be synchronized with a backend and associated with an authenticated customer account.

---

## 🧩 Reusable Components

The project uses reusable components to keep the interface consistent and maintainable across different pages and e-commerce flows.

Components are organized by functionality:

* Product components
* Cart components
* Checkout components
* Order components
* Wishlist components
* Common UI components

This structure helps reduce duplicated code and makes individual features easier to maintain and extend.

---

## 🎨 Design Approach

The project was designed with a focus on creating a modern and visually polished e-commerce experience rather than a simple product grid.

### Design principles

* Clear visual hierarchy
* Consistent spacing
* Strong product presentation
* Responsive layouts
* Clean typography
* Subtle borders and shadows
* Clear call-to-action elements
* Consistent component patterns
* Purposeful user interactions

The layout and visual direction were designed to provide a smooth browsing and shopping experience across different screen sizes.

---

## 🖱️ Interaction & UI

The interface focuses on clear and responsive interactions without relying on heavy animation.

Examples include:

* Product hover states
* Cart drawer interactions
* Wishlist interactions
* Quantity controls
* Interactive filters
* Sorting controls
* Form validation feedback
* Order status indicators
* Empty states
* Success states

The goal was to keep interactions simple, intuitive, and consistent throughout the storefront.

---

## 📱 Responsive Design

The storefront is designed to work across:

* Mobile
* Tablet
* Desktop
* Large desktop screens

Special attention was given to mobile usability, including:

* Responsive navigation
* Product grids
* Product details
* Cart
* Checkout forms
* Filters
* Order pages
* Order tracking
* Footer

---

## ⚠️ Assumptions & Limitations

This project is intentionally frontend-only.

### No Backend

There is no production backend or external API connected to the application.

### Mock Data

Product and store information are represented using local JSON data.

### Client-side Persistence

Cart and wishlist data are persisted using browser `localStorage`.

### Mock Checkout

Checkout simulates the order placement experience and does not process real payments.

### No Real Authentication

Customer authentication is not connected to a production authentication provider.

### No Real Inventory

Product availability is based on the local mock data.

---

## 🔮 Production Improvements

If this project were extended into a production e-commerce application, the following could be added:

* Backend API integration
* Database integration
* Customer authentication
* Server-side cart persistence
* Real order creation
* Payment gateway integration
* Product inventory management
* Customer account management
* Server-side search and filtering
* Product reviews and ratings
* Coupon and promotion system
* Email notifications
* Analytics
* Error monitoring

---

## 🛠️ Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm

### Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate to the project directory:

```bash
cd YOUR_PROJECT_NAME
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:3000
```

---

## 🏗️ Production Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

---

## 📌 Assessment Context

This project was created as a **Frontend UI Designer assessment for Neo Nexor**.

The assessment required a customer-facing e-commerce storefront built entirely on the frontend using local mock data.

The main e-commerce flows implemented are:

1. Storefront / Home
2. Product Details
3. Search & Filter
4. Cart
5. Checkout
6. My Orders
7. Order Tracking
8. Wishlist

The project was developed with a strong focus on visual design, usability, responsiveness, reusable components, realistic e-commerce interactions, and client-side persistence.

---

## 👨‍💻 Author

**Rijvi Islam**

Frontend Developer

Built with Next.js, React, and Tailwind CSS.
