const express = require("express");
const router = express.Router();
const {
  getFirstPart,
  getFinanceDashboard,
  getCompanyProjectDetail,
  getTeamMembersDashboard,
} = require("../controllers/dashboardControllers");

//to get first part of the dashbaord
router.get("/first/:companyId", getFirstPart);

//Finance part
router.get("/financialsummary/:companyId", getFinanceDashboard);

//Projects detail
router.get("/projectstatus/:companyId", getCompanyProjectDetail);

//get team members
router.get("/teammembers/:companyId", getTeamMembersDashboard);

module.exports = router;
