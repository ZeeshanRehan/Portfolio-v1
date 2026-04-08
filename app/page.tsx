import Nav from "@/components/nav";
import Hero from "@/components/hero";
import Experience from "@/components/experience";
import Projects from "@/components/project";
import Stack from "@/components/stack";

export default function Home() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: "80px" }}>
        <Hero/>
        <Experience/>
        <Projects/>
        <Stack/>
      </main>

    </>
  );
}