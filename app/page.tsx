import Nav from "@/components/nav";
import Hero from "@/components/hero";

export default function Home() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: "80px" }}>
        <Hero/>
      </main>
    </>
  );
}