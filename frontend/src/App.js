import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Switch, Route, useLocation } from "react-router-dom";


// Components
import PillNav from "./components/PillNav";
import SideDrawer from "./components/SideDrawer";
import Backdrop from "./components/Backdrop";
import Footer from "./components/Footer";
import UserProfileButton from "./components/UserProfileButton";

// Screens
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import MainScreen from "./screens/MainScreen";
import AllProductsScreen from "./screens/AllProductsScreen";
import DermotologyScreen from "./screens/DermotologyScreen";
import DepressionScreen from "./screens/DepressionScreen";
import DentalScreen from "./screens/DentalScreen";
import FractureScreen from "./screens/FractureScreen";
import WomensCareScreen from "./screens/WomensCareScreen";
import AdminScreen from "./screens/AdminScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PrescriptionScreen from "./screens/PrescriptionScreen";
// import
// import logo from "./images/logo.png";
const logo = "/medcare.png";

// Wrapper component to use hooks inside Router
function AppContent() {
  const [sideToggle, setSideToggle] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/allProducts' },
    { label: 'AI Prescription', href: '/prescription' },
    { label: 'Cart', href: '/cart' }
  ];

  // Determine if the current page has a dark theme
  const isDarkPage = ['/prescription', '/cart'].includes(location.pathname);

  // Navbar colors based on theme
  const navColors = isDarkPage ? {
    baseColor: "#ffffff",
    pillColor: "#ffffff",
    pillTextColor: "#ffffff",
    hoveredPillTextColor: "#171717",
  } : {
    baseColor: "#171717",
    pillColor: "#171717",
    pillTextColor: "#171717",
    hoveredPillTextColor: "#ffffff",
  };

  return (
    <>
      <UserProfileButton />
      <PillNav
        logo={logo}
        logoAlt="Pharmacy Logo"
        items={navItems}
        activeHref={location.pathname}
        {...navColors}
        onMobileMenuClick={() => setSideToggle(!sideToggle)}
        initialLoadAnimation={true}
      />
      <SideDrawer show={sideToggle} click={() => setSideToggle(false)} />
      <Backdrop show={sideToggle} click={() => setSideToggle(false)} />
      <main className="app">
        <Switch>
          <Route exact path="/" component={MainScreen} />
          <Route exact path="/allProducts" component={AllProductsScreen} />
          <Route exact path="/product" component={HomeScreen} />
          <Route exact path="/product/:id" component={ProductScreen} />
          <Route exact path="/products/dermatology" component={DermotologyScreen} />
          <Route exact path="/products/depression" component={DepressionScreen} />
          <Route exact path="/products/dental" component={DentalScreen} />
          <Route exact path="/products/fracture" component={FractureScreen} />
          <Route exact path="/products/womensCare" component={WomensCareScreen} />
          <Route exact path="/admin" component={AdminScreen} />
          <Route exact path="/cart" component={CartScreen} />
          <Route exact path="/prescription" component={PrescriptionScreen} />
          <Route exact path="/login" component={LoginScreen} />
          <Route exact path="/signup" component={SignUpScreen} />
          <Route exact path="/profile" component={ProfileScreen} />
        </Switch>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
