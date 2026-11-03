import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const source = fileURLToPath(new URL('./chapter-one-opencampus.html', import.meta.url))
const destination = fileURLToPath(new URL('./chapter-one-opencampus.pdf', import.meta.url))
const html = readFileSync(source, 'utf8')
const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1]

if (!body) throw new Error('Could not locate the chapter body')

function textContent(value) {
  return value
    .replace(/<br\s*\/?\s*>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/\s+/g, ' ')
    .trim()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[^\x20-\x7e]/g, ' ')
}

function escapePdf(value) {
  return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
}

const pages = [[]]
let y = 770
const left = 85
const maxChars = 89

function newPage() {
  pages.push([])
  y = 770
}

function addLine(value, { bold = false, centered = false, indent = 0 } = {}) {
  if (y < 65) newPage()
  const estimatedWidth = value.length * 5.6
  const x = centered ? (595 - estimatedWidth) / 2 : left + indent
  pages.at(-1).push(`BT /${bold ? 'F2' : 'F1'} 12 Tf 1 0 0 1 ${x.toFixed(2)} ${y} Tm (${escapePdf(value)}) Tj ET`)
  y -= 17
}

function addBlock(value, kind, number) {
  if (kind === 'heading') y -= 6
  if (kind === 'title') y -= 2
  const bold = kind === 'heading' || kind === 'title' || kind === 'chapter'
  const centered = kind === 'chapter' || kind === 'title'
  const prefix = kind === 'list' ? `${number}. ` : ''
  const words = `${prefix}${textContent(value)}`.split(' ')
  let line = ''

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (line && candidate.length > maxChars) {
      addLine(line, { bold, centered, indent: kind === 'list' ? 12 : 0 })
      line = word
    } else {
      line = candidate
    }
  }
  if (line) addLine(line, { bold, centered, indent: kind === 'list' ? 12 : 0 })
  y -= kind === 'heading' ? 2 : 7
}

const blockPattern = /<(h1|h2|p|ol)\b([^>]*)>([\s\S]*?)<\/\1>/gi
for (const [, tag, attributes, content] of body.matchAll(blockPattern)) {
  if (tag.toLowerCase() === 'ol') {
    const items = [...content.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)]
    items.forEach(([, item], index) => addBlock(item, 'list', index + 1))
  } else if (tag.toLowerCase() === 'h1') {
    addBlock(content, 'chapter')
  } else if (tag.toLowerCase() === 'h2') {
    addBlock(content, 'heading')
  } else {
    addBlock(content, /class="[^"]*chapter-title/.test(attributes) ? 'title' : 'paragraph')
  }
}

const objects = []
const pageRefs = pages.map((_, index) => `${3 + index * 2} 0 R`).join(' ')
objects.push('<< /Type /Catalog /Pages 2 0 R >>')
objects.push(`<< /Type /Pages /Kids [${pageRefs}] /Count ${pages.length} >>`)
pages.forEach((lines, index) => {
  const pageRef = 3 + index * 2
  const contentRef = pageRef + 1
  const stream = lines.join('\n')
  objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${3 + pages.length * 2} 0 R /F2 ${4 + pages.length * 2} 0 R >> >> /Contents ${contentRef} 0 R >>`)
  objects.push(`<< /Length ${Buffer.byteLength(stream, 'ascii')} >>\nstream\n${stream}\nendstream`)
})
objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman /Encoding /WinAnsiEncoding >>')
objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold /Encoding /WinAnsiEncoding >>')

let pdf = '%PDF-1.4\n'
const offsets = [0]
objects.forEach((object, index) => {
  offsets.push(Buffer.byteLength(pdf, 'ascii'))
  pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
})
const xrefOffset = Buffer.byteLength(pdf, 'ascii')
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
offsets.slice(1).forEach(offset => { pdf += `${String(offset).padStart(10, '0')} 00000 n \n` })
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`
writeFileSync(destination, Buffer.from(pdf, 'ascii'))
console.log(`Created ${destination} (${pages.length} pages)`)