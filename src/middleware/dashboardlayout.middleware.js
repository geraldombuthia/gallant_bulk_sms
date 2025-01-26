module.exports = (req, res, next) => {
    res.locals.layout = "dashboard"; // SPecify layout
    res.locals.pageTitle = req.path.split("/").pop() || "overview";
    next();
};