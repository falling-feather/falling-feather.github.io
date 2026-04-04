import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function isPostHtml(filePath) {
  const rel = path.relative(root, filePath).replace(/\\/g, '/');
  return /^\d{4}\/\d{2}\/\d{2}\/[^/]+\/index\.html$/.test(rel);
}

function walk(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '.git' || entry.name === 'node_modules') {
        continue;
      }
      walk(full, out);
      continue;
    }
    if (entry.isFile() && entry.name === 'index.html' && isPostHtml(full)) {
      out.push(full);
    }
  }
  return out;
}

function stripHtml(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<pre[\s\S]*?<\/pre>/gi, ' ')
    .replace(/<code[\s\S]*?<\/code>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function countWords(text) {
  const han = (text.match(/[\p{Script=Han}]/gu) || []).length;
  const latinWords = (text.match(/[A-Za-z0-9_]+/g) || []).length;
  return han + latinWords;
}

function formatWords(n) {
  if (n >= 1000) {
    const k = (n / 1000).toFixed(1).replace(/\.0$/, '');
    return `${k}k 字`;
  }
  return `${n} 字`;
}

function calcReadMinutes(words) {
  const speed = 120;
  return Math.max(1, Math.ceil(words / speed));
}

function extractMainBody(html) {
  const m = html.match(/<div class="markdown-body">([\s\S]*?)<\/div>/i);
  return m ? m[1] : '';
}

function fillIfEmpty(html, iconClass, valueText) {
  const blockRe = new RegExp(
    `<span class="post-meta mr-2">\\s*<i class="iconfont ${iconClass}"><\\/i>([\\s\\S]*?)<\\/span>`,
    'i'
  );
  const m = html.match(blockRe);
  if (!m) {
    return { html, changed: false };
  }

  const rawInner = m[1];
  const innerText = rawInner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  if (innerText.length > 0) {
    return { html, changed: false };
  }

  const replacement = `<span class="post-meta mr-2">\n        <i class="iconfont ${iconClass}"></i>\n        \n          ${valueText}\n        \n      </span>`;
  return {
    html: html.replace(blockRe, replacement),
    changed: true
  };
}

function processFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const bodyHtml = extractMainBody(original);
  if (!bodyHtml) {
    return { updated: false, reason: 'no-body' };
  }

  const plain = stripHtml(bodyHtml);
  const words = Math.max(1, countWords(plain));
  const readMins = calcReadMinutes(words);

  let next = original;
  let changed = false;

  const c1 = fillIfEmpty(next, 'icon-chart', formatWords(words));
  next = c1.html;
  changed = changed || c1.changed;

  const c2 = fillIfEmpty(next, 'icon-clock-fill', `${readMins} 分钟`);
  next = c2.html;
  changed = changed || c2.changed;

  if (changed) {
    fs.writeFileSync(filePath, next, 'utf8');
  }

  return { updated: changed, words, readMins };
}

const targets = walk(root);
let touched = 0;
for (const file of targets) {
  const res = processFile(file);
  if (res.updated) {
    touched += 1;
    const rel = path.relative(root, file).replace(/\\/g, '/');
    console.log(`updated: ${rel} -> ${formatWords(res.words)}, ${res.readMins} 分钟`);
  }
}

console.log(`done: ${touched} file(s) updated`);
