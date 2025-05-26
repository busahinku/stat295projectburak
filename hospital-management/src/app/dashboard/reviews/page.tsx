'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser, User } from '@/lib/auth'
import { PatientService, Review } from '@/lib/patient'
import { 
  Star, 
  Plus, 
  User as UserIcon, 
  Calendar,
  Stethoscope,
  MessageCircle
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function ReviewsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [availableDoctors, setAvailableDoctors] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showWriteForm, setShowWriteForm] = useState(false)

  // Write review form state - mirrors writeReview() from Java
  const [selectedDoctorId, setSelectedDoctorId] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser) return

      setUser(currentUser)

      // Mirror seeReviews() from Java - load all reviews
      await loadAllReviews()
      
      if (currentUser.role === 'patient') {
        // Load available doctors for writing reviews
        await loadAvailableDoctors()
      }

      setIsLoading(false)
    }

    loadData()
  }, [])

  // Load all reviews - mirrors seeReviews() from Java
  const loadAllReviews = async () => {
    try {
      const allReviews = await PatientService.getAllReviews()
      setReviews(allReviews)
    } catch (error) {
      console.error('Error loading reviews:', error)
    }
  }

  // Load available doctors - mirrors doctor listing from Java
  const loadAvailableDoctors = async () => {
    try {
      const doctors = await PatientService.getAvailableDoctors()
      setAvailableDoctors(doctors)
    } catch (error) {
      console.error('Error loading doctors:', error)
    }
  }

  // Write review - mirrors writeReview() from Java main.java
  const handleWriteReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selectedDoctorId || rating === 0 || !comment.trim()) return

    setIsSubmitting(true)
    try {
      const success = await PatientService.writeReview(
        user.id,
        selectedDoctorId,
        rating,
        comment.trim()
      )

      if (success) {
        // Reload reviews to show the new one
        await loadAllReviews()
        setShowWriteForm(false)
        setSelectedDoctorId('')
        setRating(0)
        setComment('')
        alert('Review submitted successfully!')
      } else {
        alert('Failed to submit review. Please try again.')
      }
    } catch (error) {
      console.error('Error writing review:', error)
      alert('Error submitting review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`h-5 w-5 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  // Group reviews by doctor - mirrors the doctor grouping from Java seeReviews()
  const reviewsByDoctor = reviews.reduce((acc, review) => {
    const doctorId = review.doctorId
    if (!acc[doctorId]) {
      acc[doctorId] = []
    }
    acc[doctorId].push(review)
    return acc
  }, {} as Record<string, Review[]>)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctor Reviews</h1>
          <p className="text-gray-600 mt-1">
            Read patient reviews and share your experience
          </p>
        </div>
        
        {user.role === 'patient' && (
          <button
            onClick={() => setShowWriteForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Write Review</span>
          </button>
        )}
      </div>

      {/* Write Review Modal - mirrors writeReview() from Java */}
      {showWriteForm && user.role === 'patient' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Write a Review</h2>
            
            <form onSubmit={handleWriteReview} className="space-y-4">
              {/* Doctor Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Doctor
                </label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Choose a doctor...</option>
                  {availableDoctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.fullName} ({doctor.specialty})
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating (1-5 stars)
                </label>
                <div className="flex items-center space-x-2">
                  {renderStars(rating, true, setRating)}
                  <span className="text-sm text-gray-600 ml-2">
                    {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Review
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Share your experience with this doctor..."
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowWriteForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || rating === 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reviews Display - mirrors seeReviews() from Java */}
      <div className="space-y-6">
        {Object.keys(reviewsByDoctor).length === 0 ? (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No reviews found</p>
                <p className="text-gray-400 text-sm mt-2">
                  Be the first to write a review for our doctors
                </p>
              </div>
            </div>
          </div>
        ) : (
          Object.entries(reviewsByDoctor).map(([doctorId, doctorReviews]) => {
            const doctor = availableDoctors.find(d => d.id === doctorId)
            const averageRating = doctorReviews.reduce((sum, review) => sum + review.rating, 0) / doctorReviews.length

            return (
              <div key={doctorId} className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Stethoscope className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Dr. {doctor?.fullName || 'Unknown Doctor'}
                        </h3>
                        <p className="text-sm text-gray-500">{doctor?.specialty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        {renderStars(Math.round(averageRating))}
                        <span className="text-sm text-gray-600">
                          {averageRating.toFixed(1)} ({doctorReviews.length} review{doctorReviews.length > 1 ? 's' : ''})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {doctorReviews.map((review) => (
                      <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <UserIcon className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {review.patient?.firstName} {review.patient?.lastName}
                              </p>
                              <div className="flex items-center space-x-2">
                                {renderStars(review.rating)}
                                <span className="text-xs text-gray-500">
                                  {formatDate(review.reviewDate)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
} 