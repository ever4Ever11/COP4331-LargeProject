import HomeImg from "../assets/1.png";
import { motion } from "framer-motion";
import { slideUp, slideBottom } from "../utility/animation";

const Home1 = () => {
  return (
      <div className="container">
         <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
          {/* Text content section */}
          <div className="space-y-5 flex flex-col justify-center items-center text-center md:text-left py-20 px-10 md:pr-24 md:py-0 md:px-0 md:items-start">
            <motion.div
              variants={slideUp({delay:0.2})}
              initial="initial"
              animate="animate"
              className="text-4xl xl:text-5xl font-bold"
            >
              Unlock your{" "} <br />
              <span className="text-cyan-700">passion</span>
            </motion.div>
            <motion.p
              variants={ slideBottom ({delay:0.4})}
              initial="initial"
              animate="animate"
              className="text-4xl xl:text-5xl font-bold"
            >
              It is travel time 
            </motion.p>
          </div>
          {/*  Image section */}
          <div className="flex justify-center items-center">
            <motion.img
              initial={{
                opacity: 0,
                x: 100,
              }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              src={HomeImg}
              alt=""
              className="w-[90%] md:w-[550px] xl:w-[600px] md:!scale-100"
            />
          </div>
        </div>     
      </div>   
  );
};

export default Home1 ;
