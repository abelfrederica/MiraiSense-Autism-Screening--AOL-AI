const totalPages = 14;
let currentPage = 1;
let answers = new Array(totalPages).fill(null);

function showPage(page){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  if (page === 'info'){
    document.getElementById('pageInfo').classList.add('active');
    return;
  }

  if (typeof page === 'number' && page >= 1 && page <= totalPages){
    document.getElementById(`page${page}`).classList.add('active');
  }

  if (page === totalPages + 1){
    document.getElementById('result').classList.add('active');
  }

  currentPage = page;
  updateNextButton(page);
}

function updateNextButton(page){
  if (typeof page !== 'number') return;

  if (page === 1){
    document.getElementById('next1').disabled = false;
  } else if (page <= totalPages){
    const nextBtn = document.getElementById(`next${page}`);
    nextBtn.disabled = answers[page - 1] === null;
  }
}

function nextClicked(){
  if (currentPage > 1 && answers[currentPage - 1] === null){
    alert('Please select an answer before proceeding.');
    return;
  }

  if (currentPage === totalPages){
    sendAnswers();
  } else {
    showPage(currentPage + 1);
  }
}

function prevClicked(){
  if (currentPage === 1) return;
  if (currentPage === totalPages + 1){
    showPage(totalPages);
  } else{
    showPage(currentPage - 1);
  }
}

function finishClicked(){
  answers = new Array(totalPages).fill(null);
  for (let i = 2; i <= totalPages; i++){
    const container = document.getElementById(`answers${i}`);
    container.querySelectorAll('button.answer-btn').forEach(btn => btn.classList.remove('selected'));
  }
  showPage(1);
}

function answerClicked(ev){
  if (!ev.target.classList.contains('answer-btn')) return;

  const container = ev.target.parentElement;
  const pageNum = parseInt(container.id.replace('answers', ''));
  container.querySelectorAll('button.answer-btn').forEach(btn => btn.classList.remove('selected'));
  ev.target.classList.add('selected');
  answers[pageNum - 1] = ev.target.dataset.value;
  updateNextButton(pageNum);
}

function sendAnswers(){
  const scoreMap ={
    "definitely disagree": 0,
    "slightly disagree": 0,
    "slightly agree": 1,
    "definitely agree": 1
  };

  const payload ={
    A1_Score: scoreMap[answers[1]],
    A2_Score: scoreMap[answers[2]],
    A3_Score: scoreMap[answers[3]],
    A4_Score: scoreMap[answers[4]],
    A5_Score: scoreMap[answers[5]],
    A6_Score: scoreMap[answers[6]],
    A7_Score: scoreMap[answers[7]],
    A8_Score: scoreMap[answers[8]],
    A9_Score: scoreMap[answers[9]],
    A10_Score: scoreMap[answers[10]],
    gender: answers[11] === 'Male' ? 'M' : 'F',
    jaundice: answers[12].toLowerCase(),
    used_app_before: answers[13].toLowerCase()
  };

  fetch('http://localhost:5000/predict',{
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      const isLikely = data.prediction === 1;
      const resultText = isLikely
        ? `<strong>LIKELY</strong> to have autism.`
        : `<strong>NOT LIKELY</strong> to have autism.`;
      document.querySelector("#result h2").innerHTML = `You're ${resultText}`;

      const resultNote = document.getElementById("resultNote");
      
      resultNote.innerHTML = isLikely
        ? `Please note that this test is not 100% accurate. For further support and assistance, we encourage you to consult a licensed psychologist or healthcare professional. <br>♥Remember, you are not alone and you are deeply valued and loved! ♥`
        : `However, please remember that this test is not 100% accurate. If you experience symptoms or have concerns, we strongly encourage you to consult a licensed psychologist or healthcare professional. <br>♥Let’s continue raising awareness about autism!♥`;

      resultNote.style.display = "block";
      showPage(totalPages + 1);
    })
    .catch(err =>{
      alert("Error connecting to prediction server.");
      console.error(err);
    });
}

document.addEventListener('DOMContentLoaded', () =>{
  document.getElementById('next1').addEventListener('click', nextClicked);
  document.getElementById('finish').addEventListener('click', finishClicked);

  for (let i = 2; i <= totalPages; i++){
    document.getElementById(`prev${i}`).addEventListener('click', prevClicked);
    document.getElementById(`next${i}`).addEventListener('click', nextClicked);
    document.getElementById(`answers${i}`).addEventListener('click', answerClicked);
  }

  document.getElementById('infoBtn').addEventListener('click', () =>{
    showPage('info');
  });

  document.getElementById('backToStart').addEventListener('click', () =>{
    showPage(1);
  });
});


