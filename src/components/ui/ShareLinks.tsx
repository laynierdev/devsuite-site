import { CopyLinkButton } from "@/components/ui/CopyLinkButton";
import { siteConfig } from "@/config/site";

// Share buttons for the site itself. They open each network's own share
// dialog with the site URL; no social accounts are assumed or linked.

interface ShareTarget {
  name: string;
  href: string;
  /** Path data for a 24x24 icon. */
  icon: string;
}

function buildTargets(): ShareTarget[] {
  const url = encodeURIComponent(siteConfig.url);
  const text = encodeURIComponent(`${siteConfig.title} ${siteConfig.description}`);
  return [
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      icon: "M13.6 22v-8.1h2.7l.4-3.2h-3.1V8.7c0-.9.3-1.6 1.6-1.6h1.7V4.2c-.3 0-1.3-.1-2.5-.1-2.4 0-4.1 1.500-4.100 4.200v2.400H7.600v3.200h2.700V22z",
    },
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      icon: "M17.700 3h3.100l-6.700 7.700L22 21h-6.200l-4.800-6.300L5.500 21H2.400l7.200-8.200L2 3h6.300l4.400 5.800zm-1.100 16.200h1.700L7.400 4.700H5.600z",
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      icon: "M6.900 8.500H3.600V20h3.300zM5.300 3.500a2 2 0 1 0 0 3.900 2 2 0 0 0 0-3.900zM20.400 13.200c0-3.100-1.700-4.900-4.300-4.900-1.500 0-2.500.7-3.100 1.600V8.500H9.700V20h3.400v-6.100c0-1.500.7-2.500 2-2.500 1.200 0 2 .9 2 2.500V20h3.300z",
    },
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${text}%20${url}`,
      icon: "M12 2a10 10 0 0 0-8.600 15.100L2 22l5-1.300A10 10 0 1 0 12 2zm0 1.800a8.200 8.200 0 1 1-4.200 15.200l-.3-.2-2.900.8.8-2.900-.2-.3A8.200 8.200 0 0 1 12 3.800zM8.800 7.500c-.2 0-.5.1-.7.300-.3.300-1 1-1 2.300s1 2.600 1.100 2.800c.1.200 1.900 3 4.700 4.100 2.300.9 2.800.7 3.300.7.500-.1 1.600-.7 1.800-1.300.2-.600.2-1.200.2-1.300-.1-.1-.3-.2-.5-.3l-1.800-.9c-.2-.1-.4-.1-.6.1l-.8 1c-.2.200-.3.200-.6.100-.300-.1-1.100-.4-2.100-1.300-.8-.7-1.300-1.600-1.500-1.800-.1-.300 0-.4.1-.500l.4-.500c.1-.2.200-.3.300-.500.1-.2 0-.3 0-.5l-.8-1.900c-.200-.500-.400-.500-.600-.500z",
    },
  ];
}

export function ShareLinks() {
  const targets = buildTargets();
  return (
    <div className="share">
      <h2 className="site-footer__heading">Share</h2>
      <ul className="share__list">
        {targets.map((target) => (
          <li key={target.name}>
            <a
              className="share__button"
              href={target.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${target.name} (opens in a new tab)`}
              title={`Share on ${target.name}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                <path d={target.icon} />
              </svg>
            </a>
          </li>
        ))}
        <li>
          <CopyLinkButton url={siteConfig.url} />
        </li>
      </ul>
    </div>
  );
}
