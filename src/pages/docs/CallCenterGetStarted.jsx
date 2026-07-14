import { Link } from 'react-router-dom';
import { Mail, ExternalLink } from 'lucide-react';
import useSEO from '../../hooks/useSEO';
import DocsArticle from '../../components/docs/DocsArticle';
import { callCenterNav, getStartedContent, docsSeo } from '../../content/docs/callCenter';

export default function CallCenterGetStarted() {
  useSEO({
    title: docsSeo.getStarted.title,
    description: docsSeo.getStarted.description,
    url: docsSeo.getStarted.url,
  });

  const { email, website, websiteLabel } = getStartedContent.contact;

  return (
    <DocsArticle
      breadcrumb={[
        { label: 'Docs', href: '/docs' },
        { label: callCenterNav.product, href: '/docs/call-center' },
        { label: 'Get Started' },
      ]}
      title="Get Started"
      description="Book a guided walkthrough and receive a tailored quotation."
      toc={getStartedContent.toc}
      pageSlug="get-started"
    >
      <section id="contact">
        <h2>Contact us</h2>
        <p>{getStartedContent.intro}</p>

        <div className="docs-contact-card">
          <a href={`mailto:${email}`} className="docs-contact-card__item">
            <Mail size={18} />
            <span>
              <span className="docs-contact-card__label">Email</span>
              <span className="docs-contact-card__value">{email}</span>
            </span>
          </a>
          <Link to={website} className="docs-contact-card__item">
            <ExternalLink size={18} />
            <span>
              <span className="docs-contact-card__label">Website</span>
              <span className="docs-contact-card__value">{websiteLabel}</span>
            </span>
          </Link>
        </div>
      </section>
    </DocsArticle>
  );
}
