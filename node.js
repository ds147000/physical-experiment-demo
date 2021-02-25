const list = [o1, o2, o1, o3]

async function run() {

    const gen = function* () {
        const cb = yield null
        while(list.length) {
            yield list[0](cb)
            list.shift()
        }

        return
    }
    const stack = gen()

    stack.next()
    stack.next(() => Promise.resolve().then(() => stack.next()))
}

function o1(next) {
    console.log(1)
    next()
}

function o2(next) {
    setTimeout(async () => {
        console.log(2)
        next()
    }, 1000)
}

function o3(next) {
    setTimeout(async () => {
        console.log(3)
        next()
    })
}
