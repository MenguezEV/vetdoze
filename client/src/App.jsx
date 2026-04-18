import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import TreatmentPlan from './pages/TreatmentPlan';
import DrugInfo from './pages/DrugInfo';
import StudentMode from './pages/StudentMode';
import OwnerView from './pages/OwnerView';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
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
    </BrowserRouter>
  );
}