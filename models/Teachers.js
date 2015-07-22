/**
 * Created by linhehe on 15/6/24.
 */

// 教师模型

var mongoose = require('mongoose');

var TeacherSchema = mongoose.Schema(
    {
        name: String,
        //abstract: String, // 简介
        TeacherPhone: String, // 电话
        //QQ: String,
        //email: String,//邮箱
        //address: String, // 办公地址

        password: String,//密码
        messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
        jobNumber: String //工号
    });

mongoose.model('Teacher', TeacherSchema);