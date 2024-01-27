//[GET]/adim/dashboard
const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const filterStateHelper = require("../../helpers/filter-state.helper");
const paginationHelper = require("../../helpers/pagination.helper");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/create-tree.helper");

//[GET] /admin/product/
module.exports.index = async (req, res) => {
    try {
        //filter
        const filterState = filterStateHelper(req.query);
        //end filter
        const find = {
            deleted: false
        }

        if (req.query.status) {
            find.status = req.query.status;
        }
        //Seach
        if (req.query.keyword) {
            const regex = new RegExp(req.query.keyword, "i");
            find.title = regex;
        }
        //end seach

        //Pagination
        const countProducts = await Product.countDocuments(find);
        const objectPagination = paginationHelper(4, req.query, countProducts);
        //end Pagination

        //sort
        const sort = {};
        if(req.query.sortKey && req.query.sortValue){
            sort[req.query.sortKey] = req.query.sortValue
        } else {
            sort["position"] = "desc";
        }
        // end sord

        const products = await Product.find(find)
            .sort(sort)
            .limit(objectPagination.limitItems) // lay 4 sp 
            .skip(objectPagination.skip); //so phan tu bo qua

        res.render("admin/pages/products/index", {
            // trả dữ liệu ra views        
            pageTitle: "Danh sách sản phẩm",
            products: products,
            filterState: filterState,
            keyword: req.query.keyword,
            pagination: objectPagination,
            prefix_Admin: systemConfig.prefix_Admin
        });
    } catch (error) {
        console.log(error);
        console.log("bi loi");
        res.redirect(`/${systemConfig.prefix_Admin}/products`);
    }
}

//[GET] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    await Product.updateOne({
        _id: id
    }, {
        status: status
    });

    req.flash('success', 'Cập nhật trạng thái thành công!');

    res.redirect("back");
}

// [PATCH /admin/products/change-multi/:status/:id
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;   // lấy ra trạng thái của nút trạng thái from gửi lên
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
        case "inactive":
            await Product.updateMany({
                _id: { $in: ids }  // tìm ra các id trong mảng này  => object 1
            }, {
                status: type    // cập nhật   => object 2
            });
            req.flash('success', 'Cập nhật thành công!');
            break;
        case "delete-all":
            await Product.updateMany({
                _id: { $in: ids }  // tìm ra các id trong mảng này  => object 1
            }, {
                deleted: true,// cập nhật   => object 2
                deledtedAt: new Date()
            });
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");  // phá vỡ tách 2 chuỗi trong 1 mảng
                position = parseInt(position);

                await Product.updateOne({
                    _id: id
                }, {
                    position: position
                });
            }
            req.flash('success', 'Thay đổi Vị Trí Thành Công!');
            break;
        default:
            break;
    }

    res.redirect("back");
}

// [DELETE/admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    try {
        const id = req.params.id;

        // await Product.deleteOne({  //xoa cung
        //     _id: id        // tìm đến id giống như id được gửi lên
        // });

        await Product.updateOne({   // xoa mem
            _id: id        // tìm đến id giống như id được gửi lên
        }, {
            deleted: true,   //cập nhật deleted trong databse
            deledtedAt: new Date() // lây ra thời gian hiện tại
        });

    } catch (error) {
        console.log(error);
    }
    req.flash('success', 'Xóa Sản Phẩm Thành Công!');
    res.redirect("back");
}


// [GET]/admin/products/create
module.exports.create = async (req, res) => {
    const records = await ProductCategory.find({
        deleted: false,
      });
    
      const newRecords = createTreeHelper(records);
    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm",
        records: newRecords
    });
};

// [POST]/admin/products/create
module.exports.createPost = async (req, res) => {

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position == "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    console.log(req.file);
    console.log(req.body);

    // console.log(req.file);
    // if (req.file && req.file.filename) {
    //     req.body.thumbnail = `/uploads/${req.file.filename}`;
    // }

    const product = new Product(req.body);
    await product.save(); //Lưu lại vào database

    //console.log(req.body);  // lấy data của font-end gửi lên

    req.flash("success", "Thêm mới sản phẩm thành công!");

    res.redirect(`/${systemConfig.prefix_Admin}/products`);
};


// [GET]/admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;  //lay id tren url hien tai
        const product = await Product.findOne({
            _id: id,
            deleted: false
        });
        const records = await ProductCategory.find({
            deleted: false,
          });
      
          const newRecords = createTreeHelper(records);

        // console.log(product);

        res.render("admin/pages/products/edit", {
            pageTitle: "Sửa sản phẩm",
            product: product,
            records: newRecords
        });
    } catch (error) {
        console.log(error);
        res.redirect(`/${systemConfig.prefix_Admin}/products`);
    }
};

// [POST]/admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;

        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        req.body.position = parseInt(req.body.position);

        // console.log(req.file);

        if (req.file && req.file.filename) {
            req.body.thumbnail = `/uploads/${req.file.filename}`;
        }

        await Product.updateOne({
            _id: id,
            deleted: false
        }, req.body); //Lưu lại vào database

        //console.log(req.body);  // lấy data của font-end gửi lên

        req.flash("success", "Cập nhât sản phẩm thành công!");

        res.redirect("back");
    } catch (error) {
        console.log(error);
        res.redirect(`/${systemConfig.prefix_Admin}/products`);
    }
}

// [GET]/admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;  //lay id tren url hien tai
        const product = await Product.findOne({
            _id: id,
            deleted: false
        })

        console.log(product);

        res.render("admin/pages/products/detail", {
            pageTitle: "Chi tiết sản phẩm",
            product: product
        });
    } catch (error) {
        console.log(error);
        res.redirect(`/${systemConfig.prefix_Admin}/products`);
    }
}