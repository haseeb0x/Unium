import { ETH_PRICE_USD } from './ethereum.js';

/**
 * Formats a Date or date-string as "Month DD, YYYY".
 */
function fmt(dateStr) {
  if (!dateStr) return '[Date Not Specified]';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Formats a USD number with commas.
 */
function fmtUSD(amount) {
  const num = parseFloat(amount) || 0;
  return num.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
}

/**
 * Converts USD to ETH string.
 */
function toEth(usd) {
  const num = parseFloat(usd) || 0;
  return (num / ETH_PRICE_USD).toFixed(4);
}

/**
 * Returns a human-readable payment schedule description.
 */
function paymentScheduleLabel(schedule, fee, deliverables = []) {
  switch (schedule) {
    case 'fullUpfront':
      return `100% of the Total Fee (${fmtUSD(fee)}) is due in full prior to commencement of any work.`;
    case 'split5050':
      return `50% of the Total Fee (${fmtUSD(fee / 2)}) is due prior to commencement of work, and the remaining 50% (${fmtUSD(fee / 2)}) is due upon delivery of the final deliverable.`;
    case 'perMilestone': {
      const n = deliverables.length || 1;
      const perItem = fee / n;
      return `Payment is structured on a per-milestone basis. ${n} invoice(s) will be issued, each for ${fmtUSD(perItem)} (≈ ${toEth(perItem)} ETH), corresponding to the completion of each deliverable listed in Section 1.`;
    }
    default:
      return `The Total Fee of ${fmtUSD(fee)} is payable as agreed.`;
  }
}

/**
 * Generates a full freelance service agreement as a structured object.
 *
 * @param {object} project - the full project state from AppContext
 * @returns {{
 *   date: string,
 *   freelancer: object,
 *   client: object,
 *   sections: Array<{number, title, body}>,
 *   signatureDate: string
 * }}
 */
export function generateContract(project) {
  const {
    freelancerName = '[Freelancer Name]',
    freelancerEmail = '',
    freelancerEthAddress = '',
    clientName = '[Client Name]',
    clientCompany = '',
    clientEmail = '',
    projectTitle = '[Project Title]',
    industry = '',
    projectDescription = '[Project Description]',
    deliverables = [],
    startDate,
    endDate,
    totalFeeUSD = 0,
    paymentSchedule = 'fullUpfront',
    paymentTerms = 'Net 14',
    revisionRounds = '2',
  } = project;

  const today = fmt(new Date().toISOString().split('T')[0]);
  const fee = parseFloat(totalFeeUSD) || 0;
  const ethAmount = toEth(fee);

  const deliverablesList =
    deliverables.length > 0
      ? deliverables.map((d, i) => `   ${i + 1}. ${d}`).join('\n')
      : '   1. [To be defined upon project kickoff]';

  const revisionLabel =
    revisionRounds === 'Unlimited'
      ? 'Unlimited revision rounds are included as part of the scope of work.'
      : `${revisionRounds} round(s) of revisions are included. Additional revision rounds beyond the included allowance will be billed at the Freelancer's standard hourly rate.`;

  const sections = [
    {
      number: 'Section 1',
      title: 'Scope of Work',
      body: `The Freelancer agrees to perform the following services (the "Services") for the Client:

Project Title: ${projectTitle}
Industry / Domain: ${industry || '[General]'}

Description:
${projectDescription}

Deliverables:
${deliverablesList}

The Freelancer shall perform the Services in a professional and workmanlike manner, consistent with industry standards. Any work outside the scope described above shall require a written change order signed by both parties and may result in additional fees.`,
    },
    {
      number: 'Section 2',
      title: 'Timeline',
      body: `Project Commencement Date: ${fmt(startDate)}
Project Completion Date:   ${fmt(endDate)}

The Freelancer will use commercially reasonable efforts to deliver all Deliverables on or before the Project Completion Date. The Client acknowledges that timely feedback and approvals are necessary for the Freelancer to meet agreed deadlines. Any delay caused by the Client's failure to provide required materials, feedback, or approvals in a timely manner shall extend the project timeline accordingly, at no additional cost to the Freelancer.`,
    },
    {
      number: 'Section 3',
      title: 'Compensation and Payment',
      body: `Total Fee: ${fmtUSD(fee)} USD (≈ ${ethAmount} ETH at a reference rate of $${ETH_PRICE_USD}/ETH)

Payment Schedule:
${paymentScheduleLabel(paymentSchedule, fee, deliverables)}

Payment Terms: All invoices are due within the timeframe specified (${paymentTerms}) of issuance. Invoices are payable in ETH via the Ethereum blockchain to the Freelancer's designated wallet address: ${freelancerEthAddress || '[Freelancer ETH Address]'}.

Late Payments: Invoices not paid within ${paymentTerms} of the due date will accrue a late fee of 1.5% per month (18% per annum) on the outstanding balance, calculated from the due date until the date of payment.

Currency: Payments are made in Ether (ETH). The USD amounts stated herein are for reference only. The ETH equivalent is calculated at the rate agreed upon at time of invoice issuance. Neither party is responsible for fluctuations in ETH/USD exchange rates.`,
    },
    {
      number: 'Section 4',
      title: 'Intellectual Property',
      body: `Upon receipt of full and final payment of all amounts due under this Agreement, the Freelancer irrevocably assigns to the Client all right, title, and interest in and to the Deliverables, including all copyrights, patents, trademarks, trade secrets, and other intellectual property rights therein (the "IP Assignment").

Prior to receipt of full payment, the Client receives a limited, non-exclusive, non-transferable license to use the Deliverables solely for internal review purposes.

The Freelancer retains the right to:
   (a) Display the Deliverables in the Freelancer's portfolio, website, and promotional materials;
   (b) Use any general methodologies, frameworks, tools, techniques, and know-how developed or used in the performance of the Services.

Any pre-existing intellectual property of the Freelancer ("Background IP") incorporated into the Deliverables remains the sole property of the Freelancer. The Freelancer grants the Client a perpetual, irrevocable, royalty-free license to use such Background IP solely as incorporated within the Deliverables.`,
    },
    {
      number: 'Section 5',
      title: 'Confidentiality',
      body: `Each party ("Receiving Party") agrees to keep confidential all non-public information disclosed by the other party ("Disclosing Party") that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure ("Confidential Information").

The Receiving Party agrees to:
   (a) Use the Confidential Information solely for the purpose of performing its obligations under this Agreement;
   (b) Not disclose the Confidential Information to any third party without the prior written consent of the Disclosing Party;
   (c) Protect the Confidential Information using at least the same degree of care as it uses to protect its own confidential information, but in no event less than reasonable care.

These confidentiality obligations shall survive the termination of this Agreement for a period of three (3) years. This obligation does not apply to information that: (i) is or becomes publicly available without breach of this Agreement; (ii) was rightfully known to the Receiving Party prior to disclosure; or (iii) is required to be disclosed by applicable law or court order.`,
    },
    {
      number: 'Section 6',
      title: 'Revisions',
      body: `${revisionLabel}

A "revision" is defined as a request for changes to work that has been completed within the originally agreed scope. Revisions must be submitted in writing (email or messaging platform) within seven (7) calendar days of delivery of each Deliverable. Revisions requested after this period may be treated as new work and billed accordingly.

Revisions that fundamentally change the scope, direction, or requirements of a Deliverable may be treated as new scope, subject to a change order.`,
    },
    {
      number: 'Section 7',
      title: 'Termination',
      body: `Either party may terminate this Agreement upon fourteen (14) days' written notice to the other party.

Termination by Client: If the Client terminates this Agreement prior to completion of all Deliverables, the Client shall pay:
   (a) All invoices for Deliverables completed prior to termination;
   (b) A kill fee equal to twenty percent (20%) of the total value of the remaining uncompleted work, to compensate the Freelancer for opportunity costs and work already performed.

Termination by Freelancer for Cause: The Freelancer may terminate this Agreement immediately upon written notice if the Client: (i) fails to pay any invoice within thirty (30) days of the due date; (ii) materially breaches any provision of this Agreement and fails to cure such breach within seven (7) days of written notice thereof.

Upon termination, each party shall promptly return or destroy all Confidential Information of the other party.`,
    },
    {
      number: 'Section 8',
      title: 'Limitation of Liability',
      body: `TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL EITHER PARTY BE LIABLE TO THE OTHER PARTY FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, LOSS OF REVENUE, LOSS OF BUSINESS, LOSS OF GOODWILL, OR LOSS OF DATA, EVEN IF SUCH PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

THE TOTAL CUMULATIVE LIABILITY OF EITHER PARTY ARISING OUT OF OR RELATED TO THIS AGREEMENT, WHETHER IN CONTRACT, TORT (INCLUDING NEGLIGENCE), OR OTHERWISE, SHALL NOT EXCEED THE TOTAL FEES PAID OR PAYABLE BY THE CLIENT TO THE FREELANCER UNDER THIS AGREEMENT (${fmtUSD(fee)} USD).

The limitations set forth in this Section shall not apply to: (i) either party's indemnification obligations; (ii) damages resulting from a party's gross negligence or willful misconduct; or (iii) a party's breach of its confidentiality obligations.`,
    },
    {
      number: 'Section 9',
      title: 'Force Majeure',
      body: `Neither party shall be liable for any delay or failure to perform its obligations under this Agreement if such delay or failure arises from circumstances beyond such party's reasonable control, including but not limited to: acts of God, natural disasters, war, terrorism, civil unrest, labor disputes, pandemics, governmental actions, or failure of third-party service providers.

The affected party shall notify the other party as soon as reasonably practicable of any force majeure event and its expected duration. If a force majeure event continues for more than sixty (60) days, either party may terminate this Agreement upon written notice without any further liability.`,
    },
    {
      number: 'Section 10',
      title: 'Governing Law and Dispute Resolution',
      body: `This Agreement shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law principles.

Any dispute, controversy, or claim arising out of or relating to this Agreement, or the breach, termination, or invalidity thereof, shall first be attempted to be resolved through good-faith negotiation between the parties. If the dispute is not resolved within thirty (30) days of written notice, the parties agree to submit the dispute to binding arbitration under the rules of the American Arbitration Association (AAA), with proceedings conducted in English in San Francisco, California.

Notwithstanding the foregoing, either party may seek injunctive or other equitable relief from a court of competent jurisdiction to prevent irreparable harm.`,
    },
    {
      number: 'Section 11',
      title: 'General Provisions',
      body: `Independent Contractor: The Freelancer is an independent contractor and not an employee of the Client. The Freelancer is responsible for all applicable taxes, insurance, and statutory obligations related to the Freelancer's income.

Entire Agreement: This Agreement constitutes the entire agreement between the parties with respect to its subject matter and supersedes all prior discussions, negotiations, representations, and agreements.

Amendments: This Agreement may only be modified by a written amendment signed by authorized representatives of both parties.

Severability: If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.

Waiver: The failure of either party to enforce any provision of this Agreement shall not constitute a waiver of that party's right to enforce such provision at any other time.

Notices: All notices under this Agreement shall be provided in writing via email to the addresses specified below, and shall be deemed received upon confirmation of delivery.`,
    },
  ];

  return {
    date: today,
    freelancer: {
      name: freelancerName,
      email: freelancerEmail,
      ethAddress: freelancerEthAddress,
    },
    client: {
      name: clientName,
      company: clientCompany,
      email: clientEmail,
    },
    projectTitle,
    totalFeeUSD: fee,
    ethAmount,
    sections,
    signatureDate: today,
  };
}
