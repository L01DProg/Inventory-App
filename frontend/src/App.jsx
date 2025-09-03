import { Routes, Route } from "react-router-dom";
import Login from "./pages/loginform";
import Register from "./pages/registerform";
import Dashboard from "./components/dashboard";
import Header from "./components/header";
import Home from "./components/home";
import AddItems from "./components/additems";
import Sales from "./components/sales";
import ProductView from "./components/shopping";
import Profile from "./pages/Profile";
import Notification from "./components/notification";
import Reports from "./components/Report";

function App() {
  return (
    <>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="add-item" element={<AddItems />} />
            <Route path="sales" element={<Sales />} />
            <Route path="shopping" element={<ProductView />} />
          </Route>
          <Route path="/profile" element={<Profile />}>
            <Route path="total-sales" element={<Reports />} />
            <Route path="notification" element={<Notification />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
