import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, X } from 'lucide-react';
import FilterSection from './filterSection';
import ServiceCard from './serviceCard';   // can be reused to show salons
import { api } from '../../lib/api';

const HorizontalNavList = () => {
  // Keep as is, it's just a UI bar
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setServices([
          { id: 1, name: "Hair stylist" },
          { id: 2, name: "Lashes" },
          { id: 3, name: "Makeup" },
          { id: 4, name: "Hair Removal" },
          { id: 5, name: "Nails" }
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services:', error);
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex space-x-6 p-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-[95%] mx-0">
        <nav className="flex space-x-6 sm:space-x-8 overflow-x-auto py-4">
          {services.map((service) => (
            <div key={service.id} className="flex-shrink-0">
              <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 whitespace-nowrap text-sm font-medium transition-colors">
                <span>{service.name}</span>
              </button>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

const SearchResults = () => {
  const [itemsPerPage, setItemsPerPage] = useState('09');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef2 = useRef(null);

  const options = ['09', '12', '24', '48', '96'];
  const handleOptionSelect = (option) => {
    setItemsPerPage(option);
    setIsOpen(false);
  };

  const [searchValue, setSearchValue] = useState('');
  const handleClear = () => {
    setSearchValue('');
    setSearchTerm('');
  };

  const [filters, setFilters] = useState({});
  const [favorites, setFavorites] = useState(new Set());
  const [salons, setSalons] = useState([]);        // renamed
  const [resultCount, setResultCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSalons = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          searchTerm: searchTerm,
          minRating: filters.rating || 0,
          location: filters.location || '',
          page: 1,
          limit: parseInt(itemsPerPage)
        }).toString();

        const response = await api(`/api/salons/salons?${queryParams}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        setSalons(response.salons || []);
        setResultCount(response.pagination?.totalCount || 0);
      } catch (error) {
        console.error('Error fetching salons:', error);
        setSalons([]);
        setResultCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchSalons();
  }, [searchTerm, filters, itemsPerPage]);

  const handleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) newFavorites.delete(id);
    else newFavorites.add(id);
    setFavorites(newFavorites);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[95%] mx-auto mb-8">
        <hr className="border-gray-400 p-0" />
        <HorizontalNavList />

        <div className="w-full max-w-xl my-4 px-0 sm:px-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setSearchTerm(e.target.value);
              }}
              className="w-full pl-10 pr-10 py-3 border border-gray-400 rounded-2xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-puce1-300 focus:border-transparent transition-all duration-200 text-base"
              placeholder="Search salons..."
            />
            {searchValue && (
              <button
                onClick={handleClear}
                className="absolute inset-y-0 right-3 flex items-center hover:bg-gray-100 rounded-full p-1 transition-colors duration-200"
                aria-label="Clear search"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <aside className="w-full sm:w-72 md:w-80 lg:w-96 xl:w-[28rem] flex-shrink-0">
            <FilterSection filters={filters} onFilterChange={setFilters} />
          </aside>

          <main className="w-full flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <h2 className="text-base sm:text-lg font-medium text-gray-900">
                {loading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                    {searchTerm ? `Loading Results for ${searchTerm}` : 'Loading All Salons'}
                  </span>
                ) : (
                  <>
                    {resultCount?.toLocaleString()} Results {searchTerm ? `for "${searchTerm}"` : 'for All Salons'}
                  </>
                )}
              </h2>
            </div>

            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <AnimatePresence>
                {salons.map((salon) => (
                  <ServiceCard
                    key={salon.id}
                    service={{
                      id: salon.id,
                      name: salon.name,
                      description: salon.description,
                      images: salon.images,
                      location: salon.location,
                      rating: salon.rating,
                      reviews: salon.reviews
                    }}
                    onFavorite={handleFavorite}
                    isFavorited={favorites.has(salon.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
