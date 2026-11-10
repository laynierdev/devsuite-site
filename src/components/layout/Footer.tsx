import { CurrentYear } from "@/components/ui/CurrentYear";
import { Logo } from "@/components/ui/Logo";
import { ShareLinks } from "@/components/ui/ShareLinks";
import { siteConfig } from "@/config/site";
import { products } from "@/data/products";

export function Footer() {
  const repositories = products.filter((product) => product.repoUrl);

  return (
    <footer className="site-footer section-solid">
      <div className="container-xxl">
        <div className="row gx-4 gy-5">
          <div className="col-lg-5">
            <Logo />
            <p className="site-footer__about">{siteConfig.shortDescription}</p>
            <ShareLinks />
          </div>

          <nav className="col-6 col-md-4 col-lg-2" aria-label="Sections">
            <h2 className="site-footer__heading">Site</h2>
            <ul>
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
              <li>
                <a href="#explore">Explore</a>
              </li>
              <li>
                <a href="#top">Back to top</a>
              </li>
            </ul>
          </nav>

          <nav className="col-6 col-md-4 col-lg-2" aria-label="Live demos">
            <h2 className="site-footer__heading">Live demos</h2>
            <ul>
              {products.map((product) => (
                <li key={product.id}>
                  <a href={product.demoUrl} target="_blank" rel="noopener noreferrer">
                    {product.name}
                    <span className="visually-hidden"> live demo (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="col-12 col-md-4 col-lg-3" aria-label="Source code">
            <h2 className="site-footer__heading">Source</h2>
            <ul>
              {repositories.map((product) => (
                <li key={product.id}>
                  <a href={product.repoUrl} target="_blank" rel="noopener noreferrer">
                    {product.name} on GitHub
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="site-footer__base">
          <p>
            © <CurrentYear /> {siteConfig.name}. Working brand name.
          </p>
          <p>Three independent products. One way of building.</p>
        </div>
      </div>
    </footer>
  );
}
