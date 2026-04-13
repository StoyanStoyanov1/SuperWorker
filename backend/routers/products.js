import express from "express";
import {Category, Product} from "../models/index.js";
const router = express.Router();
import mongoose from "mongoose";

router.post(`/`, async (req, res) => {
    try {
        const category = await Category.findById(req.body.category);

        if (!category) {
            return res.status(400).json({message: "Invalid category!"});
        }

        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        });

        product = await product.save();

        if (!product) {
            return res.status(500).send({message: "Product cannot be created!"});
        }

        res.status(201).json(product);

    } catch (error) {
        res.status(500).json({ error: error, success: false });
    }


    product.save()
    .then((createdProduct) => {
        res.status(201).json(createdProduct);
    })
    .catch((err) => {
        res.status(500).json({ error: err, success: false });
    });


});

router.get(`/`, async (req, res) => {
    try {
        const products = await Product.find();

        if (products.length === 0) {
            return res.status(404).send({message: "No products found!"});
        }

        res.status(200).send(products);
    } catch (error) {
        res.status(500).json({ error: error, success: false });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId).populate("category");

        if (!product) {
            res.status(404).send({message: "Product not found!"});
        }

        res.status(200).send(product);
    } catch (error) {
        res.status(500).json({ error: error, success: false });
    }

});

router.put("/:id", async (req, res) => {
    try {
        const productId = req.params.id;

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).send("Invalid product id!");
        }

        const category = await Category.findById(req.body.category);

        if (!category) {
            return res.status(400).json({message: "Invalid category!"});
        }

        const product = await Product.findByIdAndUpdate(
            productId,
            {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: req.body.image,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured,
            },
            { new: true }
        );

        if (!product) {
            res.status(500).json({message: "The product cannot be updated!"});
        }

        res.status(200).send(product);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Product could not be updated",
            error: error.message
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndDelete(productId);

        if (product) {
            return res.status(200).json({success: true, message: 'Product deleted successfully!'});
        } else {
            return res.status(404).json({success: false, message: "Product not found!"});
        }

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
})

router.get("/get/count", async (req, res) => {
    const productCount = await Product.countDocuments((count) => count);

    if (!productCount) {
        res.status(500).json({ success: false });
    }

    res.status(200).send({productCount});
})

router.get("/get/featured", async (req, res) => {
    const products = await Product.find({isFeatured: true});

    if (!products) {
        res.status(500).json({ success: false });
    }

    res.status(200).send({products});
})

export default router;