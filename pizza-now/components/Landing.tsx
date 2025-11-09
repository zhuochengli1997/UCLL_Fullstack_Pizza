"use client";

import React from "react";

interface LandingProps {
  onPizzaNow: () => void;
  fadeOut: boolean;
}

export const Landing: React.FC<LandingProps> = ({ onPizzaNow, fadeOut }) => (
  <div className={`landing ${fadeOut ? "landing--fadeout" : ""}`}>
    <div className="landing-content">
      <h1>Hungry?</h1>
      <p>Press once. We pick a solid pizza place near you.</p>
      <button className="pizza-btn" onClick={onPizzaNow}>
        PIZZA NOW
      </button>
    </div>
  </div>
);
