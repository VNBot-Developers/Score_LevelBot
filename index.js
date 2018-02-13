const fs = require("fs");
const login = require("facebook-chat-api");
let scores = JSON.parse(fs.readFileSync("./pp/scores.json", "utf8"));

login({
    email: 'YOUR_EMAIL',
    password: 'YOUR_PASSWORD',
}, function callback(err, api) {
    if (err) return err.error;
    fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
    api.listen(function (err, event) {
        if (!scores[event.senderID]) scores[event.senderID] = {
            scores: 0,
            level: 0
        };
        let uData = scores[event.senderID];
        let uPoints = scores[event.SenderID] ? scores[event.SenderID].scores : 0;
        let uLevel = scores[event.SenderID] ? scores[event.SenderID].level : 0;
        let curLevel = Math.floor(0.1 * Math.sqrt(uData.scores));
        uData.scores++;
        if (curLevel > uData.level) {
            uData.level = curLevel;
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
                body: name + `\n- *LEVEL* : ${uData.level}\n- *ĐIỂM* : ${uData.scores}`,
                mentions: [{
                    tag: name,
                    id: event.senderID,
                }],
            }, event.threadID);
        }
        fs.writeFile("./pp/scores.json", JSON.stringify(scores), (err) => {
            if (err) console.error(err);
        });
    });
});