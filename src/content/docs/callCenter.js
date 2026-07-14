export const callCenterNav = {
  product: 'Call Center',
  slug: 'call-center',
  tagline: 'Web-Based Contact Management Platform',
  description:
    'A browser-based platform that gives teams a single, organized place to manage inbound and outbound customer conversations.',
  pages: [
    { slug: '', title: 'Overview', navTitle: 'Overview' },
    { slug: 'features', title: 'What It Does', navTitle: 'Features' },
    { slug: 'how-it-works', title: 'How It Works', navTitle: 'How It Works' },
    { slug: 'billing', title: 'Billing & Invoicing', navTitle: 'Billing' },
    { slug: 'get-started', title: 'Get Started', navTitle: 'Get Started' },
  ],
};

export function getCallCenterPagePath(slug) {
  return slug ? `/docs/call-center/${slug}` : '/docs/call-center';
}

export function getCallCenterPageBySlug(slug) {
  return callCenterNav.pages.find((p) => p.slug === slug);
}

export function getCallCenterPrevNext(slug) {
  const idx = callCenterNav.pages.findIndex((p) => p.slug === slug);
  return {
    prev: idx > 0 ? callCenterNav.pages[idx - 1] : null,
    next: idx < callCenterNav.pages.length - 1 ? callCenterNav.pages[idx + 1] : null,
  };
}

export const docsProducts = [
  {
    slug: 'call-center',
    title: 'Call Center',
    tagline: callCenterNav.tagline,
    description: callCenterNav.description,
    href: '/docs/call-center',
  },
];

export const overviewContent = {
  intro: [
    'Call Center is a browser-based platform that gives teams a single, organized place to manage inbound and outbound customer conversations. It replaces scattered spreadsheets, sticky notes, and disconnected phone tools with one clean interface that any agent can open and start working from immediately.',
    'Delivered as a fully managed service, it requires no complex installation, updates automatically, and works across desktop and mobile — so your team stays productive from the office or remotely.',
  ],
  whyItMatters: {
    title: 'Why It Matters',
    body: 'By centralizing conversations, records, and billing, Call Center helps teams respond faster, invoice accurately, and never lose track of a customer. It reduces the tools an agent has to juggle, shortens onboarding for new staff, and gives managers clear visibility into both service quality and revenue — all from a single, dependable web application.',
  },
  toc: [
    { id: 'introduction', title: 'Introduction' },
    { id: 'why-it-matters', title: 'Why It Matters' },
  ],
};

export const featuresContent = {
  intro:
    'The platform streamlines the full lifecycle of a customer interaction — from the moment a request comes in, through resolution, to follow-up and billing. Everything a team needs sits in one place, keeping conversations fast, consistent, and fully accountable.',
  features: [
    {
      id: 'contact-handling',
      title: 'Contact & Call Handling',
      description: 'Log, route, and manage calls from a clean dashboard so no request slips through.',
      icon: 'Phone',
    },
    {
      id: 'agent-workspace',
      title: 'Agent Workspace',
      description: 'A focused interface that puts caller details, notes, and actions in one place.',
      icon: 'LayoutDashboard',
    },
    {
      id: 'live-status',
      title: 'Live Status View',
      description: 'See who is available, busy, or in a call to balance workload in real time.',
      icon: 'Activity',
    },
    {
      id: 'records-history',
      title: 'Records & History',
      description: 'Every interaction is captured and searchable for a complete contact history.',
      icon: 'History',
    },
    {
      id: 'billing-invoicing',
      title: 'Billing & Invoicing',
      description: 'Turn logged activity into itemized invoices and track payment status end to end.',
      icon: 'Receipt',
    },
    {
      id: 'reporting-insights',
      title: 'Reporting & Insights',
      description: 'Clear summaries of volume, performance, and revenue to guide decisions.',
      icon: 'BarChart3',
    },
  ],
  toc: [
    { id: 'overview', title: 'Overview' },
    { id: 'capabilities', title: 'Capabilities' },
  ],
};

export const howItWorksContent = {
  intro: 'Follow this workflow from sign-in to follow-up. Each step is designed to keep agents focused and managers informed.',
  steps: [
    {
      id: 'sign-in',
      title: 'Sign in',
      description: 'An agent opens the platform in their browser and signs in to their workspace.',
    },
    {
      id: 'receive',
      title: 'Receive',
      description: 'Incoming calls and customer requests appear in a shared, organized queue.',
    },
    {
      id: 'handle',
      title: 'Handle',
      description: 'The agent handles the conversation while logging notes and outcomes on the same screen.',
    },
    {
      id: 'bill',
      title: 'Bill',
      description: 'Billable activity is captured automatically and can be turned into an invoice in a click.',
    },
    {
      id: 'track',
      title: 'Track',
      description: "Every interaction is saved to the contact's history for follow-up, review, and reporting.",
    },
  ],
  toc: [
    { id: 'workflow', title: 'Workflow' },
    { id: 'steps', title: 'Steps' },
  ],
};

export const billingContent = {
  intro:
    'Call Center includes an integrated billing module so the work your team logs flows straight into clean, professional invoices — no separate accounting tool required.',
  bullets: [
    'Automatic capture of billable calls and activity against each client or account.',
    'Itemized invoice generation with sequential numbering and tax handling.',
    'Payment tracking with clear paid, pending, and overdue status.',
    'Subscription and recurring-billing support for retained clients.',
    'Exportable records for handover to your accountant or finance system.',
  ],
  toc: [
    { id: 'overview', title: 'Overview' },
    { id: 'capabilities', title: 'Capabilities' },
  ],
};

export const getStartedContent = {
  intro:
    'Ready to see it in action? We offer a guided walkthrough and a tailored quotation based on your team size and requirements.',
  contact: {
    email: 'team.mau.ai@gmail.com',
    website: '/contact',
    websiteLabel: 'Book a consultation',
  },
  toc: [{ id: 'contact', title: 'Contact us' }],
};

export const docsSeo = {
  hub: {
    title: 'Documentation — MO Intelligence',
    description: 'Product documentation for MO Intelligence solutions. Explore Call Center, a web-based contact management platform.',
    url: 'https://moi-ai.dev/docs',
  },
  overview: {
    title: 'Call Center Overview — MO Intelligence Docs',
    description:
      'Overview of Call Center, a browser-based platform for managing inbound and outbound customer conversations.',
    url: 'https://moi-ai.dev/docs/call-center',
  },
  features: {
    title: 'Call Center Features — MO Intelligence Docs',
    description:
      'Explore Call Center capabilities: contact handling, agent workspace, live status, records, billing, and reporting.',
    url: 'https://moi-ai.dev/docs/call-center/features',
  },
  howItWorks: {
    title: 'How Call Center Works — MO Intelligence Docs',
    description: 'Learn the Call Center workflow: sign in, receive, handle, bill, and track every customer interaction.',
    url: 'https://moi-ai.dev/docs/call-center/how-it-works',
  },
  billing: {
    title: 'Call Center Billing — MO Intelligence Docs',
    description:
      'Integrated billing and invoicing for Call Center: automatic capture, itemized invoices, payment tracking, and exports.',
    url: 'https://moi-ai.dev/docs/call-center/billing',
  },
  getStarted: {
    title: 'Get Started with Call Center — MO Intelligence Docs',
    description: 'Book a guided walkthrough and get a tailored quotation for Call Center based on your team size.',
    url: 'https://moi-ai.dev/docs/call-center/get-started',
  },
};
