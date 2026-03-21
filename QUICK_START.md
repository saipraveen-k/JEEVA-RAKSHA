# 🚀 JEEVA RAKSHA - Quick Start Guide

## ⚡ **1-MINUTE SETUP - GET RUNNING NOW!**

**Ready-to-use demo environment** - No complex setup required!

---

## 📋 **SYSTEM REQUIREMENTS**

### **✅ Required Software**
- **Node.js 18+** - [Download](https://nodejs.org/)
- **MongoDB Community Server** - [Download](https://www.mongodb.com/try/download/community)
- **Modern Web Browser** (Chrome, Firefox, Safari, Edge)

### **🔧 Optional Tools**
- **MongoDB Compass** - Database GUI (for viewing data)
- **VS Code** - Code editor with TypeScript support

---

## � **QUICK START (RECOMMENDED)**

### **Option 1: Manual Start (Recommended)**
```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend
npm run demo:start
```

---

## 🌐 **ACCESS THE APPLICATION**

Once started, open your browser and visit:
- **Application**: http://localhost:3000
- **API Server**: http://localhost:5000 (for API testing)

---

## 🔑 **DEMO ACCOUNTS READY TO USE**

**No registration needed - login immediately:**

### **👤 User Dashboard**
- **Email**: `user@demo.com`
- **Password**: `password123`

### **👨‍💼 Admin Dashboard**
- **Email**: `admin@demo.com`
- **Password**: `admin123`

---

## 🎯 **WHAT TO EXPECT**

### **✅ Features Working Out-of-the-Box**
- ✅ **Login/Authentication** - JWT-based secure login
- ✅ **Case Reporting** - Report animals in need with GPS
- ✅ **Real-time Updates** - Live case status updates
- ✅ **Google Maps Integration** - Location visualization
- ✅ **Admin Analytics** - Charts and statistics
- ✅ **Mobile Responsive** - Works on all devices

### **🎨 Professional UI/UX**
- ✅ **Modern Design** - Glassmorphism and animations
- ✅ **Interactive Charts** - Data visualizations
- ✅ **SweetAlert Confirmations** - Polished user interactions
- ✅ **Loading States** - Smooth user feedback

---

## 🔧 **MANUAL SETUP (If Quick Start Fails)**

### **Step 1: Install Dependencies**
```bash
# Install all dependencies (frontend + backend)
npm run install:all
```

### **Step 2: Start MongoDB**
```bash
# Windows
net start MongoDB

# Mac/Linux
brew services start mongodb/brew/mongodb-community
# or
sudo systemctl start mongod
```

### **Step 3: Start Backend**
```bash
# Terminal 1
cd backend
npm run dev
```

### **Step 4: Start Frontend**
```bash
# Terminal 2
cd frontend
npm run dev
```

---

## 🐛 **TROUBLESHOOTING**

### **❌ Backend Not Starting?**
```bash
cd backend
npm install
npm run dev
```

### **❌ Frontend Not Starting?**
```bash
cd frontend
npm install
npm run dev
```

### **❌ MongoDB Not Running?**
```bash
# Windows
net start MongoDB

# Check if running
mongosh --eval "db.adminCommand('ismaster')"
```

### **❌ Ports Already in Use?**
- Backend uses port **5000**
- Frontend uses port **3000**
- Kill processes using these ports if needed

### **❌ Login Not Working?**
- Use demo accounts listed above
- Check browser console for errors
- Ensure backend is running on port 5000

---

## 📚 **LEARN MORE**

### **📖 Documentation**
- `README.md` - Complete project overview
- `INDEX.md` - File structure reference
- `FEATURES.md` - Feature documentation
- `DEMO_GUIDE.md` - Presentation script

### **🔗 API Documentation**
- `API_DOCS.md` - Complete API reference
- All endpoints tested and working

### **🎯 Development**
- `frontend/` - Next.js React application
- `backend/` - Express.js API server
- `hooks/` - Custom React hooks
- `components/` - Reusable UI components

---

## 🏆 **READY FOR HACKATHON SUCCESS!**

**JEEVA RAKSHA is now running with:**
- ✅ **Zero configuration** required
- ✅ **Professional presentation** ready
- ✅ **All features working** perfectly
- ✅ **Mobile-responsive** design
- ✅ **Real-time updates** enabled
- ✅ **Secure authentication** implemented
- ✅ **Beautiful UI/UX** with animations

**Impress judges and win hackathons!** 🏆

---

**🐾 Built with ❤️ for animal welfare**
