const { getPanchangam, tithiNames, nakshatraNames, yogaNames, karanaNames, Observer } = require('@ishubhamx/panchangam-js');

const observer = new Observer(25.3176, 82.9739, 80);
const options = { timezoneOffset: 330 }; // IST is UTC+5:30 -> 330 mins

function formatTime(dateObj) {
    if (!dateObj) return 'N/A';
    return dateObj.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });
}

// Generate from Sep 25 to Oct 4
const startDate = new Date('2026-09-25T05:30:00+05:30'); 
for (let i = 0; i < 10; i++) {
    const d = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    try {
        const panchang = getPanchangam(d, observer, options);
        console.log(`--- Date: ${d.toISOString().split('T')[0]} ---`);
        console.log(`Sunrise: ${formatTime(panchang.sunrise)} | Sunset: ${formatTime(panchang.sunset)}`);
        
        // Transitions
        console.log("Tithi Transitions:");
        panchang.tithis.forEach(t => {
            console.log(`  - ${tithiNames[t.id]} ends at ${formatTime(t.time)}`);
        });

        console.log("Nakshatra Transitions:");
        panchang.nakshatras.forEach(n => {
            console.log(`  - ${nakshatraNames[n.id]} ends at ${formatTime(n.time)}`);
        });
        
        console.log("Yoga Transitions:");
        panchang.yogas.forEach(y => {
            console.log(`  - ${yogaNames[y.id]} ends at ${formatTime(y.time)}`);
        });
        
    } catch (e) {
        console.log(`Error on ${d.toISOString().split('T')[0]}:`);
        console.log(e);
    }
}
