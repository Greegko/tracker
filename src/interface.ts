export interface Tracker {
  id: string;
  name: string;
}

export interface HistoryItem {
  id: number;
  trackerId: string;
  date: Date;
  length: number;
}

export interface TrackerState {
  history: HistoryItem[];
  trackers: Tracker[];
}
