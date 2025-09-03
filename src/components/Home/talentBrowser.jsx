import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import cat_icon from '../../assets/category_icon.png';

const TalentBrowser = ({ 
  categories = [
    { id: 1, title: 'Nails', description: 'Explore Top-Rated Nail Salons', icon: '💅' },
    { id: 2, title: 'Hair', description: 'Find Expert Hairstylists Near You', icon: '💇' },
    { id: 3, title: 'Lashes', description: 'Discover Lash Extension Specialists', icon: '👁️' },
    { id: 4, title: 'Lashes', description: 'Discover Lash Extension Specialists', icon: '👁️' },
    { id: 5, title: 'Nails', description: 'Explore Top-Rated Nail Salons', icon: '💅' },
    { id: 6, title: 'Nails', description: 'Explore Top-Rated Nail Salons', icon: '💅' },
    { id: 7, title: 'Nails', description: 'Explore Top-Rated Nail Salons', icon: '💅' },
    { id: 8, title: 'Nails', description: 'Explore Top-Rated Nail Salons', icon: '💅' }
  ],

  onCategoryClick = (category) => console.log('Category clicked:', category),
  onShowAll = () => console.log('Show all clicked'),
  className = ''
}) => {
  return (
    <div className={`w-full max-w-[95%] mx-auto  px-6 pt-20 ${className}`}>
      {/* Browse Talent By Category Section */}
      <div className="mb-0">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Browse Talent By Category</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => onCategoryClick(category)}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-gray-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 flex items-center justify-center">
                  {/* <span className="text-xl">{category.icon}</span> */}
                  <img 
                    src={cat_icon}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{category.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Beauty Experts Section */}
      <div className="flex items-center justify-end mb-6">
 
</div>
     
    </div>
  );
};

export default TalentBrowser;