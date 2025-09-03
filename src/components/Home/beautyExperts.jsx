import React, { useState } from 'react';
import { Heart, ChevronRight } from 'lucide-react';

const BeautyExpertCard = ({ 
  image, 
  name, 
  experience, 
  languages, 
  description,
  onFavorite,
  isFavorited = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [favorited, setFavorited] = useState(isFavorited);

  const handleFavorite = (e) => {
    e.stopPropagation();
    setFavorited(!favorited);
    onFavorite?.(name, !favorited);
  };

  return (
    <div 
      className=" rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
            favorited 
              ? 'bg-pink-500 text-white shadow-lg' 
              : 'bg-white/90 text-gray-600 hover:bg-pink-50 hover:text-pink-500'
          } backdrop-blur-sm`}
        >
          <Heart 
            size={18} 
            className={`transition-transform duration-200 ${
              favorited ? 'fill-current scale-110' : 'hover:scale-110'
            }`}
          />
        </button>

        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-3">
          {/* Name */}
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-rose-taupe  transition-colors duration-200">
            {name}
          </h3>

          {/* Experience */}
          <p className="text-gray-600 font-medium">
            {experience}
          </p>

          {/* Languages */}
          <div className="flex items-center gap-2">
            <span className="text-gray-700 font-medium">Languages:</span>
            <span className="text-gray-600">{languages}</span>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Action Button (appears on hover) */}
        <div className={`mt-4 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <button className="w-full bg-gradient-to-r from-rosy-brown to-puce text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 hover:from-rose-taupe hover:to-rose-taupe hover:shadow-lg flex items-center justify-center gap-2">
            Book Appointment
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const PopularBeautyExperts = () => {
  const [favorites, setFavorites] = useState(new Set());

  const handleFavorite = (name, isFavorited) => {
    const newFavorites = new Set(favorites);
    if (isFavorited) {
      newFavorites.add(name);
    } else {
      newFavorites.delete(name);
    }
    setFavorites(newFavorites);
  };

  const experts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop&crop=face",
      name: "Hinata Hyuga",
      experience: "5 Years Experience",
      languages: "English, Korean",
      description: "If You Want Japanese Style, Leave It To Us!"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
      name: "Hinata Hyuga",
      experience: "5 Years Experience",
      languages: "English, Korean",
      description: "If You Want Japanese Style, Leave It To Us!"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
      name: "Hinata Hyuga",
      experience: "5 Years Experience",
      languages: "English, Korean",
      description: "If You Want Japanese Style, Leave It To Us!"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
      name: "Hinata Hyuga",
      experience: "5 Years Experience",
      languages: "English, Korean",
      description: "If You Want Japanese Style, Leave It To Us!"
    }
  ];

  return (
    <div className=" mx-auto max-w-[95%] px-6 pt-20 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Popular Beauty Experts</h1>
        <button className="flex items-center gap-2 text-gray-600 hover:text-rose-taupe  transition-colors duration-200 font-medium">
          Show all
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {experts.map((expert, index) => (
          <div
            key={expert.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <BeautyExpertCard
              image={expert.image}
              name={expert.name}
              experience={expert.experience}
              languages={expert.languages}
              description={expert.description}
              onFavorite={handleFavorite}
              isFavorited={favorites.has(expert.name)}
            />
          </div>
        ))}
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default PopularBeautyExperts;