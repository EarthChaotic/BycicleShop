const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
    category_name:  {type: String},
  },{collection:"categorys",});

const category = mongoose.model("Categorys",categorySchema)

categorySchema.virtual('products', {
    ref:'Products',
    localField:'_id',
    foreignField:'category_id',
  })

module.exports = category