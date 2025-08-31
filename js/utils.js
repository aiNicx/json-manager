// Utility functions for JSON Manager
class Utils {
    static formatValue(value, short = false) {
        const type = this.getValueType(value);

        if (type === 'string') {
            const str = short && value.length > 50 ? value.substring(0, 50) + '...' : value;
            return `"${str}"`;
        } else if (type === 'number' || type === 'boolean') {
            return value.toString();
        } else if (type === 'null') {
            return 'null';
        } else if (type === 'object') {
            return `{${Object.keys(value).length} proprietà}`;
        } else if (type === 'array') {
            return `[${value.length} elementi]`;
        }

        return value;
    }

    static getValueType(value) {
        if (value === null) return 'null';
        if (Array.isArray(value)) return 'array';
        return typeof value;
    }

    static getTypeIcon(type) {
        const icons = {
            object: 'object',
            array: 'array',
            string: 'string',
            number: 'number',
            boolean: 'boolean',
            null: 'null'
        };
        return icons[type] || 'object';
    }

    static getTypeIconName(type) {
        const icons = {
            object: 'fa-cube',
            array: 'fa-list',
            string: 'fa-quote-right',
            number: 'fa-hashtag',
            boolean: 'fa-toggle-on',
            null: 'fa-ban'
        };
        return icons[type] || 'fa-cube';
    }
}
