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

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="pt-20 pb-10 bg-muted/20 border-b">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h1 className="text-4xl font-bold tracking-tight mb-3">Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: 1 January 2025</p>
            </motion.div>
          </div>
        </section>
        <section className="py-14 bg-white">
          <div className="container mx-auto px-4 md:px-8 max-w-3xl">
            <Section title="1. Introduction">
              <p>TempleSphere Technologies Private Limited ("TempleSphere", "we", "our", or "us") is committed to protecting the privacy of our users. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Temple Management System platform, mobile application, and associated services (collectively, "Services").</p>
              <p>By accessing or using our Services, you agree to this Privacy Policy. If you do not agree, please discontinue use of our Services.</p>
            </Section>
            <Section title="2. Information We Collect">
              <p><strong>Account Information:</strong> When you register, we collect your name, temple name, email address, phone number, and role within your organisation.</p>
              <p><strong>Devotee Data:</strong> Through use of the platform, you may input devotee information including names, contact details, and booking history. This data is owned by your temple organisation and processed by us on your behalf.</p>
              <p><strong>Transaction Data:</strong> We collect records of donations, ticket purchases, laddu orders, and pooja bookings for billing, reporting, and audit purposes.</p>
              <p><strong>Usage Data:</strong> We automatically collect information about how you interact with our Services, including IP addresses, browser type, pages visited, and timestamps.</p>
              <p><strong>Device Information:</strong> For mobile app users, we collect device identifiers, operating system version, and push notification tokens.</p>
            </Section>
            <Section title="3. How We Use Your Information">
              <p>We use collected information to: (a) provide and maintain the Services; (b) process transactions and generate receipts; (c) send operational notifications such as booking confirmations; (d) improve and personalise the platform; (e) comply with legal obligations; (f) detect and prevent fraud or misuse; and (g) respond to customer support inquiries.</p>
            </Section>
            <Section title="4. Data Sharing and Disclosure">
              <p>We do not sell your personal data. We may share information with: (a) service providers who assist in operating our platform (cloud hosting, payment processors, email services) under strict data processing agreements; (b) government authorities if required by applicable law; and (c) successors in interest in case of merger or acquisition, with advance notice to you.</p>
            </Section>
            <Section title="5. Data Security">
              <p>We implement industry-standard security measures including AES-256 encryption at rest, TLS 1.3 in transit, role-based access controls, and regular security audits. While no system is 100% secure, we continuously work to protect your data.</p>
            </Section>
            <Section title="6. Data Retention">
              <p>We retain your data for as long as your account is active or as necessary to provide Services. Financial transaction records are retained for 7 years as required by Indian accounting laws. You may request deletion of your account data by writing to privacy@templesphere.in.</p>
            </Section>
            <Section title="7. Your Rights">
              <p>Under applicable Indian privacy law and GDPR where applicable, you have the right to: access your personal data; correct inaccurate data; request deletion; object to processing; and data portability. To exercise these rights, email privacy@templesphere.in.</p>
            </Section>
            <Section title="8. Cookies">
              <p>We use cookies and similar tracking technologies to maintain sessions, analyse usage, and improve the platform. You may control cookies through your browser settings. See our Cookie Policy for full details.</p>
            </Section>
            <Section title="9. Children's Privacy">
              <p>Our Services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from minors. If you believe we have collected such information, contact us immediately.</p>
            </Section>
            <Section title="10. Changes to This Policy">
              <p>We may update this Privacy Policy periodically. We will notify you of material changes via email or a prominent notice within the platform. Your continued use after such notice constitutes acceptance of the revised policy.</p>
            </Section>
            <Section title="11. Contact Us">
              <p>For privacy-related inquiries: privacy@templesphere.in | TempleSphere Technologies Pvt. Ltd., 12th Floor, Prestige Tech Tower, Outer Ring Road, Bellandur, Bengaluru — 560103, Karnataka, India.</p>
            </Section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
