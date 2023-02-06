const sheetID = '1OYB2bK5t7vQoBq5t1b1EDrbjqXTaoBYWTxtea4ZDzsE';
const base = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`;

let sheetName = 'Blog';
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

                
                data = dataAll;
                renderNewsByID(idNews);   
                numberPage = 1;
                currentPage = 1;         
                addContentPagination(currentPage);
                modalInfoRender(1);
            })
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
        for(var count = dataAll.length - 1; count >= 0; count--){
            if(IndexSubject == "0"){
                dataSearch.push(dataAll[count]);
            }
            else if(dataAll[count]['indexsubject'] == IndexSubject){
                dataSearch.push(dataAll[count]);
            }
        }        
    }
    else{
        if(IndexSubject == "0"){
            dataSearch = dataAll;
        }
        else{
            for(var count = 0; count < dataAll.length; count++){
                if(dataAll[count]['indexsubject'] == IndexSubject){
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
}

function renderToWebsite(dataRender){
    htmlListInfo = "";
    htmlTitleInfo = "";
    htmlContactInfo = ""
    lengthOfDataRender = dataRender.length - 1;

    for(var count = 0; count < lengthOfDataRender; count=count+2){
        htmlListInfo = htmlListInfo + "<div class=\"row\">"

                                    + "<div class=\"col-md-6 col-sm-12 col-12\">"
                                    + "<a href=\"#info" + String(count+1) + "\" onclick=\"modalInfoRender(" + String(count+1) + ")\">"
                                    + "<div id=\"info" + String(count+1) + "\" class=\"card-box-c foo row\">"
                                    + "<div class=\"col-md-12 col-sm-12 col-12 card-header-c\">"
                                    + "<img class=\"img-header\" src=\"" + dataRender[count]['image1'] + "\">" + "</div>"
                                    + "<div class=\"col-md-12 col-sm-12 col-12 card-info-c\">"
                                    + "<div class=\"card-title-c align-self-center\">"
                                    + "<h2>" + dataRender[count]['title'] + "</h2>"
                                    + "</div>"
                                    + "<div class=\"card-body-c\">"
                                    + "<p class=\"content-c\">"
                                    + "<span style=\"color: #4864ed;\">"
                                    + "<i class=\"fa-solid fa-book\"></i>&nbsp;"
                                    + "</span>"
                                    + dataRender[count]['subject']

                                    + "&nbsp;&nbsp;<span style=\"color: #d7b107;\">"
                                    + "<i class=\"fa-solid fa-medal\"></i>&nbsp;"
                                    + "</span>"
                                    + dataRender[count]['code']

                                    + "<br/>"
                                    + "<span style=\"color: #555555;\">"
                                    + dataRender[count]['description']
                                    + "</span>"
                                    + "</p>"
                                    + "<p class=\"content-c\">"
                                    + dataRender[count]['dateupload']
                                    + "</p>"
                                    + "</div>"
                                    + "</div>"
                                    + "</div>"
                                    + "</a>"
                                    + "</div>"

                                    + "<div class=\"col-md-6 col-sm-12 col-12\">"
                                    + "<a href=\"#info" + String(count+2) + "\" onclick=\"modalInfoRender(" + String(count+2) + ")\">"
                                    + "<div id=\"info" + String(count+2) + "\" class=\"card-box-c foo row\">"
                                    + "<div class=\"col-md-12 col-sm-12 col-12 card-header-c\">"
                                    + "<img class=\"img-header\" src=\"" + dataRender[count+1]['image1'] + "\">" + "</div>"
                                    + "<div class=\"col-md-12 col-sm-12 col-12 card-info-c\">"
                                    + "<div class=\"card-title-c align-self-center\">"
                                    + "<h2>" + dataRender[count+1]['title'] + "</h2>"
                                    + "</div>"
                                    + "<div class=\"card-body-c\">"
                                    + "<p class=\"content-c\">"
                                    + "<span style=\"color: #4864ed;\">"
                                    + "<i class=\"fa-solid fa-book\"></i>&nbsp;"
                                    + "</span>"
                                    + dataRender[count+1]['subject']

                                    + "&nbsp;&nbsp;<span style=\"color: #d7b107;\">"
                                    + "<i class=\"fa-solid fa-medal\"></i>&nbsp;"
                                    + "</span>"
                                    + dataRender[count+1]['code']

                                    + "<br/>"
                                    + "<span style=\"color: #555555;\">"
                                    + dataRender[count+1]['description']
                                    + "</span>"
                                    + "</p>"
                                    + "<p class=\"content-c\">"
                                    + dataRender[count+1]['dateupload']
                                    + "</p>"
                                    + "</div>"
                                    + "</div>"
                                    + "</div>"
                                    + "</a>"
                                    + "</div>"

                                    + "</div>";
    }
// Kiểm tra nếu số phần tử lẻ thì cộng thêm phần tử cuối vào danh sách
    if(dataRender.length%2 != 0){
        htmlListInfo = htmlListInfo + "<div class=\"row\">"
                                    + "<div class=\"col-md-6 col-sm-12 col-12\">"
                                    + "<a href=\"#info" + String(lengthOfDataRender+1) + "\" onclick=\"modalInfoRender(" + String(lengthOfDataRender+1) + ")\">"
                                    + "<div id=\"info" + String(lengthOfDataRender+1) + "\" class=\"card-box-c foo row\">"
                                    + "<div class=\"col-md-12 col-sm-12 col-12 card-header-c\">"
                                    + "<img class=\"img-header\" src=\"" + dataRender[lengthOfDataRender]['image1'] + "\">" + "</div>"
                                    + "<div class=\"col-md-12 col-sm-12 col-12 card-info-c\">"
                                    + "<div class=\"card-title-c align-self-center\">"
                                    + "<h2>" + dataRender[lengthOfDataRender]['title'] + "</h2>"
                                    + "</div>"
                                    + "<div class=\"card-body-c\">"
                                    + "<p class=\"content-c\">"
                                    + "<span style=\"color: #4864ed;\">"
                                    + "<i class=\"fa-solid fa-book\"></i>&nbsp;"
                                    + "</span>"
                                    + dataRender[lengthOfDataRender]['subject']

                                    + "&nbsp;&nbsp;<span style=\"color: #d7b107;\">"
                                    + "<i class=\"fa-solid fa-medal\"></i>&nbsp;"
                                    + "</span>"
                                    + dataRender[lengthOfDataRender]['code']

                                    + "<br/>"
                                    + "<span style=\"color: #555555;\">"
                                    + dataRender[lengthOfDataRender]['description']
                                    + "</span>"
                                    + "</p>"
                                    + "<p class=\"content-c\">"
                                    + dataRender[lengthOfDataRender]['dateupload']
                                    + "</p>"
                                    + "</div>"
                                    + "</div>"
                                    + "</div>"
                                    + "</a>"
                                    + "</div>"
                                    + "</div>";
    }

    if(checkStatusSearch == true){
        htmlTitleInfo = htmlTitleInfo + "<div class=\"col-md-12\">"
                                    + "<div class=\"title-box\">"
                                    + "<h2 class=\"title-a\">"
                                    + "<i class=\"bi bi-search\" style=\"font-size:48px;color:#2eca6a\"></i>"
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
                                    + "<i class=\"fa fa-star\" style=\"font-size:48px;color:rgb(248, 170, 1)\"></i>"
                                    + " Bài Nổi Bật " + "<i class=\"fa fa-star\" style=\"font-size:48px;color:rgb(248, 170, 1)\"></i>"
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

