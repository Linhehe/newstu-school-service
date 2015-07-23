var express = require('express');
var router = express.Router();

//声明数据库
var mongoose = require('mongoose');
//声明数据库链接
//mongoose.connect('mongodb://10.211.55.3/StudentTestDB');
mongoose.connect('mongodb://120.24.208.184/newStudentDB');

//声明调用的模型
//require('../models/Classes');
//require('../models/Students');
//require('../models/Teachers');
//require('../models/Colleges');
//require('../models/Schools');
require('../models/Messages');

//在数据库中开辟一块区域用于存储模型Myclass的值
//var Class = mongoose.model('Class');
//var Student = mongoose.model('Student');
//var Teacher = mongoose.model('Teacher');
//var College = mongoose.model('College');
//var School = mongoose.model('School');
var Message = mongoose.model('Message');
//
//var message = new Message({title:'新生开学通知', content:'热烈欢迎新生入学', time:'2015/07/19 09:30', ProfessionId:'166', Clazz:'1'});
//
//message.save();

var mysql = require('mysql');

var connection = mysql.createConnection(
    {
        host: '120.24.208.184',
        user: 'huyugui',
        password: '#$%hyg',
        database: 'NewStudentTestDB'
    }
    //{
    //  host: '10.211.55.3',
    //  user: 'linhehe',
    //  password: 'laisiqi',
    //  database: 'newstudenttestdb'
    //}
);
connection.connect(function(err){
    console.log('connect: '+err);
});

var AV = require('avoscloud-sdk').AV;
AV.initialize("mu443zud8ylc3jcce2z1r6gmxks1g3lpflwp1awklu1xr91m", "ru4c00901eb62p0k8qea7xvxdtuqs3qfrm7zn9ztz41edjml");

var JPush = require("jpush-sdk/lib/JPush/JPush.js");
var client = JPush.buildClient('75c010b8d8144cb4bd41696a', 'afcff2cd7855cba002f57693');
//easy push
//client.push().setPlatform(JPush.ALL)
//    .setAudience(JPush.ALL)
//    .setNotification('凯鹏我爱你', JPush.ios('ios alert', 'happy.caf', 5))
//    .send(function(err, res) {
//        if (err) {
//            console.log(err.message);
//        } else {
//            console.log('Sendno: ' + res.sendno);
//            console.log('Msg_id: ' + res.msg_id);
//        }
//    });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 短信验证(发送)
router.get('/code', function(req,res,next){
    console.log('phone:'+req.query.phone);
    AV.Cloud.requestSmsCode({
        mobilePhoneNumber: req.query.phone,
        name: '短信验证',
        op: '手机验证',
        ttl: 5
    }).then(function(){
        //发送成功
        console.log('success');
        res.send('success');
    }, function(err){
        //发送失败
        console.log('error');
        res.send('error');
    });
});

// 短信验证(检测验证码)
router.post('/codecheck', function(req,res,next){
    console.log('hu='+req.body.codes);
    AV.Cloud.verifySmsCode(req.body.codes, req.body.phone).then(function(){
        //验证成功
        console.log('验证成功');
        res.send('success');
    }, function(err){
        //验证失败
        console.log('验证失败'+req.body.codes);
        res.send('error');
    });
});

// 学生注册
router.post('/sessions', function(req,res,next){
    connection.query('SELECT * FROM Student WHERE IdCode = ?', [req.body.ID_card], function(err,rows){
        //
        if(err){
            next(err);
        } else{
            //
            if(rows[0]){
                if(rows[0].Phone){
                    console.log('phone11:'+rows[0].Phone);
                    res.send('phone');
                } else{
                    connection.query('UPDATE Student SET Phone = ? WHERE IdCode = ?', [req.body.registerPhone, req.body.ID_card], function(err,rows){
                        if(err){
                            next(err);
                        } else{
                            console.log(rows);
                            res.send('success');
                        }
                    });
                    connection.query('UPDATE Student SET Password = ? WHERE IdCode = ?', [req.body.password, req.body.ID_card], function(err,rows){
                        if(err){
                            next(err);
                        } else{
                            console.log(rows);
                            //res.send('success');
                        }
                    });
                }
            } else{
                res.send('idcard');
            }
        }
    });
});

