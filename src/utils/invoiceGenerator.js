import { ETH_PRICE_USD } from './ethereum.js';

/**
 * Formats a Date object as "Month DD, YYYY".
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Adds days to a date, returning a new Date.
 */
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Converts USD amount to ETH string.
 */
function toEth(usd) {
  return (usd / ETH_PRICE_USD).toFixed(4);
}

/**
 * Generates an array of invoice objects from project data.
 *
 * Supported paymentSchedule values:
 *   "fullUpfront"  — 1 invoice, 100%, due on startDate
 *   "split5050"    — 2 invoices: 50% on startDate, 50% on endDate
 *   "perMilestone" — N invoices (one per deliverable), evenly split, due dates spread between start/end
 *
 * @param {object} project - the full project state from AppContext
 * @returns {Array<{id, title, description, dueDate, amountUSD, amountETH, status, txHash}>}
 */
export function generateInvoices(project) {
  const {
    totalFeeUSD,
    paymentSchedule,
    startDate,
    endDate,
    deliverables = [],
    projectTitle = 'Project',
    paymentTerms = 'Net 14',
  } = project;

  const fee = parseFloat(totalFeeUSD) || 0;
  const start = startDate ? new Date(startDate) : new Date();
  const end = endDate ? new Date(endDate) : addDays(start, 30);

  // Calculate net days offset
  const netDaysMap = { 'Net 7': 7, 'Net 14': 14, 'Net 30': 30 };
  const netDays = netDaysMap[paymentTerms] ?? 14;

  const makeInvoice = (id, title, description, dueDate, amountUSD) => ({
    id,
    title,
    description,
    dueDate: formatDate(dueDate),
    amountUSD: Math.round(amountUSD * 100) / 100,
    amountETH: toEth(amountUSD),
    status: 'unpaid',
    txHash: null,
  });

  if (paymentSchedule === 'fullUpfront') {
    const due = addDays(start, netDays);
    return [
      makeInvoice(
        1,
        `Invoice #1 — Full Project Payment`,
        `Full project fee for "${projectTitle}". Payment is due before work commences.`,
        due,
        fee
      ),
    ];
  }

  if (paymentSchedule === 'split5050') {
    const half = fee / 2;
    const due1 = addDays(start, netDays);
    const due2 = addDays(end, netDays);
    return [
      makeInvoice(
        1,
        `Invoice #1 — Upfront Payment (50%)`,
        `Initial 50% deposit for "${projectTitle}". Due before work begins.`,
        due1,
        half
      ),
      makeInvoice(
        2,
        `Invoice #2 — Final Payment (50%)`,
        `Remaining 50% balance for "${projectTitle}". Due upon project delivery.`,
        due2,
        half
      ),
    ];
  }

  if (paymentSchedule === 'perMilestone') {
    const items = deliverables.length > 0 ? deliverables : ['Project Completion'];
    const n = items.length;
    const perItem = fee / n;

    // Spread due dates evenly between start and end
    const totalMs = end.getTime() - start.getTime();
    const stepMs = n > 1 ? totalMs / (n - 1) : 0;

    return items.map((deliverable, i) => {
      const milestoneDate = n === 1 ? end : new Date(start.getTime() + stepMs * i);
      const dueDate = addDays(milestoneDate, netDays);
      return makeInvoice(
        i + 1,
        `Invoice #${i + 1} — ${deliverable}`,
        `Milestone payment for deliverable: "${deliverable}" as part of "${projectTitle}".`,
        dueDate,
        perItem
      );
    });
  }

  // Fallback: full upfront
  const due = addDays(start, netDays);
  return [
    makeInvoice(
      1,
      `Invoice #1 — Project Payment`,
      `Full payment for "${projectTitle}".`,
      due,
      fee
    ),
  ];
}
