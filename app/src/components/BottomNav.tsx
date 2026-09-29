import React from 'react';
import { Crown, UtensilsCrossed, PackageCheck, Users, Flame, Sparkles } from 'lucide-react';

export type MainNavTab = 'gestao' | 'operacao' | 'suprimentos' | 'marketing' | 'equipe' | 'copilot';

interface BottomNavProps {
  activeTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  pendingReviewsCount?: number;
  urgentAlertsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  pendingReviewsCount = 0,
  urgentAlertsCount = 0,
}) => {
  const tabs = [
    {
      id: 'gestao' as MainNavTab,
      label: 'Dono & DRE',
      icon: Crown,
      badge: urgentAlertsCount > 0 ? urgentAlertsCount : undefined,
    },
    {
      id: 'operacao' as MainNavTab,
      label: 'Salão & Mesas',
      icon: UtensilsCrossed,
    },
    {
      id: 'suprimentos' as MainNavTab,
      label: 'Estoque & CDA',
      icon: PackageCheck,
    },
    {
      id: 'marketing' as MainNavTab,
      label: 'Mkt & Reels',
      icon: Flame,
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined,
    },
    {
      id: 'equipe' as MainNavTab,
      label: 'Equipe RH',
      icon: Users,
    },
    {
      id: 'copilot' as MainNavTab,
      label: 'Assistente',
      icon: Sparkles,
      isAi: false,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] safe-area-bottom md:hidden">
      <div className="max-w-4xl mx-auto px-2 flex items-center justify-around py-1.5 sm:py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[48px] py-1 px-2 rounded-xl transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'text-[#0a2e23] bg-emerald-50 font-bold scale-[1.03]'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive ? 'scale-105 text-[#0a2e23]' : 'text-slate-400'
                  }`}
                />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full mt-0.5 bg-[#0a2e23]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
