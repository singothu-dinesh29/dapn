'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, Send, User } from 'lucide-react';

const reviewsData = [
    { 
        id: 1, 
        name: 'Hemanth', 
        rating: 4, 
        comment: "The editing quality was really good, especially the color grading. Just a small delay in delivery, but overall I'm happy with the result.", 
        date: 'Oct 12, 2026' 
    },
    { 
        id: 2, 
        name: 'Sai Pradeep', 
        rating: 4, 
        comment: "The PPT design came out clean and professional. Communication was smooth, just felt a bit more revisions could’ve been quicker.", 
        date: 'Oct 10, 2026' 
    },
    { 
        id: 3, 
        name: 'Vardhan', 
        rating: 5, 
        comment: "Website was delivered exactly how I imagined. Clean design, fast performance, and no issues at all. Really impressed with the work.", 
        date: 'Oct 15, 2026' 
    }
];

const ReviewSection = () => {
    const [reviews, setReviews] = useState(reviewsData);
    const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const reviewToAdd = {
            ...newReview,
            id: Date.now(),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        };
        setReviews([reviewToAdd, ...reviews]);
        setNewReview({ name: '', rating: 5, comment: '' });
        setIsFormOpen(false);
    };

    return (
        <section 
            id="reviews" 
            className="mt-32 py-24 -mx-6 px-6 relative overflow-hidden rounded-[60px]"
            style={{ 
                backgroundImage: "url('/section_bg.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-[0.4em] text-zinc-400 mb-4 font-mono">Social Proof</h4>
                        <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-black uppercase italic">Real People. Real Feedback.</h3>
                    </div>
                    <button 
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        className="h-14 px-8 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-zinc-800 transition-all shadow-xl shadow-black/10"
                    >
                        {isFormOpen ? 'Close Form' : 'Leave a Review'}
                    </button>
                </div>

                <AnimatePresence>
                    {isFormOpen && (
                        <motion.form 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            onSubmit={handleSubmit}
                            className="bg-white/80 backdrop-blur-xl p-10 rounded-[32px] border border-zinc-200/50 shadow-2xl mb-16 overflow-hidden"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Your Name</label>
                                    <input 
                                        required
                                        className="w-full h-14 px-6 bg-white border border-zinc-100 rounded-2xl outline-none focus:border-amber-500 font-medium text-sm transition-all"
                                        placeholder="E.g. Hemanth"
                                        value={newReview.name}
                                        onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Star Rating</label>
                                    <div className="flex gap-2 h-14 items-center">
                                        {[1,2,3,4,5].map((star) => (
                                            <button 
                                                key={star}
                                                type="button"
                                                onClick={() => setNewReview({...newReview, rating: star})}
                                                className={`p-2 transition-all ${newReview.rating >= star ? 'text-amber-500' : 'text-zinc-200'}`}
                                            >
                                                <Star size={24} fill={newReview.rating >= star ? 'currentColor' : 'none'} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Share your experience</label>
                                    <textarea 
                                        required
                                        rows={4}
                                        className="w-full p-6 bg-white border border-zinc-100 rounded-2xl outline-none focus:border-amber-500 font-medium text-sm transition-all resize-none"
                                        placeholder="What did you think of our work?"
                                        value={newReview.comment}
                                        onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="mt-8 h-14 w-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full flex items-center justify-center gap-2 hover:bg-amber-600 transition-colors">
                                Submit Feedback <Send size={14} />
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((rev) => (
                        <motion.div 
                            key={rev.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group relative bg-gradient-to-br from-zinc-50 to-white p-10 rounded-[40px] border border-zinc-100 shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500"
                        >
                            {/* Quotation Mark Icon */}
                            <div className="absolute top-8 right-10 text-zinc-100 transition-colors group-hover:text-amber-500/10">
                                <Quote size={60} fill="currentColor" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex gap-1 mb-8">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            size={14} 
                                            className={i < rev.rating ? 'text-amber-500 drop-shadow-[0_0_8px_#f59e0b44]' : 'text-zinc-200'} 
                                            fill={i < rev.rating ? 'currentColor' : 'none'}
                                        />
                                    ))}
                                </div>

                                <p className="text-zinc-600 text-base leading-relaxed mb-12 font-medium italic">
                                    "{rev.comment}"
                                </p>

                                <div className="flex items-center gap-4 pt-8 border-t border-zinc-100/50">
                                    <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-600 border border-amber-500/20 shadow-inner">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h5 className="font-black text-lg tracking-tighter text-black uppercase">{rev.name}</h5>
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{rev.date}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ReviewSection;
