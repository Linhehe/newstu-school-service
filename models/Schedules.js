/**
 * Created by linhehe on 15/7/2.
 */
// 功课表
var mongoose = require('mongoose');

var ScheduleSchema = new mongoose.Schema(
    {
        //
        name: String,
        cls: String
    });

mongoose.model('Schedule', ScheduleSchema);