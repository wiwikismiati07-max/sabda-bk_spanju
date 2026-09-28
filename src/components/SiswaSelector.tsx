import React, { useState } from 'react';
import { Search, UserCheck, Users, X, Check, Filter } from 'lucide-react';
import { SiswaBK } from '../types';

export const DAFTAR_KELAS_24 = [
  '7-A', '7-B', '7-C', '7-D', '7-E', '7-F', '7-G', '7-H',
  '8-A', '8-B', '8-C', '8-D', '8-E', '8-F', '8-G', '8-H',
  '9-A', '9-B', '9-C', '9-D', '9-E', '9-F', '9-G', '9-H'
];

interface SiswaSelectorProps {
  students: SiswaBK[];
  selectedClass?: string;
  onSelectStudent?: (student: SiswaBK) => void;
  onSelectMultiple?: (students: SiswaBK[]) => void;
  currentValue?: string;
  placeholder?: string;
  isMulti?: boolean;
}

export const SiswaSelector: React.FC<SiswaSelectorProps> = ({
  students = [],
  selectedClass = '',
  onSelectStudent,
  onSelectMultiple,
  currentValue = '',
  placeholder = 'Pilih atau cari nama siswa...',
  isMulti = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterKelas, setFilterKelas] = useState(selectedClass || 'Semua');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter list
  const filteredStudents = students.filter(s => {
    const matchClass = filterKelas === 'Semua' || s.kelas === filterKelas;
    const matchSearch = !search ||
      s.nama_siswa.toLowerCase().includes(search.toLowerCase()) ||
      (s.nis && s.nis.includes(search));
    return matchClass && matchSearch;
  });

  const handleOpenModal = () => {
    setFilterKelas(selectedClass || 'Semua');
    setSearch('');
    setSelectedIds([]);
    setIsOpen(true);
  };

  const handleToggleSelect = (siswa: SiswaBK) => {
    const id = siswa.id || siswa.nis;
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAllFiltered = () => {
    const allFilteredIds = filteredStudents.map(s => s.id || s.nis);
    const areAllSelected = allFilteredIds.every(id => selectedIds.includes(id));
    if (areAllSelected) {
      setSelectedIds(selectedIds.filter(id => !allFilteredIds.includes(id)));
    } else {
      setSelectedIds(Array.from(new Set([...selectedIds, ...allFilteredIds])));
    }
  };

  const handleConfirmMulti = () => {
    const chosen = students.filter(s => selectedIds.includes(s.id || s.nis));
    if (onSelectMultiple) onSelectMultiple(chosen);
    setIsOpen(false);
  };

  const handleSinglePick = (siswa: SiswaBK) => {
    if (onSelectStudent) onSelectStudent(siswa);
    setIsOpen(false);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={currentValue}
          readOnly
          onClick={handleOpenModal}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer text-slate-800 font-medium"
        />
        <button
          type="button"
          onClick={handleOpenModal}
          className="px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
        >
          {isMulti ? <Users className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
          <span>{isMulti ? 'Multi-Pilih (>10)' : 'Cari Siswa'}</span>
        </button>
      </div>

      {/* Selector Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {isMulti ? 'Multi-Pilih Siswa dari Database Roster' : 'Pilih Nama Siswa dari Database'}
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

            {/* Filter & Search Bar */}
            <div className="p-4 border-b border-slate-100 space-y-3 bg-white">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 mr-1">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Kelas:</span>
                </div>
                <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto p-1 bg-slate-50 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setFilterKelas('Semua')}
                    className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                      filterKelas === 'Semua' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Semua ({students.length})
                  </button>
                  {DAFTAR_KELAS_24.map(kls => {
                    const count = students.filter(s => s.kelas === kls).length;
                    return (
                      <button
                        key={kls}
                        type="button"
                        onClick={() => setFilterKelas(kls)}
                        className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                          filterKelas === kls ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {kls} {count > 0 ? `(${count})` : ''}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Ketik nama siswa atau NIS..."
                  className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Student List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5 min-h-[260px] max-h-[380px] bg-slate-50/50">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  Tidak ada siswa yang sesuai dengan pencarian / filter kelas ini.
                </div>
              ) : (
                filteredStudents.map((siswa, idx) => {
                  const id = siswa.id || siswa.nis;
                  const isChecked = selectedIds.includes(id);

                  return (
                    <div
                      key={id || idx}
                      onClick={() => (isMulti ? handleToggleSelect(siswa) : handleSinglePick(siswa))}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-blue-50/80 border-blue-300 shadow-sm'
                          : 'bg-white hover:bg-blue-50/40 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isMulti && (
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                              isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                            <span>{siswa.nama_siswa}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
                              {siswa.kelas}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>NIS: {siswa.nis || '-'}</span>
                            <span>•</span>
                            <span>{siswa.jenis_kelamin || 'L/P'}</span>
                          </div>
                        </div>
                      </div>

                      {!isMulti && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSinglePick(siswa);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"
                        >
                          Pilih
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white">
              {isMulti ? (
                <>
                  <button
                    type="button"
                    onClick={handleSelectAllFiltered}
                    className="text-xs font-semibold text-slate-600 hover:text-blue-600"
                  >
                    Pilih Semua yang Tampil ({filteredStudents.length})
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">
                      Terpilih: <b>{selectedIds.length}</b> siswa
                    </span>
                    <button
                      type="button"
                      onClick={handleConfirmMulti}
                      disabled={selectedIds.length === 0}
                      className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Terapkan ({selectedIds.length})
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
