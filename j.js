let main = document.querySelector('.bmd-layout-content');
let modalBox = document.querySelector('.modal-box');
let modalBody = document.querySelector('.modal-body');
let navbarToggler = document.querySelector('.navbar-toggler');
navbarToggler.addEventListener('click', drawer);
let quizCounter = 0; 
let totalRightAwnsers = 0;
let totalFalseAwnsers = 0;
let totalRightPercentage = 0;
console.log('totalRightPercentage',totalRightPercentage);

let startButton = document.querySelector('.start-button');
let reStartButton = document.querySelector('.re-start');

reStartButton.addEventListener('click', () => {
    main.style.display = 'flex';
    $(".modal").modal('hide');
    main.innerHTML = `<button class="btn start-button" type="submit">Start quiz</button>`;
    startButton = main.querySelector('button');
    startButton.addEventListener('click', start);
});

function htmlDecode(input) {
    let doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}


// Om vi skriver JavaScript-kod för en komponent och lägger på en event handler
// för “click”-event måste vi även lägga till en event handler för “keydown” och
// kolla om användaren tryckt på Space-tangenten

$(".list-group-item").attr("tabindex", "-1");

function drawer() {
    let drawerOpen = navbarToggler.getAttribute('aria-expanded');
    if (drawerOpen === 'true') {
        $(".list-group-item").attr("tabindex", "-1");
    } else {
        $(".list-group-item").attr("tabindex", "0");
        gameScreen.focus();
    }
}
let currentId = 0;
function getNewId() {
    currentId += 1;
    return currentId;
}

let gameScreen = document.querySelector('.game-screen');
gameScreen.addEventListener('click', ()=> {
    main.innerHTML = `<button class="btn start-button" type="submit">Start quiz</button>`;
    main.style.display = 'flex';
    startButton = main.querySelector('button');
    startButton.addEventListener('click', start);
    $(".navbar-toggler").click(); 
    $(".list-group-item").attr("tabindex", "-1");
});
let stats = document.querySelector('.stats');
stats.addEventListener('click', ()=> {
    main.innerHTML = '';
    let div = document.createElement('div');
    main.appendChild(div);
    div.style.display = 'flex';
    div.style.height = '500px';
    div.style.flexDirection = 'column';
    div.style.justifyContent = 'center';
    div.style.alignItems = 'center';
    let gamesPlayed = document.createElement('p');
    gamesPlayed.textContent = 'GAMES PLAYED';
    let gamesPlayedNum = document.createElement('p');
    gamesPlayedNum.textContent = `${quizCounter}`;
    div.appendChild(gamesPlayed);
    div.appendChild(gamesPlayedNum);

    let correctAnswers = document.createElement('p');
    correctAnswers.textContent = 'CORRECT ANSWERS';
    let correctAnswersNum = document.createElement('p');
    correctAnswersNum.textContent = `${totalRightAwnsers}`;
    div.appendChild(correctAnswers);
    div.appendChild(correctAnswersNum);

    let inCorrectAnswers = document.createElement('p');
    inCorrectAnswers.textContent = 'INCORRECT ANSWERS';
    let inCorrectAnswersNum = document.createElement('p');

    inCorrectAnswersNum.textContent = `${totalFalseAwnsers}`;
    div.appendChild(inCorrectAnswers);
    div.appendChild(inCorrectAnswersNum);

    let correctPercentage = document.createElement('p');
    correctPercentage.textContent = 'CORRECT PROCENTAGE';
    let correctPercentageNum = document.createElement('p');
    correctPercentageNum.textContent = `${parseInt(totalRightPercentage)}%`;
    div.appendChild(correctPercentage);
    div.appendChild(correctPercentageNum);

    $(".navbar-toggler").click(); 
    $(".list-group-item").attr("tabindex", "-1");
});
let aboutThisApp = document.querySelector('.about-this-app');
aboutThisApp.addEventListener('click', ()=> {
    main.innerHTML = '';
    main.style.display = 'flex';
    let div = document.createElement('div');
    div.style.marginLeft = '50px';
    div.style.marginRight = '50px';
    main.appendChild(div);
    let h1 = document.createElement('h1');
    h1.textContent = 'About this app';
    let p = document.createElement('p');
    p.textContent = 'hej'
    div.appendChild(h1);
    div.appendChild(p);
    $(".navbar-toggler").click(); 
    $(".list-group-item").attr("tabindex", "-1");
});

startButton.addEventListener('click', start);

