import { PaymentMode } from '@/types/database.types';

export interface ExpenseItem {
  id: string;
  voucher_number: string;
  society_id: string;
  category_id: string;
  category_name: string;
  vendor: string;
  invoice_number?: string;
  amount: number;
  expense_date: string;
  payment_mode: PaymentMode;
  reference_number?: string;
  description: string;
  attachment_url?: string;
  status: 'APPROVED' | 'PENDING_APPROVAL';
  created_by?: string;
  created_at: string;
}

export interface IncomeItem {
  id: string;
  receipt_number: string;
  society_id: string;
  category_id: string;
  category_name: string;
  received_from: string;
  payment_id?: string;
  amount: number;
  income_date: string;
  payment_mode: PaymentMode;
  reference_number?: string;
  description: string;
  attachment_url?: string;
  status: 'APPROVED' | 'PENDING_APPROVAL';
  created_by?: string;
  created_at: string;
}

export interface CashBookTransaction {
  id: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  party: string; // Vendor or Resident / Payer
  voucher_or_ref: string;
  description: string;
  payment_mode: PaymentMode;
  income_amount: number;
  expense_amount: number;
  running_balance: number;
  attachment_url?: string;
}

export interface MonthlyFinancialSummary {
  month: string;
  income: number;
  expenses: number;
  surplus: number;
}

export interface CategoryExpenseSummary {
  category: string;
  amount: number;
  percentage: number;
}

export interface BalanceSheetData {
  opening_balance: number;
  maintenance_income: number;
  other_income: number;
  total_income: number;
  total_expenses: number;
  net_surplus: number;
  closing_balance: number;
  sinking_fund_fd: number;
  major_repairs_fund_fd: number;
  petty_cash: number;
  bank_current_account: number;
  total_society_funds: number;
  collection_efficiency_pct: number;
  monthly_trends: MonthlyFinancialSummary[];
  category_expenses: CategoryExpenseSummary[];
}

export const EXPENSE_CATEGORIES = [
  'Security Agency Wages',
  'Common Electricity & Backup DG',
  'Housekeeping & Garbage Disposal',
  'Lift AMC & Servicing',
  'Water Tank Cleaning & Pump Repair',
  'Gardening & Pest Control',
  'Auditing & Accounting Fees',
  'Miscellaneous Repairs'
] as const;

export const SUNDRY_INCOME_CATEGORIES = [
  'Clubhouse / Hall Booking',
  'Extra Parking Charges',
  'Bank Fixed Deposit Interest',
  'Scrap & Paper Waste Sale',
  'Flat Transfer Fee / NOC',
  'Late Payment Penalties',
  'Miscellaneous Receipts'
] as const;

