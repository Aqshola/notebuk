CREATE TABLE auth.users (
	id serial4 NOT NULL,
	email varchar NOT NULL,
	name varchar NULL,
	"password" varchar NULL,
	created_at timestamptz NULL,
	created_by varchar NULL,
	updated_at timestamptz NULL,
	updated_by varchar NULL,
	CONSTRAINT users_pk PRIMARY KEY (id),
	CONSTRAINT users_unique UNIQUE (email)
);