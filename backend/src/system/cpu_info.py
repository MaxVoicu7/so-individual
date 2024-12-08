import psutil
import platform
import os

def get_cpu_info():
    try:
        cpu_percent_per_core = psutil.cpu_percent(interval=1, percpu=True)
        cpu_freq = psutil.cpu_freq() if hasattr(psutil.cpu_freq(), 'current') else None

        if platform.system() == 'Darwin':
            processor = os.popen('sysctl -n machdep.cpu.brand_string').read().strip()
        elif platform.system() == 'Linux':
            processor = os.popen('cat /proc/cpuinfo | grep "model name" | head -n 1').read().split(':')[-1].strip()
        elif platform.system() == 'Windows':
            processor = platform.processor()
        else:
            processor = "Unknown Processor"

        return {
            "physical_cores": psutil.cpu_count(logical=False),
            "total_cores": psutil.cpu_count(logical=True),
            "cpu_usage_per_core": cpu_percent_per_core,
            "total_cpu_usage": psutil.cpu_percent(),
            "processor_name": processor
        }
    except Exception as e:
        print(f"Error getting CPU info: {e}")
        return None

def get_system_info():
    try:
        system = platform.system()
        return {
            "os": system,
            "os_version": platform.version(),
            "architecture": platform.machine(),
            "hostname": platform.node(),
            "python_version": platform.python_version(),
            "boot_time": psutil.boot_time()
        }
    except Exception as e:
        print(f"Error getting system info: {e}")
        return None 