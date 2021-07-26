# Nirvana - Custom Take-home Project

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

This is the solution to the "Custom Take-home Project" for Nirvana.

The project details are not included.

### Built With

The project was built using vanilla Node.JS to keep it as simple as possible. The only external library used is [`node-fetch`](https://www.npmjs.com/package/node-fetch).

All the dependencies included in the project are used to build or test the project.

<!-- GETTING STARTED -->
## Getting Started

You can the run the source code directly, using an `npm` script, or build the project
and run it with `node`.

### From Source

Install all dependencies:

```sh
npm install
```

Run the `cli` task:

```sh
npm run cli
```

### From build

Install all dependencies:

```sh
npm install
```

Run the `build-all` task:

```sh
npm run build-all
```

This will create a directory called `dist` with two sub-directories:

1. `dist/esbuild`
2. `dist/tsc`

The first one has a minified version of the API, while the second one just
has the JavaScript code compiled from TypeScript source. You can reun either
version to start the API:

```sh
# Minified version
node dist/esbuild/cli.js

# Compiled version
node dist/tsc/cli.js
```

<!-- USAGE EXAMPLES -->
## Usage

To configure the API you have to set up the following environment variables:

|**Name**|**Default**|**Description**|
|----------|:-------------:|------:|
|`PORT`|`3000`|Port where the server will listen for requests.|
|`EXTERNAL_APIS`|`null`|List of external APIs separated by a comma (`,`).|

For example:

```sh
export PORT=3000
export EXTERNAL_APIS=https://api1.com,https://api2.com,https://api3.com
npm run cli
```

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->
## Contact

Your Name - [@guzmonne](https://twitter.com/guzmonne) - email@example.com

Project Link: [https://github.com/guzmonne/nirvana](https://github.com/guzmonne/nirvana)

<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements

* [Typescript](https://www.typescriptlang.org/)
* [Node Fetch](https://www.npmjs.com/package/node-fetch)
* [Jest](https://jestjs.io/)
* [Supertest](https://www.npmjs.com/package/supertest)
* [Nock](https://github.com/nock/nock)
* [Img Shields](https://shields.io)
* [Choose an Open Source License](https://choosealicense.com)
* [GitHub Pages](https://pages.github.com)
* [Best README Template](https://raw.githubusercontent.com/othneildrew/Best-README-Template)


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/guzmonne/nirvana.svg?style=for-the-badge
[contributors-url]: https://github.com/guzmonne/nirvana/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/guzmonne/nirvana.svg?style=for-the-badge
[forks-url]: https://github.com/guzmonne/nirvana/network/members
[stars-shield]: https://img.shields.io/github/stars/guzmonne/nirvana.svg?style=for-the-badge
[stars-url]: https://github.com/guzmonne/nirvana/stargazers
[issues-shield]: https://img.shields.io/github/issues/guzmonne/nirvana.svg?style=for-the-badge
[issues-url]: https://github.com/guzmonne/nirvana/issues
[license-shield]: https://img.shields.io/github/license/guzmonne/nirvana.svg?style=for-the-badge
[license-url]: https://github.com/guzmonne/nirvana/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/ing-gmonne
[product-screenshot]: images/screenshot.png