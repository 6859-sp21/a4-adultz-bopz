import { useState } from "react";
import "./App.css";
import { Scrollama, Step } from 'react-scrollama'
import BubbleStep from "./steps/BubbleStep";
import { IntroStep, Step1, Step2, Step2a, Step2b, Step2c, Step2d } from './steps/StorySteps';

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
        <Step data={0} key={0} style={{
                opacity: currentStepIndex === 0 ? 1 : 0.2,
              }}>
          <div className='App-step'>
            <IntroStep />
          </div>
        </Step>
        {/*
        <Step data={1} key={1}>
          <Step1 currentStepIndex={currentStepIndex} data={1}/>
        </Step> */}
        <Step data={2} key={2}>
          <div className='App-step' style={{
                opacity: currentStepIndex === 2 ? 1 : 0.2,
              }}>
            <Step2a />
          </div>
        </Step>
        <Step data={3} key={3}>
          <div className='App-step' style={{
                opacity: currentStepIndex === 3 ? 1 : 0.2,
              }}>
            <Step2b />
          </div>
        </Step>
        <Step data={4} key={4}>
          <div className='App-step' style={{
                opacity: currentStepIndex === 4 ? 1 : 0.2,
              }}>
            <Step2c />
          </div>
        </Step>
        <Step data={5} key={5}>
          <div className='App-step' style={{
                opacity: currentStepIndex === 5 ? 1 : 0.2,
              }}>
            <Step2d />
          </div>
        </Step>
        <Step data={6} key={6}>
          <div className='App-step'
            style={{
              padding: 0,
              opacity: currentStepIndex === 6 ? 1 : 0.2,
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
