import { roleBasedInterviews } from "@/constants";

export type PrepLink = {
  label: string;
  href: string;
};

/** Shown for every role */
const COMMON_PREP_LINKS: PrepLink[] = [
  { label: "GeeksforGeeks", href: "https://www.geeksforgeeks.org/" },
  { label: "W3Schools", href: "https://www.w3schools.com/" },
  { label: "MDN Web Docs", href: "https://developer.mozilla.org/" },
  { label: "freeCodeCamp", href: "https://www.freecodecamp.org/" },
  { label: "LeetCode", href: "https://leetcode.com/problemset/" },
];

const TRACK_RESOURCES: Record<string, PrepLink[]> = {
  swe: [
    {
      label: "GFG — Data Structures",
      href: "https://www.geeksforgeeks.org/data-structures/",
    },
    {
      label: "System Design Primer",
      href: "https://github.com/donnemartin/system-design-primer",
    },
  ],
  fullstack: [
    { label: "fullstackopen.com", href: "https://fullstackopen.com/en/" },
    {
      label: "GFG — Web Development",
      href: "https://www.geeksforgeeks.org/web-development/",
    },
  ],
  frontend: [
    { label: "React — Learn", href: "https://react.dev/learn" },
    { label: "W3Schools — CSS", href: "https://www.w3schools.com/css/" },
    {
      label: "MDN — Learn HTML",
      href: "https://developer.mozilla.org/en-US/docs/Learn/HTML",
    },
  ],
  backend: [
    {
      label: "GFG — Backend Development",
      href: "https://www.geeksforgeeks.org/backend-development/",
    },
    { label: "Node.js Docs", href: "https://nodejs.org/en/docs/" },
    { label: "REST API Tutorial", href: "https://www.restapitutorial.com/" },
  ],
  web: [
    { label: "W3Schools — HTML", href: "https://www.w3schools.com/html/" },
    { label: "javascript.info", href: "https://javascript.info/" },
  ],
  mobile: [
    { label: "Flutter Docs", href: "https://docs.flutter.dev/" },
    {
      label: "GFG — Mobile Development",
      href: "https://www.geeksforgeeks.org/mobile-app-development/",
    },
  ],
  android: [
    {
      label: "Android Developers — Courses",
      href: "https://developer.android.com/courses",
    },
  ],
  ios: [
    {
      label: "Apple Developer — Tutorials",
      href: "https://developer.apple.com/tutorials/",
    },
  ],
  game: [{ label: "Unity Learn", href: "https://learn.unity.com/" }],
  data_science: [
    { label: "Kaggle Learn", href: "https://www.kaggle.com/learn" },
    {
      label: "GFG — Machine Learning",
      href: "https://www.geeksforgeeks.org/machine-learning/",
    },
  ],
  data_analyst: [
    { label: "W3Schools — SQL", href: "https://www.w3schools.com/sql/" },
    { label: "Mode — SQL Tutorial", href: "https://mode.com/sql-tutorial/" },
  ],
  data_engineer: [
    {
      label: "GFG — Data Engineering",
      href: "https://www.geeksforgeeks.org/data-engineering/",
    },
    { label: "Apache Airflow Docs", href: "https://airflow.apache.org/docs/" },
  ],
  ml: [
    { label: "PyTorch Tutorials", href: "https://pytorch.org/tutorials/" },
    {
      label: "GFG — Deep Learning",
      href: "https://www.geeksforgeeks.org/deep-learning/",
    },
  ],
  ai: [
    { label: "Hugging Face — Learn", href: "https://huggingface.co/learn" },
    {
      label: "GFG — Generative AI",
      href: "https://www.geeksforgeeks.org/generative-ai/",
    },
  ],
  bi: [
    {
      label: "Microsoft Learn — Power BI",
      href: "https://learn.microsoft.com/en-us/training/powerplatform/power-bi",
    },
    { label: "Tableau Learning", href: "https://www.tableau.com/learn" },
  ],
  data_architect: [
    {
      label: "GFG — Data Warehousing",
      href: "https://www.geeksforgeeks.org/data-warehousing/",
    },
  ],
  nlp: [
    {
      label: "Hugging Face NLP Course",
      href: "https://huggingface.co/learn/nlp-course/chapter1/1",
    },
    {
      label: "GFG — NLP",
      href: "https://www.geeksforgeeks.org/natural-language-processing/",
    },
  ],
  cv: [
    { label: "OpenCV Docs", href: "https://docs.opencv.org/" },
    {
      label: "GFG — Computer Vision",
      href: "https://www.geeksforgeeks.org/computer-vision/",
    },
  ],
  stats: [
    {
      label: "GFG — Stats for Data Science",
      href: "https://www.geeksforgeeks.org/maths/maths-for-data-science-tutorial/",
    },
    { label: "R for Data Science", href: "https://r4ds.hadley.nz/" },
  ],
  devops: [
    {
      label: "Docker — Get Started",
      href: "https://docs.docker.com/get-started/",
    },
    {
      label: "GFG — DevOps",
      href: "https://www.geeksforgeeks.org/devops-tutorial/",
    },
  ],
  cloud: [
    {
      label: "AWS Skill Builder",
      href: "https://explore.skillbuilder.aws/learn",
    },
    {
      label: "GFG — Cloud Computing",
      href: "https://www.geeksforgeeks.org/cloud-computing/",
    },
  ],
  cloud_arch: [
    {
      label: "AWS Well-Architected",
      href: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html",
    },
    {
      label: "Azure Architecture Center",
      href: "https://learn.microsoft.com/en-us/azure/architecture/",
    },
  ],
  sre: [
    {
      label: "Google — Site Reliability Engineering",
      href: "https://sre.google/books/",
    },
  ],
  platform: [
    { label: "CNCF", href: "https://www.cncf.io/" },
    {
      label: "GFG — CI/CD",
      href: "https://www.geeksforgeeks.org/what-is-ci-cd/",
    },
  ],
  k8s: [
    { label: "Kubernetes Documentation", href: "https://kubernetes.io/docs/home/" },
  ],
  security: [
    {
      label: "CISA — Cybersecurity Resources",
      href: "https://www.cisa.gov/topics/cybersecurity-best-practices",
    },
    { label: "TryHackMe", href: "https://tryhackme.com/" },
  ],
  pentest: [
    { label: "OWASP", href: "https://owasp.org/" },
    {
      label: "PortSwigger — Web Security Academy",
      href: "https://portswigger.net/web-security",
    },
  ],
  security_mgmt: [
    { label: "NIST Cybersecurity Framework", href: "https://www.nist.gov/cyberframework" },
    {
      label: "CompTIA — Security+ Overview",
      href: "https://www.comptia.org/certifications/security",
    },
  ],
  qa: [
    {
      label: "GFG — Software Testing",
      href: "https://www.geeksforgeeks.org/software-testing-basics/",
    },
    { label: "ISTQB", href: "https://www.istqb.org/" },
  ],
  qa_auto: [
    { label: "Playwright Docs", href: "https://playwright.dev/docs/intro" },
    { label: "Cypress Docs", href: "https://docs.cypress.io/" },
  ],
  qa_manual: [
    {
      label: "Ministry of Testing",
      href: "https://www.ministryoftesting.com/dojo/lessons",
    },
  ],
  product: [
    {
      label: "Exponent — PM Interview Prep",
      href: "https://www.tryexponent.com/courses/product-management",
    },
  ],
  pm: [
    {
      label: "PMI — Project Management",
      href: "https://www.pmi.org/",
    },
  ],
  ba: [
    {
      label: "IIBA — Business Analysis",
      href: "https://www.iiba.org/certification/certification-resources/",
    },
  ],
  consultant: [
    {
      label: "GFG — System Design",
      href: "https://www.geeksforgeeks.org/system-design/",
    },
  ],
  agile: [
    { label: "The Scrum Guide", href: "https://scrumguides.org/scrum-guide.html" },
    { label: "Scrum.org Resources", href: "https://www.scrum.org/resources" },
  ],
  design: [
    {
      label: "Nielsen Norman Group — Articles",
      href: "https://www.nngroup.com/articles/",
    },
    { label: "Laws of UX", href: "https://lawsofux.com/" },
  ],
  sysadmin: [
    { label: "GFG — Linux", href: "https://www.geeksforgeeks.org/linux-tutorial/" },
    { label: "Linux Journey", href: "https://linuxjourney.com/" },
  ],
  network: [
    {
      label: "GFG — Computer Networks",
      href: "https://www.geeksforgeeks.org/computer-network-tutorials/",
    },
    { label: "Cisco Networking Academy", href: "https://www.netacad.com/" },
  ],
  dba: [
    {
      label: "PostgreSQL Documentation",
      href: "https://www.postgresql.org/docs/",
    },
    { label: "W3Schools — SQL", href: "https://www.w3schools.com/sql/" },
  ],
  blockchain: [
    { label: "Ethereum Developers", href: "https://ethereum.org/en/developers/docs/" },
    { label: "Solidity Docs", href: "https://docs.soliditylang.org/" },
  ],
  arvr: [{ label: "Unity Learn", href: "https://learn.unity.com/" }],
  embedded: [
    {
      label: "GFG — Embedded Systems",
      href: "https://www.geeksforgeeks.org/embedded-systems/introduction-to-embedded-systems-set-1/",
    },
  ],
  robotics: [{ label: "ROS Documentation", href: "https://docs.ros.org/" }],
  support: [
    {
      label: "Microsoft Learn",
      href: "https://learn.microsoft.com/en-us/training/browse/",
    },
  ],
  architect: [
    {
      label: "AWS Architecture Center",
      href: "https://aws.amazon.com/architecture/",
    },
    {
      label: "System Design Primer",
      href: "https://github.com/donnemartin/system-design-primer",
    },
  ],
};

