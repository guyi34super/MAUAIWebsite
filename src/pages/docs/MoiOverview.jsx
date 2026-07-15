import useSEO from '../../hooks/useSEO';
import DocsArticle from '../../components/docs/DocsArticle';
import DocsCallout from '../../components/docs/DocsCallout';
import {
  moiNav, overviewContent, moiDocsSeo, getMoiPrevNext, getMoiPagePath,
} from '../../content/docs/moi';

export default function MoiOverview() {
  useSEO({
    title: moiDocsSeo.overview.title,
    description: moiDocsSeo.overview.description,
    url: moiDocsSeo.overview.url,
  });

  return (
    <DocsArticle
      breadcrumb={[
        { label: 'Docs', href: '/docs' },
        { label: 'Research & Development', href: '/docs/moi' },
        { label: 'Overview' },
      ]}
      title="MOI AI"
      description={moiNav.tagline}
      toc={overviewContent.toc}
      pageSlug=""
      getPrevNext={getMoiPrevNext}
      getPagePath={getMoiPagePath}
    >
      <section id="introduction">
        <h2>Introduction</h2>
        {overviewContent.intro.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
        <DocsCallout variant="tip" title="Under development">
          MOI AI is currently in active R&D at the 100M-parameter scale (R0). Training runs,
          evaluation, and generation pipelines are being validated before scaling to larger rungs.
        </DocsCallout>
      </section>

      <section id="why-mauritius">
        <h2>{overviewContent.whyMauritius.title}</h2>
        <p>{overviewContent.whyMauritius.body}</p>
      </section>
    </DocsArticle>
  );
}
