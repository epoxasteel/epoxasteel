import { siteConfig, formattedAddress } from '@/lib/site';
import { escapeHtml } from '@/lib/utils';

/**
 * Email templates are built as plain strings with inline styles, because email
 * clients still do not support external stylesheets, CSS variables or most of
 * the layout features the website uses. Every interpolated value is escaped.
 */

export type SubmissionContext = {
  submittedAt: string;
  timezone: string;
  browser: string;
  os: string;
  device: string;
  /** Which page the form was submitted from, e.g. `/products/steel-beams`. */
  sourcePage?: string;
  /** Present only when `EMAIL_INCLUDE_IP=true`. */
  ip?: string;
  userAgent?: string;
};

const BRAND = {
  bg: '#0a0c0f',
  panel: '#101317',
  line: '#232a33',
  text: '#a8b2be',
  bright: '#f2f5f9',
  accent: '#3a8ae0',
  muted: '#78828f',
};

function shell(title: string, preheader: string, content: string) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark light">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};padding:32px 16px;">
  <tr>
    <td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:${BRAND.panel};border:1px solid ${BRAND.line};border-radius:10px;overflow:hidden;">
        <tr>
          <td style="padding:28px 32px;border-bottom:1px solid ${BRAND.line};">
            <div style="font-size:19px;font-weight:700;letter-spacing:0.18em;color:${BRAND.bright};text-transform:uppercase;">EPOXA<span style="color:${BRAND.accent};"> STEEL</span></div>
            <div style="font-size:11px;letter-spacing:0.24em;color:${BRAND.muted};text-transform:uppercase;margin-top:6px;">Reinforce Your Dream</div>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;color:${BRAND.text};font-size:15px;line-height:1.65;">
            ${content}
          </td>
        </tr>
        <tr>
          <td style="padding:22px 32px;border-top:1px solid ${BRAND.line};color:${BRAND.muted};font-size:12px;line-height:1.6;">
            <div style="color:${BRAND.text};font-weight:600;">${escapeHtml(siteConfig.legalName)}</div>
            <!--
              The full street address, both lines.

              This printed line2 only, which read as "Building C, Newark, NJ"
              — half an address, and the half that cannot be posted to.

              It stays in the email footer even though the site footer no longer
              shows it: CAN-SPAM requires a valid physical postal address in
              commercial email, and the newsletter is commercial email.
            -->
            <div>${escapeHtml(formattedAddress())}</div>
            <div style="margin-top:8px;">
              <a href="mailto:${siteConfig.contact.email}" style="color:${BRAND.accent};text-decoration:none;">${siteConfig.contact.email}</a>
              &nbsp;·&nbsp;
              <a href="tel:${siteConfig.contact.phoneHref}" style="color:${BRAND.accent};text-decoration:none;">${escapeHtml(siteConfig.contact.phone)}</a>
              &nbsp;·&nbsp;
              <a href="${siteConfig.url}" style="color:${BRAND.accent};text-decoration:none;">${siteConfig.domain}</a>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

function heading(text: string) {
  return `<h1 style="margin:0 0 6px;font-size:22px;line-height:1.25;color:${BRAND.bright};font-weight:700;letter-spacing:-0.02em;">${escapeHtml(text)}</h1>`;
}

function paragraph(text: string) {
  return `<p style="margin:0 0 16px;color:${BRAND.text};font-size:15px;line-height:1.65;">${escapeHtml(text)}</p>`;
}

function detailTable(rows: [string, string][]) {
  const body = rows
    .filter(([, value]) => Boolean(value))
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:9px 0;border-bottom:1px solid ${BRAND.line};color:${BRAND.muted};font-size:12px;text-transform:uppercase;letter-spacing:0.1em;width:38%;vertical-align:top;">${escapeHtml(label)}</td>
        <td style="padding:9px 0;border-bottom:1px solid ${BRAND.line};color:${BRAND.bright};font-size:14px;vertical-align:top;">${escapeHtml(value).replace(/\n/g, '<br>')}</td>
      </tr>`,
    )
    .join('');

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;">${body}</table>`;
}

/**
 * Where and when the enquiry came from.
 *
 * Rendered at the foot of an owner notification, below the enquiry itself,
 * because it is context rather than content: useful before you call someone back,
 * never the thing you read first.
 *
 * The source page is here rather than in the main table for the same reason — it
 * tells you what the visitor had just been reading, which shapes the conversation
 * without being part of what they said.
 *
 * IP and user agent appear only when `EMAIL_INCLUDE_IP=true`. See
 * `lib/request-context.ts` for why that is a deliberate opt-in.
 */
