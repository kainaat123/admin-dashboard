# 🛒 E-commerce Admin Dashboard (Angular)

This is a front-end project for an **E-commerce Admin Dashboard** built with **Angular** and **Angular Material**.  
It provides insights into **sales, inventory**, and **product management**, using mock data via `json-server`.

## 🔗 Live Demo
https://dashboard-ecommerce-admin.netlify.app/#/authentication

## 📁 Features

- **Login Page** (no auth logic, just routing)
- **Dashboard**:
  - Revenue & sales overview
  - Interactive chart for sales trends
  - Grid showing current products
- **Products Page**:
  - Add, update, delete products
  - Upload product images
  - Set inventory status (In Stock / Low / Out of Stock)

## 🛠 Tech Stack

- Angular 16+
- Angular Material
- Ag cahrts.js
- JSON Server (mock backend)
- HTML, SCSS

## ⚙️ Getting Started

### Prerequisites
- Node.js
- Angular CLI
- JSON Server (`npm install -g json-server`)

### Installation

```bash
# Clone the repo
git clone https://github.com/kainaat123/admin-dashboard.git
cd your-repo-name

# Install dependencies
npm install

# Start JSON Server (in one terminal)
json-server --watch db.json

# Start Angular app (in another terminal)
ng serve
