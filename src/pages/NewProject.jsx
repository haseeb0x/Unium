import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { ETH_PRICE_USD } from '../utils/ethereum.js';

const STEPS = [
  { label: 'Parties' },
  { label: 'Project' },
  { label: 'Payment' },
  { label: 'Review' },
];

const INDUSTRIES = [
  'Web Development',
  'Design',
  'Marketing',
  'Writing',
  'Consulting',
  'Photography',
  'Video Production',
  'Mobile Development',
  'Data Science',
  'Other',
];

const PAYMENT_SCHEDULES = [
  {
    value: 'fullUpfront',
    label: 'Full Upfront',
    desc: '100% of the total fee is due before work begins.',
  },
  {
    value: 'split5050',
    label: '50 / 50 Split',
    desc: '50% deposit upfront, 50% due upon final delivery.',
  },
  {
    value: 'perMilestone',
    label: 'Per Milestone',
    desc: 'One invoice per deliverable — pay as each piece is completed.',
  },
];

const INITIAL_FORM = {
  // Step 1
  freelancerName: '',
  freelancerEmail: '',
  freelancerEthAddress: '',
  clientName: '',
  clientCompany: '',
  clientEmail: '',
  // Step 2
  projectTitle: '',
  industry: 'Web Development',
  projectDescription: '',
  deliverables: [],
  // Step 3
  startDate: '',
  endDate: '',
  totalFeeUSD: '',
  paymentSchedule: 'split5050',
  paymentTerms: 'Net 14',
  revisionRounds: '2',
};

