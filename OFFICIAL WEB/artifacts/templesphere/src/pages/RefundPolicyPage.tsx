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

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="pt-20 pb-10 bg-muted/20 border-b">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h1 className="text-4xl font-bold tracking-tight mb-3">Refund Policy</h1>
              <p className="text-muted-foreground">Last updated: 1 January 2025</p>
            </motion.div>
          </div>
        </section>
        <section className="py-14 bg-white">
          <div className="container mx-auto px-4 md:px-8 max-w-3xl">
            <Section title="1. Overview">
              <p>This Refund Policy applies to all subscriptions and purchases made for TempleSphere's Temple Management System platform and associated services. We are committed to fair and transparent refund practices.</p>
            </Section>
            <Section title="2. Subscription Refunds">
              <p><strong>Free Trial Period:</strong> All plans include a 30-day free trial. No payment is charged during the trial, and no refund is applicable.</p>
              <p><strong>Monthly Subscriptions:</strong> Monthly subscription fees are non-refundable once the billing cycle has commenced. If you cancel your subscription, you will retain access to the platform until the end of the current billing period.</p>
              <p><strong>Annual Subscriptions:</strong> Annual subscriptions may be refunded on a pro-rata basis for the unused months if cancellation is requested within 14 days of renewal. After 14 days, annual fees are non-refundable but access continues until the subscription term ends.</p>
            </Section>
            <Section title="3. Eligible Refund Scenarios">
              <p>Refunds will be issued in the following circumstances:</p>
              <p>(a) <strong>Technical Failure:</strong> If TempleSphere fails to meet the 99.9% monthly uptime SLA and the downtime directly caused material disruption to your operations, a partial credit or refund proportionate to the downtime will be issued.</p>
              <p>(b) <strong>Billing Error:</strong> If you were charged an incorrect amount due to a system error on our part, a full refund of the excess amount will be processed within 7 business days.</p>
              <p>(c) <strong>Duplicate Payment:</strong> Duplicate charges resulting from a payment processing error will be fully refunded within 5 business days.</p>
            </Section>
            <Section title="4. Non-Refundable Items">
              <p>The following are non-refundable under any circumstances: (a) one-time implementation or onboarding fees; (b) add-on services or professional services already rendered; (c) subscription fees for periods already used; (d) fees paid for white-label customisation work completed.</p>
            </Section>
            <Section title="5. Refund Process">
              <p>To request a refund, email billing@templesphere.in with your account ID, subscription details, and the reason for the refund request. We will review and respond within 3 business days. Approved refunds are processed within 7–10 business days to the original payment method.</p>
            </Section>
            <Section title="6. Devotee-Facing Transactions">
              <p>Refund policies for devotee-facing transactions (darshan tickets, pooja bookings, laddu orders) are governed by each temple's own refund policy set within the TempleSphere platform. TempleSphere is not responsible for refunds on transactions between temples and their devotees.</p>
            </Section>
            <Section title="7. Dispute Resolution">
              <p>If you are unsatisfied with our refund decision, you may escalate to billing-escalation@templesphere.in. We commit to resolving all billing disputes within 14 business days.</p>
            </Section>
            <Section title="8. Contact">
              <p>Billing queries: billing@templesphere.in | +91 98765 43210</p>
            </Section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
