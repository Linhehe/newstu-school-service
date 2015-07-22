/**
 * Created by linhehe on 15/7/1.
 */

// 专业模型

var mongoose = require('mongoose');

var ProfessionSchema = new mongoose.Schema(
    {
        name: String
    });

mongoose.model('Profession', ProfessionSchema);
