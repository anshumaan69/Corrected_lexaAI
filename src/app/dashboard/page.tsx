import { SiteHeader } from "@/components/site-header"
import { DashboardContent } from "@/components/dashboard-content"

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Main scrollable content area matching the mockup */}
        <DashboardContent />
      </div>
    </div>
  )
}
