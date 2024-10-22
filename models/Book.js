import { Schema, model, Types } from "mongoose";

const BookSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    categories: {
        type: [String],
        required: true,
        default: [],
    },
    publisher: {
        type: 'String',
        required: true,
    },
    datePublished: {
        type: Date,
        required: true,
    },
    edition: {
        type: String,
        required: true,
        default: 1,
    },
    authors: {
        type: [String],
        required: true,
        default: [],
    },
    numberClicks: {
        type: Number,
        required: true,
        default: 0,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    inventory: {
        type: Number,
        required: true,
    }
});

export default model("Book", BookSchema);