function getToken(key) {
    return `${key}-${Date.now()}`
}

function run() {
    const list = []
    const token = getToken('concat')
    console.time(token)
    for(let i = 0; i < 10000; i ++)
        list.concat(new Array(10))
    console.timeEnd(token)
}


function run2() {
    const list = []
    const token = getToken('lenght')
    console.time(token)
    for(let i = 0; i < 10000; i ++)
        list.length
    console.timeEnd(token)
}
