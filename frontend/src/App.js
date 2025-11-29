import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './Welcome';
import LoginForm from './LoginForm';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import HomePage from './pages/HomePage';
import AnnonceDetail from './pages/AnnonceDetail';
import MessagePage from './pages/MessagePage';
import MessagesListPage from './pages/MessagesListPage';
import LogementsPage from './pages/LogementsPage';
import ColocationPage from './pages/ColocationPage';
import AjouterAnnoncePage from './pages/AjouterAnnoncePage';
import ProfilPage from './pages/ProfilPage';
import FavorisPage from './pages/FavorisPage';
import VuesPage from './pages/VuesPage';
import ContactPage from './pages/ContactPage';
import AproposPage from './pages/AproposPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/annonce/:id" element={<AnnonceDetail />} />
        <Route path="/message/:annonceId" element={<MessagePage />} />
        <Route path="/messages" element={<MessagesListPage />} />
        <Route path="/logements" element={<LogementsPage />} />
        <Route path="/colocation" element={<ColocationPage />} />
        <Route path="/ajouter-annonce" element={<AjouterAnnoncePage />} />
        <Route path="/profil" element={<ProfilPage />} />
        <Route path="/favoris" element={<FavorisPage />} />
        <Route path="/vues" element={<VuesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/a-propos" element={<AproposPage />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminPage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}