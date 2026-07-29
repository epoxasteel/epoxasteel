import { siteConfig } from '@/lib/site';
import { escapeHtml } from '@/lib/utils';

/**
 * Email templates are built as plain strings with inline styles, because email
 * clients still do not support external stylesheets, CSS variables or most of
 * the layout features the website uses. Every interpolated value is escaped.
 */

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
            <div>${escapeHtml(siteConfig.address.line2)}, ${escapeHtml(siteConfig.address.city)}, ${escapeHtml(siteConfig.address.region)} ${escapeHtml(siteConfig.address.postalCode)}</div>
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
  fullName: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  projectType: string;
  product: string;
  quantity: string;
  quantityUnit: string;
  budget: string;
  timeline: string;
  description: string;
  attachmentName?: string;
  newsletter?: boolean;
};

export function quoteInternalEmail(data: QuoteEmailData) {
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
      ['Budget', data.budget],
      ['Timeline', data.timeline],
      ['Attachment', data.attachmentName ?? 'None'],
      ['Newsletter opt-in', data.newsletter ? 'Yes' : 'No'],
    ])}
    <div style="color:${BRAND.muted};font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Project description</div>
    <div style="background:${BRAND.bg};border:1px solid ${BRAND.line};border-radius:6px;padding:16px;color:${BRAND.text};font-size:14px;line-height:1.65;white-space:pre-wrap;">${escapeHtml(data.description)}</div>
    <p style="margin:20px 0 0;color:${BRAND.muted};font-size:13px;">Reply directly to this message to reach the customer.</p>
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
      `Budget:       ${data.budget}`,
      `Timeline:     ${data.timeline}`,
      `Attachment:   ${data.attachmentName ?? 'None'}`,
      '',
      'DESCRIPTION',
      data.description,
    ].join('\n'),
  };
}

export function quoteConfirmationEmail(data: QuoteEmailData) {
  const content = `
    ${heading('We have your request')}
    ${paragraph(`Thank you, ${data.fullName.split(' ')[0]}. Your quotation request has been received and assigned reference ${data.reference}.`)}
    ${paragraph('A member of our commercial team will review the details and respond within one business day. Standard enquiries are quoted within 48 hours; where a package needs mill-direct sourcing or fabrication we will confirm the expected turnaround first, so you always know when to expect our number.')}
    ${detailTable([
      ['Reference', data.reference],
      ['Product', data.product],
      ['Quantity', `${data.quantity} ${data.quantityUnit}`],
      ['Project type', data.projectType],
      ['Timeline', data.timeline],
    ])}
    ${paragraph('If anything changes in the meantime — quantities, dates or specification — reply to this email with your reference and we will update the enquiry.')}
    ${button('Explore our products', `${siteConfig.url}/products`)}
  `;

  return {
    subject: `Your EPOXA STEEL quote request — ${data.reference}`,
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
      `Timeline: ${data.timeline}`,
      '',
      `${siteConfig.legalName} · ${siteConfig.contact.email} · ${siteConfig.contact.phone}`,
    ].join('\n'),
  };
}

/* -------------------------------------------------------------------------- */
/* Contact message                                                            */
/* -------------------------------------------------------------------------- */

export type ContactEmailData = {
  reference: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
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
      ['Subject', data.subject],
    ])}
    <div style="color:${BRAND.muted};font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Message</div>
    <div style="background:${BRAND.bg};border:1px solid ${BRAND.line};border-radius:6px;padding:16px;color:${BRAND.text};font-size:14px;line-height:1.65;white-space:pre-wrap;">${escapeHtml(data.message)}</div>
  `;

  return {
    subject: `Website enquiry: ${data.subject} — ${data.name}`,
    html: shell(`Enquiry from ${data.name}`, data.subject, content),
    text: [
      `NEW ENQUIRY — ${data.reference}`,
      '',
      `Name:    ${data.name}`,
      `Email:   ${data.email}`,
      `Phone:   ${data.phone ?? '—'}`,
      `Company: ${data.company ?? '—'}`,
      `Subject: ${data.subject}`,
      '',
      data.message,
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
      `${siteConfig.legalName} · ${siteConfig.contact.email}`,
    ].join('\n'),
  };
}

/* -------------------------------------------------------------------------- */
/* Newsletter                                                                 */
/* -------------------------------------------------------------------------- */

export function newsletterConfirmationEmail(email: string) {
  const content = `
    ${heading('You are subscribed')}
    ${paragraph('Thank you for subscribing to the EPOXA STEEL briefing. You will receive market conditions, technical guidance and project news — roughly once a month, and never more than twice.')}
    ${paragraph('We do not share your address with anyone, and every email includes a one-click unsubscribe link.')}
    ${button('Read the latest insights', `${siteConfig.url}/blog`)}
  `;

  return {
    subject: 'Welcome to the EPOXA STEEL briefing',
    html: shell(
      'Subscription confirmed',
      'Market insight and technical guidance, monthly.',
      content,
    ),
    text: [
      'You are subscribed to the EPOXA STEEL briefing.',
      '',
      'Market conditions, technical guidance and project news — roughly monthly.',
      `Read the latest at ${siteConfig.url}/blog`,
    ].join('\n'),
    to: email,
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
