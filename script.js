
/*------------------------QUIZ CONTROLLER--------------------*/
var quizController = (function () {

    /*------------------------------QUESTION CONSTRUCTOR--------------------*/
    function Question(id, questionText, options, correctAnswer) {
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
    };

    var questionLocalStorage = {
        setQuestionCollection: function (newCollection) {
            localStorage.setItem('questionCollection', JSON.stringify(newCollection));
        },
        getQuestionCollection: function () {
            return JSON.parse(localStorage.getItem('questionCollection'));
        },
        removeQuestionCollection: function () {
            localStorage.removeItem('questionCollection');
        }
    };

    if (questionLocalStorage.getQuestionCollection() === null) {
        questionLocalStorage.setQuestionCollection([]);
    };

    var quizProgress = {
        questionIndex: 0
    }

    return {

        getQuizProgress: quizProgress,

        getQuestionLocalStorage: questionLocalStorage,

        addQuestionOnLocalStorage: function (newQuestionText, opts) {
            var optionsArr, corrAns, questionId, newQuestion, getStoredQuests, isChecked;

            if (questionLocalStorage.getQuestionCollection() === null) {
                questionLocalStorage.setQuestionCollection([]);
            }

            optionsArr = [];

            isChecked = false;

            for (var i = 0; i < opts.length; i++) {
                if (opts[i].value !== "") {
                    optionsArr.push(opts[i].value);
                }
                if (opts[i].previousElementSibling.checked && opts[i].value !== "") {
                    corrAns = opts[i].value;
                    isChecked = true;
                }
            }

            if (questionLocalStorage.getQuestionCollection().length > 0) {
                questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length - 1].id + 1;
            } else {
                questionId = 0;
            }

            if (newQuestionText.value !== "") {

                if (optionsArr.length > 1) {
                    if (isChecked) {
                        newQuestion = new Question(questionId, newQuestionText.value, optionsArr, corrAns);

                        getStoredQuests = questionLocalStorage.getQuestionCollection();

                        getStoredQuests.push(newQuestion);

                        questionLocalStorage.setQuestionCollection(getStoredQuests);

                        newQuestionText.value = "";

                        for (var x = 0; x < opts.length; x++) {
                            opts[x].value = "";
                            opts[x].previousElementSibling.checked = false;
                        }

                        console.log(questionLocalStorage.getQuestionCollection());

                        return true;

                    } else {
                        alert('You missed to check the correct answer...');
                        return false;
                    }
                } else {
                    alert('You must insert at least 2 options');
                    return false;
                }

            } else {
                alert('Please, insert question...');
                return false;
            }
        },

        checkAnswer: function (ans) {
            if (questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correctAnswer === ans.textContent) {
                return true;
            } else {
                return false;
            }
        }

    };

})();

