# [Adultz Bops](https://6859-sp21.github.io/a4-adultz-bopz/)

6.859 Interactive Data Visualization Spring 2021

Team Members: Shannen Wu ([shannen@mit.edu](shannen@mit.edu)), Jessica Yin ([yinj@mit.edu](yinj@mit.edu)), Nico Salinas ([nsalinas@mit.edu](nsalinas@mit.edu))

Data Set URL: https://github.com/the-pudding/data/tree/master/kidz-bop

# How to Deploy

1. Push any and all changes to main
2. Run `npm run deploy`
3. Check Deployed Site URL: https://6859-sp21.github.io/a4-adultz-bopz/

# Reflection

### Data Transformation

For our data transformation, we decided to create a nested data structure using the columns in our data table and D3's group() function. This allows us to group table entries by an artist, then by a bad word, then by a song until we reach our actual data points. Not only does this help us with our visualization, but it also allows us to understand how specific artists have their music censored.

## Design Decisions

**Encoding Channels**

We used a bubble visualization (inspired by [Bubble Chart template](https://observablehq.com/@d3/bubble-chart)). We used a **size encoding channel** to represent how many songs by a certain artist were altered or censored in the Kidz Bop music. We also used different color schemes for each level of our visualization, and included hover and shadow effects to each bubble. A subtle change we included is to have color of each bubble outline reflect the size of it. This prevents each layer from looking monotone, while also making it easier to distiguish between bubble sizes.

**Dropdown Search Bar**

We decided to add a dropdown search bar to enable users to quickly find their artist of choice. It would be extremely time-consuming if the user were to hover over every single bubble to select an artist. It is positioned in an easy-to-find place, right above the bubble visualization, so that users can type or click on it right away if needed.

**Side Menu**

We decided to add the side menu to show what level of the visualization the user is in after receiving feedback on our MVP. Without the side menu, users would click into bubbles and not know how many more layers there were. With the side menu label, it'll display artist, song name, and the word, which will live update as the user explores the visualization.

**Lyric Comparison**

Once we got down to a low enough level of our bubble visualization, we want to show as much detail about the data in a pop-up. The popup has the original lyric on the left side with the bad word or phrase highlighted in magenta. On the right side of the popup, we included the Kidz Bop lyric, and we highlighted in green what the lyric was changed to (if it wasn't cut from the song in the first place).


## Interaction and Animations

**Hover Effects on Bubbles**

Because some of the bubbles in our visualization are too small to fit the name of the artist, we decided to show a tool tip over the artist's bubble with their name. 

We also decided to add a on-hover glow effect to each bubble to make exploring the visualization more inviting and playful.

**Zoom In and Out of Bubbles**

When you click on an artist's bubble, the visualization will automatically zoom in and focus on the bubble, while hiding any other bubbles. Each time you click on a bubble will cause you to go down the visualization one level at a time. We included a keydown event listener such that when you click the Escape button, the focus and zoom brings you one level up.

**Updating Side Menu** 

Exploring the bubbles and popup visualization will update the menu on the left. It will display the artist name, song name, and the word depending on how deep into the visualization you are.

**Scrolly Telling**

Our visualization starts out with a scroll story that informs users how to use the visualization most efficiently. When you scroll over each section, the opacity with change from 0.2 to 1, and when you exit a section, the opacity goes down to 0.2.

## Development Process

For the most part of the assignment, all three of us worked collaboratively together during 90-minute work sessions (4 in total for A4).

Nico: I worked on setting up the GitHub repository and deployed site on GitHub pages. I started by working on transforming our data table into a nested data structure using `d3.group()` API. This helped us when we needed to introduce a hierarchical data structure for the bubble visualizaiton. I also helped with creating a lyric popup to compare the original lyric with the Kidz Bop lyric. After the MVP, I also helped on updating our data structure to include raw HTML to designate which words in a lyric were censored in the original lyric, and what they were altered to in the Kidz Bop lyric.

Shannen: I worked on setting up the React code and general file and folder structure. I did some of the rudimentary data transforming in the beginning as well. I also did a lot of styling and design for the overall visualization and the scrolly-telling part, adding in a walkthrough and tutorial for each section. I also worked on the artist dropdown to pipe data through to the Bubbles component.

Jessica: I first worked on styling the bubble chart template by choosing a color scheme and adding a on-hover glow to each bubble component. I then created the artist name tooltip for each bubble that shows on hover if the bubble is too small to show the name. I also worked on improving user navigation in the visualization through pressing the ESC key. I also helped with the lyric popup by stlying how altered lyrics are highlighted. I also added the side menu that shows which layer the user is on in the visualization.

# Appendix

## Hierarchy of Data Structure:

- Level 0: Root
- Level 1: Artist
- Level 2: Bad word
- Level 3: Song
