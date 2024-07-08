<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/mason-ford/site-inspection">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-crosshair" viewBox="0 0 16 16">
      <path d="M8.5.5a.5.5 0 0 0-1 0v.518A7 7 0 0 0 1.018 7.5H.5a.5.5 0 0 0 0 1h.518A7 7 0 0 0 7.5 14.982v.518a.5.5 0 0 0 1 0v-.518A7 7 0 0 0 14.982 8.5h.518a.5.5 0 0 0 0-1h-.518A7 7 0 0 0 8.5 1.018zm-6.48 7A6 6 0 0 1 7.5 2.02v.48a.5.5 0 0 0 1 0v-.48a6 6 0 0 1 5.48 5.48h-.48a.5.5 0 0 0 0 1h.48a6 6 0 0 1-5.48 5.48v-.48a.5.5 0 0 0-1 0v.48A6 6 0 0 1 2.02 8.5h.48a.5.5 0 0 0 0-1zM8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
    </svg>
  </a>

<h3 align="center">Site Inspector</h3>

  <p align="center">
    This Site Inspection Web App is designed to facilitate telecommunications site inspections by providing a robust, customizable platform for technicians and managers. Built with Node.js, Express.js, EJS, MySQL, and Bootstrap, it enables efficient site inspections, comprehensive logging, and detailed reporting.
    <br />
    <a href="https://github.com/mason-ford/site-inspection"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="http://siteinspection.us-east-2.elasticbeanstalk.com/">View Demo</a>
    ·
    <a href="https://github.com/mason-ford/site-inspection/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/mason-ford/site-inspection/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
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
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

<ul>
  <li><b>Technician Inspections:</b> Technicians can perform site inspections with predefined checklist items, observing and evaluating each item efficiently.</li>
  <li><b>Inspection Logging:</b> All inspections are logged systematically, allowing for easy tracking and historical reference.</li>
  <li><b>Manager Overview:</b> Managers have access to an overview of all sites, with the ability to generate detailed reports on inspections and site status.</li>
  <li><b>Customizable Checklists:</b> The platform supports customizable checklist items, enabling flexibility to adapt to various inspection requirements.</li>
  <li><b>Dynamic Site Information:</b> Managers and technicians can add and manage different types of information about sites, tailoring the system to specific needs.</li>
  <li><b>Custom Task Scheduling:</b> Custom tasks can be scheduled and performed, ensuring all site-related activities are tracked and managed effectively.</li>
</ul>

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With


[![NodeJS][NodeJS]][NodeJS-url]<br>
[![Express.js][Express.js]][Express.js-url]<br>
[![EJS][EJS]][EJS-url]<br>
[![MySQL][MySQL]][MySQL-url]<br>
[![Bootstrap][Bootstrap]][Bootstrap-url]<br>

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

List of software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```
* <a href="https://dev.mysql.com/downloads/mysql/">MySQL Server</a>

### Installation
To get started with the Site Inspection Web App, follow these steps:
1. Clone the repo
   ```sh
   git clone https://github.com/your-username/site-inspection-web-app.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Set up the database:

    * Ensure you have MySQL installed and running.
    * Create a new database for the project.
    * Import the example database in database/site_inspector.sql
    * Update the database configuration in database/mysql.js with your MySQL credentials.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

* Technicians: Log in to perform inspections, fill out checklists, and submit reports.
* Managers: Log in to view site overviews, manage checklists, schedule tasks, and generate comprehensive reports.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] Secure authentication and user handling

See the [open issues](https://github.com/mason-ford/site-inspection/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Mason Ford - forddmason@gmail.com

Project Link - [https://github.com/mason-ford/site-inspection](https://github.com/mason-ford/site-inspection)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/mason-ford/site-inspection?style=for-the-badge
[contributors-url]: https://github.com/mason-ford/site-inspection/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/mason-ford/site-inspection?style=for-the-badge
[forks-url]: https://github.com/mason-ford/site-inspection/network/members
[stars-shield]: https://img.shields.io/github/stars/mason-ford/site-inspection?style=for-the-badge
[stars-url]: https://github.com/mason-ford/site-inspection/stargazers
[issues-shield]: https://img.shields.io/github/issues/mason-ford/site-inspection?style=for-the-badge
[issues-url]: https://github.com/mason-ford/site-inspection/issues
[license-shield]: https://img.shields.io/github/license/mason-ford/site-inspection?style=for-the-badge
[license-url]: https://github.com/mason-ford/site-inspection/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/mason-ford
[product-screenshot]: public/images/Screenshot.png
[Express.js]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[Express.js-url]: https://expressjs.com/
[NodeJS]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[NodeJS-url]: https://nodejs.org/
[MySQL]: https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white
[MySQL-url]: https://www.mysql.com/
[Bootstrap]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[EJS]: https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=white
[EJS-url]: https://ejs.co/

