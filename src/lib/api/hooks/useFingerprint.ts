"use client";

import { useState, useEffect } from "react";
import { getFingerprint } from "@thumbmarkjs/thumbmarkjs";

function useFingerprint() {
  const [fingerprint, setFingerprint] = useState("");

  useEffect(() => {
    getFingerprint()
      .then((result) => {
        setFingerprint(result);
      })
      .catch((error) => {
        console.error("Error getting fingerprint:", error);
      });
  }, []);

  return fingerprint;
}

export { useFingerprint };
