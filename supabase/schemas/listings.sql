CREATE SCHEMA listings;

-- Expose schema
GRANT USAGE ON SCHEMA listings TO anon, authenticated, service_role;

GRANT ALL ON ALL TABLES IN SCHEMA listings TO anon, authenticated, service_role;

GRANT ALL ON ALL ROUTINES IN SCHEMA listings TO anon, authenticated, service_role;

GRANT ALL ON ALL SEQUENCES IN SCHEMA listings TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA listings GRANT ALL ON TABLES TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA listings GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA listings GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

CREATE TYPE listings.category_type AS ENUM (
    'chocolate',
    'fruity',
    'tropical',
    'caramel'
);

CREATE TABLE listings.listings (
    id serial,
    seller_id uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    title varchar(255) NOT NULL,
    description text,
    category listings.category_type NOT NULL,
    stock int NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url varchar(255),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    is_active boolean DEFAULT TRUE,
    PRIMARY KEY (id, category)
)
PARTITION BY LIST (category);

ALTER TABLE listings.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view listings" ON listings.listings
    FOR SELECT
        USING (TRUE);

CREATE POLICY "Users can create their own listings" ON listings.listings
    FOR INSERT
        WITH CHECK ((
            SELECT
                auth.uid ()) = seller_id);

CREATE POLICY "Users can update their own listings" ON listings.listings
    FOR UPDATE
        USING ((
            SELECT
                auth.uid ()) = seller_id)
            WITH CHECK ((
                SELECT
                    auth.uid ()) = seller_id);

CREATE POLICY "Users can delete their own listings" ON listings.listings
    FOR DELETE
        USING ((
            SELECT
                auth.uid ()) = seller_id);

CREATE TABLE listings.listings_chocolate PARTITION OF listings.listings
FOR VALUES IN ('chocolate');

ALTER TABLE listings.listings_chocolate ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view chocolate listings" ON listings.listings_chocolate
    FOR SELECT
        USING (TRUE);

CREATE POLICY "Users can create their own chocolate listings" ON listings.listings_chocolate
    FOR INSERT
        WITH CHECK ((
            SELECT
                auth.uid ()) = seller_id);

CREATE POLICY "Users can update their own chocolate listings" ON listings.listings_chocolate
    FOR UPDATE
        USING ((
            SELECT
                auth.uid ()) = seller_id)
            WITH CHECK ((
                SELECT
                    auth.uid ()) = seller_id);

CREATE POLICY "Users can delete their own chocolate listings" ON listings.listings_chocolate
    FOR DELETE
        USING ((
            SELECT
                auth.uid ()) = seller_id);

CREATE TABLE listings.listings_fruity PARTITION OF listings.listings
FOR VALUES IN ('fruity');

ALTER TABLE listings.listings_fruity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view fruity listings" ON listings.listings_fruity
    FOR SELECT
        USING (TRUE);

CREATE POLICY "Users can create their own fruity listings" ON listings.listings_fruity
    FOR INSERT
        WITH CHECK ((
            SELECT
                auth.uid ()) = seller_id);

CREATE POLICY "Users can update their own fruity listings" ON listings.listings_fruity
    FOR UPDATE
        USING ((
            SELECT
                auth.uid ()) = seller_id)
            WITH CHECK ((
                SELECT
                    auth.uid ()) = seller_id);

CREATE POLICY "Users can delete their own fruity listings" ON listings.listings_fruity
    FOR DELETE
        USING ((
            SELECT
                auth.uid ()) = seller_id);

CREATE TABLE listings.listings_tropical PARTITION OF listings.listings
FOR VALUES IN ('tropical');

ALTER TABLE listings.listings_tropical ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tropical listings" ON listings.listings_tropical
    FOR SELECT
        USING (TRUE);

CREATE POLICY "Users can create their own tropical listings" ON listings.listings_tropical
    FOR INSERT
        WITH CHECK ((
            SELECT
                auth.uid ()) = seller_id);

CREATE POLICY "Users can update their own tropical listings" ON listings.listings_tropical
    FOR UPDATE
        USING ((
            SELECT
                auth.uid ()) = seller_id)
            WITH CHECK ((
                SELECT
                    auth.uid ()) = seller_id);

CREATE POLICY "Users can delete their own tropical listings" ON listings.listings_tropical
    FOR DELETE
        USING ((
            SELECT
                auth.uid ()) = seller_id);

CREATE TABLE listings.listings_caramel PARTITION OF listings.listings
FOR VALUES IN ('caramel');

ALTER TABLE listings.listings_caramel ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view caramel listings" ON listings.listings_caramel
    FOR SELECT
        USING (TRUE);

CREATE POLICY "Users can create their own caramel listings" ON listings.listings_caramel
    FOR INSERT
        WITH CHECK ((
            SELECT
                auth.uid ()) = seller_id);

CREATE POLICY "Users can update their own caramel listings" ON listings.listings_caramel
    FOR UPDATE
        USING ((
            SELECT
                auth.uid ()) = seller_id)
            WITH CHECK ((
                SELECT
                    auth.uid ()) = seller_id);

CREATE POLICY "Users can delete their own caramel listings" ON listings.listings_caramel
    FOR DELETE
        USING ((
            SELECT
                auth.uid ()) = seller_id);

