import React from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  MinusCircle, 
  XCircle, 
  HelpCircle, 
  Calendar, 
  Download, 
  ExternalLink,
  ShieldCheck,
  LifeBuoy
} from 'lucide-react';
import { BillingInfo, TabId } from '../types';
import { formatDate } from '../utils/formatters';

interface BillingTabProps {
  billing: BillingInfo;
  onNavigate: (tab: TabId) => void;
}

export const BillingTab: React.FC<BillingTabProps> = ({ billing, onNavigate }) => {
  const getInvoiceBadge = (status: 'paid' | 'refunded' | 'failed') => {
    if (status === 'paid') {
      return (
        <span className="inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-[#25D366]/15 text-[#3fe07f] border border-[#25D366]/30">
          <CheckCircle2 className="w-3 h-3" />
          Paid
        </span>
      );
    }
    if (status === 'refunded') {
      return (
        <span className="inline-flex items-center gap-1 text-[10.5px] font-medium px-2 py-0.5 rounded-full bg-[#8c9bc4]/15 text-[#8c9bc4] border border-[#8c9bc4]/30">
          <MinusCircle className="w-3 h-3" />
          Refunded
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-[#e2635a]/15 text-[#ff6b60] border border-[#e2635a]/30">
        <XCircle className="w-3 h-3" />
        Failed
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top 2 Cards: Plan Overview (Col 2) + Billing Help (Col 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Plan */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#14e6ff]/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#14e6ff]">
                Current Active Subscription
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 shadow-[0_0_12px_rgba(37,211,102,0.25)]">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                Active Plan
              </span>
            </div>

            <h3 className="font-['Sora'] font-bold text-lg sm:text-xl text-white leading-snug">
              {billing.planName}
            </h3>
          </div>

          <div className="pt-6 mt-6 border-t border-white/[0.08] grid grid-cols-2 gap-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8d99b3]">
                Monthly Tuition
              </div>
              <div className="font-['Sora'] font-extrabold text-lg sm:text-xl text-white mt-0.5">
                {billing.amount}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8d99b3]">
                Next Renewal Date
              </div>
              <div className="font-mono text-sm sm:text-base font-semibold text-[#14e6ff] mt-0.5">
                {formatDate(billing.nextRenewal)}
              </div>
            </div>
          </div>
        </div>

        {/* Support & Billing Help */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#14e6ff]/15 text-[#14e6ff] border border-[#14e6ff]/30 flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6" />
            </div>
            <h4 className="font-['Sora'] font-bold text-base text-white">
              Billing Inquiries
            </h4>
            <p className="text-xs text-[#8d99b3] leading-relaxed mt-2">
              Need to update payment methods, request custom invoices, or have bKash / bank transfer questions?
            </p>
          </div>

          <button
            onClick={() => onNavigate('support')}
            className="mt-6 w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <LifeBuoy className="w-4 h-4 text-[#14e6ff]" />
            <span>Contact Accounts Support</span>
          </button>
        </div>
      </div>

      {/* Invoices History Table */}
      <div className="space-y-3">
        <h3 className="font-['Sora'] font-bold text-base text-white px-1">
          Payment History &amp; Receipts
        </h3>

        <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-white/[0.06]">
          {billing.invoices.map(inv => (
            <div
              key={inv.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="font-mono text-xs font-bold text-[#8d99b3] px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10">
                  {inv.id}
                </span>

                <div className="min-w-0">
                  <div className="font-semibold text-sm text-white truncate">
                    {inv.description}
                  </div>
                  <div className="text-xs text-[#8d99b3] font-mono mt-0.5">
                    {formatDate(inv.date)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className="font-['Sora'] font-bold text-sm text-white">
                  {inv.amount}
                </span>

                {getInvoiceBadge(inv.status)}

                <button
                  onClick={() => alert(`Receipt downloaded for ${inv.id}`)}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-[#14e6ff]" />
                  <span>Receipt</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
