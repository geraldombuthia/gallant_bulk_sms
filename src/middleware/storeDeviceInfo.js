const DeviceAccess = require("../models/DeviceAccess");

const logDeviceAccess = async(req, res, next) => {
    try {
        const deviceInfo = {
            ip_address:req?.ipAddress,
            browser_name: req?.userAgent?.browser?.name,
            browser_version: req?.userAgent?.browser?.version,
            os_name: req?.userAgent?.os?.name,
            os_version: req?.userAgent?.os?.version,
            device_vendor: req?.userAgent?.device?.vendor,
            device_model: req?.userAgent?.deice?.model,
            device_type: req?.userAgent?.device?.type,
            cpu_arch: req?.userAgent?.cpu?.architecture
        };

        console.log("Attempting to create DeviceAccess with:", deviceInfo);
    
        const newAccess = await DeviceAccess.create(deviceInfo, {returning: true});
        console.log("New Access created:", newAccess.toJSON());
        
        next();
    } catch (error) {
        console.error("Error logging device access:", error);
        next(error);
    }
};

module.exports = logDeviceAccess;

