
/*------------------------QUIZ CONTROLLER--------------------*/
var quizController = (function () {

    /*------------------------------QUESTION CONSTRUCTOR--------------------*/
    function Question(id, questionText, options, correctAnswer) {
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
    };

    return {
        addQuestionOnLocalStorage: function (newQuestionText, opts) {
            var optionsArr, corrAns, questionId, newQuestion;

            optionsArr = [];

            questionId = 0;

            for (var i = 0; i < opts.length; i++) {
                if (opts[i].value !== "") {
                    optionsArr.push(opts[i].value);
                }
                if (opts[i].previousElementSibling.checked && opts[i].value !== "") {
                    corrAns = opts[i].value;
                }
            }

            newQuestion = new Question(questionId, newQuestionText.value, optionsArr, corrAns);

            console.log(newQuestion);
        }
    }

})();

/*------------------------UI CONTROLLER--------------------*/
var UIController = (function () {

    var domItems = {
        /*--------------------admin panel elements-------------------*/
        questInsertBtn: document.getElementById("question-insert-btn"),
        newQuestionText: document.getElementById("new-question-text"),
        adminOptions: document.querySelectorAll(".admin-option")
    };

    return {
        getDomItems: domItems
    }

})();

/*------------------------CONTROLLER--------------------*/
var controller = (function (quizCtrl, UiCtrl) {

    var selectedDomitems = UiCtrl.getDomItems;

    selectedDomitems.questInsertBtn.addEventListener('click', function () {
        quizCtrl.addQuestionOnLocalStorage(selectedDomitems.newQuestionText, selectedDomitems.adminOptions);
    });

})(quizController, UIController);