// src/pages/RedirectUPI.jsx
import React, { useEffect, useState } from "react";

function RedirectUPI() {
  const [status, setStatus] = useState("Redirecting...");
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const upi = query.get("upi");

    console.log("[RedirectUPI] raw upi param:", upi);

    if (!upi) {
      setStatus("Invalid redirect link (no upi param).");
      return;
    }

    const decoded = decodeURIComponent(upi);
    console.log("[RedirectUPI] decoded UPI link:", decoded);

    // Try direct location.href first
    try {
      // For iOS/Android native app deep link support
      setStatus("Opening UPI app...");
      // Attempt to open directly
      window.location.href = decoded;

      // As a fallback we try an iframe method after a short delay
      setTimeout(() => {
        if (document.visibilityState === "visible") {
          // user still on the page — try iframe approach & intent fallback
          setStatus("Trying alternate redirect...");
          const iframe = document.createElement("iframe");
          iframe.style.display = "none";
          iframe.src = decoded;
          document.body.appendChild(iframe);

          // Android intent fallback (for some Android devices/browsers)
          const intent = `intent:${decoded.replace("upi://", "")}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`;
          console.log("[RedirectUPI] intent:", intent);

          setTimeout(() => {
            // If still here, show manual option
            setStatus("If nothing opened, tap the button to open UPI link manually.");
            // keep visible fallback link
            const btn = document.getElementById("manualOpen");
            if (btn) btn.style.display = "inline-block";
          }, 800);
        }
      }, 800);
    } catch (err) {
      console.error("[RedirectUPI] redirect error:", err);
      setStatus("Redirect failed. Please open UPI app manually using the button below.");
    }

    // cleanup optional iframes later
    return () => {
      const frames = document.querySelectorAll("iframe");
      frames.forEach(f => f.remove());
    };
  }, []);

  const handleManual = () => {
    const query = new URLSearchParams(window.location.search);
    const upi = query.get("upi");
    if (!upi) return;
    const decoded = decodeURIComponent(upi);
    // open in new tab so browser doesn't block
    window.open(decoded, "_blank");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-semibold mb-4">Redirecting to UPI App…</h1>
      <p className="mb-4 text-sm text-gray-700">{status}</p>
      <button
        id="manualOpen"
        onClick={handleManual}
        style={{ display: "none" }}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Open UPI Manually
      </button>
      <p className="mt-4 text-xs text-gray-500">If the UPI app didn't open, you can copy the UPI link from the console and open it in your UPI app.</p>
    </div>
  );
}

export default RedirectUPI;
