export default function CrewDots({ crew = [], currentIndex, setCurrentIndex }) {
  return (
    <div
      className="flex gap-6 flex-shrink-0"
      role="tablist"
      aria-label="Crew members"
    >
      {crew.map((_, index) => (
        <button
          key={index}
          type="button"
          role="tab"
          aria-selected={currentIndex === index}
          aria-label={`Select crew member ${index + 1}`}
          onClick={() => setCurrentIndex(index)}
          /*
            Size: 10px on mobile/tablet (<md), 15px on desktop (md+)
            Opacity: 20% default → 50% hover → 100% active
          */
          className={
            `w-[10px] h-[10px] md:w-[15px] md:h-[15px] rounded-full bg-white border-none cursor-pointer transition-opacity duration-300 ` +
            (currentIndex === index ? "opacity-100" : "opacity-20 hover:opacity-50")
          }
        />
      ))}
    </div>
  );
}
