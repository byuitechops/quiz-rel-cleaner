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
            itemsFound = 0;

        /* count the strings - return null if no matches are found */
        itemsFound = quizContents.match(/rel=("|')noopener\s*noreferrer\1/g);

        /* success if no dirty rel(s) were found */
        if (itemsFound == null) {
            finalCb(null);
            return;
        } 
            
        /* save xml as a sanitized string */
        quizContents = quizContents.replace(/rel=("|')noopener\s*noreferrer\1/g, '');

        /* save changes to the course Obj */
        course.content[i].dom = cheerio.load(quizContents, {
            decodeEntities: false,
            xmlMode: true
        });

        /* Our work here is done */
        course.log('Removed "rel" Tags', {'Quiz Name': quiz.name, 'rels removed': itemsFound.length});
        finalCb(null);
    }

    /**********************************
     * Determines is a file is a quiz? 
     **********************************/
    function getQuizFiles(file, i, finalCb) {
        /* is the file a quiz? */
        if (/quiz_d2l_\d*\.xml/.test(file.name)) {
            /* if yes, sterilize it */
            scanQuiz(file, i, finalCb);
        } else {
            /* these are not the droids you're looking for */
            finalCb(null);
        }
    }

    /****************
     * STAERT HERE
     ****************/
    asyncLib.eachOf(course.content, getQuizFiles, (err) => {
        if (err) {
            course.error(err);
        }

        stepCallback(null, course);
    });
};
