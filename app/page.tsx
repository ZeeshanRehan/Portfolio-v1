import Nav from "@/components/nav";
import Hero from "@/components/hero";
import Experience from "@/components/experience";

export default function Home() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: "80px" }}>
        <Hero/>
        <Experience/>
      </main>

    </>
  );
}