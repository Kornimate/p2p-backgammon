import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import GameLayout from "../layouts/GameLayout";
import GameHomePage from "../pages/GameHomePage";
import LobbyPage from "../pages/LobbyPage";
import MatchPage from "../pages/MatchPage";
import HomePage from "../pages/HomePage";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/auth/" element={<AuthLayout />}>
                    <Route path="login" element={<SignInPage />} />
                    <Route path="register" element={<SignUpPage />} />
                </Route>
                <Route path="/game/" element={<GameLayout />}>
                    <Route index element={<GameHomePage />} />
                    <Route path="lobby" element={<LobbyPage />} />
                    <Route path="match" element={<MatchPage />} />
                </Route>
                <Route path="/" element={<HomePage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes;