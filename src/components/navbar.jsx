import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Search, ChevronDown } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getFullImageUrl, getFallbackProfileImage } from '../lib/imageUtils'

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const [searchFocused, setSearchFocused] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const dropdownRef = useRef(null)

  const { user, logout, loading } = useAuth()
  
  console.log('Navbar user state:', user)


  const handleLogout = async () => {
    try {
      await logout()
      // The logout function in AuthContext will handle the page refresh
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoryOpen(false)
      }
    }
    if (isCategoryOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCategoryOpen])



  return (
    <div className="w-full font-sans">
      {/* Main Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 bg-white ${isScrolled ? 'shadow-md' : ''}`}
      >
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="text-xl sm:text-2xl font-bold text-gray-800">Logo Here</a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
              <a href="/search"className="text-gray-600 hover:text-gray-900 transition-colors">Search</a>
              <a href="/register" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Success Stories</a>
              <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Contact Us</a>
            </div>

            {/* Desktop Search & Dropdown */}
            <div className="hidden md:flex items-center relative" ref={dropdownRef}>
              <motion.div
                initial={false}
                animate={{ width: searchFocused ? '320px' : '280px' }}
                transition={{ duration: 0.2 }}
                className="relative flex items-center bg-white border border-gray-300 rounded-full focus-within:ring-2 focus-within:ring-gray-200"
              >
                <Search className="absolute left-3 text-gray-400 z-10" size={18} />
                <input
                  type="text"
                  placeholder="Search"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="pl-10 pr-24 py-2 focus:outline-none w-full text-sm bg-transparent"
                />
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center justify-between px-2 py-1 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-puce"
                >
                  <span className="text-sm">{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                </button>
              </motion.div>

              {isCategoryOpen && (
                <div className="absolute z-10 mt-2 w-32 right-1 top-full bg-white border border-gray-200 rounded-xl shadow-lg">
                  {['all', 'salons', 'professionals', 'services', 'locations'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setIsCategoryOpen(false); }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        selectedCategory === cat ? 'font-semibold text-puce' : ''
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
              )}

              {/* Auth Buttons */}
              {user ? (
                <div className="flex items-center ml-4">
                  {user.profile_image_url ? (
                    <img src={getFullImageUrl(user.profile_image_url)} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-puce flex items-center justify-center text-white font-semibold">
                      {user.first_name ? user.first_name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <a href="/search" className="ml-4 text-gray-600 hover:text-gray-900 transition-colors">Search</a>
                  <button onClick={handleLogout} className="ml-4 text-gray-600 hover:text-gray-900 transition-colors">Logout</button>
                </div>
              ) : (
                <div className="flex items-center ml-4">
                  <a href="/login" className="mr-4 text-gray-600 hover:text-gray-900 transition-colors">Log in</a>
                  <a href="/register" className="bg-puce text-white px-5 py-2 rounded-lg hover:bg-rose-taupe transition-colors">Sign up</a>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white border-t"
            >
              <div className="container mx-auto px-4 py-3">
                <div className="flex flex-col space-y-3">
                  <a href="/" className="text-gray-600 py-2 hover:text-gray-900 transition-colors">Home</a>
                  <a href="/about" className="text-gray-600 py-2 hover:text-gray-900 transition-colors">About Us</a>
                  <a href="/pricing" className="text-gray-600 py-2 hover:text-gray-900 transition-colors">Pricing</a>
                  <a href="/success-stories" className="text-gray-600 py-2 hover:text-gray-900 transition-colors">Success Stories</a>
                  <a href="/contact" className="text-gray-600 py-2 hover:text-gray-900 transition-colors">Contact Us</a>

                  {/* Mobile Search */}
                  <div className="relative flex items-center bg-white border border-gray-300 rounded-full focus-within:ring-2 focus-within:ring-gray-200" ref={dropdownRef}>
                    <Search className="absolute left-3 text-gray-400 z-10" size={18} />
                    <input
                      type="text"
                      placeholder="Search"
                      className="pl-10 pr-20 py-2 focus:outline-none w-full text-sm bg-transparent"
                    />
                    <button
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center justify-between px-2 py-1 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-puce"
                    >
                      <span className="text-sm">{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {isCategoryOpen && (
                    <div className="absolute z-10 mt-2 w-32 right-1 top-full bg-white border border-gray-200 rounded-xl shadow-lg">
                      {['all', 'salons', 'professionals', 'services', 'locations'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => { setSelectedCategory(cat); setIsCategoryOpen(false); }}
                          className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                            selectedCategory === cat ? 'font-semibold text-puce' : ''
                          }`}
                        >
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Mobile Auth Buttons */}
                  <div className="flex flex-col pt-2 space-y-2">
                    <a href="/login" className="text-black py-2 hover:text-gray-900 transition-colors">Log in</a>
                    <a href="/signup" className="bg-puce text-white px-4 py-2 rounded-full text-center hover:bg-gray-800 transition-colors">Sign up</a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      {/* Padding for fixed nav */}
      <div className="pt-20"></div>
    </div>
  )
}

export default NavBar
