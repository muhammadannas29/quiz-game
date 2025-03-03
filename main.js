document.addEventListener("DOMContentLoaded", function() {
   
    const menuBtn = document.getElementById("menu-btn");
    const menu = document.getElementById("menu");
    if (menuBtn && menu) {
      menuBtn.addEventListener("click", function() {
        menu.classList.toggle("hidden");
      });
    }
  
   
    const slider = document.getElementById("slider");
    if (slider) {
      let currentIndex = 0;
      const slides = document.querySelectorAll(".slide");
  
     
      const sliderNextBtn = document.getElementById("slider-next");
      const sliderPrevBtn = document.getElementById("slider-prev");
  
      function updateSlider() {
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
      }
      function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
      }
      function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlider();
      }
  
      if (sliderNextBtn) {
        sliderNextBtn.addEventListener("click", nextSlide);
      }
      if (sliderPrevBtn) {
        sliderPrevBtn.addEventListener("click", prevSlide);
      }
     
      setInterval(nextSlide, 3000);
    }
  
  
    if (document.getElementById("courseDropdown")) {
      
      const quizData = {
        math: [
          { question: "What is 5 + 3?", options: ["6", "7", "8", "9"], correct: "8", answer: null, locked: false },
          { question: "What is 10 - 4?", options: ["6", "7", "8", "9"], correct: "6", answer: null, locked: false },
          { question: "Solve: 3 × 3", options: ["6", "7", "8", "9"], correct: "9", answer: null, locked: false },
          { question: "What is 12 ÷ 4?", options: ["2", "3", "4", "5"], correct: "3", answer: null, locked: false },
          { question: "Square root of 49?", options: ["5", "6", "7", "8"], correct: "7", answer: null, locked: false }
        ],
        science: [
          { question: "What is H2O?", options: ["Oxygen", "Water", "Hydrogen", "Nitrogen"], correct: "Water", answer: null, locked: false },
          { question: "Which planet is closest to the sun?", options: ["Mars", "Venus", "Mercury", "Jupiter"], correct: "Mercury", answer: null, locked: false },
          { question: "Which gas do plants absorb?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], correct: "Carbon Dioxide", answer: null, locked: false },
          { question: "What organ pumps blood?", options: ["Brain", "Liver", "Heart", "Lungs"], correct: "Heart", answer: null, locked: false },
          { question: "What is the chemical symbol for gold?", options: ["Ag", "Au", "Fe", "Pb"], correct: "Au", answer: null, locked: false }
        ],
        history: [
          { question: "Who discovered America?", options: ["Columbus", "Magellan", "Vasco da Gama", "Napoleon"], correct: "Columbus", answer: null, locked: false },
          { question: "Who was the first US President?", options: ["Lincoln", "Washington", "Jefferson", "Roosevelt"], correct: "Washington", answer: null, locked: false },
          { question: "Which war ended in 1945?", options: ["WW1", "WW2", "Cold War", "Vietnam War"], correct: "WW2", answer: null, locked: false },
          { question: "Who built the pyramids?", options: ["Romans", "Greeks", "Egyptians", "Mayans"], correct: "Egyptians", answer: null, locked: false },
          { question: "What year did the French Revolution start?", options: ["1776", "1789", "1804", "1812"], correct: "1789", answer: null, locked: false }
        ]
      };
  
      let selectedCourse = "";
      let questions = [];
      let currentQuestionIndex = 0;
      const timeLimit = 20; 
      let timeLeft = timeLimit;
      let timerInterval;
  
      
      const courseDropdown = document.getElementById("courseDropdown");
      const startQuizBtn = document.getElementById("startQuizBtn");
      const courseSelection = document.getElementById("courseSelection");
      const quizSection = document.getElementById("quizSection");
      const questionContainer = document.getElementById("questionContainer");
      const progressText = document.getElementById("progressText");
      const progressBar = document.getElementById("progressBar");
      const timerDisplay = document.getElementById("timer");
      const prevBtn = document.getElementById("prevBtn");
      const nextBtn = document.getElementById("nextBtn");
      const submitBtn = document.getElementById("submitBtn");
      const resultSection = document.getElementById("resultSection");
      const resultContent = document.getElementById("resultContent");
  
      courseDropdown.addEventListener("change", () => {
        selectedCourse = courseDropdown.value;
        if (selectedCourse) {
          startQuizBtn.classList.remove("hidden");
        } else {
          startQuizBtn.classList.add("hidden");
        }
      });
  
      startQuizBtn.addEventListener("click", () => {
        if (!selectedCourse) return;
       
        questions = JSON.parse(JSON.stringify(quizData[selectedCourse]));
        courseSelection.classList.add("hidden");
        quizSection.classList.remove("hidden");
        currentQuestionIndex = 0;
        displayQuestion();
        updateProgress();
        startTimer();
      });
  
    
      function displayQuestion() {
        clearInterval(timerInterval);
        timeLeft = timeLimit;
        updateTimerDisplay();
        updateProgress();
  
        const currentQuestion = questions[currentQuestionIndex];
        let html = `<h2 class="text-2xl font-bold mb-4">${currentQuestion.question}</h2>`;
        html += '<div class="space-y-4">';
        currentQuestion.options.forEach(option => {
          const disabled = currentQuestion.locked ? "disabled" : "";
          const checked = currentQuestion.answer === option ? "checked" : "";
          html += `
            <label class="block">
              <input type="radio" name="option" value="${option}" ${disabled} ${checked} class="mr-2" onchange="selectOption('${option}')">
              ${option}
            </label>`;
        });
        html += '</div>';
        questionContainer.innerHTML = html;
        startTimer();
  
       
        prevBtn.disabled = currentQuestionIndex === 0;
        nextBtn.disabled = currentQuestionIndex === questions.length - 1;
      }
  
     
      window.selectOption = function(option) {
        questions[currentQuestionIndex].answer = option;
        checkSubmitReady();
      };
  
      function updateProgress() {
        progressText.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
        const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressBar.style.width = progressPercent + "%";
      }
  
      function updateTimerDisplay() {
        timerDisplay.textContent = `Time Left: ${timeLeft}s`;
      }
  
      function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
          timeLeft--;
          updateTimerDisplay();
          if (timeLeft <= 0) {
            clearInterval(timerInterval);
           
            questions[currentQuestionIndex].locked = true;
            document.querySelectorAll('input[name="option"]').forEach(input => {
              input.disabled = true;
            });
            checkSubmitReady();
          }
        }, 1000);
      }
  
      prevBtn.addEventListener("click", () => {
        if (currentQuestionIndex > 0) {
          currentQuestionIndex--;
          displayQuestion();
        }
      });
  
      nextBtn.addEventListener("click", () => {
        if (currentQuestionIndex < questions.length - 1) {
          currentQuestionIndex++;
          displayQuestion();
        }
      });
  
      function checkSubmitReady() {
        const ready = questions.every(q => q.answer !== null || q.locked);
        submitBtn.disabled = !ready;
      }
  
      submitBtn.addEventListener("click", submitQuiz);
  
      function submitQuiz() {
        clearInterval(timerInterval);
        quizSection.classList.add("hidden");
        resultSection.classList.remove("hidden");
  
        let score = 0;
        let summaryHtml = '<ul class="space-y-4">';
        questions.forEach((q, index) => {
          const userAnswer = q.answer ? q.answer : "No answer";
          const isCorrect = userAnswer === q.correct;
          if (isCorrect) score++;
          summaryHtml += `<li>
            <strong>Q${index + 1}:</strong> ${q.question}<br>
            <strong>Your Answer:</strong> ${userAnswer} ${q.locked && !q.answer ? "(Locked)" : ""}<br>
            <strong>Correct Answer:</strong> ${q.correct}
          </li>`;
        });
        summaryHtml += '</ul>';
        summaryHtml += `<div class="mt-4 text-xl font-bold">Your Score: ${score} / ${questions.length}</div>`;
        resultContent.innerHTML = summaryHtml;
      }
    } 
  });
  