import useSEO from '../../hooks/useSEO';
import DocsArticle from '../../components/docs/DocsArticle';
import DocsTable from '../../components/docs/DocsTable';
import {
  moiNav, architectureContent, moiDocsSeo, getMoiPrevNext, getMoiPagePath,
} from '../../content/docs/moi';

export default function MoiArchitecture() {
  useSEO({
    title: moiDocsSeo.architecture.title,
    description: moiDocsSeo.architecture.description,
    url: moiDocsSeo.architecture.url,
  });

  return (
    <DocsArticle
      breadcrumb={[
        { label: 'Docs', href: '/docs' },
        { label: 'Research & Development', href: '/docs/moi' },
        { label: 'Architecture' },
      ]}
      title="Architecture"
      description="MOI component stack and R0 configuration."
      toc={architectureContent.toc}
      pageSlug="architecture"
      getPrevNext={getMoiPrevNext}
      getPagePath={getMoiPagePath}
    >
      <section id="stack">
        <h2>Component stack</h2>
        <p>{architectureContent.intro}</p>
        <DocsTable
          headers={architectureContent.components.headers}
          rows={architectureContent.components.rows}
        />
      </section>

      <section id="r0-spec">
        <h2>{architectureContent.r0.title}</h2>
        <DocsTable
          headers={['Spec', 'Value']}
          rows={architectureContent.r0.specs.map(({ label, value }) => [label, value])}
        />
      </section>
    </DocsArticle>
  );
}
