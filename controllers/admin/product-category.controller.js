const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/create-tree.helper");

//[GET] /admin/product-category
module.exports.index = async (req, res) => {
    const records = await ProductCategory.find({
        deleted: false
    });
    // console.log(records);
    res.render("admin/pages/products-category/index", {
        pageTitle: "Danh mục sản phẩm",
        records: records
    });
};
//[GET] /admin/product-category/create
module.exports.create = async (req, res) => {
    const records = await ProductCategory.find({
        deleted: false,
    }); 

    const newRecords = createTreeHelper(records);

    // console.log(newRecords);

    // [
    //     {
    //         title: 'Điện thoại',
    //         children: [
    //             {
    //                 title: 'Điện thoại SamSum',
    //             },
    //             {
    //                 title: 'Điện thoại Iphone',
    //             },
    //         ]
    //     },
    //     {
    //         title: 'Điện thoại',
    //         children: [
    //             {
    //                 title: 'Thời trang nam',
    //                 childern:[
    //                     {
    //                         title: 'Áo cọc nam'
    //                     },
    //                     {
    //                         title: 'Quần dài nam'
    //                     },
    //                 ]
    //             },
    //             {
    //                 title: 'Thời trang nữ',
    //             },
    //             {
    //                 title: 'Thời trang trẻ em',
    //             },
    //         ]
    //     },

    // ]

    res.render("admin/pages/products-category/create", {
        pageTitle: "Thêm mới danh mục sản phẩm",
        records: newRecords
    });
}; 

//[POST] /admin/product-category/create
module.exports.createPost = async (req, res) => {
    if (req.body.position == "") {
        const countRecords = await ProductCategory.countDocuments();
        req.body.position = countRecords + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body);
    await record.save();       //Lưu lại vào database
    req.flash("success", "Thêm mới sản phẩm thành công!");
    
    res.redirect(`/${systemConfig.prefix_Admin}/products-category`);
};

//[GET] /admin/product-category/edit
module.exports.edit = async (req, res) => {
    const data = await ProductCategory.findOne({
        _id: req.params.id,  //tìm id trong database giống id được gửi lên url hiện tại
        deleted: false
    });

    const records = await ProductCategory.find({
        deleted: false,
    }); 

    const newRecords = createTreeHelper(records);
    
    res.render("admin/pages/products-category/edit", {
        pageTitle: "Chỉnh sửa danh mục sản phẩm",
        data: data,
        records: newRecords
    });
};

//[PATCH] /admin/product-category/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        if (req.body.position == "") {
            const countRecords = await ProductCategory.countDocuments();
            req.body.position = countRecords + 1;
        } else {
            req.body.position = parseInt(req.body.position);
        }
    
        await ProductCategory.updateOne({
            _id: req.params.id,
            deleted: false
        }, req.body); // cập nhật lại data dược gửi lên vào database
    
        req.flash("success", "Thêm mới sản phẩm thành công!");
        
        res.redirect(`back`);
    } catch (error) {
        
    }
};