function submissionContext(context?: SubmissionContext) {
  if (!context) return '';

  const rows = [
    `${escapeHtml(context.submittedAt)} <span style="color:${BRAND.muted};">(${escapeHtml(context.timezone)})</span>`,
    `<span style="color:${BRAND.muted};">${escapeHtml(context.device)} · ${escapeHtml(context.browser)} · ${escapeHtml(context.os)}</span>`,
    context.sourcePage
      ? `<span style="color:${BRAND.muted};">Sent from </span><span style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">${escapeHtml(context.sourcePage)}</span>`
      : null,
    context.ip
      ? `<span style="color:${BRAND.muted};">IP </span><span style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">${escapeHtml(context.ip)}</span>`
      : null,
  ].filter(Boolean);

  return `<div style="margin-top:26px;padding-top:18px;border-top:1px solid ${BRAND.line};">
    <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.muted};margin-bottom:10px;">Submitted</div>
    <div style="color:${BRAND.text};font-size:13px;line-height:1.7;">
      ${rows.join('<br>')}
    </div>
  </div>`;
}

function contextLines(context?: SubmissionContext) {
  if (!context) return [];
  return [
    '',
    '--- Submitted ---',
    `${context.submittedAt} (${context.timezone})`,
    `${context.device} · ${context.browser} · ${context.os}`,
    ...(context.sourcePage ? [`Sent from: ${context.sourcePage}`] : []),
    ...(context.ip ? [`IP: ${context.ip}`] : []),
    ...(context.userAgent ? [`User agent: ${context.userAgent}`] : []),
  ];
}

