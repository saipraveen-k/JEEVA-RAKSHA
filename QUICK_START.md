# 🚀 Quick Start Guide - JEEVA RAKSHA

## 📋 Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or MongoDB Atlas)
- Git

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
# From root directory
npm run install:all
```

### 2. Start MongoDB
```bash
# If using local MongoDB
mongod
```

### 3. Seed Database with Demo Data
```bash
cd backend
node seed.js
```

### 4. Start Application
```bash
# From root directory - starts both frontend & backend
npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | admin123 |
| User | user@demo.com | password123 |
| User | jane@demo.com | password123 |

## 🎮 Demo Flow

### Step 1: User Reports Animal
1. Go to http://localhost:3000
2. Login as `user@demo.com` / `password123`
3. Click "Report Animal in Need"
4. Fill form with animal details
5. Submit report

### Step 2: Admin Manages Case
1. Open new tab: http://localhost:3000
2. Login as `admin@demo.com` / `admin123`
3. See new case instantly in dashboard
4. Click "Accept Case" → Status changes to "In Progress"
5. Click "Mark as Resolved" → Status changes to "Resolved"

### Step 3: View Map
1. In admin dashboard, click "Show Map"
2. See case locations as colored markers
3. Click markers to view case details

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Kill processes on ports 3000 and 5000
npx kill-port 3000
npx kill-port 5000
```

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ismaster')"

# Or use MongoDB Atlas
# Update backend/.env with your Atlas connection string
```

### Permission Issues
```bash
# On Windows, run as administrator if needed
# On macOS/Linux, use sudo if needed
sudo npm run install:all
```

## 📱 Features to Test

- ✅ User registration and login
- ✅ Role-based access control
- ✅ Animal case reporting with GPS
- ✅ Image upload functionality
- ✅ Real-time case updates
- ✅ Admin case management
- ✅ Interactive map view
- ✅ Status notifications
- ✅ Responsive design

## 🎯 Expected Results

1. **Smooth User Experience**: Clean, modern interface
2. **Real-time Updates**: Instant notifications when cases are submitted/updated
3. **Role-based Access**: Users see only their cases, Admins see all cases
4. **Mobile Responsive**: Works on all device sizes
5. **Secure Authentication**: JWT-based login system

## 🏆 Hackathon Demo Tips

1. **Start with User Flow**: Show how easy it is to report an animal
2. **Switch to Admin View**: Demonstrate real-time case management
3. **Highlight Map Feature**: Show geographic visualization
4. **Emphasize Real-time**: Have two browsers open to show live updates
5. **Mobile Test**: Show responsive design on mobile device

## 📞 Support

If you encounter issues:
1. Check MongoDB is running
2. Verify all dependencies installed
3. Clear browser cache
4. Check console for errors
5. Ensure ports 3000/5000 are available

---

**Built with ❤️ for animal welfare 🐾**
