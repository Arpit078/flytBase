import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const siteSchema = new Schema({
 "site_name": {type:String,required:true},
 "user_id":String,
 "position": {
    "latitude": String,
    "longitude": String
 },
 "missions_id":{type:[String],default:[]},
 "drones_id":{type:[String],default:[]}
});

const Site = model('Site', siteSchema);

export { Site};
