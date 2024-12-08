import psutil

def get_ram_stats():
    memory = psutil.virtual_memory()
    
    total_gb = round(memory.total / (1024**3), 2)
    used_gb = round((memory.total - memory.available) / (1024**3), 2)
    available_gb = round(memory.available / (1024**3), 2)
    active_gb = round(memory.active / (1024**3), 2)
    inactive_gb = round(memory.inactive / (1024**3), 2)
    
    ram_stats = {
        'column1': [
            {'label': 'Total RAM', 'value': f'{total_gb} GB'},
            {'label': 'Memory Usage', 'value': f'{memory.percent}%'},
        ],
        'column2': [
            {'label': 'Used RAM', 'value': f'{used_gb} GB'},
            {'label': 'Available RAM', 'value': f'{available_gb} GB'},
        ],
        'column3': [
            {'label': 'Active', 'value': f'{active_gb} GB'},
            {'label': 'Inactive', 'value': f'{inactive_gb} GB'},
        ]
    }
    
    return ram_stats 