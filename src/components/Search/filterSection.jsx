import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronDown, Info, Star } from 'lucide-react';
import { api } from '../../lib/api'; // <-- add this

// Customer Rating Filter
const CustomerRatingFilter = ({ selectedRating, onRatingChange }) => {
  const ratings = [
    { stars: 5, label: '5' },
    { stars: 4, label: '4 & Up' },
    { stars: 3, label: '3 & Up' },
    { stars: 2, label: '2 & Up' },
    { stars: 1, label: '1 & Up' }
  ];

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 sm:w-4 sm:h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
        }`}
      />
    ));

  return (
    <div className="bg-white">
      <span className="block text-base sm:text-lg font-medium text-gray-800 px-4 sm:px-6 py-3 sm:py-4">
        Customer Ratings
      </span>
      <div className="space-y-2 px-4 sm:px-6 pb-4">
        {ratings.map((rating) => (
          <label
            key={rating.stars}
            className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
          >
            <input
              type="checkbox"
              name="rating"
              checked={selectedRating === rating.stars}
              onChange={() =>
                onRatingChange(selectedRating === rating.stars ? null : rating.stars)
              }
              className="w-5 h-5 accent-puce border-gray-300 mr-3"
            />
            <div className="flex items-center space-x-2">
              <div className="flex items-center">{renderStars(rating.stars)}</div>
              <span className="text-sm text-gray-700">{rating.label}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

// Responsive Range Slider
const RangeSlider = ({
  min,
  max,
  value,
  setValue,
  label,
  unit = '',
  minLabel,
  maxLabel,
  step = 1,
}) => {
  const [dragging, setDragging] = useState(null);
  const sliderRef = useRef(null);

  const getPercent = (val) => ((val - min) / (max - min)) * 100;

  const getValueFromPosition = useCallback(
    (clientX) => {
      if (!sliderRef.current) return min;
      const rect = sliderRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return Math.round(min + percent * (max - min));
    },
    [min, max]
  );

  const handleDrag = useCallback(
    (e) => {
      if (!dragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const newValue = getValueFromPosition(clientX);
      if (dragging === 'min') setValue([Math.min(newValue, value[1] - step), value[1]]);
      else setValue([value[0], Math.max(newValue, value[0] + step)]);
    },
    [dragging, getValueFromPosition, setValue, value, step]
  );

  useEffect(() => {
    if (!dragging) return;
    const move = (e) => handleDrag(e);
    const up = () => setDragging(null);
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
    document.addEventListener('touchmove', move);
    document.addEventListener('touchend', up);
    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', up);
    };
  }, [dragging, handleDrag]);

  return (
    <div className="w-full px-4 sm:px-6 py-4">
      <label className="block mb-2 text-base sm:text-lg font-medium text-gray-800">{label}</label>
      <div className="relative h-8" ref={sliderRef}>
        <div className="absolute w-full h-2 bg-gray-200 rounded-full top-1/2 -translate-y-1/2" />
        <div
          className="absolute h-2 bg-puce rounded-full top-1/2 -translate-y-1/2"
          style={{
            left: `${getPercent(value[0])}%`,
            width: `${getPercent(value[1]) - getPercent(value[0])}%`,
          }}
        />
        {['min', 'max'].map((type, i) => (
          <div
            key={type}
            className="absolute w-8 h-8 bg-puce border-4 border-white rounded-full shadow-lg cursor-pointer flex items-center justify-center
            -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform z-10"
            style={{
              left: `${getPercent(value[i])}%`,
              top: '50%',
              touchAction: 'none',
            }}
            onMouseDown={() => setDragging(type)}
            onTouchStart={() => setDragging(type)}
            tabIndex={0}
            aria-label={type === 'min' ? 'Minimum value' : 'Maximum value'}
          />
        ))}
      </div>
      <div className="flex justify-between text-gray-700 mt-2 text-sm">
        <span>{minLabel ?? `${unit}${value[0]}`}</span>
        <span>{maxLabel ?? `${unit}${value[1]}`}</span>
      </div>
    </div>
  );
};

const FilterSection = ({ filters, onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([filters.priceMin || 0, filters.priceMax || 1000]);
  const [radiusRange, setRadiusRange] = useState([0, 100]);
  const [expanded, setExpanded] = useState({ badges: true, services: true, location: true });
  const [selectedRating, setSelectedRating] = useState(filters.rating || null);

  // NEW: Load services list from DB
  const [serviceOptions, setServiceOptions] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Expect: GET /api/services/categories -> { categories: ["Hair stylist","Lashes",...] }
        // Public endpoint - no auth required
        const res = await fetch('https://beautysalon-qq6r.vercel.app/api/services/categories');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        if (mounted) {
          const data = await res.json();
          const list = Array.isArray(data?.categories) ? data.categories : [];
          setServiceOptions(list);
        }
      } catch (e) {
        console.error('Failed to load services categories', e);
        if (mounted) setServiceOptions([]); // fallback to empty
      } finally {
        if (mounted) setLoadingServices(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const toggleSection = (section) =>
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));

  // Responsive dropdown for location
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(filters.location || 'Inglewood, Maine');
  const locations = [
    'Shiloh, Hawaii',
    'San Jose, South Dakota',
    'Inglewood, Maine',
    'Mesa, New Jersey',
    'Utica, Pennsylvania',
  ];

  // Push price to filters
  useEffect(() => {
    onFilterChange({
      ...filters,
      priceMin: priceRange[0],
      priceMax: priceRange[1]
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceRange]);

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    onFilterChange({
      ...filters,
      rating
    });
  };

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    onFilterChange({
      ...filters,
      location
    });
    setIsLocationOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden w-full max-w-sm mx-auto sm:mx-0">
      {/* Price Range */}
      <div className="border-b border-gray-200">
        <RangeSlider
          min={0}
          max={1000}
          value={priceRange}
          setValue={setPriceRange}
          label="Price"
          unit="$"
        />
      </div>

      {/* Services (now from DB) */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection('services')}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between text-left hover:bg-gray-50"
        >
          <span className="text-base sm:text-lg font-medium text-gray-900">Services</span>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              expanded.services ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expanded.services && (
          <div className="px-4 sm:px-6 pb-4">
            <div className="space-y-3 mb-4">
              {loadingServices ? (
                // skeletons while loading
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-5 bg-gray-100 rounded w-40 animate-pulse" />
                ))
              ) : serviceOptions.length === 0 ? (
                <div className="text-sm text-gray-500">No services found.</div>
              ) : (
                serviceOptions.map((service) => (
                  <label key={service} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.services?.includes(service) || false}
                      onChange={(e) => {
                        const newServices = e.target.checked
                          ? [...(filters.services || []), service]
                          : (filters.services || []).filter((s) => s !== service);
                        onFilterChange({ ...filters, services: newServices });
                      }}
                      className="w-5 h-5 accent-puce border-gray-300"
                    />
                    <span className="text-gray-700">{service}</span>
                  </label>
                ))
              )}
            </div>

            {/* keep See More button for your design (no behavior change) */}
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <span>See More</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Location */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection('location')}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between text-left hover:bg-gray-50"
        >
          <span className="text-base sm:text-lg font-medium text-gray-900">Location</span>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              expanded.location ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expanded.location && (
          <div className="px-4 sm:px-6 pb-4">
            <div className="relative">
              <button
                onClick={() => setIsLocationOpen((o) => !o)}
                className="w-full flex items-center justify-between px-3 py-2 text-left text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-puce"
              >
                <span className="text-sm">{selectedLocation}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isLocationOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isLocationOpen && (
                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg">
                  {['Shiloh, Hawaii','San Jose, South Dakota','Inglewood, Maine','Mesa, New Jersey','Utica, Pennsylvania'].map((loc) => (
                    <button
                      key={loc}
                      onClick={() => handleLocationChange(loc)}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        selectedLocation === loc ? 'font-semibold text-puce' : ''
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Distance Radius */}
      <div className="border-b border-gray-200">
        <RangeSlider
          min={0}
          max={1000}
          value={radiusRange}
          setValue={setRadiusRange}
          label="Distance Radius"
          unit=""
          minLabel={`${radiusRange[0]} Miles`}
          maxLabel={`${radiusRange[1]} Miles`}
        />
      </div>

      {/* Badges */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection('badges')}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between text-left hover:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-medium text-gray-800">Badges</span>
            <Info className="w-4 h-4 text-gray-400" />
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              expanded.badges ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expanded.badges && (
          <div className="px-4 sm:px-6 pb-4 space-y-3">
            {[
              { id: 'top-rated-plus', name: 'Top Rated Plus', color: 'fill-puce' },
              { id: 'top-rated', name: 'Top Rated', color: 'fill-rose-taupe' },
              { id: 'rising-talent', name: 'Rising Talent', color: 'fill-ash-grey' },
            ].map((badge) => (
              <label key={badge.id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.badges?.includes(badge.id) || false}
                  onChange={(e) => {
                    const newBadges = e.target.checked
                      ? [...(filters.badges || []), badge.id]
                      : (filters.badges || []).filter((b) => b !== badge.id);
                    onFilterChange({ ...filters, badges: newBadges });
                  }}
                  className="w-5 h-5 accent-puce border-gray-300"
                  disabled={true}
                />
                <div className="flex items-center gap-2">
                  <svg className="w-7 h-8" viewBox="0 0 24 24">
                    <polygon
                      points="12,2 20,7 20,17 12,22 4,17 4,7"
                      className={badge.color}
                    />
                  </svg>
                  <span className="text-gray-700">{badge.name}</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Customer Ratings */}
      <div>
        <CustomerRatingFilter 
          selectedRating={selectedRating}
          onRatingChange={handleRatingChange}
        />
      </div>
    </div>
  );
};

export default FilterSection;
