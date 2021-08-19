const Category = require("../models/category");
const slugify = require("slugify");
const shortid = require("shortid");
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

exports.addCategory = (req, res) => {
  const { name, parentId } = req.body;
  const categoryObj = {
    name: name,
    slug: `${slugify(name)}-${shortid.generate()}`,
  };
  if (req.file) {
    categoryObj.categoryImage = req.file.url;
  }
  if (parentId) {
    categoryObj.parentId = parentId;
  }
  const ctgy = new Category(categoryObj);
  ctgy.save((err, category) => {
    if (err) {
      return res.status(400).json({
        err,
      });
    }
    if (category) {
      return res.status(201).json({
        message: "Create category successfully...",
        category,
        file: req.file,
      });
    }
  });
};
exports.getCategories = (req, res) => {
  Category.find().exec(async (err, categories) => {
    if (err) {
      return res.status(400).json({
        err,
      });
    }
    if (categories) {
      const categoryList = createCategories(categories);
      return res.status(201).json({
        message: "Success...",
        categoryList,
      });
    }
  });
};
exports.updateCategories = async (req, res) => {
  const { _id, name, parentId, type } = req.body;
  // instanceof tests if the property appear anywhere in the property chain of an object => return  boolean value
  // name  instanceof Array: to detect name what is array or not?
  // if name is array
  const updatedCategories = [];
  if (name instanceof Array) {
    for (let i = 0; i < name.length; i++) {
      const category = {
        name: name[i],
        type: type[i],
      };
      if (parentId[i] !== "") {
        category.parentId = parentId[i];
      }
      const updatedCategory = await Category.findOneAndUpdate(
        { _id: _id[i] },
        category,
        { new: true }
      );
      updatedCategories.push(updatedCategory);
    }
    return res.status(201).json({
      updatedCategories,
    });
  } else {
    // if update cateogory is an object not array
    const category = {
      name: name,
      type: type,
    };
    if (parentId !== "") {
      category.parentId = parentId;
    }
    const updatedCategory = await Category.findOneAndUpdate({ _id }, category, {
      new: true,
    });
    return res.status(201).json({
      updatedCategory,
    });
  }
};
exports.deleteCategories = async (req, res) => {
  const { ids } = req.body.payload;
  const deletedCategories = [];
  for (let i = 0; i < ids.length; i++) {
    const deletedCategory = await Category.findByIdAndDelete({
      _id: ids[i]._id,
    });
    deletedCategories.push(deletedCategory);
  }
  if (deletedCategories.length == ids.length) {
    return res.status(201).json({
      message: "Categories removed",
    });
  } else {
    return res.status(400).json({
      message: "Somthing went wrong",
    });
  }
};
