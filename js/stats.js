// Statistics calculation for JSON Manager
class Stats {
    static updateStats(jsonData) {
        if (!jsonData) {
            document.getElementById('totalKeys').textContent = '0 chiavi';
            document.getElementById('totalObjects').textContent = '0 oggetti';
            document.getElementById('totalArrays').textContent = '0 array';
            return;
        }

        const stats = this.calculateStats(jsonData);
        document.getElementById('totalKeys').textContent = `${stats.keys} chiavi`;
        document.getElementById('totalObjects').textContent = `${stats.objects} oggetti`;
        document.getElementById('totalArrays').textContent = `${stats.arrays} array`;
    }

    static calculateStats(obj, stats = { keys: 0, objects: 0, arrays: 0 }) {
        if (typeof obj === 'object' && obj !== null) {
            if (Array.isArray(obj)) {
                stats.arrays++;
                obj.forEach(item => this.calculateStats(item, stats));
            } else {
                stats.objects++;
                Object.keys(obj).forEach(key => {
                    stats.keys++;
                    this.calculateStats(obj[key], stats);
                });
            }
        }
        return stats;
    }
}
