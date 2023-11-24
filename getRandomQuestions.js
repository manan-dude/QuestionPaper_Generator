function getRandomQuestions(questions, targetMarks) {
    // Sort questions in descending order based on marks
    const sortedQuestions = questions.slice().sort((a, b) => b.marks - a.marks);
    
    let selectedQuestions = [];
    let currentMarks = 0;
    
    for (const question of sortedQuestions) {
      // Check if adding the current question exceeds the target marks
      if (currentMarks + question.marks <= targetMarks) {
        selectedQuestions.push(question);
        currentMarks += question.marks;
      }
    
      // If the target marks are reached, break out of the loop
      if (currentMarks === targetMarks) {
        break;
      }
    }
    
    return selectedQuestions;
      }
    
    
module.exports = getRandomQuestions;