import { Navigate, Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import useSEO from '../hooks/useSEO';
import PageHero from '../components/marketing/PageHero';
import SectionBlock from '../components/marketing/SectionBlock';
import { getPortfolioProject } from '../content/portfolio';

export default function PortfolioProject() {
  const { slug } = useParams();
  const project = getPortfolioProject(slug);

  useSEO({
    title: project
      ? `${project.title} — Portfolio — MO Intelligence`
      : 'Portfolio — MO Intelligence',
    description: project
      ? `${project.title}: ${project.tagline}. ${project.description}`
      : 'Explore MO Intelligence portfolio projects.',
    keywords: project
      ? `${project.title}, ${project.tagline}, MO Intelligence portfolio, AI website Mauritius`
      : 'MO Intelligence portfolio',
    url: project ? `https://moi-ai.dev/portfolio/${slug}` : 'https://moi-ai.dev/portfolio',
  });

  if (!project) {
    return <Navigate to="/portfolio" replace />;
  }

  const { title, tagline, description, url, Icon } = project;

  return (
    <>
      <PageHero eyebrow="Portfolio" title={title} subtitle={tagline} />

      <div className="site-page">
        <SectionBlock>
          <Link to="/portfolio" className="site-btn site-btn--outline" style={{ marginBottom: '1.5rem' }}>
            <ArrowLeft size={15} />
            Back to portfolio
          </Link>

          <div className="site-feature-card" style={{ maxWidth: '48rem' }}>
            {Icon && (
              <div className="site-feature-card__icon">
                <Icon size={20} />
              </div>
            )}
            <p className="site-feature-card__desc">{description}</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="site-btn site-btn--primary"
              style={{ marginTop: '1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              View live demo
              <ExternalLink size={15} />
            </a>
          </div>
        </SectionBlock>
      </div>
    </>
  );
}
