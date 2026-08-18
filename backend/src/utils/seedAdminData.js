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

const legacyApplyBy = "30 September 2026";

function applicationDeadline(index, now = new Date()) {
  const deadline = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 21 + ((index * 7) % 45),
  ));

  return deadline.toISOString().slice(0, 10);
}

function salaryRange(title) {
  if (/Manager|DevOps|Cybersecurity|Engineer/.test(title)) return "NPR 70,000 - 130,000 per month";
  if (/Developer|Analyst|Designer|Specialist|Officer/.test(title)) return "NPR 45,000 - 90,000 per month";
  if (/Intern|Assistant|Receptionist|Data Entry/.test(title)) return "NPR 25,000 - 45,000 per month";
  return "NPR 35,000 - 75,000 per month";
}

export default async function seedAdminData() {
  await Promise.all([
    Company.init(),
    Job.init(),
    Resume.init(),
    Application.init(),
  ]);

  const seedOperations = nepalJobSeed.flatMap(([title, company, location, skills, type], index) => {
    const jobLocation = `${location}, Nepal`;
    const applyBy = applicationDeadline(index);

    return [{
      updateOne: {
        filter: { title, company, location: jobLocation },
        update: {
          $setOnInsert: {
            title,
            company,
            logo: company.split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase(),
            location: jobLocation,
            salary: salaryRange(title),
            skills,
            type,
            applyBy,
            description: `${company} is seeking a motivated ${title} to join its ${type.toLowerCase()} team in ${location}. This role offers the opportunity to contribute to meaningful projects, work with experienced professionals, and grow within a supportive organization.`,
            responsibilities: "Own assigned work from planning through delivery\nCollaborate with cross-functional colleagues and stakeholders\nMaintain high quality standards and communicate progress clearly",
            requirements: `Relevant education, training, or professional experience\nPractical knowledge of ${skills}\nStrong communication, organization, and problem-solving skills`,
            benefits: "Competitive compensation\nProfessional development and career growth\nCollaborative work environment\nPaid leave and public holidays",
            applicants: index % 9,
            status: "Open",
          },
        },
        upsert: true,
      },
    }, {
      updateOne: {
        filter: {
          title,
          company,
          location: jobLocation,
          applyBy: { $in: [legacyApplyBy, "", null] },
        },
        update: { $set: { applyBy } },
      },
    }];
  });

  await Job.bulkWrite(seedOperations);
}
