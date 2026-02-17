// داده‌های اولیه
let dataRows = [
    { day: 1, birds: 1000, weight: 150, feed: 50, mortality: 2 }
];

// نمایش جدول
function renderTable() {
    const tbody = document.getElementById('tableBody');
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
function addRow() {
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
function updateRow(index, field, value) {
    dataRows[index][field] = parseFloat(value) || 0;
}

// حذف ردیف
function deleteRow(index) {
    dataRows.splice(index, 1);
    renderTable();
}

// ریست جدول
function resetTable() {
    dataRows = [
        { day: 1, birds: 1000, weight: 150, feed: 50, mortality: 2 }
    ];
    renderTable();
    document.getElementById('resultsGrid').innerHTML = '';
}

// محاسبه همه مقادیر
function calculateAll() {
    // محاسبات پایه
    let totalBirds = dataRows[0].birds;
    let totalMortality = 0;
    let totalFeed = 0;
    let totalWeight = 0;
    
    dataRows.forEach(row => {
        totalMortality += row.mortality;
        totalFeed += row.feed;
        totalWeight += (row.weight * row.birds) / 1000; // تبدیل به کیلوگرم
    });
    
    let avgBirds = totalBirds - (totalMortality / 2);
    let fcr = totalFeed / (totalWeight / 1000);
    let mortalityPercent = (totalMortality / totalBirds) * 100;
    
    // نمایش نتایج
    const resultsGrid = document.getElementById('resultsGrid');
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

// صفحات ماشین حساب جداگانه

// ماشین حساب ضریب تبدیل
function calculateFCR() {
    const totalFeed = parseFloat(document.getElementById('totalFeed').value);
    const totalWeight = parseFloat(document.getElementById('totalWeight').value);
    const birdsCount = parseFloat(document.getElementById('birdsCount').value);
    
    if(totalFeed && totalWeight && birdsCount) {
        const fcr = totalFeed / (totalWeight / birdsCount);
        document.getElementById('fcrResult').innerHTML = `
            <div class="result-item">
                <h4>ضریب تبدیل غذایی</h4>
                <div class="result-value">${fcr.toFixed(2)}</div>
                <small>${(fcr < 1.8) ? '✅ عالی' : (fcr < 2) ? '⚠️ قابل قبول' : '❌ نیاز به بهبود'}</small>
            </div>
        `;
    }
}

// ماشین حساب تلفات
function calculateMortality() {
    const initialBirds = parseFloat(document.getElementById('initialBirds').value);
    const mortalityCount = parseFloat(document.getElementById('mortalityCount').value);
    const birdPrice = parseFloat(document.getElementById('birdPrice').value);
    
    if(initialBirds && mortalityCount) {
        const mortalityPercent = (mortalityCount / initialBirds) * 100;
        const financialLoss = mortalityCount * (birdPrice || 50000);
        
        document.getElementById('mortalityResult').innerHTML = `
            <div class="result-item">
                <h4>درصد تلفات</h4>
                <div class="result-value">${mortalityPercent.toFixed(2)}%</div>
                <small>${mortalityCount} پرنده تلف شده</small>
            </div>
            <div class="result-item">
                <h4>ضرر مالی</h4>
                <div class="result-value">${financialLoss.toLocaleString()}</div>
                <small>تومان</small>
            </div>
        `;
    }
}

// ماشین حساب مصرف دان
function calculateFeedConversion() {
    const dailyFeed = parseFloat(document.getElementById('dailyFeed').value);
    const birdWeight = parseFloat(document.getElementById('birdWeight').value);
    const birdAge = parseFloat(document.getElementById('birdAge').value);
    
    if(dailyFeed && birdWeight) {
        const feedPerBird = dailyFeed / birdWeight;
        const expectedWeight = (birdAge * 50); // فرمول تقریبی
        
        document.getElementById('feedResult').innerHTML = `
            <div class="result-item">
                <h4>سرانه مصرف دان</h4>
                <div class="result-value">${feedPerBird.toFixed(2)}</div>
                <small>گرم به ازای هر پرنده</small>
            </div>
            <div class="result-item">
                <h4>وزن پیش‌بینی شده</h4>
                <div class="result-value">${expectedWeight}</div>
                <small>گرم (در ${birdAge} روزگی)</small>
            </div>
            <div class="result-item">
                <h4>وضعیت مصرف</h4>
                <div class="result-value">${feedPerBird > 100 ? '🔴 بیش از حد' : (feedPerBird > 80 ? '🟡 نرمال' : '🟢 کمتر از حد')}</div>
                <small>نسبت به استاندارد</small>
            </div>
        `;
    }
}

// مقداردهی اولیه
document.addEventListener('DOMContentLoaded', () => {
    renderTable();
});
