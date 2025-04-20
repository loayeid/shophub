import Link from 'next/link'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">ShopHub</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Modern e-commerce platform with everything you need for your online shopping.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop Categories</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/category/electronics" className="hover:text-primary dark:hover:text-primary">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/category/fashion" className="hover:text-primary dark:hover:text-primary">
                  Fashion
                </Link>
              </li>
              <li>
                <Link href="/category/home-kitchen" className="hover:text-primary dark:hover:text-primary">
                  Home & Kitchen
                </Link>
              </li>
              <li>
                <Link href="/category/books" className="hover:text-primary dark:hover:text-primary">
                  Books
                </Link>
              </li>
              <li>
                <Link href="/category/beauty" className="hover:text-primary dark:hover:text-primary">
                  Beauty
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/#" className="hover:text-primary dark:hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/#" className="hover:text-primary dark:hover:text-primary">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/#" className="hover:text-primary dark:hover:text-primary">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link href="/#" className="hover:text-primary dark:hover:text-primary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>123 E-Commerce St., Digital City, 10001</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>support@shophub.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {currentYear} ShopHub. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-primary dark:hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary dark:hover:text-primary">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-primary dark:hover:text-primary">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer