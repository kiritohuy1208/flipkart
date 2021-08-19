const Category = require("../../models/category");
const Product = require("../../models/product");
const Order = require("../../models/order");
function createCategories(categorise, parentId = null) {
  let categoryList = [];
  let category;
  // run first time, category as root of category, have parentId is undefined,
  if (parentId === null) {
    category = categorise.filter((cat) => cat.parentId == undefined);
  } else {
    category = categorise.filter((cat) => cat.parentId == parentId);
  }
  for (cate of category) {
    categoryList.push({
      _id: cate.id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      type: cate.type,
      children: createCategories(categorise, cate._id),
    });
  }
  return categoryList;
}

exports.initialData = async (req, res) => {
  try {
    const categories = await Category.find({}).exec();
    const products = await Product.find({})
      .select(
        "_id name price quantity slug  description productPictures category"
      )
      .populate({ path: "category", select: "_id name" })
      .exec();
    const orders = await Order.find({})
      .populate({ path: "user", select: "firstName lastName" })
      .populate({ path: "items.productId", select: "name" })
      .sort({ createdAt: -1 })
      .exec();
    return res.status(200).json({
      categories: createCategories(categories),
      products,
      orders,
    });
  } catch (error) {
    return res.status(400).json({
      error,
    });
  }
};
