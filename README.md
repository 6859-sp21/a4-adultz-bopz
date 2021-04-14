# [Adultz Bops](https://6859-sp21.github.io/a4-adultz-bopz/)
6.859 Interactive Data Visualization

Team Members: Shannen Wu ([shannen@mit.edu](shannen@mit.edu)), Jessica Yin ([yinj@mit.edu](yinj@mit.edu)), Nico Salinas ([nsalinas@mit.edu](nsalinas@mit.edu))

Dataset URL: https://github.com/the-pudding/data/tree/master/kidz-bop

# How to Deploy
1. Push any and all changes to main
2. Run `npm run deploy`
3. Check Deployed Site URL: https://6859-sp21.github.io/a4-adultz-bopz/



# Reflection

### Data Transformation
For our data transformation, we decided to create a nested data structure using the columns in our data table and D3's group() function. This allows us to group table entries by an artist, then by a bad word, then by a song until we reach our actual data points. Not only does this help us with our visualization, but it also allows us to understand how specific artists have their music censored.


## Design Decisions
We used a bubble visualization (inspired by [Bubble Chart template](https://observablehq.com/@d3/bubble-chart)). We used a **size encoding channel** to represnet how many songs by a certain artist were altered or censored in the Kidz Bop music. 

- dropdown search bar
- side menu
- lyric comparison
  

## Interaction and Animations
- hover artist name animation
- zoom feature
- updating side menu
- scrolly telling (?)

## Development Process
For the most part of the assignment, all three of us worked collaboratively together during 90-minute work sessions (4 in total for A4). 

Nico: I worked on setting up the GitHub repository and deployed site on GitHub pages. I started by working on transforming our data table into a nested data structure using `d3.group()` API. This helped us when we needed to introduce a hierarchical data structure for the bubble visualizaiton. I also helped with creating a lyric popup to compare the original lyric with the Kidz Bop lyric. After the MVP, I also helped on updating our data structure to include raw HTML to designate which words in a lyric were censored in the original lyric, and what they were altered to in the Kidz Bop lyric. 




# Appendix

## Hierarchy of Data Structure:
- Level 0: Root
- Level 1: Artist
- Level 2: Bad word
- Level 3: Song