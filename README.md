# ☕ Kettle — Handcrafted Coffee E-Commerce

> A modern, responsive, and artisanal coffee shop storefront and ordering experience built with **semantic HTML5**, **custom CSS3**, **Bootstrap 5.3**, and **vanilla modern JavaScript**.

---

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Bootstrap 5](https://img.shields.io/badge/Bootstrap_5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero_Build_Step-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 📖 Overview

**Kettle** is an e-commerce web platform created for a specialty coffee house. It blends artisanal aesthetic styling with e-commerce features. Designed around a warm, earthy palette and expressive typography, Kettle delivers a fast, responsive user journey across desktop, tablet, and mobile devices—all without requiring heavy frontend frameworks or build steps.

### Highlights
- ⚡ **Zero-Build, Native Web**: Pure HTML5, CSS3, and ES6+ JavaScript. Fast load times and easy hosting.
- 🎨 **Artisanal Design System**: Custom-tailored typography pairing (*Bricolage Grotesque* and *Instrument Sans*), brand color tokens, and micro-interactions.
- 🌓 **Integrated Dark Mode**: Theme switcher with system preference detection and persistent user preferences in `localStorage`.
- 🛒 **Full Client-Side State Engine**: Cart state, price calculations, promo vouchers, and checkout flow backed by `localStorage` and custom events.

---

## ✨ Features & Functionality

### 1. 🛍️ Storefront & Catalog
- **Hero Showcase**: Vector pour-over illustration with animated coffee drips and quick navigation.
- **Dynamic Category Filtering**: Seamlessly toggle between All, Hot Coffee, and Iced Coffee collections.
- **Sidebar & Offcanvas Filters**: Real-time price slider (`$0 - $10`), star rating filters (`4★ & up`, `4.5★ & up`), and roast level criteria.
- **Live Debounced Search**: Fast text filtering by drink name or category with keyboard shortcut support (press `/` to focus, `Escape` to clear).
- **Interactive Sorting**: Reorder products on the fly by **Price: Low to High**, **Price: High to Low**, **Top Rated**, or **Name (A–Z)**.
- **Quick View Modal**: Inspect drink profiles, ratings, and instant add-to-cart directly from listing pages without reloading.
- **Catalog Pagination**: Ready-to-use paginated browsing (`home.html` & `home-2.html`).

### 2. ☕ 12 Detailed Product Pages
Every drink has a dedicated product showcase page featuring:
- **Dynamic Size Pricing**: Select between **Small (12 oz)**, **Medium (16 oz)**, or **Large (20 oz)** with synchronized price updates and visual flash effects.
- **Custom Milk & Preference Selector**: Whole milk, Oat milk, Almond milk, Soy milk, or Skim milk.
- **Quantity Stepper**: Custom increment/decrement stepper controls (`+` / `-`).
- **Wishlist & Favorites**: Save favorite drinks with instant toast notification feedback.
- **Interactive Art Zoom**: Click-to-zoom interactive beverage preview.
- **Customer Reviews & Badges**: Star ratings, stock status badges (`In stock`, `New`), tasting notes, and brewing methods.

### 3. 🧺 Shopping Cart (`cart.html`)
- **Persistent State**: Cart contents are stored in browser `localStorage` (`kettle_cart`) and persist across browser reloads.
- **Live Badge Sync**: Header navigation bag icon updates real-time item counts across all pages.
- **Dynamic Line Recalculation**: Change quantities with immediate updates to subtotals, shipping calculations, and final totals.
- **Smooth Item Removal**: Slide-out animation when removing items from the cart.
- **Free Shipping Threshold**: Dynamic shipping calculation (Standard $5.00, automatically waived on orders over $50.00).
- **Promo Code Engine**: Try voucher code `FIRSTPOUR` for an instant 10% discount with visual validation feedback.
- **Empty State UX**: Clean empty cart illustration and return-to-shop action.

### 4. 💳 Multi-Step Checkout Flow (`checkout.html` & `order-confirmation.html`)
- **Step Indicator**: 3-step visual tracker (*Cart* &rarr; *Shipping & Payment* &rarr; *Confirmation*).
- **Adaptive Payment Methods**: Switch between Credit Card, Apple Pay, Google Pay, and PayPal with dynamic input field toggling.
- **Live Delivery Tier Switcher**: Toggle between Standard (3–5 days, $5.00) and Express (1–2 days, $9.00) with live order summary updates.
- **Form Validation**: HTML5 form validation styled with Bootstrap feedback states.
- **Order Confirmation**: Clean receipt screen displaying order number `#KT-0001`, shipping details, and next steps.

### 5. 🎯 UX & Micro-Interactions
- **Toast Notifications**: Built-in feedback system for user actions (cart additions, favorites, coupon triggers, errors).
- **Scroll-to-Top**: Floating button appears when scrolling past 400px with smooth return-to-top.
- **Scroll Animations**: Subtle fade-in animations via `IntersectionObserver`.
- **Promo Countdown Timer**: Live ticking countdown timer for daily promotions.
- **Newsletter Subscription**: Inline footer subscription form with interactive submission feedback.
- **Accessibility (a11y)**: Built-in `Skip to content` skip links, keyboard navigation, semantic headings, and ARIA labels.

---

## 📋 Menu & Beverage Roster

| Drink | Category | Price (Medium) | Highlights |
| :--- | :--- | :--- | :--- |
| **Latte** | Hot Coffee | `$4.75` | Espresso topped with silky steamed milk and fine microfoam |
| **Cappuccino** | Hot Coffee | `$4.50` | Balanced thirds of espresso, steamed milk, and airy foam |
| **Caramel Latte** | Hot Coffee | `$5.25` | Rich espresso infused with buttery house-made caramel drizzle |
| **Espresso** | Hot Coffee | `$3.25` | Double shot of single-origin beans with a golden crema |
| **Macchiato** | Hot Coffee | `$3.75` | Bold espresso stained with a dollop of velvety foam |
| **Mocha** | Hot Coffee | `$5.25` | Dutch cocoa blended with espresso, steamed milk & foam |
| **Cold Brew** | Iced Coffee | `$5.00` | 18-hour cold steeped beans; low acidity and chocolate notes |
| **Frappuccino** | Iced Coffee | `$5.50` | Blended coffee treat topped with whipped cream |
| **Iced Coffee** | Iced Coffee | `$4.00` | Freshly brewed flash-chilled coffee poured over crystal ice |
| **Iced Latte** | Iced Coffee | `$4.75` | Espresso over cold milk and ice cubes for a smooth sip |
| **Iced Mocha Latte** | Iced Coffee | `$5.25` | Rich chocolate sauce, bold espresso, cold milk and ice |
| **Nitro Cold Brew** | Iced Coffee | `$5.50` | Nitrogen-infused cold brew cascading with a creamy head |

---

## 🎨 Design System & Color Palette

Kettle uses a color system inspired by craft roasteries, forest pines, and warm citrus tones.

```
┌─────────────────────────────────────────────────────────────────┐
│                      KETTLE COLOR PALETTE                       │
├─────────────┬───────────┬───────────────────────────────────────┤
│ Color Name  │ Hex Code  │ Semantic Usage                        │
├─────────────┼───────────┼───────────────────────────────────────┤
│ Pine        │ #12332B   │ Primary brand, headings, solid buttons│
│ Pine Deep   │ #0B211C   │ Button hover, high-contrast dark text │
│ Pine Mid    │ #1D4A3F   │ Accents, focus outlines, borders      │
│ Citrus Gold │ #F2C230   │ Accent highlights, brand mark, badge  │
│ Citrus Soft │ #F8E7A6   │ Product card artwork tint (Latte)     │
│ Paper       │ #F5F6F2   │ Background canvas, neutral base       │
│ Brick       │ #C8412B   │ Cart notification badge, danger cues  │
│ Brick Soft  │ #F0CFC6   │ Product card artwork tint (Cappuccino)│
│ Mist        │ #DCE7E0   │ Product card artwork tint (Cold Brew) │
│ Ink         │ #17201C   │ Body copy, text elements              │
│ Line        │ #D3DBD5   │ Borders, dividers, subtle separators  │
└─────────────┴───────────┴───────────────────────────────────────┘
```

### Typography
- **Headings & Display**: [`Bricolage Grotesque`](https://fonts.google.com/specimen/Bricolage+Grotesque) (Weights: 500, 700, 800) — distinctive, punchy character.
- **Body & Controls**: [`Instrument Sans`](https://fonts.google.com/specimen/Instrument+Sans) (Weights: 400, 500, 600, 700) — neutral, modern readability.

---

## 📁 Project Structure

```text
kettle/
│
├── README.md                          # Comprehensive project documentation
│
├── css/
│   └── style.css                      # Master stylesheet: variables, dark mode, component styles & responsive rules
│
├── js/
│   └── app.js                         # Application logic: cart manager, search, sort, quick view, toasts & dark mode
│
└── 
    ├── index.html                     # Landing page (hero, featured drinks, promo banner, trust badges)
    ├── home.html                      # Main shop catalog (filters, search, sort, product cards)
    ├── home-2.html                    # Catalog page 2 (pagination showcase)
    ├── hot-coffee.html                # Hot coffee category showcase & collection
    ├── iced-coffee.html               # Iced coffee category showcase & collection
    ├── cart.html                      # Interactive cart view (line items, promo code, subtotal)
    ├── checkout.html                  # 3-step checkout with address & payment form validation
    ├── order-confirmation.html        # Order placed summary & receipt confirmation
    │
    ├── product-cappuccino.html        # Product detail: Cappuccino
    ├── product-caramel-latte.html     # Product detail: Caramel Latte
    ├── product-cold-brew.html         # Product detail: Cold Brew
    ├── product-espresso.html          # Product detail: Espresso
    ├── product-frappuccino.html       # Product detail: Frappuccino
    ├── product-iced-coffee.html       # Product detail: Iced Coffee
    ├── product-iced-latte.html        # Product detail: Iced Latte
    ├── product-iced-mocha-latte.html  # Product detail: Iced Mocha Latte
    ├── product-latte.html             # Product detail: Latte
    ├── product-macchiato.html         # Product detail: Macchiato
    ├── product-mocha.html             # Product detail: Mocha
    └── product-nitro.html             # Product detail: Nitro Cold Brew
```

---

## 🚀 Getting Started

Since Kettle is built using standard web technologies, there are **no npm dependencies to install** and **no compilation build steps** required.

## 🛠️ Technology Stack

- **Markup**: HTML5 with semantic landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- **Styling**: [Bootstrap 5.3.3](https://getbootstrap.com/) + Custom CSS3 variables & animations
- **Icons**: [Bootstrap Icons v1.11.3](https://icons.getbootstrap.com/)
- **Fonts**: [Google Fonts](https://fonts.google.com/) (`Bricolage Grotesque`, `Instrument Sans`)
- **Scripting**: Vanilla JavaScript (ES6+, Modules, LocalStorage API, CustomEvents, IntersectionObserver)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — free to use for educational, personal, or commercial portfolio projects.

---

<div align="center">
  <sub>Crafted with passion for good coffee and clean web development.</sub>
</div>
