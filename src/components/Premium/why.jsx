import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    color: "bg-rose-taupe", // puce/rose-taupe
    title: "Boost Your Profile",
    desc: "Get Featured And Attract More Clients",
  },
  {
    color: "bg-puce", // pale-dogwood
    title: "Showcase Your Work",
    desc: "Upload Unlimited Portfolio Images & Videos",
  },
  {
    color: "bg-ash-grey", // ash-grey
    title: "Manage Your Appointments",
    desc: "Get Bookings Directly Through The Platform",
  },
  {
    color: "bg-pale-dogwood", // light orange
    title: "Earn More",
    desc: "Join Thousands Of Beauty Professionals Growing Their Business Online",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 80 } },
};

const WhyChoosePremium = () => (
  <motion.section
    className="w-full  mx-auto px-4 py-8 sm:py-12"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.4 }}
    variants={containerVariants}
  >
    <motion.h2
      className="text-2xl sm:text-3xl md:text-5xl font-bold text-black mb-3 sm:mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Why Choose Our <br/>Premium Plan
    </motion.h2>
    <motion.p
      className="text-gray-700 text-base sm:text-lg mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      Join thousands of beauty experts growing their business <br></br>with Premium!
    </motion.p>
    <motion.ul className="space-y-6" variants={containerVariants}>
      {features.map((f, i) => (
        <motion.li
          key={f.title}
          className="flex items-start gap-3"
          variants={itemVariants}
        >
          <span
            className={`flex-shrink-0 w-4 h-4 mt-1 rounded-full ${f.color}`}
            aria-hidden="true"
          />
          <div>
            <span className="block font-semibold text-gray-900 text-base sm:text-lg mb-0.5">
              {f.title}
            </span>
            <span className="block text-gray-600 text-sm sm:text-base">
              {f.desc}
            </span>
          </div>
        </motion.li>
      ))}
    </motion.ul>
  </motion.section>
);

export default WhyChoosePremium;
