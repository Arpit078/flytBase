import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const wayPointSchema = new Schema({
    "alt":Number,
    "lat":Number,
    "lng":Number,
})
const missionSchema = new Schema({
    "site_id":String,
    "user_id":String,
    "category":{type:String,default:""},
    "mission_name" : String,
    "alt" : Number,
    "speed":Number,
    "waypoints":[wayPointSchema],
    "created_at": { type: Date, default: Date.now },
    "updated_at": { type: Date, default: "" }
});

const Mission = model('Mission', missionSchema);

export { Mission};