function button(label: string, href: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 4px;">
    <tr><td style="background:${BRAND.accent};border-radius:6px;">
      <a href="${href}" style="display:inline-block;padding:12px 24px;color:#04101c;font-size:14px;font-weight:600;text-decoration:none;">${escapeHtml(label)}</a>
    </td></tr>
  </table>`;
}

/* -------------------------------------------------------------------------- */
/* Quote request                                                              */
/* -------------------------------------------------------------------------- */

export type QuoteEmailData = {
  reference: string;
  context?: SubmissionContext;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  projectType: string;
  product: string;
  dimensions: string;
  quantity: string;
  quantityUnit: string;
  finish: string;
  fulfilment: string;
  budget?: string;
  timeline: string;
  description: string;
  /** Names of the files attached to this notification, in the order they arrived. */
  attachmentNames?: string[];
  newsletter?: boolean;
};

export function quoteInternalEmail(data: QuoteEmailData) {
  const files = data.attachmentNames ?? [];
  // "Attached to this email" rather than a bare list, because the owner's next
  // action is to look for them in this message — not to wonder where they went.
  const fileSummary = files.length
    ? `${files.length} file${files.length === 1 ? '' : 's'} attached to this email: ${files.join(', ')}`
    : 'None';

  const content = `
    ${heading(`New quote request — ${data.reference}`)}
    ${paragraph(`${data.fullName} at ${data.company} has requested a quotation.`)}
    ${detailTable([
      ['Reference', data.reference],
      ['Contact', data.fullName],
      ['Company', data.company],
      ['Email', data.email],
      ['Phone', data.phone],
      ['Location', `${data.city}, ${data.country}`],
      ['Project type', data.projectType],
      ['Product', data.product],
      ['Quantity', `${data.quantity} ${data.quantityUnit}`],
      ['Required finish', data.finish],
      ['Fulfilment', data.fulfilment],
      ['Deadline', data.timeline],
      ['Budget', data.budget || 'Not stated'],
      ['Files', fileSummary],
      ['Newsletter opt-in', data.newsletter ? 'Yes' : 'No'],
    ])}
    <div style="color:${BRAND.muted};font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Sections, grades &amp; dimensions</div>
    <div style="background:${BRAND.bg};border:1px solid ${BRAND.line};border-radius:6px;padding:16px;color:${BRAND.text};font-size:14px;line-height:1.65;white-space:pre-wrap;margin-bottom:20px;">${escapeHtml(data.dimensions)}</div>
    <div style="color:${BRAND.muted};font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Additional notes</div>
    <div style="background:${BRAND.bg};border:1px solid ${BRAND.line};border-radius:6px;padding:16px;color:${BRAND.text};font-size:14px;line-height:1.65;white-space:pre-wrap;">${escapeHtml(data.description)}</div>
    <p style="margin:20px 0 0;color:${BRAND.muted};font-size:13px;">Reply directly to this message to reach the customer.</p>
    ${submissionContext(data.context)}
  `;

  return {
    subject: `Quote request ${data.reference} — ${data.company} (${data.product})`,
    html: shell(`Quote request ${data.reference}`, `${data.company} — ${data.product}`, content),
    text: [
      `NEW QUOTE REQUEST — ${data.reference}`,
      '',
      `Contact:      ${data.fullName}`,
      `Company:      ${data.company}`,
      `Email:        ${data.email}`,
      `Phone:        ${data.phone}`,
      `Location:     ${data.city}, ${data.country}`,
      `Project type: ${data.projectType}`,
      `Product:      ${data.product}`,
      `Quantity:     ${data.quantity} ${data.quantityUnit}`,
      `Finish:       ${data.finish}`,
      `Fulfilment:   ${data.fulfilment}`,
      `Deadline:     ${data.timeline}`,
      `Budget:       ${data.budget || 'Not stated'}`,
      `Files:        ${fileSummary}`,
      '',
      'SECTIONS, GRADES & DIMENSIONS',
      data.dimensions,
      '',
      'ADDITIONAL NOTES',
      data.description,
      ...contextLines(data.context),
    ].join('\n'),
  };
}

export function quoteConfirmationEmail(data: QuoteEmailData) {
  const files = data.attachmentNames ?? [];

  const content = `
    ${heading('We have your request')}
    ${paragraph(`Thank you, ${data.fullName.split(' ')[0]}. Your quotation request has been received and assigned reference ${data.reference}.`)}
    ${paragraph('A member of our commercial team will review the details and respond within one business day. Standard enquiries are quoted within 48 hours; where a package needs mill-direct sourcing or fabrication we will confirm the expected turnaround first, so you always know when to expect our number.')}
    ${detailTable(
      [
        ['Reference', data.reference],
        ['Product', data.product],
        ['Quantity', `${data.quantity} ${data.quantityUnit}`],
        ['Required finish', data.finish],
        ['Project type', data.projectType],
        ['Fulfilment', data.fulfilment],
        ['Deadline', data.timeline],
        // Confirming the filenames back is what tells somebody the drawing
        // actually arrived. A generic "we received your attachments" does not.
        files.length
          ? ([files.length === 1 ? 'File received' : 'Files received', files.join(', ')] as [
              string,
              string,
            ])
          : null,
      ].filter((row): row is [string, string] => row !== null),
    )}
    ${paragraph('If anything changes in the meantime — quantities, dates or specification — reply to this email with your reference and we will update the enquiry.')}
    ${button('Explore our products', `${siteConfig.url}/products`)}
  `;

  return {
    subject: `Your ${siteConfig.legalName} quote request — ${data.reference}`,
    html: shell(
      'Quote request received',
      `Reference ${data.reference} — we will respond within one business day.`,
      content,
    ),
    text: [
      `Thank you, ${data.fullName.split(' ')[0]}.`,
      '',
      `Your quotation request has been received and assigned reference ${data.reference}.`,
      'A member of our commercial team will respond within one business day.',
      '',
      `Product:  ${data.product}`,
      `Quantity: ${data.quantity} ${data.quantityUnit}`,
      `Finish:   ${data.finish}`,
      `Deadline: ${data.timeline}`,
      ...(files.length ? [`Files:    ${files.join(', ')}`] : []),
      '',
      siteConfig.legalName,
    ].join('\n'),
  };
}

/* -------------------------------------------------------------------------- */
/* Contact message                                                            */
/* -------------------------------------------------------------------------- */

export type ContactEmailData = {
  reference: string;
  context?: SubmissionContext;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType: string;
  subject: string;
  message: string;
};

export function contactInternalEmail(data: ContactEmailData) {
  const content = `
    ${heading(`New enquiry — ${data.subject}`)}
    ${detailTable([
      ['Reference', data.reference],
      ['Name', data.name],
      ['Email', data.email],
      ['Phone', data.phone ?? ''],
      ['Company', data.company ?? ''],
      ['Enquiry about', data.projectType],
      ['Subject', data.subject],
    ])}
    <div style="color:${BRAND.muted};font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Message</div>
    <div style="background:${BRAND.bg};border:1px solid ${BRAND.line};border-radius:6px;padding:16px;color:${BRAND.text};font-size:14px;line-height:1.65;white-space:pre-wrap;">${escapeHtml(data.message)}</div>
    ${submissionContext(data.context)}
  `;

  return {
    subject: `Website enquiry: ${data.subject} — ${data.name}`,
    html: shell(`Enquiry from ${data.name}`, data.subject, content),
    text: [
      `NEW ENQUIRY — ${data.reference}`,
      '',
      `Name:     ${data.name}`,
      `Email:    ${data.email}`,
      `Phone:    ${data.phone ?? '—'}`,
      `Company:  ${data.company ?? '—'}`,
      `About:    ${data.projectType}`,
      `Subject:  ${data.subject}`,
      '',
      data.message,
      ...contextLines(data.context),
    ].join('\n'),
  };
}

export function contactConfirmationEmail(data: ContactEmailData) {
  const content = `
    ${heading('Message received')}
    ${paragraph(`Thank you, ${data.name.split(' ')[0]}. We have your message and it is with the right team.`)}
    ${paragraph('We respond to enquiries within one business day. If your message is urgent — a delivery in progress or a site issue — please call us directly rather than waiting for a reply.')}
    ${detailTable([
      ['Reference', data.reference],
      ['Subject', data.subject],
    ])}
    ${button('Call us now', `tel:${siteConfig.contact.phoneHref}`)}
  `;

  return {
    subject: `We received your message — ${data.reference}`,
    html: shell('Message received', 'We respond within one business day.', content),
    text: [
      `Thank you, ${data.name.split(' ')[0]}.`,
      '',
      `We have received your message (reference ${data.reference}) and will respond within one business day.`,
      `If it is urgent, call ${siteConfig.contact.phone}.`,
      '',
      siteConfig.legalName,
    ].join('\n'),
  };
}

/* -------------------------------------------------------------------------- */
/* Newsletter                                                                 */
/* -------------------------------------------------------------------------- */

export function newsletterConfirmationEmail(email: string) {
  const content = `
    ${heading('You are subscribed')}
    ${paragraph(`Thank you for subscribing to the ${siteConfig.legalName} briefing. You will receive market conditions, technical guidance and project news — roughly once a month, and never more than twice.`)}
    ${paragraph('We do not share your address with anyone, and every email includes a one-click unsubscribe link.')}
    ${button('Read the latest insights', `${siteConfig.url}/blog`)}
  `;

  return {
    subject: `Welcome to the ${siteConfig.legalName} briefing`,
    html: shell(
      'Subscription confirmed',
      'Market insight and technical guidance, monthly.',
      content,
    ),
    text: [
      `You are subscribed to the ${siteConfig.legalName} briefing.`,
      '',
      'Market conditions, technical guidance and project news — roughly monthly.',
      `Read the latest at ${siteConfig.url}/blog`,
    ].join('\n'),
    to: email,
  };
}

/* -------------------------------------------------------------------------- */
/* Assistant lead                                                             */
/* -------------------------------------------------------------------------- */

export type AssistantLeadEmailData = {
  reference: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  product?: string;
  quantity?: string;
  timeline?: string;
  location?: string;
  summary?: string;
  callback?: string;
  transcript: string;
};

/**
 * Sent to the desk when the assistant qualifies an enquiry.
 *
 * The transcript is included in full and deliberately last. Whoever picks this
 * up needs to know what was already said before they call back — a lead that
 * arrives without its conversation makes the customer repeat themselves, which
 * undoes the point of having answered them quickly in the first place.
 */
export function assistantLeadEmail(data: AssistantLeadEmailData) {
  const content = `
    ${heading('Enquiry from the site assistant')}
    ${paragraph(`${data.name} was talking to the assistant on the website and left contact details. Reference ${data.reference}.`)}
    ${detailTable([
      ['Name', data.name],
      ['Email', data.email],
      ['Company', data.company ?? ''],
      ['Phone', data.phone ?? ''],
      ['Product', data.product ?? ''],
      ['Quantity', data.quantity ?? ''],
      ['Timeline', data.timeline ?? ''],
      ['Location', data.location ?? ''],
      ['Preferred callback', data.callback ?? ''],
      ['What they need', data.summary ?? ''],
    ])}
    ${button('Reply to the enquiry', `mailto:${data.email}`)}
    <div style="margin-top:26px;padding-top:20px;border-top:1px solid ${BRAND.line};">
      <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.muted};margin-bottom:10px;">Conversation</div>
      <pre style="margin:0;white-space:pre-wrap;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12.5px;line-height:1.7;color:${BRAND.text};">${escapeHtml(data.transcript)}</pre>
    </div>
  `;

  return {
    subject: `Assistant enquiry ${data.reference} — ${data.name}${data.company ? ` (${data.company})` : ''}`,
    html: shell('Assistant enquiry', data.summary ?? `${data.name} left contact details.`, content),
    text: [
      `Enquiry from the site assistant — ${data.reference}`,
      '',
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      data.company ? `Company: ${data.company}` : '',
      data.phone ? `Phone: ${data.phone}` : '',
      data.product ? `Product: ${data.product}` : '',
      data.quantity ? `Quantity: ${data.quantity}` : '',
      data.timeline ? `Timeline: ${data.timeline}` : '',
      data.location ? `Location: ${data.location}` : '',
      data.callback ? `Preferred callback: ${data.callback}` : '',
      data.summary ? `\nWhat they need: ${data.summary}` : '',
      '',
      '--- Conversation ---',
      data.transcript,
    ]
      .filter(Boolean)
      .join('\n'),
  };
}

export function newsletterInternalEmail(email: string) {
  return {
    subject: `New newsletter subscriber: ${email}`,
    html: shell(
      'New subscriber',
      email,
      `${heading('New newsletter subscriber')}${detailTable([
        ['Email', email],
        ['Source', 'Website'],
      ])}`,
    ),
    text: `New newsletter subscriber: ${email}`,
  };
}