//师生登陆
router.get('/login', function(req,res,next){
    if(req.query.usertype == '学生')
    {
        connection.query('SELECT * FROM Student WHERE Phone = ? and Password = ?', [req.query.registerPhone, req.query.password], function(err,rows){
           //
            if(err){
                next(err);
            } else{
                //
                if(rows[0] == undefined){
                    console.log(rows[0]);
                    res.send('error');
                }
                else{
                    if(rows[0].IsLogin[0] == 0){
                        //
                        console.log('rows[0].IsLogin[0] = '+rows[0].IsLogin[0]);
                        res.json(rows[0]);
                    } else{
                        //
                        console.log('rows[0].IsLogin[0] = '+rows[0].IsLogin[0]);
                        res.send('haveLogin');
                    }
                }
            }
        });
        //Student
        //    .findOne({registerPhone:req.query.registerPhone,password:req.query.password}, function(err,doc){
        //        if(err){
        //            next(err);
        //        } else{
        //            res.json(doc);
        //        }
        //    });
    }
    if(req.query.usertype == '教师')
    {
        console.log(req.query.registerPhone+","+req.query.password);
        connection.query('SELECT * FROM Clazz WHERE TeacherPhone = ? and Password = ?', [req.query.registerPhone, req.query.password], function(err,rows){
           //
            if(err){
                next(err);
            } else{
                //
                //console.log('rows:'+rows[0]);
                if(rows[0] == undefined){
                    res.send('error');
                    console.log(rows[0]);
                }
                else{
                    if(rows[0].IsLogin[0] == 0){
                        //
                        console.log('rows[0].IsLogin[0] = '+rows[0].IsLogin[0]);
                        res.json(rows[0]);
                    } else{
                        //
                        console.log('rows[0].IsLogin[0] = '+rows[0].IsLogin[0]);
                        res.send('haveLogin');
                    }
                }
            }
        });
        //Teacher
        //    .findOne({jobNumber:req.query.registerPhone,password:req.query.password}, function(err,doc){
        //        if(err){
        //            (err)(next)}
        //        else{
        //            res.json(doc);
        //        }
        //    });
    }
});

router.post('/userLogin', function(req,res,next){
    //
    if(req.body.user == 'student'){
        //
        connection.query('UPDATE Student SET IsLogin = ? WHERE Phone = ?', [1, req.body.phone], function(err,rows){
            if(err){
                next(err);
            } else{
                res.send('success');
                console.log('success');
            }
        });
    } else{
        //
        connection.query('UPDATE Clazz SET IsLogin = ? WHERE TeacherPhone = ?', [1, req.body.phone], function(err,rows){
            if(err){
                next(err);
            } else{
                res.send('success');
                console.log('success');
            }
        });
    }
});

router.post('/userLogout', function(req,res,next){
    //
    if(req.body.user == 'student'){
        //
        connection.query('UPDATE Student SET IsLogin = ? WHERE Phone = ?', [0, req.body.phone], function(err,rows){
            if(err){
                next(err);
            } else{
                res.send('success');
                console.log('success');
            }
        });
    } else{
        //
        connection.query('UPDATE Clazz SET IsLogin = ? WHERE TeacherPhone = ?', [0, req.body.phone], function(err,rows){
            if(err){
                next(err);
            } else{
                res.send('success');
                console.log('success');
            }
        });
    }
});

