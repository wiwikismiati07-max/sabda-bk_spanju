import React, { useState, useRef, useEffect } from 'react';
import { PenTool, RotateCcw, Check, Trash2, X, ShieldCheck } from 'lucide-react';
import { saveSignature, removeSignature } from '../lib/signatures';

interface SignatureBoxProps {
  id: string; // unique signature ID
  role: string;
  name: string;
  nip?: string;
  isKepalaSekolah?: boolean;
  savedSignature?: string;
  onSignatureChange?: (id: string, dataUrl: string | null) => void;
}

export const STEMPEL_SEKOLAH_URL = 'https://i.ibb.co.com/wrcwZdrK/STEMPEL.png';

export const SignatureBox: React.FC<SignatureBoxProps> = ({
  id,
  role,
  name,
  nip,
  isKepalaSekolah = false,
  savedSignature,
  onSignatureChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSignature, setCurrentSignature] = useState<string | null>(savedSignature || null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    if (savedSignature !== undefined) {
      setCurrentSignature(savedSignature);
    }
  }, [savedSignature]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000080'; // navy ink
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if ('touches' in e) {
      e.preventDefault(); // prevent scroll
    }

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSaveModal = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) return;
    const dataUrl = canvas.toDataURL('image/png');
    setCurrentSignature(dataUrl);
    setIsOpen(false);
    await saveSignature(id, dataUrl, role, name);
    if (onSignatureChange) onSignatureChange(id, dataUrl);
  };

  const handleDelete = async () => {
    setCurrentSignature(null);
    await removeSignature(id);
    if (onSignatureChange) onSignatureChange(id, null);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center my-2 relative">
      <div className="text-xs font-semibold text-slate-800 uppercase tracking-wide mb-1">
        {role}
      </div>

      {/* Signature Area */}
      <div className="relative w-48 h-24 flex items-center justify-center border-b border-dashed border-slate-400">
        {/* Stamp Overlay for Kepala Sekolah */}
        {isKepalaSekolah && currentSignature && (
          <img
            src={STEMPEL_SEKOLAH_URL}
            alt="Stempel SMPN 7"
            className="absolute -left-4 -top-2 w-24 h-24 object-contain pointer-events-none opacity-85 mix-blend-multiply z-10 transform -rotate-6"
          />
        )}

        {currentSignature ? (
          <div className="relative group w-full h-full flex items-center justify-center">
            <img
              src={currentSignature}
              alt="Tanda Tangan"
              className="max-h-20 max-w-full object-contain relative z-0"
            />
            <div className="no-print absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-0.5 rounded shadow">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                title="Ganti Tanda Tangan"
                className="p-1 text-blue-600 hover:text-blue-800"
              >
                <PenTool className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleDelete}
                title="Hapus Tanda Tangan"
                className="p-1 text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="no-print w-full h-full flex flex-col items-center justify-center text-xs text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 rounded transition-colors border border-transparent hover:border-blue-200"
          >
            <PenTool className="w-5 h-5 mb-1 text-blue-500 opacity-60" />
            <span>Klik untuk TTD</span>
          </button>
        )}
      </div>

      {/* Name and NIP */}
      <div className="mt-2 font-bold text-sm text-slate-900 underline underline-offset-2">
        {name || '........................................'}
      </div>
      {nip && (
        <div className="text-xs text-slate-700 font-medium">
          NIP. {nip}
        </div>
      )}

      {/* Modal Canvas Drawing */}
      {isOpen && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Goreskan Tanda Tangan Digital ({role})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isKepalaSekolah && (
              <div className="w-full bg-amber-50 text-amber-800 text-xs p-2 rounded-lg mb-3 flex items-center gap-2 border border-amber-200">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Stempel resmi SMPN 7 Pasuruan otomatis terpasang setelah tanda tangan disimpan.</span>
              </div>
            )}

            <div className="w-full bg-slate-50 rounded-xl border border-slate-300 p-1 flex justify-center touch-none">
              <canvas
                ref={canvasRef}
                width={360}
                height={160}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="bg-white rounded-lg cursor-crosshair shadow-inner border border-slate-200"
              />
            </div>

            <div className="text-xs text-slate-500 mt-2">
              Sentuh layar atau gunakan mouse untuk menandatangani.
            </div>

            <div className="flex items-center justify-between w-full mt-4 gap-2">
              <button
                type="button"
                onClick={clearCanvas}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Bersihkan
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveModal}
                  disabled={!hasDrawn}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  Simpan TTD
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
