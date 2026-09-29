import { Shell } from "@/components/chrome";
import Loader from "@/components/Loader";
import Categories from "@/components/home/Categories";
import Featured from "@/components/home/Featured";
import Film from "@/components/home/Film";
import Hero from "@/components/home/Hero";
import Join from "@/components/home/Join";
import Pillars from "@/components/home/Pillars";
import Services from "@/components/home/Services";
import Why from "@/components/home/Why";

// Order after client feedback: Why GlobalHUB? sits under the pillars (28 Sep), the social feed was removed (29 Sep),
// and the film (linked from every live hero slide) keeps its own scene.
export default function Home() {
  return <>
    <Loader />
    <Shell>
      <Hero />
      <Pillars />
      <Why />
      <Services />
      <Film />
      <Featured />
      <Categories />
      <Join />
    </Shell>
  </>;
}
