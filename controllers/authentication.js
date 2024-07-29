import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Product from "../models/Products.js"
dotenv.config();

export const registerHandler = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.redirect("/login");

    // res.status(201).json({ message: "User created successfully", user: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const token = jwt.sign(
          { id: user._id, name: user.name, email: user.email },
          process.env.SECRET_KEY,
          { expiresIn: "365d" }
        );
         
        res.cookie("token", token);

        res.redirect("/products");
        // res
        //   .status(200)
        //   .json({ success: true, message: "Logged in successfully", token });
      } else {
        res
          .status(403)
          .json({ success: false, message: "Invalid credentials" });
      }
    } else {
      res.status(403).json({ success: false, message: "Invalid credentials" });
    }
    // res.redirect('/products');
  } catch (error) {
    res.status(401).json({ success: false, message: "Authentication failed" });
  }
};

export const login = (req, res) => {
  res.render("login");
};

export const products = async (req, res) => {
  // console.log("in here")
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
}

export const getProductForm = async (req, res) => {
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