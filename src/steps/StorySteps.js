import "./StorySteps.css";
import Demo0 from "../gifs/demo0.gif";
import Demo1 from "../gifs/demo1.gif";
import Demo2 from "../gifs/demo2.gif";
import Demo3 from "../gifs/demo3.gif";

export const IntroStep = () => (
  <div className="IntroStep">
    <div className="header">Adultz Bopz</div>
    <div className="desc">
      An interactive data visualization tool to understand how Kidz Bop alters
      or censors pop music for kids.
    </div>
  </div>
);

export const Step1 = () => (
  <div style={{ marginLeft: "15vw", textAlign: "left" }}>
    <h2 className="header">Not to burst your bubble, but ...</h2>
  </div>
);

export const Step2 = () => (
  <div style={{ margin: "0 15vw", textAlign: "left" }}>
    <h2 className="header">How It Works</h2>
    <p className="Step2-p">
      All the songs by a certain artist are grouped together in a bubble with a
      label of their name. For smaller artists, you can hover over their bubble
      to see which artist it is.
    </p>
    <p className="Step2-p">
      Clicking on an artists bubble takes you inside to show all the songs by a
      certain artist grouped by their altered or censored word.
    </p>
    <p className="Step2-p">
      Clicking on an word bubble all the songs from that artist with the bad
      word you clicked.
    </p>
    <p className="Step2-p">
      You can click on each song to reveal the original and Kids Bop lyrics.
    </p>
  </div>
);

export const Step2a = () => (
  <>
    <h2 className="Step2-p">
      All the songs by a certain artist are grouped together in a bubble with a
      label of their name. For smaller artists, you can hover over their bubble
      to see which artist it is.
    </h2>
    <img class="center-image" src={Demo0} />
  </>
);

export const Step2b = () => (
  <>
    <h2 className="Step2-p">
      Clicking on an artists bubble takes you inside to show all the songs by a
      certain artist grouped by their altered or censored word.
    </h2>
    <img class="center-image" src={Demo1} />
  </>
);

export const Step2c = () => (
  <>
    <h2 className="Step2-p">
      Clicking on an word bubble shows all the songs from that artist with the
      censored word you clicked.
    </h2>
    <img class="center-image" src={Demo2} />
  </>
);

export const Step2d = () => (
  <>
    <h2 className="Step2-p">
      You can click on each song to reveal the original and Kids Bop lyrics.
    </h2>
    <img class="center-image" src={Demo3} />
  </>
);
