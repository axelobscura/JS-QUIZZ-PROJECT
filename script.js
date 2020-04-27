var quizController = (function () {

    var private = 10;

    var privateFn = function (a) {
        return a + private
    }

    return {
        publicMethod: function () {
            return privateFn(20)
        }
    }

})();

var UIController = (function () {

    var num1 = 30;

    return {
        sum: function (num2) {
            return num1 + num2;
        }
    }

})();

var controller = (function (quizCtrl, UiCtrl) {

    console.log(UiCtrl.sum(200))

})(quizController, UIController);