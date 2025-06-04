// Type definitions for portfolio sections
interface HomeSection {
    title: string;
    subtitle: string;
    description: string;
}

interface AboutSection {
    introduction: string;
    skills: string[];
    interests: string[];
}

interface AwardItem {
    title: string;
    organization: string;
    date: string;
    description: string;
}

interface EducationItem {
    school: string;
    degree: string;
    field: string;
    graduationDate: string;
    gpa?: string;
    relevantCourses?: string[];
}

interface ExperienceItem {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    location: string;
    responsibilities: string[];
    technologies?: string[];
}

interface GalleryItem {
    title: string;
    imageUrl: string;
    description: string;
    category?: string;
}

interface OrganizationItem {
    name: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
    achievements?: string[];
}

interface ProjectItem {
    title: string;
    description: string;
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
    imageUrl?: string;
    highlights: string[];
}

interface PortfolioData {
    home: HomeSection;
    about: AboutSection;
    awards: AwardItem[];
    education: EducationItem[];
    experience: ExperienceItem[];
    gallery: GalleryItem[];
    organizations: OrganizationItem[];
    projects: ProjectItem[];
}

// Portfolio data
export const portfolioData: PortfolioData = {
    home: {
        title: "Your Name",
        subtitle: "Your Title/Role",
        description: "Brief introduction or tagline about yourself"
    },
    about: {
        introduction: "Detailed introduction about yourself and your professional journey",
        skills: [
            "Skill 1",
            "Skill 2",
            "Skill 3"
        ],
        interests: [
            "Interest 1",
            "Interest 2",
            "Interest 3"
        ]
    },
    awards: [
        {
            title: "Award Name",
            organization: "Organization Name",
            date: "Month Year",
            description: "Description of the award and its significance"
        }
    ],
    education: [
        {
            school: "University Name",
            degree: "Degree Type",
            field: "Field of Study",
            graduationDate: "Month Year",
            gpa: "X.XX",
            relevantCourses: ["Course 1", "Course 2", "Course 3"]
        }
    ],
    experience: [
        {
            company: "Company Name",
            position: "Position Title",
            startDate: "Month Year",
            endDate: "Month Year",
            location: "City, State",
            responsibilities: [
                "Key responsibility 1",
                "Key responsibility 2"
            ],
            technologies: ["Tech 1", "Tech 2"]
        }
    ],
    gallery: [
        {
            title: "Project/Work Title",
            imageUrl: "/path/to/image.jpg",
            description: "Description of the work",
            category: "Category"
        }
    ],
    organizations: [
        {
            name: "Organization Name",
            role: "Your Role",
            startDate: "Month Year",
            endDate: "Month Year",
            description: "Description of your involvement",
            achievements: ["Achievement 1", "Achievement 2"]
        }
    ],
    projects: [
        {
            title: "Project Name",
            description: "Project description",
            technologies: ["Tech 1", "Tech 2", "Tech 3"],
            githubUrl: "https://github.com/username/project",
            liveUrl: "https://project-demo.com",
            imageUrl: "/path/to/project-image.jpg",
            highlights: [
                "Key feature 1",
                "Key feature 2"
            ]
        }
    ]
}; 