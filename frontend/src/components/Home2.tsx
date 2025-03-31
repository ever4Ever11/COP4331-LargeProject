import HomeImg from "../assets/2.png";
import Img1 from "../assets/icon/1.png";
import Img2 from "../assets/icon/2.png";
import Img3 from "../assets/icon/3.png";
import { motion } from "framer-motion";

const Home2 = () => {
  return (
    <>
      <div className="container">
        <div className="py-12 flex justify-between items-center ">
        {/* Text content section */}
          <h1 className="text-4xl xl:text-5xl font-bold max-w-[550px]">
            Your best <br/>
            tavel {" "}
            <span className="text-cyan-700">partner</span>
          </h1>
        </div>
        {/*  Image section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img
              src={HomeImg}
              alt=""
              className="rounded-full w-[300px] mx-auto md:max-w-[400px]"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-[300px] mx-auto space-y-4"
          >
            <img src={Img1} alt="image" className="rounded-full w-20 border-2 border-black" />
            <p className="font-semibold text-xl">Search</p>
            <p className="text-cyan-700 pl-6 border-l-2 border-cyan-700 italic">
            favorites<br/>
            destinations
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-[300px] mx-auto space-y-4"
          >
            <img src={Img2} alt="image" className="rounded-full w-20 border-2 border-black" />
            <p className="font-semibold text-xl">Find</p>
            <p className="text-cyan-700 pl-6 border-l-2 border-cyan-700 italic">
            best travel deals          
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="max-w-[300px] mx-auto space-y-4"
          >
            <img src={Img3} alt="image" className="rounded-full w-20 border-2 border-black" />
            <p className="font-semibold text-xl">Bookmark</p>
            <p className="text-cyan-700 pl-6 border-l-2 border-cyan-700 italic">
            tourism<br/>
            restaurants           
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Home2;


