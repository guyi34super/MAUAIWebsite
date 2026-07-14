import useSEO from '../../hooks/useSEO';
import DocsArticle from '../../components/docs/DocsArticle';
import DocsStepList from '../../components/docs/DocsStepList';
import { callCenterNav, howItWorksContent, docsSeo } from '../../content/docs/callCenter';

export default function CallCenterHowItWorks() {
  useSEO({
    title: docsSeo.howItWorks.title,
    description: docsSeo.howItWorks.description,
    url: docsSeo.howItWorks.url,
  });

  return (
    <DocsArticle
      breadcrumb={[
        { label: 'Docs', href: '/docs' },
        { label: callCenterNav.product, href: '/docs/call-center' },
        { label: 'How It Works' },
      ]}
      title="How It Works"
      description="From sign-in to follow-up — the Call Center workflow in five steps."
      toc={howItWorksContent.toc}
      pageSlug="how-it-works"
    >
      <section id="workflow">
        <h2>Workflow</h2>
        <p>{howItWorksContent.intro}</p>
      </section>

      <section id="steps">
        <h2>Steps</h2>
        <DocsStepList steps={howItWorksContent.steps} />
      </section>
    </DocsArticle>
  );
}
