import Layout from "../components/Layout";
import ScrollFade from "../components/ScrollFade";

// Define section structure
interface Section {
  id: string;
  title: string;
  bgImage: string;
}

// Sections list (no hero section)
const SECTIONS: Section[] = [
  { id: 'all', title: 'All Peripherals', bgImage: '/images/all-peripherals.jpg' },
  { id: "mice", title: "Mice", bgImage: "/images/mice.jpg" },
  { id: "keyboards", title: "Keyboards", bgImage: "/images/keyboards.jpg" },
  { id: "headsets", title: "Headsets", bgImage: "/images/headsets.jpg" },
  { id: "mousepads", title: "Mousepads", bgImage: "/images/mousepads.jpg" },
];

export default function Home() {
  return (
    <Layout title="Home">
      <ScrollFade sections={SECTIONS} />
    </Layout>
  );
}
