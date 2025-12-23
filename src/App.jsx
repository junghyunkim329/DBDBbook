import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "./layout"
import Home from "./pages/page"
import Scan from "./pages/scan"
import Bookshelf from "./pages/bookshelf"
import AllBooks from "./pages/Allbooks/index"
import Login from "./pages/login";
import Signup from "./pages/signup";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="scan" element={<Scan />} />
          <Route path="bookshelf" element={<Bookshelf />} />
          <Route path="/allbooks" element={<AllBooks />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
      </Routes>
    </Router>
  )
}
