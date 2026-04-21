import { useState } from "react";
import { useStore } from "../store/useStore";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";

const TOPICS = [
  "Climate & environment", "Homelessness", "Labor rights",
  "Minimum wage", "Electricity & utilities", "Water & sanitation",
  "Public transit", "Housing affordability", "Education",
  "Healthcare access", "Criminal justice", "Immigration",
  "Food security", "Mental health", "Voting & democracy",
  "Racial equity"
];

export default function Onboarding() {
  const [selected, setSelected] = useState<string[]>([]);
  const completeOnboarding = useStore((state) => state.completeOnboarding);
  const navigate = useNavigate();

  const toggleTopic = (topic: string) => {
    setSelected(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const handleComplete = () => {
    if (selected.length >= 3) {
      completeOnboarding(selected);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2ED] flex flex-col items-center p-6 font-sans">
      <div className="w-full max-w-sm mt-8 flex-1 flex flex-col">
          
        <div className="flex-1">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2 leading-tight">What issues do you care about?</h2>
          <p className="text-gray-600 mb-8">
            Select at least 3 to personalize your event feed.
          </p>

          <div className="flex flex-wrap gap-2.5">
            {TOPICS.map(topic => (
              <button
                key={topic}
                onClick={() => toggleTopic(topic)}
                className={cn(
                  "px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                  selected.includes(topic) 
                    ? "bg-emerald-600 border-emerald-600 text-white" 
                    : "bg-white border-gray-300 text-gray-700 hover:border-gray-400 font-normal"
                )}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        <div className="py-6 mt-8">
          <button 
            onClick={handleComplete}
            disabled={selected.length < 3}
            className={cn(
              "w-full rounded-xl py-3.5 font-medium transition",
              selected.length >= 3 
                ? "bg-gray-900 text-white hover:bg-gray-800" 
                : "border border-gray-300 bg-white text-gray-400"
            )}
          >
            Create account
          </button>
          
          <div className="text-center text-sm pt-4">
            <button onClick={() => { completeOnboarding(TOPICS.slice(0,3)); navigate("/"); }} className="text-emerald-600 font-medium hover:underline">Or skip for now</button>
          </div>

          <p className="text-xs text-gray-400 text-center leading-relaxed mt-6">
            By creating an account, you agree to our Terms of Service and Privacy Policy.<br/>
            Your data is never sold.
          </p>
        </div>
      </div>
    </div>
  );
}
