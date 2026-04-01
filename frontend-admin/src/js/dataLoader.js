import { candidateData } from '../../data.js';

/**
 * 数据加载模块
 * 负责从 data.js 读取并验证数据
 */
export class DataLoader {
    constructor() {
        this.data = [];
    }

    /**
     * 加载并解析数据
     * @returns {Promise<Array>} 返回解析后的候选项数组
     */
    async load() {
        return new Promise((resolve, reject) => {
            try {
                // 模拟异步加载过程，增加一点真实感
                setTimeout(() => {
                    if (!Array.isArray(candidateData) || candidateData.length === 0) {
                        reject(new Error("数据源为空或格式错误"));
                        return;
                    }
                    this.data = candidateData;
                    console.log(`[DataLoader] 成功加载 ${this.data.length} 条数据`);
                    resolve(this.data);
                }, 300);
            } catch (error) {
                console.error("[DataLoader] 加载失败:", error);
                reject(error);
            }
        });
    }

    /**
     * 获取数据总条数
     */
    getCount() {
        return this.data.length;
    }
}
