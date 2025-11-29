import React, { useEffect } from "react";

function RedirectUPI() {
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const upi = query.get("upi");

    if (upi) {
      // Redirect to actual UPI app
      window.location.href = decodeURIComponent(upi);
    } else {
      alert("Invalid UPI link");
    }
  }, []);

  return (
    <div className="h-screen flex items-center justify-center text-xl font-bold">
      Redirecting to UPI App...
    </div>
  );
}

export default RedirectUPI;
