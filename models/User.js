import {Schema, model, Types} from "mongoose";

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        default: ''
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
        type: [Object],
        required: true,
        default: []
    },
    rol: {
        type: String,
        required: true,
        default: 'user'
    },
    address: {
        type: {
            street: String,
            neighborhood: String,
            city: String,
            state: String,
            zip: String,
        },
        required: true
    },
    favoriteCategories: {
        type: [Types.ObjectId],
        default: []
    }

})

UserSchema.methods._mergeProduct = function (product) {
    return product.map((p, i) => {
        const quantity = this.cart.items[i].quantity;
        p.quantity = quantity;
        p.itemPrice = +(quantity * p.price.toFixed(2))
        return p;

    });
}

UserSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.cart.findIndex(p => p._id.toString() === product._id.toString());
    if(cartProductIndex > -1) {
        const newQuantity = this.cart[cartProductIndex].quantity + 1;
        this.cart[newQuantity] = {_id: product._id, quantity: newQuantity};
    } else {
        this.cart[cartProductIndex] = {_id: product._id, quantity: 1};
    }

    return this.save();
}



export default model("User", UserSchema);