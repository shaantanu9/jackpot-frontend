"use client";

import { useState, useEffect } from "react";
import { useFingerprint } from "../lib/api/hooks/useFingerprint";
import {
  rollGameSlot,
  getGameSlot,
  cashOutGameSlot,
} from "@/lib/api/slotmachine";

type ISymbol = "C" | "L" | "O" | "W";
type ThreeSymbols = [ISymbol, ISymbol, ISymbol];

export default function SpinCard() {
  const [credits, setCredits] = useState(0);
  const [slots, setSlots] = useState(["X", "X", "X"]);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState("");

  const fingerPrintId = useFingerprint();

  const spin = async () => {
    if (credits < 1) {
      setMessage("Not enough credits!");
      return;
    }

    setSpinning(true);
    setMessage("");
    setCredits((prev) => prev - 1);

    try {
      const response = await rollGameSlot({ sessionId: fingerPrintId });

      if (response.statusCode == 200) {
        revealSlots(response.data.symbols, response.data.updatedCredit);
      } else {
        setMessage("Error: Couldn't spin the slots");
        setSpinning(false);
      }
    } catch (error) {
      setMessage("Error: Couldn't connect to the server");
      setSpinning(false);
    }
  };

  const revealSlots = (result: ThreeSymbols, reward: number) => {
    setSlots(["X", "X", "X"]);
    setTimeout(() => setSlots([result[0], "X", "X"]), 1000);
    setTimeout(() => setSlots([result[0], result[1], "X"]), 2000);
    setTimeout(() => {
      setSlots(result);
      setCredits(reward);
      setSpinning(false);
    }, 3000);
  };

  const cashOut = async () => {
    alert(`Cashing out ${credits} credits!`);
    await cashOutGameSlot({ sessionId: fingerPrintId });
    setCredits(0);
    setMessage("Thanks for playing!");
  };

  useEffect(() => {
    const fetchGameSlot = async () => {
      try {
        const response = await getGameSlot(fingerPrintId);
        if (response.statusCode == 200) setCredits(response.data.credits);
      } catch (error) {
        setCredits(10);
      }
    };

    if (fingerPrintId) fetchGameSlot();
  }, [fingerPrintId]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1
          className="text-3xl text-black font-bold text-center mb-6"
          data-testid="welcome"
        >
          Welcome to Las Vegas
        </h1>
        <div className="text-center mb-4">
          <span
            className="text-xl font-semibold text-black"
            data-testid="credits"
          >
            Credits: {credits}
          </span>
        </div>
        <div className="flex justify-center mb-6">
          {slots.map((symbol, index) => (
            <div
              key={index}
              className="w-20 h-20 border-2 border-gray-300 rounded-lg flex items-center justify-center mx-1"
            >
              <span
                data-testid={`slot-${index}`}
                className={`text-4xl font-bold ${
                  spinning && symbol == "X" ? "animate-spin" : ""
                }`}
              >
                {symbol}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={spin}
            disabled={spinning}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            data-testid="spin"
          >
            {spinning ? "Spinning..." : "SPIN"}
          </button>
          <button
            onClick={cashOut}
            disabled={spinning || credits <= 10}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            data-testid="cashout"
          >
            CASH OUT
          </button>
        </div>
        {message && (
          <div
            data-testid="message"
            className="text-center text-lg font-semibold text-gray-700"
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
