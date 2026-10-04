import datetime
import jyotishganit

# Kashi/Varanasi coordinates
lat = 25.3176
lon = 82.9739
timezone = 5.5

def calculate_panchang(date_obj):
    # This is a simplistic placeholder usage, since jyotishganit's exact API varies.
    # A real delta test script would map exact methods.
    try:
        engine = jyotishganit.Panchang(
            year=date_obj.year, 
            month=date_obj.month, 
            day=date_obj.day, 
            hour=5, minute=30, # approximate sunrise
            lat=lat, lon=lon, tz=timezone
        )
        return {
            "date": date_obj.strftime("%Y-%m-%d"),
            "sunrise": engine.sunrise(),
            "tithi": engine.tithi(),
            "nakshatra": engine.nakshatra()
        }
    except Exception as e:
        return {"date": date_obj.strftime("%Y-%m-%d"), "error": str(e)}

if __name__ == "__main__":
    start_date = datetime.date(2026, 9, 25)
    for i in range(10):
        current_date = start_date + datetime.timedelta(days=i)
        res = calculate_panchang(current_date)
        print(res)
