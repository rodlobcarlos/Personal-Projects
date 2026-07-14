ALTER USER 'carlos'@'localhost' IDENTIFIED WITH mysql_native_password BY 'crldb05@rl21';
GRANT ALL PRIVILEGES ON portfoliodb.* TO 'carlos'@'localhost';
FLUSH PRIVILEGES;

create database portfoliodb;
use portfoliodb;
drop database portfoliodb;
drop table project;
create table project (
	title varchar(100),
    description varchar(500),
    tech_stack varchar(100),
    github_url varchar(500)
);

INSERT INTO project (title, description, tech_stack, github_url) 
VALUES (
  'Personal Portfolio', 
  'A full-stack portfolio built with Angular 21.2.6, Spring Boot 4 and one MySQL database to add the new information for this page. 
  This is a page that I created to present my projects and a little be about me in this IT sector.',
  'Angular, Java (Sprint Boot 17), MySQL', 
  'https://github.com/rodlobcarlos/Personal-Projects/tree/main/Portfolio'
);

UPDATE projects 
SET github_url = 'github.com/rodlobcarlos/Personal-Projects/tree/main/Portfolio' 
WHERE title = 'Personal Portfolio'