/*------------------------UI CONTROLLER--------------------*/
var UIController = (function () {

    var domItems = {
        /*--------------------admin panel elements-------------------*/
        questInsertBtn: document.getElementById("question-insert-btn"),
        newQuestionText: document.getElementById("new-question-text"),
        adminOptions: document.querySelectorAll(".admin-option"),
        adminOptionsContainer: document.querySelector(".admin-options-container"),
        insertedQuestionsWrapper: document.querySelector(".inserted-questions-wrapper"),
        questionUpdateBtn: document.getElementById("question-update-btn"),
        questionDeleteBtn: document.getElementById("question-delete-btn"),
        questionInsertBtn: document.getElementById("question-insert-btn"),
        questsClearBtn: document.getElementById("questions-clear-btn"),
        //-------------select elements from quiz section-----------------/
        askedQuestionText: document.getElementById("asked-question-text"),
        quizOptionsWrapper: document.querySelector(".quiz-options-wrapper"),
        progressBar: document.querySelector("progress"),
        progressPar: document.getElementById("progress")
    };

    return {
        getDomItems: domItems,
        addInputsDynamically: function () {

            var addInput = function () {
                var inputHTML, z;

                z = document.querySelectorAll(".admin-option").length;

                inputHTML = `<div class="admin-option-wrapper"><input type="radio" class="admin-option-${z}" name="answer" value="${z}" ><input type="text" class="admin-option admin-option-${z}" value=""></div>`;

                domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);

                domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);

                domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
            }

            domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);

        },

        createQuestionList: function (getQuestions) {
            var questionHTML, numberinArr;

            numberinArr = [];

            domItems.insertedQuestionsWrapper.innerHTML = "";

            for (var i = 0; i < getQuestions.getQuestionCollection().length; i++) {

                numberinArr.push(i + 1);

                questionHTML = `<p><span>${numberinArr[i]}. ${getQuestions.getQuestionCollection()[i].questionText}</span><button id="question-${getQuestions.getQuestionCollection()[i].id}">Edit</button></p>`;

                domItems.insertedQuestionsWrapper.insertAdjacentHTML('afterbegin', questionHTML);

            }

        },

        editQuestionList: function (event, storageQuestionList, addInpsDynFn, updateQuestionFn) {

            var getId, getStorageQuestionList, foundItem, placeInArr, optionHTML;

            if ('question-'.indexOf(event.target.id)) {
                getId = parseInt(event.target.id.split('-')[1]);
                getStorageQuestionList = storageQuestionList.getQuestionCollection();
                for (var i = 0; i < getStorageQuestionList.length; i++) {
                    if (getStorageQuestionList[i].id === getId) {
                        foundItem = getStorageQuestionList[i];
                        placeInArr = i;
                    }
                }

                domItems.newQuestionText.value = foundItem.questionText;

                domItems.adminOptionsContainer.innerHTML = "";

                optionHTML = "";

                for (var x = 0; x < foundItem.options.length; x++) {
                    optionHTML += `<div class="admin-option-wrapper">
                                    <input type="radio" class="admin-option-${x}" name="answer" value="0">
                                    <input type="text" class="admin-option admin-option-${x}" value="${foundItem.options[x]}">
                                </div>`;
                }

                domItems.adminOptionsContainer.innerHTML = optionHTML;
                domItems.questionUpdateBtn.style.visibility = "visible";
                domItems.questionDeleteBtn.style.visibility = "visible";
                domItems.questionInsertBtn.style.visibility = "hidden";
                domItems.questsClearBtn.style.pointerEvents = "none";

                addInpsDynFn();

                var backDefaultView = function () {
                    var updatedOtions;
                    domItems.newQuestionText.value = '';
                    updatedOtions = document.querySelectorAll(".admin-option");

                    for (var i = 0; i < updatedOtions.length; i++) {
                        updatedOtions[i].value = "";
                        updatedOtions[i].previousElementSibling.checked = false;
                    }

                    domItems.questionUpdateBtn.style.visibility = "hidden";
                    domItems.questionDeleteBtn.style.visibility = "hidden";
                    domItems.questionInsertBtn.style.visibility = "visible";
                    domItems.questsClearBtn.style.pointerEvents = "";

                    updateQuestionFn(storageQuestionList);
                }

                var updateQuestion = function () {
                    var newOptions, optionEls;

                    newOptions = [];

                    optionEls = document.querySelectorAll(".admin-option");

                    foundItem.questionText = domItems.newQuestionText.value;
                    foundItem.correctAnswer = '';

                    for (var i = 0; i < optionEls.length; i++) {
                        if (optionEls[i] !== "") {
                            newOptions.push(optionEls[i].value);
                            if (optionEls[i].previousElementSibling.checked) {
                                foundItem.correctAnswer = optionEls[i].value;
                            }

                        }
                    }

                    foundItem.options = newOptions;

                    if (foundItem.questionText !== '') {
                        if (foundItem.options.length > 1) {
                            if (foundItem.correctAnswer !== "") {
                                getStorageQuestionList.splice(placeInArr, 1, foundItem);

                                storageQuestionList.setQuestionCollection(getStorageQuestionList);

                                backDefaultView();

                            } else {
                                alert('You missed to check the correct answer...')
                            }

                        } else {
                            alert('You must insert at least 2 options...');
                        }

                    } else {
                        alert('Please insert question');
                    }


                }

                domItems.questionUpdateBtn.onclick = updateQuestion;


                var deleteQuestion = function () {

                    getStorageQuestionList.splice(placeInArr, 1);

                    storageQuestionList.setQuestionCollection(getStorageQuestionList);

                    backDefaultView();

                }

                domItems.questionDeleteBtn.onclick = deleteQuestion;
            }


        },

        clearQuestionList: function (storageQuestionList) {

            if (storageQuestionList.getQuestionCollection() !== null) {
                if (storageQuestionList.getQuestionCollection().length > 0) {
                    var conf = confirm('Warning you will loose entire question list!!!');

                    if (conf) {
                        storageQuestionList.removeQuestionCollection();
                        domItems.insertedQuestionsWrapper.innerHTML = '';
                    }

                }
            }
        },

        displayQuestion: function (storageQuestionList, progress) {

            var newOptionHTML, characterArray;

            characterArray = ['A', 'B', 'C', 'D', 'E', 'F'];

            if (storageQuestionList.getQuestionCollection().length > 0) {
                domItems.askedQuestionText.textContent = storageQuestionList.getQuestionCollection()[progress.questionIndex].questionText;
                domItems.quizOptionsWrapper.innerHTML = "";

                for (var i = 0; i < storageQuestionList.getQuestionCollection()[progress.questionIndex].options.length; i++) {
                    newOptionHTML = `<div class="choice-${i}"><span class="choice-${i}">${characterArray[i]}</span><p class="choice-${i}">${storageQuestionList.getQuestionCollection()[progress.questionIndex].options[i]}</p></div>`;

                    domItems.quizOptionsWrapper.insertAdjacentHTML('beforeend', newOptionHTML);
                }
            }
        },

        displayProgress: function (storageQuestionList, progress) {

            domItems.progressBar.max = storageQuestionList.getQuestionCollection().length;

            domItems.progressBar.value = progress.questionIndex + 1;

            domItems.progressPar.textContent = (progress.questionIndex + 1) + '/' + storageQuestionList.getQuestionCollection().length;

        }

    }

})();

