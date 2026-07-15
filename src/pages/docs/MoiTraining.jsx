import useSEO from '../../hooks/useSEO';
import DocsArticle from '../../components/docs/DocsArticle';
import DocsCode from '../../components/docs/DocsCode';
import {
  moiNav, trainingContent, moiDocsSeo, getMoiPrevNext, getMoiPagePath,
} from '../../content/docs/moi';

export default function MoiTraining() {
  useSEO({
    title: moiDocsSeo.training.title,
    description: moiDocsSeo.training.description,
    url: moiDocsSeo.training.url,
  });

  return (
    <DocsArticle
      breadcrumb={[
        { label: 'Docs', href: '/docs' },
        { label: 'Research & Development', href: '/docs/moi' },
        { label: 'Training' },
      ]}
      title="Training"
      description="Install, validate, and train MOI from scratch."
      toc={trainingContent.toc}
      pageSlug="training"
      getPrevNext={getMoiPrevNext}
      getPagePath={getMoiPagePath}
    >
      <p>{trainingContent.intro}</p>

      <section id="install">
        <h2>{trainingContent.install.title}</h2>
        <DocsCode>{trainingContent.install.commands.join('\n')}</DocsCode>
      </section>

      <section id="smoke-test">
        <h2>{trainingContent.smokeTest.title}</h2>
        <p>{trainingContent.smokeTest.description}</p>
        <DocsCode>{trainingContent.smokeTest.commands.join('\n')}</DocsCode>
      </section>

      <section id="r0-training">
        <h2>{trainingContent.r0Training.title}</h2>
        <p>{trainingContent.r0Training.description}</p>
        {trainingContent.r0Training.steps.map(({ label, command }) => (
          <div key={command}>
            <p><strong>{label}</strong></p>
            <DocsCode>{command}</DocsCode>
          </div>
        ))}
      </section>

      <section id="cpu-mini">
        <h2>{trainingContent.cpuMini.title}</h2>
        <p>{trainingContent.cpuMini.description}</p>
        <DocsCode>{trainingContent.cpuMini.commands.join('\n')}</DocsCode>
      </section>

      <section id="sft">
        <h2>{trainingContent.sft.title}</h2>
        <p>{trainingContent.sft.description}</p>
        <DocsCode>{trainingContent.sft.commands.join('\n')}</DocsCode>
      </section>
    </DocsArticle>
  );
}