export const INITIAL_DEMO_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp-01',
    voucher_number: 'VCH-2026-0101',
    society_id: 'soc-01',
    category_id: 'cat-sec',
    category_name: 'Security Agency Wages',
    vendor: 'Eagle Eye Security Services Pvt Ltd',
    invoice_number: 'INV-EES-8832',
    amount: 45000,
    expense_date: '2026-09-02',
    payment_mode: 'BANK_TRANSFER',
    reference_number: 'NEFT/HDFC8829104',
    description: 'Monthly security guard charges for 4 guards (2 day / 2 night shifts)',
    attachment_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
    status: 'APPROVED',
    created_by: 'Treasurer - Satish Deshmukh',
    created_at: '2026-09-02T10:00:00Z',
  },
  {
    id: 'exp-02',
    voucher_number: 'VCH-2026-0102',
    society_id: 'soc-01',
    category_id: 'cat-elec',
    category_name: 'Common Electricity & Backup DG',
    vendor: 'MSEDCL / Maharashtra State Electricity',
    invoice_number: 'BILL-09923812',
    amount: 28400,
    expense_date: '2026-09-04',
    payment_mode: 'UPI',
    reference_number: 'UPI/MSEDCL992834',
    description: 'Common area lighting, water pumps, and lift electricity bill for August',
    attachment_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
    status: 'APPROVED',
    created_by: 'Treasurer - Satish Deshmukh',
    created_at: '2026-09-04T11:30:00Z',
  },
  {
    id: 'exp-03',
    voucher_number: 'VCH-2026-0103',
    society_id: 'soc-01',
    category_id: 'cat-hk',
    category_name: 'Housekeeping & Garbage Disposal',
    vendor: 'CleanPro Facility Solutions',
    invoice_number: 'CP-4402',
    amount: 22000,
    expense_date: '2026-09-05',
    payment_mode: 'BANK_TRANSFER',
    reference_number: 'RTGS/ICICI491023',
    description: 'Daily corridor mopping, clubhouse cleaning, and daily garbage disposal staff wages',
    status: 'APPROVED',
    created_by: 'Treasurer - Satish Deshmukh',
    created_at: '2026-09-05T09:15:00Z',
  },
  {
    id: 'exp-04',
    voucher_number: 'VCH-2026-0104',
    society_id: 'soc-01',
    category_id: 'cat-lift',
    category_name: 'Lift AMC & Servicing',
    vendor: 'Otis Elevator Company India',
    invoice_number: 'OTIS-Q2-2026',
    amount: 18500,
    expense_date: '2026-09-06',
    payment_mode: 'CHEQUE',
    reference_number: 'CHQ-882914',
    description: 'Quarterly comprehensive AMC and safety inspection for Wings A & B elevators',
    status: 'APPROVED',
    created_by: 'Treasurer - Satish Deshmukh',
    created_at: '2026-09-06T14:20:00Z',
  },
  {
    id: 'exp-05',
    voucher_number: 'VCH-2026-0105',
    society_id: 'soc-01',
    category_id: 'cat-water',
    category_name: 'Water Tank Cleaning & Pump Repair',
    vendor: 'AquaPure Tank Sanitization',
    invoice_number: 'AQ-9102',
    amount: 8200,
    expense_date: '2026-09-07',
    payment_mode: 'UPI',
    reference_number: 'UPI/49201938210',
    description: 'UV disinfection and high-pressure cleaning of overhead and underground water reservoirs',
    status: 'APPROVED',
    created_by: 'Treasurer - Satish Deshmukh',
    created_at: '2026-09-07T16:00:00Z',
  },
  {
    id: 'exp-06',
    voucher_number: 'VCH-2026-0106',
    society_id: 'soc-01',
    category_id: 'cat-garden',
    category_name: 'Gardening & Pest Control',
    vendor: 'Green Thumb Landscaping & Pest Pro',
    invoice_number: 'GT-209',
    amount: 4500,
    expense_date: '2026-09-08',
    payment_mode: 'UPI',
    reference_number: 'UPI/9834210982',
    description: 'Garden lawn trimming, seasonal manure, and anti-termite spray in basement',
    status: 'APPROVED',
    created_by: 'Treasurer - Satish Deshmukh',
    created_at: '2026-09-08T12:10:00Z',
  },
  {
    id: 'exp-07',
    voucher_number: 'VCH-2026-0107',
    society_id: 'soc-01',
    category_id: 'cat-dg',
    category_name: 'Common Electricity & Backup DG',
    vendor: 'Bharat Petroleum Corporation Ltd',
    invoice_number: 'BPCL-FUEL-773',
    amount: 7800,
    expense_date: '2026-09-09',
    payment_mode: 'CASH',
    reference_number: 'CASH-REC-112',
    description: '80 Litres diesel purchase for society backup generator testing and load trials',
    status: 'APPROVED',
    created_by: 'Treasurer - Satish Deshmukh',
    created_at: '2026-09-09T17:45:00Z',
  },
  {
    id: 'exp-08',
    voucher_number: 'VCH-2026-0108',
    society_id: 'soc-01',
    category_id: 'cat-audit',
    category_name: 'Auditing & Accounting Fees',
    vendor: 'K.R. Mehta & Associates Chartered Accountants',
    invoice_number: 'KRM-2026-04',
    amount: 6000,
    expense_date: '2026-09-10',
    payment_mode: 'BANK_TRANSFER',
    reference_number: 'NEFT/SBIN8901239',
    description: 'Statutory audit retainership and filing of annual cooperative society returns',
    status: 'APPROVED',
    created_by: 'Treasurer - Satish Deshmukh',
    created_at: '2026-09-10T11:00:00Z',
  }
];

