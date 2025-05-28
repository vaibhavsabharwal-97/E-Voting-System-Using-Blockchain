import { Route, Navigate } from "react-router-dom";
import Dashboard from "../Pages/admin/Dashboard/ViewDashboard.jsx";
import Users from "../Pages/admin/Users";
import AddUser from "../Pages/admin/User/AddUser.jsx";
import EditUser from "../Pages/admin/User/EditUser.jsx";
import ViewUser from "../Pages/admin/User/ViewUser.jsx";
import Elections from "../Pages/admin/Elections";
import AddElection from "../Pages/admin/Election/AddElection.jsx";
import ViewElection from "../Pages/admin/Election/ViewElection.jsx";
import Candidates from "../Pages/admin/Candidates";
import AddCandidate from "../Pages/admin/Candidate/AddCandidate.jsx";
import ViewCandidate from "../Pages/admin/Candidate/ViewCandidate.jsx";
import Candidate from "../Pages/admin/Candidate.jsx";
import EditCandidate from "../Pages/admin/Candidate/EditCandidate.jsx";
import ViewResult from "../Pages/admin/Result/ViewResult.jsx";
import ViewElectionResult from "../Pages/admin/Result/ViewElectionResult.jsx";
import AdminLogout from "../Pages/admin/Logout/AdminLogout.jsx";
import EditPhase from "../Pages/admin/Phase/EditPhase.jsx";
import ViewPhase from "../Pages/admin/Phase/ViewPhase.jsx";
import PageNotFound from "../Pages/admin/PageNotFound";
import MainLayout from "../Components/Layout/MainLayout";

export const adminRoutes = (
  <>
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="dashboard" element={<Dashboard />} />
      
      <Route path="users">
        <Route index element={<Users />} />
        <Route path="add" element={<AddUser />} />
        <Route path=":id/edit" element={<EditUser />} />
        <Route path=":id" element={<ViewUser />} />
      </Route>
      
      <Route path="elections">
        <Route index element={<Elections />} />
        <Route path="add" element={<AddElection />} />
        <Route path=":id/edit" element={<EditPhase />} />
        <Route path=":id" element={<ViewElection />} />
      </Route>
      
      <Route path="candidates">
        <Route index element={<Candidates />} />
        <Route path="add" element={<AddCandidate />} />
        <Route path=":id/edit" element={<EditCandidate />} />
        <Route path=":id" element={<Candidate />} />
      </Route>
      
      <Route path="phase">
        <Route index element={<Elections />} />
        <Route path=":id" element={<EditPhase />} />
      </Route>
      
      <Route path="result" element={<ViewResult />} />
      <Route path="result/:id" element={<ViewElectionResult />} />
      <Route path="logout" element={<AdminLogout />} />
      
      <Route path="*" element={<PageNotFound />} />
    </Route>
  </>
);
