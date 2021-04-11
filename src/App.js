import { useState } from "react";
import "./App.css";
import { Scrollama, Step } from 'react-scrollama'
import BubbleStep from "./steps/BubbleStep";
import IntroStep from './steps/IntroStep';

export const VIEW_ALL_OPTION = {
  label: "your favorite artist",
  value: "all",
  type: "all",
};

const App = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(null);

  const onStepEnter = ({ data }) => {
    setCurrentStepIndex(data);
  };

  return (
    <div className="App">
      <Scrollama onStepEnter={onStepEnter}>
        <Step data={0} key={0}>
          <div className='App-step App-step-text-center'>
            <IntroStep />
          </div>
        </Step>
        {[2, 3, 4].map((_, stepIndex) => (
          <Step data={stepIndex} key={stepIndex}>
            <div
              style={{
                margin: '50vh 0',
                color: 'white',
                opacity: currentStepIndex === stepIndex ? 1 : 0.2,
              }}
            >
              I'm a Scrollama Step of index {stepIndex}
            </div>
          </Step>
        ))}
        <Step data={5} key={5}>
          <div
            style={{
              margin: '50vh 0',
              border: '1px solid gray',
              opacity: currentStepIndex === 5 ? 1 : 0.2,
            }}
          >
            <BubbleStep />  
          </div>
        </Step>
      </Scrollama>
    </div>
  );
};

export default App;
