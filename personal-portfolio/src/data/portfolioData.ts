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
        location: string;
        positions: Array<{
            position: string;
            startDate: string;
            endDate: string;
            responsibilities: string[];
            skills: string[];
            images?: string[];
        }>;
    }>,
    leadershipexperience: Array<{
        company: string;
        companyUrl: string;
        location: string;
        positions: Array<{
            position: string;
            startDate: string;
            endDate: string;
            responsibilities: string[];
            skills: string[];
            images?: string[];
        }>;
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
        description: "We are shaped by our experiences. From a young age, I've been driven to get involved, whether through professional opportunities or leadership roles. Along the way, I've gained valuable memories, soft skills, and technical expertise that have helped shape me into an emerging leader with a passion for impact and growth.",
        professionalexperience: [
            {
                company: "Frood",
                companyUrl: "https://frood.app/",
                location: "Bethlehem, PA",
                positions: [
                    {
                        position: "Full Stack Engineer",
                        startDate: "January 2025",
                        endDate: "Present",
                        responsibilities: [
                            "Developed and deployed four analytics metrics to track user engagement across the web platform, providing actionable insights to improve retention and usability.",
                            "Refactored backend services and redesigned the database using ASP.NET Core, C#, and SQL to ensure scalability for onboarding new universities and expanding use cases.",
                            "Redesigned web and mobile apps using ASP.NET, Flutter, and Dart as part of a company-wide rebrand, improving UI consistency and user experience.",
                            "Implemented CI/CD pipelines, Docker containerization, and Kubernetes orchestration to automate deployments and improve system scalability and reliability."
                        ],
                        skills: ["ASP.Net", "Docker", "C#", "SQL", "Flutter", "Dart", "Kubernetes", "Docker", "xUnit", "CI/CD", "Data Analysis", "Agile Project Management", "Firebase"],
                        images: ["", "", ""]
                    },
                    {
                        position: "Business Strategist",
                        startDate: "June 2025",
                        endDate: "Present",
                        responsibilities: [
                            "Contributed to social media and marketing strategies to increase brand reach, engage users, and support campaigns for two new product use cases.",
                            "Assisted in developing an approach to help universities experience the product through trial programs and tailored onboarding, with the goal of converting them into paying clients."
                        ],
                        skills: ["B2B Strategy", "Business Development", "Microsoft Office", "Cilent-Relationships"],
                        images: ["", "", ""]
                    }
                ]
            },
            {
                company: "EY US",
                companyUrl: "https://www.ey.com/en_us",
                location: "New York, NY",
                positions: [
                    {
                        position: "Launch Technology Consulting Intern",
                        startDate: "June 2024",
                        endDate: "August 2024",
                        responsibilities: [
                            "Rotation One: Artificial Intelligence and Data Automation (AI&D)",
                            "Created client-ready presentation materials using Microsoft Office to explain the team's data testing processes, the role of manual and automated testing in AI applications, and the value of a proposed data framework.",
                            "Collaborated with offshore data engineers and analysts to debug and optimize data frameworks using SQL, Python, and AWS, improving performance and reliability.",
                            "Researched methods to enhance the efficiency of the data processing pipeline and proposed a new solution that was successfully adopted by the team.",
                            "Rotation Two: Systems, Applications & Products in Data Processing (SAP)",
                            "Managed and organized over 300 process documentation files using SAP Signavio to support workflow automation, compliance, and operational efficiency.",
                            "Updated content on the firm's front-end SAP site and participated in sessions with industry leaders to deepen understanding of SAP best practices and enterprise integration."
                        ],
                        skills: ["Python", "SQL", "AWS", "Microsoft Office", "SAP", "Entreprise Software", "Cilent Relations", "Data Analysis"],
                        images: ["", "", ""]
                    }
                ]
            },
            {
                company: "Prep for Prep",
                companyUrl: "https://www.prepforprep.org/",
                location: "New York, NY",
                positions: [
                    {
                        position: "Summer Advisory System Advisor",
                        startDate: "June 2022",
                        endDate: "August 2023",
                        responsibilities: [
                            "Mentored and guided 30 students of color transitioning to independent schools, fostering academic growth and life skills development through advisory discussions.",
                            "Generated detailed reports on academic and social progress for future independent school placements."
                        ],
                        skills: ["Child Development", "Education", "Creative Problem Solving", "Communication"],
                        images: ["", "", ""]
                    }
                ]
            },
            {
                company: "Colgate-Palmolive",
                companyUrl: "https://www.colgatepalmolive.com/",
                location: "New York, NY",
                positions: [
                    {
                        position: "Predictive Innovation Team Intern",
                        startDate: "June 2021",
                        endDate: "August 2021",
                        responsibilities: [
                            "Analyzed health data with Python to predict customer trends.",
                            "Created and presented a report to Colgate's R&D department chairs to show how Colgate can use diabetes and dental health data to improve their products."
                        ],
                        skills: ["Python", "Pandas", "Data Analysis", "Microsoft Office", "Public Speaking"],
                        images: ["", "", ""]
                    }
                ]
            }
        ],
        leadershipexperience: [
            {
                company: "Lehigh University Chapter of ColorStack",
                companyUrl: "https://www.instagram.com/colorstacklu/",
                location: "Lehigh University, Bethlehem, PA",
                positions: [
                    {
                        position: "Founding Chapter Member and Secretary",
                        startDate: "March 2025",
                        endDate: "Present",
                        responsibilities: [
                            "Contributed to establishing the chapter and securing student organization recognition by the Student Senate.",
                            "Managed communications with the general body and other chapters via email and social media.",
                            "Organized and maintained a shared Google Drive with meeting notes, event plans, and essential chapter resources."
                        ],
                        skills: ["Event Planning", "Creative Problem Solving", "Mentoring", "Relationship Building"],
                        images: ["", "", ""]
                    }
                ]
            },
            {
                company: "Omicron Kappa of Kappa Alpha Psi Fraternity Inc.",
                companyUrl: "https://www.instagram.com/oknupes/",
                location: "Lehigh University, Bethlehem, PA",
                positions: [
                    {
                        position: "Polemarch and MTA Chairman",
                        startDate: "November 2023",
                        endDate: "Present",
                        responsibilities: [
                            "Led new member education by teaching Kappa Kore classes to three initiates, resulting in the highest initiation exam scores in the region.",
                            "Collaborated with alumni, chapter members, and partner organizations to plan and host an average of seven professional, social, and service events per semester, while facilitating chapter meetings to drive execution.",
                            "Acted as the official liaison between Lehigh University and Kappa's international headquarters, reporting chapter operations in monthly president meetings and biannual national conferences."
                        ],
                        skills: ["Project Management", "Delegate Management", "Stakeholder Management", "Community Development", "Event Planning", "Membership Training"],
                        images: ["", "", ""]
                    }
                ]
            },
            {
                company: "Black Student Union",
                companyUrl: "https://www.instagram.com/lehighbsu/",
                location: "Lehigh University, Bethlehem, PA",
                positions: [
                    {
                        position: "President",
                        startDate: "August 2023",
                        endDate: "Present",
                        responsibilities: [
                            "Serve as the primary liaison between the Black student community and Lehigh University, collaborating with the Alumni Office, Office of Multicultural Affairs, and school administration to host 35 culturally relevant and inclusive events.",
                            "Designed and implemented a member recruitment and retention strategy, expanding the organization to 500 active members for the 2024–25 academic year.",
                            "Lead executive board meetings and oversee all operations, ensuring smooth event logistics, strategic planning, and regional collaboration with other Black Student Unions."
                        ],
                        skills: ["Event Planning", "Event Management", "Budget Management", "Project Management", "Brand Building", "Relationship Building"],
                        images: ["", "", ""]
                    }
                ]
            },
            {
                company: "Men of Color Alliance",
                companyUrl: "https://www.instagram.com/lehighmoca/",
                location: "Lehigh University, Bethlehem, PA",
                positions: [
                    {
                        position: "President and Student Advisor",
                        startDate: "March 2023",
                        endDate: "Present",
                        responsibilities: [
                            "Revived the organization by launching 22 events focused on professional development, academic preparation, and community building for men of color at Lehigh, growing membership to over 100 students.",
                            "Recruited and mentored eight new executive board members, and led meetings with faculty, staff, and administrators to support sustainable club operations.",
                            "Secured official recognition from the Student Senate based on organizational growth and impact, and introduced the first annual Men of Color Symposium, bringing together students from six universities for a regional conference."
                        ],
                        skills: ["Community Outreach", "Membership Growth", "Creative Problem Solving", "Brand Management"],
                        images: ["", "", ""]
                    }
                ]
            },
            {
                company: "Student Senate",
                companyUrl: "https://www.instagram.com/lehighsenate/",
                location: "Lehigh University, Bethlehem, PA",
                positions: [
                    {
                        position: "Assistant Vice President of Finance",
                        startDate: "January 2023",
                        endDate: "Present",
                        responsibilities: [
                            "Conducted financial reviews of student-run organizations by analyzing budget proposals, expenditures, and historical spending to ensure responsible stewardship of the $450,000 Senate budget.",
                            "Collaborated with club leaders to evaluate the impact and relevance of proposed initiatives, prioritizing funding that reflects the diverse needs and interests of the student body.",
                            "Strategically allocated funding to support a wide range of student-led events and initiatives on campus, promoting cultural, academic, and social engagement across communities."
                        ],
                        skills: ["Data Analysis", "Budgeting", "Stakeholder Management", "Presentation Skills", "Microsoft Office", "Financing"],
                        images: ["", "", ""]
                    }
                ]
            },
            {
                company: "Office of Admissions",
                companyUrl: "https://www2.lehigh.edu/admissions",
                location: "Lehigh University, Bethlehem, PA",
                positions: [
                    {
                        position: "Diversity Recruitment Intern",
                        startDate: "August 2023",
                        endDate: "June 2024",
                        responsibilities: [
                            "Designed and delivered training programs for Admission Ambassadors, improving campus tour quality and ensuring seamless execution of Open Houses.",
                            "Planned and supported events during Yield season, represented Lehigh University at college fairs, and actively contributed to team initiatives through weekly meetings."
                        ],
                        skills: ["Convincing People", "DEI", "Team Building", "Public Speaking"],
                        images: ["", "", ""]
                    }
                ]
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
            imageUrl: "/assets/images/gallery/kappa/provincecouncil spr25 2.jpg",
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