// 致新生的一封信
router.get('/letter', function(req,res,next){
    //
    var letter = {title: '广东科学技术职业学院新生报到温馨提示', content: '<p>我校2014年普通高考招生录取工作已基本结束，新生报到工作即将开始，现将有关事项提示如下：</p><p>一、考生可通过我校招生信息网录取结果查询系统（http://zsb.gdit.edu.cn/lqcx/index.php）查询录取结果，已录取考生的《录取通知书》、《新生入学须知》等相关材料已于8月27日前全部寄出，现未收到录取通知书的新生可登陆招生信息网查询邮单号（http://zsb.gdit.edu.cn/）,并向邮政EMS咨询投递情况。</p> <p>请注意：快递有两份，一份是《录取通知书》、《新生入学须知》等相关材料；一份是学校赠送给新生的电话卡，请放心使用。新生如未收到上述两份材料，可咨询邮政EMS快递公司或学校招生办公室。</p> <p> 二、2014级新生报到日期为9月10日。请新生们不要提前来校报到，如无法及时报到，请根据录取通知书上的录取院系提前请假，过期未报到者将以自动放弃处理并注销其学籍。各院系联系电话如下：</p> <p>三、新生收到《新生入学须知》等相关资料后，请仔细阅读各项内容，并提前办理好各项报到需提交的材料和手续。各业务部门联系电话如下：</p> <p>四、非广州户籍新生如需转户籍至广州，请携带本人户口薄、身份证和《录取通知书》至本人户籍所在地派出所办理户口迁出手续，报到时请携带相关迁移材料到校保卫处办理迁入手续。不迁入户籍的新生无需办理上述手续。以上情况未尽详细，可咨询学校保卫处：0756-7796210</p> <p>请注意：请新生考虑好是否迁入户籍，报到后将不再办理户籍迁入手续；迁入户籍为广州学生临时户口，毕业时如无企业接受户籍，将自动取消广州户籍，并迁回原户籍所在地。</p> <p>五、入学前收到《入伍通知书》应征入伍的新生，需办理保留入学资格手续。具体程序是由学生本人或家长持《录取通知书》、《入伍通知书》、学生身份证（户口薄）、高中毕业证，到入伍地县（市、区）级征兵办填写《应征入伍普通高等学校录取新生保留入学资格申请表》，由县级征兵办审核盖章后将此表和入伍通知书复印件以公函形式发送到我校招生办公室，学校将办理相关手续，并将申请表寄送回相关县级征兵办。</p> <p>请新生提醒县级征兵办公室及时向我校寄送有关材料，最晚日期不超过新生报到日，过时将视为主动放弃入学资格。学生可在退役当年新生入学期间，持《退伍证》和我校《录取通知书》，到我校办理入学事宜。</p> <p>六、新生档案必须封装完整后由新生报到时带来上交班主任。当地教育局要求寄送的，可寄往学校招生办公室（建议采用EMS），新生报到后到招生办领取本人档案。</p> <p>地址：广东省珠海市金湾区珠海大道南广东科学技术职业学院招生办公室（519090）<p>卓老师收</p></p> <p>电话：0756-7796111</p> <div> <p>招生办公室</p> <p>2014年8月29日</p> </div>'}
    res.json(letter);
});

//获取学生个人信息
router.get('/stuone',function(req,res,next){
    console.log(req.query.registerPhone);
    connection.query('SELECT * FROM Student WHERE Phone = ?', [req.query.registerPhone], function(err,rows){
        //
        if(err){
            next(err);
        } else{
            console.log(rows[0]);
            res.json(rows[0]);
        }
    });
    //Student
    //    .findOne({registerPhone:req.query.registerPhone},function(err,doc){
    //        if(err){(err)(next)}
    //        else{
    //            res.json(doc);
    //        }
    //    })
});
router.get('/stuoneArea', function(req,res,next){
    //
    connection.query('SELECT AreaName FROM Area WHERE AreaId = ?', [req.query.AreaId], function(err,rows){
        //
        if(err){
            next(err);
        } else{
            res.json(rows[0]);
        }
    });
});
router.get('/stuoneSex', function(req,res,next){
    //
    connection.query('SELECT Sex FROM Student WHERE Phone = ?', [req.query.user], function(err,rows){
        //
        if(err){
            next(err);
        } else{
            //console.log('rows[0].Sex[0] = '+rows[0].Sex[0]);
            res.json(rows[0].Sex[0]);
        }
    });
});
router.get('/studentIsReport', function(req,res,next){
    //
    connection.query('SELECT IsRegister FROM Student WHERE Phone = ?', [req.query.user], function(err,rows){
        //
        if(err){
            next(err);
        } else{
            console.log('rows[0].Sex[0] = '+rows[0].IsRegister[0]);
            res.json(rows[0].IsRegister[0]);
        }
    });
});

