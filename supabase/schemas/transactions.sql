CREATE SCHEMA transactions;

-- Expose schema
GRANT USAGE ON SCHEMA transactions TO anon, authenticated, service_role;

GRANT ALL ON ALL TABLES IN SCHEMA transactions TO anon, authenticated, service_role;

GRANT ALL ON ALL ROUTINES IN SCHEMA transactions TO anon, authenticated, service_role;

GRANT ALL ON ALL SEQUENCES IN SCHEMA transactions TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA transactions GRANT ALL ON TABLES TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA transactions GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA transactions GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

CREATE TABLE transactions.transactions (
    id serial PRIMARY KEY,
    buyer_id uuid REFERENCES profiles (id) ON DELETE SET NULL,
    seller_id uuid REFERENCES profiles (id) ON DELETE SET NULL,
    listing_id int NOT NULL,
    listing_category listings.category_type NOT NULL,
    FOREIGN KEY (listing_id, listing_category) REFERENCES listings.listings (id, category),
    amount DECIMAL(10, 2) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE FUNCTION transactions.purchase (listing_id int, listing_category listings.category_type)
    RETURNS void
    AS $$
DECLARE
    buyer_id uuid;
    listing_seller_id uuid;
    listing_stock int;
    listing_price DECIMAL(10, 2);
BEGIN
    BEGIN
        SELECT
            auth.uid () INTO buyer_id;
        IF buyer_id IS NULL THEN
            RAISE EXCEPTION 'Buyer not found';
        END IF;
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
            AND category = listing_category;
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Listing not found';
        END IF;
        IF listing_stock <= 0 THEN
            RAISE EXCEPTION 'Listing is out of stock';
        END IF;
        -- Deduct the amount from the buyer's balance
        UPDATE
            profiles
        SET
            balance = balance - listing_price
        WHERE
            id = buyer_id;
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Buyer not found';
        END IF;
        IF (
            SELECT
                balance
            FROM
                profiles
            WHERE
                id = buyer_id) < 0 THEN
            RAISE EXCEPTION 'Insufficient balance';
        END IF;
        -- Add the amount to the seller's balance
        UPDATE
            profiles
        SET
            balance = balance + listing_price
        WHERE
            id = listing_seller_id;
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Seller not found';
        END IF;
        -- Update the stock of the listing
        UPDATE
            listings.listings
        SET
            stock = stock - 1
        WHERE
            id = listing_id
            AND category = listing_category;
        INSERT INTO transactions.transactions (buyer_id, seller_id, listing_id, listing_category, amount)
            VALUES (buyer_id, listing_seller_id, listing_id, listing_category, listing_price);
    EXCEPTION
        WHEN OTHERS THEN
            RAISE;
    END;
END;

$$
LANGUAGE plpgsql
SECURITY DEFINER;

-- Only authenticated users can execute the purchase function
REVOKE EXECUTE ON FUNCTION transactions.purchase FROM public;

REVOKE EXECUTE ON FUNCTION transactions.purchase FROM anon;

CREATE TABLE transactions.deposits (
    id serial PRIMARY KEY,
    user_id uuid REFERENCES profiles (id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE FUNCTION transactions.deposit (amount DECIMAL(10, 2))
    RETURNS DECIMAL (
        10, 2)
    LANGUAGE sql
    AS $$
    UPDATE
        profiles
    SET
        balance = balance + amount
    WHERE
        id = (
            SELECT
                auth.uid ())
    RETURNING
        balance;
$$;

----------------------------------------------------------------
------------------ REPORT FUNCTIONS ----------------------------
----------------------------------------------------------------

-- get ID , title, seller_id ,category of best selling product
-- THIS IS NOT TESTED YET
CREATE OR REPLACE FUNCTION transactions.best_selling()
--- PLEASE CHECK DATA COMPATIBILITY
    RETURNS TABLE(id INT, title VARCHAR(255), seller_id INT,category listings.category_type)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        RETURN QUERY
        SELECT
            l.id,
            l.title,
            l.seller_id,
            l.category
        FROM
            listings.listings l
        WHERE l.id=(
            SELECT 
                listing_id
            FROM
                transactions.transactions
            GROUP BY
                listing_id
            ORDER BY
                COUNT(listing_id) DESC
            -- limit changes if we want to pick more products
            LIMIT 1
        );
    END;    
$$;

----- returns id, first_name, last_name of top best selling Seller 
----- NOT TESTED YET
CREATE OR REPLACE FUNCTION transactions.Best_Selling_Seller()
    RETURNS TABLE(id INT, first_name VARCHAR(50), last_name VARCHAR(50))
    LANGUAGE plpgsql
    AS $$
    BEGIN 
        RETURN QUERY,
        SELECT 
            p.id,
            p.first_name,
            p.last_name
        FROM 
            profiles.profiles p
        WHERE
            p.id=(
                SELECT 
                    seller_id
                FROM
                    transactions.transactions
                GROUP BY
                    seller_id
                ORDER BY
                    COUNT(seller_id) DESC
                --- change limits when wanting to show more sellers
                LIMIT 1
            );    
    END;
$$

----- returns id, first_name, last_name of top most loyal buyer 
----- NOT TESTED YET
CREATE OR REPLACE FUNCTION transactions.Most_Loyal_Buyer()
    RETURNS TABLE(id INT, first_name VARCHAR(50), last_name VARCHAR(50))
    LANGUAGE plpgsql
    AS $$
    BEGIN 
        RETURN QUERY,
        SELECT 
            p.id,
            p.first_name,
            p.last_name
        FROM 
            profiles.profiles p
        WHERE
            p.id=(
                SELECT 
                    buyer_id
                FROM
                    transactions.transactions
                GROUP BY
                    buyer_id
                ORDER BY
                    COUNT(buyer_id) DESC
                --- change limits when wanting to show more sellers
                LIMIT 1
            );    
    END;
$$
