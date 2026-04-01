import { CONFIG } from './config.js';

export class AnimationController {
    constructor(displayElement) {
        this.displayElement = displayElement; // ul#lottery-list
        this.animationFrameId = null;
        this.isAnimating = false;
        this.styleMode = CONFIG.STYLE.single;
    }

    /**
     * 开始滚动动画
     * @param {Function} dataProvider 提供随机数据的回调函数
     * @param {string} speedMode 速度模式 'slow' | 'normal' | 'fast'
     * @param {string} styleMode 样式模式 'single' | 'list' | 'slide'
     */
    start(dataProvider, speedMode = 'normal', styleMode = CONFIG.STYLE.single) {
        if (this.isAnimating) return;
        this.isAnimating = true;
        this.styleMode = styleMode;
        this.displayElement.innerHTML = ''; // 清空列表
        
        // 设置样式类
        this.displayElement.className = 'lottery-list';
        this.displayElement.classList.add(`style-${styleMode}`);

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
    }

    _renderItem(item) {
        const li = document.createElement('li');
        li.textContent = `${item.name} (${item.category || item.id})`;

        switch (this.styleMode) {
            case CONFIG.STYLE.single:
                this._renderSingle(li);
                break;
            case CONFIG.STYLE.list:
                this._renderList(li);
                break;
            case CONFIG.STYLE.slide:
                this._renderSlide(li);
                break;
            default:
                this._renderSingle(li);
        }
    }

    _renderSingle(li) {
        this.displayElement.innerHTML = '';
        this.displayElement.appendChild(li);
    }

    _renderList(li) {
        this.displayElement.appendChild(li);
        
        // 保持最多显示5个元素
        const items = this.displayElement.querySelectorAll('li');
        while (items.length > 5) {
            items[0].remove();
            items[0] = this.displayElement.firstChild;
        }
    }

    _renderSlide(li) {
        const existingItems = this.displayElement.querySelectorAll('li');
        
        // 移除旧元素
        existingItems.forEach(item => item.remove());
        
        // 添加新元素
        this.displayElement.appendChild(li);
    }
}
