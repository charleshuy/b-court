import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Banner from "./component/Banner";
import Features from "./component/Features";
import Header from "./component/Header";
import Court from "./component/Court";
import PromotionalCard from "./component/PromotionalCard";
import CourtsOnSale from "./component/CourtsOnSale";
import Banner2 from "./component/Banner2";
import Testimonials from "./component/Testimonials";
import Footer from "./component/Footer";
import Shop from "./component/Shop";
import CourtDetail from "./component/CourtDetail";
import Payment from "./component/Payment";
import Headerv2 from "./managerpages/Headerv2";
import SideBar from "./managerpages/Sidebar";
import Login from "./component/Login";
import Signup from "./component/Signup";
import WalletComponent from "./component/WalletComponent"; // Import WalletComponent
import PaymentReturn from "./component//PaymentReturn";
import Order from "./managerpages/ManagementOrder";
import ManagementCourt from "./managerpages/ManagementCourt";
import ManagementSlot from "./managerpages/ManagementSlot";
import ManagementStaff from "./managerpages/ManagementStaff";
import Sidebarv2 from "./staffpages/Sidebarv2";
import UserCheckIn from "./staffpages/UserCheckin";
import SideBarv3 from "./adminpages/Sidebarv3";
import ManagementUser from "./adminpages/ManagementUser";
import ApproveCourt from "./adminpages/ApproveCourt";

import { useState, useEffect } from "react";
import Profile from "./userPages/Profile";
import FailPage from "./userPages/DepositFail";
import SuccessPage from "./userPages/DepositSuccess";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/"; // Redirect to the home page
  };

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/"
          element={
            <>
              <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
              <Banner />
              <Features />
              <Court />
            </>
          }
        />
        <Route
          path="/shop"
          element={
            <>
              <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
              <Shop />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
              <Profile />
            </>
          }
        />
        <Route
          path="/court-detail/:id"
          element={
            <>
              <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
              <CourtDetail />
            </>
          }
        />
        <Route
          path="/payment"
          element={
            <>
              <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
              <Payment />
            </>
          }
        />
        <Route
          path="/wallet"
          element={
            <>
              <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
              <WalletComponent />
            </>
          }
        />
        <Route
          path="/success"
          element={
            <>
              <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
              <SuccessPage />
            </>
          }
        />
        <Route
          path="/error"
          element={
            <>
              <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
              <FailPage />
            </>
          }
        />

        <Route
          path="/manager/courts/manager/orders/:courtId"
          element={
            <div className="flex">
              <SideBar />
              <div className="flex-1">
                <Headerv2 />
                <Order />
              </div>
            </div>
          }
        />
        <Route
          path="/manager/courts"
          element={
            <div className="flex">
              <SideBar />
              <div className="flex-1">
                <Headerv2 />
                <ManagementCourt />
              </div>
            </div>
          }
        />
        <Route
          path="/manager/slots"
          element={
            <div className="flex">
              <SideBar />
              <div className="flex-1">
                <Headerv2 />
                <ManagementSlot />
              </div>
            </div>
          }
        />
        <Route
          path="/manager/staff"
          element={
            <div className="flex">
              <SideBar />
              <div className="flex-1">
                <Headerv2 />
                <ManagementStaff />
              </div>
            </div>
          }
        />
        <Route
          path="/staff/check-in"
          element={
            <div className="flex">
              <Sidebarv2 />
              <div className="flex-1">
                <Headerv2 />
                <UserCheckIn />
              </div>
            </div>
          }
        />
        <Route
          path="/admin/users"
          element={
            <div className="flex">
              <SideBarv3 />
              <div className="flex-1">
                <Headerv2 />
                <ManagementUser />
              </div>
            </div>
          }
        />
        <Route
          path="/admin/requests"
          element={
            <div className="flex">
              <SideBarv3 />
              <div className="flex-1">
                <Headerv2 />
                <ApproveCourt />
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
