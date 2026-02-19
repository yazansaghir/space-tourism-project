import "./TechNumbers.css";

export default function TechNumbers({
  technologyList = [],
  currentIndex,
  setCurrentIndex,
}) {
  return (
    <div
      className="tech-numbers"
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
          className={`tech-numbers__btn ${
            currentIndex === index ? "tech-numbers__btn--active" : ""
          }`}
          onClick={() => setCurrentIndex(index)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
}
