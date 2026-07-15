import { ProceqStatus } from '@prisma/client';
import { CompanyMapper } from './company-mapper';
import { MeasurementSummaryItem, StatusChangeNotification } from './sync.types';

const item = (
  measurementId: string,
  status: ProceqStatus = ProceqStatus.ELASTIC,
): MeasurementSummaryItem => ({
  serialNumber: `SN-${measurementId}`,
  bansheeName: `Banshee ${measurementId}`,
  measurementId,
  status,
});

const change = (
  companyId: string,
  measurementId: string,
  activate: boolean,
): StatusChangeNotification => ({
  companyId,
  serialNumber: `SN-${measurementId}`,
  bansheeName: null,
  measurementId,
  previousStatus: ProceqStatus.ELASTIC,
  newStatus: ProceqStatus.LOW_PLASTIC,
  activateNotifications: activate,
});

describe('CompanyMapper (§5.2 cycle-scoped accumulator)', () => {
  it('starts empty', () => {
    const mapper = new CompanyMapper();
    expect(mapper.isEmpty()).toBe(true);
    expect(mapper.companyCount).toBe(0);
    expect(mapper.statusChangeCount).toBe(0);
    expect(mapper.getBuckets()).toEqual([]);
  });

  it('consolidates measurements from multiple technicians into one company bucket (Scenario 8)', () => {
    const mapper = new CompanyMapper();

    // Technician 1 touches company A.
    mapper.addMeasured('companyA', item('m1'));
    // Technician 4 also touches company A later in the cycle.
    mapper.addNotMeasured('companyA', item('m2', ProceqStatus.UNMEASURED));
    // A different company is kept separate.
    mapper.addMeasured('companyB', item('m3'));

    expect(mapper.companyCount).toBe(2);

    const buckets = mapper.getBuckets();
    const companyA = buckets.find((b) => b.companyId === 'companyA')!;
    expect(companyA.measured.map((m) => m.measurementId)).toEqual(['m1']);
    expect(companyA.notMeasured.map((m) => m.measurementId)).toEqual(['m2']);

    const companyB = buckets.find((b) => b.companyId === 'companyB')!;
    expect(companyB.measured).toHaveLength(1);
    expect(companyB.notMeasured).toHaveLength(0);
  });

  it('accumulates status changes per company and counts them', () => {
    const mapper = new CompanyMapper();
    mapper.addStatusChange(change('companyA', 'm1', true));
    mapper.addStatusChange(change('companyA', 'm2', false));
    mapper.addStatusChange(change('companyB', 'm3', true));

    expect(mapper.statusChangeCount).toBe(3);
    const companyA = mapper
      .getBuckets()
      .find((b) => b.companyId === 'companyA')!;
    expect(companyA.statusChanges).toHaveLength(2);
  });

  it('preserves first-seen company order in getBuckets()', () => {
    const mapper = new CompanyMapper();
    mapper.addMeasured('c3', item('m1'));
    mapper.addMeasured('c1', item('m2'));
    mapper.addMeasured('c2', item('m3'));
    expect(mapper.getBuckets().map((b) => b.companyId)).toEqual([
      'c3',
      'c1',
      'c2',
    ]);
  });
});
