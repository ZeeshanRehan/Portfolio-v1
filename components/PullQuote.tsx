export default function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-14 border-y border-[#1f1f1f] py-8">
      <p className="max-w-3xl font-serif text-3xl font-light leading-[1.45] text-[#e8e3dc] md:text-4xl">
        {children}
      </p>
    </div>
  );
}
