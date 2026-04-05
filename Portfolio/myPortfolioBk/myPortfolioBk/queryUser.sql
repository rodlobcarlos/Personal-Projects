ALTER USER 'carlos'@'localhost' IDENTIFIED WITH mysql_native_password BY 'crldb05@rl21';
GRANT ALL PRIVILEGES ON portfoliodb.* TO 'carlos'@'localhost';
FLUSH PRIVILEGES;

create database portfoliodb;
use portfoliodb;
drop database portfoliodb;

INSERT INTO project (title, description, tech_stack, github_url) 
VALUES (
  'Personal Portfolio', 
  'Full-stack portfolio built with Angular 19 and Spring Boot 4, here you can see my profile in this sector and the code of the website you are navegating now with all the information I used for build this site.', 
  'Angular, Java, MySQL', 
  'github.com/rodlobcarlos/Personal-Projects/tree/main/Portfolio'
);

UPDATE projects 
SET github_url = 'github.com/rodlobcarlos/Personal-Projects/tree/main/Portfolio' 
WHERE title = 'Personal Portfolio';