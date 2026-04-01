import { Toast } from './toast.js';
import { CONFIG } from './config.js';

export class UIController {
    constructor(engine, animationController) {
        this.engine = engine;
        this.animation = animationController;
        this.toast = new Toast();

        // DOM Elements
        this.els = {
            totalBadge: document.getElementById('total-count-badge'),
            lotteryWindow: document.getElementById('lottery-window'),
            placeholder: document.querySelector('.placeholder-text'),
            winnersSection: document.getElementById('winners-section'),
            winnersDisplay: document.getElementById('winners-display'),
            btnStart: document.getElementById('btn-start'),
            btnStartText: document.querySelector('#btn-start .btn-text'),
            btnReset: document.getElementById('btn-reset'),
            selectStyle: document.getElementById('style-select'),
            selectSpeed: document.getElementById('speed-select'),
            selectCount: document.getElementById('count-select')
        };

        this._bindEvents();
    }

    init(totalCount) {
        this._updateTotalBadge(totalCount);
        this.els.btnStart.disabled = false;
    }

    _bindEvents() {
        // 点击事件
        this.els.btnStart.addEventListener('click', () => this._handleStart());
        this.els.btnReset.addEventListener('click', () => this._handleReset());

        // 键盘支持 - 增强可访问性
        this.els.btnStart.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this._handleStart();
            }
        });

        this.els.btnReset.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this._handleReset();
            }
        });

        // 表单控件变化反馈
        this.els.selectStyle.addEventListener('change', () => {
            this.toast.show('滚动样式已更新', 'info');
        });

        this.els.selectSpeed.addEventListener('change', () => {
            this.toast.show('速度设置已更新', 'info');
        });

        this.els.selectCount.addEventListener('change', () => {
            const count = parseInt(this.els.selectCount.value);
            const remaining = this.engine.getRemainingCount();
            if (remaining < count) {
                this.toast.show(`注意：剩余人数不足 ${count} 人`, 'warning');
            }
        });
    }

    async _handleStart() {
        // 1. 验证
        const count = parseInt(this.els.selectCount.value);
        const remaining = this.engine.getRemainingCount();

        if (remaining === 0) {
            this.toast.show('所有候选人都已中奖，请重置！', 'warning');
            return;
        }

        if (remaining < count) {
            this.toast.show(`剩余人数不足 ${count} 人，将抽取剩余所有 ${remaining} 人`, 'info');
        }

        // 2. 锁定 UI
        this._setBusy(true);
        const placeholderEl = document.getElementById('placeholder-text');
        if (placeholderEl) placeholderEl.style.display = 'none';
        if (this.els.winnersSection) this.els.winnersSection.style.display = 'none'; // 抽奖时隐藏结果区

        // 3. 开始动画
        const speedMode = this.els.selectSpeed.value;
        const styleMode = this.els.selectStyle.value;
        this.animation.start(() => this.engine.getRandomSample(), speedMode, styleMode);

        // 4. 等待动画结束并显示结果
        setTimeout(() => {
            this.animation.stop();
            const winners = this.engine.draw(count);
            this._showWinners(winners);
            this._setBusy(false);
            this.els.btnReset.disabled = false;
            this._updateTotalBadge(this.engine.getRemainingCount());

            if (this.engine.getRemainingCount() === 0) {
                this.toast.show('抽奖结束，所有人都已中奖！', 'success');
            }
        }, CONFIG.ANIMATION_DURATION);
    }

    _handleReset() {
        if (confirm('确定要清空当前结果并重置吗？')) {
            this.engine.reset();
            if (this.els.winnersDisplay) this.els.winnersDisplay.innerHTML = '';
            if (this.els.winnersSection) this.els.winnersSection.style.display = 'none';
            const placeholderEl = document.getElementById('placeholder-text');
            if (placeholderEl) placeholderEl.style.display = 'flex';
            this.els.lotteryWindow.querySelector('#lottery-list').innerHTML = '';
            this._updateTotalBadge(this.engine.getRemainingCount());
            this.els.btnReset.disabled = true;
            this.toast.show('已重置', 'success');
        }
    }

    _showWinners(winners) {
        if (this.els.winnersSection) {
            this.els.winnersSection.style.display = 'block'; // 显示结果区域
        }
        if (this.els.winnersDisplay) {
            this.els.winnersDisplay.innerHTML = ''; // 清空旧的显示

            winners.forEach((winner, index) => {
                const card = document.createElement('div');
                card.className = 'winner-card';
                card.setAttribute('role', 'listitem');
                card.setAttribute('aria-label', `中奖者：${winner.name}`);
                card.innerHTML = `
                    <div class="winner-name">${winner.name}</div>
                    <div class="winner-category">${winner.category || ''}</div>
                `;
                // 添加延迟动画效果，让卡片依次出现
                card.style.animationDelay = `${index * 0.1}s`;
                this.els.winnersDisplay.appendChild(card);
            });
        }

        // 在滚动窗口也定格显示第一个中奖者（增加视觉连贯性）
        if (winners.length > 0) {
            const list = this.els.lotteryWindow.querySelector('#lottery-list');
            list.innerHTML = `<li>🎉 恭喜 ${winners.length} 位幸运儿 🎉</li>`;
        }
    }

    _setBusy(isBusy) {
        this.els.btnStart.disabled = isBusy;
        this.els.btnReset.disabled = isBusy;
        this.els.selectStyle.disabled = isBusy;
        this.els.selectSpeed.disabled = isBusy;
        this.els.selectCount.disabled = isBusy;

        // 只更新文字，保留图标
        if (this.els.btnStartText) {
            this.els.btnStartText.textContent = isBusy ? '抽签中...' : '开始抽签';
        }
    }

    _updateTotalBadge(count) {
        this.els.totalBadge.textContent = `剩余候选: ${count}`;
    }
}
