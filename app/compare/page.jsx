// app/compare/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash, Eye, Download, Columns, Link as LinkIcon } from "lucide-react";

export default function ComparePage() {
  const router = useRouter();
  const COMPARE_KEY = "compareList";

  const [compareList, setCompareList] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [highlightDifferences, setHighlightDifferences] = useState(true);
  const [copied, setCopied] = useState(false);

  // LOCAL DEMO DATA (Replace when backend ready)
  const allColleges = [
    {
      id: "1",
      name: "SRM Institute of Science and Technology",
      location: "Chennai, Tamil Nadu",
      rating: 4.2,
      reviews: 1250,
      fees: "₹2.5L - 15L",
      placement: 85,
      courses: ["Engineering", "Management", "Medicine"],
      type: "Private",
      image: "/modern-college-campus.jpg",
      university: "GBU",
    },
    {
      id: "2",
      name: "VIT University",
      location: "Vellore, Tamil Nadu",
      rating: 4.1,
      reviews: 980,
      fees: "₹1.8L - 12L",
      placement: 82,
      courses: ["Engineering", "Design", "Law"],
      type: "Private",
      image: "/college-library-interior.jpg",
      university: "VIT",
    },
    {
      id: "3",
      name: "Manipal Institute of Technology",
      location: "Manipal, Karnataka",
      rating: 4.0,
      reviews: 750,
      fees: "₹3.2L - 18L",
      placement: 78,
      courses: ["Engineering", "Architecture", "Pharmacy"],
      type: "Private",
      image: "/engineering-laboratory.jpg",
      university: "MIT",
    },
    {
      id: "4",
      name: "Amity University",
      location: "Noida, Uttar Pradesh",
      rating: 3.8,
      reviews: 650,
      fees: "₹2.8L - 16L",
      placement: 75,
      courses: ["Engineering", "Business", "Arts"],
      type: "Private",
      image: "/college-hostel-building.jpg",
      university: "Amity",
    },
  ];

  // Load compare list
  useEffect(() => {
    try {
      const ids = JSON.parse(localStorage.getItem(COMPARE_KEY) || "[]");
      setCompareList(Array.isArray(ids) ? ids : []);
    } catch {
      setCompareList([]);
    }
  }, []);

  // Fetch colleges matching compareList
  useEffect(() => {
    if (!compareList || compareList.length === 0) {
      setColleges([]);
      return;
    }
    setLoading(true);
    const docs = compareList.map((id) => allColleges.find((c) => c.id === id)).filter(Boolean);
    setColleges(docs);
    setLoading(false);
  }, [compareList]);

  // Remove from compare
  function removeFromCompare(id) {
    const updated = compareList.filter((x) => x !== id);
    localStorage.setItem(COMPARE_KEY, JSON.stringify(updated));
    setCompareList(updated);
  }

  // Differences highlighter
  const differing = useMemo(() => {
    if (!colleges || colleges.length <= 1) return {};
    const keys = ["location", "university", "fees", "placement", "courses", "type"];
    const diff = {};
    keys.forEach((key) => {
      const values = colleges.map((c) => (key === "courses" ? (c.courses || []).join(", ") : c[key]));
      diff[key] = new Set(values).size > 1;
    });
    return diff;
  }, [colleges]);

  // Compute best pick among compared colleges
  const bestPick = useMemo(() => {
    if (!colleges || colleges.length === 0) return null;
    // score = 0.5 * placement(normalized) + 0.4 * rating(normalized) + 0.1 * reviews(normalized)
    const maxPlacement = Math.max(...colleges.map((c) => c.placement || 0), 1);
    const maxRating = 5; // rating out of 5
    const maxReviews = Math.max(...colleges.map((c) => c.reviews || 0), 1);

    const scored = colleges.map((c) => {
      const placementScore = (c.placement || 0) / maxPlacement;
      const ratingScore = (c.rating || 0) / maxRating;
      const reviewsScore = (c.reviews || 0) / maxReviews;
      const total = 0.5 * placementScore + 0.4 * ratingScore + 0.1 * reviewsScore;
      return { college: c, total };
    });

    scored.sort((a, b) => b.total - a.total);
    return scored[0] || null;
  }, [colleges]);

  // CSV export
  function exportCSV() {
    if (!colleges.length) return;
    const headers = ["Name", "Location", "Fees", "Placement", "Rating", "Reviews", "Courses", "Type"];
    const csvLines = [headers.join(",")];
    colleges.forEach((c) => {
      const row = [c.name, c.location, c.fees, c.placement, c.rating, c.reviews, (c.courses || []).join(" | "), c.type];
      csvLines.push(row.map((v) => `"${v}"`).join(","));
    });
    const csv = csvLines.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "compare-data.csv";
    a.click();
  }

  // Share link
  function shareLink() {
    const link = `${window.location.origin}/compare?ids=${compareList.join(",")}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Compare Colleges ({colleges.length})</h1>
          <div className="flex gap-3">
            <Button
              onClick={() => {
                localStorage.removeItem(COMPARE_KEY);
                setCompareList([]);
                setColleges([]);
              }}
            >
              <Trash className="mr-2" /> Clear Compare
            </Button>
            <Button variant="outline" onClick={() => router.push("/search")}>
              Back to Search
            </Button>
          </div>
        </div>

        {/* Tools */}
        <div className="flex gap-3 flex-wrap">
          <Button variant="ghost" onClick={() => setHighlightDifferences(!highlightDifferences)}>
            <Columns className="mr-2" />
            {highlightDifferences ? "Hide Differences" : "Highlight Differences"}
          </Button>

          <Button variant="outline" onClick={exportCSV}>
            <Download className="mr-2" /> Export CSV
          </Button>

          <Button variant="outline" onClick={shareLink}>
            <LinkIcon className="mr-2" /> {copied ? "Link Copied" : "Share Link"}
          </Button>
        </div>

        {/* Best Pick section */}
        {bestPick && (
          <div className="bg-gradient-to-r from-green-50 to-white border-l-4 border-l-green-400 p-4 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Best Pick</div>
                <div className="text-xl font-semibold">{bestPick.college.name}</div>
                <div className="text-sm text-muted-foreground">
                  Recommended based on placement ({bestPick.college.placement}%), rating ({bestPick.college.rating}⭐) and reviews ({bestPick.college.reviews}).
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm">Score: <span className="font-semibold">{(bestPick.total * 100).toFixed(0)}</span></div>
                <div className="mt-2">
                  <Button onClick={() => router.push(`/college/${encodeURIComponent(bestPick.college.id)}`)}>
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="grid gap-6 auto-rows-fr" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
          {colleges.map((c) => (
            <Card key={c.id} className="flex flex-col h-full shadow-md rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{c.name}</CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col flex-grow">
                <div className="w-full h-36 rounded overflow-hidden">
                  <img src={c.image} className="w-full h-full object-cover" alt={c.name} />
                </div>

                <p className={`mt-4 text-sm ${highlightDifferences && differing.location ? "bg-yellow-100 p-2 rounded" : ""}`}>
                  <strong>Location:</strong> {c.location}
                </p>

                <div className={`mt-3 p-2 rounded ${highlightDifferences && differing.fees ? "bg-yellow-100" : ""}`}>
                  <strong>Fees:</strong> {c.fees}
                  <div className="mt-1">
                    <strong>Placement:</strong> {c.placement}%
                  </div>
                </div>

                <div className={`mt-3 ${highlightDifferences && differing.courses ? "bg-yellow-100 p-2 rounded" : ""}`}>
                  <strong>Courses:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {c.courses.map((course) => (
                      <Badge key={course} variant="secondary">
                        {course}
                      </Badge>
                    ))}
                  </div>
                </div>

                <p className={`mt-3 text-sm ${highlightDifferences && differing.type ? "bg-yellow-100 p-2 rounded" : ""}`}>
                  <strong>Type:</strong> {c.type}
                </p>

                <div className="mt-auto flex gap-3 pt-4">
                  <Button className="flex-1" onClick={() => router.push(`/college/${c.id}`)}>
                    <Eye className="mr-2" /> View
                  </Button>
                  <Button variant="destructive" onClick={() => removeFromCompare(c.id)}>
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
