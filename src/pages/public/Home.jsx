import { Link } from "react-router-dom";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const Home = () => {
  useDocumentTitle("Home");

  return (
    /* flex-1 so the page fills the remaining height below the navbar */
    <div className="flex-1 flex items-center justify-center p-[clamp(1.5rem,5vw,3rem)]">
      <div className="w-full max-w-[1100px] mx-auto">
        {/*
          Mobile / tablet: single column, centred
          Desktop (md = 900px+): two columns, text left / button right aligned to bottom
        */}
        <div className="grid grid-cols-1 items-center justify-items-center gap-[clamp(3rem,8vw,5rem)] md:grid-cols-2 md:items-end md:justify-items-stretch md:gap-[clamp(2rem,4vw,4rem)]">

          {/* Left: text block */}
          <section className="flex flex-col gap-6 text-center items-center md:text-left md:items-start">
            {/* Heading 5 / subheading */}
            <p className="font-sans-cond text-space-accent uppercase tracking-[clamp(0.16875rem,0.3vw,0.296875rem)] text-[clamp(1rem,1.5vw,1.75rem)] sm:text-[1.25rem] sm:tracking-[0.205rem] md:text-[clamp(1rem,1.5vw,1.75rem)] md:tracking-[0.296875rem]">
              So, you want to travel to
            </p>

            {/* Heading 1 — "Space" */}
            <p className="font-serif text-white uppercase leading-[1.25] text-[5rem] sm:text-[clamp(5rem,15vw,6.25rem)] sm:leading-[1.15] md:text-[clamp(5rem,10vw,9.375rem)]">
              Space
            </p>

            {/* Body text */}
            <p className="font-sans text-space-accent leading-[1.67] text-[0.9375rem] max-w-[27.75rem] sm:text-[1rem] sm:leading-[1.75] md:text-[clamp(0.9375rem,1.1vw,1.125rem)]">
              Let&apos;s face it; if you want to go to space, you might as well
              genuinely go to outer space and not hover kind of on the edge of
              it. Well sit back, and relax because we&apos;ll give you a truly
              out of this world experience!
            </p>
          </section>

          {/* Right: Explore CTA button */}
          <div className="flex items-end justify-center md:justify-end">
            <Link
              to="/destination"
              className="explore-btn cursor-pointer flex items-center justify-center aspect-square rounded-full bg-white text-space-dark font-serif uppercase tracking-[0.078125rem] sm:tracking-[0.125rem] text-[1.25rem] sm:text-[clamp(1.25rem,2vw,2rem)] w-[9.375rem] sm:w-[clamp(9.375rem,20vw,17.125rem)] border-none transition-shadow duration-300 no-underline hover:opacity-90 focus:outline-none focus:opacity-90"
            >
              Explore
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
