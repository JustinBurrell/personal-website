// Type definitions for portfolio sections
interface HomeSection {
    imageUrl: string;
    title: string;
    description: string;
    resumeUrl: string;
    linkedinUrl: string;
    githubUrl: string;
    email: string;
    organizations: Array<{
        name: string;
        orgUrl: string;
        orgColor: string;
        orgPortfolioUrl?: string;
    }>;
    qualities: Array<{
        attribute: string;
        description: string;
    }>;
}

interface AboutSection {
    imageUrl: string;
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
    education_type: string;
    major: string;
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
    skills: string[];
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
    skills: string[];
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
const portfolioData: PortfolioData = {
    home: {
        imageUrl: "/assets/images/home/FLOC Headshot.jpeg",
        title: "Hi, I'm Justin Burrell.",
        description: "With a passion for technology and a knack for problem-solving, I aim to leverage my technical skills, consulting experience, and leadership background to drive innovation and create scalable solutions that make a positive impact.",
        resumeUrl: "/assets/documents/Justin Burrell 6-4-25 Resume.pdf",
        linkedinUrl: "https://www.linkedin.com/in/thejustinburrell/",
        githubUrl: "https://github.com/JustinBurrell",
        email: "justinburrell715@gmail.com",
        organizations: [
            {
                name: "Kappa Alpha Psi Fraternity, Inc.",
                orgUrl: "https://www.kappaalphapsi1911.com/",
                orgColor: "crimson",
            },
            {
                name: "Prep for Prep",
                orgUrl: "https://www.prepforprep.org/",
                orgColor: "crimson",
            },
            {
                name: "ColorStack",
                orgUrl: "https://www.colorstack.org/",
                orgColor: "#008B8B",
            },
            {
                name: "NSBE",
                orgUrl: "https://www.nsbe.org/",
                orgColor: "#DAA520",
            },
            {
                name: "All Star Code",
                orgUrl: "https://www.allstarcode.org/",
                orgColor: "blue",
            }
        ],
        qualities: [
            {
                attribute: "Aspiring Software Engineer and Tech Consultant",
                description: "Inspired by advancement in Artificial Intelligence and Software, I wish to pursue a tech career where I can lead and assist others in creating innovative products and services."
            },
            {
                attribute: "Culture-Driven Leader",
                description: "I believe strong team culture is the foundation of success. As a leader, I set the tone for communication, advocacy, and inclusion, creating an environment where every team member feels empowered to contribute fully and operate efficiently."
            },
            {
                attribute: "Analytical Problem Solver",
                description: "Through experiences within Kappa Alpha Psi Fraternity Inc., Lehigh University, and Prep for Prep, I am an analytical thinker with a proven track record of breaking down complex challenges into manageable solutions."
            },
        ]
    },
    about: {
        imageUrl: "/assets/images/about/About Background Photo.jpg",
        introduction: "Growing up in the Bronx, NY, I was always interested in technology. Whether it was helping my grandmother set up her iPad, or keeping up to date with the newest iPhone rollout, I was curious about how tech improved our quality of life. I joined the Prep for Prep program in 2016, which led to me pursuing robotics and leadership development at Horace Mann School. \n\nUpon graduating from Horace Mann, I began my collegiate career at Lehigh University, where I am a rising senior pursuing a Bachelor's of Science in Computer Science and Engineering. At Lehigh, I have been able to explore my interests in software engineering, consulting, and project management. \n\nI have leveraged experiences such as a 2024 Launch Tech Consulting Internship with [EY](https://www.ey.com/en_us), and a current Full Stack Engineering and Business Strategist role at [Frood](https://frood.app/), formerly known as [Hungry Hawks](https://hungryhawks.lehigh.edu/), to develop the skillset needed to deliver real-world impact. I am also an advocate for diversity, equity, and inclusion, building leadership skills through Kappa Alpha Psi Fraternity, Inc., Lehigh's Black Student Union, ColorStack, the Men of Color Alliance, and Student Senate. \n\nMy ultimate goal is to leverage my technical skills, consulting experience, and leadership background to drive innovation and create scalable solutions that make a positive impact.",
        skills: [
            "Python",
            "Java",
            "JavaScript",
            "SQL",
            "C#",
            "HTML",
            "CSS",
            "React",
            "Maven",
            "Flutter",
            "ASP.NET",
            "Firebase",
            "Docker",
            "Git",
            "People Management",
            "Problem Solving",
            "Effective Communication",
        ],
        interests: [
            "New York Knicks",
            "Cooking",
            "Travel",
            "R&B and Hip Hop",
            "Software Engineering",
            "Consulting",
            "Project Management",
            "Entrepreneurship",
        ]
    },
    awards: [
        {
            title: "Award Name",
            organization: "Organization Name",
            date: "Month Year",
            description: "Description of the award and its significance"
        },
        {
            title: "Second Award",
            organization: "Another Organization",
            date: "January 2024",
            description: "Description of your second award and its achievements"
        }
    ],
    education: [
        {
            school: "University Name",
            education_type: "Degree Type",
            major: "Field of Study",
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
            skills: ["Skill 1", "Skill 2"],
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
            skills: ["Skill 1", "Skill 2"],
            githubUrl: "https://github.com/username/project",
            liveUrl: "https://project-demo.com",
            imageUrl: "/path/to/project-image.jpg",
            highlights: [
                "Key feature 1",
                "Key feature 2"
            ]
        },
        {
            title: "Minimal Project",
            description: "This is a minimal project entry",
            technologies: ["React"],
            skills: ["Skill 1", "Skill 2"],
            highlights: ["Main feature"]
        }
    ]
};

export default portfolioData; 