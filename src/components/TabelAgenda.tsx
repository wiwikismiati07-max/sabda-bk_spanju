import React, { useState } from 'react';
import { Search, Edit, Trash2, FileSpreadsheet, Printer, Eye, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { AgendaKerjaItem } from '../types';

interface TabelAgendaProps {
  items: AgendaKerjaItem[];
  onEdit: (item: AgendaKerjaItem) => void;
  onDelete: (id: string) => Promise<void>;
  onPrintPreview: () => void;
}

export const TabelAgenda: React.FC<TabelAgendaProps> = ({
  items = [],
  onEdit,
  onDelete,
  onPrintPreview
}) => {
  const [search, setSearch] = useState('');
  const [selectedBulan, setSelectedBulan] = useState('Semua');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const filteredItems = items.filter(it => {
    const matchSearch =
      it.uraian_kegiatan.toLowerCase().includes(search.toLowerCase()) ||
      it.sasaran.toLowerCase().includes(search.toLowerCase()) ||
      it.hari.toLowerCase().includes(search.toLowerCase()) ||
      it.tanggal.includes(search);
    const matchBulan = selectedBulan === 'Semua' || it.bulan === selectedBulan;
    return matchSearch && matchBulan;
  });

  const handleExportXLSX = () => {
    const rows = filteredItems.map((it, idx) => ({
      'No': idx + 1,
      'Hari / Tanggal': `${it.hari}, ${it.tanggal}`,
      'Waktu': it.waktu,
      'Uraian Kegiatan': it.uraian_kegiatan,
      'Sasaran': it.sasaran,
      'Keterangan': it.keterangan || '-'
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Agenda_Kerja_BK');
    XLSX.writeFile(wb, `Agenda_Kerja_BK_SMPN7_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari uraian atau sasaran..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>

          <select
            value={selectedBulan}
            onChange={e => setSelectedBulan(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
          >
            <option value="Semua">Semua Bulan</option>
            {Array.from(new Set(items.map(i => i.bulan).filter(Boolean))).map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportXLSX}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Unduh Excel (.xlsx)</span>
          </button>
          <button
            type="button"
            onClick={onPrintPreview}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* Table with Date Deduplication */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs text-slate-800">
          <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-200">
            <tr>
              <th className="px-3 py-3 text-center w-12">No</th>
              <th className="px-3 py-3 w-40">Hari / Tanggal</th>
              <th className="px-3 py-3 w-28">Waktu</th>
              <th className="px-4 py-3">Uraian Kegiatan</th>
              <th className="px-3 py-3 w-36">Sasaran</th>
              <th className="px-2 py-3 text-center w-16">Foto</th>
              <th className="px-3 py-3 w-28">Keterangan</th>
              <th className="px-3 py-3 text-center w-20">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-slate-400">
                  Belum ada data agenda kerja yang tersimpan.
                </td>
              </tr>
            ) : (
              filteredItems.map((item, idx) => {
                const prevItem = idx > 0 ? filteredItems[idx - 1] : null;
                const isSameDate = prevItem && prevItem.tanggal === item.tanggal;

                return (
                  <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2.5 text-center font-bold text-slate-500">{idx + 1}</td>
                    <td className="px-3 py-2.5 font-semibold text-slate-900">
                      {isSameDate ? (
                        <span className="text-slate-400 font-bold italic">〃 (s.d.a)</span>
                      ) : (
                        <span>{item.hari}, {item.tanggal}</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-slate-700">{item.waktu}</td>
                    <td className="px-4 py-2.5 text-slate-900 leading-relaxed">{item.uraian_kegiatan}</td>
                    <td className="px-3 py-2.5">
                      <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-800 font-bold rounded-md text-[11px]">
                        {item.sasaran}
                      </span>
                    </td>
                    <td className="px-2 py-2.5 text-center">
                      {item.link_foto_kegiatan ? (
                        <button
                          type="button"
                          onClick={() => setPreviewImage(item.link_foto_kegiatan || null)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Lihat Foto"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 text-[11px]">{item.keterangan || '-'}</td>
                    <td className="px-3 py-2.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="p-1 text-amber-600 hover:text-amber-800 rounded"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => item.id && onDelete(item.id)}
                          className="p-1 text-rose-600 hover:text-rose-800 rounded"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-2xl w-full bg-white p-2 rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={previewImage} alt="Dokumentasi" className="w-full max-h-[80vh] object-contain rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
};
