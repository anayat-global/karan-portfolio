// Facts carried over from the legacy karandeeparora.com site.
export const SITE = {
  name: 'Karandeep Arora',
  url: 'https://www.karandeeparora.com',
  role: 'Freelance Full Stack Developer',
  email: 'me@karandeeparora.com',
  phone: '+91 84271 68052',
  phoneHref: 'tel:+918427168052',
  whatsapp: 'https://wa.me/+918427168052',
  skype: 'skype:karan55deep?chat',
  upwork: 'https://www.upwork.com/freelancers/karandeep27',
  linkedin: 'https://www.linkedin.com/in/karandeep-arora-a85a3a10a/',
  facebook: 'https://www.facebook.com/people/Karandeep-Arora/pfbid0VCAgKirxjRYJRbKKGSZdLKoYgQjWQDXquWvJBfDtQUZsjAwb1GWTLgkTyi3tXT28l/',
  instagram: 'https://www.instagram.com/dev__karandeeparora/',
  defaultDescription:
    'Karandeep Arora is a freelance full stack developer in India with 10 years of experience in WordPress, React JS, Twilio, Python, PHP, Magento and backend development.',
};

// Contact form -> shared Strapi `lead-submission` endpoint (same as anayatglobal.com).
export const FORM = {
  endpoint: 'https://api.anayatglobalworks.com/api/lead-submissions',
  sourceSite: 'karandeeparora.com',
  turnstileSiteKey: '0x4AAAAAAD7NCsRPYhjfumRj',
};

export const STATS = [
  { value: '90+', label: 'Projects Completed' },
  { value: '6,000+', label: 'Hours Worked' },
  { value: '55+', label: 'Happy Clients' },
  { value: '30+', label: 'Repeat Clients' },
];

export const SKILLS = [
  'Magento Development',
  'WordPress Development',
  'React JS | React Native',
  'Payment Integration | Third-Party API Integration',
  'Twilio Audio Video | Twilio Flex | Studio | SMS',
  'MySQL | SQL | MongoDB | PostgreSQL',
  'AngularJS | VueJS | Redux Thunk | Redux Saga',
  'HTML | CSS | Figma | Photoshop',
];

export const EXPERIENCE = [
  { period: 'Oct 2019 – Present', role: 'Senior Consultant', company: 'Freelance (Upwork & direct clients)' },
  { period: 'May 2017 – Oct 2019', role: 'Consultant', company: 'Seasia Infotech' },
  { period: 'Oct 2014 – Apr 2017', role: 'Web Developer', company: 'Smartbuzz' },
];

export const EDUCATION = [
  { period: '2010 – 2014', title: 'B.Tech', school: 'Punjab Technical University' },
  { period: '2013', title: 'Core Java, Advanced Java', school: 'Stellar Edge Infotech' },
];

export const PROCESS = [
  { title: 'Initiation', text: "I start by understanding your needs and objectives through detailed discussion, so the project has a solid foundation." },
  { title: 'Planning & Proposal', text: 'A clear proposal covering scope, timeline and cost, with milestones and deliverables so you have a roadmap.' },
  { title: 'Contract & Kickoff', text: 'Transparent terms for roles and responsibilities, then a kickoff call to align on how we will work together.' },
  { title: 'Execution & Delivery', text: 'Regular progress updates through the channel you prefer, testing, launch and ongoing support after delivery.' },
];

export const TESTIMONIALS = [
  { quote: 'This guy performs! He fixed my issue quickly and showed me where the error was! Highly recommended if you need a good programmer!', name: 'Austin Nguyen', meta: 'Sach Viet' },
  { quote: "It's been a great experience, all tasks were completed as per requirement, will definitely work again with Karandeep in future.", name: 'Preetinder Singh', meta: 'Client' },
  { quote: 'It was a pleasure working with Karandeep. He is highly experienced in WordPress development. His problem-solving skills and professionalism made the collaboration smooth and effective. A reliable and savvy developer.', name: 'Rajnish K Thakur', meta: 'Client' },
  { quote: 'Project delivered quickly and efficiently. Thanks, job well done.', name: 'Daniel Levanon', meta: 'Client' },
  { quote: 'The freelancer successfully integrated the Python and JavaScript code so the YouTube video information is gathered correctly and displayed in a printable book style. Good communication throughout and strong problem-solving.', name: 'Mohammad Khair Alrashed', meta: 'United Kingdom' },
];

export const PORTFOLIO = [
  { title: 'Sach Viet', category: 'Web Development', img: '/img/portfolio/sachviet-min.webp' },
  { title: 'Anayat Global', category: 'Web Development', img: '/img/portfolio/anayat-min.webp' },
  { title: 'Camply', category: 'Web Development', img: '/img/portfolio/camply-min.webp' },
];

export const HERO_STATS = [
  { value: '10+', label: 'Years Experience' },
  { value: '90+', label: 'Projects Completed' },
  { value: '55+', label: 'Happy Clients' },
  { value: '30+', label: 'Repeat Clients' },
];

export const SKILL_GROUPS = [
  { title: 'CMS & E-Commerce', icon: 4, skills: [['Magento Development', 99], ['WordPress Development', 99], ['Payment & Third-Party API Integration', 92]] },
  { title: 'Frontend & Mobile', icon: 5, skills: [['React JS | React Native', 87], ['AngularJS | VueJS | Redux', 92], ['HTML | CSS | Figma | Photoshop', 99]] },
  { title: 'Backend & Communication', icon: 6, skills: [['Twilio Audio, Video, Flex, Studio & SMS', 82], ['MySQL | PostgreSQL | MongoDB', 84]] },
] as const;

export const FAQS = [
  { q: 'Do you work with international clients?', a: 'Yes. I have worked with startups, sole founders and businesses in Australia, the United States, the United Kingdom, Canada, Japan, Italy, India, Saudi Arabia and South Africa, and I am comfortable working across time zones and joining client meetings.' },
  { q: 'Which services do you offer?', a: 'WordPress, Twilio, React JS, Python, PHP, Magento and backend development, from custom themes, plugins and API integrations to full web applications and e-commerce stores.' },
  { q: 'Can I hire you through Upwork?', a: 'Yes. You can hire me directly through this website or on Upwork, where you can review my work history and ask for a proposal before starting.' },
  { q: 'How does a project work?', a: 'We start with a discussion of your goals, then I send a proposal covering scope, timeline and cost. After a contract and kickoff call, I build in stages with regular updates through the channel you prefer, then test, launch and support the project.' },
  { q: 'How much does a project cost?', a: 'It depends on scope and complexity. Share your requirements through the contact form and I will send a proposal with a clear timeline and cost, so you know what to expect before we begin.' },
  { q: 'Do you provide support after launch?', a: 'Yes. I offer ongoing maintenance and support, including updates, backups, security and performance tuning, so your site or application keeps running smoothly after it goes live.' },
];
