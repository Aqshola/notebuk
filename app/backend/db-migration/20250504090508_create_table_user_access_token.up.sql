CREATE TABLE auth.user_access_token (
	id serial4 NOT NULL,
	user_id serial4 NOT NULL,
	"token" varchar NULL,
	expired_at timestamptz NULL,
	created_at timestamptz NULL,
	created_by varchar NULL,
	updated_at timestamptz NULL,
	updated_by varchar NULL,
	CONSTRAINT user_access_token_pk PRIMARY KEY (id),
	CONSTRAINT user_access_token_users_fk FOREIGN KEY (user_id) REFERENCES auth.users(id)
);