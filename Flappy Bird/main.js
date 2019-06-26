const bird = $('#bird')


function FlappyBird() {
    let speed = 0
    function gravity() {
        speed += 1.25
        speed = Math.min(speed, 15)
    }
    function jumpPressed() {
    
        speed -= 30
        speed = Math.max(speed, -15)
    
    }
    function jump(key) {
        if (key.keyCode == 13) {
            jumpPressed()
        }
    }
    function mouseJump() {
        jumpPressed()
    }
    function fly() {
        let positionBird = parseInt(bird.css('top'))
        if (positionBird >= 0 && positionBird <= 570) {
            let newPos = positionBird + speed
            bird.css('top', newPos + 'px')
        }
    }
    function alive() {
        let positionBird = parseInt(bird.css('top'))
        if (!(positionBird >= 0 && positionBird <= 570)) {
            return false
        }
        else if (allPipes.checkPipeCollision(allPipes.pipesXY())){
            return false
        }
        return true
    }
    return {
        gravity,
        jump,
        mouseJump,
        fly,
        alive,
    }
}

function AllPipes() {
    function ran() {
        return (Math.floor(Math.random() * 310) - 425)
    }
    function pipeGenerator() {
        let num = ran()
        $('#container').append(`<div class="upper_pipe" style="left: 650px; top: ${num}px"></div>`)
        $('#container').append(`<div class="upper_pipe" style="left: 650px; top: ${num + 670}px"></div>`)
    }
    function distroyPipes(){
        let upperArray = $('.upper_pipe')
        if (upperArray.length > 8){
            for (let i = 0; i < 2; i++){
                $(upperArray[i]).remove()
            }
        }
    }
    function pipeMov() {
        let upperArray = $('.upper_pipe')
        for (let i = 0; i < upperArray.length; i++) {
            let positionUpper = parseInt($(upperArray[i]).css('left'))
            $(upperArray[i]).css('left', (positionUpper - 3) + 'px')
        }
    }
    function pipesXY(){
        let upperArray = $('.upper_pipe')
        let xyArray = []
        for (let i = 0; i < upperArray.length; i++) {
            let positionX = parseInt($(upperArray[i]).css('left'))
            let positionY = parseInt($(upperArray[i]).css('top'))
            xyArray.push({x: positionX, y: positionY})
        }
        return xyArray
    }
    function checkPipeCollision(arr){
        let positionBirdY = parseInt(bird.css('top'))
        for (let i = 0; i < arr.length; i++){
            if (arr[i].x > 140 && arr[i].x < 230){
                if (i%2 == 1){
                    if (positionBirdY > (arr[i].y - 30)){
                        console.log (arr[i].y)
                        console.log('lower pipe')
                        return true
                    }
                }
                else{
                    if (positionBirdY < (arr[i].y + 500)){
                        console.log (arr[i].y)
                        console.log('upper pipe')
                        return true
                    }
                }
            }
        }
        return false
    }
    return {
        pipeGenerator,
        distroyPipes,
        pipeMov,
        pipesXY,
        checkPipeCollision
    }
}

function GameController(){
    let counter = 0
    let timer = 0
    let score = 0
    let highScore = $('#high_score')
    function lastHigh(){
        if (!localStorage.highScore){
            localStorage.setItem('highScore', score)
        }
        else {
            if (localStorage.highScore < score){
                localStorage.highScore = score
            }
        }
        highScore.text(localStorage.highScore)
    }
    function genAndDistroy(){
        if (counter == (25*90)) {
            allPipes.pipeGenerator()
            allPipes.distroyPipes()
            counter = 0
        }
    }
    function appendScore(){
        if (timer > (156*25) && score >=10){
            if ((timer - (156*25)) % (25*90) == 0){
                score += 10
                $('#score').text(score)
            }
        }
        else if (timer > (156*25)){
            score += 10
            $('#score').text(score)
        }
    }
    function appendCounters(){
        counter += 25
        timer+=25
    }
    const interval = setInterval(() => {
        if (flappyBird.alive()) {
            flappyBird.gravity()
            flappyBird.fly()
            allPipes.pipeMov()
            genAndDistroy()
            appendScore()
            lastHigh()
            appendCounters()
        }
        else {
            clearInterval(interval)
        }
    }, 25)
    function initGame() {
        interval
    }
    return {
        initGame
    }
}

const allPipes = AllPipes()
const flappyBird = FlappyBird()
const gameController = GameController()
$('body').on('keydown', flappyBird.jump)
$('body').on('click', flappyBird.mouseJump)
gameController.initGame()


/* 3750 time that pipes move 450 px  */
/* 750 time that pipes move 30px */
// first score 156*25
//second and forther 90*30

