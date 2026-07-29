/**
 * Generates the downloadable datasheets from the site's own content.
 *
 * Every product page offered a specification sheet and every one of those links
 * returned 404, because the PDFs were never produced. A download button that
 * fails is worse than no download button — a buyer who clicks it learns
 * something about how the rest of the operation is run.
 *
 * So the sheets are built here, at build time, from the same typed content the
 * pages render: grades, standards, finishes, applications, key facts and the
 * full dimension table. They cannot drift from the site, because there is only
 * one source. Add a grade to `content/products.ts` and it appears in the PDF on
 * the next deploy.
 *
 * Runs automatically before `next build` (see the `prebuild` script). Output
 * lands in `public/downloads/` and is git-ignored — it is derived, not authored.
 *
 * To substitute a real document later, commit it to `public/downloads/` under a
 * new filename and point the product's `href` at it in `content/products.ts`.
 * The generated sheets are overwritten on every build, so they must not share a
 * name with anything hand-authored.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';

import { products } from '../src/content/products.ts';
import { certifications, manufacturingStandards } from '../src/content/company.ts';
import { services } from '../src/content/services.ts';
import { siteConfig } from '../src/lib/site.ts';

const OUT = path.join(process.cwd(), 'public', 'downloads');

/* -------------------------------------------------------------------------- */
/* Page furniture                                                             */
/* -------------------------------------------------------------------------- */

const A4 = { width: 595.28, height: 841.89 };
const MARGIN = 54;
const INK = {
  bright: rgb(0.95, 0.96, 0.98),
  text: rgb(0.66, 0.7, 0.75),
  muted: rgb(0.46, 0.5, 0.55),
  accent: rgb(0.23, 0.54, 0.88),
  rule: rgb(0.14, 0.16, 0.2),
  panel: rgb(0.063, 0.075, 0.09),
  page: rgb(0.024, 0.027, 0.035),
};

type Fonts = { regular: PDFFont; medium: PDFFont; mono: PDFFont };

/** A cursor over a growing document, so callers never track page breaks. */
class Sheet {
  private page: PDFPage;
  private y: number;
  readonly pages: PDFPage[] = [];

  constructor(
    private doc: PDFDocument,
    private fonts: Fonts,
    private footer: string,
  ) {
    this.page = this.newPage();
    this.y = A4.height - MARGIN - 74;
  }

  private newPage() {
    const page = this.doc.addPage([A4.width, A4.height]);
    page.drawRectangle({ x: 0, y: 0, width: A4.width, height: A4.height, color: INK.page });
    this.pages.push(page);
    return page;
  }

  get width() {
    return A4.width - MARGIN * 2;
  }

  /** Would `height` fit on the current page? */
  private fits(height: number) {
    return this.y - height >= MARGIN + 42;
  }

  private breakPage() {
    this.page = this.newPage();
    this.y = A4.height - MARGIN;
  }

  /** Reserve vertical space, breaking to a new page when it will not fit. */
  private reserve(height: number) {
    if (this.y - height < MARGIN + 42) {
      this.page = this.newPage();
      this.y = A4.height - MARGIN;
    }
    this.y -= height;
    return this.y;
  }

  gap(height: number) {
    this.reserve(height);
  }

  masthead(kicker: string, title: string) {
    const first = this.pages[0];
    first.drawText('EPOXA', {
      x: MARGIN,
      y: A4.height - MARGIN - 16,
      size: 17,
      font: this.fonts.medium,
      color: INK.bright,
      characterSpacing: 3.4,
    });
    const epoxaWidth = this.fonts.medium.widthOfTextAtSize('EPOXA', 17) + 3.4 * 5;
    first.drawText('STEEL', {
      x: MARGIN + epoxaWidth + 8,
      y: A4.height - MARGIN - 16,
      size: 17,
      font: this.fonts.medium,
      color: INK.accent,
      characterSpacing: 3.4,
    });
    first.drawText(kicker.toUpperCase(), {
      x: MARGIN,
      y: A4.height - MARGIN - 34,
      size: 7.5,
      font: this.fonts.regular,
      color: INK.muted,
      characterSpacing: 2.2,
    });
    first.drawLine({
      start: { x: MARGIN, y: A4.height - MARGIN - 48 },
      end: { x: A4.width - MARGIN, y: A4.height - MARGIN - 48 },
      thickness: 0.7,
      color: INK.rule,
    });

    this.heading(title, 22);
  }

