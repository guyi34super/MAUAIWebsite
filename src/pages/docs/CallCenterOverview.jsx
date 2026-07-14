import useSEO from '../../hooks/useSEO';
import DocsArticle from '../../components/docs/DocsArticle';
import DocsCallout from '../../components/docs/DocsCallout';
import { callCenterNav, overviewContent, docsSeo } from '../../content/docs/callCenter';

export default function CallCenterOverview() {
  useSEO({
    title: docsSeo.overview.title,
    description: docsSeo.overview.description,
    url: docsSeo.overview.url,
  });

  return (
    <DocsArticle
      breadcrumb={[
        { label: 'Docs', href: '/docs' },
        { label: callCenterNav.product, href: '/docs/call-center' },
        { label: 'Overview' },
      ]}
      title="Overview"
      description={callCenterNav.tagline}
      toc={overviewContent.toc}
      pageSlug=""
    >
      <section id="introduction">
        <h2>Introduction</h2>
        {overviewContent.intro.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
        <DocsCallout variant="tip" title="Fully managed">
          Call Center is delivered as a fully managed service — no complex installation, automatic updates, and
          cross-device access for your team.
        </DocsCallout>
      </section>

      <section id="why-it-matters">
        <h2>{overviewContent.whyItMatters.title}</h2>
        <p>{overviewContent.whyItMatters.body}</p>
      </section>
    </DocsArticle>
  );
}
