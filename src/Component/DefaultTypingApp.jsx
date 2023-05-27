import React, { useState, useEffect } from "react";
import Timer from "./Timer";
import "../App.css";

function generateWords() {
    const keys = ["a", "s", "d", "f", "j", "k", "l", ";"];
    const numWords = Math.floor(Math.random() * 2) + 2; // generate 2-3 words
    let words = "";
    for (let i = 0; i < numWords; i++) {
        const wordLength = Math.floor(Math.random() * 3) + 3; // generate 3-5 letters per word
        for (let j = 0; j < wordLength; j++) {
            const randomIndex = Math.floor(Math.random() * keys.length);
            words += keys[randomIndex];
        }
        words += " ";
    }
    return words.trim(); // Trim extra whitespace at the end
}

function DefaultTypingApp() {
    const [words, setWords] = useState(generateWords());
    const [startTime, setStartTime] = useState(null);
    const [typedText, setTypedText] = useState("");
    const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
    const [incorrectKeystrokes, setIncorrectKeystrokes] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [inputColors, setInputColors] = useState([]);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (isTyping && startTime === null) {
            setStartTime(Date.now());
        }
    }, [isTyping, startTime]);

    useEffect(() => {
        if (typedText === words) {
            setWords(generateWords());
            setTypedText("");
            setCorrectKeystrokes(0);
            setIncorrectKeystrokes(0);
            setStartTime(null);
            setIsTyping(false);
            setInputColors([]);
            updateHistory();
        }
    }, [typedText, words]);

    const handleInputChange = (event) => {
        const inputText = event.target.value;
        setTypedText(inputText);
        setIsTyping(inputText.length > 0);
        const newInputColors = [];

        if (inputText === words) {
            setWords(generateWords());
            setTypedText("");
            setStartTime(null);
            setCorrectKeystrokes(0);
            setIncorrectKeystrokes(0);
            setIsTyping(false);
            setInputColors([]);
            updateHistory();
        } else {
            for (let i = 0; i < inputText.length; i++) {
                const typedChar = inputText[i];
                if (i < words.length) {
                    if (typedChar === words[i]) {
                        newInputColors.push("");
                        setCorrectKeystrokes((prevCount) => prevCount + 1);
                    } else {
                        newInputColors.push("red");
                        setIncorrectKeystrokes((prevCount) => prevCount + 1);
                    }
                } else {
                    newInputColors.push("red");
                }
            }
        }

        setInputColors(newInputColors);
    };

    const accuracy =
        (correctKeystrokes / (correctKeystrokes + incorrectKeystrokes + 0.01)) *
        100;

    const wpm = Math.floor(
        typedText.length / 5 / ((Date.now() - startTime) / 1000 / 60)
    );

    const updateHistory = () => {
        const timestamp = new Date().toLocaleString();
        const elapsedTime = (Date.now() - startTime) / 1000; // in seconds
        const newHistory = [
            ...history,
            { wpm, accuracy, timestamp, elapsedTime },
        ];
        if (newHistory.length > 5) {
            newHistory.shift();
        }
        setHistory(newHistory);
    };



    return (
        <div className="app-container">
            <h1>Touch Typing App</h1>
            <p className="random">{words}</p>
            <input
                type="text"
                value={typedText}
                onChange={handleInputChange}
                placeholder="Start typing..."
                style={{
                    backgroundColor: inputColors.join(" "),
                }}
            />
            <Timer isTyping={isTyping} />
            <p>Accuracy: {accuracy.toFixed(2)}%</p>
            <p>WPM: {wpm}</p>
            <h2>History</h2>
            <table>
                <thead>
                    <tr>
                        <th>WPM</th>
                        <th>Accuracy</th>
                        <th> Timer</th>
                        {/* <th>Timestamp</th> */}
                    </tr>
                </thead>
                <tbody>
                    {history.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.wpm}</td>
                            <td>{entry.accuracy.toFixed(2)}%</td>
                            <td>{entry.elapsedTime.toFixed(1)}s</td>
                            {/* <td>{entry.timestamp}</td> */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DefaultTypingApp;
