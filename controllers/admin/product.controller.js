//[GET]/adim/dashboard
const Product = require("../../models/product.model");
const filterStateHelper = require("../../helpers/filter-state.helper")
const paginationHelper = require("../../helpers/pagination.helper");
const systemConfig = require("../../config/system")

//[GET] /admin/product/
module.exports.index = async(req, res) =>{
    try {
        //filter
    const filterState = filterStateHelper(req.query);
    //end filter
    const find = {
        deleted: false
    }

    if(req.query.status){
        find.status = req.query.status;
    }
    //Seach
    if(req.query.keyword){
        const regex = new RegExp(req.query.keyword, "i");
        find.title = regex;
    }
    //end seach

    //Pagination
    const countProducts = await Product.countDocuments(find);
    const objectPagination = paginationHelper(4, req.query, countProducts);
    //end Pagination

    const products = await Product.find(find)
    .limit(objectPagination.limitItems) // lay 4 sp 
    .skip(objectPagination.skip); //so phan tu bo qua

    res.render("admin/pages/products/index", {
        // trả dữ liệu ra views        
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterState: filterState,
        keyword: req.query.keyword,
        pagination: objectPagination
    });
    } catch (error) {
        console.log(error);
        console.log("bi loi");
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
}

//[GET] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    console.log(req.params);
    const status = req.params.status;
    const id = req.params.id;

    res.send("ok");
}
