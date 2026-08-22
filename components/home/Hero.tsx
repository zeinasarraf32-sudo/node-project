import AIAssistant from "./AIAssistant";

export default function Hero() {
  return (
    <section className="w-full bg-blue-600 text-white px-4 py-10 md:py-16 overflow-hidden flex flex-col items-center text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium mb-6">
        ⚡ AI-Powered Healthcare Platform
      </div>

      {/* Main Responsive Title */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-3xl leading-tight">
        Book Your Appointment{" "}
        <span className="text-yellow-400 block sm:inline">Easily</span>
      </h1>

      {/* Subtitle */}
      <p className="mt-4 text-xs sm:text-base text-blue-100 max-w-xl leading-relaxed">
        Describe your symptoms to our AI assistant, get matched with the right
        specialist, and book your appointment — all in under 2 minutes.
      </p>

      {/* AI Assistant Container */}
      <div className="w-full max-w-md my-6">
        <AIAssistant />
      </div>

      {/* CTA Button */}
      <a
        href="/doctors"
        className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 font-bold text-sm rounded-xl shadow-md transition-all transform active:scale-95"
      >
        Get Started →
      </a>
    </section>
  );
}