//Button status
const buttonsStatus = document.querySelectorAll("[button-status]");
if (buttonsStatus.length > 0) {
    let url = new URL(window.location.href);

    buttonsStatus.forEach((button) => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");

            if (status) {
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }

            window.location.href = url.href;
        })
    });
}
//End button status

//form secach       Tìm kiếm
const formSearch = document.querySelector("#form-search");
if (formSearch) {
    let url = new URL(window.location.href);

    formSearch.addEventListener("submit", (event) => {
        event.preventDefault();
        const keyword = event.target.elements.keyword.value;

        if (keyword) {
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword");
        }
        window.location.href = url.href;
    });
}
//end forn seach

//Pagination  
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if (buttonsPagination.length > 0) {
    let url = new URL(window.location.href)
    buttonsPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");

            url.searchParams.set("page", page);
            window.location.href = url.href;
        });
    });
}
//end pagination

// button-change-status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonsChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("[form-change-status]");
    const path = formChangeStatus.getAttribute("data-path");

    buttonsChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const statusCurrent = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");

            const statusChange = statusCurrent == "active" ? "inactive" : "active";

            const action = `${path}/${statusChange}/${id}?_method=PATCH`; //Chen them phuong thuc doi post thanh patch chinh sua trong database

            formChangeStatus.action = action;

            formChangeStatus.submit();
        });
    });
}
// End button-change-status

//checkbox-multi```````````````` `
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']"); //tim o iput co name là checkall
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

    inputCheckAll.addEventListener("click", () => {
        if (inputCheckAll.checked) {
            inputsId.forEach(input => {
                input.checked = true;
            });
        } else {
            inputsId.forEach(input => {
                input.checked = false;
            });
        }
    });
    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            const coutChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
            if (coutChecked == inputsId.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        });
    });
}
//end checkbox-multi

//form-change-multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (event) => {
        event.preventDefault();

        const type = event.target.elements.type.value;  //lấy giá trị option trong bảng select
        console.log(type);

        if (type == "delete-all") {
            const isConfirm = confirm("Bạn có chăc muốn xoá những bản ghi này?");
            if (!isConfirm) {
                return; //dừng lại chương trinh
            }
        }

        const inputsChecked = document.querySelectorAll("input[name='id']:checked");
        if (inputsChecked.length > 0) {
            const ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");

            inputsChecked.forEach(input => {
                const id = input.value;
                if (type == "change-position") {
                    const position = input.closest("tr").querySelector("input[name='position']").value; //lấy ra các thẻ tr co o input name la position va lay value của thuộc tính position
                    console.log(position);
                    ids.push(`${id}-${position}`);
                } else {
                    ids.push(id);
                }
            });

            console.log(ids);

            inputIds.value = ids.join(", ") //join chuyển mảng thành chuỗi copy id vao value form
            formChangeMulti.submit();
        } else {
            alert("Vui lòng chon ít nhất 1 bản ghi !");
        }
    });
}
//end-change-multi

//button-delete
const buttonsDelete = document.querySelectorAll("[button-delete]");

if (buttonsDelete.length > 0) {
    const formDeleteItem = document.querySelector("[form-delete-item]");
    const path = formDeleteItem.getAttribute("data-path");

    buttonsDelete.forEach(button => {   // lấy ra các nut button delete
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc muốn xoá bản ghi này");

            if (isConfirm) {
                const id = button.getAttribute("data-id");

                const action = `${path}/${id}?_method=DElETE`; //chèn phương thức delete cho action form delete

                formDeleteItem.action = action;

                formDeleteItem.submit();
            }
        });
    });
}
//End delete

//show alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);

    const closeAlert = showAlert.querySelector("[close-alert]");
    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    });
}
//end alert

//preview imgae
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
    const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
    const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]")

    uploadImageInput.addEventListener("change", (event) => {
        const [file] = uploadImageInput.files;
        if (file) {
            uploadImagePreview.src = URL.createObjectURL(file);
        }
    })
}
// end image

// sort
const sort = document.querySelector("[sort]");
if (sort) {
    let url = new URL(window.location.href);
    const sortSelect = sort.querySelector("[sort-select]");

    const sortClear = sort.querySelector("[sort-clear]");

    sortSelect.addEventListener("change", () => {
        const [sortKey, sortValue] = sortSelect.value.split("-"); // phá vỡ value select thành 2 biến riêng biệt

        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);

        window.location.href = url.href;   //truyen url len url hiện tại
    })
    // xóa sắp xếp
    sortClear.addEventListener("click", () => {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");

        window.location.href = url.href;   //truyen url len url hiện tại
    })
    //Thêm selected cho option
    const sortKey = url.searchParams.get("sortKey");  //lấy sortkey và sortValue trên url hiện tại
    const sortValue = url.searchParams.get("sortValue");

    if (sortKey && sortValue) {
        const string = `${sortKey}-${sortValue}`;
        const optionSelected = sortSelect.querySelector(`option[value="${string}"]`);
        optionSelected.selected = true;  //cach 1

        // optionSelected.setAttribute("selected", ture); cach 2
    }
}

// end sort

// Permissions

const tablePermissions = document.querySelector("[table-permissions]");
if (tablePermissions) {
    // Submit Data
    const buttonSubmit = document.querySelector("[button-submit]");
    buttonSubmit.addEventListener("click", () => {
        const roles = [];
        const rows = tablePermissions.querySelectorAll("[data-name]");
        rows.forEach(row => {
            const name = row.getAttribute("data-name");
            const inputs = row.querySelectorAll("input");
            if (name == "id") {
                inputs.forEach(input => {
                  const id = input.value;
                    roles.push({
                        id: id,
                        permissions: []
                    });
                });
            } else {
                inputs.forEach((input, index) => {
                    if (input.checked) {
                        roles[index].permissions.push(name);
                    }
                });
            }
        }); 
        const formChangePermissions = document.querySelector("[form-change-permissions]");
        const inputRoles = formChangePermissions.querySelector("input[name='roles']");
        inputRoles.value = JSON.stringify(roles);
        formChangePermissions.submit();
    });
    // Data Default
    const divRecords = document.querySelector("[data-records]");
    if (divRecords) {
        const records = JSON.parse(divRecords.getAttribute("data-records"));
        records.forEach((record, index) => {
            const permissions = record.permissions;
            permissions.forEach(permission => {
                const row = tablePermissions.querySelector(`[data-name="${permission}"]`);
                const input = row.querySelectorAll("input")[index];
                input.checked = true;
            });
        })
    }
}

// End Permissions