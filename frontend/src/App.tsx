import { BrowserRouter, Routes, Route } from "react-router-dom"

import Certificatecheck from "./components/Certificatecheck";

function App() {
  return (
  <div>
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route path="" element={<Certificatecheck />}></Route>
          {/* 路由設定 */}
          {/* <Route path="detail" element={}></Route> */}
        </Route>
      </Routes>
    </BrowserRouter>
  </div>
  )
}

export default App