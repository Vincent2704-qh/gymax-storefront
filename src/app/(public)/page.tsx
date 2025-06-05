import About from "@/components/about/About";
import Blog from "@/components/blog/Blog";
import Classes from "@/components/classes/Classes";
import Hero from "@/components/hero/Hero";
import Team from "@/components/team/Team";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Classes />
      <Team />
      <Blog />
    </>
  );
}
