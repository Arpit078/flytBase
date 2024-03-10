import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const droneSchema = new Schema(
    {
    "site_id":String,
    "user_id":String,
    "category":{type:String,default:""},
    "drone_id": String,
    "created_at":{ type: Date, default: Date.now },
    "deleted_by": { type: String, default: "" },
    "deleted_on":{ type: Date, default: "" },
    "drone_type": String,
    "make_name": String,
    "name":String,
    "updated_at":{ type: Date, default: "" }
    }
);

const Drone = model('Drone', droneSchema);

export { Drone};
