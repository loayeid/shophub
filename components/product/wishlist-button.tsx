"use client"

import { useState } from 'react'
import { Heart, HeartOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUser } from '@/context/user-context'
import { useToast } from '@/hooks/use-toast'

interface WishlistButtonProps {
  productId: string
  initialInWishlist?: boolean
}

const WishlistButton = ({ productId, initialInWishlist = false }: WishlistButtonProps) => {
  const { user } = useUser()
  const { toast } = useToast()
  const [inWishlist, setInWishlist] = useState(initialInWishlist)
  const [loading, setLoading] = useState(false)

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    try {
      if (inWishlist) {
        await fetch('/api/wishlist', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId })
        })
        setInWishlist(false)
        toast({
          title: 'Removed from Wishlist',
          description: 'This product has been removed from your wishlist.',
          variant: 'default',
        })
      } else {
        await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId })
        })
        setInWishlist(true)
        toast({
          title: 'Added to Wishlist',
          description: 'This product has been added to your wishlist.',
          variant: 'default',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <Button
      variant={inWishlist ? 'destructive' : 'outline'}
      size="icon"
      className="absolute left-2 bottom-2 z-10"
      onClick={handleToggleWishlist}
      disabled={loading}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {inWishlist ? <HeartOff className="h-5 w-5" /> : <Heart className="h-5 w-5" />}
    </Button>
  )
}

export default WishlistButton