/*------------------------CONTROLLER--------------------*/
var controller = (function (quizCtrl, UiCtrl) {

    var selectedDomitems = UiCtrl.getDomItems;

    UIController.addInputsDynamically();

    UIController.createQuestionList(quizController.getQuestionLocalStorage);

    selectedDomitems.questInsertBtn.addEventListener('click', function () {
        var adminOptions = document.querySelectorAll('.admin-option');
        var checkBoolean = quizCtrl.addQuestionOnLocalStorage(selectedDomitems.newQuestionText, adminOptions);
        if (checkBoolean) {
            UIController.createQuestionList(quizController.getQuestionLocalStorage);
        }
    });

    selectedDomitems.insertedQuestionsWrapper.addEventListener('click', function (e) {
        UiCtrl.editQuestionList(e, quizCtrl.getQuestionLocalStorage, UIController.addInputsDynamically, UIController.createQuestionList);
    });

    selectedDomitems.questsClearBtn.addEventListener('click', function () {
        UiCtrl.clearQuestionList(quizCtrl.getQuestionLocalStorage);
    });

    UiCtrl.displayQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

    UiCtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);


    selectedDomitems.quizOptionsWrapper.addEventListener('click', function (e) {

        var updatedOptionsDiv = selectedDomitems.quizOptionsWrapper.querySelectorAll('div');

        for (var i = 0; i < updatedOptionsDiv.length; i++) {
            if (e.target.className === 'choice-' + i) {

                var answer = document.querySelector('.quiz-options-wrapper div p.' + e.target.className);

                quizCtrl.checkAnswer(answer);

            }
        }

    });

})(quizController, UIController);