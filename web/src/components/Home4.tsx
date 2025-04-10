import Img1 from "../assets/icon/4.jpeg";
import Img2 from "../assets/icon/5.jpeg";
import Img3 from "../assets/icon/6.jpeg";
import { motion } from "framer-motion";
import { slideUp, slideBottom } from "../utility/animation";


const Home4 = () => {
  return (
    <>
      <div className="container bg-cyan-700 py-14 rounded-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <motion.div
              variants={slideBottom({delay:0.2})}
              initial="initial"
              whileInView="animate"
              className="bg-white shadow-xl px-5 py-10 text-center flex flex-col justify-center items-center gap-5 md:max-w-[280px] mx-auto"
            >
              <img
                src={Img1}
                alt=""
                className="w-20 h-20 rounded-full"
              />
              <p className="text-yellow-400 font-semibold text-xl">★★★★★</p>
              <p className="text-sm text-black italic">
              "I love how easy it is to navigate this site! 
              The travel itineraries are incredibly helpful and helped me plan my trip with ease."
              </p>
            </motion.div>
            <motion.div
              variants={slideUp({delay:0.4})}
              initial="initial"
              whileInView="animate"
              className="bg-white shadow-md px-5 py-10 text-center flex flex-col justify-center items-center gap-5 md:max-w-[280px] mx-auto"
            >
              <img
                src={Img2}
                alt=""
                className="w-20 h-20 rounded-full"
              />
              <p className="text-yellow-400 font-semibold text-xl">★★★★★</p>
              <p className="text-sm text-black italic">
              "This website has been a lifesaver for my travels! 
              The tips, recommendations, and itinerary options are all top-notch."
              </p>
            </motion.div>
            <motion.div
              variants={slideBottom({delay:0.2})}
              initial="initial"
              whileInView="animate"
              className="bg-white shadow-md px-5 py-10 text-center flex flex-col justify-center items-center gap-5 md:max-w-[280px] mx-auto"
            >
              <img
                src={Img3}
                alt=""
                className="w-20 h-20 rounded-full"
              />
              <p className="text-yellow-400 font-semibold text-xl">★★★★</p>
              <p className="text-sm text-black italic">
              "Such a fantastic resource for planning trips! 
              The information is reliable, and I always find great recommendations on this site."
              </p>
              
            </motion.div>
          </div>
        </div>

    </>
  );
};

export default Home4 ;
