/**
 * 核心抽奖引擎
 * 负责管理候选池、已中奖名单和随机算法
 */
export class LotteryEngine {
    constructor(allCandidates) {
        this.allCandidates = [...allCandidates]; // 原始数据的副本
        this.remainingCandidates = [...allCandidates]; // 剩余未中奖池
        this.winners = []; // 已中奖名单
    }

    /**
     * 重置抽奖状态
     */
    reset() {
        this.remainingCandidates = [...this.allCandidates];
        this.winners = [];
    }

    /**
     * 获取剩余可抽奖人数
     */
    getRemainingCount() {
        return this.remainingCandidates.length;
    }

    /**
     * 随机抽取指定数量的候选人
     * @param {number} count 抽取数量
     * @returns {Array} 中奖者数组
     */
    draw(count) {
        if (this.remainingCandidates.length === 0) {
            throw new Error("候选池已空");
        }

        const actualCount = Math.min(count, this.remainingCandidates.length);
        const batchWinners = [];

        for (let i = 0; i < actualCount; i++) {
            // 生成随机索引
            const randomIndex = Math.floor(Math.random() * this.remainingCandidates.length);

            // 取出并从剩余池中移除
            const winner = this.remainingCandidates.splice(randomIndex, 1)[0];
            batchWinners.push(winner);
        }

        this.winners.push(...batchWinners);
        return batchWinners;
    }

    /**
     * 获取用于滚动的随机样本（不改变状态）
     * 用于动画过程中的视觉效果
     */
    getRandomSample() {
        if (this.remainingCandidates.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * this.remainingCandidates.length);
        return this.remainingCandidates[randomIndex];
    }
}
