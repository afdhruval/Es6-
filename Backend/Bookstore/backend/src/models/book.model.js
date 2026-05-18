import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
    bookName: {
        type: String,
        required: true
    },
    bookAuthor: {
        type: String,
        required: true
    },
    bookPrice: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true,
        default: "https://imgs.search.brave.com/Q2l3rpdosKFpMHdFruKp9w0vsBFaid9q-9Hmm0t3EcA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE0/OTc2MzM3NjIyNjUt/OWQxNzlhOTkwYWE2/P2ZtPWpwZyZxPTYw/Jnc9MzAwMCZhdXRv/PWZvcm1hdCZmaXQ9/Y3JvcCZpeGxpYj1y/Yi00LjEuMCZpeGlk/PU0zd3hNakEzZkRC/OE1IeHpaV0Z5WTJo/OE1URjhmR0p2YjJ0/emZHVnVmREI4ZkRC/OGZId3c"
    }
})

const bookModel = mongoose.model("BOOK", bookSchema)

export default bookModel