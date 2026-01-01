// app/search/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, MapPin, DollarSign, Star, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

/**
 * Search page
 * - Adds Search button + Enter key handling
 * - Search includes college.university (so user can search university names)
 * - Filters footer shows correct "Showing X result(s)"
 * - Reset & Apply sets defaults and shows all results
 *
 * Path used: /mnt/data/page.jsx
 */

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") || "";

  // search input state
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  const defaultFilters = {
    location: [],
    courses: [],
    feeRange: [0, 2000000],
    placementRate: [0, 100],
    rating: [0, 5],
    collegeType: [],
  };

  const [filters, setFilters] = useState(defaultFilters);

  // Mock college data (same as before)
  const colleges = [
    {
      id: "1",
      name: "SRM Institute of Science and Technology",
      location: "Chennai, Tamil Nadu",
      rating: 4.2,
      reviews: 1250,
      feesMin: 250000,
      feesMax: 1500000,
      fees: "₹2.5L - 15L",
      placement: 85,
      courses: ["Engineering", "Management", "Medicine"],
      type: "Private",
      established: 1985,
      image: "/modern-college-campus.jpg",
      description: "SRM is a large private university with strong engineering programs.",
      university: "SRM",
    },
    {
      id: "2",
      name: "VIT University",
      location: "Vellore, Tamil Nadu",
      rating: 4.1,
      reviews: 980,
      feesMin: 180000,
      feesMax: 1200000,
      fees: "₹1.8L - 12L",
      placement: 82,
      courses: ["Engineering", "Design", "Law"],
      type: "Private",
      established: 1984,
      image: "/college-library-interior.jpg",
      description: "VIT offers engineering and interdisciplinary programs.",
      university: "VIT",
    },
    {
      id: "3",
      name: "Manipal Institute of Technology",
      location: "Manipal, Karnataka",
      rating: 4.0,
      reviews: 750,
      feesMin: 320000,
      feesMax: 1800000,
      fees: "₹3.2L - 18L",
      placement: 78,
      courses: ["Engineering", "Architecture", "Pharmacy"],
      type: "Private",
      established: 1957,
      image: "/engineering-laboratory.jpg",
      description: "MIT Manipal has a long history in engineering education.",
      university: "MIT",
    },
    {
      id: "4",
      name: "Amity University",
      location: "Noida, Uttar Pradesh",
      rating: 3.8,
      reviews: 650,
      feesMin: 280000,
      feesMax: 1600000,
      fees: "₹2.8L - 16L",
      placement: 75,
      courses: ["Engineering", "Business", "Arts"],
      type: "Private",
      established: 2005,
      image: "/college-hostel-building.jpg",
      description: "Amity is a multi-campus private university.",
      university: "Amity",
    },
    {
      id: "5",
      name: "Lovely Professional University",
      location: "Phagwara, Punjab",
      rating: 3.9,
      reviews: 890,
      feesMin: 150000,
      feesMax: 1000000,
      fees: "₹1.5L - 10L",
      placement: 80,
      courses: ["Engineering", "Management", "Design"],
      type: "Private",
      established: 2005,
      image: "/modern-college-campus.jpg",
      description: "LPU offers a range of programs across campuses.",
      university: "LPU",
    },
    {
      id: "6",
      name: "Kalinga Institute of Industrial Technology",
      location: "Bhubaneswar, Odisha",
      rating: 4.0,
      reviews: 720,
      feesMin: 220000,
      feesMax: 1400000,
      fees: "₹2.2L - 14L",
      placement: 83,
      courses: ["Engineering", "Medicine", "Law"],
      type: "Private",
      established: 1992,
      image: "/college-library-interior.jpg",
      description: "KIIT has strong tech & management programs.",
      university: "KIIT",
    },
  ];

  const locations = [
    "Chennai, Tamil Nadu",
    "Vellore, Tamil Nadu",
    "Manipal, Karnataka",
    "Noida, Uttar Pradesh",
    "Phagwara, Punjab",
    "Bhubaneswar, Odisha",
  ];
  const courses = [
    "Engineering",
    "Management",
    "Medicine",
    "Design",
    "Law",
    "Architecture",
    "Pharmacy",
    "Business",
    "Arts",
  ];
  const collegeTypes = ["Private", "Government", "Deemed"];

  const handleFilterChange = (filterType, value, checked) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: checked ? [...prev[filterType], value] : prev[filterType].filter((item) => item !== value),
    }));
  };

  // reset to defaults (doesn't immediately apply unless you call apply or resetAndApply)
  function clearFilters() {
    setFilters(defaultFilters);
  }

  // -----------------------------
  // Pagination & Compare logic
  // -----------------------------
  const COMPARE_KEY = "compareList";
  const [compareList, setCompareList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(COMPARE_KEY) || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    // ensure uniqueness in localStorage
    const unique = Array.from(new Set(compareList));
    localStorage.setItem(COMPARE_KEY, JSON.stringify(unique));
    if (unique.length !== compareList.length) setCompareList(unique);
  }, [compareList]);

  function toggleCompare(collegeId) {
    setCompareList((prev) => {
      const set = new Set(prev);
      if (set.has(collegeId)) set.delete(collegeId);
      else {
        if (set.size >= 4) {
          alert("You can compare up to 4 colleges only.");
          return prev;
        }
        set.add(collegeId);
      }
      return Array.from(set);
    });
  }

  function isCompared(collegeId) {
    return compareList.includes(collegeId);
  }

  // Pagination: client-side slice over mock data
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(3); // default per page
  const totalResults = colleges.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / perPage));

  function goToPage(p) {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
    window.scrollTo({ top: 200, behavior: "smooth" });
  }

  // Apply Filters: client-side filtering, now includes university match
  const [appliedResults, setAppliedResults] = useState(colleges);

  function applyFiltersClient(useFilters) {
    const f = useFilters || filters;
    const q = (searchQuery || "").trim().toLowerCase();

    let filtered = colleges.filter((c) => {
      // quick text search (includes university now)
      const matchesQ =
        !q ||
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.location && c.location.toLowerCase().includes(q)) ||
        (c.university && c.university.toLowerCase().includes(q)) ||
        (c.courses && c.courses.join(" ").toLowerCase().includes(q));

      if (!matchesQ) return false;

      // location
      if (f.location.length && !f.location.includes(c.location)) return false;

      // courses (any match)
      if (f.courses.length && !f.courses.some((course) => c.courses.includes(course))) return false;

      // placement
      const [minP, maxP] = f.placementRate;
      if (c.placement < minP || c.placement > maxP) return false;

      // rating
      const [rMin, rMax] = f.rating;
      if (c.rating < rMin || c.rating > rMax) return false;

      // college type
      if (f.collegeType.length && !f.collegeType.includes(c.type)) return false;

      return true;
    });

    // sorting
    if (sortBy === "rating") filtered = filtered.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "fees-low") filtered = filtered.sort((a, b) => (a.feesMin || 0) - (b.feesMin || 0));
    else if (sortBy === "fees-high") filtered = filtered.sort((a, b) => (b.feesMax || 0) - (a.feesMax || 0));
    else if (sortBy === "placement") filtered = filtered.sort((a, b) => (b.placement || 0) - (a.placement || 0));

    setAppliedResults(filtered);
    setCurrentPage(1);
  }

  // reset & immediately apply (shows full dataset)
  function resetAndApply() {
    setFilters(defaultFilters);
    setSearchQuery("");
    applyFiltersClient(defaultFilters);
    setCurrentPage(1);
  }

  // run initial apply on mount
  useEffect(() => {
    applyFiltersClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // page slice
  const startIdx = (currentPage - 1) * perPage;
  const pageSlice = appliedResults.slice(startIdx, startIdx + perPage);



  // handle Enter key on search box
  function handleSearchKey(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      applyFiltersClient();
    }
  }

  // visible Search button handler
  function handleSearch() {
    applyFiltersClient();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">EduNav</h1>

            <div className="flex-1 max-w-2xl">
              <div className="relative flex items-center gap-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="search"
                  placeholder="Search colleges, courses, universities or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKey}
                  className="pl-10 pr-3 py-2 w-full rounded-md border"
                />
                <Button onClick={handleSearch} className="ml-2">
                  Search
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Dashboard
              </Button>
              <Button variant="outline" onClick={() => router.push("/compare")}>
                Compare ({compareList.length})
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? "block" : "hidden"} lg:block w-80 space-y-6`}>
            <Card className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Filters</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => { clearFilters(); applyFiltersClient(); }}>
                    Clear All
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-6">
                {/* Location Filter */}
                <div>
                  <h4 className="font-semibold mb-3">Location</h4>
                  <div className="space-y-2">
                    {locations.map((location) => (
                      <div key={location} className="flex items-center space-x-2">
                        <Checkbox
                          id={location}
                          checked={filters.location.includes(location)}
                          onCheckedChange={(checked) => handleFilterChange("location", location, checked)}
                        />
                        <label htmlFor={location} className="text-sm">
                          {location}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Courses Filter */}
                <div>
                  <h4 className="font-semibold mb-3">Courses</h4>
                  <div className="space-y-2">
                    {courses.map((course) => (
                      <div key={course} className="flex items-center space-x-2">
                        <Checkbox
                          id={course}
                          checked={filters.courses.includes(course)}
                          onCheckedChange={(checked) => handleFilterChange("courses", course, checked)}
                        />
                        <label htmlFor={course} className="text-sm">
                          {course}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fee Range */}
                <div>
                  <h4 className="font-semibold mb-3">Fee Range (Annual)</h4>
                  <div className="px-2">
                    <Slider
                      value={filters.feeRange}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, feeRange: value }))}
                      max={2000000}
                      min={0}
                      step={50000}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>₹{(filters.feeRange[0] / 100000).toFixed(1)}L</span>
                      <span>₹{(filters.feeRange[1] / 100000).toFixed(1)}L</span>
                    </div>
                  </div>
                </div>

                {/* Placement Rate */}
                <div>
                  <h4 className="font-semibold mb-3">Placement Rate (%)</h4>
                  <div className="px-2">
                    <Slider
                      value={filters.placementRate}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, placementRate: value }))}
                      max={100}
                      min={0}
                      step={5}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{filters.placementRate[0]}%</span>
                      <span>{filters.placementRate[1]}%</span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h4 className="font-semibold mb-3">Minimum Rating</h4>
                  <div className="px-2">
                    <Slider
                      value={filters.rating}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, rating: value }))}
                      max={5}
                      min={0}
                      step={0.1}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{filters.rating[0].toFixed(1)} ⭐</span>
                      <span>{filters.rating[1].toFixed(1)} ⭐</span>
                    </div>
                  </div>
                </div>

                {/* College Type */}
                <div>
                  <h4 className="font-semibold mb-3">College Type</h4>
                  <div className="space-y-2">
                    {collegeTypes.map((t) => (
                      <div key={t} className="flex items-center space-x-2">
                        <Checkbox
                          id={t}
                          checked={filters.collegeType.includes(t)}
                          onCheckedChange={(checked) => handleFilterChange("collegeType", t, checked)}
                        />
                        <label htmlFor={t} className="text-sm">
                          {t}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>

              {/* Footer with Apply & Reset & Showing count */}
              <div className="border-t px-4 py-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Button onClick={() => applyFiltersClient()}>Apply Filters</Button>

                  <Button variant="outline" onClick={() => resetAndApply()}>
                    Reset & Apply
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground ml-auto whitespace-nowrap">
                  Showing <strong>{appliedResults.length}</strong> result(s)
                </div>
              </div>

            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden bg-transparent"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>

                <p className="text-muted-foreground">
                  Showing <strong>{appliedResults.length}</strong> colleges {searchQuery && `for "${searchQuery}"`}
                </p>
              </div>

              {/* native select for reliability */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    applyFiltersClient();
                  }}
                  className="rounded-md border px-3 py-1 text-sm"
                >
                  <option value="relevance">Relevance</option>
                  <option value="rating">Highest Rated</option>
                  <option value="fees-low">Fees: Low to High</option>
                  <option value="fees-high">Fees: High to Low</option>
                  <option value="placement">Placement Rate</option>
                </select>
              </div>
            </div>

            {/* College Cards */}
            <div className="space-y-6">
              {pageSlice.map((college) => (
                <Card key={college.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="w-32 h-24 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                        <img
                          src={college.image || "/placeholder.svg"}
                          alt={college.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">{college.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {college.location}
                              </div>
                              <span>Est. {college.established}</span>
                              <Badge variant="outline">{college.type}</Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{college.rating}</span>
                            <span className="text-sm text-muted-foreground">({college.reviews})</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                              <DollarSign className="h-4 w-4" />
                              Fees Range
                            </div>
                            <div className="font-semibold">{college.fees}</div>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                              <TrendingUp className="h-4 w-4" />
                              Placement Rate
                            </div>
                            <div className="font-semibold text-green-600">{college.placement}%</div>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                              <Users className="h-4 w-4" />
                              Reviews
                            </div>
                            <div className="font-semibold">{college.reviews}</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {college.courses.slice(0, 3).map((course) => (
                              <Badge key={course} variant="secondary" className="text-xs">
                                {course}
                              </Badge>
                            ))}
                            {college.courses.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{college.courses.length - 3} more
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                router.push(`/college/${encodeURIComponent(college.id)}`);
                              }}
                            >
                              View Details
                            </Button>

                            <Button
                              size="sm"
                              variant={isCompared(college.id) ? "destructive" : "outline"}
                              onClick={() => toggleCompare(college.id)}
                            >
                              {isCompared(college.id) ? "Remove" : "Compare"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <div className="flex gap-2 items-center">
                <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1}>
                  Previous
                </Button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
                    return (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={`px-3 py-1 rounded ${p === currentPage ? "bg-primary text-primary-foreground" : "border bg-card/50"}`}
                      >
                        {p}
                      </button>
                    );
                  }
                  const leftEllipsis = p === currentPage - 2 && p > 1;
                  const rightEllipsis = p === currentPage + 2 && p < totalPages;
                  if (leftEllipsis || rightEllipsis) {
                    return <span key={`e-${p}`} className="px-2">…</span>;
                  }
                  return null;
                })}

                <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages}>
                  Next
                </Button>

                <div className="ml-4 text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>

                <div className="ml-4 flex items-center gap-2">
                  <label className="text-sm text-muted-foreground">Per page</label>
                  <select
                    value={perPage}
                    onChange={(e) => {
                      const v = Number(e.target.value) || 3;
                      setPerPage(v);
                      setCurrentPage(1);
                    }}
                    className="rounded-md border px-2 py-1 text-sm"
                  >
                    <option value={3}>3</option>
                    <option value={6}>6</option>
                    <option value={9}>9</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
