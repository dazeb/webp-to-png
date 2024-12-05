import React, { useState, useCallback } from 'react';
import { DropZone } from './components/DropZone';
import { webpToPng } from './utils/imageConverter';
import { ImageIcon, Download, Loader2 } from 'lucide-react';

function App() {
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setConverting(true);
    setError(null);
    setResult(null);

    try {
      const pngBlob = await webpToPng(file);
      const url = URL.createObjectURL(pngBlob);
      setResult(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert image');
    } finally {
      setConverting(false);
    }
  }, []);

  const handleDownload = useCallback(() => {
    if (result) {
      const link = document.createElement('a');
      link.href = result;
      link.download = 'converted.png';
      link.click();
    }
  }, [result]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="inline-block p-3 bg-blue-50 rounded-full">
            <ImageIcon className="w-6 h-6 text-blue-500" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">WebP to PNG Converter</h1>
          <p className="mt-2 text-sm text-gray-500">
            Convert your WebP images to PNG format instantly
          </p>
        </div>

        <DropZone onFileSelect={handleFileSelect} />

        {converting && (
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
            <p className="mt-2 text-sm text-gray-600">Converting your image...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <img src={result} alt="Converted PNG" className="w-full rounded-lg" />
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PNG
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
