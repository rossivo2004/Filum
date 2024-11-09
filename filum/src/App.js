import React, { useEffect, useState } from 'react';
import assessmentData from './json/assessment.json';

function App() {
  const [data, setData] = useState(null);
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [showGuidance, setShowGuidance] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(data?.questions.length).fill(null)); // Store selected answers
  const [resultLink, setResultLink] = useState(''); // New state for result link
  const [answers, setAnswers] = useState([]); // New state to store answers
  const [result, setResult] = useState(null); // New state to store the result
  const [showShareOptions, setShowShareOptions] = useState(false); // New state for share options visibility
  const [showEmailModal, setShowEmailModal] = useState(false); // State for email modal visibility
  const [shareEmail, setShareEmail] = useState(''); // State for email input
  const [showShareResultModal, setShowShareResultModal] = useState(false); // New state for share result modal
  const [showEmailShareModal, setShowEmailShareModal] = useState(false); // New state for email share modal

  useEffect(() => {
    setData(assessmentData);
  }, []);

// ... existing code ...
const handleEmailSubmit = () => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for email validation
  if (emailPattern.test(email)) { // Check if email matches the pattern
    setIsEmailSubmitted(true);
    setShowGuidance(true);
  } else {
    alert("Vui lòng nhập địa chỉ email hợp lệ."); // Alert for invalid email
  }
};
// ... existing code ...

  const handleNextQuestion = () => {
    // Check if an answer has been selected for the current question
    if (selectedAnswers[question] === null) {
        alert("Vui lòng chọn một câu trả lời."); // Alert if no answer is selected
        return; // Exit the function if no answer is selected
    }

    console.log("handleNextQuestion called"); // Log khi hàm đợc gọi
    console.log("Current Question Index:", question); // Log chỉ số câu hỏi hiện tại
    console.log("Total Questions:", data?.questions.length); // Log tổng số câu hỏi

    if (data && question < data.questions.length - 1) {
      setAnswers(prev => {
        const newAnswers = [...prev];
        newAnswers[question] = selectedAnswers[question] !== null ? selectedAnswers[question] : 0; // Ensure it's a number
        return newAnswers;
      });

      // Ensure selectedAnswers is updated before calculating total score
      const selectedOption = data.questions[question].options.find(option => option.selected);
      setSelectedAnswers(prev => {
        const newAnswers = [...prev];
        newAnswers[question] = selectedOption ? selectedOption.score : 0; // Ensure score is a number
        return newAnswers;
      });

      setQuestion(question + 1);
    } else {
      // Calculate total score after all questions are answered
      const totalScore = selectedAnswers.reduce((total, score) => total + (Number(score) || 0), 0); // Use selectedAnswers instead of answers
      console.log("Total Score:", totalScore);
      setScore(totalScore);
      handleSubmit(totalScore);
    }
  };

  const handleSubmit = (finalScore) => {
    const level = getMaturityLevel(finalScore);
    setResult(assessmentData.results.find(r => r.level === level)); // Find the result based on the level
    setResultLink(`https://yourapp.com/results?level=${level}`);
  };

  

  const getMaturityLevel = (score) => {
    // Logic to determine maturity level based on score
    if (score <= 2) return 1;
    if (score <= 4) return 2;
    if (score <= 6) return 3;
    if (score <= 8) return 4;
    return 5;
  };

  const handleShareClick = () => {
    setShowShareResultModal(true); // Show the share result modal
  };

  const handleShareClickFB = () => {
    const level = getMaturityLevel(score); // Get the maturity level based on the current score
    const imageUrl = result.icon; // Use the result icon as the image for sharing

    // New logic to select the image based on the score
    let scoreImageUrl;
    switch (level) {
        case 1:
            scoreImageUrl = 'https://res.cloudinary.com/dmjzp0q0a/image/upload/v1731133276/t6b7jabbqv2tyvhkn3no.png'; // Level 1 image
            break;
        case 2:
            scoreImageUrl = 'https://res.cloudinary.com/dmjzp0q0a/image/upload/v1731133276/nk6l6uhocs1jkjxgdwss.png'; // Level 2 image
            break;
        case 3:
            scoreImageUrl = 'https://res.cloudinary.com/dmjzp0q0a/image/upload/v1731133276/t2wkifil4rmrdclhg7mm.png'; // Level 3 image
            break;
        case 4:
            scoreImageUrl = 'https://res.cloudinary.com/dmjzp0q0a/image/upload/v1731133276/egjak1tqbz2novbuxome.png'; // Level 4 image
            break;
        case 5:
            scoreImageUrl = 'https://res.cloudinary.com/dmjzp0q0a/image/upload/v1731133276/mw38rharnm1tfh9nowgg.png'; // Level 5 image
            break;
        default:
            scoreImageUrl = ''; // Fallback image if needed
    }

    const shareUrl = scoreImageUrl; // Construct the share URL

    // Use the Facebook sharing dialog
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&picture=${encodeURIComponent(scoreImageUrl)}`;
    window.open(facebookShareUrl, '_blank'); // Open the share dialog in a new tab
  };



  const handleEmailShareClick = () => {
    setShowEmailShareModal(true); // Show the email share modal
    setShowShareResultModal(false); // Hide the share result modal
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[#051e40] text-white">
      <div className="w-[400px] h-[400px] rounded-lg flex flex-col justify-center items-center gap-4">
        {data ? (
          <>
            {console.log("Data loaded:", data)}

            {!isEmailSubmitted ? (
              <>
                <h3 className='w-[300px] flex justify-center items-center text-center'>{data.title}</h3>
                <h1 className='text-[40px] text-center leading-[50px]'>Công ty bạn trưởng thành như thế nào trong việc lắng nghe khách hàng?</h1>
                <p className='text-center'>Đánh giá khả năng của bạn trong việc lắng nghe, hiểu và đáp ứng các tín hiệu từ khách hàng.</p>

                <input
                  type="email"
                  placeholder="Địa chỉ email của bạn"
                  className='w-full outline-none text-black rounded-md px-2 py-4'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onInvalid={(e) => e.preventDefault()}
                />
                <button
                  className='w-full py-4 rounded-lg bg-blue-600 flex gap-2 items-center justify-center font-bold'
                  onClick={handleEmailSubmit}
                >
                  <div>Bắt đầu</div>
                  <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M20.337 3.664c.213.212.354.486.404.782.294 1.711.657 5.195-.906 6.76-1.77 1.768-8.485 5.517-10.611 6.683a.987.987 0 0 1-1.176-.173l-.882-.88-.877-.884a.988.988 0 0 1-.173-1.177c1.165-2.126 4.913-8.841 6.682-10.611 1.562-1.563 5.046-1.198 6.757-.904.296.05.57.191.782.404ZM5.407 7.576l4-.341-2.69 4.48-2.857-.334a.996.996 0 0 1-.565-1.694l2.112-2.111Zm11.357 7.02-.34 4-2.111 2.113a.996.996 0 0 1-1.69-.565l-.422-2.807 4.563-2.74Zm.84-6.21a1.99 1.99 0 1 1-3.98 0 1.99 1.99 0 0 1 3.98 0Z" clipRule="evenodd" />
                  </svg>
                </button>
              </>
            ) : showGuidance ? (
              <div className='w-full h-full flex flex-col justify-center items-center gap-4 bg-[#fdfdfd4d] rounded-lg p-4'>
                <div className='flex items-center gap-2'>
                  <div className='bg-blue-500 w-2 h-2 rounded-full'></div>
                  <h2>Hướng dẫn trả lời câu hỏi</h2>
                </div>
                <p className='text-start text-[20px] font-bold '>Vui lòng dựa vào hướng dẫn sau đây để trả lời các câu hỏi:</p>
                <div className='pl-4'>
                  <ul className="list-disc pl-5 pr-9">
                    <li>Chọn "Có" nếu câu trả lời phản ánh hiện trạng đang có và được thực hiện một cách nhất quán (ít nhất 80% thời gian).</li>
                    <li>Chọn "Không có" nếu hoàn toàn chưa từng thực hiện.</li>
                    <li>Chọn "Không có" nếu vẫn đề này chưa chắc chắn đã thực hiện hay chưa.</li>
                  </ul>
                </div>

                <button
                  className='w-full py-4 rounded-lg bg-blue-600 flex gap-2 items-center justify-center font-bold'
                  onClick={() => setShowGuidance(false)}
                >
                  Bắt đầu
                </button>
              </div>
            ) : result ? (
              <div className='w-full h-auto flex flex-col justify-center items-center gap-4 bg-[#fdfdfd4d] rounded-lg p-4'>
                <h2 className='text-[20px] font-bold text-center'>{result.name}</h2>
                <p className='text-center'>{result.description.text}</p>
                <img src={result.icon} alt={`Level ${result.level} icon`} className='w-16 h-16' />
                
                <button
                  className='w-full py-4 rounded-lg bg-green-600 flex gap-2 items-center justify-center font-bold'
                  onClick={handleShareClick} // Show share options
                >
                  Chia sẻ
                </button>

                {showShareResultModal && ( // Conditional rendering of share result modal
                  <div className='absolute bg-white h-[540px] w-[400px] text-black p-4 rounded-lg'>
                    <h3 className='font-bold text-center text-lg mb-4'>Chia sẻ kết quả</h3>
                    <p className='mb-4'>Đây là một số cách bạn có thể chia sẻ với bạn bè và đồng nghiệp của mình:</p>
                    <div className='flex flex-col gap-4'>
                    <button className='w-full py-2 rounded-lg bg-blue-200 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white' onClick={handleShareClickFB}>
                    Chia sẻ qua Facebook
                  </button>
                      <button className='w-full py-2 rounded-lg bg-blue-200 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white' onClick={handleEmailShareClick}>
                        Chia sẻ qua Email
                      </button>
                      <button className='w-full py-2 rounded-lg bg-blue-200 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white' onClick={() => alert('Sao chép đường dẫn')}>
                        Sao chép đường dẫn đến trang kết quả
                      </button>
                      <button className='w-full py-2 rounded-lg font-semibold hover:bg-blue-600 hover:text-white text-blue-500' onClick={() => setShowShareResultModal(false)}>
                        Hủy
                      </button>
                    </div>
                  </div>
                )}
                {showEmailShareModal && ( // Conditional rendering of email share modal
                  <div className='absolute bg-white h-[540px] w-[400px] text-black p-4 rounded-lg'>
                    <h3 className='font-bold text-center text-lg mb-4'>Chia sẻ qua Email</h3>
                    <p className='mb-4'>Vui lòng cung cấp địa chỉ email mà bạn muốn chia sẻ kết quả:</p>
                    <input
                      type="email"
                      placeholder="Nhập địa chỉ email"
                      className='w-full outline-none text-black rounded-md px-2 py-2 mb-4 border border-gray-300'
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                    />
                <div className='flex gap-4 w-full justify-between'>
              
              <button
                className='w-full py-2 rounded-lg font-semibold hover:bg-blue-600 hover:text-white text-blue-500'
                onClick={() => {
                  setShowEmailShareModal(false); // Close the email modal
                  setShowShareResultModal(true); // Show the share result modal again
                }}
              >
                Quay lại
              </button>
              <button
              className='w-full py-2 rounded-lg bg-blue-600 text-white'
              onClick={() => {
                alert(`Chia sẻ kết quả qua email đến: ${shareEmail}`);
                setShowEmailShareModal(false); // Close the modal after sharing
              }}
            >
              Gửi Email
            </button>
                </div>
                  </div>
                )}
              </div>
            ) : (
              <div className='w-full h-auto flex flex-col justify-center items-center gap-4 bg-[#fdfdfd4d] rounded-lg p-4'>
                {console.log("Current Question Index:", question)}
                <div className='flex items-center gap-2'>
                <div className='bg-blue-500 w-2 h-2 rounded-full'></div>
                <h2>Câu hỏi {question + 1}/10</h2>
              </div>
                <h2 className='text-[20px] font-bold text-center'>{data.questions[question].title}</h2>
                <div className='flex flex-col gap-4 w-full'>
                  {data.questions[question].options.map((option) => (
                    <label key={option.id} className={`w-full py-4 rounded-lg border border-white flex gap-2 items-center justify-center font-bold ${selectedAnswers[question] === option.score ? 'bg-blue-500 text-white' : 'bg-transparent hover:border-blue-500 hover:text-blue-500'}`}>
                      <input 
                      required
                        type="radio" 
                        name={`question-${question}`} 
                        value={option.score} 
                        checked={selectedAnswers[question] === option.score} // Check if this option is selected
                        onChange={() => {
                          setSelectedAnswers(prev => {
                            const newAnswers = [...prev];
                            newAnswers[question] = option.score; // Update selected answer
                            return newAnswers;
                          });
                          console.log("Selected answer for question:", question, "is", option.score);
                          if (question < data.questions.length - 1) {
                            setQuestion(question + 1); // Move to the next question
                          }
                        }} 
                        className="hidden" // Hide the default radio button
                      />
                      {option.text}
                    </label>
                  ))}
                </div>
                <div className='flex gap-4 w-full justify-between'>
                  {question > 0 && (
                    <button
                      className='w-full py-4 rounded-lg bg-white text-blue-600 border border-white flex gap-2 items-center justify-center font-bold'
                      onClick={() => setQuestion(question - 1)}
                    >
                      Quay lại
                    </button>
                  )}
                  {question === data.questions.length - 1 ? (
                    <button
                      className='w-full py-4 rounded-lg bg-blue-600 flex gap-2 items-center justify-center font-bold'
                      onClick={handleNextQuestion} // Call handleSubmit instead of handleNextQuestion
                    >
                      Gửi
                    </button>
                  ) : (
                    <button
                      className='w-full py-4 rounded-lg bg-blue-600 flex gap-2 items-center justify-center font-bold'
                      onClick={handleNextQuestion}
                    >
                      Tiếp theo
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default App;
