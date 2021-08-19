const Page = require("../../models/page");

exports.createPage = (req, res) => {
  const { banners, products } = req.files;
  if (banners && banners.length > 0) {
    req.body.banners = banners.map((file) => ({
      // img: `${process.env.API}/public/${file.filename}`,
      img: file.url,
      navigateTo: `/bannerClicked?categoryId=${req.body.category}&type=${req.body.type}`,
    }));
  }
  if (products && products.length > 0) {
    req.body.products = products.map((file) => ({
      img: file.url,
      navigateTo: `/productClicked?categoryId=${req.body.category}&type=${req.body.type}`,
    }));
  }
  req.body.createdBy = req.user._id;
  Page.findOne({ category: req.body.category }).exec((error, page) => {
    if (error) return res.status(400).json({ error });
    //if category has been built , updated page of this category
    if (page) {
      Page.findOneAndUpdate({ category: req.body.category }, req.body).exec(
        (error, updatedPage) => {
          if (error) return res.status(400).json({ error });
          if (updatedPage) {
            return res.status(201).json({
              page: updatedPage,
            });
          }
        }
      );
    } else {
      // if page not exits
      const page = new Page(req.body);
      page.save((error, data) => {
        if (error) return res.status(400).json({ error });
        if (data) {
          return res.status(201).json({
            page: data,
            files: req.files,
          });
        }
      });
    }
  });
};
exports.getPage = (req, res) => {
  const { category, type } = req.params;
  console.log(category, type);
  if (type === "page") {
    Page.findOne({ category: category }).exec((error, page) => {
      if (error) return res.status(400).json({ error });
      if (page) return res.status(200).json({ page });
    });
  }
};
