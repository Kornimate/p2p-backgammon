import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import GameLayout from "../layouts/GameLayout";
import GameHomePage from "../pages/GameHomePage";
import LobbyPage from "../pages/LobbyPage";
import GamePage from "../pages/GamePage";
import HomePage from "../pages/HomePage";
import NotFound from "../pages/NotFound";
import StatsPage from "../pages/StatsPage";
import { AuthProvider } from "../hooks/AuthProvider";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/auth/" element={<AuthLayout />}>
                        <Route path="login" element={<SignInPage />} />
                        <Route path="register" element={<SignUpPage />} />
                    </Route>
                    <Route path="/game/" element={
                        <ProtectedRoute>
                            <GameLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<GameHomePage />} />
                        <Route path="lobby" element={<LobbyPage />} />
                        <Route path="match" element={<GamePage />} />
                        <Route path="stats" element={<StatsPage />} />
                    </Route>
                    <Route path="/" element={<HomePage />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default AppRoutes;