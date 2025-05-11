const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {currentYear} ShopHub. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer