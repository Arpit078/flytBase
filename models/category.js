import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const categorySchema = new Schema(
    {
        "category_name":String,
        "user_id":String,
        "color": String,
        "tag_name": String,
        "created_at": {type:Date,default:Date.now()},
        "updated_at": {type:Date,default:""},
    }
);

const Category = model('Category', categorySchema);

export { Category };
