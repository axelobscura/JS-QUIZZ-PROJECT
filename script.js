
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
            console.log('Hi');
        }
    }

})();

/*------------------------UI CONTROLLER--------------------*/
var UIController = (function () {

    var domItems = {
        /*--------------------admin panel elements-------------------*/
        questInsertBtn: document.getElementById("question-insert-btn"),
        newQuestionText: document.getElementById("new-question-text"),
        adminOptions: document.querySelectorAll("admin-options")
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