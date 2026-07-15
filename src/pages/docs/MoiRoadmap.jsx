import useSEO from '../../hooks/useSEO';
import DocsArticle from '../../components/docs/DocsArticle';
import {
  roadmapContent, moiDocsSeo, getMoiPrevNext, getMoiPagePath,
} from '../../content/docs/moi';

export default function MoiRoadmap() {
  useSEO({
    title: moiDocsSeo.roadmap.title,
    description: moiDocsSeo.roadmap.description,
    url: moiDocsSeo.roadmap.url,
  });

  return (
    <DocsArticle
      breadcrumb={[
        { label: 'Docs', href: '/docs' },
        { label: 'Research & Development', href: '/docs/moi' },
        { label: 'Roadmap' },
      ]}
      title="Roadmap"
      description="MOI development stages from R0 research to production scale."
      toc={roadmapContent.toc}
      pageSlug="roadmap"
      getPrevNext={getMoiPrevNext}
      getPagePath={getMoiPagePath}
    >
      <p>{roadmapContent.intro}</p>

      <section id="stages">
        <h2>Development stages</h2>
        {roadmapContent.stages.map(({ id, title, description }) => (
          <div key={id} id={id}>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </section>

      <section id="references">
        <h2>References</h2>
        <ul>
          {roadmapContent.references.map(({ title, authors }) => (
            <li key={title}>
              <strong>{title}</strong> — {authors}
            </li>
          ))}
        </ul>
      </section>
    </DocsArticle>
  );
}
