import { CONFIG } from './config.js';

export class AnimationController {
    constructor(displayElement) {
        this.displayElement = displayElement; // ul#lottery-list
        this.animationFrameId = null;
        this.isAnimating = false;
        this.currentStyle = CONFIG.SCROLL_STYLES.single;
    }

    /**
     * 开始滚动动画
     * @param {Function} dataProvider 提供随机数据的回调函数
     * @param {string} speedMode 速度模式 'slow' | 'normal' | 'fast'
     * @param {string} scrollStyle 滚动样式 'single' | 'list' | 'marquee' | 'fade'
     */
    start(dataProvider, speedMode = 'normal', scrollStyle = 'single') {
        if (this.isAnimating) return;
        this.isAnimating = true;
        this.currentStyle = scrollStyle;
        this.displayElement.innerHTML = '';
        this.displayElement.className = `lottery-list lottery-list-${scrollStyle}`;

        const speed = CONFIG.SPEED[speedMode] || CONFIG.SPEED.normal;
        let lastTime = 0;

        const animate = (timestamp) => {
            if (!this.isAnimating) return;

            if (timestamp - lastTime >= speed) {
                const item = dataProvider();
                if (item) {
                    this._renderByStyle(item);
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

    _renderByStyle(item) {
        switch (this.currentStyle) {
            case CONFIG.SCROLL_STYLES.list:
                this._renderListStyle(item);
                break;
            case CONFIG.SCROLL_STYLES.marquee:
                this._renderMarqueeStyle(item);
                break;
            case CONFIG.SCROLL_STYLES.fade:
                this._renderFadeStyle(item);
                break;
            case CONFIG.SCROLL_STYLES.single:
            default:
                this._renderSingleStyle(item);
        }
    }

    _renderSingleStyle(item) {
        const li = document.createElement('li');
        li.textContent = `${item.name} (${item.category || item.id})`;
        this.displayElement.innerHTML = '';
        this.displayElement.appendChild(li);
    }

    _renderListStyle(item) {
        const li = document.createElement('li');
        li.textContent = `${item.name} (${item.category || item.id})`;
        li.classList.add('list-item-enter');
        
        this.displayElement.insertBefore(li, this.displayElement.firstChild);
        
        while (this.displayElement.children.length > 5) {
            this.displayElement.removeChild(this.displayElement.lastChild);
        }
    }

    _renderMarqueeStyle(item) {
        const li = document.createElement('li');
        li.textContent = `${item.name} (${item.category || item.id})`;
        li.classList.add('marquee-item');
        this.displayElement.innerHTML = '';
        this.displayElement.appendChild(li);
    }

    _renderFadeStyle(item) {
        const li = document.createElement('li');
        li.textContent = `${item.name} (${item.category || item.id})`;
        li.classList.add('fade-enter');
        this.displayElement.innerHTML = '';
        this.displayElement.appendChild(li);
    }
}
