//Button status
const buttonsStatus = document.querySelectorAll("[button-status]");
if(buttonsStatus.length > 0){
    let url = new URL(window.location.href);

    buttonsStatus.forEach((button) => {
        button.addEventListener("click", () =>{
            const status = button.getAttribute("button-status");

            if(status){
                url.searchParams.set("status", status);
            }else{
                url.searchParams.delete("status");
            }
           
           window.location.href = url.href;
        })       
    });
}
//End button status
//form secach
const formSearch = document.querySelector("#form-search");
if(formSearch){
    let url = new URL(window.location.href);

formSearch.addEventListener("submit", (event) =>{
    event.preventDefault();
    const keyword = event.target.elements.keyword.value;
    
    if(keyword){
        url.searchParams.set("keyword", keyword);
    }else{
        url.searchParams.delete("keyword");
    }
});
}
//end forn seach

//Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if(buttonsPagination.length > 0){
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

//button-change-status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
console.log(buttonChangeStatus);
if(buttonChangeStatus.length > 0){
    const fromChangeStatus = document.querySelector("[from-change-status]");
    const path = fromChangeStatus.getAttribute("data-path");
    console.log(path);
    buttonChangeStatus.forEach(button => {
        button.addEventListener("click", () =>{
            const statusCurrent = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");

            const statusChange = statusCurrent == "active" ? "inactive" : "active";

            const action = `${path}/${statusChange}/${id}`
            console.log(action);
            fromChangeStatus.action = action;
            fromChangeStatus.submit();
        });
    });
}
//end  button-chage-status