export const INITIAL_DEMO_SUNDRY_INCOME: IncomeItem[] = [
  {
    id: 'inc-01',
    receipt_number: 'INC-2026-0041',
    society_id: 'soc-01',
    category_id: 'cat-inc-club',
    category_name: 'Clubhouse / Hall Booking',
    received_from: 'Rajesh Sharma (Flat A-101)',
    amount: 5000,
    income_date: '2026-09-03',
    payment_mode: 'UPI',
    reference_number: 'UPI/98230192841',
    description: 'Clubhouse booking for daughter birthday celebration on Sept 14th',
    status: 'APPROVED',
    created_by: 'Treasurer - Satish Deshmukh',
    created_at: '2026-09-03T11:00:00Z',
  },
  {
    id: 'inc-02',
    receipt_number: 'INC-2026-0042',
    society_id: 'soc-01',
    category_id: 'cat-inc-park',
    category_name: 'Extra Parking Charges',
    received_from: 'Vikram Joshi (Flat B-101)',
    amount: 1200,
    income_date: '2026-09-05',
    payment_mode: 'BANK_TRANSFER',
    reference_number: 'IMPS/981023812',
    description: 'Quarterly open stilt parking fee for second 2-wheeler',
    status: 'APPROVED',
    created_by: 'Treasurer - Satish Deshmukh',
    created_at: '2026-09-05T14:30:00Z',
  },
  {
    id: 'inc-03',
    receipt_number: 'INC-2026-0043',
    society_id: 'soc-01',
    category_id: 'cat-inc-fd',
    category_name: 'Bank Fixed Deposit Interest',
    received_from: 'State Bank of India (Nerul Branch)',
    amount: 14850,
    income_date: '2026-09-06',
    payment_mode: 'BANK_TRANSFER',
    reference_number: 'SBI/AUTO-INT-9923',
    description: 'Quarterly interest auto-credit on Society Sinking Fund Fixed Deposit #3982109',
    status: 'APPROVED',
    created_by: 'Treasurer - Satish Deshmukh',
    created_at: '2026-09-06T10:00:00Z',
  },
  {
    id: 'inc-04',
    receipt_number: 'INC-2026-0044',
    society_id: 'soc-01',
    category_id: 'cat-inc-scrap',
    category_name: 'Scrap & Paper Waste Sale',
    received_from: 'Mahalaxmi Traders (Scrap Dealer)',
    amount: 3400,
    income_date: '2026-09-08',
    payment_mode: 'CASH',
    reference_number: 'CASH-REC-119',
    description: 'Sale of old carton boxes, plastic pipes, and dry scrap waste from society basement',
    status: 'APPROVED',
    created_by: 'Treasurer - Satish Deshmukh',
    created_at: '2026-09-08T15:20:00Z',
  },
  {
    id: 'inc-05',
    receipt_number: 'INC-2026-0045',
    society_id: 'soc-01',
    category_id: 'cat-inc-noc',
    category_name: 'Flat Transfer Fee / NOC',
    received_from: 'Amit Shah (Buyer Flat B-201)',
    amount: 25000,
    income_date: '2026-09-09',
    payment_mode: 'CHEQUE',
    reference_number: 'CHQ-552910',
    description: 'Society transfer premium & NOC issuance charges as per cooperative model bye-laws',
    status: 'APPROVED',
    created_by: 'Treasurer - Satish Deshmukh',
    created_at: '2026-09-09T13:00:00Z',
  }
];

// In-memory persistent state for active session demo
let liveExpenses = [...INITIAL_DEMO_EXPENSES];
let liveSundryIncome = [...INITIAL_DEMO_SUNDRY_INCOME];

export function getExpenseItems(): ExpenseItem[] {
  return [...liveExpenses];
}

export function getIncomeItems(): IncomeItem[] {
  return [...liveSundryIncome];
}

export function addExpenseVoucher(newExpense: Omit<ExpenseItem, 'id' | 'created_at' | 'status'>): ExpenseItem {
  const item: ExpenseItem = {
    ...newExpense,
    id: `exp-${Date.now()}`,
    status: 'APPROVED',
    created_at: new Date().toISOString(),
  };
  liveExpenses = [item, ...liveExpenses];
  return item;
}

export function addIncomeItem(newIncome: Omit<IncomeItem, 'id' | 'created_at' | 'status'>): IncomeItem {
  const item: IncomeItem = {
    ...newIncome,
    id: `inc-${Date.now()}`,
    status: 'APPROVED',
    created_at: new Date().toISOString(),
  };
  liveSundryIncome = [item, ...liveSundryIncome];
  return item;
}

/**
 * Computes unified Cash Book ledger with chronological running balance
 */
export function getCashBookLedger(openingBalance: number = 385000): CashBookTransaction[] {
  const transactions: {
    id: string;
    date: string;
    type: 'INCOME' | 'EXPENSE';
    category: string;
    party: string;
    voucher_or_ref: string;
    description: string;
    payment_mode: PaymentMode;
    income_amount: number;
    expense_amount: number;
    attachment_url?: string;
  }[] = [];

  // 1. Approved Maintenance payments (from billing payments)
  transactions.push({
    id: 'maint-pay-01',
    date: '2026-09-04',
    type: 'INCOME',
    category: 'Maintenance Collection',
    party: 'Rajesh Sharma (A-101)',
    voucher_or_ref: 'REC-2026-0819',
    description: 'Maintenance payment for September 2026 (Flat A-101)',
    payment_mode: 'UPI',
    income_amount: 2975,
    expense_amount: 0,
  });

  transactions.push({
    id: 'maint-pay-02',
    date: '2026-09-07',
    type: 'INCOME',
    category: 'Maintenance Collection',
    party: 'Vikram Joshi (B-101)',
    voucher_or_ref: 'REC-2026-0820',
    description: 'Maintenance payment for September 2026 (Flat B-101)',
    payment_mode: 'BANK_TRANSFER',
    income_amount: 2600,
    expense_amount: 0,
  });

  // 2. Sundry Incomes
  for (const inc of liveSundryIncome) {
    transactions.push({
      id: inc.id,
      date: inc.income_date,
      type: 'INCOME',
      category: inc.category_name,
      party: inc.received_from,
      voucher_or_ref: inc.receipt_number,
      description: inc.description,
      payment_mode: inc.payment_mode,
      income_amount: inc.amount,
      expense_amount: 0,
      attachment_url: inc.attachment_url,
    });
  }

  // 3. Expenses
  for (const exp of liveExpenses) {
    transactions.push({
      id: exp.id,
      date: exp.expense_date,
      type: 'EXPENSE',
      category: exp.category_name,
      party: exp.vendor,
      voucher_or_ref: exp.voucher_number,
      description: exp.description,
      payment_mode: exp.payment_mode,
      income_amount: 0,
      expense_amount: exp.amount,
      attachment_url: exp.attachment_url,
    });
  }

  // Sort ascending by date for accurate running balance
  transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let currentBalance = openingBalance;
  const ledger: CashBookTransaction[] = transactions.map((t) => {
    currentBalance = currentBalance + t.income_amount - t.expense_amount;
    return {
      ...t,
      running_balance: currentBalance,
    };
  });

  // Return descending for UI display (newest first)
  return ledger.reverse();
}

