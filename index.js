const fs = require("fs");
const config = require('./config');
var login = require("facebook-chat-api");
let name;
let points = JSON.parse(fs.readFileSync("./pp/scores.json", "utf8"));

login({
    email: config.account.email,
    password: config.account.password,
}, function callback(err, api) {

    fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
    api.listen(function (err, event) {
        if (err) return err.error;
        if (!points[event.senderID]) points[event.senderID] = {
            points: 0,
            level: 0
        };
        let userData = points[event.senderID];
        let userPoints = points[event.SenderID] ? points[event.SenderID].points : 0;
        let userLevel = points[event.SenderID] ? points[event.SenderID].level : 0;
        let curLevel = Math.floor(0.1 * Math.sqrt(userData.points));
        userData.points++;
        if (curLevel > userData.level) {
            userData.level = curLevel;
            api.sendMessage({
                body: name + ` đã tăng level lên *${curLevel}*!`,
                mentions: [{
                    tag: name,
                    id: event.senderID,
                }],
            }, event.threadID);
        }

        if (event.body === "$level") {
            api.sendMessage({
                body: name + `\n- *LEVEL* : ${userData.level}\n- *ĐIỂM* : ${userData.points}`,
                mentions: [{
                    tag: name,
                    id: event.senderID,
                }],
            }, event.threadID);
        }
        fs.writeFile("./pp/scores.json", JSON.stringify(points), (err) => {
            if (err) console.error(err);
        });

    });

});