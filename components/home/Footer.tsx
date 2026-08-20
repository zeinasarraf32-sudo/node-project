export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-grid">
        {/* Column 1: Brand */}
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-sm">
              ♥
            </div>
            <span className="text-sm font-semibold">QuickCare</span>
          </div>

          <p className="footer-text">
            Connecting patients with the right specialists through
            intelligent healthcare technology.
          </p>
        </div>

        {/* Column 2: About */}
        <div>
          <h3 className="footer-heading">About Us</h3>
          <p className="footer-text">
            QuickCare is a digital health platform connecting Tripoli
            patients with top specialists through AI — making quality
            healthcare more accessible for everyone.
          </p>
        </div>

        {/* Column 3: Contact */}
        <div>
          <h3 className="footer-heading">Contact</h3>
          <div className="mt-4 space-y-3 text-xs text-slate-400">
            <p>⌖ Al-Mater Street, Tripoli, Lebanon</p>
            <p>☏ +961 76 123 456</p>
            <p>✉ hello@quickcare.lb</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 QuickCare. All rights reserved.
      </div>
    </footer>
  );
}