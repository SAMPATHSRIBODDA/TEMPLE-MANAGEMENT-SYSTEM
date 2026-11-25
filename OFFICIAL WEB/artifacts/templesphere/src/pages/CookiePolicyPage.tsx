import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4 text-foreground">{title}</h2>
      <div className="text-muted-foreground text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="pt-20 pb-10 bg-muted/20 border-b">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h1 className="text-4xl font-bold tracking-tight mb-3">Cookie Policy</h1>
              <p className="text-muted-foreground">Last updated: 1 January 2025</p>
            </motion.div>
          </div>
        </section>
        <section className="py-14 bg-white">
          <div className="container mx-auto px-4 md:px-8 max-w-3xl">
            <Section title="1. What Are Cookies">
              <p>Cookies are small text files placed on your device when you visit a website. They are widely used to make websites function efficiently and to provide information to site owners. TempleSphere uses cookies and similar tracking technologies (web beacons, pixels) to operate and improve our Services.</p>
            </Section>
            <Section title="2. Types of Cookies We Use">
              <p><strong>Strictly Necessary Cookies:</strong> These are essential for the platform to function. They enable core features such as user authentication, session management, and security. These cannot be disabled.</p>
              <p><strong>Performance Cookies:</strong> These collect anonymous information about how visitors use our platform — which pages are visited most, error messages encountered — helping us improve the user experience. We use tools such as Google Analytics for this purpose.</p>
              <p><strong>Functional Cookies:</strong> These remember your preferences such as language settings, dashboard layouts, and notification preferences to provide a personalised experience.</p>
              <p><strong>Marketing Cookies:</strong> Where you have consented, we use cookies to display relevant marketing about TempleSphere on third-party platforms. You may opt out of these at any time.</p>
            </Section>
            <Section title="3. Cookie Duration">
              <p>Session cookies are temporary and expire when you close your browser. Persistent cookies remain on your device for a defined period (typically 30 days to 1 year depending on purpose) or until you delete them manually.</p>
            </Section>
            <Section title="4. Third-Party Cookies">
              <p>Some cookies on our platform are set by third parties, including Google Analytics, Intercom (customer support), and payment processors. These third parties have their own privacy policies and cookie practices which we encourage you to review.</p>
            </Section>
            <Section title="5. Managing Cookies">
              <p>You can control and delete cookies through your browser settings. Most browsers allow you to: view cookies stored on your device; delete cookies on exit or manually; block all or certain cookies from specific sites.</p>
              <p>Note: Disabling strictly necessary cookies will prevent you from logging into the TempleSphere platform. Performance and functional cookies can be disabled with minimal impact on core functionality.</p>
            </Section>
            <Section title="6. Cookie Consent">
              <p>On your first visit to the TempleSphere website, you will be presented with a cookie consent banner. By clicking "Accept All", you consent to our use of all cookie categories described above. You may click "Manage Preferences" to select which categories you consent to.</p>
            </Section>
            <Section title="7. Changes to This Policy">
              <p>We may update this Cookie Policy to reflect changes in technology or law. We will notify you of material changes via a notice on our website or by email.</p>
            </Section>
            <Section title="8. Contact">
              <p>For cookie-related queries: privacy@templesphere.in</p>
            </Section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
