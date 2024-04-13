import React, { useState, useEffect } from 'react';

const TypingTest = () => {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [wpm, setWpm] = useState(0);

  const generateRandomWords = () => {
    const wordsArray = ["apple", "banana", "orange", "grape", "peach"];
    return wordsArray.join(' ');
  };

  useEffect(() => {
    setText(generateRandomWords());
  }, []);

  const handleInputChange = (e) => {
    const typedText = e.target.value;
    setUserInput(typedText);
    if (!startTime) {
      setStartTime(Date.now());
    }

    const typedWordsCount = typedText.trim().split(/\s+/).length;
    setWordsTyped(typedWordsCount);

    const correctWords = text.trim().split(/\s+/);
    const typedWords = typedText.trim().split(/\s+/);
    let errors = 0;
    for (let i = 0; i < Math.min(correctWords.length, typedWords.length); i++) {
      if (typedWords[i] !== correctWords[i]) {
        errors++;
      }
    }
    const accuracyPercentage = ((typedWordsCount - errors) / typedWordsCount) * 100;
    setAccuracy(accuracyPercentage);

    const elapsedTimeInMinutes = (Date.now() - startTime) / (1000 * 60);
    const wpm = Math.round((typedWordsCount / elapsedTimeInMinutes) * 60);
    setWpm(wpm);
  };

  return (
    <div>
      <div>
        <p>{text}</p>
      </div>
      <textarea
        value={userInput}
        onChange={handleInputChange}
        placeholder="Start typing here..."
      />
      <div>
        <p>Words per minute: {wpm}</p>
        <p>Accuracy: {accuracy.toFixed(2)}%</p>
      </div>
    </div>
  );
};

export default TypingTest;
