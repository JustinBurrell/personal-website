# Justin Burrell | Software Engineer Portfolio

A modern, high-performance portfolio website showcasing software engineering experience, projects, and technical expertise. Built with React, Supabase, and optimized for production deployment.

## 🚀 Features

### **Core Functionality**
- **Multi-language Support**: English/Spanish translation system
- **Dynamic Content**: All data managed through Supabase database
- **Contact Form**: EmailJS integration with Supabase storage
- **Responsive Design**: Optimized for all devices and screen sizes

### **Performance Optimizations**
- **Instant Navigation**: Global data caching with 30-minute TTL
- **Image Preloading**: Smart preloading system for faster perceived load times
- **Route Optimization**: Lazy loading and code splitting
- **Production Logging**: Development-friendly, production-clean logging system

### **Technical Sections**
- **Home**: Professional introduction with organization badges
- **About**: Skills showcase with interactive tooltips
- **Experience**: Professional journey with image galleries
- **Education**: Academic background and certifications
- **Projects**: Portfolio projects with detailed descriptions
- **Gallery**: Professional photos and achievements
- **Awards**: Recognition and accomplishments
- **Contact**: Interactive contact form with validation

## 🛠️ Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend** | React.js | Component-based UI library |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Database** | Supabase | PostgreSQL database with real-time features |
| **Authentication** | Supabase Auth | User authentication and security |
| **Storage** | Supabase Storage | Image and asset management |
| **Forms** | EmailJS | Serverless email handling |
| **Animation** | Framer Motion | Smooth page transitions |
| **Routing** | React Router | Client-side navigation |
| **Deployment** | Vercel | Production hosting with CI/CD |

## 📁 Project Structure

```
personal-website/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # Main page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # Supabase and API services
│   │   ├── utils/           # Performance and utility functions
│   │   └── features/        # Language and translation features
│   └── public/              # Static assets
├── supabase/                # Database schema and migrations
└── README.md               # Project documentation
```

## 🎯 Key Features Explained

### **Global Data Management**
- Single data fetch on app load with 30-minute caching
- Instant navigation between sections
- Automatic data synchronization with Supabase

### **Image Optimization**
- Smart preloading of critical images
- Lazy loading for non-critical images
- Optimized storage and delivery via Supabase

### **Performance Monitoring**
- Real-time performance metrics
- Production-safe logging system
- Web Vitals tracking

### **Contact System**
- Form validation and error handling
- EmailJS for immediate email delivery
- Supabase storage for contact submissions
- Admin dashboard for managing submissions

## 🔧 Customization

### **Adding New Content**
1. Update Supabase database with new data
2. Images automatically preload from data
3. No code changes required for content updates

### **Styling**
- Tailwind CSS classes for consistent design
- Custom CSS variables for theming
- Responsive breakpoints for all devices

### **Performance Tuning**
- Adjust cache duration in `useGlobalData.js`
- Modify preloading strategy in `imagePreloader.js`
- Configure performance monitoring in `performance.js`

## 📊 Performance Metrics

- **First Contentful Paint**: < 800ms
- **Navigation Speed**: Instant (cached data)
- **Image Load Time**: Preloaded for instant display
- **Bundle Size**: Optimized with code splitting

## 📞 Contact

- **Website**: [Portfolio](https://www.thejustinburrell.com/)
- **LinkedIn**: [LinkedIn](https://www.linkedin.com/in/thejustinburrell/)
- **GitHub**: [GitHub Profile](https://github.com/JustinBurrell)

---

Built with using React, Supabase, and modern web technologies.