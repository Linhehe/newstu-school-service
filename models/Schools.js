/**
 * Created by ff on 15/7/10.
 */
var mongoose = require('mongoose');

var SchoolSchema = new mongoose.Schema(
    {
        //_stu: { type: Number, ref: 'Student' },
        ///_id: Number,
        name: String,
        colleges: [{type: mongoose.Schema.Types.ObjectId, ref: 'College'}]
    });

mongoose.model('School', SchoolSchema);