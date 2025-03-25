import { Variants } from 'framer-motion';

// Define the types for the function arguments and return values
interface SlideProps {
  delay: number;
}

export const slideUp = ({ delay }: SlideProps): Variants => {
  return {
    initial: {
      y: 50,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: delay,
      },
    },
  };
};

export const slideBottom = ({ delay }: SlideProps): Variants => {
  return {
    initial: {
      y: -100,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: delay,
      },
    },
  };
};

