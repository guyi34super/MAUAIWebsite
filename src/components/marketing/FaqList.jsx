export default function FaqList({ items }) {
  return (
    <div className="site-faq">
      {items.map(({ q, a }) => (
        <details key={q} className="site-faq__item">
          <summary className="site-faq__question">{q}</summary>
          <p className="site-faq__answer">{a}</p>
        </details>
      ))}
    </div>
  );
}
