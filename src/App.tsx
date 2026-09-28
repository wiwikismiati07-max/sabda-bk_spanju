import React, { useState, useEffect, useCallback } from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import { SidebarMenu } from './components/SidebarMenu';
import { MainAppViewer } from './components/MainAppViewer';
import { SupabaseSettingsModal } from './components/SupabaseSettingsModal';
import { InstallGuideModal } from './components/InstallGuideModal';
import { ExitAppModal, ExitScreen } from './components/ExitAppModal';
import { DEFAULT_MENU_ITEMS } from './lib/appLinksManager';
import { getActiveGuruBK } from './lib/guruBk';
import {
  fetchAllSiswa,
  saveOrUpdateSiswa,
  bulkSaveOrUpdateSiswa,
  deleteSiswaItem,
  fetchAllAgenda,
  saveOrUpdateAgenda,
  deleteAgendaItem,
  fetchAllUndangan,
  saveOrUpdateUndangan,
  deleteUndanganItem,
  fetchAllHomeVisit,
  saveOrUpdateHomeVisit,
  deleteHomeVisitItem,
  fetchAllRekamPermasalahan,
  saveOrUpdateRekamPermasalahan,
  deleteRekamPermasalahanItem,
  fetchAllKonselingIndividu,
  saveOrUpdateKonselingIndividu,
  deleteKonselingIndividuItem,
  fetchAllKonselingKelompok,
  saveOrUpdateKonselingKelompok,
  deleteKonselingKelompokItem,
  fetchAllSuratPernyataan,
  saveOrUpdateSuratPernyataan,
  deleteSuratPernyataanItem,
  fetchAllKonferensiKasus,
  saveOrUpdateKonferensiKasus,
  deleteKonferensiKasusItem,
  fetchAllSiswaATS,
  saveOrUpdateSiswaATS,
  deleteSiswaATSItem,
  getSupabaseClient
} from './lib/supabase';
import {
  SiswaBK,
  AgendaKerjaItem,
  UndanganOrangTuaItem,
  HomeVisitItem,
  RekamPermasalahanItem,
  KonselingIndividuItem,
  KonselingKelompokItem,
  SuratPernyataanItem,
  KonferensiKasusItem,
  SiswaATSItem,
  GuruBKProfile
} from './types';

