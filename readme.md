# Description #
The quiz-rel-cleaner is part of the D2l-to-canvas-conversion-tool. It removes ```rel="noopener noreferrer"``` from quizzes so that we can access the quiz questions in the post-conversion process. 
Without removing this code the Canvas API throws a ```503``` error while attempting to access quiz questions.