import { SrvRecord } from "dns";

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
    name: string;
    nameUrl?: string;
    education_type: string;
    major?: string;
    completionDate: string;
    gpa?: string;
    relevantCourses?: Array<{
        course: string;
        courseUrl: string;
    }>;
    organizationInvolvement?: Array<{
        organization: string;
        role: string;
    }>;
}

interface ExperienceItem {
    experienceImageUrl: string;
    description: string;
    professionalexperience: Array<{
        company: string;
        companyUrl: string;
        position: string;
        startDate: string;
        endDate: string;
        location: string;
        responsibilities: string[];
        skills: string[];
        technologies?: string[];
    }>,
    leadershipexperience: Array<{
        company: string;
        companyUrl: string;
        position: string;
        startDate: string;
        endDate: string;
        location: string;
        responsibilities: string[];
        skills: string[];
        technologies?: string[];
    }>,
}

interface GalleryItem {
    title: string;
    imageUrl: string;
    description: string;
    category?: Array<{
        categoryName: string;
    }>;
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
    projects: ProjectItem[];
}

// Portfolio data
const portfolioData: PortfolioData = {
    home: {
        imageUrl: "/assets/images/home/FLOC Headshot.jpeg",
        title: "Hi, I'm Justin Burrell.",
        description: "With a passion for technology and a knack for problem-solving, I aim to leverage my technical skills, consulting experience, and leadership background to drive innovation and create scalable solutions that make a positive impact.",
        resumeUrl: "/assets/documents/Justin Burrell Resume.pdf",
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
            "C",
            "HTML",
            "CSS",
            "React",
            "Maven",
            "Flutter",
            "ASP.NET",
            "Firebase",
            "Docker",
            "Git",
            "Kubernetes",
            "Dart",
            "Google Cloud"
        ],
        interests: [
            "New York Knicks",
            "Cooking",
            "Travel",
            "Hip Hop",
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
            name: "Lehigh University",
            nameUrl: "https://www.lehigh.edu/",
            education_type: "Bachelor's of Science",
            major: "Computer Science and Engineering",
            completionDate: "May 2026",
            relevantCourses: [
                {
                    course: "CSE 007",
                    courseUrl: "https://www.lehigh.edu/academics/courses/cse-007"
                },
                
                {
                    course: "CSE 017",
                    courseUrl: "https://www.lehigh.edu/academics/courses/cse-017"
                },
                
                {
                    course: "CSE 140",
                    courseUrl: "https://www.lehigh.edu/academics/courses/cse-140"
                },
                {
                    course: "CSE 216",
                    courseUrl: "https://www.lehigh.edu/academics/courses/cse-216"
                },
                {
                    course: "CSE 280",
                    courseUrl: "https://www.lehigh.edu/academics/courses/cse-280"
                }
            ],
            organizationInvolvement: [
                {
                    organization: "Kappa Alpha Psi Fraternity, Inc.",
                    role: "Polemarch and MTA Chairman"
                },
                {
                    organization: "Lehigh University Black Student Union",
                    role: "President"
                },
                {
                    organization: "ColorStack",
                    role: "Co-Founder and Secretary"
                },
                {
                    organization: "Men of Color Alliance",
                    role: "Former President"
                },
                {
                    organization: "Student Senate",
                    role: "Assistant Vice President of Finance"
                },
                {
                    organization: "Lamberton Hall Building Supervisor",
                    role: "Great and Game Room Supervisor"
                }
            ]
        },
        {
            name: "Horace Mann School",
            nameUrl: "https://www.horacemann.org/",
            education_type: "High School Diploma",
            completionDate: "June 2022",
            organizationInvolvement: [
                {
                    organization: "Varsity Track and Field",
                    role: "Captain"
                },
                {
                    organization: "Varsity Cross Country",
                    role: "Captain"
                },
                {
                    organization: "Office of Admissions",
                    role: "Ambassador"
                },
                {
                    organization: "Blex (Black Excellence)",
                    role: "President"
                }
            ]
        }
    ],
    experience: [{
        experienceImageUrl: "/assets/images/home/NLT Headshot.jpg",
        description: "mock description",
        professionalexperience: [
            {
                company: "EY",
                companyUrl: "",
                position: "Launch Tech Consulting Intern",
                startDate: "June 2024",
                endDate: "August 2024",
                location: "New York, NY",
                responsibilities: [
                    "Key responsibility 1",
                    "Key responsibility 2"
                ],
                skills: ["Consulting", "Problem Solving", "Client Communication"],
                technologies: ["Tech 1", "Tech 2"]
            }
        ],
        leadershipexperience: [
            {
                company: "Lehigh University Black Student Union",
                companyUrl: "",
                position: "President",
                startDate: "April 2024",
                endDate: "Present",
                location: "Bethlehem, PA",
                responsibilities: [
                    "Lead executive board of 10+ members",
                    "Manage organization's budget and resources",
                    "Plan and execute events for 500+ members"
                ],
                skills: ["Leadership", "Event Planning", "Budget Management", "Team Management"],
                technologies: ["Microsoft Office", "Google Workspace"]
            }
        ]
    }],
    gallery: [
        {
            title: "Men of Color Symposium",
            imageUrl: "assets/images/gallery/moca/mocs group photo.jpeg", 
            description: "I proposed and planned the First Annual Men of Color Symposium, brought together men of color from Lehigh University, Moravian University, Lafayette College, Muhlenberg College, and East Stroudsburg University for a day of professional development, empowerment, and connection. With engaging keynote speakers, insightful breakout sessions, and impactful dialogues, the symposium sparked both personal and professional growth for everyone who attended.",
            category: [
                {
                    categoryName: "Men of Color Alliance"
                },
                {
                    categoryName: "Community Building"
                },
                {
                    categoryName: "Professional Development"
                }
            ]
        },
        {
            title: "Founded ColorStack Chapter at Lehigh",
            imageUrl: "assets/images/gallery/colorstack/colorstack exec.jpg",
            description: "I helped found the ColorStack chapter at Lehigh University. In the Spring 2025 semester, our exec has been dedicated to bridging the gap in the tech industry for Black and Latinx students. After earning Student Senate recognition as an official student organization at Lehigh University, I'm confident in our ability to make a lasting impact. I'm looking forward to what's ahead for the chapter!",
            category: [
                {
                    categoryName: "ColorStack"
                },
                {
                    categoryName: "Computer Science"
                },
                {
                    categoryName: "Community Building"
                }
            ]   
        },
        {
            title: "New Member Education leads to High Scores",
            imageUrl: "/assets/images/gallery/kappa/provincecouncil spr25 2.JPG",
            description: "As MTA Chairman of the Omicron Kappa chapter of Kappa Alpha Psi, I taught three new members the values of Kappa. As MTA Chairman, I prepared them to take the National MTA Exam, where they had an average of 96%, the highest scores in the Northeastern Province.",
            category: [
                {
                    categoryName: "Kappa Alpha Psi"
                },
                {
                    categoryName: "Education"
                },
                {
                    categoryName: "Leadership Development"
                }
            ]
        },
        {
            title: "Tech Week 2025 NYC",
            imageUrl: "/assets/images/gallery/misc/tech week nyc 2025.jpg",
            description: "In early June, I engaged in a16z's Tech Week 2025. I had the opportunity to meet Black professionals, AI founders, and expand my network.",
            category: [
                {
                    categoryName: "Networking",
                },
                {
                    categoryName: "Events"
                }
            ]

        },
        {
            title: "Incoming Black Student Union President",
            imageUrl: "/assets/images/gallery/bsu/bsu new exec election.jpg",
            description: "Last spring, I was elected as President of Lehigh's Black Student Union. As event planner for the past two years, I have grown BSU's member base to 500 students, through engaging social and professional events that united the Black community.",
            category: [
                {
                    categoryName: "Black Student Union"
                },
                {
                    categoryName: "People Management"
                },
                {
                    categoryName: "Leadership"
                }
            ]
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