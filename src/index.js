import React from "react"
import { render } from "react-dom"
import "regenerator-runtime/runtime";
import "core-js";

import "./css/app.scss"
import App from "./js/App"

const app = document.getElementById("app")
render(
    <App />
    , app
)
