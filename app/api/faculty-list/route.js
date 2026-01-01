// app/api/faculty-list/route.js
import * as cheerio from "cheerio";

/**
 * Scrape GBU USICT faculty page and return cleaned list:
 * - Strict name heuristics
 * - Map department headings to canonical GBU departments
 * - Cache results for CACHE_TTL
 */

const GBU_URL = "https://www.gbu.ac.in/USICT/faculty.html";
const CACHE_TTL = 1000 * 60 * 60 * 6; // 6 hours
let CACHE = { ts: 0, data: null };

const GBU_DEPARTMENTS = [
  "USICT, GBU",
  "Computer Science",
  "Information Technology",
  "Electronics & Communication",
  "Civil Engineering",
  "Mechanical Engineering",
  "Biotechnology",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Management",
  "Law",
  "Architecture",
  "Pharmacy",
  "Design",
  // add more if you find in site
];

function clean(s = "") {
  return String(s).replace(/\s+/g, " ").trim();
}
function makeId(name, idx) {
  const base = (name || `gbu-${idx}`).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return base || `gbu-${idx}`;
}

function guessDepartment(text) {
  if (!text) return null;
  const t = text.toLowerCase();
  // try to match any canonical dept by fuzzy contains
  for (const d of GBU_DEPARTMENTS) {
    const dd = d.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (t.includes(dd) || dd.split(" ")[0] && t.includes(dd.split(" ")[0])) return d;
  }
  // fallback patterns
  const m = text.match(/(Department of [A-Za-z &\-]+|Dept\.? of [A-Za-z &\-]+|School of [A-Za-z &\-]+)/i);
  return m ? clean(m[0]) : null;
}

function looksLikeName(text) {
  if (!text) return false;
  const s = clean(text);
  if (s.length < 3 || s.length > 70) return false;
  // reject phrases that look like addresses or site navigation or long lists
  const bad = [/gmail\.com/i, /@/, /http/i, /copyright/i, /contact/i, /phone/i, /address/i, /students/i, /admissions/i, /useful links/i];
  for (const r of bad) if (r.test(s)) return false;
  // require 2+ words, and at least one capitalized word or honorific
  const words = s.split(/\s+/).filter(Boolean);
  if (words.length < 2) return false;
  if (!/[A-Z][a-z]/.test(s) && !/\b(Prof|Dr|Mr|Mrs|Ms)\b/i.test(s)) return false;
  // avoid purely numeric or long-comma sequences
  if (/^\d/.test(s)) return false;
  return true;
}

