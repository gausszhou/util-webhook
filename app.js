// 引入Express框架
const express = require("express");
// 引入body-parser模块
const bodyParser = require("body-parser");
//
const { execSync } = require("child_process");
//
const TASKLIST = require("./tasks.json");
const PROTOCOL = "http";
const PORT = 10086;
// 使用框架创建web服务器
const app = express();

// 配置body-parser模块
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/webhook", (req, res) => {
  const isValid = checkRequest(req, res);
  if (!isValid) return;
  // post request
  handleRequestEnd(req, res);
});

const return400 = (res) => {
  res.statusCode = 400;
  res.end("Unsupported method");
};

const return404 = (res) => {
  res.statusCode = 404;
  res.end("Not found");
};

const return500 = (res) => {
  res.statusCode = 500;
  res.end("Server error");
};

const checkRequest = (req, res) => {
  if (req.method !== "GET") {
    return return400(res);
  }
  if (!req.query.token) return return400(res);
  return true;
};

const executeTasks = (tasks) => {
  tasks.forEach((task) => {
    task.steps.forEach((step) => {
      console.log(step);
      execSync(step.command, (error, stdout, stderr) => {
        if (error) {
          throw error;
        }
        if (stdout) {
          console.log(stdout);
        }
        if (stderr) {
          console.error(stderr);
        }
      });
    });
  });
};

const handleRequestTasks = (req, res) => {
  console.log(req.query);
  const { token } = req.query;
  const tasks = TASKLIST.filter((task) => task.token === token);
  if (!tasks.length) {
    return return404(res);
  }
  try {
    executeTasks(tasks);
  } catch (err) {
    console.error(err);
    return false;
  }
  return true;
};

const handleRequestEnd = (req, res) => {
  const success = handleRequestTasks(req, res);
  if (!success) {
    return return500(res);
  }
  // res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({ success: true }));
};

// 程序监听3000端口
app.listen(PORT, () => {
  const IPLIST = getNetworkIp();
  IPLIST.forEach((ip) => {
    console.log(`Starting server at ${PROTOCOL}://${ip}:${PORT}`);
  });
});

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
