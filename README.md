[![GitHub license](https://img.shields.io/github/license/roataway/roataway-web)](https://github.com/roataway/roataway-web/blob/main/LICENSE)
[![Developers chat](https://img.shields.io/badge/zulip-join_developer_chat-blue.svg)](https://roataway.zulipchat.com/)
![GitHub contributors](https://img.shields.io/github/contributors/roataway/roataway-web)
![Number of users](https://img.shields.io/badge/users-%3C500K-brightgreen)

## [Roataway](https://roataway.md) tracks public transport in Chișinău, Moldova's capital, a city of roughly _half a million residents_.

- we rely on an [open protocol](https://github.com/roataway/api-documentation)
- we don't track our users
- we don't show ads

## Why contribute?
- Your work is in the spotlight - public transport is used hundreds of thousands of times per day.
- Sustainability - public transport is critical infrastructure, your code can potentially serve society many years into the future.
- Low-hanging fruits - there are plenty of [beginner-friendly feature requests](https://github.com/roataway/roataway-web/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22), at this stage even small changes have a tremendous impact.
- Our team has experienced software engineers - we'll help you sharpen your skills.
- Unmatched bragging rights - this will impress potential employers, your friends and even your enemies!



## How to contribute

Make sure you have `git`, `node` and `npm` installed:

1. Clone the git repo and switch into the freshly checked out directory
```shell
git clone git@github.com:roataway/roataway-web.git
cd roataway-web
git submodule init
git submodule update
```

2. `npm install` - to install all the dependencies
3. Build or start app
  - `npm start` - to run the app in the development mode on http://localhost:3000
  - `npm run build` - Builds the app for production in the `build` folder.
