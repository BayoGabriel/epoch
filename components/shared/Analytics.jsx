import { useEffect } from "react";

export default function AnalyticsTracker() {
  useEffect(() => {
    const startTime = Date.now();
    
    const handleClick = (event) => {
      fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({ event: "click", target: event.target.tagName }),
      });
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
      const duration = Date.now() - startTime;
      fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({ event: "session_duration", duration }),
      });
    };
  }, []);

  return null;
}
