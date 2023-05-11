const Game = (function() {

    let operator = undefined;
    let NS = false;
    let round = 0;
    let numUsed = {
        "num1": false,
        "num2": false,
        "num3": false,
        "num4": false,
    }
    let memUsed = {
        "mem1": false,
        "mem2": false,
    }
    let numbers = {
        "num1": 0,
        "num2": 0,
        "num3": 0,
        "num4": 0,
    }

    const init = function(roundInfo) {
        let result = $("#result");
        reset(roundInfo.numbers);
        round = roundInfo.round;
        $(".key").on("click", (e) => {
            if (NS){
                return;
            }
            let clicked =  $(e.currentTarget);
            let id = clicked.attr("id");
            let parentID = clicked.parent().attr("id")
            switch (parentID){
                case "control":
                    switch (id){
                        case "mem1":
                        case "mem2":
                            if (!clicked.text()){
                                break;
                            }
                            if (!result.text()){
                                result.text(clicked.text())
                                clicked.text("");
                                memUsed[id] = false;
                                operator = undefined;
                                break;
                            }
                            if (!operator){
                                let temp = result.text();
                                result.text(clicked.text())
                                clicked.text(temp);
                                break;
                            }
                            result.text(calculate(result.text(), clicked.text(), operator))
                            memUsed[id] = false;
                            clicked.html("");
                            operator = undefined;
                            checkCorrect()
                            break;
                        case "no-solution":
                            onNoSolution();
                            break;
                        case "reset":
                            reset();
                            break;
                        default:
                            console.log("match failed")
                    }
                    break;
                case "num":
                    if (numUsed[id]){
                        break;
                    }
                    if (!result.text()){
                        result.text(clicked.text())
                        numUsed[id] = true;
                        clicked.html("");
                        clicked.css("background-color", 'gray');
                        operator = undefined;
                        break;
                    }
                    if (!operator){
                        for (const mem in memUsed){
                            if (!memUsed[mem]){
                                $("#" + mem).text(result.text());
                                memUsed[mem] = true;
                                result.text(clicked.text())
                                numUsed[id] = true;
                                clicked.html("");
                                clicked.css("background-color", 'gray');
                                operator = undefined;
                                break;
                            }
                        }
                        break;
                    }
                    result.text(calculate(result.text(), numbers[id], operator))
                    numUsed[id] = true;
                    clicked.html("");
                    clicked.css("background-color", 'gray');
                    operator = undefined;
                    checkCorrect()
                    break;
                case "operator":
                    operator = id;
                    break;
                default:
                    console.log("match failed")
            }
        })

        $("#result").on("click", (e) => {
            if (!$("#result").text()){
                return;
            }
            for (const mem in memUsed){
                if (!memUsed[mem]){
                    $("#" + mem).text(result.text());
                    memUsed[mem] = true;
                    $("#result").text("");
                    operator = undefined;
                    break;
                }
            }
        });
    }
    const reset = function(newNumbers) {  
        if (newNumbers){
            numbers = newNumbers;
        }
        operator = undefined;
        NS = false;
        $("#result").html("");
        $("#mem1").html("");
        $("#mem2").html("");
        $("#keypad").children().children().css("background-color", "aliceblue");

        numUsed = {
            "num1": false,
            "num2": false,
            "num3": false,
            "num4": false,
        }
        memUsed = {
            "mem1": false,
            "mem2": false,
        }
        for (const id in numbers){
            $("#" + id).html("" + numbers[id] + "");
        }

    }

    function calculate(num1, num2, ope) {  
        let operatorRes;
        switch (ope){
            case "plus":
                operatorRes = parseFloat(num1) + parseFloat(num2);
                break;
            case "minus":
                operatorRes = parseFloat(num1) - parseFloat(num2);
                break;
            case "mult":
                operatorRes = parseFloat(num1) * parseFloat(num2);
                break;
            case "divd":
                operatorRes = parseFloat(num1) / parseFloat(num2);
                break;
        }
        operatorRes = Math.round(operatorRes*1000)/1000;
        if (Math.abs(operatorRes - Math.round(operatorRes)) < 0.01){
            operatorRes = Math.round(operatorRes);

        }
        return operatorRes;
    };

    function checkCorrect(){
        if ($("#result").text() != "24"){
            return false;
        }
        for (const id in numUsed){
            if (!numUsed[id]){
                return false;
            }
        }
        for (const id in memUsed){
            if (memUsed[id]){
                return false;
            }
        }
        console.log("correct!");
        onCorrect();
        return true;
    };

    function onCorrect() {
        Socket.win(round);
    }

    function onNoSolution() {
        reset();
        $("#result").text("No Solution");
        $("#keypad").children().children().css("background-color", "gray");
        $("#no-solution").css("background-color", "yellow");
        NS = true;
        Socket.noSolution(round);
    }

    const setRound = function(r) {
        round = r;
    }

    return {init, setRound, reset};
})();