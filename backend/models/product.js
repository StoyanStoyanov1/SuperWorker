import mongoose, {Mongoose} from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    richDescription: {
        type: String,
        default: "",
    },
    image: {
        type: String,
        default: "",
    },
    images: [{
        type: String,
        default: "",
    }],
    price: {
        type: Number,
        default: 0,
    },
    category: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Product', productSchema);
