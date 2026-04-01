import { DataLoader } from './dataLoader.js';
import { LotteryEngine } from './lottery.js';
import { AnimationController } from './animation.js';
import { UIController } from './ui.js';
import { Toast } from './toast.js';
import { CustomSelect } from './customSelect.js';

document.addEventListener('DOMContentLoaded', async () => {
    const toast = new Toast();

    try {
        // 1. 初始化自定义 Select 组件
        const styleSelect = document.getElementById('style-select');
        const speedSelect = document.getElementById('speed-select');
        const countSelect = document.getElementById('count-select');
        if (styleSelect) new CustomSelect(styleSelect);
        if (speedSelect) new CustomSelect(speedSelect);
        if (countSelect) new CustomSelect(countSelect);

        // 2. 加载数据
        const loader = new DataLoader();
        const data = await loader.load();

        // 3. 初始化核心引擎
        const engine = new LotteryEngine(data);

        // 4. 初始化动画控制器
        const animation = new AnimationController(
            document.getElementById('lottery-list')
        );

        // 5. 初始化 UI 控制器
        const ui = new UIController(engine, animation);
        ui.init(engine.getRemainingCount());

        toast.show('系统初始化完成，准备就绪！', 'success');

    } catch (error) {
        console.error('Initialization failed:', error);
        toast.show(`初始化失败: ${error.message}`, 'error');
        document.getElementById('total-count-badge').textContent = '数据加载失败';
    }
});
