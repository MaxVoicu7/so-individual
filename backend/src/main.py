from flask import Flask, jsonify
from flask_cors import CORS
from system.cpu_info import get_cpu_info, get_system_info
from system.ram_info import get_ram_stats
from system.disk_info import get_disk_stats
from system.network_info import get_network_stats
from system.battery_info import get_battery_stats
from system.network_connections import get_network_connections
import logging

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

@app.route('/api/health')
def health_check():
    return jsonify({"status": "healthy"})

@app.route('/api/system-info')
def system_info():
    return jsonify(get_system_info())

@app.route('/api/cpu-info')
def cpu_info():
    return jsonify(get_cpu_info())

@app.route('/api/ram-stats')
def ram_stats():
    return jsonify(get_ram_stats())

@app.route('/api/disk-stats')
def disk_stats():
    return jsonify(get_disk_stats())

@app.route('/api/network-stats')
def network_stats():
    return jsonify(get_network_stats())

@app.route('/api/battery-stats')
def battery_stats():
    return jsonify(get_battery_stats())

@app.route('/api/network-connections')
def network_connections():
    return jsonify(get_network_connections())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5055, debug=True) 