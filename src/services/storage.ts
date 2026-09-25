import { TriageRecord, InventoryItem } from '../types/index.ts';
import { INITIAL_INVENTORY, SAMPLE_TRIAGE_RECORDS } from '../data/hgoData.ts';

const TRIAGE_KEY = 'hgo_triage_records_v1';
const INVENTORY_KEY = 'hgo_inventory_v1';
const LOW_BANDWIDTH_KEY = 'hgo_low_bandwidth_mode';

export function getStoredTriageRecords(): TriageRecord[] {
  try {
    const raw = localStorage.getItem(TRIAGE_KEY);
    if (!raw) {
      localStorage.setItem(TRIAGE_KEY, JSON.stringify(SAMPLE_TRIAGE_RECORDS));
      return SAMPLE_TRIAGE_RECORDS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Storage read error, using sample records:', e);
    return SAMPLE_TRIAGE_RECORDS;
  }
}

export function saveTriageRecord(record: TriageRecord): TriageRecord[] {
  const current = getStoredTriageRecords();
  const updated = [record, ...current.filter(r => r.id !== record.id)];
  try {
    localStorage.setItem(TRIAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save triage record to localStorage:', e);
  }
  return updated;
}

export function syncAllTriageRecords(): { updated: TriageRecord[]; syncedCount: number } {
  const current = getStoredTriageRecords();
  let syncedCount = 0;
  const updated = current.map(r => {
    if (!r.synced) {
      syncedCount++;
      return { ...r, synced: true };
    }
    return r;
  });
  localStorage.setItem(TRIAGE_KEY, JSON.stringify(updated));
  return { updated, syncedCount };
}

export function getStoredInventory(): InventoryItem[] {
  try {
    const raw = localStorage.getItem(INVENTORY_KEY);
    if (!raw) {
      localStorage.setItem(INVENTORY_KEY, JSON.stringify(INITIAL_INVENTORY));
      return INITIAL_INVENTORY;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_INVENTORY;
  }
}

export function updateInventoryItemQuantity(itemId: string, delta: number): InventoryItem[] {
  const items = getStoredInventory();
  const updated = items.map(item => {
    if (item.id === itemId) {
      const newQty = Math.max(0, item.quantity + delta);
      return { ...item, quantity: newQty };
    }
    return item;
  });
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(updated));
  return updated;
}

export function addInventoryItem(item: InventoryItem): InventoryItem[] {
  const items = getStoredInventory();
  const updated = [item, ...items];
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(updated));
  return updated;
}

export function getLowBandwidthMode(): boolean {
  try {
    return localStorage.getItem(LOW_BANDWIDTH_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setLowBandwidthMode(enabled: boolean): void {
  try {
    localStorage.setItem(LOW_BANDWIDTH_KEY, enabled ? 'true' : 'false');
  } catch {}
}
