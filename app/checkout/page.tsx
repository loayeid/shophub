"use client"

import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCart } from '@/context/cart-context'
import { useToast } from '@/hooks/use-toast'
import { useUser } from '@/context/user-context'
import { Alert } from '@/components/ui/alert'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function StripePaymentSection({
  userName,
  userEmail,
  onSuccess,
  amount,
  orderData
}: {
  userName: string;
  userEmail: string;
  onSuccess: () => void;
  amount: number;
  orderData: any;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);

  useEffect(() => {
    fetch('/api/checkout/payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret));
  }, [amount]);

  const handleStripePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!stripe || !elements || !clientSecret) {
      setError('Please enter your card details.');
      return;
    }
    setLoading(true);
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;
    const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });
    const cardLast4 = paymentIntent?.charges?.data?.[0]?.payment_method_details?.card?.last4 || '';
    if (stripeError) {
      setError(stripeError.message || 'Payment failed');
      setLoading(false);
      return;
    }
    if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Save order in DB
      const res = await fetch('/api/checkout/save-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: orderData.userId,
          userName,
          userEmail,
          cardLast4,
          ...orderData,
        }),
      });
      if (res.ok) {
        onSuccess();
      } else {
        setError('Order saving failed');
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleStripePayment} className="space-y-4">
      <Label>Card Details</Label>
      <div className="p-3 border rounded bg-gray-50 dark:bg-gray-900">
        <CardElement
          options={{ style: { base: { fontSize: '16px' } } }}
          onChange={e => {
            console.log('Card complete:', e.complete);
            setCardComplete(e.complete);
          }}
        />
      </div>
      {error && <Alert variant="destructive">{error}</Alert>}
      <Button type="submit" disabled={!stripe || loading} className="w-full">
        {loading ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  );
}

function MinimalStripeForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;
    // No payment intent for this minimal test
    alert('CardElement is working!');
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '2rem auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2 style={{ marginBottom: 16 }}>Test Stripe Card Input</h2>
      <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      <button type="submit" style={{ marginTop: 24, width: '100%', padding: 12, background: '#635bff', color: '#fff', border: 'none', borderRadius: 4 }}>
        Test Card Input
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, subtotal, clearCart } = useCart()
  const { toast } = useToast()
  const { user } = useUser()
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [activeTab, setActiveTab] = useState('delivery');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  
  // Calculate tax and total
  const tax = subtotal * 0.08 // 8% tax rate
  const shipping = subtotal > 50 ? 0 : 5.99
  const total = subtotal + tax + shipping
  
  // Form state
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    phone: '',
  })
  const [billingAddress, setBillingAddress] = useState({
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    phone: '',
  })
  
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState('credit-card')
  
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShippingAddress(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false)
      setOrderComplete(true)
      clearCart()
      
      // Redirect to success page after a moment
      setTimeout(() => {
        router.push('/')
        toast({
          title: "Order placed successfully!",
          description: "Thank you for your purchase.",
          duration: 5000,
        })
      }, 3000)
    }, 2000)
  }
  
  // Redirect to home if cart is empty
  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            You need to add items to your cart before checkout.
          </p>
          <Button asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }
  
  // Order complete screen
  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 mb-4 text-green-500">
            <CheckCircle className="w-16 h-16" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            We&apos;ve sent a confirmation email with your order details.
          </p>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="delivery" className="mb-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="delivery">Delivery</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="delivery" className="space-y-6 pt-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={shippingAddress.firstName}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={shippingAddress.lastName}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="addressLine1">Address Line 1</Label>
                      <Input
                        id="addressLine1"
                        name="addressLine1"
                        value={shippingAddress.addressLine1}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                      <Input
                        id="addressLine2"
                        name="addressLine2"
                        value={shippingAddress.addressLine2}
                        onChange={handleShippingChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state">State / Province</Label>
                      <Input
                        id="state"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={shippingAddress.postalCode}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="button" onClick={() => setActiveTab('payment')}>
                    Continue to Payment
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="payment" className="space-y-6 pt-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
                  
                  <div className="mb-6">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="sameAsShipping"
                        checked={sameAsShipping}
                        onChange={() => setSameAsShipping(!sameAsShipping)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="sameAsShipping">Same as shipping address</Label>
                    </div>
                  </div>
                  
                  {!sameAsShipping && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {/* Billing address fields (same structure as shipping) */}
                      <div className="space-y-2">
                        <Label htmlFor="billingFirstName">First Name</Label>
                        <Input id="billingFirstName" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billingLastName">Last Name</Label>
                        <Input id="billingLastName" required />
                      </div>
                      {/* Additional billing fields */}
                    </div>
                  )}
                  
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="mb-6"
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card">Credit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                  </RadioGroup>
                  
                  {paymentMethod === 'credit-card' && (
                    <Elements stripe={stripePromise}>
                      <StripePaymentSection
                        userName={userName}
                        userEmail={userEmail}
                        amount={Math.round(total * 100)}
                        orderData={{
                          userId: user?.id,
                          items: cart.map((item: any) => ({
                            productId: item.id,
                            productName: item.name,
                            quantity: item.quantity,
                            price: item.price,
                          })),
                          shippingAddress,
                          billingAddress: sameAsShipping ? shippingAddress : billingAddress,
                          paymentMethod: 'stripe',
                          subtotal,
                          tax,
                          shipping,
                          total,
                        }}
                        onSuccess={() => {
                          clearCart();
                          setOrderComplete(true);
                          toast({ title: 'Payment successful!', description: 'Your order has been placed.' });
                        }}
                      />
                    </Elements>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </div>
        
        {/* Order summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Items summary */}
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="flex-1">
                        {item.name} <span className="text-gray-500">× {item.quantity}</span>
                      </span>
                      <span>${((+item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${(+subtotal).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span>${(+tax).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600 dark:text-green-400">Free</span>
                      ) : (
                        `$${(+shipping).toFixed(2)}`
                      )}
                    </span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${(+total).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6 space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <p className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> 
              Secure checkout
            </p>
            <p className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> 
              Free shipping on orders over $50
            </p>
            <p className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> 
              30-day return policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}