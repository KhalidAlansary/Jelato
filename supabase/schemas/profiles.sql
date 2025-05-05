CREATE TABLE profiles (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    first_name varchar(50) NOT NULL,
    last_name varchar(50) NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 0
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profiles" ON profiles
    FOR SELECT
        USING (TRUE);

CREATE POLICY "Users can update their own profiles" ON profiles
    FOR UPDATE
        USING ((
            SELECT
                auth.uid ()) = id)
            WITH CHECK ((
                SELECT
                    auth.uid ()) = id);

CREATE FUNCTION create_profile ()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
    AS $$
BEGIN
    INSERT INTO profiles (id, first_name, last_name)
        VALUES (NEW.id, NEW.raw_user_meta_data ->> 'firstName', NEW.raw_user_meta_data ->> 'lastName');
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE PROCEDURE create_profile ();

