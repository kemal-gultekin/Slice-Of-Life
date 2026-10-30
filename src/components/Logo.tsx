export function Logo({ className = "" }: { className?: string }) {
  return (
    <span lang="en" className={`inline-flex items-center gap-2 font-display whitespace-nowrap text-lg tracking-wide md:text-xl ${className}`}>
      <span aria-hidden className="relative inline-block size-3 rounded-full bg-tomato" />
      Slice of Life
    </span>
  );
}
