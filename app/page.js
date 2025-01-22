"use client";

import jsPDF from "jspdf";
import { useState } from "react";
import Tesseract from "tesseract.js";

export default function OCRConverter() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("eng");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    console.log(URL.createObjectURL(file));

    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleExtractText = async () => {
    if (!image) return;
    setLoading(true);

    try {
      const result = await Tesseract.recognize(image, language, {
        logger: (m) => console.log(m),
      });

      setText(result.data.text);
    } catch (err) {
      console.error("Error extracting text:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadText = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "extracted-text.txt";
    link.click();
  };

  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    pdf.text(text, 10, 10);
    pdf.save("extracted-text.pdf");
  }

  const handleDownloadMarkdown = () => {
    const blob = new Blob([text], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "extracted-text.md";
    link.click();
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="mt-5">
        <h1 className="text-4xl text-orange-600 hover:text-orange-700 cursor-pointer font-bold mb-4">
          Image to Text Converter
        </h1>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4 rounded-lg"
        />
      </div>

      {/* Language Selection */}
      <div>
        <label className="block mb-2">Select Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mb-4 p-2 px-8 border rounded bg-slate-900"
        >
          <option value="eng">English</option>
          <option value="ara">Arabic</option>
          <option value="spa">Spanish</option>
          <option value="fra">French</option>
          <option value="deu">German</option>
        </select>
      </div>

      {image && (
        <div className="my-5">
          <img src={image} alt="Uploaded" className="mb-4 max-w-full" />
          <button
            onClick={handleExtractText}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {loading ? "Extracting..." : "Extract Text"}
          </button>
        </div>
      )}

      {text && (
        <div className="my-5">
          <h2 className="font-bold mb-5">Extracted Text:</h2>
          <pre
            className=" p-4 rounded overflow-scroll w-full"
            style={{ backgroundColor: "#2a2a2a" }}
          >
            {text}
          </pre>

          {/* Export Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleDownloadText}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Download as .txt
            </button>
            <button
              onClick={handleDownloadPDF}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Download as PDF
            </button>
            <button
              onClick={handleDownloadMarkdown}
              className="bg-gray-800 text-white px-4 py-2 rounded"
            >
              Download as Markdown
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
