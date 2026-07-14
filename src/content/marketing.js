import {
  Bot, UserCheck, Settings2, Globe, Megaphone, Mic2,
  Clock, TrendingUp, DollarSign, Zap, Scaling, Target,
  Building2, Hotel, Home as HomeIcon, Briefcase, GraduationCap,
  ShoppingCart, Landmark, MapPin,
} from 'lucide-react';

export const SERVICES = [
  { Icon: Bot, title: 'AI Customer Service Chatbot', desc: 'Conversational AI trained on your business, products and policies. Available 24/7 across websites, WhatsApp and email with zero wait time.' },
  { Icon: UserCheck, title: 'AI Virtual Receptionist', desc: 'Multilingual AI receptionist for answering questions, qualifying leads, booking appointments and escalating high-value opportunities.' },
  { Icon: Settings2, title: 'Custom AI Solutions', desc: 'Purpose-built AI systems: workflow automation, document processing, knowledge bases, integrations and internal productivity tools.' },
  { Icon: Globe, title: 'AI Website Development', desc: 'Modern websites enhanced with AI for lead generation, customer engagement, automation and intelligent user experiences.' },
  { Icon: Megaphone, title: 'AI Marketing', desc: 'AI-powered marketing for lead generation, content creation, customer targeting and campaign optimisation.' },
  { Icon: Mic2, title: 'AI Voice Interfaces', desc: 'Voice-enabled AI assistants handling inquiries, bookings and customer interactions with natural, human-like conversation.' },
];

export const SERVICES_DETAILED = [
  {
    Icon: Bot,
    title: 'AI Customer Service Chatbot',
    desc: 'A conversational AI agent trained on your business, products, services, FAQs and policies. Deployable across websites, WhatsApp, and email. Available 24/7 with zero wait time.',
    features: ['Trained on your specific business content', 'Multi-platform: website, WhatsApp, email', '24/7 availability with instant responses', 'Seamless handoff to human agents', 'Analytics and conversation insights'],
  },
  {
    Icon: UserCheck,
    title: 'AI Virtual Receptionist',
    desc: 'Multilingual AI receptionist for answering questions, qualifying leads, booking appointments, capturing customer information, and escalating high-value opportunities.',
    features: ['Multilingual support (English, French, Creole)', 'Lead qualification and scoring', 'Calendar integration and appointment booking', 'Customer data capture and CRM sync', 'High-value lead escalation alerts'],
  },
  {
    Icon: Settings2,
    title: 'Custom AI Solutions',
    desc: 'Purpose-built AI systems for your operations: workflow automation, document processing, knowledge bases, integrations, and internal productivity systems.',
    features: ['Workflow and process automation', 'Document processing and extraction', 'Internal knowledge base systems', 'API integrations and custom pipelines', 'AI-powered dashboards and reporting'],
  },
  {
    Icon: Globe,
    title: 'AI Website Development',
    desc: 'Modern websites enhanced with AI capabilities including lead generation, customer engagement, automation, and intelligent user experiences.',
    features: ['AI-enhanced UI and user flows', 'Integrated chatbot and lead capture', 'Personalised content and recommendations', 'Automated follow-up sequences', 'Performance analytics and A/B testing'],
  },
  {
    Icon: Megaphone,
    title: 'AI Marketing',
    desc: 'AI-powered marketing systems for lead generation, content creation, customer targeting, and campaign optimisation.',
    features: ['AI-generated content and copywriting', 'Intelligent audience segmentation', 'Automated campaign management', 'Lead scoring and nurturing sequences', 'ROI tracking and optimisation'],
  },
  {
    Icon: Mic2,
    title: 'AI Voice Interfaces',
    desc: 'Voice-enabled AI assistants capable of handling inquiries, bookings, and customer interactions with natural, human-like conversation.',
    features: ['Natural language voice processing', 'Phone and IVR system integration', 'Booking and inquiry handling', 'Multi-language voice support', 'Voice analytics and reporting'],
  },
];

