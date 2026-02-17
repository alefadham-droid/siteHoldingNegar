// ================ توابع مدیریت جدول ================

let dataRows = [
    { day: 1, birds: 1000, weight: 150, feed: 50, mortality: 2 }
];

// نمایش جدول
window.renderTable = function() {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    dataRows.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="number" value="${row.day}" onchange="updateRow(${index}, 'day', this.value)"></td>
            <td><input type="number" value="${row.birds}" onchange="updateRow(${index}, 'birds', this.value)"></td>
            <td><input type="number" value="${row.weight}" onchange="updateRow(${index}, 'weight', this.value)"></td>
            <td><input type="number" value="${row.feed}" onchange="updateRow(${index}, 'feed', this.value)"></td>
            <td><input type="number" value="${row.mortality}" onchange="updateRow(${index}, 'mortality', this.value)"></td>
            <td><button class="delete-btn" onclick="deleteRow(${index})">🗑️</button></td>
        `;
        tbody.appendChild(tr);
    });
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
