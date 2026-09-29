import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Music,
  UserCheck,
  Star,
  AlertTriangle,
  Award,
  Calendar,
  Clock,
  Phone,
  DollarSign,
  Search,
  Filter,
  Plus,
  FileText,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  X
} from 'lucide-react';
import {
  CompleteStaffMember,
  StaffContractType,
  getCompleteStaffMembers,
  addStaffMember,
  addStaffFeedback,
  addStaffHourBankEntry,
  addStaffVacation,
  StaffFeedbackRecord,
  StaffHourBankEntry,
  StaffVacationRecord
} from '../../services/rhStaffService';
import { getSession } from '../../services/restaurantStore';

export const CompleteRhDossierView: React.FC = () => {
  const session = getSession();
  const currentUserName = session?.user?.name || 'Ivan (Gerente)';

  const [staffList, setStaffList] = useState<CompleteStaffMember[]>(() => getCompleteStaffMembers());
  const [selectedStaff, setSelectedStaff] = useState<CompleteStaffMember | null>(() => {
    const list = getCompleteStaffMembers();
    return list.length > 0 ? list[0] : null;
  });

  const [contractFilter, setContractFilter] = useState<StaffContractType | 'TODOS'>('TODOS');
  const [searchTerm, setSearchTerm] = useState('');

  // Modais
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showHourBankModal, setShowHourBankModal] = useState(false);
  const [showVacationModal, setShowVacationModal] = useState(false);

  // Form State: Novo Colaborador / Músico / Freelancer
  const [newMember, setNewMember] = useState<{
    name: string;
    contractType: StaffContractType;
    role: string;
    department: CompleteStaffMember['department'];
    shiftArrivalTime: CompleteStaffMember['shiftArrivalTime'];
    phone: string;
    cpf: string;
    pixKey: string;
    admissionDate: string;
    baseSalaryOrFee: number;
    feeType: CompleteStaffMember['feeType'];
    musicalGenre: string;
    instrument: string;
    freelanceSpecialty: string;
    usualSchedule: string;
  }>({
    name: '',
    contractType: 'CLT_EFETIVO',
    role: '',
    department: 'SALAO',
    shiftArrivalTime: '10:00',
    phone: '',
    cpf: '',
    pixKey: '',
    admissionDate: new Date().toISOString().slice(0, 10),
    baseSalaryOrFee: 1800,
    feeType: 'MENSAL',
    musicalGenre: '',
    instrument: '',
    freelanceSpecialty: '',
    usualSchedule: '',
  });

  // Form State: Feedback / Ocorrência
  const [feedbackForm, setFeedbackForm] = useState<{
    type: StaffFeedbackRecord['type'];
    title: string;
    description: string;
  }>({
    type: 'ELOGIO',
    title: '',
    description: '',
  });

  // Form State: Banco de Horas
  const [hourBankForm, setHourBankForm] = useState<{
    type: StaffHourBankEntry['type'];
    hours: number;
    reason: string;
  }>({
    type: 'CREDITO_HORA_EXTRA',
    hours: 2,
    reason: '',
  });

  // Form State: Férias
  const [vacationForm, setVacationForm] = useState<{
    startDate: string;
    endDate: string;
    daysCount: number;
    accrualPeriod: string;
    notes: string;
  }>({
    startDate: '',
    endDate: '',
    daysCount: 30,
    accrualPeriod: '2025/2026',
    notes: '',
  });

  const refreshList = () => {
    const updated = getCompleteStaffMembers();
    setStaffList(updated);
    if (selectedStaff) {
      const refreshedSelected = updated.find((s) => s.id === selectedStaff.id);
      if (refreshedSelected) setSelectedStaff(refreshedSelected);
    }
  };

  // Filtragem
  const filteredList = staffList.filter((m) => {
    if (contractFilter !== 'TODOS' && m.contractType !== contractFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.department.toLowerCase().includes(q) ||
        (m.musicalInfo?.artisticName || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Cadastrar Novo Membro
  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name.trim()) return;

    const created = addStaffMember({
      name: newMember.name.trim(),
      contractType: newMember.contractType,
      role: newMember.role.trim() || 'Colaborador',
      department: newMember.department,
      shiftArrivalTime: newMember.shiftArrivalTime,
      phone: newMember.phone.trim(),
      cpf: newMember.cpf.trim(),
      pixKey: newMember.pixKey.trim(),
      admissionDate: newMember.admissionDate || new Date().toISOString().slice(0, 10),
      status: newMember.contractType === 'FREELANCER_EXTRA' ? 'DISPONIVEL_CHAMADA' : 'ATIVO',
      baseSalaryOrFee: Number(newMember.baseSalaryOrFee) || 0,
      feeType: newMember.feeType,
      musicalInfo:
        newMember.contractType === 'MUSICO_CASA'
          ? {
              artisticName: newMember.name,
              musicalGenre: newMember.musicalGenre || 'Variados',
              instrument: newMember.instrument || 'Voz e Instrumento',
              usualSchedule: newMember.usualSchedule || 'Finais de Semana',
              hasSoundEquipment: true,
            }
          : undefined,
      freelanceInfo:
        newMember.contractType === 'FREELANCER_EXTRA'
          ? {
              specialty: newMember.freelanceSpecialty || 'Apoio Geral',
              rating: 5,
              availabilityDays: ['SEXTA', 'SABADO', 'DOMINGO'],
            }
          : undefined,
    });

    setShowAddMemberModal(false);
    refreshList();
    setSelectedStaff(created);
  };

  // Inserir Feedback / Advertência
  const handleAddFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff || !feedbackForm.title.trim()) return;

    addStaffFeedback(selectedStaff.id, {
      type: feedbackForm.type,
      author: currentUserName,
      title: feedbackForm.title.trim(),
      description: feedbackForm.description.trim(),
      acknowledgedByEmployee: true,
    });

    setShowFeedbackModal(false);
    setFeedbackForm({ type: 'ELOGIO', title: '', description: '' });
    refreshList();
  };

  // Inserir Banco de Horas
  const handleAddHourBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff || !hourBankForm.reason.trim()) return;

    addStaffHourBankEntry(selectedStaff.id, {
      type: hourBankForm.type,
      hours: Number(hourBankForm.hours) || 0,
      reason: hourBankForm.reason.trim(),
      registeredBy: currentUserName,
    });

    setShowHourBankModal(false);
    setHourBankForm({ type: 'CREDITO_HORA_EXTRA', hours: 2, reason: '' });
    refreshList();
  };

  // Inserir Férias
  const handleAddVacation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff || !vacationForm.startDate) return;

    addStaffVacation(selectedStaff.id, {
      startDate: vacationForm.startDate,
      endDate: vacationForm.endDate,
      daysCount: Number(vacationForm.daysCount) || 30,
      status: 'PROGRAMADA',
      accrualPeriod: vacationForm.accrualPeriod || '2025/2026',
      notes: vacationForm.notes,
    });

    setShowVacationModal(false);
    setVacationForm({ startDate: '', endDate: '', daysCount: 30, accrualPeriod: '2025/2026', notes: '' });
    refreshList();
  };

  return (
    <div className="space-y-4">
      {/* Topo do Dossiê RH */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-600 text-white font-bold">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-base font-bold text-slate-900">RH & Dossiê Completo de Pessoal</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestão integral de colaboradores CLT, Músicos da casa e Freelancers de apoio com banco de horas, férias e histórico disciplinar.
          </p>
        </div>

        <button
          onClick={() => setShowAddMemberModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Cadastrar Novo (CLT / Músico / Freelancer)</span>
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por nome, cargo ou instrumento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 overflow-x-auto text-xs">
          <button
            onClick={() => setContractFilter('TODOS')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
              contractFilter === 'TODOS' ? 'bg-[#0a2e23] text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Todos ({staffList.length})
          </button>
          <button
            onClick={() => setContractFilter('CLT_EFETIVO')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
              contractFilter === 'CLT_EFETIVO' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            CLT Efetivos ({staffList.filter((s) => s.contractType === 'CLT_EFETIVO').length})
          </button>
          <button
            onClick={() => setContractFilter('MUSICO_CASA')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
              contractFilter === 'MUSICO_CASA' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Músicos ({staffList.filter((s) => s.contractType === 'MUSICO_CASA').length})
          </button>
          <button
            onClick={() => setContractFilter('FREELANCER_EXTRA')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
              contractFilter === 'FREELANCER_EXTRA' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Freelancers ({staffList.filter((s) => s.contractType === 'FREELANCER_EXTRA').length})
          </button>
        </div>
      </div>

      {/* Grid Principal: Lista Lateral de Membros + Dossiê Detalhado */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Coluna Esquerda: Lista de Pessoas (4 colunas) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-3 space-y-2 max-h-[750px] overflow-y-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-1">
            {filteredList.length} Registros Encontrados
          </span>

          <div className="space-y-1.5">
            {filteredList.map((person) => {
              const isSelected = selectedStaff?.id === person.id;
              const isMusician = person.contractType === 'MUSICO_CASA';
              const isFree = person.contractType === 'FREELANCER_EXTRA';

              return (
                <div
                  key={person.id}
                  onClick={() => setSelectedStaff(person)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-indigo-500'
                      : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className={`text-xs font-black block truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {person.name}
                      </span>
                      <span className={`text-[11px] block truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {person.role} &bull; {person.department}
                      </span>
                    </div>

                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border shrink-0 ${
                        isMusician
                          ? 'bg-purple-100 text-purple-800 border-purple-200'
                          : isFree
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-indigo-100 text-indigo-800 border-indigo-200'
                      }`}
                    >
                      {isMusician ? 'Músico' : isFree ? 'Freelance' : 'CLT'}
                    </span>
                  </div>

                  {/* Informações Complementares Rápidas */}
                  <div className={`mt-2 pt-2 border-t flex items-center justify-between text-[10px] ${isSelected ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-slate-500'}`}>
                    <span>Turno: {person.shiftArrivalTime}</span>
                    {person.contractType === 'CLT_EFETIVO' && (
                      <span className="font-bold">
                        BH: {person.hourBankBalance >= 0 ? `+${person.hourBankBalance}h` : `${person.hourBankBalance}h`}
                      </span>
                    )}
                    {isMusician && (
                      <span className="font-bold text-amber-300">
                        Cachê: R$ {person.baseSalaryOrFee.toFixed(2)}
                      </span>
                    )}
                    {isFree && (
                      <span className="font-bold text-emerald-400">
                        Diária: R$ {person.baseSalaryOrFee.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coluna Direita: Dossiê Completo da Pessoa Selecionada (8 colunas) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedStaff ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-5">
              {/* Header do Dossiê */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white font-black flex items-center justify-center text-lg shadow-sm">
                    {selectedStaff.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-slate-900">{selectedStaff.name}</h3>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                          selectedStaff.contractType === 'MUSICO_CASA'
                            ? 'bg-purple-100 text-purple-800 border-purple-300'
                            : selectedStaff.contractType === 'FREELANCER_EXTRA'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-indigo-100 text-indigo-800 border-indigo-300'
                        }`}
                      >
                        {selectedStaff.contractType === 'MUSICO_CASA'
                          ? 'Músico da Casa'
                          : selectedStaff.contractType === 'FREELANCER_EXTRA'
                          ? 'Freelancer Extra'
                          : 'CLT Efetivo'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {selectedStaff.role} &bull; Setor {selectedStaff.department} &bull; Admissão:{' '}
                      {new Date(selectedStaff.admissionDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                {/* Botões de Ação do Dossiê */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setShowFeedbackModal(true)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>+ Elogio / Punição</span>
                  </button>

                  {selectedStaff.contractType === 'CLT_EFETIVO' && (
                    <>
                      <button
                        onClick={() => setShowHourBankModal(true)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        <span>+ Banco de Horas</span>
                      </button>

                      <button
                        onClick={() => setShowVacationModal(true)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>+ Férias</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Informações Cadastrais & Contratuais */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Telefone / Contato</span>
                  <span className="font-bold text-slate-800">{selectedStaff.phone || 'Não informado'}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">CPF / Chave Pix</span>
                  <span className="font-bold text-slate-800 truncate block">
                    {selectedStaff.cpf || selectedStaff.pixKey || 'Não cadastrado'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Remuneração Base</span>
                  <span className="font-bold text-slate-800">
                    R$ {selectedStaff.baseSalaryOrFee.toFixed(2)}{' '}
                    <span className="text-[10px] font-normal text-slate-500">
                      ({selectedStaff.feeType === 'POR_APRESENTACAO' ? 'p/ show' : selectedStaff.feeType === 'POR_DIARIA_TURNO' ? 'p/ diária' : 'mensal'})
                    </span>
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Turno Oficial</span>
                  <span className="font-bold text-indigo-700">Chegada {selectedStaff.shiftArrivalTime}</span>
                </div>
              </div>

              {/* Específico: Músicos da Casa */}
              {selectedStaff.musicalInfo && (
                <div className="p-3.5 bg-purple-50/70 rounded-xl border border-purple-200 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-purple-900 font-bold">
                    <Music className="w-4 h-4 text-purple-700" />
                    <span>Ficha Artística & Apresentações</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-purple-950">
                    <div>
                      <span className="text-[10px] text-purple-600 block font-semibold">Gênero Musical:</span>
                      <strong>{selectedStaff.musicalInfo.musicalGenre}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-purple-600 block font-semibold">Instrumentação:</span>
                      <strong>{selectedStaff.musicalInfo.instrument}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-purple-600 block font-semibold">Horário Habitual:</span>
                      <strong>{selectedStaff.musicalInfo.usualSchedule}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Específico: Freelancers para Contratação Esporádica */}
              {selectedStaff.freelanceInfo && (
                <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-900 font-bold">
                      <UserCheck className="w-4 h-4 text-amber-700" />
                      <span>Ficha de Freelancer para Chamada Esporádica</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-950 text-[10px] font-bold">
                      Avaliação: ★★★★★ ({selectedStaff.freelanceInfo.rating || 5}.0)
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-amber-950">
                    <div>
                      <span className="text-[10px] text-amber-700 block font-semibold">Especialidade / Posto:</span>
                      <strong>{selectedStaff.freelanceInfo.specialty}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-700 block font-semibold">Disponibilidade:</span>
                      <strong>Finais de semana & Eventos fechados</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Histórico do Banco de Horas (Se CLT) */}
              {selectedStaff.contractType === 'CLT_EFETIVO' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      <h4 className="text-xs font-bold text-slate-900">Banco de Horas & Horas Extras</h4>
                    </div>
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${
                        selectedStaff.hourBankBalance >= 0
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}
                    >
                      Saldo Atual: {selectedStaff.hourBankBalance >= 0 ? `+${selectedStaff.hourBankBalance}h` : `${selectedStaff.hourBankBalance}h`}
                    </span>
                  </div>

                  {selectedStaff.hourBankHistory.length === 0 ? (
                    <p className="text-xs text-slate-400 py-2">Nenhum lançamento no banco de horas até o momento.</p>
                  ) : (
                    <div className="divide-y divide-slate-100 text-xs">
                      {selectedStaff.hourBankHistory.map((hb) => (
                        <div key={hb.id} className="py-2 flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-slate-800 block">{hb.reason}</span>
                            <span className="text-[10px] text-slate-400">
                              Data: {new Date(hb.date).toLocaleDateString('pt-BR')} &bull; Registrado por: {hb.registeredBy}
                            </span>
                          </div>
                          <span
                            className={`font-black ${
                              hb.type === 'CREDITO_HORA_EXTRA' ? 'text-emerald-700' : 'text-rose-700'
                            }`}
                          >
                            {hb.type === 'CREDITO_HORA_EXTRA' ? `+${hb.hours}h` : `-${hb.hours}h`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Histórico de Férias (Se CLT) */}
              {selectedStaff.contractType === 'CLT_EFETIVO' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <h4 className="text-xs font-bold text-slate-900">Controle de Férias</h4>
                    </div>
                  </div>

                  {selectedStaff.vacations.length === 0 ? (
                    <p className="text-xs text-slate-400 py-2">Nenhum período de férias programado.</p>
                  ) : (
                    <div className="divide-y divide-slate-100 text-xs">
                      {selectedStaff.vacations.map((v) => (
                        <div key={v.id} className="py-2 flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-slate-800 block">
                              Período: {new Date(v.startDate).toLocaleDateString('pt-BR')} até{' '}
                              {new Date(v.endDate).toLocaleDateString('pt-BR')} ({v.daysCount} dias)
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Aquisitivo: {v.accrualPeriod} {v.notes ? `&bull; Obs: ${v.notes}` : ''}
                            </span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              v.status === 'CONCLUIDA'
                                ? 'bg-slate-100 text-slate-700'
                                : v.status === 'EM_GOZO'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {v.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Dossiê Disciplinar & Elogios */}
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-700" />
                    <h4 className="text-xs font-bold text-slate-900">
                      Ocorrências, Elogios & Histórico Disciplinar ({selectedStaff.feedbacksAndPunishements.length})
                    </h4>
                  </div>
                </div>

                {selectedStaff.feedbacksAndPunishements.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">Ficha limpa sem advertências ou ocorrências registradas.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedStaff.feedbacksAndPunishements.map((fb) => {
                      const isElogio = fb.type === 'ELOGIO';
                      return (
                        <div
                          key={fb.id}
                          className={`p-3 rounded-xl border text-xs space-y-1 ${
                            isElogio
                              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                              : 'bg-rose-50/60 border-rose-200 text-rose-950'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 font-bold">
                              {isElogio ? (
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                              ) : (
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                              )}
                              <span>{fb.title}</span>
                            </div>
                            <span className="text-[10px] text-slate-500">
                              {new Date(fb.date).toLocaleDateString('pt-BR')} &bull; {fb.author}
                            </span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-slate-700">{fb.description}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-slate-400 text-xs">
              Selecione um colaborador, músico ou freelancer para visualizar seu dossiê completo.
            </div>
          )}
        </div>
      </div>

      {/* Modal 1: Cadastrar Novo Colaborador / Músico / Freelancer */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateMember}
            className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 space-y-3.5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Novo Cadastro de Pessoal no RH</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddMemberModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Tipo de Vínculo */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Tipo de Vínculo *</label>
              <select
                value={newMember.contractType}
                onChange={(e) => {
                  const val = e.target.value as StaffContractType;
                  setNewMember({
                    ...newMember,
                    contractType: val,
                    feeType: val === 'MUSICO_CASA' ? 'POR_APRESENTACAO' : val === 'FREELANCER_EXTRA' ? 'POR_DIARIA_TURNO' : 'MENSAL',
                    shiftArrivalTime: val === 'MUSICO_CASA' || val === 'FREELANCER_EXTRA' ? 'ESPORADICO' : '10:00',
                  });
                }}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white font-bold"
              >
                <option value="CLT_EFETIVO">1. Funcionário Efetivo (CLT)</option>
                <option value="MUSICO_CASA">2. Músico da Casa (Show / Apresentação)</option>
                <option value="FREELANCER_EXTRA">3. Freelancer para Contratação Esporádica</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Nome Completo / Nome Artístico *</label>
              <input
                type="text"
                required
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                placeholder="Ex: João da Silva / Banda Samba Show"
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Cargo / Função *</label>
                <input
                  type="text"
                  required
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  placeholder="Ex: Garçom / Cantor Voz e Violão / Cumin"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Setor</label>
                <select
                  value={newMember.department}
                  onChange={(e) => setNewMember({ ...newMember, department: e.target.value as any })}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
                >
                  <option value="SALAO">Salão</option>
                  <option value="COZINHA">Cozinha</option>
                  <option value="BAR">Bar</option>
                  <option value="GERENCIA">Gerência</option>
                  <option value="HIGIENIZACAO">Higienização</option>
                  <option value="ARTISTICO_MUSICAL">Artístico / Musical</option>
                  <option value="APOIO_EVENTOS">Apoio / Eventos</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Telefone / WhatsApp</label>
                <input
                  type="text"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  placeholder="(92) 9XXXX-XXXX"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Chave Pix / CPF</label>
                <input
                  type="text"
                  value={newMember.pixKey}
                  onChange={(e) => setNewMember({ ...newMember, pixKey: e.target.value })}
                  placeholder="Chave Pix para pagamentos"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">
                  {newMember.contractType === 'MUSICO_CASA' ? 'Valor do Cachê (R$)' : newMember.contractType === 'FREELANCER_EXTRA' ? 'Valor da Diária (R$)' : 'Salário Base (R$)'}
                </label>
                <input
                  type="number"
                  value={newMember.baseSalaryOrFee}
                  onChange={(e) => setNewMember({ ...newMember, baseSalaryOrFee: parseFloat(e.target.value) || 0 })}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Turno de Chegada</label>
                <select
                  value={newMember.shiftArrivalTime}
                  onChange={(e) => setNewMember({ ...newMember, shiftArrivalTime: e.target.value as any })}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
                >
                  <option value="08:00">08:00 - Equipe de Abertura</option>
                  <option value="10:00">10:00 - Equipe de Atendentes</option>
                  <option value="12:00">12:00 - Equipe de Gestão e Líderes</option>
                  <option value="14:00">14:00 - Equipe de Fechamento</option>
                  <option value="ESPORADICO">Esporádico / Evento</option>
                </select>
              </div>
            </div>

            {/* Campos adicionais se Músico */}
            {newMember.contractType === 'MUSICO_CASA' && (
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 space-y-2">
                <span className="text-[11px] font-bold text-purple-900 block">Informações Musicais</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Gênero (Ex: MPB / Sertanejo)"
                    value={newMember.musicalGenre}
                    onChange={(e) => setNewMember({ ...newMember, musicalGenre: e.target.value })}
                    className="text-xs p-2 border border-purple-200 rounded bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Instrumentos (Ex: Voz e Violão)"
                    value={newMember.instrument}
                    onChange={(e) => setNewMember({ ...newMember, instrument: e.target.value })}
                    className="text-xs p-2 border border-purple-200 rounded bg-white"
                  />
                </div>
              </div>
            )}

            {/* Campos adicionais se Freelancer */}
            {newMember.contractType === 'FREELANCER_EXTRA' && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                <span className="text-[11px] font-bold text-amber-900 block">Informações de Freelancer</span>
                <input
                  type="text"
                  placeholder="Especialidade (Ex: Cumin / Garçom Salão / Pia)"
                  value={newMember.freelanceSpecialty}
                  onChange={(e) => setNewMember({ ...newMember, freelanceSpecialty: e.target.value })}
                  className="w-full text-xs p-2 border border-amber-200 rounded bg-white"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddMemberModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cadastrar no RH
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 2: Adicionar Elogio / Punição / Advertência */}
      {showFeedbackModal && selectedStaff && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddFeedback}
            className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-3.5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">Novo Registro Disciplinar ou Elogio</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFeedbackModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Colaborador: <strong>{selectedStaff.name}</strong> ({selectedStaff.role})
            </p>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Tipo de Registro *</label>
              <select
                value={feedbackForm.type}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, type: e.target.value as any })}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white font-bold"
              >
                <option value="ELOGIO">★ Elogio de Cliente ou Gerência</option>
                <option value="FEEDBACK_GERENCIAL">Feedback de Alinhamento / Instrução</option>
                <option value="ADVERTENCIA_VERBAL">⚠ Advertência Verbal</option>
                <option value="ADVERTENCIA_ESCRITA">⚠ Advertência Escrita</option>
                <option value="SUSPENSAO">⛔ Suspensão Disciplinar</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Título / Motivo *</label>
              <input
                type="text"
                required
                value={feedbackForm.title}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, title: e.target.value })}
                placeholder="Ex: Elogio de atendimento mesa 5 / Atraso não justificado"
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Descrição Detalhada do Fato *</label>
              <textarea
                required
                rows={3}
                value={feedbackForm.description}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, description: e.target.value })}
                placeholder="Descreva o que ocorreu de forma factual..."
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowFeedbackModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Salvar no Dossiê
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 3: Adicionar Banco de Horas */}
      {showHourBankModal && selectedStaff && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddHourBank}
            className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-3.5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Lançamento no Banco de Horas</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHourBankModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Colaborador: <strong>{selectedStaff.name}</strong> &bull; Saldo Atual: <strong>{selectedStaff.hourBankBalance}h</strong>
            </p>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Tipo de Lançamento *</label>
              <select
                value={hourBankForm.type}
                onChange={(e) => setHourBankForm({ ...hourBankForm, type: e.target.value as any })}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white font-bold"
              >
                <option value="CREDITO_HORA_EXTRA">(+) Crédito de Hora Extra (Ficou a mais)</option>
                <option value="DEBITO_FOLGA_COMPENSATORIA">(-) Débito por Folga Compensatória (Saiu mais cedo)</option>
                <option value="PAGAMENTO_HORA_EXTRA">(-) Pagamento em Folha (Quitação financeira)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Quantidade de Horas (ex: 1.5, 2.0) *</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                required
                value={hourBankForm.hours}
                onChange={(e) => setHourBankForm({ ...hourBankForm, hours: parseFloat(e.target.value) || 0 })}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Motivo / Justificativa *</label>
              <input
                type="text"
                required
                value={hourBankForm.reason}
                onChange={(e) => setHourBankForm({ ...hourBankForm, reason: e.target.value })}
                placeholder="Ex: Fechamento tardio de salão / Limpeza de câmara"
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowHourBankModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Lançar Horas
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 4: Programar Férias */}
      {showVacationModal && selectedStaff && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddVacation}
            className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-3.5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Programação de Férias</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVacationModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Colaborador: <strong>{selectedStaff.name}</strong>
            </p>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Data de Início *</label>
                <input
                  type="date"
                  required
                  value={vacationForm.startDate}
                  onChange={(e) => setVacationForm({ ...vacationForm, startDate: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Data de Término *</label>
                <input
                  type="date"
                  required
                  value={vacationForm.endDate}
                  onChange={(e) => setVacationForm({ ...vacationForm, endDate: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Dias de Gozo</label>
                <input
                  type="number"
                  value={vacationForm.daysCount}
                  onChange={(e) => setVacationForm({ ...vacationForm, daysCount: parseInt(e.target.value) || 30 })}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Período Aquisitivo</label>
                <input
                  type="text"
                  value={vacationForm.accrualPeriod}
                  onChange={(e) => setVacationForm({ ...vacationForm, accrualPeriod: e.target.value })}
                  placeholder="Ex: 2025/2026"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Observações</label>
              <input
                type="text"
                value={vacationForm.notes}
                onChange={(e) => setVacationForm({ ...vacationForm, notes: e.target.value })}
                placeholder="Ex: Acordo de 20 dias com abono pecuniário de 10 dias"
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowVacationModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Programar Férias
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
