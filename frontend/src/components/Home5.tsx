import { FaMobile } from "react-icons/fa";
import { motion } from "framer-motion";
import HomeImg from "../assets/4.png";
import { slideUp, slideBottom } from "../utility/animation";


const Home5 = () => {
  return (
    <>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[700px] md:min-h-[600px]">
          {/* Image section */}
          <div className="flex justify-center items-center">
            <motion.img
              initial={{
                opacity: 0,
                x: -100,
              }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              src={HomeImg}
              alt=""
              className="rounded-full w-[90%] md:w-[550px] xl:w-[600px] md:!scale-50"
            />
          </div>
          {/* Text content section */}
          <div className="space-y-8 flex flex-col justify-center items-center text-center md:text-left py-20 px-10 md:pl-10 md:py-0 md:px-0 md:items-start xl:max-w-[400px] mx-auto">
            <motion.p
              variants={slideUp({delay:0.2})}
              initial="initial"
              whileInView="animate"
              className="uppercase"
            >
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="text-4xl xl:text-5xl font-semibold text-black"
            >
              Let's  <br />
              start your  <br />
              journey from <br />
              <span className="text-cyan-700">wayfinder</span> 
            </motion.h1>
          </div>
        </div>
        <div className="bg-cyan-700" >
        <motion.div
          variants={slideBottom({delay:0.2})}
          initial="initial"
          whileInView="animate"
          className="text-center space-y-10 py-10"
        >
          <div className="space-y-4">
            <p className="text-white text-3xl md:text-4xl font-bold">Travel with Us</p>
          </div>
          <div className=" space-y-5">
             <div className="flex flex-row justify-center gap-3">
              <p className="text-white font-semi text-lg">Downdload our Mobile App</p>
              <FaMobile className="text-white"/>
              </div>
          </div>
        </motion.div>
      </div>
      </div>
    </>    
  );
};

export default Home5;
