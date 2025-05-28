import { Router } from "express";
import {
  register,
  login,
  users,
  elections,
  candidates,
  phase,
  votingMail,
  a,
  uploadUsers,
  downloadUserTemplate,
  downloadCandidateTemplate,
  uploadCandidates
} from "../Controller/AuthController.js";

const router = Router();

router.post("/register", register.validator, register.controller);
router.post("/upload-users", uploadUsers.controller);
router.get("/download-template", downloadUserTemplate.controller);
router.get("/download-candidate-template", downloadCandidateTemplate.controller);
router.post("/upload-candidates", uploadCandidates.controller);

// Election routes - order matters
router.post("/election/register", elections.register);
router.get("/elections", elections.controller);
router.get("/election/delete/:id", elections.delete);
router.get("/election/:id", elections.getElection);
router.post("/phase/edit/:id", phase.controller);
router.get("/voting/elections", elections.voting);
router.get("/result/elections", elections.result);

// Candidate routes - order matters
router.post("/login", login.validator, login.controller);
router.post("/candidate/register", candidates.register);
router.get("/candidates", candidates.getCandidates);
router.get("/candidate/delete/:id", candidates.delete);
router.post("/candidate/edit/:id", candidates.edit);
router.get("/candidate/id/:id", candidates.getCandidateById);
router.get("/candidate/:username", candidates.getCandidate);

// User routes - order matters
router.get("/users", users.getUsers);
router.get("/user/delete/:id", users.delete);
router.get("/user/username/:id", users.getUserByName);
router.post("/user/edit/:id", users.edit);
router.get("/user/:id", users.getUser);

router.post("/op", a.sc);
router.post("/votingEmail", votingMail.send);

export default router;
