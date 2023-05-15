const path = require("path");
const { execSync } = require("child_process");
const { return404, return500 } = require("../middlewares/error");
const { green, blue } = require("kolorist");

const TASKLIST = require(path.resolve(__dirname, "../../tasks.json"));

const executeTasks = (tasks) => {
  tasks.forEach((task) => {
    const now = new Date().toLocaleString()
    const taskInfo = `[${now}] ${blue("[TASK]")} ${task.name}`;
    console.log(taskInfo);
    task.steps.forEach((step) => {
      const now = new Date().toLocaleString()
      const stepInfo = `[${now}] ${green("[STEP]")} ${step.command}`;
      console.log(stepInfo);
      execSync(step.command, (error, stdout, stderr) => {
        if (error) {
          console.error(error);
        }
        if (stderr) {
          console.error(stderr);
        }
        if (stdout) {
          console.log(stdout);
        }
      });
    });
  });
};

const handleRequestTasks = (req, res) => {
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

const handleWebhook = (req, res) => {
  const success = handleRequestTasks(req, res);
  if (!success) {
    return return500(res);
  }
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({ success: true }));
};

module.exports = {
  handleWebhook,
};
