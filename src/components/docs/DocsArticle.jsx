import DocsBreadcrumb from '../../components/docs/DocsBreadcrumb';
import DocsTableOfContents from '../../components/docs/DocsTableOfContents';
import DocsPrevNext from '../../components/docs/DocsPrevNext';
import { getCallCenterPrevNext } from '../../content/docs/callCenter';

export default function DocsArticle({
  breadcrumb,
  title,
  description,
  toc = [],
  pageSlug,
  children,
}) {
  const { prev, next } = pageSlug !== undefined ? getCallCenterPrevNext(pageSlug) : { prev: null, next: null };

  return (
    <article className="docs-article">
      <div className="docs-article__layout">
        <div className="docs-article__content">
          <DocsBreadcrumb items={breadcrumb} />
          <header className="docs-article__header">
            <h1 className="docs-article__title">{title}</h1>
            {description && <p className="docs-article__subtitle">{description}</p>}
          </header>
          {toc.length > 0 && (
            <div className="docs-toc-mobile">
              <DocsTableOfContents items={toc} />
            </div>
          )}
          <div className="docs-prose">{children}</div>
          {pageSlug !== undefined && <DocsPrevNext prev={prev} next={next} />}
        </div>
        {toc.length > 0 && (
          <div className="docs-article__toc">
            <DocsTableOfContents items={toc} />
          </div>
        )}
      </div>
    </article>
  );
}
