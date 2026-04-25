import { AppLayout } from "@/layouts/AppLayout";

export default function TermsPage() {
  return (
    <AppLayout contained={false}>
      <div className="container py-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-primary mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: March 1, 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-primary mb-2">1. Acceptance of Terms</h2>
            <p>By accessing or using TownCenter ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service. TownCenter reserves the right to update these Terms at any time, and your continued use of the Service constitutes acceptance of any changes.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-2">2. Description of Service</h2>
            <p>TownCenter provides a platform for accessing local zoning regulations, permit requirements, ordinance information, and related municipal data for municipalities in Bergen County, New Jersey. The Service includes searchable zoning data, permit checklists, town comparison tools, community notes from verified contractors, and related features. The Service is designed for informational purposes and does not constitute legal, architectural, or engineering advice.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-2">3. User Accounts</h2>
            <p>To access certain features of the Service, you must create an account. You agree to provide accurate and complete registration information and to keep your account credentials secure. You are responsible for all activity that occurs under your account. You must notify us immediately of any unauthorized use of your account. TownCenter reserves the right to suspend or terminate accounts that violate these Terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-2">4. Subscription and Billing</h2>
            <p>TownCenter offers free and paid subscription tiers. Paid subscriptions are billed on a monthly or annual basis as selected at the time of purchase. Prices are subject to change with 30 days' notice. You may cancel your subscription at any time; cancellation takes effect at the end of the current billing period. Refunds are not provided for partial billing periods. The Contractor plan is priced per seat, and you will be billed for the number of seats provisioned.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-2">5. User-Generated Content</h2>
            <p>TownCenter allows verified contractors to submit Community Notes — tips and observations about working in specific municipalities. By submitting a Community Note, you grant TownCenter a non-exclusive, royalty-free, worldwide license to display, distribute, and modify the content in connection with the Service. You represent that any content you submit is accurate to the best of your knowledge, does not violate any third-party rights, and does not contain defamatory, illegal, or harmful material. TownCenter reserves the right to remove, edit, or decline to publish any user-generated content at its sole discretion.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-2">6. Data Accuracy Disclaimer</h2>
            <p>TownCenter makes reasonable efforts to ensure the accuracy and currency of the zoning, permit, and ordinance information displayed on the platform. However, municipal regulations change frequently, and there may be delays between official changes and updates to the Service. <strong className="text-foreground">The information provided by TownCenter is for reference purposes only and should not be relied upon as the sole basis for any decision.</strong> Users should always verify information directly with the relevant municipality before making any decisions related to construction, permits, or property use. TownCenter is not responsible for errors, omissions, or outdated information.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-2">7. Limitation of Liability</h2>
            <p>To the maximum extent permitted by applicable law, TownCenter and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, or goodwill, arising out of or in connection with your use of the Service, whether based on warranty, contract, tort, or any other legal theory. In no event shall TownCenter's total liability exceed the amount paid by you to TownCenter in the twelve (12) months preceding the event giving rise to the claim.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-2">8. Intellectual Property</h2>
            <p>All content, features, and functionality of the Service — including but not limited to text, graphics, logos, icons, data compilations, and software — are the exclusive property of TownCenter or its licensors and are protected by United States and international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content on the Service without prior written consent.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-2">9. Termination</h2>
            <p>TownCenter may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including without limitation if you breach these Terms. Upon termination, your right to use the Service will cease immediately. All provisions of these Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-2">10. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of the State of New Jersey, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms shall be brought exclusively in the federal or state courts located in Bergen County, New Jersey, and you hereby consent to the personal jurisdiction of such courts.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary mb-2">11. Contact</h2>
            <p>If you have any questions about these Terms, please contact us at <a href="mailto:support@towncenter.io" className="text-accent hover:underline">support@towncenter.io</a>.</p>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
