const readline = require('readline-sync'); // Import readline-sync for input
const prompt = require('prompt-sync')(); //  Import  prompt-sync for input
const fs = require('fs');//// Importing the 'fs' (File System) module for handling file-related operations
let questions = require('./QuestionBank'); // Question Bank for question generation
const { json } = require('express/lib/response');


// Greedy Method to select random question from the question bank for a particular score(another js file)
// it is used later by another function below
const getRandomQuestions = require('./getRandomQuestions');




// Calculating the Marks distribution based on difficulty from total Marks
  function calculateMarksByDistribution(totalMarks, difficultyDistribution) {
    const marksByDifficulty = {};
  
    difficultyDistribution.forEach(({ difficulty, percentage }) => {
      marksByDifficulty[difficulty] = Math.ceil((percentage / 100) * totalMarks);
    });
  
    return marksByDifficulty;

  }

  
// Input format is (100 marks, Difficulty, {20% Easy, 50% Medium, 30% Hard })
// Taking User-Input
console.log('\n');
  console.log('================================================');
  console.log('   Let us create the question paper. 📚');
  console.log('================================================');
 
  // Prompt user for total marks
const totalMarks = parseFloat(prompt("Enter the total marks:"));
let difficultyDistribution;

// Check if total marks is valid
if (!isNaN(totalMarks) && totalMarks > 0) {
  // Prompt user for difficulty distribution percentages
  const easyPercentage = parseFloat(prompt("Enter the percentage for Easy difficulty:"));
  const mediumPercentage = parseFloat(prompt("Enter the percentage for Medium difficulty:"));
  const hardPercentage = parseFloat(prompt("Enter the percentage for Hard difficulty:"));

  // Check if percentages are valid
  const isValidPercentages = !isNaN(easyPercentage) && !isNaN(mediumPercentage) && !isNaN(hardPercentage) &&
    easyPercentage >= 0 && mediumPercentage >= 0 && hardPercentage >= 0 &&
    (easyPercentage + mediumPercentage + hardPercentage) === 100;

  if (isValidPercentages) {
    difficultyDistribution = [
      { difficulty: "Easy", percentage: easyPercentage },
      { difficulty: "Medium", percentage: mediumPercentage },
      { difficulty: "Hard", percentage: hardPercentage },
    ];

    console.log("Total Marks:", totalMarks);
    console.log("Difficulty Distribution:", difficultyDistribution);
  } else {
    console.error("Invalid percentage values. Please make sure the total percentage is 100 and each individual percentage is non-negative.");
  }
} else {
  console.error("Invalid total marks value. Please enter a positive number for total marks.");
}

  
  const marksByDifficulty = calculateMarksByDistribution(totalMarks, difficultyDistribution);
      
   
  
// Example usage to get questions based on the specified distribution and total marks
const totalMarksDistribution = [
  { difficulty: "Easy", totalMarks: marksByDifficulty["Easy"] },
  { difficulty: "Medium", totalMarks: marksByDifficulty["Medium"] },
  { difficulty: "Hard", totalMarks: marksByDifficulty["Hard"] },
];


  
  // Display the calculated marks for each difficulty level
  console.log('\n');
  console.log('================================================');
  console.log('   Marks Distribution according to input. ✅');
  console.log('================================================');
 
  Object.entries(marksByDifficulty).forEach(([difficulty, marks]) => {
    console.log(`${difficulty}: ${marks} marks`);
  });
  





// Now we will select random questions for each difficulty(another js file)
// here we are using the function getRandomQuestions
const getRandomQuestionsByDistribution = require('./getRandomQuestionsByDistribution');


  
  

  

  
  // Display the selected questions with difficulty levels and marks
  
  let easy = 0;
  let medium = 0;
  let hard = 0;
  console.log('\n');
  console.log('=============================');
  console.log('  Prepared Question Paper.📝 ');
  console.log('=============================');
  const selectedQuestionsByDistribution = getRandomQuestionsByDistribution(questions, totalMarksDistribution);
  selectedQuestionsByDistribution.forEach((q, index) => {
    console.log(`${index + 1}. Difficulty: ${q.difficulty}, Question: ${q.question}, Marks: ${q.marks}`);
    // It also can see how many marks are remainig for each section
    if(q.difficulty=="Easy")
    {
      easy+=q.marks;
    }
    else if(q.difficulty=="Medium")
    {
      medium+=q.marks;
    }
    else if(q.difficulty=="Hard")
    {
      hard+=q.marks;
    }
  });


  
