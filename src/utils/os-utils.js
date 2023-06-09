const os = require("os");
function getNetworkIp() {
  let hosts = []; // 打开的host
  try {
    // 获得网络接口列表
    let network = os.networkInterfaces();
    for (let dev in network) {
      let iface = network[dev];
      for (let i = 0; i < iface.length; i++) {
        let alias = iface[i];
        if (alias.family === "IPv4" && alias.address !== "127.0.0.1") {
          hosts.push(alias.address);
        }
      }
    }
  } catch (e) {
    hosts.push("localhost");
  }
  return hosts;
}

module.exports = {
  getNetworkIp
}