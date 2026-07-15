import DocsBreadcrumb from './DocsBreadcrumb';
import DocsTableOfContents from './DocsTableOfContents';
import DocsPrevNext from './DocsPrevNext';

export default function DocsArticle({
  breadcrumb,
  title,
  description,
  toc = [],
  pageSlug,
  getPrevNext,
  getPagePath,
  children,
}) {
  const { prev, next } = pageSlug !== undefined && getPrevNext
    ? getPrevNext(pageSlug)
    : { prev: null, next: null };

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
          {pageSlug !== undefined && getPagePath && (
            <DocsPrevNext prev={prev} next={next} getPagePath={getPagePath} />
          )}
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