// Also if the marks not fulfilled user can add questions manually
  console.log('\n');
  console.log('=============================');
  console.log('  Remaining Marks.🖩 ');
  console.log('=============================');
  console.log( "Remaining Marks for Easy Section:",marksByDifficulty["Easy"]-easy);
  console.log( "Remaining Marks for Medium Section:",marksByDifficulty["Medium"]-medium);
  console.log( "Remaining Marks for Hard Section:",marksByDifficulty["Hard"]-hard);

  // Adding questions so that we can fulfill the remaining questions and also contribute  to our question bank
  let remEasy = marksByDifficulty["Easy"]-easy;
  let remMed = marksByDifficulty["Medium"]-medium;
  let remHard = marksByDifficulty["Hard"]-hard; 

  if(remEasy+remMed+remHard>0 )
  {
    console.log('\n');
    console.log('=========================================');
    console.log('  Add question for Setting the paper. ➕');
    console.log('========================================');
  }

  const remQues = JSON.parse(fs.readFileSync('QuestionBank.json','utf-8'));



  // asking user to add question based on the requirement
  if(remEasy!=0)
  {
  console.log('Questions for Easy');
  while (remEasy > 0) {
    // Logic to take input for a new question
    const newQuestion = {
      question: readline.question('Enter the question: '),
      subject: readline.question('Enter the subject: '),
      topic: readline.question('Enter the topic: '),
      difficulty: 'Easy',
      marks: parseInt(readline.question('Enter the marks: '), 10),
    };
  
    // Subtract the marks from remEasy
    remEasy -= newQuestion.marks;
  
    // Add the new question to selectedQuestionsByDistribution
    selectedQuestionsByDistribution.push(newQuestion);

    // contribute to the question bank also
    remQues.push(newQuestion);
   
  }
}





// Medium
if(remMed!=0)
{
console.log('Questions for Medium');
  while (remMed > 0) {
    // Logic to take input for a new question
    const newQuestion = {
      question: readline.question('Enter the question: '),
      subject: readline.question('Enter the subject: '),
      topic: readline.question('Enter the topic: '),
      difficulty: 'Medium',
      marks: parseInt(readline.question('Enter the marks: '), 10),
    };
  
    // Subtract the marks from remEasy
    remMed -= newQuestion.marks;
  
    // Add the new question to selectedQuestionsByDistribution
    selectedQuestionsByDistribution.push(newQuestion);
    // contribute to the question bank also
    remQues.push(newQuestion);

 
  }
}

  // Hard
  if(remHard!=0)
  {
  console.log('Questions for Hard');
  while (remHard > 0) {
    // Logic to take input for a new question
    const newQuestion = {
      question: readline.question('Enter the question: '),
      subject: readline.question('Enter the subject: '),
      topic: readline.question('Enter the topic: '),
      difficulty: 'Hard',
      marks: parseInt(readline.question('Enter the marks: '), 10),
    };
  
    // Subtract the marks from remEasy
    remHard -= newQuestion.marks;
  
    // Add the new question to selectedQuestionsByDistribution
    selectedQuestionsByDistribution.push(newQuestion);

    // contribute to the question bank also
    remQues.push(newQuestion);
  }
  }

  // Updating the Question Bank

  fs.writeFileSync('QuestionBank.json',JSON.stringify(remQues,null,2));

 
  // Display the updated question paper
  console.log('\n');
  console.log('=============================');
  console.log('  Final Question Paper.📜 ');
  console.log('=============================');
selectedQuestionsByDistribution.sort((a, b) => a.difficulty.localeCompare(b.difficulty));

selectedQuestionsByDistribution.forEach((q, index) => {
  console.log(`${index + 1}. Difficulty: ${q.difficulty}, Question: ${q.question}, Marks: ${q.marks}`);
});


if (remEasy + remMed + remHard === 0) {
  console.log('\n');
  console.log('=============================');
  console.log('   Your paper is set. 🎉');
  console.log('=============================');
} else {
  console.log('\n');
  console.log('=============================');
  console.log('   Paper configuration error. ❌');
  console.log('   Please check your inputs.');
  console.log('=============================');
}






  


