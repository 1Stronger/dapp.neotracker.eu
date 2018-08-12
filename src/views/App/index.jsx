import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";

import Header from "./../../components/Header";
import NOSActions from "./../../components/NOSActions";

const App = ({ children }) => (
<div>
    <Header />

    <main>
      {children}
    </main>
</div>
);

export default App;
