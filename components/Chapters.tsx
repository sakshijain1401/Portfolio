import { Craft } from "@/components/Craft";
import { Projects } from "@/components/Projects";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

export function Chapters() {
  return (
    <div className="chapters is-ground" id="work">
      <Craft />

      <Projects />

      <section className="close" id="contact">
        <Reveal className="close-reveal">
          <p className="kicker">
            {site.role} · {site.place}
          </p>
          <h2>Write from the ground.</h2>
          <div className="close-mark" aria-hidden="true">
            <span className="brand-mark-hair is-solid" />
            <p>I work at the size of the light.</p>
          </div>
          <a className="mail" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <p className="close-deck">
            If your market is a planet rather than a galaxy, I like talking about it. Positioning, narrative, and
            pipeline for a list you can finish reading.
          </p>
        </Reveal>
      </section>

      <footer>
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
      </footer>
    </div>
  );
}
