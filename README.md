# Justin Burrell – Personal Portfolio

This is my personal portfolio website built with React and Tailwind CSS. It showcases my background, projects, leadership experience, and more in a modern, multi-page format with smooth transitions.

## Tech Stack

| Layer       | Technology             | Purpose                                               |
|-------------|------------------------|-------------------------------------------------------|
| Frontend    | React.js               | Component-based JavaScript library for UI            |
| Styling     | Tailwind CSS           | Utility-first CSS framework for fast, responsive design |
| Routing     | React Router           | For handling multi-page navigation                    |
| Animations  | Framer Motion          | For smooth page transitions and UI animations         |
| Forms       | EmailJS                | For handling contact form submissions                 |
| Hosting     | Vercel or Netlify      | Free static site hosting with GitHub integration     |
| Data Format | TypeScript             | Used for storing and typing data content             |

## Navigation Structure

The website uses a multi-page architecture with React Router, featuring:

- **Main Navigation**
  - Home (/)
    - About (/#about)
    - Gallery (/#gallery)
    - Contact (/#contact)
  - Education (/education)
  - Experience (/experience)
  - Projects (/projects)
  - Awards (/awards)

## Component Status (as of March 19, 2024)

### Functional Components:
1. **Home** (/) - Complete
   - Professional introduction
   - Social media links (LinkedIn, GitHub, Email)
   - Organization affiliations with custom styling
   - Resume download button

2. **About** (/#about) - Complete
   - Personal background
   - Skills showcase
   - Interests display
   - Professional photo integration

3. **Contact** (/#contact) - Complete
   - Fully functional contact form with EmailJS integration
   - Form validation
   - Success/error messaging
   - Social media links

### In Progress Components:
- Education (/education)
- Experience (/experience)
- Projects (/projects)
- Awards (/awards)
- Gallery (/#gallery)

## Project Structure
```
personal-portfolio/
├── src/
│   ├── assets/
│   │   ├── ui/
│   │   │   ├── Button.js
│   │   │   ├── Card.js
│   │   │   └── SectionTitle.js
│   │   └── shared/
│   │       ├── Navbar.js
│   │       └── PageTransition.js
│   ├── components/
│   │   ├── About.js
│   │   ├── Awards.js
│   │   ├── Contact.js
│   │   ├── Education.js
│   │   ├── Experience.js
│   │   ├── Gallery.js
│   │   ├── Home.js
│   │   ├── Organizations.js
│   │   └── Projects.js
│   ├── data/
│   │   └── portfolioData.ts
│   ├── App.js
│   ├── App.css
│   ├── App.test.js
│   ├── index.js
│   ├── index.css
│   └── reportWebVitals.js
├── public/
│   ├── assets/
│   ├── index.html
│   └── manifest.json
├── node_modules/        # Dependencies directory (numerous files)
├── package.json        # Project configuration and dependencies
├── package-lock.json   # Locked versions of dependencies
├── tailwind.config.js  # Tailwind CSS configuration
├── postcss.config.js   # PostCSS configuration
├── .gitignore         # Git ignore rules
├── README.md          # Project documentation
└── PortfolioDescription.md  # Additional project documentation
```

## Features

1. **Responsive Design**
   - Mobile-first approach
   - Adapts seamlessly to all screen sizes

2. **Modern Navigation**
   - Smooth page transitions using Framer Motion
   - Persistent navbar with dropdown menu
   - Hash-based navigation for home page sections

3. **Interactive Elements**
   - Form validation and feedback
   - Hover effects on buttons and links
   - Smooth scrolling to sections

4. **Performance Optimized**
   - Code splitting with React Router
   - Optimized images
   - Efficient component rendering