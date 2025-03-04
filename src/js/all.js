let data = []; //取得的資料
let areaSelect = document.querySelector('.select-area');
let areaNav = document.querySelector('.btn-nav');
let areaTitle = document.querySelector('.area-title');
let areaData = document.querySelector('.data-area');
let pageList = document.querySelector('.pagination');
let allPages = document.querySelectorAll('.page-link');
let currentPage = 1;
let totalPage = 0;

let xhr = new XMLHttpRequest();
xhr.open('GET', 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json', true);
xhr.send(null);
//初始載入時
xhr.onload = function () {
    let data = JSON.parse(xhr.responseText);
    let dataTarget = data.result.records;
    let optionArray = `<option selected disabled>-- 請選擇行政區 --</option>`;
    //取得所有行政區
    let everyZone = dataTarget.map((item) => {
        return item.Zone;
    });
    //篩選掉重複的行政區
    let SetEveryZone = [...new Set(everyZone)];
    //顯示到下拉選單中
    for (let i = 0; i < SetEveryZone.length; i++) {
        optionArray += `<option value="${SetEveryZone[i]}">${SetEveryZone[i]}</option>`;
        areaSelect.innerHTML = optionArray;
    }
    showData('三民區');
};

//取得資料，並顯示在頁面上
function showData(area) {
    let data = JSON.parse(xhr.responseText);
    let dataTarget = data.result.records;
    let dataArray = '';
    let pageArray = '';

    //把資料的每一個地區取出來
    let everyZone = dataTarget.map((item) => {
        return item.Zone;
    });

    //過濾符合的資料
    let filterArea = dataTarget.filter((item) => {
        return item.Zone == area;
    });

    //將符合的資料筆數 / 每一頁最多顯示比數 = 向上取正數
    let pageNum = Math.ceil(filterArea.length / 4);
    totalPage = pageNum;
    let sliceData = filterArea.slice(0, 4);

    if (!pageNum) {
        pageList.innerHTML = '';
    } else {
        //顯示正確的頁碼數量
        for (let i = 0; i < pageNum; i++) {
            pageArray += `
            <li class="page-item"><a class="page-link" href="#">${i + 1}</a></li>
        `;
        }
        pageList.innerHTML = `
        <li class="page-item">
            <a class="page-link" href="#">
                <span>&laquo;prev</span>
            </a>
        </li>
        ${pageArray}
        <li class="page-item">
            <a class="page-link" href="#">
                <span>next&raquo;</span>
            </a>
        </li>
    `;
        //頁碼監聽綁定事件
        let allPages = document.querySelectorAll('.page-link');
        for (let i = 0; i < allPages.length; i++) {
            allPages[i].addEventListener('click', function (event) {
                changeData(event);
            });
        }
    }

    //查詢資料有無選擇的地區
    if (everyZone.includes(area)) {
        for (let i = 0; i < sliceData.length; i++) {
            if (sliceData[i].Zone == area) {
                let tel = sliceData[i].Tel;
                let NewTel = tel.replace('886-', 0);
                dataArray += `
                    <div class='col-md-6'>
                        <div class='card mb-4 rounded-0 border border-0 shadow'>
                            <div class='position-relative'>
                                <div class='card-img-container'>
                                    <img src='${sliceData[i].Picture1}' class='card-img-top rounded-0'>
                                </div>
                                <div class='card-img-overlay text-white d-flex justify-content-between align-items-end pb-1'>
                                    <h4 class='card-title fw-normal'>${sliceData[i].Name}</h4>
                                    <p class='mb-2'>${sliceData[i].Zone}</p>
                                </div>
                            </div>
                            <div class='card-body'>
                                <div class='time mt-2'>${sliceData[i].Opentime}</div>
                                <div class='location mt-2'>${sliceData[i].Add}</div>
                                <div class='d-flex justify-content-between mt-2'>
                                    <div class='phone'>${NewTel}</div>
                                    <div class='tag'>${sliceData[i].Ticketinfo}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
            areaData.innerHTML = dataArray;
        }
    } else {
        areaData.innerHTML = `<p>查無資料</p>`;
    }
}

//處理點擊頁碼時
function changeData(event) {
    event.preventDefault();

    //處理點擊頁碼時的樣式，先全部刪除，再加上class
    let allPages = document.querySelectorAll('.page-link');
    for (let i = 0; i < allPages.length; i++) {
        allPages[i].classList.remove('active');
        allPages[i].parentNode.classList.remove('active');
    }
    let targetItem = event.target.parentNode;
    targetItem.classList.add('active');

    //我目前所點擊的頁面
    //得到1 我就要算出0,3
    //得到2 我就要算出4,7
    //得到3 我就要算出8,11
    let targetPage = event.target.textContent.trim();

    if (targetPage == '«prev' && currentPage > 1) {
        currentPage--;
    } else if (targetPage == '«prev' && currentPage <= 1) {
        return;
    } else if (targetPage == 'next»' && currentPage >= totalPage) {
        return;
    } else if (targetPage == 'next»') {
        currentPage++;
    } else {
        currentPage = targetPage;
    }

    //計算出顯示區間
    let startIndex = (currentPage - 1) * 4;
    let endIndex = (currentPage - 1) * 4 + 3;

    let data = JSON.parse(xhr.responseText);
    let dataTarget = data.result.records;
    let filterData = dataTarget.filter((item) => {
        return item.Zone == areaTitle.textContent;
    });
    let sliceData = filterData.slice(startIndex, endIndex + 1);
    let areaDataArray = '';

    for (let i = 0; i < sliceData.length; i++) {
        let tel = sliceData[i].Tel;
        let NewTel = tel.replace('886-', 0);
        areaDataArray += `
            <div class='col-md-6'>
                <div class='card mb-4 rounded-0 border border-0 shadow'>
                    <div class='position-relative'>
                        <div class='card-img-container'>
                            <img src='${sliceData[i].Picture1}' class='card-img-top rounded-0'>
                        </div>
                        <div class='card-img-overlay text-white d-flex justify-content-between align-items-end pb-1'>
                            <h4 class='card-title fw-normal'>${sliceData[i].Name}</h4>
                            <p class='mb-2'>${sliceData[i].Zone}</p>
                        </div>
                    </div>
                    <div class='card-body'>
                        <div class='time mt-2'>${sliceData[i].Opentime}</div>
                        <div class='location mt-2'>${sliceData[i].Add}</div>
                        <div class='d-flex justify-content-between mt-2'>
                            <div class='phone'>${NewTel}</div>
                            <div class='tag'>${sliceData[i].Ticketinfo}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    areaData.innerHTML = areaDataArray;
}

//切換下拉選單時
areaSelect.addEventListener('change', function () {
    let target = this.value;
    areaTitle.textContent = target;
    showData(target);
});

//點擊熱門按鈕時
areaNav.addEventListener('click', function (event) {
    let target = event.target.value;
    areaTitle.textContent = target;
    showData(target);
    areaSelect.selectedIndex = 0;
});
