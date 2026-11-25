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

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="pt-20 pb-10 bg-muted/20 border-b">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h1 className="text-4xl font-bold tracking-tight mb-3">Terms & Conditions</h1>
              <p className="text-muted-foreground">Last updated: 1 January 2025</p>
            </motion.div>
          </div>
        </section>
        <section className="py-14 bg-white">
          <div className="container mx-auto px-4 md:px-8 max-w-3xl">
            <Section title="1. Acceptance of Terms">
              <p>By accessing or using TempleSphere's Services, you ("Customer") agree to be bound by these Terms & Conditions ("Terms") and our Privacy Policy. If you are entering into these Terms on behalf of an organisation, you represent that you have the authority to bind that organisation.</p>
            </Section>
            <Section title="2. Description of Services">
              <p>TempleSphere provides a cloud-based Temple Management System platform comprising Counter Software, Admin Dashboard, Devotee Mobile Application, and Super Admin portal. Specific features available to you depend on your subscribed plan.</p>
            </Section>
            <Section title="3. Subscription and Payment">
              <p>Services are provided on a subscription basis. Fees are charged in advance on a monthly or annual basis. All prices are in Indian Rupees (INR) and exclusive of applicable taxes (GST). TempleSphere reserves the right to modify pricing with 30 days' notice.</p>
              <p>Failure to pay within 7 days of the due date may result in service suspension. Accounts suspended for more than 30 days for non-payment may be terminated.</p>
            </Section>
            <Section title="4. Customer Obligations">
              <p>You agree to: (a) provide accurate registration information; (b) maintain the confidentiality of your account credentials; (c) use the Services only for lawful purposes; (d) comply with all applicable Indian laws, including the Information Technology Act 2000; (e) not attempt to reverse-engineer, decompile, or circumvent the platform's security measures.</p>
            </Section>
            <Section title="5. Data Ownership">
              <p>All devotee data, transaction records, and temple operational data you input into the platform remains your property. TempleSphere acts as a data processor. You grant TempleSphere a limited licence to process this data solely to provide the Services.</p>
            </Section>
            <Section title="6. Intellectual Property">
              <p>The TempleSphere platform, including all software, design, trademarks, and content, is owned exclusively by TempleSphere Technologies Pvt. Ltd. and is protected under Indian and international intellectual property laws. Your subscription grants you a non-exclusive, non-transferable right to use the Services during the subscription term.</p>
            </Section>
            <Section title="7. Uptime and Service Levels">
              <p>TempleSphere commits to 99.9% monthly uptime for its cloud services, excluding scheduled maintenance (notified 48 hours in advance) and force majeure events. Service credits for downtime below the SLA are available upon request.</p>
            </Section>
            <Section title="8. Limitation of Liability">
              <p>To the maximum extent permitted by applicable law, TempleSphere's total liability for any claim arising under these Terms shall not exceed the total subscription fees paid by you in the three months preceding the claim. TempleSphere is not liable for indirect, incidental, special, or consequential damages.</p>
            </Section>
            <Section title="9. Termination">
              <p>Either party may terminate with 30 days' written notice. TempleSphere may immediately terminate for material breach, non-payment, or illegal use. Upon termination, you may export your data within 30 days. After 30 days, data may be permanently deleted.</p>
            </Section>
            <Section title="10. Governing Law">
              <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka, India. The parties agree to first attempt resolution through good-faith negotiation before initiating legal proceedings.</p>
            </Section>
            <Section title="11. Contact">
              <p>Legal inquiries: legal@templesphere.in | TempleSphere Technologies Pvt. Ltd., Bengaluru, Karnataka, India.</p>
            </Section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
