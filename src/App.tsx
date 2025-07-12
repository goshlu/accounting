import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { MobileLayout } from "./components/layout/MobileLayout";
import { HomePage } from "./pages/home/HomePage";
import { AddRecordPage } from "./pages/add-record/AddRecordPage";
import { AnalyticsPage } from "./pages/analytics/AnalyticsPage";
import { BillsPage } from "./pages/bills/BillsPage";
import { AssetsPage } from "./pages/assets/AssetsPage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { useAppStore } from "./store";
import "./App.css";
import { AboutApp } from "./pages/profile/AboutApp";
import { ExportData } from "./pages/profile/ExportData";

function App() {
  const { isDarkMode } = useAppStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <Router>
      <div className={`App ${isDarkMode ? "dark" : ""}`}>
        <Routes>
          <Route path="/" element={<MobileLayout />}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home" element={<HomePage />} />
            <Route path="add-record" element={<AddRecordPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="bills" element={<BillsPage />} />
            <Route path="assets" element={<AssetsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="AboutApp" element={<AboutApp />} />
            <Route path="export-data" element={<ExportData accounts={[]} transactions={[]} categories={[]} />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
