const DashboardService = require("../service/dashboard.service");

class DashboardController {
    constructor() {
        this.dashboardService = new DashboardService();
        this.renderOverview = this.renderOverview.bind(this);
    }

    async renderOverview(req, res) {

        try {
            const overviewData = await this.dashboardService.getOverviewData(1); 
            // @TODO: Replace 1 with userId
            const notifications = [
                {
                    message: "Low balance alert! Recharge now.",
                    createdAt: new Date("2024-01-25T10:30:00Z"),
                },
                {
                    message: "New pricing updates available",
                    createdAt: new Date("2024-01-24T15:45:00Z"),
                },
            ];
            const activities = [
                {
                    type: "SMS Sent",
                    recipient: "+1234567890",
                    status: "delivered",
                    createdAt: new Date("2024-01-25T10:30:00Z"),
                },
                {
                    type: "Account Recharge",
                    recipient: "$50.00",
                    status: "success",
                    createdAt: new Date("2024-01-24T15:45:00Z"),
                },
                {
                    type: "SMS Sent",
                    recipient: "+0987654321",
                    status: "failed",
                    createdAt: new Date("2024-01-23T12:15:00Z"),
                },
            ];

            // Helper function to format time ago
            const formatTimeAgo = (date) => {
                const now = new Date();
                const diffInMinutes = Math.floor((now - new Date(date)) / (1000 * 60));

                if (diffInMinutes < 60) {
                    return `${diffInMinutes} mins ago`;
                } else if (diffInMinutes < 1440) {
                    const hours = Math.floor(diffInMinutes / 60);
                    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
                } else {
                    const days = Math.floor(diffInMinutes / 1440);
                    return `${days} day${days > 1 ? "s" : ""} ago`;
                }
            };
            return res.render("partials/pages/overview", {
                message: "Overview data fetched successfully",
                page: "overview",
                user: req.user,
                overviewData,
                notifications,
                activities,
                formatTimeAgo,
            });
        } catch (error) {
            console.log("Failed to get Overview Data", {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString(),
            });
            req.flash("error", "Failed to get Overview Data");
            // return res.redirect("/dashboard");
            return;
        }
    }
}

module.exports = new DashboardController();
