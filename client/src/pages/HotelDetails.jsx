import React,{useState,useContext} from 'react';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Custom/Navbar';
import Footer from '../components/Custom/Footer';
import hotels from '../data/hotels';
import BookingModal from './BookingModal';
import { AuthProvider,useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import HotelDetailsSkeleton from '../components/Loaders/HotelDetailsSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
/**
 * HotelDetails.jsx
 * ----------------
 * Provides a detailed view of a single hotel selected from the list page.
 *
 * Behaviour:
 * • Reads the dynamic URL segment (/hotels/:id) via useParams to identify which hotel should be displayed.
 * • Looks up the hotel information from the static hotels array.
 * • Renders the hotel details in a visually-rich layout.
 * • If the id is invalid, a graceful fallback screen is rendered with a link back to the hotels list.
 * • Otherwise, shows:
 *    – Hero section with a large banner image overlayed by the hotel name & location.
 *    – Description paragraph.
 *    – Placeholder “Proceed to Book” action (currently alerts; hook up to booking flow later).
 *
 * The component is strictly presentational – there is no API call at this stage.
 */
// build function to get the hotel details from the hotels.js file 
function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
const { user } = useAuth();
console.log("Logged-in user from useAuth:", user);



  const [loading, setLoading] = useState(true);


  // Ensure the page starts at the top whenever a new hotel is viewed
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

  // Simulate loading delay
  const timer = setTimeout(() => {
    setLoading(false);
  }, 1500); 

  return () => clearTimeout(timer); // Cleanup on unmount
  }, [id]);

  const hotel = hotels.find((h) => h.id === id); // Linear search through the static list based on the route param




  if (!hotel) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-black to-pink-900 text-white">
        <Navbar />
        <main className="flex flex-col flex-1 items-center justify-center">
          <h2 className="text-3xl font-bold mb-4">Hotel not found</h2>
          <button
            onClick={() => navigate('/hotels')}
            className="bg-gradient-to-r from-pink-600 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Back to Hotels
          </button>
        </main>
        {/* <Footer /> */}
      </div>
    );
  }

  return (
    // AnimatePresence for smooth transitions between the loader and actual content appearance
  <AnimatePresence mode="wait">
    {loading ? (
      <motion.div
        key="skeleton"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
      >
        <HotelDetailsSkeleton />
      </motion.div>
    ) : (
      <motion.div
        key="content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-black to-pink-900 overflow-x-hidden">
          <Navbar />
          <main className="flex flex-col flex-1 w-full items-center">
            {/* Hero image */}
            <section className="relative w-full h-72 md:h-96 overflow-hidden">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2">
                  {hotel.name}
                </h1>
                <span className="text-pink-300 text-lg md:text-xl">
                  {hotel.location}
                </span>
              </div>
            </section>

            {/* Details */}
            <section className="max-w-4xl w-full px-4 py-12 text-pink-100">
              <h2 className="text-2xl font-bold mb-4 text-white">About</h2>
              <p className="leading-relaxed mb-8 text-pink-200 whitespace-pre-line">
                {hotel.description}
              </p>

              <button
               onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                Proceed to Book
              </button>
          {showModal && user && (
            <BookingModal
              hotelId={hotel.id}
               userId={user?.id}
              onClose={() => setShowModal(false)}
            />
          )}
            </section>
          </main>
          {/* <Footer /> */}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

}

export default HotelDetails; 