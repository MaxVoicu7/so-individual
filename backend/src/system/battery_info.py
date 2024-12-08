import psutil

def get_battery_stats():
    try:
        battery = psutil.sensors_battery()
        if battery:
            return {
                'percent': battery.percent,
                'power_plugged': battery.power_plugged,
                'time_left': round(battery.secsleft / 3600, 2) if battery.secsleft > 0 else 0,
                'status': 'Charging' if battery.power_plugged else 'On Battery'
            }
        return None
    except Exception:
        return None 