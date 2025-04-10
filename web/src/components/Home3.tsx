import HomeImg from "../assets/3.webp";
import { motion } from "framer-motion";
import { slideUp } from "../utility/animation";

const Home3 = () => {
  return (
    <>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[700px] md:min-h-[600px]">
          {/*  Image section */}
          <div className="flex justify-center items-center">
            <motion.img
              initial={{
                opacity: 0,
                x: 100,
              }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              src={HomeImg}
              alt=""
              className="rounded-xl w-[90%] md:w-[550px] xl:w-[600px] md:!scale-100"
            />
          </div>
          {/* Text content section */}
          <div className="space-y-8 flex flex-col justify-center items-center text-center">
            <motion.h1
              variants={slideUp({delay:0.2})}
              initial="initial"
              whileInView="animate"
              className="text-4xl xl:text-5xl font-semibold text-black"
            >
              <h1 className="text-4xl xl:text-5xl font-bold max-w-[550px]">
               Your best <br/>
               tavel {" "}
              <span className="text-cyan-700">partner</span>
          </h1>
            </motion.h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home3 ;
