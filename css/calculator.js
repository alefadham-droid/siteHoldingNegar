// داده‌های اولیه
let dataRows = [
    { day: 1, birds: 1000, weight: 150, feed: 50, mortality: 2 }
];

// ================ توابع مدیریت جدول ================

// نمایش جدول
function renderTable() {
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

// ================ توابع محاسبات اصلی ================

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

// ================ ماشین حساب ضریب تبدیل ================

function calculateFCR() {
    const totalFeed = parseFloat(document.getElementById('totalFeed')?.value);
    const totalWeight = parseFloat(document.getElementById('totalWeight')?.value);
    const birdsCount = parseFloat(document.getElementById('birdsCount')?.value);
    
    if(totalFeed && totalWeight && birdsCount) {
        const fcr = totalFeed / (totalWeight / birdsCount);
        const resultDiv = document.getElementById('fcrResult');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="result-item">
                    <h4>ضریب تبدیل غذایی</h4>
                    <div class="result-value">${fcr.toFixed(2)}</div>
                    <small>${(fcr < 1.8) ? '✅ عالی' : (fcr < 2) ? '⚠️ قابل قبول' : '❌ نیاز به بهبود'}</small>
                </div>
            `;
        }
    }
}

// ================ ماشین حساب تلفات ================

function calculateMortality() {
    const initialBirds = parseFloat(document.getElementById('initialBirds')?.value);
    const mortalityCount = parseFloat(document.getElementById('mortalityCount')?.value);
    const birdPrice = parseFloat(document.getElementById('birdPrice')?.value) || 50000;
    
    if(initialBirds && mortalityCount) {
        const mortalityPercent = (mortalityCount / initialBirds) * 100;
        const financialLoss = mortalityCount * birdPrice;
        
        const resultDiv = document.getElementById('mortalityResult');
        if (resultDiv) {
            resultDiv.innerHTML = `
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
}

// ================ ماشین حساب مصرف دان ================

function calculateFeedConversion() {
    const dailyFeed = parseFloat(document.getElementById('dailyFeed')?.value);
    const birdWeight = parseFloat(document.getElementById('birdWeight')?.value);
    const birdAge = parseFloat(document.getElementById('birdAge')?.value);
    
    if(dailyFeed && birdWeight) {
        const feedPerBird = dailyFeed / birdWeight;
        const expectedWeight = (birdAge * 50); // فرمول تقریبی
        
        const resultDiv = document.getElementById('feedResult');
        if (resultDiv) {
            resultDiv.innerHTML = `
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
}

// ================ ماشین حساب تهویه و تنظیم دور فن ================

// تابع اصلی محاسبه تهویه
function calculateVentilation() {
    // دریافت مقادیر از فرم
    const age = parseFloat(document.getElementById('birdAge')?.value) || 25;
    const weight = parseFloat(document.getElementById('birdWeight')?.value) || 1500;
    const count = parseFloat(document.getElementById('birdCount')?.value) || 10000;
    const temperature = parseFloat(document.getElementById('temperature')?.value) || 28;
    const humidity = parseFloat(document.getElementById('humidity')?.value) || 60;
    const fanCapacity = parseFloat(document.getElementById('fanCapacity')?.value) || 15000;
    const fanCount = parseFloat(document.getElementById('fanCount')?.value) || 4;

    // تبدیل وزن به کیلوگرم
    const weightKg = weight / 1000;
    
    // محاسبه وزن کل پرندگان (کیلوگرم)
    const totalWeight = count * weightKg;

    // محاسبه تهویه بر اساس استانداردهای پرورش طیور
    // 1. تهویه حداقل (زمستانه) - 0.3 CFM به ازای هر کیلوگرم وزن پرنده
    const minVentilationPerKg = 0.3; // CFM (فوت مکعب در دقیقه)
    const minVentilationCFM = totalWeight * minVentilationPerKg;
    const minVentilationM3h = minVentilationCFM * 1.699; // تبدیل CFM به مترمکعب در ساعت

    // 2. تهویه حداکثر (تابستانه) - 4 CFM به ازای هر کیلوگرم وزن پرنده
    const maxVentilationPerKg = 4; // CFM
    const maxVentilationCFM = totalWeight * maxVentilationPerKg;
    const maxVentilationM3h = maxVentilationCFM * 1.699;

    // 3. تهویه بر اساس دما (ضریب دما)
    let temperatureFactor = 1;
    if (temperature < 20) temperatureFactor = 0.7;
    else if (temperature < 25) temperatureFactor = 0.85;
    else if (temperature < 30) temperatureFactor = 1;
    else if (temperature < 35) temperatureFactor = 1.3;
    else temperatureFactor = 1.6;

    // 4. تهویه بر اساس رطوبت
    let humidityFactor = 1;
    if (humidity > 80) humidityFactor = 1.4;
    else if (humidity > 70) humidityFactor = 1.2;
    else if (humidity < 40) humidityFactor = 0.8;

    // تهویه نهایی توصیه شده
    const recommendedVentilation = minVentilationM3h + 
        ((maxVentilationM3h - minVentilationM3h) * ((temperatureFactor + humidityFactor) / 2 - 0.5));

    // محاسبه تعداد فن مورد نیاز
    const fansNeeded = Math.ceil(recommendedVentilation / fanCapacity);
    
    // محاسبه درصد دور فن (اگر تعداد فن کافی باشد)
    let fanSpeedPercent = 0;
    let fansToRun = 0;
    
    if (fansNeeded <= fanCount) {
        // اگر فن کافی داریم، دور فن را تنظیم می‌کنیم
        fanSpeedPercent = Math.min(100, Math.round((recommendedVentilation / (fanCount * fanCapacity)) * 100));
        fansToRun = fanCount;
    } else {
        // اگر فن کافی نداریم، همه فن‌ها با حداکثر دور کار می‌کنند
        fanSpeedPercent = 100;
        fansToRun = fanCount;
    }

    // محاسبه زمان چرخه تهویه (برای تهویه حداقل در زمستان)
    const cycleTime = 300; // 5 دقیقه (300 ثانیه)
    let onTime = 0;
    
    if (recommendedVentilation < minVentilationM3h * 1.5) {
        // در تهویه حداقل، از تایمر استفاده می‌کنیم
        onTime = Math.round((recommendedVentilation / (fanCapacity * fansToRun)) * cycleTime);
        onTime = Math.min(cycleTime, Math.max(30, onTime)); // حداقل 30 ثانیه، حداکثر 300 ثانیه
    }

    // نمایش نتایج
    displayVentilationResults({
        minVentilation: minVentilationM3h,
        maxVentilation: maxVentilationM3h,
        recommended: recommendedVentilation,
        fansNeeded: fansNeeded,
        fansToRun: fansToRun,
        fanSpeed: fanSpeedPercent,
        onTime: onTime,
        cycleTime: cycleTime,
        temperature,
        humidity,
        age,
        weightKg,
        count
    });

    // بروزرسانی جدول برنامه
    updateFanSchedule(age);
}

// نمایش نتایج تهویه
function displayVentilationResults(data) {
    const grid = document.getElementById('ventilationGrid');
    if (!grid) return;
    
    // تعیین وضعیت تهویه
    let ventilationStatus = '';
    let statusColor = '';
    
    if (data.recommended < data.minVentilation * 1.1) {
        ventilationStatus = '❄️ تهویه حداقل (زمستانه)';
        statusColor = '#3498db';
    } else if (data.recommended > data.maxVentilation * 0.9) {
        ventilationStatus = '☀️ تهویه حداکثر (تابستانه)';
        statusColor = '#e67e22';
    } else {
        ventilationStatus = '🍃 تهویه متوسط (بهاره/پاییزه)';
        statusColor = '#27ae60';
    }

    grid.innerHTML = `
        <div class="result-item" style="background: ${statusColor}; color: white;">
            <h4 style="color: white;">وضعیت تهویه</h4>
            <div class="result-value" style="color: white; font-size: 1.3em;">${ventilationStatus}</div>
        </div>
        
        <div class="result-item">
            <h4>تهویه مورد نیاز</h4>
            <div class="result-value">${Math.round(data.recommended).toLocaleString()}</div>
            <small>مترمکعب در ساعت</small>
        </div>
        
        <div class="result-item">
            <h4>تهویه حداقل</h4>
            <div class="result-value">${Math.round(data.minVentilation).toLocaleString()}</div>
            <small>مترمکعب در ساعت</small>
        </div>
        
        <div class="result-item">
            <h4>تهویه حداکثر</h4>
            <div class="result-value">${Math.round(data.maxVentilation).toLocaleString()}</div>
            <small>مترمکعب در ساعت</small>
        </div>
        
        <div class="result-item">
            <h4>تعداد فن مورد نیاز</h4>
            <div class="result-value">${data.fansNeeded}</div>
            <small>فن (از ${data.fansToRun} فن موجود)</small>
        </div>
        
        <div class="result-item">
            <h4>تنظیم دور فن</h4>
            <div class="result-value">${data.fanSpeed}%</div>
            <small>درصد دور موتور</small>
        </div>
        
        <div class="result-item">
            <h4>زمان روشن بودن</h4>
            <div class="result-value">${data.onTime > 0 ? data.onTime + ' ثانیه' : 'پیوسته'}</div>
            <small>در سیکل ${data.cycleTime} ثانیه‌ای</small>
        </div>
        
        <div class="result-item">
            <h4>تهویه به ازای هر پرنده</h4>
            <div class="result-value">${(data.recommended / data.count).toFixed(1)}</div>
            <small>مترمکعب در ساعت</small>
        </div>
        
        <div class="result-item">
            <h4>تهویه به ازای هر کیلوگرم</h4>
            <div class="result-value">${(data.recommended / (data.count * data.weightKg)).toFixed(2)}</div>
            <small>مترمکعب به ازای هر کیلوگرم</small>
        </div>
    `;
}

// بروزرسانی جدول برنامه تنظیم فن
function updateFanSchedule(currentAge) {
    const tbody = document.getElementById('fanScheduleBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // ایجاد برنامه برای سنین مختلف
    const ages = [7, 14, 21, 28, 35, 42, 49];
    
    ages.forEach(age => {
        // محاسبات تقریبی برای هر سن
        const weight = age * 55; // وزن تقریبی (گرم)
        const totalWeight = (10000 * weight / 1000); // برای 10000 پرنده
        
        const minVent = Math.round(totalWeight * 0.3 * 1.699);
        const maxVent = Math.round(totalWeight * 4 * 1.699);
        const fansNeeded = Math.ceil(maxVent / 15000);
        const fanSpeed = Math.min(100, Math.round((minVent + (maxVent - minVent) * 0.5) / (4 * 15000) * 100));
        
        let onTime = 0;
        if (age < 21) {
            onTime = Math.round(60 + (age * 5)); // تهویه تایمری برای سنین پایین
        }
        
        const row = document.createElement('tr');
        row.style.background = age === currentAge ? '#fff3cd' : '';
        row.style.fontWeight = age === currentAge ? 'bold' : '';
        
        row.innerHTML = `
            <td>${age}</td>
            <td>${minVent.toLocaleString()}</td>
            <td>${maxVent.toLocaleString()}</td>
            <td>${fansNeeded}</td>
            <td>${fanSpeed}%</td>
            <td>${onTime > 0 ? onTime + ' ثانیه' : 'پیوسته'}</td>
        `;
        
        tbody.appendChild(row);
    });
}

// ================ مقداردهی اولیه ================
document.addEventListener('DOMContentLoaded', function() {
    // نمایش جدول در صفحه اصلی
    renderTable();
    
    // اگر در صفحه ماشین حساب فن هستیم، محاسبات را انجام بده
    if (document.getElementById('fanScheduleBody')) {
        calculateVentilation();
    }
});
