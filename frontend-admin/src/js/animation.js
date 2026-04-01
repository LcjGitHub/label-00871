import { CONFIG } from './config.js';

export class AnimationController {
    constructor(displayElement) {
        this.displayElement = displayElement; // ul#lottery-list
        this.animationFrameId = null;
        this.isAnimating = false;
        this.currentStyle = CONFIG.STYLE.default;
    }

    /**
     * 开始滚动动画
     * @param {Function} dataProvider 提供随机数据的回调函数
     * @param {string} speedMode 速度模式 'slow' | 'normal' | 'fast'
     * @param {string} styleMode 样式模式 'default' | 'blur' | 'glow' | 'bounce'
     */
    start(dataProvider, speedMode = 'normal', styleMode = 'default') {
        if (this.isAnimating) return;
        this.isAnimating = true;
        this.currentStyle = styleMode;
        this.displayElement.innerHTML = ''; // 清空列表
        
        // 移除所有样式类，应用选中的样式
        this.displayElement.classList.remove('rolling-default', 'rolling-blur', 'rolling-glow', 'rolling-bounce');
        this.displayElement.classList.add(`rolling-${styleMode}`);

        const speed = CONFIG.SPEED[speedMode] || CONFIG.SPEED.normal;
        let lastTime = 0;

        const animate = (timestamp) => {
            if (!this.isAnimating) return;

            if (timestamp - lastTime >= speed) {
                const item = dataProvider();
                if (item) {
                    this._renderItem(item);
                }
                lastTime = timestamp;
            }

            this.animationFrameId = requestAnimationFrame(animate);
        };

        this.animationFrameId = requestAnimationFrame(animate);
    }

    /**
     * 停止动画
     */
    stop() {
        this.isAnimating = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        // 移除滚动样式类，恢复正常显示
        this.displayElement.classList.remove('rolling-default', 'rolling-blur', 'rolling-glow', 'rolling-bounce');
    }

    _renderItem(item) {
        // 创建新的 li
        const li = document.createElement('li');
        li.textContent = `${item.name} (${item.category || item.id})`;

        // 保持列表中只有少量元素，避免DOM过多
        this.displayElement.innerHTML = '';
        this.displayElement.appendChild(li);
    }
}
