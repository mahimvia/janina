module.exports.config = {
    name: "accept",
    version: "1.0.0",
    hasPermssion: 2, // Bot admin only
    credits: "mahimvia",
    description: "Accept all pending friend requests for the bot account.",
    commandCategory: "System",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    try {
        // facebook-chat-api exposes getUserID and acceptFriendRequest
        // Get all pending requests (API method may vary, here is a common pattern)
        api.getFriendsList((err, data) => {
            if (err || !data) {
                return api.sendMessage("❌ Could not retrieve friends list.", event.threadID, event.messageID);
            }
            // Find pending requests
            const pending = data.filter(user => user.isFriend === false && user.isMessengerUser === true);
            if (!pending.length) {
                return api.sendMessage("✅ No pending friend requests found.", event.threadID, event.messageID);
            }
            let accepted = 0;
            pending.forEach(user => {
                api.acceptFriendRequest(user.userID, (err) => {
                    if (!err) accepted++;
                });
            });
            setTimeout(() => {
                api.sendMessage(`✅ Accepted ${accepted} friend request(s)!`, event.threadID, event.messageID);
            }, 2000);
        });
    } catch (error) {
        api.sendMessage("❌ Unable to accept friend requests. Make sure the bot has the required permissions.", event.threadID, event.messageID);
    }
};