import { For, JSXElement, createComputed, createSignal, on } from "solid-js";

import { get, set } from "idb-keyval";
import { createStore, unwrap } from "solid-js/store";
import { differenceInSeconds } from "date-fns";

function camelize(str: string) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

interface Tracker {
  id: string;
  name: string;
}

interface HistoryItem {
  id: number;
  trackerId: string;
  date: Date;
  length: number;
}

interface TrackerState {
  history: HistoryItem[];
  trackers: Tracker[];
}

interface ButtonProps {
  tracker: Tracker;
  active: boolean;
  onClick: () => void;
}

const Button = (props: ButtonProps) => (
  <Card active={props.active}>
    <div class="cursor-pointer p-3 h-full" onClick={props.onClick}>
      {props.tracker.name}
    </div>
  </Card>
);

export const Card = (props: { children: JSXElement; active?: boolean }) => (
  <div
    classList={{ active: props.active }}
    class="inline-block border rounded-lg border-sky-300 m-3 h-[200px] w-[200px] [&.active]:bg-sky-700"
  >
    {props.children}
  </div>
);

export const App = () => {
  const [activeTrackers, setActiveTrackers] = createSignal<[Tracker, Date][]>([]);
  const [state, setState] = createStore<TrackerState>({ history: [], trackers: [] });

  createComputed(async () => {
    const config = await get("tracker-config");
    if (!config) return;
    setState(config);
  });

  const addTracker = () => {
    const name = prompt("Tracker name");

    if (!name) return;

    setState("trackers", trackers => [...trackers, { id: camelize(name), name }]);
  };

  createComputed(
    on([() => state.trackers, () => state.history], () => set("tracker-config", unwrap(state)), { defer: true }),
  );

  const onTrackerClick = (tracker: Tracker) => {
    if (activeTrackers().find(x => x[0] === tracker) !== undefined) {
      stopTracking(tracker, activeTrackers().find(x => x[0] === tracker)![1]);
      setActiveTrackers(trackers => trackers.filter(x => x[0] !== tracker));
    } else {
      setActiveTrackers(trackers => [...trackers, [tracker, new Date()]]);
    }
  };

  const stopTracking = (tracker: Tracker, date: Date) => {
    const length = differenceInSeconds(new Date(), date);

    setState("history", history => [...history, { id: history.length, trackerId: tracker.id, date, length }]);
  };

  return (
    <div class="h-full bg-black text-white">
      <For each={state.trackers}>
        {tracker => (
          <Button
            tracker={tracker}
            onClick={() => onTrackerClick(tracker)}
            active={activeTrackers().find(x => x[0] === tracker) !== undefined}
          />
        )}
      </For>
      <Card>
        <div class="cursor-pointer p-3 h-full" onClick={addTracker}>
          Add
        </div>
      </Card>
    </div>
  );
};
