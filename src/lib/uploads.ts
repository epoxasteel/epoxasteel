/**
 * What may be attached to a quote request, and how we check it.
 *
 * ## The threat, stated plainly
 *
 * An upload field on a public form is an invitation to hand the server a file of
 * the attacker's choosing. Three things make that survivable here, and it is worth
 * being precise about which does what:
 *
 *   **Nothing is ever written to disk or served back.** An attachment goes from the
 *   request body straight into an email and is then garbage. There is no URL that
 *   returns it, no directory it can escape into, and no path derived from a name the
 *   sender chose. Most upload vulnerabilities need one of those three, and this
 *   design has none of them.
 *
 *   **An allowlist, checked twice.** The declared MIME type and the extension both
 *   have to be recognised. A denylist of dangerous extensions is the classic wrong
 *   answer — it is a list of everything anyone has thought of so far.
 *
 *   **Magic bytes.** A browser will happily report `application/pdf` for a file
 *   called `drawing.pdf` that is really a Windows executable, because it mostly
 *   trusts the extension too. So for the formats that have a signature we read the
 *   first few bytes and check. This is what stops a renamed binary.
 *
 * ## What this is not
 *
 * It is not an antivirus. A genuinely malicious PDF is a well-formed PDF, and no
 * amount of header checking finds it — that needs a scanning service, which is a
 * paid dependency and a decision for the business, not a default. What the design
 * above buys is that a malicious file cannot execute *here*: it is never run, never
 * stored, never served. It travels to a mailbox, where the mail provider's own
 * scanner is the layer that examines its contents. That is the right division of
 * labour, and the README says so under its pre-launch notes.
 */

/** 10 MB unless `UPLOAD_MAX_MB` says otherwise. Server-authoritative. */
export const DEFAULT_MAX_MB = 10;

/** Beyond this the request is refused outright — one enquiry, not a bulk transfer. */
export const MAX_FILES = 5;

export function uploadMaxBytes() {
  const configured = Number(process.env.UPLOAD_MAX_MB);
  const mb = Number.isFinite(configured) && configured > 0 ? configured : DEFAULT_MAX_MB;
  return Math.round(mb * 1024 * 1024);
}

/**
 * Accepted formats.
 *
 * MIME types are listed generously because browsers disagree — a `.dwg` arrives as
 * `image/vnd.dwg`, `application/acad`, `application/octet-stream` or nothing at all
 * depending on the operating system. The extension list is what actually decides;
 * the MIME list exists so a correctly-labelled file is never turned away.
 */
export const ALLOWED_EXTENSIONS = [
  'pdf',
  'dwg',
  'dxf',
  'xlsx',
  'xls',
  'doc',
  'docx',
  'zip',
  'png',
  'jpg',
  'jpeg',
  'webp',
] as const;

export const ALLOWED_MIME = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/zip',
  'application/x-zip-compressed',
  'image/vnd.dwg',
  'application/acad',
  'image/x-dwg',
  'application/dxf',
  'image/vnd.dxf',
  // Windows reports this for CAD files it has no association for.
  'application/octet-stream',
] as const;

export const ACCEPT_ATTRIBUTE = ALLOWED_EXTENSIONS.map((extension) => `.${extension}`).join(',');

/** The one sentence the visitor reads. Kept in step with the limit above. */
export function acceptLabel(maxBytes = uploadMaxBytes()) {
  return `PDF, DWG, DXF, XLSX, DOCX, ZIP or images — up to ${Math.round(maxBytes / (1024 * 1024))} MB each`;
}

export function extensionOf(filename: string) {
  const parts = filename.toLowerCase().split('.');
  return parts.length > 1 ? (parts.pop() ?? '') : '';
}

/**
 * Signatures for the formats that have one.
 *
 * `dxf` is deliberately absent: it is plain text with no header, so there is
 * nothing to check and pretending otherwise would reject valid drawings. `doc`
 * and `xls` share the OLE2 signature, and the modern `docx`/`xlsx` are ZIP
 * containers — hence the shared entries.
 */
const SIGNATURES: Record<string, number[][]> = {
  pdf: [[0x25, 0x50, 0x44, 0x46]], // %PDF
  png: [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  jpg: [[0xff, 0xd8, 0xff]],
  jpeg: [[0xff, 0xd8, 0xff]],
  webp: [[0x52, 0x49, 0x46, 0x46]], // RIFF; WEBP follows at offset 8
  zip: [
    [0x50, 0x4b, 0x03, 0x04],
    [0x50, 0x4b, 0x05, 0x06], // empty archive
    [0x50, 0x4b, 0x07, 0x08], // spanned
  ],
  xlsx: [[0x50, 0x4b, 0x03, 0x04]],
  docx: [[0x50, 0x4b, 0x03, 0x04]],
  doc: [[0xd0, 0xcf, 0x11, 0xe0]], // OLE2 compound document
  xls: [[0xd0, 0xcf, 0x11, 0xe0]],
  dwg: [[0x41, 0x43, 0x31, 0x30]], // "AC10" — every AutoCAD release since R13
};

function signatureMatches(extension: string, head: Uint8Array) {
  const candidates = SIGNATURES[extension];
  // No known signature for this format: the allowlist and the size cap are the
  // controls, and claiming otherwise would be theatre.
  if (!candidates) return true;

  return candidates.some((signature) => signature.every((byte, index) => head[index] === byte));
}

export type UploadCheck = { ok: true } | { ok: false; message: string };

/**
 * Validates one uploaded file. Server-side; the client mirrors the cheap checks so
 * a mistake is caught before a 10 MB round trip, but this is the one that counts.
 *
 * Every message here is written to be read by a customer, because these are the
 * only upload errors that reach one.
 */
export async function checkUpload(file: File, maxBytes = uploadMaxBytes()): Promise<UploadCheck> {
  if (file.size === 0) {
    return { ok: false, message: `“${file.name}” is empty. Please check the file and try again.` };
  }

  if (file.size > maxBytes) {
    const limit = Math.round(maxBytes / (1024 * 1024));
    return { ok: false, message: `“${file.name}” is larger than the ${limit} MB limit.` };
  }

  const extension = extensionOf(file.name);
  if (!(ALLOWED_EXTENSIONS as readonly string[]).includes(extension)) {
    return {
      ok: false,
      message: `We cannot accept “${file.name}”. Please attach a PDF, drawing, spreadsheet or image.`,
    };
  }

  if (file.type && !(ALLOWED_MIME as readonly string[]).includes(file.type)) {
    return {
      ok: false,
      message: `We cannot accept “${file.name}”. Please attach a PDF, drawing, spreadsheet or image.`,
    };
  }

  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  if (!signatureMatches(extension, head)) {
    // Deliberately does not say "we detected a mismatched file signature". Somebody
    // exporting from an unusual tool should be told what to do, not accused.
    return {
      ok: false,
      message: `“${file.name}” does not look like a valid ${extension.toUpperCase()} file. Please re-export it, or send it in a ZIP.`,
    };
  }

  return { ok: true };
}
