const Staff = require('../models/staffs')
const config = require('../config/index')
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid');
const { promisify } = require('util')
const writeFileAsync = promisify(fs.writeFile)
const {validationResult} = require('express-validator')

exports.index = async (req, res, next) => {
    const staff = await Staff.find().sort({_id:-1})

    const staffWithPhotoDomain = staff.map( (staff,index) =>{
        return{
            id:staff._id,
            name: staff.name,
            photo: config.DOMAIN + '/images/' + staff.photo,
            salary: staff.salary,
            created: staff.created
        }
      })

    res.status(200).json({
      data:staffWithPhotoDomain
    });
    
};
exports.insert = async (req, res, next) => {
try{
    const {name,salary,photo} = req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Invalid data");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
}
    
    let staff = new Staff({
        name: name,
      salary: salary,
      photo: photo && (await saveImageToDisk(photo)),
    });
    await staff.save();

    res.status(200).json({
      message: "เพิ่มข้อมูลเสร็จเรียบร้อยแล้ว",
    });
  } catch (error) {
    next(error);
  }
};

exports.show = async (req, res, next) => {
        try{
            const{id} = req.params
        
            const staff = await Staff.findOne({
                _id : id
            })
        
            if(!staff){
                const error = new Error('ไม่พบผู้ใช้งาน')
                error.statusCode = 400
                throw error;
            }
            else{
                res.status(200).json({
                    data:staff
                  });
            }
        }
        catch(error){
            next(error)
          }
    };

exports.destroy = async (req, res, next) => {
        try{
            const {id} = req.params 
            const staff = await Staff.deleteOne({
                _id:id
            })
            if(staff.deletedCount === 0){
                const error = new Error('ไม่สามารถลบข้อมูลได้ / ไม่พบผู้ใช้งาน')
                error.statusCode = 400
                throw error;
            }else{
                res.status(200).json({
                    message:'ลบข้อมูลเรียบร้อยแล้ว'
                  });      
            }
        }
        catch(error){
            next(error)
          }
    };
    
exports.update = async (req, res, next) => {
    try{
        const{id} = req.params
        const{name,salary}= req.body;

        //Find By ID
        // const staff = await Staff.findById(id);
        // staff.name = name
        // staff.salary = salary
        // await staff.save()

        //Find by ID and Update
        // const staff = await Staff.findByIdAndUpdate(id, {
        //     name: name,
        //     salary: salary,
        //     });


        const staff = await Staff.updateOne({ _id: id },{
            name: name,
            salary: salary,
            });
        res.status(200).json({
            message:'แก้ไขข้อมูลเรียบร้อยแล้ว'
          });   
    
    }
    catch(error){
        error = new Error('ไม่พบผู้ใช้งาน')
        error.statusCode = 400
        next(error)
      }
    };

    async function saveImageToDisk(baseImage) {
        //หา path จริงของโปรเจค
        const projectPath = path.resolve('./') ;
        //โฟลเดอร์และ path ของการอัปโหลด
        const uploadPath = `${projectPath}/public/images/`;
    
        //หานามสกุลไฟล์
        const ext = baseImage.substring(baseImage.indexOf("/")+1, baseImage.indexOf(";base64"));
    
        //สุ่มชื่อไฟล์ใหม่ พร้อมนามสกุล
        let filename = '';
        if (ext === 'svg+xml') {
            filename = `${uuidv4.v4()}.svg`;
        } else {
            filename = `${uuidv4.v4()}.${ext}`;
        }
    
        //Extract base64 data ออกมา
        let image = decodeBase64Image(baseImage);
    
        //เขียนไฟล์ไปไว้ที่ path
        await writeFileAsync(uploadPath+filename, image.data, 'base64');
        //return ชื่อไฟล์ใหม่ออกไป
        return filename;
    }
    
    function decodeBase64Image(base64Str) {
        var matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        var image = {};
        if (!matches || matches.length !== 3) {
            throw new Error('Invalid base64 string');
        }
    
        image.type = matches[1];
        image.data = matches[2];
    
        return image;
    }
