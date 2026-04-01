import { CONFIG } from './config.js';

export class Toast {
    constructor() {
        this.container = document.getElementById('toast-container');
        this._initContainer();
    }

    _initContainer() {
        if (this.container) {
            // 确保容器有正确的 class
            this.container.classList.add('toast-container');

            // 强制设置样式，确保居中定位
            Object.assign(this.container.style, {
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: '9999',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                pointerEvents: 'none',
                width: 'auto',
                maxWidth: '100%',
                margin: '0',
                padding: '0',
                boxSizing: 'border-box'
            });
        }
    }

    show(message, type = 'info') {
        if (!this.container) {
            console.error('Toast container not found!');
            return;
        }

        // 确保容器样式正确（每次显示时都检查）
        this._initContainer();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        // 添加图标
        const icon = this._getIcon(type);
        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
        `;

        this.container.appendChild(toast);

        // 自动移除
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.marginTop = '-20px';
            setTimeout(() => toast.remove(), 300);
        }, CONFIG.TOAST_DURATION);
    }

    _getIcon(type) {
        switch (type) {
            case 'success': return '✓';
            case 'error': return '✕';
            case 'warning': return '⚠';
            default: return 'ℹ';
        }
    }

    _getColor(type) {
        switch (type) {
            case 'success': return '#52c41a';
            case 'error': return '#ff4d4f';
            case 'warning': return '#faad14';
            default: return '#1890ff';
        }
    }
}