//获取老师个人信息
router.get('/teaone',function(req,res,next){
    connection.query('SELECT * FROM Clazz WHERE TeacherPhone = ?', [req.query.TeacherPhone], function(err,rows){
       //
        if(err){
            next(err);
        }else{
            console.log(rows[0]);
            res.json(rows[0]);
        }
    });
    //Teacher
    //    .findOne({job:req.query.job},function(err,doc){
    //        if(err){(err)(next)}
    //        else{
    //            res.json(doc);
    //        }
    //    })
});
router.get('/profession', function(req,res,next){
   //
    connection.query('SELECT ProfessionName FROM Profession WHERE ProfessionId = ?', [req.query.ProfessionId], function(err,rows){
       //
        if(err){
            next(err);
        } else{
            res.json(rows[0]);
        }
    });
});
//教师个人信息的修改
router.get('/teacherInfors',function(req,res,next){
    //Teacher
    //    . findOneAndUpdate({job:req.query.job},{mobilePhone: req.query.phone, QQ: req.query.QQ, email: req.query.email, address: req.query.address, abstract: req.query.abstract},
    //    function(err,doc){
    //        if(err!=null){next(err);}
    //        else{
    //            res.json(doc);
    //        }
    //    })
})
//教师个人信息密码的修改
//教师个人信息的修改
router.get('/ChangePassword',function(req,res,next){
    connection.query('SELECT Password From Clazz WHERE TeacherPhone = ?', [req.query.user], function(err, rows){
        //
        if(err){
            next(err);
        } else{
            console.log(rows[0].Password);
            if(rows[0].Password == req.query.oldPassword){
                console.log('true');
                connection.query('UPDATE Clazz SET Password = ? WHERE TeacherPhone = ?', [req.query.newPassword, req.query.user], function(err, rows){
                    //
                    if(err){
                        next(err);
                    } else{
                        console.log(rows);
                        res.send('true');
                    }
                });
            } else{
                res.send('false');
            }
        }
    });
    //Teacher
    //    . findOneAndUpdate({job:req.query.job,password:req.query.lodpassword},{password:req.query.entnewpassword},
    //    function(err,doc){
    //        if(err!=null){next(err);}
    //        else{
    //            res.json(doc);
    //        }
    //    })
});

//学生缴费查询
router.get('/check',function(req,res,next){
    connection.query('SELECT IdCode FROM Student WHERE Phone = ?', [req.query.user], function(err, rows){
        if(err){
            next(err);
        } else{
            console.log('idcode='+rows[0].IdCode);
            if(rows[0].IdCode == req.query.select){
                res.send('true');
            } else{
                res.send('false');
            }
        }
    });
    //Student
    //    .findOne({credentials:req.query.select},function(err,doc){
    //        if(err){
    //            (err)(next)}
    //        else{
    //            if(doc == null){
    //                Student.findOne({ID_card:req.query.select},function(err,docs){
    //                    if(err){
    //                        (err)(next)}
    //                    else{
    //                        if(docs == null){
    //                            //
    //                        }else{
    //                            res.json(docs);
    //                        }
    //                    }
    //                })
    //            }else{
    //                res.json(doc);
    //            }
    //        }
    //    })
});

router.post('/checkPay', function(req,res,next){
    //
    connection.query('SELECT PaymentId FROM Student WHERE IdCode = ?', [req.body.IdCode], function(err,rows){
        if(err){
            next(err);
        } else{
            console.log('rows[0].PaymentId'+rows[0].PaymentId);
            connection.query('SELECT * FROM Payment WHERE PaymentId = ?', [rows[0].PaymentId], function(err, row){
                //
                if(err){
                    next(err);
                } else{
                    //console.log('row'+row[0].UnpaidFees);
                    //res.json(row[0].UnpaidFees);
                    res.json(row[0]);
                }
            });
        }
    });
});

