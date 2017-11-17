/*eslint-env node, es6*/
/*eslint no-console: 1*/

/* Module Description */
/* Sanitize 'rel="noopener noreferrer" from quizzes to allow access to quiz questions via Canvas API'*/

/* Put dependencies here */



module.exports = (course, stepCallback) => {
    course.addModuleReport('quiz-rel-cleaner');

    
    console.log(course.content);
    
    //course.success('quiz-rel-cleaner', 'quiz-rel-cleaner successfully ...');

    // course.throwErr('quiz-rel-cleaner', e);

    stepCallback(null, course);
};
