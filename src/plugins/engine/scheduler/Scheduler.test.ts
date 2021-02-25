import { Scheduler } from './Scheduler'

test('test Scheduler run 1 stack', () => {
    const SchedulerController = new Scheduler
    const sub = jest.fn()
    const cb1 = () => sub()
    SchedulerController.run(cb1)
    expect(sub).toHaveBeenCalledTimes(1)
})

test('test Scheduler run 3 * 6ms stack', () => {
    const SchedulerController = new Scheduler

    const sub = jest.fn()
    const cb2 = async () => {
        return new Promise(res => {
            setTimeout(() => {
                res(sub())
            }, 6)
        })
    }
    SchedulerController.run(cb2)
    SchedulerController.run(cb2)
    SchedulerController.run(cb2)

    return new Promise(res => {
        setTimeout(() => res(null), 17)
    }).then(() => expect(sub).toHaveBeenCalledTimes(2))
})

test('test Scheduler 3 * 5ms stack', () => {
    const SchedulerController = new Scheduler

    const sub = jest.fn()
    const cb3 = async () => {
        return new Promise(res => {
            setTimeout(() => {
                res(sub())
            }, 5)
        })
    }
    SchedulerController.run(cb3)
    SchedulerController.run(cb3)
    SchedulerController.run(cb3)

    return new Promise(res => {
        setTimeout(() => res(null), 14)
    }).then(() => expect(sub).not.toHaveBeenCalledTimes(3))
})

test('test Schedule run 8ms the stack and runIdle 1 the stack', async () => {
    const SchedulerController = new Scheduler

    const stackSub = jest.fn()
    const idleSub = jest.fn()

    const stackCb = async () => {
        return new Promise(res => {
            setTimeout(() => res(stackSub()), 4)
        })
    }

    SchedulerController.run(stackCb)
    SchedulerController.run(stackCb)
    SchedulerController.runIdle(() => idleSub())
    expect(idleSub).toHaveBeenCalledTimes(0)

    return new Promise(res => setTimeout(() => res(null), 13))
        .then(() => {
            expect(stackSub).toHaveBeenCalledTimes(2)
            expect(idleSub).toHaveBeenCalledTimes(1)
        })
})

test('test Schedule runIdle 6 the stack and run 1ms the stack', () => {
    const SchedulerController = new Scheduler

    const runSub = jest.fn()
    const idleSub = jest.fn()

    const idleCb = () => {
        return new Promise(res => setTimeout(() => res(idleSub()), 1))
    }
    const runCb = () => {
        return new Promise(res => setTimeout(() => res(runSub()), 1))
    }

    for(let i = 0; i < 6; i ++)
        SchedulerController.runIdle(idleCb)

    SchedulerController.run(runCb)
    return new Promise(res => setTimeout(() => res(null), 5))
        .then(() => {
            expect(idleSub).not.toHaveBeenCalledTimes(0)
            expect(runSub).toHaveBeenCalledTimes(1)
        })

})

test('test Schedule runSingleIdle 1 the stack', () => {
    const SchedulerController = new Scheduler

    const single = jest.fn()
    SchedulerController.runSingleIdle(single, '1stack')
    expect(single).toHaveBeenCalledTimes(1)
})

test('test Schedule runSingleIdel and run and runIdle', () => {
    const SchedulerController = new Scheduler
    const runSub = jest.fn(() => Date.now())
    const idleSub = jest.fn(() => Date.now())
    const singleSub = jest.fn(() => Date.now())

    const cb = () => {
        return new Promise(res => {
            setTimeout(() => {
                res(runSub())
            }, 2)
        })
    }

    SchedulerController.run(cb)
    SchedulerController.runSingleIdle(singleSub, '2')
    SchedulerController.runIdle(idleSub)
    SchedulerController.run(cb)
    return new Promise(res => {
        setTimeout(() => res(null), 100)
    }).then(() => {
        expect(idleSub.mock.results[0].value <= singleSub.mock.results[0].value).toBe(true)
        expect(runSub.mock.results[1].value <= idleSub.mock.results[0].value).toBe(true)
    })

})

