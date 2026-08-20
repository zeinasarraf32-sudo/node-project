import AIAssistant from "./AIAssistant";

export default function Hero() {
  return (
    <section className="hero-container">
      <div className="hero-badge">
        ⚡ AI-Powered Healthcare Platform
      </div>

      <h1 className="hero-title">
        Book Your Appointment
        <br />
        <span className="text-yellow-400">
          Easily
        </span>
      </h1>

      <p className="hero-subtitle">
        Describe your symptoms to our AI assistant,
        get matched with the right specialist,
        and book your appointment — all in under 2 minutes.
      </p>

      <AIAssistant />

      <a
        href="/doctors"
        className="btn-hero-cta"
      >
        Get Started →
      </a>
    </section>
  );
}