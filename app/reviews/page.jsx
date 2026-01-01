"use client"

import { useState } from "react"
import { Search, Star, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ReviewCard } from "@/components/reviews/review-card"

// Mock reviews data
const reviewsData = [
  {
    id: 1,
    user: "Rahul Sharma",
    college: "St. Xavier's College of Engineering",
    course: "Computer Science Engineering",
    year: "2023",
    overallRating: 4.2,
    ratings: {
      academics: 4.0,
      placements: 4.5,
      infrastructure: 4.0,
      faculty: 4.2,
      hostel: 3.8,
    },
    title: "Great college with excellent placement opportunities",
    review:
      "I had a wonderful experience at St. Xavier's. The faculty is very supportive and the placement cell works really hard to get good companies on campus. The infrastructure is decent and the library has all the resources you need.",
    pros: ["Excellent placements", "Supportive faculty", "Good library"],
    cons: ["Hostel food could be better", "Limited parking space"],
    helpful: 45,
    notHelpful: 3,
    date: "2024-01-15",
  },
  {
    id: 2,
    user: "Priya Patel",
    college: "Mumbai Institute of Technology",
    course: "Electronics Engineering",
    year: "2022",
    overallRating: 3.8,
    ratings: {
      academics: 4.2,
      placements: 3.5,
      infrastructure: 3.8,
      faculty: 4.0,
      hostel: 3.5,
    },
    title: "Good academics but average placements",
    review:
      "The college has a strong academic curriculum and experienced faculty. However, the placement scenario could be improved. The college needs to invite more companies for campus recruitment.",
    pros: ["Strong academics", "Experienced faculty", "Good lab facilities"],
    cons: ["Limited placement opportunities", "Old infrastructure"],
    helpful: 32,
    notHelpful: 8,
    date: "2024-01-10",
  },
  {
    id: 3,
    user: "Amit Kumar",
    college: "Thakur College of Engineering",
    course: "Mechanical Engineering",
    year: "2023",
    overallRating: 4.5,
    ratings: {
      academics: 4.3,
      placements: 4.8,
      infrastructure: 4.2,
      faculty: 4.5,
      hostel: 4.0,
    },
    title: "Outstanding college experience",
    review:
      "Thakur College exceeded my expectations. The placement record is excellent with top companies visiting campus. Faculty is highly qualified and always ready to help students.",
    pros: ["Excellent placements", "Qualified faculty", "Modern infrastructure"],
    cons: ["High fees", "Strict attendance policy"],
    helpful: 67,
    notHelpful: 2,
    date: "2024-01-08",
  },
]

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [filterRating, setFilterRating] = useState("all")
  const [showWriteReview, setShowWriteReview] = useState(false)
  const [newReview, setNewReview] = useState({
    college: "",
    course: "",
    year: "",
    title: "",
    review: "",
    ratings: {
      academics: 5,
      placements: 5,
      infrastructure: 5,
      faculty: 5,
      hostel: 5,
    },
  })

  const filteredReviews = reviewsData.filter((review) => {
    const matchesSearch =
      review.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRating =
      filterRating === "all" ||
      (filterRating === "4+" && review.overallRating >= 4) ||
      (filterRating === "3+" && review.overallRating >= 3) ||
      (filterRating === "2+" && review.overallRating >= 2)

    return matchesSearch && matchesRating
  })

  const handleRatingChange = (aspect, rating) => {
    setNewReview((prev) => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [aspect]: rating,
      },
    }))
  }

  const handleSubmitReview = async () => {
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        console.log("[v0] Review submission error:", j?.error || res.statusText)
      }
    } catch (e) {
      console.log("[v0] Network error submitting review:", e?.message)
    } finally {
      setShowWriteReview(false)
      setNewReview({
        college: "",
        course: "",
        year: "",
        title: "",
        review: "",
        ratings: { academics: 5, placements: 5, infrastructure: 5, faculty: 5, hostel: 5 },
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">College Reviews</h1>
              <p className="text-muted-foreground mt-1">Real reviews from real students</p>
            </div>
            <Dialog open={showWriteReview} onOpenChange={setShowWriteReview}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Write Review
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Write a Review</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="college">College Name</Label>
                      <Input
                        id="college"
                        value={newReview.college}
                        onChange={(e) => setNewReview((prev) => ({ ...prev, college: e.target.value }))}
                        placeholder="Enter college name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="course">Course</Label>
                      <Input
                        id="course"
                        value={newReview.course}
                        onChange={(e) => setNewReview((prev) => ({ ...prev, course: e.target.value }))}
                        placeholder="Enter your course"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="year">Graduation Year</Label>
                    <Input
                      id="year"
                      value={newReview.year}
                      onChange={(e) => setNewReview((prev) => ({ ...prev, year: e.target.value }))}
                      placeholder="e.g., 2023"
                    />
                  </div>

                  <div>
                    <Label htmlFor="title">Review Title</Label>
                    <Input
                      id="title"
                      value={newReview.title}
                      onChange={(e) => setNewReview((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Summarize your experience"
                    />
                  </div>

                  <div>
                    <Label>Rate Different Aspects</Label>
                    <div className="space-y-3 mt-2">
                      {Object.entries(newReview.ratings).map(([aspect, rating]) => (
                        <div key={aspect} className="flex items-center justify-between">
                          <span className="capitalize font-medium">{aspect}</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => handleRatingChange(aspect, star)}
                                className={`w-6 h-6 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                              >
                                <Star className="w-full h-full fill-current" />
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="review">Detailed Review</Label>
                    <Textarea
                      id="review"
                      value={newReview.review}
                      onChange={(e) => setNewReview((prev) => ({ ...prev, review: e.target.value }))}
                      placeholder="Share your detailed experience..."
                      rows={6}
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowWriteReview(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmitReview}>Submit Review</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search reviews by college, course, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="helpful">Most Helpful</SelectItem>
                <SelectItem value="rating-high">Highest Rating</SelectItem>
                <SelectItem value="rating-low">Lowest Rating</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="4+">4+ Stars</SelectItem>
                <SelectItem value="3+">3+ Stars</SelectItem>
                <SelectItem value="2+">2+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No reviews found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
