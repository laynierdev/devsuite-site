import { principles } from "@/data/products";

/** The path an AI suggestion takes before it can change anything. */
const LOOP = [
  { actor: "AI", verb: "Proposes", text: "Analyzes, explains and drafts." },
  { actor: "Application", verb: "Validates", text: "Checks the output against its own data and models." },
  { actor: "You", verb: "Decide", text: "Review, edit, approve or discard." },
  { actor: "Project", verb: "Changes", text: "Only what you approved is applied." },
];

function ControlLoop() {
  return (
    <figure className="loop" data-reveal>
      <figcaption className="loop__caption">How a suggestion becomes a change</figcaption>
      <div className="loop__body">
        <ol className="loop__track">
          {LOOP.map((step, i) => (
            <li key={step.actor} className="loop__node" style={{ "--i": i } as React.CSSProperties}>
              <span className="loop__dot" aria-hidden="true" />
              <span className="loop__actor">{step.actor}</span>
              <span className="loop__verb">{step.verb}</span>
              <span className="loop__text">{step.text}</span>
            </li>
          ))}
        </ol>
        <span className="loop__pulse" aria-hidden="true" />
      </div>
    </figure>
  );
}

export function PhilosophySection() {
  return (
    <section id="philosophy" className="philosophy section-solid" aria-labelledby="philosophy-title">
      <div className="container-xxl">
        <div className="philosophy__panel">
          <div className="philosophy__glow" aria-hidden="true" />
          <header className="philosophy__head">
            <p className="eyebrow eyebrow--light" data-reveal>
              Shared philosophy
            </p>
            <h2 id="philosophy-title" className="display" data-reveal="lines">
              <span className="line">
                <span>AI should assist.</span>
              </span>
              <span className="line" style={{ "--i": 1 } as React.CSSProperties}>
                <span>You stay in control.</span>
              </span>
            </h2>
            <p className="philosophy__lead" data-reveal>
              These are tools first, not chatbots. AI analyzes, explains and proposes. The application keeps the
              facts, and the decisions stay with you.
            </p>
          </header>

          <ControlLoop />

          <ol className="principles">
            {principles.map((principle, i) => (
              <li
                key={principle.index}
                className="principle"
                data-reveal
                style={{ "--d": `${i * 0.08}s` } as React.CSSProperties}
              >
                <span className="principle__index">{principle.index}</span>
                <h3 className="principle__title">{principle.title}</h3>
                <p className="principle__body">{principle.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
