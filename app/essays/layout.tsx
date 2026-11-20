import Nav from "@/components/nav";
import AdminPlus from "@/components/AdminPlus";

export default function EssaysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="px-8 pb-24 pt-28 md:px-20">{children}</main>
      <AdminPlus />
    </>
  );
}
