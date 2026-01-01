"use client";

import React, { useEffect, useMemo, useState } from "react";

/**
 * Faculty reviews page (client)
 * - pulls minimal faculty list from /api/faculty-list
 * - departments are derived from faculty list and used to filter the faculty dropdown
 * - on submit, email is validated to end with @gbu.ac.in (client-side)
 */

function RatingButton({ value, active, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`px-3 py-1 rounded border transition ${active ? "bg-yellow-400 text-white border-yellow-500" : "bg-white text-gray-700"}`}
    >
      {value}
    </button>
  );
}

export default function FacultyReviewsPage() {
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState(["All Departments"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [department, setDepartment] = useState("All Departments");
  const [selectedFacultyId, setSelectedFacultyId] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    teacherId: "",
    title: "",
    comment: "",
    ratings: { teaching: 5, behavior: 5, interaction: 5, improvement: 5 },
  });

  const [reviews, setReviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function loadFaculty() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/faculty-list");
        if (!res.ok) throw new Error("Failed to fetch faculty list");
        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];
        // only keep objects with name + department
        const cleaned = arr
          .map((f, i) => ({ id: f.id || `gbu-${i + 1}`, name: (f.name || "").trim(), department: (f.department || "USICT, GBU").trim() }))
          .filter((f) => f.name && f.department);
        if (!mounted) return;
        setFaculty(cleaned);
        const deptSet = new Set(cleaned.map((x) => x.department || "USICT, GBU"));
        setDepartments(["All Departments", ...Array.from(deptSet)]);
        if (cleaned.length) {
          setSelectedFacultyId(cleaned[0].id);
          setForm((s) => ({ ...s, teacherId: cleaned[0].id }));
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load faculty list. Showing fallback.");
        const fallback = [
          { id: "gbu-1", name: "Prof. (Dr.) Vivek Kumar Sehgal", department: "USICT, GBU" },
          { id: "gbu-2", name: "Prof. (Dr.) Ajay K. Singh", department: "USICT, GBU" },
        ];
        setFaculty(fallback);
        setDepartments(["All Departments", "USICT, GBU"]);
        setSelectedFacultyId(fallback[0].id);
        setForm((s) => ({ ...s, teacherId: fallback[0].id }));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadFaculty();
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    // load reviews list
    async function loadReviews() {
      try {
        const r = await fetch("/api/faculty-reviews");
        if (!r.ok) return;
        const d = await r.json();
        setReviews(Array.isArray(d) ? d : []);
      } catch (e) {
        console.warn("Could not load reviews", e);
      }
    }
    loadReviews();
  }, []);

  // filtered faculty based on department
  const visibleFaculty = useMemo(() => {
    if (!faculty.length) return [];
    if (!department || department === "All Departments") return faculty;
    return faculty.filter((f) => (f.department || "").toLowerCase() === department.toLowerCase());
  }, [faculty, department]);

  useEffect(() => {
    // when visible list changes, update selected faculty and form.teacherId
    if (visibleFaculty.length) {
      setSelectedFacultyId(visibleFaculty[0].id);
      setForm((s) => ({ ...s, teacherId: visibleFaculty[0].id }));
    } else {
      setSelectedFacultyId("");
      setForm((s) => ({ ...s, teacherId: "" }));
    }
  }, [visibleFaculty]);

  function setRating(key, value) {
    setForm((s) => ({ ...s, ratings: { ...s.ratings, [key]: value } }));
  }

  function teacherName(id) {
    return (faculty.find((f) => f.id === id) || {}).name || "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    // client-side email restriction to @gbu.ac.in
    const email = (form.email || "").trim();
    if (!email) return setMessage({ type: "error", text: "Email required." });
    if (!email.toLowerCase().endsWith("@gbu.ac.in")) return setMessage({ type: "error", text: "Please use your @gbu.ac.in email." });
    if (!form.name.trim()) return setMessage({ type: "error", text: "Full name required (original name)." });
    if (!form.teacherId) return setMessage({ type: "error", text: "Select a faculty to review." });

    setSubmitting(true);
    try {
      const overall = Math.round(((form.ratings.teaching + form.ratings.behavior + form.ratings.interaction + form.ratings.improvement) / 4) * 10) / 10;
      const payload = { ...form, overall, date: new Date().toISOString() };

      const res = await fetch("/api/faculty-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setMessage({ type: "error", text: (json && (json.message || json.error)) || "submit_failed" });
      } else {
        setMessage({ type: "success", text: "Review submitted. Thanks!" });
        setForm((s) => ({ ...s, title: "", comment: "" }));
        // reload reviews
        const rr = await fetch("/api/faculty-reviews");
        const rdata = await rr.json().catch(() => []);
        setReviews(Array.isArray(rdata) ? rdata : []);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Network error while submitting." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Faculty Reviews (GBU)</h1>
        <p className="text-gray-600 mb-6">Select department to view faculty, then submit reviews. Only <strong>@gbu.ac.in</strong> emails allowed.</p>

        <div className="bg-white p-4 rounded shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block mb-1 font-medium">Department</label>
              <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full border rounded px-3 py-2">
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">Faculty</label>
              <div className="flex gap-3">
                <select className="flex-1 border rounded px-3 py-2" value={selectedFacultyId} onChange={(e) => { setSelectedFacultyId(e.target.value); setForm(s => ({ ...s, teacherId: e.target.value })); }}>
                  {loading ? <option>Loading…</option> : visibleFaculty.length === 0 ? <option>No faculty found</option> : visibleFaculty.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
                <a className="inline-flex items-center px-4 py-2 border rounded bg-blue-50 text-blue-700" href="#" onClick={(e) => e.preventDefault()}>View Profile</a>
              </div>
              {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-3">Write a review for {teacherName(selectedFacultyId)}</h2>

          {message && <div className={`mb-4 p-3 rounded ${message.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{message.text}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="border rounded px-3 py-2" placeholder="Full name (original name required)" value={form.name} onChange={(e) => setForm(s => ({ ...s, name: e.target.value }))} required />
              <input className="border rounded px-3 py-2" placeholder="Email (@gbu.ac.in)" value={form.email} onChange={(e) => setForm(s => ({ ...s, email: e.target.value }))} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { k: "teaching", label: "Teaching" },
                { k: "behavior", label: "Behavior" },
                { k: "interaction", label: "Interaction" },
                { k: "improvement", label: "Improvement" },
              ].map((asp) => (
                <div key={asp.k} className="p-3 border rounded">
                  <div className="text-sm font-medium mb-2">{asp.label}</div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <RatingButton key={v} value={v} active={form.ratings[asp.k] >= v} onClick={(val) => setForm(s => ({ ...s, ratings: { ...s.ratings, [asp.k]: val } }))} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <input className="w-full border rounded px-3 py-2" placeholder="Short title (optional)" value={form.title} onChange={(e) => setForm(s => ({ ...s, title: e.target.value }))} />
            <textarea className="w-full border rounded px-3 py-2 min-h-[120px]" placeholder="Write your detailed review..." value={form.comment} onChange={(e) => setForm(s => ({ ...s, comment: e.target.value }))} />

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Overall: <strong>{Math.round(((form.ratings.teaching + form.ratings.behavior + form.ratings.interaction + form.ratings.improvement) / 4) * 10) / 10}/5</strong></div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setForm({ ...form, title: "", comment: "", ratings: { teaching: 5, behavior: 5, interaction: 5, improvement: 5 } })} className="px-4 py-2 rounded border">Reset</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 rounded bg-blue-600 text-white">{submitting ? "Submitting..." : "Submit Review"}</button>
              </div>
            </div>
          </form>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Recent Faculty Reviews</h3>
          {reviews.length === 0 ? <div className="text-sm text-gray-600">No reviews yet — be the first to review a faculty!</div> : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r._id || `${r.teacherId}-${r.date}`} className="bg-white p-4 rounded shadow">
                  <div className="flex justify-between">
                    <div>
                      <div className="text-sm text-gray-600">{(faculty.find(f => f.id === r.teacherId) || {}).name || r.teacherId}</div>
                      <div className="text-base font-semibold">{r.title || "Faculty review"}</div>
                      <div className="text-xs text-gray-500">By {r.name} • {new Date(r.date).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">Overall</div>
                      <div className="text-lg font-bold">{r.overall ?? "-"}/5</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-sm">
                    <div><div className="text-gray-500">Teaching</div><strong>{r.ratings?.teaching ?? "-"}</strong></div>
                    <div><div className="text-gray-500">Behavior</div><strong>{r.ratings?.behavior ?? "-"}</strong></div>
                    <div><div className="text-gray-500">Interaction</div><strong>{r.ratings?.interaction ?? "-"}</strong></div>
                    <div><div className="text-gray-500">Improvement</div><strong>{r.ratings?.improvement ?? "-"}</strong></div>
                  </div>
                  {r.comment && <div className="mt-3 text-sm text-gray-700">{r.comment}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
