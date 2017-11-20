/*eslint-env node, es6*/
/*eslint no-console: 1*/

/* Module Description */
/* Sanitize 'rel="noopener noreferrer" from quizzes to allow access to quiz questions via Canvas API'*/

/* Put dependencies here */
const asyncLib = require('async');
const cheerio = require('cheerio');

module.exports = (course, stepCallback) => {
    course.addModuleReport('quizRelCleaner');

    /***************************************************
     * Converts each quiz DOM to a string, removes 
     * bad rel's, and saves the altered string as a DOM
     ***************************************************/
    function scanQuiz(quiz, i, finalCb) {
        /* convert dom to string */
        var quizContents = quiz.dom.xml(),
            itemsFound = 0;

        /* count the strings */
        itemsFound = quizContents.match(/rel=("|')noopener\s*noreferrer\1/g).length;

        /* success if no dirty rel's were found */
        if (itemsFound <= 0) {
            course.success('quizRelCleaner', `No rel's found in ${quiz.name}`);
            finalCb(null);
        } else {

            /* replace nasty string(s) */
            quizContents = quizContents.replace(/rel=("|')noopener\s*noreferrer\1/g, '');

            /* save changes to the course Obj*/
            course.content[i].dom = cheerio.load(quizContents, {
                decodeEntities: false
            });

            /* Our work here is done */
            course.success('quizRelCleaner', `${itemsFound} rel's removed from ${quiz.name}`);
            finalCb(null);
        }
    }

    /*********************************
     * Determines is a file is a quiz? 
     *********************************/
    function findQuizzes(file, i, finalCb) {
        /* is the file a quiz? */
        if (/quiz_d2l_\d*\.xml/.test(file.name)) {
            /* if yes, bathe it */
            scanQuiz(file, i, finalCb);
        } else {
            /* these are not the droids you're looking for */
            finalCb(null);
        }
    }

    /* start here */
    asyncLib.eachOf(course.content, findQuizzes, (err) => {
        if (err) {
            course.throwErr('quizRelCleaner', err);
        }

        /* for testing, check each quiz for bad rel's */
        /*course.content.forEach((item)=>{
           if (/quiz_d2l_\d*\.xml/.test(item.name)) {
               console.log(item.name);
               console.log(item.dom.xml());
           }
        });*/

        stepCallback(null, course);
    });
};
