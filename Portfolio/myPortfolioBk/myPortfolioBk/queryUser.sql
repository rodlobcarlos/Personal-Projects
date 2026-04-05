ALTER USER 'carlos'@'localhost' IDENTIFIED WITH mysql_native_password BY 'crldb05@rl21';
GRANT ALL PRIVILEGES ON portfoliodb.* TO 'carlos'@'localhost';
FLUSH PRIVILEGES;

create database portfoliodb;
use portfoliodb;

INSERT INTO project (title, description, tech_stack, github_url) 
VALUES (
  'Personal Portfolio', 
  'A full-stack portfolio built with Angular 19 and Spring Boot 4.', 
  'Angular, Java, MySQL', 
  'https://github.com/rodlobcarlos/myPortfolio'
);