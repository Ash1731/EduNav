import { Star, ThumbsUp, ThumbsDown } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export function ReviewCard({ review }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{review.title}</h3>
            <div className="flex items-center gap-4 mb-2 text-sm text-gray-600">
              <span className="font-medium">{review.user}</span>
              <span>{review.college}</span>
              <span>{review.course}</span>
              <span>Class of {review.year}</span>
            </div>
            {renderStars(review.overallRating)}
          </div>
          <Badge variant="secondary">{formatDate(review.date)}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{review.review}</p>

        {/* Aspect Ratings */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          {Object.entries(review.ratings).map(([aspect, rating]) => (
            <div key={aspect} className="text-center">
              <div className="text-sm font-medium capitalize mb-1">{aspect}</div>
              <div className="text-lg font-bold text-primary">{rating.toFixed(1)}</div>
              <Progress value={rating * 20} className="h-2" />
            </div>
          ))}
        </div>

        {/* Pros and Cons */}
        {(review.pros?.length > 0 || review.cons?.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {review.pros?.length > 0 && (
              <div>
                <h4 className="font-medium text-green-700 mb-2">Pros</h4>
                <ul className="text-sm space-y-1">
                  {review.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">+</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {review.cons?.length > 0 && (
              <div>
                <h4 className="font-medium text-red-700 mb-2">Cons</h4>
                <ul className="text-sm space-y-1">
                  {review.cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">-</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Helpful Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <ThumbsUp className="h-4 w-4 mr-1" />
              Helpful ({review.helpful})
            </Button>
            <Button variant="ghost" size="sm">
              <ThumbsDown className="h-4 w-4 mr-1" />
              Not Helpful ({review.notHelpful})
            </Button>
          </div>
          <span className="text-sm text-gray-500">Was this review helpful?</span>
        </div>
      </CardContent>
    </Card>
  )
}
