import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

/** style */
import "../style/global.scss";
import "../style/upload.scss";
import "../style/main.scss";

/** FontAwesome */
import "@fortawesome/fontawesome-pro/css/all.min.css";

import React from "react";
import * as ReactDOM from "react-dom/client";

// import { IndexProvider } from "./component/provider/IndexProvider";
import Home from "./component/view/Home";

const container = document.getElementById(`root`) as HTMLElement;
const root = ReactDOM.createRoot(container);

root.render(
	<Home />
);