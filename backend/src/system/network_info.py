import psutil
import time

def get_network_stats():
    init_counters = psutil.net_io_counters()
    time.sleep(1)
    final_counters = psutil.net_io_counters()
    
    bytes_sent = final_counters.bytes_sent - init_counters.bytes_sent
    bytes_recv = final_counters.bytes_recv - init_counters.bytes_recv
    
    mb_sent = round(bytes_sent / (1024 * 1024), 2)
    mb_recv = round(bytes_recv / (1024 * 1024), 2)
    
    return {
        'current_speeds': {
            'upload': f'{mb_sent} MB/s',
            'download': f'{mb_recv} MB/s'
        },
        'total_transfer': {
            'sent': f'{round(final_counters.bytes_sent / (1024**3), 2)} GB',
            'received': f'{round(final_counters.bytes_recv / (1024**3), 2)} GB'
        },
        'packets': {
            'sent': final_counters.packets_sent,
            'received': final_counters.packets_recv
        }
    } 