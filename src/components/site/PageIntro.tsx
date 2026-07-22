export default function PageIntro({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return (
    <section className="page-intro section-pad">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="page-intro__copy">{intro}</p>
    </section>
  );
}
