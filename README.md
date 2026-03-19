# 🐾 JEEVA RAKSHA - Smart Animal Protection & Rescue System

A real-time, role-based web application for reporting and managing animal rescue cases. Built as a hackathon MVP with modern technologies.

## 🎯 Features

### 🔐 Authentication System
- Role-based login (User/Admin)
- JWT authentication
- Secure password hashing
- Protected routes

### 👤 User Dashboard
- Report injured animals with GPS location
- Upload images
- Track submitted cases
- Real-time status updates

### 🛠️ Admin Dashboard
- View all reported cases
- Accept and manage cases
- Update case status (Pending → In Progress → Resolved)
- Real-time notifications
- Case statistics

### 📍 Map Integration
- Display all cases as markers
- Zone-based risk visualization
- Interactive case details

### 🔔 Real-time Updates
- Instant case notifications
- Live status updates
- Socket.io integration

## 🚀 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **ShadCN UI**
- **React Hook Form**
- **React Hot Toast**
- **Lucide React** (Icons)

### Backend
- **Node.js** (Express)
- **MongoDB** (Mongoose)
- **JWT Authentication**
- **Socket.io** (Real-time)
- **Multer** (File uploads)
- **Bcrypt** (Password hashing)

### Database
- **MongoDB**
- **Mongoose ODM**

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or MongoDB Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/saipraveen-k/JEEVA-RAKSHA
cd "JEEVA RAKSHA"
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (frontend + backend)
npm run install:all
```

### 3. Environment Setup

#### Backend Environment
```bash
cd backend
cp .env.example .env
```

Edit `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/jeeva-raksha
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

#### Frontend Environment
```bash
cd ../frontend
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Database Setup
```bash
# Start MongoDB (if running locally)
mongod

# Seed the database with sample data
cd backend
node seed.js
```

### 5. Start the Application

#### Development Mode (Recommended)
```bash
# From root directory
npm run dev
```
This will start both frontend (port 3000) and backend (port 5000) concurrently.

#### Manual Start
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🎮 Demo Flow

### 1. Login as User
- Go to `http://localhost:3000`
- Use demo credentials: `user@demo.com` / `password123`
- Report an injured animal

### 2. Login as Admin
- Go to `http://localhost:3000`
- Use demo credentials: `admin@demo.com` / `admin123`
- View the new case instantly
- Accept the case
- Update status to "In Progress" → "Resolved"

### 3. Real-time Updates
- See instant updates when cases are submitted
- Admin receives real-time notifications
- Map updates automatically

## 📱 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | admin123 |
| User | user@demo.com | password123 |
| User | jane@demo.com | password123 |

## 🏗️ Project Structure

```
JEEVA RAKSHA/
├── frontend/                 # Next.js Frontend
│   ├── app/
│   │   ├── admin/           # Admin routes
│   │   ├── user/            # User routes
│   │   └── page.tsx         # Login page
│   ├── components/
│   │   └── ui/              # ShadCN UI components
│   ├── hooks/
│   │   └── useAuth.ts       # Authentication hook
│   ├── lib/
│   │   └── api.ts           # API utilities
│   └── package.json
├── backend/                  # Express.js Backend
│   ├── models/
│   │   ├── User.js          # User model
│   │   └── Case.js          # Case model
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── cases.js         # Case management
│   │   └── users.js         # User management
│   ├── middleware/
│   │   └── auth.js          # JWT middleware
│   ├── server.js            # Main server file
│   ├── seed.js              # Database seeding
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Cases
- `GET /api/cases` - Get all cases (admin) / user cases
- `POST /api/cases` - Create new case
- `GET /api/cases/:id` - Get single case
- `PUT /api/cases/:id` - Update case (admin only)
- `DELETE /api/cases/:id` - Delete case (admin only)
- `GET /api/cases/map/locations` - Get map locations

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/stats` - Get user statistics (admin only)

## 🎨 UI Features

- **Modern Design**: Clean, minimal interface with Tailwind CSS
- **Responsive**: Works on all device sizes
- **Glassmorphism**: Modern glass effects
- **Smooth Animations**: Hover effects and transitions
- **Real-time Updates**: Instant notifications
- **Interactive Maps**: Location-based case visualization

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- Rate limiting
- Input validation
- CORS protection

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Build for production
cd frontend
npm run build

# Deploy to Vercel
vercel
```

### Backend (Heroku/Render)
```bash
# Build for production
cd backend
npm start

# Deploy to Heroku
heroku create
git push heroku main
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **Port Already in Use**
   - Kill processes on ports 3000/5000
   - Use different ports in environment

3. **CORS Issues**
   - Check FRONTEND_URL in backend `.env`
   - Ensure proper CORS configuration

4. **JWT Token Issues**
   - Clear localStorage
   - Check JWT_SECRET in backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🏆 Hackathon Notes

This is an MVP built for a hackathon. Focus areas:
- ✅ Working authentication flow
- ✅ Real-time case management
- ✅ Clean, modern UI
- ✅ Demo-ready functionality
- ✅ Complete user journey

**Future Enhancements:**
- Real map integration (Mapbox/Google Maps)
- Push notifications
- Advanced filtering
- Analytics dashboard
- Mobile app
- AI-powered case prioritization

---

Built with ❤️ for animal welfare 🐾
