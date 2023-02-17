const sheetID = '1X_hIvEFFwMmYPT0U-bmrLf6mx6p3aE_wzXtJVHIRLEo';
const base = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`;

let sheetName = 'Course';
const qu_AllData = 'Select * WHERE A != ""';
const queryAllData = encodeURIComponent(qu_AllData);
const urlAllData = `${base}&sheet=${sheetName}&tq=${queryAllData}`;

let data = [];
let dataAll = [];
let dataHotNews = [];
let dataByIdNews = [];
let dataSearch = [];
let dataRenderInfo = [];
let dataSearchRender = [];

let checkStatusSearch = false;
let htmlPagination = "";
let numberPage = 0;
let currentPage = 0;

let IndexTypeRealEstate = "";
let IndexPlace = "";
let IndexTypeService = "";
let IndexRangePrice = "";

window.onload = init;

function init() {
    var queryStringID = window.location.search;
    
    if(queryStringID != ""){
        var urlParams = new URLSearchParams(queryStringID);
        var idNews = urlParams.get('id');
        var userCurrent = urlParams.get('user');
        if(userCurrent == null){
            fetch(urlAllData)
                .then(res => res.text())
                .then(rep => {
                    
                    const jsData = JSON.parse(rep.substr(47).slice(0, -2));
                    
                    const colz = [];
                    jsData.table.cols.forEach((heading) => {
                        

                        if (heading.label) {
                            colz.push(heading.label.toLowerCase().replace(/\s/g, ''));
                        }
                    })
                    
                    jsData.table.rows.forEach((main) => {
                        
                        const row = {};
                        colz.forEach((ele, ind) => {
                            
                            row[ele] = (main.c[ind] != null) ? main.c[ind].v : '';
                        })
                        dataAll.push(row);
                        
                    })
                    
                    data = dataAll;
                    renderNewsByID(idNews);   
                    numberPage = 1;
                    currentPage = 1;         
                    addContentPagination(currentPage);
                    modalInfoRender(1);
                })
        }
        else{
            checkCookie(userCurrent, idNews);
        }
    }
    else{
        fetch(urlAllData)
        .then(res => res.text())
        .then(rep => {
            
            const jsData = JSON.parse(rep.substr(47).slice(0, -2));
            
            const colz = [];
            jsData.table.cols.forEach((heading) => {
                

                if (heading.label) {
                    colz.push(heading.label.toLowerCase().replace(/\s/g, ''));
                }
            })
            
            jsData.table.rows.forEach((main) => {
                
                const row = {};
                colz.forEach((ele, ind) => {
                    
                    row[ele] = (main.c[ind] != null) ? main.c[ind].v : '';
                })
                dataAll.push(row);
                
            })
            data = dataAll;
            renderHotNews();            
            addContentPagination(currentPage);
        })
    }
}

function renderNewsByID(idNews){
    dataByIdNews = [];
    for(var count = dataAll.length - 1; count >= 0; count--){
        if(dataAll[count]['code'] == idNews){
            dataByIdNews.push(dataAll[count]);
            break;
        }
    }
    data = dataByIdNews;
    renderToWebsite(dataByIdNews);
}

function renderHotNews(){
    dataHotNews = [];
    for(var count = dataAll.length - 1; count >= 0; count--){
        if(dataAll[count]['hotnews'] == "Yes" && dataAll[count]['status'] == "publish"){
            dataHotNews.push(dataAll[count]);
        }
    }
    checkStatusSearch = false;
    data = dataHotNews;

    if(data.length == 0){
        numberPage = 0;
        currentPage = 0;
    }
    else if(data.length%6 == 0){
        numberPage = data.length/6;
        currentPage = 1;
    }
    else{
        numberPage = (data.length - data.length%6)/6 + 1;
        currentPage = 1;
    }
    renderToWebsite(dataHotNews);
}

function showResultOfSearch(){
    IndexSubject = document.getElementById("Type").value;    
    IndexSort = document.getElementById("city").value;
    checkStatusSearch = true;
    dataSearch = [];
    
    if(IndexSort == "0"){       
        if(IndexSubject == "0"){
            dataSearch = dataAll;
        }
        else{            
            for(var count = dataAll.length - 1; count >= 0; count--){                
                if(dataAll[count]['indexsubject'] == IndexSubject){
                    dataSearch.push(dataAll[count]);
                }
            }   
        }      
    }
    else{
        if(IndexSubject == "0"){
            for(var count = dataAll.length - 1; count >= 0; count--){                
                if(dataAll[count]['indexfee'] == IndexSort){
                    dataSearch.push(dataAll[count]);
                }
            }
        }
        else{
            for(var count = dataAll.length - 1; count >= 0; count--){
                if(dataAll[count]['indexsubject'] == IndexSubject && dataAll[count]['indexfee'] == IndexSort){
                    dataSearch.push(dataAll[count]);
                }
            }
        }
    }
    data = dataSearch;
    if(data.length == 0){
        numberPage = 0;
        currentPage = 0;
    }
    else if(data.length%6 == 0){
        numberPage = data.length/6;
        currentPage = 1;
    }
    else{
        numberPage = (data.length - data.length%6)/6 + 1;
        currentPage = 1;
    }
    
    if(dataSearch.length > 0 && dataSearch.length <=6){
        renderToWebsite(dataSearch);
        addContentPagination(currentPage);
    }
    else if(dataSearch.length > 6){ //Render cho trang 1
        dataSearchRender.push(dataSearch[0]);
        dataSearchRender.push(dataSearch[1]);
        dataSearchRender.push(dataSearch[2]);
        dataSearchRender.push(dataSearch[3]);
        dataSearchRender.push(dataSearch[4]);
        dataSearchRender.push(dataSearch[5]);
        renderToWebsite(dataSearchRender);
        addContentPagination(currentPage);
    }
    else{
        renderToWebsite(dataSearch);
        addContentPagination(currentPage);
    }
}

function renderToWebsite(dataRender){
    htmlListInfo = "";
    htmlTitleInfo = "";
    htmlContactInfo = ""
    lengthOfDataRender = dataRender.length - 1;

    for(var count = 0; count < lengthOfDataRender; count=count+2){
        var htmlNumberStar1 = "";
        var htmlNumberStar2 = "";
        var countNumberStar1 = 0;
        var countNumberStar2 = 0;
        if(Number.isInteger(dataRender[count]['numberstar'])){
            for(var idStar1=0; idStar1 < dataRender[count]['numberstar']; idStar1++){
                htmlNumberStar1 = htmlNumberStar1 + "<span style=\"color: orange;\"><i class=\"fa-solid fa-star\"></i></span>";
                countNumberStar1 = countNumberStar1 + 1;
            }
        }
        else{
            for(var idStar1=0; idStar1 < dataRender[count+1]['numberstar']-1; idStar1++){
                htmlNumberStar1 = htmlNumberStar1 + "<span style=\"color: orange;\"><i class=\"fa-solid fa-star\"></i></span>";
                countNumberStar1 = countNumberStar1 + 1;
            }
            htmlNumberStar1 = htmlNumberStar1 + "<span style=\"color: orange;\"><i class=\"fa-solid fa-star-half-stroke\"></i></span>";
            countNumberStar1 = countNumberStar1 + 1;
        }
        if(countNumberStar1 < 5){
            for(var idStar1=countNumberStar1; idStar1 < 5; idStar1++){
                htmlNumberStar1 = htmlNumberStar1 + "<span style=\"color: orange;\"><i class=\"fa-regular fa-star\"></i></span>";
            }
        }

        if(Number.isInteger(dataRender[count+1]['numberstar'])){
            for(var idStar2=0; idStar2 < dataRender[count+1]['numberstar']; idStar2++){
                htmlNumberStar2 = htmlNumberStar2 + "<span style=\"color: orange;\"><i class=\"fa-solid fa-star\"></i></span>";
                countNumberStar2 = countNumberStar2 + 1;
            }
        }
        else{
            for(var idStar2=0; idStar2 < dataRender[count+1]['numberstar']-1; idStar2++){
                htmlNumberStar2 = htmlNumberStar2 + "<span style=\"color: orange;\"><i class=\"fa-solid fa-star\"></i></span>";
                countNumberStar2 = countNumberStar2 + 1;
            }
            htmlNumberStar2 = htmlNumberStar2 + "<span style=\"color: orange;\"><i class=\"fa-solid fa-star-half-stroke\"></i></span>";
            countNumberStar2 = countNumberStar2 + 1;
        }
        
        if(countNumberStar2 < 5){
            for(var idStar2=countNumberStar2; idStar2 < 5; idStar2++){
                htmlNumberStar2 = htmlNumberStar2 + "<span style=\"color: orange;\"><i class=\"fa-regular fa-star\"></i></span>";
            }
        }
        htmlListInfo = htmlListInfo + "<div class=\"row\">" //<div 1>

                                    + "<div class=\"col-md-6 col-sm-12 col-12\">" //<div 2>
                                    + "<a href=\"#info" + String(count+1) + "\" onclick=\"modalInfoRender(" + String(count+1) + ")\">"
                                    + "<div id=\"info" + String(count+1) + "\" class=\"card-box-c foo row\">" //<div 3>
                                    + "<div class=\"col-md-12 col-sm-12 col-12 card-header-c\">" //<div 4>
                                    + "<img class=\"img-header\" src=\"" + dataRender[count]['image1'] + "\">" + "</div>" //Close <div 4>
                                    + "<div class=\"col-md-12 col-sm-12 col-12 card-info-c\">" //<div 5>
                                    + "<div class=\"card-title-c align-self-center\">" //<div 6>
                                    
                                    + "<h2>" + dataRender[count]['title'] + "</h2>"
                                    + htmlNumberStar1
                                    + "<span style=\"font-weight: normal; color: #555555;\">"
                                    + "&nbsp;("
                                    + dataRender[count]['numberevaluation']
                                    + ")"
                                    + "</span>"
                                    + "&nbsp&nbsp Giá: "
                                    + "<span style=\"font-weight: bold; color: #2717F1;\">"
                                    + dataRender[count]['feeofcourse']
                                    + "</span>"
                                    + "<br/>"
                                    + "</div>" //Close <div 6>

                                    + "<div class=\"card-body-c\">" //<div 7>
                                    + "<p class=\"content-c\">"
                                    + "<span style=\"color: #4864ed;\">"
                                    + "<i class=\"fa-solid fa-book\"></i>&nbsp;"
                                    + "</span>"
                                    + dataRender[count]['subject']

                                    + "&nbsp;&nbsp;<span style=\"color: #d7b107;\">"
                                    + "<i class=\"fa-solid fa-medal\"></i>&nbsp;"
                                    + "</span>"
                                    + dataRender[count]['code']
                                    + "</p>"
                                    + "</div>"//Close <div 7>
                                    + "</div>"//Close <div 5>

                                    
                                    + "<div style=\"padding-left: 30px;\" class=\"col-md-12 col-sm-12 col-12\">" //<div 8>
                                    + "<div class=\"col-md-3 col-sm-3 col-3\">" //<div 9>
                                    + "<img  style=\"float:left;\" class=\"img-header-lecturers\" src=\"" + dataRender[count]['avatarlecturers'] + "\">"
                                    + "</div>" //Close <div 9>
                                    + "<div class=\"col-md-9 col-sm-9 col-9\">" //<div 10>
                                    + "<div class=\"card-body-c\">" //<div 11>
                                    + "<p class=\"content-c-course\">"
                                    + "<span style=\"color: #000000;\">"
                                    + dataRender[count]['lecturers']
                                    + "</span>"
                                    + "<span style=\"color: #555555;\">"
                                    + "<br/>"
                                    + dataRender[count]['infolecturers']
                                    + "</span>"
                                    + "</p>"
                                    + "</div>" //Close <div 11>

                                    + "</div>" //Close <div 10>
                                    + "</div>" //Close <div 8>
                                    + "</div>" //Close <div 3>
                                    + "</a>"
                                    + "</div>" //Close <div 2>

                                    + "<div class=\"col-md-6 col-sm-12 col-12\">" //<div 12>
                                    + "<a href=\"#info" + String(count+2) + "\" onclick=\"modalInfoRender(" + String(count+2) + ")\">"
                                    + "<div id=\"info" + String(count+2) + "\" class=\"card-box-c foo row\">" //<div 3>
                                    + "<div class=\"col-md-12 col-sm-12 col-12 card-header-c\">" //<div 4>
                                    + "<img class=\"img-header\" src=\"" + dataRender[count+1]['image1'] + "\">" + "</div>" //Close <div 4>
                                    + "<div class=\"col-md-12 col-sm-12 col-12 card-info-c\">" //<div 5>
                                    + "<div class=\"card-title-c align-self-center\">" //<div 6>
                                    
                                    + "<h2>" + dataRender[count+1]['title'] + "</h2>"
                                    + htmlNumberStar2
                                    + "<span style=\"font-weight: normal; color: #555555;\">"
                                    + "&nbsp;("
                                    + dataRender[count+1]['numberevaluation']
                                    + ")"
                                    + "</span>"
                                    + "&nbsp&nbsp Giá: "
                                    + "<span style=\"font-weight: bold; color: #2717F1;\">"
                                    + dataRender[count+1]['feeofcourse']
                                    + "</span>"
                                    + "<br/>"
                                    + "</div>" //Close <div 6>

                                    + "<div class=\"card-body-c\">" //<div 7>
                                    + "<p class=\"content-c\">"
                                    + "<span style=\"color: #4864ed;\">"
                                    + "<i class=\"fa-solid fa-book\"></i>&nbsp;"
                                    + "</span>"
                                    + dataRender[count+1]['subject']

                                    + "&nbsp;&nbsp;<span style=\"color: #d7b107;\">"
                                    + "<i class=\"fa-solid fa-medal\"></i>&nbsp;"
                                    + "</span>"
                                    + dataRender[count+1]['code']
                                    + "</p>"
                                    + "</div>"//Close <div 7>
                                    + "</div>"//Close <div 5>

                                    
                                    + "<div style=\"padding-left: 30px;\" class=\"col-md-12 col-sm-12 col-12\">" //<div 8>
                                    + "<div class=\"col-md-3 col-sm-3 col-3\">" //<div 9>
                                    + "<img  style=\"float:left;\" class=\"img-header-lecturers\" src=\"" + dataRender[count+1]['avatarlecturers'] + "\">"
                                    + "</div>" //Close <div 9>
                                    + "<div class=\"col-md-9 col-sm-9 col-9\">" //<div 10>
                                    + "<div class=\"card-body-c\">" //<div 11>
                                    + "<p class=\"content-c-course\">"
                                    + "<span style=\"color: #000000;\">"
                                    + dataRender[count+1]['lecturers']
                                    + "</span>"
                                    + "<span style=\"color: #555555;\">"
                                    + "<br/>"
                                    + dataRender[count+1]['infolecturers']
                                    + "</span>"
                                    + "</p>"
                                    + "</div>" //Close <div 11>

                                    + "</div>" //Close <div 10>
                                    + "</div>" //Close <div 8>
                                    + "</div>" //Close <div 3>
                                    + "</a>"
                                    + "</div>" //Close <div 12>

                                    + "</div>" //Close <div 1>
    }
// Kiểm tra nếu số phần tử lẻ thì cộng thêm phần tử cuối vào danh sách
    if(dataRender.length%2 != 0){
        var htmlNumberStar1 = "";
        var countNumberStar1 = 0;
        if(Number.isInteger(dataRender[lengthOfDataRender]['numberstar'])){
            for(var idStar1=0; idStar1 < dataRender[lengthOfDataRender]['numberstar']; idStar1++){
                htmlNumberStar1 = htmlNumberStar1 + "<span style=\"color: orange;\"><i class=\"fa-solid fa-star\"></i></span>";
                countNumberStar1 = countNumberStar1 + 1;
            }
        }
        else{
            for(var idStar1=0; idStar1 < dataRender[lengthOfDataRender]['numberstar']-1; idStar1++){
                htmlNumberStar1 = htmlNumberStar1 + "<span style=\"color: orange;\"><i class=\"fa-solid fa-star\"></i></span>";
                countNumberStar1 = countNumberStar1 + 1;
            }
            htmlNumberStar1 = htmlNumberStar1 + "<span style=\"color: orange;\"><i class=\"fa-solid fa-star-half-stroke\"></i></span>";
            countNumberStar1 = countNumberStar1 + 1;
        }

        if(countNumberStar1 < 5){
            for(var idStar1=countNumberStar1; idStar1 < 5; idStar1++){
                htmlNumberStar1 = htmlNumberStar1 + "<span style=\"color: orange;\"><i class=\"fa-regular fa-star\"></i></span>";
            }
        }

        htmlListInfo = htmlListInfo + "<div class=\"row\">"
                                    + "<div class=\"col-md-6 col-sm-12 col-12\">"
                                    + "<a href=\"#info" + String(lengthOfDataRender+1) + "\" onclick=\"modalInfoRender(" + String(lengthOfDataRender+1) + ")\">"
                                    + "<div id=\"info" + String(lengthOfDataRender+1) + "\" class=\"card-box-c foo row\">"
                                    + "<div class=\"col-md-12 col-sm-12 col-12 card-header-c\">"
                                    + "<img class=\"img-header\" src=\"" + dataRender[lengthOfDataRender]['image1'] + "\">" + "</div>"
                                    + "<div class=\"col-md-12 col-sm-12 col-12 card-info-c\">"
                                    + "<div class=\"card-title-c align-self-center\">"
                                    + "<h2>" + dataRender[lengthOfDataRender]['title'] + "</h2>"
                                    + htmlNumberStar1
                                    + "<span style=\"font-weight: normal; color: #555555;\">"
                                    + "&nbsp;("
                                    + dataRender[lengthOfDataRender]['numberevaluation']
                                    + ")"
                                    + "</span>"
                                    + "&nbsp&nbsp Giá: "
                                    + "<span style=\"font-weight: bold; color: #2717F1;\">"
                                    + dataRender[lengthOfDataRender]['feeofcourse']
                                    + "</span>"
                                    + "<br/>"
                                    + "</div>" //Close <div 6>

                                    + "<div class=\"card-body-c\">" //<div 7>
                                    + "<p class=\"content-c\">"
                                    + "<span style=\"color: #4864ed;\">"
                                    + "<i class=\"fa-solid fa-book\"></i>&nbsp;"
                                    + "</span>"
                                    + dataRender[lengthOfDataRender]['subject']

                                    + "&nbsp;&nbsp;<span style=\"color: #d7b107;\">"
                                    + "<i class=\"fa-solid fa-medal\"></i>&nbsp;"
                                    + "</span>"
                                    + dataRender[lengthOfDataRender]['code']
                                    + "</p>"
                                    + "</div>"//Close <div 7>
                                    + "</div>"//Close <div 5>

                                    
                                    + "<div style=\"padding-left: 30px;\" class=\"col-md-12 col-sm-12 col-12\">" //<div 8>
                                    + "<div class=\"col-md-3 col-sm-3 col-3\">" //<div 9>
                                    + "<img  style=\"float:left;\" class=\"img-header-lecturers\" src=\"" + dataRender[lengthOfDataRender]['avatarlecturers'] + "\">"
                                    + "</div>" //Close <div 9>
                                    + "<div class=\"col-md-9 col-sm-9 col-9\">" //<div 10>
                                    + "<div class=\"card-body-c\">" //<div 11>
                                    + "<p class=\"content-c-course\">"
                                    + "<span style=\"color: #000000;\">"
                                    + dataRender[lengthOfDataRender]['lecturers']
                                    + "</span>"
                                    + "<span style=\"color: #555555;\">"
                                    + "<br/>"
                                    + dataRender[lengthOfDataRender]['infolecturers']
                                    + "</span>"
                                    + "</p>"
                                    + "</div>" //Close <div 11>

                                    + "</div>" //Close <div 10>
                                    + "</div>" //Close <div 8>
                                    + "</div>" //Close <div 3>
                                    + "</a>"
                                    + "</div>"
                                    + "</div>";
    }

    if(checkStatusSearch == true){
        htmlTitleInfo = htmlTitleInfo + "<div class=\"col-md-12\">"
                                    + "<div class=\"title-box\">"
                                    + "<h2 class=\"title-a\">"
                                    + "<i class=\"bi bi-search\" style=\"font-size:40px;color:#2eca6a\"></i>"
                                    + "<span style=\"color: #5F6368; font-weight: normal;\"> Kết Quả </span>" + "(" + String(data.length) + " Bài)"
                                    + "</h2></div></div>";
                    
        htmlContactInfo = htmlContactInfo
                                    + "<span style=\"font-size: 2rem; font-weight: bold; color: #000000\">"
                                    + "CongVu"
                                    + "</span>&nbsp;"
                                    + "<span style=\"font-size: 2rem; font-weight: bold; color: #2717F1\">"
                                    + "Tech"
                                    + "</span>";
        
        document.getElementById("rowRenderTitle").innerHTML = htmlTitleInfo;
        document.getElementById("rowRenderInfo").innerHTML = htmlListInfo;
        document.getElementById("contractInfo").innerHTML = htmlContactInfo;
        document.getElementById('main').scrollIntoView();
    }
    else{
        htmlTitleInfo = htmlTitleInfo + "<div class=\"col-md-12\">"
                                    + "<div class=\"title-box\">"
                                    + "<h2 class=\"title-a\">"
                                    + "<i class=\"fa fa-star\" style=\"font-size:40px;color:rgb(248, 170, 1)\"></i>"
                                    + " Khóa Học Nổi Bật " + "<i class=\"fa fa-star\" style=\"font-size:40px;color:rgb(248, 170, 1)\"></i>"
                                    + "</h2></div></div>";        
        htmlContactInfo = htmlContactInfo
                                    + "<span style=\"font-size: 2rem; font-weight: bold; color: #000000\">"
                                    + "CongVu"
                                    + "</span>&nbsp;"
                                    + "<span style=\"font-size: 2rem; font-weight: bold; color: #2717F1\">"
                                    + "Tech"
                                    + "</span>";
        
        document.getElementById("rowRenderTitle").innerHTML = htmlTitleInfo;
        document.getElementById("rowRenderInfo").innerHTML = htmlListInfo;
        document.getElementById("contractInfo").innerHTML = htmlContactInfo;
        
    }
    
    
}

//Render button Pagnination
function addContentPagination(page){
    htmlPagination = "";
    htmlPagination = htmlPagination + "<button onclick=\"gotoPage(" + String(-2) + ")\">&laquo;</button>";
    for(var count = 1; count <= numberPage; count++){
      if(count != page){
        htmlPagination = htmlPagination + "<button onclick=\"gotoPage(" + String(count) +")\">" + String(count) + "</button>";
      }
      else{
        htmlPagination = htmlPagination + "<button class=\"active\" onclick=\"gotoPage(" + String(count) +")\">" + String(count) + "</button>";
      }
    }             
    htmlPagination = htmlPagination + "<button onclick=\"gotoPage(" + String(-1) + ")\">&raquo;</button>";
    document.getElementById("rowRenderPagination").innerHTML = htmlPagination;  
}

//Render Data Info when click button Pagnination
function gotoPage(page){
    dataRenderInfo = [];
    if(page == -1){        
      if(currentPage < numberPage){
        currentPage = currentPage + 1;
        startItem = (currentPage - 1)*6;
        if(currentPage == numberPage){
          endItem = data.length;
        }
        else{
          endItem = startItem + 6;
        }
        for(var count = startItem; count < endItem; count++){
            dataRenderInfo.push(data[count]);
        }       
        renderToWebsite(dataRenderInfo);
        addContentPagination(currentPage);   
      }
      else{
        return;
      }
    }
    else if(page == -2){
      if(currentPage > 1){
        currentPage = currentPage - 1;   
        startItem = (currentPage - 1)*6;
        if(currentPage == numberPage){
          endItem = data.length;
        }
        else{
          endItem = startItem + 6;
        }
        for(var count = startItem; count < endItem; count++){
            dataRenderInfo.push(data[count]);
        }       
        renderToWebsite(dataRenderInfo);
        addContentPagination(currentPage);
      }
      else{
        return;
      }
    }
    else{
      page = Number(page);
      startItem = (page-1)*6;
      if(page == numberPage){
        endItem = data.length;
      }
      else{
        endItem = startItem + 6;
      }
      currentPage = page;
      
      for(var count = startItem; count < endItem; count++){
        dataRenderInfo.push(data[count]);
      }
      renderToWebsite(dataRenderInfo);
      addContentPagination(currentPage);
    }  

}

//Function Read and Render data of Course

function renderCourseByID(idCourse){
    document.getElementById("form-search-CongvuTech").style.display = "none";
    var urlCourseByID = `${base}&sheet=${idCourse}&tq=${queryAllData}`;
    dataAll = [];
    fetch(urlCourseByID)
        .then(res => res.text())
        .then(rep => {
            
            const jsData = JSON.parse(rep.substr(47).slice(0, -2));
            
            const colz = [];
            jsData.table.cols.forEach((heading) => {
                

                if (heading.label) {
                    colz.push(heading.label.toLowerCase().replace(/\s/g, ''));
                }
            })
            
            jsData.table.rows.forEach((main) => {
                
                const row = {};
                colz.forEach((ele, ind) => {
                    
                    row[ele] = (main.c[ind] != null) ? main.c[ind].v : '';
                })
                dataAll.push(row);
                
            })            
            data = dataAll;
            console.log(data);
            renderListLesson(data);
        })

}

// Function render list Lesson of Course when user Sign In
function renderListLesson(dataRender){
    var htmlListLesson = "";
    var htmlTitleCourse = "";
    var htmlFooter = ""

    // var htmlComplete = "&nbsp;&nbsp;&nbsp;"
    //                    + "<span style=\"color: #04AA6D;\">"
    //                    + "<i class=\"fa-solid fa-medal\"></i>&nbsp;"
    //                    + "</span>"
    //                    + "<span style=\"font-weight: bold; color: #04AA6D\">Hoàn Thành"
    //                    + "</span>";
    var htmlComplete = "";
    var htmlIncomplete = "";
    
    // var htmlIncomplete = "&nbsp;&nbsp;&nbsp;"
    //                     + "<span style=\"color: #DEDFE1;\">"
    //                     + "<i class=\"fa-solid fa-medal\"></i>&nbsp;"
    //                     + "</span>"
    //                     + "<span style=\"font-weight: bold; color: #DEDFE1\">Chưa Hoàn Thành"
    //                     + "</span>";
    
    var achievementsOfUser = Number(getCookie("achievements_of_user")) - 1;
    var htmlStatusLesson1 = "";
    var htmlStatusLesson2 = "";

    lengthOfDataRender = dataRender.length - 1;



    for(var count = 0; count < lengthOfDataRender; count=count+2){
        if(count < achievementsOfUser){
            htmlStatusLesson1 = htmlComplete;
            htmlStatusLesson2 = htmlComplete;
        }
        else if(count == achievementsOfUser){
            htmlStatusLesson1 = htmlComplete;
            htmlStatusLesson2 = htmlIncomplete;
        }
        else{
            htmlStatusLesson1 = htmlIncomplete;
            htmlStatusLesson2 = htmlIncomplete;
        }
        htmlListLesson = htmlListLesson + "<div class=\"row\">" //<div 1>

                                    + "<div class=\"col-md-6 col-sm-12 col-12\">" //<div 2>
                                    + "<a href=\"#info" + String(count+1) + "\" onclick=\"modalInfoRender(" + String(count+1) + ")\">"
                                    + "<div id=\"info" + String(count+1) + "\" class=\"card-box-c foo row\">" //<div 3>
                                    + "<div class=\"col-md-12 col-sm-12 col-12 card-header-c\">" //<div 4>
                                    + "<img class=\"img-header\" src=\"" + dataRender[count]['image1'] + "\">" + "</div>" //Close <div 4>
                                    + "<div class=\"col-md-12 col-sm-12 col-12 card-info-c\">" //<div 5>
                                    + "<div class=\"card-title-c align-self-center\">" //<div 6>
                                    
                                    + "<h2>" + dataRender[count]['lesson'] + "</h2>"
                                    
                                    + "</div>" //Close <div 6>

                                    + "<div class=\"card-body-c\">" //<div 7>
                                    + "<p class=\"content-c\">"
                                    
                                    + htmlStatusLesson1

                                    + "</p>"
                                    + "</div>"//Close <div 7>
                                    + "</div>"//Close <div 5>
                                    
                                    + "</div>" //Close <div 3>
                                    + "</a>"
                                    + "</div>" //Close <div 2>

                                    + "<div class=\"col-md-6 col-sm-12 col-12\">" //<div 12>
                                    + "<a href=\"#info" + String(count+2) + "\" onclick=\"modalInfoRender(" + String(count+2) + ")\">"
                                    + "<div id=\"info" + String(count+2) + "\" class=\"card-box-c foo row\">" //<div 3>
                                    + "<div class=\"col-md-12 col-sm-12 col-12 card-header-c\">" //<div 4>
                                    + "<img class=\"img-header\" src=\"" + dataRender[count+1]['image1'] + "\">" + "</div>" //Close <div 4>
                                    + "<div class=\"col-md-12 col-sm-12 col-12 card-info-c\">" //<div 5>
                                    + "<div class=\"card-title-c align-self-center\">" //<div 6>
                                    
                                    + "<h2>" + dataRender[count+1]['lesson'] + "</h2>"
                                    
                                    + "</div>" //Close <div 6>

                                    + "<div class=\"card-body-c\">" //<div 7>
                                    + "<p class=\"content-c\">"

                                    + htmlStatusLesson2

                                    + "</p>"
                                    + "</div>"//Close <div 7>
                                    + "</div>"//Close <div 5>

                                    + "</div>" //Close <div 3>
                                    + "</a>"
                                    + "</div>" //Close <div 12>

                                    + "</div>" //Close <div 1>
    }
    
// Kiểm tra nếu số phần tử lẻ thì cộng thêm phần tử cuối vào danh sách
    if(dataRender.length%2 != 0){
        if(achievementsOfUser < lengthOfDataRender){
            htmlStatusLesson1 = htmlIncomplete;
        }
        else{
            htmlStatusLesson1 = htmlComplete;
        }
        htmlListLesson = htmlListLesson + "<div class=\"row\">"
                                    + "<div class=\"col-md-6 col-sm-12 col-12\">"
                                    + "<a href=\"#info" + String(lengthOfDataRender+1) + "\" onclick=\"modalInfoRender(" + String(lengthOfDataRender+1) + ")\">"
                                    + "<div id=\"info" + String(lengthOfDataRender+1) + "\" class=\"card-box-c foo row\">"
                                    + "<div class=\"col-md-12 col-sm-12 col-12 card-header-c\">"
                                    + "<img class=\"img-header\" src=\"" + dataRender[lengthOfDataRender]['image1'] + "\">" + "</div>"
                                    + "<div class=\"col-md-12 col-sm-12 col-12 card-info-c\">"
                                    + "<div class=\"card-title-c align-self-center\">"
                                    + "<h2>" + dataRender[lengthOfDataRender]['lesson'] + "</h2>"
                                    
                                    + "</div>" //Close <div 6>

                                    + "<div class=\"card-body-c\">" //<div 7>
                                    + "<p class=\"content-c\">"

                                    + htmlStatusLesson1

                                    
                                    + "</p>"
                                    + "</div>"//Close <div 7>
                                    + "</div>"//Close <div 5>

                                    + "</div>" //Close <div 3>
                                    + "</a>"
                                    + "</div>"
                                    + "</div>";
    
    }
    
    htmlTitleCourse = htmlTitleCourse + "<div style=\"padding-top: 100px;\" class=\"col-md-12\">"
                                + "<div class=\"title-box\">"
                                + "<h2 class=\"title-a\">"
                                + "<i class=\"fa fa-star\" style=\"font-size:40px;color:rgb(248, 170, 1)\"></i>"
                                + " Khóa Học "
                                + "<i class=\"fa fa-star\" style=\"font-size:40px;color:rgb(248, 170, 1)\"></i>"
                                + "<br/>"
                                + "<span style=\"color: #682321\">"
                                + getCookie("title_course")
                                + "</span>"
                                + "</h2></div></div>";
    
                                htmlFooter = htmlFooter
                                + "<span style=\"font-size: 2rem; font-weight: bold; color: #000000\">"
                                + "CongVu"
                                + "</span>&nbsp;"
                                + "<span style=\"font-size: 2rem; font-weight: bold; color: #2717F1\">"
                                + "Tech"
                                + "</span>";
    
    document.getElementById("rowRenderTitle").innerHTML = htmlTitleCourse;
    document.getElementById("rowRenderInfo").innerHTML = htmlListLesson;
    document.getElementById("contractInfo").innerHTML = htmlFooter;
        
    
}

// Function check status Account when Sign In to Learn Course
function checkAccount(idCourse, yourUsername, yourPassword, titleOfCourse){
    var sheetNameStudent = 'InfoStudent';
    var qu_CheckStudent = 'Select E, F WHERE A != "" AND B = "' + yourUsername + '" AND C = "' + yourPassword + '" AND D = "' + idCourse + '"';
    
    var queryCheckStudent = encodeURIComponent(qu_CheckStudent);
    var urlCheckStudent = `${base}&sheet=${sheetNameStudent}&tq=${queryCheckStudent}`;

    var dataCheckStudent = [];
    fetch(urlCheckStudent)
        .then(res => res.text())
        .then(rep => {
            
            const jsData = JSON.parse(rep.substr(47).slice(0, -2));
            
            const colz = [];
            jsData.table.cols.forEach((heading) => {
                

                if (heading.label) {
                    colz.push(heading.label.toLowerCase().replace(/\s/g, ''));
                }
            })
            
            jsData.table.rows.forEach((main) => {
                
                const row = {};
                colz.forEach((ele, ind) => {
                    
                    row[ele] = (main.c[ind] != null) ? main.c[ind].v : '';
                })
                dataCheckStudent.push(row);
                
            })
            
            if(dataCheckStudent.length == 0){
                alert("Bạn nhập tài khoản hoặc mật khẩu không đúng!");
            }
            else if(dataCheckStudent[0]['status'] == "expired"){
                alert("Tài khoản của bạn đã hết hạn!");
            }
            else if(dataCheckStudent[0]['status'] == "active"){
                setCookie("username", yourUsername, 8, "title_course", titleOfCourse, "achievements_of_user", dataCheckStudent[0]['achievements']);
                runToCourse(idCourse, yourUsername);
                //Chỗ này khi chuyển trang sang khóa học của User thì load lại biến nên lưu cũng như không!!!
                //achievementsOfUser = dataCheckStudent[0]['achievements'];
                //nameOfCourseCurrent = titleOfCourse;
            }
        })
}

// Function Set Cookie for Username actived
function setCookie(cname,cvalue,exhours,courseName,courseValue,achievementsOfUserName,achievementsOfUserValue) {
    const d = new Date();
    d.setTime(d.getTime() + (exhours*60*60*1000));
    let expires = "expires=" + d.toUTCString();

    //document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    document.cookie = courseName + "=" + courseValue + ";" + expires + ";path=/";
    document.cookie = achievementsOfUserName + "=" + achievementsOfUserValue + ";" + expires + ";path=/";
    
}

// Function Get Cookie Username
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

// Function Check Cookie Username
function checkCookie(userCurrent, idCourse) {
    let user = getCookie("username");
    if (user != "" && user == userCurrent) {
        alert("Chúc bạn học tập hiệu quả!");
        renderCourseByID(idCourse);
    } else {
        alert("Bạn cần đăng nhập lại để tiếp tục học!");
    }
}

// Run to Course for user learn
function runToCourse(idCourse, yourUsername){
      
    var linkRunToCourse = "https://congvu-tech.github.io/course.html?id=" + idCourse + "&user=" + yourUsername;
    //var linkRunToCourse = "http://localhost/congvu-tech.github.io-main/course.html?id=" + idCourse + "&user=" + yourUsername;
    
    window.location.href = linkRunToCourse;
}
