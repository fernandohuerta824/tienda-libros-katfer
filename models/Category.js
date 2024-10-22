import { Schema, model } from "mongoose";

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    numberClicks: {
        type: Number,
        required: true,
        default: 0,
    }
})

export default model("Category", CategorySchema);