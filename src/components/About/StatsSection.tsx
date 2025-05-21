import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Briefcase, GraduationCap } from 'lucide-react';

const stats = [
  { icon: Calendar, label: "Années d'expérience", value: "7+" },
  { icon: Briefcase, label: "Projets réalisés", value: "20+" },
  { icon: GraduationCap, label: "Diplômes", value: "2" },
];

export function StatsSection() {
  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                  <stat.icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">
                {stat.value}
              </h3>
              <p className="text-lg text-center text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}