export const WHY = [
  { Icon: Clock, title: '24/7 Customer Engagement', desc: 'Round-the-clock availability ensures your business never misses a customer query or opportunity.' },
  { Icon: TrendingUp, title: 'Increased Lead Conversion', desc: 'Intelligent qualification and instant follow-up dramatically improve conversion rates.' },
  { Icon: DollarSign, title: 'Reduced Operational Costs', desc: 'AI handles repetitive tasks at a fraction of the cost of full-time staff.' },
  { Icon: Zap, title: 'Faster Response Times', desc: 'Customers receive answers in seconds, not hours, dramatically improving satisfaction.' },
  { Icon: Scaling, title: 'Scalable Automation', desc: 'Solutions grow with your business from SME to enterprise without added overhead.' },
  { Icon: Target, title: 'Tailored Implementations', desc: 'Custom-built for each client — SMEs and enterprises across every industry.' },
];

export const INDUSTRIES = [
  { Icon: Building2, label: 'Healthcare' },
  { Icon: Hotel, label: 'Hospitality' },
  { Icon: HomeIcon, label: 'Real Estate' },
  { Icon: Briefcase, label: 'Professional' },
  { Icon: GraduationCap, label: 'Education' },
  { Icon: ShoppingCart, label: 'E-Commerce' },
  { Icon: Landmark, label: 'Finance' },
];

export const AFRICA_POINTS = [
  { Icon: MapPin, title: "Mauritius: Africa's Tech Gateway", desc: 'Mauritius ranks among Africa\'s top business destinations. MO Intelligence is built here to serve the continent.' },
  { Icon: Globe, title: 'Multilingual AI for Africa', desc: 'English, French and Creole — covering both Anglophone and Francophone Africa with culturally aware AI.' },
  { Icon: MapPin, title: 'Serving the Continent', desc: 'From East Africa to Southern Africa, our AI solutions are designed for the pace and scale of the African market.' },
];

export const FAQS = [
  { q: 'What is MO Intelligence?', a: 'MO Intelligence is Mauritius\'s leading artificial intelligence company. We build custom AI chatbots, AI virtual receptionists, workflow automation, AI websites, AI marketing systems, and AI voice interfaces for businesses across Mauritius and Africa.' },
  { q: 'Which AI company is based in Mauritius?', a: 'MO Intelligence is Mauritius\'s top AI solutions company, headquartered in Mauritius. We serve businesses throughout Mauritius, the Indian Ocean islands, and the African continent.' },
  { q: 'Does MO Intelligence serve businesses in Africa?', a: 'Yes. Based in Mauritius — Africa\'s technology and business gateway — MO Intelligence serves businesses across Africa. Our multilingual AI systems (English, French, Creole) are designed for both Anglophone and Francophone African markets.' },
  { q: 'What AI services are available in Mauritius?', a: 'MO Intelligence offers AI chatbots, AI receptionists, custom AI automation, AI-enhanced websites, AI marketing systems, and AI voice interfaces — all fully customised for your business in Mauritius or Africa.' },
  { q: 'Is AI suitable for small businesses in Mauritius?', a: 'Absolutely. MO Intelligence\'s solutions serve both SMEs and large enterprises. An AI chatbot or receptionist gives small businesses 24/7 customer service at a fraction of the cost of human staff, making AI accessible at every business size.' },
  { q: 'How do I get started with AI for my business?', a: 'Book a free discovery call with MO Intelligence. We learn about your business, design a tailored AI solution, build and integrate it, then launch and optimise for results. Contact us at moi-ai.dev/contact.' },
];

export const PROCESS = [
  { title: 'Discovery Call', desc: 'We learn about your business, goals, pain points, and the opportunities AI can unlock for you.' },
  { title: 'Solution Design', desc: 'We design a tailored AI solution that fits your specific workflows, systems, and customers.' },
  { title: 'Build & Integrate', desc: 'Our team builds and integrates the AI system into your existing tools and platforms.' },
  { title: 'Launch & Optimise', desc: 'We launch, monitor, and continuously optimise for performance and business outcomes.' },
];

export const TEAM = [
  ['Reezvi Pydiah', 'Founder & MD'],
  ['Bhavish Nobeen', 'Director of Technology'],
  ['Rushal Seeruthun', 'Director of Engineering'],
  ['Taj Aundoo', 'Director of Operations'],
];
