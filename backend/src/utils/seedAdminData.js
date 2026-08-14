import Application from "../models/Application.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Resume from "../models/Resume.js";

const nepalJobSeed = [
  ["Frontend Developer", "Himalayan Tech Labs", "Kathmandu", "React, TypeScript, Tailwind CSS", "Hybrid"],
  ["Backend Developer", "Everest Digital Works", "Lalitpur", "Node.js, Express, MongoDB", "Hybrid"],
  ["Full Stack Developer", "Nepal Cloud Studio", "Kathmandu", "React, Node.js, PostgreSQL", "Remote"],
  ["UI/UX Designer", "Sajilo Product House", "Lalitpur", "Figma, Prototyping, User Research", "Hybrid"],
  ["QA Engineer", "Peak Software Nepal", "Kathmandu", "Manual Testing, Playwright, API Testing", "On-site"],
  ["DevOps Engineer", "CloudYatra Solutions", "Bhaktapur", "AWS, Docker, CI/CD", "Hybrid"],
  ["Data Analyst", "Insight Nepal Analytics", "Kathmandu", "SQL, Excel, Power BI", "On-site"],
  ["Digital Marketing Executive", "Mero Growth Studio", "Lalitpur", "SEO, Google Ads, Content Marketing", "Hybrid"],
  ["Content Writer", "Himalayan Media Hub", "Kathmandu", "Content Writing, SEO, WordPress", "Remote"],
  ["Graphic Designer", "Creative Ghar Nepal", "Pokhara", "Adobe Illustrator, Photoshop, Branding", "On-site"],
  ["Mobile App Developer", "Koshi Appworks", "Kathmandu", "Flutter, Dart, Firebase", "Hybrid"],
  ["Python Developer", "Code Valley Nepal", "Lalitpur", "Python, Django, REST APIs", "Hybrid"],
  ["Java Developer", "Lumbini Systems", "Kathmandu", "Java, Spring Boot, MySQL", "On-site"],
  ["Cybersecurity Analyst", "Secure Nepal Networks", "Kathmandu", "Security Monitoring, SIEM, Networking", "On-site"],
  ["Network Engineer", "Connect Kathmandu", "Bhaktapur", "Cisco, Routing, Switching", "On-site"],
  ["IT Support Officer", "Summit Business Services", "Kathmandu", "Windows, Hardware, Help Desk", "On-site"],
  ["Business Analyst", "Pragati Consulting Nepal", "Lalitpur", "Requirements Analysis, SQL, Documentation", "Hybrid"],
  ["Project Coordinator", "Astra Nepal Solutions", "Kathmandu", "Project Management, Jira, Communication", "Hybrid"],
  ["HR Officer", "People First Nepal", "Kathmandu", "Recruitment, Employee Relations, HRIS", "On-site"],
  ["Finance Officer", "Himal Finance Services", "Lalitpur", "Accounting, Excel, Taxation", "On-site"],
  ["Accountant", "Kantipur Trading House", "Kathmandu", "Tally, VAT, Reconciliation", "On-site"],
  ["Sales Executive", "Nepal Commerce Network", "Biratnagar", "Sales, CRM, Negotiation", "On-site"],
  ["Customer Support Representative", "Sajilo Support Center", "Kathmandu", "Customer Service, Communication, CRM", "On-site"],
  ["Operations Officer", "Terai Logistics Nepal", "Bharatpur", "Operations, Excel, Coordination", "On-site"],
  ["Supply Chain Associate", "Mountain Supply Co.", "Kathmandu", "Procurement, Inventory, Excel", "On-site"],
  ["Social Media Manager", "Digital Doko Nepal", "Lalitpur", "Social Media, Content Strategy, Analytics", "Hybrid"],
  ["SEO Specialist", "Search Nepal Studio", "Kathmandu", "SEO, Google Analytics, Keyword Research", "Hybrid"],
  ["Video Editor", "Frame Nepal Creative", "Pokhara", "Premiere Pro, After Effects, Storytelling", "Hybrid"],
  ["Product Manager", "Naya Product Labs", "Kathmandu", "Product Strategy, Agile, User Research", "Hybrid"],
  ["Junior Software Engineer", "Annapurna Innovations", "Lalitpur", "JavaScript, Git, Problem Solving", "On-site"],
  ["Machine Learning Intern", "AI Nepal Research", "Kathmandu", "Python, Machine Learning, Pandas", "Hybrid"],
  ["Data Entry Officer", "Janakpur Data Services", "Janakpur", "Data Entry, Excel, Attention to Detail", "On-site"],
  ["Receptionist", "Valley Hospitality Group", "Kathmandu", "Communication, Scheduling, MS Office", "On-site"],
  ["Administrative Assistant", "Bagmati Enterprises", "Lalitpur", "Administration, MS Office, Filing", "On-site"],
  ["Field Sales Officer", "Gandaki Consumer Products", "Pokhara", "Field Sales, Reporting, Negotiation", "On-site"],
  ["Program Officer", "Community Impact Nepal", "Kathmandu", "Program Management, Reporting, Coordination", "Hybrid"],
  ["Research Assistant", "Nepal Policy Institute", "Kathmandu", "Research, Report Writing, Data Analysis", "Hybrid"],
  ["Civil Engineer", "Himalayan Build Works", "Butwal", "AutoCAD, Site Supervision, Estimation", "On-site"],
  ["Electrical Engineer", "Everest Energy Solutions", "Kathmandu", "Electrical Design, AutoCAD, Maintenance", "On-site"],
  ["Junior Accountant", "Mithila Business Group", "Janakpur", "Accounting, Tally, Excel", "On-site"],
];

export default async function seedAdminData() {
  await Promise.all([
    Company.init(),
    Job.init(),
    Resume.init(),
    Application.init(),
  ]);

  await Job.bulkWrite(
    nepalJobSeed.map(([title, company, location, skills, type], index) => ({
      updateOne: {
        filter: { title, company, location: `${location}, Nepal` },
        update: {
          $setOnInsert: {
            title,
            company,
            logo: company.split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase(),
            location: `${location}, Nepal`,
            salary: "NPR 30,000 - 80,000 per month",
            skills,
            type,
            applyBy: "30 September 2026",
            description: `Join ${company} as a ${title} and help deliver high-quality work for teams in Nepal.`,
            responsibilities: "Collaborate with the team\nDeliver assigned work on time\nCommunicate progress clearly",
            requirements: `Relevant experience or training\nSkills in ${skills}\nStrong communication skills`,
            benefits: "Career growth opportunities\nCollaborative team\nPaid leave",
            applicants: index % 9,
            status: "Open",
          },
        },
        upsert: true,
      },
    })),
  );
}