function StepProgress({ current }) {
  return (
    <div className="step-progress">
      {STEPS.map((step, i) => {
        const status =
          i < current ? 'completed' : i === current ? 'active' : 'inactive';
        return (
          <React.Fragment key={step.label}>
            <div className={`step-item ${status}`}>
              <div className="step-circle">
                {i < current ? '✓' : i + 1}
              </div>
              <span className="step-label">{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`step-connector ${i < current ? 'active' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function FieldError({ msg }) {
  if (!msg) return null;
  return <span className="form-error">⚠ {msg}</span>;
}

/* ─── Step 1: Parties ─── */
function StepParties({ form, onChange, errors }) {
  return (
    <div className="form-section">
      <div className="form-section-title">
        <span className="form-section-icon">👤</span>
        Freelancer Information
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Full Name <span className="required">*</span>
          </label>
          <input
            className={`form-input${errors.freelancerName ? ' error' : ''}`}
            placeholder="Jane Smith"
            value={form.freelancerName}
            onChange={(e) => onChange('freelancerName', e.target.value)}
          />
          <FieldError msg={errors.freelancerName} />
        </div>
        <div className="form-group">
          <label className="form-label">
            Email Address <span className="required">*</span>
          </label>
          <input
            className={`form-input${errors.freelancerEmail ? ' error' : ''}`}
            type="email"
            placeholder="jane@example.com"
            value={form.freelancerEmail}
            onChange={(e) => onChange('freelancerEmail', e.target.value)}
          />
          <FieldError msg={errors.freelancerEmail} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Ethereum Wallet Address <span className="required">*</span>
        </label>
        <input
          className={`form-input${errors.freelancerEthAddress ? ' error' : ''}`}
          placeholder="0x..."
          value={form.freelancerEthAddress}
          onChange={(e) => onChange('freelancerEthAddress', e.target.value)}
        />
        <span className="form-hint">This is where ETH payments will be sent.</span>
        <FieldError msg={errors.freelancerEthAddress} />
      </div>

      <div className="divider" style={{ margin: '8px 0' }} />

      <div className="form-section-title">
        <span className="form-section-icon">🏢</span>
        Client Information
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Client Full Name <span className="required">*</span>
          </label>
          <input
            className={`form-input${errors.clientName ? ' error' : ''}`}
            placeholder="John Doe"
            value={form.clientName}
            onChange={(e) => onChange('clientName', e.target.value)}
          />
          <FieldError msg={errors.clientName} />
        </div>
        <div className="form-group">
          <label className="form-label">Company Name</label>
          <input
            className="form-input"
            placeholder="Acme Corp (optional)"
            value={form.clientCompany}
            onChange={(e) => onChange('clientCompany', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Client Email Address <span className="required">*</span>
        </label>
        <input
          className={`form-input${errors.clientEmail ? ' error' : ''}`}
          type="email"
          placeholder="john@acmecorp.com"
          value={form.clientEmail}
          onChange={(e) => onChange('clientEmail', e.target.value)}
        />
        <FieldError msg={errors.clientEmail} />
      </div>
    </div>
  );
}

/* ─── Step 2: Project Details ─── */
function StepProject({ form, onChange, errors }) {
  const [deliverableInput, setDeliverableInput] = useState('');

  function addDeliverable() {
    const val = deliverableInput.trim();
    if (!val) return;
    onChange('deliverables', [...form.deliverables, val]);
    setDeliverableInput('');
  }

  function removeDeliverable(index) {
    onChange(
      'deliverables',
      form.deliverables.filter((_, i) => i !== index)
    );
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addDeliverable();
    }
  }

  return (
    <div className="form-section">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Project Title <span className="required">*</span>
          </label>
          <input
            className={`form-input${errors.projectTitle ? ' error' : ''}`}
            placeholder="E-commerce Website Redesign"
            value={form.projectTitle}
            onChange={(e) => onChange('projectTitle', e.target.value)}
          />
          <FieldError msg={errors.projectTitle} />
        </div>
        <div className="form-group">
          <label className="form-label">Industry</label>
          <select
            className="form-select"
            value={form.industry}
            onChange={(e) => onChange('industry', e.target.value)}
          >
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Project Description <span className="required">*</span>
        </label>
        <textarea
          className={`form-textarea${errors.projectDescription ? ' error' : ''}`}
          placeholder="Describe the project goals, requirements, and any specific technical or creative needs…"
          rows={5}
          value={form.projectDescription}
          onChange={(e) => onChange('projectDescription', e.target.value)}
        />
        <FieldError msg={errors.projectDescription} />
      </div>

      <div className="form-group">
        <label className="form-label">
          Deliverables <span className="required">*</span>
        </label>
        <span className="form-hint" style={{ marginBottom: '8px' }}>
          Add each deliverable separately. These will appear in the contract and, if using per-milestone billing, each gets its own invoice.
        </span>

        {form.deliverables.length > 0 && (
          <div className="deliverables-list" style={{ marginBottom: '10px' }}>
            {form.deliverables.map((d, i) => (
              <div className="deliverable-item" key={i}>
                <span>📌 {d}</span>
                <button
                  type="button"
                  className="deliverable-remove"
                  onClick={() => removeDeliverable(i)}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="deliverable-add-row">
          <input
            className={`form-input${errors.deliverables ? ' error' : ''}`}
            placeholder="e.g. Responsive Homepage Design"
            value={deliverableInput}
            onChange={(e) => setDeliverableInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={addDeliverable}
            style={{ flexShrink: 0 }}
          >
            + Add
          </button>
        </div>
        <FieldError msg={errors.deliverables} />
      </div>
    </div>
  );
}

/* ─── Step 3: Payment Terms ─── */
function StepPayment({ form, onChange, errors }) {
  const fee = parseFloat(form.totalFeeUSD) || 0;
  const ethEquiv = fee > 0 ? (fee / ETH_PRICE_USD).toFixed(4) : null;

  return (
    <div className="form-section">
      <div className="form-section-title">
        <span className="form-section-icon">📅</span>
        Project Timeline
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Start Date <span className="required">*</span>
          </label>
          <input
            className={`form-input${errors.startDate ? ' error' : ''}`}
            type="date"
            value={form.startDate}
            onChange={(e) => onChange('startDate', e.target.value)}
          />
          <FieldError msg={errors.startDate} />
        </div>
        <div className="form-group">
          <label className="form-label">
            End Date <span className="required">*</span>
          </label>
          <input
            className={`form-input${errors.endDate ? ' error' : ''}`}
            type="date"
            value={form.endDate}
            onChange={(e) => onChange('endDate', e.target.value)}
          />
          <FieldError msg={errors.endDate} />
        </div>
      </div>

      <div className="divider" style={{ margin: '8px 0' }} />

      <div className="form-section-title">
        <span className="form-section-icon">💰</span>
        Fee &amp; Schedule
      </div>

      <div className="form-group">
        <label className="form-label">
          Total Project Fee (USD) <span className="required">*</span>
        </label>
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--gray-400)', fontWeight: '600', pointerEvents: 'none',
          }}>$</span>
          <input
            className={`form-input${errors.totalFeeUSD ? ' error' : ''}`}
            type="number"
            min="1"
            step="50"
            placeholder="3000"
            value={form.totalFeeUSD}
            onChange={(e) => onChange('totalFeeUSD', e.target.value)}
            style={{ paddingLeft: '28px' }}
          />
        </div>
        <FieldError msg={errors.totalFeeUSD} />
        {ethEquiv && (
          <div className="eth-conversion">
            <span className="eth-conversion__icon">⟠</span>
            <div>
              <div className="eth-conversion__amount">≈ {ethEquiv} ETH</div>
              <div className="eth-conversion__rate">at ${ETH_PRICE_USD.toLocaleString()}/ETH (fixed reference rate)</div>
            </div>
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          Payment Schedule <span className="required">*</span>
        </label>
        <div className="radio-group">
          {PAYMENT_SCHEDULES.map((ps) => (
            <label
              key={ps.value}
              className={`radio-option${form.paymentSchedule === ps.value ? ' selected' : ''}`}
            >
              <input
                type="radio"
                name="paymentSchedule"
                value={ps.value}
                checked={form.paymentSchedule === ps.value}
                onChange={() => onChange('paymentSchedule', ps.value)}
              />
              <div className="radio-option-content">
                <div className="radio-option-label">{ps.label}</div>
                <div className="radio-option-desc">{ps.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Payment Terms</label>
          <select
            className="form-select"
            value={form.paymentTerms}
            onChange={(e) => onChange('paymentTerms', e.target.value)}
          >
            <option>Net 7</option>
            <option>Net 14</option>
            <option>Net 30</option>
          </select>
          <span className="form-hint">Days after invoice issuance when payment is due.</span>
        </div>
        <div className="form-group">
          <label className="form-label">Revision Rounds</label>
          <select
            className="form-select"
            value={form.revisionRounds}
            onChange={(e) => onChange('revisionRounds', e.target.value)}
          >
            <option value="1">1 Round</option>
            <option value="2">2 Rounds</option>
            <option value="3">3 Rounds</option>
            <option value="Unlimited">Unlimited</option>
          </select>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 4: Review ─── */
function StepReview({ form }) {
  const fee = parseFloat(form.totalFeeUSD) || 0;
  const ethEquiv = fee > 0 ? (fee / ETH_PRICE_USD).toFixed(4) : '—';
  const scheduleLabels = { fullUpfront: 'Full Upfront', split5050: '50/50 Split', perMilestone: 'Per Milestone' };

  return (
    <div>
      {/* Parties */}
      <div className="review-section">
        <div className="review-section-title">👤 Freelancer</div>
        <div className="review-grid">
          <div className="review-item">
            <div className="review-item__label">Name</div>
            <div className="review-item__value">{form.freelancerName || '—'}</div>
          </div>
          <div className="review-item">
            <div className="review-item__label">Email</div>
            <div className="review-item__value">{form.freelancerEmail || '—'}</div>
          </div>
          <div className="review-item" style={{ gridColumn: '1 / -1' }}>
            <div className="review-item__label">ETH Address</div>
            <div className="review-item__value" style={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>
              {form.freelancerEthAddress || '—'}
            </div>
          </div>
        </div>
      </div>

      <div className="divider" />

      <div className="review-section">
        <div className="review-section-title">🏢 Client</div>
        <div className="review-grid">
          <div className="review-item">
            <div className="review-item__label">Name</div>
            <div className="review-item__value">{form.clientName || '—'}</div>
          </div>
          <div className="review-item">
            <div className="review-item__label">Company</div>
            <div className="review-item__value">{form.clientCompany || '—'}</div>
          </div>
          <div className="review-item">
            <div className="review-item__label">Email</div>
            <div className="review-item__value">{form.clientEmail || '—'}</div>
          </div>
        </div>
      </div>

      <div className="divider" />

      <div className="review-section">
        <div className="review-section-title">📋 Project Details</div>
        <div className="review-grid">
          <div className="review-item">
            <div className="review-item__label">Title</div>
            <div className="review-item__value">{form.projectTitle || '—'}</div>
          </div>
          <div className="review-item">
            <div className="review-item__label">Industry</div>
            <div className="review-item__value">{form.industry}</div>
          </div>
          <div className="review-item" style={{ gridColumn: '1 / -1' }}>
            <div className="review-item__label">Description</div>
            <div className="review-item__value" style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
              {form.projectDescription || '—'}
            </div>
          </div>
        </div>
        {form.deliverables.length > 0 && (
          <div style={{ marginTop: '12px' }}>
            <div className="review-item__label" style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--gray-400)', marginBottom: '8px' }}>
              Deliverables ({form.deliverables.length})
            </div>
            <div className="review-deliverables">
              {form.deliverables.map((d, i) => (
                <div className="review-deliverable" key={i}>{d}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="divider" />

      <div className="review-section">
        <div className="review-section-title">💰 Payment Terms</div>
        <div className="review-grid">
          <div className="review-item">
            <div className="review-item__label">Start Date</div>
            <div className="review-item__value">{form.startDate || '—'}</div>
          </div>
          <div className="review-item">
            <div className="review-item__label">End Date</div>
            <div className="review-item__value">{form.endDate || '—'}</div>
          </div>
          <div className="review-item">
            <div className="review-item__label">Total Fee (USD)</div>
            <div className="review-item__value" style={{ fontWeight: '700', color: 'var(--navy)' }}>
              ${fee ? fee.toLocaleString() : '—'}
            </div>
          </div>
          <div className="review-item">
            <div className="review-item__label">ETH Equivalent</div>
            <div className="review-item__value" style={{ color: 'var(--indigo)', fontWeight: '600' }}>
              ≈ {ethEquiv} ETH
            </div>
          </div>
          <div className="review-item">
            <div className="review-item__label">Payment Schedule</div>
            <div className="review-item__value">{scheduleLabels[form.paymentSchedule] || '—'}</div>
          </div>
          <div className="review-item">
            <div className="review-item__label">Payment Terms</div>
            <div className="review-item__value">{form.paymentTerms}</div>
          </div>
          <div className="review-item">
            <div className="review-item__label">Revision Rounds</div>
            <div className="review-item__value">{form.revisionRounds}</div>
          </div>
        </div>
      </div>

      <div className="alert alert--info" style={{ marginTop: '16px' }}>
        <span className="alert__icon">ℹ</span>
        <span>
          Please review all details carefully. Once you generate the contract, you can view, print, and proceed to invoicing.
          You can always start a new project if you need to make changes.
        </span>
      </div>
    </div>
  );
}

/* ─── Validation ─── */
function validateStep(step, form) {
  const errors = {};

  if (step === 0) {
    if (!form.freelancerName.trim()) errors.freelancerName = 'Full name is required.';
    if (!form.freelancerEmail.trim()) {
      errors.freelancerEmail = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.freelancerEmail)) {
      errors.freelancerEmail = 'Enter a valid email address.';
    }
    if (!form.freelancerEthAddress.trim()) {
      errors.freelancerEthAddress = 'ETH address is required.';
    } else if (!/^0x[0-9a-fA-F]{40}$/.test(form.freelancerEthAddress.trim())) {
      errors.freelancerEthAddress = 'Enter a valid Ethereum address (0x followed by 40 hex chars).';
    }
    if (!form.clientName.trim()) errors.clientName = 'Client name is required.';
    if (!form.clientEmail.trim()) {
      errors.clientEmail = 'Client email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail)) {
      errors.clientEmail = 'Enter a valid email address.';
    }
  }

  if (step === 1) {
    if (!form.projectTitle.trim()) errors.projectTitle = 'Project title is required.';
    if (!form.projectDescription.trim()) errors.projectDescription = 'Project description is required.';
    if (form.deliverables.length === 0) errors.deliverables = 'Add at least one deliverable.';
  }

  if (step === 2) {
    if (!form.startDate) errors.startDate = 'Start date is required.';
    if (!form.endDate) errors.endDate = 'End date is required.';
    if (form.startDate && form.endDate && form.endDate <= form.startDate) {
      errors.endDate = 'End date must be after start date.';
    }
    if (!form.totalFeeUSD || parseFloat(form.totalFeeUSD) <= 0) {
      errors.totalFeeUSD = 'Enter a valid project fee.';
    }
  }

  return errors;
}

/* ─── Main Component ─── */
export default function NewProject() {
  const navigate = useNavigate();
  const { setProject } = useApp();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  function onChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
    }
  }

  function handleNext() {
    const errs = validateStep(step, form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleBack() {
    setErrors({});
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleGenerate() {
    setProject(form);
    navigate('/contract');
  }

  const stepComponents = [
    <StepParties form={form} onChange={onChange} errors={errors} />,
    <StepProject form={form} onChange={onChange} errors={errors} />,
    <StepPayment form={form} onChange={onChange} errors={errors} />,
    <StepReview form={form} />,
  ];

  const stepTitles = [
    { title: '👥 Party Information', subtitle: 'Who is involved in this engagement?' },
    { title: '📋 Project Details', subtitle: 'What are you building and delivering?' },
    { title: '💸 Payment Terms', subtitle: 'How and when will payment be made?' },
    { title: '✅ Review & Generate', subtitle: 'Confirm everything looks correct before generating your contract.' },
  ];

  return (
    <div className="page-container--narrow">
      <div className="new-project-header">
        <h1>New Project</h1>
        <p>Fill in the details below to generate your freelance contract and invoices.</p>
      </div>

      <StepProgress current={step} />

      <div className="step-card">
        <div className="step-card__header">
          <h2 className="step-card__title">{stepTitles[step].title}</h2>
          <p className="step-card__subtitle">{stepTitles[step].subtitle}</p>
        </div>

        {stepComponents[step]}

        <div className={`step-card__footer${step === 0 ? ' step-card__footer--end' : ''}`}>
          {step > 0 && (
            <button className="btn btn--secondary" onClick={handleBack}>
              ← Back
            </button>
          )}

          {step < STEPS.length - 1 && (
            <button className="btn btn--primary" onClick={handleNext}>
              Continue →
            </button>
          )}

          {step === STEPS.length - 1 && (
            <button className="btn btn--primary btn--lg" onClick={handleGenerate}>
              <span>📄</span>
              Generate Contract
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
