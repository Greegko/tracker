import { format } from "date-fns";
import { For } from "solid-js";
import { intervalToDuration } from "date-fns";
import { unwrap } from "solid-js/store";

import { setState, state } from "../data";
import { HistoryItem } from "../interface";
import { A } from "@solidjs/router";

const formatSeconds = (input: number) => {
  const { hours, minutes, seconds } = intervalToDuration({ start: 0, end: input * 1000 });

  const zeroPad = (num: number = 0) => String(num).padStart(2, "0");

  return `${zeroPad(hours!)}:${zeroPad(minutes!)}:${zeroPad(seconds!)}`;
};

export const HistoryPage = () => {
  const onDelete = (historyEntry: HistoryItem) => {
    setState("history", entries => entries.filter(x => x !== unwrap(historyEntry)));
  };

  return (
    <div>
      <A class="text-blue-500 p-4" href="/">
        Back to home
      </A>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Tracker</th>
            <th>Length</th>
            <th>Actions</th>
          </tr>
        </thead>
        <For each={state.history}>
          {entry => (
            <tr class="*:p-2">
              <td>{format(entry.date, "yyyy-MM-dd hh:mm")}</td>
              <td>{entry.trackerId}</td>
              <td>{formatSeconds(entry.length)}</td>
              <td>
                <a class="text-red-700" onclick={[onDelete, entry]}>
                  delete
                </a>
              </td>
            </tr>
          )}
        </For>
      </table>
    </div>
  );
};
