import React, { useState } from 'react';
import { FormAgenda } from './FormAgenda';
import { TabelAgenda } from './TabelAgenda';
import { FormUndangan, TabelUndangan } from './FormUndangan';
import { FormHomeVisit, TabelHomeVisit } from './FormHomeVisit';
import { FormRekamPermasalahan, TabelRekamPermasalahan } from './FormRekamPermasalahan';
import { FormKonselingIndividu, TabelKonselingIndividu } from './FormKonselingIndividu';
import { FormKonselingKelompok, TabelKonselingKelompok } from './FormKonselingKelompok';
import { FormSuratPernyataan, TabelSuratPernyataan } from './FormSuratPernyataan';
import { FormKonferensiKasus, TabelKonferensiKasus } from './FormKonferensiKasus';
import { FormSiswaATS, TabelSiswaATS } from './FormSiswaATS';
import { FormSiswa } from './FormSiswa';
import { TabelSiswa } from './TabelSiswa';
import { PrintView } from './PrintView';
import {
  AgendaKerjaItem,
  UndanganOrangTuaItem,
  HomeVisitItem,
  RekamPermasalahanItem,
  KonselingIndividuItem,
  KonselingKelompokItem,
  SuratPernyataanItem,
  KonferensiKasusItem,
  SiswaATSItem,
  SiswaBK,
  AppMenuItem
} from '../types';

interface MainAppViewerProps {
  activeRoute: string;
  activeMenuItem?: AppMenuItem;
  students: SiswaBK[];
  onSaveSiswa: (item: SiswaBK) => Promise<void>;
  onDeleteSiswa: (id: string) => Promise<void>;
  onBulkImportSiswa: (items: SiswaBK[]) => Promise<number>;
  agendaItems: AgendaKerjaItem[];
  onSaveAgenda: (item: AgendaKerjaItem) => Promise<void>;
  onDeleteAgenda: (id: string) => Promise<void>;
  undanganItems: UndanganOrangTuaItem[];
  onSaveUndangan: (item: UndanganOrangTuaItem) => Promise<void>;
  onDeleteUndangan: (id: string) => Promise<void>;
  homeVisitItems: HomeVisitItem[];
  onSaveHomeVisit: (item: HomeVisitItem) => Promise<void>;
  onDeleteHomeVisit: (id: string) => Promise<void>;
  rekamMasalahItems: RekamPermasalahanItem[];
  onSaveRekamMasalah: (item: RekamPermasalahanItem) => Promise<void>;
  onDeleteRekamMasalah: (id: string) => Promise<void>;
  konselingIndividuItems: KonselingIndividuItem[];
  onSaveKonselingIndividu: (item: KonselingIndividuItem) => Promise<void>;
  onDeleteKonselingIndividu: (id: string) => Promise<void>;
  konselingKelompokItems: KonselingKelompokItem[];
  onSaveKonselingKelompok: (item: KonselingKelompokItem) => Promise<void>;
  onDeleteKonselingKelompok: (id: string) => Promise<void>;
  suratPernyataanItems: SuratPernyataanItem[];
  onSaveSuratPernyataan: (item: SuratPernyataanItem) => Promise<void>;
  onDeleteSuratPernyataan: (id: string) => Promise<void>;
  konferensiKasusItems: KonferensiKasusItem[];
  onSaveKonferensiKasus: (item: KonferensiKasusItem) => Promise<void>;
  onDeleteKonferensiKasus: (id: string) => Promise<void>;
  siswaATSItems: SiswaATSItem[];
  onSaveSiswaATS: (item: SiswaATSItem) => Promise<void>;
  onDeleteSiswaATS: (id: string) => Promise<void>;
}

