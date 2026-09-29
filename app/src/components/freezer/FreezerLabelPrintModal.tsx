// ============================================================
// MODAL: ETIQUETA LOCAL DE RASTREAMENTO DO RESTAURANTE
// Tk Gestão e Tecnologia • Unidade Engenho Manauara
// ============================================================

import React from 'react';
import { X, Printer, QrCode, Calendar, Clock, Package, ShieldCheck, ThermometerSnowflake, CheckCircle2 } from 'lucide-react';
import type { FreezerTrackedItem } from '../../types/freezerTraceability.types';
import { BATCH_COLORS_CONFIG } from '../../types/freezerTraceability.types';
import { QrCodeRenderer } from './QrCodeRenderer';

interface FreezerLabelPrintModalProps {
  item: FreezerTrackedItem;
  onClose: () => void;
}

export const FreezerLabelPrintModal: React.FC<FreezerLabelPrintModalProps> = ({
  item,
  onClose,
}) => {
  const colorCfg = BATCH_COLORS_CONFIG[item.batchColor];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Cabeçalho do Modal */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500 text-slate-950">
              <Printer className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm tracking-tight">Etiqueta Local de Rastreamento</h3>
              <p className="text-[11px] text-slate-400">Padrão Restaurante Engenho Manauara • 3 Lotes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo: Visualização Real da Etiqueta Adesiva Térmica */}
        <div className="p-5 overflow-y-auto space-y-4 bg-slate-100/70 flex-1 flex flex-col items-center">
          <div className="w-full max-w-sm bg-white rounded-2xl border-2 border-dashed border-slate-300 p-4 shadow-md space-y-3 relative print:border-none print:shadow-none print:m-0 print:p-2">
            {/* Faixa Superior com Cor do Lote (Azul / Verde / Âmbar) */}
            <div
              className="rounded-xl p-2.5 text-white flex items-center justify-between shadow-xs"
              style={{ backgroundColor: colorCfg.hex }}
            >
              <div className="flex items-center gap-2">
                <ThermometerSnowflake className="w-4 h-4" />
                <span className="font-black text-xs uppercase tracking-wider">
                  {colorCfg.name}
                </span>
              </div>
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full border border-white/30 uppercase">
                {colorCfg.priorityLabel.split('•')[0].trim()}
              </span>
            </div>

            {/* Cabeçalho Institucional do Restaurante */}
            <div className="border-b border-slate-200 pb-2 text-center">
              <span className="text-[9px] font-black tracking-widest uppercase text-slate-400 block">
                Restaurante Engenho Manauara • CDA Supply
              </span>
              <h4 className="text-base font-black text-slate-900 leading-tight mt-0.5">
                {item.itemName}
              </h4>
              <span className="text-[11px] font-bold text-slate-500">
                Quantidade: {item.currentQuantity} {item.unit}
              </span>
            </div>

            {/* Bloco Central: Dados de Lote & QR Code */}
            <div className="grid grid-cols-2 gap-3 items-center py-1">
              <div className="space-y-2 text-left">
                <div>
                  <span className="text-[9px] font-black uppercase text-slate-400 block">Lote Local</span>
                  <span className="text-xs font-black text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200 inline-block">
                    {item.localBatchNumber}
                  </span>
                </div>

                <div>
                  <span className="text-[9px] font-black uppercase text-slate-400 block">Lote Origem CDA</span>
                  <span className="text-[11px] font-bold text-slate-700 font-mono">
                    {item.cdaBatchNumber}
                  </span>
                </div>

                <div>
                  <span className="text-[9px] font-black uppercase text-slate-400 block">Recebido na Loja</span>
                  <span className="text-[11px] font-semibold text-slate-800">
                    {item.receptionDate}
                  </span>
                </div>

                <div>
                  <span className="text-[9px] font-black uppercase text-rose-600 block">Validade CDA</span>
                  <span className="text-xs font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block">
                    {item.cdaExpiryDate}
                  </span>
                </div>
              </div>

              {/* QR Code Escaneável */}
              <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200">
                <QrCodeRenderer value={item.qrCode} size={110} />
                <span className="text-[10px] font-black text-slate-600 font-mono mt-1 tracking-tight">
                  {item.qrCode}
                </span>
              </div>
            </div>

            {/* Instruções de Rastreamento Térmico para a Cozinha */}
            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 text-[10px] text-slate-600 space-y-1">
              <div className="flex items-center gap-1 font-bold text-slate-800">
                <QrCode className="w-3 h-3 text-slate-700" />
                <span>Instrução de Bipagem Operacional:</span>
              </div>
              <p className="leading-snug">
                &bull; <strong>1ª Leitura:</strong> Transfere do Freezer para a Área de Degelo.
                <br />
                &bull; <strong>2ª Leitura:</strong> Marca envio do Degelo para a Produção na Cozinha.
              </p>
            </div>

            {/* Rodapé da Etiqueta */}
            <div className="pt-1 flex items-center justify-between text-[9px] text-slate-400 border-t border-slate-100">
              <span>Resp: {item.operatorReceived}</span>
              <span className="font-bold text-emerald-800">Tk Gestão e Tecnologia</span>
            </div>
          </div>

          <div className="text-xs text-slate-500 text-center max-w-sm">
            💡 Dica: A etiqueta deve ser impressa e colada na caixa/saco a vácuo assim que o caminhão do CDA descarregar na doca.
          </div>
        </div>

        {/* Ações Inferiores */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Fechar
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0a2e23] hover:bg-[#123e30] text-white shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Imprimir Etiqueta</span>
          </button>
        </div>
      </div>
    </div>
  );
};
