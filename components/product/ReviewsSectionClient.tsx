"use client";
import ReviewsSection from "./ReviewsSection";

export default function ReviewsSectionClient({ initialReviews, productId }: { initialReviews: any[]; productId: string }) {
  return <ReviewsSection initialReviews={initialReviews} productId={productId} />;
}
