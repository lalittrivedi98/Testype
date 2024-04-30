import React, { useState, useEffect, useRef, useMemo } from 'react';
import './App.css';
import quotes from './quotes.json';
import logo from './favicon.ico';


const randomQuote = () => {
  const randomIndex = Math.floor(Math.random() * quotes.quotes.length);
  return quotes.quotes[randomIndex];
};

const TyperacerGame = () => {
  const [quote, setQuote] = useState(randomQuote());
  const [text, setText] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const quotesSplit = useMemo(() => quote?.quote.split(/\s+/) ?? [], [quote]);
  const [wordIdx, setWordIdx] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [timer, setTimer] = useState(60);
  const [isTimerExpired, setIsTimerExpired] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [highlightedQuote, setHighlightedQuote] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [initialQuoteLength, setInitialQuoteLength] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setHighlightedQuote(quote.quote);
  }, [quote]);

  useEffect(() => {
    if (isGameStarted && countdown > 0) {
      const countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [isGameStarted, countdown]);

  useEffect(() => {
    if (isGameStarted && countdown === 0) {
      setStartTime(Date.now());
      const timerInterval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            clearInterval(timerInterval);
            setIsTimerExpired(true);
            setShowResults(true);
            return prevTimer;
          }
        });
        inputRef.current?.focus(); // Focus on input field if inputRef is not null
      }, 1000);
    }
  }, [isGameStarted, countdown]);

  useEffect(() => {
    if (!isTimerExpired && wordIdx === quotesSplit.length) {
      setIsTimerExpired(true);
      setShowResults(true);
    }
  }, [wordIdx, quotesSplit, isTimerExpired]);



  useEffect(() => {
    setCurrentWord(quotesSplit[wordIdx]);
  }, [wordIdx, quotesSplit]);

  useEffect(() => {
    if (wordIdx === quotesSplit.length) {
      setQuote(randomQuote());
      setWordIdx(0);
      setText('');
    }
  }, [wordIdx, quotesSplit]);

  const handleStartGame = () => {
    setIsGameStarted(true);
    setCountdown(3);
    setTimer(60);
    setText('');
    setShowResults(false);
    setWpm(0);
    setInitialQuoteLength(quote.quote.length); // Set initial quote length
    inputRef.current?.focus(); // Focus on input field if inputRef is not null
  };
  

  const handleInputChange = (e) => {
    if (!isTimerExpired) {
      const typedText = e.target.value;
      const typedWords = typedText.trim().split(/\s+/);
      const currentTypedWord = typedWords[typedWords.length - 1];
      const currentQuoteWord = quotesSplit[wordIdx];
  
      // Update state variable for total keystrokes
      setTotalKeystrokes((prev) => prev + 1);
      
      // Calculate words typed and update state
      if (typedText.endsWith(' ') && currentTypedWord === currentQuoteWord) {
        setWordsTyped((prev) => prev + 1);
        setWordIdx((prev) => prev + 1);
        setText(''); // Reset text after typing a complete word
      } else {
        setText(typedText); // Update text input
      }
    }
  };

  //WPM calculation
  useEffect(() => {
    if (!isTimerExpired) {
      const elapsedTimeInSeconds = (Date.now() - startTime) / 1000;
      const wpm = Math.round((wordsTyped / elapsedTimeInSeconds) * 60);
      setWpm(wpm);
    }
  }, [wordsTyped, startTime, isTimerExpired]);

  //Acc calculation
  console.log("correct keystrokes:", initialQuoteLength);
  console.log("Total keystrokes:", totalKeystrokes);
  const accuracyPercentage = (initialQuoteLength / totalKeystrokes) * 100;

  //AWPM calculation is just <p>Adjusted WPM: {Math.floor(wpm * (accuracyPercentage / 100))}</p>

  return (
    <div className="center">
      <div className="header-container">
        <h1 className="testype-header">Testype</h1>
        <img src={logo} alt="Testype Logo" className="testype-logo" />
      </div>
      {!isGameStarted && !showResults && (
        <button className="start-button" onClick={handleStartGame}>
          Start
        </button>
      )}
      {isGameStarted && countdown > 0 && <div className="countdown">{countdown}</div>}
      {!isTimerExpired && !showResults && isGameStarted && countdown === 0 && (
        <div className="typing-test-container">
          <div className="timer">Time Left: {timer} seconds</div>
          <br></br>
          <div className="typing-test-text" dangerouslySetInnerHTML={{ __html: highlightedQuote }} />
          <textarea
            className={`typing-test-textarea ${isInputFocused ? 'current-input' : ''}`}
            value={text}
            onChange={handleInputChange}
            placeholder={currentWord} // Set placeholder to currentWord
            disabled={showResults}
            ref={inputRef}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            autoFocus
          />
          <div className="typing-test-stats">Words per minute (WPM): {wpm}</div>
        </div>
      )}
      {(showResults || isTimerExpired) && (
        <div className="results-container">
          <p>Quote source: {quote.author}</p>
          <p>WPM: {wpm}</p>
          <p>Accuracy: {accuracyPercentage.toFixed(2)}%</p>
          <p>Adjusted WPM: {Math.floor(wpm * (accuracyPercentage / 100))}</p>
        </div>
      )}
    </div>
  );
};

export default TyperacerGame;
