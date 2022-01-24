const Product = require("../models/product");
const slugify = require("slugify");
const Category = require("../models/category");
exports.addProduct = async (req, res, next) => {
  const { name, price, description, category, quantity, createdBy } = req.body;
  let productPictures = [];
  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: file.url };
    });
  }

  const product = new Product({
    name: name,
    slug: slugify(name),
    price,
    quantity,
    description,
    productPictures,
    category,
    createdBy: req.user._id,
  });
  try {
    await product.save();
    return res.status(201).json({
      message: "Create product successfull",
      product,
      files: req.files,
    });
  } catch (error) {
    return res.status(400).json({
      error,
    });
  }
};
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .select(
        "_id name price quantity slug description productPictures category"
      )
      .populate({ path: "category", select: "_id name" })
      .exec();
    return res.status(200).json({
      products,
    });
  } catch (error) {
    return res.status(400).json({
      error,
    });
  }
};
exports.getProductsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    Category.findOne({ slug: slug })
      .select("_id type")
      .exec((error, category) => {
        if (error) {
          return res.status(400).json({
            error,
          });
        }
        if (category) {
          Product.find({ category: category._id })
            .sort({ createdAt: -1 })
            .exec((error, products) => {
              if (error) {
                return res.status(400).json({
                  error,
                });
              }
              if (category.type) {
                // if category have type property, return product by filter price
                if (products.length > 0) {
                  return res.status(200).json({
                    products,
                    priceRanger: {
                      under5k: 5000000,
                      under10k: 10000000,
                      under15k: 15000000,
                      under20k: 20000000,
                      under30k: 30000000,
                    },
                    productsByPrice: {
                      under5k: products.filter(
                        (product) => product.price <= 5000000
                      ),
                      under10k: products.filter(
                        (product) =>
                          product.price > 5000000 && product.price <= 10000000
                      ),
                      under15k: products.filter(
                        (product) =>
                          product.price > 10000000 && product.price <= 15000000
                      ),
                      under20k: products.filter(
                        (product) =>
                          product.price > 15000000 && product.price <= 20000000
                      ),
                      under30k: products.filter(
                        (product) =>
                          product.price > 20000000 && product.price <= 30000000
                      ),
                    },
                  });
                }
              } else {
                return res.status(200).json({ products });
              }
            });
        }
      });
  } catch (error) {
    console.log(error);
  }
};
exports.getDetailProduct = (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      Product.findById(id).exec((error, product) => {
        if (error) return res.status(400).json({ error });
        if (product) return res.status(200).json({ product });
      });
    } else {
      return res.status(400).json({ error: "Params required" });
    }
  } catch (error) {
    console.log(error);
  }
};
exports.deleteProductById = (req, res) => {
  const { productId } = req.body;
  if (productId) {
    Product.deleteOne({ _id: productId }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) return res.status(202).json({ result });
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};
exports.getCommentByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const comments = await Product.findById(productId)
      .select("review")
      .populate({ path: "review.userId", select: "firstName lastName " });

    res.status(200).json({ comments });
  } catch (error) {
    res.status(400).json({ error: "Cannot get comment" });
  }
};
exports.addComment = async (req, res) => {
  try {
    const { comment, productId } = req.body;
    const userId = req.user.id;
    const commentRes = await Product.findOneAndUpdate(
      { _id: productId },
      {
        $push: {
          review: { userId, review: comment },
        },
      },
      { new: true, upsert: true }
    );
    res.status(200).json({ commentRes });
  } catch (err) {
    res.status(400).json({ error: "Something error" });
  }
};
