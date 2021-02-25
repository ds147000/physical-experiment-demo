/* eslint-disable @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any */
/**
 * 任务调度器，控制一帧内执行合适的任务
 */

interface Fun {
    (): void
}

export class Scheduler {
    /** @private 帧任务队列 */
    public runStack: Array<Fun | undefined> = new Array(1000)
    /** @private 帧任务队列当前长度 */
    private runSatckLen = 1000
    /** @private 帧任务队列当前位移 */
    private runStackIndex = 0

    /** @private 空闲任务队列 */
    public runIdelStack: Array<Fun | undefined> = new Array(1000)
    /** @private 空闲任务队列当前长度 */
    private runIdelStackLen = 1000
    /** @private 空闲任务队列当前位移 */
    private runIdelStackIndex = 0


    /** @private 空闲单独任务队列 */
    public singleIdel: Record<string, Fun | undefined> = {}
    /** @private 运行时间 */
    private runtime = 13
    /** @private 运行状态 */
    private runingStatus = false


    /**
     * 执行任务,一帧内执行任务，当帧时间耗尽会下次帧刷新执行任务队列
     * @param cb
     */
    run(cb: any): void {
        if (this.runStackIndex > this.runSatckLen -1) {
            this.runSatckLen += 1000
            this.runStack = this.runStack.concat(new Array(1000))
        }

        this.runStackIndex ++

        this.runStack[this.runStackIndex] = cb
        this.emit()
    }

    /**
     * 执行空闲任务，即一帧内全部任务执行完还剩余时间就执行当前任务
     * @param cb
     */
    runIdle(cb: any): void {
        if (this.runIdelStackIndex > this.runIdelStackLen -1) {
            this.runIdelStackLen += 1000
            this.runIdelStack = this.runIdelStack.concat(new Array(1000))
        }

        this.runIdelStackIndex ++

        this.runIdelStack[this.runIdelStackIndex] = cb
        this.emit()
    }

    /**
     * 与空闲任务一致，区别是任务会覆盖之前的任务
     * @param cb
     */
    runSingleIdle(cb: any, id: string): void {
        this.singleIdel[id] = cb
        this.emit()
    }

    /** 触发运行器 */
    emit(): void {
        if (this.runingStatus) return
        this.runing()
    }

    /** 获取队列任务 */
    getStack(): Fun | undefined {
        for(let i = 0; i < this.runStack.length; i ++) {
            const stack = this.runStack[i]
            if (!stack) continue
            this.runStack[i] = undefined
            return stack
        }

        for(let i = 0; i < this.runIdelStack.length; i ++) {
            const stack = this.runIdelStack[i]
            if (!stack) continue
            this.runIdelStack[i] = undefined
            return stack
        }

        for(const key in this.singleIdel) {
            const stack = this.singleIdel[key]
            this.singleIdel[key] = undefined
            return stack
        }

        return undefined
    }

    /** 运行 */
    async runing() {
        const startTime = Date.now()
        this.runingStatus = true

        if (this.runtime <= 0) {
            this.runtime = 13
            return Promise.resolve().then(() => {
                window.requestAnimationFrame(() => this.runing())
            })
        }

        const stack = this.getStack()
        if (!stack) {
            this.getNewRuntime(startTime)
            this.runingStatus = false
            return Promise.resolve()
        }
        await stack()
        this.getNewRuntime(startTime)
        this.runing()
        return Promise.resolve()
    }

    /**
     * 计算新的runtime
     * @param runting
     */
    getNewRuntime(start: number): void {
        this.runtime = this.runtime - (Date.now() - start)
    }
}

