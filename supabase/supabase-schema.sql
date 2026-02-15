-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.about (
  id integer NOT NULL DEFAULT nextval('about_id_seq'::regclass),
  languageCode character varying DEFAULT 'en'::character varying,
  imageUrl character varying NOT NULL,
  introduction text NOT NULL,
  isActive boolean DEFAULT true,
  createdAt timestamp with time zone DEFAULT now(),
  CONSTRAINT about_pkey PRIMARY KEY (id)
);
CREATE TABLE public.about_interests (
  id integer NOT NULL DEFAULT nextval('about_interests_id_seq'::regclass),
  aboutId integer,
  interest character varying,
  CONSTRAINT about_interests_pkey PRIMARY KEY (id),
  CONSTRAINT about_interests_about_id_fkey FOREIGN KEY (aboutId) REFERENCES public.about(id)
);
CREATE TABLE public.about_skills (
  id integer NOT NULL DEFAULT nextval('about_skills_id_seq'::regclass),
  aboutId integer,
  skill character varying,
  CONSTRAINT about_skills_pkey PRIMARY KEY (id),
  CONSTRAINT about_skills_about_id_fkey FOREIGN KEY (aboutId) REFERENCES public.about(id)
);
CREATE TABLE public.awards (
  id integer NOT NULL DEFAULT nextval('awards_id_seq'::regclass),
  languageCode character varying DEFAULT 'en'::character varying,
  awardImageUrl character varying NOT NULL,
  description text NOT NULL,
  isActive boolean DEFAULT true,
  createdAt timestamp with time zone DEFAULT now(),
  CONSTRAINT awards_pkey PRIMARY KEY (id)
);
CREATE TABLE public.awards_items (
  id integer NOT NULL DEFAULT nextval('awards_items_id_seq'::regclass),
  awardsId integer,
  title character varying,
  organization character varying,
  date character varying,
  description text,
  CONSTRAINT awards_items_pkey PRIMARY KEY (id),
  CONSTRAINT awards_items_awards_id_fkey FOREIGN KEY (awardsId) REFERENCES public.awards(id)
);
CREATE TABLE public.education (
  id integer NOT NULL DEFAULT nextval('education_id_seq'::regclass),
  languageCode character varying DEFAULT 'en'::character varying,
  educationImageUrl character varying NOT NULL,
  description text NOT NULL,
  isActive boolean DEFAULT true,
  createdAt timestamp with time zone DEFAULT now(),
  CONSTRAINT education_pkey PRIMARY KEY (id)
);
CREATE TABLE public.education_items (
  id integer NOT NULL DEFAULT nextval('education_items_id_seq'::regclass),
  educationId integer,
  name character varying,
  nameUrl character varying,
  educationType character varying,
  schoolType character varying,
  major character varying,
  completionDate character varying,
  description text,
  gpa character varying,
  educationImageUrl character varying,
  CONSTRAINT education_items_pkey PRIMARY KEY (id),
  CONSTRAINT education_items_education_id_fkey FOREIGN KEY (educationId) REFERENCES public.education(id)
);
CREATE TABLE public.education_organization_involvement (
  id integer NOT NULL DEFAULT nextval('education_organization_involvement_id_seq'::regclass),
  educationItemId integer,
  organization character varying,
  role character varying,
  CONSTRAINT education_organization_involvement_pkey PRIMARY KEY (id),
  CONSTRAINT education_organization_involvement_education_item_id_fkey FOREIGN KEY (educationItemId) REFERENCES public.education_items(id)
);
CREATE TABLE public.education_relevant_courses (
  id integer NOT NULL DEFAULT nextval('education_relevant_courses_id_seq'::regclass),
  educationItemId integer,
  course character varying,
  courseUrl character varying,
  CONSTRAINT education_relevant_courses_pkey PRIMARY KEY (id),
  CONSTRAINT education_relevant_courses_education_item_id_fkey FOREIGN KEY (educationItemId) REFERENCES public.education_items(id)
);
CREATE TABLE public.emails (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  first_name character varying NOT NULL,
  last_name character varying NOT NULL,
  email character varying NOT NULL,
  subject character varying NOT NULL,
  message text NOT NULL,
  ip_address inet,
  user_agent text,
  status character varying DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'sent'::character varying, 'failed'::character varying, 'spam'::character varying]::text[])),
  emailjs_response jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT emails_pkey PRIMARY KEY (id)
);
CREATE TABLE public.experience (
  id integer NOT NULL DEFAULT nextval('experience_id_seq'::regclass),
  languageCode character varying DEFAULT 'en'::character varying,
  experienceImageUrl character varying NOT NULL,
  description text NOT NULL,
  isActive boolean DEFAULT true,
  createdAt timestamp with time zone DEFAULT now(),
  CONSTRAINT experience_pkey PRIMARY KEY (id)
);
CREATE TABLE public.experience_leadership (
  id integer NOT NULL DEFAULT nextval('experience_leadership_id_seq'::regclass),
  experienceId integer,
  company character varying,
  companyUrl character varying,
  location character varying,
  CONSTRAINT experience_leadership_pkey PRIMARY KEY (id),
  CONSTRAINT experience_leadership_experience_id_fkey FOREIGN KEY (experienceId) REFERENCES public.experience(id)
);
CREATE TABLE public.experience_leadership_positions (
  id integer NOT NULL DEFAULT nextval('experience_leadership_positions_id_seq'::regclass),
  leadershipId integer,
  position character varying,
  startDate character varying,
  endDate character varying,
  responsibilities jsonb,
  skills jsonb,
  images jsonb,
  CONSTRAINT experience_leadership_positions_pkey PRIMARY KEY (id),
  CONSTRAINT experience_leadership_positions_leadership_id_fkey FOREIGN KEY (leadershipId) REFERENCES public.experience_leadership(id)
);
CREATE TABLE public.experience_professional (
  id integer NOT NULL DEFAULT nextval('experience_professional_id_seq'::regclass),
  experienceId integer,
  company character varying,
  companyUrl character varying,
  location character varying,
  CONSTRAINT experience_professional_pkey PRIMARY KEY (id),
  CONSTRAINT experience_professional_experience_id_fkey FOREIGN KEY (experienceId) REFERENCES public.experience(id)
);
CREATE TABLE public.experience_professional_positions (
  id integer NOT NULL DEFAULT nextval('experience_professional_positions_id_seq'::regclass),
  professionalId integer,
  position character varying,
  startDate character varying,
  endDate character varying,
  responsibilities jsonb,
  skills jsonb,
  images jsonb,
  CONSTRAINT experience_professional_positions_pkey PRIMARY KEY (id),
  CONSTRAINT experience_professional_positions_professional_id_fkey FOREIGN KEY (professionalId) REFERENCES public.experience_professional(id)
);
CREATE TABLE public.gallery (
  id integer NOT NULL DEFAULT nextval('gallery_id_seq'::regclass),
  languageCode character varying DEFAULT 'en'::character varying,
  title character varying NOT NULL,
  imageUrl character varying NOT NULL,
  description text NOT NULL,
  fullDescription text DEFAULT '',
  date character varying DEFAULT '',
  showInCarousel boolean DEFAULT false,
  sortOrder integer DEFAULT 0,
  isActive boolean DEFAULT true,
  createdAt timestamp with time zone DEFAULT now(),
  CONSTRAINT gallery_pkey PRIMARY KEY (id)
);
CREATE TABLE public.gallery_categories (
  id integer NOT NULL DEFAULT nextval('gallery_categories_id_seq'::regclass),
  galleryId integer,
  categoryName character varying,
  CONSTRAINT gallery_categories_pkey PRIMARY KEY (id),
  CONSTRAINT gallery_categories_gallery_id_fkey FOREIGN KEY (galleryId) REFERENCES public.gallery(id)
);
CREATE TABLE public.home (
  id integer NOT NULL DEFAULT nextval('home_id_seq'::regclass),
  languageCode character varying DEFAULT 'en'::character varying,
  imageUrl character varying NOT NULL,
  title character varying NOT NULL,
  description text NOT NULL,
  resumeUrl character varying NOT NULL,
  linkedinUrl character varying NOT NULL,
  githubUrl character varying NOT NULL,
  email character varying NOT NULL,
  isActive boolean DEFAULT true,
  createdAt timestamp with time zone DEFAULT now(),
  CONSTRAINT home_pkey PRIMARY KEY (id)
);
CREATE TABLE public.home_organizations (
  id integer NOT NULL DEFAULT nextval('home_organizations_id_seq'::regclass),
  homeId integer,
  name character varying,
  orgUrl character varying,
  orgColor character varying,
  orgPortfolioUrl character varying,
  CONSTRAINT home_organizations_pkey PRIMARY KEY (id),
  CONSTRAINT home_organizations_home_id_fkey FOREIGN KEY (homeId) REFERENCES public.home(id)
);
CREATE TABLE public.home_qualities (
  id integer NOT NULL DEFAULT nextval('home_qualities_id_seq'::regclass),
  homeId integer,
  attribute character varying,
  description text,
  CONSTRAINT home_qualities_pkey PRIMARY KEY (id),
  CONSTRAINT home_qualities_home_id_fkey FOREIGN KEY (homeId) REFERENCES public.home(id)
);
CREATE TABLE public.portfolio_sections (
  id integer NOT NULL DEFAULT nextval('portfolio_sections_id_seq'::regclass),
  sectionName character varying NOT NULL UNIQUE,
  displayName character varying NOT NULL,
  description text,
  isEnabled boolean DEFAULT true,
  sortOrder integer DEFAULT 0,
  createdAt timestamp with time zone DEFAULT now(),
  updatedAt timestamp with time zone DEFAULT now(),
  CONSTRAINT portfolio_sections_pkey PRIMARY KEY (id)
);
CREATE TABLE public.project_highlights (
  id integer NOT NULL DEFAULT nextval('project_highlights_id_seq'::regclass),
  projectItemId integer,
  highlight text,
  CONSTRAINT project_highlights_pkey PRIMARY KEY (id),
  CONSTRAINT project_highlights_project_item_id_fkey FOREIGN KEY (projectItemId) REFERENCES public.project_items(id)
);
CREATE TABLE public.project_items (
  id integer NOT NULL DEFAULT nextval('project_items_id_seq'::regclass),
  projectsId integer,
  title character varying,
  date character varying,
  description text,
  githubUrl character varying,
  liveUrl character varying,
  imageUrl character varying,
  CONSTRAINT project_items_pkey PRIMARY KEY (id),
  CONSTRAINT project_items_projects_id_fkey FOREIGN KEY (projectsId) REFERENCES public.projects(id)
);
CREATE TABLE public.project_technologies (
  id integer NOT NULL DEFAULT nextval('project_technologies_id_seq'::regclass),
  projectItemId integer,
  technology character varying,
  CONSTRAINT project_technologies_pkey PRIMARY KEY (id),
  CONSTRAINT project_technologies_project_item_id_fkey FOREIGN KEY (projectItemId) REFERENCES public.project_items(id)
);
CREATE TABLE public.projects (
  id integer NOT NULL DEFAULT nextval('projects_id_seq'::regclass),
  languageCode character varying DEFAULT 'en'::character varying,
  projectImageUrl character varying NOT NULL,
  description text NOT NULL,
  isActive boolean DEFAULT true,
  createdAt timestamp with time zone DEFAULT now(),
  CONSTRAINT projects_pkey PRIMARY KEY (id)
);