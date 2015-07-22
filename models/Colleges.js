/**
 * Created by linhehe on 15/6/26.
 */

// 学院模型

var mongoose = require('mongoose');

var CollegeSchema = mongoose.Schema({
    CollegesName: String,
    CollegeId: Number,
    collegeLogo: String
    //
    //abstract: String, // 学院简介
    //affiche: String, // 学院公告
    //classes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Class'}]
});

mongoose.model('College', CollegeSchema);