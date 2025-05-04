CREATE TABLE auth.user_refresh_token (
	id serial4 NOT NULL,
	user_id serial4 NOT NULL,
	"token" varchar NULL,
	expired_at timestamptz NULL,
	user_access_token_id serial4 NOT NULL,
	created_at timestamptz NULL,
	created_by varchar NULL,
	CONSTRAINT user_refresh_token_pk PRIMARY KEY (id),
	CONSTRAINT user_refresh_token_user_access_token_fk FOREIGN KEY (user_access_token_id) REFERENCES auth.user_access_token(id),
	CONSTRAINT user_refresh_token_users_fk FOREIGN KEY (user_id) REFERENCES auth.users(id)
);