  heading(text: string, size = 14) {
    const lines = wrap(text, this.fonts.medium, size, this.width);
    this.gap(size * 0.7);
    for (const line of lines) {
      const y = this.reserve(size * 1.24);
      this.page.drawText(line, { x: MARGIN, y, size, font: this.fonts.medium, color: INK.bright });
    }
    this.gap(size * 0.3);
  }

  label(text: string) {
    const y = this.reserve(15);
    this.page.drawText(text.toUpperCase(), {
      x: MARGIN,
      y,
      size: 7.5,
      font: this.fonts.regular,
      color: INK.accent,
      characterSpacing: 2,
    });
    this.gap(4);
  }

  body(text: string, size = 9.5) {
    for (const line of wrap(text, this.fonts.regular, size, this.width)) {
      const y = this.reserve(size * 1.62);
      this.page.drawText(line, { x: MARGIN, y, size, font: this.fonts.regular, color: INK.text });
    }
    this.gap(size * 0.5);
  }

  bullets(items: string[], size = 9.5) {
    for (const item of items) {
      const lines = wrap(item, this.fonts.regular, size, this.width - 14);
      lines.forEach((line, index) => {
        const y = this.reserve(size * 1.55);
        if (index === 0) {
          this.page.drawCircle({
            x: MARGIN + 2.5,
            y: y + size * 0.34,
            size: 1.5,
            color: INK.accent,
          });
        }
        this.page.drawText(line, {
          x: MARGIN + 14,
          y,
          size,
          font: this.fonts.regular,
          color: INK.text,
        });
      });
    }
    this.gap(size * 0.5);
  }

  /** Two-column label/value rows — the shape most of this data is in. */
  pairs(rows: [string, string][], size = 9.5) {
    const labelWidth = this.width * 0.38;
    for (const [key, value] of rows) {
      if (!value) continue;
      const valueLines = wrap(value, this.fonts.regular, size, this.width - labelWidth - 10);
      const height = Math.max(valueLines.length, 1) * size * 1.55 + 7;
      const top = this.reserve(height);

      this.page.drawText(key.toUpperCase(), {
        x: MARGIN,
        y: top + height - size * 1.4,
        size: 7.5,
        font: this.fonts.regular,
        color: INK.muted,
        characterSpacing: 1.1,
      });

      valueLines.forEach((line, index) => {
        this.page.drawText(line, {
          x: MARGIN + labelWidth,
          y: top + height - size * 1.4 - index * size * 1.55,
          size,
          font: this.fonts.regular,
          color: INK.bright,
        });
      });

      this.page.drawLine({
        start: { x: MARGIN, y: top },
        end: { x: A4.width - MARGIN, y: top },
        thickness: 0.5,
        color: INK.rule,
      });
    }
    this.gap(6);
  }

  table(columns: string[], rows: string[][], size = 8.5) {
    const columnWidth = this.width / columns.length;

    const drawHead = () => {
      const y = this.reserve(20);
      this.page.drawRectangle({
        x: MARGIN,
        y: y - 2,
        width: this.width,
        height: 20,
        color: INK.panel,
      });
      columns.forEach((column, index) => {
        this.page.drawText(
          truncate(column.toUpperCase(), this.fonts.regular, 7, columnWidth - 10),
          {
            x: MARGIN + index * columnWidth + 6,
            y: y + 5,
            size: 7,
            font: this.fonts.regular,
            color: INK.muted,
            characterSpacing: 1,
          },
        );
      });
    };

    drawHead();

    for (const row of rows) {
      // Break *before* the row, not after: reserving first and then noticing the
      // page changed drew the repeated header underneath its own first row.
      if (!this.fits(17)) {
        this.breakPage();
        drawHead();
      }
      const y = this.reserve(17);
      row.forEach((cell, index) => {
        this.page.drawText(truncate(cell, this.fonts.mono, size, columnWidth - 10), {
          x: MARGIN + index * columnWidth + 6,
          y: y + 4,
          size,
          font: this.fonts.mono,
          color: index === 0 ? INK.bright : INK.text,
        });
      });
      this.page.drawLine({
        start: { x: MARGIN, y },
        end: { x: A4.width - MARGIN, y },
        thickness: 0.4,
        color: INK.rule,
      });
    }
    this.gap(8);
  }