export const MainAppViewer: React.FC<MainAppViewerProps> = ({
  activeRoute,
  activeMenuItem,
  students = [],
  onSaveSiswa,
  onDeleteSiswa,
  onBulkImportSiswa,
  agendaItems = [],
  onSaveAgenda,
  onDeleteAgenda,
  undanganItems = [],
  onSaveUndangan,
  onDeleteUndangan,
  homeVisitItems = [],
  onSaveHomeVisit,
  onDeleteHomeVisit,
  rekamMasalahItems = [],
  onSaveRekamMasalah,
  onDeleteRekamMasalah,
  konselingIndividuItems = [],
  onSaveKonselingIndividu,
  onDeleteKonselingIndividu,
  konselingKelompokItems = [],
  onSaveKonselingKelompok,
  onDeleteKonselingKelompok,
  suratPernyataanItems = [],
  onSaveSuratPernyataan,
  onDeleteSuratPernyataan,
  konferensiKasusItems = [],
  onSaveKonferensiKasus,
  onDeleteKonferensiKasus,
  siswaATSItems = [],
  onSaveSiswaATS,
  onDeleteSiswaATS
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'form' | 'table'>('form');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [printDoc, setPrintDoc] = useState<{ docType: string; data: any } | null>(null);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setActiveSubTab('form');
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleOpenPrint = (docType: string, data: any) => {
    setPrintDoc({ docType, data });
  };

  if (printDoc) {
    return (
      <PrintView
        docType={printDoc.docType}
        data={printDoc.data}
        onBack={() => setPrintDoc(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Module Title & Tab Switcher Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-600 text-white rounded-md">
              {activeMenuItem?.badgeCode || 'BK'}
            </span>
            <h2 className="text-base font-extrabold text-slate-900">
              {activeMenuItem?.title || 'Layanan Administrasi BK'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeMenuItem?.description || 'UPT SMP Negeri 7 Pasuruan'}
          </p>
        </div>

        {/* Form / Table Toggle */}
        <div className="flex p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setActiveSubTab('form');
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === 'form'
                ? 'bg-white text-blue-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {editingItem ? 'Mode Edit Data' : 'Input Formulir'}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveSubTab('table');
              setEditingItem(null);
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === 'table'
                ? 'bg-white text-blue-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rekap Tabel Data
          </button>
        </div>
      </div>

      {/* 1. AGENDA KERJA */}
      {activeRoute === 'internal:agenda_kerja' && (
        activeSubTab === 'form' ? (
          <FormAgenda
            initialData={editingItem}
            onSubmit={async data => {
              await onSaveAgenda(data);
              setEditingItem(null);
              setActiveSubTab('table');
            }}
            onCancelEdit={handleCancelEdit}
            students={students}
          />
        ) : (
          <TabelAgenda
            items={agendaItems}
            onEdit={handleEdit}
            onDelete={onDeleteAgenda}
            onPrintPreview={() => handleOpenPrint('agenda_kerja', agendaItems)}
          />
        )
      )}

      {/* 2. UNDANGAN ORANG TUA */}
      {activeRoute === 'internal:undangan_orang_tua' && (
        activeSubTab === 'form' ? (
          <FormUndangan
            initialData={editingItem}
            onSubmit={async data => {
              await onSaveUndangan(data);
              setEditingItem(null);
              setActiveSubTab('table');
            }}
            onCancelEdit={handleCancelEdit}
            students={students}
          />
        ) : (
          <TabelUndangan
            items={undanganItems}
            onEdit={handleEdit}
            onDelete={onDeleteUndangan}
            onPrintSurat={it => handleOpenPrint('undangan_surat', it)}
            onPrintLaporan={it => handleOpenPrint('undangan_laporan', it)}
          />
        )
      )}

      {/* 3. HOME VISIT */}
      {activeRoute === 'internal:home_visit' && (
        activeSubTab === 'form' ? (
          <FormHomeVisit
            initialData={editingItem}
            onSubmit={async data => {
              await onSaveHomeVisit(data);
              setEditingItem(null);
              setActiveSubTab('table');
            }}
            onCancelEdit={handleCancelEdit}
            students={students}
          />
        ) : (
          <TabelHomeVisit
            items={homeVisitItems}
            onEdit={handleEdit}
            onDelete={onDeleteHomeVisit}
            onPrintSuratTugas={it => handleOpenPrint('home_visit_surat_tugas', it)}
            onPrintKesediaan={it => handleOpenPrint('home_visit_surat_tugas', it)}
            onPrintLaporan14Poin={it => handleOpenPrint('home_visit_surat_tugas', it)}
          />
        )
      )}

      {/* 4. REKAM PERMASALAHAN */}
      {activeRoute === 'internal:rekam_permasalahan' && (
        activeSubTab === 'form' ? (
          <FormRekamPermasalahan
            initialData={editingItem}
            onSubmit={async data => {
              await onSaveRekamMasalah(data);
              setEditingItem(null);
              setActiveSubTab('table');
            }}
            onCancelEdit={handleCancelEdit}
            students={students}
          />
        ) : (
          <TabelRekamPermasalahan
            items={rekamMasalahItems}
            onEdit={handleEdit}
            onDelete={onDeleteRekamMasalah}
            onPrintPreview={() => handleOpenPrint('agenda_kerja', rekamMasalahItems)}
          />
        )
      )}

      {/* 5. KONSELING INDIVIDU */}
      {activeRoute === 'internal:konseling_individu' && (
        activeSubTab === 'form' ? (
          <FormKonselingIndividu
            initialData={editingItem}
            onSubmit={async data => {
              await onSaveKonselingIndividu(data);
              setEditingItem(null);
              setActiveSubTab('table');
            }}
            onCancelEdit={handleCancelEdit}
            students={students}
          />
        ) : (
          <TabelKonselingIndividu
            items={konselingIndividuItems}
            onEdit={handleEdit}
            onDelete={onDeleteKonselingIndividu}
            onPrintPreview={() => handleOpenPrint('agenda_kerja', konselingIndividuItems)}
          />
        )
      )}

      {/* 6. KONSELING KELOMPOK */}
      {activeRoute === 'internal:konseling_kelompok' && (
        activeSubTab === 'form' ? (
          <FormKonselingKelompok
            initialData={editingItem}
            onSubmit={async data => {
              await onSaveKonselingKelompok(data);
              setEditingItem(null);
              setActiveSubTab('table');
            }}
            onCancelEdit={handleCancelEdit}
            students={students}
          />
        ) : (
          <TabelKonselingKelompok
            items={konselingKelompokItems}
            onEdit={handleEdit}
            onDelete={onDeleteKonselingKelompok}
            onPrintPreview={() => handleOpenPrint('agenda_kerja', konselingKelompokItems)}
          />
        )
      )}

      {/* 7. SURAT PERNYATAAN */}
      {activeRoute === 'internal:surat_pernyataan' && (
        activeSubTab === 'form' ? (
          <FormSuratPernyataan
            initialData={editingItem}
            onSubmit={async data => {
              await onSaveSuratPernyataan(data);
              setEditingItem(null);
              setActiveSubTab('table');
            }}
            onCancelEdit={handleCancelEdit}
            students={students}
          />
        ) : (
          <TabelSuratPernyataan
            items={suratPernyataanItems}
            onEdit={handleEdit}
            onDelete={onDeleteSuratPernyataan}
            onPrintPreview={it => {
              if (it.jenis_sp === 'SP DAMAI SISWA') {
                handleOpenPrint('sp_damai', it);
              } else {
                handleOpenPrint('surat_pernyataan_reguler', it);
              }
            }}
          />
        )
      )}

      {/* 8. KONFERENSI KASUS */}
      {activeRoute === 'internal:konferensi_kasus' && (
        activeSubTab === 'form' ? (
          <FormKonferensiKasus
            initialData={editingItem}
            onSubmit={async data => {
              await onSaveKonferensiKasus(data);
              setEditingItem(null);
              setActiveSubTab('table');
            }}
            onCancelEdit={handleCancelEdit}
            students={students}
          />
        ) : (
          <TabelKonferensiKasus
            items={konferensiKasusItems}
            onEdit={handleEdit}
            onDelete={onDeleteKonferensiKasus}
            onPrintNotula={it => handleOpenPrint('agenda_kerja', it)}
            onPrintRapat={it => handleOpenPrint('agenda_kerja', it)}
            onPrintHadir={it => handleOpenPrint('agenda_kerja', it)}
          />
        )
      )}

      {/* 9. SISWA ATS */}
      {activeRoute === 'internal:siswa_ats' && (
        activeSubTab === 'form' ? (
          <FormSiswaATS
            initialData={editingItem}
            onSubmit={async data => {
              await onSaveSiswaATS(data);
              setEditingItem(null);
              setActiveSubTab('table');
            }}
            onCancelEdit={handleCancelEdit}
            students={students}
          />
        ) : (
          <TabelSiswaATS
            items={siswaATSItems}
            onEdit={handleEdit}
            onDelete={onDeleteSiswaATS}
            onPrintPreview={it => handleOpenPrint('siswa_ats', it)}
          />
        )
      )}

      {/* 10. MANAGEMENT SISWA */}
      {activeRoute === 'internal:management_siswa' && (
        activeSubTab === 'form' ? (
          <FormSiswa
            initialData={editingItem}
            onSubmit={async data => {
              await onSaveSiswa(data);
              setEditingItem(null);
              setActiveSubTab('table');
            }}
            onCancelEdit={handleCancelEdit}
          />
        ) : (
          <TabelSiswa
            items={students}
            onEdit={handleEdit}
            onDelete={onDeleteSiswa}
            onBulkImport={onBulkImportSiswa}
          />
        )
      )}
    </div>
  );
};
