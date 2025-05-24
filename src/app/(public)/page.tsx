import About from "@/components/about/About";
import Classes from "@/components/classes/Classes";
import Hero from "@/components/hero/Hero";
import Membership from "@/components/membership/Membership";
import Team from "@/components/team/Team";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Classes />
      <Team />
      <Membership />
    </>
  );
}
