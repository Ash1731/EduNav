// app/api/faculty-list/route.js
import * as cheerio from "cheerio";

/**
 * Simple scraper for: https://www.gbu.ac.in/USICT/faculty.html
 * Returns a clean array: [{ id, name, department }]
 *
 * Caching used to limit requests (6 hours)
 */

const SOURCE_URL = "https://www.gbu.ac.in/USICT/faculty.html";
const CACHE_TTL = 1000 * 60 * 60 * 6; // 6 hours
let CACHE = { ts: 0, data: null };

function clean(s = "") {
  return String(s || "").replace(/\s+/g, " ").trim();
}
function makeId(name, idx) {
  const base = (name || `gbu-${idx}`).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return base || `gbu-${idx}`;
}
function looksLikeName(s) {
  if (!s) return false;
  const t = clean(s);
  if (t.length < 3 || t.length > 80) return false;
  if (/\b(Gautam|Opp\.|Phone|http|mailto:|Copyright|Address|Admissions|Students)\b/i.test(t)) return false;
  const words = t.split(/\s+/).filter(Boolean);
  if (words.length < 2) return false;
  if (!/[A-Z][a-z]/.test(t) && !/\b(Prof|Dr|Mr|Mrs|Ms)\b/i.test(t)) return false;
  return true;
}

export async function GET() {
  try {
    // serve cache if fresh
    if (CACHE.data && Date.now() - CACHE.ts < CACHE_TTL) {
      return new Response(JSON.stringify(CACHE.data), { headers: { "Content-Type": "application/json" } });
    }

    const res = await fetch(SOURCE_URL, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) throw new Error("Failed to fetch source page: " + res.status);
    const html = await res.text();
    const $ = cheerio.load(html);

    // heuristic: look for elements that likely contain name + dept
    // We'll scan headings and nearby text.
    const candidates = [];
    let idx = 0;

    // Most faculty lists put names in <h2>, <h3>, <strong> or anchor tags inside list rows. We'll scan common tags.
    const selectors = ["h1", "h2", "h3", "h4", "strong", "b", "li", "p", "td"];
    const seen = new Set();

    selectors.forEach((sel) => {
      $(sel).each((i, el) => {
        const text = clean($(el).text());
        if (!text) return;
        // split potential lines by newline/—/– if site concatenates name and dept
        const parts = text.split(/\n|—|–|, Dept|, Department|Dept\./).map(clean).filter(Boolean);
        // try each part: if looks like name, find department by looking at nearby nodes
        parts.forEach((part) => {
          if (!looksLikeName(part)) return;
          const name = part;
          // attempt to find department: look in siblings / parent / following elements
          let dept = "USICT, GBU";
          // check sibling text
          const parent = $(el).parent();
          const siblingText = clean(parent.text() || "");
          // detect phrases like 'Department of ...' or known department keywords
          const deptMatch = siblingText.match(/(Computer Science|Information Technology|Electronics|Civil|Mechanical|Biotechnology|Mathematics|Physics|Chemistry|Management|Law|Architecture|Pharmacy|Design)/i);
          if (deptMatch) dept = deptMatch[0].trim();
          // fallback: search following nodes for 'Department' words in a small window
          if (dept === "USICT, GBU") {
            let walker = parent.next();
            for (let k = 0; k < 4 && walker && walker.length; k++) {
              const t = clean(walker.text());
              const m = t.match(/(Computer Science|Information Technology|Electronics|Civil|Mechanical|Biotechnology|Mathematics|Physics|Chemistry|Management|Law|Architecture|Pharmacy|Design)/i);
              if (m) {
                dept = m[0].trim();
                break;
              }
              walker = walker.next();
            }
          }

          const key = (name + "|" + dept).toLowerCase();
          if (seen.has(key)) return;
          seen.add(key);
          idx++;
          candidates.push({ id: makeId(name, idx), name, department: dept });
        });
      });
    });

    // As a last resort, look for table rows that contain two columns (name + dept)
    if (candidates.length === 0) {
      $("tr").each((i, tr) => {
        const cols = $(tr).find("td");
        if (cols.length >= 2) {
          const nameText = clean($(cols[0]).text());
          const deptText = clean($(cols[1]).text());
          if (looksLikeName(nameText)) {
            idx++;
            const dept = deptText || "USICT, GBU";
            const key = (nameText + "|" + dept).toLowerCase();
            if (!seen.has(key)) {
              seen.add(key);
              candidates.push({ id: makeId(nameText, idx), name: nameText, department: dept });
            }
          }
        }
      });
    }

    // final dedupe and minimal normalization
    const final = [];
    const nameSeen = new Set();
    candidates.forEach((c) => {
      const n = clean(c.name);
      if (!n || nameSeen.has(n.toLowerCase())) return;
      nameSeen.add(n.toLowerCase());
      const dept = c.department ? clean(c.department).replace(/\s{2,}/g, " ") : "USICT, GBU";
      final.push({ id: c.id, name: n, department: dept });
    });

    // fallback if empty
    const fallback = [
      { id: "gbu-1", name: "Prof. (Dr.) Vivek Kumar Sehgal", department: "USICT, GBU" },
      { id: "gbu-2", name: "Prof. (Dr.) Ajay K. Singh", department: "USICT, GBU" },
    ];

    const out = final.length ? final : fallback;

    CACHE = { ts: Date.now(), data: out };
    return new Response(JSON.stringify(out), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("faculty-list error", err);
    if (CACHE.data) return new Response(JSON.stringify(CACHE.data), { headers: { "Content-Type": "application/json" } });
    const fallback = [
      { id: "gbu-1", name: "Prof. (Dr.) Vivek Kumar Sehgal", department: "USICT, GBU" },
      { id: "gbu-2", name: "Prof. (Dr.) Ajay K. Singh", department: "USICT, GBU" },
    ];
    return new Response(JSON.stringify(fallback), { headers: { "Content-Type": "application/json" } });
  }
}
