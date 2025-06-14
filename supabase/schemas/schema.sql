-- =========================
-- 1. Profiles Schema
-- =========================
CREATE TABLE IF NOT EXISTS profiles (
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

CREATE OR REPLACE FUNCTION create_profile ()
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

-- =========================
-- 2. Listings Schema
-- =========================
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

CREATE TABLE IF NOT EXISTS listings.listings (
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

CREATE TABLE IF NOT EXISTS listings.listings_chocolate PARTITION OF listings.listings
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

CREATE TABLE IF NOT EXISTS listings.listings_fruity PARTITION OF listings.listings
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

CREATE TABLE IF NOT EXISTS listings.listings_tropical PARTITION OF listings.listings
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

CREATE TABLE IF NOT EXISTS listings.listings_caramel PARTITION OF listings.listings
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

-- =========================
-- 3. Transactions Schema
-- =========================
CREATE SCHEMA transactions;

-- Expose schema
GRANT USAGE ON SCHEMA transactions TO anon, authenticated, service_role;

GRANT ALL ON ALL TABLES IN SCHEMA transactions TO anon, authenticated, service_role;

GRANT ALL ON ALL ROUTINES IN SCHEMA transactions TO anon, authenticated, service_role;

GRANT ALL ON ALL SEQUENCES IN SCHEMA transactions TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA transactions GRANT ALL ON TABLES TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA transactions GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA transactions GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS transactions.transactions (
    id serial PRIMARY KEY,
    buyer_id uuid REFERENCES profiles (id) ON DELETE SET NULL,
    seller_id uuid REFERENCES profiles (id) ON DELETE SET NULL,
    listing_id int NOT NULL,
    listing_category listings.category_type NOT NULL,
    FOREIGN KEY (listing_id, listing_category) REFERENCES listings.listings (id, category),
    amount DECIMAL(10, 2) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE transactions.transactions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION transactions.purchase (listing_id int, listing_category listings.category_type)
    RETURNS void
    AS $$
DECLARE
    buyer_id uuid;
    listing_seller_id uuid;
    listing_stock int;
    listing_price DECIMAL(10, 2);
    buyer_balance DECIMAL(10, 2);
BEGIN
    -- Get current user as buyer
    SELECT
        auth.uid () INTO buyer_id;
    IF buyer_id IS NULL THEN
        RAISE EXCEPTION 'Buyer not found';
    END IF;
    -- Lock the listing row for update to prevent concurrent modifications
    SELECT
        seller_id,
        stock,
        price INTO listing_seller_id,
        listing_stock,
        listing_price
    FROM
        listings.listings
    WHERE
        id = listing_id
        AND category = listing_category
    FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Listing not found';
    END IF;
    IF listing_stock <= 0 THEN
        RAISE EXCEPTION 'Listing is out of stock';
    END IF;
    -- Lock the buyer's profile row for update
    SELECT
        balance INTO buyer_balance
    FROM
        profiles
    WHERE
        id = buyer_id
    FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Buyer not found (profile)';
    END IF;
    IF buyer_balance < listing_price THEN
        RAISE EXCEPTION 'Insufficient balance';
    END IF;
    -- Raise an exception if buyer and seller are the same
    IF listing_seller_id = buyer_id THEN
        RAISE EXCEPTION 'Buyer and seller cannot be the same user';
    END IF;
    -- Lock the seller's profile row for update
    PERFORM
        1
    FROM
        profiles
    WHERE
        id = listing_seller_id
    FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Seller not found (profile)';
    END IF;
    -- Deduct from buyer's balance
    UPDATE
        profiles
    SET
        balance = balance - listing_price
    WHERE
        id = buyer_id;
    -- Add to seller's balance
    UPDATE
        profiles
    SET
        balance = balance + listing_price
    WHERE
        id = listing_seller_id;
    -- Decrement listing stock
    UPDATE
        listings.listings
    SET
        stock = stock - 1
    WHERE
        id = listing_id
        AND category = listing_category;
    -- Insert transaction record
    INSERT INTO transactions.transactions (buyer_id, seller_id, listing_id, listing_category, amount)
        VALUES (buyer_id, listing_seller_id, listing_id, listing_category, listing_price);
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

-- Only authenticated users can execute the purchase function
REVOKE EXECUTE ON FUNCTION transactions.purchase FROM public;

REVOKE EXECUTE ON FUNCTION transactions.purchase FROM anon;

CREATE TABLE IF NOT EXISTS transactions.deposits (
    id serial PRIMARY KEY,
    user_id uuid REFERENCES profiles (id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE transactions.deposits ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION transactions.deposit (amount DECIMAL(10, 2))
    RETURNS DECIMAL (
        10, 2)
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
DECLARE
    new_balance DECIMAL(10, 2);
    current_id uuid := auth.uid ();
BEGIN
    UPDATE
        profiles
    SET
        balance = balance + amount
    WHERE
        id = current_id
    RETURNING
        balance INTO new_balance;
    -- update deposits table
    INSERT INTO transactions.deposits (user_id, amount)
        VALUES (current_id, amount);
    RETURN new_balance;
END;
$$;

----------------------------------------------------------------
------------------ REPORT FUNCTIONS ----------------------------
----------------------------------------------------------------
-- get ID , title, seller_id ,category of best selling product
CREATE OR REPLACE FUNCTION transactions.best_selling ()
-- Returns information about the best-selling listing
    RETURNS TABLE (
        id int,
        title varchar(255),
        seller_id uuid,
        category listings.category_type,
        sales_count bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        l.id,
        l.title,
        l.seller_id,
        l.category,
        top_sales.sales_count
    FROM
        listings.listings l
        JOIN (
            SELECT
                listing_id,
                COUNT(*) AS sales_count
            FROM
                transactions.transactions
            GROUP BY
                listing_id
            ORDER BY
                COUNT(*) DESC
            LIMIT 1) AS top_sales ON l.id = top_sales.listing_id;
    -- Log if no results found
    IF NOT FOUND THEN
        RAISE NOTICE 'No transactions or listings found';
    END IF;
END;
$$;

----- returns id, first_name, last_name of top best selling Seller
CREATE OR REPLACE FUNCTION transactions.Best_Selling_Seller ()
    RETURNS TABLE (
        id uuid,
        first_name varchar(50),
        last_name varchar(50),
        sales_count bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.first_name,
        p.last_name,
        top_seller_user.sales_count
    FROM
        public.profiles p
        JOIN (
            SELECT
                seller_id,
                COUNT(seller_id) AS sales_count
            FROM
                transactions.transactions
            GROUP BY
                seller_id
            ORDER BY
                COUNT(seller_id) DESC
                --- change limits when wanting to show more sellers
            LIMIT 1) AS top_seller_user ON p.id = top_seller_user.seller_id;
END;
$$;

----- returns id, first_name, last_name of top most loyal buyer
CREATE OR REPLACE FUNCTION transactions.Most_Loyal_Buyer ()
    RETURNS TABLE (
        id uuid,
        first_name varchar(50),
        last_name varchar(50),
        sales_count bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.first_name,
        p.last_name,
        best_buyer.sales_count
    FROM
        public.profiles p
        JOIN (
            SELECT
                buyer_id,
                COUNT(buyer_id) AS sales_count
            FROM
                transactions.transactions
            GROUP BY
                buyer_id
            ORDER BY
                COUNT(buyer_id) DESC
                --- change limits when wanting to show more sellers
            LIMIT 1) AS best_buyer ON p.id = best_buyer.buyer_id;
END;
$$;

---------------------------------------------------------------
----------------------- Per_User_Reports ----------------------
-----------------Description; handles fovourite flavors,
-- ---------------------------recent activity, recent transactions
-------------------------------------------------------------------
--------------------------------------------------------------
---------- RECENT TRANNSACTIONS ------------------------------
------------ pass user id and get his recent transactions -------
CREATE OR REPLACE FUNCTION transactions.Recent_Transactions ()
    RETURNS TABLE (
        transaction_type text,
        transaction_amount DECIMAL(10, 2),
        transaction_date timestamp,
        -- can be null if transaction is Deposit
        product_name varchar(255))
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
DECLARE
    current_id uuid := auth.uid ();
BEGIN
    RETURN QUERY
    -- DESC: Query Bought & Sold Products by User
    SELECT
        CASE
        -- purchase by USER, leads to a deduction in his account balance
        WHEN t.buyer_id = current_ID THEN
            'purchase'
            -- sold by User, leads to an addition to his acc balance
        WHEN t.seller_id = current_ID THEN
            'sold'
        END AS transaction_type,
        t.amount,
        t.created_at,
        l.title AS product_name
    FROM
        transactions.transactions t
        JOIN listings.listings l ON t.listing_id = l.id
    WHERE
        t.buyer_id = current_ID
        OR t.seller_id = current_ID
    UNION
    -- New Deposits by USER
    SELECT
        'Depositted' AS activity_type,
        d.amount,
        d.created_at,
        NULL AS product_name
    FROM
        transactions.deposits d
    WHERE
        d.user_id = current_ID
    ORDER BY
        created_at DESC
        --  can be changed to show more
    LIMIT 5;
END;
$$;

------------------------------------------------------
----------- RECENT ACTIVITY --------------------------
CREATE OR REPLACE FUNCTION transactions.Recent_Activity ()
    RETURNS TABLE (
        activity_type text,
        activity_amount DECIMAL(10, 2),
        activity_date timestamp,
        -- can be null if activity is Deposit
        product_name varchar(255))
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
DECLARE
    current_id uuid := auth.uid ();
BEGIN
    RETURN QUERY
    -- Recently Bought Products by User
    SELECT
        -- purchase by USER, leads to a deduction in his account balance
        'purchase' AS activity_type,
        t.amount,
        t.created_at,
        l.title AS product_name
    FROM
        transactions.transactions t
        JOIN listings.listings l ON t.listing_id = l.id
    WHERE
        t.buyer_id = current_id
    UNION
    -- New Listings By User
    SELECT
        'Added Listing' AS activity_type,
        l.price,
        l.created_at,
        l.title AS product_name
    FROM
        listings.listings l
    WHERE
        l.seller_id = current_id
    UNION
    -- New Deposits by USER
    SELECT
        'Deposit' AS activity_type,
        d.amount,
        d.created_at,
        NULL AS product_name
    FROM
        transactions.deposits d
    WHERE
        d.user_id = current_id
    ORDER BY
        created_at DESC
    LIMIT 5;
END;
$$;

---------------------------------------------------------------------
------------ Favourite Flavors ---------------------------------------
---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION transactions.fovourite_flavours ()
    RETURNS TABLE (
        product_name varchar(255),
        product_description text,
        product_category listings.category_type)
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
DECLARE
    current_id uuid := auth.uid ();
BEGIN
    RETURN QUERY
    -- Most bought products by user
    SELECT
        l.title,
        l.description,
        l.category
    FROM
        transactions.transactions t
        JOIN listings.listings l ON t.listing_id = l.id
    WHERE
        t.buyer_id = current_id
    GROUP BY
        t.buyer_id,
        l.title,
        l.description,
        l.category
    ORDER BY
        COUNT(t.buyer_id) DESC
        -- Only return top 2 flavors
    LIMIT 2;
END;
$$;

