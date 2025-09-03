import React, { useState, useEffect } from "react";
import TestList from "./TestList";
import TestRunner from "./TestRunner";
import TestResult from "./TestResult";
import { Home } from "lucide-react";
import HomeHeader from "../../HomePage/HomeHeader";
const AppQuestion = () => {
  const [stage, setStage] = useState("list"); // list | runner | result
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [testKey, setTestKey] = useState("");
  const [testData, setTestData] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const handleStartTest = (id, testKey) => {
    setSelectedTestId(id);
    setTestKey(testKey);
    setStage("runner");
  };

  const handleComplete = (userAnswers) => {
    setAnswers(userAnswers);
    setStage("result");
  };

  const handleBack = () => {
    setStage("list");
  };

  return (
    <>
      <HomeHeader />
      {stage === "list" && <TestList onStartTest={handleStartTest} />}
      {stage === "runner" && (
        <TestRunner
          testId={selectedTestId}
          onComplete={handleComplete}
          onBack={handleBack}
          testData={testData}
          setTestData={setTestData}
        />
      )}
      {stage === "result" && (
        <TestResult
          testId={selectedTestId}
          answers={answers}
          onRestart={() => setStage("runner")}
          onBackToHome={() => setStage("list")}
          result={result}
          setResult={setResult}
          testKey={testKey}
        />
      )}
    </>
  );
};
export default AppQuestion;
