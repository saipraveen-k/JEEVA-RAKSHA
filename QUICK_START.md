# 🚀 JEEVA RAKSHA - Quick Start Guide

## 🎯 **5-MINUTE SETUP GUIDE**

Get JEEVA RAKSHA running in minutes with this step-by-step guide!

---

## 📋 **PREREQUISITES**

### **Required Software**
- ✅ **Node.js 18+** - [Download Here](https://nodejs.org/)
- ✅ **MongoDB** - [Download Community Server](https://www.mongodb.com/try/download/community)
- ✅ **Git** - [Download Here](https://git-scm.com/)

### **Optional Tools**
- 🌟 **MongoDB Compass** - Database GUI (Recommended)
- � **VS Code** - Code editor with extensions
- 🌟 **Postman** - API testing tool

---

## 🔧 **INSTALLATION STEPS**

### **Step 1: Clone & Setup**
```bash
# Clone the repository
git clone <repository-url>
cd JEEVA-RAKSHA

# Install all dependencies (both frontend & backend)
npm run install:all
```

### **Step 2: MongoDB Setup**
```bash
# For Windows - Start MongoDB service
net start MongoDB

# Verify MongoDB is running
mongosh --eval "db.adminCommand('ismaster')"

# Alternative: Use Docker
docker run --name mongodb -p 27017:27017 -d mongo:latest
```

### **Step 3: Environment Configuration**
```bash
# Backend environment
cd backend
cp .env.example .env
# Edit .env with your settings

# Frontend environment  
cd ../frontend
cp .env.local.example .env.local
# Edit .env.local with your API URL
```

### **Step 4: Database Initialization**
```bash
cd backend
node seed.js
# Creates admin user and sample data
```

### **Step 5: Start Application**
```bash
# Terminal 1 - Backend Server
cd backend
npm run dev

# Terminal 2 - Frontend Application
cd frontend  
npm run dev
```

If you encounter issues:
1. Check MongoDB is running
2. Verify all dependencies installed
3. Clear browser cache
4. Check console for errors
5. Ensure ports 3000/5000 are available

---

**Built with ❤️ for animal welfare 🐾**