function start() {
    startButton.setAttribute('aria-label','quiz startad');
    $("html")[0].scrollTop = 0;
    main.innerHTML = '';
    main.style.display = 'block';
    function reqListener () {
        if (this.status >= 200 && this.status < 400) {
            let json = this.responseText;
            let js = JSON.parse(json);
            render(js.results);  
        }
    };
    function doReq() {
        let oReq = new XMLHttpRequest();
        oReq.addEventListener('load', reqListener);
        let url = 'https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple';
        oReq.open('GET', url);   
        oReq.send();
    };
    doReq(); 
}

function render(arr) {
    let questionCount = 0;
    let correctIndexArr =[];
    let howManyRightAns;
    arr.forEach((x, idx) => {  
        questionCount++;
        let answersToShuffle = [];
        x.incorrect_answers.map(inc => answersToShuffle.push(inc));
        answersToShuffle.push(x.correct_answer);
        function shuffle(array) {
            let currentIndex = array.length, temporaryValue, randomIndex;
            // While there remain elements to shuffle...
            while (0 !== currentIndex) {
                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        }
        let shuffled = shuffle(answersToShuffle);
        
        let div = document.createElement('div');
        div.classList.add('QContainer');
        div.style.margin = '50px';
        main.appendChild(div);
        let q = document.createElement('h4');
        q.textContent = `Q${questionCount}: ${htmlDecode(x.question)}`;
        q.setAttribute('aria-label', x.question);
        q.setAttribute('tabindex', '0');
        //console.log('x.question',x.question);
        div.appendChild(q);
        const correctIndex = shuffled.indexOf(x.correct_answer); //hhhhhhhhhh input hae 
        correctIndexArr.push(correctIndex);
        //console.log('correctIndex', correctIndex);
        
        shuffled.forEach((ans, jdx) => {
            let container = document.createElement('div');
            let input = document.createElement('input');
            input.type = 'radio';
            input.name = `Q_${questionCount}`;
            input.style.marginRight = '5px';
            input.value = ans;
            const myId = getNewId();
            input.id = "answer-" + myId;
            input.classList.add('answers');
            let label = document.createElement('label');
            label.htmlFor = "answer-" + myId;
            label.textContent = htmlDecode(ans);
            container.appendChild(input);
            container.appendChild(label);
            div.appendChild(container);
            input.dataset.correct = jdx === correctIndex; // hhhhhhhhhhh
            //console.log('correctAns',input.dataset.correct);
        });
        //console.log('correctIndex=',correctIndex);
    });
    //console.log(correctIndexArr);
    let submitButtonDiv = document.createElement('div');
    submitButtonDiv.id = 'submitButtonDiv';
    let submit = document.createElement('button');
    submit.type = 'button';
    submit.classList.add('btn', 'btn-sm', 'submit-btn');
    submit.style.margin = '10px 10px 50px 50px'
    submit.textContent = 'submit quiz';
    main.appendChild(submitButtonDiv);
    submitButtonDiv.appendChild(submit);
    submit.addEventListener('click', ()=> {
        howManyRightAns = 0;
        howManyFalseAns = 0;
        let questions = document.querySelectorAll('.QContainer');
        let allChecked = true;
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];

            //console.log('question',question);
            answers = question.querySelectorAll('.answers');
            //console.log('answer',answer);
            let answerIndex = Array.from(answers).findIndex((x) => { //här får vi rätt svarat index
                //hur ska jag gör här för att loopa igenom correctIndexArr och kolla om svarat index === correctIndexArr
                return x.checked;
            });
            if (answerIndex === correctIndexArr[i]) {
                howManyRightAns++;
            } else howManyFalseAns++;
            if (answerIndex === -1) {
                allChecked = false;
            }
        }
        let p;
        if (!allChecked) {
            if (!document.getElementById("error")) {
                p = document.createElement('p');
                p.id = "error";
                p.textContent = 'Please answer all the questions';
                p.style.color = 'red';
                p.style.marginLeft = '50px';
                submit.parentNode.insertBefore(p, submit);
            } 
        } else {
            quizCounter++;
            modalBody.textContent = `You had the score ${howManyRightAns}/10`;
            totalRightAwnsers = totalRightAwnsers + howManyRightAns;
            console.log('totalRightAwnsers',totalRightAwnsers);
            totalFalseAwnsers = totalFalseAwnsers + howManyFalseAns;
            totalRightPercentage = (totalRightAwnsers / (totalRightAwnsers + totalFalseAwnsers)) * 100;
            console.log('totalFalseAwnsers',totalFalseAwnsers);
            if (document.getElementById("error")) {
                document.getElementById("error").remove();
            }
            $(".modal").modal();
        }
    });
}
function shuffleAnswer() {
    
}

function showResult() {
    
}

//glöm inte lägga på aria attr på frågorna