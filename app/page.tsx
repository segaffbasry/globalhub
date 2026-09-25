import { Shell } from "@/components/chrome";
import Loader from "@/components/Loader";
import Categories from "@/components/home/Categories";
import Featured from "@/components/home/Featured";
import Feed from "@/components/home/Feed";
import Film from "@/components/home/Film";
import Hero from "@/components/home/Hero";
import Join from "@/components/home/Join";
import Pillars from "@/components/home/Pillars";
import Services from "@/components/home/Services";
import Why from "@/components/home/Why";

// Section order follows the live homepage, with the film (linked from every live hero slide) given its own scene.
export default function Home() {
  return <>
    <Loader />
    <Shell>
      <Hero />
      <Pillars />
      <Film />
      <Feed />
      <Featured />
      <Services />
      <Categories />
      <Why />
      <Join />
    </Shell>
  </>;
}
