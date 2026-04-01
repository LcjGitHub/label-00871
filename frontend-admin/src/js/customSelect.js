/**
 * 自定义 Select 组件
 * 参考 Element Plus 风格，不使用浏览器原生组件
 */
export class CustomSelect {
    constructor(selectElement) {
        this.originalSelect = selectElement;
        this.wrapper = null;
        this.dropdown = null;
        this.isOpen = false;
        this.init();
    }

    init() {
        // 创建包装器
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'custom-select-wrapper';

        // 创建自定义选择框
        this.customSelect = document.createElement('div');
        this.customSelect.className = 'custom-select';
        const selectedText = this.getSelectedText();
        if (!selectedText || selectedText.trim() === '') {
            this.customSelect.textContent = '请选择';
            this.customSelect.classList.add('placeholder');
        } else {
            this.customSelect.textContent = selectedText;
        }

        // 创建下拉选项容器
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'custom-select-dropdown';

        // 生成选项
        const options = Array.from(this.originalSelect.options);
        options.forEach((option, index) => {
            const optionEl = document.createElement('div');
            optionEl.className = 'custom-select-option';
            if (option.selected) {
                optionEl.classList.add('selected');
            }
            if (option.disabled) {
                optionEl.classList.add('disabled');
            }
            optionEl.textContent = option.text;
            optionEl.dataset.value = option.value;
            optionEl.dataset.index = index;

            optionEl.addEventListener('click', () => {
                if (!option.disabled) {
                    this.selectOption(index);
                }
            });

            this.dropdown.appendChild(optionEl);
        });

        // 组装结构
        this.wrapper.appendChild(this.customSelect);
        this.wrapper.appendChild(this.dropdown);

        // 替换原 select
        this.originalSelect.style.display = 'none';
        this.originalSelect.parentNode.insertBefore(this.wrapper, this.originalSelect);

        // 绑定事件
        this.customSelect.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });

        // 点击外部关闭
        document.addEventListener('click', (e) => {
            if (!this.wrapper.contains(e.target)) {
                this.close();
            }
        });

        // 监听原 select 变化
        this.originalSelect.addEventListener('change', () => {
            this.updateDisplay();
        });
    }

    getSelectedText() {
        const selectedOption = this.originalSelect.options[this.originalSelect.selectedIndex];
        return selectedOption ? selectedOption.text : '';
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        this.wrapper.classList.add('select-open');
        this.dropdown.classList.add('show');
        this.updateArrowPosition();
    }

    updateArrowPosition() {
        // 计算输入框中心位置，用于定位三角形指针
        const selectRect = this.customSelect.getBoundingClientRect();
        const wrapperRect = this.wrapper.getBoundingClientRect();
        const arrowLeft = selectRect.left - wrapperRect.left + selectRect.width / 2;
        this.dropdown.style.setProperty('--arrow-left', `${arrowLeft}px`);
    }

    close() {
        this.isOpen = false;
        this.wrapper.classList.remove('select-open');
        this.dropdown.classList.remove('show');
    }

    selectOption(index) {
        this.originalSelect.selectedIndex = index;
        this.originalSelect.dispatchEvent(new Event('change', { bubbles: true }));
        this.updateDisplay();
        this.close();
    }

    updateDisplay() {
        const selectedText = this.getSelectedText();
        if (!selectedText || selectedText.trim() === '') {
            this.customSelect.textContent = '请选择';
            this.customSelect.classList.add('placeholder');
        } else {
            this.customSelect.textContent = selectedText;
            this.customSelect.classList.remove('placeholder');
        }

        // 更新选项选中状态
        const options = this.dropdown.querySelectorAll('.custom-select-option');
        options.forEach((optionEl, index) => {
            if (index === this.originalSelect.selectedIndex) {
                optionEl.classList.add('selected');
            } else {
                optionEl.classList.remove('selected');
            }
        });
    }
}
