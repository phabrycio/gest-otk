// ============================================================
// SERVIÇO DE AUDITORIA E INTELIGÊNCIA DE CHOPP & BAR
// Tk Gestão e Tecnologia
// ============================================================

import { ChoppTap, SpiritBottle, BarAuditSummary, FoamStatus } from '../types/barIntelligence.types';

export interface TapDiagnosis {
  severity: 'OK' | 'WARNING' | 'DANGER';
  title: string;
  cause: string;
  recommendation: string;
}

export function evaluateFoamAndPressure(pressurePsi: number, tempC: number): FoamStatus {
  if (tempC > 3.0) {
    return 'CHOPP_MORNO';
  }
  if (pressurePsi < 28) {
    return 'PRESSAO_BAIXA';
  }
  if (pressurePsi > 38) {
    return 'ALERTA_ESPUMA';
  }
  return 'PERFEITA';
}

/**
 * Recalcula desvios e perdas de uma torneira de chopp
 * Custo médio estimado: R$ 16,00/L para Pilsen, R$ 25,00/L para Artesanal/IPA
 */
export function auditChoppTap(tap: ChoppTap): ChoppTap {
  const technicalLossLiters = Number(((tap.litersSoldTeknisa * tap.technicalLossPct) / 100).toFixed(2));
  
  // Litros que deveriam ter saído
  const expectedDispense = tap.litersSoldTeknisa + technicalLossLiters;
  
  // Desvio não justificado (o que saiu além da venda + quebra técnica permitida)
  const unaccountedDeviationLiters = Number(Math.max(0, tap.litersDispensedReal - expectedDispense).toFixed(2));
  
  // Custo estimado do litro
  const costPerLiter = tap.style === 'IPA' || tap.style === 'REGIONAL' ? 25.00 : 16.00;
  const retailPerLiter = tap.style === 'IPA' || tap.style === 'REGIONAL' ? 50.00 : 40.00;
  
  const deviationCostReais = Number((unaccountedDeviationLiters * costPerLiter).toFixed(2));
  const deviationRetailReais = Number((unaccountedDeviationLiters * retailPerLiter).toFixed(2));
  
  let deviationStatus: ChoppTap['deviationStatus'] = 'NORMAL';
  if (unaccountedDeviationLiters > 1.8) {
    deviationStatus = 'CRITICO';
  } else if (unaccountedDeviationLiters > 0.8) {
    deviationStatus = 'ATENCAO';
  }
  
  const foamStatus = evaluateFoamAndPressure(tap.pressurePsi, tap.temperatureCelsius);

  return {
    ...tap,
    technicalLossLiters,
    unaccountedDeviationLiters,
    deviationCostReais,
    deviationRetailReais,
    deviationStatus,
    foamStatus,
  };
}

/**
 * Gera diagnóstico de engenharia da chopeira e possíveis causas de desvio
 */
