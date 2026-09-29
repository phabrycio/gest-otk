import { describe, it, expect } from 'vitest';
import {
  evaluateFoamAndPressure,
  auditChoppTap,
  diagnoseChoppTap,
  auditSpiritBottle,
  compileBarSummary,
} from '../services/choppAuditService';
import { ChoppTap, SpiritBottle } from '../types/barIntelligence.types';

describe('Chopp & Bar Intelligence Engine', () => {
  it('should evaluate foam and pressure states correctly', () => {
    // Normal ideal
    expect(evaluateFoamAndPressure(34, 1.2)).toBe('PERFEITA');

    // Warm beer (> 3.0°C)
    expect(evaluateFoamAndPressure(34, 3.8)).toBe('CHOPP_MORNO');

    // Low pressure (< 28 PSI)
    expect(evaluateFoamAndPressure(24, 1.5)).toBe('PRESSAO_BAIXA');

    // High pressure (> 38 PSI)
    expect(evaluateFoamAndPressure(42, 1.0)).toBe('ALERTA_ESPUMA');
  });

  it('should audit tap deviations against Teknisa sales and technical loss', () => {
    const mockTap: ChoppTap = {
      id: 'test-tap',
      tapNumber: 1,
      beerName: 'Chopp Pilsen 50L',
      style: 'PILSEN',
      kegCapacityLiters: 50,
      currentVolumeLiters: 20,
      glassesSoldTeknisa: 50, // 50 * 0.35 = 17.5L
      litersSoldTeknisa: 17.5,
      litersDispensedReal: 20.0, // 20L dispensa real
      technicalLossPct: 5.0, // 5% de 17.5 = 0.875L -> 0.88L
      technicalLossLiters: 0,
      unaccountedDeviationLiters: 0,
      deviationCostReais: 0,
      deviationRetailReais: 0,
      deviationStatus: 'NORMAL',
      temperatureCelsius: 1.0,
      pressurePsi: 34,
      foamStatus: 'PERFEITA',
      kegBatchNumber: 'L1',
      kegExpiryDate: '2026-10-10',
      kegInstalledAt: '2026-09-20',
      installedBy: 'Barman',
    };

    const audited = auditChoppTap(mockTap);

    // technical loss = 17.5 * 0.05 = 0.88L
    expect(audited.technicalLossLiters).toBeCloseTo(0.88, 1);

    // expected dispense = 17.5 + 0.88 = 18.38L
    // unaccounted = 20.0 - 18.38 = 1.62L
    expect(audited.unaccountedDeviationLiters).toBeCloseTo(1.62, 1);

    // deviation status: > 0.8L should be ATENCAO
    expect(audited.deviationStatus).toBe('ATENCAO');

    // Cost for pilsen is R$ 16/L -> 1.62 * 16 = ~R$ 25.92
    expect(audited.deviationCostReais).toBeGreaterThan(20);
  });

  it('should generate critical diagnosis for warm beer and low pressure', () => {
    const warmAndLowPressureTap: ChoppTap = {
      id: 'test-tap-2',
      tapNumber: 2,
      beerName: 'Chopp IPA 30L',
      style: 'IPA',
      kegCapacityLiters: 30,
      currentVolumeLiters: 10,
      glassesSoldTeknisa: 20,
      litersSoldTeknisa: 10.0,
      litersDispensedReal: 13.0,
      technicalLossPct: 6.0,
      technicalLossLiters: 0.6,
      unaccountedDeviationLiters: 2.4, // > 1.8 = CRITICO
      deviationCostReais: 60.0,
      deviationRetailReais: 120.0,
      deviationStatus: 'CRITICO',
      temperatureCelsius: 4.2, // > 2.5C
      pressurePsi: 24, // < 30 PSI
      foamStatus: 'CHOPP_MORNO',
      kegBatchNumber: 'IPA-1',
      kegExpiryDate: '2026-09-23',
      kegInstalledAt: '2026-09-21',
      installedBy: 'Barman',
    };

    const diagnoses = diagnoseChoppTap(warmAndLowPressureTap);

    const tempIssue = diagnoses.find((d) => d.title.includes('Temperatura'));
    expect(tempIssue).toBeDefined();
    expect(tempIssue?.severity).toBe('DANGER');

    const pressureIssue = diagnoses.find((d) => d.title.includes('Pressão'));
    expect(pressureIssue).toBeDefined();
    expect(pressureIssue?.severity).toBe('WARNING');

    const devIssue = diagnoses.find((d) => d.title.includes('Desvio Oculto'));
    expect(devIssue).toBeDefined();
    expect(devIssue?.severity).toBe('DANGER');
  });

  it('should audit spirit bottle doses against standard 50ml measure', () => {
    const mockBottle: SpiritBottle = {
      id: 'gin-1',
      name: 'Gin Tanqueray 750ml',
      category: 'DESTILADO',
      bottleVolumeMl: 750,
      standardDoseMl: 50,
      totalDosesExpected: 15,
      openBottles: 1,
      sealedStockBottles: 4,
      dosesSoldTeknisa: 6,
      openBottleFillPct: 50, // 50% remaining = 375ml consumed
      dosesCalculatedConsumed: 7.5,
      deviationDoses: 1.5,
      deviationReais: 0,
      riskLevel: 'BAIXO',
    };

    const audited = auditSpiritBottle(mockBottle);

    expect(audited.openBottleRemainingMl).toBe(375);
    expect(audited.openBottleRemainingDoses).toBe(7.5);
    expect(audited.openBottleConsumedDoses).toBe(7.5);
    // 375ml / 6 drinks = 62.5 ml/drink -> DOSE_A_OLHO
    expect(audited.averageDoseServedMl).toBeCloseTo(62.5, 1);
    expect(audited.deviationType).toBe('DOSE_A_OLHO');
    expect(audited.deviationReais).toBeGreaterThan(40);
  });

  it('should detect SAIDA_SEM_COMANDA when bottle is consumed with zero Teknisa sales', () => {
    const stolenOrUnregisteredBottle: SpiritBottle = {
      id: 'whisky-1',
      name: 'Whisky Black Label 750ml',
      category: 'DESTILADO',
      bottleVolumeMl: 750,
      standardDoseMl: 50,
      totalDosesExpected: 15,
      openBottles: 1,
      sealedStockBottles: 2,
      dosesSoldTeknisa: 0, // Zero sales on register!
      openBottleFillPct: 50, // Half bottle gone = 375ml / 7.5 doses
      dosesCalculatedConsumed: 7.5,
      deviationDoses: 7.5,
      deviationReais: 0,
      riskLevel: 'BAIXO',
    };

    const audited = auditSpiritBottle(stolenOrUnregisteredBottle);

    expect(audited.deviationType).toBe('SAIDA_SEM_COMANDA');
    expect(audited.deviationDoses).toBe(7.5);
    expect(audited.riskLevel).toBe('ALTO');
    expect(audited.deviationReais).toBe(225.0); // 7.5 * 30
  });

  it('should detect NORMAL when doses match 50ml standard', () => {
    const normalBottle: SpiritBottle = {
      id: 'cachaca-1',
      name: 'Cachaça de Jambu Regional 700ml',
      category: 'DESTILADO',
      bottleVolumeMl: 700,
      standardDoseMl: 50,
      totalDosesExpected: 14,
      openBottles: 1,
      sealedStockBottles: 5,
      dosesSoldTeknisa: 3.5,
      openBottleFillPct: 75, // 25% consumed = 175ml / 50ml = 3.5 doses
      dosesCalculatedConsumed: 3.5,
      deviationDoses: 0,
      deviationReais: 0,
      riskLevel: 'BAIXO',
    };

    const audited = auditSpiritBottle(normalBottle);

    expect(audited.averageDoseServedMl).toBe(50.0);
    expect(audited.deviationType).toBe('NORMAL');
    expect(audited.deviationDoses).toBe(0);
    expect(audited.riskLevel).toBe('BAIXO');
  });

  it('should compile bar summary metrics and yield percentage', () => {
    const tap1: ChoppTap = {
      id: 't1',
      tapNumber: 1,
      beerName: 'Pilsen',
      style: 'PILSEN',
      kegCapacityLiters: 50,
      currentVolumeLiters: 20,
      glassesSoldTeknisa: 100,
      litersSoldTeknisa: 35.0,
      litersDispensedReal: 38.0,
      technicalLossPct: 5.5,
      technicalLossLiters: 1.9,
      unaccountedDeviationLiters: 1.1,
      deviationCostReais: 17.6,
      deviationRetailReais: 44.0,
      deviationStatus: 'ATENCAO',
      temperatureCelsius: 1.2,
      pressurePsi: 34,
      foamStatus: 'PERFEITA',
      kegBatchNumber: 'L1',
      kegExpiryDate: '2026-10-10',
      kegInstalledAt: '2026-09-20',
      installedBy: 'Lucas',
    };

    const bottle1: SpiritBottle = {
      id: 'b1',
      name: 'Vodka',
      category: 'DESTILADO',
      bottleVolumeMl: 750,
      standardDoseMl: 50,
      totalDosesExpected: 15,
      openBottles: 1,
      sealedStockBottles: 3,
      dosesSoldTeknisa: 10,
      dosesCalculatedConsumed: 10,
      deviationDoses: 2.0,
      deviationReais: 50.0,
      riskLevel: 'MEDIO',
    };

    const summary = compileBarSummary([tap1], [bottle1]);

    expect(summary.totalLitersSoldTeknisa).toBe(35.0);
    expect(summary.totalLitersKegsDispensed).toBe(38.0);
    // Yield = (35 / 38) * 100 = ~92.1%
    expect(summary.overallYieldPct).toBeCloseTo(92.1, 1);
    expect(summary.totalDeviationReais).toBeCloseTo(17.6 + 50.0, 1);
    expect(summary.topDiscrepancies.length).toBeGreaterThan(0);
  });
});
