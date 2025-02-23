import { motion, useScroll, useTransform, useSpring  } from "framer-motion";

interface Section {
  id: string;
  title: string;
  bgImage: string;
}

export default function ScrollFade({ sections }: { sections: Section[] }) {
  const { scrollYProgress } = useScroll();
  const totalSections = sections.length;

  return (
    <div
      className="relative w-full"
      style={{ height: `${totalSections * 100}vh`, overflow: "hidden" }}
    >
      {sections.map((section, index) => {
        const start = index / totalSections;
        const end = (index + 1) / totalSections;

        // Default fade in and out behavior
        let rawOpacity = useTransform(
          scrollYProgress,
          // Instead of [start - 0.1, start, end - 0.1, end], 
          // tighten or shift to overlap more:
          [start - 0.1, start, end - 0.1, end],
          [0, 1, 1, 0],

        );


        if (index === 0) {
          // Start fully visible, then fade out with overlap
          rawOpacity = useTransform(
            scrollYProgress,
            [start, end - 0.1, end],
            [1, 1, 0]
          );
        }

        if (index === totalSections - 1) {
          rawOpacity = useTransform(
            scrollYProgress,
            [start, start + 0.1, end],
            [0, 1, 1]
          );
        }

        let opacity = useSpring(rawOpacity, {
          damping: 20,
          stiffness: 100,
        });

        return (
          <motion.div
            key={section.id}
            style={{
              backgroundImage: `url(${section.bgImage})`,
              opacity,
            }}
            className="w-screen h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center justify-center w-full h-full text-white text-center p-8 bg-black bg-opacity-50">
              <h1 className="text-5xl font-bold mb-4">{section.title}</h1>
              <p className="text-lg max-w-2xl">
                Discover the best {section.title.toLowerCase()} available for rental.
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
