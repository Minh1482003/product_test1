const Product = require("../../models/product.model");

module.exports.index = async (req, res) =>{
    const products = await Product.find({
        status: "active",
        deleted: false
    });

    for (const item of products) {
        item.priceNew = item.price * (1 - item.discountPercentage/100);
        item.priceNew = item.priceNew.toFixed(0)
    }

    console.log(products);

    res.render("client/pages/products/index", {
    pageTitle: "Trang danh sach san pham",
    products: products
});
}
// module.exports.detail= (req, res) =>{
//     res.render("tran chi tiet san pham", {
//     });
// }