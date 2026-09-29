import React, { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Store,
  Plus,
  Settings,
  Sparkles,
  QrCode,
} from 'lucide-react';
import type { Restaurant } from '../../types/restaurant.types';
import { getActiveRestaurants } from '../../services/restaurantStore';

interface UnitSelectViewProps {
  onUnitSelected: (restaurant: Restaurant) => void;
  onOpenAdmin?: () => void;
  onOpenCustomerMenu?: () => void;
}

export default function UnitSelectView({ onUnitSelected, onOpenAdmin, onOpenCustomerMenu }: UnitSelectViewProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    setRestaurants(getActiveRestaurants());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#051c15] via-[#0a2e23] to-[#041711] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Efeitos de fundo */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/5 rounded-full blur-3xl pointer-events-none" />

      {/* Conteúdo Central */}
      <div className="w-full max-w-lg relative z-10 space-y-6">
        {/* Logo e Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#0a2e23] to-[#124b3a] text-amber-400 shadow-xl border border-amber-500/20 mb-2">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Tk Gestão e Tecnologia
            </h1>
            <p className="text-xs sm:text-sm text-emerald-300/70 font-medium mt-1 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400/70" />
              Plataforma Executiva de Restaurantes
            </p>
          </div>
        </div>

        {/* Card de Seleção de Unidade */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header do Card */}
          <div className="px-6 pt-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Selecione a Unidade
                </h2>
                <p className="text-xs text-slate-500">
                  Escolha o restaurante para operar hoje
                </p>
              </div>
            </div>
          </div>

          {/* Lista de Restaurantes */}
          <div className="p-4 space-y-2">
            {restaurants.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                <Building2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>Nenhuma unidade cadastrada.</p>
                <p className="text-xs mt-1">Acesse o painel admin para cadastrar.</p>
              </div>
            ) : (
              restaurants.map((restaurant) => (
                <button
                  key={restaurant.id}
                  onClick={() => onUnitSelected(restaurant)}
                  onMouseEnter={() => setHoveredId(restaurant.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left group cursor-pointer ${
                    hoveredId === restaurant.id
                      ? 'border-emerald-500 bg-emerald-50/80 shadow-md shadow-emerald-500/10 scale-[1.01]'
                      : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50'
                  }`}
                >
                  {/* Ícone do restaurante */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                      hoveredId === restaurant.id
                        ? 'bg-gradient-to-br from-emerald-600 to-emerald-800 text-amber-400 shadow-lg'
                        : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600'
                    }`}
                  >
                    <Building2 className="w-7 h-7" />
                  </div>

                  {/* Info do restaurante */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {restaurant.name}
                    </h3>
                    {restaurant.shoppingMall && (
                      <p className="text-xs text-emerald-700 font-semibold truncate">
                        {restaurant.shoppingMall}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{restaurant.city} — {restaurant.state}</span>
                    </div>
                  </div>

                  {/* Seta */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      hoveredId === restaurant.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Botão Acesso Cardápio Digital do Cliente */}
          {onOpenCustomerMenu && (
            <div className="px-4 pb-2">
              <button
                onClick={onOpenCustomerMenu}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-[#0a2e23] text-amber-300 text-xs font-bold shadow-md hover:brightness-110 transition-all cursor-pointer border border-emerald-500/30"
              >
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>Cardápio Digital do Cliente (Mesa / QR)</span>
              </button>
            </div>
          )}

          {/* Botão Admin */}
          {onOpenAdmin && (
            <div className="px-4 pb-4">
              <button
                onClick={onOpenAdmin}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-slate-300 text-xs font-semibold text-slate-500 hover:text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Painel Administrativo</span>
              </button>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="text-center text-[11px] text-emerald-200/50">
          Tk Gestão e Tecnologia © 2026 • Sistema Multi-Unidade
        </div>
      </div>
    </div>
  );
}
