# Tuesday

The purpose of this project is to build roadmaps that prioritize tasks and goals that are often overlooked due to extreme complexities, misunderstandings, large teams, or power imbalances.

### A front end project built with:

- Javascript
- HTML
- Vue.js
- PrimeVue, PrimeFlex, PrimeIcons
- VeeValidate
- ESLint, Prettier
- Accessibility tools:
  - https://webaim.org/resources/contrastchecker/

### Code Design / Architecture

Vue.js enables a component focused framework, so I "template-ized" much of my implementation. Divided into 5 difference components, structured in the following component hierarchy:
![hierarchy_current](https://user-images.githubusercontent.com/6752256/229263806-365b96c3-0121-43b5-b427-86a50a616648.png)

### Project Challenges

- Choosing the right Javascript frameworks! Vue.js vs. Angular vs. React
- Coming from a more object-oriented background, considering how to structure projects in good web-dev practices
- How to actually build checks and balances in, vs having this become something where certain cards get ignored on other project management tools
- How to link tasks and the data structures involved
- what does an accessibility first lens look like for form heavy pages (forms are notorious for not being accessibility friendly
- Understanding slot props and how to style data without knowing much about it
- TIME! worked on this from Sunday - Thursday, so there's much more I want to add

### Things I would add/ change with more time

- Add a backend! Save and retrieve data on a secured database
- Take more advantage of vue’s component / prop functionality to share and pass data
  - Restructure the hierarachy accordingly:
    ![hierarchy_future](https://user-images.githubusercontent.com/6752256/229263813-5b345bef-1f51-48b8-bfcb-0fe65b8fcfa9.png)
- More accessibility work - download a screen reader to test ARIA specific components and fix issues accordingly
- Adding more tests + integrating a testing framework like Vitest (compatible with Vue.js)
- If the focus of this tool is accountability and centering focus areas that are typically put off, how do I prioritize that goal via the design? Little patterns/ actions add up, so how can this tool encourage and prioritize small habits + wins?
- "Bug bashing" with others
- Usability testing + talking to designers / researchers for feedback and guidance

### Resources used:

- Overall technical guidance:
  - W3Schools
  - StackOverflow
  - Codeacademy (specifically their Vue.js course)
- Vue specific
  - https://vuejs.org/guide/essentials/component-basics.html
  - https://primevue.org/configuration/
- Accessibility Resources:
  - https://a11y-101.com/development
  - https://primevue.org/accessibility/
  - https://www.w3.org/WAI/people-use-web/user-stories/
