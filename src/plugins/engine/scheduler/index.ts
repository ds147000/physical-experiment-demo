/* eslint-disable @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any */
/**
 * 任务调度器，控制一帧内执行合适的任务
 */

 interface Fun {
    (): void
 }

interface StackFun {
    type: 0 | 1 | 2
    fun: Fun
    id?: string
}

export class Scheduler {
    /** @private 帧任务队列 */
    private runStack: Fun[] = []
    /** @private 空闲任务队列 */
    private runIdelStack: Fun[] = []
    /** @private 空闲单独任务队列 */
    private singleIdel: Record<string, Fun | undefined> = {}
    /** @private 运行时间 */
    private runtime = 13
    /** @private 运行状态 */
    private runtingStatus = false

    /**
     * 执行任务,一帧内执行任务，当帧时间耗尽会下次帧刷新执行任务队列
     * @param cb
     */
    run(cb: any): void {
        this.runStack.push(cb)
        this.emit()
    }

    /**
     * 执行空闲任务，即一帧内全部任务执行完还剩余时间就执行当前任务
     * @param cb
     */
    runIdle(cb: any): void {
        this.runIdelStack.push(cb)
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
        if (this.runtingStatus) return
        this.runing()
    }

    /** 获取队列任务 */
    getStackFun(): StackFun | null {
        if (this.runStack.length)
            return { type: 2, fun: this.runStack[0] }

        else if (this.runIdelStack.length)
            return { type: 1, fun: this.runIdelStack[0] }

        const singleIdelList = Object.keys(this.singleIdel)
        if (singleIdelList.length)
            return { type: 0, fun: this.singleIdel[singleIdelList[0]] as any }

        return null
    }

    /** 运行 */
    async runing() {
        // 任务队列
        const stackFun = this.getStackFun()
        if (stackFun === null) {
            this.runtingStatus = false
            return Promise.resolve()
        }

        // 剩余时间
        if (this.runtime <= 0) {
            this.runtime = 13
            requestAnimationFrame(() => this.runing())
            return Promise.resolve()
        }
        // 执行任务
        this.runtingStatus = true
        const start = Date.now()
        return new Promise(async (res) => { // eslint-disable-line no-async-promise-executor
            const result = await stackFun.fun()
            const end = Date.now()
            res(result)
            this.getNewRuntime(end - start)
            switch(stackFun.type) {
                case 0:
                    this.singleIdel[stackFun.id as string] = undefined
                break
                case 1:
                    this.runIdelStack.shift()
                break
                default:
                    this.runStack.shift()
            }
            this.runing()
        })
    }

    /**
     * 计算新的runtime
     * @param runting
     */
    getNewRuntime(runtime: number): void {
        this.runtime = this.runtime - runtime
    }
}

export const SchedulerController = new Scheduler

