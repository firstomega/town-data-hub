import { AppLayout } from "@/layouts/AppLayout";

export default function PrivacyPage() {
  return (
    <AppLayout contained={false}>
      <div className="container py-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-primary mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: April 28, 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-primary mb-2">1. Introduction</h2>
            <p>This Privacy Policy describes how TownCenter ("we", "us", or "our") collects, uses, and protects your personal information when you use our website, applications, and related services (collectively, the "Service"). By using the Service, you agree to the practices described in this policy. If you do not agree, please do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-2">2. Information We Collect</h2>
            <p className="mb-3">We collect the following categories of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Account information:</strong> name, email address, password (stored as a one-way hash), and the role you select at signup (homeowner or contractor).</li>
              <li><strong className="text-foreground">Profile and project data:</strong> saved towns, project addresses, permit checklists, preferences, and other content you create or store within the Service.</li>
              <li><strong className="text-foreground">Community Notes:</strong> if you are a verified contractor, any tips, observations, or comments you submit are stored alongside your account identifier and may be displayed publicly.</li>
              <li><strong className="text-foreground">Payment information:</strong> billing is processed by a third-party payment processor. We receive a transaction reference, plan, and billing status — we do not store full credit card numbers or bank details.</li>
              <li><strong className="text-foreground">Usage data:</strong> pages viewed, features used, search queries, referring URLs, IP address, browser type, device identifiers, and approximate location derived from IP.</li>
              <li><strong className="text-foreground">Cookies and local storage:</strong> small files used to keep you signed in, remember preferences, and measure how the Service is used.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-2">3. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, operate, and maintain the Service, including authentication and account management.</li>
              <li>Personalize your experience, such as showing recently viewed towns and saved projects.</li>
              <li>Process subscriptions and one-time purchases and send related billing communications.</li>
              <li>Send transactional emails such as account confirmations, password resets, and ordinance change alerts you have opted into.</li>
              <li>Analyze usage patterns to improve features, performance, and data accuracy.</li>
              <li>Detect, prevent, and respond to fraud, abuse, security incidents, and violations of our Terms of Service.</li>
              <li>Comply with applicable legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-2">4. Legal Bases for Processing</h2>
            <p>Where applicable law requires a legal basis for processing personal information, we rely on one or more of the following: performance of our contract with you, our legitimate interests in operating and improving the Service, your consent (which you may withdraw at any time), and compliance with legal obligations.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-2">5. How We Share Information</h2>
            <p className="mb-3">We share personal information only in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Service providers:</strong> with vendors that help us operate the Service, including hosting, authentication, database, analytics, email delivery, and payment processing. These providers are contractually limited to using your information for the services they provide to us.</li>
              <li><strong className="text-foreground">Public Community Notes:</strong> content you submit as a verified contractor may be displayed publicly along with your contractor display name.</li>
              <li><strong className="text-foreground">Legal requirements:</strong> when required by law, subpoena, court order, or to protect the rights, property, or safety of TownCenter, our users, or the public.</li>
              <li><strong className="text-foreground">Business transfers:</strong> in connection with a merger, acquisition, financing, or sale of assets, in which case information may be transferred subject to standard confidentiality protections.</li>
              <li><strong className="text-foreground">Aggregated or de-identified data:</strong> we may share information that has been aggregated or de-identified so it cannot reasonably be used to identify you.</li>
            </ul>
            <p className="mt-3"><strong className="text-foreground">We do not sell your personal information.</strong></p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-2">6. Data Retention</h2>
            <p>We retain personal information for as long as your account is active and as necessary to provide the Service, comply with our legal obligations, resolve disputes, and enforce our agreements. When you delete your account, we delete or anonymize your personal information within a reasonable period, except where retention is required by law or for legitimate business purposes such as fraud prevention.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-2">7. Your Rights and Choices</h2>
            <p className="mb-3">Depending on your location, you may have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Access:</strong> request a copy of the personal information we hold about you.</li>
              <li><strong className="text-foreground">Correction:</strong> ask us to correct inaccurate or incomplete information.</li>
              <li><strong className="text-foreground">Deletion:</strong> request deletion of your account and personal information, subject to legal exceptions.</li>
              <li><strong className="text-foreground">Export:</strong> request a portable copy of certain data you have provided.</li>
              <li><strong className="text-foreground">Opt-out:</strong> unsubscribe from marketing emails using the link in any such message. Transactional and account-related emails are not optional while you have an account.</li>
              <li><strong className="text-foreground">Cookies:</strong> control cookies through your browser settings. Disabling cookies may affect functionality such as staying signed in.</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, contact us at <a href="mailto:support@towncenter.io" className="text-accent hover:underline">support@towncenter.io</a>. We will respond within the timeframe required by applicable law.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-2">8. Security</h2>
            <p>We use industry-standard safeguards to protect your information, including encryption in transit (TLS), encryption at rest for sensitive fields, role-based access controls, and audit logging. No method of electronic transmission or storage is completely secure, so we cannot guarantee absolute security. In the event of a data breach affecting your personal information, we will notify you and the appropriate authorities as required by applicable law.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-2">9. Children's Privacy</h2>
            <p>The Service is not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us and we will take steps to delete it.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-2">10. Third-Party Links and Sources</h2>
            <p>The Service contains links to third-party websites, including official municipal websites and ordinance publishers (such as eCode360 and Municode). We are not responsible for the privacy practices or content of those sites. We encourage you to review the privacy policies of any third-party site you visit.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-2">11. International Users</h2>
            <p>The Service is operated from the United States and is intended for users located in the United States. If you access the Service from outside the United States, you understand that your information will be processed and stored in the United States, which may have data protection laws that differ from those in your country.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-2">12. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. When we make material changes, we will update the "Last updated" date above and, where appropriate, notify you by email or through the Service. Your continued use of the Service after the changes take effect constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-2">13. Contact</h2>
            <p>If you have questions about this Privacy Policy or how we handle your information, contact us at <a href="mailto:support@towncenter.io" className="text-accent hover:underline">support@towncenter.io</a>.</p>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}