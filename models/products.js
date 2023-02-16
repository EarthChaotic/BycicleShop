const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    product_name:  {type: String},
    price:  {type: Number},
    photo: { type: String, default:'nopic.png' },
    category_id:{ type:Schema.Types.ObjectId,ref:'category'},
    quantity:{type: Number ,default:0}
  },{toJSON:{virtuals:true},collection:"products",});

const product = mongoose.model("Products",productSchema)

module.exports = product