## Project technical Specs:

https://docs.google.com/document/d/1ZRcK2oT0tjEoZTflqmBYfup_mU4T2AtcgVjzHt8GWcI/edit?usp=sharing

## UI Mockup:

https://www.figma.com/design/DJVc6auQF59KlRWR7FTcFo/Untitled?node-id=0-1&p=f&t=gyFySFNH71zDmGk5-0

## Code Style Guidelines

This project uses **Prettier** and **ESLint** to enforce code style and best practices. All contributors should follow the guidelines below:

### Style Guide

- JavaScript: [Airbnb JavaScript Style Guide](https://airbnb.io/javascript/)
- React: [Airbnb React Style Guide](https://airbnb.io/javascript/react/)

### Setting Up Code Style Tools

1. Install the following VSCode extensions:
   - [Prettier - Code Formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
   - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
2. Enable auto-formatting in VSCode:
   - Go to `File → Preferences → Settings`.
   - Enable `Editor: Format On Save`.
3. Install dependencies:

   ```bash
   npm install

   ```

To view our cloud deployed site: https://proud-mud-0b66be61e.6.azurestaticapps.net

## Sprint Boards

Project 1: https://github.com/users/muskasaid02/projects/2
Project 2: https://github.com/users/muskasaid02/projects/8
Project 3: https://github.com/users/muskasaid02/projects/10
Project 4: https://github.com/users/muskasaid02/projects/11
Project 5: https://github.com/users/muskasaid02/projects/12
Project 6: https://github.com/users/muskasaid02/projects/13
Project 7: https://github.com/users/muskasaid02/projects/14
Project 8: https://github.com/users/muskasaid02/projects/15

## Testing methods

Corresponding Acceptance Criteria spec can be found in backend/backend-tests/api and cypress/e2e

### Backend and API Testing

Once you're in the backend directory of the project, run

```bash
npm test
```
Jest is currently set to ignore backend/backend_tests/api, but associated acceptance criteria are available at backend_tests/api

### End-to-End Automated Testing

In the root of the project, ensure you have Cypress installed(if needed) with

```bash
npm install cypress --save-dev
```

And fully set up. Visit [text](https://docs.cypress.io/app/get-started/why-cypress) to learn more.

Now, run

```bash
npx cypress open
```

and select your desired browser -> E2E Testing -> click on each of the different specs to test different scenarios.

Acceptance criteria documents are in cypress/e2e
