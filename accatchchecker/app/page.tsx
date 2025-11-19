"use client";

import { useEffect, useState } from "react";
import { filterAllCritters } from "./utils/critter-filter";
import {Critter} from "@/app/interfaces/critter";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [resultsDate, setResultsDate] = useState<Date>(new Date());
  const [hemisphere, setHemisphere] = useState("NH");
  const [resultsHemisphere, setResultsHemisphere] = useState("NH");
  const [results, setResults] = useState<{
    fish: Critter[];
    insects: Critter[];
    seaCreatures: Critter[];
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    const formatted = now.toISOString().slice(0, 16);
    setSelectedDate(formatted);
  }, []);

  function handleClick() {
    if (!selectedDate) return;
    const date = new Date(selectedDate);
    const filtered = filterAllCritters(date, hemisphere);
    setResults(filtered);
    setResultsHemisphere(hemisphere);
    setResultsDate(date);
  }

  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 font-sans dark:bg-black px-4">
      <main className="flex w-full max-w-5xl flex-col items-center py-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
          Welcome!
        </h1>

        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          Enter a date and time to see which bugs, fish, and sea creatures are available:
        </p>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
          {mounted && (
            <input
              type="datetime-local"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border p-2 rounded text-zinc-700 dark:text-zinc-200 dark:bg-zinc-800"
            />
          )}
          <select
              className="border p-2 rounded text-zinc-700 dark:text-zinc-200 dark:bg-zinc-800"
              value={hemisphere}
              onChange={(e) => setHemisphere(e.target.value)}
          >
            <option value="NH">Northern Hemisphere</option>
            <option value="SH">Southern Hemisphere</option>
          </select>

          <button
            onClick={handleClick}
            className="rounded bg-green-600 text-white px-4 py-2 hover:bg-green-700"
          >
            Go!
          </button>
        </div>

        {results && (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
            <CategoryColumn title="🐟 Fish" items={results.fish} hemisphere={resultsHemisphere} date={resultsDate} />
            <CategoryColumn title="🐛 Insects" items={results.insects} hemisphere={resultsHemisphere} date={resultsDate} />
            <CategoryColumn title="🦀 Sea Creatures" items={results.seaCreatures} hemisphere={resultsHemisphere} date={resultsDate} />
          </div>
        )}
      </main>
    </div>
  );
}

function CategoryColumn({ title, items, hemisphere, date }: { title: string; items: Critter[], hemisphere: string, date:Date }) {
   const getCardColor = () => {
    if (title.includes("Fish")) return "bg-blue-100 dark:bg-blue-900";
    if (title.includes("Insects")) return "bg-green-100 dark:bg-green-900";
    if (title.includes("Sea Creatures")) return "bg-pink-100 dark:bg-pink-900";
    return "bg-zinc-100 dark:bg-zinc-900";
  };

  return (
      <div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="grid grid-cols-1 gap-4">
          {items.length === 0 && (
              <p className="italic text-zinc-500 dark:text-zinc-400">
                Nothing available right now
              </p>
          )}

          {items.map((c) => {
            const monthNames = [
              "Jan","Feb","Mar","Apr","May","Jun",
              "Jul","Aug","Sep","Oct","Nov","Dec"
            ];
            const month = monthNames[date.getMonth()];
            const hours = c[`${hemisphere} ${month}`];

            return (
                <div
                    key={c["#"]}
                    className={`p-4 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:shadow-md transition ${getCardColor()}`}
                >
                  {c["Image Url"] && (
                      <img
                          src={c["Image Url"]}
                          alt={c.Name}
                          className="w-full h-8 object-contain mb-2"
                      />
                  )}

                  <h3 className="font-semibold text-lg">{c.Name}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Available: {hours}
                  </p>
                </div>
            );
          })}
        </div>
      </div>
  );
}
