import useSEO from '../../hooks/useSEO';
import DocsArticle from '../../components/docs/DocsArticle';
import DocsTable from '../../components/docs/DocsTable';
import {
  scalingContent, moiDocsSeo, getMoiPrevNext, getMoiPagePath,
} from '../../content/docs/moi';

export default function MoiScaling() {
  useSEO({
    title: moiDocsSeo.scaling.title,
    description: moiDocsSeo.scaling.description,
    url: moiDocsSeo.scaling.url,
  });

  return (
    <DocsArticle
      breadcrumb={[
        { label: 'Docs', href: '/docs' },
        { label: 'Research & Development', href: '/docs/moi' },
        { label: 'Scaling' },
      ]}
      title="Scaling"
      description="Scaling ladder, shape rules, and locked-in engineering decisions."
      toc={scalingContent.toc}
      pageSlug="scaling"
      getPrevNext={getMoiPrevNext}
      getPagePath={getMoiPagePath}
    >
      <p>{scalingContent.intro}</p>

      <section id="ladder">
        <h2>Scaling ladder</h2>
        <DocsTable
          headers={scalingContent.ladder.headers}
          rows={scalingContent.ladder.rows}
        />
      </section>

      <section id="shape-rules">
        <h2>Shape rules</h2>
        <ul>
          {scalingContent.shapeRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>

      <section id="locked-decisions">
        <h2>Locked-in decisions</h2>
        <ul>
          {scalingContent.lockedDecisions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section id="training-safety">
        <h2>Training safety</h2>
        <ul>
          {scalingContent.trainingSafety.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section id="repo-layout">
        <h2>Repository layout</h2>
        <ul>
          {scalingContent.repoLayout.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </DocsArticle>
  );
}
