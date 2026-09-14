'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  Landmark, 
  Wallet, 
  Coins, 
  CheckCircle2, 
  BarChart3, 
  PieChart as PieIcon,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { getFinancialMetrics, BalanceSheetData } from '@/lib/ledger-actions';
import { formatCurrency, formatDate } from '@/lib/utils';

const PIE_COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'];

export default function FinancialReportsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedFy, setSelectedFy] = useState('FY 2026-27');
  const [reportDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const data: BalanceSheetData = useMemo(() => {
    return getFinancialMetrics();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const rows = [
      ['STARCITY HEIGHTS COOPERATIVE HOUSING SOCIETY LTD'],
      ['AUDITED STATEMENT OF INCOME & EXPENDITURE'],
      [`Period: ${selectedFy}`, `Generated On: ${reportDate}`],
      [''],
      ['PART A: INCOME & RECEIPTS', 'AMOUNT (INR)'],
      ['Maintenance Charges Collected', data.maintenance_income],
      ['Clubhouse & Amenities Rental', 5000],
      ['Extra Parking Charges', 1200],
      ['Bank Fixed Deposit Interest', 14850],
      ['Flat Transfer Premium & NOC', 25000],
      ['Scrap & Waste Materials Sale', 3400],
      ['TOTAL RECEIPTS (A)', data.total_income],
      [''],
      ['PART B: OPERATING EXPENDITURE', 'AMOUNT (INR)'],
      ...data.category_expenses.map((c) => [c.category, c.amount]),
      ['TOTAL EXPENDITURE (B)', data.total_expenses],
      [''],
      ['PART C: NET OPERATIONAL SURPLUS / (DEFICIT)', data.net_surplus],
      [''],
      ['PART D: CAPITAL & RESERVE FUNDS POSITION', 'AMOUNT (INR)'],
      ['Statutory Sinking Fund (SBI Fixed Deposits)', data.sinking_fund_fd],
      ['Major Repairs & Painting Reserve Fund', data.major_repairs_fund_fd],
      ['Operating Current Account (SBI Bank)', data.bank_current_account],
      ['Petty Cash in Hand', data.petty_cash],
      ['TOTAL SOCIETY FUNDS & NET WORTH', data.total_society_funds],
    ];

    const csvContent = rows.map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Starcity_BalanceSheet_${selectedFy.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 print:space-y-4">
      {/* Top Header Controls (Hidden in Print) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-700">
              Audit & Governance
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-500">Cooperative Housing Model Act</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Financial Reports & Balance Sheet
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Audited statement of income and expenditure, visual monthly cash flows, and capital reserve funds.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
            <Calendar className="mr-2 h-4 w-4 text-slate-400" />
            <select
              value={selectedFy}
              onChange={(e) => setSelectedFy(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none"
            >
              <option value="FY 2026-27">FY 2026–2027 (Current)</option>
              <option value="FY 2025-26">FY 2025–2026 (Audited)</option>
            </select>
          </div>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Export CSV
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <Printer className="h-4 w-4" />
            Print AGM Statement
          </button>
        </div>
      </div>

      {/* Capital Reserve Summary Cards (Hidden in Print for compact formal format) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 print:hidden">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Statutory Sinking Fund</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Landmark className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{formatCurrency(data.sinking_fund_fd)}</div>
            <div className="mt-1 text-[11px] text-slate-500">Secured in SBI Term Fixed Deposits</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Major Repairs Reserve</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{formatCurrency(data.major_repairs_fund_fd)}</div>
            <div className="mt-1 text-[11px] text-slate-500">Earmarked for painting & structural repairs</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Operating Bank Balance</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-purple-900">{formatCurrency(data.bank_current_account)}</div>
            <div className="mt-1 text-[11px] text-slate-500">Current A/c #992810382 + Petty Cash</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Society Net Worth</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Coins className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-amber-700">{formatCurrency(data.total_society_funds)}</div>
            <div className="mt-1 text-[11px] text-slate-500">Combined liquid & reserve assets</div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Row (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
        {/* Income vs Expenses Trend Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Monthly Cash Flow Trend (Apr – Sep 2026)</h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">Inflows vs Operating Outflows</span>
          </div>

          <div className="h-72 w-full">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthly_trends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(val) => `₹${val / 1000}k`} />
                  <Tooltip
                    formatter={(val: number) => [formatCurrency(val), '']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="income" name="Income Realized" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Operating Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">Loading chart...</div>
            )}
          </div>
        </div>

        {/* Operating Expense Distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <PieIcon className="h-5 w-5 text-purple-600" />
              <h2 className="text-sm font-bold text-slate-900">Expense Allocation</h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">By Category</span>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.category_expenses}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="amount"
                  >
                    {data.category_expenses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [formatCurrency(val), '']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">Loading chart...</div>
            )}
          </div>

          <div className="mt-2 space-y-1.5 max-h-32 overflow-y-auto pr-1">
            {data.category_expenses.slice(0, 4).map((c, i) => (
              <div key={c.category} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  <span className="text-slate-600 truncate max-w-[140px]">{c.category}</span>
                </div>
                <span className="font-bold text-slate-900">{c.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FORMAL AUDITED STATEMENT (PRINT FRIENDLY) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm print:border-none print:shadow-none print:p-0">
        {/* Society Letterhead */}
        <div className="border-b-2 border-slate-900 pb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Building2 className="h-7 w-7 text-blue-700 print:text-black" />
            <span className="text-2xl font-black uppercase tracking-tight text-slate-900">
              Starcity Heights Co-operative Housing Society Ltd.
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Regd. No. BOM/HSG/TC/19829/2020 • Sector 19, Seawoods, Navi Mumbai - 400706
          </p>
          <div className="mt-4 inline-block rounded-full bg-slate-100 px-4 py-1 text-xs font-black uppercase tracking-widest text-slate-800 print:bg-transparent print:border print:border-black">
            Audited Statement of Income & Expenditure for {selectedFy}
          </div>
        </div>

        {/* Statement Tables */}
        <div className="mt-8 space-y-8">
          {/* PART A: INCOME & RECEIPTS */}
          <div>
            <div className="flex items-center justify-between bg-slate-100 px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-800 print:bg-slate-200">
              <span>Part A: Inflows, Maintenance & Sundry Receipts</span>
              <span>Amount (₹)</span>
            </div>
            <table className="w-full text-xs border-collapse">
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-800">1. Maintenance Charges Realized (Wings A & B)</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">{formatCurrency(data.maintenance_income)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-800">2. Clubhouse & Multi-purpose Hall Rental Fees</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">{formatCurrency(5000)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-800">3. Non-Occupancy & Extra Stilt Parking Charges</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">{formatCurrency(1200)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-800">4. Bank Fixed Deposit Sinking Fund Interest (Q2)</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">{formatCurrency(14850)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-800">5. Flat Transfer Premium & Society NOC Fees</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">{formatCurrency(25000)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-800">6. Scrap, Old Papers & Battery Auction Realization</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">{formatCurrency(3400)}</td>
                </tr>
                <tr className="bg-emerald-50/75 font-black text-emerald-950 border-t-2 border-slate-300">
                  <td className="py-3 px-4 uppercase tracking-wider">Total Income Realized (A)</td>
                  <td className="py-3 px-4 text-right font-mono text-sm">{formatCurrency(data.total_income)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* PART B: OPERATING EXPENDITURE */}
          <div>
            <div className="flex items-center justify-between bg-slate-100 px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-800 print:bg-slate-200">
              <span>Part B: Operating Expenditures & Vendor Invoices</span>
              <span>Amount (₹)</span>
            </div>
            <table className="w-full text-xs border-collapse">
              <tbody className="divide-y divide-slate-100">
                {data.category_expenses.map((c, index) => (
                  <tr key={c.category}>
                    <td className="py-2.5 px-4 font-medium text-slate-800">
                      {index + 1}. {c.category}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(c.amount)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-rose-50/75 font-black text-rose-950 border-t-2 border-slate-300">
                  <td className="py-3 px-4 uppercase tracking-wider">Total Operating Outflows (B)</td>
                  <td className="py-3 px-4 text-right font-mono text-sm">{formatCurrency(data.total_expenses)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* PART C: NET OPERATING SURPLUS / (DEFICIT) */}
          <div className="rounded-xl border border-slate-300 bg-slate-50 p-4">
            <div className="flex items-center justify-between text-sm font-black">
              <span className="uppercase tracking-wider text-slate-900">
                Part C: Net Operational Surplus Transferred to General Reserve (A – B)
              </span>
              <span
                className={`font-mono text-base ${
                  data.net_surplus >= 0 ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {data.net_surplus >= 0 ? `+${formatCurrency(data.net_surplus)}` : formatCurrency(data.net_surplus)}
              </span>
            </div>
          </div>

          {/* PART D: BALANCE SHEET - CAPITAL & RESERVE FUNDS */}
          <div>
            <div className="flex items-center justify-between bg-slate-100 px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-800 print:bg-slate-200">
              <span>Part D: Capital Reserves & Bank Position as on {formatDate(reportDate)}</span>
              <span>Amount (₹)</span>
            </div>
            <table className="w-full text-xs border-collapse">
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-800">1. Statutory Sinking Fund (State Bank of India FDs)</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">{formatCurrency(data.sinking_fund_fd)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-800">2. Major Repairs & Building Painting Fund (FD)</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">{formatCurrency(data.major_repairs_fund_fd)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-800">3. Operating Bank Current Account #992810382 (SBI)</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">{formatCurrency(data.bank_current_account)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-800">4. Petty Cash In Hand (Maintained by Treasurer)</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">{formatCurrency(data.petty_cash)}</td>
                </tr>
                <tr className="bg-purple-50/75 font-black text-purple-950 border-t-2 border-slate-300">
                  <td className="py-3 px-4 uppercase tracking-wider">Total Society Net Liquid Assets (D)</td>
                  <td className="py-3 px-4 text-right font-mono text-sm">{formatCurrency(data.total_society_funds)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Committee & Auditor Signatures Block */}
        <div className="mt-16 pt-8 border-t border-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-xs">
          <div>
            <div className="h-12 border-b border-dashed border-slate-400 mb-2" />
            <div className="font-bold text-slate-900">Nitin Gadkari</div>
            <div className="text-[11px] text-slate-500">Society Chairman / President</div>
          </div>
          <div>
            <div className="h-12 border-b border-dashed border-slate-400 mb-2" />
            <div className="font-bold text-slate-900">Priya Kulkarni</div>
            <div className="text-[11px] text-slate-500">Hon. Secretary</div>
          </div>
          <div>
            <div className="h-12 border-b border-dashed border-slate-400 mb-2" />
            <div className="font-bold text-slate-900">Satish Deshmukh</div>
            <div className="text-[11px] text-slate-500">Hon. Treasurer</div>
          </div>
          <div>
            <div className="h-12 border-b border-dashed border-slate-400 mb-2" />
            <div className="font-bold text-slate-900">K.R. Mehta & Assoc.</div>
            <div className="text-[11px] text-slate-500">Statutory Auditor (CA)</div>
          </div>
        </div>

        <div className="mt-8 text-center text-[10px] text-slate-400 print:text-slate-600">
          This statement is prepared in accordance with Maharashtra Co-operative Societies Act, 1960. System generated by Starcity Society ERP.
        </div>
      </div>
    </div>
  );
}

