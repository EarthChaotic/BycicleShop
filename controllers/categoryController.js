const Category = require("../models/categorys")
const Product = require("../models/products")
const config = require('../config/index')
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid');
const { promisify } = require('util')
const writeFileAsync = promisify(fs.writeFile)
const { validationResult } = require("express-validator");

exports.index = async (req, res, next) => {
  const category = await Category.find();
  res.status(200).json({
    data: category,
  });
};

exports.insert = async (req, res, next) => {
  try{
  const {
    category_name
  } = req.body;

  let category = new Category({
    category_name:category_name
  });
  await category.save();
  console.log(category);
  res.status(200).json({
    message: "เพิ่มข้อมูลเรียบร้อยแล้ว",
  });
}
catch(error){
  next(error);
}
};
exports.destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.deleteOne({
      _id: id,
    });
    if (category.deletedCount === 0) {
      const error = new Error("ไม่สามารถลบข้อมูลได้ / ไม่พบข้อมูล");
      error.statusCode = 400
      throw error;
    } else {
      res.status(200).json({
        message: "ลบข้อมูลเรียบร้อยแล้ว",
      });
    }
  }   catch(error){
    next(error)
  }
};

exports.product = async (req,res,next) =>{
  // const product = await Product.find();
  // res.status(200).json({
  //   data: product,
  // });

  const product = await Product.find().sort({_id:-1});

  const ProductWithPhoto = product.map( (product,index) =>{
    return{
      name: product.product_name,
      quantity:product.quantity,
      price:product.price,
      category_id:product.category_id,
      photo: config.DOMAIN + '/images/' + product.photo,
    }
  })

  res.status(200).json({
    data: ProductWithPhoto,
  });

}

  exports.Prodshow = async (req, res, next) => {
    const { id } = req.params;
    const category = await Category.findOne({_id: id}).populate('products')
  
    res.status(200).json({
      data: category,
    });
  };


  exports.Prodinsert = async (req, res, next) => {
  try {
    const { product_name, price, category_id, quantity,photo } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("ข้อมูลที่ได้รับมาไม่ถูกต้อง");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    let product = new Product({
      product_name:product_name,
      price:price,
      category_id:category_id,
      quantity:quantity,
      photo: await saveImageToDisk(photo) 
  })
  await product.save()
  
      res.status(200).json({
        message:"เพิ่มข้อมูลเรียบร้อยแล้ว"
      });
} catch (error) {
  next(error);
}
  };
  
  exports.Produpdate = async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        product_name,
        price,
        photo,
        category_id,
        quantity
      } = req.body;
  
      const product = await Product.updateOne(
        { _id: id },
        {
          product_name: product_name,
          price: price,
          photo : await saveImageToDisk(photo),
          category_id: category_id,
          quantity:quantity,
        }
      );
      res.status(200).json({
        message: "แก้ไขข้อมูลเรียบร้อยแล้ว",
      });
    } catch (error) {
      error = new Error('ไม่พบข้อมูล')
      error.statusCode = 400
      next(error)
    }
  };

  exports.Proddestroy = async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await Product.deleteOne({
        _id: id,
      });
      if (product.deletedCount === 0) {
        const error = new Error("ไม่สามารถลบข้อมูลได้ / ไม่พบข้อมูล");
        error.statusCode = 400
        throw error;
      } else {
        res.status(200).json({
          message: "ลบข้อมูลเรียบร้อยแล้ว",
        });
      }
    }   catch(error){
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