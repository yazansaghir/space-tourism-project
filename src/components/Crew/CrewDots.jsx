import "./CrewDots.css";

export default function CrewDots({ crew = [], currentIndex, setCurrentIndex }) {
  return (
    <div className="crew-dots" role="tablist" aria-label="Crew members">
      {crew.map((_, index) => (
        <button
          key={index}
          type="button"
          role="tab"
          aria-selected={currentIndex === index}
          aria-label={`Select crew member ${index + 1}`}
          className={`crew-dots__dot ${
            currentIndex === index ? "crew-dots__dot--active" : ""
          }`}
          onClick={() => setCurrentIndex(index)}
        />
      ))}
    </div>
  );
}
