/**
 * Created by linhehe on 15/7/6.
 */

// 信息模型

var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema(
    {
        title: String, // 标题
        content: String, // 内容
        time: String, // 信息发送时间

        ProfessionId: Number,
        Clazz: Number,
        CollegeName: String,

        upvote: String, // 学生查看次数
        replies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Reply'}] // 学生回复信息
    }
);

mongoose.model('Message', MessageSchema);