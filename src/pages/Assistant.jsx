import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Assistant() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:5000/api/rag/ask-llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(data.answer);
      } else {
        setResponse(`**Error:** ${data.error}`);
      }
    } catch (err) {
      setResponse("**Error:** Could not reach the server.");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">AI Assistant</h2>

      <textarea
        className="w-full border border-gray-300 p-3 rounded mb-4"
        rows={4}
        placeholder="Ask a question about the API or logs..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        onClick={handleAsk}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Thinking..." : "Ask"}
      </button>

      {response && (
        <div className="mt-6 bg-gray-100 p-4 rounded whitespace-pre-wrap prose">
          <h4 className="font-semibold mb-2">Answer:</h4>
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
