CREATE TABLE roles (
	role varchar(20) NOT NULL,
	PRIMARY KEY (role)
);

INSERT INTO roles(role) VALUES ('user'), ('admin');

CREATE TABLE users (
	id serial NOT NULL,
	username varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	hash varchar(255) NOT NULL,
	date_of_birth date NOT NULL,
	profile_picture bytea,
	bio text NOT NULL,
	role varchar(20) NOT NULL DEFAULT 'user',
	PRIMARY KEY (id),
	CONSTRAINT fk_role FOREIGN KEY(role) REFERENCES roles(role)
);

CREATE TABLE follow_relationships (
	user_id int NOT NULL,
	follower_id int NOT NULL,
	date_followed timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (user_id, follower_id),
	CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
	CONSTRAINT fk_follower_id FOREIGN KEY(follower_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE circles (
	id serial NOT NULL,
	host_id int NOT NULL,
	title varchar(100) NOT NULL,
	description text NOT NULL,
	is_live boolean NOT NULL DEFAULT false,
	is_ended boolean NOT NULL DEFAULT false,
	participants_limit int DEFAULT 100,
	start_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (id),
	CONSTRAINT fk_host_id FOREIGN KEY(host_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE circles_registrations (
	user_id int NOT NULL,
	circle_id int NOT NULL,
	PRIMARY KEY (user_id, circle_id),
	CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
	CONSTRAINT fk_circle_id FOREIGN KEY(circle_id) REFERENCES circles(id) ON DELETE CASCADE
);

CREATE TABLE tags (
	tag varchar(50) PRIMARY KEY NOT NULL
);

INSERT INTO tags(tag) VALUES ('ARTS & CULTURE'),
	('COMEDY'),
	('EDUCATION'),
	('HEALTH & WELLNESS'),
	('HISTORY'),
	('LITERATURE'),
	('MUSIC'),
	('NEWS & POLITICS'),
	('PERSONAL DEVELOPMENT'),
	('SCIENCE'),
	('SOCIETY'),
	('SPORTS'),
	('TECHNOLOGY'),
	('TRUE CRIME'),
	('SPIRITUALITY & RELIGION'),
	('TRAVEL'),
	('FOOD & COOKING'),
	('GAMING'),
	('PARENTING & FAMILY');

CREATE TABLE circle_tags (
	circle_id int NOT NULL,
	tag varchar(50) NOT NULL,
	PRIMARY KEY (circle_id, tag),
	CONSTRAINT fk_circle_id FOREIGN KEY(circle_id) REFERENCES circles(id) ON DELETE CASCADE,
	CONSTRAINT fk_tag FOREIGN KEY(tag) REFERENCES tags(tag)
);

CREATE TABLE flags (
	circle_id int NOT NULL,
	flag_user_id int NOT NULL,
	flagged_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (circle_id, flag_user_id),
	CONSTRAINT fk_circle_id FOREIGN KEY(circle_id) REFERENCES circles(id) ON DELETE CASCADE,
	CONSTRAINT fk_flag_user_id FOREIGN KEY(flag_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Not used but created at the start
CREATE TABLE threads (
	id serial PRIMARY KEY NOT NULL,
	circle_id int NOT NULL,
	author_id int NOT NULL,
	title text NOT NULL,
	created_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_date timestamp,
	CONSTRAINT fk_circle_id FOREIGN KEY(circle_id) REFERENCES circles(id) ON DELETE CASCADE,
	CONSTRAINT fk_author_id FOREIGN KEY(author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE comments (
	id serial PRIMARY KEY NOT NULL,
	thread_id int,
	parent_id int,
	author_id int NOT NULL,
	comment text NOT NULL,
	created_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_date timestamp,
	CONSTRAINT fk_thread_id FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE,
	CONSTRAINT fk_parent_id FOREIGN KEY(parent_id) REFERENCES comments(id) ON DELETE CASCADE,
	CONSTRAINT fk_author_id FOREIGN KEY(author_id) REFERENCES users(id) ON DELETE CASCADE
);