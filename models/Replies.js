/**
 * Created by linhehe on 15/7/6.
 */
var mongoose = require('mongoose');

var ReplySchema = new mongoose.Schema(
    {
        answerer: String, // 回复者
        content: String // 回复的内容
    }
);

mongoose.model('Reply', ReplySchema);