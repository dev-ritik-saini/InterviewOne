import React from "react";

const Footer = () => {
  return (
    <footer className="bg-base-200 border-t border-base-300">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-base-content/60 text-sm">
          © {new Date().getFullYear()} InterviewOne. All rights reserved.
        </p>
        <p className="text-base-content/60 text-sm">
          Made with ❤️ for developers by Ritik Saini
        </p>
      </div>
    </footer>
  );
};

export default Footer;
