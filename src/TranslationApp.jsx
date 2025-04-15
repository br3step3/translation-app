import React, { useState } from "react";

const API_KEY = "AIzaSyB76YGym3LUinbkPlnI7vNWaxk2jKg44Fc";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const generateTextFromPrompt = async (promptText) => {
  const body = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Write a detailed and coherent paragraph of at least 200 words based on the following prompt. Use informal, everyday English. Do not use a list format or break it into separate lines:
"${promptText}"`
          }
        ]
      }
    ]
  };

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
};

const generateTextFromInstruction = async (instructionText) => {
  const body = {
    contents: [
      {
        role: "user",
        parts: [
          {
           text: `Follow the instruction below exactly. Respond in a direct, concise way. Use a list format if the instruction implies it. Do not add extra commentary or explanations.

"${instructionText}"`

          }
        ]
      }
    ]
  };

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
};

const translateTextBlock = async (text) => {
  const body = {
    contents: [
      {
        role: "user",
        parts: [
          {
text: `Translate the following English dialogue into Spanish. 
Return a list where each line includes the English sentence and its Spanish translation, separated by a slash (/). 
Please preserve speaker names and dialogue formatting.

${text}`

          }
        ]
      }
    ]
  };

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "(No translation)";

  return rawText
    .split("\n")
    .map(line => {
      const cleanedLine = line.replace(/^\s*[\*\d.]+\s*/, "");
      const [en, es] = cleanedLine.split("/").map(s => s.trim());
      return en && es ? { en, es } : null;
    })
    .filter(Boolean);
};

export default function TranslationApp() {
  const [prompt, setPrompt] = useState("");
  const [pairedSentences, setPairedSentences] = useState([]);
  const [isLoadingIndex, setIsLoadingIndex] = useState(null);
  const [toggleStates, setToggleStates] = useState([]);
  const [pressTimer, setPressTimer] = useState(null);
  const [longPressIndex, setLongPressIndex] = useState(null);

  const process = async (action, index) => {
    if (!prompt.trim()) return;
    setIsLoadingIndex(index);
    try {
      const english = await action(prompt);
      const pairs = await translateTextBlock(english);
      setPairedSentences(pairs);
      setToggleStates(pairs.map(() => 1));
    } catch (err) {
      console.error("Processing error:", err);
    }
    setIsLoadingIndex(null);
  };

  const handleGenerate = () => process(generateTextFromPrompt, 0);
  const handleFollowInstruction = () => process(generateTextFromInstruction, 1);
  const handleUseOwnText = () => process((text) => Promise.resolve(text), 2);

  const handleToggle = (index) => {
    if (longPressIndex === index) {
      setLongPressIndex(null);
      return;
    }
    setToggleStates((prev) => {
      const updated = [...prev];
      updated[index] = updated[index] === 3 ? 2 : updated[index] + 1;
      return updated;
    });
  };

  const handleLongClickStart = (index) => {
    const timer = setTimeout(() => {
      setToggleStates((prev) => {
        const updated = [...prev];
        updated[index] = 1;
        return updated;
      });
      setLongPressIndex(index);
    }, 600);
    setPressTimer(timer);
  };

  const handleLongClickEnd = () => {
    clearTimeout(pressTimer);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold text-center">Translation</h1>
      <textarea
        className="w-full p-2 border rounded"
        rows={3}
        placeholder="Enter a story prompt or your own English text..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <div className="flex justify-center flex-wrap gap-2">
        <button onClick={handleGenerate} disabled={isLoadingIndex === 0} className="px-4 py-2 bg-blue-600 text-white rounded">
          {isLoadingIndex === 0 ? "Generating..." : "Create a Story"}
        </button>
        <button onClick={handleFollowInstruction} disabled={isLoadingIndex === 1} className="px-4 py-2 border border-blue-600 text-blue-600 rounded">
          {isLoadingIndex === 1 ? "Generating..." : "Follow Instruction"}
        </button>
        <button onClick={handleUseOwnText} disabled={isLoadingIndex === 2} className="px-4 py-2 bg-gray-300 text-black rounded">
          {isLoadingIndex === 2 ? "Translating..." : "Use My Text"}
        </button>
      </div>
      {pairedSentences.length > 0 && (
        <div className="text-lg leading-8 flex flex-wrap">
          {pairedSentences.map((line, index) => {
            const toggle = toggleStates[index];
            let displayText = line.es;
            let style = "inline px-1";
            if (toggle === 2) style += " bg-blue-100";
            else if (toggle === 3) {
              displayText = line.en;
              style += " bg-red-100";
            }
            return (
              <span
                key={index}
                onClick={() => handleToggle(index)}
                onMouseDown={() => handleLongClickStart(index)}
                onMouseUp={handleLongClickEnd}
                onMouseLeave={handleLongClickEnd}
                className={`cursor-pointer ${style}`}
              >
                {displayText + " "}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
