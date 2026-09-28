import React, { useState } from 'react';
import {
  CalendarCheck,
  Mail,
  Home,
  FileWarning,
  UserCheck,
  Users,
  FileText,
  Briefcase,
  UserX,
  GraduationCap,
  LogOut,
  Search,
  X
} from 'lucide-react';
import { DEFAULT_MENU_ITEMS } from '../lib/appLinksManager';
import { AppMenuItem } from '../types';

interface SidebarMenuProps {
  activeRoute: string;
  onSelectRoute: (routeId: string) => void;
  counts: Record<string, number>;
  onOpenExitModal: () => void;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  CalendarCheck: <CalendarCheck className="w-4 h-4" />,
  Mail: <Mail className="w-4 h-4" />,
  Home: <Home className="w-4 h-4" />,
  FileWarning: <FileWarning className="w-4 h-4" />,
  UserCheck: <UserCheck className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
  Briefcase: <Briefcase className="w-4 h-4" />,
  UserX: <UserX className="w-4 h-4" />,
  GraduationCap: <GraduationCap className="w-4 h-4" />
};

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
  activeRoute,
  onSelectRoute,
  counts,
  onOpenExitModal,
  isMobileDrawer = false,
  onCloseMobileDrawer
}) => {
  const [search, setSearch] = useState('');

  const filteredItems = DEFAULT_MENU_ITEMS.filter(it =>
    it.title.toLowerCase().includes(search.toLowerCase()) ||
    it.badgeCode.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [
    'Layanan Utama',
    'Bimbingan & Konseling',
    'Administrasi Tambahan',
    'Data Master'
  ] as const;

  const handleItemClick = (routeId: string) => {
    onSelectRoute(routeId);
    if (isMobileDrawer && onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  return (
    <aside className="w-full flex flex-col h-full bg-white border-r border-slate-200">
      {/* Mobile Drawer Header */}
      {isMobileDrawer && (
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <img src="https://iili.io/KDFk4fI.png" alt="Logo" className="w-7 h-7 object-contain" />
            <span className="font-bold text-sm">Menu SABDA BK</span>
          </div>
          <button
            type="button"
            onClick={onCloseMobileDrawer}
            className="p-1 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="p-3 border-b border-slate-100 bg-slate-50/50">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari menu layanan BK..."
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Menu Categories */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {categories.map(cat => {
          const itemsInCat = filteredItems.filter(it => it.category === cat);
          if (itemsInCat.length === 0) return null;

          return (
            <div key={cat} className="space-y-1">
              <div className="px-2.5 py-1 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                {cat}
              </div>

              <div className="space-y-1">
                {itemsInCat.map(item => {
                  const isActive = activeRoute === item.routeId;
                  const count = counts[item.routeId] ?? 0;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleItemClick(item.routeId)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20'
                          : 'text-slate-700 hover:bg-slate-100 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 text-slate-600 group-hover:text-blue-600'
                          }`}
                        >
                          {ICON_MAP[item.iconName] || <FileText className="w-4 h-4" />}
                        </div>
                        <div className="truncate">
                          <div className="text-xs truncate">{item.title}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                            isActive
                              ? 'bg-white/25 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.badgeCode}
                        </span>
                        {count > 0 && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                              isActive
                                ? 'bg-white text-blue-900'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {count}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer with Exit Button */}
      <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="text-[11px] font-bold text-slate-500">
          Total 10 Modul BK
        </div>

        <button
          type="button"
          onClick={onOpenExitModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
};
