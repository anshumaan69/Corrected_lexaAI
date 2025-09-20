import Link from "next/link"
import { Scale } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ShareButton } from "@/components/share-button"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 bg-white border-b border-gray-200 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        
        {/* Logo matching homepage */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <span className="font-medium text-xl text-gray-900">LegalAI Demystifier</span>
        </Link>
        
        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="text-gray-600 hover:text-gray-900 text-sm">
            <Link href="/">Back to Home</Link>
          </Button>
          <ShareButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
