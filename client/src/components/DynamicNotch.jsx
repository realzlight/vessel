import { useEffect, useState } from "react";
import '../styles/DynamicNotch.css'

const messages = [
  "changelog that actually updates itself",
  "less stress, more shipping",
  "Visible User Changelogs!",
  "built for devs who ship fast",
  "no more dead changelogs",
  "just connect your repo & go",
  "smart auto-updates for your releases",
  "changelog that doesn't suck",
  "one less thing to worry about",
  "literally just works",
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
      }, 600); // Matches the 0.6s animation duration
    }, 4200); // 3000ms display + 600ms animation + 600ms buffer

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