export default function App() {
  const [activeRoute, setActiveRoute] = useState('internal:agenda_kerja');
  const [activeGuru, setActiveGuru] = useState<GuruBKProfile>(getActiveGuruBK());

  // Modals state
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isExited, setIsExited] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Data States
  const [students, setStudents] = useState<SiswaBK[]>([]);
  const [agendaItems, setAgendaItems] = useState<AgendaKerjaItem[]>([]);
  const [undanganItems, setUndanganItems] = useState<UndanganOrangTuaItem[]>([]);
  const [homeVisitItems, setHomeVisitItems] = useState<HomeVisitItem[]>([]);
  const [rekamMasalahItems, setRekamMasalahItems] = useState<RekamPermasalahanItem[]>([]);
  const [konselingIndividuItems, setKonselingIndividuItems] = useState<KonselingIndividuItem[]>([]);
  const [konselingKelompokItems, setKonselingKelompokItems] = useState<KonselingKelompokItem[]>([]);
  const [suratPernyataanItems, setSuratPernyataanItems] = useState<SuratPernyataanItem[]>([]);
  const [konferensiKasusItems, setKonferensiKasusItems] = useState<KonferensiKasusItem[]>([]);
  const [siswaATSItems, setSiswaATSItems] = useState<SiswaATSItem[]>([]);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(true);

  // Load All Data
  const loadAllData = useCallback(async () => {
    try {
      const [
        sList,
        aList,
        uList,
        hList,
        rList,
        kiList,
        kkList,
        spList,
        kkasList,
        atsList
      ] = await Promise.all([
        fetchAllSiswa(),
        fetchAllAgenda(),
        fetchAllUndangan(),
        fetchAllHomeVisit(),
        fetchAllRekamPermasalahan(),
        fetchAllKonselingIndividu(),
        fetchAllKonselingKelompok(),
        fetchAllSuratPernyataan(),
        fetchAllKonferensiKasus(),
        fetchAllSiswaATS()
      ]);

      setStudents(sList || []);
      setAgendaItems(aList || []);
      setUndanganItems(uList || []);
      setHomeVisitItems(hList || []);
      setRekamMasalahItems(rList || []);
      setKonselingIndividuItems(kiList || []);
      setKonselingKelompokItems(kkList || []);
      setSuratPernyataanItems(spList || []);
      setKonferensiKasusItems(kkasList || []);
      setSiswaATSItems(atsList || []);
    } catch (err) {
      console.error('Error loading data', err);
    }
  }, []);

  useEffect(() => {
    loadAllData();

    // Check PWA Install Prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Periodic Background Sync (every 8 seconds)
    const interval = setInterval(() => {
      loadAllData();
    }, 8000);

    // Focus / Visibility Auto-Sync
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadAllData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    // Supabase Realtime Listener
    const client = getSupabaseClient();
    let channel: any = null;
    if (client) {
      channel = client
        .channel('sabda-bk-global-realtime')
        .on('postgres_changes', { event: '*', schema: 'public' }, () => {
          loadAllData();
        })
        .subscribe();
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
      if (channel && client) {
        client.removeChannel(channel);
      }
    };
  }, [loadAllData]);

  // Counts for sidebar badges
  const counts: Record<string, number> = {
    'internal:agenda_kerja': agendaItems.length,
    'internal:undangan_orang_tua': undanganItems.length,
    'internal:home_visit': homeVisitItems.length,
    'internal:rekam_permasalahan': rekamMasalahItems.length,
    'internal:konseling_individu': konselingIndividuItems.length,
    'internal:konseling_kelompok': konselingKelompokItems.length,
    'internal:surat_pernyataan': suratPernyataanItems.length,
    'internal:konferensi_kasus': konferensiKasusItems.length,
    'internal:siswa_ats': siswaATSItems.length,
    'internal:management_siswa': students.length
  };

  const activeMenuItem = DEFAULT_MENU_ITEMS.find(i => i.routeId === activeRoute);

  if (isExited) {
    return <ExitScreen onReEnter={() => setIsExited(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased text-slate-900">
      {/* Header */}
      <DashboardHeader
        activeGuru={activeGuru}
        onGuruChange={setActiveGuru}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onToggleMobileMenu={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
        isSupabaseConnected={isSupabaseConnected}
      />

      {/* Horizontal Quick Access Chips on mobile / tablet */}
      <div className="bg-slate-900/95 border-b border-slate-800 py-2 px-3 overflow-x-auto no-scrollbar lg:hidden">
        <div className="flex items-center gap-1.5 w-max">
          {DEFAULT_MENU_ITEMS.map(item => {
            const isActive = activeRoute === item.routeId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveRoute(item.routeId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>{item.badgeCode}</span>
                <span className="font-normal opacity-90">{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Left Sidebar (Desktop) */}
        <div className="hidden lg:block w-72 shrink-0 sticky top-[65px] h-[calc(100vh-65px)]">
          <SidebarMenu
            activeRoute={activeRoute}
            onSelectRoute={setActiveRoute}
            counts={counts}
            onOpenExitModal={() => setIsExitModalOpen(true)}
          />
        </div>

        {/* Right Content Area */}
        <main className="flex-1 p-3 sm:p-6 overflow-y-auto">
          <MainAppViewer
            activeRoute={activeRoute}
            activeMenuItem={activeMenuItem}
            students={students}
            onSaveSiswa={async s => {
              await saveOrUpdateSiswa(s);
              await loadAllData();
            }}
            onDeleteSiswa={async id => {
              await deleteSiswaItem(id);
              await loadAllData();
            }}
            onBulkImportSiswa={async sl => {
              const res = await bulkSaveOrUpdateSiswa(sl);
              await loadAllData();
              return res;
            }}
            agendaItems={agendaItems}
            onSaveAgenda={async a => {
              await saveOrUpdateAgenda(a);
              await loadAllData();
            }}
            onDeleteAgenda={async id => {
              await deleteAgendaItem(id);
              await loadAllData();
            }}
            undanganItems={undanganItems}
            onSaveUndangan={async u => {
              await saveOrUpdateUndangan(u);
              await loadAllData();
            }}
            onDeleteUndangan={async id => {
              await deleteUndanganItem(id);
              await loadAllData();
            }}
            homeVisitItems={homeVisitItems}
            onSaveHomeVisit={async h => {
              await saveOrUpdateHomeVisit(h);
              await loadAllData();
            }}
            onDeleteHomeVisit={async id => {
              await deleteHomeVisitItem(id);
              await loadAllData();
            }}
            rekamMasalahItems={rekamMasalahItems}
            onSaveRekamMasalah={async r => {
              await saveOrUpdateRekamPermasalahan(r);
              await loadAllData();
            }}
            onDeleteRekamMasalah={async id => {
              await deleteRekamPermasalahanItem(id);
              await loadAllData();
            }}
            konselingIndividuItems={konselingIndividuItems}
            onSaveKonselingIndividu={async ki => {
              await saveOrUpdateKonselingIndividu(ki);
              await loadAllData();
            }}
            onDeleteKonselingIndividu={async id => {
              await deleteKonselingIndividuItem(id);
              await loadAllData();
            }}
            konselingKelompokItems={konselingKelompokItems}
            onSaveKonselingKelompok={async kk => {
              await saveOrUpdateKonselingKelompok(kk);
              await loadAllData();
            }}
            onDeleteKonselingKelompok={async id => {
              await deleteKonselingKelompokItem(id);
              await loadAllData();
            }}
            suratPernyataanItems={suratPernyataanItems}
            onSaveSuratPernyataan={async sp => {
              await saveOrUpdateSuratPernyataan(sp);
              await loadAllData();
            }}
            onDeleteSuratPernyataan={async id => {
              await deleteSuratPernyataanItem(id);
              await loadAllData();
            }}
            konferensiKasusItems={konferensiKasusItems}
            onSaveKonferensiKasus={async k => {
              await saveOrUpdateKonferensiKasus(k);
              await loadAllData();
            }}
            onDeleteKonferensiKasus={async id => {
              await deleteKonferensiKasusItem(id);
              await loadAllData();
            }}
            siswaATSItems={siswaATSItems}
            onSaveSiswaATS={async ats => {
              await saveOrUpdateSiswaATS(ats);
              await loadAllData();
            }}
            onDeleteSiswaATS={async id => {
              await deleteSiswaATSItem(id);
              await loadAllData();
            }}
          />
        </main>
      </div>

      {/* Mobile Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          <div className="relative w-80 max-w-[85%] bg-white h-full z-10 shadow-2xl flex flex-col">
            <SidebarMenu
              activeRoute={activeRoute}
              onSelectRoute={setActiveRoute}
              counts={counts}
              onOpenExitModal={() => {
                setIsMobileDrawerOpen(false);
                setIsExitModalOpen(true);
              }}
              isMobileDrawer={true}
              onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      <SupabaseSettingsModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConfigUpdated={() => loadAllData()}
      />

      <InstallGuideModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
      />

      <ExitAppModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onConfirmExit={() => {
          setIsExitModalOpen(false);
          setIsExited(true);
        }}
        activeGuru={activeGuru}
      />
    </div>
  );
}
