/*eslint-env node, es6*/
/*eslint no-console: 1*/

/* Module Description */
/* Sanitize 'rel="noopener noreferrer" from quizzes to allow access to quiz questions via Canvas API'*/

/* Put dependencies here */
const asyncLib = require('async');
const cheerio = require('cheerio');

module.exports = (course, stepCallback) => {
    course.addModuleReport('quizRelCleaner');


    //console.log(course.content);


    function scanQuiz(quiz, i, finalCb) {
        /* convert dom to string*/
        var quizContents = quiz.dom.xml();
        /* replace nasty string(s) */
        quizContents.replace(/rel=("|')noopener\s*noreferrer\1/g, '');

        //quiz = cheerio.load(quizContents, {decodeEntities: false});

        course.content[i] = cheerio.load(quizContents, {
            decodeEntities: false
        });

        finalCb(null);
    }

    function findQuizzes(file, i, finalCb) {
        if (/quiz_d2l_\d*\.xml/.test(file.name)) {
            // is a quiz. Keep searching
            scanQuiz(file, i, finalCb);
        } else {
            finalCb(null);
        }
    }

    asyncLib.eachOf(course.content, findQuizzes, (err) => {
        if (err) {
            course.throwErr('quizRelCleaner', err);
            // console.error(err);
        }
        console.log(course.content);
        stepCallback(null, course);
    });

    //course.success('quizRelCleaner', 'quizRelCleaner successfully ...');


    //stepCallback(null, course);
};


/*
$('mattext').get().forEach((ele) => {
    //console.log(count, $(ele).text());
    a = $(ele).text();
    a = a.replace(/rel=("|')noopener\s*noreferrer\1/g, '');
    
    
});
*/
