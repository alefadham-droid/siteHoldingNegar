// ================ توابع تبدیل تاریخ شمسی ================

function gregorianToJalali(gy, gm, gd) {
    let g_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let j_days_in_month = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
    
    let gy2 = (gm > 2) ? (gy + 1) : gy;
    let days = 365 * (gy + 1) + Math.floor((gy2 - 1) / 4) - Math.floor((gy2 - 1) / 100) + Math.floor((gy2 - 1) / 400);
    
    for (let i = 0; i < gm - 1; i++) {
        if (i === 1 && ((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0)) {
            days += 29;
        } else {
            days += g_days_in_month[i];
        }
    }
    days += gd;
    
    let jy = 979;
    let jm = 1;
    let jd = 1;
    
    days -= 226896;
    
    while (days >= (365 * 4 + 1) * 4) {
        days -= (365 * 4 + 1) * 4;
        jy += 4;
    }
    
    while (days >= 365) {
        if ((jy % 4 === 2 && jy % 128 !== 0) || (jy % 1320 === 3)) {
            days -= 366;
        } else {
            days -= 365;
        }
        jy++;
    }
    
    while (days >= j_days_in_month[jm - 1]) {
        days -= j_days_in_month[jm - 1];
        jm++;
    }
    
    jd = days + 1;
    
    return { jy, jm, jd };
}

function jalaliToGregorian(jy, jm, jd) {
    let j_days_in_month = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
    
    let days = 0;
    for (let i = 0; i < jm - 1; i++) {
        days += j_days_in_month[i];
    }
    days += jd;
    
    let gy = jy - 979;
    let gm = 1;
    let gd = 1;
    
    days += 79;
    
    if (days > 366 && (gy % 4 === 1 && gy % 128 !== 0) || (gy % 1320 === 2)) {
        days--;
    }
    
    while (days > 365) {
        if ((gy % 4 === 1 && gy % 128 !== 0) || (gy % 1320 === 2)) {
            days -= 366;
        } else {
            days -= 365;
        }
        gy++;
    }
    
    if (days === 0) {
        gy--;
        days = (gy % 4 === 1 && gy % 128 !== 0) || (gy % 1320 === 2) ? 366 : 365;
    }
    
    for (let i = 0; i < 12; i++) {
        let monthDays = i === 1 && ((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0) ? 29 : 
                        [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][i];
        
        if (days <= monthDays) {
            gm = i + 1;
            gd = days;
            break;
        }
        days -= monthDays;
    }
    
    return { gy, gm, gd };
}

function getTodayJalali() {
    const today = new Date();
    const j = gregorianToJalali(today.getFullYear(), today.getMonth() + 1, today.getDate());
    return `${j.jy}/${j.jm.toString().padStart(2, '0')}/${j.jd.toString().padStart(2, '0')}`;
}

function jalaliToDateString(jalaliDate) {
    if (!jalaliDate || !jalaliDate.includes('/')) return new Date().toISOString().split('T')[0];
    
    const [jy, jm, jd] = jalaliDate.split('/').map(Number);
    const g = jalaliToGregorian(jy, jm, jd);
    return `${g.gy}-${g.gm.toString().padStart(2, '0')}-${g.gd.toString().padStart(2, '0')}`;
}

// ================ توابع مدیریت جدول ================

let dataRows = [
    { day: 1, birds: 1000, weight: 150, feed: 50, mortality: 2 }
];

// نمایش جدول با تاریخ شمسی
window.renderTable = function() {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    dataRows.forEach((row, index) => {
        // محاسبه تاریخ شمسی بر اساس روز
        let jalaliDate = '1402/12/01';
        if (index === 0) {
            jalaliDate = document.getElementById('jalaliDate')?.textContent || '1402/12/01';
        } else {
            // محاسبه تاریخ روزهای بعد (فرض می‌کنیم هر روز یک روز بعد است)
            const [jy, jm, jd] = jalaliDate.split('/').map(Number);
            const g = jalaliToGregorian(jy, jm, jd);
            const date = new Date(g.gy, g.gm - 1, g.gd + index);
            const j = gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
            jalaliDate = `${j.jy}/${j.jm.toString().padStart(2, '0')}/${j.jd.toString().padStart(2, '0')}`;
        }
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="number" value="${row.day}" onchange="updateRow(${index}, 'day', this.value)"></td>
            <td><input type="text" value="${jalaliDate}" onchange="updateRowDate(${index}, this.value)" placeholder="1402/12/01"></td>
            <td><input type="number" value="${row.birds}" onchange="updateRow(${index}, 'birds', this.value)"></td>
            <td><input type="number" value="${row.weight}" onchange="updateRow(${index}, 'weight', this.value)"></td>
            <td><input type="number" value="${row.feed}" onchange="updateRow(${index}, 'feed', this.value)"></td>
            <td><input type="number" value="${row.mortality}" onchange="updateRow(${index}, 'mortality', this.value)"></td>
            <td><button class="delete-btn" onclick="deleteRow(${index})">🗑️</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// تابع جدید برای به‌روزرسانی تاریخ
window.updateRowDate = function(index, value) {
    // تاریخ رو ذخیره می‌کنیم توی یک ویژگی سفارشی
    if (!dataRows[index].jalaliDate) {
        dataRows[index].jalaliDate = {};
    }
    dataRows[index].jalaliDate = value;
}

// افزودن ردیف جدید
window.addRow = function() {
    const lastRow = dataRows[dataRows.length - 1] || { day: 0, birds: 0, weight: 0, feed: 0, mortality: 0 };
    dataRows.push({
        day: lastRow.day + 1,
        birds: lastRow.birds,
        weight: 0,
        feed: 0,
        mortality: 0
    });
    renderTable();
}

// به‌روزرسانی ردیف
window.updateRow = function(index, field, value) {
    dataRows[index][field] = parseFloat(value) || 0;
}

// حذف ردیف
window.deleteRow = function(index) {
    dataRows.splice(index, 1);
    renderTable();
}

// ریست جدول
window.resetTable = function() {
    dataRows = [
        { day: 1, birds: 1000, weight: 150, feed: 50, mortality: 2 }
    ];
    renderTable();
    document.getElementById('resultsGrid').innerHTML = '';
}

// محاسبه همه مقادیر
window.calculateAll = function() {
    let totalBirds = dataRows[0].birds;
    let totalMortality = 0;
    let totalFeed = 0;
    let totalWeight = 0;
    
    dataRows.forEach(row => {
        totalMortality += row.mortality;
        totalFeed += row.feed;
        totalWeight += (row.weight * row.birds) / 1000;
    });
    
    let avgBirds = totalBirds - (totalMortality / 2);
    let fcr = totalFeed / (totalWeight / 1000);
    let mortalityPercent = (totalMortality / totalBirds) * 100;
    
    const resultsGrid = document.getElementById('resultsGrid');
    if (!resultsGrid) return;
    
    resultsGrid.innerHTML = `
        <div class="result-item">
            <h4>ضریب تبدیل غذایی (FCR)</h4>
            <div class="result-value">${fcr.toFixed(2)}</div>
            <small>کیلوگرم دان به ازای هر کیلوگرم گوشت</small>
        </div>
        <div class="result-item">
            <h4>درصد تلفات</h4>
            <div class="result-value">${mortalityPercent.toFixed(2)}%</div>
            <small>${totalMortality} پرنده تلف شده</small>
        </div>
        <div class="result-item">
            <h4>سرانه مصرف دان</h4>
            <div class="result-value">${(totalFeed / avgBirds).toFixed(2)}</div>
            <small>کیلوگرم به ازای هر پرنده</small>
        </div>
        <div class="result-item">
            <h4>متوسط وزن</h4>
            <div class="result-value">${(totalWeight / totalBirds * 1000).toFixed(0)}</div>
            <small>گرم به ازای هر پرنده</small>
        </div>
        <div class="result-item">
            <h4>شاخص کارایی (EPEF)</h4>
            <div class="result-value">${((100 - mortalityPercent) * (totalWeight / totalBirds * 1000) / (fcr * 10)).toFixed(0)}</div>
            <small>اروپایی</small>
        </div>
        <div class="result-item">
            <h4>کل تولید گوشت</h4>
            <div class="result-value">${(totalWeight).toFixed(2)}</div>
            <small>کیلوگرم</small>
        </div>
    `;
}

// مقداردهی اولیه
document.addEventListener('DOMContentLoaded', function() {
    renderTable();
});