export function diagnoseChoppTap(tap: ChoppTap): TapDiagnosis[] {
  const diagnoses: TapDiagnosis[] = [];

  // Diagnóstico de Temperatura
  if (tap.temperatureCelsius > 2.5) {
    diagnoses.push({
      severity: 'DANGER',
      title: 'Temperatura Elevada na Serpentina',
      cause: `Chopp a ${tap.temperatureCelsius.toFixed(1)}°C liberta CO2 rapidamente dentro do copo, gerando até 35% de espuma excessiva descartada na bandeja.`,
      recommendation: 'Verificar banco de gelo/glicol da chopeira. Temperatura ideal no bico deve estar entre -0.5°C e 1.5°C.',
    });
  }

  // Diagnóstico de Pressão de CO2
  if (tap.pressurePsi < 30) {
    diagnoses.push({
      severity: 'WARNING',
      title: 'Pressão de CO2 Insuficiente',
      cause: `Pressão regulada em ${tap.pressurePsi} PSI (ideal: 32 a 36 PSI). Provoca descarbonatação no percurso da linha e turbulência na torneira.`,
      recommendation: 'Ajustar o manômetro do cilindro de CO2 para 34 PSI e verificar se não há microvazamento na mangueira.',
    });
  } else if (tap.pressurePsi > 38) {
    diagnoses.push({
      severity: 'WARNING',
      title: 'Sobrecarga de Pressão no Barril',
      cause: `Pressão alta (${tap.pressurePsi} PSI) supercarbonata o chopp, fazendo-o "cuspir" ao abrir a válvula compensadora.`,
      recommendation: 'Aliviar pressão no regulador para 34 PSI e regular a vazão da torneira italiana.',
    });
  }

  // Diagnóstico de Desvio / Faturamento
  if (tap.unaccountedDeviationLiters > 1.5) {
    const estimatedLostGlasses = Math.round(tap.unaccountedDeviationLiters / (tap.kegCapacityLiters === 50 ? 0.35 : 0.5));
    diagnoses.push({
      severity: 'DANGER',
      title: 'Desvio Oculto Elevado (Chopp Não Faturado)',
      cause: `Diferença de ${tap.unaccountedDeviationLiters.toFixed(2)}L entre o barril e o Teknisa (~${estimatedLostGlasses} copos não registrados ou descartados sem nota).`,
      recommendation: 'Conferir se a brigada do salão está servindo rodadas cortesia sem comanda ou se a torneira está pingando após o fechamento.',
    });
  }

  // Diagnóstico de Validade do Barril Aberto
  const expiry = new Date(tap.kegExpiryDate);
  const now = new Date('2026-09-22');
  const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 3600 * 24));
  if (diffDays <= 3) {
    diagnoses.push({
      severity: diffDays <= 1 ? 'DANGER' : 'WARNING',
      title: 'Validade do Barril Aberto Crítica',
      cause: `Barril aberto vence em ${diffDays} dia(s) (${tap.kegExpiryDate}). Risco de perda de frescor, oxidação e sabor metálico.`,
      recommendation: `Estimular venda ativa deste chopp (${tap.beerName}) pelos garçons com comissão ou combo no happy hour.`,
    });
  }

  if (diagnoses.length === 0) {
    diagnoses.push({
      severity: 'OK',
      title: 'Operação da Torneira em Conformidade',
      cause: 'Pressão, temperatura, fluxo e faturamento no Teknisa dentro da margem técnica tolerada de 5.5%.',
      recommendation: 'Manter rotina de assepsia e sanitização química quinzenal das linhas.',
    });
  }

  return diagnoses;
}

/**
 * Audita garrafas de destilados / bebidas dosadas com suporte a leitura de nível OCR
 */
export function auditSpiritBottle(bottle: SpiritBottle): SpiritBottle {
  // Volume restante estimado na garrafa aberta com base no nível OCR (100%, 75%, 50%, 25%, 10%)
  const fillPct = bottle.openBottleFillPct !== undefined ? bottle.openBottleFillPct : 50;
  const openBottleRemainingMl = Number((bottle.bottleVolumeMl * (fillPct / 100)).toFixed(1));
  const openBottleRemainingDoses = Number((openBottleRemainingMl / bottle.standardDoseMl).toFixed(2));
  const openBottleConsumedDoses = Number(((bottle.bottleVolumeMl - openBottleRemainingMl) / bottle.standardDoseMl).toFixed(2));
  
  // Doses teóricas consumidas pelo Teknisa
  const dosesSold = bottle.dosesSoldTeknisa;
  
  // Volume real consumido
  const totalMlConsumedReal: number =
    bottle.totalMlConsumedReal && bottle.totalMlConsumedReal > 0
      ? bottle.totalMlConsumedReal
      : Number((openBottleConsumedDoses * bottle.standardDoseMl).toFixed(1));
  
  const realDosesConsumed = Number((totalMlConsumedReal / bottle.standardDoseMl).toFixed(2));
  
  // Desvio de doses (+ = consumiu mais do que faturou no caixa)
  const deviationDoses = Number(Math.max(0, realDosesConsumed - dosesSold).toFixed(2));
  
  // Custo por dose
  const doseCost = bottle.category === 'DESTILADO' ? 30.00 : 20.00;
  const deviationReais = Number((deviationDoses * doseCost).toFixed(2));
  
  // Média servida por drink (ml)
  const averageDoseServedMl = dosesSold > 0 
    ? Number((totalMlConsumedReal / dosesSold).toFixed(1))
    : bottle.standardDoseMl;

  // Diagnóstico do tipo de desvio:
  let deviationType: SpiritBottle['deviationType'] = 'NORMAL';
  if (dosesSold === 0 && deviationDoses > 1.0) {
    deviationType = 'SAIDA_SEM_COMANDA';
  } else if (averageDoseServedMl > 55.0) {
    deviationType = 'DOSE_A_OLHO';
  } else if (deviationDoses > 3.0) {
    deviationType = 'SAIDA_SEM_COMANDA';
  }

  let riskLevel: SpiritBottle['riskLevel'] = 'BAIXO';
  if (deviationDoses > 4.0 || averageDoseServedMl > 62.0) {
    riskLevel = 'ALTO';
  } else if (deviationDoses > 1.5 || averageDoseServedMl > 54.0) {
    riskLevel = 'MEDIO';
  }

  return {
    ...bottle,
    openBottleFillPct: fillPct,
    openBottleRemainingMl,
    openBottleRemainingDoses,
    openBottleConsumedDoses,
    totalMlConsumedReal,
    deviationDoses,
    deviationReais,
    deviationType,
    averageDoseServedMl,
    riskLevel,
  };
}

