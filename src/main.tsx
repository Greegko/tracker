import { render } from "solid-js/web";

import "./tailwind.css";
import { App } from "./app";

const appNode = document.getElementById("app");

render(() => <App />, appNode!);
