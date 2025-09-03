import { useState, useEffect } from "react";
import { api } from '../../lib/api';

export default function FAQ({ salonId }) {
  const [openItems, setOpenItems] = useState({});
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFaqs();
  }, [salonId]);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const data = await api(`/api/salons/${salonId}/faqs`);
      setFaqData(data.faqs || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      setError('Failed to load FAQs. Please try again later.');
      // Fallback to mock data
      setFaqData([
        {
          id: 1,
          question: "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit",
          answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
          id: 2,
          question: "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit",
          answer: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        },
        {
          id: 3,
          question: "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit",
          answer: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (loading) {
    return (
      <div className="w-full mx-auto px-4 sm:px-6 py-1 mb-4 flex-shrink">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">FAQ'S</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-xl overflow-hidden animate-pulse">
              <div className="w-full px-6 py-5">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 py-1 mb-4 flex-shrink">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">FAQ'S</h1>
      
      {error && faqData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      <div className="space-y-4">
        {faqData.map((item) => (
          <div
            key={item.id}
            className="bg-gray-100 rounded-xl overflow-hidden transition-all duration-200 ease-in-out"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-200 transition-colors duration-150"
            >
              <span className="text-gray-700 font-medium pr-4">
                {item.question}
              </span>
              <div className="flex-shrink-0">
                <div
                  className={`transform transition-transform duration-200 text-2xl font-light text-gray-600 ${
                    openItems[item.id] ? 'rotate-45' : ''
                  }`}
                >
                  +
                </div>
              </div>
            </button>
            
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openItems[item.id] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
