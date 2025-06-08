# Justin Burrell – Personal Portfolio

This is my personal portfolio website built with React and Tailwind CSS. It showcases my background, projects, leadership experience, and more in a clean, scrollable single-page format.

## Tech Stack

| Layer       | Technology             | Purpose                                               |
|-------------|------------------------|-------------------------------------------------------|
| Frontend    | React.js               | Component-based JavaScript library for UI            |
| Styling     | Tailwind CSS           | Utility-first CSS framework for fast, responsive design |
| Animations  | Framer Motion (optional) | For smooth UI animations and transitions           |
| Hosting     | Vercel or Netlify      | Free static site hosting with GitHub integration     |
| Data Format | JSON                   | Used for storing project and leadership content       |

## Project Structure
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