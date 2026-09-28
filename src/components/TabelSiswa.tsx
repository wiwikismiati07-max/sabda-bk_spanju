import React, { useState } from 'react';
import { Search, Edit, Trash2, FileSpreadsheet, Upload, Download, Check, AlertCircle, RefreshCw } from 'lucide-react';
import * as XLSX from 'xlsx';
import { SiswaBK } from '../types';
import { DAFTAR_KELAS_24 } from './SiswaSelector';

interface TabelSiswaProps {
  items: SiswaBK[];
  onEdit: (item: SiswaBK) => void;
  onDelete: (id: string) => Promise<void>;
  onBulkImport: (items: SiswaBK[]) => Promise<number>;
  isLoading?: boolean;
}

export const TabelSiswa: React.FC<TabelSiswaProps> = ({
  items = [],
  onEdit,
  onDelete,
  onBulkImport,
  isLoading = false
}) => {
  const [search, setSearch] = useState('');
  const [filterKelas, setFilterKelas] = useState('Semua');
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);

  const filtered = items.filter(it => {
    const matchSearch =
      it.nama_siswa.toLowerCase().includes(search.toLowerCase()) ||
      (it.nis && it.nis.includes(search));
    const matchKelas = filterKelas === 'Semua' || it.kelas === filterKelas;
    return matchSearch && matchKelas;
  });

  const handleDownloadTemplate = () => {
    const templateData = [
      { 'Nama Siswa': 'ADITYA PRATAMA', 'Kelas': '7-A', 'NIS': '10201', 'Jenis Kelamin': 'Laki-laki', 'Keterangan': 'Aktif' },
      { 'Nama Siswa': 'AISYAH PUTRI NURAINI', 'Kelas': '7-A', 'NIS': '10202', 'Jenis Kelamin': 'Perempuan', 'Keterangan': 'Aktif' },
      { 'Nama Siswa': 'DIMAS WAHYU', 'Kelas': '8-A', 'NIS': '09812', 'Jenis Kelamin': 'Laki-laki', 'Keterangan': 'Aktif' }
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template_Siswa');
    XLSX.writeFile(wb, 'Template_Import_Siswa_SMPN7.xlsx');
  };

  const handleExportAll = () => {
    const data = items.map((s, idx) => ({
      'No': idx + 1,
      'Nama Siswa': s.nama_siswa,
      'Kelas': s.kelas,
      'NIS': s.nis,
      'Jenis Kelamin': s.jenis_kelamin,
      'Keterangan': s.keterangan || '-'
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Database_Siswa_BK');
    XLSX.writeFile(wb, `Database_Siswa_SMPN7_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportMsg(null);

    try {
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: 'array' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rawRows: any[] = XLSX.utils.sheet_to_json(sheet);

      if (rawRows.length === 0) {
        setImportMsg('File Excel kosong atau format tidak sesuai.');
        setImporting(false);
        return;
      }

      const parsedStudents: SiswaBK[] = rawRows.map(row => {
        // Look up key variants
        const nama = row['Nama Siswa'] || row['NAMA SISWA'] || row['Nama'] || row['nama_siswa'] || row['NAMA'] || '';
        const rawKelas = row['Kelas'] || row['KELAS'] || row['kelas'] || '7-A';
        const jk = row['Jenis Kelamin'] || row['JENIS KELAMIN'] || row['JK'] || row['jenis_kelamin'] || 'Laki-laki';
        const rawNIS = row['NIS'] || row['NISN'] || row['nis'] || row['Nomor Induk'] || '';
        const ket = row['Keterangan'] || row['keterangan'] || '';

        // Normalize class format (e.g., 7A -> 7-A, VII A -> 7-A)
        let normalizedKelas = String(rawKelas).trim().toUpperCase();
        normalizedKelas = normalizedKelas.replace(/^VII\s*/, '7-').replace(/^VIII\s*/, '8-').replace(/^IX\s*/, '9-');
        if (/^[789][A-H]$/.test(normalizedKelas)) {
          normalizedKelas = `${normalizedKelas[0]}-${normalizedKelas[1]}`;
        }

        return {
          nama_siswa: String(nama).trim().toUpperCase(),
          kelas: normalizedKelas || '7-A',
          nis: String(rawNIS).trim(),
          jenis_kelamin: String(jk).startsWith('P') ? 'Perempuan' : 'Laki-laki',
          keterangan: String(ket).trim()
        };
      }).filter(s => s.nama_siswa && s.nis);

      if (parsedStudents.length === 0) {
        setImportMsg('Gagal membaca data siswa. Pastikan kolom "Nama Siswa" dan "NIS" terisi.');
      } else {
        const count = await onBulkImport(parsedStudents);
        setImportMsg(`Berhasil mengimpor & menyinkronkan ${count} siswa ke database Supabase!`);
      }
    } catch (err: any) {
      console.error('Import error', err);
      setImportMsg(`Error saat membaca file Excel: ${err?.message || 'Format tidak didukung'}`);
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      {/* Excel Import Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-blue-950">Impor Data Siswa Massal (.xlsx)</div>
            <div className="text-xs text-blue-800">Unggah file Excel 24 kelas untuk mengisi basis data siswa sekaligus.</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Download Template</span>
          </button>

          <label className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl cursor-pointer transition-all shadow-md">
            <Upload className="w-3.5 h-3.5" />
            <span>{importing ? 'Mengimpor...' : 'Upload Excel (.xlsx)'}</span>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              disabled={importing}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {importMsg && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{importMsg}</span>
          </div>
          <button type="button" onClick={() => setImportMsg(null)} className="text-blue-600 hover:underline">
            Tutup
          </button>
        </div>
      )}

      {/* Filter & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari siswa atau NIS..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>
          <select
            value={filterKelas}
            onChange={e => setFilterKelas(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
          >
            <option value="Semua">Semua 24 Kelas ({items.length})</option>
            {DAFTAR_KELAS_24.map(k => {
              const c = items.filter(s => s.kelas === k).length;
              return (
                <option key={k} value={k}>{k} ({c})</option>
              );
            })}
          </select>
        </div>

        <button
          type="button"
          onClick={handleExportAll}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors shadow-sm"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Export Database (.xlsx)</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs text-slate-800">
          <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-200">
            <tr>
              <th className="px-3 py-3 text-center w-12">No</th>
              <th className="px-3 py-3 w-28">Kelas</th>
              <th className="px-3 py-3 w-32">NIS</th>
              <th className="px-4 py-3">Nama Siswa</th>
              <th className="px-3 py-3 w-28">Jenis Kelamin</th>
              <th className="px-3 py-3 w-36">Keterangan</th>
              <th className="px-3 py-3 text-center w-20">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-slate-400">
                  {isLoading ? 'Memuat data siswa...' : 'Belum ada data siswa.'}
                </td>
              </tr>
            ) : (
              filtered.map((item, idx) => (
                <tr key={item.id || item.nis || idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-2 text-center font-bold text-slate-500">{idx + 1}</td>
                  <td className="px-3 py-2">
                    <span className="font-extrabold px-2 py-0.5 bg-blue-50 text-blue-800 rounded text-xs">
                      {item.kelas}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-mono text-slate-600 font-bold">{item.nis}</td>
                  <td className="px-4 py-2 font-bold text-slate-900">{item.nama_siswa}</td>
                  <td className="px-3 py-2 text-slate-700">{item.jenis_kelamin}</td>
                  <td className="px-3 py-2 text-slate-500 text-[11px]">{item.keterangan || '-'}</td>
                  <td className="px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="p-1 text-amber-600 hover:text-amber-800"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => item.id && onDelete(item.id)}
                        className="p-1 text-rose-600 hover:text-rose-800"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
