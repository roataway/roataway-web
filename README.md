[![GitHub license](https://img.shields.io/github/license/roataway/roataway-web)](https://github.com/roataway/roataway-web/blob/main/LICENSE)
[![Developers chat](https://img.shields.io/badge/zulip-join_developer_chat-blue.svg)](https://roataway.zulipchat.com/)
![GitHub contributors](https://img.shields.io/github/contributors/roataway/roataway-web)
![Number of users](https://img.shields.io/badge/Users-%3C500K-brightgreen)

[Roataway](https://roataway.md) tracks public transport in Chișinău, Moldova's capital, a city of roughly _half a million residents_.

We are committed to open-source and transparency:
- we rely on an [open protocol](https://github.com/roataway/api-documentation)
- we don't track our users
- we don't show ads


Your contributions to this project will be seen and appreciated by those who rely on public transport to get through their day. Even small changes will have a high impact!



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
