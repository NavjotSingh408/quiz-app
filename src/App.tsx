import { useRef, useState } from 'react'
import './App.css'
import Buttons from './components/Buttons'
// import Qpanel from './components/Qpanel'

/*|| INTERFACES */
type QuesDataType = {
  question: string
  correct_answer: string
  all_answers: string[]
}
/*|| VARIABLES */
// const randomNumbers = getRandomNumbers();

function App() {
  const url = "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple";
  /*|| STATES */
  const [quesData, setQuesData] = useState<QuesDataType[]>([]);
  const [isStart, setIsStart] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);  
  const [randomNumbers,setRandomNumbers] = useState<number[]>(getRandomNumbers());
  const [marks,setMarks] = useState<number>(0);
  const [disable,setDisable] = useState<boolean>(false);
  const [corrCount,setCorrCount] = useState<number>(0);
  const [IncorrCount,setIncorrCount] = useState<number>(0);

  const endCount = useRef<number>(-1)

  
  
  /*|| FUNCTIONS */
  function shuffle(array:number[]){
    for (let i = array.length-1; i >0 ; i--){
      const j = Math.floor(Math.random()*(i+1));
        [array[i],array[j]] = [array[j],array[i]]
    }
    return array;
  }
  
  function getRandomNumbers() {
    const numbers = [0,1,2,3];
    console.log('they called me ');
    return shuffle(numbers)
  }

  function checkAnswer(val:string){
    if(!disable){
      if (val === quesData[count].correct_answer) {
        alert('Correct answer');     
        setMarks((prev)=>prev+5);
        setCorrCount((prev) => prev +1);
      }
      else{
        alert('Wrong answer');
        setIncorrCount((prev) => prev+1)
      }
      setDisable(true);
      endCount.current = count;
    }
  }

  async function fetchQuestions() { //funct start
   try {
    const result = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    })
    const data = result.json();
    data.then((dataItems) => {
      if (dataItems.response_code === 0) {
        alert('Ready To Start');
        const QuestionSet = dataItems.results.map((item: any) => ({
          question: item.question,
          correct_answer: item.correct_answer,
          all_answers: [...item.incorrect_answers,item.correct_answer],
        }));
        setQuesData(QuestionSet);
        setIsStart(true)
        console.log(QuestionSet);    
      } else {
        alert('An error occured in fetching Questions');
      }
    })
   } catch (error) {
    alert('AN ERROR OCCURED : '+error);
   }
  } //funct end
  const increaseCount: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (disable) { 
     if (count < 9) {
      setCount((prev) => prev + 1);
      setRandomNumbers(getRandomNumbers()); 
       if (endCount.current< count+1) {
        setDisable(false);     
       }
    }
   } else {
    alert('Choose One Option Please')
   }
  }
  const decreaseCount: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (count > 0) {
      setCount((prev) => prev - 1);
      setDisable(true)
    }
  }
  return (
    <>
      {isStart ? (
        <>
          <div className="show-marks position-show">
              Your Marks : {marks}
          </div>
          <div className="container">
            <div className="question-continer">
              <h1>Q.{count + 1} : {quesData[count].question}</h1>
            </div>
            <div className="flex">
            <div className="position-show">
              Correct Answers : {corrCount}
            </div>
            <div className="position-show">
              {count + 1}/10
            </div>
            <div className="position-show">
              Incorrect Answers : {IncorrCount}
            </div>
            </div>
            <div className="answers-container">
              <div className={disable ?"ans answer1":"answer answer1"}  onClick={()=>{
                checkAnswer(quesData[count].all_answers[randomNumbers[0]])}}>A. {quesData[count].all_answers[randomNumbers[0]]}</div>
              <div className={disable ?"ans answer2":"answer answer2"}  onClick={()=>{
                checkAnswer(quesData[count].all_answers[randomNumbers[1]])}}>B. {quesData[count].all_answers[randomNumbers[1]]}</div>
              <div className={disable ?"ans answer3":"answer answer3"}  onClick={()=>{
                checkAnswer(quesData[count].all_answers[randomNumbers[2]])}}>C. {quesData[count].all_answers[randomNumbers[2]]}</div>
              <div className={disable ?"ans answer4":"answer answer4"}  onClick={()=>{
                checkAnswer(quesData[count].all_answers[randomNumbers[3]])}}>D. {quesData[count].all_answers[randomNumbers[3]]}</div>
            </div>
          </div>
          <div className="buttons-container">
            <Buttons text='Previous' clickfn={decreaseCount} />
            <Buttons text='Next' clickfn={increaseCount} />
          </div>
        </>
      ) : (
        <div className="container container2">
          <button className="start-btn" onClick={() => { fetchQuestions() }}>
            Start Quiz
          </button>
        </div>
      )}
    </>
  )
}

export default App