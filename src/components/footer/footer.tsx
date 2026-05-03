import Slogan from "./slogan";

interface ContactLink {
  icon: string;
  url: string;
  label: string;
  external?: boolean;
}

const contactLinks: ContactLink[] = [
  { icon: "/mail.svg",        url: "mailto:contact@zzyzx.com", label: "contact@zzyzx.com" },
  { icon: "/github-mark.svg", url: "https://github.com/ZzyzxLabs", label: "github / ZzyzxLabs", external: true },
  { icon: "/X_icon.svg",      url: "https://x.com/", label: "x / @ZzyzxLabs", external: true },
  { icon: "/telegram.svg",    url: "https://t.me/ZzyzxLabs", label: "telegram / @ZzyzxLabs", external: true },
];

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Members", href: "#members" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-bg-base border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-20 pb-10">
        {/* Hero slogan */}
        <Slogan />

        {/* Link grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 border-t border-white/10 pt-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <img src="/zzyzx_white.png" alt="Zzyzx Labs" className="w-8 h-8" />
              <span className="font-display text-xl font-semibold text-white tracking-tight">
                Zzyzx Labs
              </span>
            </div>
            <p className="mt-5 text-sm text-text-muted leading-relaxed max-w-sm">
              A small studio shipping Web3 infrastructure and AI-native products on Sui.
            </p>
          </div>

          {/* Sitemap */}
          <div className="md:col-span-3">
            <div className="text-xs uppercase tracking-[0.3em] text-text-faint mb-5">Site</div>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-text-muted hover:text-primary text-base transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <div className="text-xs uppercase tracking-[0.3em] text-text-faint mb-5">Contact</div>
            <ul className="space-y-3">
              {contactLinks.map((c) => (
                <li key={c.url}>
                  <a
                    href={c.url}
                    target={c.external ? "_blank" : undefined}
                    rel={c.external ? "noreferrer" : undefined}
                    className="group inline-flex items-center gap-3 text-text-muted hover:text-primary transition-colors"
                  >
                    <img src={c.icon} alt="" className="w-4 h-4 invert opacity-70 group-hover:opacity-100 transition-opacity" />
                    <span className="text-base">{c.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between text-xs text-text-faint uppercase tracking-[0.25em]">
          <span>© {year} Zzyzx Labs</span>
          <span>Built with Astro · Sui</span>
        </div>
      </div>
    </footer>
  );
}