  finish() {
    const total = this.pages.length;
    this.pages.forEach((page, index) => {
      page.drawLine({
        start: { x: MARGIN, y: MARGIN + 26 },
        end: { x: A4.width - MARGIN, y: MARGIN + 26 },
        thickness: 0.5,
        color: INK.rule,
      });
      page.drawText(this.footer, {
        x: MARGIN,
        y: MARGIN + 13,
        size: 7,
        font: this.fonts.regular,
        color: INK.muted,
      });
      const stamp = `${index + 1} / ${total}`;
      page.drawText(stamp, {
        x: A4.width - MARGIN - this.fonts.regular.widthOfTextAtSize(stamp, 7),
        y: MARGIN + 13,
        size: 7,
        font: this.fonts.regular,
        color: INK.muted,
      });
    });
  }
}

function wrap(text: string, font: PDFFont, size: number, max: number) {
  const out: string[] = [];
  for (const paragraph of text.split('\n')) {
    let line = '';
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) > max && line) {
        out.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    out.push(line);
  }
  return out.length ? out : [''];
}

function truncate(text: string, font: PDFFont, size: number, max: number) {
  if (font.widthOfTextAtSize(text, size) <= max) return text;
  let cut = text;
  while (cut.length > 1 && font.widthOfTextAtSize(`${cut}…`, size) > max) cut = cut.slice(0, -1);
  return `${cut}…`;
}

/* -------------------------------------------------------------------------- */
/* Documents                                                                  */
/* -------------------------------------------------------------------------- */

const FOOTER = [
  siteConfig.legalName,
  `${siteConfig.address.line2}, ${siteConfig.address.city}`,
  siteConfig.contact.phone,
  siteConfig.contact.salesEmail,
  siteConfig.domain,
].join('  ·  ');

const DISCLAIMER =
  'Issued for reference. Dimensional data reflects the sizes EPOXA STEEL holds or can source and is not a substitute for structural design. Confirm all sizes, grades and tolerances against the governing standard and your engineer’s specification before ordering.';

async function newDoc() {
  const doc = await PDFDocument.create();
  doc.setAuthor(siteConfig.legalName);
  doc.setProducer(siteConfig.legalName);
  doc.setCreator(`${siteConfig.name} website`);
  doc.setCreationDate(new Date());

  const fonts: Fonts = {
    regular: await doc.embedFont(StandardFonts.Helvetica),
    medium: await doc.embedFont(StandardFonts.HelveticaBold),
    mono: await doc.embedFont(StandardFonts.Courier),
  };

  return { doc, fonts };
}

async function write(filename: string, doc: PDFDocument) {
  await writeFile(path.join(OUT, filename), await doc.save());
}

