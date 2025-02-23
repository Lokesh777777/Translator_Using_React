import React, { useState } from 'react';
import './Translator.css';
import languageList from './language.json';

export default function Translator() {
    const [inputFormat, setInputFormat] = useState('en');
    const [outputFormat, setOutputFormat] = useState('hi');
    const [translatedText, setTranslatedText] = useState('Translation');
    const [inputText, setInputText] = useState('');

    // Function to reverse input and output languages
    const handleReverseLanguage = () => {
        const value = inputFormat;
        setInputFormat(outputFormat);
        setOutputFormat(value);
        setInputText('');
        setTranslatedText('Translation');
    };

    // Function to clear input text
    const handleRemoveInputText = () => {
        setInputText('');
        setTranslatedText('Translation');
    };

    // Function to handle translation
    const handleTranslate = async () => {
        if (!inputText || !inputFormat || !outputFormat) return;

        // Show spinner and hide translate text
        document.querySelector('.fa.fa-spinner.fa-spin').style.display = 'block';
        document.querySelector('.translate').style.display = 'none';

        try {
            // MyMemory Translation API (free tier)
            const response = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
                    inputText
                )}&langpair=${inputFormat}|${outputFormat}`
            );
            const data = await response.json();

            // Check if translation was successful
            if (data.responseStatus === 200) {
                setTranslatedText(data.responseData.translatedText);
            } else {
                throw new Error(data.responseDetails || 'Translation failed');
            }
        } catch (error) {
            console.error(error);
            alert('Error: ' + (error.message || 'Please try again later'));
        }

        // Hide spinner and show translate text
        document.querySelector('.fa.fa-spinner.fa-spin').style.display = 'none';
        document.querySelector('.translate').style.display = 'block';
    };

    return (
        <div className="container">
            {/* Language Selection Row */}
            <div className="row1">
                <select
                    value={inputFormat}
                    onChange={(e) => setInputFormat(e.target.value)}
                >
                    {Object.keys(languageList).map((key, index) => {
                        const language = languageList[key];
                        return (
                            <option key={index} value={key}>
                                {language.name}
                            </option>
                        );
                    })}
                </select>

                {/* Reverse Language Button */}
                <svg
                    className="reversesvg"
                    onClick={handleReverseLanguage}
                    focusable="false"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                >
                    <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"></path>
                </svg>

                <select
                    value={outputFormat}
                    onChange={(e) => {
                        setOutputFormat(e.target.value);
                        setTranslatedText('Translation');
                    }}
                >
                    {Object.keys(languageList).map((key, index) => {
                        const language = languageList[key];
                        return (
                            <option key={index + 118} value={key}>
                                {language.name}
                            </option>
                        );
                    })}
                </select>
            </div>

            {/* Input and Output Text Row */}
            <div className="row2">
                <div className="inputText">
                    {/* Clear Input Button */}
                    <svg
                        className="removeinput"
                        style={{ display: inputText.length ? 'block' : 'none' }}
                        onClick={handleRemoveInputText}
                        focusable="false"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                    </svg>

                    {/* Input Text Area */}
                    <textarea
                        type="text"
                        value={inputText}
                        placeholder="Enter Text"
                        onChange={(e) => setInputText(e.target.value)}
                    />
                </div>

                {/* Output Text Area */}
                <div className="outputText">{translatedText}</div>
            </div>

            {/* Translate Button Row */}
            <div className="row3">
                <button className="btn" onClick={handleTranslate}>
                    <i className="fa fa-spinner fa-spin"></i>
                    <span className="translate">Translate</span>
                </button>
            </div>
        </div>
    );
}