import React from "react";
import { Switch, Route } from "react-router-dom";

import Index from "./views/index.jsx";
import Other from "./views/other.jsx";

export default function App() {
  return (
    <div className="ui-app">
      <Switch>
        <Route path="/" children={<Index />} exact />
        <Route path="/private" children={<Other />} />
      </Switch>
    </div>
  );
}
