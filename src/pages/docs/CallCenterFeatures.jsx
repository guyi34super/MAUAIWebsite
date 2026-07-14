import useSEO from '../../hooks/useSEO';
import DocsArticle from '../../components/docs/DocsArticle';
import DocsFeatureGrid from '../../components/docs/DocsFeatureGrid';
import { callCenterNav, featuresContent, docsSeo } from '../../content/docs/callCenter';

export default function CallCenterFeatures() {
  useSEO({
    title: docsSeo.features.title,
    description: docsSeo.features.description,
    url: docsSeo.features.url,
  });

  return (
    <DocsArticle
      breadcrumb={[
        { label: 'Docs', href: '/docs' },
        { label: callCenterNav.product, href: '/docs/call-center' },
        { label: 'Features' },
      ]}
      title="What It Does"
      description="Core capabilities for managing customer conversations end to end."
      toc={featuresContent.toc}
      pageSlug="features"
    >
      <section id="overview">
        <h2>Overview</h2>
        <p>{featuresContent.intro}</p>
      </section>

      <section id="capabilities">
        <h2>Capabilities</h2>
        <DocsFeatureGrid features={featuresContent.features} />
      </section>
    </DocsArticle>
  );
}
