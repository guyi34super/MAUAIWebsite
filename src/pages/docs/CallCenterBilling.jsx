import useSEO from '../../hooks/useSEO';
import DocsArticle from '../../components/docs/DocsArticle';
import { callCenterNav, billingContent, docsSeo, getCallCenterPrevNext, getCallCenterPagePath } from '../../content/docs/callCenter';

export default function CallCenterBilling() {
  useSEO({
    title: docsSeo.billing.title,
    description: docsSeo.billing.description,
    url: docsSeo.billing.url,
  });

  return (
    <DocsArticle
      breadcrumb={[
        { label: 'Docs', href: '/docs' },
        { label: callCenterNav.product, href: '/docs/call-center' },
        { label: 'Billing' },
      ]}
      title="Billing & Invoicing"
      description="Integrated billing that turns logged activity into professional invoices."
      toc={billingContent.toc}
      pageSlug="billing"
      getPrevNext={getCallCenterPrevNext}
      getPagePath={getCallCenterPagePath}
    >
      <section id="overview">
        <h2>Overview</h2>
        <p>{billingContent.intro}</p>
      </section>

      <section id="capabilities">
        <h2>Capabilities</h2>
        <ul className="docs-bullet-list">
          {billingContent.bullets.map((item) => (
            <li key={item.slice(0, 40)}>{item}</li>
          ))}
        </ul>
      </section>
    </DocsArticle>
  );
}
