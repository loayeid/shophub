"use client"
import { useState } from "react"
import ReviewForm from "@/components/product/ReviewForm"
import { Star } from "lucide-react"

export default function ReviewsSection({ initialReviews, productId }: { initialReviews: any[], productId: string }) {
  const [reviews, setReviews] = useState(initialReviews)
  return (
    <div className="mb-12">
      <div className="space-y-8">
        <h3 className="text-xl font-bold mb-6">Customer Reviews</h3>
        <div className="mb-8">
          <ReviewForm productId={productId} onReviewAdded={review => setReviews([review, ...reviews])} />
        </div>
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="border-b border-gray-200 dark:border-gray-800 pb-6">
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="font-semibold">{review.userName}</p>
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'stroke-current fill-transparent'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <h4 className="font-medium mb-2">{review.title}</h4>
                <p className="text-gray-700 dark:text-gray-300">{review.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            There are no reviews for this product yet. Be the first to leave a review!
          </p>
        )}
      </div>
    </div>
  )
}
