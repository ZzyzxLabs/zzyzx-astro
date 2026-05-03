export default function Slogan() {
  return (
    <div className="select-none">
      <span className="eyebrow mb-8">Manifesto</span>
      <h3 className="mt-6 font-display font-semibold text-white tracking-tight leading-[0.92] text-5xl md:text-7xl lg:text-8xl">
        We only solve
        <br />
        <span className="inline-flex items-baseline gap-3">
          <span className="text-primary">[ hard ]</span>
          <span>problems.</span>
        </span>
      </h3>
      <p className="mt-8 text-text-muted text-base md:text-lg max-w-xl">
        If it's already easy, you don't need us. We're here for the things that
        require new primitives, careful cryptography, and patient engineering.
      </p>
    </div>
  );
}
