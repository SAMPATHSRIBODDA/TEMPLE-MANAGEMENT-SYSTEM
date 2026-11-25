import { Link } from "wouter";
import { Twitter, Linkedin, Instagram, Youtube } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5" data-testid="link-footer-logo">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="28" height="28" rx="7" fill="hsl(247 66% 58%)"/>
                <path d="M14 4L6 12H8.5V24H19.5V12H22L14 4Z" fill="white" fillOpacity="0.9"/>
                <rect x="11" y="16" width="6" height="8" rx="1" fill="hsl(247 66% 58%)"/>
              </svg>
              <span className="text-xl font-bold tracking-tight">Temple<span className="text-primary">Sphere</span></span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-6">
              Smart Digital Solutions for Modern Temples. One platform to manage darshan, donations, poojas, laddu sales, and devotees.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Twitter, href: "#", label: "Twitter" },
                { Icon: Linkedin, href: "#", label: "LinkedIn" },
                { Icon: Instagram, href: "#", label: "Instagram" },
                { Icon: Youtube, href: "#", label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  data-testid={`link-social-${label.toLowerCase()}`}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground text-sm">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[["About Us","/about"],["Careers","/careers"],["Blog","/blog"],["Contact","/contact"]].map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-primary transition-colors" data-testid={`link-footer-${label.toLowerCase().replace(/ /g,"-")}`}>{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground text-sm">Product</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[["Features","/features"],["Solutions","/solutions"],["Pricing","/pricing"],["Book Demo","/book-demo"],["Support","/support"],["FAQs","/faqs"]].map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-primary transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground text-sm">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[["Privacy Policy","/privacy-policy"],["Terms & Conditions","/terms"],["Refund Policy","/refund-policy"],["Cookie Policy","/cookie-policy"]].map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-primary transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© {year} TempleSphere Technologies Pvt. Ltd. All rights reserved.</p>
          <p className="text-sm text-muted-foreground">Made with care in India</p>
        </div>
      </div>
    </footer>
  );
}
