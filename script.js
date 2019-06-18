var wrapper = document.querySelector('.js-calendar'),
    wrModal = document.querySelector('.js-modal'),
    wrPanelMonth = document.querySelector('.js-calendar__panel'),
    titleMonthCur = document.querySelector('.js-month-cur'),
    modalText = document.querySelector('.js-tasks'),
    storage = localStorage, // sessionStorage
    curYear = 2019,
    curMonth = 0,
    qtyDays = getDaysInMonth(curYear, curMonth),
    arrMonth = ['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'],
    
    keyCurDate;

wrPanelMonth.addEventListener('click', function(e) {
    // console.log( include(e.target.classList, 'js-modal') );
    var curClass = e.target.className;

    if(curClass === 'js-month-prev') {
        curMonth--;
    } else if(curClass === 'js-month-next') {
        curMonth++;
    }

    if(curMonth < 0) {
        curMonth = 11;
        curYear--;
    } else if(curMonth > 11) {
        curMonth = 0;
        curYear++;
    }
    qtyDays = getDaysInMonth(curYear, curMonth);

    createCalendar(wrapper, qtyDays, curMonth, curYear);
}, false);

wrModal.addEventListener('click', function(e) {
    // console.log( include(e.target.classList, 'js-modal') );
    var arrClass = e.target.classList;

    if( include(arrClass, 'js-modal') || include(arrClass, 'js-cancel') ) {
        isOpenModalWindow(false, wrModal);
    } else if( include(arrClass, 'js-save') ) {
        writeToJSON(storage, keyCurDate, modalText.value);
        isOpenModalWindow(false, wrModal);
    }
}, false);


createCalendar(wrapper, qtyDays, curMonth, curYear);

function createCalendar(wrapper, days, curMonth, curYear) {
    titleMonthCur.innerText = arrMonth[curMonth] + ' : ' + curYear;

    wrapper.innerHTML = '';
    for (var i = 1; i <= days; i++) {
        wrapper.appendChild( createDay(i, curMonth, curYear) );
    }
}

function createDay(nDay, curMonth, curYear) {
    var wr = document.createElement('div'),
        title = document.createElement('label');

    wr.className = 'day';
    title.className = 'day__title';

    wr.setAttribute('data-key', `${nDay}-${curMonth}-${curYear}`);
    title.innerText = nDay;
    wr.appendChild(title);

    wr.addEventListener('click', function() {
        isOpenModalWindow(true, wrModal);
        keyCurDate = this.getAttribute('data-key');
        modalText.value = readFromJSON( storage, keyCurDate );
        modalText.focus();
    }, false);

    return wr;
}

function getDaysInMonth(year, month) {
    var isLeapYear = ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
    return [31, (isLeapYear ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
}

function include(arr, val) {
    var i = arr.length;
    while(i-- > -1) {
        if(arr[i] === val) return true;
    }
    return false;
}


function isOpenModalWindow(isShow, wrModal) {
    wrModal.style.display = (isShow ? 'block' : 'none');
}


function readFromJSON(storage, key) {
    return JSON.parse( storage.getItem(key) );
}
function writeToJSON(storage, key, value) {
    try {
        value = JSON.stringify(value);
        storage.setItem(key, value);

        return true;
    } catch(err) {
        return false;
    }
}