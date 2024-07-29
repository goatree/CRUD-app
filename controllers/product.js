import Product from "../models/Products.js";


export const getAllProducts = async (req, res) => {
    console.log("in here")
    try {
        const perPage = 9;
        const page = parseInt(req.query.page) || 1;
        const products = await Product.find({}).skip((perPage * page) - perPage)
            .limit(perPage);
        const count = await Product.countDocuments();

        res.render("products", { productList: products, currentPageNumber: page, totalPages: Math.ceil(count / perPage) });
    }

    catch (error) {
        res.status(404).json({ message: error });
    }
};

export const getProductForm = (req, res) => {
    res.render("createProduct");
};

export const createProducts = async (req, res) => {
    try {
        let { productName, description, price } = req.body;
        const name = productName;
        const productImage = req.file ? req.file.path : "";

        const newProduct = new Product({
            name,
            description,
            price,
            image: productImage
        });

        await newProduct.save();

        res.redirect("/products");


    }
    catch (error) {
        console.error("Error creating product:", error.message);
        res.status(400).json({ message: "Failed to create product" })
    }

};

export const getEditProductForm = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if (!product) {
            res.status(400).json({ message: "Product not found" })

        }
        res.render("editForm", { product });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const editProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { productName, description, price } = req.body;

        let updateFields = { name: productName, description, price };
        if (req.file) {
            updateFields.productImage = req.file.path;

        }
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            updateFields,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.redirect("/products");
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }


}

export const deleteProducts = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });

        }
        res.redirect("/products");
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}





