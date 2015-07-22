/**
 * Created by linhehe on 15/7/1.
 */

// 班级模型

var mongoose = require('mongoose');

var ClassSchema = new mongoose.Schema(
    {
        //_stu: { type: Number, ref: 'Student' },
        ///_id: Number,
        name: String,
        students: [{type: mongoose.Schema.Types.ObjectId, ref: 'Student'}],
        teachers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'}],
        messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}]
    });


ClassSchema.pre('remove', function(next){
    //
    this.students.forEach(function(c){
        mongoose.model('Student')
            .findById(c.id, function(res){
                res.remove();
            });
    })
    next();
});

mongoose.model('Class', ClassSchema);