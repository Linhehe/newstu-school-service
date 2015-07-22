/**
 * Created by linhehe on 15/6/24.
 */

// 学生模型

var mongoose = require('mongoose');

var StudentSchema = new mongoose.Schema(
    {
        name: String,
        sex: String,
        subject: String, // 科目(文/理)
        professional: String, // 专业
        class: String, // 班级
        //teacher: String, // 班主任
        dorm: String, // 宿舍
        bankCard: String, //银行卡
        isReports: Boolean, // 是否报道
        isPay: Boolean, // 缴费状态
        usertype:String,//登陆类型
        registerPhone: String, // 注册手机号
        ID_card: String, // 身份证号码
        password: String, // 密码

        department:String,//院系
        major:String,//专业
        tuition:String,//学费
        quarterage:String,//住宿费
        medicare:String,//医疗保险

        teachers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'}],
        photo: String, // 头像
        hometown: String, // 籍贯
        credentials: String, // 准考证
        student_ID: String, // 学号
        qq: String, // QQ
        hobby: String // 爱好
    });

StudentSchema.pre('remove', function(next){
    //
    this.teachers.forEach(function(c){
        mongoose.model('Teacher')
            .findById(c.id, function(res){
                res.remove();
            });
    })
    next();
});

mongoose.model('Student', StudentSchema);