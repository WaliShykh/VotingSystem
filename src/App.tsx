import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import ForgotPasswordForm from "./pages/AuthPages/ForgetPassword";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import MyElections from "./pages/MyElections";
import ElectionResults from "./pages/ElectionResults";
import ViewResults from "./pages/ViewResults";
import Home from "./pages/Dashboard/Home";
import CastVote from "./pages/CastVote";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/myElections" element={<MyElections />} />
            <Route path="/electionResults" element={<ElectionResults />} />
            <Route path="/viewResults" element={<ViewResults />} />
            <Route path="/castVote" element={<CastVote />} />
          </Route>

          <Route path="/signin" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
