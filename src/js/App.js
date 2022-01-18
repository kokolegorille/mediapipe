import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Link
} from "react-router-dom"

import Home from "./views/Home"
import About from "./views/About"
import FaceMesh from "./views/FaceMesh"
import HandsMesh from "./views/HandsMesh"
import NotFound from "./views/NotFound"

const App = () => {
    return (
        <BrowserRouter>
            <nav>
                <Link to="/">Home</Link> | {" "}
                <Link to="/about">About</Link> | {" "}
                <Link to="/face_mesh">Face Mesh</Link> | {" "}
                <Link to="/hands_mesh">Hands Mesh</Link>
            </nav>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/face_mesh/*" element={<FaceMesh />} />
                <Route path="/hands_mesh/*" element={<HandsMesh />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;