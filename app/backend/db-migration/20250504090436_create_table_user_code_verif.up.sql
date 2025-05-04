CREATE TABLE auth.user_code_verif (
	id serial4 NOT NULL,
	user_id int4  NOT NULL,
	code varchar(6) NULL,
	expired_at timestamptz NULL,
	created_at timestamptz NULL,
	created_by varchar NULL,
	update_at timestamptz NULL,
	updated_by varchar NULL,
	CONSTRAINT user_code_verif_pk PRIMARY KEY (id),
	CONSTRAINT user_code_verif_users_fk FOREIGN KEY (user_id) REFERENCES auth.users(id)
);