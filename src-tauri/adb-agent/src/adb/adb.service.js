"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execAdb = execAdb;
var child_process_1 = require("child_process");
function execAdb(cmd) {
    return new Promise(function (resolve, reject) {
        (0, child_process_1.exec)(cmd, function (err, stdout, stderr) {
            if (err)
                reject(stderr || err.message);
            else
                resolve(stdout);
        });
    });
}
