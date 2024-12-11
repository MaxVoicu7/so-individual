import os
import json
import subprocess

def get_disk_stats():
    try:
        if os.name == 'posix' and os.path.exists('/usr/sbin/diskutil'):
            process = subprocess.Popen(['diskutil', 'info', '-all', '-plist', '/'], stdout=subprocess.PIPE)
            output, _ = process.communicate()

            disk_info = subprocess.run(['plutil', '-convert', 'json', '-o', '-', '-'], 
                                    input=output, 
                                    capture_output=True, 
                                    text=True)
            data = json.loads(disk_info.stdout)
            
            total_bytes = data.get('TotalSize', 0)
            free_bytes = data.get('FreeSpace', 0)
            used_bytes = total_bytes - free_bytes

            total_gb = round(total_bytes / (1000**3), 2)
            used_gb = round(used_bytes / (1000**3), 2)
            free_gb = round(free_bytes / (1000**3), 2)
            percent = round((used_bytes / total_bytes) * 100, 1)
            
            disk_stats = [{
                'device': 'Main Disk',
                'mountpoint': '/',
                'fstype': 'APFS',
                'total': f'{total_gb} GB',
                'used': f'{used_gb} GB',
                'free': f'{free_gb} GB',
                'percent': percent
            }]
            
            return {'disks': disk_stats}
        else:
            raise Exception("Not on macOS or diskutil not found")
            
    except Exception as e:
        print(f"Error getting disk stats: {e}")
        import psutil
        usage = psutil.disk_usage('/')
        
        total_gb = round(usage.total / (1000**3), 2) 
        used_gb = round(usage.used / (1000**3), 2)
        free_gb = round(usage.free / (1000**3), 2)
        
        disk_stats = [{
            'device': 'Main Disk',
            'mountpoint': '/',
            'fstype': 'APFS',
            'total': f'{total_gb} GB',
            'used': f'{used_gb} GB',
            'free': f'{free_gb} GB',
            'percent': usage.percent
        }]
        
        return {'disks': disk_stats} 