/**
 * Calcula resumo consolidado da auditoria do bar
 */
export function compileBarSummary(taps: ChoppTap[], bottles: SpiritBottle[]): BarAuditSummary {
  const totalLitersKegsDispensed = Number(taps.reduce((acc, t) => acc + t.litersDispensedReal, 0).toFixed(2));
  const totalLitersSoldTeknisa = Number(taps.reduce((acc, t) => acc + t.litersSoldTeknisa, 0).toFixed(2));
  const totalTechnicalLossLiters = Number(taps.reduce((acc, t) => acc + t.technicalLossLiters, 0).toFixed(2));
  const totalDeviationLiters = Number(taps.reduce((acc, t) => acc + t.unaccountedDeviationLiters, 0).toFixed(2));
  
  const tapsDeviationReais = taps.reduce((acc, t) => acc + t.deviationCostReais, 0);
  const bottlesDeviationReais = bottles.reduce((acc, b) => acc + b.deviationReais, 0);
  const totalDeviationReais = Number((tapsDeviationReais + bottlesDeviationReais).toFixed(2));

  const overallYieldPct = totalLitersKegsDispensed > 0
    ? Number(((totalLitersSoldTeknisa / totalLitersKegsDispensed) * 100).toFixed(1))
    : 100;

  const topDiscrepancies: string[] = [];

  // Encontra maiores desvios em chopp
  const sortedTaps = [...taps].sort((a, b) => b.unaccountedDeviationLiters - a.unaccountedDeviationLiters);
  if (sortedTaps[0] && sortedTaps[0].unaccountedDeviationLiters > 0.8) {
    topDiscrepancies.push(
      `Torneira ${sortedTaps[0].tapNumber} (${sortedTaps[0].beerName}): ${sortedTaps[0].unaccountedDeviationLiters.toFixed(2)}L não faturados (Perda estimada: R$ ${sortedTaps[0].deviationCostReais.toFixed(2)}).`
    );
  }

  // Encontra maiores desvios em garrafas
  const sortedBottles = [...bottles].sort((a, b) => b.deviationDoses - a.deviationDoses);
  if (sortedBottles[0] && sortedBottles[0].deviationDoses > 2) {
    topDiscrepancies.push(
      `${sortedBottles[0].name}: ${sortedBottles[0].deviationDoses} doses em falta entre a contagem física e vendas no Teknisa (R$ ${sortedBottles[0].deviationReais.toFixed(2)}).`
    );
  }

  // Alerta de pressão
  const badPressureTap = taps.find(t => t.pressurePsi < 28 || t.pressurePsi > 38);
  if (badPressureTap) {
    topDiscrepancies.push(
      `Torneira ${badPressureTap.tapNumber}: Pressão de CO2 em ${badPressureTap.pressurePsi} PSI fora da faixa segura de 32-36 PSI, provocando perda por espuma.`
    );
  }

  return {
    referenceDate: new Date().toISOString().split('T')[0],
    shift: 'DIA_TODO',
    totalLitersKegsDispensed,
    totalLitersSoldTeknisa,
    totalTechnicalLossLiters,
    totalDeviationLiters,
    totalDeviationReais,
    overallYieldPct,
    topDiscrepancies,
  };
}
