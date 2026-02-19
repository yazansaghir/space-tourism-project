import "./DestinationNav.css";

export default function DestinationNav({
  currentTab,
  setTab,
  destinationsList = [],
}) {
  return (
    <nav
      className="destination-nav"
      aria-label="Destinations"
    >
      {destinationsList.map((dest, index) => (
        <button
          key={dest.name}
          type="button"
          className={`destination-nav__tab ${
            currentTab === index ? "destination-nav__tab--active" : ""
          }`}
          onClick={() => setTab(index)}
          aria-current={currentTab === index ? "true" : undefined}
        >
          {dest.name}
        </button>
      ))}
    </nav>
  );
}