//获取缴费查询后的学生个人信息
//router.get('/checkone',function(req,res,next){
//    connection.query('SELECT * FROM Student WHERE Examcode = ?', [req.query.selects], function(err,rows){
//        //
//        if(err){
//            next(err);
//        } else{
//            res.json(rows[0]);
//        }
//    });
//    //Student
//    //    .findOne({credentials:req.query.selects},function(err,doc){
//    //        if(err){
//    //            (err)(next)}
//    //        else{
//    //            if(doc == null){
//    //                Student.findOne({ID_card:req.query.selects},function(err,docs){
//    //                    if(err){
//    //                        (err)(next)}
//    //                    else{
//    //                        if(docs == null){
//    //                            //
//    //                        }else{
//    //                            res.json(docs);
//    //                        }
//    //                    }
//    //                })
//    //            }else{
//    //                res.json(doc);
//    //            }
//    //        }
//    //    })
//});
//班级查询中显示学院列表
router.get('/colleges', function(req,res,next){
    connection.query('SELECT * FROM Colleges', function(err, rows){
        //
        if(err){
            next(err);
        }else{
            console.log(rows);
            res.json(rows);
        }
    });
    //School
    //    .findOne({name:'广东科学技术职业学院'})
    //    .populate('colleges')
    //    .exec(function(err,doc){
    //        if(err != null){next(err);}
    //        else{
    //            res.json(doc.colleges);
    //        }
    //    })
});
//班级查询中显示专业列表
router.get('/professions', function(req,res,next){
    connection.query('SELECT * FROM Profession WHERE CollegeId = ?', [req.query.CollegeId], function(err, rows){
        //
        if(err){
            next(err);
        }else{
            res.json(rows);
        }
    });
});
//班级查询中显示班级列表
router.get('/classes', function(req,res,next) {
    connection.query('SELECT * FROM Profession WHERE ProfessionId = ?', [req.query.ProfessionId], function (err, rows) {
        //
        if (err) {
            next(err);
        } else {
            res.json(rows);
        }
    });
});
//班级查询中显示班级成员列表
router.get('/students', function(req,res,next){
    connection.query('SELECT * FROM Student WHERE ProfessionId = ? and Clazz = ?', [req.query.ProfessionId,req.query.Clazz], function(err,rows){
        //
        if(err){
            next(err);
        }else{
            res.json(rows);
        }
    });
});
//班级成员的详细信息
router.get('/student', function(req,res,next){
    console.log('chu: '+req.query.StudentID);
    connection.query('SELECT * FROM Student WHERE StudentID = ?', [req.query.StudentID], function(err, rows){
        //
        if(err){
            next(err);
        }else{
            console.log(rows[0]);
            res.json(rows[0]);
        }
    });
    //Student
    //    .findOne({_id: req.query._id})
    //    .exec(function(err,doc){
    //        if(err != null){next(err);}
    //        else{
    //            res.json(doc);
    //        }
    //    })
});
router.get('/studentDorm', function(req,res,next){
    connection.query('SELECT DormNumber FROM Dorm WHERE DormId = ?', [req.query.DormId], function(err, rows){
        //
        if(err){
            next(err);
        } else{
            //
            res.json(rows[0]);
        }
    })
});
router.get('/studentArea', function(req,res,next){
    connection.query('SELECT AreaName FROM Area WHERE AreaId = ?', [req.query.AreaId], function(err, rows){
        //
        if(err){
            next(err);
        } else{
            //
            res.json(rows[0]);
        }
    })
});

// 宿舍
// 查询是否缴费 -- 宿舍
router.post('/DormCheckPay', function(req,res,next){
    //
    connection.query('SELECT PaymentId FROM Student WHERE Phone = ?', [req.body.user], function(err,rows){
        if(err){
            next(err);
        } else{
            console.log('rows[0].PaymentId'+rows[0].PaymentId);
            connection.query('SELECT UnpaidFees FROM Payment WHERE PaymentId = ?', [rows[0].PaymentId], function(err, row){
                //
                if(err){
                    next(err);
                } else{
                    console.log('row'+row[0].UnpaidFees);
                    res.json(row[0].UnpaidFees);
                }
            });
        }
    });
});

router.get('/dorm', function(req,res,next){
    //

    connection.query('SELECT * FROM Dorm WHERE ProfessionId = ?', [req.query.ProfessionId], function(err, rows, fields){
        if(err){
            console.log(err);
        }
        else{
            res.json(rows);
        }
    });
});

router.get('/ProfessionIdGet', function(req,res,next){
    //
    connection.query('SELECT ProfessionId FROM Student WHERE Phone = ?', [req.query.registerPhone], function(err, rows){
        //
        if(err){
            next(err);
        } else{
            console.log(rows[0].ProfessionId);
            res.json(rows[0].ProfessionId);
        }
    });
});

