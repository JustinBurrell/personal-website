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
/public
  /assets          # Images, resume, etc.

/src
  /components       # React components for each portfolio section
    Navbar.js
    Footer.js
    About.js
    Education.js
    Experience.js
    Leadership.js
    Organizations.js
    Projects.js
    Awards.js
    Gallery.js
    Contact.js

  /data             # Optional static content in JSON format
    projects.json
    leadership.json

  App.js            # Root application component
  index.js          # Entry point
  index.css         # Tailwind base styles
  tailwind.config.js