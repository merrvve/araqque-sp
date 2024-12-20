"use client";

import { useState } from "react";
import { Share2, Copy } from "lucide-react";

type Props = {
  user: any;
};

const CreateHomework: React.FC<Props> = ({ user }) => {
  const [homeworkName, setHomeworkName] = useState("");
  const [homeworkId, setHomeworkId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Use the user props directly for trainer_id and trainer_name
    const homeworkData = {
      trainer_id: user.id,
      trainer_name: user.email, // Using user email for the trainer's name
      name: homeworkName,
    };

    try {
      const res = await fetch("/api/homework/create-homework", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(homeworkData),
      });

      if (!res.ok) {
        console.log(res);
        throw new Error("Failed to create homework");
      }

      const data = await res.json();
      setHomeworkId(data.id); // Set the returned homework ID
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(homeworkId).then(() => {
      alert("Ödev Kodu kopyalandı");
    });
  };

  const handleShare = () => {};

  return (
    <div className="max-w-lg p-6 shadow-md rounded-lg border  border-slate-100">
      <h1 className="text-2xl font-semibold mb-6">Ödev Oluştur</h1>

      <form onSubmit={handleSubmit}>
        {/* Homework Name */}
        <div className="mb-6">
          <label htmlFor="homeworkName" className="block text-sm font-medium">
            Ödev Adı
          </label>
          <input
            type="text"
            id="homeworkName"
            onChange={(e) => setHomeworkName(e.target.value)}
            className="col-span-6 mb-3 block w-full rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-2 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Ödev Adı"
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full p-2 bg-slate-900 text-white rounded-md hover:bg-slate-700 font-semibold  ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Ödev Kodu Oluşturuluyor..." : "Ödev Kodu Oluştur"}
        </button>
      </form>

      {error && <p className="mt-4 text-red-600">{error}</p>}

      {homeworkId && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">
            Ödev Kodu
          </label>
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="text"
              value={homeworkId}
              readOnly
              className="p-2 border border-gray-300 rounded-md w-full bg-gray-100 cursor-not-allowed"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="p-2 bg-slate-900 text-white rounded-md hover:bg-slate-700"
            >
              <Copy />
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="p-2 bg-slate-600 text-white rounded-md hover:bg-slate-700"
            >
              <Share2 />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateHomework;
