// it is used later by another function below
const getRandomQuestions = require('./getRandomQuestions');

function getRandomQuestionsByDistribution(questions, distribution) {
    const selectedQuestions = [];
    let remainingMarks = 0;
  
    distribution.forEach(({ difficulty, totalMarks }) => {
      const difficultyQuestions = questions.filter(q => q.difficulty === difficulty);
  
      // Ensure that totalMarks does not exceed the total available marks for this difficulty
      const cappedTotalMarks = Math.min(totalMarks, difficultyQuestions.reduce((acc, q) => acc + q.marks, 0));
  
      // Calculate remaining marks for the next difficulty level
      remainingMarks = totalMarks - cappedTotalMarks;
  
      // Get random questions for the current difficulty level
      const randomQuestions = getRandomQuestions(difficultyQuestions, cappedTotalMarks);
      selectedQuestions.push(...randomQuestions);
  
   
    });
  
    return selectedQuestions;
  }

  module.exports = getRandomQuestionsByDistribution;