/** A product's own datasheet: everything its page states, in one document. */
async function productSheet(product: (typeof products)[number], filename: string) {
  const { doc, fonts } = await newDoc();
  const sheet = new Sheet(doc, fonts, FOOTER);

  sheet.masthead(`${product.category} · Technical datasheet`, product.name);
  sheet.body(product.summary);

  sheet.label('Overview');
  for (const paragraph of product.overview) sheet.body(paragraph);

  if (product.keyFacts.length) {
    sheet.heading('Key attributes', 12);
    sheet.pairs(product.keyFacts.map((fact) => [fact.label, fact.value] as [string, string]));
  }

  sheet.heading('Specification', 12);
  sheet.pairs([
    ['Grades supplied', product.grades.join(', ')],
    ['Standards', product.standards.join(', ')],
    ['Finishes available', product.finishes.join(', ')],
  ]);

  if (product.dimensions.rows.length) {
    sheet.heading(product.dimensions.title, 12);
    if (product.dimensions.caption) sheet.body(product.dimensions.caption, 8.5);
    sheet.table(product.dimensions.columns, product.dimensions.rows);
  }

  if (product.applications.length) {
    sheet.heading('Typical applications', 12);
    sheet.bullets(product.applications);
  }

  sheet.heading('Ordering', 12);
  sheet.body(
    `Send sizes, grades and quantities to ${siteConfig.contact.quotesEmail} or submit a request at ${siteConfig.url}/quote and we will return a line-by-line quotation within 48 hours. Every delivery is issued with mill certificates matched to heat numbers.`,
  );

  sheet.gap(8);
  sheet.body(DISCLAIMER, 7.5);

  sheet.finish();
  await write(filename, doc);
}

/** The documents that are about the company rather than one product. */
async function capabilitySheet(filename: string) {
  const { doc, fonts } = await newDoc();
  const sheet = new Sheet(doc, fonts, FOOTER);

  sheet.masthead('Capability statement', 'Fabrication & supply capability');
  sheet.body(
    `EPOXA STEEL supplies and fabricates structural steel for commercial, industrial, infrastructure and residential construction. Founded in ${siteConfig.founded}, we operate as a single accountable supplier: material, processing, finishing and delivery under one certificate.`,
  );

  sheet.label('By the numbers');
  sheet.pairs(
    siteConfig.stats.map(
      (stat) =>
        [
          stat.label,
          `${'display' in stat ? stat.display : `${stat.value.toLocaleString('en-US')}${stat.suffix}`} — ${stat.hint}`,
        ] as [string, string],
    ),
  );

  sheet.heading('Services', 12);
  sheet.pairs(services.map((service) => [service.name, service.summary] as [string, string]));

  sheet.heading('Certification', 12);
  sheet.pairs(
    certifications.map((cert) => [`${cert.code} — ${cert.name}`, cert.body] as [string, string]),
  );

  sheet.heading('Manufacturing standards', 12);
  sheet.bullets(manufacturingStandards.map((entry) => `${entry.title}: ${entry.body}`));

  sheet.gap(8);
  sheet.body(DISCLAIMER, 7.5);

  sheet.finish();
  await write(filename, doc);
}

/**
 * Which generated document backs which link.
 *
 * Product datasheets are keyed by slug. Anything not listed here is a document
 * that has to come from the drawing office — a real mill certificate, a real
 * bar-bending template — and its link is removed from the content rather than
 * pointed at an invention.
 */
const PRODUCT_SHEETS: Record<string, string> = {
  'structural-steel': 'epoxa-structural-sections.pdf',
  'steel-beams': 'epoxa-beam-properties.pdf',
  'steel-channels': 'epoxa-channel-profiles.pdf',
  'steel-angles': 'epoxa-angle-chart.pdf',
  'steel-plates': 'epoxa-plate-grades.pdf',
  'steel-sheets': 'epoxa-sheet-coil.pdf',
  'steel-tubes': 'epoxa-hollow-sections.pdf',
  'steel-pipes': 'epoxa-pipe-schedule.pdf',
  'steel-bars': 'epoxa-bar-stock.pdf',
  'reinforcing-steel': 'epoxa-rebar-guide.pdf',
  'galvanized-steel': 'epoxa-galvanizing-guide.pdf',
  'stainless-steel': 'epoxa-stainless-selector.pdf',
  'custom-fabrication': 'epoxa-fabrication-capability.pdf',
};

async function main() {
  await mkdir(OUT, { recursive: true });

  let written = 0;

  for (const product of products) {
    const filename = PRODUCT_SHEETS[product.slug];
    if (!filename) continue;

    if (filename === 'epoxa-fabrication-capability.pdf') {
      await capabilitySheet(filename);
    } else {
      await productSheet(product, filename);
    }
    written += 1;
  }

  console.log(`datasheets: wrote ${written} PDF${written === 1 ? '' : 's'} to public/downloads`);
}

await main();