const ROLE_TRACK_ROWS: { track: string; roles: string[] }[] = [
  { track: "swe", roles: ["Software Developer", "Software Engineer"] },
  { track: "fullstack", roles: ["Full Stack Developer"] },
  { track: "frontend", roles: ["Frontend Developer"] },
  { track: "backend", roles: ["Backend Developer"] },
  { track: "web", roles: ["Web Developer"] },
  { track: "mobile", roles: ["Mobile App Developer"] },
  { track: "android", roles: ["Android Developer"] },
  { track: "ios", roles: ["iOS Developer"] },
  { track: "game", roles: ["Game Developer"] },
  { track: "data_science", roles: ["Data Scientist"] },
  { track: "data_analyst", roles: ["Data Analyst"] },
  { track: "data_engineer", roles: ["Data Engineer"] },
  { track: "ml", roles: ["Machine Learning Engineer"] },
  { track: "ai", roles: ["AI Engineer"] },
  { track: "bi", roles: ["Business Intelligence Analyst"] },
  { track: "data_architect", roles: ["Data Architect"] },
  { track: "nlp", roles: ["NLP Engineer"] },
  { track: "cv", roles: ["Computer Vision Engineer"] },
  { track: "stats", roles: ["Statistician"] },
  { track: "devops", roles: ["DevOps Engineer"] },
  { track: "cloud", roles: ["Cloud Engineer"] },
  { track: "cloud_arch", roles: ["Cloud Architect"] },
  { track: "sre", roles: ["Site Reliability Engineer (SRE)"] },
  { track: "platform", roles: ["Platform Engineer"] },
  { track: "k8s", roles: ["Kubernetes Engineer"] },
  { track: "security", roles: ["Cybersecurity Analyst", "Security Engineer"] },
  { track: "pentest", roles: ["Ethical Hacker", "Penetration Tester"] },
  {
    track: "security_mgmt",
    roles: ["Information Security Analyst"],
  },
  { track: "qa", roles: ["QA Engineer", "Test Engineer"] },
  { track: "qa_auto", roles: ["Automation Tester"] },
  { track: "qa_manual", roles: ["Manual Tester"] },
  { track: "product", roles: ["Product Manager"] },
  { track: "pm", roles: ["Project Manager"] },
  { track: "ba", roles: ["Business Analyst"] },
  { track: "consultant", roles: ["IT Consultant"] },
  { track: "agile", roles: ["Scrum Master"] },
  { track: "design", roles: ["UI/UX Designer"] },
  { track: "sysadmin", roles: ["System Administrator"] },
  { track: "network", roles: ["Network Engineer"] },
  {
    track: "dba",
    roles: ["Database Administrator (DBA)"],
  },
  { track: "blockchain", roles: ["Blockchain Developer"] },
  { track: "arvr", roles: ["AR/VR Developer"] },
  { track: "embedded", roles: ["Embedded Systems Engineer"] },
  { track: "robotics", roles: ["Robotics Engineer"] },
  { track: "support", roles: ["Technical Support Engineer"] },
  { track: "architect", roles: ["Solutions Architect"] },
];

const ROLE_TO_TRACK: Record<string, string> = ROLE_TRACK_ROWS.reduce(
  (acc, row) => {
    for (const role of row.roles) acc[role] = row.track;
    return acc;
  },
  {} as Record<string, string>
);

export function getPrepLinksForRole(role: string): PrepLink[] {
  const track = ROLE_TO_TRACK[role] ?? "swe";
  const specific = TRACK_RESOURCES[track] ?? TRACK_RESOURCES.swe;
  return [...COMMON_PREP_LINKS, ...specific];
}

/** All catalog roles with links (for the Resources page) */
export function getAllRoleResourceItems() {
  return roleBasedInterviews.map((i) => ({
    role: i.role,
    type: i.type,
    techstack: i.techstack,
    links: getPrepLinksForRole(i.role),
  }));
}
