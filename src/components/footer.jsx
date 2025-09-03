import React from 'react';
import { Mail, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = ({
  logo = "Logo Here",
  description = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the standard dummy text.",
  quickLinks = [
    { label: "Home", href: "#" },
    { label: "About Us", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "Success Stories", href: "#" },
    { label: "Contact Us", href: "#" }
  ],
  popularServices = [
    { label: "Nails", href: "#" },
    { label: "Hair", href: "#" },
    { label: "Lashes", href: "#" },
    { label: "Semi-Permanent Makeup", href: "#" },
    { label: "Hair Removal", href: "#" }
  ],
  moreServices = [
    { label: "Nails", href: "#" },
    { label: "Hair", href: "#" },
    { label: "Lashes", href: "#" },
    { label: "Semi-Permanent Makeup", href: "#" },
    { label: "Hair Removal", href: "#" }
  ],
  moreLinks = [
    { label: "Help Center", href: "#" },
    { label: "FAQ's", href: "#" },
    { label: "Blogs", href: "#" }
  ],
  socialLinks = {
    email: "mailto:info@example.com",
    facebook: "#",
    instagram: "#",
    linkedin: "#"
  },
  copyright = "Copyrights © 2025 .All Rights Reserved",
  legalLinks = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of service", href: "#" }
  ],
  onLinkClick = (href, label) => console.log(`Clicked: ${label}`)
}) => {
  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="max-[80%] mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">{logo}</h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
              {description}
            </p>

            {/* Social Icons */}
            <div className="flex space-x-3 sm:space-x-4">
              <a
                aria-label="Email"
                href={socialLinks.email}
                className="w-11 h-11 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  onLinkClick(socialLinks.email, 'Email');
                }}
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                aria-label="Facebook"
                href={socialLinks.facebook}
                className="w-11 h-11 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  onLinkClick(socialLinks.facebook, 'Facebook');
                }}
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                aria-label="Instagram"
                href={socialLinks.instagram}
                className="w-11 h-11 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  onLinkClick(socialLinks.instagram, 'Instagram');
                }}
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                aria-label="LinkedIn"
                href={socialLinks.linkedin}
                className="w-11 h-11 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  onLinkClick(socialLinks.linkedin, 'LinkedIn');
                }}
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
                    onClick={(e) => {
                      e.preventDefault();
                      onLinkClick(link.href, link.label);
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Services */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4">Popular Services</h3>
            <ul className="space-y-2 sm:space-y-3">
              {popularServices.map((service, index) => (
                <li key={index}>
                  <a
                    href={service.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
                    onClick={(e) => {
                      e.preventDefault();
                      onLinkClick(service.href, service.label);
                    }}
                  >
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* More Services Column */}
          <div>
            {/* For accessibility, use sr-only instead of opacity-0 */}
            <h3 className="sr-only">More Services</h3>
            <ul className="space-y-2 sm:space-y-3">
              {moreServices.map((service, index) => (
                <li key={index}>
                  <a
                    href={service.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
                    onClick={(e) => {
                      e.preventDefault();
                      onLinkClick(service.href, service.label);
                    }}
                  >
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4">More</h3>
            <ul className="space-y-2 sm:space-y-3">
              {moreLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
                    onClick={(e) => {
                      e.preventDefault();
                      onLinkClick(link.href, link.label);
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-xs sm:text-sm mb-2 md:mb-0 text-center md:text-left">{copyright}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 md:gap-x-6">
              {legalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    onLinkClick(link.href, link.label);
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
