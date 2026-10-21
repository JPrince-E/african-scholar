import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  FileText,
  Building,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  CreditCard
} from 'lucide-react';

export default function ProFormaInvoiceModal({ onClose }) {
  const [companyName, setCompanyName] = useState('Partner Institution / Corporate Sponsor');
  const [billingContact, setBillingContact] = useState('Corporate Partnerships Officer');
  const [billingEmail, setBillingEmail] = useState('partnerships@sponsor-org.com');
  const [billingCountry, setBillingCountry] = useState('Nigeria');
  const [selectedTier, setSelectedTier] = useState('MONTHLY');

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const invoiceNumber = `AS-INV-2027-${Math.floor(10000 + Math.random() * 90000)}`;
  const invoiceDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const dueDate = new Date(Date.now() + 14 * 86400000).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const tiers = {
    HOURLY: { name: 'Hourly Flash Spotlight (Keynote Slot)', usd: 50, desc: 'Top sticky placement across scholar search pages during peak continental symposium hours' },
    DAILY: { name: 'Daily Continental Showcase (24 Hours)', usd: 15, desc: '24-hour continuous homepage billboard exposure + scholar directory sidebar' },
    WEEKLY: { name: 'Weekly Multi-Portal Campaign (7 Days)', usd: 80, desc: '7 days continuous exposure across Continental Rankings and Award pages' },
    MONTHLY: { name: 'Monthly Premium Showcase (30 Days)', usd: 250, desc: 'Flagship presence across 54 African countries + monthly academic newsletter spotlight' },
    YEARLY: { name: 'Annual Flagship Corporate Partnership (365 Days)', usd: 2400, desc: '365-day permanent hero banner, co-branded award ceremony recognition, VIP gala passes' }
  };

  const currentTier = tiers[selectedTier] || tiers.MONTHLY;
  const ngnEquivalent = (currentTier.usd * 1550).toLocaleString();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-200 my-auto print:m-0 print:max-h-none print:overflow-visible print:border-none print:shadow-none print:w-full">
        {/* Top Controls Bar (hidden during printing) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 print:hidden sticky top-0 z-20">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-coral-400" />
            <span className="text-sm font-black tracking-wide">
              Official Corporate Sponsorship Quotation & Rate Card (Pro-Forma)
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-coral-500 hover:bg-coral-600 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-coral-500/20"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Configuration Bar for Corporate Sponsor (hidden on print) */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs print:hidden">
          <div>
            <label className="font-bold text-slate-500 block mb-1">Select Tier:</label>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-semibold text-slate-800 bg-white"
            >
              <option value="HOURLY">Hourly Flash ($50)</option>
              <option value="DAILY">Daily Showcase ($15)</option>
              <option value="WEEKLY">Weekly Campaign ($80)</option>
              <option value="MONTHLY">Monthly Premium ($250)</option>
              <option value="YEARLY">Annual Partner ($2,400)</option>
            </select>
          </div>
          <div>
            <label className="font-bold text-slate-500 block mb-1">Company / Institution:</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-medium text-slate-800 bg-white"
            />
          </div>
          <div>
            <label className="font-bold text-slate-500 block mb-1">Billing Contact Person:</label>
            <input
              type="text"
              value={billingContact}
              onChange={(e) => setBillingContact(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-medium text-slate-800 bg-white"
            />
          </div>
          <div>
            <label className="font-bold text-slate-500 block mb-1">Corporate Country:</label>
            <input
              type="text"
              value={billingCountry}
              onChange={(e) => setBillingCountry(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-medium text-slate-800 bg-white"
            />
          </div>
        </div>

        {/* Printable Pro-Forma Invoice Document */}
        <div className="p-8 sm:p-12 space-y-8 bg-white text-slate-900 print:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-slate-900 pb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 text-coral-500 flex items-center justify-center font-black text-2xl shadow-lg border-2 border-coral-500 shrink-0">
                AS
              </div>
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">
                  African Scholar Platform
                </h1>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Corporate Sponsorship & Partnerships Directorate
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Registry of Academic Excellence • Pan-African Visibility
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="inline-block px-3 py-1 rounded-full bg-coral-50 text-coral-700 text-xs font-black border border-coral-200">
                PRO-FORMA INVOICE
              </span>
              <p className="text-xs font-mono font-bold text-slate-700">Invoice: {invoiceNumber}</p>
              <p className="text-xs text-slate-500">Issue Date: {invoiceDate}</p>
              <p className="text-xs text-slate-500">Payment Due: {dueDate}</p>
            </div>
          </div>

          {/* Billing Entities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-extrabold uppercase text-slate-400 text-[10px] block">Issued By:</span>
              <h4 className="font-black text-slate-900 text-sm">African Scholar Platform Ltd</h4>
              <p className="text-slate-600">Directorate of Continental Partnerships & Media</p>
              <p className="text-slate-600">Lagos • Nairobi • Accra • Cape Town</p>
              <p className="text-slate-600 font-mono text-[11px]">partnerships@africanscholar.org</p>
            </div>

            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-extrabold uppercase text-slate-400 text-[10px] block">Billed To (Client / Sponsor):</span>
              <h4 className="font-black text-slate-900 text-sm">{companyName}</h4>
              <p className="text-slate-600">Attn: {billingContact}</p>
              <p className="text-slate-600">Jurisdiction: {billingCountry}</p>
              <p className="text-slate-600 font-mono text-[11px]">{billingEmail}</p>
            </div>
          </div>

          {/* Line Item Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Item & Description</th>
                  <th className="py-3 px-4 text-center">Tier Duration</th>
                  <th className="py-3 px-4 text-right">Rate (USD)</th>
                  <th className="py-3 px-4 text-right">Amount (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="py-4 px-4 space-y-1">
                    <p className="font-black text-slate-900">{currentTier.name}</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{currentTier.desc}</p>
                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                      Multi-country Pan-African Readership
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-slate-700">{selectedTier}</td>
                  <td className="py-4 px-4 text-right font-mono font-bold">${currentTier.usd.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right font-mono font-black text-slate-900">${currentTier.usd.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total & Equivalents */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 p-5 rounded-2xl bg-slate-900 text-white">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-coral-400">Total Payable Value</span>
              <p className="text-xs text-slate-300">
                Official Central Bank exchange rate pegged at ₦1,550 / $1.00 USD
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-2xl font-black text-white font-mono">${currentTier.usd.toLocaleString()}.00 USD</span>
              <span className="block text-xs font-mono font-bold text-coral-400 mt-0.5">
                (Equivalent: ₦{ngnEquivalent} NGN)
              </span>
            </div>
          </div>

          {/* Remittance & Settlement Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div className="space-y-1.5">
              <h5 className="font-black uppercase tracking-wider text-slate-700 text-[10px] flex items-center space-x-1">
                <CreditCard className="w-3.5 h-3.5 text-coral-500" />
                <span>Option A: Electronic Settlement (Paystack)</span>
              </h5>
              <p className="text-slate-600">Direct Paystack Instant Payment Gateway</p>
              <p className="font-mono text-slate-800">Merchant: African Scholar Platform</p>
              <p className="font-mono text-slate-800">Payment Reference: {invoiceNumber}</p>
            </div>

            <div className="space-y-1.5">
              <h5 className="font-black uppercase tracking-wider text-slate-700 text-[10px] flex items-center space-x-1">
                <Building className="w-3.5 h-3.5 text-azure-600" />
                <span>Option B: International Wire & SWIFT</span>
              </h5>
              <p className="text-slate-600">Standard Bank Pan-Africa / Guaranty Trust Bank</p>
              <p className="font-mono text-slate-800">Account: 0192847192 (USD DOM)</p>
              <p className="font-mono text-slate-800">SWIFT / BIC: GTBINGLA</p>
            </div>
          </div>

          {/* Legal Advertising Notice */}
          <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
            <p className="font-bold text-slate-700">Advertising & Partnership Governance Notice:</p>
            <p className="leading-relaxed">
              Subject to African Scholar Advertising Terms and Conditions (T&Cs). All sponsorships (S), partnerships (P), and advertisements (A) are subject to written confirmation or signed MOU, and Editorial Board compliance. Rates are non-refundable after commencement of banner rotation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
