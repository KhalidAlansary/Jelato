CREATE SCHEMA listings;

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

CREATE TABLE listings.listings_fruity PARTITION OF listings.listings
FOR VALUES IN ('fruity');

CREATE TABLE listings.listings_tropical PARTITION OF listings.listings
FOR VALUES IN ('tropical');

CREATE TABLE listings.listings_caramel PARTITION OF listings.listings
FOR VALUES IN ('caramel');