/**
 * Computes full balance sheet summary & chart data
 */
export function getFinancialMetrics(
  openingBalance: number = 385000,
  currentExpenses: ExpenseItem[] = liveExpenses,
  currentSundryIncome: IncomeItem[] = liveSundryIncome
): BalanceSheetData {
  const maintenanceIncome = 2975 + 2600; // From approved payments
  const otherIncome = currentSundryIncome.reduce((acc, curr) => acc + curr.amount, 0);
  const totalIncome = maintenanceIncome + otherIncome;
  const totalExpenses = currentExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netSurplus = totalIncome - totalExpenses;
  const closingBalance = openingBalance + netSurplus;

  // Static capital reserves
  const sinkingFund = 1450000;
  const majorRepairsFund = 850000;
  const pettyCash = 14200;
  const bankCurrentAccount = closingBalance - pettyCash;
  const totalSocietyFunds = sinkingFund + majorRepairsFund + closingBalance;

  // Category breakdown
  const categoryMap: Record<string, number> = {};
  for (const exp of currentExpenses) {
    categoryMap[exp.category_name] = (categoryMap[exp.category_name] || 0) + exp.amount;
  }

  const categoryExpenses: CategoryExpenseSummary[] = Object.entries(categoryMap).map(([category, amount]) => ({
    category,
    amount,
    percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
  })).sort((a, b) => b.amount - a.amount);

  // Past 6 months financial trend
  const monthlyTrends: MonthlyFinancialSummary[] = [
    { month: 'Apr 2026', income: 142000, expenses: 118000, surplus: 24000 },
    { month: 'May 2026', income: 148500, expenses: 132400, surplus: 16100 },
    { month: 'Jun 2026', income: 151200, expenses: 129000, surplus: 22200 },
    { month: 'Jul 2026', income: 146000, expenses: 138500, surplus: 7500 },
    { month: 'Aug 2026', income: 153000, expenses: 126200, surplus: 26800 },
    { month: 'Sep 2026', income: totalIncome, expenses: totalExpenses, surplus: netSurplus },
  ];

  return {
    opening_balance: openingBalance,
    maintenance_income: maintenanceIncome,
    other_income: otherIncome,
    total_income: totalIncome,
    total_expenses: totalExpenses,
    net_surplus: netSurplus,
    closing_balance: closingBalance,
    sinking_fund_fd: sinkingFund,
    major_repairs_fund_fd: majorRepairsFund,
    petty_cash: pettyCash,
    bank_current_account: bankCurrentAccount,
    total_society_funds: totalSocietyFunds,
    collection_efficiency_pct: 88.5,
    monthly_trends: monthlyTrends,
    category_expenses: categoryExpenses,
  };
}

/**
 * Utility to export transactions to standard CSV
 */
export function exportCashBookCsv(transactions: CashBookTransaction[]) {
  const headers = ['Date', 'Type', 'Category', 'Party', 'Voucher / Ref', 'Description', 'Payment Mode', 'Credit (Income)', 'Debit (Expense)', 'Running Balance'];
  const rows = transactions.map((t) => [
    t.date,
    t.type,
    `"${t.category.replace(/"/g, '""')}"`,
    `"${t.party.replace(/"/g, '""')}"`,
    t.voucher_or_ref,
    `"${t.description.replace(/"/g, '""')}"`,
    t.payment_mode,
    t.income_amount ? t.income_amount : '',
    t.expense_amount ? t.expense_amount : '',
    t.running_balance,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Starcity_CashBook_FY26_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