export async function GET() {
  try {
    if (CACHE.data && Date.now() - CACHE.ts < CACHE_TTL) {
      return new Response(JSON.stringify(CACHE.data), { headers: { "Content-Type": "application/json" } });
    }

    const res = await fetch(GBU_URL, { cache: "no-store", headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) throw new Error("Failed to fetch GBU page: " + res.status);
    const html = await res.text();
    const $ = cheerio.load(html);

    // gather block elements to walk with contextual headings
    const blocks = [];
    $("body")
      .find("section, div, article, header, p, h1, h2, h3, h4, li")
      .each((i, el) => blocks.push(el));

    const out = [];
    let currentDept = "USICT, GBU";
    const seen = new Set();
    let idx = 0;

    for (let i = 0; i < blocks.length; i++) {
      const el = blocks[i];
      const $el = $(el);
      const text = clean($el.text());

      // update department if heading-like content matches a department
      const possibleDept = guessDepartment(text);
      if (possibleDept) {
        currentDept = possibleDept;
        continue;
      }

      // if tag is heading or contains strong name text, try to extract names
      const tag = (el.tagName || "").toLowerCase();
      if (/^h[1-5]$/.test(tag) || $el.hasClass("vc_custom_heading") || $el.find("strong, b").length) {
        const candidate = clean($el.text());
        if (looksLikeName(candidate) && !seen.has(candidate.toLowerCase())) {
          idx++;
          seen.add(candidate.toLowerCase());

          // look ahead for designation, profile link, photo
          let designation = "";
          let profile = "";
          let photo = "";
          for (let j = i + 1; j <= i + 5 && j < blocks.length; j++) {
            const nx = $(blocks[j]);
            const nxText = clean(nx.text());
            if (!designation && nxText && nxText.length < 160 && /Professor|Associate|Assistant|Lecturer|Dean|Coordinator|Head|PhD|Ph\.D|M\.Tech|B\.Tech|Faculty/i.test(nxText)) {
              designation = nxText;
            }
            // link
            const a = nx.find("a[href]").first();
            if (a && a.attr("href")) {
              const href = a.attr("href");
              profile = href.startsWith("http") ? href : new URL(href, GBU_URL).toString();
            }
            const img = nx.find("img").first();
            if (img && img.attr("src")) {
              const src = img.attr("src");
              photo = src.startsWith("http") ? src : new URL(src, GBU_URL).toString();
            }
            if (designation && profile && photo) break;
          }

          out.push({
            id: makeId(candidate, idx),
            name: candidate,
            designation: designation || "",
            department: currentDept || "USICT, GBU",
            profile: profile || "",
            photo: photo || null,
          });
        }
      } else {
        // fallback: check for single-line strong or anchor that looks like a name
        const strong = $el.find("strong, b, a").first();
        if (strong && looksLikeName(strong.text())) {
          const candidate = clean(strong.text());
          if (!seen.has(candidate.toLowerCase())) {
            idx++;
            seen.add(candidate.toLowerCase());
            out.push({
              id: makeId(candidate, idx),
              name: candidate,
              designation: "",
              department: currentDept || "USICT, GBU",
              profile: "",
              photo: null,
            });
          }
        }
      }
    }

    // final dedupe & ensure department is canonical where possible
    const final = [];
    const namesSeen = new Set();
    for (const f of out) {
      const nameKey = (f.name || "").toLowerCase().trim();
      if (!nameKey || namesSeen.has(nameKey)) continue;
      namesSeen.add(nameKey);
      // normalize department to known name where fuzzy match possible
      let dept = f.department || "USICT, GBU";
      const matched = GBU_DEPARTMENTS.find((d) => dept.toLowerCase().includes(d.toLowerCase().split(" ")[0]));
      if (matched) dept = matched;
      final.push({
        id: f.id,
        name: f.name,
        designation: f.designation || "",
        department: dept,
        profile: f.profile || "",
        photo: f.photo || null,
      });
    }

    // if we ended up empty (rare), return a small fallback list to keep UI working
    const fallback = [
      { id: "gbu-1", name: "Prof. (Dr.) Vivek Kumar Sehgal", designation: "Professor & Dean", department: "USICT, GBU", profile: GBU_URL, photo: null },
      { id: "gbu-2", name: "Prof. (Dr.) Ajay K. Singh", designation: "Professor", department: "USICT, GBU", profile: GBU_URL, photo: null },
    ];

    const result = final.length ? final : fallback;

    CACHE = { ts: Date.now(), data: result };
    return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("faculty-list scrape error:", err);
    if (CACHE.data) return new Response(JSON.stringify(CACHE.data), { headers: { "Content-Type": "application/json" } });
    const fallback = [
      { id: "gbu-1", name: "Prof. (Dr.) Vivek Kumar Sehgal", designation: "Professor & Dean", department: "USICT, GBU", profile: GBU_URL, photo: null },
      { id: "gbu-2", name: "Prof. (Dr.) Ajay K. Singh", designation: "Professor", department: "USICT, GBU", profile: GBU_URL, photo: null },
    ];
    CACHE = { ts: Date.now(), data: fallback };
    return new Response(JSON.stringify(fallback), { headers: { "Content-Type": "application/json" } });
  }
}
