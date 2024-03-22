import { BillingForm } from '@/components/BillingForm'
import { DashboardHeader } from '@/components/header'
import { Icons } from '@/components/icons'
import { DashboardShell } from '@/components/shell'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function Billing() {
    return (
        <DashboardShell>
          <DashboardHeader
            heading="Billing"
            text="Manage billing and your subscription plan."
          />
          <div className="grid gap-8">
            <Alert className="pl-7">
              <Icons.warning />
              <AlertTitle>This is a demo app.</AlertTitle>
              <AlertDescription>
                WebVM app is a demo app using a Stripe test environment. You can
                find a list of test card numbers on the{" "}
                <a
                  href="https://stripe.com/docs/testing#cards"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline underline-offset-8"
                >
                  Stripe docs
                </a>
                .
              </AlertDescription>
            </Alert>
            <BillingForm
            //   subscriptionPlan={{
            //     ...subscriptionPlan,
            //     isCanceled,
            //   }}
            />
          </div>
        </DashboardShell>
      )
}
