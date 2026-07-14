export default function DocsStepList({ steps }) {
  return (
    <ol className="docs-step-list">
      {steps.map(({ id, title, description }, index) => (
        <li key={id} id={id} className="docs-step-list__item">
          <div className="docs-step-list__number">{index + 1}</div>
          <div className="docs-step-list__content">
            <h3 className="docs-step-list__title">{title}</h3>
            <p className="docs-step-list__desc">{description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