router.get('/isChoose', function(req,res,next){
    //
    console.log('phone:'+req.query.user);
    connection.query('SELECT DormId FROM Student WHERE Phone = ?', [req.query.user], function(err, rows){
        if(err){
            console.log(err);
        }
        else{
            connection.query('SELECT DormNumber FROM Dorm WHERE DormId = ?', [rows[0].DormId], function(err, row){
                //
                if(err){
                    next(err);
                } else{
                    console.log('dormNumber='+row[0]);
                    res.json(row[0]);
                }
            });
            //res.json(rows[0].DormId);
        }
    });
});

router.get('/room', function(req,res,next){
    //
    connection.query('SELECT * FROM Dorm WHERE DormId = ?', [req.query._id], function(err, rows, fields){
        if(err){
            console.log(err);
        }
        else{
            res.json(rows[0]);
            console.log(rows[0]);
        }
    });
});

router.get('/update', function(req,res,next){
    //
    connection.query('SELECT * FROM Dorm WHERE DormId = ?', [req.query._id], function(err, rows, fields){
        if(err){
            console.log(err);
        }
        else{
            console.log(rows[0].OrderDorm);
            if(rows[0].OrderDorm > 0){
                console.log(rows[0].OrderDorm);
                rows[0].OrderDorm = rows[0].OrderDorm - 1;
                console.log(rows[0].OrderDorm);
                //
                connection.query('UPDATE Dorm SET OrderDorm = ? WHERE DormId = ?', [rows[0].OrderDorm, req.query._id], function(err,res){
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log(res);
                        connection.query('UPDATE Student SET DormId = ? WHERE Phone = ?', [req.query._id, req.query.phone], function(err,row){
                            //
                            if(err){
                                //
                            }else{
                                //
                            }
                        });
                    }
                });
                //
                res.json(rows[0]);
            }
        }
    });
});

// 信息发送(教师)
router.post('/messageSend', function(req,res,next){
    //
    var message = new Message({title: req.body.title, content: req.body.content, time: req.body.time, ProfessionId: req.body.ProfessionId, Clazz: req.body.Clazz});
    message.save(function(err,doc){
        if(err){
            next(err);
        } else{
            console.log(doc);
              res.send('succeed');
        }
    });
    console.log(req.body.ProfessionId+'_'+req.body.Clazz);
    client.push().setPlatform(JPush.ALL)
        .setAudience(JPush.alias(req.body.ProfessionId+'_'+req.body.Clazz))
        .setNotification(req.body.content, JPush.ios(req.body.content, req.body.title), JPush.android(req.body.content, req.body.title, 2))
        //setMessage	设置message，本方法接受4个参数msg_content(string,必填), title(string), content_type(string), extras(Object)
        .setOptions(null, 60)
        .send(function(err, res) {
            if (err) {
                console.log(err.message);
            } else {
                console.log();
                console.log('Sendno: ' + res.sendno);
                console.log('Msg_id: ' + res.msg_id);
            }
        });
    //easy push
    //client.push().setPlatform(JPush.ALL)
    //    .setAudience(JPush.ALL)
    //    .setNotification(req.body.title, JPush.ios('ios alert', 'happy.caf', 5))
    //    .send(function(err, res) {
    //        if (err) {
    //            console.log(err.message);
    //        } else {
    //            console.log('Sendno: ' + res.sendno);
    //            console.log('Msg_id: ' + res.msg_id);
    //        }
    //    });
});
router.get('/getClassNumber', function(req,res,next){
    //
    connection.query('SELECT Classes FROM Profession WHERE ProfessionName = ?', [req.query.ProfessionName], function(err,rows){
        //
        if(err){
            next(err);
        } else{
            res.json(rows[0].Classes);
            console.log(rows[0]);
        }
    })
});
router.get('/getProfession', function(req,res,next){
    console.log(req.query.CollegeName);
    //
    connection.query('SELECT CollegeId FROM Colleges WHERE CollegesName = ?', [req.query.CollegeName], function(err, rows){
        if(err){
            next(err);
        } else{
            connection.query('SELECT ProfessionName FROM Profession WHERE CollegeId = ?', [rows[0].CollegeId], function(err, row){
                if(err){
                    next(err);
                } else{
                    //res.json(row);
                    var array = [];
                    for(var i=0;i<row.length;i++){
                        array.push(row[i].ProfessionName);
                    }
                    console.log(array);
                    res.json(array);
                }
            });
        }
    });
});
router.get('/checkProfessionId', function(req,res,next){
    //
    console.log('req.query.ProfessionName = '+req.query.ProfessionName);
    connection.query('SELECT ProfessionId FROM Profession WHERE ProfessionName = ?', [req.query.ProfessionName], function(err,rows){
        //
        if(err){
            next(err);
        } else{
            console.log(rows[0]);
            res.json(rows[0].ProfessionId);
        }
    });
});

