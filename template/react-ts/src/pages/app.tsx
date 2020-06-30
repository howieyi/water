import React from "react";
import { Switch, Route } from "react-router-dom";

import Index from "./views/index";
import Other from "./views/other";

export default function App() {
  return (
    <div className="ui-iosec">
      <Switch>
        <Route path="/" children={<Index />} exact />
        <Route path="/private" children={<Other />} />
      </Switch>
    </div>
  );
}
