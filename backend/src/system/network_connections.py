import psutil
import subprocess
import socket

def get_network_connections():
    try:
        # For macOS, use lsof command instead of psutil
        if psutil.MACOS:
            cmd = ['lsof', '-i', '-n', '-P']
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            connections = []
            for line in result.stdout.split('\n')[1:]:  # Skip header
                if line:
                    parts = line.split()
                    if len(parts) >= 9:
                        process = parts[0]
                        pid = parts[1]
                        protocol = parts[7]
                        address = parts[8]
                        
                        # Parse address information
                        if '->' in address:
                            local, remote = address.split('->')
                        else:
                            local = address
                            remote = '*:*'
                            
                        if 'ESTABLISHED' in parts:
                            status = 'ESTABLISHED'
                        elif 'LISTEN' in parts:
                            status = 'LISTENING'
                        else:
                            status = 'UNKNOWN'
                            
                        connections.append({
                            'local_address': local,
                            'remote_address': remote,
                            'status': status,
                            'process': process,
                            'type': 'TCP' if 'TCP' in protocol else 'UDP'
                        })
            
            return {'connections': connections}
        else:
            # Original psutil implementation for other OS
            connections = []
            for conn in psutil.net_connections(kind='inet'):
                try:
                    if conn.status == 'ESTABLISHED':
                        process = psutil.Process(conn.pid) if conn.pid else None
                        connections.append({
                            'local_address': f"{conn.laddr.ip}:{conn.laddr.port}",
                            'remote_address': f"{conn.raddr.ip}:{conn.raddr.port}",
                            'status': conn.status,
                            'process': process.name() if process else 'Unknown',
                            'type': 'TCP' if conn.type == socket.SOCK_STREAM else 'UDP'
                        })
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue
            
            return {'connections': connections}
            
    except Exception as e:
        print(f"Error getting network connections: {e}")
        return {'connections': []} 