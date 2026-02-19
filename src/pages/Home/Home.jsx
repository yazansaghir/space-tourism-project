import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import "./Home.css";

const Home = () => {
  useDocumentTitle("Home");
  return (
    <div className="home-page">
      <div className="home__container">
        <div className="home__content">
          <section className="home__text-block">
            <p className="heading-5">So, you want to travel to</p>
            <p className="heading-1 home__title">Space</p>
            <p className="text home__desc">
              Let's face it; if you want to go to space, you might as well
              genuinely go to outer space and not hover kind of on the edge of
              it. Well sit back, and relax because we'll give you a truly out of
              this world experience! Explore
            </p>
          </section>
          <div className="home__cta">
            <button type="button" className="home__circle">
              Explore
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
