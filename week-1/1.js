let cnt = 30;

let timer = setInterval(() => {
    console.log(cnt);
    cnt--;

    if(cnt < 0){
        clearInterval(timer);
        console.log('time up');
    }
}, 1000);
