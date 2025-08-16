export default function TestGradient() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-10 space-y-8">
      <h1 className="text-6xl font-extrabold">
        Everything your <span className="gradient-text hover-animate">club</span> needs in one place
      </h1>

      <p className="text-xl">
        From member management to financial <span className="gradient-text hover-animate">tracking</span>, <span className="gradient-text hover-animate">One4Team</span> provides all the tools.
      </p>

      <div className="text-5xl font-black space-x-8">
        <span className="gradient-text hover-animate">500+</span>
        <span className="gradient-text hover-animate">50k+</span>
        <span className="gradient-text hover-animate">99.9%</span>
      </div>
    </div>
  );
}
