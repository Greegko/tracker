import { Route, Router } from "@solidjs/router";
import { HomePage } from "./pages/home";
import { HistoryPage } from "./pages/history";
import { JSXElement } from "solid-js";

export const App = () => (
  <Router root={Wrapper}>
    <Route path="/" component={HomePage}></Route>
    <Route path="/history" component={HistoryPage}></Route>
  </Router>
);

const Wrapper = (props: { children?: JSXElement }) => <div class="h-full bg-black text-white">{props.children}</div>;
