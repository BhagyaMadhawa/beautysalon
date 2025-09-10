import { useState, useEffect } from "react";
import { FaPinterestP, FaFacebookF, FaTwitter, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { api } from '../../lib/api';

export default function ProfileInfo({ salonId }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, [salonId]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      // Fetch multiple data sources in parallel
      const [salonData, socialLinksData, addressesData, hoursData, certificationsData/*, keyInfoData, languagesData*/] = await Promise.all([
        api(`/api/salons/${salonId}`),
        api(`/api/salons/${salonId}/social-links`),
        api(`/api/salons/${salonId}/addresses`),
        api(`/api/salons/${salonId}/hours`),
        api(`/api/salons/${salonId}/certifications`),
        //api(`/api/salons/${salonId}/key-info`),
        //api(`/api/salons/${salonId}/languages`)
      ]);
      const salon = salonData.salon || {};
      console.log('salon data:', salonData);
      const socialLinks = socialLinksData.socialLinks || [];
      const addresses = addressesData.addresses || [];
      const operatingHours = hoursData.operatingHours || [];
      const certifications = certificationsData.certifications || [];
      // const keyInfo = keyInfoData.keyInfo || {};
      // const languages = languagesData.languages || [];

      setProfileData({
        certifications: certifications,
        // keyInfo: keyInfo,
        // languages: languages.map(lang => lang.language || lang),
        socialMedia: socialLinks.map(link => ({
          platform: link.platform,
          url: link.url,
          color: getPlatformColor(link.platform),
          icon: getPlatformIcon(link.platform)
        })),
        storeInfo: {
          name: salon.name || "SOONSIKI Hair Hongdae | Romanticus Branch",
          phone: salon.phone || "+44 45747 587576",
          address: addresses[0] ? `${addresses[0].full_address}, ${addresses[0].city}, ${addresses[0].country}` : "Shibuya Tokyo, Japan"
        },
        hours: operatingHours.length > 0 
          ? operatingHours.map(hour => ({
              day: hour.day_of_week,
              hours: hour.is_opened ? `${hour.start_time} - ${hour.end_time}` : 'Closed'
            }))
          : [
              { day: "Monday", hours: "10:00 AM - 06:00 PM" },
              { day: "Tuesday", hours: "10:00 AM - 06:00 PM" },
              { day: "Wednesday", hours: "10:00 AM - 06:00 PM" },
              { day: "Thursday", hours: "10:00 AM - 06:00 PM" },
              { day: "Friday", hours: "10:00 AM - 06:00 PM" },
              { day: "Saturday", hours: "Closed" },
              { day: "Sunday", hours: "Closed" }
            ]
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError('Failed to load profile information');
      // Fallback to mock data
      setProfileData({
        certifications: [
          {
            title: "L'Oréal Professional Academy",
            description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum."
          }
        ],
        keyInfo: {
          joined_on: "May 2006",
          stylist_career: "5 years",
          good_image: "Popular and loved"
        },
        languages: ["English", "Korean"],
        socialMedia: [
          { platform: "Pinterest", color: "bg-red-600", icon: <FaPinterestP /> },
          { platform: "Facebook", color: "bg-blue-600", icon: <FaFacebookF /> },
          { platform: "Twitter", color: "bg-blue-400", icon: <FaTwitter /> },
          { platform: "X", color: "bg-black", icon: <FaXTwitter /> },
          { platform: "Instagram", color: "bg-pink-500", icon: <FaInstagram /> }
        ],
        storeInfo: {
          name: "SOONSIKI Hair Hongdae | Romanticus Branch",
          phone: "+44 45747 587576",
          address: "Shibuya Tokyo, Japan"
        },
        hours: [
          { day: "Monday", hours: "10:00 AM - 06:00 PM" },
          { day: "Tuesday", hours: "10:00 AM - 06:00 PM" },
          { day: "Wednesday", hours: "10:00 AM - 06:00 PM" },
          { day: "Thursday", hours: "10:00 AM - 06:00 PM" },
          { day: "Friday", hours: "10:00 AM - 06:00 PM" },
          { day: "Saturday", hours: "Closed" },
          { day: "Sunday", hours: "Closed" }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const getPlatformColor = (platform) => {
    const colors = {
      pinterest: "bg-red-600",
      facebook: "bg-blue-600",
      twitter: "bg-blue-400",
      x: "bg-black",
      instagram: "bg-pink-500"
    };
    return colors[platform.toLowerCase()] || "bg-gray-600";
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      pinterest: <FaPinterestP />,
      facebook: <FaFacebookF />,
      twitter: <FaTwitter />,
      x: <FaXTwitter />,
      instagram: <FaInstagram />
    };
    return icons[platform.toLowerCase()] || null;
  };

  if (loading) {
    return (
      <div className="w-full mx-auto bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden mb-4">
        <div className="animate-pulse p-4">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-6"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <div className="w-full mx-auto bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden mb-4 p-4 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto bg-white rounded-xl shadow-sm hover:shadow-xl transition-all border border-gray-300 duration-300 overflow-hidden mb-4">
      {/* Certifications */}
      <div className="px-4">
        <h3 className="text-2xl font-semibold font-semibold text-black mt-4">Certifications</h3>
        {profileData.certifications.length > 0 ? (
          profileData.certifications.map((cert, index) => (
            <div key={index} className="mb-4">
              <h4 className="text-xl font-bold font-medium text-black mb-1">{cert.title}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{cert.description}</p>
            </div>
          ))
        ) : (
          <div className="mb-4">
            <h4 className="text-xl font-bold font-medium text-black mb-1">L'Oréal Professional Academy</h4>
            <p className="text-xs text-gray-600 leading-relaxed">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.</p>
          </div>
        )}
        <hr className="my-4 border-t-2 border-gray-300 w-[98%] mx-auto" />
      </div>

      {/* Key Information */}
      <div className="px-4">
        <h3 className="text-XL font-semibold text-black mb-3">Key Information</h3>
        <div className="space-y-2">
          {profileData.keyInfo.joined_on && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Joined on</span>
              <span className="text-sm text-gray-800">{profileData.keyInfo.joined_on}</span>
            </div>
          )}
          {profileData.keyInfo.stylist_career && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Stylist career</span>
              <span className="text-sm text-gray-800">{profileData.keyInfo.stylist_career}</span>
            </div>
          )}
          {profileData.keyInfo.good_image && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Good image</span>
              <span className="text-sm text-gray-800">{profileData.keyInfo.good_image}</span>
            </div>
          )}
          {Object.keys(profileData.keyInfo).length === 0 && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Joined on</span>
                <span className="text-sm text-gray-800">May 2006</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Stylist career</span>
                <span className="text-sm text-gray-800">5 years</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Good image</span>
                <span className="text-sm text-gray-800">Popular and loved</span>
              </div>
            </>
          )}
        </div>
        <hr className="my-4 border-t-2 border-gray-300 w-[98%] mx-auto" />
      </div>

      {/* Languages */}
      <div className="px-6 ">
        <h3 className="text-xl font-semibold text-black mb-3">Languages</h3>
        <div className="flex flex-wrap gap-2">
          {profileData.languages.map((language, index) => (
            <button
              key={index}
              className="px-3 py-1 border w-[25%] border-gray-300 text-gray-600 hover:border-puce text-sm rounded-full"
            >
              {language}
            </button>
          ))}
        </div>
        <hr className="my-4 border-t-2 border-gray-300 w-[98%] mx-auto" />
      </div>

      {/* Follow me on */}
      <div className="px-6 ">
        <h3 className="text-xl font-semibold text-black mb-3">Follow me on</h3>
        <div className="flex gap-3">
          {profileData.socialMedia.map((social, index) => (
            <a
              key={index}
              href={social.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-8 h-8 ${social.color} rounded-full flex items-center justify-center text-white text-xs font-bold hover:opacity-80 transition-opacity`}
            >
              {social.icon}
            </a>
          ))}
        </div>
        <hr className="my-4 border-t-2 border-gray-300 w-[98%] mx-auto" />
      </div>

      {/* Store Info */}
      <div className="px-6 ">
        <h3 className="text-xl font-semibold text-black mb-3">Store info</h3>
        <div className="space-y-2">
          <p className="text-sm text-gray-800">{profileData.storeInfo.name}</p>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">📍</span>
            <span className="text-sm text-gray-800">{profileData.storeInfo.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">📞</span>
            <span className="text-sm text-gray-800">{profileData.storeInfo.phone}</span>
          </div>
        </div>
        <hr className="my-4 border-t-2 border-gray-300 w-[98%] mx-auto" />
      </div>

      {/* Hours of Operation */}
      <div className="px-6 py-4">
        <h3 className="text-black font-semibold text-black mb-3">Hours Of Operation</h3>
        <div className="space-y-4">
          {profileData.hours.map((schedule, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{schedule.day}</span>
              <span className={`text-sm ${schedule.hours === 'Closed' ? 'text-red-600' : 'text-gray-800'}`}>
                {schedule.hours}
              </span>
            </div>
          ))}
        </div>
        <hr className="my-4 border-t-2 border-gray-300 w-[98%] mx-auto" />
      </div>

      {/* Map */}
      <div className="px-6 pb-8">
        <div className="h-48 bg-green-100 rounded-lg overflow-hidden">
          <iframe
            title="Google Map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=35.6595,139.7005&hl=en&z=14&output=embed"
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
