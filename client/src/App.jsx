import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import TreatmentPlan from './pages/TreatmentPlan';
import DrugInfo from './pages/DrugInfo';
import StudentMode from './pages/StudentMode';
import OwnerView from './pages/OwnerView';
import Login from './pages/Login';
import Register from './pages/Register';

const noSidebarRoutes = ['/login', '/register'];

function Layout() {
  const location = useLocation();
  const hideSidebar = noSidebarRoutes.includes(location.pathname);

  if (hideSidebar) {
    return (
      <div style={{ minHeight:'100vh', background:'#F7F8F3' }}>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    );
  }

  return (
    <div style={{
      display:'flex', minHeight:'100vh',
      background:'#F7F8F3',
      fontFamily:"'Plus Jakarta Sans',sans-serif",
    }}>
      <Sidebar />
      <main style={{ flex:1, overflowY:'auto', minWidth:0 }}>
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/treatment"  element={<TreatmentPlan />} />
          <Route path="/drugs"      element={<DrugInfo />} />
          <Route path="/student"    element={<StudentMode />} />
          <Route path="/owner"      element={<OwnerView />} />
          <Route path="/login"      element={<Login />} />
          <Route path="/register"   element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}