// 信息接收(学生)
router.get('/messageGet', function(req,res,next){
    console.log('req.query.user = '+req.query.user);
    //
    connection.query('SELECT * FROM Student WHERE Phone = ?', [req.query.user], function(err,rows){
        //
        if(err){
            next(err);
        } else{
            //console.log('rows = '+rows[0].Clazz);
            //console.log(rows[0].ProfessionId + ';' + rows[0].Clazz);
            Message.find({ProfessionId: rows[0].ProfessionId, Clazz: rows[0].Clazz}, function(err, doc){
                if(err){
                    next(err);
                } else{
                    console.log(doc);
                    res.json(doc);
                }
            })
        }
    });
    //
    //Message.find({}, function(err,doc){
    //    //
    //    if(err){
    //        next(err);
    //        console.log('err');
    //    } else{
    //        console.log(doc);
    //        res.json(doc);
    //    }
    //});
});

//数据统计获取数据
router.get('/statistics', function(req,res,next){
    console.log(req.query.CollegeName);
    //
    if(req.query.CollegeName == '全校'){
        //
    } else{
        connection.query('SELECT CollegeId FROM Colleges WHERE CollegesName = ?', [req.query.CollegeName], function(err, rows){
            if(err){
                next(err);
            } else{
                connection.query('SELECT ProfessionName FROM Profession WHERE CollegeId = ?', [rows[0].CollegeId], function(err, row){
                    if(err){
                        next(err);
                    } else{
                        //res.json(row);
                        var array = [];
                        for(var i=0;i<row.length;i++){
                            array.push(row[i].ProfessionName);
                        }
                        console.log(array);
                        res.json(array);
                    }
                });
            }
        });
    }
});
// 将专业名转为专业Id
router.get('/countReport', function(req,res,next){
    //
    if(req.query.ProfessionName == '全院'){
        //
    } else{
        connection.query('SELECT ProfessionId FROM Profession WHERE ProfessionName = ?', [req.query.ProfessionName], function(err,rows){
            //
            if(err){
                next(err);
            } else{
                console.log('ProfessionId'+rows[0].ProfessionId);
                res.json(rows[0].ProfessionId);
            }

        });
    }
});
// 没注册
router.get('/countNoReports', function(req,res,next){
    //
    connection.query('SELECT COUNT(*) AS namesCount FROM Student WHERE ProfessionId = ? and IsRegister = ?', [req.query.ProfessionId, 0], function(err,rows){
        //
        if(err){
            next(err);
        } else{
            console.log('namesCount = '+rows[0].namesCount);
            res.json(rows[0].namesCount);
        }

    });
});
// 已注册
router.get('/countIsReports', function(req,res,next){
    //
    connection.query('SELECT COUNT(*) AS namesCount FROM Student WHERE ProfessionId = ? and IsRegister = ?', [req.query.ProfessionId, 1], function(err,rows){
        //
        if(err){
            next(err);
        } else{
            console.log('namesCount = '+rows[0].namesCount);
            res.json(rows[0].namesCount);
        }

    });
});

// 查询缴费情况
router.get('/checkIsPay', function(req,res,next){
    //
    if(req.query.IsPay == 0){
        if(req.query.CollegeName == '全校'){
            console.log('123');
            res.send('400');
        } else{
            res.send('200');
        }
    }
    if(req.query.IsPay == 1){
        if(req.query.CollegeName == '全校'){
            console.log('456');
            res.send('4000');
        } else{
            res.send('2000');
        }
    }
});

// 查询报道情况
router.get('/checkIsReport', function(req,res,next){
    //
    if(req.query.IsPay == 0){
        if(req.query.CollegeName == '全校'){
            console.log('123');
            res.send('400');
        } else{
            res.send('200');
        }
    }
    if(req.query.IsPay == 1){
        if(req.query.CollegeName == '全校'){
            console.log('456');
            res.send('4000');
        } else{
            res.send('2000');
        }
    }
});

module.exports = router;
