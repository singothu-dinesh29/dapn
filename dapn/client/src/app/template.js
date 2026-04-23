'use client';
import { motion } from 'framer-motion';

export default function Template({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
                duration: 0.6, 
                ease: [0.33, 1, 0.68, 1] // Quintic ease-out for a premium feel
            }}
        >
            {children}
        </motion.div>
    );
}
