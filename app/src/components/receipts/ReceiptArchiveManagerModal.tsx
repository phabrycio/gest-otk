// ============================================================
// MODAL: CENTRAL DE GESTÃO E ARQUIVAMENTO FISCAL DE NOTAS (3 MESES)
// Tk Gestão e Tecnologia • Unidade Engenho Manauara
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  FileText,
  Download,
  Trash2,
  PlusCircle,
  Calendar,
  DollarSign,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  Search,
  ExternalLink,
  ShieldCheck,
  Eye,
  Info,
  Clock,
  Sparkles,
  Upload,
  Camera,
  Image as ImageIcon,
} from 'lucide-react';
import type { FiscalReceipt, ReceiptCategory, ReceiptMonthSummary } from '../../types/receiptArchive.types';
import { RECEIPT_CATEGORY_LABELS } from '../../types/receiptArchive.types';
import {
  getMonthSummaries,
  addFiscalReceipt,
  downloadMonthReceiptsZip,
  confirmPurgeAndFreeOnlineStorage,
} from '../../services/receiptArchiveStore';

interface ReceiptArchiveManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserName: string;
  initialMonthBucket?: string;
}

export const ReceiptArchiveManagerModal: React.FC<ReceiptArchiveManagerModalProps> = ({
  isOpen,
  onClose,
  currentUserName,
  initialMonthBucket,
}) => {
  const [summaries, setSummaries] = useState<ReceiptMonthSummary[]>([]);
  const [selectedMonthBucket, setSelectedMonthBucket] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceiptForPreview, setSelectedReceiptForPreview] = useState<FiscalReceipt | null>(null);
  const [isAddingReceipt, setIsAddingReceipt] = useState(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Formulário de inserção de nova nota
  const [newReceiptForm, setNewReceiptForm] = useState({
    receiptNumber: '',
    supplierName: '',
    cnpjOrCpf: '',
    category: 'HORTIFRUTI_FEIRA' as ReceiptCategory,
    amount: '',
    issueDate: new Date().toISOString().slice(0, 10),
    notes: '',
    imageUrl: '',
    fileName: '',
  });

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setNewReceiptForm((prev) => ({
        ...prev,
        imageUrl: base64,
        fileName: file.name || `foto_nf_${Date.now()}.jpg`,
      }));
    };
    reader.readAsDataURL(file);
  };

  const loadData = () => {
    const list = getMonthSummaries();
    setSummaries(list);
    if (!selectedMonthBucket && list.length > 0) {
      setSelectedMonthBucket(initialMonthBucket || list[0].monthBucket);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
      if (initialMonthBucket) {
        setSelectedMonthBucket(initialMonthBucket);
      }
    }
  }, [isOpen, initialMonthBucket]);

  useEffect(() => {
    const handleUpdate = () => loadData();
    window.addEventListener('receipts-updated', handleUpdate);
    return () => window.removeEventListener('receipts-updated', handleUpdate);
  }, [selectedMonthBucket]);

  if (!isOpen) return null;

  const currentSummary = summaries.find((s) => s.monthBucket === selectedMonthBucket) || summaries[0];

  const filteredReceipts = (currentSummary?.receipts || []).filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.receiptNumber.toLowerCase().includes(q) ||
      r.supplierName.toLowerCase().includes(q) ||
      r.cnpjOrCpf.toLowerCase().includes(q) ||
      (RECEIPT_CATEGORY_LABELS[r.category] || '').toLowerCase().includes(q)
    );
  });

  const handleDownloadZip = async () => {
    if (!currentSummary) return;
    try {
      setIsDownloadingZip(true);
      const res = await downloadMonthReceiptsZip(currentSummary.monthBucket, currentUserName || 'Gerente');
      setSuccessToast(`Download concluído! Arquivo gerado: ${res.fileName} com ${res.totalFiles} notas.`);
      setTimeout(() => setSuccessToast(null), 5000);
      loadData();
    } catch (e: any) {
      alert(`Erro no download: ${e.message}`);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const handlePurgeCloudImages = () => {
    if (!currentSummary) return;
    const confirmText = prompt(
      `ATENÇÃO GERENTE: Você confirma que JÁ realizou o download do arquivo ZIP para o seu computador local?\n\nDigite "CONFIRMAR" para expurgar as imagens online de ${currentSummary.monthLabel} e liberar espaço no Supabase:`
    );

    if (confirmText?.trim().toUpperCase() === 'CONFIRMAR') {
      const res = awaitPurge();
    }
  };

  const awaitPurge = () => {
    if (!currentSummary) return;
    const res = confirmPurgeAndFreeOnlineStorage(currentSummary.monthBucket, currentUserName || 'Gerente');
    setSuccessToast(
      `Espaço Liberado com Sucesso! ${res.purgedCount} imagens expurgadas da nuvem (${(res.freedKb / 1024).toFixed(2)} MB liberados). Metadados contábeis preservados.`
    );
    setTimeout(() => setSuccessToast(null), 6000);
    loadData();
  };

  const handleCreateReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReceiptForm.receiptNumber || !newReceiptForm.supplierName || !newReceiptForm.amount) {
      alert('Por favor, preencha os campos obrigatórios da nota fiscal.');
      return;
    }

    addFiscalReceipt({
      receiptNumber: newReceiptForm.receiptNumber,
      supplierName: newReceiptForm.supplierName,
      cnpjOrCpf: newReceiptForm.cnpjOrCpf || '00.000.000/0001-00',
      category: newReceiptForm.category,
      amount: parseFloat(newReceiptForm.amount),
      issueDate: newReceiptForm.issueDate,
      uploadedBy: currentUserName || 'Gerente Geral',
      imageUrl: newReceiptForm.imageUrl || '',
      fileName: newReceiptForm.fileName || `NF_${newReceiptForm.receiptNumber}.png`,
      notes: newReceiptForm.notes,
    });

    setIsAddingReceipt(false);
    setNewReceiptForm({
      receiptNumber: '',
      supplierName: '',
      cnpjOrCpf: '',
      category: 'HORTIFRUTI_FEIRA',
      amount: '',
      issueDate: new Date().toISOString().slice(0, 10),
      notes: '',
      imageUrl: '',
      fileName: '',
    });

    setSuccessToast('Nota Fiscal registrada com sucesso no sistema!');
    setTimeout(() => setSuccessToast(null), 4000);
    loadData();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 overflow-hidden">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/30 shadow-inner">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
                  Central de Arquivamento Fiscal & Retenção de Notas (3 Meses)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Supabase Cloud + Backup Local
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Guarda notas online por até 3 meses. No 4º mês, download no PC local e expurgo da nuvem para otimização de custos.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notificação Toast */}
        {successToast && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/40 text-emerald-300 px-6 py-2.5 text-xs sm:text-sm font-medium flex items-center gap-2 animate-slide-down">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Seletor de Meses (Abas com Status de Retenção) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-4 bg-slate-950/60 border-b border-slate-800 overflow-x-auto">
          {summaries.map((summary) => {
            const isSelected = summary.monthBucket === selectedMonthBucket;
            const is4thExpired = summary.isExpired4thMonth;

            return (
              <button
                key={summary.monthBucket}
                onClick={() => setSelectedMonthBucket(summary.monthBucket)}
                className={`flex flex-col text-left p-3 rounded-xl border transition-all relative ${
                  isSelected
                    ? is4thExpired
                      ? 'bg-amber-950/50 border-amber-500 text-amber-200 shadow-md shadow-amber-500/10'
                      : 'bg-emerald-950/40 border-emerald-500 text-emerald-100 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {summary.monthLabel}
                  </span>
                  {is4thExpired ? (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        summary.status === 'ARQUIVADO_LOCAL'
                          ? 'bg-slate-700 text-slate-300'
                          : 'bg-amber-500 text-slate-950 animate-pulse'
                      }`}
                    >
                      {summary.status === 'ARQUIVADO_LOCAL' ? 'Expurgado da Nuvem' : '4º Mês (Vencido)'}
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                      Retenção Online ({90 - summary.monthIndex * 30}d)
                    </span>
                  )}
                </div>

                <div className="text-sm font-extrabold text-white mt-0.5">
                  {summary.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>{summary.totalReceipts} Notas inseridas</span>
                  <span>~{summary.totalSizeMb} MB</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Banner Informativo do Mês Selecionado */}
        {currentSummary?.isExpired4thMonth && currentSummary?.status !== 'ARQUIVADO_LOCAL' && (
          <div className="bg-amber-950/80 border-b border-amber-500/50 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-100">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-amber-200">
                  ATENÇÃO GERENTE: Este 4º mês atingiu o limite de retenção de 90 dias!
                </p>
                <p className="text-xs text-amber-300/80">
                  Baixe o arquivo ZIP com todas as imagens e notas para o seu computador e confirme o expurgo para liberar espaço online no Supabase.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={handleDownloadZip}
                disabled={isDownloadingZip}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                {isDownloadingZip ? 'Gerando ZIP...' : '1º Baixar ZIP no PC'}
              </button>

              <button
                onClick={handlePurgeCloudImages}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Trash2 className="w-3.5 h-3.5" />
                2º Liberar Nuvem
              </button>
            </div>
          </div>
        )}

        {/* Barra de Ações: Busca, Inserção e Download */}
        <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/40">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar por NF, fornecedor, CNPJ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <button
              onClick={() => setIsAddingReceipt(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>Inserir Nota / Recibo</span>
            </button>

            <button
              onClick={handleDownloadZip}
              disabled={isDownloadingZip || filteredReceipts.length === 0}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950 transition active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloadingZip ? 'Compactando...' : 'Baixar Lote (.ZIP)'}</span>
            </button>
          </div>
        </div>

        {/* Formulário Retrátil para Inserção de Nova Nota */}
        {isAddingReceipt && (
          <div className="p-5 bg-slate-950/90 border-b border-slate-800 animate-slide-down">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Inserir Nova Nota Fiscal / Recibo no Sistema</h3>
              </div>
              <button
                onClick={() => setIsAddingReceipt(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
            </div>

            <form onSubmit={handleCreateReceipt} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Número da NF ou Recibo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 928102"
                  value={newReceiptForm.receiptNumber}
                  onChange={(e) => setNewReceiptForm({ ...newReceiptForm, receiptNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Fornecedor / Razão Social *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ambev S.A. ou Panair"
                  value={newReceiptForm.supplierName}
                  onChange={(e) => setNewReceiptForm({ ...newReceiptForm, supplierName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">CNPJ / CPF</label>
                <input
                  type="text"
                  placeholder="00.000.000/0000-00"
                  value={newReceiptForm.cnpjOrCpf}
                  onChange={(e) => setNewReceiptForm({ ...newReceiptForm, cnpjOrCpf: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Valor Total (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={newReceiptForm.amount}
                  onChange={(e) => setNewReceiptForm({ ...newReceiptForm, amount: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Categoria de Custo</label>
                <select
                  value={newReceiptForm.category}
                  onChange={(e) => setNewReceiptForm({ ...newReceiptForm, category: e.target.value as ReceiptCategory })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:border-amber-500 focus:outline-none"
                >
                  {Object.entries(RECEIPT_CATEGORY_LABELS).map(([cat, label]) => (
                    <option key={cat} value={cat}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Data de Emissão</label>
                <input
                  type="date"
                  value={newReceiptForm.issueDate}
                  onChange={(e) => setNewReceiptForm({ ...newReceiptForm, issueDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Observações / Itens</label>
                <input
                  type="text"
                  placeholder="Ex: Compra de frutas para drinks, 10 caixas de morango..."
                  value={newReceiptForm.notes}
                  onChange={(e) => setNewReceiptForm({ ...newReceiptForm, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Seção de Captura de Foto / Comprovante */}
              <div className="sm:col-span-2 md:col-span-4 bg-slate-900 border border-slate-700/80 rounded-xl p-3">
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handlePhotoCapture}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoCapture}
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300">
                      Foto do Comprovante / Cupom / Nota Fiscal
                    </label>
                    <p className="text-[10px] text-slate-400">
                      Tire uma foto direta da câmera do celular ou anexe da galeria
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer transition active:scale-95"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Câmera Mobile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center gap-1.5 border border-slate-600 cursor-pointer transition"
                    >
                      <Upload className="w-3.5 h-3.5 text-slate-400" />
                      <span>Galeria</span>
                    </button>
                  </div>
                </div>

                {newReceiptForm.imageUrl && (
                  <div className="mt-2.5 pt-2.5 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={newReceiptForm.imageUrl}
                        alt="Preview NF"
                        className="w-12 h-12 object-cover rounded-lg border border-amber-500/40 shadow-sm"
                      />
                      <div>
                        <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Foto Anexada com Sucesso
                        </p>
                        <p className="text-[10px] text-slate-400">{newReceiptForm.fileName}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewReceiptForm((prev) => ({ ...prev, imageUrl: '', fileName: '' }))}
                      className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 px-2 py-1 rounded hover:bg-rose-950/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remover Foto
                    </button>
                  </div>
                )}
              </div>

              <div className="sm:col-span-2 md:col-span-4 flex items-center justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
                >
                  Salvar e Armazenar Imagem
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Grade de Notas Fiscais do Mês */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Documentos de {currentSummary?.monthLabel} ({filteredReceipts.length} registros)
            </h4>
            <span className="text-xs text-slate-400">
              Total Faturado:{' '}
              <strong className="text-emerald-400 font-bold">
                {currentSummary?.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </strong>
            </span>
          </div>

          {filteredReceipts.length === 0 ? (
            <div className="p-12 text-center text-slate-400 bg-slate-950/40 rounded-2xl border border-slate-800">
              <FileText className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-medium">Nenhuma nota fiscal encontrada neste período.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredReceipts.map((receipt) => {
                const isPurged = receipt.status === 'ARQUIVADO_LOCAL_EXPURGADO';

                return (
                  <div
                    key={receipt.id}
                    className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 hover:border-slate-600 transition flex flex-col justify-between group shadow-sm hover:shadow-md"
                  >
                    <div>
                      {/* Topo do Card */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          NF #{receipt.receiptNumber}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            isPurged
                              ? 'bg-slate-700 text-slate-300'
                              : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {isPurged ? 'Arquivado Local' : 'Online (Nuvem)'}
                        </span>
                      </div>

                      {/* Fornecedor e Valor */}
                      <h5 className="text-sm font-bold text-white line-clamp-1 group-hover:text-amber-300 transition">
                        {receipt.supplierName}
                      </h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">CNPJ: {receipt.cnpjOrCpf}</p>

                      <div className="mt-2 text-base font-extrabold text-emerald-400">
                        {receipt.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>

                      <div className="text-[11px] text-slate-300 mt-1">
                        <span className="text-slate-400">Categoria:</span>{' '}
                        {RECEIPT_CATEGORY_LABELS[receipt.category] || receipt.category}
                      </div>

                      {receipt.notes && (
                        <p className="text-[11px] text-slate-400 italic mt-1.5 line-clamp-2 bg-slate-900/50 p-1.5 rounded">
                          "{receipt.notes}"
                        </p>
                      )}
                    </div>

                    {/* Rodapé do Card com Miniatura de Imagem & Ações */}
                    <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                      <div>
                        <span>Emissão: {receipt.issueDate}</span>
                        <div className="text-[10px] text-slate-400">Por: {receipt.uploadedBy}</div>
                      </div>

                      <button
                        onClick={() => setSelectedReceiptForPreview(receipt)}
                        className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver Nota</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Rodapé Geral Informativo */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Auditoria Fiscal & Conformidade: Todas as notas são registradas no log oficial do sistema.</span>
          </div>
          <span className="text-[11px] text-slate-400">Tk Gestão • Unidade Engenho Manauara</span>
        </div>
      </div>

      {/* Modal de Pré-visualização da Nota Fiscal */}
      {selectedReceiptForPreview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl text-slate-100 flex flex-col items-center">
            <button
              onClick={() => setSelectedReceiptForPreview(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="text-base font-bold text-white mb-1">Comprovante Fiscal Oficial</h4>
            <p className="text-xs text-slate-400 mb-4">
              NF #{selectedReceiptForPreview.receiptNumber} • {selectedReceiptForPreview.supplierName}
            </p>

            <div className="w-full max-h-[60vh] overflow-hidden rounded-xl border border-slate-700 shadow-inner bg-slate-950 flex items-center justify-center p-2">
              <img
                src={selectedReceiptForPreview.imageUrl}
                alt={`Nota ${selectedReceiptForPreview.receiptNumber}`}
                className="max-h-[55vh] w-auto object-contain rounded"
              />
            </div>

            <div className="w-full mt-4 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Valor:{' '}
                <strong className="text-emerald-400 text-sm">
                  {selectedReceiptForPreview.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </strong>
              </span>

              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = selectedReceiptForPreview.imageUrl;
                  link.download = `NF_${selectedReceiptForPreview.receiptNumber}.svg`;
                  link.click();
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Baixar Imagem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
