CREATE TABLE auth.user_code_verif (
	id serial4 NOT NULL,
	user_id int4 NULL,
	expired_at timestamptz NULL,
	created_at timestamptz NULL,
	created_by varchar NULL,
	CONSTRAINT user_code_verif_users_fk FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE ON UPDATE CASCADE
);