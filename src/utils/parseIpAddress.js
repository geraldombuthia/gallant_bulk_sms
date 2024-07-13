/**
 * Parses an Ip address, extracting the ipv4 address from an ipv6 mapped address
 * 
 * @param {string} ipAddress - The ip address to be parsed
 * @returns {string} - The parsed ip address without the ipv6 mapping
 * @example 
 * // returns "192.168.1.1"
 * parseIpAddress("::ffff:192.168.1.1")
 * 
 * @example
 * // returns "192.168.1.1"
 * parseIpAddress("192.168.1.1")
 */
export function parseIpAddress(ipAddress) {
    // check if Ip adress passed is ipv6 mapped to ipv4
    if (ipAddress.includes("::ffff:")) {
        return ipAddress.slice(7); // Extracts ipv4 adress from ::ffff:192.168.100.4
    }
    
    return ipAddress; // return ipv4 adress as is
    // May require a more robust implementation to handle other cases currently unknown
}
