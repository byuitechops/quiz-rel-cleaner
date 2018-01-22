/*eslint-env node, es6*/
/*eslint no-console: 1*/

/* Module Description */
/* Sanitize 'rel="noopener noreferrer" from quizzes to allow access to quiz questions via Canvas API'*/

/* Put dependencies here */
const asyncLib = require('async');
const cheerio = require('cheerio');

module.exports = (course, stepCallback) => {

    /***************************************************
     * Converts each quiz DOM to a string, removes 
     * bad rel(s), and saves the altered string as a DOM
     ***************************************************/
    function scanQuiz(quiz, i, finalCb) {
        /* convert dom to string */
        var quizContents = quiz.dom.xml(),
            itemsFound;

        /* count the strings */
        itemsFound = quizContents.match(/rel=("|')noopener\s*noreferrer\1/g);

        /* success if no dirty rel(s) were found */
        if (itemsFound === null) {
            finalCb(null);
        } else {
            
            /* replace nasty string(s) */
            quizContents = quizContents.replace(/rel=("|')noopener\s*noreferrer\1/g, '');

            /* save changes to the course Obj*/
            course.content[i].dom = cheerio.load(quizContents, {
                decodeEntities: false
            });

            /* Our work here is done */
            course.log('Removed "rel" Tags', `${itemsFound.length} rel(s) removed from ${quiz.name}`);
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
            course.error(err);
        }

        stepCallback(null, course);
    });
};
