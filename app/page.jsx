// app/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  DollarSign,
  GraduationCap,
  TrendingUp,
  Star,
  Users,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AuthModal from "@/components/auth/auth-modal";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      if (isAuthenticated) {
        router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
      } else {
        setShowAuthModal(true);
      }
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const featuredColleges = [
    {
      name: "SRM Institute of Science and Technology",
      location: "Chennai, Tamil Nadu",
      rating: 4.2,
      reviews: 1250,
      fees: "₹2.5L - 15L",
      placement: "85%",
      courses: ["Engineering", "Management", "Medicine"],
    },
    {
      name: "VIT University",
      location: "Vellore, Tamil Nadu",
      rating: 4.1,
      reviews: 980,
      fees: "₹1.8L - 12L",
      placement: "82%",
      courses: ["Engineering", "Design", "Law"],
    },
    {
      name: "Manipal Institute of Technology",
      location: "Manipal, Karnataka",
      rating: 4.0,
      reviews: 750,
      fees: "₹3.2L - 18L",
      placement: "78%",
      courses: ["Engineering", "Architecture", "Pharmacy"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">

          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1 mb-5"
            style={{
              backgroundColor: "color-mix(in oklch, var(--accent) 18%, white)",
            }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: "var(--accent)" }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: "var(--accent-foreground)" }}
            >
              Find your college
            </span>
          </div>

          <h1 className="text-5xl font-bold text-foreground mb-6 text-balance">
            Not in a top-tier? Don&apos;t worry, your journey starts here.
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Real reviews. Real guidance. The right college for you.
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Discover the perfect private or third-tier college that matches
            your interests, budget, and career goals.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search colleges, courses, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} size="lg" className="h-12 px-8">
                Search Colleges
              </Button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            <Badge variant="secondary" className="px-4 py-2 cursor-pointer border">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              Location
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 cursor-pointer border">
              <DollarSign className="h-4 w-4 mr-2 text-accent" />
              Budget
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 cursor-pointer border">
              <BookOpen className="h-4 w-4 mr-2 text-secondary" />
              Course
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 cursor-pointer border">
              <TrendingUp className="h-4 w-4 mr-2 text-primary" />
              Placements
            </Badge>
          </div>

        </div>
      </section>

      {/* Featured Colleges */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Featured Colleges</h2>
            <p className="text-lg text-muted-foreground">
              Top-rated institutions recommended by our community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {featuredColleges.map((college, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg mb-2">{college.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {college.location}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{college.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Fees Range</span>
                      <span className="font-semibold">{college.fees}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Placement Rate</span>
                      <span className="font-semibold text-green-600">
                        {college.placement}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{college.reviews} reviews</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {college.courses.map((course, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Why Choose CollegeCompass?</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to make the right college decision
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Authentic Reviews</h3>
              <p className="text-muted-foreground">
                Genuine reviews from real students and alumni.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Search</h3>
              <p className="text-muted-foreground">
                Advanced filters to match your goals.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Placement Data</h3>
              <p className="text-muted-foreground">
                Access real placement insights from top colleges.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect College?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students starting their journey with EduNav.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Your Search
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 border-primary-foreground text-primary-foreground">
              Browse Reviews
            </Button>
          </div>
        </div>
      </section>

      {/* Footer with DEVELOPERS ADDED */}
      <footer className="py-12 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">

            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">EduNav</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Helping students find their perfect college through reliable data & reviews.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/search" className="hover:text-foreground">Search Colleges</a></li>
                <li><a href="/reviews" className="hover:text-foreground">Write Reviews</a></li>
                <li><a href="/compare" className="hover:text-foreground">Compare Colleges</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">College Rankings</a></li>
                <li><a href="#" className="hover:text-foreground">Admission Guide</a></li>
                <li><a href="#" className="hover:text-foreground">Career Guidance</a></li>
              </ul>
            </div>

            {/* DEVELOPERS COLUMN ADDED */}
            <div>
              <h4 className="font-semibold mb-4">Team</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/developers" className="hover:text-foreground font-medium">Developers</a></li>
                <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-center gap-2">
            <p>&copy; 2025 EduNav. All rights reserved.</p>

            {/* Developer link added here */}
            <a
              href="/developers"
              className="text-primary hover:underline font-medium">
              Developers
            </a>
          </div>

        </div>
      </footer>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
