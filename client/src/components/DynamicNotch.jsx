import { useEffect, useState } from "react";
import '../styles/DynamicNotch.css'

const messages = [
  "Building Nightflare...",
  "Deploying Update",
  "Learning New Skills",
  "Creating Experiences",
  "Welcome To My Portfolio",
  "Open For Collaboration",
];

export default function DynamicNotch() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % messages.length);
        setVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="land-notch">
      <span className={`notch-text ${visible ? "show" : "hide"}`}>
        {messages[index]}
      </span>
    </div>
  );
}