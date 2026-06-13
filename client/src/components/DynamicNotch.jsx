import { useEffect, useState, useRef } from "react";
import '../styles/DynamicNotch.css'

const messages = [
  "changelog that actually updates itself",
  "less stress, more shipping",
  "User Visibility Is Maintained!",
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
  const textRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % messages.length);
        setVisible(true);
      }, 600);
    }, 4200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="land-notch" ref={textRef}>
      <span className={`notch-text ${visible ? "show" : "hide"}`}>
        {messages[index]}
      </span>
    </div>
  );
}