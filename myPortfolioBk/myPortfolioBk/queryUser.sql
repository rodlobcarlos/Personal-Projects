ALTER USER 'carlos'@'localhost' IDENTIFIED WITH mysql_native_password BY 'crldb05@rl21';
GRANT ALL PRIVILEGES ON portfoliodb.* TO 'carlos'@'localhost';
FLUSH PRIVILEGES;

create database portfoliodb;
use portfoliodb
