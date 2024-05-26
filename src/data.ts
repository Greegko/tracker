import { createStore, unwrap } from "solid-js/store";
import { TrackerState } from "./interface";
import { get, set } from "idb-keyval";
import { createComputed, on } from "solid-js";

export const [state, setState] = createStore<TrackerState>({ history: [], trackers: [] });

createComputed(async () => {
  const config = await get("tracker-config");
  if (!config) return;
  setState(config);
});

createComputed(
  on([() => state.trackers, () => state.history], () => set("tracker-config", unwrap(state)), { defer: true }),
);
