export const careerRoles = [
  "Software Engineer",
  "Junior Software Engineer",
  "Senior Software Engineer",
  "Software Developer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile App Developer",
  "Web Developer",
  "React Developer",
  "Node.js Developer",
  "Python Developer",
  "Java Developer",
  "Android Developer",
  "iOS Developer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Site Reliability Engineer",
  "QA Engineer",
  "Software Test Engineer",
  "Automation Test Engineer",
  "Data Engineer",
  "Data Analyst",
  "Data Scientist",
  "Machine Learning Engineer",
  "AI Engineer",
  "Cybersecurity Analyst",
  "Security Engineer",
  "Network Engineer",
  "IT Support Specialist",
  "Systems Administrator",
  "Database Administrator",
  "Product Manager",
  "Project Manager",
  "Project Coordinator",
  "Business Analyst",
  "UI/UX Designer",
  "Product Designer",
  "Graphic Designer",
  "Digital Marketing Specialist",
  "SEO Specialist",
  "Social Media Manager",
  "Content Writer",
  "Content Strategist",
  "Video Editor",
  "Sales Executive",
  "Business Development Executive",
  "Account Manager",
  "Customer Success Manager",
  "Customer Support Representative",
  "Human Resources Officer",
  "Talent Acquisition Specialist",
  "Recruiter",
  "Finance Officer",
  "Financial Analyst",
  "Accountant",
  "Operations Officer",
  "Operations Manager",
  "Supply Chain Associate",
  "Procurement Officer",
  "Administrative Assistant",
  "Office Administrator",
  "Program Officer",
  "Research Assistant",
  "Civil Engineer",
  "Electrical Engineer",
  "Mechanical Engineer",
  "Architect",
];

export function findCareerRoles(query: string, limit = 8) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return careerRoles.slice(0, limit);

  return careerRoles
    .map((role, index) => {
      const normalizedRole = role.toLowerCase();
      const words = normalizedRole.split(/[^a-z0-9+#.]+/);
      const score = normalizedRole.startsWith(normalizedQuery)
        ? 0
        : words.some((word) => word.startsWith(normalizedQuery))
          ? 1
          : normalizedRole.includes(normalizedQuery)
            ? 2
            : 3;
      return { role, index, score };
    })
    .filter(({ score }) => score < 3)
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .slice(0, limit)
    .map(({ role }) => role);
}
