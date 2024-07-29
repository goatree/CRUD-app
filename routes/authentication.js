import { Router } from "express";
import { registerHandler, loginHandler, login, products, createProducts, getProductForm, getEditProductForm, editProduct, deleteProducts } from '../controllers/authentication.js';
import { Authenticate } from "../middleware/verifyToken.js";
import multer from "multer";

const router = new Router();
const storage = multer.diskStorage({
  destination : (req,file,cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file,cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
})

const upload = multer({storage : storage});
router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.get("/login", login);
router.get("/products", Authenticate, products);
router.get("/createProduct", Authenticate, getProductForm);
router.post(
  "/createProduct",
  upload.single("productImage"),
  Authenticate,
  createProducts
);
router.get("/:id/edit", Authenticate, getEditProductForm);
router.post("/:id/edit", upload.single("productImage"), Authenticate, editProduct);
router.post("/:id", Authenticate, deleteProducts);



export default router;