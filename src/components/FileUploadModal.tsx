import React, { useState } from "react";
import { Upload, X, FileSpreadsheet, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { parseUploadedFile } from "../utils/csvParser";
import { SAMPLE_DATASETS } from "../data/sampleDatasets";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDatasetLoaded: (name: string, description: string, data: Record<string, any>[]) => void;
  onSelectSample: (id: string) => void;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onDatasetLoaded,
  onSelectSample,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const parsedData = await parseUploadedFile(file);
      if (!parsedData || parsedData.length === 0) {
        throw new Error("Uploaded file contains no valid rows or readable data.");
      }
      const datasetName = file.name.replace(/\.[^/.]+$/, "");
      onDatasetLoaded(datasetName, `Custom dataset uploaded from file: ${file.name}`, parsedData);
      onClose();
    } catch (err: any) {
      console.error("File upload error:", err);
      setError(err?.message || "Failed to parse file. Please upload a valid CSV or XLSX file.");
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-lg w-full max-w-2xl shadow-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-slate-100 text-slate-700 rounded">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Upload Data File</h2>
              <p className="text-xs text-slate-500">Import CSV or Excel (.xlsx) files</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
              isDragging
                ? "border-slate-800 bg-slate-50"
                : "border-slate-200 hover:border-slate-400 bg-slate-50/50"
            }`}
          >
            <input
              type="file"
              accept=".csv, .xlsx, .xls"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              className="hidden"
              id="file-upload-input"
            />
            <label htmlFor="file-upload-input" className="cursor-pointer block space-y-3">
              <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center mx-auto">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Click to browse or drag & drop file
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports CSV, XLS, XLSX up to 50MB
                </p>
              </div>
            </label>

            {isLoading && (
              <div className="mt-4 flex items-center justify-center space-x-2 text-slate-700 text-xs font-medium">
                <div className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin" />
                <span>Parsing file content...</span>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-md text-xs flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Preset Corporate Templates */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="h-4 w-4 text-slate-700" />
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Or Select Sample Corporate Dataset
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {SAMPLE_DATASETS.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => {
                    onSelectSample(sample.id);
                    onClose();
                  }}
                  className="p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-md transition-all cursor-pointer group flex items-start justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-slate-900">
                        {sample.name}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                        {sample.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-normal">
                      {sample.description}
                    </p>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-slate-300 group-hover:text-slate-800 shrink-0 ml-3 mt-1 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-md text-xs font-medium cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
