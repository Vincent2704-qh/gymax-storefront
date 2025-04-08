import About from "@/components/about/About";
import Blog from "@/components/blog/Blog";
import Brand from "@/components/brand/Brand";
import Classes from "@/components/classes/Classes";
import Hero from "@/components/hero/Hero";
import Membership from "@/components/membership/Membership";
import Team from "@/components/team/Team";
import Testimonial from "@/components/testimonial/Testimonial";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Classes />
      <Team />
      <Membership />
      <Testimonial />
      <Blog />
      <Brand />
      {/* <div className="h-[3000px]"></div> */}
    </main>
  );
}
