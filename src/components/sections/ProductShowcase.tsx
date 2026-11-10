import { ProductPreview } from "@/components/products/ProductPreview";
import { ButtonLink } from "@/components/ui/Button";
import { products, type Product } from "@/data/products";
import { cx } from "@/lib/utils";

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProductChapter({ product, flip }: { product: Product; flip: boolean }) {
  const titleId = `${product.id}-title`;
  return (
    <article
      id={product.id}
      className={cx("product", `accent-${product.accent}`, flip && "product--flip")}
      aria-labelledby={titleId}
    >
      <div className="product__rule" data-reveal>
        <span className="product__index">{product.index}</span>
        <span className="product__category">{product.category}</span>
        <span className="product__role">{product.role}</span>
      </div>

      <div className="row g-5 gx-xl-6 align-items-start product__grid">
        <div className="col-lg-5 product__copy">
          <h3 id={titleId} className="product__title" data-reveal>
            <span className="product__name">{product.name}</span>
            <span className="product__headline">{product.headline}</span>
          </h3>
          <p className="product__desc" data-reveal>
            {product.description}
          </p>
          <ul className="capabilities" data-reveal>
            {product.capabilities.map((capability) => (
              <li key={capability}>
                <CheckIcon />
                <span>{capability}</span>
              </li>
            ))}
          </ul>
          <div className="product__actions" data-reveal>
            <ButtonLink href={product.demoUrl} variant="accent" external>
              Explore {product.name}
            </ButtonLink>
            {product.repoUrl ? (
              <a className="text-link" href={product.repoUrl} target="_blank" rel="noopener noreferrer">
                Source on GitHub<span className="visually-hidden"> for {product.name} (opens in a new tab)</span>
              </a>
            ) : null}
          </div>
        </div>

        <div className="col-lg-7 product__media" data-reveal>
          <ProductPreview product={product} />
          {product.notes.length > 0 ? (
            <ul className="product__notes">
              {product.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function ProductShowcase() {
  return (
    <section id="products" className="products section-solid" aria-labelledby="products-title">
      <div className="container-xxl">
        <header className="section-head">
          <p className="eyebrow" data-reveal>
            The tools
          </p>
          <h2 id="products-title" className="display" data-reveal="lines">
            <span className="line">
              <span>Three products.</span>
            </span>
            <span className="line" style={{ "--i": 1 } as React.CSSProperties}>
              <span>Each one focused.</span>
            </span>
          </h2>
          <p className="section-head__lead" data-reveal>
            Every tool is an independent product with its own live demo. The screens below are the real
            applications, not mock-ups.
          </p>
        </header>

        {products.map((product, i) => (
          <ProductChapter key={product.id} product={product} flip={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}
