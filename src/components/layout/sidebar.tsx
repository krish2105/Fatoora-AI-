'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Building2, 
  Package, 
  Receipt, 
  Calculator, 
  LineChart, 
  CheckCircle,
  Settings,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
  { name: 'Invoices', href: '/app/invoices', icon: FileText },
  { name: 'Customers', href: '/app/customers', icon: Users },
  { name: 'Vendors', href: '/app/vendors', icon: Building2 },
  { name: 'Products & Services', href: '/app/products', icon: Package },
  { name: 'Expenses', href: '/app/expenses', icon: Receipt },
  { name: 'VAT Center', href: '/app/vat', icon: Calculator },
  { name: 'Cash Flow', href: '/app/cashflow', icon: LineChart },
  { name: 'E-Invoicing Ready', href: '/app/e-invoicing', icon: CheckCircle },
  { name: 'Reports', href: '/app/reports', icon: FileText },
]

export function Sidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-950/95 backdrop-blur-xl border-r border-slate-800/60 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 shadow-2xl md:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800/60">
          <Link href="/app/dashboard" className="text-xl font-bold text-emerald-400 tracking-tight flex items-center gap-2 text-glow">
            <div className="w-6 h-6 rounded bg-emerald-500/20 flex items-center justify-center">
              <div className="w-3 h-3 bg-emerald-400 rounded-sm" />
            </div>
            Fatoora AI
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden text-slate-400 hover:text-white" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-hide">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                  isActive 
                    ? "text-emerald-400 bg-emerald-500/10 shadow-[inset_4px_0_0_0_rgba(16,185,129,1)]" 
                    : "text-slate-400 hover:text-slate-50 hover:bg-slate-900/50"
                )}
                onClick={() => onClose()}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent pointer-events-none" />
                )}
                <item.icon className={cn(
                  "h-5 w-5 transition-colors", 
                  isActive ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "text-slate-500 group-hover:text-slate-300"
                )} />
                <span className="relative z-10">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-800/60 bg-slate-950/50">
          <Link
            href="/app/settings/company"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
              pathname.startsWith('/app/settings')
                ? "text-emerald-400 bg-emerald-500/10 shadow-[inset_4px_0_0_0_rgba(16,185,129,1)]" 
                : "text-slate-400 hover:text-slate-50 hover:bg-slate-900/50"
            )}
            onClick={() => onClose()}
          >
            <Settings className={cn(
              "h-5 w-5 transition-colors",
              pathname.startsWith('/app/settings') ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "text-slate-500 group-hover:text-slate-300"
            )} />
            Settings
          </Link>
        </div>
      </aside>
    </>
  )
}
