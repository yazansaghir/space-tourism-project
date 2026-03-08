export default function DestinationNav({
  currentTab,
  setTab,
  destinationsList = [],
}) {
  return (
    <nav
      className="flex flex-wrap justify-center gap-[clamp(1rem,2vw,1.5rem)] mb-[clamp(1rem,2.5vw,1.5rem)] md:justify-start md:gap-[clamp(1.25rem,1.5vw,2rem)] md:mb-[clamp(1.5rem,2.5vw,2rem)]"
      aria-label="Destinations"
    >
      {destinationsList.map((dest, index) => (
        <button
          key={dest.name}
          type="button"
          onClick={() => setTab(index)}
          aria-current={currentTab === index ? "true" : undefined}
          className={
            `font-sans-cond text-[0.875rem] tracking-nav uppercase pb-2 border-b-[3px] bg-transparent border-none cursor-pointer transition-colors duration-[250ms] ` +
            (currentTab === index
              ? "text-white border-white border-b-[3px]"
              : "text-space-accent border-transparent hover:border-white/50")
          }
        >
          {dest.name}
        </button>
      ))}
    </nav>
  );
}
