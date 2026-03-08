export default function TechNumbers({
  technologyList = [],
  currentIndex,
  setCurrentIndex,
}) {
  return (
    /*
      Mobile / tablet (<lg): horizontal row, centred, smaller buttons
      Desktop (lg+):         vertical column, full-size buttons
    */
    <div
      className="flex flex-row justify-center gap-4 lg:flex-col lg:justify-start lg:gap-8"
      role="tablist"
      aria-label="Technology selection"
    >
      {technologyList.map((_, index) => (
        <button
          key={index}
          type="button"
          role="tab"
          aria-selected={currentIndex === index}
          aria-label={`Technology ${index + 1}`}
          onClick={() => setCurrentIndex(index)}
            /*
            Sizes (mobile-first):
              <600px:   w-10  h-10  text-base  (40px)
              600–900px: w-[60px] h-[60px] text-2xl
              1100px+:   w-20  h-20  text-[2rem] (80px)

            States: transparent bg + faint border → white border on hover → filled on active
          */
          className={
            `flex-shrink-0 w-10 h-10 text-base sm:w-[60px] sm:h-[60px] sm:text-2xl lg:w-20 lg:h-20 lg:text-[2rem] ` +
            `rounded-full font-serif font-normal cursor-pointer transition-all duration-[250ms] ` +
            (currentIndex === index
              ? "bg-white text-space-dark border-transparent"
              : "bg-transparent text-white border border-white/25 hover:border-white")
          }
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
}
