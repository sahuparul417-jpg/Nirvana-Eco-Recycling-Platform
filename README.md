# 🌿 Nirvana — Smart AI-Based Recyclable Waste Management Platform

> *Segregate Today, Sustain Tomorrow* — DevX Team | Swachh Bharat Abhiyan

---

## 🚀 Tech Stack

| Layer      | Technology          |
|------------|---------------------|
| Frontend   | HTML5, CSS3, Vanilla JS |
| Backend    | Node.js + Express.js |
| Database   | MongoDB + Mongoose  |
| Auth       | JWT (JSON Web Tokens) |
| Security   | bcryptjs password hashing |

---

## 📁 Project Structure

```
nirvana/
├── server.js               # Main Express server
├── package.json
├── .env.example            # Environment variables template
├── models/
│   ├── User.js             # User schema (auth, points, wallet)
│   ├── Pickup.js           # Pickup scheduling schema
│   └── Redemption.js       # Rewards redemption schema
├── routes/
│   ├── auth.js             # Register, Login, Profile
│   ├── pickups.js          # CRUD for pickups
│   └── rewards.js          # Redeem points, leaderboard
├── middleware/
│   └── authMiddleware.js   # JWT protect + admin guard
└── public/
    ├── index.html          # Landing page
    └── pages/
        ├── login.html
        ├── register.html
        ├── dashboard.html
        ├── schedule.html
        └── rewards.html
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)

### Steps

```bash
# 1. Clone / unzip the project
cd nirvana

# 2. Install dependencies
npm install

# 3. Create your .env file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# 4. Start the server
npm start           # production
npm run dev         # development (with nodemon)
```

### .env file
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/nirvana
JWT_SECRET=your_super_secret_key_change_this
NODE_ENV=development
```

---

## 🌐 Application Routes

### Web Pages
| URL          | Description         |
|--------------|---------------------|
| `/`          | Landing page        |
| `/login`     | User login          |
| `/register`  | New user signup     |
| `/dashboard` | User dashboard      |
| `/schedule`  | Schedule a pickup   |
| `/rewards`   | Rewards & redeem    |

### REST API Endpoints

#### Auth `/api/auth`
| Method | Endpoint       | Description           | Auth |
|--------|---------------|-----------------------|------|
| POST   | `/register`   | Register new user     | ❌   |
| POST   | `/login`      | Login                 | ❌   |
| GET    | `/me`         | Get current user      | ✅   |
| PUT    | `/profile`    | Update profile        | ✅   |

#### Pickups `/api/pickups`
| Method | Endpoint           | Description              | Auth  |
|--------|-------------------|--------------------------|-------|
| GET    | `/`               | Get my pickups           | ✅    |
| POST   | `/`               | Schedule new pickup      | ✅    |
| GET    | `/:id`            | Get single pickup        | ✅    |
| PUT    | `/:id/cancel`     | Cancel a pickup          | ✅    |
| PUT    | `/:id/collect`    | Mark as collected        | ✅    |
| GET    | `/admin/all`      | All pickups (admin only) | ✅👑  |

#### Rewards `/api/rewards`
| Method | Endpoint           | Description              | Auth |
|--------|-------------------|--------------------------|------|
| GET    | `/stats`          | My points & wallet       | ✅   |
| POST   | `/redeem/cash`    | Points → Cash            | ✅   |
| POST   | `/redeem/product` | Points → Eco product     | ✅   |
| GET    | `/leaderboard`    | Top recyclers            | ✅   |

---

## ♻️ Material Types & Rewards

| Material     | Points/kg | Cash/kg (₹) |
|--------------|-----------|-------------|
| Electronics  | 50        | ₹25         |
| Metal        | 30        | ₹15         |
| Glass        | 15        | ₹4          |
| Plastic      | 20        | ₹5          |
| Rubber       | 12        | ₹6          |
| Paper        | 10        | ₹3          |
| Textile      | 10        | ₹3          |
| Cardboard    | 8         | ₹2          |

---

## 👥 User Roles

- **user** — Regular citizen who schedules pickups
- **admin** — Can view all pickups, mark as collected
- **collector** — Collection partner (future)

---

## 🔮 Future Scope (from pitch deck)
- Smart QR-based reward dustbins in public areas
- AI image verification of waste at disposal
- Tax benefit integration
- Mobile app (React Native)

---

*Built with 💚 by Team DevX for Swachh Bharat Abhiyan*
